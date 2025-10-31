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
- [x] Détection demande facture dans message
- [x] Extraction infos (client, montant, description)
- [x] Composant InvoiceCard (affichage structuré)
- [x] Bouton copie presse-papier
- [x] Export CSV
- [x] Chronomètre ROI (temps économisé)
- [x] 2 options (gratuit/payant 1.50€)
- [x] Rappel réglementaire PDP

### Génération Devis (Artisan)
- [x] Détection demande devis photovoltaïque
- [x] Questions guidées (localisation, surface, orientation, consommation)
- [x] Calculs automatiques (ROI, aides MaPrimeRénov'/CEE/TVA)
- [x] Composant QuoteCard (affichage structuré professionnel)
- [x] Bouton copie presse-papier
- [x] Export PDF (prévu)
- [x] Chronomètre ROI (2h économisées = 100€)
- [x] Expertise 25 ans intégrée (calculs précis)

### Interface Vocale
- [x] Bouton micro (Speech-to-Text)
- [x] Transcription en temps réel
- [x] Lecture automatique réponses (Text-to-Speech)
- [x] Bouton activation/désactivation lecture auto
- [x] Résumés intelligents (factures/devis)
- [x] Limitation 500 caractères (confort écoute)
- [x] Animation bouton micro (pulsation)
- [x] Gestion permissions microphone
- [x] Support français natif
- [ ] Animation visualisation audio




---

## 🔮 ROADMAP POST-LEVÉE DE FONDS

### Intégration Facturation Électronique (PDP)
**Objectif :** Conformité réglementation 2025 + Automatisation complète

**Phase 1 : Intégration Chorus Pro (Gratuit)**
- [ ] Inscription Chorus Pro (plateforme publique)
- [ ] Intégration API Chorus Pro
- [ ] Génération factures Factur-X (PDF + XML)
- [ ] Envoi automatique via Chorus Pro
- [ ] Suivi statut (envoyée, reçue, rejetée)

**Phase 2 : Intégrations PDP Privées (Payantes mais meilleures)**
- [ ] Intégration Pennylane API (moderne, facile)
- [ ] Intégration Sellsy API (bon rapport qualité/prix)
- [ ] Intégration Sage API (grandes entreprises)
- [ ] Sélecteur PDP (utilisateur choisit sa plateforme)

**Phase 3 : Fonctionnalités Avancées**
- [ ] Suivi paiements temps réel
- [ ] Relances automatiques (J+7, J+15, J+30)
- [ ] Détection impayés (alertes)
- [ ] Génération lettres de relance
- [ ] Mise en demeure automatique (J+45)
- [ ] Export comptable (FEC, CSV)

**Coûts estimés :**
- Développement : 50k€ (3-6 mois, 2 devs)
- API PDP : 0.50€ - 2€/facture
- Maintenance : 5k€/an

**ROI client :**
- Temps économisé : 15 min/facture → 30 sec
- Gain : 12.50€/facture (15 min × 50€/h)
- Conformité garantie (évite amendes)

**Priorité : HAUTE** (obligatoire pour crédibilité B2B)




### Partage Factures/Devis
- [x] Bouton "Partager" dans InvoiceCard
- [x] Bouton "Partager" dans QuoteCard
- [x] Option Email (mailto:)
- [x] Option WhatsApp
- [x] Option SMS
- [x] Génération contenu formaté pour chaque canal
- [ ] Option Copier lien (futur)
- [ ] Tracking analytics partages (futur)




---

## 🔧 CORRECTIONS URGENTES - Calculs Photovoltaïque (Priorité Haute)

### Corrections Aides et Focus Autofinancement
- [ ] **Supprimer fausses aides** (MaPrimeRénov', CEE non applicables au PV)
- [ ] **Ajouter aides réelles 2025** (Prime autoconsommation, Tarif rachat EDF OA, TVA 10% si conditions)
- [ ] **Focus AUTOFINANCEMENT** (mensualité crédit ≤ économie mensuelle)
- [ ] **Calculer cash-flow net mensuel** (économie électricité - mensualité crédit)
- [ ] **Afficher "AUTOFINANCÉ ✅"** si cash-flow > 0, sinon "NON AUTOFINANCÉ ❌"
- [ ] **Graphique comparatif 15 ans** (avec PV vs sans PV - barres comparatives)
- [ ] **Supprimer blabla gains 25 ans** → Focus concret immédiat (mensualités)
- [ ] **Corriger system prompt Artisan** (calculs autofinancement)
- [ ] **Corriger QuoteCard** (affichage mensualité + cash-flow + autofinancement)
- [ ] **Corriger pitch deck** (slides démo avec argument autofinancement)
- [ ] **Mettre à jour business plan** (projections réalistes sans fausses aides)

**Argument clé :** "Vous ne payez plus EDF, vous payez VOTRE installation. Dans 15 ans, vous ne payez plus rien."

**Formule magique :** Mensualité crédit ≤ Économie mensuelle électricité = AUTOFINANCÉ ✅




---

## 🏪 MARKETPLACE PHOTOVOLTAÏQUE B2B2C (Priorité Haute)

### Modèle Économique
**Principe :** Clients génèrent devis gratuit → Artisans achètent dossiers validés 300€

**Revenus :**
- Abonnement artisan : 49€/mois
- Dossier client validé : 300€
- Projection Année 3 (2000 artisans) : 15.6M€/an

### Phase 1 : Landing Page Client (Public)
- [ ] **Page d'accueil publique** (/calculateur-photovoltaique)
- [ ] **Formulaire simple** (ville, surface toiture, orientation, facture EDF €/mois)
- [ ] **Génération devis instantané** (sans connexion requise)
- [ ] **Affichage autofinancement** (mensualité vs économie)
- [ ] **Calcul cash-flow net** (AUTOFINANCÉ ✅ ou NON ❌)
- [ ] **Bouton CTA** ("Je veux être contacté par des artisans")
- [ ] **Formulaire coordonnées** (nom, email, téléphone, adresse complète)
- [ ] **Validation dossier** (stockage base de données)
- [ ] **Email confirmation client** ("3 artisans vont vous contacter sous 48h")

### Phase 2 : Dashboard Artisan (Pro)
- [ ] **Page "Dossiers Clients"** (/artisan/leads)
- [ ] **Liste dossiers disponibles** (géolocalisés rayon 50km)
- [ ] **Filtres** (budget, urgence, distance, statut)
- [ ] **Carte interactive** (localisation dossiers)
- [ ] **Détails dossier** (puissance, budget, coordonnées masquées)
- [ ] **Bouton "Acheter ce dossier"** (300€ via Stripe)
- [ ] **Révélation coordonnées** (après paiement)
- [ ] **CRM intégré** (suivi prospects, notes, rappels)
- [ ] **Historique achats** (dossiers achetés, CA généré)
- [ ] **Statistiques** (taux conversion leads → ventes)

### Phase 3 : Système de Paiement
- [ ] **Intégration Stripe** (achat dossier 300€)
- [ ] **Paiement en 1 clic** (carte enregistrée)
- [ ] **Facturation automatique** (PDF envoyé par email)
- [ ] **Gestion crédits** (pack 10 dossiers = 2,700€ au lieu de 3,000€)
- [ ] **Historique transactions** (comptabilité)

### Phase 4 : Notifications et Emails
- [ ] **Email client** (après validation dossier)
- [ ] **Email artisan** (nouveau dossier disponible dans région)
- [ ] **SMS artisan** (notification temps réel, optionnel)
- [ ] **Rappel artisan** (dossier non acheté après 24h)
- [ ] **Email suivi** (client non contacté après 48h)

### Phase 5 : Redirection IA
- [ ] **Modifier system prompts** (tous profils)
- [ ] **Détection demande photovoltaïque** (dans conversations)
- [ ] **Redirection automatique** ("Je vous redirige vers notre calculateur gratuit")
- [ ] **Lien direct** (/calculateur-photovoltaique?ref=chat)
- [ ] **Tracking conversions** (chat → calculateur → dossier validé)

### Phase 6 : SEO et Marketing
- [ ] **Optimisation SEO** (mots-clés : "devis photovoltaïque gratuit", "calculateur solaire")
- [ ] **Landing pages régionales** (/photovoltaique-marseille, /photovoltaique-lyon)
- [ ] **Blog** (articles SEO : "Photovoltaïque rentable ?", "Autofinancement possible ?")
- [ ] **Campagnes Google Ads** (CPC 2-5€, conversion 5%)
- [ ] **Partenariats** (sites immobiliers, forums rénovation)

### Phase 7 : Qualité et Modération
- [ ] **Système de notes artisans** (clients notent après installation)
- [ ] **Avis vérifiés** (email automatique après 30 jours)
- [ ] **Blacklist artisans** (si trop de plaintes)
- [ ] **Validation dossiers** (filtrage spam, doublons)
- [ ] **Support client** (chat, email, téléphone)

### Phase 8 : Analytics et Optimisation
- [ ] **Dashboard analytics** (dossiers générés, taux conversion, CA)
- [ ] **Funnel conversion** (visiteurs → devis → coordonnées → achat artisan)
- [ ] **A/B testing** (landing page, CTA, formulaires)
- [ ] **Heatmaps** (comportement utilisateurs)
- [ ] **Optimisation continue** (amélioration taux conversion)

**Estimation développement : 2-3 semaines**
**Lancement Beta : 100 artisans + 1,000 clients**
**Objectif Année 1 : 500 artisans, 12,000 dossiers, 3.9M€ CA**




---

## 🌍 INTÉGRATION PVGIS - Calculs Photovoltaïques Précis (EN COURS)

### Backend API PVGIS
- [ ] **Créer endpoint `/api/pvgis/calculate`** (appel API PVGIS)
- [ ] **Géocodage ville → lat/lon** (Nominatim OSM)
- [ ] **Mapping orientations simplifiées → azimut PVGIS**
  * Sud → 0°
  * Sud-Est → -45°
  * Sud-Ouest → 45°
  * Est → -90°
  * Ouest → 90°
  * Nord → 180° (avec avertissement)
- [ ] **Décote réaliste -10%** (au lieu de -14%)
- [ ] **Calcul dimensionnement optimal** (70% autoconsommation)
- [ ] **Gestion erreurs** (ville introuvable, API PVGIS down)

### Frontend Formulaire Client
- [ ] **Sélecteur orientation simplifié** (6 boutons avec icônes)
- [ ] **Sélecteur inclinaison** (slider 0-90°, valeur par défaut 30°)
- [ ] **Input ville** (avec autocomplétion)
- [ ] **Input surface toiture** (m²)
- [ ] **Input facture électrique** (€/mois)
- [ ] **Avertissement orientation Nord** ("Production très faible, non recommandé")
- [ ] **Aide visuelle** (schéma toiture avec angles)

### Calculs Autofinancement
- [ ] **Conversion facture → consommation** (kWh/an)
- [ ] **Appel PVGIS** (production réelle selon localisation/orientation)
- [ ] **Dimensionnement optimal** (puissance pour 70% autoconsommation)
- [ ] **Calcul aides réelles 2025** (Prime autoconsommation, TVA 10% si applicable)
- [ ] **Calcul mensualité crédit** (15 ans, 3%)
- [ ] **Calcul économie mensuelle** (autoconsommation + revente)
- [ ] **Calcul cash-flow net** (économie - mensualité)
- [ ] **Détection autofinancement** (cash-flow > 0 ✅ ou < 0 ❌)

### Affichage QuoteCard
- [ ] **Badge AUTOFINANCÉ ✅** (vert) ou **NON AUTOFINANCÉ ❌** (rouge)
- [ ] **Section autofinancement** (en gros, priorité visuelle)
- [ ] **Mensualité crédit** vs **Économie mensuelle** (comparaison visuelle)
- [ ] **Cash-flow net** (€/mois)
- [ ] **Graphique comparatif 15 ans** (avec PV vs sans PV)
- [ ] **Suppression anciennes aides** (MaPrimeRénov', CEE)

### Tests et Validation
- [ ] **Test Marseille** (Sud, 30°, 150€/mois)
- [ ] **Test Lyon** (Sud-Est, 35°, 120€/mois)
- [ ] **Test Lille** (Sud-Ouest, 40°, 100€/mois)
- [ ] **Test orientation Nord** (avertissement affiché)
- [ ] **Test API PVGIS indisponible** (message erreur gracieux)
- [ ] **Validation calculs** (comparaison avec PVGIS manuel)

**Priorité : HAUTE**
**Temps estimé : 1h30**
**Statut : EN COURS**




---

## 🔋 BATTERIE VIRTUELLE (Option Autoconsommation 95%)

### Backend API
- [ ] Ajouter paramètre `virtualBattery` (boolean)
- [ ] Calcul avec 95% autoconsommation (au lieu de 70%)
- [ ] Ajouter coût abonnement batterie (15€/mois)
- [ ] Comparaison économie avec/sans batterie

### Frontend Calculateur
- [ ] Checkbox "Batterie virtuelle" avec tooltip
- [ ] Affichage 2 scénarios (avec/sans)
- [ ] Mise en avant gain supplémentaire
- [ ] Explication concept (jour/nuit)

### Documentation
- [ ] Expliquer batterie virtuelle (userGuide.md)
- [ ] Liste fournisseurs (Urban Solar, My Light, Jpme)
- [ ] Conditions d'éligibilité




---

## 🗺️ ZONES GÉOGRAPHIQUES FRANCE (Production photovoltaïque)

### Backend API
- [x] Créer table 5 zones géographiques (Nord 950, IDF 1150, Centre 1250, Toulouse 1450, Marseille 1600)
- [x] Géolocalisation ville → département → zone
- [x] Calculs production avec coefficient zone
- [x] Affichage zone dans résultats
- [x] Coefficients orientation (Sud 100%, Sud-Est/Ouest 87.5%, Est/Ouest 81.25%, Nord 50%)

### Tests
- [ ] Test Lille (Zone Nord) → 950 kWh/kWc/an
- [ ] Test Paris (Zone IDF) → 1,150 kWh/kWc/an
- [ ] Test Orléans (Zone Centre) → 1,250 kWh/kWc/an
- [ ] Test Toulouse (Zone Sud-Ouest) → 1,450 kWh/kWc/an
- [ ] Test Marseille (Zone Sud-Est) → 1,600 kWh/kWc/an

---

## 🎯 PRÉCISION CANTONALE + DÉCOTE OMBRAGE

### Précision géographique métropolitaine (20 zones)
- [x] Créer base de données 20 zones métropolitaines avec production spécifique
- [x] Géolocalisation ville → zone la plus proche (algorithme distance GPS)
- [x] Afficher zone dans résultats
- [x] Migration 5 zones → 20 zones métropolitaines
- [x] Correction Marseille : 1,700 kWh/kWc/an (au lieu de 1,600)
- [x] Ajaccio (Corse) : 1,750 kWh/kWc/an (meilleure zone France)
- [x] Tests complets : 10/10 PASS

### Décote ombrage terrain
- [x] Ajouter question formulaire : "Ombrage matin ou soir ?" (checkbox)
- [x] Appliquer décote -10% si ombrage coché
- [x] Afficher décote dans résultats (transparence client)
- [x] Explication tooltip : "Ombres d'arbres, bâtiments, collines réduisent production"
- [x] Message alerte orange si ombrage coché
- [x] Tests décote ombrage : PASS (1,700 → 1,530 kWh/kWc)



---

## 💰 COÛT PERSONNALISÉ + SEUIL DE RENTABILITÉ

### Formulaire
- [x] Ajouter champ "Coût de votre installation (€)" (optionnel)
- [x] Valeur par défaut : calcul automatique (2000€/kWc)
- [x] Permettre saisie manuelle pour devis concurrent
- [x] Design encadré bleu avec message explicatif

### Calcul ROI (Return On Investment)
- [x] Calculer années pour amortissement complet
- [x] Calculer économies cumulées année par année
- [x] Calculer gains sur 25 ans (durée de vie installation)
- [x] Calculer gain net après amortissement
- [x] Tests complets : PASS (4.7 ans, +44,370€ sur 25 ans)

### Affichage résultats
- [x] Badge "Rentabilisé en X années" avec couleur selon rentabilité
- [x] Tableau économies année par année (années 1-5, 10, 15, 20, 25)
- [x] Affichage économies totales 25 ans
- [x] Affichage gain net après amortissement
- [x] Message explicatif durée de vie installation
- [x] Design section ROI (dégradé violet/rose)




---

## ⚡ PRIX ÉLECTRICITÉ AJUSTABLES + IMPACT RENTABILITÉ

### Formulaire
- [x] Ajouter champ "Prix électricité (€/kWh)" (optionnel)
- [x] Valeur par défaut : 0.25€/kWh (tarif moyen 2025)
- [x] Plage : 0.20€ à 0.40€/kWh
- [x] Ajouter champ "Prix rachat surplus (€/kWh)" (optionnel)
- [x] Valeur par défaut : 0.13€/kWh (EDF OA 2025)
- [x] Plage : 0.10€ à 0.20€/kWh
- [x] Design encadré violet avec 2 colonnes
- [x] Message astuce simulation hausse prix

### Calculs dynamiques
- [x] Recalculer économies avec prix personnalisés
- [x] Recalculer seuil rentabilité
- [x] Recalculer gain 25 ans
- [x] Impact en temps réel sur ROI
- [x] Tests complets : 5 scénarios PASS

### Affichage résultats
- [x] Message explicatif prix utilisés dans section ROI
- [x] Affichage prix électricité et rachat utilisés
- [x] Impact visible : +20% électricité = -0.7 an rentabilité
- [x] Impact visible : +40% électricité = -1.2 ans rentabilité




---

## 🏪 MARKETPLACE INSTALLATEURS (MODÈLE 6% VOLUME)

### Grille tarifaire
- [x] Prix installations fixes : 3kWc=5,500€ | 6kWc=11,500€ | 9kWc=15,000€
- [x] Commission leads : 6% du prix installation (330€ / 690€ / 900€)
- [x] Paiement au résultat (devis signé uniquement)
- [x] Fichier shared/pricing-grid.ts avec grille et fonctions calcul
- [x] Intégration API backend (calculateExactPrice)

### Phase 1 : Côté CLIENT (EN COURS)
- [x] Modifier calculateur : afficher prix grille selon puissance
- [x] Grande carte verte attractive avec prix en GROS (11,500€)
- [x] Description installation (puissance, panneaux)
- [x] Mentions inclus/exclus (travaux supplémentaires)
- [x] Bouton "👍 J'accepte ce prix - Recevoir un devis"
- [x] Message "Gratuit et sans engagement"
- [ ] Modal/Page pré-commande avec formulaire détaillé
- [ ] Formulaire : Nom, Prénom, Téléphone, Email, Adresse, Date souhaitée
- [ ] Checkbox engagement : "Je confirme mon intérêt pour installation à X€"
- [ ] Checkbox contact : "J'accepte d'être contacté par installateur certifié"
- [ ] Création lead en base de données (statut: "Pré-commande validée")
- [ ] Message confirmation client après pré-commande

### Phase 2 : Base de données (✅ TERMINÉ)
- [x] Table `services` (secteurs d'activité universels)
- [x] Table `providers` (prestataires multi-secteurs)
- [x] Table `leads` (demandes clients universelles)
- [x] Table `leadReservations` (réservations 48h)
- [x] Table `commissions` (paiements affiliation)
- [x] Table `leadHistory` (traçabilité)
- [x] Migration BDD réussie (22 tables)
- [x] Seed data : 5 services initiaux
- [x] API CRUD complète (leadsRouter)
- [x] Intégration router principal
- [x] Documentation architecture (ARCHITECTURE-LEADS.md)

### Phase 3 : Côté INSTALLATEUR
- [ ] Page inscription installateur (company, contact, zone géographique)
- [ ] Validation manuelle installateurs (admin)
- [ ] Page marketplace leads (liste projets disponibles)
- [ ] Filtres : Zone, Puissance, Prix, Statut
- [ ] Card lead : Puissance, Ville, Prix, Commission 6%, Statut
- [ ] Bouton "Réserver ce lead" (48h exclusivité)
- [ ] Dévoilement coordonnées client après réservation
- [ ] Page "Mes leads réservés"
- [ ] Upload devis signé (PDF)
- [ ] Paiement Stripe (330€ / 690€ / 900€)
- [ ] Tableau de bord installateur (leads achetés, CA généré, taux conversion)

### Phase 4 : Côté ADMIN
- [ ] Page validation installateurs (approve/reject)
- [ ] Page validation devis (vérifier conformité prix)
- [ ] Dashboard revenus (leads vendus, CA mensuel, projections)
- [ ] Statistiques : Taux conversion, Délai moyen signature, Top installateurs

### Phase 5 : Notifications
- [ ] Email client : Confirmation pré-commande
- [ ] Email installateur : Nouveau lead disponible dans votre zone
- [ ] Email installateur : Lead réservé expire dans 24h
- [ ] Email admin : Nouveau devis à valider
- [ ] Email installateur : Devis validé - Paiement requis

### Mentions légales
- [ ] Mention "Travaux supplémentaires facturés en sus" dans résultats
- [ ] CGV marketplace installateurs
- [ ] CGU client pré-commande





---

## 🚦 SYSTÈME 2 PARCOURS CLIENT (Standard vs Express)

### Fonctionnalités
- [x] Section choix parcours dans formulaire pré-commande
- [x] Parcours Standard : Délai 14j, acompte après confirmation
- [x] Parcours Express : Renonciation + Acompte 30% immédiat
- [ ] Checkbox renonciation légale (Article L221-28)
- [ ] Calcul automatique acompte 30% (1,650€ / 3,450€ / 4,500€)
- [ ] Paiement Stripe acompte (si Express)
- [ ] Webhook Stripe confirmation paiement
- [ ] Message empowerment "VOUS êtes décisionnaire"

### Base de données
- [ ] Ajouter champ `chosenPath` ('standard' | 'express')
- [ ] Ajouter champ `depositAmount` (montant acompte)
- [ ] Ajouter champ `depositPaid` (boolean)
- [ ] Ajouter champ `depositPaidAt` (date)
- [ ] Ajouter champ `waiverSigned` (renonciation signée)
- [ ] Ajouter statuts : quote_signed_standard, quote_signed_express, cooling_off, retracted, confirmed, paid_commission
- [ ] Migration BDD

### Workflow
- [ ] Standard : Devis signé → 14j → Confirmation → Acompte → Commission → Travaux
- [ ] Express : Devis signé + Acompte → Commission immédiate → Travaux 48h
- [ ] Email client : Confirmation parcours choisi
- [ ] Email installateur : Type parcours (standard/express)




---

## 📊 DASHBOARD CLIENT - SUIVI PROJET TEMPS RÉEL

### Fonctionnalités
- [x] Page dashboard accessible via URL unique (token)
- [x] Timeline visuelle statut projet (9 étapes)
- [x] Compte à rebours période rétractation (si Standard)
- [x] Informations projet (puissance, prix, production, zone)
- [x] Coordonnées installateur (une fois réservé)
- [x] Actions client (contacter, signaler, annuler)
- [x] Responsive mobile
- [x] Redirection automatique après soumission lead
- [ ] Section documents (devis, facture, certificats) - pour plus tard

### Backend
- [x] API getLeadByToken (accès sécurisé)
- [x] Génération token unique à la création lead (32 caractères)
- [x] Champ accessToken dans table leads
- [x] Migration BDD (0009_supreme_bill_hollister.sql)
- [x] Return accessToken dans createLead
- [ ] Email confirmation avec lien dashboard - pour plus tard
- [ ] Mise à jour statut lead (webhook installateur) - pour plus tard

### Design
- [ ] Timeline horizontale avec icônes
- [ ] Badge statut coloré (en cours, terminé, annulé)
- [ ] Carte informations projet
- [ ] Carte installateur (si assigné)
- [ ] Liste documents téléchargeables
- [ ] Boutons actions (CTA)




---

## 🏪 MARKETPLACE INSTALLATEURS - GÉNÉRATION REVENUS

### Phase 1 : Inscription Prestataire (✅ TERMINÉ)
- [x] Page `/inscription-installateur` publique
- [x] Formulaire complet (entreprise, SIRET, contact, téléphone, email)
- [x] Zones géographiques (95 départements sélectionnables)
- [x] Certifications (champ texte libre)
- [x] Services proposés (PV, plomberie, électricité, chauffage)
- [x] Statut : pending (validation manuelle admin)
- [x] API createProvider (validation SIRET unique)
- [x] Intégration formulaire → API
- [x] Message confirmation personnalisé
- [x] Design responsive colorisé
- [x] Section documents (liste 5 documents requis)
- [x] Charte qualité complète (4 sections + sanctions)
- [x] Checkbox acceptation charte obligatoire
- [x] Validation stricte (description 500 car, SIRET 14)
- [x] Informations entreprise détaillées (capital, CA, effectif, forme juridique)
- [x] Présentation activité (description, spécialités, références)
- [x] Certifications obligatoires
- [x] 19 nouveaux champs BDD providers
- [x] Nouveaux statuts (documents_incomplete, under_review, rejected)
- [x] Migration BDD (0010_parched_black_panther.sql)
- [x] API createProvider mise à jour (tous champs)
- [ ] Upload documents S3 (Kbis, assurances, etc.) - pour plus tard
- [ ] Email confirmation inscription - pour plus tard

### Phase 2 : Marketplace Leads
- [ ] Page `/marketplace` (protégée installateurs)
- [ ] Authentification installateur
- [ ] Liste leads disponibles (cards)
- [ ] Filtres : zone, service, puissance, prix
- [ ] Tri : date, prix, distance
- [ ] Badge "NOUVEAU" (< 24h)
- [ ] Badge "URGENT" (express)
- [ ] Bouton "Réserver ce lead" (48h exclusivité)
- [ ] Page détail lead (coordonnées si réservé)
- [ ] Compte à rebours réservation (48h)
- [ ] API reserveLead

### Phase 3 : Workflow Devis
- [ ] Section "Mes leads réservés"
- [ ] Upload devis signé (photo/PDF)
- [ ] Bouton "Client a signé - Acheter ce lead"
- [ ] Page paiement Stripe (690€ pour 6kWc)
- [ ] Webhook Stripe confirmation
- [ ] Lead statut → "sold"
- [ ] Email confirmation achat
- [ ] Coordonnées client dévoilées définitivement
- [ ] API createCommission

### Phase 4 : Dashboard Installateur
- [ ] Statistiques (leads achetés, CA généré, taux conversion)
- [ ] Historique achats
- [ ] Leads en cours (réservés)
- [ ] Leads disponibles (zone)
- [ ] Solde à payer
- [ ] Factures téléchargeables




---

## 🏪 MARKETPLACE ORIASOL - Service Mise en Relation Universel (EN COURS)

### Architecture complète ✅
- [x] Base de données (6 tables : services, providers, leads, leadReservations, commissions, leadHistory)
- [x] API CRUD complète (8 endpoints leads)
- [x] Seed data (5 services initiaux)
- [x] Module Photovoltaïque (calculateur 20 zones + ROI + prix ajustables)
- [x] Système 2 parcours (Standard 14j / Express immédiat)
- [x] Dashboard client (suivi temps réel)
- [x] Inscription installateurs (exigences qualité strictes)
- [x] Page marketplace (/marketplace) - UI créée

### Fonctionnalités à finaliser (AUJOURD'HUI)

#### 1. Système d'authentification installateurs
- [x] API login installateurs (POST /api/providers/login)
- [x] API vérification token (GET /api/providers/me)
- [x] Middleware requireProvider (vérification auth)
- [x] Page login installateurs (/login-installateur)
- [x] Gestion session (localStorage token JWT)
- [x] Champ password ajouté dans inscription
- [x] Hash bcrypt passwords
- [x] Protection routes marketplace (auth required)
- [x] Middleware providerProcedure (architecture professionnelle)
- [x] Header Authorization Bearer token automatique
- [x] Gestion erreurs auth (token expiré, invalide, provider inactif)

#### 2. Système de réservation leads (48h)
- [ ] API reserveLead avec ctx.user.id (POST /api/leads/:id/reserve)
- [ ] Vérification provider actif (statut "active")
- [ ] Vérification lead disponible (statut "available")
- [ ] Création reservation (48h expiration)
- [ ] Mise à jour statut lead → "reserved"
- [ ] Notification client (email "Installateur assigné")
- [ ] Timer 48h avec libération automatique si non payé

#### 3. Intégration paiement Stripe (6%)
- [ ] Configuration Stripe (clés API)
- [ ] API createPaymentIntent (montant commission)
- [ ] Page paiement (/payment/:reservationId)
- [ ] Webhook Stripe (confirmation paiement)
- [ ] Mise à jour statut lead → "sold" après paiement
- [ ] Création commission record (montant, date)
- [ ] Envoi coordonnées client à installateur (email)
- [ ] Notification client (email "Installateur confirmé")

#### 4. Dashboard installateurs
- [ ] Page dashboard installateurs (/dashboard-installateur)
- [ ] Liste leads réservés (en attente paiement)
- [ ] Liste leads achetés (coordonnées clients visibles)
- [ ] Historique achats (statistiques)
- [ ] Solde commissions payées
- [ ] Bouton "Payer maintenant" (leads réservés)
- [ ] Bouton "Contacter client" (leads achetés)

#### 5. Emails automatiques
- [ ] Email confirmation lead créé (client)
- [ ] Email installateur assigné (client)
- [ ] Email lead réservé (installateur)
- [ ] Email coordonnées client (installateur après paiement)
- [ ] Email paiement confirmé (installateur)
- [ ] Email rappel paiement 24h avant expiration (installateur)
- [ ] Email réservation expirée (installateur)

#### 6. Admin dashboard (validation manuelle)
- [ ] Page admin providers (/admin/providers)
- [ ] Liste providers pending (en attente validation)
- [ ] Détails provider (infos complètes + documents)
- [ ] Boutons actions (Approuver / Rejeter / Demander documents)
- [ ] Email validation approuvée (provider)
- [ ] Email validation rejetée avec raison (provider)
- [ ] Email documents manquants (provider)

#### 7. Tests complets
- [ ] Test parcours client complet (calculateur → lead → dashboard)
- [ ] Test inscription installateur (formulaire → validation)
- [ ] Test marketplace (login → réservation → paiement → coordonnées)
- [ ] Test expiration 48h (libération automatique)
- [ ] Test emails (tous templates)
- [ ] Test admin (validation providers)

### Stratégie multi-domaines (DEMAIN - Déploiement)
- [ ] Configuration Vercel + PlanetScale
- [ ] Domaine MA-MAISON-AUTONOME.fr (interface client B2C)
- [ ] Domaine ORIASOL.fr (marketplace installateurs B2B)
- [ ] Séparation complète interfaces (confidentialité business)
- [ ] Tests production multi-domaines
- [ ] Documentation installateurs

### Projection revenus (Modèle 6%)
- Mois 1 : 10 leads PV × 690€ = 6,900€
- Mois 3 : 50 leads PV × 690€ = 34,500€
- Mois 6 : 100 leads PV × 690€ = 69,000€
- An 1 : 200 leads/mois × 690€ = 138,000€/mois

**Économie installateurs : 1,035€ par lead (6% vs 15% marché)**


