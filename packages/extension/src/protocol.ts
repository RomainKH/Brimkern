// Messages échangés entre le panneau (content script, sur la page Google) et le moteur (document
// offscreen, origine de l'extension). Un seul port par question : sa fermeture (onglet fermé,
// navigation) annule la génération côté moteur.

export const PORT_NAME = 'bk-answer';

/** Un résultat de la page, tel que le panneau l'a lu dans le DOM. */
export interface SerpResult {
  title: string;
  url: string;
  site: string;
  snippet: string;
}

/** Un tour de conversation dans le fil de suivi. */
export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface AskRequest {
  type: 'ask';
  query: string;
  results: SerpResult[];
  lang: 'fr' | 'en';
  /** L'utilisateur a accepté le téléchargement du modèle (premier usage seulement). */
  consent: boolean;
  /** Question de suivi dans la conversation en cours (absente pour la première réponse). */
  followUp?: string;
  /** Historique des tours précédents : réponse initiale, puis paires user/assistant de suivi. */
  history?: ChatTurn[];
}

/** Question sur la page courante (panneau latéral Chrome). */
export interface PageAskRequest {
  type: 'ask-page';
  title: string;
  url: string;
  pageText: string;
  question: string;
  lang: 'fr' | 'en';
  consent: boolean;
  history?: ChatTurn[];
}

export type EngineRequest = AskRequest | PageAskRequest;

export type TierPref = 'auto' | 'light' | 'standard';

export type EngineEvent =
  | { type: 'unsupported'; reason: 'no-webgpu' | 'software-gpu' }
  | { type: 'need-consent'; model: string; bytes: number }
  | { type: 'progress'; phase: string; loaded?: number; total?: number }
  | { type: 'sources'; docs: number[] }
  | { type: 'token'; text: string }
  /** `ms` : de « modèle prêt » à la fin de la réponse — le téléchargement n'est pas du calcul. */
  | { type: 'done'; text: string; ms: number }
  | { type: 'error'; message: string };

/** Content script → service worker : « assure-toi que le moteur existe ». */
export const ENSURE = 'bk:ensure';
/** Document offscreen → service worker : « personne ne m'a parlé depuis IDLE_MS, ferme-moi ». */
export const IDLE = 'bk:idle';
/** Content script → service worker : ouvrir les options de l'extension. */
export const OPEN_OPTIONS = 'bk:options';
/** Options → service worker : ouvrir le panneau latéral sur l'onglet actif. */
export const OPEN_SIDEPANEL = 'bk:sidepanel';
/** Clés chrome.storage.local. */
export const OPT_AUTO_ANSWER = 'autoAnswer';
export const OPT_TIER = 'tierPref';
export const OPT_UDM14 = 'udm14';
export const PENDING_PAGE_SELECTION = 'pendingSelection';
// Le moteur garde ~300 Mo de poids en mémoire GPU tant que le document vit. Après dix minutes sans
// question, on le ferme : les poids restent dans le cache disque et reviennent en quelques secondes.
export const IDLE_MS = 10 * 60 * 1000;
