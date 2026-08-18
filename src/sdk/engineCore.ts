// Le MOTEUR du SDK, sans aucun DOM — et c'est tout l'intérêt : ce fichier est le seul que charge le
// Web Worker (cf. ./engineWorker.ts). Il vivait dans index.ts, mélangé au widget ; l'en sortir est
// ce qui rend l'inférence déportable hors du thread principal.
//
// Rien ici ne touche `window`, `document` ni le DOM. Vérifié aussi côté moteur : src/lib/webgpu/**
// et src/lib/brik/** n'utilisent que `caches` et `location.search` (tous deux disponibles dans un
// worker) — le moteur était donc DÉJÀ compatible worker, ce qui manquait n'était qu'une frontière.

import { WebGpuEngine } from '../lib/webgpu/kernels';
import { Lfm2Model } from '../lib/webgpu/lfm2Model';
import { loadBrikStream } from '../lib/webgpu/source';
import { spanRawTensor } from '../lib/webgpu/layerSpans';
import { formatPrompt } from '../lib/chatFormat';
import { BpeTokenizer } from '../lib/bpeTokenizer';

const TRANSFORMERS_CDN = 'https://esm.sh/@huggingface/transformers@4.2.0';
export const MODELS: Record<string, string> = {
  'lfm2.5-230m': 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
};
const GG: Record<string, string> = { F16: 'f16', F32: 'f32', Q4W: 'q4', Q8W: 'q8', Q3W: 'q3' };

// Fenêtre glissante d'historique : le prefill retraite tout le prompt à chaque tour — sans borne,
// une conversation longue devient linéairement plus lente et gonfle le KV en VRAM. Le 230M n'exploite
// de toute façon pas un contexte profond : on ne formate que les N derniers messages (le system reste).
const HISTORY_WINDOW = 12;

export type Msg = { role: 'user' | 'assistant'; content: string };

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
    console.warn('[brimkern] device GPU perdu (' + (info?.reason || 'unknown') + '): rechargement au prochain appel');
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
      `Brimkern SDK v0 runs LFM2 .brik models only: this file's architecture is "${arch}". ` +
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
    console.warn('[brimkern] tokenizer.json non couvert par le BPE bundlé : repli transformers.js (CDN)', e);
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
export const models = new Map<string, ModelEntry>();

// https exigé (un modèle servi en clair pourrait être substitué par un MITM et piloter
// toutes les réponses) ; http toléré pour localhost/dev uniquement.
export function resolveModelUrl(model?: string): string {
  const isUrl = model && (model.startsWith('https://') || /^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(model));
  return isUrl ? model! : MODELS[model || 'lfm2.5-230m'] || MODELS['lfm2.5-230m'];
}

export function getModel(url: string, onProgress?: (s: string, p?: LoadProgress) => void): Promise<Loaded> {
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
export async function withDeviceRetry<T>(url: string, fn: (core: Lfm2Model) => Promise<T>): Promise<T> {
  const core = await getLiveModel(url);
  try {
    return await fn(core);
  } catch (err) {
    const entry = models.get(url);
    const lost = !entry || (await entry.promise.then((l) => l.engine.lost).catch(() => true));
    if (!lost) throw err;
    console.warn('[brimkern] génération interrompue par une perte de device : nouvelle tentative');
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
export async function runTurn(
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
