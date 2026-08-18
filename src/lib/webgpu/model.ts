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
import { coalescedSpan } from './layerSpans';
import { ropeInterleavedFor } from './ropeConvention';
import { unpackQ4 } from '../brik/q4web';
import { unpackQ8 } from '../brik/q8web';
import { unpackQ3 } from '../brik/q3web';
import { urlFlag } from './urlFlags';

// Layer-weight precision tiers, fastest-loading → smallest-VRAM: f32 (1×), f16 (½), q8 (~¼,
// near-f16 quality), q4 (⅛, int4). q8/q4 keep the weights quantized in VRAM and dequant on-the-fly.
export type WeightPrecision = 'f32' | 'f16' | 'q8' | 'q4' | 'q3';

// Where the model reads tensor bytes from. A local Blob/File slices in memory; a streaming source
// (see source.ts) range-fetches from a URL on demand + caches. The model only needs `bytes()`.
export interface TensorSource {
	bytes(offset: number, length: number): Promise<Uint8Array>;
}

// Wrap a Blob/File in a TensorSource (lazy slice), or pass a TensorSource through. Branch on
// `instanceof Blob` — NOT on the presence of a `.bytes()` method: modern browsers added a no-arg
// `Blob.prototype.bytes()`, so feature-detecting `.bytes` would mistake a Blob for a streaming
// source and read the WHOLE file per tensor (wrong bytes / NotReadableError on large local files).
function asSource(src: Blob | File | TensorSource): TensorSource {
	if (src instanceof Blob) {
		return { bytes: async (offset, length) => new Uint8Array(await src.slice(offset, offset + length).arrayBuffer()) };
	}
	return src as TensorSource;
}

// `coalescedSpan` et `spanRawTensor` vivent dans ./layerSpans (module feuille, cf. son en-tête) ;
// ré-exportés ici pour ne pas casser les appelants historiques.
export { coalescedSpan, spanRawTensor } from './layerSpans';

export class CustomWebModel {
	private engine: WebGpuEngine;
	private source: TensorSource;
	public manifest: Manifest;
	private rawCache = new Map<string, Uint8Array>();

	constructor(engine: WebGpuEngine, file: Blob | File | TensorSource, manifest: Manifest) {
		this.engine = engine;
		this.source = asSource(file);
		this.manifest = manifest;
		// A BRIK stored natively quantized must run in its stored precision by default, otherwise the
		// resident path would try to f32-expand a Q4W/Q8W tensor (and uploadGpuRaw it as f32). f16/
		// GGUF sources keep the historical f32 default (the UI toggle still offers f16/q8/q4).
		this.weightPrecision = this.nativePrecision;
	}

	// The default weight precision = whatever the weights are STORED as, so loading does ZERO
	// conversion (no repack, no CPU loop): BRIK quants upload as-is (Q4W→q4, Q8W→q8), BRIK f16 uploads
	// raw f16 (when the GPU supports it), and a GGUF (k-quant on disk) runs f32 via GPU dequant — the
	// only path that needs no per-element CPU work. Picking a *different* precision in the UI is an
	// opt-in trade (it repacks once); for fast decode without that cost, ship the model as BRIK.
	get nativePrecision(): WeightPrecision {
		const t = this.manifest.tensors['blk.0.attn_q.weight'];
		if (t?.type === 'Q4W') return 'q4';
		if (t?.type === 'Q8W') return 'q8';
		if (t?.type === 'Q3W') return 'q3';
		// Source NON quantifiée (GGUF k-quant, BRIK f16) : on vise **q8**, pas f16. Le décodage relit
		// tous les poids à chaque token, donc il est limité par la bande passante — et le q8 lit deux
		// fois moins d'octets que le f16 pour un prefill identique et une qualité qui ne bouge pas
		// (mesures dans pickAutoPrecision). Le coût de conversion est le même dans les deux cas : un
		// dequant+pack sur GPU au premier chargement, sans boucle CPU ni gel de l'onglet.
		// f16 ne subsiste que si le chemin q8 est indisponible ; f32 si même le f16 manque.
		if (this.supportsQ8) return 'q8';
		return this.engine?.hasF16 ? 'f16' : 'f32';
	}

	// BRIK « mixte » (tier de build 'mixed') : dtype PAR TENSEUR — attention q8, corps q4. Le sondage
	// nativePrecision (attn_q) remonte alors 'q8', et matPrecision charge chaque matrice telle quelle.
	// Sert au bandeau diagnostic (afficher « mixte » plutôt qu'un « int8 » trompeur).
	get isMixedNative(): boolean {
		const a = this.manifest.tensors['blk.0.attn_q.weight']?.type;
		const f = this.manifest.tensors['blk.0.ffn_gate.weight']?.type;
		return (a === 'Q4W' || a === 'Q8W') && (f === 'Q4W' || f === 'Q8W') && a !== f;
	}

	get loaded() {
		return this.manifest !== null;
	}

	async loadManifest(): Promise<Manifest> {
		return this.manifest;
	}

	// Raw bytes of a tensor, read from the source (local slice or streamed range) and cached in RAM.
	private async rawTensor(name: string): Promise<Uint8Array> {
		const cached = this.rawCache.get(name);
		if (cached) return cached;
		const t = this.manifest.tensors[name];
		if (!t) throw new Error('tensor absent du manifeste: ' + name);

		// Pull this tensor's specific binary block (in-memory slice, or an HTTP range fetch).
		const bytes = await this.source.bytes(t.offset, t.bytes);
		return this.cacheRaw(name, bytes);
	}

	// LE point d'entrée UNIQUE du cache d'octets bruts. Il existe parce qu'il a été contourné :
	// `fetchLayerSpan` (une requête Range pour toute une couche) remplissait `rawCache` directement,
	// donc les poids servis au chemin RÉSIDENT n'avaient jamais subi la dé-permutation Q/K de la
	// famille llama — alors que le chemin classique, qui passe par `rawTensor`, l'avait. Symptôme :
	// Llama 3.2 répondait du charabia, tout en corrélant à 1,0000 avec la référence CPU sur UN token
	// (à la position 0 le RoPE est l'identité, et une permutation appliquée à Q ET à K se simplifie
	// dans le produit scalaire — la faute était donc invisible exactement là où on la cherchait).
	// Toute nouvelle voie d'alimentation du cache DOIT passer ici.
	private cacheRaw(name: string, bytes: Uint8Array): Uint8Array {
		const fixed = this.maybeUnpermuteLlamaQk(name, bytes);
		this.rawCache.set(name, fixed);
		return fixed;
	}

	// ── Fix Llama : dé-permutation des lignes Q/K au chargement. ───────────────────────────────────
	// convert_hf_to_gguf PERMUTE les lignes de attn_q/attn_k pour l'arch `llama` (convention RoPE
	// « norm » interleaved de llama.cpp : gguf[2j]=hf[j], gguf[2j+1]=hf[j+hd/2] par tête) — notre
	// kernel est rotate_half (neox, la convention HF). On inverse ici, à GRANULARITÉ DE LIGNES sur
	// les bytes bruts : valable pour tous les dtypes GGUF (F32/F16/Q*_0/Q*_K, lignes autonomes de
	// taille uniforme). Les quants BRIK (Q8W/Q4W, layout SoA plein-tenseur) ne s'y prêtent pas →
	// erreur claire (convertir un GGUF llama en BRIK n'est pas encore supporté).
	// Kill-switches de diagnostic (convention du repo) :
	//   ?ropenorm=0 → RETOUR à l'ancien couple : dé-permutation des lignes Q/K au chargement +
	//                 kernel rotate_half. Sert à l'A/B ; c'était le défaut jusqu'au 2026-08-14.
	//   ?unperm=0   → aucune dé-permutation du tout (isole cette réécriture de poids).
	//
	// DEPUIS LE 2026-08-14, le kernel à paires adjacentes est le DÉFAUT pour llama/mistral3/smollm3.
	// Ce qui a levé la réserve : la cause du charabia llama était ailleurs (le préchargement par span
	// court-circuitait la dé-permutation — corrigé le 2026-08-13, cf. ROADMAP §6), et les trois
	// familles ont été retestées en vrai Chrome avec ce kernel, chacune répondant juste.
	// Ce que ça change concrètement :
	//   * plus de RÉÉCRITURE des lignes Q/K au chargement (une passe CPU sur deux tenseurs par couche) ;
	//   * les BRIK de ces archs redeviennent lisibles — la dé-permutation par lignes était impossible
	//     sur un layout SoA quantifié (Q8W/Q4W/Q3W), d'où le refus historique de convertir un GGUF
	//     llama en .brik. C'est ce refus qui saute.
	// ?timing=1 → chronométrage par étape du forward (diagnostic, cf. logitsKV).
	static timingOn = (() => { try { return urlFlag('timing') === '1'; } catch { return false; } })();
	static ropeNormOn = (() => { try { return urlFlag('ropenorm') !== '0'; } catch { return true; } })();
	static unpermOn = (() => { try { return urlFlag('unperm') !== '0'; } catch { return true; } })();
	private maybeUnpermuteLlamaQk(name: string, raw: Uint8Array): Uint8Array {
		if (!CustomWebModel.unpermOn) return raw;
		// Le kernel tourne les paires ADJACENTES comme ggml : les poids se lisent alors TELS QUELS,
		// il n'y a plus rien à réécrire (et les BRIK quantifiés de ces archs redeviennent lisibles).
		// On interroge l'ARCH (ropeConvention.ts) et non `config.ropeInterleaved` : ce drapeau n'est
		// posé que par le parser GGUF. Un .brik de la même arch ne le porte pas — il retombait donc
		// sur la dé-permutation, impossible sur son layout SoA quantifié, d'où le refus de charger.
		if (CustomWebModel.ropeNormOn && ropeInterleavedFor(this.manifest.arch)) return raw;
		// Toutes les archs converties en RoPE « NORM » par llama.cpp (Q/K permutés) : llama (3.x),
		// mistral3 (Ministral 3), smollm3 — vérifié dans llama-model.cpp (LLAMA_ROPE_TYPE_NORM).
		if (!['llama', 'mistral3', 'smollm3'].includes(this.manifest.arch)) return raw;
		const isQ = name.endsWith('.attn_q.weight'), isK = name.endsWith('.attn_k.weight');
		if (!isQ && !isK) return raw;
		const { nHeads, nKvHeads, headDim } = this.manifest.config;
		const t = this.manifest.tensors[name];
		// Q3W inclus : ses plans de bits (q3web) ne sont pas non plus dé-permutables par lignes — sans
		// cette garde, un BRIK q3 de llama passait et sortait des poids CORROMPUS sans erreur.
		if (t.type === 'Q8W' || t.type === 'Q4W' || t.type === 'Q3W') throw new Error('BRIK d’un modèle llama non supporté (lignes Q/K permutées) : charger le GGUF directement.');
		const heads = isQ ? nHeads : nKvHeads;
		const nRows = heads * headDim;
		const rowBytes = t.bytes / nRows;
		if (!Number.isInteger(rowBytes)) throw new Error(`${name} : lignes non uniformes (${t.bytes} o / ${nRows} lignes). Dé-permutation impossible.`);
		const half = headDim / 2;
		const out = new Uint8Array(raw.byteLength);
		for (let h = 0; h < heads; h++) {
			const base = h * headDim;
			for (let j = 0; j < half; j++) {
				out.set(raw.subarray((base + 2 * j) * rowBytes, (base + 2 * j + 1) * rowBytes), (base + j) * rowBytes);
				out.set(raw.subarray((base + 2 * j + 1) * rowBytes, (base + 2 * j + 2) * rowBytes), (base + half + j) * rowBytes);
			}
		}
		return out;
	}

	// ── Fetch coalescé par couche ──
	// Les tenseurs d'un bloc sont CONTIGUS dans le .brik (un shard par bloc), mais les charger un
	// par un coûte 9-12 requêtes HTTP Range + autant d'entrées Cache API PAR COUCHE (~220 pour un
	// modèle entier : ~1-2 s de latence de requêtes à froid, ~200 ms de lookups à chaud). Ici : UN
	// span par couche, découpé localement en vues → ~25 requêtes et ~25 entrées de cache au total.
	// Échec → on retombe silencieusement sur le chemin par-tenseur (rawTensor), jamais bloquant.
	// Le calcul du span vit dans coalescedSpan (exporté) : le préchargement (source.ts prefetchBrik)
	// DOIT produire exactement les mêmes plages, sinon les clés du cache HTTP ne matchent pas.
	private layerSpan = new Map<number, Promise<void>>();
	private ensureLayerSpan(idx: number): Promise<void> {
		let p = this.layerSpan.get(idx);
		if (!p) {
			p = this.fetchLayerSpan(idx).catch(() => { this.layerSpan.delete(idx); });
			this.layerSpan.set(idx, p);
		}
		return p;
	}
	private async fetchLayerSpan(idx: number): Promise<void> {
		const prefix = `blk.${idx}.`;
		const entries = Object.entries(this.manifest.tensors).filter(([n]) => n.startsWith(prefix));
		const s = coalescedSpan(entries.map(([, t]) => t));
		if (!s) return;
		const span = await this.source.bytes(s.start, s.end - s.start);
		for (const [n, t] of entries) {
			// `cacheRaw` et non `rawCache.set` : c'est ici que la dé-permutation Q/K était sautée.
			if (!this.rawCache.has(n)) this.cacheRaw(n, span.subarray(t.offset - s.start, t.offset - s.start + t.bytes));
		}
	}

	// Dequantize a full tensor (by manifest type) to f32 (CPU-visible). Used for small tensors
	// (norms/biases).
	// Accès DIAGNOSTIC à un tenseur en f32 (déquantifié) — pour écrire une référence CPU du forward
	// indépendante du pipeline GPU. Sans ça, impossible de départager « kernels justes mais mal
	// composés » de « kernels faux » : selfValidate ne teste que les kernels, un par un.
	// Coûteux (readback complet) : usage banc uniquement.
	// `raw` : renvoie les octets TELS QU'ILS SONT DANS LE FICHIER, sans la dé-permutation des lignes
	// Q/K appliquée au chargement pour la famille llama. Indispensable pour écrire une référence
	// honnête : comparer le GPU à une référence qui consomme les MÊMES poids dé-permutés validerait
	// une dé-permutation fautive (les deux seraient faux à l'identique). Avec `raw`, la référence
	// applique la convention de ggml (paires adjacentes) sur les poids d'origine — la vraie vérité.
	async debugTensorF32(name: string, raw = false): Promise<Float32Array> {
		if (!raw) return this.dequant(name);
		const prev = CustomWebModel.unpermOn;
		const hadCache = this.rawCache.has(name);
		const cached = this.rawCache.get(name);
		try {
			CustomWebModel.unpermOn = false;   // court-circuite maybeUnpermuteLlamaQk
			this.rawCache.delete(name);        // le cache contient la version dé-permutée
			return await this.dequant(name);
		} finally {
			CustomWebModel.unpermOn = prev;
			this.rawCache.delete(name);
			if (hadCache && cached) this.rawCache.set(name, cached);
		}
	}

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
	// f16 matmul (matmul_t_f16w).
	private async dequantGpuF16(name: string): Promise<any> {
		const t = this.manifest.tensors[name];
		const bytes = await this.rawTensor(name);
		// BRIK f16 (and GGUF F16) weights are ALREADY f16 on disk → upload the raw bytes straight to
		// a persistent VRAM buffer (matmul_t_f16w reads them as vec4<f16>). This skips the
		// f16→f32→f16 round-trip the quantized sources need, so the model stays half-size in VRAM
		// with ZERO CPU transform — the point of the "heavy but fast" f16 tier. Quantized sources
		// (Q4_K, Q8_0, …) still dequant to f32 first, then pack to f16 once.
		if (t.type === 'F16') return this.engine.uploadGpuRawF16(bytes);
		// Quantized GGUF source: dequant to an f32 GPU buffer, then pack to f16 ON THE GPU. No CPU
		// f32→f16 loop (which froze the main thread for tens of seconds on a whole model) and no
		// readback — the whole build stays on the GPU.
		const f32gpu = this.engine.dequantizeToGpu(t.type, bytes, t.nElems);
		const f16 = this.engine.f32ToF16Gpu(f32gpu, t.nElems);
		f32gpu.destroy?.();
		return f16;
	}

	// The weight stays 4-bit in VRAM (BRIK q4web), consumed by the fused q4 matmul. Two sources:
	//   • native Q4W (the tensor is ALREADY q4 on disk) → split the packed blob and upload the
	//     nibbles/scales/mins straight to VRAM. No dequant, no requant — the fast BRIK path.
	//   • f16/GGUF source → dequant to f32 once, then requantize to int4 (the runtime VRAM toggle).
	private async dequantGpuQ4(name: string): Promise<any> {
		const t = this.manifest.tensors[name];
		const bytes = await this.rawTensor(name);
		if (t.type !== 'Q4W') {
			const f32gpu = this.engine.dequantizeToGpu(t.type, bytes, t.nElems);
			const q = this.engine.f32ToQ4Gpu(f32gpu, t.nElems);
			f32gpu.destroy?.();
			return q; // { nib, sc, mn } already on the GPU
		}
		const q = unpackQ4(bytes, t.nElems);
		return {
			nib: this.engine.uploadGpuRaw(q.nibbles),
			sc: this.engine.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength)),
			mn: this.engine.uploadGpuRaw(new Uint8Array(q.mins.buffer, q.mins.byteOffset, q.mins.byteLength))
		};
	}

	// The weight stays 3-bit in VRAM (BRIK q3web) — the "extra-light" tier (~20% less than q4).
	// Native Q3W only: split the packed [lo|hi|scales|mins] blob and upload the 4 planes straight to
	// VRAM (no dequant, no requant — the fast BRIK path, consumed by the fused q3 matmul). A non-Q3W
	// source (there's no runtime f32→q3 quantizer) falls back to a f32 dequant + upload so it still
	// works, just without the 3-bit VRAM win.
	private async dequantGpuQ3(name: string): Promise<any> {
		const t = this.manifest.tensors[name];
		const bytes = await this.rawTensor(name);
		if (t.type !== 'Q3W') {
			const f32gpu = this.engine.dequantizeToGpu(t.type, bytes, t.nElems);
			return f32gpu; // plain f32 buffer → recMM's f32 path (no q3 packing available at runtime)
		}
		const q = unpackQ3(bytes, t.nElems);
		return {
			q3: true,
			lo: this.engine.uploadGpuRaw(new Uint8Array(q.lo.buffer, q.lo.byteOffset, q.lo.byteLength)),
			hi: this.engine.uploadGpuRaw(new Uint8Array(q.hi.buffer, q.hi.byteOffset, q.hi.byteLength)),
			sc: this.engine.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength)),
			mn: this.engine.uploadGpuRaw(new Uint8Array(q.mins.buffer, q.mins.byteOffset, q.mins.byteLength))
		};
	}

	// The weight stays 8-bit in VRAM (BRIK q8web) — the "heavy but fast" tier (~½ the VRAM of f16,
	// near-f16 quality). Native Q8W uploads as-is; a GGUF source is dequantized + requantized to int8
	// entirely on the GPU (quantize_q8) — no per-element CPU loop, no readback.
	private async dequantGpuQ8(name: string): Promise<any> {
		const t = this.manifest.tensors[name];
		const bytes = await this.rawTensor(name);
		if (t.type !== 'Q8W') {
			const f32gpu = this.engine.dequantizeToGpu(t.type, bytes, t.nElems);
			const q = this.engine.f32ToQ8Gpu(f32gpu, t.nElems);
			f32gpu.destroy?.();
			return q; // { codes, sc } already on the GPU
		}
		const q = unpackQ8(bytes, t.nElems);
		return {
			codes: this.engine.uploadGpuRaw(new Uint8Array(q.codes.buffer, q.codes.byteOffset, q.codes.byteLength)),
			sc: this.engine.uploadGpuRaw(new Uint8Array(q.scales.buffer, q.scales.byteOffset, q.scales.byteLength))
		};
	}

	// Free a cached weight whether it's a plain GPU buffer (f32/f16), a q4 {nib,sc,mn} triple, or a
	// q8 {codes,sc} pair.
	private static destroyWeight(b: any) {
		if (!b) return;
		if (b.q3) { b.lo?.destroy?.(); b.hi?.destroy?.(); b.sc?.destroy?.(); b.mn?.destroy?.(); }
		else if (b.nib) { b.nib?.destroy?.(); b.sc?.destroy?.(); b.mn?.destroy?.(); }
		else if (b.codes) { b.codes?.destroy?.(); b.sc?.destroy?.(); }
		else b.destroy?.();
	}

	// Precision of the persistent LAYER weight matrices: 'f32' (default), 'f16' (½ VRAM), 'q8' (~½
	// VRAM of f16, near-f16 quality — the "heavy but fast" tier) or 'q4' (¼ VRAM, weights kept
	// 4-bit). Norms/biases and the embed/logit projection stay f32.
	private weightPrecision: WeightPrecision = 'f32';
	get precision() { return this.weightPrecision; }

	// True if the fused int4/int8 matmuls are usable for this model (they dequant per 32-wide group,
	// so they need the contraction dim ÷ 32). Same condition for both q4 and q8.
	get supportsQ4(): boolean {
		const { d, ffn } = this.manifest.config;
		return d % 32 === 0 && ffn % 32 === 0;
	}
	get supportsQ8(): boolean { return this.supportsQ4; }
	get supportsQ3(): boolean { return this.supportsQ4; }

	// Diagnostic (desktop, ?prec= dans l'URL) : override de précision PAR matrice, pour isoler les
	// familles de tenseurs responsables du charabia int4 — ex. [['attn', 'q8']] = attention en q8,
	// reste au réglage global. Substring-match sur le nom GGUF (attn_q/attn_k/attn_v/attn_output/
	// ffn_gate/ffn_up/ffn_down). Restreint aux tiers quantifiés : recMM détecte la forme q4/q8 par
	// tenseur, alors que f16 est un flag PAR COUCHE (matF16) — un mix f16 dans une couche q4
	// prendrait le mauvais kernel. Actif seulement quand la précision de base est q4/q8 ; changer
	// les overrides exige un rechargement (pas de purge de cache dédiée — c'est un outil dev).
	public precOverrides: [string, 'q4' | 'q8'][] | null = null;
	private matPrecision(name: string): WeightPrecision {
		const base = this.weightPrecision;
		if ((base === 'q4' || base === 'q8') && this.precOverrides) {
			for (const [pat, p] of this.precOverrides) if (name.includes(pat)) return p;
		}
		// Précision NATIVE = zéro conversion, y compris pour un BRIK MIXTE (dtype par tenseur, ex.
		// corps q4 + attention q8) : chaque matrice quantifiée se charge TELLE QUELLE. Sans ça, le
		// tier global requantifierait l'attention q8 vers q4 (détruisant la qualité que le fichier
		// paye) ou gonflerait le corps q4 vers q8 (VRAM + repack pour zéro gain — un q4 requantifié
		// GARDE la qualité int4). Choisir explicitement un AUTRE tier reste uniforme, comme avant.
		if (base === this.nativePrecision) {
			const t = this.manifest.tensors[name]?.type;
			if (t === 'Q4W') return 'q4';
			if (t === 'Q8W') return 'q8';
			if (t === 'Q3W') return 'q3';
		}
		return base;
	}

	// Switch layer-weight precision: frees the currently-cached GPU buffers so the next forward
	// rebuilds them at the new precision. Only does work when the precision actually changes.
	public setWeightPrecision(p: WeightPrecision) {
		if (p === this.weightPrecision) return;
		if ((p === 'q4' || p === 'q8') && !this.supportsQ4) throw new Error(`${p} indisponible : d ou ffn non multiple de 32`);
		for (const w of this.layerGpuCache.values()) {
			for (const b of Object.values(w)) CustomWebModel.destroyWeight(b);
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
		const [postAttnNorm, postFfnNorm, qNorm, kNorm] = await Promise.all([
			this.dequant(`${p}.post_attention_norm.weight`).catch(() => undefined),
			this.dequant(`${p}.post_ffw_norm.weight`).catch(() => undefined),
			// QK-Norm (Qwen3/Gemma3) — absent sur Qwen2/Llama.
			this.dequant(`${p}.attn_q_norm.weight`).catch(() => undefined),
			this.dequant(`${p}.attn_k_norm.weight`).catch(() => undefined),
		]);
		const w = { attnNorm, wq, wk, wv, wo, ffnNorm, wgate, wup, wdown, bq, bk, bv, postAttnNorm, postFfnNorm, qNorm, kNorm } as LayerWeights;
		this.layerCache.set(idx, w);
		return w;
	}

	// GPU-resident layer weights: EVERY tensor (matrices AND norms/biases) is a persistent GPU
	// buffer, uploaded once and reused across all decode steps. Feeds engine.runDecodeGpu.
	private layerGpuCache = new Map<number, LayerWeightsGpu>();
	private finalNormGpu: any = null;

	// ── Préchauffe : mettre les poids sur le GPU AVANT le premier message ────────────────────────
	// Les poids d'une couche étaient chargés et quantifiés au PREMIER forward qui en a besoin. L'UI
	// annonçait donc « chargé », puis le premier message payait toute la mise en VRAM : mesuré le
	// 2026-08-13 sur DeepSeek-R1-Distill-Qwen-7B (4,7 Go) → **10,9 s facturés au prefill du 1er
	// message** (3,9 t/s), contre ~20 t/s dès le 2e. Vu de l'utilisateur : « chargé ✓ » puis onze
	// secondes d'attente inexpliquées, et une statistique de prefill fausse.
	// Ici on fait le travail pendant l'écran de chargement, où l'attente est attendue et affichée.
	// Bonus : un modèle trop gros pour la VRAM échoue MAINTENANT, avec un message clair, au lieu de
	// mourir au premier message.
	async warmup(onProgress?: (done: number, total: number) => void): Promise<void> {
		const { blockCount, d } = this.manifest.config;
		const total = blockCount + 1; // couches + tête de projection
		for (let i = 0; i < blockCount; i++) {
			await this.layerWeightsGpu(i);
			onProgress?.(i + 1, total);
		}
		await this.getFinalNormGpu();
		await this.getRopeFactors();
		// La tête logits (vocab × d, quantifiée en tuiles) est le plus gros poste unitaire.
		await this.getProjectionQ8(d);

		// ⚠️ CRÉER les buffers ne suffit PAS. `queue.writeBuffer` est différé : le driver ne
		// matérialise réellement les octets qu'au premier shader qui les LIT. Mesuré sur le 7B :
		// préparer les poids « coûtait » 0 ms, puis le premier forward passait 5,4 s dans l'exécution
		// GPU (contre 97 ms ensuite) — soit ~4,7 Go transférés à ce moment-là, facturés au prefill du
		// premier message. On force donc un forward JETABLE d'un token : il touche tous les poids,
		// toutes les couches et la tête, et c'est lui qui paye le transfert, ici, sous la barre de
		// progression. La session KV « warmup » est écartée juste après (le premier vrai message
		// arrive avec pastLen = 0, ce qui réinitialise le cache de toute façon).
		try {
			await this.topKKV([0], 0, 'brimkern-warmup', [], 1);
			this.reset();
		} catch (e) {
			console.warn('[warmup] passe à blanc impossible. Le premier message paiera le transfert :', e);
		}
		onProgress?.(total, total);
	}

	private async layerWeightsGpu(idx: number): Promise<LayerWeightsGpu> {
		const cached = this.layerGpuCache.get(idx);
		if (cached) return cached;
		await this.ensureLayerSpan(idx); // 1 requête Range pour toute la couche (au lieu de 9-12)
		const p = `blk.${idx}`;
		const up = (a: Float32Array) => this.engine.uploadGpu(a);
		// Projection matrices follow weightPrecision: q4 (4-bit triple), q8 (8-bit pair), f16 buffer,
		// or f32 (on-GPU). recMM auto-detects the q4/q8 shapes; matF16 flags the f16 buffer case.
		const prec = this.weightPrecision;
		const f16 = prec === 'f16';
		const mat = (name: string) => {
			const mp = this.matPrecision(name); // = prec, sauf override diagnostic par tenseur
			return mp === 'q3' ? this.dequantGpuQ3(name)
			: mp === 'q4' ? this.dequantGpuQ4(name)
			: mp === 'q8' ? this.dequantGpuQ8(name)
			: mp === 'f16' ? this.dequantGpuF16(name)
			: this.dequantGpu(name);
		};
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
		// Gemma2 sandwich norms + QK-Norm Qwen3/Gemma3 (absents sur Qwen2/Llama → undefined, no effect).
		const [postAttnNorm, postFfnNorm, qNorm, kNorm] = await Promise.all([
			this.dequant(`${p}.post_attention_norm.weight`).then(up).catch(() => undefined),
			this.dequant(`${p}.post_ffw_norm.weight`).then(up).catch(() => undefined),
			this.dequant(`${p}.attn_q_norm.weight`).then(up).catch(() => undefined),
			this.dequant(`${p}.attn_k_norm.weight`).then(up).catch(() => undefined),
		]);
		const w = { attnNorm, wq, wk, wv, wo, ffnNorm, wgate, wup, wdown, bq, bk, bv, postAttnNorm, postFfnNorm, qNorm, kNorm, matF16: f16 } as LayerWeightsGpu;
		this.layerGpuCache.set(idx, w);
		// Les octets bruts de la couche ont fini leur vie : tout est en VRAM. Les garder gardait le
		// MODÈLE ENTIER dupliqué dans le tas JS (les subarray retiennent l'ArrayBuffer du span) —
		// ~0,5 Go de heap sur un BRIK mobile, évictions et device-lost à la clé. On purge aussi
		// l'entrée layerSpan : un rebuild (setWeightPrecision) repasse par ensureLayerSpan, resservi
		// par le Cache API (mêmes clés), au lieu de retomber en fetchs par-tenseur. Les tenseurs hors
		// couche (token_embd relu à chaque prefill, normes finales, tête) restent en cache.
		const prefix = `blk.${idx}.`;
		for (const name of this.rawCache.keys()) if (name.startsWith(prefix)) this.rawCache.delete(name);
		this.layerSpan.delete(idx);
		return w;
	}

	private async getFinalNormGpu(): Promise<any> {
		if (!this.finalNormGpu) this.finalNormGpu = this.engine.uploadGpu(await this.dequant('output_norm.weight'));
		return this.finalNormGpu;
	}

	// Préchauffe : uploade couches + norme finale + tuiles de projection en VRAM AVANT que l'UI
	// annonce « Prêt ». Sans elle, tout ça se payait au PREMIER MESSAGE — parfois des dizaines de
	// secondes avec trois points de frappe pour seul feedback. Progression en OCTETS (tailles du
	// manifeste) pour brancher la barre de chargement existante. Batch de 4 : assez pour recouvrir
	// fetch/déquant/upload, sans le pic mémoire d'un Promise.all sur toutes les couches.
	public async prewarmGpu(onProgress?: (doneBytes: number, totalBytes: number) => void): Promise<void> {
		const { blockCount, d } = this.manifest.config;
		const layerBytes = new Array<number>(blockCount).fill(0);
		for (const [n, t] of Object.entries(this.manifest.tensors)) {
			const m = n.match(/^blk\.(\d+)\./);
			if (m) layerBytes[Number(m[1])] += t.bytes;
		}
		const totalBytes = layerBytes.reduce((a, b) => a + b, 0);
		let done = 0;
		const BATCH = 4;
		for (let i = 0; i < blockCount; i += BATCH) {
			const n = Math.min(BATCH, blockCount - i);
			await Promise.all(Array.from({ length: n }, (_, j) => this.layerWeightsGpu(i + j)));
			for (let j = 0; j < n; j++) done += layerBytes[i + j];
			onProgress?.(done, totalBytes);
		}
		await this.getFinalNormGpu();
		await this.getProjectionQ8(d);
	}

	// Reconstruct a contiguous q8web blob for `rows` rows (each d wide) from the SoA full blob (codes
	// section, then scales section). Lets gathered/tiled q8 embeddings ride the normal Q8W dequant
	// path without a bespoke layout. d % 32 == 0 so the 32-wide groups align to row boundaries.
	private static q8RowsBlob(raw: Uint8Array, totalElems: number, r0: number, rows: number, d: number): Uint8Array {
		const groupsPerRow = d / 32;
		const codeStart = r0 * d, codeLen = rows * d;
		const scaleStart = totalElems + r0 * groupsPerRow * 2, scaleLen = rows * groupsPerRow * 2;
		const blob = new Uint8Array(codeLen + scaleLen);
		blob.set(raw.subarray(codeStart, codeStart + codeLen), 0);
		blob.set(raw.subarray(scaleStart, scaleStart + scaleLen), codeLen);
		return blob;
	}

	// Même reconstruction par lignes pour q4web : [nibbles n/2 | scales f16 | mins f16] — les
	// groupes de 32 s'alignent aux lignes (d % 32 == 0), donc chaque section se découpe par lignes.
	private static q4RowsBlob(raw: Uint8Array, totalElems: number, r0: number, rows: number, d: number): Uint8Array {
		const gRow = d / 32;
		const nibBase = 0, scBase = totalElems / 2, mnBase = totalElems / 2 + (totalElems / 32) * 2;
		const nibLen = rows * d / 2, scLen = rows * gRow * 2;
		const blob = new Uint8Array(nibLen + scLen * 2);
		blob.set(raw.subarray(nibBase + r0 * d / 2, nibBase + r0 * d / 2 + nibLen), 0);
		blob.set(raw.subarray(scBase + r0 * gRow * 2, scBase + r0 * gRow * 2 + scLen), nibLen);
		blob.set(raw.subarray(mnBase + r0 * gRow * 2, mnBase + r0 * gRow * 2 + scLen), nibLen + scLen);
		return blob;
	}

	// Embedding rows for the prompt tokens, gathered from token_embd.
	public async embed(tokens: number[], d: number): Promise<Float32Array> {
		const info = this.manifest.tensors['token_embd.weight'];
		// GGUF stores tensor dims innermost-first, so shape[0] is n_embd (= d), NOT the vocab.
		// Derive the row count from total elements / embedding dim (correct for either dim order).
		const vocab = info.nElems / d;
		const isQ8 = info.type === 'Q8W';
		const isQ4 = info.type === 'Q4W'; // embeddings int4 (tier q4) — layout SoA → q4RowsBlob
		const bytesPerRow = info.bytes / vocab; // row stride for the contiguous f16/f32 layouts
		if (!isQ8 && !isQ4 && !Number.isInteger(bytesPerRow)) throw new Error('token_embd: lignes non uniformes');
		const raw = await this.rawTensor('token_embd.weight');
		// Gemma scales embeddings by sqrt(d); other arches leave them as-is (scale 1).
		const embedScale = this.manifest.config.embedScale ?? 1;
		const out = new Float32Array(tokens.length * d);
		for (let i = 0; i < tokens.length; i++) {
			const r = tokens[i];
			// q8/q4 embeddings are SoA across the whole tensor → rebuild this row's contiguous blob.
			const rowBytes = isQ8 ? CustomWebModel.q8RowsBlob(raw, info.nElems, r, 1, d)
				: isQ4 ? CustomWebModel.q4RowsBlob(raw, info.nElems, r, 1, d)
				: raw.subarray(r * bytesPerRow, (r + 1) * bytesPerRow);
			const row = await this.engine.dequantizeByType(info.type, rowBytes, d);
			if (embedScale !== 1) for (let j = 0; j < d; j++) row[j] *= embedScale;
			out.set(row, i * d);
		}
		return out;
	}

	// The logit head (output projection), kept Q8-RESIDENT in VRAM and dequantized in the fused q8
	// matmul (matmul_t_q8) per token — NOT expanded to f32 tiles. f32 tiles were vocab·d·4 bytes
	// (Gemma 256k → ~2.4 GB → exceeded VRAM → garbage → NaN logits); q8-resident is ~¼ that (~590 MB
	// for Gemma) AND reads ¼ the bytes per token. Still tiled so each codes buffer stays under
	// maxStorageBufferBindingSize. Built once; the source is reused directly if already q8web, else
	// quantized to q8 once (chunked, no giant f32 intermediate).
	// Tuiles de projection : `w` est un handle recMM — {codes, sc} q8 (historique) OU {nib, sc, mn}
	// q4 NATIF quand la source est Q4W (embeddings int4 du tier q4 : ½ la VRAM de la tête, et pas
	// de requantification q4→q8 qui gonflerait le chargement).
	private projQ8: { w: any; rows: number; r0: number }[] | null = null;
	private projVocab = 0;

	private async getProjectionQ8(d: number): Promise<{ w: any; rows: number; r0: number }[]> {
		if (this.projQ8) return this.projQ8;
		// Tied models (Qwen/Gemma) reuse token_embd; untied (Llama) have output.weight.
		const name = this.manifest.tensors['output.weight'] ? 'output.weight' : 'token_embd.weight';
		const info = this.manifest.tensors[name];
		if (!info) throw new Error('Logits projection tensor not found (output.weight / token_embd.weight)');
		const vocab = info.nElems / d; // shape[0] is n_embd in GGUF dim order, not the vocab
		this.projVocab = vocab;
		const raw = await this.rawTensor(name);
		// Tile the vocab so each weight buffer stays under the storage-binding cap.
		const TILE = Math.max(1, Math.floor((this.engine.maxStorageBufferBindingSize * 0.9) / d));
		const tiles: { w: any; rows: number; r0: number }[] = [];
		if (info.type === 'Q4W') {
			for (let r0 = 0; r0 < vocab; r0 += TILE) {
				const rows = Math.min(TILE, vocab - r0);
				const blob = CustomWebModel.q4RowsBlob(raw, info.nElems, r0, rows, d); // [nib | sc | mn]
				const nibLen = rows * d / 2, scLen = rows * (d / 32) * 2;
				tiles.push({
					w: {
						nib: this.engine.uploadGpuRaw(blob.subarray(0, nibLen)),
						sc: this.engine.uploadGpuRaw(blob.subarray(nibLen, nibLen + scLen)),
						mn: this.engine.uploadGpuRaw(blob.subarray(nibLen + scLen)),
					},
					rows, r0,
				});
			}
			this.projQ8 = tiles;
			return tiles;
		}
		// Full q8web blob = [codes (nElems int8) | scales (groups f16)]. Already q8web → use as-is;
		// any other source (GGUF k-quant, f16) → quantize to q8 ONCE (quantizeToBytes is chunked,
		// so no full-tensor f32 ever materializes on the GPU).
		const q8 = info.type === 'Q8W' ? raw : await this.engine.quantizeToBytes(info.type, raw, info.nElems, 'q8');
		for (let r0 = 0; r0 < vocab; r0 += TILE) {
			const rows = Math.min(TILE, vocab - r0);
			const blob = CustomWebModel.q8RowsBlob(q8, info.nElems, r0, rows, d); // [rows·d codes | rows·(d/32) scales]
			const codeLen = rows * d;
			tiles.push({
				w: { codes: this.engine.uploadGpuRaw(blob.subarray(0, codeLen)), sc: this.engine.uploadGpuRaw(blob.subarray(codeLen)) },
				rows, r0,
			});
		}
		this.projQ8 = tiles;
		return tiles;
	}

	// Greedy next-token id. Each q8 tile → fused q8 matmul → logits; argmax tracked on the CPU
	// (vocab f32 readback per tile is ~MBs, negligible). Used by the benchmark.
	public async argmaxLogits(hiddenLast: Float32Array, d: number): Promise<number> {
		const tiles = await this.getProjectionQ8(d);
		let best = 0, bestVal = -Infinity;
		for (const t of tiles) {
			const part = t.w.nib
				? await this.engine.matmulQ4(hiddenLast, t.w.nib, t.w.sc, t.w.mn, 1, d, t.rows)
				: await this.engine.matmulQ8(hiddenLast, t.w.codes, t.w.sc, 1, d, t.rows);
			for (let i = 0; i < part.length; i++) if (part[i] > bestVal) { bestVal = part[i]; best = t.r0 + i; }
		}
		return best;
	}

	// LayerCfg arch knobs from the manifest (Gemma2 softcap/scale/gelu/onePlus; all undefined for
	// Qwen2/Llama, so the kernels take their default Qwen/Llama path).
	private archFlags(): Partial<LayerCfg> {
		const c = this.manifest.config;
		return {
			attnScale: c.attnScale, attnLogitSoftcap: c.attnLogitSoftcap, act: c.act, rmsGainOnePlus: c.rmsGainOnePlus,
			// Par couche : fenêtre glissante + base RoPE (Gemma 3, 5 locales / 1 globale), NoPE (SmolLM3).
			// Absents sur toutes les autres archis → le moteur reprend exactement le chemin historique.
			windowPerLayer: c.windowPerLayer, ropeThetaPerLayer: c.ropeThetaPerLayer, skipRopePerLayer: c.skipRopePerLayer,
			// Convention d'appariement du RoPE (ggml NORM pour llama/mistral/smollm3). Coupée par
			// ?ropenorm=0 → on retombe sur rotate_half + dé-permutation des lignes Q/K, l'ancien couple.
			// `?? ropeInterleavedFor(arch)` : le drapeau vient du parser GGUF, un .brik ne le porte pas.
			ropeInterleaved: CustomWebModel.ropeNormOn ? (c.ropeInterleaved ?? (ropeInterleavedFor(this.manifest.arch) || undefined)) : undefined,
		};
	}

	// ── Vision (arch qwen2vl) : segments image du prompt courant + positions M-RoPE. ──────────────
	// `visionSegments` décrit où tombent les tokens image dans la SÉQUENCE (index absolu `at`,
	// grille APRÈS fusion gh×gw — soit gh·gw tokens <|image_pad|>). Posé par l'orchestrateur de
	// chat avant le prefill, il reste valable pour tous les appels de la même session KV (les
	// positions d'un token ne dépendent que des segments en amont). Vidé par reset().
	public visionSegments: { at: number; gh: number; gw: number }[] = [];

	// Positions 3D (t, h, w) des tokens [pastLen, pastLen+len) — schéma Qwen2-VL get_rope_index :
	// texte → t=h=w=st (st++) ; image → t=base, h=base+ligne, w=base+colonne, puis st=base+max(gh,gw).
	// Sans segment, positions = index de séquence : le M-RoPE dégénère en RoPE 1D standard (gate
	// selfValidate). Fonction pure des segments → correcte aussi pour le décodage token par token.
	private mropePositions(pastLen: number, len: number): Uint32Array {
		const total = pastLen + len;
		const out = new Uint32Array(len * 3);
		const segs = [...this.visionSegments].sort((a, b) => a.at - b.at);
		const write = (idx: number, t: number, h: number, w: number) => {
			if (idx >= pastLen && idx < total) { out[(idx - pastLen) * 3] = t; out[(idx - pastLen) * 3 + 1] = h; out[(idx - pastLen) * 3 + 2] = w; }
		};
		let i = 0, st = 0, si = 0;
		while (i < total) {
			const seg = si < segs.length ? segs[si] : null;
			if (seg && i === seg.at) {
				const base = st, n = seg.gh * seg.gw;
				for (let j = 0; j < n; j++) write(i + j, base, base + Math.floor(j / seg.gw), base + (j % seg.gw));
				st = base + Math.max(seg.gh, seg.gw);
				i += n; si++;
			} else {
				write(i, st, st, st);
				st++; i++;
			}
		}
		return out;
	}

	// Facteurs de fréquence RoPE (Llama 3.1/3.2 : tenseur optionnel rope_freqs.weight, [headDim/2]
	// diviseurs). Chargés une fois ; absents → null → rope standard.
	private ropeFactorsCache: Float32Array | null | undefined;
	// Kill-switch de banc : ?ropefactors=0 → RoPE standard (ni scaling llama3 ni YaRN). Sert à isoler
	// le scaling quand une famille sort du charabia (il agit à TOUTE position, pas seulement au-delà
	// du contexte d'origine : il divise les basses fréquences).
	private static ropeFactorsOn = (() => { try { return urlFlag('ropefactors') !== '0'; } catch { return true; } })();
	private async getRopeFactors(): Promise<Float32Array | null> {
		if (this.ropeFactorsCache !== undefined) return this.ropeFactorsCache;
		if (!CustomWebModel.ropeFactorsOn) {
			console.warn('[model] facteurs RoPE COUPÉS par ?ropefactors=0 : RoPE standard');
			this.ropeFactorsCache = null;
			return null;
		}
		if (this.manifest.tensors['rope_freqs.weight']) {
			this.ropeFactorsCache = await this.dequant('rope_freqs.weight');
			console.log('[model] rope_freqs.weight présent : RoPE à facteurs (scaling llama3) actif');
		} else if (this.manifest.config.yarn) {
			// YaRN statique (Ministral 3) : mêmes formules que ggml (rope_yarn_ramp + corr_dim).
			// theta_i = extrap_i · [freq_scale·(1−ramp) + ramp] → notre kernel divise par ff[i].
			const { factor, betaFast, betaSlow, origCtx } = this.manifest.config.yarn;
			const { headDim, ropeTheta } = this.manifest.config;
			const half = headDim / 2;
			const corr = (beta: number) => headDim * Math.log(origCtx / (beta * 2 * Math.PI)) / (2 * Math.log(ropeTheta));
			const low = corr(betaFast), high = corr(betaSlow);
			const ff = new Float32Array(half);
			for (let i = 0; i < half; i++) {
				const ramp = 1 - Math.min(1, Math.max(0, (i - low) / Math.max(0.001, high - low)));
				ff[i] = 1 / ((1 / factor) * (1 - ramp) + ramp);
			}
			this.ropeFactorsCache = ff;
			console.log(`[model] YaRN statique actif (factor ${factor}, dims corr ${low.toFixed(1)}–${high.toFixed(1)})`);
		} else {
			this.ropeFactorsCache = null;
		}
		return this.ropeFactorsCache;
	}

	// Branche M-RoPE sur un cfg si l'arch le demande (no-op pour toutes les archs texte).
	private applyMrope(cfg: LayerCfg, pastLen: number, len: number): void {
		const sections = this.manifest.config.mropeSections;
		if (!sections) return;
		if (!this.engine.mropeOk) throw new Error('M-RoPE indisponible sur ce GPU (selfValidate) : vision désactivée.');
		cfg.mropeSections = sections;
		cfg.positions = this.mropePositions(pastLen, len);
	}

	// Injection d'embeddings image : remplace les lignes [at, at+n) (index absolus de séquence) par
	// des embeddings fournis (sortie du ViT/merger, [n, d]) — les tokens <|image_pad|> ne servent
	// que de gabarit. Seules les lignes qui tombent dans le forward courant sont copiées.
	private static applyInjections(embeds: Float32Array, d: number, pastLen: number, len: number, inject?: { at: number; rows: Float32Array }[]): void {
		if (!inject) return;
		for (const seg of inject) {
			const n = seg.rows.length / d;
			for (let j = 0; j < n; j++) {
				const rel = seg.at + j - pastLen;
				if (rel >= 0 && rel < len) embeds.set(seg.rows.subarray(j * d, (j + 1) * d), rel * d);
			}
		}
	}

	// Compact (int8) KV cache toggle: ÷~4 the KV VRAM → ~4× more context fits, near-f16 quality.
	// Changing it resets the KV cache (layouts differ); weights stay resident.
	get kvQuant(): boolean { return this.engine.kvQuant === true; }
	public setKvQuant(q8: boolean) { this.engine.setKvQuant(q8); }

	// Reset between generations: clear ONLY the KV cache (each message re-prefills the full
	// history). The dequantized weights stay resident on the GPU — uploaded once, reused.
	public reset() {
		this.engine.clearKvCache();
		this.visionSegments = [];
	}

	// Full teardown when the model is unloaded/replaced: release the persistent GPU buffers and
	// every cache so a fresh model starts clean and GPU memory is reclaimed.
	public unload() {
		this.reset();
		for (const w of this.layerGpuCache.values()) {
			for (const b of Object.values(w)) CustomWebModel.destroyWeight(b);
		}
		this.layerGpuCache.clear();
		this.finalNormGpu?.destroy?.();
		this.finalNormGpu = null;
		for (const t of this.projQ8 ?? []) CustomWebModel.destroyWeight(t.w);
		this.projQ8 = null;
		this.layerCache.clear();
		this.rawCache.clear();
		this.layerSpan.clear();
	}

	// GPU-resident forward over the input tokens (prefill: all prompt tokens with pastLen 0;
	// decode: [lastGeneratedToken] with pastLen = tokens so far). The whole layer stack + final
	// norm execute as a SINGLE queue submit with the KV cache living on the GPU; only the last
	// token's hidden state is read back, then projected to logits. Returns the greedy next id.
	// Run the GPU-resident forward and return the last token's hidden state. Shared by the greedy
	// (generateNextKV) and sampling (logitsKV) paths.
	private async hiddenKV(tokens: number[], pastLen: number, sessionId: string, inject?: { at: number; rows: Float32Array }[]): Promise<Float32Array> {
		const m = this.manifest;
		const { d, nHeads, nKvHeads, headDim, ffn, blockCount, ropeTheta, rmsEps } = m.config;
		const cfg: LayerCfg = { seq: tokens.length, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps: rmsEps, ...this.archFlags() };
		this.applyMrope(cfg, pastLen, tokens.length);
		cfg.ropeFactors = (await this.getRopeFactors()) ?? undefined;
		const embeds = await this.embed(tokens, d);
		CustomWebModel.applyInjections(embeds, d, pastLen, tokens.length, inject);
		const layers = await Promise.all(
			Array.from({ length: blockCount }, (_, i) => this.layerWeightsGpu(i))
		);
		const finalNorm = await this.getFinalNormGpu();
		return this.engine.runDecodeGpu(embeds, cfg, layers, pastLen, finalNorm, sessionId);
	}

	// Greedy next-token id (GPU argmax, only the winning id read back). Used by the benchmark.
	async generateNextKV(tokens: number[], pastLen: number, sessionId: string, inject?: { at: number; rows: Float32Array }[]): Promise<number> {
		const hiddenLast = await this.hiddenKV(tokens, pastLen, sessionId, inject);
		return this.argmaxLogits(hiddenLast, this.manifest.config.d);
	}

	// Full logits for the next position (for the chat loop's repetition penalty + sampling). The whole
	// forward + the Q8 lm_head run as ONE GPU submit with a SINGLE readback (engine.decodeLogitsQ8) —
	// the hidden state never comes back to the CPU. Gemma2 caps the final logits with tanh afterwards.
	async logitsKV(tokens: number[], pastLen: number, sessionId: string, inject?: { at: number; rows: Float32Array }[]): Promise<Float32Array> {
		const m = this.manifest;
		const { d, nHeads, nKvHeads, headDim, ffn, blockCount, ropeTheta, rmsEps } = m.config;
		const cfg: LayerCfg = { seq: tokens.length, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps: rmsEps, ...this.archFlags() };
		this.applyMrope(cfg, pastLen, tokens.length);
		cfg.ropeFactors = (await this.getRopeFactors()) ?? undefined;
		// Chronométrage par ÉTAPE, activé par ?timing=1 : le premier message d'une session payait
		// 10 s inexpliquées sur un 7B (prefill affiché à 3,9 t/s contre ~20 ensuite). Sans découpage,
		// impossible de dire si le coût vient de l'embedding, des poids de couches, de la tête de
		// projection ou du forward lui-même.
		const T = CustomWebModel.timingOn ? (label: string, t0: number) => console.info(`[timing] ${label} ${(performance.now() - t0).toFixed(0)} ms`) : null;
		let t0 = performance.now();
		const embeds = await this.embed(tokens, d);
		T?.('embed', t0); t0 = performance.now();
		CustomWebModel.applyInjections(embeds, d, pastLen, tokens.length, inject);
		const layers = await Promise.all(
			Array.from({ length: blockCount }, (_, i) => this.layerWeightsGpu(i))
		);
		T?.('poids des couches', t0); t0 = performance.now();
		const finalNorm = await this.getFinalNormGpu();
		const tiles = await this.getProjectionQ8(d);
		T?.('norme finale + tête de projection', t0); t0 = performance.now();
		const logits = await this.engine.decodeLogitsQ8(embeds, cfg, layers, pastLen, finalNorm, sessionId, tiles, this.projVocab);
		T?.('forward + logits', t0);
		const cap = m.config.finalLogitSoftcap;
		if (cap && cap > 0) for (let i = 0; i < logits.length; i++) logits[i] = cap * Math.tanh(logits[i] / cap);
		return logits;
	}

	// Top-K candidates for the next position — the fast sampling path: the whole forward + Q8
	// lm_head + softcap + repetition penalty + top-K selection run as ONE GPU submit, and only
	// K ids+values come back (~512 o instead of the ~600 Ko full-vocab readback that was the
	// per-token floor on mobile). `recent` = deduped ids to penalize. Sample with sampleFromTopK.
	async topKKV(tokens: number[], pastLen: number, sessionId: string, recent: number[], penalty: number, inject?: { at: number; rows: Float32Array }[]): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		const m = this.manifest;
		const { d, nHeads, nKvHeads, headDim, ffn, blockCount, ropeTheta, rmsEps } = m.config;
		const cfg: LayerCfg = { seq: tokens.length, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps: rmsEps, ...this.archFlags() };
		this.applyMrope(cfg, pastLen, tokens.length);
		cfg.ropeFactors = (await this.getRopeFactors()) ?? undefined;
		// Chronométrage par ÉTAPE (?timing=1) : c'est CE chemin que le chat emprunte (topKKV), pas
		// logitsKV. Sert à découper les ~10 s payées au tout premier message d'une session sur un 7B.
		const T = CustomWebModel.timingOn ? (label: string, t0: number) => console.info(`[timing] ${label} ${(performance.now() - t0).toFixed(0)} ms`) : null;
		let t0 = performance.now();
		const embeds = await this.embed(tokens, d);
		T?.('embed', t0); t0 = performance.now();
		CustomWebModel.applyInjections(embeds, d, pastLen, tokens.length, inject);
		const layers = await Promise.all(
			Array.from({ length: blockCount }, (_, i) => this.layerWeightsGpu(i))
		);
		T?.('poids des couches', t0); t0 = performance.now();
		const finalNorm = await this.getFinalNormGpu();
		const tiles = await this.getProjectionQ8(d);
		T?.('norme finale + tete de projection', t0); t0 = performance.now();
		const out = await this.engine.decodeTopKQ8(embeds, cfg, layers, pastLen, finalNorm, sessionId, tiles, this.projVocab, recent, penalty, m.config.finalLogitSoftcap ?? 0);
		T?.('forward + top-k', t0);
		return out;
	}

	// BANC : l'état caché APRÈS CHAQUE COUCHE, pour dichotomiser une divergence.
	//
	// Pourquoi ce hook existe : la référence CPU (__refForward) ne comparait que les LOGITS. Un écart
	// y est un verdict sans adresse — il peut naître à la couche 0 comme à l'avant-dernière, et se
	// propage de toute façon jusqu'au bout. En rendant l'état après chaque couche, on trouve la
	// PREMIÈRE qui diverge : au-dessus d'elle tout est sain, donc la cause est dans ce bloc-là.
	//
	// Ce chemin est volontairement le chemin CLASSIQUE (`layerForward`, poids déquantifiés, pas de
	// cache KV), pas le chemin résident fusionné du chat (`decodeLogitsQ8`). C'est le deuxième
	// partage utile : si la référence CPU et CE chemin concordent alors que les logits du chat
	// divergent, le défaut est dans la fusion/le cache KV, pas dans la composition du forward.
	// `ropeFactors` est posé comme dans logitsKV (generateNext, lui, l'oublie — cf. ROADMAP §6).
	// Coûteux (readback complet par couche) : usage banc uniquement.
	async debugHiddenPerLayer(tokens: number[]): Promise<Float32Array[]> {
		const m = this.manifest;
		const { d, nHeads, nKvHeads, headDim, ffn, blockCount, ropeTheta, rmsEps } = m.config;
		const seq = tokens.length;
		const cfg: LayerCfg = { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps: rmsEps, ...this.archFlags() };
		cfg.ropeFactors = (await this.getRopeFactors()) ?? undefined;
		let x = await this.embed(tokens, d);
		const out: Float32Array[] = [];
		for (let idx = 0; idx < blockCount; idx++) {
			x = await this.engine.layerForward(x, cfg, await this.layerWeights(idx), true);
			out.push(Float32Array.from(x));
		}
		return out;
	}

	// (`generateNext`, le forward complet SANS cache KV, a été supprimé le 2026-08-16 : plus aucun
	// appelant depuis que le chat, le SDK et les bancs passent tous par les chemins KV
	// (generateNextKV / topKKV / logitsKV). Le chemin classique par couche reste couvert par
	// debugHiddenPerLayer, qui est un outil de diagnostic vivant.)
}
