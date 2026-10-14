// G061: the strict Markdown subset of the guides (lib/marketing/markdown.ts). No HTML ever passes through.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blockLinks, blocksText, headingId, inlineText, parseBlocks, parseFrontmatter, parseInline } from '../lib/marketing/markdown.ts';
import { fillTokens, parseGuide } from '../lib/marketing/guides.ts';

test('inline: strong, em, code, links; placeholders and stray brackets stay text', () => {
  assert.deepEqual(parseInline('a **b** *c* `d` [e](/f)'), [
    { t: 'text', v: 'a ' },
    { t: 'strong', c: [{ t: 'text', v: 'b' }] },
    { t: 'text', v: ' ' },
    { t: 'em', c: [{ t: 'text', v: 'c' }] },
    { t: 'text', v: ' ' },
    { t: 'code', v: 'd' },
    { t: 'text', v: ' ' },
    { t: 'link', href: '/f', c: [{ t: 'text', v: 'e' }] },
  ]);
  assert.deepEqual(parseInline('Contact [BRAND] at [SUPPORT EMAIL].'), [{ t: 'text', v: 'Contact [BRAND] at [SUPPORT EMAIL].' }]);
  assert.equal(inlineText(parseInline('5 * 3 and a* b')), '5 * 3 and a* b');
  assert.equal(inlineText(parseInline('<script>alert(1)</script>')), '<script>alert(1)</script>', 'HTML is plain text, rendered escaped');
  assert.deepEqual(parseInline('**[link](/x)**'), [{ t: 'strong', c: [{ t: 'link', href: '/x', c: [{ t: 'text', v: 'link' }] }] }]);
});

test('blocks: headings with unique ids, lists, checklists, tables, callouts, rules', () => {
  const blocks = parseBlocks(
    [
      '## What to put?',
      'Para line one',
      'line two.',
      '',
      '- one',
      '- two',
      '',
      '- [ ] tick',
      '- [ ] tock',
      '',
      '1. first',
      '2. second',
      '',
      '| A | B |',
      '|---|---|',
      '| x | y |',
      '',
      '> **Tip:** hello',
      '>',
      '> second',
      '',
      '---',
      '## What to put?',
      '### FAQ q?',
    ].join('\n'),
  );
  assert.deepEqual(
    blocks.map((b) => b.type),
    ['h2', 'p', 'ul', 'ul', 'ol', 'table', 'quote', 'hr', 'h2', 'h3'],
  );
  assert.equal((blocks[0] as { id: string }).id, 'what-to-put');
  assert.equal((blocks[8] as { id: string }).id, 'what-to-put-2');
  assert.equal(inlineText((blocks[1] as unknown as { c: never }).c), 'Para line one line two.');
  assert.equal((blocks[2] as { checklist: boolean }).checklist, false);
  assert.equal((blocks[3] as { checklist: boolean }).checklist, true);
  assert.equal(inlineText((blocks[3] as unknown as { items: never[] }).items[0]), 'tick');
  assert.equal((blocks[6] as { c: unknown[] }).c.length, 2);
  assert.throws(() => parseBlocks('| a | b |\n| c | d |'), /header separator/);
  assert.throws(() => parseBlocks('| a | b |\n|---|---|\n| c |'), /cells/);
  assert.equal(headingId('Dress code & registry!'), 'dress-code-and-registry');
  assert.deepEqual(blockLinks(parseBlocks('See [a](/a) and **[b](https://b.example/x)**\n\n| [c](/c) | d |\n|---|---|\n| e | [f](/f) |')), ['/a', 'https://b.example/x', '/c', '/f']);
  assert.match(blocksText(blocks), /Para line one/);
});

test('frontmatter and tokens', () => {
  const { data, body } = parseFrontmatter('---\ntitle: "A: B"\norder: 2\n---\nBody');
  assert.deepEqual(data, { title: 'A: B', order: '2' });
  assert.equal(body, 'Body');
  assert.throws(() => parseFrontmatter('---\nnot a pair\n---\n'), /bad frontmatter/);
  assert.match(fillTokens('online until {{months}} months'), /until 12 months/);
  assert.throws(() => fillTokens('{{nope}}'), /unknown token/);
  const g = parseGuide(
    'x',
    '---\ntitle: T\ndescription: D\npublished: 2026-10-14\nupdated: 2026-10-14\nreviewed: 2026-10-14\nquickAnswer: Q\nkeyword: k\n---\n## Intro\nText.\n## FAQ\n### One?\nA.\n### Two?\nB.\n',
  );
  assert.deepEqual(g.faq.map((f) => f.q), ['One?', 'Two?']);
  assert.throws(() => parseGuide('y', '---\ntitle: T\n---\n'), /must be YYYY-MM-DD|missing/);
});
