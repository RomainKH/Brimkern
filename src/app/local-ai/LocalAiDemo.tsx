"use client";

// Démo LIVE du produit sur /local-ai : le visiteur choisit un cas d'usage (= un prompt prédéfini),
// tape une entrée, et le modèle léger (LFM2.5-230M, moteur v2 hybride) génère EN LOCAL sur son GPU.
// Lazy-load au clic (jamais dans le chemin critique de la page → PageSpeed intact), gating WebGPU,
// streaming. Montre exactement ce qu'un client embarquerait. Lfm2Model reste pur (réutilisable SDK).
// ⚠️ Licence LFM 1.0 (usage commercial libre sous 10 M$ de CA) — remplaçant Apache à l'étude ;
// repli mesuré : RWKV G1a 0.4B (304 Mo, Apache) ou retour RWKV G1 0.1B (classification seule).

import { useState, useRef, useEffect } from 'react';
import { Cpu, Loader2, Play, Sparkles } from 'lucide-react';
import { useT } from '@/lib/i18n';

// Hébergé sur HF (uploadé le 2026-07-21 avec la LICENSE LFM 1.0, byte-exact avec
// public/models/lfm25-230m-q4.brik, CORS *) — même dépôt que le preset du chat.
const MODEL_URL = 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik';

// Few-shot MULTI-TOURS ChatML (la forme instruct-native de LFM2.5) — bancs q4 du 2026-07-21 :
// le few-shot « texte brut » et le priming de l'assistant dégradent, les tours d'exemple non.
const turn = (u: string, a: string) => `<|im_start|>user\n${u}<|im_end|>\n<|im_start|>assistant\n${a}<|im_end|>\n`;
const ask = (u: string) => `<|im_start|>user\n${u}<|im_end|>\n<|im_start|>assistant\n`;

type UseCase =
  | { key: string; label: string; example: string; kind: 'classify'; labels: string[]; tmpl: (s: string) => string }
  // mustAppearInInput : garde-fou anti-hallucination — la sortie doit être un extrait du texte de
  // l'utilisateur (sinon le 0.1B recopie un email des exemples few-shot quand l'entrée n'en a pas).
  // sample+multiline : génération libre échantillonnée (temp/top-k/pénalité — le greedy boucle).
  // stopAt : coupe et arrête dès que le flux contient ce marqueur (ex. le modèle enchaîne « User: »).
  | { key: string; label: string; example: string; kind: 'generate'; nTokens: number; mustAppearInInput?: boolean; notFound?: string; sample?: boolean; multiline?: boolean; stopAt?: string; tmpl: (s: string) => string };

export default function LocalAiDemo() {
  const t = useT();
  // LFM2.5-230M (bancs q4 du 2026-07-21, scratchpad lfm2-brik-constrained.cjs) : sentiment few-shot
  // multi-tours + contraint = 12/12 ; extraction email générative FR + garde-fou regex = 4/4 ;
  // chat FR propre. Retirés car sous le niveau : détection de langue (6/9 max — le RWKV 0.1B faisait
  // 10/10, chaque modèle a ses forces), traduction, reformulation. Prompts figés = évalués — ne pas
  // « améliorer » sans re-passer le banc.
  const cases: UseCase[] = [
    { key: 'sentiment', label: t('Sentiment (pos/neg)', 'Sentiment (pos/nég)'), kind: 'classify',
      labels: ['Positive', 'Negative'],
      example: t('Best purchase I have made all year!', 'Le meilleur achat de toute l’année !'),
      tmpl: (s) => turn('Is this customer review positive or negative? Answer with one word.\n"I absolutely love this product!"', 'Positive')
        + turn('Is this customer review positive or negative? Answer with one word.\n"Really disappointed, it broke immediately."', 'Negative')
        + ask(`Is this customer review positive or negative? Answer with one word.\n"${s}"`) },
    { key: 'extract', label: t('Extract email', 'Extraire l’email'), kind: 'generate', nTokens: 24,
      mustAppearInInput: true, notFound: t('No email found in the text.', 'Aucun email trouvé dans le texte.'),
      example: t('Reach our sales team: sales@brimkern.dev (Mon-Fri)', 'Merci d’envoyer la facture à facturation@lekern.fr avant vendredi'),
      tmpl: (s) => ask(`Quel est l’email dans ce texte ? Réponds uniquement avec l’email. Texte : « ${s} »`) },
    // Le chat qui a motivé le passage au 230M : réponses françaises propres (« Salut ! Comment
    // puis-je t'aider ? »), arrêt naturel sur <|im_end|> (stops du manifest).
    // ⚠️ L'exemple DEMANDE une longueur, et le budget la couvre. Avant : « une petite histoire sur
    // un robot » sous un plafond de 100 tokens — le modèle partait dans un récit et la démo
    // s'arrêtait au milieu d'une phrase (signalé par Romain). Une vitrine ne doit pas montrer une
    // réponse tronquée : soit on borne la demande, soit on relève le plafond. Ici les deux, la
    // borne d'abord — c'est aussi la bonne pratique qu'on veut enseigner à qui intègre le SDK.
    { key: 'free', label: t('Chat (light model)', 'Chat (modèle léger)'), kind: 'generate', nTokens: 140, sample: true, multiline: true,
      example: t('Tell me a story about a robot, in three sentences.', 'Raconte-moi une histoire de robot, en trois phrases.'),
      tmpl: (s) => ask(s) },
  ];

  const [uc, setUc] = useState(cases[0]);
  const [input, setInput] = useState(cases[0].example);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready' | 'gen'>('idle');
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState('');
  const [err, setErr] = useState('');
  const modelRef = useRef<{
    generate: (p: string, n: number, onTok?: (s: string) => void, stop?: () => boolean, opts?: { sample?: boolean }) => Promise<string>;
    classify: (p: string, labels: string[]) => Promise<{ label: string; scores: { label: string; logit: number }[] }>;
  } | null>(null);

  // WebGPU vérifié APRÈS montage (sinon SSR≠client → erreur d'hydratation). null = pas encore su.
  const [supported, setSupported] = useState<boolean | null>(null);
  // Microtask (même motif que BackLink) : un setState SYNCHRONE dans le corps d'un effet déclenche
  // une cascade de rendus — React 19 le signale comme une erreur. Le premier rendu reste identique
  // au HTML serveur (`null` = « pas encore su »), ce qui est exactement le repli voulu.
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setSupported(typeof navigator !== 'undefined' && !!(navigator as Navigator & { gpu?: unknown }).gpu);
    });
    return () => { active = false; };
  }, []);

  const ensureModel = async () => {
    if (modelRef.current) return modelRef.current;
    setPhase('loading'); setErr('');
    const { WebGpuEngine } = await import('@/lib/webgpu/kernels');
    const { parseBrik } = await import('@/lib/brik/container');
    const { computeShardBases } = await import('@/lib/brik/loader');
    const { Lfm2Model } = await import('@/lib/webgpu/lfm2Model');
    const engine = new WebGpuEngine();
    if (!(await engine.init())) throw new Error(t('WebGPU unavailable on this device/browser.', 'WebGPU indisponible sur cet appareil/navigateur.'));
    await engine.selfValidate();
    // Fetch avec progression (une seule fois — ensuite en cache navigateur).
    const res = await fetch(MODEL_URL);
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const total = Number(res.headers.get('content-length')) || 0;
    const reader = res.body.getReader(); const chunks: Uint8Array[] = []; let got = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); got += value.length; if (total) setProgress(Math.round((got / total) * 100)); }
    const buf = new Uint8Array(got); let off = 0; for (const c of chunks) { buf.set(c, off); off += c.length; }
    const parsed = parseBrik(buf);
    const bases = computeShardBases(parsed.manifest.shards);
    const rawTensor = async (name: string) => { const tt = parsed.manifest.tensors[name]; const o = bases[tt.shard] + tt.offset; return parsed.data.subarray(o, o + tt.byteLength); };
    // Tokenizer EMBARQUÉ dans le .brik (tokenizer.json + config → transformers.js, zéro fetch HF).
    const { PreTrainedTokenizer } = await import('@huggingface/transformers');
    const tk = new PreTrainedTokenizer(JSON.parse(parsed.manifest.tokenizer.json!), JSON.parse(parsed.manifest.tokenizer.config || '{}'));
    const tokenizer = {
      encode: (s: string) => Array.from(tk.encode(s)).map(Number),
      decode: (ids: number[]) => tk.decode(ids, { skip_special_tokens: true }),
    };
    const model = new Lfm2Model(engine, parsed.manifest, rawTensor);
    await model.load(tokenizer);
    modelRef.current = model; setPhase('ready');
    return model;
  };

  const run = async () => {
    try {
      const model = await ensureModel();
      setPhase('gen'); setOutput('');
      if (uc.kind === 'classify') {
        // Classification contrainte : la réponse est TOUJOURS une des étiquettes (jamais de dérive).
        const res = await model.classify(uc.tmpl(input.trim()), uc.labels);
        setOutput(res.label);
      } else if (uc.multiline) {
        // Texte libre : tout le flux, coupé au marqueur d'arrêt (faux tour « User: » enchaîné).
        let done = false;
        await model.generate(uc.tmpl(input.trim()), uc.nTokens, (txt) => {
          const cut = uc.stopAt ? txt.split(uc.stopAt)[0] : txt;
          setOutput(cut.trim());
          if (uc.stopAt && txt.includes(uc.stopAt)) done = true;
        }, () => done, { sample: uc.sample });
      } else {
        let done = false;
        // Sortie = la 1re ligne générée ; on arrête dès que la ligne est finie.
        const full = await model.generate(uc.tmpl(input.trim()), uc.nTokens, (txt) => {
          setOutput(txt.split('\n')[0].trim());
          if (txt.includes('\n')) done = true;
        }, () => done);
        const ans = full.split('\n')[0].trim();
        // Garde-fou : une « extraction » absente du texte source est une hallucination → on le dit.
        // La réponse peut habiller l'email (« Email : x@y.z ») → on isole l'email par regex avant de
        // vérifier sa présence dans le texte de l'utilisateur.
        if (uc.mustAppearInInput) {
          const mail = ans.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)?.[0];
          if (mail && input.toLowerCase().includes(mail.toLowerCase())) setOutput(mail);
          else setOutput(uc.notFound || '—');
        } else setOutput(ans);
      }
      setPhase('ready');
    } catch (e) { setErr((e as Error)?.message || String(e)); setPhase('idle'); }
  };

  if (supported === false) {
    return (
      <div id="demo" className="card" style={{ padding: 20, marginTop: 40, borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 6 }}><Sparkles size={18} style={{ color: 'var(--accent-text)' }} /> {t('Live demo', 'Démo live')}</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>{t('This demo needs a WebGPU browser (Chrome, Edge, Safari 18+, Firefox). Open it there to try the AI running fully on your machine.', 'Cette démo nécessite un navigateur WebGPU (Chrome, Edge, Safari 18+, Firefox). Ouvre-la là pour essayer l’IA qui tourne entièrement sur ta machine.')}</p>
      </div>
    );
  }

  return (
    <div id="demo" style={{ marginTop: 48, scrollMarginTop: 20 }}>
      <div style={{ borderTop: '2px solid var(--accent)', paddingTop: 20 }}>
        <span className="section-title" style={{ fontSize: 12, color: 'var(--accent-text)' }}>{t('Live demo — runs on your GPU', 'Démo live — tourne sur ton GPU')}</span>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '8px 0 6px' }}>{t('Try it — classify, extract & chat, on your GPU', 'Essaie — classer, extraire & discuter, sur ton GPU')}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 16px' }}>
          {t('An ultra-light model (LFM2.5 230M) classifies, extracts and chats — in French too — shaped by a prompt, running entirely in your browser (no server). First run downloads it once (~149 MB), then it’s cached & offline.', 'Un modèle ultra-léger (LFM2.5 230M) classe, extrait et discute — même en français — façonné par un prompt, tournant entièrement dans ton navigateur (sans serveur). La 1ʳᵉ fois il se télécharge (~149 Mo), ensuite c’est en cache & hors ligne.')}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {cases.map((c) => (
          <button key={c.key} onClick={() => { setUc(c); setInput(c.example); setOutput(''); }}
            style={{ fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
              // --accent-solid et non --accent : ce fond porte du texte BLANC (cf. le jeton dans
              // globals.css — sur l'encre, --accent n'y tient que 4,29:1).
              background: uc.key === c.key ? 'var(--accent-solid)' : 'var(--bg-card)', color: uc.key === c.key ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${uc.key === c.key ? 'var(--accent-solid)' : 'var(--border-color)'}` }}>
            {c.label}
          </button>
        ))}
      </div>

      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3}
        aria-label={t('Message to send to the local model', 'Message à envoyer au modèle local')}
        className="input-control" style={{ width: '100%', fontSize: 14, resize: 'vertical' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
        <button className="btn btn-primary" onClick={run} disabled={phase === 'loading' || phase === 'gen' || !input.trim()}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '9px 16px' }}>
          {phase === 'loading' || phase === 'gen' ? <Loader2 size={15} className="spin" /> : <Play size={15} />}
          {phase === 'loading' ? `${t('Loading model', 'Chargement du modèle')} ${progress}%`
            : phase === 'gen' ? t('Generating…', 'Génération…')
            : modelRef.current ? t('Generate', 'Générer') : t('Activate & generate', 'Activer & générer')}
        </button>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
          <Cpu size={13} /> {t('LFM2.5 230M · int4 · 100% local', 'LFM2.5 230M · int4 · 100% local')}
        </span>
      </div>

      {err && <p style={{ color: 'var(--error)', fontSize: 13 }}>{err}</p>}
      {(output || phase === 'gen') && (
        <div data-testid="demo-out" className="card" style={{ padding: 16, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.5, color: 'var(--text-primary)', minHeight: 48 }}>
          {output || '…'}
        </div>
      )}
    </div>
  );
}
