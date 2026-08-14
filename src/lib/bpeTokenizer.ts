// Tokenizer BPE byte-level MAISON (gabarit rwkvTokenizer) — remplace l'import CDN de
// transformers.js dans le SDK (reco n°1 de l'audit sécurité 2026-07-22 : dépendance réseau tierce
// sur le chemin critique du widget, hors-ligne cassé, CSP hôte stricte incompatible). Piloté par le
// tokenizer.json EMBARQUÉ dans le .brik (LFM2.5 : BPE gpt2, vocab 65536, spéciaux ChatML).
// Couverture VOLONTAIREMENT bornée : BPE + ByteLevel (+ Split regex) + TemplateProcessing (BOS).
// Toute autre config (WordPiece, Unigram, Metaspace…) → throw à la construction, l'appelant garde
// son repli. Équivalence vérifiée vs transformers.js par scripts/test-bpe-tokenizer.cjs.

interface AddedToken { id: number; content: string; special?: boolean }

// Table bytes↔unicode de GPT-2 : les 256 octets → des points de code imprimables (les octets
// « visibles » restent eux-mêmes, les autres sont remontés à partir de 256).
function bytesToUnicode(): { enc: string[]; dec: Map<string, number> } {
	const bs: number[] = [];
	for (let i = 0x21; i <= 0x7e; i++) bs.push(i);
	for (let i = 0xa1; i <= 0xac; i++) bs.push(i);
	for (let i = 0xae; i <= 0xff; i++) bs.push(i);
	const cs = bs.slice();
	let n = 0;
	for (let b = 0; b < 256; b++) {
		if (!bs.includes(b)) { bs.push(b); cs.push(256 + n); n++; }
	}
	const enc = new Array<string>(256);
	const dec = new Map<string, number>();
	for (let i = 0; i < bs.length; i++) { enc[bs[i]] = String.fromCodePoint(cs[i]); dec.set(String.fromCodePoint(cs[i]), bs[i]); }
	return { enc, dec };
}

const GPT2_SPLIT = "'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+";

export class BpeTokenizer {
	private vocab = new Map<string, number>();
	private idToTok = new Map<number, string>();
	private ranks = new Map<string, number>();          // "a b" → rang de fusion
	private added: AddedToken[] = [];
	private specialIds = new Set<number>();
	private splitRe: RegExp;
	private addedRe: RegExp | null = null;
	private bosIds: number[] = [];                       // préfixe du post-processor (ex. BOS)
	private byteEnc: string[];
	private byteDec: Map<string, number>;
	private cache = new Map<string, number[]>();

	constructor(tokenizerJson: string | object) {
		const j: any = typeof tokenizerJson === 'string' ? JSON.parse(tokenizerJson) : tokenizerJson;
		if (j?.model?.type !== 'BPE') throw new Error(`BpeTokenizer : model.type ${j?.model?.type} non couvert (BPE uniquement)`);
		({ enc: this.byteEnc, dec: this.byteDec } = bytesToUnicode());
		for (const [tok, id] of Object.entries(j.model.vocab as Record<string, number>)) {
			this.vocab.set(tok, id); this.idToTok.set(id, tok);
		}
		const merges: (string | [string, string])[] = j.model.merges ?? [];
		merges.forEach((m, i) => this.ranks.set(Array.isArray(m) ? `${m[0]} ${m[1]}` : m, i));
		for (const t of (j.added_tokens ?? []) as AddedToken[]) {
			this.added.push(t);
			this.vocab.set(t.content, t.id); this.idToTok.set(t.id, t.content);
			if (t.special) this.specialIds.add(t.id);
		}
		if (this.added.length) {
			const esc = this.added.map((t) => t.content.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
				.sort((a, b) => b.length - a.length);
			this.addedRe = new RegExp(`(${esc.join('|')})`, 'g');
		}
		// Pré-tokenisation : regex du Split si présente (Sequence/Split), sinon gabarit GPT-2.
		const pattern = BpeTokenizer.findSplitPattern(j.pre_tokenizer) ?? GPT2_SPLIT;
		this.splitRe = new RegExp(pattern, 'gu');
		// Post-processor : préfixe de spéciaux du template « single » (ex. BOS <|startoftext|>) —
		// transformers.js les ajoute à l'encode, le chat en dépend (classify saute ids[0]).
		// Le TemplateProcessing peut être imbriqué dans une Sequence (cas LFM2.5).
		const findTemplate = (pp: any): any => {
			if (!pp) return null;
			if (pp.type === 'TemplateProcessing') return pp.single;
			if (pp.type === 'Sequence') { for (const p of pp.processors ?? []) { const r = findTemplate(p); if (r) return r; } }
			return null;
		};
		const single = findTemplate(j.post_processor);
		if (Array.isArray(single)) {
			for (const item of single) {
				if (item.SpecialToken) { const id = this.vocab.get(item.SpecialToken.id); if (id !== undefined) this.bosIds.push(id); }
				else break; // au premier $A, le préfixe s'arrête
			}
		}
	}

	private static findSplitPattern(pre: any): string | null {
		if (!pre) return null;
		if (pre.type === 'Split' && pre.pattern?.Regex) return pre.pattern.Regex;
		if (pre.type === 'ByteLevel' && pre.use_regex !== false) return GPT2_SPLIT;
		if (pre.type === 'Sequence') {
			for (const p of pre.pretokenizers ?? []) { const r = BpeTokenizer.findSplitPattern(p); if (r) return r; }
		}
		return null;
	}

	// BPE sur un « mot » déjà passé en unicode byte-level.
	private bpe(word: string): number[] {
		const hit = this.cache.get(word);
		if (hit) return hit;
		let parts = Array.from(word);
		while (parts.length > 1) {
			let best = -1, bestRank = Infinity;
			for (let i = 0; i < parts.length - 1; i++) {
				const r = this.ranks.get(`${parts[i]} ${parts[i + 1]}`);
				if (r !== undefined && r < bestRank) { bestRank = r; best = i; }
			}
			if (best < 0) break;
			parts = [...parts.slice(0, best), parts[best] + parts[best + 1], ...parts.slice(best + 2)];
		}
		const ids: number[] = [];
		for (const p of parts) {
			const id = this.vocab.get(p);
			if (id !== undefined) ids.push(id);
			else for (const ch of p) { const cid = this.vocab.get(ch); if (cid !== undefined) ids.push(cid); }
		}
		this.cache.set(word, ids);
		return ids;
	}

	private encodeChunk(text: string): number[] {
		const out: number[] = [];
		for (const m of text.match(this.splitRe) ?? []) {
			const bytes = new TextEncoder().encode(m);
			let w = '';
			for (const b of bytes) w += this.byteEnc[b];
			out.push(...this.bpe(w));
		}
		return out;
	}

	// Encode AVEC le préfixe du post-processor (BOS) — même contrat que transformers.js.
	encode(text: string): number[] {
		const out = [...this.bosIds];
		if (this.addedRe) {
			for (const part of text.split(this.addedRe)) {
				if (!part) continue;
				const id = this.vocab.get(part);
				if (id !== undefined && this.added.some((t) => t.content === part)) out.push(id);
				else out.push(...this.encodeChunk(part));
			}
		} else {
			out.push(...this.encodeChunk(text));
		}
		return out;
	}

	// Décode en sautant les spéciaux (même contrat que decode(..., skip_special_tokens: true)).
	decode(ids: number[]): string {
		const bytes: number[] = [];
		for (const id of ids) {
			if (this.specialIds.has(id)) continue;
			const tok = this.idToTok.get(id);
			if (tok === undefined) continue;
			for (const ch of tok) {
				const b = this.byteDec.get(ch);
				if (b !== undefined) bytes.push(b);
				else for (const ub of new TextEncoder().encode(ch)) bytes.push(ub); // token ajouté non byte-level
			}
		}
		return new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));
	}
}
