# BRIK — Brimkern Web Package (v1)

BRIK is a **web-optimized repack of a GGUF model**, not a replacement. The GGUF path stays the
default ("load any model"); BRIK is the opt-in fast path for models we pre-host and want to run
as fast as possible in the browser.

## Why (vs. loading GGUF directly)

GGUF is laid out for CPU SIMD (llama.cpp). For a WebGPU engine that costs us:

1. **k-quant unpacking in WGSL is expensive** — e.g. Q4_K's 144-byte super-blocks with
   interleaved 6-bit scales need heavy bit-twiddling per block in the shader.
2. **Monolithic download** — the whole file must arrive before the first token.
3. **Binary KV metadata** — awkward to read; no room for a web runtime profile.

BRIK fixes exactly these, and nothing else:

- **WGSL-friendly tensors** stored in a native GPU dtype (**f16** in v1), **16-byte aligned**
  so every tensor can be read as `vec4` (128-bit loads — see `matmul_t_vec4`). No on-device
  dequant step for f16 tensors.
- **Sharded per layer** → stream + cache (HTTP range / Cache API), start inference while later
  layers download.
- **JSON manifest** carrying a full runtime profile: arch hyperparams, chat template, stop
  tokens, tokenizer reference, and the tensor index. Kills the manual tokenizer/arch dropdowns.

Trade-off, stated plainly: an f16 BRIK **downloads larger than a 4-bit GGUF** (16-bit vs 4-bit),
but is ~2× smaller than the f32 the engine used to expand weights to in VRAM, and skips the
dequant pass.

**v2 (implemented) — compact web quants `q8web` / `q4web`.** The big layer matrices can now be
stored quantized on disk in a WGSL-native layout the fused GPU matmuls consume directly (no f32
expansion, no load-time requant) — small downloads *and* fast inference:

- **`q8web` (int8, the "heavy but fast" tier)** — symmetric per-32-group: one f16 scale + 32 signed
  int8 codes. ≈8.5 bits/weight (~½ of f16), near-f16 quality. Fused kernel `matmul_t_q8`.
- **`q4web` (int4)** — asymmetric per-32-group: f16 scale + f16 min + 32 packed 4-bit codes.
  ≈5 bits/weight (~Q4 GGUF size), biggest models fit. Fused kernel `matmul_t_q4`.

Both keep the weights quantized in VRAM and dequantize branchlessly in registers inside the matmul
(structure-of-arrays: scales/codes streamed separately). Embeddings + logit head stay f16; norms +
biases stay f32. Pick the tier at convert time (`weightDType` in `ConvertProfile`).

## Layout

A model can be served two equivalent ways — the logical package, or a single self-contained file.

**Logical package** — a directory of static files:

```
model-name/
  manifest.json          # everything the loader needs (see BrikManifest)
  shard-0000.brik         # tensor bytes, each tensor 16-byte aligned
  shard-0001.brik         # typically one shard per transformer layer (+ embeddings/head)
  ...
```

**Single-file container (`.brik`)** — the canonical packaging for download / hosting (see
`src/lib/brik/container.ts`). One binary bundles the manifest and all shards, so there's a single
file to host, cache, and re-import — and because the manifest sits at a fixed header position it's
HTTP-range / Cache-API friendly (fetch the header, then range-request individual layers, with no
ZIP central directory to parse). Replaces the older `.brik.zip` (still importable for back-compat):

```
[0..4)        magic "BRIK1"
[4..8)        version (u32 LE)
[8..12)       manifest byte length L (u32 LE)
[12..12+L)    manifest JSON (UTF-8)
[pad to 16]   tensor data section, 16-byte aligned
[dataStart..] shard bytes concatenated in ascending shard-id order
```

A tensor's absolute file offset is `dataStart + shardBase + tensorOffset` — the manifest's shard
byteLengths and per-tensor `{shard, offset}` describe the layout within the data section unchanged.

### manifest.json (see `src/lib/brik/format.ts` for the exact types)

```jsonc
{
  "format": "brik", "version": 1,
  "model": { "name": "Qwen2.5-0.5B-Instruct", "quantSource": "Q8_0" },
  "arch": { "arch": "qwen2", "d": 896, "nHeads": 14, "nKvHeads": 2, "headDim": 64,
            "ffn": 4864, "blockCount": 24, "ropeTheta": 1000000, "rmsEps": 1e-6, "vocab": 151936 },
  "chat": { "template": "<|im_start|>...", "stopTokenIds": [151645, 151643] },
  "tokenizer": { "kind": "hf-hub", "id": "Xenova/qwen-tokenizer" },
  "shards": [ { "id": 0, "file": "shard-0000.brik", "byteLength": 12345 }, ... ],
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
- `dtype: "q8"` — q8web int8. One contiguous blob per tensor: `[codes (n × int8) | scales
  (groups × f16 LE)]`, `groups = n / 32`. Sub-offsets derive from `nElems`, so the manifest still
  stores one `(offset, byteLength)` per tensor; the loader splits it (`unpackQ8`).
- `dtype: "q4"` — q4web int4. Contiguous `[nibbles (n/2 bytes) | scales (groups × f16) | mins
  (groups × f16)]`, two 4-bit codes per nibble byte (low nibble = even index). Split by `unpackQ4`.
- Every tensor begins on a 16-byte boundary within its shard (`BRIK_ALIGN`).

## Pipeline

1. **Convert** (build-time / one-shot in-browser): GGUF → dequantize each tensor (existing
   engine path) → re-encode as f16 + align → write shards + manifest. See `src/lib/brik/`.
2. **Load** (runtime): two modes, same `CustomWebModel` (it reads bytes through a `TensorSource`):
   - *Local* — a downloaded `.brik` / `.brik.zip` is parsed in memory and sliced per tensor.
   - *Streaming* — `loadBrikStream(url)` (see `src/lib/webgpu/source.ts`) fetches just the header
     (manifest) first, so the profile/UI appear instantly, then **range-fetches each tensor on
     demand** during the forward pass, caching every range in the **Cache API** (instant + offline
     re-loads). Falls back to one full download if the host ignores `Range`. f16 tensors upload
     straight to GPU buffers (no dequant); q8/q4 upload packed (dequant fused in the matmul).
3. The default "web-focus" models ship pre-converted and are served statically (streamable by URL).
