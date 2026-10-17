// /api/edit/<slug>/devices — "Use on another device" (G146): the devices signed in with the order number, and
// "Sign out other devices". Edit key (Bearer) only. Handlers: lib/panel/devices.ts.
import { deviceAction, getDevices } from '../../../../../lib/panel/devices.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return getDevices(req, (await ctx.params).slug);
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  return deviceAction(req, (await ctx.params).slug);
}
