#!/usr/bin/env python3
"""Les ouvertures des grands joueurs et les parties célèbres → départs des parties de la boucle.

    python scripts/chess/openings.py --pgn-dir <PGN de joueurs> --out openings.json
    python scripts/chess/learn.py ... --openings openings.json

1. LIVRE — les positions des --plies premiers demi-coups des parties de grands joueurs (fichiers par
   joueur de PGN Mentor : Carlsen.pgn, Kasparov.pgn…), les coups joués au moins --min-count fois, et
   quels grands joueurs les ont joués (le nom du fichier, quand c'est lui qui avait le trait).
2. VÉRIFIÉ par Stockfish (--depth, --workers moteurs en parallèle) : un coup de livre qui perd plus de --max-loss de probabilité de
   gain contre le meilleur coup est retiré. On garde les ouvertures des maîtres, pas leurs paris.
3. PARTIES CÉLÈBRES — l'Immortelle, la partie du siècle… retrouvées par leurs en-têtes (rien n'est
   recopié de mémoire), avec leurs coups.

Pourquoi : à la gen 6, 6 des 19 défaites contre Leela étaient jouées avant le 16e coup, et les 4
premiers demi-coups des deux camps étaient TIRÉS de la politique de Kern 0 (« 1. e4 e5 2. Fe2 »).
"""
import argparse
import collections
import glob
import json
import os
import sys

import chess
import chess.engine
import chess.pgn

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from prepare import winprob  # noqa: E402

# (fichier, sous-chaîne Blancs, sous-chaîne Noirs, début de Date, sous-chaîne Event ou None, ronde ou None, id, en, fr)
ICONIC = [
    ("Anderssen", "Anderssen", "Kieseritzky", "1851", "Immortal", None, "immortal", "The Immortal Game", "L'Immortelle"),
    ("Anderssen", "Anderssen", "Dufresne", "1852", "Evergreen", None, "evergreen", "The Evergreen Game", "La partie Evergreen"),
    ("Morphy", "Morphy", "Isouard", "1858", None, None, "opera", "The Opera Game", "La partie de l'Opéra"),
    ("Fischer", "Byrne", "Fischer", "1956", None, None, "century", "The Game of the Century", "La partie du siècle"),
    ("Botvinnik", "Botvinnik", "Capablanca", "1938", "AVRO", None, "avro", "Botvinnik's AVRO masterpiece", "Le chef-d'œuvre de Botvinnik à l'AVRO"),
    ("Fischer", "Fischer", "Spassky", "1972", None, "6", "reykjavik6", "Fischer–Spassky, game 6", "Fischer–Spassky, 6e partie"),
    ("Kasparov", "Karpov", "Kasparov", "1985", None, "16", "octopus", "Kasparov's octopus knight", "Le cavalier pieuvre de Kasparov"),
    ("Kasparov", "Deep Blue", "Kasparov", "1997", None, "6", "deepblue", "Deep Blue beats Kasparov", "Deep Blue bat Kasparov"),
    ("Kasparov", "Kasparov", "Topalov", "1999", "Hoogovens", None, "topalov", "Kasparov's Immortal", "L'Immortelle de Kasparov"),
    ("PolgarJ", "Polgar", "Kasparov", "2002", "RUS vs. ROW", None, "polgar", "Judit Polgar beats Kasparov", "Judit Polgar bat Kasparov"),
    ("Carlsen", "Carlsen", "Karjakin", "2016.11.30", "Rapid", "4", "carlsen2016", "Carlsen's title-winning Qh6+", "Le Dh6+ du titre de Carlsen"),
]


def last_name(h):
    return h.split(",")[0].strip()


def read_games(path):
    """Les parties d'un fichier PGN, sans les variantes ni les positions de départ arrangées."""
    with open(path, encoding="latin-1") as f:
        while True:
            try:
                g = chess.pgn.read_game(f)
            except Exception:  # partie illisible dans un fichier tiers : on passe
                continue
            if g is None:
                return
            if g.headers.get("Variant", "Standard") != "Standard" or g.headers.get("SetUp") == "1":
                continue
            yield g


def build_book(files, plies, min_count):
    counts = collections.defaultdict(collections.Counter)  # epd -> uci -> n
    by = collections.defaultdict(collections.Counter)      # (epd, uci) -> grand joueur -> n
    seen, n_games = set(), 0
    for path in files:
        star = os.path.splitext(os.path.basename(path))[0]
        for g in read_games(path):
            moves = list(g.mainline_moves())[:plies]
            if len(moves) < 8:
                continue
            key = (g.headers.get("Date", ""), " ".join(m.uci() for m in moves))
            dup = key in seen
            seen.add(key)
            n_games += not dup
            star_white = last_name(g.headers.get("White", "")).lower().startswith(star[:5].lower())
            b = chess.Board()
            for mv in moves:
                epd = b.epd()
                if not dup:
                    counts[epd][mv.uci()] += 1
                if (b.turn == chess.WHITE) == star_white:
                    by[(epd, mv.uci())][star] += 1
                b.push(mv)
    book = {}
    for epd, c in counts.items():
        kept = [(u, n) for u, n in c.most_common() if n >= min_count]
        if kept:
            book[epd] = [[u, n, [p for p, _ in by[(epd, u)].most_common(3)]] for u, n in kept]
    return book, n_games


_eng = None


def _check(job):
    """Un poste de travail : (epd, coups du livre, profondeur, perte tolérée) → coups gardés."""
    global _eng
    if _eng is None:
        _eng = chess.engine.SimpleEngine.popen_uci("stockfish")
        _eng.configure({"Threads": 1, "Hash": 64})
    epd, moves, depth, max_loss = job
    b = chess.Board(epd + " 0 1")
    white = b.turn == chess.WHITE
    lim = chess.engine.Limit(depth=depth)
    wp_best = winprob(_eng.analyse(b, lim)["score"].white().score(mate_score=10000), white)
    # Tous les coups du livre en UNE recherche (multi-PV restreint à ces coups).
    infos = _eng.analyse(b, lim, multipv=len(moves), root_moves=[chess.Move.from_uci(m[0]) for m in moves])
    wp = {i["pv"][0].uci(): winprob(i["score"].white().score(mate_score=10000), white) for i in infos if i.get("pv")}
    return epd, [m for m in moves if wp_best - wp.get(m[0], 0.0) <= max_loss]


def verify(book, depth, max_loss, workers):
    """Retire les coups de livre que Stockfish juge perdants (> max_loss de probabilité de gain).
    `workers` Stockfish à 1 fil en parallèle : à faible profondeur, plusieurs moteurs vont plus vite
    qu'un moteur à plusieurs fils."""
    import multiprocessing as mp
    jobs = [(epd, moves, depth, max_loss) for epd, moves in book.items()]
    before = sum(len(m) for m in book.values())
    with mp.Pool(workers) as pool:
        for k, (epd, keep) in enumerate(pool.imap_unordered(_check, jobs, chunksize=16)):
            if keep:
                book[epd] = keep
            else:
                del book[epd]
            if (k + 1) % 1000 == 0:
                print(f"  vérifié {k + 1}/{len(jobs)} positions", flush=True)
    return before - sum(len(m) for m in book.values())


def find_iconic(pgn_dir):
    out = []
    for fname, w, bl, date, event, rnd, gid, en, fr in ICONIC:
        path = os.path.join(pgn_dir, fname + ".pgn")
        found = None
        if os.path.exists(path):
            for g in read_games(path):
                h = g.headers
                if (w in h.get("White", "") and bl in h.get("Black", "") and h.get("Date", "").startswith(date)
                        and (event is None or event in h.get("Event", "")) and (rnd is None or h.get("Round", "") == rnd)):
                    found = g
                    break
        if found is None:
            print(f"  partie célèbre introuvable : {en}", flush=True)
            continue
        h = found.headers
        site = h.get("Site", "").split()
        if len(site) > 1 and len(site[-1]) == 3 and site[-1].isupper():  # « Moscow RUS » → « Moscow »
            site = site[:-1]
        site = " ".join(site) or h.get("Event", "")
        out.append(dict(id=gid, en=en, fr=fr, white=last_name(h["White"]).replace("Comp ", ""), black=last_name(h["Black"]),
                        site=site, year=int(h["Date"][:4]), result=h.get("Result", "*"),
                        uci=[m.uci() for m in found.mainline_moves()]))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pgn-dir", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--plies", type=int, default=20, help="profondeur du livre en demi-coups")
    ap.add_argument("--min-count", type=int, default=10, help="un coup entre au livre s'il a été joué au moins N fois")
    ap.add_argument("--depth", type=int, default=10)
    ap.add_argument("--max-loss", type=float, default=0.05, help="perte de probabilité de gain tolérée contre le meilleur coup")
    ap.add_argument("--workers", type=int, default=3, help="Stockfish en parallèle pour la vérification")
    ap.add_argument("--raw", help="cache du livre brut (JSON) : relu s'il existe, écrit sinon — la lecture des PGN est le plus long")
    a = ap.parse_args()
    files = sorted(glob.glob(os.path.join(a.pgn_dir, "*.pgn")))
    print(f"{len(files)} fichiers de joueurs", flush=True)
    if a.raw and os.path.exists(a.raw):
        with open(a.raw) as f:
            raw = json.load(f)
        book, n_games = raw["book"], raw["games"]
        book = {e: [m for m in ms if m[1] >= a.min_count] for e, ms in book.items()}
        book = {e: ms for e, ms in book.items() if ms}
    else:
        book, n_games = build_book(files, a.plies, min(3, a.min_count))  # cache large : on refiltre à la relecture
        if a.raw:
            with open(a.raw, "w") as f:
                json.dump(dict(book=book, games=n_games, min_count=min(3, a.min_count)), f, separators=(",", ":"))
        book = {e: [m for m in ms if m[1] >= a.min_count] for e, ms in book.items()}
        book = {e: ms for e, ms in book.items() if ms}
    n_moves = sum(len(v) for v in book.values())
    print(f"livre brut : {n_games} parties distinctes · {len(book)} positions · {n_moves} coups", flush=True)
    removed = verify(book, a.depth, a.max_loss, a.workers)
    print(f"livre vérifié : {len(book)} positions · {sum(len(v) for v in book.values())} coups ({removed} retirés)", flush=True)
    iconic = find_iconic(a.pgn_dir)
    print(f"parties célèbres : {len(iconic)}/{len(ICONIC)}", flush=True)
    doc = dict(players=[os.path.splitext(os.path.basename(f))[0] for f in files], games=n_games, plies=a.plies,
               min_count=a.min_count, depth=a.depth, max_loss=a.max_loss, book=book, iconic=iconic)
    tmp = a.out + ".tmp"
    with open(tmp, "w") as f:
        json.dump(doc, f, ensure_ascii=False, separators=(",", ":"))
    os.replace(tmp, a.out)
    print(f"écrit {a.out} ({os.path.getsize(a.out) // 1024} Ko)", flush=True)


if __name__ == "__main__":
    main()
