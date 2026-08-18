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

// Avertissement UNIQUE quand le code de site manque alors qu'on tourne en production : sans lui, le
// funnel se tait poliment et on croit mesurer pendant des semaines (constaté le 2026-08-13 sur
// brimkern.com — zéro événement émis depuis la mise en ligne). Un dispositif de mesure qu'on croit
// actif et qui ne fait rien est pire que pas de dispositif : il donne une fausse confiance.
let warned = false;
function warnIfSilent(): void {
  if (warned || CODE || typeof window === 'undefined') return;
  const h = window.location.hostname;
  if (h === 'localhost' || h.startsWith('127.')) return; // en local, le silence est voulu
  warned = true;
  console.warn(
    '[metrics] NEXT_PUBLIC_GOATCOUNTER absent : AUCUN événement de funnel n\'est émis. ' +
    'Pour activer : créer un site sur goatcounter.com, poser la variable dans Vercel → Settings → ' +
    'Environment Variables, puis redéployer (la variable est lue AU BUILD).',
  );
}

// `?metrics=1` force l'émission en local (bancs Playwright). Retenu UNE FOIS pour toutes : la
// première navigation client efface la query, et la mesure s'arrêtait alors au milieu d'un banc —
// on croyait à une page vue manquante alors que c'était la garde qui reprenait la main.
let forceLocal = false;
function send(path: string, extra?: Record<string, string>): void {
  warnIfSilent();
  if (!CODE || typeof window === 'undefined') return;
  if (window.location.search.includes('metrics=1')) forceLocal = true;
  // Bancs et dev locaux hors compteurs.
  const h = window.location.hostname;
  if ((h === 'localhost' || h.startsWith('127.')) && !forceLocal) return;
  try {
    const u = new URL(`https://${CODE}.goatcounter.com/count`);
    u.searchParams.set('p', path);
    for (const [k, v] of Object.entries(extra ?? {})) u.searchParams.set(k, v);
    u.searchParams.set('rnd', String(Math.random()).slice(2, 8)); // anti-cache
    new Image().src = u.toString();
  } catch { /* analytics jamais bloquant */ }
}

// PAGES VUES — l'autre moitié de la mesure, et la raison pour laquelle GoatCounter propose un
// `count.js` à coller dans la page. On ne le colle PAS : ce serait un script TIERS sur chaque page
// d'un produit dont l'argument est « rien ne sort de votre navigateur » (on vient de retirer les
// polices Google pour cette raison exacte). count.js ne fait rien d'autre que ce GET d'image — même
// point de collecte, même absence de cookie, mais servi depuis notre code.
// SPA : App Router ne recharge pas la page à la navigation, donc chaque changement d'URL doit être
// signalé explicitement (cf. src/app/PageViews.tsx).
export function pageview(path?: string): void {
  if (typeof window === 'undefined') return;
  // La query fait partie de l'adresse (`/chat?model=…` dit qu'un lien du Hub a été suivi), mais nos
  // propres drapeaux de banc n'ont rien à faire dans les statistiques.
  const brut = path ?? window.location.pathname + window.location.search;
  const p = brut.replace(/([?&])metrics=1&?/, '$1').replace(/[?&]$/, '');
  send(p, {
    // Ce que count.js envoie aussi : titre et référent nourrissent les rapports « pages » et
    // « provenance » — sans eux le tableau de bord ne montre que des chemins nus.
    t: document.title.slice(0, 120),
    r: document.referrer.slice(0, 300),
  });
}

export function metric(name: string, props?: Props): void {
  const parts = Object.entries(props ?? {}).map(([k, v]) =>
    k === 'seconds' && typeof v === 'number' ? bucket(v) : slug(v));
  // `e=true` marque un ÉVÉNEMENT : c'est lui qui range la mesure dans l'onglet dédié du tableau de
  // bord au lieu de la compter comme une page vue. Il vivait dans `send()` quand celui-ci ne servait
  // qu'aux événements ; en le généralisant aux pages vues, le marquage a sauté et les événements
  // sont devenus des « pages » — attrapé par le banc, pas par la relecture.
  send('/e/' + [name, ...parts].join('/'), { e: 'true' });
}

// Une seule émission par session (première réponse, navigateur incompatible…) : re-signaler à
// chaque re-render ou à chaque tour gonflerait les comptes sans rien apprendre de plus.
const fired = new Set<string>();
export function metricOnce(name: string, props?: Props): void {
  if (fired.has(name)) return;
  fired.add(name);
  metric(name, props);
}
