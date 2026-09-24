// Socle des modèles GGUF à GRAPHE PROPRE (gemma4Model.ts, qwen35Model.ts) : ce que leurs forwards
// partagent et que CustomWebModel ne fait pas comme il faut pour eux.
//
//   · précision des matrices d'après leur type SUR DISQUE (Q4_K gardé natif, le reste en int8) ;
//   · embeddings Q6_K déquantifiés sur le CPU (le chemin commun fait un aller-retour GPU PAR token) ;
//   · tête de logits int8 construite tuile par tuile SUR LE GPU (pas de blob int8 complet côté JS) ;
//   · cache KV par couche, session, et la queue du forward (tête → softcap → pénalité → top-K).
//
// Une sous-classe fournit `recordForward` (les couches + la norme finale, rend la dernière ligne
// normée sur le GPU) et `prepareInputs` (ce que son graphe doit téléverser en plus des embeddings).

import { CustomWebModel, type TensorSource } from './model';
import { type WebGpuEngine, dequantQ6KCpu } from './kernels';
import { type Manifest } from './ggufParser';
import { urlFlag } from './urlFlags';

export type Gpu = any;

export abstract class GraphModel<Extra> extends CustomWebModel {
	protected kv = new Map<number, { k: Gpu; v: Gpu; cap: number }>();
	protected kvSession = '';

	constructor(engine: WebGpuEngine, file: Blob | File | TensorSource, manifest: Manifest) {
		super(engine, file, manifest);
	}

	// Précision des matrices, arbitrée sur Gemma 4 E4B contre llama.cpp (1 667 tokens de contexte, sa
	// séquence forcée, premiers choix identiques) et au décodage (tirs uniques, Mac M4) :
	//   · Q4_K requantifié en int4 (groupes de 32)  : 51/64 — le second arrondi fait décrocher ;
	//   · tout en int8                               : 64/64, 6,1 Go, GPU ~59 ms/token ;
	//   · Q4_K ET Q6_K natifs (GEMV K-quant)         : 64/64, 4,1 Go, GPU ~62 ms/token — le GEMV Q6_K
	//     lit ses blocs de 210 o octet par octet et coûte plus qu'il n'économise ;
	//   · Q4_K natif + le reste en int8 (DÉFAUT)     : 64/64, 5,0 Go, GPU ~52 ms/token.
	// Q6_K → int8 est quasi sans perte (6,6 → 8 bits) ; Q4_0 → int8 aussi (4 → 8 bits).
	// ?q6k=1 remet le Q6_K natif, ?q4req=1 l'int4 requantifié (mémoire d'abord), ?kq=0 tout en int8.
	protected static q4Requant = (() => { try { return urlFlag('q4req') === '1'; } catch { return false; } })();
	protected static q6Native = (() => { try { return urlFlag('q6k') === '1'; } catch { return false; } })();

	protected async mat(name: string, bytesOverride?: Uint8Array, nElemsOverride?: number): Promise<Gpu> {
		const t = this.manifest.tensors[name];
		const bytes = bytesOverride ?? await this.rawTensor(name);
		const nElems = nElemsOverride ?? t.nElems;
		const native = this.engine.kqOk && !GraphModel.q4Requant && t.shape[0] % 256 === 0
			&& (t.type === 'Q4_K' || (t.type === 'Q6_K' && GraphModel.q6Native));
		if (native) return this.engine.uploadKq(t.type as 'Q4_K' | 'Q6_K', bytes);
		const f32 = this.engine.dequantizeToGpu(t.type, bytes, nElems);
		const q = GraphModel.q4Requant && (t.type === 'Q4_K' || t.type === 'Q4_0' || t.type === 'Q4_1')
			? this.engine.f32ToQ4Gpu(f32, nElems)
			: this.engine.f32ToQ8Gpu(f32, nElems);
		f32.destroy?.();
		return q;
	}

	protected up(a: Float32Array): Gpu { return this.engine.uploadGpu(a); }

	// Poids par couche en octets (progression du chargement).
	protected layerBytes(n: number): number[] {
		const out = new Array<number>(n).fill(0);
		for (const [name, t] of Object.entries(this.manifest.tensors)) {
			const m = name.match(/^blk\.(\d+)\./);
			if (m && Number(m[1]) < n) out[Number(m[1])] += t.bytes;
		}
		return out;
	}

	// Octets bruts d'une couche relâchés une fois tout en VRAM (sinon le modèle entier resterait
	// dupliqué dans le tas JS via les vues du span de couche).
	protected dropLayerBytes(i: number): void {
		for (const n of this.rawCache.keys()) if (n.startsWith(`blk.${i}.`)) this.rawCache.delete(n);
		this.layerSpan.delete(i);
	}

	// Embeddings : lignes de token_embd (× embedScale). Q6_K déquantifié sur le CPU.
	public async embed(tokens: number[], d: number): Promise<Float32Array> {
		const info = this.manifest.tensors['token_embd.weight'];
		if (info.type !== 'Q6_K') return super.embed(tokens, d);
		const raw = await this.rawTensor('token_embd.weight');
		const rowBytes = (d / 256) * 210;
		const s = this.manifest.config.embedScale ?? 1;
		const out = new Float32Array(tokens.length * d);
		for (let i = 0; i < tokens.length; i++) {
			const row = dequantQ6KCpu(raw.subarray(tokens[i] * rowBytes, (tokens[i] + 1) * rowBytes), d / 256);
			for (let j = 0; j < d; j++) out[i * d + j] = row[j] * s;
		}
		return out;
	}

	// Tête de logits liée à token_embd (Q6_K) construite en int8 TUILE PAR TUILE SUR LE GPU : déquant
	// → quantize_q8 → tuile résidente. Le chemin commun (quantizeToBytes) passe par un blob int8
	// complet relu sur le CPU puis renvoyé tuile par tuile : ~1,4 Go de copies JS jetables pour un
	// vocabulaire de 262 144 — l'essentiel du pic qui restait au chargement de Gemma 4.
	protected async getProjectionQ8(d: number): Promise<{ w: any; rows: number; r0: number }[]> {
		if (this.projQ8) return this.projQ8;
		const info = this.manifest.tensors['token_embd.weight'];
		if (info.type !== 'Q6_K' || this.manifest.tensors['output.weight']) return super.getProjectionQ8(d);
		const vocab = info.nElems / d;
		this.projVocab = vocab;
		const raw = await this.rawTensor('token_embd.weight');
		const rowBytes = (d / 256) * 210;
		if (this.engine.kqOk && !GraphModel.q4Requant && GraphModel.q6Native) {
			const T6 = Math.max(1, Math.floor((this.engine.maxStorageBufferBindingSize * 0.9) / rowBytes));
			const tiles6: { w: any; rows: number; r0: number }[] = [];
			for (let r0 = 0; r0 < vocab; r0 += T6) {
				const rows = Math.min(T6, vocab - r0);
				tiles6.push({ w: this.engine.uploadKq('Q6_K', raw.subarray(r0 * rowBytes, (r0 + rows) * rowBytes)), rows, r0 });
			}
			this.projQ8 = tiles6;
			return tiles6;
		}
		// Le f32 intermédiaire doit tenir dans UNE liaison de stockage, et rester petit : à la limite
		// de liaison (plusieurs Go sur Metal), chaque tuile allouait un f32 géant d'un coup.
		const TILE = Math.max(1, Math.floor(Math.min(this.engine.maxStorageBufferBindingSize * 0.9, 256 << 20) / (d * 4)));
		const tiles: { w: any; rows: number; r0: number }[] = [];
		for (let r0 = 0; r0 < vocab; r0 += TILE) {
			const rows = Math.min(TILE, vocab - r0);
			const f32 = this.engine.dequantizeToGpu('Q6_K', raw.subarray(r0 * rowBytes, (r0 + rows) * rowBytes), rows * d);
			tiles.push({ w: this.engine.f32ToQ8Gpu(f32, rows * d), rows, r0 });
			f32.destroy?.();
			await this.engine.settleGpu();
		}
		this.projQ8 = tiles;
		return tiles;
	}

	// ── KV : un cache f32 par couche d'attention ──────────────────────────────────────────────────
	protected ensureKv(layer: number, rows: number, kvDim: number): { k: Gpu; v: Gpu; cap: number } {
		const e = this.kv.get(layer);
		if (e && e.cap >= rows) return e;
		const cap = Math.max(rows, (e?.cap ?? 0) + 1024, 1024);
		const G = globalThis as any;
		const mk = () => this.engine.device.createBuffer({ size: cap * kvDim * 4, usage: G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.COPY_SRC });
		const k = mk(), v = mk();
		if (e) {
			const enc = this.engine.device.createCommandEncoder();
			enc.copyBufferToBuffer(e.k, 0, k, 0, e.cap * kvDim * 4);
			enc.copyBufferToBuffer(e.v, 0, v, 0, e.cap * kvDim * 4);
			this.engine.device.queue.submit([enc.finish()]);
			e.k.destroy?.(); e.v.destroy?.();
		}
		const ne = { k, v, cap };
		this.kv.set(layer, ne);
		return ne;
	}

	// Remise à zéro de TOUT l'état de séquence (KV, et l'état récurrent des sous-classes).
	protected resetState(): void {
		for (const e of this.kv.values()) { e.k.destroy?.(); e.v.destroy?.(); }
		this.kv.clear();
		this.kvSession = '';
	}

	public reset(): void {
		this.resetState();
		super.reset();
	}

	// Les couches + la norme finale ; rend la dernière ligne normée ([d], sur le GPU).
	protected abstract recordForward(enc: Gpu, trash: Gpu[], embeds: Float32Array, extra: Extra, T: number, pastLen: number): Gpu;
	protected abstract prepareInputs(tokens: number[]): Promise<Extra>;

	protected async prepare(tokens: number[], pastLen: number, sessionId: string) {
		if (sessionId !== this.kvSession || pastLen === 0) { this.resetState(); this.kvSession = sessionId; }
		const { d } = this.manifest.config;
		const [embeds, extra, tiles] = await Promise.all([this.embed(tokens, d), this.prepareInputs(tokens), this.getProjectionQ8(d)]);
		await this.getFinalNormGpu();
		return { embeds, extra, tiles };
	}

	// Chemin du chat (TransformerWebModel) : forward + tête + softcap + pénalité + top-K, UNE
	// soumission, K ids + K valeurs relus. Même queue de passes que engine.decodeTopKQ8.
	async topKKV(tokens: number[], pastLen: number, sessionId: string, recent: number[], penalty: number): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		const e = this.engine, G = globalThis as any, K = 64;
		const { embeds, extra, tiles } = await this.prepare(tokens, pastLen, sessionId);
		const { d } = this.manifest.config;
		const vocab = this.projVocab;
		const trash: Gpu[] = [];
		const enc = e.device.createCommandEncoder();
		const last = this.recordForward(enc, trash, embeds, extra, tokens.length, pastLen);
		const logits = e.storage(vocab * 4); trash.push(logits);
		for (const t of tiles) {
			const tl = e.recMM(enc, trash, last, t.w, 1, d, t.rows, false);
			enc.copyBufferToBuffer(tl, 0, logits, t.r0 * 4, t.rows * 4);
		}
		const cap = this.manifest.config.finalLogitSoftcap ?? 0;
		if (cap > 0) {
			const p = e.uniform([vocab], { offset: 4, value: cap });
			e.recordPass(enc, 'softcap_logits', [p, logits], e.grid1D(vocab));
			trash.push(p);
		}
		if (penalty && penalty !== 1 && recent.length) {
			const ids = Uint32Array.from(recent);
			const idsBuf = e.storage(Math.max(16, ids.byteLength)); trash.push(idsBuf);
			e.device.queue.writeBuffer(idsBuf, 0, ids);
			const p = e.uniform([ids.length], { offset: 4, value: penalty });
			e.recordPass(enc, 'penalize_logits', [p, idsBuf, logits], e.grid1D(ids.length));
			trash.push(p);
		}
		const out = e.storage(K * 2 * 4); trash.push(out);
		const pk = e.uniform([vocab, K]); trash.push(pk);
		e.recordPass(enc, e.topKParOk ? 'top_k_par' : 'top_k', [pk, logits, out], [1, 1, 1]);
		const read = e.device.createBuffer({ size: K * 2 * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(out, 0, read, 0, K * 2 * 4);
		e.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const raw = new Uint32Array(read.getMappedRange().slice(0));
		read.unmap(); read.destroy();
		e.release(trash);
		return { ids: raw.slice(0, K), vals: new Float32Array(raw.buffer, K * 4, K) };
	}

	// Logits complets (softcap appliqué) — bancs et comparaison à llama.cpp.
	async logitsKV(tokens: number[], pastLen: number, sessionId: string): Promise<Float32Array> {
		const e = this.engine;
		const T = CustomWebModel.timingOn ? (label: string, t0: number) => console.info(`[timing:graph] ${label} ${(performance.now() - t0).toFixed(1)} ms`) : null;
		let t0 = performance.now();
		const { embeds, extra, tiles } = await this.prepare(tokens, pastLen, sessionId);
		T?.('préparation CPU', t0); t0 = performance.now();
		const { d } = this.manifest.config;
		const vocab = this.projVocab;
		const trash: Gpu[] = [];
		const enc = e.device.createCommandEncoder();
		const last = this.recordForward(enc, trash, embeds, extra, tokens.length, pastLen);
		const logits = e.storage(vocab * 4); trash.push(logits);
		for (const t of tiles) {
			const tl = e.recMM(enc, trash, last, t.w, 1, d, t.rows, false);
			enc.copyBufferToBuffer(tl, 0, logits, t.r0 * 4, t.rows * 4);
		}
		T?.(`enregistrement (${trash.length} buffers)`, t0); t0 = performance.now();
		e.device.queue.submit([enc.finish()]);
		const out = await e.readBack(logits, vocab * 4);
		T?.('GPU (submit → readback)', t0);
		e.release(trash);
		const cap = this.manifest.config.finalLogitSoftcap ?? 0;
		if (cap > 0) for (let i = 0; i < out.length; i++) out[i] = cap * Math.tanh(out[i] / cap);
		return out;
	}
}
