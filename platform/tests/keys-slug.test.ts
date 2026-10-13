import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { derivePreviewKey, generateKey, hashKey, newSiteKeys, verifyKey } from '../lib/keys.ts';
import { isAvailableSlugShape, isReservedSlug, isValidSlugFormat, RESERVED_SLUGS, slugify } from '../lib/slug.ts';

test('generateKey: 32 random bytes as base64url, unique', () => {
  const keys = new Set(Array.from({ length: 200 }, () => generateKey()));
  assert.equal(keys.size, 200);
  for (const k of keys) {
    assert.match(k, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(Buffer.from(k, 'base64url').length, 32);
  }
});

test('hashKey is hex SHA-256; the plain key is not stored in the hash', () => {
  const k = generateKey();
  const h = hashKey(k);
  assert.equal(h, createHash('sha256').update(k).digest('hex'));
  assert.match(h, /^[0-9a-f]{64}$/);
  assert.ok(!h.includes(k));
});

test('verifyKey accepts only the matching key and never throws', () => {
  const k = generateKey();
  const h = hashKey(k);
  assert.equal(verifyKey(k, h), true);
  assert.equal(verifyKey(generateKey(), h), false);
  assert.equal(verifyKey(k.slice(0, -1), h), false);
  assert.equal(verifyKey(k + 'x', h), false);
  assert.equal(verifyKey(h, h), false); // presenting the hash itself does not work
  assert.equal(verifyKey('', h), false);
  assert.equal(verifyKey(undefined, h), false);
  assert.equal(verifyKey(['a'], h), false);
  assert.equal(verifyKey(k, 'not-a-hash'), false);
  assert.equal(verifyKey(k, h.toUpperCase()), false);
  assert.equal(verifyKey(k, null), false);
  assert.equal(verifyKey('a'.repeat(10_000), h), false);
});

test('preview key is derived from the edit key but is not the edit key', () => {
  const keys = newSiteKeys();
  assert.equal(keys.previewKey, derivePreviewKey(keys.editKey));
  assert.notEqual(keys.previewKey, keys.editKey);
  assert.equal(verifyKey(keys.previewKey, keys.previewKeyHash), true);
  assert.equal(verifyKey(keys.editKey, keys.previewKeyHash), false);
  assert.equal(verifyKey(keys.previewKey, keys.editKeyHash), false);
});

test('slug format and reserved words', () => {
  for (const ok of ['clara-and-julian', 'ab1', 'a'.repeat(48), 'x-y-z']) assert.ok(isValidSlugFormat(ok), ok);
  for (const bad of ['ab', 'a'.repeat(49), '-ab', 'ab-', 'a--b', 'Clara', 'a_b', 'a.b', 'a/b', '', 'ç-ok']) {
    assert.ok(!isValidSlugFormat(bad), bad);
  }
  for (const r of ['edit', 'start', 'api', '_next', 'themes', 'media', 'favicon.ico']) assert.ok(RESERVED_SLUGS.has(r), r);
  assert.ok(isReservedSlug('EDIT'));
  assert.ok(!isAvailableSlugShape('edit'));
  assert.ok(!isAvailableSlugShape('themes'));
  assert.ok(isAvailableSlugShape('clara-and-julian'));
});

test('slugify', () => {
  assert.equal(slugify('Clara & Julian'), 'clara-and-julian');
  assert.equal(slugify('  Zoë  &  José '), 'zoe-and-jose');
  assert.equal(slugify('!!!'), '');
  assert.ok(slugify('x'.repeat(80)).length <= 48);
});
