"use client";

// Bac à sable live dans /docs/sdk : teste createSession() ou generateJson() sur le GPU du visiteur
// sans créer de projet. Rien n'est téléchargé tant qu'on ne clique pas sur « Exécuter ».

import { useRef, useState } from 'react';
import { Play, Square, Copy, Check } from 'lucide-react';
import { useT, useLocale } from '@/lib/i18n';

type Mode = 'chat' | 'json';

declare global {
  interface Window {
    Brimkern?: {
      createSession: (cfg: Record<string, unknown>) => {
        ask: (text: string, opts?: { onToken?: (t: string) => void; signal?: AbortSignal }) => Promise<string>;
        destroy: () => void;
      };
      generateJson: (opts: Record<string, unknown>) => Promise<{ data: unknown; raw: string; attempts: number }>;
    };
  }
}

let sdkLoader: Promise<NonNullable<Window['Brimkern']>> | null = null;
function loadSdk(): Promise<NonNullable<Window['Brimkern']>> {
  if (typeof window !== 'undefined' && window.Brimkern) return Promise.resolve(window.Brimkern);
  if (!sdkLoader) {
    sdkLoader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/sdk.js';
      s.async = true;
      s.onload = () => (window.Brimkern ? resolve(window.Brimkern) : reject(new Error('Brimkern SDK failed to initialize')));
      s.onerror = () => reject(new Error('Failed to load /sdk.js'));
      document.head.appendChild(s);
    });
  }
  return sdkLoader;
}

const DEFAULT_JSON_SCHEMA = JSON.stringify({
  type: 'object',
  required: ['category', 'urgency', 'summary'],
  properties: {
    category: { type: 'string', enum: ['shipping', 'billing', 'product', 'other'] },
    urgency: { type: 'string', enum: ['low', 'medium', 'high'] },
    summary: { type: 'string' },
  },
}, null, 2);

export default function SdkPlayground() {
  const t = useT();
  const { locale } = useLocale();
  const fr = locale === 'fr';

  const [mode, setMode] = useState<Mode>('chat');
  const [system, setSystem] = useState(
    fr ? 'Tu es l’assistant produit. Réponds en 1 à 2 phrases depuis les fiches.'
      : 'You are a concise product assistant. Answer in 1 to 2 sentences from the notes.',
  );
  const [knowledge, setKnowledge] = useState(
    fr ? 'Livraison gratuite en France dès 60 € (2 à 3 jours ouvrés). Retours gratuits sous 30 jours.'
      : 'Free EU shipping above €60 (2–3 business days). Free returns within 30 days.',
  );
  const [schemaText, setSchemaText] = useState(DEFAULT_JSON_SCHEMA);
  const [prompt, setPrompt] = useState(
    fr ? 'La livraison est-elle gratuite pour une commande de 75 € ?'
      : 'Is shipping free for a €75 order?',
  );
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const ctrlRef = useRef<AbortController | null>(null);

  const snippet = mode === 'chat'
    ? `import { createSession } from 'brimkern';\n\nconst s = createSession({\n  system: ${JSON.stringify(system)},\n  knowledge: [${JSON.stringify(knowledge)}],\n});\nconst reply = await s.ask(${JSON.stringify(prompt)});`
    : `import { generateJson } from 'brimkern';\n\nconst res = await generateJson({\n  prompt: ${JSON.stringify(prompt)},\n  schema: ${schemaText},\n});`;

  const handleRun = async () => {
    if (running) return;
    if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
      setStatus(t('WebGPU is unavailable in this browser.', 'WebGPU est indisponible dans ce navigateur.'));
      return;
    }
    setRunning(true);
    setOutput('');
    setStatus(t('Loading SDK & model on your GPU…', 'Chargement du SDK et du modèle sur votre GPU…'));
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    const t0 = performance.now();
    try {
      const bk = await loadSdk();
      if (mode === 'json') {
        const schema = JSON.parse(schemaText);
        const res = await bk.generateJson({
          prompt,
          schema,
          lang: fr ? 'fr' : 'en',
          maxTokens: 160,
          signal: ctrl.signal,
        });
        setOutput(JSON.stringify(res.data, null, 2));
        setStatus(t(
          `Validated JSON in ${((performance.now() - t0) / 1000).toFixed(1)} s (${res.attempts} attempt(s)).`,
          `JSON validé en ${((performance.now() - t0) / 1000).toFixed(1)} s (${res.attempts} essai(s)).`,
        ));
      } else {
        const session = bk.createSession({
          system,
          knowledge: knowledge.trim() ? [knowledge.trim()] : undefined,
          lang: fr ? 'fr' : 'en',
          maxTokens: 180,
        });
        try {
          const text = await session.ask(prompt, {
            signal: ctrl.signal,
            onToken: (acc) => setOutput(acc),
          });
          setOutput(text);
          setStatus(t(
            `Done on your GPU in ${((performance.now() - t0) / 1000).toFixed(1)} s.`,
            `Calculé sur votre GPU en ${((performance.now() - t0) / 1000).toFixed(1)} s.`,
          ));
        } finally {
          session.destroy();
        }
      }
    } catch (e: any) {
      if (!ctrl.signal.aborted) {
        setStatus(String(e?.message || e));
      } else {
        setStatus(t('Stopped.', 'Interrompu.'));
      }
    } finally {
      ctrlRef.current = null;
      setRunning(false);
    }
  };

  const handleStop = () => { ctrlRef.current?.abort(); };
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const fieldStyle = {
    width: '100%',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 6,
    padding: '8px 10px',
    fontFamily: 'var(--font-mono)',
    fontSize: 12.5,
    lineHeight: 1.5,
    resize: 'vertical' as const,
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: 'var(--text-secondary)',
    marginBottom: 4,
  };

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, background: 'var(--bg-card)', padding: 16, margin: '14px 0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className={mode === 'chat' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: 12.5, padding: '6px 12px' }}
            onClick={() => setMode('chat')}
          >
            createSession()
          </button>
          <button
            type="button"
            className={mode === 'json' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: 12.5, padding: '6px 12px' }}
            onClick={() => {
              setMode('json');
              setPrompt(fr ? 'Commande #48219 reçue cassée, besoin urgent d’un remplacement.' : 'Order #48219 arrived damaged, need an urgent replacement.');
            }}
          >
            generateJson()
          </button>
        </div>
        <button type="button" className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 10px' }} onClick={handleCopy}>
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? t('Copied', 'Copié') : t('Copy snippet', 'Copier le code')}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {mode === 'chat' ? (
          <>
            <div>
              <label htmlFor="pg-system" style={labelStyle}>system</label>
              <textarea id="pg-system" rows={2} value={system} onChange={(e) => setSystem(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="pg-knowledge" style={labelStyle}>knowledge</label>
              <textarea id="pg-knowledge" rows={2} value={knowledge} onChange={(e) => setKnowledge(e.target.value)} style={fieldStyle} />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="pg-schema" style={labelStyle}>schema (JSON Schema)</label>
            <textarea id="pg-schema" rows={7} value={schemaText} onChange={(e) => setSchemaText(e.target.value)} style={fieldStyle} />
          </div>
        )}
        <div>
          <label htmlFor="pg-prompt" style={labelStyle}>prompt</label>
          <input id="pg-prompt" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ ...fieldStyle, resize: undefined }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
        {!running ? (
          <button type="button" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 15px' }} onClick={handleRun}>
            <Play size={13} /> {t('Run on my GPU', 'Exécuter sur mon GPU')}
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 15px' }} onClick={handleStop}>
            <Square size={13} /> {t('Stop', 'Arrêter')}
          </button>
        )}
        <span role="status" aria-live="polite" style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
          {status || t('First run downloads the 290 MB Qwen3 0.6B model once.', 'Le premier tir télécharge une fois le modèle Qwen3 0.6B (290 Mo).')}
        </span>
      </div>

      {output && (
        <pre
          tabIndex={0}
          style={{
            margin: '12px 0 0',
            padding: 12,
            borderRadius: 6,
            background: '#090908',
            border: '1px solid var(--border-color)',
            color: '#fbfaf7',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
            overflowX: 'auto',
          }}
        >
          {output}
        </pre>
      )}
    </div>
  );
}
