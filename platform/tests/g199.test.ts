// G199 (docs/36 dalga 4): guides N7 and N8, and the Our Story limit tokens guides use.

import assert from 'node:assert/strict';
import test from 'node:test';
import { LIMITS } from '../lib/marketing/facts.ts';
import { fillTokens, loadGuide } from '../lib/marketing/guides.ts';

test('Our Story tokens are the limits the marketing facts state', () => {
  assert.equal(fillTokens('{{storyIntroChars}}/{{storyPhotos}}/{{storyCaptionChars}}'), `${LIMITS.storyIntroChars}/${LIMITS.storyPhotos}/${LIMITS.storyCaptionChars}`);
});

test('N7 and N8 exist, state product limits from config, and link their cluster', () => {
  const n7 = loadGuide('free-vs-paid-wedding-websites');
  const n8 = loadGuide('wedding-website-our-story-examples');
  assert.ok(n7 && n8);
  assert.match(n7.markdown, /\]\(\/pricing\)/);
  assert.match(n7.markdown, /\]\(\/guides\/canva-wedding-website-template-vs-hosted-website\)/);
  assert.doesNotMatch(n7.markdown, /\bsubscription\b/i, 'docs/14: never "subscription" for what we sell');
  assert.match(n8.markdown, new RegExp(`up to ${LIMITS.storyIntroChars} characters`));
  assert.match(n8.markdown, /\]\(\/guides\/wedding-website-wording\)/);
  for (const g of [n7, n8]) assert.doesNotMatch(g.markdown, /\{\{/, `${g.slug}: no token left unfilled`);
});
