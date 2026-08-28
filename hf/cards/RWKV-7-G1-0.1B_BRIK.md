---
library_name: brimkern
license: apache-2.0
base_model: fla-hub/rwkv7-0.1B-g1
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
  - rwkv
---

# RWKV-7 « G1 » 0.1B — BRIK (int4)

**RWKV-7 G1 0.1B** (BlinkDL, Apache-2.0) converted to the **BRIK** format so it runs **inside the
browser** on the visitor's GPU (WebGPU) — no inference server. Converted from a F16 GGUF.

The lightest file in the [Brimkern](https://brimkern.com) catalogue, and the fastest to decode.

| | |
|---|---|
| File | `rwkv7-g1-0.1b-q4.brik` (128 MB) |
| Quantization | int4 — pre-quantized in the layout the kernels read (no dequantization at load) |
| Tokenizer | **embedded** in the file (RWKV World vocab, no separate download) |
| Architecture | recurrent, 12 blocks, d=768, vocab 65 536 |
| Engine | [Brimkern](https://brimkern.com) — hand-written WGSL kernels |

## Try it in one click

👉 **https://brimkern.com/chat?model=romainkh14/RWKV-7-G1-0.1B_BRIK**

## Why RWKV here

RWKV-7 is **recurrent**: a fixed-size state (~1 MB) replaces the KV cache, so memory does not grow
with the conversation — the opposite of a transformer, whose cache swells with every token. On a light
device that is the difference between a conversation that holds and one that eventually saturates.

## Measured — and what it is *not* for

Chrome, Apple Silicon laptop, production build: **62.9 tok/s** decoding (×3 over the pre-resident
path). Replayable benches in
[`scripts/e2e/`](https://github.com/RomainKH/Brimkern/tree/main/scripts/e2e).

**It does not read documents.** On our widget's document-Q&A bench (`sdk-rag.mjs`, 2 rounds × EN/FR)
it scores **6/24**: it serves the canonical refusal while the *correct* fact sheet is selected and in
front of it, and when it does read, it copies the whole sheet out — forbidden figures included. What
holds are greetings and out-of-scope refusals: its known strengths (conversational, constrained
classification), not document reading.

Published as-is because a negative measurement is worth more than a claim: if you want a sub-150 MB
Apache-2.0 model for grounded question answering, **this size is not enough**, whatever the file
format. Use it for chat and classification; for document Q&A see
[G1a 0.4B](https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK) (10/12) or
[LFM2.5-230M](https://huggingface.co/romainkh14/LFM2.5-230M_BRIK) (12/12).

## Format

A `.brik` is a self-describing container: architecture, tokenizer and configuration travel **inside**
the file, weights are pre-quantized in the layout the kernels read, and every layer is one contiguous
HTTP range. Specification:
[`BRIK_FORMAT.md`](https://github.com/RomainKH/Brimkern/blob/main/BRIK_FORMAT.md).

## License

Weights under **Apache-2.0** (RWKV-7 G1, BlinkDL). The Brimkern engine itself is MIT.
