# Satış sitesi SEO / GEO / AEO denetimi (G191, 2026-10-22)

Kullanıcı (2026-10-22): "websitesine seo, geo ve aeo çalışacağız, claude seo reposu ile."
Araç: açık kaynak [`AgriciDaniel/claude-seo`](https://github.com/AgriciDaniel/claude-seo) (commit `23a2a81`, 21 Ekim 2026;
skill sürümü 2.4.2). Repoya girmedi, oturumda klonlandı. Yöntem `skills/seo-audit`, `seo-geo`, `seo-technical`, `seo-schema`,
`seo-agentic`; betikler `parse_html.py`, `agentic_check.py --ua-matrix`, `content_quality.py`.

**Neyin denetlendiği:** yerel production build (`npm run build && npm start`, `localhost:3000`), ana sayfadan iç linkler
izlenerek **242 sayfa** (50 İngilizce + TR/DE/ES/FR × 48). Canlı adres (bkestudio.com) bulut oturumundan açılmadı
(proxy, önceki oturumlarla aynı). Canlı sunucuya bağlı kontroller (HTTPS/yönlendirme, Vercel bot koruması, CrUX, GSC)
**yapılmadı**, §4'te açık.

Ham veri: `platform/previews/g191/` — `crawl.json` (sayfa başına sinyaller), `agentic-check.json` (claude-seo çıktısı),
`crawl_audit.py` (tarayıcı; `parse_html.py`'yi claude-seo'dan çağırır).

## 0. Özet

- **Puan (claude-seo ağırlıklarıyla): 86 / 100 — yayına hazır hâli için.** Bugünkü hâliyle indekslenebilirlik bilerek
  **0**: `launched: false`, her sayfa `noindex, follow`, sitemap boş (docs/14 §14, lansman kapısı docs/29).
- Kritik ya da yüksek öncelikli **kod** bulgusu yok. G061'in kurduğu temel (başlık/açıklama, tek H1, kanonik, 5 dilde
  hreflang, JSON-LD, robots, llms.txt, SSS, rehberler) testten geçti.
- Kodda düzeltilen 2 bulgu (§3). Kalan işler çoğunlukla **lansman günü** ve **site dışı** (marka bahsedilmesi, sosyal profiller).

| Kategori (ağırlık) | Puan | Gerekçe |
|---|---|---|
| Teknik SEO (22) | 92 | 242/242 sayfa 200; kanonik her sayfada kendisi; hreflang 5 dil + x-default; gerçek 404; robots bilinçli. Canlı başlıklar denetlenemedi |
| İçerik kalitesi (23) | 80 | Rehberler 77–83/100 (`content_quality.py`; dolgu 0, AI kalıbı 0). Adı olan yazar yok (E-E-A-T), birinci el veri yok |
| Sayfa içi (20) | 92 | Başlık ≤ 60, açıklama 140–158, tek H1, başlık atlaması yok. 2 rehber zayıf iç link (düzeltildi) |
| Şema (10) | 85 | Organization, WebSite, Product, VideoObject, Article, FAQPage, BreadcrumbList, ItemList; JSON-LD hatası 0. Product'ta Offer, Etsy linkleri gelene kadar yok, o yüzden ürün snippet'ine uygun değil |
| Performans (10) | 85 | Yalnız lab ölçümü (G141: `/` LCP 1.416 ms, yavaş 4G). Saha verisi (CrUX) yok. Ana sayfa HTML 402 KB, gzip ile 41 KB |
| AI arama hazırlığı (10) | 75 | `agentic_check` bütün P0/P1 geçti; llms.txt Lighthouse kurallarına uyuyor. Site dışı varlık sinyali yok (sameAs yalnız Etsy) |
| Görseller (5) | 95 | 242 sayfada alt metni eksik görsel 0, boyutu eksik görsel 0, WebP |

## 1. Geçenler (claude-seo kanıtıyla)

- **AI ajanları (`agentic_check.py --ua-matrix`):** sunucu tarafı içerik (JS'siz 2.564 kelime), robots.txt'de 11 AI botu için
  ayrı grup, arama botları kökte açık, GPTBot/ClaudeBot/PerplexityBot vb. tarayıcıyla aynı yanıtı alıyor (yerelde),
  llms.txt + llms-full.txt geçerli, bilinmeyen URL gerçek 404.
- **Sayfa içi:** 242 sayfada başlık > 60 yok, açıklama > 160 yok, H1 sayısı ≠ 1 yok, yer tutucu (`[BRAND]` …) görünmüyor.
- **AEO:** SSS sayfasında 32 soru başlığı, her tasarım sayfasında 4, ana sayfada 6. Rehberler "hızlı yanıt" ile başlıyor.
  SSS yanıtları 40–80 kelime, ilk cümle ≤ 25 kelime (G061 testi).
- **Çok dil:** `html lang` her dilde doğru, kanonik kendi dilinde, sitemap'te `xhtml:link` alternatifleri.

## 2. Bulgular ve öneriler

"Başarısız olduğunu nasıl anlarız" sütunu claude-seo'nun yöntemi: her önerinin ölçülebilir bir kontrolü var.

| # | Öncelik | Bulgu | Öneri | Başarısız olduğunu nasıl anlarız |
|---|---|---|---|---|
| 1 | Kritik (bilerek) | `launched: false`: bütün site noindex, sitemap boş | Lansman listesi docs/29 tamamlanınca `launched: true` | Yayından 2 hafta sonra GSC "Sayfalar" raporunda indekslenen < 30 |
| 2 | Yüksek (lansman günü) | Google Search Console ve **Bing Webmaster Tools** doğrulanmadı, sitemap gönderilmedi. ChatGPT araması ve Copilot Bing dizinine dayanıyor | İkisine de doğrulama + `sitemap.xml`; Bing'de "AI Performance" raporu izlenir | 7 gün içinde Bing'de "Discovered" 0 |
| 3 | Yüksek (lansman günü) | Product şemasında Offer yok (Etsy linkleri yer tutucu). Google ürün snippet'i için `offers`, `review` ya da `aggregateRating`'den biri şart | `tools/ilan_baglantilari.py` ile linkler bağlanınca Offer kendiliğinden üretilir (schema.ts) | Rich Results Test'te tasarım sayfası "Product snippet" diye görünmüyor |
| 4 | Yüksek (lansman günü) | Canlı sunucu AI botlarına engel çıkarıyor mu bilinmiyor (Vercel bot koruması / saldırı modu) | Canlıya erişen bir oturumdan `agentic_check.py https://bkestudio.com/ --ua-matrix` | `differs_from_browser` boş değil ya da 403/challenge |
| 5 | Yüksek (lansman günü) | IndexNow yok. Bing/Yandex'e değişiklik bildirimi yapılmıyor | Lansmanda claude-seo `indexnow_submit.py` ile sitemap URL'leri; anahtar dosyası için küçük bir route (önerilen görev) | Bing'de yeni tasarım sayfası 7 günde keşfedilmiyor |
| 6 | Orta | Site dışı varlık sinyali yok: Organization `sameAs` yalnız Etsy, `social` alanları `null`. AI alıntılarıyla en güçlü ilişki marka bahsedilmesinde (YouTube, Reddit, Pinterest) | Pinterest + Instagram + YouTube/TikTok profili açılınca `config.ts` `social` doldurulur (sameAs kendiliğinden). Açılış videoları zaten var (10 sn klipler): Pinterest/YouTube Shorts'a uygun | 3 ay sonra ChatGPT/Perplexity'de "envelope wedding website" sorgusunda BKE Studio adı geçmiyor |
| 7 | Orta | Rehberlerin yazarı "BKE Studio Editorial" (kurum). Gerçek kişi adı yok (E-E-A-T, GEO "author byline") | Yalnız **gerçek** bir kişi kabul ederse ad + kısa özgeçmiş; uydurma yazar yok (AGENTS.md) | — (karar kullanıcıda) |
| 8 | Orta | 6 rehberin hepsi 14 Ekim 2026 tarihli. AI alıntılarında tazelik önemli (claude-seo: 3 aydan yeni içerik) | Üç ayda bir gözden geçirme: `reviewed`/`updated` gerçekten değişince güncellenir | Ocak 2027'de `updated` hâlâ 2026-10-14 |
| 9 | Orta | Saha performans verisi yok | Trafik gelince CrUX/PageSpeed (`pagespeed_check.py`) | LCP p75 > 2,5 sn |
| 10 | Düşük | `/about` (16), `/contact` (18), `/faq` (32) başlıkları kısa | İsteğe bağlı: `Wedding Website FAQ: Etsy, Editing and RSVP` gibi. 4 dil sözlüğü (`lib/i18n/dict/market/*`) birlikte değişmeli; marka sorgusu sayfaları olduğu için düşük değer | — |
| 11 | Düşük | robots.txt'de `Content-Signal` satırı yok | İsteğe bağlı (`search=yes, ai-input=yes`); Google dikkate almıyor | — |
| 12 | Düşük | Markdown sürümü (`Accept: text/markdown`) yok | İsteğe bağlı; llms-full.txt aynı içeriği zaten veriyor | — |

## 3. G191'de düzeltilenler

1. **İki rehber zayıf bağlıydı.** Footer yalnız ilk 4 rehberi listeliyordu. `digital-wedding-invitation-etiquette` ve
   `canva-wedding-website-template-vs-hosted-website` 8–9 sayfadan link alıyordu, öteki rehberler 47'den.
   `components/marketing/Shell.tsx`: footer artık bütün rehberleri listeliyor.
2. **Sitemap ile indekslenebilir sayfalar uyuşmuyordu.** 11 "preview" tasarımın sayfası (`/designs/nocturne-lake-estate` …)
   `/designs`'tan link alıyor ve indekslenebilir. Ama `sitemapEntries` yalnız `live` tasarımları alıyordu.
   `lib/marketing/crawl.ts`: sitemap artık katalogdaki bütün tasarımları (`catalogDesigns`) listeliyor. llms.txt yine yalnız
   satın alınabilenleri listeliyor. Test: `tests/marketing-crawl.test.ts`.

## 4. Yapılmayanlar / açık

- Canlı site denetimi (bulut ağı bkestudio.com'a ulaşamıyor): HTTPS, `www` → kök yönlendirmesi, güvenlik başlıkları,
  Vercel bot koruması (#4).
- Anahtar kelime hacmi / rakip SERP verisi: DataForSEO, Ahrefs ya da Google Ads anahtarı yok (Ahrefs bağlayıcısı bu
  oturumda bağlanamadı).
- GSC / GA4 / Bing Webmaster: hesap yok ya da bu oturumda bağlı değil.
