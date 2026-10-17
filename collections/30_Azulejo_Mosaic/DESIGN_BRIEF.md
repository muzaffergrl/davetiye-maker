# Tasarım 30 — Azulejo Mosaic · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (2. dalga, satır 30) + G169 (platform teması). Aşama 1 kataloğu dışında
(`tools/katalog.py` `EK_TEMALAR`, 6 eksen + hareket imzası; `kontrol` D'deki 20 tasarıma ve dalganın diğerlerine karşı
denetler). Çalışma adı marka değildir.

**Ruh:** Portekiz'in mavi-beyaz el boyaması çinileri, güneşli badana duvarlar ve terrakota; klasik, romantik, ferah.
Kartpostal klişesi değil (limon, sardalye, horoz, bayrak, yazı yok). 05 Mediterranean Lemon'dan ayrı: limon yok, açılış
zarf değil çini paneli, palet sarı değil kobalt-terrakota. 27 Riad'dan ayrı: zellige değil boyalı azulejo, kapı değil
çini dalgası, teal-safran değil kobalt-terrakota.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Kobalt duvarda 4 × 6 mavi-beyaz çini paneli (köşe, bordür, alan çinileri); dokununca panel hafifçe çöker, sır ışığı geçer, çiniler **dokunulan çiniden yayılan dalgayla tek tek 3B döner**, her biri terrakota sırtını gösterip kalkar; arkadaki kart kalkar, home'a uçar |
| Fotoğraf sunumu | Çini mozaiği: her fotoğraf küçük çinilerin altında bekler; sahnesine gelince çiniler sol üstten çapraz dalgayla dönüp kalkar |
| Dekor ailesi | Kobalt azulejo desenleri, terrakota saksılar (sarmaşık + yasemin), badana sıva, çini frizi (GPT; şu an 05'in bordür çinileri) |
| Teknik | el boyaması seramik |
| Font | Arizonia (isimler, başlıklar; fırça el yazısı) + Cormorant Upright (gövde, büyük harf satırlar) — Google Fonts |
| Ana palet (`cobalt-white-terracotta`) | cobalt `#1F4A9E` · night `#102554` · cobalt ink `#173A80` · glaze `#FAF8F2` · whitewash `#F2EDE3` · terracotta `#AE583A` · deep terracotta `#8C4128` · terracotta light `#E4A688` |
| Hareket imzası | Karo karo 3B çevirme ızgarası (dokunulan noktadan dalga, çini dokunuştan uzağa döner), çini mozaiğiyle açılan fotoğraflar, RSVP teşekkürünün çinilerle belirmesi, metnin çini gibi üst kenarından yatarak yerleşmesi |

## Sayfalar
- **index:** kobalt duvar, "You are invited", Arizonia isimler, tarih · şehir, çini paneli, "Tap to open".
- **home:** kobalt duvarda kart (mozaikli portre, isimler, tarih, mekân) → çini frizi → badana zeminde davet (tam adlar,
  üç satır tarih, RSVP, geri sayım, takvim) → hikâye tanıtımı → friz → kobalt bantta günün ilk 4 satırı → imza.
- **story:** üç an ortada alt alta, her fotoğraf çini mozaiğiyle açılır, Arizonia başlık.
- **details:** beyaz kartta program, friz, mozaikli mekân fotoğrafı, harita, G138 blokları, travel, menü, registry, SSS.
- **rsvp:** friz + beyaz yanıt kartı; gönderilince teşekkür çinilerle belirir; teşekkür modu kapalı hâli.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Inês & Mateo, Quinta da Andorinha Azul, Sintra, Portekiz, June 5, 2027; URL ve medya null)
- GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları, PAKET 2 örnek fotoğraflar, PAKET 6 basılı davetiye)
- Prova şekli: `assets/gpt/kuru_sekil.json` (`tools/gpt_kuru_deneme.py --sekil`)
- Tema: `platform/themes/azulejo-mosaic/` (README: açılış, mozaik, geçici parçalar, GPT gelince olanlar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
