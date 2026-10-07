# Les deux PR `huggingface/huggingface.js` — patch vérifié, procédure, texte de PR

C'est l'étape qui met **« Use this model » sur des milliers de pages de dépôts GGUF** : le playbook
llama.cpp/Ollama, et le seul levier de VOLUME du plan Hugging Face. Le patch complet et VÉRIFIÉ est dans `hf/huggingface-js.patch` — c'est la seule source de vérité.
Les deux brouillons `.ts` qui vivaient ici ont été supprimés le 2026-08-30 : ils ne compilaient dans
AUCUN dépôt (ils référencent `ModelData`, `snippets`, `isLlamaCppGgufModel`, qui sont amont), donc
rien ne les vérifiait — et c'est précisément comme ça qu'ils avaient accumulé cinq erreurs en dix-huit
jours. Un patch, lui, s'applique ou échoue.

## État des prérequis (re-vérifié le 2026-10-07)

| prérequis | état |
|---|---|
| ≥ 1 modèle taggé `library_name: brimkern` en ligne | ✅ **8 dépôts** sur `api/models?filter=brimkern` (dont `Qwen3-0.6B-Shop-ENFR_BRIK`, défaut du SDK 0.8.0) |
| Site déployé, SDK publié | ✅ `brimkern.com/sdk.js` = `public/sdk.js` octet pour octet (512 263 o), `brimkern@0.8.0` = `latest` sur npm |
| Pages citées par la PR | ✅ `/local-ai`, `/docs/sdk`, `/chat?model=…` répondent 200 ; le deeplink lit `model` et `file` (`src/lib/deeplink.ts`) |
| Space démo (cité par les PR) | ⏳ **toujours pas publié** (`spaces/romainkh14/brimkern-webgpu` → 401) — rebâti sur le SDK 0.8.0, `test:hfspace` **10/10** le 2026-10-07 |
| Le patch s'applique sur l'amont du jour | ✅ **régénéré** contre `huggingface.js@e60c7eeab2` (2026-10-06) : l'ancien passait avec un décalage (« No such line 795 »), un `git apply` strict l'aurait refusé |
| Le patch passe leur CI locale | ✅ dans `packages/tasks` : `tsc` 0 erreur, `vitest` 64/64, `oxfmt --check` propre, `eslint` propre |

## Ce que la vérification a changé dans les entrées préparées le 2026-08-12

Elles auraient été refusées au premier CI. Chaque point a été confronté au code amont, pas supposé :

1. **`model.siblings` n'existe pas sur `ModelData`.** L'ancien prédicat filtrait les fichiers du
   dépôt ; le contrôle rejoué donne `error TS2339: Property 'siblings' does not exist on type
   'ModelData'`. Le prédicat amont pour « ce dépôt porte un GGUF chargeable » est
   `isLlamaCppGgufModel(model)`, c'est-à-dire `!!model.gguf?.context_length` — une donnée que le Hub
   calcule lui-même, utilisée par toutes les apps GGUF du fichier.
2. **`snippets` attend une référence de fonction** (`snippets.brimkern`), pas la chaîne
   `"snippets.brimkern"`.
3. **L'URL du dépôt était fausse** : `github.com/romainkhanoyan/brimkern` n'existe pas, c'est
   `github.com/RomainKH/Brimkern`. Un lien mort dans le registre du Hub.
4. **Le nom du projet** : `le-kern` / « Le Kern » partout, alors que le domaine, le paquet npm, les
   sept cartes de modèle et le Space disent **Brimkern**.
5. **Le snippet publié ne s'exécutait pas** : un `await` de dernier niveau dans un `<script>`
   classique est une **erreur de syntaxe**. Il porte maintenant `type="module"`, et il a été exécuté
   tel quel dans Chrome (page statique, LFM2.5-230M streamé depuis le Hub) → *« The capital of France
   is Paris. »*

## Une limite à annoncer dans la PR plutôt qu'à cacher

`ModelData` n'expose pas la liste des fichiers, donc le prédicat **ne peut pas** exclure les GGUF
shardés (`-00001-of-000NN`), que le moteur ne lit pas. Le cas est rattrapé côté app par un message
d'erreur explicite à l'arrivée — jamais un écran muet. C'est le compromis que le contrat amont permet,
et le dire vaut mieux que le laisser découvrir.

## Procédure

```bash
gh repo fork huggingface/huggingface.js --clone --remote     # ou fork via l'UI puis clone
cd huggingface.js && git checkout -b brimkern-local-app
git apply /chemin/vers/brimkern/hf/huggingface-js.patch
pnpm install
pnpm --filter @huggingface/tasks run check                   # tsc
pnpm --filter @huggingface/tasks run test                    # vitest
pnpm --filter @huggingface/tasks run format                  # oxfmt (leur formateur)
pnpm --filter @huggingface/tasks run lint
# commit + push : NON, pas ici — une PR par sujet, voir PR-local-app.md puis PR-library.md
```

⚠️ Le patch touche **trois** fichiers et couvre les **deux** registres. Les mainteneurs préfèrent une
PR par sujet : la procédure exacte de chacune est dans son fichier ci-dessous.

## Textes de PR prêts à coller

Un fichier par PR — titre, corps, commandes exactes :
- [`PR-local-app.md`](PR-local-app.md) — la PR « local app », **à ouvrir en premier** (le bouton
  « Use this model » sur les dépôts GGUF : le levier de volume) ;
- [`PR-library.md`](PR-library.md) — la PR « library » (snippet + compteur de téléchargements des
  `.brik`), **ensuite**, séparément.

Les deux PR citées comme modèles ont été re-vérifiées le 2026-10-07 : #719 « Add Jellybox Local App »
et #885 « Add VFI-Mamba as library », toutes deux fusionnées.
