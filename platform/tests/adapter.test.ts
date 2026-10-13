import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { NotFoundError, SlugTakenError, type NewSite } from '../lib/data/types.ts';
import { hashKey } from '../lib/keys.ts';
import { UploadRejectedError, MAX_UPLOAD_BYTES } from '../lib/uploads.ts';
import { ContentInvalidError, createSiteWithKeys, InvalidSlugError, publishSite, UnknownThemeError, canEdit, canPreview } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');

function newSite(slug = 'clara-and-julian'): NewSite {
  return { slug, theme: '_sample', content: demoContent(), editKeyHash: hashKey('e'.repeat(43)), previewKeyHash: hashKey('p'.repeat(43)) };
}

test('createSite / getSiteBySlug / getSiteById round trip; slugs are unique', async () => {
  const a = new LocalAdapter(tmpDir());
  const site = await a.createSite({ ...newSite(), orderRef: '1234567890', ownerEmail: 'buyer@example.org' });
  assert.equal(site.status, 'draft');
  assert.equal(site.publishedContent, null);
  assert.equal((await a.getSiteBySlug('clara-and-julian'))?.id, site.id);
  assert.equal((await a.getSiteById(site.id))?.slug, 'clara-and-julian');
  assert.equal(await a.getSiteBySlug('nobody-here'), null);
  assert.equal(await a.getSiteBySlug('../../etc/passwd'), null);
  assert.equal(await a.getSiteById('../sites/x'), null);
  await assert.rejects(a.createSite(newSite()), SlugTakenError);
  assert.deepEqual((await a.findSitesByOrderRef('1234567890')).map((s) => s.id), [site.id]);
  assert.deepEqual(await a.findSitesByOrderRef('other'), []);
});

test('concurrent createSite with the same slug: exactly one wins', async () => {
  const a = new LocalAdapter(tmpDir());
  const results = await Promise.allSettled(Array.from({ length: 8 }, () => a.createSite(newSite('race-slug'))));
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
  assert.ok(results.filter((r) => r.status === 'rejected').every((r) => (r as PromiseRejectedResult).reason instanceof SlugTakenError));
});

test('returned records are copies; data persists across adapter instances', async () => {
  const dir = tmpDir();
  const a = new LocalAdapter(dir);
  const site = await a.createSite(newSite());
  site.content.name_display = 'mutated';
  assert.equal((await a.getSiteById(site.id))?.content.name_display, 'Clara & Julian');
  const b = new LocalAdapter(dir);
  assert.equal((await b.getSiteBySlug('clara-and-julian'))?.id, site.id);
});

test('updateContent edits the draft; publish snapshots it; unpublish keeps the snapshot', async () => {
  const a = new LocalAdapter(tmpDir());
  const site = await a.createSite(newSite());
  const published = await a.publish(site.id);
  assert.equal(published.status, 'published');
  assert.ok(published.publishedAt);
  const edited = demoContent();
  edited.name_display = 'Clara & Julian (edited)';
  const afterEdit = await a.updateContent(site.id, edited);
  assert.equal(afterEdit.content.name_display, 'Clara & Julian (edited)');
  assert.equal(afterEdit.publishedContent?.name_display, 'Clara & Julian');
  const republished = await a.publish(site.id);
  assert.equal(republished.publishedContent?.name_display, 'Clara & Julian (edited)');
  const unpub = await a.unpublish(site.id);
  assert.equal(unpub.status, 'draft');
  assert.ok(unpub.publishedContent);
  await assert.rejects(a.updateContent('00000000-0000-4000-8000-000000000000', edited), NotFoundError);
  await assert.rejects(a.publish('00000000-0000-4000-8000-000000000000'), NotFoundError);
});

test('concurrent updates do not corrupt the record', async () => {
  const a = new LocalAdapter(tmpDir());
  const site = await a.createSite(newSite());
  await Promise.all(
    Array.from({ length: 20 }, (_, i) => {
      const c = demoContent();
      c.host_line = `v${i}`;
      return a.updateContent(site.id, c);
    }),
  );
  const final = await a.getSiteById(site.id);
  assert.match(final!.content.host_line!, /^v\d+$/);
});

test('RSVPs are stored per site, oldest first', async () => {
  const a = new LocalAdapter(tmpDir());
  const s1 = await a.createSite(newSite('site-one'));
  const s2 = await a.createSite(newSite('site-two'));
  await a.saveRsvp(s1.id, { name: 'Guest One', attending: true, guests: 2, email: 'one@example.org' });
  await a.saveRsvp(s1.id, { name: 'Guest Two', attending: false, guests: 0, message: 'Sorry!' });
  await a.saveRsvp(s2.id, { name: 'Other', attending: true, guests: 1 });
  const list = await a.listRsvps(s1.id);
  assert.deepEqual(list.map((r) => r.name), ['Guest One', 'Guest Two']);
  assert.equal(list[1].email, null);
  assert.equal(list[1].message, 'Sorry!');
  assert.equal((await a.listRsvps(s2.id)).length, 1);
  assert.deepEqual(await a.listRsvps('not-a-uuid'), []);
  await assert.rejects(a.saveRsvp('00000000-0000-4000-8000-000000000000', { name: 'x', attending: true, guests: 1 }), NotFoundError);
});

test('savePhoto stores real images only and readPhoto refuses odd paths', async () => {
  const dir = tmpDir();
  const a = new LocalAdapter(dir);
  const site = await a.createSite(newSite());
  const png = tinyPng();
  const saved = await a.savePhoto(site.id, { bytes: png, contentType: 'image/png' });
  assert.match(saved.url, new RegExp(`^/media/${site.id}/[0-9a-f]{32}\\.png$`));
  assert.equal(saved.contentType, 'image/png');
  const read = await a.readPhoto(saved.path);
  assert.deepEqual(Buffer.from(read!.bytes), Buffer.from(png));

  const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>');
  await assert.rejects(a.savePhoto(site.id, { bytes: svg, contentType: 'image/png' }), (e: unknown) => e instanceof UploadRejectedError && e.reason === 'unsupported_type');
  await assert.rejects(a.savePhoto(site.id, { bytes: new Uint8Array(0) }), (e: unknown) => e instanceof UploadRejectedError && e.reason === 'empty');
  const big = new Uint8Array(MAX_UPLOAD_BYTES + 1);
  big.set(png);
  await assert.rejects(a.savePhoto(site.id, { bytes: big }), (e: unknown) => e instanceof UploadRejectedError && e.reason === 'too_large');
  await assert.rejects(a.savePhoto('00000000-0000-4000-8000-000000000000', { bytes: png }), NotFoundError);

  for (const bad of ['../sites/x.json', `${site.id}/../../sites/${site.id}.json`, `${site.id}/x.png`, `${site.id}/${'a'.repeat(32)}.svg`]) {
    assert.equal(await a.readPhoto(bad), null, bad);
  }
  assert.equal(readdirSync(path.join(dir, 'uploads', site.id)).length, 1);
});

test('deleteSite removes site, slug, RSVPs and photos', async () => {
  const dir = tmpDir();
  const a = new LocalAdapter(dir);
  const site = await a.createSite(newSite());
  await a.saveRsvp(site.id, { name: 'G', attending: true, guests: 1 });
  await a.savePhoto(site.id, { bytes: tinyPng() });
  await a.deleteSite(site.id);
  assert.equal(await a.getSiteBySlug('clara-and-julian'), null);
  assert.equal(existsSync(path.join(dir, 'uploads', site.id)), false);
  assert.equal(existsSync(path.join(dir, 'rsvps', `${site.id}.json`)), false);
  await a.deleteSite(site.id); // no-op
  await a.createSite(newSite()); // slug free again
});

test('only key hashes are written to disk', async () => {
  const dir = tmpDir();
  const a = new LocalAdapter(dir);
  const { site, editKey, previewKey } = await createSiteWithKeys(a, { slug: 'clara-and-julian', theme: '_sample', content: demoContent() });
  const raw = readFileSync(path.join(dir, 'sites', `${site.id}.json`), 'utf8');
  assert.ok(!raw.includes(editKey));
  assert.ok(!raw.includes(previewKey));
  assert.ok(raw.includes(hashKey(editKey)));
  assert.ok(canEdit(site, editKey));
  assert.ok(!canEdit(site, previewKey));
  assert.ok(canPreview(site, previewKey));
  assert.ok(!canPreview(site, editKey));
});

test('createSiteWithKeys / publishSite enforce slug, theme and content rules', async () => {
  const a = new LocalAdapter(tmpDir());
  await assert.rejects(createSiteWithKeys(a, { slug: 'edit', theme: '_sample', content: demoContent() }), InvalidSlugError);
  await assert.rejects(createSiteWithKeys(a, { slug: 'Bad Slug', theme: '_sample', content: demoContent() }), InvalidSlugError);
  await assert.rejects(createSiteWithKeys(a, { slug: 'good-slug', theme: 'no-such-theme', content: demoContent() }), UnknownThemeError);
  const bad = demoContent();
  bad.rsvp.deadline = '2030-01-01';
  await assert.rejects(createSiteWithKeys(a, { slug: 'good-slug', theme: '_sample', content: bad }), ContentInvalidError);

  const { site } = await createSiteWithKeys(a, { slug: 'good-slug', theme: '_sample', content: demoContent() });
  await a.updateContent(site.id, bad); // drafts may be invalid while editing...
  await assert.rejects(publishSite(a, site.id), ContentInvalidError); // ...but cannot be published
  assert.equal((await a.getSiteById(site.id))?.status, 'draft');
  await a.updateContent(site.id, demoContent());
  assert.equal((await publishSite(a, site.id)).status, 'published');
});
