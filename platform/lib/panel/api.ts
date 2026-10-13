// Panel API handlers (G039). The route files under app/api/edit/ only call these.
//
//   GET  /api/edit/<slug>             panel state (content, theme slots, status, preview key)
//   PUT  /api/edit/<slug>             autosave the draft {content, baseUpdatedAt?}
//   POST /api/edit/<slug>/photo?slot= upload one photo (raw image body) -> {url}
//   POST /api/edit/<slug>/publish     publish the stored draft {baseUpdatedAt?}
//   POST /api/edit/<slug>/unpublish   take the site offline
//
// Every request needs "Authorization: Bearer <edit key>". A wrong key, a preview key, another
// site's key and an unknown slug all get the same 401, so the API never tells whether a slug exists.

import { validateContent } from '../content/validate.ts';
import { getDataAdapter } from '../data/index.ts';
import { NotFoundError, StaleSiteError, type SiteRecord } from '../data/types.ts';
import { authorizeEditor } from '../rsvp/couple.ts';
import { ContentInvalidError, publishSite, unpublishSite } from '../sites.ts';
import { MAX_UPLOAD_BYTES, UploadRejectedError } from '../uploads.ts';
import { DraftShapeError, MAX_DRAFT_BYTES, prepareDraft } from './draft.ts';
import { BodyTooLargeError, bearerKey, fail, json, mediaType, readLimitedBytes, requestOrigin, unauthorized } from './http.ts';
import { publicSiteUrl } from './model.ts';
import { preparePhoto } from './photos.ts';
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
    const auth = await authorize(req, slug);
    if (!auth) return unauthorized();
    const body = await readJsonBody(req, MAX_DRAFT_BYTES + 1024);
    if ('error' in body) return body.error;
    const { content, baseUpdatedAt } = body.value;
    if (typeof baseUpdatedAt === 'string' && baseUpdatedAt !== auth.site.updatedAt) {
      return fail(409, 'conflict', CONFLICT_MESSAGE, { updatedAt: auth.site.updatedAt });
    }
    let draft;
    try {
      draft = prepareDraft(auth.site.content, content);
    } catch (e) {
      if (e instanceof DraftShapeError) {
        return fail(400, 'invalid_shape', 'These changes could not be saved. Please reload the page.', { issues: e.issues });
      }
      throw e;
    }
    if (Buffer.byteLength(JSON.stringify(draft)) > MAX_DRAFT_BYTES) return fail(413, 'too_large', 'These changes are too large to save.');
    const site = await getDataAdapter().updateContent(auth.site.id, draft);
    return json(200, { ok: true, ...panelMeta(site), validation: validateContent(site.content, { platform: true }) });
  } catch (e) {
    if (e instanceof NotFoundError) return unauthorized(); // deleted meanwhile
    return serverError(`save ${slug}`, e);
  }
}

export async function uploadPhoto(req: Request, slug: string): Promise<Response> {
  try {
    const auth = await authorize(req, slug);
    if (!auth) return unauthorized();
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
    const site = await unpublishSite(getDataAdapter(), auth.site.id);
    return json(200, { ok: true, ...panelMeta(site) });
  } catch (e) {
    if (e instanceof NotFoundError) return unauthorized();
    return serverError(`unpublish ${slug}`, e);
  }
}
