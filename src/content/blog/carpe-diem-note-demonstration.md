---
title: "Carpe diem : une note de démonstration"
description: "Un article de démonstration pour présenter les principaux éléments Markdown autour de la locution Carpe diem."
pubDate: 2026-03-04
tags: ["demo", "latin", "markdown"]
draft: false
cover: "/images/carpe-diem-cover.png"
---

`Carpe diem` signifie souvent « cueille le jour ». Dans ce billet de démonstration, la formule sert surtout de prétexte pour montrer les blocs Markdown courants que le thème doit savoir afficher proprement.

## Une idée simple

Le contenu peut être structuré avec des paragraphes courts, des intertitres lisibles et quelques éléments de mise en valeur. On peut insister avec du **gras**, nuancer avec de l’*italique*, ou citer une commande comme `npm run build` directement dans une phrase.

- Mettre l’idée principale en premier.
- Ajouter des exemples concrets.
- Garder une progression claire.
  - Vérifier la lisibilité.
  - Vérifier le rythme.
  - Vérifier la navigation.

> Le Markdown fonctionne bien quand il reste sobre : assez de structure pour guider la lecture, pas assez pour voler la vedette au texte.
>
> Une seconde ligne de citation permet aussi de vérifier l’espacement vertical.

## Liens et image

Un lien comme [la documentation d’Astro](https://docs.astro.build/) doit rester visible sans devenir agressif. Une image insérée dans le contenu doit, elle aussi, respecter la largeur de lecture.

![Illustration abstraite Carpe diem](/images/carpe-diem-cover.png)

## Exemple de code

Voici un petit extrait en JavaScript.

```js
const locution = 'Carpe diem';
const message = `${locution} : écrire une petite chose utile aujourd’hui.`;

console.log(message);
```

## Petit tableau

| Élément | Rôle | Exemple |
| --- | --- | --- |
| Titre | Donner le sujet | `## Petit tableau` |
| Liste | Scander les idées | `- une idée` |
| Code | Montrer un exemple précis | `const locution = 'Carpe diem';` |

### Liste numérotée

1. Observer la page.
2. Modifier un élément.
3. Relire le résultat.

#### Détail discret

Un niveau de titre plus profond doit rester lisible sans casser la hiérarchie de la page.

---

<details>
  <summary>Voir une note complémentaire</summary>

  Cette zone utilise du HTML autorisé dans le Markdown. Elle sert à vérifier que les blocs natifs simples restent cohérents avec le thème.
</details>

Ce premier article sert donc de vitrine minimale pour une page claire, lisible et facile à adapter.
