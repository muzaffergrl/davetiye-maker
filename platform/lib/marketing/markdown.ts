// A small, strict Markdown subset for the guides and FAQ answers (G061). No HTML passes through: the result is a
// tree that components render as React elements, so content can never inject markup. Supported:
//   blocks:  ## / ### headings · paragraphs · "- " lists (and "- [ ] " checklists) · "1. " lists · "> " callouts ·
//            | tables | with a header separator row · "---" rule
//   inline:  **strong** · *em* · `code` · [text](url)
// A "[LABEL]" without "(url)" stays text — that is how placeholders such as [BRAND] remain visible.

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: Inline[] }
  | { t: 'em'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'link'; href: string; c: Inline[] };

export type Block =
  | { type: 'h2' | 'h3'; id: string; text: string; c: Inline[] }
  | { type: 'p'; c: Inline[] }
  | { type: 'ul'; checklist: boolean; items: Inline[][] }
  | { type: 'ol'; items: Inline[][] }
  | { type: 'quote'; c: Inline[][] }
  | { type: 'table'; head: Inline[][]; rows: Inline[][][] }
  | { type: 'hr' };

const LINK_RE = /^\[([^\]\n]+)\]\(([^)\s]+)\)/;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let text = '';
  const flush = () => {
    if (text) out.push({ t: 'text', v: text });
    text = '';
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    if (rest.startsWith('`')) {
      const end = src.indexOf('`', i + 1);
      if (end > i) {
        flush();
        out.push({ t: 'code', v: src.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (rest.startsWith('**')) {
      const end = src.indexOf('**', i + 2);
      if (end > i + 2) {
        flush();
        out.push({ t: 'strong', c: parseInline(src.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }
    if (rest.startsWith('*') && rest[1] && rest[1] !== ' ' && rest[1] !== '*') {
      const end = src.indexOf('*', i + 1);
      if (end > i + 1 && src[end - 1] !== ' ') {
        flush();
        out.push({ t: 'em', c: parseInline(src.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    }
    if (rest.startsWith('[')) {
      const m = LINK_RE.exec(rest);
      if (m) {
        flush();
        out.push({ t: 'link', href: m[2], c: parseInline(m[1]) });
        i += m[0].length;
        continue;
      }
    }
    text += src[i];
    i += 1;
  }
  flush();
  return out;
}

export function inlineText(nodes: Inline[]): string {
  return nodes.map((n) => (n.t === 'text' || n.t === 'code' ? n.v : inlineText(n.c))).join('');
}

/** "What to put on your website?" -> "what-to-put-on-your-website" */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

export function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  const ids = new Map<string, number>();
  const uniqueId = (text: string) => {
    const base = headingId(text) || 'section';
    const n = ids.get(base) ?? 0;
    ids.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i += 1;
      continue;
    }
    let m: RegExpExecArray | null;
    if ((m = /^(#{2,3})\s+(.+)$/.exec(trimmed))) {
      const text = m[2].trim();
      const c = parseInline(text);
      blocks.push({ type: m[1].length === 2 ? 'h2' : 'h3', id: uniqueId(inlineText(c)), text: inlineText(c), c });
      i += 1;
      continue;
    }
    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }
    if (trimmed.startsWith('|')) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim());
      if (rows.length < 2 || !/^\|?\s*:?-{3,}/.test(rows[1])) throw new Error(`table without header separator near: ${rows[0]}`);
      const head = cells(rows[0]).map(parseInline);
      const body = rows.slice(2).map((r) => cells(r).map(parseInline));
      for (const r of body) if (r.length !== head.length) throw new Error(`table row has ${r.length} cells, header ${head.length}: ${rows[0]}`);
      blocks.push({ type: 'table', head, rows: body });
      continue;
    }
    if (trimmed.startsWith('>')) {
      const paras: string[][] = [[]];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        const t = lines[i].trim().replace(/^>\s?/, '');
        if (!t) paras.push([]);
        else paras[paras.length - 1].push(t);
        i += 1;
      }
      blocks.push({ type: 'quote', c: paras.filter((p) => p.length).map((p) => parseInline(p.join(' '))) });
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      let checklist = true;
      while (i < lines.length && (/^[-*]\s+/.test(lines[i].trim()) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        const t = lines[i].trim();
        if (/^[-*]\s+/.test(t)) {
          const body = t.replace(/^[-*]\s+/, '');
          if (!/^\[ \]\s+/.test(body)) checklist = false;
          items.push(body);
        } else items[items.length - 1] += ' ' + t;
        i += 1;
      }
      blocks.push({ type: 'ul', checklist, items: items.map((t) => parseInline(checklist ? t.replace(/^\[ \]\s+/, '') : t)) });
      continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && (/^\d+\.\s+/.test(lines[i].trim()) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        const t = lines[i].trim();
        if (/^\d+\.\s+/.test(t)) items.push(t.replace(/^\d+\.\s+/, ''));
        else items[items.length - 1] += ' ' + t;
        i += 1;
      }
      blocks.push({ type: 'ol', items: items.map(parseInline) });
      continue;
    }
    const para: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t || /^(#{2,3})\s/.test(t) || t.startsWith('|') || t.startsWith('>') || /^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t) || /^-{3,}$/.test(t)) break;
      para.push(t);
      i += 1;
    }
    blocks.push({ type: 'p', c: parseInline(para.join(' ')) });
  }
  return blocks;
}

/** Splits "---\nkey: value\n---\nbody" into a flat string map + body. Values are single-line strings. */
export function parseFrontmatter(src: string): { data: Record<string, string>; body: string } {
  const text = src.replace(/\r\n?/g, '\n');
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!m) return { data: {}, body: text };
  const data: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const kv = /^([a-zA-Z][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`bad frontmatter line: ${line}`);
    data[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1').trim();
  }
  return { data, body: text.slice(m[0].length) };
}

/** Every link target in a block list (link checks). */
export function blockLinks(blocks: Block[]): string[] {
  const out: string[] = [];
  const walk = (nodes: Inline[]) => {
    for (const n of nodes) {
      if (n.t === 'link') out.push(n.href);
      if (n.t === 'strong' || n.t === 'em' || n.t === 'link') walk(n.c);
    }
  };
  for (const b of blocks) {
    if (b.type === 'h2' || b.type === 'h3' || b.type === 'p') walk(b.c);
    else if (b.type === 'ul' || b.type === 'ol') b.items.forEach(walk);
    else if (b.type === 'quote') b.c.forEach(walk);
    else if (b.type === 'table') [...b.head, ...b.rows.flat()].forEach(walk);
  }
  return out;
}

/** Plain text of a block list (word counts, search snippets). */
export function blocksText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      if (b.type === 'h2' || b.type === 'h3') return b.text;
      if (b.type === 'p') return inlineText(b.c);
      if (b.type === 'ul' || b.type === 'ol') return b.items.map(inlineText).join('\n');
      if (b.type === 'quote') return b.c.map(inlineText).join('\n');
      if (b.type === 'table') return [b.head, ...b.rows].map((r) => r.map(inlineText).join(' | ')).join('\n');
      return '';
    })
    .join('\n\n');
}
