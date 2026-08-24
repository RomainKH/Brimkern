// Outils du SDK — le pattern MESURÉ de l'app (src/lib/localTools.ts, docs/mcp-feasibility.md) :
// sous ~3B, le tool-calling émis par le modèle est halluciné, donc AUCUNE décision n'est demandée
// au modèle. On détecte côté CPU, on exécute côté CPU (les outils custom sont des fonctions de
// l'intégrateur, elles tournent dans SA page), et on injecte le RÉSULTAT dans le tour courant.
// Le modèle ne voit jamais une liste d'outils à appeler : il voit des faits déjà établis — la seule
// forme qu'un 230M restitue fidèlement (même raison que les fiches de connaissance, cf. knowledge.ts).
//
// Deux outils intégrés ('calc', 'date') + les outils de l'intégrateur ({ name, match, run }).
// Tout est opt-in : sans `tools` déclaré, pas un caractère de prompt ne change — les bancs
// sdk-rag.mjs (6/6) et sdk-dialogue.mjs (33/33) mesurent le comportement SANS outils.

import { detectCalcs, formatCalc, currentDateLine } from '../lib/localTools';

/**
 * Un outil de l'intégrateur : `match` décide s'il concerne CE message (regex ou prédicat),
 * `run` produit le résultat — une chaîne courte et factuelle, comme une fiche. Il s'exécute dans
 * la page de l'hôte : il peut lire un panier, un stock, l'état d'une commande… rien ne transite
 * par le modèle ni par un réseau que l'intégrateur n'a pas choisi lui-même.
 */
export interface ToolSpec {
  name: string;
  /** Documentation pour l'intégrateur ; jamais injectée (un 230M ne lit pas de catalogue d'outils). */
  description?: string;
  match: RegExp | ((question: string) => boolean);
  run: (question: string) => string | number | Promise<string | number>;
}

/** Ce que `tools` accepte : les intégrés par leur nom, ou un ToolSpec complet. */
export type ToolInput = 'calc' | 'date' | ToolSpec;

/** Un résultat d'outil pour ce tour — remis à l'événement `tool` et injecté dans le prompt. */
export interface ToolNote { name: string; result: string }

// Un outil qui traîne ne doit pas suspendre le tour pour toujours : au-delà, on continue sans lui.
const TOOL_TIMEOUT_MS = 10_000;
// Et un outil bavard ne doit pas noyer la fenêtre courte du 230M : un résultat est un fait, pas un rapport.
const RESULT_MAX_CHARS = 600;

/** Trie ce que l'intégrateur a passé ; les entrées invalides sont écartées avec un avertissement. */
export function normalizeTools(input: unknown): ToolInput[] {
  if (!Array.isArray(input)) return [];
  const out: ToolInput[] = [];
  for (const t of input) {
    if (t === 'calc' || t === 'date') { out.push(t); continue; }
    const spec = t as ToolSpec;
    if (spec && typeof spec === 'object' && typeof spec.name === 'string' && spec.name.trim()
      && typeof spec.run === 'function'
      && (spec.match instanceof RegExp || typeof spec.match === 'function')) {
      out.push(spec);
      continue;
    }
    console.warn('[brimkern] outil ignoré (attendu : \'calc\', \'date\', ou { name, match, run }) :', t);
  }
  return out;
}

/** L'outil 'date' pose une ligne dans le PROMPT SYSTÈME : stable sur la journée, le préfixe KV survit. */
export const hasDateTool = (tools: ToolInput[]): boolean => tools.includes('date');

export function dateSystemLine(fr: boolean): string {
  return fr
    ? `\n(Date du jour : ${currentDateLine('fr')}.)`
    : `\n(Today's date: ${currentDateLine('en')}.)`;
}

// … mais la ligne système NE SUFFIT PAS sur une question directe : mesuré (sdk-tools.mjs,
// 2026-08-24), « What year is it? » déclenche le refus APPRIS du modèle (« my knowledge is based on
// data up until July 2024 ») sans qu'il lise la ligne posée deux phrases plus haut. Sur une question
// de date, on injecte donc AUSSI une note de tour — la forme crochet que le même banc valide sur la
// calculatrice. Les deux se complètent : la ligne système pour l'ambiant, la note pour le direct.
const DATE_QUESTION = /\b(?:today|tonight|what\s+day|which\s+day|what\s+date|what\s+year|what\s+month|current\s+(?:date|day|year)|aujourd(?:'|’)hui|quel\s+jour|quelle\s+date|quelle\s+ann[ée]e|quel\s+mois|on\s+est\s+quel)\b/i;

const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
  new Promise((res, rej) => {
    const to = setTimeout(() => rej(new Error(`outil sans réponse après ${ms} ms`)), ms);
    p.then((v) => { clearTimeout(to); res(v); }, (e) => { clearTimeout(to); rej(e); });
  });

/**
 * Exécute les outils concernés par CE message. Un outil qui lève, qui traîne ou qui rend du vide
 * est simplement absent du tour — le code de l'hôte n'est pas notre code, une panne d'outil ne
 * casse pas le widget (même contrat que les écouteurs d'événements, cf. createEmitter).
 */
export async function runTools(tools: ToolInput[], question: string, fr: boolean): Promise<ToolNote[]> {
  const notes: ToolNote[] = [];
  for (const t of tools) {
    if (t === 'date') {
      // La ligne système existe déjà (cf. dateSystemLine) ; la note ne s'ajoute que sur une
      // question de date explicite — sinon on paierait du prefill à chaque tour pour rien.
      if (DATE_QUESTION.test(question)) notes.push({ name: 'date', result: currentDateLine(fr ? 'fr' : 'en') });
      continue;
    }
    if (t === 'calc') {
      const calcs = detectCalcs(question);
      if (calcs.length) {
        notes.push({
          name: fr ? 'calculatrice' : 'calculator',
          result: calcs.map((c) => `${c.expr} = ${formatCalc(c.value)}`).join(' ; '),
        });
      }
      continue;
    }
    try {
      const concerne = t.match instanceof RegExp ? t.match.test(question) : t.match(question);
      if (!concerne) continue;
      const brut = await withTimeout(Promise.resolve(t.run(question)), TOOL_TIMEOUT_MS);
      const result = String(brut ?? '').replace(/\s+/g, ' ').trim().slice(0, RESULT_MAX_CHARS);
      if (result) notes.push({ name: t.name.replace(/\s+/g, ' ').trim().slice(0, 40), result });
    } catch (e) {
      console.error(`[brimkern] outil « ${t.name} » a échoué :`, e);
    }
  }
  return notes;
}

/**
 * Le bloc injecté dans le tour utilisateur — même forme que la calculatrice de l'app
 * (ChatApp.tsx), validée en prod sur le même modèle par défaut : des crochets, la consigne
 * « exacts, tels quels », les faits.
 */
export function formatToolBlock(notes: ToolNote[], fr: boolean): string {
  if (!notes.length) return '';
  // La ponctuation suit la langue : « nom : fait » en français, "name: fact" en anglais.
  const faits = notes.map((n) => (fr ? `${n.name} : ${n.result}` : `${n.name}: ${n.result}`)).join(' · ');
  return fr
    ? `[Résultats d’outils locaux. Exacts, utilise-les tels quels : ${faits}]`
    : `[Local tool results. Exact values, use them as-is: ${faits}]`;
}
