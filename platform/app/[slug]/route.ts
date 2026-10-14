// /<slug> — the theme's index page (closed-envelope opening).
// POST: only the guest password form of a protected website (G076, lib/site/gate.ts); any other POST is 405.
import { handleSiteUnlock } from '../../lib/site/gate.ts';
import { handleSiteRequest } from '../../lib/site/render.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  return handleSiteRequest(req, slug, 'index');
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  return handleSiteUnlock(req, slug, 'index');
}
