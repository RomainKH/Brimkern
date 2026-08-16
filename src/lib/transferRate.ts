// Débit et temps restant d'un téléchargement, à partir des octets déjà reçus.
//
// « 120 Mo / 359 Mo » ou « 63 % » sans vitesse ni temps restant est anxiogène sur un fichier de
// quelques centaines de Mo, et illisible sur plusieurs Go : un 7B q4 met des minutes et rien à
// l'écran ne dit lesquelles. Deux surfaces en ont besoin — l'écran de chargement et la ligne de
// préchargement d'arrière-plan — d'où ce module plutôt qu'un calcul recopié.
//
// FENÊTRE GLISSANTE de 8 s, et non un débit moyen depuis le début : le débit instantané d'un CDN
// fluctue trop pour une ETA qui ne saute pas, et une moyenne globale reste bloquée sur les premières
// secondes (souvent les plus lentes, connexion en cours d'établissement) longtemps après.
//
// À appeler depuis le callback de progression, JAMAIS pendant un rendu : la fenêtre est un tableau
// muté sur place, et React interdit les deux (accès à une ref au rendu, setState dans un effet).
// Le résultat se range dans le même état que les octets, en un seul rendu.
export type RateWindow = { t: number; loaded: number }[];
export type TransferRate = { bps: number; etaS: number };

const WINDOW_MS = 8_000;
// En dessous, l'échantillonnage est trop court pour dire quoi que ce soit : mieux vaut ne rien
// afficher qu'une ETA absurde tirée du premier paquet.
const MIN_SPAN_S = 0.5;

export function sampleRate(win: RateWindow, loaded: number, total: number): TransferRate | null {
	if (!total || loaded < 0) { win.length = 0; return null; }
	// La progression RECULE → nouvelle phase (ou un autre transfert qui réutilise le même
	// affichage). Garder les échantillons d'avant donnerait un débit négatif.
	if (win.length && loaded < win[win.length - 1].loaded) win.length = 0;
	const now = performance.now();
	// N'échantillonner que ce qui a bougé : un callback qui refire sur la même valeur ne doit pas
	// remplir la fenêtre de points immobiles, qui écraseraient le débit vers zéro.
	if (!win.length || loaded !== win[win.length - 1].loaded) win.push({ t: now, loaded });
	while (win.length > 2 && now - win[0].t > WINDOW_MS) win.shift();
	if (win.length < 2) return null;
	const dt = (now - win[0].t) / 1000, db = loaded - win[0].loaded;
	if (dt <= MIN_SPAN_S || db <= 0) return null;
	const bps = db / dt;
	return { bps, etaS: (total - loaded) / bps };
}
