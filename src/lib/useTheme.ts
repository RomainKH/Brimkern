"use client";

// Le thème clair/sombre, partagé par TOUTES les pages.
//
// Il vivait dans ChatApp.tsx (état local + effet + persistance), donc le bouton n'existait que dans
// l'en-tête du chat : sur la landing — la page que voient les visiteurs qui arrivent d'un moteur ou
// du Hub — le thème sombre s'APPLIQUAIT bien (le script pré-paint du layout pose `html.dark`) mais
// rien ne permettait d'en sortir ni d'y entrer. Le réglage était donc invisible à l'endroit exact
// où il se décide.
//
// L'ÉTAT RÉEL EST LA CLASSE SUR <html>, pas un state React — c'est le script pré-paint du layout qui
// la pose, avant que React n'existe. On la LIT donc au lieu de la dupliquer, via
// `useSyncExternalStore` : `getSnapshot` lit le DOM, `subscribe` observe ses mutations, et
// `getServerSnapshot` rend `false` pour que le rendu serveur et la première render client coïncident
// (sans quoi l'icône diffèrerait et l'hydratation casserait).
//
// C'est aussi ce qui règle proprement deux choses que la version à `useState` traitait mal :
//  - l'adoption au montage (« reprendre ce que le script a déjà mis ») n'est plus un setState dans un
//    effet — donc plus de render en cascade, et plus de fenêtre où l'icône contredit la page ;
//  - deux barres montées en même temps (aujourd'hui la landing, demain un en-tête partagé) ne
//    peuvent pas diverger : elles lisent la même source.

import { useCallback, useSyncExternalStore } from 'react';

export const THEME_KEY = 'brimkern-theme';

function subscribe(onChange: () => void): () => void {
	const obs = new MutationObserver(onChange);
	obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	return () => obs.disconnect();
}

const lire = () => document.documentElement.classList.contains('dark');
const lireServeur = () => false;

export function useTheme(): { dark: boolean; setDark: (v: boolean | ((d: boolean) => boolean)) => void } {
	const dark = useSyncExternalStore(subscribe, lire, lireServeur);
	// Écrire la classe SUFFIT : l'observateur ci-dessus renotifie tous les abonnés, donc l'icône
	// suit sans qu'on ait à propager quoi que ce soit.
	const setDark = useCallback((v: boolean | ((d: boolean) => boolean)) => {
		const next = typeof v === 'function' ? v(document.documentElement.classList.contains('dark')) : v;
		document.documentElement.classList.toggle('dark', next);
		try { localStorage.setItem(THEME_KEY, next ? 'dark' : 'light'); } catch { /* mode privé */ }
	}, []);
	return { dark, setDark };
}
