---
title: "Test du flux RSS complet"
description: "Article temporaire destiné à vérifier l’affichage du contenu intégral et des images dans un lecteur RSS."
pubDate: 2026-08-09
tags:
  - test
  - rss
draft: false
---

Cet article est volontairement temporaire. Il sert à vérifier qu’un lecteur RSS reçoit bien autre chose qu’un simple résumé.

## Contenu intermédiaire

Le flux doit conserver les paragraphes, les titres et la structure générale du contenu Markdown.

- premier élément de la liste ;
- deuxième élément de la liste ;
- troisième élément de la liste.

```text
verification-rss=contenu-complet
```

## Image intégrée dans l’article

L’image ci-dessous ne provient pas du champ `cover`. Elle permet donc de tester spécifiquement la détection des images présentes dans le corps de l’article.

![Paysage rétro utilisé pour tester le flux RSS](/images/retro-rpg-cover.png)

## Fin du test

Si cette phrase apparaît dans Feedly, le contenu intégral de l’article est bien transmis jusqu’à sa dernière section.

Marqueur de validation : `FIN-ARTICLE-TEST-RSS`.
