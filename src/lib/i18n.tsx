"use client";

// Minimal 2-locale i18n. Pattern: `const t = useT(); t('English', 'Français')` — translations are
// co-located at the call site (no separate key dictionary to keep in sync for a 2-language app).
// Default locale is FRENCH (the site is .fr); English is the opt-in toggle (persisted). Because FR is
// the default, any string not yet wrapped in t() simply stays French — correct in the default, and a
// graceful "still French" fallback in English mode — so the migration can be incremental. SSR + the
// first client render both use 'fr' (matching the static HTML); the stored locale is adopted in an
// effect AFTER mount, so there's no hydration mismatch (same approach as the theme adopt).

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

export type Locale = 'en' | 'fr';

const LocaleCtx = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({ locale: 'en', setLocale: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>('fr');
	const restored = useRef(false);

	useEffect(() => {
		if (restored.current) return;
		restored.current = true;
		let stored: string | null = null;
		try { stored = localStorage.getItem('brimkern-locale'); } catch { /* localStorage unavailable */ }
		// Apply in a microtask so the setState isn't synchronous in the effect body (and the first
		// render stays 'fr' = the SSR HTML, avoiding a hydration mismatch).
		if (stored === 'fr' || stored === 'en') queueMicrotask(() => setLocaleState(stored as Locale));
	}, []);

	const setLocale = (l: Locale) => {
		setLocaleState(l);
		try { localStorage.setItem('brimkern-locale', l); } catch { /* ignore */ }
		try { document.documentElement.lang = l; } catch { /* ignore */ }
	};

	return <LocaleCtx.Provider value={{ locale, setLocale }}>{children}</LocaleCtx.Provider>;
}

export function useLocale() { return useContext(LocaleCtx); }

// The translator. `t(en, fr)` returns the string for the current locale (defaults to English).
export function useT() {
	const { locale } = useContext(LocaleCtx);
	return (en: string, fr: string) => (locale === 'fr' ? fr : en);
}
