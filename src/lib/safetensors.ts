// Minimal safetensors reader (the diffusers/HF weight format — used by image models, unlike the LLMs
// which ship as GGUF). Layout: [u64 LE header length][JSON header][raw tensor bytes]. The JSON maps
// each tensor name → { dtype, shape, data_offsets:[start,end] } where offsets are relative to the end
// of the header.
//
// Two modes:
// - default: decode everything to Float32Array (fine for small F32 files like TAESD).
// - `keepF16: true`: F16 tensors are returned as RAW BYTES ({f16, n}) — the f16→f32 conversion then
//   happens on the GPU (engine.uploadGpu / quantizeQ8Gpu accept both forms). The old JS loop over
//   860M elements (SD-Turbo UNet) froze the main thread ~10 s at every load; the GPU does it in ms.

import { f16BitsToF32 } from './brik/f16';

export interface F16Bytes { f16: Uint8Array; n: number }
export type TensorData = Float32Array | F16Bytes;
export interface SafeTensor { name: string; shape: number[]; data: TensorData; }

// Force a tensor to a CPU Float32Array (for the few consumers that genuinely need CPU access,
// e.g. CLIP's embedding gather). JS-converts f16 if needed — keep this to SMALL tensors.
export function toF32(t: TensorData): Float32Array {
  if (t instanceof Float32Array) return t;
  const u16 = new Uint16Array(t.f16.buffer, t.f16.byteOffset, t.n);
  const out = new Float32Array(t.n);
  for (let i = 0; i < t.n; i++) out[i] = f16BitsToF32(u16[i]);
  return out;
}

export function parseSafetensors(buf: ArrayBuffer, opts: { keepF16?: boolean } = {}): Map<string, SafeTensor> {
  const dv = new DataView(buf);
  const headerLen = Number(dv.getBigUint64(0, true));
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 8, headerLen)));
  const dataStart = 8 + headerLen;
  const out = new Map<string, SafeTensor>();
  for (const [name, info] of Object.entries(header as Record<string, any>)) {
    if (name === '__metadata__') continue;
    const { dtype, shape, data_offsets } = info;
    const [s, e] = data_offsets as [number, number];
    let data: TensorData;
    if (dtype === 'F32') {
      data = new Float32Array(buf.slice(dataStart + s, dataStart + e));
    } else if (dtype === 'F16') {
      const n = (e - s) / 2;
      if (opts.keepF16) {
        data = { f16: new Uint8Array(buf, dataStart + s, e - s), n }; // view, zero copy
      } else {
        const u16 = new Uint16Array(buf.slice(dataStart + s, dataStart + e));
        const f32 = new Float32Array(n);
        for (let i = 0; i < n; i++) f32[i] = f16BitsToF32(u16[i]);
        data = f32;
      }
    } else if (dtype === 'I64' || dtype === 'I32' || dtype === 'BOOL') {
      // Tenseurs entiers (ex. text_model.embeddings.position_ids des vieux exports diffusers) :
      // pas des poids — les positions sont régénérées par le runtime. Ignorés, avec trace.
      console.warn(`safetensors: tenseur ${dtype} ignoré (pas un poids) : "${name}"`);
      continue;
    } else {
      throw new Error(`safetensors: dtype non supporté "${dtype}" (tenseur "${name}")`);
    }
    out.set(name, { name, shape, data });
  }
  return out;
}
