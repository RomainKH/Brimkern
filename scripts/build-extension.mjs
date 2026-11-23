// Build de l'extension Chrome (packages/extension → packages/extension/dist, à charger « non
// empaquetée » ou à zipper pour le Chrome Web Store).
//
// Le moteur est le MÊME source que le SDK (src/sdk) : pas de copie, pas de version à synchroniser.
// Une différence, imposée par Manifest V3 : aucun code chargé à distance. Le repli transformers.js
// du SDK (import dynamique depuis esm.sh, pour les tokenizers non-BPE) est retiré au build ; les deux
// modèles de l'extension passent par le tokenizer BPE bundlé, qui ne l'utilise jamais. Le build
// ÉCHOUE si une URL de code distant subsiste dans la sortie.
// Usage : node scripts/build-extension.mjs
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { udm14Rules } from '../packages/extension/rules.mjs';
import { sansCodeDistant } from '../packages/extension/sans-code-distant.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXT = path.join(ROOT, 'packages/extension');
const DIST = path.join(EXT, 'dist');
rmSync(DIST, { recursive: true, force: true });
mkdirSync(path.join(DIST, 'rules'), { recursive: true });

const sdkVersion = JSON.parse(readFileSync(path.join(ROOT, 'packages/sdk/package.json'), 'utf8')).version;

const commun = {
  absWorkingDir: ROOT,
  bundle: true,
  minify: true,
  target: ['chrome116'],
  platform: 'browser',
  tsconfig: path.join(ROOT, 'tsconfig.json'),
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"', '__BRIMKERN_VERSION__': JSON.stringify(sdkVersion) },
  plugins: [sansCodeDistant],
  metafile: true,
};

const sorties = await Promise.all([
  esbuild.build({ ...commun, entryPoints: [path.join(EXT, 'src/background.ts')], format: 'esm', outfile: path.join(DIST, 'background.js') }),
  esbuild.build({ ...commun, entryPoints: [path.join(EXT, 'src/offscreen.ts')], format: 'esm', outfile: path.join(DIST, 'offscreen.js') }),
  esbuild.build({ ...commun, entryPoints: [path.join(EXT, 'src/content.ts')], format: 'iife', outfile: path.join(DIST, 'content.js') }),
  esbuild.build({ ...commun, entryPoints: [path.join(EXT, 'src/options.ts')], format: 'esm', outfile: path.join(DIST, 'options.js') }),
  esbuild.build({ ...commun, entryPoints: [path.join(EXT, 'src/sidepanel.ts')], format: 'esm', outfile: path.join(DIST, 'sidepanel.js') }),
]);

for (const f of ['background.js', 'offscreen.js', 'content.js', 'options.js', 'sidepanel.js']) {
  const js = readFileSync(path.join(DIST, f), 'utf8');
  const distant = js.match(/https:\/\/(esm\.sh|cdn\.jsdelivr\.net|unpkg\.com)[^'"`\s]*/);
  if (distant) throw new Error(`${f} contient une URL de code distant (${distant[0]}) : refusé par Manifest V3`);
}

const domaines = JSON.parse(readFileSync(path.join(EXT, 'google-domains.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(path.join(EXT, 'manifest.json'), 'utf8'));
const autresMoteurs = [
  'https://duckduckgo.com/*',
  'https://search.brave.com/search*',
  'https://www.startpage.com/sp/search*',
  'https://www.startpage.com/do/search*',
  'https://www.ecosia.org/search*',
];
manifest.host_permissions = domaines.map((d) => `https://www.${d}/*`);
manifest.content_scripts[0].matches = [...domaines.map((d) => `https://www.${d}/search*`), ...autresMoteurs];
writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2));
writeFileSync(path.join(DIST, 'rules/udm14.json'), JSON.stringify(udm14Rules(domaines), null, 2));
for (const d of ['_locales', 'icons']) cpSync(path.join(EXT, d), path.join(DIST, d), { recursive: true });
for (const h of ['offscreen.html', 'options.html', 'sidepanel.html']) cpSync(path.join(EXT, h), path.join(DIST, h));

// Le paquet à déposer sur le Chrome Web Store : le CONTENU de dist/ (manifest.json à la racine du
// zip, pas dans un sous-dossier — sinon le dépôt est refusé). -X : pas d'attributs macOS.
const zip = path.join(EXT, `brimkern-extension-${manifest.version}.zip`);
rmSync(zip, { force: true });
execFileSync('zip', ['-r', '-q', '-X', zip, '.'], { cwd: DIST });
// Bêta : le MÊME zip est servi par le site (/extension le propose en téléchargement, à charger
// « non empaquetée »). Copie versionnée, comme public/sdk-<version>.js.
const zipPublic = path.join(ROOT, `public/brimkern-extension-${manifest.version}.zip`);
cpSync(zip, zipPublic);

const ko = (r) => (Object.values(r.metafile.outputs)[0].bytes / 1024).toFixed(0);
console.log(`packages/extension/dist — v${manifest.version} (moteur du SDK ${sdkVersion})`);
console.log(`  background.js ${ko(sorties[0])} KB · offscreen.js ${ko(sorties[1])} KB · content.js ${ko(sorties[2])} KB · options.js ${ko(sorties[3])} KB · sidepanel.js ${ko(sorties[4])} KB`);
console.log(`  ${domaines.length} domaines Google`);
console.log(`  ${path.relative(ROOT, zip)} — ${(statSync(zip).size / 1024).toFixed(0)} KB, à déposer sur le Chrome Web Store`);
console.log(`  ${path.relative(ROOT, zipPublic)} — copie servie par le site (/extension)`);
