# Tasarım 29 — Celestial Observatory · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (2. dalga 29–32, satır 29) + G168 (platform teması). Aşama 1 kataloğu dışında
(`tools/katalog.py` `EK_TEMALAR`, 6 eksen + hareket imzası; `kontrol` D'deki 20 tasarıma ve dalganın diğerlerine karşı
denetler). Çalışma adı marka değildir.

**Ruh:** 18. yüzyıl yıldız atlası ve pirinç gökbilim aletleri; gece mavisi gök, gümüş-fildişi harita kâğıdı, antik pirinç
ve altın varak. Klasik, romantik, zengin ve geniş beğeni — bilimkurgu/planetaryum afişi değil (neon, renkli bulutsu,
roket yok). **19 Midnight Garden'dan ayrı:** çiçek, mum ve siyah zemin yok, nesne zarf değil gözlemevi; **22 Nocturne'den
ayrı:** göl/köşk yok, font Cinzel/Cormorant değil, açılış mühür + kapak değil kubbe yarığı + takımyıldız.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Pirinç gözlemevi kubbesi, yarık kapağı kapalı; dokununca ay ışığı pirinçten geçer, kapağın **iki yarısı** yana kayar, yarıkta gece göğü aydınlanır ve ışık yükselir, yıldızlar **tek tek** yanar, ince bir takımyıldız çizgisi onları çiftin **baş harflerine** birleştirir, gravür gök döner, kart yarıktan yükselir ve home'a uçar |
| Fotoğraf sunumu | Döner yıldız haritası (planisfer): yuvarlak foto, pirinç halka (GPT); foto "kadran süpürmesiyle" (merkez etrafında bir tur dönen konik maske) belirir, sayfa kaydırıldıkça halka ve gök döner |
| Dekor ailesi | Yıldız haritası, pirinç usturlap, gezegen yörüngeleri, ay evreleri (GPT; şu an yalnız dokular ve düz pirinç) |
| Teknik | gravür + altın varak |
| Font | Imperial Script (isimler, başlıklar) + Forum (gövde, büyük harf satırlar) — Google Fonts; 28 tasarımın hiçbirinde yok |
| Ana palet (`midnight-silver-gold`) | midnight `#11193A` · night `#0A0F24` · chart paper `#EEEBE3` · silver `#C9CFDC` · silver light `#E6E9F1` · gold `#C8A24E` · gold light `#E2C27A` · gold ink `#7A5A1E` · brass `#9B7A3C` · ink `#141A33` |
| Hareket imzası | Kubbe yarığının açılması (iki kapak yarısı), yıldızların sırayla yanması, takımyıldız çizgisinin baş harfleri birleştirmesi (canvas üstünde 1 px UI çizgisi; yıldızlar GPT), kaydırmayla dönen gök ve planisfer halkaları, kadran süpürmesiyle foto, metnin "yıldız ışığı" gibi parlak bir pırıltıdan durulması |

## Sayfalar
- **index:** gece göğü, "You are invited", Imperial Script isimler, tarih · şehir, kapalı gözlemevi, "Tap to open".
- **home:** yörüngeler (GPT) önünde harita kâğıdı kart (yuvarlak portre + halka, isimler, tarih, mekân) → harita kâğıdı
  bantta davet ("Written in the stars", ay evreleri, tam adlar, üç satır tarih, RSVP, geri sayım, takvim) → hikâye
  tanıtımı (planisfer) → günün ilk 4 satırı → imza (usturlap + baş harflerin takımyıldızı yeniden çizilir).
- **story:** üç an, sol–sağ–sol, üçü de yuvarlak planisfer; arka planda kaydırmayla dönen gravür gök (GPT).
- **details:** program harita kâğıdında (ay evreleri), mekân fotoğrafı teleskop ışını gibi soldan sağa süpürülerek,
  harita, G138 blokları, travel, menü, registry, SSS.
- **rsvp:** harita kâğıdı form; gönderince yıldızlar yükselir (GPT yıldızları gelince); teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Celeste & Rowan, Starlight Ridge Observatory Gardens, Flagstaff, Arizona;
  August 14, 2027; URL ve medya null)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları, PAKET 2 örnek fotoğraflar, PAKET 6 basılı davetiye);
  prova şekli `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/celestial-observatory/` (README: açılış, geçici görseller, GPT gelince olanlar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
