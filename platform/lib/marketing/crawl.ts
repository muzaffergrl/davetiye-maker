// robots.txt, sitemap.xml, llms.txt and llms-full.txt (docs/14 §9.4, §9.5, §9.12). Pure functions of the config and
// content, served by static route handlers in app/(marketing)/.

import { MARKETING, type MarketingConfig } from './config.ts';
import { liveDesigns } from './designs.ts';
import { definition, editRightsText, hostingText, included, NOT_INCLUDED, SITE_PAGES } from './facts.ts';
import { faqGroups, plainAnswer } from './faq.ts';
import type { Guide } from './guides.ts';
import { href, LANGS, PREFIXED_LANGS, type Lang } from './i18n.ts';
import { realPrice } from './placeholders.ts';
import { absUrl, corePages, designPage, displayPrice, siteOrigin } from './site.ts';

/** Paths no crawler needs: API, the private editor, the buyer start page and its demos, couple photos. */
export const ROBOTS_DISALLOW = ['/api/', '/edit/', '/start$', '/start?', '/start/', '/media/'] as const;
/** Search and user-request bots: always allowed (visibility in search and assistants). */
export const SEARCH_BOTS = [
  'Googlebot', 'Bingbot', 'Applebot', 'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'DuckDuckBot',
] as const;
/** Bots that collect data for model training (docs/14 §13.4 decision 6). */
export const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'meta-externalagent'] as const;
/** Folders of our own artwork and screenshots: theme files (design pages' og:image), marketing images, brand kit. */
const MARKETING_ASSET_DIRS = ['/themes/', '/marketing/', '/brand/'] as const;
/** Files of the marketing site at the root. */
const MARKETING_FILES = ['/robots.txt', '/llms.txt', '/llms-full.txt', '/sitemap.xml'] as const;

/**
 * The only paths a model-training bot may read when decision 6 is "allow": the marketing pages and our own artwork.
 * Couple websites share the root (/<names>), so the group ends with "Disallow: /" and lists every marketing path
 * exactly: "/pricing$" + "/pricing/" never match a couple slug such as /pricing-and-paul (a bare "/pricing" would).
 */
export function trainingAllowPaths(cfg: MarketingConfig = MARKETING): string[] {
  const out: string[] = [];
  for (const p of corePages(cfg).map((x) => x.path)) {
    if (p === '/') out.push('/$');
    else out.push(`${p}$`, `${p}/`); // "/designs/<id>", "/guides/<slug>"
  }
  // G144: the other languages' pages (/tr, /tr/designs …); two letters are never a couple slug (≥ 3 characters)
  for (const l of PREFIXED_LANGS) out.push(`/${l}$`, `/${l}/`);
  for (const f of MARKETING_FILES) out.push(`${f}$`);
  out.push(...MARKETING_ASSET_DIRS);
  return out;
}

export function robotsTxt(cfg: MarketingConfig = MARKETING): string {
  const rules = ['Allow: /', ...ROBOTS_DISALLOW.map((p) => `Disallow: ${p}`)];
  const lines: string[] = [];
  lines.push('# Marketing pages are open; the editor, API, buyer start page and couple photos are not for crawlers.');
  lines.push('# Couple websites (/<names>) send "X-Robots-Tag: noindex": search engines may read them but are asked not to list them.');
  lines.push('# Model-training bots may read the marketing pages and our artwork only, never couple websites.');
  if (!cfg.launched) lines.push('# Not launched yet: every marketing page also says noindex until the brand and domain are decided.');
  lines.push('User-agent: *', ...rules, '');
  lines.push('# Search and assistant bots (visibility): open');
  for (const bot of SEARCH_BOTS) lines.push(`User-agent: ${bot}`);
  lines.push(...rules, '');
  lines.push(`# Model training bots: ${cfg.aiTrainingBots === 'allow' ? 'marketing pages only (decision 6, docs/14 §13.4)' : 'closed'}`);
  for (const bot of TRAINING_BOTS) lines.push(`User-agent: ${bot}`);
  if (cfg.aiTrainingBots === 'allow') lines.push(...trainingAllowPaths(cfg).map((p) => `Allow: ${p}`));
  lines.push('Disallow: /', '');
  if (cfg.launched) lines.push(`Sitemap: ${absUrl('/sitemap.xml', cfg)}`);
  return lines.join('\n').trim() + '\n';
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  images?: string[];
  /** G144: the page language and the addresses of the same page in every language (hreflang). */
  lang?: Lang;
  alternates?: Partial<Record<Lang | 'x-default', string>>;
}

/** Every indexable marketing URL in every language (also the link check's page list). English first per page. */
export function sitemapEntries(guides: Guide[], cfg: MarketingConfig = MARKETING): SitemapEntry[] {
  const pages: Array<{ path: string; lastmod: string }> = corePages(cfg).map((p) => ({ path: p.path, lastmod: p.updated }));
  for (const d of liveDesigns(cfg)) {
    const p = designPage(d.id, cfg)!;
    pages.splice(2 + liveDesigns(cfg).indexOf(d), 0, { path: p.path, lastmod: p.updated });
  }
  for (const g of guides) pages.push({ path: g.path, lastmod: g.updated });
  return pages.flatMap(({ path, lastmod }) => {
    const alternates: Partial<Record<Lang | 'x-default', string>> = {};
    for (const l of LANGS) alternates[l] = absUrl(href(l, path), cfg);
    alternates['x-default'] = absUrl(path, cfg);
    return LANGS.map((lang) => ({ loc: absUrl(href(lang, path), cfg), lastmod, lang, alternates }));
  });
}

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * sitemap.xml. Empty <urlset> while not launched (docs/14 §9.4). No changefreq/priority (Google ignores them).
 * G144: every page in five languages, each with xhtml:link alternates (hreflang, x-default = English).
 */
export function sitemapXml(guides: Guide[], cfg: MarketingConfig = MARKETING): string {
  const entries = cfg.launched ? sitemapEntries(guides, cfg) : [];
  const alt = (e: SitemapEntry) =>
    Object.entries(e.alternates ?? {})
      .map(([l, u]) => `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(u!)}"/>`)
      .join('');
  const body = entries.map((e) => `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>${alt(e)}\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}${body ? '\n' : ''}</urlset>\n`;
}

/** llms.txt (llmstxt.org format): H1, blockquote summary, key facts, sections of links. */
export function llmsTxt(guides: Guide[], cfg: MarketingConfig = MARKETING): string {
  const b = cfg.brand.name;
  const designs = liveDesigns(cfg);
  const prices = designs.map((d) => realPrice(d.price));
  const priceLine = prices.every((p) => p) && new Set(prices).size === 1
    ? `${displayPrice(prices[0]!, cfg)} per design`
    : prices.some((p) => p)
      ? designs.map((d) => `${d.name} ${displayPrice(d.price, cfg)}`).join(', ')
      : `${displayPrice(designs[0]?.price ?? '[PRICE]', cfg)} per design`;
  const rights = editRightsText(cfg);
  const out: string[] = [];
  out.push(`# ${b}`, '');
  out.push(`> ${definition(cfg).short} No Canva account or app is needed.`, '');
  out.push(`- What it is: ${definition(cfg).long}`);
  out.push(`- Price: ${priceLine}, a one-time purchase on Etsy. No subscription.`);
  out.push(`- Hosting: ${hostingText(cfg).toLowerCase()}.`);
  out.push(`- Pages: an opening page (an envelope, or in some designs a gatefold, pouch, wallet, storybook or sleeve), then ${SITE_PAGES.map((p) => p.name).join(', ')}.`);
  out.push(`- Included: ${included(cfg).join('; ')}.`);
  out.push(`- Not included: ${NOT_INCLUDED.join('; ')}.`);
  out.push(`- Changes after publishing: ${rights.long} ${rights.rest}`);
  out.push(`- Where to buy: Etsy (${cfg.etsy.shopUrl}). Support: ${cfg.support.email}.`, '');
  out.push('## Designs');
  for (const d of designs) out.push(`- [${d.name}](${absUrl(`/designs/${d.id}`, cfg)}): ${d.copy.llmsLine}`);
  out.push('', '## How it works');
  for (const path of ['/how-it-works', '/features', '/pricing', '/faq']) {
    const p = corePages(cfg).find((x) => x.path === path)!;
    out.push(`- [${p.label}](${absUrl(p.path, cfg)}): ${p.description}`);
  }
  out.push('', '## Guides');
  for (const g of guides) out.push(`- [${g.title}](${absUrl(g.path, cfg)}): ${g.description}`);
  out.push('', '## Optional');
  for (const path of ['/about', '/contact', '/privacy', '/terms', '/kvkk']) {
    const p = corePages(cfg).find((x) => x.path === path)!;
    out.push(`- [${p.label}](${absUrl(p.path, cfg)})`);
  }
  out.push(`- [Full text for assistants](${absUrl('/llms-full.txt', cfg)})`);
  return out.join('\n') + '\n';
}

/** Markdown links to site paths become absolute ("](/faq)" -> "](https://x/faq)"). */
export function absolutizeLinks(markdown: string, cfg: MarketingConfig = MARKETING): string {
  const origin = siteOrigin(cfg);
  return markdown.replace(/\]\((\/[^)\s]*)\)/g, (_all, p: string) => `](${origin}${p})`);
}

/** llms-full.txt: the llms.txt header, then designs, FAQ and every guide as plain Markdown. */
export function llmsFullTxt(guides: Guide[], cfg: MarketingConfig = MARKETING): string {
  const out: string[] = [llmsTxt(guides, cfg).trim(), '', '---', ''];
  out.push('## Designs in detail', '');
  for (const d of liveDesigns(cfg)) {
    out.push(`### ${d.name}`, '', `URL: ${absUrl(`/designs/${d.id}`, cfg)}`, '', d.copy.intro, '', `Opening: ${d.copy.opening}`, '');
    for (const p of SITE_PAGES) out.push(`- ${p.name}: ${d.copy.pages[p.key]}`);
    out.push(`- Fonts: ${d.copy.fonts.join(', ')}`, `- Price: ${displayPrice(d.price, cfg)} on Etsy`, '');
  }
  out.push('## Frequently asked questions', '');
  for (const g of faqGroups(cfg)) {
    out.push(`### ${g.title}`, '');
    for (const it of g.items) out.push(`**${it.q}**`, plainAnswer(it.a), '');
  }
  for (const g of guides) {
    out.push('---', '', `# ${g.title}`, '', `URL: ${absUrl(g.path, cfg)} · Updated ${g.updated}`, '', `Quick answer: ${g.quickAnswer}`, '');
    out.push(absolutizeLinks(g.markdown, cfg).trim(), '');
  }
  return out.join('\n') + '\n';
}
