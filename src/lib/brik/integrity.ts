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
	'https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik':
		'e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481',
	'https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik':
		'd112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9',
};
// DIGESTS_FIN

const hex = (buf: ArrayBuffer) =>
	[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

/** Empreinte attendue pour cette URL, ou `undefined` si elle n'est pas sous notre responsabilité. */
export function expectedManifestDigest(url: string): string | undefined {
	return MANIFEST_DIGESTS[url];
}

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
	// `slice()` : subtle.digest veut un ArrayBuffer autonome, et `bytes` est presque toujours une vue
	// dans un tampon plus grand (l'en-tête complet) — sans copie on hacherait tout le tampon.
	const copy = bytes.slice();
	return hex(await crypto.subtle.digest('SHA-256', copy.buffer as ArrayBuffer));
}

/**
 * Vérifie les octets du manifeste contre la table. Lève si l'URL est enregistrée et que l'empreinte
 * diffère — un chargement refusé est infiniment préférable à un modèle inconnu qui parle en notre
 * nom. Ne fait rien pour une URL non enregistrée (modèle de l'utilisateur), ni si `crypto.subtle`
 * est absent (contexte non sécurisé : http:// hors localhost — le cas n'existe qu'en dev).
 */
export async function verifyManifestDigest(url: string, manifestBytes: Uint8Array): Promise<void> {
	const attendu = expectedManifestDigest(url);
	if (!attendu) return;
	if (typeof crypto === 'undefined' || !crypto.subtle) {
		console.warn('[intégrité] crypto.subtle indisponible (contexte non sécurisé) : empreinte du manifeste NON vérifiée.');
		return;
	}
	const obtenu = await sha256Hex(manifestBytes);
	if (obtenu !== attendu) {
		console.error(`[intégrité] manifeste inattendu pour ${url}\n  attendu : ${attendu}\n  obtenu  : ${obtenu}`);
		throw new Error(
			'Ce modèle ne correspond pas à celui que Brimkern publie : son manifeste a une empreinte différente de celle attendue. '
			+ 'Chargement refusé. Si tu viens de téléverser une nouvelle version, relance `npm run brik:digest`.',
		);
	}
}
