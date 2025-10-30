# 🏗️ ARCHITECTURE SERVICE MISE EN RELATION UNIVERSEL

## 🎯 Vision

**Plateforme de mise en relation IA universelle** permettant de connecter des clients avec des prestataires dans tous les secteurs d'activité.

**Modèle économique :** Commission sur chaque mise en relation réussie (affiliation).

---

## 📊 Architecture Base de Données

### Tables Principales

#### 1. **services**
Définit les secteurs d'activité disponibles sur la plateforme.

**Champs clés :**
- `slug` : Identifiant unique (ex: 'photovoltaique', 'plomberie')
- `name` : Nom affiché
- `category` : Catégorie (energie, batiment, juridique, etc.)
- `commissionType` : 'fixed' (montant fixe) ou 'percentage' (pourcentage)
- `commissionValue` : Valeur de la commission
- `customFields` : Champs personnalisés du formulaire (JSON)

**Exemple :**
```json
{
  "slug": "photovoltaique",
  "name": "Installation Photovoltaïque",
  "category": "energie",
  "commissionType": "percentage",
  "commissionValue": "6.00",
  "commissionMin": "330.00",
  "commissionMax": "900.00"
}
```

#### 2. **providers**
Prestataires multi-secteurs inscrits sur la plateforme.

**Champs clés :**
- `userId` : Lien avec compte utilisateur
- `companyName` : Nom entreprise
- `siret` : SIRET
- `serviceIds` : Liste des services proposés (JSON array)
- `interventionDepartments` : Départements d'intervention
- `status` : 'pending', 'active', 'suspended', 'rejected'
- `leadsReceived` / `leadsConverted` : Statistiques

**Exemple :**
```json
{
  "companyName": "Solar Pro",
  "serviceIds": [1, 3],  // PV + Électricité
  "interventionDepartments": ["13", "84", "06"],
  "status": "active"
}
```

#### 3. **leads**
Demandes clients universelles.

**Champs clés :**
- `serviceId` : Service concerné
- `clientFirstName` / `clientLastName` / `clientEmail` / `clientPhone`
- `clientCity` / `clientPostalCode` : Localisation
- `serviceData` : Données spécifiques au service (JSON flexible)
- `estimatedAmount` : Montant estimé du projet
- `commissionAmount` : Commission calculée
- `status` : 'pending', 'available', 'reserved', 'accepted', 'paid', 'completed'
- `reservedBy` : ID prestataire qui a réservé
- `reservedUntil` : Date fin réservation (48h)

**Exemple serviceData (PV) :**
```json
{
  "power": 6,
  "orientation": "Sud",
  "surface": 50,
  "monthlyBill": 150,
  "annualProduction": 10200,
  "hasShading": false
}
```

#### 4. **leadReservations**
Historique des réservations (48h exclusivité).

**Champs clés :**
- `leadId` / `providerId`
- `reservedAt` / `expiresAt`
- `isActive` : true si réservation en cours
- `converted` : true si converti en vente

#### 5. **commissions**
Paiements affiliation.

**Champs clés :**
- `leadId` / `providerId` / `serviceId`
- `amount` : Montant commission
- `paymentMethod` : 'stripe', 'paypal', 'virement'
- `paymentIntentId` : Stripe payment_intent_id
- `status` : 'pending', 'processing', 'paid', 'failed', 'refunded'
- `quoteUrl` : URL devis signé uploadé
- `adminValidated` : Validation manuelle admin

#### 6. **leadHistory**
Traçabilité complète des changements de statut.

---

## 🔌 API Routes

### Public (sans authentification)

#### `leads.listServices`
Liste tous les services actifs.

**Retour :**
```json
[
  {
    "id": 1,
    "slug": "photovoltaique",
    "name": "Installation Photovoltaïque",
    "category": "energie",
    "icon": "☀️",
    "commissionType": "percentage",
    "commissionValue": "6.00"
  }
]
```

#### `leads.getService`
Obtient un service par slug.

**Input :**
```json
{ "slug": "photovoltaique" }
```

#### `leads.createLead`
Crée un lead (formulaire client).

**Input :**
```json
{
  "serviceId": 1,
  "clientFirstName": "Marc",
  "clientLastName": "Djedir",
  "clientEmail": "marc@example.com",
  "clientPhone": "0612345678",
  "clientCity": "Marseille",
  "clientPostalCode": "13001",
  "serviceData": {
    "power": 6,
    "orientation": "Sud",
    "surface": 50
  },
  "estimatedAmount": "11500.00",
  "commissionAmount": "690.00",
  "acceptedTerms": true,
  "acceptedContact": true
}
```

### Protected (authentification requise)

#### `leads.listAvailableLeads`
Liste des leads disponibles (marketplace prestataires).

**Input :**
```json
{
  "serviceIds": [1, 3],  // Filtrer par services
  "postalCodes": ["13", "84"],  // Filtrer par zone
  "limit": 20,
  "offset": 0
}
```

#### `leads.reserveLead`
Réserver un lead (48h exclusivité).

**Input :**
```json
{ "leadId": 123 }
```

**Retour :**
```json
{
  "success": true,
  "expiresAt": "2025-11-02T10:00:00Z"
}
```

#### `leads.cancelReservation`
Annuler une réservation.

**Input :**
```json
{
  "leadId": 123,
  "reason": "Client injoignable"
}
```

#### `leads.createCommission`
Créer une commission (après devis signé).

**Input :**
```json
{
  "leadId": 123,
  "quoteUrl": "https://storage.com/devis-signe.pdf"
}
```

#### `leads.myLeads`
Lister mes leads (dashboard prestataire).

**Input :**
```json
{
  "status": "reserved",  // Optionnel
  "limit": 20,
  "offset": 0
}
```

---

## 🔄 Workflow Complet

### 1. **Client utilise calculateur PV**
- Résultats : 6 kWc, 11,500€, ROI 4.7 ans
- Bouton "J'accepte ce prix - Recevoir un devis"

### 2. **Client remplit formulaire pré-commande**
```
POST /api/trpc/leads.createLead
→ Lead créé (status: 'pending')
→ Lead devient 'available' sur marketplace
```

### 3. **Prestataire voit lead sur marketplace**
```
GET /api/trpc/leads.listAvailableLeads
→ Liste leads disponibles dans sa zone
```

### 4. **Prestataire réserve lead**
```
POST /api/trpc/leads.reserveLead
→ Lead status: 'reserved'
→ Coordonnées client dévoilées
→ Réservation 48h
```

### 5. **Prestataire contacte client**
- Visite technique
- Présente devis conforme au prix

### 6. **Client signe devis**
```
POST /api/trpc/leads.createCommission
→ Commission créée (status: 'pending')
→ Lead status: 'accepted'
```

### 7. **Prestataire paie commission**
```
Stripe payment
→ Commission status: 'paid'
→ Lead status: 'paid'
```

### 8. **Travaux réalisés**
```
→ Lead status: 'completed'
```

---

## 🎨 Frontend Components (à créer)

### Client

1. **Formulaire pré-commande** (`/calculateur` → Modal)
   - Coordonnées client
   - Acceptation prix
   - Consentements

2. **Page confirmation** (`/lead-created`)
   - Message succès
   - Prochaines étapes
   - Délai contact

### Prestataire

1. **Marketplace leads** (`/marketplace`)
   - Liste leads disponibles
   - Filtres (service, zone)
   - Bouton "Réserver"

2. **Dashboard leads** (`/mes-leads`)
   - Leads réservés
   - Leads convertis
   - Statistiques

3. **Détail lead** (`/lead/:id`)
   - Coordonnées client
   - Données projet
   - Upload devis signé
   - Paiement commission

### Admin

1. **Validation prestataires** (`/admin/providers`)
   - Liste prestataires pending
   - Vérification SIRET, RGE
   - Approuver/Rejeter

2. **Validation commissions** (`/admin/commissions`)
   - Liste commissions pending
   - Vérifier devis signé
   - Valider paiement

---

## 🚀 Extensibilité

### Ajouter un nouveau service

1. **Créer service en BDD :**
```sql
INSERT INTO services (slug, name, category, commissionType, commissionValue, customFields)
VALUES ('menuiserie', 'Menuiserie', 'batiment', 'fixed', '100.00', '[...]');
```

2. **Créer module métier :**
```
/server/modules/menuiserie/
  ├── calculator.ts  (si calculateur nécessaire)
  ├── form-fields.ts (champs personnalisés)
  └── validation.ts  (règles métier)
```

3. **Intégrer dans IA :**
```typescript
// server/ai/config.ts
SERVICES_PROMPTS.menuiserie = `
Vous êtes expert en menuiserie...
`;
```

4. **C'est tout !** Le reste est automatique (API, marketplace, paiements).

---

## 💰 Modèle Économique

### Commissions par secteur

| Service | Type | Montant | Exemple |
|---------|------|---------|---------|
| Photovoltaïque | Pourcentage | 6% | 3kWc=330€, 6kWc=690€, 9kWc=900€ |
| Plomberie | Fixe | 50€ | Toute intervention |
| Électricité | Fixe | 80€ | Toute intervention |
| Avocat | Fixe | 150€ | Consultation |
| Architecte | Fixe | 200€ | Projet |

### Projection revenus

**Scénario conservateur (mois 6) :**
- PV : 50 leads × 690€ = 34,500€
- Plomberie : 200 leads × 50€ = 10,000€
- Électricité : 100 leads × 80€ = 8,000€
- Avocat : 30 leads × 150€ = 4,500€
- Architecte : 20 leads × 200€ = 4,000€

**Total : 61,000€/mois** 🚀

**Scénario croissance (an 2) :**
- PV : 200 leads × 690€ = 138,000€
- Autres : 500 leads × 80€ moy = 40,000€

**Total : 178,000€/mois** 💰💰💰

---

## 🔐 Sécurité

### Validation prestataires
- Vérification SIRET (API INSEE)
- Vérification RGE (pour PV)
- Validation manuelle admin

### Protection données clients
- Coordonnées masquées tant que lead non réservé
- Chiffrement données sensibles
- RGPD compliant

### Paiements sécurisés
- Stripe Connect
- Validation admin avant déblocage
- Remboursement si litige

---

## 📈 Prochaines Étapes

### Phase 1 : MVP (actuel)
- [x] Base données universelle
- [x] API CRUD complète
- [x] 5 services initiaux
- [ ] Formulaire pré-commande client
- [ ] Marketplace prestataires
- [ ] Paiement Stripe

### Phase 2 : Croissance
- [ ] Notifications push (PWA)
- [ ] App mobile (React Native)
- [ ] Dashboard analytics
- [ ] Système notation prestataires

### Phase 3 : Scale
- [ ] 20+ services
- [ ] Expansion géographique
- [ ] API publique (white-label)
- [ ] Marketplace B2B

---

## 🎯 Différenciation Concurrentielle

### vs Marketplace classiques (HelloArtisan, Quotatis)
- ✅ **IA intégrée** : Calculs automatiques, conseils personnalisés
- ✅ **Multi-secteurs** : Un seul compte pour tous besoins
- ✅ **Prix transparents** : Pas de négociation
- ✅ **Commission 60% moins chère** : 6% vs 15%

### vs Agents commerciaux
- ✅ **Pas de salaire fixe** : Paiement au résultat
- ✅ **Scalabilité infinie** : Application 24/7
- ✅ **Leads qualifiés** : Client déjà engagé sur prix

### vs Annuaires (Pages Jaunes)
- ✅ **Mise en relation active** : Pas juste un listing
- ✅ **Qualification automatique** : IA filtre et qualifie
- ✅ **Suivi complet** : Du lead au paiement

---

**🚀 Cette architecture permet de créer le "Uber de la mise en relation professionnelle" !**

