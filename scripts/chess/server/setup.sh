#!/bin/bash
# Installe le robot Lichess de Kern 0 sur un serveur Ubuntu 24.04 (Oracle Cloud Always Free, Ampere A1,
# arm64), dans ~/kern0. Lancé UNE fois par deploy.sh depuis le Mac, qui a déjà copié ici : le moteur
# (model.py, play.py, uci.py), sync-champion.sh, run.sh, les unités systemd, config.yml et la clé (token).
# Le serveur ne tient AUCUN secret Hugging Face : il lit le champion dans le bucket public.
set -euo pipefail
K=$HOME/kern0
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq python3-venv python3-pip git curl >/dev/null
python3 -m venv $K/venv
$K/venv/bin/pip install -q --upgrade pip
# PyTorch CPU (roues arm64 officielles) : seul le tronc du modèle s'en sert, 244 K paramètres.
$K/venv/bin/pip install -q torch --index-url https://download.pytorch.org/whl/cpu
$K/venv/bin/pip install -q numpy "chess~=1.11" "PyYAML~=6.0" "requests~=2.34" "backoff~=2.2" "rich~=15.0"
[ -d $K/lichess-bot ] || git clone -q --depth 1 https://github.com/lichess-bot-devs/lichess-bot.git $K/lichess-bot
mkdir -p $K/games
chmod 600 $K/token
chmod +x $K/run.sh $K/sync-champion.sh $K/engines/kern0
$K/sync-champion.sh
sudo cp $K/systemd/kern0-*.service $K/systemd/kern0-*.timer /etc/systemd/system/
sudo sed -i "s#__HOME__#$HOME#g; s#__USER__#$USER#g" /etc/systemd/system/kern0-*.service
sudo systemctl daemon-reload
sudo systemctl enable --now kern0-champion.timer
echo "installé. Démarrer le robot : sudo systemctl enable --now kern0-bot (APRÈS l'arrêt de celui du Mac + 90 s)"
