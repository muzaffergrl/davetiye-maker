---
id: G037
baslik: Site platformu iskeleti — Next.js, tema şablon motoru, local veri adaptörü, site rotaları
rol: claude-kod
durum: alindi
alan: claude-kod-11
oncelik: 1
bagimli: []
yazar: [platform/]
---

## Amaç
K24: kendi sitemiz + panel. Temaları React'e çevirmeden yayınlayan, içerik JSON'undan site üreten iskelet.

## Girdiler
- `docs/10_SITE_PLATFORMU.md` (tek kaynak), `tools/validate_content.py` + `collections/*/content.demo.json` (içerik şeması)
- Tema kaynağı örneği: `collections/03_Blush_Garden_Rose/website/` (G035 bitince)

## Yapılacaklar
1. `platform/` Next.js (App Router, TypeScript) — `npm` paketleri sabit sürümle; `node_modules` ve `.data` gitignore.
2. Tema motoru: `platform/themes/<tema>/{index,home,story,details,rsvp}.html` + `theme.json` (ad, sayfalar, foto alanları).
   `data-field="a.b.0.c"` → içerik değeri (HTML kaçışlı), `data-photo="key"` → foto URL'si, `data-optional="key"` → gizle/göster,
   `data-url="key"` → href. Göreli varlık yolları tema statik klasörüne çevrilir.
3. Rotalar: `/[slug]` (zarf), `/[slug]/home|story|details|rsvp`; yayınlanmamış site 404; `?preview=<anahtar>` ile taslak.
4. Veri adaptör arayüzü (`getSiteBySlug`, `createSite`, `updateContent`, `publish`, `saveRsvp`, `listRsvps`, `savePhoto`)
   + `local` uygulaması. Düzenleme anahtarı hash'li.
5. İçerik doğrulama (şema) TypeScript tarafında; demo içerikle bir örnek site tohumu (`npm run seed`).
6. Test: şablon motoru (kaçış, eksik alan, isteğe bağlı bölüm), rota 200/404, adaptör. `npm test` + `npm run build` geçer.

## Bitti sayılması için
- [ ] `npm run build` ve testler geçiyor; tohum site yerelde açılıyor (Playwright 390 px ekran görüntüsü `platform/previews/`)

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 alindi: claude-kod-11
