// /api/edit/<slug>/music — upload the couple's own story music in parts (G126, lib/panel/music.ts).
import { uploadMusic } from '../../../../../lib/panel/music.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return uploadMusic(req, (await ctx.params).slug);
}
