#!/usr/bin/env python3
"""La boucle d'apprentissage : le modèle apprend de CHAQUE partie qu'il joue.

    python scripts/chess/learn.py --base <run>/best.pt --data <prepare.py> --work <dossier> --generations 5
    python scripts/chess/learn.py ... --pgn mes-parties.pgn       # + les parties jouées sur /chess

Une génération :
  1. JOUER — N parties contre un barreau de l'ÉCHELLE (--ladder : Stockfish bridé, UCI_Elo 1320 →
     3190) ; le barreau s'ajuste pour que les parties restent SERRÉES (score > 60 % → barreau
     suivant, < 40 % → précédent, ±2 au-delà de 85 % / en deçà de 15 %), plus les parties PGN
     fournies (celles jouées sur la page). L'objectif est de BATTRE Stockfish : le score de ces
     parties est la courbe qui compte, la ressemblance aux coups de Stockfish n'est qu'un moyen.
     Plusieurs échelles séparées par « ; » (ex. Stockfish puis Leela Chess Zero) : une génération
     chacune à tour de rôle, chaque échelle garde son propre barreau (--rung 0,3).
     OUVERTURES (--openings, openings.py) : chaque PAIRE de parties (Kern 0 Blancs puis Noirs) part
     d'une même ouverture du livre des grands joueurs, vérifié par Stockfish, ou du début d'une partie
     célèbre (--iconic-pairs). Sans livre, les 4 premiers demi-coups sont tirés de la politique.
  2. ANNOTER — chaque position atteinte est analysée par Stockfish à pleine force (profondeur
     --depth, multi-PV 5) et encodée comme les données de pré-entraînement (prepare.record). Le
     résultat d'une partie seule est un signal trop pauvre ; ce sont les positions où le modèle se
     trompe, corrigées par le moteur, qui le font progresser (DAgger). Chaque coup JOUÉ par brimkern
     est noté : une ERREUR (perte de probabilité de gain ≥ --mistake) est écrite --mistake-weight
     fois dans le tampon — ce sont ces coups-là qui perdent les parties. Erreurs par partie et perte
     moyenne par coup sont journalisées : la qualité de jeu face à Stockfish, génération après
     génération.
  3. RÉENTRAÎNER — depuis le champion, sur un mélange (--extra-frac) des positions annotées de TOUTES
     les générations et des données de base (pour ne pas oublier le reste).
  4. DÉPARTAGER — match candidat contre champion ; le candidat ne remplace le champion que s'il marque
     au moins --gate (55 % par défaut, comme AlphaZero).
Chaque génération est journalisée dans <work>/history.jsonl : c'est la courbe de progression MESURÉE.
Doux pour la machine : modèle sur 2 fils CPU, Stockfish sur 1 fil, entraînement en arrière-plan
(taskpolicy -b, mémoire bornée, rapport cyclique — cf. train.py).
"""
import argparse
import collections
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
from prepare import record, winprob  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
PLAYER = "Kern 0"  # le nom du modèle d'échecs de brimkern dans les parties (choisi par Romain le 2026-11-26)


def play_game(white, black, net_for_opening, max_ply=400, on_move=None, start=None):
    """white / black : board → coup. `start` : coups imposés aux deux camps (une ouverture du livre ou
    le début d'une partie célèbre, --openings) ; sans livre, les 2 premiers coups de chaque camp sont
    tirés de la politique (température 1) pour varier les ouvertures. Rend (résultat, FEN atteintes,
    échiquier). on_move(board) : appelé après chaque coup (suivi en direct, live.json)."""
    board = chess.Board()
    fens = []
    if on_move:
        on_move(board)
    for mv in start or []:
        fens.append(board.fen())
        board.push(mv)
        if on_move:
            on_move(board)
    while not board.is_game_over(claim_draw=True) and board.ply() < max_ply:
        fens.append(board.fen())
        if start is None and board.ply() < 4:
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
        last = board.move_stack[-1].uci() if board.move_stack else None
        self.set(fen=board.fen(), moves=san_list(board), last=last, check=board.is_check(), **kw)


def san_list(board):
    san, b = [], chess.Board()
    for mv in board.move_stack:
        san.append(b.san(mv))
        b.push(mv)
    return san


def game_record(gen, i, kind, opp, as_white, res, board, date, opening=None):
    """Une partie en une ligne JSON (games.jsonl, publié par publish.py) : coups en SAN sans numéros,
    un quart plus léger qu'un PGN. `color` / `pts` : le camp et les points de brimkern (du
    candidat pendant le départage). `open` : d'où vient l'ouverture imposée (cf. opening_line)."""
    r = dict(gen=gen, i=i, kind=kind, opp=opp, color="w" if as_white else "b", res=res,
             pts=score_for(res, as_white), moves=" ".join(san_list(board)), date=date)
    if opening:
        r["open"] = opening
    return r


def opening_line(op, rng, lo, hi):
    """Une ouverture du livre des grands joueurs (openings.py) : à chaque position, un coup tiré selon
    le nombre de fois où il a été joué, jusqu'à lo..hi demi-coups ou la sortie du livre."""
    b, line, stars = chess.Board(), [], collections.Counter()
    target = rng.randint(lo, hi)
    while len(line) < target:
        moves = op["book"].get(b.epd())
        if not moves:
            break
        u, _, by = rng.choices(moves, weights=[m[1] for m in moves])[0]
        stars.update(by)
        line.append(chess.Move.from_uci(u))
        b.push(line[-1])
    return line, dict(src="book", n=len(line), by=[p for p, _ in stars.most_common(2)])


def iconic_line(op, rng, plies):
    """Le début d'une partie célèbre (l'Immortelle, la partie du siècle…) : les deux camps le rejouent."""
    g = rng.choice(op["iconic"])
    line = [chess.Move.from_uci(u) for u in g["uci"][:plies]]
    return line, dict(src="iconic", id=g["id"], n=len(line), game=f"{g['white']}–{g['black']}, {g['site']} {g['year']}",
                      name=dict(en=g["en"], fr=g["fr"]))


def pair_openings(op, rng, games, iconic_pairs, lo, hi, iconic_plies):
    """Une ouverture par PAIRE de parties (Kern 0 a les Blancs puis les Noirs dans la même) : l'ouverture
    ne favorise personne et le score mesure le jeu, pas le tirage. Sans livre : None (tirage historique)."""
    if not op:
        return [(None, None)] * games
    pairs = (games + 1) // 2
    famous = set(rng.sample(range(pairs), min(iconic_pairs, pairs))) if op.get("iconic") else set()
    out = []
    for p in range(pairs):
        line = iconic_line(op, rng, iconic_plies) if p in famous else opening_line(op, rng, lo, hi)
        out += [line, line]
    return out[:games]


def write_jsonl(path, rows):
    tmp = path + ".tmp"
    with open(tmp, "w") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False, separators=(",", ":")) + "\n")
    os.replace(tmp, path)


def score_for(result, as_white):
    if result in ("1/2-1/2", "*"):
        return 0.5
    return 1.0 if (result == "1-0") == as_white else 0.0


def annotate(fens, depth, out_path, played=None, mistake=0.10, weight=3, threads=1, progress=None):
    """FEN → enregistrements annotés par Stockfish (pleine force), ajoutés à out_path.
    played : {fen: coup joué par brimkern}. Un coup qui perd ≥ `mistake` de probabilité de gain
    (point de vue du trait, formule de Lichess) est une erreur : son enregistrement est écrit
    `weight` fois. Rend (enregistrements écrits, {FEN : perte de probabilité du coup de brimkern}).
    progress(k) : appelé toutes les 50 positions (le suivi en direct montre l'avancement au lieu d'un
    échiquier figé pendant 30 à 60 min)."""
    played = played or {}
    sf = chess.engine.SimpleEngine.popen_uci("stockfish")
    sf.configure({"Threads": threads, "Hash": 64})
    n, losses = 0, {}
    with open(out_path, "ab") as f:
        for k, fen in enumerate(fens):
            if progress and k % 50 == 0:
                progress(k)
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
                moves.append((float(cp), mv.from_square, mv.to_square, mv))
            rec = record(board, [m[:3] for m in moves])
            if not rec:
                continue
            copies = 1
            mine = played.get(fen)
            if mine is not None and moves:
                white = board.turn == chess.WHITE
                cp_mine = next((cp for cp, _, _, mv in moves if mv == mine), None)
                if cp_mine is None:  # hors des 5 meilleurs : sa propre note, même profondeur
                    info = sf.analyse(board, chess.engine.Limit(depth=depth), root_moves=[mine])
                    cp_mine = float(info["score"].white().score(mate_score=100000))
                loss = max(0.0, winprob(moves[0][0], white) - winprob(cp_mine, white))
                losses[fen] = loss
                if loss >= mistake:
                    copies = weight
            for _ in range(copies):
                f.write(rec)
            n += copies
    sf.quit()
    return n, losses


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
    ap.add_argument("--games", type=int, default=20, help="parties contre l'adversaire par génération")
    ap.add_argument("--nodes", type=int, default=200)
    ap.add_argument("--ladder", default="sf:1320,sf:1500,sf:1700,sf:1900,sf:2100,sf:2300,sf:2500,sf:2700,sf:2900,sf:3190",
                    help="adversaires du plus faible au plus fort (cf. play.make_opponent : sf:<elo>, leela:<nœuds>, "
                         "maia:<elo>) ; plusieurs échelles séparées par « ; » alternent d'une génération à l'autre")
    ap.add_argument("--mistake", type=float, default=0.10, help="perte de probabilité de gain qui fait d'un coup de brimkern une erreur")
    ap.add_argument("--mistake-weight", type=int, default=3, help="nombre de copies d'une erreur dans le tampon")
    ap.add_argument("--rung", default="0", help="barreau de départ (un par échelle, séparés par des virgules)")
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
    ap.add_argument("--think", type=int, default=1, help="moments critiques : recherche refaite avec think × nodes (cf. play.model_move)")
    ap.add_argument("--think-q", type=float, default=0.2)
    ap.add_argument("--think-share", type=float, default=0.5)
    ap.add_argument("--openings", help="livre des grands joueurs et parties célèbres (openings.py) : départs des parties")
    ap.add_argument("--book-plies", default="8,16", help="longueur des ouvertures du livre, en demi-coups (min,max)")
    ap.add_argument("--iconic-pairs", type=int, default=2, help="paires de parties par génération qui partent d'une partie célèbre")
    ap.add_argument("--iconic-plies", type=int, default=12, help="demi-coups rejoués d'une partie célèbre")
    a = ap.parse_args()
    op = None
    if a.openings:
        with open(a.openings) as f:
            op = json.load(f)
    book_lo, book_hi = (int(x) for x in a.book_plies.split(","))
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
    ladders = [l.split(",") for l in a.ladder.split(";")]
    rungs = [int(r) for r in a.rung.split(",")]
    rungs += [0] * (len(ladders) - len(rungs))
    start_gen = sum(1 for _ in open(os.path.join(a.work, "history.jsonl")))

    for gen in range(start_gen, start_gen + a.generations):
        t0 = time.time()
        gdir = os.path.join(a.work, f"gen_{gen:03d}")
        os.makedirs(gdir, exist_ok=True)
        net = Net(champ, aggression=a.play_aggression)
        li = (gen - start_gen) % len(ladders)
        ladder, rung = ladders[li], rungs[li]
        results, records, mine_fens = [], [], []
        date = time.strftime("%Y-%m-%d")
        rng = random.Random(a.seed * 100_003 + gen)  # ouvertures différentes à chaque génération, rejouables
        starts = pair_openings(op, rng, a.games, a.iconic_pairs, book_lo, book_hi, a.iconic_plies)
        live.set(gen=gen, phase="play", ladder=ladder, rung=rung, spec=ladder[rung], results=results, games=a.games,
                 history=history_rows())

        # 1. Jouer contre le barreau courant de l'échelle.
        opp_name, sf, opp_limit = make_opponent(ladder[rung], a.sf_time)
        me = lambda b: model_move(net, b, a.nodes, a.contempt, a.think, a.think_q, a.think_share)  # noqa: E731
        them = lambda b: sf.play(b, opp_limit).move  # noqa: E731
        score, fens, played = 0.0, [], {}
        with open(os.path.join(gdir, "games.pgn"), "w") as pgn:
            for g in range(a.games):
                w = g % 2 == 0
                names = (PLAYER if w else opp_name, opp_name if w else PLAYER)
                line, opening = starts[g]
                live.set(game=g + 1, white=names[0], black=names[1], opponent=opp_name, score=score, opening=opening)
                res, f, board = play_game(me if w else them, them if w else me, net, on_move=lambda b: live.board(b), start=line)
                score += score_for(res, w)
                results.append({"white": names[0], "black": names[1], "result": res, "points": score_for(res, w)})
                live.set(results=results, score=score)
                fens += f
                # Coups de Kern 0 hors ouverture imposée (ou tirée au sort : 4 demi-coups) : ceux qu'on note.
                n_open = len(line) if line is not None else 4
                mine = []
                for i, (fen, mv) in enumerate(zip(f, board.move_stack)):
                    if i >= n_open and (i % 2 == 0) == w:
                        played[fen] = mv
                        mine.append(fen)
                mine_fens.append(mine)
                records.append(game_record(gen, g + 1, "ladder", ladder[rung], w, res, board, date, opening))
                # Les parties de la génération EN COURS, une par une (publish.py → page « Cette génération »).
                write_jsonl(os.path.join(gdir, "games.partial.jsonl"), records)
                game = chess.pgn.Game.from_board(board)
                game.headers.update({"Event": "brimkern learning loop", "Site": "brimkern.com", "Date": date.replace("-", "."),
                                     "Round": f"{gen}.{g + 1}", "White": names[0], "Black": names[1]})
                if opening:
                    game.headers["Opening"] = (f"Start of {opening['name']['en']} ({opening['game']})" if opening["src"] == "iconic"
                                               else "Book of " + ", ".join(opening["by"]))
                print(game, file=pgn, end="\n\n")
                print(f"[gen {gen}] partie {g + 1}/{a.games} contre {opp_name} : {res} · score {score}/{g + 1}", flush=True)
        sf.quit()
        vs_sf = dict(opponent=opp_name, games=a.games, score=score, nodes=a.nodes)
        if a.think > 1:
            vs_sf["think"] = a.think
        if op:
            vs_sf["openings"] = True
        if ladder[rung].startswith("sf:"):
            vs_sf["sf_time"] = a.sf_time
        diff, lo, hi = elo_from_score(score / a.games, a.games)
        vs_sf.update(elo_diff=diff, elo_ci95=[lo, hi])
        if a.pgn and gen == start_gen:
            fens += pgn_positions(a.pgn)

        # 2. Annoter (positions uniques).
        uniq = list(dict.fromkeys(fens))
        t1 = time.time()
        live.set(phase="annotate", positions=len(uniq), analysed=0, opening=None)
        added, losses = annotate(uniq, a.depth, buf, played, a.mistake, a.mistake_weight,
                                 progress=lambda k: live.set(analysed=k))
        buffer_size = os.path.getsize(buf) // 82
        mistakes = sum(l >= a.mistake for l in losses.values())
        vs_sf.update(brimkern_moves=len(losses), mistakes=int(mistakes), mistakes_per_game=round(mistakes / a.games, 2),
                     mean_wp_loss=round(float(np.mean(list(losses.values()))), 4) if losses else None)
        # Qualité de chaque partie : ses erreurs et sa perte moyenne (le classement des meilleures parties).
        for r, mine in zip(records, mine_fens):
            ls = [losses[x] for x in mine if x in losses]
            r.update(err=int(sum(l >= a.mistake for l in ls)), loss=round(float(np.mean(ls)), 4) if ls else None)
        print(f"[gen {gen}] {added} enregistrements en {time.time() - t1:.0f} s · tampon {buffer_size} · "
              f"{mistakes} erreurs de brimkern sur {len(losses)} coups ({mistakes / a.games:.1f}/partie)", flush=True)

        # 3. Réentraîner depuis le champion.
        cmd = ["taskpolicy", "-b", sys.executable, "-u", os.path.join(HERE, "train.py"), "--data", a.data, "--out", os.path.join(gdir, "train"),
               "--init", champ, "--extra", buf_dir, "--extra-frac", str(a.extra_frac), "--steps", str(a.steps), "--hours", "3",
               "--lr", str(a.lr), "--warmup", "100", "--eval-every", str(a.steps), "--duty", str(a.duty), "--tag", f"gen{gen}",
               "--aggression", str(a.aggression)]
        live.set(phase="train", steps=a.steps)
        # Battement de cœur : sans lui, le suivi en direct croit la boucle arrêtée pendant l'entraînement.
        proc = subprocess.Popen(cmd)
        while proc.poll() is None:
            time.sleep(30)
            live.set(phase="train")
        if proc.returncode:
            raise subprocess.CalledProcessError(proc.returncode, cmd)
        cand = os.path.join(gdir, "train", "last.pt")

        # 4. Départager : candidat contre champion.
        cnet = Net(cand, aggression=a.play_aggression)
        cm = lambda b: model_move(cnet, b, a.nodes, a.contempt, a.think, a.think_q, a.think_share)  # noqa: E731
        pm = lambda b: model_move(net, b, a.nodes, a.contempt, a.think, a.think_q, a.think_share)  # noqa: E731
        gscore = 0.0
        gresults = []
        gstarts = pair_openings(op, rng, a.gate_games, 0, book_lo, book_hi, a.iconic_plies)
        live.set(phase="gate", results=gresults, games=a.gate_games, score=0.0, opponent=f"champion gen {gen}")
        for g in range(a.gate_games):
            w = g % 2 == 0
            names = (f"candidate gen {gen}" if w else "champion", "champion" if w else f"candidate gen {gen}")
            gline, gopen = gstarts[g]
            live.set(game=g + 1, white=names[0], black=names[1], opening=gopen)
            res, _, gboard = play_game(cm if w else pm, pm if w else cm, net, on_move=lambda b: live.board(b), start=gline)
            records.append(game_record(gen, g + 1, "gate", "champion", w, res, gboard, date, gopen))
            write_jsonl(os.path.join(gdir, "games.partial.jsonl"), records)
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
        # Les parties AVANT la ligne d'historique : publish.py publie une génération quand sa ligne apparaît.
        write_jsonl(os.path.join(gdir, "games.jsonl"), records)
        hist.write(json.dumps(rec) + "\n"); hist.flush()
        live.set(history=history_rows())
        print(f"[gen {gen}] " + json.dumps(rec), flush=True)

        # Barreau de la prochaine génération : là où les parties restent serrées.
        s = score / a.games
        step = 2 if s >= 0.85 or s <= 0.15 else 1
        if s > 0.6:
            rungs[li] = min(len(ladder) - 1, rung + step)
        elif s < 0.4:
            rungs[li] = max(0, rung - step)


if __name__ == "__main__":
    main()
