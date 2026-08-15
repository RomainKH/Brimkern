// Chemin du Chromium de Playwright, RÉSOLU au lancement.
// Le dossier de cache porte un numéro de build (chromium-1228, chromium-1223…) qui change quand
// Playwright se met à jour — un chemin en dur dans chaque banc casse le jour où ça arrive, et le
// message d'erreur ne dit pas pourquoi (« executable doesn't exist »). On prend donc le plus récent.
import { readdirSync } from 'node:fs';
const base = `${process.env.HOME}/Library/Caches/ms-playwright`;
const dir = readdirSync(base)
  .filter((d) => /^chromium-\d+$/.test(d))
  .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))[0];
if (!dir) throw new Error(`aucun Chromium dans ${base} — lancer « npx playwright install chromium »`);
export const CHROME = `${base}/${dir}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
