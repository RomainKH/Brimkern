// In-browser CLIP reference check: runs the REAL CLIP text encoder (CLIP-B/32) via transformers.js
// (ONNX) and compares it to OUR ClipTextEncoder running the same model's safetensors weights. The only
// way, without Python, to verify our CLIP against a true PyTorch reference. It exercises the SHARED
// kernels (matmul, attention, layernorm) — already trusted via the working LLM — plus the CLIP wiring.
//
// MATCH → our CLIP engine is convention-correct, so the SD-Turbo garbage is downstream (UNet/scheduler).
// MISMATCH → a CLIP-side convention bug we can then pinpoint. Exposed as window.__clipRef() (dev).

import { WebGpuEngine } from '../kernels';
import { parseSafetensors } from '../../safetensors';
import { ClipTextEncoder, type ClipConfig } from './clip';
import { loadClipWeights } from './sdturbo';

const stats = (a: ArrayLike<number>) => {
  let mn = Infinity, mx = -Infinity, s = 0;
  for (let i = 0; i < a.length; i++) { const v = a[i]; if (v < mn) mn = v; if (v > mx) mx = v; s += v; }
  return `min=${mn.toFixed(3)} max=${mx.toFixed(3)} mean=${(s / a.length).toFixed(3)}`;
};

export async function validateClipVsRef(log: (...a: unknown[]) => void = console.log): Promise<void> {
  const MODEL = 'Xenova/clip-vit-base-patch32';
  // CLIP-B/32: dim 512, 12 layers, 8 heads (head_dim 64), MLP 2048, quick_gelu, final LN applied.
  const cfg: ClipConfig = { dim: 512, layers: 12, heads: 8, vocab: 49408, maxPos: 77, hidden: 2048, eps: 1e-5, finalLN: true, act: 'quick_gelu' };
  try {
    log('[clipRef] chargement tokenizer + modèle de référence (ONNX)…');
    const tjs = await import('@huggingface/transformers');
    const tok = await tjs.AutoTokenizer.from_pretrained(MODEL);
    const refModel = await tjs.CLIPTextModel.from_pretrained(MODEL);
    const prompt = 'a photo of a cat';
    const enc = await tok([prompt], { padding: 'max_length', max_length: 77, truncation: true });
    const ids = Array.from(enc.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
    const refOut = await refModel({ input_ids: enc.input_ids, attention_mask: enc.attention_mask });
    log('[clipRef] sortie réf — clés:', Object.keys(refOut));
    // transformers.js may name it last_hidden_state / logits / token_embeddings depending on the load.
    const refTensor = refOut.last_hidden_state ?? refOut.logits ?? refOut.token_embeddings ?? refOut.text_embeds;
    if (!refTensor?.data) { log('[clipRef] aucune sortie séquence exploitable — clés:', Object.keys(refOut)); return; }
    const ref = refTensor.data as Float32Array; // expect [1, 77, 512]
    log('[clipRef] référence', refTensor.dims ?? '(no dims)', stats(ref));

    log('[clipRef] poids CLIP-B/32 pour notre moteur (~600 Mo, mis en cache)…');
    const buf = await fetch(`https://huggingface.co/openai/${MODEL.split('/')[1]}/resolve/main/model.safetensors`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} sur les poids CLIP-B/32`);
      return r.arrayBuffer();
    });
    const w = loadClipWeights(parseSafetensors(buf), cfg);
    const engine = new WebGpuEngine();
    if (!(await engine.init())) throw new Error('WebGPU indisponible');
    const ours = await new ClipTextEncoder(engine, w, cfg).encode(ids);
    log('[clipRef] nous', stats(ours));

    let maxAbs = 0, sumAbs = 0;
    const n = Math.min(ours.length, ref.length);
    for (let i = 0; i < n; i++) { const d = Math.abs(ours[i] - ref[i]); if (d > maxAbs) maxAbs = d; sumAbs += d; }
    const verdict = maxAbs < 0.1 ? 'MATCH ✓ — moteur CLIP correct (bug en aval : UNet/scheduler)' : 'MISMATCH ✗ — bug côté CLIP';
    log(`[clipRef] diff maxabs=${maxAbs.toFixed(4)} meanabs=${(sumAbs / n).toFixed(5)} → ${verdict}`);
  } catch (e) {
    log('[clipRef] échec', e);
  }
}
