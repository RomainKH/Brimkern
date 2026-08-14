// PROPOSITION DE PATCH — huggingface/huggingface.js
// Fichier cible : packages/tasks/src/local-apps.ts
// Ajouter cette entrée dans l'objet LOCAL_APPS (ordre : à la suite des apps existantes).
// Voir docs/huggingface-integration.md pour la procédure complète.
//
// Contexte pour la PR : Le Kern (BRIMKERN) est un moteur d'inférence WebGPU qui tourne
// ENTIÈREMENT dans le navigateur (kernels WGSL maison, pas de wasm/serveur). Il lit les GGUF
// mono-fichier du Hub directement, plus son propre format streamé .brik. Étant une app web,
// le deeplink n'installe rien : il ouvre le modèle dans l'onglet.

const entry = {
	"le-kern": {
		prettyLabel: "Le Kern",
		docsUrl: "https://brimkern.com/local-ai",
		mainTask: "text-generation" as const,
		displayOnModelPage: (model: { tags: string[]; siblings?: { rfilename: string }[] }) =>
			// GGUF mono-fichier (le moteur les lit nativement) ou nos propres poids .brik.
			(model.tags.includes("gguf") &&
				!!model.siblings?.some((f) => f.rfilename.endsWith(".gguf") && !/-\d{5}-of-\d{5}\.gguf$/.test(f.rfilename))) ||
			model.tags.includes("brimkern") ||
			!!model.siblings?.some((f) => f.rfilename.endsWith(".brik")),
		deeplink: (model: { id: string }, filepath?: string) =>
			new URL(
				`https://brimkern.com/chat?model=${model.id}${filepath ? `&file=${encodeURIComponent(filepath)}` : ""}`
			),
	},
};

// Note de PR à joindre :
// - Aucune installation : le lien ouvre le modèle dans le navigateur (WebGPU), le fichier est
//   streamé par requêtes Range depuis le Hub, mis en cache, puis utilisable hors ligne.
// - Le prompt et la génération ne quittent jamais la machine du visiteur.
// - Démo vivante : https://huggingface.co/spaces/<org>/le-kern-webgpu
// - Code : https://github.com/romainkhanoyan/brimkern (moteur WGSL, format BRIK, SDK npm).
export default entry;
