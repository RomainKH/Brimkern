// Enrichissement de prompt vidéo par LFM2.5 (idée Romain : l'IA rend la scène moins statique).
// Charge LFM2 (résident, rapide depuis le fix forwardToken) sur l'ENGINE DÉJÀ ouvert du pipeline
// vidéo, et réécrit le prompt court de l'utilisateur en une scène vive orientée MOUVEMENT, avant CLIP.
// Lazy : rien n'est chargé tant que l'enrichissement n'est pas demandé.

import type { WebGpuEngine } from '../kernels';
import { Lfm2Model } from '../lfm2Model';
import { loadBrikStream } from '../source';

const GG: Record<string, string> = { F16: 'f16', F32: 'f32', Q4W: 'q4', Q8W: 'q8', Q3W: 'q3' };

// LFM2.5-230M est petit → on le pilote en FEW-SHOT ChatML (la recette qui marche à ce poids, cf.
// démo sentiment). Deux exemples montrent la transformation attendue : garder le sujet, AJOUTER du
// mouvement explicite (sujet en action + mouvement de caméra + éléments qui bougent). Sortie = une phrase.
const SYS = 'Rewrite the idea into ONE short video prompt that adds MOTION: the subject actively moving, camera movement, and moving background elements. Keep the original subject. One sentence, under 30 words. Output only the prompt.';
const SHOTS: [string, string][] = [
  ['a cat on a windowsill', 'a cat leaps down from a windowsill, tail flicking, sheer curtains billowing as the camera slowly pans, warm afternoon light'],
  ['a city skyline at night', 'a city skyline at night, cars streaking light-trails along the avenues, clouds drifting fast overhead, the camera cranes slowly upward'],
];
// Descripteurs de mouvement ajoutés si LFM échoue (vide/écho) — garantit que l'enrichissement n'est JAMAIS un no-op.
const MOTION_FALLBACK = 'dynamic motion, moving camera, flowing movement, cinematic action';

export interface PromptEnricher { enrich(userPrompt: string): Promise<string>; }

// Construit un Lfm2Model prêt à générer depuis un .brik (même recette que useModelEngine/lfm2-test).
export async function loadPromptEnricher(engine: WebGpuEngine, url: string, onProgress?: (s: string) => void): Promise<PromptEnricher> {
  onProgress?.('Chargement de LFM (enrichissement)…');
  const loadable = await loadBrikStream(url);
  const m = loadable.manifest as any;
  if (m.config?.arch !== 'lfm2' && m.arch !== 'lfm2') { /* le manifeste aplati porte l'arch dans config */ }
  const emb = m.tensors['token_embd.weight'];
  const bm = {
    arch: { ...m.config, arch: 'lfm2', vocab: emb ? emb.nElems / m.config.d : 0 },
    tensors: Object.fromEntries(Object.entries(m.tensors).map(([n, tt]: [string, any]) => [n, {
      dtype: GG[tt.type] ?? tt.type, shape: tt.shape, nElems: tt.nElems, shard: 0, offset: tt.offset, byteLength: tt.bytes,
    }])),
    shards: [{ id: 0, file: '', byteLength: 0 }],
    chat: { template: 'chatml', stopTokenIds: [7, 2, 8, 10, 12] }, // + blocs outil (hallucination tool-call LFM2.5)
  } as any;
  const rawTensor = async (name: string) => { const tt = m.tensors[name]; if (!tt) throw new Error(`tenseur absent : ${name}`); return loadable.source.bytes(tt.offset, tt.bytes); };
  const { PreTrainedTokenizer } = await import('@huggingface/transformers');
  const hf = new PreTrainedTokenizer(JSON.parse(loadable.tokenizer!.json!), JSON.parse(loadable.tokenizer!.config!));
  const tok = {
    encode: (s: string) => Array.from((hf(s) as any).input_ids.data as ArrayLike<number | bigint>, (v) => Number(v)),
    decode: (ids: number[]) => hf.decode(ids, { skip_special_tokens: true }) as string,
  };
  const core = new Lfm2Model(engine, bm, rawTensor);
  await core.load(tok);

  const enrich = async (userPrompt: string): Promise<string> => {
    const u = userPrompt.trim();
    const shots = SHOTS.map(([q, a]) => `<|im_start|>user\n${q}<|im_end|>\n<|im_start|>assistant\n${a}<|im_end|>\n`).join('');
    const prompt = `<|im_start|>system\n${SYS}<|im_end|>\n${shots}<|im_start|>user\n${u}<|im_end|>\n<|im_start|>assistant\n`;
    const out = await core.generate(prompt, 64, undefined, undefined, { sample: true, temperature: 0.6, topK: 40, repeatPenalty: 1.3 });
    const clean = out.replace(/^["'`\s]+|["'`\s]+$/g, '').split('\n')[0].trim();
    // Enrichi = plus long ET différent du prompt d'origine. Sinon (LFM vide/écho) on AJOUTE des
    // descripteurs de mouvement au prompt d'origine — jamais un no-op qui aurait fait perdre du temps.
    const enriched = clean.length >= u.length + 8 && clean.toLowerCase() !== u.toLowerCase();
    return enriched ? clean : `${u.replace(/[.,\s]+$/, '')}, ${MOTION_FALLBACK}`;
  };
  onProgress?.('LFM prêt (enrichissement).');
  return { enrich };
}
