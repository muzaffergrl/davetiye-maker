---
id: G908
baslik: Tasarım 08 Winter Evergreen — B1–B3 Etsy ilan kiti montajı
rol: claude-kod
durum: iptal
alan:
oncelik: 4
bagimli: [G608, G708, G808, G026, G028]
yazar: [collections/08_Winter_Evergreen/package/listing/]
---

## Amaç
Tasarım 08'in ilan görselleri, ilan videosu ve ilan PDF'ini üretmek.

## Girdiler
- Export'lar: `collections/08_Winter_Evergreen/package/customer/`, video önizleme `collections/08_Winter_Evergreen/previews/`
- Mockup'lar `collections/08_Winter_Evergreen/assets/gpt/mockups/`
- `tools/mockup_compose.py` (G028), `tools/md_to_pdf.py` (G026)

## Yapılacaklar
1. B1: kapak + video/website/PDF mockup'ları + What's included + How it works + düzenleme örneği (2000×2000 veya Etsy'nin güncel önerisi; kaynağı yaz).
2. B2: kısa sessiz tanıtım klibi (video export'tan; Etsy süre/boyut kuralı yükleme öncesi doğrulanacak — doğrulanmadıysa yaz).
3. B3: `listing.md` → `listing.pdf` (md_to_pdf, palette).

## Bitti sayılması için
- [ ] `package/listing/` altında görseller, video, PDF

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-16 iptal: K22/K24 — Canva seti ilan kiti (video/PDF mockup'ları) → G124
