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

import { chunkDocuments, selectChunks, buildKnowledgeBlock, normalizeDocs, type Chunk } from './knowledge';
// Le moteur vit dans ./engineCore (aucun DOM) et tourne, par défaut, dans un Web Worker
// (./workerBackend). index.ts ne garde que le widget, la composition de prompt et l'API publique.
import { resolveModelUrl, type Msg, type LoadProgress } from './engineCore';
import { pickBackend, type EngineBackend, type TurnRequest } from './backend';
import { setWorkerScriptUrl } from './selfUrl';

export type { LoadProgress };

// ── Contexte WORKER ─────────────────────────────────────────────────────────────────────────────
// Ce même bundle est chargé dans le Web Worker par `importScripts` (cf. workerBackend.ts : c'est le
// seul moyen d'exécuter du code cross-origin dans un worker). On détecte donc le côté où l'on se
// trouve DÈS le top-level : dans un worker, on installe l'hôte de messages et on ne fait rien
// d'autre — pas de widget, pas de window.Brimkern (il n'y a ni DOM ni window).
const DANS_UN_WORKER = typeof self !== 'undefined'
  && typeof (self as any).importScripts === 'function'
  && typeof document === 'undefined';
if (DANS_UN_WORKER) void import('./engineWorker');

// ── Backend d'inférence : worker par défaut, thread principal en repli ──────────────────────────
// Créé PARESSEUSEMENT (au premier preload/ask), pas au chargement du script : une page qui pose la
// balise <script> sans que personne n'ouvre le widget ne doit démarrer aucun worker.
let backendPromise: Promise<EngineBackend> | null = null;
let backendNow: EngineBackend | null = null;
let workerPref: boolean | undefined;
function backend(): Promise<EngineBackend> {
  if (!backendPromise) backendPromise = pickBackend(workerPref).then((b) => (backendNow = b, b));
  return backendPromise;
}
/** Où tourne réellement l'inférence — pour le diagnostic et les bancs. */
export const runtime = (): 'worker' | 'main' | 'pending' => backendNow?.kind ?? 'pending';
// Le choix ne vaut que TANT QUE le backend n'existe pas : une fois créé, il est partagé par tous les
// widgets et sessions de la page (un seul worker, un seul jeu de poids en VRAM). On le dit plutôt
// que de laisser croire qu'un second embed() peut changer d'avis.
function appliquerOptions(cfg: { worker?: boolean; workerUrl?: string }): void {
  if (cfg.workerUrl) setWorkerScriptUrl(cfg.workerUrl);
  if (cfg.worker === undefined) return;
  if (backendPromise && workerPref !== cfg.worker) {
    console.warn('[brimkern] option `worker` ignorée : le backend est déjà démarré et partagé par la page.');
    return;
  }
  workerPref = cfg.worker;
}

// Repli UNIQUEMENT (tokenizer.json non-BPE) : le chemin nominal est le BpeTokenizer BUNDLÉ —
// vérifié token-exact vs transformers.js (scripts/test-bpe-tokenizer.cjs). Fini la dépendance
// réseau tierce sur le chemin critique (hors-ligne réel, CSP hôte stricte OK).

// Cadrage appliqué après le prompt de l'intégrateur — VOLONTAIREMENT court : sur un 230M,
// une liste de règles détaillées DÉGRADE (banc 2026-07-22 : « reply only to the last
// message » → le modèle se met à répéter le message en écho). Trois consignes simples :
// pas d'outils (tool-calling halluciné), honnêteté (pas de faits inventés), concision.
const GUARDRAILS =
  '\nAnswer briefly and honestly. If you do not know something, say so: never invent facts or details.' +
  '\nYou have no tools and no internet access: never emit tool calls, reply in plain text only.';

export interface EmbedConfig {
  model?: string;       // clé de MODELS ou URL .brik directe (défaut : lfm2.5-230m)
  system?: string;      // prompt système = le comportement de l'assistant
  title?: string;       // titre du panneau
  greeting?: string;    // 1er message de l'assistant
  accent?: string;      // couleur d'accent (défaut rouge Brimkern)
  maxTokens?: number;   // plafond de génération par réponse
  // Mêmes documents de connaissance que la session programmatique (cf. SessionConfig.knowledge) :
  // c'est le cas d'usage principal du widget — répondre sur le contenu du site qui l'héberge.
  knowledge?: SessionConfig['knowledge'];
  knowledgeBudget?: number;
  examples?: SessionConfig['examples'];  // few-shot : le seul levier de TON efficace sur un 230M
  worker?: SessionConfig['worker'];
  workerUrl?: SessionConfig['workerUrl'];
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
  // DOCUMENTS DE CONNAISSANCE — « l'assistant répond sur MON contenu ».
  // Une chaîne, un objet { title, text }, ou un tableau des deux. Ils sont découpés en passages une
  // fois, puis à CHAQUE question on n'injecte que les 1 à 3 passages les plus proches : le modèle
  // par défaut est un 230M à fenêtre courte, lui verser tout un site dégrade la réponse au lieu de
  // l'améliorer. Rien ne part sur un réseau — le tri est lexical et local (cf. ./knowledge.ts).
  knowledge?: string | { title?: string; text: string } | Array<string | { title?: string; text: string }>;
  // Budget de caractères des passages injectés par tour (défaut 1200 ≈ 300 tokens).
  knowledgeBudget?: number;
  // Inférence dans un Web Worker. **Défaut : false**, et c'est un choix mesuré, pas un oubli : sur
  // le modèle par défaut (230M), le banc ne relève AUCUNE frame perdue sur la page hôte dans l'un ou
  // l'autre bras — la boucle de décodage attend un readback GPU par token et rend donc la main au
  // navigateur. Le worker n'avait rien à débloquer. `true` l'active (débit identique, mesuré) : à
  // envisager pour un modèle plus gros, une machine lente ou une page hôte chargée. Détail de la
  // mesure dans ./backend.ts.
  worker?: boolean;
  // URL du fichier sdk.js à charger dans le worker. Déduite de <script src> automatiquement ; à
  // fournir seulement si le SDK est importé par un bundler (il n'y a alors pas de currentScript).
  workerUrl?: string;
}

export interface AskOptions {
  onToken?: (text: string) => void; // streaming : texte cumulé nettoyé
  signal?: AbortSignal;             // annulation (le tour user est retiré de l'historique)
}


// notes.
function makeSystemBuilder(cfg: { system?: string; knowledge?: SessionConfig['knowledge']; knowledgeBudget?: number; examples?: { user: string; assistant: string }[] }): {
	system: (q: string) => string;
	/** Le message réellement envoyé au modèle pour ce tour (notes + question). L'historique affiché, lui, garde la question seule. */
	userTurn: (q: string) => string;
	/** Tours de démonstration épinglés en tête du prompt (jamais élagués). */
	pinned: Msg[];
} {
	const base = (cfg.system || 'You are a helpful assistant.') + GUARDRAILS;
	const epingler = (ex: { user: string; assistant: string }[]): Msg[] =>
		ex.flatMap((e) => [{ role: 'user' as const, content: e.user }, { role: 'assistant' as const, content: e.assistant }]);
	if (!cfg.knowledge) return { system: () => base, userTurn: (q) => q, pinned: epingler(cfg.examples || []) };
	const chunks: Chunk[] = chunkDocuments(normalizeDocs(cfg.knowledge));
	const budget = cfg.knowledgeBudget ?? 1200;
	const isFr = cfg.system ? /[àéèêîôùç]|bonjour|conseiller|boutique|aide/i.test(cfg.system) : false;
	const consigne = isFr
		? base + '\n\nLe message utilisateur peut inclure des fiches de référence entre des balises ---. Dans ce cas, réponds uniquement à partir de ces fiches en citant fidèlement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n’as pas cette information.'
		: base + '\n\nThe user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.';
	return {
		system: () => consigne,
		userTurn: (q: string) => {
			const b = buildKnowledgeBlock(selectChunks(q, chunks, budget), q).trim();
			return b ? `${b}\n\nQuestion: ${q}` : q;
		},
		pinned: epingler([...knowledgeExamples(isFr), ...(cfg.examples || [])]),
	};
}

// Exemples ÉPINGLÉS quand des documents sont fournis. Ce ne sont pas des fioritures : sur le modèle
// par défaut (230M), la consigne écrite ne suffit pas — mesuré, il refusait « je n'ai pas cette
// information » alors que le passage contenant la réponse était juste au-dessus. La leçon est déjà
// dans le moteur (cf. Lfm2Model.classify) : à cette taille, DÉCRIRE le comportement échoue, le
// MONTRER fonctionne.
function knowledgeExamples(isFr = false): { user: string; assistant: string }[] {
	if (isFr) {
		return [
			{
				user: 'Bonjour !',
				assistant: 'Bonjour ! Comment puis-je vous aider ?',
			},
			{
				user: '--- NOTES ---\n[1] Horaires\nL’atelier est ouvert le jeudi jusqu’à 20h.\n--- END OF NOTES ---\n\nQuestion: Êtes-vous ouverts le jeudi soir ?',
				assistant: 'Oui, l’atelier est ouvert le jeudi jusqu’à 20h.',
			},
			{
				user: 'No reference note matches this question. Say that you do not have this information: do not guess.\n\nQuestion: Qui a gagné la Coupe du Monde 1998 ?',
				assistant: 'Je n’ai pas cette information dans mes fiches.',
			},
		];
	}
	return [
		{
			user: 'Hello!',
			assistant: 'Hello! How can I help you today?',
		},
		{
			user: '--- NOTES ---\n[1] Opening hours\nThe workshop is open on Thursday until 8pm.\n--- END OF NOTES ---\n\nQuestion: Are you open on Thursday evening?',
			assistant: 'Yes: the workshop is open on Thursday until 8pm.',
		},
		{
			user: 'No reference note matches this question. Say that you do not have this information: do not guess.\n\nQuestion: Who won the 1998 World Cup?',
			assistant: 'I do not have that information in my notes.',
		},
	];
}

// ── API programmatique : sessions sans DOM ──
export interface BrimkernSession {
  ask(text: string, opts?: AskOptions): Promise<string>;
  reset(): void;    // vide l'historique, GARDE le moteur chargé
  destroy(): void;
  readonly history: Msg[];
}

function createSession(cfg: SessionConfig = {}): BrimkernSession {
  appliquerOptions(cfg);
  const url = resolveModelUrl(cfg.model);
  const maxTokens = cfg.maxTokens || 220;
  const temperature = cfg.temperature ?? 0.55;
  // Découpage fait UNE FOIS ici (coût en O(taille des documents), aucune raison de le repayer à
  // chaque question) ; la sélection, elle, dépend de la question.
  const promptOf = makeSystemBuilder(cfg);
  const pinned: Msg[] = promptOf.pinned;
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
        // Le dernier tour part AUGMENTÉ des notes ; `history` (affiché, et réutilisé aux tours
        // suivants) garde la question seule — sinon les notes s'accumuleraient dans le contexte.
        const envoye = [...history.slice(0, -1), { role: 'user' as const, content: promptOf.userTurn(text) }];
        const req: TurnRequest = { url, history: envoye, system: promptOf.system(text), maxTokens, temperature, pinned };
        const acc = await (await backend()).turn(req, opts.onToken, opts.signal);
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
  const promptOf = makeSystemBuilder(cfg);
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
      backend()
        .then((b) => b.preload(url, (m, p) => { s.textContent = p?.total ? `${m} ${Math.round(p.loaded / 1048576)} / ${Math.round(p.total / 1048576)} Mo` : m; }))
        .then(() => s.remove())
        .catch((e) => { s.textContent = 'Erreur : ' + (e?.message || e); engaged = false; });
    }
    return backend();
  };

  const send = async () => {
    const text = inEl.value.trim(); if (!text || busy) return;
    busy = true; sendEl.disabled = true; inEl.value = '';
    history.push({ role: 'user', content: text }); addBubble('user', text);
    const bubble = addBubble('assistant', '…');
    try {
      await ensureModel();
      const envoye = [...history.slice(0, -1), { role: 'user' as const, content: promptOf.userTurn(text) }];
      const req: TurnRequest = { url, history: envoye, system: promptOf.system(text), maxTokens, temperature: 0.55, pinned: promptOf.pinned };
      let acc = await (await backend()).turn(req, (t) => {
        bubble.textContent = t || '…'; msgsEl.scrollTop = msgsEl.scrollHeight;
      });
      // Réponse vide (ultra-rare : stop en 1er token) → repli poli plutôt qu'une bulle « (vide) ».
      if (!acc) acc = 'Sorry, I can only answer in plain text here: could you rephrase?';
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

// ── L'API, exportée ET posée sur window ─────────────────────────────────────────────────────────
// Deux publics, un seul objet :
//   • la balise <script> (build IIFE) → window.Brimkern.embed({...})
//   • le paquet npm (build ESM)       → import { embed } from 'brimkern'
// Les membres sont donc de VRAIS exports nommés. Avant, ils n'existaient que sur `window` : le
// build ESM ne publiait que des types, donc rien d'utilisable, et le simple fait d'importer le
// paquet plantait au rendu SERVEUR (« window is not defined ») dans une app Next/Remix/Astro.
// L'affectation à window est donc conditionnée au navigateur, et l'import est devenu inoffensif.

/** Monte le widget de chat (DOM). Attend le document s'il n'est pas encore prêt. */
export const embed = (cfg: EmbedConfig = {}): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('[brimkern] embed() ignoré : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.');
    return;
  }
  appliquerOptions(cfg);
  if (document.body) mountWidget(cfg);
  else window.addEventListener('DOMContentLoaded', () => mountWidget(cfg));
};

export { createSession };

/** One-shot : une question, une réponse, pas d'historique conservé. */
export const generate = async (opts: SessionConfig & { prompt: string; onToken?: (t: string) => void; signal?: AbortSignal }): Promise<string> => {
  // L'API prend UN objet. Appelée à tort comme `generate('question', { model })` — l'erreur la
  // plus naturelle du monde — elle recevait la chaîne en guise d'options : `prompt` valait
  // `undefined`, le modèle répondait littéralement à « undefined » et l'option `model` était
  // ignorée en silence. Une signature qu'on peut mal appeler doit le DIRE, pas deviner.
  if (typeof opts !== 'object' || opts === null || typeof opts.prompt !== 'string') {
    throw new TypeError(
      'Brimkern.generate expects a single object: generate({ prompt: "…", model?, system? }). ' +
      `Received ${typeof opts}${typeof opts === 'object' && opts ? ' without a `prompt` string' : ''}.`,
    );
  }
  const session = createSession(opts);
  return session.ask(opts.prompt, { onToken: opts.onToken, signal: opts.signal });
};

/**
 * Précharge moteur + modèle. onProgress reçoit la phase ET, pendant le téléchargement, les octets :
 * (status, {loaded, total}) — l'intégrateur peut afficher une vraie barre.
 */
export const preload = (opts: { model?: string; worker?: boolean; workerUrl?: string; onProgress?: (status: string, progress?: LoadProgress) => void } = {}): Promise<boolean> => (
  appliquerOptions(opts),
  typeof navigator !== 'undefined' && 'gpu' in navigator
    ? backend().then((b) => b.preload(resolveModelUrl(opts.model), opts.onProgress)).then(() => true).catch(() => false)
    : Promise.resolve(false));

/**
 * État du modèle : 'unavailable' (pas de WebGPU), 'idle' (pas encore demandé — ou device perdu, la
 * prochaine demande recharge), 'loading', 'ready', 'error'.
 */
export const status = (model?: string): 'unavailable' | 'idle' | 'loading' | 'ready' | 'error' => {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) return 'unavailable';
  // Synchrone par contrat : on lit l'état MIROITÉ du backend courant. Tant qu'aucun n'existe (rien
  // n'a encore été demandé), 'idle' — exactement la sémantique d'avant.
  return backendNow?.state(resolveModelUrl(model)) ?? 'idle';
};

// La surface globale de la balise <script>. Conditionnée : importer le paquet côté serveur ne doit
// RIEN faire, pas planter.
if (typeof window !== 'undefined') {
  (window as any).Brimkern = { embed, createSession, generate, preload, status, runtime };
}
