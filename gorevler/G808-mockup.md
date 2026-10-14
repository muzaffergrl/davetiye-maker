---
id: G808
baslik: Tasarım 08 Winter Evergreen — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: alindi
alan: gpt-gorsel-C
oncelik: 2
bagimli: []
yazar: [collections/08_Winter_Evergreen/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/08_Winter_Evergreen/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/08_Winter_Evergreen/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/08_Winter_Evergreen --paket 3`.

## Bitti sayılması için
- [ ] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [ ] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç

## Günlük
- 2026-10-14 alindi: gpt-gorsel-C
- 2026-10-14 ara kayıt: gpt-gorsel-C; 3.1–3.3 üretildi ve ekran kontrolleri geçti (3/5). cover_hand_v2 seçildi; ilk denemede telefon üst yarıya taşıyordu (cover_hand_v1 korundu).
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
