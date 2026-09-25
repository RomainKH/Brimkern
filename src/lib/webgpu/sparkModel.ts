// Spark-X2.5 (4B) — graphe propre, 100 % résident, une soumission GPU par appel.
//
// Référence : llama.cpp src/models/spark2-5.cpp (b10828+). Un transformer pre-norm classique, sauf :
//   1. QKV FUSIONNÉ (attn_qkv [d → q|k|v]) : découpé au CHARGEMENT en trois matrices (les lignes de
//      sortie d'un tenseur quantifié sont contiguës), le graphe n'a donc aucun découpage à faire ;
//   2. porte SCALAIRE par (token, tête) : sigmoid(attn_norm(x)·Wg) [d → nHeads] multiplie la sortie
//      d'attention de la tête avant attn_output (kernel head_gate) ;
//   3. 3 couches à fenêtre glissante (512, θ 1e4, RoPE sur toute la tête) pour 1 globale (θ 5e6,
//      RoPE NEOX PARTIEL sur les 64 premières dimensions des têtes de 256) ;
//   4. FFN GELU (ggml_gelu, approximation tanh) gate·up, pas de q/k norm, tête liée à token_embd.

import { CustomWebModel, type TensorSource } from './model';
import { type WebGpuEngine } from './kernels';
import { type Manifest } from './ggufParser';
import { GraphModel, type Gpu } from './graphModel';

interface SparkLayer { attnNorm: Gpu; ffnNorm: Gpu; wq: Gpu; wk: Gpu; wv: Gpu; wg: Gpu; wo: Gpu; wgate: Gpu; wup: Gpu; wdown: Gpu }

// Octets d'une ligne de `k` éléments selon le type GGUF (blocs de 256 pour les K-quants, 32 sinon).
function rowBytes(type: string, k: number): number {
	const kq: Record<string, number> = { Q4_K: 144, Q5_K: 176, Q6_K: 210, Q8_K: 292 };
	const q: Record<string, number> = { Q8_0: 34, Q4_0: 18, Q4_1: 20, Q5_0: 22, Q5_1: 24 };
	if (kq[type]) return (k / 256) * kq[type];
	if (q[type]) return (k / 32) * q[type];
	if (type === 'F16' || type === 'BF16') return k * 2;
	if (type === 'F32') return k * 4;
	throw new Error(`Spark : type ${type} non géré pour attn_qkv`);
}

export class SparkModel extends GraphModel<null> {
	private layers: SparkLayer[] = [];

	constructor(engine: WebGpuEngine, file: Blob | File | TensorSource, manifest: Manifest) {
		super(engine, file, manifest);
		if (!manifest.config.spark) throw new Error('SparkModel : manifeste sans config spark');
	}

	private get sp() { return this.manifest.config.spark!; }

	private async loadLayer(i: number): Promise<SparkLayer> {
		await this.ensureLayerSpan(i);
		const p = `blk.${i}`;
		const { d, nHeads, nKvHeads, headDim } = this.manifest.config;
		const [attnNorm, ffnNorm] = await Promise.all([
			this.dequant(`${p}.attn_norm.weight`).then((a) => this.up(a)),
			this.dequant(`${p}.ffn_norm.weight`).then((a) => this.up(a)),
		]);
		// q | k | v : tranches de lignes du tenseur fusionné, quantification d'origine conservée.
		const qkvName = `${p}.attn_qkv.weight`;
		const qkv = this.manifest.tensors[qkvName];
		const raw = await this.rawTensor(qkvName);
		const rb = rowBytes(qkv.type, d);
		const qRows = nHeads * headDim, kvRows = nKvHeads * headDim;
		const slice = (r0: number, rows: number) => this.mat(qkvName, raw.subarray(r0 * rb, (r0 + rows) * rb), rows * d);
		const wq = await slice(0, qRows);
		const wk = await slice(qRows, kvRows);
		const wv = await slice(qRows + kvRows, kvRows);
		const wg = await this.mat(`${p}.attn_gate.weight`);
		const wo = await this.mat(`${p}.attn_output.weight`);
		const wgate = await this.mat(`${p}.ffn_gate.weight`);
		const wup = await this.mat(`${p}.ffn_up.weight`);
		const wdown = await this.mat(`${p}.ffn_down.weight`);
		this.dropLayerBytes(i);
		return { attnNorm, ffnNorm, wq, wk, wv, wg, wo, wgate, wup, wdown };
	}

	async prewarmGpu(onProgress?: (doneBytes: number, totalBytes: number) => void): Promise<void> {
		if (!this.engine.sparkOk) throw new Error('Spark-X2.5 indisponible sur ce GPU (selfValidate, ou ?spark=0).');
		const { blockCount, d } = this.manifest.config;
		const layerBytes = this.layerBytes(blockCount);
		const total = layerBytes.reduce((a, b) => a + b, 0);
		let done = 0;
		for (let i = 0; i < blockCount; i++) {
			this.layers[i] = await this.loadLayer(i);
			await this.engine.settleGpu(); // cf. Gemma4Model.prewarmGpu : sans ça le pic double
			done += layerBytes[i];
			onProgress?.(done, total);
		}
		await this.getFinalNormGpu();
		await this.getProjectionQ8(d);
		await this.engine.settleGpu();
	}

	protected prepareInputs(): Promise<null> { return Promise.resolve(null); }

	public unload(): void {
		this.resetState();
		for (const l of this.layers) for (const b of Object.values(l)) CustomWebModel.destroyWeight(b);
		this.layers = [];
		super.unload();
	}

	protected recordForward(enc: Gpu, trash: Gpu[], embeds: Float32Array, _extra: null, T: number, pastLen: number, taps?: Gpu[]): Gpu {
		const e = this.engine;
		const c = this.manifest.config, s = this.sp;
		const { d, nHeads, nKvHeads, headDim: hd, ffn, rmsEps: eps } = c;
		const qDim = nHeads * hd, kvDim = nKvHeads * hd, kvLen = pastLen + T;
		const x0 = e.storage(embeds.byteLength); trash.push(x0);
		e.device.queue.writeBuffer(x0, 0, embeds);
		let x: Gpu = x0;
		for (let i = 0; i < c.blockCount; i++) {
			const layerStart = trash.length;
			const w = this.layers[i];
			const swa = s.swa[i];
			const theta = swa ? s.ropeThetaSwa : c.ropeTheta;
			const nRot = swa ? s.nRotSwa : s.nRot;
			const rope = (v: Gpu, nH: number) => nRot >= hd
				? e.recRope(enc, trash, v, T * nH, hd, nH, pastLen, theta, false)
				: e.recRopePartial(enc, trash, v, T * nH, hd, nH, pastLen, theta, nRot);

			const n1 = e.recRmsnorm(enc, trash, x, w.attnNorm, T, d, eps);
			const q = rope(e.recMM(enc, trash, n1, w.wq, T, d, qDim, false), nHeads);
			const k = rope(e.recMM(enc, trash, n1, w.wk, T, d, kvDim, false), nKvHeads);
			const v = e.recMM(enc, trash, n1, w.wv, T, d, kvDim, false);
			const cache = this.ensureKv(i, kvLen, kvDim);
			enc.copyBufferToBuffer(k, 0, cache.k, pastLen * kvDim * 4, T * kvDim * 4);
			enc.copyBufferToBuffer(v, 0, cache.v, pastLen * kvDim * 4, T * kvDim * 4);
			const attn = e.recAttention(enc, trash, q, cache.k, cache.v, T, nHeads, nKvHeads, hd, kvLen, pastLen, 1 / Math.sqrt(hd), 0, swa ? s.window : 0);
			const gate = e.recMM(enc, trash, n1, w.wg, T, d, nHeads, false);
			const gated = e.recHeadGate(enc, trash, attn, gate, T * qDim, hd);
			const h = e.recBinary(enc, trash, 'add', e.recMM(enc, trash, gated, w.wo, T, qDim, d, false), x, T * d);

			const n2 = e.recRmsnorm(enc, trash, h, w.ffnNorm, T, d, eps);
			const gu = e.recBinary(enc, trash, 'geglu', e.recMM(enc, trash, n2, w.wgate, T, d, ffn, false), e.recMM(enc, trash, n2, w.wup, T, d, ffn, false), T * ffn);
			x = e.recBinary(enc, trash, 'add', e.recMM(enc, trash, gu, w.wdown, T, ffn, d, false), h, T * d);
			taps?.push(x);
			if (!taps) e.recycleStorage(trash.slice(layerStart).filter((b) => b !== x));
		}
		const normed = e.recRmsnorm(enc, trash, x, this.finalNormGpu, T, d, eps);
		const last = e.storage(d * 4); trash.push(last);
		enc.copyBufferToBuffer(normed, (T - 1) * d * 4, last, 0, d * 4);
		return last;
	}

	// BANC : sortie de chaque couche (l_out-N de llama-eval-callback) sur un forward.
	async debugLayerOutputs(tokens: number[]): Promise<Float32Array[]> {
		const e = this.engine;
		const { embeds } = await this.prepare(tokens, 0, 'debug-layers');
		const { d } = this.manifest.config;
		const trash: Gpu[] = [], taps: Gpu[] = [];
		const enc = e.device.createCommandEncoder();
		this.recordForward(enc, trash, embeds, null, tokens.length, 0, taps);
		e.device.queue.submit([enc.finish()]);
		const out: Float32Array[] = [];
		for (const t of taps) out.push(await e.readBack(t, tokens.length * d * 4));
		e.release(trash);
		return out;
	}
}
