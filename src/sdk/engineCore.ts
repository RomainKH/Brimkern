// Le MOTEUR du SDK, sans aucun DOM — et c'est tout l'intérêt : ce fichier est le seul que charge le
// Web Worker (cf. ./engineWorker.ts). Il vivait dans index.ts, mélangé au widget ; l'en sortir est
// ce qui rend l'inférence déportable hors du thread principal.
//
// Rien ici ne touche `window`, `document` ni le DOM. Vérifié aussi côté moteur : src/lib/webgpu/**
// et src/lib/brik/** n'utilisent que `caches` et `location.search` (tous deux disponibles dans un
// worker) — le moteur était donc DÉJÀ compatible worker, ce qui manquait n'était qu'une frontière.

import { WebGpuEngine } from '../lib/webgpu/kernels';
import { Lfm2Model } from '../lib/webgpu/lfm2Model';
import { RwkvModel } from '../lib/webgpu/rwkvModel';
import { CustomWebModel, type TensorSource } from '../lib/webgpu/model';
import { Gemma4Model } from '../lib/webgpu/gemma4Model';
import { Qwen35Model } from '../lib/webgpu/qwen35Model';
import { gemma4TokenizerFromGguf } from '../lib/gemma4Tokenizer';
import { loadBrikStream, loadGgufStream, prefetchGguf, fetchFullCached, fetchRange } from '../lib/webgpu/source';
import { spanRawTensor } from '../lib/webgpu/layerSpans';
import { formatPrompt, declaredStopIds, TURN_MARKERS } from '../lib/chatFormat';
import { BpeTokenizer } from '../lib/bpeTokenizer';
import { tokenizerFromGguf } from '../lib/ggufTokenizer';
import { sampleFromTopK } from '../lib/webgpu/sampling';
import { parseGguf, type Manifest } from '../lib/webgpu/ggufParser';
import type { ArchType } from '../lib/presets';
import { ggufArchFamilyFor } from '../lib/modelCatalog';

// Dédit de prompt selon l'architecture
function inferArchType(manifest: { arch?: string; metadata?: Record<string, unknown>; tensors?: Record<string, any>; config?: any }): ArchType {
  const arch = manifest.arch || '';
  if (arch === 'lfm2' || manifest.config?.lfm2) return 'lfm2';
  if (arch === 'rwkv7' || manifest.config?.rwkv) return 'rwkv7';
  if (arch === 'qwen2' || arch.includes('qwen2')) return 'qwen';
  // qwen35 AVANT la règle qwen3 (« qwen35 ».includes(« qwen3 ») l'avalait, d'où le chemin transformer).
  if (arch === 'qwen35' || arch === 'qwen3_5') return 'qwen35';
  if (arch === 'qwen3' || arch.includes('qwen3')) return 'qwen3';
  if (arch === 'smollm3' || arch.includes('smollm')) return 'smollm3';
  if (arch === 'mistral3' || arch.includes('mistral')) return 'mistral3';
  if (arch === 'gemma4') return 'gemma4';
  if (arch === 'gemma3') return 'gemma3';
  if (arch === 'gemma' || arch === 'gemma2') return 'gemma';
  if (arch === 'deepseek') return 'deepseek';
  if (arch === 'llama') {
    const emb = manifest.tensors?.['token_embd.weight'];
    const d = manifest.config?.d;
    const vocab = emb && d ? emb.nElems / d : null;
    return vocab && vocab < 100000 ? 'llama2' : 'llama3';
  }
  return 'qwen';
}

// ── Modèle Transformer WebGPU (Qwen 2.5, Qwen Coder, Llama, Gemma, etc.) ─────────
export class TransformerWebModel {
  readonly arch: ArchType;
  private stops: Set<number>;

  constructor(
    private engine: WebGpuEngine,
    private model: CustomWebModel,
    private tok: { encode(s: string): number[]; decode(ids: number[]): string },
    arch: ArchType,
    stops?: number[],
  ) {
    this.arch = arch;
    this.stops = new Set(stops || []);
  }

  residentAvailable(): boolean {
    return true;
  }

  reset(): void {
    this.model.reset();
  }

  unload(): void {
    this.model.unload();
  }

  async generate(
    prompt: string,
    maxTokens: number,
    onToken?: (text: string) => void,
    stop?: () => boolean,
    opts?: { temperature?: number; topK?: number; repeatPenalty?: number; sample?: boolean },
  ): Promise<string> {
    return this.generateResident(prompt, maxTokens, onToken, stop, opts);
  }

  async generateResident(
    prompt: string,
    maxTokens: number,
    onToken?: (text: string) => void,
    stop?: () => boolean,
    opts?: { temperature?: number; topK?: number; repeatPenalty?: number; sample?: boolean },
  ): Promise<string> {
    const sid = 'sdk-gen';
    const penalty = opts?.repeatPenalty ?? (opts?.sample ? 1.3 : 1.0);
    const temp = opts?.temperature ?? 0.55;
    const topK = opts?.topK ?? 40;
    const REPEAT_WINDOW = 64;

    this.model.reset();
    const promptTokens = this.tok.encode(prompt);
    if (!promptTokens.length) return '';

    // 1. Prefill par tranches bornées (256 tokens max par batch)
    const PREFILL_CHUNK = 256;
    let feedPos = 0;
    let currentToken = 0;

    for (let i = 0; i < promptTokens.length; i += PREFILL_CHUNK) {
      if (stop?.()) return '';
      const chunk = promptTokens.slice(i, i + PREFILL_CHUNK);
      const isLast = i + PREFILL_CHUNK >= promptTokens.length;
      if (isLast) {
        const pre = await this.model.topKKV(chunk, feedPos, sid, promptTokens.slice(-REPEAT_WINDOW), penalty);
        currentToken = sampleFromTopK(pre.ids, pre.vals, { temperature: opts?.sample === false ? 0 : temp, topK });
      } else {
        await this.model.topKKV(chunk, feedPos, sid, [], 1.0);
      }
      feedPos += chunk.length;
    }

    if (!Number.isInteger(currentToken) || currentToken < 0) {
      return '';
    }

    if (this.stops.has(currentToken)) {
      return '';
    }

    // 2. Décodage autorégressif
    const generatedTokens: number[] = [currentToken];
    const penaltyWindow: number[] = [...promptTokens.slice(-REPEAT_WINDOW), currentToken].slice(-REPEAT_WINDOW);
    const penaltyCounts = new Map<number, number>();
    for (const id of penaltyWindow) penaltyCounts.set(id, (penaltyCounts.get(id) ?? 0) + 1);

    const pushPenalty = (id: number) => {
      penaltyWindow.push(id);
      penaltyCounts.set(id, (penaltyCounts.get(id) ?? 0) + 1);
      if (penaltyWindow.length > REPEAT_WINDOW) {
        const old = penaltyWindow.shift()!;
        const c = penaltyCounts.get(old)! - 1;
        if (c === 0) penaltyCounts.delete(old); else penaltyCounts.set(old, c);
      }
    };

    if (onToken) onToken(this.tok.decode(generatedTokens));

    for (let step = 1; step < maxTokens; step++) {
      if (stop?.()) break;

      const pos = promptTokens.length + step - 1;
      const stepOut = await this.model.topKKV([currentToken], pos, sid, [...penaltyCounts.keys()], penalty);
      if (!stepOut.ids || !stepOut.ids.length) break;
      const nextToken = sampleFromTopK(stepOut.ids, stepOut.vals, { temperature: opts?.sample === false ? 0 : temp, topK });
      if (!Number.isInteger(nextToken) || nextToken < 0) break;

      if (this.stops.has(nextToken)) break;

      currentToken = nextToken;
      generatedTokens.push(currentToken);
      pushPenalty(currentToken);

      if (onToken) onToken(this.tok.decode(generatedTokens));
    }

    return this.tok.decode(generatedTokens);
  }
}

// Les classes pures partagent le même contrat (load/residentAvailable/generate/generateResident).
export type PureModel = Lfm2Model | RwkvModel | TransformerWebModel;

const TRANSFORMERS_CDN = 'https://esm.sh/@huggingface/transformers@4.2.0';
export const MODELS: Record<string, string> = {
  'lfm2.5-230m': 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
  'qwen-0.5b': 'https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik',
  'coder-0.5b': 'https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf',
  'coder-1.5b': 'https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf',
  'rwkv-0.4b': 'https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik',
  'rwkv-0.1b': 'https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik',
};
const GG: Record<string, string> = { F16: 'f16', F32: 'f32', Q4W: 'q4', Q8W: 'q8', Q3W: 'q3' };

// Fenêtre glissante d'historique : le prefill retraite tout le prompt à chaque tour — sans borne,
// une conversation longue devient linéairement plus lente et gonfle le KV en VRAM. Le 230M n'exploite
// de toute façon pas un contexte profond : on ne formate que les N derniers messages (le system reste).
const HISTORY_WINDOW = 12;

export type Msg = { role: 'user' | 'assistant'; content: string };

export interface LoadProgress { loaded: number; total: number }

// ── PHASES DE CHARGEMENT ────────────────────────────────────────────────────────────────────────
// Des CLÉS stables, pas des phrases : elles s'affichent dans la bulle de statut du widget, qui doit
// pouvoir les rendre dans la langue de la page (elles étaient écrites en français ici, donc un
// widget anglais annonçait « téléchargement du modèle… »). Un intégrateur qui affiche `status` brut
// via preload({ onProgress }) reçoit la clé et la traduit chez lui.
export type LoadPhase = 'init' | 'download' | 'tokenizer' | 'gpu';

// ── Chargement du modèle LFM2, RWKV-7, ou Transformer (GGUF streamé ou BRIK) ──
async function buildModel(url: string, onProgress: (s: LoadPhase, p?: LoadProgress) => void) {
  const engine = new WebGpuEngine();
  // `code` porte la CAUSE, indépendamment de la langue du message : c'est le seul échec que le
  // visiteur peut provoquer sans rien faire de mal (navigateur sans WebGPU), donc le seul que le
  // widget doit pouvoir formuler dans la langue de la page (cf. LIBELLES dans index.ts).
  if (!(await engine.init())) throw Object.assign(new Error('WebGPU is not available in this browser.'), { code: 'no-webgpu' });
  // Perte du device (TDR, mémoire reprise par l'OS, process GPU du navigateur qui tombe) : le
  // singleton est invalidé pour que le PROCHAIN appel reconstruise un moteur neuf. Sans ça, toutes
  // les générations suivantes échouaient définitivement (« WebGPU indisponible » jusqu'au
  // redémarrage du navigateur). Les poids reviennent du cache BRIK : pas de retéléchargement.
  engine.onLost = (info) => {
    console.warn('[brimkern] device GPU perdu (' + (info?.reason || 'unknown') + '): rechargement au prochain appel');
    models.delete(url);
  };
  await engine.selfValidate();
  onProgress('download');

  // Sonde des premiers octets pour détecter le format du fichier (BRIK vs GGUF)
  const probe = await fetchRange(url, 0, 12).catch(() => null);
  const magic = probe?.bytes && probe.bytes.length >= 4 ? String.fromCharCode(...probe.bytes.subarray(0, 4)) : '';
  const isGguf = magic === 'GGUF' || url.toLowerCase().includes('.gguf');

  if (isGguf) {
    // ── Chemin GGUF streamé (Qwen 2.5 Coder, Llama, etc.) ──────────────────────
    await prefetchGguf(url, (p) => {
      onProgress('download', { loaded: p.doneBytes, total: p.totalBytes });
    }).catch((e) => {
      console.warn('[gguf] préchargement par plages indisponible :', e);
    });

    const stream = await loadGgufStream(url).catch((e) => {
      console.warn('[gguf] streaming par plages échoué, repli complet :', e);
      return null;
    });

    let manifest: Manifest;
    let source: TensorSource;
    if (stream) {
      manifest = stream.manifest as unknown as Manifest;
      source = stream.source;
    } else {
      const full = await fetchFullCached(url);
      manifest = await parseGguf(new Blob([full.buffer as ArrayBuffer])) as unknown as Manifest;
      source = { bytes: async (o, l) => full.subarray(o, o + l) };
    }

    const archType = inferArchType(manifest);

    onProgress('tokenizer');
    // Gemma 4 : BPE de style SentencePiece, que tokenizerFromGguf (byte-level) segmenterait faux.
    const ggTok = archType === 'gemma4' ? gemma4TokenizerFromGguf(manifest) : tokenizerFromGguf(manifest);
    let tok: { encode(s: string): number[]; decode(ids: number[]): string };
    const stopIds: number[] = declaredStopIds(manifest.metadata);

    if (ggTok) {
      tok = ggTok.tokenizer;
      if (ggTok.eosId != null) stopIds.push(ggTok.eosId);
      if (ggTok.controlIds?.length) stopIds.push(...ggTok.controlIds);
    } else {
      console.warn('[brimkern] tokenizer GGUF non-BPE : repli transformers.js (CDN)');
      const tf: any = await import(/* @vite-ignore */ TRANSFORMERS_CDN);
      // Le tokenizer de repli DOIT être celui de la famille du vocabulaire (même table que le site,
      // ggufArchFamilyFor). Gemma 3 (SentencePiece sans merges) tombe toujours ici, et il recevait
      // celui de Qwen 2.5 par défaut : des ids hors vocabulaire → charabia (« rem(d rem(d »).
      const emb = (manifest as any).tensors?.['token_embd.weight'];
      const vocab = emb && (manifest as any).config?.d ? emb.nElems / (manifest as any).config.d : null;
      const family = ggufArchFamilyFor(String((manifest as any).arch || ''), vocab);
      const tokId = family?.tokenizerId || (manifest.metadata?.['tokenizer.ggml.id'] as string) || (archType === 'llama3' ? 'unsloth/Llama-3.2-1B-Instruct' : 'Qwen/Qwen2.5-Coder-0.5B-Instruct');
      const hf = await tf.AutoTokenizer.from_pretrained(tokId);
      tok = {
        encode: (s: string) => Array.from((hf(s) as any).input_ids.data as ArrayLike<number | bigint>, (v) => Number(v)),
        decode: (ids: number[]) => hf.decode(ids, { skip_special_tokens: true }) as string,
      };
    }

    // Fin de tour propre à Gemma, absente des métadonnées : sans elle la génération enchaîne un
    // faux tour suivant (mêmes ids que isStopToken dans chatFormat).
    if (archType === 'gemma3') stopIds.push(106, 1);
    if (archType === 'gemma4') stopIds.push(106, 1, 50);
    if (archType === 'gemma') stopIds.push(107, 1);

    const customModel = archType === 'gemma4' ? new Gemma4Model(engine, source, manifest)
      : archType === 'qwen35' ? new Qwen35Model(engine, source, manifest)
      : new CustomWebModel(engine, source, manifest);
    onProgress('gpu');
    await customModel.prewarmGpu((done, total) => {
      onProgress('gpu', { loaded: done, total });
    });

    const core = new TransformerWebModel(engine, customModel, tok, archType, stopIds);
    return { core, engine };
  }

  const loadable: any = await loadBrikStream(url);
  const m = loadable.manifest;
  const kind: 'lfm2' | 'rwkv7' | 'transformer' = m?.config?.lfm2 ? 'lfm2' : m?.config?.rwkv ? 'rwkv7' : 'transformer';

  if (kind === 'transformer') {
    onProgress('tokenizer');
    let tok: { encode(s: string): number[]; decode(ids: number[]): string };
    if (loadable.tokenizer?.json) {
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
    } else {
      const tf: any = await import(/* @vite-ignore */ TRANSFORMERS_CDN);
      const tokId = loadable.tokenizerId || 'Qwen/Qwen2.5-0.5B-Instruct';
      const hf = await tf.AutoTokenizer.from_pretrained(tokId);
      tok = {
        encode: (s: string) => Array.from((hf(s) as any).input_ids.data as ArrayLike<number | bigint>, (v) => Number(v)),
        decode: (ids: number[]) => hf.decode(ids, { skip_special_tokens: true }) as string,
      };
    }

    const customModel = new CustomWebModel(engine, loadable.source, m);
    onProgress('gpu');
    await customModel.prewarmGpu((done, total) => {
      onProgress('gpu', { loaded: done, total });
    });

    const archType = inferArchType(m);
    const stopIds = m.chat?.stopTokenIds || [151645, 151643];
    const core = new TransformerWebModel(engine, customModel, tok, archType, stopIds);
    return { core, engine };
  }
  const emb = m.tensors['token_embd.weight'];
  const bm: any = {
    arch: { ...m.config, arch: kind, vocab: emb ? emb.nElems / m.config.d : 0 },
    tensors: Object.fromEntries(Object.entries(m.tensors).map(([n, tt]: [string, any]) => [n, {
      dtype: GG[tt.type] ?? tt.type, shape: tt.shape, nElems: tt.nElems, shard: 0, offset: tt.offset, byteLength: tt.bytes,
    }])),
    shards: [{ id: 0, file: '', byteLength: 0 }],
    // lfm2 : 7 = <|im_end|>, 2 = <|endoftext|> ; 8/10/12 = ouvertures de blocs outil : LFM2.5
    // hallucine des appels d'outil (et 10 est special=false → s'afficherait brut), le widget n'a
    // pas d'outils. rwkv7 : eos World = 0 ; le manifeste du .brik porte un template VIDE
    // (build-rwkv-brik), c'est donc bien à l'appelant de le poser — comme le fait l'app.
    chat: kind === 'lfm2' ? { template: 'chatml', stopTokenIds: [7, 2, 8, 10, 12] } : { template: 'rwkv', stopTokenIds: [0] },
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
    onProgress('download', { loaded: loadedBytes, total: totalBytes });
    return bytes;
  };
  onProgress('tokenizer');
  if (kind === 'rwkv7') {
    // RWKV : le .brik embarque le VOCAB World ({ tokens, eosId }), pas un tokenizer.json BPE —
    // RwkvModel.load prend le tableau de tokens et tokenise lui-même (RwkvTokenizer interne).
    const world = loadable.tokenizer?.json ? JSON.parse(loadable.tokenizer.json) as { tokens?: string[] } : null;
    if (!world?.tokens) throw new Error('RWKV .brik without its embedded World vocab (rebuild the BRIK).');
    const core = new RwkvModel(engine, bm, rawTensor);
    onProgress('gpu');
    await core.load(world.tokens);
    return { core, engine };
  }
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
  onProgress('gpu');
  await core.load(tok);
  return { core, engine };
}

// ── Singleton moteur par URL de modèle : N consommateurs, 1 init, 1 jeu de poids en VRAM ──
type Loaded = { core: PureModel; engine: WebGpuEngine };
type ModelEntry = {
  promise: Promise<Loaded>;
  status: LoadPhase;                    // dernière phase de progression
  progress?: LoadProgress;              // octets téléchargés / total (phase modèle)
  state: 'loading' | 'ready' | 'error';
  listeners: Set<(s: LoadPhase, p?: LoadProgress) => void>;
};
export const models = new Map<string, ModelEntry>();

// https exigé (un modèle servi en clair pourrait être substitué par un MITM et piloter
// toutes les réponses) ; http toléré pour localhost/dev uniquement.
export function resolveModelUrl(model?: string): string {
  const isUrl = model && (model.startsWith('https://') || /^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(model));
  return isUrl ? model! : MODELS[model || 'lfm2.5-230m'] || MODELS['lfm2.5-230m'];
}

export function getModel(url: string, onProgress?: (s: LoadPhase, p?: LoadProgress) => void): Promise<Loaded> {
  let e = models.get(url);
  if (!e) {
    const entry: ModelEntry = { status: 'init', state: 'loading', listeners: new Set(), promise: null! };
    entry.promise = buildModel(url, (s, p) => { entry.status = s; entry.progress = p; entry.listeners.forEach((f) => f(s, p)); })
      .then((c) => { entry.state = 'ready'; return c; })
      .catch((err) => { entry.state = 'error'; models.delete(url); throw err; });
    models.set(url, entry);
    e = entry;
  }
  if (onProgress) {
    if (e.state !== 'ready') {
      onProgress(e.status, e.progress);
    }
    e.listeners.add(onProgress);
    void e.promise.finally(() => e!.listeners.delete(onProgress)).catch(() => { /* signalé à l'appelant */ });
  }
  return e.promise;
}

// Modèle GARANTI vivant : si le device a été perdu entre-temps (onLost a déjà retiré l'entrée, ou
// la perte n'a pas encore été notifiée), on reconstruit avant de rendre la main.
async function getLiveModel(url: string, onProgress?: (s: string) => void): Promise<PureModel> {
  const first = await getModel(url, onProgress);
  if (!first.engine.lost) return first.core;
  models.delete(url);
  return (await getModel(url, onProgress)).core;
}

// Exécute une génération en encaissant UNE perte de device : on reconstruit le moteur et on rejoue
// le tour (les poids reviennent du cache BRIK). Au-delà, l'erreur remonte à l'appelant.
export async function withDeviceRetry<T>(url: string, fn: (core: PureModel) => Promise<T>): Promise<T> {
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
  // Le modèle recopie parfois le marqueur de FIN de nos fiches : « … sous 5 jours ouvrés. --- END
  // OF NOTES » (vu sur le banc RAG, cas 2 en français). Ce texte est le NÔTRE, pas le sien — il
  // délimite le bloc de connaissance dans le prompt — et il n'a rien à faire dans une bulle de chat.
  // Le strip est ancré en FIN et borné à nos deux marqueurs : il coupe aussi les formes tronquées
  // (« --- END OF »), ce qui évite au passage de les faire clignoter pendant le streaming.
  out = out.replace(/\s*-{2,}\s*(?:E(?:N(?:D(?:\s*O(?:F(?:\s*N(?:O(?:T(?:E(?:S)?)?)?)?)?)?)?)?)?|N(?:O(?:T(?:E(?:S)?)?)?)?)\s*-*\s*$/i, '');
  if (greeted) {
    const stripped = out.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i, '');
    if (stripped.trim()) out = stripped;
  }
  return out.trimEnd();
}

// Coupe le texte au PREMIER marqueur de tour rencontré (TURN_MARKERS). Indispensable pour RWKV :
// le vocab World n'a aucun token spécial de tour, un nouveau tour s'écrit en texte brut « \nUser: »
// — sans cette coupe, le 0.1B enchaîne les deux rôles et toute mesure « interdit » est faussée.
// Appliqué aux deux archis (même filet que l'app) : sur LFM2 les marqueurs sont des tokens stops,
// la coupe n'y est qu'une ceinture.
function cutAtTurnMarker(t: string): { text: string; hit: boolean } {
  let best = -1;
  for (const m of TURN_MARKERS) {
    const i = t.indexOf(m);
    if (i !== -1 && (best === -1 || i < best)) best = i;
  }
  return best === -1 ? { text: t, hit: false } : { text: t.slice(0, best), hit: true };
}

// ── Génération partagée (widget ET sessions) : fenêtre d'historique + résident + nettoyage ──
export async function runTurn(
  core: PureModel,
  history: Msg[],
  system: string,
  maxTokens: number,
  temperature: number,
  onToken?: (t: string) => void,
  isStopped?: () => boolean,
  pinned: Msg[] = [],
): Promise<string> {
  // Les exemples few-shot restent EN TÊTE quoi qu'il arrive ; seule la conversation glisse.
  const arch: ArchType = (core as any).arch || (core instanceof RwkvModel ? 'rwkv7' : 'lfm2');
  const prompt = formatPrompt([...pinned, ...history.slice(-HISTORY_WINDOW)] as any, arch as any, system);
  const greeted = pinned.some((m) => m.role === 'assistant') || history.some((m) => m.role === 'assistant');
  let acc = '';
  let turnHit = false; // marqueur de tour vu → on arrête la génération, pas seulement l'affichage
  // Chemin RÉSIDENT (prefill par tranches + décodage rapide) si dispo, sinon repli forwardToken JS.
  const run = core.residentAvailable?.() ? core.generateResident.bind(core) : core.generate.bind(core);
  // Température modérée : 0.7 divague (small-talk halluciné, banc de Romain), 0.45 s'effondre
  // en écho — 0.55 mesuré comme le bon compromis sur la conv-type de la démo.
  await run(prompt, maxTokens, (t: string) => {
    const cut = cutAtTurnMarker(t);
    if (cut.hit) turnHit = true;
    acc = cleanOutput(cut.text, greeted);
    onToken?.(acc);
  }, () => turnHit || !!isStopped?.(), {
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
