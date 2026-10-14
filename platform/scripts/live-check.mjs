// End-to-end check of a deployed platform (G044 → G049). Reads only public pages and APIs, plus one write path on a
// temporary site it creates and deletes itself.
//
//   cd platform && node --env-file=.env.local scripts/live-check.mjs [--base https://<host>] [--no-write]
//
// Environment (values are never printed):
//   LIVE_BASE_URL or PLATFORM_PUBLIC_URL  site root to check (or --base)
//   BLOB_READ_WRITE_TOKEN                 the deployment's Blob store: creates/deletes the temporary sites
//                                         (without it, or with --no-write, only the read-only checks run)
//   DEMO_SLUG                             demo site to read (default clara-and-julian)
//   DEMO_EDIT_KEY                         optional: also open the demo's edit panel and panel API
//   LIVE_THEMES                           comma list of /start themes to open (default blush-garden-rose,olive-ivory)
// Exit code 0 = every check passed.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import sharp from 'sharp';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { seedSite } from './seed.ts';

const platformRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(platformRoot); // seedSite reads themes/ from here

const { values } = parseArgs({ options: { base: { type: 'string' }, 'no-write': { type: 'boolean', default: false } } });
const base = (values.base || process.env.LIVE_BASE_URL || process.env.PLATFORM_PUBLIC_URL || '').replace(/\/+$/, '');
if (!/^https?:\/\/[^/]+$/.test(base)) {
  console.error('Give the site root: --base https://<host> (or LIVE_BASE_URL / PLATFORM_PUBLIC_URL).');
  process.exit(2);
}
const token = process.env.BLOB_READ_WRITE_TOKEN;
const write = !values['no-write'] && !!token;
const demoSlug = process.env.DEMO_SLUG || 'clara-and-julian';
const demoKey = process.env.DEMO_EDIT_KEY || '';
const themes = (process.env.LIVE_THEMES || 'blush-garden-rose,olive-ivory').split(',').map((s) => s.trim()).filter(Boolean);

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const skip = (name, why) => console.log(`SKIP ${name} — ${why}`);
const get = (p, init = {}) => fetch(base + p, { redirect: 'manual', ...init });
const json = async (r) => r.json().catch(() => ({}));
const auth = (k) => ({ Authorization: `Bearer ${k}` });
const jsonHeaders = (k) => ({ ...(k ? auth(k) : {}), 'content-type': 'application/json' });
const adapter = token ? new BlobAdapter({ token }) : null;
const cleanup = [];

console.log(`live-check ${base} · demo /${demoSlug} · themes ${themes.join(', ')} · write path ${write ? 'on' : 'off'}\n`);

try {
  // --- demo site: pages, headers, share data, calendar, photos ---------------------------------------------------
  const pages = ['', '/home', '/story', '/details', '/rsvp'];
  let home = '';
  for (const p of pages) {
    const r = await get(`/${demoSlug}${p}`);
    const html = await r.text();
    if (p === '/home') home = html;
    const csp = r.headers.get('content-security-policy') ?? '';
    check(`demo /${demoSlug}${p}`, r.status === 200 && csp.includes("object-src 'none'") && !html.includes('localhost'),
      `HTTP ${r.status}, ${Math.round(html.length / 1024)} KB`);
  }
  const og = home.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1] ?? home.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/)?.[1];
  check('og:image is an absolute URL on this site', !!og && og.startsWith(`${base}/`), og ? og.replace(base, '') : 'missing');
  if (og?.startsWith(`${base}/`)) {
    const r = await fetch(og);
    check('og:image loads', r.ok && (r.headers.get('content-type') ?? '').startsWith('image/'), `HTTP ${r.status} ${r.headers.get('content-type')}`);
  }
  const ics = await get(`/${demoSlug}/event.ics`);
  const icsText = await ics.text();
  check('calendar file /event.ics', ics.status === 200 && (ics.headers.get('content-type') ?? '').includes('text/calendar') && icsText.includes('BEGIN:VEVENT'),
    `HTTP ${ics.status} ${ics.headers.get('content-type')}`);
  const media = [...new Set(home.match(/\/media\/[0-9a-f-]{36}\/[0-9a-f]{32}(?:-\d+w)?\.(?:jpg|png|webp|avif)/g) ?? [])];
  check('demo home shows uploaded photos', media.length >= 1, `${media.length} photo URLs`);
  for (const m of media.slice(0, 3)) {
    const r = await get(m);
    check(`photo ${m.slice(0, 22)}…`, r.status === 200 && (r.headers.get('content-type') ?? '').startsWith('image/'), `HTTP ${r.status}`);
  }
  const css = await get('/themes/blush-garden-rose/site.css');
  check('theme asset site.css', css.status === 200, `HTTP ${css.status}`);
  const rsvpState = await get(`/api/rsvp/${demoSlug}`);
  check('demo RSVP form state', rsvpState.status === 200 && (await json(rsvpState)).ok === true, `HTTP ${rsvpState.status}`);

  // --- edit panel -------------------------------------------------------------------------------------------------
  const badPanel = await get(`/edit/${demoSlug}?k=not-a-key`);
  check('panel with a wrong key is a plain 404', badPanel.status === 404, `HTTP ${badPanel.status}`);
  if (demoKey) {
    const panel = await get(`/edit/${demoSlug}?k=${encodeURIComponent(demoKey)}`);
    check('demo panel opens (edit link)', panel.status === 200 && panel.headers.get('x-frame-options') === 'DENY' && panel.headers.get('referrer-policy') === 'no-referrer',
      `HTTP ${panel.status}, frame ${panel.headers.get('x-frame-options')}, referrer ${panel.headers.get('referrer-policy')}`);
    const st = await get(`/api/edit/${demoSlug}`, { headers: auth(demoKey) });
    check('demo panel API', st.status === 200 && (await json(st)).state?.status === 'published', `HTTP ${st.status}`);
  } else skip('demo panel', 'DEMO_EDIT_KEY not set');

  // --- /start for every theme on sale -----------------------------------------------------------------------------
  for (const t of themes) {
    const s = await get(`/start?theme=${encodeURIComponent(t)}`);
    const html = await s.text();
    // app/start/page.tsx shows "This start link is not valid" / "Choose your design" when the theme is not on sale
    const valid = !/This start link is not valid|Choose your design/.test(html);
    check(`/start?theme=${t}`, s.status === 200 && s.headers.get('x-frame-options') === 'DENY' && valid, `HTTP ${s.status}${valid ? '' : ', theme not offered'}`);
    for (const p of ['', '/home', '/rsvp']) {
      const d = await get(`/start/demo/${encodeURIComponent(t)}${p}`);
      check(`/start/demo/${t}${p}`, d.status === 200, `HTTP ${d.status}`);
    }
    const dics = await get(`/start/demo/${encodeURIComponent(t)}/event.ics`);
    check(`/start/demo/${t}/event.ics`, dics.status === 200, `HTTP ${dics.status}`);
  }

  // --- write path on a temporary site (created here, deleted in finally) ----------------------------------------------
  if (!write) {
    skip('write path', values['no-write'] ? '--no-write' : 'BLOB_READ_WRITE_TOKEN not set');
  } else {
    const slug = `live-check-${Date.now()}`;
    cleanup.push(slug);
    const content = JSON.parse(readFileSync(path.join(platformRoot, 'lib/claim/demo/blush-garden-rose.json'), 'utf8'));
    const seeded = await seedSite(adapter, { theme: 'blush-garden-rose', slug, content, draft: true, baseUrl: base, photosDir: null });
    const key = seeded.editKey;
    const s0 = await json(await get(`/api/edit/${slug}`, { headers: auth(key) }));
    check('temporary site: draft, public address 404', s0.state?.status === 'draft' && (await get(`/${slug}`)).status === 404, `status=${s0.state?.status}`);
    const draft = s0.state.content;
    draft.venue.name = 'Live Check Hall';
    const put = await get(`/api/edit/${slug}`, { method: 'PUT', headers: jsonHeaders(key), body: JSON.stringify({ content: draft, baseUpdatedAt: s0.state.updatedAt }) });
    check('panel save (PUT draft)', put.status === 200 && (await json(put)).ok === true, `HTTP ${put.status}`);
    const stale = await get(`/api/edit/${slug}`, { method: 'PUT', headers: jsonHeaders(key), body: JSON.stringify({ content: draft, baseUpdatedAt: s0.state.updatedAt }) });
    check('stale save is 409 (no silent overwrite)', stale.status === 409, `HTTP ${stale.status}`);
    const jpg = await sharp({ create: { width: 900, height: 1100, channels: 3, background: '#e9cfcf' } }).jpeg().toBuffer();
    const ph = await get(`/api/edit/${slug}/photo?slot=hero_portrait`, { method: 'POST', headers: { ...auth(key), 'content-type': 'image/jpeg' }, body: jpg });
    const phj = await json(ph);
    check('photo upload (sharp in the function)', ph.status === 200 && phj.ok === true, `HTTP ${ph.status} ${phj.width ?? '?'}×${phj.height ?? '?'}`);
    if (phj.url) {
      const pr = await get(phj.url);
      check('uploaded photo is served from the private store', pr.status === 200, `HTTP ${pr.status}`);
    }
    const pub = await get(`/api/edit/${slug}/publish`, { method: 'POST', headers: jsonHeaders(key), body: '{}' });
    const pubj = await json(pub);
    check('publish', pub.status === 200 && pubj.ok === true, `HTTP ${pub.status} ${pubj.code ?? ''}`);
    check('published page shows the change', (await (await get(`/${slug}/details`)).text()).includes('Live Check Hall'));
    const rp = await get(`/api/rsvp/${slug}`, { method: 'POST', headers: jsonHeaders(), body: JSON.stringify({ name: 'Live Check Guest', attending: 'yes', guests: 2, message: 'live-check' }) });
    const rpj = await json(rp);
    check('guest RSVP', rp.status === 200 && rpj.state === 'success', `HTTP ${rp.status} ${rpj.code ?? ''}`);
    const lr = await json(await get(`/api/rsvp/${slug}/responses`, { headers: auth(key) }));
    check('couple sees the reply', lr.counts?.responses === 1 && lr.counts?.totalGuests === 2, JSON.stringify(lr.counts ?? {}));
    const csv = await get(`/api/rsvp/${slug}/export`, { headers: auth(key) });
    check('CSV export', csv.status === 200 && (await csv.text()).includes('Live Check Guest'), `HTTP ${csv.status}`);

    // /start claim: a draft site per order number; the same order again is refused
    const order = `9${String(Date.now()).slice(-9)}`;
    const claim = { theme: themes[0], orderNumber: order, email: 'live-check@example.com', names: ['Livecheck', 'Probe'], slug: `live-claim-${order}` };
    cleanup.push(claim.slug);
    const cl = await get('/api/start', { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(claim) });
    const clj = await json(cl);
    check('/start claim creates a draft site', cl.status === 201 && clj.status === 'draft', `HTTP ${cl.status} ${clj.code ?? ''}`);
    const again = await get('/api/start', { method: 'POST', headers: jsonHeaders(), body: JSON.stringify({ ...claim, slug: undefined }) });
    check('same order number again is 409 order_used', again.status === 409 && (await json(again)).code === 'order_used', `HTTP ${again.status}`);
  }
} catch (e) {
  check('unexpected error', false, `${e?.name}: ${e?.message}`);
} finally {
  if (adapter) {
    for (const slug of cleanup) {
      const s = await adapter.getSiteBySlug(slug).catch(() => null);
      if (s) await adapter.deleteSite(s.id).catch((e) => console.log(`     cleanup error: ${e?.name}`));
    }
    if (cleanup.length) {
      const left = await Promise.all(cleanup.map((s) => adapter.getSiteBySlug(s).catch(() => null)));
      check('cleanup: temporary sites removed', left.every((s) => !s));
    }
    check('demo site still there', !!(await adapter.getSiteBySlug(demoSlug).catch(() => null)));
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exitCode = failed ? 1 : 0;
}
