// Brimkern SDK — IA on-device embarquable. Un <script> + Brimkern.embed({...}) monte un widget de
// chat qui tourne un modèle .brik sur le GPU DU VISITEUR (zéro serveur, zéro coût d'inférence, privé,
// offline après le 1er chargement). Réutilise le moteur WGSL + Lfm2Model + le chargeur BRIK de l'app.
// Bundlé en public/sdk.js par scripts/build-sdk.mjs (esbuild IIFE). Le tokenizer (transformers.js) est
// chargé depuis un CDN à l'engagement pour garder sdk.js léger ; le MODÈLE et le calcul restent locaux.
//
// Deux surfaces :
//  - Brimkern.embed(cfg)          → le widget de chat clé en main (DOM)
//  - Brimkern.createSession(cfg)  → API programmatique sans DOM : session.ask()/reset()/destroy(),
//    plus Brimkern.generate() (one-shot), Brimkern.preload() et Brimkern.status().
// Le MOTEUR est un singleton par URL de modèle : N widgets/sessions = 1 seule init WebGPU,
// un seul jeu de poids en VRAM (les embed() multiples ré-initialisaient tout — cause de
// saturations GPU constatées en prod, 2026-07-29).

import { WebGpuEngine } from '../lib/webgpu/kernels';
import { Lfm2Model } from '../lib/webgpu/lfm2Model';
import { loadBrikStream } from '../lib/webgpu/source';
import { formatPrompt } from '../lib/chatFormat';

const TRANSFORMERS_CDN = 'https://esm.sh/@huggingface/transformers@4.2.0';
const MODELS: Record<string, string> = {
  'lfm2.5-230m': 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
};
const GG: Record<string, string> = { F16: 'f16', F32: 'f32', Q4W: 'q4', Q8W: 'q8', Q3W: 'q3' };

// Fenêtre glissante d'historique : le prefill retraite tout le prompt à chaque tour — sans borne,
// une conversation longue devient linéairement plus lente et gonfle le KV en VRAM. Le 230M n'exploite
// de toute façon pas un contexte profond : on ne formate que les N derniers messages (le system reste).
const HISTORY_WINDOW = 12;

// Cadrage appliqué après le prompt de l'intégrateur — VOLONTAIREMENT court : sur un 230M,
// une liste de règles détaillées DÉGRADE (banc 2026-07-22 : « reply only to the last
// message » → le modèle se met à répéter le message en écho). Trois consignes simples :
// pas d'outils (tool-calling halluciné), honnêteté (pas de faits inventés), concision.
const GUARDRAILS =
  '\nAnswer briefly and honestly. If you do not know something, say so — never invent facts or details.' +
  '\nYou have no tools and no internet access: never emit tool calls, reply in plain text only.';

export interface EmbedConfig {
  model?: string;       // clé de MODELS ou URL .brik directe (défaut : lfm2.5-230m)
  system?: string;      // prompt système = le comportement de l'assistant
  title?: string;       // titre du panneau
  greeting?: string;    // 1er message de l'assistant
  accent?: string;      // couleur d'accent (défaut rouge Brimkern)
  maxTokens?: number;   // plafond de génération par réponse
}

export interface SessionConfig {
  model?: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  // Exemples FEW-SHOT (tours user/assistant de démonstration). Épinglés en tête de chaque prompt,
  // jamais élagués par la fenêtre d'historique. C'est la forme instruct-native de LFM2.5 et le seul
  // levier efficace pour lui faire tenir un style : sur un 230M, DÉCRIRE le style dans le prompt
  // système ne suffit pas (il paraphrase la consigne) — le MONTRER fonctionne (cf. Lfm2Model.classify,
  // bancs q4 2026-07-21). 2 à 3 exemples suffisent ; au-delà on paye du prefill pour rien.
  examples?: { user: string; assistant: string }[];
}

export interface AskOptions {
  onToken?: (text: string) => void; // streaming : texte cumulé nettoyé
  signal?: AbortSignal;             // annulation (le tour user est retiré de l'historique)
}

type Msg = { role: 'user' | 'assistant'; content: string };

// ── Chargement du modèle LFM2 (même recette que l'app : BRIK streamé + tokenizer embarqué) ──
async function buildModel(url: string, onProgress: (s: string) => void) {
  const engine = new WebGpuEngine();
  if (!(await engine.init())) throw new Error('WebGPU indisponible sur ce navigateur.');
  // Perte du device (TDR, mémoire reprise par l'OS, process GPU du navigateur qui tombe) : le
  // singleton est invalidé pour que le PROCHAIN appel reconstruise un moteur neuf. Sans ça, toutes
  // les générations suivantes échouaient définitivement (« WebGPU indisponible » jusqu'au
  // redémarrage du navigateur). Les poids reviennent du cache BRIK : pas de retéléchargement.
  engine.onLost = (info) => {
    console.warn('[brimkern] device GPU perdu (' + (info?.reason || 'unknown') + ') — rechargement au prochain appel');
    models.delete(url);
  };
  await engine.selfValidate();
  onProgress('téléchargement du modèle…');
  const loadable: any = await loadBrikStream(url);
  const m = loadable.manifest;
  const emb = m.tensors['token_embd.weight'];
  const bm: any = {
    arch: { ...m.config, arch: 'lfm2', vocab: emb ? emb.nElems / m.config.d : 0 },
    tensors: Object.fromEntries(Object.entries(m.tensors).map(([n, tt]: [string, any]) => [n, {
      dtype: GG[tt.type] ?? tt.type, shape: tt.shape, nElems: tt.nElems, shard: 0, offset: tt.offset, byteLength: tt.bytes,
    }])),
    shards: [{ id: 0, file: '', byteLength: 0 }],
    // 7 = <|im_end|>, 2 = <|endoftext|> ; 8/10/12 = ouvertures de blocs outil (<|tool_list/call/response_start|>) :
    // LFM2.5 hallucine des appels d'outil (et 10 est special=false → s'afficherait brut), le widget n'a pas d'outils.
    chat: { template: 'chatml', stopTokenIds: [7, 2, 8, 10, 12] },
  };
  const rawTensor = async (name: string) => {
    const tt = m.tensors[name]; if (!tt) throw new Error(`tenseur absent : ${name}`);
    return loadable.source.bytes(tt.offset, tt.bytes);
  };
  onProgress('tokenizer…');
  const url2 = TRANSFORMERS_CDN;
  const tf: any = await import(/* @vite-ignore */ url2);
  const hf = new tf.PreTrainedTokenizer(JSON.parse(loadable.tokenizer.json), JSON.parse(loadable.tokenizer.config));
  const tok = {
    encode: (s: string) => Array.from((hf(s) as any).input_ids.data as ArrayLike<number | bigint>, (v) => Number(v)),
    decode: (ids: number[]) => hf.decode(ids, { skip_special_tokens: true }) as string,
  };
  const core = new Lfm2Model(engine, bm, rawTensor);
  onProgress('poids sur le GPU…');
  await core.load(tok);
  return { core, engine };
}

// ── Singleton moteur par URL de modèle : N consommateurs, 1 init, 1 jeu de poids en VRAM ──
type Loaded = { core: Lfm2Model; engine: WebGpuEngine };
type ModelEntry = {
  promise: Promise<Loaded>;
  status: string;                       // dernière phase de progression
  state: 'loading' | 'ready' | 'error';
  listeners: Set<(s: string) => void>;
};
const models = new Map<string, ModelEntry>();

// https exigé (un modèle servi en clair pourrait être substitué par un MITM et piloter
// toutes les réponses) ; http toléré pour localhost/dev uniquement.
function resolveModelUrl(model?: string): string {
  const isUrl = model && (model.startsWith('https://') || /^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(model));
  return isUrl ? model! : MODELS[model || 'lfm2.5-230m'] || MODELS['lfm2.5-230m'];
}

function getModel(url: string, onProgress?: (s: string) => void): Promise<Loaded> {
  let e = models.get(url);
  if (!e) {
    const entry: ModelEntry = { status: 'initialisation…', state: 'loading', listeners: new Set(), promise: null! };
    entry.promise = buildModel(url, (s) => { entry.status = s; entry.listeners.forEach((f) => f(s)); })
      .then((c) => { entry.state = 'ready'; return c; })
      .catch((err) => { entry.state = 'error'; models.delete(url); throw err; });
    models.set(url, entry);
    e = entry;
  }
  if (onProgress) {
    onProgress(e.status);
    e.listeners.add(onProgress);
    void e.promise.finally(() => e!.listeners.delete(onProgress)).catch(() => { /* signalé à l'appelant */ });
  }
  return e.promise;
}

// Modèle GARANTI vivant : si le device a été perdu entre-temps (onLost a déjà retiré l'entrée, ou
// la perte n'a pas encore été notifiée), on reconstruit avant de rendre la main.
async function getLiveModel(url: string, onProgress?: (s: string) => void): Promise<Lfm2Model> {
  const first = await getModel(url, onProgress);
  if (!first.engine.lost) return first.core;
  models.delete(url);
  return (await getModel(url, onProgress)).core;
}

// Exécute une génération en encaissant UNE perte de device : on reconstruit le moteur et on rejoue
// le tour (les poids reviennent du cache BRIK). Au-delà, l'erreur remonte à l'appelant.
async function withDeviceRetry<T>(url: string, fn: (core: Lfm2Model) => Promise<T>): Promise<T> {
  const core = await getLiveModel(url);
  try {
    return await fn(core);
  } catch (err) {
    const entry = models.get(url);
    const lost = !entry || (await entry.promise.then((l) => l.engine.lost).catch(() => true));
    if (!lost) throw err;
    console.warn('[brimkern] génération interrompue par une perte de device — nouvelle tentative');
    models.delete(url);
    return fn(await getLiveModel(url));
  }
}

// Ceinture d'affichage : gomme tout marqueur spécial résiduel (<|...|>), et après le premier
// tour, la re-salutation réflexe du 230M (« Hello! … » en tête de CHAQUE réponse — mimétisme
// de l'accueil dans l'historique ; une consigne anti-salutation dégradait le modèle, le strip
// mécanique est déterministe). Gated sur la ponctuation : « Hello everyone » etc. intact.
// Le strip ne doit JAMAIS vider la réponse : quand le modèle répond littéralement « Bonjour ! » et
// rien d'autre, le retirer laissait une chaîne vide (bulle « (vide) » côté widget, et un ask() qui
// rend '' côté API). Dans ce cas on garde le texte tel quel.
function cleanOutput(s: string, greeted: boolean): string {
  let out = s.replace(/<\|[a-z_]+\|>/g, '');
  if (greeted) {
    const stripped = out.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i, '');
    if (stripped.trim()) out = stripped;
  }
  return out.trimEnd();
}

// ── Génération partagée (widget ET sessions) : fenêtre d'historique + résident + nettoyage ──
async function runTurn(
  core: Lfm2Model,
  history: Msg[],
  system: string,
  maxTokens: number,
  temperature: number,
  onToken?: (t: string) => void,
  isStopped?: () => boolean,
  pinned: Msg[] = [],
): Promise<string> {
  // Les exemples few-shot restent EN TÊTE quoi qu'il arrive ; seule la conversation glisse.
  const prompt = formatPrompt([...pinned, ...history.slice(-HISTORY_WINDOW)] as any, 'lfm2' as any, system);
  const greeted = pinned.some((m) => m.role === 'assistant') || history.some((m) => m.role === 'assistant');
  let acc = '';
  // Chemin RÉSIDENT (prefill par tranches + décodage rapide) si dispo, sinon repli forwardToken JS.
  const run = core.residentAvailable?.() ? core.generateResident.bind(core) : core.generate.bind(core);
  // Température modérée : 0.7 divague (small-talk halluciné, banc de Romain), 0.45 s'effondre
  // en écho — 0.55 mesuré comme le bon compromis sur la conv-type de la démo.
  await run(prompt, maxTokens, (t: string) => { acc = cleanOutput(t, greeted); onToken?.(acc); }, isStopped, {
    sample: true, temperature, topK: 40, repeatPenalty: 1.3,
  });
  return acc;
}

// ── API programmatique : sessions sans DOM ──
export interface BrimkernSession {
  ask(text: string, opts?: AskOptions): Promise<string>;
  reset(): void;    // vide l'historique, GARDE le moteur chargé
  destroy(): void;
  readonly history: Msg[];
}

function createSession(cfg: SessionConfig = {}): BrimkernSession {
  const url = resolveModelUrl(cfg.model);
  const maxTokens = cfg.maxTokens || 220;
  const temperature = cfg.temperature ?? 0.55;
  const system = (cfg.system || 'You are a helpful assistant.') + GUARDRAILS;
  const pinned: Msg[] = (cfg.examples || []).flatMap((e) => [
    { role: 'user' as const, content: e.user },
    { role: 'assistant' as const, content: e.assistant },
  ]);
  let history: Msg[] = [];
  let busy = false;
  let destroyed = false;

  return {
    async ask(text: string, opts: AskOptions = {}): Promise<string> {
      if (destroyed) throw new Error('session détruite');
      if (busy) throw new Error('génération déjà en cours sur cette session');
      busy = true;
      history.push({ role: 'user', content: text });
      try {
        const acc = await withDeviceRetry(url, (core) =>
          runTurn(core, history, system, maxTokens, temperature, opts.onToken, () => !!opts.signal?.aborted, pinned));
        if (opts.signal?.aborted) { history.pop(); return ''; } // tour annulé : l'historique reste propre
        history.push({ role: 'assistant', content: acc });
        return acc;
      } catch (e) {
        history.pop(); // le tour user n'a pas abouti
        throw e;
      } finally { busy = false; }
    },
    reset() { history = []; },
    destroy() { destroyed = true; history = []; },
    get history() { return history.slice(); },
  };
}

// ── Widget (DOM vanilla, styles scoppés .bk-*) ──
function injectStyles(accent: string) {
  if (document.getElementById('bk-style')) return;
  const s = document.createElement('style');
  s.id = 'bk-style';
  s.textContent = `
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:${accent};color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#f2efe8;border:1px solid #e0dccf;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#1a1a1a}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:#fff;border-bottom:1px solid #ece8dd;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:${accent}}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:#8b887f;font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:${accent};color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:#fff;border:1px solid #ece8dd;border-bottom-left-radius:4px}
  .bk-foot{padding:10px;border-top:1px solid #ece8dd;background:#fff;display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid #e0dccf;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:#fff;color:#1a1a1a;resize:none;outline:none}
  .bk-in:focus{border-color:${accent}}
  .bk-send{background:${accent};color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:#8b887f;text-align:center;padding:4px 8px 8px}
  `;
  document.head.appendChild(s);
}

// L'accent est interpolé dans une feuille de style : on ne laisse passer qu'une couleur CSS
// valide (un hôte qui relaierait une entrée utilisateur ne peut pas injecter de règles CSS).
function safeAccent(accent?: string) {
  if (!accent) return '#c72c1e';
  if (/^#[0-9a-fA-F]{3,8}$/.test(accent)) return accent;
  try { if (typeof CSS !== 'undefined' && CSS.supports('color', accent) && !/[{};()]/.test(accent)) return accent; } catch { /* below */ }
  return '#c72c1e';
}

function mountWidget(cfg: EmbedConfig) {
  const accent = safeAccent(cfg.accent);
  const title = cfg.title || 'Assistant';
  const maxTokens = cfg.maxTokens || 220;
  injectStyles(accent);

  const fab = document.createElement('button');
  fab.className = 'bk-fab'; fab.setAttribute('aria-label', 'Ouvrir le chat'); fab.textContent = '💬';
  const panel = document.createElement('div');
  panel.className = 'bk-panel';
  panel.innerHTML = `
    <div class="bk-hd"><span class="bk-dot"></span><span>${escapeHtml(title)}</span><button class="bk-x" aria-label="Fermer">×</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="Écris un message…"></textarea><button class="bk-send">↑</button></div>
    <div class="bk-note">IA locale — tourne sur votre GPU, aucune donnée envoyée.</div>`;
  document.body.appendChild(fab); document.body.appendChild(panel);

  const msgsEl = panel.querySelector('.bk-msgs') as HTMLElement;
  const inEl = panel.querySelector('.bk-in') as HTMLTextAreaElement;
  const sendEl = panel.querySelector('.bk-send') as HTMLButtonElement;
  const history: Msg[] = [];
  let busy = false;
  let engaged = false; // le chargement (partagé) n'est rattaché à ce widget qu'à l'engagement

  const addBubble = (role: Msg['role'], text: string) => {
    const d = document.createElement('div'); d.className = `bk-m ${role === 'user' ? 'bk-u' : 'bk-a'}`; d.textContent = text;
    msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight; return d;
  };

  if (cfg.greeting) { history.push({ role: 'assistant', content: cfg.greeting }); addBubble('assistant', cfg.greeting); }

  // Chargement via le singleton partagé : le clic du fab ET le 1er envoi rattachent LA MÊME
  // promesse ; une bulle de statut suit la progression (et se retire quand le modèle est prêt).
  const url = resolveModelUrl(cfg.model);
  const ensureModel = () => {
    if (!engaged) {
      engaged = true;
      const s = addBubble('assistant', 'Initialisation…'); s.classList.add('bk-status');
      getModel(url, (m) => { s.textContent = m; })
        .then(() => s.remove())
        .catch((e) => { s.textContent = 'Erreur : ' + (e?.message || e); engaged = false; });
    }
    return getLiveModel(url);
  };

  const send = async () => {
    const text = inEl.value.trim(); if (!text || busy) return;
    busy = true; sendEl.disabled = true; inEl.value = '';
    history.push({ role: 'user', content: text }); addBubble('user', text);
    const bubble = addBubble('assistant', '…');
    try {
      await ensureModel();
      const system = (cfg.system || 'You are a helpful assistant.') + GUARDRAILS;
      let acc = await withDeviceRetry(url, (c) => runTurn(c, history, system, maxTokens, 0.55, (t) => {
        bubble.textContent = t || '…'; msgsEl.scrollTop = msgsEl.scrollHeight;
      }));
      // Réponse vide (ultra-rare : stop en 1er token) → repli poli plutôt qu'une bulle « (vide) ».
      if (!acc) acc = 'Sorry, I can only answer in plain text here — could you rephrase?';
      bubble.textContent = acc;
      history.push({ role: 'assistant', content: acc });
    } catch (e: any) { bubble.textContent = 'Erreur : ' + (e?.message || String(e)); }
    finally { busy = false; sendEl.disabled = false; inEl.focus(); }
  };

  fab.onclick = () => { const open = panel.classList.toggle('bk-open'); if (open) { inEl.focus(); void ensureModel(); } };
  (panel.querySelector('.bk-x') as HTMLElement).onclick = () => panel.classList.remove('bk-open');
  sendEl.onclick = () => void send();
  inEl.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); } };
}

function escapeHtml(s: string) { return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)); }

// API globale
(window as any).Brimkern = {
  embed: (cfg: EmbedConfig = {}) => { if (document.body) mountWidget(cfg); else window.addEventListener('DOMContentLoaded', () => mountWidget(cfg)); },

  // ── API programmatique (sans DOM) ──
  createSession,

  // One-shot : une question, une réponse, pas d'historique conservé.
  generate: async (opts: SessionConfig & { prompt: string; onToken?: (t: string) => void; signal?: AbortSignal }): Promise<string> => {
    const session = createSession(opts);
    return session.ask(opts.prompt, { onToken: opts.onToken, signal: opts.signal });
  },

  // Précharge moteur + modèle (progression structurée). À appeler au chargement de la page hôte.
  preload: (opts: { model?: string; onProgress?: (status: string) => void } = {}): Promise<boolean> =>
    typeof navigator !== 'undefined' && 'gpu' in navigator
      ? getModel(resolveModelUrl(opts.model), opts.onProgress).then(() => true).catch(() => false)
      : Promise.resolve(false),

  // État du modèle : 'unavailable' (pas de WebGPU), 'idle' (pas encore demandé — ou device perdu, la
  // prochaine demande recharge), 'loading', 'ready', 'error'.
  status: (model?: string): 'unavailable' | 'idle' | 'loading' | 'ready' | 'error' => {
    if (typeof navigator === 'undefined' || !('gpu' in navigator)) return 'unavailable';
    const e = models.get(resolveModelUrl(model));
    return e ? e.state : 'idle';
  },
};
