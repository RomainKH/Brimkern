# BWP — Brimkern Web Package (v1)

BWP is a **web-optimized repack of a GGUF model**, not a replacement. The GGUF path stays the
default ("load any model"); BWP is the opt-in fast path for models we pre-host and want to run
as fast as possible in the browser.

## Why (vs. loading GGUF directly)

GGUF is laid out for CPU SIMD (llama.cpp). For a WebGPU engine that costs us:

1. **k-quant unpacking in WGSL is expensive** — e.g. Q4_K's 144-byte super-blocks with
   interleaved 6-bit scales need heavy bit-twiddling per block in the shader.
2. **Monolithic download** — the whole file must arrive before the first token.
3. **Binary KV metadata** — awkward to read; no room for a web runtime profile.

BWP fixes exactly these, and nothing else:

- **WGSL-friendly tensors** stored in a native GPU dtype (**f16** in v1), **16-byte aligned**
  so every tensor can be read as `vec4` (128-bit loads — see `matmul_t_vec4`). No on-device
  dequant step for f16 tensors.
- **Sharded per layer** → stream + cache (HTTP range / Cache API), start inference while later
  layers download.
- **JSON manifest** carrying a full runtime profile: arch hyperparams, chat template, stop
  tokens, tokenizer reference, and the tensor index. Kills the manual tokenizer/arch dropdowns.

Trade-off, stated plainly: an f16 BWP **downloads larger than a 4-bit GGUF** (16-bit vs 4-bit),
but is ~2× smaller than the f32 the engine currently expands weights to in VRAM, and skips the
dequant pass. v2 will add a compact web quant (`q4web`: 16-byte-aligned group int4 + f16 scales,
branchless dequant) to get small downloads *and* fast inference.

## Layout

A model is a directory served as static files:

```
model-name/
  manifest.json          # everything the loader needs (see BwpManifest)
  shard-0000.bwp         # tensor bytes, each tensor 16-byte aligned
  shard-0001.bwp         # typically one shard per transformer layer (+ embeddings/head)
  ...
```

### manifest.json (see `src/lib/bwp/format.ts` for the exact types)

```jsonc
{
  "format": "bwp", "version": 1,
  "model": { "name": "Qwen2.5-0.5B-Instruct", "quantSource": "Q8_0" },
  "arch": { "arch": "qwen2", "d": 896, "nHeads": 14, "nKvHeads": 2, "headDim": 64,
            "ffn": 4864, "blockCount": 24, "ropeTheta": 1000000, "rmsEps": 1e-6, "vocab": 151936 },
  "chat": { "template": "<|im_start|>...", "stopTokenIds": [151645, 151643] },
  "tokenizer": { "kind": "hf-hub", "id": "Xenova/qwen-tokenizer" },
  "shards": [ { "id": 0, "file": "shard-0000.bwp", "byteLength": 12345 }, ... ],
  "tensors": {
    "blk.0.attn_q.weight": { "dtype": "f16", "shape": [896, 896], "nElems": 802816,
                             "shard": 1, "offset": 0, "byteLength": 1605632 }
  }
}
```

### Tensor encoding

- `dtype: "f16"` — IEEE binary16, little-endian, row-major, same `[out, in]` order as GGUF
  (consumed directly by `matmul_t`). Subnormals below 2⁻¹⁴ are flushed to zero (negligible for
  weights; matches the engine's existing f16 helper).
- `dtype: "f32"` — raw little-endian f32 (used for norms/biases, which are tiny).
- Every tensor begins on a 16-byte boundary within its shard (`BWP_ALIGN`).

## Pipeline

1. **Convert** (build-time / one-shot in-browser): GGUF → dequantize each tensor (existing
   engine path) → re-encode as f16 + align → write shards + manifest. See `src/lib/bwp/`.
2. **Load** (runtime): fetch manifest → for each layer, fetch its shard (streamed/cached) →
   upload f16 tensors straight to GPU buffers. No dequant kernel for f16.
3. The 3 default "web-focus" models ship pre-converted and are served statically.
