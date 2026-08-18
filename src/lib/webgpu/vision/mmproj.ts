// Vision Qwen2-VL — jalon V1/V2 : lecture du mmproj GGUF (ViT + merger publiés par llama.cpp en
// fichier séparé du LLM) et chargement des poids en handles GPU. Voir docs/vision-feasibility.md.
//
// Le mmproj est un GGUF d'architecture `clip` : métadonnées sous `clip.vision.*`, tenseurs nommés
// `v.patch_embd.weight` (+ `.weight.1` : le « conv3d » temporel de Qwen2-VL est stocké en DEUX
// tranches, une par frame — image fixe ⇒ frames identiques), `v.blk.{i}.{ln1,attn_q,attn_k,attn_v,
// attn_out,ln2,ffn_up,ffn_down}.{weight,bias}`, `v.post_ln.*` (le ln_q du merger) et `mm.0/mm.2.*`
// (le MLP du merger, 5120 → 5120 → dim LLM). Les noms/l'ordre ffn sont vérifiés PAR LES SHAPES au
// chargement plutôt que supposés (les conversions llama.cpp ont varié).
//
// Téléchargement : en-tête via UNE plage HTTP (pas de tokenizer dans un mmproj → en-tête ~Ko),
// puis une plage par tenseur (cache + reprise hérités de fetchRange). Matmuls quantifiées q8 SUR
// le GPU au chargement (f16 → ~0,7 Go VRAM au lieu de 2,7 f32) ; normes/biais f32 ; le
// patch-embedding reste CPU (1280×1176 ≈ 6 Mo) — il est appliqué en matmul de session.

import { parseGguf, type Manifest, type TensorInfo } from '../ggufParser';
import { rangeSource } from '../source';
import { coalescedSpan } from '../model';
import { toF32, type TensorData } from '../../safetensors';
import type { WebGpuEngine } from '../kernels';

type GpuT = any;

export interface VitConfig {
	dim: number;        // largeur du ViT (Qwen2-VL : 1280)
	layers: number;     // 32
	heads: number;      // 16 (headDim 80)
	headDim: number;
	hidden: number;     // MLP (5120)
	patch: number;      // 14
	merge: number;      // fusion spatiale 2×2 → 1 token
	temporal: number;   // patch temporel (2 — frames dupliquées pour une image fixe)
	eps: number;        // LayerNorm
	outDim: number;     // dim du LLM en sortie du merger (2B : 1536)
	theta: number;      // base RoPE 2D (10000)
	imageMean: number[]; imageStd: number[]; // normalisation CLIP du pré-traitement
}

export interface VitLayerWeights<T = Float32Array> {
	ln1g: T; ln1b: T;
	qw: T; qb: T; kw: T; kb: T; vw: T; vb: T;
	ow: T; ob: T;
	ln2g: T; ln2b: T;
	fc1w: T; fc1b: T; fc2w: T; fc2b: T;
}

export interface VitWeights<T = Float32Array> {
	patchW: Float32Array; // [dim, temporal·3·patch²] CPU — matmul d'entrée (≈6 Mo)
	layers: VitLayerWeights<T>[];
	lnqG: T; lnqB: T;     // ln_q du merger (v.post_ln)
	mm0w: T; mm0b: T;     // [hidden_m, dim·merge²]
	mm2w: T; mm2b: T;     // [outDim, hidden_m]
}

// ── V1 : inspection — parse l'en-tête, tableau des tenseurs + métadonnées en console. ──
export async function inspectMmproj(url: string): Promise<{ arch: string; nTensors: number; totalMB: number; cfg: Partial<VitConfig> }> {
	const man = await parseHeader(url);
	const rows = Object.entries(man.tensors).map(([name, t]) => ({ name, type: t.type, shape: t.shape.join('×'), MB: +(t.bytes / 1e6).toFixed(2) }));
	console.log(`[mmproj] ${url}: arch=${man.arch}, ${rows.length} tenseurs`);
	if (console.table) console.table(rows); else console.log(rows);
	const meta = Object.fromEntries(Object.entries(man.metadata).filter(([k]) => !/tokenizer|general\.name/.test(k)));
	console.log('[mmproj] métadonnées :', meta);
	const cfg = configFromMeta(man);
	console.log('[mmproj] config déduite :', cfg);
	const totalMB = rows.reduce((s, r) => s + r.MB, 0);
	return { arch: man.arch, nTensors: rows.length, totalMB: +totalMB.toFixed(1), cfg };
}

// En-tête GGUF via une plage : un mmproj n'a pas de tokenizer, l'en-tête tient largement dans 4 Mo
// (on double en cas d'échec de parse, jusqu'à 64 Mo).
async function parseHeader(url: string): Promise<Manifest> {
	const src = rangeSource(url, 0);
	for (let size = 4 * 1024 * 1024; size <= 64 * 1024 * 1024; size *= 2) {
		try {
			const head = await src.bytes(0, size);
			// parseGguf lit un Blob et ne touche qu'à l'en-tête — le Blob partiel suffit.
			return await parseGguf(new Blob([head.slice() as unknown as BlobPart]));
		} catch (e) {
			if (size >= 64 * 1024 * 1024) throw e;
		}
	}
	throw new Error('en-tête mmproj illisible');
}

function metaNum(man: Manifest, keys: string[], def: number): number {
	for (const k of keys) { const v = man.metadata[k]; if (v !== undefined) return Number(v); }
	return def;
}

function configFromMeta(man: Manifest): Partial<VitConfig> {
	const dim = metaNum(man, ['clip.vision.embedding_length'], 1280);
	const heads = metaNum(man, ['clip.vision.attention.head_count'], 16);
	const asArr = (v: unknown, def: number[]) => (Array.isArray(v) ? v.map(Number) : def);
	return {
		dim,
		layers: metaNum(man, ['clip.vision.block_count'], 32),
		heads,
		headDim: dim / heads,
		hidden: metaNum(man, ['clip.vision.feed_forward_length'], 0) || undefined,
		patch: metaNum(man, ['clip.vision.patch_size'], 14),
		merge: metaNum(man, ['clip.vision.spatial_merge_size'], 2),
		temporal: 2,
		eps: metaNum(man, ['clip.vision.attention.layer_norm_epsilon'], 1e-6),
		theta: 10000,
		imageMean: asArr(man.metadata['clip.vision.image_mean'], [0.48145466, 0.4578275, 0.40821073]),
		imageStd: asArr(man.metadata['clip.vision.image_std'], [0.26862954, 0.26130258, 0.27577711]),
	};
}

// ── V2 : chargement des poids en handles GPU. ──
export async function loadMmproj(engine: WebGpuEngine, url: string, onProgress?: (s: string) => void): Promise<{ cfg: VitConfig; w: VitWeights<GpuT> }> {
	const man = await parseHeader(url);
	const src = rangeSource(url, 0);
	const T = man.tensors;
	const get = (name: string): TensorInfo => {
		const t = T[name];
		if (!t) throw new Error(`mmproj : tenseur manquant "${name}". Présents (extrait) : ${Object.keys(T).slice(0, 10).join(', ')}…`);
		return t;
	};
	// ── Préchargement par SPANS COALESCÉS, en parallèle ────────────────────────────────────────────
	// Avant : une plage HTTP par tenseur, chacune attendue avant la suivante (16 `await` par bloc ×
	// 32 blocs ≈ 512 allers-retours EN SÉRIE) — à 100 ms de latence, une minute de pure attente
	// réseau, bien davantage sur un CDN chargé : c'est ce qui faisait les ~11 minutes de chargement.
	// Ici : les tenseurs d'un même bloc sont contigus dans le GGUF → UNE plage par bloc (même
	// `coalescedSpan` que le chargeur BRIK, avec son garde-fou de non-contiguïté), et 4 plages en vol.
	// Repli : un span refusé (tenseurs non contigus) retombe sur le chemin par-tenseur, jamais bloquant.
	// Kill-switch de diagnostic (convention du repo) : ?mmprojspans=0 → chemin par-tenseur d'origine.
	// Sert à PROUVER l'équivalence (l'empreinte du patch-embedding doit être identique aux deux).
	const spansOn = (() => { try { return new URLSearchParams(location.search).get('mmprojspans') !== '0'; } catch { return true; } })();
	const spanCache = new Map<string, Uint8Array>();
	const prefetchSpans = async (): Promise<void> => {
		if (!spansOn) { console.warn('[mmproj] spans coalescés COUPÉS par ?mmprojspans=0 : une plage par tenseur (lent)'); return; }
		const groups = new Map<string, string[]>();
		for (const name of Object.keys(T)) {
			const m = name.match(/^v\.blk\.(\d+)\./);
			groups.set(m ? `blk${m[1]}` : 'misc', [...(groups.get(m ? `blk${m[1]}` : 'misc') ?? []), name]);
		}
		const plans: { names: string[]; start: number; end: number }[] = [];
		for (const names of groups.values()) {
			const s = coalescedSpan(names.map((n) => ({ offset: T[n].offset, bytes: T[n].bytes })));
			if (s) plans.push({ names, start: s.start, end: s.end });
		}
		let done = 0;
		let next = 0;
		const worker = async () => {
			for (;;) {
				const i = next++;
				if (i >= plans.length) return;
				const p = plans[i];
				try {
					const span = await src.bytes(p.start, p.end - p.start);
					for (const n of p.names) spanCache.set(n, span.subarray(T[n].offset - p.start, T[n].offset - p.start + T[n].bytes));
				} catch { /* repli par-tenseur dans data() */ }
				onProgress?.(`mmproj : téléchargement ${++done}/${plans.length}…`);
			}
		};
		await Promise.all(Array.from({ length: Math.min(4, plans.length) }, worker));
	};
	onProgress?.('mmproj : téléchargement…');
	await prefetchSpans();

	const data = async (name: string): Promise<TensorData> => {
		const t = get(name);
		const bytes = spanCache.get(name) ?? (await src.bytes(t.offset, t.bytes));
		if (t.type === 'F32') return new Float32Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + t.bytes));
		if (t.type === 'F16') return { f16: bytes.slice(), n: t.nElems };
		throw new Error(`mmproj : dtype ${t.type} non géré pour "${name}" (attendu F16/F32. Utiliser le mmproj f16)`);
	};
	// Quantification q8 SANS vidange du pipeline : l'ancien `await waitGpu()` par tenseur imposait
	// 322 synchronisations complètes du GPU (10 matrices × 32 blocs + le merger), chacune sérialisée
	// avec la requête réseau suivante. Les commandes s'empilent dans la file ; une seule attente
	// finale (avant de rendre les handles) suffit à garantir que tout est exécuté.
	const q8 = async (name: string): Promise<GpuT> => engine.quantizeQ8Gpu(await data(name));
	const f32 = async (name: string): Promise<GpuT> => engine.uploadGpu(await data(name));

	const cfgP = configFromMeta(man);
	const dim = cfgP.dim!, layers = cfgP.layers!;

	// Patch-embedding : 1 ou 2 tranches temporelles [dim, 3·patch²] → matrice CPU [dim, temporal·3·patch²]
	// dans l'ordre des features du pré-traitement (canal, temporel, py, px) — voir preprocess.ts.
	onProgress?.('mmproj : patch-embedding…');
	const p0 = toF32(await data('v.patch_embd.weight'));
	const p1 = T['v.patch_embd.weight.1'] ? toF32(await data('v.patch_embd.weight.1')) : p0;
	const per = p0.length / dim;            // 3·patch² par tranche (588)
	const pxl = per / 3;                    // patch² (196)
	const temporal = 2;
	const featLen = 3 * temporal * pxl;     // 1176
	const patchW = new Float32Array(dim * featLen);
	for (let o = 0; o < dim; o++)
		for (let c = 0; c < 3; c++)
			for (let p = 0; p < pxl; p++) {
				// tranche t : features source (c, p) → destination (c, t, p)
				patchW[o * featLen + (c * temporal + 0) * pxl + p] = p0[o * per + c * pxl + p];
				patchW[o * featLen + (c * temporal + 1) * pxl + p] = p1[o * per + c * pxl + p];
			}

	// Blocs. L'ordre ffn_up/ffn_down est vérifié par shape : fc1 = dim→hidden, fc2 = hidden→dim.
	const wl: VitLayerWeights<GpuT>[] = [];
	let hidden = cfgP.hidden ?? 0;
	for (let i = 0; i < layers; i++) {
		onProgress?.(`mmproj : bloc ${i + 1}/${layers}…`);
		const B = `v.blk.${i}.`;
		const upInfo = get(`${B}ffn_up.weight`);
		const upIsFc1 = upInfo.shape[0] === dim; // shape GGUF = [in, out]
		if (!hidden) hidden = upIsFc1 ? upInfo.shape[1] : upInfo.shape[0];
		const [fc1n, fc2n] = upIsFc1 ? ['ffn_up', 'ffn_down'] : ['ffn_down', 'ffn_up'];
		wl.push({
			ln1g: await f32(`${B}ln1.weight`), ln1b: await f32(`${B}ln1.bias`),
			qw: await q8(`${B}attn_q.weight`), qb: await f32(`${B}attn_q.bias`),
			kw: await q8(`${B}attn_k.weight`), kb: await f32(`${B}attn_k.bias`),
			vw: await q8(`${B}attn_v.weight`), vb: await f32(`${B}attn_v.bias`),
			ow: await q8(`${B}attn_out.weight`), ob: await f32(`${B}attn_out.bias`),
			ln2g: await f32(`${B}ln2.weight`), ln2b: await f32(`${B}ln2.bias`),
			fc1w: await q8(`${B}${fc1n}.weight`), fc1b: await f32(`${B}${fc1n}.bias`),
			fc2w: await q8(`${B}${fc2n}.weight`), fc2b: await f32(`${B}${fc2n}.bias`),
		});
	}

	onProgress?.('mmproj : merger…');
	const mm2Info = get('mm.2.weight');
	const outDim = mm2Info.shape[1]; // [in=5120, out=dimLLM]
	const w: VitWeights<GpuT> = {
		patchW,
		layers: wl,
		lnqG: await f32('v.post_ln.weight'), lnqB: await f32('v.post_ln.bias'),
		mm0w: await q8('mm.0.weight'), mm0b: await f32('mm.0.bias'),
		mm2w: await q8('mm.2.weight'), mm2b: await f32('mm.2.bias'),
	};
	// UNE attente finale : toutes les quantifications q8 enfilées ci-dessus doivent être exécutées
	// avant que l'appelant se serve des handles (remplace les 322 vidanges par-tenseur).
	await engine.waitGpu();
	spanCache.clear(); // les octets bruts ont fini leur vie : tout est en VRAM
	const cfg: VitConfig = {
		dim, layers, heads: cfgP.heads!, headDim: cfgP.headDim!, hidden,
		patch: cfgP.patch!, merge: cfgP.merge!, temporal, eps: cfgP.eps!, outDim,
		theta: cfgP.theta!, imageMean: cfgP.imageMean!, imageStd: cfgP.imageStd!,
	};
	console.log('[mmproj] chargé :', { dim, layers, heads: cfg.heads, hidden, outDim, patch: cfg.patch, merge: cfg.merge });
	return { cfg, w };
}
