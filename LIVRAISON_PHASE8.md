# Phase 8 — Vérification finale de livraison

## 1) Vérifications fonctionnelles MVP

- [x] Page d’accueil
  - File: `src/pages/index.astro`
- [x] Page blog
  - File: `src/pages/blog/index.astro`
- [x] Page article
  - File: `src/pages/blog/[slug].astro`
- [x] Page À propos
  - File: `src/pages/about.astro`
- [x] Tags cliquables
  - Implémentés dans `src/pages/index.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`
- [x] Page par tag
  - File: `src/pages/tags/[tag].astro`
- [x] Page liste des tags
  - File: `src/pages/tags/index.astro`
- [x] RSS
  - File: `src/pages/rss.xml.ts`
- [x] Sitemap
  - File: `src/pages/sitemap.xml.ts`
- [x] 3 articles d’exemple
  - Files: `src/content/blog/*.md`

## 2) Vérifications architecture / contraintes

- [x] Projet 100% statique (`dist/` via Astro)
  - `astro.config.mjs` avec `output: 'static'` et `outDir: 'dist'`
- [x] Déploiement OVH prioritaire documenté
  - `README.md`
- [x] Pas de backend / DB / CMS / API runtime
  - Aucune dépendance serveur ajoutée
- [x] Stack minimale et maintenable
  - Astro + TypeScript + Markdown + CSS simple
- [x] Frontmatter minimal
  - `src/content/config.ts`

## 3) Vérifications design lisible (Phase 6)

- [x] CSS simple sans framework lourd
  - `src/styles/global.css`
- [x] Responsivité mobile
  - `src/styles/global.css` + `src/components/SiteNav.astro`
- [x] Blocs code lisibles
  - `src/styles/global.css`
- [x] Mode clair/sombre en amélioration secondaire (compatible)
  - `src/styles/global.css` via `prefers-color-scheme`

## 4) Points résiduels / actions recommandées

- [ ] Exécuter une vérification de build (`npm run build`) et vérifier le résultat dans `dist/`.
- [ ] Configurer `SITE` en production pour des liens RSS/sitemap corrects.
  - Noter: point déjà tracé dans `TODO.md`.
- [ ] Ajouter une ligne dans le README pour la commande de publication rapide OVH (si besoin de CI/CI/CD).
