#!/bin/bash
# Récupère le dernier champion de Kern 0 publié par la boucle (publish.py → bucket HF public) s'il a
# changé. Vérifie l'empreinte avant de remplacer : le moteur ne lit jamais un fichier à moitié écrit.
set -euo pipefail
K=$HOME/kern0
B=https://huggingface.co/buckets/romainkh14/brimkern-chess-live/resolve
meta=$(curl -fsSL "$B/champion.json")
want=$(echo "$meta" | python3 -c "import sys,json;print(json.load(sys.stdin)['sha256'])")
have=$( [ -f $K/champion.pt ] && sha256sum $K/champion.pt | cut -d' ' -f1 || echo none)
[ "$want" = "$have" ] && exit 0
curl -fsSL "$B/champion.pt" -o $K/champion.pt.tmp
got=$(sha256sum $K/champion.pt.tmp | cut -d' ' -f1)
[ "$got" = "$want" ] || { echo "empreinte inattendue ($got), on garde l'ancien"; rm -f $K/champion.pt.tmp; exit 1; }
mv $K/champion.pt.tmp $K/champion.pt
echo "$(date -Is) nouveau champion ${want:0:12}"
