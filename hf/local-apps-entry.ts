// PROPOSITION DE PATCH — huggingface/huggingface.js  (Apache-2.0)
// Fichier cible : packages/tasks/src/local-apps.ts, à la FIN de l'objet LOCAL_APPS (les entrées y
// sont ajoutées à la suite, pas dans l'ordre alphabétique — vérifié le 2026-08-30).
//
// ⚠️ VÉRIFIÉ CONTRE LE VRAI CONTRAT AMONT le 2026-08-30, et la version précédente de ce fichier ne
// compilait PAS : elle lisait `model.siblings`, qui n'existe pas sur `ModelData`
// (`error TS2339: Property 'siblings' does not exist on type 'ModelData'`, contrôle rejoué). Une PR
// avec cette entrée serait morte au premier `tsc` du CI.
// Le prédicat amont pour « ce dépôt porte un GGUF chargeable » est `isLlamaCppGgufModel`, soit
// `!!model.gguf?.context_length` — c'est ce que toutes les apps GGUF utilisent, et c'est une donnée
// que le Hub calcule lui-même.
//
// Contexte pour la PR : Brimkern est un moteur d'inférence WebGPU qui tourne ENTIÈREMENT dans le
// navigateur (kernels WGSL écrits à la main, pas de wasm, pas de serveur). Il lit les GGUF
// mono-fichier du Hub directement, plus son propre format streamé .brik. Étant une app WEB, le
// deeplink n'installe rien : il ouvre le modèle dans l'onglet.

const entry = {
	brimkern: {
		prettyLabel: "Brimkern",
		docsUrl: "https://brimkern.com/local-ai",
		mainTask: "text-generation",
		displayOnModelPage: (model) => isLlamaCppGgufModel(model) || model.library_name === "brimkern",
		deeplink: (model, filepath) => {
			const url = new URL("https://brimkern.com/chat");
			url.searchParams.set("model", model.id);
			if (filepath) {
				url.searchParams.set("file", filepath);
			}
			return url;
		},
	},
};

// Note de PR à joindre :
// - Aucune installation : le lien ouvre le modèle dans le navigateur (WebGPU). Le fichier est streamé
//   par requêtes Range depuis le Hub, mis en cache, puis utilisable HORS LIGNE.
// - Le prompt et la génération ne quittent jamais la machine du visiteur.
// - Démo vivante (Space statique, zéro GPU côté HF) : https://huggingface.co/spaces/romainkh14/brimkern-webgpu
// - Modèles taggés : https://huggingface.co/models?other=brimkern
// - Code : https://github.com/RomainKH/Brimkern (moteur WGSL, format BRIK, SDK npm `brimkern`).
// - Limite assumée à dire dans la PR : `ModelData` n'expose pas la liste des fichiers, donc le
//   prédicat ne peut pas exclure les GGUF SHARDÉS (`-00001-of-000NN`), que le moteur ne lit pas.
//   Le cas est rattrapé côté app par un message d'erreur explicite à l'arrivée, jamais par un écran
//   muet — c'est le compromis que le contrat amont permet.
export default entry;
