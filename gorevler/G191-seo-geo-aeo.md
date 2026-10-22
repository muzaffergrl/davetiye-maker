---
id: G191
baslik: Satış sitesi SEO / GEO / AEO — claude-seo ile denetim ve düzeltme
rol: claude-kod
durum: alindi
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G061]
yazar: [platform/app/(marketing)/, platform/lib/marketing/, platform/components/marketing/, platform/content/guides/, platform/tests/g191*, platform/previews/g191/, docs/14_SATIS_SITESI.md, docs/35_SEO_GEO_AEO.md, gorevler/G191-seo-geo-aeo.md]
---

## Amaç
Kullanıcı (2026-10-22): "websitesine seo, geo ve aeo çalışacağız, claude seo reposu ile."
Satış sitesini (`platform/app/(marketing)/`, bkestudio.com) açık kaynak `AgriciDaniel/claude-seo` yöntemi ve betikleriyle
denetle; bulguları önceliklendir, kod içinde düzeltilebilenleri düzelt.

## Girdiler
- `docs/14_SATIS_SITESI.md` (G061 tasarım + uygulama), `platform/lib/marketing/*`, `platform/content/guides/`.
- claude-seo (repoya girmez; oturum içinde klonlanır, sürüm docs/35'te kayıtlı).

## Yapılacaklar
1. Yerel production build üzerinde claude-seo denetimi: teknik, şema, içerik/E-E-A-T, GEO (AI alıntılanabilirlik), AEO.
2. Rapor: `docs/35_SEO_GEO_AEO.md` (puan, bulgular, öncelik, "nasıl anlarız başarısız oldu" kontrolü).
3. Kod içinde çözülebilen bulguları düzelt + test.
4. Canlıya bağlı işler (GSC, Bing, IndexNow, CrUX) açık madde olarak yazılır; uydurulmaz.

## Bitti sayılması için
- Rapor + düzeltmeler + `npm test` / typecheck / build yeşil.
- `launched: false` korunur (indeksleme kararı kullanıcıda).

## Sonuç
(doldurulacak)

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
