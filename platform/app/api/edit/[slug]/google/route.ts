// /api/edit/<slug>/google — the couple's Google Sheets connection (G128): status, connect, sync now, disconnect.
// Edit key (Bearer) only. Contract: lib/google/api.ts.
import { googleAction, googleStatus } from '../../../../../lib/google/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return googleStatus(req, (await ctx.params).slug);
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return googleAction(req, (await ctx.params).slug);
}
