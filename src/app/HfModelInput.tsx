"use client";

// « Testez n'importe quel modèle du Hub » — la surface VISIBLE du deeplink (src/lib/deeplink.ts).
// Le résolveur existait déjà mais n'était atteignable que par une query string, ou par deux champs
// d'URL séparés enterrés dans un onglet du navigateur de modèles, chacun demandant de choisir à la
// main le tokenizer et l'architecture. Ici : UN champ, qui avale ce que les gens collent vraiment
// (auteur/modèle, l'URL de la page, l'URL d'un fichier, un lien direct), choisit le meilleur quant
// et déduit tokenizer + arch du fichier lui-même. C'est aussi ce que verront les visiteurs venus du
// menu « Use this model » de Hugging Face, donc le même code sert les deux entrées.

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { useT } from '@/lib/i18n';

interface Props {
  // Rend un message d'erreur à afficher, ou null si le chargement est parti.
  onLoad: (raw: string) => Promise<string | null>;
  disabled?: boolean;
  // Exemples cliquables (dépôts réellement en ligne) — un champ vide n'apprend rien à personne.
  examples?: { label: string; value: string }[];
  compact?: boolean;
}

export default function HfModelInput({ onLoad, disabled, examples, compact }: Props) {
  const t = useT();
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (raw?: string) => {
    const text = (raw ?? value).trim();
    if (!text || busy || disabled) return;
    setBusy(true);
    setError(null);
    const err = await onLoad(text);
    // Succès → le chargement prend l'écran (overlay) ; on ne remet pas le champ à zéro pour que
    // l'utilisateur retrouve sa saisie s'il revient (échec réseau, autre modèle à essayer).
    setError(err);
    setBusy(false);
  };

  return (
    <div style={{ margin: compact ? '0' : '0 0 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <Sparkles size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
          {t('Try any model from Hugging Face', 'Testez n’importe quel modèle de Hugging Face')}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <input
          className="input-control"
          style={{ flex: '1 1 260px', minWidth: 0, fontSize: 12.5, fontFamily: 'var(--font-mono)' }}
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          placeholder={t('author/model, its Hugging Face URL, or a .gguf / .brik link', 'auteur/modèle, son URL Hugging Face, ou un lien .gguf / .brik')}
          disabled={disabled || busy}
          spellCheck={false}
          autoCapitalize="off"
          aria-label={t('Hugging Face model to load', 'Modèle Hugging Face à charger')}
        />
        <button className="btn btn-primary" style={{ fontSize: 12.5, flexShrink: 0 }} onClick={() => submit()} disabled={disabled || busy || !value.trim()}>
          {busy ? <Loader2 size={14} className="spin" /> : t('Load', 'Charger')}
        </button>
      </div>
      {error ? (
        <div style={{ fontSize: 11, color: 'var(--error)', marginTop: 6, lineHeight: 1.45 }}>{error}</div>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.45 }}>
          {t(
            'Single-file GGUF and .brik, straight from the Hub. Nothing to configure: the best quantization is picked, and the tokenizer follows the file. Nothing leaves your browser.',
            'GGUF mono-fichier et .brik, directement depuis le Hub. Rien à régler : la meilleure quantification est choisie, et le tokenizer suit le fichier. Rien ne sort de votre navigateur.',
          )}
        </div>
      )}
      {!!examples?.length && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 7, alignItems: 'center' }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{t('Examples:', 'Exemples :')}</span>
          {examples.map((ex) => (
            <button
              key={ex.value}
              onClick={() => { setValue(ex.value); setError(null); submit(ex.value); }}
              disabled={disabled || busy}
              title={ex.value}
              style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: 999, cursor: disabled || busy ? 'default' : 'pointer', color: 'var(--text-secondary)', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', border: '1px solid var(--border-color)' }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
