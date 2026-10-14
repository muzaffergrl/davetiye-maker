// /robots.txt (docs/14 §9.5) — static, from lib/marketing/crawl.ts.
import { MARKETING } from '../../../lib/marketing/config.ts';
import { robotsTxt } from '../../../lib/marketing/crawl.ts';

export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(robotsTxt(MARKETING), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
