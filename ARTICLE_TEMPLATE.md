# Template d'article pour le blog

Copie ce bloc dans `src/content/blog/` en renommant le fichier selon le slug désiré (ex: `2026-08-01-mon-article.md`).

```md
---
title: "Titre de l'article"
description: "Description courte pour la liste des articles"
pubDate: 2026-08-01
updatedDate: 2026-08-01 # optionnel
tags:
  - tag1
  - tag2
draft: false
cover: "/images/couverture.webp" # optionnel
---

Texte de l'article en Markdown.

## Introduction

Décris le contexte.

## Corps

Continue avec ton contenu.

## Conclusion

Ajoute une idée finale, un appel à l'action ou une récap.
```

Rappels :
- `draft: false` → article publié.
- `draft: true` → brouillon.
- `updatedDate` et `cover` sont optionnels.
- Le slug est le nom du fichier (sans `.md`).
