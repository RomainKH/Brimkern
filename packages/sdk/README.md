# brimkern

**On-device AI for your site.** One script tag runs a real language model on your visitor's GPU
(WebGPU). No server, no API key, no per-token cost, and nothing ever leaves the browser.

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
their device, so your page speed is untouched, and the second visit starts in seconds, offline
included.

## Install

```bash
npm i brimkern
```

```js
import { embed, createSession, generate, preload, status, runtime } from 'brimkern';
```

Importing the package on a server (Next.js, Remix, Astro…) is safe: it does nothing until a browser
API is present. Call `embed()` from a client effect.

Prefer the script tag? Pin a version so your widget never changes under your feet:

```html
<script src="https://brimkern.com/sdk-0.3.0.js"></script>  <!-- pinned -->
<script src="https://brimkern.com/sdk.js"></script>        <!-- always latest -->
```

## Drive it, unmount it, listen to it

`embed()` returns a handle. It is what lets you unmount the widget — which matters in any app with
client-side routing, where it would otherwise survive every route change and a second `embed()`
would stack a second launcher on the page.

```js
const widget = embed({ system: 'You are our support agent.' });

widget.open(); widget.close(); widget.toggle();
await widget.ask('Do you ship to Canada?');   // as if the visitor had typed it
widget.setKnowledge(newDocs);                  // swap the notes, keep the conversation
widget.setHistory(saved);                      // resume a conversation after a reload
widget.history;                                // Msg[] — store it, hand it back as `history`
widget.destroy();                              // removes the DOM, cancels any generation in flight
```

`destroy()` leaves the engine loaded: the weights are shared by the page, so unmounting never makes
the next widget re-download the model. In React the handle is exactly what an effect's cleanup needs:

```js
useEffect(() => {
  const widget = embed({ system: '…' });
  return () => widget.destroy();
}, []);
```

Events, on the handle and on sessions alike — `on()` returns its own unsubscribe function:

```js
widget.on('message',  ({ role, content, sources }) => analytics.track('chat', { role, content }));
widget.on('progress', (phase, p) => bar.value = p ? p.loaded / p.total : 0);  // phase: 'init' | 'download' | 'tokenizer' | 'gpu'
widget.on('ready',    () => {});
widget.on('error',    (err) => report(err));   // err.code === 'no-webgpu' → this browser can't run it
widget.on('tool',     ({ name, result }) => {});  // a tool produced a result for this turn
```

That `error` one is the most useful thing the widget can tell you: without it, a visitor on a
browser without WebGPU was a failure you never heard about.

## Answer from *your* content

Give it your text. It is chunked and ranked **in the browser**: only the passages matching the
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

**Write short, factual notes.** The default model is a 230M: small enough to download on a visitor's
connection, and it quotes your notes well. But it is small: two different numbers inside the same
paragraph can get mixed up. One fact per paragraph is the rule that makes this work.

You can see which passages produced an answer — the way you tell a bad note from a bad reading of a
good one, and the way a visitor can check what they are told:

```js
embed({ knowledge: docs, showSources: true });          // under each answer, in the widget
widget.on('message', ({ sources }) => trace(sources));  // or without displaying anything
await session.ask(q, { onSources: (s) => show(s) });    // [{ title, text, score, doc }]
```

When no note matches, the assistant says it does not have that information — but only for questions
that actually ask for information. "Are you ok?", "PLEASE", "hello" get an answer, not a wall: a
widget that stonewalls everything outside its notes is a widget people close.

## Tools: hand it facts your page knows

Arithmetic, today's date, or your own functions — a stock lookup, an order status, a cart total.
The model **never decides to call a tool** (below ~3B parameters, emitted tool calls are
hallucinated — measured). Detection is deterministic, your function runs in *your* page, and the
model receives the result as a fact, exactly like a knowledge note:

```js
Brimkern.embed({
  tools: [
    'calc',   // detects arithmetic in the message, injects the exact result
    'date',   // the model knows today's date
    {
      name: 'stock',
      match: /stock|available/i,               // or a predicate: (question) => boolean
      run: async (q) => `${await api.stock(q)} in stock`,   // sync or async
    },
  ],
});
```

A tool that throws, hangs (10 s cap) or returns nothing is simply absent from the turn — the turn
itself never fails because of a tool. Results are capped at 600 characters: a result is a fact, not
a report. Nothing touches the network unless *your* `run` does.

## Make it yours: theme, corner, size, labels

```js
Brimkern.embed({
  theme: 'auto',            // 'light' (default) | 'dark' | 'auto' — auto follows prefers-color-scheme, live
  position: 'bottom-left',  // 'bottom-right' (default) | 'bottom-left'
  width: 400, height: 600,  // px, clamped to 300-480 × 380-720
  labels: {                 // any language, any tone — omitted keys keep the `lang` defaults
    open: 'Chat öffnen',
    placeholder: 'Nachricht eingeben…',
    note: 'Lokale KI — läuft auf Ihrer GPU.',
  },
});
```

`lang` covers English and French out of the box; `labels` is the door to every other language
(`open`, `close`, `placeholder`, `note`, `error`, `empty`, `help`, `sources`, `mb`, `phases`).
Labels are rendered as text, never as markup, and `theme` takes a keyword, not CSS: nothing an
integrator passes here can inject styles into the host page.

## Shape the tone

On a model this size, *describing* a style in the system prompt does not work: it paraphrases the
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
const session = createSession({ system: '…', knowledge: [...], history: saved });
const answer = await session.ask('Do you ship to Switzerland?');

session.history;              // the Msg[] so far
session.lastSources;          // the notes behind the last answer
session.setHistory(saved);    // resume a stored conversation
session.setKnowledge(docs);   // swap the notes, keep the conversation
session.on('message', log);   // same events as the widget
session.reset();              // clears history, keeps the model loaded
session.destroy();

await generate({ prompt: 'Summarise this in one line: …' });   // one-shot
await preload({ onProgress: (phase, p) => …ptext… });          // warm it up on hover
status();            // 'unavailable' | 'idle' | 'loading' | 'ready' | 'error'
runtime();           // 'worker' | 'main' | 'pending' — where inference actually runs
```

`setHistory()` and `setKnowledge()` throw during a generation: finish or cancel the turn first.
Both leave the engine and the weights untouched — swapping a catalogue costs neither a download nor
the conversation.

## Options

| | |
| --- | --- |
| `model` | An LFM2 or RWKV-7 `.brik` URL, or omit for the default (149 MB). **The SDK runs LFM2 and RWKV-7 `.brik` models only**: a clear error tells you when a file is neither. The full engine (any single-file GGUF from Hugging Face) lives in the app at [brimkern.com/chat](https://brimkern.com/chat). |
| `system` | What the assistant is and does. |
| `knowledge` | A string, `{ title, text }`, or an array of either. |
| `knowledgeBudget` | Characters of notes injected per question (default 1200). |
| `examples` | Few-shot turns: the effective way to fix tone at this size. |
| `title`, `greeting`, `accent` | Widget wording and colour. |
| `lang` | `'en'` or `'fr'` — the widget's labels *and* the instructions given to the model. Guessed from your system prompt when left out. |
| `history` | Starting conversation, so a visitor finds their thread after a reload. When set, `greeting` is skipped. |
| `showSources` | Show the notes behind each answer, under the bubble. Off by default. |
| `tools` | `'calc'`, `'date'`, or your own `{ name, match, run }` — see "Tools" above. |
| `theme`, `position`, `width`, `height`, `labels` | The widget's look and wording — see "Make it yours" above. |
| `maxTokens`, `temperature` | Generation limits. `temperature` defaults to 0.25 when you pass `knowledge` (copying a figure out of a note has nothing to gain from sampling wide) and 0.55 otherwise. |
| `worker`, `workerUrl` | Run inference in a Web Worker. Only takes effect before the first load: the engine is shared by the page. |

## One engine per page

The engine is a singleton per model URL: N widgets and N sessions share one WebGPU init and one set
of weights in VRAM. Mounting a second widget costs a DOM node, not 149 MB.

## Requirements

A WebGPU browser: Chrome/Edge 121+, or Safari 18+. Without it, `status()` returns `'unavailable'`
and the widget stays out of the way: nothing breaks.

## What it is under the hood

The forward pass is hand-written WGSL compute shaders; the weights stream in as HTTP ranges from a
`.brik` container with its tokenizer embedded. No `onnxruntime`, no remote inference. The engine is
MIT and lives at [github.com/RomainKH/Brimkern](https://github.com/RomainKH/Brimkern).

Model weights carry their own licenses: the default model is under the LFM 1.0 license.

## License

MIT © Romain Khanoyan
