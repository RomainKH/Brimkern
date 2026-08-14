// Adaptateur RwkvModel → interface modèle du CHAT (topKKV/logitsKV + sessions KV append-only),
// miroir de Lfm2ChatAdapter. Pour un modèle 100 % récurrent, l'ÉTAT INTERNE (S/tm/cm par couche)
// joue le rôle du cache KV : même session + pastLen cohérent → on continue tel quel ; pastLen 0
// ou session neuve → reset ; pastLen divergent (troncature côté chat) → rejeu du préfixe depuis
// zéro (l'état récurrent ne se tronque pas).
// Chemin RÉSIDENT (défaut) : l'état vit sur le GPU côté moteur, keyé par (sessionId, pastLen) —
// une soumission / un readback par tranche (fini le gel du POC ~100 submits/token). Repli JS sinon.
// Les réglages de précision du chat sont des no-ops : un BRIK rwkv charge TEL QUEL (natif q3/q4/q8).

import type { RwkvModel } from './rwkvModel';

export class RwkvChatAdapter {
	private sessionId: string | null = null;
	private history: number[] = [];
	// Champ écrit par le diagnostic ?prec= du chat — sans effet ici (précision native uniquement).
	precOverrides: [string, 'q4' | 'q8'][] = [];

	constructor(private core: RwkvModel, private native: 'q3' | 'q4' | 'q8' = 'q4') {}

	get nativePrecision(): 'q3' | 'q4' | 'q8' { return this.native; }
	get precision(): 'q3' | 'q4' | 'q8' { return this.native; }
	get isMixedNative(): boolean { return false; }
	get supportsQ4(): boolean { return false; } // pas de REquantification : natif uniquement
	get supportsQ8(): boolean { return false; }
	get supportsQ3(): boolean { return false; }
	get kvQuant(): boolean { return false; }
	setWeightPrecision(_p: string): void { throw new Error('BRIK rwkv : précision native uniquement'); }
	setKvQuant(_v: boolean): void { /* no-op : état récurrent f32, pas de cache KV */ }

	reset(): void { this.sessionId = null; this.history = []; this.core.reset(); }
	unload(): void { this.core.unload(); }

	// Chemin résident : l'état GPU ne sait pas « reculer ». On garde l'historique des tokens nourris ;
	// pastLen divergent (troncature/édition côté chat) → rejeu du préfixe depuis zéro via prefillGpu
	// (pastLen 0 = reset moteur). Sans ce garde-fou, l'état contiendrait des tokens rétractés.
	private async alignResident(pastLen: number, sessionId: string): Promise<void> {
		if (sessionId !== this.sessionId || pastLen === 0) { this.sessionId = sessionId; this.history = []; }
		if (pastLen !== this.history.length) {
			const prefix = this.history.slice(0, pastLen);
			this.history = [];
			if (prefix.length) { await this.core.prefillGpu(prefix, 0, sessionId); this.history = prefix; }
		}
	}

	// Aligne l'état interne sur (sessionId, pastLen) puis nourrit `tokens`. Retourne les logits finaux.
	async logitsKV(tokens: number[], pastLen: number, sessionId: string, _inject?: unknown): Promise<Float32Array> {
		if (this.core.residentAvailable()) {
			await this.alignResident(pastLen, sessionId);
			const logits = await this.core.logitsGpu(tokens, pastLen, sessionId);
			this.history.push(...tokens);
			return logits;
		}
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
		if (this.core.residentAvailable()) {
			await this.alignResident(pastLen, sessionId);
			const r = await this.core.topKGpu(tokens, pastLen, sessionId, [...new Set(recent)], penalty, 40);
			this.history.push(...tokens);
			return r;
		}
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
