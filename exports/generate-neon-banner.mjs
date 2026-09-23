import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const EXPORTS_DIR = path.resolve('exports');

const BANNER = `██████╗ ██████╗ ██╗███╗   ███╗██╗  ██╗███████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║████╗ ████║██║ ██╔╝██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██╔████╔██║█████═╝ █████╗  ██████╔╝██╔██╗ ██║
██╔══██╗██╔══██╗██║██║╚██╔╝██║██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║
██████╔╝██║  ██║██║██║ ╚═╝ ██║██║ ╚██╗███████╗██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝`;

function generateBannerHtml({ withDetails = true, centered = false } = {}) {
  const paddingLeft = centered ? '0px' : '90px';
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    width: 1500px;
    height: 500px;
    overflow: hidden;
    background: #0d0c0b;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  canvas#smoke {
    position: absolute;
    inset: 0;
    width: 1500px;
    height: 500px;
    z-index: 1;
  }
  .overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-left: ${paddingLeft};
  }
  .prompt {
    font-family: ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace;
    font-size: 19px;
    color: rgba(236, 233, 225, 0.7);
    margin: 0 0 16px 0;
    letter-spacing: -0.2px;
  }
  .prompt b {
    color: #ef4444;
    font-weight: 700;
  }
  .cursor {
    display: inline-block;
    width: 9px;
    height: 1.1em;
    margin-left: 6px;
    vertical-align: text-bottom;
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
  }
  canvas#neon {
    position: relative;
    display: block;
  }
  .subtitle {
    margin-top: 20px;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.3px;
    color: #ece9e1;
    text-shadow: 0 2px 12px rgba(0,0,0,0.9);
  }
  .subtitle em {
    color: #ff6b5e;
    font-style: normal;
  }
  .badges {
    margin-top: 14px;
    display: flex;
    gap: 10px;
    font-family: ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace;
    font-size: 15px;
    color: #ef4444;
  }
  .badge {
    padding: 5px 12px;
    border-radius: 7px;
    border: 1px solid rgba(239, 68, 68, 0.4);
    background: rgba(13, 12, 11, 0.6);
    backdrop-filter: blur(8px);
  }
  .badge.solid {
    background: rgba(239, 68, 68, 0.16);
    border-color: rgba(239, 68, 68, 0.7);
    color: #ece9e1;
  }
  .top-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 7px;
    background: #ef4444;
    box-shadow: 0 0 16px #ef4444;
    z-index: 10;
  }
</style>
</head>
<body>
  <div class="top-line"></div>
  <canvas id="smoke" width="750" height="250"></canvas>

  <div class="overlay">
    ${withDetails ? `
    <div class="prompt">~/your-project <b>$</b> brimkern chat<span class="cursor"></span></div>
    ` : ''}

    <canvas id="neon"></canvas>

    ${withDetails ? `
    <div class="subtitle">Your coding assistant runs <em>on your GPU</em>, in your terminal.</div>
    <div class="badges">
      <div class="badge">WebGPU</div>
      <div class="badge">WGSL</div>
      <div class="badge">.brik</div>
      <div class="badge">100% local</div>
      <div class="badge solid">brimkern.com</div>
    </div>
    ` : `
    <div class="subtitle" style="font-size: 26px; margin-top: 26px; color: #ece9e1;">Local WebGPU inference · Real AI models in your browser</div>
    `}
  </div>

  <script>
    // 1. WebGL Smoke
    const canvas = document.getElementById('smoke');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) { console.error('WebGL not supported'); }
    else {
      const VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
      const FRAG = \`precision mediump float;
      uniform vec2 res; uniform float t;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int k = 0; k < 4; k++){ v += a*n(p); p = p*2.03 + 7.1; a *= 0.5; } return v; }
      void main(){
        vec2 uv = gl_FragCoord.xy / res;
        vec2 p = uv * vec2(res.x/res.y, 1.0) * 2.4;
        float s = t * 0.045;
        vec2 q = vec2(fbm(p + vec2(0.0, s)), fbm(p + vec2(5.2, -s*0.8)));
        vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2) + s*1.3), fbm(p + 3.0*q + vec2(8.3, 2.8) - s));
        float f = fbm(p + 2.6*r);
        float rise = smoothstep(1.1, 0.0, uv.y * 0.9);
        float d = smoothstep(0.28, 0.92, f) * rise;
        vec3 ink = vec3(0.05, 0.047, 0.045);
        vec3 red = vec3(0.96, 0.25, 0.25);
        vec3 cyan = vec3(0.22, 0.74, 0.97);
        float gain = 1.35;
        vec3 col = ink + red * d * gain + cyan * smoothstep(0.48, 0.9, r.x) * d * gain * 0.45;
        vec3 cap = vec3(0.55, 0.18, 0.18);
        col = min(col, cap);
        gl_FragColor = vec4(col, 1.0);
      }\`;

      const compile = (type, src) => {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        return sh;
      };
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(gl.getUniformLocation(prog, 'res'), 750, 250);
      gl.uniform1f(gl.getUniformLocation(prog, 't'), 24.5);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // 2. Neon BRIMKERN Canvas
    const BANNER_TEXT = ${JSON.stringify(BANNER)};
    const neon = document.getElementById('neon');
    const lines = BANNER_TEXT.split('\\n');
    const fontSize = ${withDetails ? 21.5 : 24};
    const lineH = fontSize * 1.06;
    const font = "900 " + fontSize + "px ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace";

    const dpr = 2;
    const pad = Math.ceil(fontSize * 3.5);
    const estW = 63 * fontSize * 0.61;
    const cw = Math.round(estW + pad * 2);
    const ch = Math.round(lines.length * lineH + pad * 2);

    neon.width = Math.round(cw * dpr);
    neon.height = Math.round(ch * dpr);
    neon.style.width = cw + "px";
    neon.style.height = ch + "px";

    const g = neon.getContext('2d');
    g.scale(dpr, dpr);
    g.font = font;
    g.textBaseline = 'top';

    const run = (color, blur, shadow) => {
      g.fillStyle = color;
      g.shadowColor = shadow;
      g.shadowBlur = blur;
      lines.forEach((l, i) => g.fillText(l, pad, pad + i * lineH));
    };

    // Glow layers
    run('rgba(239,68,68,0.40)', fontSize * 3.2, 'rgba(239,68,68,0.65)');
    run('rgba(239,68,68,0.65)', fontSize * 1.4, 'rgba(239,68,68,0.92)');
    run('#ff6b5e', fontSize * 0.38, 'rgba(255,200,190,0.95)');
    run('#fff0ee', 0, 'transparent');
  </script>
</body>
</html>`;
}

async function renderBanners() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--enable-webgl', '--use-gl=angle']
  });

  // 1. Rich version (prompt, badges, offset for avatar)
  {
    console.log('Rendering x-header-neon.png (rich version)...');
    const page = await browser.newPage({ viewport: { width: 1500, height: 500, deviceScaleFactor: 1 } });
    await page.setContent(generateBannerHtml({ withDetails: true, centered: false }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(EXPORTS_DIR, 'x-header-neon.png') });
    await page.close();
  }

  // 2. Pure minimal version (centered, massive BRIMKERN neon)
  {
    console.log('Rendering x-header-neon-pure.png (minimal version)...');
    const page = await browser.newPage({ viewport: { width: 1500, height: 500, deviceScaleFactor: 1 } });
    await page.setContent(generateBannerHtml({ withDetails: false, centered: true }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(EXPORTS_DIR, 'x-header-neon-pure.png') });
    await page.close();
  }

  await browser.close();
  console.log('Neon banners rendered successfully!');
}

renderBanners().catch(console.error);
