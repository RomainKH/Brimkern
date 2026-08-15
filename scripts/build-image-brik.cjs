#!/usr/bin/env node
// Build BRIK image : safetensors (UNet / CLIP diffusers) → .brik pré-quantifié streamable.
//
//   npm run build:image-brik -- <modele> <tier>
//     modele ∈ { sdturbo-unet, sdturbo-clip, sdxs-unet }
//     tier   ∈ { q8, mixed, light }        (CLIP : q8 conseillé)
//
// Pourquoi : le pipeline image téléchargeait du fp16 (UNet 1,73 Go + CLIP 681 Mo) puis quantifiait
// en q8 SUR LE GPU à chaque chargement — on transportait 2 octets/param pour en jeter la moitié.
// Ici on quantifie UNE FOIS hors-ligne avec le codec CPU (bit-identique au kernel GPU quantize_q8 :
// les deux arrondissent contre le scale re-décodé f16) et on sert les codes : téléchargement ÷2 (q8)
// et plus de passe de quantification au chargement.
//
// Tiers (partition par SHAPE, qui recopie exactement la partition de sdturbo.ts *ToGpu) :
//   q8    : poids 2D (linear) et 4D (conv) → q8 ; norms/biais (1D) → f16 ; protégés → f16.
//   mixed : linear → q4, conv → q8 (le dispatch matmul accepte q4 nativement ; conv q4 = kernel dédié).
//   light : linear ET conv → q4 (exige le kernel conv2d_direct_q4 — tier mobile, à valider en A/B).
//   Protégés (toujours f16, comme le f32 du chargeur actuel) : conv_in/conv_out (prédit eps),
//   embeddings CLIP (gather CPU), tout tenseur à nElems % 32 ≠ 0.
//
// Conteneur : BRIK standard (magic/manifeste/shards) avec les NOMS SAFETENSORS comme clés — le
// runtime image mappe nom→champ via loadUnetWeights/loadClipWeights, pas la convention GGUF blk.N.
// Un shard par unité (resnet / attention / sampler / couche CLIP) → le chargeur streame une plage
// HTTP par shard (10-40 Mo), cache + reprise hérités de fetchRange. manifest.model.uiArch = 'image'
// (garde-fou : le chargeur LLM refuse ces fichiers).
//
// Prérequis : `npm run build:image-brik` compile d'abord src/lib/brik/*.ts + src/lib/safetensors.ts
// dans .brik-build/ (comme build-mobile-brik).

const fs = require('fs');
const path = require('path');
const { quantizeQ8, packQ8 } = require('../.brik-build/brik/q8web.js');
const { quantizeQ4, packQ4 } = require('../.brik-build/brik/q4web.js');
const { packShard } = require('../.brik-build/brik/codec.js');
const { serializeBrik } = require('../.brik-build/brik/container.js');
const { parseSafetensors, toF32 } = require('../.brik-build/safetensors.js');
const { f32ToF16Bits } = require('../.brik-build/brik/f16.js');

const MODELS = {
	'sdturbo-unet': {
		url: 'https://huggingface.co/stabilityai/sd-turbo/resolve/main/unet/diffusion_pytorch_model.fp16.safetensors',
		out: (tier) => `sd-turbo-unet-${tier}.brik`,
		name: 'SD-Turbo UNet',
		// = SD_TURBO_UNET (sdturbo.ts) — le BRIK est auto-descripteur, l'app fusionne sur ses défauts.
		unetCfg: { baseC: 320, mult: [1, 2, 4, 4], layersPerBlock: 2, attn: [true, true, true, false], headDim: 64 },
	},
	'sdturbo-clip': {
		url: 'https://huggingface.co/stabilityai/sd-turbo/resolve/main/text_encoder/model.fp16.safetensors',
		out: (tier) => `sd-turbo-clip-${tier}.brik`,
		name: 'SD-Turbo CLIP (OpenCLIP-H text)',
	},
	'sdxs-unet': {
		url: 'https://huggingface.co/IDKiro/sdxs-512-0.9/resolve/main/unet/diffusion_pytorch_model.safetensors',
		out: (tier) => `sdxs-unet-${tier}.brik`,
		name: 'SDXS-512 UNet (distillé, 1 step)',
		// SOURCE DE VÉRITÉ de la topologie SDXS (le runtime la lit depuis le manifeste du BRIK) :
		// 3 niveaux, 1 resblock/niveau, pas de mid-block, 8 têtes FIXES par niveau.
		unetCfg: { baseC: 320, mult: [1, 2, 4], layersPerBlock: 1, attn: [true, true, true], headDim: 64, fixedHeads: 8, noMid: true },
	},
	// ── Chantier VIDÉO (AnimateDiff-Lightning sur base SD 1.5) — docs/video-gen-feasibility.md ──
	// Base epiCRealism (SD 1.5 fine-tunée, recommandée par ByteDance pour Lightning) : UNet 4 niveaux,
	// 2 resblocks, attention partout sauf au dernier niveau, 8 têtes FIXES, cross-attn 768 (CLIP-L).
	'video-unet': {
		url: 'https://huggingface.co/emilianJR/epiCRealism/resolve/main/unet/diffusion_pytorch_model.safetensors',
		out: (tier) => `video-unet-${tier}.brik`,
		name: 'epiCRealism UNet (SD 1.5, base vidéo)',
		unetCfg: { baseC: 320, mult: [1, 2, 4, 4], layersPerBlock: 2, attn: [true, true, true, false], headDim: 64, fixedHeads: 8 },
	},
	'video-clip': {
		url: 'https://huggingface.co/emilianJR/epiCRealism/resolve/main/text_encoder/model.safetensors',
		out: (tier) => `video-clip-${tier}.brik`,
		name: 'epiCRealism CLIP-L (SD 1.5 text, 768/12)',
	},
	// Module MOTION : 21 modules (down/mid/up), 453,8 M params — LayerNorms + projections + 2
	// attentions TEMPORELLES + FFN GEGLU + pos_embed [1,32,320] par module. Tout est multiple de 32.
	'video-motion': {
		url: 'https://huggingface.co/ByteDance/AnimateDiff-Lightning/resolve/main/animatediff_lightning_4step_diffusers.safetensors',
		out: (tier) => `video-motion-${tier}.brik`,
		name: 'AnimateDiff-Lightning 4-step (module motion)',
	},
};

const modelKey = process.argv[2];
const tier = process.argv[3] || 'q8';
if (!MODELS[modelKey] || !['q8', 'mixed', 'light'].includes(tier)) {
	console.error('Usage: node scripts/build-image-brik.cjs <sdturbo-unet|sdturbo-clip|sdxs-unet> <q8|mixed|light>');
	process.exit(1);
}
const MODEL = MODELS[modelKey];

// ── Téléchargement (cache disque .brik-build/, reprise = re-lancer) ─────────────────────────────
async function ensureSource() {
	const dst = path.join(__dirname, '..', '.brik-build', `${modelKey}-src.safetensors`);
	if (fs.existsSync(dst) && fs.statSync(dst).size > 1e6) {
		console.log(`source en cache : ${dst} (${(fs.statSync(dst).size / 1e6).toFixed(0)} Mo)`);
		return dst;
	}
	console.log(`téléchargement ${MODEL.url} …`);
	const resp = await fetch(MODEL.url);
	if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
	const total = Number(resp.headers.get('content-length') || 0);
	const file = fs.createWriteStream(dst);
	let done = 0, lastPct = -1;
	for await (const chunk of resp.body) {
		file.write(chunk);
		done += chunk.length;
		const pct = total ? Math.floor((done / total) * 100) : 0;
		if (pct !== lastPct && pct % 5 === 0) { lastPct = pct; process.stdout.write(`\r  ${pct}% (${(done / 1e6).toFixed(0)} Mo)`); }
	}
	await new Promise((r) => file.end(r));
	console.log('\n  ok');
	return dst;
}

// ── Choix du dtype par tenseur — REFLÈTE la partition de sdturbo.ts (*ToGpu) ────────────────────
// Protégés f16 : conv_in/out (le chargeur actuel les garde f32 exprès : conv_out prédit eps),
// embeddings CLIP (toF32 CPU pour le gather). 1D (norms/biais) = f16 (uploadGpu accepte {f16,n}).
function chooseDType(name, shape, nElems) {
	if (shape.length < 2) return 'f16';
	if (name === 'conv_in.weight' || name === 'conv_out.weight') return 'f16';
	// Embedding de position temporel du module motion (minuscule, précision-sensible) : f16.
	if (name.endsWith('pos_embed.pe')) return 'f16';
	// Embeddings CLIP : consommés CPU (gather) — le token embedding (101 Mo f16) passe en q8 et le
	// chargeur le déquantifie en JS (~50M élém., rapide) ; le position embedding minuscule reste f16.
	if (name === 'text_model.embeddings.token_embedding.weight') return nElems % 32 === 0 ? 'q8' : 'f16';
	if (name.startsWith('text_model.embeddings.')) return 'f16';
	if (nElems % 32 !== 0) return 'f16';
	const isConv = shape.length === 4;
	if (tier === 'q8') return 'q8';
	if (tier === 'mixed') return isConv ? 'q8' : 'q4';
	return 'q4'; // light
}

// ── Groupement en shards : une unité réseau par shard (plage HTTP de 5-40 Mo au chargement) ─────
function shardKey(name) {
	let m = name.match(/^(down_blocks\.\d+\.(?:resnets|attentions|downsamplers|motion_modules)\.\d+)\./);
	if (m) return m[1];
	m = name.match(/^(up_blocks\.\d+\.(?:resnets|attentions|upsamplers|motion_modules)\.\d+)\./);
	if (m) return m[1];
	m = name.match(/^(mid_block\.(?:resnets|attentions|motion_modules)\.\d+)\./);
	if (m) return m[1];
	m = name.match(/^(text_model\.encoder\.layers\.\d+)\./);
	if (m) return m[1];
	return 'shared';
}

(async () => {
	const src = await ensureSource();
	console.log('parsing safetensors…');
	// Lecture CHUNKÉE : readFileSync plafonne à 2 Gio (ERR_FS_FILE_TOO_LARGE) — le UNet SD 1.5
	// fp32 (video-unet, 3,4 Go) le dépasse. Buffer.allocUnsafe accepte ~4 Gio sur Node 64 bits.
	const size = fs.statSync(src).size;
	const buf = Buffer.allocUnsafe(size);
	{ const fd = fs.openSync(src, 'r'); const CH = 1 << 30; for (let o = 0; o < size; o += CH) fs.readSync(fd, buf, o, Math.min(CH, size - o), o); fs.closeSync(fd); }
	const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
	const st = parseSafetensors(ab, { keepF16: true });
	console.log(`  ${st.size} tenseurs`);

	// Partition + encodage par tenseur, groupés par shard.
	const byShard = new Map(); // key → TensorToPack[]
	const stats = { q8: 0, q4: 0, f16: 0, srcBytes: 0, outBytes: 0 };
	for (const [name, t] of st) {
		const nElems = t.data instanceof Float32Array ? t.data.length : t.data.n;
		const srcBytes = t.data instanceof Float32Array ? nElems * 4 : nElems * 2;
		stats.srcBytes += srcBytes;
		const dtype = chooseDType(name, t.shape, nElems);
		let entry;
		if (dtype === 'f16') {
			// Source déjà f16 → bytes tels quels (zéro conversion) ; source f32 (SDXS) → arrondi f16.
			let bytes;
			if (t.data instanceof Float32Array) {
				const u16 = new Uint16Array(nElems);
				for (let i = 0; i < nElems; i++) u16[i] = f32ToF16Bits(t.data[i]);
				bytes = new Uint8Array(u16.buffer);
			} else {
				bytes = t.data.f16;
			}
			entry = { name, dtype: 'f16', shape: t.shape, bytes, nElems };
			stats.f16 += bytes.length;
		} else {
			const f32 = toF32(t.data);
			const bytes = dtype === 'q8' ? packQ8(quantizeQ8(f32)) : packQ4(quantizeQ4(f32));
			entry = { name, dtype, shape: t.shape, bytes, nElems };
			stats[dtype] += bytes.length;
		}
		stats.outBytes += entry.bytes.length;
		const key = shardKey(name);
		if (!byShard.has(key)) byShard.set(key, []);
		byShard.get(key).push(entry);
	}

	// shared = shard 0, puis les unités en ordre stable (ordre du fichier ≈ ordre du forward).
	// NB : le module motion (video-motion) n'a AUCUN tenseur hors unité → pas de shard « shared ».
	const keys = ['shared', ...[...byShard.keys()].filter((k) => k !== 'shared')].filter((k) => byShard.has(k));
	const shards = [];
	const shardMetas = [];
	const tensors = {};
	keys.forEach((key, id) => {
		const { buffer, entries } = packShard(byShard.get(key), id);
		shards.push({ file: `${key}.bin`, bytes: buffer });
		shardMetas.push({ id, file: `${key}.bin`, byteLength: buffer.length });
		Object.assign(tensors, entries);
	});

	// Manifeste : conteneur BRIK standard ; les champs LLM (arch/chat/tokenizer) sont des
	// placeholders inertes — le chargeur image ne lit que model/shards/tensors, et le chargeur
	// LLM refuse uiArch 'image'.
	const manifest = {
		format: 'brik',
		version: 1,
		model: { name: MODEL.name, uiArch: 'image', quantSource: `${tier} (build hors-ligne, codec q8web/q4web)` },
		arch: { arch: 'image', d: 0, nHeads: 0, nKvHeads: 0, headDim: 0, ffn: 0, blockCount: 0, ropeTheta: 0, rmsEps: 0, vocab: 0 },
		chat: { template: '', stopTokenIds: [] },
		tokenizer: { kind: 'hf-hub' },
		shards: shardMetas,
		tensors,
		...(MODEL.unetCfg ? { image: { unetCfg: MODEL.unetCfg } } : {}),
	};

	const out = serializeBrik(manifest, shards);
	const outDir = path.join(__dirname, '..', 'public', 'models');
	fs.mkdirSync(outDir, { recursive: true });
	const outPath = path.join(outDir, MODEL.out(tier));
	fs.writeFileSync(outPath, out);
	console.log(`\n${outPath}`);
	console.log(`  source ${(stats.srcBytes / 1e6).toFixed(0)} Mo → BRIK ${(out.length / 1e6).toFixed(0)} Mo` +
		` (q8 ${(stats.q8 / 1e6).toFixed(0)} · q4 ${(stats.q4 / 1e6).toFixed(0)} · f16 ${(stats.f16 / 1e6).toFixed(0)})` +
		` · ${shardMetas.length} shards · tier ${tier}`);
})().catch((e) => { console.error(e); process.exit(1); });
