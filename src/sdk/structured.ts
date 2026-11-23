// Sortie JSON structurée pour petits modèles locaux : description compacte du schéma dans le
// prompt, extraction tolérante (blocs ```json ou texte autour), validation déterministe contre le
// schéma, et une passe de réparation ciblée si un champ manque ou a le mauvais type.

export interface JsonSchema {
  type?: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: Array<string | number | boolean | null>;
}

/** Extrait le premier objet ou tableau JSON équilibré d'une sortie brute du modèle. */
export function extractJson(raw: string): string | null {
  const s = raw.trim();
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const src = fenced ? fenced[1].trim() : s;
  const start = src.search(/[\[{]/);
  if (start === -1) return null;
  const open = src[start];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

/** Valide une valeur JSON contre un sous-ensemble JsonSchema. Rend la liste des erreurs (vide = OK). */
export function validateJsonSchema(value: unknown, schema: JsonSchema, path = '$'): string[] {
  const errs: string[] = [];
  if (schema.enum && !schema.enum.some((v) => Object.is(v, value))) {
    errs.push(`${path}: expected one of ${JSON.stringify(schema.enum)}, got ${JSON.stringify(value)}`);
    return errs;
  }
  if (schema.type) {
    const ok =
      (schema.type === 'null' && value === null)
      || (schema.type === 'boolean' && typeof value === 'boolean')
      || (schema.type === 'string' && typeof value === 'string')
      || (schema.type === 'number' && typeof value === 'number' && Number.isFinite(value))
      || (schema.type === 'integer' && typeof value === 'number' && Number.isInteger(value))
      || (schema.type === 'array' && Array.isArray(value))
      || (schema.type === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value));
    if (!ok) {
      errs.push(`${path}: expected ${schema.type}, got ${value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value}`);
      return errs;
    }
  }
  if (schema.type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    for (const k of schema.required ?? []) {
      if (!(k in obj) || obj[k] === undefined) errs.push(`${path}.${k}: missing required field`);
    }
    if (schema.properties) {
      for (const [k, sub] of Object.entries(schema.properties)) {
        if (k in obj && obj[k] !== undefined) errs.push(...validateJsonSchema(obj[k], sub, `${path}.${k}`));
      }
    }
  }
  if (schema.type === 'array' && Array.isArray(value) && schema.items) {
    value.forEach((item, idx) => errs.push(...validateJsonSchema(item, schema.items!, `${path}[${idx}]`)));
  }
  return errs;
}

/** Formate un schéma JSON en consigne système concise, lisible par un petit modèle (0.6B–4B). */
export function formatJsonSystem(schema: JsonSchema, baseSystem?: string, lang: 'fr' | 'en' = 'en'): string {
  const spec = JSON.stringify(schema);
  const rule = lang === 'fr'
    ? `Réponds UNIQUEMENT par un JSON valide respectant strictement ce schéma (aucun texte avant ni après, aucun bloc markdown) :\n${spec}`
    : `Reply ONLY with valid JSON strictly matching this schema (no text before or after, no markdown fences):\n${spec}`;
  return baseSystem ? `${baseSystem.trim()}\n\n${rule}` : rule;
}

export interface JsonResult<T = unknown> {
  data: T;
  raw: string;
  attempts: number;
}

/** Exécute une génération JSON avec validation et réparation automatique via un runner `ask`. */
export async function runStructuredJson<T = unknown>(
  ask: (prompt: string) => Promise<string>,
  prompt: string,
  schema: JsonSchema,
  opts: { retries?: number; lang?: 'fr' | 'en' } = {},
): Promise<JsonResult<T>> {
  const maxAttempts = Math.max(1, (opts.retries ?? 1) + 1);
  let lastRaw = '';
  let lastErr = '';
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const turn = attempt === 1
      ? prompt
      : opts.lang === 'fr'
        ? `Ta réponse précédente n'était pas valide (${lastErr}). Corrige et rends UNIQUEMENT le JSON valide.`
        : `Your previous reply was invalid (${lastErr}). Fix it and return ONLY valid JSON.`;
    lastRaw = await ask(turn);
    const extracted = extractJson(lastRaw);
    if (!extracted) {
      lastErr = 'no JSON object or array found';
      continue;
    }
    try {
      const parsed = JSON.parse(extracted);
      const errs = validateJsonSchema(parsed, schema);
      if (errs.length === 0) return { data: parsed as T, raw: lastRaw, attempts: attempt };
      lastErr = errs.join('; ');
    } catch (e: any) {
      lastErr = String(e?.message || 'invalid JSON syntax');
    }
  }
  throw new Error(`Brimkern.generateJson failed after ${maxAttempts} attempt(s): ${lastErr}`);
}
