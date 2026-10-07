// La marque Brimkern (2026-09-23) : une puce qui sourit, dont un œil est le curseur du terminal —
// « l'IA tourne sur VOTRE machine ». Trait monoligne à bouts ronds (piste C, choisie par Romain
// parmi trois, inspirée de mise.jdx.dev). Remplace le kern-B.
//
// - Le trait suit `currentColor` : la marque prend la couleur du texte autour (encre, papier).
// - L'œil-curseur est le seul accent : `--accent` du site, donc éclairci en thème sombre.
// - Sous 28 px, deux broches par côté au lieu de trois : à 16 px, douze broches font du bruit.
//
// - `busy` : la même marque sert d'indicateur d'attente partout (chargement du modèle, premier
//   token, boutons occupés). Un ANNEAU entoure la puce : un arc qui tourne tant qu'on ne sait pas
//   où on en est, et qui se REMPLIT quand `progress` (0-100) est connu. L'œil-curseur clignote.
//   La puce seule qui se balançait (2026-10-07, matin) ne disait pas « ça avance » : rejetée.
//   Sous 18 px (boutons), l'anneau seul — la puce y serait illisible.
//   Immobile sous prefers-reduced-motion (règles `.brand-busy` de globals.css).
//
// Une seule source pour toutes les pages ; icon.svg et la bannière du README en sont des copies
// statiques (les fichiers servis tels quels ne peuvent pas importer un composant).

type Props = { size?: number; className?: string; style?: React.CSSProperties; title?: string; busy?: boolean; progress?: number };

// Anneau autour de la puce : rayon 58 dans un viewBox élargi de 16 unités de chaque côté.
const RING_R = 58;
const RING_C = 2 * Math.PI * RING_R;

export default function BrandMark({ size = 32, className, style, title, busy, progress }: Props) {
  const small = size < 28;
  const pins = small
    ? 'M42 24 V14 M58 24 V14 M42 76 V86 M58 76 V86 M24 42 H14 M24 58 H14 M76 42 H86 M76 58 H86'
    : 'M37 24 V15 M50 24 V13 M63 24 V15 M37 76 V85 M50 76 V87 M63 76 V85 M24 37 H15 M24 50 H13 M24 63 H15 M76 37 H85 M76 50 H87 M76 63 H85';
  const known = busy && progress !== undefined && Number.isFinite(progress);
  const pct = known ? Math.max(0, Math.min(100, progress as number)) : 0;
  const a11y = {
    role: title ? 'img' : undefined,
    'aria-label': title,
    'aria-hidden': title ? undefined : true,
  } as const;
  const cls = busy ? `brand-busy${className ? ` ${className}` : ''}` : className;

  // Bouton occupé : l'anneau seul, même dessin que celui qui entoure la puce.
  if (busy && size < 18) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={cls} style={style} {...a11y}>
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="12" opacity="0.2" />
        <circle className="brand-arc" cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray="60 179" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={busy ? '-16 -16 132 132' : '0 0 100 100'}
      fill="none"
      stroke="currentColor"
      strokeWidth={small ? 7 : 5.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cls}
      style={style}
      {...a11y}
    >
      {busy && (
        <>
          <circle cx="50" cy="50" r={RING_R} strokeWidth="6" opacity="0.15" />
          <circle
            className={known ? 'brand-arc-known' : 'brand-arc'}
            cx="50"
            cy="50"
            r={RING_R}
            stroke="var(--accent, #c72c1e)"
            strokeWidth="6"
            strokeDasharray={known ? `${(pct / 100) * RING_C} ${RING_C}` : `${RING_C * 0.22} ${RING_C}`}
            transform={known ? 'rotate(-90 50 50)' : undefined}
          />
        </>
      )}
      <g transform="rotate(-8 50 50)">
        <rect x="24" y="24" width="52" height="52" rx="10" />
        <path d={pins} />
        <circle cx="40" cy="45" r={small ? 4 : 3} fill="currentColor" stroke="none" />
        <rect className="brand-cursor" x="56" y="38.5" width={small ? 8 : 6.5} height="12" rx="1" fill="var(--accent, #c72c1e)" stroke="none" />
        <path d="M40 59 C45 65 55 65 60 59" />
      </g>
    </svg>
  );
}
