---
id: G821
baslik: Tasarım 21 Crimson Rose Atelier — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
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
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç

- PAKET 3 talimat bloğu ve 3.1–3.5 İngilizce prompt'ları aynı sohbette, sırayla ve aynen kullanıldı. Seçilen beş sahne `collections/21_Crimson_Rose_Atelier/assets/gpt/mockups/` altında sade adlarıyla kaydedildi: `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretim: `cover_hand` ikinci sürümde seçildi; ilkinde telefon ve çiçekler üstteki başlık boşluğuna taşıyordu. `laptop_phone` ikinci sürümde seçildi; ilk klavyedeki harfler kaldırılarak tuşlar yazısız üretildi. Denemelerin ham çıktıları çalışma alanında tutuldu; repoya yalnız seçilen sahneler eklendi.
- Kontrol (2026-10-17): `python3 tools/kit_check.py collections/21_Crimson_Rose_Atelier --paket 3` → **5/5 GEÇTİ**; ekran sayıları sırasıyla **1 / 3 / 2 / 1 / 1**. Görsel kontrolde ekranların dört köşesi açık, parmak ve dekorlar ekran dışında; yazı/logo yok. Kapakta üst %35, masa üstü sahnesinde sol üçte bir metin için açık.
- Ölçü notu: kare çıktılar 1254×1254, yataylar 1536×1024; kit standardının oran kontrolü geçti. Yeşil renk, rol rehberindeki imagegen toleransıyla doğrulandı; tüm piksellerin birebir `(0,255,0)` olduğu iddia edilmiyor.
- Üçüncü sahneden sonra ara commit ve push yapıldı. Ek önizleme veya rapor dosyası üretilmedi.

## Günlük
- 2026-10-17 açıldı (G137, claude-kod): 21'in ilan görsellerinden 1, 2, 4 ve 8 bu sahneleri bekliyor; prompt'lar `tools/paket3_sahne.py`'nin metniyle, zemin ve süsler elle (07 Burgundy Velvet'in dalyası/böğürtleni/kadifesinden ayrı)
- 2026-10-17 alindi: codex-gorsel-g821
- 2026-10-17 bitti, incelemeye gönderildi
- 2026-10-17 kullanıldı (G137 ikinci tur): beş sahneden dördü (kapak, üç telefon, iki elde telefon, masa üstü) 21'in 01/02/04/08 ilan görsellerinde; ekranlar yeşil alanlara düzgün oturdu, yeşil artık yok (`test_listing_editorial` ok).
- 2026-10-17 entegratör onayladı
