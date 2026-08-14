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
import { spanRawTensor } from '../lib/webgpu/layerSpans';
import { formatPrompt } from '../lib/chatFormat';
import { chunkDocuments, selectChunks, buildKnowledgeBlock, normalizeDocs, type Chunk } from './knowledge';
import { BpeTokenizer } from '../lib/bpeTokenizer';

// Repli UNIQUEMENT (tokenizer.json non-BPE) : le chemin nominal est le BpeTokenizer BUNDLÉ —
// vérifié token-exact vs transformers.js (scripts/test-bpe-tokenizer.cjs). Fini la dépendance
// réseau tierce sur le chemin critique (hors-ligne réel, CSP hôte stricte OK).
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
  // Mêmes documents de connaissance que la session programmatique (cf. SessionConfig.knowledge) :
  // c'est le cas d'usage principal du widget — répondre sur le contenu du site qui l'héberge.
  knowledge?: SessionConfig['knowledge'];
  knowledgeBudget?: number;
  examples?: SessionConfig['examples'];  // few-shot : le seul levier de TON efficace sur un 230M
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
}

export interface AskOptions {
  onToken?: (text: string) => void; // streaming : texte cumulé nettoyé
  signal?: AbortSignal;             // annulation (le tour user est retiré de l'historique)
}

type Msg = { role: 'user' | 'assistant'; content: string };

export interface LoadProgress { loaded: number; total: number }

// ── Chargement du modèle LFM2 (même recette que l'app : BRIK streamé + tokenizer embarqué) ──
async function buildModel(url: string, onProgress: (s: string, p?: LoadProgress) => void) {
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
  // Garde EXPLICITE avant de construire quoi que ce soit. Sans elle, l'erreur venait du fond du
  // moteur (« manifest sans profil lfm2 ») : exacte, mais illisible pour un intégrateur qui a juste
  // pointé une URL. On dit ce qui a été trouvé, ce qui est supporté, et où aller.
  if (!m?.config?.lfm2) {
    const arch = m?.arch ?? m?.config?.arch ?? 'unknown';
    throw new Error(
      `Brimkern SDK v0 runs LFM2 .brik models only — this file's architecture is "${arch}". ` +
      'Use the default model (omit `model`), or convert/pick an LFM2 .brik. ' +
      'Full model support lives in the app: https://brimkern.com/chat',
    );
  }
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
  // Progression en OCTETS : Lfm2Model.load lit chaque tenseur via rawTensor — on compte au fil de
  // l'eau (le point de rebond n°1 d'un widget qui télécharge ~150 Mo chez un visiteur tiers était
  // une phase muette). Total = somme des tailles du manifeste.
  const totalBytes = Object.values(m.tensors as Record<string, { bytes: number }>).reduce((a, t) => a + t.bytes, 0);
  let loadedBytes = 0;
  // Lecture PAR SPAN DE COUCHE (spanRawTensor), pas tenseur par tenseur : c'est le découpage que le
  // préchargement utilise, donc les mêmes octets sous les mêmes clés de cache. Le widget demandait
  // 148 plages HTTP pour un modèle de 149 Mo là où 18 suffisent — sur le site d'un tiers, chaque
  // aller-retour se paie. (Même défaut corrigé dans l'app le 2026-08-13 : deux découpages pour les
  // mêmes octets, donc un fichier téléchargé deux fois.)
  const readSpan = spanRawTensor(m.tensors, loadable.source);
  const rawTensor = async (name: string) => {
    const tt = m.tensors[name]; if (!tt) throw new Error(`tenseur absent : ${name}`);
    const bytes = await readSpan(name);
    loadedBytes += tt.bytes;
    onProgress('téléchargement du modèle…', { loaded: loadedBytes, total: totalBytes });
    return bytes;
  };
  onProgress('tokenizer…');
  // Tokenizer BUNDLÉ (BpeTokenizer, token-exact vs transformers.js) ; CDN en repli si la config
  // n'est pas couverte (modèle non-BPE) — jamais sur le chemin nominal LFM2.5.
  let tok: { encode(s: string): number[]; decode(ids: number[]): string };
  try {
    const bpe = new BpeTokenizer(loadable.tokenizer.json);
    tok = { encode: (s) => bpe.encode(s), decode: (ids) => bpe.decode(ids) };
  } catch (e) {
    console.warn('[brimkern] tokenizer.json non couvert par le BPE bundlé — repli transformers.js (CDN)', e);
    const tf: any = await import(/* @vite-ignore */ TRANSFORMERS_CDN);
    const hf = new tf.PreTrainedTokenizer(JSON.parse(loadable.tokenizer.json), JSON.parse(loadable.tokenizer.config));
    tok = {
      encode: (s: string) => Array.from((hf(s) as any).input_ids.data as ArrayLike<number | bigint>, (v) => Number(v)),
      decode: (ids: number[]) => hf.decode(ids, { skip_special_tokens: true }) as string,
    };
  }
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
  progress?: LoadProgress;              // octets téléchargés / total (phase modèle)
  state: 'loading' | 'ready' | 'error';
  listeners: Set<(s: string, p?: LoadProgress) => void>;
};
const models = new Map<string, ModelEntry>();

// https exigé (un modèle servi en clair pourrait être substitué par un MITM et piloter
// toutes les réponses) ; http toléré pour localhost/dev uniquement.
function resolveModelUrl(model?: string): string {
  const isUrl = model && (model.startsWith('https://') || /^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(model));
  return isUrl ? model! : MODELS[model || 'lfm2.5-230m'] || MODELS['lfm2.5-230m'];
}

function getModel(url: string, onProgress?: (s: string, p?: LoadProgress) => void): Promise<Loaded> {
  let e = models.get(url);
  if (!e) {
    const entry: ModelEntry = { status: 'initialisation…', state: 'loading', listeners: new Set(), promise: null! };
    entry.promise = buildModel(url, (s, p) => { entry.status = s; entry.progress = p; entry.listeners.forEach((f) => f(s, p)); })
      .then((c) => { entry.state = 'ready'; return c; })
      .catch((err) => { entry.state = 'error'; models.delete(url); throw err; });
    models.set(url, entry);
    e = entry;
  }
  if (onProgress) {
    onProgress(e.status, e.progress);
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


// Composition du prompt, au même endroit pour la session programmatique ET pour le widget — il était
// reconstruit dans les deux, ce qui garantissait qu'un ajout (les documents de connaissance)
// n'atterrisse que dans l'un des deux.
//
// Deux sorties, et la seconde est celle qui compte : les passages retenus sont collés JUSTE AVANT
// la question, dans le tour utilisateur — pas dans le prompt système. Mesuré sur le modèle par
// défaut (230M) : avec les notes dans le système, il refusait « je n'ai pas accès à cette
// information » alors que le passage sélectionné contenait la réponse (score 0,935). Un petit
// modèle regarde ce qui est PROCHE du point de génération ; le prompt système, après quelques tours
// d'historique, est déjà loin. Le système ne garde donc que la CONSIGNE, l'utilisateur porte les
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
	const consigne = base +
		'\n\nThe user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.';
	return {
		system: () => consigne,
		userTurn: (q: string) => buildKnowledgeBlock(selectChunks(q, chunks, budget)).trim() + `\n\nQuestion: ${q}`,
		// Les exemples de connaissance viennent EN PREMIER : ils montrent la mécanique (notes →
		// réponse), ceux de l'intégrateur montrent ensuite le ton. L'ordre compte pour un petit modèle.
		pinned: epingler([...knowledgeExamples(), ...(cfg.examples || [])]),
	};
}

// Exemples ÉPINGLÉS quand des documents sont fournis. Ce ne sont pas des fioritures : sur le modèle
// par défaut (230M), la consigne écrite ne suffit pas — mesuré, il refusait « je n'ai pas cette
// information » alors que le passage contenant la réponse était juste au-dessus. La leçon est déjà
// dans le moteur (cf. Lfm2Model.classify) : à cette taille, DÉCRIRE le comportement échoue, le
// MONTRER fonctionne. Deux exemples suffisent, un par cas : la note répond, ou aucune note ne
// correspond.
function knowledgeExamples(): { user: string; assistant: string }[] {
	return [
		{
			user: '--- NOTES ---\n[1] Opening hours\nThe workshop is open on Thursday until 8pm.\n--- END OF NOTES ---\n\nQuestion: Are you open on Thursday evening?',
			assistant: 'Yes — the workshop is open on Thursday until 8pm.',
		},
		{
			user: 'No reference note matches this question.\n\nQuestion: Who won the 1998 World Cup?',
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
        const acc = await withDeviceRetry(url, (core) =>
          runTurn(core, envoye, promptOf.system(text), maxTokens, temperature, opts.onToken, () => !!opts.signal?.aborted, pinned));
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
      getModel(url, (m, p) => { s.textContent = p?.total ? `${m} ${Math.round(p.loaded / 1048576)} / ${Math.round(p.total / 1048576)} Mo` : m; })
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
      const envoye = [...history.slice(0, -1), { role: 'user' as const, content: promptOf.userTurn(text) }];
      let acc = await withDeviceRetry(url, (c) => runTurn(c, envoye, promptOf.system(text), maxTokens, 0.55, (t) => {
        bubble.textContent = t || '…'; msgsEl.scrollTop = msgsEl.scrollHeight;
      }, undefined, promptOf.pinned));
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
export const preload = (opts: { model?: string; onProgress?: (status: string, progress?: LoadProgress) => void } = {}): Promise<boolean> =>
  typeof navigator !== 'undefined' && 'gpu' in navigator
    ? getModel(resolveModelUrl(opts.model), opts.onProgress).then(() => true).catch(() => false)
    : Promise.resolve(false);

/**
 * État du modèle : 'unavailable' (pas de WebGPU), 'idle' (pas encore demandé — ou device perdu, la
 * prochaine demande recharge), 'loading', 'ready', 'error'.
 */
export const status = (model?: string): 'unavailable' | 'idle' | 'loading' | 'ready' | 'error' => {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) return 'unavailable';
  const e = models.get(resolveModelUrl(model));
  return e ? e.state : 'idle';
};

// La surface globale de la balise <script>. Conditionnée : importer le paquet côté serveur ne doit
// RIEN faire, pas planter.
if (typeof window !== 'undefined') {
  (window as any).Brimkern = { embed, createSession, generate, preload, status };
}
