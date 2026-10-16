// /api/edit/<slug>/publish — publish the saved draft (refused with 422 + issues when invalid).
import { after } from 'next/server.js'; // .js: node:test loads route files directly (no exports map in next)
import { getDataAdapter } from '../../../../../lib/data/index.ts';
import { googleAvailable } from '../../../../../lib/google/config.ts';
import { syncSheet } from '../../../../../lib/google/sync.ts';
import { publish } from '../../../../../lib/panel/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  const res = await publish(req, slug);
  // G128: the reply form's fields may have changed with this publish: the Google Sheet's columns follow.
  if (res.ok && googleAvailable()) {
    after(async () => {
      const adapter = getDataAdapter();
      const site = await adapter.getSiteBySlug(slug);
      if (site) await syncSheet(adapter, site.id);
    });
  }
  return res;
}
