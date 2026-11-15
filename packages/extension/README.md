# Extension Chrome « Brimkern — réponses locales »

Sur une page de résultats Google : l'aperçu IA n'est pas demandé (`udm=14`), un bouton le remplace,
et au clic un modèle tourne sur le GPU de l'utilisateur pour répondre à partir des extraits déjà
affichés, sources à l'appui. Présentation publique : `/extension` du site. Historique, mesures et
décisions : `docs/ROADMAP.md` § 30.

```bash
npm run build:extension                      # → dist/ (à charger « non empaquetée ») + brimkern-extension-<version>.zip
npm run test:extension                       # paliers + règle udm=14, sans navigateur
node scripts/e2e/extension-google.mjs        # bout en bout dans Chrome (page synthétique)
node scripts/e2e/serp-quality.mjs            # banc qualité (après serp-capture.mjs)
```

## Publier sur le Chrome Web Store

Vérifié sur developer.chrome.com le 2026-11-14. Rien de ceci ne se fait depuis le dépôt : tout
passe par le tableau de bord développeur, avec le compte de Romain.

### 1. Compte développeur (une fois)
- https://chrome.google.com/webstore/devconsole → accepter l'accord développeur, payer les frais
  d'inscription UNIQUES (montant affiché au paiement ; la doc ne le donne pas).
- L'e-mail du compte ne peut plus être changé ensuite : en choisir un dédié, lu souvent.
- Onglet *Account* : nom d'éditeur (affiché « Offered by »), e-mail de contact à **vérifier**
  (obligatoire pour un nouveau compte).

### 2. Le paquet
- Monter `version` dans `manifest.json` à CHAQUE dépôt (le Store refuse une version déjà vue).
- `npm run build:extension` → `packages/extension/brimkern-extension-<version>.zip` (le contenu de
  `dist/`, `manifest.json` à la racine). Le build échoue si du code distant subsiste.
- Code minifié : autorisé ; obfusqué : interdit (politique « code readability »).
- Rejouer `extension-google.mjs` sur le zip qu'on dépose, pas sur un build plus ancien.

### 3. Fiche (onglet *Store listing*)
- Nom et description courte : viennent de `_locales/en|fr/messages.json` (bilingue d'office).
- Description longue (EN puis FR), à coller :
  > Google computes its AI Overview in its data centres before the page is even shown. This
  > extension stops requesting it (it uses Google's own "Web" results filter) and puts a button
  > in its place. Click it, and a small language model running on your own GPU answers from the
  > results already on the page, with its sources. No click, no computation. The model is
  > downloaded once from Hugging Face after you agree, and stays on your computer; nothing else
  > is sent anywhere. A small model can be wrong: the sources are always shown.

  > Google calcule son aperçu IA dans ses centres de données avant même d'afficher la page. Cette
  > extension cesse de le demander (elle utilise le filtre « Web » de Google lui-même) et met un
  > bouton à sa place. Un clic, et un petit modèle de langage qui tourne sur votre propre GPU
  > répond à partir des résultats déjà affichés, sources à l'appui. Pas de clic, pas de calcul. Le
  > modèle est téléchargé une seule fois depuis Hugging Face après votre accord, et reste sur votre
  > ordinateur ; rien d'autre n'est envoyé. Un petit modèle peut se tromper : les sources sont
  > toujours affichées.
- ⚠️ Pas de « écologique », « green », « eco-friendly » : allégation générique interdite dans l'UE
  depuis le 27/09/2026 (directive 2024/825) — à faire relire avant d'en ajouter.
- Images : icône 128 px (déjà dans le zip) ; **au moins une capture 1280×800** (ou 640×400),
  coins carrés, sans marge — 5 au maximum. À prendre sur une VRAIE page Google, fenêtre réglée
  sur 1280×800 (DevTools → mode appareil → 1280×800 → « Capture screenshot »). Facultatif : petite
  vignette 440×280 (sans elle, l'extension est classée après celles qui en ont une).
- Catégorie : Productivité ; langues : anglais, français.

### 4. Onglet *Privacy practices*
- **Objet unique** : « Answers the user's Google search on their own device, on request, from the
  results shown on the page; and does not request Google's AI Overview. »
- **Justification des permissions** :
  - `offscreen` : runs the on-device language model (WebGPU) in a hidden extension page, so the
    model stays loaded between searches and its weights are cached under the extension, not
    under google.com.
  - `declarativeNetRequest` : adds Google's own `udm=14` ("Web") parameter to web searches, so the
    results page is served without an AI Overview. Explicit tabs (Images, News…) are untouched.
  - `unlimitedStorage` : keeps the downloaded model (300 MB to 1.3 GB depending on the device) in
    the browser cache so it is not downloaded again.
  - Hôtes `https://www.google.<tld>/*` : the content script reads the results page to build the
    answer and shows the answer panel there; the rule above needs host access to redirect.
- **Code distant** : « No, I am not using remote code. » (les poids du modèle sont des données, pas
  du code ; le repli transformers.js est retiré au build).
- **Données** : cocher *Website content* (l'extension lit les titres et extraits des résultats),
  et certifier qu'elles ne sont ni vendues, ni transmises, ni utilisées à d'autres fins — elles
  sont traitées sur l'appareil et ne le quittent pas.
- **Politique de confidentialité** : `https://brimkern.com/extension#privacy` (section dédiée de
  la page publique — la tenir conforme à ce qui précède).

### 5. Distribution et envoi
- Visibilité : **Non répertoriée** d'abord (lien direct, pour des testeurs), puis Publique.
- *Submit for review* : « quelques jours, jusqu'à quelques semaines » ; plus long pour un nouveau
  développeur, une nouvelle extension, ou des permissions d'hôte larges. Au-delà de 3 semaines :
  contacter le support.
- Après publication : remplacer « Status: preview » et les instructions de build de `/extension`
  par le lien du Store — dans les DEUX langues — et vérifier en ligne (règle 4 : une
  fonctionnalité annoncée doit exister dans ce qui est publié).
