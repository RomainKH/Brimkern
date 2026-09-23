// La marque Brimkern (2026-09-23) : une puce qui sourit, dont un œil est le curseur du terminal —
// « l'IA tourne sur VOTRE machine ». Trait monoligne à bouts ronds (piste C, choisie par Romain
// parmi trois, inspirée de mise.jdx.dev). Remplace le kern-B.
//
// - Le trait suit `currentColor` : la marque prend la couleur du texte autour (encre, papier).
// - L'œil-curseur est le seul accent : `--accent` du site, donc éclairci en thème sombre.
// - Sous 28 px, deux broches par côté au lieu de trois : à 16 px, douze broches font du bruit.
//
// Une seule source pour toutes les pages ; icon.svg et la bannière du README en sont des copies
// statiques (les fichiers servis tels quels ne peuvent pas importer un composant).

type Props = { size?: number; className?: string; style?: React.CSSProperties; title?: string };

export default function BrandMark({ size = 32, className, style, title }: Props) {
  const small = size < 28;
  const pins = small
    ? 'M42 24 V14 M58 24 V14 M42 76 V86 M58 76 V86 M24 42 H14 M24 58 H14 M76 42 H86 M76 58 H86'
    : 'M37 24 V15 M50 24 V13 M63 24 V15 M37 76 V85 M50 76 V87 M63 76 V85 M24 37 H15 M24 50 H13 M24 63 H15 M76 37 H85 M76 50 H87 M76 63 H85';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={small ? 7 : 5.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g transform="rotate(-8 50 50)">
        <rect x="24" y="24" width="52" height="52" rx="10" />
        <path d={pins} />
        <circle cx="40" cy="45" r={small ? 4 : 3} fill="currentColor" stroke="none" />
        <rect x="56" y="38.5" width={small ? 8 : 6.5} height="12" rx="1" fill="var(--accent, #c72c1e)" stroke="none" />
        <path d="M40 59 C45 65 55 65 60 59" />
      </g>
    </svg>
  );
}
