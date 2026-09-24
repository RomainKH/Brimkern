"use client";

// Banc de code des modèles de la CLI face aux modèles cloud (docs/ROADMAP.md § 17).
//
// Deux sortes de chiffres, qui ne se mélangent pas :
//   · MESURÉS (nos modèles locaux ET Claude) : même banc, scripts/bench-code.mjs, 41 problèmes
//     HumanEval (un sur quatre), même prompt, chaque réponse EXÉCUTÉE contre les tests officiels.
//     Résultats bruts : scripts/bench/results-2026-09-24.json.
//   · ANNONCÉS (GPT) : scores publiés par OpenAI (github.com/openai/simple-evals), HumanEval complet
//     (164 problèmes), protocole OpenAI. Aucun accès pour les mesurer ici : barres hachurées, groupe
//     à part, légende explicite. Ne jamais les présenter comme mesurés.
// Aucun chiffre ajouté sans mesure (règle 4 du dépôt).

import { useT } from '@/lib/i18n';
import c from './benchChart.module.css';

type Kind = 'local' | 'claude' | 'gpt';
interface Row { name: string; sub?: { en: string; fr: string }; pct: number; detail: { en: string; fr: string } }

const LOCAL: Row[] = [
  { name: 'coder · Qwen 3 4B', sub: { en: 'default preset, no reasoning', fr: 'preset par défaut, sans réflexion' }, pct: (35 / 41) * 100, detail: { en: '35/41 · ~15 s per problem', fr: '35/41 · ~15 s par problème' } },
  { name: 'super-coder · Qwen 3.5 4B', sub: { en: 'reasons before answering', fr: 'réfléchit avant de répondre' }, pct: (33 / 41) * 100, detail: { en: '33/41 · ~60 s per problem', fr: '33/41 · ~60 s par problème' } },
  { name: 'Qwen 3.5 4B · Opus 4.6 distill', sub: { en: 'not kept', fr: 'non retenu' }, pct: (32 / 41) * 100, detail: { en: '32/41 · ~65 s per problem', fr: '32/41 · ~65 s par problème' } },
  { name: 'Gemma 4 E4B · Opus distill', sub: { en: 'not kept', fr: 'non retenu' }, pct: (26 / 41) * 100, detail: { en: '26/41 · ~28 s per problem', fr: '26/41 · ~28 s par problème' } },
];

const CLAUDE: Row[] = [
  { name: 'Claude Opus 5.5', pct: 100, detail: { en: '41/41 · ~7 s per problem (network included)', fr: '41/41 · ~7 s par problème (réseau compris)' } },
  { name: 'Claude Sonnet 5', pct: 100, detail: { en: '41/41 · ~5 s per problem (network included)', fr: '41/41 · ~5 s par problème (réseau compris)' } },
  { name: 'Claude Haiku 4.5', pct: (40 / 41) * 100, detail: { en: '40/41 · ~9 s per problem (network included)', fr: '40/41 · ~9 s par problème (réseau compris)' } },
];

const GPT: Row[] = [
  { name: 'GPT-4.1', pct: 94.5, detail: { en: 'published by OpenAI', fr: 'annoncé par OpenAI' } },
  { name: 'GPT-4.1 mini', pct: 93.8, detail: { en: 'published by OpenAI', fr: 'annoncé par OpenAI' } },
  { name: 'GPT-4o', pct: 90.2, detail: { en: 'published by OpenAI', fr: 'annoncé par OpenAI' } },
];

function Bars({ rows, kind, hatched }: { rows: Row[]; kind: Kind; hatched?: boolean }) {
  const t = useT();
  return (
    <>
      {rows.map((r) => {
        const label = `${r.name} : ${r.pct.toFixed(1).replace('.', t('.', ','))} % · ${t(r.detail.en, r.detail.fr)}`;
        return (
          <div key={r.name} className={c.row} tabIndex={0} title={label} aria-label={label}>
            <span className={c.name}>
              {r.name}
              {r.sub && <span className={c.sub}>{t(r.sub.en, r.sub.fr)}</span>}
            </span>
            <span className={c.track} aria-hidden="true">
              <span className={`${c.bar} ${hatched ? c.hatched : ''}`} style={{ width: `${r.pct}%`, ['--c' as string]: `var(--${kind})` }} />
              <span className={c.value} style={{ left: `${r.pct}%` }}>{Math.round(r.pct)} %</span>
            </span>
          </div>
        );
      })}
    </>
  );
}

export default function BenchChart() {
  const t = useT();
  const all: [string, Row[]][] = [[t('On your GPU', 'Sur votre GPU'), LOCAL], ['Claude', CLAUDE], ['GPT', GPT]];
  return (
    <figure className={c.chart} aria-label={t('HumanEval pass@1, local models vs cloud models', 'HumanEval pass@1, modèles locaux contre modèles cloud')}>
      <div className={c.group}>
        <p className={c.groupTitle}>{t('On your GPU', 'Sur votre GPU')} <span className={c.groupNote}>· {t('measured, same benchmark', 'mesuré, même banc')}</span></p>
        <Bars rows={LOCAL} kind="local" />
      </div>
      {CLAUDE.length > 0 && (
        <div className={c.group}>
          <p className={c.groupTitle}>Claude · cloud <span className={c.groupNote}>· {t('measured, same benchmark', 'mesuré, même banc')}</span></p>
          <Bars rows={CLAUDE} kind="claude" />
        </div>
      )}
      <div className={c.group}>
        <p className={c.groupTitle}>GPT · cloud <span className={c.groupNote}>· {t('published by OpenAI, full HumanEval (164), their protocol, not measured here', 'annoncé par OpenAI, HumanEval complet (164), leur protocole, non mesuré ici')}</span></p>
        <Bars rows={GPT} kind="gpt" hatched />
      </div>
      <div className={c.axis} aria-hidden="true">
        <span />
        <span className={c.ticks}><span>0</span><span>25</span><span>50</span><span>75</span><span>100 %</span></span>
      </div>
      <details className={c.details}>
        <summary>{t('Show as a table', 'Voir en tableau')}</summary>
        <table className={c.table}>
          <thead><tr><th>{t('Group', 'Groupe')}</th><th>{t('Model', 'Modèle')}</th><th>pass@1</th><th>{t('Detail', 'Détail')}</th></tr></thead>
          <tbody>
            {all.flatMap(([g, rows]) => rows.map((r) => (
              <tr key={g + r.name}><td>{g}</td><td>{r.name}</td><td>{r.pct.toFixed(1)} %</td><td>{t(r.detail.en, r.detail.fr)}</td></tr>
            )))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
