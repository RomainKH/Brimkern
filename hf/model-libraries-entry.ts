// PROPOSITION DE PATCH — huggingface/huggingface.js  (Apache-2.0)
// Fichiers cibles :
//   1) packages/tasks/src/model-libraries.ts           → l'entrée `brimkern` (ORDRE ALPHABÉTIQUE :
//      entre `boltzgen` et `cancertathomev2`)
//   2) packages/tasks/src/model-libraries-snippets.ts  → la fonction `brimkern` (ordre alphabétique
//      aussi : juste avant `bm25s`)
// Prérequis : ≥ 1 modèle en ligne avec `library_name: brimkern`. FAIT le 2026-08-30 — les 7 dépôts
// remontent sur `https://huggingface.co/api/models?filter=brimkern`.
//
// ⚠️ Le registre est pour les BIBLIOTHÈQUES (architectures/moteurs), pas les formats de fichier — son
// propre commentaire le dit. On y déclare donc le MOTEUR (SDK npm `brimkern`) ; le conteneur .brik
// n'est qu'un détail d'implémentation.
// ⚠️ `snippets` attend une RÉFÉRENCE DE FONCTION (`snippets.brimkern`), pas la chaîne
// `"snippets.brimkern"` qu'annonçait la version précédente de ce fichier.

// ── 1) model-libraries.ts ─────────────────────────────────────────────────────────────────────
const library = {
	brimkern: {
		prettyLabel: "Brimkern",
		repoName: "brimkern",
		repoUrl: "https://github.com/RomainKH/Brimkern",
		docsUrl: "https://brimkern.com/docs/sdk",
		snippets: snippets.brimkern,
		filter: false, // passera à true au-delà de ~100 modèles taggés (règle du registre)
		// UNE lecture de modèle = UN fichier .brik (conteneur mono-fichier, tokenizer inclus).
		countDownloads: `path_extension:"brik"`,
	},
};

// ── 2) model-libraries-snippets.ts ────────────────────────────────────────────────────────────
// ⚠️ `type="module"` n'est pas décoratif : sans lui, le `await` de dernier niveau est une ERREUR DE
// SYNTAXE et le snippet publié ne s'exécute pas. Vérifié tel quel dans Chrome le 2026-08-30 (page
// servie en statique, LFM2.5-230M streamé depuis le Hub) → « The capital of France is Paris. »
export const brimkern = (model: ModelData): string[] => [
	`<!-- Runs entirely in the visitor's browser, on their GPU (WebGPU). No server, no API key. -->
<script src="https://brimkern.com/sdk.js"></script>
<script type="module">
  const session = Brimkern.createSession({
    // Point at the .brik file of this repo:
    model: "https://huggingface.co/${model.id}/resolve/main/MODEL.brik",
  });
  const answer = await session.ask("Hello!", { onToken: (token) => console.log(token) });
</script>`,
];

export default library;
