# Moteur v2 — attention linéaire / récurrence (design)

But : lever le mur du cache KV (mémoire + latence en O(n) sur le contexte) en remplaçant
l'attention softmax par une **récurrence à état de taille fixe**. Débloque le contexte long / le
raisonnement « high » sur machines faibles, et les archis 2026 (RWKV, Mamba-2, LFM2, DeltaNet).
C'est aussi l'enabler du produit « IA on-device embarquable » : un petit modèle robuste qui tourne
partout, à mémoire constante.

Statut : **design, pas encore de code.** Chantier multi-phases, chaque kernel WGSL suivra la règle
du repo (référence CPU + selfValidate + repli + kill-switch URL).

## Pourquoi le KV est le mur
Dense ~4B (Qwen3-4B, 36 couches, GQA) : cache KV f16 ≈ **0,3 Go à 2k tokens, ~4,7 Go à 32k**. Il
grossit à chaque token → coût mémoire + bande passante croissants (c'est le « high » qui rame, et le
mur mobile). Une récurrence garde un **état fixe (quelques Mo)** indépendant du contexte.

## Cible n°1 : RWKV-7 « Goose » (décision)
Choisi pour la **tractabilité d'un premier portage**, pas pour la valeur produit maximale (ça, c'est
DeltaNet, plus tard). Voir `veille-modeles` / la note veille pour le comparatif complet.
- **Pur récurrent, zéro couche softmax** → on teste le chemin v2 isolément, sans dispatch hybride ni
  cohabitation avec l'attention existante. Test le plus propre de « mémoire constante ».
- **GGUF natif** llama.cpp (PR #12412, op `GGML_OP_RWKV_WKV7`) avec implémentations **naïves de
  référence en Vulkan/Metal/CUDA/CPU** → on transpose en WGSL + on a la **réf CPU pour selfValidate**.
- **Plus petit modèle** : RWKV-7 World 0.1B (L12, D768, ~200-390 Mo), puis 0.4B (L24, D1024).
  État ~1,2 Mo constant (0.1B). Apache-2.0.

### Maths du décodage (1 token, par tête ; head_size = H)
État `S` = matrice `H×H` par tête. Par token (delta rule généralisée + gating vectoriel) :
- entrées projetées : receptance `r`, clé `k`, valeur `v`, décroissance en contexte `w` (∈(0,1)^H),
  et les termes delta `a`, `b` (retrait/écriture data-dépendants), + token-shift (mix linéaire t/t-1).
- mise à jour : `S_t = S_{t-1} · diag(w_t) + (delta-rule sur k,v avec a,b)` — **une seule mise à
  jour matrice-état par tête**, pas de softmax.
- sortie : `o_t = S_t · r_t`, puis channel-mix (type FFN).
Kernel WGSL = boucle par tête sur H×H (une invocation/tête ou /(tête,ligne)), MAC élément par
élément + produits matrice-vecteur. Transposer l'op de référence `rwkv_wkv7`.

### Prefill
Récurrence pure **séquentielle** au POC (même kernel que le décodage, en boucle sur les tokens du
prompt) — le chunk-scan parallèle n'est PAS un prérequis, on l'ajoute après pour accélérer le prefill.

## Intégration dans le moteur actuel
Le moteur enregistre chaque couche via `recordLayerKV` (kernels.ts) :
`norm → Q/K/V → RoPE → attention(cache KV) → proj → résidu → FFN`. Tout SAUF le sous-bloc attention
est réutilisé (RMSNorm, FFN/channel-mix, résidus, dispatch matmul q3/q4/q8, boucle `runDecodeGpu`).

Plan d'intégration :
1. **`recordLayerLinear`** en miroir de `recordLayerKV` : remplace `Q/K/V→RoPE→attention(KV)` par
   `projections RWKV → token-shift → rwkv_wkv7(state) → sortie`.
2. **Buffer d'état persistant** par couche à la place du `KvEntry` (map `kvGpu`) : `StateEntry`
   (matrice H×H/tête), alloué une fois, mis à jour en place, **jamais réalloué** (taille constante).
   Reset sur nouvelle session (comme le KV aujourd'hui).
3. **Pur (RWKV) = pas de dispatch hybride.** Un modèle RWKV a toutes ses couches en `recordLayerLinear`.
   (Le dispatch par couche — quelques couches softmax + majorité linéaire — arrive avec LFM2, phase 3.)
4. **Bloc RWKV** : token-shift (mix t/t-1, quasi gratuit), channel-mix (FFN-like, réutilise swiglu/geglu
   ou une variante), pas de RoPE (RWKV n'en a pas).

## selfValidate (obligatoire)
Stage `rwkv_wkv7` : état + entrées aléatoires → kernel WGSL vs récurrence de référence en JS/CPU
(portée de l'op `GGML_OP_RWKV_WKV7`), tolérance `close` comme les stages matmul. Kill-switch URL
`?rwkv=0` → repli (refus de charger ou chemin CPU) si le kernel diverge. Le modèle ne charge pas si
le gate échoue.

## BRIK / chargement
Réutilise le pipeline BRIK (convert/loader) : ajouter l'arch RWKV au profil (`BrikArchProfile` :
nb couches, D, head_size, nb têtes, dims des projections RWKV), et le mapping de noms de tenseurs
GGUF RWKV → nos noms. Les poids sont des matmuls normaux → quantifiables q8/q4/q3 comme le reste.
État NON quantifié (petit). Tokenizer RWKV World embarqué comme les autres BRIK.

## Plan par phases
1. **RWKV-7 0.1B** : `recordLayerLinear` + `rwkv_wkv7` (décodage) + état persistant + selfValidate +
   BRIK RWKV + tokenizer World. Prefill séquentiel. Valide TOUT le chemin récurrent pur en navigateur
   (réponse cohérente + état constant démontré). Puis 0.4B.
2. **Mamba-2 130M** : réutilise l'infra d'état récurrent ; ajoute conv1d causale + attaque le
   chunk-scan SSD (prefill rapide). Décodage le plus simple (scaling scalaire/tête).
3. **LFM2-350M** : introduit le **dispatch hybride** (conv courte triviale + attention softmax
   existante) — apprend la cohabitation linéaire/softmax sur des kernels conv faciles.
4. **Gated DeltaNet (Qwen3.x)** : la vraie valeur produit, mais repose sur les 3 briques ci-dessus
   (état récurrent + chunk-scan + dispatch hybride) + décodage le plus lourd. Grand chantier final.

## Pièges (confirmés)
- Ne PAS commencer par Gated DeltaNet (pas de petit dense — 80B MoE — décodage le plus lourd, hybride).
- Le chunk-scan parallèle (Mamba/GLA/DeltaNet) : le contourner en séquentiel au POC.
- GLA : maths propres mais écosystème GGUF/modèles trop mince pour valider → pas une cible.
- LFM2 réduit mais **n'élimine pas** le KV (6 couches d'attention) — gain partiel sur l'objectif.

## Structure réelle RWKV-7 0.1B (inspectée 2026-07-20, GGUF f16 zhiyuan8)
arch `rwkv7` ; d=768, **head_size=64 → 12 têtes**, ffn=3072, 12 couches, vocab 65536, ctx 1M.
LoRA ranks : decay 64, iclr 64, value-mix 32, gate 128. eps LN 1e-5.

**Shared** : `token_embd.weight` [768,65536] + `token_embd_norm.{weight,bias}` (LN post-embed !) ;
`output.weight` [768,65536] (NON tied) + `output_norm.{weight,bias}` (LN final).

**Par couche `blk.N`** (LayerNorm partout, PAS RMSNorm) :
- `attn_norm.{w,b}` (LN avant time-mix), `attn_norm_2.{w,b}` (LN avant channel-mix).
- Time-mix : `time_mix_lerp_fused` [768,1,1,6] (6 lerps token-shift r/w/k/v/a/g) ;
  `time_mix_{key,value,receptance,output}.weight` [768,768] ;
  décroissance `time_mix_{w0[768],w1[768,64],w2[64,768]}` ; iclr `time_mix_{a0,a1,a2}` ;
  résidu-valeur `time_mix_{v0,v1,v2}` ; gate `time_mix_{g1[768,128],g2[128,768]}` ;
  modulation `time_mix_{k_k[768],k_a[768],r_k[768]}` ; `time_mix_ln.{w,b}` (GroupNorm/tête sur WKV).
- Channel-mix : `channel_mix_lerp_k` [768] ; `channel_mix_key.weight` [768,3072] ;
  `channel_mix_value.weight` [3072,768] (FFN squared-ReLU).

**✅ Forward VALIDÉ 2026-07-20** (`scripts/rwkv-cpuref.cjs`, réf CPU lisant les vrais poids f16) :
« The capital of France is » → « **Paris.** - The capital of the United States is Washington, D.C. »
— cohérent, réponse correcte. La sémantique RWKV-7 est bonne.
⚠️ **Piège majeur (bug trouvé)** : les tenseurs 2-D GGUF sont en **ne[0] contigu** = orientation
`W[o*IN + i]` (out en lignes, IN contigu — comme `matvec`/recMM). Mes boucles LoRA + la lecture de
`lerp_fused` étaient TRANSPOSÉES → charabia. `lerp_fused` [768,1,1,6] = **6 blocs de 768** (lerp k à
l'offset `k*768`), PAS 6 innermost. Toutes les projections (w1/w2, a1/a2, v1/v2, g1/g2) suivent
`matvec` (out[o]=Σ_i W[o*IN+i]·x[i]). Constantes confirmées : décroissance `w = exp(-0.606531·σ(w0 +
tanh(xw·w1)·w2))` (0.606531 = e^-0.5), GroupNorm eps 64e-5, WKV `a_=-kk` (kk L2-normalisé/tête),
`b_=kk·a`, bonus `Σ_head(r·k·r_k)·v`. Le port GPU réutilise CETTE réf comme oracle (GPU==CPU).

**Modèle produit** : le **RWKV-7 « G1 » 0.1B** est la variante INSTRUCT (même archi → forward validé
s'applique), ~83 Mo q3, vocab 65k, Apache — c'est LE modèle-widget. (Le world-0.1B testé est base.)

**Forward time-mix (détail, confirmé sur ggml build_rwkv7)** :
LN → token-shift (sx = x_prev − x ; xr/xw/xk/xv/xa/xg = x + sx·lerp_i) → r=xr·Wr, k=xk·Wk, v=xv·Wv ;
w = f(w0 + tanh(xw·w1)·w2) [formule décroissance exacte à confirmer], a = sigmoid(a0 + (xa·a1)·a2),
g = sigmoid(xg·g1)·g2 ; résidu valeur (couche>0) ; modulation k (k_k normalisé, k·(1+(a−1)·k_a)) ;
a_wkv/b_wkv dérivés de kk/a → **kernel `rwkv_wkv7`** (livré) ; GroupNorm(ln) + bonus r·k ; ×g → Woutput.
⚠️ Les formules `w`/`a`/`b` doivent matcher ggml bit-près — c'est LE point à valider contre le modèle
(un test self-consistency GPU==CPU ne le garantit pas). Channel-mix : LN → token-shift(lerp_k) →
(relu(xk·Wk)²)·Wv.

**Tokenizer** : `tokenizer.ggml.model = rwkv`, 65536 tokens byte-level → **World tokenizer (trie)** à
implémenter depuis le vocab embarqué (pas un tokenizer transformers.js).

## Lien produit
RWKV-7 0.1B (~200-390 Mo, état ~1,2 Mo constant) = la classe de taille + le profil mémoire d'un
**widget IA embarquable** sur n'importe quel site, sur n'importe quelle machine. Le moteur v2 rend ce
produit défendable ; le POC RWKV-7 en est la première brique.

## Mise à jour 2026-07-21 — LFM2 100 % RÉSIDENT livré
Le POC `forwardToken` (glu en JS + un matmul par projection → ~100 `submit`+`mapAsync`/token, d'où le
gel du chat, surtout au re-prefill lors d'un **switch de modèle**) est remplacé par un chemin RÉSIDENT
(`kernels.ts` : `lfm2LogitsGpu`/`lfm2TopKGpu`, miroir de `runDecodeGpu`/`decodeTopKQ8`) : tout le stack
hybride conv+attention enregistré dans UNE soumission, UN readback ; état conv `(LC-1)·D` + cache K/V
f32 **résidents GPU** par couche (keyés `sessionId`/`pastLen`), `recLfm2ShortConv` garde l'état sur GPU.
Aucun nouveau WGSL (réutilise `recRmsnorm`/`recMM`/`recRope`/`recAttention`/`recBinary` + `lfm2_shortconv`).
Validé **token-exact** vs `forwardToken` (banc /lfm2-test dev), décodage ~2,3× (13,5→31 t/s Mac), prefill
= 1 submit. Gate `lfm2ResidentOk` + repli JS + `?lfm2resident=0`. Aussi ajouté : `generateResident` (SDK).
⚠️ **RWKV garde le même POC-gel `forwardToken` → à porter à l'identique** (prochain chantier moteur v2).
