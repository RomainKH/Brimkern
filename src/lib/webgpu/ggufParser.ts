// Brimkern - GGUF File Parser in TypeScript
// Parses GGUF version 2 or 3 files directly on the client side in the browser.

export interface TensorInfo {
  offset: number;
  bytes: number;
  nElems: number;
  type: string;
  shape: number[];
}

export interface Manifest {
  arch: string;
  config: {
    d: number;
    nHeads: number;
    nKvHeads: number;
    headDim: number;
    ffn: number;
    blockCount: number;
    ropeTheta: number;
    rmsEps: number;
    // ── Optional arch-portability knobs (set for Gemma; absent ⇒ Qwen2/Llama defaults). ──
    attnLogitSoftcap?: number;  // tanh softcap on attention scores (Gemma2 ≈ 50)
    finalLogitSoftcap?: number; // tanh softcap on output logits before sampling (Gemma2 ≈ 30)
    attnScale?: number;         // q·k scale (Gemma2: 1/sqrt(query_pre_attn_scalar)); default 1/sqrt(headDim)
    act?: 'silu' | 'gelu';      // FFN gate activation (Gemma = gelu)
    rmsGainOnePlus?: boolean;   // RMSNorm gain (1+w) convention (Gemma)
    embedScale?: number;        // multiply token embeddings by this (Gemma = sqrt(d))
    mropeSections?: number[];   // M-RoPE (Qwen2-VL) : sections de fréquences [t, h, w]
    // ── Attention par couche (Gemma 3) : fenêtre glissante (0 = pleine) et base RoPE, alternées
    // 5 locales / 1 globale. Absents ⇒ toutes les couches en causal plein avec ropeTheta. ──
    windowPerLayer?: number[];
    ropeThetaPerLayer?: number[];
    // NoPE (SmolLM3) : couches SANS RoPE (1 sur 4). Absent ⇒ RoPE partout (comportement historique).
    skipRopePerLayer?: boolean[];
    // Convention d'appariement du RoPE : true = paires adjacentes (2i, 2i+1) = ggml NORM (llama,
    // mistral, smollm3) ; absent ⇒ rotate_half (i, i+headDim/2) = convention Hugging Face.
    ropeInterleaved?: boolean;
    // YaRN (Ministral 3, …) : transform STATIQUE par fréquence (calculé en buffer rope_factors
    // par model.ts) ; l'échelle d'attention mscale² est déjà pliée dans attnScale par le parser.
    yarn?: { factor: number; betaFast: number; betaSlow: number; origCtx: number };
    // RWKV-7 (moteur v2) : head_size + rangs des 4 sous-projections LoRA du time-mix.
    rwkv?: { headSize: number; decayLoraRank: number; iclrLoraRank: number; valueLoraRank: number; gateLoraRank: number };
    // LFM2/LFM2.5 (moteur v2, hybride) : fenêtre de la conv courte + têtes KV par couche
    // (0 = bloc shortconv, >0 = bloc attention GQA).
    lfm2?: { lCache: number; kvHeadsPerLayer: number[] };
  };
  tensors: Record<string, TensorInfo>;
  // Métadonnées GGUF brutes (clé → valeur) : les fichiers non-LLM (mmproj vision, arch `clip`)
  // portent leur config sous des clés que le mapping ci-dessus ne connaît pas.
  metadata: Record<string, unknown>;
}

class BinaryReader {
  private view: DataView;
  private offset: number = 0;

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
  }

  getOffset() {
    return this.offset;
  }

  setOffset(off: number) {
    this.offset = off;
  }

  uint8() {
    const val = this.view.getUint8(this.offset);
    this.offset += 1;
    return val;
  }

  int8() {
    const val = this.view.getInt8(this.offset);
    this.offset += 1;
    return val;
  }

  uint16() {
    const val = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return val;
  }

  int16() {
    const val = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return val;
  }

  uint32() {
    const val = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return val;
  }

  int32() {
    const val = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return val;
  }

  float32() {
    const val = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return val;
  }

  float64() {
    const val = this.view.getFloat64(this.offset, true);
    this.offset += 8;
    return val;
  }

  uint64() {
    // Read 64-bit uint as a safe Javascript number
    const lo = this.view.getUint32(this.offset, true);
    const hi = this.view.getUint32(this.offset + 4, true);
    this.offset += 8;
    return lo + hi * 4294967296;
  }

  int64() {
    const lo = this.view.getUint32(this.offset, true);
    const hi = this.view.getInt32(this.offset + 4, true);
    this.offset += 8;
    return lo + hi * 4294967296;
  }

  string() {
    const len = this.uint64();
    if (this.offset + len > this.view.byteLength) {
      throw new Error(`BinaryReader: string length ${len} exceeds buffer size`);
    }
    const bytes = new Uint8Array(this.view.buffer, this.offset, len);
    this.offset += len;
    return new TextDecoder().decode(bytes);
  }
}

const GGML_TYPE_NAMES = [
  "F32", "F16", "Q4_0", "Q4_1", "Q4_2", "Q4_3", "Q5_0", "Q5_1",
  "Q8_0", "Q8_1", "Q2_K", "Q3_K", "Q4_K", "Q5_K", "Q6_K", "Q8_K"
];

// Returns size in bytes of a block, and elements in a block
const getGgmlBlockInfo = (typeStr: string) => {
  switch (typeStr) {
    case "F32": return { block: 1, size: 4 };
    case "F16": return { block: 1, size: 2 };
    case "Q4_0": return { block: 32, size: 18 };
    case "Q4_1": return { block: 32, size: 20 };
    case "Q5_0": return { block: 32, size: 22 };
    case "Q5_1": return { block: 32, size: 24 };
    case "Q8_0": return { block: 32, size: 34 };
    case "Q2_K": return { block: 256, size: 66 };
    case "Q3_K": return { block: 256, size: 110 }; // approx
    case "Q4_K": return { block: 256, size: 144 };
    case "Q5_K": return { block: 256, size: 176 };
    case "Q6_K": return { block: 256, size: 210 };
    case "Q8_K": return { block: 256, size: 288 };
    default: return { block: 1, size: 4 }; // fallback
  }
};

export async function parseGguf(file: Blob | File): Promise<Manifest> {
  const HEADER_CHUNK_SIZE = Math.min(file.size, 100 * 1024 * 1024);
  const chunk = file.slice(0, HEADER_CHUNK_SIZE);
  const buffer = await chunk.arrayBuffer();
  const reader = new BinaryReader(buffer);

  // 1. Magic
  const magicChars = [
    String.fromCharCode(reader.uint8()),
    String.fromCharCode(reader.uint8()),
    String.fromCharCode(reader.uint8()),
    String.fromCharCode(reader.uint8()),
  ].join('');

  if (magicChars !== 'GGUF') {
    throw new Error(`Fichier GGUF invalide. Sceau magique absent : ${magicChars}`);
  }

  // 2. Version
  const version = reader.uint32();
  if (version !== 2 && version !== 3) {
    throw new Error(`Version GGUF non supportée : ${version}`);
  }

  // 3. Header counts
  const tensorCount = reader.uint64();
  const metadataCount = reader.uint64();

  // Helper to read metadata value recursively
  const readMetadataVal = (type: number): any => {
    switch (type) {
      case 0: return reader.uint8();
      case 1: return reader.int8();
      case 2: return reader.uint16();
      case 3: return reader.int16();
      case 4: return reader.uint32();
      case 5: return reader.int32();
      case 6: return reader.float32();
      case 7: return reader.uint8() !== 0;
      case 8: return reader.string();
      case 9: { // array
        const itemType = reader.uint32();
        const len = reader.uint64();
        const arr = [];
        for (let i = 0; i < len; i++) {
          arr.push(readMetadataVal(itemType));
        }
        return arr;
      }
      case 10: return reader.uint64();
      case 11: return reader.int64();
      case 12: return reader.float64();
      default:
        throw new Error(`Type de métadonnées non supporté : ${type}`);
    }
  };

  // 4. Parse Metadata
  const metadata: Record<string, any> = {};
  for (let i = 0; i < metadataCount; i++) {
    const key = reader.string();
    const valType = reader.uint32();
    const val = readMetadataVal(valType);
    metadata[key] = val;
  }

  const alignment = (metadata['general.alignment'] as number) ?? 32;
  const arch = (metadata['general.architecture'] as string) ?? 'llama';

  // 5. Parse Tensor Info
  interface RawTensorInfo {
    name: string;
    shape: number[];
    typeIdx: number;
    relativeOffset: number;
  }

  const rawTensors: RawTensorInfo[] = [];
  for (let i = 0; i < tensorCount; i++) {
    const name = reader.string();
    const nDims = reader.uint32();
    const shape: number[] = [];
    for (let d = 0; d < nDims; d++) {
      shape.push(reader.uint64());
    }
    const typeIdx = reader.uint32();
    const relativeOffset = reader.uint64();
    rawTensors.push({ name, shape, typeIdx, relativeOffset });
  }

  // Calculate the starting position of the raw tensor data in the GGUF file
  // It is aligned to the metadata alignment boundary
  const currentOffset = reader.getOffset();
  const tensorDataOffset = Math.ceil(currentOffset / alignment) * alignment;

  // Build the final tensors manifest
  const tensors: Record<string, TensorInfo> = {};
  for (let i = 0; i < rawTensors.length; i++) {
    const t = rawTensors[i];
    const typeName = GGML_TYPE_NAMES[t.typeIdx] || "UNKNOWN";

    // Total elements in tensor
    const nElems = t.shape.reduce((a, b) => a * b, 1);

    // Compute byte length using relative offset of next tensor if available, 
    // or block size math as fallback
    let bytes = 0;
    if (i < rawTensors.length - 1) {
      bytes = rawTensors[i + 1].relativeOffset - t.relativeOffset;
    } else {
      // Last tensor goes to the end of file (or we calculate it using blocks)
      const { block, size } = getGgmlBlockInfo(typeName);
      bytes = (nElems / block) * size;
    }

    tensors[t.name] = {
      offset: tensorDataOffset + t.relativeOffset,
      bytes: bytes,
      nElems: nElems,
      type: typeName,
      shape: t.shape,
    };
  }

  // Retrieve model hyperparameters
  const getMetaU32 = (k: string, def: number) => {
    const val = metadata[`${arch}.${k}`];
    return val !== undefined ? Number(val) : def;
  };

  const getMetaF32 = (k: string, def: number) => {
    const val = metadata[`${arch}.${k}`];
    return val !== undefined ? Number(val) : def;
  };

  const d = getMetaU32('embedding_length', 0);
  const nHeads = getMetaU32('attention.head_count', 0);
  const nKvHeads = getMetaU32('attention.head_count_kv', nHeads);
  const blockCount = getMetaU32('block_count', 0);
  const ropeTheta = getMetaF32('rope.freq_base', 10000.0);
  const rmsEps = getMetaF32('attention.layer_norm_rms_epsilon', 1e-5);
  // Gemma2 stores an explicit head dim (key_length) that differs from d/nHeads; honour it.
  const headDim = getMetaU32('attention.key_length', 0) || (nHeads > 0 ? d / nHeads : 0);
  const ffn = getMetaU32('feed_forward_length', 0);

  const config: Manifest['config'] = { d, nHeads, nKvHeads, headDim, ffn, blockCount, ropeTheta, rmsEps };

  // RWKV-7 (moteur v2, attention linéaire) : pas d'attention softmax → head_count absent. Les têtes
  // se dérivent de wkv.head_size (64 pour le 0.1B → d/64 têtes). Les rangs LoRA (décroissance/iclr/
  // résidu-valeur/gate) et head_size sont portés pour le bloc récurrent. Voir docs/engine-v2-*.
  if (arch === 'rwkv7' || arch === 'rwkv6') {
    const headSize = getMetaU32('wkv.head_size', 64);
    config.headDim = headSize;
    config.nHeads = headSize > 0 ? Math.floor(d / headSize) : 0;
    config.nKvHeads = config.nHeads;
    config.rwkv = {
      headSize,
      decayLoraRank: getMetaU32('attention.decay_lora_rank', 64),
      iclrLoraRank: getMetaU32('attention.iclr_lora_rank', 64),
      valueLoraRank: getMetaU32('attention.value_residual_mix_lora_rank', 32),
      gateLoraRank: getMetaU32('attention.gate_lora_rank', 128),
    };
  }

  // LFM2/LFM2.5 (moteur v2, hybride conv courte + attention) : head_count_kv est un TABLEAU par
  // couche (0 = bloc shortconv, >0 = bloc attention GQA) — le Number() générique donne NaN. On porte
  // le masque de couches + l_cache (fenêtre de la conv, 3 sur LFM2.5). RoPE neox, qk-norm par tête.
  if (arch === 'lfm2') {
    const kvArr = metadata['lfm2.attention.head_count_kv'];
    const arr = Array.isArray(kvArr) ? kvArr.map(Number) : [];
    config.nKvHeads = arr.length ? Math.max(...arr) : nHeads;
    config.headDim = headDim || 64;
    config.lfm2 = {
      lCache: getMetaU32('shortconv.l_cache', 3),
      kvHeadsPerLayer: arr.length ? arr : Array(blockCount).fill(config.nKvHeads),
    };
  }

  // Gemma family: GELU gate, embeddings scaled by sqrt(d). Gemma2 adds attention + final logit
  // softcaps and a query pre-attn scale. Defaults match the published 2B/9B configs so a GGUF missing
  // a key still runs correctly. Other arches keep the Qwen2/Llama defaults (omitted).
  // NB RMSNorm: HF Gemma computes x_normed·(1+w), but llama.cpp BAKES the +1 into every *norm.weight
  // at GGUF conversion (stores w+1, then does a plain RMSNorm). So for GGUF-sourced weights we must
  // NOT re-add 1 (rmsGainOnePlus stays off) — doing so gave 2+w on every norm → incoherent output.
  if (arch === 'gemma' || arch === 'gemma2') {
    config.act = 'gelu';
    config.embedScale = Math.sqrt(d);
  }
  if (arch === 'gemma2') {
    config.attnLogitSoftcap = getMetaF32('attn_logit_softcapping', 50.0);
    config.finalLogitSoftcap = getMetaF32('final_logit_softcapping', 30.0);
    const qScalar = getMetaU32('attention.query_pre_attn_scalar', 0);
    config.attnScale = qScalar > 0 ? 1 / Math.sqrt(qScalar) : (headDim > 0 ? 1 / Math.sqrt(headDim) : undefined);
  }
  // YaRN déclaré dans le GGUF (Ministral 3 : factor 16, beta 32/1, ctx original 16k) : le transform
  // de fréquences est STATIQUE → rope_factors côté modèle ; le mscale de ggml (1 + 0.1·ln(factor),
  // appliqué à q ET k → scores ×mscale²) devient un attnScale. NB : la température d'attention par
  // position de mistral3 (attention.temperature_scale) est l'IDENTITÉ sous origCtx (16k) — hors de
  // portée des contextes navigateur (soft cap 4k), volontairement non implémentée.
  {
    const scalingType = metadata[`${arch}.rope.scaling.type`];
    const factor = getMetaF32('rope.scaling.factor', 1);
    if (scalingType === 'yarn' && factor > 1 && headDim > 0) {
      config.yarn = {
        factor,
        betaFast: getMetaF32('rope.scaling.yarn_beta_fast', 32),
        betaSlow: getMetaF32('rope.scaling.yarn_beta_slow', 1),
        origCtx: getMetaU32('rope.scaling.original_context_length', 0),
      };
      const mscale = 1 + 0.1 * Math.log(factor);
      config.attnScale = (mscale * mscale) / Math.sqrt(headDim);
    }
  }

  // Gemma 3 : GELU + embedScale comme Gemma 1/2, MAIS plus de softcaps (remplacés par le QK-Norm,
  // détecté tout seul via attn_q_norm/attn_k_norm) et surtout une ATTENTION ALTERNÉE — 5 couches
  // « locales » (fenêtre glissante `sliding_window`, RoPE θ local) pour 1 « globale » (attention
  // pleine, θ = rope.freq_base = 1e6). llama.cpp : set_swa_pattern(6) → la couche i est GLOBALE si
  // (i+1) % 6 == 0. Le θ local (10 000) n'est pas écrit dans le GGUF par convert_hf_to_gguf : il est
  // codé en dur côté llama.cpp (rope_freq_base_train_swa), on garde la clé au cas où elle apparaisse.
  // ⚠️ headDim (key_length = 256) ≠ d/nHeads (160) sur le 270M : déjà géré (qDim ≠ d).
  if (arch === 'gemma3') {
    config.act = 'gelu';
    config.embedScale = Math.sqrt(d);
    const win = getMetaU32('attention.sliding_window', 512);
    const pattern = getMetaU32('attention.sliding_window_pattern', 6) || 6;
    const localTheta = getMetaF32('rope.local_freq_base', 10000);
    const isGlobal = (i: number) => (i + 1) % pattern === 0;
    config.windowPerLayer = Array.from({ length: blockCount }, (_, i) => (isGlobal(i) ? 0 : win));
    config.ropeThetaPerLayer = Array.from({ length: blockCount }, (_, i) => (isGlobal(i) ? ropeTheta : localTheta));
  }

  // SmolLM3 : Llama standard SAUF le NoPE — une couche sur 4 (indices 3, 7, 11…) n'applique PAS de
  // RoPE (« no positional encoding », c'est ce qui lui donne son contexte long). llama.cpp lit la
  // liste depuis rope.dimension_sections… non : la clé est `<arch>.no_rope_layers`, un tableau de
  // 0/1 par couche (1 = RoPE appliqué). Absente → repli sur le motif publié (1 couche sur 4 sans).
  if (arch === 'smollm3') {
    const raw = metadata[`${arch}.no_rope_layers`];
    const arr = Array.isArray(raw) ? raw.map(Number) : [];
    config.skipRopePerLayer = arr.length === blockCount
      ? arr.map((v) => v === 0)
      : Array.from({ length: blockCount }, (_, i) => (i + 1) % 4 === 0);
  }

  // ── CONVENTION RoPE (LLAMA_ROPE_TYPE_NORM) ────────────────────────────────────────────────────
  // ggml applique le RoPE par paires de dimensions ADJACENTES (2i, 2i+1) aux archs llama, mistral et
  // smollm3, là où Hugging Face (donc Qwen, Gemma, Phi…) tourne i avec i+headDim/2 (« rotate_half »).
  // On le signale au moteur, qui a les deux variantes dans un seul kernel. Avant cela, la seule
  // parade était de RÉÉCRIRE l'ordre des lignes de Q et K au chargement (maybeUnpermuteLlamaQk) pour
  // simuler la convention HF : coûteux, impossible sur les layouts quantifiés SoA du BRIK (d'où le
  // refus des BRIK llama), et à l'origine du charabia de ces modèles (cf. docs/ROADMAP.md §6).
  // Kill-switch `?ropenorm=0` (lu côté model.ts) → on revient à l'ancien couple dé-permutation +
  // rotate_half, pour l'A/B.
  if (arch === 'llama' || arch === 'mistral3' || arch === 'smollm3') {
    config.ropeInterleaved = true;
  }

  // Qwen2-VL : le LLM est un Qwen2 standard + M-RoPE. Les sections de fréquences [t, h, w] viennent
  // du GGUF (padding 0 final filtré) ; défaut = les valeurs publiées (2B/7B : [16, 24, 24]).
  if (arch === 'qwen2vl') {
    const sec = metadata['qwen2vl.rope.dimension_sections'];
    const arr = Array.isArray(sec) ? sec.map(Number).filter((v) => v > 0) : [];
    config.mropeSections = arr.length === 3 ? arr : [16, 24, 24];
  }

  return { arch, config, tensors, metadata };
}
