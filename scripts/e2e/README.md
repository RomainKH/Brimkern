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

### `rope-family.mjs` — non-régression des familles à RoPE « NORM »

Charge Llama 3.2, Ministral 3 et SmolLM3, pose une question factuelle, et vérifie la réponse. Un
RoPE mal apparié ne se trompe pas « un peu » : il part en charabia fluide. Une réponse juste est
donc un test discriminant.

```bash
node scripts/e2e/rope-family.mjs ''             # le défaut du build
node scripts/e2e/rope-family.mjs '&ropenorm=0'  # l'ancien chemin, pour l'A/B
```

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
