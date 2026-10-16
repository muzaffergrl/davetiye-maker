// Guest reply validation. Input is the parsed JSON body of POST /api/rsvp/<slug>
// (field names = the form's input names, see README "RSVP"):
//
//   name      required, 1..NAME_MAX characters (whitespace collapsed)
//   email     optional; when given it must look like an address
//   attending required: "yes" | "no" (also true / false)
//   guests    attending: integer 1..maxGuests (empty -> 1); not attending: stored as 0
//   message   optional, at most MESSAGE_MAX characters
//   answers   optional {<question id>: "<answer>"} for the couple's custom questions (content
//             rsvp.questions, G051/G128): "choice" = one of its options, "text" = at most ANSWER_MAX
//             characters, "long" = at most LONG_ANSWER_MAX, "yesno" = yes / no (stored "Yes" / "No"),
//             "number" = a whole number 0 … 9999. Questions are for guests who accept: a "no" reply stores
//             no answers. A question marked required (G128) must be answered; others may stay empty.
//             Unknown ids are ignored.
//   G128: content rsvp.required {email, message} makes those fields required for guests.
//   party     optional ["<name of guest 2>", "<name of guest 3>", …] (G069): the names of the other people in
//             an attending reply, each at most PARTY_NAME_MAX characters. Only the first guests − 1 count;
//             empty ones are fine (a name is never required) and are not stored. A "no" stores none.
//   website   honeypot; must be empty (see HONEYPOT_FIELD)
//
// Unknown fields are ignored. Error messages are English and can be shown to guests.
// Errors of an answer are keyed "answer:<id>" (the form's input name, public/rsvp/form.js), errors of a
// party name "party:<n>" (n = the guest's number in the reply: 2, 3, …).
//
// The couple's own replies and corrections in the panel (G069) use the same rules (parseCoupleReply), except that
// a stored answer stays valid when the couple has renamed that option since, and answers to questions they have
// removed since are kept.

import type { RsvpQuestion } from '../content/types.ts';
import type { RsvpAnswer, RsvpInput } from '../data/types.ts';
import { CONTROL_RE, normalizeLine } from '../content/text.ts';
import { ANSWER_MAX, EMAIL_MAX, HONEYPOT_FIELD, LONG_ANSWER_MAX, MESSAGE_MAX, NAME_MAX, PARTY_NAME_MAX } from './config.ts';
import { numberAnswer, QUESTION_TYPES, rsvpFormConfig, yesNoAnswer, type RequirableField } from './form-config.ts';

export type RsvpField = 'name' | 'email' | 'attending' | 'guests' | 'message' | `answer:${string}` | `party:${number}`;

export type ParsedSubmission =
  | { ok: true; value: RsvpInput; spam: boolean }
  | { ok: false; errors: Partial<Record<RsvpField, string>>; spam: boolean };

/** Form field name of a question's answer (also the key of its error). */
export const answerField = (id: string): `answer:${string}` => `answer:${id}`;

/** Form field name of the name of guest `n` (2, 3, …) in a reply (also the key of its error), G069. */
export const partyField = (n: number): `party:${number}` => `party:${n}`;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;

function text(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value !== 'string') return null;
  return value;
}

/** One-line text: NFC, no control characters, runs of whitespace collapsed, trimmed (lib/content/text.ts). */
export function cleanLine(value: unknown): string {
  const s = text(value);
  if (s === null) return '';
  return normalizeLine(s);
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

/** The couple's questions as the form shows them (well-formed ones only; content validation guards the rest). */
export function formQuestions(content: unknown): RsvpQuestion[] {
  const list = (content as { rsvp?: { questions?: unknown } } | null)?.rsvp?.questions;
  if (!Array.isArray(list)) return [];
  return list.filter(
    (q): q is RsvpQuestion =>
      Boolean(q) && typeof q === 'object' && typeof q.id === 'string' && typeof q.label === 'string' && QUESTION_TYPES.includes(q.type),
  );
}

/** Built-in fields the guest must fill in (G128, content rsvp.required). */
export function requiredFields(content: unknown): Record<RequirableField, boolean> {
  return rsvpFormConfig(content).required;
}

/** Answers of an attending guest: {ok: answers in question order} or {errors by "answer:<id>"}. */
function parseAnswers(
  raw: unknown,
  questions: readonly RsvpQuestion[],
  existing: readonly RsvpAnswer[] = [],
  enforceRequired = false,
): { answers: RsvpAnswer[]; errors: Record<string, string> } {
  const answers: RsvpAnswer[] = [];
  const errors: Record<string, string> = {};
  const given = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  for (const q of questions) {
    const field = answerField(q.id);
    const missing = () => {
      if (enforceRequired && q.required === true) errors[field] = q.type === 'choice' || q.type === 'yesno' ? 'Please choose an answer.' : 'Please answer this question.';
    };
    if (!Object.hasOwn(given, q.id) || given[q.id] === null || given[q.id] === undefined) {
      missing();
      continue;
    }
    // A correction by the couple keeps a stored answer as it was (the option may have been renamed since).
    const before = existing.find((a) => a.id === q.id);
    if (q.type === 'yesno') {
      const raw = given[q.id];
      if (typeof raw === 'string' && !raw.trim()) {
        missing();
        continue;
      }
      const value = yesNoAnswer(raw);
      if (value) answers.push({ id: q.id, question: cleanLine(q.label), answer: value });
      else errors[field] = 'Please choose Yes or No.';
    } else if (q.type === 'number') {
      const raw = cleanLine(given[q.id]);
      if (!raw) {
        missing();
        continue;
      }
      const value = numberAnswer(raw);
      if (value !== null) answers.push({ id: q.id, question: cleanLine(q.label), answer: value });
      else errors[field] = 'Please enter a whole number from 0 to 9999.';
    } else if (q.type === 'choice') {
      const value = cleanLine(given[q.id]);
      if (!value) {
        missing();
        continue;
      }
      const match = (q.options ?? []).find((o) => cleanLine(o) === value);
      if (match !== undefined) answers.push({ id: q.id, question: cleanLine(q.label), answer: cleanLine(match) });
      else if (before && cleanLine(before.answer) === value) answers.push({ ...before });
      else errors[field] = 'Please choose one of the options.';
    } else {
      const value = cleanBlock(given[q.id]);
      if (!value) {
        missing();
        continue;
      }
      const max = q.type === 'long' ? LONG_ANSWER_MAX : ANSWER_MAX;
      if ([...value].length > max) errors[field] = `Please keep your answer to ${max} characters or fewer.`;
      else answers.push({ id: q.id, question: cleanLine(q.label), answer: value });
    }
  }
  // Answers to questions removed since stay with the reply (the CSV keeps their column).
  const asked = new Set(questions.map((q) => q.id));
  for (const a of existing) if (!asked.has(a.id)) answers.push({ id: a.id, question: a.question, answer: a.answer });
  return { answers, errors };
}

/** Names of the other people of an attending reply: raw[i] is guest i + 2; only the first guests − 1 count. */
function parseParty(raw: unknown, guests: number): { party: string[]; errors: Record<string, string> } {
  const party: string[] = [];
  const errors: Record<string, string> = {};
  if (!Array.isArray(raw) || guests < 2) return { party, errors };
  raw.slice(0, guests - 1).forEach((value, i) => {
    const name = cleanLine(value);
    if (!name) return;
    if (name.length > PARTY_NAME_MAX) errors[partyField(i + 2)] = `Please keep each name to ${PARTY_NAME_MAX} characters or fewer.`;
    else party.push(name);
  });
  return { party, errors };
}

/**
 * Validates a guest reply. `maxGuests` is the theme's cap (config.themeMaxGuests); `questions` are the
 * couple's custom questions of the published content (formQuestions).
 */
export function parseSubmission(
  body: unknown,
  maxGuests: number,
  questions: readonly RsvpQuestion[] = [],
  required: Partial<Record<RequirableField, boolean>> = {},
): ParsedSubmission {
  return parseReply(body, maxGuests, questions, [], required, true);
}

/**
 * Validates a reply the couple adds in the panel, or their correction of `existing` (G069). Same fields and messages
 * as a guest's reply (a phone reply looks like any other); the honeypot does not apply.
 */
export function parseCoupleReply(
  body: unknown,
  maxGuests: number,
  questions: readonly RsvpQuestion[] = [],
  existing: { answers?: readonly RsvpAnswer[] } | null = null,
): ParsedSubmission {
  // The couple types in what they were told: a required field the guest left out is not theirs to invent (G128).
  const parsed = parseReply(body, maxGuests, questions, existing?.answers ?? [], {}, false);
  return { ...parsed, spam: false } as ParsedSubmission;
}

function parseReply(
  body: unknown,
  maxGuests: number,
  questions: readonly RsvpQuestion[],
  existingAnswers: readonly RsvpAnswer[],
  required: Partial<Record<RequirableField, boolean>>,
  enforceRequired: boolean,
): ParsedSubmission {
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
  } else if (!emailRaw && required.email === true) {
    errors.email = 'Please enter your email address.';
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
  else if (!message && required.message === true) errors.message = 'Please write a note for the couple.';

  // Questions are asked of guests who accept (the theme shows them with the guest count).
  let answers: RsvpAnswer[] = [];
  if (attending === true && (questions.length || existingAnswers.length)) {
    const parsed = parseAnswers(b.answers, questions, existingAnswers, enforceRequired);
    answers = parsed.answers;
    Object.assign(errors, parsed.errors);
  }

  // The names of the other people coming with this guest (G069): optional, only for guests who accept.
  let party: string[] = [];
  if (attending === true && guests > 1) {
    const parsed = parseParty(b.party, guests);
    party = parsed.party;
    Object.assign(errors, parsed.errors);
  }

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
      ...(answers.length ? { answers } : {}),
      ...(party.length ? { party } : {}),
    },
  };
}
