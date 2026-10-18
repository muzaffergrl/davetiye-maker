#!/usr/bin/env node
// G139: sample PDFs from a theme's demo content (no site, no server):
//   node scripts/print-sample.ts --theme <id> [--out <dir>] [--site] [--invite 5x7|a5] [--bleed] [--marks] [--no-back]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { loadTheme, themesDir } from '../lib/theme/theme.ts';
import { closePrintBrowser } from '../lib/print/browser.ts';
import { sitePdf } from '../lib/print/site-pdf.ts';
import { invitationPdf, type InvitationSize } from '../lib/print/invitation.ts';

const arg = (name: string) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : null);
const id = arg('--theme') ?? 'olive-ivory';
const out = arg('--out') ?? path.join(import.meta.dirname, '..', '.data', 'print-samples');
mkdirSync(out, { recursive: true });
const theme = await loadTheme(id);
if (!theme) throw new Error(`no theme ${id}`);
const demo = path.join(themesDir(), id, 'content.demo.json');
const content = JSON.parse(readFileSync(existsSync(demo) ? demo : path.join(themesDir(), 'olive-ivory', 'content.demo.json'), 'utf8'));
const slug = 'avery-and-jordan';
const origin = 'https://xn--bkestudo-zkb.com';
const siteUrl = `${origin}/${slug}`;
try {
  if (process.argv.includes('--site')) {
    const t = Date.now();
    writeFileSync(path.join(out, `${id}-site.pdf`), await sitePdf({ theme, content, slug, siteId: null, siteUrl, publicOrigin: origin }));
    console.log(`${id}-site.pdf ${Date.now() - t} ms`);
  }
  const size = arg('--invite') as InvitationSize | null;
  if (size) {
    const t = Date.now();
    const opts = { size, bleed: process.argv.includes('--bleed'), marks: process.argv.includes('--marks'), back: !process.argv.includes('--no-back') };
    const name = `${id}-invite-${size}${opts.bleed ? '-bleed' : ''}${opts.marks ? '-marks' : ''}.pdf`;
    writeFileSync(path.join(out, name), await invitationPdf({ themeId: id, content, siteUrl, publicOrigin: origin, ...opts }));
    console.log(`${name} ${Date.now() - t} ms`);
  }
} finally {
  await closePrintBrowser();
}
