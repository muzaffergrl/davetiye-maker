// The reply form's field set (G128): which built-in fields are required, the couple's own questions with their type and
// required flag. One reading of content.rsvp for every user of it: the server's validation (validate.ts), the guest form
// script (site-data "rsvp_form", lib/theme/engine.ts -> public/rsvp/form.js), the panel's field editor and the Excel /
// Google Sheets / CSV columns (table.ts). Pure, no Node imports (the panel bundles it).
//
// Older records (G051) have only "choice" and "text" questions and no required flags: they read as before (every
// question optional, email and note optional).

import type { RsvpQuestion, RsvpQuestionType } from '../content/types.ts';

export const QUESTION_TYPES: readonly RsvpQuestionType[] = ['choice', 'text', 'long', 'yesno', 'number'];

/** Largest whole number a "number" question takes (0 … NUMBER_ANSWER_MAX). */
export const NUMBER_ANSWER_MAX = 9999;

/** The two answers of a "yes / no" question, as guests see and the replies store them. */
export const YES_NO_OPTIONS = ['Yes', 'No'] as const;

/** Built-in fields the couple can make required (name and attending always are; the guest count always has a value). */
export const REQUIRABLE_FIELDS = ['email', 'message'] as const;
export type RequirableField = (typeof REQUIRABLE_FIELDS)[number];

export interface FormQuestion {
  id: string;
  label: string;
  type: RsvpQuestionType;
  /** Choices of a "choice" question; Yes / No of a "yesno" one; [] otherwise. */
  options: string[];
  required: boolean;
}

export interface RsvpFormConfig {
  required: Record<RequirableField, boolean>;
  questions: FormQuestion[];
}

const isType = (t: unknown): t is RsvpQuestionType => typeof t === 'string' && (QUESTION_TYPES as readonly string[]).includes(t);

/** The couple's well-formed questions (content validation guards the rest), with their options as guests see them. */
export function configQuestions(content: unknown): FormQuestion[] {
  const list = (content as { rsvp?: { questions?: unknown } } | null)?.rsvp?.questions;
  if (!Array.isArray(list)) return [];
  const out: FormQuestion[] = [];
  for (const q of list as Array<Partial<RsvpQuestion> | null>) {
    if (!q || typeof q !== 'object' || typeof q.id !== 'string' || typeof q.label !== 'string' || !isType(q.type)) continue;
    const options = q.type === 'choice' ? (Array.isArray(q.options) ? q.options.filter((o) => typeof o === 'string') : []) : q.type === 'yesno' ? [...YES_NO_OPTIONS] : [];
    out.push({ id: q.id, label: q.label, type: q.type, options, required: q.required === true });
  }
  return out;
}

/** The form's field set of a content record. */
export function rsvpFormConfig(content: unknown): RsvpFormConfig {
  const req = (content as { rsvp?: { required?: Record<string, unknown> } } | null)?.rsvp?.required;
  return {
    required: { email: req?.email === true, message: req?.message === true },
    questions: configQuestions(content),
  };
}

/** What the guest form script needs (no texts: the theme already rendered them). Goes into the page's site-data. */
export function formScriptConfig(content: unknown): {
  required: Record<RequirableField, boolean>;
  questions: Array<{ id: string; type: RsvpQuestionType; required: boolean }>;
} {
  const c = rsvpFormConfig(content);
  return { required: c.required, questions: c.questions.map((q) => ({ id: q.id, type: q.type, required: q.required })) };
}

/** A "yesno" answer as stored ("Yes" / "No"), or null when the value is neither. */
export function yesNoAnswer(value: unknown): 'Yes' | 'No' | null {
  const v = typeof value === 'boolean' ? (value ? 'yes' : 'no') : typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (v === 'yes' || v === 'true') return 'Yes';
  if (v === 'no' || v === 'false') return 'No';
  return null;
}

/** A "number" answer as stored ("12"), or null when it is not a whole number 0 … NUMBER_ANSWER_MAX. */
export function numberAnswer(value: unknown): string | null {
  const v = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : '';
  if (!/^\d{1,4}$/.test(v)) return null;
  const n = Number(v);
  return n <= NUMBER_ANSWER_MAX ? String(n) : null;
}

/** Panel wording of each answer type (the field editor's picker). */
export const QUESTION_TYPE_LABELS: Record<RsvpQuestionType, string> = {
  choice: 'Choices',
  yesno: 'Yes / No',
  text: 'Short answer',
  long: 'Long answer',
  number: 'Number',
};
