#!/usr/bin/env python3
"""Met en ligne, sur Hugging Face seulement, les parties que joue la boucle d'apprentissage (learn.py).

    python scripts/chess/publish.py --work <dossier de learn.py>
    python scripts/chess/publish.py --work <…> --dry-run     # construit <work>/publish sans rien envoyer

Processus à part de learn.py : une panne réseau ne touche jamais l'entraînement. Tout est gratuit (les
Spaces Docker/Gradio exigent PRO, pas les Spaces statiques ni les buckets). Deux sorties :
  - DIRECT → bucket HF public (modifiable sur place, sans historique) : <work>/live.json y est réécrit
    quand il change, au plus une fois toutes les --live-every s. Le Space STATIQUE (scripts/chess/space)
    le lit par https://huggingface.co/buckets/<bucket>/resolve/live.json (302 vers le CDN, adresse par
    contenu, CORS ouvert : mesuré le 2026-11-26).
  - ARCHIVE → dataset : UN commit par génération terminée (quand sa ligne apparaît dans history.jsonl) :
      games/gen_NNN.jsonl   toutes les parties, une ligne chacune, coups en SAN (gen 4 : 15,0 Ko contre 20,5 Ko en PGN)
      best.jsonl, best.pgn  les meilleures : victoires et nulles contre les adversaires les plus forts,
                            les moins d'erreurs d'abord, --per-family par famille d'adversaire. Elles
                            se renouvellent toutes seules quand le niveau monte.
      history.jsonl         la courbe de progression
    Les générations d'avant games.jsonl (0 à 5) sont reconstruites depuis leur games.pgn.
  - EN COURS → bucket, current.json : les parties de la génération qui se joue, une par une
    (games.partial.jsonl de learn.py ; à défaut, les parties TERMINÉES de son games.pgn).
"""
import argparse
import json
import os
import re
import time

import chess
import chess.pgn

GEN_DIR = re.compile(r"^gen_(\d{3})$")
FAMILIES = {"sf": "Stockfish", "leela": "Leela Chess Zero", "maia": "Maia"}
KEYS = ("gen", "i", "kind", "opp", "color", "res", "pts", "err", "loss", "date", "moves")


def opp_name(spec):
    kind, _, n = spec.partition(":")
    if kind == "leela":
        return f"Leela Chess Zero ({n} node{'s' if n != '1' else ''})"
    return f"{FAMILIES[kind]} {n}" if kind in FAMILIES else spec


def spec_from_name(name):
    """Nom écrit par learn.py dans les anciens PGN → étiquette d'adversaire (sf:2300, leela:8…)."""
    for pat, kind in ((r"^Stockfish (\d+)$", "sf"), (r"^Maia (\d+)$", "maia"), (r"^Leela \((\d+) n", "leela")):
        m = re.match(pat, name)
        if m:
            return f"{kind}:{m[1]}"
    return name


def backfill(path, gen):
    date = time.strftime("%Y-%m-%d", time.localtime(os.path.getmtime(path)))
    rows = []
    with open(path) as f:
        while (g := chess.pgn.read_game(f)) is not None:
            w = g.headers["White"] in ("brimkern", "Kern 0")  # « Kern 0 » depuis la gen 7
            res = g.headers["Result"]
            b, san = g.board(), []
            for mv in g.mainline_moves():
                san.append(b.san(mv))
                b.push(mv)
            if not (b.is_game_over(claim_draw=True) or b.ply() >= 400):
                continue  # partie tronquée : learn.py n'a pas fini de l'écrire
            pts = float((res == "1-0") == w) if res in ("1-0", "0-1") else 0.5
            rows.append(dict(gen=gen, i=len(rows) + 1, kind="ladder", opp=spec_from_name(g.headers["Black" if w else "White"]),
                             color="w" if w else "b", res=res, pts=pts, date=date, moves=" ".join(san)))
    return rows


def best_games(rows, per_family):
    def key(r):
        err = r["err"] if r["err"] is not None else 99
        return (-int(r["opp"].partition(":")[2]), -r["pts"], err, len(r["moves"].split()))
    out = []
    for kind in FAMILIES:
        fam = [r for r in rows if r["kind"] == "ladder" and r["opp"].startswith(kind + ":") and r["res"] != "*" and r["pts"] >= 0.5]
        out += sorted(fam, key=key)[:per_family]
    return out


def to_pgn(r):
    g = chess.pgn.Game()
    me, them = "Kern 0", opp_name(r["opp"])
    g.headers.update({"Event": "brimkern learning loop", "Site": "brimkern.com", "Date": (r["date"] or "????-??-??").replace("-", "."),
                      "Round": f"{r['gen']}.{r['i']}", "White": me if r["color"] == "w" else them,
                      "Black": them if r["color"] == "w" else me, "Result": r["res"]})
    if r["err"] is not None:
        g.headers["BrimkernMistakes"] = str(r["err"])
    node = g
    for san in r["moves"].split():
        node = node.add_variation(node.board().parse_san(san))
    return str(g)


def with_uci(r):
    b, uci = chess.Board(), []
    for san in r["moves"].split():
        mv = b.parse_san(san)
        uci.append(mv.uci())
        b.push(mv)
    return {**r, "uci": " ".join(uci)}


def card(rows, hist):
    n_gate = sum(r["kind"] == "gate" for r in rows)
    lines = [
        "---", "license: mit", "pretty_name: Kern 0 chess games", "tags: [chess, reinforcement-learning, stockfish, leela-chess-zero]",
        "configs:", "- config_name: games", "  data_files: games/*.jsonl", "- config_name: best", "  data_files: best.jsonl", "---", "",
        "# Kern 0 chess games", "",
        "Every game played by Kern 0, the 244K-parameter chess model of [brimkern](https://brimkern.com/chess), while it learns by playing "
        "Stockfish and Leela Chess Zero. Updated after each training generation; follow the games live at "
        "[romainkh14/brimkern-chess-live](https://huggingface.co/spaces/romainkh14/brimkern-chess-live).", "",
        f"{len(rows)} games over {len(hist)} generations ({len(rows) - n_gate} against an engine, {n_gate} candidate-vs-champion gate games).", "",
        "## Files", "",
        "- `games/gen_NNN.jsonl`: one line per game, moves in SAN.",
        "- `best.jsonl` / `best.pgn`: the best games, renewed as the level rises: wins and draws against the strongest opponents, fewest mistakes first.",
        "- `history.jsonl`: one line per generation (score against the engine, gate result, whether the candidate replaced the champion).", "",
        "## Fields", "",
        "| field | meaning |", "|---|---|",
        "| `gen`, `i` | generation, game number |",
        "| `kind` | `ladder` (Kern 0 vs an engine) or `gate` (new candidate vs current champion) |",
        "| `opp` | `sf:<UCI_Elo>` (Stockfish limited, 0.1 s/move), `leela:<nodes>` (lc0, T1-256x10 distilled net), `maia:<level>`, `champion` |",
        "| `color`, `pts` | Kern 0's side (the candidate's in a gate game) and its points |",
        "| `err`, `loss` | moves losing ≥ 10 % win probability, mean win-probability loss per move (Stockfish analysis; ladder games from gen 6) |",
        "| `moves` | SAN, space-separated |", "",
        "## Generations", "",
        "| gen | opponent | score | gate | kept |", "|---|---|---|---|---|",
    ]
    for h in hist:
        o = h["vs_opponent"]
        lines.append(f"| {h['gen']} | {opp_name(spec_from_name(o['opponent']))} | {o['score']}/{o['games']} | "
                     f"{h['gate']['score']}/{h['gate']['games']} | {'yes' if h['accepted'] else 'no'} |")
    return "\n".join(lines) + "\n"


def current_games(work, done):
    """Parties déjà jouées de la génération en cours (la plus récente pas encore dans history.jsonl)."""
    gens = [int(m[1]) for d in os.listdir(work) if (m := GEN_DIR.match(d)) and int(m[1]) not in done]
    if not gens:
        return None, []
    gen = max(gens)
    gdir = os.path.join(work, f"gen_{gen:03d}")
    partial = os.path.join(gdir, "games.partial.jsonl")
    if os.path.exists(partial):
        with open(partial) as f:
            rows = [json.loads(l) for l in f if l.strip()]
    elif os.path.exists(os.path.join(gdir, "games.pgn")):
        rows = backfill(os.path.join(gdir, "games.pgn"), gen)
    else:
        rows = []
    return gen, [with_uci({k: r.get(k) for k in KEYS}) for r in rows]


def write_if_changed(path, text):
    try:
        with open(path) as f:
            if f.read() == text:
                return False
    except FileNotFoundError:
        pass
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(text)
    return True


def build(work, out, per_family):
    """<work> → <out>, générations TERMINÉES seulement. Rend (changé ?, dernière génération, nb de parties)."""
    with open(os.path.join(work, "history.jsonl")) as f:
        hist = [json.loads(l) for l in f if l.strip()]
    done = {h["gen"] for h in hist}
    rows, changed = [], False
    for d in sorted(os.listdir(work)):
        m = GEN_DIR.match(d)
        if not m or int(m[1]) not in done:
            continue
        gen, gdir = int(m[1]), os.path.join(work, d)
        if os.path.exists(os.path.join(gdir, "games.jsonl")):
            with open(os.path.join(gdir, "games.jsonl")) as f:
                gen_rows = [json.loads(l) for l in f if l.strip()]
        elif os.path.exists(os.path.join(gdir, "games.pgn")):
            gen_rows = backfill(os.path.join(gdir, "games.pgn"), gen)
        else:
            continue
        gen_rows = [{k: r.get(k) for k in KEYS} for r in gen_rows]
        rows += gen_rows
        text = "".join(json.dumps(r, ensure_ascii=False, separators=(",", ":")) + "\n" for r in gen_rows)
        changed |= write_if_changed(os.path.join(out, "games", f"{d}.jsonl"), text)
    best = best_games(rows, per_family)
    changed |= write_if_changed(os.path.join(out, "best.jsonl"),
                                "".join(json.dumps(with_uci(r), ensure_ascii=False, separators=(",", ":")) + "\n" for r in best))
    changed |= write_if_changed(os.path.join(out, "best.pgn"), "\n\n".join(to_pgn(r) for r in best) + "\n")
    changed |= write_if_changed(os.path.join(out, "history.jsonl"), "".join(json.dumps(h) + "\n" for h in hist))
    changed |= write_if_changed(os.path.join(out, "README.md"), card(rows, hist))
    return changed, max(done) if done else None, len(rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--dataset", default="romainkh14/brimkern-chess-games")
    ap.add_argument("--bucket", default="romainkh14/brimkern-chess-live")
    ap.add_argument("--live-every", type=float, default=3.0,
                    help="secondes minimum entre deux envois de live.json (limites de l'API du Hub)")
    ap.add_argument("--per-family", type=int, default=25)
    ap.add_argument("--dry-run", action="store_true", help="construit <work>/publish, n'envoie rien, s'arrête")
    a = ap.parse_args()
    work = os.path.abspath(a.work)
    out = os.path.join(work, "publish")

    if a.dry_run:
        changed, last, n = build(work, out, a.per_family)
        print(f"{out} : {n} parties, générations ≤ {last}, {'modifié' if changed else 'inchangé'}")
        return

    from huggingface_hub import HfApi  # jeton du Hub enregistré localement (hf auth login)
    from huggingface_hub.utils import disable_progress_bars
    disable_progress_bars()  # un envoi toutes les 3 s : les barres noieraient le journal
    api = HfApi()
    live = os.path.join(work, "live.json")
    sent_mtime = next_live = last_check = last_cur = last_err = 0.0
    published_gen, sent_cur = None, None
    print(f"direct → huggingface.co/buckets/{a.bucket} · archive → huggingface.co/datasets/{a.dataset}", flush=True)
    while True:
        now = time.time()
        try:
            m = os.path.getmtime(live)
        except FileNotFoundError:
            m = 0.0
        if m and m != sent_mtime and now >= next_live:
            next_live = now + a.live_every
            try:
                with open(live, "rb") as f:
                    body = f.read()
                api.batch_bucket_files(a.bucket, add=[(body, "live.json")])
                sent_mtime = m
            except Exception as e:  # réseau, limite de débit (429) : on attend avant de réessayer
                next_live = now + 30
                if now - last_err > 60:
                    print(f"direct : {e}", flush=True)
                    last_err = now
        if now - last_cur >= 10:
            last_cur = now
            try:
                with open(os.path.join(work, "history.jsonl")) as f:
                    done = {json.loads(l)["gen"] for l in f if l.strip()}
                gen, rows = current_games(work, done)
                body = json.dumps({"gen": gen, "games": rows}, ensure_ascii=False, separators=(",", ":")).encode()
                if body != sent_cur:
                    api.batch_bucket_files(a.bucket, add=[(body, "current.json")])
                    sent_cur = body
            except Exception as e:
                print(f"en cours : {e}", flush=True)
        if now - last_check >= 30:
            last_check = now
            try:
                changed, last, n = build(work, out, a.per_family)
                if changed or last != published_gen:
                    api.upload_folder(repo_id=a.dataset, repo_type="dataset", folder_path=out,
                                      commit_message=f"Generation {last}: {n} games")
                    published_gen = last
                    print(f"archive : génération {last} publiée ({n} parties)", flush=True)
            except Exception as e:
                print(f"archive : {e}", flush=True)
        time.sleep(0.25)


if __name__ == "__main__":
    main()
