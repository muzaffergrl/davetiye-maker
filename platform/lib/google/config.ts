// Google Sheets connection settings (G128, docs/22_GOOGLE_SHEETS.md).
//
//   GOOGLE_CLIENT_ID      OAuth 2.0 web client of the shop's Google Cloud project
//   GOOGLE_CLIENT_SECRET  its secret (server only; never logged, never sent to a browser)
//   GOOGLE_TOKEN_KEY      key that encrypts the couples' refresh tokens at rest (AES-256-GCM, lib/google/crypto.ts):
//                         32 random bytes as base64 / base64url / 64 hex characters; any other text of at least 32
//                         characters is hashed to a key (SHA-256). Changing it disconnects every couple (they connect again).
//
// Without all three the feature is off: the panel hides the button (says "coming soon") and the routes answer 503.
// Only scope: https://www.googleapis.com/auth/drive.file (files this app creates, nothing else in the couple's Drive).
// Callback: <public origin>/api/google/callback (it must be listed as an authorised redirect URI of the client).

import { createHash } from 'node:crypto';

export const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
export const CALLBACK_PATH = '/api/google/callback';

/** Google endpoints; tests point them at a local fake server (tests/google-sheets.test.ts). */
export const GOOGLE_ENDPOINTS = {
  auth: 'https://accounts.google.com/o/oauth2/v2/auth',
  token: 'https://oauth2.googleapis.com/token',
  revoke: 'https://oauth2.googleapis.com/revoke',
  sheets: 'https://sheets.googleapis.com/v4/spreadsheets',
};

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  /** 32-byte AES key. */
  tokenKey: Buffer;
}

/** The token key from its env text (see above), or null when it is too short to be a key. */
export function parseTokenKey(text: string): Buffer | null {
  const t = text.trim();
  if (/^[0-9a-f]{64}$/i.test(t)) return Buffer.from(t, 'hex');
  if (/^[A-Za-z0-9+/_-]{43}=?$/.test(t)) {
    const b = Buffer.from(t.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    if (b.length === 32) return b;
  }
  return t.length >= 32 ? createHash('sha256').update(t, 'utf8').digest() : null;
}

/** The settings, or null when the feature is not set up. Read on every call (tests change the environment). */
export function googleConfig(env: NodeJS.ProcessEnv = process.env): GoogleConfig | null {
  const clientId = (env.GOOGLE_CLIENT_ID ?? '').trim();
  const clientSecret = (env.GOOGLE_CLIENT_SECRET ?? '').trim();
  const tokenKey = parseTokenKey(env.GOOGLE_TOKEN_KEY ?? '');
  if (!clientId || !clientSecret || !tokenKey) return null;
  return { clientId, clientSecret, tokenKey };
}

export const googleAvailable = (env: NodeJS.ProcessEnv = process.env) => googleConfig(env) !== null;
