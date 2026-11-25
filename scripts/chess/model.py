"""Le modèle d'échecs brimkern : UN bloc de transformeur, bouclé — pensé pour peser le moins possible.

Idées (chacune mesurée, cf. docs/ROADMAP.md, section échecs) :
  • Profondeur RÉCURRENTE : un seul bloc partagé, appliqué `loops` fois (transformeur « universel »).
    Le fichier ne contient qu'un bloc ; la profondeur se choisit au jeu. Entraîné avec un nombre de
    tours tiré au hasard pour que chaque profondeur reste valable, et SANS plongement d'étape, pour
    que les mêmes poids puissent tourner PLUS de tours qu'à l'entraînement (« réfléchir plus
    longtemps » sur une position difficile — à mesurer).
  • Biais d'attention RELATIF par décalage (dx, dy) sur l'échiquier : 15 × 15 valeurs par tête au
    lieu d'une table 65 × 65 — la géométrie (diagonales, sauts de cavalier) coûte ~2 K paramètres.
    Le moteur reconstruit la table [têtes, 65, 65] sur CPU au chargement, comme le biais de T5.
  • Poids ternaires appris (QAT, `set_ternary(True)`) : {−1, 0, +1} × une échelle par ligne.

Le tronc n'utilise que des opérations qui existent déjà dans src/lib/webgpu/kernels.ts (chemin de
l'encodeur T5 de LTX-Video) : rmsnorm, matmulT (poids [sortie, entrée], sans biais), attentionBias
(softmax(q·kᵀ + biais), SANS 1/√d — replié dans Wq à l'export), geglu (gelu tanh), add. Aucun kernel neuf.

Jetons (L = 65), du point de vue du trait (cf. prepare.py) :
  0-63 : une case — plongement de pièce (13) + plongement de case (64) + marqueur « en passant »
  64   : roques (16 combinaisons)
Têtes (CPU dans la page) :
  politique : q = H·Wpq, k = H·Wpk sur les 64 cases → logits[de, vers] = q_de · k_vers / √dp
  valeur    : moyenne des 65 jetons → logit de la probabilité de gain du trait
"""
import math

import torch
import torch.nn as nn
import torch.nn.functional as F

L = 65
EPS = 1e-6


def rel_index():
    """[64, 64] → indice du décalage (dx + 7) * 15 + (dy + 7) entre deux cases."""
    sq = torch.arange(64)
    f, r = sq % 8, sq // 8
    dx = f[None, :] - f[:, None] + 7
    dy = r[None, :] - r[:, None] + 7
    return dx * 15 + dy


def ternarize(w):
    """{−1, 0, +1} × échelle par ligne (moyenne de |w|), comme BitNet b1.58."""
    s = w.abs().mean(dim=1, keepdim=True).clamp(min=1e-8)
    return (w / s).round().clamp(-1, 1), s


class TernaryLinear(nn.Linear):
    """Linear sans biais ; en mode ternaire, le forward utilise les poids ternarisés et le gradient
    traverse l'arrondi (estimateur « straight-through »)."""

    ternary = False

    def forward(self, x):
        w = self.weight
        if self.ternary:
            t, s = ternarize(w)
            w = w + (t * s - w).detach()
        return F.linear(x, w)


class RMSNorm(nn.Module):
    def __init__(self, d):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(d))

    def forward(self, x):
        return x * torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + EPS) * self.weight


class Block(nn.Module):
    def __init__(self, d, heads, ff):
        super().__init__()
        self.h, self.dk = heads, d // heads
        self.n1 = RMSNorm(d)
        self.q = TernaryLinear(d, d, bias=False)
        self.k = TernaryLinear(d, d, bias=False)
        self.v = TernaryLinear(d, d, bias=False)
        self.o = TernaryLinear(d, d, bias=False)
        self.n2 = RMSNorm(d)
        self.wi0 = TernaryLinear(d, ff, bias=False)
        self.wi1 = TernaryLinear(d, ff, bias=False)
        self.wo = TernaryLinear(ff, d, bias=False)

    def forward(self, x, bias):
        B = x.shape[0]
        a = self.n1(x)
        q = self.q(a).view(B, L, self.h, self.dk).transpose(1, 2)
        k = self.k(a).view(B, L, self.h, self.dk).transpose(1, 2)
        v = self.v(a).view(B, L, self.h, self.dk).transpose(1, 2)
        # Attention explicite : le même calcul que attentionBias du moteur (et plus rapide que
        # scaled_dot_product_attention avec un masque flottant sur MPS, mesuré).
        att = torch.softmax(q @ k.transpose(-1, -2) * (self.dk ** -0.5) + bias, dim=-1) @ v
        x = x + self.o(att.transpose(1, 2).reshape(B, L, -1))
        a = self.n2(x)
        return x + self.wo(F.gelu(self.wi0(a), approximate="tanh") * self.wi1(a))


class ChessNet(nn.Module):
    def __init__(self, d=128, heads=8, ff=384, dp=64):
        super().__init__()
        self.cfg = dict(d=d, heads=heads, ff=ff, dp=dp)
        self.piece = nn.Embedding(13, d)
        self.square = nn.Parameter(torch.randn(64, d) * 0.02)
        self.ep = nn.Parameter(torch.zeros(d))
        self.castle = nn.Embedding(16, d)
        # Biais relatif : [têtes, 225] entre cases + 3 termes par tête pour le jeton des roques
        # (case→roques, roques→case, roques→roques).
        self.rel = nn.Parameter(torch.zeros(heads, 225))
        self.meta = nn.Parameter(torch.zeros(heads, 3))
        self.register_buffer("relidx", rel_index(), persistent=False)
        self.block = Block(d, heads, ff)
        self.norm = RMSNorm(d)
        self.pq = nn.Linear(d, dp, bias=False)
        self.pk = nn.Linear(d, dp, bias=False)
        self.value = nn.Linear(d, 1)
        self.dp, self.n_heads = dp, heads
        for m in self.modules():
            if isinstance(m, (nn.Linear, nn.Embedding)):
                nn.init.normal_(m.weight, std=0.02)

    def set_ternary(self, on: bool):
        for m in self.modules():
            if isinstance(m, TernaryLinear):
                m.ternary = on

    def attn_bias(self):
        """Table complète [têtes, 65, 65] — ce que le moteur reconstruit au chargement."""
        H = self.n_heads
        sq = self.rel[:, self.relidx]                                   # [H, 64, 64]
        col = self.meta[:, 0, None, None].expand(H, 64, 1)              # case → roques
        row = self.meta[:, 1, None, None].expand(H, 1, 64)              # roques → case
        corner = self.meta[:, 2, None, None]                            # roques → roques
        top = torch.cat([sq, col], dim=2)
        bottom = torch.cat([row, corner], dim=2)
        return torch.cat([top, bottom], dim=1)

    def embed(self, pieces, castle, ep):
        x = self.piece(pieces) + self.square
        epmask = F.one_hot(ep, 65)[:, :64].unsqueeze(-1).to(x.dtype)
        x = x + epmask * self.ep
        return torch.cat([x, self.castle(castle).unsqueeze(1)], dim=1)

    def trunk(self, x, loops):
        bias = self.attn_bias()
        for _ in range(loops):
            x = self.block(x, bias)
        return self.norm(x)

    def heads(self, h):
        sq = h[:, :64]
        logits = torch.einsum("bfd,btd->bft", self.pq(sq), self.pk(sq)) / math.sqrt(self.dp)
        value = self.value(h.mean(1)).squeeze(-1)
        return logits.reshape(h.shape[0], 4096), value

    def forward(self, pieces, castle, ep, loops=6):
        return self.heads(self.trunk(self.embed(pieces, castle, ep), loops))


def n_params(m):
    return sum(p.numel() for p in m.parameters())
