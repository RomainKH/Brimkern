<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BRIMKERN — règles du dépôt

Moteur d'inférence WebGPU **dans l'onglet** : le navigateur lit un GGUF mono-fichier du Hub ou un
`.brik` par plages HTTP, et génère du texte / des images / des clips sans serveur. Trois surfaces :
le site (`src/app`), le moteur (`src/lib/webgpu`, kernels WGSL écrits à la main), le SDK embarquable
(`src/sdk` → `packages/sdk`, publié sur npm et servi en `/sdk.js`).

**`docs/ROADMAP.md` est la mémoire du projet** — chaque chantier y est daté avec ses mesures, ses
fausses pistes et ses pièges. Le lire sur le sujet qu'on touche évite de refaire une mesure déjà
faite ou de rouvrir une piste déjà fermée. Le tenir à jour fait partie du travail.

## 1. Une mesure se fait dans un vrai Chrome, sur un build de production

Jamais le dev server : ses temps ne veulent rien dire. Les bancs vivent dans `scripts/e2e/`
(`README.md` sur place) et pilotent Chrome via `playwright-core`.

```bash
npm run build && npx next start -p 3618
node scripts/e2e/bench-decode.mjs --flag=<killswitch> --model=<repo>
```

- ⚠️ **Le `next start` se fait tuer par la pression mémoire**, y compris dans la tâche du banc :
  superviseur + battement de cœur obligatoires sur toute série longue, sinon le banc mesure un
  serveur mort.
- ⚠️ **Bras ALTERNÉS** (avant/après/avant/après) : sans alternance on mesure le GPU froid du premier
  bras et le cache chaud du dernier.
- ⚠️ **Lire la variance avant de conclure.** Les tirs s'étalent de ±15 % sur un petit modèle ; un
  écart de 2 % entre deux bras ne dit rien. Les bancs SDK (`sdk-tools`, `sdk-rag`) perdent ~1 cas par
  tirage : arbitrer sur un **bundle figé** avant d'accuser un changement.
- ⚠️ **Le profileur GPU surestime les passes courtes et nombreuses** (poser des horodatages autour
  d'une passe l'isole et empêche le recouvrement — jusqu'à ×70 sur `silu`). Il sert à choisir quoi
  regarder, pas à annoncer un pourcentage ; le juge reste l'A/B bout en bout.

## 2. Tout kernel WGSL : `selfValidate` + repli + kill-switch

Trois éléments, sans exception (motif dans `src/lib/webgpu/kernels.ts`) :

1. une **référence CPU** exécutée au démarrage sur des formes réelles, qui pose un gate (`…Ok`) ;
2. un **repli** vers le kernel précédent quand le gate tombe — jamais une erreur à l'écran ;
3. un **kill-switch URL** (`?gemv=0`, `?attnprefill=0`, `?convtq=0`…) qui donne le bras témoin du banc.

⚠️ Les bugs de **taille de sous-groupe** sont invisibles sur un Mac (32/32) : le gate `selfValidate`
est la seule protection des GPU où la taille diffère. Ne jamais le contourner.
⚠️ Quand un nouveau kernel prend la forme que les tests existants utilisaient, ces tests passent sur
le NOUVEAU chemin sans le dire : forcer le gate à `false` dans l'ancien test et en écrire un dédié.

## 3. Toute chaîne d'interface est bilingue

`const t = useT(); t('English', 'Français')` — l'**anglais est la version canonique** (`/`), le
français vit sous `/fr`. Les données figées comptent aussi : un libellé de preset ou une taille
formatée en français dans l'UI anglaise est un bug (`{ en, fr }`, `fmtModelSize`). Toute page
nouvelle : métadonnées propres, `canonical` + `languages` répétés (les métadonnées de page ÉCRASENT
celles du layout), et 0 violation axe-core.
⚠️ Le banc axe-core et le banc de landing ne sont PAS dans `scripts/e2e/` : ils ont vécu en
dossier de session et sont à réécrire au premier besoin (le reste des bancs, lui, est versionné).

## 4. Ne jamais annoncer un chiffre qu'on n'a pas mesuré

La landing, `/vs-webllm`, le README, les cartes de modèle et la ROADMAP citent tous des chiffres de
bancs rejouables. Un gain non mesuré ne se publie pas, et une fonctionnalité annoncée doit exister
dans le bundle publié — pas seulement dans le dépôt. Une note d'infrastructure (DNS, registre npm,
fichier en ligne) se **vérifie** avant d'être répétée : elle ne casse rien en devenant fausse, donc
rien ne la corrige. Deux `curl` suffisent.

## 5. Git

- Commits **en français**, par étapes, message qui dit le DIAGNOSTIC et la mesure — pas la liste des
  fichiers touchés.
- **Aucun trailer d'attribution** (`Co-Authored-By` et assimilés) : Romain reste seul auteur.
- **Ne JAMAIS `git push`** : commits locaux uniquement, Romain pousse lui-même.

## 6. La distribution est triple, et elle se déplace ensemble

Un même SDK part par trois canaux : **npm** (`brimkern`), **`/sdk.js`** servi par le site (le CDN de
fait des intégrateurs), et les **versions épinglées dans la doc** (`src/app/docs/sdk`). Publier l'un
sans les autres crée un `npm i brimkern` qui ne contient pas ce que la doc décrit. Vérifier les
trois après chaque version — le registre npm se lit sur `registry.npmjs.org`, et la preuve d'une
publication est un `PUT 200` dans `~/.npm/_logs`, pas un `npm view` (qui peut être périmé). La 2FA du
compte exige un passage navigateur à chaque `npm publish`.
