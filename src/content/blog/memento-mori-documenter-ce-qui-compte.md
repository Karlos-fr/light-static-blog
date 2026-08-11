---
title: "Memento mori : documenter ce qui compte"
description: "Un article de démonstration autour de Memento mori, orienté documentation, traces utiles et maintenance."
pubDate: 2026-08-09
tags: ["demo", "latin", "markdown"]
draft: false
cover: "/images/memento-mori-cover.png"
---

`Memento mori` veut dire « souviens-toi que tu vas mourir ». Dans une note technique, la formule peut devenir plus douce : souviens-toi que le contexte disparaît vite.

## Ce qui mérite une trace

La documentation utile ne décrit pas forcément tout. Elle garde surtout :

- les choix structurants ;
- les raisons d’un compromis ;
- les commandes de vérification ;
- les limites connues.

```bash
npm run validate
npm run build
```

## Mini-checklist

| Élément | À documenter ? |
| --- | --- |
| Intention | Oui |
| Commandes | Oui |
| Hypothèses fragiles | Oui |
| Hésitations anecdotiques | Non |

Une bonne trace est un message laissé à quelqu’un qui n’aura pas notre mémoire du moment.
