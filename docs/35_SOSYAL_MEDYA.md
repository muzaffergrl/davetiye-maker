# Sosyal medya — hesap hazırlığı ve ilk 30 gün (BKE Studio, 2026-10-22)

Kullanıcı isteği (2026-10-22): "sosyal medya hesapları için hazırlık yapalım bkestudio için. görselleri yine gpt'ye
yaptıralım. 1 aylık paylaşım planlamasını yapalım hazırlayalım."

| Dosya | Ne |
|---|---|
| bu belge | strateji, hesap kurulumu, 30 günlük takvim, üretim akışı, kurallar |
| `brand/social/takvim.csv` | takvimin tek kaynağı (gönderi başına bir satır; zamanlama aracına aktarılabilir) |
| `brand/social/CAPTIONS.md` | İngilizce biyografiler, gönderi metinleri, ekran yazıları, hashtag'ler, Pinterest başlıkları |
| `brand/social/GPT_PROMPTS.md` | GPT'nin üreteceği 21 görsel (GM10); `docs/27_GPT_IS_LISTESI.md` D grubunda kopyala-yapıştır hâlinde |
| `gorevler/GM10`, `G191`, `G192` | GPT görselleri · Claude kompozisyon/video · hesap açma ve zamanlama |

## 0. Durum (dürüst)

- **Hazır:** plan, takvim, bütün metinler, GPT prompt'ları (21 görsel), görev dosyaları. GPT iş listesi yeniden üretildi.
- **Yapılmadı:** hiçbir hesap açılmadı; kullanıcı adlarının boş olduğu **kontrol edilmedi** (instagram.com, tiktok.com,
  pinterest.com bu ortamdan açılamıyor, docs/15 §2.1); hiçbir görsel üretilmedi ya da birleştirilmedi; hiçbir gönderi
  zamanlanmadı.
- **Lansmana bağlı:** gönderilerin hepsi bkestudio.com'daki tasarım sayfalarına ve canlı demolara gider. Satış sitesi
  `launched: false` ve Etsy ilanları henüz yok (K41, docs/29). Takvim bu yüzden **"Gün 1 = lansmandan sonraki ilk
  pazartesi"** diye yazıldı; örnek tarihler 2 Kasım – 1 Aralık 2026. Lansman kayarsa tarihler kayar, sıra aynı kalır.
  Hesaplar lansmandan önce açılıp profil hazırlanabilir (§2), ama ilk gönderi lansmanla birlikte.

## 1. Kanallar ve hedef

Hedef kitle docs/14 §4.2 ile aynı: ABD, Birleşik Krallık, Kanada ve Avustralya'da 6–12 ay içinde evlenecek, telefondan plan
yapan, Pinterest ve Etsy'de stil arayan çiftler (25–38). Ürünün en güçlü anı **zarfın açılışı**: kısa dikey videoda
kendini anlatıyor.

| Kanal | Rol | Sıklık (ay 1) | Neden |
|---|---|---|---|
| **Pinterest** (işletme hesabı) | Ana trafik kanalı: arama + uzun ömürlü pin → tasarım sayfası → demo → Etsy | Günde 2 pin, toplam 60 | Çiftler düğün planını Pinterest'te yapıyor (docs/14 §1, Pinterest 2026 düğün raporu); pin aylarca trafik getirir |
| **Instagram** (profesyonel hesap) | Vitrin ve güven: Reels + kaydedilen bilgi gönderileri + hikâyeler | Haftada 6–7 akış gönderisi (27), hikâye 15 | Alıcı Etsy'de satın almadan önce markayı arar; dolu ve tutarlı profil güven verir |
| **TikTok** (işletme hesabı) | Erişim: açılış videoları ve "POV" kısa videolar | Haftada 4–5 (18) | Açılış animasyonu tam bu biçim için; Reels'in aynısı yerel olarak yüklenir |
| Facebook sayfası | İsteğe bağlı; Instagram'dan otomatik paylaşım | — | Meta Business Suite zamanlaması bir Facebook sayfası istiyor [VERIFY]; içerik ayrı üretilmez |

İçerik sütunları (ay boyunca dağılım):
1. **Gösteri (%45):** her tasarımın gerçek açılışı, 9:16 ekran kaydı (R serisi). 21 tasarımın 13'ünün bu ay kendi Reel'i var; 09 ve 13 karma videoda (R05), hepsi K10'da ve Pinterest'te.
2. **Nasıl çalışır / kolaylık (%25):** 3 adım, telefondan düzenleme, RSVP, Excel/Google Sheets, diller, müzik, harita.
3. **Planlama yardımı (%20):** kaydedilen kontrol listeleri ve rehberler (K03, K05, K07, K08) → Pinterest'te uzun ömürlü pin.
4. **Marka ve güven (%10):** kim olduğumuz, neler dahil, teşekkür sayfası. Uydurma yorum yok; gerçek yorum geldikçe eklenir.

## 2. Hesap kurulumu

**Kullanıcı adı (tercih sırası, müsaitlik bilinmiyor):** `@bkestudio` → `@bke.studio` (Instagram/TikTok nokta kabul eder;
Pinterest etmez) → `@studiobke` (Etsy dükkân adıyla aynı, K35) → `@bkestudio.co`. Üç platformda **aynı ad** hedeflenir;
biri alınmışsa üçünde de sıradaki seçenek kullanılır.

| Alan | Değer |
|---|---|
| Görünen ad | `BKE Studio \| Wedding Websites` (Instagram'da aranabilir alan) |
| Profil fotoğrafı | `brand/etsy/etsy_shop_icon_1000.png` (daire kırpımına uygun, %32,4 iç daire; brand/README) |
| Biyografi | `brand/social/CAPTIONS.md` § Profiles (IG 123/150, TikTok 63/80, Pinterest 405/500 karakter) |
| Bağlantı | `https://bkestudio.com/?utm_source=<kanal>&utm_medium=social&utm_campaign=bio` |
| Kategori | Instagram: "Product/service" ya da "Wedding planning service" [VERIFY: listede olanı]; Pinterest: "Wedding" / "Design" |
| Pinterest kapak | `brand/assets/gpt/final_s/brand_scene_wide_s.png`'den 16:9 kırpım (G191; yeni GPT gerekmez) |
| Instagram öne çıkanlar | Designs · How it works · RSVP · FAQ · Tips (SM1.1–SM1.5) |
| İletişim | `bkestudio@gmail.com` (K33); telefon yok |

**Pinterest site doğrulaması:** bkestudio.com'u Pinterest'te sahiplenmek pin'lere site adını ve analitiği ekler. Pinterest
bir `<meta name="p:domain_verify" content="…">` kodu verir; claude-kod bunu satış sitesinin `<head>`'ine koyar (G192 → kod
isteği). Kod hesap açılınca belli olur.

**Hesap açma kimin işi:** Her platform telefon/e-posta doğrulaması ister ve hesap kullanıcının kimliğine bağlıdır. K15 gereği
kullanıcıya iş verilmez: G192 bunu `claude-tarayici` olarak kullanıcının bilgisayarındaki tarayıcıda yapar. Doğrulama
kodunun geldiği telefon/e-posta adımı tek seferlik ve otomatikleştirilemez: **açık blokaj** olarak G192'de kayıtlı.

## 3. Paylaşım saatleri (başlangıç varsayımı, ölçümle değişir)

Kitle ABD/UK ağırlıklı; Türkiye saati (UTC+3) ABD Doğu saatinden 8 saat ileride (ABD'de yaz saati 1 Kasım 2026'da bitiyor).
Bu yüzden gönderiler **zamanlanır**, elle saatinde atılmaz.
- Instagram akış: 12:00 ET (20:00 TR); Reels için ikinci deneme 19:00 ET (03:00 TR, zamanlanmış).
- TikTok: 19:00 ET (03:00 TR, zamanlanmış).
- Pinterest: 2 pin/gün, 20:00 ve 23:00 TR; Pinterest'in kendi zamanlayıcısı ile [VERIFY: kaç gün ileriye izin veriyor].
- Hikâyeler: 14:00 ET (22:00 TR).
İlk iki haftadan sonra Instagram ve TikTok'un kendi "kitlen ne zaman aktif" verisine göre düzeltilir (§9).

## 4. Pinterest planı (60 pin)

Panolar (açıklamalar İngilizce, anahtar kelimeli):
1. Wedding Website Designs by BKE Studio — 21 tasarım pini
2. Envelope Opening Wedding Invitations — 21 video pini (açılış)
3. Wedding Website Ideas & Wording — K03, K05 + özellik pinleri
4. Wedding Planning Checklists — K07, K08
5. Winter Wedding Ideas — 06, 07, 08, 17, 19 (pinler 1–2. panodan buraya da kaydedilir)
6. Garden & Floral Weddings — 01, 03, 09, 15, 18
7. Destination & Coastal Weddings — 05, 10, 12, 20

Dağılım: 21 tasarım pini (2:3, gerçek kapak karesi + ad) + 21 video pini (dikey açılış) + 18 rehber/özellik pini
(SM2.6 ve SM3.4/SM3.5 zeminleri, gerçek ekranlar). Sıra: ilk hafta mevsim tasarımları (kış, sonbahar, black-tie) önce.
Her pin tasarım sayfasına gider (`/designs/<id>`), Etsy'ye değil (docs/14 §7.1 yol 2); oradaki "Buy on Etsy" Share & Save
linkidir. Başlık/açıklama kalıbı: `CAPTIONS.md` § Pinterest.

## 5. 30 günlük takvim

Haftalık tema: **1** BKE Studio'yu tanıtma · **2** misafir ne görür · **3** düzenlemek kolay · **4** mevsim (Şükran Günü,
Black Friday, nişan sezonu) · **29–30** Cyber Monday ve ay özeti. İlk gün profil boş görünmesin diye **3 gönderi** (K01, R01,
K02) atılır ve profile sabitlenir. Pinterest her gün 2 pin (§4) ve tabloda ayrıca yazılmadı.

Kod: **R** Reel (Instagram ve TikTok'a aynı video; "TT" yalnız TikTok) · **K** kaydırmalı gönderi (carousel, 4:5) ·
**T** tek görsel (4:5) · **S** hikâye (9:16). Metinler: `CAPTIONS.md`, aynı kodla.

| Gün | Tarih | Platform | Biçim | Kod | Konu | Tasarım | Görsel kaynağı |
|---|---|---|---|---|---|---|---|
| 1 | 11-02 Pzt | IG | carousel (sabitle) | K01 | Meet BKE Studio | 03 01 19 | SM2.1 + gerçek açılış kareleri + sayfa ekranları + SM3.1 (panel) + SM2.3 |
| 1 | 11-02 Pzt | IG+TT | reel | R01 | Davetiye misafirin telefonunda açılıyor | 03 Blush Garden Rose | dikey açılış kaydı (G191) |
| 1 | 11-02 Pzt | IG | carousel (sabitle) | K02 | How it works in 3 steps | — | SM2.2 + gerçek /start + panel + Share ekranları |
| 1 | 11-02 Pzt | IG | story | S01 | Merhaba + demo linki | — | SM2.4 + R01 karesi |
| 2 | 11-03 Sal | TT | reel | R02 | Misafir ne yapmaz: uygulama yok hesap yok | 02 Dusty Blue | dikey kayıt: açılış → RSVP gönder (G191) |
| 2 | 11-03 Sal | IG | story | S02 | Anket: kâğıt mı dijital mi | — | SM2.4 |
| 3 | 11-04 Çar | IG+TT | reel | R03 | Midnight Garden açılışı | 19 Midnight Garden | dikey açılış kaydı |
| 4 | 11-05 Per | IG | carousel | K03 | What to put on your wedding website (checklist) | — | SM2.1 + SM2.2 + gerçek sayfa ekranları |
| 4 | 11-05 Per | IG | story | S03 | K03'ü paylaş + soru kutusu | — | SM2.5 |
| 5 | 11-06 Cum | IG+TT | reel | R04 | Yılbaşı düğünleri için gatefold | 06 Art Deco Black-Tie | dikey açılış kaydı |
| 6 | 11-07 Cmt | IG | tek görsel | T01 | Edit it together from the sofa | — | brand/trust/t3_couple_editing + gerçek panel ekranı |
| 6 | 11-07 Cmt | IG | story | S04 | Soru: düğün renginiz | — | SM2.4 |
| 7 | 11-08 Paz | TT | reel | R05 | 15 saniyede 3 farklı açılış | 01 09 13 | 3 dikey açılış kaydı kurgusu |
| 8 | 11-09 Pzt | IG+TT | reel | R06 | Misafiriniz ne görür: baştan sona | 02 Dusty Blue | dikey kayıt: açılış → Home → Details → RSVP |
| 8 | 11-09 Pzt | IG | story | S05 | R06 paylaş + demo linki | — | R06 karesi |
| 9 | 11-10 Sal | IG | carousel | K04 | RSVP: misafirin yaptığı / sizin gördüğünüz | — | SM2.2 + gerçek RSVP formu + Guests listesi + Excel |
| 10 | 11-11 Çar | IG+TT | reel | R07 | Kış düğünü: Winter Evergreen | 08 Winter Evergreen | dikey açılış kaydı |
| 10 | 11-11 Çar | IG | story | S06 | Bu mu o mu: 08 vs 19 | 08 19 | SM2.5 + iki kapak karesi |
| 11 | 11-12 Per | IG | tek görsel | T02 | No app no account: misafir RSVP | — | brand/trust/t2_guest_rsvp + gerçek RSVP ekranı |
| 12 | 11-13 Cum | IG+TT | reel | R08 | Destination: seyahat cüzdanı | 12 Tropical Destination | dikey açılış kaydı |
| 13 | 11-14 Cmt | IG | carousel | K05 | Wedding website welcome message ideas | — | SM2.1 + SM2.2 |
| 13 | 11-14 Cmt | IG | story | S07 | K05 paylaş + anket | — | SM2.4 |
| 14 | 11-15 Paz | TT | reel | R09 | Takvime ekle + harita + yol tarifi | 05 Mediterranean Lemon | dikey kayıt: Details → takvim → harita |
| 15 | 11-16 Pzt | IG+TT | reel | R10 | Telefonda 3 adımda kurulum | 03 Blush Garden Rose | dikey kayıt: /start → sihirbaz 3 adım → Publish |
| 15 | 11-16 Pzt | IG | story | S08 | R10 paylaş + soru kutusu | — | SM2.5 |
| 16 | 11-17 Sal | IG | carousel | K06 | Everything you can change | — | SM2.2 + gerçek panel Edit bölümleri |
| 17 | 11-18 Çar | IG+TT | reel | R11 | Sonbahar: Burgundy Velvet | 07 Burgundy Velvet Autumn | dikey açılış kaydı |
| 18 | 11-19 Per | IG | tek görsel | T03 | One website five languages | — | SM3.7 + gerçek dil düğmesi ekranı |
| 18 | 11-19 Per | IG | story | S09 | Anket: kaç dil lazım | — | SM2.4 |
| 19 | 11-20 Cum | IG+TT | reel | R12 | Ivory Lace & Pearls gatefold | 14 Ivory Lace & Pearls | dikey açılış kaydı |
| 20 | 11-21 Cmt | IG | carousel | K07 | When to send what: wedding website timeline | — | SM2.1 + SM2.2 + SM3.10 |
| 20 | 11-21 Cmt | IG | story | S10 | K07 paylaş | — | SM2.5 |
| 21 | 11-22 Paz | TT | reel | R13 | Hikâye sayfasında müzik + tek dokunuşla sessiz | 10 Tuscan Vineyard | dikey kayıt: Our Story + ses düğmesi (sesli) |
| 22 | 11-23 Pzt | IG+TT | reel | R14 | Emerald & Gold açılışı | 17 Emerald & Gold Estate | dikey açılış kaydı |
| 22 | 11-23 Pzt | IG | story | S11 | Hafta duyurusu: just engaged rehberi geliyor | — | SM2.4 |
| 23 | 11-24 Sal | IG | carousel | K08 | Just engaged? Your first 7 to-dos | — | SM3.3 + SM2.2 |
| 24 | 11-25 Çar | IG+TT | reel | R15 | Crimson Rose Atelier açılışı | 21 Crimson Rose Atelier | dikey açılış kaydı |
| 25 | 11-26 Per | IG | tek görsel | T04 | Thanksgiving: düğün sonrası teşekkür sayfası | — | SM3.9 + gerçek teşekkür modu ekranı |
| 25 | 11-26 Per | IG | story | S12 | Teşekkür notu (satış yok) | — | SM2.5 |
| 26 | 11-27 Cum | IG+TT | reel | R16 | Black Friday: A kampanya varsa / B 21 tasarım hızlı geçiş | 01–21 | 21 açılış karesi kurgusu |
| 26 | 11-27 Cum | IG | story | S13 | A: kampanya bitiş tarihi / B: favorini seç | — | SM2.5 |
| 27 | 11-28 Cmt | IG | carousel | K09 | Which design fits your wedding | 01 03 05 06 08 11 12 20 | SM2.1 + gerçek kapak kareleri |
| 28 | 11-29 Paz | TT | reel | R17 | Bir zarf nasıl website olur: katmanlar | 01 Olive & Ivory | GPT parça katmanları (collections/01/assets/gpt/parts) + açılış kaydı |
| 29 | 11-30 Pzt | IG+TT | reel | R18 | Olive is having a moment | 01 Olive & Ivory | dikey açılış kaydı |
| 29 | 11-30 Pzt | IG | story | S14 | A: Cyber Monday son gün / B: ay özeti | — | SM2.5 |
| 30 | 12-01 Sal | IG | carousel | K10 | Meet all 21 designs | 01–21 | SM2.3 + 21 gerçek kapak karesi |
| 30 | 12-01 Sal | IG | story | S15 | Aralık = nişan sezonu: K08'i yeniden paylaş | — | SM3.10 |

Toplam: Instagram akış 27 (13 Reel, 10 carousel, 4 tek görsel) · TikTok 18 · Instagram hikâye 15 · Pinterest 60.

**Black Friday (27 Kasım) ve Cyber Monday (30 Kasım) — karar:** R16, S13, S14 iki sürümle yazıldı.
- **A — yalnız gerçek kampanya varsa:** Etsy satış aracında süreli indirim kurulursa (docs/15 §0 önerisi: %25–40, en çok
  30 gün; kalıcı indirim değil), metindeki `[X]%` ve `[END DATE]` Etsy'deki gerçek değerle doldurulur.
- **B — varsayılan:** indirim yok; "21 tasarım" hızlı geçiş videosu ve anket. Kampanya kararı gelmezse B yayınlanır.

## 6. Gönderi öncesi kontrol (her gönderi)

1. Gösterilen özellik **canlıda** çalışıyor mu? Takvimdeki özellik gönderileri (R09 harita/takvim, R13 müzik, K04 Excel ve
   Google Sheets, T03 diller, T04 teşekkür sayfası, R10 kurulum) yalnız o özellik bkestudio.com'da canlı ve docs/20 elle
   testinde denenmişse yayınlanır. Denenmediyse gönderi aynı haftanın bir açılış Reel'iyle yer değiştirir.
2. Link açılıyor mu: tasarım sayfası ve `/start/demo/<id>` telefonda 200 dönüyor ve doğru tasarımı gösteriyor.
3. Metin `CAPTIONS.md`'deki hâliyle mi; `[LINK]`, `[X]`, `[END DATE]` gibi yer tutucu kalmadı mı.
4. Görselde yazım hatası, kesilen yazı, Instagram/TikTok arayüzünün altında kalan başlık yok (9:16'da üst %14 ve alt %20
   boş bırakılır).
5. Fotogerçekçi GPT sahnesi varsa platformun yapay zekâ etiketi açık (§8).

## 7. Üretim akışı

| Adım | Kim | Görev | Çıktı |
|---|---|---|---|
| 1 | GPT (imagegen) | **GM10** | 21 görsel → `brand/social/gpt/` (5 öne çıkan kapağı, 6 zemin, 10 yaşam sahnesi). Liste: docs/27 D grubu |
| 2 | Claude (kod) | **G191** | (a) 21 tasarımın **dikey** açılış kaydı (1080×1920; bugünkü `video.mp4`'ler Etsy için 1080×1080 kare, Reels'e uymaz); (b) yeşil ekranlara gerçek ekranlar (`tools/mockup_compose.py`), QR (`tools/make_qr.py`); (c) başlıklar HTML → PNG, marka fontları; (d) her gönderi için hazır dosya `brand/social/out/<kod>/` |
| 3 | Claude (tarayıcı) | **G192** | Hesapları açma, profil, öne çıkanlar, Pinterest panoları ve site doğrulaması; gönderileri haftalık topluca zamanlama |
| 4 | Claude (QA) | G191 sonunda | §6 kontrolü ve `CAPTIONS.md` iddialarının ilan metniyle tutarlılığı |

Neden GPT her şeyi çizmiyor: ürünün kendisi (açılış, sayfalar, panel) gerçek ekran olmalı. GPT'nin çizdiği bir telefon
ekranı ürünü olduğundan farklı gösterir (AGENTS.md: görsel üretimi ≠ ürün). GPT ortamı, eli, masayı, zemini ve ikonları
üretir; ürün yeşil alana gerçek ekran olarak girer. Mevcut GPT sahneleri yeniden kullanılır: `brand/trust/t2`, `t3`
(misafir, çift), her tasarımın ilan görselleri (`package/listing/images_editorial/`) ve GPT parçaları (R17 katman videosu).

## 8. Kurallar ve dürüstlük

- AGENTS.md dürüstlük kuralları sosyal medyada da geçerli: yalnız canlıda çalışan özellik; uydurma yorum, müşteri sayısı,
  "best seller", "loved by" yok; demo çiftler "sample" diye geçer; fiyat yazılmaz (dükkân TRY, alıcı kendi para biriminde
  görür; K38).
- Açılış nesnesi doğru adlandırılır: 06 ve 14 gatefold, 09 keten kese, 12 seyahat cüzdanı, 13 masal kitabı, 18 vellum kılıf.
- **Yapay zekâ etiketi:** TikTok gerçekçi yapay zekâ içeriğinin etiketlenmesini istiyor; Meta (Instagram) da gerçekçi
  yapay zekâ görsellerine "AI info" etiketi uyguluyor ve OpenAI görsellerindeki C2PA bilgisini okuyabiliyor
  [VERIFY: her iki platformun güncel kuralı]. SM3 sahnesi ve `brand/trust` fotoğrafı içeren gönderilerde etiket açılır.
  Zemin ve ikon görselleri (SM1, SM2) için gerekmez.
- Gerçek kişi yok: GPT sahnelerindeki insanlar kurgusal; "müşterimiz" ya da "çiftimiz" denmez.
- Rakip adı, logosu, gönderisi ya da müziği kullanılmaz. Reels/TikTok'ta müzik: platformun ticari kullanıma açık kütüphanesi
  ("Commercial Sounds" / Meta Sound Collection) ya da bizim `platform/public/audio/` parçalarımız (LICENSES.md); popüler
  şarkı kullanılmaz (işletme hesabı).
- Etsy kuralı (docs/15 §1): Etsy içinden dışarı yönlendirme yasak; **dışarıdan Etsy'ye** gelmek serbest. Sosyal → bkestudio.com
  → Etsy Share & Save yolu buna uygun.
- Kampanya: yalnız gerçek ve süreli (docs/15 risk 7); "bugüne özel" gibi sahte aciliyet yok.

## 9. Ölçüm (haftalık, 30. günde gözden geçirme)

| Kanal | Bakılan | 30. gün sorusu |
|---|---|---|
| Pinterest | gösterim, kaydetme, dış bağlantı tıklaması (pin başına) | Hangi tasarım/rehber pinleri tıklatıyor → ay 2'de o türden fazla |
| Instagram | Reels izlenme ve ortalama izleme süresi, kaydetme, profil ziyareti, bağlantı tıklaması | Açılış Reel'i mi, rehber carousel'i mi daha çok profil ziyareti getiriyor |
| TikTok | izlenme, ortalama izleme süresi, profil ziyareti | İlk 2 saniye kancası işliyor mu (izleme %'si) |
| Satış sitesi | `utm_source` = pinterest / instagram / tiktok → `demo_open`, `etsy_click` (docs/14 §11) | Hangi kanal demo açtırıyor ve Etsy'ye gönderiyor |

30. günde: en iyi 5 gönderi türü ikinci aya taşınır, en zayıf 2 tür bırakılır; kendi Reel'i olmayan 8 tasarım (04, 09, 11, 13,
15, 16, 18, 20) ay 2'nin açılış Reels'i olur. 22–48 tasarımları satışa açıldıkça "new design"
serisi eklenir.

## 10. Açık kararlar ve blokajlar

1. **Lansman tarihi** (docs/29): Gün 1 buna bağlı.
2. **Kullanıcı adları:** müsaitlik hesap açılırken görülür; §2 sırası uygulanır, sonuç G192'ye yazılır.
3. **Hesap doğrulaması:** telefon/e-posta kodu (tek seferlik, otomatikleştirilemez) — G192 blokajı.
4. **Black Friday kampanyası:** A mı B mi (§5). Karar gelmezse B.
5. **Yayın aracı:** Instagram ve TikTok'un kendi zamanlayıcıları ya da Meta Business Suite (ücretsiz) [VERIFY: güncel
   sınırlar]. Ücretli araç (Later, Buffer vb.) önerilmez; gerekirse ayrı karar.
