// /themes/<theme>/<path> — theme CSS/JS/images (templates and theme.json are not served).
import { serveThemeAsset } from '../../../../lib/site/static.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ theme: string; path: string[] }> }): Promise<Response> {
  const { theme, path } = await ctx.params;
  return serveThemeAsset(theme, path);
}
