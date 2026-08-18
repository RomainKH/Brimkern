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
  // La génération s'est arrêtée sur le PLAFOND de tokens, pas sur une fin de phrase du modèle
  // (256 sur mobile, 512 au bureau). Sans ce marqueur, l'utilisateur voyait une réponse coupée en
  // plein milieu sans savoir pourquoi ni comment la reprendre (retour Romain 2026-08-13) : la bulle
  // affiche donc une note et un bouton « Continuer ».
  truncated?: boolean;
  // Image-generation result (text→image models). When set, the bubble renders the image instead of
  // markdown text. `url` = full PNG (in memory; absent after reload → show the blurred `thumb` with a
  // click-to-reveal that regenerates from `prompt`+`seed`). Only thumb/prompt/seed/w/h are persisted.
  // `full` (img2img) : data URL PNG persistée — une image affinée dépend des pixels source, elle
  // n'est pas régénérable depuis prompt+seed comme le txt2img (pas de reveal, on la garde entière).
  image?: { url?: string; w: number; h: number; thumb?: string; prompt?: string; seed?: number; revealing?: boolean; full?: string };
  // Génération EN COURS (image ou vidéo) : l'instant de départ et la fraction d'avancement que le
  // pipeline remonte. Effacé dès que le média arrive. Jamais persisté (une génération interrompue
  // par un rechargement ne reprend pas).
  gen?: { startedAt: number; frac?: number };
  // Video-generation result (AnimateDiff). `url` est un blob WebM de SESSION (jamais persisté) ;
  // seul le `poster` (1re frame, petite data URL) traverse le rechargement — contrairement à une
  // image, régénérer un clip coûte des minutes, on ne propose donc pas de « révéler ».
  video?: { url?: string; w: number; h: number; poster?: string; prompt?: string; seed?: number; frames?: number; ms?: number };
}
