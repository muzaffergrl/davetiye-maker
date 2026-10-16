// /api/edit/<slug>/map-link — the place behind a short Google / Apple Maps share link (G127). Edit key (Bearer) only.
import { mapLinkRequest } from '../../../../../lib/panel/map-link.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return mapLinkRequest(req, (await ctx.params).slug);
}
