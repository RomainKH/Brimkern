#!/usr/bin/env python3
# ÉVAL HORS NAVIGATEUR de la fidélité aux fiches — le filtre à passer AVANT le banc sdk-smalltalk.
#
# Pourquoi : la perte de validation ne voit pas ce qui compte. Au pilote du 2026-09-28, elle
# baissait sagement (2,37 → 0,455) pendant que le modèle apprenait à déformer les chiffres (banc :
# faits 1/8 contre 5/8 pour la base). Et un tour de banc coûte un build, un Chrome, un juge.
# Ici : on génère, en glouton, la réponse à chaque exemple de validation (boutiques jamais vues à
# l'entraînement) et on compte, sur les chiffres :
#   - INVENTÉS : un chiffre de la réponse absent des fiches/de la conversation (render.mjs, `autorises`) ;
#   - RAPPEL   : les chiffres de la réponse idéale que la réponse reprend (`attendus`).
# Même prompt, même glouton pour la base et pour chaque adaptateur : seul l'adaptateur change.
#
#   ~/.cache/brimkern-train/venv/bin/python scripts/train/eval-facts.py --model <snapshot HF> \
#       [--adapter <dossier avec adapters.safetensors>] [--data ~/.cache/brimkern-train/sft/valid.jsonl] [--n 120]
import argparse, json, os, re
import mlx.core as mx
from mlx_lm import load, generate

mx.set_memory_limit(int(float(os.environ.get("MLX_MEM_GB", "6")) * 2**30))

ap = argparse.ArgumentParser()
ap.add_argument("--model", required=True)
ap.add_argument("--adapter")
ap.add_argument("--data", default=os.path.expanduser("~/.cache/brimkern-train/sft/valid.jsonl"))
ap.add_argument("--n", type=int, default=120)
a = ap.parse_args()

nombres = lambda s: [n.replace(",", ".") for n in re.findall(r"\d+(?:[.,]\d+)?", s)]
rows = [json.loads(l) for l in open(a.data) if l.strip()]
rows = [r for r in rows if "autorises" in r][: a.n]
if not rows:
    raise SystemExit("aucun exemple avec `autorises` : relancer render.mjs (version du 2026-09-28 ou plus)")

model, tok = load(a.model, adapter_path=a.adapter)
inventes = cites = attendus = repris = 0
exemples = []
for r in rows:
    # Le prompt se termine sur « <|im_start|>assistant\n » ; Qwen 3 sous /no_think écrit le bloc vide.
    out = generate(model, tok, prompt=r["prompt"] + "<think>\n\n</think>\n\n", max_tokens=80, verbose=False)
    out = out.split("<|im_end|>")[0].strip()
    ns = nombres(out)
    faux = [n for n in ns if n not in r["autorises"]]
    inventes += len(faux); cites += len(ns)
    attendus += len(r["attendus"]); repris += sum(1 for n in r["attendus"] if n in ns)
    if faux and len(exemples) < 6:
        exemples.append(f"  inventé {faux} · attendu {r['attendus']} · « {out[:110]} »")

print(f"{os.path.basename(a.adapter or 'base')} · {len(rows)} tours de validation")
print(f"  chiffres inventés : {inventes}/{cites} cités ({100 * inventes / max(cites, 1):.1f} %)")
print(f"  rappel des chiffres attendus : {repris}/{attendus} ({100 * repris / max(attendus, 1):.1f} %)")
print("\n".join(exemples))
