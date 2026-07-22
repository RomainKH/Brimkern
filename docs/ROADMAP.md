# Roadmap — la suite

État au 2026-07-21, après la session « release ». Priorités indicatives (P1 = prochain).
Règle repo : tout kernel WGSL = `selfValidate` (réf CPU) + repli + kill-switch URL ; chaîne UI = `t('EN','FR')` ;
commits par étapes en français ; valider chaque changement par une vraie réponse en Chrome (harnais Playwright,
build prod port dédié, jamais le dev server).

## 0. Sortie publique (en cours)
- [ ] Pointer le sous-domaine `brimkern.romainkhanoyan.fr` (DNS + hébergeur) — le code SEO/SDK y pointe déjà.
- [ ] Push + squash de `main` (commandes dans la conversation) puis repo **public**.
- [ ] Décider licence LFM 1.0 (poids LFM2.5) vs alternative Apache pour le défaut mobile.

## 1. Moteur (v2, texte)
- **P1 — RWKV-7 résident.** Même POC-gel `forwardToken` que LFM2 (glu JS + un matmul/projection → ~100
  readbacks/token). Porter à l'identique (miroir de `lfm2LogitsGpu`/`decodeTopKQ8`, état WKV résident GPU).
- **P2 — préfetch parallèle des tenseurs** dans `loadBrikStream` (lecture séquentielle aujourd'hui) →
  réduit le temps-à-prêt indépendamment de la chaleur du cache CDN.
- **P3 — tiling mémoire partagée** des matmuls (docs/perf-webgpu.md §3.1) : le gros gain prefill restant.
- classify()/generate() SDK sur le chemin résident (aujourd'hui `generate()` = forwardToken JS ; le SDK
  chat utilise déjà `generateResident`).

## 2. SDK embarquable (produit)
- **P1 — servir `sdk.js` depuis `brimkern.romainkhanoyan.fr`** (même origine) + doc d'intégration.
- **P1 — modèle ~60 Mo web-native** (RWKV-7 0.1B q3/q4, état constant ~1,2 Mo) = la vraie cible widget
  C'est LE challenge produit + le challenge de base du `.brik`.
- **P2 — config avancée** : document de connaissance (RAG léger), outils (calc/date déjà locaux), skills.
- Widget : thème clair/sombre auto, position/taille configurables, i18n des libellés.

## 3. Vidéo
- **P1 — UNet distillé** (LCM / pruné SD1.5, ou SDXS-motion) = le vrai levier de vitesse (compute-bound ;
  le batching de frames est FLOP-neutre, inutile). Cible : ÷2-3 le temps de génération.
- **P2 — onglet vidéo produit** dans le chat (pattern imageGen : state + loadVideoModel + Message.video +
  rendu ChatMessages + duty par défaut).
- **P3 — clips plus longs / plus fluides** : interpolation de frames (RIFE) ou chaînage fenêtre glissante
  AnimateDiff (dépasser les 32 frames uniques du pos_embed).
- Upload HF des 3 BRIK vidéo (fait) ; mesurer SDXS vs SD-Turbo.

## 4. Modèles
- **60 Mo mobile** : compression/découpe (le vrai challenge `.brik`) — pas d'équivalent Apache ≤200 Mo
  aujourd'hui ; repli mesuré G1a 0.4B 304 Mo.
- Nouvelles archis (docs/next-models.md) : SmolLM3 (reste le NoPE), Phi-4-mini (LongRoPE), Gemma 3 (SWA).
- Qwen3.5 = DeltaNet (chantier à part).

## 5. Vision
- **BRIK mmproj** (chargement par-tenseur ~11 min aujourd'hui = priorité) ; retest UI 📎 desktop.

## 6. Dette / à surveiller
- Précision persistée d'un modèle précédent requantifie silencieusement un q4 natif en q8 → remettre au
  natif au changement de modèle.
- i18n : quelques libellés du panneau Stockage restent en FR quand l'UI est en EN (buckets de cache).
- Le chemin per-op GPU de l'UNet image est mort en prod (résident only) — nettoyable.
