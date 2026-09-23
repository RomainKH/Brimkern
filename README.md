<div align="center">

![Brimkern: run real AI models natively on your GPU](docs/brimkern-banner.svg)

### Run open-source AI directly on your GPU — in the browser or terminal.

No server. No API key. No per-token bill. Zero remote inference.  
Weights stream once by HTTP ranges, stay on your device, and run 100% offline.

`WebGPU` · `hand-written WGSL` · `single-file GGUF` · `.brik streaming` · `CLI` · `Embeddable SDK`

**[brimkern.com](https://brimkern.com)** · [Web Chat](https://brimkern.com/chat) · [CLI Tool](https://brimkern.com/cli) · [Documentation](https://brimkern.com/docs)

</div>

---

## What is Brimkern?

Most "browser AI" solutions either wrap a remote API or require heavy pre-compilation of weights into opaque proprietary blobs.

**Brimkern runs models directly on device via WebGPU and hand-crafted WGSL compute shaders.**
It reads single-file **GGUFs** directly from the Hugging Face Hub, as well as **`.brik`** streamable containers designed for instant GPU execution.

| Surface | What it does | How to use |
| --- | --- | --- |
| 💬 **Web App** | Multi-turn chat, reasoning (`<think>`), vision & diffusion | [brimkern.com/chat](https://brimkern.com/chat) |
| ⚡ **CLI** | Hardware GPU inference directly in your terminal | `brimkern chat` or Unix pipe |
| 🧩 **SDK** | Drop on-device AI into your website in one line | `<script src="https://brimkern.com/sdk.js">` |
| 🔄 **Converter** | Convert any GGUF to streamable `.brik` in your browser | [brimkern.com/convert](https://brimkern.com/convert) |

---

## ⚡ Command Line (CLI)

Run lightweight local models directly from your terminal using WebGPU hardware acceleration:

```bash
# Install the CLI
curl -fsSL https://brimkern.com/install.sh | bash

# Interactive REPL session
brimkern chat

# Or pipe code / text directly
cat main.rs | brimkern "Review this code for memory safety"
```

Features:
- Fast startup via Google Dawn native engine (or headless Chromium fallback).
- Multi-mode support: `/mode [code|plan|review|auto]`.
- Native reasoning tokens (`/think [off|auto|deep]`).
- Persistent local range cache in `~/.cache/brimkern/ranges/`.

---

## 🧩 Embeddable SDK

Add on-device AI to any website with zero backend infrastructure. Free at any scale because inference runs on your visitor's GPU:

```html
<!-- One script tag, no build step -->
<script src="https://brimkern.com/sdk.js"></script>
<script>
  Brimkern.embed({
    model: 'lfm2.5-230m',                                      // 149 MB streamable hybrid model
    system: 'You are a helpful customer support assistant.',   // Customized instructions
    knowledge: [                                               // In-browser local RAG
      { title: 'Pricing', text: 'Plans start at $10/mo with a 14-day free trial.' }
    ]
  });
</script>
```

Or install via npm:

```bash
npm install brimkern
```

```typescript
import { embed } from 'brimkern';

const widget = embed({
  model: 'lfm2.5-230m',
  tools: ['calc', 'date'],
  showSources: true
});
```

---

## 🚀 Supported Models & The `.brik` Format

Brimkern loads single-file GGUFs from Hugging Face or `.brik` files optimized for the web:

- **LFM2.5 230M** (~149 MB) : Ultra-fast hybrid RNN/Transformer, runs on any phone or laptop.
- **Qwen 2.5 Coder 0.5B / 1.5B** : Specialized coding models with strong syntax generation.
- **Qwen 2.5 0.5B / Qwen 3 0.6B / 4B** : General chat and deep reasoning models.
- **SD-Turbo / SDXS** : Text-to-image diffusion in real-time.

```
# Launch any model directly by URL:
https://brimkern.com/chat?model=Qwen/Qwen3-0.6B-GGUF
https://brimkern.com/chat?model=romainkh14/LFM2.5-230M_BRIK
```

The `.brik` format enables:
- **Zero-CPU overhead**: Tensors pre-quantized (int8 / int4 / int3) for GPU layout.
- **HTTP Range Streaming**: Layers stream on demand; inference starts in seconds.
- **Embedded Tokenizer**: True offline operation once cached in the browser.

---

## 🛠️ The Engine

The inference engine relies entirely on hand-written WGSL shaders:
- **Fused quantized matmuls** (`matmul_t_q4`, `matmul_t_q8`, `matmul_t_q3`).
- **Decode GEMV** with subgroup & shared-memory reductions.
- **Self-validation at runtime**: every kernel checks against a CPU reference on initialization and falls back gracefully if hardware limitations are detected.
- **Diagnostic URL flags**: `?gputopk=0`, `?kvreuse=0`, `?kvq=0`, `?timing=1`.

Benchmark reports and architectural deep dives are documented in [`docs/`](docs/).

---

## 📦 Quickstart for Developers

Clone and run the complete web application locally:

```bash
git clone https://github.com/RomainKH/Brimkern.git
cd Brimkern
npm install

# Run dev server
npm run dev

# Or build and start production server
npm run build && npm run start
```

Requires a browser supporting WebGPU (Chrome/Edge 121+, Safari 18+).

### Unit & E2E Tests

```bash
npm run test:brik       # .brik container codec, loader & container tests
npm run test:bpe        # BPE tokenizer tests
npm run test:ggtok      # GGUF tokenizer verification
npm run test:sdkfresh   # Verify SDK bundle alignment
```

---

## License

Code is licensed under the [MIT License](LICENSE) © 2026 Romain Khanoyan.  
Model weights carry their respective upstream open-source licenses.
