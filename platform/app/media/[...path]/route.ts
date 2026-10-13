// /media/<siteId>/<file> — photos of adapters that implement readPhoto (local; blob = private Vercel Blob store).
import { serveLocalMedia } from '../../../lib/site/static.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path } = await ctx.params;
  return serveLocalMedia(path);
}
