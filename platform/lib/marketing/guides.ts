// Guides (docs/14 §6.12): platform/content/guides/<slug>.md — frontmatter + the Markdown subset of markdown.ts.
// Read at build time only (every guide page is static). Written and reviewed by hand; no invented statistics,
// testimonials or authors (Organization "[BRAND] Editorial" is the author, docs/14 §8.4).
//
// Frontmatter keys: title (≤ 60 chars, the <title> and H1), description (120–160 chars), published, updated,
// reviewed (YYYY-MM-DD), quickAnswer (40–60 words), keyword (main search phrase), order (number), cover (optional
// public path of the cover image, GPT MK12–MK17 once composed), coverAlt.
// Tokens replaced from config: {{brand}}, {{months}}, {{rsvpQuestions}}, {{scheduleRows}}, {{faqItems}}, {{photoSpots}}.

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { MARKETING, type MarketingConfig } from './config.ts';
import { LIMITS } from './facts.ts';
import { blocksText, parseBlocks, parseFrontmatter, type Block } from './markdown.ts';

export interface GuideFaq {
  q: string;
  /** Blocks of the answer (paragraphs, lists) until the next ### or ##. */
  a: Block[];
}

export interface Guide {
  slug: string;
  path: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  reviewed: string;
  quickAnswer: string;
  keyword: string;
  order: number;
  cover: string | null;
  coverAlt: string;
  blocks: Block[];
  /** Body text without frontmatter, tokens replaced (llms-full.txt). */
  markdown: string;
  words: number;
  minutes: number;
  /** The "FAQ" section's questions (### under ## FAQ). */
  faq: GuideFaq[];
}

export function contentDir(): string {
  return process.env.PLATFORM_CONTENT_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'content');
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function fillTokens(text: string, cfg: MarketingConfig = MARKETING): string {
  const values: Record<string, string> = {
    brand: cfg.brand.name,
    months: String(cfg.hosting.monthsAfterWedding),
    rsvpQuestions: String(LIMITS.rsvpQuestions),
    scheduleRows: String(LIMITS.scheduleRows),
    faqItems: String(LIMITS.faqItems),
    photoSpots: String(LIMITS.photoSpots),
  };
  return text.replace(/\{\{(\w+)\}\}/g, (all, key: string) => {
    if (!(key in values)) throw new Error(`unknown token ${all}`);
    return values[key];
  });
}

export function parseGuide(slug: string, source: string, cfg: MarketingConfig = MARKETING): Guide {
  const { data, body } = parseFrontmatter(source);
  const need = (k: string) => {
    const v = data[k];
    if (!v) throw new Error(`guide ${slug}: frontmatter "${k}" is missing`);
    return fillTokens(v, cfg);
  };
  for (const k of ['published', 'updated', 'reviewed']) {
    if (!DAY_RE.test(data[k] ?? '')) throw new Error(`guide ${slug}: "${k}" must be YYYY-MM-DD`);
  }
  const markdown = fillTokens(body, cfg).trim() + '\n';
  const blocks = parseBlocks(markdown);
  const words = blocksText(blocks).split(/\s+/).filter(Boolean).length;
  const faq: GuideFaq[] = [];
  let inFaq = false;
  for (const b of blocks) {
    if (b.type === 'h2') inFaq = /^(faq|frequently asked questions)$/i.test(b.text);
    else if (inFaq && b.type === 'h3') faq.push({ q: b.text, a: [] });
    else if (inFaq && faq.length) faq[faq.length - 1].a.push(b);
  }
  return {
    slug,
    path: `/guides/${slug}`,
    title: need('title'),
    description: need('description'),
    published: data.published,
    updated: data.updated,
    reviewed: data.reviewed,
    quickAnswer: need('quickAnswer'),
    keyword: need('keyword'),
    order: Number(data.order ?? 99),
    cover: data.cover || null,
    coverAlt: data.coverAlt ? fillTokens(data.coverAlt, cfg) : '',
    blocks,
    markdown,
    words,
    minutes: Math.max(1, Math.round(words / 230)),
    faq,
  };
}

let cache: Guide[] | null = null;

/** All guides, by `order` then title. Cached per process (content is in the repo; every build re-reads). */
export function loadGuides(cfg: MarketingConfig = MARKETING): Guide[] {
  if (cache && cfg === MARKETING) return cache;
  const dir = path.join(contentDir(), 'guides');
  const guides = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseGuide(f.replace(/\.md$/, ''), readFileSync(path.join(dir, f), 'utf8'), cfg))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  if (cfg === MARKETING) cache = guides;
  return guides;
}

export function loadGuide(slug: string, cfg: MarketingConfig = MARKETING): Guide | null {
  return loadGuides(cfg).find((g) => g.slug === slug) ?? null;
}
