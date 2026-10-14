---
id: G818
baslik: Tasarım 18 Wildflower Meadow Vellum — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: inceleme
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
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- PAKET 3 talimat bloğu ve 3.1–3.5 prompt'ları tek sohbette, sırasıyla ve aynen kullanıldı. Beş fotoğraf sahnesi `collections/18_Wildflower_Vellum/assets/gpt/mockups/` içinde sade adlarıyla kaydedildi: `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Seçilen imagegen sürümleri: `cover_hand_v3.png`, `three_phones_v2.png`, `laptop_phone_v3.png`, `flatlay_phone_v2.png`, `hand_phone_edit_v2.png`. Kapak ilk denemede fazla yukarıdaydı; v2'de telefon ve çiçekler aşağı alındı. Laptop ilk denemede tuş yazıları içeriyordu; v2'de tuşlar boş üretildi. Son turda kullanıcının yalnız imagegen talebiyle beş sahnenin tümü saf ekran rengi için yeniden üretildi; Python ile piksel düzenlemesi yapılmadı. Önceki denemeler `_v1`, `_v2`, `_v3` adlarıyla korundu.
- Görsel kontrol: kapakta üstte geniş sakin başlık alanı; masa sahnesinde sol üçte bir metin alanı; bütün ekranların dört köşesi açık; parmak, çiçek veya vellum ekrana binmiyor. Seçilen görsellerde logo, yazı, tuş harfi ve filigran görülmedi. Ekranlar opak. Kare çıktılar 1254×1254, yatay çıktılar 1536×1024; hedef oranlar korundu.
- Çalıştırıldı: `python3 tools/kit_check.py collections/18_Wildflower_Vellum --paket 3` → **5/5 geçti** (ekran sayıları 1/3/2/1/1). Her iki sahnede ara commit + `git pull --rebase origin main` + `git push origin HEAD:main` uygulandı. Ek önizleme, metrik veya rapor dosyası oluşturulmadı.
- **Kalan eksik: tam saf #00FF00 şartı karşılanmadı.** Imagegen yeniden üretimlerinde de küçük RGB sapmaları kaldı. Salt okunur piksel kontrolünde baskın ekran renkleri sırasıyla `(4,251,26)`, `(3,246,8)`, `(6,248,20)`, `(3,250,3)`, `(3,249,16)`; bunlar `(0,255,0)` değildir. `kit_check` renk toleransı kullandığından 5/5 sonucu bu kesin renk şartını doğrulamaz. İncelemede bu fark dikkate alınmalı; bütün şartların eksiksiz sağlandığı iddia edilmiyor.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-ui-site
- 2026-10-14 ara kayıt (3.1–3.2): kapak ve üç telefon sahnesi kaydedildi; kapakta telefon ve çiçekler aşağı alındı (cover_hand_v2 seçildi); iki sahnenin oran/ekran kontrolleri geçti.
- 2026-10-14 ara kayıt (3.3–3.4): laptop + telefon ve masa üstü sahnesi kaydedildi; laptop tuşlarındaki yazılar kaldırıldı (laptop_phone_v2 seçildi); iki sahnenin oran/ekran kontrolleri geçti.
- 2026-10-14 ara kayıt (3.1–3.2 yeniden üretim): kullanıcının yalnız imagegen talebiyle saf renk talimatı güçlendirilerek cover_hand_v3 ve three_phones_v2 üretildi; oran/ekran kontrolleri geçti. Piksel rengi son kontrolde ayrıca doğrulanacak.
- 2026-10-14 ara kayıt (3.3–3.4 yeniden üretim): yalnız imagegen ile laptop_phone_v3 ve flatlay_phone_v2 üretildi; yazısız tuşlar ve açık ekran köşeleri korundu; oran/ekran kontrolleri geçti.
- 2026-10-14 üretim ve kontroller bitti, incelemeye gönderildi: gpt-ui-site; 5/5 kit kontrolü geçti, kesin #00FF00 renk farkı Sonuç'a kaydedildi.
