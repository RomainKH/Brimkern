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

// Mémo (pas du code) : l'ancienne adresse `brimkern.romainkhanoyan.fr` doit GARDER sa redirection
// 301 côté hébergeur — des liens externes pointent dessus (dépôts Hugging Face, posts, cartes de
// modèle déjà publiées). Vérifiée en place le 2026-08-13.
//
// Le format du deeplink « ouvrir ce modèle » est `/chat?model=<auteur/dépôt>[&file=<fichier>]`
// (les liens publiés vers `/?model=…` restent valides : la landing transmet la query à /chat).
// Il n'a PLUS de constructeur ici : le seul producteur vivant est hf/local-apps-entry.ts —
// volontairement autonome, cf. ci-dessus — et la doc affiche des exemples littéraux. L'ancien
// helper `modelDeeplink` et la constante `LEGACY_SITE_URL` ont été retirés le 2026-08-16 (plus
// aucun appelant depuis la refonte landing du 13/08).

// URL du SDK embarquable, telle qu'on la donne à copier dans la doc et les snippets.
export const SDK_URL = `${SITE_URL}/sdk.js`;
