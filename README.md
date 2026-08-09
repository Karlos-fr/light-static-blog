# Light Static Blog

Blog personnel minimaliste avec Astro, TypeScript et Markdown.

## Stack

- Astro
- TypeScript
- Markdown pour les articles
- CSS simple, sans framework frontend lourd

## Architecture et arborescence

Le projet est entièrement statique : Astro transforme les pages et les articles Markdown en fichiers HTML dans `dist/`. Aucun serveur Node, backend, CMS ou base de données n'est nécessaire en production.

```text
.
├── public/                     # Fichiers statiques copiés tels quels
│   ├── images/                 # Couvertures des articles
│   ├── robots.txt
│   ├── rss.xsl                 # Présentation du flux RSS dans un navigateur
│   └── sitemap.xsl             # Présentation du sitemap dans un navigateur
├── src/
│   ├── components/             # Listes, tags, dates et couvertures
│   ├── content/
│   │   ├── blog/               # Articles Markdown ; le nom devient le slug
│   │   ├── config.ts           # Schéma et validation du frontmatter
│   │   └── TAGGING.md          # Convention de tags
│   ├── layouts/
│   │   └── BaseLayout.astro    # Structure HTML, navigation et SEO
│   ├── lib/                    # Chargement du contenu et construction des URL
│   ├── pages/
│   │   ├── [slug].astro        # Pages des articles
│   │   ├── tags/               # Index et pages de tags
│   │   ├── about.astro
│   │   ├── index.astro         # Accueil et liste complète des articles
│   │   ├── rss.xml.ts
│   │   └── sitemap.xml.ts
│   └── styles/
│       └── global.css          # Design clair/sombre et responsive
├── astro.config.mjs            # Build statique et chemin public
├── ARTICLE_TEMPLATE.md         # Modèle pour rédiger un article
├── package.json                # Scripts et dépendances
└── README.md
```

Les articles sont chargés depuis la collection `blog`, triés par date décroissante et filtrés afin d'exclure `draft: true`. Les composants partagés centralisent l'affichage des listes, dates, couvertures et tags.

Le chemin d'hébergement est défini uniquement par `BASE_PATH`. Par exemple, avec `BASE_PATH=/blog/`, l'accueil est publié sous `/blog/` et chaque article sous `/blog/<slug>/`.

## Prérequis

- Node.js 24 LTS
- npm

Les fichiers `.nvmrc` et `.node-version` permettent aux gestionnaires compatibles de sélectionner automatiquement la bonne version de Node.js.

## Installation

```bash
npm install
```

## Développement

```bash
SITE="http://localhost:4321" BASE_PATH="/" npm run dev
```

Le site est alors disponible sur `http://localhost:4321`.

Sous PowerShell :

```powershell
$env:SITE="http://localhost:4321"
$env:BASE_PATH="/"
npm run dev
```

## Configuration des URL

Deux variables d'environnement sont obligatoires :

- `SITE` : origine publique du site, sans chemin final, par exemple `https://example.com` ;
- `BASE_PATH` : chemin public terminé par `/`, par exemple `/` ou `/blog/`.

Ces valeurs alimentent les liens internes, les URL canonical, les métadonnées sociales, le flux RSS et le sitemap.

## Build de production

Exemple pour un site publié sous `https://example.com/blog/` :

```bash
SITE="https://example.com" BASE_PATH="/blog/" npm run validate
```

Sous PowerShell :

```powershell
$env:SITE="https://example.com"
$env:BASE_PATH="/blog/"
npm run validate
```

La commande `validate` vérifie les types puis génère le site statique dans `dist/`. Pour lancer uniquement la génération :

```bash
npm run build
```

## Ajouter un article

Créer un fichier dans `src/content/blog/`, par exemple `mon-article.md`. Le nom du fichier devient le slug public.

```md
---
title: "Mon titre"
description: "Résumé court"
pubDate: 2026-08-01
updatedDate: 2026-08-02 # optionnel
tags:
  - javascript
  - astro
draft: false
cover: "/images/couverture.webp" # optionnel
---

Contenu de l'article en Markdown.
```

- `draft: false` publie l'article.
- `draft: true` l'exclut des pages, des tags, du RSS et du sitemap.
- `cover` référence un fichier placé dans `public/` depuis la racine publique.
- Les slugs correspondant à une route réservée, comme `about`, `blog` ou `tags`, sont refusés au build.

Le fichier `ARTICLE_TEMPLATE.md` peut servir de point de départ.

## Publier un article

1. Créer l'article dans `src/content/blog/`.
2. Conserver `draft: true` pendant la rédaction.
3. Placer l'éventuelle couverture dans `public/images/`.
4. Relire l'article puis passer `draft` à `false`.
5. Exécuter `npm run validate` avec les valeurs de production de `SITE` et `BASE_PATH`.
6. Vérifier éventuellement le résultat avec `npm run preview`.
7. Déployer le contenu du dossier `dist/` sur l'hébergement statique.

### Checklist avant publication

- [ ] Le titre et la description correspondent au contenu.
- [ ] `pubDate` est correcte.
- [ ] `updatedDate` n'est renseignée qu'en cas de mise à jour.
- [ ] Les tags sont cohérents avec `src/content/TAGGING.md`.
- [ ] La couverture éventuelle existe dans `public/`.
- [ ] `draft: false` est défini.
- [ ] `npm run validate` passe sans erreur.

## Aperçu local du build

Après avoir défini `SITE` et `BASE_PATH` :

```bash
npm run preview
```

## Déploiement

Le projet est compatible avec tout hébergement capable de servir des fichiers statiques.

1. Définir `SITE` et `BASE_PATH` avec les valeurs de la cible.
2. Exécuter `npm run validate`.
3. Envoyer le **contenu** de `dist/`, et non le dossier lui-même, vers la racine publique choisie.
4. Vérifier l'accueil, un article, `rss.xml` et `sitemap.xml`.

Le dossier `dist/` est un artefact généré, ignoré par Git et destiné à être reconstruit avant chaque déploiement.

## Contraintes

- Pas de backend
- Pas de base de données
- Pas de CMS
- Pas d'API à l'exécution
- Aucun JavaScript client nécessaire au fonctionnement du site

## Commandes utiles

```bash
npm install
SITE="http://localhost:4321" BASE_PATH="/" npm run dev
SITE="https://example.com" BASE_PATH="/blog/" npm run validate
SITE="https://example.com" BASE_PATH="/blog/" npm run preview
```
