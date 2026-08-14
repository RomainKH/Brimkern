// Adresse canonique du site — UNE seule source de vérité.
//
// Elle était recopiée dans 19 endroits (metadataBase, canonical, openGraph, robots.txt, sitemap,
// snippet SDK de /local-ai, cartes de modèle et entrées de registre Hugging Face…). Le passage de
// `brimkern.romainkhanoyan.fr` à `brimkern.com` (domaine acheté le 2026-08-13) a donc demandé une
// chasse manuelle : d'où cette constante, pour que le prochain changement soit une ligne.
//
// ⚠️ Les fichiers de `hf/` (entrées des registres huggingface.js, carte de modèle) sont
// VOLONTAIREMENT autonomes : ils sont destinés à être copiés dans un dépôt tiers et ne peuvent pas
// importer d'ici. Ils portent donc l'URL en dur, et ce commentaire est leur rappel.
export const SITE_URL = 'https://brimkern.com';

// Ancienne adresse, gardée pour mémoire : une redirection 301 doit rester en place côté hébergeur
// (des liens externes pointent dessus — dépôts Hugging Face, posts, cartes de modèle déjà publiées).
export const LEGACY_SITE_URL = 'https://brimkern.romainkhanoyan.fr';

// URL du SDK embarquable, telle qu'on la donne à copier dans la doc et les snippets.
export const SDK_URL = `${SITE_URL}/sdk.js`;

// Deeplink « ouvrir ce modèle » (la surface consommée par le menu « Use this model » du Hub).
// Il vise /chat depuis que la racine sert la landing (2026-08-13) : un lien de modèle doit tomber
// DANS l'application. Les liens déjà publiés vers `/?model=…` restent valides — la landing détecte
// les paramètres de deeplink et transmet la query à /chat.
export function modelDeeplink(repoId: string, filepath?: string): string {
  return `${SITE_URL}/chat?model=${repoId}${filepath ? `&file=${encodeURIComponent(filepath)}` : ''}`;
}
