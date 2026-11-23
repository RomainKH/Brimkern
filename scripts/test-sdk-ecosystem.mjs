// Tests unitaires sans navigateur des briques écosystème SDK :
//   - structured.ts (extractJson, validateJsonSchema, runStructuredJson avec réparation)
//   - adapters.ts   (createOpenAICompatible sync + stream, createLanguageModel Vercel AI SDK)
// Usage : node scripts/test-sdk-ecosystem.mjs
import * as esbuild from 'esbuild';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(path.join(tmpdir(), 'bk-sdk-eco-'));
const outS = path.join(tmp, 'structured.mjs');
const outA = path.join(tmp, 'adapters.mjs');
await Promise.all([
  esbuild.build({ entryPoints: [path.join(ROOT, 'src/sdk/structured.ts')], bundle: true, format: 'esm', platform: 'node', outfile: outS, logLevel: 'error' }),
  esbuild.build({ entryPoints: [path.join(ROOT, 'src/sdk/adapters.ts')], bundle: true, format: 'esm', platform: 'node', outfile: outA, logLevel: 'error' }),
]);
const { extractJson, validateJsonSchema, formatJsonSystem, runStructuredJson } = await import(pathToFileURL(outS).href);
const { buildOpenAICompatible, buildLanguageModel } = await import(pathToFileURL(outA).href);
rmSync(tmp, { recursive: true, force: true });

let n = 0;
const test = async (name, fn) => { await fn(); n++; console.log(`  ✓ ${name}`); };

console.log('structured.ts');
await test('extractJson extrait un objet entouré de texte ou markdown', () => {
  assert.equal(extractJson('Voici :\n```json\n{"ok":true,"n":3}\n```'), '{"ok":true,"n":3}');
  assert.equal(extractJson('Result: {"a":"{nested}"}!'), '{"a":"{nested}"}');
  assert.equal(extractJson('pas de json ici'), null);
});

const ticketSchema = {
  type: 'object',
  required: ['category', 'urgency'],
  properties: {
    category: { type: 'string', enum: ['billing', 'bug', 'other'] },
    urgency: { type: 'string', enum: ['low', 'high'] },
    count: { type: 'integer' },
  },
};

await test('validateJsonSchema valide types, required et enum', () => {
  assert.deepEqual(validateJsonSchema({ category: 'bug', urgency: 'high', count: 2 }, ticketSchema), []);
  assert.ok(validateJsonSchema({ category: 'unknown', urgency: 'high' }, ticketSchema).length > 0);
  assert.ok(validateJsonSchema({ category: 'bug' }, ticketSchema).some((e) => e.includes('urgency')));
  assert.ok(validateJsonSchema({ category: 'bug', urgency: 'low', count: 1.5 }, ticketSchema).some((e) => e.includes('integer')));
});

await test('runStructuredJson répare une première réponse invalide', async () => {
  const calls = [];
  const replies = ['{"category":"nope","urgency":"high"}', '{"category":"bug","urgency":"high"}'];
  const res = await runStructuredJson(async (p) => { calls.push(p); return replies.shift(); }, 'Ticket', ticketSchema, { retries: 1, lang: 'en' });
  assert.deepEqual(res.data, { category: 'bug', urgency: 'high' });
  assert.equal(res.attempts, 2);
  assert.match(calls[1], /previous reply was invalid/);
  assert.match(formatJsonSystem(ticketSchema, 'Be strict', 'fr'), /JSON valide/);
});

console.log('adapters.ts');
function fakeSessionFactory(reply = 'Hello world') {
  const seen = [];
  const factory = (cfg) => {
    seen.push(cfg);
    return {
      async ask(text, opts = {}) {
        seen.push({ asked: text });
        const parts = reply.split(' ');
        let acc = '';
        for (let i = 0; i < parts.length; i++) {
          acc += (i ? ' ' : '') + parts[i];
          opts.onToken?.(acc);
        }
        return acc;
      },
      destroy() {},
    };
  };
  return { factory, seen };
}

await test('createOpenAICompatible : appel synchrone standard', async () => {
  const { factory, seen } = fakeSessionFactory('42');
  const client = buildOpenAICompatible(factory, { model: 'qwen3-0.6b-shop' });
  const res = await client.chat.completions.create({
    messages: [
      { role: 'system', content: 'Be brief' },
      { role: 'user', content: '6 * 7?' },
    ],
  });
  assert.equal(res.object, 'chat.completion');
  assert.equal(res.choices[0].message.content, '42');
  assert.equal(seen[0].system, 'Be brief');
  assert.equal(seen[1].asked, '6 * 7?');
});

await test('createOpenAICompatible : streaming AsyncIterable par deltas', async () => {
  const { factory } = fakeSessionFactory('Bonjour monde local');
  const client = buildOpenAICompatible(factory);
  const stream = client.chat.completions.create({
    stream: true,
    messages: [{ role: 'user', content: 'Dis bonjour' }],
  });
  let text = '';
  let finished = false;
  for await (const chunk of stream) {
    if (chunk.choices[0].delta.content) text += chunk.choices[0].delta.content;
    if (chunk.choices[0].finish_reason === 'stop') finished = true;
  }
  assert.equal(text, 'Bonjour monde local');
  assert.equal(finished, true);
});

await test('createLanguageModel (Vercel AI SDK v1) : doGenerate et doStream', async () => {
  const { factory } = fakeSessionFactory('Local GPU answer');
  const model = buildLanguageModel(factory, { model: 'qwen3-0.6b-shop' });
  assert.equal(model.specificationVersion, 'v1');
  assert.equal(model.provider, 'brimkern');

  const gen = await model.doGenerate({
    prompt: [
      { role: 'system', content: 'Concise' },
      { role: 'user', content: [{ type: 'text', text: 'Hi' }] },
    ],
  });
  assert.equal(gen.text, 'Local GPU answer');
  assert.equal(gen.finishReason, 'stop');

  const { stream } = await model.doStream({ prompt: [{ role: 'user', content: 'Hi' }] });
  const reader = stream.getReader();
  let acc = '';
  let finish = null;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value.type === 'text-delta') acc += value.textDelta;
    if (value.type === 'finish') finish = value.finishReason;
  }
  assert.equal(acc, 'Local GPU answer');
  assert.equal(finish, 'stop');
});

console.log(`\n${n} tests OK`);
