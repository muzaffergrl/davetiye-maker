---
id: G912
baslik: Tasarım 12 Tropical Destination — B1–B3 Etsy ilan kiti montajı
rol: claude-kod
durum: blokaj
alan:
oncelik: 4
bagimli: [G612, G712, G812, G026, G028]
yazar: [collections/12_Tropical_Destination/package/listing/]
---

## Amaç
Tasarım 12'in ilan görselleri, ilan videosu ve ilan PDF'ini üretmek.

## Girdiler
- Export'lar: `collections/12_Tropical_Destination/package/customer/`, video önizleme `collections/12_Tropical_Destination/previews/`
- Mockup'lar `collections/12_Tropical_Destination/assets/gpt/mockups/`
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
