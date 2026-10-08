// Encodage WebM SANS temps réel : WebCodecs (VideoEncoder) + un multiplexeur WebM minimal.
//
// Pourquoi : framesToWebm passait par canvas.captureStream + MediaRecorder, qui ENREGISTRE en temps
// réel au rythme de requestAnimationFrame. Deux défauts mesurés le 2026-10-08 :
//   • chaque clip attendait sa propre durée de lecture avant d'apparaître (10 s pour la version
//     bouclée) ;
//   • onglet en arrière-plan → requestAnimationFrame SUSPENDU : la génération finie restait bloquée
//     sur « Compilation de la vidéo » jusqu'au retour de l'utilisateur (retour Romain : 54 s).
// Ici, chaque frame est encodée aussi vite que l'encodeur le permet, sans horloge ni minuterie, et la
// durée est écrite dans l'en-tête (plus besoin du contournement fixWebmDuration pour ces fichiers).
//
// Le conteneur est le strict nécessaire lu par Chrome/Firefox/VLC : en-tête EBML, Segment { Info
// (TimecodeScale 1 ms, Duration), Tracks (une piste vidéo VP9 ou VP8), Clusters de SimpleBlocks }.
// Tailles toutes connues (pas de taille « inconnue ») : le fichier est construit d'un bloc en mémoire.

type Bytes = Uint8Array;

const concat = (parts: Bytes[]): Bytes => {
	let n = 0;
	for (const p of parts) n += p.length;
	const out = new Uint8Array(n);
	let o = 0;
	for (const p of parts) { out.set(p, o); o += p.length; }
	return out;
};
// Taille en vint EBML sur 8 octets (0x01 + 7 octets) : toujours valide, et sans calcul de largeur.
const size8 = (n: number): Bytes => {
	const b = new Uint8Array(8);
	b[0] = 0x01;
	for (let i = 7; i >= 1; i--) { b[i] = n & 0xff; n = Math.floor(n / 256); }
	return b;
};
const el = (id: number[], ...data: Bytes[]): Bytes => { const d = concat(data); return concat([new Uint8Array(id), size8(d.length), d]); };
const uint = (v: number): Bytes => {
	const bytes: number[] = [];
	do { bytes.unshift(v & 0xff); v = Math.floor(v / 256); } while (v > 0);
	return new Uint8Array(bytes);
};
const f64 = (v: number): Bytes => { const b = new Uint8Array(8); new DataView(b.buffer).setFloat64(0, v); return b; };
const str = (s: string): Bytes => new TextEncoder().encode(s);

interface Chunk { data: Bytes; ms: number; key: boolean }

function muxWebm(chunks: Chunk[], codecId: string, w: number, h: number, durationMs: number): Bytes {
	const header = el([0x1a, 0x45, 0xdf, 0xa3],
		el([0x42, 0x86], uint(1)), el([0x42, 0xf7], uint(1)), el([0x42, 0xf2], uint(4)), el([0x42, 0xf3], uint(8)),
		el([0x42, 0x82], str('webm')), el([0x42, 0x87], uint(4)), el([0x42, 0x85], uint(2)));
	const info = el([0x15, 0x49, 0xa9, 0x66],
		el([0x2a, 0xd7, 0xb1], uint(1_000_000)),          // TimecodeScale : 1 ms
		el([0x4d, 0x80], str('brimkern')), el([0x57, 0x41], str('brimkern')),
		el([0x44, 0x89], f64(durationMs)));
	const tracks = el([0x16, 0x54, 0xae, 0x6b],
		el([0xae],
			el([0xd7], uint(1)), el([0x73, 0xc5], uint(1)), el([0x83], uint(1)), el([0x86], str(codecId)),
			el([0xe0], el([0xb0], uint(w)), el([0xba], uint(h)))));
	// Clusters : le temps d'un bloc est relatif à son cluster sur 16 bits signés → nouveau cluster
	// toutes les ~30 s (un clip n'en a qu'un, mais le format ne doit pas casser au-delà).
	const clusters: Bytes[] = [];
	let i = 0;
	while (i < chunks.length) {
		const base = chunks[i].ms;
		const blocks: Bytes[] = [];
		while (i < chunks.length && chunks[i].ms - base < 30_000) {
			const c = chunks[i];
			const head = new Uint8Array(4);
			head[0] = 0x81;                                          // piste 1 (vint)
			new DataView(head.buffer).setInt16(1, c.ms - base);
			head[3] = c.key ? 0x80 : 0x00;
			blocks.push(el([0xa3], head, c.data));                   // SimpleBlock
			i++;
		}
		clusters.push(el([0x1f, 0x43, 0xb6, 0x75], el([0xe7], uint(base)), ...blocks));
	}
	return concat([header, el([0x18, 0x53, 0x80, 0x67], info, tracks, ...clusters)]);
}

// Encode `frames` répétées `loops` fois à `fps`. null si WebCodecs est absent ou refuse les deux
// codecs : l'appelant retombe alors sur MediaRecorder.
export async function encodeWebmFast(frames: ImageData[], fps: number, loops: number): Promise<Blob | null> {
	const G = globalThis as any;
	if (typeof G.VideoEncoder === 'undefined' || typeof G.VideoFrame === 'undefined' || !frames.length) return null;
	const width = frames[0].width, height = frames[0].height;
	const candidates = [
		{ codec: 'vp09.00.10.08', id: 'V_VP9' },
		{ codec: 'vp8', id: 'V_VP8' },
	];
	let pick: { codec: string; id: string } | null = null;
	for (const c of candidates) {
		try {
			const r = await G.VideoEncoder.isConfigSupported({ codec: c.codec, width, height, bitrate: 2_000_000, framerate: fps });
			if (r?.supported) { pick = c; break; }
		} catch { /* codec suivant */ }
	}
	if (!pick) return null;
	const chunks: Chunk[] = [];
	let failure: unknown = null;
	const enc = new G.VideoEncoder({
		output: (chunk: any) => {
			const data = new Uint8Array(chunk.byteLength);
			chunk.copyTo(data);
			chunks.push({ data, ms: Math.round(chunk.timestamp / 1000), key: chunk.type === 'key' });
		},
		error: (e: unknown) => { failure = e; },
	});
	enc.configure({ codec: pick.codec, width, height, bitrate: 2_000_000, framerate: fps });
	const total = frames.length * loops;
	const frameUs = 1e6 / fps;
	for (let n = 0; n < total; n++) {
		const img = frames[n % frames.length];
		const vf = new G.VideoFrame(img.data, { format: 'RGBA', codedWidth: width, codedHeight: height, timestamp: Math.round(n * frameUs), duration: Math.round(frameUs) });
		enc.encode(vf, { keyFrame: n % 60 === 0 });
		vf.close();
	}
	await enc.flush();
	enc.close();
	if (failure || !chunks.length) return null;
	chunks.sort((a, b) => a.ms - b.ms);
	const bytes = muxWebm(chunks, pick.id, width, height, total * (1000 / fps));
	return new Blob([bytes as BlobPart], { type: 'video/webm' });
}
