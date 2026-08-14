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
export interface PresetModel { name: string; vendor: string; url: string; size: string; sizeBytes: number; desc: string; tokenizer: string; type: ArchType; useCase: { en: string; fr: string }; tags: string[]; mobile: boolean }
export interface TokenizerPreset { name: string; id: string; type: ArchType }

// Preset models suitable for browser WebGPU running.
export const PRESET_MODELS: PresetModel[] = [
	{
		// LFM2.5-230M (moteur v2 hybride conv+attention) : le plus petit modèle du catalogue et le
		// plus fort à ce poids (chat FR propre, extraction, sentiment — bancs 2026-07-21). BRIK q4,
		// tokenizer embarqué. ⚠️ Licence LFM 1.0 (usage commercial libre sous 10 M$ de CA).
		name: 'LFM2.5 230M (BRIK int4)',
		vendor: 'Liquid AI',
		url: 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
		size: '149 Mo',
		sizeBytes: 149_212_720,
		desc: 'Ultra-léger et étonnamment capable : discute correctement (même en français), classe et extrait. Le modèle de la démo /local-ai — idéal mobile ou connexion lente.',
		tokenizer: 'LiquidAI/LFM2.5-230M',
		type: 'lfm2',
		useCase: { en: 'The featherweight', fr: 'L’ultra-léger' },
		tags: ['mobile', 'français', 'hybride v2'],
		mobile: true,
	},
	{
		// RWKV-7 « G1 » 0.1B (moteur v2, 100 % récurrent) : un état fixe (~1 Mo) remplace le cache
		// KV — la mémoire ne grandit pas avec le contexte. Le plus petit du catalogue, Apache-2.0,
		// vocab World embarqué dans le BRIK. Qualité de chat naïve assumée (0.1B).
		name: 'RWKV-7 G1 0.1B (BRIK int4)',
		vendor: 'BlinkDL',
		url: 'https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik',
		size: '128 Mo',
		sizeBytes: 128_470_864,
		desc: 'Attention linéaire (RWKV-7) : un état fixe d’environ 1 Mo remplace le cache KV, la mémoire ne grandit pas avec la conversation. Réponses simples (0.1B) — le plus petit et le plus libre (Apache) du catalogue.',
		tokenizer: '', // vocab World embarqué dans le BRIK (pas de tokenizer HF)
		type: 'rwkv7',
		useCase: { en: 'The smallest', fr: 'Le plus petit' },
		tags: ['mobile', 'récurrent v2', 'apache', 'expérimental'],
		mobile: true,
	},
	{
		// RWKV-7 « G1a » 0.4B : le même moteur récurrent que le 0.1B ci-dessus, mais à une taille où
		// les réponses tiennent vraiment (vérifié en anglais ET en français, 33-36 tok/s de décodage).
		// Il est ici pour une raison précise : c'est la seule alternative APACHE-2.0 crédible au
		// LFM2.5 230M (licence LFM 1.0) pour le défaut mobile et la démo /local-ai — la décision de
		// licence ouverte dans la ROADMAP §0 attendait qu'un candidat existe et soit chargeable.
		name: 'RWKV-7 G1a 0.4B (BRIK int4)',
		vendor: 'BlinkDL',
		url: 'https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik',
		size: '304 Mo',
		sizeBytes: 303_859_168,
		desc: 'Attention linéaire (RWKV-7) à une taille utile : un état fixe remplace le cache KV, donc la mémoire ne grandit pas avec la conversation. Apache-2.0 — le plus permissif du catalogue, sans restriction d’usage commercial.',
		tokenizer: '', // vocab World embarqué dans le BRIK (pas de tokenizer HF)
		type: 'rwkv7',
		useCase: { en: 'Constant memory', fr: 'Mémoire constante' },
		tags: ['mobile', 'récurrent v2', 'apache'],
		mobile: true,
	},
	{
		// BRIK q4 intégral (corps + attention + EMBEDDINGS int4) : 2,53 Go DÉCIMAUX (2 527 863 920 o —
		// même taille que le GGUF Q4_K_M à ~1 % près), mais streamé par plages avec reprise +
		// préchargement, zéro requantification au chargement, tokenizer embarqué, décodage q4 natif
		// (le GGUF partait en f16 ≈ 8 Go VRAM par défaut). Qualité tout-int4 validée en A/B sur le
		// 4B (contrairement au 0.5B, aucun symptôme). Le tier mixte (3,11 Go, attention int8) reste
		// buildable en repli qualité si un usage pointu montrait un écart.
		name: 'Qwen 3 4B (BRIK int4)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik',
		size: '2,53 Go',
		sizeBytes: 2_527_863_920,
		desc: 'La génération suivante : nettement plus fort que Qwen 2.5 à taille égale, et il peut réfléchir (<think>) avant de répondre. Le meilleur cerveau du catalogue — servi en BRIK streamé (reprise, chargement en secondes une fois en cache).',
		tokenizer: 'Qwen/Qwen3-0.6B',
		type: 'qwen3',
		useCase: { en: 'The most capable', fr: 'Le + capable' },
		tags: ['raisonnement', 'généraliste', '<think>'],
		mobile: false,
	},
	{
		name: 'Qwen 3 0.6B (Q8_0)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q8_0.gguf',
		size: '639 Mo',
		sizeBytes: 639_000_000,
		desc: 'Le successeur du 0.5B : aussi léger, sensiblement plus malin, et capable de réfléchir (<think>).',
		tokenizer: 'Qwen/Qwen3-0.6B',
		type: 'qwen3',
		useCase: { en: 'Fast & light', fr: 'Rapide & léger' },
		tags: ['quotidien', 'rapide', '<think>'],
		mobile: true,
	},
	{
		name: 'DeepSeek-R1 Distill Qwen 1.5B (Q4_K_M)',
		vendor: 'DeepSeek',
		url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf',
		size: '1,12 Go',
		sizeBytes: 1_120_000_000,
		desc: 'Raisonne étape par étape (pensée <think>) avant de répondre. Bon pour les énigmes, maths, logique.',
		tokenizer: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
		type: 'deepseek',
		useCase: { en: 'Reasoning', fr: 'Raisonnement' },
		tags: ['logique', 'maths', '<think>'],
		mobile: false,
	},
	{
		name: 'Qwen 2.5 0.5B Instruct (Q8_0)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q8_0.gguf',
		size: '597 Mo',
		sizeBytes: 597_000_000,
		desc: 'Ultra-rapide et économe. Parfait pour les échanges courts du quotidien et tester la vitesse.',
		tokenizer: 'Qwen/Qwen2.5-0.5B-Instruct',
		type: 'qwen',
		useCase: { en: 'Fast & light', fr: 'Rapide & léger' },
		tags: ['quotidien', 'le + rapide'],
		mobile: true,
	},
	{
		name: 'Qwen 2.5 1.5B Instruct (Q4_K_M)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf',
		size: '1,04 Go',
		sizeBytes: 1_040_000_000,
		desc: 'Assistant généraliste équilibré. Bon compromis qualité / vitesse pour discuter au quotidien.',
		tokenizer: 'Qwen/Qwen2.5-1.5B-Instruct',
		type: 'qwen',
		useCase: { en: 'All-rounder', fr: 'Polyvalent' },
		tags: ['chat', 'généraliste'],
		mobile: false,
	},
	{
		name: 'Qwen 2.5 Coder 1.5B Instruct (Q4_K_M)',
		vendor: 'Alibaba',
		url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf',
		size: '1,02 Go',
		sizeBytes: 1_020_000_000,
		desc: 'Spécialisé code : génération, explication, debug, analyse technique.',
		tokenizer: 'Qwen/Qwen2.5-Coder-1.5B-Instruct',
		type: 'qwen',
		useCase: { en: 'Code & dev', fr: 'Code & dev' },
		tags: ['code', 'debug'],
		mobile: false,
	},
	{
		name: 'Llama 3.2 1B Instruct (Q4_K_M)',
		vendor: 'Meta',
		url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
		size: '808 Mo',
		sizeBytes: 808_000_000,
		desc: 'Le Llama de Meta, réparé : lignes Q/K dé-permutées au chargement + RoPE à facteurs (contexte long llama3). Léger et multilingue.',
		tokenizer: 'unsloth/Llama-3.2-1B-Instruct',
		type: 'llama3',
		useCase: { en: 'All-rounder', fr: 'Polyvalent' },
		tags: ['meta', 'multilingue'],
		mobile: false,
	},
	{
		// Portage 2026-07-19 : arch mistral3 = Q/K dé-permutés (RoPE NORM comme llama) + YaRN
		// statique en rope_factors + attnScale mscale² ; la température d'attention par position
		// est l'identité sous 16k de contexte (non implémentée, hors de portée navigateur).
		name: 'Ministral 3 3B Instruct (Q4_K_M)',
		vendor: 'Mistral AI',
		url: 'https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/mistralai_Ministral-3-3B-Instruct-2512-Q4_K_M.gguf',
		size: '2,15 Go',
		sizeBytes: 2_150_000_000,
		desc: 'Le petit Mistral de décembre 2025 : excellent généraliste européen, très bon en français. Tourne sur nos kernels YaRN + RoPE à facteurs.',
		tokenizer: 'unsloth/Ministral-3-3B-Instruct-2512',
		type: 'mistral3',
		useCase: { en: 'All-rounder', fr: 'Polyvalent' },
		tags: ['mistral', 'français', 'européen'],
		mobile: false,
	},
	{
		name: 'Gemma 2 2B Instruct (Q4_K_M)',
		vendor: 'Google',
		url: 'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf',
		size: '1,71 Go',
		sizeBytes: 1_710_000_000,
		desc: 'Modèle Google de qualité, tourne sur nos kernels Gemma 2 (softcap, GELU, doubles normes). Rédaction soignée.',
		tokenizer: 'Xenova/gemma-tokenizer',
		type: 'gemma',
		useCase: { en: 'Writing', fr: 'Rédaction' },
		tags: ['rédaction', 'qualité'],
		mobile: false,
	},
	{
		// Gemma 3 270M — le « LLM instantané » : 253 Mo, chargé en quelques secondes. Premier modèle
		// du catalogue à attention ALTERNÉE (5 couches à fenêtre glissante de 512 pour 1 globale,
		// bases RoPE différentes) — chantier SWA du 2026-08-12. Licence Gemma (usage commercial OK).
		name: 'Gemma 3 270M Instruct (Q4_K_M)',
		vendor: 'Google',
		url: 'https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/main/gemma-3-270m-it-Q4_K_M.gguf',
		size: '253 Mo',
		sizeBytes: 253_100_000,
		desc: 'Le plus petit Gemma : démarre presque instantanément. Attention à fenêtre glissante (5 couches locales / 1 globale). Idéal découverte et mobile.',
		tokenizer: 'unsloth/gemma-3-270m-it',
		type: 'gemma3',
		useCase: { en: 'Good first try', fr: 'Découverte' },
		tags: ['instantané', 'léger'],
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
];
