// Panel API handlers (G039, G060). The route files under app/api/edit/ only call these.
//
//   GET  /api/edit/<slug>             panel state (content, theme slots, status, preview key, edit rights)
//   PUT  /api/edit/<slug>             autosave the draft {content, baseUpdatedAt?}
//   POST /api/edit/<slug>/photo?slot= upload one photo (raw image body) -> {url}
//   POST /api/edit/<slug>/publish     publish the stored draft {baseUpdatedAt?}
//   POST /api/edit/<slug>/unpublish   take the site offline
//   POST /api/edit/<slug>/identity    change names / date after the first publish {identity, baseUpdatedAt?, intent} (G060)
//   POST /api/edit/<slug>/access      guest password on/off or a new one {enabled, password?} (G076)
//
// Every request needs "Authorization: Bearer <edit key>". A wrong key, a preview key, another
// site's key and an unknown slug all get the same 401, so the API never tells whether a slug exists.
//
// Edit rights (G060, docs/16 §11), enforced here and in lib/sites.ts:
//  - after the first publish an autosave keeps the stored names / date (answer: identityKept + the stored identity);
//  - /identity classifies the change against the last counted identity: a typo fix, a date moved by up to a week and
//    a surname added are free; taking back the last change soon after (or before publishing it) is free and gives the
//    change back; replacing the design's sample date is free once; any other change uses one of the couple's changes
//    (only with intent "change"), none left -> 403 no_changes_left;
//  - the rights counter and the content are written in ONE conditional write (two tabs cannot both use the last change);
//  - an archived site (12 months after the wedding) refuses every write with 403 archived.

import type { ContentRecord } from '../content/types.ts';
import { validateContent } from '../content/validate.ts';
import { getDataAdapter } from '../data/index.ts';
import { NotFoundError, StaleSiteError, type DataAdapter, type Identity, type SitePatch, type SiteRecord } from '../data/types.ts';
import { getClaimRateLimiter, UPLOAD_LIMITS } from '../claim/limits.ts';
import { claimableTheme } from '../claim/themes.ts';
import { authorizeEditor } from '../rsvp/couple.ts';
import { ORDER_PENDING_TEXT, PANEL_BRAND } from './brand.ts';
import { ContentInvalidError, IdentityMismatchError, OrderPendingError, publishSite, SiteArchivedError, unpublishSite } from '../sites.ts';
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
  DATE_FREE_DAYS,
  effectiveRights,
  identityOf,
  isArchived,
  isIdentityPath,
  isSampleDateReplacement,
  isUndo,
  remainingChanges,
  sameIdentity,
  undoState,
  withIdentity,
} from './rights.ts';
import { panelMeta, panelState, panelTheme } from './state.ts';
import { GuestPasswordError, setGuestAccess } from '../site/access.ts';

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

/** Publish while the shop has not confirmed the Etsy order yet (CLAIM_ORDER_VERIFICATION=manual, G060-fix). */
export const ORDER_PENDING_MESSAGE = ORDER_PENDING_TEXT;

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
    return json(200, { ok: true, state: await panelState(auth.site, requestOrigin(req)) });
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
    // Per-site upload caps (G060-fix): replaced photos stay stored, so storage per site is bounded.
    const adapter = getDataAdapter();
    if (adapter.countPhotos && (await adapter.countPhotos(auth.site.id)) >= UPLOAD_LIMITS.maxFilesPerSite) {
      return fail(429, 'photo_limit', `This website has reached its photo limit. Message ${PANEL_BRAND.shopName} on Etsy with your order number if you need to add more.`);
    }
    const rate = await getClaimRateLimiter().hit(`upload:site:${auth.site.id}`, UPLOAD_LIMITS.perSitePerDay);
    if (!rate.allowed) {
      return json(
        429,
        { ok: false, code: 'upload_limit', message: 'You have added a lot of photos today. Please try again tomorrow.' },
        { 'Retry-After': String(Math.max(1, Math.ceil(rate.retryAfterMs / 1000))) },
      );
    }
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
      if (e instanceof OrderPendingError) return fail(403, 'order_pending', ORDER_PENDING_MESSAGE);
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
// Guest password (G076, K28)

/**
 * POST /api/edit/<slug>/access {enabled: boolean, password?: string}: switches the guest password on or off, or sets a
 * new one (4–40 characters). Applies at once (no publish needed). A new password signs every guest out (`signedOut`).
 * Not the content: the password lives in the private site record and is never published with the pages.
 */
export async function setAccess(req: Request, slug: string): Promise<Response> {
  try {
    const auth = await authorize(req, slug);
    if (!auth) return unauthorized();
    if (isArchived(auth.site)) return archived();
    const body = await readJsonBody(req, 2048);
    if ('error' in body) return body.error;
    const { enabled, password } = body.value;
    if (typeof enabled !== 'boolean' || !(password === undefined || password === null || typeof password === 'string')) {
      return fail(400, 'invalid_shape', 'This change could not be read. Please reload the page.');
    }
    try {
      const { site, signedOut } = await setGuestAccess(getDataAdapter(), auth.site.id, { enabled, password: password as string | null | undefined });
      return json(200, { ok: true, ...panelMeta(site), signedOut });
    } catch (e) {
      if (e instanceof GuestPasswordError) return fail(422, 'invalid_password', e.message);
      throw e;
    }
  } catch (e) {
    if (e instanceof NotFoundError) return unauthorized();
    return serverError(`access ${slug}`, e);
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

/**
 * unchanged: nothing written · free: before the first publish · typo: a free fix (typo, date moved by up to a week,
 * surname) · undo: the last counted change taken back (given back) · sample_date: the design's sample date replaced
 * (free, once) · change: one change used.
 */
export type IdentityResult = 'unchanged' | 'free' | 'typo' | 'undo' | 'sample_date' | 'change';

export const NO_CHANGES_LEFT_MESSAGE = `You have used all your name and date changes. Small typo fixes and moving your date by up to ${DATE_FREE_DAYS} days are still free.`;

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
    // Taking back the last counted change (soon after it, or before it was published): free, and the change is given back.
    const undo = undoState(rights.identity, site, now);
    if (undo && isUndo(undo, identity)) {
      const reverted = {
        ...rights.identity,
        anchor: undo.from,
        used: Math.max(0, rights.identity.used - 1),
        undo: null,
        log: appendLog(rights.identity.log, { at, kind: 'undo', to: identity, by: 'buyer' }),
      };
      return write({ content: next, firstPublishedAt: rights.firstPublishedAt, identity: reverted }, 'undo');
    }
    // First published with the design's sample date: setting the real date is free, once (the anchor's date moves).
    const sampleDate = (await claimableTheme(site.theme))?.demo?.date ?? null;
    if (isSampleDateReplacement(rights.identity.anchor, identity, sampleDate)) {
      const moved = {
        ...rights.identity,
        anchor: { ...rights.identity.anchor, date: identity.date },
        log: appendLog(rights.identity.log, { at, kind: 'sample_date', to: identity, by: 'buyer' }),
      };
      return write({ content: next, firstPublishedAt: rights.firstPublishedAt, identity: moved }, 'sample_date');
    }
    const remaining = remainingChanges(rights.identity);
    if (remaining === 0) {
      return fail(403, 'no_changes_left', NO_CHANGES_LEFT_MESSAGE, {
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
      undo: { at, from: rights.identity.anchor },
      log: appendLog(rights.identity.log, { at, kind: 'change', to: identity, by: 'buyer' }),
    };
    return write({ content: next, firstPublishedAt: rights.firstPublishedAt, identity: counted }, 'change');
  }
}
