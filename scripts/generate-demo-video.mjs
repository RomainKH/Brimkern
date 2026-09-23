import { chromium } from 'playwright-core';
import { resolve, join } from 'node:path';
import { existsSync, mkdirSync, renameSync, readdirSync, unlinkSync } from 'node:fs';

const OUT_DIR = resolve(process.cwd(), 'public', 'media');
if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

const TEMP_RECORD_DIR = resolve(process.cwd(), '.tmp-video-recordings');
if (!existsSync(TEMP_RECORD_DIR)) {
  mkdirSync(TEMP_RECORD_DIR, { recursive: true });
} else {
  for (const f of readdirSync(TEMP_RECORD_DIR)) {
    try { unlinkSync(join(TEMP_RECORD_DIR, f)); } catch {}
  }
}

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1280px;
    height: 720px;
    background: #0a0a0c;
    background-image: 
      radial-gradient(ellipse 65% 55% at 50% 45%, rgba(225, 29, 72, 0.12), transparent 75%),
      linear-gradient(180deg, #09090b 0%, #050507 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    overflow: hidden;
    color: #e4e4e7;
  }

  .window-wrap {
    width: 1040px;
    height: 580px;
    background: #0f1015;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 30px 80px -20px rgba(0, 0, 0, 0.85),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      0 0 40px rgba(225, 29, 72, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .titlebar {
    height: 38px;
    background: #14151b;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    padding: 0 14px;
    position: relative;
  }

  .traffic-lights {
    display: flex;
    gap: 8px;
  }
  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
  }
  .dot.red { background: #ff5f56; border: 1px solid #e0443e; }
  .dot.yellow { background: #ffbd2e; border: 1px solid #dea123; }
  .dot.green { background: #27c93f; border: 1px solid #1aab29; }

  .window-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: 500;
    color: #a1a1aa;
    letter-spacing: -0.01em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .window-title .badge {
    color: #e11d48;
    background: rgba(225, 29, 72, 0.15);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
  }

  .terminal-body {
    flex: 1;
    padding: 22px 26px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Code", monospace;
    font-size: 13.5px;
    line-height: 1.6;
    color: #f4f4f5;
    overflow-y: hidden;
    position: relative;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .cursor {
    display: inline-block;
    width: 8px;
    height: 15px;
    background: #e11d48;
    vertical-align: -2px;
    margin-left: 2px;
    animation: blink 0.8s infinite;
  }
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  .prompt-symbol { color: #e11d48; font-weight: bold; }
  .cmd-text { color: #ffffff; font-weight: 600; }
  .dim-text { color: #71717a; }
  .green-text { color: #10b981; }
  .yellow-text { color: #f59e0b; }
  .cyan-text { color: #06b6d4; }
  .code-keyword { color: #f43f5e; font-weight: 600; }
  .code-type { color: #38bdf8; }
  .code-func { color: #818cf8; }
  .code-str { color: #34d399; }
  .code-prop { color: #fbbf24; }

  .stats-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 3px 9px;
    border-radius: 6px;
    font-size: 11px;
    color: #a1a1aa;
    margin-top: 10px;
  }

  .outro-overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 12, 0.94);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    text-align: center;
  }
  .outro-overlay.show {
    opacity: 1;
  }
  .outro-title {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .outro-title span { color: #e11d48; }
  .outro-sub {
    font-size: 15px;
    color: #a1a1aa;
    margin-bottom: 22px;
  }
  .outro-links {
    display: flex;
    gap: 14px;
  }
  .outro-badge {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12.5px;
    color: #f4f4f5;
    font-family: ui-monospace, SFMono-Regular, monospace;
  }
</style>
</head>
<body>

<div class="window-wrap">
  <div class="titlebar">
    <div class="traffic-lights">
      <div class="dot red"></div>
      <div class="dot yellow"></div>
      <div class="dot green"></div>
    </div>
    <div class="window-title">
      brimkern ~ <span class="badge">WebGPU Dawn Metal</span>
    </div>
  </div>

  <div class="terminal-body" id="term"></div>

  <div class="outro-overlay" id="outro">
    <div class="outro-title">BRIM<span>KERN</span></div>
    <div class="outro-sub">Local WebGPU AI Engine · Zero Server · Pure WGSL</div>
    <div class="outro-links">
      <div class="outro-badge">curl -fsSL https://brimkern.com/install.sh | bash</div>
      <div class="outro-badge">brimkern.com</div>
      <div class="outro-badge">GitHub: RomainKH/Brimkern</div>
    </div>
  </div>
</div>

<script>
  const term = document.getElementById('term');
  const outro = document.getElementById('outro');

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  async function typeText(text, speed = 25) {
    for (let i = 0; i < text.length; i++) {
      term.innerHTML = term.innerHTML.replace('<span class="cursor"></span>', '') + text[i] + '<span class="cursor"></span>';
      await wait(speed);
    }
  }

  function appendHtml(html) {
    term.innerHTML = term.innerHTML.replace('<span class="cursor"></span>', '') + html + '<span class="cursor"></span>';
  }

  async function streamTokens(tokens, speed = 30) {
    for (const t of tokens) {
      term.innerHTML = term.innerHTML.replace('<span class="cursor"></span>', '') + t + '<span class="cursor"></span>';
      await wait(speed);
    }
  }

  async function runSimulation() {
    await wait(400);

    // 1. Install command
    appendHtml('<span class="prompt-symbol">~ $ </span>');
    await wait(300);
    await typeText('curl -fsSL https://brimkern.com/install.sh | bash', 28);
    await wait(250);

    appendHtml('\\n<span class="dim-text">▸ Fetching Brimkern WebGPU runtime...</span>\\n');
    await wait(220);
    appendHtml('<span class="green-text">✓ WebGPU WGSL engine initialized (Apple Silicon Metal)</span>\\n');
    await wait(200);
    appendHtml('<span class="green-text">✓ Installed to ~/.local/bin/brimkern</span>\\n\\n');
    await wait(350);

    // 2. Launch chat
    appendHtml('<span class="prompt-symbol">~ $ </span>');
    await wait(200);
    await typeText('brimkern chat', 35);
    await wait(250);

    appendHtml('\\n<span class="cyan-text">Brimkern CLI</span> — <span class="dim-text">Local WebGPU Inference (WGSL)</span>\\n');
    appendHtml('<span class="dim-text">▸ Model: Qwen 2.5 Coder 3B [Ready] · Privacy: 100% on-device</span>\\n\\n');
    await wait(300);

    // 3. User Prompt
    appendHtml('<span class="prompt-symbol">brimkern &gt; </span>');
    await wait(250);
    await typeText('Write a fast TypeScript memoize function', 30);
    await wait(300);

    appendHtml('\\n\\n');

    // 4. Stream code response
    const tokens = [
      'Here is an efficient, typed memoize function in TypeScript:\\n\\n',
      '<span class="code-keyword">function</span> <span class="code-func">memoize</span>&lt;<span class="code-type">T</span> <span class="code-keyword">extends</span> (...args: <span class="code-type">any</span>[]) =&gt; <span class="code-type">any</span>&gt;(fn: <span class="code-type">T</span>): <span class="code-type">T</span> {\\n',
      '  <span class="code-keyword">const</span> cache = <span class="code-keyword">new</span> <span class="code-type">Map</span>&lt;<span class="code-type">string</span>, <span class="code-type">ReturnType</span>&lt;<span class="code-type">T</span>&gt;&gt;();\\n',
      '  <span class="code-keyword">return</span> ((...args: <span class="code-type">any</span>[]) =&gt; {\\n',
      '    <span class="code-keyword">const</span> key = <span class="code-type">JSON</span>.<span class="code-func">stringify</span>(args);\\n',
      '    <span class="code-keyword">if</span> (cache.<span class="code-func">has</span>(key)) <span class="code-keyword">return</span> cache.<span class="code-func">get</span>(key)!;\\n',
      '    <span class="code-keyword">const</span> res = fn(...args);\\n',
      '    cache.<span class="code-func">set</span>(key, res);\\n',
      '    <span class="code-keyword">return</span> res;\\n',
      '  }) <span class="code-keyword">as</span> <span class="code-type">T</span>;\\n',
      '}\\n\\n',
      '<div class="stats-pill">⚡ 0.48s · ~35.4 tok/s · 68 tokens · 100% local WebGPU · $0.00 saved</div>\\n'
    ];

    await streamTokens(tokens, 50);
    await wait(1800);

    // 5. Outro card
    outro.classList.add('show');
  }

  window.addEventListener('load', runSimulation);
</script>

</body>
</html>
`;

async function generate() {
  console.log('Launching browser to record video...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: TEMP_RECORD_DIR,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();
  await page.setContent(htmlContent);

  // Attente que l'animation de 12 secondes se déroule entièrement
  console.log('Recording terminal animation (11.5 seconds)...');
  await page.waitForTimeout(11500);

  console.log('Finalizing recording...');
  await context.close();
  await browser.close();

  const files = readdirSync(TEMP_RECORD_DIR).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    throw new Error('No video recorded in temp directory');
  }

  const srcVideo = join(TEMP_RECORD_DIR, files[0]);
  const destVideo = join(OUT_DIR, 'brimkern-demo.webm');

  renameSync(srcVideo, destVideo);
  console.log(`✓ Demo video successfully generated at: ${destVideo}`);
}

generate().catch(err => {
  console.error('Error generating video:', err);
  process.exit(1);
});
