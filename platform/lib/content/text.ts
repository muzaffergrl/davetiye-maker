// One-line text normalisation shared by the RSVP server (lib/rsvp/validate.ts: what a guest's answer is
// matched and stored as) and content validation (lib/content/validate.ts: when two choices of a custom
// RSVP question count as the same). Both must use the same rule, or two options that look different to the
// validator become one stored answer. tools/validate_content.py writes the same sets out (CONTROL_RE,
// JS_SPACE_RE); keep them in step.

/** C0/C1 controls except tab and newline, plus bidi overrides/isolates (text spoofing in lists and CSV). */
export const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F‪-‮⁦-⁩]/g;

/** NFC, no control characters, runs of whitespace (JS `\s`) collapsed to one space, trimmed. */
export function normalizeLine(value: string): string {
  return value.normalize('NFC').replace(CONTROL_RE, '').replace(/\s+/g, ' ').trim();
}
