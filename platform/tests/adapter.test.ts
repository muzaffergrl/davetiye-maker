// DataAdapter contract tests, run against every adapter: `local` (JSON files in a temp folder) and
// `blob` (Vercel Blob adapter on the in-memory SDK fake, tests/fake-blob.ts). Blob-only behaviour
// (indexes across server instances, ETag conflicts, caching) is in blob-adapter.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { NotFoundError, SlugTakenError, StaleSiteError, type DataAdapter, type NewSite } from '../lib/data/types.ts';
import { hashKey } from '../lib/keys.ts';
import { UploadRejectedError, MAX_UPLOAD_BYTES } from '../lib/uploads.ts';
import { ContentInvalidError, createSiteWithKeys, InvalidSlugError, publishSite, reissueKeys, UnknownThemeError, canEdit, canPreview } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');

interface Backend {
  adapter: DataAdapter;
  /** Another adapter on the same storage (a second process / server instance). */
  reopen(): DataAdapter;
  /** Every stored file (relative path -> bytes). */
  files(): Map<string, Buffer>;
}

function walk(dir: string, rel = ''): [string, Buffer][] {
  let entries;
  try {
    entries = readdirSync(path.join(dir, rel), { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.flatMap((e): [string, Buffer][] => {
    const p = rel ? `${rel}/${e.name}` : e.name;
    return e.isDirectory() ? walk(dir, p) : [[p, readFileSync(path.join(dir, p))]];
  });
}

const BACKENDS: { name: 'local' | 'blob'; make(): Backend }[] = [
  {
    name: 'local',
    make() {
      const dir = tmpDir();
      return { adapter: new LocalAdapter(dir), reopen: () => new LocalAdapter(dir), files: () => new Map(walk(dir)) };
    },
  },
  {
    name: 'blob',
    make() {
      const fake = new FakeBlobStore();
      const open = () => new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 });
      return {
        adapter: open(),
        reopen: open,
        files: () => new Map(fake.paths().map((p) => [p, Buffer.from(fake.object(p)!.bytes)])),
      };
    },
  },
];

function newSite(slug = 'clara-and-julian'): NewSite {
  return { slug, theme: '_sample', content: demoContent(), editKeyHash: hashKey('e'.repeat(43)), previewKeyHash: hashKey('p'.repeat(43)) };
}

const PHOTO_FILE = /\.(png|jpe?g|webp|avif)$/;

for (const { name, make } of BACKENDS) {
  test(`[${name}] createSite / getSiteBySlug / getSiteById round trip; slugs are unique`, async () => {
    const { adapter: a } = make();
    const site = await a.createSite({ ...newSite(), orderRef: '1234567890', ownerEmail: 'buyer@example.org' });
    assert.equal(site.status, 'draft');
    assert.equal(site.publishedContent, null);
    assert.equal(site.orderRef, '1234567890');
    assert.equal(site.ownerEmail, 'buyer@example.org');
    assert.equal((await a.getSiteBySlug('clara-and-julian'))?.id, site.id);
    assert.equal((await a.getSiteById(site.id))?.slug, 'clara-and-julian');
    assert.deepEqual(await a.getSiteById(site.id), site, 'stored record = returned record');
    assert.equal(await a.getSiteBySlug('nobody-here'), null);
    assert.equal(await a.getSiteBySlug('../../etc/passwd'), null);
    assert.equal(await a.getSiteById('../sites/x'), null);
    await assert.rejects(a.createSite(newSite()), SlugTakenError);
    assert.deepEqual((await a.findSitesByOrderRef('1234567890')).map((s) => s.id), [site.id]);
    assert.deepEqual(await a.findSitesByOrderRef('other'), []);
  });

  test(`[${name}] concurrent createSite with the same slug: exactly one wins`, async () => {
    const { adapter: a } = make();
    const results = await Promise.allSettled(Array.from({ length: 8 }, () => a.createSite(newSite('race-slug'))));
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    assert.ok(results.filter((r) => r.status === 'rejected').every((r) => (r as PromiseRejectedResult).reason instanceof SlugTakenError));
  });

  test(`[${name}] returned records are copies; data persists across adapter instances`, async () => {
    const { adapter: a, reopen } = make();
    const site = await a.createSite(newSite());
    site.content.name_display = 'mutated';
    assert.equal((await a.getSiteById(site.id))?.content.name_display, 'Clara & Julian');
    const updated = await a.updateContent(site.id, demoContent());
    updated.content.name_display = 'mutated again';
    assert.equal((await a.getSiteById(site.id))?.content.name_display, 'Clara & Julian');
    const b = reopen();
    assert.equal((await b.getSiteBySlug('clara-and-julian'))?.id, site.id);
  });

  test(`[${name}] updateContent edits the draft; publish snapshots it; unpublish keeps the snapshot`, async () => {
    const { adapter: a } = make();
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
    assert.deepEqual(await a.getSiteById(site.id), unpub);
    await assert.rejects(a.updateContent('00000000-0000-4000-8000-000000000000', edited), NotFoundError);
    await assert.rejects(a.publish('00000000-0000-4000-8000-000000000000'), NotFoundError);
    await assert.rejects(a.unpublish('not-a-uuid'), NotFoundError);
  });

  test(`[${name}] concurrent updates do not corrupt the record`, async () => {
    const { adapter: a } = make();
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

  test(`[${name}] RSVPs are stored per site, oldest first`, async () => {
    const { adapter: a } = make();
    const s1 = await a.createSite(newSite('site-one'));
    const s2 = await a.createSite(newSite('site-two'));
    await a.saveRsvp(s1.id, { name: 'Guest One', attending: true, guests: 2, email: 'one@example.org' });
    await a.saveRsvp(s1.id, { name: 'Guest Two', attending: false, guests: 0, message: 'Sorry!' });
    await a.saveRsvp(s2.id, { name: 'Other', attending: true, guests: 1 });
    const list = await a.listRsvps(s1.id);
    assert.deepEqual(list.map((r) => r.name), ['Guest One', 'Guest Two']);
    assert.equal(list[0].email, 'one@example.org');
    assert.equal(list[0].siteId, s1.id);
    assert.equal(list[1].email, null);
    assert.equal(list[1].message, 'Sorry!');
    assert.equal((await a.listRsvps(s2.id)).length, 1);
    assert.deepEqual(await a.listRsvps('not-a-uuid'), []);
    await assert.rejects(a.saveRsvp('00000000-0000-4000-8000-000000000000', { name: 'x', attending: true, guests: 1 }), NotFoundError);
  });

  test(`[${name}] RSVP answers to custom questions (G051) are stored and listed; replies without them have no answers field`, async () => {
    const { adapter: a } = make();
    const s = await a.createSite(newSite('answers-site'));
    const answers = [{ id: 'meal', question: 'Meal choice', answer: 'Fish' }];
    const saved = await a.saveRsvp(s.id, { name: 'With', attending: true, guests: 1, answers });
    assert.deepEqual(saved.answers, answers);
    answers[0].answer = 'changed after saving';
    await a.saveRsvp(s.id, { name: 'Without', attending: true, guests: 1 });
    await a.saveRsvp(s.id, { name: 'Empty list', attending: true, guests: 1, answers: [] });
    const list = await a.listRsvps(s.id);
    assert.deepEqual(list[0].answers, [{ id: 'meal', question: 'Meal choice', answer: 'Fish' }], 'stored copy, not the caller\'s array');
    assert.equal('answers' in list[1], false);
    assert.equal('answers' in list[2], false);
  });

  test(`[${name}] savePhoto stores real images only and readPhoto refuses odd paths`, async () => {
    const { adapter: a, files } = make();
    const site = await a.createSite(newSite());
    const png = tinyPng();
    const saved = await a.savePhoto(site.id, { bytes: png, contentType: 'image/png' });
    assert.match(saved.url, new RegExp(`^/media/${site.id}/[0-9a-f]{32}\\.png$`));
    assert.equal(saved.path, saved.url.slice('/media/'.length));
    assert.equal(saved.contentType, 'image/png');
    assert.equal(saved.size, png.length);
    assert.ok(a.readPhoto, 'adapter serves photos through /media');
    const read = await a.readPhoto!(saved.path);
    assert.deepEqual(Buffer.from(read!.bytes), Buffer.from(png));
    assert.equal(read!.contentType, 'image/png');

    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>');
    await assert.rejects(a.savePhoto(site.id, { bytes: svg, contentType: 'image/png' }), (e: unknown) => e instanceof UploadRejectedError && e.reason === 'unsupported_type');
    await assert.rejects(a.savePhoto(site.id, { bytes: new Uint8Array(0) }), (e: unknown) => e instanceof UploadRejectedError && e.reason === 'empty');
    const big = new Uint8Array(MAX_UPLOAD_BYTES + 1);
    big.set(png);
    await assert.rejects(a.savePhoto(site.id, { bytes: big }), (e: unknown) => e instanceof UploadRejectedError && e.reason === 'too_large');
    await assert.rejects(a.savePhoto('00000000-0000-4000-8000-000000000000', { bytes: png }), NotFoundError);

    for (const bad of ['../sites/x.json', `${site.id}/../../sites/${site.id}.json`, `${site.id}/x.png`, `${site.id}/${'a'.repeat(32)}.svg`]) {
      assert.equal(await a.readPhoto!(bad), null, bad);
    }
    assert.equal(await a.readPhoto!(`${site.id}/${'a'.repeat(32)}.png`), null, 'missing photo');
    const photos = [...files().keys()].filter((p) => p.includes(site.id) && PHOTO_FILE.test(p));
    assert.equal(photos.length, 1, photos.join(', '));
  });

  test(`[${name}] deleteSite removes site, slug, RSVPs and photos`, async () => {
    const { adapter: a, files } = make();
    const site = await a.createSite({ ...newSite(), orderRef: '5550001234' });
    const other = await a.createSite(newSite('other-site'));
    await a.saveRsvp(site.id, { name: 'G', attending: true, guests: 1 });
    await a.saveRsvp(other.id, { name: 'H', attending: true, guests: 1 });
    await a.savePhoto(site.id, { bytes: tinyPng() });
    await a.deleteSite(site.id);
    assert.equal(await a.getSiteBySlug('clara-and-julian'), null);
    assert.equal(await a.getSiteById(site.id), null);
    assert.deepEqual(await a.listRsvps(site.id), []);
    assert.deepEqual(await a.findSitesByOrderRef('5550001234'), []);
    const left = [...files().keys()];
    assert.deepEqual(left.filter((p) => p.includes(site.id) || p.includes('clara-and-julian')), [], left.join(', '));
    assert.equal((await a.listRsvps(other.id)).length, 1, 'other sites are untouched');
    await a.deleteSite(site.id); // no-op
    await a.createSite({ ...newSite(), orderRef: '5550001234' }); // slug (and order) free again
  });

  test(`[${name}] only key hashes are written to storage`, async () => {
    const { adapter: a, files } = make();
    const { site, editKey, previewKey } = await createSiteWithKeys(a, { slug: 'clara-and-julian', theme: '_sample', content: demoContent() });
    const all = [...files().values()].map((b) => b.toString('utf8')).join('\n');
    assert.ok(!all.includes(editKey));
    assert.ok(!all.includes(previewKey));
    assert.ok(all.includes(hashKey(editKey)));
    assert.ok(canEdit(site, editKey));
    assert.ok(!canEdit(site, previewKey));
    assert.ok(canPreview(site, previewKey));
    assert.ok(!canPreview(site, editKey));
  });

  test(`[${name}] createSiteWithKeys / publishSite enforce slug, theme and content rules`, async () => {
    const { adapter: a, files } = make();
    await assert.rejects(createSiteWithKeys(a, { slug: 'edit', theme: '_sample', content: demoContent() }), InvalidSlugError);
    await assert.rejects(createSiteWithKeys(a, { slug: 'Bad Slug', theme: '_sample', content: demoContent() }), InvalidSlugError);
    await assert.rejects(createSiteWithKeys(a, { slug: 'good-slug', theme: 'no-such-theme', content: demoContent() }), UnknownThemeError);
    const bad = demoContent();
    bad.rsvp.deadline = '2030-01-01';
    await assert.rejects(createSiteWithKeys(a, { slug: 'good-slug', theme: '_sample', content: bad }), ContentInvalidError);
    assert.equal(files().size, 0, 'rejected sites leave nothing behind');

    const { site } = await createSiteWithKeys(a, { slug: 'good-slug', theme: '_sample', content: demoContent() });
    await a.updateContent(site.id, bad); // drafts may be invalid while editing...
    await assert.rejects(publishSite(a, site.id), ContentInvalidError); // ...but cannot be published
    assert.equal((await a.getSiteById(site.id))?.status, 'draft');
    await a.updateContent(site.id, demoContent());
    assert.equal((await publishSite(a, site.id)).status, 'published');
  });

  test(`[${name}] publish copies exactly the validated version: a save in between is never published unchecked`, async () => {
    const { adapter: a } = make();
    const { site } = await createSiteWithKeys(a, { slug: 'race-publish', theme: '_sample', content: demoContent() });
    // adapter level: a stale expected version changes nothing
    const fresh = (await a.getSiteById(site.id))!;
    await a.updateContent(site.id, demoContent());
    await assert.rejects(a.publish(site.id, { expectedUpdatedAt: fresh.updatedAt }), StaleSiteError);
    assert.equal((await a.getSiteById(site.id))!.status, 'draft');
    // publishSite racing an autosave of an INVALID draft (empty name): it never publishes the invalid one
    for (let round = 0; round < 5; round++) {
      const broken = demoContent();
      broken.partners[0].display_name = '';
      const results = await Promise.allSettled([publishSite(a, site.id), a.updateContent(site.id, broken)]);
      const after = (await a.getSiteById(site.id))!;
      if (after.publishedContent) assert.notEqual(after.publishedContent.partners[0].display_name, '', `round ${round}: invalid content went live`);
      if (results[0].status === 'rejected') assert.ok(results[0].reason instanceof ContentInvalidError, String(results[0].reason));
      await a.updateContent(site.id, demoContent());
    }
    // with the version the buyer saw: a newer draft is a conflict
    const seen = (await a.getSiteById(site.id))!.updatedAt;
    await a.updateContent(site.id, demoContent());
    await assert.rejects(publishSite(a, site.id, { expectedUpdatedAt: seen }), StaleSiteError);
  });

  test(`[${name}] updateKeys / reissueKeys: the old links stop working, the new ones work`, async () => {
    const { adapter: a, files } = make();
    const first = await createSiteWithKeys(a, { slug: 'lost-link', theme: '_sample', content: demoContent() });
    const again = await reissueKeys(a, first.site.id);
    const stored = (await a.getSiteById(first.site.id))!;
    assert.ok(!canEdit(stored, first.editKey), 'old edit link is dead');
    assert.ok(!canPreview(stored, first.previewKey), 'old preview link is dead');
    assert.ok(canEdit(stored, again.editKey));
    assert.ok(canPreview(stored, again.previewKey));
    assert.deepEqual(stored.content, first.site.content, 'content untouched');
    assert.ok(![...files().values()].some((b) => b.toString('utf8').includes(again.editKey)), 'only the hash is stored');
    await assert.rejects(reissueKeys(a, '00000000-0000-4000-8000-000000000000'), NotFoundError);
  });

  test(`[${name}] deleteRsvps / setRsvpsHeld act only on this site's replies`, async () => {
    const { adapter: a } = make();
    const s1 = await a.createSite(newSite('site-one'));
    const s2 = await a.createSite(newSite('site-two'));
    const keep = await a.saveRsvp(s1.id, { name: 'Real', attending: true, guests: 2 });
    const junk = await a.saveRsvp(s1.id, { name: 'Junk', attending: true, guests: 9, held: true });
    const other = await a.saveRsvp(s2.id, { name: 'Other', attending: true, guests: 1 });
    assert.equal(junk.held, true);
    assert.deepEqual((await a.listRsvps(s1.id)).map((r) => [r.name, Boolean(r.held)]), [['Real', false], ['Junk', true]]);
    assert.equal(await a.setRsvpsHeld(s1.id, [junk.id, other.id], false), 1, 'another site\'s reply is not touched');
    assert.equal((await a.listRsvps(s1.id)).find((r) => r.id === junk.id)!.held, undefined);
    assert.equal(await a.setRsvpsHeld(s1.id, [junk.id], true), 1);
    assert.equal(await a.setRsvpsHeld(s1.id, [junk.id], true), 0, 'no change, nothing counted');
    assert.equal(await a.deleteRsvps(s1.id, [junk.id, other.id, 'nope']), 1);
    assert.deepEqual((await a.listRsvps(s1.id)).map((r) => r.id), [keep.id]);
    assert.deepEqual((await a.listRsvps(s2.id)).map((r) => r.id), [other.id]);
    assert.equal(await a.deleteRsvps(s1.id, []), 0);
    assert.equal(await a.deleteRsvps('not-a-uuid', [keep.id]), 0);
  });
}
