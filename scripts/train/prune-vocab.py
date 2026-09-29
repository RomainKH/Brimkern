#!/usr/bin/env python3
# VOCABULAIRE TAILLÉ pour le widget EN/FR — Qwen 3 (BPE niveau octet, embeddings liés).
#
# Pourquoi : Qwen3-0.6B porte 151 643 tokens pour une centaine de langues. Sur 5,7 M de tokens de
# Wikipédia EN+FR et de nos dialogues (2026-09-28), il n'en utilise que 54 766 ; 49 027 couvrent
# 99,9 % du texte. Or l'embedding (lié à la tête de sortie) pèse 151 936 × 1024 = 156 M paramètres,
# un QUART du modèle — au téléchargement, et à CHAQUE token généré (la tête calcule toutes les lignes).
#
# Ce qu'on garde, et pourquoi le tokenizer reste correct :
#   - les K tokens les plus fréquents du corpus (corpus/counts.json, cf. fetch-corpus.mjs) ;
#   - la FERMETURE par fusion : un token gardé garde les deux tokens dont sa fusion BPE le fabrique,
#     récursivement — sans eux le tokenizer ne pourrait plus le construire ;
#   - les 256 tokens-octets : n'importe quel texte (emoji, chinois) reste encodable, en plus de tokens ;
#   - tous les tokens spéciaux (<|im_start|>, <think>…).
# Une fusion dont le RÉSULTAT est retiré est retirée : le BPE s'arrête alors sur des morceaux plus
# petits, tous gardés. Les ids sont renumérotés dans l'ordre d'origine (les spéciaux en fin, comme avant).
#
#   …/venv/bin/python scripts/train/prune-vocab.py --model <dossier HF> --keep 48000 --out <dossier>
#   …/venv/bin/python scripts/train/prune-vocab.py --model <dossier HF> --measure 32000,40000,48000,56000
import argparse, json, os, shutil
from tokenizers import Tokenizer

ap = argparse.ArgumentParser()
ap.add_argument("--model", required=True)
ap.add_argument("--counts", default=os.path.expanduser("~/.cache/brimkern-train/corpus/counts.json"))
ap.add_argument("--held", default=os.path.expanduser("~/.cache/brimkern-train/corpus/held.json"))
ap.add_argument("--keep", type=int)
ap.add_argument("--measure")
ap.add_argument("--out")
ap.add_argument("--no-pad", action="store_true")
a = ap.parse_args()

tj0 = json.load(open(os.path.join(a.model, "tokenizer.json")))
vocab0 = tj0["model"]["vocab"]                      # token -> id (tokens ordinaires)
merges0 = [tuple(m.split(" ", 1)) if isinstance(m, str) else tuple(m) for m in tj0["model"]["merges"]]
added0 = tj0["added_tokens"]                        # spéciaux, ids >= len(vocab0)
parents = {x + y: (x, y) for x, y in merges0}
id2tok = {i: t for t, i in vocab0.items()}
counts = [(int(i), c) for i, c in json.load(open(a.counts))["counts"]]

# Les 256 tokens-octets de l'alphabet GPT-2 : ce sont les tokens d'un seul caractère de l'alphabet.
octets = {t for t in vocab0 if len(t) == 1}
assert len(octets) >= 256, f"alphabet d'octets incomplet ({len(octets)})"


# ⚠️ GARDÉS D'OFFICE (premier essai du 2026-09-28) : le corpus de fréquences découpe Wikipédia en
# paragraphes sur « \n\n » — le token « ĊĊ » n'y apparaissait donc jamais et a été retiré, avec
# « /no_think » et « /think » (rares dans Wikipédia). Le modèle taillé ignorait alors l'interrupteur
# de réflexion et le bloc vide « <think>\n\n</think> » se découpait autrement : il réfléchissait à
# chaque tour. On garde donc tout token : (1) du FORMAT RÉEL du SDK — les prompts et réponses rendus
# par render.mjs ; (2) fait uniquement d'espaces et de sauts de ligne ; (3) des chaînes de contrôle.
CONTROLE = [" /no_think", "/no_think", " /think", "/think", "<think>\n\n</think>\n\n", "\n\n", "\n\n\n",
            "<|im_start|>system\n", "<|im_start|>user\n", "<|im_start|>assistant\n", "<|im_end|>\n"]
ap_force = [os.path.expanduser("~/.cache/brimkern-train/sft/train.jsonl"), os.path.expanduser("~/.cache/brimkern-train/sft/valid.jsonl")]
from tokenizers import Tokenizer as _T
_t0 = _T.from_file(os.path.join(a.model, "tokenizer.json"))
force = {t for t in vocab0 if t.replace("Ġ", "").replace("Ċ", "").replace("ĉ", "") == ""}
textes = list(CONTROLE)
for f in ap_force:
    if os.path.exists(f):
        for l in open(f):
            d = json.loads(l); textes += [d["prompt"], d["completion"]]
for e in _t0.encode_batch(textes, add_special_tokens=False):
    force.update(t for t in e.tokens if t in vocab0)
print(f"gardés d'office : {len(force)} tokens (format du SDK, blancs, contrôle)")


def choisir(k):
    garde = set(octets)
    pile = list(force) + [id2tok[i] for i, _ in counts if i in id2tok][:k]
    while pile:
        t = pile.pop()
        if t in garde: continue
        garde.add(t)
        if t in parents: pile.extend(parents[t])
    return garde


def construire(garde):
    ordre = sorted(garde, key=lambda t: vocab0[t])
    vocab = {t: i for i, t in enumerate(ordre)}
    merges = [f"{x} {y}" for x, y in merges0 if x + y in garde and x in garde and y in garde]
    tj = json.loads(json.dumps(tj0))
    tj["model"]["vocab"] = vocab
    tj["model"]["merges"] = merges
    base = len(vocab)
    ancien = {}                                       # ancien id -> nouvel id
    for t, i in vocab.items(): ancien[vocab0[t]] = i
    for j, s in enumerate(sorted(added0, key=lambda x: x["id"])):
        ancien[s["id"]] = base + j
    for s in tj["added_tokens"]: s["id"] = ancien[s["id"]]
    return tj, ancien


held = json.load(open(a.held))
tok0 = Tokenizer.from_file(os.path.join(a.model, "tokenizer.json"))
n0 = sum(len(e.ids) for e in tok0.encode_batch(held, add_special_tokens=False))


def mesurer(tj):
    tok = Tokenizer.from_str(json.dumps(tj))
    encs = tok.encode_batch(held, add_special_tokens=False)
    n = sum(len(e.ids) for e in encs)
    faux = sum(1 for e, h in zip(encs, held) if tok.decode(e.ids) != tok0.decode(tok0.encode(h, add_special_tokens=False).ids))
    return n, faux


if a.measure:
    print(f"texte jamais vu : {len(held)} articles, {n0} tokens avec le vocabulaire complet ({len(vocab0)})")
    for k in map(int, a.measure.split(",")):
        g = choisir(k); tj, _ = construire(g); n, faux = mesurer(tj)
        print(f"  K={k:>6} → {len(g):>6} tokens gardés · texte +{100 * (n - n0) / n0:.2f} % de tokens · aller-retour faux : {faux}")
    raise SystemExit

assert a.keep and a.out, "--keep et --out (ou --measure)"
g = choisir(a.keep); tj, ancien = construire(g); n, faux = mesurer(tj)
assert faux == 0, f"{faux} articles ne se décodent plus à l'identique"
os.makedirs(a.out, exist_ok=True)
json.dump(tj, open(os.path.join(a.out, "tokenizer.json"), "w"), ensure_ascii=False)

cfg_tok = json.load(open(os.path.join(a.model, "tokenizer_config.json")))
if "added_tokens_decoder" in cfg_tok:
    cfg_tok["added_tokens_decoder"] = {str(ancien[int(i)]): v for i, v in cfg_tok["added_tokens_decoder"].items()}
json.dump(cfg_tok, open(os.path.join(a.out, "tokenizer_config.json"), "w"), ensure_ascii=False, indent=2)

# Poids : on garde les LIGNES de l'embedding (et de la tête si elle est stockée) dans le nouvel ordre.
# torch et pas numpy : les poids sont en bfloat16, que numpy ne connaît pas.
import torch
from safetensors.torch import load_file, save_file
import glob
nouveau_n = len(tj["model"]["vocab"]) + len(tj["added_tokens"])
lignes = torch.zeros(nouveau_n, dtype=torch.long)
for vieux, neuf in ancien.items(): lignes[neuf] = vieux
cfg = json.load(open(os.path.join(a.model, "config.json")))
# vocab_size arrondi au multiple de 64 comme l'original (151 936). ⚠️ Les lignes de rembourrage sont
# MISES À ZÉRO (score exactement 0, loin sous tout token plausible). Deux essais ratés le 2026-09-28,
# au banc sdk-multi : (1) une copie du token 0 — c'est « ! », la tête voyait 17 « ! » et le modèle
# écrivait « Let me know[PAD42869] » ; (2) les lignes inutilisées de l'original (norme 0,30, pas 0) —
# là où le modèle d'origine plaçait un emoji (« 😊 », tokens retirés), la masse tombait sur elles.
# --no-pad : taille EXACTE, aucun token de rembourrage à produire (le moteur WebGPU en a sorti
# malgré des lignes à zéro — « [PAD42866] » au banc, alors que mlx-lm n'en sort aucun).
taille = nouveau_n if a.no_pad else -(-nouveau_n // 64) * 64
lignes = torch.cat([lignes, torch.full((taille - nouveau_n,), -1, dtype=torch.long)])
for f in glob.glob(os.path.join(a.model, "*.safetensors")):
    w = load_file(f)
    # Embeddings LIÉS : le snapshot Qwen3-0.6B stocke quand même `lm_head.weight`, et le GGUF en
    # héritait (output.weight : ~44 Mo en Q8_0 pour 42 880 lignes, ~118 Mo avant la taille) — une
    # copie que le modèle n'utilise pas. On ne l'écrit pas.
    if cfg.get("tie_word_embeddings") and "lm_head.weight" in w: del w["lm_head.weight"]
    for k in list(w):
        if k.endswith("embed_tokens.weight") or k == "lm_head.weight":
            if w[k].shape[0] == cfg["vocab_size"]:
                nw = w[k][lignes.clamp(min=0)].contiguous()
                nw[lignes < 0] = 0
                w[k] = nw
    save_file(w, os.path.join(a.out, os.path.basename(f)), metadata={"format": "pt"})
cfg["vocab_size"] = taille
# Les ids spéciaux de config.json / generation_config.json pointaient dans l'ANCIEN vocabulaire
# (eos 151645) : la génération ne s'arrêtait plus. Renumérotés comme le reste.
remap = lambda v: [ancien[x] for x in v] if isinstance(v, list) else ancien.get(v, v)
for k in ("bos_token_id", "eos_token_id", "pad_token_id"):
    if k in cfg: cfg[k] = remap(cfg[k])
json.dump(cfg, open(os.path.join(a.out, "config.json"), "w"), indent=2)
gpath = os.path.join(a.model, "generation_config.json")
if os.path.exists(gpath):
    gen = json.load(open(gpath))
    for k in ("bos_token_id", "eos_token_id", "pad_token_id"):
        if k in gen: gen[k] = remap(gen[k])
    json.dump(gen, open(os.path.join(a.out, "generation_config.json"), "w"), indent=2)
# vocab.json / merges.txt : le tokenizer « lent » les lit — recopier ceux d'origine décrirait
# l'ANCIEN vocabulaire à côté du nouveau tokenizer.json.
json.dump(tj["model"]["vocab"], open(os.path.join(a.out, "vocab.json"), "w"), ensure_ascii=False)
open(os.path.join(a.out, "merges.txt"), "w").write("#version: 0.2\n" + "\n".join(tj["model"]["merges"]) + "\n")
for f in os.listdir(a.model):
    if not os.path.exists(os.path.join(a.out, f)) and not f.endswith(".safetensors") and f not in ("tokenizer.json", "tokenizer_config.json", "config.json", "generation_config.json", "vocab.json", "merges.txt"):
        src = os.path.join(a.model, f)
        if os.path.isfile(src): shutil.copy(src, os.path.join(a.out, f))
print(f"{len(vocab0) + len(added0)} → {nouveau_n} tokens (vocab_size → {taille}) · texte +{100 * (n - n0) / n0:.2f} % · {a.out}")
