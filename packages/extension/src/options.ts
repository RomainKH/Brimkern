// Page d'options / popup de l'extension Brimkern.
// Préférences : auto-réponse, filtre Google Web (udm=14), choix du palier/modèle, gestion du
// cache disque et raccourci vers le panneau latéral « Questionner cette page ».

import { IDLE, OPEN_SIDEPANEL, OPT_AUTO_ANSWER, OPT_TIER, OPT_UDM14, type TierPref } from './protocol';
import { TIER_MODELS } from './tier';
import { fmtModelSize } from '../../../src/lib/modelCatalog';

const uiLang = (typeof chrome !== 'undefined' && chrome.i18n?.getUILanguage?.()) || navigator.language || 'en';
const fr = /^fr\b/i.test(uiLang);
const t = (en: string, frText: string) => (fr ? frText : en);
document.documentElement.lang = fr ? 'fr' : 'en';

const MARK = `<svg width="18" height="18" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="24" width="52" height="52" rx="10"/><path d="M42 24V14M58 24V14M42 76v10M58 76v10M24 42H14M24 58H14M76 42h10M76 58h10"/><path d="M40 59c5 6 15 6 20 0"/></g><circle cx="40" cy="45" r="4.2" fill="currentColor"/><rect x="55.5" y="38" width="8.5" height="13" rx="1" fill="#ef4444"/></svg>`;

const hd = document.getElementById('hd')!;
hd.innerHTML = MARK;
hd.append('Brimkern · Options');

const openPanelBtn = document.getElementById('open-panel') as HTMLButtonElement;
openPanelBtn.textContent = t('Ask about the current page (side panel)', 'Questionner la page ouverte (panneau latéral)');
openPanelBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: OPEN_SIDEPANEL }).catch(() => {});
  window.close();
});

document.getElementById('auto-title')!.textContent = t(
  'Answer automatically on every search',
  'Répondre automatiquement à chaque recherche',
);
document.getElementById('auto-desc')!.textContent = t(
  'On: the local model answers as soon as a search opens (once downloaded). Off: no compute until you click.',
  'Activé : le modèle local répond dès l’ouverture d’une recherche (une fois téléchargé). Désactivé : aucun calcul tant que vous ne cliquez pas.',
);

document.getElementById('udm-title')!.textContent = t(
  'Skip Google AI Overview (udm=14)',
  'Ne pas demander l’aperçu IA de Google (udm=14)',
);
document.getElementById('udm-desc')!.textContent = t(
  'Redirects Google web searches to Google’s “Web” tab so its AI Overview is not requested.',
  'Ajoute le filtre « Web » de Google pour que son aperçu IA ne soit pas généré.',
);

document.getElementById('tier-title')!.textContent = t('Local model', 'Modèle local');
document.getElementById('tier-desc')!.textContent = t(
  'Auto picks based on device memory and network, preferring a model already cached.',
  'Auto choisit selon la mémoire et le réseau, en préférant un modèle déjà en cache.',
);

const tierSelect = document.getElementById('tier-select') as HTMLSelectElement;
const tiers: { value: TierPref; label: string }[] = [
  { value: 'auto', label: t('Auto (recommended)', 'Auto (recommandé)') },
  { value: 'light', label: `${TIER_MODELS.light.label} — ${fmtModelSize(TIER_MODELS.light.bytes, fr)} (${t('fast, low RAM', 'rapide, peu de RAM')})` },
  { value: 'standard', label: `${TIER_MODELS.standard.label} — ${fmtModelSize(TIER_MODELS.standard.bytes, fr)} (${t('more accurate', 'plus précis')})` },
];
for (const opt of tiers) {
  const o = document.createElement('option');
  o.value = opt.value;
  o.textContent = opt.label;
  tierSelect.append(o);
}

document.getElementById('cache-title')!.textContent = t('Model cache on this device', 'Cache des modèles sur cet appareil');
const clearBtn = document.getElementById('clear-cache') as HTMLButtonElement;
clearBtn.textContent = t('Clear cache', 'Vider le cache');
const cacheInfo = document.getElementById('cache-info')!;
const saved = document.getElementById('saved')!;

let timer: ReturnType<typeof setTimeout> | undefined;
function flash(msg: string) {
  saved.textContent = msg;
  clearTimeout(timer);
  timer = setTimeout(() => { saved.textContent = ''; }, 2500);
}

async function refreshCacheInfo() {
  const cachedNames = Object.values(TIER_MODELS)
    .filter((m) => { try { return localStorage.getItem(`bk-downloaded:${m.model}`) === '1'; } catch { return false; } })
    .map((m) => m.label);
  let used = 0;
  try {
    const est = await navigator.storage?.estimate?.();
    used = est?.usage ?? 0;
  } catch {}
  if (used > 1024 * 1024 || cachedNames.length) {
    const size = used > 0 ? fmtModelSize(used, fr) : '';
    const list = cachedNames.length ? cachedNames.join(', ') : t('cached files', 'fichiers en cache');
    cacheInfo.textContent = size ? `${list} (${size})` : list;
  } else {
    cacheInfo.textContent = t('No model downloaded yet.', 'Aucun modèle téléchargé pour l’instant.');
  }
}

const autoToggle = document.getElementById('auto-toggle') as HTMLInputElement;
const udmToggle = document.getElementById('udm-toggle') as HTMLInputElement;

chrome.storage.local.get([OPT_AUTO_ANSWER, OPT_UDM14, OPT_TIER]).then((data) => {
  autoToggle.checked = Boolean(data?.[OPT_AUTO_ANSWER]);
  udmToggle.checked = data?.[OPT_UDM14] !== false;
  const pref = data?.[OPT_TIER];
  tierSelect.value = pref === 'light' || pref === 'standard' ? pref : 'auto';
}).catch(() => {});
refreshCacheInfo();

autoToggle.addEventListener('change', () => {
  const checked = autoToggle.checked;
  chrome.storage.local.set({ [OPT_AUTO_ANSWER]: checked }).then(() => {
    flash(checked
      ? t('Saved — active on new searches.', 'Enregistré — actif dès la prochaine recherche.')
      : t('Saved — manual mode restored.', 'Enregistré — mode manuel rétabli.'));
  }).catch(() => {});
});

udmToggle.addEventListener('change', () => {
  const enabled = udmToggle.checked;
  Promise.all([
    chrome.storage.local.set({ [OPT_UDM14]: enabled }),
    chrome.declarativeNetRequest.updateEnabledRulesets(
      enabled ? { enableRulesetIds: ['udm14'] } : { disableRulesetIds: ['udm14'] },
    ),
  ]).then(() => {
    flash(enabled
      ? t('Saved — Google Web filter (udm=14) enabled.', 'Enregistré — filtre Google Web (udm=14) activé.')
      : t('Saved — Google Web filter disabled.', 'Enregistré — filtre Google Web désactivé.'));
  }).catch(() => {});
});

tierSelect.addEventListener('change', () => {
  const val = tierSelect.value as TierPref;
  chrome.storage.local.set({ [OPT_TIER]: val }).then(() => {
    flash(t('Saved — model preference updated.', 'Enregistré — préférence de modèle mise à jour.'));
  }).catch(() => {});
});

clearBtn.addEventListener('click', async () => {
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    for (const m of Object.values(TIER_MODELS)) {
      try { localStorage.removeItem(`bk-downloaded:${m.model}`); } catch {}
    }
    chrome.runtime.sendMessage({ type: IDLE }).catch(() => {});
    await refreshCacheInfo();
    flash(t('Model cache cleared.', 'Cache des modèles vidé.'));
  } catch (e: any) {
    flash(String(e?.message || e));
  }
});
