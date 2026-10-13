// Live demo of a theme for /start (G045): /start/demo/<theme> and /start/demo/<theme>/<page>.
// The theme's own templates rendered with its demo content (fictional data, placeholder photos),
// so the preview on /start is always the real design and needs no screenshots.
//
// Rendered in preview mode (previewKey "demo"): links between pages stay under /start/demo/<theme>,
// the RSVP form shows its "preview, replies are not sent" panel and never posts. Same CSP as sites
// (frame-ancestors 'self': /start embeds it in an iframe). Internal and unknown themes -> 404.

import { calendarEvent } from '../calendar.ts';
import { publicOrigin } from '../panel/http.ts';
import { icsResponse } from '../site/ics.ts';
import { siteCsp, isSitePage } from '../site/render.ts';
import { renderTemplate } from '../theme/engine.ts';
import { readThemePage } from '../theme/theme.ts';
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
    const theme = await claimableTheme(themeId);
    if (!theme) return demoNotFound();
    const template = await readThemePage(theme.loaded, page);
    if (template === null) return demoNotFound();
    const { html, disabled, scriptHashes } = renderTemplate({
      html: template,
      content: theme.demo,
      theme: theme.manifest,
      page,
      // pageRoute() builds "/<slug>/<page>": this keeps the demo's page links under /start/demo/<theme>.
      slug: demoBase(theme.id).slice(1),
      variant: null,
      previewKey: DEMO_PREVIEW_MARK,
      origin: publicOrigin(req.headers, new URL(req.url).origin),
      share: theme.loaded.share,
    });
    if (disabled) return demoNotFound();
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': siteCsp(scriptHashes),
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': 'public, max-age=0, must-revalidate',
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
    const theme = await claimableTheme(themeId);
    if (!theme) return demoNotFound();
    const url = new URL(req.url);
    const event = calendarEvent(theme.demo, { siteUrl: `${url.origin}${demoBase(theme.id)}` });
    if (!event) return demoNotFound();
    return icsResponse(event, { uid: `demo-${theme.id}@${url.host}`, filename: `${theme.id}-demo.ics`, preview: false });
  } catch (e) {
    console.error(`[claim] demo ${themeId}/event.ics:`, e);
    return demoNotFound();
  }
}
