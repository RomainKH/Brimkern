#!/bin/zsh
# Depuis le Mac : installe le robot Kern 0 sur la VM Google Cloud GRATUITE (projet perso, e2-micro
# us-central1, disque standard 20 Go, AUCUNE IPv4 publique : seule l'IPv6 publique est gratuite).
# Tout passe par le tunnel IAP de Google ; le compte perso est toujours nommé explicitement, la
# configuration gcloud du travail n'est jamais touchée.        ./deploy-gcp.sh
set -euo pipefail
G=(--account=romain.khanoyan@gmail.com --project=kern0-lichess-261126 --zone=us-central1-a --tunnel-through-iap --quiet)
H=$(cd "$(dirname "$0")" && pwd); C=$H/..; L=~/Desktop/autres/brimkern-chess/lichess
T=$(mktemp -d); mkdir -p $T/kern0/chess $T/kern0/engines $T/kern0/systemd
cp $C/model.py $C/play.py $C/uci.py $T/kern0/chess/
cp $H/setup.sh $H/sync-champion.sh $H/run.sh $H/egress-guard.sh $T/kern0/ && cp $H/engines/kern0 $T/kern0/engines/ && cp $H/systemd/* $T/kern0/systemd/
# GitHub n'a pas d'IPv6 : lichess-bot part du clone du Mac (sans son venv ni son historique).
rsync -a --exclude .venv --exclude .git --exclude __pycache__ --exclude config.yml $L/lichess-bot $T/kern0/
sed -e "s#$L/engines/#__HOME__/kern0/engines/#" -e "s#$L/games#__HOME__/kern0/games#" $L/lichess-bot/config.yml > $T/kern0/config.yml
cp ~/Desktop/autres/brimkern-chess/learn/champion.pt $T/kern0/champion.pt
cp $L/token $T/kern0/token && chmod 600 $T/kern0/token
COPYFILE_DISABLE=1 tar --no-xattrs -C $T -czf $T/kern0.tgz kern0  # sans les attributs macOS (avertissements de tar sous Linux)
gcloud compute scp $T/kern0.tgz kern0:/tmp/kern0.tgz "${G[@]}"
rm -rf $T
gcloud compute ssh kern0 "${G[@]}" --command 'tar -C $HOME -xzf /tmp/kern0.tgz && rm /tmp/kern0.tgz && bash $HOME/kern0/setup.sh push'
