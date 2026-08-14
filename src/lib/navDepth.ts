// Profondeur de navigation DANS l'application, pour savoir si « retour » a une destination interne.
//
// BackLink se fiait à `document.referrer` : il n'est mis à jour que par un chargement de document
// complet, jamais par une navigation client. Dans une SPA App Router, l'écrasante majorité des
// parcours (chat → changelog, hub → convertisseur) sont donc invisibles pour lui — il affichait son
// repli et renvoyait sur /chat même quand on venait du hub, à deux clics de là.
//
// Ici, un simple compteur de portée module, incrémenté à chaque changement d'URL (cf. PageViews qui
// observe déjà le pathname). > 1 ⇒ on a navigué au moins une fois dans cette session, donc
// `history.back()` reste dans le site.
let depth = 0;

export function bumpNavDepth(): void { depth += 1; }
export function navDepth(): number { return depth; }
