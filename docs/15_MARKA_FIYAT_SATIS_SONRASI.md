# Marka, fiyat ve satış sonrası: karar belgesi (G062, 2026-10-14)

Bu belge kullanıcının K25'te istediği üç karar için hazırlandı: marka/dükkân adı, Etsy merkezli fiyat ve satış sonrası müşteriyi
platforma bağlama. **Belge karar değildir, öneridir.** Kararlar kullanıcınındır (§5). Ürün adları ve alıcıya giden metinler İngilizce.

**Kaynak ve sınırlar.** Üç araştırma 2026-10-14'te salt okuma olarak yapıldı (marka adı, fiyat, satış sonrası).
- **Hiçbir alan adı satın alınmadı ya da ayrılmadı.** Vercel kayıt aracında yalnız müsaitlik ve fiyat sorgulandı.
- Şu siteler bu ortamdan **açılamadı** (DNS hatası / proxy 403): etsy.com, help.etsy.com, developers.etsy.com, vercel.com,
  stripe.com, paddle.com, docs.lemonsqueezy.com, tmsearch.uspto.gov, trademarks.justia.com, trademarkia.com, instagram.com.
  Bu kaynaklardan gelen her bilgi aşağıdaki etiketlerden birini taşır ve yayından önce doğrulanmalıdır.

| Etiket | Anlamı |
|---|---|
| **[R-özet]** | Resmi sayfa; içerik arama motorundaki alıntıdan, sayfa doğrudan okunmadı |
| **[İkincil]** | Üçüncü taraf rehber, blog, forum ya da hukuk bürosu özeti |
| **[Ölçüm]** | Vercel aracı ya da repodaki kod/belge |
| **[Varsayım]** | Kaynaksız model varsayımı (§3.9) |

**Bağımsız inceleme (2026-10-14, ikinci tur).** Belge eleştirel gözle yeniden kontrol edildi. Düzeltmeler yerinde yapıldı ve
"(inceleme)" diye işaretlendi:
- 5 ad adayının .com'u Vercel aracıyla yeniden sorgulandı: hepsi müsait (§2.2). Mühür motifi katalogdaki 20 tasarımın yalnız
  5'inde var (§2.2).
- Marj hesabı §3.6 formülüyle yeniden yapıldı. Satış başına netler doğru çıktı. "$1,000 net için satış" sütununda iki sayı
  düzeltildi (§3.7).
- Offsite Ads cümlesi yanlıştı: $5.29 yalnız reklam ücreti. O siparişte Etsy'nin toplam payı ≈ $11.90 (§1, §3.2).
- Yeni risk 7: **kalıcı %40 indirim** Etsy satıcı rehberine ve FTC'nin referans fiyat kuralına ters düşüyor (§3.9).
- Yeni risk 8: "yasal kimlik yok" kararı, Etsy'nin bireysel satıcıdan istediği kimlik doğrulamasını kaldırmıyor.
- CA/AU ödeme işleme ücreti eklendi (§3.2). Destek e-postası için ücretsiz seçenekler (§4.5) ve "bu hafta" karar listesi (§5) eklendi.
- Siteler hâlâ bu ortamdan açılamıyor: etsy.com, vercel.com, resend.com, improvmx.com, zoho.com, ftc.gov, ecfr.gov (proxy 403).
  Yeni bilgiler arama özetlerinden; etiketler aynı anlamda.

---

## 0. K26 güncellemesi (2026-10-14)

- **Ad:** kullanıcı adında **BKE** istiyor; Seal & Story ve yedekleri düştü. Çalışma adı **BKE Studio** (Etsy `BKEStudio`, 9 karakter).
  Kesin onaydan sonra satış sitesi, "Made with" alt bilgisi ve `PROJECT_STATE.brand_name` doldurulur.
- **Alan adı [Ölçüm]:** `get_bulk_availability` — bkestudio.com, bkestudio.co, bke.studio, bkeinvites.com, bkeinvite.com,
  bkeweddings.com, bkeatelier.com, bkepaper.com, bkeevents.com **müsait**; bkestudios.com alınmış. **Satın alma yok** (K26).
- **Çakışma [R-özet]:** ABD'de **BKE**, Buckle'ın giyim markası; Buckle Brands adına giyim, kozmetik ve takı sınıflarında
  BKE / BKE LOUNGE / BKE SPORT / BOUTIQUE BY BKE kayıtları görünüyor (Justia özeti). Sektör farklı (dijital düğün sitesi), risk
  düşük ama sıfır değil: Buckle'a benzeyen logo/yazı stili kullanılmaz, ad her yerde "BKE Studio" olarak ikinci kelimeyle yazılır.
  Resmi USPTO/TÜRKPATENT araması yapılmadı. "BKEStudio" adıyla Etsy dükkânı arama özetinde çıkmadı (Etsy bu ortamdan açılamıyor).
- **Destek e-postası:** Gmail (öneri `bkestudio.help@gmail.com`; müsaitliği hesap açılırken görülür). Alan adı alınmadığı için
  Resend şimdilik yok; düzenleme linki ekranda gösterilir. Linki e-postayla göndermek için ileride Gmail SMTP (uygulama şifresi,
  kullanıcının tek seferlik onayı) ya da alan adı + Resend.
- **"Yüksek liste fiyatı + %50 indirim" sorusu:** öneri değişmedi (risk 7). Kalıcı indirim yerine düz $29.40; yılda 3–4 kez
  **gerçek, süreli** kampanya (%25–40, en çok 30 gün; Black Friday, Aralık–Şubat nişan sezonu, ilkbahar). Kampanya dışı dönemde
  normal fiyattan satış yapıldığı için üstü çizili fiyat gerçek olur. Kalıcı %50 seçilirse risk kullanıcıya açıkça yazılır.

---

## 1. Özet ve önerilen kararlar

| Konu | Öneri | Kısa gerekçe |
|---|---|---|
| **Marka / dükkân adı** | **Seal & Story**. Etsy dükkân adı `SealAndStory`; alan adı `sealandstory.com` (müsait, $11.25/yıl; 2026-10-14'te yeniden doğrulandı). Yedekler: Seal & Sonnet, Silk & Seal | Ürünü tek ifadede anlatıyor: mühürlü zarf açılır, hikâye ve site sayfaları gelir. Bilinen çakışma bulunmadı. Marka tescil araması yapılamadı (§2.5). (inceleme) 20 tasarımın yalnız 5'i mühürle kapanıyor; ad "kapalı zarf" mecazı olarak okunmalı (§2.2) |
| **Destek e-postası** | Seçilen alan adında, ör. `hello@sealandstory.com`. Sağlayıcı ayrı karar (§4.5) | E-posta gönderimi (SPF/DKIM) aynı alan adını ister. Alan adı kararı e-postanın da önkoşulu |
| **Fiyat stratejisi** | **A: premium konum.** Alıcının ödediği fiyat **$29.40**; yorumlar gelince **$34.30**. (inceleme) İlk taslaktaki "$49 liste fiyatından kalıcı %40 indirim" yerine **düz fiyat**. Üstü çizili fiyat yalnız gerçek ve süreli kampanyada (risk 7) | Pazarda görülen üst sınırın ($32.18) içinde. TR satıcı varsayımıyla satış başına net ≈ $19.24; B stratejisinde $11.61 (§3.7). Netler indirimin gösterimine bağlı değil, alıcının ödediği fiyata bağlı |
| **Lansman** | İlk ~30 gün ya da ilk ~25 sipariş **$24.50** (TR net ≈ $15.58). Etsy satış aracıyla en çok 30 günlük gerçek kampanya, ya da üstü çizili fiyat göstermeden düz fiyat | İlk yorumları toplamak. Sonra $29.40; ≥15–20 yorum (4.8+) gelince $34.30 |
| **İlan yapısı** | Tasarım başına tek ilan. Lansmanda tek varyasyon: **Wedding Website**. Save the Date ürünü hazır olunca ikinci varyasyon: **Website + Save the Date** ($41.40) | Save the Date teması/ürünü henüz yok (docs/13 §7). Olmayan ürün satılmaz |
| **Ek ürünler** (barındırma uzatma, ek düzenleme hakkı, kurulum hizmeti) | **Lansmanda satılmaz.** Ertelenen düğün için tarih değişikliği ücretsiz; istisnaları destek çözer. Ücretli ekler Faz 2'de, Etsy politikası doğrulanınca (§3.10) | Etsy Services ve Off-Platform politikaları ikisini de riskli kılıyor; iki araştırma bu konuda farklı yorum yaptı |
| **Ürün tanımı (ilan dili)** | "digital wedding website template + instant access; online until 12 months after your wedding date". "subscription", "hosting plan" kelimeleri kullanılmaz | Services politikası "genel olarak hizmetler satılamaz" diyor ve yazılım aboneliklerini yasaklıyor [R-özet] |
| **Etsy dışına yönlendirme** | İlan, START HERE PDF'i ve Etsy mesajlarında kendi sitemizin fiyatı, kuponu, ödeme sayfası ya da **QR kodu olmaz**. İlan görseli 8'deki demo QR'ı çıkarılır | Off-Platform Transactions politikası "Etsy dışına yönlendiren QR kodu"nu açıkça örnek veriyor [R-özet] |
| **E-posta altyapısı** | **Resend** (Vercel Marketplace entegrasyonu; ücretsiz kota 3,000/ay). İlk iş: düzenleme linkini e-postayla göndermek | Link bugün e-postayla gitmiyor (docs/05 §E). Kayıp link, destek yükünün ana kaynağı |
| **Müşteriyi bağlama** | Her misafir sayfasında ince "Made with [BRAND]" alt bilgisi (satış sitesine gider) + QR kart PDF'i + teşekkür modu + arşivden 30 gün önce bildirim | Misafirler Etsy alıcısı değil; edinim kanalı Etsy kuralının dışında. Satış sitesindeki "Buy on Etsy" butonları **Share & Save** linki olur (%4 iade) |
| **Yorum isteği** | Tek istek, teşviksiz, yıldız istemeden. Zamanı: site yayınlandıktan ve ilk RSVP'ler geldikten sonra (satın almadan ~3–21 gün) | Etsy ve FTC kuralları; dijital üründe yorum penceresi 100 gün [İkincil] |
| **Offsite Ads** | Son 365 günde $10k satışın altındayken, isteğe bağlıyken **kapalı** başla. Onsite Etsy Ads küçük günlük bütçeyle denenir | TR satıcıda reklamla gelen $29.40'lık siparişte yalnız Offsite Ads ücreti KDV dahil $5.29. (inceleme) O siparişte Etsy'nin toplam payı ≈ **$11.90 (%40)** (§3.2) |
| **Doğrudan satış (kendi site)** | Şimdilik yok. Faz 2'de bir "merchant of record" (MoR) platformu: Paddle ya da Gumroad. Önce satıcı uygunluğu doğrulanır | Stripe'ın Türkiye'deki işletmeye hesap açmadığını söyleyen ikincil kaynaklar var; PayPal Türkiye'de yok [İkincil] |

**Satıştan önce çözülmesi gereken riskler**
1. **Etsy Services politikası.** Barındırılan site + panel modeli "hizmet" sayılabilir (orta risk).
   - Önlem: ürünü dijital şablon + anında erişim olarak tanımlamak, ayrı hizmet ilanı açmamak, gerçek değeri olan bir dijital dosya
     teslim etmek (START HERE PDF; ileride anı dosyası dışa aktarımı).
   - İlk satışlarda 1–2 ilanla başlayıp gözlemek bir seçenek (§5).
2. **Off-platform.** PDF'teki `/start` linki teslimat içindir. Bunun için Etsy metninde açık bir istisna **bulunamadı**. Sektör
   standardı da PDF'te link vermek (Canva linki; docs/13 §5). PDF yalnız teslimat içeriği taşımalı.
3. **Etsy siparişi doğrulanmıyor** (docs/05 §E). Kötüye kullanım sınırı G060 düzenleme hakkıyla geliyor. Etsy API ile sipariş
   doğrulaması P1'de (§4.8).
4. **Düzenleme linki e-postayla gitmiyor.** Resend kurulumu alan adına bağlı; alan adı kararı bu yüzden acil.
5. **Vercel Pro'nun aktif olduğu doğrulanmadı.** `list_billing_charges` (ekip `team_pZ2ioUaryATDt15wOOUcCkQD`) 2026-10-14'te
   `404 "Plan not found"` döndü [Ölçüm]. Aynı gün G049 ekibin Pro'da olduğunu kaydetti (docs/10 §2c). Panelden kontrol gerekir;
   kullanıcı gerekirse yeniden alacağını söyledi. (inceleme) İkinci kontrolde `list_billing_charges` yine 404 döndü; `get_team`
   plan bilgisi vermiyor [Ölçüm]. Durum hâlâ belirsiz.
6. **Ödeme alacak ülke belli değil.** Etsy'nin satış fiyatından aldığı pay: TR satıcıda ≈ %25, UK'de ≈ %20.5, US'de ≈ %13.4 (§3.2).
   Fiyat hesapları TR ana senaryosuyla yapıldı.
7. **(inceleme) Kalıcı indirim ve referans fiyat.**
   - Etsy satıcı rehberi (12 Oca 2026): "perpetual sale"den kaçının; indirimli gösterilen ürün o fiyattan makul miktarda satılmış
     olmalı; fiyatı kısa süre şişirip indirim göstermek yasak. Etsy'nin satış aracı en çok 30 gün sürüyor [R-özet].
   - ABD, FTC 16 CFR 233.1: karşılaştırılan eski fiyat, makul ve önemli bir süre gerçekten uygulanmış bir fiyat olmalı [R-özet eCFR].
   - Rakiplerin 72/81'inin sürekli indirimde olması (docs/13) bunu güvenli yapmaz.
   - Önlem: alıcının ödediği fiyat düz fiyat olur. Üstü çizili fiyat yalnız gerçek ve süreli kampanyada (§3.9). Netler değişmez.
     UK (CMA) ve AB kuralları ayrıca kontrol edilmedi.
8. **(inceleme) "Yasal kimlik yok" kimliksiz satış demek değil.** K25 şirket kurmamayı kapsıyor. Etsy Payments bireysel satıcıdan da
   şunları istiyor: yasal ad, doğum tarihi, ev adresi, ülkeye göre vergi numarası, adına kayıtlı banka hesabı (hesap sahibi adı
   eşleşmeli). Yeni satıcılara kimlik + selfie doğrulaması (Persona) yapılıyor [R-özet help 360001980067, 22481159004567].
   Dükkânın kimin adına ve hangi ülkenin bankasıyla açılacağı bu hafta seçilmeli; Etsy payı ve net buna bağlı (risk 6).

---

## 2. Marka / dükkân adı

### 2.1 Yöntem
- 25 aday seçilmeden önce ≈ 130 ad üretildi.
- **Alan adı:** .com müsaitliği Vercel kayıt aracıyla toplu sorgulandı (`get_bulk_availability`). .com alınmışsa .co'ya bakıldı.
  Fiyatlar `get_bulk_price` aracından [Ölçüm].
  - Müsait .com'ların hepsi **$11.25/yıl**, yenileme de $11.25.
  - `sealtheday.co`: alım $29.99, yenileme $24.80. Başka .co fiyatı sorgulanmadı.
- **Çakışma taraması** yalnız web aramasıyla yapıldı (ABD odaklı arama motoru). **Hukuki görüş değildir.**
  - USPTO, Justia, Trademarkia, etsy.com ve instagram.com açılamadı.
  - Bu yüzden **doğrulanmadı**: tescilli marka kaydı, Etsy'de dükkân adının boş olup olmadığı, sosyal medya kullanıcı adları.
  - etsy.com alanıyla sınırlı web aramasında aranan adların hiçbiri için dükkân sonucu çıkmadı. Bu, adın boş olduğunu kanıtlamaz.
- **Etsy dükkân adı kuralları** [R-özet: Etsy yardım makalesi + seller handbook]:
  - En fazla 20 karakter, boşluk ve noktalama yok. `&` kullanılamaz, bu yüzden "And" ile ve kelime başları büyük yazılır
    (`SealAndStory`).
  - Ad, dükkân açıldıktan sonra 5 kez değiştirilebilir; daha fazlası Etsy Support onayı ister.
  - Açık bir dükkânın kullandığı ad başkasına verilmez.
  - 25 adayın hepsi 10–16 karakter, yani sığıyor.

### 2.2 Önerilen ilk 5

| # | Ad | Etsy adı (karakter) | Alan adı | Risk | Neden |
|---|---|---|---|---|---|
| 1 | **Seal & Story** | SealAndStory (12) | .com müsait ($11.25), .co müsait | Düşük | Ürünü en iyi anlatan ad: zarf/mühürle açılıp hikâye ve site sayfalarına geçen yapıyı söylüyor. Kısa, aliterasyonlu, yazılışı belli. Aynı adda işletme bulunmadı. Yakın kalıp: Seal & Scribe (San Diego, mühürden mücevher; farklı sektör). "seal" + "story", düğün sitesi bağlamında kendini açıklıyor; satış sitesinin arama ve yapay zekâ önerilerinde (G061) işe yarayabilir |
| 2 | Seal & Sonnet | SealAndSonnet (13) | .com müsait, .co müsait | Düşük | Aynı ses ve zarafette, daha romantik ve edebi. Eşleşme bulunmadı. Ürünü #1 kadar doğrudan anlatmıyor |
| 3 | Silk & Seal | SilkAndSeal (11) | .com müsait | Düşük | En "premium" tınlayan, en kısa seçeneklerden biri. İpek kurdele + mühür, davetiye takımının klasik motifleri. Eşleşme yok |
| 4 | Fold & Vow | FoldAndVow (10) | .com müsait, .co müsait | Düşük | 10 karakter, temiz: davetiye katlanması + yemin. Eşleşme yok. Biraz soyut |
| 5 | Vellum Lane | VellumLane (10) | .com müsait, .co müsait | Düşük–orta | Kısa ve zarif. Etsy'de vellum ve mühür satan "HouseOfVellum" dükkânı var. "velum" diye yanlış yazılabilir |

**Kullanım notu.** "Seal" kelimesi aramada hayvan ve şarkıcı Seal ile paylaşılıyor. Marka hep tam ifadeyle kullanılmalı
("Seal & Story"), tek başına "Seal" olarak değil. Görünen dükkân başlığında ve sitede `&` yazılabilir; yalnız Etsy dükkân adında
"And" zorunlu.

**(inceleme) Yeniden kontrol, 2026-10-14.**
- **Alan adı [Ölçüm]:** `get_bulk_availability` ile ilk 5'in .com'u yeniden sorgulandı: sealandstory.com, sealandsonnet.com,
  silkandseal.com, foldandvow.com, vellumlane.com **müsait**. sealandstory.co, .net ve .app de müsait; sealedstory.com müsait;
  sealtheday.com alınmış. `get_domain_price` sealandstory.com: alım, yenileme ve transfer $11.25. Satın alma yapılmadı.
- **Çakışma (arama özeti):** "Seal & Story" ya da "Seal and Story" adıyla işletme, Etsy dükkânı ya da USPTO kaydı çıkmadı. Silk &
  Seal, Fold & Vow, Vellum Lane ve Seal & Sonnet için de eşleşme çıkmadı. Bu bir tescil araması değildir; USPTO hâlâ açılamıyor.
- **Ad ile ürün uyumu:** Katalogdaki 20 tasarımın yalnız 5'i mühürle kapanıyor (01, 02, 04, 17, 19). Ötekiler kurdele, ip, toka,
  klips, dal, etiket ya da deniz kabuğuyla kapanıyor; 09 keten kese, 13 kitap kapağı, 18 vellum kılıf (docs/09 "Kapanış" ve "Zarf tipi"
  sütunları). Bu yüzden "Seal" ürün vaadi olarak değil, "kapalı zarf" mecazı olarak kullanılmalı. İlan ve satış sitesi her tasarımda
  mühür varmış gibi yazmamalı. Bütün kataloğa daha geniş uyan yedek **Fold & Vow** (17 tasarım kapaklı zarf ya da gatefold).

### 2.3 Tam liste (25 aday, araştırmanın sıralamasıyla)

Risk: L = düşük, M = orta, H = yüksek.

| # | Ad | Etsy adı (karakter) | Alan adı | Risk | Not |
|---|---|---|---|---|---|
| 1 | Seal & Story | SealAndStory (12) | .com + .co müsait | L | Bkz. §2.2 |
| 2 | Seal & Sonnet | SealAndSonnet (13) | .com + .co müsait | L | Bkz. §2.2 |
| 3 | Silk & Seal | SilkAndSeal (11) | .com müsait | L | Tek ilgisiz eşleşme: Silk & Saltwater tescili |
| 4 | Fold & Vow | FoldAndVow (10) | .com + .co müsait | L | En yakını Singapur'da Fold & Fellow adlı müzik projesi |
| 5 | Vellum Lane | VellumLane (10) | .com + .co müsait | L–M | HouseOfVellum (Etsy) |
| 6 | Wren & Wax | WrenAndWax (10) | .com müsait | L–M | Wren's (1889'dan beri İngiliz ayakkabı cilası, "Super Wax"), Artisaire'in "Wren Monogram" mühür ürünü, Wren Kitchens (BK). BK'de cila çağrışımı |
| 7 | Inner Envelope | InnerEnvelope (13) | .com müsait | M | İçteki kişisel zarf; akıllıca ama yaygın görgü terimi. Sahiplenmesi zor, aramada ürün sayfalarıyla yarışır |
| 8 | Seal & Swoon | SealAndSwoon (12) | .com müsait | L–M | BK'de düğün aksesuarı satan Swagger & Swoon aynı "& Swoon" kalıbında |
| 9 | Sealed Story | SealedStory (11) | .com müsait | L | #1'in kısa hâli. "Sealed" kapalı/gizli çağrışımı taşıyor |
| 10 | Wax & Vellum | WaxAndVellum (12) | .com müsait | M | Etsy'de zaten bir arama kategorisi (fiziksel vellum ve mühür). Jenerik; alıcı kâğıt ürün bekleyebilir |
| 11 | Letter & Lace | LetterAndLace (13) | .com müsait | L–M | Ters sıradaki laceandletter.com alınmış (sahibi bilinmiyor) |
| 12 | Seal & Vow | SealAndVow (10) | .com müsait | M | Hukuki risk düşük; arama sonuçlarını Seal ve Heidi Klum'un yemin yenileme haberleri dolduruyor |
| 13 | Opened With Love | OpenedWithLove (14) | .com müsait | M | "With Love" kalıbı kalabalık (BK: With Love Wedding Stationery, Labelled With Love). Cümle gibi |
| 14 | Love Note Lane | LoveNoteLane (12) | .com müsait | L | Eşleşme yok. Biraz el işi/çocuksu tınlıyor |
| 15 | Postmark & Petal | PostmarkAndPetal (16) | .com müsait | L–M | Uzun. Spellbinders/Hero Arts'ın "Petal Postage" mühür ürünü var |
| 16 | Deckle & Seal | DeckleAndSeal (13) | .com müsait | L | "deckle" (yırtık kenarlı kâğıt) çoğu ABD alıcısı için tanıdık değil; yazması ve söylemesi zor |
| 17 | Gilded Envelope | GildedEnvelope (14) | .com müsait | L / ayırt edicilik zayıf | The Knot'ta onlarca "Gilded …" zarf tasarımı |
| 18 | Sealed With Lace | SealedWithLace (14) | .com müsait | L–M | "Sealed with a kiss" oyunu; bu adla davetiye satan gelinlik dükkânları var (Haddonfield NJ, Richmond VA) |
| 19 | Monogram & Seal | MonogramAndSeal (15) | .com müsait | L–M | Tanımlayıcı; monogram dükkânı çok (ör. Mark & Graham "Monogram Wedding Shop") |
| 20 | Heirloom Envelope | HeirloomEnvelope (16) | .com müsait | M | "Heirloom" düğün sektöründe kalabalık (Heirloom & Ink, Heirloom Paper Co., Heirloom DC); Etsy'de bir rakip koleksiyon "Heirloom Edition" (docs/13 #29) |
| 21 | Envelope Atelier | EnvelopeAtelier (15) | .com müsait | L | "Atelier" ABD'li alıcı için zor yazılır |
| 22 | Laced & Sealed | LacedAndSealed (14) | .com müsait | M | "laced" sözlükte "içkiye gizlice uyuşturucu katılmış" anlamı da taşıyor; imaj riski |
| 23 | Seal the Day | SealTheDay (10) | .com **alınmış**, .co müsait ($29.99) | M | Güçlü kelime oyunu ama .com başkasında, trafik bölünür |
| 24 | Sincerely Wed | SincerelyWed (12) | .com müsait | **H** | Aynı alanda yakın adlar: Sincere Corporation (Punchbowl, Memento) 2024'te "Lovebird" adlı premium düğün sitesi + dijital davetiye + RSVP çıkardı; Sincerely Ink 2012'de düğün davetiyesi koleksiyonu yaptı |
| 25 | Gilt & Seal | GiltAndSeal (11) | .com müsait | M–H | "Gilt" tanınmış perakende markası (Gilt Groupe → Rue Gilt Groupe) |

### 2.4 Elenenler
- **Paper Vow:** .com alınmış; aynı adla iki düğün davetiyesi işi var (The Paper Vow, Ohio; Paper Vows, Jersey). Risk H.
- **Kindly Reply, Dear Guest:** .com ve .co ikisi de alınmış.
- **.com'u alınmış olanlar:** VowPost, HeirloomPost, Envelle, SealAndScroll, VellumAndVow / VowAndVellum.
- **Uydurma adlar** (Envellum, Sealune, Lovelope, Amorelle, Waxwell, Openvow, Velloux, Invella, Sealora): hepsinin .com'u alınmış.

### 2.5 Ad seçildikten sonra (satın alma yok)
1. **Marka tescil araması:** önce USPTO, sonra BK (UKIPO), Kanada, Avustralya. Bu ortamdan erişilemedi; kullanıcının
   tarayıcısında `claude-tarayici` yapabilir. Uygun sınıflar örneğin 42 (çevrimiçi yazılım/barındırma) ve 35. Kesin
   değerlendirmeyi bir uzman yapmalı.
2. **Etsy dükkân adı:** müsaitlik ancak dükkân kurulurken denenebilir.
3. **Sosyal kullanıcı adları:** Instagram, TikTok, Pinterest kontrol edilmedi.
4. **Alan adı alımı yalnız kullanıcı onayıyla.** .com $11.25/yıl (Vercel, ekip `team_pZ2ioUaryATDt15wOOUcCkQD`). .co savunma
   kaydı isteğe bağlı; fiyatı sorgulanmadı.
5. **Alan adının etkisi:** `LISTING_BASE_URL` ve `PLATFORM_PUBLIC_URL` değişir. docs/05 §C'ye göre **bütün START HERE PDF'leri ve
   ilan görselleri yeniden üretilmeli.** Bu yüzden alan adı, ilan kitleri son hâline gelmeden bağlanmalı.

---

## 3. Fiyat (Etsy merkezli)

> **Karar (kullanıcı, 2026-10-16, K42 / docs/23 §1):** dükkân TRY'de (K38). Tasarım **1.460 TL** (≈ $29.48, kur 49,53
> BloombergHT 2026-10-16), kurulum hizmeti **500 TL**, özel tasarım **2.960 TL**; stok sınırı yok (Etsy'de 999). Aşağıdaki USD
> hesapları karar öncesi analizdir; lansman indirimi ve yorum sonrası fiyat artışı ayrıca karar ister.

### 3.1 Kaynak durumu ve senaryo
- Etsy ve Vercel rakamları resmi sayfaların arama özetlerinden [R-özet] ya da üçüncü taraf rehberlerden [İkincil]. **Fiyat
  yayınlanmadan önce Etsy Shop Manager'daki ücret ekranında ve Vercel panelinde doğrulanmalı.**
- Dükkânın ve ödeme hesabının ülkesi kayıtlı değil. Kullanıcı Türkçe konuşuyor ve docs/13 Etsy'yi Türkiye görünümünde inceledi.
  Bu yüzden **TR satıcı ana senaryo**; US ve UK karşılaştırma için.
- Ödeme işleme ücretini alıcının değil, **satıcının banka ülkesi** belirler.
- Kurlar: 49.37 TRY/USD (docs/13), £1 = $1.33 [Varsayım].

### 3.2 Etsy ücretleri

| Ücret | Değer | Hesap tabanı | Kaynak |
|---|---|---|---|
| Listeleme | $0.20 / ilan; 4 ayda bir yenilenir; ürün sattıkça her satışta $0.20 otomatik yenileme | — | [R-özet] etsy.com/legal/fees |
| İşlem ücreti | %6.5 | Ürün + kargo + hediye paketi (vergi hariç) | [R-özet]; [İkincil] 2026'da değişmedi |
| Ödeme işleme, **TR** | **%6.5 + 14 TRY** (8 Tem 2024'ten beri; ≈ $0.28) | Vergi dahil toplam | [R-özet] etsy.com/legal/etsy-payments. Satış sonrası araştırmasındaki tek ikincil kaynak "+3 TRY" diyordu; resmi özet esas alındı. (inceleme) globalfeecalculator (Mayıs 2026) 14 TRY, navlungo 3 TRY diyor [İkincil]. Fark satış başına ≈ $0.27 (KDV dahil) |
| Ödeme işleme, US | %3 + $0.25 | Vergi dahil toplam | [İkincil], kaynaklar tutarlı |
| Ödeme işleme, UK | %4 + £0.20 | Toplam | [İkincil] |
| Ödeme işleme, CA / AU | (inceleme) **CA:** %3 + 0.25 CAD (yurt içi ve ABD'den sipariş), %4 + 0.25 CAD (diğer ülkeler). **AU:** %3 + 0.25 AUD yurt içi, %4 + 0.25 AUD uluslararası. AU satıcıda ABD'li alıcı uluslararası sayılır | Vergi ve kargo dahil toplam | [R-özet] help 115015628847 tablosu. Bir hesaplayıcının "AU %3.5" değeri resmi tabloyla çelişiyor |
| Regulatory Operating Fee, **TR** | **%1.67** (22 Haz 2026'dan beri; önceki %2.27) | Ürün + kargo | [İkincil] growtsy, iscompliant. Eski kaynaklar %2.24–2.27 diyor. (inceleme) Value Added Resource da 22 Haz 2026'da TR oranının **düştüğünü** yazıyor; yeni oran o özette yok [İkincil] |
| Regulatory Operating Fee, UK / US | %0.48 (önceki %0.32) / yok | Ürün + kargo | [İkincil] |
| Etsy ücretlerine KDV (TR) | Etsy TR satıcının ücretlerine KDV alabiliyor; **%20** varsayıldı | Tüm Etsy ücretleri | [R-özet] mekanizma; [İkincil] oran. Geçerli VAT ID'nin kesintiyi durdurduğu söyleniyor, doğrulanmadı. "Yasal kimlik yok" kararıyla ödenir varsayıldı |
| UK satıcı, KDV kaydı yoksa | Ücretlere %20 KDV | — | [İkincil] |
| Döviz çevirme | %2.5 | İlan para birimi ödeme hesabınınkinden farklıysa (ör. USD ilan, TRY hesap) | [R-özet] help 360000344668 |
| Ödeme çekme (TR) | 600 TRY altındaki çekimde 42 TRY | — | [R-özet] |
| Offsite Ads | Son 365 günde $10k altı: **%15, kapatılabilir**. $10k üstü: %12, zorunlu ve kalıcı. Sipariş başına üst sınır $100 | Yalnız reklamdan gelen sipariş | [R-özet] oran/eşik; [İkincil] tavan ve 30 günlük atıf |
| Etsy Ads (onsite) | Tıklama başı; günlük bütçe en az $1 | — | [R-özet] help 360033701174; [İkincil] minimum |
| Share & Save | Kendi paylaşım linkimizden gelen satışta %4 iade (işlem ücreti fiilen %2.5'e iner). Etsy mesajı ve ilan açıklamasındaki linkler sayılmaz | Ürün + kargo | [R-özet] program şartları; [İkincil] istisnalar |
| Dükkân açılış ücreti | Bazı ülkelerde tek seferlik ≈ $15 (bildirilen $15–29) | — | [İkincil]; ülke listesi yok |

**$29.40'lık satışta Etsy'nin payı** (KDV, döviz çevirme ve beklenen Offsite Ads dahil; §3.9 varsayımlarıyla):

| Satıcı ülkesi | Etsy payı |
|---|---|
| TR, ilan USD | ≈ **%25** |
| UK | ≈ %20.5 |
| US | ≈ %13.4 |

TR'deki yükü %6.5 ödeme işleme, %20 KDV ve %2.5 döviz çevirme oluşturuyor. Sipariş Offsite Ads'ten gelirse, $29.40'ta yalnız
Offsite Ads ücreti KDV dahil **$5.29** olur (%15 × $29.40 × 1.20). (inceleme) İlk taslak bunu siparişin bütün Etsy ücreti gibi yazmıştı.
O siparişte toplam Etsy payı ≈ **$11.90 (%40)**: reklamsız ücretler KDV dahil $5.87 + döviz çevirme $0.74 + Offsite Ads $5.29.

### 3.3 Vergi
- **Alıcı KDV'si:** Etsy, otomatik indirilen dijital ürünlerde KDV'yi checkout'ta hesaplıyor, tahsil ediyor ve devlete ödüyor
  (UK, AB, AU, NZ, NO, CH, TR, CA ve diğerleri) [R-özet] help 115015587567. Satıcı bu vergiyi almaz, ödemez. Ancak ödeme işleme
  ücreti vergi dahil toplam üzerinden hesaplanır; model ortalama +%5 vergi varsaydı.
- **ABD satış vergisi:** pazaryeri yasası olan eyaletlerde Etsy tahsil edip ödüyor [R-özet] help 360000343968. Kendi sitemizden
  doğrudan satış bu kapsamda değil.
- **Gelir vergisi** kullanıcı kararıyla ("yasal kimlik yok", K25) hesaba katılmadı. Rakamlar vergi öncesi.

### 3.4 Bizim maliyetimiz

**Sabit (aylık; modelde toplam $28.40):**

| Kalem | Tutar | Kaynak |
|---|---|---|
| Vercel Pro | $20/ay. 1 deploy koltuğu, $20 kullanım kredisi, 1 TB Fast Data Transfer, 10M Edge Request dahil | [R-özet] vercel.com/docs/plans/pro-plan |
| Destek e-postası | Google Workspace Starter ≈ $7–8.40 / kullanıcı / ay. Ücretsiz yönlendirme seçenekleri de var, fiyatlanmadı | [İkincil] |
| İşlem e-postası | Resend Free: 3,000 e-posta/ay, $0 | Resend dokümanı. (inceleme) Günlük 100 e-posta sınırı da var [R-özet resend.com/blog/new-free-tier]. Link paylaşılan gün RSVP'ler yığılırsa önce bu sınır dolar; yanıt başına bildirim yerine özet e-posta bunu azaltır [Varsayım] |
| (inceleme) Alan adı | $11.25/yıl ≈ $0.94/ay; $28.40'a dahil değil. 50 satış/ayda satış başına ≈ $0.02 | [Ölçüm] `get_domain_price` |

| Aylık satış | 10 | 30 | 50 | 100 | 300 |
|---|---|---|---|---|---|
| Satış başına sabit maliyet | $2.84 | $0.95 | $0.57 | $0.28 | $0.09 |

**Değişken (site başına; yayın ≈ 18 ay):**
- Birim fiyatlar [R-özet, Vercel dokümanı]:
  - Blob: depolama $0.023/GB-ay; simple op $0.40/1M; advanced op $5/1M; aktarım $0.05/GB.
  - Functions: $0.60/1M çağrı; active CPU $0.128/saat; bellek $0.0106/GB-saat.
  - Kota üstü: FDT $0.15/GB, Edge Request $2/1M [İkincil].
  - Pro'ya dahil Blob kotaları kaynaklarda çelişiyor; doğrulanmadı. Eylül 2026 "flat-rate CDN" geçişi iddiası tek kaynakta,
    doğrulanmadı.
- Site başına hacim [Ölçüm + Varsayım]:
  - Fotoğraf ≈ 8 MB/site (5 alan × 2400/1280/640 px JPEG q84, `platform/lib/panel/photos.ts`).
  - Sayfa görüntüleme: The Knot'a göre ortalama misafir sayısı 89–142. İhtiyatla **3,000** görüntüleme/site alındı.
  - Her görüntüleme bir SSR çağrısı (`render.ts`, `max-age=0`) + 2 private Blob okuması (`useCache:false`). Medya CDN önbelleği
    5 dk. Ortalama ≈ 0.6 MB/görüntüleme.
- **Sonuç:**
  - Normalde site başına ≈ **$0.07**.
  - Trafik 5 katına çıkar ve FDT kota üstü ücretlenirse ≈ $1.70/site.
  - Dahil kotalar: 1 TB ≈ 550 sitenin tüm ömür trafiği; 10M Edge Request ≈ 220 sitenin.
  - Ayda 100 satışta kota aşılmıyor. Ayda 300 satışta kota üstü ≈ $7/ay; kredi bunu karşılıyor.
  - **Barındırma, fiyatı belirleyen kalem değil.** 12 ay uzatmanın maliyeti kuruş düzeyinde.
- **Destek:** ≈ 6 dk/sipariş × $15/saat ≈ $1.50; Save the Date dahil siparişte $2.00 [Varsayım].
- **İade/itiraz payı:** fiyatın %2'si [Varsayım].

### 3.5 Pazar (docs/13, 81 website ilanı)

| Gösterge | Değer |
|---|---|
| İndirimli satış fiyatı medyanı | **$18.19** |
| Alt / üst çeyrek | $9.48 / $22.47 |
| Görülen en yüksek satış fiyatı | $32.18 |
| Liste fiyatı medyanı | $26.95 |
| Sürekli indirimde | 72/81 ilan (medyan %40) |
| Fiyat bantları | $15–25: 35 ilan · $25–35: 16 ilan · **$35 üstü: 0** |

- Rakiplerin hepsi Canva teslimi yapıyor; barındırma maliyetleri yok.
- Zola, Joy ve The Knot düğün sitesini ücretsiz veriyor. Zola'da özel alan adı $17.99/yıl'dan başlıyor [İkincil, paperlust, Tem 2026].
- **Farkımız:** Canva gerekmiyor, düzenleme tarayıcıda/telefonda, RSVP ve CSV platformda, metinler değişebiliyor.
  "Daha hızlı" iddiası ölçülmeden yazılmaz (docs/05 §E).

### 3.6 Net hesabı
Net = fiyat − Etsy ücretleri (KDV, döviz çevirme, beklenen Offsite Ads dahil) − altyapı $0.10 − sabit pay ($0.57, 50 satış/ay)
− destek − %2 iade payı. Etsy Ads (onsite) harcaması **hariç**.

### 3.7 Üç strateji

| Strateji | Liste → satış | Net TR | Marj TR | Net US | Marj US | $1,000 net/ay için satış (TR / US) |
|---|---|---|---|---|---|---|
| **A. Premium çapa + lansman indirimi** | $49 → %40 → **$29.40**. Yorumlar gelince %30 → $34.30 | **$19.24** ($34.30'da $22.91) | %65.5 | $22.70 | %77 | **52 / 45** |
| **B. Pazar ortası** | $32 → %40 → **$19.20** | $11.61 | %60.5 | $13.91 | %72.5 | 87 / 72 |
| **C. Paket odaklı giriş** | Site $25 → $15. Komple set $55 → $33 (site + Save the Date + uzatma + hak paketi). %35'i seti seçerse sepet ortalaması $21.30 | Karma $12.89 (yalnız site $8.47) | %56.5 (yalnız site) | Karma $15.43 | %68.6 (yalnız site) | 78 / 65 |

Karşılaştırma: pazar medyanı $18.19'da TR net $10.86, US net $13.04.

(inceleme) Bütün netler §3.6 formülü ve §3.9 varsayımlarıyla yeniden hesaplandı; tablodakilerle ±$0.01 içinde aynı (UK $29.40'ta
$20.61). Son sütun = $1,000 ÷ net, yukarı yuvarlanmış. İlk taslakta A/US 44 (doğrusu 45: 44 × $22.70 = $998.80) ve B/TR 86
(doğrusu 87) idi. Sabit maliyet ($28.40/ay) satış adedine bölünürse B/TR 85, C/TR 77 çıkar. "Liste → satış" sütunundaki
üstü çizili fiyat kurgusu için risk 7'ye bakın.

**Not:** C'deki "komple set" henüz olmayan Save the Date ürününe ve Etsy'de riskli ek hizmetlere (uzatma, hak paketi; §3.10)
dayanıyor. Bu yüzden şu an uygulanamaz.

### 3.8 Öneri: Strateji A + varyasyonlar

| Varyasyon | Liste | Satış (%40 indirim) | Net TR | Net US | Ne zaman |
|---|---|---|---|---|---|
| **Wedding Website** | $49 | **$29.40** | $19.24 | $22.70 | Lansmanda |
| **Website + Save the Date** | $69 | **$41.40** | $27.62 | $32.43 | Save the Date ürünü hazır olunca (şemada `event_type: save_the_date` var, tema yok) |
| Website + Save the Date + 24 ay barındırma ("Keepsake") | $79 | $47.40 | $32.11 | $37.59 | **Bekletilir.** Barındırma süresini fiyatlandırmak Services riskini artırıyor (§3.10) |

(inceleme) "Liste" sütunu yalnız referanstır. Alıcının gördüğü ve ödediği fiyat "Satış" sütunudur ve **düz fiyat** olarak girilir.
Üstü çizili liste fiyatı ancak o fiyattan gerçekten satış yapıldıktan sonra, süreli bir kampanyada gösterilir (risk 7).

**Gerekçe:**
- $29–34 pazarda görülen üst sınırın ($32.18) içinde; $25–35 bandında 16 ilan var.
- $49 liste fiyatı + %40 indirim pazar normuna uyuyor (72/81 ilan indirimde, medyan %40). (inceleme) Pazar normu olması uyumlu
  olduğunu göstermez: Etsy rehberi kalıcı indirime karşı (risk 7). Öneri düz fiyattır; netler aynı kalır.
- TR satıcıda ≈ %25 Etsy payına rağmen satış başına ≈ $19 net kalıyor; bu B'den ≈ %65 fazla. $1,000 net için 52 satış yetiyor
  (B'de 87).
- Destek ve iade maliyeti düşük fiyatta orantısal olarak ağırlaşıyor.
- Ürün rakiplerden farklı: barındırma, RSVP, telefonda düzenleme. Pazarın en ucuz ucunda rekabet etmesi gerekmiyor.

### 3.9 Lansman planı

| Aşama | Ne zaman | Satış fiyatı | Net TR |
|---|---|---|---|
| Lansman | İlk ~30 gün ya da ilk ~25 sipariş | **$24.50** | $15.58 |
| Normal | Sonrası | **$29.40** | $19.24 |
| Yorumlu | ≥ 15–20 yorum, ortalama 4.8+ | **$34.30** | $22.91 |
| Düşük dönüşüm | 60–90 gün sonra dönüşüm çok düşükse | Önce yeniden $24.50 | $15.58 |

- (inceleme) **Uygulama biçimi (risk 7).** İlk taslak bu aşamaları $49'dan %50 / %40 / %30 kalıcı indirim olarak yazmıştı. Etsy
  rehberi kalıcı indirime karşı ve Etsy'nin satış aracı en çok 30 gün sürüyor [R-özet]. Bu yüzden:
  - Normal ve Yorumlu aşamaları **düz fiyat** olarak girilir.
  - Lansman ve sonraki sezon kampanyaları gerçek, süreli Etsy kampanyasıdır (≤ 30 gün). İndirimin referansı, sonra gerçekten
    uygulanacak normal fiyattır ($29.40'tan ≈ %17). En güvenlisi lansman fiyatını üstü çizili göstermeden düz $24.50 girmek.
  - Netler değişmez; yalnız gösterim değişir.
- B stratejisi ancak $24.50 de yetmezse denenir.
- **Ek kaldıraçlar:**
  - İlanı TRY ile açmak %2.5 döviz çevirme ücretini kaldırır. Bedeli: kur hareketi yüzünden sık fiyat güncellemesi. **Öneri:**
    USD ile başla, TRY'yi satış oturunca değerlendir.
  - Kendi kanallarımızdan (satış sitesi, Pinterest, sosyal) Etsy'ye giden her link **Share & Save** linki olsun (%4 iade).
  - Offsite Ads kapatılabilir olduğu sürece kapalı başla (§1). Onsite Etsy Ads günlük $1'dan başlayan küçük bütçeyle ölçülür.

**Model varsayımları (kaynaksız):** destek 6 dk/sipariş ve $15/saat; vergi artışı ortalama %5; Offsite atfı %15; iade payı %2;
50 satış/ay; 3,000 sayfa görüntüleme/site; 0.6 MB/görüntüleme; kurlar §3.1.

### 3.10 Ek ürünler ve Etsy uyumu: iki araştırmanın farklı yorumu

| Ek ürün | Fiyat araştırmasının önerisi | Satış sonrası araştırmasının önerisi | Bu belgenin önerisi |
|---|---|---|---|
| Save the Date sitesi | Varyasyon, +$12 | Etsy'de ayrı ilan ya da paket; en temiz ek satış | **Etsy varyasyonu**, ürün hazır olunca |
| Barındırma uzatma (+12 ay) | Varyasyon +$9 (TR net ≈ $6.73) ya da ayrı ilan $9.99 (TR net ≈ $6.38) | Etsy'de satılmamalı: "yazılım aboneliği" ve "fiziksel ürünü olmayan ek hizmet" yasak [R-özet Services]. Panelde, kendi ödeme altyapısıyla | **Lansmanda satılmaz.** İstek gelirse destek ücretsiz uzatır |
| Ek düzenleme hakkı (+3) | Ayrı ilan $5.99 (TR net ≈ $3.39) | Etsy'de satılmamalı (Services). Panelde küçük ücret | **Lansmanda satılmaz.** Ertelenen düğün için tarih değişikliği ücretsiz |
| "Bizim yerimize kurun" | Ayrı ilan $24.99 (TR net ≈ $17.60) | Hizmet; Etsy'de riskli | **Lansmanda satılmaz.** Kurulum yardımı destek kapsamında (rakip yorumlarında en çok övülen konu "satıcı yardımı", docs/13 §6) |
| Renk varyantı (K16 Aşama 2 paletleri) | Satın alımda ücretsiz seçim | Ücretsiz ya da küçük ücret | **Ücretsiz seçim**, varyantlar gelince. Rakip şikâyetine ("renk değiştirmek zor") karşı fark |

**Çelişki ve karar yolu:**
- Fiyat araştırması, panelde Etsy alıcısına Stripe ile ek ürün satmayı Off-Platform ve ücretten kaçınma kuralları açısından
  **riskli** buldu.
- Satış sonrası araştırması, Etsy'de listelenmeyen bir panel ürününü Etsy ilanında, PDF'te ve mesajda **anmamak** koşuluyla
  satmayı uygun gördü.
- Resmi metinler bu ortamdan okunamadı; iki yorum da doğrulanmadı.
- **Öneri:** ilk satışlarda ücretli ek yok. Faz 2'den önce Off-Platform ve Services metinleri Shop Manager'dan (tarayıcı otomasyonu)
  okunur ve gerekirse Etsy Support'a yazılı sorulur. Ödeme altyapısı (MoR) ancak ondan sonra kurulur.
- Ek ürünlerin gelirden çok kötüye kullanımı sınırlamaya yaradığı göz önüne alınırsa, bu bekleme gelirde büyük kayıp değil.

---

## 4. Satış sonrası ve müşteriyi platforma bağlama

### 4.1 Etsy kuralları ve bize etkisi

| Konu | Kaynak | Bize etkisi |
|---|---|---|
| **Off-Platform Transactions** | [R-özet] legal/policy/off-platform-transactions | Etsy'deki ürünü başka kanaldan almaya teşvik, Etsy dışına yönlendiren QR, Etsy dışı indirim yasak. Satış sitesi → Etsy linki serbest (yön Etsy'ye). Etsy → kendi ödeme sayfamız yasak. (inceleme) Etsy Messages kuralları da Etsy dışı işlem için iletişim bilgisi ya da QR paylaşmayı yasaklıyor [R-özet help/article/4508] |
| **Services** (son güncelleme 9 Haz 2026) | [R-özet] legal/policy/services | "Genel olarak hizmetler satılamaz"; yazılım aboneliği ve fiziksel ürünü olmayan ek hizmetler yasak listesinde. Dijital dosya çıktısı olanlar istisna. Ürün "dijital şablon + anında erişim" olarak tanımlanır (§1) |
| **Mesajlar** | [R-özet] legal/sellers, help/article/4508 | Etsy Messages yalnız sipariş ve destek için; istenmeyen reklam yasak. Satıcı yalnız siparişi olan alıcıya yazabiliyor [İkincil] |
| **Alıcı e-postası** | [İkincil] satıcı rehberi alıntıları; EcommerceBytes 2024 | Etsy siparişinden alınan e-posta, açık onay olmadan pazarlama listesine eklenmez |
| **Yorum** | [İkincil] Etsy anti-shilling; FTC Consumer Review Rule ve Endorsement Guides (hukuk bürosu özetleri) | Tek istek; teşvik yok; "5 yıldız" istemek yok. FTC olumlu yoruma bağlı teşviki yasaklıyor (ihlal başına $53,088'e kadar). "Review gating" (yalnız memnun müşteriyi yoruma yönlendirmek) aldatıcı sayılabiliyor |
| **Purchase Protection** | [R-özet] etsy.com/uk/trust + [İkincil] | Dijital üründe "açıklamaya uymuyor" vakası açılabiliyor. İlan iddiaları docs/05 §E'deki dürüst listeyle birebir olmalı |
| **Star Seller** | [İkincil]; (inceleme) [R-özet] seller-handbook 1020956976086 | 3 aylık dönem; ilk mesaja 24 saat içinde %95 yanıt; ortalama 4.8; ≥ 5 sipariş. (inceleme) İlk satıştan en az 90 gün geçmiş olmalı; "$300 satış" şartı tek forum kaynağında, doğrulanmadı. Yeni dükkân rozeti en erken ilk satıştan ≈ 3 ay sonra alır. → Destek yanıt süresi 24 saat (karar) |
| **Etsy API** | [İkincil] | `GET /v3/application/shops/{shop_id}/receipts/{receipt_id}` var → `/start`'ta gerçek sipariş doğrulaması mümkün görünüyor (Etsy uygulama onayı gerekebilir). Mesaj gönderme uç noktası yok (doğrulanmadı) → e-posta sağlayıcısı şart |
| **Yaratıcılık / AI** | [R-özet] legal/creativity; [İkincil] 2026 AI kutusu | İlanda "design elements created with AI (GPT)" beyanı (docs/05 §E zaten öngörüyor) |

### 4.2 Etsy-uyumlu alıcı akışı

**Hedef:** indirme → zarfın üstünde kendi isimleri → yayınlanmış link. Telefonda ve en az adımla. Süre ölçülmedi; "2 dakika"
gibi iddia yazılmaz.

1. **Etsy siparişi.** Shop Manager'da iki metin tanımlanır (API yok → tarayıcı otomasyonu, `claude-tarayici`):
   - **Message to Buyers:** makbuzda ve sipariş onay e-postasında görünür.
   - **Message to Buyers for Digital Items:** indirme sayfasında görünür, tüm dijital ilanlara uygulanır [R-özet] help 360000337107.
2. **START HERE PDF:** tek sayfa; ilk satırda büyük bir `/start` butonu. **Yalnız teslimat içeriği**: Etsy dışı fiyat, kupon ya
   da ek ürün yok.
3. **`/start`:** Etsy sipariş numarası + e-posta. Etsy API doğrulaması gelene kadar mevcut biçim kontrolü sürer.
   - **İşaretsiz, ayrı** bir pazarlama onay kutusu.
   - Gizlilik metnine link (K25: dükkân adı + destek e-postası).
4. **İşlemsel e-posta "Your private edit link"** (Resend gelince). Magic-link girişi (G060 §3) aynı sağlayıcıya bağlı.
5. **Panel:** kurulum sihirbazı → yayın (G060).
6. **Yayın anı:** paylaşım kiti. WhatsApp/iMessage metni + yazdırılabilir QR kart PDF'i; QR gerçek URL'den algoritmik (şart 8).
7. **RSVP dönemi:** yanıt bildirimleri, hatırlatma için paylaşım metni.
8. **Düğünden sonra:** teşekkür modu.
9. **Bitişten 30 gün önce:** bildirim + CSV indirme (ileride anı dosyası).
10. **Düğünden 12 ay sonra:** yayın süresi biter (K25; G060: salt okunur arşiv).

**Taslak metinler** (İngilizce; köşeli parantezli alanlar karar gelince dolar):

> **Message to Buyers / Digital Items**
> Thank you for your order! Your wedding website is ready to claim: [START LINK]
> Open the link on your phone or computer, enter your Etsy order number and email, and you will get your private edit link.
> Please save that link: it is the key to editing your site. Questions? Write to [SUPPORT EMAIL]. We reply within [SUPPORT HOURS].

> **Listing framing line**
> Digital wedding website template with instant access. Personalize it in your browser, no Canva or app needed.
> Your website stays online until 12 months after your wedding date.

> **Review request** (once, after publishing and first RSVPs; the same text for everyone)
> We hope your website is making wedding planning a little easier. If you have a moment, we would be grateful for a review on
> Etsy: [ETSY REVIEW LINK]. Something not right? Reply to this email and we will help.

> **End-of-hosting notice** (30 days before)
> Your wedding website will stay online until [END DATE]. Before then, you can download your RSVP list (CSV) from your editor.
> Questions? [SUPPORT EMAIL]

### 4.3 Düğün takvimi (panelde "sıradaki adım" kartı)
Kaynak: Joy, Greenvelope, Paperlust, The Lane, WeddingWire [İkincil, kırtasiye satıcıları].

| Adım | Ne zaman |
|---|---|
| Save the Date | Düğünden 6–8 ay önce (destinasyon düğününde 8–12 ay) |
| Davetiye | 6–8 hafta önce |
| RSVP son tarihi | 3–6 hafta önce |
| Teşekkür | Düğünden sonra 4 hafta – 3 ay içinde |

Panel bu takvimden bir sonraki adımı gösterebilir.

### 4.4 Panel ve platform yol haritası (G060 sonrası)
Panel v2 ve düzenleme hakkı G060'ta yapılıyor (durum: `alindi`). Aşağıdakiler onun üstüne gelen öneriler; görev açmak entegratörün işi.

| Öncelik | Özellik | Etki | Efor | Ücret | Not |
|---|---|---|---|---|---|
| P0 | Düzenleme linki e-postası + magic link | Çok yüksek (kayıp link = destek yükü) | Düşük–orta | — | Resend + alan adı |
| P0 | `/start`'ta işaretsiz pazarlama onay kutusu + gizlilik metni | Yasal gereklilik | Düşük | — | CAN-SPAM, CASL, UK PECR (§4.5) |
| P1 | **"Made with [BRAND]" ince alt bilgi** (her misafir sayfası → satış sitesi) | Çok yüksek edinim: her düğünde onlarca–yüzlerce misafir, bir kısmı nişanlı | Çok düşük | — | Misafirler Etsy alıcısı değil, Off-Platform kuralı dışında. Satış sitesi → Etsy Share & Save linki. (inceleme) Etsy alıcısı da kendi sitesinde bu linki görür. Faz 2'de satış sitesine Etsy dışı ödeme gelirse, Etsy'den gelen alıcıyı Etsy dışında satın almaya yönlendirmek sayılabilir. O zaman panelde ve alt bilgide satın alma yolu Etsy'de kalmalı |
| P1 | Yazdırılabilir QR kart PDF'i + paylaşım kiti | Yüksek (misafir trafiği, "kolay" algısı) | Düşük (`lib/qr.ts`, `tools/make_qr.py` var) | Ücretsiz | QR gerçek URL'den (şart 8) |
| P1 | RSVP özet e-postaları | Orta–yüksek | Düşük | Ücretsiz | Resend |
| P1 | Düğün sonrası teşekkür modu | Yüksek; 12 ay yayını anlamlı kılar | Düşük–orta | Ücretsiz | Bitiş bildirimiyle birleşir |
| P1 | RSVP hatırlatma (çiftin paylaşacağı metin; misafire toplu e-posta değil) | Orta–yüksek | Düşük | Ücretsiz | Misafire toplu e-posta izin/spam riski taşır, sonraya |
| P1 | Etsy API ile sipariş doğrulama | Kötüye kullanımı sınırlar | Orta | — | G060 ile birlikte; Etsy uygulama onayı gerekebilir |
| P2 | Eşleşen Save the Date sitesi | Yüksek; rakipler paket indirimiyle satıyor (docs/13 §1) | Orta (şemada `event_type` var) | Etsy varyasyonu (§3.8) | En temiz Etsy ek satışı |
| P2 | Renk değişimi (Aşama 2 paletleri) | Orta; rakip şikâyeti (docs/13 #23) | Varyantlar gelince düşük | Ücretsiz seçim | — |
| P2 | Kalıcı anı dosyası dışa aktarımı (ZIP/PDF) | Orta; Etsy'de "dijital ürün" niteliğini güçlendirir | Orta | Ücretsiz | Bitişten önce |
| P2 | Barındırma uzatma, ek düzenleme hakkı, kendi alan adını bağlama (alıcı alır; biz satın almayız) | Orta | Düşük–orta (Vercel domain API) | Panelde, MoR ile | §3.10 doğrulamasından sonra |
| P3 | Misafir fotoğraf albümü (QR ile yükleme) | Yüksek; bağımsız uygulamalar ≈ $25–119/etkinlik [İkincil] | **Yüksek**: moderasyon, uygunsuz içerik, gizlilik, depolama | Panelde, ücretli | Faz 3 |
| P3 | Yıldönümü sayfası, ikinci dil, müzik | Orta | Orta | — | Yıldönümü e-postası pazarlama onayı ister |

### 4.5 E-posta planı
Hepsi bir sağlayıcı gerektirir. Tür: **İ** = işlemsel, **P** = pazarlama (açık onay gerekir).

| Zaman | E-posta | Tür |
|---|---|---|
| T0 | Düzenleme linki + yayınlama adımları | İ |
| T+1 gün, yayınlanmadıysa | "Finish your website" (tek CTA: panel) | İ (birincil amaç hizmet) |
| Yayın anı | "Your website is live" + paylaşım kiti (mesaj metni, QR kart PDF'i) | İ |
| Her RSVP / haftalık özet | Yanıt bildirimi + CSV linki | İ |
| RSVP son tarihi − 7 gün | "Remind guests who haven't replied" (paylaşım metni) | İ |
| Yayın + ilk RSVP'ler (100 günlük pencerede) | Tek yorum isteği. Etsy siparişinde Etsy Messages **ya da** e-posta; ikisi birden değil | Sınırda, tek seferlik |
| Düğün + 1 gün | "Turn your site into a thank-you page" | İ |
| Bitişten 30 gün önce | Süre bildirimi + CSV/anı dosyası | İ |
| Yıldönümü | Yıldönümü sayfası / yeni ürün | **P**, yalnız onay verene |

**Hukuki çerçeve** [İkincil, resmi rehber sayfaları]:
- **CAN-SPAM (ABD):** "birincil amaç" testi; işlemsel kategori dar yorumlanıyor (FTC).
- **CASL (Kanada):** satın almadan sonra 2 yıl örtük onay. Açık onay daha güvenli.
- **UK PECR soft opt-in:** bilgi satış sırasında kişinin kendisinden alınmalı; toplama anında ve her mesajda ret seçeneği olmalı
  (ICO). Etsy'den gelen e-posta bu şartı karşılamıyor; `/start` formunda kendimiz topladığımız için onay kutusu orada.

**Sağlayıcılar** (fiyatlar [İkincil]; resmi sayfalar açılamadı):

| Sağlayıcı | Ücretsiz | İlk ücretli | Not |
|---|---|---|---|
| **Resend** | 3,000/ay, 100/gün | $20/ay, 50k | Vercel Marketplace entegrasyonu (`RESEND_API_KEY`). Audiences + Broadcasts ile ileride pazarlama da aynı yerden. Next.js / React Email uyumlu |
| Postmark | 100/ay (test) | $15/ay, 10k | İşlemsel teslimde güçlü |
| Amazon SES | 12 ay 3,000/ay (kaynaklar çelişiyor) | $0.10 / 1k | En ucuz; kurulum ve itibar yönetimi ağır |
| Brevo | 300/gün | $9/ay (5k) | Pazarlama + işlemsel tek panelde |
| Loops | ≈ 1k kişi (kaynaklar çelişiyor) | $49/ay | Yaşam döngüsü odaklı, düşük hacimde pahalı |

**Öneri:** Resend. Önkoşul: marka alan adı (SPF/DKIM). **Gelen posta** (destek kutusu) çözümü araştırılmadı; Google Workspace
dışındaki ücretsiz yönlendirme seçenekleri karar öncesi ayrıca bakılmalı.

**(inceleme) Destek kutusu seçenekleri** (fiyat sayfaları açılamadı; hepsi [İkincil] arama özetinden). Alan adı Vercel'den alınırsa
DNS Vercel'de kalır; aşağıdakilerin hepsi MX/TXT kaydıyla çalışır.

| Seçenek | Ücret | Sınır / not |
|---|---|---|
| Zoho Mail Forever Free | $0 | 5 kullanıcı, 5 GB/kullanıcı, 1 alan adı. Yalnız web ve Zoho uygulamaları; IMAP/POP yok (Mail Lite ≈ $1/kullanıcı/ay ekler) |
| ImprovMX Free (yönlendirme → kişisel Gmail) | $0 | Kaynaklar çelişiyor: 1 alan adı, 25 takma ad, 500 e-posta/gün (üçüncü taraf) ya da daha yüksek (resmi sayfa özeti). Ücretsizde SMTP yok, yanıt kişisel adresten gider |
| Resend gelen posta | Free planda "sending & receiving" yazıyor | Gelen posta webhook'la gelir, posta kutusu değildir. Destek kutusu için tek başına uygun değil |
| Google Workspace Starter | ≈ $7–8.40/kullanıcı/ay | Tam posta kutusu, Gmail arayüzü |

En ucuz ve tam çalışan yol: **Zoho Mail Free** (`hello@<alanadı>`, web/telefon uygulaması). Giden işlemsel e-posta yine Resend'den.

### 4.6 Yorum, kupon, tavsiye
- **Yorum:**
  - Etsy'nin otomatik yorum isteği kalır. Bizden tek ek istek, ilk değer anında: yayın + ilk RSVP'ler; pratikte satın almadan
    3–21 gün sonra.
  - Dijital üründe yorum penceresi 100 gün; başlangıcı (ilk indirme mi, teslim mi) kaynaklarda çelişkili [İkincil].
  - Panelde herkese aynı "Leave a review on Etsy" linki, yanında "Something not right? Contact us". Filtre yok.
  - Satış sitesi için ayrı müşteri yorumu toplanacaksa açık izin kutusu konur ve metin değiştirilmez (FTC).
- **Kupon:**
  - Etsy mağaza kuponları (teşekkür kuponu, sepette bırakma, favori teklifleri) [İkincil]. Kişiye özel kupon üretmenin API'si yok
    (doğrulanmadı) → az sayıda kampanya kodu.
  - Teşekkür kuponunun kötüye kullanıldığı raporlar var (Modern Retail 2024).
  - **Hiçbir kupon yoruma bağlanmaz.**
- **Tavsiye:**
  - Panelde yayından sonra: "Know an engaged couple? [X]% off on Etsy with code [CODE]". Satın alma Etsy'de kalır → uyumlu.
  - Tavsiye edene Etsy kuponu verilemez. Panel içi ayrıcalık verilebilir (ör. ek düzenleme hakkı, +1 ay). Teşvik tavsiye için,
    Etsy dışında satın alma için değil.

### 4.7 Diğer kanallar ve doğrudan satış

| Kanal | Artı | Eksi | Öneri |
|---|---|---|---|
| Kendi site + Stripe | En düşük ücret | Stripe Türkiye'deki işletmeye **büyük olasılıkla kapalı** [İkincil: Dodo Payments, Osome, Türk YMM rehberi; stripe.com/global açılamadı]. Stripe Atlas = ABD şirketi, K25 "yasal kimlik yok" ile çelişir | Uygun değil (şimdilik) |
| Kendi site + MoR (Paddle / Gumroad / Lemon Squeezy) | KDV/satış vergisi MoR'da; kart + PayPal. Paddle'ın satış ülkeleri listesinde TR var [R-özet] | ≈ %5 + $0.50 (Paddle, LS) / %10 + $0.50 (Gumroad) [İkincil]. Satıcı ülke uygunluğu ve TR'ye ödeme **doğrulanmadı**; şahıs KYC yine gerekir. Lemon Squeezy'nin Stripe Managed Payments'a geçtiği iddiası doğrulanmadı | **Faz 2:** panel ekleri + Etsy dışı yeni müşteri. Önce satıcı uygunluğu |
| Payhip, Polar, Shopify Payments | — | Stripe/PayPal'a dayanıyor; PayPal Türkiye'de yok [İkincil, Alura] | Büyük olasılıkla uygun değil |
| Shopify | Hazır vitrin | Basic ≈ $39/ay (yıllıkta $29); harici ödemeyle +%2; satış sitemiz (G061) zaten var | Gerek yok |
| Amazon Handmade | — | Dijital/indirilebilir ürün kabul edilmiyor (sell.amazon.ca) | Hayır |
| Creative Market | Tasarım alıcısı kitlesi | Küratörlü; komisyon "ürüne göre değişir"; ürünümüz dosya değil, barındırılan site | Düşük öncelik |
| Gumroad Discover | Ek keşif | Discover satışında %30 | Düşük |
| Pinterest / TikTok (trafik) | Düğün planlamasında güçlü görsel kanallar | Ölçülmedi | G061 ile birlikte; linkler satış sitesine → Etsy Share & Save |

**Rekabet:** Zola, Joy ve The Knot ücretsiz düğün sitesi + RSVP veriyor; Joy'da misafir foto paylaşımı da var [İkincil].
Farkımız tasarım ve zarf "şov"u, tek seferlik ödeme, Canva bilgisi gerektirmemesi. İlan dilinde bu gerçek kullanılır; ücretsiz
rakipler küçümsenmez.

### 4.8 Öncelik sırası

**P0, ilk satıştan önce** (düşük efor, yüksek risk azaltma):
1. Marka + alan adı kararı → Resend: düzenleme linki e-postası, magic link, RSVP bildirimi. Destek e-postası aynı alan adında.
2. Etsy "Message to Buyers" ve "Message to Buyers for Digital Items" metinleri (tarayıcı otomasyonu).
3. `/start`'ta işaretsiz pazarlama onay kutusu + gizlilik metni.
4. İlan ve PDF'ten Etsy dışı satın alma imaları ve QR'ın çıkarılması. "subscription / hosting plan" yerine
   "digital template + instant access; online until 12 months after your wedding".
5. Destek yanıt süresi 24 saat (Star Seller).
6. Satış sitesindeki Etsy butonları = Share & Save linki.
7. Etsy ücret ekranı, Services ve Off-Platform metinlerinin Shop Manager'da okunması; Vercel Pro'nun panelden doğrulanması.

**P1, ilk 2–4 hafta:** "Made with" alt bilgisi · QR kart + paylaşım kiti · RSVP özet e-postaları · teşekkür modu ·
bitiş −30 gün e-postası · tek yorum isteği · Etsy kuponları (teşekkür + kampanya kodu) · Etsy API ile sipariş doğrulama.

**P2:** Save the Date varyasyonu · renk seçimi (paletlerle) · anı dosyası · MoR ödeme altyapısı → barındırma uzatma, ek düzenleme
hakkı, kendi alan adını bağlama.

**P3:** Misafir fotoğraf albümü (ücretli) · yıldönümü sayfası · ikinci dil · müzik.

---

## 5. Kullanıcının vermesi gereken kararlar

**(inceleme) Bu hafta, bu sırayla.** Her biri bir sonrakinin önkoşulu:
1. **Ad + alan adı alım onayı.** Destek e-postası, Resend, START HERE linkleri ve ilan görselleri buna bağlı (§2.5, §5b-1).
2. **Etsy dükkânı kimin adına, hangi ülkenin bankasıyla açılacak.** Bireysel satıcı da kimlik + selfie, yasal ad, adres ve adına
   banka hesabı ister (risk 8). Etsy payı ve net bu seçime bağlı (TR ≈ %25, UK ≈ %20.5, US ≈ %13.4).
3. **Fiyat gösterimi:** düz $29.40 (öneri) mi, üstü çizili $49 mu (risk 7). Lansman fiyatı $24.50 süreli mi, düz mü.
4. **Destek kutusu sağlayıcısı** (öneri: Zoho Mail Free; §4.5) ve yanıt süresi (öneri: 24 saat).
5. **Vercel Pro durumu:** API iki kez 404 döndü; panelden bakılmalı (risk 5).

**Marka ve iletişim**
- [ ] Marka / dükkân adı (öneri: **Seal & Story**; yedekler Seal & Sonnet, Silk & Seal, Fold & Vow, Vellum Lane)
- [ ] Alan adı alımına onay (`.com` $11.25/yıl, Vercel); `.co` savunma kaydı istenir mi
- [ ] Destek e-postası adresi (öneri: `hello@<alanadı>`) ve gelen posta sağlayıcısı (ücretli Google Workspace ≈ $7–8.40/ay ya da ücretsiz yönlendirme; (inceleme) ücretsiz posta kutusu Zoho Mail Free, §4.5)
- [ ] Destek yanıt süresi (öneri: 24 saat; Star Seller şartı)

**Etsy ve ödeme**
- [ ] Etsy dükkânı ve ödeme hesabının ülkesi (TR / US / UK). Etsy payını (≈ %25 / %13.4 / %20.5) ve doğrudan satış seçeneklerini belirler
- [ ] (inceleme) Dükkânı açacak kişi: Etsy kimliğini, adresini ve adına banka hesabını doğrulayacak gerçek kişi (risk 8)
- [ ] İlan para birimi (öneri: USD ile başla; TRY %2.5 kazandırır ama sık fiyat güncellemesi ister)
- [ ] Offsite Ads: $10k altındayken kapalı mı (öneri: kapalı)
- [ ] Etsy Ads günlük bütçesi (minimum $1/gün)
- [ ] Services riski: önce 1–2 ilanla başlayıp gözlemek mi, hazır bütün tasarımları birlikte mi açmak

**Fiyat**
- [ ] Strateji: **A** (öneri) / B / C
- [ ] (inceleme) Fiyat gösterimi: düz fiyat (öneri) / üstü çizili liste fiyatı (risk 7)
- [ ] Lansman fiyatı: $24.50, ilk ~30 gün ya da ilk ~25 sipariş (süreli kampanya ya da düz fiyat)
- [ ] Varyasyonlar: lansmanda yalnız "Wedding Website"; Save the Date gelince "Website + Save the Date" ($41.40)
- [ ] Ek ürünler lansmanda satılmasın mı (öneri: satılmasın; ertelenen düğün için tarih değişikliği ücretsiz)

**Satış sonrası**
- [ ] E-posta sağlayıcısı (öneri: Resend)
- [ ] "Made with [BRAND]" alt bilgisi her sitede zorunlu mu; ücretli kaldırma seçeneği olsun mu
- [ ] Tavsiye kampanyası indirim oranı
- [ ] Ek ürünlerin listesi ve sırası (§4.4)

**Doğrulanacaklar** (otomasyonla; satın alma yok):
- Etsy ücret, KDV ve Services/Off-Platform metinleri: Shop Manager'da (`claude-tarayici`)
- Vercel Pro'nun aktif olduğu: Vercel paneli
- Marka tescil araması (USPTO, UKIPO, Kanada, Avustralya), Etsy dükkân adı, sosyal kullanıcı adları
- MoR (Paddle / Gumroad) satıcı uygunluğu ve Türkiye'ye ödeme (Faz 2 öncesi)
- (inceleme) Etsy'de satıcı türü (Individual / Business) ve AB'li ziyaretçilere gösterilecek satıcı bilgileri. İkincil kaynaklara
  göre Etsy, profesyonel satıcıyı "trader" sayıp işletme bilgilerini AB'li ziyaretçilere gösteriyor; doğrulanmadı
- (inceleme) Kalıcı indirim için UK (CMA/DMCC) ve AB kuralları (risk 7 yalnız Etsy ve ABD FTC'ye bakıyor)

### 5b. Önerilen görevler (entegratör açar)
1. **Marka/alan adı bağlama:** alan adı alındıktan sonra Vercel projesine ekleme. `PLATFORM_PUBLIC_URL` ve `LISTING_BASE_URL`
   güncellenir; START HERE PDF'leri ve ilan görselleri yeniden üretilir (docs/05 §C).
2. **Resend entegrasyonu** (`claude-kod`): düzenleme linki e-postası, magic link, RSVP bildirimi; `lib/claim/mailer.ts`.
3. **`/start` onay kutusu + gizlilik sayfası** (`claude-kod` + `claude-metin`).
4. **Etsy Shop Manager ayarları** (`claude-tarayici`): Message to Buyers metinleri, Offsite Ads kararı, kuponlar, ücret ekranı ve
   politika metinlerinin okunması. (inceleme) Fiyatlar düz girilir; lansman ve sezon indirimleri ≤ 30 günlük kampanyadır (risk 7).
5. **İlan kitlerinin düzeltilmesi** (`claude-metin` / `claude-kod`): 8. görseldeki QR'ın çıkarılması; "online until 12 months
   after your wedding date" dili; `[PRICE]`, `[HOSTING PERIOD]`, `[SUPPORT EMAIL]` yer tutucularının kararla doldurulması.
6. **"Made with [BRAND]" alt bilgisi + QR kart PDF'i + paylaşım kiti** (`claude-kod`).
7. **Satış sitesi (G061):** Etsy butonları Share & Save linki; marka adı tek yapılandırma dosyasından.
8. **Save the Date ürünü** (tema + `event_type: save_the_date`), Faz 2.

---

## 6. Kaynaklar

Açılamayan kaynaklar ve ne oldukları: etsy.com, help.etsy.com, developers.etsy.com, vercel.com, stripe.com, paddle.com,
docs.lemonsqueezy.com, tmsearch.uspto.gov, trademarks.justia.com, trademarkia.com, instagram.com (2026-10-14; WebFetch DNS hatası /
curl proxy CONNECT 403). Bu sitelerin URL'leri aşağıda yalnız arama özetinin kaynağı olarak geçiyor.

**Ölçüm ve repo**
- Vercel MCP `get_bulk_availability`, `get_bulk_price` (salt okuma alan adı sorguları, 2026-10-14)
- Vercel MCP `list_billing_charges` `team_pZ2ioUaryATDt15wOOUcCkQD` → `404 "Plan not found"` (2026-10-14)
- docs/01_KULLANICI_KARARLARI.md (K22–K25), docs/05_SET_PAKETI.md (§C, §E, §G), docs/10_SITE_PLATFORMU.md, docs/13_ETSY_ARASTIRMA.md
- gorevler/G060-panel-v2-duzenleme-hakki.md, gorevler/G061-satis-sitesi.md
- platform/lib/panel/photos.ts, platform/lib/site/static.ts, platform/lib/site/render.ts, platform/lib/data/blob/index.ts

**Marka adı**
- https://help.etsy.com/hc/en-us/articles/115015710568-How-to-Change-Your-Shop-Name [R-özet]
- https://www.etsy.com/seller-handbook/article/top-tips-for-choosing-your-etsy-shop/23181234159 [R-özet]
- https://thingtesting.com/brands/seal-and-scribe
- https://www.1stdibs.com/dealers/seal-and-scribe/
- https://www.mannpublications.com/fashionmannuscript/2024/11/07/sincere-corporation-introduces-lovebird-redefines-how-engaged-couples-communicate-with-wedding-guests/
- https://techcrunch.com/2012/06/18/sincerely-ink-and-brit-morins-weduary-team-up-on-wedding-invites-collection/amp
- https://caratsandcake.com/vendor/the-paper-vow
- https://rockmywedding.co.uk/wedding-suppliers/paper-vows
- https://en.wikipedia.org/wiki/Gilt_Groupe
- https://en.wikipedia.org/wiki/Wren%27s_Super_Wax_Shoe_Polish
- https://artisaire.com/products/wren-monogram-wax-stamp
- https://www.swaggerandswoon.com/pages/about-us
- https://www.etsy.com/market/wax_and_vellum [R-özet]
- https://www.etsy.com/shop/HouseOfVellum [R-özet]
- https://www.phillymag.com/news/2007/07/03/elegant-wedding-bridal-bouquet-haddonfield-of-dreams/
- https://www.wtvr.com/2014/09/12/fashion-forward-styles-for-the-bride-to-be
- https://bridebook.co.uk/wedding-stationery/with-love-wedding-stationery-tibberton-shropshire-csDm8zmjYR
- https://bridebook.com/uk/wedding-stationery/labelled-with-love-swanley-kent-csGX3eGeGY
- https://www.theknot.com/paper/product/gilded-nouveau-wedding-invitation-autenvelopes
- https://www.zola.com/wedding-vendors/wedding-extras/heirloom-ink
- https://m.weddingwire.com/biz/heirloom-paper-co-encino/35752b99c72b30f5
- https://www.theknot.com/marketplace/heirloom-washington-dc-2046806
- https://heroarts.com/blogs/spellbinders-blog/april-2025-wax-seal-of-the-month-preview-tutorials-petal-postage
- https://www.mannpublications.com/fashionmannuscript/2024/12/19/mark-graham-expands-the-monogram-wedding-shop/
- https://soundcharts.com/en/artist/51e41992-e461-40b2-94c2-27187fa03301
- https://trademarks.justia.com/owners/birgel-susanne-1750862 [arama özeti]
- https://www.hellomagazine.com/fashion/410750/klum-seal-vows-beach
- https://prod-ccroc-direct.merriam-webster.com/thesaurus/laced

**Fiyat: Etsy**
- https://www.etsy.com/legal/fees/ [R-özet]
- https://www.etsy.com/legal/etsy-payments/ [R-özet]
- https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy [R-özet]
- https://help.etsy.com/hc/en-us/articles/360000344668-Currency-Conversion-Fees [R-özet]
- https://help.etsy.com/hc/en-us/articles/1500011073202-What-is-a-Regulatory-Operating-Fee [R-özet]
- https://help.etsy.com/hc/en-us/articles/360040584433-How-VAT-Is-Collected-on-Seller-Fees [R-özet]
- https://help.etsy.com/hc/en-us/articles/115015587567-How-VAT-Works-on-Digital-Items [R-özet]
- https://help.etsy.com/hc/articles/360000343968 [R-özet]
- https://help.etsy.com/hc/articles/360033701174 [R-özet]
- https://www.etsy.com/legal/policy/etsys-share-save-terms-program-terms/1162874007996 [R-özet]
- https://www.growtsy.com/etsy-fees/regulatory-operating-fee
- https://www.growtsy.com/etsy-fees/vat
- https://iscompliant.app/Blog/etsy-regulatory-fee-2026
- https://www.valueaddedresource.net/etsy-ups-regulatory-operating-fees/
- https://craftybase.com/blog/everything-you-should-know-about-etsy-offsite-ads
- https://app.craftybase.com/blog/the-complete-guide-to-etsy-fees
- https://printful.com/blog/how-much-does-etsy-take-per-sale
- https://checkoutpage.com/blog/etsy-fees
- https://globalfeecalculator.com/blog/etsy-fees-uk-explained/
- https://www.feeproofed.com/guides/etsy-fee-increase-history-2018-2026/
- https://sellerprofitlens.com/guides/etsy-fee-changes-2026
- https://www.growingyourcraft.com/blog/how-much-does-it-really-cost-to-sell-on-etsy

**Fiyat: barındırma, e-posta, pazar**
- https://vercel.com/docs/plans/pro-plan [R-özet]
- https://vercel.com/docs/vercel-blob/usage-and-pricing [R-özet]
- https://vercel.com/docs/fluid-compute/pricing [R-özet]
- https://vercel.com/docs/limits [R-özet]
- https://makerkit.dev/blog/tutorials/vercel-cost
- https://www.usagepricing.com/blueprint/activity/vercel-2026-09-11-flat-rate-cdn-launch (doğrulanmamış iddia)
- https://resend.com/docs/knowledge-base/what-is-resend-pricing.md
- https://www.emailvendorselection.com/google-workspace-pricing/
- https://theknot.com/content/average-wedding-cost
- https://paperlust.co/blog/wedding-website-builders-compared/

**Satış sonrası: Etsy politikaları**
- https://www.etsy.com/legal/policy/off-platform-transactions/1254654515806 [R-özet]
- https://www.etsy.com/legal/policy/off-platform-transactions-policy/1254654515806 [R-özet]
- https://www.etsy.com/legal/policy/services/242665313101 [R-özet; son güncelleme 9 Haz 2026]
- https://www.etsy.com/legal/sellers/ [R-özet]
- https://www.etsy.com/legal/buyers/ [R-özet]
- https://www.etsy.com/help/article/4508 [R-özet]
- https://www.etsy.com/legal/creativity/ [R-özet]
- https://help.etsy.com/hc/articles/360000337107-Message-to-Buyers [R-özet]
- https://help.etsy.com/hc/en-gb/articles/115013328108-Downloading-a-Digital-Item [R-özet]
- https://www.etsy.com/uk/trust [R-özet]
- https://www.ecommercebytes.com/2024/01/07/etsy-cracks-down-on-marketing-to-buyers/
- https://www.ecommercebytes.com/2023/09/06/etsy-rewards-sellers-for-driving-traffic-to-their-listings/
- https://alura.io/docs/article/etsy-payments-guide-by-country
- https://listingview.io/blogs/how-to-get-more-reviews-on-etsy-without-breaking-the-rules
- https://www.growingyourcraft.com/blog/how-to-get-more-5-star-reviews-for-your-etsy-shop-templates
- https://craftybase.com/blog/how-to-become-etsy-star-seller
- https://www.modernretail.co/technology/etsy-is-cracking-down-on-coupon-misuse/
- https://apis.io/apis/etsy/etsy-shop-receipt-api/
- https://www.rapidevelopers.com/api-automations/how-to-automate-etsy-customer-messages-using-the-api
- https://blog.marmalead.com/etsy-policy-updates/

**Satış sonrası: e-posta hukuku ve yorum**
- https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/how-do-we-comply-with-the-pecr-electronic-mail-marketing-rules/
- https://www.electrofed.com/a-review-casl-the-5-types-of-consent/
- https://www.venable.com/insights/publications/2025/12/ftc-signals-heightened-enforcement-of-new
- https://www.venable.com/insights/blogs/2023/07/ftc-finalizes-updated-endorsement-and-testimonial

**Satış sonrası: ödeme ve kanallar**
- https://dodopayments.com/blogs/stripe-supported-countries-alternatives
- https://osome.com/uk/blog/stripe-account-turkey-guide
- https://www.manaycpa.com/tr/?p=69408
- https://developer.paddle.com/concepts/sell/supported-countries-locales [R-özet]
- https://www.paritydeals.com/lemon-squeezy-vs-paddle-fees/
- https://dodopayments.com/blogs/lemonsqueezy-review
- https://schoolmaker.com/blog/gumroad-pricing.md
- https://www.websitebuilderexpert.com/ecommerce-website-builders/shopify/shopify-pricing
- https://sell.amazon.ca/programs/handmade
- https://support.creativemarket.com/hc/en-us/articles/201251700-Open-a-Shop-on-Creative-Market

**Satış sonrası: e-posta sağlayıcıları, takvim, misafir albümü**
- https://automationatlas.io/answers/resend-pricing-explained-2026/
- https://automationatlas.io/answers/postmark-pricing-explained-2026/
- https://www.costbench.com/software/email-api/amazon-ses/
- https://dreamlit.ai/blog/brevo-review
- https://sequenzy.com/versus/brevo-vs-loops
- https://skills.sh/vercel/vercel-plugin/email
- https://resend.com/blog/new-features-in-2024
- https://withjoy.com/blog/wedding-stationery-timeline-when-you-should-send-what/
- https://www.greenvelope.com/resources/when-to-send-wedding-invitations-and-save-the-dates
- https://paperlust.co/blog/wedding-invitation-timeline/
- https://www.wedibox.com/compare/best-wedding-photo-sharing-apps
- https://www.yogile.com/blog/best-wedding-photo-sharing-app

**(inceleme) İkinci tur, 2026-10-14.** Aynı siteler yine açılamadı (WebFetch DNS hatası, curl proxy CONNECT 403; ek olarak
resend.com, improvmx.com, zoho.com, ftc.gov, ico.org.uk, archive.org). Aşağıdakiler arama özetinden.
- Ölçüm: Vercel MCP `get_bulk_availability` (10 alan adı), `get_domain_price` sealandstory.com, `get_team` (plan alanı yok),
  `list_billing_charges` → yine `404 "Plan not found"`; docs/09_TASARIM_KATALOGU.md "Zarf tipi" ve "Kapanış" sütunları
- Kalıcı indirim: https://www.etsy.com/seller-handbook/article/1450964704111 [R-özet, 12 Oca 2026] ·
  https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233 [R-özet] · https://www.law.cornell.edu/cfr/text/16/233.1 ·
  https://www.listadum.com/blog/truthful-advertising-and-discounts-on-etsy-what-sellers-need-to-know [İkincil]
- Satıcı kimliği: https://help.etsy.com/hc/en-us/articles/360001980067-How-to-Verify-Your-Seller-Information-for-Etsy-Payments [R-özet] ·
  https://help.etsy.com/hc/en-us/articles/22481159004567-How-to-Verify-Your-Identity-on-Etsy [R-özet]
- AB satıcı bilgisi: https://www.valueaddedresource.net/etsy-new-requirements-selling-eu/ ·
  https://valueaddedresource.net/etsy-removes-required-seller-details-from-uk-eu-stores [İkincil]
- Ödeme işleme CA/AU: https://help.etsy.com/hc/articles/115015628847 [R-özet]
- TR ücretleri: https://globalfeecalculator.com/etsy-fee-turkey/ · https://navlungo.com/en/blog/etsy-fee-guide ·
  https://www.valueaddedresource.net/etsy-ups-regulatory-operating-fees/ · https://www.ideasoft.com.tr/etsy-komisyon-oranlari/ [İkincil]
- Offsite Ads: https://help.etsy.com/hc/articles/360000338367 [R-özet]
- Share & Save: https://help.etsy.com/hc/pt/articles/16981332744087 [R-özet, Portekizce] · https://valueaddedresource.net/etsy-introduces-share-save-marketing-incentive-for-sellers [İkincil]
- Messages / QR: https://www.etsy.com/help/article/4508 [R-özet]
- Star Seller: https://www.etsy.com/seller-handbook/article/1020956976086 [R-özet] · https://craftybase.com/blog/how-to-become-etsy-star-seller [İkincil]
- Destek kutusu: https://www.improvmx.com/pricing [R-özet] · https://freetier.co/directory/products/improvmx ·
  https://www.capterra.com/p/174694/Zoho-Mail/pricing/ · https://codroiditlabs.com/is-zoho-email-still-free-guide/ ·
  https://resend.com/pricing.md [R-özet] · https://resend.com/blog/new-free-tier [R-özet]
- Ad çakışması: "Seal & Story", "Seal and Story", "SEAL & STORY trademark", "Silk and Seal / Fold and Vow / Vellum Lane /
  Seal and Sonnet" aramaları (2026-10-14; eşleşme yok)
