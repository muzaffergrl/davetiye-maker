# Ek hizmetler: "We set it up for you" ve özel tasarım (K42, G130, 2026-10-16)

Kullanıcı kararı K42 (2026-10-16, docs/01): alıcının yapacağı düzenlemeyi isteyene biz yaparız (**yaklaşık +500 TL, tek seferlik**;
yeni bir düzenleme turu = yeni satın alma) ve **özel tasarım** (mevcut şablon fiyatı + yaklaşık 1500 TL). İkisi Etsy'de **ayrı ilan**.
Fiyatı kura göre ajan ayarladı; **kullanıcı 2026-10-16'da onayladı** ve kalan kararları verdi: teslim **3 gün**, özel tasarımda
**2 revizyon**, sonrası **tur başı 500 TL**, özel tasarım **başkasına satılmaz**, stok **sınırsız**.

Dosyalar:
- İlanlar: `collections/_services/setup-service/package/listing/listing_v3.md` + `etsy_upload.json`,
  `collections/_services/custom-design/package/listing/listing_v3.md` + `etsy_upload.json`,
  `collections/_services/extra-revision/package/listing/listing_v3.md` + `etsy_upload.json` (`python3 tools/etsy_upload.py --designs services`).
- Satış sitesi: `/pricing` → "Extras" bölümü (`platform/components/marketing/ExtraServices.tsx`); fiyat ve Etsy linki
  `platform/lib/marketing/config.ts` `services` alanından. Link yer tutucuyken "Coming soon on Etsy"; fiyat (TRY) görünür.
- Panel: Help → "Need help?" altında tek satır "Prefer us to do it? …" (`platform/components/panel/views.tsx`).
- Admin mesajları: `setup_service_details`, `setup_service_done`, `custom_design_brief`, `custom_design_ready`, `custom_design_extra_round`
  (`platform/lib/admin/message-templates.json`; docs/19 §4.5'teki kopya aynı).

## 1. Fiyatlar (K49, kullanıcı onayı 2026-10-22; önceki 2026-10-16)

Kur: **1 USD = 49,55 TL** (CNBC-e serbest piyasa, 2026-10-19 16:05; alış 49,5474 / satış 49,5577). Dükkân para birimi TRY
(K38), Etsy'ye TL girilir. Gerekçe ve hesap: `docs/35_FIYAT_STRATEJISI.md` §3.2, §8b.

| Ürün | Fiyat (TL) | ≈ USD | Önceki (2026-10-16) | Durum |
|---|---|---|---|---|
| Tasarım (şablon), lansman — düz, üstü çizili yok | **1.190 TL** | 24.02 | 1.460 TL | onaylı (K49) |
| Tasarım, lansman sonrası (≈ 10 yorum): normal / ≤ 30 gün %40 indirim | 2.490 / 1.494 TL | 50.25 / 30.15 | — | onaylı plan (K49); zamanı gelince uygulanır |
| "We set it up for you" (kurulum, bir tur) | **990 TL** | 19.98 | 500 TL | onaylı (K49) |
| Özel tasarım (şablon dahil) | **4.490 TL** | 90.62 | 2.960 TL | onaylı (K49) |
| Tasarım + kurulum (iki ayrı satın alma) | 2.180 TL | 44.00 | 1.960 TL | bilgi |
| Ek tasarım revizyonu (2 turdan sonra, tur başı) | **690 TL** | 13.93 | 500 TL | onaylı (K49); ayrı ilan (§4.7) |

Hizmetlerde indirim yapılmaz (docs/35 §8b).

Adet: bütün ilanlarda **999** (Etsy'nin üst sınırı; kullanıcı: stok sınırı yok). Otomatik yenileme hâlâ açık.

Notlar:
- Yabancı alıcı fiyatı kendi para biriminde küsuratlı görür (Etsy çevirir). Kur değişince TL fiyat elle güncellenir; güncelleme
  sıklığı K49: ayda bir, yalnız indirim arasında (docs/35 §6).
- `config.ts` `currency: 'TRY'`; 21 tasarım `price: '1190'`, hizmetler `'990'` ve `'4490'` (K49). Satış sitesi "1,190 TRY" gösterir
  (Etsy dükkânının fiyatı; Etsy her alıcıya kendi para biriminde de gösterir). Gerçek Etsy linki girilen bir hizmetin fiyatı yer
  tutucuysa lansman build'i durur (`launchProblems`).

## 2. Ortak kurallar

- Hizmetler **Etsy üzerinden** satılır; site dışı ödeme, kupon, dış fiyat yok (docs/15 §4.1).
- İade yok (K36): ilanlarda "No returns, exchanges or cancellations once we have started", yerine "eşleşmiyorsa düzeltiriz".
- Yanıt 24 saat (K37). Sipariş gelince ilk mesaj **24 saat içinde** gider.
- Kararlar (2026-10-16): teslim **3 gün** (kurulum: her şey geldikten sonra; özel tasarım: ilk sürüm, cevaplar geldikten sonra),
  özel tasarımda **2 revizyon turu**, sonrası **tur başı 500 TL**, özel tasarım **münhasır**, adet **999**. Açık kalan tek ilan alanı
  `[AUTO RENEW]`. Admin, yer tutucu içeren mesajı kopyalatmaz (docs/19 §4.6).
- Alıcıdan **asla düzenleme linki istenmez** (docs/19 §4.5 kuralı). Linki dükkân üretir ve yalnız o siparişin Etsy konuşmasında gönderir.
- Etsy'nin hizmet ilanı kuralı **okunmadı**: Etsy saf hizmeti yasaklar, dijital bir ürünle sonuçlanan özel tasarım/kişiselleştirme
  genelde izinlidir. İlanlarda `[VERIFY]`; yayından önce güncel politika okunur.

## 3. "We set it up for you" — sipariş gelince dükkân ne yapar

Kapsam (bir tur): alıcının gönderdiği isim, tarih/saat/saat dilimi, mekân/adres, program, hikâye, SSS, dress code/seyahat/hediye
linkleri, en çok 5 fotoğraf (çerçevesine kırpılmış), RSVP son tarihi + en çok 3 soru, istediği başlık/etiket metinleri panelde girilir.
Metin **yazılmaz**, gönderilen girilir; tasarımın renk/font/düzeni değişmez. Yayınlama alıcıdadır.

1. **Etsy'de siparişi gör.** Kurulum siparişi tek başına gelmiş olabilir; alıcının bir tasarım siparişi var mı bak (aynı sepette ya da
   önceki sipariş). Yoksa alıcıya tasarım ilanını hatırlat (`general_help` ile).
2. **İlk mesaj (24 saat içinde):** `setup_service_details`. Admin'deki hazır mesajlar bir sitenin sayfasında; site henüz yoksa metin
   docs/19 §4.5 JSON'undan alınır. Mesaj 3 günlük teslimi söyler; süre, her şey geldiği andan başlar.
3. **Bilgiler gelince siteyi bul ya da aç** (admin `/admin`):
   - **Alıcı henüz başlamadıysa** (Siparişler'de tasarım sipariş numarasıyla site yok): **Yeni sipariş** → tasarım, **tasarımın**
     Etsy sipariş numarası, alıcının e-postası ve ilk isimleri, adres (slug). Çıkan düzenleme linki **yalnız o an** gösterilir:
     kopyala, panelde kullan.
   - **Alıcı başladıysa** (Özet'teki arama kutusu ya da Siparişler: sipariş no / isim / adres): sitenin sayfası → **Düzenle**
     (üst satır) ya da Destek işlemleri → **Linki değiştirmeden düzenle** (G145). Dükkânın kendi **72 saatlik** linkiyle editör
     yeni sekmede açılır; üstte Türkçe "Dükkân olarak düzenliyorsunuz" şeridi; Share'de "Your private edit link" görünmez (yanlışlıkla
     alıcıya gönderilmesin). **Alıcının linki aynen çalışır**, alıcı aynı anda panelde olsa bile kayıtları sürer. Yeniden açmak eski
     dükkân linkini kapatır; Özet'in Yapılacaklar'ı açık kalan dükkân linkini "Kapat" diye listeler.
   - Yalnız alıcı linkini kaybettiyse **Yeni düzenleme linki** (eski link çalışmaz olur; `setup_service_done` bunu söyler).
4. **Panelde gir:** düzenleme linkiyle editörü aç; alıcının bilgilerini Us · Day & place · Photos · Story · Details · RSVP
   bölümlerine gir; fotoğrafları paylaşım linkinden indirip yükle ve kırp. **Yayınlama** (alıcı kontrol edip yayınlar). Site zaten
   yayındaysa isim/tarih değişikliği alıcının 3 hakkından düşer; ilan bunu söylüyor.
5. **Not:** sitenin "Not" alanına `Kurulum hizmeti: <tarih>, Etsy #<kurulum sipariş no>, 1 tur` yaz (tur sayımı buradan).
6. **Mesaj:** dükkân linkiyle girdiyseniz **Dükkân linkini kapat** → şablon kendiliğinden **`setup_service_done_same_link`**
   (link içermez: "aynı linkinizle açın") → Kopyala → Etsy. "Yeni düzenleme linki"/"Yeni sipariş"ten sonra ise **`setup_service_done`**
   (yeni link ve site adresiyle dolar). Kopyalama Geçmiş'e yazılır.
7. **Sipariş onayı** (K34, `CLAIM_ORDER_VERIFICATION=manual` ise): tasarım siparişini kontrol edip onayla; yoksa alıcı yayınlayamaz.
8. **Ek tur isteği:** alıcı "şunu da değiştirin" derse, kendisi değiştirebileceğini söyle; bizim yapmamızı istiyorsa kurulum ilanını
   yeniden satın alır (K42). Bizim girişimizdeki hata (gönderilenle eşleşmeyen) ücretsiz düzeltilir.

## 4. Özel tasarım — sipariş gelince

Kapsam: platformumuzda bu çift için **yeni bir tema** (açılış nesnesi, sahne görselleri, renk, font) + şablonun içerdiği her şey
(editör, sayfalar, RSVP, QR, misafir şifresi, teşekkür sayfası, düğünden sonra 12 ay yayın). Fiyat şablonu içerir; ayrıca tasarım
alınmaz. İsim/foto/metni alıcı girer (ya da kurulum hizmeti alır).

1. **İlk mesaj (24 saat):** `custom_design_brief` — tarih, üslup, renkler, ilham görselleri, açılış nesnesi fikri. Mesaj 2 revizyon,
   tur başı 500 TL, 3 günde ilk sürüm ve münhasırlığı söyler.
   **Risk:** bir platform teması bugüne kadar her tasarımda ayrı bir görev aldı (GPT görselleri + tema + kontroller). 3 günde ilk
   sürüm, GPT ve tema işinin sipariş gelir gelmez başlamasını gerektirir; ilk siparişte süre ölçülmeli.
2. **Tasarım:** 20 tasarımın yolu (K21): GPT sahne tasarımı ve parçalar → platform teması (`platform/themes/<id>/`, G406–G420
   yöntemi) → tema kontrolleri. Görevi `gorevler/` altında açılır (GPT görsel + claude-kod tema). Rakip/başkasının tasarımı
   kopyalanmaz (şart 6); alıcının gönderdiği referanstan yalnız üslup alınır.
3. **Önizleme:** ilk sürüm alıcıya Etsy mesajında gösterilir (demo linki ya da ekran görüntüsü). 2 revizyon turu dahil; sayım sitenin notunda.
4. **Açma:** tema yalnız bu alıcı için açılır. Bugün `/start` temayı satış listesinden açıyor (`lib/themes/approval.ts`,
   `config.ts designs[]`): **satış sitesinde listelenmeden tek alıcıya açma yolu yok.** Seçenekler: (a) dükkân **Yeni sipariş** ile
   siteyi bu temadan açar (admin `adminCreatableThemes` da açık tema ister — doğrulanmalı), (b) "özel tema" bayrağı (listelenmez,
   yalnız admin açar). Karar + iş: ayrı görev önerisi. O zamana dek `custom_design_ready` gönderilmez.
5. **Sonrası:** `custom_design_ready` (başlatma linki) ya da dükkân açtıysa `shop_created_site`. Not alanına
   `Özel tasarım: tema <id>, Etsy #<no>, revizyon n/2`.
6. **Münhasırlık (karar 2026-10-16):** özel tema **başkasına satılmaz**; satış listesine (`config.ts designs[]`) ve renk varyantı
   olarak da girmez. Görselleri başka tasarımda kullanılmaz.
7. **Ek revizyon (3. tur ve sonrası, 500 TL; karar 2026-10-16: ayrı ilan):** `collections/_services/extra-revision/package/listing/`
   ("Extra Design Revision …", 500 TL, 3 gün, adet 999). Yalnız özel tasarım alıcıları için; Etsy alıcıyı sınırlayamaz, ilan bunu
   açıkça söyler ve özel tasarım siparişi olmayan bir alıcının siparişinde önce ona yazılır. Akış: alıcı 3. tur isterse
   `custom_design_extra_round` → alıcı ilanı satın alır → Etsy'de siparişi gör → değişiklikleri tek mesajda al → 3 gün içinde
   güncel tasarım → sitenin notuna `revizyon 3` (4, 5 …). Özel tasarım ilanıyla birlikte yayınlanır.

## 5. Etsy mesaj şablonları (İngilizce; tek kaynak `platform/lib/admin/message-templates.json`)

| id | Ne zaman | Yer tutucu / karar |
|---|---|---|
| `setup_service_details` | Kurulum siparişinden hemen sonra | `{order}`, `{design}` |
| `setup_service_done` | Bilgiler girildikten sonra, taze linkle | `{names}`, `{design}`, `{edit_url}`, `{site_url}` |
| `setup_service_done_same_link` | Dükkân linkiyle girildikten sonra (alıcının linki değişmedi; G145) | `{names}`, `{design}`, `{site_url}` |
| `custom_design_brief` | Özel tasarım siparişinden hemen sonra | `{order}` |
| `custom_design_ready` | Özel tema /start'ta açılınca | `{start_url}`, `{order}` |
| `custom_design_extra_round` | 3. (ve sonraki) revizyon isteği / ek revizyon ilanı satın alınınca | — |

Admin'de Türkçe başlık + "ne zaman" metni `platform/lib/admin/messages.ts` `TITLES_TR`.

## 6. İlan görselleri ve teslim PDF'leri (G136, 2026-10-17)

Üç ilanın 4'er görseli `collections/_services/<id>/package/listing/images_editorial/` içinde (`tools/listing_services.py`; alt
metinler `listing_v3.md` §5): GM06 güven sahneleri (`brand/trust/` t1, t3, t6), yerel production build'den gerçek editör/site
ekranları ve hazır tasarımların açılışları ("from our ready designs" diye belirtilerek), S logo; fiyat, QR ve web adresi yok.
Etsy'nin teslim ettiği dosya: `package/customer/SETUP_SERVICE.pdf`, `CUSTOM_DESIGN.pdf`, `EXTRA_REVISION.pdf`
(`tools/build_service_guides.py`; "ne göndereceğiniz" listesi §5'teki ilk mesajlardan kelimesi kelimesine okunur, `--check` denetler).

## 7. Kullanıcı kararı bekleyenler

Karara bağlananlar (2026-10-16): fiyatlar (1.460 / 500 / 2.960 TL), teslim 3 gün, 2 revizyon + tur başı 500 TL, münhasırlık,
adet 999.

1. Özel temayı tek alıcıya açma yolu (§4.4) — geliştirme görevi önerisi; tasarım önerisi `gorevler/G145-panel-denetim.md`
   ("Karar bekleyenler"). "Linki değiştirmeden düzenle" G145'te yapıldı (§3.3).
2. Otomatik yenileme (bütün ilanlar gibi).
3. Etsy'nin hizmet ilanı politikası okunacak (`[VERIFY]`).
