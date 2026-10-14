# Etsy araştırması — dijital düğün sitesi rakipleri (2026-10-13)

Kaynak: `docs/12_LOCAL_KURULUM.md` §4. Yapan: local Claude oturumu (`claude-local-1`), kullanıcının Chrome'unda
(Claude in Chrome), Etsy'ye **giriş yapılmadan**. Rakip görseli/çizimi/metni **kopyalanmadı** (AGENTS.md şart 6);
burada yalnız gözlem, sayı ve ilan linki var. Bu belge karar değildir; fiyat ve ürün kararları kullanıcınındır.

## Yöntem ve sınırlar

- Aramalar: `wedding website template`, `digital wedding invitation website`, `envelope wedding invitation website`.
  Üçü de "1,000+ items". Her aramanın ilk sayfası (~60 ilan) toplandı → **91 tekil ilan** (81 website şablonu, 10 video davetiye).
- **30 ilanın sayfası** tek tek okundu (aşağıdaki tablo): fiyat, dükkân, ürün yorumları, teslim biçimi, demo linki.
  3 lider ilanın canlı demosu açıldı.
- Etsy Türkiye görünümü: fiyatlar TL (Etsy'nin kendi kuru). USD karşılığı **49.37 TRY/USD** ile hesaplandı
  (XE orta kur, 13 Eki 2026) — yaklaşık değerdir; ABD'li alıcının gördüğü fiyat Etsy kuru yüzünden birkaç % farklı olabilir.
- Yorumlar Etsy'nin "önerilen" sıralamasıyla görüldü; olumsuz yorumlar az görünür (seçim yanlılığı). Satış/yorum sayıları
  ilan sayfasındaki dükkân satırından.
- Arama sırası kişiselleştirilmiş olabilir (aynı tarayıcıda önceki Etsy gezintisi vardı); "ilk 30" kesin bir sıralama değil.

## 1. Özet

1. **Pazarın neredeyse tamamı Canva şablonu.** 30 ilanın 29'u "PDF içinde Canva şablon linki" teslim ediyor; demo ve
   alıcının sitesi `*.my.canva.site` (Canva'nın ücretsiz alan adı). Tek istisna: HTML/CSS/JS ZIP satan bir ilan
   (#26, "No Canva needed: own your files forever" — alıcı kendisi barındırıyor). İlk sayfalarda **barındırılan site + düzenleme
   paneli** satan ilan yok → K24 modeli pazarda boş bir alan; ama Etsy'nin dijital ürün kuralları açısından ayrıca bakılmalı (§7).
2. **Fiyat:** website şablonlarında indirimli satış fiyatı medyanı **≈ $18** (alt çeyrek $9.5, üst çeyrek $22.5, en yüksek $32);
   indirimsiz liste fiyatı medyanı **≈ $27** (çeyrekler $20–$40). **81 ilanın 72'si sürekli "indirimde"** (medyan %40).
   Video davetiyeler daha ucuz: satış medyanı ≈ $5.
3. **Açılış şovu sektör standardı:** "tıkla/dokun → zarf açılır → mum mühürlü monogram → davetiye takımı". Neredeyse her
   ilanda "envelope reveal", "click to open", "tap the wax seal". K23'teki zarf açılışı bir **fark değil, giriş bileti**;
   fark kalite, hız ve kişiselleştirmede olmalı.
4. **Standart özellik listesi:** RSVP (Canva Forms veya Google Forms, "trackable"), geri sayım, müzik, harita/yol tarifi,
   takvime ekle, registry, konaklama/seyahat, dress code, program, hikâye, SSS; 3–5 sayfa ya da 13–14 bölüm. Çoğu dükkân
   eşleşen **Save the Date sitesi** ve basılı davetiye de satıyor, paket indirimi veriyor (ör. "2 al %40, 3+ al %50").
5. **Yorumlarda övülen:** "düzenlemesi kolay", "talimatlar net", "satıcı hızlı yardım etti", "misafirler çok beğendi".
   **Şikâyet:** talimatların zorluğu, yavaş yükleme, hatalar ve "çok sabit öğe", renkleri değiştirmenin zorluğu, RSVP formu sorunu.

## 2. Görsel dil

- Palet: fildişi/krem + adaçayı/zeytin yeşili, bordo, toz mavisi, kahve/espresso, siyah-beyaz. "Old Money" en sık sıfat.
- Motifler: dantel kenarlı zarf, mum mühür monogram, kuğu, yağlı boya kır/bağ manzarası, el çizimi çiçekler
  (ortanca, kala, gül), "flat-lay" davetiye takımı, editoryal serif tipografi, kurdele.
- İlan görselleri: telefon (ve laptop) mockup'ında site; üstünde "RSVP", "Music", "Canva", "FREE" rozetleri;
  demo QR kodu; çok sayfalı akışın yan yana ekranları.
- Adlandırma: renk + stil + "Wedding Website Template" + özellikler (RSVP, Countdown, Music) + "Canva" + "(Digital Download)".
  Koleksiyon adı kullananlar var ("Heirloom Edition", "The Olive Letter").
- Bizim tasarım 03 (Blush Garden Rose: pembe-krem, çiçek, zarf) bu görsel dilin içinde; "ultra-minimal reddedildi" kararı (AGENTS şart 5)
  pazarla uyumlu.

## 3. Açılış ve demo deneyimi

- Her ilanda canlı demo linki var; birçoğu "Try the live demo **on your phone**" ve listing görselinde QR ile yönlendiriyor.
- Açılış varyantları: tıkla-aç zarf, mum mühüre dokun, dantel zarf, kabartmalı zarf, kapı açılışı (video), "one-click scrolling".
- Gözlem (tek ölçüm, masaüstü, bu bağlantı — kesin değil): Canva demolarının ilk yüklemesinde **4 sn'den uzun boş ekran**
  görüldü; bir demoda 77 istek, ~3.8 MB, `load` ≈ 12 sn; bir demoda ekran görüntüsü alınırken sekme 30 sn yanıt vermedi.
  Sayfa başlıkları genel ("Save the Date", "Envelope"; birinde ilanla uyuşmayan "Country Chic Wedding Website") → bağlantı
  WhatsApp/iMessage'ta paylaşıldığında çiftin adı görünmüyor olabilir.
- Karşılaştırma için bizim yerel demo (`/clara-and-julian`, localhost — ağ koşulu karşılaştırılabilir değil): 18 istek, ~1.2 MB,
  başlık ve `og:title` "Clara & Julian · May 15, 2027" biçiminde kişisel.

## 4. Fiyat (91 tekil ilan, USD ≈)

| | n | satış min | alt çeyrek | medyan | üst çeyrek | max | liste fiyatı medyanı | indirimde |
|---|---|---|---|---|---|---|---|---|
| Website şablonu | 81 | $0.78 | $9.48 | **$18.19** | $22.47 | $32.18 | $26.95 | 72/81 (medyan %40) |
| Video davetiye | 10 | $1.81 | $3.76 | $5.08 | $11.64 | $12.53 | $14.34 | 5/10 |

Website satış fiyatı bantları: <$5: 14 · $5–15: 16 · **$15–25: 35** · $25–35: 16 · >$35: 0.
Büyük ve eski dükkânlar ($15–25 bandı): BrideToBeDesignCo (28.2k satış), Templates4branding (43.8k), Filterity (72.2k),
BestCelebrations (201.3k). Çok ucuz uç ($1–3) yeni ve hacim odaklı dükkânlar; ayrıca "PLR/MRR yeniden satış hakkı" ile
şablon paketi satan ilan var (benzer tasarımların çoğalmasının bir nedeni).

## 5. Teslim biçimi

- **1–4 PDF** indirilir: Canva şablon linki + adım adım (ekran görüntülü) kılavuz. "Ücretsiz Canva hesabı yeter, Pro gerekmez".
- Alıcı siteyi Canva'da düzenler ve Canva'nın ücretsiz alan adında yayınlar; RSVP Canva Forms ya da eşleşen Google Forms.
- Ek hizmet olarak satılan/övülen: satıcının düzenlemeyi kendisinin yapması, renk değişikliği, ikinci dilde sayfa
  (yorumlarda en çok övülen şeylerden biri "satıcı yardımı"). Bir dükkânın ayrı bir Google Sites yardım merkezi var.
- HTML ZIP ilanı: alıcıya dosyaları verip barındırmayı ona bırakıyor (teknik alıcı gerektirir).

## 6. Yorumlar — övgü ve şikâyet (görünen yorumlardan)

| Konu | Örnek (ilan #) |
|---|---|
| Kolay düzenleme | neredeyse her ilanda en sık kategori ("Ease of use": #17'de 44, #18'de 58 yorum) |
| Net talimat | #6, #9, #14 (Google Maps bağlama talimatı), #25, #28 |
| Satıcı yardımı | #12 (RSVP formu sorununu çözdü), #14, #16 (profesyonel hizmet), #21 (İspanyolca sayfa, renk değişikliği) |
| Talimat zor | #2 ("daha kolay ve yardımcı olabilirdi") |
| Yavaşlık | #3 ("biraz yavaş") |
| Hata / sabit öğe | #4 (4★: "birkaç hata ve çok sabit öğe") |
| Renk değiştirmek zor | #23 |
| RSVP formu sorunu | #12 |
| Genel memnuniyetsizlik | #5 (video ilanı: %80 tavsiye, 4.3 ortalama) |

## 7. Bizim için çıkarımlar (öneri — karar kullanıcıda)

**Güçlü olabileceğimiz yerler (ilan dilinde kullanılabilir, iddia etmeden önce test edilmeli):**
- Canva hesabı/Canva bilgisi gerekmez; telefondan panelle düzenleme (rakiplerde düzenleme masaüstü Canva'da).
- RSVP platformun kendisinde: yanıt listesi + CSV (Google Forms kurulumu yok).
- Kişisel paylaşım önizlemesi (`og:title` = çiftin adı + tarih) ve hafif ilk açılış — **gerçek telefonda ve Vercel'de ölçülmeden
  "daha hızlı" iddiası yazılmaz** (AGENTS dürüstlük kuralı).
- Kişisel alanlar görsele pişirilmiyor → isimler, tarih/saat, mekân, program, hikâye, SSS, RSVP soruları, linkler ve fotoğraflar
  panelden değişir (rakip şikâyeti: "çok sabit öğe"). (G059 düzeltmesi) Tema başlıkları ("You are invited", "Order of the Day",
  "Will You Join Us?"…), boyalı tasarım ve renkler **sabit**; "her metin değişir" denmez (docs/05 §E).

**Pazarda standart olup bizde olmayanlar (şemaya göre, `docs/03_URUN_ICERIK_SEMASI.json`):**
- Müzik çalar — yok. Takvime ekle (.ics / Google Calendar) — (G051 ile eklendi). Adres toplama formu — yok.
- RSVP'de özel soru (menü seçimi vb.) — yok (alanlar sabit: isim, e-posta, katılım, kişi sayısı, mesaj).
- SSS metni — şemada yalnız aç/kapa (`optional_blocks.faq`), metin alanı yok (platform/README "Panel açık konuları").
- Çok dil — yalnız İngilizce yerel ayarlar (`en-US/GB/CA/AU`); rakiplerden biri İspanyolca sayfayı hizmet olarak yapıyor.
- Eşleşen Save the Date ürünü — şemada `event_type: save_the_date` var, ama ayrı tema/ilan yok.
Bunlar görev değil, **önerilen görev** adaylarıdır (görev açmak entegratörün işi).

**Riskler / karar gerektirenler:**
- Rakipler barındırma maliyeti taşımıyor (Canva barındırıyor). Bizde her satış = süresiz barındırma + Blob depolama +
  destek. **Barındırma süresi / yenileme politikası** ve ilan metnindeki karşılığı karar gerektirir.
- Fiyat bandı: pazar medyanı ~$18 (sürekli indirimle). Fiyat kararı kullanıcının; burada yalnız veri var.
- Etsy'de "Digital download" beklentisi anında erişim: alıcı PDF'i indirip hemen `/start` ile başlayabilmeli
  (G045 akışı) — ilan, PDF ve kılavuz bu akışa göre yazılmalı.
- Benzer tasarımların çok olması (PLR paketleri, aynı koleksiyon adını kullanan iki dükkân) → özgünlük kuralı (şart 6)
  ve kendi görsel üretimimiz (K21) önemli.

## 8. İncelenen 30 ilan

Fiyatlar TL (parantez içinde indirimsiz); "PDF → Canva" = PDF içinde Canva şablon linki. Linkler: `https://www.etsy.com/listing/<id>`.

| # | İlan (id) | Dükkân (ülke · puan/yorum · satış · yaş) | Fiyat TL | Ürün yorumu | Teslim / içerik | Not |
|---|---|---|---|---|---|---|
| 1 | Sage Green Ivory Floral site (4561058430) | FayeNorthStudio (ABD · 5.0/26 · 343 · 1 ay) | 177 (236) | 5.0/3 | 1 PDF → Canva; RSVP, geri sayım, müzik | "talimat net" |
| 2 | Chartreuse/Pink/Burgundy Save the Date site (4564928904) | STUDIOGWYN (ABD · 4.9/346 · 5.5k · 1 yıl) | 704 (1173) | 5.0/2 | 1 PDF → Canva; Canva/Google Forms; 250+ illüstrasyon | "sinematik zarf"; talimat şikâyeti |
| 3 | Olive & Ivory, oil painting (4526110937) | BlissoraTemplates | 433 (1238) | 5.0/10 | 2 PDF → Canva; müzik, RSVP, geri sayım, adres sayfası | "biraz yavaş"; #17 ile aynı koleksiyon adı |
| 4 | Ivory scroll-through, envelope (4575963195) | PrintServicesCo | 900 (1800) | 4.7/3 | 1 PDF → Canva | 4★: "hatalar, sabit öğeler" |
| 5 | Animated video + RSVP site + QR (4573307177) | NicolleInvites (BK · 4.6/18 · 597 · 1.5 yıl) | 186 | 4.3/6 | 1 PDF → Canva video | %80 tavsiye; renk hizmeti ayrı |
| 6 | White & Gold, RSVP + Registry (4426267576) | LoveAndVowsTemplates (ABD · 5.0/58 · 583 · 9 ay) | 898 (1796) | 5.0/8 | 1 PDF → Canva | "kolay rehber" |
| 7 | Midnight Navy & Ivory Old Money (4585879082) | ImperfectlyPaperie (ABD · 5.0/2 · 32 · yeni) | 110 (316) | — | 2 PDF; Pro gerekmez; ekran görüntülü rehber; QR | 5 sayfa |
| 8 | Dusty Blue, envelope reveal (4479528901) | HouseofIvyDesigns (ABD · 4.9/146 · 1.5k · 7 ay) | 1109 (1479) | 5.0/9 | 1 PDF; Canva RSVP + Google Forms; 100 illüstrasyon | eşleşen Save the Date |
| 9 | Countryside, RSVP + monogram (4520120960) | VeiledHaus (BK · 4.8/14 · 288 · 4 ay) | 788 (985) | 4.8/9 | 1 PDF → Canva; RSVP soruları, menü seçimi, konaklama | demo kendi alan adında |
| 10 | Moody Vintage Romance (4399595998) | BrideToBeDesignCo (Kanada · 5.0/2.4k · 28.2k · 4 yıl) | 993 | 5.0/27 | 4 PDF → Canva; hikâye, detay, RSVP, seyahat, geri sayım | pazar lideri |
| 11 | Olive Green Burgundy floral (4520625415) | TheVowHouse (ABD · 5.0/23 · 321 · 4 ay) | 96 (148) | 5.0/2 | 1 PDF → Canva | ucuz uç |
| 12 | Ivory Lace Save the Date, wax seal (4529714044) | StudioRosalunaCo (Fransa · 5.0/85 · 979 · 3 yıl) | 832 (1109) | 4.9/15 | 1 PDF → Canva; RSVP | RSVP sorunu → satıcı çözdü |
| 13 | "Fleur" minimal site (4576659945) | TheIvoryInkStudio (İspanya · 4.9/712 · 7.2k · 3 yıl) | 1560 (2080) | — | 2 PDF; 14 bölüm (zarf, hero, davetiye, geri sayım, hikâye, mekân, program, dress code, registry, konaklama, seyahat, RSVP, SSS, monogram) | en geniş bölüm listesi |
| 14 | Vintage Old Money V01 (4444037528) | HausofRosie (Avrupa · 5.0/70 · 982 · 11 ay) | 1456 (2427) | 5.0/17 | 1 PDF; RSVP + takip, geri sayım, harita rehberi | satıcı düzenlemeye yardım |
| 15 | Ivory Gold envelope + wax seal (4529735601) | Templates4branding (Fransa · 4.9/4.9k · 43.8k · 3 yıl) | 936 (1560) | 4.8/14 | 1 PDF; zarf → site; müzik, geri sayım, takvime ekle, harita; yardım merkezi | "demo'yu telefonunda dene" |
| 16 | Ivory Monogram, reveal envelope (4541549051) | HoneyCloudTemplates (ABD · 4.8/96 · 1.5k · 10 ay) | 1084 (2167) | 5.0/24 | 1 PDF; RSVP takibi, harita, müzik, takvim, registry | kurulum hizmeti övülmüş |
| 17 | "The Olive Letter" Save the Date (4494346695) | blahaus (Tayland · 4.9/238 · 4.8k · 9 ay) | 867 (1238) | 4.9/73 | 2 PDF → Canva | %98 tavsiye |
| 18 | Olive & Burgundy floral site (4400859541) | RosieCreativeStudio (Y. Zelanda · 5.0/873 · 11k · 1 yıl) | 1333 (2051) | 4.9/100 | 2 PDF; eşleşen STD + basılı davetiye; paket indirimi | "teknik bilgi gerekmedi" |
| 19 | Old Money Romantic Lace, 5 sayfa (4556046302) | PerleCreativeStudio (Kanada · 5.0/4 · 78 · 8 ay) | 1174 (1957) | — | 2 PDF → Canva | |
| 20 | Elegant Olive Save the Date (4534120277) | StudioBeUniques (ABD · 4.7/1.5k · 28.7k · 1.5 yıl) | 123 (247) | 5.0/2 | 2 PDF → Canva | hacim stratejisi |
| 21 | Ivory Neutrals lace envelope, 5 sayfa (4511930135) | OakleyCoDesigns (Kanada · 4.9/306 · 4.3k · 2.5 yıl) | 1467 (2096) | 5.0/3 | 2 PDF; dokun-aç dantel zarf, foto şeridi | İspanyolca sayfa + renk hizmeti |
| 22 | Burgundy Ivory swan floral (4525432228) | MellowCreamStudio (G. Kore · 5.0/29 · 331 · 8 ay) | 1108 (2217) | — | 1 PDF; 5 sayfa, 150+ sticker; eşleşen STD | |
| 23 | Sage & Ivory luxury, Lake Como (4502197835) | WedMuseCreative (ABD · 4.9/630 · 7.4k · 1.5 yıl) | 418 (557) | 4.9/10 | 2 PDF → Canva | "renk değiştirmek zor" |
| 24 | Burgundy Save the Date, Old Money (4562385592) | DreamyPaperAtelier (Almanya · 5.0/53 · 1.6k · 9 ay) | 961 (1281) | 5.0/1 | 2 PDF; RSVP formu | |
| 25 | White Floral STD, click-to-open (4549453177) | SundayInMay (ABD · 5.0/12 · 291 · 4 ay) | 347 (990) | 5.0/3 | 1 PDF; 3 sayfa, adres formu | "detaylı talimat" |
| 26 | Burgundy & Gold **HTML** site (4591255743) | EverAfterWeds | 62 (124) | — | **1 ZIP (HTML/CSS/JS)**, 13 bölüm; alıcı barındırır | "No Canva needed" |
| 27 | Green site, click-to-open (4555188660) | Filterity (ABD · 4.8/6.9k · 72.2k · 9 yıl) | 1040 (2080) | — | 1 PDF → Canva; trackable RSVP | "satın almadan gerçeğini dene" |
| 28 | Ivory Embossed envelope (4533446697) | BestCelebrations (Macaristan · 4.9/17k · 201.3k · 9 yıl) | 1054 (1317) | 5.0/2 | 1 PDF → Canva | dev oyuncu da Canva modeli |
| 29 | Olive Old Money "Heirloom Edition" (4535136396) | OleInkandCo (İspanya · 4.9/99 · 716 · 1 yıl) | 1083 (2166) | 5.0/11 | 3 PDF → Canva | koleksiyon adı |
| 30 | Swan Lake "One-Click" scrolling (4550839312) | Aarhusen (ABD · 5.0/13 · 264 · 4 ay) | 966 (2476) | 5.0/2 | 1 PDF; konaklama, registry, seyahat | |

Kur kaynağı: [XE USD/TRY](https://www.xe.com/en-us/currencyconverter/convert/?Amount=1&From=USD&To=TRY) (13 Eki 2026, 06:16 UTC orta kur 49.367);
[Trading Economics](https://tradingeconomics.com/turkey/currency) (12 Eki kapanış 49.33).
