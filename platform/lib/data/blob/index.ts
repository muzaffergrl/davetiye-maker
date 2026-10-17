// Vercel Blob data adapter (G048): the first live version keeps all data in ONE private
// Vercel Blob store, no database (docs/10_SITE_PLATFORMU.md §2c).
//
//   sites/<id>.json                          SiteRecord + "version" (bumped on every write)
//   slugs/<slug>.json                        {"id"}  created with allowOverwrite:false -> unique slugs
//   orders/<ref>.json                        {"id"}  same rule -> one site per order reference
//   rsvps/<siteId>/<ms>-<seq>-<rsvpId>.json  one file per RSVP (no read-modify-write, no contention)
//   media/<siteId>/<random>.<ext>            photos; the app serves them at /media/<siteId>/<file> (readPhoto)
//   docs/<siteId>/<name>.json                site documents outside the record (G128: Google Sheets connection), ETag-checked
//                                            (G055: <random>-<width>w.<ext> + its 640/1280 px variants)
//
// Consistency:
//  - Index files (slug, order) are written first with allowOverwrite:false; the SDK refuses the
//    write if the pathname exists, so two server instances cannot both get the same slug/order.
//    If the site write then fails, the indexes are released (deleted with ifMatch). An index left
//    behind by a crashed instance (points to a site that does not exist) is reclaimed after
//    orphanGraceMs (15 min).
//    The real private store refuses allowOverwrite:false on an existing pathname and a stale ifMatch
//    (scripts/blob-smoke.mjs, G044/G049); atomicity under true simultaneity is the service's promise.
//  - Site updates are optimistic: read (with ETag) -> change -> put with ifMatch=ETag. A stale
//    write fails with BlobPreconditionFailedError — or, when two conditional writes overlap on the
//    real store, with a plain BlobError "… conflicting operation …" — and is retried on fresh data;
//    after maxWriteAttempts it throws WriteConflictError. Inside one process writes to a site are
//    also queued (fewer wasted round trips).
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
import { assertAudioUpload, MEDIA_CONTENT_TYPES, photoSetFiles } from '../../uploads.ts';
import {
  NotFoundError,
  applyRsvpUpdate,
  applySitePatch,
  rsvpLists,
  OrderRefTakenError,
  SlugTakenError,
  StaleSiteError,
  WriteConflictError,
  nextTimestamp,
  touchContentUpdatedAt,
  type DataAdapter,
  type NewSite,
  type PhotoInput,
  type PublishOptions,
  type RsvpInput,
  type RsvpRecord,
  type RsvpUpdate,
  type SavedPhoto,
  type SiteKeyHashes,
  type SitePatch,
  type SiteRecord,
  type StoredFile,
  type WriteOptions,
  SITE_DOC_NAME_RE,
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
/** <site>/<random>.<ext> (older uploads) or <site>/<random>-<width>w.<ext> (photo and size variants, G055). */
const PHOTO_PATH_RE = /^([0-9a-f-]{36})\/([0-9a-f]{32}(?:-[1-9]\d{0,4}w)?)\.(jpg|png|webp|avif|mp3|m4a|aac)$/;
const UPLOAD_ID_RE = /^[0-9a-f]{32}$/;
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

/**
 * "The conditional request cannot succeed due to a conflicting operation against this resource." — the real store's
 * answer when two conditional writes to one pathname overlap (G049 smoke test: 1 of 8 concurrent updates); the SDK
 * passes it on as a plain BlobError, not BlobPreconditionFailedError. It is a lost race, so it is retried like one.
 */
function looksLikeConcurrentWrite(e: unknown): boolean {
  return e instanceof BlobError && /conflicting operation/i.test(e.message);
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
  private partsPrefix(siteId: string) {
    return `parts/${siteId}/`;
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

  /**
   * Latest version from origin storage (never the CDN copy), or null.
   * The store answers larger (compressed) reads with a weak ETag (W/"…") but put/del ifMatch only accept
   * the strong form, so the W/ prefix is dropped (G044 smoke test on the real private store).
   */
  private async readJson<T>(pathname: string): Promise<Read<T> | null> {
    const res = await this.#client.get(pathname, { access: ACCESS, token: this.#token, useCache: false });
    if (!res || res.statusCode !== 200) return null;
    const text = new TextDecoder().decode(await readAll(res.stream));
    return { data: JSON.parse(text) as T, etag: res.blob.etag.replace(/^W\//, ''), uploadedAt: res.blob.uploadedAt };
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
          // released in between, or a concurrent claim not visible yet: try again
          if (looksLikeAlreadyExists(e) || looksLikeConcurrentWrite(e)) continue;
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

  async listSites(): Promise<SiteRecord[]> {
    const paths = (await this.listAll('sites/')).filter((p) => /^sites\/[0-9a-f-]{36}\.json$/.test(p));
    const records = await mapLimit(paths, READ_CONCURRENCY, async (p) => {
      const res = await this.readJson<StoredSite>(p);
      return res ? toRecord(res.data) : null;
    });
    return records.filter((r): r is SiteRecord => r !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /** One listing of rsvps/ (no reads): rsvps/<siteId>/<file>.json → count per site. */
  async rsvpCounts(): Promise<Record<string, number>> {
    const out: Record<string, number> = {};
    for (const p of await this.listAll('rsvps/')) {
      const m = /^rsvps\/([0-9a-f-]{36})\/[^/]+\.json$/.exec(p);
      if (m) out[m[1]] = (out[m[1]] ?? 0) + 1;
    }
    return out;
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
        contentUpdatedAt: now,
        publishedAt: null,
        ...(input.claimTokenHash ? { claimTokenHash: input.claimTokenHash } : {}),
        ...(input.orderCheck ? { orderCheck: structuredClone(input.orderCheck) } : {}),
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
        const contentBefore = JSON.stringify(next.content);
        const updatedBefore = next.updatedAt;
        change(next);
        next.updatedAt = nextTimestamp(next.updatedAt, this.#now());
        touchContentUpdatedAt(next, contentBefore, updatedBefore);
        next.version = (Number.isInteger(next.version) ? next.version : 0) + 1;
        try {
          await this.putJson(this.sitePath(id), next, { ifMatch: current.etag });
          return toRecord(next);
        } catch (e) {
          if (!(e instanceof BlobPreconditionFailedError) && !looksLikeConcurrentWrite(e)) throw e;
          // Someone else wrote (or deleted) the site since we read it, or is writing it right now.
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

  publish(id: string, opts: PublishOptions = {}): Promise<SiteRecord> {
    return this.mutate(id, (site) => {
      // Runs on the freshly read version that the conditional write (ifMatch) then replaces: if
      // anything was saved after the caller validated, this throws instead of publishing it.
      if (opts.expectedUpdatedAt !== undefined && site.updatedAt !== opts.expectedUpdatedAt) {
        throw new StaleSiteError(id, site.updatedAt);
      }
      site.publishedContent = structuredClone(site.content);
      site.status = 'published';
      site.publishedAt = new Date(this.#now()).toISOString();
      if (opts.set) applySitePatch(site, opts.set);
    });
  }

  patchSite(id: string, patch: SitePatch, opts: WriteOptions = {}): Promise<SiteRecord> {
    const copy = structuredClone(patch);
    return this.mutate(id, (site) => {
      // Checked on the freshly read version that this write replaces (G060: rights counter + content in step).
      if (opts.expectedUpdatedAt !== undefined && site.updatedAt !== opts.expectedUpdatedAt) {
        throw new StaleSiteError(id, site.updatedAt);
      }
      applySitePatch(site, copy);
    });
  }

  unpublish(id: string): Promise<SiteRecord> {
    return this.mutate(id, (site) => {
      site.status = 'draft';
    });
  }

  updateKeys(id: string, keys: SiteKeyHashes): Promise<SiteRecord> {
    return this.mutate(id, (site) => {
      site.editKeyHash = keys.editKeyHash;
      site.previewKeyHash = keys.previewKeyHash;
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
      await this.deletePrefix(`docs/${id}/`);
      await this.deletePrefix(this.partsPrefix(id));
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
      ...rsvpLists(input),
      createdAt: new Date(ms).toISOString(),
      ...(input.held ? { held: true } : {}),
      ...(input.source === 'couple' ? { source: 'couple' as const } : {}),
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

  /** Pathnames of these replies (the reply id is the last part of the file name). */
  private async rsvpPathsFor(siteId: string, ids: readonly string[]): Promise<string[]> {
    if (!UUID_RE.test(siteId) || !ids.length) return [];
    const want = new Set(ids);
    return (await this.listAll(this.rsvpPrefix(siteId))).filter((p) => {
      const m = /-([0-9a-f-]{36})\.json$/.exec(p);
      return m !== null && want.has(m[1]);
    });
  }

  async deleteRsvps(siteId: string, ids: readonly string[]): Promise<number> {
    const paths = await this.rsvpPathsFor(siteId, ids);
    for (let i = 0; i < paths.length; i += DELETE_BATCH) await this.del(paths.slice(i, i + DELETE_BATCH));
    return paths.length;
  }

  async updateRsvp(siteId: string, id: string, update: RsvpUpdate): Promise<RsvpRecord | null> {
    const [p] = await this.rsvpPathsFor(siteId, [id]);
    if (!p) return null;
    // A couple's correction: read-modify-write guarded by the ETag (a "keep" or a second tab in between -> read again).
    for (let attempt = 0; attempt < 4; attempt++) {
      const current = await this.readJson<RsvpRecord>(p);
      if (!current) return null;
      const next = applyRsvpUpdate(current.data, update, new Date(this.#now()).toISOString());
      try {
        await this.putJson(p, next, { ifMatch: current.etag });
        return { ...next };
      } catch (e) {
        if (!(e instanceof BlobPreconditionFailedError) && !looksLikeConcurrentWrite(e)) throw e;
      }
    }
    throw new WriteConflictError(`reply ${id}`);
  }

  async setRsvpsHeld(siteId: string, ids: readonly string[], held: boolean): Promise<number> {
    const paths = await this.rsvpPathsFor(siteId, ids);
    const changed = await mapLimit(paths, READ_CONCURRENCY, async (p): Promise<number> => {
      const current = await this.readJson<RsvpRecord>(p);
      if (!current || Boolean(current.data.held) === held) return 0;
      const { held: _old, ...rest } = current.data;
      try {
        // Replies are never edited otherwise; ifMatch only guards against a delete in between.
        await this.putJson(p, held ? { ...rest, held: true } : rest, { ifMatch: current.etag });
        return 1;
      } catch (e) {
        if (e instanceof BlobPreconditionFailedError) return 0;
        throw e;
      }
    });
    return changed.reduce((a, b) => a + b, 0);
  }

  async savePhoto(siteId: string, photo: PhotoInput): Promise<SavedPhoto> {
    const { type, files } = photoSetFiles(photo, randomBytes(16).toString('hex'));
    if (!(await this.getSiteById(siteId))) throw new NotFoundError(`site ${siteId}`);
    // Variants first, the photo last (its URL is what the content will point to).
    for (const f of files) {
      const bytes = f.bytes;
      await this.#client.put(`${this.mediaPrefix(siteId)}${f.name}`, Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength), {
        access: ACCESS,
        token: this.#token,
        contentType: type.contentType,
        addRandomSuffix: false,
        allowOverwrite: false,
        cacheControlMaxAge: PHOTO_CACHE_SECONDS,
      });
    }
    const stored = files.map((f) => ({ width: f.width, rel: `${siteId}/${f.name}`, size: f.bytes.length }));
    const main = stored[stored.length - 1];
    return {
      url: `${this.mediaBaseUrl}/${main.rel}`,
      path: main.rel,
      contentType: type.contentType,
      size: main.size,
      variants: stored.slice(0, -1).map((v) => ({ width: v.width!, url: `${this.mediaBaseUrl}/${v.rel}`, path: v.rel, size: v.size })),
    };
  }

  async saveAudio(siteId: string, input: { bytes: Uint8Array; contentType?: string | null }): Promise<SavedPhoto> {
    const type = assertAudioUpload(input.bytes, input.contentType ?? null);
    if (!(await this.getSiteById(siteId))) throw new NotFoundError(`site ${siteId}`);
    const name = `${randomBytes(16).toString('hex')}.${type.ext}`;
    const b = input.bytes;
    await this.#client.put(`${this.mediaPrefix(siteId)}${name}`, Buffer.from(b.buffer, b.byteOffset, b.byteLength), {
      access: ACCESS,
      token: this.#token,
      contentType: type.contentType,
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: PHOTO_CACHE_SECONDS,
    });
    const rel = `${siteId}/${name}`;
    return { url: `${this.mediaBaseUrl}/${rel}`, path: rel, contentType: type.contentType, size: b.length, variants: [] };
  }

  async putUploadPart(siteId: string, uploadId: string, index: number, bytes: Uint8Array): Promise<void> {
    if (!UUID_RE.test(siteId) || !UPLOAD_ID_RE.test(uploadId) || !Number.isInteger(index) || index < 0 || index > 99) throw new Error('invalid upload part');
    await this.#client.put(`${this.partsPrefix(siteId)}${uploadId}-${index}`, Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength), {
      access: ACCESS,
      token: this.#token,
      contentType: 'application/octet-stream',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: JSON_CACHE_SECONDS,
    });
  }

  async takeUploadParts(siteId: string, uploadId: string, count: number): Promise<Uint8Array[] | null> {
    if (!UUID_RE.test(siteId) || !UPLOAD_ID_RE.test(uploadId)) return null;
    const names = Array.from({ length: count }, (_, i) => `${this.partsPrefix(siteId)}${uploadId}-${i}`);
    try {
      const parts: Uint8Array[] = [];
      for (const n of names) {
        // parts are written just before: read past the CDN copy
        const res = await this.#client.get(n, { access: ACCESS, token: this.#token, useCache: false });
        if (!res || res.statusCode !== 200) return null;
        parts.push(await readAll(res.stream));
      }
      return parts;
    } finally {
      await Promise.all(names.map((n) => this.del(n).catch(() => undefined)));
    }
  }

  async countPhotos(siteId: string): Promise<number> {
    if (!UUID_RE.test(siteId)) return 0;
    return (await this.listAll(this.mediaPrefix(siteId))).length;
  }

  /**
   * Shared fixed-window counter (G060-fix): limits/<sha256(key)>.json = {count, resetAt}, changed with a conditional
   * write (ifMatch / allowOverwrite:false) and retried on a concurrent write, so every server instance counts the
   * same window. One read + one write per hit. Old windows are overwritten in place (one small file per key).
   */
  async hitCounter(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const pathname = `limits/${createHash('sha256').update(key).digest('hex')}.json`;
    for (let attempt = 1; ; attempt++) {
      const now = this.#now();
      const current = await this.readJson<{ count?: unknown; resetAt?: unknown }>(pathname);
      const live = current && typeof current.data.resetAt === 'number' && current.data.resetAt > now && typeof current.data.count === 'number';
      const next = live ? { count: (current!.data.count as number) + 1, resetAt: current!.data.resetAt as number } : { count: 1, resetAt: now + windowMs };
      try {
        await this.putJson(pathname, next, current ? { ifMatch: current.etag } : { allowOverwrite: false });
        return next;
      } catch (e) {
        let conflict = e instanceof BlobPreconditionFailedError || looksLikeConcurrentWrite(e) || looksLikeAlreadyExists(e);
        // The SDK reports an existing pathname as a plain BlobError: a counter that exists now was made in between.
        if (!conflict && !current && e instanceof BlobError) conflict = Boolean(await this.readJson(pathname));
        if (!conflict) throw e;
        if (attempt >= this.#maxWriteAttempts) throw new WriteConflictError(`counter ${pathname}`);
        await sleep(this.#retryDelayMs(attempt));
      }
    }
  }

  /** The current window of a shared counter without adding a hit (G076: a locked-out guest password form). */
  async readCounter(key: string): Promise<{ count: number; resetAt: number } | null> {
    const pathname = `limits/${createHash('sha256').update(key).digest('hex')}.json`;
    const current = await this.readJson<{ count?: unknown; resetAt?: unknown }>(pathname);
    if (!current || typeof current.data.count !== 'number' || typeof current.data.resetAt !== 'number') return null;
    return current.data.resetAt > this.#now() ? { count: current.data.count, resetAt: current.data.resetAt } : null;
  }

  async readSiteDoc(siteId: string, name: string): Promise<unknown | null> {
    if (!UUID_RE.test(siteId) || !SITE_DOC_NAME_RE.test(name)) return null;
    return (await this.readJson<unknown>(`docs/${siteId}/${name}.json`))?.data ?? null;
  }

  /** Read (ETag) -> change -> conditional put / delete; a concurrent write makes it start again on fresh data. */
  updateSiteDoc<T>(siteId: string, name: string, change: (current: T | null) => T | null): Promise<T | null> {
    if (!UUID_RE.test(siteId) || !SITE_DOC_NAME_RE.test(name)) return Promise.resolve(null);
    const pathname = `docs/${siteId}/${name}.json`;
    return this.withLock(`doc:${pathname}`, async () => {
      for (let attempt = 1; ; attempt++) {
        const current = await this.readJson<T>(pathname);
        const next = change(current ? structuredClone(current.data) : null);
        try {
          if (next === null) {
            if (current) await this.del(pathname, current.etag);
          } else {
            await this.putJson(pathname, next, current ? { ifMatch: current.etag } : { allowOverwrite: false });
          }
          return next;
        } catch (e) {
          let conflict = e instanceof BlobPreconditionFailedError || looksLikeConcurrentWrite(e) || looksLikeAlreadyExists(e);
          if (!conflict && !current && e instanceof BlobError) conflict = Boolean(await this.readJson(pathname));
          if (!conflict) throw e;
          if (attempt >= this.#maxWriteAttempts) throw new WriteConflictError(`document ${pathname}`);
          await sleep(this.#retryDelayMs(attempt));
        }
      }
    });
  }

  async readPhoto(rel: string): Promise<StoredFile | null> {
    const m = PHOTO_PATH_RE.exec(rel);
    if (!m || !UUID_RE.test(m[1])) return null;
    // Photos never change (random names), so the CDN copy is fine here.
    const res = await this.#client.get(`media/${rel}`, { access: ACCESS, token: this.#token });
    if (!res || res.statusCode !== 200) return null;
    return { bytes: await readAll(res.stream), contentType: MEDIA_CONTENT_TYPES[m[3]] };
  }
}
