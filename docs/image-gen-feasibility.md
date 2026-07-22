# Génération d'image dans BRIMKERN (100% navigateur, WebGPU) — faisabilité & plan

> Recherche le 2026-06-26, ancrée sur le moteur réel (`src/lib/webgpu/{kernels.ts, shaders.ts,
> model.ts}`). Question : peut-on faire de la **génération d'image** (type Stable Diffusion) dans
> l'app, en full-WebGPU, sur le même socle que le texte ? **Réponse courte : oui, mais c'est un
> SECOND moteur, pas une extension du moteur texte.** Cible viable = **SD-Turbo** ou **SD 1.5 + LCM**
> en 512×512, 1–4 étapes, **desktop d'abord**. Le make-or-break technique = le **`conv2d` WGSL** (qu'on
> peut ramener à du GEMM via im2col → réutilise nos matmuls). C'est un chantier de **semaines**, à
> jalonner. Détail ci-dessous. Chaque kernel WGSL devra être **validé en navigateur** (selfValidate) —
> rien ne tourne en CI/sandbox.

## 1. Le modèle mental : une diffusion latente, ce sont 3 réseaux + une boucle

Stable Diffusion (et la plupart des modèles image grand public) = **latent diffusion** :

```
prompt ──► [CLIP text encoder] ──► embeddings texte
                                         │ (cross-attention)
bruit latent 64×64×4 ──► [UNet débruiteur] ──► latent débruité   ╮
        ▲___________________ boucle N étapes (scheduler) ________╯
                                         │
                              [VAE decoder] ──► image RGB 512×512
```

- **N étapes** = 1 (SD-Turbo / SDXL-Turbo), 4 (LCM), 20–50 (SD classique). Chaque étape = **un passage
  complet de l'UNet**. C'est là que va 90% du temps.
- L'espace **latent** est 8× plus petit que l'image (512→64), d'où le coût raisonnable vs générer en
  pixels directement.

## 2. Ce qu'on réutilise vs ce qui est neuf

| Sous-réseau | Nature | Réutilise l'existant ? | Nouveau à écrire |
|---|---|---|---|
| **CLIP text encoder** | Transformer (ViT-L/14, ~123M) | ✅ **oui** : matmul q8/f16, attention, layernorm, gelu | quasi rien (un layernorm "classique" sans `1+w`, déjà gérable) |
| **UNet débruiteur** | Conv + attention (~860M) | ⚠️ **en partie** : self/cross-attention = nos kernels attention+matmul | **`conv2d`, `group_norm`, `SiLU`**, ResBlocks, time-embedding |
| **VAE decoder** | Conv pur (~84M, ou TAESD ~2,4M) | ❌ peu | **`conv2d`, `group_norm`, SiLU**, upsample (nearest) |
| **Scheduler** | Maths CPU (Euler/LCM/DPM) | — | ~100 lignes CPU, pas de GPU |

**Conclusion** : le morceau qui réutilise tout, c'est **CLIP**. Le morceau dur et neuf, c'est le
**conv2d** (partagé par UNet et VAE). Tout le reste découle de ces primitives.

## 3. Les kernels neufs (et comment limiter la surface)

### 3.1 `conv2d` — LE morceau · impact ★★★ · effort élevé · risque élevé
Deux stratégies :
- **im2col + GEMM** (recommandé pour démarrer) : on déplie les patches en colonnes puis on appelle
  **nos matmuls existants** (`matmul_t_q8`, tiling déjà fait). Avantage : on réutilise l'infra
  optimisée et la quantif q8/q4 ; on n'écrit qu'un kernel `im2col` (réindexation) simple. Coût : un
  buffer im2col temporaire (mémoire) — acceptable aux résolutions latentes.
- **conv directe** (plus tard, optim) : un kernel conv tuilé maison. Plus rapide en mémoire, mais
  beaucoup plus de WGSL à écrire/valider. À garder pour une 2ᵉ passe d'optim.

Les convs de diffusion sont surtout **3×3 stride 1 pad 1** et **1×1** → im2col gère les deux trivialement.

### 3.2 `group_norm` · impact ★★ · effort faible · risque faible
GroupNorm (32 groupes typiquement) sur des tenseurs `[C,H,W]`. Réduction moyenne/variance par groupe
puis normalisation affine. Kernel simple, proche du `rmsnorm` existant dans l'esprit.

### 3.3 `SiLU` (swish) et activations · effort trivial
`silu(x) = x * sigmoid(x)`. Une ligne. (GeLU est déjà là pour CLIP/Gemma.)

### 3.4 Attention UNet (self + cross) · réutilise l'existant
- **Self-attention** spatiale : reshape `[C,H,W]→[H·W, C]`, c'est notre attention standard.
- **Cross-attention** : Q vient du latent, **K/V viennent des embeddings texte**. C'est notre kernel
  d'attention avec des K/V externes — adaptation mineure (pas de KV-cache, pas de masque causal).

### 3.5 Upsample (nearest) + concat (skip connections) · effort faible
Le décodeur UNet/VAE remonte en résolution (nearest-neighbor 2×) et concatène les skips. Réindexation
simple.

## 4. Choix du modèle cible

| Modèle | Params (UNet) | Étapes | Résolution | Verdict navigateur |
|---|---|---|---|---|
| **SD-Turbo** | ~860M | **1** | 512 | ✅ **meilleure cible** : 1 passe UNet → le plus rapide |
| **SD 1.5 + LCM** | ~860M | **4** | 512 | ✅ bon ; qualité un poil mieux, 4× plus lent que Turbo |
| SD 1.5 classique | ~860M | 20–50 | 512 | ❌ trop d'étapes pour du navigateur |
| SDXL-Turbo | ~2.6B + 2 encodeurs | 1 | 512–1024 | ⚠️ 2–3× plus lourd, limite desktop, non-mobile |
| SD3 / Flux (DiT) | 2–12B | — | — | ❌ hors navigateur |

**VAE** : utiliser **TAESD** (décodeur distillé ~1 Mo) au lieu du VAE complet → décodage latent→image
quasi gratuit, légère perte de qualité. Énorme accélérateur pour le navigateur, surtout mobile. On
pourra proposer le VAE complet en option qualité sur desktop.

→ **Recommandation : SD-Turbo + TAESD**, 1 étape, 512×512.

## 5. Budget mémoire & perf (ordre de grandeur)

Poids SD-Turbo, **int8 résident** (notre quant BRIK) :
- UNet ~860M → ~**0,9 Go** · CLIP ~123M → ~**0,12 Go** · TAESD ~**1 Mo**. Total poids ≈ **~1 Go**.
- En **int4** : UNet ~**0,45 Go** → tient plus large, qualité à benchmarker.

⚠️ **Le vrai risque mémoire, ce sont les ACTIVATIONS**, pas les poids. Les feature maps de l'UNet
(jusqu'à 1280 canaux à basse résolution, 320 à 64×64) + les buffers im2col peuvent dépasser
`maxStorageBufferBindingSize` (souvent 128 Mo) → il faudra **tuiler** comme on l'a fait pour la
projection logits. À surveiller dès le spike VAE.

Perf **attendue** (à confirmer en navigateur — non benchable hors WebGPU) :
- **Desktop** (GPU correct) : SD-Turbo 1 étape ~**1–3 s/image** ; SD1.5+LCM 4 étapes ~**3–8 s**.
- **Mobile** (Pixel 9) : lourd. Viser **256×256** et/ou TAESD ; probablement **10–30 s** ou OOM.
  **Desktop d'abord, mobile en bonus.**

## 6. Format, loader, quantif

- Les modèles image sont en **`safetensors`** (format diffusers), **pas GGUF**. Parser safetensors =
  trivial (header JSON + blobs) → nouveau petit loader.
- **Quantif** : poids conv 4D `[out,in,kh,kw]` et linéaires → q8/q4 **par canal de sortie** (réutilise
  `quantizeToBytes`). Empaquetage dans un **BRIK image** (manifest étendu : décrit l'UNet/VAE/CLIP au
  lieu d'un transformer décodeur).
- **Tokenizer** : CLIP utilise un BPE simple (vocab 49408) → transformers.js le fournit déjà, ou on
  l'embarque comme pour le texte.

## 7. Plan par jalons (dé-risquage d'abord)

| # | Jalon | Livrable vérifiable | Impact | Effort | Risque |
|---|---|---|---|---|---|
| 0 | Doc (ce fichier) | alignement cible+plan | — | fait | — |
| 1 | `conv2d` (im2col+GEMM) + `group_norm` + `SiLU` | selfValidate vs référence CPU | ★★★ | élevé | élevé (WGSL) |
| 2 | **VAE/TAESD decoder** | latent connu → **image** comparée à un PNG de réf | ★★★ | moyen | moyen |
| 3 | CLIP text encoder | prompt → embedding comparé à diffusers | ★★ | faible | faible |
| 4 | **UNet, une étape** | bruit+t+embed → latent débruité vs réf | ★★★ | élevé | élevé |
| 5 | Scheduler (Euler/LCM) + boucle | **image générée de bout en bout** | ★★★ | faible | moyen |
| 6 | Quantif BRIK image + streaming + UI (modalité) | charger/streamer un modèle image | ★★ | moyen | faible |

**Ordre conseillé** : jalon **1 → 2** (le conv2d est prouvé visuellement par le VAE), puis **3**, puis
**4 → 5** (le cœur), enfin **6** (packaging). On peut s'arrêter/évaluer après chaque jalon.

## 8. Risques & questions ouvertes
- **WGSL non testable hors navigateur** : chaque kernel passe par `selfValidate` (réf CPU) avant
  intégration — comme pour le texte. C'est le garde-fou anti-régression.
- **Mémoire d'activations** (§5) : probable besoin de tuilage ; à mesurer tôt.
- **Qualité int4** sur l'UNet : à benchmarker (la diffusion est plus sensible à la quantif que le
  texte). Peut-être int8 obligatoire pour l'UNet, int4 ok pour le reste.
- **Mobile** : sans doute 256² + TAESD, voire hors de portée des entrées de gamme. Ne pas bloquer le
  desktop là-dessus.
- **Pas de réécriture du moteur texte** : c'est un module séparé (`src/lib/webgpu/diffusion/` ?) qui
  partage l'engine WGPU et les kernels matmul/attention, sans toucher au chemin LLM existant.

## 9. Recommandation
Cible **SD-Turbo + TAESD**, desktop-first. Démarrer par le **jalon 1 (conv2d/group_norm/SiLU)** puis
le **jalon 2 (VAE decoder)** — c'est le plus court chemin vers un **pixel à l'écran** et ça prouve les
primitives neuves. Ne rien quantifier en int4 sur l'UNet avant d'avoir benché la qualité. Et garder le
moteur texte intact pendant tout le chantier.
