// Small shared bits for the chat composer, factored out of page.tsx so <Composer> and the page can
// both import them without a circular dependency.

// Soft warning threshold (tokens). Past this a small local model loses coherence and prefill slows
// (O(n²) attention) — we surface a non-blocking notice, we don't truncate.
export const CONTEXT_SOFT_CAP = 4096;

// Cheap char-based token estimate for the composer's counter (no tokenizer round-trip).
export const approxTokens = (text: string) => Math.ceil((text || '').length / 4);

// A long paste collapses into one of these chips instead of flooding the textarea.
export interface PastedAttachment { id: string; label: string; content: string; }
