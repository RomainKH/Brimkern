#!/usr/bin/env node
// Recalcule la table d'empreintes de src/lib/brik/integrity.ts.
//
// Ne télécharge QUE les en-têtes (deux requêtes de plage par modèle, quelques dizaines de Ko) :
// 12 octets pour lire la longueur du manifeste, puis le manifeste lui-même, dont on prend le
// SHA-256. C'est exactement la tranche que le navigateur hache au chargement (container.ts :
// [12, 12+longueur)), donc les deux valeurs sont comparables au bit près.
//
// La liste des URLs n'est PAS recopiée ici : elle est extraite de modelCatalog.ts et presets.ts,
// pour qu'un modèle ajouté au catalogue ne puisse pas rester hors de la table sans qu'on le voie.
// Seuls les dépôts que NOUS publions sont concernés (romainkh14) : un modèle fourni par
// l'utilisateur n'a pas d'empreinte connue, et n'a pas à en avoir.
//
// Usage :
//   node scripts/brik-digest.cjs           → affiche la table et le diff avec l'existant
//   node scripts/brik-digest.cjs --write    → écrit la table dans src/lib/brik/integrity.ts

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const RACINE = path.resolve(__dirname, '..');
const INTEGRITY = path.join(RACINE, 'src/lib/brik/integrity.ts');
const ECRIRE = process.argv.includes('--write');

// ── Collecte des URLs .brik que l'APP choisit elle-même ───────────────────────────────────────
function collecteUrls() {
	const fichiers = ['src/lib/modelCatalog.ts', 'src/lib/presets.ts'].map((f) => path.join(RACINE, f));
	const bases = new Map();
	const urls = new Set();
	for (const f of fichiers) {
		const src = fs.readFileSync(f, 'utf8');
		// `export const X_BASE = 'https://…'` → pour résoudre les gabarits `${X_BASE}/fichier.brik`
		for (const m of src.matchAll(/(?:export\s+)?const\s+(\w*BASE\w*)\s*=\s*'([^']+)'/g)) bases.set(m[1], m[2]);
		// URLs littérales
		for (const m of src.matchAll(/'(https:\/\/huggingface\.co\/[^']+\.brik)'/g)) urls.add(m[1]);
		// URLs par gabarit
		for (const m of src.matchAll(/`\$\{(\w+)\}\/([^`]+\.brik)`/g)) {
			const base = bases.get(m[1]);
			if (base) urls.add(`${base}/${m[2]}`);
		}
	}
	// On ne répond que de nos propres dépôts.
	return [...urls].filter((u) => u.includes('/romainkh14/')).sort();
}

// ── Lecture de l'en-tête par plages HTTP ──────────────────────────────────────────────────────
async function plage(url, offset, length) {
	const r = await fetch(url, { headers: { Range: `bytes=${offset}-${offset + length - 1}` } });
	if (r.status !== 206 && r.status !== 200) throw new Error(`HTTP ${r.status}`);
	const buf = Buffer.from(await r.arrayBuffer());
	return r.status === 206 ? buf : buf.subarray(offset, offset + length);
}

async function empreinte(url) {
	const tete = await plage(url, 0, 12);
	if (tete.subarray(0, 4).toString('latin1') !== 'BRIK') throw new Error('sceau magique absent');
	const longueur = tete.readUInt32LE(8);
	if (longueur <= 0 || longueur > 64 * 1024 * 1024) throw new Error(`longueur de manifeste absurde : ${longueur}`);
	const manifeste = await plage(url, 12, longueur);
	return { digest: crypto.createHash('sha256').update(manifeste).digest('hex'), longueur };
}

// ── Table existante, pour le diff ─────────────────────────────────────────────────────────────
function tableActuelle() {
	const src = fs.readFileSync(INTEGRITY, 'utf8');
	const bloc = src.slice(src.indexOf('// DIGESTS_DÉBUT'), src.indexOf('// DIGESTS_FIN'));
	const t = {};
	for (const m of bloc.matchAll(/'(https:[^']+)':\s*\n?\s*'([0-9a-f]{64})'/g)) t[m[1]] = m[2];
	return t;
}

(async () => {
	const urls = collecteUrls();
	const avant = tableActuelle();
	console.log(`\n${urls.length} BRIK publiés par nous dans le catalogue.\n`);

	const table = {};
	let change = 0, echecs = 0;
	for (const url of urls) {
		const nom = url.split('/').pop();
		try {
			const { digest, longueur } = await empreinte(url);
			table[url] = digest;
			const vieux = avant[url];
			const etat = !vieux ? 'NOUVEAU' : vieux === digest ? 'inchangé' : '⚠️  CHANGÉ';
			if (etat !== 'inchangé') change++;
			console.log(`  ${etat.padEnd(9)} ${nom.padEnd(38)} ${digest}  (manifeste ${(longueur / 1024).toFixed(1)} Ko)`);
			if (etat === '⚠️  CHANGÉ') console.log(`             ancienne empreinte : ${vieux}`);
		} catch (e) {
			echecs++;
			console.log(`  ÉCHEC     ${nom.padEnd(38)} ${e.message}`);
		}
	}
	for (const url of Object.keys(avant)) {
		if (!(url in table)) console.log(`  ORPHELIN  ${url.split('/').pop()} — plus dans le catalogue, entrée à retirer`);
	}

	if (change) {
		console.log(`\n⚠️  ${change} empreinte(s) nouvelle(s) ou modifiée(s). Une empreinte qui change SANS`);
		console.log('   téléversement de ta part signifie que le fichier distant a été remplacé : vérifie AVANT d’écrire.');
	}
	if (echecs) console.log(`\n${echecs} modèle(s) illisible(s) (404, réseau, pas de Range) — laissés hors de la table.`);

	const lignes = Object.entries(table)
		.map(([u, d]) => `\t'${u}':\n\t\t'${d}',`)
		.join('\n');
	const bloc = `// DIGESTS_DÉBUT\nexport const MANIFEST_DIGESTS: Record<string, string> = {\n${lignes}\n};\n// DIGESTS_FIN`;

	if (!ECRIRE) {
		console.log('\n--- table (relance avec --write pour l’écrire) ---\n');
		console.log(bloc);
		return;
	}
	const src = fs.readFileSync(INTEGRITY, 'utf8');
	const debut = src.indexOf('// DIGESTS_DÉBUT');
	const fin = src.indexOf('// DIGESTS_FIN') + '// DIGESTS_FIN'.length;
	fs.writeFileSync(INTEGRITY, src.slice(0, debut) + bloc + src.slice(fin));
	console.log(`\nÉcrit : ${path.relative(RACINE, INTEGRITY)} (${Object.keys(table).length} entrées)\n`);
})().catch((e) => { console.error(e); process.exit(1); });
