// Lecture de la page de résultats Google — ce que le modèle reçoit comme « fiches ».
//
// Google change son DOM souvent et ses classes sont générées : on s'appuie d'abord sur ce qui porte
// du SENS (un titre <h3> dans un lien externe, le conteneur #rso), et les classes connues
// (.VwiC3b pour l'extrait) ne servent que d'accélérateur avec un repli sur le texte du bloc.
// Testé sur scripts/e2e/fixtures/google-serp-fr.html (structure de Google, textes synthétiques) ET
// sur le vrai Google du 2026-11-14 (liens /goto opaques, cf. resultUrl).

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

const isGoogle = (host: string) => /(^|\.)google\.[a-z.]+$/.test(host);

/**
 * L'URL à citer pour un lien-titre, ou null si ce n'est pas un résultat.
 * - lien externe : tel quel ;
 * - `/url?q=<cible>` (version sans JS) : la cible en clair ;
 * - `/goto?url=<jeton>` et `/url?url=<jeton>` : la cible est un JETON OPAQUE (constaté sur le vrai
 *   Google le 2026-11-14 — aucun lien externe dans le DOM). On garde la redirection de Google :
 *   cliquer la source fait exactement ce que fait un clic sur le résultat ;
 * - tout autre lien Google (autres recherches, Maps…) : pas une source.
 */
function resultUrl(href: string, pageHost: string): string | null {
  let u: URL;
  try { u = new URL(href); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (u.hostname !== pageHost && !isGoogle(u.hostname)) return href;
  if (u.pathname === '/url') {
    const q = u.searchParams.get('q') || u.searchParams.get('url') || '';
    return /^https?:\/\//.test(q) ? q : href;
  }
  return u.pathname === '/goto' ? href : null;
}

// Le site d'un résultat. Derrière une redirection opaque, c'est le domaine que Google affiche dans
// <cite> (« https://www.toureiffel.paris › Accueil »). Pour une vidéo ou un forum, le <cite> porte
// « 400+ views · 6 months ago » et le NOM de la source est la ligne du lien entre le titre et le
// <cite> (« YouTube · Teen Kids News », « Quora ») : on en garde le premier segment.
function siteOf(url: string, a: HTMLElement, h3: HTMLElement, block: Element): string {
  const host = new URL(url).hostname;
  if (!isGoogle(host)) return host.replace(/^www\./, '');
  const cites = Array.from(block.querySelectorAll('cite')).map((c) => clean(c.textContent || ''));
  for (const c of cites) {
    const m = c.match(/^(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?=$|[\s/›])/i);
    if (m) return m[1].toLowerCase().replace(/^www\./, '');
  }
  // Titre comparé dans sa forme AFFICHÉE : Google tronque les longs titres (« …Tower in ... »).
  const titre = clean(h3.innerText || h3.textContent || '');
  const ligne = (a.innerText || '').split('\n').map(clean)
    .find((l) => l && l !== titre && !cites.includes(l));
  return ligne ? ligne.split('·')[0].trim().slice(0, 40) : '';
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * Les résultats organiques de la page, dans l'ordre d'affichage. Un résultat = un <h3> dans un lien
 * de résultat (cf. resultUrl) ; son bloc est le plus grand ancêtre qui ne contient AUCUN autre
 * résultat.
 */
export function extractResults(doc: Document, max = 8): SerpResult[] {
  const root = doc.querySelector('#rso') || doc.querySelector('#search') || doc.querySelector('#center_col');
  if (!root) return [];
  const host = doc.location?.hostname || '';
  const links: { a: HTMLAnchorElement; h3: HTMLElement; url: string }[] = [];
  const seen = new Set<string>();
  for (const h3 of Array.from(root.querySelectorAll('h3'))) {
    const a = h3.closest('a[href]') as HTMLAnchorElement | null;
    const url = a && resultUrl(a.href, host);
    if (!a || !url || seen.has(url)) continue;
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
    out.push({ title, url, site: siteOf(url, a, h3, block), snippet });
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
