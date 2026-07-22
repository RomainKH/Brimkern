// Node test for the BRIK loader adapter (no GPU). Run via `npm run test:brik`.
// Builds a synthetic BRIK, runs brikToGgufManifest, concatenates the shards the same way the loader
// would, and checks that every absolute offset slices to bytes that decode back to the original —
// i.e. the GGUF-shaped manifest the engine consumes points at the right data.

import { assembleBrik, pickDType, chooseDType, type BrikInputTensor } from './convert';
import { decodeTensor } from './codec';
import { type BrikArchProfile, type BrikDType } from './format';
import { brikToGgufManifest, computeShardBases } from './loader';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) console.log(`  ok   ${name}`);
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1));

const d = 16, ffn = 32, blocks = 2;
const arch: BrikArchProfile = {
	arch: 'qwen2', d, nHeads: 4, nKvHeads: 2, headDim: 4, ffn, blockCount: blocks,
	ropeTheta: 1e6, rmsEps: 1e-6, vocab: 40,
};

const inputs: BrikInputTensor[] = [];
const add = (name: string, shape: number[]) =>
	inputs.push({ name, shape, data: rand(shape.reduce((a, b) => a * b, 1)), dtype: pickDType(shape) });

add('token_embd.weight', [arch.vocab, d]);
add('output_norm.weight', [d]);
for (let i = 0; i < blocks; i++) {
	add(`blk.${i}.attn_norm.weight`, [d]);
	add(`blk.${i}.attn_q.weight`, [d, d]);
	add(`blk.${i}.ffn_down.weight`, [d, ffn]);
}

const { manifest: brik, shards } = assembleBrik({
	model: { name: 'synthetic', quantSource: 'test', uiArch: 'qwen' },
	arch,
	chat: { template: '{{x}}', stopTokenIds: [2] },
	tokenizer: { kind: 'hf-hub', id: 'Xenova/qwen-tokenizer' },
	tensors: inputs,
});

// Concatenate shards in ascending id order — exactly what concatShardsToBlob does, minus the Blob.
const bases = computeShardBases(brik.shards);
const totalLen = brik.shards.reduce((a, s) => a + s.byteLength, 0);
const concat = new Uint8Array(totalLen);
for (const sh of [...brik.shards].sort((a, b) => a.id - b.id)) {
	const bytes = shards.find((s) => s.file === sh.file)!.bytes;
	concat.set(bytes, bases[sh.id]);
}

const gguf = brikToGgufManifest(brik);

check('config mapped from arch profile',
	gguf.config.d === d && gguf.config.ffn === ffn && gguf.config.blockCount === blocks && gguf.arch === 'qwen2');
check('dtype f16 → "F16" (2-D weights), f32 → "F32" (1-D norms)',
	gguf.tensors['blk.0.attn_q.weight'].type === 'F16' &&
	gguf.tensors['token_embd.weight'].type === 'F16' &&
	gguf.tensors['output_norm.weight'].type === 'F32');

// Every tensor: slice the concatenated bytes at the absolute offset → decode → matches original.
let allOk = true;
for (const t of inputs) {
	const e = gguf.tensors[t.name];
	const brikDtype = brik.tensors[t.name].dtype as BrikDType;
	const back = decodeTensor(concat.subarray(e.offset, e.offset + e.bytes), e.nElems, brikDtype);
	const tol = brikDtype === 'f16' ? 1e-2 : 0;
	for (let i = 0; i < e.nElems; i++) {
		if (Math.abs(back[i] - t.data![i]) > tol * (1 + Math.abs(t.data![i]))) { allOk = false; break; }
	}
}
check('every tensor decodes back from absolute offset', allOk);
check('absolute offset = shard base + intra-shard offset',
	gguf.tensors['blk.1.attn_q.weight'].offset === bases[brik.tensors['blk.1.attn_q.weight'].shard] + brik.tensors['blk.1.attn_q.weight'].offset);

// --- Native quant tiers ride the loader: q4 → "Q4W", q8 → "Q8W", offsets + round-trip intact ---
for (const tier of ['q8', 'q4'] as const) {
	const dd = 32; // ÷32 so layer matrices qualify for the quant tier
	const qArch: BrikArchProfile = { ...arch, d: dd, ffn: dd, headDim: 8, nHeads: 4, nKvHeads: 4 };
	const qInputs: BrikInputTensor[] = [];
	const qadd = (name: string, shape: number[]) => {
		const n = shape.reduce((a, b) => a * b, 1);
		qInputs.push({ name, shape, data: rand(n), dtype: chooseDType(name, shape, n, tier) });
	};
	qadd('token_embd.weight', [40, dd]);
	qadd('output_norm.weight', [dd]);
	qadd('blk.0.attn_norm.weight', [dd]);
	qadd('blk.0.attn_q.weight', [dd, dd]);
	qadd('blk.0.ffn_down.weight', [dd, dd]);

	const built = assembleBrik({
		model: { name: `synthetic-${tier}` }, arch: qArch,
		chat: { template: '{{x}}', stopTokenIds: [2] },
		tokenizer: { kind: 'hf-hub', id: 'Xenova/qwen-tokenizer' }, tensors: qInputs,
	});
	const qbases = computeShardBases(built.manifest.shards);
	const qtotal = built.manifest.shards.reduce((a, s) => a + s.byteLength, 0);
	const qconcat = new Uint8Array(qtotal);
	for (const sh of [...built.manifest.shards].sort((a, b) => a.id - b.id)) {
		qconcat.set(built.shards.find((s) => s.file === sh.file)!.bytes, qbases[sh.id]);
	}
	const qgguf = brikToGgufManifest(built.manifest);
	const expType = tier === 'q8' ? 'Q8W' : 'Q4W';
	check(`${tier}: layer matrix type → "${expType}"`, qgguf.tensors['blk.0.attn_q.weight'].type === expType);
	const expEmb = tier === 'q8' ? 'Q8W' : 'Q4W'; // le tier q4 émet des embeddings q4 depuis 2026-07-19
	check(`${tier}: embeddings → "${expEmb}"`, qgguf.tensors['token_embd.weight'].type === expEmb);
	check(`${tier}: norms stay "F32"`, qgguf.tensors['output_norm.weight'].type === 'F32');
	// Round-trip the quantized matrix from its absolute offset, within the quant budget.
	const e = qgguf.tensors['blk.0.attn_q.weight'];
	const orig = qInputs.find((t) => t.name === 'blk.0.attn_q.weight')!;
	const back = decodeTensor(qconcat.subarray(e.offset, e.offset + e.bytes), e.nElems, built.manifest.tensors['blk.0.attn_q.weight'].dtype);
	let maxAbs = 0;
	for (let i = 0; i < e.nElems; i++) maxAbs = Math.max(maxAbs, Math.abs(back[i] - orig.data![i]));
	check(`${tier}: matrix round-trips from offset within budget`, maxAbs < (tier === 'q8' ? 0.05 : 0.35), `max=${maxAbs.toFixed(4)}`);
}

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
