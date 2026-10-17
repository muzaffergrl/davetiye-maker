# Tasarım 31 — Sky Lantern Festival · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (2. dalga 29–32, satır 31) + G170 (platform teması, GPT parçalarından önce kuruldu).
Katalog: `tools/katalog.py` `EK_TEMALAR` (6 eksen + hareket imzası; `kontrol` D'nin 20 tasarımına ve dalganın eksenli
kayıtlarına karşı ≥ 4 eksen farkını denetler). Çalışma adı marka değildir.

**Ruh:** günün son dakikaları — mordan gün batımı pembesine, ufukta kehribara dönen suluboya bir gök; avuçlarda tutulan sade
bir pirinç kâğıdı fener; dokununca ışır ve göğe yükselir, arkasından uzak fenerler süzülür. Klasik, romantik, zengin; geniş
beğeni. **Kültürel olarak nötr:** belirli bir festivalin, ülkenin ya da inancın simgesi yok (yazı/karakter, tapınak, ejderha,
kostüm, kalabalık yok); fener sade, yuvarlak hatlı, desensiz.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Avuçlarda sönük bir kâğıt fener; dokununca içeriden ışır, hâlesi büyür, avuçlar açılıp aşağı iner, fener hafifçe sallanarak ekranın üstünden çıkar; gök ve yıldız tozu farklı hızlarda aşağı kayar (paralaks), üç uzak fener yükselir; fenerin bıraktığı ışıkta pirinç kâğıdı kart belirir → öne gelir → home |
| Fotoğraf sunumu | Fener yolu: fotoğraflar karanlıkta bekler, küçük bir fener yanından yükselir ve ışığı fotoğrafı alttan yukarı açar (yumuşak ışık dairesi büyür); telefonda sol–sağ–sol, geniş ekranda üçlü (ortadaki yukarıda) |
| Dekor ailesi | Pirinç kâğıdı fenerler, alacakaranlık gökyüzü, yıldız tozu |
| Teknik | suluboya + ışık |
| Font | Corinthia (isimler, el yazısı) + Bellefair (başlık, gövde, büyük harf etiketler) — Google Fonts, pakete konmaz; 23–32 dahil hiçbir tasarımda yok (Gilda Display ilk seçimdi; 32 Music Box da onu aldığı için birleştirmede değiştirildi) |
| Ana palet | dusk violet `#2B1F45` · deep `#1B1430` · lantern amber `#F2A65A` · glow `#FFD08A` · dusky rose `#E7B4A6` · rice paper `#F7EEDD` · ink `#3B2A4A` |
| Hareket imzası | fener yükselişi (paralaks katmanlar: gök, yıldız tozu, uzak fenerler) · sıcak ışık hâlesi (nefes alır gibi) · kaydırdıkça süzülen birkaç fener (az, hafif; hareket azaltmada yok) · programda satır satır yanan fenerler · RSVP'de göğe bırakılan tek fener |

**Diğerlerinden ayrım:** 27 Riad Lantern Nights'ın pirinç delikli metal feneri, kapıları ve çinisi değil (kâğıt fener, açık gök,
kapı yok; ışık içeriden kâğıda vurur); 19 Midnight Garden'ın siyah-koyu gül gecesi değil (alacakaranlık moru, pembe, kehribar);
26 Kintsugi'nin çivit washi katları değil (açılış katlanma değil, yükselme). 29 Celestial Observatory'nin pirinç gözlemevi ve
yıldız haritası değil (gök suluboya, alet/harita yok).

## Sayfalar
- **index:** alacakaranlık göğü (paralaks katmanları), "UNDER THE EVENING SKY", isimler (Corinthia), avuçlarda sönük fener, "Tap to open".
- **home:** gökte pirinç kâğıdı kart (portre, isimler, tarih, mekân) → davet (tam adlar, tarih bloğu, mekân, RSVP, geri sayım,
  takvim) → fenerlerle açılan üç fotoğraf → alacakaranlık bandı (program) → imza; sayfa boyunca kaydırdıkça süzülen birkaç fener.
- **story:** fener yolu boyunca üç fotoğraf (sol–sağ–sol), her biri yükselen fenerin ışığında açılır; görüntüleyici.
- **details:** her satırında sırayla yanan küçük bir fener olan program, fener ışığında açılan mekân fotoğrafı, harita, takvim,
  kıyafet, bloklar, travel, menü, registry, SSS.
- **rsvp:** sıcak fener hâlesi altında yarı saydam yanıt paneli, ortak form; gönderince bir fener göğe yükselir.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Sophie & Daniel, The Meadowlark Terrace, Santa Barbara, California, September 18,
  2027; URL'ler `null`; örnek fotoğraf yok — PAKET 2 bekliyor)
- GPT: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları, PAKET 2 örnek fotoğraflar, PAKET 6 basılı davetiye);
  kuru prova şekli `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/sky-lantern-festival/` (README: açılış, geçici parçalar, sapmalar)
- İlan taslağı: `package/listing/listing_v3.md` (K41: yayımlanmadı)
