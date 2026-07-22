// Outils locaux (Réglages → Web & outils) — zéro réseau, zéro décision demandée au modèle (le
// tool-calling est trop peu fiable sous ~3B, cf. docs/mcp-feasibility.md) : on DÉTECTE côté CPU,
// on calcule, on injecte le résultat dans le tour courant. Les petits modèles sont notoirement
// mauvais en arithmétique et ignorent la date — deux trous comblés à coût quasi nul.

// ── Calculatrice : évaluateur arithmétique par descente récursive (PAS d'eval()). ──
// Grammaire : expr := term (('+'|'-') term)* ; term := factor (('*'|'/'|'%') factor)* ;
// factor := unary ('^' factor)? (droite-assoc) ; unary := '-' unary | primary ; primary := nombre | '(' expr ')'.
export function evalArithmetic(raw: string): number | null {
  // Normalisation : ×÷ → */, virgule décimale → point, espaces (dont insécables des milliers) ôtés.
  const s = raw.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '.').replace(/[\s  ]/g, '').replace(/=+$/, '');
  if (!s || s.length > 200) return null;
  let i = 0;
  const peek = () => s[i];
  const num = (): number | null => {
    const m = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (!m) return null;
    i += m[0].length;
    return parseFloat(m[0]);
  };
  const primary = (): number | null => {
    if (peek() === '(') { i++; const v = expr(); if (v === null || peek() !== ')') return null; i++; return v; }
    return num();
  };
  const unary = (): number | null => {
    if (peek() === '-') { i++; const v = unary(); return v === null ? null : -v; }
    return primary();
  };
  const factor = (): number | null => {
    const base = unary();
    if (base === null) return null;
    if (peek() === '^') { i++; const e = factor(); return e === null ? null : Math.pow(base, e); }
    return base;
  };
  const term = (): number | null => {
    let v = factor();
    while (v !== null && (peek() === '*' || peek() === '/' || peek() === '%')) {
      const op = s[i++]; const r = factor();
      if (r === null) return null;
      v = op === '*' ? v * r : op === '/' ? v / r : v % r;
    }
    return v;
  };
  const expr = (): number | null => {
    let v = term();
    while (v !== null && (peek() === '+' || peek() === '-')) {
      const op = s[i++]; const r = term();
      if (r === null) return null;
      v = op === '+' ? v + r : v - r;
    }
    return v;
  };
  const v = expr();
  return i === s.length && v !== null && Number.isFinite(v) ? v : null;
}

export interface CalcResult { expr: string; value: number }

// Repère les expressions arithmétiques d'un message et les évalue. Anti-faux-positifs : il faut un
// opérateur « intentionnel » (× * ÷ % ^, parenthèses, ‘=’ final ou ≥2 opérateurs) — « 2-3 jours » ou
// une date « 06/07/2026 » ne déclenchent pas.
export function detectCalcs(text: string, max = 3): CalcResult[] {
  const out: CalcResult[] = [];
  const seen = new Set<string>();
  const re = /[\d(][\d\s  .,+\-*/×÷%^()]*[\d)]\s*=?/g;
  for (const m of text.matchAll(re)) {
    const raw = m[0].trim();
    if (out.length >= max) break;
    if (seen.has(raw)) continue;
    if (/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/.test(raw)) continue;         // date
    if (/\d+:\d+/.test(text.slice(Math.max(0, m.index! - 1), m.index! + raw.length + 1))) continue; // heure
    const ops = (raw.match(/[+\-*/×÷%^]/g) || []).length;
    const intentional = /[*×÷%^(]/.test(raw) || /=$/.test(raw) || ops >= 2;
    if (ops === 0 || !intentional) continue;
    const value = evalArithmetic(raw);
    if (value === null) continue;
    const expr = raw.replace(/=+$/, '').trim();
    if (!/[+\-*/×÷%^]/.test(expr)) continue;                          // un nombre seul après nettoyage
    seen.add(raw);
    out.push({ expr, value });
  }
  return out;
}

// Format compact d'un résultat (évite le 0.30000000000000004 flottant).
export function formatCalc(value: number): string {
  const rounded = Math.round(value * 1e9) / 1e9;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

// « dimanche 6 juillet 2026 » — stable sur la journée (le préfixe KV du system prompt survit).
export function currentDateLine(locale: 'fr' | 'en'): string {
  return new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
