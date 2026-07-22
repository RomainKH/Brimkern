// Test autoportant du tokenizer RWKV World (pas de GGUF requis) : vocab synthétique (256 octets +
// quelques fusions). Vérifie l'un-escape, le greedy longest-match, le repli octet et le round-trip.
// (La validation contre le VRAI vocab 65536 se fait via le script d'inspection du GGUF.)
// Run : `npm run test:rwkv`.

import { RwkvTokenizer, unescapeRwkvToken } from './rwkvTokenizer';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) console.log(`  ok   ${name}`);
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

// 1. un-escape : \xHH, \t\n\r\\, ASCII brut, UTF-8 multi-octets échappé.
check('unescape \\x41 -> [0x41]', Array.from(unescapeRwkvToken('\\x41')).join() === '65');
check('unescape \\t\\n -> [9,10]', Array.from(unescapeRwkvToken('\\t\\n')).join() === '9,10');
check('unescape "ab" -> [97,98]', Array.from(unescapeRwkvToken('ab')).join() === '97,98');
check('unescape \\xc3\\xbc -> [195,188] (ü)', Array.from(unescapeRwkvToken('\\xc3\\xbc')).join() === '195,188');

// Vocab synthétique : 0=spécial, 1..256 = octets, 257="ab", 258="abc".
const toks = ['<s>'];
for (let b = 0; b < 256; b++) toks.push('\\x' + b.toString(16).padStart(2, '0'));
toks.push('ab', 'abc');
const tk = new RwkvTokenizer(toks, 0);

// 2. greedy longest-match : "abc" -> [258] ; "abx" -> [257, octet 'x'].
check('greedy "abc" -> [258]', JSON.stringify(tk.encode('abc')) === '[258]');
check('greedy "abx" -> [257, 121]', JSON.stringify(tk.encode('abx')) === '[257,121]'); // 'x'=120 -> id 121

// 3. repli octet garanti : n'importe quel octet est encodable (id = octet+1).
check('octet brut "A" -> [66]', JSON.stringify(tk.encode('A')) === '[66]'); // 'A'=65 -> id 66

// 4. round-trip lossless (UTF-8 arbitraire passe par les octets).
for (const s of ['abc', 'abcabx', 'héllo', 'a\tb\nc', '日本']) {
	check(`round-trip ${JSON.stringify(s)}`, tk.decode(tk.encode(s)) === s);
}

// 5. eos ignoré au décodage.
check('decode ignore eos (0)', tk.decode([0, 257, 0]) === 'ab');

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
