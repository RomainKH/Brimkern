#!/usr/bin/env python3
"""Entraîne le modèle d'échecs brimkern sur les positions de prepare.py — en douceur pour la machine.

    taskpolicy -b python scripts/chess/train.py --data <dossier> --out <dossier du run> --hours 1

Sobre par construction (la machine d'entraînement est aussi un ordinateur portable) :
  • les données restent sur disque (np.memmap), jamais chargées en RAM ;
  • la mémoire MPS est plafonnée (--mem-gb) : au-delà, PyTorch lève une erreur au lieu de swapper ;
  • rapport cyclique (--duty 0.7 = le GPU travaille 70 % du temps, dort le reste) ;
  • budget en temps (--hours) et checkpoint à chaque évaluation.

Cibles :
  • politique : distribution douce sur les candidats multi-PV de Stockfish, p_i ∝ exp((wp_i − wp_best) / τ)
    — un coup à 5 % de probabilité de gain du meilleur garde un peu de crédit ;
  • valeur : entropie croisée binaire contre la probabilité de gain de la meilleure ligne.
Augmentation : quand plus personne ne peut roquer, la position est retournée gauche↔droite une fois
sur deux (symétrie exacte des échecs sans roque).
Mesures sur une tranche fixe de validation : top-1 = l'argmax est le meilleur coup de Stockfish ;
« good » = l'argmax est un candidat à moins de 2 % de probabilité de gain du meilleur ; MAE de la valeur.
--extra : second jeu de positions (parties du modèle annotées, learn.py), --extra-frac du lot.
"""
import argparse
import json
import math
import os
import sys
import time

import numpy as np
import torch
import torch.nn.functional as F

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from model import ChessNet, n_params  # noqa: E402

REC, K = 82, 5
MIRROR = np.arange(64) ^ 7


def load(path):
    mm = np.memmap(path, dtype=np.uint8, mode="r")
    return mm.reshape(-1, REC)


def to_batch(rec, dev, augment):
    rec = np.array(rec)  # copie hors du memmap
    pieces = rec[:, :64].astype(np.int64)
    castle = rec[:, 64].astype(np.int64)
    ep = rec[:, 65].astype(np.int64)
    value = rec[:, 66].astype(np.float32) / 255
    cand = rec[:, 67:82].reshape(-1, K, 3).astype(np.int64)
    frm, to, wp = cand[:, :, 0], cand[:, :, 1], cand[:, :, 2].astype(np.float32) / 255
    valid = frm != 255
    # Candidats matants (bit 64 de « de », cf. prepare.record) : valeur effective au-dessus de tout coup
    # non matant, d'autant plus haute que le mat est proche (mat en 1 : 1,19 ; en 20 : 1,0).
    mate = valid & ((frm & 64) != 0)
    frm = np.where(valid, frm & 63, frm)
    wp = np.where(mate, np.clip(1.2 - 0.01 * cand[:, :, 2], 1.0, 1.2), wp).astype(np.float32)
    if augment:
        m = (castle == 0) & (np.random.rand(len(rec)) < 0.5)
        if m.any():
            pieces[m] = pieces[m][:, MIRROR]
            ep[m] = np.where(ep[m] < 64, ep[m] ^ 7, 64)
            frm[m] = np.where(valid[m], frm[m] ^ 7, frm[m])
            to[m] = np.where(valid[m], to[m] ^ 7, to[m])
    idx = np.where(valid, frm * 64 + to, 0)
    t = lambda a: torch.from_numpy(a).to(dev)
    return t(pieces), t(castle), t(ep), t(value), t(idx), t(wp), t(valid), t(np.where(valid, frm, 0)), t(np.where(valid, to, 0))


def policy_targets(wp, valid, tau, bonus=None):
    z = (wp - wp[:, :1]) / tau
    if bonus is not None:
        z = z + bonus
    z = z.masked_fill(~valid, -1e9)
    return torch.softmax(z, dim=1)


def aggression_bonus(pieces, frm, to, valid, beta):
    """Style AGRESSIF : bonus (en logits de la cible) des candidats qui prennent une pièce ou
    amènent la pièce jouée dans la zone du roi adverse (à 2 cases ou moins, en s'en rapprochant). Calculé sur l'échiquier encodé (roi adverse = 12).
    Avec τ = 0,03, β = 1 met à égalité le meilleur coup et un coup agressif 3 % de probabilité de gain
    en dessous : le réseau choisit l'attaque quand elle ne coûte presque rien."""
    B = pieces.shape[0]
    ksq = (pieces == 12).float().argmax(1)                      # [B] case du roi adverse
    kf, kr = ksq % 8, ksq // 8
    f_, t_ = frm.clamp(max=63), to.clamp(max=63)
    dist = lambda s: torch.maximum((s % 8 - kf[:, None]).abs(), (s // 8 - kr[:, None]).abs())
    closer = ((dist(t_) < dist(f_)) & (dist(t_) <= 2)).float()  # entre dans la zone du roi adverse
    capture = (torch.gather(pieces, 1, t_) >= 7).float()
    return beta * torch.clamp(capture + closer, max=1.0) * valid.float()


@torch.no_grad()
def evaluate(model, val, dev, loops, n=20000, bs=1024):
    model.eval()
    top1 = good = mae = 0.0
    n = min(n, len(val))
    for i in range(0, n, bs):
        p, c, e, v, idx, wp, valid, _, _ = to_batch(val[i:i + bs], dev, False)
        logits, vl = model(p, c, e, loops)
        pred = logits.argmax(1)
        top1 += (pred == idx[:, 0]).sum().item()
        near = valid & (wp >= wp[:, :1] - 0.02)
        good += ((pred[:, None] == idx) & near).any(1).sum().item()
        mae += (torch.sigmoid(vl) - v).abs().sum().item()
    model.train()
    return dict(top1=top1 / n, good=good / n, value_mae=mae / n)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--d", type=int, default=128)
    ap.add_argument("--heads", type=int, default=8)
    ap.add_argument("--ff", type=int, default=384)
    ap.add_argument("--dp", type=int, default=64)
    ap.add_argument("--loops-min", type=int, default=4)
    ap.add_argument("--loops-max", type=int, default=6)
    ap.add_argument("--batch", type=int, default=256)
    ap.add_argument("--lr", type=float, default=2e-3)
    ap.add_argument("--tau", type=float, default=0.03)
    ap.add_argument("--value-weight", type=float, default=1.0)
    ap.add_argument("--steps", type=int, default=100_000, help="schedule length (cosine)")
    ap.add_argument("--hours", type=float, default=1.0, help="wall-clock budget")
    ap.add_argument("--duty", type=float, default=0.7)
    ap.add_argument("--mem-gb", type=float, default=3.0)
    ap.add_argument("--eval-every", type=int, default=1000)
    ap.add_argument("--init", help="checkpoint to start from")
    ap.add_argument("--ternary", action="store_true", help="quantization-aware training, ternary block")
    ap.add_argument("--extra", help="second train.bin directory (positions from the model's own games, learn.py)")
    ap.add_argument("--extra-frac", type=float, default=0.5, help="share of each batch drawn from --extra")
    ap.add_argument("--warmup", type=int, default=500)
    ap.add_argument("--tag", default="", help="free label written in the checkpoint")
    ap.add_argument("--aggression", type=float, default=0.0, help="aggressive style bonus in policy targets (see aggression_bonus)")
    a = ap.parse_args()

    dev = "mps" if torch.backends.mps.is_available() else "cpu"
    if dev == "mps":
        frac = min(0.9, a.mem_gb * 1e9 / torch.mps.recommended_max_memory())
        torch.mps.set_per_process_memory_fraction(frac)
    os.makedirs(a.out, exist_ok=True)
    train, val = load(os.path.join(a.data, "train.bin")), load(os.path.join(a.data, "val.bin"))
    extra = load(os.path.join(a.extra, "train.bin")) if a.extra else None
    n_extra = int(round(a.batch * a.extra_frac)) if extra is not None and len(extra) else 0

    model = ChessNet(d=a.d, heads=a.heads, ff=a.ff, dp=a.dp)
    start_step = 0
    if a.init:
        ck = torch.load(a.init, map_location="cpu")
        model = ChessNet(**ck["cfg"])
        model.load_state_dict(ck["state"])
    model.set_ternary(a.ternary)
    model.to(dev)
    decay = [p for p in model.parameters() if p.dim() >= 2]
    no_decay = [p for p in model.parameters() if p.dim() < 2]
    opt = torch.optim.AdamW([{"params": decay, "weight_decay": 0.01}, {"params": no_decay, "weight_decay": 0.0}], lr=a.lr)
    warm = a.warmup

    def lr_at(s):
        if s < warm:
            return a.lr * (s + 1) / warm
        prog = min(1.0, (s - warm) / max(1, a.steps - warm))
        return a.lr * (0.05 + 0.95 * 0.5 * (1 + math.cos(math.pi * prog)))

    cfg = dict(model.cfg)
    print(f"model {n_params(model) / 1e3:.0f}k params {cfg} · loops {a.loops_min}-{a.loops_max} · "
          f"ternary {a.ternary} · train {len(train):,} val {len(val):,} · device {dev}", flush=True)
    log = open(os.path.join(a.out, "log.jsonl"), "a")
    t_start = time.time()
    best = -1.0
    run_loss = run_n = 0
    t_window = time.time()
    s = start_step
    while True:
        if time.time() - t_start > a.hours * 3600 or s >= a.steps:
            break
        t0 = time.time()
        for g in opt.param_groups:
            g["lr"] = lr_at(s)
        loops = int(np.random.randint(a.loops_min, a.loops_max + 1))
        idx = np.sort(np.random.randint(0, len(train), a.batch - n_extra))
        rec = train[idx]
        if n_extra:
            rec = np.concatenate([np.asarray(rec), np.asarray(extra[np.sort(np.random.randint(0, len(extra), n_extra))])])
        p, c, e, v, mv, wp, valid, frm, to = to_batch(rec, dev, True)
        logits, vl = model(p, c, e, loops)
        logp = F.log_softmax(logits, dim=1)
        tgt = policy_targets(wp, valid, a.tau, aggression_bonus(p, frm, to, valid, a.aggression) if a.aggression else None)
        loss_p = -(tgt * logp.gather(1, mv)).sum(1).mean()
        loss_v = F.binary_cross_entropy_with_logits(vl, v)
        loss = loss_p + a.value_weight * loss_v
        opt.zero_grad(set_to_none=True)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        if dev == "mps":
            torch.mps.synchronize()
        dt = time.time() - t0
        if a.duty < 1:
            time.sleep(dt * (1 - a.duty) / a.duty)
        run_loss += loss.item()
        run_n += 1
        s += 1
        if s % 100 == 0:
            rate = 100 * a.batch / (time.time() - t_window)
            t_window = time.time()
            print(f"step {s} · loss {run_loss / run_n:.3f} · lr {lr_at(s):.2e} · {rate:.0f} pos/s (duty included)", flush=True)
            run_loss = run_n = 0
        if s % a.eval_every == 0:
            m = evaluate(model, val, dev, a.loops_max)
            m_long = evaluate(model, val, dev, a.loops_max * 2, n=5000)
            rec = dict(step=s, seen=s * a.batch, minutes=round((time.time() - t_start) / 60, 1), **m,
                       top1_2x_loops=m_long["top1"],
                       mem_mb=round(torch.mps.driver_allocated_memory() / 1e6) if dev == "mps" else None)
            print("eval", json.dumps(rec), flush=True)
            log.write(json.dumps(rec) + "\n"); log.flush()
            ck = dict(cfg=cfg, state=model.state_dict(), step=s, ternary=a.ternary, loops=a.loops_max, metrics=m, tag=a.tag)
            torch.save(ck, os.path.join(a.out, "last.pt"))
            if m["top1"] > best:
                best = m["top1"]
                torch.save(ck, os.path.join(a.out, "best.pt"))
    m = evaluate(model, val, dev, a.loops_max)
    ck = dict(cfg=cfg, state=model.state_dict(), step=s, ternary=a.ternary, loops=a.loops_max, metrics=m, tag=a.tag)
    torch.save(ck, os.path.join(a.out, "last.pt"))
    print("final", json.dumps(dict(step=s, **m)), flush=True)


if __name__ == "__main__":
    main()
