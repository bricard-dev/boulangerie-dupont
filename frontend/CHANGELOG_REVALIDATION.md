# Changelog - Mise en place de la Revalidation Sanity

## 📅 Date : Octobre 8, 2025

## 🎯 Objectif

Mettre en place un système de revalidation automatique pour que le site Next.js se mette à jour automatiquement lorsque le contenu est modifié dans Sanity Studio.

## ✨ Modifications apportées

### 1. Routes API ajoutées

#### ✅ `/app/api/revalidate/tag/route.ts` (existant - déjà présent)

Route principale pour la revalidation par tags via webhooks Sanity.

#### ✅ `/app/api/revalidate/path/route.ts` (nouveau)

Route pour revalider un chemin spécifique (utile pour les pages individuelles).

#### ✅ `/app/api/revalidate/test/route.ts` (nouveau)

Route de test pour vérifier manuellement la revalidation en développement.

### 2. Tags ajoutés dans les composants

#### `/app/components/Posts.tsx`

- `MorePosts` : Ajout du tag `['post']`
- `AllPosts` : Ajout du tag `['post']`

#### `/app/[slug]/page.tsx`

- `generateStaticParams` : Ajout du tag `['page']`
- `generateMetadata` : Ajout du tag `['page']`
- `Page` (component) : Ajout du tag `['page']`

#### `/app/page.tsx`

- `Page` (home) : Ajout du tag `['settings']`

#### `/app/posts/[slug]/page.tsx` (existant)

- Tags déjà configurés : `['post', 'author', 'category']`

### 3. Documentation créée

#### 📘 `QUICK_START_REVALIDATION.md`

Guide de démarrage rapide pour configurer la revalidation en 5 minutes.

#### 📘 `REVALIDATION_SETUP.md`

Guide détaillé avec toutes les étapes de configuration.

#### 📘 `WEBHOOK_EXAMPLES.md`

Exemples de configurations de webhooks pour différents scénarios.

#### 📘 `app/api/revalidate/README.md`

Documentation technique des routes API de revalidation.

## 🏷️ Tags configurés

L'application utilise maintenant les tags suivants pour la revalidation :

| Tag        | Usage              | Pages concernées                                  |
| ---------- | ------------------ | ------------------------------------------------- |
| `post`     | Articles de blog   | Liste des posts, détails des posts, posts récents |
| `page`     | Pages dynamiques   | Pages avec slug personnalisé                      |
| `settings` | Paramètres globaux | Page d'accueil                                    |
| `author`   | Auteurs            | Détails des posts (affichage de l'auteur)         |
| `category` | Catégories         | Détails des posts (si utilisé)                    |

## 🔧 Configuration requise

### Variables d'environnement

Ajoutez dans `.env.local` :

```env
SANITY_REVALIDATE_SECRET=votre-secret-généré
```

### Webhook Sanity

Configuration recommandée :

- **URL :** `https://votre-domaine.com/api/revalidate/tag`
- **Filter :** `_type in ["post", "page", "settings", "person"]`
- **Projection :**
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

## 🎯 Comportement

### Avant

- Modifications dans Sanity → Aucun impact sur le site en production
- Nécessité de redéployer pour voir les changements

### Après

- Modifications dans Sanity → Webhook automatique → Revalidation Next.js → Site mis à jour ! ✨
- Pas besoin de redéployer
- Mise à jour en quelques secondes

## 📊 Impact sur les performances

### Avantages

- ✅ Site toujours à jour sans redéploiement
- ✅ Revalidation ciblée (uniquement ce qui a changé)
- ✅ Cache Next.js optimisé
- ✅ Pas d'impact sur les performances du site

### Considérations

- La première visite après une revalidation peut être légèrement plus lente (re-génération de la page)
- Les visites suivantes bénéficient du cache

## 🧪 Tests effectués

- ✅ Routes API créées
- ✅ Tags ajoutés dans toutes les requêtes
- ✅ Pas d'erreurs de linting
- ✅ TypeScript validé

## 📋 Prochaines étapes

1. [ ] Configurer `.env.local` avec `SANITY_REVALIDATE_SECRET`
2. [ ] Créer le webhook dans Sanity (manage.sanity.io)
3. [ ] Tester en développement avec `/api/revalidate/test`
4. [ ] Tester avec un vrai webhook (via ngrok si en local)
5. [ ] Déployer sur Vercel avec les variables d'environnement
6. [ ] Mettre à jour l'URL du webhook pour pointer vers Vercel
7. [ ] Tester en production

## 📚 Documentation à consulter

1. **Démarrage rapide** : `QUICK_START_REVALIDATION.md`
2. **Configuration détaillée** : `REVALIDATION_SETUP.md`
3. **Exemples de webhooks** : `WEBHOOK_EXAMPLES.md`
4. **Documentation API** : `app/api/revalidate/README.md`

## 🆘 Support

En cas de problème :

1. Consultez la section "Dépannage" dans `QUICK_START_REVALIDATION.md`
2. Vérifiez les logs du webhook dans manage.sanity.io
3. Consultez les logs de votre application Next.js

## 📝 Notes techniques

- Utilisation de `revalidateTag()` de Next.js pour la revalidation par tags
- Utilisation de `revalidatePath()` pour la revalidation par chemins
- Validation HMAC des webhooks avec `parseBody` de `next-sanity/webhook`
- Route de test désactivée automatiquement en production pour la sécurité
