import { ImageResponse } from 'next/og';

// Carte de partage 1200×630, générée (aucun PNG statique à maintenir). Next la câble sur og:image et
// twitter:image automatiquement.
//
// EN ANGLAIS depuis le 2026-08-13 : elle était en français alors que l'anglais est la version
// canonique du site et que les partages viennent surtout de Hugging Face, Reddit et X. La version
// française vit désormais dans src/app/fr/opengraph-image.tsx, servie pour les routes /fr.
// La promesse reprend MOT POUR MOT celle de la landing : l'aperçu et la page doivent dire la même
// chose, sinon le clic est déçu à l'arrivée.
export const alt = 'Brimkern: run any Hugging Face GGUF in your browser, on your own GPU';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 90px',
          background: '#f2efe8',
          color: '#1a1a1a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 110, fontWeight: 800, letterSpacing: '-4px', color: '#1a1a1a' }}>
          {/* La marque (cf. src/app/BrandMark.tsx), copie statique : next/og ne rend que du JSX inline. */}
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#1a1a1a" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 26 }}>
            <g transform="rotate(-8 50 50)">
              <rect x="24" y="24" width="52" height="52" rx="10" />
              <path d="M37 24 V15 M50 24 V13 M63 24 V15 M37 76 V85 M50 76 V87 M63 76 V85 M24 37 H15 M24 50 H13 M24 63 H15 M76 37 H85 M76 50 H87 M76 63 H85" />
              <circle cx="40" cy="45" r="3" fill="#1a1a1a" stroke="none" />
              <rect x="56" y="38.5" width="6.5" height="12" rx="1" fill="#c72c1e" stroke="none" />
              <path d="M40 59 C45 65 55 65 60 59" />
            </g>
          </svg>
          Brim<span style={{ color: '#c72c1e' }}>kern</span>
        </div>
        <div style={{ display: 'flex', fontSize: 44, marginTop: 10, color: '#1a1a1a', fontWeight: 600 }}>
          Any model on the Hub.
        </div>
        <div style={{ display: 'flex', fontSize: 44, color: '#c72c1e', fontWeight: 600 }}>
          Running in your browser.
        </div>
        <div style={{ display: 'flex', fontSize: 27, marginTop: 14, color: '#52504a' }}>
          Single-file GGUF, straight from Hugging Face · no server, no API key
        </div>
        <div style={{ display: 'flex', marginTop: 36, gap: 12 }}>
          {['WebGPU', 'hand-written WGSL', '.brik streaming', '100% local'].map((t) => (
            <div
              key={t}
              style={{
                display: 'flex',
                fontSize: 22,
                color: '#c72c1e',
                border: '2px solid #c72c1e',
                background: '#ffffff',
                borderRadius: 10,
                padding: '6px 16px',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
