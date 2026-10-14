---
id: G806
baslik: Tasarım 06 Art Deco Black-Tie — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/06_Art_Deco_Noir/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/06_Art_Deco_Noir/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/06_Art_Deco_Noir/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/06_Art_Deco_Noir --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- PAKET 3 talimat bloğu önce gönderildi; 3.1–3.5 İngilizce prompt'ları tek sohbette, sırayla ve metinleri değiştirilmeden imagegen'e verildi. Kontrol şartları ayrıca güçlendirildi.
- Dosyalar: `collections/06_Art_Deco_Noir/assets/gpt/mockups/` altında `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretilenler: `cover_hand_v2.png` (üst %30'daki kadeh aşağı alındı, çiçekler kaldırıldı, saf yeşil tekrar istendi), `three_phones_v2.png` (kapakla aynı dekoru korumak için çiçekler kaldırıldı, saf yeşil tekrar istendi). İkinci sürümler sade adlara da kopyalandı; _v2 denemeleri aynı klasörde korundu.
- Görsel kontrol: ekran sayıları 1/3/2/1/1; bütün ekran köşeleri açık, parmak ve dekor ekranlara binmiyor. Cihazlarda logo, klavye tuşlarında karakter ve görsellerde yazı saptanmadı. Kapakta üst alan, flatlay'de sol üçte bir boş; yaşam sahnesinde yüz görünmüyor. Aynı lacivert kadife, kristal kadehler, inci ve altın Art Deco dekoru korundu.
- `python3 tools/kit_check.py collections/06_Art_Deco_Noir --paket 3`: **5/5 geçti**. Kareler 1254×1254, yataylar 1536×1024 ham imagegen çıktılarıdır; oran denetimi geçti. Bütün görseller tamamen opak.
- **Teknik sınır ve kullanıcı tercihi (2026-10-14):** ham imagegen ekranlarında yeniden üretime rağmen küçük RGB sapmaları var; piksel düzeyinde saf `RGB(0,255,0)` sağlanmadı. `kit_check` yeşilde tolerans kullanır; 5/5 sonucu tam saf renk garantisi değildir. Yalnız ekran içlerini teknik işlemle saflaştırma seçeneği soruldu; kullanıcı **"Ham ImageGen çıktıları kalsın"** dedi. Görseller bu tercihe uygun olarak teknik renk işlemi uygulanmadan korundu.
- Üç sahne sonunda `G806: ara kayıt (3/5)` main'e gönderildi (`cb3aaf4`). Depodaki değişiklikler yalnız kendi mockups klasörü ve bu görev dosyasıdır; ek önizleme, metrik veya rapor dosyası üretilmedi.

## Günlük
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A; 5/5 geçti. Kullanıcının "Ham ImageGen çıktıları kalsın" tercihiyle küçük ekran RGB sapmaları korundu.
- 2026-10-14 ara kayıt: gpt-gorsel-A; 3/5 sahne hazır (cover_hand, three_phones, laptop_phone). Kapakta üst alan ve dekor için, üç telefonda aynı dekor için _v2 seçildi; üç sahnenin ekran sayısı ve geometrisi kit_check denetiminden geçti. Ham imagegen yeşillerinde küçük RGB sapmaları sürüyor.
- 2026-10-14 alindi: gpt-gorsel-A
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 entegratör onayladı
