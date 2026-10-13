// /api/edit/<slug>/publish — publish the saved draft (refused with 422 + issues when invalid).
import { publish } from '../../../../../lib/panel/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return publish(req, (await ctx.params).slug);
}
