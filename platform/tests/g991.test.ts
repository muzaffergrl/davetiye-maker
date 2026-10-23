// G991 (docs/36 §7, dalga 8): guides N15 (printing invitations) and N16 (wedding weekend itinerary), checked against the code.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { calendarEvent } from '../lib/calendar.ts';
import { LIMITS } from '../lib/marketing/facts.ts';
import { loadGuide } from '../lib/marketing/guides.ts';
import { SHARE_LABELS } from '../lib/panel/share.ts';
import { INVITATION_SIZES, SIZE_SPECS } from '../lib/print/invitation.ts';
import { PRINT_LABELS } from '../lib/print/labels.ts';

const links = (md: string) => [...md.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);

test('N15 states the printable invitation as the panel makes it: 5 × 7 in or A5, 1/8 in or 3 mm bleed, crop marks, a back side', () => {
  const md = loadGuide('print-wedding-invitations-at-home')!.markdown;
  assert.deepEqual([...INVITATION_SIZES], ['5x7', 'a5']);
  assert.equal(SIZE_SPECS['5x7'].bleed, 0.125);
  assert.ok(Math.abs(SIZE_SPECS.a5.bleed * 25.4 - 3) < 1e-9);
  assert.match(PRINT_LABELS.en.panel_bleed, /1\/8 in \/ 3 mm/);
  assert.match(PRINT_LABELS.en.panel_back, /back side with the details and a QR code/);
  assert.match(md, /5 × 7 in or A5 \(148 × 210 mm\)/);
  assert.match(md, /add bleed \(1\/8 in or 3 mm\) and crop marks/);
  assert.match(SHARE_LABELS.cardText, /4 × 6 in/);
  assert.match(md, /We do not print or ship anything/);
  for (const href of ['/guides/how-to-make-a-wedding-website', '/guides/wedding-website-on-invitation', '/guides/qr-code-wedding-rsvp', '/features', 'https://pe.usps.com/cpim/ftp/manuals/qsg300/Q201.pdf'])
    assert.ok(links(md).includes(href), href);
});

test('N16 says what the schedule really holds: the wedding day, up to the row limit, no other days', () => {
  const md = loadGuide('wedding-weekend-itinerary')!.markdown;
  // schedule rows have a time and an optional place, but no date: one day only
  const types = readFileSync(new URL('../lib/content/types.ts', import.meta.url), 'utf8');
  const item = /export interface ScheduleItem \{([\s\S]*?)\}/.exec(types)![1];
  assert.doesNotMatch(item, /date/);
  assert.match(md, new RegExp(`holds the wedding day itself: up to ${LIMITS.scheduleRows} rows`));
  assert.match(md, /For events on other days/);
  // the calendar event starts at the ceremony time on the wedding date
  const ev = calendarEvent({ names: { display: 'Clara & Julian' }, date: '2027-06-12', ceremony_time: '16:00', timezone: 'Europe/Lisbon', schedule: [{ label: 'Ceremony', time: '16:00' }] });
  assert.ok(ev && ev.time.kind === 'utc');
  assert.equal(ev.time.start.toISOString(), '2027-06-12T15:00:00.000Z');
  for (const href of ['/guides/how-to-make-a-wedding-website', '/guides/destination-wedding-website-checklist', '/guides/wedding-website-wording', '/guides/wedding-website-faq-examples', '/features', 'https://emilypost.com/advice/wedding-website-tips'])
    assert.ok(links(md).includes(href), href);
});

test('the cluster links to the new guides: N4 and N12 to N15, N10 and G4 to N16', () => {
  const has = (slug: string, target: string) => links(loadGuide(slug)!.markdown).includes(`/guides/${target}`);
  assert.ok(has('wedding-website-on-invitation', 'print-wedding-invitations-at-home'));
  assert.ok(has('qr-code-wedding-rsvp', 'print-wedding-invitations-at-home'));
  assert.ok(has('destination-wedding-website-checklist', 'wedding-weekend-itinerary'));
  assert.ok(has('wedding-website-wording', 'wedding-weekend-itinerary'));
});
