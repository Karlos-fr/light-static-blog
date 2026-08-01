# TODO

- [x] Ajouter la configuration de l'URL du site pour les flux RSS et sitemap (définir `SITE` en production).
  - Exemple : `https://www.votre-domaine.tld`
  - Fait via `astro.config.mjs` (`site`) et lu par `import.meta.env.SITE` dans `src/pages/rss.xml.ts` et `src/pages/sitemap.xml.ts`.
