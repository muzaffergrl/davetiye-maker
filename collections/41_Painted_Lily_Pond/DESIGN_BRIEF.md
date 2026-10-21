# Tasarım 41 — Painted Lily Pond · tasarım özeti

Kaynak: `docs/33_GPT_YENI_10_TASARIM.md` (4. dalga 39–48, akım şeridi: **empresyonist yağlı boya bahçe**; K23 sıkı: ilk
sayfa kapalı zarf). Tema id `painted-lily-pond`. Çalışma adı marka değildir. Durum: **`concept`**.

**Akım:** Etsy "wedding website template" ilk sayfasında (2026-10-21 gözlemi, `docs/13_ETSY_ARASTIRMA.md` yöntemi) öne
çıkan empresyonist yağlı boya bahçe akımı: pastel, ışıklı, nilüferli havuz ve çiçekli bahçe tablolarıyla giydirilmiş
davetiye siteleri (pazarda ünlü bir ressamın adıyla anılır; bu dosyalarda hiçbir ressam, tablo ya da gerçek bahçe adı
geçmez). **Alınan:** yalnız akım ve özellik — açık hava yağlı boya bahçe havası, tablo ile fotoğrafın iç içe geçmesi,
tıkla-aç zarf, ekranda çok fotoğraf, geri sayım, RSVP. **Alınmayan:** hiçbir satıcının düzeni, görseli, fotoğrafı, metni,
ilan adı ya da font eşleşmesi; hiçbir mevcut tablonun kopyası ya da bir sanatçıya benzeterek tarif; bilinen bir bahçe ya da köprü.
Görsel dil yalnız teknikle tarif edilir: kırık renk, kalın görünür fırça darbesi, yumuşak ışık, açık hava (plein-air).

**Ruh:** sabah ışığında nilüferli bir bahçe havuzu; suyun üstüne sarkan mor salkım (wisteria) kemeri, kıyıda söğütler,
uzakta küçük kavisli bir ahşap bahçe köprüsü. Her şey kalın, görünür, yumuşak fırça darbeleriyle boyanmış; pastel,
ışıklı, romantik. Zarf bir ressamın keten tuvalinden yapılmış gibi; açılınca fırça darbeleri ekranı tek tek boyar ve
misafir tablonun içine girer. Klasik, zengin ve geniş beğeni; sanat galerisi soğukluğu değil, bahar sabahı sıcaklığı.

**En yakın tasarımlardan farkı:**
- **03 Blush Garden Rose** — yağlı boya şakayık/gül, kemerli altın çerçeve; burada su bahçesi (nilüfer, mor salkım,
  söğüt), mavi-leylak palet, gerilmiş tuval pano ve fırça darbesiyle boyanarak açılan sahne; altın çerçeve yok.
- **37 Art Nouveau Lily** — vitray zambak, kurşun çizgi, altın kıvrımlar; burada nilüfer, empresyonist fırça, vitray/çizgi yok.
- **09 Lavender Provence** — keten kese, lavanta tarlası; burada keten-tuval portföy zarf, düz yırtık kapak + leylak mühür,
  lavanta yok.
- **02 Dusty Blue** — toz mavisi, instant baskı; burada fotoğraf "tablodan fotoğrafa" netleşen tuval panoda.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Dikey (≈0,72:1) krem **keten-tuval** portföy zarf, **düz kapak, alt kenarı yırtık (deckle)**; kapağın dış yüzü kalın fırçayla boyanmış küçük bir **nilüfer havuzu tablosu**; kapağın alt kenarının ortasında **leylak mum mühür** (nilüfer kabartmalı, harfsiz). Dokununca mühür kalkar, kapak üst katından **3B** açılır (iç yüzü leylak-mavi boya lavisi), **dört geniş fırça darbesi** (GPT, maske) zarfın arkasından **tek tek** açılıp tam ekran bahçe tablosunu boyayarak ortaya çıkarır; kart **sudan yükselir gibi** kalkar (altında CSS halka dalgası) → home |
| Fotoğraf sunumu | **Gerilmiş tuval panolar** (kenarları empresyonist bahçe boyalı, GPT pencere `#00FF00`): fotoğraf önce tabloymuş gibi belirir (CSS: bulanık + doygun + keten/fırça dokusu üstte), sonra doku erir ve keskin fotoğrafa döner ("tablodan fotoğrafa"). Mekân: geniş tuval pano |
| Dekor ailesi | Nilüfer yaprakları ve pembe nilüferler, mor salkım, söğüt dalları, uzakta kavisli bahçe köprüsü (genel), yusufçuk, geniş boya darbeleri (hepsi GPT) |
| Teknik | Empresyonist yağlı boya (kalın impasto, görünür fırça, kırık renk) + gerçek keten tuval dokusu |
| Font | **Comforter Brush** (isimler, başlıklar — fırça el yazısı) + **Arapey** (gövde; italik altyazılar) — Google Fonts |
| Ana palet (`lilypond-lilac-sage`) | pond blue `#6F8FAE` · deep pond `#3F5A73` · lilac `#B7A3CC` · wisteria `#9C86BE` · lily pink `#E8B9C1` · water green `#86A889` · canvas cream `#F4EEDF` · sun gold `#E5C77F` · ink `#2F3A45` |
| Hareket imzası | Fırça darbeleriyle boyanarak açılan sahne, sudan yükselen kart ve halka dalga, tablodan fotoğrafa netleşme, kaydırınca süzülen nilüfer yaprakları ve kanat çırpan yusufçuk, RSVP gönderilince tek küçük fırça darbesi |

**Palet (hex):** pond blue `#6F8FAE` · deep pond `#3F5A73` · lilac `#B7A3CC` · wisteria `#9C86BE` · lily pink `#E8B9C1` ·
water green (su yeşili) `#86A889` · canvas cream `#F4EEDF` · sun gold `#E5C77F` · ink `#2F3A45`. Işık: parlak sabah ışığı
**sağ üstten** (dalganın diğer tasarımlarından farklı), suda yumuşak yansımalar.

**Fontlar:** Comforter Brush (isimler ve büyük başlıklar), Arapey (gövde, italik altyazılar ve program satırları) — ikisi
de Google Fonts; font dosyası hiçbir pakete konmaz (AGENTS şart 9).

**Motifler:** nilüfer yaprağı ve pembe nilüfer, mor salkım salkımları, söğüt sarkıtları, uzakta küçük kavisli ahşap köprü
(solgun krem-gri, bilinen hiçbir köprüye benzemez), yusufçuk, geniş boya darbesi, keten tuval dokusu, leylak mum mühür.
Kişisel alanlar (isimler, tarih, baş harfler) hiçbir görselde yok; mühür harfsiz.

**Neden satar (akım gözlemine dayalı, kanıtlanmış satış iddiası değil):**
- 2026-10-21 gözleminde empresyonist bahçe görselli şablonlar ilk sayfada birden çok kez görülüyor; akım şu an görünür.
- Pastel mavi-leylak-pembe palet bahar/yaz bahçe düğünlerine geniş ölçüde uyuyor; tek renk dünyasına kilitlemiyor.
- "Tablonun içine giren" açılış ve "tablodan fotoğrafa" netleşen fotoğraflar akımın durağan görsellerinden ayrışan,
  ekranda gösterilebilir bir hareket imzası.
- Kişisel içerik HTML olduğu için alıcı ismini, tarihini ve fotoğraflarını panelden kendisi değiştirir (K24).

## Sayfalar
- **index:** keten tuval zemin; üstte "Together with their families", Comforter Brush isimler (HTML); ortada kapalı
  keten-tuval zarf (boyalı kapak + leylak mühür); altta tarih · şehir ve "Tap to open"; köşede Skip.
- **home:** üst bantta bahçe tablosu (W2) → tuval kart (tuval panoda portre, isimler, tarih, mekân; köşelerde mor salkım)
  → davet bandı (tam adlar, üç satır tarih, RSVP, geri sayım, takvim; altında nilüfer bandı) → hikâye tanıtımı (tuval
  pano) → günün ilk satırları → imza (nilüferler, isimler, tekrar aç).
- **story:** üç an sol–sağ–sol, her biri tuval panoda; tablodan fotoğrafa netleşir; aralarda süzülen nilüfer yaprakları.
- **details:** program keten tuval kâğıdında, geniş tuval panoda mekân fotoğrafı, harita, G138 blokları, travel, menü,
  registry, SSS.
- **rsvp:** tuval kâğıdı form kartı, altında nilüfer bandı; gönderince tek fırça darbesi ve süzülen yusufçuk; teşekkür
  modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Rosalie & Benjamin, The Larkspur Water Garden, Sonoma, California; May 22,
  2027, 11:00 AM; URL ve medya null; `tools/validate_content.py` GEÇTİ)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları W1–W15, PAKET 2 örnek fotoğraflar, PAKET 6
  basılı davetiye; PAKET 3/7 ilan sahneleri tema kurulunca `tools/paket7_ilan.py` ile); prova şekli
  `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/painted-lily-pond/` **henüz yok** — G441 benzeri iş (03/38 yapısı, tasarıma özgü açılış ve
  hareket imzası, `build_images.py`, `parts.css`, `layouts.ts` baskı bloğu, `EK_TEMALAR` kaydı). Durum `concept`.
