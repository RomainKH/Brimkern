#!/usr/bin/env node
// IMAGE_DIMENSIONS × topologie du UNet : chaque couple (format, résolution) doit traverser le
// forward SANS désaccord de dimension sur les skips.
//
// Pourquoi un test et pas une simple relecture : le UNet descend `ceil(H/2)` (conv 3×3 stride 2
// pad 1) et remonte `H*2`. Sur un côté impair à un niveau donné, la remontée retombe UN pixel à
// côté du skip empilé, et `concat(h, skip, …, H*W)` lit au-delà du buffer du skip. WebGPU clampe
// les lectures hors borne : aucune erreur, aucun log — juste des canaux décalés et une image
// silencieusement dégradée. Huit cellules de la table étaient dans ce cas (3:2 et 2:3 en
// fast/hd/fhd, 4:3 et 3:4 en fhd), dont deux atteignables depuis l'interface.
//
// Le test lit la table dans le SOURCE (pas une copie) pour ne pas dériver, et rejoue la même
// arithmétique que runUnet (src/lib/webgpu/diffusion/unet.ts).
// Usage : npm run test:imagedims

const fs = require('node:fs');
const path = require('node:path');

const RACINE = path.resolve(__dirname, '..');
let echecs = 0;
const check = (ok, msg) => { console.log(`  ${ok ? 'ok  ' : 'ÉCHEC'} ${msg}`); if (!ok) echecs++; };

// ── La table, extraite du source ──────────────────────────────────────────────────────────────
const src = fs.readFileSync(path.join(RACINE, 'src/lib/webgpu/diffusion/imageGen.ts'), 'utf8');
const brut = src.match(/IMAGE_DIMENSIONS[^=]*=\s*(\{[\s\S]*?\n\};)/);
if (!brut) { console.error('IMAGE_DIMENSIONS introuvable dans imageGen.ts'); process.exit(1); }
const json = brut[1]
	.replace(/;$/, '')
	.replace(/\/\/[^\n]*/g, '')                              // commentaires de ligne
	.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":') // clés nues → clés JSON
	.replace(/'/g, '"')
	.replace(/,(\s*[}\]])/g, '$1');                          // virgules traînantes
const DIMS = JSON.parse(json);

// ── La topologie : SD-Turbo (SD 2.1) et SDXS-512 (distillé, sans bloc central) ────────────────
// Seul `mult.length` compte ici : il fixe le nombre de descentes (L-1) et de remontées.
const TOPOS = [
	{ nom: 'SD-Turbo (mult [1,2,4,4])', L: 4, layersPerBlock: 2 },
	{ nom: 'SDXS-512 (mult [1,2,4,4])', L: 4, layersPerBlock: 2 },
];

// Rejoue la propagation H/W d'un forward et renvoie les désaccords skip↔courant.
function desaccords(H0, W0, { L, layersPerBlock }) {
	let H = H0, W = W0;
	const skips = [[H, W]];                                   // conv_in
	for (let i = 0; i < L; i++) {
		for (let j = 0; j < layersPerBlock; j++) skips.push([H, W]);
		if (i < L - 1) {                                        // descente stride 2, pad 1
			H = Math.floor((H + 2 - 3) / 2) + 1;
			W = Math.floor((W + 2 - 3) / 2) + 1;
			skips.push([H, W]);
		}
	}
	const mauvais = [];
	for (let i = L - 1; i >= 0; i--) {
		for (let j = 0; j < layersPerBlock + 1; j++) {
			const sk = skips.pop();
			if (sk[0] !== H || sk[1] !== W) mauvais.push(`niveau ${i} : skip ${sk[1]}×${sk[0]} vs courant ${W}×${H}`);
		}
		if (i > 0) { H *= 2; W *= 2; }
	}
	return mauvais;
}

// ── Vérifications ─────────────────────────────────────────────────────────────────────────────
const ratios = Object.keys(DIMS);
const qualites = Object.keys(DIMS[ratios[0]]);
console.log(`\n${ratios.length} formats × ${qualites.length} résolutions = ${ratios.length * qualites.length} cellules\n`);

let cellules = 0, latentsOk = 0, pixelsOk = 0;
for (const r of ratios) {
	for (const q of qualites) {
		const d = DIMS[r][q];
		cellules++;
		if (d.latentW % 8 === 0 && d.latentH % 8 === 0) latentsOk++;
		else console.log(`  ÉCHEC ${r}/${q} : latent ${d.latentW}×${d.latentH} — les deux côtés doivent être multiples de 8`);
		if (d.w === d.latentW * 8 && d.h === d.latentH * 8) pixelsOk++;
		else console.log(`  ÉCHEC ${r}/${q} : ${d.w}×${d.h} ≠ latent×8 (${d.latentW * 8}×${d.latentH * 8})`);
	}
}
check(latentsOk === cellules, `${latentsOk}/${cellules} cellules ont un latent multiple de 8`);
check(pixelsOk === cellules, `${pixelsOk}/${cellules} cellules ont w/h = latent × 8`);

for (const topo of TOPOS) {
	let ok = 0;
	for (const r of ratios) {
		for (const q of qualites) {
			const d = DIMS[r][q];
			const mauvais = desaccords(d.latentH, d.latentW, topo);
			if (mauvais.length === 0) ok++;
			else console.log(`  ÉCHEC ${r}/${q} (latent ${d.latentW}×${d.latentH}) → ${mauvais[0]}`);
		}
	}
	check(ok === cellules, `${topo.nom} : ${ok}/${cellules} cellules traversent le UNet sans désaccord de skip`);
}

// Monotonie : une résolution « supérieure » ne doit pas rendre une image plus petite — sinon le
// sélecteur propose deux marches dans le mauvais ordre.
for (const r of ratios) {
	let croissant = true, precedent = 0;
	for (const q of qualites) {
		const px = DIMS[r][q].w * DIMS[r][q].h;
		if (px <= precedent) croissant = false;
		precedent = px;
	}
	check(croissant, `${r} : les résolutions sont strictement croissantes en pixels`);
}

// Deux formats différents ne doivent pas rendre la MÊME image à qualité égale (choisir 3:2 et
// obtenir un 16:9 est un mensonge silencieux du sélecteur).
for (const q of qualites) {
	const vus = new Map();
	let collisions = 0;
	for (const r of ratios) {
		const clef = `${DIMS[r][q].w}×${DIMS[r][q].h}`;
		if (vus.has(clef)) { console.log(`  ÉCHEC ${q} : ${r} et ${vus.get(clef)} rendent tous deux ${clef}`); collisions++; }
		else vus.set(clef, r);
	}
	check(collisions === 0, `${q} : aucun format n'en duplique un autre`);
}

console.log(echecs === 0 ? '\nALL PASS\n' : `\n${echecs} ÉCHEC(S)\n`);
process.exit(echecs === 0 ? 0 : 1);
