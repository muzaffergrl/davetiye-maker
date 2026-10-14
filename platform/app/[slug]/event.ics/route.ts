// /<slug>/event.ics — "Add to calendar" file of the site's event (G051). Unpublished site -> 404
// (a draft only with ?preview=<previewKey>). Static segment: wins over /<slug>/[page].
// Password-protected website (G076): without the site's guest cookie -> 303 to its password page (/<slug>).
import { handleIcsRequest } from '../../../lib/site/ics.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  return handleIcsRequest(req, slug);
}
