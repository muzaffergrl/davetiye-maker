// Guest reply validation. Input is the parsed JSON body of POST /api/rsvp/<slug>
// (field names = the form's input names, see README "RSVP"):
//
//   name      required, 1..NAME_MAX characters (whitespace collapsed)
//   email     optional; when given it must look like an address
//   attending required: "yes" | "no" (also true / false)
//   guests    attending: integer 1..maxGuests (empty -> 1); not attending: stored as 0
//   message   optional, at most MESSAGE_MAX characters
//   website   honeypot; must be empty (see HONEYPOT_FIELD)
//
// Unknown fields are ignored. Error messages are English and can be shown to guests.

import type { RsvpInput } from '../data/types.ts';
import { EMAIL_MAX, HONEYPOT_FIELD, MESSAGE_MAX, NAME_MAX } from './config.ts';

export type RsvpField = 'name' | 'email' | 'attending' | 'guests' | 'message';

export type ParsedSubmission =
  | { ok: true; value: RsvpInput; spam: boolean }
  | { ok: false; errors: Partial<Record<RsvpField, string>>; spam: boolean };

// C0/C1 controls except tab and newline, plus bidi overrides/isolates (text spoofing in lists and CSV).
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F‪-‮⁦-⁩]/g;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;

function text(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value !== 'string') return null;
  return value;
}

/** One-line text: NFC, no control characters, runs of whitespace collapsed, trimmed. */
export function cleanLine(value: unknown): string {
  const s = text(value);
  if (s === null) return '';
  return s.normalize('NFC').replace(CONTROL_RE, '').replace(/\s+/g, ' ').trim();
}

/** Multi-line text: NFC, CRLF -> LF, no control characters except tab/newline, trimmed. */
export function cleanBlock(value: unknown): string {
  const s = text(value);
  if (s === null) return '';
  return s.normalize('NFC').replace(/\r\n?/g, '\n').replace(CONTROL_RE, '').replace(/\n{3,}/g, '\n\n').trim();
}

function parseAttending(value: unknown): boolean | null {
  if (value === true || value === false) return value;
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  if (v === 'yes' || v === 'true') return true;
  if (v === 'no' || v === 'false') return false;
  return null;
}

function parseGuests(value: unknown): number | null | 'empty' {
  if (value === undefined || value === null) return 'empty';
  if (typeof value === 'string') {
    const v = value.trim();
    if (v === '') return 'empty';
    if (!/^\d{1,3}$/.test(v)) return null;
    return Number(v);
  }
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  return null;
}

export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const v = body[HONEYPOT_FIELD];
  if (v === undefined || v === null || v === false) return false;
  return typeof v !== 'string' || v.trim() !== '';
}

/** Validates a guest reply. `maxGuests` is the theme's cap (config.themeMaxGuests). */
export function parseSubmission(body: unknown, maxGuests: number): ParsedSubmission {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, errors: { name: 'Please enter your name.' }, spam: false };
  }
  const b = body as Record<string, unknown>;
  const spam = isHoneypotFilled(b);
  const errors: Partial<Record<RsvpField, string>> = {};

  const name = cleanLine(b.name);
  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > NAME_MAX) errors.name = `Please keep your name to ${NAME_MAX} characters or fewer.`;

  const emailRaw = cleanLine(b.email);
  if (emailRaw && (emailRaw.length > EMAIL_MAX || !EMAIL_RE.test(emailRaw))) {
    errors.email = 'Please check your email address.';
  }

  const attending = parseAttending(b.attending);
  if (attending === null) errors.attending = 'Please let us know if you can attend.';

  let guests = 0;
  if (attending === true) {
    const g = parseGuests(b.guests);
    if (g === 'empty') guests = 1;
    else if (g === null || g < 1 || g > maxGuests) errors.guests = `Please enter a number of guests from 1 to ${maxGuests}.`;
    else guests = g;
  }

  const message = cleanBlock(b.message);
  if (message.length > MESSAGE_MAX) errors.message = `Please keep your message to ${MESSAGE_MAX} characters or fewer.`;

  if (Object.keys(errors).length) return { ok: false, errors, spam };
  return {
    ok: true,
    spam,
    value: {
      name,
      email: emailRaw ? emailRaw : null,
      attending: attending as boolean,
      guests,
      message: message || null,
    },
  };
}
