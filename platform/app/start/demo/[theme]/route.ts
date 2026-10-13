// /start/demo/<theme> — the theme's first page with its demo content (preview on /start, G045).
import { handleDemoPage } from '../../../../lib/claim/demo-page.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ theme: string }> }): Promise<Response> {
  const { theme } = await ctx.params;
  return handleDemoPage(req, theme, 'index');
}
