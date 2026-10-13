// /<slug> — the theme's index page (closed-envelope opening).
import { handleSiteRequest } from '../../lib/site/render.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  return handleSiteRequest(req, slug, 'index');
}
