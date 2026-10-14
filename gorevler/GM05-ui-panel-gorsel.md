---
id: GM05
baslik: BKE Studio Düzenleme paneli arayüz tasarımı — 6 yüksek kaliteli ekran comp'u (GPT tasarlar)
rol: gpt-gorsel
durum: alindi
alan: gpt-ui-panel
oncelik: 1
bagimli: [GM01]
yazar: [brand/ui/panel/]
---

## Amaç
Kullanıcı (2026-10-14): "BKE Studio'yu da ekleyelim; logo, isim, marka tasarımına uygun bir website ve panel tasarımı yapalım."
GPT Düzenleme paneli'nin görsel tasarımını yapar (K21); Claude aynı görünümü gerçek kodla kurar (G066).

## Girdiler
- `brand/UI_GPT_PROMPTS.md` → **GM05** bölümü (U2.0–U2.6) ve dosyanın başındaki kurallar
- Referans: `brand/assets/gpt/final/brand_board_final.png`, `logo_horizontal.png`, `brand/listing/comps/lc1_cover.png`, `lc6_included.png`

## Yapılacaklar
1. Tek sohbet. Önce brief'i düz mesaj olarak gönder, referansları yükle, sonra 6 comp'u sırayla, kelimesi kelimesine.
2. Metin yalnız verilen metin, harf harf. Ürün ekranı/foto/QR yeri düz saf #00FF00; QR çizilmez.
3. Denemeler `_v2`, `_v3`; ek rapor/önizleme dosyası yok. 3 comp'ta bir commit + push.

## Bitti sayılması için
- [ ] 6 comp `brand/ui/panel/` içinde; Sonuç'ta yeniden üretilenler ve emin olunmayanlar

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği (marka tasarımına uygun site ve panel)
- 2026-10-14 alindi: gpt-ui-panel
- 2026-10-14 ara kayıt (3/6): U2.1 kurulum, U2.2 Home ve U2.3 Edit üretildi; U2.1 yeşil alan, U2.3 Preview yerleşimi için _v2 denemeleri kaydedildi. Metinler görsel olarak harf harf kontrol edildi.
- 2026-10-14 ara kayıt (6/6): U2.4 Guests, U2.5 Share, U2.6 masaüstü üretildi; ek metinler ve örtüşmeler imagegen ile düzeltildi. Altı comp belirtilen ölçülerde kaydedildi. Yeşil alanların RGB değerlerinde imagegen kaynaklı küçük sapmalar kaldığı piksel kontrolünde görüldü.
