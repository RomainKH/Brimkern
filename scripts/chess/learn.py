#!/usr/bin/env python3
"""La boucle d'apprentissage : le modèle apprend de CHAQUE partie qu'il joue.

    python scripts/chess/learn.py --base <run>/best.pt --data <prepare.py> --work <dossier> --generations 5
    python scripts/chess/learn.py ... --pgn mes-parties.pgn       # + les parties jouées sur /chess

Une génération :
  1. JOUER — N parties contre Stockfish bridé, au niveau où le modèle perd (le niveau s'ajuste : score
     > 65 % → +100 Elo, < 35 % → −100), plus les parties PGN fournies (celles jouées sur la page).
  2. ANNOTER — chaque position atteinte est analysée par Stockfish à pleine force (profondeur
     --depth, multi-PV 5) et encodée comme les données de pré-entraînement (prepare.record). Le
     résultat d'une partie seule est un signal trop pauvre ; ce sont les positions où le modèle se
     trompe, corrigées par le moteur, qui le font progresser (DAgger).
  3. RÉENTRAÎNER — depuis le champion, sur un mélange (--extra-frac) des positions annotées de TOUTES
     les générations et des données de base (pour ne pas oublier le reste).
  4. DÉPARTAGER — match candidat contre champion ; le candidat ne remplace le champion que s'il marque
     au moins --gate (55 % par défaut, comme AlphaZero).
Chaque génération est journalisée dans <work>/history.jsonl : c'est la courbe de progression MESURÉE.
Doux pour la machine : modèle sur 2 fils CPU, Stockfish sur 1 fil, entraînement en arrière-plan
(taskpolicy -b, mémoire bornée, rapport cyclique — cf. train.py).
"""
import argparse
import json
import os
import random
import shutil
import subprocess
import sys
import time

import chess
import chess.engine
import chess.pgn
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from play import Net, elo_from_score, model_move, sample_move  # noqa: E402
from prepare import record  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))


def play_game(white, black, net_for_opening, max_ply=400):
    """white / black : board → coup. Les 2 premiers coups de chaque camp sont tirés de la politique
    (température 1) pour varier les ouvertures. Rend (résultat, liste des FEN atteintes)."""
    board = chess.Board()
    fens = []
    while not board.is_game_over(claim_draw=True) and board.ply() < max_ply:
        fens.append(board.fen())
        if board.ply() < 4:
            mv = sample_move(net_for_opening, board)
        else:
            mv = (white if board.turn == chess.WHITE else black)(board)
        board.push(mv)
    return board.result(claim_draw=True), fens, board


def score_for(result, as_white):
    if result in ("1/2-1/2", "*"):
        return 0.5
    return 1.0 if (result == "1-0") == as_white else 0.0


def annotate(fens, depth, out_path, threads=1):
    """FEN → enregistrements annotés par Stockfish (pleine force), ajoutés à out_path."""
    sf = chess.engine.SimpleEngine.popen_uci("stockfish")
    sf.configure({"Threads": threads, "Hash": 64})
    n = 0
    with open(out_path, "ab") as f:
        for fen in fens:
            board = chess.Board(fen)
            if board.is_game_over():
                continue
            infos = sf.analyse(board, chess.engine.Limit(depth=depth), multipv=5)
            moves = []
            for info in infos:
                if "pv" not in info or not info["pv"]:
                    continue
                cp = info["score"].white().score(mate_score=100000)
                mv = info["pv"][0]
                moves.append((float(cp), mv.from_square, mv.to_square))
            rec = record(board, moves)
            if rec:
                f.write(rec)
                n += 1
    sf.quit()
    return n


def pgn_positions(path):
    fens = []
    with open(path) as f:
        while True:
            g = chess.pgn.read_game(f)
            if g is None:
                break
            b = g.board()
            for mv in g.mainline_moves():
                fens.append(b.fen())
                b.push(mv)
    return fens


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True, help="checkpoint de départ (le premier champion)")
    ap.add_argument("--data", required=True, help="données de base (prepare.py)")
    ap.add_argument("--work", required=True)
    ap.add_argument("--generations", type=int, default=3)
    ap.add_argument("--games", type=int, default=20, help="parties contre Stockfish par génération")
    ap.add_argument("--nodes", type=int, default=200)
    ap.add_argument("--sf-elo", type=int, default=1320, help="niveau de départ (s'ajuste ensuite)")
    ap.add_argument("--sf-time", type=float, default=0.1)
    ap.add_argument("--pgn", help="parties supplémentaires (ex. jouées sur /chess)")
    ap.add_argument("--depth", type=int, default=12, help="profondeur d'annotation Stockfish")
    ap.add_argument("--steps", type=int, default=2000, help="pas de réentraînement par génération")
    ap.add_argument("--lr", type=float, default=5e-4)
    ap.add_argument("--extra-frac", type=float, default=0.5)
    ap.add_argument("--gate-games", type=int, default=20)
    ap.add_argument("--gate", type=float, default=0.55)
    ap.add_argument("--duty", type=float, default=0.7)
    ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args()
    random.seed(a.seed)
    np.random.seed(a.seed)
    os.makedirs(a.work, exist_ok=True)
    buf_dir = os.path.join(a.work, "buffer")
    os.makedirs(buf_dir, exist_ok=True)
    buf = os.path.join(buf_dir, "train.bin")
    champ = os.path.join(a.work, "champion.pt")
    if not os.path.exists(champ):
        shutil.copy(a.base, champ)
    hist = open(os.path.join(a.work, "history.jsonl"), "a")
    sf_elo = a.sf_elo
    start_gen = sum(1 for _ in open(os.path.join(a.work, "history.jsonl")))

    for gen in range(start_gen, start_gen + a.generations):
        t0 = time.time()
        gdir = os.path.join(a.work, f"gen_{gen:03d}")
        os.makedirs(gdir, exist_ok=True)
        net = Net(champ)

        # 1. Jouer contre Stockfish bridé.
        sf = chess.engine.SimpleEngine.popen_uci("stockfish")
        sf.configure({"Threads": 1, "Hash": 16, "UCI_LimitStrength": True, "UCI_Elo": sf_elo})
        me = lambda b: model_move(net, b, a.nodes)  # noqa: E731
        them = lambda b: sf.play(b, chess.engine.Limit(time=a.sf_time)).move  # noqa: E731
        score, fens = 0.0, []
        with open(os.path.join(gdir, "games.pgn"), "w") as pgn:
            for g in range(a.games):
                w = g % 2 == 0
                res, f, board = play_game(me if w else them, them if w else me, net)
                score += score_for(res, w)
                fens += f
                game = chess.pgn.Game.from_board(board)
                game.headers.update({"White": "brimkern" if w else f"Stockfish {sf_elo}", "Black": f"Stockfish {sf_elo}" if w else "brimkern"})
                print(game, file=pgn, end="\n\n")
                print(f"[gen {gen}] partie {g + 1}/{a.games} contre SF {sf_elo} : {res} · score {score}/{g + 1}", flush=True)
        sf.quit()
        vs_sf = dict(sf_elo=sf_elo, games=a.games, score=score)
        diff, lo, hi = elo_from_score(score / a.games, a.games)
        vs_sf.update(elo_diff=diff, elo_ci95=[lo, hi], estimated_elo=sf_elo + diff)
        if a.pgn and gen == start_gen:
            fens += pgn_positions(a.pgn)

        # 2. Annoter (positions uniques).
        uniq = list(dict.fromkeys(fens))
        t1 = time.time()
        added = annotate(uniq, a.depth, buf)
        buffer_size = os.path.getsize(buf) // 82
        print(f"[gen {gen}] {added} positions annotées en {time.time() - t1:.0f} s · tampon {buffer_size}", flush=True)

        # 3. Réentraîner depuis le champion.
        cmd = ["taskpolicy", "-b", sys.executable, "-u", os.path.join(HERE, "train.py"), "--data", a.data, "--out", os.path.join(gdir, "train"),
               "--init", champ, "--extra", buf_dir, "--extra-frac", str(a.extra_frac), "--steps", str(a.steps), "--hours", "3",
               "--lr", str(a.lr), "--warmup", "100", "--eval-every", str(a.steps), "--duty", str(a.duty), "--tag", f"gen{gen}"]
        subprocess.run(cmd, check=True)
        cand = os.path.join(gdir, "train", "last.pt")

        # 4. Départager : candidat contre champion.
        cnet = Net(cand)
        cm = lambda b: model_move(cnet, b, a.nodes)  # noqa: E731
        pm = lambda b: model_move(net, b, a.nodes)  # noqa: E731
        gscore = 0.0
        for g in range(a.gate_games):
            w = g % 2 == 0
            res, _, _ = play_game(cm if w else pm, pm if w else cm, net)
            gscore += score_for(res, w)
        gate = gscore / a.gate_games
        accepted = gate >= a.gate
        if accepted:
            shutil.copy(cand, champ)
        gd, glo, ghi = elo_from_score(gate, a.gate_games)
        rec = dict(gen=gen, vs_stockfish=vs_sf, positions_added=added, buffer=buffer_size,
                   gate=dict(games=a.gate_games, score=gscore, elo_diff=gd, elo_ci95=[glo, ghi]), accepted=accepted,
                   minutes=round((time.time() - t0) / 60, 1))
        hist.write(json.dumps(rec) + "\n"); hist.flush()
        print(f"[gen {gen}] " + json.dumps(rec), flush=True)

        # Niveau de Stockfish pour la prochaine génération : là où ça se joue.
        s = score / a.games
        if s > 0.65:
            sf_elo += 100
        elif s < 0.35:
            sf_elo = max(1320, sf_elo - 100)


if __name__ == "__main__":
    main()
