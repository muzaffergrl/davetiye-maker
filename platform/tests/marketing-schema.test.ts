// G061 (docs/14 §8): JSON-LD builders. Placeholders never reach JSON-LD; Offer only with a real price and Etsy link;
// no ratings or reviews; required fields per type; "</script>" can never break out.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MARKETING } from '../lib/marketing/config.ts';
import { liveDesigns } from '../lib/marketing/designs.ts';
import { faqItems, plainAnswer } from '../lib/marketing/faq.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { article, breadcrumbs, faqEntities, graph, itemList, jsonLdString, organization, product, videoObject, webPage, website } from '../lib/marketing/schema.ts';
import { isPlaceholder } from '../lib/marketing/placeholders.ts';
import { corePages } from '../lib/marketing/site.ts';
import { readyConfig, validateJsonLd } from './marketing-helpers.ts';

test('today: the brand name is decided (K27), the undecided fields (email, price, Etsy link) stay out of JSON-LD', () => {
  const org = organization();
  const brand = isPlaceholder(MARKETING.brand.name) ? undefined : MARKETING.brand.name;
  assert.equal(org.name, brand);
  assert.equal(website().name, brand);
  if (brand) assert.match(String(org.logo), /^https?:\/\/[^/]+\/brand\/icon-512\.png$/, 'square brand logo for Organization');
  if (isPlaceholder(MARKETING.support.email)) {
    assert.equal(org.email, undefined);
    assert.equal(org.contactPoint, undefined);
  }
  for (const d of liveDesigns()) {
    const p = product(d);
    if (isPlaceholder(d.price) || isPlaceholder(d.etsyListingUrl)) {
      assert.equal(p.offers, undefined, `${d.id}: no Offer while the price / Etsy link is a placeholder`);
    }
    assert.deepEqual(p.brand, brand ? { '@id': org['@id'] } : undefined);
    assert.ok((p.image as string[]).length >= 3);
  }
  const all = graph(
    org,
    website(),
    ...corePages().map((p) => webPage(p, MARKETING, p.kind === 'FAQPage' ? { mainEntity: faqEntities(faqItems()) } : {})),
    ...liveDesigns().map((d) => product(d)),
  );
  const faqCount = faqEntities(faqItems()).length;
  assert.ok(faqCount > 10 && faqCount < faqItems().length, 'answers with placeholders are left out of FAQPage until decided');
  assert.deepEqual(validateJsonLd(all), []);
});

test('decided config: Organization has name, email, contactPoint, sameAs; Product has a matching Offer', () => {
  const cfg = readyConfig();
  const org = organization(cfg);
  assert.equal(org.name, 'Test Brand');
  assert.equal(org['@id'], 'https://example.com/#org');
  assert.deepEqual(org.sameAs, ['https://www.etsy.com/shop/ExampleShop']);
  assert.equal((org.contactPoint as Record<string, string>).email, 'hello@example.com');
  for (const d of liveDesigns(cfg)) {
    const p = product(d, cfg);
    const offer = p.offers as Record<string, string>;
    assert.equal(offer['@type'], 'Offer');
    assert.equal(offer.price, '29.40');
    assert.equal(offer.priceCurrency, 'USD');
    assert.match(offer.url, /^https:\/\/www\.etsy\.com\/listing\//);
    assert.deepEqual((p.brand as Record<string, string>)['@id'], 'https://example.com/#org');
    assert.deepEqual(validateJsonLd(graph(p, videoObject(d, cfg))), []);
  }
  assert.deepEqual(validateJsonLd(graph(organization(cfg), website(cfg))), []);
  // Entity matching with the Etsy shop: the shop name is an alternateName (only when it differs from the brand name).
  assert.equal(org.alternateName, 'ExampleShop');
  assert.equal(organization(readyConfig({ etsy: { shopUrl: 'https://www.etsy.com/shop/TestBrand', shopName: 'Test Brand' } })).alternateName, undefined);
  assert.equal(organization().alternateName, undefined, 'no alternateName while the shop name is a placeholder');
});

test('FAQPage JSON-LD answers the "why pay when free websites exist" objection without naming competitors', () => {
  const entities = faqEntities(faqItems(readyConfig()));
  const q = entities.find((e) => /free wedding websites/i.test(String(e.name)));
  assert.ok(q, 'question present in FAQPage');
  const text = (q.acceptedAnswer as { text: string }).text;
  assert.match(text, /good choice/);
  assert.doesNotMatch(text, /\bzola\b|the knot|\bjoy\b|minted|squarespace|greenvelope|paperless/i);
  assert.ok(faqEntities(faqItems()).some((e) => e.name === q.name), 'no placeholder in it, so it is in the JSON-LD today too');
});

test('VideoObject, Article, Breadcrumb, ItemList and FAQ entities carry their required fields', () => {
  for (const d of liveDesigns()) {
    const v = videoObject(d)!;
    assert.ok(v, d.id);
    assert.match(String(v.duration), /^PT\d+S$/);
    assert.match(String(v.contentUrl), /\/opening\.mp4$/);
  }
  for (const g of loadGuides()) {
    const a = article(g, MARKETING, '/x.jpg');
    assert.equal(a.headline, g.title);
    assert.deepEqual(validateJsonLd(a), [], g.slug);
  }
  const bc = breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Designs', path: '/designs' }]);
  assert.deepEqual(validateJsonLd(bc), []);
  assert.equal((bc.itemListElement as Array<{ position: number }>)[1].position, 2);
  assert.deepEqual(validateJsonLd(itemList([{ path: '/designs/a', name: 'A' }])), []);
  const q = faqEntities(faqItems(readyConfig()));
  assert.deepEqual(validateJsonLd(q), []);
  assert.equal((q[0].acceptedAnswer as { text: string }).text, plainAnswer(faqItems(readyConfig())[0].a));
  assert.ok(!(q[0].acceptedAnswer as { text: string }).text.includes(']('), 'Markdown links are flattened to text');
});

test('the validator itself catches placeholders, ratings and missing fields', () => {
  const bad = validateJsonLd({ '@type': 'Product', name: '[BRAND] thing', aggregateRating: { '@type': 'AggregateRating' } });
  assert.ok(bad.some((p) => p.includes('placeholder')));
  assert.ok(bad.some((p) => p.includes('aggregateRating')));
  assert.ok(bad.some((p) => p.includes('lacks image')));
});

test('jsonLdString escapes "<" so a script element cannot be closed from data', () => {
  const s = jsonLdString({ a: '</script><script>alert(1)</script>' });
  assert.ok(!s.includes('</script>'));
  assert.deepEqual(JSON.parse(s), { a: '</script><script>alert(1)</script>' });
});
