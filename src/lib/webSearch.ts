"use client";

// Recherche web v1 (option « Web & outils » des Réglages) — le premier outil externe de Brimkern.
// Source : l'API Wikipédia (CORS officiel via origin=*, zéro clé, fiable) — locale d'abord, anglais
// en repli. SEULE la requête de l'utilisateur est envoyée ; jamais la conversation. Les extraits
// sont injectés dans le tour courant du prompt (RAG minimal : pas de tool-calling, donc fiable même
// sur un 0.5B). Voir docs/mcp-feasibility.md — la couche d'outils locale et la connexion à un
// serveur MCP personnel viendront ensuite.

export interface WebResult { title: string; url: string; extract: string }

// ── Faut-il VRAIMENT chercher ? ───────────────────────────────────────────────────────────────
// L'option activée, toute phrase partait vers Wikipédia — « sinon ça va ? » incluse, qui remontait
// un article sans rapport (Mark Ruffalo), injecté dans le prompt : le petit modèle recopiait alors
// « Source : … » en boucle (retour Romain, 2026-08-13). Une salutation n'est pas une question
// factuelle : on ne cherche que si la demande ressemble à une recherche.
// Fonction PURE (testée : npm run test:websearch), sans réseau.

// Amorces de conversation et politesses : aucune ne justifie un appel réseau.
const SMALL_TALK = [
  /^(salut|bonjour|bonsoir|coucou|hey|hi|hello|yo|wesh)/i,
  /^(ça|ca|sa) va/i, /sinon (ça|ca) va/i, /^(comment vas[- ]tu|comment ça va|how are you)/i,
  /^(merci|thanks|thx|ok|okay|d'accord|super|parfait|nickel|cool|bravo)/i,
  /^(au revoir|bye|à plus|a plus|bonne (nuit|journée|soirée))/i,
  /^(qui es[- ]tu|tu es qui|who are you|présente[- ]toi|que sais[- ]tu faire|what can you do)/i,
  /^(test|coucou toi|tu m'entends|tu es là|are you there)/i,
];

// Marqueurs d'une demande de CONNAISSANCE : mot interrogatif, ou verbe de définition/date/lieu.
const FACTUAL = [
  /(qui|quoi|quand|où|ou est|pourquoi|comment|combien|quel|quelle|quels|quelles)/i,
  /(who|what|when|where|why|how|which|how many|how much)/i,
  /(c'est quoi|qu'est[- ]ce que|définition|definis|explique|parle[- ]moi de|résume|resume)/i,
  /(define|definition|explain|tell me about|summari[sz]e)/i,
  /(en \d{4}|le \d{1,2} \w+|né en|fondé|créé en|inventé|population|capitale|auteur|réalisateur)/i,
];

export interface SearchDecision { search: boolean; reason: 'small-talk' | 'too-short' | 'no-question' | 'ok' }

export function shouldSearchWeb(query: string): SearchDecision {
  const q = (query || '').trim();
  // Un lien collé, du code ou un texte long : ce n'est pas une requête de recherche.
  if (q.length < 8) return { search: false, reason: 'too-short' };
  if (SMALL_TALK.some((re) => re.test(q))) return { search: false, reason: 'small-talk' };
  const hasQuestion = q.includes('?') || FACTUAL.some((re) => re.test(q));
  // Un nom propre (majuscule en milieu de phrase) suffit aussi : « la bataille de Verdun ».
  const hasProperNoun = /\s[A-ZÀ-Ý][\wÀ-ÿ'-]{2,}/.test(q);
  if (!hasQuestion && !hasProperNoun) return { search: false, reason: 'no-question' };
  return { search: true, reason: 'ok' };
}

// Le résultat parle-t-il de ce qu'on a demandé ? L'API Wikipédia rend TOUJOURS quelque chose (elle
// classe par pertinence, sans seuil) : sur une requête sans entité, le premier article est arbitraire.
// On exige donc un mot significatif commun entre la requête et le titre/l'extrait — sinon on jette,
// plutôt que d'injecter un contexte hors sujet qu'un petit modèle prendra pour argent comptant.
const STOP_WORDS = new Set(['avec','pour','dans','les','des','une','est','sur','par','que','qui','quoi','comment','pourquoi','quand','the','and','for','with','what','who','how','why','when','about','tell','moi','parle','explique','donne','peux','plus','tout','fait','faire','sais']);

export function isRelevant(query: string, r: WebResult): boolean {
  const words = (query.toLowerCase().match(/[\p{L}\p{N}]{4,}/gu) ?? []).filter((w) => !STOP_WORDS.has(w));
  if (!words.length) return false;
  const hay = `${r.title} ${r.extract}`.toLowerCase();
  // Un seul mot porteur suffit (le titre est court), mais il doit être présent tel quel.
  return words.some((w) => hay.includes(w));
}

const TIMEOUT_MS = 6000;

async function wikiSearch(lang: string, query: string, max: number): Promise<WebResult[]> {
  const base = `https://${lang}.wikipedia.org/w/api.php`;
  const common = 'format=json&origin=*';
  const sr = await fetch(
    `${base}?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${max}&${common}`,
    { signal: AbortSignal.timeout(TIMEOUT_MS) },
  ).then((r) => r.json());
  const hits: { pageid: number; title: string }[] = sr?.query?.search ?? [];
  if (!hits.length) return [];

  // Intros en texte brut des pages trouvées (une seule requête pour toutes).
  const ids = hits.map((h) => h.pageid).join('|');
  const ex = await fetch(
    `${base}?action=query&pageids=${ids}&prop=extracts&explaintext=1&exintro=1&exlimit=${hits.length}&exchars=700&${common}`,
    { signal: AbortSignal.timeout(TIMEOUT_MS) },
  ).then((r) => r.json());
  const pages = ex?.query?.pages ?? {};
  return hits
    .map((h) => ({
      title: h.title,
      url: `https://${lang}.wikipedia.org/?curid=${h.pageid}`,
      extract: (pages[h.pageid]?.extract || '').trim(),
    }))
    .filter((r) => r.extract.length > 40);
}

// Top extraits pour une question. Ne JETTE jamais (une recherche cassée ne doit pas bloquer le
// chat) : erreur / timeout / zéro résultat → tableau vide, le modèle répond sans contexte web.
export async function searchWeb(query: string, locale: 'fr' | 'en' = 'fr', max = 3): Promise<WebResult[]> {
  const decision = shouldSearchWeb(query);
  if (!decision.search) {
    console.info(`[web] pas de recherche (${decision.reason}) — « ${query.slice(0, 40)} » ne demande pas de connaissance externe`);
    return [];
  }
  try {
    const hits = await wikiSearch(locale, query, max);
    const first = hits.filter((r) => isRelevant(query, r));
    if (first.length) return first;
    if (hits.length) console.info('[web] résultats écartés : aucun ne recoupe la question (Wikipédia répond toujours quelque chose)');
    if (locale === 'en') return [];
    const en = await wikiSearch('en', query, max);
    return en.filter((r) => isRelevant(query, r));
  } catch (e) {
    console.warn('[web] recherche échouée (le chat continue sans contexte web)', e);
    return [];
  }
}

// Lecture d'un lien collé dans le chat (option « Lecture des liens », OFF par défaut) : le lecteur
// r.jina.ai (CORS ouvert, sans clé) rend la page en texte/markdown — les sites arbitraires sont
// inaccessibles en direct depuis un onglet (CORS). ⚠️ transparence : l'URL est donc envoyée à
// jina.ai — c'est écrit sur le toggle. Tronqué (~2 500 caractères) pour rester digeste pour un
// petit modèle. Ne jette jamais.
export async function readUrl(url: string): Promise<{ url: string; content: string } | null> {
  try {
    const r = await fetch(`https://r.jina.ai/${url}`, { signal: AbortSignal.timeout(8000), headers: { Accept: 'text/plain' } });
    if (!r.ok) return null;
    const content = (await r.text()).trim().slice(0, 2500);
    return content.length > 40 ? { url, content } : null;
  } catch (e) {
    console.warn('[web] lecture du lien échouée (le chat continue sans)', e);
    return null;
  }
}
