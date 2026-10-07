---
library_name: brimkern
license: other
license_name: lfm-1.0
license_link: https://huggingface.co/LiquidAI/LFM2.5-230M/blob/main/LICENSE
base_model: LiquidAI/LFM2.5-230M
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
  - lfm2
---

# LFM2.5-230M — BRIK (int4)

**LiquidAI LFM2.5-230M** converted to the **BRIK** format so it runs **inside the browser** on the
visitor's GPU (WebGPU) — no inference server, no API key, no per-token cost. Converted from the F16
weights.

It was the default of [Brimkern](https://brimkern.com)'s embeddable widget until SDK 0.8.0 and is
still the app's default on mobile: at 149 MB it is the smallest file in the catalogue that still reads
a document and refuses to answer outside it. Since 0.8.0 the widget defaults to
[Qwen3-0.6B Shop EN/FR](https://huggingface.co/romainkh14/Qwen3-0.6B-Shop-ENFR_BRIK) (290 MB,
Apache-2.0), which scores higher on the same benches; this model stays one option away.

| | |
|---|---|
| File | `lfm25-230m-q4.brik` (149 MB) |
| Quantization | int4, group of 32 — pre-quantized in the exact layout the kernels read (no dequantization at load) |
| Tokenizer | **embedded** in the file (no separate download) |
| Architecture | hybrid: short convolutions + grouped attention — 14 blocks, d=1024, vocab 65 536 |
| Engine | [Brimkern](https://brimkern.com) — hand-written WGSL kernels |

## Try it in one click

👉 **https://brimkern.com/chat?model=romainkh14/LFM2.5-230M_BRIK**

The file is streamed by HTTP Range, cached by the browser, then reusable **offline**. Nothing is sent
to a server: the prompt and the generation stay on the machine.

## Embed it in a site (SDK)

```html
<script src="https://brimkern.com/sdk.js"></script>
<script>
  Brimkern.embed({
    title: 'Assistant',
    model: 'lfm2.5-230m',
    knowledge: [{ title: 'Shipping', body: 'Free above €50.' }],
  });
</script>
```

`npm i brimkern` for the bundled version. `model: 'lfm2.5-230m'` selects this file (the SDK default
is the 290 MB Qwen3-0.6B Shop since 0.8.0). The weights download only if a visitor actually opens
the widget.

## Measured

Chrome, Apple Silicon laptop, production build — replayable benches in
[`scripts/e2e/`](https://github.com/RomainKH/Brimkern/tree/main/scripts/e2e):

| | |
|---|---|
| Decoding | **~158 tok/s** |
| Prefill | **2 289 tok/s** |
| Widget document Q&A (`sdk-rag.mjs`, EN + FR) | **12/12** — including refusing to answer outside the supplied facts |
| Dialogue over 3 full rounds (`sdk-dialogue.mjs`) | **33/33** |
| Public API surface (`sdk-api.mjs`) | **50/50** |

**149 MB is the floor for this model, and that is a measurement, not an estimate.** Our flat int4 is
not the limit: a 3-bit build (129 MB) drops to 4/6 on the same document benches, and re-encoding
unsloth's importance-matrix `Q3_K` values without loss fails the *same two* cases deterministically.
What breaks is going below 4 bits, not the way of getting there.

## Format

A `.brik` is a self-describing container: architecture, tokenizer and configuration travel **inside**
the file, weights are pre-quantized in the layout the kernels read, and every layer is one contiguous
HTTP range — partial load, resume after a drop, offline afterwards.
Specification: [`BRIK_FORMAT.md`](https://github.com/RomainKH/Brimkern/blob/main/BRIK_FORMAT.md).

## License

Weights under the **LFM Open License v1.0** (LiquidAI) — see `LICENSE` in this repository. The
Brimkern engine itself is MIT. If you need Apache-2.0 weights instead, the SDK's current default,
[Qwen3-0.6B Shop EN/FR](https://huggingface.co/romainkh14/Qwen3-0.6B-Shop-ENFR_BRIK), is Apache-2.0.
