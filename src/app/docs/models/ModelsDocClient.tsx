"use client";

// Page « Modèles & format .brik » : tout ce qui concerne CE QU'ON CHARGE — n'importe quel GGUF de
// Hugging Face, les liens de test instantané, et le format .brik avec son convertisseur. Sections
// sorties de l'ancienne page /docs unique (découpage en pages, retour Romain du 2026-08-18).

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, Package } from 'lucide-react';
import { useT, useHref, useLocale } from '@/lib/i18n';
import { fmtModelSize } from '@/lib/modelCatalog';
import DocsShell, { Code, P, PageTitle, Section } from '../DocsShell';
import { SITE_URL } from '@/lib/site';

type CatFilter = 'all' | 'qa' | 'code' | 'light';

interface VerifiedModel {
  id: string;
  name: string;
  bytes: number;
  minRam: string;
  cat: Exclude<CatFilter, 'all'>;
  chatHref: string;
  note: { en: string; fr: string };
}

const VERIFIED_MODELS: VerifiedModel[] = [
  {
    id: 'qwen3-0.6b-shop',
    name: 'Qwen3 0.6B Shop (BRIK q4)',
    bytes: 304_464_672,
    minRam: '4 GB',
    cat: 'qa',
    chatHref: '/chat?brik=https://huggingface.co/romainkh14/Qwen3-0.6B-Shop-ENFR_BRIK/resolve/main/qwen3-0.6b-shop-enfr-q4.brik',
    note: { en: 'SDK default & extension light tier. EN/FR grounded Q&A.', fr: 'Défaut SDK & palier léger extension. Q&A sourcé EN/FR.' },
  },
  {
    id: 'lfm2.5-230m',
    name: 'LFM2.5 230M (BRIK q4)',
    bytes: 156_237_824,
    minRam: '2 GB',
    cat: 'light',
    chatHref: '/chat?brik=https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
    note: { en: 'Smallest hybrid model (conv + attn). Mobile default.', fr: 'Plus petit modèle hybride (conv + attn). Défaut mobile.' },
  },
  {
    id: 'qwen-0.5b',
    name: 'Qwen2.5 0.5B Instruct (BRIK mixed)',
    bytes: 395_313_152,
    minRam: '4 GB',
    cat: 'qa',
    chatHref: '/chat?brik=https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik',
    note: { en: 'Mixed int4 body + int8 attention for clean mobile chat.', fr: 'Corps int4 + attention int8 pour un chat mobile propre.' },
  },
  {
    id: 'coder-1.5b',
    name: 'Qwen2.5 Coder 1.5B (GGUF Q4_K_M)',
    bytes: 986_000_000,
    minRam: '6 GB',
    cat: 'code',
    chatHref: '/chat?model=Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF',
    note: { en: 'Compact coding assistant directly in the browser.', fr: 'Assistant de code compact directement dans le navigateur.' },
  },
  {
    id: 'rwkv-0.4b',
    name: 'RWKV-7 G1a 0.4B (BRIK q4)',
    bytes: 280_000_000,
    minRam: '2 GB',
    cat: 'light',
    chatHref: '/chat?brik=https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik',
    note: { en: 'Recurrent state (~1 MB constant memory, no growing KV cache).', fr: 'État récurrent (~1 Mo constant, sans cache KV qui enfle).' },
  },
];

export default function ModelsDocClient() {
  const t = useT();
  const href = useHref();
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const [filter, setFilter] = useState<CatFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visibleModels = filter === 'all' ? VERIFIED_MODELS : VERIFIED_MODELS.filter((m) => m.cat === filter);

  const toc: { id: string; label: string }[] = [
    { id: 'catalog', label: t('Verified .brik & SDK models', 'Modèles .brik & SDK vérifiés') },
    { id: 'any-model', label: t('Run any Hugging Face model', "N'importe quel modèle Hugging Face") },
    { id: 'architectures', label: t('Supported architectures', 'Architectures supportées') },
    { id: 'quantizations', label: t('Quantizations & WebGPU kernels', 'Quantifications & kernels WebGPU') },
    { id: 'restrictions', label: t('Limits & exclusions', 'Limites & exclusions') },
    { id: 'links', label: t('Instant test links', 'Liens de test instantané') },
    { id: 'brik', label: t('The .brik format & converter', 'Le format .brik & le convertisseur') },
  ];

  return (
    <DocsShell toc={toc}>
      <PageTitle title={t('Models & the .brik format', 'Modèles & format .brik')}>
        {t('What the engine loads and how: single-file GGUF straight from Hugging Face, supported architectures, quantization kernels, shareable test links, and the .brik streaming format with its in-browser converter.',
           "Ce que le moteur charge et comment : les GGUF mono-fichier directement depuis Hugging Face, architectures supportées, kernels de quantification, liens de test partageables, et format streamé .brik avec son convertisseur intégré.")}
      </PageTitle>
      {/* Le convertisseur est la seule ACTION de la page : un bouton dès l'en-tête, pas un lien
          perdu en dernière phrase de la dernière section (retour Romain du 2026-10-07). */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '4px 0 28px' }}>
        <Link href={href('/convert')} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
          <Package size={14} /> {t('Convert a GGUF to .brik', 'Convertir un GGUF en .brik')}
        </Link>
        <a href="#brik" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
          {t('What is a .brik?', "Qu'est-ce qu'un .brik ?")}
        </a>
      </div>

      <Section id="catalog" title={t('Verified .brik & SDK models', 'Modèles .brik & SDK vérifiés')}>
        <P>
          {t('Quick picker for the SDK and browser chat: filter by use case, copy the SDK model key, or open directly in the chat.',
             'Sélecteur rapide pour le SDK et le chat : filtrez par usage, copiez la clé SDK, ou testez directement dans le chat.')}
        </P>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '10px 0 14px' }}>
          {([
            ['all', t('All', 'Tous')],
            ['qa', t('Chat & Q&A', 'Chat & Q&A')],
            ['code', t('Code', 'Code')],
            ['light', t('Ultra-light', 'Ultra-léger')],
          ] as [CatFilter, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              className={filter === key ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ fontSize: 12.5, padding: '6px 12px' }}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 14 }}>
          {visibleModels.map((m) => (
            <div key={m.id} style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>{m.name}</strong>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {fmtModelSize(m.bytes, fr)} · {m.minRam}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{fr ? m.note.fr : m.note.en}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: 12, padding: '5px 10px' }}
                  onClick={() => {
                    navigator.clipboard.writeText(m.id).catch(() => {});
                    setCopiedId(m.id);
                    setTimeout(() => setCopiedId(null), 1600);
                  }}
                >
                  {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />} {copiedId === m.id ? t('Copied', 'Copié') : m.id}
                </button>
                <Link href={href(m.chatHref)} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 12, padding: '5px 10px' }}>
                  {t('Try in chat', 'Essayer')} <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="any-model" title={t('Run any Hugging Face model', "N'importe quel modèle Hugging Face")}>
        <P>
          {t('Brimkern reads single-file GGUF models directly: the format hosted by Hugging Face, with zero conversion or server compilation step. Paste any of these formats into the input field on the home screen, in the model browser, or pass them to the CLI:',
             "Brimkern lit directement les modèles GGUF mono-fichier : le format standard hébergé sur Hugging Face, sans étape de conversion ni compilation serveur. Collez n'importe laquelle de ces formes dans le champ d'accueil, le navigateur de modèles ou la CLI :")}
        </P>
        <Code lang="url">{`Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF
https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF
https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/blob/main/gemma-3-270m-it-Q4_K_M.gguf
https://example.com/my-custom-model.gguf`}</Code>
        <P>
          {t('The engine resolves the repository through the Hugging Face API, inspects available files, and picks the best quantization automatically (favoring .brik first, then Q4_K_M, Q4_K_S, Q4_0, Q4_1, Q5_K, Q3_K, Q8_0). Tokenizer, vocabulary, RoPE frequency, and context configurations are parsed directly from the GGUF header.',
             "Le moteur résout le dépôt via l'API Hugging Face, inspecte les fichiers disponibles et sélectionne automatiquement la meilleure quantification (priorité au format .brik streamé, puis Q4_K_M, Q4_K_S, Q4_0, Q4_1, Q5_K, Q3_K, Q8_0). Le tokenizer, le vocabulaire, la base RoPE et les hyperparamètres sont lus directement dans l'en-tête GGUF.")}
        </P>
      </Section>

      <Section id="architectures" title={t('Supported architectures', 'Architectures supportées')}>
        <P>
          {t('Brimkern features dedicated, hand-crafted WGSL kernels matching modern model families:',
             'Brimkern intègre des kernels WGSL natifs écrits à la main pour chaque grande famille de modèles :')}
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, margin: '18px 0' }}>
          <div style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Qwen (Alibaba)</strong>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('Qwen 2, Qwen 2.5, Qwen 2.5 Coder, Qwen 3 (with <think> reasoning), and Qwen 3.5 SSM (DeltaNet causal conv + recurrent state).',
                 'Qwen 2, Qwen 2.5, Qwen 2.5 Coder, Qwen 3 (réflexion <think>), et Qwen 3.5 SSM (hybride DeltaNet conv causale + état récurrent).')}
            </p>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Llama (Meta)</strong>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('Llama 2, Llama 3, Llama 3.1, Llama 3.2, Granite 4.0 Micro, and Falcon 3. Interleaved RoPE pairs (ggml NORM) handled natively.',
                 'Llama 2, Llama 3, Llama 3.1, Llama 3.2, Granite 4.0 Micro et Falcon 3. Appariement RoPE entrelacé (ggml NORM) géré nativement.')}
            </p>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>DeepSeek (DeepSeek AI)</strong>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('DeepSeek-R1 Distill (Qwen & Llama backbones) from 1.5B to 7B with internal monologue decoding.',
                 'DeepSeek-R1 Distill (sur base Qwen et Llama) de 1.5B à 7B avec décodage du monologue interne.')}
            </p>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Gemma (Google)</strong>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('Gemma 1, Gemma 2 (tanh logit softcaps 50/30, GELU gate, query pre-attn scaling), and Gemma 3 (alternating 5 local / 1 global sliding window attention).',
                 'Gemma 1, Gemma 2 (softcaps tanh 50/30, gate GELU, échelle de pré-attention), et Gemma 3 (attention alternée 5 locales / 1 globale fenêtrée).')}
            </p>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Mistral (Mistral AI)</strong>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('Mistral 7B and Ministral 3 with static YaRN frequency transform and attention scaling.',
                 'Mistral 7B et Ministral 3 avec transform statique YaRN et mise à l’échelle d’attention.')}
            </p>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>SmolLM (Hugging Face)</strong>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('SmolLM, SmolLM2, and SmolLM3 featuring NoPE (1 in 4 layers without RoPE for long contexts).',
                 'SmolLM, SmolLM2 et SmolLM3 avec architecture NoPE (1 couche sur 4 sans RoPE pour contextes longs).')}
            </p>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>{t('Hybrids & Recurrent', 'Hybrides & Récurrents')}</strong>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('Liquid AI LFM2/2.5 (gated short conv + attention) and BlinkDL RWKV-7 (constant ~1MB resident state replacing KV cache).',
                 'Liquid AI LFM2/2.5 (conv courte gatée + attention) et BlinkDL RWKV-7 (état résident fixe ~1 Mo remplaçant le cache KV).')}
            </p>
          </div>
        </div>
      </Section>

      <Section id="quantizations" title={t('Quantizations & WebGPU kernels', 'Quantifications & kernels WebGPU')}>
        <P>
          {t('Brimkern executes weight dequantization directly on the GPU in WebGPU compute shaders. Every kernel is verified against a CPU reference at startup (selfValidate) with graceful fallback and URL kill-switches.',
             'Brimkern exécute la déquantification des poids directement sur le GPU via des compute shaders WebGPU. Chaque kernel est testé contre une référence CPU au démarrage (selfValidate) avec repli transparent et kill-switch URL.')}
        </P>
        <P>
          {t('Supported GGML / GGUF quantizations:', 'Quantifications GGML / GGUF supportées :')}
        </P>
        <div style={{ overflowX: 'auto', margin: '14px 0' }}>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '8px 12px' }}>{t('Quantization', 'Quantification')}</th>
                <th style={{ padding: '8px 12px' }}>{t('Block format', 'Format de bloc')}</th>
                <th style={{ padding: '8px 12px' }}>{t('GPU kernel', 'Kernel GPU')}</th>
                <th style={{ padding: '8px 12px' }}>{t('Typical use', 'Usage typique')}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)' }}>Q4_K_M / Q4_K_S</td>
                <td style={{ padding: '8px 12px' }}>256 weights, 144 B</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>dequant_q4k</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t('Default recommended choice for 1B-4B models', 'Choix recommandé par défaut pour modèles 1B-4B')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)' }}>Q3_K (M, S, L)</td>
                <td style={{ padding: '8px 12px' }}>256 weights, 110 B</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>dequant_q3k</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t('Fits 7B-8B models under ~3.8 GB VRAM on 8GB machines', 'Fait tenir les modèles 7B-8B sous ~3,8 Go de VRAM sur machines 8 Go')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)' }}>Q4_0</td>
                <td style={{ padding: '8px 12px' }}>32 weights, 18 B</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>dequant_q4_0</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t('Standard symmetric 4-bit quantization', 'Quantification 4 bits symétrique standard')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)' }}>Q4_1</td>
                <td style={{ padding: '8px 12px' }}>32 weights, 20 B</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>dequant_q4_1</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t('Asymmetric 4-bit with min offset', 'Quantification 4 bits asymétrique avec offset min')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)' }}>Q5_0 / Q5_K</td>
                <td style={{ padding: '8px 12px' }}>32 / 256 weights</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>dequant_q5_0 / dequant_q5k</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t('Higher precision for critical projections', 'Plus haute précision sur les projections critiques')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)' }}>Q6_K</td>
                <td style={{ padding: '8px 12px' }}>256 weights, 210 B</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>dequant_q6k</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t('High-fidelity layers in mixed-precision GGUFs', 'Couches haute fidélité dans les GGUF mixtes')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)' }}>Q8_0</td>
                <td style={{ padding: '8px 12px' }}>32 weights, 34 B</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>dequant_q8_0</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t('8-bit integer precision, near lossless output head', 'Précision entière 8 bits, tête de sortie quasi sans perte')}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)' }}>F16 / F32</td>
                <td style={{ padding: '8px 12px' }}>1 weight</td>
                <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>direct native</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t('Unquantized tensors (RMSNorm weights, biases)', 'Tenseurs non quantifiés (poids RMSNorm, biais)')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="restrictions" title={t('Limits & exclusions', 'Limites & exclusions')}>
        <P>
          {t('To preserve browser responsiveness and stability, some files and formats are intentionally rejected with clear diagnostic error messages:',
             'Pour préserver la stabilité du navigateur et la mémoire de l’onglet, certains formats sont explicitement refusés avec un message explicatif :')}
        </P>
        <ul style={{ fontSize: 13, lineHeight: 1.6, paddingLeft: 20, color: 'var(--text-secondary)' }}>
          <li style={{ marginBottom: 6 }}>
            <strong>{t('Sharded GGUFs:', 'GGUF shardés :')}</strong> {t('Files named model-00001-of-00005.gguf are not supported. Brimkern streams contiguous HTTP byte ranges over a single file without loading multi-gigabyte blobs into system RAM. Use the single-file GGUF equivalent.',
                                                        'Les fichiers découpés en plusieurs morceaux (-00001-of-00005) ne sont pas acceptés. Brimkern streame par plages HTTP contiguës sur un fichier unique. Choisissez la version mono-fichier.')}
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong>{t('Standalone mmproj files:', 'Projecteurs mmproj seuls :')}</strong> {t('Files prefixed with mmproj-* contain image encoder vision projectors and cannot run standalone without a paired LLM.',
                                                                                    'Les fichiers nommés mmproj-* contiennent les projecteurs de vision et ne peuvent pas tourner seuls sans modèle de langue.')}
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong>{t('Codebook IQ quantizations:', 'Quantifications IQ à table de codes :')}</strong> {t('Formats like IQ1_S, IQ2_XXS, IQ3_XXS, IQ4_XS rely on lookup tables that do not vectorize efficiently in direct WGSL shaders. Pick Q3_K, Q4_K_M, or Q4_0 instead.',
                                                                                         'Les formats IQ1, IQ2, IQ3_XXS, IQ4_XS utilisent des tables de codes non adaptées au calcul vectoriel direct en WGSL. Privilégiez Q3_K, Q4_K_M ou Q4_0.')}
          </li>
          <li>
            <strong>{t('Memory limits (VRAM):', 'Limites de mémoire (VRAM) :')}</strong> {t('Models up to 1.5B (~1.2 GB) run smoothly on any mobile or laptop. Models from 3B to 4B (~2-2.6 GB) require 8GB+ system RAM. 7B models (~4-5 GB) require 16GB+ RAM.',
                                                                                      'Les modèles jusqu’à 1.5B (~1,2 Go) tournent facilement sur mobile et laptop. Les modèles 3B à 4B (~2-2,6 Go) demandent 8 Go+ de RAM. Les modèles 7B (~4-5 Go) nécessitent 16 Go+ de RAM.')}
          </li>
        </ul>
      </Section>

      <Section id="links" title={t('Instant test links', 'Liens de test instantané')}>
        <P>
          {t('Any model can be turned into a link that loads it directly: handy to share a demo, to file a bug report, or to point a colleague at an exact quantization.',
             "N'importe quel modèle peut devenir un lien qui le charge directement : pratique pour partager une démo, joindre un rapport de bug, ou renvoyer un collègue vers une quantification précise.")}
        </P>
        <Code lang="url">{`${SITE_URL}/chat?model=Qwen/Qwen3-0.6B-GGUF
${SITE_URL}/chat?model=Qwen/Qwen3-0.6B-GGUF&file=Qwen3-0.6B-Q8_0.gguf
${SITE_URL}/chat?gguf=https://example.com/model.gguf
${SITE_URL}/chat?brik=https://example.com/model.brik`}</Code>
        <P>
          <code>?model=</code>{t(' resolves the repository through the Hub API and picks the best loadable file (a .brik wins over a GGUF). ', " interroge l'API du Hub et choisit le meilleur fichier chargeable (un .brik gagne sur un GGUF). ")}
          <code>?file=</code>{t(' forces one exact quantization. ', ' force une quantification précise. ')}
          <code>?gguf=</code>{t(' and ', ' et ')}<code>?brik=</code>{t(' take a direct URL, for models you host yourself.',
            " prennent une URL directe, pour les modèles que vous hébergez vous-même.")}
        </P>
      </Section>

      <Section id="brik" title={t('The .brik format & converter', 'Le format .brik & le convertisseur')}>
        <P>
          {t('A .brik is a GGUF re-packaged for the browser: weights already quantized to int4/int8, laid out so each layer is one contiguous HTTP range, with the tokenizer embedded. The practical effect: the model loads by ranges (resumable, partially, genuinely offline afterwards) instead of as one multi-gigabyte download.',
             "Un .brik est un GGUF ré-empaqueté pour le navigateur : poids déjà quantifiés en int4/int8, disposés pour qu'une couche soit une seule plage HTTP contiguë, tokenizer embarqué. Effet concret : le modèle se charge par plages (reprise possible, partiellement, vraiment hors-ligne ensuite) au lieu d'un téléchargement de plusieurs gigaoctets.")}
        </P>
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '16px 18px', marginTop: 8 }}>
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t('Convert a GGUF yourself, in the browser', 'Convertissez un GGUF vous-même, dans le navigateur')}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              {t('Pick a GGUF file, get a .brik back. The file never leaves your machine.', 'Choisissez un fichier GGUF, récupérez un .brik. Le fichier ne quitte jamais votre machine.')}
            </div>
          </div>
          <Link href={href('/convert')} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px', flexShrink: 0 }}>
            {t('Open the converter', 'Ouvrir le convertisseur')} <ArrowRight size={14} />
          </Link>
        </div>
      </Section>
    </DocsShell>
  );
}
