// The next steps on Home: errors, sample text, empty photo places, the reply deadline (G060, K29).
// G181: a plain module, so the panel's shell works them out without loading the Home view.

import { isThankYouOn } from '../../lib/content/thank-you.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { sampleSummaries, SECTION_TITLES, sectionForPath, type PanelMeta, type PublishNote, type SectionId } from '../../lib/panel/model.ts';
import { rsvpClosesAt } from '../../lib/rsvp/deadline.ts';
import { t, tn } from '../../lib/i18n/client.ts';

const DAY = 86_400_000;

export interface NextStep {
  key: string;
  text: string;
  path: string;
  tone: 'warning' | 'danger' | 'info';
}

export function nextSteps(
  errors: ValidationIssue[],
  notes: { sample: PublishNote[]; photos: PublishNote[]; links: PublishNote[]; empty: PublishNote[] },
  content: ContentRecord,
  meta: PanelMeta,
  now = new Date(),
): NextStep[] {
  const out: NextStep[] = [];
  const bySection = new Map<SectionId, ValidationIssue[]>();
  for (const e of errors) {
    const s = sectionForPath(e.path);
    if (!s) continue;
    if (!bySection.has(s)) bySection.set(s, []);
    bySection.get(s)!.push(e);
  }
  for (const [s, list] of bySection) {
    out.push({ key: `err-${s}`, tone: 'danger', path: list[0].path, text: `${t(SECTION_TITLES[s])}: ${list.length === 1 ? t(list[0].message) : tn(list.length, '{n} thing to fix', '{n} things to fix')}` });
  }
  for (const s of sampleSummaries(notes.sample, { t, tn })) {
    // "Venue: replace the sample venue name and city" — names the fields, so the buyer knows what to look for.
    out.push({ key: `sample-${s.section}`, tone: 'warning', path: s.path, text: t('{section}: replace the sample {what}', { section: t(SECTION_TITLES[s.section]), what: s.what }) });
  }
  if (notes.photos.length) {
    out.push({ key: 'photos', tone: 'info', path: notes.photos[0].path, text: t('Add your photos ({n} still empty)', { n: notes.photos.length }) });
  }
  for (const n of [...notes.links, ...notes.empty]) out.push({ key: `note-${n.path}`, tone: 'info', path: n.path, text: t(n.message) });
  if (meta.status === 'published' && content.rsvp?.method !== 'none' && !isThankYouOn(content, now)) {
    const closes = rsvpClosesAt(content.rsvp?.deadline, content.timezone);
    const days = closes ? Math.ceil((closes.getTime() - now.getTime()) / DAY) : null;
    if (days !== null && days > 0 && days <= 14) {
      out.push({ key: 'deadline', tone: 'info', path: 'rsvp.deadline', text: tn(days, 'Replies close in {n} day', 'Replies close in {n} days') });
    }
  }
  return out.slice(0, 5);
}
