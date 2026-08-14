#!/usr/bin/env node
// Équivalence du tokenizer RECONSTRUIT DEPUIS UN GGUF (src/lib/ggufTokenizer.ts) vs transformers.js
// sur le dépôt HF d'origine. C'est ce qui autorise à charger n'importe quel GGUF du Hub sans savoir
// d'avance quel tokenizer lui associer — donc à embarquer un modèle arbitraire dans le widget.
//
// L'en-tête du GGUF est lu par PLAGE HTTP (quelques Mo), pas le fichier entier.
// Usage : node scripts/test-gguf-tokenizer.cjs            (batterie par défaut : llama3, qwen3, gemma3)
//         node scripts/test-gguf-tokenizer.cjs <url.gguf> <repo-hf-de-référence>
const path = require('path');
const { buildSync } = require('esbuild');

const ROOT = path.join(__dirname, '..');
const out = path.join(ROOT, '.brik-build', 'gguf-tok-test.cjs');
buildSync({
	entryPoints: [path.join(ROOT, 'scripts', 'gguf-tok-entry.mjs')],
	bundle: true, format: 'cjs', platform: 'node', outfile: out, logLevel: 'silent',
});
const { parseGguf, tokenizerFromGguf } = require(out);

// Modèle GGUF ↔ dépôt HF portant le tokenizer de référence. Trois familles de pré-tokeniseur.
const DEFAULT_CASES = [
	{ gguf: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf', ref: 'unsloth/Llama-3.2-1B-Instruct' },
	{ gguf: 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q8_0.gguf', ref: 'Qwen/Qwen3-0.6B' },
	{ gguf: 'https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/main/gemma-3-270m-it-Q4_K_M.gguf', ref: 'unsloth/gemma-3-270m-it' },
];

const TEXTS = [
	'Bonjour, comment ça va ?',
	'The quick brown fox jumps over 3 lazy dogs in 2026.',
	"L'été 2026 : 3,14159 → π ≈ 22/7 !",
	'   des    espaces   multiples\n\n\net des sauts de ligne\t\ttabs',
	'emoji 🇫🇷🚀 œuvré ÀÉÎÕÜ ß 中文测试 العربية',
	"don't we've I'll they're it's",
	'def f(x): return x ** 2  # code',
	'1 12 123 1234 12345 007',
];

(async () => {
	const argUrl = process.argv[2], argRef = process.argv[3];
	const cases = argUrl && argRef ? [{ gguf: argUrl, ref: argRef }] : DEFAULT_CASES;
	const tf = await import('@huggingface/transformers');
	let pass = 0, fail = 0, skipped = 0;

	for (const c of cases) {
		const name = c.gguf.split('/').pop();
		let man;
		try {
			const r = await fetch(c.gguf, { headers: { Range: 'bytes=0-16777215' } });
			if (!r.ok && r.status !== 206) throw new Error(`HTTP ${r.status}`);
			man = await parseGguf(new Blob([new Uint8Array(await r.arrayBuffer())]));
		} catch (e) {
			console.log(`\n⚠ ${name} : en-tête illisible (${e.message}) — cas ignoré`);
			skipped++;
			continue;
		}
		const info = tokenizerFromGguf(man);
		if (!info) {
			console.log(`\n⚠ ${name} : vocabulaire non couvert (pas de merges ?) — cas ignoré`);
			skipped++;
			continue;
		}
		const ref = await tf.AutoTokenizer.from_pretrained(c.ref);
		console.log(`\n${name}\n  pre=${info.pre} vocab=${info.nVocab} bos=${info.bosId} eos=${info.eosId} contrôles=${info.controlIds.length}`);
		for (const text of TEXTS) {
			const mine = info.tokenizer.encode(text);
			const refIds = Array.from(ref(text, { add_special_tokens: false }).input_ids.data, Number);
			const ok = mine.length === refIds.length && mine.every((v, i) => v === refIds[i]);
			if (ok) pass++;
			else {
				fail++;
				console.log(`  ✗ ${JSON.stringify(text.slice(0, 42))}\n     nous ${JSON.stringify(mine.slice(0, 14))}\n     réf  ${JSON.stringify(refIds.slice(0, 14))}`);
			}
			// Round-trip : le décodage doit rendre le texte d'origine.
			const back = info.tokenizer.decode(mine);
			if (back === text) pass++;
			else { fail++; console.log(`  ✗ round-trip ${JSON.stringify(text.slice(0, 30))} → ${JSON.stringify(back.slice(0, 40))}`); }
		}
	}
	console.log(`\n${pass}/${pass + fail} assertions OK${skipped ? ` (${skipped} cas ignorés)` : ''}${fail ? ' — ÉCHEC' : ''}`);
	process.exit(fail ? 1 : 0);
})();
