// In-memory fake of the @vercel/blob calls the blob adapter uses (put, get, del, list).
// It follows the SDK 2.8.0 documentation and source (node_modules/@vercel/blob/dist) and throws the
// SDK's own error classes, so the adapter's error handling is exercised as in production:
//
//  put   access required ('public'|'private'); pathname required, no "//", <= 950 chars;
//        allowOverwrite defaults to false -> an existing pathname throws BlobError
//        ("This blob already exists, use `allowOverwrite: true` …", the API's bad_request message);
//        ifMatch implies overwrite, mismatch/missing -> BlobPreconditionFailedError;
//        ifMatch + allowOverwrite:false -> BlobError (contradictory, checked client-side by the SDK);
//        addRandomSuffix defaults to false; returns {url, downloadUrl, pathname, contentType, contentDisposition, etag}.
//  get   null when missing; {statusCode: 200, stream, headers, blob: {…, etag, uploadedAt}}; ifNoneMatch -> 304.
//        With `staleCdn` on, reads WITHOUT useCache:false may return the copy cached at the first read
//        (the documented "up to 60 seconds" lag after an overwrite); useCache:false always reads origin
//        (the SDK only honours it for private blobs).
//  del   string or array; missing pathnames are ignored; ifMatch only with one pathname, mismatch ->
//        BlobPreconditionFailedError.
//  list  prefix, limit (default/max 1000), cursor, hasMore; pathname order.
//  Client-side checks (body, pathname, access, ifMatch+allowOverwrite, del ifMatch with several
//  pathnames) use the SDK's exact messages; blob-adapter.test.ts compares them with the real SDK.
//
// ASSUMPTIONS (not verified against the real service; see platform/README.md):
//  - a store's access mode is fixed at creation; writing/reading with the other mode is refused here;
//  - allowOverwrite:false and ifMatch are atomic on the server (two concurrent writers cannot both win);
//  - del with ifMatch on a missing blob fails the precondition (HTTP If-Match semantics).
//
// Credentials: the SDK takes options.token or BLOB_READ_WRITE_TOKEN; without either it throws
// BlobError("No blob credentials found …"); a wrong token is a 403 -> BlobAccessError.

import { createHash, randomBytes } from 'node:crypto';
import {
  BlobAccessError,
  BlobError,
  BlobPreconditionFailedError,
  type DeleteCommandOptions,
  type GetBlobResult,
  type GetCommandOptions,
  type ListBlobResult,
  type ListCommandOptions,
  type PutBlobResult,
  type PutCommandOptions,
} from '@vercel/blob';
import type { BlobClient } from '../lib/data/blob/index.ts';

type Access = 'public' | 'private';

interface StoredObject {
  pathname: string;
  bytes: Uint8Array;
  contentType: string;
  etag: string;
  uploadedAt: Date;
  cacheControlMaxAge: number;
  access: Access;
}

export interface FakeCall {
  op: 'put' | 'get' | 'del' | 'list';
  pathname?: string;
  options: Record<string, unknown>;
}

const MAX_PATHNAME = 950;
const TYPES: Record<string, string> = {
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  txt: 'text/plain',
};

export interface FakeBlobOptions {
  token?: string;
  access?: Access;
  /** Simulate the CDN copy that lags behind overwrites (only bypassed by useCache:false on private). */
  staleCdn?: boolean;
  /** Random 0..n ms delay before and after each operation, so concurrent calls interleave. */
  jitterMs?: number;
  now?: () => number;
}

export class FakeBlobStore {
  readonly storeId = 'fakestore0123456';
  readonly token: string;
  readonly access: Access;
  readonly calls: FakeCall[] = [];
  staleCdn: boolean;
  jitterMs: number;
  now: () => number;
  /** Runs inside put() before the write is applied (tests use it to inject a concurrent writer). */
  beforePut: ((pathname: string, body: string | Buffer, options: PutCommandOptions) => Promise<void> | void) | null = null;
  /** Test knob: the most blobs one list() page returns (the API's own maximum is 1000). */
  listPageCap = 1000;
  private objects = new Map<string, StoredObject>();
  private cdn = new Map<string, StoredObject>();

  constructor(opts: FakeBlobOptions = {}) {
    this.token = opts.token ?? `vercel_blob_rw_${this.storeId}_${randomBytes(12).toString('hex')}`;
    this.access = opts.access ?? 'private';
    this.staleCdn = opts.staleCdn ?? false;
    this.jitterMs = opts.jitterMs ?? 0;
    this.now = opts.now ?? Date.now;
  }

  /** The functions, shaped like the SDK's. */
  client(): BlobClient {
    return {
      put: (pathname, body, options) => this.put(pathname, body, options),
      get: (pathname, options) => this.get(pathname, options),
      del: (pathnames, options) => this.del(pathnames, options),
      list: (options) => this.list(options),
    };
  }

  // --- inspection helpers for tests (not part of the SDK) ----------------------------------------

  paths(): string[] {
    return [...this.objects.keys()].sort();
  }
  has(pathname: string): boolean {
    return this.objects.has(pathname);
  }
  text(pathname: string): string | null {
    const o = this.objects.get(pathname);
    return o ? new TextDecoder().decode(o.bytes) : null;
  }
  object(pathname: string): Readonly<StoredObject> | null {
    return this.objects.get(pathname) ?? null;
  }
  /** Writes directly (as another server would), bypassing checks. */
  seed(pathname: string, body: string | Uint8Array, opts: { uploadedAt?: Date; contentType?: string } = {}): void {
    const bytes = typeof body === 'string' ? new TextEncoder().encode(body) : body;
    this.objects.set(pathname, this.makeObject(pathname, bytes, opts.contentType ?? this.typeFor(pathname), 60, this.access, opts.uploadedAt));
  }

  // --- SDK surface -------------------------------------------------------------------------------

  async put(pathname: string, body: string | Buffer, options: PutCommandOptions): Promise<PutBlobResult> {
    this.calls.push({ op: 'put', pathname, options: this.safe(options) });
    if (!body) throw new BlobError('body is required');
    if (!pathname) throw new BlobError('pathname is required');
    if (pathname.length > MAX_PATHNAME) throw new BlobError(`pathname is too long, maximum length is ${MAX_PATHNAME}`);
    if (pathname.includes('//')) throw new BlobError('pathname cannot contain "//", please encode it if needed');
    if (!options) throw new BlobError('missing options, see usage');
    if (options.access !== 'public' && options.access !== 'private') {
      throw new BlobError('access must be "private" or "public", see https://vercel.com/docs/vercel-blob');
    }
    if (options.ifMatch && options.allowOverwrite === false) {
      throw new BlobError(
        'ifMatch and allowOverwrite: false are contradictory. ifMatch is used for conditional overwrites, which requires allowOverwrite to be true.',
      );
    }
    this.checkToken(options.token);
    await this.jitter();
    if (this.beforePut) await this.beforePut(pathname, body, options);
    this.checkAccess(options.access);

    let target = pathname;
    if (options.addRandomSuffix) {
      const dot = pathname.lastIndexOf('.');
      const suffix = `-${randomBytes(15).toString('base64url').replace(/[-_]/g, 'x')}`;
      target = dot > pathname.lastIndexOf('/') ? `${pathname.slice(0, dot)}${suffix}${pathname.slice(dot)}` : `${pathname}${suffix}`;
    }
    const existing = this.objects.get(target);
    if (options.ifMatch) {
      if (!existing || existing.etag !== options.ifMatch) throw new BlobPreconditionFailedError();
    } else if (existing && options.allowOverwrite !== true) {
      throw new BlobError(
        'This blob already exists, use `allowOverwrite: true` if you want to overwrite it. Or `addRandomSuffix: true` to generate a unique filename.',
      );
    }
    const bytes = typeof body === 'string' ? new TextEncoder().encode(body) : new Uint8Array(body);
    const obj = this.makeObject(target, bytes, options.contentType ?? this.typeFor(target), options.cacheControlMaxAge ?? 2_592_000, options.access);
    this.objects.set(target, obj);
    await this.jitter();
    return {
      url: this.url(target),
      downloadUrl: `${this.url(target)}?download=1`,
      pathname: target,
      contentType: obj.contentType,
      contentDisposition: `attachment; filename="${target.split('/').pop()}"`,
      etag: obj.etag,
    };
  }

  async get(pathname: string, options: GetCommandOptions): Promise<GetBlobResult | null> {
    this.calls.push({ op: 'get', pathname, options: this.safe(options) });
    if (!pathname) throw new BlobError('url or pathname is required');
    if (!options) throw new BlobError('missing options, see usage');
    if (options.access !== 'public' && options.access !== 'private') {
      throw new BlobError('access must be "private" or "public", see https://vercel.com/docs/vercel-blob');
    }
    this.checkToken(options.token);
    await this.jitter();
    this.checkAccess(options.access);
    const fromOrigin = options.useCache === false && options.access === 'private';
    let obj = this.objects.get(pathname);
    if (this.staleCdn && !fromOrigin) {
      const cached = this.cdn.get(pathname);
      if (cached) obj = cached;
      else if (obj) this.cdn.set(pathname, obj);
    }
    if (!obj) return null;
    const headers = new Headers({ etag: obj.etag, 'content-type': obj.contentType, 'last-modified': obj.uploadedAt.toUTCString() });
    const base = {
      url: this.url(pathname),
      downloadUrl: `${this.url(pathname)}?download=1`,
      pathname,
      contentDisposition: `attachment; filename="${pathname.split('/').pop()}"`,
      cacheControl: `public, max-age=${obj.cacheControlMaxAge}`,
      uploadedAt: obj.uploadedAt,
      etag: obj.etag,
    };
    if (options.ifNoneMatch && options.ifNoneMatch === obj.etag) {
      return { statusCode: 304, stream: null, headers, blob: { ...base, contentType: null, size: null } } as unknown as GetBlobResult;
    }
    const bytes = obj.bytes.slice();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        // Two chunks, like a network body.
        const mid = Math.floor(bytes.length / 2);
        if (mid) controller.enqueue(bytes.subarray(0, mid));
        controller.enqueue(bytes.subarray(mid));
        controller.close();
      },
    });
    return { statusCode: 200, stream, headers, blob: { ...base, contentType: obj.contentType, size: bytes.length } } as unknown as GetBlobResult;
  }

  async del(pathnames: string | string[], options?: DeleteCommandOptions): Promise<void> {
    const list = Array.isArray(pathnames) ? pathnames : [pathnames];
    this.calls.push({ op: 'del', pathname: list.join(','), options: this.safe(options ?? {}) });
    if (options?.ifMatch && list.length > 1) throw new BlobError('ifMatch can only be used when deleting a single URL.');
    this.checkToken(options?.token);
    await this.jitter();
    if (options?.ifMatch) {
      const obj = this.objects.get(list[0]);
      if (!obj || obj.etag !== options.ifMatch) throw new BlobPreconditionFailedError();
    }
    for (const p of list) {
      this.objects.delete(p);
      this.cdn.delete(p);
    }
    await this.jitter();
  }

  async list(options: ListCommandOptions<'expanded'> = {}): Promise<ListBlobResult> {
    this.calls.push({ op: 'list', options: this.safe(options) });
    this.checkToken(options.token);
    await this.jitter();
    const limit = Math.min(options.limit ?? 1000, 1000, this.listPageCap);
    const all = this.paths().filter((p) => !options.prefix || p.startsWith(options.prefix));
    const start = options.cursor ? Number(Buffer.from(options.cursor, 'base64url').toString()) : 0;
    const page = all.slice(start, start + limit);
    const hasMore = start + limit < all.length;
    return {
      blobs: page.map((p) => {
        const o = this.objects.get(p)!;
        return { url: this.url(p), downloadUrl: `${this.url(p)}?download=1`, pathname: p, size: o.bytes.length, uploadedAt: o.uploadedAt, etag: o.etag };
      }),
      cursor: hasMore ? Buffer.from(String(start + limit)).toString('base64url') : undefined,
      hasMore,
    };
  }

  // --- internals ---------------------------------------------------------------------------------

  private makeObject(pathname: string, bytes: Uint8Array, contentType: string, maxAge: number, access: Access, uploadedAt?: Date): StoredObject {
    const etag = `"${createHash('sha256').update(pathname).update(bytes).update(randomBytes(8)).digest('hex').slice(0, 24)}"`;
    return { pathname, bytes, contentType, etag, uploadedAt: uploadedAt ?? new Date(this.now()), cacheControlMaxAge: maxAge, access };
  }

  private typeFor(pathname: string): string {
    const ext = pathname.split('.').pop()?.toLowerCase() ?? '';
    return TYPES[ext] ?? 'application/octet-stream';
  }

  private url(pathname: string): string {
    return `https://${this.storeId}.${this.access}.blob.vercel-storage.com/${pathname}`;
  }

  private checkToken(token: string | undefined): void {
    const effective = token || process.env.BLOB_READ_WRITE_TOKEN;
    if (!effective) {
      throw new BlobError(
        'No blob credentials found. Pass a `token` option, set `BLOB_READ_WRITE_TOKEN`, or use `oidcToken` (or `VERCEL_OIDC_TOKEN`) with `storeId` or `BLOB_STORE_ID`.',
      );
    }
    if (effective !== this.token) throw new BlobAccessError();
  }

  private checkAccess(access: Access): void {
    if (access !== this.access) throw new BlobError(`Cannot use access "${access}" on a ${this.access} store`);
  }

  private safe(options: object): Record<string, unknown> {
    const { token: _token, ...rest } = options as Record<string, unknown>;
    return { ...rest, hasToken: typeof _token === 'string' && _token.length > 0 };
  }

  private async jitter(): Promise<void> {
    if (this.jitterMs > 0) await new Promise((r) => setTimeout(r, Math.random() * this.jitterMs));
    else await new Promise((r) => setImmediate(r));
  }
}
