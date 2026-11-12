// Intégrité des BRIK que l'app charge TOUTE SEULE.
//
// LE PROBLÈME. Les poids sont servis par des URLs Hugging Face en `resolve/main`, c'est-à-dire un
// pointeur MUTABLE. Quiconque obtient un droit d'écriture sur un dépôt (compte compromis, jeton à
// portée trop large, collaborateur) remplace un fichier, et tous les visiteurs chargent le nouveau
// au prochain défaut de cache — sans qu'une seule ligne de notre code ait changé. Le BRIK n'exécute
// rien (le manifeste ne porte aucun code : `chat.template` n'est jamais évalué, `shards[].file` ne
// sert que de clé de Map), donc le risque n'est pas l'exécution de code arbitraire : c'est qu'un
// modèle substitué parle au nom de Brimkern.
//
// CE QUE CE MODULE VÉRIFIE. L'empreinte SHA-256 des octets du MANIFESTE, comparée à une valeur
// figée dans le code. Le manifeste décrit toute la structure du paquet : architecture, tokenizer,
// table des tenseurs (nom, dtype, forme, offset, longueur) et taille de chaque shard. Sont donc
// détectés : un modèle d'une autre topologie, un tokenizer redirigé, un remaniement de la
// disposition, une requantification, et plus généralement tout remplacement de fichier qui ne
// reproduit pas la structure à l'octet près.
//
// CE QU'IL NE VÉRIFIE PAS, et il faut le dire : les octets des TENSEURS. Un attaquant qui téléverse
// un fine-tune de MÊME architecture et MÊME quantification produit un manifeste identique et passe.
// Couvrir ce cas demande une empreinte par plage téléchargée (cf. `docs/` — les plages sont déjà
// planifiées de façon déterministe pour les clés de cache, donc l'accroche existe) ; ce n'est pas
// fait ici. La vérification du manifeste est le premier verrou, pas le dernier.
//
// COÛT. Nul en réseau : les octets du manifeste sont déjà téléchargés (c'est la première requête de
// plage du chargement streamé). Le hachage porte sur 28 Ko (BRIK image) à 12 Mo (BRIK LLM — le
// manifeste y embarque le tokenizer, ce qui est une bonne nouvelle : le vocabulaire et les règles de
// découpage sont donc couverts par l'empreinte), soit quelques dizaines de millisecondes de
// `crypto.subtle.digest` une fois par chargement. La vérification a lieu AVANT que le moindre
// tenseur soit demandé.
//
// POLITIQUE. Une URL absente de la table n'est PAS vérifiée : un modèle fourni par l'utilisateur
// (deeplink, champ « BRIK par URL », fichier local) n'a par nature aucune empreinte connue, et le
// produit consiste justement à pouvoir charger n'importe quel modèle. Seules les URLs que l'app
// choisit elle-même sont figées — ce sont les seules dont nous répondons.
//
// MISE À JOUR. `npm run brik:digest` recalcule la table (il télécharge juste les en-têtes) et écrit
// ce fichier. À lancer après chaque téléversement sur Hugging Face, et à relire dans le diff : une
// empreinte qui change sans téléversement de ta part est exactement le signal qu'on veut voir.

// ── Empreintes (générées par scripts/brik-digest.cjs — ne pas éditer à la main) ────────────────
// DIGESTS_DÉBUT
export const MANIFEST_DIGESTS: Record<string, string> = {
	'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik':
		'aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe',
	'https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik':
		'315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d',
	'https://huggingface.co/romainkh14/Qwen3-0.6B-Shop-ENFR_BRIK/resolve/main/qwen3-0.6b-shop-enfr-q4.brik':
		'f45dc8b089e66d8a3ed53902a788aa2c86bc26f1fa286a32bee426c07a264272',
	'https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik':
		'23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d',
	'https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik':
		'bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372',
	'https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik':
		'47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10',
	'https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik':
		'b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac',
	'https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik':
		'b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae',
	'https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik':
		'ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f',
	'https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik':
		'42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654',
	'https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik':
		'e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76',
	'https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-1step-q8.brik':
		'68ed19de02fc8380ab49d03b623664f9b77d2dc20b4174117ed12b17515fcf4c',
	'https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-2step-q8.brik':
		'33200f99849dcc116e06432550561cbad4118d831bf3dbe8fadab7ff692c0fe1',
	'https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik':
		'e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481',
	'https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik':
		'd112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9',
};
// DIGESTS_FIN

// ── SHA-256 synchrone ─────────────────────────────────────────────────────────────────────────
// Sert aux chemins synchrones (assembleBrik : scripts de build Node et tests) et de repli quand
// `crypto.subtle` manque (contexte HTTP non sécurisé en dev local).
// ⚠️ Le TypeScript pur tourne à ~70 Mo/s (mesuré le 2026-11-12, Node 24, 256 Mo) contre ~3 Go/s natif :
// jamais sur un chemin de chargement du navigateur — c'est le rôle de `sha256Hex` / `verifyBrikShards`.
// Sous Node, on prend le module natif (`process.getBuiltinModule`, sans `require` que le bundle
// navigateur ne connaît pas).
const SHA256_K = new Uint32Array([
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

type NodeHash = { update(b: Uint8Array): NodeHash; digest(enc: 'hex'): string };
function nodeCreateHash(): ((alg: string) => NodeHash) | null {
	const proc = (globalThis as { process?: { getBuiltinModule?: (id: string) => unknown } }).process;
	const mod = proc?.getBuiltinModule?.('node:crypto') as { createHash?: (alg: string) => NodeHash } | undefined;
	return mod?.createHash ?? null;
}

export function sha256HexSync(bytes: Uint8Array): string {
	const createHash = nodeCreateHash();
	if (createHash) return createHash('sha256').update(bytes).digest('hex');
	return sha256HexPure(bytes);
}

/** SHA-256 en TypeScript pur, sans recopier l'entrée (seuls les 1-2 derniers blocs sont bourrés). */
export function sha256HexPure(bytes: Uint8Array): string {
	const len = bytes.byteLength;
	const src = new DataView(bytes.buffer, bytes.byteOffset, len);
	const fullBlocks = Math.floor(len / 64);
	// Queue : reste + 0x80 + longueur en bits sur 64 bits → 1 ou 2 blocs.
	const rest = len - fullBlocks * 64;
	const tail = new Uint8Array(rest + 9 > 64 ? 128 : 64);
	tail.set(bytes.subarray(fullBlocks * 64));
	tail[rest] = 0x80;
	const tv = new DataView(tail.buffer);
	// Arithmétique flottante, pas d'opérateurs 32 bits : la taille en bits dépasse 2³² dès 512 Mo.
	tv.setUint32(tail.length - 8, Math.floor(len / 0x20000000), false);
	tv.setUint32(tail.length - 4, (len % 0x20000000) * 8, false);

	let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
	let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
	const w = new Uint32Array(64);
	const block = (dv: DataView, off: number) => {
		for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4, false);
		for (let i = 16; i < 64; i++) {
			const x = w[i - 15], y = w[i - 2];
			const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
			const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
			w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
		}
		let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
		for (let i = 0; i < 64; i++) {
			const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
			const ch = (e & f) ^ (~e & g);
			const t1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
			const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
			const maj = (a & b) ^ (a & c) ^ (b & c);
			const t2 = (S0 + maj) >>> 0;
			h = g; g = f; f = e; e = (d + t1) >>> 0;
			d = c; c = b; b = a; a = (t1 + t2) >>> 0;
		}
		h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
		h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
	};
	for (let k = 0; k < fullBlocks; k++) block(src, k * 64);
	for (let off = 0; off < tail.length; off += 64) block(tv, off);
	return [h0, h1, h2, h3, h4, h5, h6, h7].map((v) => v.toString(16).padStart(8, '0')).join('');
}

const hex = (buf: ArrayBuffer) =>
	[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

/** Empreinte attendue pour cette URL, ou `undefined` si elle n'est pas sous notre responsabilité. */
export function expectedManifestDigest(url: string): string | undefined {
	return MANIFEST_DIGESTS[url];
}

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
	if (typeof crypto !== 'undefined' && crypto.subtle) {
		// La VUE elle-même (BufferSource) : digest ne hache que ses octets. C'est passer `bytes.buffer`
		// qui hacherait tout le tampon sous-jacent — et recopier un shard de plusieurs centaines de Mo
		// pour l'éviter doublait la mémoire au chargement.
		return hex(await crypto.subtle.digest('SHA-256', bytes as Uint8Array<ArrayBuffer>));
	}
	return sha256HexSync(bytes);
}

/**
 * Vérifie les octets du manifeste contre la table. Lève si l'URL est enregistrée et que l'empreinte
 * diffère — un chargement refusé est infiniment préférable à un modèle inconnu qui parle en notre
 * nom. Ne fait rien pour une URL non enregistrée (modèle de l'utilisateur).
 */
export async function verifyManifestDigest(url: string, manifestBytes: Uint8Array): Promise<void> {
	const attendu = expectedManifestDigest(url);
	if (!attendu) return;
	const obtenu = await sha256Hex(manifestBytes);
	if (obtenu !== attendu) {
		console.error(`[intégrité] manifeste inattendu pour ${url}\n  attendu : ${attendu}\n  obtenu  : ${obtenu}`);
		throw new Error(
			'Ce modèle ne correspond pas à celui que Brimkern publie : son manifeste a une empreinte différente de celle attendue. '
			+ 'Chargement refusé. Si tu viens de téléverser une nouvelle version, relance `npm run brik:digest`.',
		);
	}
}

/**
 * Vérifie l'empreinte SHA-256 d'un shard de poids par rapport au champ `shard.sha256` du manifeste
 * (arbre de Merkle à 1 niveau : `MANIFEST_DIGESTS` protège le manifeste, `shard.sha256` protège les
 * octets de poids de chaque shard). Sans effet si le shard ne déclare pas `sha256` (compatibilité
 * avec les paquets `.brik` v1 déjà en ligne).
 */
export async function verifyShardDigest(shardId: number, expectedHex: string | undefined, bytes: Uint8Array): Promise<void> {
	if (!expectedHex) return;
	const obtenu = await sha256Hex(bytes);
	if (obtenu !== expectedHex.toLowerCase()) {
		throw new Error(
			`BRIK: intégrité du shard ${shardId} compromise (SHA-256 attendu ${expectedHex.slice(0, 12)}…, obtenu ${obtenu.slice(0, 12)}…)`,
		);
	}
}

/**
 * Vérifie TOUS les shards d'une section de données en mémoire (sortie de `parseBrik`). À appeler aux
 * frontières de confiance seulement — fichier déposé par l'utilisateur, téléchargement sans Range,
 * copie relue d'IndexedDB — et une seule fois : hacher à nouveau des octets qu'on vient de produire
 * ou de vérifier ne protège de rien et coûte un passage complet sur les poids.
 */
export async function verifyBrikShards(
	manifest: { shards: { id: number; byteLength: number; sha256?: string }[] },
	data: Uint8Array,
): Promise<void> {
	let off = 0;
	for (const sh of [...manifest.shards].sort((a, b) => a.id - b.id)) {
		if (off + sh.byteLength > data.byteLength) {
			throw new Error(`BRIK: section de données tronquée au shard ${sh.id} (${data.byteLength} < ${off + sh.byteLength})`);
		}
		await verifyShardDigest(sh.id, sh.sha256, data.subarray(off, off + sh.byteLength));
		off += sh.byteLength;
	}
}
