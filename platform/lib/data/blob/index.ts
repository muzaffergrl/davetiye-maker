// Vercel Blob data adapter (G048): the first live version keeps all data in ONE private
// Vercel Blob store, no database (docs/10_SITE_PLATFORMU.md §2c).
//
//   sites/<id>.json                          SiteRecord + "version" (bumped on every write)
//   slugs/<slug>.json                        {"id"}  created with allowOverwrite:false -> unique slugs
//   orders/<ref>.json                        {"id"}  same rule -> one site per order reference
//   rsvps/<siteId>/<ms>-<seq>-<rsvpId>.json  one file per RSVP (no read-modify-write, no contention)
//   media/<siteId>/<random>.<ext>            photos; the app serves them at /media/<siteId>/<file> (readPhoto)
//
// Consistency:
//  - Index files (slug, order) are written first with allowOverwrite:false; the SDK refuses the
//    write if the pathname exists, so two server instances cannot both get the same slug/order.
//    If the site write then fails, the indexes are released (deleted with ifMatch). An index left
//    behind by a crashed instance (points to a site that does not exist) is reclaimed after
//    orphanGraceMs (15 min).
//    ASSUMED, not verified against the real service: the server checks allowOverwrite:false and
//    ifMatch atomically (the SDK documents both for this purpose).
//  - Site updates are optimistic: read (with ETag) -> change -> put with ifMatch=ETag. A stale
//    write fails with BlobPreconditionFailedError and is retried on fresh data; after
//    maxWriteAttempts it throws WriteConflictError. Inside one process writes to a site are also
//    queued (fewer wasted round trips).
//  - JSON is read with useCache:false (origin, not the CDN copy that can lag up to 60 s after an
//    overwrite). Photos are immutable (random names) and may come from the CDN cache.
//
// Every blob is private: site records hold key hashes, owner e-mail and drafts; RSVPs hold guest
// data. Store access (public/private) is chosen when the store is created (the docs treat it as a
// store type; mixing both in one store was not tried), so the store connected to the project MUST
// be a private store. Photos therefore have no public blob URL; visitors get them through the
// app's /media route (function + cache headers), like the local adapter.
//
// The token (BLOB_READ_WRITE_TOKEN) is passed in by lib/data/index.ts and kept in a private field;
// it is never logged or put into error messages.

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import {
  BlobError,
  BlobPreconditionFailedError,
  del as sdkDel,
  get as sdkGet,
  list as sdkList,
  put as sdkPut,
  type DeleteCommandOptions,
  type GetBlobResult,
  type GetCommandOptions,
  type ListBlobResult,
  type ListCommandOptions,
  type PutBlobResult,
  type PutCommandOptions,
} from '@vercel/blob';
import type { ContentRecord } from '../../content/types.ts';
import { assertImageUpload, IMAGE_TYPES } from '../../uploads.ts';
import {
  NotFoundError,
  OrderRefTakenError,
  SlugTakenError,
  WriteConflictError,
  type DataAdapter,
  type NewSite,
  type PhotoInput,
  type RsvpInput,
  type RsvpRecord,
  type SavedPhoto,
  type SiteRecord,
  type StoredFile,
} from '../types.ts';

/** The part of the @vercel/blob API this adapter uses (tests pass an in-memory fake). */
export interface BlobClient {
  put(pathname: string, body: string | Buffer, options: PutCommandOptions): Promise<PutBlobResult>;
  get(pathname: string, options: GetCommandOptions): Promise<GetBlobResult | null>;
  del(pathnames: string | string[], options?: DeleteCommandOptions): Promise<void>;
  list(options: ListCommandOptions<'expanded'>): Promise<ListBlobResult>;
}

export const sdkBlobClient: BlobClient = {
  put: (pathname, body, options) => sdkPut(pathname, body, options),
  get: (pathname, options) => sdkGet(pathname, options),
  del: (pathnames, options) => sdkDel(pathnames, options),
  list: (options) => sdkList(options),
};

export interface BlobAdapterOptions {
  /** Read-write token of the (private) store. Undefined: the SDK reads BLOB_READ_WRITE_TOKEN / Vercel OIDC itself. */
  token?: string;
  client?: BlobClient;
  /** URL prefix of the photo route (default "/media"). */
  mediaBaseUrl?: string;
  /** Attempts of one site update before WriteConflictError (default 6). */
  maxWriteAttempts?: number;
  /** Wait before retry n (1-based) after a stale write. Default: jittered exponential, max ~1 s. */
  retryDelayMs?: (attempt: number) => number;
  /**
   * An index whose site does not exist is reclaimed once it is older than this. Default 15 min:
   * longer than any Vercel function may run, so a create that is still in progress (e.g. the SDK
   * retrying a slow site write) never loses its index.
   */
  orphanGraceMs?: number;
  now?: () => number;
}

interface StoredSite extends SiteRecord {
  /** 1 at creation, +1 on every write. Informational; the ETag is what makes writes conditional. */
  version: number;
}

interface IndexEntry {
  id: string;
}

interface Read<T> {
  data: T;
  etag: string;
  uploadedAt: Date;
}

const ACCESS = 'private' as const;
const JSON_TYPE = 'application/json';
const JSON_CACHE_SECONDS = 60; // minimum the API accepts; JSON reads bypass the cache anyway
const PHOTO_CACHE_SECONDS = 365 * 24 * 60 * 60;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SLUG_RE = /^[a-z0-9-]{1,64}$/;
const SIMPLE_REF_RE = /^[A-Za-z0-9_-]{1,64}$/;
const PHOTO_PATH_RE = /^([0-9a-f-]{36})\/([0-9a-f]{32})\.(jpg|png|webp|avif)$/;
const READ_CONCURRENCY = 8;
const DELETE_BATCH = 100;

function defaultRetryDelay(attempt: number): number {
  return Math.min(1000, 40 * 2 ** (attempt - 1)) * (0.5 + Math.random());
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function readAll(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.length;
  }
  const out = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

async function mapLimit<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function toRecord(doc: StoredSite): SiteRecord {
  const { version: _version, ...site } = doc;
  return site;
}

/** "This blob already exists ..." — the SDK has no dedicated error class for it (BlobError + message). */
function looksLikeAlreadyExists(e: unknown): boolean {
  return e instanceof BlobError && /already exists/i.test(e.message);
}

export class BlobAdapter implements DataAdapter {
  readonly kind = 'blob' as const;
  readonly mediaBaseUrl: string;
  readonly #token: string | undefined;
  readonly #client: BlobClient;
  readonly #maxWriteAttempts: number;
  readonly #retryDelayMs: (attempt: number) => number;
  readonly #orphanGraceMs: number;
  readonly #now: () => number;
  #locks = new Map<string, Promise<unknown>>();
  #rsvpSeq = 0;

  constructor(opts: BlobAdapterOptions = {}) {
    this.#token = opts.token || undefined;
    this.#client = opts.client ?? sdkBlobClient;
    this.mediaBaseUrl = opts.mediaBaseUrl ?? '/media';
    this.#maxWriteAttempts = Math.max(1, opts.maxWriteAttempts ?? 6);
    this.#retryDelayMs = opts.retryDelayMs ?? defaultRetryDelay;
    this.#orphanGraceMs = opts.orphanGraceMs ?? 15 * 60_000;
    this.#now = opts.now ?? Date.now;
  }

  // --- paths ------------------------------------------------------------------------------------

  private sitePath(id: string) {
    return `sites/${id}.json`;
  }
  private slugPath(slug: string) {
    return `slugs/${slug}.json`;
  }
  /** Order numbers are digits; anything unusual is hashed so it is always a safe pathname. */
  private orderPath(orderRef: string) {
    const key = SIMPLE_REF_RE.test(orderRef) ? orderRef : `h-${createHash('sha256').update(orderRef).digest('hex')}`;
    return `orders/${key}.json`;
  }
  private rsvpPrefix(siteId: string) {
    return `rsvps/${siteId}/`;
  }
  private mediaPrefix(siteId: string) {
    return `media/${siteId}/`;
  }

  // --- low level --------------------------------------------------------------------------------

  /** Serialises async work per key inside this process (other instances are handled by ETags). */
  private async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.#locks.get(key) ?? Promise.resolve();
    const run = prev.then(fn, fn);
    const tail = run.catch(() => undefined);
    this.#locks.set(key, tail);
    try {
      return await run;
    } finally {
      if (this.#locks.get(key) === tail) this.#locks.delete(key);
    }
  }

  /** Latest version from origin storage (never the CDN copy), or null. */
  private async readJson<T>(pathname: string): Promise<Read<T> | null> {
    const res = await this.#client.get(pathname, { access: ACCESS, token: this.#token, useCache: false });
    if (!res || res.statusCode !== 200) return null;
    const text = new TextDecoder().decode(await readAll(res.stream));
    return { data: JSON.parse(text) as T, etag: res.blob.etag, uploadedAt: res.blob.uploadedAt };
  }

  private putJson(pathname: string, value: unknown, cond: { allowOverwrite: false } | { ifMatch: string }): Promise<PutBlobResult> {
    return this.#client.put(pathname, JSON.stringify(value), {
      access: ACCESS,
      token: this.#token,
      contentType: JSON_TYPE,
      addRandomSuffix: false,
      cacheControlMaxAge: JSON_CACHE_SECONDS,
      ...cond,
    });
  }

  private async del(pathnames: string | string[], ifMatch?: string): Promise<void> {
    await this.#client.del(pathnames, { token: this.#token, ...(ifMatch ? { ifMatch } : {}) });
  }

  private async listAll(prefix: string): Promise<string[]> {
    const out: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await this.#client.list({ prefix, cursor, limit: 1000, token: this.#token });
      for (const b of page.blobs) out.push(b.pathname);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out.sort();
  }

  private async deletePrefix(prefix: string): Promise<void> {
    const paths = await this.listAll(prefix);
    for (let i = 0; i < paths.length; i += DELETE_BATCH) await this.del(paths.slice(i, i + DELETE_BATCH));
  }

  /** An index left behind by a crashed create: its site does not exist and it is old enough. */
  private async isOrphan(index: Read<Partial<IndexEntry>>): Promise<boolean> {
    if (this.#now() - index.uploadedAt.getTime() < this.#orphanGraceMs) return false;
    const id = index.data.id;
    if (typeof id === 'string' && UUID_RE.test(id) && (await this.readJson(this.sitePath(id)))) return false;
    return true;
  }

  /**
   * Creates an index file {"id"} unless the pathname exists. Returns its ETag, or null if another
   * site holds it. Our own earlier write (an SDK retry after a lost response) counts as ours.
   */
  private async claimIndex(pathname: string, id: string): Promise<{ etag: string } | null> {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await this.putJson(pathname, { id } satisfies IndexEntry, { allowOverwrite: false });
        return { etag: res.etag };
      } catch (e) {
        if (!(e instanceof BlobError) || e instanceof BlobPreconditionFailedError) throw e;
        // The SDK reports an existing pathname as a plain BlobError; confirm by reading it.
        const current = await this.readJson<Partial<IndexEntry>>(pathname);
        if (!current) {
          if (looksLikeAlreadyExists(e)) continue; // released in between: try again
          throw e; // a real failure (token, store, network …), not a conflict
        }
        if (current.data.id === id) return { etag: current.etag };
        if (await this.isOrphan(current)) {
          await this.releaseIndex(pathname, current.etag);
          continue;
        }
        return null;
      }
    }
    return null;
  }

  /**
   * Deletes an index only if it is still the version we know. Best effort: if it changed
   * (precondition failed) it is someone else's now; any other failure leaves an index without a
   * site, which claimIndex reclaims later (isOrphan).
   */
  private async releaseIndex(pathname: string, etag: string): Promise<void> {
    await this.del(pathname, etag).catch(() => undefined);
  }

  private async releaseIndexIfOwned(pathname: string, id: string): Promise<void> {
    const current = await this.readJson<Partial<IndexEntry>>(pathname);
    if (current && current.data.id === id) await this.releaseIndex(pathname, current.etag);
  }

  // --- DataAdapter ------------------------------------------------------------------------------

  async getSiteById(id: string): Promise<SiteRecord | null> {
    if (!UUID_RE.test(id)) return null;
    const res = await this.readJson<StoredSite>(this.sitePath(id));
    return res ? toRecord(res.data) : null;
  }

  async getSiteBySlug(slug: string): Promise<SiteRecord | null> {
    if (!SLUG_RE.test(slug)) return null;
    const index = await this.readJson<Partial<IndexEntry>>(this.slugPath(slug));
    if (!index || typeof index.data.id !== 'string') return null;
    const site = await this.getSiteById(index.data.id);
    return site && site.slug === slug ? site : null;
  }

  async findSitesByOrderRef(orderRef: string): Promise<SiteRecord[]> {
    const index = await this.readJson<Partial<IndexEntry>>(this.orderPath(orderRef));
    if (!index || typeof index.data.id !== 'string') return [];
    const site = await this.getSiteById(index.data.id);
    return site && site.orderRef === orderRef ? [site] : [];
  }

  async createSite(input: NewSite): Promise<SiteRecord> {
    if (!SLUG_RE.test(input.slug)) throw new Error(`invalid slug "${input.slug}"`);
    const id = randomUUID();
    const orderRef = input.orderRef ?? null;

    const slugPath = this.slugPath(input.slug);
    const slugIndex = await this.claimIndex(slugPath, id);
    if (!slugIndex) throw new SlugTakenError(input.slug);

    let orderIndex: { etag: string } | null = null;
    try {
      if (orderRef !== null) {
        orderIndex = await this.claimIndex(this.orderPath(orderRef), id);
        if (!orderIndex) throw new OrderRefTakenError(orderRef);
      }
      const now = new Date(this.#now()).toISOString();
      const doc: StoredSite = {
        id,
        slug: input.slug,
        theme: input.theme,
        variant: input.variant ?? null,
        status: 'draft',
        content: structuredClone(input.content),
        publishedContent: null,
        editKeyHash: input.editKeyHash,
        previewKeyHash: input.previewKeyHash,
        orderRef,
        ownerEmail: input.ownerEmail ?? null,
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
        version: 1,
      };
      await this.putJson(this.sitePath(id), doc, { allowOverwrite: false });
      return toRecord(doc);
    } catch (e) {
      if (orderIndex && orderRef !== null) await this.releaseIndex(this.orderPath(orderRef), orderIndex.etag);
      await this.releaseIndex(slugPath, slugIndex.etag);
      throw e;
    }
  }

  private mutate(id: string, change: (site: StoredSite) => void): Promise<SiteRecord> {
    if (!UUID_RE.test(id)) return Promise.reject(new NotFoundError(`site ${id}`));
    return this.withLock(`site:${id}`, async () => {
      for (let attempt = 1; ; attempt++) {
        const current = await this.readJson<StoredSite>(this.sitePath(id));
        if (!current) throw new NotFoundError(`site ${id}`);
        const next = current.data; // freshly parsed: ours to change
        change(next);
        next.updatedAt = new Date(this.#now()).toISOString();
        next.version = (Number.isInteger(next.version) ? next.version : 0) + 1;
        try {
          await this.putJson(this.sitePath(id), next, { ifMatch: current.etag });
          return toRecord(next);
        } catch (e) {
          if (!(e instanceof BlobPreconditionFailedError)) throw e;
          // Someone else wrote (or deleted) the site since we read it.
          if (attempt >= this.#maxWriteAttempts) throw new WriteConflictError(`site ${id}`);
          await sleep(this.#retryDelayMs(attempt));
        }
      }
    });
  }

  updateContent(id: string, content: ContentRecord): Promise<SiteRecord> {
    const copy = structuredClone(content);
    return this.mutate(id, (site) => {
      site.content = copy;
    });
  }

  publish(id: string): Promise<SiteRecord> {
    return this.mutate(id, (site) => {
      site.publishedContent = structuredClone(site.content);
      site.status = 'published';
      site.publishedAt = new Date(this.#now()).toISOString();
    });
  }

  unpublish(id: string): Promise<SiteRecord> {
    return this.mutate(id, (site) => {
      site.status = 'draft';
    });
  }

  async deleteSite(id: string): Promise<void> {
    if (!UUID_RE.test(id)) return;
    const current = await this.readJson<StoredSite>(this.sitePath(id));
    if (!current) return;
    const site = current.data;
    await this.withLock(`site:${id}`, async () => {
      await this.deletePrefix(this.rsvpPrefix(id));
      await this.deletePrefix(this.mediaPrefix(id));
      await this.releaseIndexIfOwned(this.slugPath(site.slug), id);
      if (site.orderRef !== null) await this.releaseIndexIfOwned(this.orderPath(site.orderRef), id);
      // Last, so a deletion interrupted half-way can simply be run again.
      await this.del(this.sitePath(id));
    });
  }

  async saveRsvp(siteId: string, input: RsvpInput): Promise<RsvpRecord> {
    if (!(await this.getSiteById(siteId))) throw new NotFoundError(`site ${siteId}`);
    const ms = this.#now();
    const record: RsvpRecord = {
      id: randomUUID(),
      siteId,
      name: input.name,
      email: input.email ?? null,
      attending: input.attending,
      guests: input.guests,
      message: input.message ?? null,
      createdAt: new Date(ms).toISOString(),
    };
    // Time first so a listing sorts oldest first; the per-process counter orders same-millisecond replies.
    this.#rsvpSeq = (this.#rsvpSeq + 1) % 1_000_000;
    const file = `${String(ms).padStart(13, '0')}-${String(this.#rsvpSeq).padStart(6, '0')}-${record.id}.json`;
    await this.putJson(`${this.rsvpPrefix(siteId)}${file}`, record, { allowOverwrite: false });
    return { ...record };
  }

  async listRsvps(siteId: string): Promise<RsvpRecord[]> {
    if (!UUID_RE.test(siteId)) return [];
    const paths = await this.listAll(this.rsvpPrefix(siteId));
    const records = await mapLimit(paths, READ_CONCURRENCY, async (p) => (await this.readJson<RsvpRecord>(p))?.data ?? null);
    return records.filter((r): r is RsvpRecord => r !== null);
  }

  async savePhoto(siteId: string, photo: PhotoInput): Promise<SavedPhoto> {
    const type = assertImageUpload(photo.bytes);
    if (!(await this.getSiteById(siteId))) throw new NotFoundError(`site ${siteId}`);
    const file = `${randomBytes(16).toString('hex')}.${type.ext}`;
    const bytes = photo.bytes;
    await this.#client.put(`${this.mediaPrefix(siteId)}${file}`, Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength), {
      access: ACCESS,
      token: this.#token,
      contentType: type.contentType,
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: PHOTO_CACHE_SECONDS,
    });
    const rel = `${siteId}/${file}`;
    return { url: `${this.mediaBaseUrl}/${rel}`, path: rel, contentType: type.contentType, size: bytes.length };
  }

  async readPhoto(rel: string): Promise<StoredFile | null> {
    const m = PHOTO_PATH_RE.exec(rel);
    if (!m || !UUID_RE.test(m[1])) return null;
    // Photos never change (random names), so the CDN copy is fine here.
    const res = await this.#client.get(`media/${rel}`, { access: ACCESS, token: this.#token });
    if (!res || res.statusCode !== 200) return null;
    return { bytes: await readAll(res.stream), contentType: IMAGE_TYPES[m[3] as keyof typeof IMAGE_TYPES].contentType };
  }
}
