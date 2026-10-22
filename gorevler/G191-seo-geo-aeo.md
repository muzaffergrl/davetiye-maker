---
id: G191
baslik: Satış sitesi SEO / GEO / AEO — claude-seo ile denetim ve düzeltme
rol: claude-kod
durum: inceleme
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

## Sonuç (2026-10-22, bulut oturumu)
- Rapor: `docs/35_SEO_GEO_AEO.md`. claude-seo `23a2a81` (skill 2.4.2) ile yerel production build, 242 sayfa (5 dil).
  Puan, yayına hazır hâli için **86/100**; bugün `launched: false` olduğu için indekslenebilirlik bilerek 0.
  Kritik ya da yüksek öncelikli kod bulgusu yok. `agentic_check` bütün P0/P1 kontrollerden geçti.
- Düzeltilenler: `components/marketing/Shell.tsx` footer artık bütün rehberleri listeliyor (önceden 2 rehber 8–9 iç link
  alıyordu, ötekiler 47). `lib/marketing/crawl.ts` sitemap katalogdaki `preview` tasarımları da içeriyor; llms.txt yine
  yalnız `live`. Test: `tests/marketing-crawl.test.ts`. Kayıt: docs/14 §15.
- Ham veri: `platform/previews/g191/` (`crawl.json`, `agentic-check.json`, `crawl_audit.py`).
- Testler: `npm test` 1689/1689 (0 hata, 0 atlanan), `npm run typecheck` ve `npm run build` (trace-check + js-budget) temiz.
- Yapılmadı: canlı site denetimi (bulut ağı bkestudio.com'a ulaşamıyor), anahtar kelime/SERP verisi, GSC/Bing/CrUX.

## Önerilen görevler (entegratöre)
- Lansman günü: GSC + Bing Webmaster doğrulama ve sitemap; canlıda `agentic_check.py --ua-matrix`; IndexNow anahtar route'u
  ve gönderim (docs/35 #2–#5).
- Sosyal profiller açılınca `config.ts` `social` (sameAs) (docs/35 #6).

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: rapor + 2 düzeltme, testler yeşil
