# Optimisation WebGPU/WGSL — recherche & plan d'action

> Recherche menée le 2026-06-25, ancrée sur le code réel de `src/lib/webgpu/{kernels.ts, shaders.ts, model.ts}`.
> Objectif : (1) rendre les calculs plus rapides, (2) charger des modèles plus gros. Chaque piste est
> notée **impact / effort / risque** et indique ce qui doit être **validé en navigateur** (selfValidate),
> puisque WebGPU ne tourne pas en CI/sandbox.

## 1. Où va le temps — le modèle mental (roofline)

Deux régimes très différents, à ne PAS optimiser pareil :

| Phase | Ce qui domine | Borne | Levier principal |
|---|---|---|---|
| **Prefill** (prompt, `m` tokens d'un coup) | les gros matmuls `[m,k]×[n,k]ᵀ` + l'attention O(m²) | **compute** (FLOPs/s) | tiling mémoire partagée, subgroups, occupancy |
| **Decode** (1 token à la fois) | relecture de **tous les poids** par token | **bande passante** (lecture poids) | quantification (q4/q8), poids plus petits |
| **Chargement / gros modèles** | VRAM résidente (poids + KV + projection logits) | **capacité mémoire** | quantif résidente, KV q8, projection q8 |

Conséquence directe : le **decode** ne se gagne pas avec des kernels plus malins (il est déjà bandwidth-bound, q4 est proche de l'optimal) — il se gagne en **réduisant les octets de poids lus**. Le **prefill** se gagne avec du **vrai tiling**. Le **chargement de gros modèles** se gagne en **gardant tout quantifié en VRAM**.

## 2. État actuel des kernels (constats)

- Tous les matmuls : `@workgroup_size(8,8)` = **64 threads**, **1 élément de sortie par invocation**, boucle scalaire sur `k`. Lectures **vec4** (128-bit, coalescé) — bon point.
- Fast paths fusionnés : `matmul_t_q4`, `matmul_t_q8` (déquant en registres, poids gardés 4/8-bit en VRAM), `matmul_t_f16w` (poids f16 via `vec4<f16>`).
- **Tiling lignes (déjà fait cette session)** : `matmul_t_q8_tiled` / `matmul_t_q4_tiled` — 4 tokens/invocation, déquant du poids réutilisé sur les 4 lignes → ~4× moins de trafic poids **au prefill**. C'est du *register tiling* (pas de mémoire partagée).
- Décodage **GPU-resident** : toute la passe avant en **une seule soumission** GPU, KV cache résident, seul le dernier hidden state est relu. Très bon (pas de ping-pong CPU↔GPU).
- **Projection logits** : déquantifiée **une fois en tuiles f32** (`getProjectionTiles`). ⚠️ voir §4.1 — c'est le plus gros poste VRAM caché.

## 3. Gagner sur le PREFILL (compute-bound)

### 3.1 Tiling à mémoire partagée — LE gros levier · impact ★★★ · effort élevé · risque élevé (WGSL non validable hors navigateur)
Le register-tiling actuel (4 lignes) réutilise le poids sur 4 tokens. Un **vrai GEMM tilé** va plus loin : chaque workgroup charge un bloc `TM×TK` d'activations **et** un bloc `TN×TK` de poids (déquantifiés) dans `var<workgroup>` (mémoire partagée on-chip), barrière, puis chaque thread accumule un micro-tile `4×4`. Chaque octet lu en mémoire globale est réutilisé `TILE` fois au lieu de quelques fois.
- Schéma type : tiles `64×64`, workgroup `16×16` (256 threads), chaque thread calcule `4×4` sorties, `TK=16/32`.
- Pour q4/q8 : déquantifier le tile de poids **dans la mémoire partagée** une seule fois (la partie délicate).
- **Gain attendu** : prefill 2-4× sur les grosses couches (ffn surtout). C'est la technique des libs GEMM (cuBLAS-like).
- **Validation** : ajouter un stage `selfValidate` comparant à `matmul_t_q8` sur `m=5,7` (tuiles partielles). Garder l'ancien kernel en repli.

### 3.2 Subgroups — impact ★★ · effort moyen · risque moyen
WebGPU expose `enable subgroups;` (Chrome, feature `"subgroups"`). Utiliser `subgroupAdd()` pour la **réduction du produit scalaire** (au lieu de `acc.x+acc.y+acc.z+acc.w` + sommes manuelles), et des **lectures coopératives** du poids partagées dans le subgroup. Réduit le travail ALU de réduction et améliore la réutilisation.
- À gater sur `adapter.features.has('subgroups')` (sinon fallback). Compiler le kernel subgroup uniquement si dispo (comme `matmul_t_f16w` l'est pour `shader-f16`).
- **Validation** : stage selfValidate + fallback automatique si feature absente.

### 3.3 Taille de workgroup & occupancy — impact ★ · effort faible · risque faible
`8×8 = 64` threads est petit : peu d'occupancy pour cacher la latence mémoire. Tester `16×16 = 256` (ou `16×4` pour les kernels 1-ligne). Mesurable directement via le benchmark intégré. **Le moins risqué, à essayer en premier** (juste changer `@workgroup_size` + le grid).

### 3.4 Fusion d'opérations — impact ★★ · effort moyen · risque moyen
- **Fusionner les 3 projections QKV** (`wq,wk,wv`) en un seul dispatch lisant l'activation normalisée **une fois** (aujourd'hui 3 matmuls relisent `n1`). Surtout utile au prefill.
- **Fusionner RMSNorm → matmul** : normaliser l'activation à la lecture dans le matmul (économise une passe + un aller-retour VRAM).
- **Fusionner residual add** dans la sortie du matmul.
- Chaque fusion = 1 passe en moins = moins de trafic VRAM intermédiaire.

## 4. Charger des modèles PLUS GROS (capacité VRAM)

### 4.1 Projection logits q8-résidente — impact ★★★ · effort moyen · risque moyen · **LE quick-win VRAM**
Aujourd'hui `getProjectionTiles` déquantifie la tête logits en **tuiles f32**. Pour Qwen 0.5B : `vocab 151936 × d 896 × 4 o = 544 Mo` de f32 résident **juste pour la projection** (souvent le plus gros tenseur du modèle, surtout à gros vocabulaire). 
- **Garder la projection en q8 en VRAM** et déquantifier **dans le kernel de projection** (exactement comme `matmul_t_q8`) → **÷4** (544 Mo → 136 Mo). Idem pour l'embed gather (déjà q8 au gather, OK).
- C'est **le** levier pour charger des modèles à gros vocabulaire (Gemma 256k !) sans saturer la VRAM.
- **Validation** : la projection a déjà un chemin q8 au stockage ; il faut un kernel `project_logits_q8` + selfValidate (comparer aux logits f32).

### 4.2 KV cache q8 — déjà fait, étendre · impact ★★
Le KV q8 (÷4 VRAM cache → ~4× contexte) est en place. Piste : KV q4 pour encore plus de contexte (qualité à surveiller), gaté par selfValidate.

### 4.3 Conversion en flux — déjà fait cette session · impact ★★
`convertModelToBrik` traite shard par shard → pic mémoire ≈ une couche. Permet de convertir un gros modèle en navigateur sans OOM. (cf. chunking de `quantizeToBytes` pour le buffer GPU.)

### 4.4 Activations f16 — impact ★ · effort moyen
Garder les activations intermédiaires en f16 (`pack2x16float`) ÷2 leur bande passante + VRAM. Gain modéré (les activations sont petites devant les poids) mais cumulatif sur le prefill long.

## 5. Ce qui « pousse » réellement le gain — résumé tranché

1. **Decode (vitesse perçue token/s)** → octets de poids lus. **q4/q8 = l'essentiel du gain**, déjà là. Marginal au-delà.
2. **Prefill (temps avant 1er token, gros prompts)** → **tiling mémoire partagée** (§3.1) puis **subgroups** (§3.2). C'est là que le code peut encore gagner 2-4×.
3. **Gros modèles chargeables** → **projection logits q8-résidente** (§4.1, quick-win) + KV q8/q4 + conversion en flux.
4. **Hygiène constante** → occupancy (§3.3, gratuit à tester), fusion d'ops (§3.4).

## 6. Ordre d'attaque recommandé (du moins risqué au plus)

1. **§3.3 occupancy** (changer `@workgroup_size`, mesurer au benchmark) — gratuit, immédiat.
2. **§4.1 projection logits q8** — gros gain VRAM, effort moyen, validable (logits vs ref f32).
3. **§3.4 fusion QKV** puis RMSNorm→matmul — gain prefill, validable op par op.
4. **§3.1 tiling mémoire partagée** — le gros morceau, à faire isolé + selfValidate + repli.
5. **§3.2 subgroups** — si la feature est dispo, en complément du tiling.

> ⚠️ Toute modif de kernel doit ajouter son stage `selfValidate` (réf CPU) et garder l'ancien kernel en repli. Je ne peux pas exécuter WebGPU ici : chaque kernel se valide **dans ton navigateur** au chargement (échec selfValidate = modèle ne charge pas = signal clair, jamais de corruption silencieuse).

## Mise à jour 2026-07-21
Décodage résident (une soumission / un readback) étendu à **LFM2** (hybride conv+attention) :
`lfm2LogitsGpu`/`lfm2TopKGpu`, état conv + KV résidents GPU. Chemin **vidéo motion** aussi rendu 100 %
résident (4 kernels `video_*`, zéro readback). Prochains leviers perf : §3.1 tiling mémoire partagée
(inchangé), **UNet vidéo distillé** (la vidéo est compute-bound), et **préfetch parallèle des tenseurs**
dans `loadBrikStream` (aujourd'hui lecture séquentielle) pour réduire le temps-à-prêt.
