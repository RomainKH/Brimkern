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
          background: '#f2efe8',
          color: '#1a1a1a',
        }}
      >
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, letterSpacing: '-4px', color: '#1a1a1a' }}>
          Brim<span style={{ color: '#c72c1e' }}>kern</span>
        </div>
        <div style={{ display: 'flex', fontSize: 42, marginTop: 12, color: '#1a1a1a', fontWeight: 600 }}>
          Des LLM dans votre navigateur.
        </div>
        <div style={{ display: 'flex', fontSize: 30, marginTop: 8, color: '#52504a' }}>
          Inférence accélérée par WebGPU · 100% local & privé · GGUF
        </div>
        <div style={{ display: 'flex', marginTop: 40, gap: 12 }}>
          {['WebGPU', 'WGSL', 'int4 / f16', 'GGUF'].map((t) => (
            <div
              key={t}
              style={{
                display: 'flex',
                fontSize: 24,
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
