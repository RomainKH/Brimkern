// Orchestrateur vision Qwen2-VL (jalon V3) : image + question → réponse texte, bout en bout.
// Assemble les briques : LLM GGUF (arch qwen2vl — un Qwen2 + M-RoPE, chargé par CustomWebModel),
// mmproj (ViT+merger, mmproj.ts/vit.ts), tokenizer HF, pré-traitement image, injection d'embeddings.
//
// V3 = chemin de test (hook dev __visionChat, décodage glouton) — l'UI produit (pièce jointe,
// catalogue, états de chargement) est le jalon V4. Desktop uniquement (~2,6 Go VRAM total).

import { WebGpuEngine } from '../kernels';
import { parseGguf } from '../ggufParser';
import { CustomWebModel } from '../model';
import { fetchFullCached } from '../source';
import { loadMmproj } from './mmproj';
import { VitEncoder, imageToPatches } from './vit';

// Tokens spéciaux Qwen2-VL (ids du tokenizer officiel) — exportés pour l'orchestration du chat.
export const IM_END = 151645, ENDOFTEXT = 151643;
const VISION_START = 151652, VISION_END = 151653, IMAGE_PAD = 151655;

const DEFAULT_LLM = 'https://huggingface.co/bartowski/Qwen2-VL-2B-Instruct-GGUF/resolve/main/Qwen2-VL-2B-Instruct-Q8_0.gguf';
const DEFAULT_MMPROJ = 'https://huggingface.co/bartowski/Qwen2-VL-2B-Instruct-GGUF/resolve/main/mmproj-Qwen2-VL-2B-Instruct-f16.gguf';

// URL/data/blob image → RGB [0,1] channels-first, redimensionnée pour que les côtés soient des
// multiples de patch·merge (28) et que le nombre de tokens reste raisonnable (≤ ~256 après fusion).
export async function imageUrlToCHW(url: string, maxSide = 448): Promise<{ data: Float32Array; H: number; W: number }> {
	const img = new Image();
	img.crossOrigin = 'anonymous';
	await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('image illisible')); img.src = url; });
	const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
	const snap = (v: number) => Math.max(28, Math.round((v * scale) / 28) * 28);
	const W = snap(img.naturalWidth), H = snap(img.naturalHeight);
	const c = document.createElement('canvas'); c.width = W; c.height = H;
	const ctx = c.getContext('2d')!;
	ctx.drawImage(img, 0, 0, W, H);
	const d = ctx.getImageData(0, 0, W, H).data;
	const HW = H * W;
	const out = new Float32Array(3 * HW);
	for (let p = 0; p < HW; p++) {
		out[p] = d[p * 4] / 255;
		out[HW + p] = d[p * 4 + 1] / 255;
		out[2 * HW + p] = d[p * 4 + 2] / 255;
	}
	return { data: out, H, W };
}

export interface VisionSession {
	model: CustomWebModel;
	vit: VitEncoder;
	engine: WebGpuEngine;
	tokenizer: any;
	vitCfg: import('./mmproj').VitConfig;
	dispose: () => void;
}

// Charge LLM + mmproj sur UN engine partagé (~1,1 Go q8 LLM + ~0,7 Go q8 ViT en VRAM).
export async function loadVisionSession(opts: { llm?: string; mmproj?: string } = {}, onProgress?: (s: string) => void): Promise<VisionSession> {
	const engine = new WebGpuEngine();
	if (!(await engine.init())) throw new Error('WebGPU indisponible.');
	onProgress?.('Auto-validation des kernels…');
	if (!(await engine.selfValidate())) throw new Error(`selfValidate KO : ${engine.validationFailure}`);
	if (!engine.mropeOk) throw new Error('M-RoPE indisponible sur ce GPU — vision désactivée.');

	onProgress?.('Téléchargement du LLM (Q8_0, ~1 Go)…');
	const llmBytes = await fetchFullCached(opts.llm ?? DEFAULT_LLM);
	const blob = new Blob([llmBytes.slice() as unknown as BlobPart]);
	const manifest = await parseGguf(blob);
	if (!manifest.config.mropeSections) throw new Error(`arch "${manifest.arch}" : pas un LLM Qwen2-VL (sections M-RoPE absentes)`);
	const model = new CustomWebModel(engine, blob, manifest);

	onProgress?.('Téléchargement du mmproj (ViT, ~1,3 Go)…');
	const { cfg: vitCfg, w } = await loadMmproj(engine, opts.mmproj ?? DEFAULT_MMPROJ, onProgress);
	if (vitCfg.outDim !== manifest.config.d) throw new Error(`merger → ${vitCfg.outDim} ≠ d LLM ${manifest.config.d}`);
	const vit = new VitEncoder(engine, w, vitCfg);

	onProgress?.('Tokenizer…');
	const { AutoTokenizer } = await import('@huggingface/transformers');
	const tokenizer = await AutoTokenizer.from_pretrained('Qwen/Qwen2-VL-2B-Instruct');

	return { model, vit, engine, tokenizer, vitCfg, dispose: () => { model.unload(); engine.destroy(); } };
}

// Tokenise un fragment de template (sans tokens spéciaux implicites — ceux du template sont dans
// le vocabulaire et s'encodent tels quels).
export async function encodeText(s: VisionSession, t: string): Promise<number[]> {
	const e = await s.tokenizer(t, { add_special_tokens: false });
	return Array.from(e.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
}

// Encode une image en bloc de prompt : ids = <|vision_start|>[image_pad×N]<|vision_end|>,
// embeddings du merger à injecter à `localAt` (offset du premier pad DANS ce bloc), et la grille
// fusionnée pour les segments M-RoPE. L'appelant place le bloc dans la séquence et pousse
// { at: offsetAbsolu + localAt, gh, gw } dans model.visionSegments.
export interface ImageBlock { ids: number[]; localAt: number; gh: number; gw: number; rows: Float32Array }
export async function encodeImageBlock(s: VisionSession, imageUrl: string, onProgress?: (p: string) => void): Promise<ImageBlock> {
	onProgress?.('Pré-traitement de l’image…');
	const img = await imageUrlToCHW(imageUrl);
	const { patches, pos, gridH, gridW } = imageToPatches(img.data, img.H, img.W, s.vitCfg);
	const nPatch = gridH * gridW;
	onProgress?.(`Encodage de l’image (${nPatch} patches → ${nPatch / 4} tokens)…`);
	const rows = await s.vit.encode(patches, pos, nPatch);
	const merge = s.vitCfg.merge;
	const gh = gridH / merge, gw = gridW / merge;
	console.log(`[vision] image ${img.W}×${img.H} → grille ${gridH}×${gridW} → ${gh * gw} tokens`);
	return { ids: [VISION_START, ...Array(gh * gw).fill(IMAGE_PAD), VISION_END], localAt: 1, gh, gw, rows };
}

// Prépare un PREMIER tour avec image (chemin du hook dev / test V3).
export async function buildImageTurn(s: VisionSession, imageUrl: string, question: string, onProgress?: (p: string) => void): Promise<{ ids: number[]; inject: { at: number; rows: Float32Array }[] }> {
	const block = await encodeImageBlock(s, imageUrl, onProgress);
	const pre = await encodeText(s, '<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n<|im_start|>user\n');
	const post = await encodeText(s, `${question}<|im_end|>\n<|im_start|>assistant\n`);
	const ids = [...pre, ...block.ids, ...post];
	const at = pre.length + block.localAt;
	s.model.visionSegments = [{ at, gh: block.gh, gw: block.gw }];
	console.log(`[vision] prompt ${ids.length} tokens, image @ ${at}`);
	return { ids, inject: [{ at, rows: block.rows }] };
}

// Test V3 complet : charge tout, pose une question sur une image, décode en glouton. Retourne le texte.
export async function visionChatTest(imageUrl: string, question = 'Décris cette image en une phrase.', opts: { llm?: string; mmproj?: string; maxTokens?: number } = {}, onProgress?: (s: string) => void): Promise<string> {
	const log = (m: string) => { console.log('[vision]', m); onProgress?.(m); };
	const s = await loadVisionSession(opts, log);
	try {
		const { ids, inject } = await buildImageTurn(s, imageUrl, question, log);
		log('Prefill…');
		const sess = `vision-${ids.length}`;
		let tokens = ids, past = 0;
		const outIds: number[] = [];
		const max = opts.maxTokens ?? 80;
		for (let step = 0; step < max; step++) {
			const logits = await s.model.logitsKV(tokens, past, sess, step === 0 ? inject : undefined);
			past += tokens.length;
			let best = 0, bv = -Infinity;
			for (let i = 0; i < logits.length; i++) if (logits[i] > bv) { bv = logits[i]; best = i; }
			if (best === IM_END || best === ENDOFTEXT) break;
			outIds.push(best);
			tokens = [best];
			if (step === 0) log('Décodage…');
		}
		const text = s.tokenizer.decode(outIds, { skip_special_tokens: true });
		log(`Réponse : ${text}`);
		return text;
	} finally {
		s.dispose();
	}
}
