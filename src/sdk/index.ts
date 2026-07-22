// Brimkern SDK — IA on-device embarquable. Un <script> + Brimkern.embed({...}) monte un widget de
// chat qui tourne un modèle .brik sur le GPU DU VISITEUR (zéro serveur, zéro coût d'inférence, privé,
// offline après le 1er chargement). Réutilise le moteur WGSL + Lfm2Model + le chargeur BRIK de l'app.
// Bundlé en public/sdk.js par scripts/build-sdk.mjs (esbuild IIFE). Le tokenizer (transformers.js) est
// chargé depuis un CDN à l'engagement pour garder sdk.js léger ; le MODÈLE et le calcul restent locaux.

import { WebGpuEngine } from '../lib/webgpu/kernels';
import { Lfm2Model } from '../lib/webgpu/lfm2Model';
import { loadBrikStream } from '../lib/webgpu/source';
import { formatPrompt } from '../lib/chatFormat';

const TRANSFORMERS_CDN = 'https://esm.sh/@huggingface/transformers@4.2.0';
const MODELS: Record<string, string> = {
  'lfm2.5-230m': 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
};
const GG: Record<string, string> = { F16: 'f16', F32: 'f32', Q4W: 'q4', Q8W: 'q8', Q3W: 'q3' };

export interface EmbedConfig {
  model?: string;       // clé de MODELS ou URL .brik directe (défaut : lfm2.5-230m)
  system?: string;      // prompt système = le comportement de l'assistant
  title?: string;       // titre du panneau
  greeting?: string;    // 1er message de l'assistant
  accent?: string;      // couleur d'accent (défaut rouge Brimkern)
  maxTokens?: number;   // plafond de génération par réponse
}

type Msg = { role: 'user' | 'assistant'; content: string };

// ── Chargement du modèle LFM2 (même recette que l'app : BRIK streamé + tokenizer embarqué) ──
async function buildModel(url: string, onProgress: (s: string) => void) {
  const engine = new WebGpuEngine();
  if (!(await engine.init())) throw new Error('WebGPU indisponible sur ce navigateur.');
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
    chat: { template: 'chatml', stopTokenIds: [7] },
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
  return core;
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

function mountWidget(cfg: EmbedConfig) {
  const accent = cfg.accent || '#c72c1e';
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
  let busy = false; let modelPromise: Promise<any> | null = null;

  const addBubble = (role: Msg['role'], text: string) => {
    const d = document.createElement('div'); d.className = `bk-m ${role === 'user' ? 'bk-u' : 'bk-a'}`; d.textContent = text;
    msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight; return d;
  };
  const status = (t: string) => { const b = msgsEl.querySelector('.bk-status') as HTMLElement || addBubble('assistant', t); b.classList.add('bk-status'); b.textContent = t; };

  if (cfg.greeting) { history.push({ role: 'assistant', content: cfg.greeting }); addBubble('assistant', cfg.greeting); }

  // Chargement mémoïsé : le clic du fab ET le 1er envoi attendent LA MÊME promesse (sinon l'envoi
  // récupérait un modèle null pendant que le chargement était encore en cours).
  const ensureModel = () => {
    if (!modelPromise) {
      const url = cfg.model && cfg.model.startsWith('http') ? cfg.model : MODELS[cfg.model || 'lfm2.5-230m'] || MODELS['lfm2.5-230m'];
      const s = addBubble('assistant', 'Initialisation…'); s.classList.add('bk-status');
      modelPromise = buildModel(url, (m) => { s.textContent = m; })
        .then((c) => { s.remove(); return c; })
        .catch((e) => { s.textContent = 'Erreur : ' + (e?.message || e); modelPromise = null; throw e; });
    }
    return modelPromise;
  };

  const send = async () => {
    const text = inEl.value.trim(); if (!text || busy) return;
    busy = true; sendEl.disabled = true; inEl.value = '';
    history.push({ role: 'user', content: text }); addBubble('user', text);
    const bubble = addBubble('assistant', '…');
    try {
      const c = await ensureModel();
      const prompt = formatPrompt(history as any, 'lfm2' as any, cfg.system || '');
      let acc = '';
      // Chemin RÉSIDENT (prefill 1 submit + décodage rapide) si dispo, sinon repli forwardToken JS.
      const run = c.residentAvailable?.() ? c.generateResident.bind(c) : c.generate.bind(c);
      await run(prompt, maxTokens, (t: string) => { acc = t; bubble.textContent = t || '…'; msgsEl.scrollTop = msgsEl.scrollHeight; }, undefined, { sample: true, temperature: 0.7, topK: 40, repeatPenalty: 1.3 });
      bubble.textContent = acc || '(vide)';
      history.push({ role: 'assistant', content: acc });
    } catch (e: any) { bubble.textContent = 'Erreur : ' + (e?.message || String(e)); }
    finally { busy = false; sendEl.disabled = false; inEl.focus(); }
  };

  fab.onclick = () => { const open = panel.classList.toggle('bk-open'); if (open) { inEl.focus(); void ensureModel(); } };
  (panel.querySelector('.bk-x') as HTMLElement).onclick = () => panel.classList.remove('bk-open');
  sendEl.onclick = () => void send();
  inEl.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); } };
}

function escapeHtml(s: string) { return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string)); }

// API globale
(window as any).Brimkern = {
  embed: (cfg: EmbedConfig = {}) => { if (document.body) mountWidget(cfg); else window.addEventListener('DOMContentLoaded', () => mountWidget(cfg)); },
};
