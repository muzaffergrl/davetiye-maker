// G195 (docs/36 dalga 2): guides N3 and N4, and the {{domain}} token guides use for example addresses.

import assert from 'node:assert/strict';
import test from 'node:test';
import { MARKETING } from '../lib/marketing/config.ts';
import { fillTokens, loadGuide } from '../lib/marketing/guides.ts';
import { siteHost } from '../lib/marketing/site.ts';

test('{{domain}} is the site host, the same one couple addresses use', () => {
  assert.equal(fillTokens('{{domain}}/clara-and-julian'), `${siteHost(MARKETING)}/clara-and-julian`);
  assert.doesNotMatch(fillTokens('{{domain}}'), /^https?:|\/$/);
});

test('N3 and N4 exist and link each other and their cluster', () => {
  const n3 = loadGuide('wedding-website-vs-invitation');
  const n4 = loadGuide('wedding-website-on-invitation');
  assert.ok(n3 && n4);
  assert.match(n3.markdown, /\]\(\/guides\/wedding-website-on-invitation\)/);
  assert.match(n3.markdown, /\]\(\/guides\/animated-envelope-wedding-invitations\)/);
  assert.match(n4.markdown, /\]\(\/guides\/wedding-rsvp-questions\)/);
  assert.match(n4.markdown, new RegExp(`for example ${siteHost(MARKETING).replace(/\./g, '\\.')}/clara-and-julian`));
  assert.doesNotMatch(n4.markdown, /\{\{/, 'no token left unfilled');
});
