// Le panneau « Réponse locale » sur la page de résultats Google.
//
// Il ne fait RIEN tant qu'on ne clique pas : ni réseau, ni GPU, ni moteur créé. C'est la promesse
// de sobriété — une recherche dont on lit les liens ne coûte aucun calcul d'IA, ni chez Google
// (la règle udm=14 ne demande pas l'aperçu) ni sur la machine.

import { extractResults, searchQuery } from './serp';
import { ENSURE, OPEN_OPTIONS, OPT_AUTO_ANSWER, PORT_NAME, type AskRequest, type ChatTurn, type EngineEvent, type SerpResult } from './protocol';
import { fmtModelSize } from '../../../src/lib/modelCatalog';
import { TIER_MODELS } from './tier';

const HOST_ID = 'brimkern-answer';
const fr = /^fr\b/i.test(document.documentElement.lang || navigator.language || '');
const t = (en: string, frText: string) => (fr ? frText : en);

const modelName = (model: string) => Object.values(TIER_MODELS).find((x) => x.model === model)?.label ?? model;
const PHASES: Record<string, () => string> = {
  init: () => t('Starting the engine…', 'Démarrage du moteur…'),
  download: () => t('Downloading the model…', 'Téléchargement du modèle…'),
  tokenizer: () => t('Preparing…', 'Préparation…'),
  gpu: () => t('Loading onto the GPU…', 'Chargement sur le GPU…'),
};
const fmtSeconds = (ms: number) => (ms / 1000).toFixed(1).replace('.', fr ? ',' : '.');

const CSS = `
:host{all:initial;display:block;margin:16px 0 6px;max-width:652px;
  --fg:#1f1f1f;--muted:#4d5156;--line:#dadce0;--surface:#f1f3f4;--link:#1a0dab;--btn-bg:#1f1f1f;--btn-fg:#fff;--bar:#1f1f1f}
:host([data-theme=dark]){--fg:#e8eaed;--muted:#bdc1c6;--line:#3c4043;--surface:#303134;--link:#99c3ff;--btn-bg:#e8eaed;--btn-fg:#202124;--bar:#e8eaed}
.card{border:1px solid var(--line);border-radius:12px;padding:14px 16px;color:var(--fg);font:14px/1.58 arial,sans-serif}
.hd{display:flex;align-items:center;gap:8px;font-weight:600;font-size:13px;color:var(--muted)}
.hd svg{flex:none}
.hd-opt{margin-left:auto;background:transparent;border:1px solid transparent;color:var(--muted);
  font:500 12px/1 arial,sans-serif;padding:4px 8px;border-radius:999px;cursor:pointer}
.hd-opt:hover{color:var(--fg);border-color:var(--line)}
.note{color:var(--muted);font-size:12.5px;margin:6px 0 0}
.note:empty{display:none}
.row{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.row:empty{display:none}
button{font:500 14px/1 arial,sans-serif;border-radius:999px;padding:9px 16px;cursor:pointer;
  border:1px solid var(--btn-bg);background:var(--btn-bg);color:var(--btn-fg)}
button.ghost{background:transparent;color:var(--fg);border-color:var(--line)}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--link);outline-offset:2px}
.answer{margin:10px 0 0;white-space:pre-wrap;font-size:15px;line-height:1.6}
.answer:empty{display:none}
.status{margin:10px 0 0;color:var(--muted);font-size:13px}
.status:empty{display:none}
.bar{height:3px;background:var(--line);border-radius:3px;margin-top:6px;overflow:hidden}
.bar>i{display:block;height:100%;width:0;background:var(--bar);transition:width .2s}
ol{margin:10px 0 0;padding-left:22px;font-size:13px}
ol:empty{display:none}
li{margin:2px 0}
a{color:var(--link);text-decoration:none}
a:hover{text-decoration:underline}
.site{color:var(--muted)}
.thread{margin-top:14px;padding-top:12px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:12px}
.thread:empty{display:none}
.turn{display:flex;flex-direction:column;gap:6px}
.turn-q{align-self:flex-start;background:var(--surface);color:var(--fg);border-radius:14px;padding:7px 12px;font-size:14px;line-height:1.45;font-weight:500;max-width:100%;word-break:break-word}
.turn-a{white-space:pre-wrap;font-size:15px;line-height:1.6;color:var(--fg)}
.turn-a:empty{display:none}
.followup{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}
.followup[hidden]{display:none}
.followup input{flex:1;min-width:0;font:14px/1.4 arial,sans-serif;color:var(--fg);background:transparent;
  border:1px solid var(--line);border-radius:999px;padding:8px 14px}
.followup input::placeholder{color:var(--muted);opacity:1}
.followup input:disabled{opacity:.6}
.followup button{flex:none;padding:8px 14px;font-size:13.5px}
.followup button[hidden]{display:none}
@media (prefers-reduced-motion:reduce){.bar>i{transition:none}}
`;

// La puce de la marque (src/app/icon.svg), en trait seul, à la couleur du texte secondaire.
const MARK = `<svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="24" width="52" height="52" rx="10"/><path d="M42 24V14M58 24V14M42 76v10M58 76v10M24 42H14M24 58H14M76 42h10M76 58h10"/><path d="M40 59c5 6 15 6 20 0"/></g><circle cx="40" cy="45" r="4.2" fill="currentColor"/><rect x="55.5" y="38" width="8.5" height="13" rx="1" fill="#ef4444"/></svg>`;

function isDark(): boolean {
  for (const el of [document.body, document.documentElement]) {
    const m = getComputedStyle(el).backgroundColor.match(/\d+(\.\d+)?/g);
    if (!m || (m.length === 4 && Number(m[3]) === 0)) continue; // transparent : on regarde le parent
    const [r, g, b] = m.map(Number);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
  }
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function mount(query: string, results: SerpResult[]) {
  const anchor = document.querySelector('#center_col') || document.querySelector('#rcnt') || document.querySelector('#search');
  if (!anchor || document.getElementById(HOST_ID)) return;
  const host = el('div');
  host.id = HOST_ID;
  if (isDark()) host.dataset.theme = 'dark';
  const root = host.attachShadow({ mode: 'open' });
  const style = el('style');
  style.textContent = CSS;
  const card = el('section', 'card');
  card.setAttribute('aria-label', t('Local answer', 'Réponse locale'));
  const hd = el('div', 'hd');
  hd.innerHTML = MARK; // constante, aucune donnée dynamique
  hd.append(t('Brimkern · Local answer', 'Brimkern · Réponse locale'));
  const optBtn = el('button', 'hd-opt', t('Options', 'Options'));
  optBtn.type = 'button';
  optBtn.setAttribute('aria-label', t('Extension options', 'Options de l’extension'));
  optBtn.addEventListener('click', () => { chrome.runtime.sendMessage({ type: OPEN_OPTIONS }).catch(() => {}); });
  hd.append(optBtn);
  const note = el('p', 'note');
  const row = el('div', 'row');
  const status = el('p', 'status');
  status.setAttribute('role', 'status');
  const bar = el('div', 'bar');
  const fill = el('i');
  bar.append(fill);
  bar.hidden = true;
  const answer = el('div', 'answer');
  answer.setAttribute('aria-live', 'polite');
  const sources = el('ol');
  const thread = el('div', 'thread');
  // `note` explique AVANT (ce qui va se passer), `foot` rend compte APRÈS (temps de calcul, mise en
  // garde) — sous la réponse, là où on lit les sources.
  const foot = el('p', 'note foot');
  const followupForm = el('form', 'followup');
  followupForm.hidden = true;
  const followupInput = el('input');
  followupInput.type = 'text';
  followupInput.autocomplete = 'off';
  followupInput.placeholder = t('Ask a follow-up…', 'Poser une question de suivi…');
  followupInput.setAttribute('aria-label', t('Ask a follow-up question', 'Poser une question de suivi'));
  // Google écoute `/` sur le document pour ramener le focus dans sa barre de recherche : on bloque
  // la propagation tant que l'utilisateur écrit dans le champ de suivi.
  followupInput.addEventListener('keydown', (e) => e.stopPropagation());
  const sendBtn = el('button', undefined, t('Ask', 'Envoyer'));
  sendBtn.type = 'submit';
  const stopBtn = el('button', 'ghost', t('Stop', 'Arrêter'));
  stopBtn.type = 'button';
  stopBtn.hidden = true;
  followupForm.append(followupInput, sendBtn, stopBtn);
  card.append(hd, note, answer, sources, thread, status, bar, foot, followupForm, row);
  root.append(style, card);
  anchor.prepend(host);

  const history: ChatTurn[] = [];
  let activePort: chrome.runtime.Port | null = null;
  let cancelActive: (() => void) | null = null;
  // port.disconnect() ne déclenche pas onDisconnect côté appelant : toujours libérer activePort ici.
  const closePort = (p: chrome.runtime.Port) => {
    if (activePort === p) activePort = null;
    p.disconnect();
  };

  stopBtn.addEventListener('click', () => { cancelActive?.(); });

  const setFollowupBusy = (busy: boolean) => {
    followupInput.disabled = busy;
    sendBtn.hidden = busy;
    stopBtn.hidden = !busy;
  };

  const buttons = (...bs: { label: string; ghost?: boolean; run: () => void }[]) => {
    row.replaceChildren(...bs.map((b) => {
      const btn = el('button', b.ghost ? 'ghost' : undefined, b.label);
      btn.type = 'button';
      btn.addEventListener('click', b.run);
      return btn;
    }));
  };

  const idle = () => {
    note.textContent = t(
      'Computed on your device from the results below, only when you ask. Nothing is sent.',
      'Calculée sur votre appareil à partir des résultats ci-dessous, seulement si vous la demandez. Rien n’est envoyé.',
    );
    status.textContent = '';
    foot.textContent = '';
    answer.textContent = '';
    sources.replaceChildren();
    thread.replaceChildren();
    history.length = 0;
    followupForm.hidden = true;
    setFollowupBusy(false);
    buttons({ label: t('Answer on this device', 'Répondre sur cet appareil'), run: () => ask(false) });
  };

  const showSources = (docs: number[]) => {
    sources.replaceChildren(...docs.map((d) => results[d]).filter(Boolean).map((r) => {
      const li = el('li');
      const a = el('a', undefined, r.title);
      a.href = r.url;
      li.append(a);
      if (r.site) li.append(el('span', 'site', ` — ${r.site}`));
      return li;
    }));
  };

  let attempt = 0;
  const ask = async (consent: boolean) => {
    row.replaceChildren();
    note.textContent = '';
    foot.textContent = '';
    answer.textContent = '';
    sources.replaceChildren();
    thread.replaceChildren();
    history.length = 0;
    followupForm.hidden = true;
    status.textContent = PHASES.init();
    let port: chrome.runtime.Port;
    try {
      const r = await chrome.runtime.sendMessage({ type: ENSURE });
      if (!r?.ok) throw new Error(r?.error || 'engine unavailable');
      port = chrome.runtime.connect({ name: PORT_NAME });
    } catch (e: any) {
      return fail(String(e?.message || e));
    }
    activePort = port;
    let settled = false;
    port.onDisconnect.addListener(() => {
      if (activePort === port) activePort = null;
      if (settled) return;
      // Le moteur s'est fermé (inactivité) au moment où on s'y connectait : un seul nouvel essai.
      if (attempt++ < 1) ask(consent);
      else fail(t('the engine stopped responding.', 'le moteur ne répond plus.'));
    });
    port.onMessage.addListener((e: EngineEvent) => {
      switch (e.type) {
        case 'unsupported':
          settled = true;
          status.textContent = e.reason === 'no-webgpu'
            ? t('This browser cannot run the local model (WebGPU unavailable).', 'Ce navigateur ne peut pas faire tourner le modèle local (WebGPU indisponible).')
            : t('No graphics card is available to WebGPU: a local answer would run on the processor, very slowly.', 'Aucune carte graphique accessible à WebGPU : une réponse locale tournerait sur le processeur, très lentement.');
          closePort(port);
          break;
        case 'need-consent': {
          settled = true;
          closePort(port);
          status.textContent = '';
          const what = `${modelName(e.model)}, ${fmtModelSize(e.bytes, fr)}`;
          note.textContent = t(
            `First use: the model (${what}) is downloaded once from Hugging Face and stays on this computer.`,
            `Premier usage : le modèle (${what}) est téléchargé une seule fois depuis Hugging Face et reste sur cet ordinateur.`,
          );
          buttons(
            { label: t('Download and answer', 'Télécharger et répondre'), run: () => ask(true) },
            { label: t('Not now', 'Pas maintenant'), ghost: true, run: idle },
          );
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
        case 'sources':
          bar.hidden = true;
          status.textContent = t('Reading the results…', 'Lecture des résultats…');
          showSources(e.docs);
          break;
        case 'token':
          status.textContent = '';
          answer.setAttribute('aria-busy', 'true');
          answer.textContent = e.text;
          break;
        case 'done': {
          settled = true;
          answer.removeAttribute('aria-busy');
          answer.textContent = e.text;
          history.splice(0, history.length, { role: 'assistant', content: e.text });
          foot.textContent = t(
            `Computed on this device in ${fmtSeconds(e.ms)} s. A small model can be wrong: check the sources.`,
            `Calculée sur cet appareil en ${fmtSeconds(e.ms)} s. Un petit modèle peut se tromper : vérifiez les sources.`,
          );
          followupForm.hidden = false;
          setFollowupBusy(false);
          closePort(port);
          break;
        }
        case 'error':
          settled = true;
          closePort(port);
          fail(e.message);
          break;
      }
    });
    const req: AskRequest = { type: 'ask', query, results, lang: fr ? 'fr' : 'en', consent };
    port.postMessage(req);
  };

  let followUpAttempt = 0;
  const sendFollowUp = async (question: string, turnEl: HTMLElement, turnAnswer: HTMLElement, consent: boolean) => {
    row.replaceChildren();
    status.textContent = t('Thinking…', 'Réflexion…');
    setFollowupBusy(true);
    let port: chrome.runtime.Port;
    try {
      const r = await chrome.runtime.sendMessage({ type: ENSURE });
      if (!r?.ok) throw new Error(r?.error || 'engine unavailable');
      port = chrome.runtime.connect({ name: PORT_NAME });
    } catch (e: any) {
      return failFollowUp(String(e?.message || e), question, turnEl, turnAnswer);
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
      turnAnswer.removeAttribute('aria-busy');
      if (!turnAnswer.textContent) {
        turnEl.remove();
        followupInput.value = question;
      }
      setFollowupBusy(false);
      followupInput.focus();
    };
    port.onDisconnect.addListener(() => {
      if (activePort === port) activePort = null;
      if (settled) return;
      cancelActive = null;
      if (followUpAttempt++ < 1) sendFollowUp(question, turnEl, turnAnswer, consent);
      else failFollowUp(t('the engine stopped responding.', 'le moteur ne répond plus.'), question, turnEl, turnAnswer);
    });
    port.onMessage.addListener((e: EngineEvent) => {
      switch (e.type) {
        case 'unsupported':
          settled = true;
          cancelActive = null;
          closePort(port);
          failFollowUp(
            e.reason === 'no-webgpu'
              ? t('WebGPU unavailable.', 'WebGPU indisponible.')
              : t('No hardware GPU available.', 'Aucune carte graphique disponible.'),
            question, turnEl, turnAnswer,
          );
          break;
        case 'need-consent': {
          settled = true;
          cancelActive = null;
          closePort(port);
          status.textContent = '';
          setFollowupBusy(false);
          const what = `${modelName(e.model)}, ${fmtModelSize(e.bytes, fr)}`;
          status.textContent = t(
            `The model (${what}) needs to be downloaded again from Hugging Face.`,
            `Le modèle (${what}) doit être téléchargé à nouveau depuis Hugging Face.`,
          );
          buttons(
            { label: t('Download and answer', 'Télécharger et répondre'), run: () => { followUpAttempt = 0; sendFollowUp(question, turnEl, turnAnswer, true); } },
            { label: t('Cancel', 'Annuler'), ghost: true, run: () => { row.replaceChildren(); status.textContent = ''; turnEl.remove(); followupInput.value = question; } },
          );
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
          turnAnswer.setAttribute('aria-busy', 'true');
          turnAnswer.textContent = e.text;
          break;
        case 'done':
          settled = true;
          cancelActive = null;
          bar.hidden = true;
          status.textContent = '';
          turnAnswer.removeAttribute('aria-busy');
          turnAnswer.textContent = e.text;
          history.push({ role: 'user', content: question }, { role: 'assistant', content: e.text });
          foot.textContent = t(
            `Computed on this device in ${fmtSeconds(e.ms)} s. A small model can be wrong: check the sources.`,
            `Calculée sur cet appareil en ${fmtSeconds(e.ms)} s. Un petit modèle peut se tromper : vérifiez les sources.`,
          );
          setFollowupBusy(false);
          followupInput.focus();
          closePort(port);
          break;
        case 'error':
          settled = true;
          cancelActive = null;
          closePort(port);
          failFollowUp(e.message, question, turnEl, turnAnswer);
          break;
      }
    });
    const req: AskRequest = {
      type: 'ask',
      query,
      results,
      lang: fr ? 'fr' : 'en',
      consent,
      followUp: question,
      history: history.slice(),
    };
    port.postMessage(req);
  };

  const failFollowUp = (message: string, question: string, turnEl: HTMLElement, turnAnswer: HTMLElement) => {
    bar.hidden = true;
    turnAnswer.removeAttribute('aria-busy');
    if (!turnAnswer.textContent) {
      turnEl.remove();
      followupInput.value = question;
    }
    status.textContent = t(`The follow-up failed: ${message}`, `La question de suivi a échoué : ${message}`);
    setFollowupBusy(false);
    followupInput.focus();
  };

  followupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = followupInput.value.trim();
    if (!question || activePort) return;
    followupInput.value = '';
    followUpAttempt = 0;
    const turnEl = el('div', 'turn');
    const turnQ = el('div', 'turn-q', question);
    const turnA = el('div', 'turn-a');
    turnA.setAttribute('aria-live', 'polite');
    turnEl.append(turnQ, turnA);
    thread.append(turnEl);
    sendFollowUp(question, turnEl, turnA, false);
  });

  const fail = (message: string) => {
    bar.hidden = true;
    status.textContent = t(`The local answer failed: ${message}`, `La réponse locale a échoué : ${message}`);
    buttons({ label: t('Try again', 'Réessayer'), ghost: true, run: () => { attempt = 0; ask(false); } });
  };

  idle();
  chrome.storage?.local?.get(OPT_AUTO_ANSWER).then((data) => {
    if (data?.[OPT_AUTO_ANSWER] && !activePort && !history.length) ask(false);
  }).catch(() => {});
}

const query = searchQuery(location);
if (query) {
  const results = extractResults(document);
  // Sans résultat lisible, il n'y a rien sur quoi fonder une réponse : pas de panneau.
  if (results.length) mount(query, results);
}
