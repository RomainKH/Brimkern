---
library_name: brimkern
license: apache-2.0
base_model: fla-hub/rwkv7-0.4B-g1a
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

# RWKV-7 « G1a » 0.4B — BRIK (int4)

**RWKV-7 G1a 0.4B** (BlinkDL, Apache-2.0) converted to the **BRIK** format so it runs **inside the
browser** on the visitor's GPU (WebGPU) — no inference server. Converted from a F16 GGUF.

The **Apache-2.0 option** of the [Brimkern](https://brimkern.com) catalogue: the permissive
alternative to the 149 MB LFM2.5 default, with the trade-off measured rather than assumed.

| | |
|---|---|
| File | `rwkv7-g1a-0.4b-q4.brik` (304 MB) |
| Quantization | int4 — pre-quantized in the layout the kernels read (no dequantization at load) |
| Tokenizer | **embedded** in the file (RWKV World vocab, no separate download) |
| Architecture | recurrent, 24 blocks, d=1024, vocab 65 536 |
| Engine | [Brimkern](https://brimkern.com) — hand-written WGSL kernels |

## Try it in one click

👉 **https://brimkern.com/chat?model=romainkh14/RWKV-7-G1a-0.4B_BRIK**

The file is streamed by HTTP Range, cached by the browser, then reusable **offline**. Nothing is sent
to a server: the prompt and the generation stay on the machine.

## Why RWKV here

RWKV-7 is **recurrent**: a fixed-size state (~1 MB) replaces the KV cache, so memory does not grow
with the conversation. And it is **Apache-2.0** — the most permissive weights in the catalogue, with
no restriction on commercial use.

## Embed it in a site (SDK)

```html
<script src="https://brimkern.com/sdk.js"></script>
<script>
  Brimkern.embed({
    model: 'https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik',
    title: 'Assistant',
  });
</script>
```

Requires `brimkern@0.3.0` or later (the release that added RWKV-7 dispatch to the SDK). Computation
runs on the visitor's GPU: no per-token cost, no rate limit, and the weights download only if someone
actually opens the widget.

## Measured

Chrome, Apple Silicon laptop, production build — replayable benches in
[`scripts/e2e/`](https://github.com/RomainKH/Brimkern/tree/main/scripts/e2e):

| | |
|---|---|
| Decoding | **33-36 tok/s** |
| Cold load, fresh profile | ready in 286 s (304 MB streamed), then instant from cache |
| Widget document Q&A (`sdk-rag.mjs`, EN + FR) | **10/12** |

The two failures are the **same** case in both languages: reading one row of a table (26.0/26.5 cm
instead of 27.0). Refusals, greetings and two-number disambiguation all hold. Against the
[LFM2.5-230M](https://huggingface.co/romainkh14/LFM2.5-230M_BRIK) default (12/12, 149 MB, LFM 1.0
license), the Apache option therefore costs **2× the download and loses table reading** — which is
the whole point of publishing both.

## Format

A `.brik` is a self-describing container: architecture, tokenizer and configuration travel **inside**
the file, weights are pre-quantized in the layout the kernels read, and every layer is one contiguous
HTTP range — partial load, resume after a drop, offline afterwards. Specification:
[`BRIK_FORMAT.md`](https://github.com/RomainKH/Brimkern/blob/main/BRIK_FORMAT.md).

## License

Weights under **Apache-2.0** (RWKV-7 G1a, BlinkDL). The Brimkern engine itself is MIT.
