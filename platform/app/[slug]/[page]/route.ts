// /<slug>/<home|story|details|rsvp> — other theme pages (404 unless the theme declares them).
import { handleSiteRequest, notFound } from '../../../lib/site/render.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string; page: string }> }): Promise<Response> {
  const { slug, page } = await ctx.params;
  if (page === 'index') return notFound();
  return handleSiteRequest(req, slug, page);
}
