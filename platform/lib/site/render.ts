// Public site pages: /<slug> (theme index page) and /<slug>/<home|story|details|rsvp>.
// Published sites show publishedContent. Drafts (and unpublished edits) are only
// visible with ?preview=<previewKey>; everything else is a plain 404.

import { getDataAdapter } from '../data/index.ts';
import { publicOrigin } from '../panel/http.ts';
import { isArchived } from '../panel/rights.ts';
import { canPreview } from '../sites.ts';
import { isReservedSlug, isValidSlugFormat } from '../slug.ts';
import { renderTemplate } from '../theme/engine.ts';
import { loadTheme, readThemePage, SUB_PAGES, type PageName } from '../theme/theme.ts';

/**
 * Content-Security-Policy for theme pages. Scripts: theme files ('self') plus the exact
 * inline scripts of the theme template (by SHA-256 hash, computed per page by the engine).
 * Inline event handlers (onclick=…) are not allowed. The site-data JSON block is not executed.
 */
export function siteCsp(scriptHashes: readonly string[] = []): string {
  return [
    "default-src 'self'",
    ["script-src 'self'", ...scriptHashes].join(' '),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    "connect-src 'self'",
    "frame-src 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join('; ');
}

/**
 * Published couple websites ask search engines not to list them (docs/14 §5.5): they are for guests who have the link,
 * and they carry names, the date, the venue and photos. The owner's decision 4 (docs/14 §13.4) is still open; until it
 * is made the default is noindex. Model-training bots are kept off couple websites by robots.txt
 * (lib/marketing/crawl.ts), because they follow robots.txt rather than noindex.
 */
export const COUPLE_SITE_ROBOTS = 'noindex';

function htmlHeaders(opts: { preview: boolean; status: number; scriptHashes?: readonly string[] }): Headers {
  const h = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': siteCsp(opts.scriptHashes),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': opts.preview ? 'no-referrer' : 'strict-origin-when-cross-origin',
    'Cache-Control': opts.preview || opts.status !== 200 ? 'private, no-store' : 'public, max-age=0, must-revalidate',
  });
  h.set('X-Robots-Tag', opts.preview || opts.status !== 200 ? 'noindex, nofollow' : COUPLE_SITE_ROBOTS);
  return h;
}

const PLAIN_PAGE = (title: string, text: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
  `<title>${title}</title></head><body style="font-family:system-ui,sans-serif;padding:2rem;text-align:center">` +
  `<h1 style="font-weight:400">${title}</h1><p>${text}</p></body></html>`;

export function notFound(): Response {
  return new Response(PLAIN_PAGE('Page not found', 'This page does not exist or is not published yet.'), {
    status: 404,
    headers: htmlHeaders({ preview: false, status: 404 }),
  });
}

/**
 * A site 12 months after its wedding (G060, docs/16 §11.9): 410 + a plain page without the couple's
 * names (noindex). The couple still sees it through the panel preview.
 */
export function archivedPage(): Response {
  return new Response(PLAIN_PAGE('This wedding website has been archived', 'Thank you for visiting.'), {
    status: 410,
    headers: htmlHeaders({ preview: false, status: 410 }),
  });
}

function serverError(): Response {
  return new Response(PLAIN_PAGE('Something went wrong', 'Please try again in a moment.'), {
    status: 500,
    headers: htmlHeaders({ preview: false, status: 500 }),
  });
}

export function isSitePage(page: string): page is PageName {
  return page === 'index' || (SUB_PAGES as readonly string[]).includes(page);
}

/** Handles GET for a site page. `page` is "index" for /<slug>. */
export async function handleSiteRequest(req: Request, slugParam: string, page: string): Promise<Response> {
  const url = new URL(req.url);
  const slug = slugParam;

  // Friendly: /Clara-And-Julian -> /clara-and-julian (same query string).
  if (slug !== slug.toLowerCase() && isValidSlugFormat(slug.toLowerCase())) {
    const target = new URL(url);
    const segments = url.pathname.split('/'); // ['', slug, page?]
    segments[1] = slug.toLowerCase();
    target.pathname = segments.join('/');
    return Response.redirect(target, 308);
  }
  if (!isValidSlugFormat(slug) || isReservedSlug(slug) || !isSitePage(page)) return notFound();

  try {
    const site = await getDataAdapter().getSiteBySlug(slug);
    if (!site) return notFound();

    const previewParam = url.searchParams.get('preview');
    const preview = previewParam !== null && canPreview(site, previewParam);
    const content = preview ? site.content : site.status === 'published' ? site.publishedContent : null;
    if (!content) return notFound();
    if (!preview && isArchived(site)) return archivedPage();

    const theme = await loadTheme(site.theme);
    if (!theme) {
      console.error(`[site] ${slug}: theme "${site.theme}" not found`);
      return serverError();
    }
    const template = await readThemePage(theme, page);
    if (template === null) return notFound();

    const { html, warnings, disabled, scriptHashes } = renderTemplate({
      html: template,
      content,
      theme: theme.manifest,
      page,
      slug,
      variant: site.variant,
      previewKey: preview ? previewParam : null,
      // og:image and the calendar link need the public address (PLATFORM_PUBLIC_URL, else the request's host).
      origin: publicOrigin(req.headers, url.origin),
      share: theme.share,
    });
    if (warnings.length && process.env.NODE_ENV !== 'production') {
      console.warn(`[theme ${theme.manifest.id}/${page}] ${warnings.join(' | ')}`);
    }
    if (disabled) return notFound(); // e.g. story page while optional_blocks.our_story is off
    return new Response(html, { status: 200, headers: htmlHeaders({ preview, status: 200, scriptHashes }) });
  } catch (e) {
    console.error(`[site] ${slug}/${page}:`, e);
    return serverError();
  }
}
