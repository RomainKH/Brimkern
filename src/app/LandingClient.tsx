"use client";

// LA LANDING — ce qu'on sert à la racine depuis le 2026-08-13.
//
// Avant, la racine servait l'application : un visiteur venu d'un moteur ou d'un post tombait dans un
// chat vide, où l'écran d'accueil devait faire deux métiers à la fois (expliquer le produit ET
// charger un modèle). Résultat : la page ne disait nulle part ce qui distingue ce moteur (lire les
// GGUF du Hub sans étape de compilation, des kernels WGSL écrits à la main, le streaming par plages),
// et la doc renvoyait « à l'accueil », c'est-à-dire dans le chat.
//
// Ici : la promesse, UN chemin évident vers le premier « wow » (le CTA part sur /chat?start=1, qui
// charge le modèle par défaut sans second clic), la preuve chiffrée, et les portes du projet.
// L'application vit sur /chat (src/app/ChatApp.tsx), la doc sur /docs.
//
// Style : page de spécimen typographique — Fraunces en display, filets d'encre, un seul rouge. Pas
// de dégradé ni de capture d'écran en fond : la démonstration, c'est le produit à un clic.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BrandMark from './BrandMark';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useT, useLocale, useHref } from '@/lib/i18n';
import { parseDeeplink, parseModelInput } from '@/lib/deeplink';
import { metric, metricOnce } from '@/lib/metrics';
import { SDK_URL } from '@/lib/site';
import HfModelInput from './HfModelInput';
import GithubMark from './GithubMark';
import ByLine from './ByLine';

// Exemples cliquables du champ « n'importe quel modèle » : des dépôts VÉRIFIÉS en ligne (un exemple
// mort serait la pire première impression pour un visiteur venu de Hugging Face).
const HF_EXAMPLES = [
  { label: 'Qwen3 0.6B (GGUF)', value: 'Qwen/Qwen3-0.6B-GGUF' },
  { label: 'Gemma 3 270M (GGUF)', value: 'unsloth/gemma-3-270m-it-GGUF' },
  { label: 'LFM2.5 230M (.brik)', value: 'romainkh14/LFM2.5-230M_BRIK' },
];

// Un chiffre MESURÉ (aucun n'est estimé : ils viennent tous du banc décrit dans le README).
// Le nombre SE COMPTE quand la rangée entre à l'écran (900 ms, une seule fois) : c'est l'animation
// qui met l'accent là où la page met son argument — sur la mesure. Le HTML servi porte la valeur
// finale (SEO, hydratation, lecteurs d'écran : les mutations d'un nœud non-live ne sont pas
// annoncées) ; le JS ne fait que la rejouer visuellement. Rien sous prefers-reduced-motion.
function Figure({ value, label, i = 0 }: { value: string; label: string; i?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Le format vient de la chaîne elle-même (décimales, séparateur, suffixe) — pas de table locale.
    const m = /^(\d+)([.,]\d+)?/.exec(value);
    if (!m) return;
    const final = parseFloat(m[0].replace(',', '.'));
    if (final === 0) return; // « 0 » : rien à compter
    const decimals = m[2] ? m[2].length - 1 : 0;
    const sep = m[2] ? m[2][0] : '.';
    const suffix = value.slice(m[0].length);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 900);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out : file vite, se pose doucement sur la valeur
        el.textContent = (final * eased).toFixed(decimals).replace('.', sep) + suffix;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return (
    <div className="lp-figure" style={{ '--i': i } as React.CSSProperties}>
      <div className="lp-figure-value" ref={ref}>{value}</div>
      <div className="lp-figure-label">{label}</div>
    </div>
  );
}

// Une force du moteur, tenue par un filet d'encre (même grammaire que l'accueil du chat).
function Strength({ eyebrow, title, children, i = 0 }: { eyebrow: string; title: string; children: React.ReactNode; i?: number }) {
  return (
    // `--i` : rang dans la rangée, qui décale l'apparition. Trois blocs qui surgissent ensemble
    // font un clignotement ; décalés de 90 ms, ils se LISENT de gauche à droite.
    <div className="lp-strength" style={{ '--i': i } as React.CSSProperties}>
      <div className="lp-eyebrow">{eyebrow}</div>
      <h3 className="lp-strength-title">{title}</h3>
      <p className="lp-strength-desc">{children}</p>
    </div>
  );
}

export default function LandingClient() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const href = useHref();
  const router = useRouter();

  // Les liens DÉJÀ PUBLIÉS pointent sur la racine (`/?model=…` : cartes de modèle Hugging Face, menu
  // « Use this model », posts). La racine ne charge plus de modèle — on transmet donc la query telle
  // quelle à /chat, en `replace` pour ne pas piéger le bouton « retour » du navigateur.
  const forwarded = useRef(false);
  useEffect(() => {
    if (forwarded.current) return;
    const search = window.location.search;
    const isDeeplink = !!parseDeeplink(search) || new URLSearchParams(search).get('start') === '1';
    if (!isDeeplink) return;
    forwarded.current = true;
    router.replace(`${href('/chat')}${search}`);
  }, [router, href]);

  // WebGPU présent ? La landing promet « Essayer maintenant » — le lui promettre dans un navigateur
  // qui ne peut rien exécuter, c'est envoyer le visiteur droit dans un mur (le trafic Reddit/X arrive
  // par un navigateur intégré sans WebGPU : cas documenté, pas hypothétique). Sonde LÉGÈRE : présence
  // de navigator.gpu + un adapter, sans créer de device ni charger quoi que ce soit. `?webgpu=0`
  // force le cas « non supporté », comme dans l'application, pour pouvoir le mettre au banc.
  const [gpuOk, setGpuOk] = useState<boolean | null>(null);
  const [customHfOpen, setCustomHfOpen] = useState<boolean>(false);
  const [workbenchTab, setWorkbenchTab] = useState<'chat' | 'cli' | 'sdk'>('chat');
  const [copiedNpx, setCopiedNpx] = useState(false);

  useEffect(() => {
    let alive = true;
    const set = (v: boolean) => { if (alive) setGpuOk(v); };
    const forced = new URLSearchParams(window.location.search).get('webgpu') === '0';
    const gpu = forced ? undefined : (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    if (!gpu) { queueMicrotask(() => set(false)); return () => { alive = false; }; }
    gpu.requestAdapter().then((a) => set(!!a)).catch(() => set(false));
    return () => { alive = false; };
  }, []);

  const handleCopyNpx = () => {
    navigator.clipboard.writeText('curl -fsSL https://brimkern.com/install.sh | bash').catch(() => {});
    setCopiedNpx(true);
    setTimeout(() => setCopiedNpx(false), 2000);
  };

  // Funnel : la landing est devenue la première marche, elle manquait donc au comptage. Deux
  // événements, sans donnée personnelle (cf. src/lib/metrics.ts) : la page vue, et le CTA cliqué —
  // c'est entre les deux que se joue le rebond qu'on cherche à mesurer.
  useEffect(() => { if (gpuOk !== null) metricOnce('landing_view', { webgpu: gpuOk }); }, [gpuOk]);

  // Le champ « n'importe quel modèle » : ici il ne charge rien (la landing n'embarque pas le moteur),
  // il VALIDE la saisie — même parseur que l'app — puis envoie sur /chat avec le deeplink qui va bien.
  const goToChatWith = async (raw: string): Promise<string | null> => {
    const target = parseModelInput(raw);
    if (!target) {
      return t(
        'Unrecognized. Paste a Hugging Face model (author/model), the URL of its page, or a direct .gguf / .brik link.',
        'Non reconnu. Collez un modèle Hugging Face (auteur/modèle), l’URL de sa page, ou un lien direct .gguf / .brik.',
      );
    }
    const q = 'url' in target
      ? `${target.kind}=${encodeURIComponent(target.url)}`
      : `model=${encodeURIComponent(target.id)}${target.file ? `&file=${encodeURIComponent(target.file)}` : ''}`;
    router.push(`${href('/chat')}?${q}`);
    return null;
  };

  return (
    <div className="lp-page">
      <div className="lp">
        <header className="lp-nav">
          <Link href={href('/')} className="lp-brand" aria-label="Brimkern">
            <BrandMark size={28} />
            <span>Brimkern</span>
          </Link>
          <nav className="lp-nav-links" aria-label={t('Main', 'Principale')}>
            <Link href={href('/agents')}>{t('Agents & MCP', 'Agents & MCP')}</Link>
            <Link href={href('/cli')}>CLI</Link>
            <Link href={href('/docs')}>{t('Docs', 'Doc')}</Link>
            <Link href={href('/local-ai')}>SDK</Link>
            <Link href={href('/changelog')} className="lp-nav-wide">Changelog</Link>
            <a href="https://github.com/RomainKH/Brimkern" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="lp-nav-icon">
              <GithubMark size={16} />
            </a>
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
              className="lp-nav-lang"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
            <Link href={href('/chat')} className="btn btn-primary lp-nav-cta">{t('Open the chat', 'Ouvrir le chat')}</Link>
          </nav>
        </header>

        <main>
          {/* ── HERO ─────────────────────────────────────────────────────────────────────────────── */}
          <section className="lp-hero-wrap">
            <div className="lp-hero">
              <div className="lp-eyebrow">
                <span className="lp-quick-kicker">WebGPU</span>
                <span>{t('100% on-device · Private · Zero server calls', '100 % on-device · Privé · Zéro appel serveur')}</span>
              </div>
              <h1 className="lp-h1">
                {t('Powerful AI models.', 'Des modèles d’IA puissants.')}<br />
                <span className="lp-h1-accent">
                  {t('Directly in your browser.', 'Directement dans votre navigateur.')}
                </span>
              </h1>
            <p className="lp-lede">
              {t('Brimkern runs open-source models straight from Hugging Face on your own GPU: no installation, no server, and no subscription. Weights stream in once, stay on your device, and work completely offline.',
                 'Brimkern fait tourner des modèles open source directement sur votre carte graphique : sans installation, sans serveur tiers et sans abonnement. Les modèles arrivent en streaming, restent sur votre appareil et fonctionnent hors-ligne.')}
            </p>
            <div className="lp-cta-row">
              <Link
                href={`${href('/chat')}?start=1`}
                className="btn btn-primary lp-cta"
                onClick={() => metric('landing_cta', { webgpu: gpuOk ?? 'inconnu' })}
              >
                <Sparkles size={15} /> {t('Start chatting — Free & local', 'Lancer le chat — Gratuit & local')}
              </Link>
              <Link href={href('/docs')} className="lp-cta-ghost">
                {t('Explore docs & models', 'Explorer la doc & les modèles')} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Barre de commande rapide (inspiration mise.jdx.dev) */}
            <div className="lp-hero-install">
              <span className="lp-hero-install-prompt" aria-hidden="true">$</span>
              <code>curl -fsSL https://brimkern.com/install.sh | bash</code>
              <button
                type="button"
                className="lp-hero-install-copy"
                onClick={handleCopyNpx}
                aria-label={t('Copy CLI install command', 'Copier la commande d’installation CLI')}
              >
                {copiedNpx ? t('Copied!', 'Copié !') : t('Copy', 'Copier')}
              </button>
            </div>
            <p className="lp-hero-install-note">
              <span>macOS & Linux</span>
              <span aria-hidden="true"> · </span>
              <Link href={href('/cli')}>{t('CLI guide', 'Guide CLI')}</Link>
              <span aria-hidden="true"> · </span>
              <span>{t('Or open in browser', 'Ou ouvrir dans le navigateur')}</span>
            </p>

            {gpuOk === false && (
              <p className="lp-fineprint lp-warn">
                <AlertCircle size={13} />
                <span>
                  {t('This browser has no WebGPU, so nothing can run here. Open the page in Chrome or Edge (from an in-app browser: “Open in browser”).',
                     'Ce navigateur n’a pas WebGPU : rien ne peut s’exécuter ici. Ouvrez la page dans Chrome ou Edge (depuis un navigateur intégré : « Ouvrir dans le navigateur »).')}
                </span>
              </p>
            )}
          </div>

          {/* Workbench interactif (inspiration mise.jdx.dev) */}
          <div className="lp-workbench" aria-label={t('Engine interactive workbench', 'Établi interactif du moteur')}>
            <div className="lp-workbench-bar">
              <div className="lp-workbench-dots" aria-hidden="true">
                <span className="lp-dot dot-close" />
                <span className="lp-dot dot-min" />
                <span className="lp-dot dot-max" />
              </div>
              <div className="lp-workbench-title">
                <BrandMark size={14} />
                <span>brimkern-engine.ts</span>
              </div>
              <span className="lp-workbench-badge">WebGPU v0.9</span>
            </div>

            <div className="lp-workbench-tabs" role="tablist" aria-label={t('Explore Brimkern surfaces', 'Explorer les surfaces de Brimkern')}>
              <button
                type="button"
                role="tab"
                aria-selected={workbenchTab === 'chat'}
                className={`lp-workbench-tab ${workbenchTab === 'chat' ? 'active' : ''}`}
                onClick={() => setWorkbenchTab('chat')}
              >
                {t('WebGPU Chat', 'Chat WebGPU')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={workbenchTab === 'cli'}
                className={`lp-workbench-tab ${workbenchTab === 'cli' ? 'active' : ''}`}
                onClick={() => setWorkbenchTab('cli')}
              >
                {t('Terminal CLI', 'CLI Terminal')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={workbenchTab === 'sdk'}
                className={`lp-workbench-tab ${workbenchTab === 'sdk' ? 'active' : ''}`}
                onClick={() => setWorkbenchTab('sdk')}
              >
                {t('Web SDK', 'SDK Web')}
              </button>
            </div>

            <div className="lp-workbench-body">
              {workbenchTab === 'chat' && (
                <div className="lp-workbench-panel">
                  <div className="lp-workbench-comment">
                    # {t('Run any Hugging Face model directly on client GPU', 'Fait tourner n’importe quel modèle Hugging Face sur votre GPU')}
                  </div>
                  <pre className="lp-workbench-code"><code><span className="lp-wb-prompt">$</span> brimkern run Qwen/Qwen2.5-0.5B-Instruct-GGUF{'\n'}<span className="lp-wb-dim">[gpu]  WebGPU adapter: Apple M-series (resident KV cache)</span>{'\n'}<span className="lp-wb-dim">[http] Streaming Q4_K_M weights (378 MB) via range requests</span>{'\n'}<span className="lp-wb-dim">[wgsl] 14 custom shaders compiled · Zero server calls</span>{'\n'}<span className="lp-wb-success">✓ Model ready in 1.4s · 47.2 tok/s decode</span></code></pre>
                  <div className="lp-workbench-footer">
                    <Link href={`${href('/chat')}?model=Qwen/Qwen2.5-0.5B-Instruct-GGUF`} className="lp-wb-action">
                      {t('Launch Qwen 2.5 in chat', 'Lancer Qwen 2.5 dans le chat')} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {workbenchTab === 'cli' && (
                <div className="lp-workbench-panel">
                  <div className="lp-workbench-comment">
                    # {t('Coding assistant running in your shell on your local GPU', 'Assistant de code dans votre shell sur votre GPU local')}
                  </div>
                  <pre className="lp-workbench-code"><code><span className="lp-wb-prompt">$</span> brimkern chat{'\n'}<span className="lp-wb-dim">? Project: ~/dev/my-app (indexed 84 files)</span>{'\n'}<span className="lp-wb-dim">? Model: Qwen 3 4B (4-bit quantized, local GPU)</span>{'\n'}<span className="lp-wb-info">brimkern&gt; Optimize the WebGPU render pipeline</span>{'\n'}<span className="lp-wb-success">✓ 2 files updated · 100% offline & private</span></code></pre>
                  <div className="lp-workbench-footer">
                    <Link href={href('/cli')} className="lp-wb-action">
                      {t('Explore CLI docs & features', 'Explorer la doc CLI & fonctionnalités')} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {workbenchTab === 'sdk' && (
                <div className="lp-workbench-panel">
                  <div className="lp-workbench-comment">
                    # {t('Drop client-side AI into any website with 0 inference costs', 'Intégrez l’IA client dans tout site avec 0 coût d’inférence')}
                  </div>
                  <pre className="lp-workbench-code"><code>&lt;<span className="lp-wb-tag">script</span> <span className="lp-wb-attr">src</span>=<span className="lp-wb-val">&quot;{SDK_URL}&quot;</span>&gt;&lt;/<span className="lp-wb-tag">script</span>&gt;{'\n'}&lt;<span className="lp-wb-tag">script</span>&gt;{'\n'}{'  '}<span className="lp-wb-fn">Brimkern</span>.<span className="lp-wb-fn">embed</span>({'{'}{'\n'}{'    '}<span className="lp-wb-attr">model</span>: <span className="lp-wb-val">&quot;romainkh14/LFM2.5-230M_BRIK&quot;</span>,{'\n'}{'    '}<span className="lp-wb-attr">system</span>: <span className="lp-wb-val">&quot;{t('You answer product questions.', 'Tu réponds aux questions produit.')}&quot;</span>{'\n'}{'  '}{'}'});{'\n'}&lt;/<span className="lp-wb-tag">script</span>&gt;</code></pre>
                  <div className="lp-workbench-footer">
                    <Link href={href('/local-ai')} className="lp-wb-action">
                      {t('SDK page & live demo', 'Page SDK & démo live')} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SÉLECTION RAPIDE DE MODÈLES (1-CLIC) ────────────────────────────────────────────── */}
        <section className="lp-quick-section" aria-label={t('Try a model in 1 click', 'Essayer un modèle en 1 clic')}>
          <div className="lp-quick-container">
            <div className="lp-quick-header">
              <div className="lp-quick-title-wrap">
                <span className="lp-quick-badge">
                  <span className="lp-quick-kicker">01</span> {t('Instant trial · 1 click', 'Essai instantané · 1 clic')}
                </span>
                <h2 className="lp-quick-heading">
                  {t('Pick a model. Chat immediately.', 'Choisissez un modèle. Discutez immédiatement.')}
                </h2>
              </div>
              <button
                type="button"
                className="lp-quick-toggle"
                onClick={() => setCustomHfOpen((v) => !v)}
                aria-expanded={customHfOpen}
              >
                {customHfOpen
                  ? '▲ ' + t('Hide custom input', 'Masquer la saisie personnalisée')
                  : '▼ ' + t('Or paste any Hugging Face model', 'Ou tester un autre modèle Hugging Face')}
              </button>
            </div>

            <div className="lp-quick-grid">
              <Link href={`${href('/chat')}?model=romainkh14/LFM2.5-230M_BRIK`} className="lp-quick-card highlight">
                <div className="lp-quick-card-top">
                  <span className="lp-quick-tag fast">⚡ {t('Fastest', 'Ultra-rapide')}</span>
                  <span className="lp-quick-size">149 MB</span>
                </div>
                <strong className="lp-quick-name">LFM2.5 230M</strong>
                <p className="lp-quick-card-desc">
                  {t('Liquid AI architecture. Instant download, minimal memory footprint.', 'Architecture Liquid AI. Téléchargement instantané, empreinte mémoire minimale.')}
                </p>
                <div className="lp-quick-specs">
                  <span>{t('Arch: Liquid Net', 'Arch : Réseau Liquide')}</span>
                  <span>{t('Weights: .brik', 'Poids : .brik')}</span>
                  <span>{t('Speed: Instant', 'Vitesse : Immédiate')}</span>
                </div>
                <div className="lp-quick-card-action">
                  <span>{t('Launch in chat', 'Lancer dans le chat')}</span>
                  <ArrowRight size={13} />
                </div>
              </Link>

              <Link href={`${href('/chat')}?model=Qwen/Qwen2.5-0.5B-Instruct-GGUF`} className="lp-quick-card">
                <div className="lp-quick-card-top">
                  <span className="lp-quick-tag smart">🧠 {t('Fluent', 'Polyvalent')}</span>
                  <span className="lp-quick-size">378 MB</span>
                </div>
                <strong className="lp-quick-name">Qwen 2.5 0.5B</strong>
                <p className="lp-quick-card-desc">
                  {t('Alibaba. Strong at reasoning, coding and multilingual chat.', 'Alibaba. Excellent en raisonnement, code et dialogue en français.')}
                </p>
                <div className="lp-quick-specs">
                  <span>{t('Arch: Transformer', 'Arch : Transformer')}</span>
                  <span>{t('Format: Q4_K_M', 'Format : Q4_K_M')}</span>
                  <span>{t('Ctx: 32,768', 'Ctx : 32 768')}</span>
                </div>
                <div className="lp-quick-card-action">
                  <span>{t('Launch in chat', 'Lancer dans le chat')}</span>
                  <ArrowRight size={13} />
                </div>
              </Link>

              <Link href={`${href('/chat')}?model=unsloth/gemma-3-270m-it-GGUF`} className="lp-quick-card">
                <div className="lp-quick-card-top">
                  <span className="lp-quick-tag compact">📦 {t('Compact', 'Compact')}</span>
                  <span className="lp-quick-size">270 MB</span>
                </div>
                <strong className="lp-quick-name">Gemma 3 270M</strong>
                <p className="lp-quick-card-desc">
                  {t('Google Gemma 3. Highly capable compact model for general queries.', 'Google Gemma 3. Modèle compact très efficace pour les requêtes courantes.')}
                </p>
                <div className="lp-quick-specs">
                  <span>{t('Arch: Gemma 3', 'Arch : Gemma 3')}</span>
                  <span>{t('Format: Q4_K_S', 'Format : Q4_K_S')}</span>
                  <span>{t('Ctx: 8,192', 'Ctx : 8 192')}</span>
                </div>
                <div className="lp-quick-card-action">
                  <span>{t('Launch in chat', 'Lancer dans le chat')}</span>
                  <ArrowRight size={13} />
                </div>
              </Link>
            </div>

            {customHfOpen && (
              <div className="lp-console-input" style={{ marginTop: 16 }}>
                <HfModelInput onLoad={goToChatWith} examples={HF_EXAMPLES} compact />
              </div>
            )}
          </div>
        </section>

        {/* ── LES FORCES ───────────────────────────────────────────────────────────────────────── */}
        <section className="lp-section">
          {/* Un h2 ici n'est pas décoratif : sans lui les trois forces (h3) suivaient directement le
              h1, et l'ordre des titres sautait un niveau : un lecteur d'écran annonce alors une
              hiérarchie fausse (relevé axe-core, règle heading-order). */}
          <div className="lp-eyebrow">
            <span className="lp-quick-kicker">02</span> {t('Architecture & Privacy', 'Architecture & Confidentialité')}
          </div>
          <h2 className="lp-h2">{t('Three reasons to run AI directly in your browser', 'Trois raisons d’exécuter l’IA directement dans l’onglet')}</h2>
          <div className="lp-strengths">
            <Strength
              i={0}
              eyebrow={t('privacy first', 'confidentialité totale')}
              title={t('100% Private & offline', '100 % Privé & hors-ligne')}
            >
              {t('Your conversations and documents never leave your machine. No accounts, no servers, and no telemetry. Once loaded, models continue to work even without an internet connection.',
                 'Vos conversations et documents ne quittent jamais votre machine. Aucun compte, aucun serveur et aucune collecte. Une fois chargé, le modèle continue de fonctionner même déconnecté d’Internet.')}
            </Strength>
            <Strength
              i={1}
              eyebrow={t('instant streaming', 'streaming instantané')}
              title={t('Zero install, zero configuration', 'Zéro installation, zéro configuration')}
            >
              {t('No Python, Docker, or complex drivers to configure. Models stream in seconds through standard HTTP ranges and are cached locally on your device for immediate future access.',
                 'Pas de Python, pas de Docker, ni de pilotes complexes. Les modèles arrivent en quelques secondes via votre navigateur et restent en mémoire locale pour vos prochaines visites.')}
            </Strength>
            <Strength
              i={2}
              eyebrow={t('open ecosystem', 'écosystème ouvert')}
              title={t('Any open-source model', 'N’importe quel modèle open source')}
            >
              {t('Run standard GGUF and BRIK models from Hugging Face: Qwen, Gemma, Llama and more. Generate text, reason through problems, describe photos, or create images.',
                 'Exécutez les formats standards GGUF et BRIK depuis Hugging Face : Qwen, Gemma, Llama et bien d’autres. Discutez, résolvez des problèmes, décrivez des photos ou générez des images.')}
            </Strength>
          </div>
          {/* Le visiteur qui connaît déjà WebLLM se pose la question tout de suite — on l'emmène
              vers la comparaison chiffrée au lieu de la laisser sans réponse (et c'est le lien
              interne qui fait vivre cette page côté moteurs). */}
          <p className="lp-fineprint" style={{ marginTop: 18 }}>
            <Link href={href('/vs-webllm')} className="lp-cta-ghost">
              {t('How this compares to WebLLM (measured benchmarks)', 'Ce que ça donne face à WebLLM (mesures réelles)')} <ArrowRight size={13} />
            </Link>
          </p>
        </section>

        {/* ── LE MÉCANISME ─────────────────────────────────────────────────────────────────────
            « Une couche = une plage HTTP » ne se comprend pas dans un paragraphe : on le DESSINE.
            Le schéma est fait de DOM (texte + un SVG de la découpe), pas d'une grosse image : il se
            traduit, il se lit au lecteur d'écran, il s'empile sur mobile, et il ne pèse rien. */}
        <section className="lp-section">
          <div className="lp-eyebrow">
            <span className="lp-quick-kicker">03</span> {t('Pipeline & Shaders', 'Pipeline & Shaders')}
          </div>
          <h2 className="lp-h2">{t('From model weights to answers on your GPU', 'Du modèle à la réponse sur votre GPU')}</h2>
          <ol className="lp-flow">
            {([
              ['01', t('You select', 'Vous choisissez'), <code key="c">author/model</code>,
               t('A one-click curated preset or any Hugging Face repo ID or direct link.', 'Un modèle en un clic ou n’importe quel dépôt Hugging Face.')],
              ['02', t('We resolve', 'On résout'), t('the best weights', 'le meilleur fichier'),
               t('The Hub API lists the repo; the best quantization is selected automatically.', 'L’API du Hub liste le dépôt et sélectionne la meilleure quantification pour votre appareil.')],
              ['03', t('It streams', 'Ça streame'), t('into local cache', 'dans le cache local'),
               t('Weights stream progressively in the background and stay cached on your device.', 'Les couches se téléchargent en streaming et restent disponibles hors-ligne.')],
              ['04', t('It runs', 'Ça tourne'), t('on your GPU', 'sur votre GPU'),
               t('WebGPU compute shaders execute the model live. Zero data leaves your machine.', 'Des compute shaders WebGPU calculent les réponses en direct sans aucun serveur.')],
            ] as [string, string, React.ReactNode, string][]).map(([num, quoi, cible, desc]) => (
              <li key={num} className="lp-step-flow">
                <div className="lp-flow-num">{num}</div>
                <div className="lp-flow-title">{quoi} <span className="lp-flow-target">{cible}</span></div>
                <p className="lp-flow-desc">{desc}</p>
              </li>
            ))}
          </ol>
          {/* La découpe elle-même : un fichier, ses couches, et ce qui descend. Décoratif au sens
              strict (le texte au-dessus dit déjà tout) → aria-hidden, pas de rôle image.
              Au défilement, les plages POUSSENT une à une (--i porte le rang, le CSS fait le reste) :
              le schéma mime des plages qui arrivent dans l'ordre — demande de Romain, préférée à la
              première version qui révélait la barre d'un seul geste. */}
          <div className="lp-slices" aria-hidden>
            <span className="lp-slices-label">{t('the model', 'le modèle')}</span>
            <svg viewBox="0 0 600 34" preserveAspectRatio="none" className="lp-slices-svg">
              {Array.from({ length: 14 }, (_, i) => (
                <rect key={i} x={i * 43 + 1} y={i % 3 === 1 ? 4 : 9} width={40} height={i % 3 === 1 ? 26 : 16}
                      rx={3} fill={i % 3 === 1 ? 'var(--accent)' : 'var(--border-color)'}
                      style={{ '--i': i } as React.CSSProperties} />
              ))}
            </svg>
            <span className="lp-slices-label">{t('layers loaded on demand', 'couches chargées à la demande')}</span>
          </div>
        </section>

        {/* ── LES CHIFFRES ─────────────────────────────────────────────────────────────────────
            Tous mesurés (banc décrit dans le README) : aucune estimation sur cette page. */}
        <section className="lp-section">
          <div className="lp-eyebrow">
            <span className="lp-quick-kicker">04</span> {t('Hardware Benchmarks', 'Bancs d’essai matériels')}
          </div>
          <h2 className="lp-h2">{t('Measured on real hardware', 'Mesures réelles sur GPU')}</h2>
          <div className="lp-figures">
            <Figure i={0} value="149 MB" label={t('lightest chat model, cached once', 'plus petit modèle de chat, mis en cache une fois')} />
            <Figure i={1} value="47.2 tok/s" label={t('prefill on a 7B int4 (WebLLM: 18.7)', 'prefill sur un 7B int4 (WebLLM : 18,7)')} />
            <Figure i={2} value="15.8 s" label={t('to reload 4.7 GB from local cache', 'pour recharger 4,7 Go depuis le cache')} />
            <Figure i={3} value="0" label={t('servers, accounts, or API keys needed', 'serveur, compte ou clé d’API requis')} />
          </div>
        </section>

        {/* ── LE SDK ───────────────────────────────────────────────────────────────────────────── */}
        {/* Panneau ENCRE : toute la page est en papier, et une page d'un seul ton finit par se lire
            comme un document. Ce bloc-ci est celui qui parle de code — le fond sombre est aussi
            l'endroit naturel pour un extrait. Contrastes repris du thème sombre, déjà validés. */}
        <section className="lp-section lp-sdk lp-ink">
          <div>
            <div className="lp-eyebrow"><span className="lp-quick-kicker">05</span> {t('for your own product', 'pour votre produit')}</div>
            <h2 className="lp-h2">{t('One script tag, an assistant that costs nothing to run', 'Une balise script, un assistant qui ne coûte rien à faire tourner')}</h2>
            <p className="lp-strength-desc">
              {t('The compute is your visitor’s GPU: no inference bill, no rate limit, no data leaving their browser. The model only downloads when someone actually opens the widget, so your page speed is untouched.',
                 'Le calcul, c’est le GPU de votre visiteur : aucune facture d’inférence, aucune limite de débit, aucune donnée qui quitte son navigateur. Le modèle ne se télécharge que si quelqu’un ouvre le widget : votre vitesse de page reste intacte.')}
            </p>
            <Link href={href('/local-ai')} className="lp-cta-ghost">
              {t('SDK page & live demo', 'Page SDK & démo live')} <ArrowRight size={14} />
            </Link>
          </div>
          <pre tabIndex={0} className="lp-code">{`<script src="${SDK_URL}"></script>
<script>
  Brimkern.embed({
    system: "${t('You answer questions about my shop.', 'Tu réponds aux questions sur ma boutique.')}",
  });
</script>`}</pre>
        </section>

        {/* ── LA CLI ─────────────────────────────────────────────────────────────────────────────
            Juste un renvoi : les consoles et les démonstrations de terminal vivent sur /cli. */}
        <section className="lp-section">
          <div className="lp-eyebrow"><span className="lp-quick-kicker">06</span> {t('also in your terminal', 'aussi dans votre terminal')}</div>
          <h2 className="lp-h2">{t('The same engine, as a coding assistant for your shell', 'Le même moteur, en assistant de code pour votre terminal')}</h2>
          <p className="lp-strength-desc" style={{ maxWidth: 640 }}>
            {t('It reads the project you are in and runs Qwen 3 4B on your GPU. Nothing leaves the machine.',
               'Il lit le projet dans lequel vous êtes et fait tourner Qwen 3 4B sur votre GPU. Rien ne quitte la machine.')}
          </p>
          <Link href={href('/cli')} className="lp-cta-ghost">
            {t('See the CLI', 'Voir la CLI')} <ArrowRight size={14} />
          </Link>
        </section>

        {/* ── LES PORTES ───────────────────────────────────────────────────────────────────────── */}
        <section className="lp-section">
          <div className="lp-eyebrow"><span className="lp-quick-kicker">07</span> {t('also in the box', 'aussi dans la boîte')}</div>
          <h2 className="lp-h2">{t('One engine, four modalities', 'Un moteur, quatre modalités')}</h2>
          <ul className="lp-list">
            <li><strong>{t('Chat', 'Chat')}</strong>{t(': ', ' : ')}{t('multi-turn, reasoning models, French & English, on a resident GPU KV cache.', 'multi-tours, modèles à raisonnement, français & anglais, sur un cache KV résident en GPU.')}</li>
            <li><strong>{t('Vision', 'Vision')}</strong>{t(': ', ' : ')}{t('attach an image and ask about it (Qwen2-VL, desktop).', 'joignez une image et posez vos questions (Qwen2-VL, sur ordinateur).')}</li>
            <li><strong>{t('Images', 'Images')}</strong>{t(': ', ' : ')}{t('text-to-image in the tab (SD-Turbo / SDXS with a WebGPU diffusion stack).', 'texte vers image dans l’onglet (SD-Turbo / SDXS sur une pile de diffusion WebGPU).')}</li>
            <li><strong>{t('Video (beta)', 'Vidéo (bêta)')}</strong>{t(': ', ' : ')}{t('short animated clips from a prompt, on the same kernels.', 'de courts clips animés depuis un prompt, sur les mêmes kernels.')}</li>
          </ul>
        </section>
      </main>

      <footer className="lp-footer">
        <nav className="lp-footer-links" aria-label={t('Footer', 'Pied de page')}>
          <Link href={href('/chat')}>{t('Chat', 'Chat')}</Link>
          <Link href={href('/docs')}>{t('Documentation', 'Documentation')}</Link>
          <Link href={href('/local-ai')}>SDK</Link>
          <Link href={href('/cli')}>CLI</Link>
          {/* La comparaison mesurée : c'est la question que se pose tout visiteur qui connaît
              déjà WebLLM, et la porte d'entrée SEO sur « run an LLM in the browser ». */}
          <Link href={href('/vs-webllm')}>{t('vs WebLLM', 'vs WebLLM')}</Link>
          <Link href={href('/convert')}>{t('Converter', 'Convertisseur')}</Link>
          <Link href={href('/changelog')}>Changelog</Link>
          <a href="https://huggingface.co/romainkh14" target="_blank" rel="noopener noreferrer">{t('Models', 'Modèles')}</a>
          <a href="https://github.com/RomainKH/Brimkern" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
        <ByLine />
      </footer>
    </div>
  </div>
  );
}
