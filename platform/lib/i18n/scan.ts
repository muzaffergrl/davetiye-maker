// G144: finds the translatable texts in source code — the string literals of t('…'), tn(n, '…', '…') and msg('…')
// (plain quotes, or a template literal without ${…}). tests/i18n.test.ts checks every dictionary has them; a text added
// later (G139, G142 …) without its translations is reported there and shows in English until it is added.

const STR = String.raw`'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|\x60(?:\\.|[^\x60\\$])*\x60`;
const CALL_T = new RegExp(String.raw`(?<![\w.$])(?:t|msg)\(\s*(${STR})`, 'g');
const CALL_TN = new RegExp(String.raw`(?<![\w.$])tn\(\s*[^,()]+(?:\([^()]*\))?\s*,\s*(${STR})\s*,\s*(${STR})`, 'g');

export function unquote(lit: string): string {
  const body = lit.slice(1, -1);
  return body.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/gs, (_m, e: string) => {
    if (e[0] === 'u') return String.fromCodePoint(parseInt(e.replace(/[u{}]/g, ''), 16));
    if (e[0] === 'x') return String.fromCharCode(parseInt(e.slice(1), 16));
    return ({ n: '\n', t: '\t', r: '\r', '0': '\0' } as Record<string, string>)[e] ?? e;
  });
}

/** The keys a source file uses. */
export function scanSource(code: string): string[] {
  const out = new Set<string>();
  for (const m of code.matchAll(CALL_T)) out.add(unquote(m[1]));
  for (const m of code.matchAll(CALL_TN)) out.add(`${unquote(m[1])}|${unquote(m[2])}`);
  out.delete('');
  return [...out];
}
