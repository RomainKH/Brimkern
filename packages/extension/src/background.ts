// Service worker : il ne calcule rien. Il crée le document offscreen (le moteur) quand un panneau
// en a besoin, et le ferme quand le moteur signale qu'il est inactif. La règle udm=14, elle, est
// déclarative (rules/udm14.json) : elle s'applique même quand ce worker dort.

import { ENSURE, IDLE, OPEN_OPTIONS, OPEN_SIDEPANEL, OPT_UDM14, PENDING_PAGE_SELECTION } from './protocol';

const MENU_ID = 'bk-ask-page';

async function syncUdm14(): Promise<void> {
  try {
    const data = await chrome.storage.local.get(OPT_UDM14);
    const enabled = data?.[OPT_UDM14] !== false; // activé par défaut
    await chrome.declarativeNetRequest.updateEnabledRulesets(
      enabled ? { enableRulesetIds: ['udm14'] } : { disableRulesetIds: ['udm14'] },
    );
  } catch {}
}

function setupMenu(): void {
  try {
    const fr = /^fr\b/i.test(chrome.i18n?.getUILanguage?.() || '');
    chrome.contextMenus.removeAll().then(() => {
      chrome.contextMenus.create({
        id: MENU_ID,
        title: fr ? 'Demander à Brimkern (local)' : 'Ask Brimkern (local)',
        contexts: ['page', 'selection'],
      });
    }).catch(() => {});
  } catch {}
}

chrome.runtime.onInstalled?.addListener(() => { syncUdm14(); setupMenu(); });
chrome.runtime.onStartup?.addListener(() => { syncUdm14(); });

chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab?.windowId) return;
  if (info.selectionText) {
    chrome.storage.local.set({ [PENDING_PAGE_SELECTION]: info.selectionText.trim() }).catch(() => {});
  }
  chrome.sidePanel?.open({ windowId: tab.windowId }).catch(() => {});
});

let creating: Promise<void> | null = null;

async function ensureEngine(): Promise<void> {
  if (await chrome.offscreen.hasDocument()) return;
  creating ??= chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['WORKERS'],
    justification: 'Runs the on-device language model (WebGPU) that answers the search when the user asks for it.',
  }).finally(() => { creating = null; });
  await creating;
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg?.type === ENSURE) {
    ensureEngine().then(
      () => reply({ ok: true }),
      (e) => reply({ ok: false, error: String(e?.message || e) }),
    );
    return true; // réponse asynchrone
  }
  if (msg?.type === IDLE) {
    chrome.offscreen.closeDocument().catch(() => {});
  }
  if (msg?.type === OPEN_OPTIONS) {
    chrome.runtime.openOptionsPage().catch(() => {});
  }
  if (msg?.type === OPEN_SIDEPANEL) {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab?.windowId) return chrome.sidePanel?.open({ windowId: tab.windowId });
    }).catch(() => {});
  }
});
