---
title: "Bricolage technique : un watchdog maison en Shell"
description: "Un script minimal pour détecter les services morts et envoyer une alerte sans sur-ingénierie."
pubDate: 2026-03-04
tags: ["bricolage", "sysadmin", "shell"]
draft: false
---

Quand un service se met en pause la nuit, on aime bien l’apprendre le lendemain. Sauf que quand ça arrive trop souvent, il faut une alerte simple.

J’ai repris un script Shell minimal qui vérifie un service et relance si besoin.

```sh
#!/usr/bin/env sh
set -eu

check="nginx"
if ! pgrep -x "$check" > /dev/null; then
  echo "[$(date -Iseconds)] $check inactif, tentative de relance" >> /tmp/watchdog.log
  service "$check" restart
fi
```

C’est volontairement court : pas de daemon dédié, pas d’agent propriétaire, pas d’interface graphique.
Le but est d’obtenir un contrôle fiable sans complexité.


Pour aller plus loin, on peut logguer dans un fichier dédié et envoyer une notification, mais la base doit rester lisible avant d’être brillante.
