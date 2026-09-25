// K2-Horizon (IFM / MBZUAI) — graphe propre, 100 % résident, une soumission GPU par appel.
//
// Référence : fork llama.cpp MBZUAI-IFM (branche model/K2Horizon, src/models/k2-horizon.cpp) et
// modeling_k2_horizon.py. Pour le 7B dense : un transformer pre-norm Llama/Qwen (GQA 32/8, têtes de
// 128, RoPE NEOX sur toute la tête, θ 1e7, SwiGLU, tête de logits séparée), SAUF ses normes : chaque
// RMSNorm (entrée, pré-FFN, finale) est GROUPÉE — le vecteur de 4 096 coupé en 4 segments normés
// séparément, puis multiplié par le poids complet (kernel rmsnorm_grouped). Les variantes MoE / MoVA
// de la famille (experts, valeurs routées, q/k norm, porte d'attention) ne sont pas gérées : le
// constructeur les refuse plutôt que de produire un graphe faux.

import { CustomWebModel, type TensorSource } from './model';
import { type WebGpuEngine } from './kernels';
import { type Manifest } from './ggufParser';
import { GraphModel, type Gpu } from './graphModel';

interface K2hLayer { attnNorm: Gpu; ffnNorm: Gpu; wq: Gpu; wk: Gpu; wv: Gpu; wo: Gpu; wgate: Gpu; wup: Gpu; wdown: Gpu }

export class K2hModel extends GraphModel<null> {
	private layers: K2hLayer[] = [];
	private finalNormW: Gpu = null;

	constructor(engine: WebGpuEngine, file: Blob | File | TensorSource, manifest: Manifest) {
		super(engine, file, manifest);
		const k = manifest.config.k2h;
		if (!k) throw new Error('K2hModel : manifeste sans config k2h');
		if (k.nExpert > 0) throw new Error('K2-Horizon : variante à experts (MoE/MoVA) non gérée — seul le modèle dense l\'est');
		if (manifest.tensors['blk.0.attn_q_norm.weight'] || manifest.tensors['blk.0.attn_gate.weight']) throw new Error('K2-Horizon : q/k norm ou porte d\'attention non gérées');
	}

	private get groups() { return this.manifest.config.k2h!.normGroups; }

	private async loadLayer(i: number): Promise<K2hLayer> {
		await this.ensureLayerSpan(i);
		const p = `blk.${i}`;
		const vec = async (n: string) => this.up(await this.dequant(`${p}.${n}.weight`));
		const L: K2hLayer = {
			attnNorm: await vec('attn_norm'), ffnNorm: await vec('ffn_norm'),
			wq: await this.mat(`${p}.attn_q.weight`), wk: await this.mat(`${p}.attn_k.weight`),
			wv: await this.mat(`${p}.attn_v.weight`), wo: await this.mat(`${p}.attn_output.weight`),
			wgate: await this.mat(`${p}.ffn_gate.weight`), wup: await this.mat(`${p}.ffn_up.weight`),
			wdown: await this.mat(`${p}.ffn_down.weight`),
		};
		this.dropLayerBytes(i);
		return L;
	}

	async prewarmGpu(onProgress?: (doneBytes: number, totalBytes: number) => void): Promise<void> {
		if (!this.engine.k2hOk) throw new Error('K2-Horizon indisponible sur ce GPU (selfValidate, ou ?k2h=0).');
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
		this.finalNormW = this.up(await this.dequant('output_norm.weight'));
		await this.getProjectionQ8(d);
		await this.engine.settleGpu();
	}

	protected prepareInputs(): Promise<null> { return Promise.resolve(null); }

	public unload(): void {
		this.resetState();
		for (const l of this.layers) for (const b of Object.values(l)) CustomWebModel.destroyWeight(b);
		this.layers = [];
		this.finalNormW?.destroy?.();
		super.unload();
	}

	protected recordForward(enc: Gpu, trash: Gpu[], embeds: Float32Array, _extra: null, T: number, pastLen: number): Gpu {
		const e = this.engine;
		const c = this.manifest.config;
		const { d, nHeads, nKvHeads, headDim: hd, ffn, rmsEps: eps, ropeTheta } = c;
		const G = this.groups, qDim = nHeads * hd, kvDim = nKvHeads * hd, kvLen = pastLen + T;
		const x0 = e.storage(embeds.byteLength); trash.push(x0);
		e.device.queue.writeBuffer(x0, 0, embeds);
		let x: Gpu = x0;
		for (let i = 0; i < c.blockCount; i++) {
			const layerStart = trash.length;
			const w = this.layers[i];
			const n1 = e.recRmsnormGrouped(enc, trash, x, w.attnNorm, T, d, G, eps);
			const q = e.recRope(enc, trash, e.recMM(enc, trash, n1, w.wq, T, d, qDim, false), T * nHeads, hd, nHeads, pastLen, ropeTheta, false);
			const k = e.recRope(enc, trash, e.recMM(enc, trash, n1, w.wk, T, d, kvDim, false), T * nKvHeads, hd, nKvHeads, pastLen, ropeTheta, false);
			const v = e.recMM(enc, trash, n1, w.wv, T, d, kvDim, false);
			const cache = this.ensureKv(i, kvLen, kvDim);
			enc.copyBufferToBuffer(k, 0, cache.k, pastLen * kvDim * 4, T * kvDim * 4);
			enc.copyBufferToBuffer(v, 0, cache.v, pastLen * kvDim * 4, T * kvDim * 4);
			const attn = e.recAttention(enc, trash, q, cache.k, cache.v, T, nHeads, nKvHeads, hd, kvLen, pastLen, 1 / Math.sqrt(hd), 0, 0);
			const h = e.recBinary(enc, trash, 'add', e.recMM(enc, trash, attn, w.wo, T, qDim, d, false), x, T * d);
			const n2 = e.recRmsnormGrouped(enc, trash, h, w.ffnNorm, T, d, G, eps);
			const gu = e.recBinary(enc, trash, 'swiglu', e.recMM(enc, trash, n2, w.wgate, T, d, ffn, false), e.recMM(enc, trash, n2, w.wup, T, d, ffn, false), T * ffn);
			x = e.recBinary(enc, trash, 'add', e.recMM(enc, trash, gu, w.wdown, T, ffn, d, false), h, T * d);
			e.recycleStorage(trash.slice(layerStart).filter((b) => b !== x));
		}
		const normed = e.recRmsnormGrouped(enc, trash, x, this.finalNormW, T, d, G, eps);
		const last = e.storage(d * 4); trash.push(last);
		enc.copyBufferToBuffer(normed, (T - 1) * d * 4, last, 0, d * 4);
		return last;
	}
}
