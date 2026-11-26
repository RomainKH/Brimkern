#!/usr/bin/env python3
"""Kern 0 en moteur UCI, pour une interface d'échecs (Arena, Cute Chess, BanksiaGUI…) ou un compte BOT
Lichess (lichess-bot). Tout tournoi de moteurs (Computer Chess Championship de Chess.com, TCEC, listes
CCRL) demande un programme qui parle UCI : c'est la première marche.

    python scripts/chess/uci.py --weights <champion.pt>              # Kern 0
    python scripts/chess/uci.py --weights <nano.pt> --loops 4        # Kern 0 Nano

Recherche : la MCTS de play.py, réglée comme la boucle d'apprentissage (style agressif, contempt 0,2).
Nœuds par coup : `go nodes N` tel quel ; avec une pendule (`movetime`, `wtime`/`btime`…), vitesse mesurée
au démarrage × temps alloué (1/30 du temps restant + 3/4 de l'incrément), bornée par l'option Nodes.
La recherche n'est pas interruptible : `stop` est ignoré, le budget de nœuds tient lieu de limite.
"""
import argparse
import os
import sys
import time

import chess

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from play import Net, model_move  # noqa: E402


def nodes_for(args, board, speed, max_nodes):
    """Budget de nœuds d'un `go` UCI."""
    kv = {}
    it = iter(args)
    for k in it:
        if k in ("nodes", "movetime", "wtime", "btime", "winc", "binc", "movestogo", "depth"):
            kv[k] = int(next(it, "0"))
    if "nodes" in kv:
        return max(1, kv["nodes"])
    if "movetime" in kv:
        secs = kv["movetime"] / 1000
    elif "wtime" in kv or "btime" in kv:
        side = "w" if board.turn == chess.WHITE else "b"
        left, inc = kv.get(f"{side}time", 0) / 1000, kv.get(f"{side}inc", 0) / 1000
        secs = left / max(kv.get("movestogo", 30), 1) + 0.75 * inc
        secs = min(secs, left * 0.5)
    else:
        return max_nodes
    return int(max(1, min(max_nodes, speed * secs * 0.9)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weights", required=True)
    ap.add_argument("--loops", type=int, help="boucles du bloc (Nano : 4) ; par défaut celles du checkpoint")
    ap.add_argument("--threads", type=int, default=1)
    ap.add_argument("--name", default="Kern 0")
    a = ap.parse_args()
    net = Net(a.weights, loops=a.loops, threads=a.threads, aggression=1.0)
    t = time.perf_counter()
    model_move(net, chess.Board(), 64, 0.2)  # vitesse mesurée sur une vraie recherche
    speed = 64 / (time.perf_counter() - t)
    board, max_nodes = chess.Board(), 800

    def out(line):
        sys.stdout.write(line + "\n")
        sys.stdout.flush()

    for raw in sys.stdin:
        tok = raw.split()
        if not tok:
            continue
        cmd = tok[0]
        if cmd == "uci":
            out(f"id name {a.name}")
            out("id author brimkern")
            out(f"option name Nodes type spin default {max_nodes} min 1 max 1000000")
            out("uciok")
        elif cmd == "isready":
            out("readyok")
        elif cmd == "setoption" and len(tok) >= 5 and tok[2].lower() == "nodes":
            max_nodes = max(1, int(tok[4]))
        elif cmd == "ucinewgame":
            board = chess.Board()
        elif cmd == "position":
            moves_at = tok.index("moves") if "moves" in tok else len(tok)
            board = chess.Board() if tok[1] == "startpos" else chess.Board(" ".join(tok[2:moves_at]))
            for u in tok[moves_at + 1:]:
                board.push_uci(u)
        elif cmd == "go":
            if board.is_game_over():
                out("bestmove 0000")
                continue
            n = nodes_for(tok[1:], board, speed, max_nodes)
            t = time.perf_counter()
            mv = model_move(net, board, n, 0.2)
            dt = time.perf_counter() - t
            out(f"info nodes {n} time {int(dt * 1000)} nps {int(n / max(dt, 1e-6))}")
            out(f"bestmove {mv.uci()}")
        elif cmd == "quit":
            return


if __name__ == "__main__":
    main()
