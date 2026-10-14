---
id: GM01
baslik: BKE Studio marka kimliği — 3 yön panosu + seçilen yönün logo/sembol/mühür/desen/ikon/sahne dosyaları
rol: gpt-gorsel
durum: alindi
alan: gpt-marka
oncelik: 1
bagimli: []
yazar: [brand/assets/gpt/boards/, brand/assets/gpt/final/]
---

## Amaç
K26: marka adı **BKE Studio** (çalışma adı). Kullanıcı **çağdaş ve cesur**, ama 20 romantik/klasik tasarıma yakışan bir
marka kimliği istedi. Tasarımı GPT yapar (K21). Claude sonra vektöre çevirir ve kiti kurar (GM02).

## Girdiler
- `brand/GPT_PROMPTS.md` → B0 (brief), B1 (3 yön panosu), B2 (seçilen yönün 10 dosyası); seçim ölçütleri dosyanın başında
- Ürünü görmek için (isteğe bağlı): `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `collections/01_Olive_Ivory/assets/gpt/comps/`
- Kurallar: `gorevler/roller/gpt-gorsel.md` (gerçek alfa, gölge/hâle yok, Kaydet satırı, `_vN` denemeleri)

## Yapılacaklar
1. Tek sohbet. Önce B0'ı düz mesaj olarak gönder (görsel yok).
2. B1: üç panoyu üret; beğenmediğini yeniden üret. **Bitince commit + push** (`GM01: B1 yön panoları`).
3. Ölçütlere göre en güçlü yönü seç; seçimi ve gerekçeyi Sonuç'a yaz.
4. B2: 10 dosyayı seçilen panoyu referans vererek üret.
5. **Bu pakete özel:** logolarda yazı serbest ama yalnız "BKE Studio"; harf harf kontrol et, hatalıysa yeniden üret.
6. Kontrol: her görselin Kontrol satırı. Logo dosyalarında gerçek alfa ve düz renk; `pattern_tile` 2×2 dikişsiz.

## Bitti sayılması için
- [ ] 3 pano `brand/assets/gpt/boards/` içinde
- [ ] 10 B2 dosyası `brand/assets/gpt/final/` içinde, Kaydet satırındaki adlarla
- [ ] Bütün yazılar harf harf "BKE Studio"; şeffaf istenenler gerçek alfa
- [ ] Sonuç'ta seçilen yön + gerekçe, yeniden üretilenler, emin olunmayan noktalar

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): K26 marka kimliği
- 2026-10-14 alindi: gpt-marka
