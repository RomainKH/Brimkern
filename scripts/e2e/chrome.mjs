// Chemin du Chromium de Playwright, RÉSOLU au lancement.
// Le dossier de cache porte un numéro de build (chromium-1228, chromium-1223…) qui change quand
// Playwright se met à jour — un chemin en dur dans chaque banc casse le jour où ça arrive, et le
// message d'erreur ne dit pas pourquoi (« executable doesn't exist »). On prend donc le plus récent.
import { readdirSync, rmSync } from 'node:fs';
const base = `${process.env.HOME}/Library/Caches/ms-playwright`;
const dir = readdirSync(base)
  .filter((d) => /^chromium-\d+$/.test(d))
  .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))[0];
if (!dir) throw new Error(`aucun Chromium dans ${base} — lancer « npx playwright install chromium »`);
export const CHROME = `${base}/${dir}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

/**
 * Retire les verrous « Singleton » du profil persistant. Chrome les pose au lancement et les efface
 * en sortant PROPREMENT — un banc interrompu (Ctrl-C, timeout du harnais, kill) les laisse derrière
 * lui, pointant un PID mort. Le lancement suivant ne dit alors rien d'utile : la page s'ouvre, mais
 * le profil (donc le CACHE DU MODÈLE, ~1 Go) n'est pas celui qu'on croit — le modèle se re-télécharge
 * ou ne devient jamais prêt, et le banc meurt sur un « waitForFunction: Timeout » qui accuse le
 * moteur alors que le coupable est un fichier de verrou. Vu le 16/08 : 30 minutes perdues.
 * Sans danger : si un Chrome tourne vraiment sur ce profil, il en repose un aussitôt.
 */
export function nettoyerVerrous(profil) {
  for (const f of ['SingletonLock', 'SingletonCookie', 'SingletonSocket']) {
    try { rmSync(`${profil}/${f}`, { force: true }); } catch { /* absent : rien à faire */ }
  }
}

// Appelé À L'IMPORT sur le profil partagé par tous les bancs (./chrome-profile). C'est un effet de
// bord assumé : le faire ici plutôt que dans chaque banc est le seul moyen qu'un banc ÉCRIT PLUS TARD
// ne puisse pas l'oublier — or l'oublier ne casse rien visiblement, ça fait juste perdre une demi-heure
// sur un faux diagnostic. Un banc qui utiliserait un autre profil appelle nettoyerVerrous() lui-même.
nettoyerVerrous(new URL('./chrome-profile', import.meta.url).pathname);
