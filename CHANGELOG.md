# Changelog

Toutes les évolutions notables de Light Static Blog sont documentées dans ce fichier.

Le format suit l'esprit de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et le projet utilise une version sémantique.

## [1.0.0] - 2026-08-12

### Ajouté

- Génération d'un blog statique avec Astro, TypeScript et Markdown.
- Articles Markdown validés par collection Astro avec `title`, `description`, `pubDate`, `updatedDate`, `tags`, `draft` et `cover`.
- Page d'accueil paginée avec tri des articles par date décroissante.
- Pages d'articles statiques avec navigation vers l'article plus récent et plus ancien.
- Pages de tags avec nuage pondéré et compteur d'articles par tag.
- Page À propos alimentée par un fichier Markdown dédié.
- Flux RSS complet avec contenu HTML intégral, descriptions courtes, images, couvertures et balises Media RSS.
- Rendu navigateur du flux RSS avec CSS dédié, sans XSLT.
- Sitemap XML généré automatiquement.
- `robots.txt` généré avec référence au sitemap.
- URL canoniques cohérentes avec `SITE` et `BASE_PATH`.
- Métadonnées SEO de base, Open Graph et Twitter Card.
- Données structurées JSON-LD `WebSite`, `Blog`, `BlogPosting` et pages de collection.
- Configuration par variables d'environnement pour le site, l'auteur, le thème, le SEO et le flux RSS.
- Système de thèmes avec découverte automatique depuis `src/themes/<theme>/theme.css`.
- Assets propres aux thèmes publiés sous `/theme-assets/<theme>/`.
- Trois thèmes publics : `default`, `folio` et `mosaic`.
- Support du mode clair/sombre avec préférence système et mémorisation locale.
- Icônes thémables pour RSS, liens externes, GitHub et switch clair/sombre.
- Rendu Markdown enrichi pour images, figures, légendes, tableaux, citations, listes, code inline et blocs de code.
- Bouton copier et affichage du langage sur les blocs de code.
- Zoom progressif au clic sur les images d'article.
- Gestion responsive des images, tableaux, vidéos et iframes.
- Liens externes distingués visuellement, avec traitement spécifique des liens GitHub.
- Validation stricte des tags déclarés dans `src/config/tags.ts`.
- Refus des slugs d'articles réservés pour éviter les collisions de routes.
- Script SFTP générique optionnel pour déployer le contenu de `dist/`, avec mode différentiel, vérification SHA-256 et contrôles publics.
- Documentation complète du README en français et traduction anglaise dans `docs/README.en.md`.
- Documentation interne des fichiers TypeScript, Astro et CSS.
- Articles de démonstration basés sur des locutions latines avec images d'illustration.

### Accessibilité

- Structure HTML sémantique avec header, navigation, main et footer.
- Textes alternatifs sur les images de contenu et de couverture.
- Légendes visibles générées pour les images Markdown isolées.
- Boutons et liens avec noms accessibles.
- Focus clavier visible et cohérent avec le thème actif.
- Respect de `prefers-reduced-motion`.
- Contrastes vérifiés pour les thèmes publics.
- Score Lighthouse Accessibility vérifié à 100/100 sur les thèmes `default`, `folio`, `mosaic` et `terminal`.

### SEO

- Balises `<title>` et `<meta name="description">` configurables.
- URL canonique unique générée pour chaque page, article, tag et fichier public important.
- Cohérence des URLs entre `SITE`, `BASE_PATH`, RSS, sitemap, canonical, Open Graph et Twitter Card.
- Métadonnées Open Graph complètes : titre, description, type, URL, nom du site, locale, image sociale et dimensions lorsque disponibles.
- Métadonnées Twitter Card `summary_large_image` avec titre, description, image et texte alternatif.
- Image sociale configurable avec fallback global.
- JSON-LD `WebSite` et `Blog` sur la page d'accueil.
- JSON-LD `BlogPosting` sur chaque article avec titre, description, URL, dates, auteur, éditeur, tags, langue et image éventuelle.
- JSON-LD `CollectionPage` pour les pages paginées et les pages de tags.
- Données auteur centralisées via `AUTHOR_NAME`.
- Liens `rel="prev"` et `rel="next"` sur la pagination et la navigation entre articles.
- Flux RSS référencé dans le `<head>` avec lien `alternate`.
- Sitemap XML référencé dans le `<head>` et dans `robots.txt`.
- `robots.txt` généré au build avec URL absolue du sitemap.
- Descriptions RSS courtes et contenu complet des articles dans `content:encoded`.
- Images d'articles publiées dans le flux RSS avec URL absolue et balises Media RSS.
- Liens internes propres sans double préfixe de base path.
- Refus des slugs réservés afin d'éviter les collisions d'URL.

### Technique

- Projet compatible Node.js 24 LTS.
- Build statique sans backend, base de données, CMS ni API à l'exécution.
- JavaScript client limité aux améliorations progressives.
- Scripts npm `dev`, `build`, `check`, `validate` et `preview`.
- Assets publics et fichiers générés compatibles avec un hébergement statique en racine ou sous-chemin.
