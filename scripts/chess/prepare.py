#!/usr/bin/env python3
"""Base d'évaluations Lichess (JSONL, stdin décompressé) → positions encodées pour l'entraînement.

    curl -s https://database.lichess.org/lichess_db_eval.jsonl.zst | zstd -dc \
      | python scripts/chess/prepare.py --out <dossier> --max 30000000

Chaque ligne : une FEN et une ou plusieurs analyses Stockfish (multi-PV, cp ou mat, du point de vue
des BLANCS). On garde l'analyse la plus profonde. Le script s'arrête au quota : curl meurt en SIGPIPE,
on ne télécharge que le début des 22 Go. Données : base Lichess, CC0.

Enregistrement = 82 octets, du point de vue du TRAIT (les noirs voient l'échiquier retourné :
case s → s ^ 56, couleurs échangées) — le même encodage que src/lib/chess/encode.ts :
  [0:64]   pièce par case : 0 vide, 1-6 = P N B R Q K du trait, 7-12 = celles de l'adversaire
  [64]     roques, 4 bits : petit/grand du trait, petit/grand de l'adversaire
  [65]     case de prise en passant (0-63) SEULEMENT si une prise est légale, sinon 64
  [66]     valeur : probabilité de gain du trait selon la meilleure ligne, 0-255
  [67:82]  jusqu'à 5 coups candidats (de, vers, probabilité de gain 0-255) ; de = 255 → vide.
           La promotion se résume à de→vers (le modèle promeut en dame).
Validation : une position sur 200 (hachage de la FEN), jamais vue à l'entraînement.
"""
import argparse
import json
import multiprocessing as mp
import os
import sys
import time
import zlib

import chess

REC = 82
K = 5
PIECES = {"P": 1, "N": 2, "B": 3, "R": 4, "Q": 5, "K": 6}


def winprob(cp_white: float, white_to_move: bool) -> float:
    # Formule de Lichess (page « accuracy ») : probabilité de gain depuis les centipions.
    cp = cp_white if white_to_move else -cp_white
    return 1.0 / (1.0 + pow(2.718281828, -0.00368208 * cp))


def pv_score(pv) -> float:
    if "mate" in pv:
        m = pv["mate"]
        return (100000 - abs(m)) * (1 if m > 0 else -1)
    return float(pv["cp"])


def sq(name: str) -> int:
    return (ord(name[0]) - 97) + 8 * (ord(name[1]) - 49)


def record(board, moves):
    """Position + coups notés → enregistrement de 82 octets (cf. en-tête). `moves` : liste de
    (score en centipions du point de vue des BLANCS, case de départ, case d'arrivée), cases non
    retournées. Partagé avec learn.py (positions des parties du modèle annotées par Stockfish)."""
    white = board.turn == chess.WHITE
    flip = 0 if white else 56
    rec = bytearray(REC)
    for s, p in board.piece_map().items():
        rec[s ^ flip] = p.piece_type + (0 if p.color == board.turn else 6)
    me, opp = board.turn, not board.turn
    rec[64] = (board.has_kingside_castling_rights(me) | board.has_queenside_castling_rights(me) << 1
               | board.has_kingside_castling_rights(opp) << 2 | board.has_queenside_castling_rights(opp) << 3)
    rec[65] = (board.ep_square ^ flip) if (board.ep_square is not None and board.has_legal_en_passant()) else 64
    scored, seen = [], set()
    for cp, f, t in moves:
        piece = board.piece_at(f)
        # Roque noté roi-prend-tour (e1h1) dans certaines sources : ramené à e1g1 / e1c1.
        if piece and piece.piece_type == chess.KING and abs(t - f) in (3, 4) and t // 8 == f // 8:
            t = f + (2 if t > f else -2)
        if (f, t) in seen:
            continue
        seen.add((f, t))
        scored.append((winprob(cp, white), f ^ flip, t ^ flip))
    if not scored:
        return None
    scored.sort(reverse=True)
    rec[66] = round(scored[0][0] * 255)
    for i in range(K):
        o = 67 + 3 * i
        if i < len(scored):
            wp, f, t = scored[i]
            rec[o], rec[o + 1], rec[o + 2] = f, t, round(wp * 255)
        else:
            rec[o] = 255
    return bytes(rec)


def encode(line: str):
    try:
        d = json.loads(line)
    except ValueError:
        return None
    ev = max(d.get("evals") or [{}], key=lambda e: e.get("depth", 0))
    pvs = [p for p in ev.get("pvs", []) if p.get("line")]
    if not pvs:
        return None
    fen = d["fen"]
    board = chess.Board(fen + " 0 1")
    moves = []
    for pv in pvs:
        uci = pv["line"].split(" ", 1)[0]
        moves.append((pv_score(pv), sq(uci[0:2]), sq(uci[2:4])))
    rec = record(board, moves)
    if rec is None:
        return None
    return zlib.crc32(fen.encode()) % 200 == 0, rec


def work(lines):
    out = []
    for l in lines:
        try:
            r = encode(l)
        except Exception:
            r = None
        if r:
            out.append(r)
    return out


def chunks(stream, n=5000):
    buf = []
    for l in stream:
        buf.append(l)
        if len(buf) == n:
            yield buf
            buf = []
    if buf:
        yield buf


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--max", type=int, default=30_000_000, help="training positions")
    ap.add_argument("--workers", type=int, default=max(1, (os.cpu_count() or 4) - 2))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    ftr = open(os.path.join(a.out, "train.bin"), "wb")
    fva = open(os.path.join(a.out, "val.bin"), "wb")
    n_tr = n_va = 0
    t0 = time.time()
    stream = (l.decode("utf-8", "replace") for l in sys.stdin.buffer)
    with mp.Pool(a.workers) as pool:
        for res in pool.imap(work, chunks(stream), chunksize=1):
            for val, rec in res:
                if val:
                    fva.write(rec); n_va += 1
                else:
                    ftr.write(rec); n_tr += 1
            dt = time.time() - t0
            print(f"\r{dt:6.0f} s · train {n_tr:,} · val {n_va:,} · {n_tr / max(dt, 1):,.0f} pos/s", end="", flush=True)
            if n_tr >= a.max:
                break
        pool.terminate()
    ftr.close(); fva.close()
    print(f"\ndone: {n_tr:,} training positions, {n_va:,} validation ({REC} bytes each)")


if __name__ == "__main__":
    main()
