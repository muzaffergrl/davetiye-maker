// G989 (docs/36 §7, dalga 7): guides N13 (bilingual website) and N14 (after the wedding), checked against the code.

import assert from 'node:assert/strict';
import test from 'node:test';
import { isThankYouOn, thankYouMode } from '../lib/content/thank-you.ts';
import { localizedContent } from '../lib/i18n/content.ts';
import { LANG_NAMES, LANGS } from '../lib/i18n/langs.ts';
import { loadGuide } from '../lib/marketing/guides.ts';
import { messageKinds } from '../lib/panel/share.ts';
import { rsvpWindow } from '../lib/rsvp/deadline.ts';

const links = (md: string) => [...md.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);

test('N13 names exactly the five website languages, and only approved translations reach guests', () => {
  const md = loadGuide('bilingual-wedding-website')!.markdown;
  assert.deepEqual([...LANGS].sort(), ['de', 'en', 'es', 'fr', 'tr']);
  assert.match(md, /English, Spanish, French, German or Turkish/);
  assert.equal(LANG_NAMES.de, 'Deutsch');
  // a draft (not approved) translation is not shown; the approved one is
  const src = { languages: { primary: 'en', extra: ['de'] }, story: { intro: 'We met in Lisbon.' } };
  const draft = { ...src, translations: { de: { 'story.intro': { text: 'Wir trafen uns in Lissabon.', src: 'x' } } } };
  assert.equal((localizedContent(draft, 'de') as typeof src).story.intro, 'We met in Lisbon.');
  assert.match(md, /Guests see a translation only after you approve it/);
  for (const href of ['/guides/how-to-make-a-wedding-website', '/guides/wedding-website-vs-invitation', '/guides/destination-wedding-website-checklist', '/features'])
    assert.ok(links(md).includes(href), href);
  assert.ok(links(md).includes('https://www.w3.org/International/questions/qa-date-format'));
});

test('N14 matches thank-you mode: on by itself after the wedding day, replies closed, a ready thank-you message', () => {
  const md = loadGuide('wedding-website-after-the-wedding')!.markdown;
  const content = { date: '2027-06-12', timezone: 'Europe/Lisbon', rsvp: { enabled: true, deadline: '2027-05-22' } };
  assert.equal(thankYouMode(content), 'auto');
  assert.equal(isThankYouOn(content, new Date('2027-06-12T22:00:00Z')), false, 'still the wedding day in Lisbon (23:00)');
  assert.equal(isThankYouOn(content, new Date('2027-06-12T23:30:00Z')), true, 'the day after in Lisbon');
  assert.equal(rsvpWindow({ ...content, rsvp: { enabled: true } }, new Date('2027-06-13T12:00:00Z')).reason, 'thank_you');
  assert.deepEqual(messageKinds(true, null), ['thanks']);
  assert.match(md, /turns into a thank-you page by itself/);
  assert.match(md, /Replies close while the thank-you page is on/);
  assert.doesNotMatch(md, /\{\{/);
  for (const href of ['/guides/how-to-make-a-wedding-website', '/guides/wedding-website-privacy', '/guides/when-to-send-your-wedding-website', '/features', 'https://emilypost.com/advice/choosing-a-wedding-gift', 'https://emilypost.com/advice/wedding-thank-yous'])
    assert.ok(links(md).includes(href), href);
});

test('the cluster links to the new guides: N10 and G2 to N13, G3 and N11 to N14', () => {
  const has = (slug: string, target: string) => links(loadGuide(slug)!.markdown).includes(`/guides/${target}`);
  assert.ok(has('destination-wedding-website-checklist', 'bilingual-wedding-website'));
  assert.ok(has('what-to-put-on-your-wedding-website', 'bilingual-wedding-website'));
  assert.ok(has('when-to-send-your-wedding-website', 'wedding-website-after-the-wedding'));
  assert.ok(has('wedding-website-privacy', 'wedding-website-after-the-wedding'));
});
