// Build du SDK embarquable → public/sdk.js (IIFE minifié). Bundle le moteur WGSL + Lfm2Model + le
// chargeur BRIK + le widget. transformers.js (tokenizer) reste EXTERNE (chargé du CDN à l'exécution)
// pour garder sdk.js léger. Usage : node scripts/build-sdk.mjs
import * as esbuild from 'esbuild';

const result = await esbuild.build({
  entryPoints: ['src/sdk/index.ts'],
  bundle: true,
  format: 'iife',
  minify: true,
  sourcemap: false,
  target: ['es2020'],
  platform: 'browser',
  outfile: 'public/sdk.js',
  tsconfig: 'tsconfig.json',          // résout les alias @/ éventuels
  external: ['@huggingface/transformers'], // jamais bundlé — import CDN dynamique à l'exécution
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"' },
  metafile: true,
});

const bytes = Object.values(result.metafile.outputs)[0].bytes;
console.log(`public/sdk.js — ${(bytes / 1024).toFixed(0)} KB (min, hors transformers.js/CDN + modèle streamé)`);
