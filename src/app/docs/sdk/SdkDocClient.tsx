"use client";

// Référence API du paquet npm `brimkern` — la page qui manquait au moment de publier sur npm :
// le README du paquet montre le démarrage, cette page fait foi pour CHAQUE option. Elle est écrite
// depuis les .d.ts publiés (packages/sdk/dist/types) : si un paramètre n'y est pas, il n'existe pas.
// Même coquille que /docs (menu latéral partagé), même mécanisme bilingue.

import Link from 'next/link';
import { useT, useHref } from '@/lib/i18n';
import DocsShell, { Code, P, Section } from '../DocsShell';
import { SDK_URL, SITE_URL } from '@/lib/site';

// Une ligne de référence : nom mono à gauche, type discret, description. Un tableau HTML serait
// plus rigide à l'écran étroit ; cette liste reste lisible à toutes les largeurs.
function Param({ name, type, children }: { name: string; type: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '9px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</code>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-muted)' }}>{type}</span>
      </div>
      <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{children}</span>
    </div>
  );
}

export default function SdkDocClient() {
  const t = useT();
  const href = useHref();

  const toc: { id: string; label: string }[] = [
    { id: 'install', label: t('Install', 'Installation') },
    { id: 'embed', label: 'embed()' },
    { id: 'sessions', label: 'createSession()' },
    { id: 'generate', label: 'generate()' },
    { id: 'knowledge', label: t('Knowledge documents', 'Documents de connaissance') },
    { id: 'preload', label: 'preload() & status()' },
    { id: 'pinning', label: t('Versions & CDNs', 'Versions & CDN') },
    { id: 'server', label: t('Servers, licence, links', 'Serveur, licence, liens') },
  ];

  return (
    <DocsShell toc={toc}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, margin: '14px 0 10px', color: 'var(--text-primary)' }}>
        {t('SDK & npm package', 'SDK & paquet npm')}
      </h1>
      <P>
        {t('The complete API of the brimkern package: a chat widget in one call, or headless sessions and one-shot generation for your own UI. Everything runs on the visitor’s GPU — no server, no API key, nothing leaves the browser. For the guided tour and live demo, see ',
           "L'API complète du paquet brimkern : un widget de chat en un appel, ou des sessions sans interface et de la génération one-shot pour votre propre UI. Tout tourne sur le GPU du visiteur — aucun serveur, aucune clé d'API, rien ne quitte le navigateur. Pour la visite guidée et la démo live, voir ")}
        <Link href={href('/local-ai')} style={{ color: 'var(--accent-text)' }}>{t('the SDK page', 'la page SDK')}</Link>.
      </P>

      <Section id="install" title={t('Install', 'Installation')}>
        <P>{t('From npm — TypeScript types included:', 'Depuis npm — types TypeScript inclus :')}</P>
        <Code>{`npm i brimkern

import { embed, createSession, generate, preload, status } from 'brimkern';`}</Code>
        <P>
          {t('Or as a script tag, with no build step — the IIFE exposes the same API on a global:',
             'Ou en balise script, sans étape de build — l’IIFE expose la même API sur une globale :')}
        </P>
        <Code>{`<script src="${SDK_URL}"></script>
<script>
  Brimkern.embed({ title: "Ask us anything" });
</script>`}</Code>
      </Section>

      <Section id="embed" title="embed(config?)">
        <P>
          {t('Mounts the chat widget in the page (it waits for the document if called early). The model downloads only when a visitor actually opens the widget: your page speed is untouched.',
             "Monte le widget de chat dans la page (il attend le document si l'appel arrive tôt). Le modèle ne se télécharge que lorsqu'un visiteur ouvre réellement le widget : votre vitesse de page reste intacte.")}
        </P>
        <Param name="system" type="string">
          {t('The assistant’s instructions — who it is, what it may say.', "Les instructions de l'assistant — qui il est, ce qu'il peut dire.")}
        </Param>
        <Param name="title" type="string">{t('Widget header text.', 'Titre affiché en tête du widget.')}</Param>
        <Param name="greeting" type="string">{t('First message shown before the visitor types.', 'Premier message affiché avant que le visiteur n’écrive.')}</Param>
        <Param name="accent" type="string">{t('Accent color (any CSS color).', "Couleur d'accent (toute couleur CSS).")}</Param>
        <Param name="model" type="string">
          {t('Model override — a Hugging Face repo or a direct .gguf/.brik URL. Defaults to the built-in small model (149 MB).',
             'Modèle à la place du défaut — un dépôt Hugging Face ou une URL directe .gguf/.brik. Défaut : le petit modèle intégré (149 Mo).')}
        </Param>
        <Param name="maxTokens" type="number">{t('Reply budget, in tokens.', 'Budget de réponse, en tokens.')}</Param>
        <Param name="examples" type="{ user, assistant }[]">
          {t('Few-shot examples prepended to the conversation.', 'Exemples few-shot ajoutés en tête de conversation.')}
        </Param>
        <Param name="knowledge / knowledgeBudget" type="see below">
          {t('Your content, ranked locally — see the dedicated section.', 'Vos contenus, triés en local — voir la section dédiée.')}
        </Param>
        <Param name="worker / workerUrl" type="boolean / string">
          {t('Run inference in a Web Worker (keeps your page’s main thread free). workerUrl serves the worker from your own origin if needed.',
             'Exécute l’inférence dans un Web Worker (le thread principal de votre page reste libre). workerUrl sert le worker depuis votre propre origine si besoin.')}
        </Param>
      </Section>

      <Section id="sessions" title="createSession(config?)">
        <P>
          {t('Headless: a conversation object for your own interface. Same config as embed() minus the visual options, plus temperature.',
             'Sans interface : un objet conversation pour votre propre UI. Même config que embed() moins les options visuelles, plus temperature.')}
        </P>
        <Code>{`const session = createSession({ system: "You are a sommelier.", temperature: 0.7 });

const reply = await session.ask("A wine for oysters?", {
  onToken: (text) => output.textContent += text,  // streaming
  signal: controller.signal,                       // cancellable
});

session.history  // the Msg[] so far
session.reset()  // same config, blank history
session.destroy()`}</Code>
      </Section>

      <Section id="generate" title="generate(options)">
        <P>
          {t('One shot: a prompt, a reply, no history kept. Takes the session config plus prompt, onToken and signal.',
             'One-shot : un prompt, une réponse, pas d’historique conservé. Prend la config de session plus prompt, onToken et signal.')}
        </P>
        <Code>{`const answer = await generate({
  system: "Answer in one sentence.",
  prompt: "Why is the sky blue?",
  onToken: (text) => process(text),
});`}</Code>
      </Section>

      <Section id="knowledge" title={t('Knowledge documents', 'Documents de connaissance')}>
        <P>
          {t('Give the assistant your content — pages, FAQs, product sheets. Documents are chunked into passages in the browser, and only the 1–3 passages closest to the visitor’s question are given to the model. The ranking is local (lexical): nothing is sent anywhere.',
             "Donnez vos contenus à l'assistant — pages, FAQ, fiches produit. Les documents sont découpés en passages dans le navigateur, et seuls les 1 à 3 passages les plus proches de la question du visiteur sont donnés au modèle. Le tri est local (lexical) : rien n'est envoyé où que ce soit.")}
        </P>
        <Code>{`knowledge: [
  "Plain strings work.",
  { title: "Shipping", text: "Free in France from 60 euros." },
],
knowledgeBudget: 800  // ${t('max tokens of passages per question', 'tokens de passages max par question')}`}</Code>
      </Section>

      <Section id="preload" title="preload() & status()">
        <P>
          {t('preload() downloads the engine and the model ahead of the first question — call it on a hover, or on the pricing page before support opens. onProgress receives the phase and, during download, the bytes: enough for a real progress bar.',
             "preload() télécharge le moteur et le modèle avant la première question — appelez-le sur un survol, ou sur la page tarifs avant l'ouverture du support. onProgress reçoit la phase et, pendant le téléchargement, les octets : de quoi afficher une vraie barre de progression.")}
        </P>
        <Code>{`await preload({
  onProgress: (status, p) => {
    if (p) bar.style.width = (100 * p.loaded / p.total) + "%";
  },
});

status()  // 'unavailable' (${t('no WebGPU', 'pas de WebGPU')}) | 'idle' | 'loading' | 'ready' | 'error'`}</Code>
        <P>
          {t('status() answers synchronously — use it to decide whether to show the widget at all on browsers without WebGPU.',
             "status() répond de façon synchrone — utile pour décider d'afficher ou non le widget sur les navigateurs sans WebGPU.")}
        </P>
      </Section>

      <Section id="pinning" title={t('Versions & CDNs', 'Versions & CDN')}>
        <P>
          {t('Pin a version if you would rather the widget did not change under your feet:',
             'Épinglez une version si vous préférez que le widget ne change pas sous vos pieds :')}
        </P>
        <Code>{`${SITE_URL}/sdk-0.1.0.js   ${t('instead of', 'au lieu de')}   ${SITE_URL}/sdk.js

<!-- ${t('or from the npm CDNs', 'ou depuis les CDN npm')} -->
https://unpkg.com/brimkern@0.1.0/dist/brimkern.iife.js
https://cdn.jsdelivr.net/npm/brimkern@0.1.0/dist/brimkern.iife.js`}</Code>
      </Section>

      <Section id="server" title={t('Servers, licence, links', 'Serveur, licence, liens')}>
        <P>
          {t('Importing the package on a server does nothing until a browser runs it: Next.js, Remix and Astro pass without guards. MIT licence, like the whole engine.',
             "Importer le paquet côté serveur ne fait rien tant qu'un navigateur ne l'exécute pas : Next.js, Remix et Astro passent sans garde-fou. Licence MIT, comme tout le moteur.")}
        </P>
        <P>
          <a href="https://www.npmjs.com/package/brimkern" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-text)' }}>npmjs.com/package/brimkern</a>
          {' · '}
          <a href="https://github.com/RomainKH/Brimkern" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-text)' }}>GitHub</a>
          {' · '}
          <Link href={href('/local-ai')} style={{ color: 'var(--accent-text)' }}>{t('SDK page & live demo', 'Page SDK & démo live')}</Link>
        </P>
      </Section>
    </DocsShell>
  );
}
