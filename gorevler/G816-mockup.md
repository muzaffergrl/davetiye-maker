---
id: G816
baslik: Tasarım 16 Sunflower Rustic Barn — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-D
oncelik: 2
bagimli: []
yazar: [collections/16_Sunflower_Rustic/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/16_Sunflower_Rustic/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/16_Sunflower_Rustic/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/16_Sunflower_Rustic --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- PAKET 3 talimat bloğu gönderildi; 3.1–3.5 kaynak İngilizce prompt'ları kelimesi kelimesine, aynı sohbette ve sırayla imagegen ile uygulandı.
- Üretilen ve seçilen dosyalar (`collections/16_Sunflower_Rustic/assets/gpt/mockups/`): `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretimler: `cover_hand_v2.png` telefonun aşağı alınması ve üst başlık boşluğunun genişletilmesi için; `three_phones_v2.png` yan telefonların alt ekran kenarlarına taşan ince buğday uçlarının kaldırılması için. Bu iki sürüm sade dosya adlarına da kaydedildi.
- Görsel kontrol: ekranların dört köşesi görünür; parmak, çiçek, buğday veya kurdele ekranlara binmiyor. Kapakta üst alan sakin; masa üstü sahnesinde sol metin alanı boş. Laptop tuşları yazısız; cihazlarda veya sahnelerde görünür yazı/logo yok.
- Doğrulama: `python3 tools/kit_check.py collections/16_Sunflower_Rustic --paket 3` → **5/5 geçti**. Ekran sayıları sırasıyla 1, 3, 2, 1, 1; kare çıktılar 1254×1254, yatay çıktılar 1536×1024; oranlar geçti.
- **Karşılanmayan kesin şart:** ekranlar piksel düzeyinde saf ve tamamen tek renk `#00FF00` değil. Tam RGB (0,255,0) yönergesi tekrar edilmesine rağmen imagegen küçük renk sapmaları üretti; baskın ekran RGB değerleri sırasıyla (5,252,5), (4,247,16), (3,251,5), (2,251,2), (3,251,16). `kit_check` yeşil renk toleransıyla geçtiği için bu sonuç kesin RGB şartının sağlandığı anlamına gelmez; incelemede düzeltilmesi gerekir.
- İki sahnede bir ara commit/push yapıldı. Ek önizleme, metrik veya rapor dosyası üretilmedi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-gorsel-D
- 2026-10-14 ara kayıt: 3.1–3.2 üretildi; cover_hand_v2 (daha geniş üst boşluk) ve three_phones_v2 (ekrana taşan buğday uçları kaldırıldı) seçildi.
- 2026-10-14 ara kayıt: 3.3–3.4 üretildi; laptop klavyesi yazısız, ekranlar engelsiz; masa üstü sahnesinde sol metin alanı boş.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-D; Paket 3 5/5 geçti, kesin #00FF00 renk sapması Sonuç'a kaydedildi.
- 2026-10-14 entegratör onayladı
