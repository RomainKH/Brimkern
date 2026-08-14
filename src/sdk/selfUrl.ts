// L'URL ABSOLUE de sdk.js, capturée à l'exécution du script.
//
// Elle doit être lue au TOP-LEVEL : `document.currentScript` ne vaut le script courant que pendant
// son évaluation synchrone initiale. Lue plus tard (dans embed(), dans un effet), elle rend `null`
// et le worker ne peut plus être fabriqué — le widget retomberait silencieusement sur le thread
// principal sans qu'on comprenne pourquoi. D'où ce module minuscule, importé tôt.
//
// Sert à `importScripts()` dans le worker (cf. workerBackend.ts) : c'est le seul moyen d'exécuter
// notre bundle dans un worker quand il est servi depuis une autre origine que la page hôte.

function lire(): string {
	try {
		if (typeof document === 'undefined') return '';
		const s = document.currentScript as HTMLScriptElement | null;
		// `src` est déjà absolutisé par le DOM ; `new URL` couvre le cas d'un attribut relatif posé
		// à la main sur un script injecté.
		if (s?.src) return new URL(s.src, document.baseURI).href;
	} catch { /* document indisponible / URL invalide */ }
	return '';
}

export const selfScriptUrl: string = lire();

// Permet à un intégrateur qui charge le SDK autrement (bundler, import ESM, script injecté après
// coup) de désigner lui-même le fichier à importer dans le worker.
let override = '';
export function setWorkerScriptUrl(url: string): void { override = url; }
export function workerScriptUrl(): string { return override || selfScriptUrl; }
