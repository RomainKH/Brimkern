// La règle « ne pas demander l'aperçu IA » : toute recherche web Google part avec `udm=14`, le
// filtre « Web » de Google, dont la page ne contient pas d'aperçu IA. C'est la seule façon pour que
// l'extension ÉVITE ce calcul côté Google au lieu de le masquer une fois fait.
// Les onglets explicites (Images, Actualités, Mode IA… : `udm` ou `tbm` présents) passent tels
// quels — la règle d'autorisation, de priorité plus haute, gagne sur la redirection.
// Générée au build (un seul fichier de domaines pour le manifeste et la règle), testée par
// scripts/test-extension.mjs.

export const SEARCH_REGEX = '^https://www\\.google\\.[a-z.]+/search\\?';
export const EXPLICIT_TAB_REGEX = '[?&](udm|tbm)=';

export function udm14Rules(domains) {
  const base = { requestDomains: domains, resourceTypes: ['main_frame'] };
  return [
    { id: 1, priority: 2, action: { type: 'allow' }, condition: { ...base, regexFilter: EXPLICIT_TAB_REGEX } },
    {
      id: 2,
      priority: 1,
      action: { type: 'redirect', redirect: { transform: { queryTransform: { addOrReplaceParams: [{ key: 'udm', value: '14' }] } } } },
      condition: { ...base, regexFilter: SEARCH_REGEX },
    },
  ];
}
