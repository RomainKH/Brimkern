#!/bin/bash
# Garde-fou « ne jamais payer » : la seule dépense VARIABLE de la VM gratuite est le trafic sortant
# (1 Go/mois offert). Compte les octets émis par mois (persistant aux redémarrages) ; à 700 Mo le
# robot est arrêté jusqu'au 1er du mois suivant. Compte TOUT le trafic émis : prudent par excès.
set -euo pipefail
K=$HOME/kern0; S=$K/egress.state; LIMIT=$((700*1024*1024))
now=$(cat /sys/class/net/e*/statistics/tx_bytes | paste -sd+ | bc); month=$(date -u +%Y-%m)
read -r smonth total last < <(cat $S 2>/dev/null || echo "$month 0 $now")
[ "$now" -lt "$last" ] && last=0            # redémarrage : le compteur du noyau repart de zéro
total=$((total + now - last))
[ "$smonth" != "$month" ] && { total=0; sudo systemctl enable --now kern0-bot; echo "$(date -Is) nouveau mois : robot relancé"; }
echo "$month $total $now" > $S
if [ "$total" -ge "$LIMIT" ] && systemctl is-enabled -q kern0-bot; then
  sudo systemctl disable --now kern0-bot
  echo "$(date -Is) $((total/1024/1024)) Mo émis ce mois : robot arrêté jusqu'au mois prochain"
fi
