// Neural Communia — WebGPU compute kernels for transformer layers (browser worker).
//
// These are the building blocks of a transformer layer forward pass, written as
// WGSL compute shaders. Each kernel ships with a tiny CPU reference; `selfValidate`
// runs every kernel on random inputs in the REAL browser and checks it against the
// reference. The worker only reports `can_compute` after this passes — so even if a
// shader is subtly wrong, it never feeds bad results into the swarm.
//
// Implemented: matmul (the dominant op), rmsnorm, swiglu, residual add, RoPE,
// causal attention (online softmax + KV cache). `layerForward` chains them into a
// full pre-norm transformer layer, also checked against a CPU reference.

import { quantizeQ4, dequantizeQ4, unpackQ4 } from '../brik/q4web';
import { quantizeQ8, dequantizeQ8, unpackQ8 } from '../brik/q8web';
import { quantizeQ3, dequantizeQ3, unpackQ3 } from '../brik/q3web';
import { SHADERS, MATMUL_T_F16W } from "./shaders";
import { GpuProfiler } from "./gpuProfile";
import { urlFlag } from "./urlFlags";

type GPUAny = any;

// Raw IEEE-f16 tensor bytes + element count — the lazy form safetensors hands us so the f16→f32
// conversion happens ON the GPU (uploadGpu / quantizeQ8Gpu accept it alongside Float32Array).
export interface F16Bytes { f16: Uint8Array; n: number }

export interface LayerCfg {
	seq: number;
	d: number;
	nHeads: number;
	// Grouped-query attention: number of key/value heads (== nHeads for plain MHA).
	nKvHeads: number;
	headDim: number;
	ffn: number;
	// RoPE base (Llama 3.2: 500000, Qwen2: 10000) and RMSNorm epsilon (Qwen2: 1e-6).
	ropeTheta: number;
	eps: number;
	// ── Sliding window attention (Gemma 3, Mistral 7B…) ──
	// `window` : nombre de positions visibles par une requête, ELLE COMPRISE (0/absent = causal plein).
	// Résolu PAR COUCHE par les appelants depuis `windowPerLayer` — Gemma 3 alterne 5 couches locales
	// (fenêtre 512, RoPE θ=10k) pour 1 globale (pleine, θ=1M), d'où aussi `ropeThetaPerLayer`.
	// V1 : le cache KV reste PLEIN (correct, aucune économie mémoire) ; le ring buffer viendra après.
	window?: number;
	windowPerLayer?: number[];
	ropeThetaPerLayer?: number[];
	// NoPE (SmolLM3) : couche sans RoPE. `skipRope` est résolu par couche depuis `skipRopePerLayer`.
	skipRope?: boolean;
	skipRopePerLayer?: boolean[];
	// ── Arch-portability knobs. All optional; omitting them reproduces Qwen2/Llama exactly. ──
	// Attention score scale (q·k multiplier). Default 1/sqrt(headDim); Gemma2 uses
	// 1/sqrt(query_pre_attn_scalar), which differs from headDim on the 9B/27B variants.
	attnScale?: number;
	// tanh logit softcap on attention scores: s = c·tanh(s/c). Gemma2 ≈ 50. 0/undefined = off.
	attnLogitSoftcap?: number;
	// FFN gate activation: 'silu' (Qwen2/Llama, default) or 'gelu' (Gemma2, tanh-approx GELU).
	act?: 'silu' | 'gelu';
	// RMSNorm weight convention: false → x̂·w (default); true → x̂·(1+w) (Gemma uses 1+w).
	rmsGainOnePlus?: boolean;
	// ── M-RoPE (Qwen2-VL uniquement — les deux ensemble, sinon RoPE 1D standard inchangé). ──
	// Tailles des sections de fréquences [t, h, w] (2B : [16,24,24], somme = headDim/2).
	mropeSections?: number[];
	// Positions 3D (t, h, w) par token DU FORWARD COURANT, triplets u32 aplatis [seq·3].
	positions?: Uint32Array;
	// Interne : buffer GPU des positions, uploadé une fois par forward (pas par couche).
	_posGpu?: unknown;
	// ── RoPE à facteurs par fréquence (Llama 3.1/3.2 : tenseur rope_freqs.weight ; YaRN/LongRoPE
	// ensuite). [headDim/2] diviseurs ; absent → rope standard inchangé. ──
	ropeFactors?: Float32Array;
	_ffGpu?: unknown; // interne : buffer GPU des facteurs, uploadé une fois par forward
	// Convention d'appariement des dimensions du RoPE : true = paires ADJACENTES (2i, 2i+1), ce que
	// ggml applique aux archs llama / mistral / smollm3 (LLAMA_ROPE_TYPE_NORM) ; absent/false =
	// rotate_half (i, i+headDim/2), la convention Hugging Face de Qwen, Gemma, Phi…
	ropeInterleaved?: boolean;
}
export interface LayerWeights {
	// Norms/biases stay f32 (small, consumed by rmsnorm/addBias). The big projection matrices
	// may be a Float32Array (uploaded per call) OR a persistent GPUBuffer (uploaded once and
	// reused across decode steps — the GPU-buffer weight-persistence fast path).
	attnNorm: Float32Array;
	wq: Float32Array | GPUAny; wk: Float32Array | GPUAny; wv: Float32Array | GPUAny; wo: Float32Array | GPUAny;
	ffnNorm: Float32Array;
	wgate: Float32Array | GPUAny; wup: Float32Array | GPUAny; wdown: Float32Array | GPUAny;
	// Optional additive biases on the q/k/v projections (Qwen2 has them; Llama doesn't).
	bq?: Float32Array; bk?: Float32Array; bv?: Float32Array;
	// Optional Gemma2 "sandwich" norms: an RMSNorm on the attn/ffn sub-block OUTPUT, applied
	// before its residual add (in addition to the pre-norms above). Absent ⇒ plain pre-norm arch.
	postAttnNorm?: Float32Array; postFfnNorm?: Float32Array;
	// QK-Norm (Qwen3, Gemma3) : RMSNorm PAR TÊTE ([headDim]) sur q et k, APRÈS la projection et
	// AVANT le RoPE — appliquée en vue [seq·nHeads, headDim] avec le kernel rmsnorm existant.
	qNorm?: Float32Array; kNorm?: Float32Array;
}

const WG = 64; // workgroup size for 1D kernels


export interface LayerWeightsGpu {
	// Same weights as LayerWeights, but EVERY tensor is a persistent GPU buffer (uploaded once).
	// Consumed by the GPU-resident decode path, which never copies activations back to the CPU.
	attnNorm: GPUAny; wq: GPUAny; wk: GPUAny; wv: GPUAny; wo: GPUAny;
	ffnNorm: GPUAny; wgate: GPUAny; wup: GPUAny; wdown: GPUAny;
	bq?: GPUAny; bk?: GPUAny; bv?: GPUAny;
	// Optional Gemma2 sandwich norms (RMSNorm on the attn/ffn sub-block output, pre-residual).
	postAttnNorm?: GPUAny; postFfnNorm?: GPUAny;
	qNorm?: GPUAny; kNorm?: GPUAny; // QK-Norm (Qwen3/Gemma3) — cf. LayerWeights
	// True when the projection matrices (wq…wdown) are stored as f16 (BRIK) → use the f16 matmul.
	matF16?: boolean;
}

// One layer's persistent GPU KV cache. k/v hold `cap` rows of kvDim: f32 (4 B/elem) when not
// quantized, or int8 codes (1 B/elem) + per-(row,head) f32 scales (kScale/vScale) when quantized.
interface KvEntry { k: GPUAny; v: GPUAny; cap: number; kScale?: GPUAny; vScale?: GPUAny; }

// LFM2 (hybride) chemin résident : une couche = conv OU attention (+ FFN SwiGLU commun). Les grosses
// projections sont des handles recMM ({codes,sc} q8 | {nib,sc,mn} q4) ; les normes/conv sont des buffers
// f32 GPU. Construits une fois par Lfm2Model.load, passés au driver moteur lfm2*Gpu.
export interface Lfm2LayerGpu {
	conv: boolean;
	attnNorm: GPUAny; ffnNorm: GPUAny;
	wgate: GPUAny; wup: GPUAny; wdown: GPUAny;   // FFN (toutes couches)
	inProj?: GPUAny; outProj?: GPUAny; convW?: GPUAny;                 // couche conv
	wq?: GPUAny; wk?: GPUAny; wv?: GPUAny; wo?: GPUAny; qNorm?: GPUAny; kNorm?: GPUAny; // couche attention
}
export interface Lfm2Cfg { D: number; nHeads: number; nKvHeads: number; headDim: number; ffn: number; eps: number; theta: number; lc: number; vocab: number; }

// RWKV-7 chemin résident : une couche = time-mix (récurrence WKV) + channel-mix. Les grosses
// projections (R/K/V/O, cmK/cmV) sont des handles recMM ({q3,lo,hi,sc,mn} | {nib,sc,mn} | {codes,sc}) ;
// les LoRA (w1/w2, a1/a2, g1/g2, v1/v2), normes et lerps sont des buffers f32 GPU. lnWB = [gamma|beta]
// concaténés (2·D — le kernel rwkv_out_gn fusionne pour tenir dans 8 storage bindings).
export interface RwkvLayerGpu {
	attnNormW: GPUAny; attnNormB: GPUAny; attnNorm2W: GPUAny; attnNorm2B: GPUAny;
	lerpFused: GPUAny; lerpK: GPUAny;
	w0: GPUAny; w1: GPUAny; w2: GPUAny; rw: number;
	a0: GPUAny; a1: GPUAny; a2: GPUAny; ra: number;
	g1: GPUAny; g2: GPUAny; rg: number;
	v0?: GPUAny; v1?: GPUAny; v2?: GPUAny; rv?: number; // absents couche 0 (elle POSE vFirst)
	kk: GPUAny; ka: GPUAny; rk: GPUAny; lnWB: GPUAny;
	R: GPUAny; K: GPUAny; V: GPUAny; O: GPUAny;
	cmK: GPUAny; cmV: GPUAny; ffn: number;
}
export interface RwkvCfg { D: number; H: number; NH: number; vocab: number; }
// Normes hors couche (LayerNorm avec biais) : embedding (token_embd_norm) et finale (output_norm).
export interface RwkvNorms { tokW: GPUAny; tokB: GPUAny; outW: GPUAny; outB: GPUAny; }

export class WebGpuEngine {
	device: GPUAny = null;
	private modules: Record<string, GPUAny> = {};
	// Compute pipelines are expensive to create; cache one per shader and reuse it everywhere.
	private pipelines: Record<string, GPUAny> = {};
	// Largest single storage-buffer binding this device allows (bytes). Caps the biggest
	// weight tensor a layer slice can hold → reported to the master to size the model.
	maxStorageBufferBindingSize = 0;
	// Whether the device supports `shader-f16` (enables the f16-weight matmul for BRIK models).
	hasF16 = false;
	// Set to the name of the selfValidate stage that failed (surfaced in the UI error), else null.
	validationFailure: string | null = null;
	// Device perdu (TDR, mémoire reprise par l'OS — fréquent sur mobile en contexte long) : tout
	// submit ultérieur échouerait. L'UI s'abonne via onLost pour basculer en erreur récupérable.
	lost = false;
	onLost: ((info: { reason?: string; message?: string }) => void) | null = null;
	// Santé des kernels d'attention « décodage » (workgroup par tête) : false → repli automatique
	// sur les kernels thread-par-tête (lents à contexte long mais corrects partout). Posé par
	// selfValidate si un driver rate le gate à forme réelle (les miscompiles mobiles existent —
	// cf. top_k), ou forcé par ?attndecode=0 pour diagnostiquer sur appareil. Jamais bloquant.
	attnDecodeOk = true;
	// Santé du kernel attention_full « workgroup par tête » (UNet/ViT, non causal) : false → repli
	// sur le kernel thread-par-tête historique. Posé par validateDiffusion (gate non bloquant, motif
	// convTiledOk), ou forcé par ?attnfullwg=0. Jamais bloquant.
	attnFullWgOk = true;
	// Santé du kernel M-RoPE (qwen2vl) : false → la vision refuse de charger (le chat texte n'est
	// jamais affecté — le kernel n'est dispatché que pour l'arch qwen2vl). Posé par selfValidate.
	mropeOk = true;
	// Santé du kernel RWKV-7 WKV (récurrence à état fixe, moteur v2) : false → une archi RWKV
	// refuserait de charger (aucune archi actuelle ne l'utilise → jamais bloquant pour le chat texte).
	// Posé par selfValidate (gate non bloquant), ou forcé par ?rwkv=0. Voir docs/engine-v2-linear-attention.md.
	rwkvWkv7Ok = true;
	// Santé du kernel shortconv LFM2 (bloc hybride, moteur v2) : false → une archi lfm2 refuserait de
	// charger (jamais bloquant pour les autres archis). Posé par selfValidate, ou forcé par ?lfm2=0.
	lfm2ShortConvOk = true;
	// Chemin LFM2 100 % RÉSIDENT (forwardToken → une soumission/un readback, état conv + K/V GPU) :
	// true par défaut ; false → repli sur le forwardToken JS (correct, lent). Forcé par ?lfm2resident=0.
	lfm2ResidentOk = true;
	// Prefill LFM2 BATCHÉ (les T tokens d'une tranche en une passe par opérateur, cf. recordLfm2) :
	// true par défaut ; false → prefill token par token dans le même encodeur (correct, ~10× plus lent).
	// Forcé par ?lfm2batch=0 — sert à valider l'équivalence batché/séquentiel (greedy → token-exact).
	lfm2BatchOk = true;
	// Attention à FENÊTRE GLISSANTE (Gemma 3 : 5 couches locales / 1 globale) : true par défaut ;
	// false → toutes les couches en causal PLEIN (sortie différente mais cohérente : c'est le A/B
	// qui prouve que la fenêtre agit). Posé par selfValidate si le kernel fenêtré échoue, ou forcé
	// par ?swa=0. Les archis sans windowPerLayer ne sont pas concernées.
	swaOk = true;
	// Chemin RWKV 100 % RÉSIDENT (glu WGSL, état S/tm/cm GPU, une soumission/un readback — fin du
	// POC ~100 submits/token) : gate NON bloquant posé par selfValidate (kernels glu vs réfs JS),
	// ou forcé par ?rwkvresident=0 → repli sur le forwardToken JS+readback (correct, lent).
	rwkvResidentOk = true;
	// Chemin VIDÉO (module motion AnimateDiff) : coupé par ?video=0. Pas de kernel WGSL propre —
	// le module réutilise matmul q8/attention existants ; la validation se fait vs le dump de
	// l'oracle diffusers (page /video-test). false → le mode vidéo refuse de charger.
	videoOk = true;
	// Chemin motion 100 % RÉSIDENT (kernels video_motion_gather/scatter, video_add_pe, attn_temporal) :
	// gate NON BLOQUANT posé par validateVideoResident (motif convTiledOk/attnFullWg). false → le module
	// motion retombe sur le chemin JS+readback (correct, lent). Forcé par ?videoresident=0.
	videoResidentOk = true;
	// GEMM f16 TUILÉ en mémoire partagée (matmul_t_f16w_shared) au prefill (m ≥ 16) : gate NON BLOQUANT
	// posé par selfValidate (motif convTiledOk/attnFullWgOk), ou forcé par ?f16shared=0 → repli sur
	// matmul_t_f16w (correct partout, mais ~16× plus de trafic poids). Le f16 est le défaut desktop.
	f16SharedOk = true;
	// Mêmes GEMM tuilés + bloqués en registres pour les poids QUANTIFIÉS (matmul_t_q8_shared /
	// matmul_t_q4_shared — le chemin des presets BRIK) : gate NON BLOQUANT posé par selfValidate, ou
	// forcé par ?qshared=0 → repli sur les kernels à 4 lignes par invocation (corrects, plus lents).
	qSharedOk = true;
	// GEMV dédié au DÉCODAGE (m = 1, kernels matmul_t_q4_vec / q8_vec) : gate NON BLOQUANT posé par
	// selfValidate, ou forcé par ?gemv=0 → retour aux kernels par lignes (corrects, mais qui laissent
	// 7 threads sur 8 inutilisés à m = 1 : 15 Go/s effectifs mesurés contre ~56 chez WebLLM).
	gemvOk = true;
	// ?timing=1 → chronométrage interne du forward (diagnostic ; cf. decodeTopKQ8).
	static timingOn = (() => { try { return urlFlag('timing') === '1'; } catch { return false; } })();
	// ?gpuprofile=1 → budget GPU PAR PASSE via timestamp-query (cf. ./gpuProfile.ts pour le pourquoi :
	// ?timing=1 mesure l'enveloppe d'UNE soumission et ne peut rien répartir à l'intérieur).
	// Strictement opt-in : sans le drapeau la feature n'est même pas demandée au device, donc une
	// session normale est bit à bit celle d'avant.
	static profileOn = (() => { try { return urlFlag('gpuprofile') === '1'; } catch { return false; } })();
	profiler: GpuProfiler | null = null;

	async init(): Promise<boolean> {
		const gpu = (navigator as any).gpu;
		if (!gpu) return false;
		const adapter = await gpu.requestAdapter();
		if (!adapter) return false;
		// Request the adapter's MAX limits so capable GPUs can hold larger weight tensors
		// (the default cap is only 128 MiB, too small for a 7B FFN matrix).
		const lim = adapter.limits;
		const want = {
			maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize,
			maxBufferSize: lim.maxBufferSize
		};
		// Opt into shader-f16 when the adapter offers it (BRIK's f16-weight matmul needs it).
		const features: string[] = [];
		try { if (adapter.features?.has('shader-f16')) features.push('shader-f16'); } catch { /* older impls */ }
		// timestamp-query UNIQUEMENT sous ?gpuprofile=1 : la demander toujours changerait la création
		// du device de toutes les sessions pour un outil de diagnostic. Elle reste optionnelle — un
		// adapter qui ne l'offre pas laisse simplement `profiler` à null (message explicite plus bas).
		try { if (WebGpuEngine.profileOn && adapter.features?.has('timestamp-query')) features.push('timestamp-query'); } catch { /* older impls */ }
		try {
			this.device = await adapter.requestDevice({ requiredLimits: want, requiredFeatures: features });
		} catch {
			try { this.device = await adapter.requestDevice({ requiredLimits: want }); }
			catch { this.device = await adapter.requestDevice(); }
		}
		this.maxStorageBufferBindingSize = this.device.limits?.maxStorageBufferBindingSize ?? 134217728;
		this.hasF16 = !!this.device.features?.has?.('shader-f16');
		if (WebGpuEngine.profileOn) {
			if (this.device.features?.has?.('timestamp-query')) {
				this.profiler = new GpuProfiler(this.device);
				console.info('[webgpu] profilage par passe ACTIF (?gpuprofile=1) — __gpuProfile() pour le rapport');
			} else {
				// Le dire, et fort : un profileur silencieusement inactif rendrait un rapport vide qu'on
				// lirait comme « rien à optimiser » (le piège du commutateur qui ne commute rien).
				console.warn('[webgpu] ?gpuprofile=1 demandé mais la feature timestamp-query est ABSENTE de cet adapter — aucune mesure ne sera prise.');
			}
		}
		// Kill-switch diagnostic : ?attndecode=0 → kernels d'attention classiques uniquement.
		try {
			if (urlFlag('attndecode') === '0') {
				this.attnDecodeOk = false;
				console.warn('[webgpu] attention décodage COUPÉE par ?attndecode=0 — kernels classiques');
			}
			if (urlFlag('attnfullwg') === '0') {
				this.attnFullWgOk = false;
				console.warn('[webgpu] attention_full workgroup COUPÉE par ?attnfullwg=0 — kernel classique');
			}
			if (urlFlag('rwkv') === '0') {
				this.rwkvWkv7Ok = false;
				console.warn('[webgpu] kernel RWKV-7 WKV COUPÉ par ?rwkv=0');
			}
			if (urlFlag('lfm2') === '0') {
				this.lfm2ShortConvOk = false;
				console.warn('[webgpu] kernel shortconv LFM2 COUPÉ par ?lfm2=0');
			}
			if (urlFlag('lfm2resident') === '0') {
				this.lfm2ResidentOk = false;
				console.warn('[webgpu] LFM2 résident COUPÉ par ?lfm2resident=0 — forwardToken JS+readback');
			}
			if (urlFlag('lfm2batch') === '0') {
				this.lfm2BatchOk = false;
				console.warn('[webgpu] prefill LFM2 batché COUPÉ par ?lfm2batch=0 — token par token');
			}
			if (urlFlag('swa') === '0') {
				this.swaOk = false;
				console.warn('[webgpu] fenêtre glissante COUPÉE par ?swa=0 — attention causale pleine sur toutes les couches');
			}
			if (urlFlag('rwkvresident') === '0') {
				this.rwkvResidentOk = false;
				console.warn('[webgpu] RWKV résident COUPÉ par ?rwkvresident=0 — forwardToken JS+readback');
			}
			if (urlFlag('video') === '0') {
				this.videoOk = false;
				console.warn('[webgpu] chemin vidéo (module motion) COUPÉ par ?video=0');
			}
			if (urlFlag('f16shared') === '0') {
				this.f16SharedOk = false;
				console.warn('[webgpu] GEMM f16 tuilé COUPÉ par ?f16shared=0 — matmul_t_f16w pour tous les m');
			}
			if (urlFlag('gemv') === '0') {
				this.gemvOk = false;
				console.warn('[webgpu] GEMV de décodage COUPÉ par ?gemv=0 — kernels par lignes');
			}
			if (urlFlag('qshared') === '0') {
				this.qSharedOk = false;
				console.warn('[webgpu] GEMM q8/q4 tuilés COUPÉS par ?qshared=0 — kernels 4 lignes/invocation');
			}
			if (urlFlag('videoresident') === '0') {
				this.videoResidentOk = false;
				console.warn('[webgpu] motion résident COUPÉ par ?videoresident=0 — chemin JS+readback');
			}
		} catch { /* hors navigateur (tests Node) */ }
		// device.lost est une promesse : elle résout quand le GPU disparaît (jamais sur un simple
		// unload — on ne détruit pas le device volontairement, sauf reason 'destroyed' filtrée côté UI).
		this.device.lost?.then?.((info: { reason?: string; message?: string }) => {
			this.lost = true;
			console.warn('[webgpu] device GPU perdu :', info?.reason || 'unknown', info?.message || '');
			this.onLost?.(info);
		});
		for (const [name, code] of Object.entries(SHADERS)) {
			this.modules[name] = this.device.createShaderModule({ code });
		}
		// The f16 module only compiles where `enable f16;` is supported.
		if (this.hasF16) this.modules['matmul_t_f16w'] = this.device.createShaderModule({ code: MATMUL_T_F16W });
		return true;
	}

	private buf(data: Float32Array, usage: number): GPUAny {
		const b = this.device.createBuffer({ size: data.byteLength, usage });
		this.device.queue.writeBuffer(b, 0, data);
		return b;
	}

	// Upload raw bytes (e.g. a Q4_K-quantized tensor) as a u32 storage buffer.
	private bufU32(data: Uint32Array, usage: number): GPUAny {
		const b = this.device.createBuffer({ size: data.byteLength, usage });
		this.device.queue.writeBuffer(b, 0, data);
		return b;
	}

	private async readBack(src: GPUAny, byteLength: number): Promise<Float32Array> {
		const G = globalThis as any;
		const read = this.device.createBuffer({
			size: byteLength,
			usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ
		});
		const enc = this.device.createCommandEncoder();
		enc.copyBufferToBuffer(src, 0, read, 0, byteLength);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const out = new Float32Array(read.getMappedRange().slice(0));
		read.unmap();
		read.destroy();
		return out;
	}

	// Read raw bytes back from a GPU buffer (for serializing quantized weights to a .brik). `byteLength`
	// is rounded up to a multiple of 4 for the copy, then sliced to the exact length requested.
	private async readBackBytes(src: GPUAny, byteLength: number): Promise<Uint8Array> {
		const G = globalThis as any;
		const padded = Math.ceil(byteLength / 4) * 4;
		const read = this.device.createBuffer({ size: padded, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		const enc = this.device.createCommandEncoder();
		enc.copyBufferToBuffer(src, 0, read, 0, padded);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const out = new Uint8Array(read.getMappedRange().slice(0, byteLength));
		read.unmap();
		read.destroy();
		return out;
	}

	// GGUF tensor bytes → packed q8web/q4web bytes (the on-disk .brik layout), quantized ENTIRELY on
	// the GPU then read back — no per-element CPU quantize loop. Used by the conversion pipeline so
	// GGUF→BRIK doesn't freeze the main thread. nElems % 32 == 0.
	// `chunkOverride` (elements) forces a small chunk size — used ONLY by selfValidate to exercise the
	// multi-chunk stitching on a tiny tensor. Production callers omit it.
	async quantizeToBytes(type: string, data: Uint8Array, nElems: number, dtype: 'q8' | 'q4', chunkOverride?: number): Promise<Uint8Array> {
		const groups = nElems / 32;
		const out = dtype === 'q8'
			? new Uint8Array(nElems + groups * 2)            // [codes | scales]
			: new Uint8Array(nElems / 2 + groups * 4);       // [nibbles | scales | mins]

		// Chunk so no intermediate GPU buffer (notably the nElems·4-byte f32 dequant output) exceeds
		// maxStorageBufferBindingSize. A single token_embd/output tensor on a big vocab is ~1 GB in f32
		// and silently corrupts (WebGPU caps a binding's size with an async error, NOT a throw) — that
		// was the GGUF→BRIK garbage. Chunks align to lcm(blockElems, 32) so every chunk is a whole
		// number of source quant-blocks AND of 32-wide quant groups. One chunk covering the whole tensor
		// is byte-identical to the un-chunked path (small tensors are unaffected).
		const blockElems = WebGpuEngine.BLOCK_ELEMS[type] ?? 1;
		const nBlocks = nElems / blockElems;
		const blockBytes = data.byteLength / nBlocks;
		const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
		const alignUnit = (blockElems * 32) / gcd(blockElems, 32);            // lcm(blockElems, 32)
		const budgetElems = Math.floor((this.maxStorageBufferBindingSize * 0.9) / 4); // f32 bytes → elems
		let chunkElems = chunkOverride ?? budgetElems;
		chunkElems = Math.max(alignUnit, Math.floor(chunkElems / alignUnit) * alignUnit);

		for (let e0 = 0; e0 < nElems; e0 += chunkElems) {
			const ce = Math.min(chunkElems, nElems - e0);
			// .slice (copy) — a subarray's byteOffset may not be 4-aligned, which breaks the u32 view in
			// dequantBlockedGpu. The copy is small relative to the GPU work.
			const chunkBytes = data.slice((e0 / blockElems) * blockBytes, ((e0 + ce) / blockElems) * blockBytes);
			const f32 = this.dequantizeToGpu(type, chunkBytes, ce);
			try {
				if (dtype === 'q8') {
					const { codes, sc } = this.f32ToQ8Gpu(f32, ce);
					const codesB = await this.readBackBytes(codes, ce);
					const scB = await this.readBackBytes(sc, (ce / 32) * 2);
					codes.destroy?.(); sc.destroy?.();
					out.set(codesB, e0);
					out.set(scB, nElems + (e0 / 32) * 2);
				} else {
					const { nib, sc, mn } = this.f32ToQ4Gpu(f32, ce);
					const nibB = await this.readBackBytes(nib, ce / 2);
					const scB = await this.readBackBytes(sc, (ce / 32) * 2);
					const mnB = await this.readBackBytes(mn, (ce / 32) * 2);
					nib.destroy?.(); sc.destroy?.(); mn.destroy?.();
					out.set(nibB, e0 / 2);
					out.set(scB, nElems / 2 + (e0 / 32) * 2);
					out.set(mnB, nElems / 2 + groups * 2 + (e0 / 32) * 2);
				}
			} finally {
				f32.destroy?.();
			}
		}
		return out;
	}

	// Cached compute pipeline for a shader (created lazily, reused across every dispatch).
	private pipeline(name: string): GPUAny {
		let p = this.pipelines[name];
		if (!p) {
			p = this.device.createComputePipeline({ layout: 'auto', compute: { module: this.modules[name], entryPoint: 'main' } });
			this.pipelines[name] = p;
		}
		return p;
	}

	// WebGPU caps each dispatch dimension at maxComputeWorkgroupsPerDimension (65535 on virtually
	// every device, and not raisable). A 1-D kernel over N elements needs ceil(N/WG) workgroups; once
	// that exceeds 65535 (e.g. swiglu over seq×ffn for a prompt past ~860 tokens) the WHOLE submit is
	// rejected and the output buffers keep garbage → corrupted logits → token salad. grid1D spreads
	// the workgroups over a 2-D grid so no dimension overflows; the matching kernels rebuild the flat
	// index as (wid.y * num_workgroups.x + wid.x) * WG + lid.x.
	private static readonly MAX_WG_DIM = 65535;
	private grid1D(count: number): [number, number, number] {
		const wg = Math.ceil(count / WG);
		if (wg <= WebGpuEngine.MAX_WG_DIM) return [wg, 1, 1];
		const x = WebGpuEngine.MAX_WG_DIM;
		return [x, Math.ceil(wg / x), 1];
	}

	// Records ONE compute pass into an existing command encoder — no submit, no readback. The
	// building block of the GPU-resident path: dozens of these chain into a single encoder so a
	// whole forward pass is one queue submit (vs. the per-op submit+mapAsync the readback path pays).
	private recordPass(enc: GPUAny, name: string, buffers: GPUAny[], workgroups: [number, number, number]): void {
		const pipeline = this.pipeline(name);
		const bind = this.device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: buffers.map((buffer, i) => ({ binding: i, resource: { buffer } }))
		});
		// Le SEUL point d'accroche du profileur : toutes les passes du chemin résident passent ici, et
		// `name` est déjà le nom du kernel. `?.` quand c'est éteint — cf. ./gpuProfile.ts.
		const ts = this.profiler?.slot(name);
		const pass = enc.beginComputePass(ts ? { timestampWrites: ts } : undefined);
		pass.setPipeline(pipeline);
		pass.setBindGroup(0, bind);
		pass.dispatchWorkgroups(...workgroups);
		pass.end();
	}

	// Records + submits a compute pass (no readback). Used both by `run` (which then reads
	// back) and by the GPU-persistent dequant (which keeps the output buffer on the GPU).
	private dispatch(name: string, buffers: GPUAny[], workgroups: [number, number, number]): void {
		const enc = this.device.createCommandEncoder();
		this.recordPass(enc, name, buffers, workgroups);
		this.device.queue.submit([enc.finish()]);
	}

	private async run(
		name: string,
		buffers: GPUAny[],
		workgroups: [number, number, number],
		outBuffer: GPUAny,
		outBytes: number
	): Promise<Float32Array> {
		this.dispatch(name, buffers, workgroups);
		return this.readBack(outBuffer, outBytes);
	}

	// True if `w` is a Float32Array (needs uploading) vs an already-on-GPU buffer to reuse.
	private isF32(w: Float32Array | GPUAny): w is Float32Array {
		return w instanceof Float32Array;
	}

	// matmul/matmulT accept the weight either as a Float32Array (uploaded each call) OR as a
	// persistent GPUBuffer (uploaded ONCE, reused across tokens — the big decode-speed win).
	async matmul(a: Float32Array, b: Float32Array | GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const bufB = this.isF32(b) ? this.buf(b, ST) : b;
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul', [dims, this.buf(a, ST), bufB, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1], out, m * n * 4);
	}

	// y = a[m,k] · wᵀ where w is [n,k] (GGUF [out,in] layout). out is [m,n].
	async matmulT(a: Float32Array, w: Float32Array | GPUAny, m: number, k: number, n: number, wF16 = false): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const bufW = this.isF32(w) ? this.buf(w, ST) : w;
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		const plan = this.matmulTPlan(m, k, n, wF16);
		return this.run(plan.shader, [dims, this.buf(a, ST), bufW, out], plan.grid, out, m * n * 4);
	}

	// Pick the matmul_t variant AND its grid. Poids f16 (chemin BRIK/desktop) : au prefill (m ≥ 16) le
	// GEMM tuilé en mémoire partagée et bloqué en registres — tuiles de sortie 32 lignes × 64 colonnes,
	// chaque poids lu une fois pour 32 lignes de tokens ; sinon (décodage m = 1, ou gate/kill-switch) le
	// kernel f16 vectorisé une-ligne-par-thread. Le tuilé lit les poids par paires (un mot u32 = 2 f16),
	// d'où k % 4 == 0 (toujours vrai sur ce chemin — BRIK le garantit, comme pour matmul_t_f16w).
	// Poids f32 : kernel vec4 quand k%4==0 (128-bit loads), repli scalaire sinon.
	private matmulTPlan(m: number, k: number, n: number, wF16: boolean): { shader: string; grid: [number, number, number] } {
		if (wF16 && this.hasF16) {
			if (this.f16SharedOk && m >= 32 && k % 4 === 0) {
				return { shader: 'matmul_t_f16w_shared', grid: [Math.ceil(n / 64), Math.ceil(m / 32), 1] };
			}
			return { shader: 'matmul_t_f16w', grid: [Math.ceil(m / 8), Math.ceil(n / 8), 1] };
		}
		return { shader: k % 4 === 0 ? 'matmul_t_vec4' : 'matmul_t', grid: [Math.ceil(m / 8), Math.ceil(n / 8), 1] };
	}

	async rmsnorm(x: Float32Array, w: Float32Array, rows: number, dim: number, eps = 1e-5, onePlus = false): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, dim]));
		this.device.queue.writeBuffer(p, 8, new Float32Array([eps]));
		this.device.queue.writeBuffer(p, 12, new Uint32Array([onePlus ? 1 : 0]));
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('rmsnorm', [p, this.buf(x, ST), this.buf(w, ST), out], [Math.ceil(rows / WG), 1, 1], out, x.byteLength);
	}

	private async binary(name: string, a: Float32Array, b: Float32Array): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const out = this.device.createBuffer({ size: a.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run(name, [this.buf(a, ST), this.buf(b, ST), out], this.grid1D(a.length), out, a.byteLength);
	}
	swiglu(gate: Float32Array, up: Float32Array) { return this.binary('swiglu', gate, up); }
	geglu(gate: Float32Array, up: Float32Array) { return this.binary('geglu', gate, up); }
	add(a: Float32Array, b: Float32Array) { return this.binary('add', a, b); }

	// ── Image-generation primitives (diffusion). See docs/image-gen-feasibility.md. ──

	// o = silu(x), element-wise. (Diffusion ResBlocks; the LLM path uses fused swiglu/geglu instead.)
	async silu(x: Float32Array): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('silu', [this.buf(x, ST), out], this.grid1D(x.length), out, x.byteLength);
	}

	// GroupNorm over one image x=[C,HW] with `groups` groups + per-channel affine (gamma,beta length C).
	async groupNorm(x: Float32Array, gamma: Float32Array, beta: Float32Array, C: number, HW: number, groups: number, eps = 1e-5): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([C, HW, groups]));
		this.device.queue.writeBuffer(p, 12, new Float32Array([eps]));
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('group_norm', [p, this.buf(x, ST), this.buf(gamma, ST), this.buf(beta, ST), out], [groups, 1, 1], out, x.byteLength);
	}

	// conv2d on ONE image (NCHW): input [Cin,H,W], weight [Cout,Cin,kh,kw] row-major, optional bias
	// [Cout]. Returns [Cout,OH,OW] flattened. Implemented as im2col (GPU) → GEMM (reuses matmul). f32
	// for now — quantif viendra avec le packaging BRIK image (jalon 6).
	async conv2d(input: Float32Array, weight: Float32Array, bias: Float32Array | null, Cin: number, H: number, W: number, Cout: number, kh: number, kw: number, stride = 1, pad = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const OH = Math.floor((H + 2 * pad - kh) / stride) + 1;
		const OW = Math.floor((W + 2 * pad - kw) / stride) + 1;
		const K = Cin * kh * kw, np = OH * OW;
		// im2col needs a [K·np] f32 column buffer; at high resolution that exceeds the storage-binding
		// cap (e.g. 64ch·3×3 at 512² ≈ 600 MB). Fall back to the memory-safe direct conv there.
		if (K * np * 4 > this.maxStorageBufferBindingSize * 0.9) {
			return this.conv2dDirect(input, weight, bias, Cin, H, W, Cout, kh, kw, stride, pad);
		}
		const p = this.device.createBuffer({ size: 48, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([Cin, H, W, kh, kw, stride, pad, OH, OW]));
		const col = this.device.createBuffer({ size: K * np * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		this.dispatch('im2col', [p, this.buf(input, ST), col], this.grid1D(K * np));
		// GEMM: weight[Cout,K] · col[K,np] → out[Cout,np]
		const out = await this.matmul(weight, col, Cout, K, np);
		col.destroy?.(); p.destroy?.();
		if (bias) for (let co = 0; co < Cout; co++) { const b = bias[co]; for (let i = 0; i < np; i++) out[co * np + i] += b; }
		return out;
	}

	// Direct conv2d (no im2col column buffer) — memory-safe at full resolution. Same result as conv2d.
	async conv2dDirect(input: Float32Array, weight: Float32Array, bias: Float32Array | null, Cin: number, H: number, W: number, Cout: number, kh: number, kw: number, stride = 1, pad = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const OH = Math.floor((H + 2 * pad - kh) / stride) + 1;
		const OW = Math.floor((W + 2 * pad - kw) / stride) + 1;
		const n = Cout * OH * OW;
		const p = this.device.createBuffer({ size: 48, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([Cin, H, W, Cout, kh, kw, stride, pad, OH, OW]));
		const biasArr = bias ?? new Float32Array(Cout); // shader always reads bias[co]; zeros if none
		const out = this.device.createBuffer({ size: n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('conv2d_direct', [p, this.buf(input, ST), this.buf(weight, ST), this.buf(biasArr, ST), out], this.grid1D(n), out, n * 4);
	}

	// LayerNorm over [rows, dim] with affine gamma/beta (length dim). CLIP text encoder.
	async layernorm(x: Float32Array, gamma: Float32Array, beta: Float32Array, rows: number, dim: number, eps = 1e-5): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, dim]));
		this.device.queue.writeBuffer(p, 8, new Float32Array([eps]));
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('layernorm', [p, this.buf(x, ST), this.buf(gamma, ST), this.buf(beta, ST), out], [Math.ceil(rows / WG), 1, 1], out, x.byteLength);
	}

	// o = quick_gelu(x) = x·sigmoid(1.702x), element-wise. CLIP MLP activation.
	async quickGelu(x: Float32Array): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('quick_gelu', [this.buf(x, ST), out], this.grid1D(x.length), out, x.byteLength);
	}

	// gelu (tanh-approx). OpenCLIP ViT-H text encoder activation.
	async gelu(x: Float32Array): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('gelu', [this.buf(x, ST), out], this.grid1D(x.length), out, x.byteLength);
	}

	// o = relu(x), element-wise. (TAESD decoder activation.)
	async relu(x: Float32Array): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('relu', [this.buf(x, ST), out], this.grid1D(x.length), out, x.byteLength);
	}

	// Nearest-neighbour upsample of x=[C,H,W] by `scale` → [C, H·scale, W·scale].
	async upsampleNearest(x: Float32Array, C: number, H: number, W: number, scale = 2): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const OH = H * scale, OW = W * scale, n = C * OH * OW;
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([C, H, W, scale]));
		const out = this.device.createBuffer({ size: n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('upsample_nearest', [p, this.buf(x, ST), out], this.grid1D(n), out, n * 4);
	}

	// RoPE over x viewed as [rows, headDim], rows = seq * nHeads.
	async rope(x: Float32Array, rows: number, headDim: number, nHeads: number, pastLen = 0, base = 10000, interleaved = false): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, headDim, nHeads, pastLen]));
		this.device.queue.writeBuffer(p, 16, new Float32Array([base]));
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		this.device.queue.writeBuffer(p, 20, new Uint32Array([interleaved ? 1 : 0]));
		return this.run('rope', [p, this.buf(x, ST), out], [Math.ceil(rows / WG), 1, 1], out, x.byteLength);
	}

	// RoPE à facteurs avec readback — pour le gate selfValidate ; le chemin résident passe par
	// recRopeFactors. ff = [headDim/2] diviseurs de fréquence (rope_freqs.weight).
	async ropeFactors(x: Float32Array, ff: Float32Array, rows: number, headDim: number, nHeads: number, pastLen = 0, base = 10000, interleaved = false): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, headDim, nHeads, pastLen]));
		this.device.queue.writeBuffer(p, 16, new Float32Array([base]));
		const ffB = this.device.createBuffer({ size: ff.byteLength, usage: ST });
		this.device.queue.writeBuffer(ffB, 0, ff);
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		this.device.queue.writeBuffer(p, 20, new Uint32Array([interleaved ? 1 : 0]));
		return this.run('rope_factors', [p, this.buf(x, ST), ffB, out], [Math.ceil(rows / WG), 1, 1], out, x.byteLength);
	}

	// M-RoPE (LLM Qwen2-VL) avec readback — pour le gate selfValidate ; le chemin résident passe
	// par recRopeMrope. `pos` = triplets u32 (t, h, w) par token.
	async ropeMrope(x: Float32Array, pos: Uint32Array, rows: number, headDim: number, nHeads: number, sections: number[], base = 10000): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, headDim, nHeads, sections[0], sections[0] + sections[1]]));
		this.device.queue.writeBuffer(p, 20, new Float32Array([base]));
		const posB = this.device.createBuffer({ size: pos.byteLength, usage: ST });
		this.device.queue.writeBuffer(posB, 0, pos);
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('rope_mrope', [p, this.buf(x, ST), posB, out], [Math.ceil(rows / WG), 1, 1], out, x.byteLength);
	}

	// RoPE 2D (ViT Qwen2-VL) avec readback — pour les self-tests ; le chemin résident passe par la
	// session (`s.rope2d`). `pos` = paires u32 (h, w) par patch, x = [rows=nPatch·nHeads, headDim].
	async rope2d(x: Float32Array, pos: Uint32Array, rows: number, headDim: number, nHeads: number, base = 10000): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, headDim, nHeads, 0]));
		this.device.queue.writeBuffer(p, 16, new Float32Array([base]));
		const posB = this.device.createBuffer({ size: pos.byteLength, usage: ST });
		this.device.queue.writeBuffer(posB, 0, pos);
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('rope_2d', [p, this.buf(x, ST), posB, out], [Math.ceil(rows / WG), 1, 1], out, x.byteLength);
	}

	// Causal attention with KV cache + GQA. q: [nTokens,nHeads,headDim]; k,v:
	// [kvLen,nKvHeads,headDim], kvLen = pastLen + nTokens. Returns [nTokens,nHeads,headDim].
	async attention(q: Float32Array, k: Float32Array, v: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, pastLen = 0, scale?: number, softcap = 0, window = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const kvLen = pastLen + nTokens;
		const p = this.attnUniform(nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen, scale ?? 1 / Math.sqrt(headDim), softcap, window);
		const outBytes = nTokens * nHeads * headDim * 4;
		const out = this.device.createBuffer({ size: outBytes, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('attention', [p, this.buf(q, ST), this.buf(k, ST), this.buf(v, ST), out], [Math.ceil((nTokens * nHeads) / WG), 1, 1], out, outBytes);
	}

	// Variante « décodage » (un workgroup de 64 lanes par (token, tête), softmax en ligne) —
	// readback exposé pour selfValidate ; le chemin résident passe par recAttention.
	async attentionDecode(q: Float32Array, k: Float32Array, v: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, pastLen = 0, scale?: number, softcap = 0, window = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const kvLen = pastLen + nTokens;
		const p = this.attnUniform(nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen, scale ?? 1 / Math.sqrt(headDim), softcap, window);
		const outBytes = nTokens * nHeads * headDim * 4;
		const out = this.device.createBuffer({ size: outBytes, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('attention_decode', [p, this.buf(q, ST), this.buf(k, ST), this.buf(v, ST), out], [nTokens * nHeads, 1, 1], out, outBytes);
	}

	// Non-causal full attention (UNet self/cross-attention). q:[nTokens,nHeads,headDim], k/v:[kvLen,
	// nKvHeads,headDim]; kvLen is independent of nTokens (cross-attn: kvLen = text length). Every query
	// attends to all kvLen keys. Default scale 1/√headDim.
	async attentionFull(q: Float32Array, k: Float32Array, v: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, kvLen: number, scale?: number, softcap = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nTokens, nHeads, nKvHeads, headDim, kvLen, 0]));
		this.device.queue.writeBuffer(p, 24, new Float32Array([scale ?? 1 / Math.sqrt(headDim), softcap]));
		const outBytes = nTokens * nHeads * headDim * 4;
		const out = this.device.createBuffer({ size: outBytes, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('attention_full', [p, this.buf(q, ST), this.buf(k, ST), this.buf(v, ST), out], [Math.ceil((nTokens * nHeads) / WG), 1, 1], out, outBytes);
	}

	// Variante « workgroup par (token, tête) » de attentionFull (softmax en ligne, une passe sur K) —
	// readback exposé pour le gate de validateDiffusion ; le chemin résident passe par recAttentionFull.
	async attentionFullWg(q: Float32Array, k: Float32Array, v: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, kvLen: number, scale?: number, softcap = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nTokens, nHeads, nKvHeads, headDim, kvLen, 0]));
		this.device.queue.writeBuffer(p, 24, new Float32Array([scale ?? 1 / Math.sqrt(headDim), softcap]));
		const outBytes = nTokens * nHeads * headDim * 4;
		const out = this.device.createBuffer({ size: outBytes, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('attention_full_wg', [p, this.buf(q, ST), this.buf(k, ST), this.buf(v, ST), out], [nTokens * nHeads, 1, 1], out, outBytes);
	}

	// Quantize K/V rows to the int8 layout and read back {codes, scales} — for tests / gating.
	async quantizeKvReadback(src: Float32Array, rows: number, nKvHeads: number, headDim: number): Promise<{ codes: Uint32Array; scales: Float32Array }> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.COPY_SRC;
		const kvDim = nKvHeads * headDim;
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, nKvHeads, headDim, 0]));
		const codes = this.device.createBuffer({ size: rows * kvDim, usage: ST });
		const scales = this.device.createBuffer({ size: rows * nKvHeads * 4, usage: ST });
		this.dispatch('quantize_kv', [p, this.buf(src, ST), codes, scales], this.grid1D(rows * nKvHeads));
		const codesF = await this.readBack(codes, rows * kvDim);   // bytes read as f32 view length
		const codesU32 = new Uint32Array(codesF.buffer, 0, (rows * kvDim) / 4);
		const scalesF = await this.readBack(scales, rows * nKvHeads * 4);
		codes.destroy?.(); scales.destroy?.();
		return { codes: codesU32, scales: scalesF };
	}

	// Attention over an int8 KV cache (codes + f32 scales), read back — for tests / gating.
	async attentionQ8Kv(q: Float32Array, kc: Uint32Array, ks: Float32Array, vc: Uint32Array, vs: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, pastLen = 0, scale?: number, softcap = 0, window = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const kvLen = pastLen + nTokens;
		const p = this.attnUniform(nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen, scale ?? 1 / Math.sqrt(headDim), softcap, window);
		const outBytes = nTokens * nHeads * headDim * 4;
		const out = this.device.createBuffer({ size: outBytes, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('attention_q8kv', [p, this.buf(q, ST), this.bufU32(kc, ST), this.buf(ks, ST), this.bufU32(vc, ST), this.buf(vs, ST), out], [Math.ceil((nTokens * nHeads) / WG), 1, 1], out, outBytes);
	}

	// Variante « décodage » de attentionQ8Kv (workgroup par tête) — readback pour selfValidate.
	async attentionQ8KvDecode(q: Float32Array, kc: Uint32Array, ks: Float32Array, vc: Uint32Array, vs: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, pastLen = 0, scale?: number, softcap = 0, window = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const kvLen = pastLen + nTokens;
		const p = this.attnUniform(nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen, scale ?? 1 / Math.sqrt(headDim), softcap, window);
		const outBytes = nTokens * nHeads * headDim * 4;
		const out = this.device.createBuffer({ size: outBytes, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('attention_decode_q8kv', [p, this.buf(q, ST), this.bufU32(kc, ST), this.buf(ks, ST), this.bufU32(vc, ST), this.buf(vs, ST), out], [nTokens * nHeads, 1, 1], out, outBytes);
	}

	// o[r, c] = x[r, c] + bias[c]. Used for Qwen2's q/k/v projection biases.
	async addBias(x: Float32Array, bias: Float32Array, rows: number, cols: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 8, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, cols]));
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('addbias', [p, this.buf(x, ST), this.buf(bias, ST), out], this.grid1D(x.length), out, x.byteLength);
	}

	// Number of weights per quant block, by GGML type. F32/F16 are "1 per block".
	private static BLOCK_ELEMS: Record<string, number> = {
		Q4_K: 256, Q5_K: 256, Q6_K: 256, Q8_0: 32, Q5_0: 32, Q4_0: 32, F32: 1, F16: 1
	};
	private static DEQUANT_SHADER: Record<string, string> = {
		Q4_K: 'dequant_q4k', Q8_0: 'dequant_q8_0', Q5_0: 'dequant_q5_0', Q6_K: 'dequant_q6k',
		Q4_0: 'dequant_q4_0', Q5_K: 'dequant_q5k'
	};

	// Generic GPU dequant: upload the raw GGUF tensor bytes as u32, run the per-type kernel
	// (one invocation per quant block), read back the f32 weights. `blockElems` is how many
	// weights one block expands to. This is the bridge from streamed quantized model
	// weights to real WebGPU compute.
	private async dequantBlocked(shader: string, data: Uint8Array, nElems: number, blockElems: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const nBlocks = nElems / blockElems;
		if (!Number.isInteger(nBlocks)) throw new Error(`${shader}: nElems ${nElems} not a multiple of ${blockElems}`);
		// View bytes as u32 (pad to a 4-byte multiple; block sizes aren't all 4-aligned).
		const padded = data.byteLength % 4 === 0 ? data : (() => {
			const t = new Uint8Array(Math.ceil(data.byteLength / 4) * 4);
			t.set(data);
			return t;
		})();
		const u32 = new Uint32Array(padded.buffer, padded.byteOffset, padded.byteLength / 4);
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nBlocks]));
		const out = this.device.createBuffer({ size: nElems * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run(shader, [p, this.bufU32(u32, ST), out], this.grid1D(nBlocks), out, nElems * 4);
	}

	async dequantizeQ4K(data: Uint8Array, nElems: number) { return this.dequantBlocked('dequant_q4k', data, nElems, 256); }

	// Dequantize a tensor of any supported GGML type to f32, given the manifest's `type`
	// string. F32 is returned as-is; F16 is decoded on the CPU (cheap, only norms/biases).
	async dequantizeByType(type: string, data: Uint8Array, nElems: number): Promise<Float32Array> {
		if (type === 'F32') return new Float32Array(data.buffer, data.byteOffset, nElems);
		if (type === 'F16') {
			const dv = new DataView(data.buffer, data.byteOffset);
			const o = new Float32Array(nElems);
			for (let i = 0; i < nElems; i++) o[i] = f16ToF32(dv.getUint16(i * 2, true));
			return o;
		}
		// BRIK-native quants (Q4W/Q8W) decode on the CPU. The fused matmuls consume the packed bytes
		// directly (dequantizeToGpu* below), so this is only hit by the f16/f32 precision toggles.
		if (type === 'Q4W') return dequantizeQ4(unpackQ4(data, nElems));
		if (type === 'Q8W') return dequantizeQ8(unpackQ8(data, nElems));
		if (type === 'Q3W') return dequantizeQ3(unpackQ3(data, nElems));
		const shader = WebGpuEngine.DEQUANT_SHADER[type];
		const blockElems = WebGpuEngine.BLOCK_ELEMS[type];
		if (!shader || !blockElems) throw new Error(`dequant: unsupported GGML type ${type}`);
		return this.dequantBlocked(shader, data, nElems, blockElems);
	}

	// Like dequantBlocked but KEEPS the f32 output on the GPU (no readback) and returns the
	// buffer — a persistent weight matmul/matmulT can reuse across every decode step.
	private dequantBlockedGpu(shader: string, data: Uint8Array, nElems: number, blockElems: number): GPUAny {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const nBlocks = nElems / blockElems;
		if (!Number.isInteger(nBlocks)) throw new Error(`${shader}: nElems ${nElems} not a multiple of ${blockElems}`);
		const padded = data.byteLength % 4 === 0 ? data : (() => {
			const t = new Uint8Array(Math.ceil(data.byteLength / 4) * 4);
			t.set(data);
			return t;
		})();
		const u32 = new Uint32Array(padded.buffer, padded.byteOffset, padded.byteLength / 4);
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nBlocks]));
		const out = this.device.createBuffer({ size: nElems * 4, usage: ST });
		this.dispatch(shader, [p, this.bufU32(u32, ST), out], this.grid1D(nBlocks));
		return out;
	}

	// Dequantize a tensor straight into a PERSISTENT GPU buffer (no CPU round-trip) — used to
	// upload each model weight ONCE and reuse it as a matmul operand across all decode steps.
	dequantizeToGpu(type: string, data: Uint8Array, nElems: number): GPUAny {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		if (type === 'F32') {
			return this.buf(new Float32Array(data.buffer, data.byteOffset, nElems), ST);
		}
		if (type === 'F16') {
			const dv = new DataView(data.buffer, data.byteOffset);
			const o = new Float32Array(nElems);
			for (let i = 0; i < nElems; i++) o[i] = f16ToF32(dv.getUint16(i * 2, true));
			return this.buf(o, ST);
		}
		// BRIK-native quants: no GPU dequant shader; decode on the CPU (cheap, sync) then upload f32.
		// Only hit when a natively-quantized model is forced to the f32 tier.
		if (type === 'Q4W') return this.buf(dequantizeQ4(unpackQ4(data, nElems)), ST);
		if (type === 'Q8W') return this.buf(dequantizeQ8(unpackQ8(data, nElems)), ST);
		if (type === 'Q3W') return this.buf(dequantizeQ3(unpackQ3(data, nElems)), ST);
		const shader = WebGpuEngine.DEQUANT_SHADER[type];
		const blockElems = WebGpuEngine.BLOCK_ELEMS[type];
		if (!shader || !blockElems) throw new Error(`dequant: unsupported GGML type ${type}`);
		return this.dequantBlockedGpu(shader, data, nElems, blockElems);
	}

	// Full pre-norm transformer layer forward (prefill, no KV cache) using the GPU kernels.
	// Supports GQA (nKvHeads ≤ nHeads), optional q/k/v biases, configurable RoPE base + eps —
	// i.e. both Llama and Qwen2. d = nHeads * headDim; k/v project to kvDim = nKvHeads*headDim.
	// `transposed` selects the weight layout: false ⇒ row-major [in, out] (used by the
	// self-test); true ⇒ GGUF [out, in] consumed directly via matmulT (real model weights).
	async layerForward(x: Float32Array, cfg: LayerCfg, w: LayerWeights, transposed = false): Promise<Float32Array> {
		const { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const mm = transposed
			? (a: Float32Array, b: Float32Array | GPUAny, m: number, k: number, n: number) => this.matmulT(a, b, m, k, n)
			: (a: Float32Array, b: Float32Array | GPUAny, m: number, k: number, n: number) => this.matmul(a, b, m, k, n);
		const qDim = nHeads * headDim; // == d for Qwen/Llama; differs for Gemma2
		const onePlus = cfg.rmsGainOnePlus === true;
		const softcap = cfg.attnLogitSoftcap ?? 0;
		const gateAct = (g: Float32Array, u: Float32Array) => cfg.act === 'gelu' ? this.geglu(g, u) : this.swiglu(g, u);
		const n1 = await this.rmsnorm(x, w.attnNorm, seq, d, eps, onePlus);
		let qP = await mm(n1, w.wq, seq, d, qDim);
		let kP = await mm(n1, w.wk, seq, d, kvDim);
		let vP = await mm(n1, w.wv, seq, d, kvDim);
		if (w.bq) qP = await this.addBias(qP, w.bq, seq, qDim);
		if (w.bk) kP = await this.addBias(kP, w.bk, seq, kvDim);
		if (w.bv) vP = await this.addBias(vP, w.bv, seq, kvDim);
		if (w.qNorm) qP = await this.rmsnorm(qP, w.qNorm, seq * nHeads, headDim, eps, onePlus);
		if (w.kNorm) kP = await this.rmsnorm(kP, w.kNorm, seq * nKvHeads, headDim, eps, onePlus);
		const q = await this.rope(qP, seq * nHeads, headDim, nHeads, 0, ropeTheta);
		const k = await this.rope(kP, seq * nKvHeads, headDim, nKvHeads, 0, ropeTheta);
		const attn = await this.attention(q, k, vP, seq, nHeads, nKvHeads, headDim, 0, cfg.attnScale, softcap);
		let proj = await mm(attn, w.wo, seq, qDim, d);
		if (w.postAttnNorm) proj = await this.rmsnorm(proj, w.postAttnNorm, seq, d, eps, onePlus);
		const h = await this.add(x, proj);
		const n2 = await this.rmsnorm(h, w.ffnNorm, seq, d, eps, onePlus);
		const gate = await mm(n2, w.wgate, seq, d, ffn);
		const up = await mm(n2, w.wup, seq, d, ffn);
		const g = await gateAct(gate, up);
		let down = await mm(g, w.wdown, seq, ffn, d);
		if (w.postFfnNorm) down = await this.rmsnorm(down, w.postFfnNorm, seq, d, eps, onePlus);
		return this.add(h, down);
	}

	// Same as layerForward but with a KV cache: processes `seq` NEW tokens at absolute
	// positions [pastLen, pastLen+seq), attends over the past K/V (`pastK`/`pastV`, laid out
	// [pastLen, nKvHeads, headDim]) plus the new ones, and returns the OUTPUT hidden state
	// together with the GROWN cache {k, v} to persist for the next decode step. This turns a
	// distributed slice into an incremental decoder — no O(n²) re-prefill each token.
	async layerForwardKV(
		x: Float32Array, cfg: LayerCfg, w: LayerWeights,
		pastLen: number, pastK: Float32Array, pastV: Float32Array, transposed = false
	): Promise<{ out: Float32Array; k: Float32Array; v: Float32Array }> {
		const { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const mm = transposed
			? (a: Float32Array, b: Float32Array | GPUAny, mm_: number, kk: number, nn: number) => this.matmulT(a, b, mm_, kk, nn)
			: (a: Float32Array, b: Float32Array | GPUAny, mm_: number, kk: number, nn: number) => this.matmul(a, b, mm_, kk, nn);
		const cat = (a: Float32Array, b: Float32Array) => { const c = new Float32Array(a.length + b.length); c.set(a); c.set(b, a.length); return c; };
		const qDim = nHeads * headDim; // == d for Qwen/Llama; differs for Gemma2
		const onePlus = cfg.rmsGainOnePlus === true;
		const softcap = cfg.attnLogitSoftcap ?? 0;
		const gateAct = (g: Float32Array, u: Float32Array) => cfg.act === 'gelu' ? this.geglu(g, u) : this.swiglu(g, u);
		const n1 = await this.rmsnorm(x, w.attnNorm, seq, d, eps, onePlus);
		let qP = await mm(n1, w.wq, seq, d, qDim);
		let kP = await mm(n1, w.wk, seq, d, kvDim);
		let vP = await mm(n1, w.wv, seq, d, kvDim);
		if (w.bq) qP = await this.addBias(qP, w.bq, seq, qDim);
		if (w.bk) kP = await this.addBias(kP, w.bk, seq, kvDim);
		if (w.bv) vP = await this.addBias(vP, w.bv, seq, kvDim);
		if (w.qNorm) qP = await this.rmsnorm(qP, w.qNorm, seq * nHeads, headDim, eps, onePlus);
		if (w.kNorm) kP = await this.rmsnorm(kP, w.kNorm, seq * nKvHeads, headDim, eps, onePlus);
		const q = await this.rope(qP, seq * nHeads, headDim, nHeads, pastLen, ropeTheta);
		const newK = await this.rope(kP, seq * nKvHeads, headDim, nKvHeads, pastLen, ropeTheta);
		// Append the new tokens' K/V to the cache (token axis), then attend over all of it.
		const fullK = cat(pastK, newK);
		const fullV = cat(pastV, vP);
		const attn = await this.attention(q, fullK, fullV, seq, nHeads, nKvHeads, headDim, pastLen, cfg.attnScale, softcap);
		let proj = await mm(attn, w.wo, seq, qDim, d);
		if (w.postAttnNorm) proj = await this.rmsnorm(proj, w.postAttnNorm, seq, d, eps, onePlus);
		const h = await this.add(x, proj);
		const n2 = await this.rmsnorm(h, w.ffnNorm, seq, d, eps, onePlus);
		const gate = await mm(n2, w.wgate, seq, d, ffn);
		const up = await mm(n2, w.wup, seq, d, ffn);
		const g = await gateAct(gate, up);
		let down = await mm(g, w.wdown, seq, ffn, d);
		if (w.postFfnNorm) down = await this.rmsnorm(down, w.postFfnNorm, seq, d, eps, onePlus);
		const out = await this.add(h, down);
		return { out, k: fullK, v: fullV };
	}

	// ── GPU-resident decode path ──────────────────────────────────────────────
	// The methods above read every intermediate back to the CPU between kernels (one mapAsync
	// per op). For real inference that is ~13 GPU↔CPU round-trips per layer × N layers per
	// token — latency-bound, and the true bottleneck. The path below keeps every activation in
	// GPU buffers, records the entire token forward (all layers + final norm) into ONE command
	// encoder, submits ONCE, and reads back ONLY the last token's hidden state.

	private static readonly STORAGE_USAGE = 0x80 | 0x4 | 0x8; // STORAGE | COPY_DST | COPY_SRC

	// Scratch-buffer pool: per-token forwards allocate ~hundreds of storage buffers and free them
	// right after; recreating them every token is pure overhead. Pool them by byte size and reuse
	// across tokens. Safe because buffers only return to the pool AFTER the submit's readback
	// completes (GPU is done with them). `poolSize` records each buffer's size for release.
	private bufferPool = new Map<number, GPUAny[]>();
	private poolSize = new WeakMap<object, number>();

	// A GPU storage buffer of `byteLength` — reused from the pool if one is free, else created.
	private storage(byteLength: number): GPUAny {
		const free = this.bufferPool.get(byteLength);
		if (free && free.length) { const b = free.pop(); this.pooled.delete(b); return b; }
		const b = this.device.createBuffer({ size: byteLength, usage: WebGpuEngine.STORAGE_USAGE });
		this.poolSize.set(b, byteLength);
		return b;
	}

	// Return transient buffers: pooled scratch (from storage()) goes back to the pool for reuse;
	// anything else (uniforms, etc.) is destroyed. The `pooled` guard makes a double-release a no-op
	// instead of silent aliasing (the same buffer twice in the pool → handed out to two users) —
	// releaseGpu() is public now, a buggy call site must not corrupt the pool.
	private pooled = new WeakSet<object>();
	private release(buffers: GPUAny[]): void {
		for (const b of buffers) {
			if (!b) continue;
			const sz = this.poolSize.get(b);
			if (sz !== undefined) {
				if (this.pooled.has(b)) continue; // already in the pool — double release
				this.pooled.add(b);
				let list = this.bufferPool.get(sz);
				if (!list) { list = []; this.bufferPool.set(sz, list); }
				list.push(b);
				continue;
			}
			const usz = this.uniformSize.get(b);
			if (usz !== undefined) {
				if (this.pooled.has(b)) continue;
				this.pooled.add(b);
				let list = this.uniformPool.get(usz);
				if (!list) { list = []; this.uniformPool.set(usz, list); }
				list.push(b);
				continue;
			}
			b.destroy?.();
		}
	}

	// Upload a weight into a PERSISTENT f32 storage buffer (GPU-resident norms/biases). Accepts an
	// f32 CPU array, or raw f16 bytes ({f16, n}) converted on the GPU — no JS conversion loop.
	uploadGpu(data: Float32Array | F16Bytes): GPUAny {
		if (data instanceof Float32Array) return this.buf(data, WebGpuEngine.STORAGE_USAGE);
		return this.f16ToF32Gpu(data.f16, data.n);
	}

	// Upload an f32 array to a PERSISTENT buffer as packed f16 (for the f16-weight matmul).
	uploadGpuF16(data: Float32Array): GPUAny {
		const u16 = new Uint16Array(data.length);
		for (let i = 0; i < data.length; i++) u16[i] = f32ToF16(data[i]);
		return this.bufU16(u16);
	}

	// Pack an f32 GPU buffer into a PERSISTENT packed-f16 GPU buffer entirely on the GPU (no CPU
	// f32→f16 loop, no readback — the build stays off the main thread). nElems must be even (true for
	// weight matrices: k % 4 == 0). Caller owns/frees `src`.
	f32ToF16Gpu(src: GPUAny, nElems: number): GPUAny {
		const G = globalThis as any;
		const pairs = Math.ceil(nElems / 2);
		const out = this.device.createBuffer({ size: pairs * 4, usage: WebGpuEngine.STORAGE_USAGE });
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([pairs]));
		this.dispatch('packf16', [p, src, out], this.grid1D(pairs));
		return out;
	}

	// Quantize an f32 GPU buffer to q8web (int8 codes + f16 scales) entirely on the GPU — no CPU
	// quantize loop. nElems must be a multiple of 32. Returns the {codes, sc} buffers the fused q8
	// matmul reads (and the same byte layout packQ8 produces, for serializing to a .brik).
	f32ToQ8Gpu(src: GPUAny, nElems: number): { codes: GPUAny; sc: GPUAny } {
		const G = globalThis as any;
		const nGroups = nElems / 32;
		const codes = this.device.createBuffer({ size: nElems, usage: WebGpuEngine.STORAGE_USAGE });          // nElems int8
		const sc = this.device.createBuffer({ size: Math.ceil(nGroups / 2) * 4, usage: WebGpuEngine.STORAGE_USAGE }); // f16/group, zero-init for atomicOr
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nGroups]));
		this.dispatch('quantize_q8', [p, src, codes, sc], this.grid1D(nGroups));
		return { codes, sc };
	}

	// Quantize an f32 GPU buffer to q4web (int4 nibbles + f16 scale + f16 min) entirely on the GPU.
	// nElems must be a multiple of 32. Returns the {nib, sc, mn} buffers the fused q4 matmul reads.
	f32ToQ4Gpu(src: GPUAny, nElems: number): { nib: GPUAny; sc: GPUAny; mn: GPUAny } {
		const G = globalThis as any;
		const nGroups = nElems / 32;
		const nib = this.device.createBuffer({ size: nElems / 2, usage: WebGpuEngine.STORAGE_USAGE });          // n/2 nibble bytes
		const sc = this.device.createBuffer({ size: Math.ceil(nGroups / 2) * 4, usage: WebGpuEngine.STORAGE_USAGE }); // f16/group, zero-init
		const mn = this.device.createBuffer({ size: Math.ceil(nGroups / 2) * 4, usage: WebGpuEngine.STORAGE_USAGE });
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nGroups]));
		this.dispatch('quantize_q4', [p, src, nib, sc, mn], this.grid1D(nGroups));
		return { nib, sc, mn };
	}

	// Upload raw f16 bytes (e.g. straight from a BRIK shard) to a PERSISTENT buffer, no conversion.
	uploadGpuRawF16(bytes: Uint8Array): GPUAny {
		// writeBuffer needs a 4-byte-multiple length; pad the buffer if necessary.
		const size = Math.ceil(bytes.byteLength / 4) * 4;
		const b = this.device.createBuffer({ size, usage: WebGpuEngine.STORAGE_USAGE });
		this.device.queue.writeBuffer(b, 0, bytes, 0, bytes.byteLength - (bytes.byteLength % 4));
		if (bytes.byteLength % 4) {
			const tail = new Uint8Array(4); tail.set(bytes.subarray(bytes.byteLength - (bytes.byteLength % 4)));
			this.device.queue.writeBuffer(b, bytes.byteLength - (bytes.byteLength % 4), tail);
		}
		return b;
	}

	private bufU16(data: Uint16Array): GPUAny {
		const b = this.device.createBuffer({ size: data.byteLength, usage: WebGpuEngine.STORAGE_USAGE });
		this.device.queue.writeBuffer(b, 0, data);
		return b;
	}

	// Upload arbitrary raw bytes (BRIK q4 nibbles/scales/mins) to a PERSISTENT storage buffer,
	// padded to a 4-byte multiple so it can be read as array<u32> in a shader.
	uploadGpuRaw(bytes: Uint8Array): GPUAny {
		const size = Math.ceil(bytes.byteLength / 4) * 4;
		const b = this.device.createBuffer({ size, usage: WebGpuEngine.STORAGE_USAGE });
		const whole = bytes.byteLength - (bytes.byteLength % 4);
		this.device.queue.writeBuffer(b, 0, bytes, 0, whole);
		if (bytes.byteLength % 4) {
			const tail = new Uint8Array(4); tail.set(bytes.subarray(whole));
			this.device.queue.writeBuffer(b, whole, tail);
		}
		return b;
	}

	// C = A · Wᵀ where W is BRIK int4 (q4web). nib/sc/mn are persistent GPU buffers holding the raw
	// q4 bytes (nibbles, f16 scales, f16 mins). Requires k % 32 == 0. Weights stay 4-bit in VRAM.
	async matmulQ4(a: Float32Array, nib: GPUAny, sc: GPUAny, mn: GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q4', [dims, this.buf(a, ST), nib, sc, mn, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1], out, m * n * 4);
	}

	// Prefill-optimized q4 matmul (matmul_t_q4_tiled): 4 token rows per invocation. Same output as
	// matmulQ4 — used by selfValidate and the decode path's prefill branch.
	async matmulQ4Tiled(a: Float32Array, nib: GPUAny, sc: GPUAny, mn: GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q4_tiled', [dims, this.buf(a, ST), nib, sc, mn, out], [Math.ceil(Math.ceil(m / 4) / 8), Math.ceil(n / 8), 1], out, m * n * 4);
	}

	// Shared-memory tiled q4 matmul (matmul_t_q4_shared): 16×16 output tiles. Used at prefill (m ≥ 16);
	// same output as matmulQ4.
	async matmulQ4Shared(a: Float32Array, nib: GPUAny, sc: GPUAny, mn: GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q4_shared', [dims, this.buf(a, ST), nib, sc, mn, out], [Math.ceil(n / 64), Math.ceil(m / 32), 1], out, m * n * 4);
	}

	// C = A · Wᵀ where W is BRIK int3 (q3web). lo/hi/sc/mn are persistent GPU buffers holding the raw
	// q3 bytes (2-bit plane, 1-bit plane, f16 scales, f16 mins). Requires k % 32 == 0. Weights stay
	// 3-bit in VRAM. One kernel handles any m (row-guarded).
	async matmulQ3(a: Float32Array, lo: GPUAny, hi: GPUAny, sc: GPUAny, mn: GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q3', [dims, this.buf(a, ST), lo, hi, sc, mn, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1], out, m * n * 4);
	}

	// RWKV-7 WKV (moteur v2) — UN pas de récurrence sur l'état S (H·N·N). Uploade S + les 6 vecteurs
	// d'entrée du token, dispatch rwkv_wkv7, relit l'état MIS À JOUR + la sortie y. Utilisé par
	// selfValidate (le chemin résident enregistrera le pass sans readback). Voir docs/engine-v2-*.md.
	async rwkvWkv7(S: Float32Array, r: Float32Array, w: Float32Array, k: Float32Array, v: Float32Array, a: Float32Array, b: Float32Array, H: number, N: number): Promise<{ S: Float32Array; y: Float32Array }> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 8, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([H, N]));
		const sBuf = this.device.createBuffer({ size: S.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		this.device.queue.writeBuffer(sBuf, 0, S);
		const yBuf = this.device.createBuffer({ size: H * N * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		this.dispatch('rwkv_wkv7', [dims, this.buf(r, ST), this.buf(w, ST), this.buf(k, ST), this.buf(v, ST), this.buf(a, ST), this.buf(b, ST), sBuf, yBuf], this.grid1D(H * N));
		const newS = await this.readBack(sBuf, S.byteLength);
		const y = await this.readBack(yBuf, H * N * 4);
		sBuf.destroy?.(); yBuf.destroy?.();
		return { S: newS, y };
	}

	// RWKV-7 token-shift (moteur v2) : ln[D] + prev[D] + lerp[6D] → 6 vecteurs lerpés [6D]
	// (xr,xw,xk,xv,xa,xg). Utilisé par selfValidate ; le chemin résident enregistrera le pass.
	async rwkvTokenShift(ln: Float32Array, prev: Float32Array, lerp: Float32Array, D: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([D]));
		const out = this.device.createBuffer({ size: 6 * D * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		this.dispatch('rwkv_token_shift', [dims, this.buf(ln, ST), this.buf(prev, ST), this.buf(lerp, ST), out], this.grid1D(D * 6));
		const r = await this.readBack(out, 6 * D * 4);
		out.destroy?.();
		return r;
	}

	// LFM2 shortconv (moteur v2) : bcx[3D] (=in_proj·h) + état[(LC-1)·D] + conv w[D·LC] → sortie
	// gatée [D] et état décalé. Un token (décodage). Utilisé par selfValidate et le chemin glu du
	// POC Lfm2Model ; le chemin résident enregistrera le pass sans readback.
	async lfm2ShortConv(bcx: Float32Array, state: Float32Array, w: Float32Array, D: number, LC: number): Promise<{ out: Float32Array; state: Float32Array }> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([D, LC]));
		const stBuf = this.buf(state, ST | G.GPUBufferUsage.COPY_SRC);
		const out = this.device.createBuffer({ size: D * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		this.dispatch('lfm2_shortconv', [dims, this.buf(bcx, ST), this.buf(w, ST), stBuf, out], this.grid1D(D));
		const o = await this.readBack(out, D * 4);
		const s = await this.readBack(stBuf, (LC - 1) * D * 4);
		out.destroy?.(); stBuf.destroy?.();
		return { out: o, state: s };
	}

	// C = A · Wᵀ where W is BRIK int8 (q8web). codes/sc are persistent GPU buffers holding the raw q8
	// bytes (signed int8 codes, f16 scales). Requires k % 32 == 0. Weights stay 8-bit in VRAM.
	async matmulQ8(a: Float32Array, codes: GPUAny, sc: GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q8', [dims, this.buf(a, ST), codes, sc, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1], out, m * n * 4);
	}

	// Prefill-optimized q8 matmul (matmul_t_q8_tiled): each invocation does 4 token rows. Same output
	// as matmulQ8 — used by selfValidate and the decode path's prefill branch.
	async matmulQ8Tiled(a: Float32Array, codes: GPUAny, sc: GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q8_tiled', [dims, this.buf(a, ST), codes, sc, out], [Math.ceil(Math.ceil(m / 4) / 8), Math.ceil(n / 8), 1], out, m * n * 4);
	}

	// Shared-memory tiled q8 matmul (matmul_t_q8_shared): 16×16 output tiles. Used at prefill (m ≥ 16);
	// same output as matmulQ8. Grid is (cols/16, rows/16) — the kernel reads workgroup_id directly.
	async matmulQ8Shared(a: Float32Array, codes: GPUAny, sc: GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q8_shared', [dims, this.buf(a, ST), codes, sc, out], [Math.ceil(n / 64), Math.ceil(m / 32), 1], out, m * n * 4);
	}

	// A small uniform buffer holding the given u32 values, then optional f32 tail value(s) written
	// consecutively from `offset` (one or several — e.g. attention's scale + softcap).
	// Uniform buffers are POOLED by size (release() returns them instead of destroying): the decode
	// loop and the resident diffusion path record dozens of ops per submit, and a createBuffer per
	// op-uniform per token/block was pure allocator churn. writeBuffer is queue-ordered, so reusing
	// a returned uniform for the next submit is safe.
	private uniformPool = new Map<number, GPUAny[]>();
	private uniformSize = new WeakMap<object, number>();
	private uniformOf(size: number): GPUAny {
		const G = globalThis as any;
		const free = this.uniformPool.get(size);
		if (free && free.length) { const b = free.pop(); this.pooled.delete(b); return b; }
		const b = this.device.createBuffer({ size, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.uniformSize.set(b, size);
		return b;
	}
	private uniform(u32: number[], floatTail?: { offset: number; value: number | number[] }): GPUAny {
		const b = this.uniformOf(32);
		this.device.queue.writeBuffer(b, 0, new Uint32Array(u32));
		if (floatTail) {
			const vals = Array.isArray(floatTail.value) ? floatTail.value : [floatTail.value];
			this.device.queue.writeBuffer(b, floatTail.offset, new Float32Array(vals));
		}
		return b;
	}

	// Uniform des 4 kernels d'attention CAUSALE (struct AP) : 6 u32, 2 f32 (scale, softcap), puis
	// `window` en u32 — 36 o arrondis à 48 par la règle d'alignement WGSL des structs uniformes.
	private attnUniform(nTokens: number, nHeads: number, nKvHeads: number, headDim: number, kvLen: number, pastLen: number, scale: number, softcap: number, window: number): GPUAny {
		const b = this.uniformOf(48);
		this.device.queue.writeBuffer(b, 0, new Uint32Array([nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen]));
		this.device.queue.writeBuffer(b, 24, new Float32Array([scale, softcap]));
		this.device.queue.writeBuffer(b, 32, new Uint32Array([window]));
		return b;
	}

	// Recording variants of each kernel: allocate the output (and any uniform), record the pass
	// into `enc`, push transient buffers onto `trash` for post-submit cleanup, return the output
	// buffer. They mirror the public (readback) kernels' parameter packing exactly.
	private recMatmulT(enc: GPUAny, trash: GPUAny[], a: GPUAny, w: GPUAny, m: number, k: number, n: number, wF16 = false): GPUAny {
		const dims = this.uniform([m, k, n]);
		const out = this.storage(m * n * 4);
		const plan = this.matmulTPlan(m, k, n, wF16);
		this.recordPass(enc, plan.shader, [dims, a, w, out], plan.grid);
		trash.push(dims, out);
		return out;
	}

	// ── Recorded (GPU-resident, no readback) diffusion ops — the foundation of the fast UNet path.
	//    Each records ONE pass into `enc`, returns its output buffer (kept on the GPU), and pushes
	//    scratch onto `trash`. Chaining these in one encoder turns a UNet forward's ~hundreds of
	//    submit+readback round-trips into a single submit. See docs/image-gen-feasibility.md (chemin B).
	// Tiled 3×3 conv health (set by validateDiffusion): false → recConv2dDirect always uses the
	// per-element kernel. Never blocks anything — pure perf downgrade on failure.
	convTiledOk = true;
	private recConv2dDirect(enc: GPUAny, trash: GPUAny[], inp: GPUAny, w: GPUAny, bias: GPUAny, Cin: number, H: number, W: number, Cout: number, kh: number, kw: number, stride: number, pad: number): GPUAny {
		const OH = Math.floor((H + 2 * pad - kh) / stride) + 1, OW = Math.floor((W + 2 * pad - kw) / stride) + 1;
		const n = Cout * OH * OW;
		const p = this.uniformOf(48);
		this.device.queue.writeBuffer(p, 0, new Uint32Array([Cin, H, W, Cout, kh, kw, stride, pad, OH, OW]));
		// The dominant image-decode shape (3×3 stride 1 pad 1) takes the tiled kernel: each input
		// pixel read once per workgroup (not 9×), each weight once (not 256×). z-dim = Cout ≤ 65535 ✓.
		if (kh === 3 && kw === 3 && stride === 1 && pad === 1 && this.convTiledOk) {
			const out = this.storage(n * 4);
			this.recordPass(enc, 'conv2d_3x3_tiled', [p, inp, w, bias, out], [Math.ceil(OW / 16), Math.ceil(OH / 16), Cout]);
			trash.push(p, out);
			return out;
		}
		const out = this.storage(n * 4);
		this.recordPass(enc, 'conv2d_direct', [p, inp, w, bias, out], this.grid1D(n));
		trash.push(p, out);
		return out;
	}
	// conv2d_direct with a q8web weight (a {codes,sc} pair, e.g. from quantizeQ8Gpu) — fused dequant,
	// weights stay int8 in VRAM. Mirrors recConv2dDirect's parameter packing.
	private recConv2dDirectQ8(enc: GPUAny, trash: GPUAny[], inp: GPUAny, q8: GPUAny, bias: GPUAny, Cin: number, H: number, W: number, Cout: number, kh: number, kw: number, stride: number, pad: number): GPUAny {
		const OH = Math.floor((H + 2 * pad - kh) / stride) + 1, OW = Math.floor((W + 2 * pad - kw) / stride) + 1;
		const n = Cout * OH * OW;
		const p = this.uniformOf(48);
		this.device.queue.writeBuffer(p, 0, new Uint32Array([Cin, H, W, Cout, kh, kw, stride, pad, OH, OW]));
		const out = this.storage(n * 4);
		this.recordPass(enc, 'conv2d_direct_q8', [p, inp, q8.codes, q8.sc, bias, out], this.grid1D(n));
		trash.push(p, out);
		return out;
	}
	// conv2d_direct avec un poids q4web ({nib, sc, mn}) — déquant fusionnée, poids int4 résidents.
	// Sert le tier « light » des BRIK image. Même packing de paramètres que la variante q8.
	private recConv2dDirectQ4(enc: GPUAny, trash: GPUAny[], inp: GPUAny, q4: GPUAny, bias: GPUAny, Cin: number, H: number, W: number, Cout: number, kh: number, kw: number, stride: number, pad: number): GPUAny {
		const OH = Math.floor((H + 2 * pad - kh) / stride) + 1, OW = Math.floor((W + 2 * pad - kw) / stride) + 1;
		const n = Cout * OH * OW;
		const p = this.uniformOf(48);
		this.device.queue.writeBuffer(p, 0, new Uint32Array([Cin, H, W, Cout, kh, kw, stride, pad, OH, OW]));
		const out = this.storage(n * 4);
		this.recordPass(enc, 'conv2d_direct_q4', [p, inp, q4.nib, q4.sc, q4.mn, bias, out], this.grid1D(n));
		trash.push(p, out);
		return out;
	}
	private recGroupNorm(enc: GPUAny, trash: GPUAny[], x: GPUAny, gamma: GPUAny, beta: GPUAny, C: number, HW: number, groups: number, eps: number): GPUAny {
		const p = this.uniform([C, HW, groups], { offset: 12, value: eps });
		const out = this.storage(C * HW * 4);
		this.recordPass(enc, 'group_norm', [p, x, gamma, beta, out], [groups, 1, 1]);
		trash.push(p, out);
		return out;
	}
	private recUnary(enc: GPUAny, trash: GPUAny[], name: string, x: GPUAny, len: number): GPUAny {
		const out = this.storage(len * 4);
		this.recordPass(enc, name, [x, out], this.grid1D(len));
		trash.push(out);
		return out;
	}
	private recLayernorm(enc: GPUAny, trash: GPUAny[], x: GPUAny, gamma: GPUAny, beta: GPUAny, rows: number, dim: number, eps: number): GPUAny {
		const p = this.uniform([rows, dim], { offset: 8, value: eps });
		const out = this.storage(rows * dim * 4);
		this.recordPass(enc, 'layernorm', [p, x, gamma, beta, out], [Math.ceil(rows / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	private recAttentionFull(enc: GPUAny, trash: GPUAny[], q: GPUAny, k: GPUAny, v: GPUAny, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, kvLen: number, scale?: number): GPUAny {
		const p = this.uniform([nTokens, nHeads, nKvHeads, headDim, kvLen, 0], { offset: 24, value: [scale ?? 1 / Math.sqrt(headDim), 0] });
		const out = this.storage(nTokens * nHeads * headDim * 4);
		// Kernel workgroup-par-tête (softmax en ligne, une passe sur K) quand il est sain et que la
		// forme rentre : headDim ≤ 192 (3 scalaires/lane) et nTokens·nHeads ≤ 65535 (une dimension de
		// grille, un workgroup par (token, tête) — 512px SD-Turbo culmine à 20480). Repli sinon.
		const n = nTokens * nHeads;
		if (this.attnFullWgOk && headDim <= 192 && n <= 65535) {
			this.recordPass(enc, 'attention_full_wg', [p, q, k, v, out], [n, 1, 1]);
		} else {
			this.recordPass(enc, 'attention_full', [p, q, k, v, out], [Math.ceil(n / WG), 1, 1]);
		}
		trash.push(p, out);
		return out;
	}
	private recUpsample(enc: GPUAny, trash: GPUAny[], x: GPUAny, C: number, H: number, W: number, scale: number): GPUAny {
		const p = this.uniform([C, H, W, scale]);
		const n = C * (H * scale) * (W * scale);
		const out = this.storage(n * 4);
		this.recordPass(enc, 'upsample_nearest', [p, x, out], this.grid1D(n));
		trash.push(p, out);
		return out;
	}
	private recConcat(enc: GPUAny, trash: GPUAny[], a: GPUAny, b: GPUAny, Ca: number, Cb: number, HW: number): GPUAny {
		const out = this.storage((Ca + Cb) * HW * 4);
		enc.copyBufferToBuffer(a, 0, out, 0, Ca * HW * 4);
		enc.copyBufferToBuffer(b, 0, out, Ca * HW * 4, Cb * HW * 4);
		trash.push(out);
		return out;
	}
	private recAddChannelBias(enc: GPUAny, trash: GPUAny[], x: GPUAny, bias: GPUAny, C: number, HW: number): GPUAny {
		const p = this.uniform([C, HW]);
		const out = this.storage(C * HW * 4);
		this.recordPass(enc, 'add_channel_bias', [p, x, bias, out], this.grid1D(C * HW));
		trash.push(p, out);
		return out;
	}
	private recTranspose(enc: GPUAny, trash: GPUAny[], x: GPUAny, rows: number, cols: number): GPUAny {
		const p = this.uniform([rows, cols]);
		const out = this.storage(rows * cols * 4);
		this.recordPass(enc, 'transpose2d', [p, x, out], this.grid1D(rows * cols));
		trash.push(p, out);
		return out;
	}
	private recGegluSplit(enc: GPUAny, trash: GPUAny[], proj: GPUAny, rows: number, F: number): GPUAny {
		const p = this.uniform([rows, F]);
		const out = this.storage(rows * F * 4);
		this.recordPass(enc, 'geglu_split', [p, proj, out], this.grid1D(rows * F));
		trash.push(p, out);
		return out;
	}
	// ── VIDÉO motion résident : reshapes (F,C,S)↔(S·F,C), PE temporel, attention temporelle. ──
	private recVideoGather(enc: GPUAny, trash: GPUAny[], inp: GPUAny, F: number, C: number, S: number): GPUAny {
		const p = this.uniform([F, C, S]);
		const out = this.storage(S * F * C * 4);
		this.recordPass(enc, 'video_motion_gather', [p, inp, out], this.grid1D(S * F * C));
		trash.push(p, out);
		return out;
	}
	private recVideoScatter(enc: GPUAny, trash: GPUAny[], h: GPUAny, res: GPUAny, F: number, C: number, S: number): GPUAny {
		const p = this.uniform([F, C, S]);
		const out = this.storage(F * C * S * 4);
		this.recordPass(enc, 'video_motion_scatter', [p, h, res, out], this.grid1D(F * C * S));
		trash.push(p, out);
		return out;
	}
	private recVideoAddPe(enc: GPUAny, trash: GPUAny[], x: GPUAny, pe: GPUAny, F: number, C: number, S: number): GPUAny {
		const p = this.uniform([F, C, S]);
		const out = this.storage(S * F * C * 4);
		this.recordPass(enc, 'video_add_pe', [p, x, pe, out], this.grid1D(S * F * C));
		trash.push(p, out);
		return out;
	}
	private recAttnTemporal(enc: GPUAny, trash: GPUAny[], q: GPUAny, k: GPUAny, v: GPUAny, S: number, F: number, heads: number, hd: number): GPUAny {
		const p = this.uniform([S, F, heads, hd], { offset: 16, value: 1 / Math.sqrt(hd) });
		const out = this.storage(S * F * heads * hd * 4);
		this.recordPass(enc, 'attn_temporal', [p, q, k, v, out], this.grid1D(S * F * heads));
		trash.push(p, out);
		return out;
	}

	// Public recording session: a fluent set of ops that record into ONE command encoder (no per-op
	// readback), plus finish() which submits once and reads back a chosen output. Lets a whole UNet
	// block run as a single GPU submit instead of one-submit-per-op. Float32Array inputs (weights/
	// activations from CPU) are uploaded to GPU buffers on the fly; everything is freed after finish().
	recordingSession() {
		const enc = this.device.createCommandEncoder();
		const trash: GPUAny[] = [];
		const up = (x: GPUAny): GPUAny => { if (x instanceof Float32Array) { const b = this.uploadGpu(x); trash.push(b); return b; } return x; };
		return {
			// conv2d / matmulT accept an f32 weight (Float32Array or GPU buffer), a q8web {codes,sc}
			// pair, OR a q4web {nib,sc,mn} triple — the fused-dequant kernel is picked automatically.
			conv2d: (inp: GPUAny, w: GPUAny, bias: GPUAny, Cin: number, H: number, W: number, Cout: number, kh: number, kw: number, st: number, pd: number) =>
				(w && w.nib)
					? this.recConv2dDirectQ4(enc, trash, up(inp), w, up(bias), Cin, H, W, Cout, kh, kw, st, pd)
					: (w && w.codes)
						? this.recConv2dDirectQ8(enc, trash, up(inp), w, up(bias), Cin, H, W, Cout, kh, kw, st, pd)
						: this.recConv2dDirect(enc, trash, up(inp), up(w), up(bias), Cin, H, W, Cout, kh, kw, st, pd),
			groupNorm: (x: GPUAny, g: GPUAny, b: GPUAny, C: number, HW: number, groups: number, eps: number) => this.recGroupNorm(enc, trash, up(x), up(g), up(b), C, HW, groups, eps),
			silu: (x: GPUAny, len: number) => this.recUnary(enc, trash, 'silu', up(x), len),
			quickGelu: (x: GPUAny, len: number) => this.recUnary(enc, trash, 'quick_gelu', up(x), len),
			gelu: (x: GPUAny, len: number) => this.recUnary(enc, trash, 'gelu', up(x), len),
			relu: (x: GPUAny, len: number) => this.recUnary(enc, trash, 'relu', up(x), len),
			add: (a: GPUAny, b: GPUAny, len: number) => this.recBinary(enc, trash, 'add', up(a), up(b), len),
			geglu: (gate: GPUAny, hidden: GPUAny, len: number) => this.recBinary(enc, trash, 'geglu', up(gate), up(hidden), len),
			matmulT: (a: GPUAny, w: GPUAny, m: number, k: number, n: number) => this.recMM(enc, trash, up(a), (w instanceof Float32Array) ? up(w) : w, m, k, n, false),
			addBias: (x: GPUAny, bias: GPUAny, rows: number, cols: number) => this.recAddBias(enc, trash, up(x), up(bias), rows, cols),
			addChannelBias: (x: GPUAny, bias: GPUAny, C: number, HW: number) => this.recAddChannelBias(enc, trash, up(x), up(bias), C, HW),
			attentionFull: (q: GPUAny, k: GPUAny, v: GPUAny, nT: number, nH: number, nKv: number, hd: number, kvLen: number) => this.recAttentionFull(enc, trash, up(q), up(k), up(v), nT, nH, nKv, hd, kvLen),
			// RoPE 2D du ViT (positions (h,w) par patch — Uint32Array plate [h0,w0,h1,w1,…] ou buffer GPU).
			rope2d: (x: GPUAny, pos: GPUAny, rows: number, hd: number, nH: number, base: number) => {
				const posBuf = pos instanceof Uint32Array ? (() => { const b = this.uploadGpuRaw(new Uint8Array(pos.buffer, pos.byteOffset, pos.byteLength)); trash.push(b); return b; })() : pos;
				return this.recRope2d(enc, trash, up(x), posBuf, rows, hd, nH, base);
			},
			// CAUSAL attention (mask j ≤ pastLen+t) — CLIP's text encoder recorded in-session.
			attention: (q: GPUAny, k: GPUAny, v: GPUAny, nT: number, nH: number, nKv: number, hd: number, kvLen: number, pastLen: number) => this.recAttention(enc, trash, up(q), up(k), up(v), nT, nH, nKv, hd, kvLen, pastLen),
			upsample: (x: GPUAny, C: number, H: number, W: number, s: number) => this.recUpsample(enc, trash, up(x), C, H, W, s),
			layernorm: (x: GPUAny, g: GPUAny, b: GPUAny, rows: number, dim: number, eps: number) => this.recLayernorm(enc, trash, up(x), up(g), up(b), rows, dim, eps),
			concat: (a: GPUAny, b: GPUAny, Ca: number, Cb: number, HW: number) => this.recConcat(enc, trash, up(a), up(b), Ca, Cb, HW),
			transpose: (x: GPUAny, rows: number, cols: number) => this.recTranspose(enc, trash, up(x), rows, cols),
			gegluSplit: (proj: GPUAny, rows: number, F: number) => this.recGegluSplit(enc, trash, up(proj), rows, F),
			// VIDÉO motion résident (voir shaders video_*). gather/scatter/addPe/attnTemporal.
			videoGather: (inp: GPUAny, F: number, C: number, S: number) => this.recVideoGather(enc, trash, up(inp), F, C, S),
			videoScatter: (h: GPUAny, res: GPUAny, F: number, C: number, S: number) => this.recVideoScatter(enc, trash, up(h), up(res), F, C, S),
			videoAddPe: (x: GPUAny, pe: GPUAny, F: number, C: number, S: number) => this.recVideoAddPe(enc, trash, up(x), up(pe), F, C, S),
			attnTemporal: (q: GPUAny, k: GPUAny, v: GPUAny, S: number, F: number, heads: number, hd: number) => this.recAttnTemporal(enc, trash, up(q), up(k), up(v), S, F, heads, hd),
			// Buffer scratch alloué dans la session (poolé, libéré à finish sauf s'il est gardé).
			alloc: (bytes: number): GPUAny => { const b = this.storage(bytes); trash.push(b); return b; },
			// Copie GPU→GPU (concat/split des F frames) : dst[dstOff..] ← src[srcOff..], en octets.
			copy: (dst: GPUAny, dstOffBytes: number, src: GPUAny, srcOffBytes: number, bytes: number): void => {
				enc.copyBufferToBuffer(src, srcOffBytes, dst, dstOffBytes, bytes);
			},
			finish: async (outBuf: GPUAny, outLen: number): Promise<Float32Array> => {
				this.device.queue.submit([enc.finish()]);
				const out = await this.readBack(outBuf, outLen * 4);
				this.release(trash);
				return out;
			},
			// Submit WITHOUT reading back: ownership of `outBuf` transfers to the caller (it is pulled
			// out of the trash), everything else is released. The GPU-resident chaining primitive —
			// the returned buffer feeds the next session as an input, and the caller must eventually
			// releaseGpu() it (or read it with readGpu()). Queue ordering makes the pool reuse safe.
			finishKeep: (outBuf: GPUAny): GPUAny => {
				this.device.queue.submit([enc.finish()]);
				const i = trash.indexOf(outBuf);
				if (i >= 0) trash.splice(i, 1);
				this.release(trash);
				return outBuf;
			},
			// Comme finishKeep mais garde PLUSIEURS buffers (les F frames de sortie du module motion) —
			// tous retirés du trash avant libération du reste ; le caller les possède (releaseGpu ensuite).
			finishKeepMany: (bufs: GPUAny[]): GPUAny[] => {
				this.device.queue.submit([enc.finish()]);
				for (const b of bufs) { const i = trash.indexOf(b); if (i >= 0) trash.splice(i, 1); }
				this.release(trash);
				return bufs;
			},
		};
	}

	// Read a GPU f32 buffer back to the CPU (public readback for GPU-resident pipelines).
	readGpu(buf: GPUAny, nElems: number): Promise<Float32Array> { return this.readBack(buf, nElems * 4); }
	// Shrink the scratch pool down to ~keepBytes (largest buffers dropped first). The pool grows to
	// the biggest forward ever run (e.g. a 512² generation leaves hundreds of MB of scratch resident
	// forever) — call this after a heavy one-shot workload to give the memory back.
	trimPool(keepBytes = 64 << 20): void {
		const sizes = [...this.bufferPool.keys()].sort((a, b) => b - a); // biggest first
		let kept = 0;
		for (const list of this.bufferPool.values()) for (const b of list) kept += this.poolSize.get(b) ?? 0;
		for (const size of sizes) {
			const list = this.bufferPool.get(size)!;
			while (list.length && kept > keepBytes) {
				const b = list.pop();
				this.pooled.delete(b);
				this.poolSize.delete(b);
				b.destroy?.();
				kept -= size;
			}
		}
	}
	// Return kept buffers (from finishKeep) to the pool / destroy them.
	releaseGpu(bufs: GPUAny[]): void { this.release(bufs); }
	// Drain the GPU queue (thermal pacing / backpressure between resident blocks).
	waitGpu(): Promise<void> { return this.device.queue.onSubmittedWorkDone(); }
	// Banc d'UN GEMM, KERNEL ISOLÉ : activations déjà résidentes, `iters` passes enchaînées dans UN
	// SEUL encodeur, une seule attente de file — ni upload ni readback par tir. C'est le régime exact
	// du prefill résident, et c'est la seule mesure stable : chronométrer matmulT() facturait à chaque
	// tir un upload de A (plusieurs Mo) et un readback, de quoi INVERSER l'A/B. `w` est soit un buffer
	// f16 (avec wF16), soit un triple q4 {nib,sc,mn} / une paire q8 {codes,sc} — recMM dispatche comme
	// en production. `shared` choisit le chemin (tuilé ou repli) sans laisser le gate modifié.
	// Banc uniquement (hooks dev __gemmBench / __qgemmBench).
	async benchMatmul(a: Float32Array, w: GPUAny, m: number, k: number, n: number, opts: { iters?: number; shared?: boolean; wF16?: boolean } = {}): Promise<number> {
		const { iters = 10, shared = true, wF16 = false } = opts;
		const prevF16 = this.f16SharedOk, prevQ = this.qSharedOk;
		this.f16SharedOk = shared; this.qSharedOk = shared;
		const aBuf = this.uploadGpu(a);
		const trash: GPUAny[] = [];
		const warm = this.device.createCommandEncoder();
		this.recMM(warm, trash, aBuf, w, m, k, n, wF16); // compile le pipeline
		this.device.queue.submit([warm.finish()]);
		await this.device.queue.onSubmittedWorkDone();
		const enc = this.device.createCommandEncoder();
		for (let i = 0; i < iters; i++) this.recMM(enc, trash, aBuf, w, m, k, n, wF16);
		const t0 = performance.now();
		this.device.queue.submit([enc.finish()]);
		await this.device.queue.onSubmittedWorkDone();
		const ms = (performance.now() - t0) / iters;
		this.release(trash);
		aBuf.destroy?.();
		this.f16SharedOk = prevF16; this.qSharedOk = prevQ;
		return ms;
	}
	// Full teardown: destroys the GPUDevice, which invalidates EVERY buffer/pipeline of this engine
	// at once (the image pipeline holds ~1 GB of resident weights — dropping JS references alone
	// leaves that VRAM to the GC's mercy). The engine is unusable afterwards.
	destroy(): void {
		// Avant le device : les jeux de requêtes et leurs buffers lui appartiennent.
		try { this.profiler?.destroy(); } catch { /* déjà libéré */ }
		this.profiler = null;
		try { this.device?.destroy?.(); } catch { /* already lost */ }
		this.bufferPool.clear();
		this.uniformPool.clear();
	}
	// Raw IEEE-f16 bytes → persistent f32 GPU buffer, converted ON the GPU (f16_to_f32 kernel).
	// The f16 staging is transient. No 4-byte f32 copy ever exists in JS.
	f16ToF32Gpu(bytes: Uint8Array, nElems: number): GPUAny {
		const staging = this.uploadGpuRawF16(bytes);
		const out = this.device.createBuffer({ size: nElems * 4, usage: WebGpuEngine.STORAGE_USAGE });
		const p = this.uniformOf(16);
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nElems]));
		this.dispatch('f16_to_f32', [p, staging, out], this.grid1D(Math.ceil(nElems / 2)));
		staging.destroy?.();
		this.release([p]);
		return out;
	}
	// Quantize a weight to a GPU-resident q8web {codes,sc} pair (GPU quantize kernel; staging is
	// transient). Accepts an f32 CPU array OR raw f16 bytes ({f16, n} — converted on the GPU, no JS
	// loop). Falls back to a plain f32 buffer when n % 32 ≠ 0.
	quantizeQ8Gpu(data: Float32Array | F16Bytes): GPUAny {
		const n = data instanceof Float32Array ? data.length : data.n;
		if (n % 32 !== 0) return this.uploadGpu(data);
		const staging = data instanceof Float32Array ? this.buf(data, WebGpuEngine.STORAGE_USAGE) : this.f16ToF32Gpu(data.f16, n);
		const q8 = this.f32ToQ8Gpu(staging, n);
		staging.destroy?.();
		return q8;
	}

	// Self-test the GPU-resident foundation: a recorded conv→group_norm→silu chain (ONE submit, ONE
	// readback) must equal the per-op readback path. Returns null on success or the failing stage.
	async validateResidentOps(): Promise<string | null> {
		const G = globalThis as any;
		const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1) * 0.5);
		const closeRel = (x: Float32Array, y: Float32Array, tol = 5e-3) => x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) <= tol * (1 + Math.abs(y[i])));
		const Cin = 4, H = 4, W = 4, Cout = 4, groups = 2, eps = 1e-5, n = Cout * H * W;
		const x = rand(Cin * H * W), w = rand(Cout * Cin * 9), bias = rand(Cout), g = rand(Cout), b = rand(Cout);
		// per-op reference (readback between each)
		const ref = await this.silu(await this.groupNorm(await this.conv2dDirect(x, w, bias, Cin, H, W, Cout, 3, 3, 1, 1), g, b, Cout, H * W, groups, eps));
		// recorded: one encoder, one submit, one readback
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		const xb = this.uploadGpu(x), wb = this.uploadGpu(w), biasb = this.uploadGpu(bias), gb = this.uploadGpu(g), bb = this.uploadGpu(b);
		trash.push(xb, wb, biasb, gb, bb);
		let h = this.recConv2dDirect(enc, trash, xb, wb, biasb, Cin, H, W, Cout, 3, 3, 1, 1);
		h = this.recGroupNorm(enc, trash, h, gb, bb, Cout, H * W, groups, eps);
		h = this.recUnary(enc, trash, 'silu', h, n);
		const read = this.device.createBuffer({ size: n * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(h, 0, read, 0, n * 4);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const got = new Float32Array(read.getMappedRange().slice(0));
		read.unmap(); read.destroy();
		this.release(trash);
		return closeRel(got, ref) ? null : 'resident_ops';
	}
	// Fused int4 matmul recorded into the encoder (weight is a {nib,sc,mn} q4web triple).
	private recMatmulQ4(enc: GPUAny, trash: GPUAny[], a: GPUAny, q4: GPUAny, m: number, k: number, n: number): GPUAny {
		const dims = this.uniform([m, k, n]);
		const out = this.storage(m * n * 4);
		// Prefill : m ≥ 32 → GEMM tuilé 32×64 bloqué en registres (chaque poids déquantifié une fois
		// pour 32 lignes) ; 2 ≤ m < 32 → kernel 4 lignes par invocation ; décodage (m==1) → 1 ligne.
		if (m === 1 && this.gemvOk) {
			// Décodage : un workgroup de 64 threads PAR ligne de sortie (cf. matmul_t_q4_vec).
			const g = this.gemvGrid(n);
			this.recordPass(enc, 'matmul_t_q4_vec', [this.uniform([m, k, n, g.stride]), a, q4.nib, q4.sc, q4.mn, out], g.grid);
		} else if (m >= 32 && this.qSharedOk) {
			this.recordPass(enc, 'matmul_t_q4_shared', [dims, a, q4.nib, q4.sc, q4.mn, out], [Math.ceil(n / 64), Math.ceil(m / 32), 1]);
		} else if (m >= 2) {
			this.recordPass(enc, 'matmul_t_q4_tiled', [dims, a, q4.nib, q4.sc, q4.mn, out], [Math.ceil(Math.ceil(m / 4) / 8), Math.ceil(n / 8), 1]);
		} else {
			this.recordPass(enc, 'matmul_t_q4', [dims, a, q4.nib, q4.sc, q4.mn, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1]);
		}
		trash.push(dims, out);
		return out;
	}
	// Fused int8 matmul recorded into the encoder (weight is a {codes,sc} q8web pair).
	private recMatmulQ8(enc: GPUAny, trash: GPUAny[], a: GPUAny, q8: GPUAny, m: number, k: number, n: number): GPUAny {
		const dims = this.uniform([m, k, n]);
		const out = this.storage(m * n * 4);
		// Prefill : m ≥ 32 → GEMM tuilé 32×64 bloqué en registres (chaque poids déquantifié une fois
		// pour 32 lignes) ; 2 ≤ m < 32 → kernel 4 lignes par invocation ; décodage (m==1) → 1 ligne.
		if (m === 1 && this.gemvOk) {
			const g = this.gemvGrid(n);
			this.recordPass(enc, 'matmul_t_q8_vec', [this.uniform([m, k, n, g.stride]), a, q8.codes, q8.sc, out], g.grid);
		} else if (m >= 32 && this.qSharedOk) {
			this.recordPass(enc, 'matmul_t_q8_shared', [dims, a, q8.codes, q8.sc, out], [Math.ceil(n / 64), Math.ceil(m / 32), 1]);
		} else if (m >= 2) {
			this.recordPass(enc, 'matmul_t_q8_tiled', [dims, a, q8.codes, q8.sc, out], [Math.ceil(Math.ceil(m / 4) / 8), Math.ceil(n / 8), 1]);
		} else {
			this.recordPass(enc, 'matmul_t_q8', [dims, a, q8.codes, q8.sc, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1]);
		}
		trash.push(dims, out);
		return out;
	}
	// Grid du GEMV : une ligne de sortie par workgroup, réparti sur DEUX dimensions car `n` atteint
	// 152 064 sur une tête logits — au-delà de maxComputeWorkgroupsPerDimension (65 535). `stride` est
	// passé au shader pour reconstruire la colonne (col = wid.y * stride + wid.x).
	private gemvGrid(n: number): { grid: [number, number, number]; stride: number } {
		const stride = 32768;
		return n <= stride
			? { grid: [n, 1, 1], stride }
			: { grid: [stride, Math.ceil(n / stride), 1], stride };
	}

	// GEMV q4/q8 avec readback — pour selfValidate (le chemin chaud passe par recMatmulQ4/Q8).
	async matmulQ4Vec(a: Float32Array, nib: GPUAny, sc: GPUAny, mn: GPUAny, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const g = this.gemvGrid(n);
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([1, k, n, g.stride]));
		const out = this.device.createBuffer({ size: n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q4_vec', [dims, this.buf(a, ST), nib, sc, mn, out], g.grid, out, n * 4);
	}
	async matmulQ8Vec(a: Float32Array, codes: GPUAny, sc: GPUAny, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const g = this.gemvGrid(n);
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([1, k, n, g.stride]));
		const out = this.device.createBuffer({ size: n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul_t_q8_vec', [dims, this.buf(a, ST), codes, sc, out], g.grid, out, n * 4);
	}

	// Fused int3 matmul recorded into the encoder (weight is a {lo,hi,sc,mn} q3web quad). One kernel
	// for all m (row-guarded) — no tiled/shared variant yet; decode is already bandwidth-bound.
	private recMatmulQ3(enc: GPUAny, trash: GPUAny[], a: GPUAny, q3: GPUAny, m: number, k: number, n: number): GPUAny {
		const dims = this.uniform([m, k, n]);
		const out = this.storage(m * n * 4);
		this.recordPass(enc, 'matmul_t_q3', [dims, a, q3.lo, q3.hi, q3.sc, q3.mn, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1]);
		trash.push(dims, out);
		return out;
	}
	// Dispatch the right matmul for a weight: q3 quad → fused int3; q4 triple → fused int4; q8 pair →
	// fused int8; else f32/f16 buffer. The weight's shape (q3 flag / nib / codes / plain) selects the kernel.
	private recMM(enc: GPUAny, trash: GPUAny[], a: GPUAny, w: GPUAny, m: number, k: number, n: number, wF16: boolean): GPUAny {
		if (w && w.q3) return this.recMatmulQ3(enc, trash, a, w, m, k, n);
		if (w && w.nib) return this.recMatmulQ4(enc, trash, a, w, m, k, n);
		if (w && w.codes) return this.recMatmulQ8(enc, trash, a, w, m, k, n);
		return this.recMatmulT(enc, trash, a, w, m, k, n, wF16);
	}
	private recRmsnorm(enc: GPUAny, trash: GPUAny[], x: GPUAny, w: GPUAny, rows: number, dim: number, eps: number, onePlus = false): GPUAny {
		// u32[2]=onePlus placeholder at offset 8 is overwritten by the eps float tail; onePlus sits at 12.
		const p = this.uniform([rows, dim, 0, onePlus ? 1 : 0], { offset: 8, value: eps });
		const out = this.storage(rows * dim * 4);
		this.recordPass(enc, 'rmsnorm', [p, x, w, out], [Math.ceil(rows / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	// `interleaved` : convention d'appariement des dimensions (0 = rotate_half/HF, 1 = adjacentes/ggml
	// NORM pour les archs llama/mistral/smollm3). Écrit à l'offset 20, juste après le `base` f32.
	private recRope(enc: GPUAny, trash: GPUAny[], x: GPUAny, rows: number, headDim: number, nHeads: number, pastLen: number, base: number, interleaved = false): GPUAny {
		const p = this.uniform([rows, headDim, nHeads, pastLen], { offset: 16, value: base });
		this.device.queue.writeBuffer(p, 20, new Uint32Array([interleaved ? 1 : 0]));
		const out = this.storage(rows * headDim * 4);
		this.recordPass(enc, 'rope', [p, x, out], [Math.ceil(rows / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	// M-RoPE (LLM Qwen2-VL) : `pos` = buffer GPU de triplets u32 (t, h, w) par token, `sections` =
	// tailles [t, h, w] → bornes cumulées c0/c1 dans l'uniform.
	private recRopeMrope(enc: GPUAny, trash: GPUAny[], x: GPUAny, pos: GPUAny, rows: number, headDim: number, nHeads: number, base: number, sections: number[]): GPUAny {
		const c0 = sections[0], c1 = sections[0] + sections[1];
		const p = this.uniform([rows, headDim, nHeads, c0, c1], { offset: 20, value: base });
		const out = this.storage(rows * headDim * 4);
		this.recordPass(enc, 'rope_mrope', [p, x, pos, out], [Math.ceil(rows / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	// Upload (une fois par forward) des buffers annexes du RoPE si le cfg en porte — positions 3D
	// M-RoPE (qwen2vl) et/ou facteurs de fréquence (llama3). Appelé par les trois forwards
	// résidents avant la boucle de couches ; no-op pour les archs qui n'en portent pas.
	private preparePositions(cfg: LayerCfg, trash: GPUAny[]): void {
		if (cfg.positions && cfg.mropeSections) {
			const b = this.storage(cfg.positions.byteLength);
			this.device.queue.writeBuffer(b, 0, cfg.positions);
			trash.push(b);
			cfg._posGpu = b;
		}
		if (cfg.ropeFactors) {
			const b = this.storage(cfg.ropeFactors.byteLength);
			this.device.queue.writeBuffer(b, 0, cfg.ropeFactors);
			trash.push(b);
			cfg._ffGpu = b;
		}
	}
	// RoPE 2D (ViT Qwen2-VL) : `pos` = paires u32 (h, w) par patch (CPU Uint32Array ou buffer GPU).
	private recRope2d(enc: GPUAny, trash: GPUAny[], x: GPUAny, pos: GPUAny, rows: number, headDim: number, nHeads: number, base: number): GPUAny {
		const p = this.uniform([rows, headDim, nHeads, 0], { offset: 16, value: base });
		const out = this.storage(rows * headDim * 4);
		this.recordPass(enc, 'rope_2d', [p, x, pos, out], [Math.ceil(rows / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	// RoPE à facteurs de fréquence (buffer GPU ff [headDim/2]) — même packing que recRope.
	private recRopeFactors(enc: GPUAny, trash: GPUAny[], x: GPUAny, ff: GPUAny, rows: number, headDim: number, nHeads: number, pastLen: number, base: number, interleaved = false): GPUAny {
		const p = this.uniform([rows, headDim, nHeads, pastLen], { offset: 16, value: base });
		this.device.queue.writeBuffer(p, 20, new Uint32Array([interleaved ? 1 : 0]));
		const out = this.storage(rows * headDim * 4);
		this.recordPass(enc, 'rope_factors', [p, x, ff, out], [Math.ceil(rows / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	private recAttention(enc: GPUAny, trash: GPUAny[], q: GPUAny, k: GPUAny, v: GPUAny, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, kvLen: number, pastLen: number, scale?: number, softcap = 0, window = 0): GPUAny {
		const p = this.attnUniform(nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen, scale ?? 1 / Math.sqrt(headDim), softcap, window);
		const out = this.storage(nTokens * nHeads * headDim * 4);
		// Décodage (peu de (token, tête) → l'ancien kernel n'occupait que nTokens·nHeads lanes) :
		// un workgroup de 64 lanes PAR (token, tête), softmax en ligne — le coût par token restait
		// linéaire en contexte mais tournait sur ~1 % du GPU (1 t/s mobile à contexte long). Le
		// prefill (beaucoup de tokens) garde le kernel thread-par-tête, déjà bien parallèle.
		// attnDecodeOk : repli automatique si le gate à forme réelle a échoué sur ce GPU (?attndecode=0 force).
		if (this.attnDecodeOk && nTokens * nHeads < 256 && headDim <= 128) {
			this.recordPass(enc, 'attention_decode', [p, q, k, v, out], [nTokens * nHeads, 1, 1]);
		} else {
			this.recordPass(enc, 'attention', [p, q, k, v, out], [Math.ceil((nTokens * nHeads) / WG), 1, 1]);
		}
		trash.push(p, out);
		return out;
	}
	// Quantize `rows` new K/V rows (f32 src) into the persistent int8 cache + f32 scales at row
	// offset. Writes into the PERSISTENT buffers (not trash) — only the uniform is transient.
	private recQuantizeKv(enc: GPUAny, trash: GPUAny[], src: GPUAny, codes: GPUAny, scales: GPUAny, rows: number, nKvHeads: number, headDim: number, rowOffset: number): void {
		const p = this.uniform([rows, nKvHeads, headDim, rowOffset]);
		this.recordPass(enc, 'quantize_kv', [p, src, codes, scales], this.grid1D(rows * nKvHeads));
		trash.push(p);
	}
	// Attention over the int8 KV cache (codes + scales), fused dequant. Mirrors recAttention's packing.
	private recAttentionQ8(enc: GPUAny, trash: GPUAny[], q: GPUAny, kc: GPUAny, ks: GPUAny, vc: GPUAny, vs: GPUAny, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, kvLen: number, pastLen: number, scale?: number, softcap = 0, window = 0): GPUAny {
		const p = this.attnUniform(nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen, scale ?? 1 / Math.sqrt(headDim), softcap, window);
		const out = this.storage(nTokens * nHeads * headDim * 4);
		// Même bascule décodage/prefill (+ repli attnDecodeOk) que recAttention — voir là-bas.
		if (this.attnDecodeOk && nTokens * nHeads < 256 && headDim <= 128) {
			this.recordPass(enc, 'attention_decode_q8kv', [p, q, kc, ks, vc, vs, out], [nTokens * nHeads, 1, 1]);
		} else {
			this.recordPass(enc, 'attention_q8kv', [p, q, kc, ks, vc, vs, out], [Math.ceil((nTokens * nHeads) / WG), 1, 1]);
		}
		trash.push(p, out);
		return out;
	}
	private recAddBias(enc: GPUAny, trash: GPUAny[], x: GPUAny, bias: GPUAny, rows: number, cols: number): GPUAny {
		const p = this.uniform([rows, cols]);
		const out = this.storage(rows * cols * 4);
		this.recordPass(enc, 'addbias', [p, x, bias, out], this.grid1D(rows * cols));
		trash.push(p, out);
		return out;
	}
	private recBinary(enc: GPUAny, trash: GPUAny[], name: string, a: GPUAny, b: GPUAny, len: number): GPUAny {
		const out = this.storage(len * 4);
		this.recordPass(enc, name, [a, b, out], this.grid1D(len));
		trash.push(out);
		return out;
	}
	// LFM2 shortconv ENREGISTRÉE (chemin résident) : même shader que lfm2ShortConv mais l'état
	// `stateBuf` reste sur le GPU (mis à jour in-place par le shader) et n'est PAS mis au trash.
	private recLfm2ShortConv(enc: GPUAny, trash: GPUAny[], bcx: GPUAny, stateBuf: GPUAny, wConv: GPUAny, D: number, LC: number): GPUAny {
		const p = this.uniform([D, LC]);
		const out = this.storage(D * 4);
		this.recordPass(enc, 'lfm2_shortconv', [p, bcx, wConv, stateBuf, out], this.grid1D(D));
		trash.push(p, out); // stateBuf persiste
		return out;
	}

	// Records one full pre-norm transformer layer (with KV cache + GQA) into `enc`, all on the
	// GPU. `kBuf`/`vBuf` are this layer's PERSISTENT cache (capacity ≥ pastLen+seq rows of
	// kvDim): the freshly-projected, RoPE'd K and V for the new tokens are copied in at row
	// offset `pastLen`, then attention reads the whole [0, pastLen+seq) range. Returns the
	// output hidden-state buffer (the next layer's input).
	private recordLayerKV(enc: GPUAny, trash: GPUAny[], x: GPUAny, cfg: LayerCfg, w: LayerWeightsGpu, pastLen: number, kv: KvEntry): GPUAny {
		const kBuf = kv.k, vBuf = kv.v;
		const { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const kvLen = pastLen + seq;
		const f16 = w.matF16 === true; // f16 projection matrices → f16 matmul (q4 triples auto-detected)
		const qDim = nHeads * headDim; // == d for Qwen/Llama; differs for Gemma2 (key_length ≠ d/nHeads)
		const onePlus = cfg.rmsGainOnePlus === true;
		const softcap = cfg.attnLogitSoftcap ?? 0;
		const actName = cfg.act === 'gelu' ? 'geglu' : 'swiglu';
		const n1 = this.recRmsnorm(enc, trash, x, w.attnNorm, seq, d, eps, onePlus);
		let qP = this.recMM(enc, trash, n1, w.wq, seq, d, qDim, f16);
		let kP = this.recMM(enc, trash, n1, w.wk, seq, d, kvDim, f16);
		let vP = this.recMM(enc, trash, n1, w.wv, seq, d, kvDim, f16);
		if (w.bq) qP = this.recAddBias(enc, trash, qP, w.bq, seq, qDim);
		if (w.bk) kP = this.recAddBias(enc, trash, kP, w.bk, seq, kvDim);
		if (w.bv) vP = this.recAddBias(enc, trash, vP, w.bv, seq, kvDim);
		// QK-Norm (Qwen3/Gemma3) : RMSNorm par tête avant le RoPE.
		if (w.qNorm) qP = this.recRmsnorm(enc, trash, qP, w.qNorm, seq * nHeads, headDim, eps, onePlus);
		if (w.kNorm) kP = this.recRmsnorm(enc, trash, kP, w.kNorm, seq * nKvHeads, headDim, eps, onePlus);
		// M-RoPE (qwen2vl) si positions 3D ; RoPE à facteurs (llama3) si rope_freqs ; sinon RoPE 1D
		// standard — le chemin chaud des archs existantes est inchangé.
		const posGpu = cfg._posGpu, ffGpu = cfg._ffGpu;
		// NoPE (SmolLM3) : la couche saute le RoPE — q/k passent tels quels (c'est ce qui donne au
		// modèle son extrapolation en contexte long). Toutes les autres archis : skipRope absent.
		// `cfg.ropeInterleaved` : convention d'appariement (paires adjacentes de ggml vs rotate_half).
		// Elle n'était PAS transmise ici — le commutateur `?ropenorm=1`, censé lire les poids llama
		// tels quels avec le kernel à paires adjacentes, laissait donc le kernel rotate_half tourner
		// des poids non dé-permutés : un opt-in qui ne commutait rien et produisait silencieusement
		// des sorties fausses (corrélation 0,83 contre 1,00 en défaut, mesuré). Transmise, la voie
		// devient réellement équivalente — c'est aussi elle qui rendra les BRIK quantifiés de la
		// famille llama chargeables (leur layout SoA interdit la réécriture par lignes).
		const inter = cfg.ropeInterleaved === true;
		const doRope = (x: GPUAny, rows: number, nH: number): GPUAny =>
			cfg.skipRope ? x
			: posGpu ? this.recRopeMrope(enc, trash, x, posGpu, rows, headDim, nH, ropeTheta, cfg.mropeSections!)
			: ffGpu ? this.recRopeFactors(enc, trash, x, ffGpu, rows, headDim, nH, pastLen, ropeTheta, inter)
			: this.recRope(enc, trash, x, rows, headDim, nH, pastLen, ropeTheta, inter);
		const q = doRope(qP, seq * nHeads, nHeads);
		const newK = doRope(kP, seq * nKvHeads, nKvHeads);
		// Append the new tokens' K/V into the persistent cache at row offset pastLen, then attend.
		let attn: GPUAny;
		if (kv.kScale) {
			// q8 KV: quantize the new rows into the int8 cache (+ per-(row,head) scale), attend in place.
			this.recQuantizeKv(enc, trash, newK, kBuf, kv.kScale, seq, nKvHeads, headDim, pastLen);
			this.recQuantizeKv(enc, trash, vP, vBuf, kv.vScale, seq, nKvHeads, headDim, pastLen);
			attn = this.recAttentionQ8(enc, trash, q, kBuf, kv.kScale, vBuf, kv.vScale, seq, nHeads, nKvHeads, headDim, kvLen, pastLen, cfg.attnScale, softcap, cfg.window ?? 0);
		} else {
			// f32 KV: raw copy (kvDim*4 is 4-aligned), attend f32. Capacity ensured ≥ kvLen by caller.
			const rowBytes = kvDim * 4;
			enc.copyBufferToBuffer(newK, 0, kBuf, pastLen * rowBytes, seq * rowBytes);
			enc.copyBufferToBuffer(vP, 0, vBuf, pastLen * rowBytes, seq * rowBytes);
			attn = this.recAttention(enc, trash, q, kBuf, vBuf, seq, nHeads, nKvHeads, headDim, kvLen, pastLen, cfg.attnScale, softcap, cfg.window ?? 0);
		}
		let proj = this.recMM(enc, trash, attn, w.wo, seq, qDim, d, f16);
		// Gemma2 sandwich: RMSNorm the attn sub-block output before the residual add.
		if (w.postAttnNorm) proj = this.recRmsnorm(enc, trash, proj, w.postAttnNorm, seq, d, eps, onePlus);
		const h = this.recBinary(enc, trash, 'add', x, proj, seq * d);
		const n2 = this.recRmsnorm(enc, trash, h, w.ffnNorm, seq, d, eps, onePlus);
		const gate = this.recMM(enc, trash, n2, w.wgate, seq, d, ffn, f16);
		const up = this.recMM(enc, trash, n2, w.wup, seq, d, ffn, f16);
		const g = this.recBinary(enc, trash, actName, gate, up, seq * ffn);
		let down = this.recMM(enc, trash, g, w.wdown, seq, ffn, d, f16);
		if (w.postFfnNorm) down = this.recRmsnorm(enc, trash, down, w.postFfnNorm, seq, d, eps, onePlus);
		return this.recBinary(enc, trash, 'add', h, down, seq * d);
	}

	// ── Persistent per-layer KV cache (GPU) for the resident path ───────────────
	// When kvQuant is true the cache is int8 (k/v) + per-(row,head) f32 scales (kScale/vScale) —
	// ÷~4 the VRAM of f32 → ~4× more context fits. Else f32 (no scales). Switching mode resets it.
	private kvGpu = new Map<number, KvEntry>();
	// GPU top-k sampling health (set by selfValidate at load): false → the chat loop uses the CPU
	// full-vocab sampling fallback instead of decodeTopKQ8. Never blocks a model from loading.
	topKOk = true;

	private kvSession = '';
	// Off by default (f32 KV, unchanged behaviour). Opt-in via setKvQuant → int8 KV, ÷~4 VRAM,
	// ~4× more context, near-f16 quality. Gated by the q8-KV selfValidate check below.
	kvQuant = false;

	// Switch the KV cache precision (q8 ⇄ f32). Resets the cache (layouts differ); weights stay.
	setKvQuant(q8: boolean): void {
		if (this.kvQuant === q8) return;
		this.kvQuant = q8;
		this.resetKvGpu();
	}

	private resetKvGpu(): void {
		for (const e of this.kvGpu.values()) { e.k.destroy?.(); e.v.destroy?.(); e.kScale?.destroy?.(); e.vScale?.destroy?.(); }
		this.kvGpu.clear();
		this.kvSession = '';
		// Free the scratch pool too — it's reused within a generation's decode loop, but bounded
		// per generation so a long prompt's big prefill buffers don't linger across messages.
		for (const list of this.bufferPool.values()) for (const b of list) b.destroy?.();
		this.bufferPool.clear();
	}

	// Public: drop the GPU KV cache (called between generations; weights stay resident).
	clearKvCache(): void { this.resetKvGpu(); }

	// Ensure layer `layer`'s KV buffers hold at least `rows` rows of `kvDim`. Grows (alloc +
	// GPU-side copy of the old contents) in ≥1024-row steps so growth is rare and never touches
	// the CPU. Returns the (possibly new) buffers.
	private ensureKv(layer: number, rows: number, kvDim: number, nKvHeads: number): KvEntry {
		const e = this.kvGpu.get(layer);
		if (e && e.cap >= rows) return e;
		const cap = Math.max(rows, (e?.cap ?? 0) + 1024, 1024);
		const q8 = this.kvQuant;
		// q8: int8 codes (1 byte/elem) + f32 scale per (row, head). f32: 4 bytes/elem, no scales.
		const k = this.storage(cap * kvDim * (q8 ? 1 : 4));
		const v = this.storage(cap * kvDim * (q8 ? 1 : 4));
		const kScale = q8 ? this.storage(cap * nKvHeads * 4) : undefined;
		const vScale = q8 ? this.storage(cap * nKvHeads * 4) : undefined;
		if (e) {
			const enc = this.device.createCommandEncoder();
			enc.copyBufferToBuffer(e.k, 0, k, 0, e.cap * kvDim * (q8 ? 1 : 4));
			enc.copyBufferToBuffer(e.v, 0, v, 0, e.cap * kvDim * (q8 ? 1 : 4));
			if (q8 && e.kScale) {
				enc.copyBufferToBuffer(e.kScale, 0, kScale, 0, e.cap * nKvHeads * 4);
				enc.copyBufferToBuffer(e.vScale, 0, vScale, 0, e.cap * nKvHeads * 4);
			}
			this.device.queue.submit([enc.finish()]);
			e.k.destroy?.(); e.v.destroy?.(); e.kScale?.destroy?.(); e.vScale?.destroy?.();
		}
		const ne: KvEntry = { k, v, cap, kScale, vScale };
		this.kvGpu.set(layer, ne);
		return ne;
	}

	// GPU-resident forward over the token sequence: embed buffer → every layer → final norm,
	// recorded into a single command encoder, ONE submit, ONE readback of the last token's
	// hidden state ([d] f32). Handles both prefill (pastLen 0, seq = promptLen) and decode
	// (seq 1) — the KV cache persists per layer keyed by `sessionId`, reset when the session
	// changes or pastLen is 0.
	async runDecodeGpu(embeds: Float32Array, cfg: LayerCfg, layers: LayerWeightsGpu[], pastLen: number, finalNorm: GPUAny, sessionId: string): Promise<Float32Array> {
		const { seq, d, nKvHeads, headDim, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const kvLen = pastLen + seq;
		if (sessionId !== this.kvSession || pastLen === 0) {
			// pastLen > 0 sur une session que l'engine ne connaît pas = le caller croit réutiliser un
			// cache qui n'existe plus (reset intervenu ?) → l'attention lirait des K/V vides. On
			// continue (sortie fausse mais non fatale) en le disant très fort.
			if (pastLen > 0) console.error(`[kv] session "${sessionId}" inconnue avec pastLen=${pastLen} — cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`);
			this.resetKvGpu();
			this.kvSession = sessionId;
		}
		for (let i = 0; i < layers.length; i++) this.ensureKv(i, kvLen, kvDim, nKvHeads);

		const trash: GPUAny[] = [];
		this.preparePositions(cfg, trash); // M-RoPE (qwen2vl) : positions 3D uploadées une fois
		const enc = this.device.createCommandEncoder();
		let x = this.storage(embeds.byteLength);
		this.device.queue.writeBuffer(x, 0, embeds);
		trash.push(x);
		for (let i = 0; i < layers.length; i++) {
			const kv = this.kvGpu.get(i)!;
			x = this.recordLayerKV(enc, trash, x, layerCfg(cfg, seq, i, this.swaOk), layers[i], pastLen, kv);
		}
		const normed = this.recRmsnorm(enc, trash, x, finalNorm, seq, d, eps, cfg.rmsGainOnePlus === true);
		const lastRow = this.storage(d * 4);
		enc.copyBufferToBuffer(normed, (seq - 1) * d * 4, lastRow, 0, d * 4);
		this.device.queue.submit([enc.finish()]);
		const out = await this.readBack(lastRow, d * 4);
		trash.push(lastRow);
		this.release(trash); // scratch back to the pool (GPU done after the readback above)
		return out;
	}

	// Fused decode + logit projection: the layer stack + final norm + the Q8 lm_head over the whole
	// vocab, ALL recorded into ONE command encoder → ONE submit → ONE readback (the logits). This
	// replaces runDecodeGpu (reads the hidden state back) + a separate projection submit for the chat
	// decode path: 2 GPU↔CPU syncs/token become 1. On a mobile tiler the per-token cost is the flush
	// each sync forces, NOT the bytes — so collapsing two syncs into one is the real win. The hidden
	// state never leaves the GPU. Same numbers as the two-step path.
	// projTiles : tuiles de la projection logits — `w` est un handle recMM ({codes,sc} q8 OU
	// {nib,sc,mn} q4 : les embeddings int4 du tier q4 projettent en q4 natif, ½ VRAM).
	async decodeLogitsQ8(embeds: Float32Array, cfg: LayerCfg, layers: LayerWeightsGpu[], pastLen: number, finalNorm: GPUAny, sessionId: string, projTiles: { w: GPUAny; rows: number; r0: number }[], vocab: number): Promise<Float32Array> {
		const G = globalThis as any;
		const { seq, d, nKvHeads, headDim, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const kvLen = pastLen + seq;
		if (sessionId !== this.kvSession || pastLen === 0) {
			// pastLen > 0 sur une session que l'engine ne connaît pas = le caller croit réutiliser un
			// cache qui n'existe plus (reset intervenu ?) → l'attention lirait des K/V vides. On
			// continue (sortie fausse mais non fatale) en le disant très fort.
			if (pastLen > 0) console.error(`[kv] session "${sessionId}" inconnue avec pastLen=${pastLen} — cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`);
			this.resetKvGpu();
			this.kvSession = sessionId;
		}
		for (let i = 0; i < layers.length; i++) this.ensureKv(i, kvLen, kvDim, nKvHeads);

		const trash: GPUAny[] = [];
		this.preparePositions(cfg, trash); // M-RoPE (qwen2vl) : positions 3D uploadées une fois
		const enc = this.device.createCommandEncoder();
		let x = this.storage(embeds.byteLength);
		this.device.queue.writeBuffer(x, 0, embeds);
		trash.push(x);
		for (let i = 0; i < layers.length; i++) {
			const kv = this.kvGpu.get(i)!;
			x = this.recordLayerKV(enc, trash, x, layerCfg(cfg, seq, i, this.swaOk), layers[i], pastLen, kv);
		}
		const normed = this.recRmsnorm(enc, trash, x, finalNorm, seq, d, eps, cfg.rmsGainOnePlus === true);
		// Last token's hidden row stays on the GPU and feeds the projection directly (no readback).
		const lastRow = this.storage(d * 4);
		enc.copyBufferToBuffer(normed, (seq - 1) * d * 4, lastRow, 0, d * 4);
		trash.push(lastRow);
		const logits = this.storage(vocab * 4);
		trash.push(logits);
		for (const t of projTiles) {
			const tileLogits = this.recMM(enc, trash, lastRow, t.w, 1, d, t.rows, false);
			enc.copyBufferToBuffer(tileLogits, 0, logits, t.r0 * 4, t.rows * 4);
		}
		const read = this.device.createBuffer({ size: vocab * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(logits, 0, read, 0, vocab * 4);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const out = new Float32Array(read.getMappedRange().slice(0));
		read.unmap();
		read.destroy();
		this.release(trash);
		return out;
	}

	// Same forward+projection as decodeLogitsQ8, but the sampling PRE-work happens on the GPU:
	// softcap (Gemma, cap>0) → repetition penalty (deduped recent ids) → top-K selection. Only
	// K ids + K values are read back (~512 o vs ~600 Ko for the full vocab — the per-token
	// readback was the decode floor on mobile). Values come back sorted descending; the CPU then
	// finishes with temperature/top-p over these candidates (sampleFromTopK), which is EXACTLY
	// what it did over the full vector (top-K here ⊇ sampling top-k).
	async decodeTopKQ8(embeds: Float32Array, cfg: LayerCfg, layers: LayerWeightsGpu[], pastLen: number, finalNorm: GPUAny, sessionId: string, projTiles: { w: GPUAny; rows: number; r0: number }[], vocab: number, recent: number[], penalty: number, softcap: number, K = 64): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		const G = globalThis as any;
		const { seq, d, nKvHeads, headDim, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const kvLen = pastLen + seq;
		if (sessionId !== this.kvSession || pastLen === 0) {
			if (pastLen > 0) console.error(`[kv] session "${sessionId}" inconnue avec pastLen=${pastLen} — cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`);
			this.resetKvGpu();
			this.kvSession = sessionId;
		}
		for (let i = 0; i < layers.length; i++) this.ensureKv(i, kvLen, kvDim, nKvHeads);

		// Chronométrage interne (?timing=1) : le PREMIER appel d'une session coûtait 12,8 s sur un 7B
		// contre ~96 ms ensuite, poids déjà en VRAM. On sépare l'ENREGISTREMENT des passes (où le
		// driver compile les pipelines WGSL au premier usage) de l'exécution GPU (submit → readback).
		const TT = WebGpuEngine.timingOn ? (label: string, t0: number) => console.info(`[timing:gpu] ${label} ${(performance.now() - t0).toFixed(0)} ms`) : null;
		let tt = performance.now();
		const trash: GPUAny[] = [];
		this.preparePositions(cfg, trash); // M-RoPE (qwen2vl) : positions 3D uploadées une fois
		const enc = this.device.createCommandEncoder();
		let x = this.storage(embeds.byteLength);
		this.device.queue.writeBuffer(x, 0, embeds);
		trash.push(x);
		for (let i = 0; i < layers.length; i++) {
			const kv = this.kvGpu.get(i)!;
			x = this.recordLayerKV(enc, trash, x, layerCfg(cfg, seq, i, this.swaOk), layers[i], pastLen, kv);
		}
		const normed = this.recRmsnorm(enc, trash, x, finalNorm, seq, d, eps, cfg.rmsGainOnePlus === true);
		const lastRow = this.storage(d * 4);
		enc.copyBufferToBuffer(normed, (seq - 1) * d * 4, lastRow, 0, d * 4);
		trash.push(lastRow);
		const logits = this.storage(vocab * 4);
		trash.push(logits);
		for (const t of projTiles) {
			const tileLogits = this.recMM(enc, trash, lastRow, t.w, 1, d, t.rows, false);
			enc.copyBufferToBuffer(tileLogits, 0, logits, t.r0 * 4, t.rows * 4);
		}
		// Sampling pre-work, recorded in the SAME submit — mirrors the CPU order exactly.
		if (softcap && softcap > 0) {
			const p = this.uniform([vocab], { offset: 4, value: softcap });
			this.recordPass(enc, 'softcap_logits', [p, logits], this.grid1D(vocab));
			trash.push(p);
		}
		if (penalty && penalty !== 1 && recent.length) {
			const ids = Uint32Array.from(recent);
			const idsBuf = this.bufU32(ids, G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST);
			const p = this.uniform([ids.length], { offset: 4, value: penalty });
			this.recordPass(enc, 'penalize_logits', [p, idsBuf, logits], this.grid1D(ids.length));
			trash.push(p, idsBuf);
		}
		const out = this.storage(K * 2 * 4); // [K ids u32 | K vals f32-bits]
		trash.push(out);
		{
			const p = this.uniform([vocab, K]);
			this.recordPass(enc, 'top_k', [p, logits, out], [1, 1, 1]);
			trash.push(p);
		}
		const read = this.device.createBuffer({ size: K * 2 * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(out, 0, read, 0, K * 2 * 4);
		TT?.('enregistrement des passes (compilation des pipelines incluse)', tt); tt = performance.now();
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		TT?.('execution GPU (submit + readback)', tt);
		const raw = new Uint32Array(read.getMappedRange().slice(0));
		read.unmap();
		read.destroy();
		this.release(trash);
		return { ids: raw.slice(0, K), vals: new Float32Array(raw.buffer, K * 4, K) };
	}

	// ── LFM2 (hybride conv+attention) 100 % RÉSIDENT ────────────────────────────
	// Même recette que le décodage transformer (rec* chaînés, une soumission, un readback), mais graphe
	// HYBRIDE et état conv persistant. On enregistre les T tokens (prefill ou décodage) dans UN encoder :
	// l'état conv et le cache K/V (f32) sont mis à jour in-place, l'ordre des passes garantit que le token
	// t+1 voit l'état du token t. État keyé par sessionId (reset si change ou pastLen 0), comme kvGpu.
	private lfm2KvGpu = new Map<number, { k: GPUAny; v: GPUAny; cap: number }>();
	private lfm2ConvGpu = new Map<number, GPUAny>();
	private lfm2Session = '';

	private resetLfm2State(): void {
		for (const e of this.lfm2KvGpu.values()) { e.k.destroy?.(); e.v.destroy?.(); }
		for (const b of this.lfm2ConvGpu.values()) b.destroy?.();
		this.lfm2KvGpu.clear(); this.lfm2ConvGpu.clear(); this.lfm2Session = '';
		for (const list of this.bufferPool.values()) for (const b of list) b.destroy?.();
		this.bufferPool.clear();
	}
	clearLfm2State(): void { this.resetLfm2State(); }

	// Cache K/V f32 d'une couche d'attention (croît par pas de 1024 lignes, copie GPU→GPU).
	private ensureLfm2Kv(layer: number, rows: number, kvDim: number): { k: GPUAny; v: GPUAny; cap: number } {
		const e = this.lfm2KvGpu.get(layer);
		if (e && e.cap >= rows) return e;
		const cap = Math.max(rows, (e?.cap ?? 0) + 1024, 1024);
		const k = this.storage(cap * kvDim * 4), v = this.storage(cap * kvDim * 4);
		if (e) {
			const enc = this.device.createCommandEncoder();
			enc.copyBufferToBuffer(e.k, 0, k, 0, e.cap * kvDim * 4);
			enc.copyBufferToBuffer(e.v, 0, v, 0, e.cap * kvDim * 4);
			this.device.queue.submit([enc.finish()]);
			e.k.destroy?.(); e.v.destroy?.();
		}
		const ne = { k, v, cap }; this.lfm2KvGpu.set(layer, ne); return ne;
	}
	// État conv (LC-1)·D d'une couche conv (persistant, initialisé à zéro à la création).
	private ensureLfm2Conv(layer: number, elems: number): GPUAny {
		let b = this.lfm2ConvGpu.get(layer);
		if (!b) { b = this.storage(elems * 4); this.device.queue.writeBuffer(b, 0, new Float32Array(elems)); this.lfm2ConvGpu.set(layer, b); }
		return b;
	}

	// Shortconv BATCHÉE : y pour les T tokens en une passe (état entrant lu read-only), puis nouvel
	// état dans une passe séparée (voir les shaders : lire l'ancien état et écrire le nouveau dans la
	// même invocation serait une course). Exige T ≥ lc-1.
	private recLfm2ShortConvBatch(enc: GPUAny, trash: GPUAny[], bcx: GPUAny, stateBuf: GPUAny, wConv: GPUAny, D: number, LC: number, T: number): GPUAny {
		const p = this.uniform([D, LC, T]);
		const out = this.storage(T * D * 4);
		this.recordPass(enc, 'lfm2_shortconv_batch', [p, bcx, wConv, stateBuf, out], this.grid1D(T * D));
		const p2 = this.uniform([D, LC, T]);
		this.recordPass(enc, 'lfm2_shortconv_state', [p2, bcx, stateBuf], this.grid1D((LC - 1) * D));
		trash.push(p, p2, out); // stateBuf persiste
		return out;
	}

	// Enregistre le stack LFM2 pour les T tokens dans `enc`. Retourne le buffer [D] du dernier token
	// APRÈS la norme finale (token_embd_norm) — prêt pour la tête liée.
	//
	// Deux régimes :
	//  - BATCHÉ (T ≥ lc-1, gate lfm2BatchOk) : une passe par opérateur pour les T tokens — matmuls
	//    (T,IN)×(IN,OUT) qui tapent les kernels tuilés/shared, rmsnorm/rope par lignes, attention
	//    causale via pastLen, shortconv batchée. Le NOMBRE de passes devient indépendant de T
	//    (~10·NL) : c'est ce qui rend le prefill d'un prompt long tenable (avant, T·NL·~10 passes
	//    figeaient le main thread et dépassaient le watchdog GPU → device lost).
	//  - SÉQUENTIEL (T < lc-1, ou gate coupé) : la boucle token par token d'origine, conservée comme
	//    référence de correction (?lfm2batch=0 → sortie token-exacte identique en greedy).
	private recordLfm2(enc: GPUAny, trash: GPUAny[], embeds: Float32Array, T: number, cfg: Lfm2Cfg, layers: Lfm2LayerGpu[], tokEmbdNorm: GPUAny, pastLen: number): GPUAny {
		const { D, nHeads, nKvHeads, headDim, ffn, eps, theta, lc } = cfg;
		const kvDim = nKvHeads * headDim, qDim = nHeads * headDim, rowBytes = kvDim * 4;
		for (let L = 0; L < layers.length; L++) {
			if (layers[L].conv) this.ensureLfm2Conv(L, (lc - 1) * D);
			else this.ensureLfm2Kv(L, pastLen + T, kvDim);
		}

		if (T >= lc - 1 && this.lfm2BatchOk) {
			let x = this.storage(T * D * 4);
			this.device.queue.writeBuffer(x, 0, embeds);
			trash.push(x);
			for (let L = 0; L < layers.length; L++) {
				const w = layers[L];
				const h = this.recRmsnorm(enc, trash, x, w.attnNorm, T, D, eps);
				let out: GPUAny;
				if (w.conv) {
					const bcx = this.recMM(enc, trash, h, w.inProj, T, D, 3 * D, false);
					const conv = this.recLfm2ShortConvBatch(enc, trash, bcx, this.lfm2ConvGpu.get(L)!, w.convW, D, lc, T);
					out = this.recMM(enc, trash, conv, w.outProj, T, D, D, false);
				} else {
					let q = this.recMM(enc, trash, h, w.wq, T, D, qDim, false);
					let k = this.recMM(enc, trash, h, w.wk, T, D, kvDim, false);
					const v = this.recMM(enc, trash, h, w.wv, T, D, kvDim, false);
					q = this.recRmsnorm(enc, trash, q, w.qNorm, T * nHeads, headDim, eps);   // qk-norm par tête
					k = this.recRmsnorm(enc, trash, k, w.kNorm, T * nKvHeads, headDim, eps);
					q = this.recRope(enc, trash, q, T * nHeads, headDim, nHeads, pastLen, theta);
					k = this.recRope(enc, trash, k, T * nKvHeads, headDim, nKvHeads, pastLen, theta);
					const kv = this.lfm2KvGpu.get(L)!;
					enc.copyBufferToBuffer(k, 0, kv.k, pastLen * rowBytes, T * rowBytes);
					enc.copyBufferToBuffer(v, 0, kv.v, pastLen * rowBytes, T * rowBytes);
					const attn = this.recAttention(enc, trash, q, kv.k, kv.v, T, nHeads, nKvHeads, headDim, pastLen + T, pastLen);
					out = this.recMM(enc, trash, attn, w.wo, T, qDim, D, false);
				}
				x = this.recBinary(enc, trash, 'add', x, out, T * D);
				const h2 = this.recRmsnorm(enc, trash, x, w.ffnNorm, T, D, eps);
				const gate = this.recMM(enc, trash, h2, w.wgate, T, D, ffn, false);
				const up = this.recMM(enc, trash, h2, w.wup, T, D, ffn, false);
				const g = this.recBinary(enc, trash, 'swiglu', gate, up, T * ffn);
				const down = this.recMM(enc, trash, g, w.wdown, T, ffn, D, false);
				x = this.recBinary(enc, trash, 'add', x, down, T * D);
			}
			// Seul le DERNIER token porte les logits utiles : on n'extrait qu'une ligne avant la norme
			// finale (la tête D×vocab est de loin la plus chère — inutile de la payer T fois).
			const lastRow = this.storage(D * 4);
			trash.push(lastRow);
			enc.copyBufferToBuffer(x, (T - 1) * D * 4, lastRow, 0, D * 4);
			return this.recRmsnorm(enc, trash, lastRow, tokEmbdNorm, 1, D, eps);
		}

		let lastNormed: GPUAny = null;
		for (let t = 0; t < T; t++) {
			const pos = pastLen + t;
			let x = this.storage(D * 4);
			this.device.queue.writeBuffer(x, 0, embeds.subarray(t * D, (t + 1) * D));
			trash.push(x);
			for (let L = 0; L < layers.length; L++) {
				const w = layers[L];
				const h = this.recRmsnorm(enc, trash, x, w.attnNorm, 1, D, eps);
				let out: GPUAny;
				if (w.conv) {
					const bcx = this.recMM(enc, trash, h, w.inProj, 1, D, 3 * D, false);
					const conv = this.recLfm2ShortConv(enc, trash, bcx, this.lfm2ConvGpu.get(L)!, w.convW, D, lc);
					out = this.recMM(enc, trash, conv, w.outProj, 1, D, D, false);
				} else {
					let q = this.recMM(enc, trash, h, w.wq, 1, D, qDim, false);
					let k = this.recMM(enc, trash, h, w.wk, 1, D, kvDim, false);
					const v = this.recMM(enc, trash, h, w.wv, 1, D, kvDim, false);
					q = this.recRmsnorm(enc, trash, q, w.qNorm, nHeads, headDim, eps);   // qk-norm par tête
					k = this.recRmsnorm(enc, trash, k, w.kNorm, nKvHeads, headDim, eps);
					q = this.recRope(enc, trash, q, nHeads, headDim, nHeads, pos, theta);
					k = this.recRope(enc, trash, k, nKvHeads, headDim, nKvHeads, pos, theta);
					const kv = this.lfm2KvGpu.get(L)!;
					enc.copyBufferToBuffer(k, 0, kv.k, pos * rowBytes, rowBytes);
					enc.copyBufferToBuffer(v, 0, kv.v, pos * rowBytes, rowBytes);
					const attn = this.recAttention(enc, trash, q, kv.k, kv.v, 1, nHeads, nKvHeads, headDim, pos + 1, pos);
					out = this.recMM(enc, trash, attn, w.wo, 1, qDim, D, false);
				}
				x = this.recBinary(enc, trash, 'add', x, out, D);
				const h2 = this.recRmsnorm(enc, trash, x, w.ffnNorm, 1, D, eps);
				const gate = this.recMM(enc, trash, h2, w.wgate, 1, D, ffn, false);
				const up = this.recMM(enc, trash, h2, w.wup, 1, D, ffn, false);
				const g = this.recBinary(enc, trash, 'swiglu', gate, up, ffn);
				const down = this.recMM(enc, trash, g, w.wdown, 1, ffn, D, false);
				x = this.recBinary(enc, trash, 'add', x, down, D);
			}
			if (t === T - 1) lastNormed = this.recRmsnorm(enc, trash, x, tokEmbdNorm, 1, D, eps);
		}
		return lastNormed;
	}

	private lfm2SessionReset(sessionId: string, pastLen: number): void {
		if (sessionId !== this.lfm2Session || pastLen === 0) {
			if (pastLen > 0) console.error(`[lfm2] session "${sessionId}" inconnue avec pastLen=${pastLen} — état perdu, sortie invalide. Repartir de pastLen 0.`);
			this.resetLfm2State();
			this.lfm2Session = sessionId;
		}
	}

	// Prefill PUR (pas de tête, pas de logits) : avance l'état K/V + conv de T tokens, une soumission,
	// synchronisée par onSubmittedWorkDone (pas de readback). Utilisé par le prefill par tranches de
	// generateResident — la projection de tête (D×vocab) ne se paye que sur la DERNIÈRE tranche.
	async lfm2PrefillGpu(embeds: Float32Array, T: number, cfg: Lfm2Cfg, layers: Lfm2LayerGpu[], tokEmbdNorm: GPUAny, pastLen: number, sessionId: string): Promise<void> {
		this.lfm2SessionReset(sessionId, pastLen);
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		this.recordLfm2(enc, trash, embeds, T, cfg, layers, tokEmbdNorm, pastLen);
		this.device.queue.submit([enc.finish()]);
		await this.device.queue.onSubmittedWorkDone();
		this.release(trash);
	}

	// Logits complets du dernier token (classify / bench). UN submit, UN readback.
	async lfm2LogitsGpu(embeds: Float32Array, T: number, cfg: Lfm2Cfg, layers: Lfm2LayerGpu[], head: GPUAny, tokEmbdNorm: GPUAny, pastLen: number, sessionId: string): Promise<Float32Array> {
		const G = globalThis as any;
		this.lfm2SessionReset(sessionId, pastLen);
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		const last = this.recordLfm2(enc, trash, embeds, T, cfg, layers, tokEmbdNorm, pastLen);
		const logits = this.recMM(enc, trash, last, head, 1, cfg.D, cfg.vocab, false);
		const read = this.device.createBuffer({ size: cfg.vocab * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(logits, 0, read, 0, cfg.vocab * 4);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const out = new Float32Array(read.getMappedRange().slice(0));
		read.unmap(); read.destroy(); this.release(trash);
		return out;
	}

	// Top-K GPU du dernier token (chat) : projection tête + pénalité de répétition + top_k, UN readback
	// (~512 o). Pas de softcap (LFM2). Miroir de decodeTopKQ8.
	async lfm2TopKGpu(embeds: Float32Array, T: number, cfg: Lfm2Cfg, layers: Lfm2LayerGpu[], head: GPUAny, tokEmbdNorm: GPUAny, pastLen: number, sessionId: string, recent: number[], penalty: number, K = 64): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		const G = globalThis as any;
		this.lfm2SessionReset(sessionId, pastLen);
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		const last = this.recordLfm2(enc, trash, embeds, T, cfg, layers, tokEmbdNorm, pastLen);
		const logits = this.recMM(enc, trash, last, head, 1, cfg.D, cfg.vocab, false);
		if (penalty && penalty !== 1 && recent.length) {
			const ids = Uint32Array.from(recent);
			const idsBuf = this.bufU32(ids, G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST);
			const p = this.uniform([ids.length], { offset: 4, value: penalty });
			this.recordPass(enc, 'penalize_logits', [p, idsBuf, logits], this.grid1D(ids.length));
			trash.push(p, idsBuf);
		}
		const out = this.storage(K * 2 * 4);
		trash.push(out);
		{ const p = this.uniform([cfg.vocab, K]); this.recordPass(enc, 'top_k', [p, logits, out], [1, 1, 1]); trash.push(p); }
		const read = this.device.createBuffer({ size: K * 2 * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(out, 0, read, 0, K * 2 * 4);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const raw = new Uint32Array(read.getMappedRange().slice(0));
		read.unmap(); read.destroy(); this.release(trash);
		return { ids: raw.slice(0, K), vals: new Float32Array(raw.buffer, K * 4, K) };
	}

	// ── RWKV-7 (récurrent pur) 100 % RÉSIDENT ────────────────────────────────────
	// Même recette que LFM2 : les T tokens d'un appel sont enregistrés dans UN encoder (une soumission,
	// un readback pour le dernier token). L'état PAR COUCHE (S = NH·H·H de la récurrence WKV,
	// tm/cm = D des token-shifts) vit sur le GPU, mis à jour in-place — l'ordre des passes garantit
	// que le token t+1 voit l'état du token t. vFirst (résidu de valeur, posé couche 0, lu ensuite)
	// est un buffer partagé réécrit à chaque token. Keyé par sessionId comme lfm2. Pas de régime
	// batché : la récurrence est séquentielle par nature (le chunk-scan parallèle est le chantier
	// suivant du moteur v2) — l'appelant borne T par tranche pour garder l'encodeur raisonnable.
	private rwkvStateGpu = new Map<number, { S: GPUAny; tm: GPUAny; cm: GPUAny }>();
	private rwkvVFirst: GPUAny = null;
	private rwkvSession = '';

	private resetRwkvState(): void {
		for (const e of this.rwkvStateGpu.values()) { e.S.destroy?.(); e.tm.destroy?.(); e.cm.destroy?.(); }
		this.rwkvStateGpu.clear();
		this.rwkvVFirst?.destroy?.(); this.rwkvVFirst = null;
		this.rwkvSession = '';
		for (const list of this.bufferPool.values()) for (const b of list) b.destroy?.();
		this.bufferPool.clear();
	}
	clearRwkvState(): void { this.resetRwkvState(); }

	private ensureRwkvState(layer: number, D: number, NH: number, H: number): { S: GPUAny; tm: GPUAny; cm: GPUAny } {
		let e = this.rwkvStateGpu.get(layer);
		if (!e) {
			const S = this.storage(NH * H * H * 4), tm = this.storage(D * 4), cm = this.storage(D * 4);
			this.device.queue.writeBuffer(S, 0, new Float32Array(NH * H * H));
			this.device.queue.writeBuffer(tm, 0, new Float32Array(D));
			this.device.queue.writeBuffer(cm, 0, new Float32Array(D));
			e = { S, tm, cm };
			this.rwkvStateGpu.set(layer, e);
		}
		return e;
	}

	private rwkvSessionReset(sessionId: string, pastLen: number): void {
		if (sessionId !== this.rwkvSession || pastLen === 0) {
			if (pastLen > 0) console.error(`[rwkv] session "${sessionId}" inconnue avec pastLen=${pastLen} — état perdu, sortie invalide. Repartir de pastLen 0.`);
			this.resetRwkvState();
			this.rwkvSession = sessionId;
		}
	}

	// Enregistre le forward d'UN token (x = [D] déjà passé par la norme d'embedding) dans `enc`.
	// Sémantique = RwkvModel.timeMix/channelMix (elle-même byte-identique à scripts/rwkv-cpuref.cjs).
	private recRwkvToken(enc: GPUAny, trash: GPUAny[], x: GPUAny, cfg: RwkvCfg, layers: RwkvLayerGpu[], vFirst: GPUAny): GPUAny {
		const { D, H, NH } = cfg;
		const EPS_LN = 1e-5, EPS_GN = 64e-5; // GroupNorm têtes : constante GGUF (= 6.4e-4)
		for (let L = 0; L < layers.length; L++) {
			const w = layers[L];
			const st = this.rwkvStateGpu.get(L)!;
			// ── time-mix ──
			const h = this.recLayernorm(enc, trash, x, w.attnNormW, w.attnNormB, 1, D, EPS_LN);
			const six = this.storage(6 * D * 4);
			{ const p = this.uniform([D]); this.recordPass(enc, 'rwkv_token_shift', [p, h, st.tm, w.lerpFused, six], this.grid1D(6 * D)); trash.push(p, six); }
			enc.copyBufferToBuffer(h, 0, st.tm, 0, D * 4); // prev ← ln (APRÈS la lecture par le pass)
			const slice = (k: number): GPUAny => { const b = this.storage(D * 4); enc.copyBufferToBuffer(six, k * D * 4, b, 0, D * 4); trash.push(b); return b; };
			const xr = slice(0), xw = slice(1), xk = slice(2), xv = slice(3), xa = slice(4), xg = slice(5);
			const r = this.recMM(enc, trash, xr, w.R, 1, D, D, false);
			const k = this.recMM(enc, trash, xk, w.K, 1, D, D, false);
			const v = this.recMM(enc, trash, xv, w.V, 1, D, D, false);
			// décroissance w = exp(-0.606531·σ(w0 + w2·tanh(w1·xw)))
			const wt = this.recUnary(enc, trash, 'tanh_act', this.recMM(enc, trash, xw, w.w1, 1, D, w.rw, false), w.rw);
			const wpre = this.recMM(enc, trash, wt, w.w2, 1, w.rw, D, false);
			const wd = this.storage(D * 4);
			{ this.recordPass(enc, 'rwkv_decay', [w.w0, wpre, wd], this.grid1D(D)); trash.push(wd); }
			// a (taux d'apprentissage en contexte) = σ(a0 + a2·(a1·xa))
			const apre = this.recMM(enc, trash, this.recMM(enc, trash, xa, w.a1, 1, D, w.ra, false), w.a2, 1, w.ra, D, false);
			const av = this.storage(D * 4);
			{ this.recordPass(enc, 'rwkv_bias_sigmoid', [w.a0, apre, av], this.grid1D(D)); trash.push(av); }
			// gate g = g2·σ(g1·xg)
			const gt = this.recUnary(enc, trash, 'sigmoid', this.recMM(enc, trash, xg, w.g1, 1, D, w.rg, false), w.rg);
			const g = this.recMM(enc, trash, gt, w.g2, 1, w.rg, D, false);
			// résidu de valeur : couche 0 POSE vFirst ; ensuite v ← v + (vFirst−v)·σ(v0 + v2·(v1·xv))
			if (L === 0) {
				enc.copyBufferToBuffer(v, 0, vFirst, 0, D * 4);
			} else {
				const vpre = this.recMM(enc, trash, this.recMM(enc, trash, xv, w.v1!, 1, D, w.rv!, false), w.v2!, 1, w.rv!, D, false);
				this.recordPass(enc, 'rwkv_vresid', [v, vFirst, w.v0!, vpre], this.grid1D(D)); // v in-place
			}
			// clés WKV : kk L2/tête, kmod, ±
			const kmod = this.storage(D * 4), negkk = this.storage(D * 4), kka = this.storage(D * 4);
			{ const p = this.uniform([NH, H]); this.recordPass(enc, 'rwkv_kprep', [p, k, av, w.kk, w.ka, kmod, negkk, kka], this.grid1D(NH)); trash.push(p, kmod, negkk, kka); }
			// récurrence WKV (état S in-place)
			const y = this.storage(D * 4);
			{ const p = this.uniform([NH, H]); this.recordPass(enc, 'rwkv_wkv7', [p, r, wd, kmod, v, negkk, kka, st.S, y], this.grid1D(NH * H)); trash.push(p, y); }
			// GroupNorm/tête + bonus r·k, puis gate g, puis projection de sortie
			const gn = this.storage(D * 4);
			{ const p = this.uniform([NH, H], { offset: 8, value: EPS_GN }); this.recordPass(enc, 'rwkv_out_gn', [p, y, r, kmod, w.rk, v, w.lnWB, gn], this.grid1D(NH)); trash.push(p, gn); }
			const og = this.recBinary(enc, trash, 'mul', gn, g, D);
			const tmOut = this.recMM(enc, trash, og, w.O, 1, D, D, false);
			x = this.recBinary(enc, trash, 'add', x, tmOut, D);
			// ── channel-mix ──
			const h2 = this.recLayernorm(enc, trash, x, w.attnNorm2W, w.attnNorm2B, 1, D, EPS_LN);
			const xk2 = this.storage(D * 4);
			{ this.recordPass(enc, 'rwkv_lerp', [h2, st.cm, w.lerpK, xk2], this.grid1D(D)); trash.push(xk2); }
			enc.copyBufferToBuffer(h2, 0, st.cm, 0, D * 4);
			const kc = this.recUnary(enc, trash, 'sqrelu', this.recMM(enc, trash, xk2, w.cmK, 1, D, w.ffn, false), w.ffn);
			const cmOut = this.recMM(enc, trash, kc, w.cmV, 1, w.ffn, D, false);
			x = this.recBinary(enc, trash, 'add', x, cmOut, D);
		}
		return x;
	}

	// Enregistre le stack pour T tokens : embed LN par token, boucle recRwkvToken. Retourne le buffer
	// [D] du dernier token APRÈS la norme finale (output_norm) — prêt pour la tête.
	private recordRwkv(enc: GPUAny, trash: GPUAny[], embeds: Float32Array, T: number, cfg: RwkvCfg, layers: RwkvLayerGpu[], norms: RwkvNorms): GPUAny {
		const { D, H, NH } = cfg;
		for (let L = 0; L < layers.length; L++) this.ensureRwkvState(L, D, NH, H);
		if (!this.rwkvVFirst) this.rwkvVFirst = this.storage(D * 4);
		let last: GPUAny = null;
		for (let t = 0; t < T; t++) {
			const e = this.storage(D * 4);
			this.device.queue.writeBuffer(e, 0, embeds.subarray(t * D, (t + 1) * D));
			trash.push(e);
			const x0 = this.recLayernorm(enc, trash, e, norms.tokW, norms.tokB, 1, D, 1e-5);
			const xN = this.recRwkvToken(enc, trash, x0, cfg, layers, this.rwkvVFirst);
			if (t === T - 1) last = this.recLayernorm(enc, trash, xN, norms.outW, norms.outB, 1, D, 1e-5);
		}
		return last;
	}

	// Prefill pur : avance l'état de T tokens, une soumission, pas de readback (tranches non finales).
	async rwkvPrefillGpu(embeds: Float32Array, T: number, cfg: RwkvCfg, layers: RwkvLayerGpu[], norms: RwkvNorms, pastLen: number, sessionId: string): Promise<void> {
		this.rwkvSessionReset(sessionId, pastLen);
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		this.recordRwkv(enc, trash, embeds, T, cfg, layers, norms);
		this.device.queue.submit([enc.finish()]);
		await this.device.queue.onSubmittedWorkDone();
		this.release(trash);
	}

	// Logits complets du dernier token (classify / bench). UN submit, UN readback.
	async rwkvLogitsGpu(embeds: Float32Array, T: number, cfg: RwkvCfg, layers: RwkvLayerGpu[], head: GPUAny, norms: RwkvNorms, pastLen: number, sessionId: string): Promise<Float32Array> {
		const G = globalThis as any;
		this.rwkvSessionReset(sessionId, pastLen);
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		const last = this.recordRwkv(enc, trash, embeds, T, cfg, layers, norms);
		const logits = this.recMM(enc, trash, last, head, 1, cfg.D, cfg.vocab, false);
		const read = this.device.createBuffer({ size: cfg.vocab * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(logits, 0, read, 0, cfg.vocab * 4);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const out = new Float32Array(read.getMappedRange().slice(0));
		read.unmap(); read.destroy(); this.release(trash);
		return out;
	}

	// Top-K GPU du dernier token (chat) : tête + pénalité + top_k, UN readback (~512 o). Miroir lfm2TopKGpu.
	async rwkvTopKGpu(embeds: Float32Array, T: number, cfg: RwkvCfg, layers: RwkvLayerGpu[], head: GPUAny, norms: RwkvNorms, pastLen: number, sessionId: string, recent: number[], penalty: number, K = 64): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		const G = globalThis as any;
		this.rwkvSessionReset(sessionId, pastLen);
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		const last = this.recordRwkv(enc, trash, embeds, T, cfg, layers, norms);
		const logits = this.recMM(enc, trash, last, head, 1, cfg.D, cfg.vocab, false);
		if (penalty && penalty !== 1 && recent.length) {
			const ids = Uint32Array.from(recent);
			const idsBuf = this.bufU32(ids, G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST);
			const p = this.uniform([ids.length], { offset: 4, value: penalty });
			this.recordPass(enc, 'penalize_logits', [p, idsBuf, logits], this.grid1D(ids.length));
			trash.push(p, idsBuf);
		}
		const out = this.storage(K * 2 * 4);
		trash.push(out);
		{ const p = this.uniform([cfg.vocab, K]); this.recordPass(enc, 'top_k', [p, logits, out], [1, 1, 1]); trash.push(p); }
		const read = this.device.createBuffer({ size: K * 2 * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(out, 0, read, 0, K * 2 * 4);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const raw = new Uint32Array(read.getMappedRange().slice(0));
		read.unmap(); read.destroy(); this.release(trash);
		return { ids: raw.slice(0, K), vals: new Float32Array(raw.buffer, K * 4, K) };
	}

	// GPU greedy logit projection + argmax. Given the last hidden state and the cached projection
	// tiles ([n_vocab tile] each), it matmuls every tile into one logits buffer and reduces to the
	// winning token id ON the GPU — so only ONE u32 is read back per token (vs the whole ~152k
	// logits vector). One submit per call. wF16 picks the f16 matmul when the tiles are f16.
	async argmaxProjection(hidden: Float32Array, tiles: { buf: GPUAny; rows: number; r0: number }[], d: number, vocab: number, wF16 = false): Promise<number> {
		const G = globalThis as any;
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		const hBuf = this.storage(hidden.byteLength);
		this.device.queue.writeBuffer(hBuf, 0, hidden);
		trash.push(hBuf);
		const logits = this.storage(vocab * 4);
		trash.push(logits);
		for (const t of tiles) {
			const tileLogits = this.recMatmulT(enc, trash, hBuf, t.buf, 1, d, t.rows, wF16);
			enc.copyBufferToBuffer(tileLogits, 0, logits, t.r0 * 4, t.rows * 4);
		}
		const idx = this.storage(4); // u32 winner
		const p = this.uniform([vocab]);
		trash.push(idx, p);
		this.recordPass(enc, 'argmax', [p, logits, idx], [1, 1, 1]);
		// read back the single u32 index
		const read = this.device.createBuffer({ size: 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(idx, 0, read, 0, 4);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const bestIdx = new Uint32Array(read.getMappedRange().slice(0))[0];
		read.unmap();
		read.destroy();
		this.release(trash); // scratch back to the pool (GPU done after the readback above)
		return bestIdx;
	}

	// Same projection as argmaxProjection, but reads back the FULL logits vector (vocab floats)
	// instead of reducing to the argmax on the GPU. Costs one ~vocab·4-byte readback per token
	// (negligible at decode speed) and lets the caller apply a repetition penalty + sampling on the
	// CPU. Use argmaxProjection when plain greedy is enough (e.g. the benchmark).
	async projectLogits(hidden: Float32Array, tiles: { buf: GPUAny; rows: number; r0: number }[], d: number, vocab: number, wF16 = false): Promise<Float32Array> {
		const G = globalThis as any;
		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		const hBuf = this.storage(hidden.byteLength);
		this.device.queue.writeBuffer(hBuf, 0, hidden);
		trash.push(hBuf);
		const logits = this.storage(vocab * 4);
		trash.push(logits);
		for (const t of tiles) {
			const tileLogits = this.recMatmulT(enc, trash, hBuf, t.buf, 1, d, t.rows, wF16);
			enc.copyBufferToBuffer(tileLogits, 0, logits, t.r0 * 4, t.rows * 4);
		}
		const read = this.device.createBuffer({ size: vocab * 4, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ });
		enc.copyBufferToBuffer(logits, 0, read, 0, vocab * 4);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const out = new Float32Array(read.getMappedRange().slice(0));
		read.unmap();
		read.destroy();
		this.release(trash);
		return out;
	}

	/// Runs each kernel on random inputs and checks it against a CPU reference.
	/// Returns true only if ALL kernels match — the gate for `can_compute`.
	async selfValidate(): Promise<boolean> {
		this.validationFailure = null;
		// Record + log which check failed (returns false so call sites stay `return fail('x')`).
		const fail = (stage: string): false => {
			this.validationFailure = stage;
			console.error('[selfValidate] FAILED at:', stage, '(hasF16=' + this.hasF16 + ')');
			return false;
		};
		const close = (x: Float32Array, y: Float32Array) =>
			x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) < 1e-3);
		const rand = (n: number) => Float32Array.from({ length: n }, () => Math.random() * 2 - 1);

		// matmul 3x4 · 4x5
		const m = 3, k = 4, n = 5;
		const A = rand(m * k), B = rand(k * n);
		const refMM = new Float32Array(m * n);
		for (let r = 0; r < m; r++)
			for (let c = 0; c < n; c++) {
				let s = 0;
				for (let i = 0; i < k; i++) s += A[r * k + i] * B[i * n + c];
				refMM[r * n + c] = s;
			}
		if (!close(await this.matmul(A, B, m, k, n), refMM)) return fail('matmul');

		// matmul_t (y = a · wᵀ, weight stored [n,k] GGUF-style) — the matmul every real model
		// op goes through (transposed=true). Cover BOTH the vec4 path (k%4==0) and the scalar
		// fallback (k%4≠0), including the m=1 decode shape.
		{
			const refT = (a: Float32Array, wt: Float32Array, mm: number, kk: number, nn: number) => {
				const o = new Float32Array(mm * nn);
				for (let r = 0; r < mm; r++)
					for (let c = 0; c < nn; c++) {
						let s = 0;
						for (let i = 0; i < kk; i++) s += a[r * kk + i] * wt[c * kk + i];
						o[r * nn + c] = s;
					}
				return o;
			};
			const checkT = async (mm: number, kk: number, nn: number) => {
				const a = rand(mm * kk), wt = rand(nn * kk);
				return close(await this.matmulT(a, wt, mm, kk, nn), refT(a, wt, mm, kk, nn));
			};
			if (!(await checkT(3, 8, 5))) return fail('matmulT.vec4(3,8,5)');
			if (!(await checkT(1, 16, 7))) return fail('matmulT.vec4(1,16,7)');
			if (!(await checkT(2, 6, 4))) return fail('matmulT.scalar(2,6,4)');

			// f16-weight matmul (BRIK fast path), where supported: weight rounded to f16, dot
			// product accumulated in f32. Error stays within the f16 weight-precision budget.
			if (this.hasF16) {
				const m = 1, k = 16, n = 7;
				const a = rand(m * k), wt = rand(n * k);
				const wBuf = this.uploadGpuF16(wt);
				const got = await this.matmulT(a, wBuf, m, k, n, true);
				const ref = new Float32Array(m * n);
				for (let c = 0; c < n; c++) { let s = 0; for (let i = 0; i < k; i++) s += a[i] * wt[c * k + i]; ref[c] = s; }
				wBuf.destroy?.();
				// f16 weights → relative tolerance (closeRel isn't in scope yet here).
				const tolF16 = (x: Float32Array) => x.length === ref.length && x.every((v, i) => Math.abs(v - ref[i]) <= 3e-2 * (1 + Math.abs(ref[i])));
				if (!tolF16(got)) return fail('matmulT.f16');

				// Same, but the f16 weights are packed ON THE GPU (pack2x16float) from an f32 GPU buffer
				// — the build path that keeps f16 off the main thread. Must match within the f16 budget.
				const wf32 = this.uploadGpu(wt);
				const wGpuPacked = this.f32ToF16Gpu(wf32, n * k);
				const got2 = await this.matmulT(a, wGpuPacked, m, k, n, true);
				wf32.destroy?.(); wGpuPacked.destroy?.();
				if (!tolF16(got2)) return fail('packf16');
			}

			// GEMM f16 TUILÉ (matmul_t_f16w_shared, prefill m ≥ 16) : mêmes sorties que le kernel f16
			// une-ligne-par-thread, exigées sur des formes à BORDS PARTIELS dans m, n ET k. La tuile
			// fait 32 lignes × 64 colonnes, le bloc k vaut 16 (k=48 est un multiple, k=40 non → dernier
			// bloc k incomplet). L'A/B se fait en basculant f16SharedOk, la référence étant le chemin
			// actuel. Gate NON BLOQUANT (motif convTiledOk) : un driver qui le rate repasse
			// f16SharedOk=false — même résultat, juste plus lent. Les deux kernels accumulent en f32
			// sur les MÊMES poids f16 : seul l'ordre de sommation diffère, d'où la tolérance serrée.
			if (this.hasF16 && this.f16SharedOk) {
				const shapes = [
					{ m: 20, k: 128, n: 18 }, // une seule tuile, largement incomplète dans m ET n
					{ m: 32, k: 64, n: 64 },  // tuile pleine exacte
					{ m: 70, k: 40, n: 130 }, // 3×3 tuiles à bords partiels + dernier bloc k incomplet
					{ m: 33, k: 48, n: 7 },   // n ≪ 64 (7 colonnes) : garde d'écriture par colonne
				];
				for (const s of shapes) {
					const a = rand(s.m * s.k), wt = rand(s.n * s.k);
					const wBuf = this.uploadGpuF16(wt);
					const got = await this.matmulT(a, wBuf, s.m, s.k, s.n, true); // → matmul_t_f16w_shared
					this.f16SharedOk = false;
					const ref = await this.matmulT(a, wBuf, s.m, s.k, s.n, true); // → matmul_t_f16w
					this.f16SharedOk = true;
					wBuf.destroy?.();
					const same = got.length === ref.length && got.every((v, i) => Math.abs(v - ref[i]) <= 1e-3 * (1 + Math.abs(ref[i])));
					if (!same) {
						this.f16SharedOk = false;
						console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${s.m}, k=${s.k}, n=${s.n}) — repli sur matmul_t_f16w (plus lent, même résultat).`);
						break;
					}
				}
			}
		}

		// Fused q4web int4 matmul: quantize a random weight to q4, run matmul_t_q4, and check it
		// equals a · dequant(W)ᵀ (the same dequant the CPU codec produces). Gate for 4-bit weights.
		{
			const m = 1, k = 128, n = 6; // k % 32 == 0
			const a = rand(m * k), W = rand(n * k);
			const q = quantizeQ4(W);
			const nibBuf = this.uploadGpuRaw(q.nibbles);
			const scBuf = this.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength));
			const mnBuf = this.uploadGpuRaw(new Uint8Array(q.mins.buffer, q.mins.byteOffset, q.mins.byteLength));
			const got = await this.matmulQ4(a, nibBuf, scBuf, mnBuf, m, k, n);
			const Wd = dequantizeQ4(q);
			const ref = new Float32Array(m * n);
			for (let c = 0; c < n; c++) { let s = 0; for (let i = 0; i < k; i++) s += a[i] * Wd[c * k + i]; ref[c] = s; }
			nibBuf.destroy?.(); scBuf.destroy?.(); mnBuf.destroy?.();
			if (!close(got, ref)) return fail('matmulQ4');

			// GPU-side q4 quantize (quantize_q4): quantize W on the GPU, matmul, compare to the same
			// CPU dequant. Tolerance allows the rare ±1 nibble from GPU vs CPU rounding ties.
			const wf32 = this.uploadGpu(W);
			const qg = this.f32ToQ4Gpu(wf32, n * k);
			const gotG = await this.matmulQ4(a, qg.nib, qg.sc, qg.mn, m, k, n);
			wf32.destroy?.(); qg.nib.destroy?.(); qg.sc.destroy?.(); qg.mn.destroy?.();
			const okG = gotG.length === ref.length && gotG.every((v, i) => Math.abs(v - ref[i]) <= 0.06 * (1 + Math.abs(ref[i])) + 0.02);
			if (!okG) return fail('quantize_q4');
		}

		// Fused q3web int3 matmul: quantize a random weight to q3, run matmul_t_q3, and check it equals
		// a · dequant(W)ᵀ (same dequant the CPU codec produces). Gate for 3-bit weights. m=5 exercises
		// the row guards (the one q3 kernel serves both decode and prefill).
		{
			const m = 5, k = 128, n = 6; // k % 32 == 0
			const a = rand(m * k), W = rand(n * k);
			const q = quantizeQ3(W);
			const loBuf = this.uploadGpuRaw(new Uint8Array(q.lo.buffer, q.lo.byteOffset, q.lo.byteLength));
			const hiBuf = this.uploadGpuRaw(new Uint8Array(q.hi.buffer, q.hi.byteOffset, q.hi.byteLength));
			const scBuf = this.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength));
			const mnBuf = this.uploadGpuRaw(new Uint8Array(q.mins.buffer, q.mins.byteOffset, q.mins.byteLength));
			const got = await this.matmulQ3(a, loBuf, hiBuf, scBuf, mnBuf, m, k, n);
			const Wd = dequantizeQ3(q);
			const ref = new Float32Array(m * n);
			for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) { let s = 0; for (let i = 0; i < k; i++) s += a[r * k + i] * Wd[c * k + i]; ref[r * n + c] = s; }
			loBuf.destroy?.(); hiBuf.destroy?.(); scBuf.destroy?.(); mnBuf.destroy?.();
			if (!close(got, ref)) return fail('matmulQ3');
		}

		// Prefill q4 matmul (matmul_t_q4_tiled): 4 token rows per invocation; m=5 (full tile + 1-row
		// tail) exercises the row guards. Must equal the reference a · dequant(W) like the 1-row kernel.
		{
			const m = 5, k = 128, n = 6;
			const a = rand(m * k), W = rand(n * k);
			const q = quantizeQ4(W);
			const nibBuf = this.uploadGpuRaw(q.nibbles);
			const scBuf = this.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength));
			const mnBuf = this.uploadGpuRaw(new Uint8Array(q.mins.buffer, q.mins.byteOffset, q.mins.byteLength));
			const got = await this.matmulQ4Tiled(a, nibBuf, scBuf, mnBuf, m, k, n);
			const Wd = dequantizeQ4(q);
			const ref = new Float32Array(m * n);
			for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) { let s = 0; for (let i = 0; i < k; i++) s += a[r * k + i] * Wd[c * k + i]; ref[r * n + c] = s; }
			nibBuf.destroy?.(); scBuf.destroy?.(); mnBuf.destroy?.();
			if (!close(got, ref)) return fail('matmul_q4_tiled');
		}

		// GEMM q4 tuilé + bloqué en registres (matmul_t_q4_shared, tuile 32 lignes × 64 colonnes).
		// Trois formes : tuile largement incomplète (20×18), tuile pleine exacte (32×64), et 3×3 tuiles
		// à bords partiels des deux côtés (70×130) — c'est là que vivent les gardes d'écriture des
		// 8 accumulateurs. (k reste multiple de 32 = le groupe de quantification, donc jamais de bloc
		// k partiel.) Doit égaler a · dequant(W) exactement comme le kernel 1 ligne.
		for (const s of [{ m: 20, n: 18 }, { m: 32, n: 64 }, { m: 70, n: 130 }]) {
			const m = s.m, k = 128, n = s.n;
			const a = rand(m * k), W = rand(n * k);
			const q = quantizeQ4(W);
			const nibBuf = this.uploadGpuRaw(q.nibbles);
			const scBuf = this.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength));
			const mnBuf = this.uploadGpuRaw(new Uint8Array(q.mins.buffer, q.mins.byteOffset, q.mins.byteLength));
			const got = await this.matmulQ4Shared(a, nibBuf, scBuf, mnBuf, m, k, n);
			const Wd = dequantizeQ4(q);
			const ref = new Float32Array(m * n);
			for (let r = 0; r < m; r++) for (let cc = 0; cc < n; cc++) { let s2 = 0; for (let i = 0; i < k; i++) s2 += a[r * k + i] * Wd[cc * k + i]; ref[r * n + cc] = s2; }
			nibBuf.destroy?.(); scBuf.destroy?.(); mnBuf.destroy?.();
			if (!close(got, ref)) return fail(`matmul_q4_shared(${m},${n})`);
		}

		// Fused q8web int8 matmul: quantize a random weight to q8, run matmul_t_q8, and check it
		// equals a · dequant(W)ᵀ (the same dequant the CPU codec produces). Gate for the 8-bit tier.
		{
			const m = 1, k = 128, n = 6; // k % 32 == 0
			const a = rand(m * k), W = rand(n * k);
			const q = quantizeQ8(W);
			const codesBuf = this.uploadGpuRaw(new Uint8Array(q.codes.buffer, q.codes.byteOffset, q.codes.byteLength));
			const scBuf = this.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength));
			const got = await this.matmulQ8(a, codesBuf, scBuf, m, k, n);
			const Wd = dequantizeQ8(q);
			const ref = new Float32Array(m * n);
			for (let c = 0; c < n; c++) { let s = 0; for (let i = 0; i < k; i++) s += a[i] * Wd[c * k + i]; ref[c] = s; }
			codesBuf.destroy?.(); scBuf.destroy?.();
			if (!close(got, ref)) return fail('matmulQ8');

			// GPU-side q8 quantize (quantize_q8): quantize W on the GPU, then matmul, and check it
			// matches a · dequant(CPU-quantize(W))ᵀ. Gates the no-CPU-loop quantization path.
			const wf32 = this.uploadGpu(W);
			const qg = this.f32ToQ8Gpu(wf32, n * k);
			const gotG = await this.matmulQ8(a, qg.codes, qg.sc, m, k, n);
			wf32.destroy?.(); qg.codes.destroy?.(); qg.sc.destroy?.();
			if (!close(gotG, ref)) return fail('quantize_q8');
		}

		// Prefill q8 matmul (matmul_t_q8_tiled): 4 token rows per invocation. m=5 (a full 4-row tile +
		// a 1-row partial tail) exercises the row guards; must equal the reference a · dequant(W).
		// Gates the prefill fast path (recMatmulQ8 uses the tiled kernel for m >= 2).
		{
			const m = 5, k = 128, n = 6;
			const a = rand(m * k), W = rand(n * k);
			const q = quantizeQ8(W);
			const codesBuf = this.uploadGpuRaw(new Uint8Array(q.codes.buffer, q.codes.byteOffset, q.codes.byteLength));
			const scBuf = this.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength));
			const got = await this.matmulQ8Tiled(a, codesBuf, scBuf, m, k, n);
			const Wd = dequantizeQ8(q);
			const ref = new Float32Array(m * n);
			for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) { let s = 0; for (let i = 0; i < k; i++) s += a[r * k + i] * Wd[c * k + i]; ref[r * n + c] = s; }
			codesBuf.destroy?.(); scBuf.destroy?.();
			if (!close(got, ref)) return fail('matmul_q8_tiled');
		}

		// GEMV du DÉCODAGE (matmul_t_q4_vec / matmul_t_q8_vec, m = 1) : mêmes sorties que les kernels
		// par lignes, exigées sur trois largeurs — n petit (une seule colonne de workgroups), n non
		// multiple de la taille de workgroup, et un k long (plusieurs tours de la foulée de 64 groupes).
		// C'est le kernel du chemin CHAUD (un token = tous les poids relus) : une erreur ici passerait
		// inaperçue en vitesse et corrompt chaque réponse.
		for (const sh of [{ k: 128, n: 6 }, { k: 128, n: 130 }, { k: 4096, n: 17 }]) {
			const k = sh.k, n = sh.n;
			const a = rand(k), W = rand(n * k);
			const q4 = quantizeQ4(W);
			const nibBuf = this.uploadGpuRaw(q4.nibbles);
			const sc4 = this.uploadGpuRaw(new Uint8Array(q4.scales.buffer, q4.scales.byteOffset, q4.scales.byteLength));
			const mn4 = this.uploadGpuRaw(new Uint8Array(q4.mins.buffer, q4.mins.byteOffset, q4.mins.byteLength));
			const got4 = await this.matmulQ4Vec(a, nibBuf, sc4, mn4, k, n);
			const W4 = dequantizeQ4(q4);
			const ref4 = new Float32Array(n);
			for (let c = 0; c < n; c++) { let acc = 0; for (let i = 0; i < k; i++) acc += a[i] * W4[c * k + i]; ref4[c] = acc; }
			nibBuf.destroy?.(); sc4.destroy?.(); mn4.destroy?.();
			if (!close(got4, ref4)) return fail(`matmul_q4_vec(${k},${n})`);

			const q8 = quantizeQ8(W);
			const codesBuf = this.uploadGpuRaw(new Uint8Array(q8.codes.buffer, q8.codes.byteOffset, q8.codes.byteLength));
			const sc8 = this.uploadGpuRaw(new Uint8Array(q8.scales.buffer, q8.scales.byteOffset, q8.scales.byteLength));
			const got8 = await this.matmulQ8Vec(a, codesBuf, sc8, k, n);
			const W8 = dequantizeQ8(q8);
			const ref8 = new Float32Array(n);
			for (let c = 0; c < n; c++) { let acc = 0; for (let i = 0; i < k; i++) acc += a[i] * W8[c * k + i]; ref8[c] = acc; }
			codesBuf.destroy?.(); sc8.destroy?.();
			if (!close(got8, ref8)) return fail(`matmul_q8_vec(${k},${n})`);
		}

		// GEMM q8 tuilé + bloqué en registres (matmul_t_q8_shared) : mêmes trois formes que le q4 —
		// tuile 32×64 incomplète, pleine, puis 3×3 tuiles à bords partiels des deux côtés. Exerce les
		// gardes de bord et les deux barrières. (k multiple de 32 = le groupe de quant → jamais de bloc
		// k partiel.) Doit égaler a · dequant(W) comme le kernel 1 ligne.
		for (const sh of [{ m: 20, n: 18 }, { m: 32, n: 64 }, { m: 70, n: 130 }]) {
			const m = sh.m, k = 128, n = sh.n;
			const a = rand(m * k), W = rand(n * k);
			const q = quantizeQ8(W);
			const codesBuf = this.uploadGpuRaw(new Uint8Array(q.codes.buffer, q.codes.byteOffset, q.codes.byteLength));
			const scBuf = this.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength));
			const got = await this.matmulQ8Shared(a, codesBuf, scBuf, m, k, n);
			const Wd = dequantizeQ8(q);
			const ref = new Float32Array(m * n);
			for (let r = 0; r < m; r++) for (let cc = 0; cc < n; cc++) { let s = 0; for (let i = 0; i < k; i++) s += a[r * k + i] * Wd[cc * k + i]; ref[r * n + cc] = s; }
			codesBuf.destroy?.(); scBuf.destroy?.();
			if (!close(got, ref)) return fail(`matmul_q8_shared(${m},${n})`);
		}

		// Chunked GGUF→BRIK conversion must byte-match the single-pass path. This guards the chunk
		// loop's offset math — what keeps large tensors (token_embd ~1 GB in f32) from silently
		// corrupting against the storage-buffer-binding cap (the GGUF→BRIK "token salad" bug). Force
		// many small chunks on a tiny tensor with a partial tail.
		{
			const cn = 32 * 51; // 1632 elems, 51 groups; chunk of 256 → 7 chunks (last partial)
			const cw = rand(cn);
			const cb = new Uint8Array(cw.buffer, cw.byteOffset, cw.byteLength);
			const eqBytes = (x: Uint8Array, y: Uint8Array) => x.length === y.length && x.every((v, i) => v === y[i]);
			if (!eqBytes(await this.quantizeToBytes('F32', cb, cn, 'q8'), await this.quantizeToBytes('F32', cb, cn, 'q8', 256))) return fail('quantize_chunk_q8');
			if (!eqBytes(await this.quantizeToBytes('F32', cb, cn, 'q4'), await this.quantizeToBytes('F32', cb, cn, 'q4', 256))) return fail('quantize_chunk_q4');
		}

		// rmsnorm 2 rows, dim 8
		const rows = 2, dim = 8;
		const X = rand(rows * dim), W = rand(dim);
		const refRN = new Float32Array(rows * dim);
		for (let r = 0; r < rows; r++) {
			let ss = 0;
			for (let i = 0; i < dim; i++) ss += X[r * dim + i] ** 2;
			const inv = 1 / Math.sqrt(ss / dim + 1e-5);
			for (let i = 0; i < dim; i++) refRN[r * dim + i] = X[r * dim + i] * inv * W[i];
		}
		if (!close(await this.rmsnorm(X, W, rows, dim), refRN)) return fail('rmsnorm');
		// RMSNorm with Gemma's (1+w) gain convention.
		if (!close(await this.rmsnorm(X, W, rows, dim, 1e-5, true), rmsnormCpu(X, W, rows, dim, 1e-5, true))) return fail('rmsnorm.onePlus');

		// swiglu + add over 16 elems
		const g = rand(16), u = rand(16);
		const refSG = g.map((v, i) => (v / (1 + Math.exp(-v))) * u[i]);
		if (!close(await this.swiglu(g, u), refSG)) return fail('swiglu');
		// GeGLU (Gemma2 tanh-GELU gate).
		const refGG = g.map((v, i) => geluTanh(v) * u[i]);
		if (!close(await this.geglu(g, u), refGG)) return fail('geglu');
		const refAdd = g.map((v, i) => v + u[i]);
		if (!close(await this.add(g, u), refAdd)) return fail('add');

		// Large 1-D dispatch: a buffer just past one dimension's 65535-workgroup cap, forcing grid1D
		// into a 2-D workgroup grid. Gates the flat-index reconstruction the wide element-wise kernels
		// use — the fix for long prompts (where seq×ffn overflows a single dispatch dimension and the
		// whole submit was silently rejected → garbage logits). Only the boundary indices are probed
		// (comparing all ~4.2M would be wasteful); they're the ones the 2-D math must land on exactly.
		{
			const big = WebGpuEngine.MAX_WG_DIM * WG + 257; // just over the single-dimension cap
			const a = new Float32Array(big);
			const b = new Float32Array(big);
			const probes = [0, 1, WG - 1, WG, WebGpuEngine.MAX_WG_DIM * WG - 1, WebGpuEngine.MAX_WG_DIM * WG, big - 1];
			for (const p of probes) { a[p] = (p % 7) - 3; b[p] = (p % 5) - 2; }
			const out = await this.add(a, b);
			let ok = out.length === big;
			for (const p of probes) if (Math.abs(out[p] - (a[p] + b[p])) > 1e-5) ok = false;
			if (!ok) return fail('grid1D.add(2D)');
		}

		// Relative tolerance for the deeper kernels / chained matmuls (error accumulates).
		const closeRel = (x: Float32Array, y: Float32Array, tol = 3e-3) =>
			x.length === y.length && x.every((val, i) => Math.abs(val - y[i]) <= tol * (1 + Math.abs(y[i])));

		// RoPE: 1 token, 2 heads, headDim 4, pastLen 1 (so positions = 1).
		{
			const nHeads = 2, headDim = 4, rows = 1 * nHeads, pastLen = 1, base = 10000;
			const xr = rand(rows * headDim);
			if (!closeRel(await this.rope(xr, rows, headDim, nHeads, pastLen, base), ropeCpu(xr, rows, headDim, nHeads, pastLen, base))) return fail('rope');
		}

		// RoPE à facteurs (llama3/YaRN/LongRoPE) : ff=1 partout ≡ rope standard, puis facteurs
		// distincts vs référence CPU (formes réelles Llama 3.2 1B : headDim 64, base 500000).
		{
			const nHeads = 2, headDim = 64, rows = 3 * nHeads, pastLen = 7, base = 500000;
			const xr = rand(rows * headDim);
			const ones = new Float32Array(headDim / 2).fill(1);
			if (!closeRel(await this.ropeFactors(xr, ones, rows, headDim, nHeads, pastLen, base), ropeCpu(xr, rows, headDim, nHeads, pastLen, base))) return fail('rope_factors.ones');
			const ff = Float32Array.from({ length: headDim / 2 }, (_, i) => 1 + (i % 5) * 0.7);
			if (!closeRel(await this.ropeFactors(xr, ff, rows, headDim, nHeads, pastLen, base), ropeFactorsCpu(xr, ff, rows, headDim, nHeads, pastLen, base))) return fail('rope_factors');
		}

		// RoPE à paires ADJACENTES (ggml NORM : llama, mistral, smollm3) — la convention qui manquait
		// et qui obligeait à réécrire les lignes de Q/K au chargement. Trois propriétés :
		//  (1) sortie = référence CPU interleaved, sur les formes réelles de Llama 3.2 1B (headDim 64,
		//      base 500000) ET une forme minuscule (headDim 4) où l'appariement se vérifie à la main ;
		//  (2) à la position 0, RoPE est l'IDENTITÉ dans les DEUX conventions (angles nuls) — invariant
		//      qui attrape une inversion d'indices sans dépendre d'une référence ;
		//  (3) une PERMUTATION des composantes relie les deux conventions : tourner en interleaved des
		//      données permutées donne le même résultat que tourner en rotate_half les données
		//      d'origine, puis permuter. C'est exactement ce que faisait la dé-permutation des poids,
		//      donc ce test prouve que le nouveau kernel remplace bien l'ancien contournement.
		{
			const nHeads = 2, headDim = 64, rows = 3 * nHeads, pastLen = 7, base = 500000;
			const xr = rand(rows * headDim);
			if (!closeRel(await this.rope(xr, rows, headDim, nHeads, pastLen, base, true), ropeInterleavedCpu(xr, rows, headDim, nHeads, pastLen, base))) return fail('rope.interleaved');
			const small = rand(2 * 4);
			if (!closeRel(await this.rope(small, 2, 4, 2, 3, 10000, true), ropeInterleavedCpu(small, 2, 4, 2, 3, 10000))) return fail('rope.interleaved.hd4');
			// (2) position 0 : identité dans les deux conventions.
			const z = rand(rows * headDim);
			if (!closeRel(await this.rope(z, rows, headDim, nHeads, 0, base, true), ropeInterleavedCpu(z, rows, headDim, nHeads, 0, base))) return fail('rope.interleaved.pos0');
			// (3) équivalence par permutation des composantes (i, i+half) ↔ (2i, 2i+1).
			const half = headDim / 2;
			const perm = new Float32Array(rows * headDim);
			for (let r = 0; r < rows; r++) for (let i = 0; i < half; i++) {
				perm[r * headDim + 2 * i] = xr[r * headDim + i];
				perm[r * headDim + 2 * i + 1] = xr[r * headDim + i + half];
			}
			const gotInter = await this.rope(perm, rows, headDim, nHeads, pastLen, base, true);
			const gotHalf = await this.rope(xr, rows, headDim, nHeads, pastLen, base, false);
			const halfPermuted = new Float32Array(rows * headDim);
			for (let r = 0; r < rows; r++) for (let i = 0; i < half; i++) {
				halfPermuted[r * headDim + 2 * i] = gotHalf[r * headDim + i];
				halfPermuted[r * headDim + 2 * i + 1] = gotHalf[r * headDim + i + half];
			}
			if (!closeRel(gotInter, halfPermuted)) return fail('rope.interleaved.equivalence');
			// Et la variante à facteurs partage le même appariement.
			const ff = Float32Array.from({ length: half }, (_, i) => 1 + (i % 5) * 0.7);
			if (!closeRel(await this.ropeFactors(xr, ff, rows, headDim, nHeads, pastLen, base, true), ropeInterleavedCpu(xr, rows, headDim, nHeads, pastLen, base, ff))) return fail('rope_factors.interleaved');
		}

		// M-RoPE (qwen2vl) — gate NON BLOQUANT (le kernel n'est dispatché que pour l'arch qwen2vl :
		// un échec coupe la vision via mropeOk=false, jamais le chat texte). Deux propriétés :
		// (1) positions dégénérées t=h=w=pos ⇒ IDENTIQUE au RoPE 1D (l'invariant clé du gating) ;
		// (2) positions 3D distinctes vs référence CPU, aux tailles réelles 2B (headDim 128, [16,24,24]).
		{
			const nHeads = 2, headDim = 128, sections = [16, 24, 24], base = 1000000;
			const seq = 3, rows = seq * nHeads, pastLen = 5;
			const xr = rand(rows * headDim);
			const degenerate = new Uint32Array(seq * 3);
			for (let t = 0; t < seq; t++) { const p = pastLen + t; degenerate.set([p, p, p], t * 3); }
			const distinct = new Uint32Array([5, 5, 5, 5, 6, 9, 5, 7, 5]);
			const ok1 = closeRel(await this.ropeMrope(xr, degenerate, rows, headDim, nHeads, sections, base), ropeCpu(xr, rows, headDim, nHeads, pastLen, base));
			const ok2 = closeRel(await this.ropeMrope(xr, distinct, rows, headDim, nHeads, sections, base), mropeCpu(xr, distinct, rows, headDim, nHeads, sections, base));
			if (!ok1 || !ok2) {
				this.mropeOk = false;
				console.error(`[selfValidate] rope_mrope KO sur ce GPU (${!ok1 ? 'dégénéré≠rope' : 'positions 3D'}) — vision désactivée, chat texte intact.`);
			}
		}

		// Attention with KV cache + GQA: 2 new tokens, 4 q-heads / 2 kv-heads, headDim 4, pastLen 2.
		{
			const nTokens = 2, nHeads = 4, nKvHeads = 2, headDim = 4, pastLen = 2, kvLen = pastLen + nTokens;
			const q = rand(nTokens * nHeads * headDim);
			const k = rand(kvLen * nKvHeads * headDim);
			const v = rand(kvLen * nKvHeads * headDim);
			if (!closeRel(await this.attention(q, k, v, nTokens, nHeads, nKvHeads, headDim, pastLen), attentionCpu(q, k, v, nTokens, nHeads, nKvHeads, headDim, pastLen))) return fail('attention');
			// Gemma2 attention: custom scale + tanh logit softcap.
			const sc = 0.3, cap = 5.0;
			if (!closeRel(
				await this.attention(q, k, v, nTokens, nHeads, nKvHeads, headDim, pastLen, sc, cap),
				attentionCpu(q, k, v, nTokens, nHeads, nKvHeads, headDim, pastLen, sc, cap)
			)) return fail('attention.softcap');
			// Sliding window (Gemma 3) : sur une forme plus longue, chaque fenêtre testée contre la
			// réf CPU — dont window ≥ contexte (doit redonner EXACTEMENT l'attention pleine) et
			// window = 1 (chaque requête ne voit qu'elle-même). Les deux familles de kernels sont
			// couvertes : `attention` (prefill, thread par tête) et `attention_decode` (workgroup).
			{
				const nT = 3, nH = 2, nKv = 1, hd = 4, past = 9, kvL = past + nT;
				const qw = rand(nT * nH * hd), kw = rand(kvL * nKv * hd), vw = rand(kvL * nKv * hd);
				for (const win of [1, 4, 8, 64]) {
					if (!closeRel(
						await this.attention(qw, kw, vw, nT, nH, nKv, hd, past, undefined, 0, win),
						attentionCpu(qw, kw, vw, nT, nH, nKv, hd, past, undefined, 0, win),
					)) return fail(`attention.window(${win})`);
					if (!closeRel(
						await this.attentionDecode(qw, kw, vw, nT, nH, nKv, hd, past, undefined, 0, win),
						attentionCpu(qw, kw, vw, nT, nH, nKv, hd, past, undefined, 0, win),
					)) return fail(`attention_decode.window(${win})`);
				}
			}

			// q8 KV cache: quantize K/V to int8 (+ per-(row,head) scale), run attention_q8kv, and check
			// it matches the trusted f32 attention over the SAME codes dequantized — gates quantize_kv
			// + attention_q8kv together (the int8-context path). Also bound the int8 round-trip error.
			{
				const kq = await this.quantizeKvReadback(k, kvLen, nKvHeads, headDim);
				const vq = await this.quantizeKvReadback(v, kvLen, nKvHeads, headDim);
				const got = await this.attentionQ8Kv(q, kq.codes, kq.scales, vq.codes, vq.scales, nTokens, nHeads, nKvHeads, headDim, pastLen);
				const deq = (codes: Uint32Array, scales: Float32Array) => {
					const out = new Float32Array(kvLen * nKvHeads * headDim);
					for (let row = 0; row < kvLen; row++) for (let head = 0; head < nKvHeads; head++) {
						const s = scales[row * nKvHeads + head];
						for (let dd = 0; dd < headDim; dd++) {
							const e = row * nKvHeads * headDim + head * headDim + dd;
							const byte = (codes[e >> 2] >> ((e & 3) * 8)) & 0xff;
							out[e] = (byte < 128 ? byte : byte - 256) * s;
						}
					}
					return out;
				};
				const kDeq = deq(kq.codes, kq.scales), vDeq = deq(vq.codes, vq.scales);
				const ref = attentionCpu(q, kDeq, vDeq, nTokens, nHeads, nKvHeads, headDim, pastLen);
				if (!closeRel(got, ref, 5e-3)) return fail('attention.q8kv');
				let maxAbs = 0; for (let i = 0; i < k.length; i++) maxAbs = Math.max(maxAbs, Math.abs(kDeq[i] - k[i]));
				if (maxAbs > 0.05) return fail('quantize_kv.error');
			}
		}

		// Attention « décodage » (workgroup par (token, tête), softmax en ligne, tuiles de 64) —
		// le chemin chaud du chat. Gates NON BLOQUANTS (comme top_k) : un driver qui les rate
		// bascule attnDecodeOk=false → repli silencieux sur les kernels thread-par-tête, corrects
		// partout — jamais un modèle refusé pour ça. Formes : la forme RÉELLE Qwen 0.5B (14 têtes /
		// 2 KV = ratio GQA 7, headDim 64), en décodage pur (nT=1, contexte long) ET en prefill
		// multi-tokens avec pastLen (nT=10 — le chemin « préfixe KV réutilisé » qui a produit du
		// charabia sur mobile alors que les petits gates passaient) ; tuile partielle (pastLen non
		// multiple de 64) ; softcap Gemma2 ; headDim 128 ; variante q8 sur les MÊMES codes que le
		// kernel classique (validé contre le CPU juste au-dessus).
		{
			const failSoft = (stage: string): void => {
				this.attnDecodeOk = false;
				console.error('[selfValidate] attention décodage HS sur ce GPU (étape :', stage, ') → repli kernels classiques (plus lents à contexte long, corrects)');
			};
			const decodeCases = [
				{ nT: 1, nH: 14, nKv: 2, hd: 64, past: 300 },
				{ nT: 10, nH: 14, nKv: 2, hd: 64, past: 173 },
			];
			for (const c of decodeCases) {
				if (!this.attnDecodeOk) break;
				const kvLen = c.past + c.nT;
				const q = rand(c.nT * c.nH * c.hd);
				const k = rand(kvLen * c.nKv * c.hd);
				const v = rand(kvLen * c.nKv * c.hd);
				if (!closeRel(await this.attentionDecode(q, k, v, c.nT, c.nH, c.nKv, c.hd, c.past),
					attentionCpu(q, k, v, c.nT, c.nH, c.nKv, c.hd, c.past))) { failSoft(`decode(nT=${c.nT})`); break; }
				const kq = await this.quantizeKvReadback(k, kvLen, c.nKv, c.hd);
				const vq = await this.quantizeKvReadback(v, kvLen, c.nKv, c.hd);
				const got = await this.attentionQ8KvDecode(q, kq.codes, kq.scales, vq.codes, vq.scales, c.nT, c.nH, c.nKv, c.hd, c.past);
				const ref = await this.attentionQ8Kv(q, kq.codes, kq.scales, vq.codes, vq.scales, c.nT, c.nH, c.nKv, c.hd, c.past);
				if (!closeRel(got, ref, 5e-3)) { failSoft(`decode.q8kv(nT=${c.nT})`); break; }
			}
			if (this.attnDecodeOk) {
				const nT = 2, nH = 4, nKv = 2, hd = 8, past = 173;
				const q = rand(nT * nH * hd), k = rand((past + nT) * nKv * hd), v = rand((past + nT) * nKv * hd);
				if (!closeRel(await this.attentionDecode(q, k, v, nT, nH, nKv, hd, past, 0.3, 5.0),
					attentionCpu(q, k, v, nT, nH, nKv, hd, past, 0.3, 5.0))) failSoft('decode.softcap');
			}
			if (this.attnDecodeOk) {
				const nT = 1, nH = 2, nKv = 1, hd = 128, past = 70;
				const q = rand(nT * nH * hd), k = rand((past + nT) * nKv * hd), v = rand((past + nT) * nKv * hd);
				if (!closeRel(await this.attentionDecode(q, k, v, nT, nH, nKv, hd, past),
					attentionCpu(q, k, v, nT, nH, nKv, hd, past))) failSoft('decode.hd128');
			}
		}

		// Full transformer-layer forward (prefill) in a Qwen2-shaped config: GQA (4 q / 2 kv
		// heads), q/k/v biases, RoPE base 10000, eps 1e-6 — the gate for a real swarm contribution.
		{
			const seq = 3, nHeads = 4, nKvHeads = 2, headDim = 4, d = nHeads * headDim, kvDim = nKvHeads * headDim, ffn = 16;
			const cfg: LayerCfg = { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta: 10000, eps: 1e-6 };
			const w: LayerWeights = {
				attnNorm: rand(d), wq: rand(d * d), wk: rand(d * kvDim), wv: rand(d * kvDim), wo: rand(d * d),
				bq: rand(d), bk: rand(kvDim), bv: rand(kvDim),
				ffnNorm: rand(d), wgate: rand(d * ffn), wup: rand(d * ffn), wdown: rand(ffn * d)
			};
			const x = rand(seq * d);
			if (!closeRel(await this.layerForward(x, cfg, w), layerForwardCpu(x, cfg, w), 5e-3)) return fail('layerForward');
		}

		// Gemma2-shaped layer forward: custom attn scale + logit softcap, GELU gate, (1+w) RMSNorm,
		// the sandwich post-attn / post-ffn norms, AND a head dim where nHeads·headDim ≠ d (Gemma2's
		// key_length differs from d/nHeads) — exercises the qDim generalization. Validates the whole
		// arch-portability path against the independent CPU reference.
		{
			const seq = 3, nHeads = 4, nKvHeads = 2, headDim = 4, qDim = nHeads * headDim, d = 12, kvDim = nKvHeads * headDim, ffn = 16;
			const cfg: LayerCfg = {
				seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta: 10000, eps: 1e-6,
				attnScale: 1 / Math.sqrt(headDim), attnLogitSoftcap: 5.0, act: 'gelu', rmsGainOnePlus: true,
			};
			const w: LayerWeights = {
				attnNorm: rand(d), wq: rand(d * qDim), wk: rand(d * kvDim), wv: rand(d * kvDim), wo: rand(qDim * d),
				ffnNorm: rand(d), wgate: rand(d * ffn), wup: rand(d * ffn), wdown: rand(ffn * d),
				postAttnNorm: rand(d), postFfnNorm: rand(d),
			};
			const x = rand(seq * d);
			if (!closeRel(await this.layerForward(x, cfg, w), layerForwardCpu(x, cfg, w), 5e-3)) return fail('layerForward.gemma2');
		}

		// Qwen3-shaped layer forward: QK-Norm (per-head RMSNorm on q/k before RoPE), NO q/k/v biases,
		// and nHeads·headDim ≠ d (Qwen3-4B: d=2560, 32 têtes × headDim 128 → qDim 4096).
		{
			const seq = 3, nHeads = 4, nKvHeads = 2, headDim = 4, qDim = nHeads * headDim, d = 12, kvDim = nKvHeads * headDim, ffn = 16;
			const cfg: LayerCfg = { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta: 1000000, eps: 1e-6 };
			const w: LayerWeights = {
				attnNorm: rand(d), wq: rand(d * qDim), wk: rand(d * kvDim), wv: rand(d * kvDim), wo: rand(qDim * d),
				ffnNorm: rand(d), wgate: rand(d * ffn), wup: rand(d * ffn), wdown: rand(ffn * d),
				qNorm: rand(headDim), kNorm: rand(headDim),
			};
			const x = rand(seq * d);
			if (!closeRel(await this.layerForward(x, cfg, w), layerForwardCpu(x, cfg, w), 5e-3)) return fail('layerForward.qwen3');
		}

		// Q4_K dequantization: build random valid super-blocks (controlled fp16 d/dmin so
		// no inf/nan, random 6-bit scales + 4-bit quants) and check the GPU dequant against
		// the CPU reference that mirrors llama.cpp. This is the gate for streaming real
		// quantized model weights to the browser.
		{
			const nBlocks = 5;
			const bytes = new Uint8Array(nBlocks * 144);
			for (let blk = 0; blk < nBlocks; blk++) {
				const b = blk * 144;
				const dv = new DataView(bytes.buffer);
				dv.setUint16(b, f32ToF16(0.005 + Math.random() * 0.05), true);     // d
				dv.setUint16(b + 2, f32ToF16(0.001 + Math.random() * 0.02), true); // dmin
				for (let i = 4; i < 144; i++) bytes[b + i] = (Math.random() * 256) | 0;
			}
			const got = await this.dequantizeQ4K(bytes, nBlocks * 256);
			if (!closeRel(got, dequantQ4KCpu(bytes, nBlocks), 1e-4)) return fail('dequant.Q4_K');
		}

		// Q8_0 / Q5_0 / Q6_K dequant — the other quant types a real Qwen2 Q4_K_M model
		// uses for its layer tensors (verified via the master's /model/manifest). Each is
		// checked against a CPU reference mirroring llama.cpp.
		{
			const randBytes = (n: number) => { const b = new Uint8Array(n); for (let i = 0; i < n; i++) b[i] = (Math.random() * 256) | 0; return b; };
			const withScale = (b: Uint8Array, blockBytes: number) => {
				// Put a controlled fp16 scale at the block's d-offset so no inf/nan.
				const dv = new DataView(b.buffer);
				const dOff = (blk: number) => blockBytes === 210 ? blk * 210 + 208 : blk * blockBytes; // Q6_K d is last
				for (let blk = 0; blk * blockBytes < b.length; blk++) dv.setUint16(dOff(blk), f32ToF16(0.005 + Math.random() * 0.05), true);
				return b;
			};
			const nb = 4;
			const q8 = withScale(randBytes(nb * 34), 34);
			if (!closeRel(await this.dequantizeByType('Q8_0', q8, nb * 32), dequantQ8_0Cpu(q8, nb), 1e-4)) return fail('dequant.Q8_0');
			const q5 = withScale(randBytes(nb * 22), 22);
			if (!closeRel(await this.dequantizeByType('Q5_0', q5, nb * 32), dequantQ5_0Cpu(q5, nb), 1e-4)) return fail('dequant.Q5_0');
			const q6 = withScale(randBytes(nb * 210), 210);
			if (!closeRel(await this.dequantizeByType('Q6_K', q6, nb * 256), dequantQ6KCpu(q6, nb), 1e-4)) return fail('dequant.Q6_K');

			// Q4_0 (18-byte blocks): controlled f16 d at offset 0.
			const q40 = withScale(randBytes(nb * 18), 18);
			if (!closeRel(await this.dequantizeByType('Q4_0', q40, nb * 32), dequantQ4_0Cpu(q40, nb), 1e-4)) return fail('dequant.Q4_0');

			// Q5_K (176-byte super-blocks): controlled f16 d (offset 0) + dmin (offset 2).
			const q5k = randBytes(nb * 176);
			const dv5 = new DataView(q5k.buffer);
			for (let blk = 0; blk < nb; blk++) {
				dv5.setUint16(blk * 176, f32ToF16(0.005 + Math.random() * 0.05), true);
				dv5.setUint16(blk * 176 + 2, f32ToF16(0.001 + Math.random() * 0.02), true);
			}
			if (!closeRel(await this.dequantizeByType('Q5_K', q5k, nb * 256), dequantQ5_KCpu(q5k, nb), 1e-4)) return fail('dequant.Q5_K');
		}

		// KV cache correctness: a 2-token prefill followed by a 1-token decode (with the
		// cached K/V) must yield the SAME last-token output as a full 3-token prefill.
		{
			const nHeads = 4, nKvHeads = 2, headDim = 4, d = nHeads * headDim, kvDim = nKvHeads * headDim, ffn = 16;
			const base = { d, nHeads, nKvHeads, headDim, ffn, ropeTheta: 10000, eps: 1e-6 };
			const w: LayerWeights = {
				attnNorm: rand(d), wq: rand(d * d), wk: rand(d * kvDim), wv: rand(d * kvDim), wo: rand(d * d),
				bq: rand(d), bk: rand(kvDim), bv: rand(kvDim),
				ffnNorm: rand(d), wgate: rand(d * ffn), wup: rand(d * ffn), wdown: rand(ffn * d)
			};
			const x = rand(3 * d);
			const full = await this.layerForward(x, { ...base, seq: 3 }, w);
			const fullLast = full.slice(2 * d, 3 * d);
			const empty = new Float32Array(0);
			const s1 = await this.layerForwardKV(x.slice(0, 2 * d), { ...base, seq: 2 }, w, 0, empty, empty);
			const s2 = await this.layerForwardKV(x.slice(2 * d, 3 * d), { ...base, seq: 1 }, w, 2, s1.k, s1.v);
			if (!closeRel(s2.out, fullLast, 5e-3)) return fail('layerForwardKV');
		}

		// GPU logit projection + argmax: matmul a tiny projection then reduce to the winning index
		// on the GPU. Must equal the CPU argmax — the gate for reading back only the token id.
		{
			const dd = 4, vocab = 10;
			const hidden = rand(dd);
			const w = rand(vocab * dd); // [vocab, dd] row-major; matmulT computes hidden·wᵀ
			const ref = new Float32Array(vocab);
			for (let j = 0; j < vocab; j++) { let s = 0; for (let i = 0; i < dd; i++) s += hidden[i] * w[j * dd + i]; ref[j] = s; }
			let cpuBest = 0;
			for (let j = 1; j < vocab; j++) if (ref[j] > ref[cpuBest]) cpuBest = j;
			const tileBuf = this.uploadGpu(w);
			const got = await this.argmaxProjection(hidden, [{ buf: tileBuf, rows: vocab, r0: 0 }], dd, vocab, false);
			tileBuf.destroy?.();
			if (got !== cpuBest) return fail('argmaxProjection');
		}

		// GPU-resident decode path: the whole forward stays on the GPU (one submit, one
		// readback). Verify it against the trusted CPU reference, BOTH as a single prefill and
		// as a prefill-then-cached-decode split — this is the gate for using it for real tokens.
		{
			const nHeads = 4, nKvHeads = 2, headDim = 4, d = nHeads * headDim, kvDim = nKvHeads * headDim, ffn = 16;
			const cfg: LayerCfg = { seq: 4, d, nHeads, nKvHeads, headDim, ffn, ropeTheta: 10000, eps: 1e-6 };
			const wCpu: LayerWeights = {
				attnNorm: rand(d), wq: rand(d * d), wk: rand(d * kvDim), wv: rand(d * kvDim), wo: rand(d * d),
				bq: rand(d), bk: rand(kvDim), bv: rand(kvDim),
				ffnNorm: rand(d), wgate: rand(d * ffn), wup: rand(d * ffn), wdown: rand(ffn * d)
			};
			const finalNormArr = rand(d);
			const x = rand(4 * d);
			// Reference = the trusted READBACK path in TRANSPOSED mode (matmulT) — the SAME matmul
			// orientation the resident path uses. (layerForwardCpu uses NON-transposed matmul, so
			// it's the wrong reference for matmulT and would always mismatch on non-symmetric
			// weights.) This validates that the resident orchestration == the readback path.
			const empty0 = new Float32Array(0);
			const rb = await this.layerForwardKV(x, { ...cfg, seq: 4 }, wCpu, 0, empty0, empty0, true);
			const ref = rmsnormCpu(rb.out.slice(3 * d, 4 * d), finalNormArr, 1, d, 1e-6);

			const gpuW: LayerWeightsGpu = {
				attnNorm: this.uploadGpu(wCpu.attnNorm), wq: this.uploadGpu(wCpu.wq as Float32Array), wk: this.uploadGpu(wCpu.wk as Float32Array),
				wv: this.uploadGpu(wCpu.wv as Float32Array), wo: this.uploadGpu(wCpu.wo as Float32Array), ffnNorm: this.uploadGpu(wCpu.ffnNorm),
				wgate: this.uploadGpu(wCpu.wgate as Float32Array), wup: this.uploadGpu(wCpu.wup as Float32Array), wdown: this.uploadGpu(wCpu.wdown as Float32Array),
				bq: this.uploadGpu(wCpu.bq!), bk: this.uploadGpu(wCpu.bk!), bv: this.uploadGpu(wCpu.bv!)
			};
			const finalNormBuf = this.uploadGpu(finalNormArr);

			// Force f32 KV for the orchestration check (exact match to the f32 readback reference); the
			// int8-KV kernels are validated separately by the q8-KV gate above.
			const savedKv = this.kvQuant; this.kvQuant = false; this.resetKvGpu();
			// (a) single 4-token prefill
			const got = await this.runDecodeGpu(x, { ...cfg, seq: 4 }, [gpuW], 0, finalNormBuf, 'selftest-A');
			if (!closeRel(got, ref, 8e-3)) { this.resetKvGpu(); this.kvQuant = savedKv; return fail('runDecodeGpu.prefill'); }
			// (b) 3-token prefill + 1-token cached decode must reproduce the same last token
			await this.runDecodeGpu(x.slice(0, 3 * d), { ...cfg, seq: 3 }, [gpuW], 0, finalNormBuf, 'selftest-B');
			const dec = await this.runDecodeGpu(x.slice(3 * d, 4 * d), { ...cfg, seq: 1 }, [gpuW], 3, finalNormBuf, 'selftest-B');
			if (!closeRel(dec, ref, 8e-3)) { this.resetKvGpu(); this.kvQuant = savedKv; return fail('runDecodeGpu.decode'); }
			this.kvQuant = savedKv;

			this.resetKvGpu();
			for (const b of Object.values(gpuW)) b?.destroy?.();
			finalNormBuf.destroy?.();
		}

		// GPU sampling pre-work (softcap → penalty → top-K): the decode loop reads back only the top-K
		// candidates now, so this is BLOCKING — a broken kernel here corrupts every sampled token.
		// REALISTIC vocab size: mobile drivers can miscompile the long per-thread strided loops that a
		// small test size never exercises (~1.2k iterations/thread at 152k vs 8 at 1k).
		{
			const vocab = 152064, K = 64, penalty = 1.15, cap = 30;
			const logits = Float32Array.from({ length: vocab }, () => (Math.random() * 2 - 1) * 8);
			const recent = [...new Set(Array.from({ length: 40 }, () => Math.floor(Math.random() * vocab)))];
			// CPU reference: same order of operations.
			const ref = logits.slice();
			for (let i = 0; i < vocab; i++) ref[i] = cap * Math.tanh(ref[i] / cap);
			for (const id of recent) ref[id] = ref[id] > 0 ? ref[id] / penalty : ref[id] * penalty;
			const order = Array.from(ref.keys()).sort((a, b) => ref[b] - ref[a]).slice(0, K);
			// GPU: logits buffer → softcap → penalize → top_k, one submit.
			const G2 = globalThis as any;
			const trash: GPUAny[] = [];
			const lbuf = this.storage(vocab * 4);
			this.device.queue.writeBuffer(lbuf, 0, logits);
			trash.push(lbuf);
			const enc = this.device.createCommandEncoder();
			const p1 = this.uniform([vocab], { offset: 4, value: cap });
			this.recordPass(enc, 'softcap_logits', [p1, lbuf], this.grid1D(vocab));
			const idsBuf = this.bufU32(Uint32Array.from(recent), G2.GPUBufferUsage.STORAGE | G2.GPUBufferUsage.COPY_DST);
			const p2 = this.uniform([recent.length], { offset: 4, value: penalty });
			this.recordPass(enc, 'penalize_logits', [p2, idsBuf, lbuf], this.grid1D(recent.length));
			const out = this.storage(K * 2 * 4);
			const p3 = this.uniform([vocab, K]);
			this.recordPass(enc, 'top_k', [p3, lbuf, out], [1, 1, 1]);
			trash.push(p1, idsBuf, p2, p3, out);
			const read = this.device.createBuffer({ size: K * 2 * 4, usage: G2.GPUBufferUsage.COPY_DST | G2.GPUBufferUsage.MAP_READ });
			enc.copyBufferToBuffer(out, 0, read, 0, K * 2 * 4);
			this.device.queue.submit([enc.finish()]);
			await read.mapAsync(G2.GPUMapMode.READ);
			const raw = new Uint32Array(read.getMappedRange().slice(0));
			read.unmap(); read.destroy();
			this.release(trash);
			const gotIds = raw.slice(0, K), gotVals = new Float32Array(raw.buffer, K * 4, K);
			this.topKOk = true;
			for (let r = 0; r < K; r++) {
				// Values must match the reference ranking; ids are checked through their reference logit
				// (ties may legitimately reorder equal values). A failure DOESN'T block the model: the
				// chat loop checks `topKOk` and falls back to the CPU full-vocab sampling path.
				const okV = Math.abs(gotVals[r] - ref[order[r]]) <= 1e-4 * (1 + Math.abs(ref[order[r]]));
				const okI = Math.abs(ref[gotIds[r]] - gotVals[r]) <= 1e-4 * (1 + Math.abs(gotVals[r]));
				if (!okV || !okI) {
					this.topKOk = false;
					console.error(`[selfValidate] top_k KO sur ce GPU (rang ${r}) — repli sur le sampling CPU plein-vocab (plus lent, même résultat).`);
					break;
				}
			}
		}

		// RWKV-7 WKV (moteur v2) — NON bloquant : la récurrence à état fixe n'est sur AUCUN chemin
		// d'archi actuel, donc un bug du nouveau kernel ne doit pas empêcher de charger un LLM. Un pas
		// sur un état aléatoire, comparé à la réf CPU (sémantique ggml GGML_OP_RWKV_WKV7). Écart →
		// rwkvWkv7Ok=false (une future archi RWKV refuserait alors de charger). Voir docs/engine-v2-*.
		if (this.rwkvWkv7Ok) {
			const H = 2, N = 8, hb0 = H * N;
			const S0 = rand(H * N * N), rr = rand(hb0), kk = rand(hb0), vv = rand(hb0), bb = rand(hb0), aa = rand(hb0);
			const ww = Float32Array.from({ length: hb0 }, () => Math.random() * 0.5 + 0.5); // décroissance ∈ (0.5,1)
			const Sref = S0.slice(), yref = new Float32Array(hb0);
			for (let h = 0; h < H; h++) {
				const hb = h * N;
				for (let i = 0; i < N; i++) {
					const rowBase = h * N * N + i * N, vi = vv[hb + i];
					let sa = 0;
					for (let j = 0; j < N; j++) sa += aa[hb + j] * Sref[rowBase + j];
					let yi = 0;
					for (let j = 0; j < N; j++) {
						const s = ww[hb + j] * Sref[rowBase + j] + vi * kk[hb + j] + bb[hb + j] * sa;
						Sref[rowBase + j] = s;
						yi += rr[hb + j] * s;
					}
					yref[hb + i] = yi;
				}
			}
			const got = await this.rwkvWkv7(S0.slice(), rr, ww, kk, vv, aa, bb, H, N);
			const rel = (x: Float32Array, y: Float32Array) => x.length === y.length && x.every((val, idx) => Math.abs(val - y[idx]) <= 1e-3 * (1 + Math.abs(y[idx])));
			if (!rel(got.S, Sref) || !rel(got.y, yref)) {
				this.rwkvWkv7Ok = false;
				console.error('[selfValidate] RWKV-7 WKV KO sur ce GPU — une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).');
			} else {
				console.log('[selfValidate] RWKV-7 WKV OK (récurrence à état fixe, moteur v2)');
			}
			// RWKV-7 token-shift : 6 lerps depuis ln/prev/lerp_fused, vs réf CPU.
			const Dt = 16;
			const ln = rand(Dt), pv = rand(Dt), lp = rand(Dt * 6);
			const tsRef = new Float32Array(Dt * 6);
			for (let k = 0; k < 6; k++) for (let i = 0; i < Dt; i++) { const idx = k * Dt + i; tsRef[idx] = ln[i] + (pv[i] - ln[i]) * lp[idx]; }
			const tsGot = await this.rwkvTokenShift(ln, pv, lp, Dt);
			if (!rel(tsGot, tsRef)) {
				this.rwkvWkv7Ok = false;
				console.error('[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).');
			} else {
				console.log('[selfValidate] RWKV-7 token-shift OK');
			}

			// Glu RWKV résidente (rwkv_kprep, rwkv_out_gn, rwkv_decay, rwkv_vresid, rwkv_lerp, sqrelu) :
			// chaque kernel vs sa réf JS (sémantique RwkvModel.timeMix, verrouillée par rwkv-cpuref).
			// NON bloquant : échec → rwkvResidentOk=false, le chat RWKV retombe sur le POC JS+readback.
			if (this.rwkvResidentOk) {
				const G = globalThis as any;
				const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.COPY_SRC;
				const NHv = 2, Hv = 8, Dv = NHv * Hv;
				const uni = (u: number[], f?: { off: number; val: number }) => {
					const size = Math.max(16, Math.ceil((u.length * 4 + (f ? 4 : 0)) / 16) * 16);
					const b = this.device.createBuffer({ size, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
					this.device.queue.writeBuffer(b, 0, new Uint32Array(u));
					if (f) this.device.queue.writeBuffer(b, f.off, new Float32Array([f.val]));
					return b;
				};
				const out = (n: number) => this.device.createBuffer({ size: n * 4, usage: ST });
				try {
					// rwkv_kprep
					const kx = rand(Dv), kkw = rand(Dv), kaw = rand(Dv);
					const ax = Float32Array.from({ length: Dv }, () => Math.random()); // a ∈ (0,1) comme σ
					const kmodR = new Float32Array(Dv), negkkR = new Float32Array(Dv), kkaR = new Float32Array(Dv);
					for (let h = 0; h < NHv; h++) {
						let n = 0;
						for (let j = 0; j < Hv; j++) { const t = kx[h * Hv + j] * kkw[h * Hv + j]; n += t * t; }
						n = Math.sqrt(n) || 1e-12;
						for (let j = 0; j < Hv; j++) {
							const i = h * Hv + j, kkn = kx[i] * kkw[i] / n;
							negkkR[i] = -kkn; kkaR[i] = kkn * ax[i]; kmodR[i] = kx[i] * (1 + (ax[i] - 1) * kaw[i]);
						}
					}
					const km = out(Dv), nk = out(Dv), ka2 = out(Dv);
					this.dispatch('rwkv_kprep', [uni([NHv, Hv]), this.buf(kx, ST), this.buf(ax, ST), this.buf(kkw, ST), this.buf(kaw, ST), km, nk, ka2], this.grid1D(NHv));
					const okKprep = rel(await this.readBack(km, Dv * 4), kmodR) && rel(await this.readBack(nk, Dv * 4), negkkR) && rel(await this.readBack(ka2, Dv * 4), kkaR);
					km.destroy?.(); nk.destroy?.(); ka2.destroy?.();
					// rwkv_out_gn (lnWB = [gamma|beta] concaténés)
					const yv = rand(Dv), rv2 = rand(Dv), rkv = rand(Dv), vv2 = rand(Dv), lnwv = rand(Dv), lnbv = rand(Dv);
					const gnR = new Float32Array(Dv);
					for (let h = 0; h < NHv; h++) {
						const hb = h * Hv;
						let m = 0; for (let j = 0; j < Hv; j++) m += yv[hb + j]; m /= Hv;
						let va = 0; for (let j = 0; j < Hv; j++) { const dd = yv[hb + j] - m; va += dd * dd; } va /= Hv;
						const sc = 1 / Math.sqrt(va + 64e-5);
						let bonus = 0; for (let j = 0; j < Hv; j++) bonus += rv2[hb + j] * kmodR[hb + j] * rkv[hb + j];
						for (let j = 0; j < Hv; j++) gnR[hb + j] = (yv[hb + j] - m) * sc * lnwv[hb + j] + lnbv[hb + j] + bonus * vv2[hb + j];
					}
					const lnWB = new Float32Array(2 * Dv); lnWB.set(lnwv, 0); lnWB.set(lnbv, Dv);
					const gn = out(Dv);
					this.dispatch('rwkv_out_gn', [uni([NHv, Hv], { off: 8, val: 64e-5 }), this.buf(yv, ST), this.buf(rv2, ST), this.buf(kmodR, ST), this.buf(rkv, ST), this.buf(vv2, ST), this.buf(lnWB, ST), gn], this.grid1D(NHv));
					const okGn = rel(await this.readBack(gn, Dv * 4), gnR);
					gn.destroy?.();
					// rwkv_decay + rwkv_vresid + rwkv_lerp + sqrelu (élémentaires)
					const w0v = rand(Dv), wprev = rand(Dv);
					const decR = Float32Array.from(w0v, (w0i, i) => Math.exp(-0.606531 / (1 + Math.exp(-(w0i + wprev[i])))));
					const dec = out(Dv);
					this.dispatch('rwkv_decay', [this.buf(w0v, ST), this.buf(wprev, ST), dec], this.grid1D(Dv));
					const okDec = rel(await this.readBack(dec, Dv * 4), decR);
					dec.destroy?.();
					const vin = rand(Dv), vf = rand(Dv), v0v = rand(Dv), vprev = rand(Dv);
					const vrR = Float32Array.from(vin, (vi, i) => vi + (vf[i] - vi) * (1 / (1 + Math.exp(-(v0v[i] + vprev[i])))));
					const vb = this.buf(vin, ST);
					this.dispatch('rwkv_vresid', [vb, this.buf(vf, ST), this.buf(v0v, ST), this.buf(vprev, ST)], this.grid1D(Dv));
					const okVr = rel(await this.readBack(vb, Dv * 4), vrR);
					vb.destroy?.();
					const lx = rand(Dv), lprev = rand(Dv), llerp = rand(Dv);
					const lpR = Float32Array.from(lx, (xi, i) => xi + (lprev[i] - xi) * llerp[i]);
					const lo = out(Dv);
					this.dispatch('rwkv_lerp', [this.buf(lx, ST), this.buf(lprev, ST), this.buf(llerp, ST), lo], this.grid1D(Dv));
					const okLerp = rel(await this.readBack(lo, Dv * 4), lpR);
					lo.destroy?.();
					const sx = rand(Dv);
					const sqR = Float32Array.from(sx, (v2) => { const m2 = Math.max(v2, 0); return m2 * m2; });
					const so = out(Dv);
					this.dispatch('sqrelu', [this.buf(sx, ST), so], this.grid1D(Dv));
					const okSq = rel(await this.readBack(so, Dv * 4), sqR);
					so.destroy?.();
					if (!okKprep || !okGn || !okDec || !okVr || !okLerp || !okSq) {
						this.rwkvResidentOk = false;
						console.error(`[selfValidate] glu RWKV résidente KO sur ce GPU (kprep:${okKprep} gn:${okGn} decay:${okDec} vresid:${okVr} lerp:${okLerp} sqrelu:${okSq}) — repli forwardToken JS+readback (correct, lent).`);
					} else {
						console.log('[selfValidate] glu RWKV résidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)');
					}
				} catch (e) {
					this.rwkvResidentOk = false;
					console.error('[selfValidate] glu RWKV résidente : erreur d’exécution — repli forwardToken JS+readback.', e);
				}
			}
		}

		// LFM2 shortconv (moteur v2, bloc hybride) : conv causale depthwise gatée + décalage d'état,
		// vs réf CPU (sémantique scripts/lfm2-cpuref.cjs). Non bloquant — seule une archi lfm2 en dépend.
		if (this.lfm2ShortConvOk) {
			const rand = (n: number) => Float32Array.from({ length: n }, () => Math.random() * 2 - 1);
			const rel = (x: Float32Array, y: Float32Array) => x.length === y.length && x.every((val, idx) => Math.abs(val - y[idx]) <= 1e-3 * (1 + Math.abs(y[idx])));
			const Dc = 32, LC = 3;
			const bcx = rand(3 * Dc), st0 = rand((LC - 1) * Dc), wc = rand(Dc * LC);
			const outRef = new Float32Array(Dc), stRef = st0.slice();
			for (let i = 0; i < Dc; i++) {
				const bxn = bcx[i] * bcx[2 * Dc + i];
				let y = wc[i * LC + (LC - 1)] * bxn;
				for (let k = 0; k < LC - 1; k++) y += wc[i * LC + k] * st0[k * Dc + i];
				for (let k = 0; k + 2 < LC; k++) stRef[k * Dc + i] = st0[(k + 1) * Dc + i];
				stRef[(LC - 2) * Dc + i] = bxn;
				outRef[i] = y * bcx[Dc + i];
			}
			const got = await this.lfm2ShortConv(bcx, st0.slice(), wc, Dc, LC);
			if (!rel(got.out, outRef) || !rel(got.state, stRef)) {
				this.lfm2ShortConvOk = false;
				console.error('[selfValidate] LFM2 shortconv KO sur ce GPU — une archi lfm2 refuserait de charger (non bloquant pour le reste).');
			} else {
				console.log('[selfValidate] LFM2 shortconv OK (conv courte gatée, moteur v2)');
			}
		}

		// Image-gen primitives (jalon 1) are checked NON-blocking: they're not on the text path yet, so
		// a bug in the new (browser-unvalidated) WGSL must NOT prevent loading an LLM. Logs pass/fail.
		const diffFail = await this.validateDiffusion();
		if (diffFail) console.warn('[selfValidate] image-gen primitive KO:', diffFail, '(non bloquant — chemin texte intact)');
		else console.log('[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8, relu, upsample_nearest, layernorm, quick_gelu, attention_full)');

		// Motion résident vidéo (gate NON BLOQUANT, motif convTiledOk) : un kernel raté → videoResidentOk=false
		// → repli JS+readback (correct). Ne gate jamais le texte ni la vidéo POC.
		const vresFail = await this.validateVideoResident();
		if (vresFail) { this.videoResidentOk = false; console.warn('[selfValidate] motion résident KO:', vresFail, '— repli JS+readback (plus lent, même résultat).'); }
		else console.log('[selfValidate] motion résident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)');

		return true;
	}

	// Valide les 4 kernels du chemin motion résident vs référence CPU (petites formes). Retourne le nom
	// du kernel en échec, ou null. Standalone (rand/closeRel propres), appelé non bloquant par selfValidate.
	async validateVideoResident(): Promise<string | null> {
		const rand = (n: number) => Float32Array.from({ length: n }, () => Math.random() * 2 - 1);
		const closeRel = (x: Float32Array, y: Float32Array, tol = 5e-3) =>
			x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) <= tol * (1 + Math.abs(y[i])));
		const F = 3, heads = 2, hd = 4, C = heads * hd, S = 5; // C=8

		// video_motion_gather : (F,C,S) → (S·F, C)
		{
			const inp = rand(F * C * S);
			const ref = new Float32Array(S * F * C);
			for (let s = 0; s < S; s++) for (let f = 0; f < F; f++) for (let c = 0; c < C; c++)
				ref[(s * F + f) * C + c] = inp[(f * C + c) * S + s];
			const sess = this.recordingSession();
			const got = await sess.finish(sess.videoGather(inp, F, C, S), S * F * C);
			if (!closeRel(got, ref, 1e-6)) return 'video_motion_gather';
		}
		// video_motion_scatter : (S·F, C) + résidu (F,C,S) → (F,C,S)
		{
			const h = rand(S * F * C), res = rand(F * C * S);
			const ref = new Float32Array(F * C * S);
			for (let f = 0; f < F; f++) for (let c = 0; c < C; c++) for (let s = 0; s < S; s++)
				ref[(f * C + c) * S + s] = h[(s * F + f) * C + c] + res[(f * C + c) * S + s];
			const sess = this.recordingSession();
			const got = await sess.finish(sess.videoScatter(h, res, F, C, S), F * C * S);
			if (!closeRel(got, ref, 1e-6)) return 'video_motion_scatter';
		}
		// video_add_pe : (S·F, C) + pe[f·C+c]
		{
			const x = rand(S * F * C), pe = rand(F * C);
			const ref = new Float32Array(S * F * C);
			for (let s = 0; s < S; s++) for (let f = 0; f < F; f++) for (let c = 0; c < C; c++)
				ref[(s * F + f) * C + c] = x[(s * F + f) * C + c] + pe[f * C + c];
			const sess = this.recordingSession();
			const got = await sess.finish(sess.videoAddPe(x, pe, F, C, S), S * F * C);
			if (!closeRel(got, ref, 1e-6)) return 'video_add_pe';
		}
		// attn_temporal : softmax sur F par (position s, tête), même math que la réf JS du module
		{
			const q = rand(S * F * C), k = rand(S * F * C), v = rand(S * F * C), scale = 1 / Math.sqrt(hd);
			const ref = new Float32Array(S * F * C);
			for (let s = 0; s < S; s++) for (let h = 0; h < heads; h++) {
				const hb = h * hd, bb = s * F;
				for (let ti = 0; ti < F; ti++) {
					const qb = (bb + ti) * C + hb, sc = new Float32Array(F); let mx = -1e30;
					for (let tj = 0; tj < F; tj++) { let d = 0; const kb = (bb + tj) * C + hb; for (let i = 0; i < hd; i++) d += q[qb + i] * k[kb + i]; sc[tj] = d * scale; if (sc[tj] > mx) mx = sc[tj]; }
					let sum = 0; for (let tj = 0; tj < F; tj++) { sc[tj] = Math.exp(sc[tj] - mx); sum += sc[tj]; }
					for (let tj = 0; tj < F; tj++) { const pw = sc[tj] / sum, vb = (bb + tj) * C + hb; for (let i = 0; i < hd; i++) ref[qb + i] += pw * v[vb + i]; }
				}
			}
			const sess = this.recordingSession();
			const got = await sess.finish(sess.attnTemporal(q, k, v, S, F, heads, hd), S * F * C);
			if (!closeRel(got, ref)) return 'attn_temporal';
		}
		return null;
	}

	// Validates the diffusion primitives (silu, group_norm, conv2d) against CPU references. Returns the
	// failing stage name, or null if all pass. Standalone (own rand/closeRel) and called non-blocking by
	// selfValidate so an unproven image kernel can't gate the LLM path. See docs/image-gen-feasibility.md.
	async validateDiffusion(): Promise<string | null> {
		const rand = (n: number) => Float32Array.from({ length: n }, () => Math.random() * 2 - 1);
		const closeRel = (x: Float32Array, y: Float32Array, tol = 5e-3) =>
			x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) <= tol * (1 + Math.abs(y[i])));

		// silu
		const sx = rand(70);
		const sref = sx.map((v) => v / (1 + Math.exp(-v)));
		if (!closeRel(await this.silu(sx), sref)) return 'silu';

		// group_norm: C=4, HW=5, G=2, with affine
		const C = 4, HW = 5, groups = 2, eps = 1e-5;
		const gx = rand(C * HW), gGamma = rand(C), gBeta = rand(C);
		const gref = new Float32Array(C * HW);
		const cpg = C / groups;
		for (let grp = 0; grp < groups; grp++) {
			const base = grp * cpg * HW, n2 = cpg * HW;
			let mean = 0; for (let i = 0; i < n2; i++) mean += gx[base + i]; mean /= n2;
			let varr = 0; for (let i = 0; i < n2; i++) { const dv = gx[base + i] - mean; varr += dv * dv; } varr /= n2;
			const inv = 1 / Math.sqrt(varr + eps);
			for (let i = 0; i < n2; i++) { const ch = grp * cpg + Math.floor(i / HW); gref[base + i] = (gx[base + i] - mean) * inv * gGamma[ch] + gBeta[ch]; }
		}
		if (!closeRel(await this.groupNorm(gx, gGamma, gBeta, C, HW, groups, eps), gref)) return 'group_norm';

		// conv2d: Cin=2, H=W=4, Cout=3, 3×3, stride 1, pad 1 → OH=OW=4
		const Cin = 2, Hh = 4, Ww = 4, Cout = 3, kk = 3, st = 1, pd = 1, OH = 4, OW = 4;
		const cin = rand(Cin * Hh * Ww), cw = rand(Cout * Cin * kk * kk), cb = rand(Cout);
		const cref = new Float32Array(Cout * OH * OW);
		for (let co = 0; co < Cout; co++)
			for (let oy = 0; oy < OH; oy++)
				for (let ox = 0; ox < OW; ox++) {
					let acc = cb[co];
					for (let ci = 0; ci < Cin; ci++)
						for (let ky = 0; ky < kk; ky++)
							for (let kx = 0; kx < kk; kx++) {
								const iy = oy * st + ky - pd, ix = ox * st + kx - pd;
								if (iy >= 0 && iy < Hh && ix >= 0 && ix < Ww)
									acc += cin[ci * Hh * Ww + iy * Ww + ix] * cw[((co * Cin + ci) * kk + ky) * kk + kx];
							}
					cref[(co * OH + oy) * OW + ox] = acc;
				}
		if (!closeRel(await this.conv2d(cin, cw, cb, Cin, Hh, Ww, Cout, kk, kk, st, pd), cref)) return 'conv2d';
		// same conv via the direct (no-im2col) path → must match the same reference
		if (!closeRel(await this.conv2dDirect(cin, cw, cb, Cin, Hh, Ww, Cout, kk, kk, st, pd), cref)) return 'conv2d_direct';

		// conv2d_3x3_tiled vs conv2d_direct: same output required on a shape that exercises full AND
		// partial edge tiles (20×20 → 2×2 grid of 16×16 tiles with ragged edges). On mismatch the
		// tiled kernel is disabled (convTiledOk=false) and everything falls back to the direct one.
		{
			const tCin = 3, tH = 20, tW = 20, tCout = 4;
			const tx = rand(tCin * tH * tW), tw = rand(tCout * tCin * 9), tb = rand(tCout);
			const refDirect = await this.conv2dDirect(tx, tw, tb, tCin, tH, tW, tCout, 3, 3, 1, 1);
			const saved = this.convTiledOk;
			this.convTiledOk = true; // force the tiled path through the session dispatch
			const st = this.recordingSession();
			const gotTiled = await st.finish(st.conv2d(tx, tw, tb, tCin, tH, tW, tCout, 3, 3, 1, 1), tCout * tH * tW);
			this.convTiledOk = saved;
			if (!closeRel(gotTiled, refDirect)) {
				this.convTiledOk = false;
				console.warn('[selfValidate] conv2d_3x3_tiled KO sur ce GPU — repli sur conv2d_direct (plus lent, même résultat).');
			}
		}

		// conv2d_direct_q8 (fused int8 dequant): quantize the weights CPU-side (q8web), upload the
		// EXACT codes/scales bytes, and compare the q8 conv against the f32 direct conv run on the
		// DEQUANTIZED weights — both paths see identical int8+f16 values, so they must match to
		// accumulation order. Weight count 4·8·9 = 288 = 9×32 (q8web needs %32, true of all real convs).
		{
			const qCin = 8, qCout = 4;
			const qx = rand(qCin * Hh * Ww), qw = rand(qCout * qCin * kk * kk), qb = rand(qCout);
			const qt = quantizeQ8(qw);
			const qref = await this.conv2dDirect(qx, dequantizeQ8(qt), qb, qCin, Hh, Ww, qCout, kk, kk, st, pd);
			const q8 = {
				codes: this.uploadGpuRaw(new Uint8Array(qt.codes.buffer, qt.codes.byteOffset, qt.codes.byteLength)),
				sc: this.uploadGpuRaw(new Uint8Array(qt.scales.buffer, qt.scales.byteOffset, qt.scales.byteLength)),
			};
			const s = this.recordingSession();
			const got = await s.finish(s.conv2d(qx, q8, qb, qCin, Hh, Ww, qCout, kk, kk, st, pd), qCout * Hh * Ww);
			this.releaseGpu([q8.codes, q8.sc]);
			if (!closeRel(got, qref)) return 'conv2d_direct_q8';
		}

		// conv2d_direct_q4 (fused int4 dequant, tier « light » des BRIK image) : même protocole que
		// le q8 — les MÊMES nibbles/scales/mins vus par le GPU et par la référence CPU déquantifiée.
		{
			const qCin = 8, qCout = 4;
			const qx = rand(qCin * Hh * Ww), qw = rand(qCout * qCin * kk * kk), qb = rand(qCout);
			const qt = quantizeQ4(qw);
			const qref = await this.conv2dDirect(qx, dequantizeQ4(qt), qb, qCin, Hh, Ww, qCout, kk, kk, st, pd);
			const q4 = {
				nib: this.uploadGpuRaw(qt.nibbles),
				sc: this.uploadGpuRaw(new Uint8Array(qt.scales.buffer, qt.scales.byteOffset, qt.scales.byteLength)),
				mn: this.uploadGpuRaw(new Uint8Array(qt.mins.buffer, qt.mins.byteOffset, qt.mins.byteLength)),
			};
			const s = this.recordingSession();
			const got = await s.finish(s.conv2d(qx, q4, qb, qCin, Hh, Ww, qCout, kk, kk, st, pd), qCout * Hh * Ww);
			this.releaseGpu([q4.nib, q4.sc, q4.mn]);
			if (!closeRel(got, qref)) return 'conv2d_direct_q4';
		}

		// f16_to_f32 (bulk GPU conversion for safetensors F16 weights): round-trip random values
		// through CPU f16 encode → GPU decode, compare against the CPU decoder (same IEEE decode).
		{
			const n = 66; // odd word-tail covered (n not a multiple of 2 words)
			const vals = rand(n);
			const bits = new Uint16Array(n);
			for (let i = 0; i < n; i++) bits[i] = f32ToF16(vals[i]);
			const fref = new Float32Array(n);
			for (let i = 0; i < n; i++) fref[i] = f16ToF32(bits[i]);
			const out = this.f16ToF32Gpu(new Uint8Array(bits.buffer, bits.byteOffset, bits.byteLength), n);
			const got = await this.readGpu(out, n);
			out.destroy?.();
			if (!closeRel(got, fref, 1e-6)) return 'f16_to_f32';
		}

		// relu
		const rx = rand(70);
		if (!closeRel(await this.relu(rx), rx.map((v) => Math.max(v, 0)))) return 'relu';

		// upsample_nearest: C=2, H=W=2, scale=2 → [2,4,4]
		const uC = 2, uH = 2, uW = 2, us = 2, uOH = uH * us, uOW = uW * us;
		const ux = rand(uC * uH * uW);
		const uref = new Float32Array(uC * uOH * uOW);
		for (let c = 0; c < uC; c++)
			for (let oy = 0; oy < uOH; oy++)
				for (let ox = 0; ox < uOW; ox++)
					uref[c * uOH * uOW + oy * uOW + ox] = ux[c * uH * uW + Math.floor(oy / us) * uW + Math.floor(ox / us)];
		if (!closeRel(await this.upsampleNearest(ux, uC, uH, uW, us), uref)) return 'upsample_nearest';

		// layernorm: 2 rows × 8 dims, with affine (mean-subtract + std-divide + gamma/beta) — CLIP.
		const lr = 2, ld = 8, leps = 1e-5;
		const lx = rand(lr * ld), lg = rand(ld), lb = rand(ld);
		const lref = new Float32Array(lr * ld);
		for (let r = 0; r < lr; r++) {
			const b = r * ld;
			let mean = 0; for (let i = 0; i < ld; i++) mean += lx[b + i]; mean /= ld;
			let varr = 0; for (let i = 0; i < ld; i++) { const d = lx[b + i] - mean; varr += d * d; } varr /= ld;
			const inv = 1 / Math.sqrt(varr + leps);
			for (let i = 0; i < ld; i++) lref[b + i] = (lx[b + i] - mean) * inv * lg[i] + lb[i];
		}
		if (!closeRel(await this.layernorm(lx, lg, lb, lr, ld, leps), lref)) return 'layernorm';

		// quick_gelu: x·sigmoid(1.702x) — CLIP activation
		const qx = rand(70);
		if (!closeRel(await this.quickGelu(qx), qx.map((v) => v / (1 + Math.exp(-1.702 * v))))) return 'quick_gelu';

		// attention_full: NON-causal, kvLen != nTokens (UNet cross-attention shape). 3 queries, 5 keys.
		{
			const nT = 3, kvL = 5, nH = 2, hd2 = 4, dd = nH * hd2, sc = 1 / Math.sqrt(hd2);
			const aq = rand(nT * dd), ak = rand(kvL * dd), av = rand(kvL * dd);
			const aref = new Float32Array(nT * dd);
			for (let h = 0; h < nH; h++) for (let t = 0; t < nT; t++) {
				const s = new Float32Array(kvL); let mx = -Infinity;
				for (let j = 0; j < kvL; j++) { let d2 = 0; for (let e2 = 0; e2 < hd2; e2++) d2 += aq[t * dd + h * hd2 + e2] * ak[j * dd + h * hd2 + e2]; s[j] = d2 * sc; if (s[j] > mx) mx = s[j]; }
				let sum = 0; for (let j = 0; j < kvL; j++) { s[j] = Math.exp(s[j] - mx); sum += s[j]; }
				for (let e2 = 0; e2 < hd2; e2++) { let acc = 0; for (let j = 0; j < kvL; j++) acc += (s[j] / sum) * av[j * dd + h * hd2 + e2]; aref[t * dd + h * hd2 + e2] = acc; }
			}
			if (!closeRel(await this.attentionFull(aq, ak, av, nT, nH, nH, hd2, kvL), aref)) return 'attention_full';
		}

		// attention_full_wg vs attention_full : mêmes sorties exigées sur des formes RÉELLES de l'UNet —
		// self-attention headDim 64 (SD-Turbo), cross-attention kvLen 77, et headDim 160 (SDXS niveau
		// 1280ch, exerce le 3e scalaire d'accumulation) avec tuile partielle (kvLen non multiple de 64).
		// Gate NON BLOQUANT (motif convTiledOk) : un driver qui le rate bascule attnFullWgOk=false →
		// repli silencieux sur le kernel thread-par-tête, correct partout.
		if (this.attnFullWgOk) {
			const wgCases = [
				{ nT: 70, kvL: 70, nH: 5, hd: 64 },   // self-attn SD-Turbo (tuile partielle : 70 % 64 ≠ 0)
				{ nT: 16, kvL: 77, nH: 5, hd: 64 },   // cross-attn vers le texte CLIP (77 tokens)
				{ nT: 9, kvL: 9, nH: 8, hd: 160 },    // SDXS 1280ch : headDim > 128 (acc2)
			];
			for (const c of wgCases) {
				const dd = c.nH * c.hd;
				const q = rand(c.nT * dd), k = rand(c.kvL * dd), v = rand(c.kvL * dd);
				const ref = await this.attentionFull(q, k, v, c.nT, c.nH, c.nH, c.hd, c.kvL);
				const got = await this.attentionFullWg(q, k, v, c.nT, c.nH, c.nH, c.hd, c.kvL);
				if (!closeRel(got, ref)) {
					this.attnFullWgOk = false;
					console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${c.hd}, kv=${c.kvL}) — repli sur attention_full (plus lent, même résultat).`);
					break;
				}
			}
		}

		return null;
	}
}

// ── CPU references (used only by selfValidate) ───────────────────────────────

// fp16 bits → f32, mirroring the WGSL `f16` helper exactly.
function f16ToF32(h: number): number {
	const s = (h >> 15) & 1;
	const e = (h >> 10) & 0x1f;
	const m = h & 0x3ff;
	let val: number;
	if (e === 0) val = m * 5.9604645e-8;
	else if (e === 31) val = 65504;
	else val = (1 + m / 1024) * 2 ** (e - 15);
	return s === 1 ? -val : val;
}

// f32 → fp16 bits (round-to-nearest-even), used only to build test data in a range
// that decodes cleanly (no inf/nan/subnormal) on both CPU and GPU.
function f32ToF16(val: number): number {
	const f = new Float32Array(1);
	const i = new Uint32Array(f.buffer);
	f[0] = val;
	const x = i[0];
	const sign = (x >> 16) & 0x8000;
	let exp = ((x >> 23) & 0xff) - 127 + 15;
	let mant = x & 0x7fffff;
	if (exp <= 0) return sign; // flush tiny to zero (test inputs avoid this)
	if (exp >= 31) return sign | 0x7bff; // clamp to max-normal
	// round mantissa to 10 bits, round-to-nearest-even
	const round = (mant >> 13) + ((mant >> 12) & 1);
	mant = round;
	if (mant === 0x400) { mant = 0; exp += 1; }
	return sign | (exp << 10) | (mant & 0x3ff);
}

// CPU reference for Q4_K dequant, mirroring llama.cpp dequantize_row_q4_K.
function dequantQ4KCpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 256);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 144;
		const d = f16ToF32(dv.getUint16(base, true));
		const dmin = f16ToF32(dv.getUint16(base + 2, true));
		const sc = (j: number): [number, number] => {
			const s = (k: number) => bytes[base + 4 + k]; // scales[12] at offset 4
			if (j < 4) return [s(j) & 63, s(j + 4) & 63];
			return [
				(s(j + 4) & 0xf) | ((s(j - 4) >> 6) << 4),
				(s(j + 4) >> 4) | ((s(j) >> 6) << 4)
			];
		};
		const outBase = blk * 256;
		let is = 0;
		let qsOff = 0;
		for (let j = 0; j < 256; j += 64) {
			const [a0, a1] = sc(is);
			const d1 = d * a0, m1 = dmin * a1;
			const [b0, b1] = sc(is + 1);
			const d2 = d * b0, m2 = dmin * b1;
			for (let l = 0; l < 32; l++) {
				const v = bytes[base + 16 + qsOff + l]; // qs[128] at offset 16
				out[outBase + j + l] = d1 * (v & 0xf) - m1;
				out[outBase + j + 32 + l] = d2 * (v >> 4) - m2;
			}
			qsOff += 32;
			is += 2;
		}
	}
	return out;
}

// Signed int8 from a byte.
function si8(b: number): number { return b > 127 ? b - 256 : b; }

// CPU references for the other GGML quant types (mirror llama.cpp dequantize_row_*).
function dequantQ8_0Cpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 32);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 34;
		const d = f16ToF32(dv.getUint16(base, true));
		for (let l = 0; l < 32; l++) out[blk * 32 + l] = d * si8(bytes[base + 2 + l]);
	}
	return out;
}

function dequantQ5_0Cpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 32);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 22;
		const d = f16ToF32(dv.getUint16(base, true));
		const qh = dv.getUint32(base + 2, true);
		for (let j = 0; j < 16; j++) {
			const qsj = bytes[base + 6 + j];
			const xh0 = ((qh >>> j) << 4) & 0x10;
			const xh1 = (qh >>> (j + 12)) & 0x10;
			out[blk * 32 + j] = d * (((qsj & 0xf) | xh0) - 16);
			out[blk * 32 + j + 16] = d * (((qsj >> 4) | xh1) - 16);
		}
	}
	return out;
}

// Q4_0 CPU reference (mirror llama.cpp dequantize_row_q4_0): y[j]=d*((q&0xF)-8), y[j+16]=d*((q>>4)-8).
function dequantQ4_0Cpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 32);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 18;
		const d = f16ToF32(dv.getUint16(base, true));
		for (let j = 0; j < 16; j++) {
			const qsj = bytes[base + 2 + j];
			out[blk * 32 + j] = d * ((qsj & 0xf) - 8);
			out[blk * 32 + j + 16] = d * ((qsj >> 4) - 8);
		}
	}
	return out;
}

// Q5_K CPU reference (mirror llama.cpp dequantize_row_q5_K): Q4_K scales/mins + a 5th bit from qh.
function dequantQ5_KCpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 256);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 176;
		const d = f16ToF32(dv.getUint16(base, true));
		const dmin = f16ToF32(dv.getUint16(base + 2, true));
		const sc = (j: number): [number, number] => {
			const s = (k: number) => bytes[base + 4 + k]; // scales[12] at offset 4
			if (j < 4) return [s(j) & 63, s(j + 4) & 63];
			return [(s(j + 4) & 0xf) | ((s(j - 4) >> 6) << 4), (s(j + 4) >> 4) | ((s(j) >> 6) << 4)];
		};
		const ob = blk * 256;
		let is = 0, qsOff = 0, u1 = 1, u2 = 2;
		for (let j = 0; j < 256; j += 64) {
			const [a0, a1] = sc(is); const d1 = d * a0, m1 = dmin * a1;
			const [b0, b1] = sc(is + 1); const d2 = d * b0, m2 = dmin * b1;
			for (let l = 0; l < 32; l++) {
				const ql = bytes[base + 48 + qsOff + l];
				const qhl = bytes[base + 16 + l];
				out[ob + j + l] = d1 * ((ql & 0xf) + ((qhl & u1) ? 16 : 0)) - m1;
				out[ob + j + 32 + l] = d2 * ((ql >> 4) + ((qhl & u2) ? 16 : 0)) - m2;
			}
			qsOff += 32; is += 2; u1 <<= 2; u2 <<= 2;
		}
	}
	return out;
}

function dequantQ6KCpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 256);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 210;
		const d = f16ToF32(dv.getUint16(base + 208, true));
		const ob = blk * 256;
		for (let half = 0; half < 2; half++) {
			const qlB = base + half * 64, qhB = base + 128 + half * 32, scB = base + 192 + half * 8, outB = ob + half * 128;
			for (let l = 0; l < 32; l++) {
				const is = (l / 16) | 0;
				const qll = bytes[qlB + l], qll32 = bytes[qlB + l + 32], qhl = bytes[qhB + l];
				const q1 = ((qll & 0xf) | (((qhl >> 0) & 3) << 4)) - 32;
				const q2 = ((qll32 & 0xf) | (((qhl >> 2) & 3) << 4)) - 32;
				const q3 = ((qll >> 4) | (((qhl >> 4) & 3) << 4)) - 32;
				const q4 = ((qll32 >> 4) | (((qhl >> 6) & 3) << 4)) - 32;
				out[outB + l] = d * si8(bytes[scB + is]) * q1;
				out[outB + l + 32] = d * si8(bytes[scB + is + 2]) * q2;
				out[outB + l + 64] = d * si8(bytes[scB + is + 4]) * q3;
				out[outB + l + 96] = d * si8(bytes[scB + is + 6]) * q4;
			}
		}
	}
	return out;
}

function matmulCpu(a: Float32Array, b: Float32Array, m: number, k: number, n: number): Float32Array {
	const o = new Float32Array(m * n);
	for (let r = 0; r < m; r++)
		for (let c = 0; c < n; c++) {
			let s = 0;
			for (let i = 0; i < k; i++) s += a[r * k + i] * b[i * n + c];
			o[r * n + c] = s;
		}
	return o;
}

function rmsnormCpu(x: Float32Array, w: Float32Array, rows: number, dim: number, eps = 1e-5, onePlus = false): Float32Array {
	const o = new Float32Array(rows * dim);
	for (let r = 0; r < rows; r++) {
		let ss = 0;
		for (let i = 0; i < dim; i++) ss += x[r * dim + i] ** 2;
		const inv = 1 / Math.sqrt(ss / dim + eps);
		for (let i = 0; i < dim; i++) o[r * dim + i] = x[r * dim + i] * inv * (onePlus ? 1 + w[i] : w[i]);
	}
	return o;
}

// Référence CPU du M-RoPE : mêmes fréquences que ropeCpu, position choisie par section (t/h/w).
function mropeCpu(x: Float32Array, pos: Uint32Array, rows: number, headDim: number, nHeads: number, sections: number[], base: number): Float32Array {
	const o = new Float32Array(x.length);
	const half = headDim / 2;
	const c0 = sections[0], c1 = sections[0] + sections[1];
	for (let r = 0; r < rows; r++) {
		const tok = Math.floor(r / nHeads);
		const bse = r * headDim;
		for (let i = 0; i < half; i++) {
			const axis = i < c0 ? 0 : i < c1 ? 1 : 2;
			const p = pos[tok * 3 + axis];
			const freq = p / base ** ((2 * i) / headDim);
			const c = Math.cos(freq), s = Math.sin(freq);
			const x0 = x[bse + i], x1 = x[bse + i + half];
			o[bse + i] = x0 * c - x1 * s;
			o[bse + i + half] = x1 * c + x0 * s;
		}
	}
	return o;
}

// Référence CPU du RoPE à paires ADJACENTES (ggml LLAMA_ROPE_TYPE_NORM) : la fréquence i tourne les
// composantes 2i et 2i+1 (au lieu de i et i+headDim/2). `ff` optionnel = diviseurs par fréquence.
function ropeInterleavedCpu(x: Float32Array, rows: number, headDim: number, nHeads: number, pastLen = 0, base = 10000, ff?: Float32Array): Float32Array {
	const out = new Float32Array(x.length);
	const half = headDim / 2;
	for (let r = 0; r < rows; r++) {
		const pos = pastLen + Math.floor(r / nHeads);
		const b = r * headDim;
		for (let i = 0; i < half; i++) {
			const freq = pos / (base ** ((2 * i) / headDim) * (ff ? ff[i] : 1));
			const c = Math.cos(freq), s = Math.sin(freq);
			const x0 = x[b + 2 * i], x1 = x[b + 2 * i + 1];
			out[b + 2 * i] = x0 * c - x1 * s;
			out[b + 2 * i + 1] = x1 * c + x0 * s;
		}
	}
	return out;
}

// Référence CPU du RoPE à facteurs : fréquence i divisée par ff[i].
function ropeFactorsCpu(x: Float32Array, ff: Float32Array, rows: number, headDim: number, nHeads: number, pastLen = 0, base = 10000): Float32Array {
	const o = new Float32Array(x.length);
	const half = headDim / 2;
	for (let r = 0; r < rows; r++) {
		const pos = pastLen + Math.floor(r / nHeads);
		const bse = r * headDim;
		for (let i = 0; i < half; i++) {
			const freq = pos / (base ** ((2 * i) / headDim) * ff[i]);
			const c = Math.cos(freq), s = Math.sin(freq);
			const x0 = x[bse + i], x1 = x[bse + i + half];
			o[bse + i] = x0 * c - x1 * s;
			o[bse + i + half] = x1 * c + x0 * s;
		}
	}
	return o;
}

function ropeCpu(x: Float32Array, rows: number, headDim: number, nHeads: number, pastLen = 0, base = 10000): Float32Array {
	const o = new Float32Array(x.length);
	const half = headDim / 2;
	for (let r = 0; r < rows; r++) {
		const pos = pastLen + Math.floor(r / nHeads);
		const bse = r * headDim;
		for (let i = 0; i < half; i++) {
			const freq = pos / base ** ((2 * i) / headDim);
			const c = Math.cos(freq), s = Math.sin(freq);
			const x0 = x[bse + i], x1 = x[bse + i + half];
			o[bse + i] = x0 * c - x1 * s;
			o[bse + i + half] = x1 * c + x0 * s;
		}
	}
	return o;
}

function addBiasCpu(x: Float32Array, bias: Float32Array, cols: number): Float32Array {
	return x.map((v, i) => v + bias[i % cols]) as Float32Array;
}

// Config d'UNE couche : la fenêtre et la base RoPE peuvent varier par couche (Gemma 3 alterne
// 5 couches locales fenêtrées θ=10k et 1 globale pleine θ=1M). Absents → comportement historique.
function layerCfg(cfg: LayerCfg, seq: number, idx: number, swaOk = true): LayerCfg {
	const window = swaOk ? (cfg.windowPerLayer?.[idx] ?? cfg.window ?? 0) : 0;
	const ropeTheta = cfg.ropeThetaPerLayer?.[idx] ?? cfg.ropeTheta;
	const skipRope = cfg.skipRopePerLayer?.[idx] ?? cfg.skipRope ?? false;
	return { ...cfg, seq, window, ropeTheta, skipRope };
}

function attentionCpu(q: Float32Array, k: Float32Array, v: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, pastLen = 0, scaleOverride?: number, softcap = 0, window = 0): Float32Array {
	const o = new Float32Array(nTokens * nHeads * headDim);
	const scale = scaleOverride ?? 1 / Math.sqrt(headDim);
	const cap = (s: number) => (softcap > 0 ? softcap * Math.tanh(s / softcap) : s);
	const group = nHeads / nKvHeads;
	for (let t = 0; t < nTokens; t++)
		for (let h = 0; h < nHeads; h++) {
			const kvh = Math.floor(h / group);
			const qB = (t * nHeads + h) * headDim;
			const last = pastLen + t;
			const jStart = window > 0 ? Math.max(0, last + 1 - window) : 0;
			const scores: number[] = [];
			let mx = -Infinity;
			for (let j = jStart; j <= last; j++) {
				const kB = (j * nKvHeads + kvh) * headDim;
				let dot = 0;
				for (let dd = 0; dd < headDim; dd++) dot += q[qB + dd] * k[kB + dd];
				const s = cap(dot * scale);
				scores[j] = s;
				if (s > mx) mx = s;
			}
			let denom = 0;
			for (let j = jStart; j <= last; j++) { scores[j] = Math.exp(scores[j] - mx); denom += scores[j]; }
			for (let j = jStart; j <= last; j++) {
				const w = scores[j] / denom;
				const vB = (j * nKvHeads + kvh) * headDim;
				for (let dd = 0; dd < headDim; dd++) o[qB + dd] += w * v[vB + dd];
			}
		}
	return o;
}

// Tanh-approx GELU, matching the geglu shader.
function geluTanh(v: number): number {
	return 0.5 * v * (1 + Math.tanh(0.7978845608 * (v + 0.044715 * v * v * v)));
}

function layerForwardCpu(x: Float32Array, cfg: LayerCfg, w: LayerWeights): Float32Array {
	const { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps } = cfg;
	const kvDim = nKvHeads * headDim;
	const qDim = nHeads * headDim;
	const onePlus = cfg.rmsGainOnePlus === true;
	const softcap = cfg.attnLogitSoftcap ?? 0;
	const n1 = rmsnormCpu(x, w.attnNorm, seq, d, eps, onePlus);
	let qP = matmulCpu(n1, w.wq, seq, d, qDim);
	let kP = matmulCpu(n1, w.wk, seq, d, kvDim);
	let vP = matmulCpu(n1, w.wv, seq, d, kvDim);
	if (w.bq) qP = addBiasCpu(qP, w.bq, qDim);
	if (w.bk) kP = addBiasCpu(kP, w.bk, kvDim);
	if (w.bv) vP = addBiasCpu(vP, w.bv, kvDim);
	if (w.qNorm) qP = rmsnormCpu(qP, w.qNorm, seq * nHeads, headDim, eps, onePlus);
	if (w.kNorm) kP = rmsnormCpu(kP, w.kNorm, seq * nKvHeads, headDim, eps, onePlus);
	const q = ropeCpu(qP, seq * nHeads, headDim, nHeads, 0, ropeTheta);
	const k = ropeCpu(kP, seq * nKvHeads, headDim, nKvHeads, 0, ropeTheta);
	const attn = attentionCpu(q, k, vP, seq, nHeads, nKvHeads, headDim, 0, cfg.attnScale, softcap);
	let proj = matmulCpu(attn, w.wo, seq, qDim, d);
	if (w.postAttnNorm) proj = rmsnormCpu(proj, w.postAttnNorm, seq, d, eps, onePlus);
	const h = x.map((val, i) => val + proj[i]) as Float32Array;
	const n2 = rmsnormCpu(h, w.ffnNorm, seq, d, eps, onePlus);
	const gate = matmulCpu(n2, w.wgate, seq, d, ffn);
	const up = matmulCpu(n2, w.wup, seq, d, ffn);
	const g = (cfg.act === 'gelu'
		? gate.map((val, i) => geluTanh(val) * up[i])
		: gate.map((val, i) => (val / (1 + Math.exp(-val))) * up[i])) as Float32Array;
	let down = matmulCpu(g, w.wdown, seq, ffn, d);
	if (w.postFfnNorm) down = rmsnormCpu(down, w.postFfnNorm, seq, d, eps, onePlus);
	return h.map((val, i) => val + down[i]) as Float32Array;
}
