---
id: G810
baslik: Tasarım 10 Tuscan Vineyard — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-B
oncelik: 2
bagimli: []
yazar: [collections/10_Tuscan_Vineyard/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/10_Tuscan_Vineyard/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/10_Tuscan_Vineyard/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/10_Tuscan_Vineyard --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç

- PAKET 3 talimat bloğu ve 3.1–3.5 prompt'ları aynı sohbette sırayla ve aynen kullanıldı; beş fotoğraf sahnesi üretildi. Ortak meşe masa, şarap tonları, üzüm/asma/zeytin dekoru ve mantar korundu.
- Dosyalar: `assets/gpt/mockups/cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png` (koleksiyon kökü: `collections/10_Tuscan_Vineyard/`).
- Yeniden üretim: kapak `_v2` (telefonun konumu aşağı alındı, üstte başlık boşluğu genişletildi); dizüstü `_v2` (klavye üzerindeki harf benzeri işaretler kaldırıldı). Seçilenler sade adlarla kaydedildi.
- Kontrol: `python3 tools/kit_check.py collections/10_Tuscan_Vineyard --paket 3` → **5/5 geçti**; ekran sayıları sırasıyla 1/3/2/1/1. Bütün dosyalar opak. Görsel denetimde ekran köşeleri açık, ekranlara el/dekor binmiyor, yazı/logo yok.
- İnceleme notu: ham Imagegen ekranları saf RGB (0,255,0) yerine yakın yeşiller içeriyor; toleranslı kit_check bunu kabul ediyor. Kare çıktılar 1254×1254, yataylar 1536×1024. Kullanıcı (2026-10-14) **"Ham Imagegen çıktılarıyla incelemeye gönder."** dedi; ekran rengi/ölçüsü ImageMagick veya başka bir işlemle değiştirilmeden teslim edildi.
- Ek önizleme, metrik veya rapor dosyası üretilmedi; ürün montajı/yayını bu görevin kapsamında test edilmedi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-gorsel-B
- 2026-10-14 ara kayıt: gpt-gorsel-B; 3.1–3.2 kaydedildi. Kapak `_v2` seçildi; ilk denemede telefon yukarıdaydı, başlık boşluğu genişletildi. İki hazır sahne kit_check denetiminden geçti; kalan üç sahne henüz üretilmedi.
- 2026-10-14 ara kayıt: gpt-gorsel-B; 3.3–3.4 kaydedildi. Dizüstü `_v2` seçildi; ilk denemedeki klavye işaretleri kaldırıldı. Dört hazır sahne kit_check denetiminden geçti; 3.5 henüz üretilmedi.
- 2026-10-14 üretim: gpt-gorsel-B; 3.5 kaydedildi, kit_check 5/5 geçti. Tam #00FF00 ve kare 1024×1024 için teknik sabitleme yöntem onayı bekliyor.
- 2026-10-14 kullanıcı kararı: ham Imagegen çıktılarıyla incelemeye gönder; teknik sabitleme uygulanmadı.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-B; 5 sahne, kit_check 5/5.
