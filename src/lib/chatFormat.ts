// Pure chat-formatting domain logic shared by the app: per-architecture prompt templates, control/
// turn markers (for stop-detection + display cleanup), and the reasoning ("thinking") budget. No
// React/DOM — kept out of the page component so it stays testable and the component stays UI-only.

import type { ArchType } from './presets';

// Chat/control markers. Some tokenizers (notably DeepSeek-R1, whose fullwidth <｜…｜> turn markers
// aren't flagged "special") leak these into output despite skip_special_tokens, and the model can
// emit a new-turn marker mid-answer and role-play both sides. We use this list to BOTH stop
// generation as soon as one appears AND strip any that slip into the displayed text.
export const TURN_MARKERS = [
  '<｜end▁of▁sentence｜>', '<｜Assistant｜>', '<｜User｜>', '<｜begin▁of▁sentence｜>',
  '<|im_end|>', '<|im_start|>', '<|eot_id|>', '<|begin_of_text|>',
  '<|start_header_id|>', '<|end_header_id|>',
  '</s>', '<s>', '<end_of_turn>', '<start_of_turn>',
  // Ministral/Mistral (Tekken) : un nouveau tour serait [INST] — stop + strip s'il fuit.
  '[INST]', '[/INST]', '[SYSTEM_PROMPT]',
  // Role-tag hallucinations small models sometimes emit at the end of a turn (not real content).
  '</model>', '</assistant>', '</user>', '<|assistant|>', '<|user|>',
  // RWKV G1 (format « User:/Assistant: », vocab World sans tokens spéciaux) : un nouveau tour
  // s'écrit en texte brut — stop + strip. Le \n en tête évite de toucher un « User: » cité en
  // milieu de phrase (résiduel acceptable : très improbable en début de ligne d'une vraie réponse).
  '\nUser:',
];

// Remove any control/turn markers that leaked into generated text.
export const stripTurnMarkers = (text: string) =>
  TURN_MARKERS.reduce((t, m) => t.split(m).join(''), text);

// Reflection budget for reasoning models (those that emit a <think>…</think> phase, e.g. DeepSeek-R1).
// On slow in-browser decode an unbounded reasoning phase can eat the whole token budget before any
// answer appears. The level caps the thinking: if the model is still inside <think> after this many
// generated tokens we force-inject </think> so it commits to an answer. 'off' prefills an EMPTY
// think block in the prompt so the model skips reasoning entirely. No effect on non-reasoning archs.
export type ReflectionLevel = 'off' | 'low' | 'medium' | 'high';
export const THINK_BUDGETS: Record<ReflectionLevel, number> = { off: 0, low: 200, medium: 700, high: 2000 };

// Le raisonnement <think>…</think> d'un tour PASSÉ ne doit pas repartir dans le prompt : les
// templates officiels (Qwen3, DeepSeek-R1) le RETIRENT de l'historique. Le renvoyer gaspille le
// budget de contexte (150 tokens de réflexion par tour, constaté), casse la réutilisation du
// préfixe KV, et un bloc resté OUVERT (génération coupée en pleine réflexion) injecterait un
// <think> nu au milieu de l'historique — le modèle en déduit qu'il est encore en train de penser.
export function stripReasoning(s: string): string {
  const i = s.indexOf('<think>');
  if (i === -1) return s;
  const j = s.indexOf('</think>', i);
  return (j === -1 ? s.slice(0, i) : s.slice(0, i) + s.slice(j + 8)).trim();
}

// Build the model-ready prompt string from the chat history, per architecture chat template.
// Les messages assistant de l'HISTORIQUE sont débarrassés de leur raisonnement (cf. stripReasoning).
export function formatPrompt(chatMsgs: { role: string; content: string }[], archType: ArchType, systemText: string): string {
  chatMsgs = chatMsgs.map((m) => m.role === 'assistant' ? { ...m, content: stripReasoning(m.content) } : m);
  let formatted = '';

  if (archType === 'deepseek') {
    // DeepSeek-R1 distill conversation format (｜ = U+FF5C, ▁ = U+2581). System text is folded
    // into the first turn per R1 guidance; the model emits its <think>…</think> reasoning.
    formatted += '<｜begin▁of▁sentence｜>';
    if (systemText.trim()) formatted += systemText;
    for (const msg of chatMsgs) {
      if (msg.role === 'user') formatted += `<｜User｜>${msg.content}`;
      else if (msg.role === 'assistant') formatted += `<｜Assistant｜>${msg.content}<｜end▁of▁sentence｜>`;
    }
    formatted += '<｜Assistant｜>';
    return formatted;
  }

  if (archType === 'rwkv7') {
    // RWKV « G1 » (instruct) : format texte brut « User:/Assistant: » séparés par des lignes
    // vides — le vocab World n'a AUCUN token spécial de tour. Le système devient une ligne
    // d'en-tête ; l'arrêt se fait sur « \nUser: » (TURN_MARKERS) + eos id 0 (isStopToken).
    if (systemText.trim()) formatted += `System: ${systemText.trim()}\n\n`;
    for (const msg of chatMsgs) {
      if (msg.role === 'user') formatted += `User: ${msg.content.trim()}\n\n`;
      else if (msg.role === 'assistant') formatted += `Assistant: ${msg.content.trim()}\n\n`;
    }
    formatted += 'Assistant:';
    return formatted;
  }

  // Qwen3 : même template ChatML que Qwen2 ; le raisonnement (<think>) est natif — le budget de
  // réflexion de la page (préfixe vide pour 'off', clôture forcée au budget) s'applique tel quel.
  // LFM2/LFM2.5 : ChatML identique (le BOS <|startoftext|> est ajouté par le tokenizer à l'encode).
  // SmolLM3 : ChatML aussi (<|im_start|>/<|im_end|>) ; l'arrêt passe par le marqueur textuel
  // <|im_end|> de TURN_MARKERS — son id dépend du vocab, on ne le code pas en dur.
  if (archType === 'qwen' || archType === 'qwen3' || archType === 'lfm2' || archType === 'smollm3') {
    if (systemText.trim()) {
      formatted += `<|im_start|>system\n${systemText}<|im_end|>\n`;
    }
    for (const msg of chatMsgs) {
      formatted += `<|im_start|>${msg.role}\n${msg.content}<|im_end|>\n`;
    }
    formatted += `<|im_start|>assistant\n`;
  } else if (archType === 'llama3') {
    // Llama 3.x header-id template. (Réintégré 2026-07-18 : les lignes Q/K des GGUF llama sont
    // dé-permutées au chargement + rope_freqs.weight supporté — cf. model.ts.)
    formatted += '<|begin_of_text|>';
    if (systemText.trim()) formatted += `<|start_header_id|>system<|end_header_id|>\n\n${systemText}<|eot_id|>`;
    for (const msg of chatMsgs) {
      formatted += `<|start_header_id|>${msg.role}<|end_header_id|>\n\n${msg.content}<|eot_id|>`;
    }
    formatted += '<|start_header_id|>assistant<|end_header_id|>\n\n';
  } else if (archType === 'mistral3') {
    // Ministral 3 (template V13/Tekken) : [SYSTEM_PROMPT]…[/SYSTEM_PROMPT] puis [INST]…[/INST],
    // l'assistant répond nu et clôt par </s>. Pas de retours à la ligne dans les marqueurs.
    formatted += '<s>';
    if (systemText.trim()) formatted += `[SYSTEM_PROMPT]${systemText}[/SYSTEM_PROMPT]`;
    for (const msg of chatMsgs) {
      if (msg.role === 'user') formatted += `[INST]${msg.content}[/INST]`;
      else if (msg.role === 'assistant') formatted += `${msg.content}</s>`;
    }
  } else if (archType === 'gemma' || archType === 'gemma3') {
    if (systemText.trim()) {
      formatted += `<start_of_turn>model\n${systemText}<end_of_turn>\n`;
    }
    for (const msg of chatMsgs) {
      formatted += `<start_of_turn>${msg.role === 'assistant' ? 'model' : 'user'}\n${msg.content}<end_of_turn>\n`;
    }
    formatted += `<start_of_turn>model\n`;
  }

  return formatted;
}

// Le template de cette arch écrit-il LUI-MÊME le token de début de séquence ?
//   llama3   → « <|begin_of_text|> »   mistral3 → « <s> »
// Les autres (ChatML : qwen, qwen3, lfm2, smollm3 ; Gemma : <start_of_turn>) n'en écrivent pas et
// comptent sur le tokenizer pour l'ajouter à l'encodage.
//
// ⚠️ C'est ce qui décide de `add_special_tokens` à la tokenisation, et ce n'est pas cosmétique :
// tokeniser un prompt llama3 avec l'ajout automatique produisait « 128000, 128000, … » — un BOS
// DOUBLÉ. Llama 3 est très sensible à son premier token : la sortie devenait du charabia (mesuré
// 2026-08-13 sur Llama 3.2 1B, symptôme identique à des poids corrompus, d'où le temps perdu à
// soupçonner la dé-permutation Q/K et les kernels). Même piège pour Ministral 3 avec « <s> ».
export function templateWritesBos(archType: ArchType): boolean {
  return archType === 'llama3' || archType === 'mistral3';
}

// Les ids d'arrêt DÉCLARÉS PAR LE FICHIER lui-même (GGUF : tokenizer.ggml.eos_token_id, et l'id de
// fin de tour du template quand il en désigne un). C'est la source la plus fiable, et elle évite une
// classe entière de bugs : la table par architecture ci-dessous doit être complétée à la main pour
// CHAQUE nouvelle famille, et l'oublier ne casse rien de visible au chargement — le modèle répond,
// puis continue tout seul en inventant le tour suivant (« The capital of France is Paris. user Can
// you tell me… », observé sur SmolLM3 3B, dont l'arch n'avait pas d'entrée ici).
// `skip_special_tokens` masque les marqueurs au détokenizeur, donc le repli textuel (TURN_MARKERS)
// ne les voit pas non plus : sans id, rien n'arrête la génération.
export function declaredStopIds(metadata: Record<string, unknown> | undefined): number[] {
  const ids = new Set<number>();
  for (const key of ['tokenizer.ggml.eos_token_id', 'tokenizer.ggml.eot_token_id', 'tokenizer.ggml.eom_token_id']) {
    const v = metadata?.[key];
    const n = typeof v === 'number' ? v : Number(v);
    if (Number.isFinite(n) && n >= 0) ids.add(n);
  }
  return [...ids];
}

// True when generation should stop: an id declared by the model file, an architecture-specific
// EOS/turn id, or any control marker in the recent decoded tail (`includes`, to catch markers the
// tokenizer didn't flag special).
export function isStopToken(tokenId: number, text: string, archType: ArchType, declaredIds?: number[]): boolean {
  if (declaredIds?.includes(tokenId)) return true;
  // Llama 3.x : <|eot_id|> (fin de tour), <|end_of_text|>, <|eom_id|> (fin de message outillé).
  if ((tokenId === 128009 || tokenId === 128001 || tokenId === 128008) && archType === 'llama3') return true;
  // Ministral 3 (Tekken) : </s> = id 2.
  if (tokenId === 2 && archType === 'mistral3') return true;
  if (tokenId === 1 && (archType === 'gemma' || archType === 'gemma3')) return true;
  if (tokenId === 107 && archType === 'gemma') return true;
  // Gemma 3 : nouveau vocab 262k — <end_of_turn> = 106 (et non 107 comme Gemma 1/2).
  if (tokenId === 106 && archType === 'gemma3') return true;
  if (tokenId === 151645 && (archType === 'qwen' || archType === 'qwen3')) return true;
  if (tokenId === 151643 && (archType === 'qwen' || archType === 'qwen3')) return true;
  // LFM2/LFM2.5 : <|im_end|> = 7, <|endoftext|> = 2 (vocab 65536, ids ChatML propres au modèle).
  if ((tokenId === 7 || tokenId === 2) && archType === 'lfm2') return true;
  // LFM2.5 est entraîné au tool-calling et hallucine des appels d'outil (<|tool_call_start|> = 10,
  // special=false dans son tokenizer → s'afficherait BRUT). Ni le chat ni le SDK n'ont d'outils :
  // on coupe la génération dès que le modèle tente un appel (8 = <|tool_list_start|>, 12 = <|tool_response_start|>).
  if ((tokenId === 8 || tokenId === 10 || tokenId === 12) && archType === 'lfm2') return true;
  // DeepSeek-R1 distill (Qwen2 vocab): <｜end▁of▁sentence｜>.
  if (tokenId === 151643 && archType === 'deepseek') return true;
  // RWKV World : id 0 = <eos>. Le changement de tour (« \nUser: », texte brut) est couvert par
  // TURN_MARKERS ci-dessous.
  if (tokenId === 0 && archType === 'rwkv7') return true;

  return TURN_MARKERS.some((m) => text.includes(m));
}
