// Refresh tokens at rest (G128): AES-256-GCM with GOOGLE_TOKEN_KEY, the site id as associated data (a token copied
// into another site's document does not decrypt). Format "v1.<iv>.<ciphertext>.<tag>" (base64url). The plain token
// exists only in memory while a request uses it; it is never logged and never sent to a browser.

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const b64 = (b: Buffer) => b.toString('base64url');

export function encryptToken(plain: string, key: Buffer, siteId: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(siteId, 'utf8'));
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return `v1.${b64(iv)}.${b64(ct)}.${b64(cipher.getAuthTag())}`;
}

/** The plain token, or null when it does not decrypt (other key, other site, damaged). */
export function decryptToken(sealed: string, key: Buffer, siteId: string): string | null {
  const m = /^v1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(sealed ?? '');
  if (!m) return null;
  try {
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(m[1], 'base64url'));
    decipher.setAAD(Buffer.from(siteId, 'utf8'));
    decipher.setAuthTag(Buffer.from(m[3], 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(m[2], 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
