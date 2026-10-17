// G139: POST /api/edit/<slug>/download — the panel's PDF downloads.
//
//   body {kind: "site"}                                              -> the whole website as an A4 PDF
//   body {kind: "invitation", size: "5x7"|"a5", bleed?, marks?, back?} -> the printable invitation
//
// Same "Authorization: Bearer <edit key>" as the rest of the panel API (401 for anything else). Both use the saved
// draft (what the couple sees in the editor). Abuse cap: PDF_LIMITS.perSitePerDay per site (shared counter when the
// adapter has one, lib/claim/limits.ts). Answer: the PDF as an attachment, or a JSON error the panel shows.

import { getClaimRateLimiter } from '../claim/limits.ts';
import { getDataAdapter } from '../data/index.ts';
import { authorizeEditor } from '../rsvp/couple.ts';
import { bearerKey, fail, json, publicOrigin, unauthorized } from '../panel/http.ts';
import { publicSiteUrl } from '../panel/model.ts';
import type { RateLimitRule } from '../rsvp/rate-limit.ts';
import { loadTheme } from '../theme/theme.ts';
import { INVITATION_SIZES, invitationPdf, type InvitationSize } from './invitation.ts';
import { printLabel } from './labels.ts';
import { msg } from '../i18n/translate.ts';
import { printLayout } from './layouts.ts';
import { PrintBrowserError } from './browser.ts';
import { sitePdf } from './site-pdf.ts';

export const PDF_LIMITS = {
  /** PDFs (website or invitation) per site per day. */
  perSitePerDay: { limit: 20, windowMs: 24 * 60 * 60 * 1000 } satisfies RateLimitRule,
};

export type DownloadRequest =
  | { kind: 'site' }
  | { kind: 'invitation'; size: InvitationSize; bleed: boolean; marks: boolean; back: boolean };

/** The request body, or null when it is not one of the two shapes. */
export function parseDownload(body: unknown): DownloadRequest | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  if (b.kind === 'site') return { kind: 'site' };
  if (b.kind !== 'invitation' || !(INVITATION_SIZES as readonly unknown[]).includes(b.size)) return null;
  const bleed = b.bleed === true;
  return { kind: 'invitation', size: b.size as InvitationSize, bleed, marks: bleed && b.marks === true, back: b.back !== false };
}

/** "avery-and-jordan-invitation-5x7-bleed.pdf" */
export function downloadFileName(slug: string, d: DownloadRequest): string {
  if (d.kind === 'site') return `${slug}-website.pdf`;
  return `${slug}-invitation-${d.size}${d.bleed ? '-bleed' : ''}${d.marks ? '-marks' : ''}.pdf`;
}

export async function download(req: Request, slug: string): Promise<Response> {
  const adapter = getDataAdapter();
  const site = await authorizeEditor(adapter, slug, bearerKey(req));
  if (!site) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const d = parseDownload(body);
  if (!d) return fail(400, 'bad_request', msg('Choose what to download.'));
  if (d.kind === 'invitation' && !printLayout(site.theme)) return fail(404, 'no_invitation', msg('This design has no printable invitation yet.'));
  const rate = await getClaimRateLimiter().hit(`pdf:site:${site.id}`, PDF_LIMITS.perSitePerDay);
  if (!rate.allowed) {
    return json(
      429,
      { ok: false, code: 'pdf_limit', message: printLabel('limit_reached', { count: PDF_LIMITS.perSitePerDay.limit }) },
      { 'Retry-After': String(Math.max(1, Math.ceil(rate.retryAfterMs / 1000))) },
    );
  }
  try {
    const origin = publicOrigin(req.headers, new URL(req.url).origin);
    const siteUrl = publicSiteUrl(origin, site.slug);
    let pdf: Uint8Array;
    if (d.kind === 'site') {
      const theme = await loadTheme(site.theme);
      if (!theme) throw new Error(`theme ${site.theme} not found`);
      pdf = await sitePdf({ theme, content: site.content, slug: site.slug, siteId: site.id, variant: site.variant, siteUrl, publicOrigin: origin });
    } else {
      pdf = await invitationPdf({ themeId: site.theme, content: site.content, siteUrl, publicOrigin: origin, ...d });
    }
    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdf.length),
        'Content-Disposition': `attachment; filename="${downloadFileName(site.slug, d)}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    // G150: the browser closed on both tries (lib/print/browser.ts) — a passing server problem: 503 + Retry-After and
    // the panel's "try again in a moment". The quota hit above stays one hit for this request (the internal retry
    // does not count).
    if (e instanceof PrintBrowserError) {
      console.error(`[pdf] ${slug} ${d.kind}: ${e.message}`, e.cause);
      return json(503, { ok: false, code: 'pdf_unavailable', message: printLabel('panel_failed') }, { 'Retry-After': '30' });
    }
    console.error(`[pdf] ${slug} ${d.kind}:`, e);
    return fail(500, 'pdf_failed', printLabel('panel_failed'));
  }
}
