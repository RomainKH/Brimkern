// Le MOTEUR de l'extension : un document offscreen, sous l'origine de l'extension.
//
// Pourquoi ici et pas ailleurs :
// - pas dans la page Google : les poids (~300 Mo) seraient mis en cache sous l'origine de google.com,
//   à la merci d'un « effacer les données du site », et le calcul partagerait le thread de la page ;
// - pas dans le service worker : Chrome le tue après ~30 s d'inactivité, il faudrait remonter les
//   poids sur le GPU à chaque question.
// Le document se ferme de lui-même après IDLE_MS sans question (cf. protocol.ts).

import { createSession } from '../../../src/sdk/index';
import { MODELS } from '../../../src/sdk/engineCore';
import { brikCacheComplete, ggufCacheComplete } from '../../../src/lib/webgpu/source';
import { chooseTier, TIER_MODELS, type Probe, type Tier } from './tier';
import { PORT_NAME, IDLE, IDLE_MS, type AskRequest, type EngineEvent } from './protocol';
import { buildAnswer, buildFollowUp, cleanAnswer } from './answer';

// Un modèle se note « téléchargé » quand il a été chargé une fois en entier. Sans cette marque, la
// vérification du cache demanderait l'en-tête du fichier au Hub — une requête réseau AVANT que
// l'utilisateur ait accepté quoi que ce soit.
const DONE_KEY = (model: string) => `bk-downloaded:${model}`;
const marked = (model: string) => { try { return localStorage.getItem(DONE_KEY(model)) === '1'; } catch { return false; } };
const mark = (model: string) => { try { localStorage.setItem(DONE_KEY(model), '1'); } catch { /* sans stockage : on redemandera */ } };

async function probe(): Promise<Probe> {
  const gpu = (navigator as any).gpu;
  const adapter = gpu ? await gpu.requestAdapter().catch(() => null) : null;
  const conn = (navigator as any).connection;
  return {
    webgpu: !!adapter,
    fallbackAdapter: !!(adapter?.info?.isFallbackAdapter ?? adapter?.isFallbackAdapter),
    deviceMemoryGB: (navigator as any).deviceMemory,
    saveData: conn?.saveData,
    downlinkMbps: typeof conn?.downlink === 'number' ? conn.downlink : undefined,
    effectiveType: conn?.effectiveType,
  };
}

// Chaque format a son plan de plages : brikCacheComplete sur un GGUF répond toujours « non » —
// mesuré le 2026-11-15, le consentement « 1,28 Go » revenait à chaque session alors que le modèle
// était sur le disque (réponse en 16,5 s, sans téléchargement).
const cacheComplete = (url: string) => (/\.gguf(\?|$)/i.test(url) ? ggufCacheComplete(url) : brikCacheComplete(url));

// Le modèle à utiliser : un modèle déjà en cache gagne toujours (aucun téléchargement), sinon le
// palier choisi pour cette machine et ce réseau.
async function pickModel(p: Probe): Promise<{ tier: Tier; cached: boolean } | EngineEvent> {
  const choice = chooseTier(p);
  if (choice.tier === null) return { type: 'unsupported', reason: choice.reason };
  const order: Tier[] = choice.tier === 'standard' ? ['standard', 'light'] : ['light', 'standard'];
  for (const t of order) {
    const m = TIER_MODELS[t].model;
    if (marked(m) && await cacheComplete(MODELS[m] ?? m)) return { tier: t, cached: true };
  }
  return { tier: choice.tier, cached: false };
}

// Une génération à la fois : deux onglets qui demandent ensemble se partagent le même GPU, le
// second attend son tour au lieu de doubler la mémoire.
let queue: Promise<unknown> = Promise.resolve();

let idleTimer: ReturnType<typeof setTimeout> | undefined;
function armIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { chrome.runtime.sendMessage({ type: IDLE }).catch(() => {}); }, IDLE_MS);
}
armIdle();

async function answer(req: AskRequest, send: (e: EngineEvent) => void, signal: AbortSignal) {
  const p = await probe();
  const picked = await pickModel(p);
  if ('type' in picked) return send(picked);
  const { model, bytes } = TIER_MODELS[picked.tier];
  if (!picked.cached && !req.consent) {
    return send({ type: 'need-consent', model, bytes });
  }
  const a = req.followUp
    ? buildFollowUp(model, req.query, req.results, req.history ?? [], req.followUp, req.lang)
    : buildAnswer(model, req.query, req.results, req.lang);
  const session = createSession(a.config);
  session.on('progress', (phase, pr) => send({ type: 'progress', phase, loaded: pr?.loaded, total: pr?.total }));
  // Le chrono part quand le modèle est prêt : « calculée en N s » ne doit pas compter le
  // téléchargement du premier usage (mesuré : 136,5 s affichées pour ~2 s de calcul).
  let t0 = performance.now();
  session.on('ready', () => {
    t0 = performance.now();
    // Format 'web'/'search' (1er tour) : les sources sont les N premiers résultats, connues
    // d'avance — annoncées quand le modèle est prêt, pas pendant le téléchargement.
    if (a.docs) send({ type: 'sources', docs: a.docs });
  });
  try {
    const text = await session.ask(a.text, {
      signal,
      onSources: a.docs || req.followUp ? undefined : (s) => send({ type: 'sources', docs: s.map((x) => x.doc) }),
      onToken: (t) => send({ type: 'token', text: cleanAnswer(t) }),
    });
    mark(model);
    if (!signal.aborted) send({ type: 'done', text: cleanAnswer(text), ms: Math.round(performance.now() - t0) });
  } finally {
    session.destroy();
  }
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== PORT_NAME) return;
  const ctrl = new AbortController();
  let open = true;
  port.onDisconnect.addListener(() => { open = false; ctrl.abort(); });
  const send = (e: EngineEvent) => { if (open) port.postMessage(e); };
  port.onMessage.addListener((msg: AskRequest) => {
    if (msg?.type !== 'ask') return;
    clearTimeout(idleTimer);
    queue = queue
      .then(() => (ctrl.signal.aborted ? undefined : answer(msg, send, ctrl.signal)))
      .catch((e) => send({ type: 'error', message: String(e?.message || e) }))
      .finally(armIdle);
  });
});
