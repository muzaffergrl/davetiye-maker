// Content length/count limits as plain numbers — a tiny module the browser can import (app/start/StartForm.tsx via
// lib/claim/fields.ts, the panel) without the whole schema and validator. The schema stays the single source:
// lib/content/validate.ts reads the same limits from it (SCHEMA_LIMITS) and tests/g055-review.test.ts asserts that the
// two are equal, so a schema change without this file fails `npm test`.
// G055 (docs/11 §14 #10, the integrator's default decision, reversible): names <= 40, the names line <= 85 (two names +
// " & " / " and "), venue name <= 80, schedule <= 10 rows. G051 lists as before.

export const CONTENT_LIMITS = {
  name: 40,
  fullName: 40,
  nameDisplay: 85,
  venueName: 80,
  scheduleItems: 10,
  faqItems: 12,
  faqQuestion: 120,
  faqAnswer: 600,
  rsvpQuestions: 10,
  questionLabel: 120,
  questionOptions: 8,
  questionOption: 60,
  // G075: thank-you mode (title in the design's script type on a small card; message ≤ 400 like a story text)
  thankYouTitle: 60,
  thankYouMessage: 400,
} as const;

export type ContentLimit = keyof typeof CONTENT_LIMITS;
