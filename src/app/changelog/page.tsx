import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — Brimkern',
  description: "Historique des versions de Brimkern, le moteur d'inférence LLM WebGPU local.",
};

interface Release {
  version: string;
  date: string;
  tagline: string;
  groups: { title: string; items: string[] }[];
}

const RELEASES: Release[] = [
  {
    version: 'v1.0',
    date: '23 juin 2026',
    tagline: "Première version — un moteur d'inférence LLM écrit de zéro, 100 % dans le navigateur.",
    groups: [
      {
        title: 'Moteur WebGPU custom',
        items: [
          "Kernels de calcul WGSL maison : matmul vectorisé (vec4 128-bit), RMSNorm, RoPE, attention causale GQA avec cache KV, SwiGLU.",
          "Parsing GGUF directement en JavaScript et déquantification des poids sur le GPU.",
          "Chemin de décodage « GPU-resident » : tout le passage avant d'un token enchaîné en une seule soumission GPU.",
          "Auto-validation des kernels au chargement (selfValidate) : le modèle ne se charge que si les calculs sont corrects.",
        ],
      },
      {
        title: 'Performances',
        items: [
          "Projection des logits mise en cache sur le GPU au lieu d'être recalculée à chaque token.",
          "Argmax du token suivant calculé sur le GPU (un seul entier relu par token au lieu de ~152k logits).",
          "Pool de buffers réutilisés entre les tokens. Résultat global : décodage ~2,5× plus rapide.",
        ],
      },
      {
        title: 'Précision des poids (commutable)',
        items: [
          "f32 — pleine précision (référence qualité).",
          "f16 — demi-précision : ~1,25× plus rapide, ½ de la VRAM (selon le GPU).",
          "int4 (format BWP « q4web ») — déquantification à la volée, ¼ de la VRAM → permet de charger des modèles plus gros dans le navigateur.",
        ],
      },
      {
        title: 'Modèles & quantifications',
        items: [
          "Modèles : Qwen 2.5 (0.5B, Coder 1.5B), Llama 3.2 1B, DeepSeek-R1 Distill Qwen 1.5B (raisonnement <think>).",
          "Quantifications GGUF lues : Q4_0, Q4_K, Q5_0, Q5_K, Q6_K, Q8_0, F16, F32.",
          "Import de n'importe quel GGUF compatible (fichier local ou URL Hugging Face).",
        ],
      },
      {
        title: 'Interface',
        items: [
          "Chat avec rendu Markdown (gras, italique, listes, titres) et coloration + copie des blocs de code.",
          "Historique des conversations persistant (IndexedDB), indépendant du modèle chargé.",
          "Benchmark intégré comparant f32 / f16 / int4, et sélecteur de précision.",
          "Panneau latéral repliable, interface adaptée mobile.",
        ],
      },
      {
        title: 'Confidentialité',
        items: [
          "Aucune donnée envoyée à un serveur : modèle et calculs s'exécutent entièrement sur votre GPU, hors-ligne après le téléchargement du modèle.",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>
      <Link
        href="/"
        style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
      >
        ← Retour à l&apos;application
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 800, margin: '20px 0 8px',
          background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px',
        }}
      >
        Brimkern · Changelog
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 0 36px' }}>
        Inférence LLM accélérée par WebGPU, 100 % dans votre navigateur.
      </p>

      {RELEASES.map((r) => (
        <section key={r.version} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className="status-badge gpu" style={{ fontSize: 13, fontWeight: 700 }}>{r.version}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>{r.date}</span>
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, margin: '0 0 20px' }}>{r.tagline}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {r.groups.map((g) => (
              <div key={g.title} className="card" style={{ padding: 18 }}>
                <h2
                  className="section-title"
                  style={{ fontSize: 12, margin: '0 0 10px', color: 'var(--accent)' }}
                >
                  {g.title}
                </h2>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {g.items.map((it, i) => (
                    <li key={i} style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}

      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 24 }}>
        Brimkern — moteur WebGPU open. Créé par Romain Khanoyan.
      </p>
    </div>
  );
}
