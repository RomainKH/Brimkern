// La configuration d'une réponse — UN seul endroit, partagé par le moteur de l'extension
// (offscreen.ts) et par le banc qualité (scripts/e2e/serp-quality.mjs) : le banc doit juger la
// réponse que l'utilisateur recevra, pas une variante.
//
// Deux formats, comparés au banc sur les mêmes 24 pages capturées (ROADMAP § 30) :
// - 'sdk' : les résultats passent par `knowledge` du SDK. Ce mode est taillé pour le WIDGET de
//   boutique : il épingle des exemples de démonstration (un guide des pointures EU/US) et une
//   consigne de refus. Mesuré le 2026-11-14 : « Canberra, 24,5 cm (US 7,0) » (Qwen3 0.6B),
//   Llama 3.2 1B qui récite « N'invente jamais pour combler » (29 refus sur 48).
// - 'web' : un prompt propre à la recherche — les N premiers résultats dans l'ordre de la page,
//   numérotés comme la liste de sources affichée, sans exemple épinglé.

import type { SessionConfig } from '../../../src/sdk/index';
import type { SerpResult } from './protocol';

export type AnswerFormat = 'sdk' | 'web';
// 'sdk' gardé après le banc du 2026-11-14 (24 vraies pages × 2 passes, réponses lues une à une) :
// avec le modèle livré (Qwen3 0.6B Shop), 31/48 en 'sdk' contre 30/48 en 'web' — écart dans le
// bruit —, et le palier léger (LFM2.5 230M) S'EFFONDRE en 'web' (28,5 → 16,5 : il recopie le
// titre des résultats au lieu de répondre). 'web' sert les modèles généralistes (Llama 3.2 1B :
// 13,5 → 29) : à reprendre si l'un d'eux devient le modèle livré.
export const ANSWER_FORMAT: AnswerFormat = 'sdk';

// Ce que le modèle Shop garde de son métier, et une balise de contrôle qui fuit parfois : mesuré
// au même banc (3 fois sur 48 « Puis-je vous aider pour autre chose ? », 1 fois « /no_think »).
// Retiré de façon déterministe : un petit modèle ne s'en déshabitue pas par consigne.
const FORMULES_BOUTIQUE = [
  /\s*(?:Puis-je|Je peux) vous aider (?:pour|avec|sur) (?:autre chose|une autre question)[^.!?]*[.!?]?/gi,
  /\s*Je ne peux pas vous aider pour autre chose[^.!?]*[.!?]?/gi,
  /\s*(?:Can|May) I help (?:you )?with anything else[^.!?]*[.!?]?/gi,
  /\s*(?:Is there )?anything else I can help (?:you )?with[^.!?]*[.!?]?/gi,
  /\s*\/no_think\b/g,
];

/** Le texte de la réponse sans les formules de boutique ni les balises qui fuient. */
export function cleanAnswer(text: string): string {
  let t = text;
  for (const motif of FORMULES_BOUTIQUE) t = t.replace(motif, '');
  return t.trim();
}

// Les N premiers résultats de la page : ce sont ceux que Google juge les plus pertinents, et le
// numéro [n] cité par le modèle désigne alors la n-ième source de la liste affichée.
const WEB_RESULTS = 5;
const WEB_SNIPPET = 300;

const SYSTEM_SDK = {
  en: 'You answer web searches using the search result snippets provided. Reply in 2 to 4 short sentences, in the language of the search. Cite the notes you use as [1], [2].',
  fr: 'Tu réponds à des recherches web à partir des extraits de résultats fournis. Réponds en 2 à 4 phrases courtes, dans la langue de la recherche. Cite les fiches utilisées sous la forme [1], [2].',
};
const SYSTEM_WEB = {
  en: 'You answer a web search using the numbered search results given with it. Use only facts stated in those results. Answer in 1 to 3 short sentences, in English. Put the number of the result you rely on in brackets, like [2]. If the results do not answer the search, say so in one sentence.',
  fr: 'Tu réponds à une recherche web à l’aide des résultats numérotés fournis avec elle. N’utilise que les faits énoncés dans ces résultats. Réponds en 1 à 3 phrases courtes, en français. Indique entre crochets le numéro du résultat utilisé, comme [2]. Si les résultats ne répondent pas à la recherche, dis-le en une phrase.',
};

export interface Answer {
  config: SessionConfig;
  /** Le message envoyé au modèle. */
  text: string;
  /** Les résultats lus, dans l'ordre des numéros — null : c'est le SDK qui les choisit (onSources). */
  docs: number[] | null;
}

export function buildAnswer(model: string, query: string, results: SerpResult[], lang: 'fr' | 'en', format: AnswerFormat = ANSWER_FORMAT): Answer {
  const base = { model, lang, maxTokens: 220, worker: false } as const;
  if (format === 'sdk') {
    return {
      config: {
        ...base,
        system: SYSTEM_SDK[lang],
        knowledge: results.map((r) => ({ title: r.site ? `${r.title} — ${r.site}` : r.title, text: r.snippet })),
        knowledgeBudget: 1600,
      },
      text: query,
      docs: null,
    };
  }
  const lus = results.slice(0, WEB_RESULTS);
  const bloc = lus.map((r, i) => `[${i + 1}] ${r.site ? `${r.title} — ${r.site}` : r.title}\n${r.snippet.slice(0, WEB_SNIPPET)}`).join('\n\n');
  const [recherche, resultats] = lang === 'fr' ? ['Recherche :', 'Résultats :'] : ['Search:', 'Results:'];
  return {
    // 0,25 : la température que la session prend d'elle-même en mode `knowledge` — seul le FORMAT
    // change entre les deux bras du banc.
    config: { ...base, system: SYSTEM_WEB[lang], temperature: 0.25 },
    text: `${recherche} ${query}\n\n${resultats}\n${bloc}`,
    docs: lus.map((_, i) => i),
  };
}
