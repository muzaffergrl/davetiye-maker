# Tasarım 26 — Kintsugi & Washi · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (23–28 dalgası, satır 26) + G164 (platform teması). Aşama 1 kataloğu dışında
(`tools/katalog.py` `EK_TEMALAR`, 6 eksen + hareket imzası; `kontrol` D'deki 20 tasarıma ve dalganın diğerlerine karşı
denetler). Çalışma adı marka değildir.

**Ruh:** çivit mavisi washi kâğıdı, pirinç kâğıdı fildişi ve altın varak; sumi mürekkebinin sakinliği. Saygılı, zarif,
romantik ve geniş beğeni — kostüm/klişe değil (kimono, pagoda, fener, yelpaze, kiraz çiçeği, hat/kanji **yok**; 15 Cherry
Blossom'dan ayrı: çiçek değil kâğıt, renk pembe değil çivit-altın, açılış zarf değil katlı kâğıt).

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Çivit washi kâğıdı origami gibi bir pirinç kâğıdı kartın üstüne katlanmış, ortasında pirinç kâğıdı kuşak; dokununca kuşak kayar, katlar **tek tek** açılır (üst → alt → sol → sağ; her kat 90°'den sonra açık renkli içini gösterir), kart kalkar ve home'a uçar |
| Fotoğraf sunumu | Mürekkep yayılması maskesi: foto merkezinden yayılan mürekkep lekesiyle belirir; Story'de sol–sağ–sol tek tek, home ve details'te de aynı |
| Dekor ailesi | Altın kintsugi damarları, washi dokuları, sumi fırça darbeleri (GPT; şu an yalnız kâğıt dokuları) |
| Teknik | sumi mürekkep + altın varak |
| Font | Shippori Mincho (gövde, büyük harf satırlar) + Allura (isimler, başlıklar) — Google Fonts, latin-ext |
| Ana palet (`indigo-gold-rice`) | indigo `#242E58` · night `#161C36` · inner indigo `#3C4874` · rice `#F3ECDC` · gold `#C9A55A` · gold light `#E3C987` · gold ink `#7A5C22` · ink `#1D2340` |
| Hareket imzası | Kat kat 3B açılma (dört kat ayrı menteşede), altın damar parıltısı (şimdilik kâğıt üstünde kenarsız ışık), mürekkep yayılımıyla foto, süzülen altın varak pulları (sprite gelince) |

## Sayfalar
- **index:** kapalı katlı paket, "You are invited", Allura isimler, tarih · şehir, "Tap to open".
- **home:** çivit zemin üstünde pirinç kâğıdı kart (portre, isimler, tarih, mekân) → pirinç kâğıdı bantta davet
  (tam adlar, üç satır tarih, RSVP, geri sayım, takvim) → hikâye tanıtımı → günün ilk 4 satırı → imza.
- **story:** üç an, sol–sağ–sol; mürekkep yayılımı.
- **details:** program pirinç kâğıdında, mekân fotoğrafı mürekkeple, harita, G138 blokları, travel, menü, registry, SSS.
- **rsvp:** pirinç kâğıdı form; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Naomi & Kai, Stillwater Garden Pavilion, Hood River, Oregon; URL ve medya null)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları, PAKET 2 örnek fotoğraflar, PAKET 6 basılı davetiye)
- Tema: `platform/themes/kintsugi-washi/` (README: açılış, geçici kâğıt, GPT gelince yapılacaklar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
