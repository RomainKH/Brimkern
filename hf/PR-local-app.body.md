Brimkern runs LLMs entirely in the browser tab, on the visitor's GPU: hand-written WGSL kernels, no
wasm runtime, no inference server, no API key. It reads **single-file GGUF repos from the Hub
directly** (streamed by HTTP Range, cached, then usable offline), plus its own `.brik` container.

Because it is a *web* app, the deeplink installs nothing: it opens the model in a tab, which makes it
the lightest possible "Use this model" target.

- Live demo (static Space, no HF GPU): https://huggingface.co/spaces/romainkh14/brimkern-webgpu
- Models: https://huggingface.co/models?other=brimkern
- Docs: https://brimkern.com/docs/models · Code (MIT): https://github.com/RomainKH/Brimkern
- Example deeplink: https://brimkern.com/chat?model=bartowski/Qwen2.5-0.5B-Instruct-GGUF

`displayOnModelPage` reuses `isLlamaCppGgufModel` (plus repos tagged `library_name: brimkern`); the
deeplink passes `model` and, when the Hub provides it, `file`.

Known limitation, stated up front: `ModelData` does not expose the file list, so the predicate cannot
exclude sharded GGUFs, which the engine does not read. Those land on an explicit error message in the
app rather than a blank screen.

Checked locally in `packages/tasks`: `tsc`, `vitest`, `oxfmt --check`, `eslint`.

Modelled on #719 (Jellybox, local app). A separate PR will add Brimkern as a model library.
