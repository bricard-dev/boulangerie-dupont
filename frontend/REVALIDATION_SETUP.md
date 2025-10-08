# Configuration de la Revalidation Sanity

Ce guide explique comment configurer la revalidation automatique de votre site Next.js lorsque vous modifiez du contenu dans Sanity Studio.

## 📋 Étapes de configuration

### 1️⃣ Configurer les variables d'environnement

Créez un fichier `.env.local` dans le dossier `frontend/` avec :

```env
# Sanity Configuration (déjà configuré normalement)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-09-25
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333

# Token de lecture Sanity (pour le draft mode)
SANITY_API_READ_TOKEN=your-read-token

# Secret pour la revalidation (IMPORTANT: générez un secret unique et sécurisé)
SANITY_REVALIDATE_SECRET=your-random-secret-here
```

**Pour générer un secret sécurisé :**

```bash
openssl rand -base64 32
```

### 2️⃣ Configurer le webhook dans Sanity Studio

1. Allez sur [manage.sanity.io](https://manage.sanity.io)
2. Sélectionnez votre projet
3. Allez dans **API** → **Webhooks**
4. Cliquez sur **Create webhook**
5. Configurez le webhook :
   - **Name:** `Next.js Revalidation`
   - **URL:** `https://votre-domaine.com/api/revalidate/tag`
     - En développement local avec un outil comme ngrok: `https://your-ngrok-url.ngrok.io/api/revalidate/tag`
   - **Dataset:** Sélectionnez votre dataset (ex: `production`)
   - **Trigger on:** Sélectionnez les événements :
     - ✅ Create
     - ✅ Update
     - ✅ Delete
   - **Filter:** Pour ne revalider que les posts :
     ```groq
     _type == "post"
     ```
   - **Projection:**
     ```groq
     {
       "tags": ["post"]
     }
     ```
   - **HTTP method:** `POST`
   - **HTTP Headers:**
     - Pas besoin d'ajouter de headers personnalisés
   - **Secret:** Collez le même secret que votre `SANITY_REVALIDATE_SECRET`

6. Cliquez sur **Save**

### 3️⃣ Tester le webhook

Dans Sanity Studio :

1. Modifiez un post existant ou créez-en un nouveau
2. Publiez les changements
3. Vérifiez dans les logs du webhook (dans manage.sanity.io) que la requête a été envoyée avec succès (status 200)

### 4️⃣ Configuration pour la production (Vercel)

Si vous déployez sur Vercel :

1. Ajoutez les variables d'environnement dans Vercel :
   - Allez dans **Settings** → **Environment Variables**
   - Ajoutez `SANITY_REVALIDATE_SECRET` avec la même valeur

2. Mettez à jour l'URL du webhook :
   ```
   https://votre-app.vercel.app/api/revalidate/tag
   ```

## 🔍 Comment ça fonctionne

1. **Tags dans les requêtes** : Les requêtes Sanity utilisent déjà des tags (voir `page.tsx` ligne 28) :

   ```typescript
   tags: ['post', 'author', 'category']
   ```

2. **Webhook Sanity** : Quand un post change, Sanity envoie un webhook à votre API

3. **Route API** : `/app/api/revalidate/tag/route.ts` reçoit le webhook, vérifie la signature, et revalide les tags

4. **Revalidation** : Next.js revalide automatiquement toutes les pages qui utilisent ces tags

## 🎯 Tags utilisés dans l'application

Les tags suivants sont maintenant configurés dans toute l'application :

- `post` : Pour tous les posts (liste, détail, posts récents)
- `page` : Pour toutes les pages dynamiques
- `settings` : Pour les paramètres globaux du site
- `author` : Pour les auteurs (dans les détails des posts)
- `category` : Pour les catégories (dans les détails des posts)

Chaque fois qu'un contenu est modifié dans Sanity, le webhook déclenche la revalidation des pages correspondantes.

## 🔌 Routes API disponibles

### 1. `/api/revalidate/tag` (Production)

Route principale pour la revalidation par tags via webhook Sanity.

**Usage:** Configuré automatiquement via webhook Sanity

### 2. `/api/revalidate/path` (Production)

Route pour revalider un chemin spécifique.

**Webhook Projection pour revalider un post spécifique:**

```groq
{
  "path": "/posts/" + slug.current
}
```

### 3. `/api/revalidate/test` (Développement uniquement)

Route de test pour vérifier manuellement la revalidation.

**Exemples:**

- `http://localhost:3000/api/revalidate/test?tag=post`
- `http://localhost:3000/api/revalidate/test?path=/posts/mon-article`

⚠️ Cette route est désactivée en production pour des raisons de sécurité.

## 🧪 Test local avec ngrok

Pour tester en local :

```bash
# Installez ngrok si nécessaire
npm install -g ngrok

# Démarrez votre app Next.js
npm run dev

# Dans un autre terminal, créez un tunnel ngrok
ngrok http 3000

# Utilisez l'URL ngrok dans la configuration du webhook Sanity
```

## 📝 Notes importantes

- Le secret `SANITY_REVALIDATE_SECRET` doit être **identique** dans votre `.env.local` ET dans la configuration du webhook Sanity
- La route API est déjà configurée pour valider la signature du webhook (sécurité)
- Les tags permettent une revalidation fine : seules les pages utilisant ces tags seront revalidées
