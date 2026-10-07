# PR 1/2 — « local app » (à ouvrir en premier)

Prérequis : le Space `romainkh14/brimkern-webgpu` est PUBLIÉ (le corps de PR le cite comme démo).
Vérifier : `curl -s -o /dev/null -w '%{http_code}\n' https://huggingface.co/spaces/romainkh14/brimkern-webgpu` → 200.

## Commandes

```bash
gh repo fork huggingface/huggingface.js --clone --remote
cd huggingface.js && git checkout -b brimkern-local-app
git apply /Users/romainkhanonyan/Desktop/autres/brimkern/hf/huggingface-js.patch
git checkout -- packages/tasks/src/model-libraries.ts packages/tasks/src/model-libraries-snippets.ts
git diff --stat                      # attendu : 1 fichier, packages/tasks/src/local-apps.ts, +14
pnpm install
pnpm --filter @huggingface/tasks run check && pnpm --filter @huggingface/tasks run test
pnpm --filter @huggingface/tasks run format:check && pnpm --filter @huggingface/tasks run lint:check
git commit -am "Add Brimkern (in-browser WebGPU engine) as a local app"
git push -u origin brimkern-local-app
gh pr create --repo huggingface/huggingface.js --title "Add Brimkern (in-browser WebGPU engine) as a local app" --body-file /Users/romainkhanonyan/Desktop/autres/brimkern/hf/PR-local-app.body.md
```

Le corps est dans `PR-local-app.body.md` (fichier séparé pour `--body-file`, rien à recopier à la main).
