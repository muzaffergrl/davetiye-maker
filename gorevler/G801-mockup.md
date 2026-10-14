---
id: G801
baslik: Tasarım 01 Olive & Ivory — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-A
oncelik: 1
bagimli: []
yazar: [collections/01_Olive_Ivory/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065).

## Girdiler
- `collections/01_Olive_Ivory/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/01_Olive_Ivory/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet. Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Kontrol: `python3 tools/kit_check.py collections/01_Olive_Ivory --paket 3` (Kaydet satırındaki `N ekran` sayısını ve her ekranın düz,
   tek parça dörtgen olduğunu denetler; eğik telefon serbest).

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- gpt-gorsel-A, 2026-10-14: PAKET 3'ün talimat bloğu ve 3.1–3.5 İngilizce prompt'ları tek sohbette, sırayla ve kelimesi kelimesine kullanıldı. Aynı sıcak fildişi keten, zeytin dalı/zeytin, zeytin yeşili ipek kurdele, beyaz yasemin ve sol üstten doğal ışıkla beş fotoğraf sahnesi üretildi.
- Seçilen dosyalar: `collections/01_Olive_Ivory/assets/gpt/mockups/cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`. Kare çıktılar 1254×1254, yatay çıktılar 1536×1024; Kaydet satırlarındaki oranlar korundu.
- Yeniden üretim: `laptop_phone_v2.png` — ilk laptop görselinin klavyesinde harf izleri vardı; referanslı ikinci üretimde tuşlar tamamen boş yapıldı. Seçilen ikinci sürüm `laptop_phone.png` sade adıyla da kaydedildi. `cover_hand_v2.png` — ekranın tam saf #00FF00 olması için referanslı ikinci deneme; renk sapması giderilmedi, kapakta ilk sürüm seçildi.
- Görsel kontrol: toplam 8 ekranın dört köşesi görünür; ekrana parmak, yaprak veya kurdele binmiyor. Telefonlar birbirine binmiyor; logo, yazı, harf ve rakam görülmedi. Kapakta üst %30, masa üstü sahnesinde sol üçte bir metin için boş bırakıldı; yaşam sahnesinde yüz görünmüyor.
- Kontrol: `python3 tools/kit_check.py collections/01_Olive_Ivory --paket 3` → **5/5 geçti**. Ek önizleme, metrik veya rapor dosyası üretilmedi; sonuçlar yalnız bu görev dosyasında.
- Açık kalan teknik nokta: ImageGen'in ham ekran pikselleri yeniden üretimde de tam RGB(0,255,0) değil; küçük RGB sapmaları var. `kit_check` yeşilde tolerans kullandığı için 5/5 sonucu tam saf renk garantisi değildir. Yalnız ekran içlerini kodla saf #00FF00 yapmak için kullanıcıya açık talimat soruldu; yanıt bekleniyor.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 hazir: ilan kiti için telefon + dizüstü mockup'ı (K25, paralel GPT)
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (kullanıcı: daha etkileyici, GPT tasarlasın)
- 2026-10-14 alindi: gpt-gorsel-A
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A; 5 sahne, 2 yeniden üretim, kit_check 5/5. Tam saf RGB(0,255,0) için teknik düzeltme onayı bekleniyor (Sonuç).
- 2026-10-14 entegratör onayladı
