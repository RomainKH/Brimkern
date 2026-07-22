# Prochains modèles à adapter — état des lieux et recommandation

*Étude du 2026-07-18 — demande : « recherche d'adaptation d'autres modèles (Microsoft, Mistral…), et
comment on optimise la lecture des modèles Qwen/Gemma/DeepSeek aujourd'hui ».*

## 1. Ce que le moteur sait lire aujourd'hui (et comment)

L'adaptation par archi passe par **des knobs optionnels sur `LayerCfg`/`Manifest.config`** (kernels
inchangés par défaut = chemin Qwen/Llama) :

| Archi GGUF | État | Mécanismes utilisés |
|---|---|---|
| `qwen2` (Qwen 2/2.5, **DeepSeek-R1-Distill-Qwen**) | ✅ la mieux rodée | biais q/k/v, RoPE rotate_half, GQA, KV q8, BRIK natif q4/q8/mixed |
| `gemma`/`gemma2` (Gemma 2 2B) | ✅ | `act: gelu`, `embedScale √d`, softcaps attention+logits, `attnScale`, doubles normes sandwich (`post_attention_norm`/`post_ffw_norm`) — lent (2,6B + vocab 256k), perf non traitée |
| `qwen2vl` (vision, 2026-07-18) | ✅ | M-RoPE (`mropeSections` + positions 3D), injection d'embeddings |
| `llama` (Llama 2/3, Mistral 7B) | ❌ **retiré des presets** | llama.cpp **permute les lignes de Q/K** à la conversion GGUF (convention RoPE « norm » interleaved) ; notre kernel est rotate_half (neox) → charabia. Cf. mémoire `llama-arch-broken` |

Côté **lecture/chargement** (commun à toutes les archis, déjà optimisé) : GGUF parsé côté client,
fetch coalescé par couche (1 plage HTTP/bloc), précision native sans conversion (BRIK q4/q8/mixed,
f16 brut si shader-f16), quantification GPU sans boucle CPU, projection logits q8-résidente,
tokenizer embarqué dans le BRIK. **Une nouvelle archi hérite de tout ça gratuitement** — le travail
d'adaptation, c'est uniquement les kernels/le forward, jamais la tuyauterie de lecture.

## 2. Le paysage mi-2026 (« small », ≤ 4B, GGUF dispo)

| Modèle | Taille | Licence | Archi / difficultés pour nous | Effort |
|---|---|---|---|---|
| **Qwen3 dense** (0.6B / 1.7B / 4B) | ≤ 4B | Apache 2.0 | `qwen3` = qwen2 **sans biais** + **QK-Norm** (RMSNorm par tête sur q et k avant RoPE, tenseurs `attn_q_norm`/`attn_k_norm`) ; raisonnement hybride `/think` | ★ (petit) |
| **Llama 3.2** (1B / 3B) | ≤ 3B | Llama | `llama` : il suffit de **dé-permuter les lignes de Q/K au chargement** (permutation statique inverse de celle de convert_hf_to_gguf, à granularité de LIGNES → marche sur les bytes bruts de TOUS les quants k) | ★★ (le fix) |
| **SmolLM3-3B** (HF, jul. 2025) | 3B | Apache 2.0 | llama-like + **NoPE** (RoPE sauté 1 couche sur 4, liste dans les métadonnées) + `/think` | ★ après le fix llama |
| **Phi-4-mini** (Microsoft, fév. 2025) | 3.8B | MIT | `phi3` : **QKV fusionné** (split au chargement), gate_up fusionné, **LongRoPE** (2 jeux de facteurs de fréquence courts/longs → le kernel rope doit lire un buffer de facteurs), partial rotary | ★★★ |
| **Ministral 3** (Mistral, déc. 2025 — 3B/8B/14B, Instruct + **Reasoning**) | 3B | Apache 2.0 (3B) | GQA, tied embeddings, RoPE θ=1e6 + **YaRN** (factor 16 + température softmax) + **SWA interleavée 1 pleine : 3 fenêtrées** | ★★★ |
| **Gemma 3** (1B texte / 4B multimodal) | ≤ 4B | Gemma | `gemma3` : SWA **5:1** (fenêtre ~512-1024), **QK-Norm** (remplace les softcaps), double base RoPE (10k local / 1M global) | ★★★ |
| **Qwen3.5 small** (mars 2026 — 0.8B→9B) | 4B | Apache 2.0 | **Hybride Gated DeltaNet 3:1** (75 % des couches en attention LINÉAIRE O(n), récurrence à états) + multimodal natif | ★★★★★ (nouvelle famille de kernels) |

Briques transverses qui reviennent dans plusieurs candidats :
- **QK-Norm** (Qwen3, Gemma 3) : réutiliser le kernel `rmsnorm` existant vu en [seq·nHeads, headDim]
  — une ligne de plus dans le forward, gatée par la présence des tenseurs.
- **Attention fenêtrée (SWA)** (Ministral, Gemma 3) : une condition `j ≥ t − window` dans les
  kernels d'attention causale + un `window` par couche dans `LayerCfg`. KV cache plein dans un
  premier temps (correct, juste pas l'économie mémoire), ring buffer ensuite.
- **RoPE à facteurs** (YaRN Ministral, LongRoPE Phi) : étendre `rope` avec un buffer optionnel de
  facteurs par fréquence — même mécanique que le buffer de positions du M-RoPE.

## 3. Recommandation

**Prochain portage : Qwen3 dense (4B desktop + 1.7B, et 0.6B pour le MOBILE).** C'est l'écart
effort/valeur le plus court : notre archi la mieux rodée + deux petits deltas (QK-Norm, pas de
biais), qualité nettement au-dessus de Qwen2.5 à taille égale, raisonnement `/think` natif (notre
UI deepseek le gère déjà), et le 0.6B est un successeur direct du 0.5B mobile (BRIK mixed → même
pipeline). Validation : selfValidate QK-Norm + A/B vs Qwen2.5 aux mêmes prompts.

**Ensuite, dans l'ordre :**
1. **Le fix Llama** (dé-permutation au chargement, gatée `arch === 'llama'`) — une transformation
   de bytes au chargement, zéro kernel touché, et il débloque TOUTE la famille : Llama 3.2,
   SmolLM3 (+ NoPE trivial), et prépare Ministral. Répare aussi la promesse du CLAUDE.md.
2. **Ministral 3 3B** (la demande « Mistral ») — nécessite SWA + YaRN ; la variante *Reasoning*
   3B est un excellent argument catalogue.
3. **Phi-4-mini** (la demande « Microsoft ») — MIT, le plus fort raisonneur ≤ 4B ; LongRoPE est le
   morceau sérieux, à faire après la mécanique « facteurs de RoPE » de Ministral (YaRN), qu'il
   réutilise.
4. **Gemma 3 1B** — candidat mobile texte pur une fois la SWA en place (partagée avec Ministral).
5. **Qwen3.5 small** — à traiter comme un CHANTIER À PART (kernels d'attention linéaire/récurrence,
   états persistants — l'équivalent d'un « moteur v2 »), pas comme un portage. Le gain est réel
   (O(n) = plus de mur de prefill/contexte, exactement notre douleur mobile) mais c'est plusieurs
   semaines, pas plusieurs jours.

## 4. Sources

- Qwen3.5 : huggingface.co/blog/mlabonne/qwen35 (« Nobody Agrees on Attention Anymore »),
  awesomeagents.ai/news/qwen-3-5-small-models-series, blog.overshoot.ai/blog/qwen3.5-on-overshoot
- Ministral 3 : huggingface.co/docs/transformers/model_doc/ministral3,
  bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF, ritvik19.medium.com (Papers Explained 526)
- Comparatifs ≤ 4B 2026 : localaimaster.com/blog/small-language-models-guide-2026,
  bentoml.com/blog/the-best-open-source-small-language-models
- SmolLM3 : huggingface.co/blog/smollm3 · Phi-4-mini : microsoft (MIT, arch phi3)
