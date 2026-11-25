#!/usr/bin/env python3
"""Banc de CONVERSION : brimkern sait-il finir une partie gagnée ?

    python scripts/chess/convert_bench.py --ckpt <run>/best.pt --n 8 --nodes 200

Positions aléatoires (graine fixe) Roi + Dame contre Roi et Roi + Tour contre Roi, brimkern au trait
avec la pièce, Stockfish à PLEINE force en défense. Chaque position est jouée par les DEUX bras
(remèdes de fin de partie coupés / actifs, cf. play.py), en alternance. On compte les mats en
50 coups au plus, et le nombre de coups jusqu'au mat.
"""
import argparse
import json
import os
import random
import sys
import time

import chess
import chess.engine
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from play import Net, model_move  # noqa: E402


def random_position(rng, piece):
    while True:
        sq = rng.sample(range(64), 3)
        b = chess.Board(None)
        b.set_piece_at(sq[0], chess.Piece(chess.KING, chess.WHITE))
        b.set_piece_at(sq[1], chess.Piece(piece, chess.WHITE))
        b.set_piece_at(sq[2], chess.Piece(chess.KING, chess.BLACK))
        b.turn = chess.WHITE
        if not b.is_valid() or b.is_game_over() or chess.square_distance(sq[0], sq[2]) < 2:
            continue
        # La pièce ne doit pas être en prise immédiate (sinon ce n'est plus une finale gagnée).
        b.turn = chess.BLACK
        hanging = b.is_attacked_by(chess.BLACK, sq[1]) and not b.is_attacked_by(chess.WHITE, sq[1])
        b.turn = chess.WHITE
        if not hanging:
            return b


def real_positions(path, n, rng):
    """Positions de validation où le trait est NETTEMENT gagnant sans mat connu (probabilité de gain
    0,90-0,98, soit ~+6 à +11 pions) avec 8 à 20 pièces. L'enregistrement est déjà du point de vue du
    trait (échiquier retourné pour les noirs) : on le rejoue tel quel, trait aux blancs."""
    rec = np.fromfile(path, dtype=np.uint8).reshape(-1, 82)
    sym = " PNBRQKpnbrqk"
    out, idx = [], list(range(len(rec)))
    rng.shuffle(idx)
    for i in idx:
        r = rec[i]
        if not (230 <= r[66] <= 250):
            continue
        n_pieces = int((r[:64] > 0).sum())
        if not (8 <= n_pieces <= 20):
            continue
        b = chess.Board(None)
        for sq in range(64):
            if r[sq]:
                b.set_piece_at(sq, chess.Piece.from_symbol(sym[r[sq]]))
        b.turn = chess.WHITE
        c = int(r[64])
        b.castling_rights = b.clean_castling_rights() & ((chess.BB_H1 if c & 1 else 0) | (chess.BB_A1 if c & 2 else 0) | (chess.BB_H8 if c & 4 else 0) | (chess.BB_A8 if c & 8 else 0))
        if not b.is_valid() or b.is_game_over():
            continue
        out.append(b)
        if len(out) == n:
            break
    return out


def play_out(net, sf, board, nodes, max_moves=50, contempt=0.0):
    board = board.copy()
    me, start = board.turn, board.ply()
    for _ in range(max_moves * 2):
        if board.is_game_over(claim_draw=True):
            break
        if board.turn == me:
            board.push(model_move(net, board, nodes, contempt))
        else:
            board.push(sf.play(board, chess.engine.Limit(time=0.05)).move)
    return board.is_checkmate() and board.turn != me, (board.ply() - start + 1) // 2


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ckpt", required=True)
    ap.add_argument("--n", type=int, default=8, help="positions par finale")
    ap.add_argument("--nodes", type=int, default=200)
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--real", help="dossier de prepare.py : positions GAGNÉES réelles (val.bin) au lieu de KQK/KRK")
    ap.add_argument("--max-moves", type=int, default=50)
    ap.add_argument("--fen", action="append", help="position précise (brimkern a le trait), répétable")
    ap.add_argument("--aggression", type=float, default=0.0, help="style agressif (comme la page : 1)")
    ap.add_argument("--contempt", type=float, default=0.0, help="contempt (comme la page : 0,2)")
    ap.add_argument("--arms", default="sans,avec", help="bras à jouer parmi sans,avec")
    a = ap.parse_args()
    rng = random.Random(a.seed)
    if a.fen:
        positions = [("fen", chess.Board(f)) for f in a.fen]
    elif a.real:
        positions = [("réelle", b) for b in real_positions(os.path.join(a.real, "val.bin"), a.n, rng)]
    else:
        positions = [("KQK", random_position(rng, chess.QUEEN)) for _ in range(a.n)] + [("KRK", random_position(rng, chess.ROOK)) for _ in range(a.n)]
    # Bras : « sans » = aucun remède de fin de partie ; « avec » = remèdes, style partout (même gagné) ;
    # « restreint » = remèdes, style coupé une fois la partie gagnée (|v| ≥ 0,9) ; « ancien » = la page
    # avant correctifs (aucun remède, style partout).
    every = {"sans": Net(a.ckpt, endgame=False, aggression=a.aggression),
             "ancien": Net(a.ckpt, endgame=False, aggression=a.aggression, aggr_all=True),
             "avec": Net(a.ckpt, endgame=True, aggression=a.aggression, aggr_all=True),
             "restreint": Net(a.ckpt, endgame=True, aggression=a.aggression)}
    nets = {k: every[k] for k in a.arms.split(",")}
    sf = chess.engine.SimpleEngine.popen_uci("stockfish")
    sf.configure({"Threads": 1, "Hash": 16})
    res = {arm: {k: [] for k in dict.fromkeys(kind for kind, _ in positions)} for arm in nets}
    t0 = time.time()
    for i, (kind, b) in enumerate(positions):
        arms = list(nets)[i % len(nets):] + list(nets)[:i % len(nets)]  # bras en rotation
        for arm in arms:
            mated, moves = play_out(nets[arm], sf, b, a.nodes, a.max_moves, a.contempt)
            res[arm][kind].append(moves if mated else None)
            print(f"{kind} #{i % a.n + 1} {arm:9s} : {'mat en ' + str(moves) + ' coups' if mated else f'PAS DE MAT en {a.max_moves} coups'} · {time.time() - t0:.0f} s", flush=True)
    sf.quit()
    summary = {}
    for arm, by in res.items():
        for kind, lst in by.items():
            done = [x for x in lst if x is not None]
            summary[f"{arm}/{kind}"] = {"mats": f"{len(done)}/{len(lst)}", "coups_moyens": round(sum(done) / len(done), 1) if done else None}
    print("résumé", json.dumps(summary, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
