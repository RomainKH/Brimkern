# Faisabilité : modèle vision (image + texte → texte) sur desktop

*Étude du 2026-07-16 — cible : Qwen2-VL 2B Instruct, le « Bientôt » du catalogue (`MODALITY_PILL.vision`).*

## Verdict court

**Faisable, desktop d'abord, en 4 jalons incrémentaux.** L'essentiel des briques GPU existe déjà
dans le moteur (héritées du chat et du pipeline image) ; les vrais chantiers sont (1) deux kernels
de position (RoPE 2D pour le ViT, M-RoPE pour le LLM), (2) l'injection d'embeddings dans le forward
du LLM à la place des ids de tokens, (3) le pré-traitement image et l'UI de pièce jointe.

## Pourquoi Qwen2-VL 2B

- **LLM = Qwen2 1.5B** : notre archi la mieux rodée (kernels, tokenizer, chat template, KV cache).
- **Encodeur vision = ViT ~675 M** (le même pour toutes les tailles Qwen2-VL) : patch 14×14,
  attention pleine (non causale), LayerNorm + GELU — architecture « vanille » côté kernels.
- **Fusion simple** : merge spatial 2×2 puis un MLP (« merger ») qui projette 4 patches → 1 token
  dans la dimension du LLM (1536). Pas de cross-attention à implémenter : les tokens image sont
  simplement insérés dans la séquence du prompt entre `<|vision_start|>` et `<|vision_end|>`.
- **Distribution** : llama.cpp le publie en GGUF **en deux fichiers** — le LLM (formats habituels)
  + un `mmproj-*.gguf` (ViT + merger). Notre parser GGUF lit déjà ces conteneurs ; conversion BRIK
  possible ensuite (q8 conseillé pour le ViT).

## Budget mémoire (desktop uniquement, pour l'instant)

| Composant | Précision | VRAM approx. |
|---|---|---|
| ViT 675 M | f16 (ou q8) | ~1,35 Go (~0,7 q8) |
| Merger MLP | f16 | ~40 Mo |
| LLM Qwen2 1.5B | q8 | ~1,6 Go |
| KV + activations | — | ~0,3 Go |
| **Total** | | **~3,3 Go (≈2,6 en tout-q8)** |

Hors de portée du téléphone aujourd'hui ; OK pour un desktop avec GPU dédié ou Apple Silicon.
Nombre de tokens image : une 896×896 → 64×64 patches → **1 024 tokens** après merge 2×2. Le coût
prefill est réel (~notre chantier « prefill lent » s'applique doublement) → commencer avec des
images redimensionnées à ~448×448 (256 tokens).

## Ce qui existe déjà (réutilisable tel quel)

- `layernorm` (+ biais) et `quick_gelu` — écrits pour le CLIP text encoder de SD-Turbo.
- `attention_full` (non causale, kvLen indépendant) — le ViT en a besoin partout.
- Matmuls f16/q8/q4 (+ biais), résidence GPU des poids, streaming BRIK/GGUF par plages.
- `conv2d_direct` (TAESD) — utilisable pour le patch-embedding (conv 14×14 stride 14), ou
  alternative unfold+matmul (un patch = une ligne de 14·14·3 = 588 valeurs).
- `embed()` (gather des lignes de token_embd) : le forward LLM passe déjà par une matrice
  d'embeddings explicite → **point d'injection naturel** pour les embeddings image.
- Harnais de validation : selfValidate (kernel par kernel) + Playwright/Chrome réel (bout-en-bout).

## Les vrais chantiers

1. **RoPE 2D du ViT** (positions (h, w) par patch) — nouveau kernel WGSL, proche du `rope` actuel.
2. **M-RoPE du LLM** (positions 3D temps/hauteur/largeur ; dégénère en RoPE standard sur du texte
   pur) — le plus délicat : il touche le chemin chaud du chat. À gater par archi (`qwen2vl`) pour
   ne RIEN changer aux modèles texte existants.
3. **Prefill par embeddings** : `logitsKV(tokens, …)` doit accepter `(embeddings | tokens)` pour
   les lignes image. Refactor contenu : le gather actuel produit déjà une matrice f32 → accepter
   une matrice fournie revient à court-circuiter `embed()` sur une plage de lignes.
4. **Pré-traitement image** : resize/normalisation (mean/std CLIP) via canvas + un kernel trivial,
   côté client, zéro réseau — cohérent avec la promesse produit.
5. **UI** : pièce jointe image dans le composer (le système d'attachments texte existe — ajouter
   un type image avec vignette), et l'entrée catalogue passe de « Bientôt » à chargeable.

## Jalons proposés

- **V1 — lire le mmproj** : parser le `mmproj-*.gguf` (métadonnées + tenseurs ViT/merger), tableau
  des shapes dans la console. *Aucun risque, valide la chaîne de bout en bout.*
- **V2 — forward ViT** : kernels manquants (RoPE 2D, patch-embed) + selfValidate ; sortie ViT
  comparée à une référence (transformers Python offline, tolérance f16) via le harnais Playwright.
- **V3 — injection LLM** : merger + insertion des embeddings + M-RoPE gaté `qwen2vl` ; test :
  une image simple, réponse cohérente (« que vois-tu ? »).
- **V4 — produit** : UI pièce jointe, redimensionnement auto, entrée catalogue, BRIK du mmproj,
  garde-fous VRAM (refus propre sur GPU trop petit).

## Risques identifiés

- **M-RoPE dans le chemin chaud** : le moindre écart de position casse la cohérence — d'où le
  gating par archi + selfValidate dédié (leçons top_k / attention décodage).
- **Prefill lent** (10 t/s mobile, ~3-4 t/s×PC aujourd'hui multi-tokens) : 256-1 024 tokens image
  à préfiller → le chantier « perf prefill » devient prérequis d'une expérience agréable.
- **Deux fichiers à charger** (LLM + mmproj) : UX de chargement à concevoir (un bouton, deux
  streams, un seul état de progression).
