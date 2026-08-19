// Real SD-Turbo text→image pipeline on our WGSL components: CLIP text encoder + config-driven UNet
// + TAESD VAE decoder + Euler scheduler, behind the chat's ImageGenerator interface.
//
// STATUS: validated end-to-end in-browser (coherent 256/512px images) — loaders/config confirmed
// against the real sd-turbo checkpoints, conditioning matched to diffusers (pad "!", finalLN true).
// Perf architecture: weights are quantized int8 (q8web) ON the GPU at load and stay resident (CLIP
// ~125 MB + UNet ~0.9 GB VRAM, fp16 bytes converted GPU-side — no JS conversion loop); CLIP, UNet
// and TAESD forwards are fully GPU-resident (one readback per stage); UnetPace throttles the duty
// cycle for thermals. See docs/image-gen-feasibility.md.

import { WebGpuEngine } from '../kernels';
import { streamImageBrik } from '../source';
import { unpackQ8, dequantizeQ8 } from '../../brik/q8web';
import { unpackQ4 } from '../../brik/q4web';
import { parseSafetensors, toF32, type SafeTensor, type TensorData } from '../../safetensors';
import { TaesdDecoder, TaesdEncoder, chwToRGBA } from '../taesd';
import { ClipTextEncoder, validateClip, type ClipWeights, type ClipConfig, type ClipLayerWeights } from './clip';
import { unetForward, unetBlockCount, validateUnet, type UnetWeights, type UnetCfg, type UnetPace, type ResBlockWeights, type TransformerWeights, type UnetLevel } from './unet';
import { makeEulerScheduler, randnSeeded } from './scheduler';
import type { ImageGenerator, ImageResult } from './imageGen';
import { EN_ONLY, type OnProgress, type Tr } from '../progress';
import { VaeDecoder } from './vae';

// ── SD-Turbo (SD2.1 architecture) config ──
export const SD_TURBO_UNET: UnetCfg = {
  baseC: 320, mult: [1, 2, 4, 4], layersPerBlock: 2, attn: [true, true, true, false],
  headDim: 64, ffMult: 4, ctxDim: 1024, seqT: 77, groups: 32,
  tembIn: 320, tembDim: 1280, H: 64, W: 64,
};
// SDXS-512-0.9 (UNet distillé 1-step) : sa topologie ne vit PLUS ici. Le runtime la lit dans le
// manifeste du BRIK (`{ ...SD_TURBO_UNET, ...brikUnetCfg }`, plus bas), et la source de vérité est
// scripts/build-image-brik.cjs (`sdxs-unet.unetCfg`) — l'ancienne constante SDXS_UNET dupliquait
// ces nombres sans aucun lecteur, supprimée le 2026-08-16. Le piège qu'elle documentait, à garder :
// le `attention_head_dim: [8,8,8]` des configs SD1-style compte des TÊTES (→ fixedHeads: 8,
// headDim = C/têtes par niveau), pas des dimensions de tête.
// The shipped text_encoder is a CLIPTextModel ALREADY truncated to 23 layers (the "penultimate"
// trick is baked into the checkpoint), and diffusers reads its last_hidden_state — which APPLIES
// final_layer_norm. Confirmed against text_encoder/config.json (num_hidden_layers: 23). → finalLN: true.
export const SD_TURBO_CLIP: ClipConfig = { dim: 1024, layers: 23, heads: 16, vocab: 49408, maxPos: 77, hidden: 4096, eps: 1e-5, finalLN: true, act: 'gelu' };
const VAE_SCALE = 0.18215;      // SD latent scaling (decode: latent / scale). Verify for TAESD.

// ── Safetensors → structured weights ──

// Quick tensor stats for debugging the numerical pipeline (NaN / range / explosion).
function stats(a: Float32Array): string {
  let mn = Infinity, mx = -Infinity, sum = 0, nan = 0;
  for (const v of a) { if (Number.isNaN(v)) { nan++; continue; } if (v < mn) mn = v; if (v > mx) mx = v; sum += v; }
  return `min=${mn.toFixed(3)} max=${mx.toFixed(3)} mean=${(sum / a.length).toFixed(3)}${nan ? ` NaN=${nan}` : ''}`;
}

// Tensors flow through the loaders as TensorData (f32 array OR raw f16 bytes — parsed with
// keepF16, so the f16→f32 conversion happens on the GPU during the quantize/upload pass).
function tensorGetter(st: Map<string, SafeTensor>) {
  return (name: string): TensorData => {
    const t = st.get(name);
    if (!t) throw new Error(`SD-Turbo: poids manquant "${name}". Clés (extrait): ${[...st.keys()].slice(0, 6).join(', ')}…`);
    return t.data;
  };
}

export function loadClipWeights(st: Map<string, SafeTensor>, cfg: ClipConfig): ClipWeights<TensorData> {
  const g = tensorGetter(st);
  const P = 'text_model.';
  const layers: ClipLayerWeights<TensorData>[] = [];
  for (let i = 0; i < cfg.layers; i++) {
    const L = `${P}encoder.layers.${i}.`;
    layers.push({
      ln1g: g(`${L}layer_norm1.weight`), ln1b: g(`${L}layer_norm1.bias`),
      qw: g(`${L}self_attn.q_proj.weight`), qb: g(`${L}self_attn.q_proj.bias`),
      kw: g(`${L}self_attn.k_proj.weight`), kb: g(`${L}self_attn.k_proj.bias`),
      vw: g(`${L}self_attn.v_proj.weight`), vb: g(`${L}self_attn.v_proj.bias`),
      ow: g(`${L}self_attn.out_proj.weight`), ob: g(`${L}self_attn.out_proj.bias`),
      ln2g: g(`${L}layer_norm2.weight`), ln2b: g(`${L}layer_norm2.bias`),
      fc1w: g(`${L}mlp.fc1.weight`), fc1b: g(`${L}mlp.fc1.bias`),
      fc2w: g(`${L}mlp.fc2.weight`), fc2b: g(`${L}mlp.fc2.bias`),
    });
  }
  return {
    // Embeddings are the ONLY CPU consumers (the [77,dim] gather) → JS-convert just these two.
    tokenEmb: toF32(g(`${P}embeddings.token_embedding.weight`)),
    posEmb: toF32(g(`${P}embeddings.position_embedding.weight`)),
    layers,
    lnfg: g(`${P}final_layer_norm.weight`), lnfb: g(`${P}final_layer_norm.bias`),
  };
}

function loadResnet(g: (n: string) => TensorData, base: string): ResBlockWeights<TensorData> {
  const w: ResBlockWeights<TensorData> = {
    norm1g: g(`${base}.norm1.weight`), norm1b: g(`${base}.norm1.bias`),
    conv1w: g(`${base}.conv1.weight`), conv1b: g(`${base}.conv1.bias`),
    tembw: g(`${base}.time_emb_proj.weight`), tembb: g(`${base}.time_emb_proj.bias`),
    norm2g: g(`${base}.norm2.weight`), norm2b: g(`${base}.norm2.bias`),
    conv2w: g(`${base}.conv2.weight`), conv2b: g(`${base}.conv2.bias`),
  };
  try { w.shortcutw = g(`${base}.conv_shortcut.weight`); w.shortcutb = g(`${base}.conv_shortcut.bias`); } catch { /* no shortcut at this block */ }
  return w;
}

function loadTransformer(g: (n: string) => TensorData, base: string): TransformerWeights<TensorData> {
  const T = `${base}.transformer_blocks.0.`;
  return {
    normg: g(`${base}.norm.weight`), normb: g(`${base}.norm.bias`),
    projInW: g(`${base}.proj_in.weight`), projInB: g(`${base}.proj_in.bias`),
    n1g: g(`${T}norm1.weight`), n1b: g(`${T}norm1.bias`),
    q1w: g(`${T}attn1.to_q.weight`), k1w: g(`${T}attn1.to_k.weight`), v1w: g(`${T}attn1.to_v.weight`),
    o1w: g(`${T}attn1.to_out.0.weight`), o1b: g(`${T}attn1.to_out.0.bias`),
    n2g: g(`${T}norm2.weight`), n2b: g(`${T}norm2.bias`),
    q2w: g(`${T}attn2.to_q.weight`), k2w: g(`${T}attn2.to_k.weight`), v2w: g(`${T}attn2.to_v.weight`),
    o2w: g(`${T}attn2.to_out.0.weight`), o2b: g(`${T}attn2.to_out.0.bias`),
    n3g: g(`${T}norm3.weight`), n3b: g(`${T}norm3.bias`),
    ffProjW: g(`${T}ff.net.0.proj.weight`), ffProjB: g(`${T}ff.net.0.proj.bias`),
    ffOutW: g(`${T}ff.net.2.weight`), ffOutB: g(`${T}ff.net.2.bias`),
    projOutW: g(`${base}.proj_out.weight`), projOutB: g(`${base}.proj_out.bias`),
  };
}

export function loadUnetWeights(st: Map<string, SafeTensor>, cfg: UnetCfg): UnetWeights<TensorData> {
  const g = tensorGetter(st);
  const L = cfg.mult.length, lpb = cfg.layersPerBlock;
  const down: UnetLevel<TensorData>[] = [];
  for (let i = 0; i < L; i++) {
    const resnets: ResBlockWeights<TensorData>[] = [], attns: (TransformerWeights<TensorData> | null)[] = [];
    for (let j = 0; j < lpb; j++) {
      resnets.push(loadResnet(g, `down_blocks.${i}.resnets.${j}`));
      attns.push(cfg.attn[i] ? loadTransformer(g, `down_blocks.${i}.attentions.${j}`) : null);
    }
    const lvl: UnetLevel<TensorData> = { resnets, attns };
    if (i < L - 1) { lvl.sampleW = g(`down_blocks.${i}.downsamplers.0.conv.weight`); lvl.sampleB = g(`down_blocks.${i}.downsamplers.0.conv.bias`); }
    down.push(lvl);
  }
  const up: UnetLevel<TensorData>[] = [];
  for (let k = 0; k < L; k++) {
    const lvlIdx = L - 1 - k; // resolution level this up-block restores
    const resnets: ResBlockWeights<TensorData>[] = [], attns: (TransformerWeights<TensorData> | null)[] = [];
    for (let j = 0; j < lpb + 1; j++) {
      resnets.push(loadResnet(g, `up_blocks.${k}.resnets.${j}`));
      attns.push(cfg.attn[lvlIdx] ? loadTransformer(g, `up_blocks.${k}.attentions.${j}`) : null);
    }
    const lvl: UnetLevel<TensorData> = { resnets, attns };
    if (k < L - 1) { lvl.sampleW = g(`up_blocks.${k}.upsamplers.0.conv.weight`); lvl.sampleB = g(`up_blocks.${k}.upsamplers.0.conv.bias`); }
    up.push(lvl);
  }
  return {
    tw1: g('time_embedding.linear_1.weight'), tb1: g('time_embedding.linear_1.bias'),
    tw2: g('time_embedding.linear_2.weight'), tb2: g('time_embedding.linear_2.bias'),
    convInW: g('conv_in.weight'), convInB: g('conv_in.bias'),
    down,
    // UNets distillés sans mid-block (SDXS) : les tenseurs mid_block.* n'existent pas.
    ...(cfg.noMid ? {} : {
      midRes1: loadResnet(g, 'mid_block.resnets.0'), midAttn: loadTransformer(g, 'mid_block.attentions.0'), midRes2: loadResnet(g, 'mid_block.resnets.1'),
    }),
    up,
    normOutG: g('conv_norm_out.weight'), normOutB: g('conv_norm_out.bias'),
    convOutW: g('conv_out.weight'), convOutB: g('conv_out.bias'),
  };
}

// ── CPU f32 weights → GPU-RESIDENT weights, quantized int8 at load ──
// Big conv/linear weights become q8web {codes,sc} pairs (quantized ON the GPU — no CPU loop),
// norms/biases stay small persistent f32 buffers. Result: ~0.9 GB VRAM instead of ~3.4 GB f32, and
// ZERO weight re-upload per forward (the old path re-streamed every weight every block — the #1
// bandwidth/heat cost). conv_in / conv_out stay f32: first/last layers are the most quant-sensitive
// and they're tiny (11.5K params each).
type GpuT = any;

function resnetToGpu(e: WebGpuEngine, r: ResBlockWeights<TensorData>): ResBlockWeights<GpuT> {
  const out: ResBlockWeights<GpuT> = {
    norm1g: e.uploadGpu(r.norm1g), norm1b: e.uploadGpu(r.norm1b),
    conv1w: e.quantizeQ8Gpu(r.conv1w), conv1b: e.uploadGpu(r.conv1b),
    tembw: e.quantizeQ8Gpu(r.tembw), tembb: e.uploadGpu(r.tembb),
    norm2g: e.uploadGpu(r.norm2g), norm2b: e.uploadGpu(r.norm2b),
    conv2w: e.quantizeQ8Gpu(r.conv2w), conv2b: e.uploadGpu(r.conv2b),
  };
  if (r.shortcutw) { out.shortcutw = e.quantizeQ8Gpu(r.shortcutw); out.shortcutb = e.uploadGpu(r.shortcutb!); }
  return out;
}

function transformerToGpu(e: WebGpuEngine, t: TransformerWeights<TensorData>): TransformerWeights<GpuT> {
  const q8 = (x: TensorData) => e.quantizeQ8Gpu(x), f32 = (x: TensorData) => e.uploadGpu(x);
  return {
    normg: f32(t.normg), normb: f32(t.normb),
    projInW: q8(t.projInW), projInB: f32(t.projInB),
    n1g: f32(t.n1g), n1b: f32(t.n1b),
    q1w: q8(t.q1w), k1w: q8(t.k1w), v1w: q8(t.v1w), o1w: q8(t.o1w), o1b: f32(t.o1b),
    n2g: f32(t.n2g), n2b: f32(t.n2b),
    q2w: q8(t.q2w), k2w: q8(t.k2w), v2w: q8(t.v2w), o2w: q8(t.o2w), o2b: f32(t.o2b),
    n3g: f32(t.n3g), n3b: f32(t.n3b),
    ffProjW: q8(t.ffProjW), ffProjB: f32(t.ffProjB),
    ffOutW: q8(t.ffOutW), ffOutB: f32(t.ffOutB),
    projOutW: q8(t.projOutW), projOutB: f32(t.projOutB),
  };
}

async function levelToGpu(e: WebGpuEngine, l: UnetLevel<TensorData>): Promise<UnetLevel<GpuT>> {
  // Drain the queue after each resnet/transformer: the f32 staging buffers' deferred destroys only
  // land once the GPU has executed the quantize dispatches — without draining, all ~118 tensors'
  // staging (~3.3 GB) can pile up transiently and kill the device on 8-16 GB machines.
  const resnets: ResBlockWeights<GpuT>[] = [];
  for (const r of l.resnets) { resnets.push(resnetToGpu(e, r)); await e.waitGpu(); }
  const attns: (TransformerWeights<GpuT> | null)[] = [];
  for (const a of l.attns) {
    attns.push(a ? transformerToGpu(e, a) : null);
    if (a) await e.waitGpu();
  }
  const out: UnetLevel<GpuT> = { resnets, attns };
  if (l.sampleW) { out.sampleW = e.quantizeQ8Gpu(l.sampleW); out.sampleB = e.uploadGpu(l.sampleB!); await e.waitGpu(); }
  return out;
}

// CLIP → GPU-resident : matmuls en q8 (dims 1024/4096, toutes %32), LN/biais en f32. Les embeddings
// restent CPU (le gather [77,dim] est trivial). ~125 Mo VRAM au lieu de ~500 Mo f32 ré-uploadés à
// CHAQUE génération par l'ancien chemin per-op.
export async function clipWeightsToGpu(e: WebGpuEngine, w: ClipWeights<TensorData>): Promise<ClipWeights<GpuT>> {
  const layers: ClipLayerWeights<GpuT>[] = [];
  for (const L of w.layers) {
    layers.push({
      ln1g: e.uploadGpu(L.ln1g), ln1b: e.uploadGpu(L.ln1b),
      qw: e.quantizeQ8Gpu(L.qw), qb: e.uploadGpu(L.qb),
      kw: e.quantizeQ8Gpu(L.kw), kb: e.uploadGpu(L.kb),
      vw: e.quantizeQ8Gpu(L.vw), vb: e.uploadGpu(L.vb),
      ow: e.quantizeQ8Gpu(L.ow), ob: e.uploadGpu(L.ob),
      ln2g: e.uploadGpu(L.ln2g), ln2b: e.uploadGpu(L.ln2b),
      fc1w: e.quantizeQ8Gpu(L.fc1w), fc1b: e.uploadGpu(L.fc1b),
      fc2w: e.quantizeQ8Gpu(L.fc2w), fc2b: e.uploadGpu(L.fc2b),
    });
    await e.waitGpu(); // borne le staging f32 transitoire (cf. unetWeightsToGpu)
  }
  return { tokenEmb: w.tokenEmb, posEmb: w.posEmb, layers, lnfg: e.uploadGpu(w.lnfg), lnfb: e.uploadGpu(w.lnfb) };
}

export async function unetWeightsToGpu(e: WebGpuEngine, w: UnetWeights<TensorData>, onProgress?: OnProgress, tr: Tr = EN_ONLY): Promise<UnetWeights<GpuT>> {
  const q8 = (i: number, n: number) => `${tr('Quantizing the UNet to int8', 'Quantification int8 du UNet')} ${i}/${n}…`;
  const down: UnetLevel<GpuT>[] = [], up: UnetLevel<GpuT>[] = [];
  for (let i = 0; i < w.down.length; i++) { onProgress?.(q8(i + 1, w.down.length * 2 + 1)); down.push(await levelToGpu(e, w.down[i])); }
  onProgress?.(q8(w.down.length + 1, w.down.length * 2 + 1));
  const midRes1 = w.midRes1 && resnetToGpu(e, w.midRes1), midAttn = w.midAttn && transformerToGpu(e, w.midAttn), midRes2 = w.midRes2 && resnetToGpu(e, w.midRes2);
  await e.waitGpu();
  for (let i = 0; i < w.up.length; i++) { onProgress?.(q8(w.down.length + 2 + i, w.down.length * 2 + 1)); up.push(await levelToGpu(e, w.up[i])); }
  const out: UnetWeights<GpuT> = {
    tw1: e.quantizeQ8Gpu(w.tw1), tb1: e.uploadGpu(w.tb1), tw2: e.quantizeQ8Gpu(w.tw2), tb2: e.uploadGpu(w.tb2),
    convInW: e.uploadGpu(w.convInW), convInB: e.uploadGpu(w.convInB),   // f32 (tiny, quant-sensitive)
    down,
    midRes1, midAttn, midRes2,
    up,
    normOutG: e.uploadGpu(w.normOutG), normOutB: e.uploadGpu(w.normOutB),
    convOutW: e.uploadGpu(w.convOutW), convOutB: e.uploadGpu(w.convOutB), // f32 (predicts eps — keep exact)
  };
  await e.waitGpu();
  return out;
}

// Render [3,H,W] (~[0,1]) → full PNG + tiny blurred thumb (mirrors imageGen's renderResult).
// Full PNG = toBlob (encodage async) + blob URL, PAS toDataURL : à 512² l'encodage base64 synchrone
// gelait le main thread ~100 ms juste après la génération. L'URL pleine ne sert qu'à l'affichage
// (chatStore ne persiste que le thumb) — le blob vit jusqu'à la fermeture de l'onglet, acceptable
// pour quelques images par session. Le thumb 48² reste en data URL (persisté, coût négligeable).
// `keepFull` (img2img) : l'image dépend des pixels source → non régénérable depuis prompt+seed.
// On rend une data URL persistable (`full`) au lieu du blob éphémère (~150-300 Ko à 256px, accepté).
async function toResult(img: { data: Float32Array; C: number; H: number; W: number }, seed: number, keepFull = false): Promise<ImageResult> {
  const canvas = document.createElement('canvas');
  canvas.width = img.W; canvas.height = img.H;
  const ctx = canvas.getContext('2d')!;
  const id = ctx.createImageData(img.W, img.H); id.data.set(chwToRGBA(img)); ctx.putImageData(id, 0, 0);
  const TS = 48, tc = document.createElement('canvas'); tc.width = TS; tc.height = TS;
  tc.getContext('2d')!.drawImage(canvas, 0, 0, TS, TS);
  if (keepFull) {
    const full = canvas.toDataURL('image/png');
    return { url: full, w: img.W, h: img.H, thumb: tc.toDataURL('image/png'), seed, full };
  }
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  return { url: blob ? URL.createObjectURL(blob) : canvas.toDataURL('image/png'), w: img.W, h: img.H, thumb: tc.toDataURL('image/png'), seed };
}

// blob/data URL → [3,H,W] floats en [0,1] (l'entrée du TAESD encodeur). URLs même-origine
// uniquement (blobs/data générés par nous) — pas de souci CORS sur le canvas.
async function urlToCHW(url: string): Promise<{ data: Float32Array; H: number; W: number }> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(new Error('image source illisible')); img.src = url; });
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
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

// ── BRIK image pré-quantifié → handles GPU ──────────────────────────────────────────────────────
// Produit une Map<nom, SafeTensor> dont `.data` est DÉJÀ le handle GPU attendu par le forward
// ({codes,sc} q8 · {nib,sc,mn} q4 · buffer f32 pour f16/f32) — sauf les embeddings CLIP, gardés
// CPU (le gather [77,dim] est CPU) : q8 → déquant CPU, f16 → bytes copiés (toF32 au mapping).
// loadClipWeights/loadUnetWeights mappent ensuite nom→champ tels quels : la structure retournée
// EST la version GPU — aucune passe *ToGpu, aucune quantification au chargement (tout l'intérêt
// du pré-quantifié : téléchargement ÷2 et démarrage plus rapide). Une plage HTTP par shard,
// cache + reprise hérités de fetchRange ; waitGpu par shard draine le staging transitoire.
export async function brikImageToMap(e: WebGpuEngine, url: string, onProgress?: OnProgress, label = 'weights', tr: Tr = EN_ONLY): Promise<{ map: Map<string, SafeTensor>; unetCfg?: Record<string, unknown> }> {
  const u8 = (a: Int8Array | Uint16Array | Uint8Array) => new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  const cpuNames = new Set(['text_model.embeddings.token_embedding.weight', 'text_model.embeddings.position_embedding.weight']);
  const map = new Map<string, SafeTensor>();
  const manifest = await streamImageBrik(url, (name, t, bytes) => {
    let data: unknown;
    if (cpuNames.has(name)) {
      data = t.dtype === 'q8' ? dequantizeQ8(unpackQ8(bytes, t.nElems))
        : t.dtype === 'f16' ? { f16: bytes.slice(), n: t.nElems } // copie — les bytes du shard sont relâchés
        : new Float32Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + t.byteLength));
    } else if (t.dtype === 'q8') {
      const q = unpackQ8(bytes, t.nElems);
      data = { codes: e.uploadGpuRaw(u8(q.codes)), sc: e.uploadGpuRaw(u8(q.scales)) };
    } else if (t.dtype === 'q4') {
      const q = unpackQ4(bytes, t.nElems);
      data = { nib: e.uploadGpuRaw(q.nibbles), sc: e.uploadGpuRaw(u8(q.scales)), mn: e.uploadGpuRaw(u8(q.mins)) };
    } else if (t.dtype === 'f16') {
      data = e.uploadGpu({ f16: bytes, n: t.nElems }); // conversion f16→f32 sur le GPU, comme avant
    } else {
      data = e.uploadGpu(new Float32Array(bytes.buffer, bytes.byteOffset, t.nElems));
    }
    map.set(name, { name, shape: t.shape, data: data as TensorData });
  }, async (done, total, bytes) => {
    onProgress?.(`${tr('Streaming', 'Streaming')} ${label} (BRIK) ${done}/${total}…`, bytes);
    await e.waitGpu(); // draine le staging f32 par shard (leçon : ~3 Go accumulés tuaient le device)
  });
  return { map, unetCfg: manifest.image?.unetCfg };
}

interface SdTurboParts { engine: WebGpuEngine; clip: ClipTextEncoder; unetW: UnetWeights<any>; unetCfg: UnetCfg; taesd: TaesdDecoder; vae?: VaeDecoder; steps: number; size: number; pace: UnetPace; tokenize: (p: string) => Promise<number[]>; getEncoder: () => Promise<TaesdEncoder>; tr: Tr; }

function makeGenerator(parts: SdTurboParts): ImageGenerator {
  const { engine, clip, unetW, unetCfg, taesd, vae, steps, size, pace, tokenize, getEncoder, tr } = parts;
  const blocksTotal = unetBlockCount(unetCfg);

  // Prompt → contexte CLIP [77, 1024] (partagé txt2img / img2img).
  const encodePrompt = async (prompt: string, onProgress?: (s: string) => void): Promise<Float32Array> => {
    onProgress?.(tr('Tokenizing…', 'Tokenisation…'));
    const ids = await tokenize(prompt);
    onProgress?.(tr('Encoding the prompt (CLIP)…', 'Encodage du prompt (CLIP)…'));
    const ctx = await clip.encode(ids);
    console.log('[sdturbo] CLIP ctx', stats(ctx));
    return ctx;
  };

  // Boucle Euler depuis l'index `start` (0 = txt2img complet ; >0 = img2img, latent déjà bruité à
  // σ[start]) puis décodage TAESD. `latent` est consommé.
  const denoise = async (latent: Float32Array, sched: ReturnType<typeof makeEulerScheduler>, start: number, ctx: Float32Array, H: number, W: number, usedSeed: number, onProgress?: OnProgress, duty?: number, keepFull = false): Promise<ImageResult> => {
    const nSteps = sched.timesteps.length - start;
    // Unités d'avancement : un bloc d'UNet par pas, plus le décodage VAE final (compté 1 bloc).
    const unitsTotal = nSteps * blocksTotal + 1;
    for (let i = start; i < sched.timesteps.length; i++) {
      const n = i - start + 1;
      onProgress?.(`${tr('Denoising', 'Débruitage')} ${n}/${nSteps}…`, undefined, ((n - 1) * blocksTotal) / unitsTotal);
      const scaled = sched.scaleModelInput(latent, i);
      const stepPace: UnetPace = {
        ...pace,
        duty: duty ?? pace.duty,
        onBlock: (b) => onProgress?.(`${tr('Denoising', 'Débruitage')} ${n}/${nSteps}, ${tr('block', 'bloc')} ${b}/${blocksTotal}…`, undefined, ((n - 1) * blocksTotal + b) / unitsTotal),
      };
      const eps = await unetForward(engine, unetW, scaled, sched.timesteps[i], ctx, { ...unetCfg, H, W }, stepPace);
      console.log(`[sdturbo] step ${i} t=${sched.timesteps[i]} σ=${sched.sigmas[i].toFixed(2)} eps`, stats(eps));
      latent = sched.step(eps, latent, i);
    }
    console.log('[sdturbo] latent final', stats(latent));
    onProgress?.(tr('Decoding (VAE)…', 'Décodage (VAE)…'), undefined, (nSteps * blocksTotal) / unitsTotal);
    // TAESD takes the raw model latent (its Clamp handles the range) — NO 0.18215 division (that
    // over-scales and saturates the clamp). VAE_SCALE kept for reference if we wire the full VAE.
    void VAE_SCALE; // la division par ce facteur vit dans VaeDecoder ; TAESD prend le latent brut
    const img = vae
      ? await vae.decode(latent, H, W, duty ?? pace.duty)
      : await taesd.decode(latent, H, W, duty ?? pace.duty);
    console.log('[sdturbo] image', stats(img.data));
    // Give the scratch back: a 512² run leaves hundreds of MB of pooled buffers that nothing
    // reclaims otherwise (they'd stay resident for the whole session).
    engine.trimPool();
    return toResult(img, usedSeed, keepFull);
  };

  const seedOf = (prompt: string, seed?: number) =>
    seed ?? (Array.from(prompt).reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261) >>> 0);

  return {
    // Le nom suit la topologie réellement chargée (le BRIK SDXS est auto-descripteur : noMid).
    name: unetCfg.noMid ? 'SDXS-512 (rapide)' : 'Stable Diffusion Turbo',
    placeholder: false,
    engine,
    dispose: () => engine.destroy(), // frees the whole pipeline's VRAM (weights + pools) in one shot
    generate: async (prompt, onProgress, seed, latentSize, duty) => {
      const usedSeed = seedOf(prompt, seed);
      const ctx = await encodePrompt(prompt, onProgress);
      const H = latentSize ?? size, W = H;
      const sched = makeEulerScheduler(steps);
      const latent = randnSeeded(4 * H * W, usedSeed);
      for (let i = 0; i < latent.length; i++) latent[i] *= sched.initNoiseSigma;
      return denoise(latent, sched, 0, ctx, H, W, usedSeed, onProgress, duty);
    },
    // img2img : pixels source → latent (TAESD encodeur) → re-bruitage à σ(strength) → mêmes
    // `steps` passes UNet que le txt2img (le planning est ÉTIRÉ à N = steps/strength pas au total,
    // on n'exécute que la queue) → décodage. Taille de sortie = taille source.
    generateImg2Img: async (prompt, initUrl, strength, onProgress, seed, duty) => {
      const usedSeed = seedOf(prompt, seed);
      const s = Math.min(Math.max(strength, 0.05), 1);
      onProgress?.(tr('Reading the source image…', 'Lecture de l’image source…'));
      const src = await urlToCHW(initUrl);
      if (src.H % 8 || src.W % 8) throw new Error(`taille source ${src.W}×${src.H} non multiple de 8`);
      const H = src.H / 8, W = src.W / 8;
      const ctx = await encodePrompt(prompt, onProgress);
      onProgress?.(tr('Encoding the image (VAE)…', 'Encodage de l’image (VAE)…'));
      const enc = await getEncoder();
      const latent = await enc.encode(src.data, src.H, src.W, duty ?? pace.duty);
      console.log('[sdturbo] latent img2img', stats(latent));
      const N = Math.max(steps, Math.round(steps / s));
      const start = N - steps;
      const sched = makeEulerScheduler(N);
      const noise = randnSeeded(latent.length, usedSeed);
      for (let i = 0; i < latent.length; i++) latent[i] += noise[i] * sched.sigmas[start];
      console.log(`[sdturbo] img2img strength=${s} → N=${N}, départ index ${start} (t=${sched.timesteps[start]}, σ=${sched.sigmas[start].toFixed(2)})`);
      return denoise(latent, sched, start, ctx, H, W, usedSeed, onProgress, duty, true);
    },
  };
}


// Build the real SD-Turbo generator by streaming the three weight files (UNet, text encoder, TAESD).
// `urls` lets the caller point at a host/mirror. steps 1 (Turbo) and a small `size` keep the first
// f32 run from blowing memory; raise once quantization lands.
// `finalLN` A/B knob: SD2/sd-turbo ships a 23-layer CLIPTextModel that INCLUDES a `final_layer_norm`.
// diffusers' pipeline reads `text_encoder(ids)[0]` = last_hidden_state, which APPLIES that final LN →
// so matching diffusers wants finalLN:true. The CompVis "penultimate, no ln_final" lore wants false.
// It's genuinely ambiguous without a reference embedding, so we expose it to A/B in-browser (page.tsx
// reads `?finalLN=1`/`0`). Default undefined → falls back to SD_TURBO_CLIP.finalLN.
// `pace` = thermal control of the UNet forward (see UnetPace): drain the GPU queue every `waitEvery`
// blocks then sleep proportionally to the busy time (`duty` = target GPU duty cycle). Internal
// default 0.6: generation ~1.7× slower than full throttle, average GPU power ~-40% — deliberately
// NOT exposed in the UI (one less knob); dev override via `?duty=` in the URL.
export async function loadSdTurbo(urls: { unet: string; clip: string; taesd: string; taesdEncoder?: string; vae?: string }, opts: { steps?: number; size?: number; finalLN?: boolean; pace?: UnetPace; onLost?: () => void; t?: Tr } = {}, onProgress?: OnProgress): Promise<ImageGenerator> {
  const clipCfg: ClipConfig = { ...SD_TURBO_CLIP, finalLN: opts.finalLN ?? SD_TURBO_CLIP.finalLN };
  const pace: UnetPace = { waitEvery: opts.pace?.waitEvery ?? 1, pauseMs: opts.pace?.pauseMs ?? 0, duty: opts.pace?.duty ?? 0.6 };
  const tr: Tr = opts.t ?? EN_ONLY;
  onProgress?.(tr('Starting WebGPU…', 'Initialisation WebGPU…'));
  const engine = new WebGpuEngine();
  if (!(await engine.init())) throw new Error('WebGPU indisponible.');
  // Perte du device en pleine génération (512² mobile : pic VRAM → l'OS reprend le GPU) : sans ce
  // hook, unetForward attendait un GPU mort pour toujours — « bloqué à 1/13 » sans erreur. Même
  // filet que le moteur LLM ; dispose() volontaire (reason 'destroyed') filtré.
  engine.onLost = (info) => { if (info?.reason !== 'destroyed') opts.onLost?.(); };
  // Confirm the compute graph (kernels + CLIP + UNet blocks/topology) on synthetic data before the
  // real run — non-blocking, logs to console. Surfaces any device-specific kernel issue up front.
  engine.validateDiffusion().then((f) => console.log(f ? `[selfValidate] image-gen KO: ${f}` : '[selfValidate] image-gen primitives OK')).catch(() => {});
  engine.validateResidentOps().then((f) => console.log(f ? `[resident] ops KO: ${f}` : '[resident] GPU-resident ops OK (1 submit == per-op)')).catch(() => {});
  validateClip(engine).then((f) => console.log(f ? `[clip] self-test KO: ${f}` : '[clip] encoder self-test OK')).catch(() => {});
  validateUnet(engine).then((f) => console.log(f ? `[unet] self-test KO: ${f}` : '[unet] self-test OK')).catch(() => {});
  // Cache the (large) weight files in the browser Cache Storage so they're downloaded ONCE — same
  // store as the LLM weights. Subject to quota; a failed put just means a re-download next time.
  const cachedBuf = async (u: string, label: string): Promise<ArrayBuffer> => {
    const cache = await caches.open('brimkern-model-cache').catch(() => null);
    if (cache) {
      const hit = await cache.match(u);
      if (hit) { onProgress?.(`${label} ${tr('from cache…', 'depuis le cache…')}`); return hit.arrayBuffer(); }
    }
    const r = await fetch(u);
    if (!r.ok) throw new Error(`HTTP ${r.status} (${label})`);
    const total = parseInt(r.headers.get('content-length') || '0', 10);
    const reader = r.body?.getReader();
    if (!reader) return r.arrayBuffer();
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); loaded += value.byteLength;
      // Les octets voyagent à côté du libellé : l'app en fait une barre et un temps restant.
      onProgress?.(`${tr('Downloading', 'Téléchargement')} ${label}…`, total ? { loaded, total } : undefined);
    }
    const blob = new Blob(chunks as BlobPart[]);
    if (cache) { try { await cache.put(u, new Response(blob, { headers: { 'Content-Length': String(blob.size) } })); } catch (e) { console.warn(`[sdturbo] cache ${label} échoué (quota ?)`, e); } }
    return blob.arrayBuffer();
  };
  // keepF16: the fp16 weights stay raw bytes until the GPU converts+quantizes them — no JS loop
  // over 860M elements (the old parse froze the main thread ~10 s). TAESD is F32 → default parse.
  const fetchST = async (u: string, label: string, keepF16 = false) => parseSafetensors(await cachedBuf(u, label), { keepF16 });
  // Une URL .brik = poids PRÉ-quantifiés streamés (÷2 le téléchargement, zéro quantification au
  // chargement) ; sinon le chemin safetensors fp16 historique (quantification q8 sur le GPU).
  // Le BRIK UNet est auto-descripteur : sa config de topologie (SDXS : 3 niveaux, noMid,
  // fixedHeads) voyage dans le manifeste et se fusionne sur les défauts SD-Turbo.
  const isBrik = (u: string) => u.endsWith('.brik');
  let brikUnetCfg: Record<string, unknown> | undefined;
  const clipST = isBrik(urls.clip) ? (await brikImageToMap(engine, urls.clip, onProgress, 'CLIP')).map : await fetchST(urls.clip, 'CLIP', true);
  let unetST: Map<string, SafeTensor>;
  if (isBrik(urls.unet)) {
    const r = await brikImageToMap(engine, urls.unet, onProgress, 'UNet');
    unetST = r.map;
    brikUnetCfg = r.unetCfg;
  } else {
    unetST = await fetchST(urls.unet, 'UNet', true);
  }
  // Shape diagnostics: confirm the config matches the real files (dim/layers/ctxDim/baseC). A silent
  // dim mismatch (e.g. CLIP-L 768 read as OpenCLIP-H 1024) yields plausible-but-wrong output.
  const shp = (st: Map<string, SafeTensor>, n: string) => st.get(n)?.shape?.join('×') ?? 'MISSING';
  const nClipLayers = [...clipST.keys()].filter((k) => /encoder\.layers\.\d+\.layer_norm1\.weight$/.test(k)).length;
  console.log('[sdturbo] CLIP: token_emb', shp(clipST, 'text_model.embeddings.token_embedding.weight'),
    '· q_proj', shp(clipST, 'text_model.encoder.layers.0.self_attn.q_proj.weight'), '· #layers', nClipLayers,
    '· final_ln?', clipST.has('text_model.final_layer_norm.weight'), '· finalLN(appliqué)=', clipCfg.finalLN !== false);
  console.log('[sdturbo] UNet: conv_in', shp(unetST, 'conv_in.weight'),
    '· time1', shp(unetST, 'time_embedding.linear_1.weight'),
    '· cross to_k', shp(unetST, 'down_blocks.0.attentions.0.transformer_blocks.0.attn2.to_k.weight'),
    '· ff.0.proj', shp(unetST, 'down_blocks.0.attentions.0.transformer_blocks.0.ff.net.0.proj.weight'));
  // Quantize + upload CLIP and the UNet to the GPU ONCE (int8 for conv/linear weights, f32 for
  // norms/biases), then drop the CPU copies — ~1 GB VRAM resident total, ~4 GB of JS heap freed,
  // zero weight re-upload per generation (the old path re-streamed everything every image).
  // BRIK : la map contient déjà des handles GPU → le mapping nom→champ SUFFIT (pas de *ToGpu).
  let clipW: ClipWeights<GpuT>;
  if (isBrik(urls.clip)) {
    clipW = loadClipWeights(clipST, clipCfg) as unknown as ClipWeights<GpuT>;
  } else {
    onProgress?.(tr('Quantizing CLIP to int8 (GPU)…', 'Quantification int8 de CLIP (GPU)…'));
    clipW = await clipWeightsToGpu(engine, loadClipWeights(clipST, clipCfg));
  }
  clipST.clear();
  const unetCfg: UnetCfg = brikUnetCfg ? { ...SD_TURBO_UNET, ...brikUnetCfg } : SD_TURBO_UNET;
  let unetW: UnetWeights<GpuT>;
  if (isBrik(urls.unet)) {
    unetW = loadUnetWeights(unetST, unetCfg) as unknown as UnetWeights<GpuT>;
  } else {
    onProgress?.(tr('Quantizing the UNet to int8 (GPU)…', 'Quantification int8 du UNet (GPU)…'));
    unetW = await unetWeightsToGpu(engine, loadUnetWeights(unetST, unetCfg), onProgress);
  }
  unetST.clear();
  const taesd = new TaesdDecoder(engine, await fetchST(urls.taesd, 'VAE (TAESD)'));
  // Décodeur VAE COMPLET, si une URL est fournie : ~160 Mo de safetensors fp16 quantifiés int8 sur
  // le GPU. TAESD reste chargé (2,4 Mo) et sert de repli — il coûte trop peu pour qu'on s'en prive,
  // et un GPU qui manquerait de mémoire pour le grand décodeur doit pouvoir retomber dessus.
  let vae: VaeDecoder | undefined;
  if (urls.vae) {
    try {
      vae = new VaeDecoder(engine, await fetchST(urls.vae, tr('full decoder (VAE)', 'décodeur complet (VAE)'), true));
    } catch (err) {
      console.warn('[sdturbo] décodeur VAE complet indisponible → TAESD', err);
    }
  }
  // Encodeur TAESD (~4,8 Mo) : img2img seulement → chargé PARESSEUSEMENT à la première utilisation
  // (même cache navigateur que le reste). URL dérivée du décodeur si non fournie.
  let taesdEnc: TaesdEncoder | null = null;
  const getEncoder = async (): Promise<TaesdEncoder> => {
    if (!taesdEnc) {
      const u = urls.taesdEncoder ?? urls.taesd.replace('taesd_decoder', 'taesd_encoder');
      taesdEnc = new TaesdEncoder(engine, await fetchST(u, 'VAE encodeur (TAESD)'));
    }
    return taesdEnc;
  };
  const clip = new ClipTextEncoder(engine, clipW, clipCfg);
  const { AutoTokenizer } = await import('@huggingface/transformers');
  // Same BPE vocab/merges as sd-turbo's tokenizer — but a DIFFERENT pad token: patch32 pads with
  // <|endoftext|> (49407) while sd-turbo pads with "!" (id 0, per tokenizer_config.json). SD feeds
  // all 77 positions to cross-attention with no mask, so pad identity matters → pad manually with 0.
  const tok = await AutoTokenizer.from_pretrained('openai/clip-vit-base-patch32');
  const tokenize = async (p: string) => {
    const enc = await tok(p, { truncation: true, max_length: 77 });
    const ids = Array.from(enc.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
    while (ids.length < 77) ids.push(0); // "!" — sd-turbo pad token
    console.log('[sdturbo] tokens', ids.slice(0, ids.indexOf(0) === -1 ? 12 : ids.indexOf(0) + 2).join(','), `(len utile=${ids.indexOf(0) === -1 ? 77 : ids.indexOf(0)})`);
    return ids;
  };
  return makeGenerator({ engine, clip, unetW, unetCfg, taesd, vae, steps: opts.steps ?? 1, size: opts.size ?? 64, pace, tokenize, getEncoder, tr });
}
