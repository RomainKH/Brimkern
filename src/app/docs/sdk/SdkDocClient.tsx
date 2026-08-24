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
    { id: 'appearance', label: t('Appearance & labels', 'Apparence & libellés') },
    { id: 'control', label: t('Controlling the widget', 'Piloter le widget') },
    { id: 'events', label: t('Events', 'Événements') },
    { id: 'sessions', label: 'createSession()' },
    { id: 'generate', label: 'generate()' },
    { id: 'knowledge', label: t('Knowledge documents', 'Documents de connaissance') },
    { id: 'tools', label: t('Tools', 'Outils') },
    { id: 'sources', label: t('Sources of an answer', "Sources d'une réponse") },
    { id: 'preload', label: 'preload(), status() & runtime()' },
    { id: 'engine', label: t('One engine per page', 'Un seul moteur par page') },
    { id: 'pinning', label: t('Versions & CDNs', 'Versions & CDN') },
    { id: 'server', label: t('Servers, licence, links', 'Serveur, licence, liens') },
  ];

  return (
    <DocsShell toc={toc}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, margin: '14px 0 10px', color: 'var(--text-primary)' }}>
        {t('SDK & npm package', 'SDK & paquet npm')}
      </h1>
      <P>
        {t('The complete API of the brimkern package: a chat widget in one call, or headless sessions and one-shot generation for your own UI. Everything runs on the visitor’s GPU: no server, no API key, nothing leaves the browser. For the guided tour and live demo, see ',
           "L'API complète du paquet brimkern : un widget de chat en un appel, ou des sessions sans interface et de la génération one-shot pour votre propre UI. Tout tourne sur le GPU du visiteur : aucun serveur, aucune clé d'API, rien ne quitte le navigateur. Pour la visite guidée et la démo live, voir ")}
        <Link href={href('/local-ai')} style={{ color: 'var(--accent-text)' }}>{t('the SDK page', 'la page SDK')}</Link>.
      </P>

      <Section id="install" title={t('Install', 'Installation')}>
        <P>{t('From npm. TypeScript types included:', 'Depuis npm. Types TypeScript inclus :')}</P>
        <Code lang="sh">{'npm i brimkern'}</Code>
        <Code lang="js">{`import { embed, createSession, generate, preload, status, runtime } from 'brimkern';

// ${t('types, for TypeScript', 'les types, pour TypeScript')}
import type {
  EmbedConfig, SessionConfig, AskOptions,
  BrimkernWidget, BrimkernSession, BrimkernEvents, BrimkernEvent,
  Msg, Source, LoadProgress, ToolSpec, WidgetLabels,
} from 'brimkern';`}</Code>
        <P>
          {t('Or as a script tag, with no build step. The IIFE exposes the same API on a global:',
             'Ou en balise script, sans étape de build. L’IIFE expose la même API sur une globale :')}
        </P>
        <Code lang="html">{`<script src="${SDK_URL}"></script>
<script>
  Brimkern.embed({ title: "Ask us anything" });
</script>`}</Code>
      </Section>

      <Section id="embed" title="embed(config?)">
        <P>
          {t('Mounts the chat widget in the page (it waits for the document if called early) and returns a BrimkernWidget handle — see Controlling the widget below. The model downloads only when a visitor actually opens the widget: your page speed is untouched.',
             "Monte le widget de chat dans la page (il attend le document si l'appel arrive tôt) et rend une poignée BrimkernWidget — voir Piloter le widget, plus bas. Le modèle ne se télécharge que lorsqu'un visiteur ouvre réellement le widget : votre vitesse de page reste intacte.")}
        </P>
        <Param name="system" type="string">
          {t('The assistant’s instructions: who it is, what it may say.', "Les instructions de l'assistant : qui il est, ce qu'il peut dire.")}
        </Param>
        <Param name="title" type="string">{t('Widget header text.', 'Titre affiché en tête du widget.')}</Param>
        <Param name="greeting" type="string">{t('First message shown before the visitor types.', 'Premier message affiché avant que le visiteur n’écrive.')}</Param>
        <Param name="accent" type="string">{t('Accent color (any CSS color).', "Couleur d'accent (toute couleur CSS).")}</Param>
        <Param name="model" type="string">
          {t('Model override: a Hugging Face repo or a direct .gguf/.brik URL. Defaults to the built-in small model (149 MB).',
             'Modèle à la place du défaut : un dépôt Hugging Face ou une URL directe .gguf/.brik. Défaut : le petit modèle intégré (149 Mo).')}
        </Param>
        <Param name="maxTokens" type="number">{t('Reply budget, in tokens.', 'Budget de réponse, en tokens.')}</Param>
        <Param name="lang" type="'en' | 'fr'">
          {t('Language of the widget labels (placeholder, status bubbles, errors) and of the instructions given to the model. Guessed from your system prompt when left out — declare it if your prompt is unusual.',
             "Langue des libellés du widget (placeholder, bulles de statut, erreurs) et des consignes données au modèle. Devinée depuis votre prompt système si absente — à déclarer si votre prompt est atypique.")}
        </Param>
        <Param name="examples" type="{ user, assistant }[]">
          {t('Few-shot examples prepended to the conversation.', 'Exemples few-shot ajoutés en tête de conversation.')}
        </Param>
        <Param name="knowledge / knowledgeBudget" type="see below">
          {t('Your content, ranked locally: see the dedicated section.', 'Vos contenus, triés en local : voir la section dédiée.')}
        </Param>
        <Param name="worker / workerUrl" type="boolean / string">
          {t('Run inference in a Web Worker (keeps your page’s main thread free). workerUrl serves the worker from your own origin if needed.',
             'Exécute l’inférence dans un Web Worker (le thread principal de votre page reste libre). workerUrl sert le worker depuis votre propre origine si besoin.')}
        </Param>
        <Param name="history" type="Msg[]">
          {t('Starting conversation, so a visitor finds their thread again after a reload: store widget.history, hand it back here. When it is not empty, greeting is ignored.',
             "Conversation de départ, pour qu'un visiteur retrouve son fil après un rechargement : rangez widget.history, redonnez-le ici. Quand elle n'est pas vide, greeting est ignoré.")}
        </Param>
        <Param name="showSources" type="boolean">
          {t('Show, under each answer, the knowledge cards it came from. Off by default.',
             'Affiche, sous chaque réponse, les fiches de connaissance qui l’ont produite. Faux par défaut.')}
        </Param>
        <Param name="tools" type="('calc' | 'date' | ToolSpec)[]">
          {t('Local tools whose results are handed to the model as facts: see the dedicated section.',
             'Outils locaux dont les résultats sont donnés au modèle comme des faits : voir la section dédiée.')}
        </Param>
        <Param name="theme / position / width / height / labels" type="see below">
          {t('The widget’s look and wording: see Appearance & labels.',
             'L’aspect et les libellés du widget : voir Apparence & libellés.')}
        </Param>
      </Section>

      <Section id="appearance" title={t('Appearance & labels', 'Apparence & libellés')}>
        <P>
          {t('The widget follows your page instead of imposing its own look. Everything here is set per widget: two widgets on the same page can differ in theme, corner and colour.',
             "Le widget suit votre page au lieu d'imposer son aspect. Tout se règle PAR widget : deux widgets d'une même page peuvent différer de thème, de coin et de couleur.")}
        </P>
        <Code lang="js">{`embed({
  theme: 'auto',             // 'light' (${t('default', 'défaut')}) | 'dark' | 'auto' — ${t('auto follows prefers-color-scheme, live', 'auto suit prefers-color-scheme, en direct')}
  position: 'bottom-left',   // 'bottom-right' (${t('default', 'défaut')}) | 'bottom-left'
  width: 400, height: 600,   // ${t('px, clamped to 300-480 × 380-720; small screens still cap to the viewport', 'px, bornés à 300-480 × 380-720 ; les petits écrans plafonnent toujours au viewport')}
  labels: {                  // ${t('any language, any tone — keys you omit keep the lang defaults', "n'importe quelle langue, n'importe quel ton — les clés absentes gardent les défauts de lang")}
    open: 'Chat öffnen',
    placeholder: 'Nachricht eingeben…',
    note: 'Lokale KI — läuft auf Ihrer GPU.',
    phases: { download: 'Modell wird geladen…' },
  },
});`}</Code>
        <P>
          {t('lang covers English and French out of the box; labels is the door to every other language (open, close, placeholder, note, error, empty, help, sources, mb, phases). Labels are rendered as text, never as markup, and theme takes a keyword, not CSS: nothing an integrator passes here can inject styles or markup into the host page.',
             "lang couvre l'anglais et le français d'origine ; labels est la porte vers toutes les autres langues (open, close, placeholder, note, error, empty, help, sources, mb, phases). Les libellés sont rendus comme du texte, jamais comme du balisage, et theme prend un mot-clé, pas du CSS : rien de ce qu'un intégrateur passe ici ne peut injecter du style ou du balisage dans la page hôte.")}
        </P>
      </Section>

      <Section id="control" title={t('Controlling the widget', 'Piloter le widget')}>
        <P>
          {t('embed() returns a handle. It is what lets you unmount the widget — which matters in any app with client-side routing, where the widget would otherwise survive every route change and a second embed() would stack a second launcher on the page.',
             "embed() rend une poignée. C'est elle qui permet de DÉMONTER le widget — ce qui compte dans toute application à navigation côté client, où sinon le widget survit à chaque changement de route et un second embed() empile un second bouton sur la page.")}
        </P>
        <Code lang="js">{`const widget = embed({ title: "Support" });

widget.open(); widget.close(); widget.toggle();
await widget.ask("Do you ship to Canada?");  // ${t('as if the visitor had typed it', "comme si le visiteur l'avait tapée")}
widget.setKnowledge(newDocs);                // ${t('swap the cards, keep the conversation', 'change les fiches, garde la conversation')}
widget.setHistory(saved);                    // ${t('resume a conversation', 'reprend une conversation')}
widget.history                               // Msg[]
widget.el                                    // ${t('the panel, for a style tweak', 'le panneau, pour un ajustement de style')}
widget.destroy();                            // ${t('removes the DOM, cancels any generation in flight', 'retire le DOM, annule une génération en cours')}`}</Code>
        <P>
          {t('destroy() leaves the engine loaded: the weights are shared by the page, so unmounting a widget never makes the next one download the model again. In React, the handle is exactly what an effect’s cleanup needs:',
             "destroy() laisse le moteur chargé : les poids sont partagés par la page, démonter un widget ne fait donc jamais retélécharger le modèle au suivant. En React, la poignée est exactement ce qu'attend le nettoyage d'un effet :")}
        </P>
        <Code lang="js">{`useEffect(() => {
  const widget = embed({ system: "You are our support agent." });
  return () => widget.destroy();
}, []);`}</Code>
        <P>
          {t('Calling embed() on the server is harmless: you get an inert handle instead of a crash, so the same code can run on both sides.',
             "Appeler embed() côté serveur est inoffensif : vous recevez une poignée inerte au lieu d'une erreur, le même code peut donc tourner des deux côtés.")}
        </P>
      </Section>

      <Section id="events" title={t('Events', 'Événements')}>
        <P>
          {t('Both the widget handle and a session expose on(event, callback), which returns its own unsubscribe function. This is how you log conversations, measure engagement, and — most useful of all — learn that a visitor’s browser has no WebGPU, instead of that failure staying inside a chat bubble.',
             "La poignée du widget comme une session exposent on(event, callback), qui rend sa propre fonction de désabonnement. C'est par là que vous journalisez les conversations, mesurez l'engagement et — le plus utile — apprenez qu'un navigateur de visiteur n'a pas WebGPU, au lieu de laisser cet échec dans une bulle de chat.")}
        </P>
        <Code lang="js">{`const off = widget.on('message', ({ role, content, sources }) => {
  analytics.track('chat', { role, content });
});
off();  // ${t('unsubscribe', 'désabonnement')}

widget.on('progress', (phase, p) => bar.value = p ? p.loaded / p.total : 0);
widget.on('ready',    () => console.log('${t('model loaded', 'modèle chargé')}'));
widget.on('open',     () => {});
widget.on('close',    () => {});
widget.on('error',    (err) => report(err));   // ${t('e.g. no WebGPU on this browser', 'ex. pas de WebGPU sur ce navigateur')}
widget.on('tool',     ({ name, result }) => {});  // ${t('a tool produced a result for this turn', 'un outil a produit un résultat pour ce tour')}`}</Code>
        <P>
          {t('phase is a stable key — init, download, tokenizer, gpu — never a sentence: you label it in your page’s own language. A listener that throws is caught and logged: your analytics can never break the widget. Sessions get ready, progress, message, error and tool (open and close are widget-only), and a session emits progress because ask() now preloads before its first turn: that first call used to download 149 MB with no way to say so.',
             "phase est une clé stable — init, download, tokenizer, gpu — jamais une phrase : c'est à vous de la libeller dans la langue de votre page. Un écouteur qui lève est intercepté et journalisé : votre analytics ne peut pas casser le widget. Les sessions reçoivent ready, progress, message, error et tool (open et close n'existent que côté widget), et une session émet progress parce que ask() précharge avant son premier tour : ce premier appel téléchargeait 149 Mo sans aucun moyen de le dire.")}
        </P>
        <P>
          {t('The one failure a visitor can trigger without doing anything wrong carries a cause code: err.code === "no-webgpu" means this browser cannot run the assistant at all. Treat it as the signal to hide the widget rather than as a bug — status() answers the same question before anything is mounted. Errors on the message path are emitted AND thrown, so ask() keeps its own catch.',
             "Le seul échec qu'un visiteur peut déclencher sans rien faire de mal porte un code de cause : err.code === « no-webgpu » signifie que ce navigateur ne peut pas exécuter l'assistant du tout. C'est le signal pour masquer le widget, pas un bug à corriger — status() répond à la même question avant tout montage. Les erreurs du chemin de génération sont émises ET levées : le catch de votre ask() reste valable.")}
        </P>
      </Section>

      <Section id="sessions" title="createSession(config?)">
        <P>
          {t('Headless: a conversation object for your own interface. Same config as embed() minus the visual options — including history to start from a stored conversation — plus temperature.',
             'Sans interface : un objet conversation pour votre propre UI. Même config que embed() moins les options visuelles — history compris, pour démarrer sur une conversation rangée — plus temperature.')}
        </P>
        <Code lang="js">{`const session = createSession({ system: "You are a sommelier.", temperature: 0.7 });

const reply = await session.ask("A wine for oysters?", {
  onToken: (text) => output.textContent += text,  // streaming
  signal: controller.signal,                       // cancellable
});

session.history       // the Msg[] so far
session.lastSources   // ${t('the cards behind the last answer', 'les fiches derrière la dernière réponse')}
session.setHistory(saved)      // ${t('resume a conversation', 'reprend une conversation')}
session.setKnowledge(newDocs)  // ${t('swap the cards, keep the conversation', 'change les fiches, garde la conversation')}
session.on('message', log)     // ${t('same events as the widget', 'mêmes événements que le widget')}
session.reset()  // same config, blank history
session.destroy()`}</Code>
        <P>
          {t('setHistory() and setKnowledge() throw if a generation is running: finish or cancel the turn first. Both keep the engine and the weights untouched — swapping a catalogue does not cost a download, and no longer costs the conversation either. ask() also throws if a turn is already running on that session: one conversation, one turn at a time.',
             "setHistory() et setKnowledge() lèvent pendant une génération : terminez ou annulez le tour d'abord. Les deux laissent le moteur et les poids intacts — changer de catalogue ne coûte pas un téléchargement, et ne coûte plus la conversation non plus. ask() lève également si un tour est déjà en cours sur cette session : une conversation, un tour à la fois.")}
        </P>
        <P>
          {t('temperature defaults to 0.25 when you pass knowledge, and 0.55 otherwise — the same rule as the widget, and a measured one: at 0.55, reading one row out of a table went to the wrong column once in three. An assistant copying a figure out of a note has nothing to gain from sampling wide. Declaring temperature yourself still wins.',
             "temperature vaut 0,25 par défaut quand vous passez knowledge, et 0,55 sinon — la même règle que le widget, et elle est mesurée : à 0,55, la lecture d'une ligne de tableau partait une fois sur trois sur la mauvaise colonne. Un assistant qui recopie un chiffre d'une fiche n'a rien à gagner à échantillonner large. Une temperature que vous déclarez continue de primer.")}
        </P>
      </Section>

      <Section id="generate" title="generate(options)">
        <P>
          {t('One shot: a prompt, a reply, no history kept. Takes the session config plus prompt, onToken, signal and onSources. It takes ONE object: called as generate("question", {…}) it throws a TypeError instead of quietly answering the string "undefined".',
             'One-shot : un prompt, une réponse, pas d’historique conservé. Prend la config de session plus prompt, onToken, signal et onSources. Il prend UN objet : appelé comme generate("question", {…}) il lève une TypeError au lieu de répondre en silence à la chaîne « undefined ».')}
        </P>
        <Code lang="js">{`const answer = await generate({
  system: "Answer in one sentence.",
  prompt: "Why is the sky blue?",
  onToken: (text) => process(text),
});`}</Code>
      </Section>

      <Section id="knowledge" title={t('Knowledge documents', 'Documents de connaissance')}>
        <P>
          {t('Give the assistant your content: pages, FAQs, product sheets. Documents are chunked into passages in the browser, and only the 1–3 passages closest to the visitor’s question are given to the model. The ranking is local (lexical): nothing is sent anywhere.',
             "Donnez vos contenus à l'assistant : pages, FAQ, fiches produit. Les documents sont découpés en passages dans le navigateur, et seuls les 1 à 3 passages les plus proches de la question du visiteur sont donnés au modèle. Le tri est local (lexical) : rien n'est envoyé où que ce soit.")}
        </P>
        <Code lang="js">{`knowledge: [
  "Plain strings work.",
  { title: "Shipping", text: "Free in France from 60 euros." },
],
knowledgeBudget: 800  // ${t('max tokens of passages per question', 'tokens de passages max par question')}`}</Code>
      </Section>

      <Section id="tools" title={t('Tools', 'Outils')}>
        <P>
          {t('Give the assistant abilities beyond its notes: arithmetic, today’s date, or your own functions — a stock lookup, an order status, a cart total. The design is deliberate: the model NEVER decides to call a tool (below ~3B parameters, emitted tool calls are hallucinated — measured). Instead, detection is deterministic, your function runs in your page, and the model receives the result as a fact, exactly like a knowledge passage.',
             "Donnez à l'assistant des capacités au-delà de ses fiches : l'arithmétique, la date du jour, ou vos propres fonctions — un stock, l'état d'une commande, le total d'un panier. Le choix de conception est délibéré : le modèle ne décide JAMAIS d'appeler un outil (sous ~3B de paramètres, les appels d'outils émis sont hallucinés — mesuré). La détection est déterministe, votre fonction tourne dans votre page, et le modèle reçoit le résultat comme un fait, exactement comme un passage de connaissance.")}
        </P>
        <Code lang="js">{`embed({
  tools: [
    'calc',   // ${t('detects arithmetic in the message and injects the exact result', 'détecte l’arithmétique du message et injecte le résultat exact')}
    'date',   // ${t('the model knows today’s date (stable line in the system prompt)', 'le modèle connaît la date du jour (ligne stable du prompt système)')}
    {
      name: 'stock',
      match: /stock|disponible/i,          // ${t('or a predicate: (question) => boolean', 'ou un prédicat : (question) => boolean')}
      run: async (question) => {           // ${t('runs in YOUR page — sync or async', 'tourne dans VOTRE page — sync ou async')}
        const n = await api.stockFor(question);
        return \`\${n} ${t('in stock', 'en stock')}\`;
      },
    },
  ],
});

widget.on('tool', ({ name, result }) => trace(name, result));  // ${t('before generation, like onSources', 'avant la génération, comme onSources')}`}</Code>
        <P>
          {t('The contract protects the visitor: a tool that throws, hangs (10 s cap) or returns nothing is simply absent from the turn — the turn itself never fails because of a tool. Results are capped at 600 characters: a result is a fact, not a report, and the default model has a short window. Nothing here touches the network unless YOUR run function does.',
             "Le contrat protège le visiteur : un outil qui lève, qui traîne (plafond 10 s) ou qui ne rend rien est simplement absent du tour — le tour, lui, n'échoue jamais à cause d'un outil. Les résultats sont bornés à 600 caractères : un résultat est un fait, pas un rapport, et le modèle par défaut a une fenêtre courte. Rien ici ne touche le réseau, sauf si VOTRE fonction run le fait.")}
        </P>
      </Section>

      <Section id="sources" title={t('Sources of an answer', "Sources d'une réponse")}>
        <P>
          {t('You can see which passages fed an answer. Two reasons this matters: a small model does get things wrong, and an answer a visitor can check is worth more than one merely asserted — and when yours answers oddly, this is how you tell a bad passage from a bad reading of a good one.',
             "Vous pouvez savoir quels passages ont nourri une réponse. Deux raisons : un petit modèle se trompe, et une réponse que le visiteur peut vérifier vaut mieux qu'une réponse simplement affirmée — et quand le vôtre répond de travers, c'est ainsi que vous distinguez un mauvais passage d'une mauvaise lecture du bon.")}
        </P>
        <Code lang="js">{`await session.ask(question, {
  onSources: (sources) => show(sources),  // ${t('before generation: the ranking is local and instant', 'avant la génération : le tri est local et instantané')}
});
session.lastSources  // [{ title, text, score, doc }]

embed({ knowledge: docs, showSources: true });          // ${t('in the widget, under each answer', 'dans le widget, sous chaque réponse')}
widget.on('message', ({ sources }) => trace(sources));  // ${t('or without displaying anything', 'ou sans rien afficher')}`}</Code>
        <P>
          {t('score is the lexical proximity to the question, doc the index of the document in your knowledge array, and the order is the order the passages were given to the model. An empty array is meaningful: no passage matched.',
             "score est la proximité lexicale avec la question, doc l'index du document dans votre tableau knowledge, et l'ordre est celui dans lequel les passages ont été donnés au modèle. Un tableau vide a un sens : aucun passage ne correspondait.")}
        </P>
        <P>
          {t('And what happens then depends on the message, because two situations must not be confused. A question asking for information gets the honest answer — “I do not have that information” — and that is the promise of the product. Anything else does not: “Are you ok?”, “PLEASE”, “hello” get a short, friendly reply. An assistant that stonewalls everything outside its notes is one visitors close, and it only takes a few such answers in a row for a small model to keep repeating them.',
             "Et ce qui se passe alors dépend du message, parce que deux situations ne doivent pas être confondues. Une question qui demande une information reçoit la réponse honnête — « je n’ai pas cette information » — et c’est la promesse du produit. Le reste, non : « ça va ? », « AIDEZ-MOI », « bonjour » reçoivent une réponse courte et aimable. Un assistant qui oppose un mur à tout ce qui sort de ses fiches est un assistant qu’on ferme, et il suffit de quelques réponses de ce genre d’affilée pour qu’un petit modèle ne fasse plus que les répéter.")}
        </P>
      </Section>

      <Section id="preload" title="preload(), status() & runtime()">
        <P>
          {t('preload() downloads the engine and the model ahead of the first question: call it on a hover, or on the pricing page before support opens. onProgress receives the phase and, during download, the bytes: enough for a real progress bar.',
             "preload() télécharge le moteur et le modèle avant la première question : appelez-le sur un survol, ou sur la page tarifs avant l'ouverture du support. onProgress reçoit la phase et, pendant le téléchargement, les octets : de quoi afficher une vraie barre de progression.")}
        </P>
        <Code lang="js">{`await preload({
  onProgress: (status, p) => {
    if (p) bar.style.width = (100 * p.loaded / p.total) + "%";
  },
});

status()  // 'unavailable' (${t('no WebGPU', 'pas de WebGPU')}) | 'idle' | 'loading' | 'ready' | 'error'`}</Code>
        <P>
          {t('status() answers synchronously: use it to decide whether to show the widget at all on browsers without WebGPU. runtime() reports where inference actually runs — "worker", "main", or "pending" before anything has started — which is what you check when you passed worker: true and want to know whether the fallback kicked in (a host CSP that forbids blob: makes it fall back to the main thread, silently and on purpose: a widget must never stop working over an execution choice).',
             "status() répond de façon synchrone : utile pour décider d'afficher ou non le widget sur les navigateurs sans WebGPU. runtime() dit où l'inférence tourne réellement — « worker », « main », ou « pending » tant que rien n'a démarré — c'est ce qu'on vérifie après avoir passé worker: true pour savoir si le repli s'est déclenché (une CSP d'hôte qui interdit blob: fait retomber sur le thread principal, en silence et volontairement : un widget ne doit jamais cesser de fonctionner à cause d'un choix d'exécution).")}
        </P>
      </Section>

      <Section id="engine" title={t('One engine per page', 'Un seul moteur par page')}>
        <P>
          {t('The engine is a singleton per model URL: N widgets and N sessions on a page share one WebGPU init and one set of weights in VRAM. Mounting a second widget costs a DOM node, not 149 MB — and destroying one leaves the weights loaded for whoever comes next. This is also why worker and workerUrl only take effect before the first preload or ask: once the backend exists it is shared by the whole page, and a later embed() saying otherwise is ignored with a console warning rather than silently believed.',
             "Le moteur est un singleton par URL de modèle : N widgets et N sessions d'une page partagent une seule init WebGPU et un seul jeu de poids en VRAM. Monter un second widget coûte un nœud DOM, pas 149 Mo — et en détruire un laisse les poids chargés pour le suivant. C'est aussi pourquoi worker et workerUrl ne valent que TANT QUE le premier preload ou ask n'a pas eu lieu : une fois le backend créé il est partagé par toute la page, et un embed() ultérieur qui dit le contraire est ignoré avec un avertissement en console plutôt que cru en silence.")}
        </P>
      </Section>

      <Section id="pinning" title={t('Versions & CDNs', 'Versions & CDN')}>
        <P>
          {t('Pin a version if you would rather the widget did not change under your feet:',
             'Épinglez une version si vous préférez que le widget ne change pas sous vos pieds :')}
        </P>
        <Code lang="url">{`${SITE_URL}/sdk-0.2.0.js   ${t('instead of', 'au lieu de')}   ${SITE_URL}/sdk.js

<!-- ${t('or from the npm CDNs', 'ou depuis les CDN npm')} -->
https://unpkg.com/brimkern@0.2.0/dist/brimkern.iife.js
https://cdn.jsdelivr.net/npm/brimkern@0.2.0/dist/brimkern.iife.js`}</Code>
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
