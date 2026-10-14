// G060 edit rights and archive — server enforcement (docs/16 §11.4–11.9; acceptance tests §14 B 6–16).
// Local storage through the real route handlers; blob storage (in-memory fake of @vercel/blob, two server
// instances) through the same rule function, including two tabs racing for the last change.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import path from 'node:path';
import { GET as stateRoute, PUT as saveRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as identityRoute } from '../app/api/edit/[slug]/identity/route.ts';
import { POST as photoRoute } from '../app/api/edit/[slug]/photo/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { POST as unpublishRoute } from '../app/api/edit/[slug]/unpublish/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { GET as pageRoute } from '../app/[slug]/[page]/route.ts';
import { GET as icsRoute } from '../app/[slug]/event.ics/route.ts';
import { GET as mediaRoute } from '../app/media/[...path]/route.ts';
import { GET as rsvpStatusRoute, POST as rsvpPostRoute } from '../app/api/rsvp/[slug]/route.ts';
import { GET as repliesRoute, POST as repliesActionRoute } from '../app/api/rsvp/[slug]/responses/route.ts';
import { GET as exportRoute } from '../app/api/rsvp/[slug]/export/route.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import type { DataAdapter, SiteRecord } from '../lib/data/types.ts';
import { identityChangeFor } from '../lib/panel/api.ts';
import { identityOf, withIdentity, type Identity } from '../lib/panel/rights.ts';
import { MemoryRateLimiter, setRsvpRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, grantIdentityChanges, publishSite, setArchiveOverride } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
type Keys = { id: string; slug: string; editKey: string; previewKey: string };

before(() => {
  const themes = tmpDir('g060-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g060-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  setRsvpRateLimiter(new MemoryRateLimiter());
});

let counter = 0;
async function newSite(edit?: (c: ContentRecord) => void): Promise<Keys> {
  const c = demoContent();
  edit?.(c);
  const slug = `g060-site-${++counter}`;
  const s = await createSiteWithKeys(getDataAdapter(), { slug, theme: '_sample', content: c });
  return { id: s.site.id, slug, editKey: s.editKey, previewKey: s.previewKey };
}

type Handler = (req: Request, ctx: { params: Promise<any> }) => Promise<Response>;
async function call(handler: Handler, url: string, params: Record<string, unknown>, opts: { method?: string; key?: string; json?: unknown; body?: BodyInit; type?: string } = {}) {
  const headers = new Headers();
  if (opts.key) headers.set('authorization', `Bearer ${opts.key}`);
  let body = opts.body;
  if (opts.json !== undefined) {
    body = JSON.stringify(opts.json);
    headers.set('content-type', 'application/json');
  }
  if (opts.type) headers.set('content-type', opts.type);
  const res = await handler(new Request(`${BASE}${url}`, { method: opts.method ?? 'GET', headers, body }), { params: Promise.resolve(params) });
  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    /* html / csv */
  }
  return { status: res.status, data, headers: res.headers };
}

const getState = async (k: Keys) => (await call(stateRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { key: k.editKey })).data.state;
const put = (k: Keys, content: ContentRecord, baseUpdatedAt?: string) =>
  call(saveRoute, `/api/edit/${k.slug}`, { slug: k.slug }, { method: 'PUT', key: k.editKey, json: { content, ...(baseUpdatedAt ? { baseUpdatedAt } : {}) } });
const publish = (k: Keys) => call(publishRoute, `/api/edit/${k.slug}/publish`, { slug: k.slug }, { method: 'POST', key: k.editKey });
const identityCall = (k: Keys, identity: Identity, intent: 'fix' | 'change', baseUpdatedAt?: string, key = k.editKey) =>
  call(identityRoute, `/api/edit/${k.slug}/identity`, { slug: k.slug }, { method: 'POST', key, json: { identity, intent, ...(baseUpdatedAt ? { baseUpdatedAt } : {}) } });
const stored = async (k: Keys) => (await getDataAdapter().getSiteById(k.id)) as SiteRecord;

function renamed(id: Identity, first: string, date?: string): Identity {
  const next = structuredClone(id);
  // the full name keeps its last name: "Clara Rose" -> "Clare Rose"
  next.names[0] = { display: first, full: [first, ...id.names[0].full.split(' ').slice(1)].join(' ') };
  next.shown = `${first} & ${next.names[1].display}`;
  next.initials = `${first[0]}&${next.names[1].display[0]}`;
  if (date) next.date = date;
  return next;
}

test('6: before the first publish the autosave changes names and date freely; nothing is counted', async () => {
  const k = await newSite();
  const s = await getState(k);
  assert.equal(s.rights.phase, 'before_publish');
  const c = structuredClone(s.content) as ContentRecord;
  c.partners[0].display_name = 'Elena';
  c.name_display = 'Elena & Julian';
  c.date = '2027-09-30';
  const r = await put(k, c, s.updatedAt);
  assert.equal(r.status, 200);
  assert.equal(r.data.identityKept, undefined);
  const site = await stored(k);
  assert.equal(site.content.name_display, 'Elena & Julian');
  assert.equal(site.identity ?? null, null);
  assert.equal(site.firstPublishedAt ?? null, null);
});

test('7: the first publish writes firstPublishedAt + anchor + used 0; unpublish / publish again keep them', async () => {
  const k = await newSite();
  assert.equal((await publish(k)).status, 200);
  const first = await stored(k);
  assert.ok(first.firstPublishedAt);
  assert.deepEqual(first.identity!.anchor, identityOf(first.content));
  assert.equal(first.identity!.used, 0);
  assert.equal(first.identity!.limit, 3);
  assert.equal(first.identity!.log[0].kind, 'first_publish');
  assert.equal((await call(unpublishRoute, `/api/edit/${k.slug}/unpublish`, { slug: k.slug }, { method: 'POST', key: k.editKey })).status, 200);
  assert.equal((await publish(k)).status, 200);
  const again = await stored(k);
  assert.equal(again.firstPublishedAt, first.firstPublishedAt, 'written once, never moved');
  assert.deepEqual(again.identity, first.identity);
  const s = await getState(k);
  assert.equal(s.rights.phase, 'counting');
  assert.equal(s.rights.remaining, 3);
  assert.equal(s.rights.onlineUntil, '2028-05-15');
});

test('8: after publishing, an autosave keeps the stored names / date (identityKept) and saves everything else', async () => {
  const k = await newSite();
  await publish(k);
  const s = await getState(k);
  const c = structuredClone(s.content) as ContentRecord;
  c.partners[0].display_name = 'Someone';
  c.partners[0].full_name = 'Someone Else';
  c.name_display = 'Someone & Else';
  c.initials = 'S&E';
  c.date = '2028-01-01';
  c.venue.name = 'The Orchard House';
  c.host_line = 'Together with our families';
  const r = await put(k, c, s.updatedAt);
  assert.equal(r.status, 200);
  assert.equal(r.data.identityKept, true);
  assert.equal(r.data.identity.shown, 'Clara & Julian');
  const site = await stored(k);
  assert.deepEqual(identityOf(site.content), identityOf(s.content));
  assert.equal(site.content.venue.name, 'The Orchard House');
  assert.equal(site.content.host_line, 'Together with our families');
  // an ordinary save that leaves the names alone is not flagged
  const again = await put(k, site.content, site.updatedAt);
  assert.equal(again.data.identityKept, undefined);
});

test('9–10: typo is free; a change needs intent "change" and uses one; after 3 changes -> 403, typo still free', async () => {
  const k = await newSite();
  await publish(k);
  let s = await getState(k);
  const anchor = identityOf(s.content);
  // typo (Clara -> Clare): written, nothing used
  let r = await identityCall(k, renamed(anchor, 'Clare'), 'fix', s.updatedAt);
  assert.equal(r.status, 200, JSON.stringify(r.data));
  assert.equal(r.data.result, 'typo');
  assert.equal(r.data.rights.used, 0);
  assert.equal((await stored(k)).content.partners[0].display_name, 'Clare');
  assert.deepEqual((await stored(k)).identity!.anchor, anchor, 'a free fix does not move the anchor');
  // same identity again: unchanged, nothing written
  const before = (await stored(k)).updatedAt;
  r = await identityCall(k, identityOf((await stored(k)).content), 'fix');
  assert.equal(r.data.result, 'unchanged');
  assert.equal((await stored(k)).updatedAt, before);
  // change without confirmation -> 409 confirm_required, nothing written
  r = await identityCall(k, renamed(anchor, 'Maria', '2027-09-30'), 'fix');
  assert.equal(r.status, 409);
  assert.equal(r.data.code, 'confirm_required');
  assert.equal(r.data.remaining, 3);
  assert.equal((await stored(k)).content.partners[0].display_name, 'Clare');
  // confirmed: names + date together = 1 change, anchor moves
  r = await identityCall(k, renamed(anchor, 'Maria', '2027-09-30'), 'change');
  assert.equal(r.status, 200);
  assert.equal(r.data.result, 'change');
  assert.equal(r.data.rights.used, 1);
  assert.equal(r.data.rights.remaining, 2);
  assert.equal(r.data.hasUnpublishedChanges, true);
  let site = await stored(k);
  assert.equal(site.content.date, '2027-09-30');
  assert.equal(site.identity!.anchor.names[0].display, 'Maria');
  // two more changes
  for (const name of ['Sofia', 'Grace']) {
    s = await getState(k);
    r = await identityCall(k, renamed(identityOf(s.content), name), 'change', s.updatedAt);
    assert.equal(r.status, 200);
  }
  site = await stored(k);
  assert.equal(site.identity!.used, 3);
  // 4th: refused, content unchanged
  r = await identityCall(k, renamed(identityOf(site.content), 'Hannah'), 'change');
  assert.equal(r.status, 403);
  assert.equal(r.data.code, 'no_changes_left');
  assert.equal((await stored(k)).content.partners[0].display_name, 'Grace');
  // a typo is still free (Grace -> Gracie)
  r = await identityCall(k, renamed(identityOf(site.content), 'Gracie'), 'fix');
  assert.equal(r.status, 200);
  assert.equal(r.data.result, 'typo');
  assert.deepEqual(
    (await stored(k)).identity!.log.map((e) => e.kind),
    ['first_publish', 'typo', 'change', 'change', 'change', 'typo'],
  );
  // publishing a typo-fixed draft is fine
  assert.equal((await publish(k)).status, 200);
});

test('11 (local): two tabs send a change at once with 1 change left: exactly one wins, the other gets 409, then 403', async () => {
  const k = await newSite();
  await publish(k);
  const site = await stored(k);
  await getDataAdapter().patchSite(site.id, { identity: { ...site.identity!, used: 2 } });
  const s = await getState(k);
  const a = renamed(identityOf(s.content), 'Hannah');
  const b = renamed(identityOf(s.content), 'Olivia');
  const [ra, rb] = await Promise.all([identityCall(k, a, 'change', s.updatedAt), identityCall(k, b, 'change', s.updatedAt)]);
  const statuses = [ra.status, rb.status].sort();
  assert.deepEqual(statuses, [200, 409], JSON.stringify([ra.data, rb.data]));
  const loser = ra.status === 409 ? a : b;
  const retry = await identityCall(k, loser, 'change', (await getState(k)).updatedAt);
  assert.equal(retry.status, 403);
  assert.equal(retry.data.code, 'no_changes_left');
  assert.equal((await stored(k)).identity!.used, 3);
});

test('11 (blob, two server instances): the last change cannot be used twice', async () => {
  const fake = new FakeBlobStore({ jitterMs: 3 });
  const [one, two] = [0, 1].map(() => new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 }));
  const created = await createSiteWithKeys(one, { slug: 'blob-race', theme: '_sample', content: demoContent() });
  await publishSite(one, created.site.id);
  let site = (await one.getSiteById(created.site.id))!;
  assert.ok(site.firstPublishedAt && site.identity);
  site = await one.patchSite(site.id, { identity: { ...site.identity!, used: 2 } });
  const id = identityOf(site.content);
  const [ra, rb] = await Promise.all([
    identityChangeFor(one, site, { identity: renamed(id, 'Hannah'), intent: 'change', baseUpdatedAt: site.updatedAt }),
    identityChangeFor(two, site, { identity: renamed(id, 'Olivia'), intent: 'change', baseUpdatedAt: site.updatedAt }),
  ]);
  assert.deepEqual([ra.status, rb.status].sort(), [200, 409]);
  const fresh = (await two.getSiteById(site.id))!;
  assert.equal(fresh.identity!.used, 3);
  const loser = ra.status === 409 ? 'Hannah' : 'Olivia';
  const retry = await identityChangeFor(two, fresh, { identity: renamed(identityOf(fresh.content), loser), intent: 'change', baseUpdatedAt: fresh.updatedAt });
  assert.equal(retry.status, 403);
  // a typo on blob storage is free and keeps the anchor
  const typo = await identityChangeFor(one, fresh, { identity: { ...identityOf(fresh.content), initials: `${identityOf(fresh.content).initials}.` }, intent: 'fix' });
  assert.equal(typo.status, 200);
  const after = (await one.getSiteById(site.id))!;
  assert.equal(after.identity!.used, 3);
  assert.deepEqual(after.identity!.anchor, fresh.identity!.anchor);
});

test('12: support grant adds a change and logs it', async () => {
  const k = await newSite();
  await assert.rejects(grantIdentityChanges(getDataAdapter(), k.id, 1, 'not yet'), /never published/);
  await publish(k);
  const site = await stored(k);
  await getDataAdapter().patchSite(site.id, { identity: { ...site.identity!, used: 3 } });
  assert.equal((await getState(k)).rights.remaining, 0);
  await grantIdentityChanges(getDataAdapter(), k.id, 1, 'wedding moved (order checked)');
  const s = await getState(k);
  assert.equal(s.rights.remaining, 1);
  assert.equal(s.rights.granted, 1);
  const log = (await stored(k)).identity!.log;
  assert.equal(log.at(-1)!.kind, 'grant');
  assert.equal(log.at(-1)!.by, 'support');
  assert.match(log.at(-1)!.note!, /wedding moved/);
  const r = await identityCall(k, renamed(identityOf(s.content), 'Hannah'), 'change', s.updatedAt);
  assert.equal(r.status, 200);
});

test('13: a date that would archive the site at once is refused (first publish and /identity)', async () => {
  const k = await newSite((c) => {
    c.date = '2024-01-10';
    c.rsvp.deadline = '2024-01-01';
  });
  const p = await publish(k);
  assert.equal(p.status, 422);
  assert.equal(p.data.issues[0].code, 'date_archives_site');
  const k2 = await newSite();
  await publish(k2);
  const s = await getState(k2);
  const r = await identityCall(k2, { ...identityOf(s.content), date: '2024-05-15' }, 'change');
  assert.equal(r.status, 422);
  assert.equal(r.data.code, 'date_archives_site');
});

test('14: archived site — writes 403, panel state readable, CSV ok, public pages / photo / .ics 410, guest RSVP closed', async () => {
  const k = await newSite((c) => {
    c.rsvp.deadline = '2027-05-01';
  });
  // a photo used by the published content
  const up = await call(photoRoute, `/api/edit/${k.slug}/photo?slot=hero`, { slug: k.slug }, { method: 'POST', key: k.editKey, body: Buffer.from(tinyPng()), type: 'image/png' });
  assert.equal(up.status, 200);
  const s0 = await getState(k);
  const withPhoto = structuredClone(s0.content) as ContentRecord;
  withPhoto.media = { ...withPhoto.media, hero_portrait: up.data.url };
  assert.equal((await put(k, withPhoto, s0.updatedAt)).status, 200);
  assert.equal((await publish(k)).status, 200);
  const mediaPath = (up.data.url as string).replace(/^\/media\//, '').split('/');
  assert.equal((await call(mediaRoute, up.data.url, { path: mediaPath })).status, 200);
  assert.equal((await call(siteRoute, `/${k.slug}`, { slug: k.slug })).status, 200);

  await setArchiveOverride(getDataAdapter(), k.id, '2020-01-01', 'test: archive now');
  const s = await getState(k);
  assert.equal(s.rights.archived, true);
  assert.equal(s.rights.phase, 'archived');
  const c = structuredClone(s.content) as ContentRecord;
  c.venue.name = 'Changed';
  for (const [name, res] of [
    ['PUT', await put(k, c)],
    ['photo', await call(photoRoute, `/api/edit/${k.slug}/photo?slot=hero`, { slug: k.slug }, { method: 'POST', key: k.editKey, body: Buffer.from(tinyPng()), type: 'image/png' })],
    ['publish', await publish(k)],
    ['unpublish', await call(unpublishRoute, `/api/edit/${k.slug}/unpublish`, { slug: k.slug }, { method: 'POST', key: k.editKey })],
    ['identity', await identityCall(k, identityOf(s.content), 'fix')],
    ['RSVP remove', await call(repliesActionRoute, `/api/rsvp/${k.slug}/responses`, { slug: k.slug }, { method: 'POST', key: k.editKey, json: { action: 'remove', ids: ['00000000-0000-0000-0000-000000000000'] } })],
  ] as const) {
    assert.equal(res.status, 403, name);
    assert.equal(res.data.code, 'archived', name);
  }
  assert.equal((await stored(k)).content.venue.name, s0.content.venue.name);
  assert.equal((await call(repliesRoute, `/api/rsvp/${k.slug}/responses`, { slug: k.slug }, { key: k.editKey })).status, 200, 'replies still readable');
  const csv = await call(exportRoute, `/api/rsvp/${k.slug}/export`, { slug: k.slug }, { key: k.editKey });
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get('content-type') ?? '', /text\/csv/);

  const pub = await call(siteRoute, `/${k.slug}`, { slug: k.slug });
  assert.equal(pub.status, 410);
  assert.match(pub.data, /has been archived/);
  assert.doesNotMatch(pub.data, /Clara/, 'no names on the archive page');
  assert.match(pub.headers.get('x-robots-tag') ?? '', /noindex/);
  assert.equal((await call(pageRoute, `/${k.slug}/details`, { slug: k.slug, page: 'details' })).status, 410);
  assert.equal((await call(icsRoute, `/${k.slug}/event.ics`, { slug: k.slug })).status, 410);
  assert.equal((await call(mediaRoute, up.data.url, { path: mediaPath })).status, 410);
  assert.equal((await call(siteRoute, `/${k.slug}?preview=${k.previewKey}`, { slug: k.slug })).status, 200, 'the couple still sees it');
  assert.equal((await call(rsvpStatusRoute, `/api/rsvp/${k.slug}`, { slug: k.slug })).status, 404);
  const reply = await call(rsvpPostRoute, `/api/rsvp/${k.slug}`, { slug: k.slug }, { method: 'POST', json: { name: 'Ada', attending: true, guests: 1 } });
  assert.equal(reply.status, 404);
});

test('15: a record published before G060 is read with the right anchor and 0 used, and persisted on the next write', async () => {
  const k = await newSite();
  await publish(k);
  const site = await stored(k);
  // remove the bookkeeping: what a record written before G060 looks like
  await getDataAdapter().patchSite(site.id, { identity: null, firstPublishedAt: null });
  const legacy = await stored(k);
  assert.equal(legacy.identity, null);
  const s = await getState(k);
  assert.equal(s.rights.phase, 'counting');
  assert.equal(s.rights.used, 0);
  assert.equal(s.rights.firstPublishedAt, legacy.publishedAt);
  assert.deepEqual(s.rights.anchor, identityOf(legacy.publishedContent));
  const c = structuredClone(s.content) as ContentRecord;
  c.name_display = 'Somebody Else';
  assert.equal((await put(k, c, s.updatedAt)).data.identityKept, true, 'the autosave already protects it');
  const r = await identityCall(k, renamed(identityOf(s.content), 'Maria'), 'change');
  assert.equal(r.status, 200);
  const after = await stored(k);
  assert.equal(after.firstPublishedAt, legacy.publishedAt);
  assert.equal(after.identity!.used, 1);
});

test('16: wrong key, preview key and other site key get the same 401 on /identity', async () => {
  const k = await newSite();
  const other = await newSite();
  await publish(k);
  const id = identityOf((await stored(k)).content);
  for (const key of ['nope', k.previewKey, other.editKey]) {
    const r = await identityCall(k, id, 'fix', undefined, key);
    assert.equal(r.status, 401);
    assert.equal(r.data.code, 'unauthorized');
  }
  const missing = await call(identityRoute, `/api/edit/${k.slug}/identity`, { slug: k.slug }, { method: 'POST', json: { identity: id, intent: 'fix' } });
  assert.equal(missing.status, 401);
  // malformed bodies
  const bad = await call(identityRoute, `/api/edit/${k.slug}/identity`, { slug: k.slug }, { method: 'POST', key: k.editKey, json: { identity: { names: 'x' } } });
  assert.equal(bad.status, 400);
  const empty = await identityCall(k, { ...id, names: [{ display: '', full: '' }, id.names[1]] }, 'change');
  assert.equal(empty.status, 422);
  assert.equal(empty.data.code, 'invalid_identity');
  const fewer = await identityCall(k, { ...id, names: [id.names[0]] }, 'change');
  assert.equal(fewer.status, 422);
});

test('publish defense: a draft whose identity is a change from the anchor is refused with identity_mismatch', async () => {
  const k = await newSite();
  await publish(k);
  const site = await stored(k);
  // bypass the API (what only an older record could hold)
  const c = withIdentity(site.content, renamed(identityOf(site.content), 'Someone'));
  await (getDataAdapter() as DataAdapter).patchSite(site.id, { content: c });
  const r = await publish(k);
  assert.equal(r.status, 409);
  assert.equal(r.data.code, 'identity_mismatch');
});
