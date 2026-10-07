Adds [Brimkern](https://brimkern.com) to the model libraries: an in-browser WebGPU inference engine
(hand-written WGSL kernels, MIT, https://github.com/RomainKH/Brimkern) and its embeddable SDK
(`npm i brimkern`, or one `<script>` tag).

- **Snippet**: the SDK's own usage, a `<script>` + `Brimkern.createSession({ model })` pointing at the
  repo's `.brik` file. It runs as-is in a page (`type="module"` for the top-level `await`).
- **Downloads**: counted on `path_extension:"brik"`, the self-contained file the SDK streams by HTTP
  Range (architecture, tokenizer and weights in one file).
- `filter: false` for now.

Repos already tagged `library_name: brimkern`: https://huggingface.co/models?other=brimkern
Live demo (static Space, no HF GPU): https://huggingface.co/spaces/romainkh14/brimkern-webgpu
SDK docs: https://brimkern.com/docs/sdk

Checked locally in `packages/tasks`: `tsc`, `vitest`, `oxfmt --check`, `eslint`.

Modelled on #885 (VFI-Mamba, library). Follows the local-app PR #<NUMÉRO DE LA PR 1>.
