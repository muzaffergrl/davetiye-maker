// /api/edit/<slug>/identity — change the couple's names / wedding date after the first publish (G060).
// Body {identity, baseUpdatedAt?, intent: "fix" | "change"}; rules: lib/panel/api.ts changeIdentity, docs/16 §11.
import { changeIdentity } from '../../../../../lib/panel/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return changeIdentity(req, (await ctx.params).slug);
}
