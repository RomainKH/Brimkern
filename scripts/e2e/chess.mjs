// La page /chess en vrai Chrome sur un build de production : le modèle charge, le gate GPU tient (ou le
// repli CPU prend le relais), un coup humain obtient une réponse — et combien de temps elle prend.
//
//   PORT=3619 node scripts/e2e/chess.mjs                          # WebGPU, niveau « Très fort »
//   PORT=3619 node scripts/e2e/chess.mjs --flag=chessgpu=0 --level=strong   # bras témoin CPU
//   PORT=3619 node scripts/e2e/chess.mjs --level=max --playnow=3  # Maximum, « Jouer maintenant » à 3 s
//   PORT=3619 node scripts/e2e/chess.mjs --moves=3 --shot=/tmp/chess.png
//   PORT=3619 node scripts/e2e/chess.mjs --match=1320 --level=medium --games=1   # match contre Stockfish
//   PORT=3619 node scripts/e2e/chess.mjs --match=max --moves=4                     # Stockfish pleine force
//
// Joue 1.e4 en GLISSER-DÉPOSER à la souris (le geste réel), puis, pour les coups suivants, le
// premier coup légal trouvé en clic-clic (on mesure la réponse du moteur, pas la qualité du jeu
// humain). Sortie : statut de la page, backend, temps par réponse, positions évaluées.
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const BASE = `http://localhost:${process.env.PORT || 3618}`;
const FLAG = arg('flag', '');
const LEVEL = arg('level', 'expert');
const PLAYNOW = Number(arg('playnow', '0'));
const MOVES = Number(arg('moves', '2'));
const SHOT = arg('shot', '');
const LANG = arg('lang', '');
const MATCH = arg('match', '');     // réglage UCI_Elo de Stockfish (1320…3000) ou « max »
const GAMES = Number(arg('games', '0'));

const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const logs = [];
page.on('console', (m) => { const t = m.text(); if (/\[chess\]|selfValidate.*KO|error/i.test(t)) logs.push(`${m.type()}: ${t.slice(0, 200)}`); });
page.on('pageerror', (e) => logs.push(`pageerror: ${String(e).slice(0, 200)}`));

const t0 = Date.now();
await page.goto(`${BASE}${LANG ? `/${LANG}` : ''}/chess${FLAG ? `?${FLAG}` : ''}`, { waitUntil: 'domcontentloaded' });
const newGame = page.getByRole('button', { name: /New game \(White\)|Nouvelle partie \(blancs\)/ });
await newGame.waitFor({ timeout: 120_000 });
await page.waitForFunction(() => {
	const b = [...document.querySelectorAll('button')].find((x) => /New game \(White\)|Nouvelle partie/.test(x.textContent || ''));
	return b && !b.disabled;
}, null, { timeout: 180_000, polling: 250 });
console.log(`modèle prêt en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
await page.selectOption('#chess-level', LEVEL);

const plies = () => page.evaluate(() => [...document.querySelectorAll('[aria-label="Move list"] span, [aria-label="Liste des coups"] span')]
	.filter((x) => x.textContent && !x.textContent.endsWith('.')).length);
const statusTxt = async () => (await page.locator('[aria-live="polite"]').innerText()).replace(/\s+/g, ' ').slice(0, 220);
if (MATCH) {
	// Match brimkern contre Stockfish : les deux camps jouent (ou N parties se terminent), puis « Arrêter ».
	await page.selectOption('#chess-opponent', MATCH);
	const t1 = Date.now();
	await page.getByRole('button', { name: /Start the match|Lancer le match/ }).click();
	if (GAMES) {
		await page.waitForFunction((n) => document.querySelectorAll('[class*="chips"] > span').length >= n, GAMES, { timeout: 1_800_000, polling: 500 });
	} else {
		await page.waitForFunction((n) => [...document.querySelectorAll('[aria-label="Move list"] span, [aria-label="Liste des coups"] span')]
			.filter((x) => x.textContent && !x.textContent.endsWith('.')).length >= n, 2 * MOVES, { timeout: 600_000, polling: 200 });
	}
	console.log(`match : ${await plies()} demi-coups en ${((Date.now() - t1) / 1000).toFixed(1)} s · ${await statusTxt()}`);
	const score = await page.locator('text=/brimkern [0-9.,]+ \\/ [0-9]+/').first().innerText().catch(() => '');
	if (score) console.log(`score : ${score.replace(/\s+/g, ' ')}`);
	await page.getByRole('button', { name: /Stop the match|Arrêter le match/ }).click();
	// Arrêté : le bouton « Lancer » revient (le statut, lui, garde le résultat si la partie était finie).
	await page.getByRole('button', { name: /Start the match|Lancer le match/ }).waitFor({ timeout: 30_000 });
	const before = await plies();
	await page.waitForTimeout(3000);
	console.log(`arrêt : ${(await plies()) === before ? 'OK (plus aucun coup joué)' : 'ÉCHEC (des coups continuent)'}`);
	if (SHOT) await page.screenshot({ path: SHOT, fullPage: true });
	console.log(logs.length ? `console :\n  ${logs.join('\n  ')}` : 'console : rien à signaler');
	await browser.close();
	process.exit(0);
}

const squareBtn = (sq) => page.locator(`button[aria-label^="${sq}"]`).first();
for (let i = 0; i < MOVES; i++) {
	let from = 'e2', to = 'e4';
	if (i > 0) {
		// Premier coup légal trouvé : on clique nos pièces jusqu'à voir des cibles.
		const found = await page.evaluate(() => {
			const btns = [...document.querySelectorAll('[aria-label="Chessboard"] > button, [aria-label="Échiquier"] > button')];
			return btns.filter((b) => / white | blanc/.test(` ${b.getAttribute('aria-label')} `)).map((b) => b.getAttribute('aria-label').split(',')[0]);
		});
		let ok = false;
		for (const sq of found) {
			await squareBtn(sq).click();
			const target = await page.evaluate(() => {
				const btns = [...document.querySelectorAll('[aria-label="Chessboard"] > button, [aria-label="Échiquier"] > button')];
				const b = btns.find((x) => x.querySelector('span[class*="dot"], span[class*="ring"]'));
				return b ? b.getAttribute('aria-label').split(',')[0] : null;
			});
			if (target) { from = sq; to = target; ok = true; break; }
		}
		if (!ok) { console.log('aucun coup légal trouvé'); break; }
	}
	const t1 = Date.now();
	if (i === 0) {
		// Glisser-déposer : appui sur e2, déplacement en plusieurs pas, relâché sur e4.
		const a = await squareBtn(from).boundingBox(), b = await squareBtn(to).boundingBox();
		await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
		await page.mouse.down();
		await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
		await page.mouse.up();
		const moved = await page.evaluate(() => document.querySelector('[aria-label^="e4,"]') !== null);
		console.log(`glisser-déposer e2→e4 : ${moved ? 'OK' : 'ÉCHEC'}`);
	} else {
		await squareBtn(to).click();
	}
	if (PLAYNOW) {
		await page.waitForTimeout(PLAYNOW * 1000);
		await page.getByRole('button', { name: /Play now|Jouer maintenant/ }).click();
	}
	// Attendre la RÉPONSE du moteur : la liste des coups doit avoir grandi de 2 (notre coup + le sien) —
	// le statut « À vous » seul se lit aussi dans les millisecondes qui précèdent sa réflexion.
	await page.waitForFunction((n) => {
		const cells = [...document.querySelectorAll('[aria-label="Move list"] span, [aria-label="Liste des coups"] span')].filter((x) => x.textContent && !x.textContent.endsWith('.'));
		const st = document.querySelector('[aria-live="polite"]')?.textContent || '';
		return cells.length >= n || /Checkmate|Échec et mat|Draw|Nulle/.test(st);
	}, 2 * (i + 1), { timeout: 300_000, polling: 100 });
	const sub = await page.locator('[aria-live="polite"]').innerText();
	console.log(`coup ${i + 1} : ${from}-${to} → réponse en ${((Date.now() - t1) / 1000).toFixed(2)} s · ${sub.replace(/\s+/g, ' ').slice(0, 200)}`);
}
const infoTxt = await page.locator('text=/Model:|Modèle :/').first().innerText().catch(() => '');
console.log(infoTxt.replace(/\s+/g, ' ').slice(0, 220));
if (SHOT) await page.screenshot({ path: SHOT, fullPage: true });
console.log(logs.length ? `console :\n  ${logs.join('\n  ')}` : 'console : rien à signaler');
await browser.close();
