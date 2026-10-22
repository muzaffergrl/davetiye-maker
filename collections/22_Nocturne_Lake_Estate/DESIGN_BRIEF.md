# Tasarım 22 — Nocturne Lake Estate · tasarım özeti (yeniden tasarım, 2026-10-22)

Kaynak: `docs/35_22_32_YENIDEN_TASARIM.md` (§3 ortak kalite standardı, §4 satır 22). Önceki sürüm (Codex `envelope-v3`
kapağı, 18–20 Ekim) katalogda "amatör" bulundu; bu sürüm 39–48 hattıyla baştan kurulur. Tema id
`nocturne-lake-estate`. Çalışma adı marka değildir.

**Ruh:** Gece yarısına doğru göl kıyısındaki bir villanın terası: kömür siyahı laid kâğıt, şampanya altını, mum ışığının
suya düşen titrek yolu, dağların koyu silueti. Black tie akşam düğünü; sessiz, derin, romantik lüks. Klasik, zengin ve
geniş beğeni (AGENTS şart 5) — gotik değil, gece kulübü değil, neon yok. Işık tek: **ılık mum ışığı sağ alttan + soğuk ay
ışığı sol üstten** (bütün parçalarda aynı).

**En yakın tasarımlardan farkı:**
- **19 Midnight Garden:** o çiçek bahçesi + siyah zemin; burada çiçek yalnız küçük köşe süsü, asıl dil göl, dağ, villa
  penceresi ve vellum gravür.
- **29 Celestial Observatory:** orada gece mavisi gök atlası, pirinç usturlap; burada kömür siyahı + şampanya, ay yalnız
  tek bir altın hilal broş, yıldız haritası yok.
- **42 Espresso Pastoral:** orada V kapak üstünde krem **dantel bant** + kuru çiçek demeti; burada derin **elmas kapak**,
  kapanış gümüşle kazınmış saydam **vellum bant** + dövme altın **hilal broş**.
- **01–21:** V kapak + mum mühür yok; mühür yerine broş, kapak sivri baklava (yanlar dik düşer, kenarlar içbükey).
- **47 Monochrome Darkroom:** orada siyah fotoğraf kâğıdı + negatif; burada sıcak altın-fildişi, yağlı boya göl astarı.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Dikey **kömür-siyah laid kâğıt zarf** (≈0,72:1), **derin elmas (sivri baklava) kapak**: yanlar kısa dik iner, sonra iki hafif içbükey kenar ortada derin sivri uçta birleşir; kenarında şampanya altın **deckle folyo**. Kapanış: zarfın alt-ortasını yatay saran **buzlu vellum bel bandı** (gümüşle kazınmış göl–dağ–selvi–villa panoraması) ve bandın ortasına iğneli **dövme altın hilal broş**. Dokununca: hilal parlar → broş kalkar, yavaşça yukarı süzülür ve ekranın üstünde "ay" olarak kalır (home'da da) → vellum bant aşağı kayıp söner → elmas kapak 3B açılır; iç yüzü **gece göğü ve dağlar** (yağlı boya), zarfın astarı **göl, villa ışıkları ve ay yolu** — açıkken ikisi tek tablo gibi birleşir → fildişi kart cepten yükselir, öne gelir → astardaki suda ışık kıpırdar; altın pul, mum kıvılcımı ve beyaz gül yaprağı süzülür → home |
| Fotoğraf sunumu | Varaklı ferforje **villa pencereleri**: home portresi **kemerli pencere** + küçük balkon korkuluğu; story'de dikdörtgen pencere, önünde iki **kömür lake panjur** — panjurlar iki yana açılır, foto mum ışığı sıcaklığından netleşir; mekân: geniş, altında taş **korkuluk** olan teras çerçevesi |
| Dekor ailesi | Elmas kapaklı zarf, vellum gravür panorama, altın hilal broş, ferforje pencere + panjur, taş korkuluk, fener içinde mum, beyaz bahçe gülü + zeytin dalı (yalnız köşe süsü), şampanya altın pul |
| Teknik | Fotogerçekçi kırtasiye ürün çekimi (laid kâğıt, vellum, dövme altın, lake ahşap) + yağlı boya gece manzarası (astar, kapak içi, home bandı) |
| Font | **Cinzel** (isimler, başlıklar) + **Cormorant Garamond** (gövde, italik vurgu) + **Jost** (küçük büyük harf etiketler) — Google Fonts; mevcut temayla aynı |
| Ana palet | night `#11120F` · charcoal `#1C1D15` · champagne `#E0C7A4` · gold `#C7A978` · ivory `#F1E4CC` (+ yalnız vellum gravürü için silver `#BFC3C6`) |
| Hareket imzası | Hilal broşun "ay doğar gibi" yükselip üstte kalması, vellum bandın kayıp sönmesi, elmas kapağın gece göğünü açması, sudaki ay yolunun kıpırtısı (CSS maske süpürmesi), story'de panjurların açılması, imzada fener alevinin titremesi |

## Palet
- night `#11120F` — en koyu zemin, gölge, metin (fildişi kart üstünde)
- charcoal `#1C1D15` — sayfa zemini (laid kâğıt), zarf kâğıdı, panjurlar
- champagne `#E0C7A4` — koyu zeminde isimler ve metin, ince çizgiler
- gold `#C7A978` — folyo deckle, broş, ferforje, ayırıcı
- ivory `#F1E4CC` — kart, form, iç bantlar, gül
- silver `#BFC3C6` — yalnız vellum bant gravürü
- Işık: ay ışığı **sol üstten** (soğuk, yumuşak) + mum ışığı **sağ alttan** (ılık, sönük); bütün parçalarda aynı.

## Fontlar
- **Cinzel** — isimler ve sayfa başlıkları (büyük harf, geniş aralık).
- **Cormorant Garamond** — gövde, italik "We're getting married", program.
- **Jost** — küçük büyük harf etiketler (tarih · şehir, "Tap to open", nav).
- Google Fonts; font dosyası hiçbir pakete girmez (AGENTS şart 9).

## Motifler
Elmas kapaklı kömür laid zarf + altın deckle folyo · buzlu vellum bant üstünde gümüş gravür göl panoraması · dövme altın
hilal broş · yağlı boya gece gölü (astar) ve gece göğü (kapak içi) · kemerli ferforje villa penceresi · kömür lake panjurlar ·
taş korkuluk · cam fener içinde mum · beyaz bahçe gülü + gümüşi zeytin dalı (köşe) · şampanya altın pul. Yazı, rakam,
monogram, logo, QR hiçbir görselde yok; isimler ve tarih HTML.

## Neden satar (gözleme dayalı gerekçe; satış iddiası değil)
- Koyu, "old money" akşam düğünü estetiği (siyah + şampanya altın) pazarda çok aranan black-tie çizgisiyle uyumlu
  (`docs/13`); katalogdaki açık fildişi kapakların arasında koyu kapak dikkat çeker.
- Kapanış tek bakışta anlaşılır ve akılda kalır: altın hilal "ay doğar gibi" yükselir, zarfın içi gece gölüne açılır.
- Pazarın giriş bileti korunur (tıkla-aç zarf, geri sayım, RSVP); fark malzemede ve tek bir anda.

## Sayfalar
- **index:** kömür laid zemin (seyrek altın pul), "Together with their families", Cinzel isimler (şampanya, HTML), ortada
  vellum bantlı + hilal broşlu kapalı elmas zarf, altta "September 18, 2027 · Lake Como" ve "Tap to open", köşede Skip
  hapı ve ses düğmesi. Çiçek tam ekran yok.
- **home:** üstte yağlı boya gece gölü bandı (broş "ay" olarak üstünde) → fildişi kart (kemerli pencerede portre, isimler,
  tarih, mekân; köşelerde gül + zeytin) → davet bandı (tam adlar, tarih, RSVP, geri sayım, takvim) → hikâye tanıtımı
  (panjurlu pencere) → günün özeti → imza (fener, isimler, "Open the envelope again").
- **story:** üç an sol–sağ–sol, her biri panjurlu ferforje pencerede; panjurlar kaydırmayla açılır.
- **details:** fildişi program kartı (zeytin dalı ayırıcı), korkuluklu teras çerçevesinde mekân, harita, G138 blokları
  (travel, dress code "Black tie", registry, SSS).
- **rsvp:** fildişi form kartı; gönderince fener alevi büyür ve altın pullar süzülür; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Eleanor Grace Hart & Luca Matteo Conti, Villa Nocturne, Lake Como, Lombardy,
  Italy; September 18, 2027, 6:30 PM, Europe/Rome; URL'ler null) — değişmedi.
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5R website katmanları W1–W19 = 22 dosya, PAKET 2 örnek fotoğraflar
  **var**, PAKET 6R basılı davetiye ön/arka, PAKET 3 GEÇERSİZ); prova şekli `assets/gpt/kuru_sekil.json`.
- Görevler: GPT parçaları **G222–G232** (bu tasarım G222), tema yeniden kurulumu **G422–G432** (bu tasarım G422).
- Tema: `platform/themes/nocturne-lake-estate/` **yeniden kuruldu** (G422, 2026-10-22; 39 pilot yapısı, `docs/34`, pilot
  G423 dersleri `docs/35` §6a) — GPT parçaları G222 (PAKET 5R 22 dosya, PAKET 6R 2 dosya). Durum: **editable_draft**,
  katalogda `preview` ("Coming soon"); satış yok. Katalog kapak görüntüsü/klibi henüz eski (yeniden yakalama bekliyor).
