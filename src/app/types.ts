// Shared UI types for the chat app (imported by the page and its hooks/components).

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timings?: {
    // Diagnostic bar: precision · KV format · sampling path · KV prefix reuse (self-documenting
    // field tests — mobile has no easy console).
    info?: string;
    prompt_tokens: number;
    prompt_time_ms: number;
    prompt_speed_ts: number;
    decode_tokens: number;
    decode_time_ms: number;
    decode_speed_ts: number;
    total_time_ms: number;
  };
  isError?: boolean;
  // Image-generation result (text→image models). When set, the bubble renders the image instead of
  // markdown text. `url` = full PNG (in memory; absent after reload → show the blurred `thumb` with a
  // click-to-reveal that regenerates from `prompt`+`seed`). Only thumb/prompt/seed/w/h are persisted.
  // `full` (img2img) : data URL PNG persistée — une image affinée dépend des pixels source, elle
  // n'est pas régénérable depuis prompt+seed comme le txt2img (pas de reveal, on la garde entière).
  image?: { url?: string; w: number; h: number; thumb?: string; prompt?: string; seed?: number; revealing?: boolean; full?: string };
}
