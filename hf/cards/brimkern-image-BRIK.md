---
library_name: brimkern
license: other
license_name: see-source-models
license_link: https://stability.ai/license
base_model:
  - stabilityai/sd-turbo
  - IDKiro/sdxs-512-0.9
pipeline_tag: text-to-image
tags:
  - brik
  - webgpu
  - on-device
  - browser
  - quantized
  - stable-diffusion
---

# Brimkern image pipelines — BRIK (int8 / mixed / int4)

Text→image weights converted to the **BRIK** format so diffusion runs **inside the browser** on the
visitor's GPU (WebGPU) — no inference server, no image leaving the machine. Two pipelines, sharing one
CLIP text encoder and the [TAESD](https://huggingface.co/madebyollin/taesd) decoder.

## SD-Turbo (default on desktop)

| file | size | role |
|---|---|---|
| `sd-turbo-unet-q8.brik` | 921 MB | UNet, int8 |
| `sd-turbo-unet-mixed.brik` | 789 MB | UNet, mixed int8+int4 |
| `sd-turbo-clip-q8.brik` | 362 MB | CLIP text encoder, int8 |

Full pipeline as loaded by the app: **1.29 GB** (UNet q8 + CLIP q8 + 4.7 MB TAESD decoder).

## SDXS-512 (default on mobile)

| file | size | role |
|---|---|---|
| `sdxs-unet-light.brik` | 205 MB | UNet, int4 |
| `sdxs-unet-mixed.brik` | 281 MB | UNet, mixed |
| `sdxs-unet-q8.brik` | 349 MB | UNet, int8 |
| `sd-turbo-clip-mixed.brik` | 235 MB | CLIP text encoder, mixed |

Full pipeline as loaded by the app: **446 MB** — a one-step image generator that fits a phone's
budget.

## Try it

👉 **https://brimkern.com/chat** → *Browse / load a model* → the image card.

These are **pipelines, not single-file models**: several files are loaded together, so the
`?model=repo` deeplink (which picks one file) does not apply here. The app resolves the right set for
the device, streams every file by HTTP Range, caches them, and can then generate **offline**.

## Measured

Chrome, Apple Silicon laptop, production build, SD-Turbo q8 at 256 px, 1 step — replayable benches in
[`scripts/e2e/`](https://github.com/RomainKH/Brimkern/tree/main/scripts/e2e)
(`profile-image.mjs`, `bench-image.mjs`):

| | before | after | gain |
|---|---|---|---|
| 3×3 int8 convolution (94 shots) | 35 411 µs/shot | **19 217** | ×1.84 |
| GPU total for one generation | 6 455 ms | 3 856 ms | ×1.67 |
| **end-to-end 256 px generation** | **5.0 s** | **3.0 s** | **×1.67** |

The gain came from tiling the *quantized* convolution: the f32 path had a tiled 3×3 kernel from the
start, the int8/int4 paths did not — and int8 is what production runs, since these BRIKs are
pre-quantized. A weight dequantized once per tile instead of 256 times is where the time went.

512 px is the default on a capable machine: SD-Turbo is *trained* at 512 and below it stops composing
(at 256 the same prompt returns a cropped close-up where 512 returns the whole portrait, compared at
equal seed).

## Format

A `.brik` is a self-describing container: topology, quantization tiers and configuration travel
**inside** the file (the SDXS UNet's 3-level, no-mid, fixed-heads config included), and every shard is
one contiguous HTTP range. Specification:
[`BRIK_FORMAT.md`](https://github.com/RomainKH/Brimkern/blob/main/BRIK_FORMAT.md).

## License — read this one

These are **derived weights**, and each source keeps its own terms:

- **SD-Turbo** ([stabilityai/sd-turbo](https://huggingface.co/stabilityai/sd-turbo)) is released as a
  research artifact. Its card states: *"For commercial use, please refer to
  https://stability.ai/license."* Treat the `sd-turbo-*` files as **non-commercial / research** unless
  you hold a Stability license.
- **SDXS-512** ([IDKiro/sdxs-512-0.9](https://huggingface.co/IDKiro/sdxs-512-0.9)) is **openrail++**.
- The TAESD decoder ([madebyollin/taesd](https://huggingface.co/madebyollin/taesd)) is **MIT** and is
  fetched from its own repository, not mirrored here.

The Brimkern engine itself is MIT. Converting weights does not change their license.
