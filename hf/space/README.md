---
title: Le Kern — LLM local WebGPU (149 Mo)
emoji: 🖋️
colorFrom: red
colorTo: gray
sdk: static
pinned: false
license: apache-2.0
short_description: Un LLM de 149 Mo qui tourne dans votre onglet, sur votre GPU. Zéro serveur.
models:
  - romainkh14/LFM2.5-230M_BRIK
tags:
  - webgpu
  - on-device
  - brik
---

# Le Kern — un LLM dans l'onglet

Space **statique** (aucun GPU côté Hugging Face) : le modèle **LFM2.5-230M** au format **BRIK**
(149 Mo) est streamé depuis le Hub par requêtes HTTP Range, puis exécuté sur le **GPU du visiteur**
via des kernels WGSL maison. Le prompt et la génération ne quittent jamais la machine ; après le
premier chargement, la page fonctionne **hors ligne**.

- Moteur, format BRIK et SDK : <https://brimkern.com>
- Poids : [`romainkh14/LFM2.5-230M_BRIK`](https://huggingface.co/romainkh14/LFM2.5-230M_BRIK)
  (base [`LiquidAI/LFM2.5-230M`](https://huggingface.co/LiquidAI/LFM2.5-230M), licence LFM 1.0)
- Ouvrir n'importe quel modèle du Hub dans le moteur :
  `https://brimkern.com/chat?model=auteur/dépôt` (GGUF mono-fichier ou BRIK)

Prérequis : un navigateur WebGPU (Chrome/Edge 113+, Safari 18+).

*Le contenu de ce Space est généré par `npm run build:hf-space` depuis le dépôt du projet
(`hf/space/` + le SDK bundlé).*
