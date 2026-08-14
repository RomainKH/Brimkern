// Assemble le Space vitrine Hugging Face (sdk: static) dans .hf-space/ :
// hf/space/* + le SDK bundlé (public/sdk.js, rebuild systématique pour ne jamais publier un
// sdk.js périmé). Le Space ne dépend d'AUCUN CDN — le tokenizer est bundlé dans le SDK depuis
// le 2026-08-12, ce qui le rend compatible avec la CSP d'un Space statique.
// Usage : npm run build:hf-space   → puis copier .hf-space/* dans le clone du Space et pousser.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, statSync } from 'node:fs';

const OUT = '.hf-space';

execFileSync(process.execPath, ['scripts/build-sdk.mjs'], { stdio: 'inherit' });

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('hf/space', OUT, { recursive: true });
cpSync('public/sdk.js', `${OUT}/sdk.js`);

const kb = (p) => `${(statSync(p).size / 1024).toFixed(0)} KB`;
console.log(`${OUT}/ prêt — index.html ${kb(`${OUT}/index.html`)}, sdk.js ${kb(`${OUT}/sdk.js`)}, README.md (front-matter sdk: static)`);
console.log('Publier :  cp -r .hf-space/* <clone-du-space>/ && git -C <clone-du-space> add -A && git -C <clone-du-space> commit -m "Le Kern" && git -C <clone-du-space> push');
