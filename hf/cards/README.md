# Cartes de modèle Hugging Face — prêtes à téléverser

Un fichier par dépôt, à copier tel quel en `README.md` à la racine du dépôt HF correspondant. Ce sont
les cartes de l'**étape 1** de `docs/huggingface-integration.md` — le prérequis écrit des deux PR
`huggingface.js` (snippet « How to use » et bouton « Use this model »).

## État constaté le 2026-08-28 (avant ces cartes)

| dépôt | carte | tags |
|---|---|---|
| `LFM2.5-230M_BRIK` — **le défaut du produit** | **404** | aucun |
| `RWKV-7-G1a-0.4B_BRIK` | ✅ (en français) | complets |
| `RWKV-7-G1-0.1B_BRIK` | 404 | aucun |
| `Qwen3-4B_BRIK` | 404 | aucun |
| `Qwen2.5-0.5B-Instruct_BRIK` | 404 (README de 21 octets) | `license:mit` — **FAUX** |
| `brimkern-image-BRIK` | 404 | aucun |
| `brimkern-video-BRIK` | 404 | aucun |

Six dépôts sur sept sans carte, et le seul correctement tagué était le repli Apache 304 Mo — pas le
modèle vers lequel pointent la landing, `/local-ai`, le widget et chaque lien publié. Conséquence
directe : `https://huggingface.co/models?other=brimkern` ne listait rien.

## Trois choix assumés

1. **En anglais.** L'ancienne carte du G1a était en français ; les recherches sur ce sujet sont
   massivement anglophones, et c'est la raison pour laquelle le site lui-même a fait de l'anglais sa
   version canonique (§ 0 de la ROADMAP). La carte du G1a est donc réécrite en anglais elle aussi,
   pour que les sept parlent d'une seule voix.
2. **Aucun chiffre non mesuré.** Chaque nombre vient d'un banc de `scripts/e2e/` ou d'un `HEAD` sur le
   CDN (tailles relevées le 2026-08-28). Là où rien n'a été mesuré — le débit du Qwen3-4B, les
   secondes par clip vidéo — la carte le DIT au lieu d'estimer.
3. **Les résultats négatifs sont publiés.** Le G1 0.1B annonce son 6/24 en lecture de documents et
   dit à quoi il ne sert pas ; la carte du LFM2.5 explique pourquoi 149 Mo est un plancher mesuré et
   non un choix. C'est ce qu'un lecteur technique croit, et c'est ce qui distingue ces cartes de la
   moyenne du Hub.

## Deux corrections que ces cartes portent

- **`Qwen2.5-0.5B-Instruct_BRIK` était tagué `license:mit`** : le modèle source est **Apache-2.0**
  (vérifié sur l'API du Hub le 2026-08-28). Le tag vient de la carte, donc téléverser celle-ci le
  corrige.
- **L'image n'est PAS librement commercialisable** : SD-Turbo est publié comme artefact de recherche
  (« For commercial use, please refer to https://stability.ai/license »), et son dépôt ne porte aucun
  champ `license`. La carte le dit en clair, par composant. SDXS est en openrail++, la vidéo en
  creativeml-openrail-m. Convertir des poids ne change pas leur licence.

## Téléverser

Depuis un dossier de travail quelconque, avec `hf` (ou `huggingface-cli`) authentifié :

```bash
hf auth login                                   # une fois
for r in LFM2.5-230M_BRIK RWKV-7-G1-0.1B_BRIK RWKV-7-G1a-0.4B_BRIK \
         Qwen3-4B_BRIK Qwen2.5-0.5B-Instruct_BRIK brimkern-image-BRIK brimkern-video-BRIK; do
  hf upload "romainkh14/$r" "hf/cards/$r.md" README.md --commit-message "Carte de modèle"
done
```

Puis vérifier que le tag prend :

```bash
curl -s "https://huggingface.co/api/models?other=brimkern" | python3 -m json.tool | grep '"id"'
```

⚠️ Rappel du § 1 de `docs/huggingface-integration.md` : **déployer le site AVANT** de faire pointer
des visiteurs sur ces cartes — un `.brik` à embeddings q4 exige le runtime déployé, et les deeplinks
des cartes mènent tous à `brimkern.com`.
