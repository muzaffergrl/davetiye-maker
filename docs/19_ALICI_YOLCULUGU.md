# Alıcı yolculuğu — ilan, satın alma ve satış sonrası (G091, K32, 2026-10-15)

K32 (kullanıcı, 2026-10-15): Etsy alıcısının kafasında ilanı incelerken, satın alırken ve satın aldıktan sonra **hiçbir soru
işareti ve endişe** kalmamalı; siteyi kolayca düzenleyebileceğine ikna olmalı; satış sonrası bütün bilgilendirme ve rehberler
hazır olmalı.

Bu belge alıcı yolculuğunun tek kaynağıdır: aşama aşama harita (§2), soru envanteri (§3), Etsy metinleri ve **admin panelinin
kullanacağı satış sonrası mesaj şablonları** (§4), START HERE rehberinin yapısı (§5, ortak kaynak Ek A'da), panel / `/start` /
satış sitesi için metin önerileri (§6) ve açık kalanlar (§7).

**Kurallar** (AGENTS, docs/05 §E): yalnız kodda olan ve test edilmiş özellik vaat edilir; doğrulanmamış iddia `[VERIFY …]`;
karar verilmemiş ticari alan köşeli parantezli yer tutucu (`[ORDER CHECK TIME]`, `[EXTENSION POLICY]` …) kalır (**K48, 2026-10-17:**
G154 bunları koordinatör varsayılanlarıyla doldurdu — sipariş onayı "usually within 24 hours", uzatma Online until'dan önce
Etsy'den istenir, silme 30 gün, arşiv 12 ay; yalnız §4.5 şablonları admin kopyasıyla birlikte G155'te); tarih `June 12, 2027`;
rakip metni kopyalanmaz. **K33 (2026-10-15):** dükkân adı **BKE Studio**, destek e-postası **bkestudio01@gmail.com** (2026-10-16 kullanıcı düzeltmesi; ilk yazılan bkestudio@gmail.com yanlıştı);
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
| 4 | "Siteyi ne kadar süre açık kalır?" | Eski ilan `[HOSTING PERIOD]` | K25 kararı yazıldı: düğünden 12 ay sonrasına kadar; panelde **Online until** tarihi | ~~`[EXTENSION POLICY]`~~ K48/G154: Online until'dan önce Etsy'den yazana uzatılabilir (ücret sözü yok); 12 ay arşiv, sonra silme |
| 5 | "İsim/tarih yanlış girersem? Düğün ertelenirse?" | Panel kuralı var; ilanda yok | İlanda, rehberde ve SSS'de 3 hak + bedava düzeltmeler + geri alma; `date_moved`, `extra_change_granted` şablonları | Erteleme politikası `[POSTPONEMENT POLICY]` |
| 6 | "Yayınla düğmesi neden çalışmıyor?" (manuel sipariş onayı) | Panelde "We are confirming your Etsy order" | Rehberde ayrı bölüm; `publish_blocked_pending` + `order_confirmed` şablonları | ~~`[ORDER CHECK TIME]`~~ K48/G154: "usually within 24 hours" (rehber + ilan); şablonlar G155 |
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
| Kayıp link | **G146'dan beri önce `/my`:** Etsy sipariş no + başlatırken verilen e-posta her cihazda editörü açar (cihaz anahtarı; rehber G148). Gerekirse dükkân `scripts/reissue-edit-key.ts` ile yeni link üretir; **eski link hemen ölür**; içerik/foto/yanıt aynı kalır | `scripts/reissue-edit-key.ts` | Yerel test; canlı depoda denenmedi; politika K48 = `/my` akışı (G154: satış sitesi SSS'si ve config `policies.lostLink`) |
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
- **G148 (2026-10-17, G146/K46):** link artık tek yol değil: sipariş no + e-posta her cihazda `/my`'dan editörü açar. SH bölümü
  **Come back on any device** + "Continue on another device" kutusu oldu; link "kısayol". Açık kalan (platform işi): `/start`
  sonuç ekranı hâlâ "Save this link — It is the only way to open your editor" diyor (`StartForm.tsx`), §4.5 şablonları
  (`welcome_start`, `new_edit_link`, `order_already_used`, `setup_service_done_same_link`) eski kayıp-link yolunu anlatıyor.

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
- **Bugün:** panelde Online until + 30 gün uyarısı. **K48 (G154):** uzatma Online until'dan önce Etsy'den istenir (ücret sözü
  yok); silme Etsy'den sipariş numarasıyla, site + fotoğraflar + misafir yanıtları 30 gün içinde; site çevrimdışı olduktan sonra
  12 ay arşiv, sonra silinir.
- **Kapanış:** SH "How long your website stays online" + "Help and privacy" (G154), satış sitesi `/privacy`, `/faq`, `/pricing`;
  `archive_notice`, `delete_data` şablonlarında `[EXTENSION POLICY]`, `[DELETION PROCESS]` admin kopyasıyla birlikte G155'te.

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
| 8 | What can I change? | Names, date, time and time zone, venue and map link, the order of the day (up to 10 rows), your story, 5 photos, questions and answers (up to 12), RSVP deadline, which reply fields are required and up to 10 questions of your own, map and directions, story music, and the design's headings, labels and buttons in your own words. | İ, İS, SH | ✓ |
| 9 | What can't I change? | The artwork, colors, fonts, page layout and the envelope animation stay as designed. | İ, İS | ✓ |
| 10 | Can I change the wording, like "You are invited"? | Yes. Every page of the editor has "Headings & labels" where you can rewrite the design's texts or reset them. | İ, SH | ✓ |
| 11 | Is it only for weddings? | It is made for weddings. Suggested wording is built in for a vow renewal, an elopement party or a commitment ceremony, and you can rewrite the headings yourself. | İS | ✓ |
| 12 | Can it be in my language? | You can write all your own texts and the design's headings in your own words. Some built-in parts stay in English: error messages of the reply form and the add-to-calendar text. Accented Latin letters and Cyrillic use the design's fonts; other alphabets show in a plain standard font. | İ, İS | ✓ (2 temada ölçüldü) |
| 13 | Can I use it without photos? | Yes. Empty photo frames show the design's soft placeholder image, and you can hide the Our Story page. | İS, SH | ✓ |
| 14 | How long does my website stay online? | Until 12 months after your wedding date. Your editor shows the exact "Online until" date. | İ, İS, SH | ✓ (K25) |
| 15 | Is there a monthly fee or subscription? | No. You pay once on Etsy. | İ, İS, SS | ✓ |
| 16 | What will my link look like? | Your names on our web address, for example …/avery-and-jordan. You choose it when you start; it cannot be changed later. | İ, İS | ✓ (alan adı `[DOMAIN]` K) |
| 17 | Can I use my own domain (yournames.com)? | Not at the moment. | İ, İS | — |
| 18 | Is there music? | Yes, if you like: soft music on your Our Story page (four tracks or your own MP3/M4A), and soft sounds when the invitation opens. Guests can turn the sound off. | İ | — |
| 19 | Do you print or ship anything? | No. This is a digital product. You can print your QR code on your own cards. | İ | — |
| 20 | Is there a matching save the date? | Not yet. You can share your website early and add details later. | İS, SS | — |
| 21 | Can I send the invitations from the website by email? | No. You share your link yourself by text, WhatsApp, email or a printed QR code. | İ, İS | — |
| 22 | Can I import my guest list? | No. Guests reply on the website; you can add replies you get another way. | İS | — |
| 23 | Will my website show up on Google? | No. Each website asks search engines not to list it. Only people with your link (or QR code) can open it. | İ, İS | ✓ |
| 24 | Can I add a password so only invited guests can see it? | Yes, optional: one shared guest password that you send with your link. | İ, İS, SH | ✓ |
| 25 | Is the design made with AI? | Yes. The artwork and sample photos were made with AI image tools from our own descriptions, then cut into layers and assembled by us. | İ, SS | ✓ (Etsy beyan alanı V) |
| 26 | Can I get a refund? | No returns, exchanges or cancellations (digital product, instant access). If something does not work as described, we fix it. Please try the live demo first. | İ, İS | ✓ (2026-10-15) |
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
| 47 | Why can't I publish? It says you are confirming my order. | We check each order in our Etsy shop before a website can go live. Everything you set up is saved. Publish opens when the order is confirmed (usually within 24 hours); reload your editor then. | SH, P, M | ✓ (süre K48) |

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
| 71 | Can I ask for meal choices or allergies? | Yes, up to 10 questions of your own (choices, yes/no, short or long answer, number), each required or optional. Only guests who are coming see them. | İ, SH | ✓ (canlı V) |
| 72 | Can I get the list into Excel? | Guests → Download list saves a CSV file for Excel, Numbers or Google Sheets, one row per person. | İ, SH | ✓ |
| 73 | Someone replied by phone. | Guests → Add a reply. It counts like any other and is marked "Added by you". | SH | ✓ |
| 74 | When do replies close? | At the end of your reply-by date, in your wedding's time zone. You can also turn replies off. | SH | ✓ |
| 75 | Who can see the replies? | Only you, in your private editor (and our support if you ask for help). Guests never see each other's replies. | İS, SH | ✓ |

### 3.7 Düğün sonrası, arşiv, destek

| # | Soru | Cevap | Yer | D |
|---|---|---|---|---|
| 76 | What happens after the wedding? | You can turn your website into a thank-you page (automatically the day after, or right away), with your own message and photo. Replies close. | İ, SH | ✓ |
| 77 | What happens after it closes? Can I extend it? | Your website closes for guests; in your editor you can still see your content and download your replies. Need it longer? Message us on Etsy before your Online until date and we can extend it. To delete your data sooner, message us on Etsy with your order number: we delete your website, photos and guest replies within 30 days. | SH, M | ✓ (K48) |
| 78 | How do I get help, and how fast? | Message BKE Studio on Etsy with your order number (or email bkestudio01@gmail.com). We reply within 24 hours. We never ask for your edit link. | İ, SH, P | ✓ (K33; süre 2026-10-15) |

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
• Online RSVP: replies, head counts and up to 10 questions of your own (for example a meal choice), each required or optional; download the replies as Excel (or CSV) in one tap, or connect your own Google Sheet
• Map and directions to your venue (Google Maps, Apple Maps, Waze)
• Background music on your Our Story page (four tracks or your own file) and sound effects as the invitation opens
• Your website in English, Spanish, French, German or Turkish, or in several with a language button for guests: built-in texts come translated, your own texts can be translated automatically as a draft that you check and approve
• Add-to-calendar buttons for guests (Apple / Outlook and Google Calendar)
• 5 photo spots with cropping, a countdown, map, dress code, travel & stay and registry buttons, and up to 12 questions & answers
• A QR code of your website (PNG or SVG) for printed cards and signs
• Downloads: your whole website as a PDF, and a printable invitation in your design (5 × 7 in or A5, with an optional back side, bleed and crop marks for a print shop)
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
• RSVP deadline, required or optional reply fields and up to 10 questions for your guests
• Story music: one of four tracks, your own MP3/M4A, or none
• Map and directions for your venue (and a reception place)
• The design's headings, labels and buttons, in your own words (for example "You are invited" or "Will You Join Us?")
• Which optional sections show
What stays as designed: the artwork, colors, fonts, page layout and the envelope animation.

WHAT YOUR GUESTS SEE
Your link opens a sealed envelope. One tap opens it into your pages. Guests reply on the RSVP page and add your date to their calendar. They need no app and no account, and an email address is optional. Most messaging apps show a preview card with your names and date. Your website is not listed on Google: only people with your link or QR code can open it.

WHAT YOU NEED
• A phone or computer with a web browser
• Your Etsy order number (on Etsy under You → Purchases and reviews, or in your Etsy confirmation email)
• Your wedding details; photos are optional
No Canva account, no app, no design skills.

GOOD TO KNOW
• Digital product: nothing is printed or shipped. Nothing to fill in at checkout.
• One website for each design you buy (two designs in one order: one website each). You choose your web address when you start; it cannot be changed later. A custom domain (yournames.com) is not included.
• Your Etsy order number is your key: with it and your email, your editor opens right away, and again on any phone or computer to continue where you left off. No account or password.
• If your editor says it is confirming your Etsy order, you can set everything up in the meantime; Publish opens once the order is confirmed, usually within 24 hours.
• After you publish, names and date can be changed 3 times in total; typo fixes and moving the date by up to 7 days are always free. Everything else can be changed as often as you like.
• Automatic translation is a machine-made first draft: read each text before you approve it. Your own texts can also be in any other language; accented Latin letters and Cyrillic use the design's fonts, other alphabets a plain standard font.
• Colors and fonts do not change.
• The painted design elements and the sample photos were made with AI image tools from our own descriptions, then edited and assembled by us. Sample names, dates, places and photos are fictional.
• No returns, exchanges or cancellations: this is a digital product with instant access. If something on your website does not work as described, message us on Etsy and we will fix it.
• Terms of use: https://bkestudio.com/terms

QUESTIONS?
Message us here on Etsy. We reply within 24 hours.
```

Notlar:
- "designed for phone screens" — gerçek cihaz testi yapılana kadar bu ifade; "tested on iPhone" yazılmaz (docs/05 §E).
  İlan dosyasında `[VERIFY: real iPhone Safari and Android Chrome]` işareti durur.
- Q&A ve RSVP soruları canlıda uçtan uca denenmedi → ilan dosyasında `[VERIFY: try on the live site]`.
- "We confirm each order in our shop…" yalnız `CLAIM_ORDER_VERIFICATION=manual` canlıda açıkken doğru → ilan dosyasında
  `[VERIFY: manual order check on in production]`.
- **G154 (2026-10-17, G090 P0-03, K48):** açıklamada artık hiç `[VERIFY]` yok: yalnız var olan ve G090'ın yerel üretim
  derlemesinde geçen özellikler yazılır. Sipariş cümlesi her modda doğru olacak biçimde koşullu ("If your editor says it is
  confirming your Etsy order … usually within 24 hours"); Google Sheets yalnız özellik olarak ("connect your own Google Sheet"),
  nasıl davrandığı değil; müzik için "soft/gentle" gibi dinlenmemiş nitelemeler çıktı; dil satırı G144'e (5 dil, otomatik
  çeviri taslağı), Downloads satırı G139'a göre. Canlı site / gerçek telefon / gerçek Google hesabı denemeleri ilanın §11
  kutularında durur ve `tools/etsy_upload.py` onları `open_checks`'e ("before publishing") taşır.
- "Instant download / anında" ifadesi kullanılmadı: indirme anında, ama yayın sipariş onayını bekleyebilir.
- G148 (2026-10-17, G146/K46): "Save your private edit link… we cannot email it to you yet" maddesi yerine erişim satırı
  ("Your Etsy order number is your key…"): editör **hemen** açılır (taslak), yayının sipariş onayını bekleyebileceğini bir sonraki
  madde söyler. E-posta gönderimi ve otomatik Etsy doğrulaması vaat edilmez (SMTP ve `etsy` modu sahibin kurulumunu bekliyor).
  SSS'de "account/password" ve "lose my edit link" cevapları, §4.4'te iki Etsy mesajı aynı yola (`/my`) çevrildi.

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
No. Your Etsy order number and the email you start with open your editor on any phone or computer. You also get a private edit link as a shortcut.

What if I lose my edit link?
No problem: on any phone or computer, open the "Create your website" page of our website (the address is in your START HERE guide) and enter your Etsy order number and the email you started with. Your editor opens where you left off.

Can I change things after I publish?
Yes, as often as you like. Names and date can be changed 3 times in total after publishing; typo fixes and moving the date by up to 7 days are free.

Can I change the headings and wording?
Yes. Every page of the editor has "Headings & labels". The artwork, colors and fonts stay as designed.

Can it be in another language?
Yes. Your website can be in English, Spanish, French, German or Turkish, or in several of them: the design's built-in texts come translated, and your own texts can be translated automatically (check each translation before you approve it). You can write your own texts in any other language too.

How do my guests reply?
On your RSVP page, with no app or account. You see every reply in your editor and can download them as Excel (or CSV) in one tap, or connect your own Google Sheet.

How many guests can I invite?
As many as you like. One reply can include up to 10 people.

Can I add a password?
Yes, optional: one shared password that you send to your guests with the link.

How long does my website stay online?
Until 12 months after your wedding date. After the wedding it can turn into a thank-you page. Need it longer? Message us on Etsy before your "Online until" date and we can extend it.

Can I use my own domain?
Not at the moment. Your address is your names on our web address.

Is anything printed or shipped?
No. It is a digital product. Your editor makes a printable invitation in your design (5 × 7 in or A5) that you can print at home or at a print shop.
```

### 4.4 Etsy'nin otomatik alıcı metinleri (dükkân geneli)

Etsy'de iki alan var (docs/15 §4.2, Shop Manager → ayarlar; API yok → `claude-tarayici` girer): **Message to Buyers** (makbuz +
sipariş onay e-postası) ve **Message to Buyers for Digital Items** (indirme sayfası; **bütün dijital ilanlara aynı metin**).
Bu yüzden tasarıma özel link konamaz: temasız `/start` adresi alıcıya aldığı tasarımı seçtirir (G080 "Choose your design").
`{START_BASE}` = `https://bkestudio.com/start`, `{MY_PAGE}` = `https://bkestudio.com/my` (G148: sipariş no + e-postayla her cihazdan devam, G146) (G189, 2026-10-18: marka alan adı bkestudıo.com, IDNA biçimi; docs/05 §C).

**Message to Buyers for Digital Items** (indirme sayfası; 2026-10-23 hizmet paragrafıyla Etsy'ye girildi, docs/20 §1.5):

```text
Thank you for your order!

Wedding website design: your download is your START HERE guide (PDF). Open it and tap the start link inside. Can’t open the PDF? Start here instead and choose the design you bought: {START_BASE}
You will enter your Etsy order number, your email and your first names. To continue later on any phone or computer, open {MY_PAGE} and enter the same order number and email. No account or password.

Service order (setup, custom design or extra revision): your download is a short PDF that tells you what to send us and what happens next.

Questions? Message us here on Etsy with your order number.
```

**Message to Buyers** (makbuz ve onay e-postası; kısa; 2026-10-23 Etsy'ye girildi, docs/20 §1.4):

```text
Thank you! Wedding website design: start it from the START HERE PDF in your download, or at {START_BASE} (choose the design you bought). To continue later on any device, open {MY_PAGE} with the same order number and email. Service order (setup, custom design or extra revision): open the PDF in your download to see what happens next. Questions? Message us on Etsy.
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

Karar bekleyen politikalar şablonda **köşeli parantezle** durur (`[ORDER CHECK TIME]`, `[EXTENSION POLICY]` …). Admin paneli,
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
      "Your Etsy order number and email are your key: on any phone or computer, open the \"Create your website\" page of our shop site and enter them to continue where you left off. No account or password. The next screen also shows a private edit link as a shortcut.",
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
      "We will message you here as soon as order {order} is confirmed; then reload your editor and tap Publish.",
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
    "when": "After the shop has made a new link with reissue-edit-key (the link was shared by mistake, or the buyer can't get in with order number + email). Only inside this order's own Etsy conversation, or after the buyer wrote from the email address used on /start with the order number.",
    "placeholders": [
      "names",
      "edit_url",
      "site_url",
      "shop"
    ],
    "body": [
      "Hi {names}, here is your new private edit link:",
      "{edit_url}",
      "Your old edit link no longer works and every device you were signed in on has been signed out. Your website, photos and guest replies are exactly as before, and your website address stays {site_url}.",
      "You can always get back in on any device with your Etsy order number and the email you used, on the \"Create your website\" page of our shop site. Keep this link private and share it only with your partner. We will never ask you for it.",
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
      "This message means a website has already been started with order {order}, maybe by you earlier or by your partner. Enter the same order number together with the email address that was used when the website was started, and your editor opens on any device.",
      "If that email doesn't work, tell us here and we will check the order and help you back in. Please don't start a second order.",
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
      "Need it online longer? Reply here before that date and we can extend it.",
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
    "id": "setup_service_details",
    "title": "Setup service: send us your details",
    "when": "Right after a 'We set it up for you' order (K42). Ask once for everything we need; the buyer may also already have written.",
    "placeholders": [
      "order",
      "design",
      "shop"
    ],
    "body": [
      "Hi, thank you for choosing our setup service! We will enter your details into your {design} wedding website for you.",
      "Please reply here with:\n• Your first names as they should appear, and your Etsy order number for the design (if it is not {order})\n• Wedding date, ceremony time and time zone\n• Venue name and address (and a map link if you have one)\n• The order of the day, your story, questions and answers, dress code, travel and registry links: whatever you want to show\n• Your RSVP deadline and up to 3 questions for your guests (for example a meal choice)\n• Any headings or wording you want changed",
      "Photos: send up to 5 as a share link (Google Drive, Dropbox or iCloud), and tell us which one goes where (portrait, 3 story photos, venue).",
      "This is one round of setup. When we are done we send you your edit link; you can change anything yourself after that, and you decide when to publish. We finish within 3 days of receiving everything.",
      "{shop}"
    ],
    "note": "docs/23 §3: one round per purchase. Not started yet → admin 'Yeni sipariş' with the DESIGN order number; already started → 'Dükkân olarak düzenle' (the buyer's link keeps working; G145) or, if the buyer lost it, 'Yeni düzenleme linki'. Write the setup order number in the site note."
  },
  {
    "id": "setup_service_done",
    "title": "Setup service done: your edit link",
    "when": "After the shop has entered the buyer's details (setup service). Send in this order's Etsy conversation; it carries a fresh edit link.",
    "placeholders": [
      "names",
      "design",
      "edit_url",
      "site_url",
      "shop"
    ],
    "body": [
      "Hi {names}, your {design} wedding website is set up with the details you sent us.",
      "Here is your private edit link:\n{edit_url}",
      "Please open it and check every page: names, date, venue, photos and RSVP. Your website is still a private draft; tap Publish when you are happy, and your guests can open it at {site_url}.",
      "Save this link now (copy it into your notes app or email it to yourself). If you had an earlier edit link, it no longer works: use this one. Share it only with your partner; we will never ask you for it.",
      "You can change anything yourself from now on. If you would like us to make another round of changes for you, that is a new setup purchase in our shop.",
      "{shop}"
    ],
    "note": "Only right after 'Yeni sipariş' or 'Yeni düzenleme linki' (fresh link). Record the round in the site note (date + setup order number)."
  },
  {
    "id": "setup_service_done_same_link",
    "title": "Setup service done: same edit link",
    "when": "After the shop has entered the buyer's details with its own shop edit link (the buyer's link was never changed).",
    "placeholders": [
      "names",
      "design",
      "site_url",
      "shop"
    ],
    "body": [
      "Hi {names}, your {design} wedding website is set up with the details you sent us.",
      "Open it with the same private edit link you already have (or with your Etsy order number and email on any device) and check every page: names, date, venue, photos and RSVP. Your website is still a private draft until you tap Publish; your guests can then open it at {site_url}.",
      "You can change anything yourself from now on. If you would like us to make another round of changes for you, that is a new setup purchase in our shop.",
      "{shop}"
    ],
    "note": "G145: after 'Dükkân olarak düzenle' (the shop's own 72-hour link). The buyer's link still works; end the shop link when done. Record the round in the site note."
  },
  {
    "id": "custom_design_brief",
    "title": "Custom design: tell us your idea",
    "when": "Right after a custom design order (K42), before any design work starts.",
    "placeholders": [
      "order",
      "shop"
    ],
    "body": [
      "Hi, thank you for your custom design order ({order})! We are excited to make a wedding website just for you.",
      "To start, please reply here with:\n• Your wedding date and the feel you want (for example classic, romantic, garden, coastal)\n• Two or three colors you love, and anything you do not want\n• Pictures that inspire you (a share link to photos or a Pinterest board is fine)\n• What guests should open first, if you have an idea (an envelope, a card, a book …)",
      "Your custom design includes everything our designs include: the editor, RSVP and every page. It includes 2 rounds of changes to the design (each further round is 690 TL), and the first version is ready within 3 days of receiving your answers. The design is made only for you: we never sell it to anyone else.",
      "Your own names, photos and texts go in through the editor as usual (or with our setup service).",
      "{shop}"
    ],
    "note": "docs/23 §4. Decided 2026-10-16: 2 revision rounds, then 690 TL a round; first version in 3 days; exclusive."
  },
  {
    "id": "custom_design_ready",
    "title": "Custom design ready to start",
    "when": "When the custom design is live on the platform as the buyer's own design and they can start their website.",
    "placeholders": [
      "start_url",
      "order",
      "shop"
    ],
    "body": [
      "Hi, your custom design is ready!",
      "Start your website here: {start_url}",
      "Enter your Etsy order number ({order}), your email and your first names, and choose your web address. Then save your private edit link when it appears: it opens your editor.",
      "If anything in the design should change, reply here; that counts as one of your 2 revision rounds (each further round is 690 TL).",
      "{shop}"
    ],
    "note": "The custom theme must be claimable on /start before this is sent (docs/23 §4)."
  },
  {
    "id": "custom_design_extra_round",
    "title": "Custom design: extra round of changes",
    "when": "A custom design buyer asks for a third (or later) round of design changes, or has just bought the Extra design revision listing.",
    "placeholders": [
      "shop"
    ],
    "body": [
      "Hi, thank you! We are happy to make more changes to your custom design.",
      "Your custom design included 2 rounds of changes, and both are used. Each further round is 690 TL, through the Extra design revision listing in our shop. If you have already bought it, thank you: please send us all the changes for this round together in one message.",
      "We send you the updated design within 3 days of receiving your changes. Your names, dates, photos and texts you can still change yourself in your editor at any time, free.",
      "{shop}"
    ],
    "note": "docs/23 §4.7. Before a third round, check the Etsy order for the Extra design revision listing; record the round in the site note (revision n)."
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
      "Our refund policy: because this is a digital product with instant access, we do not accept returns, exchanges or cancellations. If something on your website does not work as described, we will fix it.",
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
      "To delete your website, photos and guest replies for good, just reply here and we delete everything within 30 days (usually much sooner). Before we delete anything we confirm it is you (order {order}, website {site_url}). Deleting cannot be undone, so download your replies first if you want a copy (Guests → Download list).",
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
5. Zaman vaadi (`[ORDER CHECK TIME]`) karar verilmeden doldurulmaz. Yanıt süresi kararlı: 24 saat (kullanıcı, 2026-10-15).
   `publish_blocked_pending` bu yüzden sipariş kontrolü için süre vermeden yazılır (G135); süre kararı çıkarsa cümle geri eklenebilir.
6. `order_confirmed` platform tarafından gönderilmez; `verify-order` sonrası dükkân gönderir (admin paneli bu ikisini tek
   eylemde birleştirebilir, §6 A2).

---

## 5. START HERE rehberi

**Ortak kaynak:** Ek A (bu belgenin sonunda, iki işaret satırı arasında: `g091:start-here:start` … `end`). Yer tutucular
(`{DESIGN_NAME}`, `{START_URL}`, `{PRIVACY_URL}`, `{TERMS_URL}`, `{OPENING}`, `{OPENING_TAB}`, `{LANGUAGE_FONTS}`) Ek A'nın başındaki tabloda. **Üretim tek
komut (G122):** `python3 tools/build_customer_guides.py` — 20 tasarımın her biri için `package/customer/START_HERE.md`,
`START_HERE.pdf`, `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`, gerçek başlat linkinden), `img/start_qr_page.png`; sonra
denetim. `--designs 06-20` seçim, `--check` yalnız denetim, `--base-url` / `GUIDE_BASE_URL` başka alan adı (karar gelince).

| Tasarım | Klasör (`collections/<…>/package/customer/`) | Başlat linki | `{OPENING}` | Fontlar → `{LANGUAGE_FONTS}` |
|---|---|---|---|---|
| 01 Olive & Ivory | `01_Olive_Ivory` | `…/start?theme=olive-ivory` | envelope | Great Vibes, EB Garamond → Kiril dahil |
| 02 Dusty Blue & Champagne | `02_Dusty_Blue` | `…/start?theme=dusty-blue-champagne` | envelope | Pinyon Script, Cormorant Garamond → Kiril kısmen/yok |
| 03 Blush Garden Rose | `03_Blush_Garden_Rose` | `…/start?theme=blush-garden-rose` | envelope | Great Vibes, Cormorant Garamond, Lora → Kiril dahil |
| 04 Vintage Airmail Love Letter | `04_Vintage_Airmail` | `…/start?theme=vintage-airmail-love-letter` | envelope | Homemade Apple, Special Elite → bir font yalnız latin |
| 05 Mediterranean Lemon | `05_Lemon_Mediterranean` | `…/start?theme=mediterranean-lemon` | envelope | Allura, Playfair Display → Kiril kısmen/yok |
| 06 Art Deco Black-Tie | `06_Art_Deco_Noir` | `…/start?theme=art-deco-black-tie` | gatefold | Italiana, Josefin Sans → bir font yalnız latin |
| 07 Burgundy Velvet Autumn | `07_Burgundy_Velvet` | `…/start?theme=burgundy-velvet-autumn` | envelope | Pinyon Script, Cinzel, Cormorant Garamond → Kiril kısmen/yok |
| 08 Winter Evergreen | `08_Winter_Evergreen` | `…/start?theme=winter-evergreen` | envelope | Parisienne, Libre Baskerville → Kiril kısmen/yok |
| 09 Lavender Provence | `09_Lavender_Provence` | `…/start?theme=lavender-provence` | pouch | Alex Brush, Cormorant Garamond → Kiril kısmen/yok |
| 10 Tuscan Vineyard | `10_Tuscan_Vineyard` | `…/start?theme=tuscan-vineyard` | envelope | Italianno, Marcellus → Kiril kısmen/yok |
| 11 Boho Pampas Terracotta | `11_Boho_Pampas` | `…/start?theme=boho-pampas-terracotta` | envelope | Sacramento, Josefin Slab → bir font yalnız latin |
| 12 Tropical Destination | `12_Tropical_Destination` | `…/start?theme=tropical-destination` | wallet | Dancing Script, Raleway → Kiril kısmen/yok |
| 13 Enchanted Forest Storybook | `13_Enchanted_Forest` | `…/start?theme=enchanted-forest-storybook` | book | Tangerine, IM Fell English → bir font yalnız latin |
| 14 Ivory Lace & Pearls | `14_Ivory_Lace_Pearl` | `…/start?theme=ivory-lace-pearls` | gatefold | Mrs Saint Delafield, Bodoni Moda → Kiril kısmen/yok |
| 15 Cherry Blossom Spring | `15_Cherry_Blossom` | `…/start?theme=cherry-blossom-spring` | envelope | Petit Formal Script, Noto Serif Display → Kiril kısmen/yok |
| 16 Sunflower Rustic Barn | `16_Sunflower_Rustic` | `…/start?theme=sunflower-rustic-barn` | envelope | Kaushan Script, Merriweather → Kiril kısmen/yok |
| 17 Emerald & Gold Estate | `17_Emerald_Gold_Estate` | `…/start?theme=emerald-gold-estate` | envelope | Cinzel Decorative, Cormorant Infant → Kiril kısmen/yok |
| 18 Wildflower Meadow Vellum | `18_Wildflower_Vellum` | `…/start?theme=wildflower-meadow-vellum` | sleeve | Satisfy, Spectral → bir font yalnız latin |
| 19 Midnight Garden | `19_Midnight_Garden` | `…/start?theme=midnight-garden` | envelope | Playfair Display SC, Cormorant SC, Cormorant Garamond → Kiril dahil |
| 20 Coastal Seaside | `20_Coastal_Seaside` | `…/start?theme=coastal-seaside` | envelope | Allison, Lora → Kiril kısmen/yok |

Taban `https://bkestudio.com` (bkestudıo.com; G189 2026-10-18'de geçici Vercel adresinden taşındı; başka bir taban için `--base-url` ile yeniden üretilir — QR'lar
basılı kartlara gireceği için satıştan önce, docs/05 §C). QR koyu rengi tasarımın `palette.json`'undaki en koyu renk (06, 17, 19'da
`ink` açık renk olduğu için), beyaz zeminde kontrast ≥ 7:1.

**Canlıyla fark (2026-10-16):** rehber depodaki paneli (G100 + G121) anlatıyor. Production `b952bc8` (`dpl_HKT1…`, docs/10 §2)
ikisini de içermiyor (`git merge-base --is-ancestor 368ebb1 b952bc8` → hayır). G100 + G121'li yayın canlıya çıkıp `--check` yeniden geçmeden
rehber alıcıya verilmez. 20 başlat linki (`/start?theme=<id>`, "Design: <ad>" + form) ve `/privacy` aynı gün canlıda `200` (Vercel
bağlayıcısı; bu ortamdan `curl` vekil sunucuda 403). **G131:** rehber artık G126 (müzik), G127 (harita), G128 (yanıt formu, Excel,
Google Sheets) ve G130'u (Help'teki "Prefer us to do it?") da anlatıyor; bunlar canlıya çıkmadan rehber verilmez. Google Sheets
bağlantısı gerçek Google hesabıyla denenmedi (G128): rehber düğmeyi ve "coming soon" hâlini anlatıyor, çalıştığını iddia etmiyor.

**Yapı (alıcının sırasıyla):** Good to know before you begin → **Start now: the first 5 steps** (QR + link; G148: 2. adım sipariş
numarasının yeri) → **Come back on any device** (G148: "Continue on another device" kutusu = `/my` + aynı sipariş no + e-posta;
düzenleme linki kısayol; Share → Use on another device) → Step 1 Start → Step 2 three-step setup (G100: 1. adım yalnız adlar + tarih; yayın sonrası "Your website is
live" ekranı) → bekleyen sipariş onayı → Step 3 Edit (6 sayfa tablosu, Headings & labels, sample satırı, otomatik kayıt) → Step 4
Photos → Map and directions (G127) → Music and sound (G126) → Step 5 Preview & publish → isim/tarih hakkı → Step 6 Share (QR,
şifre, çevrim dışı) → Step 7 Guest replies (Reply form, Guest list / Results, Download Excel / CSV, Google Sheets, Held) → Step 8
After the wedding → Online süresi → Quick answers → Troubleshooting → Help and privacy (G130 ek hizmet satırı).

**Bilinçli seçimler:**
- "İlk 5 dakika" yerine **"Start now: the first 5 steps"**: süre ölçülmedi (docs/05 §E "süre yazılmaz"); 5 = adım sayısı.
- Panel düğme ve başlık adları kaynaktan birebir (kalın). `--check` her kalın etiketi ve tırnaklı panel metnini kaynakta arar
  (`platform/components/panel`, `platform/app/start`, `platform/lib/{panel,claim,theme}`, tasarımın `theme.json`'u); 2026-10-16'da
  hepsi bulundu. G100 ile gelenler: Learn more, Your website is live, Copy link, Open website, Share, More ways to share,
  Next, if you like, Go to my editor, Go to the first one, Guest list, Results, All / Coming / Not coming / New, Mark as seen,
  Held, Keep this reply, Edit reply, Remove reply. G121 ile gelenler: Continue (Skip for now yanında), Settings, Time zone,
  Saved. Önizlemenin ilk sekmesi G121'den beri tasarımın kendi açılışı (`{OPENING_TAB}`: Envelope, Gatefold, Pouch, Wallet,
  Book, Sleeve; `lib/panel/model.ts` `openingTabLabel`); kaynakta düz metin olmadığı için `--check` bu etiketi
  `openingTabLabel`'ın varlığıyla doğrular. Zarfsız 6 tasarımın rehberinde "envelope" hiçbir biçimde geçmez.
  G131 ile kaynak listesine `platform/lib/{audio,rsvp}`, `lib/maps.ts` ve misafir betikleri `public/audio/audio.js`,
  `public/static/map.js` eklendi (parça adları, cevap türleri, "Play music"). Misafirin düğmesi "♪ Play music"; rehberde ♪ yok,
  çünkü PDF'in standart Helvetica'sı bu işareti basamaz. G148 ile `platform/components/my` (/my: "Open or start your website",
  "Etsy order number", "Email address", "Continue") ve satış sitesinin `components/marketing/Shell.tsx`'i ("Create your website")
  eklendi; kutunun başlığı "Continue on another device" rehberin kendi başlığı (`NOT_LABELS`).
- G148 (K46): Etsy'nin indirmesi herkese aynı PDF → rehberde alıcıya özel kod yok; anahtar Etsy sipariş numarası + e-posta. Rehber
  e-posta gönderimi vaat etmez (SMTP kapalı, G147) ve otomatik Etsy doğrulaması iddia etmez; "We are confirming your Etsy order"
  bölümü `manual` modda doğru olduğu için kaldı. "Lost your link? Message us on Etsy" ana yol değil, en son çare.
- K33: dükkân adı **BKE Studio**, destek e-postası **bkestudio01@gmail.com** (2026-10-16 düzeltmesi); yanıt süresi **24 saat** (kullanıcı, 2026-10-15).
- Ekran görüntüsü yok: ekranlar K29/G100 panelinden yeniden alınmadı. Canlı tabanla `capture` yeniden alınınca rehbere görsel
  eklenebilir (önerilen görev, §7).
- PDF: reportlab, US Letter, standart PDF fontları (font dosyası gömülmez ya da pakete konmaz); QR = `img/start_qr.png`'nin kendisi
  (1,6 inç, tıklanabilir); `invariant` (aynı girdi → bayt bayt aynı PDF). Denetim: Markdown = Ek A'nın doldurulmuş hâli (eski kopya
  hata), QR modül modül (segno) ve jsQR ile raster (PNG'ler + PDF'in bütün sayfaları, tam bir QR), PDF linkleri yalnız başlat linki
  + `/my` (G148, en az bir kez) + gizlilik metni, zarfsız tasarımda "envelope" yok. 9 sayfa (G148 sonrası da).
- Görünüm (2026-10-22, kullanıcı isteği: "cilalı, anlaşılır, göz yormayan, logolu"): BKE Studio logosu (`brand/svg`, vektör yol olarak
  çizilir, font yok); kapakta tasarımın kendi yazısız görseli (`platform/themes/<id>/img/og-1200x630.jpg`) + "Design: …" etiketi,
  başlık ve "Good to know" onay kartı; 2. sayfada yalnız hızlı başlangıç (numaralı rozetler + QR kartı); "Step 1"den önce koyu
  "The full guide" şeridi ve sayfa numaralı, tıklanabilir içindekiler; PDF yer imleri; tablolar, kutular ve iletişim kartı;
  renkler `brand/tokens.json`. Metin yine yalnız Ek A (+ düzenin birkaç sabit yön levhası, `GUIDE_TEXT`). 13–14 sayfa.
- 2026-10-23 (sahip kararı): kurulum hizmeti ve ek revizyon şimdilik Etsy taslağı, satılmıyor → Ek A'dan "Prefer us to do it? …
  as a separate Etsy purchase" satırı çıkarıldı (G130 satırı; rehber artık ücretli hizmete davet etmiyor, "message us on Etsy"
  satırları duruyor). "You do not need Canva, …" → "You do not need an app or an account" (alıcı PDF'inde Canva adı geçmez).
  Düzen cilası: hızlı başlangıç başlığının altın çizgisi ile 1. rozet arasına 10 pt; ":" ile biten paragraf (ör. Step 3'ün "Use the
  buttons … (at the top on a computer):") tanıttığı listeden ayrı sayfaya düşmez. 01–49 yeni görünümle yeniden üretildi (13–14
  sayfa); 22–32 yeni temaların kapak görseli ve zarf açılışıyla. Not: paneldeki Help
  (`HelpSheet.tsx`) ve satış sitesi `/pricing` (`ExtraServices.tsx`) bu satırı hâlâ gösteriyor — ayrı iş.

---

## 6. Uygulama önerileri (G087'ye)

Biçim: **dosya** · mevcut metin → önerilen metin · gerekçe. Kod bu görevde değiştirilmedi (platform/ yazma alanı dışında).

### A. Admin paneli (G087)

- **A1. Şablonlar:** *[durum 2026-10-16: vardı (tek kaynak JSON + test, Copy) · G121: metin düzenlenebilir, kopyalama Geçmiş'e yazılır (şablon + zaman)]* §4.5 JSON'u (`<!-- g091:templates:start -->` … `end`) tek kaynak olarak okunsun ya da derleme anında
  `lib/admin/templates.ts`'e kopyalansın (test: bu belgeyle aynı). Liste: `title`, `when` görünür; seçilince siteden yer tutucular
  dolar, metin düzenlenebilir kutuda, "Copy message" düğmesi (Etsy'ye yapıştırmak için). Gönderim kaydı site günlüğüne (şablon
  `id` + zaman; metin değil).
- **A2. Eylem + mesaj birleşik:** *[durum 2026-10-16: vardı (G087)]* "Confirm order" (verify-order) bitince `order_confirmed`'ı hazır açsın; "New edit link"
  (reissue) bitince `new_edit_link`'i `{edit_url}` ile **yalnız o ekranda** göstersin (sayfa kapanınca kaybolur; kaydedilmez);
  "Add name/date change" (grant) bitince `extra_change_granted`'ı `{changes_left}` ile açsın.
- **A3. Güvenlik ağı:** *[durum 2026-10-16: vardı (G087) · G121: denetim düzenlenmiş metinde de]* metinde çözülmemiş `{…}` ya da `[…]` (karar bekleyen politika) varsa "Copy message" uyarı versin.
  `{edit_url}` `new_edit_link` dışındaki şablonda hiç çözülmesin.
- **A4. Sipariş görünümü:** *[durum 2026-10-16: vardı (Yapılacak süzgeci; 5 günden uzun yayınlanmamış satış Yapılacaklar'da) · G121: numara aramasında "bu numarayla site yok" ipucu]* bekleyen siparişler listesi (orderCheck `pending`, oluşturma zamanı, tema, e-posta, isimler) ve
  "3 gündür yayınlanmadı / hiç başlatılmadı" filtreleri (`start_link_reminder` için; Etsy siparişleri API'siz bilinmediğinden
  "hiç başlatılmadı" yalnız dükkânın girdiği numarayla aranır).
- **A5. Arşiv yaklaşanlar:** *[durum 2026-10-16: vardı (Özet Yapılacaklar "kapanıyor") · G121: site sayfası `archive_notice` ile açılır]* Online until ≤ 30 gün olan yayındaki siteler → `archive_notice`.
- **A6. Eksik araçlar (karar + kod):** *[durum 2026-10-16: kısmen G121: silme sipariş numarasını serbest bırakır (yazıldı) + taslakta "yanlış tasarım" ipucu (sil → Yeni sipariş); tasarım değiştirme aracı ve (b) numara taşıma karar bekliyor (`[DESIGN SWITCH POLICY]`)]* (a) yanlış tasarımla başlatılmış ve **yayınlanmamış** taslağın temasını değiştirme ya da
  taslağı silip sipariş numarasını serbest bırakma; (b) sipariş numarası başkası tarafından alınmışsa taşıma. Bugün yalnız
  reissue var; `wrong_design_started` ve `order_already_used` bu yüzden politika yer tutucusu taşıyor.

### B. `/start` (`platform/app/start/StartForm.tsx`)

- **B1 (öneri 4).** *[durum 2026-10-16: vardı]* Sonuç ekranı, "Save this link" kutusunun altına bir satır: (yok) → "You can copy this link again later
  in your editor: Share → Your private edit link." — gerekçe: "tek şans" paniğini azaltır; davranış zaten var.
- **B2.** *[durum 2026-10-16: yapıldı (G121)]* `Open my editor` altındaki `small` metne ek (yok) → "Tip: once your editor is open, add it to your Home Screen."
- **B3 (öneri 5).** *[durum 2026-10-16: vardı]* "Start another website" düğmesi → "Start with a different order" ve altına küçük satır "One order starts one
  website." — gerekçe: mevcut ad "bir siparişle ikinci site" sanılıyor.
- **B4 (öneri 6).** *[durum 2026-10-16: vardı]* Form kartının altına (yok) → "Need help? Message us on Etsy with your order number." — gerekçe: sayfada
  yardım yolu yok.
- **B5.** *[durum 2026-10-16: değişiklik yok]* `order_used` mesajı iyi; ek öneri yok.

### C. Panel metinleri

- **C1.** *[durum 2026-10-16: yapıldı (G121)]* `components/panel/views.tsx` HelpSheet "Can my partner edit too?": "Yes: share your edit link with your partner (Share →
  Your edit link)." → "Yes: share your edit link with your partner (Share → Your private edit link → Copy edit link)." —
  gerekçe: bölümün gerçek adı "Your private edit link".
- **C2.** *[durum 2026-10-16: vardı (başlık "Do guests see my changes right away?" korundu, ek cümle var)]* HelpSheet'e üç bölüm daha (başlık → metin):
  - "I lost my edit link" → "While this page is open, copy it again: Share → Your private edit link → Copy edit link. If it is
    lost, message us on Etsy with your order number. A new link replaces the old one."
  - "Why can't guests see my changes?" (mevcut "Do guests see my changes right away?" yerine aynı metin + ) "When you see
    “Unpublished changes”, tap Review, then Publish changes."
  - "Can guests change their reply?" → "Yes: they send another reply. You see both under Guests and can remove the old one."
- **C3 (öneri 7).** *[durum 2026-10-17: süre K48'de "usually within 24 hours"; START HERE (G154) bunu yazıyor, panel metni
  (`OrderPendingNote` / `ORDER_PENDING_TEXT`) G154'ün kapsamı dışında]* *[durum 2026-10-16: kısmen: `ORDER_PENDING_TEXT`'te vardı; G121 `OrderPendingNote`'a "Reload this page to check."; süre `[ORDER CHECK TIME]` karar bekliyor]* `components/panel/Setup.tsx` `OrderPendingNote` ve `lib/panel/brand.ts` `ORDER_PENDING_TEXT`: "…you can
  publish as soon as the order is confirmed." → "…you can publish as soon as the order is confirmed (usually within [ORDER CHECK
  TIME]). Reload this page to check." — gerekçe: onay alıcıya bildirilmiyor; süre karar gelince config'ten.
- **C4.** *[durum 2026-10-16: vardı]* `components/panel/Panel.tsx` "This edit link no longer works" metni: "The link may have been replaced with a new one. If
  you did not change it, message … on Etsy with your order number." → "The link may have been replaced with a new one, or it was
  copied only in part. If we sent you a new link, use the newest one. Otherwise message us on Etsy with your order number." —
  gerekçe: kısmi kopyalama en sık neden olabilir; ikinci istek sonrası eski linkle girme.
- **C5.** *[durum 2026-10-16: vardı]* `GuestPassword.tsx` ipucu: "Add the password to your invitation message, so your guests can open your website." →
  ek cümle "Guests type it once; their browser remembers it." — gerekçe: misafir her açışta soracak mı endişesi (90 gün çerez,
  `lib/site/access.ts`).
- **C6.** *[durum 2026-10-16: Help'te vardı · G121: Guests boş durumunda da]* Guests boş durumu / Home yanıt kartı: e-posta bildirimi olmadığı açıkça söylensin: (yok) → "New replies show here.
  We don't send email notifications yet." (yalnız ilk açılışta ya da Help'te).

### D. Satış sitesi (`lib/marketing/*`)

- **D1 (öneri 3).** *[durum 2026-10-16: NOT_INCLUDED ve EDITABLE vardı · G121: Canva karşılaştırmasında "you change the content and the wording"]* `lib/marketing/facts.ts` `NOT_INCLUDED`: "Languages other than English" → "A translated website: built-in
  messages (reply form errors, calendar text) stay in English; you can write your own texts and headings in any language" —
  gerekçe: G068 sonrası başlıklar değişiyor; madde artık yanıltıcı. `EDITABLE`'a "The design's headings, labels and buttons, in
  your own words" eklenmeli; `canvaComparison` "Changing the design" satırı da "you change the content and the wording".
- **D2.** *[durum 2026-10-16: vardı]* `lib/marketing/faq.ts` `take-offline`: "Tap Unpublish in your panel…" → "Open Share in your panel and tap Take the
  website offline…" — gerekçe: panelde "Unpublish" adlı düğme yok.
- **D3.** *[durum 2026-10-16: vardı]* `faq.ts` `what-can-i-change`: sona "…and the design's headings and labels in your own words." eklenmeli.
- **D4.** *[durum 2026-10-17, G154: K48 — cevap artık G146 akışı ("You do not need it to get back in." + `policies.lostLink`:
  /my'da sipariş no + e-posta); yer tutucu ve "we send a new link" kalktı]* *[durum 2026-10-16: vardı]* `faq.ts` `lost-link`: `[LOST LINK POLICY]`'nin önüne davranış: "While your editor is open you can copy the link again
  under Share. If it is lost, message us on Etsy with your order number: we send a new link and the old one stops working."
- **D5.** *[durum 2026-10-17, G154: K48 — "Longer hosting: …" yerine `policies.extension` tam cümle: "Need it online longer?
  Message us on Etsy before your “Online until” date and we can extend it."]* *[durum 2026-10-16: vardı]* `app/(marketing)/how-it-works/page.tsx` "After the wedding": "After that: [EXTENSION POLICY]." → "After that your website
  closes for guests; you can still see your content and download your replies. Longer hosting: [EXTENSION POLICY]." (`ARCHIVE_TEXT`
  ile aynı).
- **D6.** *[durum 2026-10-16: karar bekliyor (alan adı; Ek A'nın web uyarlaması claude-metin işi)]* `/help` (docs/14 §5.1 "ileride"): START HERE'in Ek A metni `/help` altında yayınlansın (tasarımsız, tek sayfa,
  `noindex` değil); START HERE ve şablonlar "full guide: [DOMAIN]/help" diyebilir. Alan adı kararıyla birlikte.

---

## 7. Açık kalanlar

**Karar bekleyen (kullanıcı):** ~~destek yanıt süresi~~ (2026-10-15: 24 saat; dükkân adı ve e-posta K33), ~~Etsy dükkân linki~~
(K48: `https://www.etsy.com/shop/STUDIOBKE`), ~~fiyat~~ (K42: 1.460 TL), ~~iade politikası~~ (2026-10-15: iade yok, "çalışmazsa düzeltiriz"; docs/20 §4), ~~kayıp link
politikası~~ (K48: `/my` akışı), ~~sipariş onay süresi~~ (K48: "usually within 24 hours"), erteleme politikası (`[POSTPONEMENT POLICY]`; docs/16 §15 öneri:
ertelemede 1 hak), yanlış tasarım politikası (`[DESIGN SWITCH POLICY]`), ~~uzatma~~ (K48: Online until'dan önce Etsy'den istenir,
ücret sözü yok), ~~silme süreci~~ (K48: Etsy'den sipariş no ile, 30 gün içinde; arşivden 12 ay sonra silinir), 48 aylık tavan (kodda
açık, karar yok), **alan adı ve barındırma planı** (K48'de de açık). K48 değerleri G154'te START HERE'e, ilanlara ve satış sitesine
girdi; §4.5 şablonları (admin kopyası `platform/lib/admin/message-templates.json` ile birlikte) G155'te.

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

**Tek kaynak, tek komut (G122):** 20 tasarımın `START_HERE.md` + `START_HERE.pdf` + başlat QR'ı bu metinden üretilir:
`python3 tools/build_customer_guides.py` (hepsi; `--designs 06-20` seçim, `--check` yalnız denetim). Kopyalar elle düzeltilmez:
metni burada değiştir, komutu yeniden koş. Yer tutucular (araç doldurur; doldurulmamış `{…}` kalırsa durur):

| Yer tutucu | Değer | Kaynak |
|---|---|---|
| `{DESIGN_NAME}` | Tasarımın adı ("Olive & Ivory") | `platform/themes/<id>/theme.json` `name` (= `/start`'taki "Design: …") |
| `{START_URL}` | `https://bkestudio.com/start?theme=<id>` | `--base-url` / `GUIDE_BASE_URL`; rota `platform/app/start/page.tsx` |
| `{PRIVACY_URL}` | `https://bkestudio.com/privacy` | aynı taban; rota `platform/app/(marketing)/privacy/page.tsx` |
| `{TERMS_URL}` | `https://bkestudio.com/terms` | aynı taban; rota `platform/app/(marketing)/terms/page.tsx` (G961, kullanım koşulları; 2026-10-23 inceleme: satın alma yolundan link) |
| `{MY_URL}` | `https://bkestudio.com/my` | G148: aynı taban; rota `platform/app/my/page.tsx` (satış sitesinin "Create your website" düğmesi; sipariş no + e-posta → editör, G146/K46) |
| `{OPENING}` | Misafirin ilk dokunduğu nesne: `envelope`; 06 ve 14 `gatefold`, 09 `pouch`, 12 `wallet`, 13 `book`, 18 `sleeve` | `platform/lib/marketing/designs.ts` `opening` ("Your guests tap the …") |
| `{OPENING_TAB}` | Aynı kelime büyük harfle: panelin ilk önizleme sekmesi (`Envelope`, `Gatefold`, `Pouch`, `Wallet`, `Book`, `Sleeve`) | G121: `platform/lib/panel/model.ts` `openingTabLabel` (aynı `designs.ts` cümlesinden) |
| `{LANGUAGE_FONTS}` | Tasarım fontlarının dil kapsamı (3 cümleden biri, aşağıda) | `designs.ts` `fonts` + aracın `FONT_SUBSETS` tablosu (Google Fonts CSS, 2026-10-16) |

`{LANGUAGE_FONTS}`: bütün fontlar latin-ext + Kiril (01, 03, 19) → "Accented Latin letters and Cyrillic use the design's fonts;
other alphabets show in a plain standard font." · hepsi latin-ext, en az biri Kiril'siz (02, 05, 07–10, 12, 14–17, 20) → "Accented
Latin letters use the design's fonts; Cyrillic and other alphabets show in a plain standard font in some or all places." · en az
bir font yalnız `latin` (04, 06, 11, 13, 18) → "Western European accents (such as é, ñ and ü) use the design's fonts; some other
accented letters (for example in Polish, Czech or Turkish) and other alphabets show in a simpler fallback font." (İlanlardaki
"ł, ő, ş" örnekleri PDF'in standart Helvetica'sında basılamadığı için rehberde dil adlarıyla yazıldı.)

Panel etiketleri (kalın) kaynak koddan birebir: `--check` her kalın etiketi `platform/components/panel`, `platform/app/start`,
`platform/lib/{panel,claim,theme,audio,rsvp}`, `lib/maps.ts` ve misafir betikleri `public/audio/audio.js` + `public/static/map.js`
içinde arar, bulamazsa hata verir (G121 gibi panel değişikliklerinden sonra önce bu denetim).
Biçim aracın desteklediği öğelerle sınırlı (başlık, paragraf, `- ` madde, numaralı satır, 2 sütunlu tablo, `![…](…)` = QR,
`**kalın**`, link, G148'den beri `> ` satırları = tek çerçeveli kutu; yalnız kalın satır kutunun başlığı). Değişiklik geçmişi: G091 (ilk metin), G100 entegrasyonu (Sample satırı, yayın ekranı), **G122** (kurulum 1. adım
yalnız adlar + tarih, yayın sonrası "Your website is live" ekranı, Guests'in Guest list / Results görünümleri, Held yanıtlar,
önizleme sekmeleri, `{OPENING}` ve `{LANGUAGE_FONTS}`, Home → Help & questions), **G121 uyarlaması** (kurulum 2. adımda
"More photos" yok → Edit → Photos; Skip for now düğmesi; önizleme sekmesi `{OPENING_TAB}`; Home'da Settings kartı; "Saved";
Review'da göz düğmesi; Share'de QR katlı bölüm), **G131** (Map and directions, Music and sound, Reply form, Download Excel /
CSV, Google Sheets ve "coming soon" hâli, Quick answers'ta müzik "Yes", iki sorun giderme satırı, Help'te G130 ek hizmet satırı;
Edit tablosunda Day & place / Our Story / RSVP satırları), **G148** (G146/K46 erişimi: "Save your edit link: it is your key"
bölümü kalktı → **Come back on any device** + "Continue on another device" kutusu (`{MY_URL}` + aynı sipariş no + e-posta, /my'ın
etiketleri "Open or start your website", "Continue"); ilk 5 adımda sipariş numarasının yeri (Etsy → You → Purchases and reviews,
onay e-postasında "Order #…"); düzenleme linki "kısayol"; Share → Use on another device / Sign out other devices; e-posta alanı
"we do not send emails yet" demiyor (SMTP açılınca da doğru kalsın) ve e-posta vaat etmiyor; ortak düzenleme, bilgisayar/çok cihaz
cevabı; sorun gidermede "This edit link no longer works" → **Continue with your order number**, "This order already has a website"
→ `{MY_URL}`, yeni "My order number and email do not open my editor"), **G154** (G090 QA + K48: "We are confirming your Etsy
order" bölümü "usually within 24 hours" + sayfayı yenile; **Languages** bölümü (G144: Edit → Us → Languages, Main language, Also
show my website in, Translate automatically + MyMemory notu, Approve / Approve all, Language of this editor); Share'de **Downloads**
(G139: site PDF'i, 5 × 7 in / A5 basılabilir davetiye, arka yüz, taşma payı, kesim işaretleri; etiketler `lib/print/labels.ts`'ten
denetlenir); Guests'te "Email me when a guest replies" yalnız panel sunuyorsa (G152; "we do not send email notifications yet"
kalktı); süre bölümünde uzatma (Online until'dan önce Etsy'den yazın, ücret sözü yok) ve 12 ay arşiv sonrası silme; Help'te 30
günde silme; Quick answers'ta dil (5 dil) ve basılı davetiye ("No" yerine Share → Downloads); s. 1'de başlat adresi QR'ın altında
düz metin olarak da yazılı (G090 P2-04)).

<!-- g091:start-here:start -->
````markdown
# Start Here: Your {DESIGN_NAME} Wedding Website

Thank you for choosing BKE Studio. This guide takes you from this PDF to a live wedding website that your guests open on their phones. Keep this file: it is the only one you need.

## Good to know before you begin

- You do not need an app or an account. Everything works in the web browser of your phone or computer.
- Your Etsy order number and your email address are your way in: they open your editor on any phone or computer. There is no password.
- You fill in your website yourself, in a simple editor. Every change saves by itself.
- Nobody sees your website until you publish it, and you can keep changing it after you publish.
- Your guests need no app and no account either: they open your link and tap the {OPENING}.

## Start now: the first 5 steps

1. Open your start link: [Start your {DESIGN_NAME} website]({START_URL}). Or scan this QR code with your phone camera.

![QR code of your start link](img/start_qr_page.png)

Link and QR code not working? Type this address into your browser: [{START_URL}]({START_URL})

2. Find your Etsy order number: on Etsy, go to You → Purchases and reviews, or look for "Order #…" in your Etsy confirmation email.
3. Enter your Etsy order number, your email address and your first names. Check the website address, then tap **Create my website**.
4. Tap **Copy link** to keep your private edit link as a shortcut, then tap **Open my editor**. Add your first names and your wedding date (setup step 1 of 3).
5. Add one photo (step 2 of 3). Publish now (step 3 of 3), or later when everything is ready.

## Come back on any device

There is no account and no password. Your Etsy order number and the email address you entered on the start page open your editor again, on this phone or on any other phone or computer:

> **Continue on another device**
>
> 1. Open [{MY_URL}]({MY_URL}), or tap **Create your website** on our website.
> 2. Under **Open or start your website**, enter the same **Etsy order number** and **Email address**, then tap **Continue**.
> 3. Your editor opens where you left off: every change is saved online.

Your private edit link is a shortcut to the same editor. Tap **Copy link** and paste it into your notes app, or tap **Email it to myself** (your own email app opens with the link inside; tap Send). Once your editor is open, you can also add it to your phone's Home Screen. Copy the link again any time under **Share → Your private edit link → Copy edit link**.

In your editor, **Share → Use on another device** shows this address with a QR code to scan with your other phone, the devices signed in with your order number, and **Sign out other devices**.

Anyone who has your edit link, or your order number together with your email, can change your website: share them only with your partner. We will never ask you for your edit link.

## Step 1. Start your website

Open the start link. At the top you see a small live demo of your design (**Open the full demo** shows it full size). Below it, fill in **Your details**:

- **Etsy order number:** on Etsy under You → Purchases and reviews, or "Order #…" in your Etsy confirmation email. It has 8 to 12 digits. You can type it with or without "#".
- **Email address:** we keep it with your website. Together with your order number it opens your editor on any phone or computer, so use one you will remember.
- **Your first names:** as your guests know you. You can change them later in the editor.
- **Website address:** made from your names, for example …/avery-and-jordan. "Available" means it is free. You can change it here, but **not later**, so check the spelling.

Tap **Create my website**. Each design you bought starts one website. Your website starts as a private draft: nobody can see it until you publish.

If your connection drops, tap **Create my website** again: you get your link back. If your order already has a website and you enter the email you started with, the page shows it with **Open it**. Bought two designs in this order, or the same design twice? Open the start link of the other design (or this link again) with the same order number and email, and start your second website there. With another email it says "This order already has a website": see Troubleshooting.

## Step 2. Set up in three steps

The editor starts with a short setup. The bar at the top shows **Step 1 of 3**. On steps 1 and 2, **Skip for now** sits next to **Continue**; **Save & exit** works at any time. Everything is saved.

1. **Your names and date.** Your two first names, then the wedding date and the ceremony time. The **Time zone of the wedding** comes from your phone; tap **Change** if the wedding is in another time zone. **Full names for the invitation card** are optional. One line says how often you can change your names or date after you publish; **Learn more** explains what is always free.
2. **Add your photo.** One photo is enough to start: it opens your website. The editor tells you how many more photo places your design has; add them any time under **Edit → Photos**. Until then guests see a soft placeholder image.
3. **Publish your website.** Check the summary and the preview, read **Good to know before you publish**, then tap **Publish my website**. Or come back later: Home shows how ready your website is.

How your names appear, the monogram (if your design shows one) and the date style (Month first or Day first) are not part of the setup: you find them later under **Edit**.

If your date is still the design's sample date, the editor asks you to set your real date first.

When your website is live, **Your website is live** shows your link with **Copy link**, **Open website** and, on a phone, **Share**. The QR code for printed cards is under **More ways to share**. **Next, if you like** suggests a few optional next steps, and **Go to my editor** takes you to Home.

## If your editor says "We are confirming your Etsy order"

Your order has to be confirmed in our Etsy shop before your website can go live. You can set up everything now; it is all saved. **Publish** opens as soon as your order is confirmed, usually within 24 hours. Reload your editor page to check. If it takes longer, message us on Etsy with your order number.

## Step 3. Edit your website

Use the buttons at the bottom of the screen (at the top on a computer):

- **Home:** your website's status and link, how ready it is, the next things to do, new replies and your dates (Wedding, Replies close, Online until). Under **Settings** you see your time zone, date style, name and date changes left and guest password; tap a row to change it.
- **Edit:** six pages with everything on your website.
- **Guests:** your guests' replies.
- **Share:** your link, QR code, guest password, downloads (your website as a PDF and a printable invitation), your private edit link and how to open your editor on another device.

| Edit page | What you change |
|---|---|
| Us | First names, full names for the invitation card, how your names appear, monogram (if your design shows one), the languages of your website |
| Day & place | Date and ceremony time (time zone, date style and countdown under More options); venue, address, map link, map and directions, a reception place and venue photo; the order of the day (up to 10 rows); After the wedding |
| Photos | Invitation portrait, three story photos and the venue photo |
| Our Story | Show or hide the page, an intro line, a caption for each story moment, music and sound effects |
| Details | Host line, dress code, travel & stay and registry links, guest policy note (in some designs), up to 12 questions and answers |
| RSVP | Replies on or off, reply-by date, the reply form: which fields are required and up to 10 questions of your own |

**Your own wording.** At the end of every Edit page, open **Headings & labels on this page**. There you can rewrite the design's texts in your own words, for example "You are invited", "Will You Join Us?" or the menu. Leave a box empty to keep the design's text; **Reset to design text** brings it back. On **Us** you can also pick suggested wording for a vow renewal, an elopement party or a commitment ceremony. Wording changes never use a name or date change.

**What stays as designed:** the artwork, colors, fonts, page layout and the {OPENING} animation.

**Sample text.** Boxes that still hold the design's sample text look faded (in italics, with a dashed border), and the top of the page says how many are left, for example "3 fields still show sample text". Tap **Go to the first one** and type your own text before you share your website. Home lists what is left.

**Saving.** There is no Save button: every change saves as you type. **Saved** shows for a moment at the top, then a small cloud icon stays. If you are offline, your changes are kept on this phone and saved when you are back online; wait until it says saved before you close the page. If the editor says your website was changed on another device, reload the page to get the latest version.

## Step 4. Add and crop photos

Open **Edit → Photos**, choose a frame and tap **Add photo**. Drag to move the photo, zoom with the slider or two fingers, then tap **Use this photo**. Each frame has its own shape. You can replace or remove a photo any time.

JPG, PNG, WebP, AVIF and HEIC photos up to 30 MB work. If a photo will not open, save a JPEG copy of it and choose that.

No photos yet? Your website still works: empty frames show the design's soft placeholder image, and you can hide the Our Story page. Add your own photos before you share if you do not want guests to see placeholders.

## Map and directions

Open **Edit → Day & place → Venue**. Type the street address, or paste a Google Maps or Apple Maps link to the place into **Map link**. Below it, **Map & directions** has two switches:

- **Show map:** guests see a card with the place and tap **Show map** to load Google Maps. Nothing loads from Google before that tap.
- **Show directions:** guests get directions with Google Maps, Apple Maps or Waze.

The editor shows what guests' maps will find (the pin of your link, or your address); tap **Preview map** to check it. Is the reception somewhere else? Tap **Add a reception place** and add its name, address and map link: guests then see both places. **Remove this place** takes it away again.

## Music and sound

Open **Edit → Our Story** and scroll to **Music & sound** at the end of the page.

- **Story music:** choose one of four tracks made for your website (**First Light**, **Garden Waltz**, **Evening Strings**, **Music Box**; one is marked as suggested for your design), **Your own music** or **No music**. Tap **Listen** to hear it.
- **Your own music:** tap **Choose a file** and upload an MP3 or M4A file of up to 10 MB. Only upload music you have the right to use (your own recording or a licence that allows it).
- **Sound effects:** soft sounds when guests open the {OPENING}, move between pages and send their reply. Turn it off for a quiet website.

Guests hear the music softly on your Our Story page (no Our Story page, no music). A small sound button at the top left of every page turns the sound off or on. Some phones wait for a tap before music starts: then guests see a "Play music" button.

## Languages

Your website can be in English, Spanish, French, German or Turkish, or in several of them. Open **Edit → Us → Languages**:

- **Main language:** the language you write your texts in. Guests see it first.
- **Also show my website in:** tick the other languages. Guests then get a small language button on every page.
- The design's headings, buttons, reply form and dates come translated for you.
- Your own texts (story, details, questions and answers, your own headings) are listed under each language. **Translate automatically** makes a first draft: with your browser's own translator if it has one, otherwise with the free MyMemory translation service (your texts are sent to it). Read each translation and correct it if needed, then tap **Approve** or **Approve all**. Guests see a translation only after you approve it; until then they see your main language.
- **Language of this editor** changes the language of the editor itself.

Machine translation is only a first draft: if you can, ask someone who speaks the language to read it.

## Step 5. Preview and publish

Tap the eye icon at the top to preview your pages: **{OPENING_TAB}**, **Home**, **Story**, **Details** and **RSVP**. **{OPENING_TAB}** is the opening page, where guests tap the {OPENING}. The X at the top closes the preview. On a computer the preview stays on the right.

**First publish:** tap **Publish**. **Before you publish** lists anything guests would still see from the design (sample text, photo places without a photo, sections without a link). Tap an item to fix it, or tap **Publish my website** and fix it later. Then **Your website is live** shows your link with **Copy link**, **Open website** and, on a phone, **Share**; the QR code is under **More ways to share**. You find both again under **Share** at any time.

**After that:** your changes save to a draft, and guests see the last version you published. When you change something, a bar shows **Unpublished changes**. Tap **Review** to see which pages changed (the eye next to a page previews it), then **Publish changes** (or tap **Publish** in the bar).

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
- **QR code for printed cards** (shown once your website is live): tap it to open, then **Download PNG** or **Download SVG**. Scan it once with your phone camera before you print.
- Your website is not listed on Google. Only people with your link or QR code can open it.

**Guest password** (optional). Open **Guest password** and turn on **Password protect your website**. Type a password of 4 to 40 characters (capital letters do not matter) or tap **Suggest a password**, then **Turn on password**. Use **Copy password** to send it with your link. It is one shared password for all guests, not a login for each person. Guests type it once; their browser remembers it. If you change it, guests are asked for the new one. Turned off, anyone with the link can open your website.

**Downloads** (in **Share**):

- **Download website as PDF:** every page of your website in your design, with a QR code to your link on the last page.
- **Printable invitation:** a classic invitation card in your design, with your names, date and venue. Choose **5 × 7 in** or **A5 (148 × 210 mm)**. **Add a back side with the details and a QR code** is ticked at first. For a print shop, tick **For a print shop: add bleed (1/8 in / 3 mm)** and then **Add crop marks**. Tap **Download printable invitation**.

Both use your latest saved changes, and making a PDF can take up to a minute. Publish your website first: the QR code opens it only once it is live. Print one copy and scan its QR code with your phone before you print them all.

**Take the website offline** (at the bottom of Share) hides your website from guests: they see "Page not found" until you publish again. Your text, photos and replies are kept.

## Step 7. Guest replies

**What guests do:** on your RSVP page they enter their name, whether they are coming, how many people (up to 10 in one reply), the names of the others (optional), a message and your questions. They need no account, and an email address is optional unless you make it required. To change their answer, they send another reply.

**Reply form.** In **Edit → RSVP**, the reply form shows what guests fill in. Their name and whether they are coming are **Always required**. Email and the message can be **Required** or **Optional**. Under **Your questions**, tap **Add a question** (up to 10, for example a meal choice) and pick the answer type: **Choices**, **Yes / No**, **Short answer**, **Long answer** or **Number**. Each question can be required or optional too. Guests who are coming answer your questions. Changing or removing a question later keeps the answers you already have.

**What you do:** open **Guests** (not Edit → RSVP, which changes the form). It has two views:

- **Guest list:** how many guests are coming and not coming, then every reply. Search by name, or tap **All**, **Coming**, **Not coming** or **New** to filter. Tap a reply to see everyone in it, their answers and their message.
- **Results:** how many replies say coming and not coming, and the answers to your questions, each with a number and a percentage. Tap a line to see who is in it.

In the Guest list you can also:

- **Download Excel** (at the bottom of the screen) to save every reply and a summary in one Excel file. It opens in Excel, Numbers and Google Sheets too. **Download CSV** saves a plain list, one row per person.
- **Add a reply** you got by phone or in person. On each reply, **Edit reply** corrects it and **Remove reply** deletes it.
- **Print list**, or save it as a PDF from your browser's print menu.
- **Refresh** to load new replies.

**Google Sheets** (optional): in **Guests**, tap **Connect Google Sheets** and allow access in Google. Your editor makes a spreadsheet in your own Google Drive and adds every new reply by itself; the columns follow your reply form. Google lets it see only the files it makes, nothing else in your Drive. **Open sheet** opens it, **Sync now** updates it at once, and **Disconnect** stops it (the spreadsheet stays in your Drive). If you see "Google Sheets: coming soon", this connection is not switched on yet: use **Download Excel** instead.

New replies show on Home and under **New**, where **Mark as seen** clears them. If **Guests** offers **Email me when a guest replies**, you can turn it on to get a short email for each new reply. Replies that arrive in an unusual rush go to **Held**: they are not counted until you tap **Keep this reply**.

Replies close at the end of your reply-by date, in your wedding's time zone. To close earlier, turn off **Accept replies on the website** in Edit → RSVP.

## Step 8. After the wedding

Open **Edit → Day & place → After the wedding** and choose a **Thank-you mode**:

- **Automatic:** your website becomes a thank-you page at midnight after your wedding day (wedding time zone).
- **On now:** it shows right after you publish.
- **Off:** keeps the invitation.

Add a title, a message and a photo if you like, preview it and publish. In thank-you mode, replies close and the countdown and calendar buttons disappear. Your replies stay in **Guests**. Under **The Day page**, choose **Keep it** (schedule and venue as a keepsake) or **Hide it**.

## How long your website stays online

Your website stays online until **12 months after your wedding date**. Home → Dates → **Online until** shows the exact day, and Home reminds you 30 days before. After that it closes for guests; in your editor you can still see your content and download your replies. Need it online longer? Message us on Etsy before your **Online until** date and we can extend it. 12 months after your website closes, we delete it with its photos and replies, so download your replies before then.

## Quick answers

**Can my partner edit too?** Yes. Give your partner your order number and email, or your edit link, and nobody else.

**Can I use a computer, or more than one phone?** Yes. On each one, open [{MY_URL}]({MY_URL}) and enter your order number and email. On a computer the preview stays beside the editor.

**Can I change the website address?** No, it is fixed when you create your website. Your own domain (yournames.com) is not included.

**Can I change colors or fonts?** No. You change the content and the wording; the design stays as made.

**Can it be in my language?** Yes, in English, Spanish, French, German or Turkish, or in several of them (see Languages above). Your own texts can be in any language; the design's built-in texts come in one of these five. {LANGUAGE_FONTS} Preview every page.

**How many guests can I invite?** As many as you like. One reply can include up to 10 people.

**Can guests see each other's replies?** No. Only you see them, in your private editor.

**Can I start a second website with my order?** Only for another design you bought in the same order: each design starts one website. If your order has two designs, or the same design twice, start one website for each with the same order number and email. One design cannot be used for two different events.

**Is there music?** Yes, if you like: soft music on your Our Story page (see Music and sound above). Choose **No music** to turn it off.

**Can I print invitations? Is there a save the date?** You print them yourself: **Share → Downloads** makes a printable invitation in your design (5 × 7 in or A5, with an optional back side, bleed and crop marks). We do not print or ship anything, and there is no separate save the date.

## Troubleshooting

**Guests cannot see my changes.** Tap **Review**, then **Publish changes**. Then reload your website.

**The Publish button does not work.** Check your internet connection. Then read the message near the button: your order may still be being confirmed, your date may still be the sample date, or a field needs fixing (the editor shows which one).

**"This edit link no longer works."** A new link may have replaced it, or only part of the link was copied. Tap **Continue with your order number** and enter your Etsy order number and email: your editor opens again.

**"This order already has a website."** Open [{MY_URL}]({MY_URL}) and enter your order number with the email you used when you started (your partner's, if they started it).

**My order number and email do not open my editor.** Check both: use the email you entered on the start page. Still stuck? Message us on Etsy with your order number.

**My photo will not upload.** Try a JPEG copy of the photo, and check your connection.

**The editor says I am offline or changes are not saved.** Wait until your connection is back and it says saved before you close the page.

**A guest cannot open my website.** Check that Home says your website is live, that the link is complete, and whether the guest password is on.

**The QR code does not scan.** Download it again from Share and print it larger, with white space around it. Always scan a printed proof before printing all cards.

**Guests hear no music.** Some phones wait for a tap: guests tap "Play music". Check that your Our Story page is shown and a track is chosen under **Music & sound**.

**Google Sheets says "Sync failed".** Tap **Sync now**. If it shows **Connect again**, tap it and allow access in Google again.

**The countdown or calendar time is wrong.** Check **Time zone of the wedding** in Edit → Day & place → **More options** (or tap **Time zone** under **Settings** on Home).

## Help and privacy

In your editor, **Help & questions** at the bottom of Home answers the most common questions.

Message BKE Studio on Etsy (in the conversation of your order), or write to **bkestudio01@gmail.com**. We reply within **24 hours**. Please include your order number, your website address, what you see (a screenshot helps) and your phone and browser. Never send your edit link: we never need it.

Your guests' replies are visible only in your private editor, not on your website. To have your website, its photos and your guests' replies deleted sooner, message us on Etsy with your order number: we delete them within 30 days. Privacy notice: [{PRIVACY_URL}]({PRIVACY_URL}). Terms of use: [{TERMS_URL}]({TERMS_URL}).

The design's sample names, dates, places and photos are fictional. Replace them before you share your website.
````
<!-- g091:start-here:end -->
