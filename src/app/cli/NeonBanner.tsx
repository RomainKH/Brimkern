"use client";

// Bannière néon de /cli, PEINTE UNE FOIS dans des <canvas>. En CSS (quatre text-shadow flous sur
// ~500 glyphes), le navigateur recalculait les halos à chaque tuile qui revenait à l'écran : un
// défilement rapide vers le haut ramait (retour de Romain, 2026-09-23). Ici les halos sont
// dessinés au montage (et au changement de largeur seulement) ; défiler ne fait plus que déplacer
// des images. Les deux copies du glitch sont aussi des images, animées par transform/clip-path.
//
// Le <pre> invisible reste dans le flux : il donne la taille exacte (police et clamp() du CSS) et
// la police à utiliser, sans rien recalculer à la main.

import { useEffect, useRef } from 'react';

type Props = { text: string; className: string; neonClass: string; glitchA: string; glitchB: string; canvasClass: string };

export default function NeonBanner({ text, className, neonClass, glitchA, glitchB, canvasClass }: Props) {
  const sizer = useRef<HTMLPreElement | null>(null);
  const neon = useRef<HTMLCanvasElement | null>(null);
  const ga = useRef<HTMLCanvasElement | null>(null);
  const gb = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const pre = sizer.current;
    if (!pre) return;
    const lines = text.split('\n');
    let lastW = 0;

    const paint = () => {
      const rect = pre.getBoundingClientRect();
      const w = Math.round(rect.width);
      if (!w || w === lastW) return;
      lastW = w;
      const cs = getComputedStyle(pre);
      const fontSize = parseFloat(cs.fontSize);
      const lineH = parseFloat(cs.lineHeight) || fontSize * 1.06;
      const font = `${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const pad = 72; // le plus grand halo (64 px) ne doit pas être coupé au bord de la toile
      const cw = w + pad * 2, ch = Math.round(rect.height) + pad * 2;

      const draw = (cv: HTMLCanvasElement | null, fill: string, glow: boolean) => {
        if (!cv) return;
        cv.width = Math.round(cw * dpr);
        cv.height = Math.round(ch * dpr);
        cv.style.width = `${cw}px`;
        cv.style.height = `${ch}px`;
        cv.style.left = `${-pad}px`;
        cv.style.top = `${-pad}px`;
        const g = cv.getContext('2d');
        if (!g) return;
        g.scale(dpr, dpr);
        g.font = font;
        g.textBaseline = 'top';
        const drawLines = (dx: number) => lines.forEach((l, i) => g.fillText(l, pad + dx, pad + i * lineH));
        if (glow) {
          // Les QUATRE halos exacts de l'ancien text-shadow CSS (2 / 10 / 28 / 64 px, mêmes couleurs).
          // ⚠️ shadowBlur et shadowOffset sont en pixels PHYSIQUES : la mise à l'échelle dpr ne s'y
          // applique pas. Sans le « × dpr », chaque halo sortait deux fois plus étroit sur Retina — le
          // néon « moins bien » relevé par Romain. Chaque halo est peint seul : le texte est tiré hors
          // de la toile et seule son ombre, décalée d'autant, y revient.
          const off = cw + pad * 4;
          g.fillStyle = '#ff6b5e';
          for (const [blur, color] of [[64, 'rgba(239,68,68,0.35)'], [28, 'rgba(239,68,68,0.55)'], [10, 'rgba(239,68,68,0.85)'], [2, 'rgba(255,190,180,0.9)']] as [number, string][]) {
            g.shadowColor = color;
            g.shadowBlur = blur * dpr;
            g.shadowOffsetX = off * dpr;
            drawLines(-off);
          }
          g.shadowColor = 'transparent';
          g.shadowBlur = 0;
          g.shadowOffsetX = 0;
          drawLines(0);
        } else {
          g.fillStyle = fill;
          drawLines(0);
        }
      };
      draw(neon.current, '', true);
      draw(ga.current, 'rgba(56,189,248,0.7)', false);
      draw(gb.current, 'rgba(255,70,70,0.75)', false);
    };

    // La police web doit être chargée avant de peindre, sinon on figerait la police de repli.
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => { if (!cancelled) paint(); });
    const ro = new ResizeObserver(() => paint());
    ro.observe(pre);
    return () => { cancelled = true; ro.disconnect(); };
  }, [text]);

  return (
    <div className={className} aria-hidden="true">
      <pre ref={sizer} className={canvasClass} style={{ visibility: 'hidden' }}>{text}</pre>
      <canvas ref={neon} className={neonClass} />
      <canvas ref={ga} className={glitchA} />
      <canvas ref={gb} className={glitchB} />
    </div>
  );
}
