---
title: "Mens sana in corpore sano : l’équilibre du projet"
description: "Un article de démonstration autour de Mens sana in corpore sano, pour illustrer équilibre, structure et rythme de maintenance."
pubDate: 2026-03-10
tags: ["demo", "latin", "methodologie"]
draft: false
cover: "/images/mens-sana-cover.png"
---

`Mens sana in corpore sano` signifie « un esprit sain dans un corps sain ». Appliquée à un projet, l’idée devient assez parlante : une bonne architecture a besoin d’un code entretenu, et un bon code a besoin d’une intention claire.

## Deux santés à surveiller

### La santé du contenu

- titres explicites ;
- descriptions courtes ;
- liens valides ;
- images accessibles.

### La santé technique

- build reproductible ;
- configuration lisible ;
- styles factorisés ;
- dette visible.

```ts
type HealthCheck = {
  name: string;
  ok: boolean;
};

const checks: HealthCheck[] = [
  { name: 'contenu', ok: true },
  { name: 'build', ok: true },
];
```

Un projet équilibré n’est pas parfait. Il est simplement assez clair pour être repris demain.
