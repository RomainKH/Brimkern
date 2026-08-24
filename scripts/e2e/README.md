# Bancs de mesure (vrai navigateur, build de production)

Ce dossier existe parce qu'il manquait. Les chiffres publiés — sur la landing, dans `/vs-webllm`,
dans le README, dans la ROADMAP — viennent tous de bancs Playwright qui, jusqu'au 2026-08-15,
vivaient dans des dossiers temporaires de session : réécrits à chaque fois, perdus ensuite, et
impossibles à rejouer par quiconque. `/vs-webllm` affirmait même « le harnais de mesure est dans le
dépôt » ; ce n'était pas vrai. Ça l'est.

## Prérequis

Les bancs pilotent un **vrai Chrome** contre un **build de production** — jamais le dev server, dont
les temps ne veulent rien dire.

```bash
npm run build && npx next start -p 3618     # dans un terminal
npm i -g playwright-core                     # une fois (non listé en dépendance : outil, pas produit)
npx playwright install chromium              # le binaire, si absent
```

`chrome.mjs` retrouve seul le binaire installé : son dossier porte un numéro de build
(`chromium-1223`, `chromium-1228`…) qui change aux mises à jour, et un chemin en dur casse ce
jour-là avec un message qui n'explique rien.

## Les bancs

### `bench-decode.mjs` — le juge d'une optimisation

Compare le débit AVANT/APRÈS un kill-switch, en quatre bras **alternés** (avant/après/avant/après) :
sans l'alternance, le premier bras profite d'un GPU froid et le dernier d'un cache chaud, et l'on
mesure la machine au lieu du code.

```bash
node scripts/e2e/bench-decode.mjs --flag=rmsvec --model=Qwen/Qwen3-0.6B-GGUF --shots=3
node scripts/e2e/bench-decode.mjs --flag=topkpar --model=romainkh14/LFM2.5-230M_BRIK --shots=4
BENCHLOG=res.log node scripts/e2e/bench-decode.mjs --flag=gemv   # suivre l'avancement en direct
```

⚠️ **Lire la variance avant de conclure.** Le banc affiche chaque tir, pas seulement la médiane :
sur un petit modèle ils s'étalent facilement de ±15 %, et un écart de 2 % entre les bras ne veut
alors rien dire. C'est ce qui a évité de publier un faux gain pour `top_k` le 2026-08-15.

### `profile-decode.mjs` — où part le temps GPU

Relève le budget par passe (`?gpuprofile=1`) sur trois générations réelles.

```bash
node scripts/e2e/profile-decode.mjs romainkh14/LFM2.5-230M_BRIK
```

⚠️ Ce rapport classe « ce qui coûte quand on ne peut pas recouvrir » : poser des horodatages autour
d'une passe l'isole, donc les passes **courtes et nombreuses** y sont surestimées. Excellent pour
choisir quoi regarder, trompeur pour annoncer un pourcentage — `top_k` y pesait 10,1 % et n'a rien
rapporté une fois corrigé. Le juge reste `bench-decode.mjs`.

### `profile-prefill.mjs` — où part le temps GPU du PREFILL

Même instrument que `profile-decode.mjs`, braqué sur l'autre phase : la « lecture du prompt », celle
qui fait attendre avant le premier mot. Deux précautions le distinguent, parce qu'un chat passe
l'essentiel de son temps à décoder et qu'un rapport brut noie le prefill dedans : compteurs remis à
zéro après un échange de chauffe, et lecture **par nom de kernel** (`attention_prefill` /
`matmul_t_q8_shared` = prefill ; `attention_decode` / `matmul_t_q8_vec` = décodage).

```bash
node scripts/e2e/profile-prefill.mjs Qwen/Qwen3-0.6B-GGUF                  # le défaut
node scripts/e2e/profile-prefill.mjs Qwen/Qwen3-0.6B-GGUF '&attnprefill=0' # le bras témoin
```

Il affiche la **longueur de prompt réellement vue par le moteur** à chaque tour. Ce n'est pas
décoratif : c'est la preuve qu'on mesure bien un prefill long. Un prompt court ne dit rien de cette
phase — l'attention y croît en O(n²) quand le reste croît en O(n).

### `flops.mjs` — le plafond de CALCUL de la machine

Le pendant de `bandwidth.mjs` pour le prefill (compute-bound là où le décodage est memory-bound).
Mesure le plafond FMA pur, puis des MAQUETTES de boucles internes de GEMM (rapport lectures
partagées/FMA) — pour choisir la structure d'un kernel AVANT de l'écrire.

```bash
node scripts/e2e/flops.mjs    # autonome : sert sa propre page, n'exige pas next start
```

Relevé du 2026-08-18 (Apple, metal-3) : plafond FMA **2825 GFLOP/s** ; la boucle interne des
GEMM v1 (6 lectures scalaires / 8 FMA) plafonne à **973** — exactement le débit des kernels réels —
et le bloc 4×8 en vec4 à **1683**. C'est ce relevé qui a dicté `matmul_t_q8/q4_shared2`.
⚠️ Une maquette dit le plafond d'une STRUCTURE, pas le gain d'un kernel : la première v2 écrite sur
la foi de la maquette perdait ses écritures de composantes vec4 à indice dynamique (Metal les jette
en silence), et la seconde (forme dot-produit) rendait ×0,91 — seule la troisième (produit
extérieur + transposition en registres) a tenu la promesse. Le juge reste `bench-decode.mjs`.

### `validate-kernels.mjs` — la boucle courte quand on écrit un kernel

Fait tourner `window.__selfValidate()` : exactement la validation que subit tout chargement de
modèle (chaque kernel contre sa référence CPU), mais **sans télécharger de modèle** — quelques
secondes.

```bash
node scripts/e2e/validate-kernels.mjs
```

Il rend aussi l'état des **gates non bloquants**. C'est le piège à surveiller : un kernel faux ne
fait pas échouer le chargement, il **disparaît** au profit d'un repli plus lent. Un gate à `false`
est donc un échec, même quand la ligne de sortie dit « OK » — le script sort en code 1 dans ce cas.

### `rope-family.mjs` — non-régression des familles à RoPE « NORM »

Charge Llama 3.2, Ministral 3 et SmolLM3, pose une question factuelle, et vérifie la réponse. Un
RoPE mal apparié ne se trompe pas « un peu » : il part en charabia fluide. Une réponse juste est
donc un test discriminant.

```bash
node scripts/e2e/rope-family.mjs ''             # le défaut du build
node scripts/e2e/rope-family.mjs '&ropenorm=0'  # l'ancien chemin, pour l'A/B
```

### `bench-classify.mjs` — classify()/generate() de la classe pure (résident vs JS)

Le premier banc de perf des API « classe pure » (`Lfm2Model.classify`/`generateResident`), mesuré
sur la démo `/local-ai` : bras ALTERNÉS par rechargement de page, `?lfm2resident=0` en témoin, et la
SORTIE vérifiée à chaque tir (« Positive » au sentiment, l'email exact à l'extraction) — une
accélération qui change la réponse n'est pas une accélération, et le banc échoue sur une sortie
fausse, pas sur un ratio décevant.

```bash
node scripts/e2e/bench-classify.mjs 3 --rounds=2   # 3 tirs mesurés par cas, 2 rounds par bras
```

⚠️ Sa résolution est le pas de sondage (200 ms) : un chemin plus rapide que ça rend « ≤0,2 s », et
le ratio affiché est un MINORANT. Relevé du 2026-08-24 (LFM2.5 230M q4) : classify 4,2 s → ≤0,2 s
(×20,6), extraction 2,8 s → ≤0,2 s (×13,8).

## Écrire un banc : ce que ces trois-là ont appris

- **Viser le bon dialogue.** Le panneau Stockage ET la confirmation portent tous deux
  `role="dialog"` : un sélecteur trop large reclique le bouton d'ouverture et l'on conclut qu'une
  action « ne part pas ». Cibler celui qui porte `aria-modal="true"`.
- **Attendre l'état POSÉ pour auditer.** Un audit d'accessibilité lancé pendant qu'un élément finit
  son fondu mesure une couleur mélangée et invente des violations de contraste.
- **Une seule page à la fois.** Deux pages ouvertes = deux devices WebGPU sur le même GPU : la
  génération s'enlise sans erreur.
- **Ne jamais faire dépendre le verdict d'un compteur de messages** sans vérifier qu'il a bougé : une
  conversation restaurée fausse le compte, et le tir passe pour « abandonné ».
- **« Une génération est finie » ne se lit pas sur le dernier message.** Le tour précédent porte déjà
  son « Total : » en pied : guetter ce motif seul rend la main **immédiatement après l'envoi**. Le
  banc file alors avant même le prefill et sort un rapport sans la moindre passe de prefill — qu'on
  lit comme « ce kernel n'est jamais dispatché ». Compter les messages AVANT l'envoi, attendre le
  (n+1)-ième. (Coût de la leçon : 2026-08-16, un faux diagnostic sur `attention_prefill`.)
- **Adapter le prompt à la phase qu'on mesure.** `--long=1` sur `bench-decode.mjs` substitue un pavé
  de ~500 tokens : sur une question courte, la ligne « PREFILL » ne bouge pas quel que soit le
  kernel, et un banc court aurait classé « sans gain » un kernel qui divise le prefill par dix.
- **Un modèle « thinking » fait expirer les tirs, pas échouer le moteur.** DeepSeek-R1 et Qwen3
  dépensent un budget `<think>` (défaut `medium` = 700 tokens) qui s'AJOUTE à `maxTokens` : sur un 7B
  à ~10 t/s, le tir frôle les 300 s d'attente du banc, et rend « tir abandonné (aucune réponse) » —
  un échec de patience que rien ne distingue d'une panne. `--think=off` sur `bench-decode.mjs`
  préremplit un `<think></think>` vide ; le prefill, lui, est inchangé. (2026-08-16, sur le 7B.)
- **Les verrous `Singleton*` du profil Chrome survivent à un banc interrompu.** Ils pointent alors un
  PID mort, et le lancement suivant s'ouvre sur un profil qui n'est pas celui qu'on croit — donc sans
  le cache du modèle (~1 Go). Le banc meurt sur un `waitForFunction: Timeout` qui accuse le moteur
  alors que le coupable est un fichier de verrou. `chrome.mjs` les nettoie à l'import.
