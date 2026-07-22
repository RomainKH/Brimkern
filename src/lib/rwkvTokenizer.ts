// Tokenizer RWKV « World » (moteur v2) — trie byte-level, greedy longest-match. RWKV n'utilise PAS
// un tokenizer BPE type transformers.js : chaque token est une SÉQUENCE D'OCTETS, l'encodage prend
// le plus long token qui matche à chaque position (trie). Les ids 1..256 sont les 256 octets bruts
// → tout texte est toujours encodable (repli octet garanti). Id 0 = token spécial (<s>/EOS), exclu
// du trie. Le vocab (65536 chaînes échappées façon Python) est embarqué dans le .brik depuis le GGUF
// (tokenizer.ggml.tokens). Voir docs/engine-v2-linear-attention.md.

// Un token du vocab GGUF RWKV est une chaîne échappée : \xHH (octet hex), \t \n \r \\ \0 \' \", et
// les caractères imprimables bruts (ASCII). Reconstruit la séquence d'octets exacte du token.
export function unescapeRwkvToken(s: string): Uint8Array {
	const out: number[] = [];
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (c === '\\' && i + 1 < s.length) {
			const n = s[i + 1];
			if (n === 'x') { out.push(parseInt(s.substr(i + 2, 2), 16) & 0xff); i += 3; continue; }
			if (n === 't') { out.push(9); i++; continue; }
			if (n === 'n') { out.push(10); i++; continue; }
			if (n === 'r') { out.push(13); i++; continue; }
			if (n === '0') { out.push(0); i++; continue; }
			if (n === '\\') { out.push(92); i++; continue; }
			if (n === "'") { out.push(39); i++; continue; }
			if (n === '"') { out.push(34); i++; continue; }
			out.push(92); continue; // échappement inconnu → antislash littéral
		}
		const code = c.codePointAt(0)!;
		if (code < 128) out.push(code);
		else for (const b of new TextEncoder().encode(c)) out.push(b); // sécurité (le vocab échappe déjà le non-ASCII)
	}
	return new Uint8Array(out);
}

interface TrieNode { id?: number; next: Map<number, TrieNode>; }

export class RwkvTokenizer {
	private root: TrieNode = { next: new Map() };
	private idToBytes: Uint8Array[] = [];
	readonly vocabSize: number;
	readonly eosId: number;

	// `tokens` = tokenizer.ggml.tokens (chaînes échappées). Id 0 reste spécial (exclu du trie).
	constructor(tokens: string[], eosId = 0) {
		this.vocabSize = tokens.length;
		this.eosId = eosId;
		for (let id = 0; id < tokens.length; id++) {
			const bytes = unescapeRwkvToken(tokens[id]);
			this.idToBytes[id] = bytes;
			if (id === 0 || bytes.length === 0) continue; // 0 = spécial, jamais matché comme texte
			let node = this.root;
			for (const b of bytes) {
				let nx = node.next.get(b);
				if (!nx) { nx = { next: new Map() }; node.next.set(b, nx); }
				node = nx;
			}
			node.id = id;
		}
	}

	// Texte → ids. Greedy : à chaque position, le plus long token du trie (repli octet garanti par
	// les ids 1..256). Zéro perte : re-décoder les ids redonne le texte exact.
	encode(text: string): number[] {
		const bytes = new TextEncoder().encode(text);
		const ids: number[] = [];
		let i = 0;
		while (i < bytes.length) {
			let node = this.root, bestId = -1, bestLen = 0, len = 0;
			for (let j = i; j < bytes.length; j++) {
				const nx = node.next.get(bytes[j]);
				if (!nx) break;
				node = nx; len++;
				if (nx.id !== undefined) { bestId = nx.id; bestLen = len; }
			}
			if (bestId < 0) { bestId = bytes[i] + 1; bestLen = 1; } // octet brut = id (octet+1)
			ids.push(bestId);
			i += bestLen;
		}
		return ids;
	}

	// Ids → texte. Concatène les octets de chaque token puis décode l'UTF-8 (tolérant).
	decode(ids: number[]): string {
		const parts: number[] = [];
		for (const id of ids) {
			if (id === this.eosId) continue;
			const b = this.idToBytes[id];
			if (b) for (const x of b) parts.push(x);
		}
		return new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(parts));
	}
}
