# Tasarım 31 — Sky Lantern Festival · tasarım özeti (yeniden tasarım, 2026-10-22)

Kaynak: `docs/35_22_32_YENIDEN_TASARIM.md` (§3 ortak kalite standardı, §4 satır 31; kullanıcı 2026-10-22: 22–32 "çok
amatör", komple elden geçsin). İlk sürüm `docs/24_YENI_TASARIMLAR.md` (2. dalga, G170) ve Codex `envelope-v3` kapağı
(18–20 Ekim) **geçersiz**: tema 39 pilotunun yapısıyla yeniden kurulacak (**G422–G432**, bu tasarım G431), GPT parçaları
**G222–G232** (bu tasarım G231). Tema id `sky-lantern-festival`. Çalışma adı marka değildir. Durum: `coming`.

**Akım:** alacakaranlıkta açık hava düğünü, dilek fenerleri, elle boyanmış washi kâğıt. **Alınan** yalnız his: günün son
dakikalarının mor-pembe-kehribar ışığı, dilek tutma anı, sıcak kâğıt ışığı, tıkla-aç zarf. **Alınmayan:** hiçbir ilanın
düzeni, çizimi, fotoğrafı, font eşleşmesi ya da adı.

**Ruh:** güneş tepelerin ardına yeni inmiş; gök menekşeden gül pembesine, ufukta kehribara dönüyor. Masada elle daldırılarak
boyanmış (dip-dyed) bir washi zarf duruyor; üstünde, kehribar ipek iplikle altın bir çiviye bağlı, sönük, küçük bir pirinç
kâğıdı gökyüzü feneri. Dokununca fener içeriden ışır, ip çözülür ve fener salınarak göğe yükselir; arkasından uzakta başka
fenerler süzülür. Klasik, romantik, zengin ve geniş beğeni (AGENTS şart 5). **Kültürel olarak nötr:** belirli bir
festivalin, ülkenin ya da inancın simgesi yok (yazı/karakter, tapınak, pagoda, ejderha, kostüm, kalabalık, dini simge yok);
fener sade, yuvarlak hatlı, desensiz pirinç kâğıdı.

**En yakın tasarımlardan farkı:**
- **27 Riad Lantern Nights:** orada delikli pirinç fener bir **tılsım**, kordona asılı kalır ve yalnız yanar; burada fener
  pirinç kâğıdından bir **gökyüzü feneri**, zarfın kapanışıdır ve ip çözülünce **uçup gider**. Teal/safran/zellige ve at nalı
  kemer yok; kapak yumuşak fener karnı kavisi, kenarı elle yırtılmış washi lifi.
- **29 Celestial Observatory:** pirinç alet, usturlap, yıldız haritası, gravür yok; gök elle boyanmış washi, yıldızlar
  yalnız astarda minik altın varak pulları.
- **26 Kintsugi & Washi:** çivit, altın damar, fırıldak katlama ve porselen düğme yok; washi burada dip-dye alacakaranlık
  gradyanı, zarf tek kapaklı, açılış katlanma değil **yükselme**.
- **39 Silver Photo Booth (U kapak):** buradaki kapak simetrik fener karnı eğrisi + tüylü yırtık lif kenar; mühür/şerit yok.
- **19 Midnight Garden:** siyah zemin ve koyu güller değil; mor-pembe-kehribar alacakaranlık.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Dikey **dip-dye washi zarf** (≈0,7:1; mor → gül → kehribar), **fener karnı kavisli kapak** (yanlarda %36'da, ortada geniş yuvarlak dip %60), serbest kenarı elle yırtılmış tüylü washi lifi. Kapanış: ön cepteki **altın kubbe çiviye** kehribar ipek iplikle bağlı, kapağın ucunu örten **sönük pirinç kâğıdı gökyüzü feneri**. Dokununca fener içeriden ışır (sönük → yanık GPT çifti) → ipek fiyonk gevşer, iplik fenerle yukarı kayıp söner → fener hafif salınımla yükselir ve ekranın üstünden çıkar; arka planda üç uzak fener yükselir → kapak üst katlama çizgisinde **3B** açılır, iç yüzü gül-kehribar washi + altın pullar → pirinç kâğıdı kart cepten yükselir, dudağı geçince öne gelir → home |
| Fotoğraf sunumu | **Fener paneli:** fotoğraflar pirinç kâğıdı + ince bambu çerçevelerde karanlıkta bekler; panelin altından sıcak bir ışık dairesi büyüyerek fotoğrafı alttan yukarı açar (CSS maske). Home portresi fener silüetli kemerli pencerede; story'de asılı pirinç kâğıdı paneller sol–sağ–sol, geniş ekranda üçlü; mekân geniş bambu çubuklu panelde |
| Dekor ailesi | Pirinç kâğıdı gökyüzü fenerleri (yakın + uzak), dip-dye washi, kehribar ipek iplik, altın kubbe çivi, altın varak pulları, dilek tohumu (karahindiba), gül pembesi bahçe gülleri + çayır otları (tek, ölçülü köşe süsü), minik fener dizisi ayırıcı |
| Teknik | Fotogerçekçi kâğıt/ipek/altın ürün çekimi (washi lifleri, pirinç kâğıdı, bambu, ipek) + ışık; astardaki gök elle boyanmış washi baskısı |
| Font | **Corinthia** (isimler, el yazısı) + **Bellefair** (başlık, gövde, büyük harf etiketler) — Google Fonts, pakete konmaz |
| Ana palet | dusk violet `#2B1F45` · deep `#1B1430` · violet `#4A3466` · dusky rose `#E7B4A6` · lantern amber `#F2A65A` · glow `#FFD08A` · rice paper `#F7EEDD` · ink `#3B2A4A` (+ altın varak vurgusu, yalnız çivi, pul ve ince çizgilerde) |
| Hareket imzası | Fenerin içeriden yanması + ipin çözülüp fenerin salınarak göğe yükselmesi (uzak fenerlerle paralaks), fener karnı kapağın 3B açılışı, fotoğrafların alttan büyüyen sıcak ışık dairesiyle açılması, programda satır satır yanan minik fenerler, RSVP'de göğe bırakılan tek fener, süzülen dilek tohumları |

## Palet
- dusk violet `#2B1F45` — kapak/sayfa zemininin üstü, zarfın üst tonu
- deep `#1B1430` — en koyu gök, gölge
- violet `#4A3466` — gradyan ortası, ikincil metin zemini
- dusky rose `#E7B4A6` — gradyanın gül bandı, köşe gülleri, kapak iç yüzü
- lantern amber `#F2A65A` — ufuk, ipek iplik, vurgu
- glow `#FFD08A` — yanık fenerin içi, ışık daireleri
- rice paper `#F7EEDD` — kart, fener kâğıdı, paneller
- ink `#3B2A4A` — kart üstü metin
- Işık: alacakaranlığın yumuşak son ışığı **sol üstten**; yanık fener ışığı yalnız kendi kâğıdının içinde (hâleyi site ekler).

## Fontlar
- **Corinthia** — isimler, başlıklar.
- **Bellefair** — gövde, büyük harf satırlar, tarih ve program.
- Google Fonts; font dosyası hiçbir pakete girmez (AGENTS şart 9).

## Motifler
Dip-dye alacakaranlık washi (lifler görünür) · fener karnı kavisli, tüylü yırtık kenarlı kapak · altın kubbe çivi + kehribar
ipek iplik fiyonk · sönük ve yanık pirinç kâğıdı gökyüzü feneri (ince bambu kaburgalar, alt tel halka) · uzak, küçük yanık
fenerler · altın varak pulları · karahindiba dilek tohumu · gül pembesi bahçe gülleri + açık çayır otları · minik yanık fener
dizisi. Yazı, rakam, karakter, monogram, logo, QR hiçbir görselde yok; isimler ve tarih HTML.

## Neden satar (gözleme dayalı gerekçe; satış iddiası değil)
- Açılışın tek akılda kalan anı — **fenerin ışıyıp göğe uçması** — kapanışın kendisi; tıkla-aç zarf (pazarda giriş bileti)
  korunur, üstüne duygusal bir "dilek" anı eklenir.
- Gün batımı / alacakaranlık düğünleri (bahçe, teras, kır) geniş bir kitle; mor-pembe-kehribar palet fotoğraflarda sıcak.
- Koyu-orta tonlu kapak katalogda 22–32'nin açık kapakları arasında ritim yaratır (docs/35 §3).
- Kültürel olarak nötr: herhangi bir ülke ya da inançla bağlanmaz.

## Sayfalar
- **index:** dip-dye alacakaranlık washi zemin (üstte menekşe, altta kehribar), "Together with their families", Corinthia
  isimler (HTML), ortada fenerli kapalı zarf (ekran eninin ~%74'ü, üstte açık kapak boyu kadar pay), altta "September 18,
  2027 · Santa Barbara" ve "Tap to open", köşede Skip hapı + ses düğmesi.
- **home:** üstte açılışta yükselen fener küçülüp "ay" gibi asılı kalır → pirinç kâğıdı kart (fener silüetli portre penceresi,
  isimler, tarih, mekân; köşede tek gül süsü) → davet bandı (tam adlar, tarih, RSVP, geri sayım, takvim; fener dizisi
  ayırıcı) → hikâye tanıtımı (asılı panel, ışık dairesiyle açılır) → gün özeti (satır satır yanan minik fenerler) → imza
  (yanık fener, isimler, "Replay the envelope").
- **story:** üç an sol–sağ–sol, asılı pirinç kâğıdı panellerde; her biri alttan büyüyen sıcak ışık dairesiyle açılır; arka
  planda kaydırdıkça yavaş yükselen 2–3 uzak fener (hareket azaltmada yok).
- **details:** program (her satırda yanan minik fener), geniş bambu panelde mekân fotoğrafı, harita, G138 blokları (travel,
  dress code, menü, registry, SSS).
- **rsvp:** pirinç kâğıdı form kartı; gönderince bir fener yanar ve göğe yükselir; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Sophie & Daniel, The Meadowlark Terrace, Santa Barbara, California; September
  18, 2027, 6:30 PM, America/Los_Angeles; URL ve medya null) — değişmedi.
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5R website katmanları W1–W19 = 21 dosya, PAKET 2 beş örnek fotoğraf
  **var**, PAKET 6R basılı davetiye ön/arka); prova şekli `assets/gpt/kuru_sekil.json`.
- Tema: `platform/themes/sky-lantern-festival/` **yeniden kuruldu** (G431, 2026-10-22; 39 pilot yapısı, `docs/34`, pilot
  dersleri `docs/35` §6a) — GPT parçaları G231 (PAKET 5R 21 dosya, PAKET 6R 2 dosya). Durum: **editable_draft**, katalogda
  `preview` ("Coming soon"); satış yok. Katalog kapak görüntüsü/klibi henüz eski (yeniden yakalama bekliyor).
- Etsy ilanı ve PAKET 3/7 ilan sahneleri: tema kurulunca yeniden (`tools/paket7_ilan.py`); `package/listing/listing_v3.md`
  yayımlanmadı (K41).
