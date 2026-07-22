"use client";

// Recherche web v1 (option « Web & outils » des Réglages) — le premier outil externe de Brimkern.
// Source : l'API Wikipédia (CORS officiel via origin=*, zéro clé, fiable) — locale d'abord, anglais
// en repli. SEULE la requête de l'utilisateur est envoyée ; jamais la conversation. Les extraits
// sont injectés dans le tour courant du prompt (RAG minimal : pas de tool-calling, donc fiable même
// sur un 0.5B). Voir docs/mcp-feasibility.md — la couche d'outils locale et la connexion à un
// serveur MCP personnel viendront ensuite.

export interface WebResult { title: string; url: string; extract: string }

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
  try {
    const first = await wikiSearch(locale, query, max);
    if (first.length) return first;
    return locale === 'en' ? [] : await wikiSearch('en', query, max);
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
