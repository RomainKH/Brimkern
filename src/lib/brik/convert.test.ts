// Node test for the BRIK converter assembly (no GPU). Run via `npm run test:brik`.
// Builds a synthetic 2-layer model, assembles BRIK, and checks: one shard per layer + a shared
// shard, every manifest entry points at the right shard/offset, and every tensor decodes back.

import { assembleBrik, pickDType, chooseDType, convertModelToBrik, type BrikInputTensor } from './convert';
import { decodeTensor } from './codec';
import { q4ByteLength } from './q4web';
import { q8ByteLength } from './q8web';
import { BRIK_ALIGN, type BrikArchProfile } from './format';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) console.log(`  ok   ${name}`);
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1));

const d = 16, ffn = 32, kvDim = 8, blocks = 2;
const arch: BrikArchProfile = {
	arch: 'qwen2', d, nHeads: 4, nKvHeads: 2, headDim: 4, ffn, blockCount: blocks,
	ropeTheta: 1e6, rmsEps: 1e-6, vocab: 40
};

const tensors: BrikInputTensor[] = [];
const add = (name: string, shape: number[]) =>
	tensors.push({ name, shape, data: rand(shape.reduce((a, b) => a * b, 1)), dtype: pickDType(shape) });

// shared
add('token_embd.weight', [arch.vocab, d]);
add('output_norm.weight', [d]);
// per layer
for (let i = 0; i < blocks; i++) {
	add(`blk.${i}.attn_norm.weight`, [d]);
	add(`blk.${i}.attn_q.weight`, [d, d]);
	add(`blk.${i}.attn_k.weight`, [kvDim, d]);
	add(`blk.${i}.attn_v.weight`, [kvDim, d]);
	add(`blk.${i}.attn_q.bias`, [d]);
	add(`blk.${i}.attn_output.weight`, [d, d]);
	add(`blk.${i}.ffn_norm.weight`, [d]);
	add(`blk.${i}.ffn_gate.weight`, [ffn, d]);
	add(`blk.${i}.ffn_up.weight`, [ffn, d]);
	add(`blk.${i}.ffn_down.weight`, [d, ffn]);
}

const { manifest, shards } = assembleBrik({
	model: { name: 'synthetic', quantSource: 'test' },
	arch,
	chat: { template: '{{x}}', stopTokenIds: [2] },
	tokenizer: { kind: 'hf-hub', id: 'Xenova/qwen-tokenizer' },
	tensors
});

check('shard count = layers + 1 shared', shards.length === blocks + 1, `got ${shards.length}`);
check('manifest lists all tensors', Object.keys(manifest.tensors).length === tensors.length);
check('arch profile carried through', manifest.arch.blockCount === blocks && manifest.arch.d === d);
check('weights are f16, norms/biases f32',
	manifest.tensors['blk.0.attn_q.weight'].dtype === 'f16' &&
	manifest.tensors['blk.0.attn_norm.weight'].dtype === 'f32' &&
	manifest.tensors['blk.0.attn_q.bias'].dtype === 'f32');

// Embeddings/head live in the shared shard 0; layer tensors in their own shard.
check('shared tensors in shard 0', manifest.tensors['token_embd.weight'].shard === 0);
check('layer-0 tensors share one shard', manifest.tensors['blk.0.attn_q.weight'].shard === manifest.tensors['blk.0.ffn_up.weight'].shard);
check('layer-0 and layer-1 in different shards', manifest.tensors['blk.0.attn_q.weight'].shard !== manifest.tensors['blk.1.attn_q.weight'].shard);

// Every tensor decodes back from its shard at its offset, 16-aligned, within dtype precision.
let allOk = true, allAligned = true;
for (const t of tensors) {
	const e = manifest.tensors[t.name];
	if (e.offset % BRIK_ALIGN !== 0) allAligned = false;
	const shard = shards[e.shard];
	if (shardFileToId(shard.file) !== e.shard) allOk = false;
	const back = decodeTensor(shard.bytes.subarray(e.offset, e.offset + e.byteLength), e.nElems, e.dtype);
	const tol = e.dtype === 'f16' ? 1e-2 : 0;
	for (let i = 0; i < e.nElems; i++) {
		if (Math.abs(back[i] - t.data![i]) > tol * (1 + Math.abs(t.data![i]))) allOk = false;
	}
}
function shardFileToId(file: string): number { return parseInt(file.match(/(\d+)/)![1], 10); }
check('all tensor offsets 16-aligned', allAligned);
check('all tensors decode back from their shard', allOk);
check('shard byteLength matches buffer', shards.every((s, i) => manifest.shards[i].byteLength === s.bytes.length));

// --- Native q4/q8 storage (the v2 "web quant" tiers) -----------------------------------------
// chooseDType keeps norms f32 and embeddings/head f16, but stores the big layer matrices in the
// requested quant tier — and a BRIK packaged that way decodes back within the quant budget, at a
// download far smaller than f16.
{
	check('chooseDType: norm → f32', chooseDType('blk.0.attn_norm.weight', [16], 16, 'q8') === 'f32');
	// Depuis 2026-07-19 le runtime lit les embeddings en q4 (gather q4RowsBlob + tuiles {nib,sc,mn}) :
	// le tier q4 les émet en q4 ; mixed garde son plancher qualité q8.
	check('chooseDType: embeddings → q4 for q4 tier', chooseDType('token_embd.weight', [40, 16], 640, 'q4') === 'q4');
	check('chooseDType: embeddings stay f16 for f16 tier', chooseDType('token_embd.weight', [40, 16], 640, 'f16') === 'f16');
	check('chooseDType: layer matrix → q8', chooseDType('blk.0.attn_q.weight', [64, 64], 4096, 'q8') === 'q8');
	check('chooseDType: layer matrix → q4', chooseDType('blk.0.ffn_up.weight', [64, 64], 4096, 'q4') === 'q4');
	check('chooseDType: non-÷32 falls back to f16', chooseDType('blk.0.x.weight', [10, 6], 60, 'q8') === 'f16');

	// Tier 'mixed' : attention ENTIÈRE ancrée q8, corps q4, embeddings plafonnés q8, normes f32.
	// (L'int4 intégral casse les petits modèles — l'ancre q8 sur l'attention répare, cf. convert.ts.)
	check('chooseDType mixed: attn_q → q8', chooseDType('blk.0.attn_q.weight', [64, 64], 4096, 'mixed') === 'q8');
	check('chooseDType mixed: attn_k → q8', chooseDType('blk.5.attn_k.weight', [64, 16], 1024, 'mixed') === 'q8');
	check('chooseDType mixed: attn_v → q8', chooseDType('blk.5.attn_v.weight', [64, 16], 1024, 'mixed') === 'q8');
	check('chooseDType mixed: attn_output → q8', chooseDType('blk.23.attn_output.weight', [64, 64], 4096, 'mixed') === 'q8');
	check('chooseDType mixed: ffn → q4', chooseDType('blk.0.ffn_down.weight', [64, 64], 4096, 'mixed') === 'q4');
	check('chooseDType mixed: embeddings → q8', chooseDType('token_embd.weight', [40, 16], 640, 'mixed') === 'q8');
	check('chooseDType mixed: norm → f32', chooseDType('blk.0.attn_norm.weight', [16], 16, 'mixed') === 'f32');
	check('chooseDType mixed: attn bias 1-D → f32', chooseDType('blk.0.attn_q.bias', [64], 64, 'mixed') === 'f32');
	check('chooseDType mixed: non-÷32 ffn falls back to f16', chooseDType('blk.0.ffn_up.weight', [10, 6], 60, 'mixed') === 'f16');

	for (const tier of ['q8', 'q4'] as const) {
		const dd = 64; // ÷32, so layer matrices qualify for the quant tier
		const qArch: BrikArchProfile = { ...arch, d: dd, ffn: dd, headDim: 16, nHeads: 4, nKvHeads: 4 };
		const qTensors: BrikInputTensor[] = [];
		const qadd = (name: string, shape: number[]) => {
			const nElems = shape.reduce((a, b) => a * b, 1);
			qTensors.push({ name, shape, data: rand(nElems), dtype: chooseDType(name, shape, nElems, tier) });
		};
		qadd('token_embd.weight', [40, dd]);
		qadd('output_norm.weight', [dd]);
		qadd('blk.0.attn_q.weight', [dd, dd]);
		qadd('blk.0.ffn_up.weight', [dd, dd]);

		const out = assembleBrik({
			model: { name: `synthetic-${tier}` }, arch: qArch,
			chat: { template: '{{x}}', stopTokenIds: [2] },
			tokenizer: { kind: 'hf-hub', id: 'Xenova/qwen-tokenizer' }, tensors: qTensors
		});
		const qm = out.manifest.tensors['blk.0.attn_q.weight'];
		check(`${tier}: layer matrix stored as ${tier}`, qm.dtype === tier);
		check(`${tier}: embeddings suivent le tier`, out.manifest.tensors['token_embd.weight'].dtype === tier);
		// On-disk byteLength is the compact quant size, far below f16's 2 bytes/weight.
		const expBytes = tier === 'q8' ? q8ByteLength(qm.nElems) : q4ByteLength(qm.nElems);
		check(`${tier}: byteLength is compact quant size`, qm.byteLength === expBytes, `${qm.byteLength} vs ${expBytes}`);
		check(`${tier}: smaller than f16`, qm.byteLength < qm.nElems * 2);
		// Decode back within the quant budget (q8 ~near-f16, q4 ~Q4_1).
		const t = qTensors.find((x) => x.name === 'blk.0.attn_q.weight')!;
		const back = decodeTensor(out.shards[qm.shard].bytes.subarray(qm.offset, qm.offset + qm.byteLength), qm.nElems, qm.dtype);
		let maxAbs = 0;
		for (let i = 0; i < qm.nElems; i++) maxAbs = Math.max(maxAbs, Math.abs(back[i] - t.data![i]));
		check(`${tier}: decodes back within budget`, maxAbs < (tier === 'q8' ? 0.05 : 0.35), `max=${maxAbs.toFixed(4)}`);
	}
}

// --- Streaming converter (convertModelToBrik) — processes shard-by-shard; output must match a
// whole-model assembleBrik and decode back. Synthetic F32 GGUF: readRaw slices a flat buffer,
// dequantize reinterprets the bytes as f32. Async, so it runs in an IIFE before the final report.
(async () => {
	const store = new Map<string, Float32Array>();
	const gtensors: Record<string, { offset: number; bytes: number; nElems: number; type: string; shape: number[] }> = {};
	let off = 0;
	const gadd = (name: string, shape: number[]) => {
		const n = shape.reduce((a, b) => a * b, 1);
		const data = rand(n);
		store.set(name, data);
		gtensors[name] = { offset: off, bytes: n * 4, nElems: n, type: 'F32', shape };
		off += n * 4;
	};
	gadd('token_embd.weight', [40, 64]);
	gadd('output_norm.weight', [64]);
	gadd('blk.0.attn_q.weight', [64, 64]);
	gadd('blk.0.attn_norm.weight', [64]);
	gadd('blk.1.attn_q.weight', [64, 64]);
	const flat = new Uint8Array(off);
	for (const [name, e] of Object.entries(gtensors)) flat.set(new Uint8Array(store.get(name)!.buffer), e.offset);

	const gguf = {
		arch: 'qwen2',
		config: { d: 64, nHeads: 4, nKvHeads: 4, headDim: 16, ffn: 64, blockCount: 2, ropeTheta: 1e6, rmsEps: 1e-6 },
		tensors: gtensors,
	};
	const readRaw = async (o: number, b: number) => flat.subarray(o, o + b);
	const dequantize = async (_type: string, bytes: Uint8Array, nElems: number) =>
		new Float32Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + nElems * 4));

	const out = await convertModelToBrik(
		gguf as unknown as Parameters<typeof convertModelToBrik>[0], readRaw, dequantize,
		{ modelName: 'stream', tokenizer: { kind: 'hf-hub', id: 'x' }, chat: { template: '', stopTokenIds: [] }, weightDType: 'f16' },
	);

	check('stream: shard count = layers + shared', out.shards.length === 3, `got ${out.shards.length}`);
	check('stream: shared tensors in shard 0', out.manifest.tensors['token_embd.weight'].shard === 0);
	check('stream: layer-1 in its own shard', out.manifest.tensors['blk.1.attn_q.weight'].shard !== out.manifest.tensors['blk.0.attn_q.weight'].shard);
	let streamOk = true;
	for (const [name, data] of store) {
		const e = out.manifest.tensors[name];
		const back = decodeTensor(out.shards[e.shard].bytes.subarray(e.offset, e.offset + e.byteLength), e.nElems, e.dtype);
		const tol = e.dtype === 'f16' ? 1e-2 : 0;
		for (let i = 0; i < e.nElems; i++) if (Math.abs(back[i] - data[i]) > tol * (1 + Math.abs(data[i]))) streamOk = false;
	}
	check('stream: all tensors decode back', streamOk);

	console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
	process.exit(failures === 0 ? 0 : 1);
})();
