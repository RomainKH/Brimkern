---
library_name: brimkern
license: {{LICENSE}}
base_model: {{BASE_MODEL}}
pipeline_tag: text-generation
tags:
  - brik
  - webgpu
  - on-device
  - browser
  - quantized
---

# {{MODEL_NAME}} — BRIK ({{TIER}})

Poids **{{BASE_MODEL}}** convertis au format **BRIK** pour tourner **dans le navigateur** sur le
GPU du visiteur (WebGPU), sans serveur d'inférence.

| | |
|---|---|
| Fichier | `{{FILE}}` ({{SIZE}}) |
| Quantification | {{TIER_DESC}} |
| Tokenizer | embarqué dans le fichier (aucun téléchargement séparé) |
| Contexte | {{CONTEXT}} |
| Moteur | [BRIMKERN / Le Kern](https://brimkern.com) — kernels WGSL maison |

## Essayer en un clic

👉 **https://brimkern.com/chat?model={{REPO_ID}}**

Le modèle est streamé par plages HTTP (Range), mis en cache par le navigateur, puis réutilisable
**hors ligne**. Rien n'est envoyé à un serveur : le prompt et la génération restent sur la machine.

## Intégrer dans un site (SDK)

```html
<script src="https://brimkern.com/sdk.js"></script>
<script>
  Brimkern.embed({
    model: 'https://huggingface.co/{{REPO_ID}}/resolve/main/{{FILE}}',
    system: 'Tu es l’assistant du site. Réponds brièvement, en français.',
    title: 'Assistant',
  });
</script>
```

API programmatique (sans widget) :

```js
const session = Brimkern.createSession({
  model: 'https://huggingface.co/{{REPO_ID}}/resolve/main/{{FILE}}',
});
const reply = await session.ask('Bonjour !', { onToken: (t) => console.log(t) });
```

## Le format BRIK

Conteneur mono-fichier dérivé du GGUF, pensé pour le **streaming navigateur** :

- **un shard par bloc de transformeur** → le chargement demande une plage HTTP par couche
  (au lieu de 9-12 requêtes par couche), reprise gratuite après coupure ;
- **quantification native lue telle quelle** par les kernels WGSL (int3/int4/int8, pas de
  déquantification CPU au chargement) ;
- **tokenizer embarqué** → fichier autoportant, mode hors-ligne réel ;
- embeddings liés dédupliqués.

Spécification : [`BRIK_FORMAT.md`](https://github.com/romainkhanoyan/brimkern/blob/main/BRIK_FORMAT.md).

## Matériel

WebGPU requis (Chrome/Edge 113+, Safari 18+). Prévoir ~{{VRAM}} de mémoire graphique disponible.
Sur téléphone, préférer les modèles ≤ 400 Mo.

## Licence

{{LICENSE_NOTE}} La conversion ne modifie pas les termes du modèle d'origine
({{BASE_MODEL}}) : ils s'appliquent intégralement à ces poids.
