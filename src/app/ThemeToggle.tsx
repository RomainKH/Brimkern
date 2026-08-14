"use client";

// Le bouton clair/sombre — un seul, réutilisé par l'en-tête du chat ET par la barre de la landing.
// Il n'existait que dans le chat : cf. l'en-tête de src/lib/useTheme.ts pour le pourquoi.
//
// `variant` ne change que l'habillage : « nav » prend les classes de la barre de la landing (donc le
// même survol et la même zone de clic que le sélecteur de langue voisin), « header » garde le style
// en ligne de l'en-tête du chat, où les boutons-icônes sont déjà réglés à la main.

import { Moon, Sun } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { useTheme } from '@/lib/useTheme';

export default function ThemeToggle({ variant = 'nav', size = 18 }: { variant?: 'nav' | 'header'; size?: number }) {
	const { dark, setDark } = useTheme();
	const { locale } = useLocale();
	// `title` ET `aria-label` : un bouton-icône sans nom accessible est une violation critique
	// (relevé axe-core du 2026-08-13) et `title` seul ne suffit pas.
	const label = dark ? (locale === 'fr' ? 'Mode clair' : 'Light mode') : (locale === 'fr' ? 'Mode nuit' : 'Dark mode');
	return (
		<button
			onClick={() => setDark((d) => !d)}
			title={label}
			aria-label={label}
			className={variant === 'nav' ? 'lp-nav-lang lp-nav-theme' : undefined}
			style={variant === 'header'
				? { display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px' }
				: undefined}
		>
			{dark ? <Sun size={size} /> : <Moon size={size} />}
		</button>
	);
}
