// Tokenizer construit DEPUIS LE GGUF LUI-MÊME — la brique qui rend la portabilité réelle.
//
// Jusqu'ici, charger un GGUF exigeait de savoir quel tokenizer Hugging Face lui associer : une table
// arch → dépôt (GGUF_ARCH_FAMILY) plus un téléchargement de tokenizer via transformers.js. Deux
// conséquences : (1) un modèle hors table gardait le tokenizer sélectionné dans l'UI et sortait du
// CHARABIA silencieux (constaté sur l'arch `llama`, absente de la table jusqu'au 2026-08-13), (2) le
// widget embarquable ne pouvait pas servir un modèle arbitraire du Hub sans dépendance réseau tierce.
//
// Or le GGUF EMBARQUE son vocabulaire : `tokenizer.ggml.tokens`, `.merges`, `.token_type`, les ids
// BOS/EOS et le nom du pré-tokeniseur. On reconstruit donc un `tokenizer.json` équivalent que le
// BpeTokenizer maison (déjà vérifié token-exact vs transformers.js) sait consommer. Aucun réseau,
// aucun mapping à maintenir, et le tokenizer correspond FORCÉMENT aux poids qu'on vient de lire.
//
// Couverture : `tokenizer.ggml.model` ∈ {gpt2, llama} en variante BPE byte-level — c'est ce que
// produit convert_hf_to_gguf.py pour Llama 3.x, Qwen 2/3, Gemma, Mistral, SmolLM, Phi, Falcon…
// Les vocabulaires SentencePiece stricts (`model = llama` SANS merges : Llama 2, Mistral 7B v0.1)
// ne sont PAS couverts → on rend null et l'appelant garde le chemin transformers.js.

import { BpeTokenizer } from './bpeTokenizer';

// Sous-ensemble du manifeste qui nous intéresse (évite d'importer le type complet du parser).
interface MetaHolder { metadata: Record<string, unknown> }

// Regex de pré-tokenisation par famille de `tokenizer.ggml.pre`. llama.cpp garde la même table
// (llama_vocab::init_tokenizer) ; on reprend les deux motifs qui couvrent l'immense majorité.
// llama3/llama-bpe se distingue de gpt2 par le regroupement des chiffres par 1 à 3 et la gestion
// des majuscules — un motif faux ne casse pas le décodage mais décale la segmentation, donc la
// qualité. Inconnu → motif gpt2 (le repli de llama.cpp aussi).
const PRE_SPLIT: Record<string, string> = {
	'llama-bpe': "(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",
	'qwen2': "(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",
	'gpt2': "'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",
};

export interface GgufTokenizerInfo {
	tokenizer: BpeTokenizer;
	nVocab: number;
	pre: string;
	bosId: number | null;
	eosId: number | null;
	// Ids marqués « control » par le GGUF (token_type 3) : ce sont les marqueurs de tour. On les
	// remonte pour que l'arrêt de génération ne dépende pas d'ids codés en dur par arch.
	controlIds: number[];
}

// Construit le tokenizer d'un GGUF. null = vocabulaire non couvert (l'appelant garde son repli).
export function tokenizerFromGguf(man: MetaHolder): GgufTokenizerInfo | null {
	const m = man.metadata;
	const model = String(m['tokenizer.ggml.model'] ?? '');
	const tokens = m['tokenizer.ggml.tokens'] as string[] | undefined;
	const merges = m['tokenizer.ggml.merges'] as string[] | undefined;
	if (!Array.isArray(tokens) || !tokens.length) return null;
	// BPE byte-level = un vocab AVEC des merges. Sans merges (SentencePiece pur), notre BpeTokenizer
	// ne sait pas segmenter : mieux vaut rendre null que produire une segmentation fausse.
	if (!Array.isArray(merges) || !merges.length) return null;
	if (model !== 'gpt2' && model !== 'llama') return null;

	const pre = String(m['tokenizer.ggml.pre'] ?? 'gpt2');
	const types = (m['tokenizer.ggml.token_type'] as number[] | undefined) ?? [];
	const bosId = numOrNull(m['tokenizer.ggml.bos_token_id']);
	const eosId = numOrNull(m['tokenizer.ggml.eos_token_id']);
	const addBos = m['tokenizer.ggml.add_bos_token'] === true;

	// token_type ggml : 1 = normal, 2 = inconnu, 3 = contrôle, 4 = ajouté par l'utilisateur,
	// 5 = non utilisé, 6 = octet. Les types 3 et 4 sont les « added tokens » côté HF : ils doivent
	// être reconnus TELS QUELS dans le texte (sans passer par le BPE), sinon « <|eot_id|> » se
	// fragmente et le modèle ne voit jamais son marqueur de fin de tour.
	const vocab: Record<string, number> = {};
	const added: { id: number; content: string; special: boolean }[] = [];
	const controlIds: number[] = [];
	for (let id = 0; id < tokens.length; id++) {
		const tok = tokens[id];
		const ty = types[id] ?? 1;
		if (ty === 3 || ty === 4) {
			added.push({ id, content: tok, special: ty === 3 });
			if (ty === 3) controlIds.push(id);
		} else {
			vocab[tok] = id;
		}
	}

	// Le tokenizer.json que BpeTokenizer attend. `pre_tokenizer` de type Split porte la regex de la
	// famille ; le post-processeur pose le BOS quand le GGUF le demande (add_bos_token).
	const json = {
		version: '1.0',
		added_tokens: added,
		pre_tokenizer: { type: 'Split', pattern: { Regex: PRE_SPLIT[pre] ?? PRE_SPLIT.gpt2 } },
		post_processor: addBos && bosId != null
			? { type: 'TemplateProcessing', single: [{ SpecialToken: { id: tokens[bosId], type_id: 0 } }, { Sequence: { id: 'A', type_id: 0 } }] }
			: undefined,
		model: { type: 'BPE', vocab, merges },
	};

	try {
		return { tokenizer: new BpeTokenizer(json), nVocab: tokens.length, pre, bosId, eosId, controlIds };
	} catch (e) {
		console.warn('[gguf-tok] vocabulaire non consommable par BpeTokenizer. Repli sur le tokenizer HF :', e);
		return null;
	}
}

function numOrNull(v: unknown): number | null {
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}
