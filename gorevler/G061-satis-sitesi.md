---
id: G061
baslik: Satış websitesi — anlatan, satışa yönlendiren, SEO/GEO/AEO'da en üst düzey
rol: claude-kod
durum: inceleme
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

**Durum:** satış sitesi kodu bitti ve yerelde test edildi. **Yayınlanmadı.** Site `launched: false` ile duruyor: her sayfa
`noindex`, sitemap boş. Marka, alan adı, fiyat ve destek e-postası açık yer tutucu (`[BRAND]`, `[DOMAIN]`, `[PRICE]`,
`[SUPPORT EMAIL]` …). Bunlar tek dosyada: `platform/lib/marketing/config.ts`. Tasarım belgesi `docs/14_SATIS_SITESI.md`;
kod aşamasının durumu §14'te.

**Yapılanlar:**
- **Sayfalar:** `platform/app/(marketing)/` altında 18 statik sayfa:
  - ana sayfa: dokununca açılan canlı zarf demosu, tasarım çipleri;
  - tasarım galerisi ve 2 tasarım sayfası (sessiz açılış videosu, 4 gerçek ekran, değişen ve sabit kalanlar, dahil olan ve olmayanlar, SSS, telefonda yapışkan "Live demo / Etsy" çubuğu);
  - how it works, features (Canva karşılaştırması rakip adı içermiyor), pricing, SSS (30 soru), rehber dizini ve 6 tam rehber, about, contact, privacy (taslak);
  - pazarlama 404'ü;
  - robots.txt, sitemap.xml, llms.txt ve llms-full.txt route'ları.
- **Etsy düğmeleri:** config'teki Share & Save linkine gider. Link yer tutucuyken düğme "Coming soon on Etsy" yazar ve link değildir, böylece kırık link yayınlanmaz. Fiyat yalnız gerçek değer girildiğinde görünür; /pricing'de yer tutucu olarak görünür.
- **Rehberler (`platform/content/guides/`):**
  - Konular: how to make, what to put, when to send + RSVP deadline, wording (40+ özgün örnek), digital etiquette, Canva vs hosted.
  - Her biri 1.250–1.470 kelime; hızlı yanıt, tablo veya kontrol listesi ve 4 soruluk SSS içeriyor.
  - Kaynaklar Emily Post Institute ve Canva Help Centre. Uydurma istatistik, yorum ya da yazar yok.
- **SEO/GEO/AEO:**
  - Mutlak canonical, Open Graph ve Twitter kartları.
  - JSON-LD: Organization, WebSite, WebPage, Product, VideoObject, Article, BreadcrumbList, ItemList, FAQPage. Product'ta Offer yalnız gerçek fiyat ve Etsy linkiyle yazılır; yer tutucular JSON-LD'ye hiç yazılmaz; puan ve yorum işaretlemesi yok.
  - robots dosyası `/start`'ı çift slug'larını kapatmadan engelliyor. Arama ve asistan botları açık; eğitim botları config'ten yönetiliyor.
  - llms.txt'deki her link sitemap'te var.
- **Görseller:**
  - Yalnız gerçek tema ve panel ekranları kullanıldı: G059 çekiminden 320/480/640 WebP, gerçek açılış kaydından 10 sn H.264 klip (~350 KB).
  - Betik: `platform/scripts/marketing-assets.ts`. GPT görseli üretilmedi; kodla dekor çizilmedi.
  - Arayüz ikonları `lucide-react@1.46.0`, G060 ile aynı sürüm.
- **Çakışma koruması:** `lib/slug.ts` `RESERVED_SLUGS`'a docs/14 §5.4'teki adlar eklendi (`marketing`, `llms.txt` vb. dahil). `tests/marketing-slug.test.ts` `app/` ve `public/` altındaki her ilk segmentin ayrılmış olduğunu klasörlerden okuyarak denetliyor.
- **Geçici ana sayfa:** `app/page.tsx` silindi; yeni ana sayfa onun yerine geçti.

**Test edildi** (yerel production build; sayılar `platform/previews/g061/checks.json` ve `lighthouse.json` içinde):
- **Birim testleri:** `npm test` 329/329 geçti (299 eski + 30 yeni). Yeni testler şunları denetliyor:
  - config ve yayın kapısı;
  - içerik kuralları: başlık ≤ 60 (12 karakterlik marka adıyla da), açıklama 120–160, SSS 40–80 kelime, rehber şartları;
  - yasaklı iddialar;
  - JSON-LD doğrulayıcısı;
  - robots eşleştirici, sitemap ve llms;
  - Markdown;
  - build çıktısı: tek H1, canonical, noindex, JSON-LD'deki metnin sayfada görünmesi, iç linkler ve çapalar, alt metin, yetim sayfa.
- **Diğer kontroller:** `npm run typecheck` ve `npm run build` temiz; trace-check geçti.
- **Tarayıcı (`tests/marketing-browser.ts`, Playwright):** 170/170 geçti.
  - Sayfalar 390 ve 1280 px'te denendi: yatay taşma yok, kesilen öğe yok.
  - Demo cephesi: dokunmadan önce tema isteği yok; telefonda modal açılıyor, Esc ve odak dönüşü çalışıyor; masaüstünde demo yerinde açılıyor.
  - Menü, SSS, çipler ve yapışkan çubuk çalışıyor.
- **Lab ölçümü** (CPU 4×, yavaş 4G, 390 px):

  | Sayfa | LCP | CLS | Aktarılan |
  |---|---|---|---|
  | Ana sayfa | 1,74 s | 0 | 300 KB |
  | Tasarım sayfası | 1,73 s | 0 | 300 KB |
  | Rehber | 0,82 s | 0 | 198 KB |

- **Lighthouse 13.5.0** (mobil):

  | Sayfa | Performans | Erişilebilirlik | En iyi uygulamalar | SEO |
  |---|---|---|---|---|
  | Ana sayfa | 93 | 100 | 100 | 69 |
  | Tasarım | 96 | 100 | 100 | 69 |
  | Rehber | 88 | 100 | 100 | 66 |
  | SSS | 97 | 100 | 100 | 66 |

  SEO'daki tek kusur bilerek konan `noindex`.

**Test edilmedi / eksik:**
- Canlı yayın yapılmadı.
- Google Rich Results Test ve schema.org doğrulayıcısı kullanılmadı. Doğrulama yalnız yerel testle yapıldı.
- Gerçek telefonda deneme yapılmadı.
- Etsy linkleri yer tutucu.
- Vercel Analytics bağlanmadı (`provider: 'none'`).
- İlk yük JS'i 139 KB; bütçe 130 KB'tı. Fark Next ve React çalışma zamanından geliyor.
- Panel ekranları bugünkü panelden alındı. G060 bitince `node scripts/marketing-assets.ts` yeniden çalıştırılmalı.

**`yazar:` dışında dokunulan dosyalar** (hepsi docs/14 §13.3 listesinde vardı):
- `platform/app/page.tsx` (silindi)
- `platform/lib/slug.ts`
- `platform/scripts/marketing-assets.ts`
- `platform/package.json` ve `package-lock.json` (`lucide-react@1.46.0`)
- `platform/previews/g061/`

`app/layout.tsx`, `next.config.ts` ve `tools/` değişmedi. `lib/site/render.ts` kod aşamasında değişmedi; inceleme
düzeltmesinde çift sitelerine `noindex` eklendi (Günlük'e bakın).

**GPT görselleri:** 17 prompt, 4 paralel ajana bölünmüş hâlde `docs/14` Ek A'da.
- Kayıt yolu: `platform/public/marketing/gpt/...`
- Site bunlar olmadan da tam çalışıyor.
- Görseller gelince birleştirme adımı (`--hole` ve hero sahneleri) ayrı görev olmalı.

**Önerilen görevler (entegratör açar):**
1. GPT pazarlama görsellerini birleştir ve hero'ya bağla: `tools/mockup_compose.py --hole`, `scripts/marketing-assets.ts`.
2. G060 bittikten sonra panel ekranlarını yeniden çek ve `verified.editRights/archive` alanlarını true yap.
3. `next.config.ts`'e `experimental.inlineCss` ekle; render-blocking CSS'i kaldırır, Lighthouse LCP'sini düşürür.
4. Çift siteleri için `noindex` ve "Made with [BRAND]" alt bilgisi (karar 4–5).

**K26 ile ilişki (merge sırasında görüldü):** çalışma adı *BKE Studio* (kesin onay bekliyor). Bu yüzden config'te hâlâ
`[BRAND]` yazıyor; onay gelince tek satırla değişir. K26'ya göre alan adı şimdilik alınmayacak. Bu durumda yayın kapısı
indekslemeyi kapalı tutar, çünkü `siteUrl` marka alan adı olmalı (docs/14 §9.3: vercel.app'te birikmiş SEO taşınamaz).
Kullanıcı vercel.app üzerinde indekslemeyi açmayı seçerse bu kural `placeholders.ts` içinde bilerek değiştirilmeli. Fiyat
önerisi düz $29.40 (docs/15 §0); `compareAtPrice: null` zaten varsayılan.

**Kullanıcı kararları** (docs/14 §13.4):
1. Marka ve alan adı.
2. Tasarım başına fiyat.
3. Destek e-postası ve yanıt süresi.
4. Çift siteleri arama motorlarında görünsün mü (öneri: hayır).
5. "Made with [BRAND]" alt bilgisi olsun mu.
6. Eğitim botları (öneri: açık).
7. Analitik aracı (öneri: Vercel Web Analytics).
8. İade, kayıp link, 12 ay sonrası ve silme metinleri.

## Günlük
- 2026-10-14 alindi: wf-hiz
- 2026-10-14 kod aşaması bitti: satış sitesi (app/(marketing)), 6 rehber, testler, previews/g061 (wf-hiz)
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 inceleme düzeltmesi (wf-hiz): kurulum sihirbazı 5. adımda örnek metin kalınca birincil düğme "Fix N items", ikincil "Publish anyway"; 6. adımda (yayın anı) örnek metin listesi sayısıyla; Home'da "Your website is live — N things are still sample text"; yayın ekranında "Copied" + duyurulan durum satırı (snackbar "Go to my editor"ın üstüne biniyordu), adres link oldu, "Open website" eklendi. robots: eğitim botları yalnız pazarlama yollarına (`$`/`/` biçimi, çift slug'ları kapalı), yayındaki çift sitelerine `X-Robots-Tag: noindex` (karar 4 gelene kadar), robots yorumu düzeltildi. Ana sayfa title/H1/meta §2.1 kümesine göre. SSS: "Why pay … free wedding websites" (rakip adı yok) ve "show up on Google?" yanıtı gerçek davranışa göre. Organization `alternateName` = Etsy dükkân adı (gerçek değer girilince). Atlananlar: marka adı/logo (K27 kesin onayı ve PROJECT_STATE `undecided` sürüyor), sihirbazda zorunlu onay kutusu (G060-fix D "sample date block" ile çakışır), rakip adları ve "free vs buy once" rehberi (birincil kaynağa bu ortamdan erişilemedi). Birleştirmede GM02'nin `public/brand/` klasörü slug testini kırdı: `brand` ayrılmış slug yapıldı, eğitim botlarına da açıldı. Test (origin/main ile birleştikten sonra): npm test 412/412, typecheck, build + trace-check, marketing-browser 170/170, g060-browser 113/113; panel-browser 75/75 (birleştirmeden önce)
