---
title: "Festina lente : avancer sans se précipiter"
description: "Un article de démonstration avec listes, emphase et extrait TypeScript autour de la locution Festina lente."
pubDate: 2026-02-01
tags: ["demo", "methodologie", "latin"]
draft: false
cover: "/images/festina-lente-cover.png"
---

`Festina lente` veut dire « hâte-toi lentement ». C’est une belle devise pour les projets techniques : progresser régulièrement, mais sans transformer chaque décision en course de vitesse.

## Ce que l’expression raconte

Dans un projet, aller trop vite peut produire du bruit :

1. des choix faits sans contexte ;
2. des corrections empilées ;
3. une documentation qui arrive trop tard.

L’idée n’est pas de ralentir par principe. L’idée est de rendre chaque pas plus solide.

### Une checklist légère

Avant de modifier une page, on peut vérifier trois choses :

- le résultat attendu est clair ;
- le changement reste localisé ;
- une commande de validation existe.

```ts
type Step = {
  label: string;
  done: boolean;
};

const steps: Step[] = [
  { label: 'comprendre', done: true },
  { label: 'modifier', done: true },
  { label: 'valider', done: false },
];

const remaining = steps.filter((step) => !step.done);
console.log(`${remaining.length} étape restante`);
```

---

Un bon rythme n’est pas forcément spectaculaire. Il ressemble plutôt à une suite de petits gestes fiables.
