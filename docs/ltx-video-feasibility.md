# LTX-Video 2B distillé dans l'onglet — étude de faisabilité (2026-10-08)

Pourquoi : AnimateDiff-Lightning sur SD 1.5 plafonne (256 px, aspect « peinture », mouvement faible) —
même corrigé, notre rendu égale la référence diffusers et Romain le juge « horrible » (ROADMAP § 27).
LTX-Video est un DiT vidéo récent : c'est le seul saut de qualité. Sa contrainte est le POIDS.

## Ce que contient le checkpoint (en-tête lu par Range, rien téléchargé)

`Lightricks/LTX-Video` → `ltxv-2b-0.9.8-distilled.safetensors`, 6,34 Go, tout en bf16 :

| composant | paramètres | bf16 | utile en texte → vidéo |
|---|---|---|---|
| transformer (Transformer3DModel, 28 couches, d 2048, 32 têtes de 64, RoPE 3D, qk RMSNorm) | 1 923 M | 3,85 Go | oui |
| VAE encodeur | 694 M | 1,39 Go | **non** (image → vidéo seulement) |
| VAE décodeur (CausalVideoAutoencoder, convs 3D, conditionné en temps) | 553 M | 1,11 Go | oui |
| encodeur de texte T5 v1.1 XXL (dépôt `text_encoder`, PixArt) | ~4 760 M | 19 Go fp32 | oui — **le poste dominant** |

Pipeline officiel distillé (`configs/ltxv-2b-0.9.8-distilled.yaml`) : passe 1 en 7 pas à ×0,67 de la
résolution, upscaler spatial latent (0,5 Go), passe 2 en 3 pas ; guidance 1 (pas de CFG → une seule
évaluation du DiT par pas).

## Budget de poids — ce qu'on peut retirer

| levier | gain | risque |
|---|---|---|
| Ne pas embarquer l'encodeur du VAE | −1,39 Go | aucun en texte → vidéo |
| DiT en int4 (q4web, 0,625 o/param) | 3,85 → **1,20 Go** | qualité à mesurer (int8 = 2,04 Go en repli) |
| T5-XXL en int4 | 19 → **~2,97 Go** | qualité des embeddings à mesurer ; int3 (~2,4 Go) à tenter |
| Décodeur **Turbo-VAED-LTX** (hustvl, MIT, 169 Mo fp32) au lieu du décodeur d'origine | 1,11 → **~0,09 Go** (f16) | distillé depuis le VAE 0.9.0 : compatibilité avec les latents 0.9.8 À VÉRIFIER |
| Une seule passe (pas d'upscaler) | −0,5 Go et la passe 2 | qualité à mesurer |
| Vocabulaire T5 taillé (EN/FR, comme Qwen3-0.6B § 22) | ~−0,05 Go | négligeable — le T5 pèse par ses couches |

**Estimation : ~4,3 Go** (DiT q4 1,20 + T5 q4 2,97 + Turbo-VAED 0,09), **~3,7 Go** si le T5 tient en
int3. Pour mémoire, AnimateDiff : 1,54 Go. Le T5 fait 70 % du total : c'est là que se joue le poids.
Piste plus lourde, non chiffrée : distiller un encodeur de texte plus petit qui imite les sorties du
T5 (projet d'entraînement, hors périmètre).

## Calcul — ordre de grandeur, NON MESURÉ

- Latent : compression 32 × 32 en espace, 8 en temps, patch 1. 512 × 320 × 49 images →
  16 × 10 × 7 = **1 120 jetons** ; 768 × 512 × 49 → 2 688.
- DiT : ≈ 2 × 1,92 G × 1 120 ≈ 4,3 TFLOP par pas (+ attention ≈ 0,3). 7 pas ≈ 32 TFLOP → **~20 s** au
  débit de nos GEMM (~1,5 TFLOP/s mesurés, § 12). C'est un modèle de matmuls : notre point fort.
- T5 : 4,76 G × ≤ 128 jetons ≈ 1,2 TFLOP — < 1 s de calcul, mais 3 Go à mettre en mémoire.
- Décodeur : inconnu tant que Turbo-VAED n'est pas porté ; le décodeur d'origine (553 M, convs 3D en
  pleine résolution) serait le goulot.
- Mémoire GPU de pointe : DiT q4 1,2 Go + activations modestes ; le T5 peut être déchargé après
  l'encodage du prompt.

## Licence — à valider par Romain

« LTXV Open Weights License 0.X » (dans l'en-tête du checkpoint) : usage, modification et
redistribution des dérivés AUTORISÉS (y compris servir le modèle à des tiers), à condition de joindre
la licence, de signaler les fichiers modifiés, de garder les mentions, et d'**inclure les
restrictions d'usage (Annexe A) dans nos propres conditions**. **Les entités de 10 M$ de chiffre
d'affaires annuel ou plus doivent obtenir une licence commerciale payante** — ce qui peut concerner
des intégrateurs du SDK. Turbo-VAED : MIT. T5 v1.1 : Apache 2.0.

## Plan — chaque étape mesurée avant la suivante

1. **Qualité hors navigateur (CPU, diffusers)** : la référence bf16, puis la même graine avec DiT
   int4 / T5 int4 / T5 int3 simulés (quantification q4web à l'identique) et Turbo-VAED à la place du
   décodeur. Images côte à côte + écarts. C'est ici qu'on fixe le budget réel — sans rien porter.
2. BRIK : DiT, T5, décodeur au tier retenu ; hébergement HF avec licence et mention de modification.
3. Moteur : T5 encodeur (même famille de couches que nos LLM, relative position bias en plus), DiT
   (RoPE 3D, AdaLN, cross-attention), scheduler flow-matching, décodeur ; chaque brique contre
   l'oracle de l'étape 1.
4. Intégration au chat, A/B de temps, captures pour Romain.

## Étape 1 — MESURÉE (2026-10-08, CPU, diffusers 0.35.1, mêmes poids que ceux qu'on servirait)

Pipeline : `LTXPipeline`, calendrier distillé officiel posé tel quel (sigmas 1,0 → 0,725, 7 pas, une
seule passe, pas d'upscaler), guidance 1, 512 × 320 × 49 images, graine 42, deux prompts (plage au
coucher du soleil, chat dans un jardin). Quantification SIMULÉE à l'identique de nos formats
(q4web/q3web asymétriques, q8web symétrique, groupes de 32, échelles f16) — `quant.py`.

- **Pleine précision** : vagues qui déferlent, chat qui marche, 49 images cohérentes — le saut de
  qualité attendu face à AnimateDiff. CPU fp32 : DiT 32-66 s, décodeur d'origine 30-45 s.
- **Turbo-VAED-LTX : INUTILISABLE** — bruit pur sur les latents 0.9.8 (PSNR 10 dB face au décodeur
  d'origine) : distillé pour le VAE 0.9.0, sans conditionnement temporel. Écarté.
- **T5** (cosinus des plongements par jeton vs pleine précision) : int8 0,9989 ; int4 0,960 ; int3
  0,951. Un jeton tombe à ~0,2 en int4 quelles que soient les couches gardées en int8 (wo, attention,
  couches extrêmes) — plongement de référence quasi nul, cosinus non significatif ; la vidéo tranche.
- **DiT int4 + T5 int4 + décodeur int8** : vidéos aussi propres que la pleine précision (composition
  légèrement différente → PSNR 12-14 dB, normal en diffusion). **~4,9 Go.**
- **DiT int4 + T5 int3 + décodeur int4** : toujours propres sur les deux prompts. **~4,1 Go**
  (DiT 1,20 + T5 2,58 dont 0,26 d'embeddings f16 + décodeur 0,35). Embeddings T5 en int8 et vocabulaire
  taillé : ~3,9 Go.

Conséquence : le budget de poids n'est PAS le verrou (~4 Go, 2,6× AnimateDiff, pour un tout autre
rendu). Le verrou est le TEMPS : sur ce CPU, ~60 s pour 2 s de vidéo à 24 im/s. En WebGPU, le DiT
(matmuls) devrait faire mieux que le CPU ; le décodeur (convolutions 3D en pleine résolution) est
l'inconnue — à mesurer dès son portage, c'est lui qui dira si le produit tient.

## Étape 3a — décodeur PORTÉ (2026-10-11)

- 4 kernels + `video/ltxDecoder.ts` ; AdaLN précalculé pour t = 0,05 (embedder non porté).
- Exact contre PyTorch sur les poids tels que servis : vidéo 1,4·10⁻³ max / 8·10⁻⁵ moyen (±2,2).
- **49 images 512×320 : 8,4 s** (deux tirs), ~1,2 TFLOP/s — le CPU fp32 mettait 17 à 30 s. Le verrou
  « décodeur » est levé ; reste le DiT (~32 TFLOP en 7 pas) et le T5.
- ⚠️ Piège trouvé en route : le codec BRIK aplatissait les échelles f16 sous-normales (poids < 0,0078
  par groupe) → groupes entiers à zéro. Corrigé dans `f16.ts`, régression dans `q8web.test.ts`.
  Tout modèle à petits poids quantifié AVANT ce correctif est à reconstruire.
- ⚠️ Deux pièges d'oracle : (1) comparer au f16 mélange erreur de portage et de quantification — la
  référence doit être calculée sur les poids DÉQUANTIFIÉS PAR LE CODEC DU DÉPÔT (dump Node → torch) ;
  (2) `next start` ne sert pas un dossier de `public/` créé après son démarrage (404) : redémarrer.

## Étape 3b — transformeur PORTÉ, première vidéo dans l'onglet (2026-10-11)

- `video/ltxTransformer.ts` : embedder de temps sur CPU (exact), tables RoPE 3D sur CPU (arrondis f32
  émulés : 1,5·10⁻⁵ moyen contre les tables torch), 3 kernels (`rope_ltx`, `ltx_modulate`,
  `ltx_gated_add`) + rmsnorm/attention/gelu existants ; boucle flow-matching Euler sur le calendrier
  distillé (7 sigmas). BRIK `ltx-transformer-light` : 1 251 Mo (q4 1 174 · q8 14 · f16 62), 29 shards.
- Validation contre la référence quantifiée par le codec (dump Node → torch) : proj_in exact, bloc 0
  0,0017 % moyen, sortie 0,6 % moyen / 3,4 % max. Contre le f16 : 10 % — c'est l'amplification du
  bruit q4 sur 28 blocs (PyTorch seul, q4 vs f16 : 10,4 %), pas un bug.
- **Première génération complète dans Chrome** (texte T5 précalculé, graine 42, 512×320×49) : plage
  au coucher du soleil, vague, nuages — `docs/screenshots/ltx-first-generation-2026-10-11.png`.
  Temps : transformeur **46,1 s** (6,4-6,9 s par pas à 1 120 jetons, ≈ 0,65 TFLOP/s — moitié de nos
  GEMM), décodeur 8,9 s, **total 55 s**. Chargement 2 s (cache).
- Tokenizer T5 côté navigateur : `Xenova/t5-v1_1-base` (transformers.js 4.2) = T5Tokenizer Python
  sur les deux prompts, identifiants identiques.
- ⚠️ Un premier banc à 48 jetons donnait 358 ms par forward : à cette taille le temps est dans les
  ~400 dispatches, pas dans les matmuls — ne jamais extrapoler un petit banc.
- Suite : profil par kernel du transformeur ; T5 (porté, oracle prêt, BRIK q4 en construction).

## Étape 4a — profil du transformeur et attention « flash » (2026-10-11)

Profil GPU d'un pas à 1 120 jetons (`__ltxDitBench` sous `?gpuprofile=1`, deux passes chaudes) :
`attention_full_wg` **57 %** (169 tirs, 11,7 s — ~69 ms l'appel, ~150 GFLOP/s), `matmul_t_q4_shared2`
40 % (8,1 s, ~1 TFLOP/s : le plafond connu du GEMM q4), le reste < 3 %. Cause : un workgroup par
(jeton, tête) relit K et V entiers pour chaque jeton — 20 Go de trafic par attention.

`attention_flash64` : un workgroup par bloc de 64 requêtes et par tête, K/V par tuiles de 32 clés en
mémoire partagée (16 Ko, la limite WebGPU par défaut), softmax en ligne. headDim 64 seulement
(SD-Turbo, LTX), gate `attnFlashOk` contre `attention_full_wg` (bords, croisée, GQA, softcap),
kill-switch `?attnflash=0`.
- v1 (tableaux f32 indexés dynamiquement) : attention 11,7 → 5,2 s (×2,2) ; pas 6,5 → ~4,9 s ;
  génération 55 → 46,7 s (décodeur 10,7 s ce tir-là : construction de BRIK en parallèle sur le CPU).
- **Image 512 px (SD-Turbo), bras alternés : 4,05 → 3,54 s (×1,14)** — l'attention y pesait 38 %.
- v2 : tuiles et registres en vec4, déroulage statique généré depuis le template (un tableau local
  indexé dynamiquement part en mémoire locale sur Metal) — en cours de mesure.

Après l'attention, le GEMM q4 porte ~60 % du pas ; au-delà, les leviers sont la résolution par
défaut (384×256×33 : 480 jetons, ~2,2× moins de GEMM et ~3,3× moins de décodeur) et le f16.
