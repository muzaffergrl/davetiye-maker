// /start/demo/<theme>/event.ics — "Add to calendar" file of a theme demo's fictional event (G051).
import { handleDemoIcs } from '../../../../../lib/claim/demo-page.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ theme: string }> }): Promise<Response> {
  const { theme } = await ctx.params;
  return handleDemoIcs(req, theme);
}
