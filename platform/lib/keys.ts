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

// ---------------------------------------------------------------------------------------------
// Panel preview token (G060-fix, docs/16 §11.11)
//
// The panel's own preview (iframe, photo thumbnails) uses a SHORT-LIVED token instead of the long-lived preview
// key: "<exp>.<HMAC-SHA256(previewKeyHash, 'panel-preview:v1:<siteId>:<exp>')>" (exp in Unix seconds). It is valid
// for PANEL_PREVIEW_TTL_MS, cannot be turned into edit access, stops working when the keys are reissued (the stored
// hash changes) and needs no extra server secret. The expiry is rounded to the hour, so every panel request in the
// same hour gets the same token (the preview frame is not sent to a new address on every save).

export const PANEL_PREVIEW_TTL_MS = 12 * 60 * 60_000;
const TOKEN_BUCKET_MS = 60 * 60_000;
const TOKEN_RE = /^(\d{9,11})\.([A-Za-z0-9_-]{43})$/;

function tokenSignature(siteId: string, previewKeyHash: string, expSeconds: number): string {
  return createHmac('sha256', previewKeyHash).update(`panel-preview:v1:${siteId}:${expSeconds}`).digest('base64url');
}

/** A panel preview token for this site, valid for 11 to 12 hours from `now`. */
export function panelPreviewToken(siteId: string, previewKeyHash: string, now: number = Date.now()): string {
  const exp = Math.floor((Math.floor(now / TOKEN_BUCKET_MS) * TOKEN_BUCKET_MS + PANEL_PREVIEW_TTL_MS) / 1000);
  return `${exp}.${tokenSignature(siteId, previewKeyHash, exp)}`;
}

/** Constant-time check of a panel preview token. Never throws. */
export function verifyPanelPreviewToken(token: unknown, siteId: string, previewKeyHash: unknown, now: number = Date.now()): boolean {
  if (typeof token !== 'string' || typeof previewKeyHash !== 'string' || !HASH_RE.test(previewKeyHash)) return false;
  const m = TOKEN_RE.exec(token);
  if (!m) return false;
  const exp = Number(m[1]);
  if (!(exp * 1000 > now) || exp * 1000 - now > PANEL_PREVIEW_TTL_MS + TOKEN_BUCKET_MS) return false;
  const a = Buffer.from(m[2], 'utf8');
  const b = Buffer.from(tokenSignature(siteId, previewKeyHash, exp), 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}
