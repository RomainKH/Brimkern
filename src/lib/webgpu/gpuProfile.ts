// Budget GPU PAR PASSE — l'instrument qui manquait.
//
// POURQUOI. Le plafond de nos kernels de décodage est mesuré (`__decodeBench` : 14,4 puis 17,5 t/s
// sur les formes d'un 7B q4) et le débit réel bout en bout aussi (9,6 t/s). L'écart est de 1,5 à
// 1,8× — le plus gros levier qui reste sur le moteur, très au-dessus des 10-15 % qu'on attend de
// subgroups ou de la fusion d'opérateurs. Mais personne n'a jamais pu dire OÙ il part.
//
// Et ce n'était pas un oubli, c'était structurel : `?timing=1` chronomètre des segments CPU
// (enregistrement / submit / readback) AUTOUR du forward. Or le décodage résident est UNE SEULE
// soumission — cet instrument mesure donc l'enveloppe et ne peut, par construction, rien répartir
// entre attention, normes, GEMV, sampling. On savait la taille du trou, jamais sa composition.
//
// Ce que fait ce module : `timestamp-query` (feature WebGPU standard, jamais utilisée ici) écrit
// une paire d'horodatages GPU autour de CHAQUE passe. Comme toutes les passes du chemin résident
// entrent par `recordPass(enc, name, …)`, un seul point d'accroche suffit, et le `name` est déjà le
// nom du kernel : on obtient le budget par kernel sans toucher au forward.
//
// ⚠️ PRÉCISION, à lire avant d'interpréter un chiffre. Chrome QUANTIFIE les horodatages à ~100 µs
// hors isolation d'origine. Une passe isolée dure typiquement 10-100 µs : prise seule, une mesure ne
// vaut RIEN (elle rend 0 ou 100 µs). L'erreur sur une différence est bornée par la quantification et
// ne dépend pas de la durée mesurée — elle se moyenne donc sur les répétitions. D'où la règle du
// module : on n'agrège JAMAIS moins que `MIN_SAMPLES` tirs par nom, et le rapport porte le nombre
// d'échantillons de chaque ligne pour qu'on puisse écarter celles qui n'en ont pas assez. C'est
// exactement la leçon (a) de l'affaire Llama : un chiffre qui sort n'est pas un chiffre qui mesure.
//
// ⚠️ Ce n'est PAS le temps de bout en bout. On mesure le temps GPU des passes ; la latence de
// soumission, les readback et le travail CPU (détokenisation, sampling final) en sont dehors — et
// c'est voulu : le total mesuré ici, comparé au temps réel par token, donne précisément la part qui
// n'est PAS du calcul GPU. C'est la première question à laquelle il faut répondre.
//
// ⚠️ EFFET D'OBSERVATION, et il est structurel — à lire AVANT de conclure quoi que ce soit d'un
// pourcentage. Poser une paire d'horodatages autour d'une passe l'ISOLE : le GPU ne peut plus
// recouvrir cette passe avec la suivante, alors qu'en fonctionnement normal des passes courtes et
// indépendantes se chevauchent. Le profileur SÉRIALISE donc ce qu'il mesure. Deux conséquences :
//   1. le total mesuré est plus grand que le temps GPU réel de la même séquence ;
//   2. ce sont les passes COURTES ET NOMBREUSES (rmsnorm, add, swiglu…) qui en souffrent le plus,
//      parce qu'elles vivaient précisément de ce recouvrement — leur part est donc SURESTIMÉE.
// Ce rapport se lit comme un classement de « ce qui coûte quand on ne peut pas recouvrir », pas
// comme la répartition du temps réel. Il désigne les candidats à la FUSION d'opérateurs (§3.4) —
// ce qui est exactement l'usage prévu, la fusion supprimant justement des frontières de passes —
// mais un « X % du décodage » tiré tel quel d'ici serait faux. Le seul juge du gain reste l'A/B
// bout en bout avec kill-switch, comme pour tout le reste du moteur.
//
// Coût quand c'est éteint : un `?.` par passe. Le jeu de requêtes n'est même pas alloué, et la
// feature n'est pas demandée au device (cf. WebGpuEngine.init) — une session normale est bit à bit
// celle d'avant.

// Même convention que kernels.ts : les types WebGPU ne sont pas dans la lib TS du projet.
type GPUAny = ReturnType<typeof Object.create>;

// Deux jeux alternés : pendant qu'un jeu est résolu et lu (asynchrone), l'autre continue d'écrire.
// Avec un seul jeu il aurait fallu refuser des passes pendant la vidange — et les passes refusées
// auraient été celles qui tombent dans la fenêtre de vidange, donc un biais SÉLECTIF selon l'endroit
// du forward où elle démarre, pas une perte uniforme. Ça se serait vu comme un kernel « peu coûteux ».
const SETS = 2;
// 4096 = plafond usuel de `maxQuerySetSize`. À ~12 passes par couche, ça tient ~6 tokens d'un 7B
// (28 couches) par jeu — largement de quoi accumuler des centaines de tirs par nom de kernel.
const CAPACITY = 4096;
// En dessous, une ligne est trop bruitée pour être lue (cf. quantification à 100 µs ci-dessus).
export const MIN_SAMPLES = 50;

export interface PassStat {
	name: string;
	calls: number;      // tirs effectivement horodatés (≠ tirs exécutés si `dropped` > 0)
	totalMs: number;
	meanUs: number;
	share: number;      // part du temps GPU MESURÉ (pas du temps par token)
	reliable: boolean;  // calls >= MIN_SAMPLES
}

export interface ProfileReport {
	passes: PassStat[];
	totalMs: number;
	samples: number;
	dropped: number;    // passes exécutées sans horodatage (jeux saturés) — honnêteté du rapport
	quantumUs: number;  // granularité annoncée de l'horodatage
}

export class GpuProfiler {
	private device: GPUAny;
	private sets: { qs: GPUAny; resolve: GPUAny; read: GPUAny; busy: boolean }[] = [];
	private cur = 0;
	private next = 0;               // prochain index d'horodatage libre dans le jeu courant
	private names: string[] = [];   // nom de la passe i (paire d'index 2i / 2i+1)
	private acc = new Map<string, { calls: number; ns: number }>();
	private dropped = 0;
	private pending: Promise<void>[] = [];
	// Numéro de FENÊTRE de mesure. `rotate()` peut refuser de vider un jeu encore occupé : ses
	// horodatages restent alors en attente et seraient accumulés PLUS TARD — donc après un reset(),
	// dans la fenêtre suivante, où ils n'ont rien à faire. Constaté au banc : 113 passes
	// réapparaissaient juste après un reset() censé rendre 0. Chaque vidange retient donc la fenêtre
	// dans laquelle elle a été lancée et se jette si celle-ci a changé.
	private fenetre = 0;

	constructor(device: GPUAny) {
		this.device = device;
		const G = globalThis as GPUAny;
		for (let i = 0; i < SETS; i++) {
			this.sets.push({
				qs: device.createQuerySet({ type: 'timestamp', count: CAPACITY }),
				resolve: device.createBuffer({ size: CAPACITY * 8, usage: G.GPUBufferUsage.QUERY_RESOLVE | G.GPUBufferUsage.COPY_SRC }),
				read: device.createBuffer({ size: CAPACITY * 8, usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ }),
				busy: false,
			});
		}
	}

	// Réserve une paire d'horodatages pour une passe. Rend le descripteur `timestampWrites` à passer
	// à beginComputePass, ou null si le jeu courant est plein et que l'autre est encore en vidange
	// (la passe s'exécute alors normalement, simplement non mesurée : comptée dans `dropped`).
	slot(name: string): { querySet: GPUAny; beginningOfPassWriteIndex: number; endOfPassWriteIndex: number } | null {
		if (this.next + 2 > CAPACITY) {
			this.rotate();
			if (this.next + 2 > CAPACITY) { this.dropped++; return null; }
		}
		const set = this.sets[this.cur];
		if (set.busy) { this.dropped++; return null; }
		const i = this.next;
		this.next += 2;
		this.names.push(name);
		return { querySet: set.qs, beginningOfPassWriteIndex: i, endOfPassWriteIndex: i + 1 };
	}

	// Bascule sur l'autre jeu et lance la vidange du précédent. Non bloquant : la boucle de décodage
	// continue pendant la résolution — sinon l'instrument ajouterait une attente par fenêtre et
	// fausserait la latence de soumission, c'est-à-dire une des choses qu'on cherche à mesurer.
	private rotate(): void {
		const from = this.cur;
		const set = this.sets[from];
		const names = this.names;
		const count = this.next;
		this.cur = (this.cur + 1) % SETS;
		this.next = 0;
		this.names = [];
		if (!count || set.busy) return;
		set.busy = true;
		const fenetre = this.fenetre;
		const enc = this.device.createCommandEncoder();
		enc.resolveQuerySet(set.qs, 0, count, set.resolve, 0);
		enc.copyBufferToBuffer(set.resolve, 0, set.read, 0, count * 8);
		this.device.queue.submit([enc.finish()]);
		const G = globalThis as GPUAny;
		const p = set.read.mapAsync(G.GPUMapMode.READ, 0, count * 8).then(() => {
			const ts = new BigUint64Array(set.read.getMappedRange(0, count * 8).slice(0));
			set.read.unmap();
			if (fenetre !== this.fenetre) return; // reset() entre-temps : cette fenêtre n'existe plus
			for (let i = 0; i < names.length; i++) {
				const a = ts[i * 2], b = ts[i * 2 + 1];
				// Un horodatage nul = la passe n'a pas écrit (jeu recyclé, passe éliminée par le
				// driver). L'ignorer plutôt que de compter un zéro, qui tirerait la moyenne vers le bas.
				if (!a || !b || b <= a) continue;
				const ns = Number(b - a);
				const e = this.acc.get(names[i]);
				if (e) { e.calls++; e.ns += ns; } else this.acc.set(names[i], { calls: 1, ns });
			}
		}).catch(() => { /* device perdu / buffer déjà démonté : la fenêtre est perdue, pas la session */ })
			.finally(() => { set.busy = false; });
		this.pending.push(p);
	}

	// Vide ce qui reste, attend les vidanges en vol, et rend le budget agrégé. NE remet PAS les
	// compteurs à zéro : `reset()` est explicite, pour qu'on puisse lire un rapport intermédiaire
	// sans casser la fenêtre de mesure en cours.
	async report(): Promise<ProfileReport> {
		this.rotate();
		const waiting = this.pending;
		this.pending = [];
		await Promise.all(waiting);
		let totalNs = 0, samples = 0;
		for (const e of this.acc.values()) { totalNs += e.ns; samples += e.calls; }
		const passes: PassStat[] = [...this.acc.entries()]
			.map(([name, e]) => ({
				name,
				calls: e.calls,
				totalMs: e.ns / 1e6,
				meanUs: e.ns / e.calls / 1e3,
				share: totalNs ? e.ns / totalNs : 0,
				reliable: e.calls >= MIN_SAMPLES,
			}))
			.sort((a, b) => b.totalMs - a.totalMs);
		return { passes, totalMs: totalNs / 1e6, samples, dropped: this.dropped, quantumUs: 100 };
	}

	reset(): void {
		this.fenetre++;
		this.acc.clear();
		this.dropped = 0;
	}

	destroy(): void {
		for (const s of this.sets) { try { s.qs.destroy(); s.resolve.destroy(); s.read.destroy(); } catch { /* déjà libéré */ } }
		this.sets = [];
	}
}

// Rendu texte du rapport — même esprit que les autres bancs du repo : les lignes NON FIABLES sont
// marquées, pas masquées. Une ligne cachée est une ligne qu'on oublie d'aller chercher.
export function formatProfile(r: ProfileReport): string {
	const lines = [
		`temps GPU mesuré : ${r.totalMs.toFixed(1)} ms sur ${r.samples} passes horodatées` +
		(r.dropped ? ` (+${r.dropped} non mesurées)` : '') +
		` · quantification ~${r.quantumUs} µs`,
		'kernel                          tirs      total ms   moyenne µs   part',
	];
	for (const p of r.passes) {
		lines.push(
			`${p.name.padEnd(30)}${String(p.calls).padStart(6)}${p.totalMs.toFixed(1).padStart(12)}` +
			`${p.meanUs.toFixed(1).padStart(13)}${(p.share * 100).toFixed(1).padStart(7)}%` +
			(p.reliable ? '' : `  ⚠️ < ${MIN_SAMPLES} tirs, non concluant`),
		);
	}
	return lines.join('\n');
}
