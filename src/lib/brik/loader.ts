// BRIK loader: turn a parsed BRIK package (manifest + shard byte buffers) into something the
// existing WebGPU engine can run WITHOUT any engine changes. The trick: CustomWebModel reads a
// tensor as `file.slice(offset, offset+bytes)` then `engine.dequantizeByType(type, …)`. So we
// concatenate the shards into ONE Blob and synthesize a GGUF-shaped Manifest whose tensor offsets
// point into that blob, with the dtype mapped to the GGUF type names the engine already decodes
// ('F16' / 'F32'). BRIK then rides the GGUF code path for free.

import type { BrikManifest, BrikDType } from './format';

// Structurally identical to ggufParser's TensorInfo/Manifest, but declared here so the brik module
// stays free of engine imports (keeps the Node test build flat). CustomWebModel consumes this by
// shape — TypeScript's structural typing makes it interchangeable with the real GGUF Manifest.
export interface GgufTensorInfo {
	offset: number;
	bytes: number;
	nElems: number;
	type: string;
	shape: number[];
}
export interface GgufManifest {
	arch: string;
	config: {
		d: number;
		nHeads: number;
		nKvHeads: number;
		headDim: number;
		ffn: number;
		blockCount: number;
		ropeTheta: number;
		rmsEps: number;
		// Optional arch-portability knobs (Gemma-class); absent ⇒ Qwen2/Llama defaults.
		attnLogitSoftcap?: number;
		finalLogitSoftcap?: number;
		attnScale?: number;
		act?: 'silu' | 'gelu';
		rmsGainOnePlus?: boolean;
		embedScale?: number;
		// Profils moteur v2 (miroir de BrikArchProfile / ggufParser Manifest.config).
		rwkv?: { headSize: number; decayLoraRank: number; iclrLoraRank: number; valueLoraRank: number; gateLoraRank: number };
		lfm2?: { lCache: number; kvHeadsPerLayer: number[] };
	};
	tensors: Record<string, GgufTensorInfo>;
}

export interface BrikShardBytes {
	file: string;
	bytes: Uint8Array;
}

// BRIK dtype → the engine's GGUF type-name. F16/F32 are decoded by dequantizeByType directly; Q4W/
// Q8W are BRIK-native quants the engine uploads straight to its fused int4/int8 matmuls (no f32
// expansion) — they are NOT GGUF k-quant types, just the type tags CustomWebModel keys off.
const DTYPE_TO_GGUF: Record<BrikDType, string> = { f16: 'F16', f32: 'F32', q4: 'Q4W', q8: 'Q8W', q3: 'Q3W' };

// Byte offset of each shard within the concatenation, indexed by shard id (shards laid out in
// ascending id order — the same order packShard/assembleBrik emit them).
export function computeShardBases(shards: BrikManifest['shards']): number[] {
	const ordered = [...shards].sort((a, b) => a.id - b.id);
	const bases: number[] = [];
	let off = 0;
	for (const sh of ordered) {
		bases[sh.id] = off;
		off += sh.byteLength;
	}
	return bases;
}

// Build the GGUF-shaped Manifest (offsets absolute into the concatenated shard blob). Pure — no
// Blob/DOM — so the offset math is unit-testable in Node.
export function brikToGgufManifest(brik: BrikManifest): GgufManifest {
	const bases = computeShardBases(brik.shards);
	const tensors: Record<string, GgufTensorInfo> = {};
	for (const [name, t] of Object.entries(brik.tensors)) {
		const type = DTYPE_TO_GGUF[t.dtype];
		if (!type) throw new Error(`dtype BRIK inconnu pour ${name} : ${t.dtype}`);
		if (bases[t.shard] === undefined) throw new Error(`shard ${t.shard} absent du manifeste (tenseur ${name})`);
		tensors[name] = {
			offset: bases[t.shard] + t.offset,
			bytes: t.byteLength,
			nElems: t.nElems,
			type,
			shape: t.shape,
		};
	}
	const a = brik.arch;
	return {
		arch: a.arch,
		config: {
			d: a.d,
			nHeads: a.nHeads,
			nKvHeads: a.nKvHeads,
			headDim: a.headDim,
			ffn: a.ffn,
			blockCount: a.blockCount,
			ropeTheta: a.ropeTheta,
			rmsEps: a.rmsEps,
			// Carry the arch-portability knobs through so a Gemma-class BRIK runs correctly on import.
			attnLogitSoftcap: a.attnLogitSoftcap,
			finalLogitSoftcap: a.finalLogitSoftcap,
			attnScale: a.attnScale,
			act: a.act,
			rmsGainOnePlus: a.rmsGainOnePlus,
			embedScale: a.embedScale,
			// Profils moteur v2 (récurrent/hybride) — sans eux un BRIK rwkv7/lfm2 réimporté perdrait
			// sa config de bloc (l_cache, masque de couches, rangs LoRA).
			rwkv: a.rwkv,
			lfm2: a.lfm2,
		},
		tensors,
	};
}

// Concatenate shard buffers into one Blob in ascending shard-id order, matching the absolute
// offsets brikToGgufManifest computed. Browser/Node both provide Blob.
export function concatShardsToBlob(brik: BrikManifest, shards: BrikShardBytes[]): Blob {
	const fileToBytes = new Map(shards.map((s) => [s.file, s.bytes]));
	const parts: BlobPart[] = [];
	for (const sh of [...brik.shards].sort((a, b) => a.id - b.id)) {
		const bytes = fileToBytes.get(sh.file);
		if (!bytes) throw new Error(`shard manquant : ${sh.file}`);
		if (bytes.length !== sh.byteLength) {
			throw new Error(`taille de shard incohérente pour ${sh.file} : ${bytes.length} ≠ ${sh.byteLength}`);
		}
		parts.push(bytes as BlobPart);
	}
	return new Blob(parts);
}

export interface BrikLoadable {
	blob: Blob;
	manifest: GgufManifest;
	tokenizerId?: string;
	// Embedded tokenizer files (tokenizer.json + tokenizer_config.json), present when the package was
	// built with `kind: 'embedded'` → the runtime builds the tokenizer offline instead of fetching.
	tokenizer?: BrikManifest['tokenizer'];
	uiArch?: string;
	modelName: string;
}

// One-call adapter: BRIK package → { blob, GGUF-manifest, tokenizer/arch hints } for CustomWebModel.
export function brikToLoadable(brik: BrikManifest, shards: BrikShardBytes[]): BrikLoadable {
	return {
		blob: concatShardsToBlob(brik, shards),
		manifest: brikToGgufManifest(brik),
		tokenizerId: brik.tokenizer?.id,
		tokenizer: brik.tokenizer,
		uiArch: brik.model?.uiArch,
		modelName: brik.model.name,
	};
}

// Same, for the single-file .brik container: `data` is the already-concatenated tensor section
// (from container.parseBrik), whose offsets line up with brikToGgufManifest's. The data section
// becomes the single backing Blob CustomWebModel slices per tensor.
export function brikFileToLoadable(brik: BrikManifest, data: Uint8Array): BrikLoadable {
	return {
		blob: new Blob([data as BlobPart]),
		manifest: brikToGgufManifest(brik),
		tokenizerId: brik.tokenizer?.id,
		tokenizer: brik.tokenizer,
		uiArch: brik.model?.uiArch,
		modelName: brik.model.name,
	};
}
