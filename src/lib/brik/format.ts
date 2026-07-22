// BRIK — Brimkern Web Package. A web-optimized REPACK of a GGUF model (NOT a replacement):
// JSON metadata + a runtime profile, tensors in a WGSL-friendly dtype (f16 in v1), 16-byte
// aligned for vec4 loads, sharded per layer for streaming + Cache API. The GGUF path stays the
// default; BRIK is the opt-in "web-focus" fast path. See BRIK_FORMAT.md.

export const BRIK_VERSION = 1;
// Every tensor starts on a 16-byte boundary so it can be read as vec4<f32>/vec4<f16> (128-bit).
export const BRIK_ALIGN = 16;

// Tensor storage dtype on disk. f16/f32 store values directly; q4/q8 are the compact BRIK quants
// (per-32-group int4/int8 + f16 scales) the fused GPU matmuls consume with no f32 expansion —
// small download AND fast inference. v1 shipped f16/f32; q4/q8 are the v2 "web quant" tier.
export type BrikDType = 'f16' | 'f32' | 'q4' | 'q8' | 'q3';

export interface BrikTensorEntry {
	dtype: BrikDType;
	shape: number[];
	nElems: number;
	shard: number;      // index into manifest.shards
	offset: number;     // byte offset within that shard (multiple of BRIK_ALIGN)
	byteLength: number; // encoded length (before alignment padding)
}

// The hyperparameters the engine needs to run the forward pass — lifted out of GGUF's binary KV.
export interface BrikArchProfile {
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
	// Optional arch-portability knobs, carried so a converted Gemma-class BRIK runs correctly on
	// re-import (absent ⇒ Qwen2/Llama defaults). Mirror ggufParser's Manifest.config.
	attnLogitSoftcap?: number;
	finalLogitSoftcap?: number;
	attnScale?: number;
	act?: 'silu' | 'gelu';
	rmsGainOnePlus?: boolean;
	embedScale?: number;
	// RWKV-7 (moteur v2) : head_size + rangs LoRA du time-mix, portés pour le bloc récurrent.
	rwkv?: { headSize: number; decayLoraRank: number; iclrLoraRank: number; valueLoraRank: number; gateLoraRank: number };
	// LFM2/LFM2.5 (moteur v2, hybride) : fenêtre de la conv courte + têtes KV par couche
	// (0 = bloc shortconv, >0 = bloc attention GQA). Miroir de ggufParser.
	lfm2?: { lCache: number; kvHeadsPerLayer: number[] };
}

export interface BrikShard {
	id: number;
	file: string;
	byteLength: number;
}

export interface BrikManifest {
	format: 'brik';
	version: number;
	// uiArch: the engine's UI architecture tag (stop-token + chat-template heuristics) — lets a
	// re-imported BRIK skip the manual arch dropdown. Optional / forward-compatible.
	model: { name: string; quantSource?: string; uiArch?: string };
	arch: BrikArchProfile;
	chat: { template: string; stopTokenIds: number[]; bosTokenId?: number; eosTokenId?: number };
	// 'hf-hub' → loaded over the network by id at runtime. 'embedded' → `json` (tokenizer.json) and
	// `config` (tokenizer_config.json) are stored verbatim IN the package, so the model loads fully
	// offline with no HF fetch and no manual tokenizer pick. `id` is kept either way (fallback / label).
	tokenizer: { kind: 'hf-hub' | 'embedded'; id?: string; json?: string; config?: string };
	shards: BrikShard[];
	tensors: Record<string, BrikTensorEntry>;
	// BRIK image (model.uiArch === 'image') : le fichier transporte sa propre config UNet (topologie
	// diffusers → UnetCfg) — l'app n'a pas à connaître chaque modèle. Absent sur les BRIK LLM.
	image?: { unetCfg?: Record<string, unknown> };
}

// Round a byte length up to the next BRIK_ALIGN boundary.
export function alignUp(n: number, align: number = BRIK_ALIGN): number {
	return Math.ceil(n / align) * align;
}
