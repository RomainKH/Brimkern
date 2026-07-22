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

// Build the model-ready prompt string from the chat history, per architecture chat template.
export function formatPrompt(chatMsgs: { role: string; content: string }[], archType: ArchType, systemText: string): string {
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

  // Qwen3 : même template ChatML que Qwen2 ; le raisonnement (<think>) est natif — le budget de
  // réflexion de la page (préfixe vide pour 'off', clôture forcée au budget) s'applique tel quel.
  // LFM2/LFM2.5 : ChatML identique (le BOS <|startoftext|> est ajouté par le tokenizer à l'encode).
  if (archType === 'qwen' || archType === 'qwen3' || archType === 'lfm2') {
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
  } else if (archType === 'gemma') {
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

// True when generation should stop: an architecture-specific EOS/turn id, or any control marker in
// the recent decoded tail (`includes`, to catch markers the tokenizer didn't flag special).
export function isStopToken(tokenId: number, text: string, archType: ArchType): boolean {
  // Llama 3.x : <|eot_id|> (fin de tour), <|end_of_text|>, <|eom_id|> (fin de message outillé).
  if ((tokenId === 128009 || tokenId === 128001 || tokenId === 128008) && archType === 'llama3') return true;
  // Ministral 3 (Tekken) : </s> = id 2.
  if (tokenId === 2 && archType === 'mistral3') return true;
  if (tokenId === 1 && archType === 'gemma') return true;
  if (tokenId === 107 && archType === 'gemma') return true;
  if (tokenId === 151645 && (archType === 'qwen' || archType === 'qwen3')) return true;
  if (tokenId === 151643 && (archType === 'qwen' || archType === 'qwen3')) return true;
  // LFM2/LFM2.5 : <|im_end|> = 7, <|endoftext|> = 2 (vocab 65536, ids ChatML propres au modèle).
  if ((tokenId === 7 || tokenId === 2) && archType === 'lfm2') return true;
  // DeepSeek-R1 distill (Qwen2 vocab): <｜end▁of▁sentence｜>.
  if (tokenId === 151643 && archType === 'deepseek') return true;

  return TURN_MARKERS.some((m) => text.includes(m));
}
