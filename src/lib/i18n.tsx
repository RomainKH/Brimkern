"use client";

// i18n minimal à 2 locales. Motif : `const t = useT(); t('English', 'Français')` — les traductions
// vivent au point d'appel (pas de dictionnaire de clés à maintenir pour une app bilingue).
//
// ── L'URL est la SOURCE DE VÉRITÉ (2026-08-13) ────────────────────────────────────────────────
// Avant, la langue était un état client (défaut français, persisté). Conséquence SEO mesurée : le
// HTML servi était TOUJOURS en français, donc la version anglaise n'existait pas pour les moteurs —
// sur un sujet dont les recherches sont massivement anglophones. Désormais :
//   `/`    → anglais (version canonique)      `/fr` → français
// La locale est imposée par le segment de route via `initialLocale`, et changer de langue = NAVIGUER
// vers l'autre URL. `setLocale` garde donc sa signature (aucun appelant à modifier) mais route au
// lieu de muter un état : les deux langues sont indexables, chacune sur son URL, avec hreflang.

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type Locale = 'en' | 'fr';

const LocaleCtx = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({ locale: 'en', setLocale: () => {} });

// Chemin équivalent dans l'autre langue : `/fr` est un simple préfixe, l'anglais n'en a pas (il est
// à la racine, donc l'URL canonique reste courte et les liens déjà publiés continuent de marcher).
export function localizedPath(pathname: string, locale: Locale): string {
	const bare = pathname.replace(/^\/fr(?=\/|$)/, '') || '/';
	return locale === 'fr' ? (bare === '/' ? '/fr' : `/fr${bare}`) : bare;
}

export function LocaleProvider({ children, initialLocale = 'en' }: { children: ReactNode; initialLocale?: Locale }) {
	const router = useRouter();
	const pathname = usePathname();

	const value = useMemo(() => ({
		locale: initialLocale,
		setLocale: (l: Locale) => {
			if (l === initialLocale) return;
			// Mémorise le choix pour pouvoir proposer la bonne langue à la prochaine visite (sans jamais
			// rediriger de force : une redirection automatique masquerait une des deux versions).
			try { localStorage.setItem('brimkern-locale', l); } catch { /* indisponible */ }
			router.push(localizedPath(pathname || '/', l));
		},
	}), [initialLocale, pathname, router]);

	// `<html lang>` ne peut être posé que par le layout RACINE, et un script `beforeInteractive` ne se
	// rejoue pas lors d'une navigation côté client : après un clic sur « FR », l'attribut restait à
	// « en » (vérifié). On le synchronise donc ici, où la locale est connue — un lecteur d'écran doit
	// changer de voix en changeant de langue.
	useEffect(() => {
		try { document.documentElement.lang = initialLocale; } catch { /* hors navigateur */ }
	}, [initialLocale]);

	return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale() { return useContext(LocaleCtx); }

// Préfixe un chemin interne de la locale courante : `useHref('/convert')` rend « /convert » en
// anglais et « /fr/convert » en français. Sans ça, un clic depuis /fr renvoyait sur la version
// anglaise — les deux langues se mélangeaient au premier lien suivi.
export function useHref() {
	const { locale } = useContext(LocaleCtx);
	return (path: string) => localizedPath(path, locale);
}

// Le traducteur. `t(en, fr)` rend la chaîne de la locale courante (anglais par défaut).
export function useT() {
	const { locale } = useContext(LocaleCtx);
	return (en: string, fr: string) => (locale === 'fr' ? fr : en);
}
