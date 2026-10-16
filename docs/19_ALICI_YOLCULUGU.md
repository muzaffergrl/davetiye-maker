# Alıcı yolculuğu — ilan, satın alma ve satış sonrası (G091, K32, 2026-10-15)

K32 (kullanıcı, 2026-10-15): Etsy alıcısının kafasında ilanı incelerken, satın alırken ve satın aldıktan sonra **hiçbir soru
işareti ve endişe** kalmamalı; siteyi kolayca düzenleyebileceğine ikna olmalı; satış sonrası bütün bilgilendirme ve rehberler
hazır olmalı.

Bu belge alıcı yolculuğunun tek kaynağıdır: aşama aşama harita (§2), soru envanteri (§3), Etsy metinleri ve **admin panelinin
kullanacağı satış sonrası mesaj şablonları** (§4), START HERE rehberinin yapısı (§5, ortak kaynak Ek A'da), panel / `/start` /
satış sitesi için metin önerileri (§6) ve açık kalanlar (§7).

**Kurallar** (AGENTS, docs/05 §E): yalnız kodda olan ve test edilmiş özellik vaat edilir; doğrulanmamış iddia `[VERIFY …]`;
karar verilmemiş ticari alan köşeli parantezli yer tutucu (`[RESPONSE TIME]`, `[REFUND POLICY]` …) kalır; tarih `June 12, 2027`;
rakip metni kopyalanmaz. **K33 (2026-10-15):** dükkân adı **BKE Studio**, destek e-postası **bkestudio@gmail.com** (şimdilik);
bütün alıcı metinlerinde bu değerler kullanılır. Ürün metni İngilizce, açıklamalar Türkçe.

**Dayanak:** kaynak kod (2026-10-15, main `9fd88e1`) — `platform/app/start/StartForm.tsx`, `lib/claim/*`, `components/panel/*`,
`lib/panel/rights.ts`, `lib/panel/guest-access.ts`, `lib/site/access.ts`, `lib/rsvp/*`, `lib/marketing/{config,facts,faq}.ts`;
ekranlar `platform/previews/g066/panel/after_*`, `g068`, `g069`, `g075`, `g076`, `g080`; docs/05, 10, 13, 15, 16. Tarayıcı testi
bu görevde koşulmadı (makine meşgul; görev tanımı).

**Önemli zaman notu:** bu belge ve rehberler **K29 sade paneline** (3 adımlı kurulum, Home/Edit/Guests/Share, 6 sayfa,
"Headings & labels", teşekkür modu, misafir şifresi) göre yazıldı. Canlıda son doğrulanmış sürüm G078 (`2dc812b`, panel eski
görünümde); K29 paneli canlıya **G079** ile çıkacak. G079 yayını ve canlı kontrolü bitmeden START HERE PDF'leri ve ilanlar
satışa girmez (§7).

---

## 0. Özet — bulunan soru işaretleri ve nerede kapandı

| # | Alıcıda kalan soru işareti / endişe | Bugünkü durum | Bu görevde | Kalan |
|---|---|---|---|---|
| 1 | "Satın aldım, şimdi ne yapacağım? Dosya nerede?" | İlanda 4 adım; Etsy'nin dijital ürün mesajı yalnız taslak (docs/15 §4.2) | Dükkân geneli **Message to Buyers / Digital Items** metni `…/start` (tasarım seçici) linkiyle (§4.4); START HERE'de "Start now: the first 5 steps" | Metinler Shop Manager'a girilmeli (tarayıcı işi) |
| 2 | "Düzenleme linkini kaybedersem ne olur?" — en büyük destek riski | `/start` "Save this link" uyarısı; e-posta yok | Rehberde ayrı "Save your edit link" bölümü, 3 kaydetme yolu, **panel içinden yeniden kopyalama** (Share → Your private edit link) ve kayıp link süreci; `new_edit_link` şablonu | E-posta gönderimi (P0, docs/15 §4.8) |
| 3 | "Neyi değiştirebilirim? Başlıklar da değişir mi?" | Eski ilan "headings stay as they are" diyor — **artık yanlış** (G068 Headings & labels, 5 temada manifest var) | `listing_v3.md` + rehber düzeltildi: başlıklar/etiketler değişir; sanat, renk, font, yerleşim, zarf animasyonu sabit | Satış sitesinde "Languages other than English" maddesi (§6 öneri 3) |
| 4 | "Siteyi ne kadar süre açık kalır?" | Eski ilan `[HOSTING PERIOD]` | K25 kararı yazıldı: düğünden 12 ay sonrasına kadar; panelde **Online until** tarihi | Uzatma politikası `[EXTENSION POLICY]` |
| 5 | "İsim/tarih yanlış girersem? Düğün ertelenirse?" | Panel kuralı var; ilanda yok | İlanda, rehberde ve SSS'de 3 hak + bedava düzeltmeler + geri alma; `date_moved`, `extra_change_granted` şablonları | Erteleme politikası `[POSTPONEMENT POLICY]` |
| 6 | "Yayınla düğmesi neden çalışmıyor?" (manuel sipariş onayı) | Panelde "We are confirming your Etsy order" | Rehberde ayrı bölüm; `publish_blocked_pending` + `order_confirmed` şablonları | Onay süresi `[ORDER CHECK TIME]` |
| 7 | "Misafirlerim nasıl cevap verir, uygulama/hesap gerekir mi, kaç kişi?" | Satış sitesi SSS'sinde kısmen | İlanda "What your guests see", rehberde misafir tarafı (≤ 10 kişi/yanıt, "Send another reply") | — |
| 8 | "Telefonumda olur mu?" | "Designed for phone screens"; gerçek telefon testi yok | Aynı dürüst ifade; ilanda `[VERIFY]` korunur | Gerçek iPhone/Android testi |
| 9 | İlan görselleri eski paneli gösteriyor; 3. görsel "every step in pictures" diyor | Görseller K29 öncesi (Couple bölümü, Save/Preview/Publish) | `listing_v3.md` §5'te uyarı + görsel önerileri | `listing_kit capture` G079 sonrası yeniden (önerilen görev) |
| 10 | 02, 04, 05'in START HERE'i ve ilanı yok; 02'ninki Canva dönemi | — | 5 tasarımın START HERE.md + PDF'i ve `listing_v3.md`'si yazıldı | Görsel/video kiti (G9NN) |

---

## 1. Ürünün bugünkü gerçek davranışı (cevapların dayanağı)

Her cevap bu tabloya dayanır. "Kaynak" sütunu kodun yeri; "Doğrulama" docs/05 §E ve görev kayıtları.

| Konu | Gerçek davranış | Kaynak | Doğrulama |
|---|---|---|---|
| Başlat linki | `/start?theme=<tema>`; temasız `/start` onaylı tasarımları listeler ("Choose your design") | `app/start`, `lib/themes/approval.ts` | Yerel + canlı (G044/G049; temasız liste G080 ekranı) |
| `/start` formu | Etsy order number (8–12 rakam; boşluk, `#`, "Order" kabul) · Email address (saklanır, gönderilmez) · first names (1 ya da 2) · Website address (isimlerden önerilir, doluysa sayı eklenir, **sonradan değişmez**) → **Create my website** | `StartForm.tsx`, `lib/claim/fields.ts` | Test edildi (G045, G080) |
| Sipariş başına | **Bir site**; aynı numara ikinci kez → "This order already has a website" | `lib/claim/claim.ts` | Yerel + canlı (409) |
| Bağlantı koparsa | Form aynı belirteçle bir kez kendisi yeniden dener; site açıldı ama cevap gelmediyse yeni link verir (24 saat içinde, yayınlanmamış taslak) | `claim.ts` §6 | Birim testleri |
| Düzenleme linki | Ekranda **bir kez**, büyük kutuda; **Copy link**, **Email it to myself** (alıcının kendi posta uygulaması, `mailto:`); "We cannot email it to you yet". Panelde sonra: **Share → Your private edit link → Copy edit link** | `StartForm.tsx`, `views.tsx` | Test edildi |
| E-posta | Platform e-posta göndermez (düzenleme linki, RSVP bildirimi, hatırlatma yok); `/signin` kapalı | `lib/claim/mailer.ts`, `lib/panel/signin.ts` | Doğru |
| Kayıp link | Dükkân `scripts/reissue-edit-key.ts` ile yeni link üretir; **eski link hemen ölür**; içerik/foto/yanıt aynı kalır | `scripts/reissue-edit-key.ts` | Yerel test; canlı depoda denenmedi; politika `[LOST LINK POLICY]` |
| Sipariş onayı (manuel mod) | Taslak hemen açılır; dükkân Etsy'de kontrol edip `verify-order.ts` ile onaylayana kadar **Publish kapalı**; panelde "We are confirming your Etsy order…"; onaydan sonra sayfa yenilenince Publish açılır | `Setup.tsx` `OrderPendingNote`, `lib/panel/brand.ts`, `scripts/verify-order.ts` | Kod + test; canlıda açık olduğu görev tanımında (2026-10-15) bildirildi |
| Kurulum | 3 adım: **Your names and date** → **Add your photo** → **Publish your website**; 1–2 "Skip for now", her an "Save & exit"; örnek tarih kapısı ("Your wedding date is still the design's sample") | `Setup.tsx`, `pages.ts` | Test edildi (G066-B tarayıcı testleri) |
| Panel | Alt sekmeler **Home · Edit · Guests · Share** (masaüstünde üstte, sağda sabit önizleme); üstte kayıt durumu (bulut), önizleme (göz), Publish/Live | `Panel.tsx`, `views.tsx` | Test edildi (Chromium 390/1280) |
| Edit sayfaları | **Us · Day & place · Photos · Our Story · Details · RSVP**; her sayfanın sonunda **Headings & labels on this page** | `pages.ts`, `CopyFields.tsx` | Test edildi; 5 temada copy manifesti (71–79 anahtar) |
| Sınırlar | İsim 40 · program 10 satır · SSS 12 · RSVP sorusu 3 (çoktan seçmeli ≤ 8 seçenek ya da kısa cevap) · teşekkür başlığı 60, mesajı 400 · monogram 9 | `lib/content/limits.ts`, `sections.tsx` | Şema testleri |
| Fotoğraflar | 5 yer (davet portresi, 3 hikâye, mekân) + isteğe bağlı teşekkür fotoğrafı; JPG/PNG/WebP/AVIF/HEIC, ≤ 30 MB; kırpma (sürükle, kaydırıcı ya da iki parmak); boş yer = tasarımın yumuşak yer tutucusu | `PhotosSection.tsx`, `PhotoCropper.tsx` | Yerel + canlı; HEIC gerçek iPhone'da denenmedi |
| Kayıt | Yazarken otomatik; çevrimdışıyken telefonda yedek, bağlantı gelince kaydeder; başka cihazda değişmişse "Reload" | `usePanel.ts`, `Panel.tsx` | Test edildi |
| Yayın | İlk yayın: "Before you publish" (örnek metin, boş foto, linksiz bölüm) + kurallar kutusu; sonra **Unpublished changes: n · Review · Publish** | `Panel.tsx`, `Setup.tsx` | Test edildi |
| İsim/tarih hakkı | Yayından sonra **3 değişiklik toplam** (birlikte değişenler 1); her zaman bedava: isimde ≤ 2 harf düzeltme, soyadı ekleme/çıkarma, tarihi ≤ 7 gün kaydırma; örnek tarihi gerçek tarihle bir kez bedava değiştirme; **10 dk içinde ya da yayından önce geri alma** hakkı geri verir; hak bitince destek ekler (`grant-identity-change.ts`) | `lib/panel/rights.ts`, `IdentitySheet.tsx` | Test edildi (G060) |
| Misafir şifresi | Share → Guest password; tek ortak şifre 4–40 karakter, büyük/küçük harf fark etmez; "Suggest a password"; misafir tarayıcısı **90 gün** hatırlar; değişince yeniden sorulur; varsayılan kapalı | `GuestPassword.tsx`, `lib/panel/guest-access.ts`, `lib/site/access.ts` | Yerel + ayrı geçici canlı sitede (G078) |
| Teşekkür modu | Day & place → After the wedding: Automatic (düğünden sonraki gece yarısı, düğün saat diliminde) / On now / Off; başlık, mesaj, foto; The Day Keep/Hide; modda RSVP kapanır, yanıtlar panelde kalır | `ThankYou.tsx` | Yerel (G075) |
| RSVP | Misafir: ad, gelip gelmediği, kişi sayısı (**yanıt başına ≤ 10**), diğer misafir adları (isteğe bağlı), mesaj, çiftin soruları (yalnız gelenlere); hesap/uygulama yok; değiştirmek için "Send another reply"; son gün sonunda (düğün saat dilimi) kapanır; "Accept replies on the website" kapatılabilir | `lib/rsvp/*`, tema `rsvp.html` | Yerel + canlı (G044); özel sorular canlıda uçtan uca denenmedi |
| Yanıtlar (çift) | Guests: sayılar, her yanıt, arama/filtre, soru cevapları, **Download list** (CSV, kişi başına satır), **Add a reply**, düzeltme, **Print list**, **Refresh**, "Held for review" (olağandışı hacim; sayılmaz, çift tutar ya da siler) | `guests.tsx`, `lib/rsvp/couple.ts` | Test edildi (G069) |
| Misafir sayısı | Toplam misafir/yanıt sınırı yok. Olağandışı hız (sitede saatte > 200 yanıt ya da aynı bağlantıdan saatte > 10) silinmez, "held" olur; yalnız günde 500 bekleyen yanıt dolarsa yeni yanıt reddedilir | `lib/rsvp/config.ts` | Kod |
| Paylaşım | Share: link (Copy/Open/Share), **QR code for printed cards** (Download PNG/SVG, gerçek URL'den), link önizleme kartı (isim + tarih) | `views.tsx`, `lib/qr.ts` | Yerel; QR telefon kamerasıyla okutulmadı |
| Arama motoru | Çift siteleri `noindex` (Google'da listelenmez); reklam yok | `lib/site/render.ts` | Kod |
| Çevrim dışı alma | Share → **Take the website offline** → misafir "Page not found"; içerik/yanıt kalır; "Publish again" | `views.tsx`, `Panel.tsx` | Test edildi |
| Yayın süresi | Düğünden **12 ay** sonraki günün ertesi 00:00'da arşiv (site saat dilimi); Home → Dates → **Online until**; 30 gün kala Home'da uyarı; arşivde misafir sayfası kapanır, panel okunur, CSV indirilebilir. Tavan: ilk yayından en geç 48 ay (kodda açık, docs/16 §15 öneri — kullanıcı kararı bekliyor) | `rights.ts`, `views.tsx` | Test edildi (G060); K25 |
| Hiç yayınlanmayan taslak | 18 ay sonra önizleme 410 | `rights.ts` | Test edildi |
| Dil | Kişisel metinler ve tasarım başlıkları/etiketleri kendi sözlerle yazılabilir; tarih stili Month first / Day first; platform mesajları (RSVP form hata metinleri, takvim metni) İngilizce; Latin aksanlı + Kiril tema fontlarıyla, diğer alfabeler düz yedek fontla | `copy.ts`, `sections.tsx`, docs/05 §E | Yerel (2026-10-14) |
| Pakette yok | Özel alan adı, müzik, renk/font/yerleşim değişimi, misafirlere e-posta gönderimi, misafir listesi içe aktarma, basılı davetiye, Save the Date | `lib/marketing/facts.ts` | — |

---

## 2. Yolculuk haritası

Her aşamada: **Alıcı** (ne yapıyor) · **Sorular** · **Bugün nerede** · **Boşluk** · **Kapanış** (bu görev / öneri).
Yer kodları: **İ** ilan açıklaması · **İG** ilan görseli · **İS** ilan SSS'si · **M** Etsy mesajı (otomatik metinler + §4.5
şablonları) · **SH** START HERE · **ST** `/start` · **P** panel · **SS** satış sitesi.

### A1. Arama sonucu (kapak, başlık, fiyat)
- **Alıcı:** küçük kapak görselini (~300 px) ve başlığı görüyor.
- **Sorular:** Bu bir Canva şablonu mu, website mi? Basılı mı? RSVP var mı? Telefonda mı?
- **Bugün:** kapak "No Canva needed · RSVP built in · Live demo" (İG1); başlık "Wedding Website with RSVP, Envelope Opening…".
- **Boşluk:** "dijital, basılmaz" ve "no app" kapakta yok (kapakta yer sınırlı, doğru seçim).
- **Kapanış:** başlık kalıbı korunur (§4.2). Öneri: kapak etiketlerinden biri ileride "Edit on your phone" olabilir — gerçek
  telefon testi gelene kadar **yazılmaz**.

### A2. İlanı inceleme (görseller, açıklama, video, demo)
- **Sorular:** Tam olarak ne alıyorum? Ne değişir, ne sabit? Misafir ne görür? Ne kadar süre açık? Kaç değişiklik hakkım var?
  Benim dilimde olur mu? Kendi alan adım? Fotoğrafsız olur mu? Şifre? Ödemeden sonra ne olacak?
- **Bugün:** eski ilanda "What you get / How it works / Please note / FAQ"; demo QR'ı (İG8).
- **Boşluk:** "headings stay as they are" (yanlış, G068 sonrası); `[HOSTING PERIOD]` (K25 kararı yazılmamış); isim/tarih hakkı,
  teşekkür modu, misafir şifresi, yayın öncesi sipariş onayı, "linki kaydet" uyarısı yok; İG3 "every step in pictures" (rehberde
  resim yok); İG4/İG5 eski paneli gösteriyor.
- **Kapanış:** `listing_v3.md` (ortak iskelet §4.1): What you get · How it works in 3 steps · What you can change · What your
  guests see · What you need · Good to know · FAQ. Görsel boşlukları `listing_v3.md` §5'te ve §7'de.

### A3. Satın alma
- **Sorular:** Kişiselleştirme kutusuna isim yazmam gerekir mi? (Hayır.) Hangi tasarımı aldığımı sonra seçebilir miyim? Ödeme
  sonrası ne kadar beklerim?
- **Bugün:** "Personalization: Off" önerisi; "instant access" ifadesi satış sitesinde.
- **Kapanış:** İ'de "Nothing to fill in at checkout"; "How it works" 1. adım; SSS "When can I start?".

### A4. İndirme (Etsy)
- **Alıcı:** Etsy onay e-postası; Purchases and reviews → Download files; ya da hiç bakmıyor.
- **Sorular:** Dosyam nerede? Etsy uygulamasında açılmıyor. PDF'te ne var? Başka bir şey indirmem gerekir mi?
- **Bugün:** ilan §8'de tasarıma özel kısa mesaj; ama Etsy'nin "Message to Buyers for Digital Items" alanı **dükkân geneli**
  (tüm dijital ilanlara aynı metin; docs/15 §4.2) → tasarıma özel link oraya konamaz.
- **Kapanış:** §4.4 dükkân geneli metinler `…/start` (tasarım seçici) ile: PDF açılmasa bile alıcı başlar. `start_link_reminder`
  şablonu (3 gün içinde site açılmadıysa). `[VERIFY: Etsy app shows digital downloads]` — Etsy uygulamasında indirme davranışı
  bu ortamdan doğrulanamadı; metinler iki yolu da anlatır.

### A5. `/start`
- **Sorular:** Sipariş numaram nerede? E-postamı neden istiyorsunuz, spam gelir mi? Adres neye benzer, sonra değişir mi? Yanlış
  yazarsam? İkimiz de başlatabilir miyiz?
- **Bugün:** alan ipuçları iyi (order number nerede, e-posta neden, adres değişmez, taslak gizli).
- **Boşluk:** sonuç ekranındaki **"Start another website"** düğmesi "bir sipariş = bir site" ile çelişiyor gibi duruyor;
  sayfada yardım yolu (Etsy mesajı) yok.
- **Kapanış:** SH 1. adım + sorun giderme; §6 öneri 5–6.

### A6. Düzenleme linkini kaydetme (kritik an)
- **Sorular:** Bu link ne? Şifrem nerede? Kaybedersem? Eşim de girebilir mi? Telefonumu değiştirirsem?
- **Bugün:** "Save this link" kutusu güçlü; "Email it to myself" kendi posta uygulamasını açar.
- **Boşluk:** linkin panelden yeniden kopyalanabildiği hiçbir yerde söylenmiyor (alıcı "tek şans" sanıp paniğe kapılıyor);
  ana ekrana ekleme ipucu yalnız Share'in içinde.
- **Kapanış:** SH "Save your edit link: it is your key" bölümü; §6 öneri 4 (`/start` sonuç ekranına bir satır).

### A7. Kurulum (3 adım)
- **Sorular:** Hepsini şimdi doldurmam gerekir mi? Saat dilimi nedir? Tam ad zorunlu mu? Fotoğrafım yoksa?
- **Bugün:** sihirbaz metinleri net ("Everything else can wait", "Skip for now").
- **Kapanış:** SH "Step 2. Set up in three steps".

### A8. Sipariş onayı bekleme (manuel mod)
- **Sorular:** Neden Publish edemiyorum? Ne kadar sürer? Bir şey mi yaptım? Değişikliklerim kaybolur mu?
- **Bugün:** panel bandı: "We are confirming your Etsy order. Everything you set up is saved; you can publish as soon as the order
  is confirmed."
- **Boşluk:** süre yok; onay sonrası **sayfayı yenilemek** gerektiği söylenmiyor; dükkân alıcıya haber vermiyor
  (`verify-order.ts` "Nothing is sent to the buyer").
- **Kapanış:** SH bölümü; `publish_blocked_pending` + `order_confirmed` şablonları; §6 öneri 7 (süre yer tutucusu + "reload").

### A9. Düzenleme
- **Sorular:** Nerede ne değişiyor? Başlıkları değiştirebilir miyim? Renk/font? Kaydet düğmesi nerede? İki kişi aynı anda?
  Örnek metin kalırsa? Fotoğraf yüklenmiyor.
- **Bugün:** 6 sayfa; "Sample" etiketi; Home'da "N% ready" + sıradaki 3 iş.
- **Kapanış:** SH "Step 3/4" (sayfa tablosu, Headings & labels, Sample, otomatik kayıt, fotoğraf).

### A10. Yayın
- **Sorular:** Yayınlayınca misafirler hemen görür mü? Sonra değiştirebilir miyim? Neden "Publish anyway"? Değişikliklerim neden
  görünmüyor?
- **Kapanış:** SH "Step 5" + "Name and date changes after publishing"; `how_to_publish` şablonu.

### A11. Paylaşma
- **Sorular:** Linki nasıl gönderirim? QR'ı nasıl basarım? Önizleme kartında ne çıkar? Şifre koyabilir miyim? Google'da çıkar mı?
- **Kapanış:** SH "Step 6"; `guest_access_help` şablonu.

### A12. Yanıtlar
- **Sorular:** Yeni yanıtı nasıl öğrenirim (e-posta gelmiyor)? Misafir yanıtını değiştirebilir mi? Telefonla gelen yanıtı
  ekleyebilir miyim? Excel'e nasıl alırım? "Held for review" ne?
- **Boşluk:** yeni yanıt bildirimi yok (yalnız panelde rozet/kart) — dürüstçe söylenir.
- **Kapanış:** SH "Step 7".

### A13. Değişiklikler ve sorunlar
- **Sorular:** Düğün ertelendi; isim yanlış; link çalışmıyor; telefon değiştirdim; eşim farklı bir şey yazdı.
- **Kapanış:** SH sorun giderme; şablonlar `date_moved`, `extra_change_granted`, `new_edit_link`, `general_help`.

### A14. Düğün sonrası
- **Sorular:** Site ne olacak? Teşekkür yazabilir miyim? Yanıtlar silinir mi?
- **Kapanış:** SH "Step 8"; isteğe bağlı `after_wedding_tip` şablonu.

### A15. Arşiv ve veri
- **Sorular:** Ne zaman kapanır? Uzatabilir miyim? Verilerimi nasıl silerim? Misafir verisi kimde?
- **Bugün:** panelde Online until + 30 gün uyarısı; uzatma ve silme politikası karar bekliyor.
- **Kapanış:** SH "How long your website stays online"; `archive_notice`, `delete_data` şablonları; yer tutucular
  `[EXTENSION POLICY]`, `[DELETION PROCESS]`.

---

## 3. Soru envanteri (78 soru)

Sütunlar: **Soru** alıcının ağzından (EN) · **Cevap** kısa ve dürüst (EN; ilan/SSS/rehber metni bu cümlelerden kurulur) ·
**Yer** (kodlar §2) · **D** durum: ✓ kodda var ve test edildi · V doğrulanmadı (`[VERIFY]` ile yazılır) · K karar bekliyor (yer
tutucu) · — ürün yapmıyor (açıkça "no").

### 3.1 Satın almadan önce

| # | Soru | Cevap | Yer | D |
|---|---|---|---|---|
| 1 | What exactly do I get? | A wedding website in this design: a sealed envelope that opens into Home, Our Story, Details and RSVP pages, a private editor to fill it in, online RSVP with your replies in one place, and a QR code. You download one PDF with your start link. | İ, İG3, SH | ✓ |
| 2 | Is this a Canva template? Do I need Canva? | No. You edit it in our own simple editor in your web browser. No Canva account needed. | İ, İG1, İS, SS | ✓ |
| 3 | Do I need to download an app? | No app for you or your guests. Everything opens in the browser of your phone or computer. | İ, İS | ✓ |
| 4 | Do I need to create an account or a password? | No account. When you start, you get a private edit link; that link opens your editor. Save it. | İ, ST, SH | ✓ |
| 5 | Can I do everything on my phone? | The editor is designed for phone screens and also works on a computer. | İ, İS | V (gerçek telefon testi yok) |
| 6 | Is it hard? I'm not good with technology. | You type into labelled boxes and tap Publish. A 3-step setup asks only for your names, date and one photo; Home shows what is left. Every change saves by itself, and you can preview before guests see anything. | İ, SH | ✓ (süre iddiası yok) |
| 7 | Can I see it before I buy? | Yes. Open the live demo (link in the listing photos) and tap the envelope. It is the real website with sample names. | İ, İG8 | ✓ (İG8 QR politikası V) |
| 8 | What can I change? | Names, date, time and time zone, venue and map link, the order of the day (up to 10 rows), your story, 5 photos, questions and answers (up to 12), RSVP deadline and up to 3 RSVP questions, and the design's headings, labels and buttons in your own words. | İ, İS, SH | ✓ |
| 9 | What can't I change? | The artwork, colors, fonts, page layout and the envelope animation stay as designed. | İ, İS | ✓ |
| 10 | Can I change the wording, like "You are invited"? | Yes. Every page of the editor has "Headings & labels" where you can rewrite the design's texts or reset them. | İ, SH | ✓ |
| 11 | Is it only for weddings? | It is made for weddings. Suggested wording is built in for a vow renewal, an elopement party or a commitment ceremony, and you can rewrite the headings yourself. | İS | ✓ |
| 12 | Can it be in my language? | You can write all your own texts and the design's headings in your own words. Some built-in parts stay in English: error messages of the reply form and the add-to-calendar text. Accented Latin letters and Cyrillic use the design's fonts; other alphabets show in a plain standard font. | İ, İS | ✓ (2 temada ölçüldü) |
| 13 | Can I use it without photos? | Yes. Empty photo frames show the design's soft placeholder image, and you can hide the Our Story page. | İS, SH | ✓ |
| 14 | How long does my website stay online? | Until 12 months after your wedding date. Your editor shows the exact "Online until" date. | İ, İS, SH | ✓ (K25) |
| 15 | Is there a monthly fee or subscription? | No. You pay once on Etsy. | İ, İS, SS | ✓ |
| 16 | What will my link look like? | Your names on our web address, for example …/avery-and-jordan. You choose it when you start; it cannot be changed later. | İ, İS | ✓ (alan adı `[DOMAIN]` K) |
| 17 | Can I use my own domain (yournames.com)? | Not at the moment. | İ, İS | — |
| 18 | Is there music? | No. | İ | — |
| 19 | Do you print or ship anything? | No. This is a digital product. You can print your QR code on your own cards. | İ | — |
| 20 | Is there a matching save the date? | Not yet. You can share your website early and add details later. | İS, SS | — |
| 21 | Can I send the invitations from the website by email? | No. You share your link yourself by text, WhatsApp, email or a printed QR code. | İ, İS | — |
| 22 | Can I import my guest list? | No. Guests reply on the website; you can add replies you get another way. | İS | — |
| 23 | Will my website show up on Google? | No. Each website asks search engines not to list it. Only people with your link (or QR code) can open it. | İ, İS | ✓ |
| 24 | Can I add a password so only invited guests can see it? | Yes, optional: one shared guest password that you send with your link. | İ, İS, SH | ✓ |
| 25 | Is the design made with AI? | Yes. The artwork and sample photos were made with AI image tools from our own descriptions, then cut into layers and assembled by us. | İ, SS | ✓ (Etsy beyan alanı V) |
| 26 | Can I get a refund? | [REFUND POLICY] Please try the live demo first. | İ, İS | K |
| 27 | Can I use one purchase for two events? | No. One Etsy order starts one website. | İ, İS, ST | ✓ |

### 3.2 Satın alma ve indirme

| # | Soru | Cevap | Yer | D |
|---|---|---|---|---|
| 28 | Do I need to write anything at checkout? | No. You fill in everything yourself after buying. | İ | ✓ |
| 29 | When can I start? | As soon as Etsy confirms your payment and your download is ready. | İ, M | ✓ (Etsy davranışı) |
| 30 | Where is my file? | On Etsy: Purchases and reviews → Download files. You can also start directly from the link in our Etsy message. | M, İ | V (Etsy menü adları bu ortamdan açılamadı) |
| 31 | The download doesn't open in the Etsy app. | Open Etsy in your phone's browser, or use the start link in our Etsy message: it is the same start. | M | V |
| 32 | What is in the PDF? | Your start link, its QR code and the full guide. It is the only file you need. | İ, SH | ✓ |
| 33 | Where do I find my Etsy order number? | In your Etsy order confirmation email, or on Etsy under Purchases and reviews. It has 8 to 12 digits. | ST, SH | ✓ (format) / V (Etsy menü adı) |
| 34 | I bought two designs. How do I start both? | Each order has its own start link and order number. Start each website with the link from that order. | SH, M | ✓ |

### 3.3 Başlatma ve kurulum

| # | Soru | Cevap | Yer | D |
|---|---|---|---|---|
| 35 | Why do you need my email? | We keep it with your website so we can recognise you if you need help. We do not send emails yet. | ST, SH | ✓ |
| 36 | What is the edit link? | A private link that opens your editor. There is no password: the link is the key. | ST, SH | ✓ |
| 37 | Will you email me the link? | Not yet. Copy it, or tap "Email it to myself" to send it from your own email app. | ST, SH | ✓ |
| 38 | Can I copy my edit link again later? | Yes, while your editor is open: Share → Your private edit link → Copy edit link. | SH, P | ✓ |
| 39 | Can my partner edit too? | Yes. Share the edit link with your partner only. Anyone with the link can edit. | SH, P, İS | ✓ |
| 40 | What if we both edit at the same time? | Changes save as you type. If the editor says the website was changed on another device, reload to get the latest version. | SH | ✓ |
| 41 | I made a typo in the website address. | The address cannot be changed after you create the website, so check it before tapping Create my website. | ST, SH | ✓ |
| 42 | It says my order number already has a website. | A website was already started with this order. Open it with your saved edit link, or message us on Etsy with your order number. | ST, SH, M | ✓ |
| 43 | My connection dropped while creating. | Tap Create my website again: the same form gets your link back. | SH | ✓ |
| 44 | Do I have to fill in everything now? | No. Setup asks for your names, date and one photo; you can skip steps and come back. Everything is saved. | SH | ✓ |
| 45 | What is "Time zone of the wedding"? | The time zone where the wedding happens. The countdown, the reply deadline and guests' calendars use it. | SH | ✓ |
| 46 | Can I start with the sample date? | The editor asks you to set your real date before the first publish (or to confirm the sample date really is yours). | SH | ✓ |
| 47 | Why can't I publish? It says you are confirming my order. | We check each order in our Etsy shop before a website can go live. Everything you set up is saved. Publish opens when the order is confirmed (usually within [ORDER CHECK TIME]); reload your editor then. | SH, P, M | ✓ (süre K) |

### 3.4 Düzenleme

| # | Soru | Cevap | Yer | D |
|---|---|---|---|---|
| 48 | Where do I change X? | Edit has six pages: Us, Day & place, Photos, Our Story, Details, RSVP. Home also lists the next things to do. | SH | ✓ |
| 49 | Is there a Save button? | No need: every change saves by itself. The cloud icon at the top shows it. | SH | ✓ |
| 50 | What does "N fields still show sample text" mean? | Some boxes on that page still hold the design's sample text (they look faded, in italics). Tap **Go to the first one** and replace it before you share your website. | SH | ✓ |
| 51 | Which photo formats work? | JPG, PNG, WebP, AVIF and HEIC, up to 30 MB. If a photo will not open, save a JPEG copy and try again. | SH | ✓ (HEIC iPhone V) |
| 52 | How do I crop a photo? | After choosing it, drag to move it, zoom with the slider or two fingers, then tap Use this photo. | SH | ✓ |
| 53 | Can I hide parts I don't need? | Yes: Our Story, the countdown, dress code, travel & stay, registry, guest policy note and questions & answers can each be switched off. | SH | ✓ |
| 54 | Can I add a map? | Yes: paste a Google Maps or Apple Maps link to your venue in Day & place. | SH | ✓ |
| 55 | Can I add my registry or hotel link? | Yes, in Details (Registry, Travel & stay). | SH | ✓ |
| 56 | I edited offline. | Your changes are kept on this phone and saved when you are back online. Don't close the editor until it says saved. | SH | ✓ |

### 3.5 Yayın, değişiklik ve paylaşma

| # | Soru | Cevap | Yer | D |
|---|---|---|---|---|
| 57 | Do guests see my changes right away? | No. Changes save to your draft; guests see them after you publish (Review → Publish changes). | SH, P | ✓ |
| 58 | Can I change things after publishing? | Yes, as often as you like. Only names and date have a limit. | İ, SH | ✓ |
| 59 | How many times can we change our names or date? | Before publishing: freely. After: 3 changes in total; typo fixes (up to 2 letters), adding a surname and moving the date by up to 7 days are always free. | İ, İS, SH, P | ✓ |
| 60 | I changed a name by mistake. | Undo it within 10 minutes (or before publishing) and you get the change back. | SH, P | ✓ |
| 61 | Our wedding was postponed. | Change the date in Day & place. Up to 7 days is free; a bigger move uses one change. If you have none left, message us. [POSTPONEMENT POLICY] | İS, SH, M | ✓ (politika K) |
| 62 | How do I share it? | Share → Copy link and send it by text, WhatsApp or email, or download the QR code (PNG or SVG) for printed cards. | SH | ✓ |
| 63 | What do guests see when I send the link? | Most messaging apps show a preview card with your names and date. Send it to yourself first to check. | SH, SS | ✓ (uygulamaya göre değişir) |
| 64 | Can I take it down? | Share → Take the website offline. Guests see "Page not found" until you publish again; your content and replies are kept. | SH | ✓ |

### 3.6 Misafirler ve RSVP

| # | Soru | Cevap | Yer | D |
|---|---|---|---|---|
| 65 | How do guests reply? | On the RSVP page: name, coming or not, how many people, an optional message and your questions. | İ, SH | ✓ |
| 66 | Do guests need an app, account or email? | No app, no account; email is optional. | İ, İS | ✓ |
| 67 | Can my older relatives use it? | They open a link or scan a QR code and tap the envelope; the reply form is one page. | İ, SS | ✓ (gerçek cihaz testi V) |
| 68 | How many guests can I invite? | We do not limit how many people you invite or how many replies you get. One reply can include up to 10 people. | İS, SH | ✓ |
| 69 | Can a guest change their reply? | They send another reply. You see both in Guests and can remove the old one. | SH | ✓ |
| 70 | Do I get notified about new replies? | Not by email yet. New replies show in your editor (Home and Guests). | SH | ✓ |
| 71 | Can I ask for meal choices or allergies? | Yes, up to 3 questions of your own (multiple choice or a short answer). Only guests who are coming see them. | İ, SH | ✓ (canlı V) |
| 72 | Can I get the list into Excel? | Guests → Download list saves a CSV file for Excel, Numbers or Google Sheets, one row per person. | İ, SH | ✓ |
| 73 | Someone replied by phone. | Guests → Add a reply. It counts like any other and is marked "Added by you". | SH | ✓ |
| 74 | When do replies close? | At the end of your reply-by date, in your wedding's time zone. You can also turn replies off. | SH | ✓ |
| 75 | Who can see the replies? | Only you, in your private editor (and our support if you ask for help). Guests never see each other's replies. | İS, SH | ✓ |

### 3.7 Düğün sonrası, arşiv, destek

| # | Soru | Cevap | Yer | D |
|---|---|---|---|---|
| 76 | What happens after the wedding? | You can turn your website into a thank-you page (automatically the day after, or right away), with your own message and photo. Replies close. | İ, SH | ✓ |
| 77 | What happens after it closes? Can I extend it? | Your website closes for guests; in your editor you can still see your content and download your replies. Longer hosting: [EXTENSION POLICY]. Deleting your data: [DELETION PROCESS]. | SH, M | ✓ / K |
| 78 | How do I get help, and how fast? | Message BKE Studio on Etsy with your order number (or email bkestudio@gmail.com). We reply within [RESPONSE TIME]. We never ask for your edit link. | İ, SH, P | ✓ (K33) / süre K |

---

## 4. Etsy metinleri

### 4.1 İlan açıklaması — ortak iskelet

Her tasarımın `listing_v3.md`'si bu iskeletten yazıldı. Değişen yalnız `{DESIGN}` (ad), `{DESIGN_LINE}` (görünüş cümlesi),
`{DEMO_SLUG}` (demo adres örneği). Bölüm sırası alıcının soru sırasıdır: ne alıyorum → nasıl çalışıyor → ne değişir → misafir ne
görür → neye ihtiyacım var → bilmem gerekenler → SSS.

```text
A wedding website that opens like a real envelope, with online RSVP built in. You fill it in yourself on your phone or computer and share one link with your guests. No Canva, no app, no account.

{DESIGN_LINE} Your guests tap the envelope, it opens, and your invitation follows: Home, Our Story, Details and RSVP.

WHAT YOU GET
• Your wedding website in the {DESIGN} design: envelope opening, Home, Our Story, Details and RSVP pages
• A private online editor, designed for phone screens and also working on a computer, with a preview of every page
• Online RSVP: replies, head counts and up to 3 questions of your own (for example a meal choice); download the list as a spreadsheet (CSV)
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, map, dress code, travel & stay and registry buttons, and up to 12 questions & answers
• A QR code of your website (PNG or SVG) for printed cards and signs
• An optional guest password, and a thank-you page for after the wedding
• A START HERE guide (PDF) with your start link and every step explained
• Your website stays online until 12 months after your wedding date

HOW IT WORKS IN 3 STEPS
1. Start: download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number, email and first names. Your private draft is created right away.
2. Personalize: add your names, date and a photo in a short 3-step setup, then anything else whenever you like. Every change saves by itself.
3. Publish & share: tap Publish, then send your link by text, WhatsApp or email, or print the QR code. Guest replies appear in your editor.

WHAT YOU CAN CHANGE
• Your names, how they appear, and a monogram where the design shows one
• Date, ceremony time and time zone; month-first or day-first date style
• Venue, address, map link and the order of the day (up to 10 rows)
• Your story: an intro line and three captions
• 5 photos: a portrait, 3 story photos and the venue, each cropped to its frame
• Questions & answers (up to 12), dress code, travel & stay and registry links
• RSVP deadline and up to 3 questions for your guests
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "Will You Join Us?")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a sealed envelope. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (in your Etsy order confirmation)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website per order. You choose your web address when you start; it cannot be changed later. A custom domain (yournames.com) is not included.
• Save your private edit link when it appears: it opens your editor, and we cannot email it to you yet.
• We confirm each order in our shop before a website can go live. You can set everything up in the meantime.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• The website's built-in messages (reply form errors, calendar text) are in English. You can write your own texts and headings in any language; accented Latin letters and Cyrillic use the design's fonts, other alphabets a plain standard font.
• No music. Colors and fonts do not change.
• The painted design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. Sample names, dates, places and photos are fictional.
• [REFUND POLICY]

QUESTIONS?
Message us here on Etsy. We reply within [RESPONSE TIME].
```

Notlar:
- "designed for phone screens" — gerçek cihaz testi yapılana kadar bu ifade; "tested on iPhone" yazılmaz (docs/05 §E).
  İlan dosyasında `[VERIFY: real iPhone Safari and Android Chrome]` işareti durur.
- Q&A ve RSVP soruları canlıda uçtan uca denenmedi → ilan dosyasında `[VERIFY: try on the live site]`.
- "We confirm each order in our shop…" yalnız `CLAIM_ORDER_VERIFICATION=manual` canlıda açıkken doğru → ilan dosyasında
  `[VERIFY: manual order check on in production]`.
- "Instant download / anında" ifadesi kullanılmadı: indirme anında, ama yayın sipariş onayını bekleyebilir.

### 4.2 Başlık ve etiket kalıbı

- Başlık (≤ 140): `{DESIGN} Wedding Website with RSVP, Envelope Opening Digital Invitation, Online Editor, {STYLE WORD}` —
  `&` ve `:` en çok birer kez (tasarım adında `&` varsa başka `&` yok); 3'ten fazla tamamen büyük harfli kelime yok.
- Etiketler (13, her biri ≤ 20): 7 ortak (`wedding website`, `rsvp website`, `digital invitation`, `envelope invitation`,
  `online rsvp`, `wedding rsvp`, `wedding invitation`) + 6 tasarıma özgü (renk, çiçek, üslup, yer). Hacim verisi yok: hipotez.

### 4.3 İlan SSS'si (açıklamanın sonuna ya da dükkân SSS'sine)

```text
Do I need Canva or an app?
No. You edit your website in your web browser, on your phone or computer. Your guests only need the link.

How do I start after buying?
Download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number. You can also use the start link in our Etsy message.

Do I need an account or a password?
No. You get a private edit link that opens your editor. Save it right away; we cannot email it to you yet.

What if I lose my edit link?
If your editor is still open, copy it again under Share. Otherwise message us on Etsy with your order number: we send you a new link and the old one stops working.

Can I change things after I publish?
Yes, as often as you like. Names and date can be changed 3 times in total after publishing; typo fixes and moving the date by up to 7 days are free.

Can I change the headings and wording?
Yes. Every page of the editor has "Headings & labels". The artwork, colors and fonts stay as designed.

Can it be in another language?
You can write your own texts and headings in any language. Built-in messages such as reply form errors stay in English.

How do my guests reply?
On your RSVP page, with no app or account. You see every reply in your editor and can download them as a spreadsheet (CSV).

How many guests can I invite?
As many as you like. One reply can include up to 10 people.

Can I add a password?
Yes, optional: one shared password that you send to your guests with the link.

How long does my website stay online?
Until 12 months after your wedding date. After the wedding it can turn into a thank-you page.

Can I use my own domain?
Not at the moment. Your address is your names on our web address.

Is anything printed or shipped?
No. It is a digital product.
```

### 4.4 Etsy'nin otomatik alıcı metinleri (dükkân geneli)

Etsy'de iki alan var (docs/15 §4.2, Shop Manager → ayarlar; API yok → `claude-tarayici` girer): **Message to Buyers** (makbuz +
sipariş onay e-postası) ve **Message to Buyers for Digital Items** (indirme sayfası; **bütün dijital ilanlara aynı metin**).
Bu yüzden tasarıma özel link konamaz: temasız `/start` adresi alıcıya aldığı tasarımı seçtirir (G080 "Choose your design").
`{START_BASE}` = `https://davetiye-platform-five.vercel.app/start` (alan adı kesinleşince değişir, docs/05 §C).

**Message to Buyers for Digital Items** (indirme sayfası):

```text
Thank you for your order! Your download is your START HERE guide (PDF). Open it and tap the start link inside.

Can't open the PDF? Start here instead and choose the design you bought: {START_BASE}

You will enter your Etsy order number, your email and your first names. Then SAVE YOUR EDIT LINK when it appears: it opens your editor, and we cannot email it to you yet.

Questions? Message us here on Etsy with your order number.
```

**Message to Buyers** (makbuz ve onay e-postası; kısa):

```text
Thank you! Start your wedding website from the START HERE PDF in your download, or at {START_BASE} (choose the design you bought). Please save your private edit link when it appears. Questions? Message us on Etsy.
```

Notlar: Etsy mesajlarında alıcı Etsy dışında satın almaya yönlendirilmez; bu metinler yalnız teslimattır (docs/15 §4.1).
`[VERIFY: character limits of both fields in Shop Manager]`.

### 4.5 Satış sonrası mesaj şablonları (admin paneli — G087)

**Kullanım:** admin paneli (G087) bu bloğu olduğu gibi okuyabilir (işaretler arasındaki JSON). Her şablon: `id` (sabit, kodda
anahtar), `title` (admin listesinde), `when` (ne zaman gönderilir; dükkân için), `placeholders` (gereken alanlar), `body`
(paragraf dizisi; gönderirken `\n\n` ile birleştirilir), `note` (yalnız dükkân görür, gönderilmez). Kanal: **Etsy mesajı**
(siparişin konuşması; e-posta sağlayıcısı gelince aynı metinler e-postada kullanılabilir).

**Yer tutucular:**

| Yer tutucu | Değer | Kaynak |
|---|---|---|
| `{order}` | Etsy sipariş numarası (yalnız rakam) | site kaydı `orderRef` ya da dükkânın girdiği |
| `{names}` | sitenin `name_display`'i ("Clara & Julian"); site yoksa şablon kullanmaz | içerik |
| `{design}` | tasarım adı ("Blush Garden Rose") | tema |
| `{site_url}` | genel adres (`<origin>/<slug>`) | site |
| `{edit_url}` | **yalnız `new_edit_link`'te**: `reissue-edit-key` çıktısı; hiçbir yere kaydedilmez, başka şablona girmez | yeniden üretim anı |
| `{start_url}` | `<origin>/start?theme=<tema>`; tasarım bilinmiyorsa `<origin>/start` | tema |
| `{shop}` | imza: `MARKETING.etsy.shopName` = **BKE Studio** (K33) | config |
| `{changes_left}` | kalan isim/tarih hakkı (hak eklendikten sonra) | `rightsView` |
| `{online_until}` | "Online until" günü, sitenin tarih stiliyle uzun biçim ("February 11, 2028") | `rightsView.onlineUntil` |

Karar bekleyen politikalar şablonda **köşeli parantezle** durur (`[ORDER CHECK TIME]`, `[REFUND POLICY]` …). Admin paneli,
çözülmemiş `{…}` ya da köşeli parantezli yer tutucu içeren metni **göndertmemeli** (uyarı + düzenleme), §6 öneri A3.

<!-- g091:templates:start -->
```json
[
  {
    "id": "welcome_start",
    "title": "Welcome + start link",
    "when": "Optional, right after an order (Etsy's automatic digital-items message already gives the start link). Also when a buyer writes before starting.",
    "placeholders": [
      "order",
      "design",
      "start_url",
      "shop"
    ],
    "body": [
      "Hi, thank you for your order!",
      "Your {design} wedding website is ready for you to start. Open this link on your phone or computer: {start_url}",
      "You will enter your Etsy order number ({order}), your email address and your first names, and choose your website address. Your website starts as a private draft: nobody can see it until you publish it.",
      "Important: the next screen shows your private edit link. Please save it right away (tap Copy link and paste it into your notes, or tap Email it to myself). It opens your editor, and we cannot email it to you yet.",
      "The START HERE guide in your Etsy download explains every step. If you have any question, just reply here.",
      "{shop}"
    ]
  },
  {
    "id": "start_link_reminder",
    "title": "Reminder: start your website",
    "when": "About 3 days after an order if no website exists for the order number, or when a buyer cannot find the PDF or the link. Send once.",
    "placeholders": [
      "order",
      "design",
      "start_url",
      "shop"
    ],
    "body": [
      "Hi, just a friendly note: your {design} wedding website is waiting for you.",
      "Start it here: {start_url}",
      "It is the same link as in the START HERE PDF in your Etsy download. If the download does not open in the Etsy app, open the link above in your phone's browser instead.",
      "You will need your Etsy order number: {order}. When your edit link appears, please save it before you continue.",
      "Happy to help with anything, just reply here.",
      "{shop}"
    ]
  },
  {
    "id": "publish_blocked_pending",
    "title": "Order being confirmed (Publish is waiting)",
    "when": "The buyer asks why Publish does not work, or mentions 'We are confirming your Etsy order', before the shop has confirmed the order.",
    "placeholders": [
      "order",
      "shop"
    ],
    "body": [
      "Hi, thank you for starting your website!",
      "Before any website goes live, we check the order in our Etsy shop: that it is paid and for the design you chose. Everything you set up is saved, so please keep going with your names, photos and details.",
      "We usually confirm orders within [ORDER CHECK TIME]. We will message you here as soon as order {order} is confirmed; then reload your editor and tap Publish.",
      "{shop}"
    ],
    "note": "Confirm with: node scripts/verify-order.ts --order {order} --reason \"...\" (or the admin panel action), then send order_confirmed."
  },
  {
    "id": "order_confirmed",
    "title": "Order confirmed: you can publish",
    "when": "Right after the shop confirms an order whose website is waiting (verify-order). The platform does not tell the buyer by itself.",
    "placeholders": [
      "order",
      "names",
      "design",
      "site_url",
      "shop"
    ],
    "body": [
      "Hi {names}, good news: we have confirmed your Etsy order {order}.",
      "You can now publish your {design} website. Open your editor with the edit link you saved (if it is already open, reload the page) and tap Publish.",
      "Before you publish, check the date and replace any sample text; Home shows what is left. Your website address will be {site_url}.",
      "{shop}"
    ]
  },
  {
    "id": "how_to_publish",
    "title": "How to publish / guests don't see my changes",
    "when": "The buyer asks how to publish, or says guests cannot see a change.",
    "placeholders": [
      "site_url",
      "shop"
    ],
    "body": [
      "Hi! Your changes save by themselves, but guests only see them after you publish.",
      "First time: tap Publish at the top of your editor, check the list under 'Before you publish', then tap Publish my website.",
      "After that: when you change something, a bar says 'Unpublished changes'. Tap Review to see what changed, then Publish changes.",
      "Then open {site_url} and reload the page to see what your guests see.",
      "{shop}"
    ]
  },
  {
    "id": "new_edit_link",
    "title": "New edit link (lost link)",
    "when": "After the shop has made a new link with reissue-edit-key (lost link, or the link was shared by mistake). Only inside this order's own Etsy conversation, or after the buyer wrote from the email address used on /start with the order number.",
    "placeholders": [
      "names",
      "edit_url",
      "site_url",
      "shop"
    ],
    "body": [
      "Hi {names}, here is your new private edit link:",
      "{edit_url}",
      "Your old edit link no longer works, so only this new link can open your editor. Your website, photos and guest replies are exactly as before, and your website address stays {site_url}.",
      "Please save it now: copy it into your notes app or email it to yourself. Share it only with your partner. We will never ask you for it.",
      "{shop}"
    ],
    "note": "Never paste {edit_url} into any other template, note or log. Tell the buyer to use the newest link if they asked twice."
  },
  {
    "id": "shop_created_site",
    "title": "Your website is ready (set up by the shop)",
    "when": "Right after the shop creates the website in the admin for a buyer (for example, the buyer asked us to set it up).",
    "placeholders": [
      "names",
      "design",
      "edit_url",
      "site_url",
      "shop"
    ],
    "body": [
      "Hi {names}, thank you for your order! We have set up your {design} wedding website for you.",
      "Here is your private edit link:\n{edit_url}",
      "It opens your editor, where you can change every text, add your photos and publish when you are ready. Your website starts as a private draft: nobody can see it until you publish it. Your website address will be {site_url}.",
      "Please save the link now: copy it into your notes app or email it to yourself. Share it only with your partner. We will never ask you for it.",
      "{shop}"
    ]
  },
  {
    "id": "order_already_used",
    "title": "Start page says: this order already has a website",
    "when": "The buyer reports 'This order already has a website' on the start page.",
    "placeholders": [
      "order",
      "shop"
    ],
    "body": [
      "Hi, thanks for letting us know.",
      "This message means a website has already been started with order {order}, maybe by you earlier or by your partner. If you saved an edit link, please open it: that is your website.",
      "If you don't have the link, tell us here and we will check the order and send you a new edit link to that website. Please don't start a second order.",
      "{shop}"
    ],
    "note": "Check the site for this order (email, names, theme). If someone else claimed the number by mistake, decide case by case; there is no 'release order' tool yet (docs/19 §6 A6)."
  },
  {
    "id": "wrong_design_started",
    "title": "Started with a different design",
    "when": "The buyer started a website with a different design than the one bought (for example from the design chooser).",
    "placeholders": [
      "order",
      "design",
      "shop"
    ],
    "body": [
      "Hi, thanks for telling us. Please don't publish this website yet.",
      "Your order {order} is for {design}. [DESIGN SWITCH POLICY]",
      "{shop}"
    ],
    "note": "Here {design} is the design in the Etsy order, not the theme of the website that was started. No tool changes a site's design today (docs/19 §6 A6). Decide the policy before the first sale."
  },
  {
    "id": "extra_change_granted",
    "title": "Extra name/date change added",
    "when": "After the shop has added name/date changes (grant-identity-change), for example for a real postponement.",
    "placeholders": [
      "names",
      "changes_left",
      "shop"
    ],
    "body": [
      "Hi {names}, we have added a name and date change to your website. You now have {changes_left} left.",
      "To use it: open your editor, go to Edit → Us (names) or Edit → Day & place (date), tap Change and confirm. Then publish: Review → Publish changes.",
      "Reminder: small typo fixes, adding a surname and moving the date by up to 7 days are always free.",
      "{shop}"
    ]
  },
  {
    "id": "date_moved",
    "title": "Our wedding date moved",
    "when": "The buyer says the wedding was postponed or moved.",
    "placeholders": [
      "names",
      "shop"
    ],
    "body": [
      "Hi {names}, thank you for letting us know.",
      "Open your editor, go to Edit → Day & place and tap Change next to your date. Moving the date by up to 7 days is free; a bigger move uses one of your name and date changes. The editor tells you before you confirm. Then publish: Review → Publish changes.",
      "Please also check your reply-by date under Edit → RSVP. Your 'Online until' date moves with your wedding date.",
      "If you have no changes left, reply here with your new date and we will look at it with you. [POSTPONEMENT POLICY]",
      "{shop}"
    ]
  },
  {
    "id": "photo_upload_help",
    "title": "Photo will not upload",
    "when": "The buyer says a photo does not upload or open.",
    "placeholders": [
      "shop"
    ],
    "body": [
      "Hi! A few things usually help:",
      "1. Use a JPEG or PNG copy of the photo (on many phones: share or save the photo as JPEG, then choose that copy). Photos up to 30 MB work.",
      "2. Check your internet connection, then try again in Edit → Photos → Add photo.",
      "3. If it still does not work, tell us your phone and browser and send a screenshot of the message you see.",
      "{shop}"
    ]
  },
  {
    "id": "guest_access_help",
    "title": "A guest cannot open the website",
    "when": "The buyer says a guest cannot open the link or the QR code.",
    "placeholders": [
      "site_url",
      "shop"
    ],
    "body": [
      "Hi! Please check these:",
      "1. Is your website published? Home in your editor should say 'Your website is live.' If it says draft or offline, tap Publish.",
      "2. Is the link complete? Your address is {site_url}. Copy it again from Share → Copy.",
      "3. Is the guest password on? Then guests need the password: Share → Guest password → Copy password, or turn it off.",
      "4. For a printed QR code: scan the printed card with your own phone. If it does not open, download the QR code again from Share and print it larger, with white space around it.",
      "If it still does not open, send us the guest's message or a screenshot.",
      "{shop}"
    ]
  },
  {
    "id": "general_help",
    "title": "General help",
    "when": "Any question no other template answers.",
    "placeholders": [
      "shop"
    ],
    "body": [
      "Hi, thanks for your message! We are happy to help.",
      "So we can answer in one go, please tell us: your Etsy order number, your website address, what you tried and what you see (a screenshot helps), and which phone or computer and browser you use.",
      "Please don't send your edit link: we never need it.",
      "Many answers are also in the START HERE guide in your Etsy download.",
      "{shop}"
    ]
  },
  {
    "id": "archive_notice",
    "title": "Website closes soon",
    "when": "About 30 days before 'Online until' (the editor's Home shows the same reminder; no email is sent yet).",
    "placeholders": [
      "names",
      "online_until",
      "shop"
    ],
    "body": [
      "Hi {names}, a short note: your wedding website stays online until {online_until}.",
      "After that it closes for guests. In your editor you can still see your content and download your replies (Guests → Download list). If you want a copy of your replies, it is easiest to download them before then.",
      "[EXTENSION POLICY]",
      "{shop}"
    ]
  },
  {
    "id": "after_wedding_tip",
    "title": "After the wedding: thank-you page",
    "when": "Optional, a few days after the wedding date. Order and support only, no advertising (Etsy message rules).",
    "placeholders": [
      "names",
      "shop"
    ],
    "body": [
      "Hi {names}, congratulations!",
      "If you like, your website can now say thank you to your guests: in your editor go to Edit → Day & place → After the wedding, write a short message, add a photo, preview and publish. If you chose Automatic, it is already showing.",
      "Your guest replies stay in Guests, and you can download them any time (Guests → Download list).",
      "{shop}"
    ]
  },
  {
    "id": "review_request",
    "title": "Review request (once)",
    "when": "Once per order, after the website is published and the first replies have arrived, and only if no problem is open. Same text for everyone; never with a discount or gift; never ask for a star rating.",
    "placeholders": [
      "names",
      "shop"
    ],
    "body": [
      "Hi {names}, we hope your website is making wedding planning a little easier.",
      "If you have a moment, we would be grateful for a review on Etsy (Purchases and reviews). And if something is not right, just reply here and we will help.",
      "{shop}"
    ]
  },
  {
    "id": "refund_or_problem",
    "title": "Refund request / unhappy buyer",
    "when": "The buyer asks for a refund or says the product does not work for them.",
    "placeholders": [
      "shop"
    ],
    "body": [
      "Hi, I'm sorry it's not working out. Could you tell us what went wrong? Many problems have a quick fix, and we would like to try that first.",
      "Our refund policy: [REFUND POLICY]",
      "{shop}"
    ]
  },
  {
    "id": "delete_data",
    "title": "Delete my website and data",
    "when": "The buyer asks to delete the website or the guests' data.",
    "placeholders": [
      "order",
      "site_url",
      "shop"
    ],
    "body": [
      "Hi, of course. To hide your website from guests right away, open your editor and go to Share → Take the website offline.",
      "To delete your website, photos and guest replies for good: [DELETION PROCESS]. Before we delete anything we confirm it is you (order {order}, website {site_url}). Deleting cannot be undone, so download your replies first if you want a copy (Guests → Download list).",
      "{shop}"
    ]
  }
]
```
<!-- g091:templates:end -->

### 4.6 Şablon kuralları (dükkân ve admin için)

1. **Düzenleme linki yalnız `new_edit_link` ile ve yalnız siparişin kendi Etsy konuşmasında** (ya da `/start`'ta verilen
   e-postadan + sipariş numarasıyla gelen istekte) gönderilir. Bu kimlik kontrolüdür: Etsy konuşması siparişin alıcısına bağlıdır.
   Link başka şablona, nota, günlüğe yazılmaz.
2. **Hiçbir şablon alıcıdan düzenleme linkini istemez** ("We will never ask you for it" bütün kanallarda tutarlı).
3. Etsy mesajları yalnız sipariş ve destek içindir; reklam, kupon, Etsy dışı satın alma yönlendirmesi yok (docs/15 §4.1).
4. `review_request`: sipariş başına bir kez, herkese aynı metin, teşviksiz, yıldız istemeden; açık sorun varken gönderilmez
   (FTC ve Etsy kuralları, docs/15 §4.6).
5. Zaman vaadi (`[ORDER CHECK TIME]`, `[RESPONSE TIME]`) karar verilmeden doldurulmaz.
6. `order_confirmed` platform tarafından gönderilmez; `verify-order` sonrası dükkân gönderir (admin paneli bu ikisini tek
   eylemde birleştirebilir, §6 A2).

---

## 5. START HERE rehberi

**Ortak kaynak:** Ek A (bu belgenin sonunda, `<!-- g091:start-here:start -->` … `end` işaretleri arasında). Yalnız
`{DESIGN_NAME}` ve `{START_URL}` değişir. Kopyalar:

| Tasarım | Dosya | Başlat linki |
|---|---|---|
| 01 Olive & Ivory | `collections/01_Olive_Ivory/package/customer/START_HERE.md` + `.pdf` | `…/start?theme=olive-ivory` |
| 02 Dusty Blue & Champagne | `collections/02_Dusty_Blue/package/customer/START_HERE.md` + `.pdf` | `…/start?theme=dusty-blue-champagne` |
| 03 Blush Garden Rose | `collections/03_Blush_Garden_Rose/package/customer/START_HERE.md` + `.pdf` | `…/start?theme=blush-garden-rose` |
| 04 Vintage Airmail Love Letter | `collections/04_Vintage_Airmail/package/customer/START_HERE.md` + `.pdf` | `…/start?theme=vintage-airmail-love-letter` |
| 05 Mediterranean Lemon | `collections/05_Lemon_Mediterranean/package/customer/START_HERE.md` + `.pdf` | `…/start?theme=mediterranean-lemon` |

**Yapı (alıcının sırasıyla):** Good to know before you begin → **Start now: the first 5 steps** (QR + link) → **Save your edit
link: it is your key** → Step 1 Start → Step 2 three-step setup → bekleyen sipariş onayı → Step 3 Edit (6 sayfa tablosu,
Headings & labels, Sample, otomatik kayıt) → Step 4 Photos → Step 5 Preview & publish → isim/tarih hakkı → Step 6 Share (QR,
şifre, çevrim dışı) → Step 7 Guest replies → Step 8 After the wedding → Online süresi → Quick answers → Troubleshooting → Help and
privacy.

**Bilinçli seçimler:**
- "İlk 5 dakika" yerine **"Start now: the first 5 steps"**: süre ölçülmedi (docs/05 §E "süre yazılmaz"); 5 = adım sayısı.
- Panel düğme ve başlık adları kaynaktan birebir (kalın): Create my website, Copy link, Email it to myself, Open my editor,
  Skip for now, Save & exit, Continue, Publish my website, Unpublished changes, Review, Publish changes, Headings & labels on this
  page, Reset to design text, Use this photo, Copy edit link, Guest password, Suggest a password, Turn on password, Copy password,
  Take the website offline, Download list, Add a reply, Print list, Refresh, After the wedding, Automatic / On now / Off.
- K33: dükkân adı **BKE Studio**, destek e-postası **bkestudio@gmail.com**; yanıt süresi `[RESPONSE TIME]` yer tutucu.
- Ekran görüntüsü yok: mevcut ekranlar ya yerel adres (127.0.0.1) ya da K29 öncesi panel gösteriyor. G079 sonrası canlı tabanla
  `capture` yeniden alınınca rehbere görsel eklenebilir (önerilen görev, §7).
- PDF: `tools/build_customer_guides.py` biçimi (reportlab; başlık, paragraf, `- ` madde, 2 sütunlu tablo, link, QR = başlat linki).
  Araç yalnız 01/03'ü üretiyor; bu görevde aynı kod kazıma alanında 5 tasarım için koşuldu (`tools/` yazma alanı dışında).

---

## 6. Uygulama önerileri (G087'ye)

Biçim: **dosya** · mevcut metin → önerilen metin · gerekçe. Kod bu görevde değiştirilmedi (platform/ yazma alanı dışında).

### A. Admin paneli (G087)

- **A1. Şablonlar:** §4.5 JSON'u (`<!-- g091:templates:start -->` … `end`) tek kaynak olarak okunsun ya da derleme anında
  `lib/admin/templates.ts`'e kopyalansın (test: bu belgeyle aynı). Liste: `title`, `when` görünür; seçilince siteden yer tutucular
  dolar, metin düzenlenebilir kutuda, "Copy message" düğmesi (Etsy'ye yapıştırmak için). Gönderim kaydı site günlüğüne (şablon
  `id` + zaman; metin değil).
- **A2. Eylem + mesaj birleşik:** "Confirm order" (verify-order) bitince `order_confirmed`'ı hazır açsın; "New edit link"
  (reissue) bitince `new_edit_link`'i `{edit_url}` ile **yalnız o ekranda** göstersin (sayfa kapanınca kaybolur; kaydedilmez);
  "Add name/date change" (grant) bitince `extra_change_granted`'ı `{changes_left}` ile açsın.
- **A3. Güvenlik ağı:** metinde çözülmemiş `{…}` ya da `[…]` (karar bekleyen politika) varsa "Copy message" uyarı versin.
  `{edit_url}` `new_edit_link` dışındaki şablonda hiç çözülmesin.
- **A4. Sipariş görünümü:** bekleyen siparişler listesi (orderCheck `pending`, oluşturma zamanı, tema, e-posta, isimler) ve
  "3 gündür yayınlanmadı / hiç başlatılmadı" filtreleri (`start_link_reminder` için; Etsy siparişleri API'siz bilinmediğinden
  "hiç başlatılmadı" yalnız dükkânın girdiği numarayla aranır).
- **A5. Arşiv yaklaşanlar:** Online until ≤ 30 gün olan yayındaki siteler → `archive_notice`.
- **A6. Eksik araçlar (karar + kod):** (a) yanlış tasarımla başlatılmış ve **yayınlanmamış** taslağın temasını değiştirme ya da
  taslağı silip sipariş numarasını serbest bırakma; (b) sipariş numarası başkası tarafından alınmışsa taşıma. Bugün yalnız
  reissue var; `wrong_design_started` ve `order_already_used` bu yüzden politika yer tutucusu taşıyor.

### B. `/start` (`platform/app/start/StartForm.tsx`)

- **B1 (öneri 4).** Sonuç ekranı, "Save this link" kutusunun altına bir satır: (yok) → "You can copy this link again later
  in your editor: Share → Your private edit link." — gerekçe: "tek şans" paniğini azaltır; davranış zaten var.
- **B2.** `Open my editor` altındaki `small` metne ek (yok) → "Tip: once your editor is open, add it to your Home Screen."
- **B3 (öneri 5).** "Start another website" düğmesi → "Start with a different order" ve altına küçük satır "One order starts one
  website." — gerekçe: mevcut ad "bir siparişle ikinci site" sanılıyor.
- **B4 (öneri 6).** Form kartının altına (yok) → "Need help? Message us on Etsy with your order number." — gerekçe: sayfada
  yardım yolu yok.
- **B5.** `order_used` mesajı iyi; ek öneri yok.

### C. Panel metinleri

- **C1.** `components/panel/views.tsx` HelpSheet "Can my partner edit too?": "Yes: share your edit link with your partner (Share →
  Your edit link)." → "Yes: share your edit link with your partner (Share → Your private edit link → Copy edit link)." —
  gerekçe: bölümün gerçek adı "Your private edit link".
- **C2.** HelpSheet'e üç bölüm daha (başlık → metin):
  - "I lost my edit link" → "While this page is open, copy it again: Share → Your private edit link → Copy edit link. If it is
    lost, message us on Etsy with your order number. A new link replaces the old one."
  - "Why can't guests see my changes?" (mevcut "Do guests see my changes right away?" yerine aynı metin + ) "When you see
    “Unpublished changes”, tap Review, then Publish changes."
  - "Can guests change their reply?" → "Yes: they send another reply. You see both under Guests and can remove the old one."
- **C3 (öneri 7).** `components/panel/Setup.tsx` `OrderPendingNote` ve `lib/panel/brand.ts` `ORDER_PENDING_TEXT`: "…you can
  publish as soon as the order is confirmed." → "…you can publish as soon as the order is confirmed (usually within [ORDER CHECK
  TIME]). Reload this page to check." — gerekçe: onay alıcıya bildirilmiyor; süre karar gelince config'ten.
- **C4.** `components/panel/Panel.tsx` "This edit link no longer works" metni: "The link may have been replaced with a new one. If
  you did not change it, message … on Etsy with your order number." → "The link may have been replaced with a new one, or it was
  copied only in part. If we sent you a new link, use the newest one. Otherwise message us on Etsy with your order number." —
  gerekçe: kısmi kopyalama en sık neden olabilir; ikinci istek sonrası eski linkle girme.
- **C5.** `GuestPassword.tsx` ipucu: "Add the password to your invitation message, so your guests can open your website." →
  ek cümle "Guests type it once; their browser remembers it." — gerekçe: misafir her açışta soracak mı endişesi (90 gün çerez,
  `lib/site/access.ts`).
- **C6.** Guests boş durumu / Home yanıt kartı: e-posta bildirimi olmadığı açıkça söylensin: (yok) → "New replies show here.
  We don't send email notifications yet." (yalnız ilk açılışta ya da Help'te).

### D. Satış sitesi (`lib/marketing/*`)

- **D1 (öneri 3).** `lib/marketing/facts.ts` `NOT_INCLUDED`: "Languages other than English" → "A translated website: built-in
  messages (reply form errors, calendar text) stay in English; you can write your own texts and headings in any language" —
  gerekçe: G068 sonrası başlıklar değişiyor; madde artık yanıltıcı. `EDITABLE`'a "The design's headings, labels and buttons, in
  your own words" eklenmeli; `canvaComparison` "Changing the design" satırı da "you change the content and the wording".
- **D2.** `lib/marketing/faq.ts` `take-offline`: "Tap Unpublish in your panel…" → "Open Share in your panel and tap Take the
  website offline…" — gerekçe: panelde "Unpublish" adlı düğme yok.
- **D3.** `faq.ts` `what-can-i-change`: sona "…and the design's headings and labels in your own words." eklenmeli.
- **D4.** `faq.ts` `lost-link`: `[LOST LINK POLICY]`'nin önüne davranış: "While your editor is open you can copy the link again
  under Share. If it is lost, message us on Etsy with your order number: we send a new link and the old one stops working."
- **D5.** `app/(marketing)/how-it-works/page.tsx` "After the wedding": "After that: [EXTENSION POLICY]." → "After that your website
  closes for guests; you can still see your content and download your replies. Longer hosting: [EXTENSION POLICY]." (`ARCHIVE_TEXT`
  ile aynı).
- **D6.** `/help` (docs/14 §5.1 "ileride"): START HERE'in Ek A metni `/help` altında yayınlansın (tasarımsız, tek sayfa,
  `noindex` değil); START HERE ve şablonlar "full guide: [DOMAIN]/help" diyebilir. Alan adı kararıyla birlikte.

---

## 7. Açık kalanlar

**Karar bekleyen (kullanıcı):** destek yanıt süresi (`[RESPONSE TIME]`; dükkân adı ve e-posta K33 ile verildi), Etsy dükkân linki, fiyat, iade politikası, kayıp link
politikası (süre), sipariş onay süresi (`[ORDER CHECK TIME]`), erteleme politikası (`[POSTPONEMENT POLICY]`; docs/16 §15 öneri:
ertelemede 1 hak), yanlış tasarım politikası (`[DESIGN SWITCH POLICY]`), uzatma (`[EXTENSION POLICY]`), silme süreci
(`[DELETION PROCESS]`), 48 aylık tavan (kodda açık, karar yok), alan adı.

**Doğrulanmamış iddialar (`[VERIFY]`):** gerçek iPhone/Android'de düzenleme ve misafir yolculuğu; HEIC; Q&A ve RSVP sorularının
canlıda uçtan uca denenmesi; QR'ın telefon kamerasıyla okutulması; manuel sipariş onayının canlıda açık olması; Etsy menü adları
("Purchases and reviews → Download files") ve Etsy uygulamasında dijital indirme; Etsy otomatik mesaj alanlarının karakter
sınırı; AI beyanı ve "Designed by"; ilan görselinde QR/link politikası.

**Önerilen görevler (entegratör açar):**
1. `claude-kod`: `tools/build_customer_guides.py`'yi 5 tasarıma genişlet ve kopyaları Ek A'dan üret (bu görevdeki kazıma alanı
   betiğinin aynısı); `listing_kit.py pdf`'in `listing_v3.md`'yi okuması (onaylanınca `listing.md`'nin yerine).
2. `claude-kod`: G079 canlı yayından sonra 5 tema için `listing_kit.py capture` + `images` (İG4/İG5 eski paneli gösteriyor; İG3
   "every step in pictures" → "every step explained"); START HERE'e K29 panel ekranları.
3. `claude-tarayici`: Etsy Shop Manager'a §4.4 metinleri (karar sonrası) ve karakter sınırı kontrolü.
4. `claude-kod` (G087 içinde ya da ayrı): §6 A–D.
5. Gerçek telefon testi (alıcı + misafir yolculuğu) ve QR'ın kamerayla okutulması.

---

## Ek A — START HERE ortak kaynağı (İngilizce)

Kopyalarda `{DESIGN_NAME}` ve `{START_URL}` doldurulur; başka değişiklik yapılmaz. Biçim `tools/build_customer_guides.py`'nin
desteklediği öğelerle sınırlı (başlık, paragraf, `- ` madde, numaralı satır, 2 sütunlu tablo, `![…](…)` = QR, `**kalın**`, link).

<!-- g091:start-here:start -->
````markdown
# Start Here: Your {DESIGN_NAME} Wedding Website

Thank you for choosing BKE Studio. This guide takes you from this PDF to a live wedding website that your guests open on their phones. Keep this file: it is the only one you need.

## Good to know before you begin

- You do not need Canva, an app or an account. Everything works in the web browser of your phone or computer.
- You fill in your website yourself, in a simple editor. Every change saves by itself.
- Nobody sees your website until you publish it, and you can keep changing it after you publish.
- Your guests need no app and no account either: they open your link and tap the envelope.

## Start now: the first 5 steps

1. Open your start link: [Start your {DESIGN_NAME} website]({START_URL}). Or scan this QR code with your phone camera.

![QR code of your start link](img/start_qr_page.png)

2. Enter your Etsy order number, your email address and your first names. Check the website address, then tap **Create my website**.
3. **Save your edit link.** Tap **Copy link** and paste it into your notes app, or tap **Email it to myself**. Do this before anything else.
4. Tap **Open my editor**. Add your names and your wedding date (setup step 1 of 3).
5. Add one photo (step 2 of 3). Publish now (step 3 of 3), or later when everything is ready.

## Save your edit link: it is your key

Your edit link opens your editor. There is no password and no account: the link is the key. We cannot email it to you yet, so please save it yourself, in at least one of these ways:

- Tap **Copy link** and paste it into your notes app or password manager.
- Tap **Email it to myself**. Your own email app opens with the link inside. Tap Send.
- Once your editor is open, add it to your phone's Home Screen (from your browser's Share or menu button).

Missed it? While your editor is open, you can copy the link again: **Share → Your private edit link → Copy edit link**.

Anyone who has the link can change your website, so share it only with your partner. We will never ask you for it. If you lose it, message BKE Studio on Etsy with your order number. We send you a new link, and the old one stops working.

## Step 1. Start your website

Open the start link. At the top you see a small live demo of your design (**Open the full demo** shows it full size). Below it, fill in **Your details**:

- **Etsy order number:** in your Etsy order confirmation email, or on Etsy under Purchases and reviews. It has 8 to 12 digits. You can type it with or without "#".
- **Email address:** we keep it with your website so we can recognise you if you need help. We do not send emails yet.
- **Your first names:** as your guests know you. You can change them later in the editor.
- **Website address:** made from your names, for example …/avery-and-jordan. "Available" means it is free. You can change it here, but **not later**, so check the spelling.

Tap **Create my website**. One order starts one website. Your website starts as a private draft: nobody can see it until you publish.

If your connection drops, tap **Create my website** again: you get your link back. If the page says your order already has a website, open it with your saved edit link, or message us on Etsy.

## Step 2. Set up in three steps

The editor starts with a short setup. The bar at the top shows **Step 1 of 3**. You can tap **Skip for now** on steps 1 and 2, and **Save & exit** at any time. Everything is saved.

1. **Your names and date.** Your first names; **Full names for the invitation card** (optional); **How your names appear**, for example "Avery & Jordan"; a **Monogram** if your design shows one. Then the wedding date, ceremony time, **Time zone of the wedding** and the date style (Month first or Day first).
2. **Add your photo.** One photo opens your website. **More photos** are optional; you can add them any time.
3. **Publish your website.** Check the summary and the preview, read **Good to know before you publish**, then tap **Publish my website**. Or come back later: Home shows how ready your website is.

If your date is still the design's sample date, the editor asks you to set your real date first.

## If your editor says "We are confirming your Etsy order"

We check each order in our Etsy shop before a website can go live. You can set up everything now; it is all saved. **Publish** opens as soon as your order is confirmed (usually within [ORDER CHECK TIME]). We tell you on Etsy; then reload your editor page. If it takes longer, message us on Etsy with your order number.

## Step 3. Edit your website

Use the buttons at the bottom of the screen (at the top on a computer):

- **Home:** your website's status and link, how ready it is, the next things to do, new replies and your dates (Wedding, Replies close, Online until).
- **Edit:** six pages with everything on your website.
- **Guests:** your guests' replies.
- **Share:** your link, QR code, guest password and your private edit link.

| Edit page | What you change |
|---|---|
| Us | First names, full names for the invitation card, how your names appear, monogram |
| Day & place | Date, ceremony time and time zone; venue, address, map link and venue photo; the order of the day (up to 10 rows); countdown on or off; After the wedding |
| Photos | Invitation portrait, three story photos and the venue photo |
| Our Story | Show or hide the page, an intro line and three captions |
| Details | Host line, dress code, travel & stay and registry links, guest policy note, up to 12 questions and answers |
| RSVP | Replies on or off, reply-by date, up to 3 questions for guests who are coming |

**Your own wording.** At the end of every Edit page, open **Headings & labels on this page**. There you can rewrite the design's texts in your own words, for example "You are invited", "Will You Join Us?" or the menu. Leave a box empty to keep the design's text; **Reset to design text** brings it back. On **Us** you can also pick suggested wording for a vow renewal, an elopement party or a commitment ceremony. Wording changes never use a name or date change.

**What stays as designed:** the artwork, colors, fonts, page layout and the envelope animation.

**Sample text.** Boxes that still hold the design's sample text look faded (in italics), and the top of the page says how many are left, for example "3 fields still show sample text". Tap **Go to the first one** and replace it before you share your website. Home lists what is left.

**Saving.** There is no Save button: every change saves as you type, and the cloud icon at the top shows it. If you are offline, your changes are kept on this phone and saved when you are back online; wait until it says saved before you close the page. If the editor says your website was changed on another device, reload the page to get the latest version.

## Step 4. Add and crop photos

Open **Edit → Photos**, choose a frame and tap **Add photo**. Drag to move the photo, zoom with the slider or two fingers, then tap **Use this photo**. Each frame has its own shape. You can replace or remove a photo any time.

JPG, PNG, WebP, AVIF and HEIC photos up to 30 MB work. If a photo will not open, save a JPEG copy of it and choose that.

No photos yet? Your website still works: empty frames show the design's soft placeholder image, and you can hide the Our Story page. Add your own photos before you share if you do not want guests to see placeholders.

## Step 5. Preview and publish

Tap the eye icon at the top to preview Envelope, Home, Story, Details and RSVP; **Close** returns to editing. On a computer the preview stays on the right.

**First publish:** tap **Publish**. The editor lists anything guests would still see from the design (sample text, empty photo frames, sections without a link). Tap an item to fix it, or publish anyway and fix it later. Then your link appears with **Copy link** (and **Share** on phones); the QR code is under **More ways to share**, and Share has it too.

**After that:** your changes save to a draft, and guests see the last version you published. When you change something, a bar shows **Unpublished changes**. Tap **Review** to see which pages changed, then **Publish changes**.

## Name and date changes after publishing

Before your first publish you can change everything freely. After it:

- You have **3 changes in total** for your names, monogram and wedding date. Changing several at once counts as one.
- Always free: fixing a small typo (up to 2 letters in a name), adding a surname, and moving your date by up to 7 days.
- Changed something by mistake? Undo it right away (before you publish it, or within 10 minutes) and you get the change back.
- Everything else (time, venue, schedule, story, photos, details, wording and replies) you can change as often as you like.

Your names and date show with a **Change** button and the changes you have left on the **Us** and **Day & place** pages. The editor tells you before you confirm whether a change is free. If your wedding moves and you have no changes left, message us on Etsy with your order number.

## Step 6. Share your website

Open **Share**:

- **Your website link:** **Copy** it and send it by text, WhatsApp or email, or tap **Open** to see it as a guest. Most messaging apps show a preview card with your names and date; send it to yourself first to check.
- **QR code for printed cards:** **Download PNG** or **Download SVG**. Scan it once with your phone camera before you print.
- Your website is not listed on Google. Only people with your link or QR code can open it.

**Guest password (optional).** Open **Guest password** and turn on **Password protect your website**. Type a password of 4 to 40 characters (capital letters do not matter) or tap **Suggest a password**, then **Turn on password**. Use **Copy password** to send it with your link. It is one shared password for all guests, not a login for each person. Guests type it once; their browser remembers it. If you change it, guests are asked for the new one. Turned off, anyone with the link can open your website.

**Take the website offline** (at the bottom of Share) hides your website from guests: they see "Page not found" until you publish again. Your text, photos and replies are kept.

## Step 7. Guest replies

**What guests do:** on your RSVP page they enter their name, whether they are coming, how many people (up to 10 in one reply), the names of the others (optional), a message and your questions. They need no account, and an email address is optional. To change their answer, they send another reply.

**What you do:** open **Guests** (not Edit → RSVP, which changes the form).

- See how many are coming and not coming, and every reply. Tap a reply to see everyone in it.
- Search by name, and see the answers to your questions.
- **Download list** saves a CSV file for Excel, Numbers or Google Sheets, one row per person.
- **Add a reply** you got by phone or in person; correct a reply; remove an old one.
- **Print list**, or save it as a PDF from your browser's print menu.
- **Refresh** loads new replies. We do not send email notifications yet; Home shows new replies.
- Replies **Held for review** came in unusually fast. They are not counted until you keep them.

Replies close at the end of your reply-by date, in your wedding's time zone. To close earlier, turn off **Accept replies on the website** in Edit → RSVP.

## Step 8. After the wedding

Open **Edit → Day & place → After the wedding** and choose a **Thank-you mode**:

- **Automatic:** your website becomes a thank-you page at midnight after your wedding day (wedding time zone).
- **On now:** it shows right after you publish.
- **Off:** keeps the invitation.

Add a title, a message and a photo if you like, preview it and publish. In thank-you mode, replies close and the countdown and calendar buttons disappear. Your replies stay in **Guests**. You can choose to keep or hide The Day details.

## How long your website stays online

Your website stays online until **12 months after your wedding date**. Home → Dates → **Online until** shows the exact day, and Home reminds you 30 days before. After that it closes for guests; in your editor you can still see your content and download your replies. Longer hosting: [EXTENSION POLICY].

## Quick answers

**Can my partner edit too?** Yes. Share the edit link with your partner only.

**Can I use a computer?** Yes. The editor works on a computer too, with the preview beside it.

**Can I change the website address?** No, it is fixed when you create your website. Your own domain (yournames.com) is not included.

**Can I change colors or fonts?** No. You change the content and the wording; the design stays as made.

**Can it be in my language?** You can write your own texts and the design's headings in any language. Some built-in messages, such as reply form errors, stay in English. Accented Latin letters and Cyrillic use the design's fonts; other alphabets show in a plain standard font. Preview every page.

**How many guests can I invite?** As many as you like. One reply can include up to 10 people.

**Can guests see each other's replies?** No. Only you see them, in your private editor.

**Can I start a second website with my order?** No. One order starts one website.

**Is there music, a printed invitation or a save the date?** No.

## Troubleshooting

**Guests cannot see my changes.** Tap **Review**, then **Publish changes**. Then reload your website.

**The Publish button does not work.** Check your internet connection. Then read the message near the button: your order may still be being confirmed, your date may still be the sample date, or a field needs fixing (the editor shows which one).

**"This edit link no longer works."** A new link may have replaced it, or only part of the link was copied. Use the newest link we sent you, or message us on Etsy.

**"This order already has a website."** Open your website with your saved edit link. No link? Message us on Etsy with your order number.

**My photo will not upload.** Try a JPEG copy of the photo, and check your connection.

**The editor says I am offline or changes are not saved.** Wait until your connection is back and it says saved before you close the page.

**A guest cannot open my website.** Check that Home says your website is live, that the link is complete, and whether the guest password is on.

**The QR code does not scan.** Download it again from Share and print it larger, with white space around it. Always scan a printed proof before printing all cards.

**The countdown or calendar time is wrong.** Check **Time zone of the wedding** in Edit → Day & place.

## Help and privacy

Message BKE Studio on Etsy (in the conversation of your order), or write to **bkestudio@gmail.com**. We reply within **[RESPONSE TIME]**. Please include your order number, your website address, what you see (a screenshot helps) and your phone and browser. Never send your edit link: we never need it.

Your guests' replies are visible only in your private editor, not on your website. Privacy notice: [https://davetiye-platform-five.vercel.app/privacy](https://davetiye-platform-five.vercel.app/privacy).

The design's sample names, dates, places and photos are fictional. Replace them before you share your website.
````
<!-- g091:start-here:end -->
