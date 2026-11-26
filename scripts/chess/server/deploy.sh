#!/bin/zsh
# Depuis le Mac : copie le robot Kern 0 sur le serveur et l'installe.   ./deploy.sh <ip>
# La clé Lichess part par scp (jamais affichée), la config est celle du robot du Mac, chemins adaptés.
set -euo pipefail
IP=$1; KEY=~/.ssh/kern0_oracle; S=ubuntu@$IP
H=$(cd "$(dirname "$0")" && pwd); C=$H/..; L=~/Desktop/autres/brimkern-chess/lichess
ssh -i $KEY -o StrictHostKeyChecking=accept-new $S "mkdir -p kern0/chess kern0/engines kern0/systemd"
scp -i $KEY -q $C/model.py $C/play.py $C/uci.py $S:kern0/chess/
scp -i $KEY -q $H/setup.sh $H/sync-champion.sh $H/run.sh $S:kern0/
scp -i $KEY -q $H/engines/kern0 $S:kern0/engines/
scp -i $KEY -q $H/systemd/* $S:kern0/systemd/
sed -e "s#$L/engines/#/home/ubuntu/kern0/engines/#" -e "s#$L/games#/home/ubuntu/kern0/games#" $L/lichess-bot/config.yml > /tmp/kern0-config.yml
scp -i $KEY -q /tmp/kern0-config.yml $S:kern0/config.yml && rm /tmp/kern0-config.yml
scp -i $KEY -q $L/token $S:kern0/token
ssh -i $KEY $S "bash kern0/setup.sh"
