---
library_name: brimkern
license: other
license_name: ltxv-open-weights-license-0.x
license_link: LICENSE
base_model:
  - Lightricks/LTX-Video
  - google/t5-v1_1-xxl
pipeline_tag: text-to-video
tags:
  - brik
  - webgpu
  - on-device
  - browser
  - quantized
  - ltx-video
---

# LTX-Video 2B (0.9.8 distilled) — BRIK, int4

**LTX-Video 2B** by Lightricks, converted to the **BRIK** format so text→video runs **inside the
browser** on the visitor's GPU (WebGPU). No inference server, no upload: the prompt and the frames
never leave the machine.

| file | bytes | role | weights |
|---|---|---|---|
| `ltx-t5-light.brik` | 3 034 331 120 | T5 v1.1 XXL text encoder | int4 (2.89 GB) + int8 (0.14 GB) |
| `ltx-transformer-light.brik` | 1 250 891 776 | LTX-Video 0.9.8 distilled transformer (2B) | int4 (1.17 GB), int8 and f16 for the sensitive layers |
| `ltx-vae-decoder-q8-v2.brik` | 561 524 176 | LTX-Video 0.9.8 VAE decoder, timestep conditioning precomputed for t = 0.05 | int8 |

Full pipeline: **4.85 GB**, streamed by HTTP Range, cached, and reusable **offline**. The VAE
*encoder* (image→video only) and the latent upscaler are not included.

## Try it

👉 **https://brimkern.com/chat** → *Browse / load a model* → the **LTX-Video 2B** card (desktop).

This is a **pipeline, not a single-file model**: three files load together, so the `?model=repo`
deeplink does not apply.

## Measured

On an Apple M4 Mac, Chrome, production build, weights already in the browser cache:

- **384 × 256 × 49 frames (2 s at 25 fps): 22 s** from the typed prompt to the clip, everything
  included — the product default.
- 512 × 320 × 49 frames: 39.7 s (transformer 30 s at 4.2 s per step, decoder 9.6 s).
- GPU memory: T5 3.0 GB + transformer 1.25 GB + decoder 0.56 GB resident, about 5 GB before
  activations (sum of the weights, not a measured peak).

Each component was checked against a PyTorch reference computed on the weights **as this codec serves
them** (dequantized by the repository's own codec): decoder 1.4·10⁻³ max error, transformer output
within 0.6 % of the int4 reference, T5 cosine 0.992 mean / 0.985 min against an f32 forward.
Details and pitfalls:
[`docs/ltx-video-feasibility.md`](https://github.com/RomainKH/Brimkern/blob/main/docs/ltx-video-feasibility.md).

## Format

A `.brik` is a self-describing container: topology and quantization tiers travel **inside** the file,
and every shard is one contiguous HTTP range. Specification:
[`BRIK_FORMAT.md`](https://github.com/RomainKH/Brimkern/blob/main/BRIK_FORMAT.md).

## License — LTXV Open Weights License 0.X

These files are **Derivatives of the Model** under the
[LTXV Open Weights License](LICENSE) (copy included in this repository), by Lightricks Ltd.

**Modifications made** (license §3): weights re-quantized to int4 / int8 (f16 kept for a few
layers) and repacked into the BRIK container; the VAE decoder's timestep conditioning precomputed
for t = 0.05; the VAE encoder and the latent upscaler removed. No retraining, no fine-tuning.

**Use-based restrictions** (license §4 and Attachment A) apply to **anyone** who uses these files or
their outputs, including through the Brimkern site and SDK. Among them: no use that breaks the law,
harms minors, impersonates people without consent (deepfakes), generates disinformation meant to
harm, harasses, or discriminates. Read the full list in [`LICENSE`](LICENSE), Attachment A.

**Commercial use by large companies**: entities with **annual revenues of USD 10 million or more**
must obtain a paid commercial license from Lightricks (`ltxv-licensing@lightricks.com`) — this
includes companies embedding the Brimkern SDK with this pipeline.

The text encoder is Google's [T5 v1.1 XXL](https://huggingface.co/google/t5-v1_1-xxl) (Apache 2.0),
taken from the `text_encoder/` folder that the official LTX-Video configs point to
(`PixArt-alpha/PixArt-XL-2-1024-MS`). The Brimkern engine itself is MIT. Converting weights does not
change their license.
