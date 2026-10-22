// G206: the internal link matrix of docs/36 §4 (and §7), kept in every language, and G5's message examples.

import assert from 'node:assert/strict';
import test from 'node:test';
import { loadGuide, loadGuides, loadGuidesIn } from '../lib/marketing/guides.ts';

const G1 = 'how-to-make-a-wedding-website';
/** docs/36 §4: each new guide → G1 + these sister guides (+ the product page where the plan names one). */
const MATRIX: Record<string, string[]> = {
  'animated-envelope-wedding-invitations': ['wedding-website-vs-invitation', 'digital-wedding-invitation-etiquette', 'canva-wedding-website-template-vs-hosted-website', '/designs'],
  'wedding-rsvp-questions': ['wedding-rsvp-deadline', 'guests-did-not-rsvp', 'wedding-website-wording', '/features'],
  'wedding-website-vs-invitation': ['animated-envelope-wedding-invitations', 'wedding-website-on-invitation', 'digital-wedding-invitation-etiquette', 'what-to-put-on-your-wedding-website', '/how-it-works'],
  'wedding-website-on-invitation': ['qr-code-wedding-rsvp', 'when-to-send-your-wedding-website', 'wedding-website-wording', '/features'],
  'wedding-rsvp-deadline': ['guests-did-not-rsvp', 'wedding-rsvp-questions', 'when-to-send-your-wedding-website'],
  'guests-did-not-rsvp': ['wedding-rsvp-deadline', 'wedding-rsvp-questions'],
  'free-vs-paid-wedding-websites': ['canva-wedding-website-template-vs-hosted-website', 'wedding-website-vs-invitation', '/pricing'],
  'wedding-website-our-story-examples': ['wedding-website-wording', 'what-to-put-on-your-wedding-website', '/designs'],
  'wedding-website-faq-examples': ['what-to-put-on-your-wedding-website', 'wedding-website-wording', 'destination-wedding-website-checklist'],
  'destination-wedding-website-checklist': ['what-to-put-on-your-wedding-website', 'when-to-send-your-wedding-website', 'wedding-website-faq-examples'],
  'wedding-website-privacy': ['what-to-put-on-your-wedding-website', 'wedding-website-on-invitation', '/features'],
  'qr-code-wedding-rsvp': ['wedding-website-on-invitation', 'wedding-rsvp-questions', '/features'],
  // docs/36 §7 (G208/G209)
  'bilingual-wedding-website': ['wedding-website-vs-invitation', 'destination-wedding-website-checklist', '/features'],
  'wedding-website-after-the-wedding': ['wedding-website-privacy', 'when-to-send-your-wedding-website', '/features'],
  // docs/36 §7 (G210/G211)
  'print-wedding-invitations-at-home': ['wedding-website-on-invitation', 'qr-code-wedding-rsvp', '/features'],
  'wedding-weekend-itinerary': ['destination-wedding-website-checklist', 'wedding-website-wording', 'wedding-website-faq-examples', '/features'],
};
const links = (md: string) => [...md.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
const hits = (ls: string[], target: string) =>
  target.startsWith('/') ? ls.some((l) => l === target || l.startsWith(`${target}/`)) : ls.includes(`/guides/${target}`);

test('every new guide links G1, its sister guides and its product page, in English and every translation', () => {
  const sets = [loadGuides(), ...(['tr', 'de', 'es', 'fr'] as const).map((l) => loadGuidesIn(l))];
  for (const guides of sets) {
    for (const [slug, targets] of Object.entries(MATRIX)) {
      const g = guides.find((x) => x.slug === slug);
      assert.ok(g, slug);
      const ls = links(g.markdown);
      for (const t of [G1, ...targets]) assert.ok(hits(ls, t), `${slug} → ${t}`);
    }
  }
});

test('G1 links the first guide of each cluster (docs/36 §1)', () => {
  const ls = links(loadGuide(G1)!.markdown);
  for (const head of ['animated-envelope-wedding-invitations', 'wedding-website-our-story-examples', 'wedding-rsvp-questions']) assert.ok(hits(ls, head), head);
});

test('G5 has copyable messages for a plus-one, a change after sending and a save the date', () => {
  const md = loadGuide('digital-wedding-invitation-etiquette')!.markdown;
  for (const label of ['With a plus-one', 'If a detail changes after you have sent it', 'A save the date, months before the invitation']) assert.match(md, new RegExp(`\\*\\*${label}:\\*\\*`));
});
