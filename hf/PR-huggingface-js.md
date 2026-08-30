# Les deux PR `huggingface/huggingface.js` — patch vérifié, procédure, texte de PR

C'est l'étape qui met **« Use this model » sur des milliers de pages de dépôts GGUF** : le playbook
llama.cpp/Ollama, et le seul levier de VOLUME du plan Hugging Face. Le patch complet est dans
`hf/huggingface-js.patch` ; les entrées commentées sont dans `hf/local-apps-entry.ts` et
`hf/model-libraries-entry.ts`.

## État des prérequis (vérifié le 2026-08-30)

| prérequis | état |
|---|---|
| ≥ 1 modèle taggé `library_name: brimkern` en ligne | ✅ **7 dépôts** sur `api/models?filter=brimkern` |
| Site déployé, SDK publié | ✅ `sdk.js` 357 694 o, `brimkern@0.3.0` sur npm |
| Space démo (cité par les PR) | ⏳ à publier — `npm run build:hf-space`, testé 10/10 |
| Le patch compile chez eux | ✅ `tsc --strict` sur les 3 fichiers : 0 erreur |

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
git commit -am "Add Brimkern (in-browser WebGPU engine) as a local app and model library"
git push -u origin brimkern-local-app
```

⚠️ Le patch touche **trois** fichiers et couvre les **deux** registres. Les mainteneurs préfèrent
souvent une PR par sujet : `git apply` puis `git restore packages/tasks/src/model-libraries*.ts` pour
n'envoyer d'abord que la PR « local app » (celle qui rapporte le volume), la « library » ensuite.

## Texte de PR proposé (à adapter)

> **Add Brimkern — an in-browser WebGPU inference engine — as a local app**
>
> Brimkern runs LLMs entirely in the browser tab on the visitor's GPU: hand-written WGSL kernels, no
> wasm runtime, no inference server, no API key. It reads **single-file GGUF repos from the Hub
> directly** (streamed by HTTP Range, cached, then usable offline), plus its own `.brik` container.
>
> Because it is a *web* app, the deeplink installs nothing — it opens the model in a tab, which makes
> it the lightest possible "Use this model" target.
>
> - Live demo (static Space, no HF GPU): https://huggingface.co/spaces/romainkh14/brimkern-webgpu
> - Models: https://huggingface.co/models?other=brimkern
> - Docs: https://brimkern.com/local-ai · Code (MIT): https://github.com/RomainKH/Brimkern
> - Example deeplink: https://brimkern.com/chat?model=bartowski/Qwen2.5-0.5B-Instruct-GGUF
>
> Known limitation, stated up front: `ModelData` does not expose the file list, so the predicate
> cannot exclude sharded GGUFs, which the engine does not read. Those land on an explicit error
> message in the app rather than a blank screen.
>
> PRs I used as a model: #719 (Jellybox, local app) and #885 (VFIMamba, library).
