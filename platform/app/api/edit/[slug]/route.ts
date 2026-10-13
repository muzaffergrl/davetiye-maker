// /api/edit/<slug> — panel state (GET) and draft autosave (PUT). Edit key: Authorization: Bearer.
import { getPanel, saveDraft } from '../../../../lib/panel/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  return getPanel(req, (await ctx.params).slug);
}

export async function PUT(req: Request, ctx: Ctx): Promise<Response> {
  return saveDraft(req, (await ctx.params).slug);
}
