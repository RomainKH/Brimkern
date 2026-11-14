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
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { udm14Rules } from '../packages/extension/rules.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXT = path.join(ROOT, 'packages/extension');
const DIST = path.join(EXT, 'dist');
rmSync(DIST, { recursive: true, force: true });
mkdirSync(path.join(DIST, 'rules'), { recursive: true });

const sdkVersion = JSON.parse(readFileSync(path.join(ROOT, 'packages/sdk/package.json'), 'utf8')).version;

const sansCodeDistant = {
  name: 'sans-code-distant',
  setup(build) {
    build.onLoad({ filter: /src[\\/]sdk[\\/]engineCore\.ts$/ }, (args) => {
      const src = readFileSync(args.path, 'utf8');
      const motif = /import\(\/\* @vite-ignore \*\/ TRANSFORMERS_CDN\)/g;
      const n = (src.match(motif) || []).length;
      // Si le SDK change sa façon d'importer le repli, le remplacement ne trouverait rien et l'URL
      // partirait dans le bundle sans un mot : on exige d'avoir trouvé ce qu'on retire.
      if (!n) throw new Error('engineCore.ts : import du repli transformers.js introuvable — mettre à jour build-extension.mjs');
      return {
        contents: src.replace(motif, "Promise.reject(new Error('[brimkern] tokenizer fallback unavailable in the extension (no remote code in Manifest V3)'))"),
        loader: 'ts',
      };
    });
  },
};

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
]);

for (const f of ['background.js', 'offscreen.js', 'content.js']) {
  const js = readFileSync(path.join(DIST, f), 'utf8');
  const distant = js.match(/https:\/\/(esm\.sh|cdn\.jsdelivr\.net|unpkg\.com)[^'"`\s]*/);
  if (distant) throw new Error(`${f} contient une URL de code distant (${distant[0]}) : refusé par Manifest V3`);
}

const domaines = JSON.parse(readFileSync(path.join(EXT, 'google-domains.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(path.join(EXT, 'manifest.json'), 'utf8'));
manifest.host_permissions = domaines.map((d) => `https://www.${d}/*`);
manifest.content_scripts[0].matches = domaines.map((d) => `https://www.${d}/search*`);
writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2));
writeFileSync(path.join(DIST, 'rules/udm14.json'), JSON.stringify(udm14Rules(domaines), null, 2));
for (const d of ['_locales', 'icons']) cpSync(path.join(EXT, d), path.join(DIST, d), { recursive: true });
cpSync(path.join(EXT, 'offscreen.html'), path.join(DIST, 'offscreen.html'));

const ko = (r) => (Object.values(r.metafile.outputs)[0].bytes / 1024).toFixed(0);
console.log(`packages/extension/dist — v${manifest.version} (moteur du SDK ${sdkVersion})`);
console.log(`  background.js ${ko(sorties[0])} KB · offscreen.js ${ko(sorties[1])} KB · content.js ${ko(sorties[2])} KB`);
console.log(`  ${domaines.length} domaines Google`);
