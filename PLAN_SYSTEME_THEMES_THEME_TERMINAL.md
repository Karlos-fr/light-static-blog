# Plan de réalisation — système de thèmes et thème terminal rétro

## 1. Objectif

Mettre en place un système de thèmes statique, simple à étendre et sélectionné au moment du build, puis créer un premier thème inspiré de la maquette `image.png`.

Le contenu, le routage, le SEO, le RSS et le sitemap doivent rester indépendants du thème choisi. La pagination restera entièrement statique. Seul un JavaScript minimal, sans framework ni hydratation, sera autorisé pour mémoriser et appliquer le mode clair ou sombre choisi par le visiteur.

## 2. Périmètre et exclusions

### Inclus

- Architecture permettant d'ajouter facilement de nouveaux thèmes.
- Thème sombre « terminal rétro » correspondant à la direction artistique de la maquette.
- En-tête, navigation, listes d'articles, pages d'article, tags, page À propos, RSS et sitemap.
- Pagination statique de tous les articles.
- Switch clair/sombre accessible, commun à toutes les pages.
- Prise en compte initiale de la préférence du système.
- Mémorisation locale du choix du visiteur.
- Responsive, accessibilité, mode réduction des animations et impression correcte.
- Sélection et validation du thème au build.

### Explicitement exclu

- Ne créer aucun nouvel article.
- Ne créer, générer ou remplacer aucune miniature d'article.
- Utiliser uniquement les couvertures déjà renseignées dans le contenu.
- Ne pas afficher de lien « Tous les articles ».
- Ne pas ajouter « Mentions légales ».
- Ne pas ajouter le copyright « © 2025 Gildas Lechevalier ».
- Ne pas permettre de changer l'identité du thème (`default`, `terminal`, etc.) côté navigateur : seul son mode clair/sombre sera commutable.
- Ne pas modifier la structure des URL d'article.

## 3. Analyse de la maquette

### Direction visuelle

La maquette adopte une esthétique de terminal rétro et de moniteur CRT :

- fond presque noir, légèrement bleuté ;
- trame horizontale très discrète et vignettage léger ;
- typographie monospace ;
- texte principal blanc cassé ;
- texte secondaire bleu gris ;
- accent principal vert phosphorescent ;
- bordures fines bleu sombre ;
- catégories ponctuellement colorées en violet, bleu ou orange ;
- angles droits ou très peu arrondis ;
- absence d'ombres modernes marquées ;
- mise en page large et aérée.

L'effet CRT doit rester une décoration légère. Il ne doit pas réduire la lisibilité, scintiller ou intercepter les interactions.

### En-tête

- Identité sur deux lignes à gauche : nom du site puis courte signature éditoriale.
- Navigation horizontale à droite.
- Élément décoratif de type invite de commande `>_` masqué aux technologies d'assistance.
- Switch clair/sombre compact intégré à la zone droite, dans le même langage visuel que l'invite de commande.
- Trait horizontal séparant l'en-tête du contenu.
- Élément actif souligné en vert.

Les libellés devront employer la casse phrase et non les capitales intégrales :

- `Articles`
- `Tags`
- `À propos`
- `Lire la suite`
- `Plan du site`

Le nom propre reste naturellement `Gildas Lechevalier`. Aucun `text-transform: uppercase` ne devra être appliqué aux textes de navigation ou d'interface.

Le contrôle clair/sombre affichera un libellé compréhensible, par exemple `Mode sombre` ou `Mode clair`, plutôt qu'une icône seule. Une icône soleil/lune pourra l'accompagner en décoration.

### Liste d'articles

Sur grand écran, chaque article prend la forme d'une ligne :

- couverture existante à gauche, si elle existe ;
- catégorie ou tag principal, titre, description, date et lien à droite ;
- séparateurs horizontaux fins ;
- hauteur régulière sans imposer une image.

Pour un article sans `cover`, aucune zone vide et aucun visuel de remplacement ne seront créés. Le contenu textuel occupera toute la largeur de la ligne.

Sur mobile, une couverture existante passe au-dessus du texte. Les articles sans couverture restent de simples blocs textuels.

### Pied de page

Le pied de page contiendra uniquement les accès utiles, par exemple :

- `RSS`
- `Plan du site`

Les mentions légales et le copyright visibles dans la maquette sont volontairement ignorés.

## 4. Architecture de thèmes proposée

### Principe

Séparer strictement :

1. la structure sémantique des composants Astro ;
2. les styles communs nécessaires à l'accessibilité et au fonctionnement ;
3. les variables et règles visuelles propres à chaque thème.

Le thème sera choisi au build avec une variable `SITE_THEME`. Une valeur par défaut explicite pourra être définie dans la configuration du site. Une valeur inconnue devra faire échouer le build avec un message lisible.

Le système distinguera deux notions :

- `data-theme="terminal"` : identité graphique choisie au build ;
- `data-color-mode="light|dark"` : palette choisie dans le navigateur.

Cette séparation permet à chaque thème de proposer ses propres variantes claire et sombre sans dupliquer les composants.

### Arborescence cible

```text
public/
└── scripts/
    ├── color-mode-init.js       # Application immédiate du mode avant affichage
    └── color-mode-toggle.js     # Interaction et persistance du switch
src/
├── config/
│   └── site.ts                  # Thème actif, taille de page et identité visuelle
├── themes/
│   ├── registry.ts              # Registre et validation des thèmes disponibles
│   ├── shared/
│   │   ├── foundations.css      # Reset, accessibilité et typographie de base
│   │   ├── layout.css           # Structure commune des pages
│   │   └── components.css       # Contrats visuels communs des composants
│   ├── default/
│   │   └── theme.css            # Thème actuel conservé comme référence
│   └── terminal/
│       └── theme.css            # Nouveau thème issu de la maquette
├── components/
│   ├── SiteHeader.astro
│   ├── SiteFooter.astro
│   ├── ColorModeSwitch.astro
│   ├── PostList.astro
│   ├── Pagination.astro
│   └── ...
└── pages/
    └── styles/theme.css.ts       # CSS statique composé pour le thème actif
```

### Registre de thèmes

Le registre associera un identifiant stable à sa feuille CSS :

```ts
export const themes = {
  default: defaultThemeCss,
  terminal: terminalThemeCss,
} as const;
```

Ajouter un thème devra demander seulement :

1. de créer `src/themes/<identifiant>/theme.css` ;
2. de déclarer cet identifiant dans `registry.ts` ;
3. de lancer les validations communes.

Aucun composant Astro ne devra contenir de condition du type `if theme === 'terminal'` pour sa présentation. Les différences visuelles seront portées par les variables CSS et les sélecteurs du thème.

Chaque thème devra obligatoirement définir les deux palettes :

```css
[data-theme="terminal"][data-color-mode="light"] { /* tokens clairs */ }
[data-theme="terminal"][data-color-mode="dark"] { /* tokens sombres */ }
```

Lorsque `data-color-mode` est absent, une règle `prefers-color-scheme` fournira aussi le bon mode sans JavaScript. Un thème incomplet devra être détecté pendant la validation ou par une checklist de contrat CSS.

### Feuille CSS stable

La route statique `styles/theme.css.ts` assemblera au build :

- les fondations partagées ;
- les styles structurels communs ;
- le thème sélectionné.

`BaseLayout.astro`, `rss.xsl` et `sitemap.xsl` chargeront tous la même URL stable `/styles/theme.css`, préfixée correctement par `BASE_PATH` lorsque nécessaire.

Cette organisation garantit que les pages HTML, le RSS et le sitemap utilisent réellement la même charte, sans recopier les couleurs dans plusieurs fichiers.

### Contrat de variables CSS

Les composants devront consommer des variables sémantiques, jamais des couleurs propres à un thème :

```css
--color-bg
--color-surface
--color-surface-alt
--color-text
--color-text-muted
--color-border
--color-accent
--color-accent-hover
--color-focus
--font-body
--font-heading
--font-mono
--content-width
--radius-card
--shadow-card
--space-page
```

Le thème terminal définira notamment :

- mode sombre : fond noir bleuté, surface noire légèrement plus claire, texte blanc froid et bordures bleu ardoise ;
- mode clair : fond gris très pâle légèrement bleuté, surfaces blanches, texte bleu nuit et bordures bleu gris ;
- dans les deux modes : accent vert phosphorescent adapté pour conserver un contraste suffisant ;
- police : pile monospace locale et robuste.

Une police WOFF2 locale pourra être ajoutée ultérieurement si sa licence est compatible. Le thème devra rester fonctionnel avec la pile monospace système et ne dépendra pas d'un service de polices externe.

## 5. Évolution des composants

### `BaseLayout.astro`

- Ajouter l'identifiant du thème sur `<html data-theme="...">`.
- Initialiser `data-color-mode` dans `<head>` avant le rendu afin d'éviter un flash de la mauvaise palette.
- Charger la feuille stable `styles/theme.css`.
- Conserver les canonical, Open Graph et JSON-LD sans changement fonctionnel.
- Ajouter un emplacement commun pour le pied de page.

### `SiteHeader.astro`

- Remplacer le nom générique `Light Blog` par l'identité configurée du site.
- Afficher la signature éditoriale configurée.
- Conserver les routes existantes : Articles, Tags et À propos.
- Ajouter le prompt `>_` comme décoration `aria-hidden="true"`.
- Intégrer `ColorModeSwitch.astro` à proximité du prompt.
- Déterminer la route active à partir de `Astro.url.pathname` et exposer `aria-current="page"`.
- Ne pas mettre les libellés en capitales via CSS.

### `ColorModeSwitch.astro`

- Utiliser un bouton natif avec `role="switch"` et `aria-checked` synchronisé.
- Fournir un nom accessible décrivant l'action et le mode actif.
- Autoriser l'activation au clavier avec les comportements natifs du bouton.
- Passer immédiatement de `light` à `dark`, et inversement.
- Enregistrer le choix dans `localStorage` sous une clé versionnée, par exemple `light-static-blog:color-mode`.
- En l'absence de choix enregistré, utiliser `prefers-color-scheme`.
- Mettre à jour tous les switchs présents dans le document sans rechargement.
- Ne charger aucun framework et ne générer aucune hydratation Astro.

Le script d'initialisation devra être très court et exécuté avant l'affichage. Le script d'interaction pourra être chargé avec `defer`. Si JavaScript est désactivé, le site suivra `prefers-color-scheme` et restera entièrement lisible ; seul le changement manuel et sa persistance seront indisponibles.

### `SiteFooter.astro`

- Afficher uniquement RSS et Plan du site.
- Ne pas intégrer les deux éléments exclus de la maquette.

### `PostList.astro`

- Conserver une structure sémantique en liste.
- Ajouter des classes stables permettant au thème de choisir une présentation en lignes ou en cartes.
- Utiliser la couverture existante uniquement si `post.data.cover` est défini.
- Appliquer une classe ou un attribut `data-has-cover` afin que le thème étende le texte sur toute la largeur lorsqu'il n'y a pas d'image.
- Afficher le premier tag comme catégorie principale dans la liste, tout en conservant les autres tags sur la page de détail.
- Ajouter un lien textuel `Lire la suite →` accessible et explicite.
- Ne générer aucun placeholder graphique.

### `PostMeta.astro` et `TagList.astro`

- Conserver les dates sémantiques `<time>`.
- Employer la casse phrase dans tous les libellés.
- Exposer un attribut stable pour colorer certains tags avec la palette secondaire du thème, sans coder ces couleurs dans le contenu Markdown.

### Pages de détail

- Réutiliser le même en-tête, pied de page et variables de thème.
- Conserver une largeur de lecture plus étroite que la liste d'articles.
- Adapter titres, citations, liens, code inline et blocs de code au thème terminal.
- Ne pas changer le contenu des trois articles existants.

### RSS et sitemap

- Afficher le même switch dans leur en-tête XSL.
- Charger les mêmes scripts stables avec des chemins relatifs compatibles avec `BASE_PATH`.
- Réutiliser la même clé `localStorage`, afin qu'un choix effectué sur le blog s'applique aussi aux vues RSS et sitemap.
- Conserver le XML brut parfaitement exploitable par les robots et lecteurs de flux.

## 6. Pagination statique

### Routes

- `/` : première page d'articles.
- `/page/2/`, `/page/3/`, etc. : pages suivantes.
- Avec `BASE_PATH=/blog/`, les URL publiques deviennent `/blog/`, `/blog/page/2/`, etc.

### Implémentation

- Ajouter `postsPerPage` à la configuration du site, avec une valeur initiale proposée de `6`.
- Extraire le calcul dans `src/lib/pagination.ts` afin qu'il soit testable indépendamment.
- Créer un composant de page partagé pour éviter de dupliquer la page 1 et les pages suivantes.
- Conserver `src/pages/index.astro` pour la première page.
- Ajouter `src/pages/page/[page].astro` avec `getStaticPaths()` pour générer uniquement les pages 2 et suivantes.
- Ajouter `Pagination.astro` avec :
  - `Précédente`
  - `Page n sur N`
  - `Suivante`
  - `aria-current="page"`
  - liens `rel="prev"` et `rel="next"` lorsque pertinents.
- Masquer complètement les contrôles lorsqu'une seule page suffit.
- Ne jamais afficher de lien « Tous les articles ».

La page d'accueil affichera donc tous les articles disponibles au travers de la pagination, et non un sous-ensemble « récent » menant vers un second index.

### SEO et flux

- Chaque page paginée aura un titre et une canonical propres.
- Ajouter les pages de pagination au sitemap.
- Le RSS continuera de contenir les publications prévues par sa politique propre, indépendamment de la pagination HTML.
- Les objets JSON-LD `BlogPosting` resteront uniquement sur les pages d'article.
- Le JSON-LD `WebSite` restera sur la première page.

## 7. Adaptation responsive

### Grand écran

- Largeur maximale proche de la maquette, environ `88rem` à `92rem`.
- Ligne d'article en grille avec couverture existante de largeur bornée et texte flexible.
- Navigation alignée à droite.

### Tablette

- Réduction de la largeur de la colonne image.
- Espacements plus compacts.
- Navigation autorisée à revenir à la ligne.

### Mobile

- En-tête empilé.
- Navigation défilable ou répartie sur plusieurs lignes sans débordement.
- Couverture existante au-dessus du contenu.
- Tableau du sitemap horizontalement défilable.
- Zones tactiles d'au moins 44 px lorsque possible.

## 8. Accessibilité et performance

- Vérifier un contraste WCAG AA pour texte, liens, tags et focus.
- Ne pas transmettre d'information uniquement par la couleur des tags.
- Marquer scanlines, curseur et prompt comme décoratifs.
- Donner au switch un focus visible, un état textuel et un contraste suffisants dans les deux modes.
- Désactiver toute animation de curseur avec `prefers-reduced-motion`.
- Garder l'effet CRT à faible opacité et sans animation permanente.
- Préserver la navigation clavier et des focus très visibles.
- Maintenir un site 100 % statique ; le seul JavaScript client autorisé concerne le switch clair/sombre.
- Garder les scripts de mode très petits, sans dépendance et sans requête réseau tierce.
- Appliquer le mode avant le premier rendu pour éviter le clignotement clair/sombre.
- N'ajouter aucune dépendance frontend pour le système de thèmes.

## 9. Ordre de réalisation

### Phase 1 — Fondations du système de thèmes

1. Créer la configuration du site et le registre de thèmes.
2. Découper les styles actuels en fondations, structure et thème par défaut.
3. Générer la feuille stable `styles/theme.css`.
4. Faire charger cette feuille par les pages HTML, RSS et sitemap.
5. Valider que le thème actuel n'a pas régressé.

### Phase 2 — Structure commune

1. Extraire `SiteHeader` et créer `SiteFooter`.
2. Ajouter les classes et attributs sémantiques nécessaires aux thèmes.
3. Ajouter l'état de navigation actif.
4. Centraliser le nom du site, la signature et la taille de page.
5. Créer le switch clair/sombre et ses deux scripts sans dépendance.
6. Ajouter la persistance, la préférence système et la prévention du flash initial.

### Phase 3 — Thème terminal rétro

1. Définir les tokens clairs et sombres du thème.
2. Construire le fond CRT discret.
3. Styliser en-tête, navigation et pied de page.
4. Transformer la liste d'articles en lignes inspirées de la maquette.
5. Adapter les articles, tags, pagination, code, RSS et sitemap.
6. Vérifier les articles avec et sans couverture, sans créer d'image.
7. Vérifier le switch et ses états visuels dans les deux palettes.

### Phase 4 — Pagination

1. Ajouter l'utilitaire de pagination.
2. Générer la première page et les routes `/page/n/`.
3. Ajouter les contrôles accessibles.
4. Étendre le sitemap et les métadonnées.
5. Tester les cas 0, 1, 6, 7 et plusieurs dizaines d'articles avec des données temporaires non conservées.

### Phase 5 — Validation et documentation

1. Tester les thèmes `default` et `terminal` avec `BASE_PATH=/` et `/blog/`.
2. Vérifier le HTML, le JSON-LD, RSS, sitemap et canonical.
3. Contrôler desktop, tablette et mobile.
4. Mesurer les contrastes des deux modes et vérifier le clavier.
5. Vérifier le fonctionnement sans JavaScript, avec préférence système et avec choix mémorisé.
6. Mesurer le JavaScript du switch et confirmer l'absence de framework ou d'hydratation.
7. Documenter la création d'un thème et de ses deux palettes dans le README.
8. Mettre à jour le script local de déploiement pour fixer `SITE_THEME=terminal` et contrôler la feuille générée.

## 10. Critères d'acceptation

- Le rendu reprend clairement l'esthétique terminal rétro de la maquette.
- Tous les textes d'interface sont en casse phrase, sans capitales forcées.
- Aucun lien « Tous les articles » n'est présent.
- Tous les articles sont accessibles par pagination statique.
- Aucun article ni aucune miniature n'a été créé.
- Un article sans couverture ne réserve aucun espace d'image.
- Mentions légales et copyright de la maquette sont absents.
- RSS et sitemap utilisent exactement le thème actif du site.
- Le switch clair/sombre fonctionne au clavier sur HTML, RSS et sitemap.
- Le premier affichage suit la préférence système en l'absence de choix enregistré.
- Le choix est conservé entre les pages et les visites.
- Aucun flash notable de la mauvaise palette ne se produit au chargement.
- Un nouveau thème peut être ajouté par un fichier CSS et une entrée de registre.
- Chaque nouveau thème définit obligatoirement une palette claire et une palette sombre.
- Le build refuse un identifiant de thème inconnu.
- Le site reste statique, accessible et responsive ; seul le switch utilise un JavaScript minimal sans dépendance.
- Les builds avec `BASE_PATH=/` et `BASE_PATH=/blog/` passent sans erreur.

## 11. Décisions recommandées

- Sélection du thème au build plutôt qu'un sélecteur utilisateur : plus simple, aucun JavaScript et rendu déterministe.
- Sélection du mode clair/sombre dans le navigateur : préférence système au premier chargement, puis choix explicite mémorisé.
- `6` articles par page par défaut, valeur facilement configurable.
- Conservation du thème actuel sous l'identifiant `default` pour disposer d'un filet de sécurité.
- Nouveau thème nommé `terminal`.
- Utilisation du premier tag existant comme catégorie visuelle dans la liste, sans modifier le frontmatter.
- Aucun téléchargement de police distante ; police locale optionnelle uniquement.
