# G090 QA raporu — satıştaki 21 tasarımın kapanış denetimi (01–21)

**Tarih:** 2026-10-17 · **Denetçi:** qa-kontrol (salt okunur; hiçbir dosya düzeltilmedi) · **Dal:** `claude/g090-qa`
(taban `origin/claude/zealous-fermi-hy1o40` @ `91cb36d`)
**Ortam:** `platform/` yerel üretim derlemesi (`npm ci && npm run build`, `next start` port 3471), `local` veri adaptörü, geçici veri
klasörü; `CLAIM_ORDER_VERIFICATION`, SMTP ve Google OAuth **tanımsız** (yerel varsayılan). Tarayıcı: `/opt/pw-browsers` Chromium
(mobil emülasyon). Canlı site (`davetiye-platform-five.vercel.app`) bu ortamdan açılamadı (proxy reddi) — canlı hiçbir şey denenmedi.
Ekran görüntüleri: `gorevler/qa/G090/` (21 dosya, toplam ~1,4 MB, her biri ≤ 190 KB).

## Özet

- **Misafir sitesi (21 tasarım × 360/390/430/1280 px, demo):** kapalı açılış → dokun → `/home` 21/21'de çalışıyor (3,5–5,2 sn);
  Home/Story/Details/RSVP 200; yatay kaydırma, ekran dışına taşan/kırpılan metin, kırık görsel, konsol hatası **yok** (84 görünüm);
  ses düğmesi her sayfada, harita bloğu her Details'te; demo RSVP "preview" paneli, yayınlanmış örnek sitede gerçek yanıt → teşekkür
  paneli 21/21. Görsel dekor–metin çakışması misafir sitelerinde **bulunmadı** (otomatik taramanın işaretlediği adaylar gözle
  incelendi, hepsi saydam PNG kutusu ya da sabit menü kaynaklı yanlış alarm).
- **Alıcı akışı (6 tasarım: 01, 06, 12, 13, 18, 21):** `/my` → sipariş no + e-posta → "Which design" seçici → `/start` (bilgiler
  sessionStorage ile taşınıyor) → editör → yayın; ikinci cihazda `/my` (e-posta büyük harfle) editörü açıyor; Share → Use on another
  device QR'ı `<origin>/my`'ı çözüyor; yanlış e-posta genel mesaj veriyor; Downloads: site PDF'i + 5×7 + A5 davetiye iniyor ve
  açılıyor; RSVP → Guests → Excel (geçerli xlsx) ve CSV iniyor; İspanyolca dil ekleyince misafir sitesinde dil düğmesi ve `?lang=es`
  çalışıyor. **Hepsi geçti.**
- **Paket dosyaları:** 21/21 START HERE PDF'i 9 sayfa, ~55 KB; tıklanabilir başlat linki + `/my` + `/privacy`; **QR 21/21 doğru
  `…/start?theme=<id>` çözüyor** (jsQR). `etsy_upload.py --check --strict` 21/21 OK, JSON'lar `listing_v3.md` ile birebir güncel;
  9 ilan görseli 21/21 (2000 × 2000), video 21/21.
- **Satış sitesi:** `/designs` 21 tasarımı 5 dilde listeliyor, 21 detay sayfası 200 ve kendi `/start?theme=` + demo linkine gidiyor,
  "Create your website" → `/my` (EN/TR/DE/ES/FR), `/my` 5 dilde, yatay kaydırma ve konsol hatası yok.
- **Ama satışa engel bulgular var:** alıcının indirdiği tek dosyada (START HERE) karar bekleyen yer tutucular duruyor, START HERE'in
  linklediği gizlilik sayfası taslak, ilan açıklamalarında doğrulanmamış iddialar ve geçici alan adı kararı açık. Ayrıca ürün
  ilerledi (müzik, 5 dil, basılı davetiye PDF'i) ama satış sitesi/ilan/START HERE metinleri bunları ya inkâr ediyor ya da eskiyi
  anlatıyor; panelden indirilen basılı davetiyede çoğu tasarımda dekor metnin üstüne biniyor.

**Sayım:** P0 = 4 · P1 = 8 · P2 = 4. **Hiçbir tasarım `sale_ready` değil.**

## Bulgular

Önem: **P0** satışa engel · **P1** satıştan önce düzeltilmeli · **P2** cila. "Görüntü" yolları `gorevler/qa/G090/` altında.

| # | Önem | Tasarım / sayfa | Viewport | Adımlar | Ne görüldü (neden önemli) | Görüntü | Önerilen düzeltme alanı |
|---|---|---|---|---|---|---|---|
| P0-01 | **P0** | 01–21, `package/customer/START_HERE.pdf` (+ `.md`) | PDF | `pdftotext` / sayfa 3 ve 8'e bak | Alıcının Etsy'den indirdiği **tek dosyada** açık yer tutucular: "usually within **[ORDER CHECK TIME]**" (s. 3, "We are confirming your Etsy order") ve "Longer hosting: **[EXTENSION POLICY]**" (s. 8). 21/21 aynı. docs/05 §C/§D: `--prepublish` bu durumda düşer, kit sale_ready sayılmaz. | `P0-01_start_here_placeholders_01.jpg` | Karar (sipariş onay süresi, uzatma politikası) → `docs/19_ALICI_YOLCULUGU.md` Ek A + `python3 tools/build_customer_guides.py`; karar yoksa cümleyi çıkar |
| P0-02 | **P0** | Satış sitesi `/privacy` (START HERE s. 9 buraya linkliyor) | 360 | `/privacy` aç | Sayfa kendini **taslak** ilan ediyor: "[PRIVACY REVIEW] This notice is a draft…", "After that: [RETENTION AFTER ARCHIVE]", "To delete everything earlier: [DELETION PROCESS]". Alıcı ve misafir verisi (AB alıcıları dahil) için gizlilik metni bitmemiş; satılan PDF doğrudan buraya gidiyor. | `P0-02_privacy_draft_360.jpg`, `P0-02b_privacy_placeholders_360.jpg` | Karar + `platform/lib/marketing/config.ts` (policies), gizlilik sayfası içeriği (`app/(marketing)/(en)/privacy`, `lib/marketing/*`) |
| P0-03 | **P0** | 01–21, `listing/etsy_upload.json` | — | `python3 tools/etsy_upload.py --check --strict`; JSON `open_checks` | Kurallar geçiyor ama her tasarımda **11 açık kontrol**, `ready_to_publish: false`. JSON `description` alanında `[VERIFY]` notu silinmiş, **cümle duruyor**: yapıştırılırsa doğrulanmamış iddia yayına girer. Riskli olanlar: "We confirm each order in our shop before a website can go live" (yerelde doğrulama kapalı → Publish hemen açık; G147 ile `etsy` modu da var; canlıdaki değer okunmadı), "connect a Google Sheet…" (yerelde "Google Sheets: coming soon"; canlıda Google OAuth tanımlı mı bilinmiyor), "designed for phone screens" (gerçek telefon yok), AI/"Designed by" Etsy ayarı. | — | Canlı ortam değişkenleri okunup cümleler doğrulanmalı ya da `collections/*/package/listing/listing_v3.md` §2'den silinmeli; sonra `python3 tools/etsy_upload.py` |
| P0-04 | **P0 (karar)** | 01–21: START HERE linkleri + QR, basılı davetiyenin arka yüzü | — | PDF linkleri / davetiye PDF'i | Başlat linki, QR ve panelin basılı davetiyesinin arka yüzündeki adres **geçici** `davetiye-platform-five.vercel.app` (Türkçe "davetiye", markasız vercel.app). docs/05 §D: "son alan adı ilk satıştan önce seçildi (ya da kalıcı yönlendirme taahhüdü)" ve "ticari barındırma planı (Vercel Hobby ticari değil)" kutuları **işaretsiz**. Alıcılar QR'ı basacağı için sonradan değişim kırıcı. `listing_kit.py check` 21/21 aynı uyarıyı veriyor. | — | Kullanıcı kararı → `LISTING_BASE_URL` / `PLATFORM_PUBLIC_URL`, `tools/listing_kit.py qr pdf`, `tools/build_customer_guides.py` |
| P1-01 | P1 | Panel → Share → Downloads → **Printable invitation** (5×7 ve A5) | PDF | Alıcı akışında indir (6 tasarım) + `node scripts/print-sample.ts --theme <id> --invite 5x7` (21 tasarım, demo içerik) | Dekor metnin üstüne biniyor. **Belirgin:** 01 arka "THE DETAILS" zeytin dalının altında; 02 ön "TOGETHER…" ve arka "THE DETAILS"+tarih; 04 isimler ("Margot/Henry") alt satırlara giriyor, "Kindly reply by…" damganın altında; 05 arka "THE DETAILS" limonun altında; 11 ön tarih/mekân/"Kindly reply" pampasın altında; 12 ön "FAMILIES" ve "Kindly reply" yaprakların altında; 16 ön "invite you…"/"Kindly reply" ayçiçeklerinin altında; 19 arka "THE DETAILS"; 21 ön "May 15," gül yaprağının altında. **Hafif temas:** 07, 08, 14, 15, 17, 18, 20. **Temiz:** 03, 06, 09, 10, 13. A5 aynı yerleşim (aynı sorun). Panelde alıcıya sunulan, basılacak bir dosya. | `P1-01a…e_print_*.jpg` | `platform/lib/print/` (davetiye yerleşimi, güvenli metin alanı) + `public/print/<tema>/` (`node scripts/build-print-assets.ts`) |
| P1-02 | P1 | Canlı demo `/start/demo/<id>` (ilanda "TRY THE LIVE DEMO") | 360–1280 | Demoyu aç → Home / Story / Details | 20/21 tasarımda portre, hikâye ve mekân yerlerinde **"YOUR PHOTO HERE"** yer tutucusu (yalnız 21 Crimson'da örnek fotoğraf). İlan metni 21/21 "See the envelope open … (sample names and photos)" diyor ve ilan görselleri örnek fotoğraflı ekranlar gösteriyor: alıcı demoyu açınca söz verilenden boş bir site görür. | `P1-02_demo_placeholder_photos_390.jpg` | `platform/lib/claim/demo-page.ts` / tema demo kayıtları (21'deki gibi tema içi örnek fotoğraflar) **ya da** `listing_v3.md` §2 "(sample names and photos)" → "(sample names)" |
| P1-03 | P1 | Satış sitesi, 21 tasarım detay sayfası "Not included" (+ pricing, llms) | 360 / 1280 | `/designs/<id>` → "Not included" | Liste "**Music**", "**A translated website: built-in messages … stay in English**" ve "**Printed invitations**" diyor. Ürün bunların üçünü de yapıyor (G126 Story müziği 4 parça; G144 site arayüzü EN/TR/ES/DE/FR — 5 sitede denendi; G139 basılı davetiye PDF'i). Aynı sayfanın ekran karuselinde "Music" editörü görünüyor; Etsy ilanı müziği vaat ediyor → ilan ile satış sitesi çelişiyor. "Included" da "a CSV download" diyor (Excel var). | `P1-03_not_included_360.jpg` | `platform/lib/marketing/facts.ts` (`NOT_INCLUDED`, `included()`) + çeviri sözlükleri `lib/i18n/dict/market/*` |
| P1-04 | P1 | 01–21 `listing_v3.md` (GOOD TO KNOW + FAQ "Can it be in another language?"), 01–21 START HERE ("Can it be in my language?") | — | Metni oku; alıcı sitesinde Us → Languages → Spanish → yayınla → `?lang=es` | Metinler "The website's built-in messages (reply form errors, calendar text) are in English" / "Built-in messages … stay in English" diyor. G144 sonrası doğru değil: İspanyolca seçince RSVP formu, başlıklar, tarih ("6 de noviembre de 2027"), menü ("INICIO · RELATO · INFO") çevrilmiş, `<html lang="es">`, dil düğmesi var (06, 12, 13, 18, 21'de denendi). Yanlış yönde (eksik) bir iddia ama ES/DE/FR/TR alıcısını kaçırır ve SSS cevabı hatalı. | `P1-04_guest_site_es_06_360.jpg` | `collections/*/package/listing/listing_v3.md` §2 + §7, `docs/19_ALICI_YOLCULUGU.md` Ek A → `tools/build_customer_guides.py`, sonra `tools/etsy_upload.py` |
| P1-05 | P1 | 01–21 START HERE "Quick answers" | — | START HERE s. 8 | "Is there a printed invitation or a save the date? **No.**" — ama panelin Share → **Downloads** kartı "Download website as PDF" ve "Printable invitation" (5×7 / A5, arka yüz, taşma payı) sunuyor; rehberde Downloads hiç anlatılmıyor. Alıcı panelde rehberin "yok" dediği özelliği görür. | `P1-05_panel_downloads_06_390.jpg` | `docs/19_ALICI_YOLCULUGU.md` Ek A (Downloads adımı + cevap), `tools/build_customer_guides.py` |
| P1-06 | P1 | Satış sitesi `/faq` "What if I lose my edit link?" | 360 | `/faq` | "Message us on Etsy with your order number: we send you a new link … **[LOST LINK POLICY]**" — G146 öncesi süreç. Güncel yol (ilan, START HERE, `/my`): sipariş no + e-posta ile her cihazdan devam. Alıcıyı gereksiz destek mesajına yönlendiriyor + yer tutucu görünüyor. | `P1-06_faq_lost_link_360.jpg` | `platform/lib/marketing/faq.ts` (`lost-link`) + `config.ts policies.lostLink` + çeviriler |
| P1-07 | P1 | Satış sitesi, **her sayfanın alt bilgisi** + `/faq` + `/features` + design sayfaları | 360 / 1280 | Herhangi bir sayfayı aç | Görünen yer tutucular: alt bilgide "Etsy shop: **[ETSY SHOP URL]**" (tüm sayfalar, 5 dil); `/faq` "[DOMAIN]/clara-and-julian", "[EXTENSION POLICY]" (2 yerde), "[DELETION PROCESS]"; `/features` "[DOMAIN]"; ana sayfa/pricing/how-it-works "[EXTENSION POLICY]". 21 detay sayfasında fiyat "1,460 TRY on Etsy" görünürken düğme "Coming soon on Etsy" (`etsyListingUrl` 21/21 yer tutucu). | `P1-07a_footer_etsy_shop_360.jpg`, `P1-07b_faq_placeholders_360.jpg` | `platform/lib/marketing/config.ts` (`etsy.shopUrl`, `etsyListingUrl`, `policies`, alan adı) — Etsy yüklemesi + kararlar sonrası |
| P1-08 | P1 | 06–21 `package/listing/` | — | `python3 tools/listing_kit.py check --theme all` | 06–21'de **`listing_<tema>.pdf` yok** → `check` 16/21 "1 problem". Kullanıcının kalıcı talebi 5 (AGENTS) ve docs/05 B4 bu PDF'i istiyor (01–05'te var ve güncel). | — | `python3 tools/listing_kit.py pdf --theme <tema>` (06–21) |
| P2-01 | P2 | 01–20 ilan görseli 8 ("What's included") | 2000 px | Görseli aç | Telefondaki ekranın portre kartında "YOUR PHOTO HERE" yer tutucusu (demo ekranı); 21'de örnek fotoğraf var. Kapanış görselinde ürün yarım görünüyor. | `P2-01_listing_img8_all.jpg` | `tools/listing_editorial.py` (08_included demo ekranı → örnek fotoğraflı ekran) |
| P2-02 | P2 | 03, 21 (ve 16, 19, 15) misafir sitesi | 360 | Home / Details / index | Küçük telefonda 8–9 px yazı: 03 index/home "Savannah, Georgia" 8–9 px, "Together with their families" 9,5 px; 21 "Apple / Outlook" düğme etiketi, "Add to your calendar", "Lake Como…" 8–9 px; 16/19 10,5 px. Çoğu tasarımda büyük harfli "kicker" satırları 11 px (tasarım tercihi). | `P2-02_small_text_21_03_360.jpg` | `platform/themes/{blush-garden-rose,crimson-rose-atelier}/site.css` (min ~11 px, düğme etiketi ≥ 12 px) |
| P2-03 | P2 | 17 tasarım, Home sonu "Open the envelope again" / RSVP "Replay the envelope" | 360–430 | Dokunma alanı ölçümü | Bağımsız metin linkleri 18–21 px yüksekliğinde (genişlik yeterli) — WCAG 2.5.8'in 24 px tabanının altında; parmakla basılır ama dar. 06, 07, 14, 21'de sorun yok. | — | `platform/themes/*/site.css` (`.textlink` / `.replay` dikey dolgu ≥ 12 px) |
| P2-04 | P2 | 01–21 START HERE s. 1 | PDF | Metni oku | Başlat adresi düz metin olarak yazılı değil (yalnız "Start your … website" link metni + QR). Telefonda link çalışmayan bir görüntüleyicide alıcı kendi telefonundaki QR'ı okutamaz; yedek yol `/my` adresi düz metin olarak s. 2'de var, o yüzden P2. | — | `docs/19_ALICI_YOLCULUGU.md` Ek A (adres satırı) |

## Tasarım başına tablo

Sütunlar: **Misafir** = demo sitesi 360/390/430/1280 (otomatik + örnek gözle bakış; "temiz" = taşma/kırpma/kırık görsel/konsol hatası yok,
ses düğmesi ve harita var) · **Açılış** = dokunuştan `/home`'a ms (4 genişlikte min–max) · **RSVP** = demo "preview" + yayınlanmış
örnek sitede gönderim → teşekkür paneli · **Alıcı** = tam alıcı akışı (yalnız örneklenenler) · **START HERE** = 9 s., linkler, QR ·
**Etsy** = `etsy_upload --check --strict` · **Görseller** = 9 görsel + video · **Basılı davetiye** = P1-01.

| # | Tasarım | Misafir | Açılış (ms) | RSVP | Alıcı | START HERE | Etsy | Görseller | Basılı davetiye | Ortak P0/P1 dışında not |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Olive & Ivory | temiz | 4319–4510 | ✓ | ✓ (dil adımı betik hatasıyla koşmadı) | ✓ QR | OK | 9/9 + video | arka "THE DETAILS" kapalı | P2-03 |
| 02 | Dusty Blue & Champagne | temiz | 4043–4590 | ✓ | — | ✓ QR | OK | 9/9 | ön+arka çakışma | P2-03 |
| 03 | Blush Garden Rose | temiz | 4357–4461 | ✓ | — | ✓ QR | OK | 9/9 | temiz | P2-02 (8–9 px), P2-03 |
| 04 | Vintage Airmail Love Letter | temiz | 3819–4041 | ✓ | — | ✓ QR | OK | 9/9 | isim/metin + damga çakışması | P2-03 |
| 05 | Mediterranean Lemon | temiz | 4391–4618 | ✓ | — | ✓ QR | OK | 9/9 | arka "THE DETAILS" kapalı | P2-03 |
| 06 | Art Deco Black-Tie | temiz | 4400–4508 | ✓ | ✓ (+ES) | ✓ QR | OK | 9/9 | temiz | ilan PDF'i yok |
| 07 | Burgundy Velvet Autumn | temiz | 4614–4776 | ✓ | — | ✓ QR | OK | 9/9 | hafif | ilan PDF'i yok |
| 08 | Winter Evergreen | temiz | 4857–5157 | ✓ | — | ✓ QR | OK | 9/9 | hafif | ilan PDF'i yok, P2-03 |
| 09 | Lavender Provence | temiz | 3942–4220 | ✓ | — | ✓ QR | OK | 9/9 | temiz | ilan PDF'i yok, P2-03 |
| 10 | Tuscan Vineyard | temiz | 4173–4286 | ✓ | — | ✓ QR | OK | 9/9 | temiz | ilan PDF'i yok, P2-03 |
| 11 | Boho Pampas Terracotta | temiz | 4444–4533 | ✓ | — | ✓ QR | OK | 9/9 | **ağır** (tarih/mekân/son tarih) | ilan PDF'i yok, P2-03 |
| 12 | Tropical Destination | temiz | 4409–4734 | ✓ | ✓ (+ES) | ✓ QR | OK | 9/9 | ön çakışma | ilan PDF'i yok, P2-03 |
| 13 | Enchanted Forest Storybook | temiz | 4678–4933 | ✓ | ✓ (+ES) | ✓ QR | OK | 9/9 | temiz | ilan PDF'i yok, P2-03 |
| 14 | Ivory Lace & Pearls | temiz | 4448–4679 | ✓ | — | ✓ QR | OK | 9/9 | hafif | ilan PDF'i yok |
| 15 | Cherry Blossom Spring | temiz | 4758–5127 | ✓ | — | ✓ QR | OK | 9/9 | hafif | ilan PDF'i yok, P2-03 |
| 16 | Sunflower Rustic Barn | temiz | 4666–4919 | ✓ | — | ✓ QR | OK | 9/9 | ön çakışma | ilan PDF'i yok, P2-03 |
| 17 | Emerald & Gold Estate | temiz | 4677–4945 | ✓ | — | ✓ QR | OK | 9/9 | hafif | ilan PDF'i yok, P2-03 |
| 18 | Wildflower Meadow Vellum | temiz | 4144–4355 | ✓ | ✓ (+ES) | ✓ QR | OK | 9/9 | hafif | ilan PDF'i yok, P2-03 |
| 19 | Midnight Garden | temiz | 4874–4958 | ✓ | — | ✓ QR | OK | 9/9 | arka "THE DETAILS" kapalı | ilan PDF'i yok, P2-03 |
| 20 | Coastal Seaside | temiz | 4705–4822 | ✓ | — | ✓ QR | OK | 9/9 | hafif | ilan PDF'i yok, P2-03 |
| 21 | Crimson Rose Atelier | temiz | 3526–3588 | ✓ | ✓ (+ES, teşekkür modu "On now" ✓) | ✓ QR | OK | 9/9 | ön "May 15," kapalı | ilan PDF'i yok, P2-02 (9 px düğme) |

Ortak bulgular (her satıra geçerli): P0-01…P0-04, P1-02 (21 hariç), P1-03, P1-04, P1-05, P1-06, P1-07, P2-01 (21 hariç), P2-04.

## Geçen kontroller (kanıt)

- Misafir: 84 görünüm × 5 sayfa otomatik ölçüm (yatay taşma, ekran dışı/kırpılan metin, kırık görsel, konsol/HTTP hatası, dokunma
  alanı, yazı boyu, ses düğmesi, harita, köşe düğmesi çakışması) + seçili sayfaların gözle incelemesi (`OK-02_guest_01_02_03_360.jpg`).
  `/start?theme=<id>` 21/21 200 ve tasarım adını gösteriyor; demo `.ics` 21/21 geçerli VEVENT.
- Alıcı akışı 6/6 tasarımda tüm adımlar geçti (`OK-01_buyer_flow_06.jpg`): `/my` seçici → `/start` ön doldurma; sonuç ekranı artık
  "It is a shortcut to your editor" diyor (G146 metni); ikinci cihaz; Use on another device (cihaz listesi, "This device", QR
  `<origin>/my`); yanlış e-posta; site PDF'i (4 s., ~1,1–1,9 MB, 4,6–6 sn), 5×7 (360 × 504 pt) ve A5 (420 × 595 pt) davetiye, arka
  yüz QR'ı sitenin adresini çözüyor; Excel (2 sayfa, yanıt içinde) ve CSV; dil ekleme → `?lang=es`.
- Teşekkür modu (21): "On now" + yayın → misafir Home'da teşekkür metni, RSVP "Replies are closed", form yok (`OK-03_thankyou_21_390.jpg`).
- START HERE: 21 × 9 sayfa render edildi; QR 21/21 kendi başlat linki; PDF linkleri `/start?theme=<id>` (s. 1), `/my` (s. 2, 8),
  `/privacy` (s. 9); tasarım adı/teması her yerde doğru, başka tasarımın adı/linki yok; zarfsız tasarımlarda "envelope" yok.
- Etsy: `--check --strict` 21/21 OK (başlık 100–117/140, 13 etiket, 9 görsel, video, rehber); JSON'lar yeniden üretimle birebir
  aynı; açıklamada e-posta gönderme vaadi yok; "5 photo spots" 21/21 temanın 5 foto yeriyle uyumlu; 4 müzik parçası dosyada var.
- Satış sitesi: `/designs` + `/tr|de|es|fr/designs` 21/21 tasarım, `html lang` doğru; 21 detay sayfası kendi `/start` ve demo
  linkleri, başka tasarımın linki yok; "Create your website" ve karşılıkları → `/my`; `/my` 5 dilde (çerez `bke_lang`); 360 ve 1280'de
  yatay taşma ve konsol hatası yok; satışta olmayan 22 Nocturne `/designs/nocturne-lake-estate` 404.

## Yapılamadı (geçti sayılmaz)

- **Canlı site** (`davetiye-platform-five.vercel.app`): bu ortamdan bağlantı reddedildi. Canlıda G146 (`/my`), G139 (Downloads),
  G144 (diller), G147 olup olmadığı, `CLAIM_ORDER_VERIFICATION` değeri, Google OAuth/SMTP ayarı **okunmadı**.
- Gerçek iPhone Safari / Android Chrome; QR'ların telefon kamerasıyla okutulması (yalnız jsQR ile ekran/PDF görüntüsünden çözüldü).
- Google Sheets bağlantısı (yerelde Google tanımsız → "coming soon"); e-posta ile giriş linki (SMTP kapalı, `/my`'de düğme yok — doğru).
- Müziğin/efektlerin duyulması (başsız tarayıcı; yalnız ses düğmesinin varlığı ve konumu ölçüldü); "Show map" Google iframe'inin
  yüklenmesi (dış ağ yok; yalnız kart ve düğmeler).
- Alıcı akışı yalnız 6 tasarımda; teşekkür modu yalnız 21'de; misafir dil düğmesi yalnız 5 tasarımda; basılı davetiyenin taşma
  payı/kesim işaretleri seçenekleri denenmedi; basılı davetiye 15 tasarımda alıcı akışıyla değil `print-sample.ts` (demo içerik) ile.
- Etsy'ye yükleme ve ilan düzenleyicisindeki kurallar; 01'in dil adımı (betik seçici hatası, aynı adım 5 başka tasarımda geçti).
- Görsel çakışma taraması otomatik + örneklemeyle gözle yapıldı; her sayfanın her ekranı tek tek gözle incelenmedi.
- Not: bu ortamda `fonts.gstatic.com` istekleri ara sıra CORS hatası verdi (panelde konsola düştü); ürün hatası sayılmadı.

## Önerilen durum

- **Genel: `review_pending`.** Platform işlevleri yerel üretim derlemesinde uçtan uca çalışıyor (misafir 21/21, alıcı 6/6) —
  platform tarafı `functional_pilot` düzeyinde; ama P0-01…P0-04 kapanmadan ve canlıda yeniden denenmeden hiçbir tasarım
  `sale_ready` olamaz.
- Kapanış sırası önerisi: (1) kararlar: sipariş onay süresi, uzatma, silme/saklama, alan adı + barındırma (P0-01, P0-02, P0-04);
  (2) START HERE + ilan + satış sitesi metinlerini güncel ürüne göre tek seferde yenile (P0-03, P1-03…P1-07); (3) basılı davetiye
  yerleşimi (P1-01); (4) demo fotoğrafları (P1-02, P2-01); (5) 06–21 ilan PDF'leri (P1-08); (6) canlı yayın + `listing_kit.py check
  --prepublish` + gerçek telefon testi.
