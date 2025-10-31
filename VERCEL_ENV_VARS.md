# Variables d'environnement pour Vercel

## ⚠️ OBLIGATOIRES

### DATABASE_URL
**Description :** URL de connexion à la base de données MySQL/PlanetScale  
**Format :** `mysql://user:password@host:3306/database`  
**Exemple :** `mysql://root:password123@aws.connect.psdb.cloud:3306/compagnon-ia`  
**Où l'obtenir :** PlanetScale Dashboard → Database → Connect → Copy connection string

### JWT_SECRET
**Description :** Clé secrète pour signer les tokens JWT (authentification installateurs)  
**Format :** Chaîne aléatoire longue et complexe  
**Exemple :** `super-secret-jwt-key-change-this-in-production-abc123xyz789`  
**Générer :** `openssl rand -base64 32` ou https://randomkeygen.com/

---

## 🔧 OPTIONNELLES (mais recommandées)

### STRIPE_SECRET_KEY
**Description :** Clé secrète Stripe pour traiter les paiements  
**Format :** `sk_test_...` (test) ou `sk_live_...` (production)  
**Où l'obtenir :** Stripe Dashboard → Developers → API keys  
**Note :** Utilisez `sk_test_` pour les tests, `sk_live_` pour la production

### VITE_STRIPE_PUBLIC_KEY
**Description :** Clé publique Stripe (frontend)  
**Format :** `pk_test_...` (test) ou `pk_live_...` (production)  
**Où l'obtenir :** Stripe Dashboard → Developers → API keys  
**Note :** Doit correspondre à STRIPE_SECRET_KEY (test avec test, live avec live)

---

## 📱 APP CONFIG (optionnelles)

### VITE_APP_TITLE
**Description :** Titre de l'application  
**Valeur par défaut :** `Compagnon IA - Prototype`  
**Exemple :** `ORIASOL - Marketplace Installateurs`

### VITE_APP_LOGO
**Description :** URL du logo de l'application  
**Format :** URL complète  
**Exemple :** `https://votre-domaine.com/logo.png`

---

## 🔐 OAUTH MANUS (optionnelles - seulement si vous utilisez OAuth Manus)

### OAUTH_SERVER_URL
**Valeur :** `https://api.manus.im`

### VITE_OAUTH_PORTAL_URL
**Valeur :** `https://portal.manus.im`

### VITE_APP_ID
**Description :** ID de votre application Manus  
**Où l'obtenir :** Manus Dashboard

### OWNER_OPEN_ID
**Description :** Votre Open ID Manus  
**Où l'obtenir :** Manus Dashboard

### OWNER_NAME
**Description :** Votre nom  
**Exemple :** `Marc DJEDIR`

---

## 📊 ANALYTICS (optionnelles)

### VITE_ANALYTICS_ENDPOINT
**Description :** Endpoint pour analytics (Umami, Plausible, etc.)

### VITE_ANALYTICS_WEBSITE_ID
**Description :** ID du site pour analytics

---

## 🚀 CONFIGURATION VERCEL

### Comment ajouter les variables :

1. **Dans Vercel Dashboard :**
   - Projet → Settings → Environment Variables
   - Cliquer "Add New"
   - Name : `DATABASE_URL`
   - Value : Coller la valeur
   - Environment : Cocher "Production", "Preview", "Development"
   - Cliquer "Save"

2. **Répéter pour chaque variable**

3. **Redéployer le projet :**
   - Deployments → Latest → ... → Redeploy

---

## ✅ VARIABLES MINIMALES POUR DÉMARRER

**Pour faire fonctionner la marketplace, vous avez BESOIN de :**

1. `DATABASE_URL` (PlanetScale)
2. `JWT_SECRET` (généré aléatoirement)

**Optionnelles mais recommandées :**

3. `STRIPE_SECRET_KEY` (mode test pour commencer)
4. `VITE_STRIPE_PUBLIC_KEY` (mode test pour commencer)

**Le reste peut être ajouté plus tard !**

