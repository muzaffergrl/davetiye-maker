// /sitemap.xml (docs/14 §9.4) — static; empty until launch.
import { MARKETING } from '../../../lib/marketing/config.ts';
import { sitemapXml } from '../../../lib/marketing/crawl.ts';
import { loadGuides } from '../../../lib/marketing/guides.ts';

export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(sitemapXml(loadGuides(), MARKETING), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
