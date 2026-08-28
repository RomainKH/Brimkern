---
library_name: brimkern
license: apache-2.0
base_model: Qwen/Qwen3-4B
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
  - qwen3
---

# Qwen3-4B — BRIK (int4)

**Qwen3-4B** (Alibaba, Apache-2.0) converted to the **BRIK** format so it runs **inside the browser**
on the visitor's GPU (WebGPU) — no inference server, no API key.

The **heavy desktop option** of the [Brimkern](https://brimkern.com) catalogue: the largest model the
engine streams today, for machines with the VRAM to hold it.

| | |
|---|---|
| File | `qwen3-4b-q4.brik` (2.53 GB) |
| Quantization | int4, group of 32 — pre-quantized in the layout the kernels read (no dequantization at load) |
| Tokenizer | **embedded** in the file (no separate download) |
| Architecture | llama-family with QK-norm — 36 layers, d=2560, vocab 151 936 |
| Engine | [Brimkern](https://brimkern.com) — hand-written WGSL kernels |

## Try it in one click

👉 **https://brimkern.com/chat?model=romainkh14/Qwen3-4B_BRIK**

⚠️ **2.53 GB streamed on first use**, and roughly the same again in VRAM. The page announces the cost
before the download starts, the transfer resumes after a drop, and the file is reusable **offline**
afterwards. On a laptop GPU expect a first load in minutes, not seconds.

## Measured

No per-model throughput figure is published here yet: our decode benches cover the small models people
load by default (see
[LFM2.5-230M](https://huggingface.co/romainkh14/LFM2.5-230M_BRIK) and
[Qwen2.5-0.5B](https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK)). What *is* measured on
this class of model is that decoding is memory-bandwidth-bound, so throughput follows the GPU's
bandwidth almost linearly — the engine sits at 79-92 % of the machine's measured ceiling.

The rule in this project is that a number gets published only if a replayable bench produced it. This
one has not been run on 4B yet.

## Format

A `.brik` is a self-describing container: architecture, tokenizer and configuration travel **inside**
the file, weights are pre-quantized in the layout the kernels read, and every layer is one contiguous
HTTP range — which is what makes a 2.53 GB model loadable in a tab at all. Specification:
[`BRIK_FORMAT.md`](https://github.com/RomainKH/Brimkern/blob/main/BRIK_FORMAT.md).

## License

Weights under **Apache-2.0** (Qwen3-4B, Alibaba). The Brimkern engine itself is MIT.
