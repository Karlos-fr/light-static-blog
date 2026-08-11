---
title: "Alea jacta est : décider sans tout maîtriser"
description: "Un article de démonstration autour de Alea jacta est, avec citation, liste de critères et exemple de configuration."
pubDate: 2026-04-05
tags: ["demo", "latin", "methodologie"]
draft: false
cover: "/images/alea-jacta-est-cover.png"
---

`Alea jacta est` signifie « le sort en est jeté ». Dans un projet, ce n’est pas une invitation à l’imprudence : c’est plutôt le moment où l’on accepte de choisir avec les informations disponibles.

## Avant de trancher

Une décision peut être préparée avec quelques critères simples :

- le changement est réversible ;
- le risque est compris ;
- le périmètre est limité ;
- une validation existe après coup.

```json
{
  "decision": "publier",
  "risk": "faible",
  "rollback": true,
  "validation": "npm run validate"
}
```

## Petite règle

> Quand tout ne peut pas être connu, il reste possible de rendre la décision observable.

La formule dramatique devient alors un outil calme : choisir, mesurer, ajuster.
