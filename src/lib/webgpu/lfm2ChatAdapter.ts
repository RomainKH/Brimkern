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

	// Aligne l'état interne sur (sessionId, pastLen) puis nourrit `tokens`. Retourne les logits finaux.
	// Chemin RÉSIDENT (défaut) : l'état conv + K/V vit sur le GPU côté moteur, keyé par (sessionId,
	// pastLen) — une soumission / un readback pour tout le bloc `tokens` (fini le gel). Repli JS sinon.
	async logitsKV(tokens: number[], pastLen: number, sessionId: string, _inject?: unknown): Promise<Float32Array> {
		if (this.core.residentAvailable()) return this.core.logitsGpu(tokens, pastLen, sessionId);
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

	// Prochain token greedy (utilisé par le bench de précision du chat).
	async generateNextKV(tokens: number[], pastLen: number, sessionId: string, _inject?: unknown): Promise<number> {
		const logits = await this.logitsKV(tokens, pastLen, sessionId);
		let best = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[best]) best = i;
		return best;
	}

	// Top-K trié décroissant après pénalité de répétition (sémantique llama.cpp : logits positifs
	// divisés, négatifs multipliés) — même contrat que CustomWebModel.topKKV/decodeTopKQ8.
	async topKKV(tokens: number[], pastLen: number, sessionId: string, recent: number[], penalty: number, _inject?: unknown): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		// Résident : projection tête + pénalité + top-K sur le GPU, un readback (~512 o).
		if (this.core.residentAvailable()) return this.core.topKGpu(tokens, pastLen, sessionId, [...new Set(recent)], penalty, 40);
		const logits = await this.logitsKV(tokens, pastLen, sessionId);
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
