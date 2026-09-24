// Tokenizer Gemma 4 construit depuis le GGUF (`tokenizer.ggml.model = gemma4`).
//
// Ce n'est PAS le BPE byte-level de Qwen/Llama que couvre ggufTokenizer.ts : Gemma 4 est un BPE de
// style SentencePiece. Les espaces deviennent « ▁ », il n'y a AUCUNE pré-segmentation par mots (les
// fusions courent sur toute la ligne, seules les suites de « \n » sont isolées), les symboles de
// départ sont les caractères UTF-8 bruts, et un symbole absent du vocabulaire se replie sur les
// tokens d'octets `<0xXX>`. Règles relevées dans llama-vocab.cpp (LLAMA_VOCAB_PRE_TYPE_GEMMA4) et
// vérifiées token pour token contre `llama-tokenize` (scripts/test-gemma4-tokenizer.mjs).
//
// Passer ce vocabulaire dans BpeTokenizer ne planterait pas : il produirait des ids FAUX en silence
// (espaces non échappés, octets GPT-2 au lieu de <0xXX>) — d'où une classe dédiée.

interface MetaHolder { metadata: Record<string, unknown> }

export interface Gemma4TokenizerInfo {
	tokenizer: Gemma4Tokenizer;
	bosId: number | null;
	eosId: number | null;
	controlIds: number[];
}

export class Gemma4Tokenizer {
	private vocab = new Map<string, number>();
	private ranks = new Map<string, number>();
	private pieces: string[];
	private types: number[];
	private byteIds = new Int32Array(256).fill(-1);
	private specialRe: RegExp | null;
	private cache = new Map<string, number[]>();

	constructor(tokens: string[], types: number[], merges: string[], private bosId: number | null, private addBos: boolean) {
		this.pieces = tokens;
		this.types = types;
		for (let id = 0; id < tokens.length; id++) this.vocab.set(tokens[id], id);
		merges.forEach((m, i) => {
			// Même découpe que llama.cpp : premier espace APRÈS le 1er caractère (« ▁ ▁ » → « ▁ », « ▁ »).
			const pos = m.indexOf(' ', 1);
			if (pos > 0) this.ranks.set(m.slice(0, pos) + '\u0000' + m.slice(pos + 1), i);
		});
		for (let b = 0; b < 256; b++) {
			const id = this.vocab.get(`<0x${b.toString(16).toUpperCase().padStart(2, '0')}>`);
			if (id !== undefined) this.byteIds[b] = id;
		}
		// Tokens de contrôle (3) et ajoutés (4) : reconnus TELS QUELS dans le texte, plus long d'abord.
		const specials = tokens.filter((_, id) => types[id] === 3 || types[id] === 4)
			.sort((a, b) => b.length - a.length)
			.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
		this.specialRe = specials.length ? new RegExp(specials.join('|'), 'g') : null;
	}

	encode(text: string): number[] {
		const out: number[] = [];
		if (this.addBos && this.bosId != null) out.push(this.bosId);
		let last = 0;
		if (this.specialRe) {
			this.specialRe.lastIndex = 0;
			for (let m = this.specialRe.exec(text); m; m = this.specialRe.exec(text)) {
				if (m.index > last) this.encodeSegment(text.slice(last, m.index), out);
				out.push(this.vocab.get(m[0])!);
				last = m.index + m[0].length;
			}
		}
		if (last < text.length) this.encodeSegment(text.slice(last), out);
		return out;
	}

	private encodeSegment(seg: string, out: number[]): void {
		const escaped = seg.replace(/ /g, '▁');
		for (const word of escaped.match(/[^\n]+|\n+/g) ?? []) {
			const hit = this.cache.get(word);
			if (hit) { out.push(...hit); continue; }
			const ids = this.encodeWord(word);
			if (this.cache.size < 20000) this.cache.set(word, ids);
			out.push(...ids);
		}
	}

	private encodeWord(word: string): number[] {
		// Une suite de retours à la ligne connue du vocabulaire est un seul token (llama.cpp #21343).
		if (word[0] === '\n') {
			const id = this.vocab.get(word);
			if (id !== undefined) return [id];
		}
		const syms = Array.from(word);
		// BPE classique : fusionner la paire de plus bas rang, la plus à gauche en cas d'égalité.
		while (syms.length > 1) {
			let best = -1, bestRank = Infinity;
			for (let i = 0; i < syms.length - 1; i++) {
				const r = this.ranks.get(syms[i] + '\u0000' + syms[i + 1]);
				if (r !== undefined && r < bestRank) { bestRank = r; best = i; }
			}
			if (best < 0) break;
			syms.splice(best, 2, syms[best] + syms[best + 1]);
		}
		const ids: number[] = [];
		for (const s of syms) {
			const id = this.vocab.get(s);
			if (id !== undefined) { ids.push(id); continue; }
			for (const b of new TextEncoder().encode(s)) if (this.byteIds[b] >= 0) ids.push(this.byteIds[b]);
		}
		return ids;
	}

	// Les tokens de contrôle (3) sont tus, comme skip_special_tokens côté HF : les marqueurs de tour
	// n'ont rien à faire dans le texte rendu. Les tokens ajoutés (4 : <|channel>, <|tool_call>…)
	// restent visibles — c'est sur eux que l'appelant repère la réflexion et les appels d'outil.
	decode(ids: number[]): string {
		const bytes: number[] = [];
		const enc = new TextEncoder();
		for (const id of ids) {
			const ty = this.types[id] ?? 1;
			if (ty === 3) continue;
			const p = this.pieces[id];
			if (p === undefined) continue;
			if (ty === 6) { bytes.push(parseInt(p.slice(3, 5), 16)); continue; }
			for (const b of enc.encode(ty === 4 ? p : p.replace(/▁/g, ' '))) bytes.push(b);
		}
		return new TextDecoder('utf-8', { ignoreBOM: true }).decode(new Uint8Array(bytes));
	}
}

// null = pas un vocabulaire gemma4 (l'appelant garde ses autres chemins).
export function gemma4TokenizerFromGguf(man: MetaHolder): Gemma4TokenizerInfo | null {
	const m = man.metadata;
	if (String(m['tokenizer.ggml.model'] ?? '') !== 'gemma4') return null;
	const tokens = m['tokenizer.ggml.tokens'] as string[] | undefined;
	const merges = m['tokenizer.ggml.merges'] as string[] | undefined;
	if (!Array.isArray(tokens) || !Array.isArray(merges)) return null;
	const types = (m['tokenizer.ggml.token_type'] as number[] | undefined) ?? [];
	const num = (v: unknown) => (Number.isFinite(Number(v)) && v !== undefined ? Number(v) : null);
	const bosId = num(m['tokenizer.ggml.bos_token_id']);
	const eosId = num(m['tokenizer.ggml.eos_token_id']);
	// llama.cpp FORCE le BOS pour Gemma 4 même si le GGUF dit le contraire (llama-vocab.cpp).
	const tokenizer = new Gemma4Tokenizer(tokens, types, merges, bosId, true);
	const controlIds = types.flatMap((t, id) => (t === 3 ? [id] : []));
	return { tokenizer, bosId, eosId, controlIds };
}
