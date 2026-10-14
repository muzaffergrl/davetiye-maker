---
id: G061
baslik: Satış websitesi — anlatan, satışa yönlendiren, SEO/GEO/AEO'da en üst düzey
rol: claude-kod
durum: alindi
alan: wf-hiz
oncelik: 1
bagimli: [G038, G401]
yazar: [platform/app/(marketing)/, platform/components/marketing/, platform/lib/marketing/, platform/public/, platform/content/, platform/tests/marketing*, docs/14_SATIS_SITESI.md]
---

## Amaç
Kullanıcı (K25): ürünü en güzel anlatan, satışa yönlendiren, arama motorlarında ve yapay zekâ asistanlarında kendiliğinden
bulunan, tavsiye edilen satış sitesi. Marka adı henüz yok → tek yapılandırma dosyasında yer tutucu.

## Yapılacaklar
1. Araştırma (2026 güncel): teknik SEO, GEO (üretken arama motorları), AEO (yanıt motorları) en iyi uygulamaları; rakip
   anahtar kelimeler (wedding website, digital wedding invitation, envelope animation…); `docs/14_SATIS_SITESI.md`.
2. Bilgi mimarisi: ana sayfa (canlı zarf demosu), tasarımlar galerisi + her tasarım sayfası (canlı demo, telefon görüntüleri),
   nasıl çalışır, özellikler, fiyat (Etsy'ye yönlendiren butonlar; fiyat yer tutucu), SSS, rehber/blog (en az 5 kaliteli makale),
   hakkımızda, gizlilik (yasal kimlik yok — K25), iletişim.
3. Teknik: statik/ISR, Core Web Vitals, şema (Organization, Product/Offer, FAQPage, HowTo, Article, BreadcrumbList),
   sitemap, robots, canonical, OG/Twitter görselleri, `llms.txt` + temiz özet sayfaları (GEO/AEO), hreflang gerekmez (EN),
   erişilebilirlik; marka adı/alan adı/fiyat tek config'ten.
4. Görseller: yalnız GPT görselleri + tema önizlemeleri; gereken GPT görselleri için prompt listesi (`docs/14` ekinde).
5. Testler (Lighthouse benzeri ölçüm, şema doğrulama, link kontrolü) + 390/1280 önizlemeler.

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-14 alindi: wf-hiz
