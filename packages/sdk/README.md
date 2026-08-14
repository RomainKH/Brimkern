# brimkern

**On-device AI for your site.** One script tag runs a real language model on your visitor's GPU
(WebGPU). No server, no API key, no per-token cost — and nothing ever leaves the browser.

```html
<script src="https://brimkern.com/sdk.js"></script>
<script>
  Brimkern.embed({
    system: 'You are the assistant of the Ferblanc store.',
    title: 'Ask us anything',
  });
</script>
```

The model (149 MB) downloads **only when a visitor actually opens the widget**, then stays cached on
their device — so your page speed is untouched, and the second visit starts in seconds, offline
included.

## Install

```bash
npm i brimkern
```

```js
import { embed, createSession, generate, preload, status } from 'brimkern';
```

Importing the package on a server (Next.js, Remix, Astro…) is safe: it does nothing until a browser
API is present. Call `embed()` from a client effect.

Prefer the script tag? Pin a version so your widget never changes under your feet:

```html
<script src="https://brimkern.com/sdk-0.1.0.js"></script>  <!-- pinned -->
<script src="https://brimkern.com/sdk.js"></script>        <!-- always latest -->
```

## Answer from *your* content

Give it your text. It is chunked and ranked **in the browser** — only the passages matching the
question reach the model, and nothing is sent anywhere.

```js
Brimkern.embed({
  system: 'You are the assistant of the Ferblanc store.',
  knowledge: [
    { title: 'Opening hours', text: 'Open Tuesday to Saturday, 10am to 7pm. Closed Sunday and Monday.' },
    { title: 'Shipping', text: 'Free in France from 60 euros. Switzerland: flat 8 euros, 2–4 working days.' },
  ],
});
```

**Write short, factual notes.** The default model is a 230M — small enough to download on a visitor's
connection, and it quotes your notes well. But it is small: two different numbers inside the same
paragraph can get mixed up. One fact per paragraph is the rule that makes this work.

## Shape the tone

On a model this size, *describing* a style in the system prompt does not work — it paraphrases the
instruction. **Showing** does. Two or three examples are enough:

```js
Brimkern.embed({
  system: 'You are a concise support assistant.',
  examples: [
    { user: 'Do you ship abroad?', assistant: 'Yes — Switzerland, flat 8 euros.' },
    { user: 'Tell me about your history', assistant: "I only answer questions about orders and shipping." },
  ],
});
```

## Without the widget

```js
const session = createSession({ system: '…', knowledge: [...] });
const answer = await session.ask('Do you ship to Switzerland?');
session.reset();     // clears history, keeps the model loaded
session.destroy();

await generate({ prompt: 'Summarise this in one line: …' });   // one-shot
await preload({ onProgress: (phase, p) => …ptext… });          // warm it up on hover
status();            // 'unavailable' | 'idle' | 'loading' | 'ready' | 'error'
```

## Options

| | |
| --- | --- |
| `model` | An LFM2 `.brik` URL, or omit for the default (149 MB). **v0 runs LFM2 `.brik` models only** — a clear error tells you when a file is not one. The full engine (any single-file GGUF from Hugging Face) lives in the app at [brimkern.com/chat](https://brimkern.com/chat). |
| `system` | What the assistant is and does. |
| `knowledge` | A string, `{ title, text }`, or an array of either. |
| `knowledgeBudget` | Characters of notes injected per question (default 1200). |
| `examples` | Few-shot turns — the effective way to fix tone at this size. |
| `title`, `greeting`, `accent` | Widget wording and colour. |
| `maxTokens`, `temperature` | Generation limits. |

## Requirements

A WebGPU browser: Chrome/Edge 121+, or Safari 18+. Without it, `status()` returns `'unavailable'`
and the widget stays out of the way — nothing breaks.

## What it is under the hood

The forward pass is hand-written WGSL compute shaders; the weights stream in as HTTP ranges from a
`.brik` container with its tokenizer embedded. No `onnxruntime`, no remote inference. The engine is
MIT and lives at [github.com/RomainKH/Brimkern](https://github.com/RomainKH/Brimkern).

Model weights carry their own licenses — the default model is under the LFM 1.0 license.

## License

MIT © Romain Khanoyan
