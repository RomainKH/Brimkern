#!/usr/bin/env python3
"""Fixture de parité d'encodage Python ↔ TypeScript (src/lib/chess/encode.test.ts).

    python scripts/chess/encode_fixture.py > src/lib/chess/encode.fixture.json

Positions tirées de parties aléatoires (graine fixe), plus des cas choisis : prise en passant légale
ou bloquée par un clouage, roques partiels, promotions. Pour chacune : l'encodage de play.py et la
liste triée des indices de politique de ses coups légaux.
"""
import json
import os
import random
import sys

import chess

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from play import encode_board  # noqa: E402

FIXED = [
    "rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3",   # ep légal (exf6)
    "8/8/8/K2pP2r/8/8/8/7k w - d6 0 1",                                 # ep illégal : pion cloué
    "r3k2r/8/8/8/8/8/8/R3K2R b Kq - 0 1",                               # roques partiels, noirs au trait
    "8/1P6/8/8/8/8/6p1/k6K w - - 0 1",                                  # promotions des deux côtés
    "8/1P6/8/8/8/8/6p1/k6K b - - 0 1",
]


def entry(board):
    pieces, castle, ep, flip = encode_board(board)
    moves = sorted({((m.from_square ^ flip) * 64 + (m.to_square ^ flip)) for m in board.legal_moves})
    return {"fen": board.fen(), "pieces": [int(x) for x in pieces], "castle": int(castle), "ep": int(ep), "moves": moves}


def main():
    rng = random.Random(7)
    out = [entry(chess.Board(f)) for f in FIXED]
    for _ in range(40):
        b = chess.Board()
        for ply in range(rng.randint(10, 160)):
            moves = list(b.legal_moves)
            if not moves:
                break
            b.push(rng.choice(moves))
            if ply % 9 == 0:
                out.append(entry(b))
    json.dump(out, sys.stdout, separators=(",", ":"))


if __name__ == "__main__":
    main()
