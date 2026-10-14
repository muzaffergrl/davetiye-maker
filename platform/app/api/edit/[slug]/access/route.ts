// /api/edit/<slug>/access — guest password on/off or a new password (G076). Edit key (Bearer) only.
import { setAccess } from '../../../../../lib/panel/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return setAccess(req, (await ctx.params).slug);
}
