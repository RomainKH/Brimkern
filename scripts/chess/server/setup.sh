#!/bin/bash
# Installe le robot Lichess de Kern 0 sur un petit serveur Debian/Ubuntu, dans ~/kern0. Lancé par
# deploy.sh (Oracle, SSH direct) ou deploy-gcp.sh (Google Cloud e2-micro, tunnel IAP), qui ont déjà
# copié ici : le moteur (model.py, play.py, uci.py), lichess-bot, run.sh, les unités systemd,
# config.yml et la clé (token). Aucun secret Hugging Face sur le serveur.
#   setup.sh        le champion est TIRÉ du bucket HF public toutes les 10 min (sync-champion.sh)
#   setup.sh push   le champion est POUSSÉ par le Mac (serveur sans IPv4 publique : le CDN du Hub
#                   n'a pas d'IPv6)
set -euo pipefail
K=$HOME/kern0
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq python3-venv python3-pip git curl >/dev/null
# Moins de 2 Go de mémoire (e2-micro : 969 Mo) : 2 Go d'échange pour pip et PyTorch.
if [ "$(awk '/MemTotal/{print $2}' /proc/meminfo)" -lt 2000000 ] && ! sudo swapon --show | grep -q swapfile; then
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap -q /swapfile && sudo swapon /swapfile
  grep -q swapfile /etc/fstab || echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab >/dev/null
fi
python3 -m venv $K/venv
$K/venv/bin/pip install -q --upgrade pip
# PyTorch CPU (roues arm64 officielles) : seul le tronc du modèle s'en sert, 244 K paramètres.
$K/venv/bin/pip install -q --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
$K/venv/bin/pip install -q numpy "chess~=1.11" "PyYAML~=6.0" "requests~=2.34" "backoff~=2.2" "rich~=15.0"
[ -d $K/lichess-bot ] || git clone -q --depth 1 https://github.com/lichess-bot-devs/lichess-bot.git $K/lichess-bot
sed -i "s#__HOME__#$HOME#g" $K/config.yml
mkdir -p $K/games
chmod 600 $K/token
chmod +x $K/run.sh $K/sync-champion.sh $K/engines/kern0
sudo cp $K/systemd/kern0-*.service $K/systemd/kern0-*.timer /etc/systemd/system/
sudo sed -i "s#__HOME__#$HOME#g; s#__USER__#$USER#g" /etc/systemd/system/kern0-*.service
sudo systemctl daemon-reload
if [ "${1:-}" != push ]; then
  $K/sync-champion.sh
  sudo systemctl enable --now kern0-champion.timer
fi
[ -f $K/champion.pt ] || { echo "pas de champion : à pousser depuis le Mac"; exit 1; }
echo "installé. Démarrer le robot : sudo systemctl enable --now kern0-bot (APRÈS l'arrêt de celui du Mac + 90 s)"
