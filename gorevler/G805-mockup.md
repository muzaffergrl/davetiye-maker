---
id: G805
baslik: Tasarım 05 Mediterranean Lemon — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-B
oncelik: 2
bagimli: []
yazar: [collections/05_Lemon_Mediterranean/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/05_Lemon_Mediterranean/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/05_Lemon_Mediterranean/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/05_Lemon_Mediterranean --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- PAKET 3 talimat bloğu gönderildi; 3.1–3.5 İngilizce prompt'ları aynı sohbette, sırayla ve değiştirilmeden imagegen'e verildi. Yeniden üretimlerde ayrıca ilgili kontrol düzeltmesi istendi.
- Dosyalar: `collections/05_Lemon_Mediterranean/assets/gpt/mockups/` altında `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretilen ve sade adla seçilen sürümler: `cover_hand_v2.png` (üst %30'daki dekor kaldırıldı), `laptop_phone_v2.png` (klavye karakterleri kaldırıldı), `flatlay_phone_v2.png` (sol üçte birdeki dekor ve çini kaldırıldı). `_v2` dosyaları aynı klasörde korundu.
- Görsel kontrol: ekran sayıları sırasıyla 1/3/2/1/1; köşeler açık, ekranların üstünde parmak veya dekor yok; cihazlarda logo ve görsellerde okunabilir yazı saptanmadı. El sahnelerinde yüz görünmüyor.
- `python3 tools/kit_check.py collections/05_Lemon_Mediterranean --paket 3`: **5/5 geçti**. Ham imagegen çözünürlükleri karelerde 1254×1254, yataylarda 1536×1024; oran kontrolü geçti, yeniden boyutlandırma yapılmadı.
- Teknik sınır ve kullanıcı tercihi (2026-10-14): ekranlarda piksel düzeyinde saf `RGB(0,255,0)` yerine yakın yeşil tonları var; `kit_check` toleransıyla geçiyorlar. Saf renge Python düzeltmesi teklif edildi; kullanıcı **"Ham imagegen çıktıları kalsın"** dedi. Bu nedenle yeşiller teknik işlemle değiştirilmedi; tam saf renk şartı için doğrulama iddiası yok.
- Üç sahne sonunda `G805: ara kayıt (3/5)` main'e gönderildi (`e9bb898`). Repo değişiklikleri yalnız bu görev dosyası ve kendi mockups klasörüyle sınırlı; ek önizleme, metrik veya rapor dosyası yok.

## Günlük
- 2026-10-14 ara kayıt: gpt-gorsel-B, 3/5 sahne üretildi; cover_hand_v2 (üst alan), laptop_phone_v2 (yazısız klavye) seçildi; mevcut 3 sahne kit_check kontrolünden geçti.
- 2026-10-14 alindi: gpt-gorsel-B
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-B; 5/5 geçti, kullanıcının tercihiyle ham imagegen çıktıları korundu.
