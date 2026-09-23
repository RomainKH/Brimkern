"use client";

// Fumée néon derrière le hero de /cli — demande explicite de Romain (2026-09-23 : « du wow,
// futuriste, des néons, de la fumée »). Exception VOULUE à la sobriété de la landing, limitée à
// cette page produit sombre.
//
// Pourquoi un shader et pas des dégradés CSS : c'est un produit qui fait calculer le GPU, la fumée
// est littéralement calculée par votre GPU ; et un bruit fbm à domaine déformé donne des volutes
// qui bougent comme une fumée, ce qu'aucun dégradé ne fait.
// Garde-fous :
// - demi-résolution (le flou naturel de la fumée cache le sous-échantillonnage), ~30 i/s ;
// - arrêt quand le hero sort de l'écran ou que l'onglet est caché ;
// - prefers-reduced-motion : UNE image fixe, aucune animation ;
// - luminosité plafonnée dans le shader : le texte papier garde son contraste au pire endroit ;
// - pas de WebGL → rien (le fond d'encre suffit), jamais d'erreur à l'écran.

import { useEffect, useRef } from 'react';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// fbm à domaine déformé (Quilez) : deux couches de bruit qui se tordent l'une l'autre.
const FRAG = `precision mediump float;
uniform vec2 res; uniform float t;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int k = 0; k < 5; k++){ v += a*n(p); p = p*2.03 + 7.1; a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / res; vec2 p = uv * vec2(res.x/res.y, 1.0) * 2.2;
  float s = t * 0.045;
  vec2 q = vec2(fbm(p + vec2(0.0, s)), fbm(p + vec2(5.2, -s*0.8)));
  vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2) + s*1.3), fbm(p + 3.0*q + vec2(8.3, 2.8) - s));
  float f = fbm(p + 2.6*r);
  // La fumée monte du bas et se dissipe vers le haut.
  float rise = smoothstep(1.1, 0.0, uv.y);
  float d = smoothstep(0.30, 0.92, f) * rise;
  // Zone du texte (colonne de gauche sur grand écran, toute la largeur sur téléphone) : fumée
  // retenue. Ailleurs, elle a le droit d'être dense : c'est là qu'elle fait le « wow ».
  float wide = step(900.0, res.x / 0.5);
  float textZone = mix(1.0, smoothstep(0.78, 0.42, uv.x), wide);
  vec3 ink = vec3(0.051, 0.051, 0.047);
  vec3 red = vec3(0.94, 0.27, 0.27);
  vec3 cyan = vec3(0.22, 0.74, 0.97);
  float gain = mix(1.25, 0.32, textZone);
  // Rouge carmin dominant, contre-jour froid dans les replis (r.x) : le néon bicolore.
  vec3 col = ink + red * d * gain + cyan * smoothstep(0.5, 0.9, r.x) * d * gain * 0.42;
  // Plafonds : derrière le texte ~#491c19 (papier > 11:1, texte atténué > 5.6:1) ; ailleurs
  // plus haut, il n'y a rien à lire.
  vec3 capLow = vec3(0.29, 0.11, 0.10);
  vec3 capHigh = vec3(0.62, 0.22, 0.22);
  col = min(col, mix(capHigh, capLow, textZone));
  gl_FragColor = vec4(col, 1.0);
}`;

export default function Smoke({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
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

    const SCALE = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    const draw = (sec: number) => { gl.uniform1f(uT, sec); gl.drawArrays(gl.TRIANGLES, 0, 3); };

    resize();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { draw(12); return; }

    let raf = 0;
    let last = 0;
    let visible = true;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 33) return; // ~30 i/s
      last = now;
      draw((now - t0) / 1000 + 12);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
