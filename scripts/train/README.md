# Entraînement du modèle du SDK (LoRA, Mac, mlx-lm)

Données synthétiques écrites par `claude -p`, composées au format EXACT du SDK, LoRA sur le GPU du
Mac. Tout vit dans `~/.cache/brimkern-train/` (venv, llama.cpp, données, adaptateurs).

## Pipeline — dans l'ordre, UNE étape à la fois

| étape | commande | garde-fou |
|---|---|---|
| 0. tailler le vocabulaire | `fetch-corpus.mjs` puis `prune-vocab.py --model <snapshot> --keep 40000 --out …/qwen3-0.6b-enfr` | rembourré à 64 (défaut moteur, ROADMAP § 22) |
| 1. générer | `node scripts/train/gen-dialogues.mjs --n=300 --from=400 --jobs=3 --out=~/.cache/brimkern-train/raw-lot3.jsonl` | s'arrête seul après 10 échecs d'affilée |
| 2. vérifier | `node scripts/train/verify-dialogues.mjs --in=~/.cache/brimkern-train/raw-lot3.jsonl --jobs=3` | un tour non jugé = FAIL |
| 3. rendre | `node scripts/train/render.mjs --in=<*.verified.jsonl> --out=~/.cache/brimkern-train/sft-robuste` | chiffres des épinglés non autorisés ; données de l'ANCIENNE charte exclues |
| 4. entraîner | `MLX_MEM_GB=10 nice -n 5 caffeinate -dims ~/.cache/brimkern-train/venv/bin/python scripts/train/train-lora.py -c <lora-robuste.yaml, iters = exemples / 4>` | rien d'autre en parallèle ; `caffeinate -dims` (la veille de maintenance fige `-i`) |
| 5. choisir | `…/venv/bin/python scripts/train/eval-facts.py --model <snapshot> --adapter <dossier>` sur base + 3-4 sauvegardes | le moins de chiffres inventés, pas la plus basse perte |
| 6. fusionner, GGUF, .brik | `mlx_lm fuse` → `to-gguf.py --outtype q8_0` → `build:mobile-brik` (BRIK_SRC / BRIK_TOKENIZER_DIR locaux) | base ET adaptateur par le même chemin |
| 7. juger | `sdk-multi.mjs 3` (5 boutiques jamais vues) puis `sdk-smalltalk.mjs`, bras alternés base/LoRA, serveur supervisé | `npm run test:contamination` vert ; port 3618 vide |

## ⚠️ Ce que le pilote du 2026-09-28 a appris

- **Le Mac tombe** à batch 4 × 2048 sans `grad_checkpoint` (logits d'un vocab de 152k ≈ 5 Go par
  pas), surtout avec 4 `claude -p` en parallèle. Batch 2 × 1280 + checkpointing + plafond 6 Go :
  5,2 Go au pic, 0,17-0,28 pas/s.
- **La perte de validation ment sur ce qui compte** : 2,37 → 0,455, et pourtant faits 1/8 contre
  5/8 pour la base au banc. Les réponses d'entraînement paraphrasaient les chiffres ; le 0.6B a pris
  l'aisance sans la précision. D'où la charte « chiffre recopié » + le vérificateur + eval-facts.
- **Les exemples épinglés du SDK sont un guide de tailles de CHAUSSURES** (`src/sdk/prompting.ts`,
  « EU 41 : 26,0 cm ») et la boutique du banc vend des chaussures : le LoRA répondait « EU 41 is
  26.0cm » à « I wear a 42 ». Le banc est contaminé par le prompt lui-même, pour tous les modèles.
  D'où `sdk-multi.mjs` (boutiques de `scripts/e2e/boutiques-banc.json`, que render.mjs EXCLUT de
  l'entraînement) et le garde-fou `npm run test:contamination`.

## Résultat de la phase robuste (2026-09-29)

Qwen3-0.6B taillé EN/FR + LoRA (pas 1 200), .brik mixed 382 Mo, bras alternés contre la base
taillée : sdk-multi 112/120 contre 91/120, sdk-smalltalk (juge) 47/56 contre 29/56, sdk-rag 20/24
contre 17/24 ; eval-facts 0 chiffre inventé, rappel 91,2 % contre 75,5 %. Détail : ROADMAP § 22.
