"use client";

// Fumée néon derrière le hero de /cli — demande explicite de Romain (2026-09-23 : « du wow,
// futuriste, des néons, de la fumée »). Exception VOULUE à la sobriété de la landing, limitée à
// cette page produit sombre.
//
// Pourquoi un shader et pas des dégradés CSS : c'est un produit qui fait calculer le GPU, la fumée
// est littéralement calculée par votre GPU ; et un bruit fbm à domaine déformé donne des volutes
// qui bougent comme une fumée, ce qu'aucun dégradé ne fait.
// Suit le défilement (demande de Romain) : toile FIXE plein écran, et le défilement entre dans le
// shader (`scroll`) — la fumée dérive vers le haut quand on descend, au lieu d'un décor collé au hero.
// Garde-fous :
// - au plus 40 % de la résolution CSS et ~220 000 pixels, 4 octaves, ~24 i/s ;
// - arrêt quand l'onglet est caché ; kill-switch ?fx=0 (témoin des bancs, convention du dépôt) ;
// - prefers-reduced-motion : UNE image fixe, aucune animation ;
// - luminosité plafonnée dans le shader : le texte papier garde son contraste au pire endroit ;
// - pas de WebGL → rien (le fond d'encre suffit), jamais d'erreur à l'écran.

import { useEffect, useRef } from 'react';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// fbm à domaine déformé (Quilez) : deux couches de bruit qui se tordent l'une l'autre.
const FRAG = `precision mediump float;
uniform vec2 res; uniform float t; uniform float scroll;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int k = 0; k < 4; k++){ v += a*n(p); p = p*2.03 + 7.1; a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / res;
  // Parallaxe douce en profondeur : la fumée flotte en arrière-plan sans distorsion ni à-coup.
  vec2 p = uv * vec2(res.x/res.y, 1.0) * 2.2 + vec2(0.0, -scroll * 0.35);
  float s = t * 0.045;
  vec2 q = vec2(fbm(p + vec2(0.0, s)), fbm(p + vec2(5.2, -s*0.8)));
  vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2) + s*1.3), fbm(p + 3.0*q + vec2(8.3, 2.8) - s));
  float f = fbm(p + 2.6*r);

  // Transition continue et douce entre le hero et le corps de page (aucun seuil brutal)
  float inPage = smoothstep(0.1, 1.0, scroll);
  float rise = mix(smoothstep(1.2, 0.0, uv.y), 0.75, inPage);
  float d = smoothstep(0.28, 0.90, f) * rise;

  // Zone de texte (colonne gauche sur grand écran) : atténuation douce sans écrêtage dur
  float wide = step(900.0, res.x / 0.5);
  float textZone = mix(1.0, smoothstep(0.80, 0.40, uv.x), wide);

  // Atténuation continue du gain : évite le min() qui rabotait brutalement les volutes lumineuses
  float gain = mix(mix(0.68, 0.28, textZone), 0.28, inPage);

  vec3 ink = vec3(0.051, 0.051, 0.047);
  vec3 red = vec3(0.94, 0.27, 0.27);
  vec3 cyan = vec3(0.22, 0.74, 0.97);

  // Rouge carmin dominant, contre-jour froid dans les replis : dégradés continus sans clipping
  vec3 col = ink + red * (d * gain) + cyan * (smoothstep(0.5, 0.9, r.x) * d * gain * 0.40);

  gl_FragColor = vec4(col, 1.0);
}`;

export default function Smoke({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (new URLSearchParams(window.location.search).get('fx') === '0') { canvas.style.display = 'none'; return; }
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'res');
    const uT = gl.getUniformLocation(prog, 't');
    const uScroll = gl.getUniformLocation(prog, 'scroll');
    // Coût CONSTANT : au plus ~220 000 pixels calculés, quel que soit l'écran (un 5K coûte ce que
    // coûte un portable) ; le flou de la fumée masque l'agrandissement.
    const MAX_PIXELS = 220_000;
    const resize = () => {
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      const scale = Math.min(0.4, Math.sqrt(MAX_PIXELS / Math.max(1, cw * ch)));
      const w = Math.max(1, Math.round(cw * scale));
      const h = Math.max(1, Math.round(ch * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    let currentScroll = typeof window !== 'undefined' ? window.scrollY / Math.max(1, window.innerHeight) : 0;
    const draw = (sec: number, scrollVal: number) => {
      gl.uniform1f(uT, sec);
      gl.uniform1f(uScroll, scrollVal);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { draw(12, currentScroll); return; }

    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      if (document.hidden) { raf = 0; return; } // reprend à visibilitychange
      raf = requestAnimationFrame(loop);
      const targetScroll = window.scrollY / Math.max(1, window.innerHeight);
      const moving = Math.abs(targetScroll - currentScroll) > 0.0005;
      // Fluidité maximale au défilement (60/120 i/s) ; cadence allégée (~30 i/s) uniquement au repos complet
      const minInterval = moving ? 0 : 32;
      if (now - last < minInterval) return;
      last = now;
      // Lissage réactif : suit immédiatement le défilement sans décalage temporel
      currentScroll += (targetScroll - currentScroll) * 0.22;
      draw((now - t0) / 1000 + 12, currentScroll);
    };
    const onVis = () => { if (!document.hidden && !raf) raf = requestAnimationFrame(loop); };
    const onScroll = () => { if (!document.hidden && !raf) raf = requestAnimationFrame(loop); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
