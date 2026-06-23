// GGUF → BWP converter. Two layers:
//   • assembleBwp(): PURE (no GPU/DOM) — given dequantized tensors + a runtime profile, lays
//     them out into per-layer shards and builds the manifest. Node-testable.
//   • convertModelToBwp(): browser glue — pulls each GGUF tensor through the engine's existing
//     dequant, picks a web dtype (f16 for the big matrices, f32 for tiny norms/biases), and
//     feeds assembleBwp.
// Big matrices → f16 (half the VRAM/bandwidth, read natively by the f16 matmul). Norms and
// biases stay f32 (they're tiny and precision-sensitive).

import { BWP_VERSION, type BwpManifest, type BwpArchProfile, type BwpTensorEntry, type BwpDType } from './format';
import { packShard, type TensorToPack } from './codec';

export interface BwpInputTensor {
	name: string;
	data: Float32Array;
	dtype: BwpDType;
	shape: number[];
}

export interface BwpBuildInput {
	model: { name: string; quantSource?: string };
	arch: BwpArchProfile;
	chat: BwpManifest['chat'];
	tokenizer: BwpManifest['tokenizer'];
	tensors: BwpInputTensor[];
}

export interface BwpBuildOutput {
	manifest: BwpManifest;
	shards: { file: string; bytes: Uint8Array }[];
}

const shardFile = (id: number) => `shard-${String(id).padStart(4, '0')}.bwp`;

// Which shard a tensor belongs to: each transformer block is its own shard (so the loader can
// stream + cache layer by layer), and everything else (embeddings, output head, final norm)
// goes in a shared shard 0.
function groupKey(name: string): string {
	const m = name.match(/^blk\.(\d+)\./);
	return m ? `layer-${m[1].padStart(4, '0')}` : 'shared';
}

// Assemble dequantized tensors into BWP shards + manifest. Pure — same result in browser/Node.
export function assembleBwp(input: BwpBuildInput): BwpBuildOutput {
	// Group tensors; 'shared' first (shard 0), then one shard per layer in numeric order.
	const groups = new Map<string, BwpInputTensor[]>();
	for (const t of input.tensors) {
		const key = groupKey(t.name);
		(groups.get(key) ?? groups.set(key, []).get(key)!).push(t);
	}
	const orderedKeys = [...groups.keys()].sort((a, b) =>
		a === 'shared' ? -1 : b === 'shared' ? 1 : a.localeCompare(b)
	);

	const tensors: Record<string, BwpTensorEntry> = {};
	const shards: BwpBuildOutput['shards'] = [];
	const shardMeta: BwpManifest['shards'] = [];

	orderedKeys.forEach((key, shardId) => {
		const toPack: TensorToPack[] = groups.get(key)!.map((t) => ({
			name: t.name, dtype: t.dtype, shape: t.shape, data: t.data
		}));
		const { buffer, entries } = packShard(toPack, shardId);
		Object.assign(tensors, entries);
		const file = shardFile(shardId);
		shards.push({ file, bytes: buffer });
		shardMeta.push({ id: shardId, file, byteLength: buffer.length });
	});

	const manifest: BwpManifest = {
		format: 'bwp',
		version: BWP_VERSION,
		model: input.model,
		arch: input.arch,
		chat: input.chat,
		tokenizer: input.tokenizer,
		shards: shardMeta,
		tensors
	};
	return { manifest, shards };
}

// f32 unless this is a big 2-D weight matrix (those become f16). Norms/biases are 1-D → f32.
export function pickDType(shape: number[]): BwpDType {
	return shape.length >= 2 ? 'f16' : 'f32';
}
