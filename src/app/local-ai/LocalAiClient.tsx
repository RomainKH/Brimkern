"use client";

// Page de mise en avant du produit « IA on-device embarquable » : la force d'une IA locale, sans
// coût serveur, privée. Identité « Le Kern » (papier/encre/rouge, Fraunces pour les titres) — aucun
// violet/dégradé. Bilingue via t() + toggle de langue, même patron que /changelog.

import Link from 'next/link';
import { Zap, ShieldCheck, ServerOff, MessageSquareText, WifiOff, Cpu, ArrowRight } from 'lucide-react';
import { useLocale, useT, useHref } from '@/lib/i18n';
import ByLine from '../ByLine';
import BackLink from '../BackLink';
import LocalAiDemo from './LocalAiDemo';

export default function LocalAiClient() {
  const t = useT();
  // Liens internes préfixés par la locale (voir useHref) : rester dans sa langue en naviguant.
  const href = useHref();
  const { locale, setLocale } = useLocale();

  const args = [
    {
      Icon: Zap,
      title: t('Zero inference cost', "Zéro coût d'inférence"),
      body: t(
        'The compute runs on your visitor’s GPU, not a server. No per-token bill, no rate limits, infinite scale. Flat price, unlimited usage.',
        "Le calcul tourne sur le GPU de votre visiteur, pas sur un serveur. Aucune facture par token, aucun rate-limit, scale infini. Tarif fixe, usage illimité.",
      ),
    },
    {
      Icon: ShieldCheck,
      title: t('Private by design', 'Privé par construction'),
      body: t(
        'The data never leaves the browser. Nothing transits through us — a decisive argument for privacy-sensitive sites (health, legal, HR).',
        "Les données ne quittent jamais le navigateur. Rien ne transite par nous — un argument décisif pour les sites sensibles (santé, juridique, RH).",
      ),
    },
    {
      Icon: ServerOff,
      title: t('No server, no ops', 'Aucun serveur, aucune ops'),
      body: t(
        'No GPU fleet to run, no scaling to manage, no API keys to rotate. The model streams once from a CDN and is cached on the device.',
        "Pas de flotte GPU à opérer, pas de scaling à gérer, pas de clés d'API à faire tourner. Le modèle streame une fois depuis un CDN et reste en cache sur l'appareil.",
      ),
    },
    {
      Icon: MessageSquareText,
      title: t('Shaped by a prompt', 'Façonnée par un prompt'),
      body: t(
        'You define what the AI does with a predefined instruction — its role, its logic, its guardrails. No fine-tuning, no data scientist required.',
        "Vous définissez ce que fait l'IA avec une consigne prédéfinie — son rôle, sa logique, ses garde-fous. Pas de fine-tuning, pas de data scientist requis.",
      ),
    },
  ];

  const steps = [
    t('Drop one <script> tag and write the instruction that shapes the assistant.',
      'Posez une balise <script> et écrivez la consigne qui façonne l’assistant.'),
    t('On first use, a lightweight model streams from a CDN and caches on the device (then it’s instant, even offline).',
      'À la première utilisation, un modèle léger streame depuis un CDN et se met en cache sur l’appareil (ensuite c’est instantané, même hors ligne).'),
    t('Every prompt runs on the visitor’s GPU through our WebGPU kernels — nothing is sent anywhere.',
      'Chaque requête tourne sur le GPU du visiteur via nos kernels WebGPU — rien n’est envoyé où que ce soit.'),
  ];

  const useCases = [
    t('Contextual support / FAQ', 'Support / FAQ contextualisé'),
    t('Form & onboarding assistant', 'Assistant de formulaire & onboarding'),
    t('Rewriting, tone & summaries', 'Reformulation, ton & résumés'),
    t('Intent routing & classification', 'Routage d’intention & classification'),
    t('Page-aware Q&A', 'Questions-réponses sur la page'),
    t('Step-by-step guidance', 'Guidage pas-à-pas'),
  ];

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Barre haut : retour + toggle langue (même patron que /changelog) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <BackLink />
        <button
          onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
          style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
        >
          {locale === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      {/* Hero */}
      <div style={{ borderTop: '2px solid var(--accent)', marginTop: 20, paddingTop: 22 }}>
        <span className="section-title" style={{ fontSize: 12, color: 'var(--accent)' }}>
          {t('For websites', 'Pour les sites web')}
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '10px 0 14px', color: 'var(--text-primary)' }}>
          {t('The power of AI — on your visitors’ machine, at no extra cost.',
            "La force d'une IA — sur la machine de vos visiteurs, sans coût supplémentaire.")}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.55, margin: '0 0 22px', maxWidth: 680 }}>
          {t('Embed an assistant that runs entirely in the browser, on the visitor’s own GPU. No server, no per-token bill, no data leaving the device. You shape what it does with a single prompt.',
            "Embarquez un assistant qui tourne entièrement dans le navigateur, sur le GPU du visiteur. Aucun serveur, aucune facture par token, aucune donnée qui sort de l'appareil. Vous façonnez ce qu'il fait avec un seul prompt.")}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="#demo"
            onClick={(e) => { e.preventDefault(); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
            className="btn btn-primary"
            style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}
          >
            {t('Try it live', 'Essayer en live')} <ArrowRight size={15} />
          </a>
          <Link href={href('/changelog')} className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
            {t('See what it runs', 'Voir ce qu’il fait tourner')}
          </Link>
        </div>
      </div>

      {/* Arguments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 40 }}>
        {args.map(({ Icon, title, body }) => (
          <div key={title} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              {/* h2 (pas h3) : ces cartes viennent juste après le <h1>, sauter un niveau casse la
                  navigation par titres des lecteurs d'écran (axe heading-order). */}
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>

      {/* Démo live — l'IA tourne dans le navigateur du visiteur */}
      <LocalAiDemo />

      {/* Comment ça marche */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '46px 0 18px', color: 'var(--text-primary)' }}>
        {t('How it works', 'Comment ça marche')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((s, i) => (
          <div key={i} className="card" style={{ padding: 16, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--accent)', lineHeight: 1, flexShrink: 0, width: 28 }}>{i + 1}</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>{s}</p>
          </div>
        ))}
      </div>

      {/* Cas d'usage */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '46px 0 8px', color: 'var(--text-primary)' }}>
        {t('What it’s great at', 'Ce qu’elle fait très bien')}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 18px' }}>
        {t('A light on-device model shines on scoped tasks — the ones a good prompt fully defines:',
          "Un modèle léger on-device brille sur les tâches cadrées — celles qu'un bon prompt définit entièrement :")}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {useCases.map((u) => (
          <span key={u} className="badge-accent" style={{ fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 999 }}>{u}</span>
        ))}
      </div>

      {/* Embarquer — le SDK v0 est livré : snippet réel + lien démo */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '46px 0 8px', color: 'var(--text-primary)' }}>
        {t('Embed it on your site — SDK v0', 'Embarquez-la sur votre site — SDK v0')}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55, margin: '0 0 14px', maxWidth: 680 }}>
        {t('The SDK is live. One script tag mounts the assistant; a prompt shapes it. The model only downloads when a visitor opens the widget — your page score is untouched.',
          'Le SDK est disponible. Une balise script monte l’assistant ; un prompt le façonne. Le modèle ne se télécharge que quand un visiteur ouvre le widget — le score de votre page reste intact.')}
      </p>
      {/* tabIndex/role : une zone qui DÉFILE doit être atteignable au clavier (axe
          scrollable-region-focusable) — sinon le snippet est illisible sans souris sur mobile. */}
      <pre tabIndex={0} role="group" aria-label={t('SDK integration snippet', "Extrait de code d'intégration du SDK")} className="card" style={{ padding: 18, margin: 0, overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)' }}>
{`<script src="https://brimkern.com/sdk.js"></script>
<script>
  Brimkern.embed({
    system: ${locale === 'fr' ? "'Tu es l’assistant de support d’Acme, amical et concis.'" : "'You are a friendly, concise support assistant for Acme.'"},
  });
</script>`}
      </pre>
      <p style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0 0', flexWrap: 'wrap' }}>
        <a href="/sdk-demo" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
          {t('See a live integration', 'Voir une intégration live')} <ArrowRight size={15} />
        </a>
        <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>
          {t('v0 — chat widget, LFM2 .brik model URL, colors & wording, few-shot examples, and knowledge documents (answers from YOUR content, selected locally, nothing sent anywhere). Tools are next. On the default 230M model, keep notes short and factual: it quotes them well, but it can mix up two numbers sitting in the same paragraph.',
            'v0 — widget de chat, URL de modèle LFM2 .brik, couleurs & libellés, exemples few-shot, et documents de connaissance (il répond sur VOTRE contenu, sélectionné en local, rien n’est envoyé nulle part). Les outils arrivent ensuite. Sur le modèle 230M par défaut, gardez des notes courtes et factuelles : il les cite bien, mais il peut confondre deux nombres présents dans le même paragraphe.')}
        </span>
      </p>

      {/* Sous le capot / crédibilité */}
      <div className="card" style={{ padding: 22, marginTop: 44, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Cpu size={22} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
            {t('Our own engine, not a black box', 'Notre propre moteur, pas une boîte noire')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
            {t('Hand-written WebGPU kernels run the model; weights ship in our compact BRIK format, quantized down to int3 and streamed in seconds, then cached. A model is picked to fit — the loader even reads the visitor’s GPU and connection to recommend the right one.',
              "Des kernels WebGPU maison exécutent le modèle ; les poids sont livrés dans notre format compact BRIK, quantifiés jusqu'en int3 et streamés en secondes, puis mis en cache. Le modèle est choisi pour tenir — le chargeur lit même le GPU et la connexion du visiteur pour recommander le bon.")}
          </p>
        </div>
      </div>

      {/* Note honnête */}
      <p style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12.5, marginTop: 26, lineHeight: 1.5 }}>
        <WifiOff size={14} style={{ flexShrink: 0 }} />
        {t('Runs in modern browsers with WebGPU (Chrome, Edge, Safari, Firefox). Best for well-scoped tasks — not open-ended reasoning. First load downloads the model once; every visit after is instant and offline-capable.',
          "Fonctionne dans les navigateurs modernes avec WebGPU (Chrome, Edge, Safari, Firefox). Idéal pour des tâches bien cadrées — pas du raisonnement ouvert. Le premier chargement télécharge le modèle une fois ; ensuite chaque visite est instantanée et disponible hors ligne.")}
      </p>

      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 28 }}>
        {t('Brimkern — local WebGPU inference. The embeddable SDK (v0) is live and free — the engine is open source (MIT).',
          "Brimkern — inférence WebGPU locale. Le SDK embarquable (v0) est disponible et gratuit — le moteur est open source (MIT).")}
      </p>
      <ByLine />
    </main>
  );
}
