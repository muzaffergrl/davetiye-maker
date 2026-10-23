// G984 (docs/36 dalga 6): guides N11 (privacy) and N12 (QR codes), checked against the code they describe.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { QR_PNG_SIZES, SHARE_LABELS } from '../lib/panel/share.ts';
import { loadGuide } from '../lib/marketing/guides.ts';
import { QR_BORDER } from '../lib/qr.ts';
import { INVITED_TEXT } from '../lib/site/gate.ts';
import { COUPLE_SITE_ROBOTS } from '../lib/site/render.ts';

test('N11 states only what the site does: noindex for couple sites, a minimal password page', () => {
  const n11 = loadGuide('wedding-website-privacy');
  assert.ok(n11);
  assert.equal(COUPLE_SITE_ROBOTS, 'noindex');
  assert.match(n11.markdown, /asks search engines not to list it/);
  // noindex is not privacy: the guide cites Google's own page that says so
  assert.match(n11.markdown, /\]\(https:\/\/developers\.google\.com\/search\/docs\/crawling-indexing\/block-indexing\)/);
  assert.equal(String(INVITED_TEXT), "You're invited");
  assert.match(n11.markdown, /your names, "You're invited" and a password box/);
  assert.match(n11.markdown, /\]\(\/guides\/wedding-website-on-invitation\)/);
  assert.doesNotMatch(n11.markdown, /\{\{/);
});

test('N12 matches the QR the panel makes: level Q, four-module margin, three PNG sizes, 4 × 6 in card', () => {
  const n12 = loadGuide('qr-code-wedding-rsvp');
  assert.ok(n12);
  assert.match(readFileSync(new URL('../lib/qr.ts', import.meta.url), 'utf8'), /ecc: 'Q'/);
  assert.match(n12.markdown, /error correction level Q/);
  assert.equal(QR_BORDER, 4);
  assert.match(n12.markdown, /four-module margin/);
  assert.equal(QR_PNG_SIZES.length, 3);
  assert.match(n12.markdown, /PNG in three sizes/);
  assert.match(SHARE_LABELS.cardText, /4 × 6 in \(10 × 15 cm\)/);
  assert.match(n12.markdown, /4 × 6 in \(10 × 15 cm\) QR card/);
  for (const href of ['/guides/wedding-website-on-invitation', '/guides/wedding-website-privacy', '/guides/wedding-rsvp-questions'])
    assert.ok(n12.markdown.includes(`](${href})`), `N12 links ${href}`);
  assert.doesNotMatch(n12.markdown, /\{\{/);
});

test('the cluster links back: G2 and N4 to N11, N4 and N2 to N12', () => {
  const links = (slug: string) => loadGuide(slug)?.markdown ?? '';
  assert.match(links('what-to-put-on-your-wedding-website'), /\]\(\/guides\/wedding-website-privacy\)/);
  assert.match(links('wedding-website-on-invitation'), /\]\(\/guides\/wedding-website-privacy\)/);
  assert.match(links('wedding-website-on-invitation'), /\]\(\/guides\/qr-code-wedding-rsvp\)/);
  assert.match(links('wedding-rsvp-questions'), /\]\(\/guides\/qr-code-wedding-rsvp\)/);
});
