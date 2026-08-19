"use client";

// Client half of /changelog: the page shell (metadata) stays a Server Component in page.tsx;
// everything rendered lives here so the FR/EN toggle (useLocale) and t() can run. Every string is
// stored bilingual as { en, fr } and resolved at render time via the current locale.

import { useT } from '@/lib/i18n';
import DocsShell from '../docs/DocsShell';

interface L {
  en: string;
  fr: string;
}

interface Release {
  date: L;
  tagline: L;
  groups: { title: L; items: L[] }[];
}

const RELEASES: Release[] = [
  {
    date: { en: 'August 18, 2026', fr: '18 août 2026' },
    tagline: {
      en: 'The machine’s compute ceiling is finally measured, and it showed our matrix multiplies were capped by their own inner loop, not by the hardware. Rewritten, they read your prompt up to 1.5× faster at the kernel level on 7B-class models.',
      fr: 'Le plafond de calcul de la machine est enfin mesuré, et il a montré que nos multiplications matricielles étaient bridées par leur propre boucle interne, pas par le matériel. Réécrites, elles lisent votre prompt jusqu’à 1,5× plus vite au niveau kernel sur les modèles de classe 7B.',
    },
    groups: [
      {
        title: { en: 'Prompt reading: the multiplies catch up', fr: 'Lecture du prompt : les multiplications rattrapent leur retard' },
        items: [
          { en: 'A new benchmark measures what this GPU can actually compute: 2 825 GFLOP/s. Our prompt-phase matrix multiplies were running at 973, and a mock-up of their inner loop capped at exactly that number: the bottleneck was the kernel’s structure (too many shared-memory reads per multiply), not the machine. The benchmark ships in the repo (scripts/e2e/flops.mjs).',
            fr: 'Un nouveau banc mesure ce que ce GPU sait vraiment calculer : 2 825 GFLOP/s. Nos multiplications matricielles de lecture de prompt tournaient à 973, et une maquette de leur boucle interne plafonnait exactement à ce chiffre : le goulot était la structure du kernel (trop de lectures de mémoire partagée par multiplication), pas la machine. Le banc est dans le dépôt (scripts/e2e/flops.mjs).' },
          { en: 'The int8 and int4 kernels were rewritten with wider register blocks (each thread now computes 4×8 outputs, fed by vectorized reads). Measured kernel-isolated on the exact shapes of a 7B: ×1.4 to ×1.5, lifting the theoretical prompt-reading ceiling of that model from 74 to 113 tok/s. As always: validated against the CPU reference on every load, with a kill-switch (?qshared2=0) and an automatic fallback.',
            fr: 'Les kernels int8 et int4 sont réécrits avec des blocs de registres plus larges (chaque thread calcule désormais 4×8 sorties, nourries par des lectures vectorisées). Mesuré kernel isolé sur les formes exactes d’un 7B : ×1,4 à ×1,5, ce qui monte le plafond théorique de lecture de prompt de ce modèle de 74 à 113 tok/s. Comme toujours : validé contre la référence CPU à chaque chargement, avec un kill-switch (?qshared2=0) et un repli automatique.' },
          { en: 'Measured end to end on a small model (Qwen3 0.6B, ~480-token prompt): prompt reading goes from 506 to 556 tok/s (×1.10). On small models the multiplies are only a quarter of the prompt phase since the August 16 attention fix, so the biggest wins land on the largest models, where they dominate.',
            fr: 'Mesuré de bout en bout sur un petit modèle (Qwen3 0.6B, prompt d’environ 480 tokens) : la lecture passe de 506 à 556 tok/s (×1,10). Sur les petits modèles les multiplications ne pèsent plus qu’un quart de la phase de prompt depuis le correctif d’attention du 16 août, donc les plus gros gains vont aux plus gros modèles, où elles dominent.' },
          { en: 'Confirmed the same evening on a mid-size model (Qwen3 4B, in the full app): the prompt-phase multiplies drop from 3.3 to 2.4 ms per dispatch. ×1.48 at equal shapes, right where the kernel benchmark predicted. At that size they are 8× the cost of attention during prompt reading, which is exactly why this was the right kernel to rewrite.',
            fr: 'Confirmé le soir même sur un modèle intermédiaire (Qwen3 4B, dans l’application complète) : les multiplications de la phase de prompt passent de 3,3 à 2,4 ms par tir. ×1,48 à formes égales, exactement où le banc kernel le prédisait. À cette taille elles coûtent 8× l’attention pendant la lecture du prompt : c’était précisément le bon kernel à réécrire.' },
        ],
      },
      {
        title: { en: 'Images generate three times faster', fr: 'Les images se génèrent trois fois plus vite' },
        items: [
          { en: 'The convolutions, which carry two thirds of a generation, were computing one output channel per group of GPU threads. The input patch was therefore re-read from memory once per output channel, and each thread did nine multiplications for eighteen reads. Computing eight channels at once from the same patch turns that into seventy-two multiplications for the same eighteen reads.',
            fr: 'Les convolutions, qui portent deux tiers d’une génération, calculaient un canal de sortie par groupe de threads GPU. Le morceau d’image en entrée était donc relu depuis la mémoire une fois par canal de sortie, et chaque thread faisait neuf multiplications pour dix-huit lectures. En calculant huit canaux d’un coup depuis le même morceau, cela devient soixante-douze multiplications pour les mêmes dix-huit lectures.',
          },
          { en: 'The same treatment was then applied to the 1×1 convolutions of the residual shortcuts, which the first fix had promoted to second place in the budget. Measured end to end at 512px: a generation drops from 17.2 to 4.8 seconds, ×3.58. Generating at full native resolution now costs what half resolution used to. Video generation shares the same network and benefits too. The structure was chosen by measurement before a line of the kernel was written: one channel per group reached 300 GFLOP/s, four reached ×2.3, eight ×2.8, and beyond that the returns fade.',
            fr: 'Le même traitement a ensuite été appliqué aux convolutions 1×1 des raccourcis, que le premier correctif avait propulsées à la deuxième place du budget. Mesuré de bout en bout en 512px : une génération passe de 17,2 à 4,8 secondes, ×3,58. Générer en pleine résolution native coûte désormais ce que coûtait la demi-résolution. La génération vidéo partage le même réseau et en profite aussi. La structure a été choisie par la mesure avant d’écrire une ligne du kernel : un canal par groupe atteignait 300 GFLOP/s, quatre canaux ×2,3, huit ×2,8, et au-delà le rendement s’efface.',
          },
        ],
      },
      {
        title: { en: 'Image generation grows up', fr: 'La génération d’image passe à l’âge adulte' },
        items: [
          { en: 'Images are now generated at 512px by default on a capable GPU. This is not a comfort setting: the model is trained at 512, and below that it stops composing. On the same prompt and the same seed, 256px returned a cropped fragment of a face where 512px returned the whole portrait. Phones and smaller GPUs stay at 256px, where memory decides rather than taste.',
            fr: 'Les images sont désormais générées en 512px par défaut sur un GPU capable. Ce n’est pas un réglage de confort : le modèle est entraîné en 512, et en dessous il ne compose plus. Sur le même prompt et la même seed, le 256px rendait un fragment de visage recadré là où le 512px rendait le portrait entier. Les téléphones et les petits GPU restent en 256px, où c’est la mémoire qui décide et non le goût.' },
          { en: 'A running generation can be cancelled. The stop button only interrupted the language model before, so an image or a clip had to be waited out to the end. It now stops at the next block, and frees the GPU memory it was holding.',
            fr: 'Une génération en cours peut être annulée. Le bouton stop n’interrompait que le modèle de langage : il fallait attendre la fin d’une image ou d’un clip. Il s’arrête maintenant au bloc suivant, et libère la mémoire GPU qu’il occupait.' },
          { en: 'Generated images and clips can be saved. A clip in particular only lived for the session, so minutes of computation disappeared when the tab closed.',
            fr: 'Les images et les clips générés peuvent être enregistrés. Un clip, en particulier, ne vivait que le temps de la session : des minutes de calcul disparaissaient à la fermeture de l’onglet.' },
        ],
      },
      {
        title: { en: 'Waiting for a generation, made legible', fr: 'L’attente d’une génération, rendue lisible' },
        items: [
          { en: 'A generation now shows a running clock, a progress bar that tracks the actual computation, and an estimate of the time remaining, instead of a line of text that changed every few seconds. The bar comes from the pipeline itself, so it advances at the real pace rather than pretending.',
            fr: 'Une génération affiche désormais un chronomètre, une barre qui suit le calcul réel et une estimation du temps restant, au lieu d’une ligne de texte qui changeait toutes les quelques secondes. La barre vient du pipeline lui-même : elle avance au vrai rythme plutôt que de faire semblant.' },
          { en: 'Video clips are still shown as 0:00 by no more: browsers record WebM as a live stream whose length never reaches the file header, and the player now measures it on load. Clip length is also yours to choose, from 8 to 32 frames, with the compute cost stated next to each option.',
            fr: 'Les clips ne s’affichent plus en 0:00 : les navigateurs enregistrent le WebM comme un flux live dont la longueur n’arrive jamais dans l’en-tête du fichier, et le lecteur la mesure maintenant au chargement. La longueur du clip se choisit aussi, de 8 à 32 frames, avec le coût de calcul annoncé en face de chaque option.' },
          { en: 'The separate video lab page is gone: video generation lives in the chat now, next to the other modalities, so the lab was a second door to the same room.',
            fr: 'La page de labo vidéo disparaît : la génération vidéo vit dans le chat, à côté des autres modalités, et le labo était une seconde porte vers la même pièce.' },
        ],
      },
      {
        title: { en: 'Image and video generation, 1.67× faster', fr: 'Génération d’image et de vidéo, 1,67× plus rapide' },
        items: [
          { en: 'A new benchmark profiles a whole generation kernel by kernel, and it found the culprit immediately: the convolutions ate 73.8 % of the GPU, and one of them alone (the 3×3 convolution on quantized weights) took 70 % at 35 ms per call. The plain-precision path had a fast tiled version of that convolution; the quantized path, the one the app actually runs, never got one.',
            fr: 'Un nouveau banc profile une génération entière kernel par kernel, et il a trouvé le coupable immédiatement : les convolutions mangeaient 73,8 % du GPU, et l’une d’elles à elle seule (la convolution 3×3 sur poids quantifiés) en prenait 70 %, à 35 ms l’appel. Le chemin en pleine précision avait une version tuilée rapide de cette convolution ; le chemin quantifié, celui que l’application exécute vraiment, n’en avait jamais eu.' },
          { en: 'Written, it reads each input pixel once per workgroup instead of nine times, and unpacks each weight once instead of 256 times. Measured on a 256px image: the whole generation drops from 5.0 to 3.0 seconds (×1.67), and that convolution from 35 to 19 ms. Video generation shares the same network, so it benefits too. As always: checked against the CPU reference at every load, with a kill-switch (?convtq=0) and an automatic fallback.',
            fr: 'Écrite, elle lit chaque pixel d’entrée une fois par groupe de travail au lieu de neuf, et déballe chaque poids une fois au lieu de 256. Mesuré sur une image 256px : la génération entière passe de 5,0 à 3,0 secondes (×1,67), et cette convolution de 35 à 19 ms. La génération vidéo partage le même réseau, elle en profite donc aussi. Comme toujours : vérifiée contre la référence CPU à chaque chargement, avec un kill-switch (?convtq=0) et un repli automatique.' },
          { en: 'A generated clip showed a duration of 0:00 in the player: browsers record WebM as a live stream whose length is never written into the file header. The player now measures it on load, so the timeline and the seek bar work.',
            fr: 'Un clip généré affichait une durée de 0:00 dans le lecteur : les navigateurs enregistrent le WebM comme un flux live dont la longueur n’est jamais inscrite dans l’en-tête du fichier. Le lecteur la mesure désormais au chargement, la timeline et la barre de lecture fonctionnent.' },
        ],
      },
      {
        title: { en: 'Video generation joins the chat (beta)', fr: 'La génération vidéo entre dans le chat (bêta)' },
        items: [
          { en: 'The video lab becomes a real mode: pick “Generate in the chat” on the video card (desktop), describe a scene, and a short looping clip is generated on your GPU. With step-by-step progress, since a clip takes minutes, not seconds. Your one-line prompt is first expanded by a small local language model into a fuller visual direction (short prompts make static clips).',
            fr: 'Le labo vidéo devient un vrai mode : choisissez « Générer dans le chat » sur la carte vidéo (bureau), décrivez une scène, et un court clip en boucle est généré sur votre GPU. Avec la progression étape par étape, car un clip prend des minutes, pas des secondes. Votre prompt d’une ligne est d’abord développé par un petit modèle de langage local en vraie direction visuelle (les prompts courts font des clips statiques).' },
          { en: 'Reopening a video conversation shows each clip’s first frame rather than silently losing it: a generated clip lives only for the session (unlike images, regenerating one costs minutes, so there is no click-to-reveal).',
            fr: 'Rouvrir une conversation vidéo montre la première frame de chaque clip plutôt que de le perdre en silence : un clip généré ne vit que la session (contrairement aux images, en régénérer un coûte des minutes, donc pas de « cliquer pour révéler »).' },
        ],
      },
      {
        title: { en: 'Waiting, and reading, in your own language', fr: 'Attendre, et lire, dans sa langue' },
        items: [
          { en: 'Loading an image or video pipeline downloads up to 1.5 GB, and showed a single line of text while it happened. It now has the same progress bar and time-remaining estimate as the language models, so you can tell a slow download from a stuck one.',
            fr: 'Charger un pipeline image ou vidéo télécharge jusqu’à 1,5 Go, et n’affichait qu’une ligne de texte pendant ce temps. Il a désormais la même barre de progression et la même estimation du temps restant que les modèles de langage : un téléchargement lent ne se confond plus avec un téléchargement bloqué.' },
          { en: 'The image, video and vision pipelines wrote their loading steps in French only, so an English page could suddenly display “Téléchargement du module motion…”. Every step of those pipelines now follows the language of the page.',
            fr: 'Les pipelines image, vidéo et vision écrivaient leurs étapes de chargement en français uniquement : une page anglaise pouvait donc afficher « Téléchargement du module motion… ». Chaque étape suit maintenant la langue de la page.' },
          { en: 'The changelog and the WebLLM comparison now sit inside the documentation shell, with the same side menu, and the changelog gains one anchor per release, so a given version can be linked to directly.',
            fr: 'Le changelog et la comparaison WebLLM rejoignent la coquille de la documentation, avec le même menu latéral, et le changelog gagne une ancre par version : on peut désormais pointer un lien vers une version précise.' },
        ],
      },
      {
        title: { en: 'The SDK lands on npm, and the docs get a spine', fr: 'Le SDK arrive sur npm, et la doc gagne une colonne vertébrale' },
        items: [
          { en: 'The embeddable SDK is now published as the brimkern package on npm. TypeScript types included, safe to import on a server (Next.js, Remix, Astro), same API as the script tag: embed, createSession, generate, preload, status.',
            fr: 'Le SDK embarquable est désormais publié sur npm sous le nom brimkern. Types TypeScript inclus, importable côté serveur sans risque (Next.js, Remix, Astro), même API que la balise script : embed, createSession, generate, preload, status.' },
          { en: 'A full API reference page ships with it at /docs/sdk: every option of every call, documented from the published type definitions.',
            fr: 'Une page de référence API complète l’accompagne sur /docs/sdk : chaque option de chaque appel, documentée depuis les définitions de types publiées.' },
          { en: 'The documentation now has a sticky side menu: the doc pages, plus the sections of the current page highlighted as you scroll. On narrow screens it folds back into the pill row.',
            fr: 'La documentation a maintenant un menu latéral collant : les pages de la doc, plus les sections de la page courante surlignées au défilement. Sur écran étroit il se replie en rangée de pastilles.' },
        ],
      },
    ],
  },
  {
    date: { en: 'August 14, 2026', fr: '14 août 2026' },
    tagline: {
      en: 'Answers arrive about 40 % faster: the normalization step of every layer was running on a single GPU thread. Reasoning models no longer get stuck on “Thinking…”, the storage panel stops hoarding ranges that will never be read again, and a measured comparison with WebLLM is now online.',
      fr: 'Les réponses arrivent environ 40 % plus vite : l’étape de normalisation de chaque couche tournait sur un seul thread du GPU. Les modèles à raisonnement ne restent plus bloqués sur « Réflexion… », le stockage cesse de garder des morceaux qui ne seront jamais relus, et une comparaison mesurée avec WebLLM est en ligne.',
    },
    groups: [
      {
        title: { en: 'Faster answers', fr: 'Des réponses plus rapides' },
        items: [
          { en: 'Every layer normalizes its values twice per token, and that step was written one row per thread: fine when reading your prompt (hundreds of rows at once), wasteful when writing the answer (one row, so 63 threads out of 64 idle). Rewritten to split the row across the whole workgroup: decoding goes from 36.0 to 49.5 tok/s (×1.38) on a Qwen3 0.6B, prompt reading unchanged.',
            fr: 'Chaque couche normalise ses valeurs deux fois par token, et cette étape était écrite une ligne par thread : correct pour lire votre question (des centaines de lignes d’un coup), gâché pour écrire la réponse (une seule ligne, donc 63 threads sur 64 inutilisés). Réécrite pour répartir la ligne sur tout le groupe : le décodage passe de 36,0 à 49,5 tok/s (×1,38) sur un Qwen3 0.6B, la lecture du prompt est inchangée.' },
          { en: 'The measurement that found it: a per-pass GPU profiler (?gpuprofile=1) added the same day, which showed normalization eating 51.9 % of decode time. Twice the cost of the matrix multiplies it feeds.',
            fr: 'La mesure qui l’a trouvé : un profileur GPU par passe (?gpuprofile=1) ajouté le même jour, qui montrait la normalisation à 51,9 % du temps de décodage. Deux fois le coût des multiplications matricielles qu’elle alimente.' },
          { en: 'On a 7B the same fix is worth ×1.27 (8.1 → 10.2 tok/s): the bigger the model, the more the matrix multiplies dominate, so normalization weighs less. That 7B is now in the catalogue: it is the model our published figures are measured on, and you can run it yourself.',
            fr: 'Sur un 7B le même correctif vaut ×1,27 (8,1 → 10,2 tok/s) : plus le modèle est gros, plus les multiplications matricielles dominent, donc moins la normalisation pèse. Ce 7B est désormais dans le catalogue : c’est le modèle sur lequel nos chiffres publiés sont mesurés, vous pouvez le lancer vous-même.' },
        ],
      },
      {
        title: { en: 'Reasoning models: no more dead end', fr: 'Modèles à raisonnement : plus de cul-de-sac' },
        items: [
          { en: 'When a model stopped in the middle of its reasoning, the bubble stayed on “Thinking…” forever: no answer, no explanation, no way out. That state is now shown as a collapsible “Reasoning (interrupted)” block, the reply is marked as cut off, and a Continue button picks it back up.',
            fr: 'Quand un modèle s’arrêtait au milieu de sa réflexion, la bulle restait sur « Réflexion… » pour toujours : sans réponse, sans explication, sans issue. Cet état s’affiche désormais en bloc repliable « Raisonnement (interrompu) », la réponse est marquée comme coupée, et un bouton Continuer la reprend.' },
          { en: 'Past reasoning is no longer sent back to the model on the next turn (the official Qwen3/R1 templates drop it too): the second-turn prompt shrank from ~240 to 68 tokens, leaving more room for the conversation itself.',
            fr: 'Le raisonnement des tours passés n’est plus renvoyé au modèle (les gabarits officiels Qwen3/R1 le retirent aussi) : le prompt du 2e tour passe de ~240 à 68 tokens, ce qui laisse plus de place à la conversation elle-même.' },
        ],
      },
      {
        title: { en: 'Storage that stops growing for nothing', fr: 'Un stockage qui ne gonfle plus pour rien' },
        items: [
          { en: 'A model could occupy 239 MB of cache for a 149 MB file: pieces left behind by an older download plan, never read again but still counted against the browser quota that decides whether a model can be kept at all. They are now cleaned up automatically: only pieces fully contained in a larger one, so nothing you already have is lost.',
            fr: 'Un modèle pouvait occuper 239 Mo de cache pour un fichier de 149 Mo : des morceaux laissés par un ancien plan de téléchargement, jamais relus mais toujours comptés dans le quota du navigateur. Celui-là même qui décide si un modèle peut être gardé. Ils sont nettoyés automatiquement, et uniquement ceux entièrement contenus dans un plus grand : rien de ce que vous avez déjà n’est perdu.' },
          { en: 'Models whose download link carries a query string (a common Hugging Face form) were invisible to the storage panel, to “delete this model”, and to automatic cleanup. They are recognized again.',
            fr: 'Les modèles dont le lien de téléchargement porte une query (une forme courante chez Hugging Face) étaient invisibles pour le panneau Stockage, pour « supprimer ce modèle » et pour le nettoyage automatique. Ils sont de nouveau reconnus.' },
        ],
      },
      {
        title: { en: 'Llama, Mistral and SmolLM3 load differently', fr: 'Llama, Mistral et SmolLM3 se chargent autrement' },
        items: [
          { en: 'These three families order two of their attention matrices differently from the rest. Until now we rewrote those matrices at load time to match our kernel; the kernel now handles their convention directly. Llama 3.2, Ministral 3 and SmolLM3 were all re-checked and answer correctly either way (?ropenorm=0 restores the old path).',
            fr: 'Ces trois familles rangent deux de leurs matrices d’attention autrement que les autres. Jusqu’ici nous réécrivions ces matrices au chargement pour coller à notre kernel ; le kernel gère désormais leur convention directement. Llama 3.2, Ministral 3 et SmolLM3 ont été revérifiés et répondent juste dans les deux cas (?ropenorm=0 rétablit l’ancien chemin).' },
          { en: 'Consequence: these models can now be packaged as .brik. That rewrite was impossible on a quantized layout, which is why converting a Llama GGUF to .brik was refused.',
            fr: 'Conséquence : ces modèles peuvent désormais être empaquetés en .brik. Cette réécriture était impossible sur un layout quantifié : c’est ce qui faisait refuser la conversion d’un GGUF Llama en .brik.' },
        ],
      },
      {
        title: { en: 'The site', fr: 'Le site' },
        items: [
          { en: 'A measured comparison with WebLLM at /vs-webllm: same GPU, same 7B int4 model, prefill and decode side by side. Including where WebLLM is ahead.',
            fr: 'Une comparaison mesurée avec WebLLM sur /vs-webllm : même GPU, même modèle 7B int4, prefill et décodage côte à côte. Y compris là où WebLLM est devant.' },
          { en: 'Accessibility: the four secondary pages carried contrast violations in dark mode that no audit had ever covered (the red used for solid buttons was also being used for small text). Eight pages × two themes now pass with zero violations.',
            fr: 'Accessibilité : les quatre pages secondaires portaient des défauts de contraste en thème sombre qu’aucun audit n’avait couverts (le rouge des aplats servait aussi aux petits textes). Huit pages × deux thèmes passent désormais à zéro violation.' },
          { en: 'On the French home page, the terminal panel stayed permanently faded because longer French sentences pushed it below the fold, where its scroll-driven appearance never completed. It now fades in with the rest of the hero.',
            fr: 'Sur l’accueil français, le panneau terminal restait délavé en permanence : les phrases françaises, plus longues, le repoussaient sous la ligne de flottaison où son apparition liée au défilement ne se terminait jamais. Il apparaît maintenant avec le reste du hero.' },
          { en: 'The layer diagram now draws itself piece by piece as you scroll, and the measured figures count up when they come into view.',
            fr: 'Le schéma des couches se dessine morceau par morceau au défilement, et les chiffres mesurés se comptent en arrivant à l’écran.' },
          { en: 'The SDK demo asked for “a short story” under a 100-token budget and stopped mid-sentence. It now asks for three sentences, and has the budget for them.',
            fr: 'La démo du SDK demandait « une petite histoire » sous un budget de 100 tokens et s’arrêtait au milieu d’une phrase. Elle demande trois phrases, et a le budget pour.' },
        ],
      },
    ],
  },
  {
    date: { en: 'August 13, 2026', fr: '13 août 2026' },
    tagline: {
      en: 'Any single-file GGUF from Hugging Face now runs here: paste an author/model and go. Decoding is 4× faster on large models, the first reply no longer costs ten seconds, the Llama family answers correctly again, and the site finally has a front door separate from the app.',
      fr: 'N’importe quel GGUF mono-fichier de Hugging Face tourne désormais ici : collez auteur/modèle et c’est parti. Le décodage est 4× plus rapide sur les gros modèles, la première réponse ne coûte plus dix secondes, la famille Llama répond de nouveau juste, et le site a enfin une porte d’entrée distincte de l’application.',
    },
    groups: [
      {
        title: { en: 'A front door, and the app on its own address', fr: 'Une porte d’entrée, et l’app à son adresse' },
        items: [
          { en: 'The home page is now a real landing page explaining what the engine does; the chat lives at /chat. Links published earlier (?model=…) still land in the app.', fr: 'L’accueil est désormais une vraie landing qui explique ce que fait le moteur ; le chat vit sur /chat. Les liens déjà publiés (?model=…) atterrissent toujours dans l’application.' },
          { en: 'A documentation hub at /docs gathers everything: loading a model, instant test links, the .brik format and its converter, the SDK, storage, diagnostics.', fr: 'Un hub de documentation sur /docs rassemble tout : charger un modèle, liens de test instantané, format .brik et convertisseur, SDK, stockage, diagnostics.' },
          { en: 'English is now the canonical version of the site (French at /fr), each language on its own indexable URL.', fr: 'L’anglais devient la version canonique du site (français sur /fr), chaque langue sur son URL indexable.' },
        ],
      },
      {
        title: { en: 'Any model from the Hub, in one paste', fr: 'N’importe quel modèle du Hub, en un collage' },
        items: [
          { en: 'Paste author/model, a Hugging Face URL, or a direct .gguf / .brik link: the best quantization is picked for you and the tokenizer is read from the file itself. Nothing to configure.', fr: 'Collez auteur/modèle, une URL Hugging Face, ou un lien direct .gguf / .brik : la meilleure quantification est choisie et le tokenizer est lu dans le fichier. Rien à régler.' },
          { en: 'Large GGUFs stream by HTTP range instead of downloading whole: a 4.7 GB model reloads from cache in 15.8 s.', fr: 'Les gros GGUF arrivent par plages HTTP au lieu d’un téléchargement complet : un modèle de 4,7 Go recharge depuis le cache en 15,8 s.' },
        ],
      },
      {
        title: { en: 'Speed', fr: 'Vitesse' },
        items: [
          { en: 'Decoding was reusing a kernel built for many tokens at once, leaving seven threads out of eight idle. A dedicated one: ×4.2 on 7B shapes (3.4 → 14.4 tok/s), ×2.4 on a 0.5B.', fr: 'Le décodage réutilisait un kernel taillé pour plusieurs tokens à la fois, laissant sept threads sur huit inutilisés. Un kernel dédié : ×4,2 sur les formes 7B (3,4 → 14,4 tok/s), ×2,4 sur un 0.5B.' },
          { en: 'The first message of a session paid for moving the weights into VRAM (10.9 s on a 7B). A throwaway warm-up pass moves that cost off your first prompt: 1.1 s.', fr: 'Le premier message d’une session payait la mise en VRAM des poids (10,9 s sur un 7B). Une préchauffe jetable déplace ce coût hors de votre première question : 1,1 s.' },
          { en: 'Prefill GEMMs are tiled and register-blocked in all three precisions: ×2–2.7 at kernel level, and ~1 TFLOP/s sustained on 7B shapes.', fr: 'Les GEMM du prefill sont tuilés et bloqués en registres dans les trois précisions : ×2–2,7 au niveau kernel, et ~1 TFLOP/s tenus sur les formes 7B.' },
        ],
      },
      {
        title: { en: 'The Llama family answers correctly again', fr: 'La famille Llama répond de nouveau juste' },
        items: [
          { en: 'Llama 3.2 produced fluent nonsense. Cause: a load-time optimization (one HTTP range per layer) filled the weight cache directly, bypassing the row fix these models need on their Q/K matrices, so the chat path read mis-ordered weights. Fixed; Llama now answers correctly, and a CPU reference validates the engine layer by layer.', fr: 'Llama 3.2 produisait du charabia fluide. Cause : une optimisation de chargement (une plage HTTP par couche) remplissait le cache de poids directement, en sautant la correction de lignes que ces modèles exigent sur leurs matrices Q/K. Le chat lisait donc des poids mal ordonnés. Corrigé ; Llama répond juste, et une référence CPU valide le moteur couche par couche.' },
        ],
      },
      {
        title: { en: 'Everyday things', fr: 'Le quotidien' },
        items: [
          { en: 'Models unused for 30 days are cleaned up automatically (adjustable, or off). The Storage panel now groups by model instead of listing hundreds of HTTP ranges.', fr: 'Les modèles inutilisés depuis 30 jours sont nettoyés automatiquement (réglable, ou désactivable). Le panneau Stockage regroupe par modèle au lieu de lister des centaines de plages HTTP.' },
          { en: 'Web search no longer fires on small talk, a truncated reply says so and offers Continue, and reasoning blocks are hidden by default.', fr: 'La recherche web ne se déclenche plus sur du bavardage, une réponse coupée le dit et propose Continuer, et les blocs de raisonnement sont masqués par défaut.' },
          { en: 'Accessibility: 7 violations → 0 (contrast, form labels, landmarks, heading order), light and dark.', fr: 'Accessibilité : 7 violations → 0 (contrastes, libellés de champs, points de repère, ordre des titres), en clair comme en sombre.' },
        ],
      },
    ],
  },
  {
    date: { en: 'July 22, 2026', fr: '22 juillet 2026' },
    tagline: {
      en: 'Brimkern goes open source (MIT), and becomes embeddable: one <script> tag puts a local AI on your own site. The ultra-light chat no longer freezes, and video generation gets a resident engine plus a real WebM export.',
      fr: 'Brimkern passe open source (MIT), et devient embarquable : une balise <script> suffit pour poser une IA locale sur votre propre site. Le chat ultra-léger ne gèle plus, et la génération vidéo gagne un moteur résident et un vrai export WebM.',
    },
    groups: [
      {
        title: { en: 'Open source: the code is public', fr: 'Open source : le code est public' },
        items: [
          { en: 'The entire engine is now on GitHub under the MIT license: WGSL kernels, the .brik format, the loaders, the app. New home: brimkern.romainkhanoyan.fr.', fr: 'Tout le moteur est désormais sur GitHub sous licence MIT : kernels WGSL, format .brik, chargeurs, application. Nouvelle adresse : brimkern.romainkhanoyan.fr.' },
          { en: 'A product README with screenshots, and proper SEO plumbing (robots, sitemap, canonical domain).', fr: 'Un README produit avec captures d’écran, et la plomberie SEO qui va avec (robots, sitemap, domaine canonique).' },
        ],
      },
      {
        title: { en: 'Embeddable SDK (v0): your site, your visitors’ GPU', fr: 'SDK embarquable (v0) : votre site, le GPU de vos visiteurs' },
        items: [
          { en: 'One <script src="/sdk.js"> + Brimkern.embed({ system: … }) mounts a chat widget that runs a .brik model entirely on the visitor’s GPU: zero server, zero per-token cost, private, offline after the first load. Live example on /sdk-demo.html.', fr: 'Une balise <script src="/sdk.js"> + Brimkern.embed({ system: … }) monte un widget de chat qui exécute un modèle .brik entièrement sur le GPU du visiteur : zéro serveur, zéro coût par token, privé, hors-ligne après le premier chargement. Exemple live sur /sdk-demo.html.' },
          { en: 'Configurable with a plain object: model (a hosted .brik URL), system prompt, title, greeting, accent color, token budget. The model only downloads when the visitor engages the widget: your PageSpeed is untouched.', fr: 'Configurable avec un simple objet : modèle (URL d’un .brik hébergé), prompt système, titre, message d’accueil, couleur d’accent, budget de tokens. Le modèle ne se télécharge que quand le visiteur ouvre le widget : votre PageSpeed reste intact.' },
          { en: 'It reuses the app’s fast path (resident GPU decode) and never interprets model output as HTML: plain text only, styles scoped to the widget.', fr: 'Il réutilise le chemin rapide de l’app (décodage GPU résident) et n’interprète jamais la sortie du modèle comme du HTML : texte brut uniquement, styles cantonnés au widget.' },
        ],
      },
      {
        title: { en: 'LFM2.5 chat unfrozen, and 2.3× faster', fr: 'Le chat LFM2.5 dégelé, et 2,3× plus rapide' },
        items: [
          { en: 'Switching to LFM2.5 mid-conversation could freeze the tab: every token triggered ~100 GPU round-trips, and replaying the whole history multiplied them by thousands. The forward pass is now fully GPU-resident: one submission per token, one for the whole prefill.', fr: 'Basculer sur LFM2.5 en cours de conversation pouvait geler l’onglet : chaque token déclenchait ~100 allers-retours GPU, et rejouer tout l’historique les multipliait par milliers. Le calcul est désormais 100 % résident GPU : une soumission par token, une seule pour tout le prefill.' },
          { en: 'Verified token-identical to the previous path before shipping, with an automatic fallback and a ?lfm2resident=0 switch. Measured: 13.5 → 31 tok/s on the same machine.', fr: 'Vérifié token-identique à l’ancien chemin avant livraison, avec repli automatique et interrupteur ?lfm2resident=0. Mesuré : 13,5 → 31 tok/s sur la même machine.' },
        ],
      },
      {
        title: { en: 'Video (lab): resident engine, prompt enrichment, WebM export', fr: 'Vidéo (labo) : moteur résident, enrichissement de prompt, export WebM' },
        items: [
          { en: 'The temporal (motion) modules now run entirely on the GPU in a single submission: 5× faster per module, with a CPU-verified fallback and ?videoresident=0.', fr: 'Les modules temporels (motion) tournent désormais entièrement sur le GPU en une seule soumission : 5× plus vite par module, avec repli vérifié contre la référence CPU et ?videoresident=0.' },
          { en: 'Your short prompt is enriched by the local LFM2.5 model into a proper cinematic description before generation: better motion, still 100% on-device.', fr: 'Votre prompt court est enrichi par le modèle local LFM2.5 en vraie description cinématographique avant la génération : un meilleur mouvement, toujours 100 % on-device.' },
          { en: 'The result exports as a looping WebM clip of bounded duration (~10 s) instead of raw frames.', fr: 'Le résultat s’exporte en clip WebM bouclé à durée bornée (~10 s) au lieu de frames brutes.' },
        ],
      },
      {
        title: { en: 'RWKV-7 joins the catalog: linear attention, constant memory', fr: 'RWKV-7 rejoint le catalogue : attention linéaire, mémoire constante' },
        items: [
          { en: 'RWKV-7 G1 0.1B is loadable from the model browser: a 100% recurrent architecture where a fixed ~1 MB state replaces the KV cache. Memory does not grow with the conversation. 128 MB, Apache-2.0, embedded World tokenizer, naive-but-honest replies (it is a 0.1B).', fr: 'RWKV-7 G1 0.1B se charge depuis le navigateur de modèles : une architecture 100 % récurrente où un état fixe d’environ 1 Mo remplace le cache KV. La mémoire ne grandit pas avec la conversation. 128 Mo, Apache-2.0, tokenizer World embarqué, réponses simples mais honnêtes (c’est un 0.1B).' },
        ],
      },
      {
        title: { en: 'Mobile & housekeeping', fr: 'Mobile & entretien' },
        items: [
          { en: 'The full model browser is now reachable on mobile with a “Change model” action: Qwen 3 0.6B and friends are one tap away, no longer desktop-only.', fr: 'Le navigateur de modèles complet est désormais accessible sur mobile avec une action « Changer de modèle » : Qwen 3 0.6B et compagnie sont à un tap, plus réservés au desktop.' },
          { en: 'The storage gauge now shows the browser’s real quota (it depends on your free disk space) instead of an optimistic estimate, the misleading first-visit splash is gone, and the “GPU engine” card is more compact.', fr: 'La jauge de stockage affiche désormais le vrai quota du navigateur (il dépend de l’espace disque libre) au lieu d’une estimation optimiste, le splash de première visite trompeur a disparu, et la carte « Moteur GPU » est plus compacte.' },
        ],
      },
    ],
  },
  {
    date: { en: 'July 21, 2026', fr: '21 juillet 2026' },
    tagline: {
      en: 'A second engine is born: linear-attention and hybrid models run in your browser. A 149 MB model that chats in French, a live demo on /local-ai, and the first video ever generated by Brimkern, entirely on your GPU.',
      fr: 'Un second moteur est né : les modèles à attention linéaire et hybrides tournent dans ton navigateur. Un modèle de 149 Mo qui discute en français, une démo live sur /local-ai, et la première vidéo jamais générée par Brimkern, entièrement sur ton GPU.',
    },
    groups: [
      {
        title: { en: 'LFM2.5 230M: the ultra-light that actually chats (mobile too)', fr: 'LFM2.5 230M : l’ultra-léger qui discute vraiment (mobile aussi)' },
        items: [
          { en: 'New engine path for hybrid architectures (short-convolution + attention): LFM2.5-230M runs end-to-end on our WGSL kernels. 149 MB, replies in clean French, ~24 tok/s.', fr: 'Nouveau chemin moteur pour les architectures hybrides (convolution courte + attention) : LFM2.5-230M tourne de bout en bout sur nos kernels WGSL. 149 Mo, répond en français propre, ~24 tok/s.' },
          { en: 'Available in the main chat as a preset, and on mobile, where you now pick between LFM2.5 (149 MB, recommended) and Qwen 0.5B (378 MB).', fr: 'Disponible dans le chat en preset, et sur mobile, où tu choisis désormais entre LFM2.5 (149 Mo, recommandé) et Qwen 0.5B (378 Mo).' },
          { en: 'Every kernel validated against a CPU oracle, token-for-token vs llama.cpp before shipping.', fr: 'Chaque kernel validé contre un oracle CPU, token par token face à llama.cpp avant livraison.' },
        ],
      },
      {
        title: { en: 'Live demo on /local-ai: classify, extract & chat', fr: 'Démo live sur /local-ai : classer, extraire & discuter' },
        items: [
          { en: 'Sentiment (12/12 on our benches), email extraction with an anti-hallucination guard (an email absent from your text is never invented), and a small French-speaking chat: all in your browser, cached after the first 149 MB download.', fr: 'Sentiment (12/12 sur nos bancs), extraction d’email avec garde-fou anti-hallucination (un email absent de ton texte n’est jamais inventé), et un petit chat francophone : le tout dans ton navigateur, en cache après le premier téléchargement de 149 Mo.' },
          { en: 'Constrained classification under the hood: the model can only answer within the allowed label set. The technique that makes tiny models reliable.', fr: 'Classification contrainte sous le capot : le modèle ne peut répondre que dans le jeu d’étiquettes autorisé. La technique qui rend les petits modèles fiables.' },
        ],
      },
      {
        title: { en: 'First video generated in the browser (lab)', fr: 'Première vidéo générée dans le navigateur (labo)' },
        items: [
          { en: '16 temporally-coherent frames (a fox walking through snow) in ~3.5 minutes, 100% local: AnimateDiff-Lightning motion modules grafted onto our existing image pipeline. Zero new GPU kernels needed.', fr: '16 frames temporellement cohérentes (un renard qui marche dans la neige) en ~3,5 minutes, 100 % local : les modules motion AnimateDiff-Lightning greffés sur notre pipeline image existant. Zéro nouveau kernel GPU nécessaire.' },
          { en: 'Still lab-only (dev bench): the product UI, thermal pacing and WebM export are next.', fr: 'Encore en labo (banc dev) : l’UI produit, le pacing thermique et l’export WebM arrivent ensuite.' },
        ],
      },
      {
        title: { en: 'Fixes & housekeeping', fr: 'Correctifs & entretien' },
        items: [
          { en: 'Reopening a conversation that contains images no longer auto-downloads the image model: only text models auto-load, your saved images display as-is.', fr: 'Rouvrir une conversation contenant des images ne re-télécharge plus le modèle image : seuls les modèles texte se chargent automatiquement, tes images sauvegardées s’affichent telles quelles.' },
          { en: '“Cached” badge renamed “Downloaded” with a distinct solid style: no more confusion with the “Runs well” GPU verdict.', fr: 'Badge « En cache » renommé « Téléchargé » avec un style plein distinct : fini la confusion avec le verdict GPU « Tourne bien ».' },
        ],
      },
    ],
  },
  {
    date: { en: 'July 18, 2026', fr: '18 juillet 2026' },
    tagline: {
      en: 'Brimkern learns to see: show it a photo and ask questions. Entirely on your GPU. Refining an image now starts from its real pixels, and the last deferred kernel lands.',
      fr: 'Brimkern apprend à voir : montre-lui une photo et pose tes questions. Entièrement sur ton GPU. Affiner une image repart désormais de ses vrais pixels, et le dernier kernel différé est livré.',
    },
    groups: [
      {
        title: { en: 'Vision (beta, desktop): image + text → text', fr: 'Vision (bêta, desktop) : image + texte → texte' },
        items: [
          {
            en: 'Qwen2-VL 2B runs fully in the browser: a 675M-parameter vision encoder (32 transformer layers, 2D rotary positions) reads your image as patches, a merger projects them into the language model, and the LLM answers your questions about it. Both weight files stream from Hugging Face and stay cached (~2.3 GB, desktop GPUs only).',
            fr: 'Qwen2-VL 2B tourne entièrement dans le navigateur : un encodeur visuel de 675 M de paramètres (32 couches transformer, positions rotatives 2D) lit l’image en patches, un « merger » les projette dans le modèle de langage, et le LLM répond à tes questions dessus. Les deux fichiers de poids streament depuis Hugging Face et restent en cache (~2,3 Go, GPU de bureau uniquement).',
          },
          {
            en: 'Under the hood: two new position kernels (2D RoPE for the vision tower, M-RoPE for the language model). The second one touches the chat hot path, so it only ever dispatches for this architecture and self-tests at load with a fallback that disables vision, never text.',
            fr: 'Sous le capot : deux nouveaux kernels de position (RoPE 2D pour la tour visuelle, M-RoPE pour le modèle de langage). Le second touche le chemin chaud du chat, donc il ne se déclenche QUE pour cette architecture et s’auto-teste au chargement, avec un repli qui coupe la vision, jamais le texte.',
          },
          {
            en: 'In the model browser, the Qwen2-VL card is now loadable (desktop). Attach an image with the 📎 button and ask away: multi-turn works, everything stays local.',
            fr: 'Dans le catalogue, la carte Qwen2-VL est désormais chargeable (desktop). Joins une image avec le bouton 📎 et pose tes questions : le multi-tours fonctionne, tout reste local.',
          },
        ],
      },
      {
        title: { en: 'Two new brains in the catalog: Qwen 3, and Llama is back', fr: 'Deux nouveaux cerveaux au catalogue : Qwen 3, et Llama est de retour' },
        items: [
          {
            en: 'Qwen 3 (4B and 0.6B): the next generation, clearly stronger than Qwen 2.5 at equal size, with native step-by-step reasoning. The thinking budget selector applies to it. Its QK-Norm architecture is self-tested at load like every kernel change.',
            fr: 'Qwen 3 (4B et 0.6B) : la génération suivante, nettement plus forte que Qwen 2.5 à taille égale, avec le raisonnement pas-à-pas natif. Le sélecteur de budget de réflexion s’y applique. Son architecture QK-Norm est auto-testée au chargement comme chaque évolution de kernel.',
          },
          {
            en: 'Llama 3.2 is repaired and back in the catalog: llama.cpp permutes attention weights at GGUF conversion in a way our kernels didn’t expect. They are now un-permuted at load (all quantizations), and the llama3 long-context frequency scaling is applied. Measured: 178 t/s prefill, 19.5 t/s generation.',
            fr: 'Llama 3.2 est réparé et de retour au catalogue : llama.cpp permute les poids d’attention à la conversion GGUF d’une façon que nos kernels n’attendaient pas. Ils sont désormais dé-permutés au chargement (toutes quantifications), et le scaling de fréquences longue-contexte « llama3 » est appliqué. Mesuré : 178 t/s de prefill, 19,5 t/s de génération.',
          },
        ],
      },
      {
        title: { en: 'Real img2img: refine from the pixels', fr: 'Vrai img2img : affiner depuis les pixels' },
        items: [
          {
            en: '“Refine this image” used to replay the same starting noise; it now encodes the displayed image back into latent space (tiny 5 MB VAE encoder, fetched on first use), re-noises it partially and regenerates: composition is preserved from the actual pixels. Tune with ?strength= (default 0.55).',
            fr: '« Affiner cette image » rejouait le même bruit initial ; désormais l’image affichée est ré-encodée en espace latent (petit encodeur VAE de 5 Mo, téléchargé à la première utilisation), re-bruitée partiellement et régénérée : la composition est conservée depuis les vrais pixels. Réglable via ?strength= (défaut 0.55).',
          },
          {
            en: 'A refined image depends on its source pixels, so it can’t be regenerated from prompt+seed like the others: it is saved whole with the conversation.',
            fr: 'Une image affinée dépend de ses pixels source, donc elle n’est pas régénérable depuis prompt+seed comme les autres : elle est sauvegardée entière avec la conversation.',
          },
        ],
      },
      {
        title: { en: 'Under the hood', fr: 'Sous le capot' },
        items: [
          {
            en: 'The last deferred kernel is in: full (non-causal) attention now gives each (token, head) a 64-lane workgroup with online softmax. One pass over keys instead of two. Self-tested at real UNet shapes at load, silent fallback, ?attnfullwg=0 to force the old kernel.',
            fr: 'Le dernier kernel différé est livré : l’attention pleine (non causale) donne désormais à chaque (token, tête) un workgroup de 64 lanes avec softmax en ligne. Une passe sur les clés au lieu de deux. Auto-testé aux formes réelles du UNet au chargement, repli silencieux, ?attnfullwg=0 pour forcer l’ancien kernel.',
          },
          {
            en: 'Clearing the conversation history now really clears the screen (fresh chat), and the app no longer auto-reopens a conversation whose model isn’t cached: you land on a fresh home instead of a dead chat.',
            fr: 'Vider l’historique des conversations vide maintenant vraiment l’écran (chat neuf), et l’app ne rouvre plus automatiquement une conversation dont le modèle n’est pas en cache : tu arrives sur un accueil neuf au lieu d’un chat mort.',
          },
        ],
      },
    ],
  },
  {
    date: { en: 'July 16, 2026', fr: '16 juillet 2026' },
    tagline: {
      en: 'Long conversations get their speed back (up to ×26 on attention), the GPU can disconnect without killing the app, the model loads itself, and the interface adopts its print identity for good.',
      fr: 'Les longues conversations retrouvent leur vitesse (jusqu’à ×26 sur l’attention), le GPU peut se déconnecter sans tuer l’app, le modèle se charge tout seul, et l’interface assume pour de bon son identité d’imprimeur.',
    },
    groups: [
      {
        title: { en: 'Attention rebuilt for decoding: the end of 1 t/s on long context', fr: 'L’attention refaite pour le décodage : fin du 1 t/s en contexte long' },
        items: [
          {
            en: 'The attention kernel used a single GPU thread per head: 14 threads total while decoding. On hardware built for thousands. Past ~1,000 tokens of context it became the wall (~680 ms per token). New kernels give each head a full 64-lane workgroup with online softmax: ×14 to ×26 measured, identical results to 1e-7.',
            fr: 'Le kernel d’attention n’utilisait qu’un thread GPU par tête : 14 threads en tout au décodage. Sur du matériel taillé pour des milliers. Au-delà de ~1 000 tokens de contexte, il devenait le mur (~680 ms par token). Les nouveaux kernels donnent à chaque tête un workgroup complet de 64 lanes avec softmax en ligne : ×14 à ×26 mesurés, résultats identiques à 1e-7 près.',
          },
          {
            en: 'Belt and braces: at load time the engine self-tests the new kernels at real-world shapes; a GPU driver that miscompiles them falls back silently to the classic kernels (slower on long context, correct everywhere). ?attndecode=0 forces the fallback for diagnosis.',
            fr: 'Ceinture et bretelles : au chargement, le moteur auto-teste les nouveaux kernels aux formes réelles ; un driver GPU qui les miscompile bascule en silence sur les kernels classiques (plus lents en contexte long, corrects partout). ?attndecode=0 force le repli pour diagnostiquer.',
          },
          {
            en: 'On mobile, answers are now deliberately concise (the phone shouldn’t heat up for a minute per reply), and the screen stays awake while the model works.',
            fr: 'Sur mobile, les réponses sont désormais volontairement concises (le téléphone n’a pas à chauffer une minute par réponse), et l’écran reste allumé pendant que le modèle travaille.',
          },
        ],
      },
      {
        title: { en: 'A GPU crash is no longer the end', fr: 'Un crash GPU n’est plus une fin' },
        items: [
          {
            en: 'When the system reclaims the GPU (long conversation, backgrounded tab, thermal pressure), the app used to keep running on a dead device: “ready” status, sends allowed, every compute failing. It now detects the loss, keeps your conversation, and offers real exits: reload the model, inspect/clear storage.',
            fr: 'Quand le système reprend le GPU (longue conversation, onglet en arrière-plan, chauffe), l’app continuait sur un device mort : statut « prêt », envois permis, chaque calcul en échec. Elle détecte désormais la perte, conserve votre conversation, et propose de vraies sorties : recharger le modèle, inspecter/vider le stockage.',
          },
          {
            en: 'WebGPU detection retries before giving up, and “Unsupported” now explains the #1 cause: hardware acceleration disabled in the browser. With the exact setting to flip.',
            fr: 'La détection WebGPU réessaie avant d’abandonner, et « Non supporté » explique désormais la cause n°1 : l’accélération matérielle désactivée dans le navigateur. Avec le réglage exact à activer.',
          },
        ],
      },
      {
        title: { en: 'The model loads itself', fr: 'Le modèle se charge tout seul' },
        items: [
          {
            en: 'Reopening the app resumes your last conversation AND its model when it’s fully cached (streamed BRIKs included: desktop and mobile alike, zero network). Partially downloaded? The background prefetch finishes the job: with real progress shown on the first-visit splash. Then loads the model on its own.',
            fr: 'Rouvrir l’app reprend votre dernière conversation ET son modèle quand il est intégralement en cache (BRIK streamés compris : desktop comme mobile, zéro réseau). Téléchargement partiel ? Le préchargement d’arrière-plan finit le travail : avec le vrai progrès affiché sur le splash de première visite, puis charge le modèle tout seul.',
          },
          {
            en: 'Fixed along the way: the background prefetch could silently die before ever starting, and an auto-load at startup mistook the phone for a desktop (loading f16 instead of the mixed format).',
            fr: 'Corrigé au passage : le préchargement d’arrière-plan pouvait mourir en silence avant même de démarrer, et un chargement auto au démarrage prenait le téléphone pour un desktop (f16 chargé au lieu du format mixte).',
          },
        ],
      },
      {
        title: { en: 'Image generation slims down, and lands on mobile', fr: 'La génération d’image maigrit, et arrive sur mobile' },
        items: [
          {
            en: 'The image pipeline downloaded 2.4 GB of fp16 weights, then quantized them to int8 on your GPU at every load. The weights now ship pre-quantized and range-streamed (resumable, cached): 1.28 GB on desktop, identical output. Verified numerically AND visually against the old path.',
            fr: 'Le pipeline image téléchargeait 2,4 Go de poids fp16, puis les quantifiait en int8 sur votre GPU à chaque chargement. Les poids arrivent désormais pré-quantifiés et streamés par plages (repris, mis en cache) : 1,28 Go sur desktop, sortie identique. Vérifiée numériquement ET visuellement contre l’ancien chemin.',
          },
          {
            en: 'New on mobile (beta): “Try image generation” loads SDXS-512, a distilled 1-step UNet, in an int4 “light” build with a lightened text encoder. ~445 MB all-in for a native 512px image. Judged side-by-side against the heavy build: near-identical.',
            fr: 'Nouveau sur mobile (bêta) : « Essayer la génération d’image » charge SDXS-512, un UNet distillé à 1 étape, en build int4 « light » avec un encodeur de texte allégé. ~445 Mo tout compris pour une image 512px native. Jugé côte à côte contre le build lourd : quasi identique.',
          },
        ],
      },
      {
        title: { en: '“Le Kern”, fully inked', fr: '« Le Kern », encré jusqu’au bout' },
        items: [
          {
            en: 'The display face becomes Fraunces (a printer’s serif: the kern-B mark, titles and splash carry it), a red printer’s rule crowns the app, the caret and text selection turn Kern red, and the welcome screen reads like a type specimen. The last purple remnants and gradients are gone.',
            fr: 'La police de titre devient Fraunces (une serif d’imprimeur : la marque kern-B, les titres et le splash la portent), un filet rouge d’imprimeur coiffe l’app, le curseur de saisie et la sélection passent au rouge Kern, et l’écran d’accueil se lit comme une page de spécimen. Les derniers reliquats violets et dégradés ont disparu.',
          },
          {
            en: 'Mobile decluttered: the BRIK-conversion banner is gone (the mixed model is served automatically), and a single starter suggestion leaves room for the model’s welcome message.',
            fr: 'Mobile désencombré : la bannière de conversion BRIK disparaît (le modèle mixte est servi automatiquement), et une seule suggestion de départ laisse la place au message d’accueil du modèle.',
          },
        ],
      },
    ],
  },
  {
    date: { en: 'July 15, 2026', fr: '15 juillet 2026' },
    tagline: {
      en: 'The mobile model gets int8 quality at nearly the int4 size (new “mixed” format), downloads itself in the background while you read the home screen, and greets first-time visitors properly.',
      fr: 'Le modèle mobile gagne la qualité int8 pour presque la taille int4 (nouveau format « mixte »), se télécharge tout seul en arrière-plan pendant que vous lisez l’accueil, et accueille dignement les nouveaux venus.',
    },
    groups: [
      {
        title: { en: 'Mixed quantization: int8 quality, (almost) int4 size', fr: 'Quantification mixte : la qualité int8 pour (presque) la taille int4' },
        items: [
          {
            en: 'A tensor-by-tensor A/B study showed WHERE int4 breaks a small model: full-int4 produces nonsense, but keeping just the attention matrices in int8 restores int8-grade quality. The new “mixed” format stores exactly that: int4 body + int8 attention.',
            fr: 'Une étude A/B tenseur par tenseur a montré OÙ l’int4 casse un petit modèle : le tout-int4 produit du charabia, mais garder les seules matrices d’attention en int8 restaure une qualité digne de l’int8. Le nouveau format « mixte » stocke exactement ça : corps int4 + attention int8.',
          },
          {
            en: 'The mobile model is served in mixed format: 377 MB instead of 508 (full int8). For +18 MB over the old int4 file that degraded it. The diagnostics strip shows “mixed int8+int4” honestly.',
            fr: 'Le modèle mobile est servi au format mixte : 377 Mo au lieu de 508 (int8 plein). Pour +18 Mo par rapport à l’ancien fichier int4 qui le dégradait. Le bandeau de diagnostic affiche honnêtement « mixte int8+int4 ».',
          },
          {
            en: 'The “Mixed” profile is also available in both BRIK converters (recommended for small models: int4 stays for the big ones).',
            fr: 'Le profil « Mixte » est aussi proposé dans les deux convertisseurs BRIK (recommandé pour les petits modèles : l’int4 reste pour les gros).',
          },
        ],
      },
      {
        title: { en: 'The download disappears into the background', fr: 'Le téléchargement s’efface en arrière-plan' },
        items: [
          {
            en: 'On mobile, if the model isn’t (fully) cached yet, its download now starts by itself shortly after you arrive: by the time you tap “Load the model”, most of it is already local. Resumable: a closed tab only re-downloads what’s missing.',
            fr: 'Sur mobile, si le modèle n’est pas (entièrement) en cache, son téléchargement démarre désormais tout seul peu après votre arrivée : au moment de taper « Charger le modèle », l’essentiel est déjà local. Reprise incluse : un onglet fermé ne re-télécharge que ce qui manque.',
          },
          {
            en: 'Visible and polite: a progress line with a Cancel link, nothing starts if your phone’s Data Saver is on, and any real load takes over instantly.',
            fr: 'Visible et poli : une ligne de progression avec « Annuler », rien ne démarre si l’économiseur de données du téléphone est actif, et tout chargement réel reprend la main instantanément.',
          },
          {
            en: 'First visit on mobile: a short welcome screen (“Preparing your AI space…”) covers the kickoff. Tap to skip, never shown again.',
            fr: 'Première visite sur mobile : un court écran d’accueil (« Préparation de votre espace IA… ») couvre le démarrage. Tap pour passer, plus jamais montré ensuite.',
          },
        ],
      },
      {
        title: { en: 'Under the hood', fr: 'Sous le capot' },
        items: [
          {
            en: 'Prompts are no longer re-tokenized from scratch on every message: only the new turn is tokenized (~×90 faster on long histories).',
            fr: 'Le prompt n’est plus re-tokenisé de zéro à chaque message : seul le nouveau tour l’est (~×90 plus rapide sur les longs historiques).',
          },
          {
            en: 'Generated images no longer freeze the page for ~100 ms after rendering (async PNG encoding).',
            fr: 'Les images générées ne gèlent plus la page ~100 ms après le rendu (encodage PNG asynchrone).',
          },
        ],
      },
    ],
  },
  {
    date: { en: 'July 6, 2026', fr: '6 juillet 2026' },
    tagline: {
      en: 'Mobile finally smooth and reliable: ~4× faster conversations (KV cache reused across turns, GPU-side sampling), int8 by default, and a Settings panel.',
      fr: 'Mobile enfin fluide et fiable : conversations ~4× plus rapides (cache KV réutilisé entre les tours, échantillonnage sur GPU), int8 par défaut, et un panneau Réglages.',
    },
    groups: [
      {
        title: { en: 'Faster conversations: especially on mobile', fr: 'Conversations plus rapides : surtout sur mobile' },
        items: [
          {
            en: 'The attention (KV) cache is now reused from one message to the next: only your new message is processed, never the full history again. Previously every turn re-read the entire conversation: response time doubled from the 2nd message on; it is now constant.',
            fr: 'Le cache d’attention (KV) est réutilisé d’un message à l’autre : seul votre nouveau message est analysé, plus jamais tout l’historique. Avant, chaque tour relisait toute la conversation : le temps de réponse doublait dès le 2e message ; il est maintenant constant.',
          },
          {
            en: 'Next-token sampling now runs on the GPU (softcap, repetition penalty and top-K fused into the same pass as the forward computation): ~600 KB read back per token → 512 bytes. Self-tested at load time, with automatic fallback to the CPU path if the device’s GPU fails the test.',
            fr: 'Échantillonnage du prochain token calculé sur le GPU (softcap, pénalité de répétition et top-K dans la même passe que le calcul) : ~600 Ko relus par token → 512 octets. Auto-testé au chargement, avec repli automatique sur le chemin CPU si le GPU de l’appareil échoue au test.',
          },
          {
            en: 'Leaner generation loop: end-of-text detection on the last few tokens only, and the display refreshes ~8×/s (instead of a full re-detokenization and re-render on EVERY token, which choked phones). Only the bubble being typed re-renders.',
            fr: 'Boucle de génération allégée : détection de fin sur les derniers tokens seulement et affichage rafraîchi ~8×/s (au lieu d’une re-détokenisation et d’un re-rendu complets à CHAQUE token, qui asphyxiaient les téléphones). Seule la bulle en cours de frappe se re-rend.',
          },
          {
            en: 'Measured on a phone (Qwen 0.5B): full response in ~10 s instead of 20–38 s, generation at ~5 t/s instead of 2.7.',
            fr: 'Résultat mesuré sur téléphone (Qwen 0.5B) : réponse complète en ~10 s au lieu de 20–38 s, génération à ~5 t/s au lieu de 2,7.',
          },
        ],
      },
      {
        title: { en: 'Mobile quality: int8 by default', fr: 'Qualité mobile : int8 par défaut' },
        items: [
          {
            en: 'Small models (≤ ~1.2B parameters) now load in int8 on mobile instead of int4: int4 severely degraded a 0.5B (nonsensical answers, repetition loops) while it easily fits in int8. int4 stays reserved for large models that would not fit otherwise.',
            fr: 'Les petits modèles (≤ ~1,2 Md de paramètres) se chargent désormais en int8 sur mobile, plus en int4 : l’int4 dégradait fortement un 0.5B (réponses absurdes, répétitions en boucle) alors qu’il tient largement en int8. L’int4 reste réservé aux gros modèles qui ne rentreraient pas.',
          },
          {
            en: 'And the attention cache stays in f32 by default (faster): its int8 variant. Which adds work on every token: is only enabled where its VRAM savings really matter (large models, int4).',
            fr: 'Et le cache d’attention reste en f32 par défaut (plus rapide) : sa version int8. Qui ajoute du travail à chaque token : n’est activée que là où sa VRAM compte vraiment (gros modèles, int4).',
          },
          {
            en: 'New diagnostics strip under every response: actual precision, KV cache format, sampling path and context reuse, so you can see what actually ran, even without a console. And it tells the truth: when the model file is more quantized than the requested precision, it shows e.g. “int8 (source int4)”.',
            fr: 'Nouveau bandeau de diagnostic sous chaque réponse : précision réelle, format du cache KV, chemin d’échantillonnage et réutilisation du contexte. Pour comprendre ce qui a tourné, même sans console. Et il dit la vérité : quand le fichier du modèle est plus quantifié que la précision demandée, il affiche par ex. « int8 (source int4) ».',
          },
          {
            en: 'Persistent storage is now requested from the browser: the cached streamed model should no longer be evicted between sessions on mobile.',
            fr: 'Stockage persistant demandé au navigateur : le modèle streamé mis en cache ne devrait plus être effacé entre deux sessions sur mobile.',
          },
        ],
      },
      {
        title: { en: 'Image pipeline: even leaner', fr: 'Pipeline image : encore plus léger' },
        items: [
          {
            en: 'The text encoder (CLIP) joins the UNet: int8-quantized, GPU-resident, executed in a single submission. No more ~280 round trips and ~500 MB of weights re-uploaded to the GPU for every image.',
            fr: 'L’encodeur de texte (CLIP) rejoint le UNet : quantifié int8, résident sur le GPU, exécuté en une seule soumission. Fini les ~280 allers-retours et les ~500 Mo de poids renvoyés au GPU à chaque image.',
          },
          {
            en: 'The image model now loads without freezing: fp16 weight conversion happens on the GPU (the tab used to lock up for ~10 s on every load).',
            fr: 'Chargement du modèle image sans blocage : la conversion des poids fp16 se fait désormais sur le GPU (l’onglet gelait ~10 s à chaque chargement).',
          },
          {
            en: 'GPU memory is released after each image (the scratch buffer used to hold on to hundreds of MB), and the image pipeline is fully freed (~1 GB) when a text model is loaded.',
            fr: 'Mémoire GPU rendue après chaque image (le tampon de travail conservait des centaines de Mo), et le pipeline image est entièrement libéré (~1 Go) quand on charge un modèle de texte.',
          },
          {
            en: 'Faster 512px decode: the dominant 3×3 convolutions now run as a tiled kernel with shared memory (each pixel read once instead of 9×, each weight once instead of 256×), and group normalization uses 4× more threads. Both self-tested at load with automatic fallback.',
            fr: 'Décodage 512px plus rapide : les convolutions 3×3 dominantes passent en kernel tuilé à mémoire partagée (chaque pixel lu 1× au lieu de 9×, chaque poids 1× au lieu de 256×), et la normalisation de groupe utilise 4× plus de threads. Les deux auto-testés au chargement avec repli automatique.',
          },
        ],
      },
      {
        title: { en: 'Web & tools (MCP): first steps, fully transparent', fr: 'Web & outils (MCP) : premiers pas, en toute transparence' },
        items: [
          {
            en: 'Optional web search (OFF by default): the model draws on Wikipedia excerpts and cites its sources. Only your question is sent: never the conversation. Flagged under every affected response and in the input bar.',
            fr: 'Recherche web optionnelle (OFF par défaut) : le modèle s’appuie sur des extraits Wikipédia et cite ses sources. Seule votre question est envoyée : jamais la conversation. Signalé sous chaque réponse concernée et dans la barre de saisie.',
          },
          {
            en: 'Local calculator (ON by default, no network): arithmetic in your messages is evaluated exactly on-device and the result handed to the model. Small models systematically get arithmetic wrong. The model also knows today’s date.',
            fr: 'Calculatrice locale (ON par défaut, aucun réseau) : les calculs de vos messages sont évalués exactement côté machine et le résultat fourni au modèle. Les petits modèles se trompent systématiquement en arithmétique. Le modèle connaît aussi la date du jour.',
          },
          {
            en: 'Pasted-link reading (OFF by default): paste a URL and the model reads the page (via the r.jina.ai reader. Noted on the option).',
            fr: 'Lecture des liens collés (OFF par défaut) : collez une URL, le modèle lit la page (via le lecteur r.jina.ai. Indiqué sur l’option).',
          },
        ],
      },
      {
        title: { en: 'Settings & fixes', fr: 'Réglages & correctifs' },
        items: [
          {
            en: 'New “Settings” panel in the sidebar: GPU power (Eco / Balanced / Max. Keeps heat in check during image generation) and the Web & tools options above.',
            fr: 'Nouveau panneau « Réglages » dans la barre latérale : puissance GPU (Éco / Équilibré / Max. Régule la chauffe pendant la génération d’images) et les options Web & outils ci-dessus.',
          },
          {
            en: 'Fully bilingual interface: the FR/EN toggle now covers the entire application (panels, errors, loading steps, tooltips…). Including this changelog.',
            fr: 'Interface entièrement bilingue : la bascule FR/EN couvre désormais toute l’application (panneaux, erreurs, étapes de chargement, info-bulles…). Y compris ce changelog.',
          },
          {
            en: 'Snappier streamed model loading: a layer’s weights are fetched in a single request instead of 9–12 (~25 requests instead of ~220 for a whole model).',
            fr: 'Chargement des modèles streamés plus vif : les poids d’une couche sont récupérés en une seule requête au lieu de 9-12 (~25 requêtes au lieu de ~220 pour un modèle entier).',
          },
          {
            en: 'The loading screen is now a real log: opaque background and a list of the actual steps (download, quantization, validation) with their progress.',
            fr: 'L’écran de chargement devient un vrai journal : fond opaque et liste des étapes réelles (téléchargement, quantification, validation) avec leur progression.',
          },
          {
            en: 'Auto-scroll respects your reading: if you scroll up while the AI is writing, you are never yanked back to the bottom. It resumes once you scroll back down.',
            fr: 'Le défilement automatique respecte votre lecture : si vous remontez pendant que l’IA écrit, plus aucun retour forcé en bas. Il reprend quand vous y redescendez.',
          },
          {
            en: 'Fixed: loading a text model on top of image mode did not switch over. Messages were still sent to image generation (and the image pipeline stayed in memory).',
            fr: 'Corrigé : charger un modèle de texte par-dessus le mode image ne basculait pas. Les messages partaient en génération d’image (et le pipeline image restait en mémoire).',
          },
          {
            en: 'Diagnostic switches in the URL (?gputopk=0, ?kvreuse=0) to isolate device-specific issues.',
            fr: 'Interrupteurs de diagnostic dans l’URL (?gputopk=0, ?kvreuse=0) pour isoler un souci propre à un appareil.',
          },
        ],
      },
    ],
  },
  {
    date: { en: 'July 2, 2026', fr: '2 juillet 2026' },
    tagline: {
      en: '100% in-browser image generation (SD-Turbo on hand-written WGSL), int8-quantized GPU-resident UNet, thermal throttling, and a new visual identity.',
      fr: 'Génération d’images 100 % navigateur (SD-Turbo en WGSL maison), UNet quantifié int8 résident GPU, régulation thermique, et une nouvelle identité visuelle.',
    },
    groups: [
      {
        title: { en: 'Image generation: Stable Diffusion Turbo, 100% local', fr: 'Génération d’images : Stable Diffusion Turbo, 100 % local' },
        items: [
          {
            en: 'New image mode in the chat: describe an image and it is generated entirely in the browser. CLIP (prompt encoding), UNet (denoising) and the TAESD decoder all run on our own WGSL kernels, with no server involved.',
            fr: 'Nouveau mode image dans le chat : décris une image, elle est générée entièrement dans le navigateur. CLIP (encodage du prompt), UNet (débruitage) et décodeur TAESD tournent sur nos propres kernels WGSL, sans aucun serveur.',
          },
          {
            en: 'Prompt fidelity fixed against the diffusers reference: tokenizer padding (“!”, not <|endoftext|>. With no attention mask, all 77 positions count) and CLIP’s final LayerNorm now applied. Result: images that actually match the request.',
            fr: 'Fidélité au prompt corrigée face à la référence diffusers : padding du tokenizer (« ! », pas <|endoftext|> : sans masque d’attention, les 77 positions comptent) et LayerNorm final du CLIP appliqué. Résultat : des images cohérentes avec la demande.',
          },
          {
            en: 'Per-generation quality selector above the input area: 128px (fast), 256px (recommended) or 512px (SD-Turbo’s native resolution).',
            fr: 'Qualité réglable par génération au-dessus de la zone de saisie : 128px (rapide), 256px (conseillé) ou 512px (résolution native de SD-Turbo).',
          },
          {
            en: 'Lightweight conversations: only a blurred thumbnail + the prompt + the seed are persisted; “click to reveal” regenerates the exact same image (deterministic generation) without ever storing the pixels.',
            fr: 'Conversations légères : seule une vignette floue + le prompt + la graine sont persistés ; « cliquer pour révéler » régénère l’image à l’identique (génération déterministe) sans jamais stocker les pixels.',
          },
          {
            en: 'Weights (UNet + CLIP fp16, TAESD) are cached by the browser on first load → no download on subsequent runs.',
            fr: 'Poids (UNet + CLIP fp16, TAESD) mis en cache navigateur au premier chargement → les fois suivantes, aucun téléchargement.',
          },
        ],
      },
      {
        title: { en: 'Performance & thermals: resident int8 + throttling', fr: 'Performance & thermique : int8 résident + régulation' },
        items: [
          {
            en: 'UNet quantized to int8 (BRIK8) directly on the GPU at load time: ~0.9 GB of VRAM instead of ~3.4 GB in f32, and no more weight re-uploads per image (previously: ~3.4 GB re-transferred per generation). New int8 conv2d kernel with fused dequantization, covered by the self-test.',
            fr: 'UNet quantifié int8 (BRIK8) directement sur le GPU au chargement : ~0,9 Go de VRAM au lieu de ~3,4 Go en f32, et plus aucun ré-envoi de poids à chaque image (avant : ~3,4 Go re-transférés par génération). Nouveau kernel conv2d int8 à déquantification fusionnée, couvert par le self-test.',
          },
          {
            en: 'End-to-end GPU-resident execution: activations stay on the GPU across all blocks (UNet and decoder), with a single CPU readback per denoising step → far fewer round trips, more efficient generation.',
            fr: 'Exécution GPU-résidente de bout en bout : les activations restent sur le GPU entre tous les blocs (UNet et décodeur), une seule lecture CPU par étape de débruitage → beaucoup moins d’allers-retours, génération plus efficace.',
          },
          {
            en: 'Built-in thermal throttling: the pipeline measures the GPU time actually consumed and inserts proportional pauses (~60% target load). Generation smooths out its power draw instead of heating up the machine in one continuous burst.',
            fr: 'Régulation thermique intégrée : le pipeline mesure le temps GPU réellement consommé et intercale des pauses proportionnelles (~60 % de charge cible). La génération lisse sa consommation au lieu de faire chauffer la machine en rafale continue.',
          },
          {
            en: 'Detailed progress during generation (current denoising step + UNet block).',
            fr: 'Progression détaillée pendant la génération (étape de débruitage + bloc UNet en cours).',
          },
        ],
      },
      {
        title: { en: 'New identity : “Le Kern”', fr: 'Nouvelle identité : « Le Kern »' },
        items: [
          {
            en: 'Goodbye purple and gradient logo: enter a paper / ink / printer’s-red identity, a nod to the typographic kerning in brimKERN. Matching “ink” dark mode.',
            fr: 'Exit le violet et le logo dégradé : place à une identité papier / encre / rouge imprimeur, en clin d’œil au crénage typographique de brimKERN. Mode sombre « encre » assorti.',
          },
          {
            en: 'Logo redrawn as flat SVG (a massive B notched by a diagonal kern): crisp at every size, follows the light/dark theme, and replaces 700 KB of PNG.',
            fr: 'Logo redessiné en SVG plat (un B massif entaillé d’un kern diagonal) : net à toutes les tailles, suit le thème clair/sombre, et remplace 700 Ko de PNG.',
          },
          {
            en: 'Favicon and share card (OpenGraph) updated to the new identity.',
            fr: 'Favicon et carte de partage (OpenGraph) mis à jour dans la nouvelle identité.',
          },
        ],
      },
      {
        title: { en: 'Cleanup', fr: 'Nettoyage' },
        items: [
          {
            en: 'Removed the “preview” placeholder image generator, the Llama 2/3 prompt templates unreachable since Llama was pulled, and unused assets: lighter bundle.',
            fr: 'Suppression du générateur d’image « aperçu » (placeholder), des gabarits de prompt Llama 2/3 inaccessibles depuis le retrait de Llama, et des assets inutilisés : bundle plus léger.',
          },
        ],
      },
    ],
  },
  {
    date: { en: 'June 25, 2026', fr: '25 juin 2026' },
    tagline: {
      en: 'Gemma 2 fully working, automatic tokenizer matching, conversation resume, prefill performance (tiled matmul), Skills, a richer storage panel and a bilingual FR/EN interface.',
      fr: 'Gemma 2 pleinement fonctionnel, appariement tokenizer auto, reprise de conversation, perf prefill (matmul tilé), Skills, stockage enrichi et interface bilingue FR/EN.',
    },
    groups: [
      {
        title: { en: 'Gemma 2: fully working', fr: 'Gemma 2: pleinement fonctionnel' },
        items: [
          {
            en: 'Coherent generation on Gemma 2 (2B): fixed a numeric overflow in the GELU activation (which produced NaNs) and the double application of the (1+w) RMSNorm. The cause of the garbled text.',
            fr: 'Génération cohérente sur Gemma 2 (2B) : correction d’un débordement numérique de l’activation GELU (qui produisait des NaN), et de la double application de la normalisation RMSNorm (1+w). La cause du texte incohérent.',
          },
          {
            en: 'Automatic tokenizer + architecture matching from the GGUF file: loading a model can no longer mistakenly use another model’s tokenizer (a vocabulary mismatch produced gibberish even though the math was correct).',
            fr: 'Appariement automatique tokenizer + architecture depuis le fichier GGUF : charger un modèle n’utilise plus par erreur le tokenizer d’un autre (un mismatch de vocabulaire donnait du charabia malgré un calcul correct).',
          },
          {
            en: 'Reusable foundation for adding more local model families (next target: Microsoft Phi-3.5-mini).',
            fr: 'Socle réutilisable pour ajouter d’autres familles de modèles locaux (prochaine cible : Microsoft Phi-3.5-mini).',
          },
        ],
      },
      {
        title: { en: 'Model selection & storage', fr: 'Sélection de modèle & stockage' },
        items: [
          {
            en: 'Full resume on open: the last conversation is reloaded and, if the model it used is already cached, it is reloaded automatically (no network) → you land straight back in a ready-to-chat session.',
            fr: 'Reprise complète à l’ouverture : la dernière conversation est rechargée et, si le modèle qu’elle utilisait est déjà en cache, il est rechargé automatiquement (sans réseau) → on retombe directement sur une session prête à discuter.',
          },
          {
            en: 'New wide-format “Browse models” picker with search (name, use case, tag) and a grid: far more readable than the cramped list as the catalog grows.',
            fr: 'Nouveau sélecteur « Parcourir les modèles » en fenêtre large avec recherche (nom, usage, tag) et grille : plus lisible que la liste étriquée à mesure que le catalogue grandit.',
          },
          {
            en: 'Badges on every model: “● cached” (already downloaded locally), “BRIK recommended” (≥ ~1.5B: 2–4× less VRAM + instant reopens), and an indicator on the currently loaded model.',
            fr: 'Badges sur chaque modèle : « ● en cache » (déjà téléchargé localement), « BRIK conseillé » (≥ ~1.5B : ÷2–4 la VRAM + réouvertures instantanées), et indicateur du modèle actuellement chargé.',
          },
          {
            en: 'Storage panel: the active model is highlighted, a “loaded” badge marks the matching BRIK, and a “Delete all” button clears everything (caches + BRIK + history).',
            fr: 'Panneau Stockage : modèle actif mis en évidence, badge « chargé » sur le BRIK correspondant, et bouton « Tout supprimer » (caches + BRIK + historique).',
          },
          {
            en: 'Roadmap: preview of the next architecture to be ported to our kernels (Microsoft Phi-3.5-mini).',
            fr: 'Roadmap : aperçu de la prochaine architecture portée sur nos kernels (Microsoft Phi-3.5-mini).',
          },
        ],
      },
      {
        title: { en: 'Interface: unified model picker', fr: 'Interface : sélecteur de modèle unifié' },
        items: [
          {
            en: 'All model selection now goes through a single fixed-size “Choose a model” window (internal scroll): a Models tab (grid + search + creator/modality per tile) and an Import tab (local file, GGUF URL, .brik stream), with the “Convert to BRIK” checkbox.',
            fr: 'Toute la sélection de modèle passe par une seule fenêtre « Choisir un modèle » à taille fixe (scroll interne) : onglet Modèles (grille + recherche + créateur/modalité par tuile) et onglet Importer (fichier local, URL GGUF, stream .brik), avec la case « Convertir en BRIK ».',
          },
          {
            en: 'Leaner chat header: shortened model name (tooltip on hover), language/theme toggle moved next to the logo, and dev options (precision/VRAM, KV cache, benchmark) folded into an accordion closed by default.',
            fr: 'En-tête de chat allégé : nom du modèle raccourci (info-bulle au survol), bascule langue/thème déplacée près du logo, et options dev (précision/VRAM, cache KV, benchmark) repliées dans un accordéon fermé par défaut.',
          },
          {
            en: 'Multimodal roadmap preview (Microsoft Phi-3.5, Mistral, Stable Diffusion, Qwen2-VL) as “coming soon” cards.',
            fr: 'Aperçu roadmap multimodale (Microsoft Phi-3.5, Mistral, Stable Diffusion, Qwen2-VL) en cartes « bientôt ».',
          },
        ],
      },
      {
        title: { en: 'Performance & conversion', fr: 'Performance & conversion' },
        items: [
          {
            en: 'Tiled q8/q4 matmul for prefill: each invocation computes 4 tokens at once, dequantizing each weight only once → ~4× less weight memory traffic during prompt processing.',
            fr: 'Matmul q8/q4 « tilé » au prefill : chaque invocation calcule 4 tokens d’un coup en déquantifiant chaque poids une seule fois → ~4× moins de trafic mémoire poids sur le traitement du prompt.',
          },
          {
            en: 'Streaming GGUF → BRIK conversion (shard by shard): peak memory ≈ one layer instead of the whole model → large models convert in the browser without exhausting RAM.',
            fr: 'Conversion GGUF → BRIK en flux (shard par shard) : pic mémoire ≈ une couche au lieu du modèle entier → de gros modèles se convertissent dans le navigateur sans saturer la RAM.',
          },
          {
            en: 'Llama temporarily removed from the offered architectures (RoPE incompatibility with weights permuted by llama.cpp → incoherent output); it will return with a suitable RoPE mode. Active architectures: Qwen 2/2.5, Gemma 2, DeepSeek-R1 (Qwen distill).',
            fr: 'Llama temporairement retiré des architectures proposées (incompatibilité RoPE / poids permutés par llama.cpp → sorties incohérentes) ; il reviendra avec un mode RoPE adapté. Architectures actives : Qwen 2/2.5, Gemma 2, DeepSeek-R1 (distill Qwen).',
          },
        ],
      },
      {
        title: { en: 'Skills: reusable instructions', fr: 'Skills : consignes réutilisables' },
        items: [
          {
            en: 'A library of “skills” (personas / system instructions): built-ins + your own skills, persisted locally.',
            fr: 'Bibliothèque de « skills » (personas / instructions système) : intégrés + tes propres skills, persistés localement.',
          },
          {
            en: 'Multi-select (skills combine), import from a GitHub URL, and a popup reachable via a button to the left of the chat bar.',
            fr: 'Multi-sélection (les skills se combinent), import depuis une URL GitHub, et popup accessible via un bouton à gauche de la barre de chat.',
          },
        ],
      },
      {
        title: { en: 'Storage management', fr: 'Gestion du stockage' },
        items: [
          {
            en: '“Storage” panel: see the space taken by streamed models, downloaded GGUFs, converted BRIKs and chat history. With per-item deletion.',
            fr: 'Panneau « Stockage » : voir l’espace pris par les modèles streamés, GGUF téléchargés, BRIK convertis et l’historique. Avec suppression individuelle.',
          },
        ],
      },
      {
        title: { en: 'Mobile & bilingual', fr: 'Mobile & bilingue' },
        items: [
          {
            en: 'Simplified mobile: a single ready-to-use model (streamed Qwen 0.5B BRIK), a download progress bar, and the chat area shows while loading.',
            fr: 'Mobile simplifié : un seul modèle prêt à l’emploi (Qwen 0.5B BRIK streamé), barre de progression de téléchargement, et la zone de chat s’affiche pendant le chargement.',
          },
          {
            en: 'Bilingual interface: French (default) / English, toggle in the header, remembered.',
            fr: 'Interface bilingue : français (défaut) / anglais, bascule dans l’en-tête, mémorisée.',
          },
        ],
      },
    ],
  },
  {
    date: { en: 'June 24, 2026', fr: '24 juin 2026' },
    tagline: {
      en: 'Self-contained BRIK: hosted models, embedded tokenizer, lighter files, and optimized mobile loading.',
      fr: 'BRIK autonome : modèles hébergés, tokenizer embarqué, fichiers plus légers, et chargement mobile optimisé.',
    },
    groups: [
      {
        title: { en: 'Self-contained BRIK, hosted & mobile-optimized', fr: 'BRIK autonome, hébergé & optimisé mobile' },
        items: [
          {
            en: 'Tokenizer embedded in the .brik → 100% offline loading, no external fetch and no manual tokenizer selection.',
            fr: 'Tokenizer embarqué dans le .brik → chargement 100 % hors-ligne, sans fetch externe ni choix manuel de tokenizer.',
          },
          {
            en: 'Tied embeddings deduplicated (output = token_embd) → file ~⅓ smaller, with no quality loss.',
            fr: 'Embeddings « tied » dédupliquées (output = token_embd) → fichier ~⅓ plus léger, sans perte de qualité.',
          },
          {
            en: 'Pre-converted Qwen 2.5 0.5B model, hosted and streamed via HTTP Range (low VRAM) → optimized direct loading, on mobile and desktop alike.',
            fr: 'Modèle Qwen 2.5 0.5B pré-converti, hébergé et streamé par HTTP Range (faible VRAM) → chargement direct optimisé, mobile comme desktop.',
          },
          {
            en: 'More reliable GGUF → BRIK conversion: very large tensors are processed in slices so they no longer exceed the GPU buffer limit (which silently corrupted weights).',
            fr: 'Conversion GGUF → BRIK fiabilisée : les très gros tenseurs sont traités par tranches pour ne plus dépasser la limite de buffer GPU (qui corrompait silencieusement les poids).',
          },
          {
            en: 'Adjustable thinking level (off / low / medium / high) for reasoning models; catalog narrowed to fully supported architectures (Qwen, Gemma, DeepSeek).',
            fr: 'Niveau de réflexion réglable (off / low / medium / high) pour les modèles de raisonnement ; catalogue resserré sur les architectures pleinement supportées (Qwen, Gemma, DeepSeek).',
          },
        ],
      },
      {
        title: { en: 'BRIK v2 format: lighter & streamable', fr: 'Format BRIK v2 : plus léger & streamable' },
        items: [
          {
            en: 'Web-native BRIK8 (int8) and BRIK4 (int4) quants: dequantization fused into the GPU matmul (weights kept quantized in VRAM), small download AND fast inference.',
            fr: 'Quants web-natifs BRIK8 (int8) et BRIK4 (int4) : déquantification fusionnée dans le matmul GPU (poids gardés quantifiés en VRAM), petit téléchargement ET inférence rapide.',
          },
          {
            en: 'Single self-contained .brik file (header + manifest + 16-byte-aligned data) replacing .brik.zip: one file to host/load.',
            fr: 'Fichier unique .brik auto-contenu (en-tête + manifeste + données alignées 16 octets) à la place du .brik.zip : un seul fichier à héberger/charger.',
          },
          {
            en: 'HTTP Range streaming: only the header (manifest) is fetched first, then each tensor on demand, cached (Cache API) → instant, offline reloads.',
            fr: 'Chargement par streaming HTTP Range : seul l’en-tête (manifeste) est récupéré d’abord, puis chaque tenseur à la demande, mis en cache (Cache API) → re-chargements instantanés et hors-ligne.',
          },
          {
            en: 'Embeddings stored in int8 (often the largest tensor) → markedly smaller download and VRAM, with near-identical quality.',
            fr: 'Embeddings stockés en int8 (souvent le plus gros tenseur) → téléchargement et VRAM nettement réduits, qualité quasi inchangée.',
          },
        ],
      },
      {
        title: { en: 'Longer context: q8 KV cache', fr: 'Contexte plus long: cache KV q8' },
        items: [
          {
            en: 'Optional int8 attention (K/V) cache: ~4× less cache VRAM → up to ~4× more context at equal VRAM, near-f16 quality.',
            fr: 'Cache attention (K/V) optionnel en int8 : ÷~4 la VRAM du cache → jusqu’à ~4× plus de contexte à VRAM égale, qualité quasi-f16.',
          },
          {
            en: '“KV f32 / KV q8” toggle in the precision setting (dequantization fused into attention, with no f32 expansion).',
            fr: 'Bascule « KV f32 / KV q8 » dans le réglage de précision (déquant fusionnée dans l’attention, sans expansion f32).',
          },
        ],
      },
      {
        title: { en: 'New architectures', fr: 'Nouvelles architectures' },
        items: [
          {
            en: 'Gemma 2 supported by the optimized kernels: attention + logit softcapping, GELU activation, dual “sandwich” norms, (1+w) RMSNorm, embedding scaling, head_dim ≠ d/heads.',
            fr: 'Support de Gemma 2 par les kernels optimisés : softcap d’attention + des logits, activation GELU, doubles normes « sandwich », RMSNorm (1+w), scaling des embeddings, head_dim ≠ d/têtes.',
          },
          {
            en: 'Kernels made parameterizable (attention scale, activation, norms): a reusable foundation for other model families.',
            fr: 'Kernels rendus paramétrables (scale d’attention, activation, normes) : fondation réutilisable pour d’autres familles.',
          },
        ],
      },
      {
        title: { en: 'Loading & caching', fr: 'Chargement & cache' },
        items: [
          {
            en: 'Automatic GGUF → BRIK conversion at load time (optional): done once, then the converted .brik is cached (IndexedDB) for instant opens.',
            fr: 'Conversion automatique GGUF → BRIK au chargement (optionnelle) : faite une seule fois, puis le .brik converti est mis en cache (IndexedDB) pour des ouvertures instantanées.',
          },
          {
            en: 'Dedicated conversion page with converted-model cache management (list / delete).',
            fr: 'Page de conversion dédiée avec gestion du cache des modèles convertis (lister / supprimer).',
          },
          {
            en: 'Weight precision clarified: GGUF in f16/f32, BRIK8/BRIK4 tiers reserved for BRIK models.',
            fr: 'Précision des poids clarifiée : GGUF en f16/f32, tiers BRIK8/BRIK4 réservés aux modèles BRIK.',
          },
        ],
      },
      {
        title: { en: 'Robustness & fixes', fr: 'Robustesse & correctifs' },
        items: [
          {
            en: 'Fixed a GPU dispatch overflow on long prompts (> ~860 tokens) that produced incoherent output: now spread across a 2D grid.',
            fr: 'Correction d’un débordement de dispatch GPU sur les longs prompts (> ~860 tokens) qui produisait une sortie incohérente : désormais réparti sur une grille 2D.',
          },
          {
            en: 'Token counter + context warning in the composer.',
            fr: 'Compteur de tokens + avertissement de contexte dans le composer.',
          },
          {
            en: 'Large pastes collapse to a “snippet” in the input field (the full text is still sent to the model).',
            fr: 'Gros collage replié en « extrait » dans le champ de saisie (le texte complet reste envoyé au modèle).',
          },
          {
            en: 'UI fixes: no more lingering focus ring on click, message bubbles no longer break short words.',
            fr: 'Correctifs d’interface : plus d’anneau de focus résiduel au clic, bulles de message qui ne coupent plus les mots courts.',
          },
        ],
      },
    ],
  },
  {
    date: { en: 'June 23, 2026', fr: '23 juin 2026' },
    tagline: {
      en: 'First release: an LLM inference engine written from scratch, 100% in the browser.',
      fr: "Première version : un moteur d'inférence LLM écrit de zéro, 100 % dans le navigateur.",
    },
    groups: [
      {
        title: { en: 'Custom WebGPU engine', fr: 'Moteur WebGPU custom' },
        items: [
          {
            en: 'Hand-written WGSL compute kernels: vectorized matmul (128-bit vec4), RMSNorm, RoPE, causal GQA attention with KV cache, SwiGLU.',
            fr: "Kernels de calcul WGSL maison : matmul vectorisé (vec4 128-bit), RMSNorm, RoPE, attention causale GQA avec cache KV, SwiGLU.",
          },
          {
            en: 'GGUF parsing directly in JavaScript and weight dequantization on the GPU.',
            fr: "Parsing GGUF directement en JavaScript et déquantification des poids sur le GPU.",
          },
          {
            en: 'GPU-resident decode path: a token’s entire forward pass chained into a single GPU submission.',
            fr: "Chemin de décodage « GPU-resident » : tout le passage avant d'un token enchaîné en une seule soumission GPU.",
          },
          {
            en: 'Kernel self-validation at load time (selfValidate): the model only loads if the math checks out.',
            fr: "Auto-validation des kernels au chargement (selfValidate) : le modèle ne se charge que si les calculs sont corrects.",
          },
        ],
      },
      {
        title: { en: 'Performance', fr: 'Performances' },
        items: [
          {
            en: 'Logit projection cached on the GPU instead of being recomputed for every token.',
            fr: "Projection des logits mise en cache sur le GPU au lieu d'être recalculée à chaque token.",
          },
          {
            en: 'Next-token argmax computed on the GPU (a single integer read back per token instead of ~152k logits).',
            fr: "Argmax du token suivant calculé sur le GPU (un seul entier relu par token au lieu de ~152k logits).",
          },
          {
            en: 'Buffer pool reused across tokens. Overall result: ~2.5× faster decoding.',
            fr: "Pool de buffers réutilisés entre les tokens. Résultat global : décodage ~2,5× plus rapide.",
          },
        ],
      },
      {
        title: { en: 'Weight precision (switchable)', fr: 'Précision des poids (commutable)' },
        items: [
          {
            en: 'f32: full precision (quality reference).',
            fr: "f32 : pleine précision (référence qualité).",
          },
          {
            en: 'f16. Half precision: ~1.25× faster, half the VRAM (GPU-dependent).',
            fr: "f16. Demi-précision : ~1,25× plus rapide, ½ de la VRAM (selon le GPU).",
          },
          {
            en: 'int4 (BRIK “q4web” format): on-the-fly dequantization, ¼ of the VRAM → lets you load larger models in the browser.',
            fr: "int4 (format BRIK « q4web ») : déquantification à la volée, ¼ de la VRAM → permet de charger des modèles plus gros dans le navigateur.",
          },
        ],
      },
      {
        title: { en: 'Models & quantizations', fr: 'Modèles & quantifications' },
        items: [
          {
            en: 'Models: Qwen 2.5 (0.5B, Coder 1.5B), Llama 3.2 1B, DeepSeek-R1 Distill Qwen 1.5B (<think> reasoning).',
            fr: "Modèles : Qwen 2.5 (0.5B, Coder 1.5B), Llama 3.2 1B, DeepSeek-R1 Distill Qwen 1.5B (raisonnement <think>).",
          },
          {
            en: 'GGUF quantizations supported: Q4_0, Q4_K, Q5_0, Q5_K, Q6_K, Q8_0, F16, F32.',
            fr: "Quantifications GGUF lues : Q4_0, Q4_K, Q5_0, Q5_K, Q6_K, Q8_0, F16, F32.",
          },
          {
            en: 'Import any compatible GGUF (local file or Hugging Face URL).',
            fr: "Import de n'importe quel GGUF compatible (fichier local ou URL Hugging Face).",
          },
        ],
      },
      {
        title: { en: 'Interface', fr: 'Interface' },
        items: [
          {
            en: 'Chat with Markdown rendering (bold, italics, lists, headings) plus syntax highlighting and copy on code blocks.',
            fr: "Chat avec rendu Markdown (gras, italique, listes, titres) et coloration + copie des blocs de code.",
          },
          {
            en: 'Persistent conversation history (IndexedDB), independent of the loaded model.',
            fr: "Historique des conversations persistant (IndexedDB), indépendant du modèle chargé.",
          },
          {
            en: 'Built-in benchmark comparing f32 / f16 / int4, plus a precision selector.',
            fr: "Benchmark intégré comparant f32 / f16 / int4, et sélecteur de précision.",
          },
          {
            en: 'Collapsible sidebar, mobile-friendly interface.',
            fr: "Panneau latéral repliable, interface adaptée mobile.",
          },
        ],
      },
      {
        title: { en: 'Privacy', fr: 'Confidentialité' },
        items: [
          {
            en: 'No data ever sent to a server: the model and all computation run entirely on your GPU, offline once the model is downloaded.',
            fr: "Aucune donnée envoyée à un serveur : modèle et calculs s'exécutent entièrement sur votre GPU, hors-ligne après le téléchargement du modèle.",
          },
        ],
      },
    ],
  },
];

// L'ancre d'une version vient de sa date ANGLAISE (« August 18, 2026 » → « august-18-2026 ») :
// stable d'une locale à l'autre — un lien partagé depuis la page française doit ouvrir la bonne
// section en anglais — et stable dans le temps, puisqu'une date publiée ne change plus.
const slugDate = (en: string) => en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function ChangelogClient() {
  const t = useT();
  // Resolve a bilingual data string for the current locale (same semantics as t(en, fr)).
  const tr = (s: L) => t(s.en, s.fr);
  // Le sommaire du latéral : une entrée par version, libellée dans la langue courante.
  const toc = RELEASES.map((r) => ({ id: slugDate(r.date.en), label: tr(r.date) }));

  return (
    <DocsShell toc={toc}>
      <h1
        style={{
          fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 800, margin: '20px 0 8px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
        }}
      >
        Brimkern · Changelog
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 0 36px' }}>
        {t('WebGPU-accelerated LLM inference, 100% in your browser.', 'Inférence LLM accélérée par WebGPU, 100 % dans votre navigateur.')}
      </p>

      {RELEASES.map((r, i) => (
        <section key={i} id={slugDate(r.date.en)} style={{ marginBottom: 40, scrollMarginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className="status-badge gpu" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{tr(r.date)}</span>
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, margin: '0 0 20px' }}>{tr(r.tagline)}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {r.groups.map((g) => (
              <div key={g.title.fr} className="card" style={{ padding: 18 }}>
                <h2
                  className="section-title"
                  style={{ fontSize: 12, margin: '0 0 10px', color: 'var(--accent-text)' }}
                >
                  {tr(g.title)}
                </h2>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {g.items.map((it, j) => (
                    <li key={j} style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{tr(it)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </DocsShell>
  );
}
