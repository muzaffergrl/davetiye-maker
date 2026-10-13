import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import { renderTemplate, safeJsonForScript, type RenderOptions } from '../lib/theme/engine.ts';
import type { ThemeManifest } from '../lib/theme/theme.ts';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { demoContent, REPO_ROOT } from './helpers.ts';

const THEME: Pick<ThemeManifest, 'id' | 'pages' | 'photos'> = {
  id: 'testtheme',
  pages: { index: 'index.html', home: 'home.html', story: 'story.html' },
  photos: {
    hero: { label: 'Hero', source: 'media.hero_portrait' },
    story1: { label: 'Story 1', source: 'media.memory_photos.0' },
  },
};

function page(body: string, head = ''): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>t</title>${head}</head><body>${body}</body></html>`;
}

type Extra = Partial<Omit<RenderOptions, 'html'>> & { head?: string };

function render(body: string, content: unknown = demoContent(), extra: Extra = {}) {
  const { head, ...opts } = extra;
  const result = renderTemplate({ content, theme: THEME, page: 'home', slug: 'clara-and-julian', ...opts, html: page(body, head) });
  return { ...result, $: cheerio.load(result.html) };
}

function siteData($: cheerio.CheerioAPI) {
  return JSON.parse($('#site-data').text());
}

// ---------------------------------------------------------------- data-field

test('data-field inserts text and formats dates/times by field type', () => {
  const { $ } = render(`
    <h1 id="n" data-field="name_display">Old Name</h1>
    <p id="d" data-field="date"></p>
    <p id="dl" data-field="date" data-format="date-long"></p>
    <p id="raw" data-field="date" data-format="raw"></p>
    <p id="t" data-field="ceremony_time"></p>
    <p id="dl2" data-field="rsvp.deadline"></p>
    <p id="wd" data-field="date_weekday"></p>
    <p id="cr" data-field="venue.city_region"></p>
    <p id="crc" data-field="venue.city_region_country"></p>
    <p id="p1" data-field="partners.1.full_name"></p>`);
  assert.equal($('#n').text(), 'Clara & Julian');
  assert.equal($('#d').text(), 'May 15, 2027');
  assert.equal($('#dl').text(), 'Saturday, May 15, 2027');
  assert.equal($('#raw').text(), '2027-05-15');
  assert.equal($('#t').text(), '4:00 PM');
  assert.equal($('#dl2').text(), 'April 3, 2027');
  assert.equal($('#wd').text(), 'Saturday');
  assert.equal($('#cr').text(), 'Savannah, Georgia');
  assert.equal($('#crc').text(), 'Savannah, Georgia, USA');
  assert.equal($('#p1').text(), 'Julian Thomas');
});

test('non-US locale uses day-month-year and lowercase am/pm', () => {
  const content = { ...demoContent(), locale: 'en-GB' };
  const { $ } = render('<p id="d" data-field="date"></p><p id="t" data-field="ceremony_time"></p>', content);
  assert.equal($('#d').text(), '15 May 2027');
  assert.equal($('#t').text(), '4:00 pm');
});

test('data-field escapes HTML in content (XSS attempts)', () => {
  const content = demoContent();
  content.name_display = '<script>alert(1)</script><img src=x onerror=alert(2)>';
  content.venue.name = '</p><iframe src="javascript:alert(3)"></iframe>';
  content.host_line = '&lt;b&gt; already-escaped & raw';
  const { html, $ } = render(`
    <h1 id="n" data-field="name_display"></h1>
    <h2 id="amp" data-field="name_display" data-format="amp"></h2>
    <p id="v" data-field="venue.name"></p>
    <p id="h" data-field="host_line"></p>`, content);
  assert.equal($('#n').text(), content.name_display);
  assert.equal($('#v').text(), content.venue.name);
  assert.equal($('#h').text(), content.host_line);
  assert.equal($('script:not(#site-data)').length, 0);
  assert.equal($('iframe').length, 0);
  assert.equal($('body img').length, 0);
  assert.ok(!html.includes('<script>alert'));
  assert.ok(!html.includes('<iframe'));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(html.includes('&amp;lt;b&amp;gt; already-escaped &amp; raw'));
});

test('data-format="amp" wraps every & in span.amp and keeps text escaped', () => {
  const content = demoContent();
  content.name_display = 'A & <b>B</b> & C';
  const { $ } = render('<h1 id="n" data-field="name_display" data-format="amp"></h1>', content);
  assert.equal($('#n .amp').length, 2);
  assert.equal($('#n b').length, 0);
  assert.equal($('#n').text(), 'A & <b>B</b> & C');
});

test('missing / null fields empty the element and mark it data-empty', () => {
  const content = demoContent();
  content.host_line = null;
  const { $ } = render(`
    <p id="h" data-field="host_line">Theme sample text</p>
    <p id="x" data-field="does.not.exist">Sample</p>
    <p id="proto" data-field="constructor">Sample</p>
    <p id="o" data-field="venue">Sample</p>`, content);
  for (const id of ['h', 'x', 'proto', 'o']) {
    assert.equal($(`#${id}`).text(), '', id);
    assert.equal($(`#${id}`).attr('data-empty'), '', id);
  }
});

test('data-field on script/style/void elements is ignored with a warning', () => {
  const content = demoContent();
  content.name_display = '</script><script>alert(1)</script>';
  const { $, warnings } = render('<script id="s" data-field="name_display">var a = 1;</script><img id="i" data-field="name_display">', content);
  assert.equal($('#s').html(), 'var a = 1;');
  assert.equal($('#i').attr('src'), undefined);
  assert.ok(warnings.some((w) => w.includes('<script>')));
});

// ---------------------------------------------------------------- data-optional / data-if

test('data-optional keeps only blocks that are explicitly true', () => {
  const content = demoContent();
  content.optional_blocks = { our_story: true, countdown: false };
  const { $, warnings } = render(`
    <section id="story" data-optional="our_story"><p data-field="date"></p></section>
    <section id="count" data-optional="countdown">x</section>
    <section id="faq" data-optional="faq">absent key</section>
    <section id="bad" data-optional="nonsense">x</section>`, content);
  assert.equal($('#story').length, 1);
  assert.equal($('#story p').text(), 'May 15, 2027');
  assert.equal($('#count').length, 0);
  assert.equal($('#faq').length, 0);
  assert.equal($('#bad').length, 0);
  assert.ok(warnings.some((w) => w.includes('nonsense')));
});

test('data-if keeps elements with non-empty values; "!" negates', () => {
  const content = demoContent();
  content.venue.address = null;
  content.host_line = '  ';
  const { $ } = render(`
    <p id="addr" data-if="venue.address">a</p>
    <p id="noaddr" data-if="!venue.address">no address</p>
    <p id="host" data-if="host_line">h</p>
    <p id="dress" data-if="dress_code">d</p>
    <p id="photos" data-if="media.memory_photos">p</p>`, content);
  assert.equal($('#addr').length, 0);
  assert.equal($('#noaddr').length, 1);
  assert.equal($('#host').length, 0);
  assert.equal($('#dress').length, 1);
  assert.equal($('#photos').length, 0);
});

// ---------------------------------------------------------------- data-repeat

test('data-repeat renders one copy per item with relative paths', () => {
  const content = demoContent();
  content.schedule[1].location = null;
  const { $ } = render(`
    <ul><li class="row" data-repeat="schedule">
      <b data-field=".time"></b><span class="label" data-field=".label"></span>
      <em data-if=".location" data-field=".location"></em>
    </li></ul>`, content);
  const rows = $('li.row');
  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map((_, r) => $(r).find('b').text()).get(), ['4:00 PM', '5:00 PM', '6:30 PM']);
  assert.deepEqual(rows.map((_, r) => $(r).find('.label').text()).get(), ['Ceremony', 'Cocktail Hour', 'Reception']);
  assert.equal(rows.eq(1).find('em').length, 0);
  assert.equal(rows.eq(2).find('em').text(), 'The Conservatory Hall');
  assert.equal(rows.eq(2).find('b').attr('data-field'), 'schedule.2.time');
  assert.equal($('[data-repeat]').length, 0);
});

test('data-repeat over an empty list removes the template', () => {
  const content = demoContent();
  content.schedule = [];
  const { $ } = render('<ul id="u"><li data-repeat="schedule"><span data-field=".label"></span></li></ul>', content);
  assert.equal($('#u li').length, 0);
});

// ---------------------------------------------------------------- data-url

test('data-url / <a data-field="urls.*"> accept only http(s)/mailto/tel; anything else becomes href="#"', () => {
  const content = demoContent();
  content.record_kind = 'customer';
  const cases: Array<[string, string | null]> = [
    ['https://maps.example.org/place?q=1', 'https://maps.example.org/place?q=1'],
    ['http://example.org', 'http://example.org/'],
    ['mailto:couple@example.org', 'mailto:couple@example.org'],
    ['tel:+15551234567', 'tel:+15551234567'],
    ['javascript:alert(1)', null],
    ['JAVASCRIPT:alert(1)', null],
    [' java\tscript:alert(1)', null],
    ['data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==', null],
    ['vbscript:msgbox(1)', null],
    ['//evil.example', null],
    ['/relative/path', null],
    ['not a url', null],
  ];
  for (const [input, expected] of cases) {
    content.urls = { map: input };
    const { $ } = render(
      '<a id="a" href="#" data-url="map" target="_blank">Map</a><a id="b" href="#" data-field="urls.map">Map <b>link</b></a>',
      content,
    );
    for (const id of ['#a', '#b']) {
      assert.equal($(id).attr('href'), expected ?? '#', `${id} input ${JSON.stringify(input)}`);
      if (expected) {
        assert.equal($(id).attr('data-url-missing'), undefined);
      } else {
        assert.equal($(id).attr('data-url-missing'), '');
        assert.equal($(id).attr('aria-disabled'), 'true');
      }
    }
    if (expected) assert.equal($('#a').attr('rel'), 'noopener noreferrer');
    assert.equal($('#b').html(), 'Map <b>link</b>', 'link children are kept');
  }
});

test('null URL (demo record) leaves href="#" and marks the link missing', () => {
  const { $ } = render('<a id="a" href="#" data-url="registry">Registry</a>');
  assert.equal($('#a').attr('href'), '#');
  assert.equal($('#a').attr('data-url-missing'), '');
  assert.equal($('#a').text(), 'Registry');
});

// ---------------------------------------------------------------- data-attr-*

test('data-attr-* sets allow-listed attributes with escaped raw values', () => {
  const content = demoContent();
  content.name_display = '" onmouseover="alert(1)';
  const { $, html, warnings } = render(
    `<img id="i" src="a.png" data-attr-alt="name_display">
     <time id="t" data-attr-datetime="countdown_target_utc"></time>
     <div id="d" data-attr-data-target="date"></div>
     <a id="bad" data-attr-href="name_display" data-attr-onclick="name_display" data-attr-data-field="date">x</a>`,
    content,
  );
  assert.equal($('#i').attr('alt'), '" onmouseover="alert(1)');
  assert.equal($('#i').attr('onmouseover'), undefined);
  assert.ok(html.includes('alt="&quot; onmouseover=&quot;alert(1)"'));
  assert.equal($('#t').attr('datetime'), '2027-05-15T20:00:00.000Z');
  assert.equal($('#d').attr('data-target'), '2027-05-15');
  assert.equal($('#bad').attr('href'), undefined);
  assert.equal($('#bad').attr('onclick'), undefined);
  assert.equal($('#bad').attr('data-field'), undefined);
  assert.equal(warnings.filter((w) => w.includes('not allowed')).length, 3);
});

// ---------------------------------------------------------------- data-photo

test('data-photo uses the content photo, drops srcset and <picture> sources', () => {
  const content = demoContent();
  content.media.hero_portrait = 'https://storage.example.org/p/hero.jpg';
  content.media.memory_photos = ['/media/0b9f2c1e-0000-4000-8000-000000000000/abc.webp'];
  const { $ } = render(`
    <img id="hero" data-photo="hero" src="assets/ph.webp" srcset="assets/ph-2x.webp 2x" sizes="100vw">
    <picture id="pic"><source srcset="assets/ph.avif" type="image/avif"><img id="s1" data-photo="story1" src="assets/ph.webp"></picture>`, content);
  assert.equal($('#hero').attr('src'), 'https://storage.example.org/p/hero.jpg');
  assert.equal($('#hero').attr('srcset'), undefined);
  assert.equal($('#hero').attr('sizes'), undefined);
  assert.equal($('#hero').attr('data-photo-state'), 'user');
  assert.equal($('#s1').attr('src'), '/media/0b9f2c1e-0000-4000-8000-000000000000/abc.webp');
  assert.equal($('#pic source').length, 0);
});

test('data-photo without a photo keeps the theme placeholder (rewritten)', () => {
  const { $ } = render('<img id="hero" data-photo="hero" src="assets/ph.webp" srcset="assets/ph.webp 1x, assets/ph-2x.webp 2x">');
  assert.equal($('#hero').attr('src'), '/themes/testtheme/assets/ph.webp');
  assert.equal($('#hero').attr('srcset'), '/themes/testtheme/assets/ph.webp 1x, /themes/testtheme/assets/ph-2x.webp 2x');
  assert.equal($('#hero').attr('data-photo-state'), 'placeholder');
});

test('data-photo rejects unsafe photo URLs and unknown slots', () => {
  const content = demoContent();
  for (const bad of ['javascript:alert(1)', 'data:image/svg+xml,<svg onload=alert(1)>', '//evil.example/x.jpg', 'relative/x.jpg', '/\\evil']) {
    content.media.hero_portrait = bad;
    const { $, warnings } = render('<img id="hero" data-photo="hero" src="assets/ph.webp">', content);
    assert.equal($('#hero').attr('src'), '/themes/testtheme/assets/ph.webp', bad);
    assert.ok(warnings.some((w) => w.includes('unsafe')), bad);
  }
  const { warnings } = render('<img data-photo="nope" src="assets/ph.webp">');
  assert.ok(warnings.some((w) => w.includes('"nope"')));
});

test('data-photo on a non-img element sets a quoted --photo CSS variable', () => {
  const content = demoContent();
  content.media.hero_portrait = 'https://storage.example.org/a")b;c.jpg';
  const { $ } = render('<div id="bg" data-photo="hero" style="color: red"></div>', content);
  const style = $('#bg').attr('style')!;
  assert.match(style, /^color: red; --photo: url\("https:\/\/storage\.example\.org\/a%22\)b;c\.jpg"\)$/);
});

// ---------------------------------------------------------------- asset & page links

test('relative asset paths are rewritten to the theme static route', () => {
  const { $, warnings } = render(
    `<img id="i" src="./assets/a b.webp"><img id="abs" src="https://cdn.example.org/x.png">
     <img id="esc" src="../../etc/passwd"><div id="st" style="background:url('assets/bg.webp')"></div>
     <video id="v" poster="assets/poster.jpg" src="assets/clip.mp4"></video>
     <a id="pdf" href="assets/guide.pdf">pdf</a><a id="hash" href="#rsvp">x</a><a id="mail" href="mailto:a@b.co">m</a>`,
    demoContent(),
    { head: '<link id="css" rel="stylesheet" href="style.css?v=2"><script id="js" src="site.js" defer></script><style id="sty">.x{background:url(assets/x.png)} .y{background:url("https://cdn.example.org/y.png")}</style>' },
  );
  assert.equal($('#css').attr('href'), '/themes/testtheme/style.css?v=2');
  assert.equal($('#js').attr('src'), '/themes/testtheme/site.js');
  assert.equal($('#i').attr('src'), '/themes/testtheme/assets/a%20b.webp');
  assert.equal($('#abs').attr('src'), 'https://cdn.example.org/x.png');
  assert.equal($('#esc').attr('src'), undefined);
  assert.ok(warnings.some((w) => w.includes('leaves the theme folder')));
  assert.equal($('#st').attr('style'), 'background:url("/themes/testtheme/assets/bg.webp")');
  assert.equal($('#v').attr('poster'), '/themes/testtheme/assets/poster.jpg');
  assert.equal($('#v').attr('src'), '/themes/testtheme/assets/clip.mp4');
  assert.equal($('#pdf').attr('href'), '/themes/testtheme/assets/guide.pdf');
  assert.equal($('#hash').attr('href'), '#rsvp');
  assert.equal($('#mail').attr('href'), 'mailto:a@b.co');
  assert.equal($('#sty').text(), '.x{background:url("/themes/testtheme/assets/x.png")} .y{background:url("https://cdn.example.org/y.png")}');
});

test('links to theme pages become site routes and keep the preview key', () => {
  const body = '<a id="i" href="index.html">e</a><a id="h" href="home.html#top">h</a><a id="s" href="./story.html?x=1">s</a><a id="d" href="details.html">d</a>';
  const pub = render(body);
  assert.equal(pub.$('#i').attr('href'), '/clara-and-julian');
  assert.equal(pub.$('#h').attr('href'), '/clara-and-julian/home#top');
  assert.equal(pub.$('#s').attr('href'), '/clara-and-julian/story?x=1');
  // details.html is not declared by this theme -> treated as a (non-servable) asset, with a warning
  assert.equal(pub.$('#d').attr('href'), '/themes/testtheme/details.html');
  assert.ok(pub.warnings.some((w) => w.includes('details.html')));

  const prev = render(body, demoContent(), { previewKey: 'abc_DEF-123' });
  assert.equal(prev.$('#h').attr('href'), '/clara-and-julian/home?preview=abc_DEF-123#top');
  assert.equal(prev.$('#s').attr('href'), '/clara-and-julian/story?x=1&preview=abc_DEF-123');
  assert.equal(prev.$('html').attr('data-preview'), 'true');
});

test('og:image becomes absolute when an origin is given', () => {
  const { $ } = render('', demoContent(), { head: '<meta property="og:image" content="assets/og.jpg">', origin: 'https://sites.example.org' });
  assert.equal($('meta[property="og:image"]').attr('content'), 'https://sites.example.org/themes/testtheme/assets/og.jpg');
});

// ---------------------------------------------------------------- site-data JSON

test('site-data JSON is injected before the first head script and cannot break out', () => {
  const content = demoContent();
  content.name_display = '</script><script>alert(1)</script> \u2028 & <!--';
  content.urls = { map: 'javascript:alert(1)', registry: 'https://registry.example.org/x' };
  content.media.hero_portrait = 'javascript:alert(2)';
  const { $, html } = render('<p>x</p>', content, { head: '<script id="theme-js" src="site.js"></script><script type="application/json" id="site-data">{"stale":true}</script>' });
  assert.equal($('script#site-data').length, 1);
  assert.equal($('head script').first().attr('id'), 'site-data');
  const raw = $('#site-data').html()!;
  assert.ok(!/[<>&\u2028]/.test(raw), 'no raw <, >, & or U+2028 in the JSON block');
  assert.equal(html.match(/<\/script>/g)!.length, $('script').length);
  const data = siteData($);
  assert.equal(data.content.name_display, content.name_display);
  assert.equal(data.content.urls.map, null);
  assert.equal(data.content.urls.registry, 'https://registry.example.org/x');
  assert.equal(data.content.media.hero_portrait, null);
  assert.equal(data.photos.hero, null);
  assert.equal(data.slug, 'clara-and-julian');
  assert.equal(data.page, 'home');
  assert.equal(data.derived.countdown_target_utc, '2027-05-15T20:00:00.000Z');
  assert.equal(data.derived.date_display, 'May 15, 2027');
  assert.deepEqual(Object.keys(data.pages), ['index', 'home', 'story']);
  assert.equal(data.stale, undefined);
});

test('safeJsonForScript round-trips through JSON.parse', () => {
  const value = { a: '</script><!-- & \u2028\u2029 >' };
  const s = safeJsonForScript(value);
  assert.ok(!/[<>&\u2028\u2029]/.test(s));
  assert.deepEqual(JSON.parse(s), value);
});

test('html element gets theme/page/variant attributes and a default lang', () => {
  const { $ } = render('<p>x</p>', demoContent(), { variant: 'champagne' });
  assert.equal($('html').attr('data-theme'), 'testtheme');
  assert.equal($('html').attr('data-page'), 'home');
  assert.equal($('html').attr('data-variant'), 'champagne');
  assert.equal($('html').attr('lang'), 'en');
});

// ---------------------------------------------------------------- G035-style markers

test('<img data-field="media.*"> takes the photo URL; the [data-slot] wrapper gets the state', () => {
  const content = demoContent();
  content.media.hero_portrait = 'https://storage.example.org/hero.webp';
  const { $ } = render(`
    <span id="slot" class="photo-slot" data-slot="hero_portrait"><img id="h" data-field="media.hero_portrait" src="img/ph-320.webp" srcset="img/ph-320.webp 320w"></span>
    <span id="slot2" data-slot="story_1"><img id="s" data-field="media.memory_photos.0" src="img/ph.webp"></span>`, content);
  assert.equal($('#h').attr('src'), 'https://storage.example.org/hero.webp');
  assert.equal($('#h').attr('srcset'), undefined);
  assert.equal($('#slot').attr('data-photo-state'), 'user');
  assert.equal($('#s').attr('src'), '/themes/testtheme/img/ph.webp');
  assert.equal($('#slot2').attr('data-photo-state'), 'placeholder');
  assert.equal($('#s').attr('data-empty'), undefined, 'a placeholder photo is not "empty"');
});

test('data-text and data-attr templates fill {path} and {path|format} safely', () => {
  const content = demoContent();
  content.venue.city = '<b>Savannah</b>';
  const { $ } = render(
    `<h2 id="t" data-text="Our Story · {name_display} · {date|weekday}">x</h2>
     <p id="m" data-text="{venue.region} {missing.path}">x</p>`,
    content,
    { head: '<meta id="og" property="og:description" data-attr-content="{date|date-long} · {venue.city_region}" content="">' },
  );
  assert.equal($('#t').text(), 'Our Story · Clara & Julian · Saturday');
  assert.equal($('#m').text(), 'Georgia ');
  assert.equal($('#og').attr('content'), 'Saturday, May 15, 2027 · <b>Savannah</b>, Georgia');
  assert.equal($('b').length, 0);
});

test('<title data-text> is filled server side', () => {
  const result = renderTemplate({
    html: '<!DOCTYPE html><html><head><title data-text="{name_display} · {date}">Wedding</title></head><body></body></html>',
    content: demoContent(),
    theme: THEME,
    page: 'index',
    slug: 'clara-and-julian',
  });
  assert.equal(cheerio.load(result.html)('title').text(), 'Clara & Julian · May 15, 2027');
});

test('inline theme scripts get CSP hashes; data blocks and src scripts do not', () => {
  const code = "document.documentElement.classList.replace('no-js','js');";
  const { scriptHashes } = render('<script>var x = 1;</script>', demoContent(), {
    head: `<script>${code}</script><script type="speculationrules">{"prefetch":[]}</script><script src="site.js"></script><script type="application/ld+json">{}</script>`,
  });
  const expected = `'sha256-${createHash('sha256').update(code).digest('base64')}'`;
  assert.ok(scriptHashes.includes(expected));
  assert.equal(scriptHashes.length, 3); // inline head script, speculationrules, body script
});

test('data-optional / data-if on <body> switches the whole page off', () => {
  const html = '<!DOCTYPE html><html><head></head><body data-optional="our_story"><p>x</p></body></html>';
  const content = demoContent();
  content.optional_blocks.our_story = false;
  const off = renderTemplate({ html, content, theme: THEME, page: 'story', slug: 'clara-and-julian' });
  assert.equal(off.disabled, true);
  assert.equal(off.html, '');
  content.optional_blocks.our_story = true;
  const on = renderTemplate({ html, content, theme: THEME, page: 'story', slug: 'clara-and-julian' });
  assert.equal(on.disabled, false);
  assert.equal(cheerio.load(on.html)('body p').text(), 'x');
});

// ---------------------------------------------------------------- the real G035 theme source

const G035_DIR = path.join(REPO_ROOT, 'collections/03_Blush_Garden_Rose/website');

test('G035 source pages (design 03) render server side with this engine', (t) => {
  if (!existsSync(path.join(G035_DIR, 'home.html'))) return t.skip('G035 website not present');
  const theme: Pick<ThemeManifest, 'id' | 'pages' | 'photos'> = {
    id: 'blush-garden-rose',
    pages: { index: 'index.html', home: 'home.html', story: 'story.html', details: 'details.html', rsvp: 'rsvp.html' },
    photos: {
      hero_portrait: { label: 'Hero', source: 'media.hero_portrait' },
      story_1: { label: 'Story 1', source: 'media.memory_photos.0' },
      story_2: { label: 'Story 2', source: 'media.memory_photos.1' },
      story_3: { label: 'Story 3', source: 'media.memory_photos.2' },
      venue: { label: 'Venue', source: 'media.venue_image' },
    },
  };
  const content = demoContent();
  content.media.hero_portrait = '/media/0b9f2c1e-0000-4000-8000-000000000000/0123456789abcdef0123456789abcdef.webp';
  for (const [page, file] of Object.entries(theme.pages) as Array<[keyof typeof theme.pages, string]>) {
    const result = renderTemplate({ html: readFileSync(path.join(G035_DIR, file), 'utf8'), content, theme, page, slug: 'clara-and-julian' });
    assert.equal(result.disabled, false, page);
    assert.deepEqual(result.warnings, [], `${page}: ${result.warnings.join(' | ')}`);
    const $ = cheerio.load(result.html);
    $('[data-field]').each((_, el) => {
      const field = $(el).attr('data-field')!;
      if (el.tagName === 'img' || field.startsWith('urls.')) return;
      assert.notEqual($(el).text().trim(), '', `${page}: ${field} is empty`);
    });
    assert.ok(result.scriptHashes.length >= 1, `${page}: inline scripts hashed`);
    $('a[data-field^="urls."]').each((_, el) => assert.equal($(el).attr('href'), '#'));
    $('link[rel="stylesheet"]').each((_, el) => {
      assert.match($(el).attr('href')!, /^(https:\/\/fonts\.googleapis\.com|\/themes\/blush-garden-rose\/)/);
    });
    const hero = $('img[data-field="media.hero_portrait"]');
    if (hero.length) assert.equal(hero.attr('src'), content.media.hero_portrait);
  }
  const home = cheerio.load(
    renderTemplate({ html: readFileSync(path.join(G035_DIR, 'home.html'), 'utf8'), content, theme, page: 'home', slug: 'clara-and-julian' }).html,
  );
  assert.equal(home('[data-field="partners.0.display_name"]').first().text(), 'Clara');
  assert.equal(home('[data-field="date"][data-format="weekday"]').first().text(), 'Saturday');
  assert.equal(home('[data-field="rsvp.deadline"]').first().text(), 'April 3, 2027');
  assert.ok(home('a[href="/clara-and-julian/story"]').length > 0);
});
