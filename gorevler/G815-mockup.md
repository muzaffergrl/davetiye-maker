---
id: G815
baslik: Tasarım 15 Cherry Blossom Spring — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/15_Cherry_Blossom/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/15_Cherry_Blossom/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/15_Cherry_Blossom/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/15_Cherry_Blossom --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- PAKET 3 Instructions for GPT bloğu önce gönderildi; 3.1–3.5 İngilizce prompt'ları tek sohbette, sırayla ve kelimesi kelimesine kullanıldı. Görseller GPT ImageGen ile üretildi.
- Beş seçili sahne `collections/15_Cherry_Blossom/assets/gpt/mockups/` altında Kaydet satırlarındaki adlarla kaydedildi: `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretim: kapak ilk denemede telefonu fazla yukarı yerleştirdi; v2'de telefonun üstü kadrajın yaklaşık %50'sine indirildi ve üstte geniş sakin başlık alanı bırakıldı. Seçilen v2 sade `cover_hand.png` adıyla duruyor; aynı seçimin `cover_hand_v2.png` dosyası da korundu. Diğer dört sahne ilk üretimden seçildi.
- Görsel kontrol: ekran sayıları sırasıyla 1/3/2/1/1; dört köşeler görünür, parmak/çiçek/dal/yaprak ekranlara binmiyor; cihazlar logosuz, laptop tuşlarında harf görünmüyor; yazı/logo görülmedi. Masa üstü sahnesinin sol üçte biri boş; yaşam sahnesinde yüz görünmüyor.
- Kontrol: `python3 tools/kit_check.py collections/15_Cherry_Blossom --paket 3` → **5/5 geçti** (çıkış kodu 0). 3.1–3.2 ve 3.3–3.4 sonrasında ayrı ara commit + push; 3.5 de ayrıca kaydedildi. Her push öncesi `git pull --rebase origin main` uygulandı.
- Sınırlar: ImageGen ekran yeşillerinde küçük RGB sapmaları var; piksellerin tamamı tam `#00FF00` değil. Kullanıcı bu sohbette açıkça **“Hayır, ImageGen çıktısını olduğu gibi bırak”** dedi; teknik renk dolgusu uygulanmadı. Kare ham çıktılar 1254×1254, yataylar 1536×1024; kareler yeniden boyutlandırılmadan korundu. Kit kontrolü renk toleransı ve oran kontrolü kullanır; OCR yapmaz. Ek önizleme, metrik veya rapor dosyası üretilmedi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-gorsel-A
- 2026-10-14 ara kayıt: gpt-gorsel-A; 3.1 kapak (v2 seçildi, telefon alt yarıya indirildi) ve 3.2 üç telefon kaydedildi; iki sahnenin oran/ekran kontrolleri geçti.
- 2026-10-14 ara kayıt: gpt-gorsel-A; 3.3 dizüstü + telefon ve 3.4 masa üstü kaydedildi; iki sahnenin oran/ekran kontrolleri geçti; klavye yazısız ve masa üstünün sol üçte biri boş.
- 2026-10-14 ara kayıt: gpt-gorsel-A; 3.5 yaşam sahnesi kaydedildi; python3 tools/kit_check.py collections/15_Cherry_Blossom --paket 3 → 5/5 geçti. Piksel kontrolünde ImageGen ekran yeşilinde küçük RGB sapmaları görüldü; saf #00FF00 şartı henüz sağlanmadı.
- 2026-10-14 kullanıcı tercihi: ImageGen ham çıktıları olduğu gibi bırakıldı; teknik #00FF00 renk dolgusu yapılmadı.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A; PAKET 3 beş sahne, kit_check 5/5 geçti.
