// Page d'options / popup de l'extension Brimkern.
// Une seule préférence pour l'instant : activer ou non la réponse locale automatiquement à chaque
// recherche Google (désactivé par défaut pour la sobriété).

import { OPT_AUTO_ANSWER } from './protocol';

const uiLang = (typeof chrome !== 'undefined' && chrome.i18n?.getUILanguage?.()) || navigator.language || 'en';
const fr = /^fr\b/i.test(uiLang);
const t = (en: string, frText: string) => (fr ? frText : en);
document.documentElement.lang = fr ? 'fr' : 'en';

const MARK = `<svg width="18" height="18" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="24" width="52" height="52" rx="10"/><path d="M42 24V14M58 24V14M42 76v10M58 76v10M24 42H14M24 58H14M76 42h10M76 58h10"/><path d="M40 59c5 6 15 6 20 0"/></g><circle cx="40" cy="45" r="4.2" fill="currentColor"/><rect x="55.5" y="38" width="8.5" height="13" rx="1" fill="#ef4444"/></svg>`;

const hd = document.getElementById('hd')!;
hd.innerHTML = MARK;
hd.append(t('Brimkern · Options', 'Brimkern · Options'));

document.getElementById('auto-title')!.textContent = t(
  'Answer automatically on every search',
  'Répondre automatiquement à chaque recherche',
);
document.getElementById('auto-desc')!.textContent = t(
  'On: the local model answers as soon as a search opens (once downloaded). Off: no compute until you click.',
  'Activé : le modèle local répond dès l’ouverture d’une recherche (une fois téléchargé). Désactivé : aucun calcul tant que vous ne cliquez pas.',
);

const toggle = document.getElementById('auto-toggle') as HTMLInputElement;
const saved = document.getElementById('saved')!;

chrome.storage.local.get(OPT_AUTO_ANSWER).then((data) => {
  toggle.checked = Boolean(data?.[OPT_AUTO_ANSWER]);
}).catch(() => {});

let timer: ReturnType<typeof setTimeout> | undefined;
toggle.addEventListener('change', () => {
  const checked = toggle.checked;
  chrome.storage.local.set({ [OPT_AUTO_ANSWER]: checked }).then(() => {
    saved.textContent = checked
      ? t('Saved — active on new searches.', 'Enregistré — actif dès la prochaine recherche.')
      : t('Saved — manual mode restored.', 'Enregistré — mode manuel rétabli.');
    clearTimeout(timer);
    timer = setTimeout(() => { saved.textContent = ''; }, 2500);
  }).catch(() => {});
});
