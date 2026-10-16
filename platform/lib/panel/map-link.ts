// Short map links (G127): a Google Maps share link (maps.app.goo.gl/…, goo.gl/maps/…) or an Apple one (maps.apple/…)
// carries no place, only a redirect. The panel sends such a link here; the server asks that one redirector for the
// target (redirect: manual, no cookies, no body read), and the pin and place name are read from the target URL.
// Only the listed redirector hosts are ever requested, and only a target on a known maps host is accepted.
//
//   POST /api/edit/<slug>/map-link  {url}  ->  {url, lat, lng, place} | 422 not_resolved     (edit key, Bearer)

import { getClaimRateLimiter } from '../claim/limits.ts';
import { getDataAdapter } from '../data/index.ts';
import { coordsFromMapLink, isShortMapLink, placeTextFromMapLink } from '../maps.ts';
import { authorizeEditor } from '../rsvp/couple.ts';
import { bearerKey, fail, json, mediaType, readLimitedBytes, unauthorized } from './http.ts';

export interface ResolvedMapLink {
  /** The long link the short one points to. */
  url: string;
  lat: number | null;
  lng: number | null;
  place: string | null;
}

const TARGET_HOST = /^(?:(?:www|maps)\.google\.[a-z.]{2,6}|google\.[a-z.]{2,6}|maps\.apple\.com|goo\.gl|maps\.app\.goo\.gl)$/i;
const MAX_HOPS = 3;
const TIMEOUT_MS = 4000;

function knownTarget(raw: string | null, base: string): URL | null {
  if (!raw) return null;
  try {
    const u = new URL(raw, base);
    return u.protocol === 'https:' && TARGET_HOST.test(u.hostname) ? u : null;
  } catch {
    return null;
  }
}

/** The long link behind a short map link; null when it is not one, or its target is not a maps page. */
export async function resolveShortMapLink(raw: string, fetchImpl: typeof fetch = fetch): Promise<ResolvedMapLink | null> {
  if (!isShortMapLink(raw)) return null;
  let current = new URL(raw.trim());
  for (let hop = 0; hop < MAX_HOPS; hop++) {
    let res: Response;
    try {
      res = await fetchImpl(current.href, {
        method: 'GET',
        redirect: 'manual',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        headers: { accept: 'text/html' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      return null;
    }
    void res.body?.cancel().catch(() => {});
    if (res.status < 300 || res.status >= 400) return null;
    const next = knownTarget(res.headers.get('location'), current.href);
    if (!next) return null;
    if (!isShortMapLink(next.href)) {
      const pin = coordsFromMapLink(next.href);
      return { url: next.href, lat: pin?.lat ?? null, lng: pin?.lng ?? null, place: placeTextFromMapLink(next.href) };
    }
    current = next;
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Route handler (the edit key only; at most MAP_LINK_PER_DAY lookups per site and day)

export const MAP_LINK_PER_DAY = { limit: 60, windowMs: 24 * 60 * 60 * 1000 };

export async function mapLinkRequest(req: Request, slug: string, fetchImpl: typeof fetch = fetch): Promise<Response> {
  try {
    const site = await authorizeEditor(getDataAdapter(), slug, bearerKey(req));
    if (!site) return unauthorized();
    if (mediaType(req) !== 'application/json') return fail(415, 'unsupported_media_type', 'Send the link as JSON.');
    let url: unknown;
    try {
      url = (JSON.parse(new TextDecoder().decode(await readLimitedBytes(req, 4096))) as { url?: unknown })?.url;
    } catch {
      return fail(400, 'bad_json', 'This link could not be read.');
    }
    if (typeof url !== 'string' || !isShortMapLink(url)) {
      return fail(422, 'not_short_link', 'This is not a Google Maps or Apple Maps share link.');
    }
    const rate = await getClaimRateLimiter().hit(`map-link:site:${site.id}`, MAP_LINK_PER_DAY);
    if (!rate.allowed) return fail(429, 'rate_limited', 'Too many map links today. The address is used instead.');
    const resolved = await resolveShortMapLink(url, fetchImpl);
    if (!resolved) return fail(422, 'not_resolved', 'We could not read this link. The address is used to find the place.');
    return json(200, { ok: true, ...resolved });
  } catch (e) {
    console.error(`[panel] map-link ${slug}:`, e);
    return fail(500, 'server', 'Something went wrong. Please try again.');
  }
}
