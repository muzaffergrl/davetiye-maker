// Secret keys for sites.
//
// Edit key:    32 random bytes, base64url (43 chars). Given to the buyer once (edit link
//              /edit/<slug>?k=<key>). Only SHA-256(key) is stored (edit_key_hash).
// Preview key: HMAC-SHA256(editKey, "preview:v1"), base64url. The panel can derive it from
//              the edit key; a shared preview link (?preview=<key>) shows the draft but
//              cannot be turned back into edit access. Only SHA-256(previewKey) is stored.
// A fast hash is fine here: keys are 256-bit random values, not passwords.

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const KEY_BYTES = 32;
const HASH_RE = /^[0-9a-f]{64}$/;
const KEY_RE = /^[A-Za-z0-9_-]{16,128}$/;

export function generateKey(): string {
  return randomBytes(KEY_BYTES).toString('base64url');
}

/** Hex SHA-256 of the key (what the database stores). */
export function hashKey(key: string): string {
  return createHash('sha256').update(key, 'utf8').digest('hex');
}

export function derivePreviewKey(editKey: string): string {
  return createHmac('sha256', editKey).update('preview:v1').digest('base64url');
}

/** Constant-time check of a presented key against a stored hash. Never throws. */
export function verifyKey(presented: unknown, storedHash: unknown): boolean {
  if (typeof presented !== 'string' || typeof storedHash !== 'string') return false;
  if (!KEY_RE.test(presented) || !HASH_RE.test(storedHash)) return false;
  const a = createHash('sha256').update(presented, 'utf8').digest();
  const b = Buffer.from(storedHash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

/** New edit key + derived preview key and both hashes, for createSite. */
export function newSiteKeys(): { editKey: string; previewKey: string; editKeyHash: string; previewKeyHash: string } {
  const editKey = generateKey();
  const previewKey = derivePreviewKey(editKey);
  return { editKey, previewKey, editKeyHash: hashKey(editKey), previewKeyHash: hashKey(previewKey) };
}
