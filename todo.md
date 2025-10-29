# 📋 TODO - UNIALIST - Plan de développement professionnel

## 🎯 Vision
**UNIALIST** - Votre assistance universelle qui incarne : **Indépendance, Confiance, Sécurité, Justesse, Apprentissage, Enrichissement, Bonification**

**Positionnement unique :** "L'IA qui vous éclaire et vous élève - pas qui vous robotise"

**Cible prioritaire :** **Chefs d'entreprise & Encadrement** (Module "Business Pro")

**Principe de développement :** **ZÉRO compromis sur la qualité - Chaque fonctionnalité doit être PARFAITE**

---

## 🎨 Identité visuelle ✅ FINALISÉE

### Nom et branding
- **Nom :** UNIALIST ✅
- **Domaines réservés :** unialist.fr, unialist.com, etc. ✅
- **Signification :** Universal Assistance + List (organisation)

### Palette de couleurs
- **Bleu** (#1e40af) : Confiance, professionnalisme, tech
- **Jaune** (#fbbf24) : Énergie, optimisme, lumière
- **Vert pastel** (#86efac) : Croissance, sérénité, nature

### Logo
- **Design :** Visage de profil avec cerveau visible, sourcil jaune, rayons de lumière
- **Symbolique :** Intelligence transparente + Vision éclairée + Être éclairé
- **Fichiers :** logo.png, favicon.png ✅

---

## 💰 Modèle économique

### Tarification
- **Essai gratuit :** 14 jours (accès complet, sans CB)
- **Abonnement mensuel :** 29.99€/mois (Business Pro)
- **Blocage automatique** en cas de non-paiement
- **Réactivation instantanée** après paiement

### Formules
- **Starter** (9.99€/mois) : Fonctionnalités de base
- **Business Pro** (29.99€/mois) : Toutes fonctionnalités + support prioritaire ⭐
- **Enterprise** (sur mesure) : Solutions personnalisées

---

## 🏗️ PHASE 1 : FONDATIONS SOLIDES (Semaine 1-2) - EN COURS

### Objectif : Infrastructure béton, fiabilité 99.9%, zéro perte de données

### 1.1 Infrastructure technique
- [x] Projet web initialisé
- [x] Base de données PostgreSQL
- [x] Authentification utilisateur
- [x] **Système de backups automatiques** (toutes les heures)
- [x] **Transactions ACID** (garantie intégrité données)
- [ ] **Réplication base de données** (failover automatique - nécessite infrastructure cloud)
- [ ] **Tests de charge** (support 10,000 utilisateurs simultanés)

### 1.2 Sécurité maximale
- [x] Authentification OAuth
- [x] **Chiffrement bout en bout** (données au repos + transit)
- [x] **Logs d'audit complets** (toutes actions tracées)
- [x] **Conformité RGPD** (consentement, export, suppression)
- [ ] **Authentification multi-facteurs** (2FA - à implémenter côté frontend)
- [ ] **Audit sécurité** (scan vulnérabilités - à faire avant production)

### 1.3 Monitoring et alertes
- [x] **Système de monitoring** (uptime, performance, erreurs)
- [x] **Alertes automatiques** (email/SMS si problème)
- [x] **Détection anomalies** (comportements suspects)
- [ ] **Dashboard admin** (métriques temps réel - interface à créer)
- [ ] **Rollback automatique** (si erreur critique détectée - à implémenter)

### 1.4 Tests automatisés
- [ ] **Framework de tests** (Jest + Playwright)
- [ ] **Tests unitaires** (chaque fonction testée)
- [ ] **Tests d'intégration** (scénarios complets)
- [ ] **Tests de charge** (performance sous stress)
- [ ] **CI/CD** (déploiement automatique si tests OK)

### 1.5 Documentation technique
- [x] **Architecture système** documentée (dans le code)
- [ ] **API documentation** (endpoints, paramètres - à générer)
- [ ] **Guide déploiement** (procédures - à rédiger)
- [ ] **Runbook incidents** (que faire si problème - à rédiger)

### 1.6 Système de Gestion des Testeurs Beta
**Objectif :** Permettre invitations, suivi et gestion des testeurs Alpha/Beta

**Base de données :**
- [x] **Table beta_invitations** (invitations, codes, statuts, expirations)
- [x] **Table user_permissions** (permissions granulaires par utilisateur)
- [x] **Table beta_feedback** (bugs, suggestions, témoignages)
- [x] **Table beta_activity** (tracking sessions, actions, engagement)
- [x] **Table beta_rewards** (points, badges, récompenses)

**API Backend :**
- [x] **POST /api/beta/invite** (créer invitation)
- [x] **GET /api/beta/invitations** (liste invitations)
- [x] **POST /api/beta/accept/:code** (accepter invitation)
- [x] **DELETE /api/beta/revoke/:id** (révoquer accès)
- [x] **POST /api/beta/feedback** (soumettre feedback)
- [x] **GET /api/beta/analytics** (métriques testeurs)
- [x] **Middleware requireBetaAccess** (vérification permissions)

**Interface Admin :**
- [ ] **Page Admin Testeurs** (/admin/beta-testers)
- [ ] **Formulaire invitation** (email, tier, permissions, expiration)
- [ ] **Liste testeurs** (filtres, recherche, statuts)
- [ ] **Détails testeur** (activité, feedback, statistiques)
- [ ] **Dashboard analytics** (métriques globales, graphiques)
- [ ] **Gestion permissions** (activer/désactiver features par testeur)

**Emails automatiques :**
- [ ] **Template invitation Beta** (avec code unique)
- [ ] **Email de bienvenue** (après inscription)
- [ ] **Rappel invitation** (si non acceptée après 3 jours)
- [ ] **Email récompense** (badge/points débloqués)
- [ ] **Demande feedback** (questionnaire mensuel)

**Système de points et récompenses :**
- [ ] **Calcul points automatique** (signup, sessions, feedback, bugs)
- [ ] **Badges** (Bronze, Silver, Gold, Platinum)
- [ ] **Tableau de bord testeur** (profil, points, récompenses)
- [ ] **Système de parrainage** (codes d'invitation personnels)

**Sécurité et tracking :**
- [x] **Génération codes sécurisés** (BETA-XXXX-XXXX-XXXX)
- [x] **Expiration automatique** (invitations et accès)
- [x] **Logs d'activité** (toutes actions testeurs)
- [ ] **Rate limiting** (anti-abus invitations - à implémenter)
- [x] **Anonymisation données** (RGPD compliant)

**Tests :**
- [ ] **Tests unitaires** (API invitations)
- [ ] **Tests d'intégration** (workflow complet invitation → acceptation)
- [ ] **Tests permissions** (vérification accès features)
- [ ] **Tests emails** (envoi et templates)

---

## 💼 PHASE 2 : MODULE BUSINESS PRO - Fonctionnalités Core (Semaine 3-12)

### Principe : UNE fonctionnalité à la fois, développée à 100%, testée intensivement, validée en conditions réelles

---

### 🔒 PRIORITÉ 1 : Fiabilité données (VITAL)

#### Fonctionnalité 1 : Sauvegarde automatique conversations
**Objectif :** ZÉRO perte de données, jamais

- [ ] **Sauvegarde temps réel** (<100ms par message)
- [ ] **Queue de messages** (si connexion perdue)
- [ ] **Synchronisation multi-appareils** (temps réel)
- [ ] **Versioning** (historique modifications)
- [ ] **Export données** (backup utilisateur)

**Tests requis :**
- [ ] Test perte connexion (message sauvegardé quand même)
- [ ] Test crash serveur (données récupérables)
- [ ] Test fermeture app (rien perdu)
- [ ] Test charge (1000 messages/seconde)
- [ ] **Résultat attendu : 99.999% fiabilité**

---

### 💰 PRIORITÉ 2 : Fonctionnalités business essentielles

#### Fonctionnalité 2 : Génération factures professionnelles
**Objectif :** Factures parfaites, conformes légalement, ZÉRO erreur

**Spécifications :**
- [ ] **Tous champs obligatoires** (SIRET, TVA, adresses, etc.)
- [ ] **Calculs exacts** (montants HT/TTC, TVA, remises)
- [ ] **Numérotation séquentielle** (jamais de doublon)
- [ ] **Format PDF conforme** (lisible, imprimable, archivable)
- [ ] **Mentions légales** (selon statut juridique)
- [ ] **Multi-devises** (EUR, USD, etc.)
- [ ] **Templates personnalisables** (logo, couleurs, mise en page)

**Fonctionnalités avancées :**
- [ ] **Génération automatique** (depuis conversation IA)
- [ ] **Devis → Facture** (conversion en 1 clic)
- [ ] **Factures récurrentes** (abonnements)
- [ ] **Acomptes et avoirs** (gestion complète)
- [ ] **Export comptable** (FEC, CSV pour logiciels compta)
- [ ] **Archivage légal** (10 ans, conforme)

**Tests requis :**
- [ ] Test 1000 factures (toutes conformes)
- [ ] Validation expert-comptable
- [ ] Test cas limites (montants négatifs, remises 100%, etc.)
- [ ] Test export comptable (import dans logiciels)
- [ ] **Résultat attendu : 100% conformité légale**

---

#### Fonctionnalité 3 : Rappels obligations fiscales et sociales
**Objectif :** JAMAIS manquer une échéance

**Base de données obligations :**
- [ ] **Calendrier fiscal** (TVA, IS, CFE, etc.)
- [ ] **Calendrier social** (URSSAF, retraite, prévoyance)
- [ ] **Obligations sectorielles** (selon activité)
- [ ] **Mise à jour automatique** (changements législatifs)

**Système de rappels :**
- [ ] **Rappels multiples** (J-7, J-3, J-1, Jour J)
- [ ] **Multi-canal** (app, email, SMS, notification push)
- [ ] **Personnalisation** (horaires préférés)
- [ ] **Accusé réception** (confirmation lecture)
- [ ] **Escalade** (relance si pas de réponse)

**Fonctionnalités avancées :**
- [ ] **Préparation documents** (listes à fournir)
- [ ] **Calculs automatiques** (montants à déclarer)
- [ ] **Pré-remplissage formulaires** (si possible)
- [ ] **Historique déclarations** (archivage)

**Tests requis :**
- [ ] Simulation 1 an complet (aucune échéance manquée)
- [ ] Test changement législatif (détection et intégration)
- [ ] Test utilisateur absent (rappels envoyés quand même)
- [ ] **Résultat attendu : 0 oubli**

---

#### Fonctionnalité 4 : Relances clients automatiques (recouvrement)
**Objectif :** Récupérer l'argent dû, professionnellement

**Détection automatique :**
- [ ] **Scan factures impayées** (quotidien)
- [ ] **Calcul retards** (jours de retard)
- [ ] **Priorisation** (montants, ancienneté)
- [ ] **Historique paiements** (bons/mauvais payeurs)

**Relances progressives :**
- [ ] **Relance 1** (J+7) : Cordiale, rappel amical
- [ ] **Relance 2** (J+15) : Ferme, demande paiement
- [ ] **Relance 3** (J+30) : Formelle, mise en demeure
- [ ] **Relance 4** (J+45) : Juridique, menace procédure

**Personnalisation :**
- [ ] **Templates emails** (ton adapté)
- [ ] **Règles par client** (délais spécifiques)
- [ ] **Stop automatique** (si paiement reçu)
- [ ] **Lettres recommandées** (génération PDF)

**Suivi et reporting :**
- [ ] **Dashboard impayés** (vue d'ensemble)
- [ ] **Taux recouvrement** (statistiques)
- [ ] **Prévisions trésorerie** (impact impayés)

**Tests requis :**
- [ ] Test 100 factures impayées (toutes relancées)
- [ ] Test paiement entre relances (stop automatique)
- [ ] Test ton emails (validation utilisateur)
- [ ] Mesure taux recouvrement (vs manuel)
- [ ] **Résultat attendu : +30% recouvrement**

---

### 📅 PRIORITÉ 3 : Productivité quotidienne

#### Fonctionnalité 5 : Agenda intelligent vocal
**Objectif :** Gérer son agenda en parlant, zéro friction

- [ ] **Création RDV vocale** ("Bloque jeudi 14h avec M. Dupont")
- [ ] **Modification vocale** ("Décale le RDV de demain à vendredi")
- [ ] **Rappels intelligents** (avant RDV, avec infos contextuelles)
- [ ] **Optimisation planning** (suggestions créneaux)
- [ ] **Synchronisation calendriers** (Google, Outlook)
- [ ] **Préparation RDV** (documents, infos client, trajet)

**Tests requis :**
- [ ] Test reconnaissance vocale (95% précision)
- [ ] Test cas ambigus ("jeudi prochain" = quel jeudi ?)
- [ ] Test conflits (2 RDV même heure)
- [ ] **Résultat attendu : Création RDV en <30 secondes**

---

#### Fonctionnalité 6 : Gestion emails intelligente
**Objectif :** Traiter emails 10x plus vite

- [ ] **Tri automatique** (important/spam/newsletters)
- [ ] **Réponses suggérées** (IA génère brouillons)
- [ ] **Suivi automatique** (relance si pas de réponse)
- [ ] **Extraction infos** (RDV, tâches, factures)
- [ ] **Templates emails** (réponses types)

**Tests requis :**
- [ ] Test précision tri (>90%)
- [ ] Test qualité réponses (validation utilisateur)
- [ ] **Résultat attendu : -50% temps emails**

---

#### Fonctionnalité 7 : Suivi trésorerie temps réel
**Objectif :** Savoir où on en est financièrement, toujours

- [ ] **Solde bancaire** (synchronisation quotidienne)
- [ ] **Prévisions 30/60/90 jours** (factures à venir)
- [ ] **Alertes trésorerie** (si risque découvert)
- [ ] **Catégorisation dépenses** (automatique)
- [ ] **Rapports mensuels** (P&L simplifié)

**Tests requis :**
- [ ] Test synchronisation bancaire (API)
- [ ] Test précision prévisions (vs réalité)
- [ ] **Résultat attendu : Visibilité trésorerie claire**

---

#### Fonctionnalité 8 : Veille concurrentielle automatique
**Objectif :** Rester informé sans effort

- [ ] **Monitoring concurrents** (prix, offres, actualités)
- [ ] **Alertes changements** (baisse prix, nouvelle offre)
- [ ] **Analyse tendances** (marché, secteur)
- [ ] **Suggestions actions** (réagir aux mouvements)

**Tests requis :**
- [ ] Test détection changements (précision)
- [ ] Test pertinence alertes (pas de spam)
- [ ] **Résultat attendu : Veille efficace sans y penser**

---

#### Fonctionnalité 9 : Gestion équipe (si applicable)
**Objectif :** Coordonner l'équipe facilement

- [ ] **Tâches et projets** (attribution, suivi)
- [ ] **Reporting automatique** (avancement projets)
- [ ] **Communication centralisée** (messages, notifications)
- [ ] **Permissions granulaires** (qui voit quoi)

**Tests requis :**
- [ ] Test multi-utilisateurs (5-10 personnes)
- [ ] Test permissions (sécurité)
- [ ] **Résultat attendu : Coordination fluide**

---

#### Fonctionnalité 10 : Suggestions business proactives
**Objectif :** L'IA qui aide à prendre de meilleures décisions

- [ ] **Analyse données** (CA, marges, tendances)
- [ ] **Détection opportunités** (clients à relancer, produits à pousser)
- [ ] **Alertes risques** (clients qui partent, baisse activité)
- [ ] **Suggestions optimisation** (réduire coûts, augmenter CA)

**Tests requis :**
- [ ] Test pertinence suggestions (validation utilisateur)
- [ ] Mesure impact (CA, marges)
- [ ] **Résultat attendu : Décisions data-driven**

---

## 🔐 PHASE 3 : Système de permissions avancé (Semaine 13-14)

### Interface de gestion des permissions ✅ COMPLÉTÉ
- [x] Page vue d'ensemble (toggles par catégorie)
- [x] Page configuration détaillée (3 niveaux)
- [x] Page journal d'activité (timeline + filtres)
- [x] Navigation fluide
- [x] Bouton accès depuis interface principale

### Backend permissions (À FAIRE)
- [ ] **Sauvegarde préférences** (base de données)
- [ ] **Application permissions** (respect choix utilisateur)
- [ ] **Validation actions** (demande confirmation si requis)
- [ ] **Logs actions** (traçabilité complète)
- [ ] **Révocation instantanée** (stop immédiat)

---

## 📊 PHASE 4 : Métriques et amélioration continue (Semaine 15-16)

### Métriques techniques
- [ ] **Uptime monitoring** (objectif : 99.9%)
- [ ] **Performance monitoring** (temps réponse <500ms)
- [ ] **Error tracking** (taux erreur <0.1%)
- [ ] **Usage analytics** (fonctionnalités utilisées)

### Métriques business
- [ ] **Temps gagné/jour** (mesure réelle)
- [ ] **Taux satisfaction** (NPS >50)
- [ ] **Taux rétention** (>95%)
- [ ] **ROI utilisateur** (10x minimum)

### Amélioration continue
- [ ] **A/B testing** (optimisation UX)
- [ ] **Feedback utilisateurs** (collecte systématique)
- [ ] **Roadmap produit** (priorisation features)
- [ ] **Itérations rapides** (release hebdomadaire)

---

## 🚀 PHASE 5 : Déploiement et marketing (Semaine 17-20)

### Déploiement production
- [ ] **Migration Vercel** (depuis Manus)
- [ ] **Configuration domaine** (unialist.fr)
- [ ] **SSL automatique** (HTTPS)
- [ ] **CDN global** (performance mondiale)
- [ ] **Monitoring production** (alertes 24/7)

### Marketing et acquisition
- [ ] **Landing page optimisée** (conversion >5%)
- [ ] **SEO** (référencement Google)
- [ ] **Vidéos démo** (TikTok, Instagram, YouTube)
- [ ] **Campagnes pub** (Google Ads, Facebook Ads)
- [ ] **Affiliation** (programme influenceurs)
- [ ] **Partenariats** (experts-comptables, CCI)

### Support et documentation
- [ ] **Base de connaissances** (FAQ, guides)
- [ ] **Tutoriels vidéo** (onboarding)
- [ ] **Support chat** (réponse <1h)
- [ ] **Communauté** (forum utilisateurs)

---

## 📱 PHASE 6 : Extensions futures (Mois 5-12)

### Autres modules métiers
- [ ] Module Famille/Ménagère
- [ ] Module Mécanicien
- [ ] Module Artisan
- [ ] Module Silver Care (surveillance personnes âgées)
- [ ] Module Développeur
- [ ] Module Marketeur
- [ ] Module Étudiant
- [ ] Module Professions libérales

### Fonctionnalités avancées
- [ ] Voice (commandes vocales)
- [ ] Vision (analyse photos/documents)
- [ ] Apprentissage web temps réel
- [ ] Intégrations tierces (Autodis, etc.)
- [ ] API publique (développeurs)

### Multi-plateformes
- [ ] App mobile iOS
- [ ] App mobile Android
- [ ] App desktop Windows
- [ ] App desktop Mac
- [ ] App desktop Linux
- [ ] Extension navigateur

---

## 📈 OBJECTIFS CHIFFRÉS (6 mois)

### Utilisateurs
- Mois 1 : 100 utilisateurs (beta testeurs)
- Mois 3 : 500 utilisateurs (early adopters)
- Mois 6 : 2,000 utilisateurs (croissance)

### Revenus
- Mois 1 : 300€ (10 payants × 30€)
- Mois 3 : 15,000€ (500 payants × 30€)
- Mois 6 : 60,000€ (2,000 payants × 30€)

### Qualité
- Uptime : 99.9%
- NPS : >50
- Churn : <5%/mois
- Support : <1h réponse

---

## 🎯 PRINCIPES DE DÉVELOPPEMENT

### Qualité avant quantité
- ✅ Chaque fonctionnalité développée à 100%
- ✅ Tests intensifs avant déploiement
- ✅ Validation utilisateur en conditions réelles
- ✅ Zéro compromis sur la fiabilité

### Itération rapide
- ✅ Releases hebdomadaires
- ✅ Feedback utilisateurs intégré
- ✅ Amélioration continue
- ✅ Pivot si nécessaire

### Focus utilisateur
- ✅ Résoudre de vrais problèmes
- ✅ Créer de la valeur mesurable
- ✅ Simplicité d'utilisation
- ✅ Support réactif

---

**Dernière mise à jour :** 28 octobre 2025
**Statut :** Phase 1 en cours (Fondations solides)




---

## 🎯 PROTOTYPE DÉMONTRABLE - 3 PROFILS EXÉCUTABLES (PRIORITÉ ABSOLUE)

### Objectif : Convaincre investisseurs avec démo fonctionnelle (2-3 heures)

### Intégration IA Multi-Providers
- [ ] Installer `ai` package (Vercel AI SDK)
- [ ] Installer `@ai-sdk/openai` (GPT-4o-mini)
- [ ] Installer `@ai-sdk/mistral` (Mistral Small backup)
- [ ] Créer `/server/ai/config.ts` (configuration providers)
- [ ] Créer `/server/api/chat.ts` (endpoint streaming)
- [ ] Implémenter routage intelligent (selon profil utilisateur)
- [ ] Gestion erreurs et fallback automatique
- [ ] Rate limiting (100 msg/h par utilisateur)

### PROFIL 1 : Compagnon Solitude 💙
**Objectif : Démontrer empathie et impact social**

**Backend :**
- [ ] System prompt empathique (écoute active, questions ouvertes)
- [ ] Détection mots-clés détresse (tristesse, solitude, dépression)
- [ ] Suggestions activités (selon localisation, météo, intérêts)
- [ ] Historique conversations (mémoire contexte)
- [ ] Alertes si signaux graves (contact ressources)

**Frontend :**
- [ ] Interface dédiée (couleurs apaisantes : bleu pastel, vert doux)
- [ ] Avatar chaleureux
- [ ] Animations douces (transitions fluides)
- [ ] Bouton "J'ai besoin d'aide" (accès rapide ressources)
- [ ] Historique conversations visible

**Démo Investisseurs (2 min) :**
- Scénario : "Je me sens seul aujourd'hui, personne ne m'appelle"
- Réponse IA : Empathie + Questions + Suggestions concrètes
- **Impact : Investisseurs VOIENT l'utilité sociale**

### PROFIL 2 : Compagnon Professionnel 💼
**Objectif : Démontrer ROI mesurable (temps + argent économisés)**

**Backend :**
- [ ] System prompt business (efficace, précis, professionnel)
- [ ] Génération factures (extraction infos depuis conversation)
- [ ] Template facture PDF (conforme légal)
- [ ] Calculs automatiques (HT, TVA, TTC, remises)
- [ ] Numérotation séquentielle (FACT-2025-001)
- [ ] Export PDF (téléchargement immédiat)

**Frontend :**
- [ ] Interface business (couleurs pro : bleu foncé, gris)
- [ ] Chronomètre ROI (démarrage automatique)
- [ ] Affichage économies temps réel ("Économisé : 14.5 min = 12€")
- [ ] Bouton "Générer facture" (raccourci)
- [ ] Prévisualisation facture (avant export)
- [ ] Historique factures (liste, recherche)

**Démo Investisseurs (3 min) :**
- Scénario : "Génère facture pour Jean Dupont, 1,500€ HT, installation photovoltaïque 3kWc"
- Chronomètre : Démarre
- IA : Génère facture complète en 30 secondes
- Chronomètre : Stop → "Économie : 14.5 min vs manuel (15 min) = 12€"
- Export PDF : Téléchargement immédiat
- **Impact : Investisseurs VOIENT le ROI immédiat**

### PROFIL 3 : Compagnon Expert Artisan 🏗️
**Objectif : Démontrer expertise unique (25 ans photovoltaïque)**

**Backend :**
- [ ] System prompt expertise photovoltaïque (15 facettes)
- [ ] Base connaissances (panneaux, onduleurs, batteries, aides)
- [ ] Génération devis automatique (calculs techniques)
- [ ] Calculs rentabilité (ROI, économies, autofinancement)
- [ ] Recherche aides (MaPrimeRénov', CEE, TVA réduite)
- [ ] Template devis PDF professionnel
- [ ] Export PDF (avec schémas, photos)

**Frontend :**
- [ ] Interface métier (couleurs : orange, jaune, gris foncé)
- [ ] Formulaire guidé (questions intelligentes)
- [ ] Visualisation calculs (graphiques rentabilité)
- [ ] Carte aides disponibles (montants, conditions)
- [ ] Prévisualisation devis (avant export)
- [ ] Bibliothèque matériel (panneaux, onduleurs)

**Démo Investisseurs (5 min) :**
- Scénario : "Devis installation 6kWc, maison 150m², toiture sud, client Marseille"
- IA : Questions guidées (surface toit, orientation, budget, etc.)
- Calculs automatiques :
  - Puissance optimale : 6.3 kWc
  - Production annuelle : 9,450 kWh
  - Économies : 1,890€/an
  - ROI : 8.5 ans
  - Aides : MaPrimeRénov' 2,520€ + CEE 1,200€ = 3,720€
  - Prix final : 12,000€ - 3,720€ = 8,280€
- Génération devis PDF en 5 minutes
- **Impact : Investisseurs VOIENT l'expertise impossible à copier**

### Interface Vocale (Speech-to-Text + Text-to-Speech)
- [ ] Installer `react-speech-recognition` (STT)
- [ ] Installer `react-speech-kit` (TTS)
- [ ] Bouton micro dans chat (design élégant)
- [ ] Animation visualisation audio (ondes sonores)
- [ ] Transcription temps réel (affichage texte)
- [ ] Lecture automatique réponses (voix naturelle)
- [ ] Sélection voix (masculine/féminine, langues)
- [ ] Contrôles lecture (pause, stop, vitesse)

### Sélecteur Profils (Interface Principale)
- [ ] Page sélection profil (3 grandes cartes)
- [ ] Design cartes (icône, titre, description, couleur)
- [ ] Animation hover (effet 3D)
- [ ] Stockage profil actif (localStorage + DB)
- [ ] Switch profil dynamique (sans rechargement)
- [ ] Personnalisation UI (couleurs, avatar selon profil)
- [ ] Badge profil actif (visible en permanence)

### Démonstration ROI (Métriques Temps Réel)
- [ ] Chronomètre tâches (démarrage/arrêt automatique)
- [ ] Calcul économies (temps × taux horaire configurable)
- [ ] Affichage ROI en temps réel (pendant conversation)
- [ ] Statistiques cumulées (jour, semaine, mois)
- [ ] Dashboard ROI (graphiques, comparaisons)
- [ ] Export rapport ROI (PDF pour comptabilité)

### Tests & Validation
- [ ] Test conversation Compagnon Solitude (empathie, pertinence)
- [ ] Test génération facture (conformité légale, calculs exacts)
- [ ] Test génération devis photovoltaïque (précision technique)
- [ ] Test interface vocale (reconnaissance 95%+)
- [ ] Test switch profils (fluidité, personnalisation)
- [ ] Test chronomètre ROI (précision, affichage)
- [ ] Validation expert-comptable (factures)
- [ ] Validation artisan photovoltaïque (devis)

### Documentation Démo
- [ ] Script démo investisseurs (5 min chrono)
- [ ] Vidéo screencast (3 profils en action)
- [ ] FAQ anticipée (questions investisseurs)
- [ ] Pitch deck mis à jour (avec captures écran)




---

## 🔥 EN COURS - Prototype Démontrable (2h)

### Base de données
- [x] Ajouter colonne `profileType` à table `conversations`
- [x] Ajouter colonne `profileType` à table `users`

### System Prompts Profils
- [x] Modifier invokeLLM pour accepter profileType
- [x] Intégrer SYSTEM_PROMPTS depuis ai/config.ts

### Interface Sélection Profil
- [x] Page `/profile-selection` (3 grandes cartes)
- [x] Stockage profil actif (DB + localStorage)
- [x] Redirection automatique si pas de profil

### Génération Factures (Professionnel)
- [ ] Détection demande facture dans message
- [ ] Extraction infos (client, montant, description)
- [ ] Template facture PDF
- [ ] Bouton téléchargement

### Génération Devis (Artisan)
- [ ] Détection demande devis photovoltaïque
- [ ] Questions guidées (localisation, surface, etc.)
- [ ] Calculs automatiques (ROI, aides)
- [ ] Template devis PDF

### Interface Vocale
- [ ] Bouton micro (Speech-to-Text)
- [ ] Lecture automatique réponses (Text-to-Speech)
- [ ] Animation visualisation audio

