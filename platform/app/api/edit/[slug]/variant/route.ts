// /api/edit/<slug>/variant — the design's colour palette (G153). Edit key (Bearer) only.
import { setVariant } from '../../../../../lib/panel/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return setVariant(req, (await ctx.params).slug);
}
