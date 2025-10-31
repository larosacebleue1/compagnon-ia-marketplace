# 🚀 Guide de déploiement Vercel

## Étape 1 : Créer compte PlanetScale (base de données)

### 1.1 Inscription
1. Aller sur https://planetscale.com/
2. Cliquer "Sign up"
3. Choisir "Continue with GitHub"
4. Autoriser PlanetScale

### 1.2 Créer une base de données
1. Cliquer "Create a database"
2. Name : `compagnon-ia-prod`
3. Region : `AWS eu-west-1` (Paris/Frankfurt)
4. Plan : **Hobby** (gratuit)
5. Cliquer "Create database"

### 1.3 Obtenir l'URL de connexion
1. Dans votre database → "Connect"
2. Framework : "Prisma" (ou "General")
3. **COPIER** la connection string qui ressemble à :
   ```
   mysql://username:password@aws.connect.psdb.cloud/compagnon-ia-prod?sslaccept=strict
   ```
4. **GARDER CETTE URL** (vous en aurez besoin dans Vercel)

---

## Étape 2 : Importer le projet dans Vercel

### 2.1 Importer depuis GitHub
1. Dans Vercel Dashboard, cliquer "Add New..." → "Project"
2. Section "Import Git Repository"
3. Coller l'URL du repo GitHub : **[URL fournie par Manus]**
4. Cliquer "Import"

### 2.2 Configuration du projet
1. **Project Name** : `compagnon-ia-prototype` (ou votre choix)
2. **Framework Preset** : Vite (détecté automatiquement)
3. **Root Directory** : `.` (laisser par défaut)
4. **Build Command** : `pnpm build` (détecté automatiquement)
5. **Output Directory** : `client/dist` (détecté automatiquement)
6. **Install Command** : `pnpm install` (détecté automatiquement)

### 2.3 Ajouter les variables d'environnement

**CLIQUER sur "Environment Variables"**

**Ajouter ces variables (MINIMUM) :**

| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | [URL PlanetScale copiée] | Production, Preview, Development |
| `JWT_SECRET` | [Générer sur https://randomkeygen.com/] | Production, Preview, Development |

**Optionnel (pour paiements Stripe) :**

| Name | Value | Environments |
|------|-------|--------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | Production, Preview, Development |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_...` | Production, Preview, Development |

### 2.4 Déployer
1. Cliquer "Deploy"
2. Attendre 2-3 minutes
3. ✅ Déploiement terminé !

---

## Étape 3 : Migrer la base de données

### 3.1 Ouvrir le terminal Vercel
1. Dans Vercel Dashboard → Votre projet
2. Onglet "Deployments"
3. Cliquer sur le dernier déploiement (vert)
4. Cliquer "..." → "View Function Logs"
5. Ou utiliser Vercel CLI (avancé)

### 3.2 Exécuter les migrations
**Option A : Via Vercel CLI (recommandé)**
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Exécuter les migrations
vercel env pull .env.local
pnpm db:push
```

**Option B : Manuellement**
1. Copier le contenu de `drizzle/0001_*.sql` (dernier fichier)
2. Aller dans PlanetScale Dashboard → Console
3. Coller et exécuter le SQL

---

## Étape 4 : Activer la protection par mot de passe

### 4.1 Configuration
1. Vercel Dashboard → Votre projet
2. Settings → Deployment Protection
3. Activer "Password Protection"
4. Définir un mot de passe (ex: `ORIASOL2025!`)
5. Sauvegarder

### 4.2 Tester
1. Ouvrir l'URL de votre site (ex: `https://compagnon-ia-prototype.vercel.app`)
2. Vercel demande le mot de passe
3. Entrer le mot de passe
4. ✅ Accès au site !

---

## Étape 5 : Seed les données de test

### 5.1 Via Vercel CLI
```bash
# Créer les leads de test
vercel exec -- npx tsx scripts/seed-test-leads.ts

# Créer l'installateur de test
vercel exec -- npx tsx scripts/seed-test-provider.ts
```

### 5.2 Identifiants de test
**Installateur :**
- Email : `test@soleil-energie.fr`
- Password : `Test123!`

---

## Étape 6 : Tester le parcours complet

1. Aller sur votre URL Vercel
2. Entrer le mot de passe de protection
3. Aller sur `/login-installateur`
4. Se connecter avec `test@soleil-energie.fr` / `Test123!`
5. Voir la marketplace (5 leads disponibles)
6. Réserver un lead
7. Aller dans Dashboard
8. Tester le paiement (mode test Stripe)

---

## 🎉 C'EST FINI !

Votre marketplace est déployée en production privée !

**URL :** `https://votre-projet.vercel.app`  
**Protection :** Mot de passe  
**BDD :** PlanetScale (gratuit)  
**Coût :** 0€

---

## 🔧 Commandes utiles

### Redéployer
```bash
vercel --prod
```

### Voir les logs
```bash
vercel logs
```

### Ajouter une variable d'environnement
```bash
vercel env add DATABASE_URL
```

### Lier un domaine personnalisé
1. Vercel Dashboard → Settings → Domains
2. Ajouter `oriasol.fr`
3. Configurer DNS (instructions fournies)

---

## ❓ Problèmes courants

### "Database connection failed"
→ Vérifier que `DATABASE_URL` est bien configurée dans Vercel

### "Build failed"
→ Vérifier les logs de build dans Vercel Dashboard

### "Page not found"
→ Vérifier que `Output Directory` = `client/dist`

### "Stripe error"
→ Vérifier que `STRIPE_SECRET_KEY` et `VITE_STRIPE_PUBLIC_KEY` sont configurées

---

**Besoin d'aide ? Contactez Manus AI !** 😊

