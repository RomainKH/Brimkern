// BRIK — Brimkern Web Package. A web-optimized REPACK of a GGUF model (NOT a replacement):
// JSON metadata + a runtime profile, tensors in a WGSL-friendly dtype (f16 in v1), 16-byte
// aligned for vec4 loads, sharded per layer for streaming + Cache API. The GGUF path stays the
// default; BRIK is the opt-in "web-focus" fast path. See BRIK_FORMAT.md.

export const BRIK_VERSION = 1;
// Every tensor starts on a 16-byte boundary so it can be read as vec4<f32>/vec4<f16> (128-bit).
export const BRIK_ALIGN = 16;

// Tensor storage dtype on disk. f16/f32 store values directly; q4/q8 are the compact BRIK quants
// (per-32-group int4/int8 + f16 scales) the fused GPU matmuls consume with no f32 expansion —
// small download AND fast inference. v1 shipped f16/f32; q4/q8 are the v2 "web quant" tier.
export type BrikDType = 'f16' | 'f32' | 'q4' | 'q8' | 'q3';

export interface BrikTensorEntry {
	dtype: BrikDType;
	shape: number[];
	nElems: number;
	shard: number;      // index into manifest.shards
	offset: number;     // byte offset within that shard (multiple of BRIK_ALIGN)
	byteLength: number; // encoded length (before alignment padding)
}

// The hyperparameters the engine needs to run the forward pass — lifted out of GGUF's binary KV.
export interface BrikArchProfile {
	arch: string;
	d: number;
	nHeads: number;
	nKvHeads: number;
	headDim: number;
	ffn: number;
	blockCount: number;
	ropeTheta: number;
	rmsEps: number;
	vocab: number;
	// Optional arch-portability knobs, carried so a converted Gemma-class BRIK runs correctly on
	// re-import (absent ⇒ Qwen2/Llama defaults). Mirror ggufParser's Manifest.config.
	attnLogitSoftcap?: number;
	finalLogitSoftcap?: number;
	attnScale?: number;
	act?: 'silu' | 'gelu';
	rmsGainOnePlus?: boolean;
	embedScale?: number;
	// RWKV-7 (moteur v2) : head_size + rangs LoRA du time-mix, portés pour le bloc récurrent.
	rwkv?: { headSize: number; decayLoraRank: number; iclrLoraRank: number; valueLoraRank: number; gateLoraRank: number };
	// LFM2/LFM2.5 (moteur v2, hybride) : fenêtre de la conv courte + têtes KV par couche
	// (0 = bloc shortconv, >0 = bloc attention GQA). Miroir de ggufParser.
	lfm2?: { lCache: number; kvHeadsPerLayer: number[] };
}

export interface BrikShard {
	id: number;
	file: string;
	byteLength: number;
}

export interface BrikManifest {
	format: 'brik';
	version: number;
	// uiArch: the engine's UI architecture tag (stop-token + chat-template heuristics) — lets a
	// re-imported BRIK skip the manual arch dropdown. Optional / forward-compatible.
	model: { name: string; quantSource?: string; uiArch?: string };
	arch: BrikArchProfile;
	chat: { template: string; stopTokenIds: number[]; bosTokenId?: number; eosTokenId?: number };
	// 'hf-hub' → loaded over the network by id at runtime. 'embedded' → `json` (tokenizer.json) and
	// `config` (tokenizer_config.json) are stored verbatim IN the package, so the model loads fully
	// offline with no HF fetch and no manual tokenizer pick. `id` is kept either way (fallback / label).
	tokenizer: { kind: 'hf-hub' | 'embedded'; id?: string; json?: string; config?: string };
	shards: BrikShard[];
	tensors: Record<string, BrikTensorEntry>;
	// BRIK image (model.uiArch === 'image') : le fichier transporte sa propre config UNet (topologie
	// diffusers → UnetCfg) — l'app n'a pas à connaître chaque modèle. Absent sur les BRIK LLM.
	image?: { unetCfg?: Record<string, unknown> };
}

// Round a byte length up to the next BRIK_ALIGN boundary.
export function alignUp(n: number, align: number = BRIK_ALIGN): number {
	return Math.ceil(n / align) * align;
}

// ── Validation d'un manifeste ARBITRAIRE ──────────────────────────────────────────────────────
// `parseBrikHeader` fait un JSON.parse sur un fichier distant : tout ce qui en sort est une entrée
// non fiable, et ces nombres partent ensuite dimensionner des tampons GPU et des plages HTTP. En
// JavaScript rien n'est corruptible en mémoire (pas de lecture hors borne exploitable), mais sans
// bornes un `blockCount: 1e9` ou un `byteLength: 2**53` tue l'onglet ou perd le device — le tout
// derrière un message opaque. On vérifie donc la FORME et la PLAUSIBILITÉ, pas la sémantique :
// un modèle bizarre reste chargeable, un manifeste absurde est refusé net avec la raison.
//
// La vérification qui compte vraiment est la dernière : chaque tenseur doit tenir DANS son shard.
// C'est elle qui garantit qu'aucune lecture planifiée ne sort de la zone de données annoncée.

const MAX_SHARDS = 4096;
const MAX_TENSORS = 200_000;
const MAX_BYTES = 64 * 1024 * 1024 * 1024;   // 64 Go : au-delà, ce n'est plus un modèle web
const DTYPES: BrikDType[] = ['f16', 'f32', 'q4', 'q8', 'q3'];
// Un id de tokenizer part dans AutoTokenizer.from_pretrained → une requête réseau. Un manifeste
// hostile pouvait ainsi faire charger le tokenizer d'un dépôt tiers, ou remonter des chemins.
// Deux formes acceptées, et rien d'autre :
//   « auteur/dépôt »  → un dépôt Hugging Face (Xenova/qwen-tokenizer)
//   « slug »          → une SENTINELLE interne, sans réseau : les BRIK RWKV-7 en ligne portent
//                       `id: 'rwkv-world'` pour dire « vocab World embarqué » (vérifié le 2026-08-19
//                       sur les deux BRIK publiés — un validateur écrit sans regarder les fichiers
//                       réels les aurait rendus inchargeables).
// Sont donc refusés : les URLs (`https://…`), les chemins absolus, la remontée `..`, et tout ce qui
// compte plus d'une barre oblique.
const RE_SEGMENT = /^[A-Za-z0-9._-]+$/;

export function isValidTokenizerId(id: string): boolean {
	if (id.length > 128 || id.includes('..')) return false;
	const parts = id.split('/');
	return parts.length <= 2 && parts.every((p) => RE_SEGMENT.test(p));
}

const entier = (v: unknown, max: number): boolean =>
	typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= max;

/** Lève sur un manifeste malformé ou aux valeurs invraisemblables. Retourne le manifeste tel quel. */
export function validateBrikManifest(m: BrikManifest): BrikManifest {
	// Annotation explicite sur la VARIABLE (pas seulement sur le retour de la lambda) : c'est ce qui
	// permet à TypeScript de comprendre qu'un appel à `ko` interrompt le flux, et donc de narrower
	// après un `if (x === undefined) ko(…)`.
	const ko: (raison: string) => never = (raison) => { throw new Error(`BRIK: manifeste invalide — ${raison}`); };
	if (!m || typeof m !== 'object') ko('ce n\'est pas un objet');
	if (m.format !== 'brik') ko(`champ format « ${String(m.format)} » (attendu « brik »)`);
	if (!entier(m.version, 1024) || m.version < 1) ko(`version ${String(m.version)}`);
	if (!m.model || typeof m.model.name !== 'string' || m.model.name.length > 512) ko('champ model.name');

	const a = m.arch;
	if (!a || typeof a !== 'object' || typeof a.arch !== 'string' || a.arch.length > 64) ko('champ arch.arch');
	// Bornes larges : un modèle réel les respecte de plusieurs ordres de grandeur (les BRIK image
	// portent d'ailleurs des zéros partout — leur topologie vit dans `image.unetCfg`).
	for (const [clef, max] of [['d', 262144], ['nHeads', 4096], ['nKvHeads', 4096], ['headDim', 4096],
		['ffn', 1_048_576], ['blockCount', 1024], ['vocab', 10_000_000]] as const) {
		if (!entier(a[clef], max)) ko(`arch.${clef} = ${String(a[clef])}`);
	}
	for (const clef of ['ropeTheta', 'rmsEps'] as const) {
		if (typeof a[clef] !== 'number' || !Number.isFinite(a[clef])) ko(`arch.${clef} = ${String(a[clef])}`);
	}

	if (m.tokenizer) {
		if (m.tokenizer.kind !== 'hf-hub' && m.tokenizer.kind !== 'embedded') ko(`tokenizer.kind « ${String(m.tokenizer.kind)} »`);
		// `id` vide/absent est normal (vocab embarqué, ou BRIK image sans tokenizer).
		if (m.tokenizer.id && !isValidTokenizerId(m.tokenizer.id)) ko(`tokenizer.id « ${m.tokenizer.id} » (attendu : « auteur/dépôt » ou une sentinelle sans barre oblique)`);
	}

	if (!Array.isArray(m.shards) || m.shards.length === 0 || m.shards.length > MAX_SHARDS) ko(`${Array.isArray(m.shards) ? m.shards.length : 'aucun'} shard`);
	const tailleShard = new Map<number, number>();
	for (const sh of m.shards) {
		if (!entier(sh.id, MAX_SHARDS)) ko(`shard.id = ${String(sh.id)}`);
		if (tailleShard.has(sh.id)) ko(`shard ${sh.id} déclaré deux fois`);
		if (typeof sh.file !== 'string' || sh.file.length > 256) ko(`shard.file du shard ${sh.id}`);
		if (!entier(sh.byteLength, MAX_BYTES)) ko(`shard.byteLength du shard ${sh.id} = ${String(sh.byteLength)}`);
		tailleShard.set(sh.id, sh.byteLength);
	}

	if (!m.tensors || typeof m.tensors !== 'object') ko('champ tensors');
	const noms = Object.keys(m.tensors);
	if (noms.length === 0 || noms.length > MAX_TENSORS) ko(`${noms.length} tenseurs`);
	let total = 0;
	for (const nom of noms) {
		const t = m.tensors[nom];
		if (!t || typeof t !== 'object') ko(`tenseur ${nom}`);
		if (!DTYPES.includes(t.dtype)) ko(`dtype « ${String(t.dtype)} » du tenseur ${nom}`);
		if (!Array.isArray(t.shape) || t.shape.length > 8 || !t.shape.every((d) => entier(d, 2 ** 32))) ko(`shape du tenseur ${nom}`);
		if (!entier(t.nElems, 2 ** 40)) ko(`nElems du tenseur ${nom}`);
		if (!entier(t.offset, MAX_BYTES) || !entier(t.byteLength, MAX_BYTES)) ko(`offset/byteLength du tenseur ${nom}`);
		const taille = tailleShard.get(t.shard);
		if (taille === undefined) ko(`le tenseur ${nom} référence le shard ${String(t.shard)}, absent du manifeste`);
		// LA vérification : aucune lecture planifiée ne peut sortir de son shard.
		if (t.offset + t.byteLength > taille) ko(`le tenseur ${nom} dépasse son shard (${t.offset}+${t.byteLength} > ${taille})`);
		total += t.byteLength;
	}
	if (total > MAX_BYTES) ko(`${total} octets de tenseurs au total`);
	return m;
}
