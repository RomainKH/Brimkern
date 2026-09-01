# Posts Hugging Face — prêts à publier

Le P1-bis du § 14 de la ROADMAP : « écrire les résultats qu'on a déjà ». Trois posts en anglais
pour le fil https://huggingface.co/posts (le canal des démos WebGPU), rédigés le 2026-09-01,
à copier tels quels. Ordre de force = ordre des fichiers.

| fichier | résultat | source |
|---|---|---|
| `01-three-bits-are-not-enough.md` | la sonde unsloth : sous 4 bits ce modèle casse, quelle que soit la méthode | ROADMAP § 2 |
| `02-a-0.1b-does-not-read-your-docs.md` | G1 0.1B = 6/24 en lecture de fiches ; l'arbitrage Apache chiffré (10/12 vs 12/12) | ROADMAP § 2 |
| `03-the-profiler-lied-by-70x.md` | attention prefill ÷10,9, conv q8 ×1,84, et le piège du profileur (~×70 sur silu) | ROADMAP §§ 10, 13 |

## Les règles que ces posts respectent

1. **Aucun chiffre non mesuré** — chaque nombre vient d'un banc de `scripts/e2e/` cité dans la
   ROADMAP (§§ 2, 10, 11, 13). Le ×1,20 du 7B et le retrait de la fusion silu sont publiés : les
   résultats négatifs sont l'argument de crédibilité, pas une concession.
2. **Aucun lien vers `/vs-webllm`** : le § 14 (P1-bis) exige de re-vérifier ses chiffres avant de
   l'exposer davantage. Tant que ce n'est pas fait, les posts pointent landing, `/chat?model=` et
   GitHub uniquement.
3. Se présenter comme **moteur/SDK**, jamais comme un format de fichier (règle des PR
   `huggingface.js`, § 14) : le `.brik` n'apparaît que comme détail d'implémentation.

## Publier

À la main sur https://huggingface.co/posts (compte `romainkh14`, déjà authentifié pour `hf`) —
l'API des posts n'est pas publique, c'est un copier-coller. Un post par jour ou tous les deux
jours plutôt que les trois d'un coup : chaque post a sa propre audience (quantification, SLM/RAG,
GPU/profiling).

Préalables — TOUS constatés faits le 2026-09-01 :
- `registry.npmjs.org` → `latest: 0.3.0` ✅
- `https://brimkern.com/sdk.js` → 357 694 octets (= `public/sdk.js`) ✅
- les 7 cartes en ligne, `api/models?filter=brimkern` → 7 dépôts ✅

Relais après publication : le même contenu peut nourrir README / `/changelog` — mais le post HF
d'abord, c'est lui qui date la primauté.
