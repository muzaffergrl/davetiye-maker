// /<slug>/event.ics (G051): the site's event as an iCalendar file for "Add to calendar".
// Same visibility as the pages: a published site serves its published content; a draft or an
// unpublished edit only with ?preview=<previewKey> (private, no-store); everything else 404.

import { calendarEvent, icsFile, type CalendarEvent } from '../calendar.ts';
import { getDataAdapter } from '../data/index.ts';
import { publicOrigin } from '../panel/http.ts';
import { canPreview } from '../sites.ts';
import { isReservedSlug, isValidSlugFormat } from '../slug.ts';
import { notFound } from './render.ts';

/** The .ics response for an event (also used by the theme demo, lib/claim/demo-page.ts). */
export function icsResponse(event: CalendarEvent, opts: { uid: string; stamp?: Date; filename: string; preview: boolean }): Response {
  const headers = new Headers({
    'Content-Type': 'text/calendar; charset=utf-8',
    // attachment + text/calendar: iOS / macOS offer "Add to Calendar", desktop browsers save the file
    'Content-Disposition': `attachment; filename="${opts.filename.replace(/[^a-z0-9._-]/gi, '-')}"`,
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow',
    'Cache-Control': opts.preview ? 'private, no-store' : 'public, max-age=0, must-revalidate',
  });
  if (opts.preview) headers.set('Referrer-Policy', 'no-referrer');
  return new Response(icsFile(event, { uid: opts.uid, stamp: opts.stamp }), { status: 200, headers });
}

export async function handleIcsRequest(req: Request, slugParam: string): Promise<Response> {
  const url = new URL(req.url);
  const slug = slugParam;
  if (slug !== slug.toLowerCase() && isValidSlugFormat(slug.toLowerCase())) {
    const target = new URL(url);
    target.pathname = `/${slug.toLowerCase()}/event.ics`;
    return Response.redirect(target, 308);
  }
  if (!isValidSlugFormat(slug) || isReservedSlug(slug)) return notFound();
  try {
    const site = await getDataAdapter().getSiteBySlug(slug);
    if (!site) return notFound();
    const previewParam = url.searchParams.get('preview');
    const preview = previewParam !== null && canPreview(site, previewParam);
    const content = preview ? site.content : site.status === 'published' ? site.publishedContent : null;
    if (!content) return notFound();
    // the public origin, like the pages (og:image, the Google Calendar link): both "Add to calendar" buttons give the
    // same site link, and the UID stays the same whichever host served the file (re-importing updates the entry)
    const origin = publicOrigin(req.headers, url.origin);
    const event = calendarEvent(content, { siteUrl: `${origin}/${slug}` });
    if (!event) return notFound();
    const stampIso = preview ? null : site.publishedAt ?? site.updatedAt;
    return icsResponse(event, {
      // stable per site and public host: importing the file again updates the same calendar entry
      uid: `${slug}@${new URL(origin).host}`,
      stamp: stampIso ? new Date(stampIso) : new Date(),
      filename: `${slug}.ics`,
      preview,
    });
  } catch (e) {
    console.error(`[site] ${slug}/event.ics:`, e);
    return new Response('Something went wrong', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store' },
    });
  }
}
