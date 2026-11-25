#!/usr/bin/env python3
"""Checkpoint → les fichiers publiés : safetensors (source du .brik) + .gguf (format ouvert).

    python scripts/chess/export.py --ckpt <run>/best.pt --out <dossier> [--data <dossier de prepare.py>]

Une seule vérité pour les deux formats : les tenseurs SOUS LES NOMS que lit le moteur
(src/lib/chess/model.ts), avec 1/√dk replié dans Wq (attention_bias du moteur ne met pas l'échelle).
  embed.piece [13, d] · embed.square [64, d] · embed.ep [d] · embed.castle [16, d]
  attn.rel [H, 225] · attn.meta [H, 3]          (le moteur reconstruit la table [H, 65, 65])
  block.n1 [d] · block.q/k/v/o [d, d] · block.n2 [d] · block.wi0/wi1 [ff, d] · block.wo [d, ff]
  norm [d] · policy.q/k [dp, d] · value.w [d] · value.b [1]
Un checkpoint ternaire est exporté avec ses poids ternarisés (t × échelle).

GGUF : architecture propre `brimkern-chess` (llama.cpp ne l'exécute pas ; tout lecteur GGUF la
lit) — hyperparamètres en métadonnées, matrices du bloc en Q8_0, le reste en F32.
--data : rejoue la validation avec les poids aller-retour Q8_0 → on ne publie pas une quantification
qui ferait perdre des coups sans le savoir.
"""
import argparse
import json
import os
import sys

import numpy as np
import torch

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from model import ChessNet, ternarize  # noqa: E402

ENCODING = ("v1: 65 tokens from the side to move's view (black flips ranks: s^56); "
            "square token = piece(0 empty,1-6 own PNBRQK,7-12 opp) + square + ep marker; token 64 = castling (4 bits); "
            "policy logits[from*64+to] = (Hq·Wq)(Hk·Wk)^T/sqrt(dp) over squares; value = sigmoid(w·mean(H)+b) = P(win) side to move")


def engine_tensors(model: ChessNet):
    sd = {k: v.detach().float().cpu() for k, v in model.state_dict().items()}
    cfg = model.cfg
    dk = cfg["d"] // cfg["heads"]
    tern = model.block.q.ternary

    def lin(name):
        w = sd[name]
        if tern:
            t, s = ternarize(w)
            w = t * s
        return w

    t = {
        "embed.piece": sd["piece.weight"], "embed.square": sd["square"], "embed.ep": sd["ep"],
        "embed.castle": sd["castle.weight"], "attn.rel": sd["rel"], "attn.meta": sd["meta"],
        "block.n1": sd["block.n1.weight"], "block.q": lin("block.q.weight") * dk ** -0.5,
        "block.k": lin("block.k.weight"), "block.v": lin("block.v.weight"), "block.o": lin("block.o.weight"),
        "block.n2": sd["block.n2.weight"], "block.wi0": lin("block.wi0.weight"), "block.wi1": lin("block.wi1.weight"),
        "block.wo": lin("block.wo.weight"), "norm": sd["norm.weight"], "policy.q": sd["pq.weight"],
        "policy.k": sd["pk.weight"], "value.w": sd["value.weight"].reshape(-1), "value.b": sd["value.bias"].reshape(-1),
    }
    return {k: v.contiguous().numpy().astype(np.float32) for k, v in t.items()}


MATRICES = ("block.q", "block.k", "block.v", "block.o", "block.wi0", "block.wi1", "block.wo")


def load_back(model: ChessNet, t):
    """Tenseurs du moteur → poids du modèle PyTorch (pour rejouer la validation après quantification)."""
    dk = model.cfg["d"] // model.cfg["heads"]
    m = {"block.q": "block.q.weight", "block.k": "block.k.weight", "block.v": "block.v.weight", "block.o": "block.o.weight",
         "block.wi0": "block.wi0.weight", "block.wi1": "block.wi1.weight", "block.wo": "block.wo.weight"}
    sd = model.state_dict()
    for k, name in m.items():
        w = torch.from_numpy(t[k])
        sd[name] = w / dk ** -0.5 if k == "block.q" else w
    model.load_state_dict(sd)
    model.set_ternary(False)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ckpt", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--name", default="brimkern-chess")
    ap.add_argument("--data", help="dossier de prepare.py : rejoue la validation après Q8_0")
    a = ap.parse_args()
    import gguf
    from safetensors.numpy import save_file

    ck = torch.load(a.ckpt, map_location="cpu")
    model = ChessNet(**ck["cfg"])
    model.load_state_dict(ck["state"])
    model.set_ternary(bool(ck.get("ternary")))
    loops = int(ck.get("loops", 6))
    cfg = dict(ck["cfg"], loops=loops, rms_eps=1e-6, ternary=bool(ck.get("ternary")), step=int(ck.get("step", 0)))
    t = engine_tensors(model)
    os.makedirs(a.out, exist_ok=True)

    st_path = os.path.join(a.out, f"{a.name}.safetensors")
    save_file(t, st_path, metadata={"brimkern_chess": json.dumps(cfg), "encoding": ENCODING})

    gg_path = os.path.join(a.out, f"{a.name}-q8_0.gguf")
    w = gguf.GGUFWriter(gg_path, "brimkern-chess")
    w.add_name(a.name)
    w.add_string("general.license", "MIT")
    w.add_string("general.description", "brimkern chess: one weight-shared transformer block looped `loops` times; policy (from,to) + value heads")
    A = "brimkern-chess"
    w.add_uint32(f"{A}.embedding_length", cfg["d"])
    w.add_uint32(f"{A}.attention.head_count", cfg["heads"])
    w.add_uint32(f"{A}.feed_forward_length", cfg["ff"])
    w.add_uint32(f"{A}.policy_dim", cfg["dp"])
    w.add_uint32(f"{A}.loops", loops)
    w.add_float32(f"{A}.attention.layer_norm_rms_epsilon", 1e-6)
    w.add_bool(f"{A}.ternary", cfg["ternary"])
    w.add_string(f"{A}.encoding", ENCODING)
    q8 = {}
    for k, v in t.items():
        if k in MATRICES:
            data = gguf.quants.quantize(v, gguf.GGMLQuantizationType.Q8_0)
            w.add_tensor(k, data, raw_dtype=gguf.GGMLQuantizationType.Q8_0)
            q8[k] = gguf.quants.dequantize(data, gguf.GGMLQuantizationType.Q8_0).reshape(v.shape).astype(np.float32)
        else:
            w.add_tensor(k, v)
    w.write_header_to_file()
    w.write_kv_data_to_file()
    w.write_tensors_to_file()
    w.close()
    sizes = {p: os.path.getsize(p) for p in (st_path, gg_path)}
    print(json.dumps({"cfg": cfg, "files": {os.path.basename(p): s for p, s in sizes.items()}}))

    if a.data:
        from train import evaluate, load  # noqa: E402
        val = load(os.path.join(a.data, "val.bin"))
        ref = evaluate(model, val, "cpu", loops, n=5000)
        mq = ChessNet(**ck["cfg"])
        mq.load_state_dict(ck["state"])
        load_back(mq, {**t, **q8})
        got = evaluate(mq, val, "cpu", loops, n=5000)
        print(json.dumps({"val_reference": ref, "val_after_q8_0": got}))


if __name__ == "__main__":
    main()
