import { ImageResponse } from 'next/og';

// Dynamic 1200×630 social-share card (no static PNG needed). Next wires it to og:image
// (and twitter:image) automatically.
export const alt = 'Brimkern — Inférence LLM accélérée par WebGPU, 100% dans le navigateur';
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
          background: 'linear-gradient(135deg, #0b1020 0%, #1e1b4b 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, letterSpacing: '-4px', color: '#a78bfa' }}>
          Brimkern
        </div>
        <div style={{ display: 'flex', fontSize: 42, marginTop: 12, color: '#e2e8f0', fontWeight: 600 }}>
          Des LLM dans votre navigateur.
        </div>
        <div style={{ display: 'flex', fontSize: 30, marginTop: 8, color: '#94a3b8' }}>
          Inférence accélérée par WebGPU · 100% local & privé · GGUF
        </div>
        <div style={{ display: 'flex', marginTop: 40, gap: 12 }}>
          {['WebGPU', 'WGSL', 'int4 / f16', 'GGUF'].map((t) => (
            <div
              key={t}
              style={{
                display: 'flex',
                fontSize: 24,
                color: '#c4b5fd',
                border: '1px solid #4c1d95',
                background: 'rgba(139,92,246,0.12)',
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
