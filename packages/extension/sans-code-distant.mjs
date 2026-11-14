// Plugin esbuild : retire le repli transformers.js du moteur (import dynamique depuis esm.sh, pour
// les tokenizers non-BPE). Manifest V3 interdit le code chargé à distance. Partagé par le build de
// l'extension ET par le banc qualité (scripts/e2e/serp-quality.mjs) : un modèle qui aurait besoin
// du repli doit échouer AU BANC comme il échouerait dans l'extension.
import { readFileSync } from 'node:fs';

export const sansCodeDistant = {
  name: 'sans-code-distant',
  setup(build) {
    build.onLoad({ filter: /src[\\/]sdk[\\/]engineCore\.ts$/ }, (args) => {
      const src = readFileSync(args.path, 'utf8');
      const motif = /import\(\/\* @vite-ignore \*\/ TRANSFORMERS_CDN\)/g;
      // Si le SDK change sa façon d'importer le repli, le remplacement ne trouverait rien et l'URL
      // partirait dans le bundle sans un mot : on exige d'avoir trouvé ce qu'on retire.
      if (!(src.match(motif) || []).length) {
        throw new Error('engineCore.ts : import du repli transformers.js introuvable — mettre à jour sans-code-distant.mjs');
      }
      return {
        contents: src.replace(motif, "Promise.reject(new Error('[brimkern] tokenizer fallback unavailable in the extension (no remote code in Manifest V3)'))"),
        loader: 'ts',
      };
    });
  },
};
