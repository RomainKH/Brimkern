import { ImageResponse } from 'next/og';

// La carte de partage des routes /fr. Elle existe parce que la carte racine est passée en anglais
// (version canonique du site) : sans elle, un partage de /fr serait annoncé en anglais.
// Même composition que la racine, même promesse — celle de la landing française, mot pour mot.
export const alt = 'Brimkern — exécutez n’importe quel GGUF de Hugging Face dans votre navigateur, sur votre GPU';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImageFr() {
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
        <div style={{ display: 'flex', fontSize: 110, fontWeight: 800, letterSpacing: '-4px', color: '#1a1a1a' }}>
          Brim<span style={{ color: '#c72c1e' }}>kern</span>
        </div>
        <div style={{ display: 'flex', fontSize: 44, marginTop: 10, color: '#1a1a1a', fontWeight: 600 }}>
          N’importe quel modèle du Hub.
        </div>
        <div style={{ display: 'flex', fontSize: 44, color: '#c72c1e', fontWeight: 600 }}>
          Exécuté dans votre navigateur.
        </div>
        <div style={{ display: 'flex', fontSize: 27, marginTop: 14, color: '#52504a' }}>
          GGUF mono-fichier, directement depuis Hugging Face · sans serveur, sans clé d’API
        </div>
        <div style={{ display: 'flex', marginTop: 36, gap: 12 }}>
          {['WebGPU', 'WGSL écrit à la main', 'streaming .brik', '100 % local'].map((t) => (
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
