---
title: "Portage rétro : refaire un RPG en mode browser"
description: "Retour d’expérience sur la simplification d’un gameplay ancien sans réécrire l’architecture du projet."
pubDate: 2026-02-12
updatedDate: 2026-02-20
tags: ["retro", "gamedev", "javascript"]
draft: false
cover: ""
---

Récupérer un vieux gameplay et lui donner une seconde vie peut sembler énorme, jusqu’à ce qu’on découpe le travail.

Mon approche : ne pas reproduire l’ancien design, reproduire les sensations.

## Ce qui compte vraiment

- Cadence de base claire.
- Contrôle réactif.
- Limiter les dépendances.
- Ne pas sur-définir les mécanismes.

En pratique, je suis parti d’un MVP de quelques états :

- déplacement
- collision simple
- attaque
- écran de score

Quand cette boucle tient, il est facile d’ajouter du contenu progressivement.

### Astuce de portage

Prendre une source de vérité unique pour les constantes évite de casser l’équilibre.\
Quelques constantes comme `speed`, `attackCooldown`, `turnRate` bien nommées sauvent souvent plus de temps qu’un système de composants trop complexe.

Ce choix garde le projet lisible et modifiable sans architecture superflue.
