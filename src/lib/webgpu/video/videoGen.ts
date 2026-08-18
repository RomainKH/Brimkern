// Pipeline VIDÉO navigateur (étape 4, docs/video-gen-feasibility.md) : CLIP-L → UNet SD1.5 16 frames
// × 4 pas Lightning avec les 21 modules motion injectés (unetForwardVideo) → TAESD par frame.
// Réutilise TOUT le chemin image (loadUnetWeights/unetWeightsToGpu via BRIK GPU-handles, ClipTextEncoder,
// TAESD, scheduler Euler — β 'linear' AnimateDiff) + MotionModule validé (cosine 0,9998 vs oracle).
// Desktop uniquement (gating côté UI) ; duty-cycle hérité du pipeline image via UnetPace.

import { WebGpuEngine } from '../kernels';
import { brikImageToMap, loadUnetWeights, loadClipWeights } from '../diffusion/sdturbo';
import { ClipTextEncoder, type ClipConfig } from '../diffusion/clip';
import { makeEulerScheduler, randnSeeded } from '../diffusion/scheduler';
import { unetForwardVideo, type UnetCfg, type UnetPace } from '../diffusion/unet';
import { TaesdDecoder, chwToRGBA } from '../taesd';
import { parseSafetensors } from '../../safetensors';
import { parseBrik } from '../../brik/container';
import { computeShardBases } from '../../brik/loader';
import { decodeTensor } from '../../brik/codec';
import { MotionModule } from './motionModule';
import { EN_ONLY, type OnProgress, type Tr } from '../progress';

// CLIP ViT-L (SD 1.5) : 768/12 têtes, quick_gelu, dernier hidden state.
const CLIP_L: ClipConfig = { dim: 768, layers: 12, heads: 12, vocab: 49408, maxPos: 77, hidden: 3072, eps: 1e-5, finalLN: true, act: 'quick_gelu' };
// UNet SD 1.5 (miroir de l'entrée video-unet de build-image-brik — le BRIK est auto-descripteur).
const SD15_UNET: Partial<UnetCfg> = { baseC: 320, mult: [1, 2, 4, 4], layersPerBlock: 2, attn: [true, true, true, false], headDim: 64, fixedHeads: 8, ffMult: 4, ctxDim: 768, seqT: 77, groups: 32, tembIn: 320, tembDim: 1280 };
const VAE_SCALE = 1; // TAESD prend le latent brut (comme le chemin image)

export interface VideoFrames { frames: ImageData[]; seed: number; ms: number }

// Compile les frames en WebM (canvas.captureStream + MediaRecorder, Chrome/Edge — repli null si
// non supporté, l'appelant garde la grille de frames).
// ⚠️ MediaRecorder capture en TEMPS RÉEL : la durée du clip = temps mural écoulé. L'ancienne version
// (setInterval 1000/fps) dérivait à ~1 fps juste après une génération lourde (main-thread saturé) →
// 16 frames = 16 s de diaporama. Ici on borne : pacing par TEMPS ÉCOULÉ (l'index de frame suit
// l'horloge, pas le nombre de ticks) via requestAnimationFrame + requestFrame() manuel, et on s'arrête
// à une durée FIXE (durMs). Sous charge, on saute des frames — jamais on n'étire la durée. On lit la
// séquence en BOUCLE (`loops`) pour un clip continu et fluide au lieu d'un flash de 16 frames.
// `targetSec` : durée VISÉE du clip. Le modèle ne produit que 16-32 frames UNIQUES (pos_embed [1,32,C]),
// donc pour un clip plus long on BOUCLE la séquence (AnimateDiff est entraîné pour boucler → raccord
// quasi-invisible). Du mouvement neuf plus long demanderait de l'interpolation de frames (hors scope).
export async function framesToWebm(frames: ImageData[], fps = 12, targetSec = 10): Promise<string | null> {
  try {
    if (typeof MediaRecorder === 'undefined' || !frames.length) return null;
    const c = document.createElement('canvas');
    c.width = frames[0].width; c.height = frames[0].height;
    const ctx = c.getContext('2d')!;
    ctx.putImageData(frames[0], 0, 0);
    // captureStream(0) = mode manuel : on pousse chaque frame via track.requestFrame().
    const stream = (c as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }).captureStream(0);
    const track = stream.getVideoTracks()[0] as MediaStreamTrack & { requestFrame?: () => void };
    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    const done = new Promise<void>((resolve) => { rec.onstop = () => resolve(); });
    const frameMs = 1000 / fps;
    const loops = Math.max(2, Math.round((targetSec * 1000) / (frames.length * frameMs))); // boucle pour atteindre ~targetSec
    const total = frames.length * loops;                 // séquence bouclée
    const durMs = total * frameMs;                        // durée CIBLE, bornée
    rec.start();
    await new Promise<void>((resolve) => {
      const t0 = performance.now();
      let lastIdx = -1;
      const step = () => {
        const elapsed = performance.now() - t0;
        const idx = Math.min(total - 1, Math.floor(elapsed / frameMs)) % frames.length;
        if (idx !== lastIdx) { ctx.putImageData(frames[idx], 0, 0); track.requestFrame?.(); lastIdx = idx; }
        if (elapsed >= durMs) { resolve(); return; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    rec.stop();
    await done;
    return chunks.length ? URL.createObjectURL(new Blob(chunks, { type: mime || 'video/webm' })) : null;
  } catch { return null; }
}
// `engine` est exposé pour le filet « GPU perdu » côté app (onLost), comme en mode vision : une
// génération vidéo dure des minutes, c'est le cas le plus exposé à une reprise de VRAM par l'OS.
export interface VideoGenerator { generate(prompt: string, opts?: { seed?: number; frames?: number; size?: number; onProgress?: (s: string) => void }): Promise<VideoFrames>; enrich(prompt: string, onProgress?: (s: string) => void): Promise<string>; engine: WebGpuEngine; dispose(): void }

// Les 21 modules motion depuis le BRIK (q8 packé → codes/scales GPU, petits tenseurs f32 CPU).
async function loadMotionModules(engine: WebGpuEngine, url: string, onProgress?: OnProgress, tr: Tr = EN_ONLY): Promise<Map<string, MotionModule>> {
  // Lecture en FLUX (et non un arrayBuffer d'un bloc) : c'est ce qui permet d'annoncer les octets,
  // donc la barre et le temps restant, sur les ~460 Mo du module motion.
  const label = tr('Downloading the motion module…', 'Téléchargement du module motion…');
  onProgress?.(label);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} (motion)`);
  const total = parseInt(r.headers.get('content-length') || '0', 10);
  const reader = r.body?.getReader();
  let buf: Uint8Array;
  if (!reader) {
    buf = new Uint8Array(await r.arrayBuffer());
  } else {
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); loaded += value.byteLength;
      onProgress?.(label, total ? { loaded, total } : undefined);
    }
    buf = new Uint8Array(loaded);
    let at = 0;
    for (const c of chunks) { buf.set(c, at); at += c.byteLength; }
  }
  const parsed = parseBrik(buf);
  const bases = computeShardBases(parsed.manifest.shards);
  const byModule = new Map<string, { name: string; dtype: string; f32?: Float32Array; q8?: { codes: Uint8Array; scales: Uint8Array }; shape: number[] }[]>();
  for (const [name, t] of Object.entries(parsed.manifest.tensors)) {
    const m = name.match(/^((?:down_blocks|up_blocks)\.\d+\.motion_modules\.\d+|mid_block\.motion_modules\.\d+)\.(.+)$/);
    if (!m) continue;
    const bytes = parsed.data.subarray(bases[t.shard] + t.offset, bases[t.shard] + t.offset + t.byteLength);
    let g = byModule.get(m[1]);
    if (!g) byModule.set(m[1], (g = []));
    if (t.dtype === 'q8') g.push({ name: m[2], dtype: 'q8', shape: t.shape, q8: { codes: bytes.subarray(0, t.nElems), scales: bytes.subarray(t.nElems) } });
    else g.push({ name: m[2], dtype: t.dtype, shape: t.shape, f32: decodeTensor(bytes, t.nElems, t.dtype) });
  }
  const out = new Map<string, MotionModule>();
  for (const [site, tensors] of byModule) {
    const mod = new MotionModule(engine);
    const projIn = tensors.find((t) => t.name === 'proj_in.weight')!;
    mod.load(projIn.shape[0], tensors); // C du module = dim de proj_in
    out.set(site, mod);
  }
  onProgress?.(tr(`${out.size} motion modules resident.`, `${out.size} modules motion résidents.`));
  return out;
}

export async function loadVideoGenerator(
  urls: { unet: string; clip: string; motion: string; taesd: string; lfm?: string },
  onProgress?: OnProgress,
  pace?: UnetPace,
  tr: Tr = EN_ONLY,
): Promise<VideoGenerator> {
  const engine = new WebGpuEngine();
  if (!(await engine.init())) throw new Error('WebGPU indisponible.');
  await engine.selfValidate();
  if (!engine.videoOk) throw new Error('chemin vidéo coupé (?video=0)');

  const { map: unetST, unetCfg: brikCfg } = await brikImageToMap(engine, urls.unet, onProgress, 'UNet', tr);
  const unetCfg = { ...SD15_UNET, ...(brikCfg || {}) } as UnetCfg;
  const unetW = loadUnetWeights(unetST, unetCfg);
  const { map: clipST } = await brikImageToMap(engine, urls.clip, onProgress, 'CLIP', tr);
  const clip = new ClipTextEncoder(engine, loadClipWeights(clipST, CLIP_L), CLIP_L);
  const motions = await loadMotionModules(engine, urls.motion, onProgress, tr);
  onProgress?.(tr('VAE (TAESD)…', 'VAE (TAESD)…'));
  const taesdBuf = await (await fetch(urls.taesd)).arrayBuffer();
  const taesd = new TaesdDecoder(engine, parseSafetensors(taesdBuf, { keepF16: true }));
  const { AutoTokenizer } = await import('@huggingface/transformers');
  const tok = await AutoTokenizer.from_pretrained('openai/clip-vit-large-patch14');

  const generate = async (prompt: string, opts: { seed?: number; frames?: number; size?: number; onProgress?: (s: string) => void } = {}): Promise<VideoFrames> => {
    const F = opts.frames ?? 16, size = opts.size ?? 256, latS = size / 8, seed = opts.seed ?? ((Math.random() * 1e9) | 0);
    const prog = opts.onProgress ?? onProgress;
    const t0 = performance.now();
    prog?.(tr('Encoding the prompt (CLIP-L)…', 'Encodage du prompt (CLIP-L)…'));
    const enc = await tok(prompt, { truncation: true, max_length: 77 });
    const ids = Array.from(enc.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
    while (ids.length < 77) ids.push(49407); // CLIP-L pad = <|endoftext|>
    const ctx = await clip.encode(ids);

    const sched = makeEulerScheduler(4, 1000, 0.00085, 0.012, 'linear'); // AnimateDiff-Lightning
    let latents: Float32Array[] = [];
    for (let f = 0; f < F; f++) {
      const l = randnSeeded(4 * latS * latS, seed + f * 9973);
      for (let i = 0; i < l.length; i++) l[i] *= sched.initNoiseSigma;
      latents.push(l);
    }
    // Le hook reçoit soit des buffers GPU (chemin résident) soit des Float32Array (repli readback) —
    // décidé par unetForwardVideo selon engine.videoResidentOk. On dispatche sur le type du 1er élément.
    const motionHook = async (site: string, frames: unknown[], C: number, H: number, W: number): Promise<unknown[]> => {
      const mod = motions.get(site);
      if (!mod) return frames; // site sans module (ne devrait pas arriver : 21/21 mappés)
      const NF = frames.length;
      if (frames[0] instanceof Float32Array) { // repli : empilage CPU → forward JS → dépilage
        const cpu = frames as Float32Array[];
        const stacked = new Float32Array(NF * C * H * W);
        for (let f = 0; f < NF; f++) stacked.set(cpu[f], f * C * H * W);
        const out = await mod.forward(stacked, NF, H, W);
        return cpu.map((_, f) => out.subarray(f * C * H * W, (f + 1) * C * H * W) as Float32Array);
      }
      return mod.forwardResident(frames, NF, H, W); // 100 % GPU, rend des buffers GPU
    };
    // Progression PAR BLOC dans chaque pas (un pas ≈ 50 s : sans ça, l'écran semble figé).
    // Ticks du forward vidéo : down = layersPerBlock + downsample/niveau, mid = 1, up = (l+1)+upsample.
    const L = unetCfg.mult.length;
    let blocksTotal = unetCfg.noMid ? 0 : 1;
    for (let i = 0; i < L; i++) blocksTotal += unetCfg.layersPerBlock + (i < L - 1 ? 1 : 0);
    for (let i = 0; i < L; i++) blocksTotal += unetCfg.layersPerBlock + 1 + (i > 0 ? 1 : 0);
    for (let i = 0; i < sched.timesteps.length; i++) {
      prog?.(`${tr('Denoising', 'Débruitage')} ${i + 1}/${sched.timesteps.length} (${F} frames)…`);
      const scaled = latents.map((l) => sched.scaleModelInput(l, i));
      const stepPace: UnetPace = { ...pace, onBlock: (b) => prog?.(`${tr('Denoising', 'Débruitage')} ${i + 1}/${sched.timesteps.length} (${F} frames), ${tr('block', 'bloc')} ${b}/${blocksTotal}…`) };
      const eps = await unetForwardVideo(engine, unetW, scaled, sched.timesteps[i], ctx, { ...unetCfg, H: latS, W: latS }, motionHook, stepPace);
      latents = latents.map((l, f) => sched.step(eps[f], l, i));
    }
    const frames: ImageData[] = [];
    for (let f = 0; f < F; f++) {
      prog?.(`${tr('Decoding frame', 'Décodage frame')} ${f + 1}/${F}…`);
      const img = await taesd.decode(latents[f].map((v) => v * VAE_SCALE) as Float32Array, latS, latS, pace?.duty);
      const rgba = chwToRGBA(img);
      frames.push(new ImageData(new Uint8ClampedArray(rgba), img.W, img.H));
    }
    return { frames, seed, ms: Math.round(performance.now() - t0) };
  };

  // Enrichissement paresseux : LFM2 n'est chargé (sur le MÊME engine) qu'au 1er appel d'enrich.
  let enricher: import('./promptEnrich').PromptEnricher | null = null;
  const enrich = async (prompt: string, prog?: (s: string) => void): Promise<string> => {
    if (!urls.lfm) return prompt; // pas d'URL LFM fournie → no-op
    if (!enricher) {
      const { loadPromptEnricher } = await import('./promptEnrich');
      enricher = await loadPromptEnricher(engine, urls.lfm, prog ?? onProgress, tr);
    }
    return enricher.enrich(prompt);
  };

  return { generate, enrich, engine, dispose: () => { for (const m of motions.values()) m.unload(); } };
}
