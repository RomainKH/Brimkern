// Découpage des poids en SPANS DE COUCHE — le seul endroit où vit cette règle.
//
// Module FEUILLE, sans aucune dépendance, et c'est le point : ces deux fonctions sont utilisées par
// le chargeur de l'app (model.ts), par le préchargement (source.ts) ET par le SDK embarqué. Quand
// elles vivaient dans model.ts, un simple import depuis le SDK y faisait entrer CustomWebModel et
// toute sa parenté — +37 Ko sur un bundle que des sites tiers chargent. Un helper partagé doit
// vivre dans un fichier qui ne traîne rien derrière lui.

// Span contigu [start, end) couvrant un groupe de tenseurs, pour le fetch coalescé par couche.
// Garde-fou : une couche fait quelques Mo ; un span aberrant (manifeste exotique, tenseurs non
// contigus) → null, l'appelant repasse en par-tenseur plutôt que de télécharger un bloc géant.
// Partagé entre le chargement réel (fetchLayerSpan) et le préchargement (source.ts prefetchBrik) :
// les deux doivent découper le fichier EXACTEMENT pareil pour partager les clés du cache HTTP.
export function coalescedSpan(tensors: { offset: number; bytes: number }[]): { start: number; end: number } | null {
	if (!tensors.length) return null;
	let start = Infinity, end = 0, totalBytes = 0;
	for (const t of tensors) { start = Math.min(start, t.offset); end = Math.max(end, t.offset + t.bytes); totalBytes += t.bytes; }
	if (end - start > 64 << 20 || end - start > totalBytes * 1.5) return null;
	return { start, end };
}

// Lecture des tenseurs PAR SPAN DE COUCHE, pour les modèles qui ne passent pas par CustomWebModel
// (lfm2, rwkv7 : classes dédiées qui reçoivent un `rawTensor` injecté).
//
// Ils demandaient UN TENSEUR À LA FOIS, alors que le préchargement d'arrière-plan (source.ts,
// planTensorRanges) stocke UN SPAN PAR COUCHE. Deux découpages pour les mêmes octets = deux clés de
// cache différentes : le préchargement ne servait jamais, et le fichier était téléchargé DEUX FOIS.
// Mesuré sur LFM2.5 230M : 148 plages, 251 Mo stockés pour 149 Mo de fichier — 101,8 Mo de
// chevauchement, zéro doublon exact (le motif d'un plan divergent, pas d'une fuite).
//
// Ici, le même découpage que le plan : un span par couche, tout le reste à l'unité. Le span est
// relâché dès que TOUS les tenseurs de sa couche ont été servis — sinon on garderait le modèle
// entier dans le tas JS (les subarray retiennent leur ArrayBuffer).
export function spanRawTensor(
	tensors: Record<string, { offset: number; bytes: number }>,
	source: { bytes(offset: number, length: number): Promise<Uint8Array> },
): (name: string) => Promise<Uint8Array> {
	const byLayer = new Map<string, string[]>();
	for (const name of Object.keys(tensors)) {
		const m = name.match(/^blk\.(\d+)\./);
		if (!m) continue;
		let g = byLayer.get(m[1]);
		if (!g) byLayer.set(m[1], (g = []));
		g.push(name);
	}
	const spans = new Map<string, Promise<{ start: number; bytes: Uint8Array }>>();
	const restants = new Map<string, number>();
	return async (name: string) => {
		const t = tensors[name];
		if (!t) throw new Error(`tenseur absent : ${name}`);
		const m = name.match(/^blk\.(\d+)\./);
		const noms = m ? byLayer.get(m[1]) : undefined;
		const s = noms ? coalescedSpan(noms.map((n) => tensors[n])) : null;
		if (!m || !noms || !s) return source.bytes(t.offset, t.bytes);
		const layer = m[1];
		let p = spans.get(layer);
		if (!p) {
			p = source.bytes(s.start, s.end - s.start).then((bytes) => ({ start: s.start, bytes }));
			spans.set(layer, p);
			restants.set(layer, noms.length);
		}
		const { start, bytes } = await p;
		const out = bytes.subarray(t.offset - start, t.offset - start + t.bytes);
		const reste = (restants.get(layer) ?? 1) - 1;
		// ⚠️ On rend une VUE sur le span ; la copie est faite ici avant de lâcher le span, sinon le
		// dernier appelant garderait tout le buffer de la couche en vie par ricochet.
		if (reste <= 0) { spans.delete(layer); restants.delete(layer); return new Uint8Array(out); }
		restants.set(layer, reste);
		return out;
	};
}
