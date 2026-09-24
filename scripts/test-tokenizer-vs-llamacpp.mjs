#!/usr/bin/env node
// Tokenizer construit depuis un GGUF contre la vérité de llama.cpp, token pour token : Gemma 4
// (src/lib/gemma4Tokenizer.ts) ou BPE byte-level (src/lib/ggufTokenizer.ts : Qwen 2/3/3.5, Llama…).
//
//   node scripts/test-tokenizer-vs-llamacpp.mjs <fichier .gguf>
//
// Exige `llama-tokenize` (brew install llama.cpp). Le GGUF n'est lu que sur son en-tête.

import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { openSync, readSync, closeSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const gguf = process.argv[2];
if (!gguf) { console.error('usage : node scripts/test-tokenizer-vs-llamacpp.mjs <fichier.gguf>'); process.exit(2); }

const dir = mkdtempSync(join(tmpdir(), 'g4tok-'));
const entry = join(dir, 'entry.ts');
writeFileSync(entry, `export { gemma4TokenizerFromGguf } from ${JSON.stringify(join(process.cwd(), 'src/lib/gemma4Tokenizer.ts'))};
export { tokenizerFromGguf } from ${JSON.stringify(join(process.cwd(), 'src/lib/ggufTokenizer.ts'))};
export { parseGguf } from ${JSON.stringify(join(process.cwd(), 'src/lib/webgpu/ggufParser.ts'))};`);
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: join(dir, 'out.mjs'), logLevel: 'error' });
const { gemma4TokenizerFromGguf, tokenizerFromGguf, parseGguf } = await import(pathToFileURL(join(dir, 'out.mjs')).href);

const head = Buffer.alloc(64 << 20);
const fd = openSync(gguf, 'r');
const n = readSync(fd, head, 0, head.length, 0);
closeSync(fd);
const man = await parseGguf(new Blob([head.subarray(0, n)]));
const info = gemma4TokenizerFromGguf(man) ?? tokenizerFromGguf(man);
if (!info) { console.error('✗ vocabulaire non couvert'); process.exit(1); }
console.log(`tokenizer : ${man.metadata['tokenizer.ggml.model']} / pré-découpage ${man.metadata['tokenizer.ggml.pre'] ?? '-'}`);

const G4 = man.metadata['tokenizer.ggml.model'] === 'gemma4';
const CASES = [
  G4 ? '<|turn>system\nYou are a concise coding assistant.<turn|>\n<|turn>user\nWrite a Python function is_prime(n) that returns True if n is prime.<turn|>\n<|turn>model\n'
     : '<|im_start|>system\nYou are a concise coding assistant.<|im_end|>\n<|im_start|>user\nWrite a Python function is_prime(n).<|im_end|>\n<|im_start|>assistant\n<think>\n',
  'Hello  world!\n\n  def f(x):\n\treturn x**2  # carré é 日本 🙂\n',
  'Écris une fonction qui dédoublonne un tableau d’objets par clé.',
  'const x = arr.filter((v, i, a) => a.indexOf(v) === i);\n\n\n\nconsole.log(x)',
  '   leading spaces and trailing   ',
  G4 ? '<|channel>thought\nLet me think.<channel|>The answer is 42.' : '<think>\nLet me think.\n</think>\n\nThe answer is 42.',
  'Vietnamese tiếng Việt, Hindi हिन्दी — marques combinantes : e\u0301 a\u0300',
  'naïve façade — “quotes” ‘single’ … €100 ½ ∑ ∫ 🚀🔥 ​ zero-width',
  'if (a && b || !c) { return a->b; } // ::<T>',
  // « // » en début de ligne : le vocab a aussi « \ufeff// » (id 135260), que le parseur GGUF
  // confondait avec « // » (715) tant que TextDecoder avalait le BOM.
  '// Décoration\n// Module FEUILLE\n\n// Span contigu\n\ufeffBOM au milieu',
];

let fail = 0;
for (const text of CASES) {
  const f = join(dir, 'case.txt');
  writeFileSync(f, text);
  const r = spawnSync('llama-tokenize', ['-m', gguf, '-f', f, '--ids', '--log-disable'], { encoding: 'utf8' });
  const want = JSON.parse(r.stdout.trim().split('\n').pop());
  const got = info.tokenizer.encode(text);
  const ok = JSON.stringify(got) === JSON.stringify(want);
  const round = info.tokenizer.decode(G4 ? got.slice(1) : got);
  const roundOk = !G4 || round === text.replace(/<\|turn>|<turn\|>/g, '');
  if (!ok) fail++;
  console.log(`${ok ? '  ✓' : '  ✗'} ${JSON.stringify(text.slice(0, 50))}${ok ? '' : `\n      llama.cpp ${JSON.stringify(want)}\n      nous      ${JSON.stringify(got)}`}${roundOk ? '' : `\n      (aller-retour décodé différent : ${JSON.stringify(round.slice(0, 60))})`}`);
}
console.log(fail ? `\n✗ ${fail}/${CASES.length} écart(s)` : `\n✓ ${CASES.length}/${CASES.length} identiques à llama.cpp`);
process.exit(fail ? 1 : 0);
