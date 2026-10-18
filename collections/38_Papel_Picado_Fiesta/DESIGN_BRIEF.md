# Tasarım 38 — Papel Picado Fiesta · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (3. dalga 33–38, satır 38; K23 sıkı: ilk sayfa kapalı zarf) + G187 (platform teması).
Aşama 1 kataloğu dışında (`tools/katalog.py` `EK_TEMALAR`, 6 eksen + hareket imzası; `kontrol` D'deki 20 tasarıma ve
dalganın diğerlerine karşı denetler). Çalışma adı marka değildir.

**Ruh:** fiesta için süslenmiş güneşli bir avlu: kireç badanalı duvar, terrakota, begonvil (bugenvil), işlemeli kumaş,
başların üstünde renkli kâğıt kesim bayraklar (papel picado) ve ampul dizileri. Klasik, romantik, zengin ve geniş beğeni;
neşeli ama özenli (parti mağazası baskısı değil). Kültürel semboller yaygın ve saygılı: dini simge ve Ölüler Günü imgesi
(kafatası, iskelet, sunak) **yok**; metin İngilizce. **11 Boho Pampas'tan ayrı:** pampas/makrome/kuru ot yok, palet
çok renkli; **27 Riad'dan ayrı:** zellige/fener/sedir kapı yok; **30 Azulejo'dan ayrı:** çini yok, foto karo dönmesiyle
değil asılı kâğıt çerçeveyle; **13'ün polaroidinden ayrı:** çerçeve kâğıt kesim, ip ilmeğinden asılı, sarkaç gibi sallanır.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Dikey **kraft zarf**, **düz (V olmayan) kapak**, mühür yok; kapağı altı papel picado bayrağından bir **kemer bant** tutar. Dokununca bant gevşer (bayraklar ayrılıp eğilir), bayraklar **tek tek** zarftan kalkıp isimlerin üstünde göğe bir süs dizisi olarak dizilir ve rüzgârda **ayrı fazlarda** dalgalanır (CSS dalga), düz kapak üst kenarında **3B** kalkıp işlemeli astarını gösterir, ampul dizisi **sırayla** yanar ve zarfın arkasından sıcak ışık yükselir, kart cepten yükselir, öne gelir ve home'a uçar |
| Fotoğraf sunumu | Renkli kâğıt kesim çerçeveler üst kenarlarından ip ilmeğiyle asılı: sahnesine gelince düşüp **sarkaç gibi** sallanarak durur, sonra esintide salınır; kaydırma hızı rüzgârı artırır (`--wind`) |
| Dekor ailesi | Papel picado bayrakları, bugenvil, terrakota, ampul dizileri, işlemeli kumaş (GPT; şu an yalnız tonlanmış kâğıtlar ve düz tissue dikdörtgenleri) |
| Teknik | canlı kâğıt kesim + fotogerçekçi |
| Font | **Oleo Script** (isimler, başlıklar — el boyaması tabela yazısı) + **Alegreya** (gövde, büyük harf satırlar) — Google Fonts; 01–32'nin hiçbirinde yok |
| Ana palet (`fiesta-multicolor-terracotta`) | limewash `#F5E9D8` · cream paper `#FBF4E8` · kraft `#B78A5B` · terracotta `#B0502F` · terracotta deep `#8A3A1F` · ink (cocoa) `#3B2418` · fuchsia `#D63A7A` (metin `#C2306E`) · marigold `#F2A31B` · turquoise `#1C8F9C` · lime `#76A63A` · violet `#7A4FA0` · coral `#E85637` |
| Hareket imzası | Kemer bandın çözülmesi, bayrakların zarftan göğe uçup süs dizisine dizilmesi ve CSS dalgasıyla dalgalanması, düz kapağın 3B kalkışı, ampullerin sırayla yanması, asılı çerçevelerin düşüp sallanması ve kaydırmayla artan rüzgâr, metnin bayrak gibi üst kenarından açılması, RSVP gönderilince süzülerek düşen bayraklar |

## Sayfalar
- **index:** kireç badanalı duvar, "Together with their families", Oleo Script isimler, kapalı kraft zarf (kemer bant), altta
  tarih · şehir ve "Tap to open", köşede Skip (katalog kapağı düzeni).
- **home:** üstte süs dizisi (açılıştaki bayraklar) + ampuller → krem kart (kâğıt kesim çerçevede portre, isimler, tarih,
  mekân; köşelerde begonvil) → işlemeli kumaş kenarlı krem bantta davet ("A fiesta of love", tam adlar, üç satır tarih,
  RSVP, geri sayım, takvim) → hikâye tanıtımı (asılı çerçeve) → terrakota bantta gün → imza (ampuller, isimler, tekrar aç).
- **story:** küçük süs dizisi; üç an sol–sağ–sol, üç renk çerçeve (fuşya, turkuaz, kadife çiçeği sarısı).
- **details:** kraft kâğıtta program, her satırın başında sallanarak gelen küçük bayrak; geniş mercan çerçevede mekân
  fotoğrafı, harita, G138 blokları, travel, menü, registry, SSS.
- **rsvp:** krem form kartı, üstünde küçük süs dizisi; gönderince birkaç bayrak süzülerek düşer; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Valeria & Diego, Casa Bugambilia Courtyard, San Antonio, Texas; April 24, 2027,
  5:30 PM; URL ve medya null; demo pini San Antonio — başka temada yok)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları W1–W14, PAKET 2 örnek fotoğraflar, PAKET 6
  basılı davetiye); prova şekli `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/papel-picado-fiesta/` (README: açılış, geçici görseller, GPT gelince olanlar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
