// Node test for the BWP converter assembly (no GPU). Run via `npm run test:bwp`.
// Builds a synthetic 2-layer model, assembles BWP, and checks: one shard per layer + a shared
// shard, every manifest entry points at the right shard/offset, and every tensor decodes back.

import { assembleBwp, pickDType, type BwpInputTensor } from './convert';
import { decodeTensor } from './codec';
import { BWP_ALIGN, type BwpArchProfile } from './format';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) console.log(`  ok   ${name}`);
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1));

const d = 16, ffn = 32, kvDim = 8, blocks = 2;
const arch: BwpArchProfile = {
	arch: 'qwen2', d, nHeads: 4, nKvHeads: 2, headDim: 4, ffn, blockCount: blocks,
	ropeTheta: 1e6, rmsEps: 1e-6, vocab: 40
};

const tensors: BwpInputTensor[] = [];
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

const { manifest, shards } = assembleBwp({
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
	if (e.offset % BWP_ALIGN !== 0) allAligned = false;
	const shard = shards[e.shard];
	if (shardFileToId(shard.file) !== e.shard) allOk = false;
	const back = decodeTensor(shard.bytes.subarray(e.offset, e.offset + e.byteLength), e.nElems, e.dtype);
	const tol = e.dtype === 'f16' ? 1e-2 : 0;
	for (let i = 0; i < e.nElems; i++) {
		if (Math.abs(back[i] - t.data[i]) > tol * (1 + Math.abs(t.data[i]))) allOk = false;
	}
}
function shardFileToId(file: string): number { return parseInt(file.match(/(\d+)/)![1], 10); }
check('all tensor offsets 16-aligned', allAligned);
check('all tensors decode back from their shard', allOk);
check('shard byteLength matches buffer', shards.every((s, i) => manifest.shards[i].byteLength === s.bytes.length));

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
