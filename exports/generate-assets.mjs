import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const EXPORTS_DIR = path.resolve('exports');

// 1. Mark geometry (canonique BrandMark.tsx)
const pins3 = 'M37 24 V15 M50 24 V13 M63 24 V15 M37 76 V85 M50 76 V87 M63 76 V85 M24 37 H15 M24 50 H13 M24 63 H15 M76 37 H85 M76 50 H87 M76 63 H85';

function getMarkSvgInner({
  stroke = '#ece9e1',
  accent = '#d9463a',
  strokeWidth = 5.5,
  scale = 1,
} = {}) {
  const transform = scale !== 1
    ? `translate(50 50) scale(${scale}) translate(-50 -50) rotate(-8 50 50)`
    : 'rotate(-8 50 50)';

  return `
    <g transform="${transform}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
      <rect x="24" y="24" width="52" height="52" rx="10"/>
      <path d="${pins3}"/>
      <circle cx="40" cy="45" r="3" fill="${stroke}" stroke="none"/>
      <rect x="56" y="38.5" width="6.5" height="12" rx="1" fill="${accent}" stroke="none"/>
      <path d="M40 59 C45 65 55 65 60 59"/>
    </g>
  `;
}

// 2. Standalone Mark SVGs (Avatars X : 1024x1024, échelle 0.8 pour un cadrage cercle parfait)
const markDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">
  <rect width="100" height="100" fill="#171614"/>
  ${getMarkSvgInner({ stroke: '#ece9e1', accent: '#d9463a', scale: 0.8 })}
</svg>`;

const markBlackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">
  <rect width="100" height="100" fill="#000000"/>
  ${getMarkSvgInner({ stroke: '#ece9e1', accent: '#ef4444', scale: 0.8 })}
</svg>`;

const markLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">
  <rect width="100" height="100" fill="#fbf9f4"/>
  ${getMarkSvgInner({ stroke: '#171614', accent: '#c72c1e', scale: 0.8 })}
</svg>`;

const markTransparentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">
  ${getMarkSvgInner({ stroke: '#ece9e1', accent: '#d9463a', scale: 0.8 })}
</svg>`;

const markTransparentDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">
  ${getMarkSvgInner({ stroke: '#171614', accent: '#c72c1e', scale: 0.8 })}
</svg>`;

const markCleanRawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
  ${getMarkSvgInner({ stroke: 'currentColor', accent: '#c72c1e', scale: 1 })}
</svg>`;

fs.writeFileSync(path.join(EXPORTS_DIR, 'brimkern-mark.svg'), markCleanRawSvg.trim());
fs.writeFileSync(path.join(EXPORTS_DIR, 'brimkern-mark-dark.svg'), markDarkSvg.trim());

// 3. Full Horizontal Logo (Mark + Brimkern typography) - cadrage serré équilibré (390 x 110)
const logoFullDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 110" width="1170" height="330">
  <rect width="390" height="110" rx="16" fill="#171614"/>
  <g transform="translate(10, 5)">
    ${getMarkSvgInner({ stroke: '#ece9e1', accent: '#d9463a', scale: 0.88 })}
  </g>
  <text x="120" y="70" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="56" font-weight="800" letter-spacing="-2" fill="#ece9e1">Brim<tspan fill="#d9463a">kern</tspan></text>
</svg>`;

const logoFullTransparentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 110" width="1170" height="330">
  <g transform="translate(10, 5)">
    ${getMarkSvgInner({ stroke: '#ece9e1', accent: '#d9463a', scale: 0.88 })}
  </g>
  <text x="120" y="70" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="56" font-weight="800" letter-spacing="-2" fill="#ece9e1">Brim<tspan fill="#d9463a">kern</tspan></text>
</svg>`;

fs.writeFileSync(path.join(EXPORTS_DIR, 'brimkern-logo-full.svg'), logoFullDarkSvg.trim());
fs.writeFileSync(path.join(EXPORTS_DIR, 'brimkern-logo-transparent.svg'), logoFullTransparentSvg.trim());

// 4. Twitter / X Header Banner (1500 x 500 px) - décalé vers la droite pour éviter l'avatar en bas à gauche
const xBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 500" width="1500" height="500">
  <rect width="1500" height="500" fill="#171614"/>
  <!-- Filet rouge Brimkern en haut -->
  <rect width="1500" height="8" fill="#d9463a"/>

  <!-- Halo rouge doux -->
  <defs>
    <radialGradient id="glow" cx="72%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#d9463a" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#171614" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1500" height="500" fill="url(#glow)"/>

  <!-- Groupe de contenu décalé vers la droite (safe zone X desktop & mobile) -->
  <g transform="translate(460, 105)">
    <!-- Puce Brimkern agrandie -->
    <g transform="translate(-160, 20) scale(2.2)">
      ${getMarkSvgInner({ stroke: '#ece9e1', accent: '#d9463a', scale: 1 })}
    </g>

    <!-- Wordmark -->
    <text x="90" y="100" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="96" font-weight="800" letter-spacing="-4" fill="#ece9e1">Brim<tspan fill="#d9463a">kern</tspan></text>

    <!-- Tagline -->
    <text x="95" y="160" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="30" font-weight="500" fill="#b5b1a6">Local WebGPU inference — real AI models in your browser.</text>

    <!-- Badges technologiques -->
    <g transform="translate(95, 202)" font-family="ui-monospace,'Fira Code',SFMono-Regular,monospace" font-size="20" font-weight="500" fill="#d9463a">
      <g><rect x="0" y="0" width="118" height="42" rx="9" fill="none" stroke="#d9463a" stroke-opacity="0.5" stroke-width="1.5"/><text x="59" y="27" text-anchor="middle">WebGPU</text></g>
      <g><rect x="130" y="0" width="90" height="42" rx="9" fill="none" stroke="#d9463a" stroke-opacity="0.5" stroke-width="1.5"/><text x="175" y="27" text-anchor="middle">WGSL</text></g>
      <g><rect x="232" y="0" width="88" height="42" rx="9" fill="none" stroke="#d9463a" stroke-opacity="0.5" stroke-width="1.5"/><text x="276" y="27" text-anchor="middle">.brik</text></g>
      <g><rect x="332" y="0" width="144" height="42" rx="9" fill="none" stroke="#d9463a" stroke-opacity="0.5" stroke-width="1.5"/><text x="404" y="27" text-anchor="middle">100% local</text></g>
      <g><rect x="488" y="0" width="76" height="42" rx="9" fill="none" stroke="#d9463a" stroke-opacity="0.5" stroke-width="1.5"/><text x="526" y="27" text-anchor="middle">SDK</text></g>
      <g><rect x="576" y="0" width="176" height="42" rx="9" fill="rgba(217,70,58,0.14)" stroke="#d9463a" stroke-opacity="0.75" stroke-width="1.5"/><text x="664" y="27" text-anchor="middle" fill="#ece9e1">brimkern.com</text></g>
    </g>
  </g>
</svg>`;

fs.writeFileSync(path.join(EXPORTS_DIR, 'x-header-banner.svg'), xBannerSvg.trim());

async function renderAll() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const renderSvgToPng = async (svgStr, width, height, outPath) => {
    const page = await browser.newPage({ viewport: { width, height, deviceScaleFactor: 1 } });
    const html = `<!DOCTYPE html><html><head><style>body { margin:0; padding:0; overflow:hidden; width:${width}px; height:${height}px; }</style></head><body>${svgStr}</body></html>`;
    await page.setContent(html);
    await page.screenshot({ path: outPath, omitBackground: true });
    await page.close();
  };

  console.log('Rendering 1024x1024 avatars...');
  await renderSvgToPng(markDarkSvg, 1024, 1024, path.join(EXPORTS_DIR, 'x-avatar-dark.png'));
  await renderSvgToPng(markBlackSvg, 1024, 1024, path.join(EXPORTS_DIR, 'x-avatar-black.png'));
  await renderSvgToPng(markLightSvg, 1024, 1024, path.join(EXPORTS_DIR, 'x-avatar-light.png'));
  await renderSvgToPng(markTransparentSvg, 1024, 1024, path.join(EXPORTS_DIR, 'x-avatar-transparent.png'));
  await renderSvgToPng(markTransparentDarkSvg, 1024, 1024, path.join(EXPORTS_DIR, 'x-avatar-transparent-dark.png'));

  console.log('Rendering full logos...');
  await renderSvgToPng(logoFullDarkSvg, 1170, 330, path.join(EXPORTS_DIR, 'brimkern-logo-full.png'));
  await renderSvgToPng(logoFullTransparentSvg, 1170, 330, path.join(EXPORTS_DIR, 'brimkern-logo-transparent.png'));

  console.log('Rendering 1500x500 X header banner...');
  await renderSvgToPng(xBannerSvg, 1500, 500, path.join(EXPORTS_DIR, 'x-header-banner.png'));

  await browser.close();
  console.log('All exports completed successfully!');
}

renderAll().catch(e => {
  console.error(e);
  process.exit(1);
});
