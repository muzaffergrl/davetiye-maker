// G955: scripts/blob-backup.mjs — read-only export of the Blob store (sites, indexes, replies, photos, documents,
// counters) to a local folder with a manifest; resumable; --dry-run writes nothing. Run against the in-memory fake of
// the store (tests/fake-blob.ts) through a client that only lets list() and get() through.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chmodSync, cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { insideRepo, listStore, REPO_ROOT, runBackup, safeRelative } from '../scripts/blob-backup.mjs';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

before(() => {
  const themes = tmpDir('g955-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
});

/** The fake store, filled through the real adapter: a site with an order, a reply, a photo, a counter. */
async function filledStore() {
  const fake = new FakeBlobStore();
  const blob = new BlobAdapter({ token: fake.token, client: fake.client() });
  const content = demoContent();
  const { site } = await createSiteWithKeys(blob, { slug: 'backup-site', theme: '_sample', content, orderRef: '9550000001', ownerEmail: 'ann@example.com' });
  await publishSite(blob, site.id);
  await blob.saveRsvp(site.id, { name: 'Guest One', attending: true, guests: 2 });
  await blob.savePhoto(site.id, { bytes: tinyPng() });
  await blob.hitCounter('rsvp:ip:test', 60_000);
  await blob.updateSiteDoc(site.id, 'sheets', () => ({ connected: false }));
  return { fake, siteId: site.id };
}

/** Only list() and get() reach the store; anything else fails the test. */
function readOnly(fake: FakeBlobStore) {
  const c = fake.client();
  const calls: string[] = [];
  return {
    calls,
    client: {
      list: (o: Parameters<typeof c.list>[0]) => (calls.push('list'), c.list(o)),
      get: (p: string, o: Parameters<typeof c.get>[1]) => (calls.push('get'), c.get(p, o)),
      put: () => assert.fail('backup must never write to the store'),
      del: () => assert.fail('backup must never delete from the store'),
    },
  };
}

const quiet = () => undefined;

test('backup: every blob copied byte for byte, manifest with sizes and SHA-256, nothing written to the store', async () => {
  const { fake, siteId } = await filledStore();
  const before = fake.paths();
  const { client, calls } = readOnly(fake);
  const out = tmpDir('g955-out-');
  const s = await runBackup({ client, token: fake.token, out, log: quiet });
  assert.equal(s.complete, true);
  assert.deepEqual(s.files.map((f: { pathname: string }) => f.pathname), [...before].sort());
  for (const want of ['sites/', 'slugs/', 'orders/', 'rsvps/', 'media/', 'docs/', 'limits/']) assert.ok(s.prefixes[want] >= 1, `${want} in the backup`);
  for (const f of s.files as Array<{ pathname: string; size: number; sha256: string }>) {
    const bytes = readFileSync(path.join(out, 'files', ...f.pathname.split('/')));
    assert.equal(bytes.length, f.size, f.pathname);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), f.sha256, f.pathname);
  }
  const site = JSON.parse(readFileSync(path.join(out, 'files', 'sites', `${siteId}.json`), 'utf8'));
  assert.equal(site.slug, 'backup-site');
  const manifest = JSON.parse(readFileSync(path.join(out, 'manifest.json'), 'utf8'));
  assert.deepEqual(manifest.files, s.files);
  assert.equal(manifest.count, before.length);
  assert.ok(calls.every((c) => c === 'list' || c === 'get'));
  assert.deepEqual(fake.paths(), before, 'the store is unchanged');
  assert.ok(!readdirSync(out, { recursive: true }).some((f) => String(f).endsWith('.part')), 'no half-written file left');
});

test('private on disk: every file 0600, every folder the backup makes 0700, whatever the umask (POSIX)', { skip: process.platform === 'win32' }, async () => {
  const { fake } = await filledStore();
  const { client } = readOnly(fake);
  const out = path.join(tmpDir('g955-modes-'), 'new-backup-folder');
  const old = process.umask(0o022);
  try {
    await runBackup({ client, token: fake.token, out, log: quiet });
    // a stopped earlier run's progress file with open permissions is closed again on the next run
    chmodSync(path.join(out, 'progress.jsonl'), 0o644);
    await runBackup({ client, token: fake.token, out, log: quiet });
  } finally {
    process.umask(old);
  }
  const mode = (p: string) => statSync(p).mode & 0o777;
  assert.equal(mode(out), 0o700, 'the --out folder this run created');
  for (const rel of readdirSync(out, { recursive: true }).map(String)) {
    const p = path.join(out, rel);
    assert.equal(mode(p), statSync(p).isDirectory() ? 0o700 : 0o600, rel);
  }
});

test('resumable: a second run copies only what is new or changed; a lost file is fetched again', async () => {
  const { fake, siteId } = await filledStore();
  const out = tmpDir('g955-resume-');
  const first = await runBackup({ client: readOnly(fake).client, token: fake.token, out, log: quiet });
  assert.equal(first.copied, first.count);
  // an interrupted run: the manifest never got written, only the progress file
  rmSync(path.join(out, 'manifest.json'));
  const blob = new BlobAdapter({ token: fake.token, client: fake.client() });
  await blob.saveRsvp(siteId, { name: 'Guest Two', attending: false, guests: 0 });
  const lost = first.files.find((f: { pathname: string }) => f.pathname.startsWith('media/'))!;
  rmSync(path.join(out, 'files', ...lost.pathname.split('/')));
  const { client, calls } = readOnly(fake);
  const second = await runBackup({ client, token: fake.token, out, log: quiet });
  assert.equal(second.complete, true);
  assert.equal(second.count, first.count + 1);
  assert.equal(second.copied, 2, 'the new reply + the lost photo');
  assert.equal(second.skipped, first.count - 1);
  assert.equal(calls.filter((c) => c === 'get').length, 2);
  // --verify re-hashes what is there: a damaged file is fetched again
  const victim = second.files.find((f: { pathname: string }) => f.pathname.startsWith('sites/'))!;
  const file = path.join(out, 'files', ...victim.pathname.split('/'));
  const good = readFileSync(file);
  writeFileSync(file, Buffer.from(good.toString('utf8').replace('backup-site', 'backup-xxxx')));
  const third = await runBackup({ client: readOnly(fake).client, token: fake.token, out, verify: true, log: quiet });
  assert.equal(third.copied, 1);
  assert.deepEqual(readFileSync(file), good);
});

test('--dry-run: lists and counts, downloads and writes nothing', async () => {
  const { fake } = await filledStore();
  const { client, calls } = readOnly(fake);
  const out = path.join(os.tmpdir(), `g955-dry-${process.pid}-${Date.now()}`);
  const lines: string[] = [];
  const s = await runBackup({ client, token: fake.token, out, dryRun: true, log: (l: string) => lines.push(l) });
  assert.equal(s.dryRun, true);
  assert.equal(s.count, fake.paths().length);
  assert.ok(calls.every((c) => c === 'list'));
  assert.equal(existsSync(out), false);
  assert.match(lines.join('\n'), /blobs, .* MB: .*sites\/ 1/);
  // --prefix: only that part of the store
  const only = await listStore(fake.client(), fake.token, 'rsvps/');
  assert.ok(only.length >= 1 && only.every((b: { pathname: string }) => b.pathname.startsWith('rsvps/')));
});

test('safety: unsafe pathnames are refused, the backup folder must be outside the repository, CLI needs a token and --out', () => {
  assert.equal(safeRelative('sites/abc.json'), path.join('sites', 'abc.json'));
  for (const bad of ['../x', 'a/../../x', '/etc/passwd', 'a//b', 'a\\b', '', 'a/./b']) assert.equal(safeRelative(bad), null, bad);
  assert.equal(insideRepo(REPO_ROOT), true);
  assert.equal(insideRepo(path.join(REPO_ROOT, 'backups')), true);
  assert.equal(insideRepo(path.join(os.tmpdir(), 'bke-backup')), false);
  const script = path.join(PLATFORM_ROOT, 'scripts', 'blob-backup.mjs');
  const env = { ...process.env };
  delete env.BLOB_READ_WRITE_TOKEN;
  const noToken = spawnSync(process.execPath, [script, '--out', path.join(os.tmpdir(), 'x')], { env, encoding: 'utf8' });
  assert.equal(noToken.status, 2);
  assert.match(noToken.stderr, /BLOB_READ_WRITE_TOKEN is not set/);
  const inRepo = spawnSync(process.execPath, [script, '--out', path.join(REPO_ROOT, 'backup-here')], { env: { ...env, BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_fake' }, encoding: 'utf8' });
  assert.equal(inRepo.status, 2);
  assert.match(inRepo.stderr, /inside the repository/);
  assert.doesNotMatch(inRepo.stderr + inRepo.stdout, /vercel_blob_rw_fake/);
  // read-only by construction: the SDK is imported for list and get only
  const src = readFileSync(script, 'utf8');
  assert.match(src, /const \{ list, get \} = await import\('@vercel\/blob'\);/);
  assert.doesNotMatch(src.replace(/^\s*\/\/.*$/gm, ''), /\b(put|del|copy)\s*\(/);
});
