# Tasarım 34 — Red Lacquer & Double Happiness · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (3. dalga 33–38, satır 34; K23 sıkı: ilk sayfa kapalı zarf) + G183 (platform teması).
Aşama 1 kataloğu dışında (`tools/katalog.py` `EK_TEMALAR`, 6 eksen + hareket imzası; `kontrol` D'deki 20 tasarıma ve
dalganın diğerlerine karşı denetler). Çalışma adı marka değildir.

**Ruh:** Çin düğün geleneğinin yaygın ve saygılı sembolleri — kırmızı kâğıt zarf, altın varak 囍 (çifte mutluluk),
kâğıt kesim (jianzhi) şakayıklar, kırmızı lake, altın bulut motifleri, püsküllü düğüm. Klasik, romantik, zengin ve geniş
beğeni; metin İngilizce; dini simge yok. **21 Crimson Rose'dan ayrı:** gül, V kapak, mum mühür yok; **31 Sky Lantern'dan
ayrı:** uçan fener ve alacakaranlık gökyüzü yok; **01–32'nin zarfından ayrı:** zarf dikey, kapanış ip-düğme, açılış kâğıt
kesim pencere katlarından.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Dikey kırmızı kâğıt zarf, cepte altın varak 囍, ip-düğme kapama. Dokununca kapak düğmesi iki tur dönerken ip çözülür, kayar ve düşer; kapak katından 180° kalkar (iç yüzü görünür); kart iki kâğıt kesim şakayık penceresine sarılı yükselir; önce kırmızı, sonra altın pencere iki kanat hâlinde dış kenarlarından açılır; altın bulutlar süzülür; kart öne gelir, zarf aşağı çekilir → home |
| Fotoğraf sunumu | Ay kapısı (moon gate) yuvarlak çerçeveler (GPT); fotoğrafın üstündeki iki kırmızı kâğıt kapı kanadı yana kayarak açılır; mekân fotoğrafı kafes kapılarla |
| Dekor ailesi | Şakayık, kâğıt kesim desenleri, kırmızı lake, altın bulut motifleri, püsküllü düğüm (GPT; şu an yalnız dokular ve düz kırpımlar) |
| Teknik | kâğıt kesim + lake + altın varak |
| Font | Luxurious Script (isimler, başlıklar) + Prata (gövde, büyük harf satırlar) — 01–32'de yok. docs/24'teki Noto Serif Display 15'te kullanıldığı için seçilmedi. Ma Shan Zheng yalnız 囍 karakteri için (geçici; GPT altın varak parçası gelince kalkar) |
| Ana palet (`lacquer-red-gold-cream`) | lacquer `#4A0A0E` · lacquer deep `#2C0507` · cinnabar `#A81E24` · red ink `#8C1A1F` · cream `#F5ECD8` · cream shade `#E9DCC0` · gold `#C9A14A` · gold light `#E6C983` · gold ink `#8A5F1C` · ink `#3A0D0E` |
| Hareket imzası | İpin düğmeden dönerek çözülmesi, kapağın katından kalkması, kâğıt kesim pencere katlarının kanat kanat açılması, altın bulutların süzülmesi, iki hızda kayan kâğıt kesim katmanlar (paralaks), ay kapısı kanatlarıyla foto, metnin üst kenarından katlanarak açılması, sallanan püsküllü düğüm |

## Sayfalar
- **index:** lake zemin, "Together with their families", isimler, kapalı zarf, tarih · şehir, "Tap to open", köşede Skip.
- **home:** kâğıt kesim katmanlar ve altın bulutlar önünde krem kart (ay kapısında portre, isimler, tarih, mekân) → krem
  bantta davet ("Double happiness", kâğıt kesim bordür, tam adlar, üç satır tarih, RSVP, geri sayım, takvim) → hikâye
  tanıtımı (ay kapısı) → günün ilk 4 satırı → imza (püsküllü düğüm).
- **story:** üç an, sol–sağ–sol, ay kapılarında; arka planda kaydırmayla iki hızda kayan kâğıt kesim katmanlar.
- **details:** program krem kâğıtta, mekân fotoğrafı kafes kapılarla, harita, G138 blokları, travel, menü, registry, SSS.
- **rsvp:** krem form; gönderince altın bulutlar yükselir (GPT bulutları gelince); teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Mei & Julian, The Peony Court Garden House, Vancouver, British Columbia;
  September 25, 2027; URL ve medya null)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları W2.1–W2.20, PAKET 2 örnek fotoğraflar, PAKET 6
  basılı davetiye); prova şekli `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/red-lacquer-double-happiness/` (README: açılış, geçici görseller, GPT gelince olanlar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
