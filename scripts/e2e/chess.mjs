// La page /chess en vrai Chrome sur un build de production : le modèle charge, le gate GPU tient (ou le
// repli CPU prend le relais), un coup humain obtient une réponse — et combien de temps elle prend.
//
//   PORT=3619 node scripts/e2e/chess.mjs                     # WebGPU, réflexion 256 positions
//   PORT=3619 node scripts/e2e/chess.mjs --flag=chessgpu=0   # bras témoin : tronc sur le CPU
//   PORT=3619 node scripts/e2e/chess.mjs --level=1024 --moves=3 --shot=/tmp/chess.png
//
// Joue 1.e4 puis, pour les coups suivants, le premier coup légal trouvé en cliquant (on mesure la
// réponse du moteur, pas la qualité du jeu humain). Sortie : statut de la page, backend, temps par
// réponse (du clic à la pièce posée), positions évaluées et cadence.
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const BASE = `http://localhost:${process.env.PORT || 3618}`;
const FLAG = arg('flag', '');
const LEVEL = arg('level', '256');
const MOVES = Number(arg('moves', '2'));
const SHOT = arg('shot', '');
const LANG = arg('lang', '');

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
	} else {
		await squareBtn(from).click();
	}
	const t1 = Date.now();
	await squareBtn(to).click();
	await page.waitForFunction(() => /Your move|À vous|Checkmate|Échec et mat|Draw|Nulle/.test(document.querySelector('[aria-live="polite"]')?.textContent || ''), null, { timeout: 300_000, polling: 100 });
	const sub = await page.locator('[aria-live="polite"]').innerText();
	console.log(`coup ${i + 1} : ${from}-${to} → réponse en ${((Date.now() - t1) / 1000).toFixed(2)} s · ${sub.replace(/\s+/g, ' ').slice(0, 200)}`);
}
const infoTxt = await page.locator('text=/Model:|Modèle :/').first().innerText().catch(() => '');
console.log(infoTxt.replace(/\s+/g, ' ').slice(0, 220));
if (SHOT) await page.screenshot({ path: SHOT, fullPage: true });
console.log(logs.length ? `console :\n  ${logs.join('\n  ')}` : 'console : rien à signaler');
await browser.close();
