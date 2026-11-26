#!/bin/bash
# Le robot Lichess (lichess-bot) avec Kern 0 ; la clé ne passe que par l'environnement.
K=$HOME/kern0
export LICHESS_BOT_TOKEN="$(tr -d '\n' < $K/token)"
cd $K/lichess-bot
exec $K/venv/bin/python -u lichess-bot.py --config $K/config.yml
