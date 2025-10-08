# 🚀 Guide de Démarrage Rapide - Revalidation Sanity

Configuration en 5 minutes pour activer la revalidation automatique de vos posts.

## ✅ Checklist

- [ ] Variables d'environnement configurées
- [ ] Webhook Sanity créé
- [ ] Test effectué

## 1. Configuration .env.local (2 min)

Créez ou modifiez `/frontend/.env.local` :

```bash
# Générer un secret
openssl rand -base64 32
```

Ajoutez le secret dans `.env.local` :

```env
SANITY_REVALIDATE_SECRET=votre-secret-généré-ici
```

## 2. Créer le Webhook Sanity (2 min)

1. Allez sur [manage.sanity.io](https://manage.sanity.io)
2. Sélectionnez votre projet
3. **API** → **Webhooks** → **Create webhook**
4. Remplissez :
   - **Name:** `Next.js Revalidation`
   - **URL:**
     - Production : `https://votre-domaine.com/api/revalidate/tag`
     - Dev (avec ngrok) : `https://xxx.ngrok.io/api/revalidate/tag`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:**
     ```groq
     _type in ["post", "page", "settings", "person"]
     ```
   - **Projection:**
     ```groq
     {
       "tags": select(
         _type == "post" => ["post"],
         _type == "page" => ["page"],
         _type == "settings" => ["settings"],
         _type == "person" => ["post"],
         []
       )
     }
     ```
   - **Secret:** Collez le même secret que `SANITY_REVALIDATE_SECRET`
5. **Save**

## 3. Test (1 min)

### Option A : Test en développement local

```bash
# Terminal 1 : Démarrez Next.js
cd frontend
npm run dev

# Terminal 2 : Test manuel
curl "http://localhost:3000/api/revalidate/test?tag=post"
```

Vous devriez voir :

```json
{
  "revalidated": true,
  "type": "tag",
  "value": "post",
  "now": 1234567890
}
```

### Option B : Test via Sanity Studio

1. Ouvrez Sanity Studio
2. Modifiez un post existant (changez le titre par exemple)
3. Publiez
4. Vérifiez dans Sanity : **API** → **Webhooks** → votre webhook → **Deliveries**
5. La dernière requête doit avoir un status `200`

### Option C : Test avec ngrok (pour tester le webhook en local)

```bash
# Terminal 1 : Next.js
npm run dev

# Terminal 2 : ngrok
ngrok http 3000

# Copiez l'URL ngrok (ex: https://abc123.ngrok.io)
# Utilisez cette URL dans le webhook : https://abc123.ngrok.io/api/revalidate/tag
```

## 4. Déploiement sur Vercel

1. **Variables d'environnement**
   - Allez dans Vercel : **Settings** → **Environment Variables**
   - Ajoutez `SANITY_REVALIDATE_SECRET` avec la même valeur

2. **Mettre à jour le webhook**
   - Changez l'URL du webhook pour pointer vers votre domaine Vercel
   - `https://votre-app.vercel.app/api/revalidate/tag`

3. **Déployez** : `git push`

## 🎉 C'est fini !

Maintenant, chaque fois que vous modifiez du contenu dans Sanity, votre site Next.js se mettra automatiquement à jour.

## 🔍 Vérifier que ça fonctionne

1. Ouvrez votre site en production
2. Notez le contenu d'un post
3. Modifiez ce post dans Sanity Studio et publiez
4. Rafraîchissez votre site (attendez 2-3 secondes)
5. Le contenu doit être mis à jour ✨

## ❓ Problèmes ?

### Le contenu ne se met pas à jour

1. Vérifiez les logs du webhook dans Sanity (doit être `200`)
2. Vérifiez que le secret est identique dans `.env.local` et dans le webhook
3. Videz le cache de votre navigateur
4. Vérifiez les logs de votre application Next.js

### Erreur de signature (401)

→ Le secret `SANITY_REVALIDATE_SECRET` ne correspond pas entre votre `.env.local` et le webhook Sanity

### Erreur 400 - Bad Request

→ La projection du webhook ne retourne pas le bon format. Vérifiez qu'elle retourne bien `{"tags": ["..."]}`.

## 📚 Pour aller plus loin

- Consultez `REVALIDATION_SETUP.md` pour une configuration détaillée
- Consultez `WEBHOOK_EXAMPLES.md` pour d'autres exemples de webhooks

## 🆘 Besoin d'aide ?

Documentation officielle :

- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
- [Sanity Webhooks](https://www.sanity.io/docs/webhooks)
- [next-sanity](https://github.com/sanity-io/next-sanity)
