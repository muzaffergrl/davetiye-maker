// Local data adapter: JSON files + an uploads folder (development and tests only).
//
//   <dir>/sites/<id>.json        SiteRecord
//   <dir>/slugs/<slug>.json      {"id": "<id>"}  (created with O_EXCL -> unique slugs)
//   <dir>/rsvps/<siteId>.json    RsvpRecord[]
//   <dir>/uploads/<siteId>/<random>.<ext>          (or <random>-<width>w.<ext> + size variants, G055)
//
// Writes are atomic (temp file + rename) and serialised per record inside one process.
// Not meant for multiple server processes sharing one folder.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
import type { ContentRecord } from '../../content/types.ts';
import { IMAGE_TYPES, photoSetFiles } from '../../uploads.ts';
import {
  NotFoundError,
  SlugTakenError,
  StaleSiteError,
  nextTimestamp,
  type DataAdapter,
  type NewSite,
  type PhotoInput,
  type PublishOptions,
  type RsvpInput,
  type RsvpRecord,
  type SavedPhoto,
  type SiteKeyHashes,
  type SiteRecord,
  type StoredFile,
} from '../types.ts';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SLUG_FILE_RE = /^[a-z0-9-]{1,64}$/;
/** <site>/<random>.<ext> (older uploads) or <site>/<random>-<width>w.<ext> (photo and size variants, G055). */
const PHOTO_PATH_RE = /^([0-9a-f-]{36})\/([0-9a-f]{32}(?:-[1-9]\d{0,4}w)?)\.(jpg|png|webp|avif)$/;

export class LocalAdapter implements DataAdapter {
  readonly kind = 'local' as const;
  readonly dir: string;
  readonly mediaBaseUrl: string;
  private locks = new Map<string, Promise<unknown>>();

  constructor(dir: string, opts: { mediaBaseUrl?: string } = {}) {
    this.dir = path.resolve(/*turbopackIgnore: true*/ dir);
    this.mediaBaseUrl = opts.mediaBaseUrl ?? '/media';
  }

  private sitePath(id: string) {
    return path.join(this.dir, 'sites', `${id}.json`);
  }
  private slugPath(slug: string) {
    return path.join(this.dir, 'slugs', `${slug}.json`);
  }
  private rsvpPath(siteId: string) {
    return path.join(this.dir, 'rsvps', `${siteId}.json`);
  }
  private uploadDir(siteId: string) {
    return path.join(/*turbopackIgnore: true*/ this.dir, 'uploads', siteId);
  }

  /** Serialises async work per key (read-modify-write safety within this process). */
  private async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.locks.get(key) ?? Promise.resolve();
    const run = prev.then(fn, fn);
    const tail = run.catch(() => undefined);
    this.locks.set(key, tail);
    try {
      return await run;
    } finally {
      if (this.locks.get(key) === tail) this.locks.delete(key);
    }
  }

  private async readJson<T>(file: string): Promise<T | null> {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8')) as T;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw e;
    }
  }

  private async writeJson(file: string, value: unknown): Promise<void> {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${randomBytes(6).toString('hex')}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2));
    await fs.rename(tmp, file);
  }

  async getSiteById(id: string): Promise<SiteRecord | null> {
    if (!UUID_RE.test(id)) return null;
    return this.readJson<SiteRecord>(this.sitePath(id));
  }

  async getSiteBySlug(slug: string): Promise<SiteRecord | null> {
    if (!SLUG_FILE_RE.test(slug)) return null;
    const ref = await this.readJson<{ id: string }>(this.slugPath(slug));
    return ref ? this.getSiteById(ref.id) : null;
  }

  async findSitesByOrderRef(orderRef: string): Promise<SiteRecord[]> {
    let files: string[];
    try {
      files = await fs.readdir(path.join(this.dir, 'sites'));
    } catch {
      return [];
    }
    const out: SiteRecord[] = [];
    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      const site = await this.readJson<SiteRecord>(path.join(this.dir, 'sites', f));
      if (site && site.orderRef === orderRef) out.push(site);
    }
    return out.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async createSite(input: NewSite): Promise<SiteRecord> {
    if (!SLUG_FILE_RE.test(input.slug)) throw new Error(`invalid slug "${input.slug}"`);
    const id = randomUUID();
    await fs.mkdir(path.join(this.dir, 'slugs'), { recursive: true });
    try {
      await fs.writeFile(this.slugPath(input.slug), JSON.stringify({ id }), { flag: 'wx' });
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'EEXIST') throw new SlugTakenError(input.slug);
      throw e;
    }
    const now = new Date().toISOString();
    const site: SiteRecord = {
      id,
      slug: input.slug,
      theme: input.theme,
      variant: input.variant ?? null,
      status: 'draft',
      content: structuredClone(input.content),
      publishedContent: null,
      editKeyHash: input.editKeyHash,
      previewKeyHash: input.previewKeyHash,
      orderRef: input.orderRef ?? null,
      ownerEmail: input.ownerEmail ?? null,
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
      ...(input.claimTokenHash ? { claimTokenHash: input.claimTokenHash } : {}),
    };
    await this.writeJson(this.sitePath(id), site);
    return structuredClone(site);
  }

  private mutate(id: string, change: (site: SiteRecord) => void): Promise<SiteRecord> {
    return this.withLock(`site:${id}`, async () => {
      const site = await this.getSiteById(id);
      if (!site) throw new NotFoundError(`site ${id}`);
      change(site);
      site.updatedAt = nextTimestamp(site.updatedAt);
      await this.writeJson(this.sitePath(id), site);
      return site;
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
      // Checked under the lock, so the content copied is exactly the version that was validated.
      if (opts.expectedUpdatedAt !== undefined && site.updatedAt !== opts.expectedUpdatedAt) {
        throw new StaleSiteError(id, site.updatedAt);
      }
      site.publishedContent = structuredClone(site.content);
      site.status = 'published';
      site.publishedAt = new Date().toISOString();
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
    const site = await this.getSiteById(id);
    if (!site) return;
    await this.withLock(`site:${id}`, async () => {
      await fs.rm(this.slugPath(site.slug), { force: true });
      await fs.rm(this.sitePath(id), { force: true });
      await fs.rm(this.rsvpPath(id), { force: true });
      await fs.rm(this.uploadDir(id), { recursive: true, force: true });
    });
  }

  async saveRsvp(siteId: string, input: RsvpInput): Promise<RsvpRecord> {
    if (!(await this.getSiteById(siteId))) throw new NotFoundError(`site ${siteId}`);
    const record: RsvpRecord = {
      id: randomUUID(),
      siteId,
      name: input.name,
      email: input.email ?? null,
      attending: input.attending,
      guests: input.guests,
      message: input.message ?? null,
      ...(input.answers?.length ? { answers: input.answers.map((a) => ({ id: a.id, question: a.question, answer: a.answer })) } : {}),
      createdAt: new Date().toISOString(),
      ...(input.held ? { held: true } : {}),
    };
    await this.withLock(`rsvps:${siteId}`, async () => {
      const list = (await this.readJson<RsvpRecord[]>(this.rsvpPath(siteId))) ?? [];
      list.push(record);
      await this.writeJson(this.rsvpPath(siteId), list);
    });
    return { ...record };
  }

  async listRsvps(siteId: string): Promise<RsvpRecord[]> {
    if (!UUID_RE.test(siteId)) return [];
    return (await this.readJson<RsvpRecord[]>(this.rsvpPath(siteId))) ?? [];
  }

  /** Rewrites the site's reply list with `fn` (under the list's lock). Returns how many replies `fn` changed. */
  private async editRsvps(siteId: string, fn: (list: RsvpRecord[]) => { list: RsvpRecord[]; changed: number }): Promise<number> {
    if (!UUID_RE.test(siteId)) return 0;
    return this.withLock(`rsvps:${siteId}`, async () => {
      const current = (await this.readJson<RsvpRecord[]>(this.rsvpPath(siteId))) ?? [];
      const { list, changed } = fn(current);
      if (changed) await this.writeJson(this.rsvpPath(siteId), list);
      return changed;
    });
  }

  deleteRsvps(siteId: string, ids: readonly string[]): Promise<number> {
    const drop = new Set(ids);
    return this.editRsvps(siteId, (all) => {
      const list = all.filter((r) => !drop.has(r.id));
      return { list, changed: all.length - list.length };
    });
  }

  setRsvpsHeld(siteId: string, ids: readonly string[], held: boolean): Promise<number> {
    const pick = new Set(ids);
    return this.editRsvps(siteId, (all) => {
      let changed = 0;
      const list = all.map((r) => {
        if (!pick.has(r.id) || Boolean(r.held) === held) return r;
        changed += 1;
        const { held: _old, ...rest } = r;
        return held ? { ...rest, held: true } : rest;
      });
      return { list, changed };
    });
  }

  async savePhoto(siteId: string, photo: PhotoInput): Promise<SavedPhoto> {
    const { type, files } = photoSetFiles(photo, randomBytes(16).toString('hex'));
    if (!(await this.getSiteById(siteId))) throw new NotFoundError(`site ${siteId}`);
    const dir = this.uploadDir(siteId);
    await fs.mkdir(dir, { recursive: true });
    // Variants first, the photo last (its URL is what the content will point to).
    for (const f of files) await fs.writeFile(path.join(/*turbopackIgnore: true*/ dir, f.name), f.bytes, { flag: 'wx' });
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

  async readPhoto(rel: string): Promise<StoredFile | null> {
    const m = PHOTO_PATH_RE.exec(rel);
    if (!m || !UUID_RE.test(m[1])) return null;
    try {
      const bytes = await fs.readFile(path.join(/*turbopackIgnore: true*/ this.uploadDir(m[1]), `${m[2]}.${m[3]}`));
      return { bytes: new Uint8Array(bytes), contentType: IMAGE_TYPES[m[3] as keyof typeof IMAGE_TYPES].contentType };
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw e;
    }
  }
}
