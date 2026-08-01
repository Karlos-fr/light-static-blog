# Plan de réalisation — Blog statique Astro (version resserrée)

Objectif : livrer un blog 100% statique, simple, lisible, maintenable, sans sur-ingénierie.

- Déploiement principal : OVH mutualisé (dossier `dist/` uploadable tel quel dans `www/`).
- GitHub Pages / Vercel : mentionnés uniquement en option dans le README, sans influencer l’architecture.
- Pas de backend, pas de serveur Node en production, pas de DB, pas de CMS, pas d’API runtime.
- Priorité : Markdown simple d’abord. MDX seulement si la valeur ajoutée est claire.

## Phase 1 — Base projet et contraintes statiques

- [ ] Initialiser un projet Astro + TypeScript.
- [ ] Appliquer une configuration strictement statique : build vers `dist/`.
- [ ] Vérifier qu’aucune dépendance de framework UI (React/Vue/Svelte) n’est introduite.
- [ ] Définir l’arborescence minimale : `src/pages`, `src/layouts`, `src/components`, `src/content/blog`, `src/styles`, `public`.
- [ ] Rédiger les conventions de nommage simples (fichiers Markdown = slug par défaut).

## Phase 2 — Modèle de contenu minimal

- [ ] Définir le frontmatter minimal dans le collection schema :
  - `title`
  - `description`
  - `pubDate`
  - `updatedDate` (optionnel)
  - `tags`
  - `draft`
  - `cover` (optionnel)
- [ ] Ne pas définir de champ `slug` et utiliser le nom de fichier comme slug.
- [ ] Mettre en place le chargement des posts depuis Markdown uniquement.
- [ ] Préparer une règle de tri/filtrage : date descendante + exclusif `draft: true`.
- [ ] Rédiger brièvement la convention de tags (liste simple, casse, séparation).

## Phase 3 — Contenu de base (MVP)

- [ ] Créer 3 articles d’exemple en Markdown dans `src/content/blog`.
- [ ] Inclure au moins 2 tags dans chaque article.
- [ ] Vérifier la bonne qualité de rendu du code (blocs lisibles, indentation propre, langue de highlight simple si nécessaire).

## Phase 4 — Pages MVP à livrer

- [ ] `index` : présentation courte + section des derniers articles.
- [ ] `blog` : liste complète des articles publiés.
- [ ] `blog/[slug]` : page article depuis Markdown.
- [ ] `about` : page À propos.
- [ ] `tags` : page liste de tous les tags.
- [ ] `tags/[tag]` : page de filtrage par tag.
- [ ] Rendre les tags cliquables dans les listes et les pages articles.

## Phase 5 — Fonctionnalités d’indexation

- [ ] Générer un flux RSS.
- [ ] Générer un sitemap.
- [ ] Vérifier `robots` et méta de base (title, description) sur les pages clés.

## Phase 6 — Design simple et lisibilité

- [ ] Implémenter une CSS légère maison (pas de framework lourd).
- [ ] Prioriser : lisibilité, contraste, hiérarchie visuelle, rythme typographique.
- [ ] Ajouter une navigation claire et responsive.
- [ ] Vérifier la responsivité mobile à chaque page MVP.
- [ ] Option secondaire : ajout d’un toggle clair/sombre sans retarder la livraison MVP.

## Phase 7 — Déploiement OVH (objectif principal)

- [ ] Construire (`npm run build`) et confirmer que `dist/` contient un site prêt à servir.
- [ ] Valider que `dist/` peut être copié tel quel dans `www/` sur l’hébergement OVH mutualisé.
- [ ] Documenter le flux de déploiement OVH dans le README.

## Phase 8 — README et livraison

- [ ] Créer un `README` avec commandes essentielles : install, dev, build, preview.
- [ ] Documenter l’architecture (simple), la structure, et les 3 articles de test.
- [ ] Ajouter une section "déploiement" avec :
  - [ ] procédure OVH (prioritaire)
  - [ ] mentions GitHub Pages / Vercel en option uniquement.
- [ ] Check final de non-régression :
  - [ ] toutes les pages MVP présentes
  - [ ] aucune dépendance backend/DB/CMS/API
  - [ ] architecture compréhensible et minimaliste.
