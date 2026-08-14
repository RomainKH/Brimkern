#!/usr/bin/env node
// Équivalence BpeTokenizer (SDK, bundlé) vs transformers.js (référence) sur le tokenizer.json
// EMBARQUÉ d'un .brik LFM2. Usage : node scripts/test-bpe-tokenizer.cjs [chemin.brik]
// Compare encode() (ids exacts, BOS compris) et decode() (round-trip) sur une batterie de textes.
const fs = require('fs');
const path = require('path');
const { buildSync } = require('esbuild');

const BRIK = process.argv[2] || path.join(__dirname, '..', 'public', 'models', 'lfm25-230m-q4.brik');

// ── Extraire le manifeste du .brik (en-tête 12 o : magic + version + longueur du manifeste) ──
const fd = fs.openSync(BRIK, 'r');
const head = Buffer.alloc(12);
fs.readSync(fd, head, 0, 12, 0);
const manifestLen = head.readUInt32LE(8);
const manBuf = Buffer.alloc(manifestLen);
fs.readSync(fd, manBuf, 0, manifestLen, 12);
fs.closeSync(fd);
const manifest = JSON.parse(manBuf.toString('utf8'));
if (!manifest.tokenizer?.json) { console.error('pas de tokenizer.json embarqué dans ce BRIK'); process.exit(1); }
const tokJson = manifest.tokenizer.json;
const tokConfig = manifest.tokenizer.config;

// ── Compiler le BpeTokenizer TS → CJS temporaire ──
const outFile = path.join(__dirname, '..', '.brik-build', 'bpe-test.cjs');
buildSync({ entryPoints: [path.join(__dirname, '..', 'src', 'lib', 'bpeTokenizer.ts')], bundle: true, format: 'cjs', platform: 'node', outfile: outFile, logLevel: 'silent' });
const { BpeTokenizer } = require(outFile);

(async () => {
	const tf = await import('@huggingface/transformers');
	const ref = new tf.PreTrainedTokenizer(JSON.parse(tokJson), JSON.parse(tokConfig));
	const mine = new BpeTokenizer(tokJson);

	const CASES = [
		'Bonjour, comment ça va ?',
		'<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n<|im_start|>user\nQuelle est la capitale de la France ?<|im_end|>\n<|im_start|>assistant\n',
		"L'été 2026 : 3,14159 → π ≈ 22/7 !",
		'   des    espaces   multiples\n\n\net des sauts de ligne\t\ttabs',
		'emoji 🇫🇷🚀 œuvré ÀÉÎÕÜ ß 中文测试 العربية',
		"don't we've I'll they're it's",
		'code: `for (let i = 0; i < n; i++) { sum += arr[i]; }`',
		'email: romain.khanoyan@qomit.com — https://brimkern.example/path?q=1&r=2',
		'',
		'a',
	];

	let pass = 0, fail = 0;
	for (const text of CASES) {
		const refIds = Array.from(ref(text).input_ids.data, Number);
		const myIds = mine.encode(text);
		const okEnc = refIds.length === myIds.length && refIds.every((v, i) => v === myIds[i]);
		const refDec = ref.decode(refIds, { skip_special_tokens: true });
		const myDec = mine.decode(myIds);
		const okDec = refDec === myDec;
		if (okEnc && okDec) { pass++; }
		else {
			fail++;
			console.log(`✗ ${JSON.stringify(text.slice(0, 60))}`);
			if (!okEnc) console.log(`  encode ref[${refIds.length}]=${JSON.stringify(refIds.slice(0, 24))}\n         moi[${myIds.length}]=${JSON.stringify(myIds.slice(0, 24))}`);
			if (!okDec) console.log(`  decode ref=${JSON.stringify(refDec.slice(0, 80))}\n         moi=${JSON.stringify(myDec.slice(0, 80))}`);
		}
	}
	console.log(`\n${pass}/${CASES.length} cas identiques à transformers.js${fail ? ' — ÉCHEC' : ' — OK'}`);
	process.exit(fail ? 1 : 0);
})();
