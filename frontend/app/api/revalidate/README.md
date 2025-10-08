# Routes API de Revalidation

Ce dossier contient les routes API pour la revalidation du cache Next.js via les webhooks Sanity.

## 📂 Structure

```
/api/revalidate/
├── tag/route.ts       # Revalidation par tags (PRODUCTION)
├── path/route.ts      # Revalidation par chemin (PRODUCTION)
├── test/route.ts      # Tests manuels (DEV uniquement)
└── README.md          # Ce fichier
```

## 🔐 Sécurité

Toutes les routes de production (`tag` et `path`) utilisent :

- Validation de signature HMAC via `parseBody` de `next-sanity/webhook`
- Variable d'environnement `SANITY_REVALIDATE_SECRET` requise
- Seules les requêtes avec une signature valide sont acceptées

## 🛣️ Routes disponibles

### 1. `/api/revalidate/tag` (Production)

**Méthode:** `POST`

**Usage:** Revalidation par tags Next.js

**Payload attendu:**

```json
{
  "tags": ["post", "page", "settings"]
}
```

**Exemple de réponse (200):**

```json
{
  "body": {
    "tags": ["post"]
  }
}
```

**Codes d'erreur:**

- `401` : Signature invalide
- `400` : Payload incorrect (tags manquants ou pas un tableau)
- `500` : Erreur serveur ou `SANITY_REVALIDATE_SECRET` manquant

### 2. `/api/revalidate/path` (Production)

**Méthode:** `POST`

**Usage:** Revalidation d'un chemin spécifique

**Payload attendu:**

```json
{
  "path": "/posts/mon-article",
  "type": "page"
}
```

Le champ `type` est optionnel et peut être `"page"` (défaut) ou `"layout"`.

**Exemple de réponse (200):**

```json
{
  "revalidated": true,
  "path": "/posts/mon-article",
  "type": "page",
  "now": 1234567890
}
```

**Codes d'erreur:**

- `401` : Signature invalide
- `400` : Path manquant
- `500` : Erreur serveur ou `SANITY_REVALIDATE_SECRET` manquant

### 3. `/api/revalidate/test` (Développement uniquement)

**Méthode:** `GET`

**Usage:** Tests manuels de revalidation (désactivé en production)

**Paramètres de requête:**

- `tag` : Tag à revalider (ex: `post`)
- `path` : Chemin à revalider (ex: `/posts/mon-article`)

**Exemples:**

```bash
# Revalider un tag
curl "http://localhost:3000/api/revalidate/test?tag=post"

# Revalider un chemin
curl "http://localhost:3000/api/revalidate/test?path=/posts/mon-article"
```

**Exemple de réponse (200):**

```json
{
  "revalidated": true,
  "type": "tag",
  "value": "post",
  "now": 1234567890
}
```

**Codes d'erreur:**

- `403` : Route désactivée en production
- `400` : Ni `tag` ni `path` fourni

## 🔧 Configuration

### Variables d'environnement requises

```env
SANITY_REVALIDATE_SECRET=your-secret-here
```

Générez un secret sécurisé :

```bash
openssl rand -base64 32
```

### Configuration du webhook Sanity

Voir les guides complets :

- `QUICK_START_REVALIDATION.md` - Démarrage rapide
- `REVALIDATION_SETUP.md` - Configuration détaillée
- `WEBHOOK_EXAMPLES.md` - Exemples de webhooks

## 🧪 Tests

### Test local (développement)

```bash
# Démarrez l'application
npm run dev

# Testez avec curl
curl "http://localhost:3000/api/revalidate/test?tag=post"
```

### Test avec webhook Sanity (développement)

1. Installez ngrok : `npm install -g ngrok`
2. Démarrez ngrok : `ngrok http 3000`
3. Utilisez l'URL ngrok dans votre webhook Sanity
4. Modifiez un document dans Sanity Studio
5. Vérifiez les logs du webhook dans manage.sanity.io

### Vérifier les logs du webhook

1. Allez sur [manage.sanity.io](https://manage.sanity.io)
2. Sélectionnez votre projet
3. **API** → **Webhooks** → votre webhook
4. Onglet **Deliveries**
5. Vérifiez le status code (doit être `200`)

## 📖 Ressources

- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
- [Sanity Webhooks](https://www.sanity.io/docs/webhooks)
- [next-sanity Webhooks](https://github.com/sanity-io/next-sanity#webhooks)

## 🐛 Dépannage

### Erreur : Missing environment variable SANITY_REVALIDATE_SECRET

→ Ajoutez `SANITY_REVALIDATE_SECRET` dans votre `.env.local`

### Erreur 401 : Invalid signature

→ Vérifiez que le secret dans le webhook Sanity correspond à `SANITY_REVALIDATE_SECRET`

### Erreur 400 : Bad Request

→ Vérifiez le format du payload (doit contenir `tags` pour `/tag` ou `path` pour `/path`)

### Le contenu ne se met pas à jour

1. Vérifiez que le webhook retourne `200`
2. Vérifiez que les tags dans le webhook correspondent aux tags dans vos requêtes `sanityFetch`
3. Videz le cache de votre navigateur
4. Attendez quelques secondes (la revalidation n'est pas instantanée)
