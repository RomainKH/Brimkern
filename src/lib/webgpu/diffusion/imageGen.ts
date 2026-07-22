// Text→image generator interface for the chat.
//
// The chat only ever calls `ImageGenerator.generate(prompt, onProgress, …)` — it doesn't care what
// pipeline is behind it (today: the real SD-Turbo in sdturbo.ts). Keeping the interface in its own
// module lets page.tsx type against it without pulling the heavy diffusion code into the bundle
// (the pipeline itself is lazy-imported). See docs/image-gen-feasibility.md.

// `url` = full PNG (kept in memory). `thumb` = tiny blurred preview (persisted instead of the full
// image → storage stays small). `seed` lets us regenerate the EXACT same image on demand (click-to-
// reveal), so the conversation never has to store the heavy pixels. See ChatMessages reveal flow.
// `full` (img2img seulement) = data URL PNG persistable : une image affinée dépend des PIXELS
// source, elle n'est PAS régénérable depuis prompt+seed comme le txt2img — on la garde entière.
export interface ImageResult { url: string; w: number; h: number; thumb: string; seed: number; full?: string }
// `latentSize` = latent side (16/32/64 → 128/256/512px image), chosen PER GENERATION (quality selector
// in the composer). Reveal passes the original image's w/8 so a regeneration matches exactly.
// `duty` = target GPU duty cycle in (0,1] — thermal throttle; the pipeline sleeps proportionally to
// measured GPU busy time so average power scales with duty. 1 = full throttle.
export interface ImageGenerator {
  name: string;
  placeholder: boolean;
  generate: (prompt: string, onProgress?: (step: string) => void, seed?: number, latentSize?: number, duty?: number) => Promise<ImageResult>;
  // Vrai img2img : repart des PIXELS de `initUrl` (blob/data URL d'une image générée), encodés en
  // latent (TAESD encodeur, ~5 Mo chargés à la 1re utilisation) puis re-bruités à σ(strength) —
  // strength ∈ (0,1] : 0.3 = retouche légère, 0.55 = affinage, 1 = ignore la source. La taille de
  // sortie suit la source (pas le sélecteur de qualité). Optionnel : absent sur un vieux générateur.
  generateImg2Img?: (prompt: string, initUrl: string, strength: number, onProgress?: (step: string) => void, seed?: number, duty?: number) => Promise<ImageResult>;
  // Free the pipeline's GPU resources (device destroy — ~1 GB of resident weights). MUST be called
  // when leaving image mode (unload, or loading an LLM over it); the generator is dead afterwards.
  dispose?: () => void;
}
