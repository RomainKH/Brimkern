---
library_name: brimkern
license: creativeml-openrail-m
base_model:
  - ByteDance/AnimateDiff-Lightning
  - emilianJR/epiCRealism
pipeline_tag: text-to-video
tags:
  - brik
  - webgpu
  - on-device
  - browser
  - quantized
  - animatediff
---

# Brimkern video pipeline — BRIK (int8)

**AnimateDiff-Lightning** motion modules on an **SD 1.5** base, converted to the **BRIK** format so
text→video runs **inside the browser** on the visitor's GPU (WebGPU). No inference server, no upload:
the prompt and the frames never leave the machine.

| file | size | role |
|---|---|---|
| `video-unet-q8.brik` | 914 MB | SD 1.5 UNet (epiCRealism), int8 |
| `video-motion-q8.brik` | 483 MB | AnimateDiff-Lightning motion modules, int8 |
| `video-clip-q8.brik` | 131 MB | CLIP-L text encoder, int8 |

Full pipeline as loaded by the app: **1.53 GB** (the three files + the 4.7 MB
[TAESD](https://huggingface.co/madebyollin/taesd) decoder, fetched from its own repository).

## Try it

👉 **https://brimkern.com/chat** → *Browse / load a model* → the video card.

This is a **pipeline, not a single-file model**: several files load together, so the `?model=repo`
deeplink does not apply. Every file is streamed by HTTP Range, cached, and reusable **offline**.

⚠️ **Honest cost, announced before the click**: 1.53 GB to download, then *several minutes* of GPU
work for a few seconds of video. Clip length is adjustable from 8 to 32 frames, with the cost shown
next to the choice. A progress fraction (UNet blocks per step, then frames decoded) drives a real
progress bar and a remaining-time estimate — a diffusion wait with no feedback is indistinguishable
from a hang.

## Measured

The video path shares the SD 1.5 UNet with the image pipeline, so it inherits its measured kernel
work: the tiled int8 3×3 convolution (×1.84 on that kernel, ×1.67 end-to-end on a 256 px image).
Replayable benches in
[`scripts/e2e/`](https://github.com/RomainKH/Brimkern/tree/main/scripts/e2e).

No end-to-end seconds-per-clip figure is published here: it depends on frame count, resolution and the
GPU duty setting, and the project's rule is that a number gets published only if a replayable bench
produced it under stated conditions.

## Format

A `.brik` is a self-describing container: topology and quantization tiers travel **inside** the file,
and every shard is one contiguous HTTP range — which is what makes a 1.53 GB pipeline loadable in a
tab. Specification:
[`BRIK_FORMAT.md`](https://github.com/RomainKH/Brimkern/blob/main/BRIK_FORMAT.md).

## License

Derived weights; the sources keep their terms:

- **AnimateDiff-Lightning**
  ([ByteDance/AnimateDiff-Lightning](https://huggingface.co/ByteDance/AnimateDiff-Lightning)) —
  **creativeml-openrail-m**.
- **epiCRealism** ([emilianJR/epiCRealism](https://huggingface.co/emilianJR/epiCRealism), SD 1.5
  fine-tune) — **creativeml-openrail-m**.
- TAESD decoder ([madebyollin/taesd](https://huggingface.co/madebyollin/taesd)) — **MIT**, not
  mirrored here.

The Brimkern engine itself is MIT. Converting weights does not change their license.
