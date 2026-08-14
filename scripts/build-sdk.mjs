// Build du SDK embarquable. Trois sorties, une seule source (src/sdk/index.ts) :
//
//   public/sdk.js                          IIFE minifié — la balise <script> de la doc (« latest »)
//   public/sdk-<version>.js                la MÊME chose, figée : un intégrateur peut épingler une
//                                          version et ne pas voir son widget changer sous ses pieds
//   packages/sdk/dist/brimkern.iife.js     l'IIFE pour unpkg/jsDelivr
//   packages/sdk/dist/brimkern.mjs         ESM, pour `import { embed } from 'brimkern'`
//   packages/sdk/dist/index.d.ts           les types, ÉMIS depuis le source (jamais écrits à la
//                                          main : des types recopiés dérivent du code au 2e commit)
//
// transformers.js reste EXTERNE (import CDN dynamique à l'exécution, repli seulement) : il n'a pas
// à peser dans un bundle que des sites tiers chargent.
// Usage : node scripts/build-sdk.mjs
import * as esbuild from 'esbuild';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Tous les chemins sont ancrés sur la RACINE du dépôt, déduite de l'emplacement de ce fichier —
// jamais sur le dossier courant. `prepublishOnly` s'exécute depuis packages/sdk : avec des chemins
// relatifs, la publication échouait sur « ENOENT packages/sdk/package.json ». Un script de build
// doit marcher depuis n'importe où.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = (...p) => path.join(ROOT, ...p);

const pkg = JSON.parse(readFileSync(r('packages/sdk/package.json'), 'utf8'));
const DIST = r('packages/sdk/dist');
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const commun = {
  absWorkingDir: ROOT,
  entryPoints: [r('src/sdk/index.ts')],
  bundle: true,
  minify: true,
  sourcemap: false,
  target: ['es2020'],
  platform: 'browser',
  tsconfig: r('tsconfig.json'),            // résout les alias @/ éventuels
  external: ['@huggingface/transformers'], // jamais bundlé — import CDN dynamique à l'exécution
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"', '__BRIMKERN_VERSION__': JSON.stringify(pkg.version) },
  metafile: true,
};

const iife = await esbuild.build({ ...commun, format: 'iife', outfile: path.join(DIST, 'brimkern.iife.js') });
const esm = await esbuild.build({ ...commun, format: 'esm', outfile: path.join(DIST, 'brimkern.mjs') });

// Le site sert la version « latest » ET la version figée : /sdk.js pour la doc et les démos,
// /sdk-<version>.js pour qui veut épingler.
copyFileSync(path.join(DIST, 'brimkern.iife.js'), r('public/sdk.js'));
copyFileSync(path.join(DIST, 'brimkern.iife.js'), r(`public/sdk-${pkg.version}.js`));

// Types émis depuis le source. `--declaration --emitDeclarationOnly` produit l'arbre complet des
// modules touchés ; l'entrée du paquet pointe dessus.
execFileSync('npx', ['tsc', r('src/sdk/index.ts'),
  '--declaration', '--emitDeclarationOnly', '--outDir', path.join(DIST, 'types'),
  '--target', 'es2022', '--module', 'esnext', '--moduleResolution', 'bundler', '--skipLibCheck', '--strict'],
  { cwd: ROOT, stdio: 'inherit' });
// Point d'entrée des types : un ré-export, pour que `types` du package.json reste stable même si
// l'arborescence émise change.
writeFileSync(path.join(DIST, 'index.d.ts'), `export * from './types/sdk/index';\n`);

// `res`, pas `r` : `r()` est le helper de chemins ci-dessus. Le masquer marchait par accident (plus
// aucun appel après cette ligne) et aurait cassé au premier ajout.
const ko = (res) => (Object.values(res.metafile.outputs)[0].bytes / 1024).toFixed(0);
console.log(`public/sdk.js + public/sdk-${pkg.version}.js — ${ko(iife)} KB (IIFE min)`);
console.log(`packages/sdk/dist/brimkern.mjs — ${ko(esm)} KB (ESM) · types dans packages/sdk/dist/types`);
console.log('(hors transformers.js/CDN et modèle streamé)');
