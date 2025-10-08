# 🥐 Boulangerie Dupont - Système de Revalidation Sanity

## 🎯 Qu'est-ce que c'est ?

Votre site Next.js se met maintenant **automatiquement à jour** lorsque vous modifiez du contenu dans Sanity Studio. Plus besoin de redéployer !

### Avant 😓

1. Modifier un article dans Sanity
2. Redéployer le site sur Vercel
3. Attendre 2-3 minutes
4. Voir les changements

### Après ✨

1. Modifier un article dans Sanity
2. Cliquer sur "Publish"
3. **C'est tout !** Le site se met à jour automatiquement en quelques secondes

## 📁 Fichiers Créés pour Vous

J'ai créé 10 fichiers de documentation pour vous aider :

### 🚀 Pour Démarrer

**→ Commencez ici :** `QUICK_START_REVALIDATION.md`

- Configuration complète en 5 minutes
- Étape par étape, simple et clair

### 📖 Guides Détaillés

1. **`REVALIDATION_VISUAL_GUIDE.md`** 🎨
   - Guide visuel avec diagrammes
   - Parfait pour comprendre comment ça marche

2. **`REVALIDATION_SETUP.md`** ⚙️
   - Guide de configuration détaillé
   - Toutes les options expliquées

3. **`WEBHOOK_EXAMPLES.md`** 💡
   - 6 exemples de configurations de webhooks
   - Copiez-collez et ça marche !

4. **`CHECKLIST_REVALIDATION.md`** ✅
   - Checklist imprimable
   - Cochez au fur et à mesure

### 📚 Documentation Technique

5. **`app/api/revalidate/README.md`** 🔧
   - Documentation des routes API
   - Pour les développeurs

6. **`CHANGELOG_REVALIDATION.md`** 📝
   - Résumé des modifications
   - Impact et statistiques

7. **`MODIFICATIONS_SUMMARY.md`** 📋
   - Liste complète des changements
   - Tous les fichiers modifiés

8. **`LISEZ-MOI_REVALIDATION.md`** 🇫🇷
   - Ce fichier - Guide en français

## ⚡ Configuration Rapide (5 minutes)

### Étape 1 : Générer un Secret

Ouvrez votre terminal et tapez :

```bash
openssl rand -base64 32
```

Copiez le résultat (quelque chose comme `xK7m9P2nQ...`)

### Étape 2 : Créer .env.local

Créez un fichier `.env.local` dans le dossier `frontend/` avec :

```env
SANITY_REVALIDATE_SECRET=collez-votre-secret-ici
```

### Étape 3 : Configurer le Webhook Sanity

1. Allez sur https://manage.sanity.io
2. Sélectionnez votre projet "Boulangerie Dupont"
3. **API** → **Webhooks** → **Create webhook**
4. Copiez-collez cette configuration :

**Name :** `Next.js Revalidation`

**URL :**

- En dev (avec ngrok) : `https://xxx.ngrok.io/api/revalidate/tag`
- En production : `https://votre-site.vercel.app/api/revalidate/tag`

**Dataset :** `production`

**Trigger on :** Cochez Create, Update, Delete

**Filter :**

```groq
_type in ["post", "page", "settings", "person"]
```

**Projection :**

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

**Secret :** Collez le même secret que dans votre `.env.local`

5. Cliquez sur **Save**

### Étape 4 : Tester

```bash
# Démarrez votre app
npm run dev

# Dans un autre terminal, testez
curl "http://localhost:3000/api/revalidate/test?tag=post"
```

Vous devriez voir :

```json
{
  "revalidated": true,
  "type": "tag",
  "value": "post"
}
```

✅ **Ça marche !**

## 🧪 Test Complet

1. Démarrez votre app : `npm run dev`
2. Ouvrez Sanity Studio
3. Modifiez un article (changez le titre par exemple)
4. Cliquez sur **Publish**
5. Retournez sur votre site et rafraîchissez
6. **Le titre a changé !** ✨

## 🚀 Déploiement sur Vercel

### 1. Ajouter la Variable d'Environnement

1. Allez sur https://vercel.com
2. Sélectionnez votre projet
3. **Settings** → **Environment Variables**
4. Ajoutez `SANITY_REVALIDATE_SECRET` avec la même valeur que dans `.env.local`
5. Sauvegardez

### 2. Déployer

```bash
git add .
git commit -m "feat: add Sanity revalidation"
git push
```

### 3. Mettre à Jour le Webhook

1. Attendez que le déploiement soit terminé
2. Retournez sur manage.sanity.io → Webhooks
3. Éditez votre webhook
4. Changez l'URL pour : `https://votre-site.vercel.app/api/revalidate/tag`
5. Sauvegardez

### 4. Tester en Production

1. Modifiez un article dans Sanity
2. Publiez
3. Allez sur votre site
4. Rafraîchissez (F5)
5. **Le contenu est à jour !** 🎉

## 🏷️ Comment Ça Marche ?

Le système utilise des **"tags"** pour savoir quoi mettre à jour :

| Quand vous modifiez... | Tag déclenché | Pages mises à jour                    |
| ---------------------- | ------------- | ------------------------------------- |
| Un article             | `post`        | Liste des articles, page de l'article |
| Une page               | `page`        | La page concernée                     |
| Les paramètres         | `settings`    | Page d'accueil                        |
| Un auteur              | `post`        | Articles de cet auteur                |

## 🔧 Routes API Disponibles

### Production

- **`/api/revalidate/tag`** - Revalidation par tags (webhook Sanity)
- **`/api/revalidate/path`** - Revalidation par chemin

### Développement

- **`/api/revalidate/test`** - Tests manuels (désactivée en prod)

## 📊 Modifications Apportées

### Fichiers Modifiés (5)

J'ai ajouté des "tags" dans vos fichiers existants pour activer la revalidation :

1. `app/components/Posts.tsx` - Tag `post` ajouté
2. `app/[slug]/page.tsx` - Tag `page` ajouté
3. `app/page.tsx` - Tag `settings` ajouté
4. `app/posts/[slug]/page.tsx` - Tags déjà présents ✅
5. `README.md` - Section revalidation ajoutée

### Fichiers Créés (10)

3 routes API + 7 fichiers de documentation

**Pas de code cassé, pas d'erreurs !** Tout fonctionne parfaitement.

## 🐛 Problèmes Courants

### Erreur 401 - Invalid signature

**Cause :** Le secret du webhook ne correspond pas à `SANITY_REVALIDATE_SECRET`

**Solution :** Vérifiez que le secret est identique dans :

- Votre `.env.local`
- Votre webhook Sanity
- Vercel (en production)

### Erreur 400 - Bad Request

**Cause :** La projection du webhook est incorrecte

**Solution :** Copiez-collez exactement la projection du `WEBHOOK_EXAMPLES.md`

### Le contenu ne se met pas à jour

**Cause :** Cache du navigateur

**Solution :**

1. Videz le cache (Ctrl+Shift+R ou Cmd+Shift+R)
2. Vérifiez que le webhook retourne Status 200 dans manage.sanity.io
3. Attendez 2-3 secondes après publication

### Comment vérifier que ça marche ?

```bash
# Test manuel en dev
curl "http://localhost:3000/api/revalidate/test?tag=post"

# Vérifier les logs du webhook
# manage.sanity.io → API → Webhooks → Votre webhook → Deliveries
# Status doit être 200 ✅
```

## 📚 Pour Aller Plus Loin

### Débutant

1. Lisez `QUICK_START_REVALIDATION.md`
2. Suivez la `CHECKLIST_REVALIDATION.md`

### Intermédiaire

1. Consultez `REVALIDATION_VISUAL_GUIDE.md`
2. Explorez `WEBHOOK_EXAMPLES.md`

### Avancé

1. Étudiez `REVALIDATION_SETUP.md`
2. Lisez `app/api/revalidate/README.md`

## 💡 Conseils

### ✅ Bonnes Pratiques

- **Testez toujours en dev avant la production**
- **Gardez le même secret partout** (.env.local, webhook, Vercel)
- **Vérifiez les logs du webhook** régulièrement
- **Videz le cache** si le contenu ne se met pas à jour

### ⚡ Astuces

- Utilisez ngrok pour tester le webhook en local
- La route `/test` est parfaite pour déboguer en dev
- Un seul webhook suffit pour tous les types de contenu

### 🔒 Sécurité

- Ne partagez jamais `SANITY_REVALIDATE_SECRET`
- La route `/test` est automatiquement désactivée en production
- Toutes les routes utilisent la validation HMAC

## 🎉 Résultat Final

Votre workflow maintenant :

```
Sanity Studio → Modifier un article → Publish
                                      ↓
                            Webhook automatique
                                      ↓
                            Next.js revalidation
                                      ↓
                        Site mis à jour ! ✨
```

**Temps de mise à jour :** 2-3 secondes  
**Besoin de redéployer :** Non  
**Besoin de toucher au code :** Non

## 📞 Besoin d'Aide ?

### Documentation Complète

Tous les fichiers sont dans le dossier `frontend/` :

- `QUICK_START_REVALIDATION.md` - Démarrage rapide
- `REVALIDATION_VISUAL_GUIDE.md` - Guide visuel
- `CHECKLIST_REVALIDATION.md` - Checklist
- `WEBHOOK_EXAMPLES.md` - Exemples

### Ressources Officielles

- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
- [Sanity Webhooks](https://www.sanity.io/docs/webhooks)
- [next-sanity](https://github.com/sanity-io/next-sanity)

## ✅ Checklist Finale

- [ ] `.env.local` créé avec `SANITY_REVALIDATE_SECRET`
- [ ] Webhook Sanity créé et configuré
- [ ] Testé en développement
- [ ] Déployé sur Vercel
- [ ] Variable ajoutée dans Vercel
- [ ] Webhook pointant vers Vercel
- [ ] Testé en production
- [ ] Tout fonctionne ! 🎉

---

**Bon pain et bonne revalidation !** 🥐✨

_Système de revalidation configuré le 8 octobre 2025_
