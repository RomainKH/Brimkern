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
//
// DÉCODAGE SPÉCULATIF (MTP). block_count compte une couche « nextn » finale que le forward principal
// n'exécute pas : à partir de l'état caché normé H_i et de l'embedding du token i+1, elle prédit le
// token i+2 (llama.cpp graph_mtp). On s'en sert pour PROPOSER un token, que le modèle principal
// VÉRIFIE en traitant deux positions par passe (le GEMV à deux lignes rend la seconde quasi gratuite).
// La sortie reste celle du modèle principal : on échantillonne toujours dans SA distribution, la
// proposition ne fait que gagner une passe quand elle coïncide. Une proposition refusée laisse les
// couches récurrentes un token trop loin : elles repartent de l'instantané pris après le premier
// token de la passe (snapT = 0 dans les kernels conv/DeltaNet), le cache KV est simplement réécrit.

import { CustomWebModel, type TensorSource } from './model';
import { type WebGpuEngine, hadamardInverseRowCpu } from './kernels';
import { type Manifest } from './ggufParser';
import { GraphModel, type Gpu } from './graphModel';
import { urlFlag } from './urlFlags';

interface AttnWeights { wq: Gpu; wqGate: Gpu; wk: Gpu; wv: Gpu; wo: Gpu; qNorm: Gpu; kNorm: Gpu }

// qwen35moe : experts routés (tenseurs K-quant NATIFS [E][n][k], lus à l'expert près par les GEMV
// indexés) + expert partagé à porte sigmoïde. Routeur et porte en f32 : un arrondi int8 du routeur
// ferait basculer les quasi-égalités du top-K vers d'autres experts.
interface MoeWeights { router: Gpu; gateExps: Gpu; upExps: Gpu; downExps: Gpu; shGate: Gpu; shUp: Gpu; shDown: Gpu; shInp: Gpu }

interface Q35Layer {
	recurrent: boolean;
	attnNorm: Gpu; ffnNorm: Gpu;
	wgate?: Gpu; wup?: Gpu; wdown?: Gpu;
	moe?: MoeWeights;
	// DeltaNet
	wqkv?: Gpu; wz?: Gpu; walpha?: Gpu; wbeta?: Gpu; conv?: Gpu; dt?: Gpu; A?: Gpu; ssmNorm?: Gpu; wout?: Gpu;
	// Attention
	attn?: AttnWeights;
}

interface MtpLayer {
	we: Gpu; wh: Gpu; enorm: Gpu; hnorm: Gpu; headNorm: Gpu;
	attnNorm: Gpu; attn: AttnWeights; ffnNorm: Gpu; wgate: Gpu; wup: Gpu; wdown: Gpu;
}

// Rotation de Hadamard des Bonsai PrismML (métadonnées prism.hadamard.*, fork llama.cpp PrismML) :
// un poids « replié » W_f = W·D·H se multiplie par H·(D·x) (cf. shaders.ts hadamard_rows) ;
// l'embedding « latent » se relit h = s ⊙ (H·z). Signes par largeur d'entrée (5 120 / 6 144 / 17 408
// sur le 27B) ; `perm` = réordonnancement gdn_v_grouped de l'entrée de ssm_out.
interface Hadamard { rot: Set<string>; inv: Set<string>; signs: Map<number, Gpu>; signsCpu: Map<number, Float32Array>; perm: { hd: number; nk: number; rep: number } | null }

export class Qwen35Model extends GraphModel<null> {
	private layers: Q35Layer[] = [];
	private hd: Hadamard | null = null;
	private mtp: MtpLayer | null = null;
	private convState = new Map<number, Gpu>();
	private ssmState = new Map<number, Gpu>();
	private convSnap = new Map<number, Gpu>();
	private ssmSnap = new Map<number, Gpu>();
	// États cachés normés gardés pour le MTP : dernière ligne du dernier forward (préremplissage /
	// proposition) et les deux lignes d'une vérification.
	private hLast: Gpu = null;
	private hVerify: Gpu = null;
	// Kill-switch de banc : ?mtp=0 → pas de décodage spéculatif (bras témoin).
	private static mtpOn = (() => { try { return urlFlag('mtp') !== '0'; } catch { return true; } })();

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
		const n = nHeads * headDim * d;
		return [await this.mat(name, q, n), await this.mat(name, g, n)];
	}

	// nextn.eh_proj [2·d → d] prend concat(embedding normé, état normé) : ses COLONNES sont coupées en
	// deux matrices [d → d] (x = We·ê + Wh·ĥ), ce qui évite toute concaténation dans le graphe. Chaque
	// ligne GGUF est une suite de blocs sur la dimension d'entrée : la moitié d'une ligne = la moitié
	// des colonnes (2 560 est un multiple de 256 et de 32).
	private async splitEh(name: string): Promise<[Gpu, Gpu]> {
		const raw = await this.rawTensor(name);
		const { d } = this.manifest.config;
		const rowBytes = raw.byteLength / d, half = rowBytes / 2;
		if (!Number.isInteger(half)) throw new Error(`${name} : lignes non coupables en deux`);
		const e = new Uint8Array(d * half), h = new Uint8Array(d * half);
		for (let r = 0; r < d; r++) {
			e.set(raw.subarray(r * rowBytes, r * rowBytes + half), r * half);
			h.set(raw.subarray(r * rowBytes + half, (r + 1) * rowBytes), r * half);
		}
		return [await this.mat(name, e, d * d), await this.mat(name, h, d * d)];
	}

	private async loadAttn(p: string): Promise<AttnWeights> {
		const vec = async (n: string) => this.up(await this.dequant(`${p}.${n}`));
		const [wq, wqGate] = await this.splitQGate(`${p}.attn_q.weight`);
		return {
			wq, wqGate,
			wk: await this.mat(`${p}.attn_k.weight`),
			wv: await this.mat(`${p}.attn_v.weight`),
			wo: await this.mat(`${p}.attn_output.weight`),
			qNorm: await vec('attn_q_norm.weight'),
			kNorm: await vec('attn_k_norm.weight'),
		};
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
		};
		if (this.q.moe) {
			L.moe = {
				router: await vec('ffn_gate_inp.weight'),
				gateExps: await this.experts(`${p}.ffn_gate_exps.weight`),
				upExps: await this.experts(`${p}.ffn_up_exps.weight`),
				downExps: await this.experts(`${p}.ffn_down_exps.weight`),
				shGate: await this.mat(`${p}.ffn_gate_shexp.weight`),
				shUp: await this.mat(`${p}.ffn_up_shexp.weight`),
				shDown: await this.mat(`${p}.ffn_down_shexp.weight`),
				shInp: await vec('ffn_gate_inp_shexp.weight'),
			};
		} else {
			L.wgate = await this.mat(`${p}.ffn_gate.weight`);
			L.wup = await this.mat(`${p}.ffn_up.weight`);
			L.wdown = await this.mat(`${p}.ffn_down.weight`);
		}
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
			L.attn = await this.loadAttn(p);
		}
		this.dropLayerBytes(i);
		return L;
	}

	// Tenseur d'experts [E][n][k] téléversé TEL QUEL : seuls Q4_K et Q6_K ont un GEMV indexé (les
	// requantifier en int8 gonflerait de ~2× la part qui fait l'essentiel du fichier).
	private async experts(name: string): Promise<Gpu> {
		const t = this.manifest.tensors[name];
		if ((t.type !== 'Q4_K' && t.type !== 'Q6_K') || t.shape[0] % 256 !== 0) throw new Error(`MoE : ${name} en ${t.type} (k = ${t.shape[0]}) non géré — Q4_K/Q6_K, k multiple de 256`);
		return this.engine.uploadKq(t.type, await this.rawTensor(name));
	}

	private async loadMtp(): Promise<MtpLayer | null> {
		const i = this.nLayer, p = `blk.${i}`;
		if (!this.manifest.tensors[`${p}.nextn.eh_proj.weight`] || !this.manifest.tensors[`${p}.attn_q.weight`]) return null;
		await this.ensureLayerSpan(i);
		const vec = async (n: string) => this.up(await this.dequant(n));
		const [we, wh] = await this.splitEh(`${p}.nextn.eh_proj.weight`);
		const headNormName = this.manifest.tensors[`${p}.nextn.shared_head_norm.weight`] ? `${p}.nextn.shared_head_norm.weight` : 'output_norm.weight';
		const m: MtpLayer = {
			we, wh,
			enorm: await vec(`${p}.nextn.enorm.weight`),
			hnorm: await vec(`${p}.nextn.hnorm.weight`),
			headNorm: await vec(headNormName),
			attnNorm: await vec(`${p}.attn_norm.weight`),
			attn: await this.loadAttn(p),
			ffnNorm: await vec(`${p}.post_attention_norm.weight`),
			wgate: await this.mat(`${p}.ffn_gate.weight`),
			wup: await this.mat(`${p}.ffn_up.weight`),
			wdown: await this.mat(`${p}.ffn_down.weight`),
		};
		this.dropLayerBytes(i);
		return m;
	}

	async prewarmGpu(onProgress?: (doneBytes: number, totalBytes: number) => void): Promise<void> {
		if (!this.engine.qwen35SsmOk) throw new Error('Qwen 3.5 indisponible sur ce GPU (selfValidate, ou ?qwen35ssm=0).');
		if (this.q.moe && !this.engine.moeOk) throw new Error('Modèle à experts indisponible sur ce GPU (selfValidate MoE, ou ?moe=0).');
		this.loadHadamard();
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
		// Le décodage spéculatif exige les GEMV à deux lignes (sinon une passe de 2 tokens coûte 5×).
		// MTP : couche dense seulement pour l'instant (celle d'un qwen35moe a elle aussi des experts).
		// Pas de MTP sur un modèle à poids repliés : la couche nextn aurait ses propres transformations.
		if (Qwen35Model.mtpOn && this.engine.gemvMOk && !this.q.moe && !this.hd) {
			this.mtp = await this.loadMtp().catch((e) => { console.warn('[qwen35] couche MTP illisible, décodage classique :', e); return null; });
			await this.engine.settleGpu();
		}
		await this.getFinalNormGpu();
		await this.getProjectionQ8(d);
		const G = globalThis as any;
		const mk = (bytes: number) => this.engine.device.createBuffer({ size: bytes, usage: G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.COPY_SRC });
		this.hLast = mk(d * 4);
		this.hVerify = mk(2 * d * 4);
		await this.engine.settleGpu();
	}

	// État récurrent (conv + DeltaNet) : remis à zéro avec le KV — il n'est pas « rembobinable ».
	protected resetState(): void {
		super.resetState();
		for (const m of [this.convState, this.ssmState, this.convSnap, this.ssmSnap]) {
			for (const b of m.values()) b.destroy?.();
			m.clear();
		}
	}

	private zeroed(bytes: number): Gpu {
		const G = globalThis as any;
		// createBuffer rend un tampon à zéro (garanti par WebGPU) : l'état initial de la récurrence.
		return this.engine.device.createBuffer({ size: bytes, usage: G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.COPY_SRC });
	}

	private stateFor(map: Map<number, Gpu>, i: number, bytes: number): Gpu {
		let b = map.get(i);
		if (!b) { b = this.zeroed(bytes); map.set(i, b); }
		return b;
	}

	protected prepareInputs(): Promise<null> { return Promise.resolve(null); }

	private loadHadamard(): void {
		const md = this.manifest.metadata as Record<string, unknown>;
		const version = md['prism.hadamard.version'];
		if (version === undefined) return;
		const no = (why: string) => { throw new Error(`prism.hadamard : ${why} — ce modèle ne peut pas tourner correctement ici.`); };
		if (Number(version) !== 1) no(`version ${String(version)} non gérée (1 seulement : tête explicite, pas de tête latente partagée)`);
		if (Number(md['prism.hadamard.block_size']) !== 1024) no(`bloc de ${String(md['prism.hadamard.block_size'])} (1 024 seulement)`);
		if (md['prism.hadamard.transform'] !== 'normalized-sylvester-walsh-hadamard') no(`transformée « ${String(md['prism.hadamard.transform'])} »`);
		if (md['prism.hadamard.axis'] !== 'input-last-dimension') no(`axe « ${String(md['prism.hadamard.axis'])} »`);
		if (this.q.moe) no('modèle à experts');
		if (!this.engine.hadamardOk) no('rotation de Hadamard indisponible sur ce GPU (selfValidate)');
		const widths = (md['prism.hadamard.sign_widths'] as number[] | undefined) ?? [];
		const values = (md['prism.hadamard.sign_values'] as number[] | undefined) ?? [];
		const signsCpu = new Map<number, Float32Array>();
		let off = 0;
		for (const w of widths) {
			const v = Float32Array.from(values.slice(off, off + w));
			if (v.length !== w || v.some((x) => x !== 1 && x !== -1)) no(`signes de largeur ${w} invalides`);
			signsCpu.set(w, v);
			off += w;
		}
		if (off !== values.length) no('longueur des signes incohérente');
		const { S, Hk, Hv } = this.ssm;
		this.hd = {
			rot: new Set((md['prism.hadamard.weight_names'] as string[] | undefined) ?? []),
			inv: new Set((md['prism.hadamard.inverse_weight_names'] as string[] | undefined) ?? []),
			signsCpu,
			signs: new Map([...signsCpu].map(([w, v]) => [w, this.up(v)])),
			perm: md['prism.hadamard.gdn_v_grouped'] ? { hd: S, nk: Hk, rep: Hv / Hk } : null,
		};
		console.info(`[qwen35] prism.hadamard : ${this.hd.rot.size} poids repliés, ${this.hd.inv.size} table(s) latente(s), FWHT ${this.engine.fwhtOk ? 'rapide' : 'naïve'}`);
	}

	// Entrée d'un ou plusieurs poids qui lisent le MÊME x : transformée une fois si tous sont repliés,
	// rendue telle quelle si aucun ne l'est ; un mélange n'existe pas dans les fichiers PrismML.
	private rotIn(enc: Gpu, trash: Gpu[], x: Gpu, T: number, W: number, names: string[], ssmOut = false): Gpu {
		if (!this.hd) return x;
		const n = names.filter((x) => this.hd!.rot.has(x)).length;
		if (n === 0) return x;
		if (n !== names.length) throw new Error(`prism.hadamard : ${names.join(', ')} partagent une entrée mais pas leur repliement`);
		const s = this.hd.signs.get(W);
		if (!s) throw new Error(`prism.hadamard : pas de signes pour la largeur ${W}`);
		return this.engine.recHadamard(enc, trash, x, T, W, s, ssmOut ? this.hd.perm ?? undefined : undefined);
	}

	// Table d'embedding latente : h = s ⊙ (H·z), sur le CPU (une ligne de d par jeton).
	public async embed(tokens: number[], d: number): Promise<Float32Array> {
		const out = await super.embed(tokens, d);
		if (!this.hd?.inv.has('token_embd.weight')) return out;
		const s = this.hd.signsCpu.get(d);
		if (!s) throw new Error(`prism.hadamard : pas de signes pour l'embedding (largeur ${d})`);
		for (let i = 0; i < tokens.length; i++) out.set(hadamardInverseRowCpu(out.subarray(i * d, (i + 1) * d), s), i * d);
		return out;
	}

	// Tête repliée (output.weight dans prism.hadamard.weight_names) : son entrée normée est transformée.
	protected recordHead(enc: Gpu, trash: Gpu[], hidden: Gpu, rows: number, tiles: { w: any; rows: number; r0: number }[]): Gpu {
		const h = this.rotIn(enc, trash, hidden, rows, this.manifest.config.d, ['output.weight']);
		return super.recordHead(enc, trash, h, rows, tiles);
	}

	public unload(): void {
		this.resetState();
		// Poids : tampons ou handles quantifiés ; les sous-couches d'attention sont des objets imbriqués.
		const isHandle = (b: any) => 'destroy' in b || 'codes' in b || 'nib' in b || 'kq' in b;
		const drop = (o: object) => {
			for (const [k, b] of Object.entries(o)) {
				if (k === 'recurrent' || !b || typeof b !== 'object') continue;
				if (isHandle(b)) CustomWebModel.destroyWeight(b);
				else drop(b);
			}
		};
		for (const l of this.layers) drop(l);
		if (this.mtp) drop(this.mtp);
		this.layers = [];
		this.mtp = null;
		this.hLast?.destroy?.(); this.hVerify?.destroy?.();
		super.unload();
	}

	// Sous-couche d'attention gatée (couches pleines ET couche MTP) : rend la sortie projetée [T, d].
	private recordAttn(enc: Gpu, trash: Gpu[], n1: Gpu, w: AttnWeights, cacheLayer: number, T: number, pastLen: number): Gpu {
		const e = this.engine;
		const { d, nHeads, nKvHeads, headDim: hd, rmsEps: eps, ropeTheta } = this.manifest.config;
		const kvLen = pastLen + T, kvDim = nKvHeads * hd, qDim = nHeads * hd;
		const p = `blk.${cacheLayer}`;
		const n1r = this.rotIn(enc, trash, n1, T, d, [`${p}.attn_q.weight`, `${p}.attn_k.weight`, `${p}.attn_v.weight`]);
		let q = e.recMM(enc, trash, n1r, w.wq, T, d, qDim, false);
		const gate = e.recMM(enc, trash, n1r, w.wqGate, T, d, qDim, false);
		const kP = e.recMM(enc, trash, n1r, w.wk, T, d, kvDim, false);
		const vP = e.recMM(enc, trash, n1r, w.wv, T, d, kvDim, false);
		q = e.recRopePartial(enc, trash, e.recRmsnorm(enc, trash, q, w.qNorm, T * nHeads, hd, eps), T * nHeads, hd, nHeads, pastLen, ropeTheta, this.q.nRot);
		const k = e.recRopePartial(enc, trash, e.recRmsnorm(enc, trash, kP, w.kNorm, T * nKvHeads, hd, eps), T * nKvHeads, hd, nKvHeads, pastLen, ropeTheta, this.q.nRot);
		const cache = this.ensureKv(cacheLayer, kvLen, kvDim);
		enc.copyBufferToBuffer(k, 0, cache.k, pastLen * kvDim * 4, T * kvDim * 4);
		enc.copyBufferToBuffer(vP, 0, cache.v, pastLen * kvDim * 4, T * kvDim * 4);
		const att = e.recAttention(enc, trash, q, cache.k, cache.v, T, nHeads, nKvHeads, hd, kvLen, pastLen, 1 / Math.sqrt(hd), 0, 0);
		const sg = e.storage(T * qDim * 4); trash.push(sg);
		e.recordPass(enc, 'sigmoid', [gate, sg], e.grid1D(T * qDim));
		const ao = this.rotIn(enc, trash, e.recBinary(enc, trash, 'mul', att, sg, T * qDim), T, qDim, [`${p}.attn_output.weight`]);
		return e.recMM(enc, trash, ao, w.wo, T, qDim, d, false);
	}

	// Couches du modèle principal + norme finale. Rend TOUTES les lignes normées [T, d] (la tête et le
	// MTP choisissent ensuite lesquelles lire). `snap` : instantané des états récurrents après le
	// premier token (vérification spéculative à deux positions).
	private recordLayers(enc: Gpu, trash: Gpu[], embeds: Float32Array, T: number, pastLen: number, snap = false): Gpu {
		const e = this.engine;
		const c = this.manifest.config;
		const { d, ffn, rmsEps: eps } = c;
		const { S, Hk, Hv, kOff, vOff, C, dInner } = this.ssm;
		let x = e.storage(embeds.byteLength); trash.push(x);
		e.device.queue.writeBuffer(x, 0, embeds);
		for (let i = 0; i < this.nLayer; i++) {
			const layerStart = trash.length;
			const w = this.layers[i];
			const p = `blk.${i}`;
			const n1 = e.recRmsnorm(enc, trash, x, w.attnNorm, T, d, eps);
			let attnOut: Gpu;
			if (w.recurrent) {
				const cs = this.stateFor(this.convState, i, 3 * C * 4);
				const ss = this.stateFor(this.ssmState, i, Hv * S * S * 4);
				const csSnap = snap ? this.stateFor(this.convSnap, i, 3 * C * 4) : undefined;
				const ssSnap = snap ? this.stateFor(this.ssmSnap, i, Hv * S * S * 4) : undefined;
				// ssm_alpha / ssm_beta ne sont pas repliés : ils lisent n1 tel quel.
				const n1r = this.rotIn(enc, trash, n1, T, d, [`${p}.attn_qkv.weight`, `${p}.attn_gate.weight`]);
				const qkv = e.recMM(enc, trash, n1r, w.wqkv, T, d, C, false);
				const z = e.recMM(enc, trash, n1r, w.wz, T, d, dInner, false);
				const al = e.recMM(enc, trash, this.rotIn(enc, trash, n1, T, d, [`${p}.ssm_alpha.weight`]), w.walpha, T, d, Hv, false);
				const be = e.recMM(enc, trash, this.rotIn(enc, trash, n1, T, d, [`${p}.ssm_beta.weight`]), w.wbeta, T, d, Hv, false);
				const conv = e.recQwen35Conv(enc, trash, qkv, w.conv, cs, T, C, csSnap, 0);
				const o = e.recQwen35Gdn(enc, trash, conv, al, be, w.dt, w.A, ss, T, Hv, Hk, S, C, kOff, vOff, eps, ssSnap, 0);
				const on = e.recRmsnorm(enc, trash, o, w.ssmNorm, T * Hv, S, eps);
				const gated = e.recBinary(enc, trash, 'swiglu', z, on, T * dInner); // silu(z) ⊙ norme
				attnOut = e.recMM(enc, trash, this.rotIn(enc, trash, gated, T, dInner, [`${p}.ssm_out.weight`], true), w.wout, T, dInner, d, false);
			} else {
				attnOut = this.recordAttn(enc, trash, n1, w.attn!, i, T, pastLen);
			}
			const h = e.recBinary(enc, trash, 'add', x, attnOut, T * d);
			const n2 = e.recRmsnorm(enc, trash, h, w.ffnNorm, T, d, eps);
			if (w.moe) {
				x = e.recBinary(enc, trash, 'add', h, this.recordMoe(enc, trash, n2, w.moe, T), T * d);
			} else {
				const n2r = this.rotIn(enc, trash, n2, T, d, [`${p}.ffn_gate.weight`, `${p}.ffn_up.weight`]);
				const g = e.recBinary(enc, trash, 'swiglu', e.recMM(enc, trash, n2r, w.wgate, T, d, ffn, false), e.recMM(enc, trash, n2r, w.wup, T, d, ffn, false), T * ffn);
				x = e.recBinary(enc, trash, 'add', h, e.recMM(enc, trash, this.rotIn(enc, trash, g, T, ffn, [`${p}.ffn_down.weight`]), w.wdown, T, ffn, d, false), T * d);
			}
			e.recycleStorage(trash.slice(layerStart).filter((b) => b !== x));
		}
		return e.recRmsnorm(enc, trash, x, this.finalNormGpu, T, d, eps);
	}

	// FFN à experts (llama.cpp build_moe_ffn + expert partagé de qwen35moe) : routeur f32 → softmax
	// top-K renormalisé → K experts SwiGLU lus à leur décalage → somme pondérée ; plus l'expert
	// partagé multiplié par sigmoid(x · w_inp_shexp) (porte scalaire par token = head_gate, hd = d).
	private recordMoe(enc: Gpu, trash: Gpu[], n2: Gpu, m: MoeWeights, T: number): Gpu {
		const e = this.engine;
		const { d } = this.manifest.config;
		const { nExpert: E, nUsed: K, ffExp: F, ffShexp: FS, scale } = this.q.moe!;
		const logits = e.recMM(enc, trash, n2, m.router, T, d, E, false);
		const r = e.recMoeRoute(enc, trash, logits, T, E, K, scale);
		// Prefill (T ≥ 8) : cases triées par expert puis GEMM groupé — la tuile de poids d'un expert
		// sert à toutes ses cases. Décodage : GEMV par case (une case par expert, rien à mutualiser).
		const grp = T >= 8 && e.moeGemmOk ? e.recMoeGroup(enc, trash, r.ids, T * K, E) : null;
		const mm = (a: Gpu, w: Gpu, aDiv: number, k: number, n: number) => grp
			? e.recMoeGemm(enc, trash, a, w, grp, T * K, E, T, aDiv, k, n)
			: e.recMoeGemv(enc, trash, a, w, r.ids, T * K, aDiv, k, n);
		const g = mm(n2, m.gateExps, K, d, F);
		const u = mm(n2, m.upExps, K, d, F);
		const hE = e.recBinary(enc, trash, 'swiglu', g, u, T * K * F);
		const y = mm(hE, m.downExps, 1, F, d);
		const routed = e.recMoeSum(enc, trash, y, r.w, T, K, d);
		const sh = e.recMM(enc, trash, e.recBinary(enc, trash, 'swiglu', e.recMM(enc, trash, n2, m.shGate, T, d, FS, false), e.recMM(enc, trash, n2, m.shUp, T, d, FS, false), T * FS), m.shDown, T, FS, d, false);
		const sg = e.recMM(enc, trash, n2, m.shInp, T, d, 1, false);
		return e.recBinary(enc, trash, 'add', routed, e.recHeadGate(enc, trash, sh, sg, T * d, d), T * d);
	}

	protected recordForward(enc: Gpu, trash: Gpu[], embeds: Float32Array, _extra: null, T: number, pastLen: number): Gpu {
		const { d } = this.manifest.config;
		const normed = this.recordLayers(enc, trash, embeds, T, pastLen);
		const last = this.engine.storage(d * 4); trash.push(last);
		enc.copyBufferToBuffer(normed, (T - 1) * d * 4, last, 0, d * 4);
		return last;
	}

	// Couche MTP sur T entrées (état normé H de la position précédente, embedding du token) aux
	// positions pos0…pos0+T-1 ; rend les lignes passées par la norme de tête [T, d].
	private recordMtp(enc: Gpu, trash: Gpu[], hIn: Gpu, tokEmbeds: Float32Array, T: number, pos0: number): Gpu {
		const e = this.engine, m = this.mtp!;
		const { d, ffn, rmsEps: eps } = this.manifest.config;
		const eb = e.storage(tokEmbeds.byteLength); trash.push(eb);
		e.device.queue.writeBuffer(eb, 0, tokEmbeds);
		const en = e.recRmsnorm(enc, trash, eb, m.enorm, T, d, eps);
		const hn = e.recRmsnorm(enc, trash, hIn, m.hnorm, T, d, eps);
		const x = e.recBinary(enc, trash, 'add', e.recMM(enc, trash, en, m.we, T, d, d, false), e.recMM(enc, trash, hn, m.wh, T, d, d, false), T * d);
		const n1 = e.recRmsnorm(enc, trash, x, m.attnNorm, T, d, eps);
		const h = e.recBinary(enc, trash, 'add', x, this.recordAttn(enc, trash, n1, m.attn, this.nLayer, T, pos0), T * d);
		const n2 = e.recRmsnorm(enc, trash, h, m.ffnNorm, T, d, eps);
		const g = e.recBinary(enc, trash, 'swiglu', e.recMM(enc, trash, n2, m.wgate, T, d, ffn, false), e.recMM(enc, trash, n2, m.wup, T, d, ffn, false), T * ffn);
		const y = e.recBinary(enc, trash, 'add', h, e.recMM(enc, trash, g, m.wdown, T, ffn, d, false), T * d);
		return e.recRmsnorm(enc, trash, y, m.headNorm, T, d, eps);
	}

	// ── API du décodage spéculatif (TransformerWebModel.generateResident) ─────────────────────────
	speculativeReady(): boolean { return !!this.mtp; }

	// Préremplissage d'une tranche + historique MTP. Entrée MTP à la position i = (H_{i-1}, token_i) :
	// pour la tranche [p, p+T), les états sont [H_{p-1} (tranche précédente, hLast), H_p … H_{p+T-2}]
	// et les tokens ceux de la tranche ; à p = 0 il n'y a pas de H_{-1}, l'historique part de la
	// position 1. Rend le top-K de la dernière position (comme topKKV) ; hLast ← H_{p+T-1}.
	async specPrefill(tokens: number[], pastLen: number, sessionId: string, recent: number[], penalty: number): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		const e = this.engine, { d } = this.manifest.config, T = tokens.length;
		const { embeds, tiles } = await this.prepare(tokens, pastLen, sessionId);
		const trash: Gpu[] = [];
		const enc = e.device.createCommandEncoder();
		const normed = this.recordLayers(enc, trash, embeds, T, pastLen);
		const lastRow = e.storage(d * 4); trash.push(lastRow);
		enc.copyBufferToBuffer(normed, (T - 1) * d * 4, lastRow, 0, d * 4);
		const skip = pastLen === 0 ? 1 : 0; // position 0 : pas d'état précédent
		const nMtp = T - skip;
		if (nMtp > 0) {
			const hIn = e.storage(nMtp * d * 4); trash.push(hIn);
			if (skip === 0) enc.copyBufferToBuffer(this.hLast, 0, hIn, 0, d * 4);
			if (T > 1) enc.copyBufferToBuffer(normed, 0, hIn, (1 - skip) * d * 4, (T - 1) * d * 4);
			this.recordMtp(enc, trash, hIn, embeds.subarray(skip * d), nMtp, pastLen + skip);
		}
		enc.copyBufferToBuffer(lastRow, 0, this.hLast, 0, d * 4);
		const out = this.recordTopK(enc, trash, this.recordHead(enc, trash, lastRow, 1, tiles), this.projVocab, recent, penalty);
		const [r] = await this.readTopKs(enc, [out]);
		e.release(trash);
		return r;
	}

	// Proposition : entrées MTP aux positions pos0… avec les états `from` (« last » = hLast, « verify0 »
	// = première ligne de la vérification, « verify » = les deux) ; rend le token proposé pour la
	// position suivant la dernière entrée (argmax du MTP).
	async specDraft(tokens: number[], pos0: number, from: 'last' | 'verify0' | 'verify'): Promise<number> {
		const e = this.engine, { d } = this.manifest.config, T = tokens.length;
		const embeds = await this.embed(tokens, d);
		const tiles = await this.getProjectionQ8(d);
		const trash: Gpu[] = [];
		const enc = e.device.createCommandEncoder();
		const hIn = from === 'last' ? this.hLast : this.hVerify;
		const rows = this.recordMtp(enc, trash, hIn, embeds, T, pos0);
		const lastRow = e.storage(d * 4); trash.push(lastRow);
		enc.copyBufferToBuffer(rows, (T - 1) * d * 4, lastRow, 0, d * 4);
		const out = this.recordTopK(enc, trash, this.recordHead(enc, trash, lastRow, 1, tiles), this.projVocab, [], 1, 64);
		const [r] = await this.readTopKs(enc, [out]);
		e.release(trash);
		return r.ids[0];
	}

	// Vérification : [y, d] aux positions P, P+1 en UNE passe, instantané des états récurrents après
	// y. Rend le top-K des deux positions (pénalités propres à chacune : la seconde compte d) ;
	// hVerify ← [H_P, H_{P+1}].
	async specVerify(y: number, draft: number, P: number, sessionId: string, recent0: number[], recent1: number[], penalty: number): Promise<[{ ids: Uint32Array; vals: Float32Array }, { ids: Uint32Array; vals: Float32Array }]> {
		const e = this.engine, { d } = this.manifest.config, vocab = this.projVocab;
		const { embeds, tiles } = await this.prepare([y, draft], P, sessionId);
		const trash: Gpu[] = [];
		const enc = e.device.createCommandEncoder();
		const normed = this.recordLayers(enc, trash, embeds, 2, P, true);
		enc.copyBufferToBuffer(normed, 0, this.hVerify, 0, 2 * d * 4);
		const logits = this.recordHead(enc, trash, normed, 2, tiles);
		const l1 = e.storage(vocab * 4); trash.push(l1);
		enc.copyBufferToBuffer(logits, vocab * 4, l1, 0, vocab * 4);
		const o0 = this.recordTopK(enc, trash, logits, vocab, recent0, penalty); // lit la 1re ligne
		const o1 = this.recordTopK(enc, trash, l1, vocab, recent1, penalty);
		const [r0, r1] = await this.readTopKs(enc, [o0, o1]);
		e.release(trash);
		return [r0, r1];
	}

	// Proposition refusée : les couches récurrentes repartent de l'état d'après y.
	specRollback(): void {
		const enc = this.engine.device.createCommandEncoder();
		for (const [i, snap] of this.convSnap) enc.copyBufferToBuffer(snap, 0, this.convState.get(i), 0, snap.size);
		for (const [i, snap] of this.ssmSnap) enc.copyBufferToBuffer(snap, 0, this.ssmState.get(i), 0, snap.size);
		this.engine.device.queue.submit([enc.finish()]);
	}
}
