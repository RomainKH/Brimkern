"use client";

// « Votre onglet est-il plus rapide qu'un cerveau de mouche ? »
//
// POURQUOI CETTE PAGE. Le 03/09/2026, Janelia, le MRC LMB et Google ont publié dans Cell le
// connectome complet du système nerveux central d'une drosophile MÂLE : 166 000 neurones et 125
// millions de synapses, le plus grand cerveau jamais cartographié à l'échelle de la synapse. La
// semaine suivante, tout le monde branchait le truc sur Doom. Il y a là un public exactement
// superposable au nôtre — des gens qui trouvent drôle qu'un calcul énorme tienne dans une machine
// ordinaire — et une occasion de montrer la thèse du moteur au lieu de la raconter.
//
// LA RÈGLE QUI COMMANDE TOUTE LA PAGE (règle 4 : aucun chiffre non mesuré). Il y a exactement deux
// familles de nombres ici, et elles ne se mélangent jamais :
//   • ceux de la mouche, qui viennent d'une publication, avec sa date et son lien ;
//   • celui du GPU du lecteur, MESURÉ dans son onglet au moment où il clique (cf. flyBench.ts),
//     jamais recopié d'une mesure faite ailleurs — « mesuré chez moi » n'est pas « mesuré chez
//     vous », et une page qui affiche 1,04 TFLOP/s à quelqu'un sur un téléphone ment.
// Le facteur de conversion entre les deux (une synapse ↔ un multiply-accumulate) est une
// CONVENTION, pas une mesure : elle est donc écrite en toutes lettres dans la section « What this
// does not say », qui existe pour ça et qu'on ne retire pas pour gagner de la place.

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { useT, useHref, useLocale } from '@/lib/i18n';
import DocsShell, { PageTitle, Section, P } from '../docs/DocsShell';
import { runFlyBench, type FlyBenchResult } from '@/lib/webgpu/flyBench';

// ── Les chiffres de la mouche, et leur source ────────────────────────────────────────────────────
// Relevés le 11/09/2026 sur le billet de Google Research et la page de projet de Janelia (données
// MaleCNS v1.0 sorties le 08/06/2026, publication Cell du 03/09/2026). Jeu sous licence CC-BY.
const FLY = {
  neurons: 166_000,
  synapses: 125_000_000,
  published: '2026-09-03',
  paper: 'https://doi.org/10.1016/j.cell.2026.08.015',
  data: 'https://www.janelia.org/project-team/flyem/male-cns-connectome',
  blog: 'https://research.google/blog/a-connectomics-milestone-mapping-the-complete-male-fruit-fly-brain/',
};

// Le modèle que le moteur charge par défaut sur une machine modeste (cf. modelCatalog.MOBILE_BRIK_URL).
const MODEL = { params: 230_000_000, mb: 149, name: 'LFM2.5-230M' };

// LA CONVENTION, et le seul endroit où elle est appliquée. Une synapse traversée une fois = un
// multiply-accumulate = 2 opérations flottantes. C'est l'équivalence qu'emploie tout le monde pour
// mettre un réseau biologique et une puce sur le même axe ; ce n'est pas de la biologie, et la page
// le dit là où le lecteur la rencontre.
const FLOP_PAR_BALAYAGE = 2 * FLY.synapses;

export default function FruitFlyClient() {
  const t = useT();
  const href = useHref();
  const { locale } = useLocale();
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle');
  const [res, setRes] = useState<FlyBenchResult | null>(null);

  // Formatage LOCALISÉ des nombres : une page anglaise qui affiche « 1 040,5 » est un bug au même
  // titre qu'un libellé non traduit (règle 3).
  const loc = locale === 'fr' ? 'fr-FR' : 'en-US';
  const num = (v: number, d = 0) => v.toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d });

  const mesurer = async () => {
    setState('running');
    setRes(await runFlyBench());
    setState('done');
  };

  // Les grandeurs dérivées de la mesure. Toutes nulles tant qu'on n'a pas mesuré : aucune valeur
  // d'attente, aucun exemple « typique » affiché en gris — un chiffre de démonstration finit
  // toujours par être lu comme un résultat.
  const gflops = res?.gflops ?? null;
  const balayages = gflops === null ? null : (gflops * 1e9) / FLOP_PAR_BALAYAGE;
  const tempsBalayage = balayages === null ? null : 1000 / balayages; // ms

  const toc = [
    { id: 'fly', label: t('The fly, as published', 'La mouche, telle que publiée') },
    { id: 'yours', label: t('Your GPU, measured here', 'Votre GPU, mesuré ici') },
    { id: 'scale', label: t('Both on one scale', 'Les deux sur une seule échelle') },
    { id: 'model', label: t('The part that is not a metaphor', 'La partie qui n’est pas une image') },
    { id: 'honest', label: t('What this does not say', 'Ce que cette page ne dit pas') },
  ];

  // Le panneau de mesure. Un seul message par état, jamais une erreur brute : un GPU qui refuse le
  // banc est un cas NORMAL sur le web (WebGPU manquant, pilote exotique, kill-switch), pas une panne
  // à faire lire au visiteur.
  const messageStatut = () => {
    switch (res?.status) {
      case 'no-webgpu':
        return t('This browser has no WebGPU, so there is nothing to measure. Chrome, Edge or a recent Safari will do it.',
                 'Ce navigateur n’a pas WebGPU : il n’y a rien à mesurer ici. Chrome, Edge ou un Safari récent le feront.');
      case 'no-adapter':
        return t('WebGPU is present but no GPU adapter was granted — often a headless or remote session.',
                 'WebGPU est là mais aucun adaptateur GPU n’a été accordé — souvent une session distante ou sans écran.');
      case 'failed-validation':
        return t(`The kernel did not match its CPU reference on this GPU (${res.failedAt}), so no number is shown. That check is the whole reason you can trust the ones that do appear.`,
                 `Le kernel n’a pas retrouvé sa référence CPU sur ce GPU (${res.failedAt}) : aucun chiffre n’est donc affiché. C’est cette vérification qui rend crédibles ceux qui s’affichent.`);
      case 'disabled':
        return t('Measurement disabled by ?flybench=0 — the control arm. Drop the flag to measure.',
                 'Mesure désactivée par ?flybench=0 — le bras témoin. Retirez le drapeau pour mesurer.');
      case 'error':
        return t('The GPU dropped the benchmark. Reloading usually fixes it; if it does not, your GPU is busy elsewhere.',
                 'Le GPU a lâché le banc. Un rechargement suffit d’ordinaire ; sinon, votre GPU travaille ailleurs.');
      default:
        return null;
    }
  };

  return (
    <DocsShell toc={toc}>
      <PageTitle title={t('Is your tab faster than a fruit fly?', 'Votre onglet va-t-il plus vite qu’une mouche ?')}>
        {t(`On ${FLY.published}, the complete wiring of a fruit fly's central nervous system was published: ${num(FLY.neurons)} neurons, ${num(FLY.synapses / 1e6)} million synapses — the largest brain ever mapped synapse by synapse. Your GPU is sitting right here. This page puts the two on the same scale, and the number for your side is measured in this tab when you press the button — not quoted from a spec sheet.`,
           `Le ${new Date(FLY.published).toLocaleDateString('fr-FR')}, le câblage complet du système nerveux central d’une drosophile a été publié : ${num(FLY.neurons)} neurones, ${num(FLY.synapses / 1e6)} millions de synapses — le plus grand cerveau jamais cartographié synapse par synapse. Votre GPU, lui, est juste là. Cette page met les deux sur la même échelle, et le chiffre de votre côté est mesuré dans cet onglet quand vous appuyez sur le bouton — pas recopié d’une fiche technique.`)}
      </PageTitle>

      {/* ── LE PANNEAU DE MESURE, tout en haut : c'est ce que les gens viennent faire ─────────── */}
      <div style={{
        margin: '18px 0 8px', padding: '20px 22px', borderRadius: 14,
        border: '1px solid var(--border-color)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)',
      }}>
        {state !== 'done' && (
          <>
            <button
              type="button"
              onClick={mesurer}
              disabled={state === 'running'}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 18px', borderRadius: 10, border: 'none', cursor: state === 'running' ? 'progress' : 'pointer',
                background: 'var(--accent-solid)', color: '#fff', fontFamily: 'var(--font-sans)',
                fontSize: 15, fontWeight: 700,
              }}
            >
              <Zap size={16} aria-hidden />
              {state === 'running' ? t('Measuring…', 'Mesure en cours…') : t('Measure my GPU', 'Mesurer mon GPU')}
            </button>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)', margin: '10px 0 0' }}>
              {t('About a second. No model, no download, nothing leaves the machine: a hand-written WGSL matmul runs on your GPU and is timed.',
                 'Environ une seconde. Aucun modèle, aucun téléchargement, rien ne quitte la machine : un matmul WGSL écrit à la main tourne sur votre GPU et on le chronomètre.')}
            </p>
          </>
        )}

        {/* `data-flybench` : point d'accroche du banc. Sans lui, le sélecteur [aria-live] attrape
            AUSSI l'annonceur de route de Next, qui porte le même attribut. */}
        <div aria-live="polite" data-flybench="result">
          {state === 'done' && gflops !== null && balayages !== null && tempsBalayage !== null && (
            <>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 6px' }}>
                {t('Your GPU, just now', 'Votre GPU, à l’instant')}
              </p>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 40, fontWeight: 800, lineHeight: 1.1, margin: 0, color: 'var(--text-primary)' }}>
                {num(gflops, 0)} <span style={{ fontSize: 22 }}>GFLOP/s</span>
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                {res?.device ? `${res.device} · ` : ''}
                {res?.spread ? t(`3 runs, ${num(res.spread.min)}–${num(res.spread.max)}`, `3 tirs, ${num(res.spread.min)}–${num(res.spread.max)}`) : ''}
                {' · '}
                {t('kernel checked against a CPU reference first', 'kernel vérifié contre une référence CPU d’abord')}
              </p>

              <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '18px 0' }} />

              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, lineHeight: 1.25, margin: 0, color: 'var(--text-primary)' }}>
                {t(`${num(balayages)} fly brains per second`, `${num(balayages)} cerveaux de mouche par seconde`)}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: '8px 0 0' }}>
                {t(`That is how many times, every second, this GPU could touch all ${num(FLY.synapses / 1e6)} million synapses of the published connectome once. One full sweep takes it ${tempsBalayage < 1 ? `${num(tempsBalayage * 1000)} microseconds` : `${num(tempsBalayage, 2)} milliseconds`}.`,
                   `C’est le nombre de fois où, chaque seconde, ce GPU pourrait toucher une fois les ${num(FLY.synapses / 1e6)} millions de synapses du connectome publié. Un balayage complet lui prend ${tempsBalayage < 1 ? `${num(tempsBalayage * 1000)} microsecondes` : `${num(tempsBalayage, 2)} millisecondes`}.`)}
              </p>
            </>
          )}

          {state === 'done' && gflops === null && (
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
              {messageStatut()}
            </p>
          )}
        </div>
      </div>

      <Section id="fly" title={t('The fly, as published', 'La mouche, telle que publiée')}>
        <P>
          {t(`A connectome is a wiring diagram: every neuron, and every place two of them touch. The male central nervous system released in June 2026 and published in Cell on ${FLY.published} holds ${num(FLY.neurons)} neurons and ${num(FLY.synapses)} synapses, and it is the first to cover the brain, both optic lobes and the ventral nerve cord of one animal. It is also the first male one, which is why it can be compared cell by cell with the female brain mapped before it.`,
             `Un connectome est un schéma de câblage : chaque neurone, et chaque endroit où deux d’entre eux se touchent. Le système nerveux central mâle sorti en juin 2026 et publié dans Cell le ${new Date(FLY.published).toLocaleDateString('fr-FR')} compte ${num(FLY.neurons)} neurones et ${num(FLY.synapses)} synapses, et c’est le premier à couvrir le cerveau, les deux lobes optiques et la corde nerveuse ventrale d’un même animal. C’est aussi le premier mâle, d’où la comparaison cellule par cellule possible avec le cerveau femelle cartographié avant lui.`)}
        </P>
        <P>
          {t('It is worth being precise about what that buys you, because the press was not: a connectome tells you what is wired to what. It does not tell you what any of it does, how often a neuron fires, or how strong a connection is. It is the map, not the traffic.',
             'Il vaut la peine d’être précis sur ce que ça donne, parce que la presse ne l’a pas été : un connectome dit ce qui est câblé à quoi. Il ne dit pas ce que ça calcule, à quelle fréquence un neurone décharge, ni la force d’une connexion. C’est la carte, pas le trafic.')}
        </P>
        <P>
          {t('Sources, because the numbers above are not ours: ', 'Sources, parce que les chiffres ci-dessus ne sont pas les nôtres : ')}
          <a href={FLY.blog} target="_blank" rel="noopener noreferrer">Google Research</a>{' · '}
          <a href={FLY.data} target="_blank" rel="noopener noreferrer">Janelia FlyEM</a>{' · '}
          <a href={FLY.paper} target="_blank" rel="noopener noreferrer">Cell</a>
          {t('. The dataset itself is CC-BY.', '. Le jeu de données lui-même est en CC-BY.')}
        </P>
      </Section>

      <Section id="yours" title={t('Your GPU, measured here', 'Votre GPU, mesuré ici')}>
        <P>
          {t('The button above runs a tiled 16×16 f32 matrix multiply written in WGSL by hand — the same shape of kernel the engine uses to read a prompt — and times it. Three runs, median reported, spread shown next to it, because a single run of anything on a GPU wanders by more than the differences people like to argue about.',
             'Le bouton ci-dessus exécute un produit de matrices f32 tuilé 16×16, écrit en WGSL à la main — la forme de kernel dont le moteur se sert pour lire un prompt — et le chronomètre. Trois tirs, médiane annoncée, dispersion affichée à côté, parce qu’un tir unique sur un GPU s’égare de plus que les écarts dont on aime discuter.')}
        </P>
        <P>
          {t('Before any of that, the kernel is checked against a CPU reference on two shapes, one aligned to the tile and one deliberately not. If it disagrees, this page shows you no number at all. That rule exists because a shader that miscompiles on an unusual GPU does not throw an error — it returns a throughput. Wrong, published, and perfectly plausible. Every kernel in the engine carries the same gate, and ',
             'Avant tout ça, le kernel est confronté à une référence CPU sur deux formes, l’une alignée sur la tuile et l’autre délibérément pas. S’il diverge, cette page n’affiche aucun chiffre. Cette règle existe parce qu’un shader mal compilé sur un GPU inhabituel ne lève pas d’erreur — il rend un débit. Faux, publié, et parfaitement crédible. Chaque kernel du moteur porte le même garde-fou, et ')}
          <code>?flybench=0</code>
          {t(' turns this one off if you want the page without it.', ' éteint celui-ci si vous voulez la page sans lui.')}
        </P>
        <P>
          {t('What the number is not: the peak figure on your GPU’s spec sheet. That one assumes half precision, perfect alignment and an occupancy nobody reaches. This is what the chip actually holds on hand-written code, submission overhead included.',
             'Ce que le chiffre n’est pas : le pic de la fiche technique de votre GPU. Celui-là suppose la demi-précision, un alignement parfait et une occupation que personne n’atteint. Ici, c’est ce que la puce tient vraiment sur du code écrit à la main, coût de soumission compris.')}
        </P>
      </Section>

      <Section id="scale" title={t('Both on one scale', 'Les deux sur une seule échelle')}>
        <P>
          {t(`To compare a nervous system with a chip you need one shared unit, and there is only one honest candidate: crossing a synapse once is a multiply and an add. So one full sweep of the fly's connectome — every one of its ${num(FLY.synapses / 1e6)} million synapses, once — costs ${num(FLOP_PAR_BALAYAGE / 1e6)} million floating-point operations. Divide your measured throughput by that and you get the figure above.`,
             `Pour comparer un système nerveux et une puce, il faut une unité commune, et il n’y a qu’un candidat honnête : traverser une synapse une fois, c’est une multiplication et une addition. Un balayage complet du connectome de la mouche — ses ${num(FLY.synapses / 1e6)} millions de synapses, une fois chacune — coûte donc ${num(FLOP_PAR_BALAYAGE / 1e6)} millions d’opérations flottantes. Divisez votre débit mesuré par ça, et vous obtenez le chiffre ci-dessus.`)}
        </P>
        <P>
          {t('The reason that number tends to be large is the interesting part. A fly is not slow, and a laptop is not a supercomputer. It is that a connectome is small — 125 million connections is a rounding error next to what a GPU moves in a second — while being enough to fly, hunt, court and learn. Efficiency and scale are different axes, and biology wins the one this page does not measure.',
             'La raison pour laquelle ce chiffre est gros est la partie intéressante. Ce n’est pas que la mouche est lente ni qu’un portable est un supercalculateur. C’est qu’un connectome est PETIT — 125 millions de connexions sont une paille à côté de ce qu’un GPU déplace en une seconde — tout en suffisant à voler, chasser, courtiser et apprendre. L’efficacité et l’échelle sont deux axes distincts, et la biologie gagne celui que cette page ne mesure pas.')}
        </P>
      </Section>

      <Section id="model" title={t('The part that is not a metaphor', 'La partie qui n’est pas une image')}>
        <P>
          {t(`Here is where the comparison stops being a party trick. The model this site loads by default on a modest machine, ${MODEL.name}, carries ${num(MODEL.params / 1e6)} million weights — ${num(MODEL.params / FLY.synapses, 1)}× more numbers than the fly's entire nervous system has synapses. It is ${MODEL.mb} MB. It streams into this tab from Hugging Face and answers you, with no server doing the work.`,
             `C’est ici que la comparaison cesse d’être un numéro de foire. Le modèle que ce site charge par défaut sur une machine modeste, ${MODEL.name}, porte ${num(MODEL.params / 1e6)} millions de poids — ${num(MODEL.params / FLY.synapses, 1)} fois plus de nombres que le système nerveux entier de la mouche n’a de synapses. Il pèse ${MODEL.mb} Mo. Il se charge dans cet onglet depuis Hugging Face et vous répond, sans qu’aucun serveur ne fasse le travail.`)}
        </P>
        <P>
          {t('That is the whole argument of this project, and the fly made it legible: the amount of computation people assume needs a data centre has been sitting in the machine on their desk for a while. The connectome just gave everyone a yardstick they can feel.',
             'C’est tout l’argument de ce projet, et la mouche l’a rendu lisible : la quantité de calcul qu’on croit réservée à un centre de données dort depuis un moment dans la machine posée sur le bureau. Le connectome a simplement donné à tout le monde un étalon qu’on sent.')}
        </P>
        <p style={{ margin: '14px 0 0' }}>
          <Link
            href={href('/chat')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 18px', borderRadius: 10,
              background: 'var(--accent-solid)', color: '#fff',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
            }}
          >
            {t('Run the 230M model in this tab', 'Lancer le modèle 230M dans cet onglet')}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </p>
      </Section>

      <Section id="honest" title={t('What this does not say', 'Ce que cette page ne dit pas')}>
        <P>
          {t('Your GPU is not smarter than a fly, and this page never claimed a sweep of the connectome is a thought. Three things it deliberately leaves out, since leaving them out silently is how this kind of comparison turns into a lie:',
             'Votre GPU n’est pas plus intelligent qu’une mouche, et cette page n’a jamais prétendu qu’un balayage du connectome soit une pensée. Trois choses qu’elle laisse volontairement de côté — les taire est précisément ce qui transforme ce genre de comparaison en mensonge :')}
        </P>
        <ul style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 10px', paddingLeft: 20 }}>
          <li>
            {t('One synapse = one multiply-accumulate is a convention, not a biological fact. Real synapses are not multiplications, and the connectome contains no firing rates to multiply by.',
               'Une synapse = un multiply-accumulate est une convention, pas un fait biologique. Une vraie synapse n’est pas une multiplication, et le connectome ne contient aucune fréquence de décharge à multiplier.')}
          </li>
          <li>
            {t('Power. The fly runs its whole nervous system on a fraction of a milliwatt while flying itself around. Your GPU was pulling tens of watts for the second it took to produce that number, and on this axis the fly wins by a margin nothing here can close.',
               'L’énergie. La mouche fait tourner tout son système nerveux sur une fraction de milliwatt, en se pilotant elle-même en vol. Votre GPU tirait des dizaines de watts pendant la seconde qu’a duré ce chiffre, et sur cet axe la mouche gagne d’une marge que rien ici ne comble.')}
          </li>
          <li>
            {t('Sweeping a wiring diagram is not simulating a fly. Doing that needs dynamics the connectome does not contain, and choosing those dynamics is where all the real disagreement between neuroscientists lives.',
               'Balayer un schéma de câblage n’est pas simuler une mouche. Le faire demande une dynamique que le connectome ne contient pas, et c’est dans le choix de cette dynamique que vit tout le désaccord réel entre neuroscientifiques.')}
          </li>
        </ul>
        <P>
          {t('What is left after those three subtractions is still true, and still the point: the arithmetic of a whole animal brain is not a large amount of arithmetic by 2026 standards, and you are carrying enough of it to run a language model without asking anyone for a server.',
             'Ce qui reste après ces trois soustractions est vrai quand même, et reste le sujet : l’arithmétique d’un cerveau animal entier n’est pas une grosse quantité d’arithmétique aux standards de 2026, et vous en portez assez pour faire tourner un modèle de langage sans demander de serveur à personne.')}
        </P>
      </Section>
    </DocsShell>
  );
}
