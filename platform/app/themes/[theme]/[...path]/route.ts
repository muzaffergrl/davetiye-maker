// /themes/<theme>/<path> — theme CSS/JS/images (templates and theme.json are not served).
// G159: in a build the files are static copies in public/themes/ (scripts/theme-assets.cjs) and never reach this route;
// it answers what has no copy (404s, `next dev`, a test's own themes folder). A variant URL without a copy of its own
// (/themes/<theme>/~<id>/<path>) arrives here through the rewrite of next.config.ts with the original's params; the
// variant is then read from ?variant= or, as `next start` passes the address the browser asked for, from that path.
import { serveThemeAsset } from '../../../../lib/site/static.ts';
import { VARIANT_SEGMENT_PREFIX } from '../../../../lib/theme/variants.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function requestedVariant(req: Request): string | null {
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get('variant');
  if (fromQuery) return fromQuery;
  const seg = url.pathname.split('/')[3] ?? '';
  try {
    return seg.startsWith(VARIANT_SEGMENT_PREFIX) ? decodeURIComponent(seg.slice(VARIANT_SEGMENT_PREFIX.length)) : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request, ctx: { params: Promise<{ theme: string; path: string[] }> }): Promise<Response> {
  const { theme, path } = await ctx.params;
  return serveThemeAsset(theme, path, { variant: requestedVariant(req) });
}
