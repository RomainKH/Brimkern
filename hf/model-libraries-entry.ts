// PROPOSITION DE PATCH — huggingface/huggingface.js
// Fichiers cibles :
//   1) packages/tasks/src/model-libraries.ts           → l'entrée `brimkern` (ordre alphabétique)
//   2) packages/tasks/src/model-libraries-snippets.ts  → la fonction `brimkern` ci-dessous
// Voir docs/huggingface-integration.md. Prérequis : ≥ 1 modèle en ligne avec
// `library_name: brimkern` (vérifiable sur https://huggingface.co/models?other=brimkern).
//
// ⚠️ Le registre est pour les BIBLIOTHÈQUES (architectures/moteurs), pas les formats de fichier :
// on y déclare le MOTEUR (SDK npm `brimkern`), le conteneur .brik n'étant qu'un détail interne.

// ── 1) model-libraries.ts ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const library = {
	brimkern: {
		prettyLabel: "BRIMKERN",
		repoName: "brimkern",
		repoUrl: "https://github.com/romainkhanoyan/brimkern",
		docsUrl: "https://brimkern.com/local-ai",
		snippets: "snippets.brimkern", // → la fonction ci-dessous
		filter: false,                  // passera à true au-delà de ~100 modèles taggés
		// UNE lecture de modèle = UN fichier .brik (conteneur mono-fichier, tokenizer inclus).
		countDownloads: `path_extension:"brik"`,
	},
};

// ── 2) model-libraries-snippets.ts ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const brimkern = (model: { id: string }): string[] => [
	`<!-- Runs fully in the browser on the visitor's GPU (WebGPU). No server, no API key. -->
<script src="https://brimkern.com/sdk.js"></script>
<script>
  const session = Brimkern.createSession({
    model: "https://huggingface.co/${model.id}/resolve/main/MODEL.brik",
  });
  const reply = await session.ask("Hello!", { onToken: (t) => console.log(t) });
</script>`,
];

export default library;
