// Gemma 4 (E2B / E4B) — graphe propre, 100 % résident, une soumission GPU par appel.
//
// Référence : llama.cpp src/models/gemma4.cpp (b10050), vérifiée couche par couche contre
// llama-eval-callback. Ce qui le sépare de Gemma 3 et impose une classe à part :
//   1. Têtes de taille VARIABLE : 256 sur les couches à fenêtre glissante (θ 10 000, fenêtre 512),
//      512 sur les globales (θ 1e6, RoPE partiel : rope_freqs vaut 1e30 hors des premières paires).
//   2. Cache KV PARTAGÉ : les 18 dernières couches (E4B) n'ont pas de K/V propres et relisent celui
//      de la dernière couche à K/V du même type (kvSrc, calculé par le parser).
//   3. V normé par tête SANS poids, q/k normés avec poids, échelle d'attention 1 (pas 1/√d).
//   4. Embeddings PAR COUCHE (PLE) : chaque token apporte en plus un vecteur de 256 par couche, tiré
//      d'une table de 262 144 × 10 752 (2,3 Go en Q6_K). On ne la met PAS en VRAM : une ligne de
//      8,8 Ko par token, lue sur une grille de morceaux de 4 Mo (layerSpans.lazyChunkRanges) servie
//      par le cache disque, déquantifiée sur le CPU : 2,3 Go qui ne passent jamais en VRAM.
//   5. Chaque couche finit par multiplier TOUT le flux résiduel par un scalaire (layer_output_scale).
//
// Tout ce qui se replie dans un poids y est replié au chargement, jamais dans le graphe :
//   · per_layer_model_proj × 1/√d (l'échelle de projection) ;
//   · per_layer_proj_norm × 1/√2 et la ligne PLE × √256/√2 (le « (proj + ple)/√2 » de llama.cpp).

import { CustomWebModel, type TensorSource } from './model';
import { type WebGpuEngine, dequantQ6KCpu } from './kernels';
import { type Manifest } from './ggufParser';
import { LAZY_CHUNK } from './layerSpans';
import { GraphModel, type Gpu } from './graphModel';

interface G4Layer {
	attnNorm: Gpu; qNorm: Gpu; kNorm?: Gpu; postAttnNorm: Gpu;
	ffnNorm: Gpu; postFfnNorm: Gpu; postNorm: Gpu;
	wq: Gpu; wk?: Gpu; wv?: Gpu; wo: Gpu; wgate: Gpu; wup: Gpu; wdown: Gpu;
	inpGate: Gpu; proj: Gpu; wPle: Gpu;
	outScale: number;
}

const PLE_TABLE = 'per_layer_token_embd.weight';

export class Gemma4Model extends GraphModel<Float32Array> {
	private layers: G4Layer[] = [];
	private ones256: Gpu = null;
	private ones512: Gpu = null;
	private ropeFf: Gpu = null;
	private pleNormW: Gpu = null;
	private pleChunks = new Map<number, Uint8Array>(); // LRU (ordre d'insertion) des morceaux de 4 Mo

	constructor(engine: WebGpuEngine, file: Blob | File | TensorSource, manifest: Manifest) {
		super(engine, file, manifest);
		if (!manifest.config.gemma4) throw new Error('Gemma4Model : manifeste sans config gemma4');
	}

	private get g4() { return this.manifest.config.gemma4!; }

	private async loadLayer(i: number): Promise<G4Layer> {
		await this.ensureLayerSpan(i); // une plage par couche : les clés du préchargement
		const p = `blk.${i}`;
		const hasKv = i < this.g4.nLayerKv;
		const vec = async (n: string) => this.up(await this.dequant(`${p}.${n}.weight`));
		const [attnNorm, qNorm, kNorm, postAttnNorm, ffnNorm, postFfnNorm, postNorm] = await Promise.all([
			vec('attn_norm'), vec('attn_q_norm'), hasKv ? vec('attn_k_norm') : Promise.resolve(undefined),
			vec('post_attention_norm'), vec('ffn_norm'), vec('post_ffw_norm'), vec('post_norm'),
		]);
		const outScale = this.manifest.tensors[`${p}.layer_output_scale.weight`]
			? (await this.dequant(`${p}.layer_output_scale.weight`))[0] : 1;
		const wq = await this.mat(`${p}.attn_q.weight`);
		const wk = hasKv ? await this.mat(`${p}.attn_k.weight`) : undefined;
		const wv = hasKv && this.manifest.tensors[`${p}.attn_v.weight`] ? await this.mat(`${p}.attn_v.weight`) : undefined;
		const wo = await this.mat(`${p}.attn_output.weight`);
		const wgate = await this.mat(`${p}.ffn_gate.weight`);
		const wup = await this.mat(`${p}.ffn_up.weight`);
		const wdown = await this.mat(`${p}.ffn_down.weight`);
		const inpGate = await this.mat(`${p}.inp_gate.weight`);
		const proj = await this.mat(`${p}.proj.weight`);
		const wPle = await this.pleProjection(i);
		this.dropLayerBytes(i);
		return { attnNorm, qNorm, kNorm, postAttnNorm, ffnNorm, postFfnNorm, postNorm, wq, wk, wv, wo, wgate, wup, wdown, inpGate, proj, wPle, outScale };
	}

	// Tranche de per_layer_model_proj propre à la couche i (lignes i·256 … i·256+255, contiguës dans
	// le fichier), BF16 → f32 × 1/√d, puis int8 résident. La lire par couche évite toute
	// transposition dans le graphe : la sortie de chaque couche tombe directement contiguë.
	private pleProjCache: Uint8Array | null = null;
	private async pleProjection(i: number): Promise<Gpu> {
		const name = 'per_layer_model_proj.weight';
		const t = this.manifest.tensors[name];
		const { d } = this.manifest.config;
		const P = this.g4.perLayer;
		if (!this.pleProjCache) this.pleProjCache = await this.rawTensor(name);
		const raw = this.pleProjCache;
		const n = P * d;
		const f = new Float32Array(n);
		const k = 1 / Math.sqrt(d);
		if (t.type === 'BF16') {
			const u16 = new Uint16Array(raw.buffer, raw.byteOffset + i * n * 2, n);
			const u32 = new Uint32Array(f.buffer);
			for (let j = 0; j < n; j++) u32[j] = u16[j] << 16;
			for (let j = 0; j < n; j++) f[j] *= k;
		} else if (t.type === 'F32') {
			f.set(new Float32Array(raw.buffer.slice(raw.byteOffset + i * n * 4, raw.byteOffset + (i + 1) * n * 4)));
			for (let j = 0; j < n; j++) f[j] *= k;
		} else {
			throw new Error(`Gemma 4 : per_layer_model_proj en ${t.type} non géré (BF16/F32 attendus)`);
		}
		const g = this.up(f);
		const q = this.engine.f32ToQ8Gpu(g, n);
		g.destroy?.();
		return q;
	}

	async prewarmGpu(onProgress?: (doneBytes: number, totalBytes: number) => void): Promise<void> {
		if (!this.engine.gemma4Ok) throw new Error('Gemma 4 indisponible sur ce GPU (selfValidate, ou ?gemma4=0).');
		const { blockCount, d } = this.manifest.config;
		const layerBytes = this.layerBytes(blockCount);
		const total = layerBytes.reduce((a, b) => a + b, 0);
		let done = 0;
		this.ones256 = this.up(new Float32Array(this.g4.headDimSwa).fill(1));
		this.ones512 = this.up(new Float32Array(this.manifest.config.headDim).fill(1));
		const ff = this.manifest.tensors['rope_freqs.weight'] ? await this.dequant('rope_freqs.weight') : new Float32Array(this.manifest.config.headDim / 2).fill(1);
		this.ropeFf = this.up(ff);
		const pn = await this.dequant('per_layer_proj_norm.weight');
		this.pleNormW = this.up(pn.map((v) => v * Math.SQRT1_2));
		for (let i = 0; i < blockCount; i++) {
			this.layers[i] = await this.loadLayer(i);
			// Laisser le GPU se vider à CHAQUE couche : sans ça, les buffers f32 intermédiaires et les
			// zones de transit de writeBuffer s'empilaient sur tout le chargement. Mesuré sur le E4B
			// (footprint) : 10 Go à la fin du chargement contre 4,5 Go une fois tout libéré — un pic de
			// 2× le modèle en mémoire unifiée. Cf. engine.settleGpu.
			await this.engine.settleGpu();
			done += layerBytes[i];
			onProgress?.(done, total);
		}
		this.pleProjCache = null;
		this.rawCache.delete('per_layer_model_proj.weight');
		await this.getFinalNormGpu();
		await this.getProjectionQ8(d);
		await this.engine.settleGpu();
	}

	// ── Table PLE : une ligne par token, sur la grille de morceaux du préchargement ────────────────
	private async pleChunk(idx: number): Promise<Uint8Array> {
		const hit = this.pleChunks.get(idx);
		if (hit) { this.pleChunks.delete(idx); this.pleChunks.set(idx, hit); return hit; }
		const t = this.manifest.tensors[PLE_TABLE];
		const off = idx * LAZY_CHUNK;
		const bytes = await this.source.bytes(t.offset + off, Math.min(LAZY_CHUNK, t.bytes - off));
		this.pleChunks.set(idx, bytes);
		if (this.pleChunks.size > 32) this.pleChunks.delete(this.pleChunks.keys().next().value!); // ≤ 128 Mo
		return bytes;
	}

	private async pleRow(tok: number): Promise<Float32Array> {
		const t = this.manifest.tensors[PLE_TABLE];
		const width = t.shape[0]; // perLayer × blockCount
		if (t.type !== 'Q6_K') throw new Error(`Gemma 4 : table PLE en ${t.type} non gérée (Q6_K attendu)`);
		const rowBytes = (width / 256) * 210;
		const start = tok * rowBytes;
		const c0 = Math.floor(start / LAZY_CHUNK), c1 = Math.floor((start + rowBytes - 1) / LAZY_CHUNK);
		let row: Uint8Array;
		if (c0 === c1) {
			const c = await this.pleChunk(c0);
			row = c.subarray(start - c0 * LAZY_CHUNK, start - c0 * LAZY_CHUNK + rowBytes);
		} else {
			// Ligne à cheval sur deux morceaux.
			const a = await this.pleChunk(c0), b = await this.pleChunk(c1);
			row = new Uint8Array(rowBytes);
			const cut = c1 * LAZY_CHUNK - start;
			row.set(a.subarray(start - c0 * LAZY_CHUNK), 0);
			row.set(b.subarray(0, rowBytes - cut), cut);
		}
		const f = dequantQ6KCpu(row, width / 256);
		const k = Math.sqrt(this.g4.perLayer) * Math.SQRT1_2;
		for (let j = 0; j < f.length; j++) f[j] *= k;
		return f;
	}

	// Lignes PLE des tokens, réordonnées en [couche][token][256] : la tranche d'une couche est alors
	// contiguë pour tout le lot (le fichier les range en [token][couche][256]).
	private async pleInputs(tokens: number[]): Promise<Float32Array> {
		const L = this.manifest.config.blockCount, P = this.g4.perLayer, T = tokens.length;
		const out = new Float32Array(L * T * P);
		for (let ti = 0; ti < T; ti++) {
			const r = await this.pleRow(tokens[ti]);
			for (let l = 0; l < L; l++) out.set(r.subarray(l * P, (l + 1) * P), (l * T + ti) * P);
		}
		return out;
	}

	protected prepareInputs(tokens: number[]): Promise<Float32Array> { return this.pleInputs(tokens); }

	public unload(): void {
		this.resetState();
		for (const l of this.layers) for (const b of Object.values(l)) if (typeof b !== 'number') CustomWebModel.destroyWeight(b);
		this.layers = [];
		for (const b of [this.ones256, this.ones512, this.ropeFf, this.pleNormW]) b?.destroy?.();
		this.pleChunks.clear();
		super.unload();
	}

	// Enregistre les couches + la norme finale ; rend la dernière ligne normée ([d], sur le GPU).
	protected recordForward(enc: Gpu, trash: Gpu[], embeds: Float32Array, ple: Float32Array, T: number, pastLen: number, taps?: Gpu[], probe?: { layer: number; out: Map<string, { buf: Gpu; cols: number }> }): Gpu {
		const e = this.engine;
		const c = this.manifest.config, g = this.g4;
		const { d, nHeads, nKvHeads, ffn, rmsEps: eps } = c;
		const P = g.perLayer, kvLen = pastLen + T;
		const put = (a: Float32Array) => { const b = e.storage(a.byteLength); e.device.queue.writeBuffer(b, 0, a); trash.push(b); return b; };
		let x = put(embeds);
		const x0 = x;
		const pleAll = put(ple);
		for (let i = 0; i < c.blockCount; i++) {
			const layerStart = trash.length;
			const w = this.layers[i];
			// Banc : étapes nommées comme dans llama-eval-callback, pour UNE couche.
			const tap = (name: string, buf: Gpu, cols: number) => { if (probe && probe.layer === i) probe.out.set(name, { buf, cols }); return buf; };
			const swa = g.swa[i];
			const hd = swa ? g.headDimSwa : c.headDim;
			const theta = swa ? g.ropeThetaSwa : c.ropeTheta;
			const qDim = nHeads * hd, kvDim = nKvHeads * hd;
			const rope = (v: Gpu, rows: number, nH: number) => swa
				? e.recRope(enc, trash, v, rows, hd, nH, pastLen, theta, false)
				: e.recRopeFactors(enc, trash, v, this.ropeFf, rows, hd, nH, pastLen, theta, false);

			// Entrée PLE de la couche : rmsnorm(x0·Wp)·(w/√2) + ligne·(√256/√2) — replis faits au chargement.
			const pleSlice = e.storage(T * P * 4); trash.push(pleSlice);
			enc.copyBufferToBuffer(pleAll, i * T * P * 4, pleSlice, 0, T * P * 4);
			const pp = e.recRmsnorm(enc, trash, e.recMM(enc, trash, x0, w.wPle, T, d, P, false), this.pleNormW, T, P, eps);
			const pleIn = tap('inp_per_layer (permuted) (cont) (view)', e.recBinary(enc, trash, 'add', pp, pleSlice, T * P), P);

			// Attention.
			if (i === 0) tap('inp_scaled', x, d);
			const n1 = tap(`attn_norm-${i}`, e.recRmsnorm(enc, trash, x, w.attnNorm, T, d, eps), d);
			let q = e.recMM(enc, trash, n1, w.wq, T, d, qDim, false);
			q = rope(e.recRmsnorm(enc, trash, q, w.qNorm, T * nHeads, hd, eps), T * nHeads, nHeads);
			const src = g.kvSrc[i];
			const cache = this.ensureKv(src, kvLen, kvDim);
			if (src === i) {
				const kP = e.recMM(enc, trash, n1, w.wk, T, d, kvDim, false);
				const vP = w.wv ? e.recMM(enc, trash, n1, w.wv, T, d, kvDim, false) : kP;
				const k = rope(e.recRmsnorm(enc, trash, kP, w.kNorm, T * nKvHeads, hd, eps), T * nKvHeads, nKvHeads);
				const v = e.recRmsnorm(enc, trash, vP, swa ? this.ones256 : this.ones512, T * nKvHeads, hd, eps);
				enc.copyBufferToBuffer(k, 0, cache.k, pastLen * kvDim * 4, T * kvDim * 4);
				enc.copyBufferToBuffer(v, 0, cache.v, pastLen * kvDim * 4, T * kvDim * 4);
			}
			const attn = tap(`kqv_out-${i}`, e.recAttention(enc, trash, q, cache.k, cache.v, T, nHeads, nKvHeads, hd, kvLen, pastLen, 1.0, 0, swa ? g.window : 0), qDim);
			const o = e.recRmsnorm(enc, trash, e.recMM(enc, trash, attn, w.wo, T, qDim, d, false), w.postAttnNorm, T, d, eps);
			const h = tap(`attn_out-${i}`, e.recBinary(enc, trash, 'add', o, x, T * d), d);

			// FFN (GELU tanh, gate·up).
			const n2 = e.recRmsnorm(enc, trash, h, w.ffnNorm, T, d, eps);
			const gu = e.recBinary(enc, trash, 'geglu', e.recMM(enc, trash, n2, w.wgate, T, d, ffn, false), e.recMM(enc, trash, n2, w.wup, T, d, ffn, false), T * ffn);
			const f = e.recRmsnorm(enc, trash, tap(`ffn_out-${i}`, e.recMM(enc, trash, gu, w.wdown, T, ffn, d, false), d), w.postFfnNorm, T, d, eps);
			const h2 = tap(`pe_in-${i}`, e.recBinary(enc, trash, 'add', f, h, T * d), d);

			// Embedding par couche : gelu(h2·Wg) ⊙ entrée PLE → ·Wp → rmsnorm → résiduel.
			const gp = e.recBinary(enc, trash, 'geglu', e.recMM(enc, trash, h2, w.inpGate, T, d, P, false), pleIn, T * P);
			const y = tap(`per_layer_embd_out-${i}`, e.recRmsnorm(enc, trash, e.recMM(enc, trash, gp, w.proj, T, P, d, false), w.postNorm, T, d, eps), d);
			const h3 = e.recBinary(enc, trash, 'add', h2, y, T * d);
			x = w.outScale !== 1 ? e.recScale(enc, trash, h3, w.outScale, T * d) : h3;
			tap(`l_out-${i}`, x, d);
			taps?.push(x);
			// Intermédiaires de la couche rendus au pool pour la suivante (même encodeur, passes dans
			// l'ordre) — sauf sa sortie, et sauf en banc (les points d'écoute sont relus après).
			if (!taps && !probe) e.recycleStorage(trash.slice(layerStart).filter((b) => b !== x));
		}
		const normed = e.recRmsnorm(enc, trash, x, this.finalNormGpu, T, d, eps);
		const last = e.storage(d * 4); trash.push(last);
		enc.copyBufferToBuffer(normed, (T - 1) * d * 4, last, 0, d * 4);
		return last;
	}

	// BANC : sortie de CHAQUE couche (l_out-N de llama-eval-callback) sur un seul forward, pour
	// trouver la première couche qui s'écarte de llama.cpp. Rend les états [T·d] par couche.
	async debugLayerOutputs(tokens: number[]): Promise<Float32Array[]> {
		const e = this.engine;
		const { embeds, extra: ple } = await this.prepare(tokens, 0, 'debug-layers');
		const { d } = this.manifest.config;
		const trash: Gpu[] = [], taps: Gpu[] = [];
		const enc = e.device.createCommandEncoder();
		this.recordForward(enc, trash, embeds, ple, tokens.length, 0, taps);
		e.device.queue.submit([enc.finish()]);
		const out: Float32Array[] = [];
		for (const t of taps) out.push(await e.readBack(t, tokens.length * d * 4));
		e.release(trash);
		return out;
	}

	// BANC : étapes nommées d'UNE couche (mêmes noms que llama-eval-callback) → { nom: [T·cols] }.
	async debugLayerSteps(tokens: number[], layer: number): Promise<Map<string, { data: Float32Array; cols: number }>> {
		const e = this.engine;
		const { embeds, extra: ple } = await this.prepare(tokens, 0, 'debug-steps');
		const trash: Gpu[] = [];
		const probe = { layer, out: new Map<string, { buf: Gpu; cols: number }>() };
		const enc = e.device.createCommandEncoder();
		this.recordForward(enc, trash, embeds, ple, tokens.length, 0, undefined, probe);
		e.device.queue.submit([enc.finish()]);
		const res = new Map<string, { data: Float32Array; cols: number }>();
		for (const [n, { buf, cols }] of probe.out) res.set(n, { data: await e.readBack(buf, tokens.length * cols * 4), cols });
		e.release(trash);
		return res;
	}
}
