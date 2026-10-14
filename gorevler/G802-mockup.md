---
id: G802
baslik: Tasarım 02 Dusty Blue & Champagne — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/02_Dusty_Blue/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/02_Dusty_Blue/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/02_Dusty_Blue/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/02_Dusty_Blue --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- Üreten: `gpt-gorsel-A`; PAKET 3 talimat bloğu ve 3.1–3.5 İngilizce prompt'ları tek sohbette, sırayla ve kelimesi kelimesine kullanıldı. Görseller yalnız imagegen ile üretildi; sonradan piksel/görsel düzenlemesi yapılmadı.
- Seçilen 5 sahne, `collections/02_Dusty_Blue/assets/gpt/mockups/` altında: `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretimler: `cover_hand_v2.png` (üstteki başlık alanını daha boş tutmak ve saf yeşil talebini güçlendirmek); `laptop_phone_v2.png` (ilk üretimdeki küçük tuş işaretlerini kaldırmak, tamamen yazısız tuş kapakları ve saf yeşil talebini güçlendirmek). İkisinde de v2 seçilip sade ada kopyalandı; v2 denemeleri aynı mockups klasöründe duruyor.
- Görsel kontrol: tutarlı fildişi keten, beyaz güller, okaliptüs, pudra mavisi ipek kurdele, şampanya altını ve sol üst gün ışığı; cihazlar logosuz; görünür yazı/harf/rakam/filigran yok. Telefon ekranlarına parmak, yaprak veya kurdele binmiyor; dört ekran köşesi açık. Laptop tuşları boş. Son sahnede yüz görünmüyor.
- Teknik kontrol: `python3 tools/kit_check.py collections/02_Dusty_Blue --paket 3` → **5/5 geçti**, çıkış kodu 0. Ekran sayıları sırasıyla 1, 3, 2, 1, 1. Kare görseller 1254×1254, yataylar 1536×1024; hedef oranlar geçti. 3/5 ara kaydı main'e push edildi.
- **Açık kalan şart: piksel düzeyinde saf #00FF00 sağlanmadı.** Ekranlar görsel olarak düz yeşil, fakat imagegen'in ham çıktılarında küçük renk sapmaları var. Ekran içlerinin ortanca RGB değerleri sırasıyla (6,252,6), (3,251,3), (4,251,5), (4,252,3), (4,252,15). `kit_check` toleranslı yeşil maskesi kullanır; 5/5 sonucu tam RGB(0,255,0) saflığı anlamına gelmez. Kullanıcı bu sohbette yalnız ekran içlerini başka bir yöntemle sabitleme önerisini reddedip **“Hayır, yalnız imagegen kullan”** dedi; dosyalar bu tercihe uygun ham üretimlerdir. İncelemede bu renk sapması açık eksik olarak değerlendirilmelidir.
- Ek önizleme, metrik veya rapor dosyası oluşturulmadı; repo değişiklikleri yalnız mockups klasörü ve bu görev dosyasıdır.

## Günlük
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-gorsel-A
- 2026-10-14 ara kayıt: gpt-gorsel-A; 3/5 sahne hazır (cover_hand için v2: üst boşluğu; laptop_phone için v2: yazısız tuşlar). Üç sahnenin ekran sayısı ve geometrisi kit_check ile geçti; piksel düzeyinde saf yeşil doğrulanmadı.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A; PAKET 3 kontrolü 5/5 geçti; piksel düzeyinde saf #00FF00 eksikliği Sonuç'a kaydedildi.
