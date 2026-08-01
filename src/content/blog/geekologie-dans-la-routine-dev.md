---
title: "Geekologie dans la routine de développeur"
description: "Pourquoi garder une page de notes claire change la qualité de vos side projects quand le temps manque."
pubDate: 2026-02-01
tags: ["methodologie", "productivite"]
draft: false
---

Il y a des semaines où l’envie de coder devient forte, puis s’évapore dès que les tâches s’accumulent.

Dans ce billet, je résume une approche simple qui évite de perdre du temps : une routine légère, écrite, réutilisable.

## Le point clé

Au lieu de planifier en mode *"on verra bien"*, noter 3 blocs par jour suffit :

1. Ce que je veux finir.
2. Ce que je vais apprendre.
3. Ce qui me bloque.

Cela évite la dette mentale et rend chaque session plus nette.

```ts
// Exemple très simple : une checklist journalière
const focus = [
  'Terminer un article',
  'Valider une idée de refacto',
  'Tester un comportement côté Markdown',
];

focus.forEach((item) => console.log(`- ${item}`));
```

Le code est trivial, mais le principe fonctionne : garder le plan visible améliore la qualité de l’exécution.

---

Le résultat n’est pas spectaculaire, mais stable.
Et en blog, la stabilité, ça finit par valoir plus que les effets de mode.
