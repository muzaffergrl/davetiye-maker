// /start/demo/<theme>/<home|story|details|rsvp> — the other demo pages (G045). "index" is only at /start/demo/<theme>.
import { handleDemoPage } from '../../../../../lib/claim/demo-page.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ theme: string; page: string }> }): Promise<Response> {
  const { theme, page } = await ctx.params;
  return handleDemoPage(req, theme, page === 'index' ? '' : page);
}
