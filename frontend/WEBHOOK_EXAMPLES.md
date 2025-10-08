# Exemples de Configuration de Webhooks Sanity

Ce document contient des exemples de configurations de webhooks pour différents scénarios de revalidation.

## 📝 Webhook 1 : Revalidation des Posts (par tags)

**Nom:** `Revalidate Posts (Tag-based)`

**URL:** `https://votre-domaine.com/api/revalidate/tag`

**Dataset:** `production`

**Trigger on:**

- ✅ Create
- ✅ Update
- ✅ Delete

**Filter:**

```groq
_type == "post"
```

**Projection:**

```groq
{
  "tags": ["post"]
}
```

**Secret:** Votre `SANITY_REVALIDATE_SECRET`

---

## 📄 Webhook 2 : Revalidation des Pages (par tags)

**Nom:** `Revalidate Pages (Tag-based)`

**URL:** `https://votre-domaine.com/api/revalidate/tag`

**Dataset:** `production`

**Trigger on:**

- ✅ Create
- ✅ Update
- ✅ Delete

**Filter:**

```groq
_type == "page"
```

**Projection:**

```groq
{
  "tags": ["page"]
}
```

**Secret:** Votre `SANITY_REVALIDATE_SECRET`

---

## ⚙️ Webhook 3 : Revalidation des Settings (par tags)

**Nom:** `Revalidate Settings (Tag-based)`

**URL:** `https://votre-domaine.com/api/revalidate/tag`

**Dataset:** `production`

**Trigger on:**

- ✅ Create
- ✅ Update
- ✅ Delete

**Filter:**

```groq
_type == "settings"
```

**Projection:**

```groq
{
  "tags": ["settings"]
}
```

**Secret:** Votre `SANITY_REVALIDATE_SECRET`

---

## 🎯 Webhook 4 : Revalidation d'un Post Spécifique (par chemin)

**Nom:** `Revalidate Single Post (Path-based)`

**URL:** `https://votre-domaine.com/api/revalidate/path`

**Dataset:** `production`

**Trigger on:**

- ✅ Create
- ✅ Update
- ✅ Delete

**Filter:**

```groq
_type == "post"
```

**Projection:**

```groq
{
  "path": "/posts/" + slug.current,
  "type": "page"
}
```

**Secret:** Votre `SANITY_REVALIDATE_SECRET`

**Note:** Cette approche revalide uniquement la page spécifique du post modifié, pas la liste des posts.

---

## 🔄 Webhook 5 : Revalidation Multiple (Posts + Auteurs)

**Nom:** `Revalidate Posts and Authors (Multi-tag)`

**URL:** `https://votre-domaine.com/api/revalidate/tag`

**Dataset:** `production`

**Trigger on:**

- ✅ Create
- ✅ Update
- ✅ Delete

**Filter:**

```groq
_type == "post" || _type == "person"
```

**Projection:**

```groq
{
  "tags": select(
    _type == "post" => ["post"],
    _type == "person" => ["post"],
    []
  )
}
```

**Secret:** Votre `SANITY_REVALIDATE_SECRET`

**Note:** Quand un auteur est modifié, cela revalide aussi les posts car ils affichent les informations de l'auteur.

---

## 🌐 Webhook 6 : Revalidation Globale (tout le site)

**Nom:** `Revalidate All Content (Global)`

**URL:** `https://votre-domaine.com/api/revalidate/tag`

**Dataset:** `production`

**Trigger on:**

- ✅ Create
- ✅ Update
- ✅ Delete

**Filter:**

```groq
_type in ["post", "page", "settings", "person"]
```

**Projection:**

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

**Secret:** Votre `SANITY_REVALIDATE_SECRET`

**Note:** Cette configuration couvre tous les types de contenu principaux. C'est la plus complète.

---

## 💡 Recommandation

Pour la plupart des projets, **configurez le Webhook 6 (Revalidation Globale)**. Il gère tous les types de contenu de manière intelligente :

- Modification d'un post → Revalide tag `post`
- Modification d'une page → Revalide tag `page`
- Modification des settings → Revalide tag `settings`
- Modification d'un auteur → Revalide tag `post` (car les posts affichent les auteurs)

## 🔍 Vérifier les Webhooks

Après avoir créé vos webhooks :

1. Allez sur [manage.sanity.io](https://manage.sanity.io)
2. Sélectionnez votre projet
3. Allez dans **API** → **Webhooks**
4. Cliquez sur votre webhook
5. Allez dans l'onglet **Deliveries** pour voir l'historique des requêtes
6. Vérifiez que les requêtes retournent un status `200` (succès)

## 🐛 Dépannage

### Erreur 401 - Invalid signature

- Vérifiez que le secret du webhook correspond à `SANITY_REVALIDATE_SECRET` dans votre `.env.local`

### Erreur 400 - Bad Request

- Vérifiez que la projection retourne bien un objet avec un champ `tags` (tableau)

### Erreur 500 - Server Error

- Vérifiez que `SANITY_REVALIDATE_SECRET` est bien défini dans votre environnement
- Consultez les logs de votre application Next.js

### Le contenu ne se met pas à jour

- Vérifiez que les tags dans le webhook correspondent aux tags utilisés dans vos requêtes `sanityFetch`
- Essayez de vider le cache de votre navigateur
- En développement, utilisez la route `/api/revalidate/test?tag=post` pour tester manuellement
