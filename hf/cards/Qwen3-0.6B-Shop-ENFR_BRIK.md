---
license: apache-2.0
base_model: Qwen/Qwen3-0.6B
language:
- en
- fr
library_name: brimkern
pipeline_tag: text-generation
tags:
- brik
- webgpu
- in-browser
- on-device
- customer-support
- rag
---

# Qwen3-0.6B Shop EN/FR — BRIK

The default model of the [Brimkern](https://brimkern.com) SDK widget (since 0.8.0): a website
assistant that runs in the visitor's browser tab (WebGPU) and answers from the site owner's notes.

`qwen3-0.6b-shop-enfr-q4.brik` — 290 MB, Brimkern's `.brik` format (all weights 4-bit, embedding
included), streamed by HTTP range requests, then cached and usable offline.

## What was done to the base model

1. **Vocabulary pruned to English + French**: 151,643 → 42,880 tokens (most frequent tokens of a
   5.7M-token EN/FR corpus, closed under BPE merges, plus all 256 bytes so any text stays encodable).
   +0.91 % tokens on unseen text, exact text → tokens → text round-trip. Quality unchanged on our
   bench (103/120 against 105/120 for the full vocabulary, within run-to-run variance).
2. **LoRA fine-tune** (r16, mlx-lm) on synthetic support dialogues for ~450 fictional businesses, in
   the exact prompt format of the SDK: copy the figure from the notes verbatim, refuse when the notes
   don't say, never invent a business name or guess a yes/no. Every training turn was checked by a
   second model that rejects any paraphrased fact.

## Measured (Brimkern benches, alternating arms, 2 runs each)

`sdk-multi`: 5 businesses never seen in training (3 EN, 2 FR), 30 questions per run, automatic
scoring (expected figures present, none invented; refusals without an invented figure).

| model | size | sdk-multi |
|---|---|---|
| LFM2.5-230M (widget default before 0.8.0) | 149 MB | ~77 % |
| Qwen3-0.6B, original, `.brik` mixed | 506 MB | 88/120 (73 %) |
| **this model, `.brik` q4** | **290 MB** | **110/120 (92 %)** |

Before/after the first fine-tune on the same pruned base (`.brik` mixed): judged small talk
29/56 → 47/56, `sdk-rag` 17/24 → 20/24. Refusals on out-of-notes questions (`sdk-multi`): 8/24 →
23/24 for this final version. End-to-end check with SDK 0.8.0 loading this file from the Hub:
55/60, identical to the local file.

## What did not work (published on purpose)

- **A first LoRA on loosely written dialogues made facts worse**: 5/8 → 1/8 on our fact checks
  ("14 days" for 30). The training answers paraphrased figures fluently; the 0.6B learnt the
  fluency, not the precision. The validation loss did not see it. Hence the verbatim-copy rule and
  the second-model check above.
- **3-bit does not hold**: a 238 MB build (3-bit body) collapses to 2/60 on `sdk-multi`. 290 MB is the
  floor of this format for this model.

## Use

```html
<script src="https://brimkern.com/sdk.js"></script>
```

It is the SDK's default model (`npm i brimkern`, 0.8.0 or later); nothing to configure. Built for
answering from short notes, not for general knowledge or code.

The engine is MIT: [github.com/RomainKH/Brimkern](https://github.com/RomainKH/Brimkern). The
weights keep Qwen3's Apache-2.0 license.
