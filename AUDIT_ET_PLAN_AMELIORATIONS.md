# Audit et plan d'améliorations

Date de l'audit : 2026-08-09

## 1. Synthese de l'audit

Le projet est un blog statique Astro simple et coherent avec l'objectif initial : Astro, TypeScript strict, contenus Markdown, CSS maison, pas de backend, pas de base de donnees, pas de CMS et pas de framework UI.

Le MVP est largement en place : accueil, liste d'articles, pages articles, tags, page a propos, RSS, sitemap, README et workflow GitHub Pages. Le code reste court et lisible.

Les principales ameliorations recommandees concernent la robustesse de build, la centralisation des URLs, la reduction de duplication dans les pages, la qualite SEO minimale, la coherence du modele de contenu et une meilleure verification automatique.

## 2. Stack technique observee

- Astro `^5.8.0` declare dans `package.json`, resolu en `5.18.2` dans l'environnement local.
- TypeScript `^5.9.2`, configuration stricte via `astro/tsconfigs/base`.
- Markdown via les collections Astro dans `src/content/blog`.
- CSS global maison dans `src/styles/global.css`.
- Build statique Astro vers `dist/`.
- CI GitHub Actions avec Node.js 22, `npm ci`, build et deploiement GitHub Pages sur la branche par defaut.
- Aucune dependance runtime dans `dependencies`.

## 3. Architecture observee

Structure principale :

- `src/pages/` contient les routes Astro et les endpoints XML.
- `src/layouts/BaseLayout.astro` porte le HTML de base, les metas principales et la navigation.
- `src/components/SiteNav.astro` contient la navigation.
- `src/lib/content.ts` centralise le chargement des articles publics, le tri et les tags.
- `src/content/config.ts` definit le schema de contenu.
- `src/content/blog/*.md` contient les articles.
- `public/` est reserve aux assets statiques.

L'architecture est adaptee au perimetre actuel. Elle reste assez plate, ce qui est positif pour un blog personnel. Le prochain palier doit surtout introduire de petites fonctions et composants reutilisables, sans transformer le projet en application complexe.

## 4. Points forts

- Perimetre statique bien respecte.
- TypeScript strict active.
- Schema de contenu explicite.
- Filtrage des brouillons centralise dans `getPublicPosts()`.
- Generation des pages tags via `getStaticPaths()`.
- RSS et sitemap generes sans dependance supplementaire.
- README utile pour installation, build et deploiement OVH.
- CI presente et alignee sur Node 22.

## 5. Risques et limites

- Le build local a echoue avec Node `v24.18.1` sur une erreur WebAssembly : `Out of memory: Cannot allocate Wasm memory for new instance`. La CI utilise Node 22, mais le repo ne fournit pas de `.nvmrc` ou `.node-version`.
- `README.md` recommande Node 22, mais le projet ne verrouille pas cette version cote developpeur.
- `astro check` n'est pas disponible sans installer `@astrojs/check`; il n'existe pas de script `check`.
- Les URLs absolues RSS/sitemap sont construites manuellement a plusieurs endroits. Cela peut devenir fragile avec `SITE` + `BASE_PATH`, surtout entre OVH (`/`) et GitHub Pages (`/light-static-blog/`).
- Les listes d'articles et les tags sont rendus avec de la duplication dans plusieurs pages.
- Le champ `cover` est accepte mais pas exploite, et un article contient `cover: ""`, ce qui est semantiquement ambigu.
- Les metas restent minimales : pas de canonical, pas de `og:title`, `og:description`, `og:type`, `og:url`.
- Pas de `robots.txt`.
- Le sitemap ne contient pas de `lastmod`.
- Les styles sont globaux et suffisants pour le MVP, mais il manque des classes structurelles pour differencier listes, articles, metas, tags et contenu Markdown.
- La convention de tags demande un affichage identique au frontmatter, mais le code normalise les URLs et reconstruit parfois un libelle via `getDisplayTag()`, ce qui peut diverger.

## 6. Plan d'ameliorations recommande

### Phase 1 - Stabiliser l'environnement et les validations

Objectif : rendre le projet reproductible et verifier rapidement qu'une modification ne casse pas le site.

- [ ] Ajouter un fichier `.nvmrc` avec `22`.
- [ ] Ajouter un fichier `.node-version` avec `22` si l'environnement local l'utilise.
- [ ] Ajouter `@astrojs/check` en dependance de developpement.
- [ ] Ajouter un script `check` dans `package.json` : `astro check`.
- [ ] Ajouter un script `validate` : `npm run check && npm run build`.
- [ ] Documenter dans le README que Node 22 est la version de reference.
- [ ] Lancer `SITE="https://example.com" BASE_PATH="/" npm run validate`.

Critere de sortie :

- [ ] `npm run validate` passe avec Node 22.
- [ ] Le build genere bien `dist/`.

### Phase 2 - Centraliser la construction des URLs

Objectif : eviter les erreurs entre OVH, GitHub Pages, RSS, sitemap et liens internes.

- [ ] Creer un helper `src/lib/urls.ts`.
- [ ] Ajouter une fonction pour construire les chemins internes depuis `import.meta.env.BASE_URL`.
- [ ] Ajouter une fonction pour construire les URLs absolues depuis `SITE` et `BASE_URL`.
- [ ] Remplacer les concatenations manuelles dans `SiteNav.astro`.
- [ ] Remplacer les concatenations manuelles dans les pages `index`, `blog`, `tags` et `article`.
- [ ] Remplacer les concatenations manuelles dans `rss.xml.ts`.
- [ ] Remplacer les concatenations manuelles dans `sitemap.xml.ts`.
- [ ] Tester les deux cas :
  - [ ] `SITE="https://example.com" BASE_PATH="/"`
  - [ ] `SITE="https://example.com" BASE_PATH="/light-static-blog/"`

Critere de sortie :

- [ ] Les liens internes, RSS et sitemap sont corrects pour une base racine et une base non racine.

### Phase 3 - Factoriser les composants de contenu

Objectif : reduire la duplication sans complexifier l'architecture.

- [ ] Creer `src/components/PostList.astro` pour afficher une liste d'articles.
- [ ] Creer `src/components/PostMeta.astro` pour les dates et la description courte.
- [ ] Creer `src/components/TagList.astro` pour l'affichage des tags cliquables.
- [ ] Utiliser ces composants dans `src/pages/index.astro`.
- [ ] Utiliser ces composants dans `src/pages/blog/index.astro`.
- [ ] Utiliser ces composants dans `src/pages/blog/[slug].astro`.
- [ ] Utiliser ces composants dans `src/pages/tags/[tag].astro`.

Critere de sortie :

- [ ] Le rendu ne change pas fonctionnellement.
- [ ] La logique de date et de tags n'est plus dupliquee dans chaque page.

### Phase 4 - Clarifier le modele de contenu

Objectif : eviter les contenus invalides ou ambigus.

- [ ] Modifier le schema `cover` pour refuser une chaine vide.
- [ ] Corriger l'article qui contient `cover: ""`.
- [ ] Decider si `cover` reste dans le MVP :
  - [ ] soit l'utiliser dans les listes et pages articles,
  - [ ] soit le retirer du schema et du template pour rester minimaliste.
- [ ] Ajouter une validation de tags non vides.
- [ ] Aligner `src/content/TAGGING.md` avec le comportement reel de normalisation.
- [ ] Ajouter un exemple d'article brouillon dans la documentation, sans le publier.

Critere de sortie :

- [ ] Un article avec tag vide ou `cover: ""` echoue clairement a la validation.
- [ ] La documentation correspond au comportement du code.

### Phase 5 - Renforcer le SEO statique minimal

Objectif : ameliorer l'indexation sans ajouter de dependance lourde.

- [ ] Ajouter une URL canonique dans `BaseLayout.astro`.
- [ ] Ajouter les metas Open Graph de base.
- [ ] Ajouter `og:type` avec `website` par defaut et `article` pour les articles.
- [ ] Ajouter `og:url`.
- [ ] Ajouter `og:title` et `og:description`.
- [ ] Ajouter `lastmod` dans le sitemap pour les articles, depuis `updatedDate` ou `pubDate`.
- [ ] Ajouter `public/robots.txt`.
- [ ] Verifier que `rss.xml` et `sitemap.xml` referencent les memes URLs absolues.

Critere de sortie :

- [ ] Les pages principales ont une canonical et des metas sociales coherentes.
- [ ] Le sitemap contient les pages et articles avec `lastmod` quand disponible.

### Phase 6 - Ameliorer la lisibilite et l'interface

Objectif : garder un design sobre, plus robuste sur mobile et plus agreable en lecture longue.

- [ ] Ajouter des classes structurelles pour les listes d'articles.
- [ ] Ajouter un style dedie aux tags.
- [ ] Ajouter un style dedie aux dates/metadonnees.
- [ ] Ajouter un style dedie au contenu Markdown d'article.
- [ ] Verifier les espacements sur mobile.
- [ ] Verifier le contraste clair/sombre.
- [ ] Remplacer les decorations de fond trop presentes si elles nuisent a la sobriete du blog.

Critere de sortie :

- [ ] Les pages restent sobres.
- [ ] Les articles longs, listes et tags sont plus faciles a scanner.

### Phase 7 - Documenter le flux de publication

Objectif : faciliter l'ajout d'articles et le deploiement reel.

- [ ] Ajouter une section "Publier un article" dans le README.
- [ ] Ajouter une checklist avant publication :
  - [ ] titre clair,
  - [ ] description courte,
  - [ ] date correcte,
  - [ ] tags normalises,
  - [ ] `draft: false`,
  - [ ] build valide.
- [ ] Documenter la commande OVH finale avec variables d'environnement.
- [ ] Documenter la commande GitHub Pages comme option secondaire.
- [ ] Preciser que `dist/` ne doit pas etre versionne.

Critere de sortie :

- [ ] Un nouvel article peut etre ajoute et publie en suivant uniquement le README.

### Phase 8 - Verification finale

Objectif : s'assurer que les ameliorations n'ont pas casse le MVP.

- [ ] Lancer `npm ci`.
- [ ] Lancer `SITE="https://example.com" BASE_PATH="/" npm run validate`.
- [ ] Lancer `SITE="https://example.com" BASE_PATH="/light-static-blog/" npm run validate`.
- [ ] Inspecter `dist/index.html`.
- [ ] Inspecter `dist/rss.xml`.
- [ ] Inspecter `dist/sitemap.xml`.
- [ ] Verifier que les brouillons ne sont pas generes.
- [ ] Verifier que les pages tags existent.
- [ ] Mettre a jour `LIVRAISON_PHASE8.md` ou creer une nouvelle note de livraison si ce plan est execute.

Critere de sortie :

- [ ] Le site reste 100% statique.
- [ ] Le MVP est preserve.
- [ ] Les commandes documentees fonctionnent.

## 7. Priorite conseillee

Ordre recommande :

1. Phase 1, car elle conditionne toute la suite.
2. Phase 2, car les URLs sont le principal risque de deploiement multi-hebergement.
3. Phase 3, car elle reduit la duplication avant les evolutions SEO/design.
4. Phase 4, car elle rend les contenus plus fiables.
5. Phase 5, car elle ameliore l'indexation.
6. Phase 6, car elle ameliore l'experience sans changer le fond.
7. Phase 7 et Phase 8, pour verrouiller la livraison.
