#!/usr/bin/env python3
"""Fixture de parité Python ↔ TypeScript pour la valeur façonnée des positions gagnées
(play.progress_value ↔ mcts.ts progressValue) — la page doit se comporter comme ce qui est mesuré.

    python scripts/chess/progress_fixture.py > src/lib/chess/progress.fixture.json
"""
import json
import os
import random
import sys

import chess

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from play import progress_value  # noqa: E402

FIXED = [
    "8/q7/8/8/8/1p1K4/1P4k1/8 b - - 1 63",       # la partie de Romain : D+R contre R+P
    "8/8/8/4k3/8/8/8/R3K3 w - - 0 1",              # T+R contre R nu
    "7k/8/5K2/8/8/8/8/6Q1 w - - 30 80",            # D+R contre R nu, compteur des 50 coups à 30
    "r3k3/8/8/8/8/8/3PPP2/R3K2R w - - 0 1",        # gagné avec des pions
]


def main():
    rng = random.Random(3)
    out = []
    for fen in FIXED:
        b = chess.Board(fen)
        for v in (0.95, -0.95, 0.5):
            out.append({"fen": fen, "v": v, "out": progress_value(b, v)})
    for _ in range(30):
        b = chess.Board()
        for _ in range(rng.randint(20, 120)):
            moves = list(b.legal_moves)
            if not moves:
                break
            b.push(rng.choice(moves))
        if not b.is_game_over():
            v = rng.choice([0.92, -0.97, 0.99])
            out.append({"fen": b.fen(), "v": v, "out": progress_value(b, v)})
    json.dump(out, sys.stdout)


if __name__ == "__main__":
    main()
