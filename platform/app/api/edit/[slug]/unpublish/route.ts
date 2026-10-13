// /api/edit/<slug>/unpublish — take the site offline (public pages 404; the draft is kept).
import { unpublish } from '../../../../../lib/panel/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return unpublish(req, (await ctx.params).slug);
}
