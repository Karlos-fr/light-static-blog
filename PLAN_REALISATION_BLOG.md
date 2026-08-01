# Plan de réalisation — Blog statique Astro

## Phase 1 — Initialisation du projet (fondations)

- [ ] Initialiser un projet Astro avec TypeScript (`npm create astro@latest`) et activer la résolution de fichiers propres au TS.
- [ ] Structurer l’arborescence minimale : `src/pages`, `src/layouts`, `src/components`, `src/content/blog`, `src/styles`, `public`.
- [ ] Configurer le format contenu Markdown/MDX dans Astro (`contentCollection` + `markdown.remarkPlugins` si utile).
- [ ] Choisir une stratégie de déploiement compatible avec GitHub Pages et Vercel (sans backend, sans DB, sans CMS).

## Phase 2 — Modèle de contenu et données éditoriales

- [ ] Définir un schéma de frontmatter commun : `title`, `description`, `pubDate`, `tags`, `draft`, `cover`, `slug`.
- [ ] Créer 3 articles d’exemple en Markdown/MDX dans `src/content/blog` avec tags et dates.
- [ ] Écrire un guide de style d’article : titres, encadrés de code, citations, longueur, conventions de tags.
- [ ] Mettre en place une page de listing basée sur les métadonnées triées par date.

## Phase 3 — Pages principales et navigation

- [ ] Développer la page d’accueil avec présentation courte + section “Derniers articles”.
- [ ] Développer la page `blog` avec la liste complète des articles (titre, date, extrait, tags).
- [ ] Implémenter le template de page article avec génération depuis Markdown/MDX.
- [ ] Implémenter la navigation globale (header + footer) cohérente entre toutes les pages.
- [ ] Créer la page “À propos” avec biographie, liens utiles et photo/identité visuelle si nécessaire.

## Phase 4 — Recherche par tags et enrichissements SEO/Flux

- [ ] Ajouter le filtrage par tag (page tags + clic depuis chaque badge tag).
- [ ] Générer un flux RSS automatique depuis les articles.
- [ ] Générer un sitemap XML pour l’indexation.
- [ ] Ajouter les meta OG/Twitter de base et le `sitemap` dans la config Astro.

## Phase 5 — Design et expérience utilisateur

- [ ] Mettre en place une base CSS légère (pas de framework UI) avec variables : palette claire/sombre, typographie, spacing, composants.
- [ ] Implémenter un theme clair/sombre simple (préférence système + override local si possible).
- [ ] Garantir la responsivité mobile (navigation, typographie, grilles, marges, espacement).
- [ ] Soigner l’affichage des blocs de code : police mono, contrastes élevés, bordures, wrap lisible.
- [ ] Ajouter une touche “geek/rétro” discrète (typographie, palette, micro-ornements) sans style kitsch.

## Phase 6 — Préparation au déploiement

- [ ] Rédiger un `README.md` avec :
  - [ ] installation (`npm install`)
  - [ ] lancement dev (`npm run dev`)
  - [ ] build (`npm run build`)
  - [ ] preview (`npm run preview`)
  - [ ] commandes de déploiement.
- [ ] Ajouter la configuration GitHub Pages (adapter + base path / gestion des assets).
- [ ] Ajouter la configuration Vercel (`vercel.json` ou settings Astro/CLI).
- [ ] Tester le build de production et vérifier les chemins d’assets pour les deux destinations.
- [ ] Documenter la commande de publication rapide dans le README.

## Phase 7 — Contrôle final avant livraison

- [ ] Vérifier que toutes les pages du MVP sont présentes et fonctionnelles : Home, Blog, Article, À propos, RSS, Sitemap.
- [ ] Vérifier qu’aucun élément ne dépend d’un backend/DB/CMS.
- [ ] Vérifier que l’architecture reste simple et lisible.
- [ ] Vérifier les 3 articles d’exemple et leur rendu final.
- [ ] Finaliser le nettoyage visuel (typographie, lisibilité, espacements, contrastes).
