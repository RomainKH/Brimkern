#!/usr/bin/env python3
"""Le modèle contre Stockfish bridé (UCI_Elo), avec ou sans recherche — la mesure de force.

    python scripts/chess/play.py --ckpt <run>/best.pt --sf-elo 1320 --games 20 --nodes 400

  --nodes 0   : politique seule (le coup le plus probable parmi les coups légaux) — le réseau nu.
  --nodes N   : MCTS (PUCT) de N évaluations par coup, politique en a priori, valeur en feuille.
Le modèle tourne sur le CPU (--threads, 2 par défaut) pour ne pas disputer le GPU à un entraînement.
Stockfish : 1 fil, UCI_LimitStrength + UCI_Elo (minimum 1320), --sf-time secondes par coup.
Couleurs alternées ; les 2 premiers coups de chaque camp sont tirés de la politique (température 1)
pour que les parties ne se répètent pas.

Sorties (--out) : games.pgn, positions.fen (toutes les positions atteintes — la matière de la boucle
d'apprentissage, cf. learn.py), summary.json (score, écart Elo estimé et son intervalle à 95 %).
"""
import argparse
import json
import math
import os
import random
import sys
import time

import chess
import chess.engine
import chess.pgn
import numpy as np
import torch

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from model import ChessNet  # noqa: E402


def encode_board(board: chess.Board):
    """Même encodage que prepare.py : point de vue du trait, échiquier retourné pour les noirs."""
    white = board.turn == chess.WHITE
    flip = 0 if white else 56
    pieces = np.zeros(64, dtype=np.int64)
    for s, p in board.piece_map().items():
        pieces[s ^ flip] = p.piece_type + (0 if p.color == board.turn else 6)
    me, opp = board.turn, not board.turn
    castle = (board.has_kingside_castling_rights(me) | board.has_queenside_castling_rights(me) << 1
              | board.has_kingside_castling_rights(opp) << 2 | board.has_queenside_castling_rights(opp) << 3)
    ep = (board.ep_square ^ flip) if (board.ep_square is not None and board.has_legal_en_passant()) else 64
    return pieces, castle, ep, flip


class Net:
    def __init__(self, ckpt, loops=None, threads=2):
        torch.set_num_threads(threads)
        ck = torch.load(ckpt, map_location="cpu")
        self.model = ChessNet(**ck["cfg"])
        self.model.load_state_dict(ck["state"])
        self.model.set_ternary(bool(ck.get("ternary")))
        self.model.eval()
        self.loops = loops or ck.get("loops", 6)

    @torch.no_grad()
    def evaluate(self, boards):
        """→ [(coups légaux, a priori), valeur ∈ [−1, 1] du point de vue du trait] par position."""
        enc = [encode_board(b) for b in boards]
        p = torch.from_numpy(np.stack([e[0] for e in enc]))
        c = torch.tensor([e[1] for e in enc])
        e = torch.tensor([x[2] for x in enc])
        logits, v = self.model(p, c, e, self.loops)
        out = []
        for i, b in enumerate(boards):
            flip = enc[i][3]
            moves = list(b.legal_moves)
            idx = [((m.from_square ^ flip) * 64 + (m.to_square ^ flip)) for m in moves]
            lg = logits[i, idx].numpy().astype(np.float64)
            # Sous-promotions : même case d'arrivée que la dame, a priori quasi nul.
            for j, m in enumerate(moves):
                if m.promotion and m.promotion != chess.QUEEN:
                    lg[j] -= 6.0
            pr = np.exp(lg - lg.max())
            pr /= pr.sum()
            out.append((moves, pr, float(2 * torch.sigmoid(v[i]) - 1)))
        return out


class Node:
    __slots__ = ("prior", "N", "W", "children", "moves")

    def __init__(self, prior):
        self.prior, self.N, self.W, self.children, self.moves = prior, 0, 0.0, None, None


def terminal_value(board):
    """Valeur pour le trait si la partie est finie dans l'arbre, sinon None."""
    if board.is_checkmate():
        return -1.0
    if board.is_stalemate() or board.is_insufficient_material() or board.halfmove_clock >= 100 or board.is_repetition(2):
        return 0.0
    return None


def mcts(net, board, nodes, batch=8, c_puct=1.5, fpu=0.2):
    root = Node(1.0)
    (moves, pr, _), = net.evaluate([board])
    root.moves, root.children = moves, [Node(float(x)) for x in pr]
    root.N = 1
    done = 0
    while done < nodes:
        pending = []
        for _ in range(min(batch, nodes - done)):
            node, path, pushed, tv = root, [root], 0, None
            while node.children is not None:
                sq = math.sqrt(node.N)
                parent_q = -(node.W / node.N) if node.N else 0.0
                best, bi = -1e9, 0
                for i, ch in enumerate(node.children):
                    q = (ch.W / ch.N) if ch.N else parent_q - fpu
                    u = q + c_puct * ch.prior * sq / (1 + ch.N)
                    if u > best:
                        best, bi = u, i
                board.push(node.moves[bi])
                pushed += 1
                node = node.children[bi]
                path.append(node)
                tv = terminal_value(board)
                if tv is not None:
                    break
            # Perte virtuelle : les autres feuilles du lot évitent ce chemin.
            for n in path:
                n.N += 1
                n.W -= 1.0
            if tv is not None:
                pending.append((path, None, tv))
            else:
                pending.append((path, board.copy(stack=8), None))
            for _ in range(pushed):
                board.pop()
        to_eval = [(i, b) for i, (_, b, _) in enumerate(pending) if b is not None]
        evals = net.evaluate([b for _, b in to_eval]) if to_eval else []
        results = {}
        for (i, _), (moves, pr, v) in zip(to_eval, evals):
            leaf = pending[i][0][-1]
            if leaf.children is None:
                leaf.moves, leaf.children = moves, [Node(float(x)) for x in pr]
            results[i] = v
        for i, (path, _, tv) in enumerate(pending):
            v = results[i] if tv is None and i in results else tv
            # v est du point de vue du trait à la feuille ; le nœud feuille compte pour son parent.
            v = -v
            for n in reversed(path):
                n.N -= 1
                n.W += 1.0
                n.N += 1
                n.W += v
                v = -v
            done += 1
    visits = [ch.N for ch in root.children]
    return root.moves[int(np.argmax(visits))], root


def model_move(net, board, nodes):
    if nodes <= 0:
        (moves, pr, _), = net.evaluate([board])
        return moves[int(np.argmax(pr))]
    return mcts(net, board, nodes)[0]


def sample_move(net, board, temp=1.0):
    (moves, pr, _), = net.evaluate([board])
    p = pr ** (1 / temp)
    p /= p.sum()
    return moves[int(np.random.choice(len(moves), p=p))]


def elo_from_score(score, n):
    s = min(max(score, 0.5 / n), 1 - 0.5 / n)
    diff = -400 * math.log10(1 / s - 1)
    se = math.sqrt(s * (1 - s) / n)
    lo, hi = min(max(s - 1.96 * se, 1e-3), 1 - 1e-3), min(max(s + 1.96 * se, 1e-3), 1 - 1e-3)
    return round(diff), round(-400 * math.log10(1 / lo - 1)), round(-400 * math.log10(1 / hi - 1))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ckpt", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--games", type=int, default=20)
    ap.add_argument("--nodes", type=int, default=400)
    ap.add_argument("--loops", type=int)
    ap.add_argument("--threads", type=int, default=2)
    ap.add_argument("--sf-elo", type=int, default=1320)
    ap.add_argument("--sf-time", type=float, default=0.1)
    ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args()
    random.seed(a.seed)
    np.random.seed(a.seed)
    os.makedirs(a.out, exist_ok=True)
    net = Net(a.ckpt, a.loops, a.threads)
    sf = chess.engine.SimpleEngine.popen_uci("stockfish")
    sf.configure({"Threads": 1, "Hash": 16, "UCI_LimitStrength": True, "UCI_Elo": a.sf_elo})
    pgn_f = open(os.path.join(a.out, "games.pgn"), "a")
    fen_f = open(os.path.join(a.out, "positions.fen"), "a")
    score = 0.0
    t0 = time.time()
    for g in range(a.games):
        model_white = g % 2 == 0
        board = chess.Board()
        while not board.is_game_over(claim_draw=True) and board.ply() < 400:
            fen_f.write(board.fen() + "\n")
            model_turn = (board.turn == chess.WHITE) == model_white
            if board.ply() < 4:
                mv = sample_move(net, board)
            elif model_turn:
                mv = model_move(net, board, a.nodes)
            else:
                mv = sf.play(board, chess.engine.Limit(time=a.sf_time)).move
            board.push(mv)
        res = board.result(claim_draw=True)
        pts = 0.5 if res in ("1/2-1/2", "*") else (1.0 if (res == "1-0") == model_white else 0.0)
        score += pts
        game = chess.pgn.Game.from_board(board)
        game.headers.update({"White": "brimkern" if model_white else f"Stockfish {a.sf_elo}",
                             "Black": f"Stockfish {a.sf_elo}" if model_white else "brimkern",
                             "Event": f"nodes={a.nodes} sf_time={a.sf_time}"})
        print(game, file=pgn_f, end="\n\n")
        pgn_f.flush(); fen_f.flush()
        print(f"partie {g + 1}/{a.games} · {'blancs' if model_white else 'noirs'} · {res} · {board.ply()} demi-coups · "
              f"score {score}/{g + 1} · {time.time() - t0:.0f} s", flush=True)
    sf.quit()
    diff, lo, hi = elo_from_score(score / a.games, a.games)
    summary = dict(ckpt=a.ckpt, nodes=a.nodes, loops=net.loops, sf_elo=a.sf_elo, sf_time=a.sf_time, games=a.games,
                   score=score, elo_diff=diff, elo_ci95=[lo, hi], estimated_elo=a.sf_elo + diff)
    json.dump(summary, open(os.path.join(a.out, "summary.json"), "w"), indent=1)
    print("résumé", json.dumps(summary), flush=True)


if __name__ == "__main__":
    main()
