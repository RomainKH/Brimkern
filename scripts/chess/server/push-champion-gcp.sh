#!/bin/zsh
# Pousse un champion sur la VM Google Cloud (tunnel IAP, compte perso explicite) : appelé par
# publish.py --on-champion à chaque nouveau champion. La VM n'a pas d'IPv4 publique et le CDN du Hub
# pas d'IPv6 : elle ne peut pas le tirer elle-même. Remplacement atomique (mv) côté serveur.
set -euo pipefail
G=(--account=romain.khanoyan@gmail.com --project=kern0-lichess-261126 --zone=us-central1-a --tunnel-through-iap --quiet)
gcloud compute scp "$1" kern0:kern0/champion.pt.tmp "${G[@]}" 2>/dev/null
gcloud compute ssh kern0 "${G[@]}" --command 'mv $HOME/kern0/champion.pt.tmp $HOME/kern0/champion.pt' 2>/dev/null
