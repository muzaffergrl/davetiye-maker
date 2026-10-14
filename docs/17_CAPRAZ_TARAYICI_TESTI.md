# Çapraz tarayıcı testi — canlı site (G063, 2026-10-14)

Yapan: local oturum `claude-local-1`, kullanıcının Windows 10 bilgisayarında. Adres: https://davetiye-platform-five.vercel.app
(production = main `59b1291`, platform ağacı `f9ff114cfa65`; G049). **Düzeltme yapılmadı** (görev kuralı); bulgular bulut ajanları içindir.

> **Gerçek iPhone / Android cihaz yok.** Telefon görünümleri tarayıcı emülasyonudur (ekran boyutu + piksel yoğunluğu + dokunma +
> mobil kimlik). iOS Safari (WebKit) Windows'ta çalışmadığı için **hiç test edilmedi**; Android Chrome'un kendi tarih seçicisi,
> klavyesi ve adres çubuğu davranışı da emülasyonla sınanamaz.

## 1. Yöntem

| | |
|---|---|
| Tarayıcılar | **Chrome 155.0.8059.40** (tekrar koşusu sırasında kendiliğinden 155.0.8059.41'e güncellendi), **Edge 155.0.4283.45** (kurulu), **Firefox 157.0.1** (bu test için `winget install Mozilla.Firefox`) |
| Sürücü | `puppeteer-core@25.12.0`; Chrome/Edge DevTools protokolüyle, Firefox WebDriver BiDi ile. Kurulu gerçek tarayıcı dosyaları, **başsız (headless)** kip; Firefox `.ics` indirmesi ayrıca görünür pencerede |
| Görünümler | masaüstü **1366×900** (DPR 1) · telefon **390×844** (DPR 3) · telefon **360×640** (DPR 3); telefonlarda `isMobile` + dokunma + mobil kullanıcı ajanı (Chrome/Edge: Android Chrome/EdgA; Firefox: Android Firefox). Firefox BiDi bu ayarları kabul etti |
| Dil / bölge | `en-US` (tarih alanı ay-gün-yıl sırası için) |
| Misafir yolculuğu | `/clara-and-julian`: zarf → dokun → açılış → home (aşağı kaydır) → takvime ekle (`.ics` + Google) → alt menüden story → details → RSVP → RSVP gönder (kurgu misafir "G063 …") |
| Alıcı yolculuğu | `/start?theme=olive-ivory` ve `?theme=blush-garden-rose`: sayfa + canlı demo çerçevesi + boş formda alan hataları; **gerçek gönderim 4 kombinasyonda** (Chrome masaüstü 01, Edge masaüstü 03, Firefox masaüstü 01, Firefox 390 03 — `/start` IP başına günde 5 site sınırı yüzünden). Gönderimde: test sipariş no (98…) + `g063-…@example.com` → düzenleme linki → panel. Diğer kombinasyonlarda panel aynı temanın tohumlanmış taslak sitesiyle açıldı |
| Panel | isimler (4 alan, otomatik kayıt), tarih (tarayıcının kendi tarih alanına klavyeyle `05202028`), RSVP son tarihi, fotoğraf (dosya seç → kırpma → onay), **Publish** (not ekranı → "Publish anyway") → "Your website is live" → link + **QR** (ekran görüntüsünden `jsqr` ile çözüldü) → yayındaki sayfada isim, 2028 ve fotoğraf |
| Kayıt | her adımda ekran görüntüsü; konsol hataları, JS hataları, başarısız ve 4xx/5xx istekler, yatay taşma, sayfa geçiş süreleri |
| Görsel inceleme | 9 grup (tarayıcı × görünüm) ekran görüntüsü ayrı ajanlarca tek tek açıldı → **60 aday**. Her aday ikinci bir ajanca, aynı adımın diğer tarayıcılardaki görüntüsü, kaynak kod ve gerekirse yeniden üretimle çürütülmeye çalışıldı → **12'si ayakta kaldı** (aynı kusurun farklı tarayıcı kayıtları birleşince §4 B4–B12), 45'i animasyon anı / test aracı / kusur değil diye elendi. 3 aday ağ kesintisi yüzünden ayrıca çürütülemedi; ikisi Chrome'daki karşılığıyla aynı (B4, B5), biri giriş animasyonu anı (Edge masaüstü RSVP kartı; Chrome'un aynı karesi animasyonun sonraki anını gösteriyor) |

## 2. Sonuç matrisi

Her hücre o kombinasyonun en son koşusu. `OK*` = yalnız test aracı kaynaklı adım(lar) başarısız (§5'te kanıtıyla; site sorunu değil).

| Tarayıcı | Görünüm | Misafir (zarf → RSVP → takvim) | /start 01 Olive | /start 03 Blush | Panel 01 Olive | Panel 03 Blush |
|---|---|---|---|---|---|---|
| Chrome | masaüstü | OK* 19/20 | OK 8/8 **(gerçek gönderim)** | OK 5/5 | OK 10/10 | OK 10/10 |
| Chrome | 390×844 | OK 20/20 | OK 5/5 | OK 5/5 | OK* 9/10 | OK* 9/10 |
| Chrome | 360×640 | OK* 19/20 | OK 5/5 | OK 5/5 | OK* 9/10 | OK* 9/10 |
| Edge | masaüstü | OK* 19/20 | OK 5/5 | OK 8/8 **(gerçek gönderim)** | OK 10/10 | OK 10/10 |
| Edge | 390×844 | OK* 19/20 | OK 5/5 | OK 5/5 | OK* 9/10 | OK* 9/10 |
| Edge | 360×640 | OK 20/20 (6 koşunun 4'ü; 2'sinde test aracının tıklaması menüye düştü, §5 + B3) | OK 5/5 | OK 5/5 | OK* 9/10 | OK* 9/10 |
| Firefox | masaüstü | OK* 19/20 | OK 8/8 **(gerçek gönderim)** | OK 5/5 | 9/10 — konsolda "Image corrupt or truncated" (**B2**) | OK 10/10 |
| Firefox | 390×844 | OK 20/20 | OK 5/5 | OK 8/8 **(gerçek gönderim)** | OK 10/10 | OK 10/10 |
| Firefox | 360×640 | OK 20/20 | OK 5/5 | OK 5/5 | OK 10/10 | OK 10/10 |

`OK*` hücrelerindeki tek başarısız adım: misafirde ".ics tıklaması dosya indirdi" (test aracının gizli bağlamı), panelde "QR çözülüyor"
(Chromium mobil emülasyonunda öğe görüntüsü) — ikisi de §5'te kanıtıyla test aracı kaynaklı. Ayrıca (§3): `.ics` indirmesi her tarayıcıda
gerçek indirmeyle, QR her görünümde tam ekran görüntüsünden doğrulandı. Gerçek gönderim olmayan /start hücrelerinde 5 adım: sayfa + tasarım adı,
canlı demo çerçevesi, yatay taşma yok, boş gönderimde alan hataları, JS hatası yok.

## 3. Sorunsuz doğrulananlar

- **Zarf ve açılış:** 9 kombinasyonun hepsinde zarfa dokununca açılış oynuyor ve `/home`'a geçiliyor (tıklamadan home'a 5,4–11 sn;
  ölçüm 3 tarayıcı aynı anda koşarken alındı, mutlak süre karşılaştırması değildir). JS hatası 0, yatay taşma 0.
- **Firefox'ta view transition yokken solma yolu:** Chrome ve Edge 155'te sayfalar arası view transition var (`onpageswap` + `startViewTransition`);
  Firefox 157'de yok → tema `arrive-fade` sınıfına geçiyor (`<html class="js from-envelope arrive-fade">`). Görüntülerde ara boş/beyaz kare yok;
  kart, menü ve isimler Chrome'un view transition'lı varışıyla aynı düzende geliyor (yalnız zamanlama farklı: 1,2. sn'de Firefox zarfı açmış,
  Chrome kurdeleyi çözüyor). Görüntü: `17_capraz_tarayici/firefox_solma_karsilastirma.jpg` (soldan: Firefox 390 açılış, Firefox 390 home,
  Chrome 390 açılış, Chrome 390 home, Firefox masaüstü açılış, Firefox masaüstü home).
- **Takvime ekle:** `Apple / Outlook` linki `/clara-and-julian/event.ics` → `200 text/calendar`, `attachment; filename="clara-and-julian.ics"`,
  içerik `BEGIN:VCALENDAR … BEGIN:VEVENT`. Gerçek tıklamayla dosya **iniyor ve sayfa yerinde kalıyor**: Chrome ve Edge (indirme olayları
  `willBegin → completed`), Firefox (görünür pencerede iki tıklama → `clara-and-julian.ics`, `clara-and-julian(1).ics`). `Google` linki
  `calendar.google.com/calendar/render?action=TEMPLATE`, başlık "Clara & Julian’s Wedding", `dates=20270515T200000Z/20270516T003000Z`
  (4:00 PM New York = 20:00 UTC), konum dolu, `target=_blank`.
- **Sayfalar:** story, details, RSVP alt menüden açılıyor, beklenen başlıklar görünüyor; tarayıcıda gerçek geçiş süresi ~1 sn (Firefox'ta
  doğrudan ölçüm: tıklamadan sonra yeni belge 0,1–0,5 sn içinde başlıyor, `load` 0,7–2,1 sn — masaüstü ve 390 telefon aynı).
- **RSVP:** form 9 kombinasyonda gönderildi, "teşekkür" paneli göründü (`data-rsvp-state="success"`). 360×640'ta form ekrana getirildiğinde
  (formun başı üstte) denetimlerin hiçbiri sabit alt menünün altında kalmıyor ve klavyeyle sırayla odaklanınca görünür kalıyor (3 tarayıcıda
  ölçüldü). Kaydırmanın ortasında menünün altına giren bir denetim için bkz. **B3**.
- **/start:** iki tema 9 kombinasyonda açılıyor ("Start your website", tasarım adı, canlı demo çerçevesi), boş gönderimde alan hataları
  (`aria-invalid`), `X-Frame-Options: DENY`. Gerçek gönderilen 4 sahiplenme `201` + düzenleme linki + "Open my editor"; adres ipucu "Available".
- **Panel:** 18 kombinasyonun hepsinde isim değişikliği (başlık "Testa & Probo", "All changes saved"), tarih, fotoğraf (kırpma ekranı →
  yerleşti), yayın ("Your website is live"), link = genel adres, QR'ın `data-qr-text`'i = genel adres; yayındaki sayfada yeni isimler, 2028
  ve yüklenen fotoğraf (`srcset` ile 640 px türevi). **QR ekran görüntülerinin 20'si de çözülüyor** (5 ölçeğin 4–5'inde).
- **Tarih alanı:** masaüstü Chrome/Edge ve Firefox'un 3 görünümünde klavyeyle yazılabiliyor. Chrome/Edge telefon emülasyonunda alan mobil
  biçime geçiyor (yazılamaz, gerçek telefonda kendi tarih seçicisi açılır) — emülasyon o seçiciyi açamadığı için değer test aracıyla verildi;
  **gerçek telefonda tarih seçici denenmedi**.

## 4. Bulgular

Her bulguda: önem, tarayıcı/sürüm, görünüm, adımlar, beklenen/gerçekleşen, ekran görüntüsü (`docs/17_capraz_tarayici/`).
**Engelleyici ya da orta önemde bulgu yok; hepsi düşük.** Sürümler: Chrome 155.0.8059.40, Edge 155.0.4283.45, Firefox 157.0.1.
"Kaynak" satırı düzeltecek ajana ipucudur; düzeltme yapılmadı.

| # | Kısa | Yer | Tarayıcı | Görünüm |
|---|---|---|---|---|
| B1 | favicon yok → konsolda 404 | /start, /edit | hepsi | hepsi |
| B2 | "Image corrupt or truncated" konsol uyarısı | panel | Firefox | masaüstü (1/6 koşu) |
| B3 | sabit alt menü altındaki denetim; odak onu menüden çıkarmıyor | 03 RSVP | hepsi | telefon |
| B4 | "The Day" başlığı tarih satırına biniyor | 03 details | hepsi | masaüstü |
| B5 | "The Venue" tek başına sol sütunda | 03 details | hepsi | ≥768 px |
| B6 | "The Day" kartı sağ kenarında 1 px basamak | 01 home | Chrome, Edge | bazı telefon genişlikleri |
| B7 | etkin RSVP hapı kısa, yazı aşağıda | 03 alt/üst menü | hepsi | hepsi |
| B8 | süs yaprakları RSVP formunun üstünden geçiyor | 03 RSVP | hepsi | telefon |
| B9 | site adresi harf ortasından bölünüyor | panel | hepsi | telefon |
| B10 | masaüstünde panel ilk anda telefon düzeninde | panel | hepsi | ≥960 px |
| B11 | "Save this link" kutusu linkin son satırını kesiyor | /start sonucu | hepsi (360 px) | telefon |
| B12 | isimlerin altında yazım denetimi çizgisi | panel | Firefox (kalıcı), Chrome/Edge (yazarken) | hepsi |

### B1 — /start ve /edit sayfalarında favicon yok
- **Önem:** düşük · **Tarayıcı:** Chrome, Edge, Firefox · **Görünüm:** hepsi
- **Adımlar:** `/start?theme=olive-ivory` (ya da panel `/edit/...`) aç, konsola bak.
- **Beklenen:** sekme simgesi, konsol temiz. **Gerçekleşen:** tarayıcı `/favicon.ico` ister → **404**, konsolda kaynak hatası; sekmede genel
  simge. Tema sayfalarında `<link rel="icon" href="/themes/<tema>/img/favicon.png">` var (tema motoru ekliyor), platform sayfalarında yok.
- **Kaynak:** `platform/app/` altında `favicon.ico` / `icon.*` yok, `app/layout.tsx`'te `icons` tanımı yok; `/favicon.ico` canlıda 404.
- **Görüntü:** `17_capraz_tarayici/b1_start_favicon_yok.jpg`

### B2 — Firefox panelinde "Image corrupt or truncated." konsol uyarısı (gözlem)
- **Önem:** düşük (görünür etkisi yok) · **Tarayıcı:** Firefox 157.0.1 · **Görünüm:** masaüstü, 6 panel koşusunun 1'inde
- **Adımlar:** panelde fotoğraf yükle → kırp → onayla; hemen ardından isim/tarih değiştir (otomatik kayıt).
- **Gerçekleşen:** otomatik kayıt önizleme iframe'ini yeniden yüklüyor; o sırada inmekte olan `-640w.jpg` isteği kesiliyor
  (`NS_BINDING_ABORTED`) ve Firefox bunu "Image corrupt or truncated" diye konsola yazıyor. Fotoğraf yerinde, yayındaki sitede doğru.
  Chrome/Edge koşularında bu uyarı görülmedi.
- **Görüntü:** `17_capraz_tarayici/b2_firefox_panel_foto.jpg`

### B3 — Telefonda sabit alt menü altındaki RSVP denetimi; odaklanınca menüden çıkmıyor
- **Önem:** düşük (iyileştirme) · **Tarayıcı:** hepsi (Edge ve Firefox'ta ölçüldü, Chrome'da sınırda) · **Görünüm:** 360×640 (390×844'te daha seyrek)
- **Adımlar:** `/clara-and-julian/rsvp` → formu doldururken sayfayı "Send reply" düğmesinin alt yarısı menünün (y=576–640) arkasında kalacak
  kadar kaydır. (a) Düğmenin görünmeyen alt yarısına dokun; (b) ya da bir üst alandan Tab ile menünün altındaki alana geç.
- **Beklenen:** odaklanan/dokunulan denetim menünün üstüne kaydırılır. **Gerçekleşen:** (a) düğme ortasındaki nokta menüdeki
  `/clara-and-julian/details` bağlantısına düşüyor (`elementFromPoint`, Edge ve Firefox'ta 2/2); menü yarı saydam (`rgba(…,0.82)` + blur)
  olduğu için düğme arkadan seçilebiliyor. (b) Tarayıcı alanı "zaten görünüm alanında" saydığı için kaydırmıyor; alan menünün altında
  kalıyor (Chrome 155 ve Firefox 157 aynı, yeniden üretildi). Gerçek kullanıcı çoğunlukla görünen üst yarıya dokunur; bu yüzden düşük.
  Test aracının Edge 360'ta iki koşuda /story'ye geçmesi aynı örtüşmenin sonucu, ama oradaki tıklama otomasyonundu (§5).
- **Kaynak:** `platform/themes/blush-garden-rose/site.css` → `scroll-padding-bottom` yok (değer `auto`); menü 64 px. Öneri: telefonda
  `html { scroll-padding-bottom: <menü yüksekliği + pay> }` ve formun altına ek boşluk.
- **Görüntü:** `17_capraz_tarayici/b3_edge360_dugme_menu_ortusmesi.jpg` (kırmızı: düğme ve ortası, mavi: menünün üst kenarı)

### B4 — Details: el yazısı "The Day" başlığı üstteki tarih satırına biniyor
- **Önem:** düşük · **Tarayıcı:** Chrome, Edge, Firefox (Chrome = Edge piksel düzeyinde) · **Görünüm:** masaüstü 1366×900
- **Adımlar:** `/clara-and-julian/details` aç, ~7 sn bekle (giriş animasyonu biter).
- **Beklenen:** "SATURDAY · MAY 15, 2027" satırı ile başlık arasında boşluk. **Gerçekleşen:** "h" harfinin üst halkası "SATURDAY"
  sözcüğünün "AY" harflerinin alt yarısını kesiyor; tarih okunuyor. Ölçüm: kicker 217–234 px, h1 kutusu 234 px'te başlıyor (boşluk 0);
  Great Vibes'ın uzun çıkıntısı satır kutusundan taşıyor, `write` animasyonunun bitiş `clip-path: inset(-30% -8%)` bunu kırpmıyor.
  Kalıcı (animasyon bitmiş, `.script.in.done`). Story sayfasındaki "Our Story" / "MOMENTS WE HOLD DEAR" adayı ise ölçümde ~1 px
  boşlukla kesişmiyor ve onaylı tasarım önizlemesiyle aynı → bulgu sayılmadı.
- **Kaynak:** `themes/blush-garden-rose/site.css` `.page-head h1` (satır 379, üst boşluk yok), `.script { line-height: 1.12 }` (satır 66).
- **Görüntü:** `17_capraz_tarayici/b4_details_baslik_cakisma.jpg` (2,5× büyütme; üst Chrome, alt Firefox)

### B5 — Details: "The Venue" bloğu masaüstünde tek başına sol sütunda, sağ taraf boş
- **Önem:** düşük · **Tarayıcı:** hepsi · **Görünüm:** ≥768 px (telefonda tek sütun, görünmez)
- **Adımlar:** `/clara-and-julian/details` → sayfanın altına kaydır.
- **Beklenen:** tek blok ortalı ya da tam genişlik. **Gerçekleşen:** "The Venue" (başlık, çerçeveli görsel, mekân satırları) x≈145–475'te,
  sağdaki ~850 px boş; üstteki takvim düğmeleri ve alttaki RSVP düğmesi ortalı olduğu için dengesiz duruyor. Nedeni: `.blocks` ızgarası
  3 sütun, demo veride `urls.accommodation` ve `urls.registry` boş olduğundan "Travel & Stay" ve "Registry" blokları sunucuda kaldırılıyor,
  kalan tek blok ilk hücreye oturuyor. Link alanlarını boş bırakan her alıcının sitesinde aynı.
- **Kaynak:** `themes/blush-garden-rose/site.css:614` `.blocks { grid-template-columns: repeat(3, 1fr) }` (blok sayısına göre değil).
- **Görüntü:** `17_capraz_tarayici/b5_details_mekan_sola_yasli.jpg` (Chrome; kesikli kutu = boş hücreler)

### B6 — Olive & Ivory: "The Day" kartının sağ kenarında basamak (Chromium)
- **Önem:** düşük · **Tarayıcı:** **Chrome ve Edge** (Firefox'ta yok) · **Görünüm:** 390×844 ve bazı başka telefon genişlikleri
- **Adımlar:** Olive & Ivory yayındaki site → home → "PULL UP A CHAIR" bölümüne kaydır, ortadaki "The Day" kartının sağ üst köşesine bak.
- **Beklenen:** çift altın çerçeve kesintisiz. **Gerçekleşen:** kartın üst görseli (`.paper-top`) ile alttaki çerçeve bandı (`.paper::before`)
  dikişinde (kart tepesinden ~39 px aşağıda) sağ kenar ve altın çizgiler ~1 CSS px içeri kayıyor, altında ince açık şerit. Kart
  genişliği kesirli olduğunda (390'da 155,39 px) Blink'in görsel/arka plan yuvarlaması uyuşmuyor. Kalıcı: doğrulayıcı başsız 390@3, 414@3,
  390@2, 390@1'de ve **görünür (başlı) Chrome penceresinde** 375×812@3, 414×896@3'te de üretti; başlı 390@3'te çıkmadı. Firefox'un 9
  görünüm boyutunda yok; Chrome masaüstünde yok.
- **Kaynak:** `themes/olive-ivory/site.css:331–337` (3 dilimli kart; `.paper::before { top: calc(var(--top-h) - 1px) }`).
- **Görüntü:** `17_capraz_tarayici/b6_olive_gun_karti_basamak.jpg` (sol Chrome, sağ Edge; kırmızı halka = basamak)

### B7 — Blush Garden Rose: RSVP sayfasında etkin RSVP hapı kısalıyor, yazı aşağı kayıyor
- **Önem:** düşük · **Tarayıcı:** hepsi · **Görünüm:** hepsi (telefonda alt menü, masaüstünde üst menü)
- **Adımlar:** `/clara-and-julian/home`'da menüdeki RSVP hapına bak → RSVP sayfasına geç, aynı hapa bak.
- **Beklenen:** hap her sayfada aynı. **Gerçekleşen:** diğer sayfalarda 28 CSS px ve yazı ortada; RSVP sayfasında (etkin) 24 px ve yazı
  ~2,5 px aşağıda. Neden CSS özgüllüğü: `a[aria-current="page"] span:last-child { padding-bottom: 1px }` (0,3,2) RSVP hapının
  `padding: 5px 12px 4px`'ini (0,3,1) eziyor; 587. satır yalnız alt çizgiyi kaldırıyor, dolguyu geri vermiyor.
- **Kaynak:** `themes/blush-garden-rose/site.css:585–587`.
- **Görüntü:** `17_capraz_tarayici/b7_rsvp_hap_kayik.jpg` (Chrome 390; üst home, alt RSVP)

### B8 — Blush Garden Rose: süs yaprakları RSVP formunun üstünden geçiyor (tasarım gözlemi)
- **Önem:** düşük · **Tarayıcı:** hepsi · **Görünüm:** telefon (formla teşekkür bölümü aynı ekrandayken)
- **Adımlar:** `/clara-and-julian/rsvp` → formun altına kaydır, notu yaz.
- **Gerçekleşen:** "Thank you" bölümü ekrana girince bir kerelik yaprak yağmuru başlıyor (7 yaprak, ~5–8 sn); yaprak katmanı sabit ve
  `z-index: 30` olduğu için not kutusu, etiket ve "Send reply" düğmesinin üstünden geçiyor (karede "THE" sözcüğü örtülü). `pointer-events: none`
  — yazmayı/tıklamayı engellemiyor; okunurluk birkaç saniye etkileniyor. İstenirse yağmur form görünürken ertelenebilir ya da katman
  formun altına alınabilir.
- **Kaynak:** `themes/blush-garden-rose/site.css:224` `.petal-layer`; `rsvp.html:109` `data-petals="closing"` + `site.js`.
- **Görüntü:** `17_capraz_tarayici/b8_yapraklar_form_ustunde.jpg` (Chrome 390)

### B9 — Panel: site adresi harf ortasından bölünüyor
- **Önem:** düşük · **Tarayıcı:** hepsi · **Görünüm:** telefon (masaüstünde satır geniş, tesadüfen tireden bölünüyor)
- **Adımlar:** panel → "Your website is a draft" kartında "Address after publishing"; yayından sonra "Your website is live" penceresi.
- **Beklenen:** adres `-` / `.` / `/` noktalarından bölünür. **Gerçekleşen:** `https://davetiye-platfor` | `m-five.vercel.app/…` | `nk` —
  son satırda tek başına 2–7 harf kalıyor; yayın penceresinde `g063-e|dge-…`. Aynı penceredeki QR notunda `break-all` yok ve orada adres
  tireden düzgün bölünüyor. "Copy link" düğmesi kopyalamayı kurtarıyor; sorun yalnız görünüş.
- **Kaynak:** `platform/components/panel/panel.module.css:171, 178, 210` `word-break: break-all` (öneri: `overflow-wrap: anywhere`).
- **Görüntü:** `17_capraz_tarayici/b9_panel_adres_kirilmasi.jpg` (Edge 390)

### B10 — Panel masaüstünde ilk anda telefon düzeninde (önizleme yok, "Close" ve "Preview" düğmeleri)
- **Önem:** düşük · **Tarayıcı:** hepsi (yakalandığı kare Firefox) · **Görünüm:** ≥960 px
- **Adımlar:** `/start` ile site oluştur → "Open my editor" (ya da panel linkini aç) → ilk boyamaya bak.
- **Beklenen:** masaüstü düzeni baştan. **Gerçekleşen:** sunucu HTML'i her zaman telefon düzenini üretiyor: önizleme sütununda iframe yok,
  başlıkta "Close", alt çubukta "Preview" düğmesi; JS yüklenip `matchMedia('(min-width: 960px)')` okununca düzelir ve düğmeler kaybolup
  yerleşim kayar. Hızlı bağlantıda kısa bir yanıp sönme, yavaş ağ/CPU'da daha uzun; o arada "Close"/"Preview" bir şey yapmıyor.
- **Kaynak:** `platform/components/panel/Panel.tsx:34–35` `useWide()` → `useState(false)`; `PreviewPane.tsx` `!wide ? Close`; `Panel.tsx`
  `!wide ? Preview`. (Öneri: düğmeleri CSS medya sorgusuyla gizlemek ya da `wide` için CSS'e dayanmak.)
- **Görüntü:** `17_capraz_tarayici/b10_panel_ilk_boyama.jpg` (sol: ilk boyama, sağ: birkaç saniye sonra)

### B11 — /start sonucu: "Save this link" kutusu linkin son satırını kesiyor
- **Önem:** düşük · **Tarayıcı:** hepsi · **Görünüm:** 360 px'te üç tarayıcıda; 390 px'te uzun adreslerde
- **Adımlar:** `/start?theme=…` → formu doldur → "Create my website" → sonuç ekranındaki düzenleme linki kutusu.
- **Beklenen:** link kutuda tam görünür. **Gerçekleşen:** 125 karakterlik link 5 satıra bölünüyor, kutu 4 satır gösteriyor; 5. satır yarıdan
  kesik, kutu içinde kaydırma gerekiyor. 360 px'te Chrome/Edge/Firefox'un üçünde de oluyor; 390 px'te telefonların tek aralıklı fontuyla
  (genişliği Courier New ile taklit edildi) 117+ karakterlik linkler de taşıyor; adres 48 karaktere kadar olabildiği için link 141 karaktere çıkabiliyor. Hafifletenler: "Copy link"
  tamamını kopyalıyor, odaklanınca tamamı seçiliyor, "Email it to myself" tamamını içeriyor. (Görüntüdeki 390 px Firefox karesinde ayrıca
  emülasyonun klasik kaydırma çubuğu var — o kısmı test aracı kaynaklı; gerçek Firefox Android üste binen çubuk kullanır.)
- **Kaynak:** `platform/app/start/StartForm.tsx:667` `rows={4}` (öneri: içeriğe göre satır sayısı ya da `field-sizing: content`).
- **Görüntü:** `17_capraz_tarayici/b11_start_link_kutusu.jpg` — **link metni pikselleştirildi** (düzenleme anahtarı içeriyordu; site silindi).

### B12 — Panel: isim alanlarında yazım denetimi çizgisi
- **Önem:** düşük · **Tarayıcı:** Firefox 157 (alan odaktan çıkınca da kalıcı); Chrome/Edge 155'te yalnız alan odaktayken · **Görünüm:** hepsi
- **Adımlar:** panel → Couple → isimleri sözlükte olmayan adlarla değiştir (ör. "Testa", "Probo"), sonraki alana geç.
- **Beklenen:** özel isimlerin altında hata işareti olmaz. **Gerçekleşen:** "Testa", "Testa Lane", "Probo", "Probo Hart" altında kırmızı
  dalgalı çizgi; alıcıya adını yanlış yazmış izlenimi veriyor. (Testteki Chrome/Edge karelerinde çizgi yok çünkü otomasyon profilinde yazım
  denetimi çalışmıyordu; ayarlı profilde Chrome'da da odaktayken çıktığı doğrulandı.)
- **Kaynak:** `platform/components/panel/fields.tsx:164` `spellCheck={type === 'text'}` (isim alanları için `false` önerilir).
- **Görüntü:** `17_capraz_tarayici/b12_firefox_isim_yazim_denetimi.jpg` (Firefox 390)

### Küçük not (bulgu değil)
- **N1 — el yazısı yedek fontu Windows'ta Comic Sans:** Edge masaüstünde panel önizlemesinin ilk çiziminde Great Vibes henüz inmemişken
  `cursive` yedeği devreye girip isimler Comic Sans MS ile göründü; sonraki karede doğru. Klasik yazı tipi geçişi (FOUT), her tarayıcıda
  olabilir, yalnız ilk ziyarette. İstenirse `--script` yığınına `cursive` yerine serif italik yedek ya da font ön yüklemesi
  (`themes/olive-ivory/site.css:16`, `themes/blush-garden-rose/site.css:22`). Görüntü: `17_capraz_tarayici/n1_edge_onizleme_yedek_yazi.jpg`.
- Panel önizlemesinin otomatik kayıttan sonra kısa süre eski içeriği göstermesi (iframe yeniden yükleniyor) ve giriş animasyonlarının
  yarım anları (isimlerin "Clara & J…" yazılırken, yaprakların, solan satırların yakalandığı kareler) tasarlanmış davranış — bulgu sayılmadı.

## 5. Test aracı kaynaklı (site sorunu değil) — kanıtlarıyla

| Görülen | Neden (kanıt) |
|---|---|
| `.ics` tıklaması dosya indirmedi (ana koşu, 3 tarayıcı) | Her yolculuk ayrı gizli tarayıcı bağlamında koştu; Chromium'da indirme izni o bağlamlara geçmedi, başsız Firefox uzaktan kumandada indirmeyi kaydetmedi. Aynı tıklama Chrome/Edge normal bağlamında ve görünür Firefox'ta dosyayı indirdi (§3). |
| Chrome/Edge telefon görünümünde QR "çözülemedi" | Puppeteer'ın tek öğe görüntüsü (`element.screenshot`) Chromium mobil emülasyonunda yanlış bölgeyi aldı; aynı anın tam ekran görüntüsü 5 ölçekte de çözülüyor, `data-qr-text` = genel adres. |
| Firefox telefon görünümünde sayfa geçişi 25–262 sn | BiDi `waitForNavigation` gezinmeyi kaçırıp zaman aşımına kadar bekledi; doğrudan ölçümde ~1 sn (§3). |
| Firefox panelde foto yükleme "unsupported operation" | WebDriver BiDi `input.setFiles` Windows'ta `C:/…` biçimli yolu reddetti; `C:\…` ile 6/6 yüklendi. |
| Chrome/Edge 360 bazı yolculuklar koşmadı ("Session closed", "Connection closed", "frame was detached") | 3 tarayıcı aynı anda başsız koşarken tarayıcı oturumları düştü; aynı yolculuklar tek başına yeniden koşturuldu ve geçti. |
| Chrome/Edge telefon emülasyonunda tarih alanına yazılamadı | Mobil Chromium tarih alanı kendi seçicisiyle çalışır (bkz. §3); site sorunu değil, gerçek cihaz testi gerekir. |
| Edge 360×640 misafir yolculuğu RSVP'yi doldururken /story'ye geçti (6 koşunun 2'si) | Kaydırma (`scroll-behavior: smooth`) oturmadan Puppeteer menünün altında kalan "guests" alanının ortasına tıkladı; Puppeteer üstünü sabit bir öğenin örtüp örtmediğine bakmaz, tıklama menüdeki STORY bağlantısına düştü. Aynı tıklama ayrı betikle birebir yeniden üretildi; diğer 4 koşu 20/20. Altta yatan örtüşme B3'te. Görüntü: `17_capraz_tarayici/b3_edge360_rsvp_sonra_story.jpg` |
| Firefox ekran görüntülerinde alt/üst menü bulanıksız, arkadaki yazı keskin | Firefox'un BiDi yakalama yolu `backdrop-filter`'ı resme işlemiyor; aynı anda Windows'tan alınan pencere görüntüsünde menü Chrome/Edge'deki gibi bulanık. Kullanıcı farkı yok. |
| Firefox telefon görünümünde sağda 17 px boş şerit, "Tap to open" yerine "Click to open", masaüstü sayı kutusu okları | Firefox BiDi emülasyonu klasik kaydırma çubuğunu ve fare/dokunma algısını değiştirmiyor; gerçek Firefox Android'de üste binen çubuk ve dokunma kipi var. |
| Çok sayıda "yarım" kare (isim yazılırken, yapraklar, solan satırlar) | Ekran görüntüleri sabit gecikmeyle alındı; tema sahneleri sıralı giriyor (ör. home: çiçekler 0, kart 150, isimler 650 ms + zarftan gelişte 650 ms). Doğrulayıcı aynı adımı yeniden açıp 1,5–4 sn sonra tam görüntüyü aldı. |

## 6. Temizlik

- **28 test sitesi** (24 tohumlanmış `g063-*` + 4 `/start` sahiplenmesi `g063-claim-*`) live-check'in yoluyla silindi: kimlikle `deleteSite`, sonra
  `slugs/`, `orders/`, `sites/`, `rsvps/`, `media/` önekleri listelenip boş olduğu doğrulandı (`slugs/g063*` 0, `orders/98*` 0); genel adresleri 404.
- Demo `/clara-and-julian`'a gönderilen **12 test RSVP'sinin** ("G063 …", 3 tarayıcı × 3 görünüm + Edge 360 tekrar koşuları) hepsi silindi;
  son kontrol: "G063" yanıtı 0. Demoda kalan tek yanıt **benim değil**: `2026-10-14T07:51` tarihli, adı
  `<xz` (testlerden önce; başka bir ajanın denemesine benziyor) — dokunulmadı, entegratöre not.
- Demo içeriği değişmedi (yalnız okundu).
