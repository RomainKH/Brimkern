"use client";

// PAGE DE COMPARAISON — « run an LLM in the browser » est une requête où deux projets sortent :
// WebLLM (MLC) et nous. Cette page existe pour la capter, et elle ne peut le faire durablement
// qu'en étant VRAIE : les chiffres des deux côtés viennent du même banc, sur la même machine, le
// même modèle, et on écrit noir sur blanc là où WebLLM est devant (le décodage) comme là où nous
// le sommes (le prefill, et l'absence d'étape de compilation).
//
// Règle de la maison, valable ici plus qu'ailleurs : aucun chiffre estimé. Ceux du tableau sont
// ceux du README et de la ROADMAP, relevés le 2026-08-13 (7B int4, même GPU, même prompt), plus la
// mesure de RMSNorm parallèle du 2026-08-14. La date et la machine sont dites — un banc sans son
// contexte est un argument publicitaire, pas une mesure.

import Link from 'next/link';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { useLocale, useT, useHref } from '@/lib/i18n';
import ByLine from '../ByLine';
import BackLink from '../BackLink';

export default function VsWebllmClient() {
  const t = useT();
  const href = useHref();
  const { locale, setLocale } = useLocale();

  // Les mesures. `us` / `them` : ce qui a été relevé ; `note` : ce qui rend le chiffre lisible.
  const rows: { metric: string; us: string; them: string; win: 'us' | 'them' | 'tie'; note: string }[] = [
    {
      metric: t('Prefill (reading the prompt)', 'Prefill (lecture du prompt)'),
      us: '47,2 tok/s', them: '18,7 tok/s', win: 'us' as const,
      note: t('Same 7B int4 model, same laptop GPU. Our hand-written tiled WGSL matmuls hold ~1 TFLOP/s on these shapes.',
              'Même modèle 7B int4, même GPU de portable. Nos matmuls WGSL tuilés tiennent ~1 TFLOP/s sur ces formes.'),
    },
    {
      metric: t('Decode (writing the answer)', 'Décodage (écriture de la réponse)'),
      us: '9,6 tok/s', them: '14,0 tok/s', win: 'them',
      note: t('WebLLM is ahead here, and we say so. Both figures are from 2026-08-13 — before we made RMSNorm parallel per row (2026-08-14), which is worth ×1.38 on decode measured end to end on a 0.6B. The 7B has not been re-measured since, so the number above stands until it is.',
              'WebLLM est devant ici, et nous l’écrivons. Les deux chiffres datent du 13/08/2026 — avant la RMSNorm parallèle par ligne (14/08), qui vaut ×1,38 sur le décodage, mesuré bout en bout sur un 0.6B. Le 7B n’a pas été re-mesuré depuis : le chiffre ci-dessus tient tant qu’il ne l’est pas.'),
    },
    {
      metric: t('Model preparation', 'Préparation du modèle'),
      us: t('none — paste author/model', 'aucune — collez auteur/modèle'),
      them: t('compile with MLC/TVM', 'compilation MLC/TVM'),
      win: 'us',
      note: t('This is the structural difference. We read single-file GGUF straight from Hugging Face; WebLLM needs weights pre-compiled into its own artifact first.',
              'C’est la différence structurelle. Nous lisons les GGUF mono-fichier directement depuis Hugging Face ; WebLLM exige des poids pré-compilés dans son propre format.'),
    },
    {
      metric: t('Reload from cache (4.7 GB)', 'Rechargement depuis le cache (4,7 Go)'),
      us: '15,8 s', them: '—', win: 'us',
      note: t('Our .brik container stores one layer per contiguous HTTP range, so a reload is resumable and works offline.',
              'Notre conteneur .brik range une couche par plage HTTP contiguë : le rechargement reprend après coupure et fonctionne hors-ligne.'),
    },
    {
      metric: t('Catalogue & maturity', 'Catalogue & maturité'),
      us: t('younger, fewer presets', 'plus jeune, moins de presets'),
      them: t('large, battle-tested', 'large, éprouvé'),
      win: 'them',
      note: t('WebLLM has years of production use, auto-tuned kernels and an OpenAI-compatible API. If you want a curated list of models that just work, it is the safer pick today.',
              'WebLLM a des années d’usage en production, des kernels auto-tunés et une API compatible OpenAI. Pour une liste de modèles choisis qui marchent, c’est le choix le plus sûr aujourd’hui.'),
    },
    {
      // (Les modalités image/vidéo existent chez nous mais restent expérimentales et lentes : en
      // faire un point gagné du tableau serait promettre ce qu'on ne tient pas. Ce qui suit est
      // vérifiable au chargement de n'importe quel modèle, console ouverte.)
      metric: t('Kernels checked at load', 'Kernels vérifiés au chargement'),
      us: t('CPU reference + fallback', 'référence CPU + repli'),
      them: t('trusted as compiled', 'compilés, donc supposés justes'),
      win: 'us',
      note: t('Every hand-written kernel validates itself against a CPU reference when the engine starts, and falls back to a simpler path if a GPU miscompiles it — a real failure mode on the variety of GPUs the web runs on. Each one also has a URL kill-switch to isolate it.',
              'Chaque kernel écrit à la main se valide contre une référence CPU au démarrage du moteur, et retombe sur un chemin plus simple si un GPU le compile mal — une panne réelle sur la variété de GPU qu’on trouve sur le web. Chacun a aussi un commutateur d’URL pour l’isoler.'),
    },
  ];

  const Mark = ({ win, side }: { win: 'us' | 'them' | 'tie'; side: 'us' | 'them' }) =>
    win === side ? <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} aria-hidden /> :
    win === 'tie' ? <Minus size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden /> : null;

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <BackLink />
        <button
          onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
          style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
        >
          {locale === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      <div style={{ borderTop: '2px solid var(--accent)', marginTop: 20, paddingTop: 22 }}>
        <span className="section-title" style={{ fontSize: 12, color: 'var(--accent-text)' }}>
          {t('measured comparison', 'comparaison mesurée')}
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 40, fontWeight: 800, lineHeight: 1.1, margin: '10px 0 14px', color: 'var(--text-primary)' }}>
          {t('Brimkern vs WebLLM: two ways to run an LLM in the browser',
            'Brimkern vs WebLLM : deux façons de faire tourner un LLM dans le navigateur')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.55, margin: '0 0 10px', maxWidth: 680 }}>
          {t('Both run a large language model client-side on WebGPU, with no server and no API key. They differ on one decisive point: what you must do to a model before it can run.',
            'Les deux exécutent un grand modèle de langage côté client sur WebGPU, sans serveur ni clé d’API. Ils diffèrent sur un point décisif : ce qu’il faut faire subir à un modèle avant qu’il tourne.')}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.55, margin: '0 0 22px', maxWidth: 680 }}>
          {t('Numbers below were measured on 2026-08-13 and 2026-08-14, same laptop GPU, same model (DeepSeek-R1-Distill-Qwen-7B, int4), same prompt. Nothing here is an estimate.',
            'Les chiffres ci-dessous ont été mesurés les 13 et 14 août 2026, même GPU de portable, même modèle (DeepSeek-R1-Distill-Qwen-7B, int4), même prompt. Rien ici n’est estimé.')}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href={`${href('/chat')}?start=1`} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
            {t('Run a model now — 149 MB', 'Lancer un modèle — 149 Mo')} <ArrowRight size={15} />
          </Link>
          <Link href={href('/docs')} className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
            {t('Read the docs', 'Lire la doc')}
          </Link>
        </div>
      </div>

      {/* ── LE TABLEAU ─────────────────────────────────────────────────────────────────────────
          Un vrai <table> (et non des div en grille) : c'est un tableau de données, les lecteurs
          d'écran doivent pouvoir l'annoncer ligne par ligne avec ses en-têtes. Il défile
          horizontalement dans son propre conteneur sur écran étroit. */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '46px 0 8px', color: 'var(--text-primary)' }}>
        {t('Measured, side by side', 'Mesuré, côte à côte')}
      </h2>
      <div style={{ overflowX: 'auto', margin: '18px 0 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th scope="col" style={{ textAlign: 'left', padding: '8px 10px 8px 0', color: 'var(--text-muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {t('What', 'Quoi')}
              </th>
              <th scope="col" style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--accent-text)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>Brimkern</th>
              <th scope="col" style={{ textAlign: 'left', padding: '8px 0 8px 10px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>WebLLM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.metric} style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'top' }}>
                <th scope="row" style={{ textAlign: 'left', padding: '14px 10px 14px 0', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {r.metric}
                  <span style={{ display: 'block', fontWeight: 400, color: 'var(--text-muted)', fontSize: 12.5, lineHeight: 1.5, marginTop: 4 }}>{r.note}</span>
                </th>
                <td style={{ padding: '14px 10px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Mark win={r.win} side="us" />{r.us}</span>
                </td>
                <td style={{ padding: '14px 0 14px 10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Mark win={r.win} side="them" />{r.them}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── LA DIFFÉRENCE DE FOND ──────────────────────────────────────────────────────────── */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '46px 0 14px', color: 'var(--text-primary)' }}>
        {t('The difference that decides', 'La différence qui décide')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
            {t('WebLLM: compile, then run', 'WebLLM : compiler, puis exécuter')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
            {t('Weights go through the MLC/TVM toolchain and come out as a WebLLM artifact. That step buys auto-tuned kernels per architecture — and costs you a build every time you want a model that is not already in the catalogue.',
              'Les poids passent par la chaîne MLC/TVM et en ressortent en artefact WebLLM. Cette étape achète des kernels auto-tunés par architecture — et vous coûte une compilation dès que vous voulez un modèle absent du catalogue.')}
          </p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
            {t('Brimkern: read the file the Hub already hosts', 'Brimkern : lire le fichier que le Hub héberge déjà')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
            {t('Paste author/model and it runs: the quantization is picked for you, the tokenizer is rebuilt from the file itself, and the weights stream in by HTTP ranges. Nothing to compile, nothing to host, nothing to configure.',
              'Collez auteur/modèle et ça tourne : la quantification est choisie pour vous, le tokenizer est reconstruit depuis le fichier lui-même, et les poids arrivent par plages HTTP. Rien à compiler, rien à héberger, rien à régler.')}
          </p>
        </div>
      </div>

      {/* ── QUI DEVRAIT CHOISIR QUOI ───────────────────────────────────────────────────────── */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '46px 0 14px', color: 'var(--text-primary)' }}>
        {t('Which one should you use?', 'Lequel choisir ?')}
      </h2>
      <ul style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, margin: 0, paddingLeft: 20 }}>
        <li>
          {t('You want to try a model you just found on Hugging Face, today, without a build step → ', 'Vous voulez essayer un modèle trouvé à l’instant sur Hugging Face, sans étape de build → ')}
          <strong style={{ color: 'var(--text-primary)' }}>Brimkern</strong>.
        </li>
        <li>
          {t('You ship a product on a fixed, curated model list and want the most battle-tested runtime → ', 'Vous livrez un produit sur une liste de modèles figée et voulez le runtime le plus éprouvé → ')}
          <strong style={{ color: 'var(--text-primary)' }}>WebLLM</strong>.
        </li>
        <li>
          {t('You need images, vision or video in the same engine as text → ', 'Vous avez besoin d’images, de vision ou de vidéo dans le même moteur que le texte → ')}
          <strong style={{ color: 'var(--text-primary)' }}>Brimkern</strong>.
        </li>
        <li>
          {t('You need an OpenAI-compatible API surface out of the box → ', 'Vous voulez une API compatible OpenAI clé en main → ')}
          <strong style={{ color: 'var(--text-primary)' }}>WebLLM</strong>.
        </li>
      </ul>

      <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, margin: '30px 0 0' }}>
        {t('WebLLM is an excellent project and the reason in-browser inference is taken seriously at all. This page compares engineering trade-offs, not teams. If a number here is wrong, tell us — the benchmark harness is in the repository.',
          'WebLLM est un excellent projet, et la raison pour laquelle l’inférence dans le navigateur est prise au sérieux. Cette page compare des choix techniques, pas des équipes. Si un chiffre est faux, dites-le — le harnais de mesure est dans le dépôt.')}
      </p>

      <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`${href('/chat')}?start=1`} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
          {t('Try Brimkern in your browser', 'Essayer Brimkern dans votre navigateur')} <ArrowRight size={15} />
        </Link>
        <a href="https://github.com/RomainKH/Brimkern" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
          {t('Read the source', 'Lire le code')}
        </a>
      </div>

      <ByLine />
    </main>
  );
}
