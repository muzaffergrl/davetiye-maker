// G201 (docs/36 dalga 5): guides N9 and N10, and the {{travelStays}} token.

import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTENT_LIMITS } from '../lib/content/limits.ts';
import { LIMITS } from '../lib/marketing/facts.ts';
import { fillTokens, loadGuide } from '../lib/marketing/guides.ts';

test('{{travelStays}} is the travel and stay limit the panel enforces', () => {
  assert.equal(fillTokens('{{travelStays}}'), String(CONTENT_LIMITS.travelStays));
});

test('N9 and N10 exist, state product limits from the source, and link their cluster', () => {
  const n9 = loadGuide('wedding-website-faq-examples');
  const n10 = loadGuide('destination-wedding-website-checklist');
  assert.ok(n9 && n10);
  assert.match(n9.markdown, new RegExp(`up to ${LIMITS.faqItems} questions`));
  assert.match(n10.markdown, new RegExp(`up to ${CONTENT_LIMITS.travelStays} hotels`));
  assert.match(n10.markdown, /\]\(\/guides\/wedding-website-faq-examples\)/);
  assert.match(n10.markdown, /\]\(\/guides\/wedding-rsvp-deadline\)/);
  // entry rules change: the guide points to an official source instead of stating them
  assert.match(n10.markdown, /\]\(https:\/\/travel\.state\.gov\//);
  for (const g of [n9, n10]) assert.doesNotMatch(g.markdown, /\{\{/, `${g.slug}: no token left unfilled`);
});
