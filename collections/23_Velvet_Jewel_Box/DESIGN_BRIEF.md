# Tasarım 23 — Velvet Jewel Box · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (dalga 23–28) + G161 (platform teması). Katalogda `tools/katalog.py` `EK_TEMALAR`
(6 eksen + hareket imzası; `kontrol` her tasarımdan ≥ 4 eksende farklı olduğunu denetler). Zarf yerine **yüzük kutusu**.

**Ruh:** patlıcan moru kadife, şampanya saten ve rose gold; bir yüzük kutusunu açar gibi davet. Klasik, romantik, zengin.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Patlıcan moru kadife yüzük kutusu, saten fiyonklu; fiyonk kayar, kapak menteşeden 3B açılır (90°'de saten astarlı iç kapak devralır), saten üstünde ışık süpürmesi, davet kartı kutudan yükselir, öne gelir, home'a uçar |
| Fotoğraf sunumu | Story'de 3B silindir karusel (mücevher vitrini gibi döner; sürükle/kaydır, en yakına oturur, oklar ve klavye; azaltılmış harekette düz kaydırıcı) |
| Dekor ailesi | Saten kurdele, inci, yüzük, şampanya saten kıvrımları |
| Teknik | fotogerçekçi ürün çekimi |
| Font | Bodoni Moda + Pinyon Script (Google Fonts; font dosyası pakete girmez) |
| Ana palet | aubergine-champagne: night `#1C0B1A` · aubergine `#2A1328` · plum `#4A2142` · champagne `#E8D3B0` · rose gold `#C99A86` · ivory `#F8EDE0` |
| Hareket imzası | Menteşe 3B açılış · saten ışık süpürmesi · varak parıltılı başlık (gradient, harflere kırpılmış, bir kez) · silindir karusel · saten perde sayfa geçişi (tüylü çapraz maske; diğer 22 tema çapraz solma kullanıyor) |

## Sayfalar
- **Kutu (index):** kadife zemin, "You are invited", Pinyon Script isimler (varak), kapalı kutu + fiyonk, "Tap to open".
- **Home:** kadife tam boy + isimler; şampanya saten üstünde portre + davet (ışık süpürmesi), geri sayım, takvim; story tanıtımı;
  satende günün ilk anları; fiyonk + "Open the box again".
- **Story:** dönen vitrin (3 foto, 4:5) + başlıklar.
- **Details:** satende program + mekân fotoğrafı; harita, takvim, kıyafet, G138 blokları, Travel & stay, Menu, registry, SSS.
- **RSVP:** kadife yanıt kartı + ortak form.
- **Basılı davetiye (G139):** kadife zemin + fiyonk (geçici composed düzen; PAKET 6 zeminleri gelince değişir).

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Isabelle & Julian, Halvern House, New York; URL'ler null; örnek foto henüz yok)
- GPT: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 W2 website katmanları, PAKET 2 örnek fotoğraflar, PAKET 6 basılı zeminler)
- Tema: `platform/themes/velvet-jewel-box/` (README: açılış, geçici parçalar, sapmalar)
- Etsy metin taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
