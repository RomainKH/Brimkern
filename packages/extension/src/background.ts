// Service worker : il ne calcule rien. Il crée le document offscreen (le moteur) quand un panneau
// en a besoin, et le ferme quand le moteur signale qu'il est inactif. La règle udm=14, elle, est
// déclarative (rules/udm14.json) : elle s'applique même quand ce worker dort.

import { ENSURE, IDLE } from './protocol';

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
});
