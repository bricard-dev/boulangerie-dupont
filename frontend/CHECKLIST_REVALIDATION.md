# ✅ Checklist - Configuration Revalidation Sanity

Imprimez cette checklist ou gardez-la ouverte pendant la configuration.

---

## 📋 Phase 1 : Configuration Locale (5 min)

### Étape 1.1 : Générer le Secret

```bash
openssl rand -base64 32
```

- [ ] Commande exécutée
- [ ] Secret copié dans le presse-papier

### Étape 1.2 : Créer .env.local

```bash
cd frontend
touch .env.local
```

- [ ] Fichier créé

### Étape 1.3 : Ajouter le Secret

Ajouter dans `.env.local` :

```env
SANITY_REVALIDATE_SECRET=votre-secret-ici
```

- [ ] Secret ajouté et sauvegardé

### Étape 1.4 : Démarrer l'Application

```bash
npm run dev
```

- [ ] Application démarrée sur http://localhost:3000

---

## 🌐 Phase 2 : Configuration Sanity (5 min)

### Étape 2.1 : Accéder à Sanity

- [ ] Ouvert https://manage.sanity.io
- [ ] Projet sélectionné
- [ ] Onglet **API** → **Webhooks**

### Étape 2.2 : Créer le Webhook

- [ ] Clic sur **Create webhook**

### Étape 2.3 : Remplir le Formulaire

**Name:**

- [ ] `Next.js Revalidation`

**URL:**

- [ ] Dev : `https://xxx.ngrok.io/api/revalidate/tag` (avec ngrok)
- [ ] Prod : `https://votre-domaine.com/api/revalidate/tag`

**Dataset:**

- [ ] `production` sélectionné

**Trigger on:**

- [ ] ✅ Create
- [ ] ✅ Update
- [ ] ✅ Delete

**Filter:**

```groq
_type in ["post", "page", "settings", "person"]
```

- [ ] Filter copié et collé

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

- [ ] Projection copiée et collée

**HTTP method:**

- [ ] `POST` sélectionné

**Secret:**

- [ ] Secret `SANITY_REVALIDATE_SECRET` collé (le même que .env.local)

### Étape 2.4 : Sauvegarder

- [ ] Clic sur **Save**
- [ ] Webhook créé avec succès

---

## 🧪 Phase 3 : Tests (5 min)

### Test 1 : Route de Test Manuelle

**Commande:**

```bash
curl "http://localhost:3000/api/revalidate/test?tag=post"
```

**Résultat attendu:**

```json
{
  "revalidated": true,
  "type": "tag",
  "value": "post",
  "now": 1234567890
}
```

- [ ] Test réussi
- [ ] `"revalidated": true` présent

### Test 2 : Configuration ngrok (pour webhook en local)

**Terminal 1:**

```bash
npm run dev
```

**Terminal 2:**

```bash
ngrok http 3000
```

- [ ] ngrok démarré
- [ ] URL copiée (ex: `https://abc123.ngrok.io`)
- [ ] URL mise à jour dans le webhook Sanity

### Test 3 : Modification dans Sanity

- [ ] Ouvert Sanity Studio
- [ ] Modifié un post existant (changé le titre)
- [ ] Cliqué sur **Publish**
- [ ] Attendu 2-3 secondes

### Test 4 : Vérification du Webhook

- [ ] Retour sur manage.sanity.io
- [ ] **API** → **Webhooks** → Votre webhook
- [ ] Onglet **Deliveries**
- [ ] Dernière requête visible
- [ ] **Status: 200** ✅

### Test 5 : Vérification Visuelle

- [ ] Site ouvert dans le navigateur
- [ ] Contenu du post mis à jour
- [ ] Changement visible ✨

---

## 🚀 Phase 4 : Déploiement Production (10 min)

### Étape 4.1 : Variables d'Environnement Vercel

- [ ] Ouvert https://vercel.com
- [ ] Projet sélectionné
- [ ] **Settings** → **Environment Variables**
- [ ] Ajouté `SANITY_REVALIDATE_SECRET` avec la même valeur
- [ ] Sauvegardé

### Étape 4.2 : Commit et Push

```bash
git add .
git commit -m "feat: add Sanity revalidation system"
git push
```

- [ ] Changements committés
- [ ] Push effectué
- [ ] Vercel déployant...

### Étape 4.3 : Mise à Jour du Webhook

- [ ] Déploiement Vercel terminé
- [ ] URL de production copiée (ex: `https://mon-site.vercel.app`)
- [ ] Retour sur manage.sanity.io → Webhooks
- [ ] Édition du webhook
- [ ] URL mise à jour : `https://mon-site.vercel.app/api/revalidate/tag`
- [ ] Sauvegardé

### Étape 4.4 : Test en Production

- [ ] Site de production ouvert
- [ ] Noté le contenu d'un post
- [ ] Modifié ce post dans Sanity Studio
- [ ] Publié
- [ ] Rafraîchi le site (F5)
- [ ] Contenu mis à jour ✅

### Étape 4.5 : Vérification des Logs

- [ ] manage.sanity.io → Webhooks → Deliveries
- [ ] Dernière requête avec **Status: 200**
- [ ] Pas d'erreurs

---

## ✅ Validation Finale

### Configuration

- [ ] `.env.local` contient `SANITY_REVALIDATE_SECRET`
- [ ] Vercel contient `SANITY_REVALIDATE_SECRET`
- [ ] Les deux secrets sont **identiques**

### Webhook Sanity

- [ ] Webhook créé
- [ ] URL pointant vers production
- [ ] Filter et Projection corrects
- [ ] Secret configuré

### Tests

- [ ] Test manuel réussi (`/api/revalidate/test`)
- [ ] Test webhook réussi (Status 200)
- [ ] Test visuel réussi (contenu mis à jour)

### Production

- [ ] Déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Webhook pointant vers Vercel
- [ ] Test en production réussi

---

## 🎉 Félicitations !

Votre système de revalidation est maintenant opérationnel !

**Ce qui fonctionne maintenant :**

- ✅ Modification de post → Mise à jour automatique du site
- ✅ Modification de page → Mise à jour automatique du site
- ✅ Modification des settings → Mise à jour automatique du site
- ✅ Pas besoin de redéployer pour voir les changements

---

## 📚 En Cas de Problème

| Problème              | Fichier à consulter                                 |
| --------------------- | --------------------------------------------------- |
| Erreur 401            | `QUICK_START_REVALIDATION.md` - Section "Problèmes" |
| Erreur 400            | `WEBHOOK_EXAMPLES.md` - Vérifier la projection      |
| Contenu pas à jour    | `REVALIDATION_VISUAL_GUIDE.md` - Dépannage          |
| Webhook pas déclenché | `app/api/revalidate/README.md` - Dépannage          |

---

## 📞 Ressources

- Documentation : `QUICK_START_REVALIDATION.md`
- Exemples : `WEBHOOK_EXAMPLES.md`
- Dépannage : `REVALIDATION_VISUAL_GUIDE.md`
- Modifications : `MODIFICATIONS_SUMMARY.md`

---

**Date de configuration :** ******\_\_\_******

**Temps total :** ~15 minutes ⏱️

**Statut :** 🎯 TERMINÉ
