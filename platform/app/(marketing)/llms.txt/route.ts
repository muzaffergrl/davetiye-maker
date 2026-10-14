// /llms.txt (docs/14 §9.12, llmstxt.org) — static summary for assistants. Google ignores it; others may read it.
import { MARKETING } from '../../../lib/marketing/config.ts';
import { llmsTxt } from '../../../lib/marketing/crawl.ts';
import { loadGuides } from '../../../lib/marketing/guides.ts';

export const dynamic = 'force-static';

export function GET(): Response {
  const headers: Record<string, string> = { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' };
  if (!MARKETING.launched) headers['X-Robots-Tag'] = 'noindex';
  return new Response(llmsTxt(loadGuides(), MARKETING), { headers });
}
