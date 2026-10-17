// "Add a meal choice question to RSVP" (G138): a suggested choice question built from the couple's menu, added through
// the RSVP question system (G128) only when they tap it. Pure; bundled into the panel.

import type { ContentRecord, RsvpQuestion } from '../content/types.ts';
import { CONTENT_LIMITS } from '../content/limits.ts';
import { newQuestionId } from './model.ts';

/** Choices when the menu names no main dishes. */
export const DEFAULT_MEAL_CHOICES = ['Meat', 'Fish', 'Vegetarian'] as const;
export const MEAL_QUESTION_LABEL = 'Meal choice';

const MEAL_WORDS = /\b(meal|menu|entr[ée]e|dinner|main course|dish)/i;
const MAIN_WORDS = /\b(main|entr[ée]e|dinner)/i;

/** The question the couple already has for the meal (by its words), if any. */
export function existingMealQuestion(content: Pick<ContentRecord, 'rsvp'>): RsvpQuestion | null {
  return (content.rsvp?.questions ?? []).find((q) => MEAL_WORDS.test(q.label)) ?? null;
}

/** Choices for the question: the dishes under a "Main" heading (else the menu's only heading), else the defaults. */
export function mealChoices(content: Pick<ContentRecord, 'meal'>): string[] {
  const courses = (content.meal?.courses ?? []).filter((c) => c && Array.isArray(c.items));
  const main = courses.find((c) => MAIN_WORDS.test(c.title ?? '')) ?? (courses.length === 1 ? courses[0] : null);
  const seen = new Set<string>();
  const dishes = (main?.items ?? [])
    .map((d) => (typeof d === 'string' ? d.trim() : ''))
    .filter((d) => d && [...d].length <= CONTENT_LIMITS.questionOption && !seen.has(d.toLowerCase()) && seen.add(d.toLowerCase()))
    .slice(0, CONTENT_LIMITS.questionOptions);
  return dishes.length >= 2 ? dishes : [...DEFAULT_MEAL_CHOICES];
}

/**
 * Whether the shortcut can add a question now: 'ok', 'exists' (a meal question is there already) or 'full' (the form holds
 * its most questions).
 */
export function mealQuestionState(content: Pick<ContentRecord, 'rsvp'>): 'ok' | 'exists' | 'full' {
  if (existingMealQuestion(content)) return 'exists';
  if ((content.rsvp?.questions ?? []).length >= CONTENT_LIMITS.rsvpQuestions) return 'full';
  return 'ok';
}

/** Adds the meal choice question to the draft (no-op unless mealQuestionState is 'ok'). Returns true when added. */
export function addMealQuestion(c: ContentRecord): boolean {
  if (mealQuestionState(c) !== 'ok') return false;
  const list = c.rsvp?.questions ?? [];
  const q: RsvpQuestion = { id: newQuestionId(list.map((x) => x.id)), label: MEAL_QUESTION_LABEL, type: 'choice', options: mealChoices(c) };
  c.rsvp = { ...c.rsvp, questions: [...list, q] };
  return true;
}
