// /media/<siteId>/<file> — photos stored by the local adapter (production storage serves its own URLs).
import { serveLocalMedia } from '../../../lib/site/static.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path } = await ctx.params;
  return serveLocalMedia(path);
}
