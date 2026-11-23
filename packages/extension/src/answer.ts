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
import type { ChatTurn, SerpResult } from './protocol';

// - 'search' (2026-11-15) : le format LIVRÉ, décrit plus bas (SYSTEM_SEARCH, DEMOS).
export type AnswerFormat = 'sdk' | 'web' | 'search';
export interface AnswerOptions {
  /** Pénalité de répétition ; défaut du format 'search' : 1 (aucune), cf. SEARCH_PENALTY. */
  repeatPenalty?: number;
}
// Historique au même banc (24 vraies pages × 2 passes, réponses lues une à une, juste + ½ partielle
// sur 48), Qwen3 0.6B Shop : 'sdk' 31 (7 faux) · 'web' 30 (9 faux) · 'search' 40,5 (2 faux) ·
// 'search' avec la pénalité 1,3 du SDK 29,5 (5 faux) — c'est la pénalité qui coûtait le plus.
// Qwen3.5 2B (palier standard) en 'search' : 46, aucune réponse fausse.
export const ANSWER_FORMAT: AnswerFormat = 'search';

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

// ── Format 'search' (2026-11-15) ─────────────────────────────────────────────────────────────
// Ce qui change par rapport à 'web', et pourquoi :
// - PAS de pénalité de répétition. Celle du SDK (1,3) porte sur les 64 derniers jetons du PROMPT,
//   donc sur la recherche elle-même : le modèle est puni de reprendre les mots de la question et les
//   déforme — relevé au banc du 2026-11-14 : « boiling » → « boilig », « bouilloire » →
//   « bouillière », « oeuf » → « œufr », « hauteur » → « en Haute ». Une réponse de 1 à 3 phrases
//   plafonnée en jetons ne risque pas la boucle que la pénalité est censée empêcher.
// - Des DÉMONSTRATIONS de la vraie tâche (fait, marche à suivre, explication), fabriquées par la
//   même fonction que les vrais tours (aucune dérive possible), sur des sujets absents du banc et
//   des sites fictifs (.example) : on montre l'opération — recopier le chiffre, résumer les étapes —
//   pas une réponse. À la place des exemples de boutique du mode `knowledge`.
// - La recherche APRÈS les résultats : c'est ce que le modèle lit en dernier avant de répondre.
const SEARCH_RESULTS = 5;
const SEARCH_SNIPPET = 300;
export const SEARCH_PENALTY = 1;
export const SEARCH_TEMPERATURE = 0.2;

const SYSTEM_SEARCH = {
  en: 'You answer a web search from the numbered search results given with it. Answer the search directly in 1 to 3 sentences, in English. Copy figures, dates and names exactly as the results give them, and add none of your own. Put the number of the result you used in brackets, like [1].',
  fr: 'Tu réponds à une recherche web à partir des résultats numérotés fournis avec elle. Réponds directement à la recherche en 1 à 3 phrases, en français correct. Recopie les chiffres, les dates et les noms exactement comme les résultats les donnent, sans en ajouter. Indique entre crochets le numéro du résultat utilisé, comme [1].',
};

const FOLLOWUP_TEMPERATURE = 0.3;
const SYSTEM_FOLLOWUP = {
  en: 'You are continuing a conversation about a web search, using the numbered search results from the first turn and the previous exchanges. Answer directly and concisely in English. Cite the result number in brackets (like [1]) when relying on a snippet; if the snippets do not cover the follow-up, say so briefly or answer carefully.',
  fr: 'Tu continues une conversation à propos d’une recherche web, à partir des résultats numérotés du premier tour et des échanges précédents. Réponds de façon directe et concise en français. Indique entre crochets le numéro du résultat utilisé (comme [1]) quand tu t’appuies sur un extrait ; si les extraits ne couvrent pas la question, précise-le brièvement ou réponds avec prudence.',
};

type Demo = { q: string; results: SerpResult[]; answer: string };
const r = (title: string, site: string, snippet: string): SerpResult => ({ title, site, snippet, url: `https://${site}/` });
const DEMOS: Record<'fr' | 'en', Demo[]> = {
  fr: [
    {
      q: 'quelle est la longueur de la seine',
      results: [
        r('Seine (fleuve)', 'encyclopedie.example', 'La Seine est un fleuve français long de 777 km. Elle prend sa source sur le plateau de Langres et se jette dans la Manche entre Le Havre et Honfleur.'),
        r('La Seine à Paris', 'paris-guide.example', 'Dans Paris, le fleuve s’étire sur 13 km et il est franchi par 37 ponts.'),
      ],
      answer: 'La Seine mesure 777 km de long [1].',
    },
    {
      q: 'comment rempoter une plante',
      results: [
        r('Rempoter une plante d’intérieur', 'jardinage.example', 'Choisissez un pot 2 à 4 cm plus large que l’ancien. Déposez une couche de billes d’argile, puis du terreau. Sortez la plante, démêlez les racines, installez-la et comblez avec du terreau. Arrosez copieusement.'),
        r('Quand rempoter ?', 'plantes-maison.example', 'Le meilleur moment pour rempoter est le printemps, au début de la croissance.'),
      ],
      answer: 'Prenez un pot 2 à 4 cm plus large, mettez des billes d’argile puis du terreau, installez la plante en démêlant ses racines, comblez avec du terreau et arrosez copieusement [1]. Le meilleur moment est le printemps [2].',
    },
    {
      q: 'pourquoi la mer est salée',
      results: [
        r('Pourquoi la mer est-elle salée ?', 'sciences-junior.example', 'Le sel de la mer vient surtout des roches : la pluie dissout leurs minéraux, que les rivières transportent jusqu’à l’océan. L’eau s’évapore, mais le sel reste et s’accumule.'),
      ],
      answer: 'La pluie dissout les minéraux des roches et les rivières les emportent jusqu’à la mer [1]. L’eau s’évapore mais le sel reste, si bien qu’il s’accumule [1].',
    },
  ],
  en: [
    {
      q: 'how long is the river thames',
      results: [
        r('River Thames', 'encyclopedia.example', 'The River Thames flows through southern England, including London. At 215 miles (346 km), it is the longest river entirely in England.'),
        r('Bridges of the Thames', 'london-guide.example', 'More than 200 bridges cross the Thames, 33 of them in Greater London.'),
      ],
      answer: 'The River Thames is 215 miles (346 km) long [1].',
    },
    {
      q: 'how to repot a plant',
      results: [
        r('How to repot a houseplant', 'gardening.example', 'Pick a pot 1 to 2 inches wider than the old one. Add a layer of clay pebbles, then potting mix. Ease the plant out, loosen the roots, set it in and fill with potting mix. Water thoroughly.'),
        r('When to repot', 'houseplants.example', 'The best time to repot is spring, at the start of the growing season.'),
      ],
      answer: 'Use a pot 1 to 2 inches wider, add clay pebbles then potting mix, set the plant in with its roots loosened, fill with potting mix and water thoroughly [1]. The best time is spring [2].',
    },
    {
      q: 'why is the sea salty',
      results: [
        r('Why is the ocean salty?', 'science-kids.example', 'Most of the salt in the sea comes from rocks: rain dissolves their minerals, and rivers carry them to the ocean. The water evaporates, but the salt stays behind and builds up.'),
      ],
      answer: 'Rain dissolves minerals from rocks and rivers carry them to the sea [1]. The water evaporates but the salt stays, so it builds up over time [1].',
    },
  ],
};

/** Un tour de recherche : les résultats numérotés, puis la recherche. Sert aussi aux démonstrations. */
function searchTurn(query: string, results: SerpResult[], lang: 'fr' | 'en'): string {
  const bloc = results.map((x, i) => `[${i + 1}] ${x.site ? `${x.title} — ${x.site}` : x.title}\n${x.snippet.slice(0, SEARCH_SNIPPET)}`).join('\n\n');
  return lang === 'fr' ? `Résultats :\n${bloc}\n\nRecherche : ${query}` : `Results:\n${bloc}\n\nSearch: ${query}`;
}

export interface Answer {
  config: SessionConfig;
  /** Le message envoyé au modèle. */
  text: string;
  /** Les résultats lus, dans l'ordre des numéros — null : c'est le SDK qui les choisit (onSources). */
  docs: number[] | null;
}

export function buildAnswer(model: string, query: string, results: SerpResult[], lang: 'fr' | 'en', format: AnswerFormat = ANSWER_FORMAT, opts: AnswerOptions = {}): Answer {
  const base = { model, lang, maxTokens: 220, worker: false } as const;
  if (format === 'search') {
    const lus = results.slice(0, SEARCH_RESULTS);
    return {
      config: {
        ...base,
        system: SYSTEM_SEARCH[lang],
        examples: DEMOS[lang].map((d) => ({ user: searchTurn(d.q, d.results, lang), assistant: d.answer })),
        temperature: SEARCH_TEMPERATURE,
        repeatPenalty: opts.repeatPenalty ?? SEARCH_PENALTY,
      },
      text: searchTurn(query, lus, lang),
      docs: lus.map((_, i) => i),
    };
  }
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

/**
 * Un tour de SUIVI dans la conversation en cours. Le premier échange (les N extraits numérotés +
 * la recherche initiale → la première réponse) est épinglé dans `examples` afin de ne jamais être
 * évincé par la fenêtre d'historique, même après plusieurs questions de suivi.
 */
export function buildFollowUp(
  model: string,
  query: string,
  results: SerpResult[],
  history: ChatTurn[],
  followUp: string,
  lang: 'fr' | 'en',
): Answer {
  const lus = results.slice(0, SEARCH_RESULTS);
  const firstTurnUser = searchTurn(query, lus, lang);
  const firstAnswer = history[0]?.role === 'assistant' ? history[0].content : '';
  const rest = firstAnswer ? history.slice(1) : history;
  return {
    config: {
      model,
      lang,
      maxTokens: 260,
      worker: false,
      system: SYSTEM_FOLLOWUP[lang],
      examples: firstAnswer ? [{ user: firstTurnUser, assistant: firstAnswer }] : undefined,
      history: firstAnswer ? rest : [{ role: 'user', content: firstTurnUser }, ...rest],
      temperature: FOLLOWUP_TEMPERATURE,
      repeatPenalty: SEARCH_PENALTY,
    },
    text: followUp,
    docs: null,
  };
}
