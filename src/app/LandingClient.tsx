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
import Image from 'next/image';
// Import STATIQUE (et non un chemin dans /public) : Next en déduit les dimensions et fabrique un
// flou de chargement, donc pas de saut de mise en page ni de valeurs à tenir à jour à la main.
import chatShot from './chat-shot.png';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useT, useLocale, useHref } from '@/lib/i18n';
import { parseDeeplink, parseModelInput } from '@/lib/deeplink';
import { metric, metricOnce } from '@/lib/metrics';
import { SDK_URL } from '@/lib/site';
import HfModelInput from './HfModelInput';
import GithubMark from './GithubMark';
import ByLine from './ByLine';
import ThemeToggle from './ThemeToggle';

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
  useEffect(() => {
    let alive = true;
    const set = (v: boolean) => { if (alive) setGpuOk(v); };
    const forced = new URLSearchParams(window.location.search).get('webgpu') === '0';
    const gpu = forced ? undefined : (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    if (!gpu) { queueMicrotask(() => set(false)); return () => { alive = false; }; }
    gpu.requestAdapter().then((a) => set(!!a)).catch(() => set(false));
    return () => { alive = false; };
  }, []);

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
    <div className="lp">
      <header className="lp-nav">
        <Link href={href('/')} className="lp-brand" aria-label="Brimkern">
          <svg width="26" height="26" viewBox="0 0 100 100" aria-hidden>
            <defs><clipPath id="lp-kern" clipPathUnits="userSpaceOnUse"><path clipRule="evenodd" d="M0 0H100V100H0Z M62 -10 L34 112 L46 112 L74 -10 Z" /></clipPath></defs>
            <text x="50" y="86" textAnchor="middle" fontFamily="var(--font-heading), Georgia, serif" fontSize="100" fontWeight="900" fill="currentColor" clipPath="url(#lp-kern)">B</text>
          </svg>
          <span>Brimkern</span>
        </Link>
        <nav className="lp-nav-links" aria-label={t('Main', 'Principale')}>
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
          {/* Le thème se règle ici aussi : il ne se réglait QUE dans l'en-tête du chat, alors que la
              landing est la première page vue. Volontairement à côté de la langue — ce sont les deux
              mêmes préférences d'affichage, et elles restent visibles sur mobile (contrairement à
              .lp-nav-icon, masquée sous 1000 px). */}
          <ThemeToggle size={16} />
          <Link href={href('/chat')} className="btn btn-primary lp-nav-cta">{t('Open the chat', 'Ouvrir le chat')}</Link>
        </nav>
      </header>

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────────────────────────── */}
        {/* Pas d'effet de fond derrière le hero : deux tentatives (trame de demi-ton WebGPU, puis
            lavis d'encre) ont été retirées sur décision de Romain — la page reste du papier nu. */}
        <section className="lp-hero">
          <div className="lp-eyebrow">{t('WebGPU · hand-written WGSL · nothing leaves the tab', 'WebGPU · WGSL écrit à la main · rien ne sort de l’onglet')}</div>
          <h1 className="lp-h1">
            {t('Any model on the Hub.', 'N’importe quel modèle du Hub.')}<br />
            <span className="lp-h1-accent">{t('Running in your browser.', 'Exécuté dans votre navigateur.')}</span>
          </h1>
          <p className="lp-lede">
            {t('Brimkern reads single-file GGUF straight from Hugging Face and runs it on your own GPU: no conversion, no compile step, no server, no API key. The weights stream in once, stay on your device, and work offline afterwards.',
               'Brimkern lit les GGUF mono-fichier directement depuis Hugging Face et les exécute sur votre propre GPU : sans conversion, sans étape de compilation, sans serveur, sans clé d’API. Les poids arrivent une fois, restent chez vous, et fonctionnent hors-ligne ensuite.')}
          </p>
          <div className="lp-cta-row">
            <Link
              href={`${href('/chat')}?start=1`}
              className="btn btn-primary lp-cta"
              onClick={() => metric('landing_cta', { webgpu: gpuOk ?? 'inconnu' })}
            >
              <Sparkles size={15} /> {t('Try it now: 149 MB', 'Essayer maintenant: 149 Mo')}
            </Link>
            <Link href={href('/docs')} className="lp-cta-ghost">
              {t('Read the docs', 'Lire la doc')} <ArrowRight size={14} />
            </Link>
          </div>
          {gpuOk === false ? (
            /* Dit AVANT le clic, pas après : sans WebGPU aucun modèle ne peut tourner ici, et le
               chemin de sortie (ouvrir dans un vrai navigateur) tient en une phrase. Le CTA reste
               cliquable — l'application a son propre écran dédié, plus détaillé. */
            <p className="lp-fineprint lp-warn">
              <AlertCircle size={13} />
              <span>
                {t('This browser has no WebGPU, so nothing can run here. Open the page in Chrome or Edge (from an in-app browser: “Open in browser”).',
                   'Ce navigateur n’a pas WebGPU : rien ne peut s’exécuter ici. Ouvrez la page dans Chrome ou Edge (depuis un navigateur intégré : « Ouvrir dans le navigateur »).')}
              </span>
            </p>
          ) : (
            <p className="lp-fineprint">
              {t('Chrome, Edge, or Safari 18+. Free, open source (MIT), no account.',
                 'Chrome, Edge, ou Safari 18+. Gratuit, open source (MIT), sans compte.')}
            </p>
          )}
        </section>

        {/* ── LE GESTE DU PRODUIT ──────────────────────────────────────────────────────────────
            Ce qu'aucune capture ne montre : on colle un identifiant de dépôt, et ça tourne. Le
            panneau raconte la séquence, le champ en dessous la déclenche pour de vrai. */}
        <section className="lp-console-wrap">
          <div className="lp-console">
            <div className="lp-console-bar">
              <span className="lp-dots" aria-hidden><i /><i /><i /></span>
              {t('paste a model: the Hub hosts tens of thousands', 'collez un modèle : le Hub en héberge des dizaines de milliers')}
            </div>
            {/* La console SE TAPE toute seule, en CSS pur : `width` animée en `steps()` sur une police
                à chasse fixe pour la frappe, puis un fondu par ligne. Pourquoi pas de JS : le texte
                final est déjà dans le HTML servi (donc identique au rendu serveur, indexable, et sans
                risque de désaccord d'hydratation): l'animation ne fait que le dévoiler. Un visiteur
                qui a demandé moins d'animations voit l'état final tout de suite (prefers-reduced-motion).
                tabIndex : le bloc défile horizontalement sur écran étroit — sans focus clavier son
                contenu serait inatteignable autrement qu'à la souris (règle axe). */}
            <div tabIndex={0} className="lp-console-body" role="img"
                 aria-label={t('Terminal: pasting the model Qwen/Qwen3-0.6B-GGUF resolves it to Qwen3-0.6B-Q4_K_M.gguf, streams it by HTTP ranges, reads its tokenizer from the file, and runs it on your GPU.',
                               'Terminal : coller le modèle Qwen/Qwen3-0.6B-GGUF le résout en Qwen3-0.6B-Q4_K_M.gguf, le streame par plages HTTP, lit son tokenizer dans le fichier et l’exécute sur votre GPU.')}>
              <div className="lp-line lp-cmd" aria-hidden>
                <span className="lp-prompt">›</span>
                <span className="lp-type">Qwen/Qwen3-0.6B-GGUF</span>
                <span className="lp-caret">▌</span>
              </div>
              {([
                ['✓', t('resolved', 'résolu'), 'Qwen3-0.6B-Q4_K_M.gguf'],
                ['✓', t('streamed', 'streamé'), t('HTTP ranges · resumable · cached on device', 'plages HTTP · reprise · gardé sur l’appareil')],
                ['✓', t('tokenizer', 'tokenizer'), t('read from the file: nothing to configure', 'lu dans le fichier : rien à régler')],
                ['▸', t('running', 'exécution'), t('on your GPU, in this tab', 'sur votre GPU, dans cet onglet')],
              ] as [string, string, string][]).map(([mark, label, value], i) => (
                <div key={label} className="lp-line lp-step" style={{ '--d': `${1.15 + i * 0.3}s` } as React.CSSProperties} aria-hidden>
                  <span className={mark === '✓' ? 'lp-mark-ok' : 'lp-mark-run'}>{mark}</span>
                  <span className="lp-key">{label}</span>
                  <span className="lp-val">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-console-input">
            <HfModelInput onLoad={goToChatWith} examples={HF_EXAMPLES} compact />
          </div>
        </section>

        {/* ── LA PREUVE ────────────────────────────────────────────────────────────────────────
            Après avoir dit « ça tourne dans l'onglet », le montrer : une vraie session, avec ses
            mesures affichées. Capture prise sur un build de production, rien mis en scène.
            `loading="lazy"` + dimensions explicites : elle est sous la ligne de flottaison et ne
            doit ni retarder le premier rendu, ni faire sauter la mise en page en arrivant. */}
        <section className="lp-proof">
          <figure className="lp-shot">
            <Image
              src={chatShot}
              placeholder="blur"
              sizes="(max-width: 1028px) 100vw, 980px"
              alt={t('The Brimkern chat: a Qwen 2.5 0.5B answering a question about WebGPU, with its measured throughput underneath. 460 tokens/s prefill, 47.5 tokens/s decode.',
                     'Le chat Brimkern : un Qwen 2.5 0.5B répond à une question sur WebGPU, avec ses mesures en dessous. 460 tokens/s de prefill, 47,5 tokens/s de décodage.')}
            />
            <figcaption>
              {t('A real session, on a laptop GPU. Every reply carries its own measurements: nothing here is estimated.',
                 'Une vraie session, sur le GPU d’un portable. Chaque réponse porte ses mesures : rien ici n’est estimé.')}
            </figcaption>
          </figure>
        </section>

        {/* ── LES FORCES ───────────────────────────────────────────────────────────────────────── */}
        <section className="lp-section">
          {/* Un h2 ici n'est pas décoratif : sans lui les trois forces (h3) suivaient directement le
              h1, et l'ordre des titres sautait un niveau : un lecteur d'écran annonce alors une
              hiérarchie fausse (relevé axe-core, règle heading-order). */}
          <div className="lp-eyebrow">{t('why it exists', 'pourquoi ça existe')}</div>
          <h2 className="lp-h2">{t('Three things you won’t find together elsewhere', 'Trois choses qu’on ne trouve pas ensemble ailleurs')}</h2>
          <div className="lp-strengths">
            <Strength i={0} eyebrow={t('no compile step', 'aucune compilation')} title={t('The format the Hub already hosts', 'Le format que le Hub héberge déjà')}>
              {t('Paste author/model and it runs. The best quantization is picked for you, the tokenizer comes from the file. Other in-browser engines need weights pre-compiled into their own artifact before they can touch them.',
                 'Collez auteur/modèle et ça tourne. La meilleure quantification est choisie pour vous, le tokenizer vient du fichier. Les autres moteurs navigateur exigent des poids pré-compilés dans leur propre format avant de pouvoir y toucher.')}
            </Strength>
            <Strength i={1} eyebrow={t('kernels we wrote', 'des kernels écrits à la main')} title={t('WGSL, validated at load', 'WGSL, validé au chargement')}>
              {t('The forward pass is hand-written compute shaders: fused quantized matmuls, resident KV cache, one kernel library shared by text, vision, image and video. Each one self-validates against a CPU reference at load and falls back to a simpler path if a GPU miscompiles.',
                 'Le forward pass est fait de compute shaders écrits à la main : matmuls quantifiés fusionnés, cache KV résident, une seule bibliothèque de kernels pour le texte, la vision, l’image et la vidéo. Chacun se valide contre une référence CPU au chargement, et retombe sur un chemin plus simple si un GPU compile mal.')}
            </Strength>
            <Strength i={2} eyebrow={t('streamed, not downloaded', 'streamé, pas téléchargé')} title={t('.brik: a layer is one HTTP range', '.brik : une couche = une plage HTTP')}>
              {t('Our container stores weights already quantized in the exact layout the kernels read, laid out so each layer is one contiguous range. A 4.7 GB model comes back from cache in 15.8 s: resumable, partial, genuinely offline afterwards.',
                 'Notre conteneur range les poids déjà quantifiés dans la disposition exacte que lisent les kernels, une couche par plage contiguë. Un modèle de 4,7 Go revient du cache en 15,8 s : reprise possible, partielle, vraiment hors-ligne ensuite.')}
            </Strength>
          </div>
          {/* Le visiteur qui connaît déjà WebLLM se pose la question tout de suite — on l'emmène
              vers la comparaison chiffrée au lieu de la laisser sans réponse (et c'est le lien
              interne qui fait vivre cette page côté moteurs). */}
          <p className="lp-fineprint" style={{ marginTop: 18 }}>
            <Link href={href('/vs-webllm')} className="lp-cta-ghost">
              {t('How this compares to WebLLM, measured', 'Ce que ça donne face à WebLLM, mesuré')} <ArrowRight size={13} />
            </Link>
          </p>
        </section>

        {/* ── LE MÉCANISME ─────────────────────────────────────────────────────────────────────
            « Une couche = une plage HTTP » ne se comprend pas dans un paragraphe : on le DESSINE.
            Le schéma est fait de DOM (texte + un SVG de la découpe), pas d'une grosse image : il se
            traduit, il se lit au lecteur d'écran, il s'empile sur mobile, et il ne pèse rien. */}
        <section className="lp-section">
          <div className="lp-eyebrow">{t('what actually happens', 'ce qui se passe vraiment')}</div>
          <h2 className="lp-h2">{t('From a repo name to tokens on your GPU', 'D’un nom de dépôt à des tokens sur votre GPU')}</h2>
          <ol className="lp-flow">
            {([
              ['01', t('You paste', 'Vous collez'), <code key="c">author/model</code>,
               t('An id, a Hub URL, or a direct link.', 'Un identifiant, une URL du Hub, ou un lien direct.')],
              ['02', t('We resolve', 'On résout'), t('the best file', 'le meilleur fichier'),
               t('The Hub API lists the repo; the best quantization wins (a .brik over a GGUF).', 'L’API du Hub liste le dépôt ; la meilleure quantification gagne (un .brik devant un GGUF).')],
              ['03', t('It streams', 'Ça streame'), t('one layer = one range', 'une couche = une plage'),
               t('Only the bytes of the layer being loaded, resumable, cached on your device.', 'Seulement les octets de la couche en cours, reprise possible, gardés sur votre appareil.')],
              ['04', t('It runs', 'Ça tourne'), t('on your GPU', 'sur votre GPU'),
               t('Hand-written WGSL kernels. Nothing goes back out: there is no server to send it to.', 'Des kernels WGSL écrits à la main. Rien ne repart : il n’y a aucun serveur où l’envoyer.')],
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
            <span className="lp-slices-label">{t('the file', 'le fichier')}</span>
            <svg viewBox="0 0 600 34" preserveAspectRatio="none" className="lp-slices-svg">
              {Array.from({ length: 14 }, (_, i) => (
                <rect key={i} x={i * 43 + 1} y={i % 3 === 1 ? 4 : 9} width={40} height={i % 3 === 1 ? 26 : 16}
                      rx={3} fill={i % 3 === 1 ? 'var(--accent)' : 'var(--border-color)'}
                      style={{ '--i': i } as React.CSSProperties} />
              ))}
            </svg>
            <span className="lp-slices-label">{t('the layers being loaded', 'les couches en cours de chargement')}</span>
          </div>
        </section>

        {/* ── LES CHIFFRES ─────────────────────────────────────────────────────────────────────
            Tous mesurés (banc décrit dans le README) : aucune estimation sur cette page. */}
        <section className="lp-figures">
          <Figure i={0} value="149 MB" label={t('smallest chat model, cached once', 'plus petit modèle de chat, mis en cache une fois')} />
          <Figure i={1} value="47.2 tok/s" label={t('prefill on a 7B int4 (WebLLM: 18.7)', 'prefill sur un 7B int4 (WebLLM : 18,7)')} />
          <Figure i={2} value="15.8 s" label={t('to reload 4.7 GB from cache', 'pour recharger 4,7 Go depuis le cache')} />
          <Figure i={3} value="0" label={t('servers, accounts, API keys', 'serveur, compte, clé d’API')} />
        </section>

        {/* ── LE SDK ───────────────────────────────────────────────────────────────────────────── */}
        {/* Panneau ENCRE : toute la page est en papier, et une page d'un seul ton finit par se lire
            comme un document. Ce bloc-ci est celui qui parle de code — le fond sombre est aussi
            l'endroit naturel pour un extrait. Contrastes repris du thème sombre, déjà validés. */}
        <section className="lp-section lp-sdk lp-ink">
          <div>
            <div className="lp-eyebrow">{t('for your own product', 'pour votre produit')}</div>
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

        {/* ── LES PORTES ───────────────────────────────────────────────────────────────────────── */}
        <section className="lp-section">
          <div className="lp-eyebrow">{t('also in the box', 'aussi dans la boîte')}</div>
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
  );
}
