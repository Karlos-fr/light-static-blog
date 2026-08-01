# Light Static Blog

Blog personnel minimaliste avec Astro, TypeScript et Markdown.

## Stack

- Astro
- TypeScript
- Markdown pour les articles
- CSS simple (pas de framework frontend lourd)

## Prérequis

- Node.js 18+
- npm

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

## Aperçu local du build

```bash
npm run preview
```

## Déploiement principal : OVH mutualisé

Le build doit être déposé tel quel dans le dossier `www/` de votre hébergement.

### Étapes

1. Construire le site

   ```bash
   npm run build
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

### Note SEO (RSS/Sitemap)

Les flux utilisent la variable d’environnement `SITE` si elle est définie.

- OVH (exemple de build local ou CI) :

  ```bash
  SITE=https://votredomaine.tld npm run build
  ```

## Déploiements mentionnés en option (non bloquants)

- GitHub Pages : possible pour des tests ou une diffusion secondaire.
- Vercel : possible pour des tests/hosting alternatif.

Ces options restent secondaires et ne changent pas l’architecture principale, qui reste **statique** (compatible OVH mutualisé).

## Contraintes respectées

- Pas de backend
- Pas de base de données
- Pas de CMS
- Pas d’API runtime
- Aucune dépendance backend en production

## Commandes de résumé

```bash
npm install
npm run dev
npm run build
npm run preview
```
