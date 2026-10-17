// /api/edit/<slug>/download — website PDF / printable invitation (G139, lib/print/api.ts).
import { download } from '../../../../../lib/print/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// A cold start unpacks Chromium (~5 s); a long website with many photos takes up to ~30 s more.
export const maxDuration = 60;

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  return download(req, slug);
}
