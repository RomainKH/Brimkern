// Événements funnel (Vercel Analytics). Quatre événements suffisent à situer le décrochage des
// visiteurs : navigateur incompatible ? accueil vu puis fermé ? téléchargement abandonné ?
//   webgpu_unsupported  → le navigateur ne peut rien exécuter (raison : API absente / adapter null)
//   model_load_started  → un chargement démarre (modèle + provenance : accueil, sidebar, fichier…)
//   model_loaded        → le modèle répond présent (durée de chargement en secondes)
//   first_reply         → première réponse complète de la session (le « wow » a eu lieu)
// Aucune donnée utilisateur : ni prompt, ni contenu — seulement des noms de modèles et des durées.
// ⚠️ Les événements custom Vercel exigent le plan Pro ; sur Hobby ils sont ignorés côté serveur
// (aucun coût, aucune erreur) — les pageviews restent visibles dans tous les cas.
import { track } from '@vercel/analytics';

type Props = Record<string, string | number | boolean>;

// En build prod servi hors Vercel (bancs Playwright locaux), le script insights est absent et
// track() peut jeter — un événement d'analytics ne doit JAMAIS casser l'app.
export function metric(name: string, props?: Props): void {
  try { track(name, props); } catch { /* analytics jamais bloquant */ }
}

// Une seule émission par session (première réponse, navigateur incompatible…) : re-signaler à
// chaque re-render ou à chaque tour gonflerait les comptes sans rien apprendre de plus.
const fired = new Set<string>();
export function metricOnce(name: string, props?: Props): void {
  if (fired.has(name)) return;
  fired.add(name);
  metric(name, props);
}
