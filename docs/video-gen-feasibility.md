# Génération de VIDÉO dans le navigateur — étude de faisabilité (2026-07-21)

> **Verdict : faisable en réutilisant le pipeline image existant.** La voie « gros modèles t2v »
> (Wan/FastWan, LTX-Video, CogVideoX) est morte pour le navigateur — pas à cause du DiT, mais du
> **text encoder T5/umt5 de ~5 Md de paramètres** qu'ils embarquent tous (vérifié sur
> FastVideo/FastWan-QAD-1.3B : le « 1.3B » cache un umt5 en 5 shards), plus une famille de kernels
> 3D entière (attention spatio-temporelle, VAE vidéo causal). La voie viable = **AnimateDiff** :
> un module de MOTION qui s'insère dans un UNet SD 1.5 classique — c'est-à-dire dans notre
> chemin image déjà porté, quantifié int8 et validé (CLIP résident, conv2d_direct_q8, TAESD).

## L'architecture retenue : AnimateDiff-Lightning sur la pile image

| Brique | Quoi | Poids (estimé BRIK) | État chez nous |
|---|---|---|---|
| Text encoder | CLIP ViT-L (768) | ~120 Mo q8 | ✅ `clip.ts` déjà paramétré 768/1024 |
| UNet | SD 1.5 (860M, cross-attn 768) | ~450 Mo q4 / ~900 Mo q8 | ✅ même famille que SD-Turbo (config-driven) |
| **Motion module** | AnimateDiff-**Lightning 4-step** (ByteDance, distillé) | 908 Mo f16 → **~460 Mo q8** | ❌ le chantier |
| VAE décode | TAESD, par frame | déjà chargé | ✅ tel quel |

Total opt-in desktop : **~1,3 Go** (ordre de grandeur du BRIK SD-Turbo actuel ×1,7). Mobile : exclu
(thermique) — desktop uniquement, duty-cycle hérité de l'image.

**Pourquoi Lightning** : distillé à 1/2/4/8 pas (licence CreativeML OpenRAIL-M, comme SD).
4 pas × 16 frames = 64 passes UNet 256px ≈ **20-60 s pour ~2 s de vidéo** sur desktop
(SD-Turbo 1 passe 256px ≈ 0,3-1 s chez nous) ; 512px ≈ 1-3 min. C'est le « optimisé » réaliste.

## Ce qui est NOUVEAU (et seulement ça)

Le module motion insère, après chaque bloc spatial du UNet, une **attention temporelle** : à chaque
position spatiale (h,w), self-attention sur l'axe des 16 frames (avec position embedding sinusoïdal).
Nos kernels d'attention existants savent faire — c'est un reshape (B·H·W, T, C) + attention
standard. Donc :

1. **Kernel/plumbing `temporal_attention`** (probable réutilisation de `attention_full` + reshapes
   résidents) + selfValidate vs oracle + kill-switch `?video=0` — règle repo.
2. Les latents deviennent (16, 4, h/8, w/8) : le UNet traite les frames **en batch** (nos kernels
   conv/attention sont déjà batchés par la dimension spatiale — à vérifier sur pièce).
3. Position embedding temporel + GroupNorm du module motion (kernels existants).

## L'oracle (étape 1, comme rwkv-cpuref/lfm2-cpuref)

Python + diffusers en venv local (`AnimateDiffPipeline` + `animatediff_lightning_4step_diffusers`,
seed fixe, CPU ou MPS) : dump des activations d'un bloc motion (entrée/sortie) → référence
byte-near pour le selfValidate WGSL, et vidéo de référence pour l'E2E. llama.cpp ne couvre pas
la vidéo — l'oracle est diffusers, comme la réf CLIP l'a été pour l'image.

## Plan par étapes (chacune committée + validée avant la suivante)

1. **Oracle diffusers** : venv + génération de référence (seed fixe) + dump activations motion.
2. **Inspection/BRIK** : shapes du module motion (48 blocs attention temporelle) ; étendre
   `build-image-brik.cjs` → BRIK SD1.5-UNet + CLIP-L + motion q8 (~1,3 Go, shards streamés).
3. **Kernel** : attention temporelle WGSL + selfValidate vs dump + `?video=0`.
4. **Orchestration** : UNet 16-frames + injection motion + boucle 4 steps + TAESD par frame →
   frames PNG → WebCodecs/canvas → WebM/GIF côté client.
5. **UI** : onglet vidéo (desktop-only, gating WebGPU + VRAM), duty-cycle thermique, prévisualisation
   frame par frame pendant la génération (l'attente devient un spectacle — important à 60 s).
6. **E2E Chrome** : vraie vidéo générée en headless, comparée à l'oracle (PSNR lâche).

## Risques identifiés

- **Mémoire pic** : 16× les activations d'une image — à 256px ça tient (latents 16×4×32×32 ; les
  activations UNet dominent, ~16× nos pics image 256px → à mesurer étape 4, repli 8 frames).
- La distillation Lightning est calibrée pour des bases SD1.5 *stylisées* (réalisme moyen sur SD1.5
  vanilla) — prévoir un essai avec une base 1.5 fine-tunée légère si la qualité déçoit.
- WebCodecs (encodage WebM) : disponible Chrome/Edge ; repli GIF/APNG sinon.

## Écarté (et pourquoi)

- **FastWan-QAD-1.3B / Wan 2.x** : umt5 ~5B obligatoire (~3-4 Go), VAE vidéo causal 3D, attention
  spatio-temporelle native — un second moteur complet pour un résultat desktop-minutes. En veille.
- **LTX-Video 2B** (même topologie : T5-XXL) et **CogVideoX-2B** (idem) : même mur du text encoder.
- **SVD (image-to-video)** : pas de text-to-video direct, UNet 1.5B + CLIP-image, moins « démo ».

## Mise à jour 2026-07-21 — motion résident + créatif + rendu livrés
- **Motion 100 % résident** : `MotionModule.forwardResident` (4 nouveaux WGSL `video_motion_gather`/
  `scatter`, `video_add_pe`, `attn_temporal` + réutilise group_norm/layernorm/geglu_split/matmul_t_q8) —
  forward motion sans readback, glu portée en WGSL, **5,1×/module**, byte-identique oracle. Gate
  `videoResidentOk` + repli JS + `?videoresident=0`.
- **Enrichissement de prompt par LFM** (`promptEnrich.ts`, opt-in) : few-shot ChatML → scène orientée
  mouvement, + fallback qui ajoute des descripteurs de mouvement si LFM échoue (jamais un no-op).
- **Rendu WebM** : pacing borné par temps écoulé (fini le 1 fps / 16 s de diaporama) + boucle, durée
  cible ~10 s. ⚠️ **32 frames uniques max** (pos_embed `[1,32,C]`) — plus de mouvement neuf =
  interpolation de frames (RIFE) ou chaînage fenêtre glissante (chantiers à part).
- Reste : **UNet distillé** (le vrai levier de vitesse, compute-bound), onglet vidéo produit dans le chat.
