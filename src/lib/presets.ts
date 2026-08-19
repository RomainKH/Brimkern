// Shared model + tokenizer presets and the UI architecture tag, used by the main app and the
// standalone /convert page.

export type ArchType = 'qwen' | 'qwen3' | 'llama3' | 'llama2' | 'gemma' | 'gemma3' | 'smollm3' | 'deepseek' | 'mistral3' | 'lfm2' | 'rwkv7';

// `useCase`: a short capability label shown as a badge so the picker reads like modern model
// catalogs ("for X"). BILINGUE depuis le 2026-08-13 : ces badges étaient en français dans un
// catalogue de données, donc l'anglais — la version canonique du site — affichait « L'ultra-léger »
// et « Rapide & léger » au milieu d'une interface anglaise (relevé sur les captures du README).
// `tags`: a few quick descriptors. `mobile`: light enough to attempt on a
// phone's limited GPU/VRAM — the picker hides the rest on mobile by default.
// `size`: human display string (decimal Go/Mo, matches Finder/HF) — n'est PLUS ce qu'affichent les
// cartes : elles formatent `sizeBytes` selon la locale (cf. fmtModelSize). `sizeBytes`: the SAME
// size as a number, also used for the download-time estimate — approximate is fine, it never gates
// loading.
export interface PresetModel { name: string; vendor: string; url: string; size: string; sizeBytes: number; desc: { en: string; fr: string }; tokenizer: string; type: ArchType; useCase: { en: string; fr: string }; tags: { en: string; fr: string }[]; mobile: boolean }
export interface TokenizerPreset { name: string; id: string; type: ArchType }

// Preset models suitable for browser WebGPU running.
export const PRESET_MODELS: PresetModel[] = [
	{
		name: 'DeepSeek-R1 Distill Qwen 1.5B (Q4_K_M)',
		vendor: 'DeepSeek',
		url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf',
		size: '1,12 Go',
		sizeBytes: 1_120_000_000,
		desc: {
			en: 'Reasons step-by-step (<think>) before answering. Excellent for puzzles, math, and logic.',
			fr: 'Raisonne étape par étape (pensée <think>) avant de répondre. Bon pour les énigmes, maths, logique.'
		},
		tokenizer: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
		type: 'deepseek',
		useCase: { en: 'Reasoning', fr: 'Raisonnement' },
		tags: [{ en: 'logic', fr: 'logique' }, { en: 'math', fr: 'maths' }, { en: '<think>', fr: '<think>' }],
		mobile: false,
	},
	{
		name: 'Qwen 3 4B (BRIK int4)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik',
		size: '2,53 Go',
		sizeBytes: 2_527_863_920,
		desc: {
			en: 'Next-generation intelligence: substantially smarter than Qwen 2.5 and reasons (<think>) before answering. Streamed BRIK format.',
			fr: 'La génération suivante : nettement plus fort que Qwen 2.5 à taille égale, et il peut réfléchir (<think>) avant de répondre. Le meilleur cerveau du catalogue : servi en BRIK streamé.'
		},
		tokenizer: 'Qwen/Qwen3-0.6B',
		type: 'qwen3',
		useCase: { en: 'The most capable', fr: 'Le + capable' },
		tags: [{ en: 'reasoning', fr: 'raisonnement' }, { en: 'generalist', fr: 'généraliste' }, { en: '<think>', fr: '<think>' }],
		mobile: false,
	},
	{
		name: 'Ministral 3 3B Instruct (Q4_K_M)',
		vendor: 'Mistral AI',
		url: 'https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/mistralai_Ministral-3-3B-Instruct-2512-Q4_K_M.gguf',
		size: '2,15 Go',
		sizeBytes: 2_150_000_000,
		desc: {
			en: 'Compact Mistral model: excellent European generalist, fluent in French and English.',
			fr: 'Le petit Mistral de décembre 2025 : excellent généraliste européen, très bon en français.'
		},
		tokenizer: 'unsloth/Ministral-3-3B-Instruct-2512',
		type: 'mistral3',
		useCase: { en: 'All-rounder', fr: 'Polyvalent' },
		tags: [{ en: 'mistral', fr: 'mistral' }, { en: 'french', fr: 'français' }, { en: 'european', fr: 'européen' }],
		mobile: false,
	},
	{
		name: 'Qwen 2.5 Coder 1.5B Instruct (Q4_K_M)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf',
		size: '1,12 Go',
		sizeBytes: 1_117_320_768,
		desc: {
			en: 'Specialized for code: generation, explanation, debugging, and technical analysis.',
			fr: 'Spécialisé code : génération, explication, debug, analyse technique.'
		},
		tokenizer: 'Qwen/Qwen2.5-Coder-1.5B-Instruct',
		type: 'qwen',
		useCase: { en: 'Code & dev', fr: 'Code & dev' },
		tags: [{ en: 'code', fr: 'code' }, { en: 'debug', fr: 'debug' }],
		mobile: false,
	},
	{
		name: 'DeepSeek-R1 Distill Qwen 7B (Q4_K_M)',
		vendor: 'DeepSeek',
		url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-7B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-7B-Q4_K_M.gguf',
		size: '4,68 Go',
		sizeBytes: 4_683_073_504,
		desc: {
			en: 'Largest model in the catalog. Deep reasoning (<think>) with 7B depth. Streamed in chunks and cached.',
			fr: 'Le plus gros du catalogue. Raisonne (<think>) avant de répondre, avec la profondeur d’un 7B. Streamé par plages et mis en cache.'
		},
		tokenizer: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
		type: 'deepseek',
		useCase: { en: 'Reasoning (large)', fr: 'Raisonnement (gros)' },
		tags: [{ en: 'logic', fr: 'logique' }, { en: 'large', fr: 'gros' }, { en: '<think>', fr: '<think>' }],
		mobile: false,
	},
	{
		name: 'Gemma 2 2B Instruct (Q4_K_M)',
		vendor: 'Google',
		url: 'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf',
		size: '1,71 Go',
		sizeBytes: 1_710_000_000,
		desc: {
			en: 'High quality Google model running on our Gemma 2 kernels (softcap, GELU, dual norms). Excellent writing.',
			fr: 'Modèle Google de qualité, tourne sur nos kernels Gemma 2 (softcap, GELU, doubles normes). Rédaction soignée.'
		},
		tokenizer: 'Xenova/gemma-tokenizer',
		type: 'gemma',
		useCase: { en: 'Writing', fr: 'Rédaction' },
		tags: [{ en: 'writing', fr: 'rédaction' }, { en: 'quality', fr: 'qualité' }],
		mobile: false,
	},
	{
		name: 'LFM2.5 230M (BRIK int4)',
		vendor: 'Liquid AI',
		url: 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
		size: '149 Mo',
		sizeBytes: 149_212_720,
		desc: {
			en: 'Ultra-light and capable: chats cleanly (including in French), classifies, and extracts. Ideal for mobile or slow connections.',
			fr: 'Ultra-léger et étonnamment capable : discute correctement (même en français), classe et extrait. Idéal mobile ou connexion lente.'
		},
		tokenizer: 'LiquidAI/LFM2.5-230M',
		type: 'lfm2',
		useCase: { en: 'The featherweight', fr: 'L’ultra-léger' },
		tags: [{ en: 'mobile', fr: 'mobile' }, { en: 'french', fr: 'français' }, { en: 'hybrid v2', fr: 'hybride v2' }],
		mobile: true,
	},
	{
		name: 'Qwen 3 0.6B (Q8_0)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q8_0.gguf',
		size: '639 Mo',
		sizeBytes: 639_000_000,
		desc: {
			en: 'Successor to the 0.5B: just as lightweight, noticeably smarter, and able to think (<think>).',
			fr: 'Le successeur du 0.5B : aussi léger, sensiblement plus malin, et capable de réfléchir (<think>).'
		},
		tokenizer: 'Qwen/Qwen3-0.6B',
		type: 'qwen3',
		useCase: { en: 'Fast & light', fr: 'Rapide & léger' },
		tags: [{ en: 'daily', fr: 'quotidien' }, { en: 'fast', fr: 'rapide' }, { en: '<think>', fr: '<think>' }],
		mobile: true,
	},
	{
		name: 'Llama 3.2 1B Instruct (Q4_K_M)',
		vendor: 'Meta',
		url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
		size: '808 Mo',
		sizeBytes: 808_000_000,
		desc: {
			en: 'Meta’s Llama model: lightweight and multilingual with extended context.',
			fr: 'Le Llama de Meta, réparé : lignes Q/K dé-permutées au chargement + RoPE à facteurs. Léger et multilingue.'
		},
		tokenizer: 'unsloth/Llama-3.2-1B-Instruct',
		type: 'llama3',
		useCase: { en: 'All-rounder', fr: 'Polyvalent' },
		tags: [{ en: 'meta', fr: 'meta' }, { en: 'multilingual', fr: 'multilingue' }],
		mobile: false,
	},
	{
		name: 'SmolLM3 3B (Q4_K_M)',
		vendor: 'Hugging Face',
		url: 'https://huggingface.co/bartowski/HuggingFaceTB_SmolLM3-3B-GGUF/resolve/main/HuggingFaceTB_SmolLM3-3B-Q4_K_M.gguf',
		size: '1,92 Go',
		sizeBytes: 1_915_305_792,
		desc: {
			en: 'Hugging Face 3B model, trained end-to-end openly. Uses NoPE (1 in 4 layers without RoPE) for long context.',
			fr: 'Le 3B de Hugging Face, entraîné en ouvert de bout en bout. Une couche sur quatre se passe de RoPE (NoPE).'
		},
		tokenizer: 'HuggingFaceTB/SmolLM3-3B',
		type: 'smollm3',
		useCase: { en: 'All-rounder', fr: 'Polyvalent' },
		tags: [{ en: 'open', fr: 'ouvert' }, { en: 'multilingual', fr: 'multilingue' }, { en: 'long context', fr: 'contexte long' }],
		mobile: false,
	},
	{
		name: 'Qwen 2.5 1.5B Instruct (Q4_K_M)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf',
		size: '1,12 Go',
		sizeBytes: 1_117_320_736,
		desc: {
			en: 'Balanced all-round assistant. Great balance of quality and speed for everyday conversations.',
			fr: 'Assistant généraliste équilibré. Bon compromis qualité / vitesse pour discuter au quotidien.'
		},
		tokenizer: 'Qwen/Qwen2.5-1.5B-Instruct',
		type: 'qwen',
		useCase: { en: 'All-rounder', fr: 'Polyvalent' },
		tags: [{ en: 'chat', fr: 'chat' }, { en: 'generalist', fr: 'généraliste' }],
		mobile: false,
	},
	{
		name: 'Gemma 3 270M Instruct (Q4_K_M)',
		vendor: 'Google',
		url: 'https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/main/gemma-3-270m-it-Q4_K_M.gguf',
		size: '253 Mo',
		sizeBytes: 253_100_000,
		desc: {
			en: 'Smallest Gemma: loads almost instantly with sliding window attention. Ideal for mobile and first try.',
			fr: 'Le plus petit Gemma : démarre presque instantanément. Attention à fenêtre glissante. Idéal découverte et mobile.'
		},
		tokenizer: 'unsloth/gemma-3-270m-it',
		type: 'gemma3',
		useCase: { en: 'Good first try', fr: 'Découverte' },
		tags: [{ en: 'instant', fr: 'instantané' }, { en: 'lightweight', fr: 'léger' }],
		mobile: true,
	},
	{
		name: 'Qwen 2.5 0.5B Instruct (Q8_0)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q8_0.gguf',
		size: '676 Mo',
		sizeBytes: 675_710_816,
		desc: {
			en: 'Ultra-fast and economical. Perfect for quick daily interactions and testing speed.',
			fr: 'Ultra-rapide et économe. Parfait pour les échanges courts du quotidien et tester la vitesse.'
		},
		tokenizer: 'Qwen/Qwen2.5-0.5B-Instruct',
		type: 'qwen',
		useCase: { en: 'Fast & light', fr: 'Rapide & léger' },
		tags: [{ en: 'daily', fr: 'quotidien' }, { en: 'fastest', fr: 'le + rapide' }],
		mobile: true,
	},
	{
		name: 'RWKV-7 G1a 0.4B (BRIK int4)',
		vendor: 'BlinkDL',
		url: 'https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik',
		size: '304 Mo',
		sizeBytes: 303_859_168,
		desc: {
			en: 'Linear attention (RWKV-7) at a practical size: constant memory replaces KV cache. Apache-2.0 open license.',
			fr: 'Attention linéaire (RWKV-7) à une taille utile : un état fixe remplace le cache KV, donc la mémoire ne grandit pas avec la conversation. Apache-2.0 : le plus permissif du catalogue.'
		},
		tokenizer: '',
		type: 'rwkv7',
		useCase: { en: 'Constant memory', fr: 'Mémoire constante' },
		tags: [{ en: 'mobile', fr: 'mobile' }, { en: 'recurrent v2', fr: 'récurrent v2' }, { en: 'apache', fr: 'apache' }],
		mobile: true,
	},
	{
		name: 'RWKV-7 G1 0.1B (BRIK int4)',
		vendor: 'BlinkDL',
		url: 'https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik',
		size: '128 Mo',
		sizeBytes: 128_470_864,
		desc: {
			en: 'Linear attention (RWKV-7): constant ~1 MB state replaces the KV cache. Smallest and most open (Apache 2.0) in the catalog.',
			fr: 'Attention linéaire (RWKV-7) : un état fixe d’environ 1 Mo remplace le cache KV, la mémoire ne grandit pas avec la conversation. Réponses simples (0.1B) : le plus petit et le plus libre (Apache) du catalogue.'
		},
		tokenizer: '',
		type: 'rwkv7',
		useCase: { en: 'The smallest', fr: 'Le plus petit' },
		tags: [{ en: 'mobile', fr: 'mobile' }, { en: 'recurrent v2', fr: 'récurrent v2' }, { en: 'apache', fr: 'apache' }],
		mobile: true,
	},
];

export const TOKENIZER_PRESETS: TokenizerPreset[] = [
	{ name: 'DeepSeek-R1 Distill (Qwen)', id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B', type: 'deepseek' },
	{ name: 'Qwen 3', id: 'Qwen/Qwen3-0.6B', type: 'qwen3' },
	{ name: 'Qwen 2 / 2.5', id: 'Qwen/Qwen2.5-0.5B-Instruct', type: 'qwen' },
	{ name: 'Gemma 2', id: 'Xenova/gemma-tokenizer', type: 'gemma' },
	// Llama 3.x RÉINTÉGRÉ (2026-07-18) : dé-permutation Q/K au chargement + rope_freqs.weight —
	// cf. model.ts maybeUnpermuteLlamaQk. (Llama 2/Mistral 7B, arch `llama` aussi, devraient marcher
	// via import URL — vocab 32k, tokenizer à choisir manuellement.)
	{ name: 'Llama 3 / 3.2', id: 'unsloth/Llama-3.2-1B-Instruct', type: 'llama3' },
	{ name: 'Ministral 3 (Tekken)', id: 'unsloth/Ministral-3-3B-Instruct-2512', type: 'mistral3' },
	// SmolLM3 : le GGUF porte son propre tokenizer (lu par ggufTokenizer depuis le 2026-08-13), donc
	// cette entrée ne sert que de REPLI réseau et au choix manuel après un import d'URL.
	{ name: 'SmolLM3', id: 'HuggingFaceTB/SmolLM3-3B', type: 'smollm3' },
];
