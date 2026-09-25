"use client";

// Banc de code des presets de la CLI face aux modèles cloud (docs/ROADMAP.md § 17). Les modèles
// testés mais non retenus (Opus distill Qwen 3.5 et Gemma 4) sont dans les résultats bruts, pas ici.
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

// Réussite seule : les temps dépendaient de l'état de la machine (swap) et ne se comparaient pas.
const LOCAL: Row[] = [
  { name: 'coder-max · Qwen 3.6 35B-A3B', sub: { en: 'MoE, 20 GB+ of memory, no reasoning', fr: 'MoE, 20 Go+ de mémoire, sans réflexion' }, pct: 100, detail: { en: '41/41', fr: '41/41' } },
  { name: 'coder · Qwen 3 4B', sub: { en: 'default preset, no reasoning', fr: 'preset par défaut, sans réflexion' }, pct: (35 / 41) * 100, detail: { en: '35/41', fr: '35/41' } },
  { name: 'super-coder · Qwen 3.5 4B', sub: { en: 'reasons before answering', fr: 'réfléchit avant de répondre' }, pct: (33 / 41) * 100, detail: { en: '33/41', fr: '33/41' } },
];

const CLAUDE: Row[] = [
  { name: 'Claude Opus 5.5', pct: 100, detail: { en: '41/41', fr: '41/41' } },
  { name: 'Claude Sonnet 5', pct: 100, detail: { en: '41/41', fr: '41/41' } },
  { name: 'Claude Haiku 4.5', pct: (40 / 41) * 100, detail: { en: '40/41', fr: '40/41' } },
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

// Les cinq suites (matrice du 2026-09-25, scripts/bench/results-suites.json + HumanEval-41) : même
// banc, chaque réponse exécutée ; Claude via claude -p avec le même prompt. Réussite seule.
const SUITES: { key: string; en: string; fr: string }[] = [
  { key: 'he', en: 'HumanEval', fr: 'HumanEval' },
  { key: 'hep', en: 'HumanEval+', fr: 'HumanEval+' },
  { key: 'mbpp', en: 'MBPP+', fr: 'MBPP+' },
  { key: 'ts', en: 'TypeScript', fr: 'TypeScript' },
  { key: 'fix', en: 'Bug fixing', fr: 'Réparation de bug' },
];
const SUITE_ROWS: { name: string; cells: string[]; total: string }[] = [
  { name: 'coder-max', cells: ['41/41', '38/40', '35/40', '36/40', '34/41'], total: '184/202' },
  { name: 'Claude Sonnet 5', cells: ['41/41', '36/40', '33/40', '36/40', '40/41'], total: '186/202' },
  { name: 'coder', cells: ['35/41', '34/40', '28/40', '28/40', '21/41'], total: '146/202' },
  { name: 'super-coder', cells: ['33/41', '30/40', '29/40', '27/40', '26/41'], total: '145/202' },
];

export function SuitesTable() {
  const t = useT();
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={c.table}>
        <caption style={{ textAlign: 'left', fontSize: 12.5, color: 'var(--text-muted)', paddingBottom: 6 }}>
          {t('Problems solved, five suites (202 problems)', 'Problèmes résolus, cinq suites (202 problèmes)')}
        </caption>
        <thead><tr><th scope="col">{t('Model', 'Modèle')}</th>{SUITES.map((x) => <th key={x.key} scope="col">{t(x.en, x.fr)}</th>)}<th scope="col">Total</th></tr></thead>
        <tbody>
          {SUITE_ROWS.map((r) => (
            <tr key={r.name}><th scope="row">{r.name}</th>{r.cells.map((v, i) => <td key={i}>{v}</td>)}<td><strong>{r.total}</strong></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
