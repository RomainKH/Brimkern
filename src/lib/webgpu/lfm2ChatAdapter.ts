// Adaptateur Lfm2Model → interface modèle du CHAT (topKKV/logitsKV + sessions KV append-only).
// Le chat pilote CustomWebModel token par token avec un cache KV par session ; pour un modèle
// récurrent/hybride, l'ÉTAT INTERNE joue ce rôle. L'adaptateur garde l'historique des tokens
// nourris : même session + pastLen cohérent → on continue tel quel (état déjà à jour) ;
// pastLen 0 ou session neuve → reset ; pastLen divergent (troncature côté chat) → rejeu du
// préfixe depuis zéro (rare, O(contexte), correct). Les réglages de précision du chat
// (setWeightPrecision/setKvQuant) sont des no-ops : un BRIK lfm2 charge TEL QUEL (natif q4/q8).

import type { Lfm2Model } from './lfm2Model';

export class Lfm2ChatAdapter {
	private sessionId: string | null = null;
	private history: number[] = [];
	// Champ écrit par le diagnostic ?prec= du chat — sans effet ici (précision native uniquement).
	precOverrides: [string, 'q4' | 'q8'][] = [];

	constructor(private core: Lfm2Model, private native: 'q4' | 'q8' = 'q4') {}

	get nativePrecision(): 'q4' | 'q8' { return this.native; }
	get precision(): 'q4' | 'q8' { return this.native; }
	get isMixedNative(): boolean { return false; }
	get supportsQ4(): boolean { return false; } // pas de REquantification : natif uniquement
	get supportsQ8(): boolean { return false; }
	get supportsQ3(): boolean { return false; }
	get kvQuant(): boolean { return false; }
	setWeightPrecision(_p: string): void { throw new Error('BRIK lfm2 : précision native uniquement'); }
	setKvQuant(_v: boolean): void { /* no-op : état récurrent f32, pas de cache KV GPU */ }

	reset(): void { this.sessionId = null; this.history = []; this.core.reset(); }
	unload(): void { this.core.unload(); }

	// Chemin résident : l'état GPU (conv + K/V) ne sait pas « reculer ». On garde l'historique des
	// tokens nourris ; pastLen divergent (troncature/édition côté chat) → rejeu du préfixe depuis
	// zéro via prefillGpu par tranches (pastLen 0 = reset moteur). Sans ce garde-fou, l'état conv
	// contiendrait des tokens rétractés (l'attention se réécrit, l'état récurrent NON).
	private async alignResident(pastLen: number, sessionId: string): Promise<void> {
		if (sessionId !== this.sessionId || pastLen === 0) { this.sessionId = sessionId; this.history = []; }
		if (pastLen !== this.history.length) {
			const prefix = this.history.slice(0, pastLen);
			this.history = [];
			if (prefix.length) {
				for (let done = 0; done < prefix.length; done += 128) {
					await this.core.prefillGpu(prefix.slice(done, done + 128), done, sessionId);
				}
				this.history = prefix;
			}
		}
	}

	// Aligne l'état interne sur (sessionId, pastLen) puis nourrit `tokens`. Retourne les logits finaux.
	// Chemin RÉSIDENT (défaut) : l'état conv + K/V vit sur le GPU côté moteur, keyé par (sessionId,
	// pastLen) — une soumission / un readback pour tout le bloc `tokens` (fini le gel). Repli JS sinon.
	async logitsKV(tokens: number[], pastLen: number, sessionId: string, _inject?: unknown): Promise<Float32Array> {
		if (this.core.residentAvailable()) {
			await this.alignResident(pastLen, sessionId);
			const logits = await this.core.logitsGpu(tokens, pastLen, sessionId);
			this.history.push(...tokens);
			return logits;
		}
		// ── Repli JS (forwardToken token par token) ──
		if (sessionId !== this.sessionId || pastLen === 0) {
			this.sessionId = sessionId; this.history = []; this.core.reset();
		}
		if (pastLen !== this.history.length) {
			// Troncature/divergence : rejouer le préfixe connu (l'état récurrent ne se tronque pas).
			const prefix = this.history.slice(0, pastLen);
			this.history = []; this.core.reset();
			for (const id of prefix) { await this.core.forwardToken(id); this.history.push(id); }
		}
		let logits!: Float32Array;
		for (const id of tokens) { logits = await this.core.forwardToken(id); this.history.push(id); }
		return logits;
	}

	// Le chat n'a pas d'outils : les ouvertures de blocs outil LFM2.5 (8/10/12, tool-calling
	// halluciné — cf. Lfm2Model.TOOL_BAN) sont écartées des candidats au lieu d'être générées.
	private static readonly TOOL_BAN = new Set([8, 10, 12]);
	private banTools(r: { ids: Uint32Array; vals: Float32Array }): { ids: Uint32Array; vals: Float32Array } {
		let w = 0;
		for (let i = 0; i < r.ids.length; i++) {
			if (Lfm2ChatAdapter.TOOL_BAN.has(r.ids[i])) continue;
			r.ids[w] = r.ids[i]; r.vals[w] = r.vals[i]; w++;
		}
		for (; w < r.vals.length; w++) r.vals[w] = -Infinity; // queue résiduelle : poids nul
		return r;
	}

	// Prochain token greedy (utilisé par le bench de précision du chat).
	async generateNextKV(tokens: number[], pastLen: number, sessionId: string, _inject?: unknown): Promise<number> {
		const logits = await this.logitsKV(tokens, pastLen, sessionId);
		for (const id of Lfm2ChatAdapter.TOOL_BAN) if (id < logits.length) logits[id] = -1e30;
		let best = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[best]) best = i;
		return best;
	}

	// Top-K trié décroissant après pénalité de répétition (sémantique llama.cpp : logits positifs
	// divisés, négatifs multipliés) — même contrat que CustomWebModel.topKKV/decodeTopKQ8.
	async topKKV(tokens: number[], pastLen: number, sessionId: string, recent: number[], penalty: number, _inject?: unknown): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		// Résident : projection tête + pénalité + top-K sur le GPU, un readback (~512 o).
		if (this.core.residentAvailable()) {
			await this.alignResident(pastLen, sessionId);
			const r = this.banTools(await this.core.topKGpu(tokens, pastLen, sessionId, [...new Set(recent)], penalty, 40));
			this.history.push(...tokens);
			return r;
		}
		const logits = await this.logitsKV(tokens, pastLen, sessionId);
		for (const id of Lfm2ChatAdapter.TOOL_BAN) if (id < logits.length) logits[id] = -1e30;
		if (penalty && penalty !== 1) {
			for (const id of new Set(recent)) {
				if (id >= 0 && id < logits.length) logits[id] = logits[id] > 0 ? logits[id] / penalty : logits[id] * penalty;
			}
		}
		const K = Math.min(40, logits.length);
		// Sélection top-K en un passage (K petit) : tableau des K meilleurs maintenu trié.
		const ids = new Uint32Array(K), vals = new Float32Array(K).fill(-Infinity);
		for (let i = 0; i < logits.length; i++) {
			const v = logits[i];
			if (v <= vals[K - 1]) continue;
			let j = K - 1;
			while (j > 0 && vals[j - 1] < v) { vals[j] = vals[j - 1]; ids[j] = ids[j - 1]; j--; }
			vals[j] = v; ids[j] = i;
		}
		return { ids, vals };
	}
}
