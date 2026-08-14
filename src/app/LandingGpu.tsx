"use client";

// LA TRAME VIVANTE DU HERO — un vrai shader WebGPU derrière le titre.
//
// Pourquoi elle existe, alors que le fond pointillé qui suivait la souris a été RETIRÉ au refactor
// (« du mouvement qui n'apprend rien au lecteur ») : celle-ci n'est pas un décor, c'est la
// DÉMONSTRATION. La page promet « votre GPU exécute des modèles » — cette trame est rendue par un
// fragment shader WGSL sur le GPU du visiteur, avant tout clic, et une ligne le dit sous le hero.
// C'est la même famille de preuve que les chiffres mesurés : rien d'affirmé qui ne soit exécuté.
//
// Le dessin reste dans la langue de la page (spécimen d'imprimeur) : un LAVIS D'ENCRE très dilué —
// des nappes douces aux tons du papier (--dot), qui dérivent à peine, et un halo discret au curseur
// qui les teinte vers l'accent. (Une première version en trame de demi-ton a été jugée trop
// présente par Romain — « plus sobre » : le lavis garde la preuve, sans le motif.)
//
// Garde-fous, sans lesquels ce serait une nuisance :
// - prefers-reduced-motion, absence de WebGPU, ou ?webgpu=0 → AUCUN canvas, page identique à avant ;
// - la boucle s'arrête quand l'onglet est caché ou le hero hors écran (rAF conditionné) ;
// - DPR plafonné à 1,5 (une trame floue à 1,5× est invisible, la facture GPU à 3× ne l'est pas) ;
// - l'effet souris n'existe qu'au pointeur fin (au doigt, la trame respire seule) ;
// - toute erreur d'init (device refusé, perte de contexte) → retrait silencieux, jamais de casse.

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/i18n';

// Même convention que src/lib/webgpu/kernels.ts : le repo ne dépend pas de @webgpu/types, les
// objets WebGPU sont manipulés non typés et les enums lus sur globalThis.
type GPUAny = any;
const G = globalThis as GPUAny;

// Lavis plein écran : un triangle qui couvre tout, le fragment shader fait le reste.
// Les distances sont en pixels PHYSIQUES (fragPos l'est) — d'où le facteur dpr partout.
const WGSL = /* wgsl */ `
struct U {
  res:    vec2f,  // taille du canvas (px physiques)
  mouse:  vec2f,  // curseur lissé (px physiques)
  t:      f32,    // secondes
  mouseIn:f32,    // présence du curseur, 0..1 (amortie côté JS)
  scale:  f32,    // taille des nappes (px physiques)
  dpr:    f32,
  base:   vec4f,  // couleur du lavis au repos (rgb + alpha PLAFOND — la sobriété se règle ici)
  accent: vec4f,  // teinte au voisinage du curseur
}
@group(0) @binding(0) var<uniform> u: U;

@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(3.0, 1.0), vec2f(-1.0, 1.0));
  return vec4f(p[i], 0.0, 1.0);
}

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

// Bruit de valeur lissé + 3 octaves : la matière du lavis. Pas de texture, pas de table — tout se
// calcule, le composant n'a rien à charger.
fn vnoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let s = f * f * (3.0 - 2.0 * f);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, s.x), mix(c, d, s.x), s.y);
}

fn fbm(p: vec2f) -> f32 {
  var v = 0.0;
  var amp = 0.5;
  var q = p;
  for (var o = 0; o < 3; o++) {
    v += amp * vnoise(q);
    q = q * 2.03 + vec2f(17.0, 9.0);
    amp *= 0.5;
  }
  return v;
}

@fragment fn fs(@builtin(position) fragPos: vec4f) -> @location(0) vec4f {
  let px = fragPos.xy;
  let uv = px / u.scale;

  // Dérive TRÈS lente + gauchissement de domaine : l'encre diffuse, elle ne défile pas.
  let drift = vec2f(u.t * 0.014, -u.t * 0.009);
  let w = fbm(uv * 1.6 + drift * 1.4);
  var n = fbm(uv + drift + vec2f(w, w) * 0.4);

  // Halo au curseur : il SOULÈVE doucement le lavis alentour (aucune forme dessinée, aucun bord).
  let halo = smoothstep(300.0 * u.dpr, 0.0, distance(px, u.mouse)) * u.mouseIn;
  n += halo * 0.18;

  // Seuil haut : seules les crêtes du bruit deviennent des nappes — beaucoup de papier nu,
  // c'est ce qui fait la sobriété.
  let wash = smoothstep(0.52, 0.98, n);

  let tint = clamp(halo * 1.1, 0.0, 1.0) * u.accent.a;
  let rgb = mix(u.base.rgb, u.accent.rgb, tint);
  let a = wash * u.base.a * (1.0 + tint * 0.5);
  return vec4f(rgb * a, a); // alpha prémultiplié (alphaMode: 'premultiplied')
}
`;

function cssColor(name: string): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = /^#?([0-9a-f]{6})$/i.exec(v);
  if (!m) return [0.5, 0.5, 0.5];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function LandingGpu() {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (new URLSearchParams(window.location.search).get('webgpu') === '0') return;
    const gpu = (navigator as Navigator & { gpu?: GPUAny }).gpu;
    if (!gpu) return;

    let dead = false;
    let raf = 0;
    let device: GPUAny = null;
    const cleanups: (() => void)[] = [];

    (async () => {
      try {
        const adapter = await gpu.requestAdapter();
        if (!adapter || dead) return;
        device = await adapter.requestDevice();
        if (dead) { device.destroy(); return; }
        const ctx = canvas.getContext('webgpu') as GPUAny;
        if (!ctx) return;
        const format = gpu.getPreferredCanvasFormat();
        ctx.configure({ device, format, alphaMode: 'premultiplied' });

        const shader = device.createShaderModule({ code: WGSL });
        const pipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: { module: shader, entryPoint: 'vs' },
          fragment: { module: shader, entryPoint: 'fs', targets: [{ format }] },
        });
        const ubuf = device.createBuffer({ size: 64, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
        const bind = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: ubuf } }],
        });

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const resize = () => {
          const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
          const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
          if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        cleanups.push(() => ro.disconnect());

        // Couleurs du thème, relues quand la classe de <html> change (le toggle pose html.dark).
        let base = cssColor('--dot');
        let accent = cssColor('--accent');
        const mo = new MutationObserver(() => { base = cssColor('--dot'); accent = cssColor('--accent'); });
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        cleanups.push(() => mo.disconnect());

        // Curseur : cible brute au pointermove, position LISSÉE par frame (l'inertie qui rend le
        // suivi organique — une valeur collée à la souris paraît mécanique). Pointeur fin seulement.
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const target = { x: -1e5, y: -1e5 };
        const cur = { x: -1e5, y: -1e5 };
        let presence = 0; // 0..1, amorti — l'effet s'éteint en douceur quand le curseur sort
        let present = false;
        if (fine) {
          const onMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            target.x = (e.clientX - rect.left) * dpr;
            target.y = (e.clientY - rect.top) * dpr;
            if (cur.x < -1e4) { cur.x = target.x; cur.y = target.y; } // pas de traversée depuis l'infini
            present = true;
          };
          const onLeave = () => { present = false; };
          window.addEventListener('pointermove', onMove, { passive: true });
          document.documentElement.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            window.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('pointerleave', onLeave);
          });
        }

        // La boucle ne tourne que si ça se voit : onglet visible ET hero dans la fenêtre.
        let inView = true;
        const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; wake(); });
        io.observe(canvas);
        cleanups.push(() => io.disconnect());
        const onVis = () => wake();
        document.addEventListener('visibilitychange', onVis);
        cleanups.push(() => document.removeEventListener('visibilitychange', onVis));

        const u = new Float32Array(16);
        const t0 = performance.now();
        const frame = () => {
          raf = 0;
          if (dead || !device) return;
          if (document.hidden || !inView) return; // wake() relancera
          resize();
          cur.x += (target.x - cur.x) * 0.10;
          cur.y += (target.y - cur.y) * 0.10;
          presence += ((present ? 1 : 0) - presence) * 0.06;

          u[0] = canvas.width; u[1] = canvas.height;
          u[2] = cur.x; u[3] = cur.y;
          u[4] = (performance.now() - t0) / 1000;
          u[5] = presence;
          u[6] = 460 * dpr; // taille des nappes (px CSS → physiques)
          u[7] = dpr;
          u[8] = base[0]; u[9] = base[1]; u[10] = base[2]; u[11] = 0.35;   // plafond d'alpha : la sobriété
          u[12] = accent[0]; u[13] = accent[1]; u[14] = accent[2]; u[15] = 0.5; // force max de la teinte au curseur
          device.queue.writeBuffer(ubuf, 0, u);

          const enc = device.createCommandEncoder();
          const pass = enc.beginRenderPass({
            colorAttachments: [{
              view: ctx.getCurrentTexture().createView(),
              loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 0 },
            }],
          });
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bind);
          pass.draw(3);
          pass.end();
          device.queue.submit([enc.finish()]);
          raf = requestAnimationFrame(frame);
        };
        const wake = () => { if (!raf && !dead) raf = requestAnimationFrame(frame); };

        device.lost.then(() => { if (!dead) setActive(false); });
        setActive(true); // déclenche le fondu CSS et la ligne de preuve
        wake();
      } catch {
        // Un GPU qui refuse le device ou compile mal → la page reste exactement celle d'avant.
        if (!dead) setActive(false);
      }
    })();

    return () => {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      device?.destroy();
    };
  }, []);

  return (
    <>
      {/* Décoratif au sens strict (le texte du hero dit tout) → aria-hidden, aucun rôle. */}
      <canvas ref={canvasRef} className="lp-gpu" data-ready={active || undefined} aria-hidden />
      {active && (
        <p className="lp-gpu-note">
          {t('This ink wash is being rendered by your GPU right now — a WGSL shader, live in this tab.',
             'Ce lavis d’encre est rendu par votre GPU en ce moment même — un shader WGSL, en direct dans cet onglet.')}
        </p>
      )}
    </>
  );
}
