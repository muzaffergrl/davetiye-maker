// /api/edit/<slug>/photo?slot=<theme photo key> — upload one photo (raw image body, <= 10 MB).
import { uploadPhoto } from '../../../../../lib/panel/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return uploadPhoto(req, (await ctx.params).slug);
}
