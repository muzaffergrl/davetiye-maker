// /<slug>/<home|story|details|rsvp> — other theme pages (404 unless the theme declares them).
// POST: only the guest password form of a protected website (G076, lib/site/gate.ts); any other POST (the theme's RSVP
// form without JavaScript) is 405 and stores nothing.
import { handleSiteUnlock } from '../../../lib/site/gate.ts';
import { handleSiteRequest, notFound } from '../../../lib/site/render.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string; page: string }> }): Promise<Response> {
  const { slug, page } = await ctx.params;
  if (page === 'index') return notFound();
  return handleSiteRequest(req, slug, page);
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string; page: string }> }): Promise<Response> {
  const { slug, page } = await ctx.params;
  return handleSiteUnlock(req, slug, page === 'index' ? null : page);
}
