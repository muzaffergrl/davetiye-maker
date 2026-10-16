// The couple's overview of their replies (G069): one row per person, the answer breakdown of each custom question,
// food and allergy notes in one list, and the days left to reply. Pure functions without Node imports: the server
// sends the overview with the replies (lib/rsvp/couple.ts rsvpSummary -> GET /api/rsvp/<slug>/responses), and the
// panel's guest list, print view and the CSV use the same people rows (replyPeople).
//
// Held replies (unusual volume, guest.ts) are never in the numbers. Custom questions are asked of guests who accept,
// so their breakdowns count the "yes" replies; an answer belongs to the whole reply (one guest answers for the
// party), so the counts are replies, not people — the panel says so.

import { formatDate, isValidTimeZone, parseIsoDate } from '../content/format.ts';
import type { RsvpQuestion } from '../content/types.ts';
import { normalizeLine } from '../content/text.ts';
import type { RsvpAnswer } from '../data/types.ts';
import { rsvpWindow } from './deadline.ts';

/** The reply fields this module reads (a stored record and the panel's entry both have them). */
export interface ReplyLike {
  id: string;
  name: string;
  attending: boolean;
  guests: number;
  message?: string | null;
  answers?: readonly RsvpAnswer[];
  party?: readonly string[];
  createdAt: string;
  held?: boolean;
}

/** One person of a reply: the guest who replied (number 1) or someone coming with them (2, 3, …). */
export interface Person {
  /** Their name; for a person whose name was not given, "Guest 3". */
  name: string;
  /** False: the guest did not give this person's name. */
  named: boolean;
  /** 1 = the guest who replied; 2, 3, … = the people with them. */
  number: number;
  /** The name on the reply (the guest who replied). */
  partyOf: string;
  attending: boolean;
  replyId: string;
}

/** Name shown for a person whose name was not given ("Guest 3"). */
export const unnamedGuest = (number: number) => `Guest ${number}`;

/** Everyone in a reply: the guest who replied, then the named people with them, then the ones without a name. */
export function replyPeople(r: ReplyLike): Person[] {
  const base = { partyOf: r.name, attending: r.attending, replyId: r.id };
  const out: Person[] = [{ name: r.name, named: true, number: 1, ...base }];
  if (!r.attending) return out;
  const size = Math.max(1, Math.floor(r.guests) || 1);
  const names = (r.party ?? []).filter((n) => typeof n === 'string' && n.trim()).slice(0, size - 1);
  for (let number = 2; number <= size; number++) {
    const given = names[number - 2];
    out.push(given ? { name: given, named: true, number, ...base } : { name: unnamedGuest(number), named: false, number, ...base });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Deadline

export interface DeadlineInsight {
  /**
   * open: replies come in · last_day: today is the last day · closed: past the deadline · off: replies on the website are
   * off · thank_you: the website shows its thank-you version (G075), replies are closed · none: no deadline
   */
  state: 'open' | 'last_day' | 'closed' | 'off' | 'thank_you' | 'none';
  /** Whole days from today (in the site's time zone) to the last day to reply: 0 = today, negative = past. Null without a deadline. */
  daysLeft: number | null;
  /** The last day as guests read it: "April 3, 2027". */
  display: string | null;
}

const DAY = 86_400_000;

/** Today's date (YYYY-MM-DD) in a time zone (UTC when it is not a valid zone). */
export function todayIn(timeZone: unknown, now: Date = new Date()): string {
  const tz = isValidTimeZone(timeZone) ? (timeZone as string) : 'UTC';
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Calendar days from `from` to `to` (both YYYY-MM-DD); null when one is unreadable. */
function daysBetween(from: string, to: unknown): number | null {
  const a = parseIsoDate(from);
  const b = parseIsoDate(to);
  if (!a || !b) return null;
  return Math.round((Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day)) / DAY);
}

export function deadlineInsight(content: unknown, now: Date = new Date()): DeadlineInsight {
  const c = (content ?? {}) as { rsvp?: { deadline?: unknown }; timezone?: unknown; locale?: unknown };
  const w = rsvpWindow(content, now);
  const display = formatDate(c.rsvp?.deadline, typeof c.locale === 'string' ? c.locale : 'en-US');
  const daysLeft = daysBetween(todayIn(c.timezone, now), c.rsvp?.deadline);
  if (w.reason === 'disabled') return { state: 'off', daysLeft, display };
  if (w.reason === 'thank_you') return { state: 'thank_you', daysLeft, display };
  if (w.reason === 'deadline') return { state: 'closed', daysLeft, display };
  if (daysLeft === null) return { state: 'none', daysLeft, display };
  return { state: daysLeft <= 0 ? 'last_day' : 'open', daysLeft: Math.max(0, daysLeft), display };
}

/** "Replies close in 12 days" — the deadline in a few words for the couple. */
export function deadlineText(d: DeadlineInsight): string | null {
  switch (d.state) {
    case 'off':
      return 'Replies on the website are off.';
    case 'closed':
      return d.display ? `Replies closed on ${d.display}.` : 'Replies are closed.';
    case 'thank_you':
      return 'Replies are closed: your website shows its thank-you page.';
    case 'last_day':
      return 'Today is the last day to reply.';
    case 'open':
      return d.daysLeft === 1 ? 'Replies close in 1 day.' : `Replies close in ${d.daysLeft} days.`;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------------------------
// Questions

export type QuestionKind = 'yesno' | 'choice' | 'text';

export interface OptionCount {
  value: string;
  /** Replies that chose it. */
  count: number;
  /** Share of the replies that answered (0–100, rounded). */
  percent: number;
  /** Not one of the question's options now (renamed or removed since). */
  old: boolean;
}

export interface QuestionInsight {
  id: string;
  label: string;
  kind: QuestionKind;
  /** False: the couple removed this question since; its answers are still shown. */
  current: boolean;
  /** Replies (counted, coming) that answered. */
  answered: number;
  /** Replies (counted) that said yes: everyone who was asked. */
  asked: number;
  /** Choice / yes-no: every option in the question's order (also the ones nobody chose), then older values. */
  options: OptionCount[];
  /** Written answers, newest first (text questions). */
  answers: Array<{ replyId: string; name: string; answer: string }>;
  /** The question is about food or allergies (its answers are also in the notes list). */
  dietary: boolean;
}

export interface DietaryNote {
  replyId: string;
  name: string;
  text: string;
  /** "answer": the answer to a food / allergy question; "message": the guest's note mentions food or allergies. */
  from: 'answer' | 'message';
  /** The question (from: "answer"). */
  question: string | null;
}

export interface RsvpInsights {
  people: {
    /** People coming (the head count). */
    coming: number;
    /** …of them with a name (the guest who replied always has one). */
    named: number;
    /** …of them without a name ("Guest 3"). */
    unnamed: number;
    /** Replies that said no. */
    notComing: number;
  };
  deadline: DeadlineInsight;
  questions: QuestionInsight[];
  dietary: DietaryNote[];
}

/** Words of a question about food or allergies. ("Meal choice" with options is a menu choice, not a note.) */
const DIET_LABEL_RE = /\b(diet\w*|allerg\w*|intoleran\w*|food|foods|eat|eating|vegan|vegetarian|gluten|kosher|halal)\b/i;
const MEAL_RE = /\bmeals?\b/i;
/** Words in a guest's note that are worth seeing next to the food answers. */
const DIET_TEXT_RE = /\b(allerg\w*|intoleran\w*|vegan|vegetarian|pescatarian|gluten|coeliac|celiac|nut|nuts|peanuts?|dairy|lactose|kosher|halal|shellfish|diet\w*)\b/i;
/** Answers that say "nothing to note". */
const NONE_RE = /^(no|none|nope|nothing|nil|n\/?a|-+|not applicable|no allergies|no dietary (needs|requirements|restrictions)|none,? thanks?( you)?|no,? thanks?( you)?)[.!]*$/i;

const norm = (s: string) => normalizeLine(s).toLowerCase();

/** A question of two options that start with "yes" and "no" ("Yes, please" / "No, thank you"). */
export function isYesNo(options: readonly string[] | undefined): boolean {
  if (!options || options.length !== 2) return false;
  const first = options.map((o) => norm(o).split(/[^a-z]+/)[0]);
  return first.includes('yes') && first.includes('no');
}

export function isDietaryQuestion(label: string, type: 'choice' | 'text'): boolean {
  return DIET_LABEL_RE.test(label) || (type === 'text' && MEAL_RE.test(label));
}

const percentOf = (n: number, of: number) => (of ? Math.round((n / of) * 100) : 0);

/**
 * The overview of a site's replies. `questions` are the custom questions guests see now (the published content's,
 * lib/rsvp/validate.ts formQuestions); `content` gives the deadline, time zone and locale.
 */
export function rsvpInsights(list: readonly ReplyLike[], questions: readonly RsvpQuestion[], content: unknown, now: Date = new Date()): RsvpInsights {
  const counted = list.filter((r) => !r.held);
  const coming = counted.filter((r) => r.attending);
  const newestFirst = [...coming].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  let people = 0;
  let named = 0;
  for (const r of coming) {
    for (const p of replyPeople(r)) {
      people += 1;
      if (p.named) named += 1;
    }
  }

  // Current questions in their order, then removed ones that still have answers.
  const asked: Array<{ id: string; label: string; type: 'choice' | 'text' | null; options: string[]; current: boolean }> = questions.map((q) => ({
    id: q.id,
    label: normalizeLine(q.label) || q.id,
    // G128: a yes / no question counts like a choice of Yes and No; long and number answers are listed like text.
    type: q.type === 'choice' || q.type === 'yesno' ? 'choice' : 'text',
    options: q.type === 'choice' ? (q.options ?? []).map(normalizeLine).filter(Boolean) : q.type === 'yesno' ? ['Yes', 'No'] : [],
    current: true,
  }));
  const known = new Set(asked.map((q) => q.id));
  for (const r of newestFirst) {
    for (const a of r.answers ?? []) {
      if (known.has(a.id)) continue;
      known.add(a.id);
      asked.push({ id: a.id, label: normalizeLine(a.question) || a.id, type: null, options: [], current: false });
    }
  }

  const dietary: DietaryNote[] = [];
  const out: QuestionInsight[] = asked.map((q) => {
    const given = newestFirst
      .map((r) => ({ r, a: (r.answers ?? []).find((x) => x.id === q.id) }))
      .filter((x): x is { r: ReplyLike; a: RsvpAnswer } => Boolean(x.a && normalizeLine(x.a.answer)));
    // A removed question: counts when its answers look like choices (few short values), else a list.
    let type = q.type;
    if (!type) {
      const values = new Set(given.map((x) => norm(x.a.answer)));
      type = values.size <= 8 && given.every((x) => !x.a.answer.includes('\n') && x.a.answer.length <= 60) ? 'choice' : 'text';
    }
    const isDiet = isDietaryQuestion(q.label, type);
    const insight: QuestionInsight = {
      id: q.id,
      label: q.label,
      kind: type === 'choice' ? (isYesNo(q.options) ? 'yesno' : 'choice') : 'text',
      current: q.current,
      answered: given.length,
      asked: coming.length,
      options: [],
      answers: [],
      dietary: isDiet,
    };
    if (type === 'choice') {
      const counts = new Map<string, OptionCount>();
      for (const o of q.options) if (!counts.has(norm(o))) counts.set(norm(o), { value: o, count: 0, percent: 0, old: false });
      for (const { a } of given) {
        const key = norm(a.answer);
        const row = counts.get(key) ?? { value: normalizeLine(a.answer), count: 0, percent: 0, old: q.current };
        row.count += 1;
        counts.set(key, row);
      }
      // Options in the question's order (also the ones nobody chose); older values after them, most chosen first.
      const rows = [...counts.values()];
      const current = rows.filter((o) => !o.old || !q.current);
      const older = rows.filter((o) => o.old && q.current).sort((a, b) => b.count - a.count);
      insight.options = [...(q.current ? current : current.sort((a, b) => b.count - a.count)), ...older].map((o) => ({ ...o, percent: percentOf(o.count, given.length) }));
    } else {
      insight.answers = given.map(({ r, a }) => ({ replyId: r.id, name: r.name, answer: a.answer }));
    }
    if (isDiet) {
      for (const { r, a } of given) {
        if (NONE_RE.test(normalizeLine(a.answer))) continue;
        dietary.push({ replyId: r.id, name: r.name, text: a.answer, from: 'answer', question: q.label });
      }
    }
    return insight;
  });

  // A note that mentions food or allergies belongs next to the answers (a guest may not find the right question).
  for (const r of counted) {
    const m = r.message ? r.message.trim() : '';
    if (m && DIET_TEXT_RE.test(m)) dietary.push({ replyId: r.id, name: r.name, text: m, from: 'message', question: null });
  }
  dietary.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || (a.from === b.from ? 0 : a.from === 'answer' ? -1 : 1));

  return {
    people: { coming: people, named, unnamed: people - named, notComing: counted.length - coming.length },
    deadline: deadlineInsight(content, now),
    questions: out,
    dietary,
  };
}
