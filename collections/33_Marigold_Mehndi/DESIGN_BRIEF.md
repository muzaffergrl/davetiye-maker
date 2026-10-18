# Tasarım 33 — Marigold & Mehndi · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (3. dalga 33–38, satır 33; K23 sıkı) + G182 (platform teması). Aşama 1 kataloğu
dışında (`tools/katalog.py` `EK_TEMALAR`, 6 eksen + hareket imzası; `kontrol` D'deki 20 tasarıma ve dalganın diğerlerine
karşı denetler). Çalışma adı marka değildir.

**Ruh:** Rajasthan havelisinde şenlikli bir kına / düğün davetiyesi: fuşya ipek, altın lazer kesim paisley, kadife
çiçeği çelenkleri, kına desenleri, pirinç diya kandilleri ve oymalı jharokha kemerleri. Klasik, romantik, zengin ve
geniş beğeni — Bollywood afişi, neon ya da çizgi film değil. **Kültürel tema:** semboller yaygın ve saygılı (çiçek,
kına, kandil, kemer, ipek); **dini simge yok** (Om, tanrı figürü, tapınak, kutsal ateş, kalaş yok); metin İngilizce.
**27 Riad Lantern'dan ayrı:** fas kapısı, fener, teal yok; **01–32'nin zarfından ayrı:** V kapak ve mum mühür yok —
düz kapaklı dikey ipek zarf, kapanış = altın kılıf + ipek püskül.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Dikey fuşya ipek zarf, düz üst kapak; ortasına sarılı altın lazer kesim paisley **kılıf** kapağın alt kenarını tutar, kılıftan **ipek püskül** sarkar. Dokununca püskül **sarkaç gibi** sallanıp söner, kılıf **yana kayar** (önce hafifçe sola çekilir), düz kapak üst kenarında 90°'ye döner ve **kadife iç yüzüne devreder**, kadife-fuşya astar ısınır, **kadife çiçeği yaprakları** dönerek süzülür, zarfın altındaki **diya alevleri tek tek** yanar, kart astardan yükselir (ayağı cebin arkasında), öne gelir ve home'a uçar |
| Fotoğraf sunumu | Jharokha (Rajasthan pencere kemeri) çerçeveler: foto kemerli pencere maskesiyle (GPT penceresinden); foto alttan yukarı **ıslak kına akar gibi** belirir, kemerin çevresindeki kına deseni **çizgi çizgi** (adımlı maske) akar |
| Dekor ailesi | Kadife çiçeği çelenkleri, kına desenleri, pirinç diya kandilleri, ipek püsküller (GPT; şu an yalnız dokular ve düz altın) |
| Teknik | zengin minyatür + fotogerçekçi ipek |
| Font | Rozha One (isimler, başlıklar) + Yrsa (gövde) — Google Fonts; 01–32'nin hiçbirinde yok (docs/24'teki Cormorant Infant 17'de kullanıldığı için Yrsa) |
| Ana palet (`saffron-fuchsia-gold`) | fuchsia silk `#B3165E` · velvet `#5C0A36` · velvet plum `#3E0726` · fuchsia ink `#8E1048` · saffron `#F2A13B` · saffron light `#F7C27A` · paper `#FAEBD0` · gold `#C9A24A` · gold light `#EBCD84` · gold ink `#8A5A12` · ink `#3A0F24` |
| Hareket imzası | Püskül sarkacı, kılıf kayması, kapağın kadife yüzüne devretmesi, süzülen kadife çiçeği yaprakları, diya alevlerinin sırayla yanması, kına çizgisinin kemer çevresinde akması, metnin kılıf gibi yandan kayarak yerleşmesi |

## Sayfalar
- **index (K23 sıkı, katalog kapağı düzeni):** fuşya kadife; üstte "Together with their families", "invite you to
  celebrate", Rozha One isimler; ortada kapalı zarf (kılıf + püskül); altında diya sırası; tarih · şehir, "Tap to open";
  köşede Skip.
- **home:** kadife çiçeği çelengi altında safran kâğıt kart (jharokha portre + kına, isimler, tarih, mekân) → safran
  bantta davet ("Let the celebrations begin", tam adlar, üç satır tarih, RSVP, geri sayım, takvim) → hikâye tanıtımı
  (jharokha) → günün ilk 4 satırı → imza (5 diya sırayla yanar).
- **story:** üç an, sol–sağ–sol, üçü de jharokha; arka planda soluk kına deseni (GPT).
- **details:** program safran kâğıtta (küçük çelenk), mekân fotoğrafı soldan sağa kına çizgisi çekilir gibi, harita,
  G138 blokları, travel, menü, registry, SSS.
- **rsvp:** safran kâğıt form; 3 diya; gönderince kadife çiçeği yaprakları yağar (GPT yaprakları gelince); teşekkür modu
  kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Anaya & Kabir, Gulmohar Haveli Gardens, Jaipur, Rajasthan, India;
  November 20, 2027; URL ve medya null)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları W2.1–W2.16, PAKET 2 örnek fotoğraflar, PAKET 6
  basılı davetiye); prova şekli `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/marigold-mehndi/` (README: açılış, geçici görseller, GPT gelince olanlar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
