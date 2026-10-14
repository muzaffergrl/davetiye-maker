---
id: G818
baslik: Tasarım 18 Wildflower Meadow Vellum — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: alindi
alan: gpt-ui-site
oncelik: 2
bagimli: []
yazar: [collections/18_Wildflower_Vellum/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/18_Wildflower_Vellum/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/18_Wildflower_Vellum/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 2 sahnede bir commit + push (kullanıcı talebi, 2026-10-14). Kontrol: `python3 tools/kit_check.py collections/18_Wildflower_Vellum --paket 3`.

## Bitti sayılması için
- [ ] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [ ] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-ui-site
- 2026-10-14 ara kayıt (3.1–3.2): kapak ve üç telefon sahnesi kaydedildi; kapakta telefon ve çiçekler aşağı alındı (cover_hand_v2 seçildi); iki sahnenin oran/ekran kontrolleri geçti.
