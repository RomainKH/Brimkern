// GÉNÉRATEUR VIDÉO LTX-Video complet : tokenizer T5 → encodeur T5 → transformeur (7 pas distillés) →
// dénormalisation + bruit de décodage → décodeur → images RGB. Même contrat que le générateur
// AnimateDiff (videoGen.ts) pour que le chat les échange sans se réécrire — docs/ltx-video-feasibility.md.
//
// Mémoire GPU : T5 q4 (~3 Go) + transformeur q4 (1,25 Go) + décodeur q8 (0,56 Go) résidents. Le T5 ne
// sert qu'au début : `t5Resident: false` le décharge après l'encodage du prompt et le recharge (depuis
// le cache de plages) au prompt suivant — pour les machines à 8-16 Go.

import { WebGpuEngine } from '../kernels';
import { brikImageToMap } from '../diffusion/sdturbo';
import { randnSeeded } from '../diffusion/scheduler';
import { LtxT5Encoder } from './ltxT5';
import { LtxTransformer, tokensToLatent, type LtxVideoShape } from './ltxTransformer';
import { LtxDecoder } from './ltxDecoder';
import { LTX_LATENTS_MEAN, LTX_LATENTS_STD, LTX_SIGMAS_DISTILLED, LTX_DECODE_NOISE_SCALE, LTX_SPATIAL, LTX_TEMPORAL, LTX_FPS } from './ltxConstants';
import { EN_ONLY, type OnProgress, type Tr } from '../progress';
import type { VideoFrames, VideoGenerator } from './videoGen';

export interface LtxUrls { t5: string; transformer: string; decoder: string }
// Options : celles du chat (contrat VideoGenerator de videoGen.ts — `frames` 16/24 = les presets
// AnimateDiff, `size` 256 = préréglage léger) OU explicites (width/height/frames LTX).
//   frames 16 (ou ≤ 32) → 49 images (2 s) ; 24 → 97 images (4 s) ; sinon la valeur LTX (8k + 1).
//   size 256 → 384×256 ; sinon (ou width/height) → 512×320. `interp` est ignoré (25 im/s natifs).
export interface LtxGenerateOptions {
	width?: number; height?: number; frames?: number; size?: number; interp?: number; seed?: number;
	onProgress?: (step: string, bytes?: { loaded: number; total: number }, frac?: number) => void;
}
export interface LtxGenerator extends VideoGenerator {
	generate(prompt: string, opts?: LtxGenerateOptions): Promise<VideoFrames>;
}

export const LTX_TOKENIZER = 'Xenova/t5-v1_1-base'; // même SentencePiece que t5-v1_1-xxl : identifiants identiques à T5Tokenizer (vérifié)

export async function loadLtxGenerator(urls: LtxUrls, onProgress?: OnProgress, tr: Tr = EN_ONLY, t5Resident = true): Promise<LtxGenerator> {
	const engine = new WebGpuEngine();
	if (!(await engine.init())) throw new Error('WebGPU indisponible.');
	await engine.selfValidate();
	if (!(engine as any).ltxOk) throw new Error('briques LTX coupées (?ltx=0 ou selfValidate)');
	const { AutoTokenizer } = await import('@huggingface/transformers');
	const tok = await AutoTokenizer.from_pretrained(LTX_TOKENIZER);
	const loadT5 = async () => new LtxT5Encoder(engine, (await brikImageToMap(engine, urls.t5, onProgress, 'T5', tr, LtxT5Encoder.isCpuTensor)).map);
	let t5: LtxT5Encoder | null = await loadT5();
	const transformer = new LtxTransformer(engine, (await brikImageToMap(engine, urls.transformer, onProgress, tr('transformer', 'transformeur'), tr, LtxTransformer.isCpuTensor)).map);
	const decoder = new LtxDecoder(engine, (await brikImageToMap(engine, urls.decoder, onProgress, tr('decoder', 'décodeur'), tr)).map);
	if (!t5Resident) { t5.dispose(); t5 = null; }

	const generate = async (prompt: string, opts: LtxGenerateOptions = {}): Promise<VideoFrames> => {
		const light = opts.size === 256 && !opts.width;
		const width = opts.width ?? (light ? 384 : 512), height = opts.height ?? (light ? 256 : 320);
		const f = opts.frames ?? 49, frames = f <= 16 ? 49 : f <= 32 ? 97 : f;
		if (width % LTX_SPATIAL || height % LTX_SPATIAL || (frames - 1) % LTX_TEMPORAL) throw new Error(`LTX : taille ${width}×${height}×${frames} — largeur/hauteur multiples de 32, images = 8k + 1`);
		const sh: LtxVideoShape = { T: (frames - 1) / LTX_TEMPORAL + 1, H: height / LTX_SPATIAL, W: width / LTX_SPATIAL };
		const S = sh.T * sh.H * sh.W, seed = opts.seed ?? ((Math.random() * 1e9) | 0);
		const prog = opts.onProgress ?? onProgress;
		const t0 = performance.now();
		// Unités d'avancement : encodage 1, pas du transformeur 7, décodeur 21 blocs.
		const total = 1 + LTX_SIGMAS_DISTILLED.length + 21; let done = 0;
		const tick = (label: string) => prog?.(label, undefined, ++done / total);

		prog?.(tr('Encoding the prompt (T5)…', 'Encodage du prompt (T5)…'), undefined, 0);
		const enc = await tok(prompt, { padding: 'max_length', max_length: 128, truncation: true });
		const ids = Array.from(enc.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
		if (!t5) t5 = await loadT5();
		const text = await t5.encode(ids);
		if (!t5Resident) { t5.dispose(); t5 = null; }
		const ctx = transformer.encodeText(text.embeds.subarray(0, text.valid * 4096), text.valid);
		tick(tr('Prompt encoded.', 'Prompt encodé.'));

		const tokens = await transformer.sample(randnSeeded(S * 128, seed), sh, ctx, LTX_SIGMAS_DISTILLED, (i, n) => tick(`${tr('Denoising', 'Débruitage')} ${i}/${n}…`));
		engine.releaseGpu([ctx.buf]);
		let lat = tokensToLatent(tokens, sh, LTX_LATENTS_MEAN, LTX_LATENTS_STD);
		const noise = randnSeeded(lat.length, seed + 7);
		for (let i = 0; i < lat.length; i++) lat[i] = (1 - LTX_DECODE_NOISE_SCALE) * lat[i] + LTX_DECODE_NOISE_SCALE * noise[i];

		const vid = await decoder.decode(lat, sh.T, sh.H, sh.W, (b, n) => tick(`${tr('Decoding', 'Décodage')} ${b}/${n}…`));
		// [3, F, H, W] en [−1, 1] → ImageData par image.
		const F = vid.T, HW = vid.H * vid.W, out: ImageData[] = [];
		for (let f = 0; f < F; f++) {
			const rgba = new Uint8ClampedArray(HW * 4);
			for (let p = 0; p < HW; p++) {
				rgba[p * 4] = (vid.data[(0 * F + f) * HW + p] + 1) * 127.5;
				rgba[p * 4 + 1] = (vid.data[(1 * F + f) * HW + p] + 1) * 127.5;
				rgba[p * 4 + 2] = (vid.data[(2 * F + f) * HW + p] + 1) * 127.5;
				rgba[p * 4 + 3] = 255;
			}
			out.push(new ImageData(rgba, vid.W, vid.H));
		}
		return { frames: out, seed, ms: Math.round(performance.now() - t0), fps: LTX_FPS };
	};

	return { generate, enrich: async (prompt: string) => prompt, engine, dispose: () => { t5?.dispose(); transformer.dispose(); decoder.dispose(); } };
}
