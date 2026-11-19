"use client";

// L'extension Chrome (/extension) — page de DOCUMENTATION (DocsShell), même direction artistique que
// /agents. C'est une BÊTA : l'extension n'est pas publiée sur le Chrome Web Store, la page le dit
// en tête, sert le zip du build (public/brimkern-extension-<version>.zip, copié par
// scripts/build-extension.mjs) et n'annonce que ce qui existe et a été mesuré (règle 4 du dépôt). Pas d'allégation
// écologique générique : des faits (aperçu IA non demandé, calcul au clic seulement) et, pour
// l'énergie, l'annonce qu'un chiffre sera MESURÉ avant d'être publié (ROADMAP § 30).
//
// Les tailles de modèle viennent de packages/extension/src/tier.ts — la même source que le
// consentement affiché par l'extension.

import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { useT, useHref, useLocale } from '@/lib/i18n';
import { fmtModelSize } from '@/lib/modelCatalog';
import { TIER_MODELS, LIGHT_MEMORY_GB } from '../../../packages/extension/src/tier';
import manifest from '../../../packages/extension/manifest.json';
import DocsShell, { Code, P } from '../docs/DocsShell';
import s from '../cli/cli.module.css';

function Screen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={s.screen}>
      <div className={s.bar}>
        <span><span className={s.barDot} aria-hidden="true" />{title}</span>
      </div>
      {/* tabIndex : sur téléphone le contenu défile horizontalement (axe scrollable-region-focusable). */}
      <div className={s.body} tabIndex={0}>{children}</div>
    </div>
  );
}

function H2({ id, n, children }: { id: string; n: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className={s.h2} style={{ scrollMarginTop: 24 }}>
      <span className={s.h2Num} aria-hidden="true">{n}</span>
      {children}
    </h2>
  );
}

const cell = { padding: '8px 12px' } as const;
const ZIP = `/brimkern-extension-${manifest.version}.zip`;

export default function ExtensionClient() {
  const t = useT();
  const href = useHref();
  const { locale } = useLocale();
  const fr = locale === 'fr';
  const light = fmtModelSize(TIER_MODELS.light.bytes, fr);
  const standard = fmtModelSize(TIER_MODELS.standard.bytes, fr);

  const toc = [
    { id: 'what', label: t('What it does', 'Ce qu’elle fait') },
    { id: 'how', label: t('How it works', 'Comment ça marche') },
    { id: 'machine', label: t('Fitted to your machine', 'Adaptée à votre machine') },
    { id: 'measured', label: t('Measured', 'Mesuré') },
    { id: 'privacy', label: t('Privacy and energy', 'Confidentialité et énergie') },
    { id: 'limits', label: t('Limits', 'Limites') },
    { id: 'try', label: t('Install the beta', 'Installer la bêta') },
  ];

  return (
    <DocsShell toc={toc}>
      {/* ── EN-TÊTE ─────────────────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 12 }}>
        <p className={s.eyebrow}>{t('Chrome extension · beta', 'Extension Chrome · bêta')}</p>
        <h1 className={s.h1}>
          {t('Answers to your Google searches, computed on your device', 'Des réponses à vos recherches Google, calculées sur votre appareil')}
        </h1>
        <p className={s.lede}>
          {t(
            'The extension stops asking Google for its AI Overview and puts a button in its place. Click it, and a model running on your own GPU answers from the results already on the page, with its sources. No click, no computation.',
            'L’extension cesse de demander à Google son aperçu IA et met un bouton à sa place. Un clic, et un modèle qui tourne sur votre propre GPU répond à partir des résultats déjà affichés, sources à l’appui. Pas de clic, pas de calcul.'
          )}
        </p>
        <p className={s.caption} style={{ marginTop: 0 }}>
          <strong>{t('Status:', 'Statut :')}</strong>{' '}
          {t('beta. Not on the Chrome Web Store yet: ', 'bêta. Pas encore sur le Chrome Web Store : ')}
          <a href="#try" style={{ color: 'var(--text-primary)' }}>{t('install it from this page', 'elle s’installe depuis cette page')}</a>.{''}
        </p>
      </div>

      {/* ── CE QU'ELLE FAIT ─────────────────────────────────────────────────────────────── */}
      <H2 id="what" n="01">{t('What it does', 'Ce qu’elle fait')}</H2>
      <div className={s.points}>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('The AI Overview is not requested', 'L’aperçu IA n’est pas demandé')}</p>
          <p className={s.pointText}>{t('Every web search goes out with Google’s own “Web” filter (udm=14), whose results page has no AI Overview. Hiding it would not be enough: by the time a page shows, Google has already generated it.', 'Chaque recherche web part avec le filtre « Web » de Google lui-même (udm=14), dont la page de résultats n’a pas d’aperçu IA. Le masquer ne suffirait pas : quand la page s’affiche, Google l’a déjà généré.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('An answer only when you ask', 'Une réponse seulement si vous la demandez')}</p>
          <p className={s.pointText}>{t('Until you click, the extension makes no request and does not touch the GPU. Images, News and the other tabs work as usual.', 'Tant que vous ne cliquez pas, l’extension ne fait aucune requête et ne touche pas au GPU. Images, Actualités et les autres onglets fonctionnent comme d’habitude.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Sources, always', 'Des sources, toujours')}</p>
          <p className={s.pointText}>{t('Each answer lists the results it was built from, so you can check it in one click.', 'Chaque réponse liste les résultats dont elle est tirée : on la vérifie en un clic.')}</p>
        </div>
      </div>

      {/* ── COMMENT ÇA MARCHE ───────────────────────────────────────────────────────────── */}
      <H2 id="how" n="02">{t('How it works', 'Comment ça marche')}</H2>
      <P>
        {t(
          'The model reads the titles and snippets of the results Google shows you, nothing else. It runs in a hidden page of the extension, so its weights are cached under the extension, not under google.com, and it closes itself after ten idle minutes to give the GPU memory back.',
          'Le modèle lit les titres et extraits des résultats que Google vous affiche, rien d’autre. Il tourne dans une page cachée de l’extension : ses poids sont mis en cache sous l’extension, pas sous google.com, et elle se ferme d’elle-même après dix minutes d’inactivité pour rendre la mémoire du GPU.'
        )}
      </P>
      <Screen title={t('one search', 'une recherche')}>
        <pre className={s.pre}>
          <span className={s.bold}>google.com/search?q=…</span>{'  '}<span className={s.cyan}>+ udm=14</span>{'\n'}
          <span className={s.dim}>{'   │ '}</span>{t('results page, no AI Overview', 'page de résultats, sans aperçu IA')}{'\n'}
          <span className={s.dim}>{'   ▼'}</span>{'\n'}
          <span className={s.sand}>{t('[ Answer on this device ]', '[ Répondre sur cet appareil ]')}</span>{'  '}<span className={s.dim}>{t('← nothing happens until the click', '← rien ne se passe avant le clic')}</span>{'\n'}
          <span className={s.dim}>{'   │ '}</span>{t('titles + snippets already on the page', 'titres + extraits déjà sur la page')}{'\n'}
          <span className={s.dim}>{'   ▼'}</span>{'\n'}
          <span className={s.boldRed}>Brimkern</span>{t('  (hidden extension page)', '  (page cachée de l’extension)')}{'\n'}
          <span className={s.dim}>{'   │'}</span>{'\n'}
          <span className={s.dim}>{'   ▼'}</span>{'\n'}
          <span className={s.green}>{t('your GPU', 'votre GPU')}</span>{t('  (WebGPU, hand-written WGSL kernels)', '  (WebGPU, kernels WGSL écrits à la main)')}{'\n'}
          <span className={s.dim}>{'   └─▶ '}</span>{t('answer + sources, in the page', 'réponse + sources, dans la page')}
        </pre>
      </Screen>

      {/* ── ADAPTÉE À LA MACHINE ────────────────────────────────────────────────────────── */}
      <H2 id="machine" n="03">{t('Fitted to your machine', 'Adaptée à votre machine')}</H2>
      <P>
        {t(
          'The model is chosen once, at the first download, from what the browser says about the device and the connection. A model already on disk is always reused: no second download because the Wi-Fi got better.',
          'Le modèle est choisi une fois, au premier téléchargement, d’après ce que le navigateur dit de l’appareil et de la connexion. Un modèle déjà sur le disque est toujours réutilisé : pas de second téléchargement parce que le Wi-Fi s’est amélioré.'
        )}
      </P>
      <div style={{ overflowX: 'auto', margin: '14px 0' }} tabIndex={0} role="region" aria-label={t('Model by device', 'Modèle selon l’appareil')}>
        <table style={{ width: '100%', fontSize: 13.5, borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={cell}>{t('When', 'Quand')}</th>
              <th style={cell}>{t('Model', 'Modèle')}</th>
              <th style={cell}>{t('Download', 'Téléchargement')}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={cell}>{t(`Data saver on, connection under 1.5 Mbit/s, or ${LIGHT_MEMORY_GB} GB of memory or less`, `Économiseur de données, connexion sous 1,5 Mbit/s, ou ${LIGHT_MEMORY_GB} Go de mémoire ou moins`)}</td>
              <td style={{ ...cell, fontFamily: 'var(--font-mono)' }}>{TIER_MODELS.light.label}</td>
              <td style={cell}>{light}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={cell}>{t('Otherwise', 'Sinon')}</td>
              <td style={{ ...cell, fontFamily: 'var(--font-mono)' }}>{TIER_MODELS.standard.label}</td>
              <td style={cell}>{standard}</td>
            </tr>
            <tr>
              <td style={cell}>{t('No WebGPU, or a software-only adapter', 'Pas de WebGPU, ou un adaptateur purement logiciel')}</td>
              <td style={cell} colSpan={2}>{t('No answer, and the panel says why: on the processor it would be very slow.', 'Pas de réponse, et le panneau dit pourquoi : sur le processeur, ce serait très lent.')}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <P>
        {t(
          'The first download is never silent: the panel shows the model, its exact size and where it comes from (Hugging Face), and waits for your click.',
          'Le premier téléchargement n’est jamais silencieux : le panneau affiche le modèle, sa taille exacte et sa provenance (Hugging Face), et attend votre clic.'
        )}
      </P>

      {/* ── MESURÉ ──────────────────────────────────────────────────────────────────────── */}
      <H2 id="measured" n="04">{t('Measured', 'Mesuré')}</H2>
      <div className={s.points}>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('44 right answers in 48, none wrong', '44 réponses justes sur 48, aucune fausse')}</p>
          <p className={s.pointText}>{t(`${TIER_MODELS.standard.label}, on 24 real Google results pages (14 in French, 10 in English), each answered twice. The other 4 were partly right: vague, or a detail off.`, `${TIER_MODELS.standard.label}, sur 24 vraies pages de résultats Google (14 en français, 10 en anglais), chacune deux fois. Les 4 autres étaient en partie justes : vagues, ou un détail inexact.`)}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('First use: about 7 min 40 s', 'Premier usage : 7 min 40 s environ')}</p>
          <p className={s.pointText}>{t(`Click to answer, including the ${standard} download; it depends on your connection.`, `Du clic à la réponse, téléchargement de ${standard} compris ; cela dépend de votre connexion.`)}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('After a browser restart: 16 to 22 s', 'Après un redémarrage du navigateur : 16 à 22 s')}</p>
          <p className={s.pointText}>{t('The first answer of a session moves the model from disk to the GPU.', 'La première réponse d’une session fait passer le modèle du disque au GPU.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Then: 5.3 to 5.9 s', 'Ensuite : 5,3 à 5,9 s')}</p>
          <p className={s.pointText}>{t('Per answer, of which 4.2 to 4.6 s of computation.', 'Par réponse, dont 4,2 à 4,6 s de calcul.')}</p>
        </div>
      </div>
      <p className={s.caption}>
        {t(
          'Measured on 2026-11-15 on an M-series Mac in Chrome. Quality: pages captured from Google, answers read one by one (scripts/e2e/serp-quality.mjs). Times: the extension bench, on a fresh profile for the first use (scripts/e2e/extension-google.mjs).',
          'Mesuré le 15/11/2026 sur un Mac série M dans Chrome. Qualité : pages capturées sur Google, réponses lues une à une (scripts/e2e/serp-quality.mjs). Temps : le banc de l’extension, sur un profil neuf pour le premier usage (scripts/e2e/extension-google.mjs).'
        )}
      </p>

      {/* ── CONFIDENTIALITÉ ET ÉNERGIE ──────────────────────────────────────────────────── */}
      <H2 id="privacy" n="05">{t('Privacy and energy', 'Confidentialité et énergie')}</H2>
      <P>
        {t(
          'The answer is built from what is already on your screen: the extension sends no extra request, except the one-time model download from Hugging Face. Google still receives your search; that is what a Google search is.',
          'La réponse est construite à partir de ce qui est déjà à l’écran : l’extension n’envoie aucune requête de plus, hormis le téléchargement unique du modèle depuis Hugging Face. Google reçoit toujours votre recherche ; c’est ce qu’est une recherche Google.'
        )}
      </P>
      {/* Cette liste sert de POLITIQUE DE CONFIDENTIALITÉ de la fiche Chrome Web Store
          (brimkern.com/extension#privacy) : elle doit rester conforme aux déclarations de
          packages/extension/README.md, onglet « Privacy practices ». */}
      <div className={s.points}>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('What it reads', 'Ce qu’elle lit')}</p>
          <p className={s.pointText}>{t('On Google results pages only: your search and the titles, addresses and snippets of the results. Nothing on any other site.', 'Sur les pages de résultats Google seulement : votre recherche et les titres, adresses et extraits des résultats. Rien sur aucun autre site.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Where it is processed', 'Où c’est traité')}</p>
          <p className={s.pointText}>{t('On your device, by the model running on your GPU. It never leaves the browser.', 'Sur votre appareil, par le modèle qui tourne sur votre GPU. Rien ne quitte le navigateur.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('What it stores', 'Ce qu’elle conserve')}</p>
          <p className={s.pointText}>{t('The model weights, in the browser cache, so they are not downloaded twice. No search history, no answer, no account.', 'Les poids du modèle, dans le cache du navigateur, pour ne pas les retélécharger. Aucun historique de recherche, aucune réponse, aucun compte.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('What it sends', 'Ce qu’elle envoie')}</p>
          <p className={s.pointText}>{t('Nothing to Brimkern: no analytics, no tracking. One request type only: the model download from Hugging Face, after you agree to it, which like any download reveals your IP address to Hugging Face.', 'Rien à Brimkern : ni mesure d’audience, ni pistage. Un seul type de requête : le téléchargement du modèle depuis Hugging Face, après votre accord, qui comme tout téléchargement révèle votre adresse IP à Hugging Face.')}</p>
        </div>
      </div>
      <p className={s.caption}>
        {t('Questions about this policy: ', 'Questions sur cette politique : ')}
        <a href="https://github.com/RomainKH/Brimkern/issues" style={{ color: 'var(--text-primary)' }}>github.com/RomainKH/Brimkern/issues</a>
      </p>
      <P>
        {t(
          'On energy, two facts and one commitment. The AI Overview is not requested, and nothing is computed unless you click. What a local answer costs in watt-hours has not been measured yet; we will publish that figure once it is measured, not an estimate.',
          'Sur l’énergie, deux faits et un engagement. L’aperçu IA n’est pas demandé, et rien n’est calculé sans votre clic. Ce que coûte une réponse locale en wattheures n’est pas encore mesuré ; nous publierons ce chiffre une fois mesuré, pas une estimation.'
        )}
      </P>

      {/* ── LIMITES ─────────────────────────────────────────────────────────────────────── */}
      <H2 id="limits" n="06">{t('Limits', 'Limites')}</H2>
      <div className={s.points}>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('A small model can be wrong', 'Un petit modèle peut se tromper')}</p>
          <p className={s.pointText}>{t(`On our benchmark, ${TIER_MODELS.standard.label} gave no wrong answer, but some stay vague (the products to use where steps were asked). The light model got 2 answers in 48 wrong. The panel says so under every answer, next to the sources.`, `Sur notre banc, ${TIER_MODELS.standard.label} n’a donné aucune réponse fausse, mais certaines restent vagues (les produits à utiliser quand on demandait les étapes). Le modèle léger s’est trompé 2 fois sur 48. Le panneau le rappelle sous chaque réponse, à côté des sources.`)}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Chrome and Google only', 'Chrome et Google seulement')}</p>
          <p className={s.pointText}>{t('Other Chromium browsers and other search engines are not tested yet.', 'Les autres navigateurs Chromium et les autres moteurs de recherche ne sont pas encore testés.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('The “Web” results page', 'La page de résultats « Web »')}</p>
          <p className={s.pointText}>{t('Without the AI Overview also comes without the rich panels of the “All” tab (images, maps, knowledge panel). The other tabs stay one click away.', 'Sans aperçu IA, c’est aussi sans les encarts riches de l’onglet « Tous » (images, cartes, fiche de connaissance). Les autres onglets restent à un clic.')}</p>
        </div>
      </div>

      {/* ── ESSAYER ─────────────────────────────────────────────────────────────────────── */}
      <H2 id="try" n="07">{t('Install the beta', 'Installer la bêta')}</H2>
      <P>
        {t(
          'Until the Chrome Web Store release, the extension is installed by hand, in Chrome 116 or later. It takes a minute.',
          'En attendant la sortie sur le Chrome Web Store, l’extension s’installe à la main, dans Chrome 116 ou plus récent. Cela prend une minute.'
        )}
      </P>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', margin: '4px 0 14px' }}>
        <a href={ZIP} download className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
          <Download size={14} aria-hidden="true" /> {t(`Download the beta (v${manifest.version}, .zip)`, `Télécharger la bêta (v${manifest.version}, .zip)`)}
        </a>
      </div>
      <ol style={{ margin: '0 0 14px', paddingLeft: 22, lineHeight: 1.7, fontSize: 14.5 }}>
        <li>{t('Unzip the file, and put the folder somewhere it can stay: Chrome loads the extension from it at every start.', 'Décompressez le fichier, et rangez le dossier là où il pourra rester : Chrome charge l’extension depuis ce dossier à chaque démarrage.')}</li>
        <li>{t('Open chrome://extensions and turn on “Developer mode” (top right).', 'Ouvrez chrome://extensions et activez le « Mode développeur » (en haut à droite).')}</li>
        <li>{t('Click “Load unpacked” and select the unzipped folder.', 'Cliquez sur « Charger l’extension non empaquetée » et sélectionnez le dossier décompressé.')}</li>
        <li>{t('Search on Google: the button appears above the results.', 'Faites une recherche Google : le bouton apparaît au-dessus des résultats.')}</li>
      </ol>
      <P>
        {t(
          'A beta installed this way does not update itself: for a new version, download it again, replace the folder and press the reload arrow in chrome://extensions. To remove it, click “Remove” there.',
          'Une bêta installée ainsi ne se met pas à jour seule : pour une nouvelle version, téléchargez-la de nouveau, remplacez le dossier et cliquez sur la flèche de rechargement dans chrome://extensions. Pour la retirer, cliquez sur « Supprimer » au même endroit.'
        )}
      </P>
      <P>{t('The zip is the output of the public build. To build it yourself:', 'Le zip est la sortie du build public. Pour le construire vous-même :')}</P>
      <Code lang="sh">{'git clone https://github.com/RomainKH/Brimkern && cd Brimkern\nnpm install\nnpm run build:extension'}</Code>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
        <Link href={href('/docs/models')} className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
          {t('The engine and its models', 'Le moteur et ses modèles')} <ArrowRight size={14} />
        </Link>
      </div>
    </DocsShell>
  );
}
