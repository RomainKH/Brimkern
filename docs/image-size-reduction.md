# Alléger la génération d'image : 1,95 Go → objectif ~600 Mo

*Étude du 2026-07-16 — le téléchargement actuel (UNet fp16 1,7 Go + CLIP fp16 ~250 Mo + TAESD
~5 Mo) est le premier frein à l'usage du pipeline image.*

## L'observation qui change tout

Le moteur **exécute déjà l'UNet et le CLIP en int8** (q8web, quantifiés sur le GPU au chargement,
résidents). On télécharge donc du fp16 pour en jeter la moitié à l'arrivée, à chaque session non
cachée. Pré-quantifier hors-ligne et servir les codes q8 directement = **téléchargement ÷2 à
qualité STRICTEMENT identique** (mêmes codes que ceux que le GPU fabrique aujourd'hui).

## Plan par étapes

### Étape 1 — Servir du q8 pré-quantifié, streamé (÷2, zéro risque)
- Script de build (pattern `build-mobile-brik.cjs`) : safetensors fp16 → conteneur BRIK q8web
  (codec CPU `quantizeQ8` déjà écrit et testé en Node). UNet ~895 Mo, CLIP ~130 Mo.
- Le chargeur image lit le BRIK au lieu des safetensors → on hérite GRATUITEMENT de toute
  l'infra chat : streaming par plages, Cache API, reprise, préchargement possible, et plus de
  quantification au chargement (démarrage plus rapide).
- Hébergement : même repo HF que le BRIK mobile (Range vérifié sur leur CDN).
- **Total après étape 1 : ~1,03 Go** (au lieu de 1,95).

### Étape 2 — Tier mixte q4/q8 pour l'UNet (~ -300 Mo, à valider)
- Réutiliser la méthodo de l'A/B LLM (overrides par famille de tenseurs, harnais Playwright +
  vrai Chrome, grille d'images de référence) pour trouver quelles familles tolèrent l'int4 :
  candidats = grosses convs des ResBlocks ; à protéger = attention, time-embedding, in/out.
- Nécessite le kernel conv2d_direct_q4 (il n'existe qu'en q8) — modeste, même gabarit.
- **Cible réaliste : ~550-650 Mo** si les convs passent en q4.

### Étape 3 — Changer de modèle : UNet distillé (÷5, qualité à évaluer)
- **BK-SDM-Tiny / SDXS-512** : UNets SD distillés (~320 M params → ~330 Mo q8, ~250 Mo mixte),
  même architecture → mêmes kernels, shapes différentes. 1-step possible (SDXS).
- Trade-off qualité réel : à évaluer sur notre grille avant de s'engager. Pourrait devenir le
  modèle « mobile » de l'image, SD-Turbo restant le tier desktop.

### Piste long terme — DiT plutôt qu'UNet (« exploiter nos WGSL »)
Les modèles de diffusion transformer (DiT — ex. Sana 0.6B + DC-AE) sont faits de matmuls +
attention : exactement les kernels où notre moteur est déjà bon (et qu'on optimise pour le chat),
au lieu des convolutions spécifiques à l'UNet. Portage significatif (nouvelle archi + autoencodeur
+ text encoder) — à considérer quand le catalogue image s'élargira, pas pour réduire les octets
demain.

### Écarté (pour l'instant)
- **Compression transport** (Brotli/zstd sur les codes) : ~5-10 % sur des poids quantifiés,
  complexité serveur/décodage pour un gain marginal — l'étape 2 rapporte 30× plus.
- **f16 → rien à faire côté format** : le problème est le nombre d'octets, pas leur encodage.

## Ordre recommandé

Étape 1 seule vaut le coup immédiatement (÷2, zéro risque, infra existante). Étape 2 ensuite,
avec la même discipline d'A/B que le mixte LLM. Étape 3 quand on voudra l'image sur mobile.
