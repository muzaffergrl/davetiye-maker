// Device keys (G146, K46): "continue on any device with your Etsy order number + email".
//
// A buyer who opens /my on a new phone and enters the order number and the email the website was started with gets a
// DEVICE KEY: an extra edit key for that device ("dv-" + 32 random bytes, base64url). It works everywhere the edit key
// works (lib/sites.ts editAccess), so the private edit link stays a convenience, not the only way in.
//
// Storage: the site document "devices" (DataAdapter.readSiteDoc / updateSiteDoc, G128), NOT the site record — signing in
// on a new device must not move the site's updatedAt (an open panel on another device would see a save conflict). Only
// SHA-256 hashes are stored, with the creation time and a short label ("iPhone · Safari") from the browser's user agent.
// At most MAX_DEVICE_KEYS; the oldest is dropped when a new one is added.
//
// Revocation: each entry carries the GENERATION of the site's edit key (a hash of editKeyHash). A key reissue (admin,
// scripts/reissue-edit-key.ts, a /start retry — lib/sites.ts reissueKeys) changes editKeyHash, so every older device key
// stops working at once even before reissueKeys deletes the document. "Sign out other devices" (panel, Share) removes
// every device key but the one in use; the main edit key is never touched by it.
// Server only (node:crypto).

import { createHash, randomBytes } from 'node:crypto';
import type { DataAdapter, SiteRecord } from './data/types.ts';
import { generateKey, hashKey, verifyKey } from './keys.ts';

export const DEVICE_DOC = 'devices';
export const MAX_DEVICE_KEYS = 10;
export const DEVICE_KEY_PREFIX = 'dv-';
/** A device key: "dv-" + 43 base64url characters (46 in all; a main or shop key is 43, so the two never look alike). */
const DEVICE_KEY_RE = /^dv-[A-Za-z0-9_-]{43}$/;
const ID_RE = /^[0-9a-f]{16}$/;
const HASH_RE = /^[0-9a-f]{64}$/;
const LABEL_MAX = 40;

/** How a device got its key: the /my form, /start with an order that already has a website, or an emailed sign-in link. */
export type DeviceVia = 'continue' | 'start' | 'email';

export interface DeviceKeyEntry {
  /** Public id of the entry (random, 16 hex): lets the panel mark "this device" and keep it when signing out others. */
  id: string;
  /** SHA-256 of the device key. */
  hash: string;
  /** Edit-key generation the key was made for (deviceGeneration); any other generation is dead. */
  gen: string;
  createdAt: string;
  /** "iPhone · Safari", or "" when the browser could not be told. */
  label: string;
  via: DeviceVia;
}

interface DevicesDoc {
  v: 1;
  keys: DeviceKeyEntry[];
}

export function isDeviceKeyShape(key: unknown): key is string {
  return typeof key === 'string' && DEVICE_KEY_RE.test(key);
}

export function newDeviceKey(): string {
  return `${DEVICE_KEY_PREFIX}${generateKey()}`;
}

/** The generation of the site's edit key: changes whenever the edit key is reissued. */
export function deviceGeneration(site: Pick<SiteRecord, 'editKeyHash'>): string {
  return createHash('sha256').update(`device-gen:v1:${site.editKeyHash}`).digest('hex').slice(0, 32);
}

function validEntry(e: unknown): e is DeviceKeyEntry {
  const r = e as DeviceKeyEntry;
  return Boolean(
    r &&
      typeof r.id === 'string' &&
      ID_RE.test(r.id) &&
      typeof r.hash === 'string' &&
      HASH_RE.test(r.hash) &&
      typeof r.gen === 'string' &&
      typeof r.createdAt === 'string' &&
      typeof r.label === 'string',
  );
}

/** The live entries of a stored document for this site (its current edit-key generation), oldest first. */
function liveEntries(doc: unknown, site: Pick<SiteRecord, 'editKeyHash'>): DeviceKeyEntry[] {
  const keys = (doc as Partial<DevicesDoc> | null)?.keys;
  if (!Array.isArray(keys)) return [];
  const gen = deviceGeneration(site);
  return keys.filter((e): e is DeviceKeyEntry => validEntry(e) && e.gen === gen).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * Adds a device key for this site and returns it (shown to that device once; only its hash is stored). Keeps the newest
 * MAX_DEVICE_KEYS. `site` must be the record as just read: a key made for an older edit key is dead on arrival.
 */
export async function mintDeviceKey(
  adapter: DataAdapter,
  site: Pick<SiteRecord, 'id' | 'editKeyHash'>,
  opts: { label?: string | null; via: DeviceVia; now?: Date },
): Promise<{ key: string; id: string }> {
  const key = newDeviceKey();
  const entry: DeviceKeyEntry = {
    id: randomBytes(8).toString('hex'),
    hash: hashKey(key),
    gen: deviceGeneration(site),
    createdAt: (opts.now ?? new Date()).toISOString(),
    label: cleanLabel(opts.label),
    via: opts.via,
  };
  await adapter.updateSiteDoc<DevicesDoc>(site.id, DEVICE_DOC, (cur) => ({ v: 1, keys: [...liveEntries(cur, site), entry].slice(-MAX_DEVICE_KEYS) }));
  return { key, id: entry.id };
}

/** The live entry of a presented device key, or null (wrong shape, unknown, signed out, or from before a reissue). */
export async function findDeviceKey(adapter: DataAdapter, site: Pick<SiteRecord, 'id' | 'editKeyHash'>, key: unknown): Promise<DeviceKeyEntry | null> {
  if (!isDeviceKeyShape(key)) return null;
  const entries = liveEntries(await adapter.readSiteDoc(site.id, DEVICE_DOC), site);
  let found: DeviceKeyEntry | null = null;
  // Every entry is compared (constant time each), so the answer time does not depend on where a match is.
  for (const e of entries) if (verifyKey(key, e.hash) && !found) found = e;
  return found;
}

/** The devices signed in with the order number (newest first; no hashes). */
export async function listDevices(adapter: DataAdapter, site: Pick<SiteRecord, 'id' | 'editKeyHash'>): Promise<Array<Omit<DeviceKeyEntry, 'hash' | 'gen'>>> {
  return liveEntries(await adapter.readSiteDoc(site.id, DEVICE_DOC), site)
    .reverse()
    .map(({ id, createdAt, label, via }) => ({ id, createdAt, label, via: via === 'start' || via === 'email' ? via : 'continue' }));
}

/** "Sign out other devices": removes every device key except `keepId` (null: all of them). Returns how many were removed. */
export async function signOutOtherDevices(adapter: DataAdapter, site: Pick<SiteRecord, 'id' | 'editKeyHash'>, keepId: string | null): Promise<number> {
  let removed = 0;
  await adapter.updateSiteDoc<DevicesDoc>(site.id, DEVICE_DOC, (cur) => {
    const live = liveEntries(cur, site);
    const kept = live.filter((e) => keepId !== null && e.id === keepId);
    removed = live.length - kept.length;
    return kept.length ? { v: 1, keys: kept } : null;
  });
  return removed;
}

/** Every device key of the site stops working (key reissue). */
export async function revokeDeviceKeys(adapter: DataAdapter, siteId: string): Promise<void> {
  await adapter.updateSiteDoc(siteId, DEVICE_DOC, () => null);
}

function cleanLabel(label: string | null | undefined): string {
  return (label ?? '').replace(/[^\p{L}\p{N} ·._-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, LABEL_MAX);
}

/** A short device name from the browser's user agent: "iPhone · Safari", "Windows · Chrome"; "" when unknown. */
export function deviceLabel(userAgent: string | null | undefined): string {
  const ua = (userAgent ?? '').slice(0, 512);
  const device = /iPad/.test(ua)
    ? 'iPad'
    : /iPhone|iPod/.test(ua)
      ? 'iPhone'
      : /Android/.test(ua)
        ? 'Android'
        : /CrOS/.test(ua)
          ? 'Chromebook'
          : /Macintosh|Mac OS X/.test(ua)
            ? 'Mac'
            : /Windows/.test(ua)
              ? 'Windows'
              : /Linux/.test(ua)
                ? 'Linux'
                : '';
  const browser = /EdgA?\/|EdgiOS|Edg\//.test(ua)
    ? 'Edge'
    : /SamsungBrowser/.test(ua)
      ? 'Samsung Internet'
      : /OPR\/|OPiOS|Opera/.test(ua)
        ? 'Opera'
        : /Firefox\/|FxiOS/.test(ua)
          ? 'Firefox'
          : /CriOS|Chrome\//.test(ua)
            ? 'Chrome'
            : /Safari\//.test(ua)
              ? 'Safari'
              : '';
  return cleanLabel([device, browser].filter(Boolean).join(' · '));
}
