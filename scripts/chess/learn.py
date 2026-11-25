#!/usr/bin/env python3
"""La boucle d'apprentissage : le modèle apprend de CHAQUE partie qu'il joue.

    python scripts/chess/learn.py --base <run>/best.pt --data <prepare.py> --work <dossier> --generations 5
    python scripts/chess/learn.py ... --pgn mes-parties.pgn       # + les parties jouées sur /chess

Une génération :
  1. JOUER — N parties contre un barreau de l'ÉCHELLE d'adversaires (--ladder : Maia 1100 → 1900,
     puis Stockfish bridé) ; le barreau s'ajuste pour que les parties restent SERRÉES (score > 60 %
     → barreau suivant, < 40 % → précédent), plus les parties PGN fournies (celles jouées sur la page).
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
from play import Net, elo_from_score, make_opponent, model_move, sample_move  # noqa: E402
from prepare import record  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))


def play_game(white, black, net_for_opening, max_ply=400, on_move=None):
    """white / black : board → coup. Les 2 premiers coups de chaque camp sont tirés de la politique
    (température 1) pour varier les ouvertures. Rend (résultat, liste des FEN atteintes).
    on_move(board) : appelé après chaque coup (suivi en direct, live.json)."""
    board = chess.Board()
    fens = []
    if on_move:
        on_move(board)
    while not board.is_game_over(claim_draw=True) and board.ply() < max_ply:
        fens.append(board.fen())
        if board.ply() < 4:
            mv = sample_move(net_for_opening, board)
        else:
            mv = (white if board.turn == chess.WHITE else black)(board)
        board.push(mv)
        if on_move:
            on_move(board)
    return board.result(claim_draw=True), fens, board


class Live:
    """État du direct, réécrit atomiquement dans <work>/live.json (lu par live.py / live.html)."""

    def __init__(self, work):
        self.path = os.path.join(work, "live.json")
        self.state = {}

    def set(self, **kw):
        self.state.update(kw, updated=time.time())
        tmp = self.path + ".tmp"
        with open(tmp, "w") as f:
            json.dump(self.state, f)
        os.replace(tmp, self.path)

    def board(self, board, **kw):
        san, b = [], chess.Board()
        for mv in board.move_stack:
            san.append(b.san(mv))
            b.push(mv)
        last = board.move_stack[-1].uci() if board.move_stack else None
        self.set(fen=board.fen(), moves=san, last=last, check=board.is_check(), **kw)


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
    ap.add_argument("--ladder", default="maia:1100,maia:1300,maia:1500,maia:1700,maia:1900,sf:1320,sf:1500,sf:1700,sf:2000,sf:2300,sf:2600",
                    help="adversaires du plus faible au plus fort (cf. play.make_opponent)")
    ap.add_argument("--rung", type=int, default=0, help="barreau de départ")
    ap.add_argument("--sf-time", type=float, default=0.1)
    ap.add_argument("--pgn", help="parties supplémentaires (ex. jouées sur /chess)")
    ap.add_argument("--depth", type=int, default=12, help="profondeur d'annotation Stockfish")
    ap.add_argument("--steps", type=int, default=2000, help="pas de réentraînement par génération")
    ap.add_argument("--lr", type=float, default=5e-4)
    ap.add_argument("--extra-frac", type=float, default=0.5)
    ap.add_argument("--gate-games", type=int, default=20)
    ap.add_argument("--gate", type=float, default=0.55)
    ap.add_argument("--duty", type=float, default=0.7)
    ap.add_argument("--aggression", type=float, default=0.0, help="style agressif dans les cibles de réentraînement (train.py)")
    ap.add_argument("--play-aggression", type=float, default=0.0, help="bonus d'a priori des prises/échecs en recherche")
    ap.add_argument("--contempt", type=float, default=0.0, help="valeur négative d'une nulle pour brimkern en recherche")
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
    live = Live(a.work)

    def history_rows():
        with open(os.path.join(a.work, "history.jsonl")) as f:
            return [json.loads(l) for l in f if l.strip()]
    ladder = a.ladder.split(",")
    rung = a.rung
    start_gen = sum(1 for _ in open(os.path.join(a.work, "history.jsonl")))

    for gen in range(start_gen, start_gen + a.generations):
        t0 = time.time()
        gdir = os.path.join(a.work, f"gen_{gen:03d}")
        os.makedirs(gdir, exist_ok=True)
        net = Net(champ, aggression=a.play_aggression)
        results = []
        live.set(gen=gen, phase="play", ladder=ladder, rung=rung, results=results, games=a.games, history=history_rows())

        # 1. Jouer contre le barreau courant de l'échelle.
        opp_name, sf, opp_limit = make_opponent(ladder[rung], a.sf_time)
        me = lambda b: model_move(net, b, a.nodes, a.contempt)  # noqa: E731
        them = lambda b: sf.play(b, opp_limit).move  # noqa: E731
        score, fens = 0.0, []
        with open(os.path.join(gdir, "games.pgn"), "w") as pgn:
            for g in range(a.games):
                w = g % 2 == 0
                names = ("brimkern" if w else opp_name, opp_name if w else "brimkern")
                live.set(game=g + 1, white=names[0], black=names[1], opponent=opp_name, score=score)
                res, f, board = play_game(me if w else them, them if w else me, net, on_move=lambda b: live.board(b))
                score += score_for(res, w)
                results.append({"white": names[0], "black": names[1], "result": res, "points": score_for(res, w)})
                live.set(results=results, score=score)
                fens += f
                game = chess.pgn.Game.from_board(board)
                game.headers.update({"White": "brimkern" if w else opp_name, "Black": opp_name if w else "brimkern"})
                print(game, file=pgn, end="\n\n")
                print(f"[gen {gen}] partie {g + 1}/{a.games} contre {opp_name} : {res} · score {score}/{g + 1}", flush=True)
        sf.quit()
        vs_sf = dict(opponent=opp_name, games=a.games, score=score)
        diff, lo, hi = elo_from_score(score / a.games, a.games)
        vs_sf.update(elo_diff=diff, elo_ci95=[lo, hi])
        if a.pgn and gen == start_gen:
            fens += pgn_positions(a.pgn)

        # 2. Annoter (positions uniques).
        uniq = list(dict.fromkeys(fens))
        t1 = time.time()
        live.set(phase="annotate", positions=len(uniq))
        added = annotate(uniq, a.depth, buf)
        buffer_size = os.path.getsize(buf) // 82
        print(f"[gen {gen}] {added} positions annotées en {time.time() - t1:.0f} s · tampon {buffer_size}", flush=True)

        # 3. Réentraîner depuis le champion.
        cmd = ["taskpolicy", "-b", sys.executable, "-u", os.path.join(HERE, "train.py"), "--data", a.data, "--out", os.path.join(gdir, "train"),
               "--init", champ, "--extra", buf_dir, "--extra-frac", str(a.extra_frac), "--steps", str(a.steps), "--hours", "3",
               "--lr", str(a.lr), "--warmup", "100", "--eval-every", str(a.steps), "--duty", str(a.duty), "--tag", f"gen{gen}",
               "--aggression", str(a.aggression)]
        live.set(phase="train", steps=a.steps)
        subprocess.run(cmd, check=True)
        cand = os.path.join(gdir, "train", "last.pt")

        # 4. Départager : candidat contre champion.
        cnet = Net(cand, aggression=a.play_aggression)
        cm = lambda b: model_move(cnet, b, a.nodes, a.contempt)  # noqa: E731
        pm = lambda b: model_move(net, b, a.nodes, a.contempt)  # noqa: E731
        gscore = 0.0
        gresults = []
        live.set(phase="gate", results=gresults, games=a.gate_games, score=0.0, opponent=f"champion gen {gen}")
        for g in range(a.gate_games):
            w = g % 2 == 0
            names = (f"candidate gen {gen}" if w else "champion", "champion" if w else f"candidate gen {gen}")
            live.set(game=g + 1, white=names[0], black=names[1])
            res, _, _ = play_game(cm if w else pm, pm if w else cm, net, on_move=lambda b: live.board(b))
            gscore += score_for(res, w)
            gresults.append({"white": names[0], "black": names[1], "result": res, "points": score_for(res, w)})
            live.set(results=gresults, score=gscore)
        gate = gscore / a.gate_games
        accepted = gate >= a.gate
        if accepted:
            shutil.copy(cand, champ)
        gd, glo, ghi = elo_from_score(gate, a.gate_games)
        rec = dict(gen=gen, vs_opponent=vs_sf, positions_added=added, buffer=buffer_size,
                   gate=dict(games=a.gate_games, score=gscore, elo_diff=gd, elo_ci95=[glo, ghi]), accepted=accepted,
                   minutes=round((time.time() - t0) / 60, 1))
        hist.write(json.dumps(rec) + "\n"); hist.flush()
        live.set(history=history_rows())
        print(f"[gen {gen}] " + json.dumps(rec), flush=True)

        # Barreau de la prochaine génération : là où les parties restent serrées.
        s = score / a.games
        if s > 0.6:
            rung = min(len(ladder) - 1, rung + 1)
        elif s < 0.4:
            rung = max(0, rung - 1)


if __name__ == "__main__":
    main()
