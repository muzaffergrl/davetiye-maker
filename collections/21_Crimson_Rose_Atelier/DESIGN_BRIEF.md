# Tasarım 21 — Crimson Rose Atelier · tasarım özeti

Kaynak: G133 (Codex) + G142 (tema standardı). Aşama 1 kataloğu dışında (`tools/katalog.py` `EK_TEMALAR`); Burgundy
Velvet Autumn'dan (07) ayrı ürün. Durum: platform teması `platform/themes/crimson-rose-atelier/`, satış `coming`.

**Ruh:** mum ışığında bir couture atölyesinin davetiyesi — koyu kızıl güller, sıcak altın, deckle kenarlı fildişi kartlar.
**2026-10-23 atölye yenilemesi** (kullanıcı: "20'den sonrası profesyonel bir tasarımcının elinden çıkmış gibi; her şablona
özel tasarım, bileşen, animasyon ve ses"). **v2 (2026-10-24, kullanıcı onayladı):** GPT tasarım panosuna ekran ekran sadık;
PAKET 8 parçaları bağlandı. Ayrıntı: tema `README.md`.

| Eksen | Bu tasarım |
|---|---|
| Zarf / açılış | Kadife ve saten üstünde eğik, büyük bordo zarf; mührün yanında altın dal; dokununca düzelip ortaya kalkar, mühür **ikiye çatlar**, yapraklar düşer, kapak iki yüzüyle 3B döner, deckle kart önce gülüyle cepten çekilir, mum ışığına yükselip misafire gelir, zarf odak dışına çöker (kapak tipi) |
| Fotoğraf sunumu | Zarftan çıkan kartın fotoğrafı home'daki oval portreye uçar (yırtık kâğıdın üstünde, dibinde tek gül); Story'de parmakla 3B çevrilen küçük kitap; home'da yelpaze baskılar; mekân iris gibi açılır |
| Dekor ailesi | Kızıl gül dalı, altın çerçeveli iki deckle kart, mum mühür, kâğıt + PAKET 8 (kadife, saten, 5 yaprak, yırtık kenar, kurdele, altın dal, albüm sayfası, gül köşesi, tek gül) (GPT); PAKET 9 bekleniyor: altın oval çerçeve, program ikonları, albüm köşelikleri, süs çizgisi, fiyonk, gonca |
| Teknik | fotogerçekçi kırtasiye + gül fotoğrafı |
| Font | Bodoni Moda (isimler, büyük başlıklar) + Cormorant Garamond (metin, aralıklı büyük harf etiketler) + Corinthia (& ve el yazısı) (Google Fonts) |
| Ses | Kendi paketi (`crack`, `flap`, `draw`, `reveal`, `bloom`, `page`, `fold`, `stamp`, `petal`, `tap`, `chime`) + kendi müziği **Rose Nocturne** (`tools/audio_packs.py`) |
| Ana palet | burgundy `#4B0C17` · oxblood `#29070B` · cream `#F8EFDF` · gold `#C9A66D` (`palette.json`) |

Sayfalar: zarf → home (Didone isimler, yırtık kâğıt, oval portre, el yazısı satır, resmî davetiye kartı, odometre sayaç, takvim, yelpaze baskılar, mekân) → story
(sayfaları çevrilen kitap) → details (kendini çizen altın iplikte program, mekân, harita, bloklar, SSS) → RSVP (uzun
deckle kart, ortak form, gönderince zarfa konup mühürlenir). Ayrıntı ve sapmalar: tema `README.md`.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Olivia & James; URL'ler null; örnek fotoğraflar tema varlıkları)
- GPT kaynakları ve prompt'ları: `assets/gpt/` (`GPT_PROMPTS.md`; PAKET 2 adları foto anahtarı: `photos/hero_portrait.png` …)
- Etsy paketi: `package/listing/`, alıcı rehberi `package/customer/` (G137)
