"use client";

// LA TRAME VIVANTE DU HERO — un vrai shader WebGPU derrière le titre.
//
// Pourquoi elle existe, alors que le fond pointillé qui suivait la souris a été RETIRÉ au refactor
// (« du mouvement qui n'apprend rien au lecteur ») : celle-ci n'est pas un décor, c'est la
// DÉMONSTRATION. La page promet « votre GPU exécute des modèles » — cette trame est rendue par un
// fragment shader WGSL sur le GPU du visiteur, avant tout clic, et une ligne le dit sous le hero.
// C'est la même famille de preuve que les chiffres mesurés : rien d'affirmé qui ne soit exécuté.
//
// Le dessin reste dans la langue de la page (spécimen d'imprimeur) : une trame de POINTS DE DEMI-TON
// aux couleurs du thème (--dot), qui respire lentement, et que le curseur repousse comme une loupe
// dans l'encre — les points gonflent et rougissent (--accent) autour de lui.
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

// Trame de demi-ton plein écran : un triangle qui couvre tout, le fragment shader fait le reste.
// Les rayons sont en pixels PHYSIQUES (fragPos l'est) — d'où le facteur dpr sur toutes les distances.
const WGSL = /* wgsl */ `
struct U {
  res:    vec2f,  // taille du canvas (px physiques)
  mouse:  vec2f,  // curseur lissé (px physiques)
  t:      f32,    // secondes
  mouseIn:f32,    // présence du curseur, 0..1 (amortie côté JS)
  cell:   f32,    // pas de la trame (px physiques)
  dpr:    f32,
  base:   vec4f,  // couleur des points au repos (rgb + alpha max)
  accent: vec4f,  // couleur au voisinage du curseur
}
@group(0) @binding(0) var<uniform> u: U;

@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(3.0, 1.0), vec2f(-1.0, 1.0));
  return vec4f(p[i], 0.0, 1.0);
}

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

@fragment fn fs(@builtin(position) fragPos: vec4f) -> @location(0) vec4f {
  let px = fragPos.xy;

  // Répulsion : on échantillonne la trame en AMONT du déplacement, donc les points semblent
  // s'écarter du curseur (l'encre chassée par la loupe), et reviennent d'eux-mêmes (le lissage
  // du curseur côté JS fait l'inertie).
  let toMouse = px - u.mouse;
  let dm = length(toMouse);
  let reach = 210.0 * u.dpr;
  let swell = smoothstep(reach, 0.0, dm) * u.mouseIn;
  let dir = toMouse / max(dm, 0.001);
  let q = px - dir * swell * 9.0 * u.dpr;

  let id = floor(q / u.cell);
  let center = (id + 0.5) * u.cell;
  let h = hash(id);

  // Respiration : chaque point à sa phase, plus une onde lente qui traverse la nappe en diagonale
  // (c'est elle qu'on voit au doigt, sans curseur).
  let breathe = 0.5 + 0.5 * sin(u.t * 0.9 + h * 6.2831);
  let wave = 0.5 + 0.5 * sin(u.t * 0.55 + (id.x + id.y) * 0.32);
  var r = u.cell * (0.055 + 0.055 * breathe * 0.45 + 0.055 * wave * 0.55);

  // Le gonflement au curseur, recalculé au point ÉCHANTILLONNÉ pour suivre la répulsion.
  let swellQ = smoothstep(reach, 0.0, distance(center, u.mouse)) * u.mouseIn;
  r += swellQ * u.cell * 0.30;

  let dd = distance(q, center);
  let cover = smoothstep(r + 0.75 * u.dpr, r - 0.75 * u.dpr, dd);

  let tint = clamp(swellQ * 1.5, 0.0, 1.0);
  let rgb = mix(u.base.rgb, u.accent.rgb, tint);
  let a = cover * mix(u.base.a, u.accent.a, tint);
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
          u[6] = 22 * dpr; // pas de la trame (px CSS → physiques)
          u[7] = dpr;
          u[8] = base[0]; u[9] = base[1]; u[10] = base[2]; u[11] = 0.55;
          u[12] = accent[0]; u[13] = accent[1]; u[14] = accent[2]; u[15] = 0.8;
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
          {t('This halftone field is being rendered by your GPU right now — a WGSL shader, live in this tab.',
             'Cette trame est rendue par votre GPU en ce moment même — un shader WGSL, en direct dans cet onglet.')}
        </p>
      )}
    </>
  );
}
