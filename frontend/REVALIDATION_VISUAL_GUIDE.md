# 🎨 Guide Visuel - Revalidation Sanity

## 📊 Comment ça fonctionne

```
┌─────────────────┐
│  Sanity Studio  │  1. Vous modifiez un post
│  (CMS)          │     et cliquez sur "Publish"
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sanity Cloud   │  2. Sanity détecte le changement
│  (Webhook)      │     et envoie un webhook
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Next.js App                        │
│  /api/revalidate/tag                │  3. Votre app reçoit le webhook
│  - Vérifie la signature             │     et valide la requête
│  - Extrait les tags                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Next.js Cache  │  4. Next.js revalide le cache
│  revalidateTag  │     pour les tags concernés
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Site Web       │  5. Les visiteurs voient
│  (Production)   │     le nouveau contenu ! ✨
└─────────────────┘
```

## 🏷️ Tags et Pages

```
┌──────────────┬─────────────────────────────────┐
│     Tag      │    Pages qui se revalident      │
├──────────────┼─────────────────────────────────┤
│    post      │  - /                            │
│              │  - /posts/mon-article           │
│              │  - Tous les posts               │
├──────────────┼─────────────────────────────────┤
│    page      │  - /a-propos                    │
│              │  - /contact                     │
│              │  - Toutes pages personnalisées  │
├──────────────┼─────────────────────────────────┤
│   settings   │  - / (page d'accueil)           │
│              │  - Paramètres globaux           │
└──────────────┴─────────────────────────────────┘
```

## 🚀 Configuration en 3 étapes

### Étape 1 : Variables d'environnement (1 min)

```bash
# Générer un secret
openssl rand -base64 32

# Copier le résultat et créer .env.local
echo "SANITY_REVALIDATE_SECRET=votre-secret-ici" >> .env.local
```

### Étape 2 : Webhook Sanity (2 min)

```
manage.sanity.io → Votre Projet → API → Webhooks → Create

┌─────────────────────────────────────────────────┐
│  Name: Next.js Revalidation                     │
├─────────────────────────────────────────────────┤
│  URL: https://votre-site.com/api/revalidate/tag│
├─────────────────────────────────────────────────┤
│  Dataset: production                            │
├─────────────────────────────────────────────────┤
│  Trigger: Create, Update, Delete                │
├─────────────────────────────────────────────────┤
│  Filter:                                        │
│  _type in ["post", "page", "settings"]          │
├─────────────────────────────────────────────────┤
│  Projection:                                    │
│  {                                              │
│    "tags": select(                              │
│      _type == "post" => ["post"],               │
│      _type == "page" => ["page"],               │
│      _type == "settings" => ["settings"],       │
│      []                                         │
│    )                                            │
│  }                                              │
├─────────────────────────────────────────────────┤
│  Secret: [collez votre secret ici]             │
└─────────────────────────────────────────────────┘
```

### Étape 3 : Test (1 min)

```bash
# Option 1 : Test manuel (dev)
curl "http://localhost:3000/api/revalidate/test?tag=post"

# Option 2 : Test via Sanity
1. Modifiez un post dans Sanity Studio
2. Publiez
3. Vérifiez les logs du webhook (manage.sanity.io)
   Status devrait être 200 ✅
```

## 🎯 Routes API

```
/api/revalidate/
│
├── tag/           🔹 Revalidation par tags
│   route.ts          ✅ Production
│                     POST avec signature HMAC
│
├── path/          🔹 Revalidation par chemin
│   route.ts          ✅ Production
│                     POST avec signature HMAC
│
└── test/          🔹 Tests manuels
    route.ts          ⚠️  Dev uniquement
                      GET sans authentification
```

## 📝 Exemples de Requêtes

### Webhook Sanity → /api/revalidate/tag

```http
POST /api/revalidate/tag
Content-Type: application/json
X-Sanity-Signature: sha256=...

{
  "tags": ["post"]
}
```

### Webhook Sanity → /api/revalidate/path

```http
POST /api/revalidate/path
Content-Type: application/json
X-Sanity-Signature: sha256=...

{
  "path": "/posts/mon-article",
  "type": "page"
}
```

### Test manuel → /api/revalidate/test (dev uniquement)

```http
GET /api/revalidate/test?tag=post

ou

GET /api/revalidate/test?path=/posts/mon-article
```

## ✅ Checklist de Déploiement

### Développement

- [ ] `.env.local` créé avec `SANITY_REVALIDATE_SECRET`
- [ ] Webhook créé dans Sanity avec URL ngrok
- [ ] Test avec `/api/revalidate/test?tag=post`
- [ ] Modification d'un post et vérification

### Production (Vercel)

- [ ] Variable `SANITY_REVALIDATE_SECRET` ajoutée dans Vercel
- [ ] URL du webhook mise à jour vers Vercel
- [ ] Test en production
- [ ] Logs du webhook vérifiés (status 200)

## 🐛 Dépannage Rapide

| Problème                     | Solution                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| ❌ **Erreur 401**            | Secret différent entre webhook et `.env.local`               |
| ❌ **Erreur 400**            | Projection incorrecte (vérifiez le format `{"tags": [...]}`) |
| ❌ **Erreur 500**            | `SANITY_REVALIDATE_SECRET` manquant                          |
| ⚠️ **Contenu pas à jour**    | Videz le cache du navigateur, vérifiez les tags              |
| ⚠️ **Webhook pas déclenché** | Vérifiez le filter, vérifiez que le document correspond      |

## 📚 Documentation Complète

| Fichier                        | Description             |
| ------------------------------ | ----------------------- |
| `QUICK_START_REVALIDATION.md`  | Guide rapide 5 minutes  |
| `REVALIDATION_SETUP.md`        | Configuration détaillée |
| `WEBHOOK_EXAMPLES.md`          | 6 exemples de webhooks  |
| `CHANGELOG_REVALIDATION.md`    | Modifications apportées |
| `app/api/revalidate/README.md` | Documentation technique |

## 💡 Conseils

### ✨ Bonnes pratiques

- Utilisez des tags génériques (`post`, `page`) pour une revalidation large
- Testez toujours en dev avant de déployer en prod
- Gardez le même secret entre dev et prod
- Surveillez les logs du webhook régulièrement

### ⚡ Optimisations

- Un seul webhook pour tous les types de contenu (utilisez `select()`)
- Revalidation par tag plutôt que par path (plus efficace)
- Utilisez des tags spécifiques pour un contrôle fin

### 🔒 Sécurité

- Ne partagez jamais `SANITY_REVALIDATE_SECRET`
- Route `/test` automatiquement désactivée en production
- Validation HMAC sur toutes les routes de production
