# Satış sitesi: tasarım belgesi (G061, 2026-10-14)

Kullanıcının isteği (K25): ürünü en iyi anlatan, satışa götüren, arama motorlarında ve yapay zekâ asistanlarında
kendiliğinden bulunan ve tavsiye edilen bir satış sitesi. Bu belge **yalnız tasarım aşamasıdır**; kod yazılmadı, hiçbir
şey yayınlanmadı. Uygulama G061'in ikinci aşamasıdır (§13); kod aşamasının durumu §14'te.

Belge bu sırayla okunur: araştırma (§1–3) → konumlandırma (§4) → bilgi mimarisi (§5) → sayfa planları (§6) → dönüşüm (§7)
→ şema (§8) → teknik plan (§9) → tek yapılandırma (§10) → ölçüm (§11) → GPT görselleri (§12) → uygulama sırası ve açık
kararlar (§13).

**Kurallar** (AGENTS.md, K21, K25):
- Ürün metni İngilizce.
- Marka adı, alan adı, fiyat ve destek e-postası **karar verilmedi**. Hepsi tek config'te açık yer tutucu olarak durur:
  `[BRAND]`, `[DOMAIN]`, `[PRICE]`, `[SUPPORT EMAIL]` …
- Yasal kimlik yok (K25).
- Özellik ve iddia uydurulmaz. Doğrulanmamış iddia `[VERIFY: …]` işaretini taşır.
- Görsel olarak yalnız GPT görselleri ve gerçek tema ekranları kullanılır; kodla dekor çizilmez. Sitenin arayüzü (boşluk,
  tipografi, renk, sürümü sabitlenmiş ikon kütüphanesi) serbesttir.
- Tarih biçimi `June 12, 2027` (US) / `12 June 2027` (UK).

**Ürünün bugünkü hâli** (G049, 2026-10-14): canlı adres `https://davetiye-platform-five.vercel.app`, production = main
`59b1291`, `live-check` 41/41. Canlıda iki tema var: `blush-garden-rose` (03) ve `olive-ivory` (01). Demolar
`/start/demo/<tema>` adresinde. Örnek çift sitesi `/clara-and-julian`. Tema 04 `vintage-airmail-love-letter` (G404)
yapım aşamasında. Bu oturumdan canlı adrese erişilemedi (proxy reddi), canlı durum G049 kaydından alındı.

---

## 0. Özet

1. **Konum:** "Gerçek bir davetiye gibi açılan düğün siteleri." Misafir mühürlü bir zarfa dokunur, zarf açılır, dört
   sayfalı site (Home, Our Story, Details, RSVP) gelir. Çift siteyi telefondan düzenler. RSVP içinde gelir. Ödeme tek
   seferdir ve Etsy'den yapılır. Canva gerekmez. Rakiplerin üç kümesi ve aradaki boşluk §3'te.
2. **2026'da arama değişti.**
   - Google FAQ zengin sonuçlarını **7 Mayıs 2026'da kaldırdı**. HowTo zengin sonuçları 2023'te gitmişti.
   - Google'ın Mayıs 2026 rehberi yapay zekâ için optimizasyonu "hâlâ SEO" diye tanımlıyor: `llms.txt` Google Search'te
     **yok sayılıyor**, içeriği parçalara bölmek gerekmiyor.
   - ChatGPT araması OAI-SearchBot ile Bing dizinine, Claude araması Claude-SearchBot'a, Copilot Bing'e dayanıyor. Bing'in
     AI Performance raporu Şubat 2026'dan beri var.
   - Sonuç: güçlü teknik SEO, açık varlık (entity) tutarlılığı, alıntılanabilir ve cevabı başta veren içerik, botlara açık
     robots ayarları ve site dışı bahsedilme. `llms.txt` ucuz olduğu için eklenir ama Google için değil.
3. **Bilgi mimarisi:** 12 sayfa türü (§5) ve 6 rehber özeti (§6.12). Ana sayfada canlı zarf demosu var. Bu demo
   yalnız dokununca yüklenir ("cephe" deseni), böylece Core Web Vitals'a zarar vermez.
4. **Şema:** her sayfada Organization + WebSite. Tasarım sayfalarında Product (product snippet) var. Offer **yalnız fiyat
   girildiğinde** üretilir. Rehberlerde Article, her yerde BreadcrumbList. Etsy yorumları AggregateRating olarak
   **işaretlenmez**, çünkü Google başka sitelerden puan toplamayı yasaklıyor.
5. **Teknik:** Next.js 16 App Router `app/(marketing)/` altında, statik üretimle. Sitemap, robots, `llms.txt` ve
   `llms-full.txt` route handler olarak `(marketing)` içinde. Tek config dosyası `lib/marketing/config.ts`.
   `launched=false` iken site `noindex` kalır ve bütün yer tutucular görünür durur.
6. **Uygulamayı engelleyen dosya izinleri:** `app/page.tsx` silinmeli ve `lib/slug.ts`'e yeni ayrılmış slug'lar eklenmeli.
   İkisi de G061'in `yazar:` listesinde yok (§13.3).
7. **Kullanıcı kararı gereken 3 kritik nokta:**
   - Marka adı ve alan adı. Belirlenmeden indekslemeyi açmayın; vercel.app adresinde biriken SEO taşınamaz.
   - Çift sitelerinin arama motorlarında görünüp görünmeyeceği. Öneri: varsayılan `noindex`.
   - Çift sitelerinin altına küçük bir "Made with [BRAND]" bağlantısı konup konmayacağı.
8. **GPT görselleri:** 17 prompt, 4 paralel ajana bölündü (§12): telefon çerçevesi, sahneler, dokular, küçük nesne
   görselleri, rehber kapakları. Ürünün kendisi her yerde gerçek tema ekranlarıyla gösterilir.
9. **Diğer belgelerle uyum** (aynı gün yazıldılar):
   - **docs/15 (G062):** marka önerisi *Seal & Story* (karar değil); fiyat önerisi **düz $29.40** (lansman $24.50; kalıcı üstü çizili indirim yok, yalnız gerçek süreli kampanya — docs/15 risk 7 ve §0); K26: ad **BKE Studio** (çalışma adı, kesin onay bekliyor);
     Etsy düğmeleri **Share & Save** linki; her misafir sayfasında "Made with [BRAND]"; doğrudan satış için Stripe yerine
     MoR (Paddle/Gumroad), Faz 2.
   - **docs/16 (G060):** yayından sonra isim ve tarih için **3 değişiklik**, ≤ 2 karakterlik yazım düzeltmesi bedava; site
     düğünden 12 ay sonra arşive geçer.
   - Bu belgedeki metin ve config o kararları tek yerden okur. Karar değişirse yalnız `config.ts` değişir.

---

## 1. Araştırma: 2026'nın teknik SEO, GEO ve AEO durumu

Tarih: 2026-10-14. Google ve Etsy sayfaları bu ortamdan doğrudan açılamadı (DNS/proxy reddi). Aşağıdakiler arama
sonuçlarındaki birincil kaynak alıntılarından (developers.google.com, Anthropic yardım sayfası, Etsy politika sayfası)
ve ikincil haberlerden derlendi. Her kaynak §1.5'te listeli. Yayından önce birincil sayfalar yeniden kontrol edilir.

### 1.1 Teknik SEO: neler değişti, neler aynı

| Konu | Durum (2026-10) | Bizim için sonuç |
|---|---|---|
| **FAQ zengin sonucu** | 2023'ten beri yalnız devlet ve sağlık siteleri görebiliyordu. **7 Mayıs 2026'da Google Search'ten kaldırıldı.** Search Console raporu ve Rich Results Test desteği Haziran 2026'da, API desteği Ağustos 2026'da kalkıyor. Var olan işaretleme zarar vermez. | SSS içeriği yine yazılır (AEO ve kullanıcı için). `FAQPage` JSON-LD isteğe bağlıdır, düşük önceliklidir, görünen metinle birebir aynı olmalıdır. Google'da yıldızlı ya da açılır sonuç beklenmez. |
| **HowTo zengin sonucu** | 2023'te kaldırıldı. | "How it works" düz sıralı liste olarak yazılır. `HowTo` JSON-LD isteğe bağlıdır ve Google'da etkisi yoktur. |
| **Sadeleştirme dalgası** | Haziran 2025 ve Kasım 2025 duyurularıyla Book Actions, Course Info, ClaimReview, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing kaldırıldı. Ocak 2026'da Practice Problem ve Dataset de çıktı. Sitelinks arama kutusu 2024'te gitti. | Yalnız desteklenen ve işe yarayan türler kullanılır: Organization, WebSite (site adı), Product, Article, BreadcrumbList, VideoObject. Mobilde breadcrumb Ocak 2025'ten beri gösterilmiyor, masaüstünde sürüyor. |
| **Product: snippet ile merchant listing farkı** | Ürünün o sayfadan satın alınamadığı sayfalar için **product snippet** kullanılır (Offer veya AggregateOffer kabul eder). Satın almanın sayfada olduğu durum için **merchant listing** kullanılır (satıcı biz olmalıyız, fiyat > 0, para birimi zorunlu). | Satış Etsy'de olduğu için tasarım sayfaları **product snippet**'tir. Offer'ın `url`'si Etsy ilanına gider. Doğrudan ödeme (Stripe) gelince merchant listing'e geçilir (§7.4). |
| **Yorum ve puan** | Başka sitelerden yorum veya puan toplamak yasak. Kendi hakkında kendi sitesinde yorum gösteren işletmeler (Organization, LocalBusiness) yıldız alamaz. Temmuz 2026'da sahte ve teşvikli yorum kuralı eklendi. | Etsy yorumları `aggregateRating` olarak işaretlenmez. İleride gerçek alıcı yorumları **izinle** düz metin olarak gösterilebilir (işaretlemesiz). |
| **Site adı** | Ana sayfadaki `WebSite` JSON-LD (`name`, isteğe bağlı `alternateName`) kullanılır. Organization'da da aynı ad olmalı. Alan adı başına tek site adı var. | Marka kararından sonra `WebSite.name` = `[BRAND]`. Etsy dükkânı, sosyal profiller ve `llms.txt` aynı adı ve aynı tek cümlelik tanımı taşır (§4.6). |
| **Core Web Vitals** | Eşikler değişmedi: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, gerçek kullanıcı verisinin 75. yüzdeliğinde. INP, Mart 2024'te FID'in yerini aldı. "LCP 2 s'ye indi" söylentisi doğrulanmadı. | Bütçe §9.8'de. Canlı demo cephe arkasında yüklenir, LCP görseli ön yüklenir, fontlar `next/font` ile kendi sunucumuzdan gelir. |
| **Yapay zekâ ile üretilmiş içerik** | Google, değer katmadan yapay zekâyla çok sayfa üretmeyi "ölçekli içerik istismarı" sayıyor. Yayından önce elle doğruluk kontrolü öneriyor. | Rehberler az ve özgün olur: 6 rehberle açılır, sonra ayda 2. Her rehberde özgün tablo veya kontrol listesi bulunur, hepsi elle gözden geçirilir. Kurgu yazar kişi yok (§8.4). |

### 1.2 GEO: üretken arama motorları kaynağı nasıl seçiyor

| Motor | Kaynağı nereden alıyor | Bizim yapacağımız |
|---|---|---|
| **Google AI Overviews / AI Mode** | Normal Google dizini. Ek teknik şart yok, sayfanın dizinde olup snippet'e uygun olması yeter. Google'ın Mayıs 2026 rehberine göre: `llms.txt` yok sayılıyor; içeriği bölmek gerekmiyor; yapay zekâ özellikleri için yapılandırılmış veri gerekmiyor ama zengin sonuç için faydalı. `Google-Extended` jetonu Search'ü etkilemez; Gemini eğitimi ve Search dışı temellendirme içindir. | Klasik SEO: dizine girme, özgün içerik, iyi sayfa deneyimi. Snippet'i kısıtlayan `nosnippet` ya da `max-snippet` **kullanılmaz**. |
| **ChatGPT araması** | **OAI-SearchBot** erişimi ve **Bing dizini** gerekiyor (ikincil kaynaklar). GPTBot eğitim içindir ve aramayı etkilemez. robots değişikliğinin yansıması yaklaşık 24 saat sürer. | robots'ta OAI-SearchBot ve ChatGPT-User açık. Bing Webmaster Tools ve IndexNow kurulur. |
| **ChatGPT alışveriş / Etsy** | Eylül 2025'ten beri ABD'li Etsy satıcıları ChatGPT içinde satın alınabiliyor (Instant Checkout). OpenAI'ın ürün sıralama ölçütleri: stok, fiyat, kalite, birincil satıcı olmak, Instant Checkout. Etsy'nin Mayıs 2026'da ChatGPT uygulaması açtığı **tek bir satıcı blogunda** geçiyor, doğrulanmadı. | Asistanlar ürünü **Etsy ilanından** önerebilir. Bu yüzden ilan metni, nitelikler ve yorumlar (G7NN/G062) satış sitesi kadar önemli. Ürün adı ve tanımı ilanla birebir aynı olmalı. |
| **Claude araması** | Üç ayrı jeton var: **ClaudeBot** eğitim içindir. **Claude-SearchBot** arama dizini içindir; kapatmak görünürlüğü azaltır. **Claude-User** kullanıcının sorusu üzerine sayfa getirir. Hepsi robots'a uyar, Crawl-delay destekler. | Claude-SearchBot ve Claude-User açık. ClaudeBot için karar §13.4'te. |
| **Perplexity** | PerplexityBot (dizin) ve Perplexity-User (kullanıcı isteği). | İkisi de açık. |
| **Microsoft Copilot / Bing** | Bing dizini. Bing Webmaster Tools'ta **AI Performance** raporu var (Şubat 2026'dan beri herkese açık önizleme): toplam alıntı, alıntılanan sayfalar, temellendirme sorguları. | Bing WMT, AI Performance raporu ve IndexNow kurulur. Bu rapor alıntıyı ölçebildiğimiz tek birinci taraf kaynak (§11). |

**Hangi içerik alıntılanıyor.** GEO makalesinde (Aggarwal ve ark., KDD 2024, arXiv 2311.09735) kaynak gösterme, alıntı
ekleme ve istatistik ekleme, kendi test kümelerinde görünürlüğü %40'a kadar artırdı. Anahtar kelime doldurmak işe
yaramadı. **Sınır:** deney sabit bir kaynak kümesinde yapıldı; canlı motorlarda yeni URL'nin keşfedilmesini kanıtlamıyor.
Satıcı bloglarındaki "%28 artış" gibi sayılar doğrulanmamış. Burada kullandığımız ilkeler hem Google'ın yazdıklarıyla hem
GEO bulgularıyla uyumlu olanlar:

1. **Kendi başına anlaşılır pasajlar.** Her bölüm bir soruya cevap verir. İlk cümle cevabın kendisidir. Doğrulanabilir
   gerçekler içerir: sayılar ve sınırlar ("up to 3 custom RSVP questions", "up to 10 schedule rows").
2. **Varlık tutarlılığı.** Tek ad ve tek tanım; Organization `sameAs` ile Etsy dükkânı ve sosyal profiller; her yerde aynı
   fiyat ve aynı özellik listesi. Asistanların yanlış fiyat ya da özellik söylemesini önlemenin yolu, tek ve tutarlı bir
   doğru kaynak sunmaktır.
3. **"Neler dahil, neler değil" açıkça yazılır.** Asistanlar karşılaştırma sorularında bu listeleri alıntılıyor. Dürüst bir
   "not included" listesi, asistanın uydurmasını da azaltır.
4. **Özgün veri ve araçlar.** Kontrol listeleri, zaman çizelgesi tabloları, kendi yazdığımız metin örnekleri. İleride kendi
   anonim toplam verilerimiz olabilir (ör. RSVP'lerin son tarihe göre dağılımı), ama **yalnız gerçek veri birikince** ve
   gizlilik metnine uygun olarak.
5. **Dış kaynağa atıf.** Rehberlerde görgü kuralı ve zamanlama iddiaları güvenilir kaynaklara bağlanır. Kaynaksız
   istatistik yazılmaz.
6. **Site dışı bahsedilme.** Asistanlar "en iyi …" listelerini, Reddit'i, Pinterest'i ve Etsy'yi alıntılıyor.
   - Pinterest'in 2026 düğün raporuna göre bir yılda 7 milyardan fazla düğün araması yapıldı; "plum and olive wedding"
     aramaları %1.380 arttı. Bu, Olive & Ivory için doğrudan fırsat.
   - Zola'nın 2026 raporuna göre çiftlerin %77'si Pinterest kullanıyor (şirketin kendi raporu, yön gösterici kabul edilmeli).
   - Spam yapılmaz. Tanıtım planı G062 ile birlikte yürür.
7. **Tazelik.** Her sayfada "Last updated" tarihi bulunur. Sitemap'teki `lastmod` gerçek değişiklik tarihidir.

### 1.3 AEO: yanıt motorları için yazım kuralları

- Soru biçiminde başlık (H2/H3) kullanılır, altındaki **ilk cümle 25 kelimeyi geçmeden** cevabı verir, ayrıntı sonra gelir.
  SSS yanıtları 40–80 kelimedir.
- Tanım paragrafı: her ana sayfanın başında "[BRAND] nedir?" sorusunu tek paragrafta cevaplayan metin bulunur. Bu metin
  `llms.txt` ve Organization açıklamasıyla aynı özü taşır (§4.6).
- Karşılaştırma ve sınırlar tablo olarak verilir. Sayılar metinde yazılır, görselin içine konmaz.
- Adımlar numaralı liste olarak verilir: zaman ifadesi, ne yapılacağı ve sonuç.
- Bir terim her yerde aynıdır: hep "edit link", hep "RSVP", hep "wedding website". "Site", "page" ve "invite" karışık
  kullanılmaz.

### 1.4 Bu araştırmanın sınırları

- Google ve Etsy'nin kendi sayfaları açılamadı. Tarihler ve kurallar arama alıntılarından alındı (developers.google.com
  sonuçları birincil kaynaktır).
- Anahtar kelime hacmi için ücretli araç ve otomatik tamamlama erişimi yoktu. §2'deki rakamlar tahmindir.
- SERP gözlemi yapılamadı. Rekabet tahminleri sektör bilgisine ve docs/13'e dayanıyor.
- Yayından sonra Search Console ve Bing WMT verisiyle §2 yeniden kalibre edilir.

### 1.5 Kaynaklar

Birincil (developers.google.com ve diğer resmi sayfalar):
- [FAQPage structured data: kullanımdan kaldırma notu](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Changes to HowTo and FAQ rich results (2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Simplifying the search results page (2025-06)](https://developers.google.com/search/blog/2025/06/simplifying-search-results)
- [Update on our efforts (2025-11)](https://developers.google.com/search/blog/2025/11/update-on-our-efforts)
- [Search documentation updates](https://developers.google.com/search/updates)
- [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [A new resource for optimizing (2026-05)](https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing)
- [Generative AI content guidance](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- [Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Product snippet](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Merchant listing](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [Making review rich results more helpful (self-serving, 2019)](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Simplifying breadcrumbs (2025-01)](https://developers.google.com/search/blog/2025/01/simplifying-breadcrumbs)
- [Anthropic crawler'ları (ClaudeBot, Claude-SearchBot, Claude-User)](https://support.anthropic.com/en/articles/8896518)
- [Etsy: off-platform transactions](https://www.etsy.com/legal/policy/off-platform-transactions/1254654515806)
- [Next.js metadata files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Next.js metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

İkincil (yön gösterici, doğrulanmamış rakamlar içerebilir):
- [SEJ: Google'ın rehberi AEO/GEO'yu "still SEO" sayıyor](https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/)
- [ppc.land: FAQ rich results kaldırıldı](https://ppc.land/google-kills-faq-rich-results-what-seos-saw-coming-since-2019/)
- [Rank Math: ChatGPT aramasında dizine girmek](https://rankmath.com/kb/indexing-in-chatgpt-search/)
- [Search Influence: Bing AI Performance raporu](https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/)
- [Koozai: Bing AI Performance](https://www.koozai.com/blog/search-marketing/bing-webmaster-tools-launches-ai-performance-reporting/)
- [Presenc: State of llms.txt 2026 (satıcı raporu)](https://presenc.ai/research/state-of-llms-txt-2026)
- [Search Engine Land: ChatGPT Instant Checkout](https://searchengineland.com/openai-chatgpt-instant-checkout-462727)
- [Novadata: Etsy ChatGPT uygulaması (tek kaynak)](https://novadata.io/resources/news/etsy-chatgpt-app-launch-may-2026)
- [eCommerceBytes: Etsy dış link açıklaması (eski)](https://www.ecommercebytes.com/?p=6938)
- [RankHero: wedding invitation website](https://www.rankhero.com/keywords/wedding-invitation-website)
- [RankHero: digital invitations](https://www.rankhero.com/keywords/digital-invitations)
- [RankHero: digital wedding website](https://www.rankhero.com/keywords/digital-wedding-website)
- [RankHero: wedding invitations](https://www.rankhero.com/keywords/wedding-invitations)
- [Social Media Today: Pinterest 2026 düğün trendleri](https://www.socialmediatoday.com/news/pinterest-releases-2026-wedding-trends-report/818774/)
- [Zola First Look 2026](https://welcome.zola.com/the-first-look-report-2026/)
- [Paperlust: wedding website builders compared](https://paperlust.co/blog/wedding-website-builders-compared/)
- [Greenvelope: animated envelope invitations](https://bridalmusings.greenvelope.com/resources/animated-envelope-invitations)
- [Greenvelope: are digital invitations tacky](https://card.greenvelope.com/resources/are-digital-wedding-invitations-tacky)
- GEO makalesi: Aggarwal ve ark., "GEO: Generative Engine Optimization", KDD 2024, [arXiv:2311.09735](https://arxiv.org/abs/2311.09735)

---

## 2. Anahtar kelime araştırması (tahmini; ücretli araç yok)

**Yöntem:**
- RankHero'nun 2026 tahminleri kullanıldı. Bu bir Etsy satıcı aracıdır; rakamlar küresel ve yaklaşıktır.
- docs/13'teki Etsy arama dili ve ilan başlıkları kullanıldı.
- Pinterest 2026 raporu kullanıldı.
- Rekabet, sonuç sayfasını kimlerin tuttuğuna dair sektör bilgisiyle tahmin edildi (Google gözlemi yapılamadı).
- Hacim kademeleri: **ÇY** çok yüksek (>50k/ay), **Y** yüksek (10–50k), **O** orta (1–10k), **D** düşük (100–1k), **ÇD** çok
  düşük (<100). Kademeler tahmindir.
- Yayından 60 gün sonra Search Console ve Bing WMT ile düzeltilir.

**Strateji:** baş terimlerde ("wedding website") rekabet etmek gerçekçi değil. The Knot, Zola, Joy ve Minted ücretsiz araç
sunuyor ve alan adı otoriteleri çok yüksek. Hedef, satın alma niyeti yüksek uzun kuyruk aramalar: zarf açılışı, şablon
kelimesi, stil ve renk, "no Canva", telefondan düzenleme. Bilgi aramaları rehberlerle karşılanır.

### 2.1 Kümeler

| Küme | Anahtar kelime (örnekler) | Niyet | Hacim (tahmin) | Rekabet / sonuçları kimin tuttuğu | Hedef sayfa |
|---|---|---|---|---|---|
| A · Kategori | wedding website | karışık (çoğu ücretsiz araç arıyor) | ÇY | çok yüksek: Knot, Zola, Joy, Minted, Squarespace | home (ikincil hedef) |
| A | wedding invitation website | ticari | O (RankHero ≈ 8.1k küresel, %30 ABD) | orta-yüksek | home |
| A | digital wedding invitation(s) / digital invitations | ticari | Y ("digital invitations" ≈ 35k, yıllık +%23) | yüksek: Greenvelope, Paperless Post, Etsy, Canva | home, guide 5 |
| A | digital wedding invitation website / digital wedding website | ticari | ÇD–D ("digital wedding website" ≈ 40) | düşük | home |
| A | wedding website template · …with RSVP | ticari (Etsy dili) | O | Etsy, Canva, Squarespace şablonları | /designs |
| B · Zarf / açılış | envelope wedding website · envelope opening wedding invitation · animated envelope invitation | ticari, çok niyetli | D–O | Etsy ilanları, Greenvelope | home (H1), /designs, tasarım sayfaları |
| B | tap to open wedding invitation · click to open wedding invitation · wax seal wedding website | ticari (Etsy dili, docs/13 §3) | D | Etsy | tasarım sayfaları |
| C · Stil | olive wedding website · olive green wedding invitation · plum and olive wedding | ilham + ticari | O, yükselişte (Pinterest +%1.380) | Pinterest, Etsy | /designs/olive-ivory |
| C | blush floral wedding website · pink garden rose wedding invitation | ilham + ticari | D–O | Pinterest, Etsy | /designs/blush-garden-rose |
| C | vintage airmail wedding invitation · love letter wedding invitation | ilham + ticari | D | Etsy | /designs/vintage-airmail-love-letter (yayına girince) |
| C | old money wedding website | ilham + ticari (Etsy'de en sık sıfat, docs/13 §2) | D–O | Etsy | ileride stil sayfası (≥ 4 uygun tasarım olunca) |
| D · Özellik | wedding website with RSVP · online RSVP for wedding · wedding RSVP website | ticari ve araştırma | O–Y | Knot, Zola, Joy | /features#rsvp |
| D | canva wedding website · canva wedding website template · wedding website without canva | karşılaştırma | O / D | Canva, Etsy | guide 6 |
| D | edit wedding website on phone · wedding website app | ticari | D–O | Joy, Zola uygulamaları | /features, guide 1 (biz uygulama **değiliz**: "no app to install") |
| D | wedding website one time payment · wedding website no subscription | ticari | ÇD–D | düşük | /pricing |
| D | add to calendar wedding invitation · wedding website QR code | ticari ve bilgi | D / O | karışık | /features, backlog rehberi |
| E · Bilgi | how to make a wedding website | bilgi | O | Knot, Zola blogları | guide 1 |
| E | what to put on a wedding website · wedding website checklist | bilgi | O | Knot, Zola, Brides | guide 2 |
| E | when to send wedding website · RSVP deadline for wedding | bilgi | O | Knot, Zola, Emily Post | guide 3 |
| E | wedding website wording · our story examples · wedding website welcome message | bilgi | O | Knot, Zola, Pinterest | guide 4 |
| E | are digital wedding invitations tacky · digital invitation etiquette | bilgi | D–O | Greenvelope, Paperless Post, Brides | guide 5 |
| E | wedding website FAQ examples · RSVP meal choice question · wedding website privacy | bilgi | D–O | Knot, Zola | backlog rehberleri |

### 2.2 Asistan sorgu seti (GEO ölçümü için, §11.3)

Aylık olarak elle sorulur. Sonuçlar "anıldı mı, hangi URL alıntılandı, hangi bilgi yanlış" sütunlarıyla kaydedilir:

1. best wedding website with an envelope opening animation
2. wedding website template I can edit on my phone
3. wedding website without Canva
4. elegant digital wedding invitation website with RSVP
5. olive green wedding website template
6. blush floral wedding website template
7. vintage airmail wedding invitation website *(04 yayına girince)*
8. one-time purchase wedding website, no subscription
9. how do I make a wedding website on my phone
10. what should I put on my wedding website
11. when should we send our wedding website to guests
12. wedding website wording examples for our story
13. are digital wedding invitations tacky
14. Etsy wedding website template that isn't Canva
15. wedding website with add to calendar for guests
16. wedding website RSVP with a meal choice question
17. [BRAND] reviews / is [BRAND] legit *(marka kararından sonra)*
18. [BRAND] vs Zola wedding website *(marka kararından sonra)*

---

## 3. Rakip konumlandırması

| Küme | Kimler | Model ve fiyat | Güçlü yanı | Boşluk (bizim alanımız) |
|---|---|---|---|---|
| **1 · Etsy Canva şablon satıcıları** (docs/13) | BrideToBeDesignCo, Templates4branding, Filterity, BestCelebrations … 30 ilanın 29'u | PDF içinde Canva şablon linki. Alıcı siteyi Canva'da düzenler ve `*.my.canva.site` adresinde yayınlar. RSVP Canva Forms ya da Google Forms ile. İndirimli satış medyanı ≈ $18, liste fiyatı medyanı ≈ $27, 81 ilanın 72'si sürekli indirimde. | Çok tasarım, zarf açılışı standart, büyük yorum sayıları | Canva bilgisi ve hesabı gerektirir. RSVP ayrı bir form aracına bağlı. Yorumlarda "talimat zor", "yavaş", "sabit öğeler", "renk değiştirmek zor" şikâyetleri var. Barındırılan site ve düzenleme paneli satan ilan yok. |
| **2 · Ücretsiz düğün platformları** | Zola, The Knot, Joy, Minted | Ücretsiz site, RSVP ve hediye listesi. Gelir hediye listesinden ve satıştan. Özel alan adı yıllık ≈ $18–20 (2026 ikincil kaynak). | Ücretsiz; hediye listesi ve planlama araçları güçlü | Genel şablonlar; "şov" anı yok. Asıl odakları hediye listesi ve planlama, tasarım değil. |
| **3 · Premium dijital davetiye servisleri** | Greenvelope, Paperless Post | E-posta ile animasyonlu zarf davetiyesi; misafir sayısına göre fiyat (Greenvelope 20 misafir $19 … 200 misafir $199; Paperless Post coin sistemi, ikincil kaynak) | Gerçek zarf hissi, misafir listesi yönetimi | Fiyat misafir sayısına göre artıyor. Zarf e-postada; site ayrı kalıyor. |

**Bizim konumumuz.** Zarf açılışı (küme 3'teki duygu) ve dört sayfalı site (küme 2'deki işlev) tek bir tasarım ürününde.
Fiyat Etsy'de bir kez ödenir; misafir sayısına bağlı değildir. Telefondan düzenlenir ve Canva gerekmez (küme 1'in
şikâyetlerine cevap).

**Yazmayacağımız iddialar.**
- Rakip isimleri sitede karşılaştırma tablosunda geçmez. Guide 6 "Canva template" kategorisini genel olarak anlatır,
  satıcı adı vermez.
- "Faster", "best", "#1", "loved by thousands" yazılmaz.
- "No ads" yazılmaz; rakiplerde reklam olduğunu doğrulamadık. Kendi sitemiz için yalnız gerçek olanı söyleriz: "No
  registry upsells or ads on your website" ifadesi, çift sitelerimizde reklam olmadığı **doğru olduğu sürece** kullanılır.
  "Made with" kararı §13.4'te.

---

## 4. Konumlandırma ve mesaj

### 4.1 Konumlandırma cümlesi (iç kullanım)

> Düğününü telefonundan planlayan ve misafirlerine unutulmaz bir ilk an yaşatmak isteyen çiftler için [BRAND],
> gerçek bir davetiye gibi açılan düğün sitesidir. Etsy'den bir kez satın alınır, telefondan düzenlenir, RSVP içindedir.
> Canva şablonlarından farkı: düzenleme aracı, barındırma ve RSVP tek yerde. Ücretsiz platformlardan farkı: her tasarım
> kendi zarf açılışını taşır.

### 4.2 Hedef kitle

- Birincil: ABD, Birleşik Krallık, Kanada ve Avustralya'da, 6–12 ay içinde evlenecek, Etsy ve Pinterest'te stil arayan,
  telefonu ana cihaz olarak kullanan çiftler (çoğunlukla gelin ya da planlamayı üstlenen kişi).
- İkincil: bu çiftlerin misafirleri. Ürünü ilk kez onlar görür ve bir sonraki çift olabilirler (§7.3).

### 4.3 Değer önerileri (yalnız doğru olanlar; kanıt §4.5)

1. **The opening moment.** "Your guests tap a sealed envelope and it opens into your wedding website." Her tasarımın
   açılışı kendine özgüdür.
2. **Edit from your phone.** Canva yok, uygulama yok. İsimler, tarih ve saat, mekân, program, hikâye, SSS ve fotoğraflar
   tek panelde. Yayınlamadan önce önizlenir.
3. **RSVPs built in.** Misafir sitede yanıtlar. Çift yanıtları ve sayıları panelde görür, CSV indirir. En çok 3 özel
   soru (ör. menü seçimi) eklenebilir.
4. **Guest-friendly details.** Takvime ekle (Apple/Outlook ve Google), harita, kalacak yer ve hediye listesi linkleri,
   SSS, isteğe bağlı geri sayım.
5. **One purchase on Etsy.** Abonelik yok. Site düğün tarihinden 12 ay sonrasına kadar yayında kalır (K25).
6. **Shares beautifully.** Bağlantı önizlemesinde çiftin isimleri ve tarih görünür. Panelden QR kodu (PNG/SVG) indirilir.

### 4.4 Ton ve kelimeler

- **Ton:** sıcak, net, kibar. Kısa cümleler. Abartı yok. Romantik ama açıklayıcı.
- **Kullan:** wedding website, envelope, opens, guests, RSVP, edit from your phone, live demo, one purchase, details.
- **Kullanma:** "template" (kategori kelimesi olarak sayfa adlarında ve rehberlerde geçebilir, ürün adı olarak değil),
  "app", "editable PNG", "unlimited", "forever", "best", "AI-powered", "hand-painted", "subscription", "hosting plan".
  - Tasarım görselleri GPT ile üretiliyor (K21), bu yüzden "hand-painted" yanlış olur. Doğrusu: "painterly artwork".
  - "subscription" ve "hosting plan" yerine docs/15'in ilan dili kullanılır: "digital wedding website template + instant
    access; online until 12 months after your wedding date". Site ve ilan aynı dili konuşur.
  - "Instant access" yalnız Etsy'deki erişim için kullanılır. Etsy dijital ürünlere kendi "Instant Download" etiketini
    koyuyor. Sitenin kendisi için "instant" denmez.

### 4.5 İddia listesi (sitede kullanım kuralı)

| İddia (İngilizce) | Durum | Sitede |
|---|---|---|
| No Canva, no app to install | Doğru (mimari) | Kullanılır |
| Edit from your phone | Panel 390 px Chromium mobil emülasyonunda test edildi; **gerçek iPhone ve Android'de denenmedi** (docs/05 §E) | "Designed for phone screens" kullanılır. "Tested on iPhone" `[VERIFY: real-device test]` olmadan yazılmaz |
| RSVP in your panel + CSV download | Yerelde ve canlıda test edildi (G042, G044) | Kullanılır |
| Up to 3 custom RSVP questions; FAQ up to 12; schedule up to 10 rows; 5 photo spots with crop | Şemada ve panelde (G051, G055) | Kullanılır. Sayılar §10'daki `facts`'ten gelir |
| Add to calendar (Apple/Outlook, Google) | G051; canlıda (G049 live-check `.ics`) | Kullanılır |
| Optional countdown | 01 ve 03 temalarında var (`data-optional="countdown"`) | Tema başına `facts`'te |
| Personal link preview (names + date) | G055; canlıda (og:image kontrolü) | Kullanılır |
| QR code download (PNG/SVG) | Panelde var; QR kamerayla okutulmadı | Kullanılır. Kılavuzda "scan before you print" uyarısı |
| Online until 12 months after your wedding date | **Politika kararı** (K25). Uygulaması G060'ta (arşiv) | `[VERIFY: G060 archive shipped]` |
| After publishing, names and date can be changed 3 times; small typo fixes (up to 2 letters or digits) are free | docs/16 §11 tasarımı; uygulama G060 | `[VERIFY: G060 shipped]`. Sayı config'ten; metin docs/16 §11.7 ile aynı |
| Edit link sent by email | **Yok** (e-posta sağlayıcısı yok) | Yazılmaz. Doğru ifade: "save your private edit link" |
| We verify your Etsy order | **Yok** (yalnız biçim kontrolü ve sipariş başına bir site) | Yazılmaz |
| Custom domain, music, change colors/fonts, password protection, guest email sending, multiple languages, printed invitations | Yok | "Not included" listesinde **açıkça** |
| Engagement / bridal shower / save the date | Şemada var, ürünü yok (G050 askıda) | Yazılmaz |
| Faster than … / best | Ölçülmedi | Yazılmaz |
| Artwork created with AI image tools, assembled and tested by us | Doğru (K21) | About ve SSS'te açıkça. Etsy kuralıyla tutarlı |

### 4.6 Tek varlık tanımı (her yerde aynı)

- **Kısa (≤ 160 karakter):** "[BRAND] makes wedding websites that open like a real invitation. Buy a design on Etsy, edit
  it on your phone and collect RSVPs online."
- **Uzun (tanım paragrafı):** "[BRAND] is a wedding website you buy once on Etsy. Your guests tap a sealed envelope that
  opens into your site: Home, Our Story, Details and RSVP. You edit names, date, venue, schedule, photos and RSVP
  questions from your phone, preview, and publish. Guest replies appear in your private panel and can be downloaded as a
  CSV. No Canva account or app is needed, and your website stays online until 12 months after your wedding date."
- Bu metinler: ana sayfa tanım paragrafı, Organization `description`, `llms.txt` özeti, Etsy dükkân "About", Pinterest,
  Instagram ve TikTok biyografileri. Hepsi §10 config'teki tek kaynaktan gelir.

---

## 5. Bilgi mimarisi ve URL haritası

### 5.1 Sayfalar

| URL | Sayfa | İndeks | Sitemap | Ana niyet / anahtar kelime | Şema |
|---|---|---|---|---|---|
| `/` | Ana sayfa (canlı zarf demosu) | ✓ | ✓ | envelope wedding website, wedding invitation website | Organization, WebSite, WebPage, ItemList (tasarımlar) |
| `/designs` | Tasarım galerisi | ✓ | ✓ | wedding website templates/designs | CollectionPage, ItemList, BreadcrumbList |
| `/designs/<tema-id>` | Tasarım sayfası (`blush-garden-rose`, `olive-ivory`, ileride `vintage-airmail-love-letter`) | ✓ (`status: live`) | ✓ | <stil> wedding website, envelope opening | Product (+Offer koşullu), VideoObject, BreadcrumbList |
| `/how-it-works` | Nasıl çalışır | ✓ | ✓ | how it works, how to make a wedding website | WebPage, BreadcrumbList (HowTo isteğe bağlı) |
| `/features` | Özellikler | ✓ | ✓ | wedding website with RSVP, add to calendar | WebPage, BreadcrumbList |
| `/pricing` | Fiyat (Etsy butonları) | ✓ | ✓ | wedding website price, no subscription | WebPage, BreadcrumbList |
| `/faq` | SSS | ✓ | ✓ | soru biçimli uzun kuyruk | FAQPage (isteğe bağlı), BreadcrumbList |
| `/guides` | Rehberler dizini | ✓ | ✓ | wedding website guides | CollectionPage, ItemList, BreadcrumbList |
| `/guides/<rehber>` | Rehber (6 ile açılış) | ✓ | ✓ | §6.12 | Article, BreadcrumbList |
| `/about` | Hakkımızda | ✓ | ✓ | marka | AboutPage, Organization |
| `/contact` | İletişim | ✓ | ✓ | marka support | ContactPage, Organization.contactPoint |
| `/privacy` | Gizlilik | ✓ | ✓ | (güven) | WebPage |
| `/llms.txt`, `/llms-full.txt` | Asistanlar için özet | (metin) | — | GEO | — |
| `/start?theme=…` | Alıcı başlangıcı (var) | ✗ (zaten `noindex`) | — | — | — |
| `/start/demo/<tema>` | Tema canlı demosu (var) | ✗ (zaten `noindex, nofollow`) | — | — | — |
| `/<slug>` | Çift siteleri | **karar** (öneri: ✗) | — | — | — |

Sayfalar için kurallar:
- URL'ler küçük harfli, tireli ve sonda `/` olmadan. Tasarım sayfasının adresi tema id'sidir; tema klasörü, demo ve
  START HERE ile aynı kalır.
- Yalnız `status: 'live'` tasarımlar listelenir. `'coming'` olanlar gösterilmez; gelecek vaat edilmez.
- `/designs?style=…` gibi filtreler sayfa içi kalır. Canonical `/designs` olur.

İleride (yeterli içerik olunca; şimdi açılırsa ince sayfa olur):
- `/designs/style/<stil>`: ≥ 4 uygun tasarım olunca.
- `/save-the-date`: ürün olunca.
- `/help`: alıcı yardım merkezi (G062 ile).

### 5.2 Gezinme

- **Üst menü (masaüstü):** [BRAND] · Designs · How it works · Features · Pricing · FAQ · Guides · sağda `See designs`
  düğmesi.
- **Mobil:** logo ve menü düğmesi; menü tam ekran açılır. Tasarım sayfalarında altta sabit bir eylem çubuğu bulunur:
  `Open live demo` · `Buy on Etsy`.
- **Alt bilgi:**
  - Designs: tasarım listesi.
  - Help: How it works, FAQ, **Already bought a design? Start your website** → `/start`.
  - Guides: ilk 4 rehber.
  - Company: About, Contact, Privacy.
  - Etsy dükkânı ve sosyal linkler (varsa).
  - `© [YEAR] [BRAND]`.
- **Breadcrumb:** görünür biçimde yalnız `/designs/*` ve `/guides/*` sayfalarında. JSON-LD bütün iç sayfalarda.

### 5.3 İç link kuralları

- Her rehber en az bir tasarım sayfasına ve `/how-it-works` ya da `/features` sayfasına link verir. Her tasarım sayfası
  ilgili 2 rehbere link verir.
- Ana sayfa bütün birinci seviye sayfalara link verir. `/faq` her yanıtta ilgili sayfaya bağlanır.
- Link metni açıklayıcı olur ("see the Olive & Ivory design"). "Click here" kullanılmaz.
- Yetim sayfa olmaz. Testte her indekslenen sayfaya en az 2 iç link gelir (§9.10).

### 5.4 Ayrılmış slug'lar (çakışma riski)

Pazarlama sayfaları ve çift siteleri aynı kökte (`/<slug>`). Next.js statik segmenti `[slug]`'dan önce eşleştirir. Bu
yüzden aynı adı alan bir çift sitesi **gölgede kalır** ve açılmaz. `lib/slug.ts` `RESERVED_SLUGS`'a şunlar eklenmeli:

`designs`, `design`, `guides`, `guide`, `how-it-works`, `features`, `examples`, `gallery`, `reviews`, `compare`,
`checkout`, `buy`, `cart`, `order`, `orders`, `gift`, `search`, `feed`, `rss`, `sitemap`, `llms`, `opengraph-image`,
`twitter-image`, `icon`, `apple-icon`, `save-the-date`, `wedding-websites`, `refund`, `refunds`, `cookies`, `accessibility`.

(`about`, `contact`, `faq`, `privacy`, `pricing`, `blog`, `help`, `terms` zaten var. Nokta içeren adlar slug olamaz.)

Yayından önce canlı depoda bu adları kullanan bir site olmadığı kontrol edilir (bugün yalnız demo var). Dosya G061'in
`yazar:` listesinde değil (§13.3).

### 5.5 Çift sitelerinin indekslenmesi (karar gerekiyor)

*(İlk durum, G061 kod aşaması:)* yayındaki çift siteleri `200` dönüyordu ve `noindex` işareti yoktu (`lib/site/render.ts`
yalnız önizlemede ve hata sayfasında `noindex` yazıyordu). Arama motorları bu siteleri indeksleyebilirdi. Bugünkü durum
bölümün sonunda.

**Öneri: varsayılan `X-Robots-Tag: noindex`.** Gerekçeler:
- Misafir bilgisi ve gizlilik: düğün tarihi, mekân, fotoğraflar.
- Marka alan adında yüzlerce benzer kişisel sayfa, sitenin kalitesini sulandırır.
- Rakip Canva siteleri de Canva'nın alanında.

Panelde ileride "Let search engines show our website" seçeneği açılabilir (G060 kapsamı). `/media/` robots'ta kapatılır
(§9.5). Çift sitesi kökte olduğu için robots ile kapatılamaz; doğru araç header'dır.

**Uygulandı (G061 inceleme düzeltmesi, 2026-10-14):** karar 4 verilene kadar varsayılan **`X-Robots-Tag: noindex`**
(`COUPLE_SITE_ROBOTS`, `lib/site/render.ts`). Arama botları sayfayı okuyabilir, yalnız listelemez. Eğitim botları
`noindex`'e değil robots.txt'ye uyduğu için çift sitelerini onlardan robots.txt kapatır (§9.5). SSS'deki "Will our
website show up on Google?" yanıtı bu davranışı söyler; test ikisini birbirine bağlar.

---

## 6. Sayfa sayfa içerik planı

Ortak kurallar:
- Başlık (title) ≤ 60 karakter (marka sonda), meta açıklama 140–160 karakter, tek H1.
- İlk ekranda tanım cümlesi bulunur. "Last updated" tarihi görünür.
- Görseller: "GERÇEK" = gerçek tema ve panel ekranları; "MKnn" = §12'deki GPT görseli; "BİRLEŞİK" = MKnn telefon
  ekranına gerçek ekranın `tools/mockup_compose.py` ile yerleştirilmiş hâli.
- Gerçek ekranların kaynağı: `collections/<NN>/package/shots/` (`g01`–`g11` misafir, `b01`–`b10` alıcı, `p01`–`p03`
  panel; 390 px, DPR 3, kurgu içerik) ve `platform/previews/<g038|g401>/opening_390x844.mp4`.
- **Panel ekranları G060 (panel v2) bitince yeniden alınır**, çünkü eski panel görüntüsü yanlış beklenti yaratır.

### 6.1 Ana sayfa `/`

- **Title:** `Digital Envelope Wedding Invitation Websites | [BRAND]` (G061 inceleme düzeltmesi: §2.1 kümesindeki
  "envelope", "digital" ve "wedding invitation website" title'da; 12 karakterlik marka adıyla 59 karakter)
- **Meta:** `A digital wedding invitation website with RSVP that opens from a sealed envelope. Edit it on your phone, no Canva needed. Try the live demo first.`
- **H1:** `Envelope wedding websites that open like a real invitation`

Bölümler:

1. **Hero.**
   - Üst etiket: `Wedding websites · edit on your phone`
   - Alt başlık: `Your guests tap a sealed envelope, it opens, and your wedding website appears: your story, the details and RSVP. You edit everything from your phone.`
   - Görsel: mobilde MK03, masaüstünde MK02. Telefon ekranında GERÇEK zarf (`g01_envelope`, poster) görünür.
   - Tasarım çipleri: `Blush Garden Rose · Olive & Ivory` (+04 yayına girince). Seçilen tasarımın posteri değişir.
   - Birincil düğme `Open the invitation`:
     - Mobilde tam ekran diyalog açar: `/start/demo/<tema>` iframe'i, kapatma düğmesi ve altta `See this design` ·
       `Buy on Etsy` çubuğu.
     - Masaüstünde iframe telefonun ekranında yüklenir.
   - İkincil link: `See all designs →`
   - Doğru gerçeklerden oluşan satır: `RSVP built in · Add to calendar · No Canva · Online until 12 months after your wedding`.
2. **Tanım paragrafı** (§4.6 uzun metin, H2: `What is [BRAND]?`).
3. **"How the opening works":** açılış kaydından 3 kare (kapalı, açılıyor, ana sayfa) ya da sessiz döngü video
   (`preload="none"`, poster).
4. **"Four pages your guests will actually use":** Home, Our Story, Details, RSVP. Her biri GERÇEK ekran (MK01 çerçevesinde)
   ve bir cümle açıklama.
5. **"Made to edit from your phone":** BİRLEŞİK MK05 (panel ekranı) ve düzenlenebilenler listesi (sayılar `facts`'ten),
   `Preview before you publish`.
6. **"RSVPs without the spreadsheet chaos":** BİRLEŞİK MK04 (misafir RSVP formu, `g10`). Yanıtlar, sayılar, CSV, 3 özel
   soru, son tarih.
7. **"How it works"** 4 adım özeti → `/how-it-works`.
8. **Tasarım şeridi:** kartlar (MK01 çerçevesinde poster, ad, tek satır stil) → `/designs/<tema>`.
9. **Fiyat özeti:** `One design. One payment on Etsy. [PRICE]` → `/pricing` (fiyat yer tutucuyken düğme metni `See pricing`).
10. **SSS (5 soru):** Do I need Canva? · How do guests RSVP? · How long is my website online? · Can I change it after
    publishing? · How do I get my website after buying on Etsy? → `/faq`.
11. **Son çağrı:** `Try it on your phone first` (demo) + `Buy on Etsy`.

Diğer bilgiler:
- **Şema:** Organization, WebSite, WebPage, ItemList (tasarım URL'leri).
- **İç linkler:** /designs, her tasarım, /how-it-works, /features, /pricing, /faq, 2 rehber.

### 6.2 Tasarım galerisi `/designs`

- **Title:** `Wedding Website Designs with an Envelope Opening | [BRAND]`
- **Meta:** `Browse wedding website designs that open from a sealed envelope. Each design includes Home, Our Story, Details and RSVP pages. Try every demo live.`
- **H1:** `Wedding website designs`
- Giriş paragrafı: her tasarımda ne aynıdır (4 sayfa, panel, RSVP) ve ne farklıdır (zarf, açılış, sanat, yazı tipleri).
- **Kart** (her tasarım):
  - MK01 çerçevesinde GERÇEK zarf ekranı; masaüstünde üzerine gelince `home` ekranı.
  - Ad, stil satırı, 3 renk çipi (arayüz).
  - `Open live demo` (diyalog) ve `View design`.
  - Fiyat (yer tutucuyken gizli).
- Sayfa içi filtre (renk ve stil): JS'siz çalışır, URL'ye yazmaz ve 6'dan az tasarım varken gizlidir.
- **Şema:** CollectionPage, ItemList, BreadcrumbList.

### 6.3 Tasarım sayfası `/designs/<tema-id>`

Örnek: Blush Garden Rose.

- **Title:** `Blush Garden Rose: Envelope Wedding Website | [BRAND]`
- **Meta:** `A blush pink envelope tied with a silk ribbon opens into your wedding website: peonies, garden roses and arched photo frames. Edit on your phone, RSVP built in.` [VERIFY: tema açılışıyla karşılaştır]
- **H1:** `Blush Garden Rose wedding website`

Bölümler:

1. **Hero:**
   - MK01 çerçevesinde GERÇEK zarf posteri ve tek cümle stil tanımı.
   - `Open live demo` · `Buy on Etsy — [PRICE]` (yer tutucuyken: `Coming soon on Etsy`, devre dışı, `aria-disabled`).
   - `Already bought it? Start your website →` (`/start?theme=<id>`).
2. **"The opening":**
   - Sessiz döngü video: GERÇEK `opening_390x844.mp4` → H.264 ve poster.
   - 2–3 cümlelik açıklama. Kaynak: katalog `WEB` açılış metni ve tema README'si, ama **gerçek tema davranışıyla
     karşılaştırılarak** yazılır [VERIFY].
3. **"The pages":** 4 GERÇEK ekran (Home, Our Story, Details, RSVP) MK01 çerçevesinde, alt yazılı. Mobilde yatay
   kaydırmalı.
4. **"What you can change":** isimler, tarih/saat/saat dilimi, mekân ve harita linki, program (≤ 10), hikâye, 5 fotoğraf
   alanı (portre, 3 hikâye, mekân; kırpma ile), SSS (≤ 12), RSVP son tarihi ve 3 özel soru, açılıp kapanan bölümler
   (hikâye, geri sayım, dress code, hediye listesi, kalacak yer, SSS).
   **"What stays the same":** artwork, renkler, yazı tipleri, sayfa düzeni.
5. **"Details":**
   - Palet (arayüz çipleri).
   - Yazı tipleri (yalnız adlar: ör. Great Vibes + Lora).
   - Sayfalar, foto alanı sayısı.
   - Tarih biçimleri (US/UK/CA/AU).
   - `Works best on phones; also looks good on tablets and computers` [VERIFY: 1280 px önizleme].
6. **Included / Not included** (§6.6 ile aynı kaynak).
7. **Design FAQ** (4 soru): Can I change the colors? (No) · How many photos? · Does it work without photos? (yer tutucu
   yalnız önizlemede, misafir görmez; tema README'sine göre [VERIFY]) · Is there a matching save the date? (Not yet)
8. **Related:** diğer tasarımlar ve 2 rehber.

Diğer bilgiler:
- **Şema:** Product, Offer (koşullu), VideoObject, BreadcrumbList (§8.3).
- **OG görseli:** temanın kendi `themes/<id>/img/og-1200x630.jpg` dosyası (GERÇEK, tema parçalarından).

### 6.4 Nasıl çalışır `/how-it-works`

- **Title:** `How It Works: Your Wedding Website in 4 Steps | [BRAND]`
- **Meta:** `Choose a design, buy it on Etsy, start your website with your order number, then edit on your phone and share the link. Guests RSVP online.`
- **H1:** `How it works`

Adımlar: numaralı liste. Her adımda ne olur, ne kadar sürer ve hangi gerçek ekran gösterilir.

1. **Choose a design and try the live demo on your phone.** GERÇEK demo.
2. **Buy it on Etsy.** Etsy'deki indirmede (START HERE PDF) kişisel başlangıç linki bulunur.
   - Doğru ifade: "Instant access on Etsy: your download opens as soon as your payment goes through." Etsy indirmeyi
     ödeme onayından sonra açar.
3. **Start your website.** Etsy sipariş numarası ve e-posta girilir; taslak site oluşur.
   - Uyarı kutusu: `Save your private edit link. Anyone with it can edit your website.` (e-posta gönderimi yok).
   - GERÇEK `b01`–`b03` (G060 sonrası yeniden).
4. **Edit, preview, publish.** Panel: isimler, tarih, mekân, fotoğraflar. Önizleme. Yayınla. GERÇEK `b04`–`b09`.
5. **Share your link or QR code.** Bağlantı önizlemesi ve QR. GERÇEK `b10`.
6. **Guests RSVP; you see replies.** Yanıtlar, sayılar, CSV. GERÇEK `p01`–`p03`.

Ek bölümler:
- **"What you need":** a phone or computer, your Etsy order number, photos (optional).
- **"After the wedding":** site düğünden 12 ay sonrasına kadar yayında kalır [VERIFY: G060]; sonrası `[EXTENSION POLICY]`.
- **Şema:** WebPage, BreadcrumbList. `HowTo` isteğe bağlı (Google'da zengin sonuç yok).

### 6.5 Özellikler `/features`

- **Title:** `Wedding Website Features: RSVP, Calendar, Photos | [BRAND]`
- **Meta:** `RSVP with custom questions, replies and CSV in your panel, add-to-calendar, schedule, FAQ, maps and registry links, photo crop and QR code sharing.`
- **H1:** `Everything your wedding website does`

Gruplar (her biri H2 ve GERÇEK ekran):
- **Opening:** zarf, sıralı animasyon, `Skip` ve hareket azaltma desteği. Erişilebilirlik gerçek bir artı ama kısa
  anlatılır.
- **For your guests:** 4 sayfa, takvime ekle, harita, kalacak yer, hediye listesi linki, SSS, geri sayım, dress code.
- **RSVP:** form, kişi sayısı, mesaj, 3 özel soru (seçenekli ya da kısa yanıt), son tarih, panelde liste ve sayılar, CSV.
- **Editing:** telefon için tasarlanmış panel, otomatik kayıt, önizleme, yayınla/yayından kaldır, fotoğraf kırpma, isim
  ve tarih değişiklik hakkı [VERIFY: G060].
- **Sharing:** kişisel bağlantı önizlemesi, QR (PNG/SVG).
- **Privacy:** yalnız siz yanıtları görürsünüz; misafir verisi satılmaz ve paylaşılmaz; site arama motorlarına kapalıdır
  [§5.5 kararına bağlı].
- **Not included** (açık liste): custom domain, music, changing colors or fonts, password protection, sending invitations
  by email, guest list import, multiple languages, printed invitations.
- **Comparison tablosu: "Canva template vs [BRAND]".** Yalnız doğru satırlar, rakip adı yok:

  | | Canva template (typical Etsy listing) | [BRAND] |
  |---|---|---|
  | Where you edit | Canva editor | A simple panel designed for phone screens |
  | Account needed | Canva account | None (private edit link) |
  | RSVP | Separate form (Canva Forms or Google Forms) | Built in; replies and CSV in your panel |
  | Your link | Canva's free site address | `[DOMAIN]/<your-names>` |

- **Şema:** WebPage, BreadcrumbList.

### 6.6 Fiyat `/pricing`

- **Title:** `Pricing: One Purchase on Etsy, No Subscription | [BRAND]`
- **Meta:** `Each wedding website design is a one-time purchase on Etsy: [PRICE]. Your website stays online until 12 months after your wedding. See what's included.`
- **H1:** `Simple pricing`

Bölümler:
- **Fiyat kartı** (tasarım başına; config'ten): ad, `[PRICE]`, varsa `compareAtPrice`, `Buy on Etsy` düğmesi, `Try the demo`
  linki.
  - Etsy sürekli indirim yaptığında (docs/13: pazarın %89'u) sitedeki fiyat **Etsy'de görünen fiyatla aynı olmalı**.
    Config'te tek alan var; kampanya bitiminde güncellenir. Tutarsız fiyat asistanlarda yanlış bilgi doğurur.
- **"What's included"** (tek kaynak, tasarım sayfalarıyla aynı): 4 sayfalı site ve zarf açılışı, düzenleme paneli, RSVP
  ve CSV, takvime ekle, QR, düğünden 12 ay sonrasına kadar barındırma.
- **"Not included":** §6.5 listesi.
- **Paket / indirim:** `[BUNDLE OFFER: G062]`. Karar gelene kadar bölüm görünmez.
- **Fiyat SSS:** Why Etsy? (Etsy handles payment and gives you your download) · Is it a subscription? (No) · What happens
  after 12 months? (`[EXTENSION POLICY]`) · Refunds? (`[REFUND POLICY]`) · Can I buy directly on this site? (Not yet: §7.4)
- **Şema:** WebPage, BreadcrumbList. Offer **yalnız tasarım sayfasında**; aynı ürün birden çok sayfada işaretlenmez.

### 6.7 SSS `/faq`

- **Title:** `Wedding Website FAQ | [BRAND]`
- **Meta:** `Answers about buying on Etsy, editing from your phone, RSVPs, sharing, privacy and how long your wedding website stays online.`
- **H1:** `Frequently asked questions`

Gruplar ve sorular (her yanıt ilk cümlede cevap verir, 40–80 kelime, ilgili sayfaya link):
- **Buying:** How do I buy? · What do I get after buying on Etsy? · Is it a subscription? · Can I get a refund?
  `[REFUND POLICY]` · Can I use one purchase for two weddings? (No: one order = one website; G060)
- **Editing:** Do I need Canva or an app? · What can I change? · Can I change colors or fonts? · Can I change our names
  or date after publishing? ("Yes, 3 times. Fixing a small typo (up to 2 letters or digits) is free, and everything else
  can change as often as you like." docs/16 §11.7 ile aynı; `[VERIFY: G060 shipped]`) · What if our wedding date moves?
  (contact support; docs/15 §1: ertelenen düğün için tarih değişikliği ücretsiz önerisi) · What if I lose my edit link?
  `[LOST LINK POLICY]` · Can two people edit? (Anyone with the edit link can; keep it private)
- **Guests and RSVP:** How do guests reply? · Do guests need an account or app? (No) · Can I ask a meal choice? (Up to 3
  questions) · Where do I see replies? · When should the RSVP deadline be? → guide 3
- **Sharing:** How do I share it? (Link, QR) · What do guests see when I send the link? (Your names and date in the
  preview) · Can I print the QR on paper invitations? (Yes, scan it before printing)
- **Hosting and privacy:** How long is my website online? · Who can see guest replies? · Will my website show up on
  Google? [§5.5] · Can I take it offline? (Unpublish) · How do I delete my data? `[DELETION PROCESS]`
- **Designs:** Is the artwork AI-generated? (Yes: created with AI image tools, then assembled, tested and hosted by us) ·
  Is there a matching save the date? (Not yet) · Do you sell printed invitations? (No)
- **Support:** How do I contact you? `[SUPPORT EMAIL]` · How fast do you reply? `[RESPONSE TIME]`

Şema: FAQPage, görünen metinle birebir aynı (isteğe bağlı; Google'da sonuç yok, diğer motorlar okuyabilir).

### 6.8 Hakkımızda `/about`

- **Title:** `About [BRAND]`
- **Meta:** `We make wedding websites that open like a real invitation, sold on Etsy and edited from your phone. Here is how we design, test and host them.`
- **H1:** `About [BRAND]`

Bölümler:
- Ne yapıyoruz: tanım paragrafı.
- Neden yaptık: Canva şablonları ve form araçları arasında kaybolan çiftler; telefondan biten iş.
- Nasıl tasarlıyoruz:
  - Sanat AI görsel araçlarıyla üretilir.
  - Her tasarım platformda ayrı hareket eden parçalara bölünür ve 5 ekran genişliğinde test edilir (theme-check).
  - Kişisel metin görsele pişirilmez.
- Neyi test ediyoruz, neyi henüz test etmedik:
  - Dürüstlük bölümü, kısa tutulur.
  - Örnek: "We test every design at five screen widths before release."
- İletişim.

Kurallar:
- Kurucu adı, fotoğrafı, "since 20XX", ekip yazılmaz; yasal kimlik yok (K25).
- Görsel: MK06 (alt metin: "Paper swatches, ribbon and paint on a work table"). "Our studio" yazılmaz.
- **Şema:** AboutPage, Organization.

### 6.9 İletişim `/contact`

- **Title:** `Contact [BRAND]`
- **Meta:** `Questions about a design, your order or your wedding website? Email us at [SUPPORT EMAIL]. Include your Etsy order number for faster help.`
- **H1:** `Contact us`

İçerik:
- `[SUPPORT EMAIL]` (mailto), yanıt süresi `[RESPONSE TIME]`, mesaja eklenecekler (Etsy sipariş numarası, site adresi).
- **Güvenlik notu:** `We will never ask for your edit link.`
- Etsy siparişleri için Etsy mesajları da kullanılabilir.
- Form yok: e-posta sağlayıcısı yok; sahte form kurulmaz.
- Görsel: MK09.
- **Şema:** ContactPage, Organization.contactPoint (`email`, `contactType: "customer support"`, `availableLanguage: "English"`).

### 6.10 Gizlilik `/privacy`

- **H1:** `Privacy notice`. Dükkân adı ve destek e-postasıyla yazılır (K25).
- Taslak metni hukuki tavsiye değildir; `[PRIVACY REVIEW]` notu taşır.

Bölümler:
- Toplananlar:
  - Alıcı: e-posta, Etsy sipariş numarası, düğün içeriği, fotoğraflar.
  - Misafir: isim, e-posta (varsa), katılım, kişi sayısı, mesaj, özel soru yanıtları.
  - Pazarlama sitesi: çerezsiz anonim ziyaret istatistiği (§9.9 kararına bağlı).
- Neden ve nerede:
  - Vercel (ABD, `iad1`); veri ve fotoğraflar private Vercel Blob deposunda.
  - Erişim: misafir verisini yalnız çift görür (düzenleme linkiyle); biz destek ve işletme için erişebiliriz.
- Ne kadar süre:
  - Site düğünden 12 ay sonrasına kadar yayında.
  - Sonrası silme ya da arşiv `[RETENTION AFTER ARCHIVE]`.
  - Yayından kaldırılan sitenin fotoğrafları herkese kapanır (mevcut davranış).
- Misafirin hakları: çifte ya da bize yazarak düzeltme ve silme isteği.
- Çerezler: pazarlama sitesinde yok (Vercel Web Analytics çerezsiz [VERIFY]); panel ve site çerez kullanmıyor [VERIFY].
- Değişiklikler ve tarih.

Risk notu (kullanıcıya bir satır):
- AB ve Birleşik Krallık misafirleri için GDPR ve UK GDPR veri sorumlusunun kimliğini ve iletişim bilgisini ister.
- Yasal kimliksiz metin bu şartı tam karşılamaz. Karar K25'te alındı; risk bu notla kayıtlıdır.

### 6.11 Rehberler dizini `/guides`

- **Title:** `Wedding Website Guides and Wording Examples | [BRAND]`
- **H1:** `Guides`
- Kartlar: başlık, 1 cümle özet, okuma süresi, güncelleme tarihi.
- **Şema:** CollectionPage, ItemList, BreadcrumbList.

### 6.12 Rehber özetleri (açılış için 6 tane)

Ortak:
- 1.200–2.000 kelime. Başta "Quick answer" kutusu (40–60 kelime).
- Özgün öğe zorunlu: tablo, kontrol listesi ya da örnek metin.
- Kaynaklı iddialar. Sonda "FAQ" (3–4 soru, H3).
- Bir yumuşak çağrı: `See how it looks: open a live demo`. Ürün tanıtımı rehberin %10'unu geçmez.
- Tek kapak görseli (MK12–MK17). OG: kapak 1200×630 kırpımı.
- Yazar: **Organization** (`[BRAND] Editorial`); kişi uydurulmaz.
- "Reviewed on <tarih>" satırı. Şema: Article ve BreadcrumbList.

**G1 · `/guides/how-to-make-a-wedding-website`**
- Title: `How to Make a Wedding Website on Your Phone (Step by Step)`
- Hedef: how to make a wedding website, wedding website on phone. Niyet: bilgi → ürün.
- Açı: platformdan bağımsız 8 adım. Her adımda "what to prepare" ve zaman tahmini. Kendi ürünümüz yalnız bir seçenek
  olarak geçer.
- Taslak:
  1. Quick answer
  2. Before you start: what to prepare (names as you want them shown, date/time/time zone, venue and map link,
     schedule, 3–5 photos, RSVP deadline, registry/hotel links)
  3. Step 1 Choose a platform or design (kriterler tablosu: editing device, RSVP, link preview, cost, how long it stays
     online)
  4. Step 2 Add the essentials
  5. Step 3 Write your welcome and story (→ G4)
  6. Step 4 Add photos (oran ve kırpma ipuçları)
  7. Step 5 Set up RSVP (deadline, questions → G3)
  8. Step 6 Preview on your phone
  9. Step 7 Publish and test the link (kendine gönder, önizleme kontrolü, QR testi)
  10. Step 8 Share (ne zaman ve nasıl → G3, G5)
  11. FAQ
- Özgün öğe: "prep sheet" kontrol listesi. Görsel: MK12 (BİRLEŞİK, panel ekranı).
- İç linkler: /how-it-works, /features, G2, G3, G4.

**G2 · `/guides/what-to-put-on-your-wedding-website`**
- Title: `What to Put on Your Wedding Website: Checklist and Examples`
- Hedef: what to put on a wedding website, wedding website checklist.
- Açı: "must-have / nice-to-have / skip" üç sütunlu kontrol listesi ve gizlilik uyarıları (ev adresi yayınlamayın vb.).
- Taslak:
  1. Quick answer
  2. The must-haves (names, date, time with time zone, venue + map, RSVP + deadline, schedule)
  3. Helpful extras (story, travel and stay, registry link, dress code, FAQ, countdown, add to calendar)
  4. What not to put on a public website (privacy: home address, gift-receiving address, children's names, private
     events)
  5. Page-by-page structure (Home, Our Story, Details, RSVP)
  6. Examples (kısa örnekler, G4'e link)
  7. FAQ
- Özgün öğe: indirilebilir kontrol listesi (sayfa içinde yazdırılabilir; PDF sonra). Görsel: MK13.

**G3 · `/guides/when-to-send-your-wedding-website`**
- Title: `When to Share Your Wedding Website and Set the RSVP Deadline`
- Hedef: when to send wedding website, RSVP deadline wedding, when to send save the dates.
- Açı: düğün tarihine göre geriye doğru zaman çizelgesi tablosu (save the date, website, invitation, RSVP deadline,
  final count to caterer). Kaynaklar: yerleşik görgü kuralı kaynakları (Emily Post Institute, The Knot ve Zola
  rehberleri; sayılar onlara atıfla). Destination ve yerel düğün farkı.
- Taslak:
  1. Quick answer
  2. The timeline (tablo)
  3. Destination weddings
  4. Choosing the RSVP deadline (caterer and venue deadlines)
  5. Reminders: what to send and when
  6. FAQ
- Özgün öğe: zaman çizelgesi tablosu; "deadline calculator" ileride (JS'siz tablo şimdi). Görsel: MK14.

**G4 · `/guides/wedding-website-wording`**
- Title: `Wedding Website Wording: Examples for Every Section`
- Hedef: wedding website wording, our story examples, wedding website welcome message.
- Açı: kendi yazdığımız 40+ örnek; bölüm başına 3 ton (classic, warm, playful). Alan uzunluk sınırlarına uyar (ör.
  hikâye girişi ≤ 200 karakter): örnekler gerçekten panele sığar.
- Taslak:
  1. Quick answer
  2. Welcome message
  3. Our story intro and captions
  4. Schedule labels
  5. Dress code wording (black tie, formal, garden formal, cocktail; açıklamalı)
  6. Registry wording (nazik)
  7. Travel and stay
  8. RSVP wording and decline message
  9. FAQ answers (G-backlog)
  10. FAQ
- Özgün öğe: örnek tabloları. Görsel: MK15.

**G5 · `/guides/digital-wedding-invitation-etiquette`**
- Title: `Digital Wedding Invitations: Etiquette, Pros and Cons`
- Hedef: are digital wedding invitations tacky, digital wedding invitation etiquette, how to send digital wedding
  invitations.
- Açı: dengeli; dijitalin uygun olmadığı durumlar da yazılır (yaşlı akrabalar: basılı kart + QR önerisi).
- Taslak:
  1. Quick answer
  2. Is it acceptable in 2026? (kaynaklı)
  3. Pros and cons table
  4. Who might still need paper
  5. How to send (WhatsApp, text, email; link preview tip)
  6. Wording for the message you send with the link
  7. Following up with guests who haven't replied
  8. FAQ
- Özgün öğe: gönderim mesajı şablonları. Görsel: MK16 (BİRLEŞİK zarf ekranı).

**G6 · `/guides/canva-wedding-website-template-vs-hosted-website`**
- Title: `Canva Wedding Website Template vs a Hosted Wedding Website`
- Hedef: canva wedding website, canva wedding website template, wedding website without canva.
- Açı: adil karşılaştırma; satıcı adı yok. Canva yolunun güçlü yanları da yazılır (çok tasarım, tam serbestlik).
  docs/13 gözlemleri yalnız genel olarak kullanılır.
- Taslak:
  1. Quick answer
  2. How a Canva template works (PDF → template link → edit → publish on Canva's free domain → RSVP form)
  3. How a hosted wedding website works
  4. Comparison table (editing, account, RSVP, link, freedom to redesign, who fixes problems)
  5. Which one is right for you
  6. FAQ
- Özgün öğe: karşılaştırma tablosu. Görsel: MK17.

**Backlog** (ayda 2): wedding-website-faq-examples · wedding-rsvp-questions (meal choice, plus-ones, dietary) ·
wedding-website-privacy · wedding-qr-code (Etsy'nin QR kuralına dikkat: yalnız misafir paylaşımı için) ·
destination-wedding-website · save-the-date-website (ürün olunca).

---

## 7. Dönüşüm yolları

### 7.1 Yollar

1. **Organik veya asistan → ana sayfa → demo → tasarım sayfası → `Buy on Etsy` → Etsy ödemesi → START HERE PDF →
   `/start?theme=` → panel.** Ana ölçüm noktaları: `demo_open`, `etsy_click`.
2. **Pinterest pini → tasarım sayfası → demo → Etsy.** Her tasarım için 2–3 dikey pin. Kaynak: GERÇEK ekranlar ve
   tasarıma özel G8NN mockup'ları; düzen kodla, dekor yok.
3. **Rehber → satır içi çağrı (`open a live demo`) → tasarım sayfası → Etsy.**
4. **Asistan → doğrudan tasarım sayfası ya da Etsy ilanı.** Ad, tanım ve fiyat iki yerde aynı olmalı (§1.2).
5. **Misafir → çift sitesi → "Made with [BRAND]" (kararsa) → ana sayfa.** docs/15 önerisi: her misafir sayfasında ince
   bir alt bilgi (P1). Link pazarlama sitesine gider, Etsy'ye değil. UTM: `utm_source=couple_site&utm_medium=referral`.
   Bu link bizim sitemize gittiği için UTM serbesttir.
6. **Satın almış alıcı → pazarlama sitesi → `Start your website` → `/start`.** Kayıp PDF durumunda.

### 7.2 Etsy bağlantıları

- Her düğme config'teki ilan linkine gider. Bu link Etsy'nin **Share & Save** linkidir (docs/15 §3.2: kendi
  kanalımızdan gelen satışta %4 iade). Shop Manager'da ilan başına üretilir.
  - Linke UTM ya da başka sorgu **eklenmez**; Share & Save eşleştirmesini bozabilir [VERIFY].
  - Ölçüm üç yerden yapılır: bizim `etsy_click` olayımız, Etsy Stats'taki yönlendiren alan adı ve Share & Save raporu.
- `target="_blank"` kullanılmaz (mobilde geri dönüşü bozar). `rel="noopener"` gerekmez. Ölçüm için `etsy_click` olayı.
- İlan URL'si yer tutucuyken düğme `Coming soon on Etsy` olur ve devre dışı kalır. Kırık link yayınlanmaz.

### 7.3 Çağrı kuralları

- Her sayfada en çok bir birincil eylem. Ana sayfada bu `Open the invitation`, tasarım ve fiyat sayfalarında `Buy on Etsy`.
- Mobilde tasarım sayfalarında alt yapışkan çubuk; 44 px dokunma alanı.
- Fiyat her yerde aynıdır, tek alandan gelir.

### 7.4 Sonraki aşama: doğrudan ödeme (Faz 2)

- docs/15 §4.7'ye göre Stripe Türkiye'deki işletmeye büyük olasılıkla kapalı. Aday, bir "merchant of record" (MoR)
  platformu: Paddle ya da Gumroad. Önce satıcı uygunluğu doğrulanır.
- Config `checkout.mode: 'etsy' | 'etsy+direct'`. `direct` açılınca tasarım sayfası birincil düğmesi `Buy now — [PRICE]`
  olur (MoR ödeme sayfası). Etsy düğmesi ikincile iner.
- Ödeme sonrası `/start` sipariş numarası yerine ödeme oturumuyla açılır (G062 ve G043 ile tasarlanır).
- Şema: sayfadan satın alma mümkün olunca merchant listing'e geçilir (fiyat > 0, para birimi, `hasMerchantReturnPolicy`).
  MoR'da satıcı alanı [VERIFY: Google merchant listing şartı].
- **Etsy kuralı:** Etsy kanallarında (ilan, mesaj, START HERE PDF, Etsy'deki QR'lar) alıcı **Etsy dışında satın almaya
  yönlendirilmez** ("encouraging buyers to purchase … through another venue" yasak). Pazarlama sitesi iki yolu da
  gösterebilir; Etsy içinden siteye "daha ucuz" çağrısı yapılmaz.
- Etsy dükkânının "About" bölümünde site linki kuralı [VERIFY: güncel Etsy yardım sayfası]. Ayrıntı G062'de.

---

## 8. Şema planı

### 8.1 Genel grafik (her sayfa, layout'tan)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://[DOMAIN]/#org",
      "name": "[BRAND]",
      "url": "https://[DOMAIN]/",
      "description": "<§4.6 kısa tanım>",
      "email": "[SUPPORT EMAIL]",
      "logo": "<marka kararından sonra, ≥ 112 px kare>",
      "sameAs": ["[ETSY SHOP URL]", "<Pinterest>", "<Instagram>"],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "[SUPPORT EMAIL]",
        "availableLanguage": "English"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://[DOMAIN]/#website",
      "name": "[BRAND]",
      "url": "https://[DOMAIN]/",
      "inLanguage": "en",
      "publisher": { "@id": "https://[DOMAIN]/#org" }
    }
  ]
}
```

- Yer tutucu taşıyan alan JSON-LD'ye **yazılmaz**: alan atlanır. `launched=true` iken yer tutucu kalmışsa build kırılır
  (§9.10).
- `SearchAction` kullanılmaz (sitelinks arama kutusu kalktı). `logo` ve `sameAs` boşsa alan hiç yazılmaz.

### 8.2 Sayfa başına

| Sayfa | Türler | Not |
|---|---|---|
| `/` | WebPage (`about` → Organization), ItemList (tasarım URL'leri) | ItemList zengin sonuç değildir; anlam için |
| `/designs` | CollectionPage, ItemList, BreadcrumbList | |
| `/designs/<id>` | Product, Offer (koşullu), VideoObject, BreadcrumbList | §8.3 |
| `/how-it-works` | WebPage, BreadcrumbList; HowTo isteğe bağlı | Google'da etkisi yok |
| `/features`, `/pricing` | WebPage, BreadcrumbList | Fiyat Offer'ı burada **yok** |
| `/faq` | FAQPage (isteğe bağlı), BreadcrumbList | Görünen metinle birebir |
| `/guides` | CollectionPage, ItemList, BreadcrumbList | |
| `/guides/<g>` | Article, BreadcrumbList | §8.4 |
| `/about` | AboutPage | Organization genel grafikten |
| `/contact` | ContactPage | contactPoint genel grafikte |
| `/privacy` | WebPage | |

### 8.3 Tasarım sayfası: Product (product snippet)

```json
{
  "@type": "Product",
  "@id": "https://[DOMAIN]/designs/blush-garden-rose#product",
  "name": "Blush Garden Rose Wedding Website",
  "description": "<sayfadaki stil tanımı>",
  "sku": "blush-garden-rose",
  "brand": { "@id": "https://[DOMAIN]/#org" },
  "category": "Wedding website",
  "image": [
    "https://[DOMAIN]/marketing/designs/blush-garden-rose/phone-envelope.webp",
    "https://[DOMAIN]/marketing/designs/blush-garden-rose/phone-home.webp"
  ],
  "subjectOf": { "@id": "https://[DOMAIN]/designs/blush-garden-rose#video" },
  "offers": {
    "@type": "Offer",
    "price": "[PRICE]",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "[ETSY LISTING URL]"
  }
}
```

- `offers` **yalnız** `price` ve ilan URL'si gerçek değer olunca yazılır. Sayfada görünen fiyatla aynı olmalı. Etsy
  indirimi bitince config güncellenir.
- `aggregateRating` ve `review` **yok**. Etsy yorumları toplanmaz (Google kuralı, §1.1).
- `VideoObject`: `name`, `description`, `thumbnailUrl` (poster), `uploadDate` (dosya tarihi), `contentUrl` (MP4),
  `duration`. Video sayfada görünür olmalı.

### 8.4 Rehber: Article

`headline`, `description`, `image` (1200×630 ve kapak), `datePublished`, `dateModified`, `author` → Organization
(`[BRAND] Editorial`, `url` /about), `publisher` → Organization, `mainEntityOfPage`. Kişi yazar uydurulmaz.

### 8.5 Doğrulama

- Yerelde: `tests/marketing-schema.test.ts`.
  - JSON-LD parse edilir; türe göre zorunlu alanlar kontrol edilir.
  - JSON-LD'deki ad, fiyat ve SSS metni sayfadaki görünür metinde de bulunur.
  - Yer tutucu yoktur (`launched=true` iken).
- Yayından sonra (elle, bu ortamdan Google'a erişim yok): Google Rich Results Test (Product, Article, Breadcrumb) ve
  validator.schema.org.

---

## 9. Teknik plan

### 9.1 Dosya ağacı

`yazar:` içinde olanlar:

```
platform/app/(marketing)/
  layout.tsx                 # pazarlama kabuğu: header, footer, fontlar, robots, metadataBase, JSON-LD genel grafik
  page.tsx                   # /  (app/page.tsx silinince; §13.3)
  designs/page.tsx
  designs/[design]/page.tsx  # generateStaticParams + dynamicParams = false
  how-it-works/page.tsx  features/page.tsx  pricing/page.tsx  faq/page.tsx
  guides/page.tsx  guides/[guide]/page.tsx
  about/page.tsx  contact/page.tsx  privacy/page.tsx
  robots.txt/route.ts        # statik route handler (dynamic = 'force-static')
  sitemap.xml/route.ts
  llms.txt/route.ts  llms-full.txt/route.ts
  not-found.tsx              # pazarlama 404'ü (MK09)
platform/components/marketing/
  Header, Footer, MobileNav (tek küçük client bileşeni), DemoFacade (client), PhoneFrame, DesignCard,
  BuyButton (config ve olay), FaqList (<details>), Breadcrumbs, JsonLd, Prose (rehber gövdesi), LastUpdated
platform/lib/marketing/
  config.ts                  # §10: marka, alan, fiyat, tasarımlar, politikalar (TEK yer)
  facts.ts                   # iddia ve sınırlar (§4.5). Features, SSS, tasarım sayfası ve llms.txt buradan okur
  placeholders.ts            # isPlaceholder(), assertLaunchReady()
  seo.ts                     # pageMetadata(): title, description, canonical, OG, Twitter
  schema.ts                  # JSON-LD üreticileri (Organization, WebSite, Product, Article, Breadcrumb …)
  guides.ts                  # content/guides/*.md okuma (frontmatter + gövde)
  analytics.ts               # track(): provider 'none' | 'vercel'
platform/content/guides/<slug>.md    # rehberler (frontmatter: title, description, published, updated, image, faq[])
platform/content/marketing/*.md      # SSS ve uzun metinler (llms-full.txt için de)
platform/public/marketing/gpt/…      # §12 GPT görselleri (değiştirilmeden)
platform/public/marketing/designs/<id>/…   # gerçek ekranlardan türevler (webp/avif), birleşikler, opening.mp4 + poster
platform/public/marketing/og/…       # 1200×630 OG görselleri
platform/public/<indexnow-key>.txt   # IndexNow anahtarı (yayın aşamasında)
platform/tests/marketing*.test.ts    # §9.10
```

`yazar:` dışında, entegratörün eklemesi gerekenler (§13.3):
- `platform/app/page.tsx` (silinecek)
- `platform/app/layout.tsx` (küçük değişiklik)
- `platform/lib/slug.ts` (yeni ayrılmış slug'lar)
- `platform/lib/site/render.ts` (çift sitesi `noindex`, kararsa)
- `platform/scripts/marketing-assets.ts` (görsel türetme ve birleştirme betiği)
- `platform/package.json` / `package-lock.json` (yeni bağımlılıklar, §9.6)

### 9.2 Yönlendirme ve render

- **Statik:** bütün pazarlama sayfaları build'de üretilir. Dinamik segmentlerde `generateStaticParams` ve
  `dynamicParams = false` (bilinmeyen tasarım ya da rehber → 404). `export const dynamic = 'force-static'`. ISR
  gerekmiyor; içerik repoda ve her yayın yeniden üretir.
- `app/page.tsx` (geçici "Development build" sayfası) ile `(marketing)/page.tsx` aynı yola (`/`) düşer → build hatası. Eski
  dosya silinir.
- **Kök layout** (`app/layout.tsx`) `robots: noindex` ve satır içi `body` stili taşıyor.
  - Pazarlama layout'u `robots`'u ezer: `launched ? {index: true, follow: true} : {index: false, follow: true}`.
  - Kendi kabuğu tam genişlik `div` ile arka planı verir.
  - Kök layout'taki body stilinin panel ve `/start` layout'larına taşınması önerilir, ama G060 alanına dokunduğu için
    koordine edilir.
- `metadataBase = new URL(config.siteUrl)`. Canonical her sayfada mutlak, sorgusuz ve küçük harfli.
- `[slug]` route handler'ı statik segmentlerden sonra çalışır. Yeni sayfa eklendikçe §5.4 listesi güncellenir.

### 9.3 Canonical ve alan adı

- `config.siteUrl` öncelik sırası: `MARKETING_SITE_URL`, sonra `PLATFORM_PUBLIC_URL`, sonra istek host'u (yalnız geliştirmede).
- Marka ve alan adı kararından sonra Vercel'de `davetiye-platform-five.vercel.app` → `[DOMAIN]` **308** yönlendirmesi
  yapılır (yol ve sorgu korunur). START HERE PDF'lerindeki eski `/start` linkleri böylece çalışmaya devam eder. Yine de
  docs/05 §C'ye göre PDF'ler ve QR'lar yeni alanla yeniden üretilir.
- **İndeksleme alan adı kararından önce açılmaz**: vercel.app adresinde biriken sinyaller ve dış linkler kısmen kaybolur.
- Çift siteleri ayrı bir alan adına taşınacaksa (ör. pazarlama `brand.com`, siteler `brand.love/<slug>`) bu karar da
  indekslemeden önce verilir (G062).

### 9.4 Sitemap

- Yalnız pazarlama URL'leri: `/`, `/designs`, canlı tasarımlar, birinci seviye sayfalar, `/guides` ve rehberler.
- `lastmod` = içeriğin `updated` alanı (rehber frontmatter'ı, tasarımlar için config'teki `updated`).
- `changefreq` ve `priority` yazılmaz (Google kullanmıyor).
- Tasarım sayfalarında `<image:image>` (gerçek ekranlar) ve `<video:video>` (açılış videosu) eklenebilir.
- `launched=false` iken sitemap boş döner ve robots'ta sitemap satırı olmaz.

### 9.5 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /edit/
Disallow: /start$
Disallow: /start?
Disallow: /start/
Disallow: /media/

# Arama ve kullanıcı istek botları: açık (görünürlük)
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Bingbot
User-agent: Googlebot
User-agent: Applebot
Allow: /
Disallow: /api/
Disallow: /edit/
Disallow: /start$
Disallow: /start?
Disallow: /start/
Disallow: /media/

# Eğitim botları (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent): KARAR §13.4
# Öneri: YALNIZ pazarlama sayfaları açık (marka modellerin bilgisine girer); çift siteleri her durumda kapalı.
User-agent: GPTBot
...
Allow: /$
Allow: /designs$
Allow: /designs/
...                      (her pazarlama sayfası için "<yol>$" ve "<yol>/")
Allow: /llms.txt$
Allow: /themes/
Allow: /marketing/
Disallow: /

Sitemap: https://[DOMAIN]/sitemap.xml
```

- **Eğitim botları ve çift siteleri (G061 inceleme düzeltmesi):** önceki taslakta eğitim botlarına `Allow: /` veriliyordu.
  Çift siteleri kökte (`/<isimler>`) olduğu için isimler, tarih, mekân ve hikâye metni de eğitim botlarına açık kalıyordu;
  `noindex` onları durdurmaz. Şimdi grup `Disallow: /` ile biter ve yalnız pazarlama yolları (`trainingAllowPaths()`,
  `lib/marketing/crawl.ts`, `corePages()`'ten türetilir) tek tek açılır. `$` ve `/` biçimi `/pricing-and-paul` gibi bir
  çift slug'ını açmaz. Karar 6 "disallow" olursa grup yalnız `Disallow: /` olur.

- `/start` için çıplak önek (`Disallow: /start`) yazılmaz. Robots önek eşleştirmesi yapar; `/starlight-and-sam` gibi bir
  çift slug'ını da kapatırdı. `$`, `?` ve `/` biçimi yalnız `/start`, `/start?theme=…` ve `/start/demo/…` adreslerini
  kapatır. Demolar zaten `noindex, nofollow`; iframe içeriğinin taranması gerekmiyor.
- `/media/` çift fotoğraflarını görsel aramadan uzak tutar. Link önizleme botları (WhatsApp, iMessage) çoğunlukla
  robots'a bakmaz.
- `/themes/` açık kalır: tasarım sayfası `og:image`'ı ve çift sitelerinin görünümü buna bağlı.
- **Vercel Firewall:** projenin bot koruması ya da "AI bots" yönetilen kuralı bu botları engellememeli. Yayından önce
  salt okuma ile kontrol edilir (Vercel MCP `get_firewall_config`).

### 9.6 Fontlar, ikonlar, görseller

- **Fontlar:** `next/font/google` kullanılır. Build'de kendi sunucumuza alınır; çalışırken Google'a istek gitmez;
  `adjustFontFallback` ile CLS olmaz.
  - Öneri: başlıkta Cormorant Garamond (500/600), gövdede Inter. Son seçim uygulamada.
  - Font dosyası alıcı paketine girmez (şart 9 korunur).
- **İkonlar:** sürümü kesin sabitlenmiş bir ikon kütüphanesi (ör. `lucide-react@<tam sürüm>`). Sürüm en az iki hafta önce
  yayınlanmış olmalı; `package-lock.json` güncellenir. Yalnız arayüz ikonları kullanılır: menü, ok, onay, takvim, kilit,
  telefon. Dekor yok.
- **Görseller:**
  - `next/image`, AVIF/WebP, açık `sizes`. LCP görseli ön yüklenir (`fetchPriority="high"`); geri kalanı `lazy`.
  - GPT kaynakları `public/marketing/gpt/` altında **değiştirilmeden** durur. Türevler ve birleşikler
    `public/marketing/designs/` ve `public/marketing/composed/` altına betikle üretilir (§12.4).
- **Video:** `<video muted playsinline loop preload="none" poster>` kullanılır. H.264 MP4, ≤ 1.5 MB, sessiz. Otomatik
  oynatma yalnız görünür olunca, IntersectionObserver ile. `prefers-reduced-motion` açıksa oynatılmaz.

### 9.7 Canlı demo cephesi (DemoFacade)

- İlk yükte demo yoktur: yalnız poster (GERÇEK `g01_envelope`), telefon çerçevesi ve düğme gelir. Tema kaynakları
  (≈ 1.2 MB) yalnız dokununca iner.
- **Mobil (< 768 px):** `<dialog>` tam ekran açılır. İçinde `/start/demo/<tema>` iframe'i (`title="Live demo: <ad>"`),
  kapatma düğmesi (odak tuzağı, `Esc`) ve alt çubuk (`See this design` · `Buy on Etsy`).
- **Masaüstü:** iframe telefon çerçevesinin ekran alanına yüklenir. Fotoğraflı sahnede (MK02) ekran yeşili
  saydamlaştırılmış delik olur; iframe arkada durur. Hafif perspektif varsa CSS `matrix3d` kullanılır (köşe noktaları
  `mockup_compose.py --json` çıktısından).
- Demo aynı kökten gelir. Tema yanıtları `frame-ancestors 'self'` taşıyor (`lib/site/render.ts`); mevcut `/start` sayfası
  da demoyu böyle gösteriyor. **Pazarlama sitesi ile platform aynı origin'de kalmalı.** Ayrı alan adına bölünürse CSP'ye
  pazarlama origin'i eklenir (§9.3).
- Olaylar: `demo_open {design, placement}`. Demonun içinden ebeveyne `postMessage` yok, tema koduna dokunulmaz.

### 9.8 Performans bütçesi (lab ölçümü, 390 px, CPU 4×, yavaş 4G)

| Ölçü | Hedef |
|---|---|
| LCP | ≤ 2.0 s lab (gerçek kullanıcıda p75 ≤ 2.5 s) |
| CLS | ≤ 0.05 |
| INP (gerçek kullanıcı) | ≤ 200 ms |
| İlk yük JS (gzip, Next runtime dahil) | ≤ 130 KB. Sayfalar Server Component; istemci JS yalnız DemoFacade, MobileNav, analitik |
| Ana sayfa ilk yük toplamı | ≤ 600 KB (demo hariç) |
| LCP görseli | ≤ 120 KB (AVIF/WebP, doğru boyut) |
| Font | 2 aile, ≤ 4 dosya, `display: swap` + boyut ayarı |

Gerçek kullanıcı ölçümü: Vercel Speed Insights (Pro). Yayından sonra PageSpeed Insights (lab ve CrUX) elle bakılır.

### 9.9 Analitik (yer tutucu)

- `config.analytics.provider: 'none' | 'vercel'`. Varsayılan `none`.
- `vercel` seçilirse Vercel Web Analytics (çerezsiz [VERIFY]) ve Speed Insights eklenir. Paketler sürümü sabitlenmiş
  `@vercel/analytics` ve `@vercel/speed-insights` olur.
- Özel olaylar Pro plan ister. Pro'nun aktif olduğu doğrulanmadı: docs/15 risk 5'e göre fatura sorgusu "Plan not found"
  döndü [VERIFY: Vercel paneli]. Pro yoksa yalnız sayfa görüntüleme sayılır.
- Olaylar: `demo_open {design, placement}`, `etsy_click {design, placement}`, `start_click {design}`,
  `guide_cta {guide, target}`, `contact_email_click`, `nav_designs`.
- Kişisel veri olaya yazılmaz. Analitik yalnız pazarlama layout'undadır; panel, `/start` ve çift sitelerinde yoktur.
- Google Analytics ya da reklam pikseli şimdilik yok; çerez onayı gerektirir.

### 9.10 Testler ve önizlemeler

`npm test` içinde (node:test):
- `tests/marketing-pages.test.ts`:
  - Her pazarlama rotası 200 döner.
  - Tek H1; title ≤ 60 karakter; meta açıklama 120–160 karakter; mutlak canonical.
  - `launched=false` iken `noindex` ve boş sitemap; `true` iken tersi.
- `tests/marketing-schema.test.ts`: §8.5.
- `tests/marketing-config.test.ts`:
  - Yer tutucu algılama çalışır.
  - `launched=true` ve yer tutucu kalmış → `assertLaunchReady` hata verir.
  - Her `live` tasarımın temasının ve demosunun var olduğu kontrol edilir (`listThemes`).
  - Tasarım id'leri ayrılmış slug listesinde değildir.
- `tests/marketing-links.test.ts`:
  - Build çıktısında bütün iç linkler 200 döner.
  - Yetim sayfa yoktur.
  - Etsy linkleri biçim olarak doğrudur (Etsy'ye bu ortamdan erişilemiyor).
  - `llms.txt`'deki her link sitemap'te bulunur.
- `tests/marketing-robots.test.ts`: robots içeriği, sitemap satırı, `/media/` ve `/edit/` kapalı.
- `tests/marketing-slug.test.ts`: §5.4 listesindeki her ad `isReservedSlug`. Bu test `lib/slug.ts` değişince geçer.

Tarayıcı (build sonrası, Playwright, `/opt/pw-browsers`):
- `tests/marketing-browser.ts`:
  - 390 ve 1280 px'te her sayfa: yatay taşma yok, metin kesilmesi yok.
  - Demo cephesi aç ve kapat: odak, `Esc`, iframe yalnız tıklamadan sonra.
  - Mobil menü, `<details>` SSS.
  - Lab ölçümü: PerformanceObserver ile LCP ve CLS, CDP ile CPU 4× ve ağ kısıtı, aktarılan bayt.
- Çıktı: `platform/previews/g061/<sayfa>_<390|1280>.png` ve `checks.json`.
- `previews/` G061'in `yazar:` listesinde yok → entegratör `platform/previews/g061/` ekler.

Lighthouse bu ortamda kurulu değil. Ekleme isteğe bağlı ve sürüm sabitlenerek yapılır: `@axe-core/playwright` erişilebilirlik
için. Yayından sonra PageSpeed Insights.

### 9.11 Erişilebilirlik

- WCAG 2.2 AA: kontrast ≥ 4.5:1 (metin), görünür odak, `Skip to content`, landmark'lar, 44 px dokunma alanı.
- `prefers-reduced-motion`: video oynamaz, demo diyaloğu animasyonsuz açılır.
- Her görselde anlamlı alt metin. Süs görselinde `alt=""`. Videoda açıklayıcı metin sayfada bulunur.

### 9.12 `llms.txt` ve `llms-full.txt`

Statik route handler. İçerik config, `facts`, sayfa özetleri ve rehberlerden üretilir (llmstxt.org biçimi). Google
yok sayıyor; başka servisler okuyabilir ve maliyeti düşük. Taslak:

```markdown
# [BRAND]

> [BRAND] makes wedding websites that open like a real invitation. Couples buy a design once on Etsy, edit it on
> their phone and collect RSVPs online. No Canva account or app is needed.

- Price: [PRICE] per design, one-time purchase on Etsy. No subscription.
- Hosting: online until 12 months after the wedding date.
- Included: envelope opening page; Home, Our Story, Details and RSVP pages; phone-friendly editing panel; RSVP with up to
  3 custom questions, replies list and CSV download; add to calendar (Apple/Outlook and Google); QR code; personal link
  preview.
- Not included: custom domain, music, changing colors or fonts, password protection, email sending to guests, printed
  invitations.
- Support: [SUPPORT EMAIL]

## Designs
- [Blush Garden Rose](https://[DOMAIN]/designs/blush-garden-rose): blush envelope with a silk ribbon; peonies and garden roses.
- [Olive & Ivory](https://[DOMAIN]/designs/olive-ivory): olive envelope with lace edge and a botanical seal.

## How it works
- [How it works](https://[DOMAIN]/how-it-works)
- [Features](https://[DOMAIN]/features)
- [Pricing](https://[DOMAIN]/pricing)
- [FAQ](https://[DOMAIN]/faq)

## Guides
- [How to make a wedding website on your phone](https://[DOMAIN]/guides/how-to-make-a-wedding-website)
- …

## Optional
- [About](https://[DOMAIN]/about)
- [Privacy](https://[DOMAIN]/privacy)
```

`llms-full.txt`: aynı başlık ve özet, ardından tasarım sayfaları, SSS ve rehberlerin düz Markdown metni.

### 9.13 OG ve Twitter görselleri

- **Ana sayfa ve varsayılan:** `public/marketing/og/home-1200x630.jpg`. Kaynak: MK02 ve GERÇEK zarf ekranı (BİRLEŞİK),
  1200×630 kırpım. Marka adı kararından sonra arayüz tipografisiyle ad eklenir (betik, sharp ve SVG metin). Karardan
  önce yazısız.
- **Tasarım:** temanın `og-1200x630.jpg` dosyası (GERÇEK).
- **Rehber:** kapak görselinin (MK12–17) 1200×630 kırpımı, yazısız; başlık `og:title`'da.
- `twitter:card = summary_large_image`. `og:image:alt` her görselde.

### 9.14 Yayın sonrası teknik adımlar (yalnız `launched=true` ile)

1. Search Console (alan adı mülkü, DNS TXT) → sitemap gönder.
2. Bing Webmaster Tools (GSC'den içe aktar) → sitemap → AI Performance raporu.
3. IndexNow: `public/<anahtar>.txt`; her yayında değişen URL'ler `api.indexnow.org`'a gönderilir (betik; Bing, Yandex ve
   diğerleri).
4. Rich Results Test ve schema.org doğrulayıcı (elle).
5. Vercel Firewall'da bot kurallarına salt okuma kontrolü.

---

## 10. Tek marka ve fiyat yapılandırması

`platform/lib/marketing/config.ts` tek kaynaktır. Bütün sayfalar, şema, `llms.txt`, sitemap ve OG metni buradan okur.
Yer tutucular köşeli parantezli ve BÜYÜK harflidir; geliştirmede ve önizlemede **olduğu gibi görünür**.

```ts
export const MARKETING = {
  launched: false,                     // true: indeksleme ve sitemap açılır; yer tutucu kalmışsa build kırılır
  brand: {
    name: '[BRAND]',
    shortDescription: '[BRAND] makes wedding websites that open like a real invitation. Buy a design on Etsy, edit it on your phone and collect RSVPs online.',
    logo: null as string | null,       // marka kararından sonra
  },
  siteUrl: process.env.MARKETING_SITE_URL ?? process.env.PLATFORM_PUBLIC_URL ?? 'https://[DOMAIN]',
  support: { email: '[SUPPORT EMAIL]', responseTime: '[RESPONSE TIME]' },
  etsy: { shopUrl: '[ETSY SHOP URL]' },
  currency: 'USD',
  hosting: { monthsAfterWedding: 12 }, // K25 (uygulaması G060, docs/16 §11.9)
  editRights: { identityChangesAfterPublish: 3, typoFreeChars: 2 },   // docs/16 §11 (uygulaması G060)
  policies: {
    refund: '[REFUND POLICY]', lostLink: '[LOST LINK POLICY]',
    extension: '[EXTENSION POLICY]', deletion: '[DELETION PROCESS]', retention: '[RETENTION AFTER ARCHIVE]',
  },
  bundles: null,                       // '[BUNDLE OFFER: G062]'
  checkout: { mode: 'etsy' as 'etsy' | 'etsy+direct' },
  analytics: { provider: 'none' as 'none' | 'vercel' },
  social: { pinterest: null, instagram: null, tiktok: null } as Record<string, string | null>,
  aiTrainingBots: 'allow' as 'allow' | 'disallow',   // §13.4 kararı
  designs: [
    { id: 'blush-garden-rose', name: 'Blush Garden Rose', status: 'live',
      price: '[PRICE]', compareAtPrice: null, etsyListingUrl: '[ETSY LISTING URL]', updated: '2026-10-14' },
    { id: 'olive-ivory', name: 'Olive & Ivory', status: 'live',
      price: '[PRICE]', compareAtPrice: null, etsyListingUrl: '[ETSY LISTING URL]', updated: '2026-10-14' },
    { id: 'vintage-airmail-love-letter', name: 'Vintage Airmail Love Letter', status: 'coming',
      price: '[PRICE]', compareAtPrice: null, etsyListingUrl: '[ETSY LISTING URL]', updated: '2026-10-14' },
  ],
} as const;
```

Alan anlamları:
- `price` = Etsy'de **o an görünen satış fiyatı**. `compareAtPrice` = Etsy'nin üstü çizili liste fiyatı. docs/15 önerisi
  (karar değil): düz $29.40, lansmanda düz $24.50; `compareAtPrice` varsayılan `null` — yalnız Etsy'de gerçek süreli kampanya varken dolar.
- `etsyListingUrl` = ilanın **Share & Save** linki (§7.2).

Kurallar:
- `isPlaceholder(v)`: `/^\[[^\]]+\]$/`.
- Yer tutucu fiyat yalnız `/pricing`'de `[PRICE]` olarak görünür. Etsy düğmesi `Coming soon on Etsy` olur. JSON-LD'de
  ilgili alan atlanır.
- `assertLaunchReady()`: `launched=true` iken bütün `live` tasarımların fiyatı ve ilan URL'si, `brand.name`,
  `support.email` ve `siteUrl` gerçek değerde olmalı; değilse build durur.
- Tasarım adı ve id'si tema `theme.json` ile eşleşir (test). Tema 04 `coming` iken hiçbir yerde listelenmez.
- Fiyat ve marka değiştiğinde **yalnız bu dosya** değişir. START HERE ve ilan metni ayrı dosyalardır (docs/05 §C); karar
  gelince üçü birlikte güncellenir.

---

## 11. Ölçüm planı

### 11.1 Araçlar

| Araç | Ne ölçer | Ne zaman |
|---|---|---|
| Google Search Console | Dizine giren sayfalar; sorgu, gösterim, tıklama; CWV (CrUX) | `launched` sonrası |
| Bing Webmaster Tools | Bing dizini, sorgular, **AI Performance** (Copilot alıntıları, temellendirme sorguları) | `launched` sonrası |
| Vercel Web Analytics | Ziyaret, kaynak, sayfa; özel olaylar (§9.9) | `provider: 'vercel'` sonrası |
| Vercel Speed Insights | Gerçek kullanıcı LCP, INP, CLS | aynı |
| Etsy Stats | İlan ziyareti, trafik kaynağı (yönlendiren alan), sipariş, dönüşüm | Etsy ilanı yayında olunca |
| Asistan paneli (elle) | §2.2 sorgu setinde marka anılıyor mu, alıntı URL'si, yanlış bilgi | ayda 1 |

### 11.2 Göstergeler ve ilk hedefler

Hedefler hipotezdir; 30 günlük ilk veriden sonra yeniden ayarlanır.

| Gösterge | Tanım | İlk hedef (90 gün) |
|---|---|---|
| Dizin kapsamı | sitemap URL'lerinin dizindeki oranı (GSC) | %100 |
| CWV | mobil p75 LCP, INP, CLS "good" | 3/3 |
| Demo açma oranı | `demo_open` / ana sayfa oturumu | ≥ %30 |
| Etsy tıklama oranı | `etsy_click` / tasarım sayfası oturumu | ≥ %10 |
| Siteden gelen Etsy ziyareti | Etsy Stats'ta alan adı | artan eğilim |
| Uzun kuyruk gösterimi | §2 kümelerinde GSC gösterimi | ayda ayda artan |
| Asistan anılma oranı | §2.2'de markanın anıldığı sorgu yüzdesi (6 motor) | başlangıç ölçülür, sonra artış |
| Yanlış bilgi | asistanların söylediği yanlış fiyat ya da özellik sayısı | 0 (görülürse ilgili sayfa ve llms.txt düzeltilir) |

### 11.3 Asistan paneli prosedürü

- Ayda bir aynı 18 sorgu sorulur: ChatGPT (arama açık), Perplexity, Google AI Mode / AI Overviews, Gemini, Claude (web
  araması), Copilot.
- Gizli pencere ve oturumsuz kullanılır.
- Kayıt tablosu: tarih · motor · sorgu · anıldı (E/H) · alıntılanan URL · rakipler · yanlış bilgi.
- Konum: `docs/14` eki ya da ayrı CSV. Konum entegratörün kararı.

### 11.4 Raporlama

Aylık tek sayfa: yukarıdaki tablo, en çok gösterim alan 10 sorgu, Bing AI alıntıları, en iyi ve en kötü 3 sayfa, bir
sonraki ayın 2 rehber konusu. Rehber konuları gerçek sorgu verisinden seçilir.

---

## 12. GPT görselleri (pazarlama kabuğu için)

**Neden az:** ürünü her zaman **gerçek tema ekranları** gösterir. GPT yalnız markadan bağımsız sahneleri ve nesneleri
üretir: telefon çerçevesi, stil sahneleri, dokular, küçük nesne görselleri, rehber kapakları. Tasarıma özel telefon
mockup'ları zaten G801/G803/G804 görevlerinde (`collections/<NN>/assets/gpt/mockups/phone_flatlay.png`). Tasarım sayfası
ve Pinterest pinleri bunları kullanır, burada yeniden üretilmez.

**Ortak stil (her prompt'ta tekrar edilir):**
- Premium editoryal kırtasiye fotoğrafı.
- Sıcak fildişi ve yulaf rengi keten, kalın pamuk kâğıt, az miktarda mat antik altın, fildişi ipek kurdele, beyaz bahçe
  gülü ve az adaçayı yeşili.
- Sol üstten yumuşak doğal pencere ışığı.
- Sakin, havadar, bol boşluklu.
- Yazı, harf, rakam, logo ve marka yok. Gerçek markaya, kişiye ya da başka bir satıcının tasarımına benzemez.
- Telefon ekranları **düz #00FF00**, yansımasız, telefon dik ve düz.

**Kayıt:** repo `muzaffergrl/davetiye-maker`, dal `main`, yollar aşağıda. Commit mesajı `G061-gpt: <ID> <dosya>`.
Push'tan önce `git pull --rebase origin main`. Repoya yazamayan ajan durur ve bunu açıkça söyler.

**Kontrol (her görsel):**
- Ölçü doğru.
- Yazı ve logo yok.
- Yeşil alan tek renk ve düz (yeşil isteyenlerde): `python3 tools/mockup_compose.py <mockup> <herhangi.png> /tmp/x.png --json`
  çıkış kodu 0 olmalı.
- Şeffaf olanlarda gerçek alfa.

### 12.1 Paralel ajan dağılımı

| Ajan | Görseller | Neden aynı sohbet |
|---|---|---|
| **A · telefonlu sahneler** | MK01, MK02, MK03, MK04, MK05 | Aynı telefon modeli. Önce MK01 üretilir, diğerlerinde referans verilir |
| **B · dokular ve küçük nesneler** | MK07, MK08, MK09, MK10, MK11 | Aynı zarf (MK09 → MK10 referans), aynı kâğıt |
| **C · rehber kapakları 1–3** | MK12, MK13, MK14 | Aynı ışık ve masa |
| **D · rehber kapakları 4–6 + About** | MK15, MK16, MK17, MK06 | Aynı ışık ve masa |

Ajanlar birbirini beklemez. Telefon modeli ajanlar arasında birebir aynı olmak zorunda değil; hepsi "markasız, ince
çerçeveli, şampanya-altın kasa" tarifini taşır.

### 12.2 Görseller

Her görselin prompt'u (İngilizce, aynen kullanılır) bu belgenin ekindedir ve G061 Sonuç'unda `gpt_prompts` olarak
verildi. Ölçüler GPT oranlarıdır (1024×1024, 1024×1536, 1536×1024).

| ID | Kaydet | Ölçü | Zemin | Kullanım |
|---|---|---|---|---|
| MK01 | `platform/public/marketing/gpt/mockups/phone_frame_front.png` | 1024×1536 | şeffaf, ekran #00FF00 | bütün telefon çerçeveleri (kartlar, sayfa ekranları, demo) |
| MK02 | `platform/public/marketing/gpt/scenes/hero_flatlay_desktop.png` | 1536×1024 | opak, ekran #00FF00 | masaüstü hero, varsayılan OG |
| MK03 | `platform/public/marketing/gpt/scenes/hero_flatlay_mobile.png` | 1024×1536 | opak, ekran #00FF00 | mobil hero |
| MK04 | `platform/public/marketing/gpt/scenes/guest_hand_phone.png` | 1024×1536 | opak, ekran #00FF00 | "RSVP" bölümü (misafir formu birleşik) |
| MK05 | `platform/public/marketing/gpt/scenes/desk_phone_editing.png` | 1536×1024 | opak, ekran #00FF00 | "Edit from your phone" (panel birleşik) |
| MK06 | `platform/public/marketing/gpt/scenes/studio_still_life.png` | 1536×1024 | opak | /about |
| MK07 | `platform/public/marketing/gpt/textures/paper_ivory_tile.png` | 1024×1024 | opak, dikişsiz | bölüm zemini (düşük opaklık) |
| MK08 | `platform/public/marketing/gpt/textures/linen_oat_tile.png` | 1024×1024 | opak, dikişsiz | alt bilgi ve vurgu bandı zemini |
| MK09 | `platform/public/marketing/gpt/spots/envelope_sealed.png` | 1024×1024 | şeffaf | How it works adım 2, /contact, 404 |
| MK10 | `platform/public/marketing/gpt/spots/envelope_open_card.png` | 1024×1024 | şeffaf | How it works adım 3, boş durumlar |
| MK11 | `platform/public/marketing/gpt/spots/reply_cards.png` | 1024×1024 | şeffaf | Features: RSVP, FAQ başlığı |
| MK12 | `platform/public/marketing/gpt/guides/how_to_make.png` | 1536×1024 | opak, ekran #00FF00 | G1 kapak (panel birleşik) |
| MK13 | `platform/public/marketing/gpt/guides/what_to_include.png` | 1536×1024 | opak | G2 kapak |
| MK14 | `platform/public/marketing/gpt/guides/timeline.png` | 1536×1024 | opak | G3 kapak |
| MK15 | `platform/public/marketing/gpt/guides/wording.png` | 1536×1024 | opak | G4 kapak |
| MK16 | `platform/public/marketing/gpt/guides/digital_etiquette.png` | 1536×1024 | opak, ekran #00FF00 | G5 kapak (zarf ekranı birleşik) |
| MK17 | `platform/public/marketing/gpt/guides/canva_vs_hosted.png` | 1536×1024 | opak, ekran #00FF00 | G6 kapak (home ekranı birleşik) |

Rehber kapakları 1200×630'a da kırpılır (oran 1.9). Önemli nesneler yüksekliğin ortadaki %78'inde durmalı (prompt'larda
yazılı).

### 12.3 Üretilmeyecekler

- Logo ya da marka işareti: marka adı belli değil. Kararla birlikte ayrı prompt yazılır. Favicon arayüz tipografisiyle
  geçici yapılır.
- QR'a benzeyen kare (şart 8).
- Kişi yüzü ya da "kurucu" fotoğrafı.
- Tema ekranı taklidi: ürün her zaman gerçek ekrandır.
- Tasarıma özel çiçek ve dekor: tema GPT paketlerinde zaten var.
- Birden fazla yeşil ekranlı sahne: `mockup_compose.py` yalnız en büyük yeşil bölgeyi doldurur.

### 12.4 Birleştirme planı (betik, GPT değil)

| Hedef | Mockup | Ekran (GERÇEK) |
|---|---|---|
| `marketing/designs/<id>/phone-{envelope,home,story,details,rsvp}.webp` | MK01 | `shots/g01, g02, g05, g06, g09` (her tema) |
| `marketing/composed/hero-desktop-hole.png` + poster | MK02 | yeşil → saydam delik; poster `g01` (seçili tema) |
| `marketing/composed/hero-mobile-hole.png` | MK03 | aynı |
| `marketing/composed/rsvp-guest.webp` | MK04 | `g10_rsvp_form` (03) |
| `marketing/composed/panel-editing.webp` | MK05 | `b04_panel_top` (**G060 sonrası yeniden alınır**) |
| `marketing/composed/guide-how-to.webp` | MK12 | `b08_panel_preview` (G060 sonrası) |
| `marketing/composed/guide-etiquette.webp` | MK16 | `g01_envelope` (01) |
| `marketing/composed/guide-canva-vs-hosted.webp` | MK17 | `g02_home_top` (03) |
| `marketing/og/home-1200x630.jpg` | MK02 birleşik | `g01` (03); marka adı kararla |

- Araç: `tools/mockup_compose.py` (cover kipi, hafif perspektif desteği).
- "Delik" çıktısı için küçük bir ek gerekiyor: yeşil maskeyi alfa olarak dışa ver (`--hole`). Bu ek `tools/` altında
  olduğu için G061'in `yazar:` listesinde yok; ayrı küçük görev ya da `yazar:` genişletmesi gerekir.

---

## 13. Uygulama sırası, bağımlılıklar, açık kararlar

### 13.1 Uygulama aşamaları (G061 kod aşaması)

1. **İskelet:**
   - config, facts, placeholders, seo, schema.
   - `(marketing)` layout.
   - Ana sayfa, galeri, 2 tasarım sayfası, How it works, Features, Pricing, FAQ, About, Contact, Privacy.
   - robots, sitemap, llms.
   - Testler, 390/1280 önizlemeler.
   - `launched=false`.
2. **Görseller:** GPT görselleri (§12) geldikçe birleştirme betiği; o zamana kadar GERÇEK ekranlar çerçevesiz,
   yuvarlatılmış köşeyle gösterilir.
3. **Rehberler:** 6 rehber, kapaklar, OG.
4. **Yayın anahtarı:** G062 kararları (marka, alan adı, fiyat, e-posta, politikalar) → config → `launched=true` → §9.14.
5. **Yayın sonrası:** ölçüm (§11), ayda 2 rehber, Pinterest pinleri, asistan paneli.

### 13.2 Bağımlılıklar

| Ne | Kimden | Etki |
|---|---|---|
| Marka adı, alan adı, fiyat, destek e-postası, yanıt süresi, iade, kayıp link, uzatma, paket | G062 + kullanıcı | `launched=true` için şart |
| Panel v2 ekranları, düzenleme hakkı sayısı, 12 ay arşivi | G060 | Panel görselleri, SSS ve "12 ay" iddiası `[VERIFY]` kalkar |
| Tema 04 canlı | G404 | `status: 'live'` |
| Tasarıma özel telefon mockup'ları | G801/G803/G804 | Pinterest pinleri ve tasarım sayfası sahneleri |
| Pazarlama GPT görselleri | §12 (kullanıcının GPT ajanları) | Hero ve sahneler |
| Etsy ilanları yayında ve URL'leri belli | G9NN/G062 | Etsy düğmeleri ve Offer |
| Gerçek telefon testi | entegratör | "Designed for phone screens" dışındaki cihaz iddiaları |

### 13.3 Entegratöre: `yazar:` genişletmeleri

G061 kod aşaması için şunlar gerekiyor (bugün listede değil):
- `platform/app/page.tsx` (silinecek)
- `platform/app/layout.tsx` (pazarlama ile çakışan body stili ve robots için küçük değişiklik; G060 ile koordinasyon)
- `platform/lib/slug.ts` ve `platform/tests/slug*.test.ts` (§5.4)
- `platform/scripts/marketing-assets.ts` (türev ve birleştirme), `tools/mockup_compose.py` (`--hole`)
- `platform/package.json` ve `package-lock.json` (sürümü sabitlenmiş ikon kütüphanesi; isteğe bağlı analitik paketleri)
- `platform/previews/g061/`
- Çift sitesi `noindex` kararı verilirse `platform/lib/site/render.ts` ve ilgili test.

### 13.4 Kullanıcının vereceği kararlar (tek tek, kısa)

1. **Marka adı ve alan adı.** docs/15 önerisi *Seal & Story* / `sealandstory.com`. İndeksleme bu karardan sonra açılır.
2. **Tasarım başına fiyat** ve kampanya politikası. docs/15 önerisi Strateji A. Sitedeki fiyat her zaman Etsy'deki
   fiyatla aynıdır.
3. **Destek e-postası ve yanıt süresi.** docs/15 önerisi: `hello@<alan adı>`, 24 saat.
4. **Çift sitelerinin arama motorlarında görünmesi:** öneri varsayılan **kapalı** (`noindex`). Bu karar G061'e özgü,
   docs/15 ve docs/16'da yok. Karar gelene kadar `noindex` uygulanıyor (§5.5).
5. **"Made with [BRAND]" bağlantısı** çift sitelerinin altında: docs/15 önerisi her misafir sayfasında ince alt bilgi.
   G061 bu bağlantının hedefini (ana sayfa, UTM) karşılar.
6. **Yapay zekâ eğitim botları** (GPTBot, ClaudeBot, Google-Extended …): öneri **pazarlama sayfalarına açık**. Markanın
   asistanlarca bilinmesi amaca uygun; arama botları her durumda açık. Çift siteleri eğitim botlarına her iki seçenekte
   de kapalı (§9.5).
7. **Analitik:** öneri Vercel Web Analytics ve Speed Insights (Pro'da var, çerezsiz [VERIFY]).
8. İade, kayıp link, 12 ay sonrası uzatma, silme süreci metinleri (G062).

---

## 14. Uygulama durumu (G061 kod aşaması, 2026-10-14)

Satış sitesi `platform/app/(marketing)/` altında kuruldu. Yayın yapılmadı, alan adı alınmadı, görsel üretilmedi. Site
`launched: false` ile duruyor: her sayfa `noindex, follow`, sitemap boş, yer tutucular görünür.

### 14.1 Ne var

| Parça | Dosya | Not |
|---|---|---|
| Tek ayar | `platform/lib/marketing/config.ts` | `[BRAND]`, `[DOMAIN]`, `[PRICE]`, `[SUPPORT EMAIL]`, `[RESPONSE TIME]`, `[ETSY SHOP URL]`, `[SHOP NAME]`, `[ETSY LISTING URL]`, politika yer tutucuları; `verified` bayrakları (aşağıda) |
| Yayın kapısı | `lib/marketing/placeholders.ts` | `launched: true` iken eksik karar varsa build durur (`assertLaunchReady`, layout'tan). Ek şartlar: `siteUrl` marka alan adı olmalı (vercel.app ile indeksleme açılmaz), Etsy linkinde `utm_` olmamalı, `verified.editRights/archive/privacyText` true olmalı |
| İddialar | `lib/marketing/facts.ts` | Dahil / dahil değil listeleri, düzenlenebilenler, sınırlar (`lib/content/limits.ts`'ten), docs/16 §11.7 hak metni, Canva karşılaştırması (rakip adı yok). "Tested on iPhone" yalnız `verified.realDevices` ile |
| Tasarım metinleri | `lib/marketing/designs.ts` | Açılış metinleri tema README'si ve gerçek ekranlarla karşılaştırılarak yazıldı. 04 `coming`: hiçbir yerde listelenmez |
| SSS | `lib/marketing/faq.ts` | 7 grup, 31 soru; her yanıt 40–80 kelime, ilk cümle ≤ 25 kelime (test). "Why pay … when free wedding websites exist?" ücretsiz araçları küçümsemeden yanıtlar, rakip adı vermez (adlar birincil kaynakta doğrulanınca eklenebilir) |
| Rehberler | `platform/content/guides/*.md` | 6 rehber, 1.250–1.470 kelime; hızlı yanıt, tablo/kontrol listesi, 4 soruluk SSS, kaynak linkleri (Emily Post Institute, Canva Help Centre). İstatistik, yorum, kurgu yazar yok |
| Şema | `lib/marketing/schema.ts` | Organization, WebSite, WebPage türleri, ItemList, BreadcrumbList, Product (+Offer yalnız gerçek fiyat ve Etsy linkiyle), VideoObject, Article, FAQPage. Yer tutucu taşıyan alan ve SSS yanıtı JSON-LD'ye yazılmaz; puan/yorum yok |
| Tarama | `lib/marketing/crawl.ts` + `app/(marketing)/{robots.txt,sitemap.xml,llms.txt,llms-full.txt}/route.ts` | Statik. robots §9.5 (`/start$`, `/start?`, `/start/`; çift slug'ları arama botlarına kapanmaz), eğitim botları yalnız pazarlama yollarına (config'ten; çift siteleri her durumda kapalı). Çift siteleri `X-Robots-Tag: noindex` (§5.5) |
| Görseller | `scripts/marketing-assets.ts` → `public/marketing/{designs,panel}/`, `lib/marketing/assets.json` | Yalnız GERÇEK ekranlar (G059 çekimi, 320/480/640 WebP) ve gerçek açılış kaydından 10 sn H.264 klip (~350 KB) + poster. Panel ekranları bugünkü panel: **G060 bitince betik yeniden çalıştırılır** |
| Bileşenler | `components/marketing/` | Sunucu bileşenleri; istemci JS yalnız `Demo.tsx` (canlı demo cephesi + diyalog), `LoopVideo.tsx`, `Tracker.tsx` |
| İkonlar | `lucide-react@1.46.0` (G060 ile aynı sürüm) | Yalnız arayüz ikonu. Sekme ikonu geçici: lucide "mail" (`public/marketing/favicon.svg`) |

Sayfalar: `/`, `/designs`, `/designs/blush-garden-rose`, `/designs/olive-ivory`, `/how-it-works`, `/features`, `/pricing`,
`/faq`, `/guides` + 6 rehber, `/about`, `/contact`, `/privacy`, bilinmeyen tasarım/rehber için pazarlama 404'ü.

### 14.2 Belgeden sapmalar (bilerek)

- Gövde yazısı Inter değil, sistem yazı tipi. Lighthouse'ta LCP yolundan ~48 KB yazı tipi çıktı. Başlıklar Cormorant Garamond (500/600, `next/font`, kendi sunucumuzdan).
- Başlık değişiklikleri (12 karakterlik marka adıyla ≤ 60 karakter): How it works → `How It Works: Etsy Order to Wedding Website`, Features → `Wedding Website Features: RSVP, Calendar, QR`, Pricing → `Pricing: One Etsy Purchase, No Subscription`, Designs → `Wedding Website Designs with Envelope Opening`.
- GPT görselleri (MK01–MK17) henüz yok. §13.1 adım 2'deki gibi gerçek ekranlar çerçevesiz, yuvarlatılmış köşeyle gösteriliyor. Varsayılan paylaşım görseli `blush-garden-rose` temasının kendi `og-1200x630.jpg`'i. Tasarım sayfaları kendi temalarının `og` görselini kullanıyor.
- Dokunulmayanlar:
  - `app/layout.tsx`: kök `robots` pazarlama layout'unda eziliyor; kabuk kendi zeminini çiziyor.
  - `lib/site/render.ts`: kod aşamasında dokunulmadı; inceleme düzeltmesinde yayındaki çift sayfalarına
    `X-Robots-Tag: noindex` eklendi (karar 4 gelene kadar varsayılan, §5.5).
  - `tools/mockup_compose.py --hole`: GPT görselleri gelince yapılacak.
  - `next.config.ts`: `experimental.inlineCss` 7 KB'lık render-blocking CSS'i kaldırırdı. Öneri olarak bırakıldı.
- Analitik: `provider: 'none'`. `track()` olayları DOM'a yazıyor. `'vercel'` seçilirse `@vercel/analytics` paketi eklenmeli; şu an kurulu değil, **denenmedi**.
- `/start` başlığı "Already bought a design? Start your website" olarak menü ve alt bilgide var.

### 14.3 Testler ve ölçümler (yerel production build)

- `npm test`: 329/329 (299 eski + 30 yeni: `tests/marketing-{slug,config,content,schema,crawl,markdown,build}.test.ts`). `marketing-build` build çıktısı yoksa ya da eskiyse kendini atlar.
- `npm run typecheck` ve `npm run build` (trace-check dahil) temiz.
- `tests/marketing-browser.ts` (build sonrası): **170/170**. 18 sayfa × 390/1280 kontrol edildi:
  - HTTP 200, yatay kaydırma yok, kenardan taşan öğe yok, tek H1.
  - Demo cephesi: dokunmadan önce tema isteği yok; telefonda modal diyalog, Esc ve odak dönüşü çalışıyor; geniş ekranda yerinde ölçekli demo açılıyor.
  - Kart düğmesi, tasarım çipleri, mobil menü, SSS, yapışkan çubuk çalışıyor.
  - Sonuçlar `platform/previews/g061/` altında: ekran görüntüleri ve `checks.json`.
- Lab ölçümü (CDP: CPU 4×, 150 ms RTT, 1,6 Mbps, 390 px):

  | Sayfa | LCP | CLS | Aktarılan |
  |---|---|---|---|
  | `/` | 1,74 s | 0 | 300 KB |
  | `/designs/olive-ivory` | 1,73 s | 0 | 300 KB |
  | Rehber | 0,82 s | 0 | 198 KB |

  - İlk yük JS'i 139 KB; §9.8 bütçesi 130 KB'tı. Bu yükün ~125 KB'ı Next ve React çalışma zamanı.
- Lighthouse 13.5.0 (sürüm sabit, geçici klasöre kuruldu; mobil, simülasyonlu kısıtlama), `previews/g061/lighthouse.json`:

  | Sayfa | Performans | Erişilebilirlik | En iyi uygulamalar | SEO |
  |---|---|---|---|---|
  | `/` | 93 | 100 | 100 | 69 |
  | `/designs/olive-ivory` | 96 | 100 | 100 | 69 |
  | Rehber | 88 | 100 | 100 | 66 |
  | `/faq` | 97 | 100 | 100 | 66 |

  - SEO'da kalan tek kusur `is-crawlable`: yayın öncesi `noindex` bilerek konuldu.
  - Ölçümler aynı makinede çalışan başka ajanlar yüzünden oynak. Örneğin rehberin performansı bir çalıştırmada 97, sonrakinde 88 çıktı.
- **Doğrulanmayanlar:**
  - Canlıya yayın yapılmadı.
  - Google Rich Results Test ve validator.schema.org denenmedi. Doğrulama yalnız yerel testle yapıldı.
  - Gerçek telefonda deneme yapılmadı.
  - Etsy'ye erişim olmadığı için link biçimi yalnız kuralla denetlendi.
  - Dış kaynak linklerinin (Emily Post, Canva) açıldığı bu ortamdan doğrulanamadı. Adresler arama sonuçlarından alındı.

### 14.4 Yayına geçiş listesi (sırayla)

1. Kararları `config.ts`'e işle (§13.4):
   - marka adı, alan adı, `MARKETING_SITE_URL`;
   - fiyatlar ve Etsy Share & Save linkleri;
   - destek e-postası ve yanıt süresi;
   - politika metinleri.
2. G060 canlıya çıkınca `verified.editRights` ve `verified.archive` alanlarını true yap. Panel ekranları için `node scripts/marketing-assets.ts` betiğini çalıştır.
3. Gizlilik metni gözden geçirilince `verified.privacyText` alanını true yap.
4. GPT görselleri (Ek A) geldikçe birleştirme adımını ayrı görev olarak aç (`--hole` + hero sahneleri).
5. `launched: true` yap. Build, eksik karar kalmışsa durur.
6. §9.14 adımlarını uygula: Search Console, Bing Webmaster Tools, IndexNow, Rich Results Test, Vercel Firewall bot kuralları.

---

## Ek A — GPT prompt'ları (İngilizce, aynen kullanılır)

Her prompt kendi başına çalışır; stil ve kurallar içinde yazılı. Paralel dağılım §12.1'de, kayıt ve commit kuralı §12'nin başında.

### MK01 · phone_frame_front.png (ajan A)
**Kaydet:** `platform/public/marketing/gpt/mockups/phone_frame_front.png` · 1024×1536 · transparent PNG (real alpha); screen #00FF00  
**Kullanım:** every phone frame on the site (design cards, page screens, live demo)

```
Product cut-out of a generic modern smartphone with no brand: thin even black bezels, softly rounded corners, a tiny round front camera hole at the top center and a warm champagne-gold metal frame. Its screen is a perfectly flat, uniform pure green (#00FF00) from edge to edge inside the bezel, with no reflections, no glare, no icons and no status bar, and a tall modern screen proportion of about 9:19.5. The phone is seen perfectly straight from the front, centered, upright, not tilted and not rotated, occupying about 72% of the image height with generous empty space around it. Real alpha-transparent background (true PNG transparency, not white and not a checkerboard pattern). No cast shadow, no drop shadow, no glow and no reflection under the phone. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: real alpha transparency; green screen flat and single-colored; screen width/height about 0.46; phone straight; no shadow; no logo or text.

### MK02 · hero_flatlay_desktop.png (ajan A)
**Kaydet:** `platform/public/marketing/gpt/scenes/hero_flatlay_desktop.png` · 1536×1024 · opaque; screen #00FF00  
**Kullanım:** desktop hero (live demo sits in the screen) and default share image

```
Top-down flat-lay photograph on softly creased oat-colored linen. In it lies a generic modern smartphone with no brand: thin even black bezels, softly rounded corners, a tiny round front camera hole at the top center and a warm champagne-gold metal frame. Its screen is a perfectly flat, uniform pure green (#00FF00) from edge to edge inside the bezel, with no reflections, no glare, no icons and no status bar, and a tall modern screen proportion of about 9:19.5. The phone lies screen-up, perfectly straight and upright (not tilted, not rotated), in the right part of the frame: its center at about 68% of the image width and 50% of the height, occupying about 70% of the image height. Arranged loosely around the phone toward the right and bottom edges: a closed ivory envelope with a plain blank antique-gold wax seal, a loose ivory silk ribbon, two white garden roses, a small sprig of soft sage greenery and a blank deckle-edged cotton card. The left 45% of the image is calm, evenly lit linen with only gentle fabric texture and no objects at all (space reserved for a headline). Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: left 45% empty; exactly one green area, flat and single-colored; phone straight; wax seal blank; no text or logo.

### MK03 · hero_flatlay_mobile.png (ajan A)
**Kaydet:** `platform/public/marketing/gpt/scenes/hero_flatlay_mobile.png` · 1024×1536 · opaque; screen #00FF00  
**Kullanım:** mobile hero (live demo poster in the screen)

```
Vertical top-down flat-lay photograph on softly creased oat-colored linen. In it lies a generic modern smartphone with no brand: thin even black bezels, softly rounded corners, a tiny round front camera hole at the top center and a warm champagne-gold metal frame. Its screen is a perfectly flat, uniform pure green (#00FF00) from edge to edge inside the bezel, with no reflections, no glare, no icons and no status bar, and a tall modern screen proportion of about 9:19.5. The phone lies screen-up, perfectly straight and upright (not tilted, not rotated), centered horizontally, its center at about 60% of the image height, occupying about 55% of the image height. Around the lower half: a closed ivory envelope with a plain blank antique-gold wax seal peeking in from the bottom-left, a loose ivory silk ribbon, two white garden roses at the bottom-right and a small sprig of soft sage greenery. The top 30% of the image is calm, evenly lit linen with no objects (space for a headline). Keep every object inside the central 85% of the width. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: top 30% empty; exactly one green area, flat; phone straight and centered; objects within central 85% width; no text or logo.

### MK04 · guest_hand_phone.png (ajan A)
**Kaydet:** `platform/public/marketing/gpt/scenes/guest_hand_phone.png` · 1024×1536 · opaque; screen #00FF00  
**Kullanım:** 'RSVPs without the spreadsheet' section (guest RSVP form composited)

```
Vertical lifestyle photograph. A woman's relaxed hand holds a generic modern smartphone with no brand: thin even black bezels, softly rounded corners, a tiny round front camera hole at the top center and a warm champagne-gold metal frame. Its screen is a perfectly flat, uniform pure green (#00FF00) from edge to edge inside the bezel, with no reflections, no glare, no icons and no status bar, and a tall modern screen proportion of about 9:19.5. The phone is held upright with the screen facing the camera straight on (not tilted, not rotated), centered horizontally, its center at about 45% of the image height, occupying about 55% of the image height. The hand looks natural with five correctly formed fingers, a short neutral manicure and a simple thin gold band; no face or body is visible beyond the hand and wrist. Background: a softly blurred, warm candlelit dinner table with ivory linen, glassware and white flowers (gentle bokeh). Warm, elegant, realistic. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: fingers correct (five, natural); no face; exactly one green area, flat, facing camera straight; no text or logo.

### MK05 · desk_phone_editing.png (ajan A)
**Kaydet:** `platform/public/marketing/gpt/scenes/desk_phone_editing.png` · 1536×1024 · opaque; screen #00FF00  
**Kullanım:** 'Made to edit from your phone' section (panel screen composited)

```
Top-down photograph of a light natural-oak desk in soft morning light. On it lies a generic modern smartphone with no brand: thin even black bezels, softly rounded corners, a tiny round front camera hole at the top center and a warm champagne-gold metal frame. Its screen is a perfectly flat, uniform pure green (#00FF00) from edge to edge inside the bezel, with no reflections, no glare, no icons and no status bar, and a tall modern screen proportion of about 9:19.5. The phone lies screen-up, perfectly straight and upright (not tilted, not rotated), slightly left of center: its center at about 40% of the image width and 50% of the height, occupying about 70% of the image height. Around it: a cup of coffee on a white saucer at the top right, an open notebook with blank cream pages and a pencil at the right, and a small ceramic dish with a thin gold ring and two dried rose buds at the bottom left. Organized and calm, with plenty of empty desk. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: exactly one green area, flat; phone straight; notebook pages blank; no text or logo.

### MK06 · studio_still_life.png (ajan D)
**Kaydet:** `platform/public/marketing/gpt/scenes/studio_still_life.png` · 1536×1024 · opaque  
**Kullanım:** /about page image (alt: paper swatches, ribbon and paint on a work table)

```
Top-down still-life photograph of a stationery designer's work table, with no people. On ivory linen: a watercolor palette with soft blush, olive green, dusty blue and ivory paints, two fine brushes, small torn paper swatches in those colors, spools of silk ribbon, a plain unengraved brass wax-seal stamp lying next to a blank antique-gold wax seal, a few pressed flowers and a closed ivory envelope. Artful but uncluttered, with empty linen in the center-left third. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: no people; stamp and seal completely blank; no text or logo.

### MK07 · paper_ivory_tile.png (ajan B)
**Kaydet:** `platform/public/marketing/gpt/textures/paper_ivory_tile.png` · 1024×1024 · opaque, seamless tile  
**Kullanım:** section backgrounds at low opacity

```
Seamless, tileable texture of warm ivory heavyweight cotton paper (average color close to #F8F3EA), seen straight on and evenly lit. Only very subtle natural fibers and a gentle tooth, low contrast so dark text stays easy to read on top. No shadows, no vignette, no folds, no stains, no deckled edges and no objects. The left and right edges and the top and bottom edges must continue seamlessly when the image is tiled. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: 2x2 tiling shows no seams; low contrast; even lighting, no vignette.

### MK08 · linen_oat_tile.png (ajan B)
**Kaydet:** `platform/public/marketing/gpt/textures/linen_oat_tile.png` · 1024×1024 · opaque, seamless tile  
**Kullanım:** footer and accent band backgrounds

```
Seamless, tileable texture of natural oat-colored linen fabric (average color close to #E9E1D3), seen straight on, flat and evenly lit, with a fine visible weave. No wrinkles, no folds, no shadows, no vignette and no objects. The edges must continue seamlessly when the image is tiled. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: 2x2 tiling shows no seams; flat even lighting.

### MK09 · envelope_sealed.png (ajan B)
**Kaydet:** `platform/public/marketing/gpt/spots/envelope_sealed.png` · 1024×1024 · transparent PNG (real alpha)  
**Kullanım:** How it works step 2, /contact, 404 page

```
Product cut-out photographed from directly above: a single closed ivory envelope in landscape orientation, back side up with a pointed V flap, sealed at the flap tip with a plain blank antique-gold wax seal (no letters, no monogram, no symbol) and a thin ivory silk ribbon tucked under the seal. Perfectly straight and centered, occupying about 72% of the image width, with generous empty space around it. Realistic cotton paper texture; the flap edge is clearly visible, with a soft contact shade only where the flap overlaps the envelope body. Real alpha-transparent background (true PNG transparency), no cast shadow, no drop shadow and no glow. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: real alpha transparency; seal blank; no cast shadow; flap edge readable; no text.

### MK10 · envelope_open_card.png (ajan B)
**Kaydet:** `platform/public/marketing/gpt/spots/envelope_open_card.png` · 1024×1024 · transparent PNG (real alpha)  
**Kullanım:** How it works step 3, empty states

```
Product cut-out photographed from directly above, matching the envelope of the previous image (MK09) if it is available as a reference: the same ivory envelope, now open, its V flap folded up, with the broken blank antique-gold wax seal still attached at the flap tip, and a blank ivory card with deckled edges pulled halfway out upward. The card face is completely blank. Perfectly straight and centered, occupying about 72% of the image width, with generous empty space around it. Real alpha-transparent background, no cast shadow and no glow. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: same envelope as MK09; card blank; real alpha; no cast shadow; no text.

### MK11 · reply_cards.png (ajan B)
**Kaydet:** `platform/public/marketing/gpt/spots/reply_cards.png` · 1024×1024 · transparent PNG (real alpha)  
**Kullanım:** Features RSVP section, FAQ header

```
Product cut-out photographed from directly above: a small fanned stack of three blank ivory reply cards with deckled edges, tied loosely with a narrow ivory silk ribbon in a small bow, with a tiny sprig of soft sage greenery tucked under the ribbon. All card faces are completely blank. Centered and straight, occupying about 65% of the image width, with generous empty space around it. Real alpha-transparent background, no cast shadow and no glow. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: cards blank; real alpha; no cast shadow; no text.

### MK12 · how_to_make.png (ajan C)
**Kaydet:** `platform/public/marketing/gpt/guides/how_to_make.png` · 1536×1024 · opaque; screen #00FF00  
**Kullanım:** guide 1 cover 'How to make a wedding website on your phone' (panel screen composited)

```
Top-down flat-lay photograph on oat-colored linen for a blog cover. In it lies a generic modern smartphone with no brand: thin even black bezels, softly rounded corners, a tiny round front camera hole at the top center and a warm champagne-gold metal frame. Its screen is a perfectly flat, uniform pure green (#00FF00) from edge to edge inside the bezel, with no reflections, no glare, no icons and no status bar, and a tall modern screen proportion of about 9:19.5. The phone lies screen-up, perfectly straight and upright (not tilted, not rotated), its center at about 42% of the image width and 50% of the height, occupying about 68% of the image height. To its right: a blank deckle-edged cotton card, a pencil, a loose ivory silk ribbon and one white garden rose; to its left: a softly folded linen napkin. Keep every important object inside the middle 78% of the image height, because the image will also be cropped to 1200x630. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: exactly one green area, flat; phone straight; objects within the middle 78% of the height; no text or logo.

### MK13 · what_to_include.png (ajan C)
**Kaydet:** `platform/public/marketing/gpt/guides/what_to_include.png` · 1536×1024 · opaque  
**Kullanım:** guide 2 cover 'What to put on your wedding website'

```
Top-down 'knolling' flat-lay photograph on oat-colored linen for a blog cover: a neat, evenly spaced grid of blank wedding stationery and small details: a blank invitation card, a blank details card, a blank reply card, an ivory envelope with a plain blank antique-gold wax seal, a small vintage brass key, a pressed white flower, a tiny ceramic ring dish and a coil of ivory silk ribbon. Everything is blank, aligned and separated by generous even gaps. Keep every important object inside the middle 78% of the image height, because the image will also be cropped to 1200x630. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: all cards blank; grid tidy; objects within the middle 78% of the height; no text.

### MK14 · timeline.png (ajan C)
**Kaydet:** `platform/public/marketing/gpt/guides/timeline.png` · 1536×1024 · opaque  
**Kullanım:** guide 3 cover 'When to share your wedding website and set the RSVP deadline'

```
Still-life photograph at a gentle three-quarter angle on ivory linen for a blog cover: a small brass-and-glass hourglass with pale sand; beside it a stack of three sealed ivory envelopes with plain blank wax seals, tied together with an ivory silk ribbon; a few scattered white rose petals and one sprig of soft sage greenery. No clocks, calendars, dials or anything with numbers. Shallow depth of field. Keep every important object inside the middle 78% of the image height, because the image will also be cropped to 1200x630. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: no clock/calendar/numbers; seals blank; objects within the middle 78% of the height; no text.

### MK15 · wording.png (ajan D)
**Kaydet:** `platform/public/marketing/gpt/guides/wording.png` · 1536×1024 · opaque  
**Kullanım:** guide 4 cover 'Wedding website wording'

```
Top-down photograph on ivory linen for a blog cover: an antique fountain pen with a gold nib resting diagonally across two blank ivory cotton cards, a small square glass ink bottle with dark ink, a sheet of blank blotting paper and a loose ivory silk ribbon. The cards are completely blank: no writing, no letters and no ink marks. Keep every important object inside the middle 78% of the image height, because the image will also be cropped to 1200x630. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: cards completely blank (no handwriting); objects within the middle 78% of the height; no text or logo.

### MK16 · digital_etiquette.png (ajan D)
**Kaydet:** `platform/public/marketing/gpt/guides/digital_etiquette.png` · 1536×1024 · opaque; screen #00FF00  
**Kullanım:** guide 5 cover 'Digital wedding invitations: etiquette' (envelope screen composited)

```
Top-down photograph of a small round cafe table covered with an ivory linen cloth, for a blog cover. On it lies a generic modern smartphone with no brand: thin even black bezels, softly rounded corners, a tiny round front camera hole at the top center and a warm champagne-gold metal frame. Its screen is a perfectly flat, uniform pure green (#00FF00) from edge to edge inside the bezel, with no reflections, no glare, no icons and no status bar, and a tall modern screen proportion of about 9:19.5. The phone lies screen-up, perfectly straight and upright (not tilted, not rotated), left of center: its center at about 38% of the image width and 50% of the height, occupying about 68% of the image height. To its right: a blank printed invitation card standing half out of an open ivory envelope with a plain blank antique-gold wax seal, a cup of tea on a saucer and a small bud vase with white flowers. The mood suggests digital and paper side by side. Keep every important object inside the middle 78% of the image height, because the image will also be cropped to 1200x630. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: exactly one green area, flat; phone straight; card blank; objects within the middle 78% of the height; no text.

### MK17 · canva_vs_hosted.png (ajan D)
**Kaydet:** `platform/public/marketing/gpt/guides/canva_vs_hosted.png` · 1536×1024 · opaque; screen #00FF00  
**Kullanım:** guide 6 cover 'Canva wedding website template vs a hosted wedding website' (home screen composited)

```
Top-down photograph on a light natural-oak desk for a blog cover. On it lies a generic modern smartphone with no brand: thin even black bezels, softly rounded corners, a tiny round front camera hole at the top center and a warm champagne-gold metal frame. Its screen is a perfectly flat, uniform pure green (#00FF00) from edge to edge inside the bezel, with no reflections, no glare, no icons and no status bar, and a tall modern screen proportion of about 9:19.5. The phone lies screen-up, perfectly straight and upright (not tilted, not rotated), right of center: its center at about 62% of the image width and 50% of the height, occupying about 68% of the image height, resting partly on a loose stack of blank cream proof sheets held with a brass paper clip. On the left: a pair of small gold scissors, a bone folder and a few blank paper swatches. Keep every important object inside the middle 78% of the image height, because the image will also be cropped to 1200x630. Style: premium editorial stationery photography for a wedding brand: warm ivory and oat linen, heavyweight cotton paper, a touch of muted antique gold, ivory silk ribbon, white garden roses and a little soft sage greenery used sparingly; soft natural window light from the top-left; calm, airy and uncluttered with generous empty space; realistic textures and believable soft shadows. Absolutely no text, letters, numbers, logos, watermarks or brand marks anywhere (not on the phone, paper, seals, stamps or fabric). Nothing may resemble a real brand, a real person or another seller's design.
```
Kontrol: exactly one green area, flat; phone straight; all paper blank; objects within the middle 78% of the height; no text or logo.

