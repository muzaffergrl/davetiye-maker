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

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği, ilan görselleri GPT tasarımı
- 2026-10-14 alindi: gpt-marka — bu oturum yalnız kısım 1, LC1–LC7; LI ikonları sonraki oturuma kaldı.
