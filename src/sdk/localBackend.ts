// Backend « thread principal » — le comportement historique du SDK, derrière le contrat commun.
//
// Il sert deux rôles, et le second est le plus important : c'est le REPLI quand le Web Worker ne
// peut pas être construit (CSP de l'hôte qui refuse blob:, navigateur sans Worker). Un intégrateur
// dont la page interdit les workers doit garder un widget qui marche, pas un widget qui explique
// pourquoi il ne marche pas. C'est aussi ce que fait tourner le worker LUI-MÊME, de l'autre côté
// de la frontière (cf. engineWorker.ts) : une seule implémentation d'inférence, jamais deux.

import { getModel, models, withDeviceRetry, runTurn, type LoadProgress } from './engineCore';
import type { EngineBackend, ModelState, TurnRequest } from './backend';

export class LocalBackend implements EngineBackend {
	readonly kind = 'main' as const;

	async preload(url: string, onProgress?: (s: string, p?: LoadProgress) => void): Promise<void> {
		await getModel(url, onProgress);
	}

	state(url: string): ModelState | undefined {
		return models.get(url)?.state;
	}

	turn(req: TurnRequest, onToken?: (t: string) => void, signal?: AbortSignal): Promise<string> {
		return withDeviceRetry(req.url, (core) =>
			runTurn(core, req.history, req.system, req.maxTokens, req.temperature, onToken, () => !!signal?.aborted, req.pinned));
	}

	dispose(): void { /* singleton de page : rien à libérer ici (cf. engineCore.models) */ }
}
