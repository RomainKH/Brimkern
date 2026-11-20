import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// La carte de partage 1200×630, commune à la racine (anglais) et à /fr. Elle reprend le héros de la
// landing : fond sombre, titre en Fraunces, le terminal à droite. L'ancienne carte (papier clair,
// police par défaut de next/og, quatre pastilles) ne ressemblait plus au site et citait une promesse
// que la landing n'affiche plus.
//
// next/og ne connaît pas next/font : les polices du site sont relues ici en TTF statiques
// (assets/og-fonts, licence OFL), sinon tout retombe sur la police par défaut.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#1b1b1f';
const PAPER = '#f0f0eb';
const RED = '#f87171';
const MUTED = '#a3a6ad';
const FAINT = '#787b84';
const BORDER = '#33363f';
const GREEN = '#3dd68c';

const font = (f: string) => readFile(join(process.cwd(), 'assets/og-fonts', f));

export type OgCardText = {
  /** Les deux phrases du titre de la landing, mot pour mot. */
  h1: string;
  h1Accent: string;
  lede: string;
  /** Le titre français est plus long : il descend d'un cran pour tenir sur la colonne. */
  h1Size?: number;
};

export async function ogCard({ h1, h1Accent, lede, h1Size = 62 }: OgCardText) {
  const [fraunces, inter, fira, firaBold] = await Promise.all([
    font('Fraunces-ExtraBold.ttf'),
    font('Inter-Regular.ttf'),
    font('FiraCode-Regular.ttf'),
    font('FiraCode-SemiBold.ttf'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 64px',
          background: BG,
          color: PAPER,
          fontFamily: 'Inter',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: 610 }}>
          <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Fraunces', fontSize: 36, letterSpacing: '-0.5px' }}>
            {/* La marque (cf. src/app/BrandMark.tsx), copie statique : next/og ne rend que du JSX inline. */}
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke={PAPER} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 12 }}>
              <g transform="rotate(-8 50 50)">
                <rect x="24" y="24" width="52" height="52" rx="10" />
                <path d="M37 24 V15 M50 24 V13 M63 24 V15 M37 76 V85 M50 76 V87 M63 76 V85 M24 37 H15 M24 50 H13 M24 63 H15 M76 37 H85 M76 50 H87 M76 63 H85" />
                <circle cx="40" cy="45" r="3" fill={PAPER} stroke="none" />
                <rect x="56" y="38.5" width="6.5" height="12" rx="1" fill="#ef4444" stroke="none" />
                <path d="M40 59 C45 65 55 65 60 59" />
              </g>
            </svg>
            Brimkern
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40, fontFamily: 'Fraunces', fontSize: h1Size, lineHeight: 1.05, letterSpacing: '-1.5px' }}>
            <div style={{ display: 'flex' }}>{h1}</div>
            <div style={{ display: 'flex', color: RED }}>{h1Accent}</div>
          </div>
          <div style={{ display: 'flex', marginTop: 26, fontSize: 24, lineHeight: 1.45, color: MUTED }}>{lede}</div>
          <div style={{ display: 'flex', marginTop: 34, fontFamily: 'Fira Code', fontSize: 21, color: FAINT }}>brimkern.com</div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 424,
            background: '#161618',
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            fontFamily: 'Fira Code',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
            {['#f87171', '#f9b44e', '#3dd68c'].map((c) => (
              <div key={c} style={{ display: 'flex', width: 12, height: 12, borderRadius: 6, background: c, marginRight: 8 }} />
            ))}
            <div style={{ display: 'flex', marginLeft: 12, fontSize: 17, color: MUTED }}>brimkern-engine.ts</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '22px 24px 26px', fontSize: 19, lineHeight: 1.65, color: FAINT }}>
            <div style={{ display: 'flex', color: PAPER }}>
              <span style={{ color: RED, fontWeight: 600, marginRight: 12 }}>$</span>brimkern run
            </div>
            <div style={{ display: 'flex', color: PAPER }}>Qwen/Qwen2.5-0.5B-Instruct-GGUF</div>
            <div style={{ display: 'flex', marginTop: 10 }}>[gpu]  WebGPU adapter ready</div>
            <div style={{ display: 'flex' }}>[http] streaming from the Hub</div>
            <div style={{ display: 'flex' }}>[wgsl] hand-written kernels</div>
            <div style={{ display: 'flex', marginTop: 10, color: GREEN, fontWeight: 600 }}>Model ready · zero server calls</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 800, style: 'normal' },
        { name: 'Inter', data: inter, weight: 400, style: 'normal' },
        { name: 'Fira Code', data: fira, weight: 400, style: 'normal' },
        { name: 'Fira Code', data: firaBold, weight: 600, style: 'normal' },
      ],
    },
  );
}
