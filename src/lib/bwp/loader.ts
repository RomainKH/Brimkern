// BWP loader: turn a parsed BWP package (manifest + shard byte buffers) into something the
// existing WebGPU engine can run WITHOUT any engine changes. The trick: CustomWebModel reads a
// tensor as `file.slice(offset, offset+bytes)` then `engine.dequantizeByType(type, …)`. So we
// concatenate the shards into ONE Blob and synthesize a GGUF-shaped Manifest whose tensor offsets
// point into that blob, with the dtype mapped to the GGUF type names the engine already decodes
// ('F16' / 'F32'). BWP then rides the GGUF code path for free.

import type { BwpManifest, BwpDType } from './format';

// Structurally identical to ggufParser's TensorInfo/Manifest, but declared here so the bwp module
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
	};
	tensors: Record<string, GgufTensorInfo>;
}

export interface BwpShardBytes {
	file: string;
	bytes: Uint8Array;
}

// BWP dtype → the engine's GGUF type-name (dequantizeByType understands these directly).
const DTYPE_TO_GGUF: Record<BwpDType, string> = { f16: 'F16', f32: 'F32' };

// Byte offset of each shard within the concatenation, indexed by shard id (shards laid out in
// ascending id order — the same order packShard/assembleBwp emit them).
export function computeShardBases(shards: BwpManifest['shards']): number[] {
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
export function bwpToGgufManifest(bwp: BwpManifest): GgufManifest {
	const bases = computeShardBases(bwp.shards);
	const tensors: Record<string, GgufTensorInfo> = {};
	for (const [name, t] of Object.entries(bwp.tensors)) {
		const type = DTYPE_TO_GGUF[t.dtype];
		if (!type) throw new Error(`dtype BWP inconnu pour ${name} : ${t.dtype}`);
		if (bases[t.shard] === undefined) throw new Error(`shard ${t.shard} absent du manifeste (tenseur ${name})`);
		tensors[name] = {
			offset: bases[t.shard] + t.offset,
			bytes: t.byteLength,
			nElems: t.nElems,
			type,
			shape: t.shape,
		};
	}
	const a = bwp.arch;
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
		},
		tensors,
	};
}

// Concatenate shard buffers into one Blob in ascending shard-id order, matching the absolute
// offsets bwpToGgufManifest computed. Browser/Node both provide Blob.
export function concatShardsToBlob(bwp: BwpManifest, shards: BwpShardBytes[]): Blob {
	const fileToBytes = new Map(shards.map((s) => [s.file, s.bytes]));
	const parts: BlobPart[] = [];
	for (const sh of [...bwp.shards].sort((a, b) => a.id - b.id)) {
		const bytes = fileToBytes.get(sh.file);
		if (!bytes) throw new Error(`shard manquant : ${sh.file}`);
		if (bytes.length !== sh.byteLength) {
			throw new Error(`taille de shard incohérente pour ${sh.file} : ${bytes.length} ≠ ${sh.byteLength}`);
		}
		parts.push(bytes as BlobPart);
	}
	return new Blob(parts);
}

export interface BwpLoadable {
	blob: Blob;
	manifest: GgufManifest;
	tokenizerId?: string;
	uiArch?: string;
	modelName: string;
}

// One-call adapter: BWP package → { blob, GGUF-manifest, tokenizer/arch hints } for CustomWebModel.
export function bwpToLoadable(bwp: BwpManifest, shards: BwpShardBytes[]): BwpLoadable {
	return {
		blob: concatShardsToBlob(bwp, shards),
		manifest: bwpToGgufManifest(bwp),
		tokenizerId: bwp.tokenizer?.id,
		uiArch: bwp.model?.uiArch,
		modelName: bwp.model.name,
	};
}
