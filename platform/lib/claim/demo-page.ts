// Live demo of a theme for /start (G045): /start/demo/<theme> and /start/demo/<theme>/<page>.
// The theme's own templates rendered with its demo content (fictional data; G155: the design's own fictional sample
// photos, lib/claim/demo-photos.ts), so the preview on /start is always the real design and needs no screenshots.
//
// Rendered in preview mode (previewKey "demo"): links between pages stay under /start/demo/<theme>,
// the RSVP form shows its "preview, replies are not sent" panel and never posts. Same CSP as sites
// (frame-ancestors 'self': /start embeds it in an iframe). Internal and unknown themes -> 404.
// G151: a private theme (custom design for one buyer) only for the shop admin (admin session cookie); everyone else
// gets the same 404 as an unknown theme.
// Demo bar (owner 2026-10-23, lib/marketing/demo-bar.ts): the pill + catalogue of the other designs, added here only —
// not when a frame asks for the page (Sec-Fetch-Dest: iframe: the /start preview, the sales site's demo dialog).

import { isAdminRequest } from '../admin/auth.ts';
import { calendarEvent } from '../calendar.ts';
import { publicOrigin } from '../panel/http.ts';
import { icsResponse } from '../site/ics.ts';
import { siteCsp, isSitePage } from '../site/render.ts';
import { renderTemplate, VARIANT_PARAM } from '../theme/engine.ts';
import { loadTheme, readThemePage } from '../theme/theme.ts';
import { demoBarFor, demoBarLang, framedRequest, withDemoBar } from '../marketing/demo-bar.ts';
import { withDemoMap } from './demo-map.ts';
import { withDemoPhotos } from './demo-photos.ts';
import { claimableTheme } from './themes.ts';

/** Marks demo renders as previews (the value is not a key; demo pages accept no keys). */
export const DEMO_PREVIEW_MARK = 'demo';

/** Base path of a theme's demo; also passed to the engine as the "slug" so page links stay here. */
export function demoBase(themeId: string): string {
  return `/start/demo/${themeId}`;
}

const PLAIN_404 =
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<title>Page not found</title></head><body style="font-family:system-ui,sans-serif;padding:2rem;text-align:center">' +
  '<h1 style="font-weight:400">Page not found</h1><p>This demo page does not exist.</p></body></html>';

function demoNotFound(): Response {
  return new Response(PLAIN_404, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': siteCsp(),
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'private, no-store',
    },
  });
}

/** GET /start/demo/<theme>[/<page>]; `page` is "index" for the theme's first page. */
export async function handleDemoPage(req: Request, themeId: string, page: string): Promise<Response> {
  if (!isSitePage(page)) return demoNotFound();
  try {
    const theme = await claimableTheme(themeId, { trusted: isAdminRequest(req.headers.get('cookie')) });
    if (!theme) return demoNotFound();
    const template = await readThemePage(theme.loaded, page);
    if (template === null) return demoNotFound();
    const url = new URL(req.url);
    // the visitor's language (?lang=, or the sales-site page they came from): the bar's words, kept by the page links
    const visitorLang = demoBarLang(url, req.headers);
    const { html, disabled, scriptHashes, frameSources } = renderTemplate({
      html: template,
      // The demo always shows the invitation (G075): its fictional wedding date passing must not turn it into a thank-you.
      // G127: the map block with a pin at the demo city's centre (lib/claim/demo-map.ts).
      // G155: the design's fictional sample photos in its empty photo slots (lib/claim/demo-photos.ts).
      content: withDemoPhotos(
        theme.id,
        theme.manifest.photos,
        withDemoMap(theme.id, { ...theme.demo, thank_you: { ...(theme.demo.thank_you ?? {}), mode: 'off' } }),
      ),
      theme: theme.manifest,
      page,
      // pageRoute() builds "/<slug>/<page>": this keeps the demo's page links under /start/demo/<theme>.
      slug: demoBase(theme.id).slice(1),
      // G153: ?variant=<id> shows one of the design's palettes (live ones, and ones still in review for the review itself);
      // page links keep it
      variant: url.searchParams.get(VARIANT_PARAM),
      variantInLinks: true,
      linkLang: visitorLang,
      previewKey: DEMO_PREVIEW_MARK,
      origin: publicOrigin(req.headers, url.origin),
      share: theme.loaded.share,
    });
    if (disabled) return demoNotFound();
    let body = html;
    if (!framedRequest(req.headers)) {
      try {
        const hasPage = async (id: string) => Boolean((await loadTheme(id))?.manifest.pages[page]);
        body = withDemoBar(html, await demoBarFor(visitorLang, { id: theme.id, name: theme.name }, page, hasPage));
      } catch (e) {
        // the demo itself never fails because of its bar
        console.error(`[claim] demo bar ${themeId}/${page}:`, e);
      }
    }
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': siteCsp(scriptHashes, frameSources),
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        // the demo bar: left out of framed requests; its language may come from the referring sales-site page
        Vary: 'Sec-Fetch-Dest, Referer',
        // G151: a private theme's demo was opened with the admin cookie: never kept by a shared cache.
        'Cache-Control': theme.manifest.private ? 'private, no-store' : 'public, max-age=0, must-revalidate',
      },
    });
  } catch (e) {
    console.error(`[claim] demo ${themeId}/${page}:`, e);
    return new Response('Something went wrong', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store' },
    });
  }
}

/** GET /start/demo/<theme>/event.ics: "Add to calendar" of the demo's fictional event (G051). */
export async function handleDemoIcs(req: Request, themeId: string): Promise<Response> {
  try {
    const theme = await claimableTheme(themeId, { trusted: isAdminRequest(req.headers.get('cookie')) });
    if (!theme) return demoNotFound();
    const origin = publicOrigin(req.headers, new URL(req.url).origin); // same origin as the demo page's links
    const event = calendarEvent(theme.demo, { siteUrl: `${origin}${demoBase(theme.id)}` });
    if (!event) return demoNotFound();
    return icsResponse(event, { uid: `demo-${theme.id}@${new URL(origin).host}`, filename: `${theme.id}-demo.ics`, preview: false });
  } catch (e) {
    console.error(`[claim] demo ${themeId}/event.ics:`, e);
    return demoNotFound();
  }
}
