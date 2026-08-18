"use client";

// Vue d'ensemble de la documentation : le hub (toutes les portes du projet) + l'essentiel pour
// démarrer. Les sujets de fond vivent sur leurs propres pages — /docs/models, /docs/sdk,
// /docs/diagnostics — atteignables par le menu latéral (DocsShell) : retour Romain, les libellés
// du menu doivent emmener sur une page, pas sur une ancre.
//
// Bilingue par le même mécanisme que le reste (t('EN','FR')) et servie sur les DEUX URLs (/docs et
// /fr/docs) : une doc anglaise indexable est le point d'entrée des visiteurs venus de Hugging Face.

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Globe, Package, Info, Film, ArrowUpRight, Sparkles } from 'lucide-react';
import { useT, useHref } from '@/lib/i18n';
import GithubMark from '../GithubMark';
import DocsShell, { P, PageTitle, Section } from './DocsShell';

// Les sections parties vivre sur leur propre page. Des liens vers les anciennes ancres de la page
// unique (#brik, #sdk…) circulent depuis le 13/08 : on les honore en redirigeant vers la nouvelle
// adresse plutôt que de laisser un lien qui « ne fait rien ».
const ANCRES_DEPLACEES: Record<string, string> = {
  'any-model': '/docs/models#any-model',
  links: '/docs/models#links',
  brik: '/docs/models#brik',
  sdk: '/docs/sdk',
  diagnostics: '/docs/diagnostics',
  'vs-webllm': '/vs-webllm',
  changelog: '/changelog',
};

// Une destination du projet. Le hub existe pour ça : sans lui, « où est le convertisseur ? », « où
// est le SDK ? », « où sont les modèles publiés ? » n'avaient de réponse que dans une barre latérale
// (donc invisible depuis l'extérieur, et non indexable). `external` ouvre dans un onglet à part et
// affiche la flèche sortante.
function NavCard({ href, icon, title, desc, external }: { href: string; icon: React.ReactNode; title: string; desc: string; external?: boolean }) {
  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ color: 'var(--accent)', display: 'flex', flexShrink: 0 }}>{icon}</span>
        <span className="doc-card-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{title}</span>
        {external && <ArrowUpRight size={13} className="doc-card-out" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
      </div>
      <span style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--text-secondary)' }}>{desc}</span>
    </>
  );
  // `.doc-card` remplace `.welcome-card` + styles en ligne : un survol ne peut PAS s'écrire en
  // ligne, et l'ancienne classe ne colorait que le bord supérieur — invisible sur une carte à
  // bordure complète.
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="doc-card">{inner}</a>
    : <Link href={href} className="doc-card">{inner}</Link>;
}

export default function DocsClient() {
  const t = useT();
  const href = useHref();
  const router = useRouter();

  // Redirection des ancres déplacées — `replace` pour ne pas laisser l'entrée intermédiaire dans
  // l'historique (le bouton retour doit revenir d'où l'on venait, pas sur la redirection).
  useEffect(() => {
    const cible = ANCRES_DEPLACEES[window.location.hash.slice(1)];
    if (cible) router.replace(href(cible));
    // `href` change avec la locale mais l'ancre, elle, ne revient pas : un seul passage suffit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toc: { id: string; label: string }[] = [
    { id: 'start', label: t('Getting started', 'Démarrer') },
    { id: 'storage', label: t('Storage & offline', 'Stockage & hors-ligne') },
  ];

  return (
    <DocsShell toc={toc}>
      <PageTitle title={t('Documentation', 'Documentation')}>
        {t('Every part of the project, and how to use it: the chat, the embeddable SDK, the converter, the published models, the source. The side menu leads to each topic’s page.',
           "Toutes les briques du projet et comment s'en servir : le chat, le SDK embarquable, le convertisseur, les modèles publiés, le code source. Le menu latéral mène à la page de chaque sujet.")}
      </PageTitle>

      {/* ── LE HUB ─────────────────────────────────────────────────────────────────────────────
          Toutes les portes du projet au même endroit. C'est ce qui manquait : l'accueil mène au chat,
          et le reste (SDK, convertisseur, changelog, dépôts de modèles, code source) n'existait que
          dans une barre latérale — invisible pour qui arrive de l'extérieur, et non indexable. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(232px, 1fr))', gap: 12, margin: '22px 0 8px' }}>
        <NavCard
          href={href('/chat')}
          icon={<MessageSquare size={17} />}
          title={t('Open the chat', 'Ouvrir le chat')}
          desc={t('The app itself: load a model and talk to it, entirely on your GPU.', "L'application : chargez un modèle et discutez, entièrement sur votre GPU.")}
        />
        <NavCard
          href={href('/local-ai')}
          icon={<Globe size={17} />}
          title={t('Embeddable SDK', 'SDK embarquable')}
          desc={t('Put a local assistant on your own site with one script tag. Live demo included.', "Posez un assistant local sur votre site avec une balise script. Démo live incluse.")}
        />
        <NavCard
          href={href('/convert')}
          icon={<Package size={17} />}
          title={t('GGUF → .brik converter', 'Convertisseur GGUF → .brik')}
          desc={t('Repackage a model for streaming, in your browser. Nothing is uploaded.', "Ré-empaquetez un modèle pour le streaming, dans votre navigateur. Rien n'est envoyé.")}
        />
        <NavCard
          href={href('/changelog')}
          icon={<Info size={17} />}
          title="Changelog"
          desc={t('What changed, release by release, with the measurements behind each claim.', 'Ce qui a changé, version par version, avec les mesures derrière chaque affirmation.')}
        />
        <NavCard
          href="https://huggingface.co/romainkh14"
          external
          icon={<Sparkles size={17} />}
          title={t('Published models', 'Modèles publiés')}
          desc={t('Our pre-quantized .brik models on Hugging Face, ready to stream.', 'Nos modèles .brik pré-quantifiés sur Hugging Face, prêts à streamer.')}
        />
        <NavCard
          href="https://github.com/RomainKH/Brimkern"
          external
          icon={<GithubMark size={17} />}
          title={t('Source code', 'Code source')}
          desc={t('The whole engine under MIT: WGSL kernels, the .brik format, the loaders, the app.', "Tout le moteur sous licence MIT : kernels WGSL, format .brik, chargeurs, application.")}
        />
        <NavCard
          href="/video-test?gen=1"
          icon={<Film size={17} />}
          title={t('Video lab (beta)', 'Labo vidéo (bêta)')}
          desc={t('Generate a short clip. ~1.5 GB and several minutes of GPU — desktop only.', '~1,5 Go et plusieurs minutes de GPU pour un court clip — bureau uniquement.')}
        />
      </div>

      <Section id="start" title={t('Getting started', 'Démarrer')}>
        <P>
          {t('Open the app and click the single button on the home screen. The model streams in once (149 MB for the default), is cached on your device, and every later visit starts in seconds — offline included. Nothing is ever uploaded: the weights come down to your machine and the computation happens on your GPU.',
             "Ouvrez l'application et cliquez sur l'unique bouton de l'accueil. Le modèle arrive en streaming une fois (149 Mo pour celui par défaut), est mis en cache sur votre appareil, et chaque visite suivante démarre en quelques secondes — hors-ligne compris. Rien n'est jamais envoyé : les poids descendent chez vous et le calcul se fait sur votre GPU.")}
        </P>
        <P>
          <strong>{t('Requirements: ', 'Prérequis : ')}</strong>
          {t('a browser with WebGPU (Chrome, Edge, or Safari 18+). A discrete GPU helps for models above 1B parameters, but a laptop runs the small ones comfortably.',
             'un navigateur avec WebGPU (Chrome, Edge, ou Safari 18+). Un GPU dédié aide au-delà de 1 Md de paramètres, mais un portable fait tourner les petits modèles confortablement.')}
        </P>
        <P>
          {t('To go further: ', 'Pour aller plus loin : ')}
          <Link href={href('/docs/models')} style={{ color: 'var(--accent-text)' }}>{t('run any Hugging Face model', "charger n'importe quel modèle Hugging Face")}</Link>
          {t(', or ', ', ou ')}
          <Link href={href('/docs/sdk')} style={{ color: 'var(--accent-text)' }}>{t('put the assistant on your own site', 'poser l’assistant sur votre propre site')}</Link>.
        </P>
      </Section>

      <Section id="storage" title={t('Storage & offline', 'Stockage & hors-ligne')}>
        <P>
          {t('Model weights live in the browser cache, per site. The browser decides how much space it grants — often tens of gigabytes on a normal profile, but only ~1.5 GB in a private window, where a large model will not stay cached. The model browser warns you before a download that cannot fit.',
             "Les poids vivent dans le cache du navigateur, par site. C'est le navigateur qui décide de l'espace accordé — souvent des dizaines de gigaoctets sur un profil normal, mais ~1,5 Go seulement en navigation privée, où un gros modèle ne pourra pas rester en cache. Le navigateur de modèles vous avertit avant un téléchargement qui ne tiendra pas.")}
        </P>
        <P>
          {t('Models you have not used for 30 days are cleaned up automatically (adjustable, or off, in the Storage panel). Conversations and locally converted .brik files are never touched.',
             "Les modèles inutilisés depuis 30 jours sont nettoyés automatiquement (réglable, ou désactivable, dans le panneau Stockage). Les conversations et les .brik convertis en local ne sont jamais touchés.")}
        </P>
      </Section>
    </DocsShell>
  );
}
