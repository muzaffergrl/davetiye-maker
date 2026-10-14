// Content record validation — TypeScript mirror of tools/validate_content.py.
//
// 1. Schema check against CONTENT_SCHEMA (verbatim copy of docs/03_URUN_ICERIK_SEMASI.json),
//    using the small JSON-Schema subset that file uses.
// 2. Business rules (only when the schema check passes, exactly like the Python tool).
//
// Deliberate differences from the Python tool (stricter, documented in README):
//  - `format: date` is enforced as strict YYYY-MM-DD with a real calendar date.
//  - `format: uri` is enforced as an absolute http(s) URL (the site only links http/https).
//  - Unknown IANA time zone -> warning (the countdown cannot be computed).
// Messages are English because the buyer-facing panel shows them. Paths use dots
// (partners.0.display_name), the same notation as theme `data-field` markers.

import { CONTENT_SCHEMA } from './schema.ts';
import { CONTENT_LIMITS } from './limits.ts';
import { isValidTimeZone, parseIsoDate } from './format.ts';
import { safeHttpUrl } from '../theme/urls.ts';
import { normalizeLine } from './text.ts';

export type IssueLevel = 'error' | 'warning';

export interface ValidationIssue {
  level: IssueLevel;
  code: string;
  path: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface ValidateOptions {
  /**
   * Platform site (K24, G039): the website and its RSVP form are the platform itself, so an empty
   * urls.website / urls.rsvp_form is expected and the `customer_url_missing` warnings are not raised.
   * Errors are never affected (a record valid without the option is valid with it, and vice versa).
   */
  platform?: boolean;
}

/** URL fields that the platform itself provides for its sites (no buyer input needed). */
export const PLATFORM_PROVIDED_URLS = ['website', 'rsvp_form'] as const;

/** Fictional / third-party targets that appeared in older visuals (same list as the Python tool). */
export const FORBIDDEN_STRINGS = ['averyandjordan.com', '1234 Celebration Lane'];

// Limits read from the schema (single source). The panel and /start use CONTENT_LIMITS (lib/content/limits.ts: plain
// numbers, small enough for the browser bundle); tests assert CONTENT_LIMITS deep-equals SCHEMA_LIMITS.
// G055 (docs/11 §14 #10, default decision of the integrator, reversible): names <= 40, the names line <= 85
// (two names + " & " / " and "), venue name <= 80, schedule <= 10 rows. G051 lists as before.
const P = CONTENT_SCHEMA.properties;
const QUESTION = P.rsvp.properties.questions.items.properties;
export const SCHEMA_LIMITS = {
  name: P.partners.items.properties.display_name.maxLength,
  fullName: P.partners.items.properties.full_name.maxLength,
  nameDisplay: P.name_display.maxLength,
  venueName: P.venue.properties.name.maxLength,
  scheduleItems: P.schedule.maxItems,
  faqItems: P.faq.maxItems,
  faqQuestion: P.faq.items.properties.q.maxLength,
  faqAnswer: P.faq.items.properties.a.maxLength,
  rsvpQuestions: P.rsvp.properties.questions.maxItems,
  questionLabel: QUESTION.label.maxLength,
  questionOptions: QUESTION.options.maxItems,
  questionOption: QUESTION.options.items.maxLength,
  thankYouTitle: P.thank_you.properties.title.maxLength,
  thankYouMessage: P.thank_you.properties.message.maxLength,
} as const;

export { CONTENT_LIMITS };

/** Form of an RSVP question id (business rule, same regex in tools/validate_content.py). */
export const QUESTION_ID_RE = /^[a-z0-9][a-z0-9_-]{0,23}$/;

// "Blank" = only these characters (written out so the Python tool strips exactly the same set:
// JS \s and Python str.isspace() differ on a few code points).
const WS = '\\t\\n\\v\\f\\r \\x1c-\\x1f\\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff';
const BLANK_RE = new RegExp(`^[${WS}]*$`);

/** True for a missing value or text made only of whitespace. */
export function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || BLANK_RE.test(value);
}

/**
 * Duplicate check of a question's choices: the RSVP server's own matching rule (normalizeLine: NFC, no control
 * characters, inner whitespace collapsed, trimmed — lib/rsvp/validate.ts stores a guest's pick as that), compared
 * case-insensitively. Looser than this, "Fish  Pie" and "Fish Pie" would both pass yet be one stored answer.
 */
function choiceKey(value: string): string {
  return normalizeLine(value).toLowerCase();
}

type Schema = { readonly [key: string]: unknown };

function jsonType(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v; // string | boolean | object | undefined | ...
}

function typeMatches(actual: string, expected: string): boolean {
  return actual === expected || (expected === 'number' && actual === 'integer');
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function joinPath(base: string, key: string | number): string {
  return base ? `${base}.${key}` : String(key);
}

function checkSchema(schema: Schema, value: unknown, path: string, out: ValidationIssue[]): void {
  const err = (code: string, message: string) => out.push({ level: 'error', code, path: path || '(root)', message });
  const actual = jsonType(value);

  const type = schema.type as string | readonly string[] | undefined;
  if (type !== undefined) {
    const allowed = Array.isArray(type) ? type : [type as string];
    if (!allowed.some((t) => typeMatches(actual, t))) {
      err('schema_type', `Expected ${allowed.join(' or ')}, got ${actual}.`);
      return;
    }
  }

  const enumValues = schema.enum as readonly unknown[] | undefined;
  if (enumValues && !enumValues.includes(value as never)) {
    err('schema_enum', `Must be one of: ${enumValues.map((e) => JSON.stringify(e)).join(', ')}.`);
    return;
  }

  if (typeof value === 'string') {
    const length = [...value].length;
    if (typeof schema.minLength === 'number' && length < schema.minLength) {
      err('schema_min_length', `Must be at least ${schema.minLength} character(s).`);
    }
    if (typeof schema.maxLength === 'number' && length > schema.maxLength) {
      err('schema_max_length', `Must be at most ${schema.maxLength} characters.`);
    }
    if (typeof schema.pattern === 'string' && !new RegExp(schema.pattern, 'u').test(value)) {
      err('schema_pattern', schema.pattern.includes(':') ? 'Use 24-hour time, e.g. 16:30.' : 'Invalid format.');
    }
    if (schema.format === 'date' && !parseIsoDate(value)) {
      err('schema_date', 'Use a real date in YYYY-MM-DD form.');
    }
    if (schema.format === 'uri' && !safeHttpUrl(value)) {
      err('schema_uri', 'Must be a full web address starting with https:// or http://.');
    }
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === 'number' && value.length < schema.minItems) {
      err('schema_min_items', `Needs at least ${schema.minItems} item(s).`);
    }
    if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) {
      err('schema_max_items', `At most ${schema.maxItems} item(s).`);
    }
    const items = schema.items as Schema | undefined;
    if (items) value.forEach((item, i) => checkSchema(items, item, joinPath(path, i), out));
  }

  if (isPlainObject(value)) {
    const props = (schema.properties ?? {}) as Record<string, Schema>;
    for (const key of (schema.required ?? []) as readonly string[]) {
      if (!Object.hasOwn(value, key)) {
        out.push({ level: 'error', code: 'schema_required', path: joinPath(path, key), message: 'This field is required.' });
      }
    }
    for (const [key, v] of Object.entries(value)) {
      if (Object.hasOwn(props, key)) {
        checkSchema(props[key], v, joinPath(path, key), out);
      } else if (schema.additionalProperties === false) {
        out.push({ level: 'error', code: 'schema_unknown_field', path: joinPath(path, key), message: 'Unknown field.' });
      }
    }
  }
}

/** Schema-only check (no business rules). */
export function schemaIssues(record: unknown): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  checkSchema(CONTENT_SCHEMA as unknown as Schema, record, '', out);
  return out;
}

function ruleIssues(record: Record<string, any>, opts: ValidateOptions): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  const error = (code: string, path: string, message: string) => out.push({ level: 'error', code, path, message });
  const warning = (code: string, path: string, message: string) => out.push({ level: 'warning', code, path, message });

  const raw = JSON.stringify(record);
  for (const s of FORBIDDEN_STRINGS) {
    if (raw.includes(s)) error('forbidden_string', '(root)', `Contains a fictional/third-party target: "${s}".`);
  }

  const event = parseIsoDate(record.date);
  const deadline = parseIsoDate(record.rsvp?.deadline);
  if (!event || !deadline) {
    error('date_unreadable', event ? 'rsvp.deadline' : 'date', 'Date could not be read.');
  } else if (record.rsvp.deadline >= record.date) {
    error('rsvp_deadline_not_before_event', 'rsvp.deadline', 'The RSVP deadline must be before the event date.');
  }

  const schedule: Array<Record<string, any>> = Array.isArray(record.schedule) ? record.schedule : [];
  const times = schedule.map((s) => s.time);
  if (times.some((t, i) => i > 0 && t < times[i - 1])) {
    warning('schedule_not_chronological', 'schedule', 'Schedule times are not in chronological order.');
  }
  if (schedule.length && schedule[0].time !== record.ceremony_time) {
    warning('schedule_first_not_ceremony', 'schedule.0.time', 'The first schedule time differs from the ceremony time.');
  }

  const names: string[] = (record.partners ?? []).map((p: { display_name: string }) => p.display_name);
  const display: string = record.name_display ?? '';
  for (const n of names) {
    if (!display.includes(n)) error('name_display_missing_partner', 'name_display', `"${display}" does not contain "${n}".`);
  }
  const initials: string = record.initials ?? '';
  for (const n of names) {
    if (n && !initials.includes(n[0].toUpperCase())) {
      warning('initials_missing_letter', 'initials', `Monogram "${initials}" does not contain the initial "${n[0]}".`);
    }
  }

  const urls: Record<string, string | null> = record.urls ?? {};
  if (record.record_kind === 'demo') {
    const filled = Object.entries(urls).filter(([, v]) => v).map(([k]) => k);
    if (filled.length) {
      error('demo_url_not_null', 'urls', `A demo record must keep real URLs null: ${filled.join(', ')}.`);
    }
  } else if (!opts.platform) {
    for (const k of PLATFORM_PROVIDED_URLS) {
      if (!urls[k]) warning('customer_url_missing', `urls.${k}`, `urls.${k} is empty — buttons/QR have no target.`);
    }
  }

  const blocks: Record<string, boolean> = record.optional_blocks ?? {};
  if (blocks.registry && !urls.registry && record.record_kind !== 'demo') {
    warning('registry_without_url', 'urls.registry', 'The registry section is on but there is no registry link.');
  }
  if (blocks.dress_code && !record.dress_code) {
    warning('dress_code_empty', 'dress_code', 'The dress code section is on but the dress code is empty.');
  }

  // FAQ (G051): a blank question or answer would show guests an empty line.
  const faq: Array<Record<string, unknown>> = Array.isArray(record.faq) ? record.faq : [];
  faq.forEach((item, i) => {
    if (isBlank(item.q)) error('faq_question_empty', `faq.${i}.q`, 'Please write the question.');
    if (isBlank(item.a)) error('faq_answer_empty', `faq.${i}.a`, 'Please write the answer.');
  });
  if (blocks.faq && !faq.length) {
    warning('faq_empty', 'faq', 'The questions & answers section is on but has no questions yet.');
  }

  // Custom RSVP questions (G051): stable ids (answers are stored under them), a readable question,
  // "choice" with at least two different choices, "text" without choices.
  const questions: Array<Record<string, any>> = Array.isArray(record.rsvp?.questions) ? record.rsvp.questions : [];
  const ids = new Set<string>();
  questions.forEach((q, i) => {
    const at = `rsvp.questions.${i}`;
    if (!QUESTION_ID_RE.test(q.id)) error('rsvp_question_id', `${at}.id`, 'The question id may only use a-z, 0-9, "-" and "_".');
    else if (ids.has(q.id)) error('rsvp_question_duplicate_id', `${at}.id`, 'Two questions have the same id.');
    ids.add(q.id);
    if (isBlank(q.label)) error('rsvp_question_label_empty', `${at}.label`, 'Please write the question.');
    const options: string[] = Array.isArray(q.options) ? q.options : [];
    if (q.type === 'choice') {
      options.forEach((o, j) => {
        if (isBlank(o)) error('rsvp_question_option_empty', `${at}.options.${j}`, 'Please write this choice or remove it.');
      });
      const filled = options.filter((o) => !isBlank(o)).map(choiceKey);
      if (filled.length < 2) error('rsvp_question_options_missing', `${at}.options`, 'Add at least two choices.');
      else if (new Set(filled).size !== filled.length) error('rsvp_question_option_duplicate', `${at}.options`, 'Each choice must be different.');
    } else if (options.length) {
      error('rsvp_question_text_options', `${at}.options`, 'A short-answer question has no choices.');
    }
  });

  if (!isValidTimeZone(record.timezone)) {
    warning('timezone_invalid', 'timezone', `Unknown time zone "${record.timezone}" — the countdown cannot be computed.`);
  }
  return out;
}

/**
 * Full validation: schema first; business rules only when the schema passes (as in the Python tool).
 * `opts.platform` (panel, platform sites): see ValidateOptions.
 */
export function validateContent(record: unknown, opts: ValidateOptions = {}): ValidationResult {
  const schema = schemaIssues(record);
  const issues = schema.length ? schema : ruleIssues(record as Record<string, any>, opts);
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');
  return { ok: errors.length === 0, errors, warnings };
}
