// GGUF → BRIK converter. Two layers:
//   • assembleBrik(): PURE (no GPU/DOM) — given dequantized tensors + a runtime profile, lays
//     them out into per-layer shards and builds the manifest. Node-testable.
//   • convertModelToBrik(): browser glue — pulls each GGUF tensor through the engine's existing
//     dequant, picks a web dtype (f16 for the big matrices, f32 for tiny norms/biases), and
//     feeds assembleBrik.
// Big matrices → f16 (half the VRAM/bandwidth, read natively by the f16 matmul). Norms and
// biases stay f32 (they're tiny and precision-sensitive).

import { BRIK_VERSION, type BrikManifest, type BrikArchProfile, type BrikTensorEntry, type BrikDType } from './format';
import { packShard, type TensorToPack } from './codec';
import type { GgufManifest } from './loader';

export interface BrikInputTensor {
	name: string;
	dtype: BrikDType;
	shape: number[];
	// f32 values to encode, OR pre-encoded `bytes` (e.g. from the GPU quantizer) + `nElems`.
	data?: Float32Array;
	bytes?: Uint8Array;
	nElems?: number;
}

export interface BrikBuildInput {
	model: BrikManifest['model'];
	arch: BrikArchProfile;
	chat: BrikManifest['chat'];
	tokenizer: BrikManifest['tokenizer'];
	tensors: BrikInputTensor[];
}

export interface BrikBuildOutput {
	manifest: BrikManifest;
	shards: { file: string; bytes: Uint8Array }[];
}

const shardFile = (id: number) => `shard-${String(id).padStart(4, '0')}.brik`;

// Which shard a tensor belongs to: each transformer block is its own shard (so the loader can
// stream + cache layer by layer), and everything else (embeddings, output head, final norm)
// goes in a shared shard 0.
function groupKey(name: string): string {
	const m = name.match(/^blk\.(\d+)\./);
	return m ? `layer-${m[1].padStart(4, '0')}` : 'shared';
}

// Shard order: the shared shard (embeddings/head/final norm) first as shard 0, then one shard per
// layer in numeric order. Shared by assembleBrik (in-memory) and the streaming converter.
function orderShardKeys(keys: string[]): string[] {
	return [...keys].sort((a, b) => (a === 'shared' ? -1 : b === 'shared' ? 1 : a.localeCompare(b)));
}

// Assemble dequantized tensors into BRIK shards + manifest. Pure — same result in browser/Node.
export function assembleBrik(input: BrikBuildInput): BrikBuildOutput {
	// Group tensors; 'shared' first (shard 0), then one shard per layer in numeric order.
	const groups = new Map<string, BrikInputTensor[]>();
	for (const t of input.tensors) {
		const key = groupKey(t.name);
		(groups.get(key) ?? groups.set(key, []).get(key)!).push(t);
	}
	const orderedKeys = orderShardKeys([...groups.keys()]);

	const tensors: Record<string, BrikTensorEntry> = {};
	const shards: BrikBuildOutput['shards'] = [];
	const shardMeta: BrikManifest['shards'] = [];

	orderedKeys.forEach((key, shardId) => {
		const toPack: TensorToPack[] = groups.get(key)!.map((t) => ({
			name: t.name, dtype: t.dtype, shape: t.shape, data: t.data, bytes: t.bytes, nElems: t.nElems
		}));
		const { buffer, entries } = packShard(toPack, shardId);
		Object.assign(tensors, entries);
		const file = shardFile(shardId);
		shards.push({ file, bytes: buffer });
		shardMeta.push({ id: shardId, file, byteLength: buffer.length });
	});

	const manifest: BrikManifest = {
		format: 'brik',
		version: BRIK_VERSION,
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
export function pickDType(shape: number[]): BrikDType {
	return shape.length >= 2 ? 'f16' : 'f32';
}

// The "heavy but fast" weight tiers a BRIK can store its big matrices in. f16 = v1 default; q8/q4
// are the compact web quants (fused GPU matmul, no f32 expansion). Norms/biases always stay f32.
// 'mixed' = corps q4 + attention ENTIÈRE q8 : le plus petit fichier à qualité int8 constatée.
// A/B du 2026-07-15 (?prec=, Qwen 0.5B) : le charabia int4 exige le TOUT-int4 — ancrer l'attention
// en q8 le répare ; la frontière mesurée est attn_v+attn_output, l'attention entière prend une
// marge pour ~+20 Mo vs q4 pur (~379 Mo au lieu de 508 en q8 plein sur le 0.5B).
export type WeightDType = 'f16' | 'q8' | 'q4' | 'q3' | 'mixed';

// Familles ancrées en q8 par le tier 'mixed' (match par sous-chaîne sur le nom GGUF).
const MIXED_Q8 = ['.attn_q.', '.attn_k.', '.attn_v.', '.attn_output.'];

// Per-tensor dtype, given the target precision for the big layer matrices:
//   • 1-D tensors (norms, biases) → f32 (tiny, precision-sensitive).
//   • token_embd / output (embeddings + logit head) → f16: the runtime reads these through the
//     CPU embed-gather and the f32-tile logit projection, neither of which has a quant fast path.
//   • 'mixed' → q8 pour l'attention, q4 pour le reste (voir MIXED_Q8), puis règles ci-dessous.
//   • every other 2-D matrix → the chosen tier, but only if its element count is a multiple of the
//     32-wide quant group (true for Qwen/Llama: d, ffn, kvDim are all ÷32); otherwise fall back to
//     f16 so we never emit a tensor the fused matmul can't consume.
// RWKV-7 (moteur v2) : SEULES les grosses matrices matmul sont quantifiables au tier ; les petites
// sous-projections LoRA (w1/w2/a1/a2/v1/v2/g1/g2), les vecteurs de modulation/lerp et les normes sont
// précision-sensibles et minuscules → restent f16/f32. (token_embd/output suivent la règle générale.)
const RWKV_QUANTIZABLE = ['.time_mix_key.', '.time_mix_value.', '.time_mix_receptance.', '.time_mix_output.', '.channel_mix_key.', '.channel_mix_value.'];

// LFM2/LFM2.5 (moteur v2, hybride) : grosses projections quantifiables au tier ; le poids de conv
// courte (shortconv.conv, [l_cache, d] minuscule et précision-sensible) et les qk-norms restent f32.
const LFM2_QUANTIZABLE = ['.shortconv.in_proj.', '.shortconv.out_proj.', '.attn_q.', '.attn_k.', '.attn_v.', '.attn_output.', '.ffn_gate.', '.ffn_up.', '.ffn_down.'];

export function chooseDType(name: string, shape: number[], nElems: number, weight: WeightDType, arch?: string): BrikDType {
	if (shape.length < 2) return 'f32';
	if (arch === 'lfm2') {
		if (name.includes('.shortconv.conv.')) return 'f32';
		if (name === 'token_embd.weight') { // tête LIÉE : même tenseur = embeddings (gather lignes) + logits (matmul q4/q8)
			if (weight === 'f16') return 'f16';
			return nElems % 32 === 0 ? (weight === 'q3' || weight === 'q4' || weight === 'mixed' ? 'q4' : 'q8') : 'f16';
		}
		if (weight !== 'f16' && nElems % 32 === 0 && LFM2_QUANTIZABLE.some((p) => name.includes(p))) {
			if (weight === 'mixed') return name.includes('.attn_') ? 'q8' : 'q4'; // même contrat que le mixed transformer
			return weight; // q3/q4/q8 — les embeddings/tête gardent le plancher q4 (branche ci-dessus)
		}
		return 'f16';
	}
	if (arch === 'rwkv7' || arch === 'rwkv6') {
		if (name === 'token_embd.weight' || name === 'output.weight') {
			if (weight === 'f16') return 'f16';
			// mixed : embeddings/tête restent q4 — l'ablation CPU (2026-07-20, brik-cpuref MIX=) montre
			// que la sensibilité q4 du 0.1B est dans les projections time_mix, pas ici.
			return nElems % 32 === 0 ? (weight === 'q3' || weight === 'q4' || weight === 'mixed' ? 'q4' : 'q8') : 'f16';
		}
		if (weight !== 'f16' && nElems % 32 === 0 && RWKV_QUANTIZABLE.some((p) => name.includes(p))) {
			// mixed RWKV : time_mix (attention linéaire) ancré q8, channel_mix q4 — même logique que le
			// mixed transformer (attention q8), frontière mesurée par ablation sur la détection de langue.
			if (weight === 'mixed') return name.includes('.time_mix_') ? 'q8' : 'q4';
			return weight; // grosses projections → tier ; reste → f16
		}
		return 'f16';
	}
	const tier = weight; // tier DEMANDÉ (avant le remap mixed→q4/q8) — les embeddings en dépendent
	if (weight === 'mixed') weight = MIXED_Q8.some((p) => name.includes(p)) ? 'q8' : 'q4';
	if (name === 'token_embd.weight' || name === 'output.weight') {
		// Embeddings + tête de logits : gather par lignes + tuiles de projection côté model.ts.
		// Depuis 2026-07-19 le runtime sait les lire en q4 (q4RowsBlob + tuiles {nib,sc,mn} → fused
		// matmul q4) : le tier q4 les émet en q4 (~-155 Mo sur un vocab 152k). Le tier MIXED garde le
		// plancher q8 (c'est son contrat qualité) ; f16 inchangé. ⚠️ Un .brik à embeddings q4 exige
		// un runtime ≥ 2026-07-19 (les anciens ne connaissent pas le gather q4).
		if (tier === 'f16') return 'f16';
		// q3 : le corps passe en 3 bits mais les embeddings/tête restent en q4 — le gather par lignes
		// et la projection logits ont un chemin q4 (pas q3), et c'est le meilleur ratio taille/qualité
		// pour une table d'embeddings (déjà sensible en q4).
		if (tier === 'q3') return nElems % 32 === 0 ? 'q4' : 'f16';
		if (tier === 'q4') return nElems % 32 === 0 ? 'q4' : 'f16'; // mixed garde le plancher q8
		return nElems % 32 === 0 ? 'q8' : 'f16';
	}
	if (weight === 'f16') return 'f16';
	return nElems % 32 === 0 ? weight : 'f16';
}

// --- Browser glue: GGUF → BRIK --------------------------------------------------------------
// Dependency-injected so this module never imports the WebGPU engine (keeps the Node test build
// engine-free): the caller supplies how to read a tensor's raw bytes and how to dequantize them.

export type RawReader = (offset: number, byteLength: number) => Promise<Uint8Array>;
export type Dequantizer = (type: string, bytes: Uint8Array, nElems: number) => Promise<Float32Array>;
// Optional GPU quantizer: GGUF tensor bytes → packed q4web/q8web bytes, entirely on the GPU (no CPU
// quantize loop). When provided, q8/q4 tensors are encoded with it instead of the CPU codec.
export type QuantEncoder = (type: string, bytes: Uint8Array, nElems: number, dtype: 'q8' | 'q4') => Promise<Uint8Array>;

export interface ConvertProfile {
	modelName: string;
	quantSource?: string;
	uiArch?: string; // the UI's architecture tag, carried through so a re-import skips the dropdown
	tokenizer: BrikManifest['tokenizer'];
	chat: BrikManifest['chat'];
	// Precision tier for the big layer matrices: 'f16' (default, v1), 'q8' (~half the download/VRAM,
	// near-f16 quality), or 'q4' (~quarter, int4). Embeddings/head/norms ignore this (always f16/f32).
	weightDType?: WeightDType;
	// Surcharge par tenseur du tier choisi par chooseDType. Sert aux tiers MIXTES pilotés par une
	// source externe : un GGUF quantifié par imatrix (unsloth & co) alloue déjà ses bits tenseur par
	// tenseur (3 bits sur q/k/gate/up, 4 sur ffn_down/attn_output, 5 sur attn_v) — cette carte-là est
	// une mesure, pas une intuition, et ce hook permet de la rejouer sans coder un tier de plus.
	// Retourner undefined = laisser chooseDType décider.
	dtypeFor?: (name: string, shape: number[], nElems: number) => BrikDType | undefined;
}

// Pull every GGUF tensor through the engine's dequant, pick a web dtype (f16 for 2-D matrices,
// f32 for tiny 1-D norms/biases), and assemble a BRIK package. Browser-only (the injected
// dequantizer is GPU-backed). onProgress fires per tensor for a UI progress bar.
//
// Memory note: the f16/f32 outputs of all tensors are held at once (assembleBrik packs them
// together) — roughly the f16 size of the model. Practical for small/medium models in a browser.
export async function convertModelToBrik(
	gguf: GgufManifest,
	readRaw: RawReader,
	dequantize: Dequantizer,
	profile: ConvertProfile,
	onProgress?: (done: number, total: number, name: string) => void,
	encodeQuant?: QuantEncoder,
): Promise<BrikBuildOutput> {
	const names = Object.keys(gguf.tensors);
	const weight = profile.weightDType ?? 'f16';

	// Stream by shard: group tensor NAMES per shard, then process ONE shard at a time —
	// read → encode → pack → drop. Only the current shard's decoded tensors (≈ one layer) are held
	// at once, instead of the whole model in f32, so a multi-GB model converts in a browser tab
	// without OOM. Output is byte-identical to assembleBrik (same grouping/order/packing).
	const byKey = new Map<string, string[]>();
	for (const name of names) {
		const key = groupKey(name);
		(byKey.get(key) ?? byKey.set(key, []).get(key)!).push(name);
	}
	const orderedKeys = orderShardKeys([...byKey.keys()]);

	const tensors: Record<string, BrikTensorEntry> = {};
	const shards: BrikBuildOutput['shards'] = [];
	const shardMeta: BrikManifest['shards'] = [];
	let done = 0;

	for (let shardId = 0; shardId < orderedKeys.length; shardId++) {
		const toPack: TensorToPack[] = [];
		for (const name of byKey.get(orderedKeys[shardId])!) {
			const t = gguf.tensors[name];
			const dtype = profile.dtypeFor?.(name, t.shape, t.nElems)
				?? chooseDType(name, t.shape, t.nElems, weight, gguf.arch);
			const raw = await readRaw(t.offset, t.bytes);
			if ((dtype === 'q8' || dtype === 'q4') && encodeQuant) {
				// Quantize on the GPU → packed bytes directly (no CPU dequant→f32 readback + quantize loop).
				const bytes = await encodeQuant(t.type, raw, t.nElems, dtype);
				toPack.push({ name, dtype, shape: t.shape, bytes, nElems: t.nElems });
			} else {
				const data = await dequantize(t.type, raw, t.nElems);
				toPack.push({ name, dtype, shape: t.shape, data });
			}
			onProgress?.(++done, names.length, name);
		}
		const { buffer, entries } = packShard(toPack, shardId);
		Object.assign(tensors, entries);
		const file = shardFile(shardId);
		shards.push({ file, bytes: buffer });
		shardMeta.push({ id: shardId, file, byteLength: buffer.length });
		// `toPack` (this shard's decoded/encoded tensors) drops out of scope before the next shard.
	}

	const embd = gguf.tensors['token_embd.weight'];
	const vocab = embd ? Math.round(embd.nElems / gguf.config.d) : 0;
	const arch: BrikArchProfile = { ...gguf.config, arch: gguf.arch, vocab };

	const manifest: BrikManifest = {
		format: 'brik',
		version: BRIK_VERSION,
		model: { name: profile.modelName, quantSource: profile.quantSource, uiArch: profile.uiArch },
		arch,
		chat: profile.chat,
		tokenizer: profile.tokenizer,
		shards: shardMeta,
		tensors,
	};
	return { manifest, shards };
}
