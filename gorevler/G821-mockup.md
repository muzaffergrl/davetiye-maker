---
id: G821
baslik: Tasarım 21 Crimson Rose Atelier — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: alindi
alan: codex-gorsel-g821
oncelik: 2
bagimli: []
yazar: [collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/21_Crimson_Rose_Atelier/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: `collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/design-board.png` ve `assets/gpt/decor/` (zarf, mühür, gül dalı); bu tasarımda PAKET 5 ve `comps/` yok

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/21_Crimson_Rose_Atelier --paket 3`.

## Bitti sayılması için
- [ ] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [ ] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç

## Günlük
- 2026-10-17 açıldı (G137, claude-kod): 21'in ilan görsellerinden 1, 2, 4 ve 8 bu sahneleri bekliyor; prompt'lar `tools/paket3_sahne.py`'nin metniyle, zemin ve süsler elle (07 Burgundy Velvet'in dalyası/böğürtleni/kadifesinden ayrı)
- 2026-10-17 alindi: codex-gorsel-g821
