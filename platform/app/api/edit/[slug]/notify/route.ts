// /api/edit/<slug>/notify — "Email me when a guest replies" (G152, Guests): status and on/off. Edit key (Bearer) only.
// Handlers: lib/panel/notify.ts.
import { getNotify, notifyAction } from '../../../../../lib/panel/notify.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return getNotify(req, (await ctx.params).slug);
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return notifyAction(req, (await ctx.params).slug);
}
