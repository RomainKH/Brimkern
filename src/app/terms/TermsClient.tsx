"use client";

// Client half of /terms (metadata stays in page.tsx). Why this page exists: the LTXV Open Weights
// License (§ 3.1) requires its use restrictions (Attachment A) to be included "as an enforceable
// provision" in the agreement that governs use of the model — a notice on a card is not an
// agreement. The LTX-Video card links here and asks for explicit acceptance before loading.
// The restrictions are quoted VERBATIM from the license (labels included, even its duplicate « (a) »);
// the French text is a convenience translation, and the page says the English one prevails.

import { useT } from '@/lib/i18n';
import DocsShell, { P, PageTitle, Section } from '../docs/DocsShell';

interface L { en: string; fr: string }

const LTXV_LICENSE = 'https://huggingface.co/romainkh14/brimkern-ltx-BRIK/blob/main/LICENSE';

// LTXV Open Weights License 0.X, Attachment A — « Use Restrictions ».
const RESTRICTIONS: { label: string; text: L }[] = [
  { label: '(a)', text: { en: 'In any way that violates any applicable national, federal, state, local or international law or regulation;', fr: 'D’une manière qui enfreint une loi ou une réglementation applicable, qu’elle soit nationale, fédérale, d’un État, locale ou internationale ;' } },
  { label: '(b)', text: { en: 'For the purpose of exploiting, Harming or attempting to exploit or Harm minors in any way;', fr: 'Dans le but d’exploiter des mineurs ou de leur nuire, ou de tenter de le faire, de quelque manière que ce soit ;' } },
  { label: '(c)', text: { en: 'To generate or disseminate false information and/or content with the purpose of Harming others;', fr: 'Pour générer ou diffuser des informations ou des contenus faux dans le but de nuire à autrui ;' } },
  { label: '(d)', text: { en: 'To generate or disseminate personal identifiable information that can be used to Harm an individual;', fr: 'Pour générer ou diffuser des données personnelles identifiantes pouvant servir à nuire à une personne ;' } },
  { label: '(e)', text: { en: 'To generate or disseminate information and/or content (e.g. images, code, posts, articles), and place the information and/or content in any context (e.g. bot generating tweets) without expressly and intelligibly disclaiming that the information and/or content is machine generated;', fr: 'Pour générer ou diffuser des informations ou des contenus (par ex. images, code, publications, articles) et les placer dans un contexte quelconque (par ex. un bot qui publie des tweets) sans indiquer expressément et intelligiblement qu’ils sont générés par une machine ;' } },
  { label: '(f)', text: { en: 'To defame, disparage or otherwise harass others;', fr: 'Pour diffamer, dénigrer ou harceler autrui de toute autre manière ;' } },
  { label: '(g)', text: { en: 'To impersonate or attempt to impersonate (e.g. deepfakes) others without their consent;', fr: 'Pour se faire passer, ou tenter de se faire passer, pour autrui sans son consentement (par ex. hypertrucages, « deepfakes ») ;' } },
  { label: '(h)', text: { en: 'For fully automated decision making that adversely impacts an individual’s legal rights or otherwise creates or modifies a binding, enforceable obligation;', fr: 'Pour une prise de décision entièrement automatisée qui porte atteinte aux droits d’une personne, ou qui crée ou modifie une obligation contraignante et opposable ;' } },
  { label: '(i)', text: { en: 'For any use intended to or which has the effect of discriminating against or Harming individuals or groups based on online or offline social behavior or known or predicted personal or personality characteristics;', fr: 'Pour tout usage qui vise à discriminer des personnes ou des groupes, ou à leur nuire, ou qui a cet effet, en fonction de leur comportement social en ligne ou hors ligne, ou de caractéristiques personnelles ou de personnalité connues ou prédites ;' } },
  { label: '(j)', text: { en: 'To exploit any of the vulnerabilities of a specific group of persons based on their age, social, physical or mental characteristics, in order to materially distort the behavior of a person pertaining to that group in a manner that causes or is likely to cause that person or another person physical or psychological Harm;', fr: 'Pour exploiter les vulnérabilités d’un groupe de personnes particulier, liées à leur âge ou à leurs caractéristiques sociales, physiques ou mentales, afin d’altérer substantiellement le comportement d’une personne de ce groupe d’une manière qui cause, ou est susceptible de causer, à cette personne ou à une autre un préjudice physique ou psychologique ;' } },
  { label: '(k)', text: { en: 'For any use intended to or which has the effect of discriminating against individuals or groups based on legally protected characteristics or categories;', fr: 'Pour tout usage qui vise à discriminer des personnes ou des groupes, ou qui a cet effet, en fonction de caractéristiques ou de catégories protégées par la loi ;' } },
  { label: '(a)', text: { en: 'To provide medical advice and medical results interpretation;', fr: 'Pour fournir des conseils médicaux ou interpréter des résultats médicaux ;' } },
  { label: '(l)', text: { en: 'To generate or disseminate information for the purpose to be used for administration of justice, law enforcement, immigration or asylum processes, such as predicting an individual will commit fraud/crime commitment (e.g. by text profiling, drawing causal relationships between assertions made in documents, indiscriminate and arbitrarily-targeted use);', fr: 'Pour générer ou diffuser des informations destinées à l’administration de la justice, aux forces de l’ordre ou aux procédures d’immigration ou d’asile, par exemple pour prédire qu’une personne commettra une fraude ou un crime (notamment par profilage de textes, en établissant des liens de causalité entre des affirmations contenues dans des documents, ou par un usage indiscriminé et ciblé arbitrairement) ;' } },
  { label: '(m)', text: { en: 'To generate and/or disseminate malware (including – but not limited to – ransomware) or any other content to be used for the purpose of harming electronic systems;', fr: 'Pour générer ou diffuser des logiciels malveillants (y compris, sans s’y limiter, des rançongiciels) ou tout autre contenu destiné à endommager des systèmes électroniques ;' } },
  { label: '(n)', text: { en: 'To engage in, promote, incite, or facilitate discrimination or other unlawful of harmful conduct in the provision of employment, employment benefits, credit, housing, or other essential goods and services;', fr: 'Pour pratiquer, promouvoir, inciter ou faciliter une discrimination ou tout autre comportement illégal ou préjudiciable dans l’accès à l’emploi, aux avantages liés à l’emploi, au crédit, au logement ou à d’autres biens et services essentiels ;' } },
  { label: '(o)', text: { en: 'To engage in, promote, incite, or facilitate the harassment, abuse, threatening, or bullying of individuals or groups of individuals.', fr: 'Pour pratiquer, promouvoir, inciter ou faciliter le harcèlement, les abus, les menaces ou l’intimidation de personnes ou de groupes de personnes.' } },
];

const linkStyle = { color: 'var(--accent-text)', textDecoration: 'underline' } as const;

export default function TermsClient() {
  const t = useT();
  const toc = [
    { id: 'ltx-video', label: 'LTX-Video 2B' },
    { id: 'language', label: t('Language', 'Langue') },
  ];

  return (
    <DocsShell toc={toc}>
      <PageTitle title={t('Terms of use', 'Conditions d’utilisation')}>
        {t(
          'Brimkern runs models in your browser, on your own GPU: your prompts and what you generate stay on your device and never reach a Brimkern server. Each model remains under its own license, linked from its card. This page sets out the terms that a model’s license requires us to pass on to you.',
          'Brimkern fait tourner les modèles dans votre navigateur, sur votre propre GPU : vos prompts et ce que vous générez restent sur votre appareil et n’atteignent jamais un serveur Brimkern. Chaque modèle reste sous sa propre licence, indiquée sur sa carte. Cette page reprend les conditions que la licence d’un modèle nous impose de vous transmettre.',
        )}
      </PageTitle>
      <P>{t('Last updated: November 12, 2026.', 'Dernière mise à jour : 12 novembre 2026.')}</P>

      <Section id="ltx-video" title="LTX-Video 2B">
        <P>
          {t('The LTX-Video 2B pipeline offered on Brimkern is derived from LTX-Video, a model by Lightricks Ltd., and is distributed under the ', 'Le pipeline LTX-Video 2B proposé sur Brimkern est dérivé de LTX-Video, un modèle de Lightricks Ltd., et il est distribué sous la ')}
          <a href={LTXV_LICENSE} target="_blank" rel="noopener noreferrer" style={linkStyle}>{t('LTXV Open Weights License', 'licence LTXV Open Weights')}</a>
          {t('. Its files are downloaded to your browser from Hugging Face and run on your device.', '. Ses fichiers sont téléchargés par votre navigateur depuis Hugging Face et s’exécutent sur votre appareil.')}
        </P>
        <P>
          <strong style={{ color: 'var(--text-primary)' }}>
            {t('By loading or using LTX-Video on Brimkern, you agree to comply with the use restrictions below (section 4 and Attachment A of the license). They also apply to the clips you generate.', 'En chargeant ou en utilisant LTX-Video sur Brimkern, vous vous engagez à respecter les restrictions d’usage ci-dessous (section 4 et Annexe A de la licence). Elles s’appliquent aussi aux clips que vous générez.')}
          </strong>
        </P>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '22px 0 8px', color: 'var(--text-primary)' }}>
          {t('Use restrictions (Attachment A)', 'Restrictions d’usage (Annexe A)')}
        </h3>
        <P>{t('You agree not to use the Model or its Derivatives in any of the following ways:', 'Vous vous engagez à ne pas utiliser le Modèle ni ses Dérivés de l’une des manières suivantes :')}</P>
        <ul style={{ margin: '0 0 14px', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {RESTRICTIONS.map((r, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', flexShrink: 0 }}>{r.label}</span>
              <span>{t(r.text.en, r.text.fr)}</span>
            </li>
          ))}
        </ul>
        <P>
          {t('Commercial use: entities with annual revenues of USD 10 million or more must obtain a commercial license from Lightricks (', 'Usage commercial : une entité dont le chiffre d’affaires annuel atteint 10 millions de dollars US doit obtenir une licence commerciale auprès de Lightricks (')}
          <a href="mailto:ltxv-licensing@lightricks.com" style={linkStyle}>ltxv-licensing@lightricks.com</a>
          {t(') before any commercial use of the model (section 2 of the license).', ') avant tout usage commercial du modèle (section 2 de la licence).')}
        </P>
        <P>
          {t('You are responsible for the prompts you enter, for the clips you generate and for how you use them (section 5 of the license). The model is provided as is, without warranty (section 8 of the license).', 'Vous êtes responsable des prompts que vous saisissez, des clips que vous générez et de l’usage que vous en faites (section 5 de la licence). Le modèle est fourni en l’état, sans garantie (section 8 de la licence).')}
        </P>
      </Section>

      <Section id="language" title={t('Language', 'Langue')}>
        <P>
          {t('The use restrictions are quoted from the license, which is written in English. The French version of this page is a translation provided for convenience; if the two differ, the English text of the license prevails.', 'Les restrictions d’usage sont citées d’après la licence, rédigée en anglais. La version française de cette page est une traduction fournie pour votre commodité ; en cas de divergence, le texte anglais de la licence prévaut.')}
        </P>
      </Section>
    </DocsShell>
  );
}
