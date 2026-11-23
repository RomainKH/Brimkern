// Panneau latéral Chrome : résumer ou questionner la page ouverte en 100 % local sur le GPU.
// Réutilise le même document offscreen et le même modèle WebGPU que les réponses de recherche.

import { ENSURE, PENDING_PAGE_SELECTION, PORT_NAME, type ChatTurn, type EngineEvent, type PageAskRequest } from './protocol';
import { TIER_MODELS } from './tier';
import { fmtModelSize } from '../../../src/lib/modelCatalog';

const uiLang = (typeof chrome !== 'undefined' && chrome.i18n?.getUILanguage?.()) || navigator.language || 'en';
const fr = /^fr\b/i.test(uiLang);
const t = (en: string, frText: string) => (fr ? frText : en);
document.documentElement.lang = fr ? 'fr' : 'en';

const MARK = `<svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="24" width="52" height="52" rx="10"/><path d="M42 24V14M58 24V14M42 76v10M58 76v10M24 42H14M24 58H14M76 42h10M76 58h10"/><path d="M40 59c5 6 15 6 20 0"/></g><circle cx="40" cy="45" r="4.2" fill="currentColor"/><rect x="55.5" y="38" width="8.5" height="13" rx="1" fill="#ef4444"/></svg>`;
const modelName = (model: string) => Object.values(TIER_MODELS).find((x) => x.model === model)?.label ?? model;
const fmtSeconds = (ms: number) => (ms / 1000).toFixed(1).replace('.', fr ? ',' : '.');
const PHASES: Record<string, () => string> = {
  init: () => t('Starting the engine…', 'Démarrage du moteur…'),
  download: () => t('Downloading the model…', 'Téléchargement du modèle…'),
  tokenizer: () => t('Preparing…', 'Préparation…'),
  gpu: () => t('Loading onto the GPU…', 'Chargement sur le GPU…'),
};

const brand = document.getElementById('brand')!;
brand.innerHTML = MARK;
brand.append(t('Brimkern · Page assistant', 'Brimkern · Assistant de page'));

const reloadBtn = document.getElementById('reload-tab') as HTMLButtonElement;
reloadBtn.textContent = t('Read active tab', 'Lire l’onglet');
const pageTitleEl = document.getElementById('page-title')!;
const pageMetaEl = document.getElementById('page-meta')!;
const sumBtn = document.getElementById('btn-summarize') as HTMLButtonElement;
sumBtn.textContent = t('Summarize this page', 'Résumer cette page');
const keyBtn = document.getElementById('btn-keypoints') as HTMLButtonElement;
keyBtn.textContent = t('Key points', 'Points clés');
const thread = document.getElementById('thread')!;
const status = document.getElementById('status')!;
const bar = document.getElementById('bar')!;
const fill = document.getElementById('fill')!;
const consentRow = document.getElementById('consent')!;
const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('input') as HTMLInputElement;
input.placeholder = t('Ask anything about this page…', 'Poser une question sur cette page…');
input.setAttribute('aria-label', t('Question about the active page', 'Question sur la page active'));
const sendBtn = document.getElementById('send') as HTMLButtonElement;
sendBtn.textContent = t('Ask', 'Envoyer');
const stopBtn = document.getElementById('stop') as HTMLButtonElement;
stopBtn.textContent = t('Stop', 'Arrêter');

let ctxPage = { title: '', url: '', text: '' };
const history: ChatTurn[] = [];
let activePort: chrome.runtime.Port | null = null;
let cancelActive: (() => void) | null = null;

const closePort = (p: chrome.runtime.Port) => {
  if (activePort === p) activePort = null;
  p.disconnect();
};

const setBusy = (busy: boolean) => {
  input.disabled = busy;
  sumBtn.disabled = busy;
  keyBtn.disabled = busy;
  sendBtn.hidden = busy;
  stopBtn.hidden = !busy;
};

stopBtn.addEventListener('click', () => { cancelActive?.(); });

async function readActiveTab() {
  status.textContent = '';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url || /^(chrome|edge|about|chrome-extension):/.test(tab.url)) {
      pageTitleEl.textContent = t('No readable web page in this tab', 'Aucune page web lisible dans cet onglet');
      pageMetaEl.textContent = t('Open an article or website, then click “Read active tab”.', 'Ouvrez un article ou un site, puis cliquez sur « Lire l’onglet ».');
      ctxPage = { title: '', url: '', text: '' };
      return;
    }
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const main = document.querySelector('article, main, [role="main"]') || document.body;
        const text = (main as HTMLElement)?.innerText || document.body?.innerText || '';
        return { title: document.title || '', url: location.href, text: text.slice(0, 12000) };
      },
    });
    const r = res?.result;
    if (!r?.text?.trim()) {
      pageTitleEl.textContent = tab.title || tab.url;
      pageMetaEl.textContent = t('No readable text found on this page.', 'Aucun texte lisible trouvé sur cette page.');
      ctxPage = { title: tab.title || '', url: tab.url, text: '' };
      return;
    }
    if (ctxPage.url !== r.url) {
      history.length = 0;
      thread.replaceChildren();
    }
    ctxPage = r;
    pageTitleEl.textContent = r.title || r.url;
    pageMetaEl.textContent = t(
      `Local only · ${Math.min(6000, r.text.length)} chars read`,
      `100 % local · ${Math.min(6000, r.text.length)} caractères lus`,
    );
  } catch (e: any) {
    pageTitleEl.textContent = t('Cannot read this tab', 'Impossible de lire cet onglet');
    pageMetaEl.textContent = String(e?.message || e);
  }
}

async function askPage(question: string, consent: boolean) {
  if (!ctxPage.text) await readActiveTab();
  if (!ctxPage.text) {
    status.textContent = t('Open a web page first, then ask your question.', 'Ouvrez d’abord une page web avant de poser une question.');
    return;
  }
  consentRow.replaceChildren();
  const userEl = document.createElement('div');
  userEl.className = 'msg-u';
  userEl.textContent = question;
  const botEl = document.createElement('div');
  botEl.className = 'msg-a';
  thread.append(userEl, botEl);
  thread.scrollTop = thread.scrollHeight;

  status.textContent = PHASES.init();
  setBusy(true);
  let port: chrome.runtime.Port;
  try {
    const r = await chrome.runtime.sendMessage({ type: ENSURE });
    if (!r?.ok) throw new Error(r?.error || 'engine unavailable');
    port = chrome.runtime.connect({ name: PORT_NAME });
  } catch (e: any) {
    userEl.remove();
    botEl.remove();
    status.textContent = String(e?.message || e);
    setBusy(false);
    return;
  }
  activePort = port;
  let settled = false;
  cancelActive = () => {
    if (settled) return;
    settled = true;
    cancelActive = null;
    closePort(port);
    bar.hidden = true;
    status.textContent = '';
    if (!botEl.textContent) { userEl.remove(); botEl.remove(); input.value = question; }
    setBusy(false);
    input.focus();
  };
  port.onDisconnect.addListener(() => {
    if (activePort === port) activePort = null;
    if (settled) return;
    cancelActive = null;
    bar.hidden = true;
    status.textContent = t('The engine stopped responding.', 'Le moteur ne répond plus.');
    setBusy(false);
  });
  port.onMessage.addListener((e: EngineEvent) => {
    switch (e.type) {
      case 'unsupported':
        settled = true;
        cancelActive = null;
        closePort(port);
        userEl.remove();
        botEl.remove();
        status.textContent = e.reason === 'no-webgpu'
          ? t('WebGPU unavailable in this browser.', 'WebGPU indisponible dans ce navigateur.')
          : t('No hardware GPU available to WebGPU.', 'Aucune carte graphique disponible pour WebGPU.');
        setBusy(false);
        break;
      case 'need-consent': {
        settled = true;
        cancelActive = null;
        closePort(port);
        userEl.remove();
        botEl.remove();
        const what = `${modelName(e.model)}, ${fmtModelSize(e.bytes, fr)}`;
        status.textContent = t(
          `First use: the model (${what}) is downloaded once from Hugging Face and stays on this computer.`,
          `Premier usage : le modèle (${what}) est téléchargé une seule fois depuis Hugging Face et reste sur cet ordinateur.`,
        );
        const ok = document.createElement('button');
        ok.type = 'button';
        ok.textContent = t('Download and answer', 'Télécharger et répondre');
        ok.addEventListener('click', () => askPage(question, true));
        const no = document.createElement('button');
        no.type = 'button';
        no.className = 'ghost';
        no.textContent = t('Cancel', 'Annuler');
        no.addEventListener('click', () => { consentRow.replaceChildren(); status.textContent = ''; });
        consentRow.replaceChildren(ok, no);
        setBusy(false);
        break;
      }
      case 'progress': {
        status.textContent = (PHASES[e.phase] || (() => e.phase))();
        const pct = e.total ? Math.min(100, (100 * (e.loaded || 0)) / e.total) : 0;
        bar.hidden = !(e.phase === 'download' && e.total);
        fill.style.width = `${pct.toFixed(1)}%`;
        if (e.phase === 'download' && e.total) {
          status.textContent += ` ${fmtModelSize(e.loaded || 0, fr)} / ${fmtModelSize(e.total, fr)}`;
        }
        break;
      }
      case 'token':
        bar.hidden = true;
        status.textContent = '';
        botEl.textContent = e.text;
        thread.scrollTop = thread.scrollHeight;
        break;
      case 'done':
        settled = true;
        cancelActive = null;
        bar.hidden = true;
        botEl.textContent = e.text;
        history.push({ role: 'user', content: question }, { role: 'assistant', content: e.text });
        status.textContent = t(`Computed locally in ${fmtSeconds(e.ms)} s.`, `Calculé en local en ${fmtSeconds(e.ms)} s.`);
        setBusy(false);
        input.focus();
        closePort(port);
        break;
      case 'error':
        settled = true;
        cancelActive = null;
        bar.hidden = true;
        closePort(port);
        if (!botEl.textContent) { userEl.remove(); botEl.remove(); }
        status.textContent = e.message;
        setBusy(false);
        break;
    }
  });
  const req: PageAskRequest = {
    type: 'ask-page',
    title: ctxPage.title,
    url: ctxPage.url,
    pageText: ctxPage.text,
    question,
    lang: fr ? 'fr' : 'en',
    consent,
    history: history.slice(),
  };
  port.postMessage(req);
}

reloadBtn.addEventListener('click', () => { readActiveTab(); });
sumBtn.addEventListener('click', () => {
  if (!activePort) askPage(t('Summarize this page in 3 to 5 concise sentences.', 'Résume cette page en 3 à 5 phrases concises.'), false);
});
keyBtn.addEventListener('click', () => {
  if (!activePort) askPage(t('List the 3 to 5 key takeaways of this page.', 'Liste les 3 à 5 points clés de cette page.'), false);
});
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q || activePort) return;
  input.value = '';
  askPage(q, false);
});

readActiveTab().then(async () => {
  try {
    const data = await chrome.storage.local.get(PENDING_PAGE_SELECTION);
    const sel = data?.[PENDING_PAGE_SELECTION];
    if (sel) {
      await chrome.storage.local.remove(PENDING_PAGE_SELECTION);
      input.value = t(`Explain this excerpt: "${sel.slice(0, 240)}"`, `Explique ce passage : « ${sel.slice(0, 240)} »`);
      input.focus();
    }
  } catch {}
});
