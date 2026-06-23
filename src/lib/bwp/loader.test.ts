// Node test for the BWP loader adapter (no GPU). Run via `npm run test:bwp`.
// Builds a synthetic BWP, runs bwpToGgufManifest, concatenates the shards the same way the loader
// would, and checks that every absolute offset slices to bytes that decode back to the original —
// i.e. the GGUF-shaped manifest the engine consumes points at the right data.

import { assembleBwp, pickDType, type BwpInputTensor } from './convert';
import { decodeTensor } from './codec';
import { type BwpArchProfile, type BwpDType } from './format';
import { bwpToGgufManifest, computeShardBases } from './loader';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) console.log(`  ok   ${name}`);
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1));

const d = 16, ffn = 32, blocks = 2;
const arch: BwpArchProfile = {
	arch: 'qwen2', d, nHeads: 4, nKvHeads: 2, headDim: 4, ffn, blockCount: blocks,
	ropeTheta: 1e6, rmsEps: 1e-6, vocab: 40,
};

const inputs: BwpInputTensor[] = [];
const add = (name: string, shape: number[]) =>
	inputs.push({ name, shape, data: rand(shape.reduce((a, b) => a * b, 1)), dtype: pickDType(shape) });

add('token_embd.weight', [arch.vocab, d]);
add('output_norm.weight', [d]);
for (let i = 0; i < blocks; i++) {
	add(`blk.${i}.attn_norm.weight`, [d]);
	add(`blk.${i}.attn_q.weight`, [d, d]);
	add(`blk.${i}.ffn_down.weight`, [d, ffn]);
}

const { manifest: bwp, shards } = assembleBwp({
	model: { name: 'synthetic', quantSource: 'test', uiArch: 'qwen' },
	arch,
	chat: { template: '{{x}}', stopTokenIds: [2] },
	tokenizer: { kind: 'hf-hub', id: 'Xenova/qwen-tokenizer' },
	tensors: inputs,
});

// Concatenate shards in ascending id order — exactly what concatShardsToBlob does, minus the Blob.
const bases = computeShardBases(bwp.shards);
const totalLen = bwp.shards.reduce((a, s) => a + s.byteLength, 0);
const concat = new Uint8Array(totalLen);
for (const sh of [...bwp.shards].sort((a, b) => a.id - b.id)) {
	const bytes = shards.find((s) => s.file === sh.file)!.bytes;
	concat.set(bytes, bases[sh.id]);
}

const gguf = bwpToGgufManifest(bwp);

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
	const bwpDtype = bwp.tensors[t.name].dtype as BwpDType;
	const back = decodeTensor(concat.subarray(e.offset, e.offset + e.bytes), e.nElems, bwpDtype);
	const tol = bwpDtype === 'f16' ? 1e-2 : 0;
	for (let i = 0; i < e.nElems; i++) {
		if (Math.abs(back[i] - t.data[i]) > tol * (1 + Math.abs(t.data[i]))) { allOk = false; break; }
	}
}
check('every tensor decodes back from absolute offset', allOk);
check('absolute offset = shard base + intra-shard offset',
	gguf.tensors['blk.1.attn_q.weight'].offset === bases[bwp.tensors['blk.1.attn_q.weight'].shard] + bwp.tensors['blk.1.attn_q.weight'].offset);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
