// Le contrat de PROGRESSION des pipelines lourds (image, vidéo, vision), partagé pour deux raisons
// venues du même retour (2026-08-18) :
//
// 1. LA LANGUE. Ces libs écrivaient leurs étapes en français EN DUR (« Téléchargement du module
//    motion… »), et ces chaînes remontent telles quelles dans l'interface : un visiteur anglophone
//    lisait du français au milieu de sa page. Les libs ne connaissent pas la locale, donc elles
//    reçoivent un traducteur — même signature que le t() de l'app — dont le défaut est l'anglais.
//
// 2. LES OCTETS. Un pipeline image/vidéo télécharge de 0,7 à 1,5 Go et n'affichait qu'un libellé :
//    aucune barre, aucun temps restant, alors que le chemin LLM les a depuis toujours. Le second
//    argument porte donc les octets, que l'app branche sur le même setLoadingProgress (barre + ETA)
//    que le reste. Il reste OPTIONNEL : une étape de calcul (quantification, débruitage) n'a pas
//    d'octets à annoncer, elle n'envoie que son libellé.
export type ProgressBytes = { loaded: number; total: number };
export type OnProgress = (step: string, bytes?: ProgressBytes) => void;

// Traducteur : t(anglais, français). L'app passe le sien ; le défaut sert les appels internes et
// les bancs, où l'anglais est la langue de référence du dépôt.
export type Tr = (en: string, fr: string) => string;
export const EN_ONLY: Tr = (en) => en;
