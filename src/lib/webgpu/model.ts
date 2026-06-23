// Standalone WebGPU model runner. Given a token sequence, it
// embeds the tokens, runs EVERY real transformer layer on the GPU (weights read
// from a local file + dequantized on-device), applies the final norm, and
// projects to logits (tiled over the vocab to stay under WebGPU's max storage-buffer size).
// Returns the greedy next-token id.
//
// Memory: raw quantized tensor bytes are cached; f32 weights are
// dequantized on demand per layer per step and discarded, so resident memory stays bounded.

import { WebGpuEngine, type LayerCfg, type LayerWeights, type LayerWeightsGpu } from './kernels';
import { type Manifest } from './ggufParser';

export class CustomWebModel {
	private engine: WebGpuEngine;
	private file: Blob | File;
	public manifest: Manifest;
	private rawCache = new Map<string, Uint8Array>();

	constructor(engine: WebGpuEngine, file: Blob | File, manifest: Manifest) {
		this.engine = engine;
		this.file = file;
		this.manifest = manifest;
	}

	get loaded() {
		return this.manifest !== null;
	}

	async loadManifest(): Promise<Manifest> {
		return this.manifest;
	}

	// Raw bytes of a tensor, read from local File / Blob and cached in RAM.
	private async rawTensor(name: string): Promise<Uint8Array> {
		const cached = this.rawCache.get(name);
		if (cached) return cached;
		const t = this.manifest.tensors[name];
		if (!t) throw new Error('tensor absent du manifeste: ' + name);
		
		// Slice the local file/blob to extract this tensor's specific binary block
		const blob = this.file.slice(t.offset, t.offset + t.bytes);
		const buffer = await blob.arrayBuffer();
		const bytes = new Uint8Array(buffer);
		
		this.rawCache.set(name, bytes);
		return bytes;
	}

	// Dequantize a full tensor (by manifest type) to f32 (CPU-visible). Used for small tensors
	// (norms/biases).
	private async dequant(name: string): Promise<Float32Array> {
		const t = this.manifest.tensors[name];
		const bytes = await this.rawTensor(name);
		return this.engine.dequantizeByType(t.type, bytes, t.nElems);
	}

	// Dequantize a weight matrix straight into a PERSISTENT GPU buffer — uploaded once, reused
	// as a matmul operand across every decode step (no per-token re-upload).
	private async dequantGpu(name: string): Promise<any> {
		const t = this.manifest.tensors[name];
		const bytes = await this.rawTensor(name);
		return this.engine.dequantizeToGpu(t.type, bytes, t.nElems);
	}

	// Same, but the persistent weight buffer is packed f16 (half the VRAM/bandwidth). Read by the
	// f16 matmul (matmul_t_f16w). Dequant runs to f32 first, then we re-pack to f16 once.
	private async dequantGpuF16(name: string): Promise<any> {
		const t = this.manifest.tensors[name];
		const bytes = await this.rawTensor(name);
		const f32 = await this.engine.dequantizeByType(t.type, bytes, t.nElems);
		return this.engine.uploadGpuF16(f32);
	}

	// Precision of the persistent LAYER weight matrices: 'f32' (default) or 'f16' (the BWP path).
	// Norms/biases and the embed/logit projections stay f32 either way.
	private weightPrecision: 'f32' | 'f16' = 'f32';
	get precision() { return this.weightPrecision; }

	// Switch layer-weight precision: frees the currently-cached GPU buffers so the next forward
	// rebuilds them at the new precision. Only does work when the precision actually changes.
	public setWeightPrecision(p: 'f32' | 'f16') {
		if (p === this.weightPrecision) return;
		for (const w of this.layerGpuCache.values()) {
			for (const b of Object.values(w)) (b as any)?.destroy?.();
		}
		this.layerGpuCache.clear();
		this.weightPrecision = p;
	}

	// Dequantized layer weights, cached across decode steps.
	private layerCache = new Map<number, LayerWeights>();

	private async layerWeights(idx: number): Promise<LayerWeights> {
		const cached = this.layerCache.get(idx);
		if (cached) return cached;
		const p = `blk.${idx}`;
		// Matrices → persistent GPU buffers (reused every step); norms/biases → small f32.
		const [attnNorm, wq, wk, wv, wo, ffnNorm, wgate, wup, wdown, bq, bk, bv] = await Promise.all([
			this.dequant(`${p}.attn_norm.weight`),
			this.dequantGpu(`${p}.attn_q.weight`),
			this.dequantGpu(`${p}.attn_k.weight`),
			this.dequantGpu(`${p}.attn_v.weight`),
			this.dequantGpu(`${p}.attn_output.weight`),
			this.dequant(`${p}.ffn_norm.weight`),
			this.dequantGpu(`${p}.ffn_gate.weight`),
			this.dequantGpu(`${p}.ffn_up.weight`),
			this.dequantGpu(`${p}.ffn_down.weight`),
			this.dequant(`${p}.attn_q.bias`).catch(() => undefined),
			this.dequant(`${p}.attn_k.bias`).catch(() => undefined),
			this.dequant(`${p}.attn_v.bias`).catch(() => undefined)
		]);
		const w = { attnNorm, wq, wk, wv, wo, ffnNorm, wgate, wup, wdown, bq, bk, bv } as LayerWeights;
		this.layerCache.set(idx, w);
		return w;
	}

	// GPU-resident layer weights: EVERY tensor (matrices AND norms/biases) is a persistent GPU
	// buffer, uploaded once and reused across all decode steps. Feeds engine.runDecodeGpu.
	private layerGpuCache = new Map<number, LayerWeightsGpu>();
	private finalNormGpu: any = null;

	private async layerWeightsGpu(idx: number): Promise<LayerWeightsGpu> {
		const cached = this.layerGpuCache.get(idx);
		if (cached) return cached;
		const p = `blk.${idx}`;
		const up = (a: Float32Array) => this.engine.uploadGpu(a);
		// Projection matrices: f16 buffers in the f16 path, f32 (dequant-on-GPU) otherwise.
		const f16 = this.weightPrecision === 'f16';
		const mat = (name: string) => (f16 ? this.dequantGpuF16(name) : this.dequantGpu(name));
		const [attnNorm, wq, wk, wv, wo, ffnNorm, wgate, wup, wdown, bq, bk, bv] = await Promise.all([
			this.dequant(`${p}.attn_norm.weight`).then(up),
			mat(`${p}.attn_q.weight`),
			mat(`${p}.attn_k.weight`),
			mat(`${p}.attn_v.weight`),
			mat(`${p}.attn_output.weight`),
			this.dequant(`${p}.ffn_norm.weight`).then(up),
			mat(`${p}.ffn_gate.weight`),
			mat(`${p}.ffn_up.weight`),
			mat(`${p}.ffn_down.weight`),
			this.dequant(`${p}.attn_q.bias`).then(up).catch(() => undefined),
			this.dequant(`${p}.attn_k.bias`).then(up).catch(() => undefined),
			this.dequant(`${p}.attn_v.bias`).then(up).catch(() => undefined)
		]);
		const w = { attnNorm, wq, wk, wv, wo, ffnNorm, wgate, wup, wdown, bq, bk, bv, matF16: f16 } as LayerWeightsGpu;
		this.layerGpuCache.set(idx, w);
		return w;
	}

	private async getFinalNormGpu(): Promise<any> {
		if (!this.finalNormGpu) this.finalNormGpu = this.engine.uploadGpu(await this.dequant('output_norm.weight'));
		return this.finalNormGpu;
	}

	// Embedding rows for the prompt tokens, gathered from token_embd.
	public async embed(tokens: number[], d: number): Promise<Float32Array> {
		const info = this.manifest.tensors['token_embd.weight'];
		// GGUF stores tensor dims innermost-first, so shape[0] is n_embd (= d), NOT the vocab.
		// Derive the row count from total elements / embedding dim (correct for either dim order).
		const vocab = info.nElems / d;
		const bytesPerRow = info.bytes / vocab;
		if (!Number.isInteger(bytesPerRow)) throw new Error('token_embd: lignes non uniformes');
		const raw = await this.rawTensor('token_embd.weight');
		const out = new Float32Array(tokens.length * d);
		for (let i = 0; i < tokens.length; i++) {
			const r = tokens[i];
			const rowBytes = raw.subarray(r * bytesPerRow, (r + 1) * bytesPerRow);
			const row = await this.engine.dequantizeByType(info.type, rowBytes, d);
			out.set(row, i * d);
		}
		return out;
	}

	// Greedy next-token logits → argmax, tiling the vocab so each output matmul's weight
	// buffer stays well under maxStorageBufferBindingSize.
	public async argmaxLogits(hiddenLast: Float32Array, d: number): Promise<number> {
		// Untied models (like Llama) use 'output.weight' for projection, 
		// tied models (like Qwen) reuse 'token_embd.weight'.
		const projectionTensorName = this.manifest.tensors['output.weight'] ? 'output.weight' : 'token_embd.weight';
		const info = this.manifest.tensors[projectionTensorName];
		if (!info) throw new Error(`Logits projection tensor not found (tried output.weight and token_embd.weight)`);

		// shape[0] is n_embd (GGUF dim order), not the vocab — derive vocab from nElems / d.
		const vocab = info.nElems / d;
		const bytesPerRow = info.bytes / vocab;
		const raw = await this.rawTensor(projectionTensorName);
		const TILE = 8192;
		let bestIdx = -1;
		let bestVal = -Infinity;
		for (let r0 = 0; r0 < vocab; r0 += TILE) {
			const rows = Math.min(TILE, vocab - r0);
			const tileBytes = raw.subarray(r0 * bytesPerRow, (r0 + rows) * bytesPerRow);
			// Dequantize the tile straight onto the GPU and matmul from there — no dequant→CPU
			// →re-upload round-trip (the matmul still reads its logits back for the argmax).
			const tileBuf = this.engine.dequantizeToGpu(info.type, tileBytes, rows * d);
			const logits = await this.engine.matmulT(hiddenLast, tileBuf, 1, d, rows);
			tileBuf.destroy?.();
			for (let j = 0; j < rows; j++) {
				if (logits[j] > bestVal) { bestVal = logits[j]; bestIdx = r0 + j; }
			}
		}
		return bestIdx;
	}

	// Reset between generations: clear ONLY the KV cache (each message re-prefills the full
	// history). The dequantized weights stay resident on the GPU — uploaded once, reused.
	public reset() {
		this.engine.clearKvCache();
	}

	// Full teardown when the model is unloaded/replaced: release the persistent GPU buffers and
	// every cache so a fresh model starts clean and GPU memory is reclaimed.
	public unload() {
		this.reset();
		for (const w of this.layerGpuCache.values()) {
			for (const b of Object.values(w)) (b as any)?.destroy?.();
		}
		this.layerGpuCache.clear();
		this.finalNormGpu?.destroy?.();
		this.finalNormGpu = null;
		this.layerCache.clear();
		this.rawCache.clear();
	}

	// GPU-resident forward over the input tokens (prefill: all prompt tokens with pastLen 0;
	// decode: [lastGeneratedToken] with pastLen = tokens so far). The whole layer stack + final
	// norm execute as a SINGLE queue submit with the KV cache living on the GPU; only the last
	// token's hidden state is read back, then projected to logits. Returns the greedy next id.
	async generateNextKV(tokens: number[], pastLen: number, sessionId: string): Promise<number> {
		const m = this.manifest;
		const { d, nHeads, nKvHeads, headDim, ffn, blockCount, ropeTheta, rmsEps } = m.config;
		const seq = tokens.length;
		const cfg: LayerCfg = { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps: rmsEps };

		const embeds = await this.embed(tokens, d);
		const layers = await Promise.all(
			Array.from({ length: blockCount }, (_, i) => this.layerWeightsGpu(i))
		);
		const finalNorm = await this.getFinalNormGpu();
		const hiddenLast = await this.engine.runDecodeGpu(embeds, cfg, layers, pastLen, finalNorm, sessionId);
		return this.argmaxLogits(hiddenLast, d);
	}

	// Full forward over the token sequence (prefill and greedy decode, no KV cache).
	async generateNext(tokens: number[]): Promise<number> {
		const m = this.manifest;
		const { d, nHeads, nKvHeads, headDim, ffn, blockCount, ropeTheta, rmsEps } = m.config;
		const seq = tokens.length;
		let x = await this.embed(tokens, d);
		const cfg: LayerCfg = { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps: rmsEps };
		for (let idx = 0; idx < blockCount; idx++) {
			const w = await this.layerWeights(idx);
			x = await this.engine.layerForward(x, cfg, w, true);
		}
		const finalNorm = await this.dequant('output_norm.weight');
		x = await this.engine.rmsnorm(x, finalNorm, seq, d, rmsEps);
		const hiddenLast = x.subarray((seq - 1) * d, seq * d);
		return this.argmaxLogits(new Float32Array(hiddenLast), d);
	}
}
