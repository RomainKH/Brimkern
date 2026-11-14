// Lecture de la page de résultats Google — ce que le modèle reçoit comme « fiches ».
//
// Google change son DOM souvent et ses classes sont générées : on s'appuie d'abord sur ce qui porte
// du SENS (un titre <h3> dans un lien externe, le conteneur #rso), et les classes connues
// (.VwiC3b pour l'extrait) ne servent que d'accélérateur avec un repli sur le texte du bloc.
// Testé sur scripts/e2e/fixtures/google-serp-fr.html (structure de Google, textes synthétiques).

import type { SerpResult } from './protocol';

const SNIPPET_MAX = 400;

/** La recherche de la page, ou null si ce n'est pas une page de résultats web. */
export function searchQuery(loc: { pathname: string; search: string }): string | null {
  if (loc.pathname !== '/search') return null;
  const p = new URLSearchParams(loc.search);
  const q = p.get('q')?.trim();
  if (!q) return null;
  // Onglets Images, Actualités, Vidéos, Mode IA… : pas de panneau. `udm=14` est le filtre « Web »
  // que la règle de l'extension ajoute ; son absence (règle désactivée) reste une page web.
  const udm = p.get('udm');
  if (p.has('tbm') || (udm !== null && udm !== '14')) return null;
  return q;
}

// Google enveloppe parfois les liens (`/url?q=<cible>`, version sans JS ou clic suivi) : la source
// est la cible, pas l'enveloppe.
function unwrap(href: string): string {
  try {
    const u = new URL(href);
    if (/(^|\.)google\.[a-z.]+$/.test(u.hostname) && u.pathname === '/url') {
      return u.searchParams.get('q') || u.searchParams.get('url') || href;
    }
  } catch { /* href invalide : rendu tel quel, isExternal l'écartera */ }
  return href;
}

function isExternal(href: string, pageHost: string): boolean {
  try {
    const u = new URL(href);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    // Liens internes de Google (autres recherches, Maps, cache…) : ce ne sont pas des sources.
    return u.hostname !== pageHost && !/(^|\.)google\.[a-z.]+$/.test(u.hostname);
  } catch {
    return false;
  }
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * Les résultats organiques de la page, dans l'ordre d'affichage. Un résultat = un <h3> dans un lien
 * externe ; son bloc est le plus grand ancêtre qui ne contient AUCUN autre résultat.
 */
export function extractResults(doc: Document, max = 8): SerpResult[] {
  const root = doc.querySelector('#rso') || doc.querySelector('#search') || doc.querySelector('#center_col');
  if (!root) return [];
  const host = doc.location?.hostname || '';
  const links: { a: HTMLAnchorElement; h3: HTMLElement; url: string }[] = [];
  const seen = new Set<string>();
  for (const h3 of Array.from(root.querySelectorAll('h3'))) {
    const a = h3.closest('a[href]') as HTMLAnchorElement | null;
    const url = a ? unwrap(a.href) : '';
    if (!a || !isExternal(url, host) || seen.has(url)) continue;
    seen.add(url);
    links.push({ a, h3, url });
  }
  const out: SerpResult[] = [];
  for (const { a, h3, url } of links) {
    let block: Element = a;
    while (block.parentElement && block.parentElement !== root
      && links.filter((l) => block.parentElement!.contains(l.a)).length === 1) {
      block = block.parentElement;
    }
    const title = clean(h3.textContent || '');
    const snippet = clean(
      (block.querySelector('.VwiC3b, [data-sncf]') as HTMLElement | null)?.innerText
      || textWithout(block, [a, ...Array.from(block.querySelectorAll('cite'))]),
    ).slice(0, SNIPPET_MAX);
    if (!title || !snippet) continue;
    const site = new URL(url).hostname.replace(/^www\./, '');
    out.push({ title, url, site, snippet });
    if (out.length >= max) break;
  }
  return out;
}

// Texte du bloc moins le lien-titre, l'URL affichée et le code embarqué : ce qui reste est
// l'extrait. On travaille sur une COPIE (la page de Google n'est pas modifiée) ; le marquage
// temporaire sert à retrouver dans la copie les nœuds à retirer.
function textWithout(block: Element, skip: Element[]): string {
  for (const el of skip) el.setAttribute('data-bk-skip', '');
  const copy = block.cloneNode(true) as Element;
  for (const el of skip) el.removeAttribute('data-bk-skip');
  copy.querySelectorAll('[data-bk-skip], script, style').forEach((el) => el.remove());
  // Les blocs collés par textContent (« titreExtrait ») sont séparés à la main.
  copy.querySelectorAll('div, span, br').forEach((el) => el.after(' '));
  return copy.textContent ?? '';
}
