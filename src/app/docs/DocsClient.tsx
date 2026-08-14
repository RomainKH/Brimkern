"use client";

// Documentation UNIQUE du produit : tout ce qui était éparpillé (comment charger un modèle, les liens
// de test instantané, le convertisseur BRIK, le SDK embarquable, les commutateurs de diagnostic) est
// rassemblé ici, avec un sommaire. Avant, ces sujets vivaient dans la barre latérale, dans des
// info-bulles, ou nulle part — et les liens de la barre latérale allaient devoir bouger de toute
// façon (retour Romain), donc autant leur donner une destination.
//
// Bilingue par le même mécanisme que le reste (t('EN','FR')) et servie sur les DEUX URLs (/docs et
// /fr/docs) : une doc anglaise indexable est le point d'entrée des visiteurs venus de Hugging Face.

import Link from 'next/link';
import { MessageSquare, Globe, Package, Info, Film, ArrowUpRight, Sparkles } from 'lucide-react';
import { useT, useLocale, useHref } from '@/lib/i18n';
import ByLine from '../ByLine';
import BackLink from '../BackLink';
import GithubMark from '../GithubMark';
import { SDK_URL, SITE_URL } from '@/lib/site';

// Un bloc de code copiable, sobre (pas de dépendance de coloration syntaxique pour trois lignes).
function Code({ children }: { children: string }) {
  return (
    <pre
      tabIndex={0}
      style={{
        margin: '8px 0 0', padding: '12px 14px', borderRadius: 10, overflowX: 'auto',
        background: 'var(--bg-code, var(--bg-sidebar))', border: '1px solid var(--border-color)',
        fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-primary)',
      }}
    >
      {children}
    </pre>
  );
}

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

// Paragraphe de doc. Défini au niveau MODULE (et non dans le composant) : une fonction composant
// recréée à chaque rendu force React à démonter puis remonter le sous-arbre.
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 10px' }}>{children}</p>;
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ scrollMarginTop: 20 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, margin: '38px 0 10px', color: 'var(--text-primary)' }}>{title}</h2>
      {children}
    </section>
  );
}

export default function DocsClient() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const href = useHref();

  const toc: { id: string; label: string }[] = [
    { id: 'start', label: t('Getting started', 'Démarrer') },
    { id: 'any-model', label: t('Run any Hugging Face model', "N'importe quel modèle Hugging Face") },
    { id: 'links', label: t('Instant test links', 'Liens de test instantané') },
    { id: 'brik', label: t('The .brik format & converter', 'Le format .brik & le convertisseur') },
    { id: 'sdk', label: t('Embeddable SDK', 'SDK embarquable') },
    { id: 'storage', label: t('Storage & offline', 'Stockage & hors-ligne') },
    { id: 'diagnostics', label: t('Diagnostics', 'Diagnostics') },
    { id: 'changelog', label: 'Changelog' },
  ];

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
<BackLink />
        <button
          onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
          aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
          style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 6, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
        >
          {locale === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, margin: '14px 0 10px', color: 'var(--text-primary)' }}>
        {t('Documentation', 'Documentation')}
      </h1>
      <P>
        {t('Every part of the project, and how to use it: the chat, the embeddable SDK, the converter, the published models, the source. Reference notes below.',
           "Toutes les briques du projet et comment s'en servir : le chat, le SDK embarquable, le convertisseur, les modèles publiés, le code source. Notes de référence en dessous.")}
      </P>

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

      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, margin: '34px 0 4px', color: 'var(--text-primary)' }}>
        {t('Reference', 'Référence')}
      </h2>
      {/* Sommaire de la partie référence. */}
      <nav aria-label={t('Table of contents', 'Sommaire')} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '18px 0 6px' }}>
        {toc.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, textDecoration: 'none', color: 'var(--text-secondary)', background: 'var(--bg-card-hover, rgba(127,127,127,0.1))', border: '1px solid var(--border-color)' }}
          >
            {s.label}
          </a>
        ))}
      </nav>

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
      </Section>

      <Section id="any-model" title={t('Run any Hugging Face model', "N'importe quel modèle Hugging Face")}>
        <P>
          {t('Brimkern reads single-file GGUF directly — the format the Hub already hosts, with no conversion or compilation step. Paste any of these into the field on the home screen (or in the model browser):',
             "Brimkern lit directement les GGUF mono-fichier — le format que le Hub héberge déjà, sans étape de conversion ni de compilation. Collez n'importe laquelle de ces formes dans le champ de l'accueil (ou du navigateur de modèles) :")}
        </P>
        <Code>{`Qwen/Qwen3-0.6B-GGUF
https://huggingface.co/Qwen/Qwen3-0.6B-GGUF
https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/blob/main/Qwen3-0.6B-Q8_0.gguf
https://example.com/my-model.gguf`}</Code>
        <P>
          {t('The best quantization is picked for you (Q4_K_M first, then Q4_K_S, Q5, Q8…), and the tokenizer follows the file — nothing to configure. Sharded GGUFs (-00001-of-0000N) and vision projectors (mmproj) are refused with an explicit message rather than half-loaded.',
             "La meilleure quantification est choisie pour vous (Q4_K_M d'abord, puis Q4_K_S, Q5, Q8…), et le tokenizer suit le fichier — rien à régler. Les GGUF shardés (-00001-of-0000N) et les projecteurs vision (mmproj) sont refusés avec un message explicite plutôt que chargés à moitié.")}
        </P>
      </Section>

      <Section id="links" title={t('Instant test links', 'Liens de test instantané')}>
        <P>
          {t('Any model can be turned into a link that loads it directly — handy to share a demo, to file a bug report, or to point a colleague at an exact quantization.',
             "N'importe quel modèle peut devenir un lien qui le charge directement — pratique pour partager une démo, joindre un rapport de bug, ou renvoyer un collègue vers une quantification précise.")}
        </P>
        <Code>{`${SITE_URL}/chat?model=Qwen/Qwen3-0.6B-GGUF
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
        <P>
          {t('You can convert a GGUF yourself, in the browser — the file never leaves your machine: ', "Vous pouvez convertir un GGUF vous-même, dans le navigateur — le fichier ne quitte jamais votre machine : ")}
          <Link href={href('/convert')} style={{ color: 'var(--accent)' }}>{t('open the converter', 'ouvrir le convertisseur')}</Link>.
        </P>
      </Section>

      <Section id="sdk" title={t('Embeddable SDK', 'SDK embarquable')}>
        <P>
          {t('One script tag puts a local assistant on your own site. It runs on your visitor’s GPU: no server, no per-token cost, nothing sent anywhere.',
             "Une balise script pose un assistant local sur votre site. Il tourne sur le GPU de votre visiteur : aucun serveur, aucun coût par token, rien n'est envoyé où que ce soit.")}
        </P>
        <Code>{`<script src="${SDK_URL}"></script>
<script>
  Brimkern.embed({
    system: "You are the assistant of the Ferblanc store.",
    title: "Ask us anything",
    // Vos contenus. Découpés en passages, puis seuls les 1 à 3 passages proches de la
    // question posée sont donnés au modèle. Le tri est LOCAL (lexical) : rien ne part.
    knowledge: [
      { title: "Opening hours", text: "Open Tuesday to Saturday, 10am to 7pm." },
      { title: "Shipping", text: "Free in France from 60 euros. Switzerland: flat 8 euros." },
    ],
  });
</script>`}</Code>
        <P>
          {t('The model only downloads when a visitor actually opens the widget, so your page speed is untouched. Knowledge documents stay on the page: they are chunked and ranked in the browser, and only the passages matching the question reach the model. ', "Le modèle ne se télécharge que lorsqu'un visiteur ouvre réellement le widget : votre vitesse de page reste intacte. Les documents de connaissance restent sur la page : ils sont découpés et classés dans le navigateur, et seuls les passages qui correspondent à la question atteignent le modèle. ")}
          <Link href={href('/local-ai')} style={{ color: 'var(--accent)' }}>{t('Full SDK page and live demo', 'Page SDK complète et démo live')}</Link>.
        </P>
        <P>
          {t('It is also a package — types included, and importing it on a server does nothing (Next, Remix, Astro are safe):', 'C’est aussi un paquet — types inclus, et l’importer côté serveur ne fait rien (Next, Remix, Astro passent sans risque) :')}
        </P>
        <Code>{`npm i brimkern

import { embed, createSession } from 'brimkern';`}</Code>
        <P>
          {t('Pin a version if you would rather the widget did not change under your feet: ', 'Épinglez une version si vous préférez que le widget ne change pas sous vos pieds : ')}
          <code>{`${SITE_URL}/sdk-0.1.0.js`}</code>{t(' instead of ', ' au lieu de ')}<code>{`${SITE_URL}/sdk.js`}</code>.
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

      <Section id="diagnostics" title={t('Diagnostics', 'Diagnostics')}>
        <P>
          {t('Every risky code path has a URL switch that falls back to the slower, simpler one. Handy to check whether an optimization is responsible for something odd — the answer should be identical, only slower.',
             "Chaque chemin de code risqué a un commutateur d'URL qui revient à la version plus lente et plus simple. Pratique pour vérifier si une optimisation est responsable d'un comportement bizarre — la réponse doit être identique, seulement plus lente.")}
        </P>
        <Code>{`?gemv=0        ${t('decode matmul → row kernels', 'matmul de décodage → kernels par lignes')}
?f16shared=0   ${t('f16 prefill GEMM → one row per thread', 'GEMM f16 du prefill → une ligne par thread')}
?qshared=0     ${t('q4/q8 prefill GEMM → 4 rows per invocation', 'GEMM q4/q8 du prefill → 4 lignes par invocation')}
?warmup=0      ${t('no weight warm-up (first message pays it)', 'pas de préchauffe (le 1er message la paye)')}
?ggufstream=0  ${t('GGUF as one download instead of ranges', 'GGUF en un seul téléchargement au lieu de plages')}
?kvq=0         ${t('KV cache in f32 instead of int8', 'cache KV en f32 au lieu de int8')}
?timing=1      ${t('per-stage timing of the forward pass, in the console', 'chronométrage du forward par étape, dans la console')}`}</Code>
      </Section>

      <Section id="changelog" title="Changelog">
        <P>
          {t('What changed, release by release, with the measurements behind each claim: ', 'Ce qui a changé, version par version, avec les mesures derrière chaque affirmation : ')}
          <Link href={href('/changelog')} style={{ color: 'var(--accent)' }}>{t('read the changelog', 'lire le changelog')}</Link>.
        </P>
      </Section>

      <ByLine />
    </main>
  );
}
