# PR 2/2 — « library » (après la PR « local app »)

À ouvrir une fois la PR 1 fusionnée ou au moins relue — les mainteneurs préfèrent une PR par sujet.
Branche partie de `main` amont, pas de la branche de la PR 1.

## Commandes

```bash
cd huggingface.js
git fetch upstream && git checkout -b brimkern-library upstream/main
git apply /Users/romainkhanonyan/Desktop/autres/brimkern/hf/huggingface-js.patch
git checkout -- packages/tasks/src/local-apps.ts
git diff --stat                      # attendu : model-libraries.ts +9, model-libraries-snippets.ts +12
pnpm --filter @huggingface/tasks run check && pnpm --filter @huggingface/tasks run test
pnpm --filter @huggingface/tasks run format:check && pnpm --filter @huggingface/tasks run lint:check
git commit -am "Add Brimkern as a model library"
git push -u origin brimkern-library
gh pr create --repo huggingface/huggingface.js --title "Add Brimkern as a model library" --body-file /Users/romainkhanonyan/Desktop/autres/brimkern/hf/PR-library.body.md
```

⚠️ Si la PR 1 a été fusionnée entre-temps, `git apply` échouera sur `local-apps.ts` (déjà présent) :
utiliser `git apply --include='packages/tasks/src/model-libraries*'` à la place des deux lignes
`apply` + `checkout`.
