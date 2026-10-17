# Tasarım 28 — Maison Pâtisserie · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` #28 (yeni dalga 23–28, 2026-10-17) + G166 (platform teması). Katalog:
`tools/katalog.py` `EK_TEMALAR` dalga kaydı (6 eksen + hareket imzası; `katalog.py kontrol` → `dalga_ayirt`).
03 Blush Garden Rose'dan ve diğer 21 tasarımdan ayrı: zarf değil **kutu**, çiçek değil **pastane**, pembe değil
**fıstık yeşili** ağırlıklı, kemer çerçeve değil **vitrin rafı**.

**Ruh:** Paris pastanesinin vitrini — fıstık yeşili, gül, krem ve biraz altın; kurdeleyle bağlanmış bir kutunun içinde
davetiye. Klasik, romantik, zengin; geniş beğeni.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Fıstık yeşili pasta kutusu (üstten), gül saten kurdele çapraz + fiyonk; dokununca fiyonk çözülür (iki ilmek iki yana ayrılır, düğüm düşer), dört kurdele kolu kendi yönüne kayar, kapak kalkar, iki ipek kâğıt perde gibi aralanır, kart öne gelip home'a uçar (VT) |
| Foto sunumu | Pastane vitrini rafı: üç fotoğraf cam rafta durur, raf boyunca kayar (dokunmatik kaydırma + yaslanma, fareyle sürükleme, ‹ › düğmeleri, ← → tuşları); ortadaki öne çıkar. Azaltılmış harekette düz liste |
| Dekor ailesi | Makaron, tül, şeker inci, altın kenarlı tabak (+ saten fiyonk) |
| Teknik | pastel suluboya + fotogerçekçi pasta |
| Font | Italiana (başlık + metin) + Parisienne (isimler) — Google Fonts |
| Ana palet | pistachio `#A9C49C` · deep pistachio `#4F6D49` · rose `#E8B4B8` · deep rose `#9B4F5A` · cream `#FBF5EC` · gold `#B8995A` |
| Hareket imzası | Fiyonk çözülmesi, kapak kalkışı, ipek kâğıt aralanması; raf kaydırma bileşeni; menü vitrin rafları (G138 Meal & menu); RSVP makaron renkli çipler; gönderimde şeker inci yağmuru (GPT sprite) |

## Sayfalar (K23)
Kapalı kutu (index) → açılış → **home yeni sayfada** (kutudan çıkan kart: portre, isimler, tarih; davet; geri sayım;
takvim; raf tanıtımı; günün ilk anları) → Story (vitrin rafı) · Details (gün akışı, mekân, harita, kıyafet, bloklar,
ulaşım, **menü vitrini**, hediye listesi, SSS) · RSVP (makaron çipleri, şeker inci yağmuru) · teşekkür modu.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Camille & Oliver, The Belle Rive Orangery, Newport RI; US tarih; URL'ler ve
  fotoğraflar null; menü dolu)
- GPT: `assets/gpt/GPT_PROMPTS.md` — PAKET 5 (16 website parçası), PAKET 2 (5 örnek foto), PAKET 6 (4 baskı zemini)
- Tema: `platform/themes/maison-patisserie/` (README: açılış, geçici katmanlar, sayfalar, sınırlar)
- Etsy taslağı: `package/listing/listing_v3.md` (K41: yayımlanmadı)
