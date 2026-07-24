// Événements funnel — backend GoatCounter (gratuit, sans cookie, open source), car le plan Vercel
// Hobby ignore les événements custom de track(). Quatre événements situent le décrochage des
// visiteurs : navigateur incompatible ? accueil vu puis fermé ? téléchargement abandonné ?
//   webgpu_unsupported  → le navigateur ne peut rien exécuter (raison : API absente / adapter null)
//   model_load_started  → un chargement démarre (modèle + provenance : accueil, sidebar, fichier…)
//   model_loaded        → le modèle répond présent (durée de chargement bucketée)
//   first_reply         → première réponse complète de la session (le « wow » a eu lieu)
// Aucune donnée utilisateur : ni prompt, ni contenu — des noms de modèles et des durées. Pas de
// script tiers ni de cookie : un GET image vers <code>.goatcounter.com/count (exactement ce que
// fait leur count.js), et GoatCounter ne stocke aucune donnée personnelle.
// ACTIVATION : créer un compte sur goatcounter.com (code du site = sous-domaine choisi), poser
// NEXT_PUBLIC_GOATCOUNTER=<code> dans Vercel → Settings → Environment Variables, redéployer.
// Sans la variable : no-op total (rien ne part, rien dans la console).
const CODE = process.env.NEXT_PUBLIC_GOATCOUNTER;

type Props = Record<string, string | number | boolean>;

// GoatCounter agrège par CHEMIN (pas de propriétés arbitraires) : les valeurs sont encodées dans
// le path — /e/model_loaded/lfm2.5-230m/0-15s — en gardant la cardinalité basse (durées bucketées).
const slug = (v: string | number | boolean) =>
  String(v).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'na';

const bucket = (s: number) => (s <= 15 ? '0-15s' : s <= 60 ? '15-60s' : s <= 180 ? '1-3min' : '3min-plus');

function send(path: string): void {
  if (!CODE || typeof window === 'undefined') return;
  // Bancs et dev locaux hors compteurs (?metrics=1 pour forcer pendant un banc Playwright).
  const h = window.location.hostname;
  if ((h === 'localhost' || h.startsWith('127.')) && !window.location.search.includes('metrics=1')) return;
  try {
    const u = new URL(`https://${CODE}.goatcounter.com/count`);
    u.searchParams.set('p', path);
    u.searchParams.set('e', 'true'); // marqué « événement » (onglet dédié du dashboard)
    u.searchParams.set('rnd', String(Math.random()).slice(2, 8)); // anti-cache
    new Image().src = u.toString();
  } catch { /* analytics jamais bloquant */ }
}

export function metric(name: string, props?: Props): void {
  const parts = Object.entries(props ?? {}).map(([k, v]) =>
    k === 'seconds' && typeof v === 'number' ? bucket(v) : slug(v));
  send('/e/' + [name, ...parts].join('/'));
}

// Une seule émission par session (première réponse, navigateur incompatible…) : re-signaler à
// chaque re-render ou à chaque tour gonflerait les comptes sans rien apprendre de plus.
const fired = new Set<string>();
export function metricOnce(name: string, props?: Props): void {
  if (fired.has(name)) return;
  fired.add(name);
  metric(name, props);
}
