#!/usr/bin/env node
// Sélection du fichier de modèle d'un dépôt Hugging Face (deeplink ?model=auteur/dépôt) —
// partie PURE, sans réseau. Usage : npm run test:deeplink
const path = require('path');
const { buildSync } = require('esbuild');

const out = path.join(__dirname, '..', '.brik-build', 'deeplink-test.cjs');
buildSync({ entryPoints: [path.join(__dirname, '..', 'src', 'lib', 'deeplink.ts')], bundle: true, format: 'cjs', platform: 'node', outfile: out, logLevel: 'silent' });
const { pickModelFile, parseDeeplink, hfResolveUrl, parseModelInput } = require(out);

let pass = 0, fail = 0;
const eq = (label, got, want) => {
	const ok = JSON.stringify(got) === JSON.stringify(want);
	if (ok) pass++; else { fail++; console.log(`✗ ${label}\n   attendu ${JSON.stringify(want)}\n   obtenu  ${JSON.stringify(got)}`); }
};

// BRIK prioritaire sur GGUF, tier q4 préféré
eq('brik gagne sur gguf', pickModelFile(['model-q8_0.gguf', 'lfm25-230m-q4.brik', 'README.md']), 'lfm25-230m-q4.brik');
eq('tier brik préféré', pickModelFile(['m-q8.brik', 'm-q3.brik', 'm-q4.brik']), 'm-q4.brik');
// GGUF : Q4_K_M d'abord, insensible à la casse
eq('gguf q4_k_m', pickModelFile(['m-Q8_0.gguf', 'm-Q4_K_M.gguf', 'm-F16.gguf']), 'm-Q4_K_M.gguf');
eq('gguf repli q8', pickModelFile(['m-Q8_0.gguf', 'm-F16.gguf']), 'm-Q8_0.gguf');
eq('gguf inconnu = accepté', pickModelFile(['weird-quant.gguf']), 'weird-quant.gguf');
// Exclusions
eq('mmproj exclu', pickModelFile(['mmproj-model-f16.gguf', 'model-Q4_K_M.gguf']), 'model-Q4_K_M.gguf');
eq('mmproj seul → rien', pickModelFile(['mmproj-model-f16.gguf']), null);
eq('gguf shardé exclu', pickModelFile(['m-00001-of-00003.gguf', 'm-00002-of-00003.gguf']), null);
eq('safetensors seul → rien', pickModelFile(['model.safetensors', 'config.json']), null);
eq('vide → rien', pickModelFile([]), null);
// Déterminisme à rang égal
eq('tri stable', pickModelFile(['b-Q4_K_M.gguf', 'a-Q4_K_M.gguf']), 'a-Q4_K_M.gguf');
// Sous-dossiers
eq('sous-dossier', pickModelFile(['gguf/model-Q4_K_M.gguf']), 'gguf/model-Q4_K_M.gguf');

// URL de résolution
eq('url hf', hfResolveUrl('romainkh14/LFM2.5-230M_BRIK', 'lfm25-230m-q4.brik'), 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik');

// parseDeeplink
eq('?model', parseDeeplink('?model=owner/repo'), { id: 'owner/repo' });
eq('?model&file', parseDeeplink('?model=owner/repo&file=a/b-Q4_K_M.gguf'), { id: 'owner/repo', file: 'a/b-Q4_K_M.gguf' });
eq('?brik absolu', parseDeeplink('?brik=https://h.co/m.brik'), { url: 'https://h.co/m.brik', kind: 'brik' });
eq('?brik relatif (banc)', parseDeeplink('?brik=/models/m.brik'), { url: '/models/m.brik', kind: 'brik' });
eq('?gguf', parseDeeplink('?gguf=https://h.co/m.gguf'), { url: 'https://h.co/m.gguf', kind: 'gguf' });
eq('http non-local refusé', parseDeeplink('?brik=http://evil.example/m.brik'), null);
eq('extension refusée', parseDeeplink('?brik=https://h.co/m.exe'), null);
eq('rien', parseDeeplink('?foo=1'), null);

// parseModelInput — la saisie LIBRE du champ « tester n'importe quel modèle » (ce que les gens
// collent vraiment : identifiant, page du dépôt, page d'un fichier, lien de téléchargement, URL tierce).
eq('id nu', parseModelInput('owner/repo'), { id: 'owner/repo' });
eq('id + espaces', parseModelInput('  owner/repo \n'), { id: 'owner/repo' });
eq('id entre guillemets', parseModelInput('"owner/repo"'), { id: 'owner/repo' });
eq('page du dépôt', parseModelInput('https://huggingface.co/owner/repo'), { id: 'owner/repo' });
eq('page + slash final', parseModelInput('https://huggingface.co/owner/repo/'), { id: 'owner/repo' });
eq('onglet Files', parseModelInput('https://huggingface.co/owner/repo/tree/main'), { id: 'owner/repo' });
eq('hf.co sans schéma', parseModelInput('hf.co/owner/repo'), { id: 'owner/repo' });
eq('huggingface.co sans schéma', parseModelInput('huggingface.co/owner/repo'), { id: 'owner/repo' });
eq('page d’un fichier (blob) → id+file', parseModelInput('https://huggingface.co/owner/repo/blob/main/m-Q4_K_M.gguf'), { id: 'owner/repo', file: 'm-Q4_K_M.gguf' });
eq('blob sous-dossier', parseModelInput('https://huggingface.co/owner/repo/blob/main/Q4/m.gguf'), { id: 'owner/repo', file: 'Q4/m.gguf' });
eq('lien resolve → URL directe', parseModelInput('https://huggingface.co/owner/repo/resolve/main/m-Q4_K_M.gguf'), { url: 'https://huggingface.co/owner/repo/resolve/main/m-Q4_K_M.gguf', kind: 'gguf' });
eq('resolve .brik', parseModelInput('https://huggingface.co/owner/repo/resolve/main/m-q4.brik'), { url: 'https://huggingface.co/owner/repo/resolve/main/m-q4.brik', kind: 'brik' });
eq('id + chemin de fichier', parseModelInput('owner/repo/m-Q4_K_M.gguf'), { id: 'owner/repo', file: 'm-Q4_K_M.gguf' });
eq('URL tierce .gguf', parseModelInput('https://cdn.example.com/a/b/m.gguf'), { url: 'https://cdn.example.com/a/b/m.gguf', kind: 'gguf' });
// Refus : ce que le moteur ne sait pas charger, et les entrées inexploitables.
eq('safetensors refusé', parseModelInput('https://huggingface.co/owner/repo/resolve/main/model.safetensors'), null);
eq('mmproj refusé', parseModelInput('https://huggingface.co/owner/repo/resolve/main/mmproj-f16.gguf'), null);
eq('gguf shardé refusé', parseModelInput('https://huggingface.co/o/r/resolve/main/m-00001-of-00003.gguf'), null);
eq('URL tierce sans extension connue', parseModelInput('https://example.com/model.bin'), null);
eq('un seul segment', parseModelInput('owner'), null);
eq('page utilisateur HF', parseModelInput('https://huggingface.co/owner'), null);
eq('vide', parseModelInput('   '), null);

console.log(`\n${pass}/${pass + fail} assertions OK${fail ? ' — ÉCHEC' : ''}`);
process.exit(fail ? 1 : 0);
