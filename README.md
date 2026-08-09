# Light Static Blog

Blog personnel minimaliste avec Astro, TypeScript et Markdown.

## Stack

- Astro
- TypeScript
- Markdown pour les articles
- CSS simple (pas de framework frontend lourd)

## Prérequis

- Node.js 24 LTS (version de référence du projet)
- npm

Les fichiers `.nvmrc` et `.node-version` permettent aux gestionnaires de versions compatibles de sélectionner automatiquement Node.js 24. Avec `nvm`, exécutez `nvm use` avant d'installer les dépendances.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Le site est disponible en local sur `http://localhost:4321`.

## Build de production

```bash
npm run build
```

Cette commande génère un site **100 % statique** dans le dossier `dist/`.

Pour vérifier les types et lancer le build en une seule commande :

```bash
npm run validate
```

Le build requiert deux variables d'environnement :

- `SITE` : URL absolue du site (ex: `https://karlos-fr.github.io/light-static-blog` ou `https://votredomaine.tld`)
- `BASE_PATH` : base d'URL d'hébergement (ex: `/light-static-blog/` pour GitHub Pages, `/` pour OVH)

Exemple :

```bash
SITE="https://karlos-fr.github.io/light-static-blog" BASE_PATH="/light-static-blog/" npm run build
```

## Ajouter un article

- Crée un fichier dans `src/content/blog/` (ex: `2026-08-01-mon-article.md`).
- Utilise le frontmatter minimal ci-dessous (le slug vient du nom du fichier) :

```md
---
title: "Mon titre"
description: "Résumé court"
pubDate: 2026-08-01
updatedDate: 2026-08-01   # optionnel
tags:
  - javascript
  - astro
draft: false
cover: "/images/couverture.webp" # optionnel
---
```

Puis écris le contenu en Markdown.

- `draft: false` publie l’article.
- `draft: true` le garde en brouillon.
- `cover` référence une image placée dans `public/` depuis la racine publique ; une valeur vide est invalide.

Exemple de brouillon conservé dans `src/content/blog/` mais absent du site généré :

```md
---
title: "Article en préparation"
description: "Notes encore en cours de rédaction."
pubDate: 2026-08-09
tags:
  - brouillon
draft: true
---

Contenu non publié.
```

## Aperçu local du build

```bash
npm run preview
```

## Déploiement principal : OVH mutualisé

Le build doit être déposé tel quel dans le dossier `www/` de votre hébergement.

### Étapes

1. Construire le site

   ```bash
   SITE="https://votredomaine.tld" BASE_PATH="/" npm run build
   ```

2. Envoyer le contenu de `dist/` dans `www/` (FTP, SFTP ou gestionnaire de fichiers).

   Exemple (SFTP/SSH) :

   ```bash
   rsync -av --delete dist/ user@host:/chemin/vers/www/
   ```

3. Vérifier la présence des fichiers à la racine de `www/` :

   - `index.html`
   - `blog/`
   - `tags/`
   - `rss.xml`
   - `sitemap.xml`

Commande rapide (1 ligne) :

```bash
SITE="https://votredomaine.tld" BASE_PATH="/" npm run build && rsync -av --delete dist/ user@host:/chemin/vers/www/
```

### Note SEO (RSS/Sitemap)

Les flux RSS et sitemap utilisent la variable `SITE` pour générer des URL absolues.

Exemple de commande :

```bash
SITE="https://votredomaine.tld" BASE_PATH="/" npm run build
```

## GitHub Pages (CI/CD)

Le workflow GitHub Actions exécute le build avec :

- `SITE=https://karlos-fr.github.io/light-static-blog`
- `BASE_PATH=/light-static-blog/`

et déploie ensuite `dist/` automatiquement sur GitHub Pages.

## Déploiements mentionnés en option (non bloquants)

- GitHub Pages : possible pour des tests ou une diffusion secondaire.
- Vercel : possible pour des tests/hosting alternatif.

Ces options restent secondaires et ne changent pas l'architecture principale, qui reste **statique** (compatible OVH mutualisé).

## Contraintes respectées

- Pas de backend
- Pas de base de données
- Pas de CMS
- Pas d'API runtime
- Aucune dépendance backend en production

## Commandes de résumé

```bash
npm install
npm run dev
npm run build
npm run preview
```
