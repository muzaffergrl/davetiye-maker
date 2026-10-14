// Panel API handlers (G039, G060). The route files under app/api/edit/ only call these.
//
//   GET  /api/edit/<slug>             panel state (content, theme slots, status, preview key, edit rights)
//   PUT  /api/edit/<slug>             autosave the draft {content, baseUpdatedAt?}
//   POST /api/edit/<slug>/photo?slot= upload one photo (raw image body) -> {url}
//   POST /api/edit/<slug>/publish     publish the stored draft {baseUpdatedAt?}
//   POST /api/edit/<slug>/unpublish   take the site offline
//   POST /api/edit/<slug>/identity    change names / date after the first publish {identity, baseUpdatedAt?, intent} (G060)
//
// Every request needs "Authorization: Bearer <edit key>". A wrong key, a preview key, another
// site's key and an unknown slug all get the same 401, so the API never tells whether a slug exists.
//
// Edit rights (G060, docs/16 §11), enforced here and in lib/sites.ts:
//  - after the first publish an autosave keeps the stored names / date (answer: identityKept + the stored identity);
//  - /identity classifies the change against the last counted identity: a typo fix is free, a change uses one
//    of the couple's changes (only with intent "change"), none left -> 403 no_changes_left;
//  - the rights counter and the content are written in ONE conditional write (two tabs cannot both use the last change);
//  - an archived site (12 months after the wedding) refuses every write with 403 archived.

import type { ContentRecord } from '../content/types.ts';
import { validateContent } from '../content/validate.ts';
import { getDataAdapter } from '../data/index.ts';
import { NotFoundError, StaleSiteError, type DataAdapter, type Identity, type SitePatch, type SiteRecord } from '../data/types.ts';
import { authorizeEditor } from '../rsvp/couple.ts';
import { ContentInvalidError, IdentityMismatchError, publishSite, SiteArchivedError, unpublishSite } from '../sites.ts';
import { MAX_UPLOAD_BYTES, UploadRejectedError } from '../uploads.ts';
import { DraftShapeError, keepStoredIdentity, MAX_DRAFT_BYTES, prepareDraft } from './draft.ts';
import { BodyTooLargeError, bearerKey, fail, json, mediaType, readLimitedBytes, requestOrigin, unauthorized } from './http.ts';
import { panelIssues, publicSiteUrl } from './model.ts';
import { preparePhoto } from './photos.ts';
import {
  appendLog,
  ARCHIVED_MESSAGE,
  archivingDateIssue,
  classifyIdentityChange,
  effectiveRights,
  identityOf,
  isArchived,
  isIdentityPath,
  remainingChanges,
  sameIdentity,
  withIdentity,
} from './rights.ts';
import { panelMeta, panelState, panelTheme } from './state.ts';

type Authorized = { site: SiteRecord; key: string };

async function authorize(req: Request, slug: string): Promise<Authorized | null> {
  const key = bearerKey(req);
  const site = await authorizeEditor(getDataAdapter(), slug, key);
  return site && key ? { site, key } : null;
}

function serverError(where: string, e: unknown): Response {
  console.error(`[panel] ${where}:`, e);
  return fail(500, 'server', 'Something went wrong. Please try again.');
}

const CONFLICT_MESSAGE = 'This website was changed in another window or on another device. Reload to get the latest version.';

function archived(): Response {
  return fail(403, 'archived', ARCHIVED_MESSAGE);
}

async function readJsonBody(req: Request, maxBytes: number): Promise<{ value: Record<string, unknown> } | { error: Response }> {
  if (mediaType(req) !== 'application/json') return { error: fail(415, 'unsupported_media_type', 'Send the changes as JSON.') };
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(await readLimitedBytes(req, maxBytes));
  } catch (e) {
    if (e instanceof BodyTooLargeError) return { error: fail(413, 'too_large', 'These changes are too large to save.') };
    return { error: fail(400, 'bad_body', 'These changes could not be read. Please reload the page.') };
  }
  if (!text.trim()) return { value: {} };
  try {
    const value = JSON.parse(text) as unknown;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('not an object');
    return { value: value as Record<string, unknown> };
  } catch {
    return { error: fail(400, 'bad_json', 'These changes could not be read. Please reload the page.') };
  }
}

export async function getPanel(req: Request, slug: string): Promise<Response> {
  try {
    const auth = await authorize(req, slug);
    if (!auth) return unauthorized();
    return json(200, { ok: true, state: await panelState(auth.site, auth.key, requestOrigin(req)) });
  } catch (e) {
    return serverError(`get ${slug}`, e);
  }
}

export async function saveDraft(req: Request, slug: string): Promise<Response> {
  try {
    let auth = await authorize(req, slug);
    if (!auth) return unauthorized();
    const body = await readJsonBody(req, MAX_DRAFT_BYTES + 1024);
    if ('error' in body) return body.error;
    const { content, baseUpdatedAt } = body.value;
    for (let attempt = 1; ; attempt++) {
      const site = auth.site;
      if (isArchived(site)) return archived();
      if (typeof baseUpdatedAt === 'string' && baseUpdatedAt !== site.updatedAt) {
        return fail(409, 'conflict', CONFLICT_MESSAGE, { updatedAt: site.updatedAt });
      }
      let draft: ContentRecord;
      try {
        draft = prepareDraft(site.content, content);
      } catch (e) {
        if (e instanceof DraftShapeError) {
          return fail(400, 'invalid_shape', 'These changes could not be saved. Please reload the page.', { issues: e.issues });
        }
        throw e;
      }
      // After the first publish the names and the date change only through /identity (G060).
      let identityKept = false;
      if (effectiveRights(site).firstPublishedAt) {
        const kept = keepStoredIdentity(site.content, draft);
        draft = kept.draft;
        identityKept = kept.kept;
      }
      if (Buffer.byteLength(JSON.stringify(draft)) > MAX_DRAFT_BYTES) return fail(413, 'too_large', 'These changes are too large to save.');
      try {
        // Conditional on the version read above: the identity kept is the one stored, never an older one.
        const saved = await getDataAdapter().patchSite(site.id, { content: draft }, { expectedUpdatedAt: site.updatedAt });
        return json(200, {
          ok: true,
          ...panelMeta(saved),
          validation: validateContent(saved.content, { platform: true }),
          ...(identityKept ? { identityKept: true, identity: identityOf(saved.content) } : {}),
        });
      } catch (e) {
        if (!(e instanceof StaleSiteError)) throw e;
        // Without a base version the buyer did not see a specific version: read again and retry (like before G060).
        if (typeof baseUpdatedAt === 'string' || attempt >= 3) return fail(409, 'conflict', CONFLICT_MESSAGE, { updatedAt: e.updatedAt });
        auth = await authorize(req, slug);
        if (!auth) return unauthorized();
      }
    }
  } catch (e) {
    if (e instanceof NotFoundError) return unauthorized(); // deleted meanwhile
    return serverError(`save ${slug}`, e);
  }
}

export async function uploadPhoto(req: Request, slug: string): Promise<Response> {
  try {
    const auth = await authorize(req, slug);
    if (!auth) return unauthorized();
    if (isArchived(auth.site)) return archived();
    const slotKey = new URL(req.url).searchParams.get('slot') ?? '';
    const slot = (await panelTheme(auth.site.theme)).photos.find((s) => s.key === slotKey);
    if (!slot) return fail(400, 'unknown_slot', 'This photo place does not exist in the design.');
    let bytes: Uint8Array;
    try {
      bytes = await readLimitedBytes(req, MAX_UPLOAD_BYTES);
    } catch (e) {
      if (e instanceof BodyTooLargeError) {
        return fail(413, 'too_large', `The photo is larger than ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`);
      }
      throw e;
    }
    const photo = await preparePhoto(bytes, slot.ratio);
    // With a known width the photo is stored with its 640/1280 px variants (srcset on the site, G055).
    const saved = await getDataAdapter().savePhoto(
      auth.site.id,
      photo.width === null
        ? { bytes: photo.bytes, contentType: photo.contentType }
        : { bytes: photo.bytes, contentType: photo.contentType, width: photo.width, variants: photo.variants },
    );
    return json(200, {
      ok: true,
      slot: slot.key,
      source: slot.source,
      url: saved.url,
      contentType: saved.contentType,
      size: saved.size,
      width: photo.width,
      height: photo.height,
      variants: saved.variants.map((v) => ({ width: v.width, url: v.url, size: v.size })),
    });
  } catch (e) {
    if (e instanceof UploadRejectedError) {
      const status = e.reason === 'too_large' ? 413 : e.reason === 'unsupported_type' ? 415 : 400;
      return fail(status, e.reason, e.message);
    }
    if (e instanceof NotFoundError) return unauthorized();
    return serverError(`upload ${slug}`, e);
  }
}

export async function publish(req: Request, slug: string): Promise<Response> {
  try {
    const auth = await authorize(req, slug);
    if (!auth) return unauthorized();
    if (isArchived(auth.site)) return archived();
    // Optional JSON body {baseUpdatedAt}: publish exactly the draft the buyer last saw.
    let base: unknown;
    if (req.headers.get('content-type')) {
      const body = await readJsonBody(req, 4096);
      if ('error' in body) return body.error;
      base = body.value.baseUpdatedAt;
    }
    if (typeof base === 'string' && base !== auth.site.updatedAt) {
      return fail(409, 'conflict', CONFLICT_MESSAGE, { updatedAt: auth.site.updatedAt });
    }
    try {
      // The version checked here is the one published (a save landing in between -> 409, not an unchecked publish).
      const site = await publishSite(getDataAdapter(), auth.site.id, { expectedUpdatedAt: typeof base === 'string' ? base : auth.site.updatedAt });
      return json(200, { ok: true, ...panelMeta(site), url: publicSiteUrl(requestOrigin(req), site.slug) });
    } catch (e) {
      if (e instanceof ContentInvalidError) {
        return fail(422, 'invalid_content', 'Please fix these before publishing.', { issues: e.issues });
      }
      if (e instanceof StaleSiteError) return fail(409, 'conflict', CONFLICT_MESSAGE, { updatedAt: e.updatedAt });
      if (e instanceof SiteArchivedError) return archived();
      if (e instanceof IdentityMismatchError) {
        return fail(409, 'identity_mismatch', 'Your names or wedding date changed. Please confirm the change under Names before you publish.');
      }
      throw e;
    }
  } catch (e) {
    if (e instanceof NotFoundError) return unauthorized();
    return serverError(`publish ${slug}`, e);
  }
}

export async function unpublish(req: Request, slug: string): Promise<Response> {
  try {
    const auth = await authorize(req, slug);
    if (!auth) return unauthorized();
    if (isArchived(auth.site)) return archived();
    const site = await unpublishSite(getDataAdapter(), auth.site.id);
    return json(200, { ok: true, ...panelMeta(site) });
  } catch (e) {
    if (e instanceof NotFoundError) return unauthorized();
    return serverError(`unpublish ${slug}`, e);
  }
}

// ---------------------------------------------------------------------------------------------
// Names and date after the first publish (G060)

const MAX_IDENTITY_TEXT = 200;

/** The identity a request sends, or null when it is not shaped like one. */
export function parseIdentity(value: unknown): Identity | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const text = (x: unknown) => typeof x === 'string' && [...x].length <= MAX_IDENTITY_TEXT;
  if (!Array.isArray(v.names) || v.names.length < 1 || v.names.length > 2) return null;
  const names: Identity['names'] = [];
  for (const n of v.names) {
    if (typeof n !== 'object' || n === null) return null;
    const { display, full } = n as Record<string, unknown>;
    if (!text(display) || !(full === undefined || full === null || text(full))) return null;
    names.push({ display: display as string, full: typeof full === 'string' ? full : '' });
  }
  if (!text(v.shown) || !text(v.initials) || !text(v.date)) return null;
  return { names, shown: v.shown as string, initials: v.initials as string, date: v.date as string };
}

export type IdentityResult = 'unchanged' | 'free' | 'typo' | 'change';

export async function changeIdentity(req: Request, slug: string, now: Date = new Date()): Promise<Response> {
  try {
    const auth = await authorize(req, slug);
    if (!auth) return unauthorized();
    if (isArchived(auth.site, now)) return archived();
    const body = await readJsonBody(req, 8 * 1024);
    if ('error' in body) return body.error;
    return await identityChangeFor(getDataAdapter(), auth.site, body.value, now);
  } catch (e) {
    if (e instanceof NotFoundError) return unauthorized();
    return serverError(`identity ${slug}`, e);
  }
}

/**
 * The /identity rules for one already-authorized site record (the version the request read), against any
 * adapter (tests run it on local and blob storage, including two server instances at once).
 */
export async function identityChangeFor(
  adapter: DataAdapter,
  site: SiteRecord,
  value: Record<string, unknown>,
  now: Date = new Date(),
): Promise<Response> {
  {
    if (isArchived(site, now)) return archived();
    const { baseUpdatedAt, intent } = value;
    if (typeof baseUpdatedAt === 'string' && baseUpdatedAt !== site.updatedAt) {
      return fail(409, 'conflict', CONFLICT_MESSAGE, { updatedAt: site.updatedAt });
    }
    const identity = parseIdentity(value.identity);
    if (!identity) return fail(400, 'invalid_shape', 'These changes could not be read. Please reload the page.');
    const current = identityOf(site.content);
    if (identity.names.length < current.names.length) return fail(422, 'invalid_identity', 'Names cannot be removed. Please keep both names.');

    // The same checks as everywhere else (empty name, too long, real date) on the identity fields only.
    const next = withIdentity(site.content, identity);
    const issues = panelIssues(validateContent(next, { platform: true }).errors, next).filter((i) => isIdentityPath(i.path));
    if (issues.length) return fail(422, 'invalid_identity', issues[0].message, { issues });

    const rights = effectiveRights(site);
    if (rights.firstPublishedAt) {
      const issue = archivingDateIssue(next, rights.firstPublishedAt, now, site.archiveOverrideAt ?? null);
      if (issue) return fail(422, 'date_archives_site', issue.message, { issues: [issue] });
    }

    const done = (saved: SiteRecord, result: IdentityResult) =>
      json(200, { ok: true, result, identity: identityOf(saved.content), ...panelMeta(saved, now) });
    if (sameIdentity(current, identity)) return done(site, 'unchanged');

    const write = async (patch: SitePatch, result: IdentityResult) => {
      try {
        return done(await adapter.patchSite(site.id, patch, { expectedUpdatedAt: site.updatedAt }), result);
      } catch (e) {
        if (e instanceof StaleSiteError) return fail(409, 'conflict', CONFLICT_MESSAGE, { updatedAt: e.updatedAt });
        throw e;
      }
    };

    // Before the first publish nothing is counted (the wizard and the editor use the normal autosave).
    if (!rights.firstPublishedAt || !rights.identity) return write({ content: next }, 'free');

    const at = now.toISOString();
    const { kind } = classifyIdentityChange(rights.identity.anchor, identity);
    if (kind !== 'change') {
      // Free: the anchor stays, so free fixes never add up to a different couple.
      const bookkeeping = { ...rights.identity, log: appendLog(rights.identity.log, { at, kind: 'typo', to: identity, by: 'buyer' }) };
      return write({ content: next, firstPublishedAt: rights.firstPublishedAt, identity: bookkeeping }, 'typo');
    }
    const remaining = remainingChanges(rights.identity);
    if (remaining === 0) {
      return fail(403, 'no_changes_left', 'You have used all your name and date changes. Small typo fixes (up to 2 letters or digits) are still free.', {
        remaining: 0,
        limit: rights.identity.limit + rights.identity.granted,
      });
    }
    if (intent !== 'change') {
      return fail(409, 'confirm_required', 'This uses one of your name and date changes. Please confirm it.', {
        kind: 'change',
        remaining,
        limit: rights.identity.limit + rights.identity.granted,
      });
    }
    const counted = {
      ...rights.identity,
      anchor: identity,
      used: rights.identity.used + 1,
      log: appendLog(rights.identity.log, { at, kind: 'change', to: identity, by: 'buyer' }),
    };
    return write({ content: next, firstPublishedAt: rights.firstPublishedAt, identity: counted }, 'change');
  }
}
