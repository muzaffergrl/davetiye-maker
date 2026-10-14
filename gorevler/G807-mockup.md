---
id: G807
baslik: Tasarım 07 Burgundy Velvet Autumn — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-B
oncelik: 2
bagimli: []
yazar: [collections/07_Burgundy_Velvet/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/07_Burgundy_Velvet/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/07_Burgundy_Velvet/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/07_Burgundy_Velvet --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- gpt-gorsel-B, 2026-10-14: PAKET 3 talimat bloğu ve 3.1–3.5 İngilizce promptları tek sohbette, sırayla ve değiştirilmeden kullanıldı; önceki sahneler ortak ceviz masa, bordo kadife, çiçek, altın aksesuar ve ışık için referans verildi.
- `collections/07_Burgundy_Velvet/assets/gpt/mockups/` altında beş seçili sahne: `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`. Kare kaynaklar 1254×1254, yatay kaynaklar 1536×1024; istenen 1:1 ve 3:2 oranları korundu.
- Yeniden üretimler: `cover_hand_v2.png` ve `cover_hand_v3.png`, üst %30 başlık alanına yaklaşan çiçek/yaprakları aşağı almak için; son seçim v3. `laptop_phone_v2.png`, ilk üretimde oluşan klavye harf/işaretlerini kaldırmak için; son seçim v2. Seçimler sade dosya adlarına kopyalandı.
- Görsel kontrol: sırasıyla 1/3/2/1/1 ekran; sekiz ekranın dört köşesi açık, parmak/çiçek/böğürtlen/kurdele ekrana binmiyor; seçili sahnelerde görünür yazı, harf, rakam, logo veya filigran yok. Kapakta üst alan, flat-lay'de sol üçte bir boş; yaşam sahnesinde yüz görünmüyor.
- Kontrol: `python3 tools/kit_check.py collections/07_Burgundy_Velvet --paket 3` → **5/5 geçti**. Ara kayıt ilk üç sahneden sonra `G807: ara kayıt (3/5)` ile main'e push edildi. Ek önizleme, metrik veya rapor dosyası üretilmedi.
- **İnceleme sınırlaması — saf renk şartı:** Imagegen'e ilk üretimlerde ve revizyonlarda saf RGB(0,255,0), opak, yansımasız ve dokusuz ekran istendi. Kaynak ekranlar opak ve görsel olarak düz olsa da salt okunur piksel kontrolü #00FF00 çevresinde renk sapmaları gösterdi; birebir saf #00FF00 şartı sağlanmadı. `kit_check` yakın yeşil tonları toleransla kabul eder; 5/5 sonucu piksel düzeyinde saf renk garantisi değildir. Bu sapma son montaj öncesi teknik renk normalizasyonu gerektirir; kaynaklara kodla boyama uygulanmadı.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-gorsel-B
- 2026-10-14 ara kayıt: gpt-gorsel-B — 3/5 sahne üretildi; cover_hand_v2 (üst başlık alanı) ve laptop_phone_v2 (yazısız klavye) seçilip sade adlara kopyalandı. İlk üç sahnenin ekran sayısı ve geometri kontrolü geçti.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-B — 5/5 kit kontrolü geçti; kapak v3 seçildi, saf #00FF00 piksel sınırlaması Sonuç'a açıkça yazıldı.
- 2026-10-14 entegratör onayladı
