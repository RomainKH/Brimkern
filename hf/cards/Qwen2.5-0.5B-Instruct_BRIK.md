---
library_name: brimkern
license: apache-2.0
base_model: Qwen/Qwen2.5-0.5B-Instruct
pipeline_tag: text-generation
language:
  - en
  - fr
tags:
  - brik
  - webgpu
  - on-device
  - browser
  - quantized
  - qwen2
---

# Qwen2.5-0.5B-Instruct — BRIK (int4 / mixed int8+int4)

**Qwen2.5-0.5B-Instruct** (Alibaba, Apache-2.0) converted to the **BRIK** format so it runs **inside
the browser** on the visitor's GPU (WebGPU) — no inference server. Converted from the F16 weights.

| file | size | tier |
|---|---|---|
| `qwen2.5-0.5b-instruct-mixed.brik` | **396 MB** | body int4 + **attention kept int8** — the recommended one |
| `qwen2.5-0.5b-instruct-q4.brik` | 377 MB | flat int4 |

The mixed tier exists because of a measurement, not a preference: **flat int4 lobotomizes this 0.5B**
(a per-tensor A/B showed int4 gibberish unless *everything* is int4, and an int8 anchor on attention
repairs it) — 19 MB more for coherent answers. Tied embeddings are deduplicated in both files.

| | |
|---|---|
| Tokenizer | **embedded** in the file (no separate download) |
| Architecture | llama-family, 24 layers, d=896, vocab 151 936 |
| Engine | [Brimkern](https://brimkern.com) — hand-written WGSL kernels |

## Try it in one click

👉 **https://brimkern.com/chat?model=romainkh14/Qwen2.5-0.5B-Instruct_BRIK**

Add `&file=qwen2.5-0.5b-instruct-q4.brik` to force the flat int4 tier. The file is streamed by HTTP
Range, cached by the browser, then reusable **offline**. Nothing is sent to a server.

## Measured

Chrome, Apple Silicon laptop, production build, flat int4 tier — replayable benches in
[`scripts/e2e/`](https://github.com/RomainKH/Brimkern/tree/main/scripts/e2e):

| | |
|---|---|
| Prefill | **515-550 tok/s** |
| Decoding | **38-42 tok/s** |

## Format

A `.brik` is a self-describing container: architecture, tokenizer and configuration travel **inside**
the file, weights are pre-quantized in the layout the kernels read, and every layer is one contiguous
HTTP range — partial load, resume after a drop, offline afterwards. Specification:
[`BRIK_FORMAT.md`](https://github.com/RomainKH/Brimkern/blob/main/BRIK_FORMAT.md).

## License

Weights under **Apache-2.0** (Qwen2.5-0.5B-Instruct, Alibaba). The Brimkern engine itself is MIT.
