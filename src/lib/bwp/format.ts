// BWP — Brimkern Web Package. A web-optimized REPACK of a GGUF model (NOT a replacement):
// JSON metadata + a runtime profile, tensors in a WGSL-friendly dtype (f16 in v1), 16-byte
// aligned for vec4 loads, sharded per layer for streaming + Cache API. The GGUF path stays the
// default; BWP is the opt-in "web-focus" fast path. See BWP_FORMAT.md.

export const BWP_VERSION = 1;
// Every tensor starts on a 16-byte boundary so it can be read as vec4<f32>/vec4<f16> (128-bit).
export const BWP_ALIGN = 16;

export type BwpDType = 'f16' | 'f32';

export interface BwpTensorEntry {
	dtype: BwpDType;
	shape: number[];
	nElems: number;
	shard: number;      // index into manifest.shards
	offset: number;     // byte offset within that shard (multiple of BWP_ALIGN)
	byteLength: number; // encoded length (before alignment padding)
}

// The hyperparameters the engine needs to run the forward pass — lifted out of GGUF's binary KV.
export interface BwpArchProfile {
	arch: string;
	d: number;
	nHeads: number;
	nKvHeads: number;
	headDim: number;
	ffn: number;
	blockCount: number;
	ropeTheta: number;
	rmsEps: number;
	vocab: number;
}

export interface BwpShard {
	id: number;
	file: string;
	byteLength: number;
}

export interface BwpManifest {
	format: 'bwp';
	version: number;
	model: { name: string; quantSource?: string };
	arch: BwpArchProfile;
	chat: { template: string; stopTokenIds: number[]; bosTokenId?: number; eosTokenId?: number };
	tokenizer: { kind: 'hf-hub' | 'embedded'; id?: string };
	shards: BwpShard[];
	tensors: Record<string, BwpTensorEntry>;
}

// Round a byte length up to the next BWP_ALIGN boundary.
export function alignUp(n: number, align: number = BWP_ALIGN): number {
	return Math.ceil(n / align) * align;
}
