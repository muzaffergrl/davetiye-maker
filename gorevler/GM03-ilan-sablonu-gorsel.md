---
id: GM03
baslik: BKE Studio ortak Etsy ilan şablonu — 7 yerleşim/tipografi comp'u + 8 özellik ikonu (GPT tasarlar)
rol: gpt-gorsel
durum: alindi
alan: gpt-marka
oncelik: 1
bagimli: [GM01]
yazar: [brand/listing/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri çok daha etkileyici ve profesyonel olmalı, GPT tasarlasın. 20 tasarımın ilanları
aynı, marka kimliğine bağlı bir sistemle kurulur: kapak, sayfalar, nasıl çalışır, düzenleme, RSVP, neler dahil, canlı demo.
Tasarıma özel fotoğraf sahneleri G8NN'de (PAKET 3). Claude bu comp'lara göre gerçek ekran + doğru metinle kurar (G065).

## Girdiler
- `brand/LISTING_GPT_PROMPTS.md` → LS0, LC1–LC7, LI1–LI8
- Marka: `brand/assets/gpt/final/brand_board_final.png`, `logo_horizontal.png` (GM01; yoksa dur)
- Örnek sahne (varsa): `collections/01_Olive_Ivory/assets/gpt/mockups/cover_hand.png` (G801)

## Yapılacaklar
1. Tek sohbet: LS0 düz mesaj → LC1–LC7 (marka panosu referans) → LI1–LI8 (LC6 referans).
2. Comp metinleri yalnız verilen metin, harf harf; hatalıysa yeniden üret. QR ve web adresi yok. Ekranlar düz #00FF00.
3. Denemeler `_v2`, `_v3`; ek rapor/önizleme dosyası yok.
4. Kontrol: her görselin Kontrol satırı (bu paket için kit_check yok).

## Bitti sayılması için
- [ ] 7 comp `brand/listing/comps/`, 8 ikon `brand/listing/icons/` (gerçek alfa, tek renk)
- [ ] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- Kısım 1: LC1–LC7 üretildi ve Kaydet yollarına kondu: `brand/listing/comps/lc1_cover.png`, `lc2_pages.png`, `lc3_how.png`, `lc4_editor.png`, `lc5_rsvp.png`, `lc6_included.png`, `lc7_demo.png`. LS0 önce düz mesaj olarak paylaşıldı; marka panosu, yatay logo, cover_hand ve three_phones sohbete referans olarak yüklendi. Her üretimde marka panosu referans verildi.
- Metinler, özellikle `BKE Studio`, her görselde harf harf kontrol edildi; harf hatası görülmedi. QR, web adresi ve ek UI metni yok. LC1/2/4/5/7 ekran sayıları sırasıyla 1/4/1/2/1; ekranlar birbirini örtmüyor, dört köşeleri görünür. LC3'te dört adım, LC6'da sekiz öğe var; bu iki comp'ta telefon yok.
- Yeniden üretimler: LC1 `_v2`, `_v3` (ölçü/saf renk denemeleri; sade ad ilk Olive & Ivory sahnesi); LC2 `_v2`, `_v3` (kamera adalarını kaldırma; `_v3` sade ada seçildi); LC4 `_v2`, `_v3` (bağlantı uçlarını ekran dışındaki telefon çerçevesine taşıma; `_v3` sade ada seçildi). Ana LC prompt'ları aynen kullanıldı; teknik düzeltme denemelerine ortak brief'in ekran/ölçü koşulları ayrıca eklendi.
- Açık teknik kabul sınırı: imagegen, açık 1024×1024 ve RGB (0,255,0) taleplerine rağmen 1254×1254 RGB PNG ve #00FF00'a yakın, piksel düzeyinde değişken yeşil verdi. Yedi sade dosyanın ölçüsü ve beş ekranlı comp'un piksel değerleri salt okunur kontrol edildi; 1024×1024 ve saf #00FF00 koşulları sağlanmadı. Kullanıcı yalnız imagegen kullanılmasını seçti; Python/Pillow veya başka araçla görsel değişikliği yapılmadı. Bu nedenle comp üretimi tamamlandı, teknik kabul tamamlanmadı.
- Bu oturumda LI ikonları üretilmedi. Ek önizleme, metrik veya rapor dosyası oluşturulmadı; yazılan repo yolları yalnız `brand/listing/` ve bu görev dosyası. Durum kullanıcı talebiyle `alindi` kaldı.

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği, ilan görselleri GPT tasarımı
- 2026-10-14 alindi: gpt-marka — bu oturum yalnız kısım 1, LC1–LC7; LI ikonları sonraki oturuma kaldı.
- 2026-10-14 ara kayıt: gpt-marka — LC 4/7 üretildi; harf kontrolleri geçti, teknik boyut/saf ekran düzeltmesi açık.
- 2026-10-14 ara kayıt: gpt-marka — LC 7/7 üretildi; harf kontrolleri geçti, LC2/LC4 ekran bütünlüğü imagegen ile düzeltildi; 1024×1024/saf #00FF00 teknik kabul koşulları açık.
- 2026-10-14 gpt-marka: kısım 1 bitti, LI ikonları kaldı — yedi comp'un üretimi ve kayıtları tamamlandı; yukarıdaki ölçü/saf renk teknik kabul sınırı devam ediyor. Durum alindi; bu oturum durduruldu.
- 2026-10-14 devam: gpt-marka (kısım 2, LI ikonları)
