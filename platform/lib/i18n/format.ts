// G144: dates and times in the guest's language. English keeps lib/content/format.ts (the record's locale: "June 12,
// 2027" / "12 June 2027", "4:00 PM"); the other languages use Intl with the long month name — never a numeric date
// (AGENTS.md): tr "12 Haziran 2027", es "12 de junio de 2027", de "12. Juni 2027", fr "12 juin 2027"; 24-hour time.

import { formatDate, formatDateLong, formatTime, monthName, parseIsoDate, parseTime, weekdayName } from '../content/format.ts';
import { LANG_TAGS, type Lang } from './langs.ts';

const utc = (iso: unknown): Date | null => {
  const d = parseIsoDate(iso);
  return d ? new Date(Date.UTC(d.year, d.month - 1, d.day, 12)) : null;
};

const fmt = (lang: Lang, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(LANG_TAGS[lang], { timeZone: 'UTC', ...o });

/** First letter upper case (Spanish / French month and weekday names are lower case inside a sentence). */
const cap = (s: string, lang: Lang) => (s ? s[0].toLocaleUpperCase(LANG_TAGS[lang]) + s.slice(1) : s);

export function dateIn(iso: unknown, lang: Lang, locale?: string): string | null {
  if (lang === 'en') return formatDate(iso, locale);
  const d = utc(iso);
  return d ? fmt(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(d) : null;
}

export function dateLongIn(iso: unknown, lang: Lang, locale?: string): string | null {
  if (lang === 'en') return formatDateLong(iso, locale);
  const d = utc(iso);
  return d ? cap(fmt(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d), lang) : null;
}

export function weekdayIn(iso: unknown, lang: Lang): string | null {
  if (lang === 'en') return weekdayName(iso);
  const d = utc(iso);
  return d ? cap(fmt(lang, { weekday: 'long' }).format(d), lang) : null;
}

export function monthIn(iso: unknown, lang: Lang): string | null {
  if (lang === 'en') return monthName(iso);
  const d = utc(iso);
  return d ? cap(fmt(lang, { month: 'long' }).format(d), lang) : null;
}

export function timeIn(hhmm: unknown, lang: Lang, locale?: string): string | null {
  if (lang === 'en') return formatTime(hhmm, locale);
  const t = parseTime(hhmm);
  if (!t) return null;
  const hm = `${String(t.hour).padStart(2, '0')}:${String(t.minute).padStart(2, '0')}`;
  return lang === 'fr' ? hm.replace(':', ' h ') : hm;
}
