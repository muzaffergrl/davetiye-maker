// End-to-end check of a deployed platform (G044 → G049). Reads public pages and APIs, plus one write path on a temporary
// site it creates and deletes itself.
//
//   cd platform && node --env-file=.env.local scripts/live-check.mjs [--base https://<host>] [--no-write] [--no-claim]
//
// Environment (values are never printed):
//   LIVE_BASE_URL or PLATFORM_PUBLIC_URL  site root to check (or --base); https only (http only for localhost)
//   EXPECT_PUBLIC_URL                     public address og:image / calendar links must use (default PLATFORM_PUBLIC_URL, else
//                                         the base; when it equals the base the check cannot tell a missing setting apart)
//   BLOB_READ_WRITE_TOKEN                 the deployment's Blob store: creates/deletes the temporary sites (without it, or with
//                                         --no-write, only the read-only checks run)
//   DEMO_SLUG                             demo site to read (default clara-and-julian)
//   DEMO_EDIT_KEY                         optional: also open the demo's edit panel and panel API; sent only to the expected
//                                         public host (or localhost)
//   LIVE_THEMES                           comma list of /start themes to open (default blush-garden-rose,olive-ivory)
// --no-claim skips the /start claim (2 attempts + 1 site against the per-IP limits: 10 attempts / 15 min, 5 sites / day).
// Temporary sites: slugs live-check-<ms> and live-claim-<order>; leftovers of earlier interrupted runs are swept first.
// Exit code: 0 = every check passed, 1 = a check failed, 3 = only rate limits (429) were hit.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { del, list } from '@vercel/blob';
import sharp from 'sharp';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { seedSite } from './seed.ts';

const platformRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(platformRoot); // seedSite reads themes/ from here

const { values } = parseArgs({
  options: { base: { type: 'string' }, 'no-write': { type: 'boolean', default: false }, 'no-claim': { type: 'boolean', default: false } },
});
const origin = (s) => (s || '').replace(/\/+$/, '');
const base = origin(values.base || process.env.LIVE_BASE_URL || process.env.PLATFORM_PUBLIC_URL);
const isLocal = (u) => /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(u);
if (!/^https:\/\/[^/]+$/.test(base) && !isLocal(base)) {
  console.error('Give the site root as https://<host> (http only for localhost): --base, LIVE_BASE_URL or PLATFORM_PUBLIC_URL.');
  process.exit(2);
}
const expected = origin(process.env.EXPECT_PUBLIC_URL || process.env.PLATFORM_PUBLIC_URL || base);
const token = process.env.BLOB_READ_WRITE_TOKEN;
const write = !values['no-write'] && !!token;
const demoSlug = process.env.DEMO_SLUG || 'clara-and-julian';
const demoKey = process.env.DEMO_EDIT_KEY || '';
const keyHostOk = base === expected || isLocal(base); // the edit key goes only to the public host
const themes = (process.env.LIVE_THEMES || 'blush-garden-rose,olive-ivory').split(',').map((s) => s.trim()).filter(Boolean);
const TIMEOUT_MS = 30_000;

/** Error text without keys or tokens (undici puts a rejected header value, e.g. "Bearer …", into its message). */
const secrets = [token, demoKey].filter(Boolean);
function redact(text) {
  let out = String(text ?? '');
  for (const s of secrets) out = out.split(s).join('<hidden>');
  return out.replace(/Bearer\s+\S+/gi, 'Bearer <hidden>').replace(/vercel_blob_rw_\w+/g, '<hidden>').replace(/[A-Za-z0-9_-]{40,}/g, '<hidden>').slice(0, 200);
}

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const limited = [];
/** A 429 from the per-IP limits is reported apart from failures (the platform works; this machine is throttled). */
const limit = (name, r) => {
  limited.push(name);
  console.log(`LIMIT ${name} — HTTP 429, retry after ${r.headers.get('retry-after') ?? '?'} s`);
};
const skip = (name, why) => console.log(`SKIP ${name} — ${why}`);
const info = (text) => console.log(`INFO ${text}`);
const get = (p, init = {}) => fetch(base + p, { redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS), ...init });
const json = async (r) => r.json().catch(() => ({}));
const auth = (k) => ({ Authorization: `Bearer ${k}` });
const jsonHeaders = (k) => ({ ...(k ? auth(k) : {}), 'content-type': 'application/json' });
const isoInDays = (n) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

const adapter = token ? new BlobAdapter({ token }) : null;
/** Temporary sites of this run: {slug, id?, orderRef?}. Deleted by id; their files are then listed and removed. */
const temp = [];

/** Every file a temporary site can leave (site record, indexes, RSVPs, photos). */
const prefixesOf = (t) => [`slugs/${t.slug}.json`, ...(t.orderRef ? [`orders/${t.orderRef}.json`] : []), ...(t.id ? [`sites/${t.id}.json`, `rsvps/${t.id}/`, `media/${t.id}/`] : [])];
async function listAll(prefix) {
  const out = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor, limit: 1000, token });
    out.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

/** Deletes temporary sites by id, then removes whatever files are left; read errors are failures, not "gone". */
async function cleanup() {
  if (!adapter || !temp.length) return;
  let ok = true;
  for (const t of temp) {
    try {
      if (!t.id) t.id = (await adapter.getSiteBySlug(t.slug))?.id;
      if (t.id) await adapter.deleteSite(t.id);
    } catch (e) {
      ok = false;
      console.log(`     cleanup error (${t.slug}): ${e?.name}: ${redact(e?.message)}`);
    }
  }
  try {
    const left = (await Promise.all(temp.flatMap((t) => prefixesOf(t).map(listAll)))).flat();
    if (left.length) {
      await del(left, { token });
      info(`cleanup removed ${left.length} leftover file(s): ${left.slice(0, 4).join(', ')}`);
    }
    const still = (await Promise.all(temp.flatMap((t) => prefixesOf(t).map(listAll)))).flat();
    check('cleanup: no file of the temporary sites left', ok && still.length === 0, still.slice(0, 4).join(', '));
  } catch (e) {
    check('cleanup: no file of the temporary sites left', false, `${e?.name}: ${redact(e?.message)}`);
  }
  temp.length = 0;
}

/** Leftovers of interrupted earlier runs (only these script-owned prefixes; never the demo). */
async function sweepOld() {
  const old = [];
  for (const prefix of ['slugs/live-check-', 'slugs/live-claim-']) {
    for (const p of await listAll(prefix)) {
      const slug = p.slice('slugs/'.length, -'.json'.length);
      const site = await adapter.getSiteBySlug(slug);
      old.push({ slug, id: site?.id, orderRef: site?.orderRef ?? undefined });
    }
  }
  if (old.length) {
    temp.push(...old);
    info(`sweeping ${old.length} temporary site(s) left by an earlier run`);
    await cleanup();
  }
}

let interrupted = false;
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.once(sig, async () => {
    if (interrupted) return;
    interrupted = true;
    console.log(`\n${sig}: removing temporary sites before exit`);
    await cleanup().catch(() => undefined);
    process.exit(130);
  });
}

console.log(`live-check ${base} · expected public URL ${expected} · demo /${demoSlug} · themes ${themes.join(', ')} · write ${write ? 'on' : 'off'}${write && !values['no-claim'] ? ' + claim' : ''}\n`);

try {
  if (write) await sweepOld();

  // --- demo site: pages, headers, share data, calendar, photos ---------------------------------------------------
  let home = '';
  for (const p of ['', '/home', '/story', '/details', '/rsvp']) {
    const r = await get(`/${demoSlug}${p}`);
    const html = await r.text();
    if (p === '/home') home = html;
    const csp = r.headers.get('content-security-policy') ?? '';
    check(`demo /${demoSlug}${p}`, r.status === 200 && csp.includes("object-src 'none'") && !html.includes('localhost'),
      `HTTP ${r.status}, ${Math.round(html.length / 1024)} KB`);
  }
  const og = home.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1] ?? home.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/)?.[1];
  check('og:image is an absolute URL on the public address', !!og && og.startsWith(`${expected}/`), og ?? 'missing');
  if (expected === base) info('og:image: base = expected public URL, so a missing PLATFORM_PUBLIC_URL would look the same here (the host fallback)');
  if (og?.startsWith('https://') || (og && isLocal(origin(new URL(og).origin)))) {
    const r = await fetch(og, { signal: AbortSignal.timeout(TIMEOUT_MS) });
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
  if (!demoKey) skip('demo panel', 'DEMO_EDIT_KEY not set');
  else if (!keyHostOk) skip('demo panel', `the edit key is sent only to ${expected} (or localhost), not ${base}`);
  else {
    const panel = await get(`/edit/${demoSlug}?k=${encodeURIComponent(demoKey)}`);
    check('demo panel opens (edit link)', panel.status === 200 && panel.headers.get('x-frame-options') === 'DENY' && panel.headers.get('referrer-policy') === 'no-referrer',
      `HTTP ${panel.status}, frame ${panel.headers.get('x-frame-options')}, referrer ${panel.headers.get('referrer-policy')}`);
    const st = await get(`/api/edit/${demoSlug}`, { headers: auth(demoKey) });
    check('demo panel API', st.status === 200 && (await json(st)).state?.status === 'published', `HTTP ${st.status}`);
  }

  // --- /start for every theme on sale -----------------------------------------------------------------------------
  for (const t of themes) {
    const s = await get(`/start?theme=${encodeURIComponent(t)}`);
    const html = await s.text();
    // app/start/page.tsx shows "This start link is not valid" / "Choose your design" when the theme is not on sale
    const valid = !/This start link is not valid|Choose your design/.test(html);
    check(`/start?theme=${t}`, s.status === 200 && s.headers.get('x-frame-options') === 'DENY' && valid, `HTTP ${s.status}${valid ? '' : ', theme not offered'}`);
    for (const p of ['', '/home', '/rsvp', '/event.ics']) {
      const d = await get(`/start/demo/${encodeURIComponent(t)}${p}`);
      check(`/start/demo/${t}${p}`, d.status === 200, `HTTP ${d.status}`);
    }
  }

  // --- write path on a temporary site (created here, deleted in cleanup) --------------------------------------------
  if (!write) {
    skip('write path', values['no-write'] ? '--no-write' : 'BLOB_READ_WRITE_TOKEN not set');
  } else {
    const slug = `live-check-${Date.now()}`;
    const entry = { slug, orderRef: `DEMO-SEED-${slug}` }; // seedSite's order reference (scripts/seed.ts)
    temp.push(entry);
    const content = JSON.parse(readFileSync(path.join(platformRoot, 'lib/claim/demo/blush-garden-rose.json'), 'utf8'));
    const seeded = await seedSite(adapter, { theme: 'blush-garden-rose', slug, content, draft: true, baseUrl: base, photosDir: null });
    entry.id = seeded.siteId;
    const key = seeded.editKey;
    secrets.push(key, seeded.previewKey);
    const s0 = await json(await get(`/api/edit/${slug}`, { headers: auth(key) }));
    check('temporary site: draft, public address 404', s0.state?.status === 'draft' && (await get(`/${slug}`)).status === 404, `status=${s0.state?.status}`);
    const draft = s0.state.content;
    draft.venue.name = 'Live Check Hall';
    // dates relative to today, so the RSVP window is open whenever this runs (deadline before the event, validate.ts)
    draft.date = isoInDays(60);
    draft.rsvp.deadline = isoInDays(30);
    const put = await get(`/api/edit/${slug}`, { method: 'PUT', headers: jsonHeaders(key), body: JSON.stringify({ content: draft, baseUpdatedAt: s0.state.updatedAt }) });
    check('panel save (PUT draft)', put.status === 200 && (await json(put)).ok === true, `HTTP ${put.status}`);
    const stale = await get(`/api/edit/${slug}`, { method: 'PUT', headers: jsonHeaders(key), body: JSON.stringify({ content: draft, baseUpdatedAt: s0.state.updatedAt }) });
    check('stale save is 409 (no silent overwrite)', stale.status === 409, `HTTP ${stale.status}`);
    const jpg = await sharp({ create: { width: 900, height: 1100, channels: 3, background: '#e9cfcf' } }).jpeg().toBuffer();
    const ph = await get(`/api/edit/${slug}/photo?slot=hero_portrait`, { method: 'POST', headers: { ...auth(key), 'content-type': 'image/jpeg' }, body: jpg });
    const phj = await json(ph);
    check('photo upload (sharp in the function)', ph.status === 200 && phj.ok === true, `HTTP ${ph.status} ${phj.width ?? '?'}×${phj.height ?? '?'}`);
    if (phj.url) {
      // lib/site/static.ts: a photo not in the published content is served only with the site's ?preview= key
      const hidden = await get(phj.url);
      check('unpublished photo is hidden without the preview key', hidden.status === 404, `HTTP ${hidden.status}`);
      const pr = await get(`${phj.url}?preview=${encodeURIComponent(seeded.previewKey)}`);
      check('unpublished photo loads with the preview key (private, no-store)', pr.status === 200 && (pr.headers.get('cache-control') ?? '').includes('no-store'),
        `HTTP ${pr.status} ${pr.headers.get('cache-control')}`);
    }
    const pub = await get(`/api/edit/${slug}/publish`, { method: 'POST', headers: jsonHeaders(key), body: '{}' });
    const pubj = await json(pub);
    check('publish', pub.status === 200 && pubj.ok === true, `HTTP ${pub.status} ${pubj.code ?? ''}`);
    check('published page shows the change', (await (await get(`/${slug}/details`)).text()).includes('Live Check Hall'));
    const rp = await get(`/api/rsvp/${slug}`, { method: 'POST', headers: jsonHeaders(), body: JSON.stringify({ name: 'Live Check Guest', attending: 'yes', guests: 2, message: 'live-check' }) });
    if (rp.status === 429) limit('guest RSVP', rp);
    else {
      const rpj = await json(rp);
      check('guest RSVP', rp.status === 200 && rpj.state === 'success', `HTTP ${rp.status} ${rpj.code ?? ''}`);
      const lr = await json(await get(`/api/rsvp/${slug}/responses`, { headers: auth(key) }));
      check('couple sees the reply', lr.counts?.responses === 1 && lr.counts?.totalGuests === 2, JSON.stringify(lr.counts ?? {}));
      const csv = await get(`/api/rsvp/${slug}/export`, { headers: auth(key) });
      check('CSV export', csv.status === 200 && (await csv.text()).includes('Live Check Guest'), `HTTP ${csv.status}`);
    }

    // /start claim: a draft site per order number; the same order again is refused (sent only after a successful claim,
    // with the same address, so it can never open a second site under another address)
    if (values['no-claim']) skip('/start claim', '--no-claim');
    else {
      const order = `9${String(Date.now()).slice(-9)}`;
      const claim = { theme: themes[0], orderNumber: order, email: 'live-check@example.com', names: ['Livecheck', 'Probe'], slug: `live-claim-${order}` };
      temp.push({ slug: claim.slug, orderRef: order });
      const cl = await get('/api/start', { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(claim) });
      const clj = await json(cl);
      if (cl.status === 429) limit('/start claim', cl);
      else {
        check('/start claim creates a draft site', cl.status === 201 && clj.status === 'draft' && clj.slug === claim.slug, `HTTP ${cl.status} ${clj.code ?? ''}`);
        if (cl.status === 201) {
          const again = await get('/api/start', { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(claim) });
          const againj = await json(again);
          if (again.status === 429) limit('same order number again', again);
          else check('same order number again is 409 order_used', again.status === 409 && againj.code === 'order_used', `HTTP ${again.status} ${againj.code ?? ''}`);
          if (again.status === 201 && againj.slug && againj.slug !== claim.slug) temp.push({ slug: againj.slug, orderRef: order });
        }
      }
    }
  }
} catch (e) {
  check('unexpected error', false, `${e?.name}: ${redact(e?.message)}`);
} finally {
  if (!interrupted) {
    await cleanup();
    if (adapter) {
      try {
        check('demo site still there', !!(await adapter.getSiteBySlug(demoSlug)));
      } catch (e) {
        check('demo site still there', false, `${e?.name}: ${redact(e?.message)}`);
      }
    }
    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} passed${limited.length ? ` · ${limited.length} rate-limited (not failures): ${limited.join(', ')}` : ''}`);
    process.exitCode = failed ? 1 : limited.length ? 3 : 0;
  }
}
