// Qwen 3.5 (0.8B → 9B dense) — hybride Gated DeltaNet + attention pleine, graphe propre, résident.
//
// Référence : llama.cpp src/models/qwen35.cpp + delta-net-base.cpp + ggml-cpu (gated_delta_net),
// b10050. Trois couches sur quatre sont « linéaires » (DeltaNet) ; la quatrième est une attention
// pleine à sortie gatée. Le SDK envoyait ces GGUF dans le chemin transformer commun, qui s'arrêtait
// dès la couche 0 (pas d'attn_q) : le preset CLI `super-coder` n'a donc jamais pu tourner.
//
// Couche DeltaNet (i % 4 != 3) :
//   qkv = x·Wqkv [q 16×128 | k 16×128 | v 32×128] → conv causale k=4 + SiLU (état [3, 8 192])
//   → Gated DeltaNet par tête de valeur (état [32, 128, 128], cf. shader qwen35_gdn_batch)
//   → rmsnorm par tête (ssm_norm) ⊙ SiLU(x·Wz) → ·Wout.
// Couche d'attention (i % 4 == 3) :
//   attn_q sort [q | porte] ENTRELACÉS par tête (256 + 256) : les lignes sont séparées au chargement
//   en deux matrices, ce qui rend q et la porte contigus sans vue à pas ; q/k normés par tête, RoPE
//   PARTIEL (64 dims sur 256, θ 1e7), attention GQA 16/4, sortie ⊙ σ(porte) → ·Wo.
// Puis FFN SwiGLU (la norme pré-FFN s'appelle post_attention_norm dans le GGUF).
// block_count compte la couche MTP (nextn) finale : ignorée ici.

import { CustomWebModel, type TensorSource } from './model';
import { type WebGpuEngine } from './kernels';
import { type Manifest } from './ggufParser';
import { GraphModel, type Gpu } from './graphModel';

interface Q35Layer {
	recurrent: boolean;
	attnNorm: Gpu; ffnNorm: Gpu;
	wgate: Gpu; wup: Gpu; wdown: Gpu;
	// DeltaNet
	wqkv?: Gpu; wz?: Gpu; walpha?: Gpu; wbeta?: Gpu; conv?: Gpu; dt?: Gpu; A?: Gpu; ssmNorm?: Gpu; wout?: Gpu;
	// Attention
	wq?: Gpu; wqGate?: Gpu; wk?: Gpu; wv?: Gpu; wo?: Gpu; qNorm?: Gpu; kNorm?: Gpu;
}

export class Qwen35Model extends GraphModel<null> {
	private layers: Q35Layer[] = [];
	private convState = new Map<number, Gpu>();
	private ssmState = new Map<number, Gpu>();

	constructor(engine: WebGpuEngine, file: Blob | File | TensorSource, manifest: Manifest) {
		super(engine, file, manifest);
		if (!manifest.config.qwen35) throw new Error('Qwen35Model : manifeste sans config qwen35');
	}

	private get q() { return this.manifest.config.qwen35!; }
	private get nLayer() { return this.q.nLayer; }
	private isRecurrent(i: number) { return (i + 1) % this.q.fullAttnInterval !== 0; }

	// Dimensions DeltaNet (4B : Hk 16 × 128, Hv 32 × 128, conv sur 2·2 048 + 4 096 = 8 192 canaux).
	private get ssm() {
		const S = this.q.dState, Hk = this.q.nGroup, Hv = this.q.dtRank;
		return { S, Hk, Hv, kOff: Hk * S, vOff: 2 * Hk * S, C: 2 * Hk * S + Hv * S, dInner: Hv * S };
	}

	// attn_q : lignes [q_h (256) | porte_h (256)] par tête → deux jeux de lignes. Les lignes GGUF sont
	// autonomes (blocs entiers par ligne), la séparation se fait sur les octets bruts.
	private async splitQGate(name: string): Promise<[Gpu, Gpu]> {
		const t = this.manifest.tensors[name];
		const raw = await this.rawTensor(name);
		const { nHeads, headDim, d } = this.manifest.config;
		const rows = 2 * nHeads * headDim;
		const rowBytes = raw.byteLength / rows;
		if (!Number.isInteger(rowBytes)) throw new Error(`${name} : lignes non uniformes`);
		const q = new Uint8Array(nHeads * headDim * rowBytes), g = new Uint8Array(nHeads * headDim * rowBytes);
		for (let h = 0; h < nHeads; h++) {
			const src = h * 2 * headDim * rowBytes, dst = h * headDim * rowBytes, len = headDim * rowBytes;
			q.set(raw.subarray(src, src + len), dst);
			g.set(raw.subarray(src + len, src + 2 * len), dst);
		}
		void t;
		const n = nHeads * headDim * d;
		return [await this.mat(name, q, n), await this.mat(name, g, n)];
	}

	private async loadLayer(i: number): Promise<Q35Layer> {
		await this.ensureLayerSpan(i);
		const p = `blk.${i}`;
		const vec = async (n: string) => this.up(await this.dequant(`${p}.${n}`));
		const recurrent = this.isRecurrent(i);
		const L: Q35Layer = {
			recurrent,
			attnNorm: await vec('attn_norm.weight'),
			ffnNorm: await vec('post_attention_norm.weight'),
			wgate: await this.mat(`${p}.ffn_gate.weight`),
			wup: await this.mat(`${p}.ffn_up.weight`),
			wdown: await this.mat(`${p}.ffn_down.weight`),
		};
		if (recurrent) {
			L.wqkv = await this.mat(`${p}.attn_qkv.weight`);
			L.wz = await this.mat(`${p}.attn_gate.weight`);
			L.walpha = await this.mat(`${p}.ssm_alpha.weight`);
			L.wbeta = await this.mat(`${p}.ssm_beta.weight`);
			L.conv = await vec('ssm_conv1d.weight');
			L.dt = await vec('ssm_dt.bias');
			L.A = await vec('ssm_a');
			L.ssmNorm = await vec('ssm_norm.weight');
			L.wout = await this.mat(`${p}.ssm_out.weight`);
		} else {
			[L.wq, L.wqGate] = await this.splitQGate(`${p}.attn_q.weight`);
			L.wk = await this.mat(`${p}.attn_k.weight`);
			L.wv = await this.mat(`${p}.attn_v.weight`);
			L.wo = await this.mat(`${p}.attn_output.weight`);
			L.qNorm = await vec('attn_q_norm.weight');
			L.kNorm = await vec('attn_k_norm.weight');
		}
		this.dropLayerBytes(i);
		return L;
	}

	async prewarmGpu(onProgress?: (doneBytes: number, totalBytes: number) => void): Promise<void> {
		if (!this.engine.qwen35SsmOk) throw new Error('Qwen 3.5 indisponible sur ce GPU (selfValidate, ou ?qwen35ssm=0).');
		const { d } = this.manifest.config;
		const layerBytes = this.layerBytes(this.nLayer);
		const total = layerBytes.reduce((a, b) => a + b, 0);
		let done = 0;
		for (let i = 0; i < this.nLayer; i++) {
			this.layers[i] = await this.loadLayer(i);
			await this.engine.settleGpu(); // cf. GraphModel / Gemma 4 : borne le transitoire à une couche
			done += layerBytes[i];
			onProgress?.(done, total);
		}
		await this.getFinalNormGpu();
		await this.getProjectionQ8(d);
		await this.engine.settleGpu();
	}

	// État récurrent (conv + DeltaNet) : remis à zéro avec le KV — il n'est pas « rembobinable ».
	protected resetState(): void {
		super.resetState();
		for (const b of this.convState.values()) b.destroy?.();
		for (const b of this.ssmState.values()) b.destroy?.();
		this.convState.clear();
		this.ssmState.clear();
	}

	private zeroed(bytes: number): Gpu {
		const G = globalThis as any;
		// createBuffer rend un tampon à zéro (garanti par WebGPU) : l'état initial de la récurrence.
		return this.engine.device.createBuffer({ size: bytes, usage: G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.COPY_SRC });
	}

	protected prepareInputs(): Promise<null> { return Promise.resolve(null); }

	public unload(): void {
		this.resetState();
		for (const l of this.layers) for (const [k, b] of Object.entries(l)) if (k !== 'recurrent') CustomWebModel.destroyWeight(b);
		this.layers = [];
		super.unload();
	}

	protected recordForward(enc: Gpu, trash: Gpu[], embeds: Float32Array, _extra: null, T: number, pastLen: number): Gpu {
		const e = this.engine;
		const c = this.manifest.config;
		const { d, nHeads, nKvHeads, headDim: hd, ffn, rmsEps: eps, ropeTheta } = c;
		const { S, Hk, Hv, kOff, vOff, C, dInner } = this.ssm;
		const kvLen = pastLen + T, kvDim = nKvHeads * hd, qDim = nHeads * hd;
		let x = e.storage(embeds.byteLength); trash.push(x);
		e.device.queue.writeBuffer(x, 0, embeds);
		for (let i = 0; i < this.nLayer; i++) {
			const layerStart = trash.length;
			const w = this.layers[i];
			const n1 = e.recRmsnorm(enc, trash, x, w.attnNorm, T, d, eps);
			let attnOut: Gpu;
			if (w.recurrent) {
				let cs = this.convState.get(i); if (!cs) { cs = this.zeroed(3 * C * 4); this.convState.set(i, cs); }
				let ss = this.ssmState.get(i); if (!ss) { ss = this.zeroed(Hv * S * S * 4); this.ssmState.set(i, ss); }
				const qkv = e.recMM(enc, trash, n1, w.wqkv, T, d, C, false);
				const z = e.recMM(enc, trash, n1, w.wz, T, d, dInner, false);
				const al = e.recMM(enc, trash, n1, w.walpha, T, d, Hv, false);
				const be = e.recMM(enc, trash, n1, w.wbeta, T, d, Hv, false);
				const conv = e.recQwen35Conv(enc, trash, qkv, w.conv, cs, T, C);
				const o = e.recQwen35Gdn(enc, trash, conv, al, be, w.dt, w.A, ss, T, Hv, Hk, S, C, kOff, vOff, eps);
				const on = e.recRmsnorm(enc, trash, o, w.ssmNorm, T * Hv, S, eps);
				const gated = e.recBinary(enc, trash, 'swiglu', z, on, T * dInner); // silu(z) ⊙ norme
				attnOut = e.recMM(enc, trash, gated, w.wout, T, dInner, d, false);
			} else {
				let q = e.recMM(enc, trash, n1, w.wq, T, d, qDim, false);
				const gate = e.recMM(enc, trash, n1, w.wqGate, T, d, qDim, false);
				const kP = e.recMM(enc, trash, n1, w.wk, T, d, kvDim, false);
				const vP = e.recMM(enc, trash, n1, w.wv, T, d, kvDim, false);
				q = e.recRopePartial(enc, trash, e.recRmsnorm(enc, trash, q, w.qNorm, T * nHeads, hd, eps), T * nHeads, hd, nHeads, pastLen, ropeTheta, this.q.nRot);
				const k = e.recRopePartial(enc, trash, e.recRmsnorm(enc, trash, kP, w.kNorm, T * nKvHeads, hd, eps), T * nKvHeads, hd, nKvHeads, pastLen, ropeTheta, this.q.nRot);
				const cache = this.ensureKv(i, kvLen, kvDim);
				enc.copyBufferToBuffer(k, 0, cache.k, pastLen * kvDim * 4, T * kvDim * 4);
				enc.copyBufferToBuffer(vP, 0, cache.v, pastLen * kvDim * 4, T * kvDim * 4);
				const att = e.recAttention(enc, trash, q, cache.k, cache.v, T, nHeads, nKvHeads, hd, kvLen, pastLen, 1 / Math.sqrt(hd), 0, 0);
				const sg = e.storage(T * qDim * 4); trash.push(sg);
				e.recordPass(enc, 'sigmoid', [gate, sg], e.grid1D(T * qDim));
				attnOut = e.recMM(enc, trash, e.recBinary(enc, trash, 'mul', att, sg, T * qDim), w.wo, T, qDim, d, false);
			}
			const h = e.recBinary(enc, trash, 'add', x, attnOut, T * d);
			const n2 = e.recRmsnorm(enc, trash, h, w.ffnNorm, T, d, eps);
			const g = e.recBinary(enc, trash, 'swiglu', e.recMM(enc, trash, n2, w.wgate, T, d, ffn, false), e.recMM(enc, trash, n2, w.wup, T, d, ffn, false), T * ffn);
			x = e.recBinary(enc, trash, 'add', h, e.recMM(enc, trash, g, w.wdown, T, ffn, d, false), T * d);
			e.recycleStorage(trash.slice(layerStart).filter((b) => b !== x));
		}
		const normed = e.recRmsnorm(enc, trash, x, this.finalNormGpu, T, d, eps);
		const last = e.storage(d * 4); trash.push(last);
		enc.copyBufferToBuffer(normed, (T - 1) * d * 4, last, 0, d * 4);
		return last;
	}
}
