---
id: G814
baslik: Tasarım 14 Ivory Lace & Pearls — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/14_Ivory_Lace_Pearl/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/14_Ivory_Lace_Pearl/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/14_Ivory_Lace_Pearl/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/14_Ivory_Lace_Pearl --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- gpt-gorsel-A, PAKET 3 talimat bloğunu ve 3.1–3.5 İngilizce prompt'larını tek sohbette, sırayla ve aynen kullanarak beş fotoğraf sahnesini üretti.
- Dosyalar: `collections/14_Ivory_Lace_Pearl/assets/gpt/mockups/` altında `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretim: kapakta telefon ilk çıktıda fazla yukarıdaydı; daha aşağıya alınması ve sakin başlık alanının büyümesi için `cover_hand_v2.png` üretildi ve aynı çıktı sade `cover_hand.png` adıyla seçildi. Diğer dört sahnede yeniden üretim yapılmadı.
- Kontrol: `python3 tools/kit_check.py collections/14_Ivory_Lace_Pearl --paket 3` → **5/5 geçti**. Ekran sayıları sırasıyla 1, 3, 2, 1, 1; oran ve ekran geometrisi kontrolleri geçti. Görsellerde elle yapılan görsel kontrolde ekranlara binen parmak/süs, yazı ve logo görülmedi; laptop tuşları boş, yaşam sahnesinde yüz görünmüyor.
- Sınır: imagegen saf `#00FF00` açıkça istenmesine rağmen yeşil alanlarda küçük RGB sapmaları üretti; en sık renkler kapakta (3,253,5), üç telefonda (3,251,6), laptop sahnesinde (4,250,21), flatlay'de (3,252,3), yaşam sahnesinde (4,251,17). `kit_check` yeşil toleransı nedeniyle geçiyor; piksel düzeyinde tek renk saf `#00FF00` şartı tam sağlanmadı. Bu durum inceleme için açık bırakıldı.
- Native çıktı ölçüleri: kare sahneler 1254×1254, yatay sahneler 1536×1024; Kaydet oranları korundu. Ek önizleme, metrik veya rapor dosyası üretilmedi. Sahne 3.1–3.2 ve 3.3–3.4 sonrası ayrı ara commit + push yapıldı; her push öncesi `git pull --rebase origin main` uygulandı.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-gorsel-A
- 2026-10-14 ara kayıt: gpt-gorsel-A — 3.1 ve 3.2 kaydedildi; cover_hand v2 seçildi; iki sahne ekran/ölçü kontrolünden geçti.
- 2026-10-14 ara kayıt: gpt-gorsel-A — 3.3 ve 3.4 kaydedildi; iki sahne ekran/ölçü kontrolünden geçti; toplam 4/5 sahne hazır.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A — 5/5 kit kontrolü geçti; tam saf yeşil üretim sınırı Sonuç'a kaydedildi.
