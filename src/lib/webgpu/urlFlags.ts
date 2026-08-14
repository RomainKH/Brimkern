// La source des KILL-SWITCHES d'URL — un module feuille, sans dépendance.
//
// Tous les commutateurs de diagnostic du moteur (?gemv=0, ?swa=0, ?ropenorm=1, ?gpuprofile=1…) se
// lisaient directement dans `location.search`. C'était juste tant que le moteur ne tournait que sur
// le thread principal. Depuis qu'il peut tourner dans un Web Worker (cf. src/sdk/backend.ts), ça ne
// l'est plus : dans un worker, `location` est celui du script du worker — un blob: sans query — donc
// TOUS les commutateurs y seraient éteints, en silence, quoi qu'on mette dans l'URL de la page.
//
// C'est exactement le piège documenté à propos de `?ropenorm=1` : un commutateur qui ne commute rien
// est pire que pas de commutateur — on en tire des conclusions fausses (« la piste est éliminée,
// le switch ne change rien »). D'où ce point unique, et l'injection explicite côté worker.

let injected: string | null = null;

/** Appelé à l'entrée du worker avec la query de la PAGE — sinon les commutateurs y seraient muets. */
export function setUrlSearch(search: string): void { injected = search || ''; }

function search(): string {
	if (injected !== null) return injected;
	// `self.__brimkernSearch` : posé par le stub du worker AVANT importScripts, donc lisible dès
	// l'évaluation des modules — or les commutateurs sont des initialiseurs statiques, évalués à ce
	// moment-là. Un setUrlSearch() appelé après serait déjà trop tard pour eux.
	try {
		const g = (globalThis as unknown as { __brimkernSearch?: string }).__brimkernSearch;
		if (typeof g === 'string') return g;
	} catch { /* globalThis verrouillé */ }
	try { return typeof location !== 'undefined' ? location.search : ''; } catch { return ''; }
}

/** Valeur brute d'un paramètre, ou null. */
export function urlFlag(name: string): string | null {
	try { return new URLSearchParams(search()).get(name); } catch { return null; }
}
