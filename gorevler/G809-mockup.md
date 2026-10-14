---
id: G809
baslik: Tasarım 09 Lavender Provence — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/09_Lavender_Provence/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/09_Lavender_Provence/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/09_Lavender_Provence/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/09_Lavender_Provence --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç

- gpt-gorsel-A, PAKET 3 talimat bloğunu ve 3.1–3.5 İngilizce prompt'larını tek sohbette, sırayla ve aynen kullanarak beş fotoğraf sahnesini üretti. Yalnız bu görev ve `collections/09_Lavender_Provence/assets/gpt/mockups/` değiştirildi.
- Seçilen dosyalar: `cover_hand.png` (v2), `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`. İlk iki sahneden ve ikinci iki sahneden sonra ayrı ara kayıt commit + push yapıldı; her push öncesinde `git pull --rebase origin main` kullanıldı.
- Kapak yeniden üretildi: `cover_hand_v1.png` ilk deneme; telefon çok yukarıdaydı ve lavanta başlık alanına giriyordu. `cover_hand_v2.png` üst alanı boş bırakan seçilmiş sürüm. `cover_hand_v3.png` yalnız ekranı tam RGB(0,255,0) yapma denemesi; piksel eşitliği yine sağlanmadığından seçilmedi. Seçilen v2 sade `cover_hand.png` adıyla da kaydedildi.
- Kontrol: `python3 tools/kit_check.py collections/09_Lavender_Provence --paket 3` → **5/5 geçti**, çıkış kodu 0. Beklenen ekran sayıları 1/3/2/1/1; dörtgen/dışbükeylik denetimleri geçti. Görsel incelemede parmak/süs ekranlara binmiyor; üst kapak alanı ve masa sahnesinin sol üçte biri sakin/boş; görünür yazı ve logo yok, laptop tuşlarında okunabilir karakter yok. Yazı denetimi görsel olarak yapıldı; OCR yapılmadı.
- **Kalan kesin renk farkı:** üretici saf #00FF00 istemine rağmen yeşil yüzeylere küçük RGB değişimleri ekledi. Seçilen ekranların baskın örnekleri sırasıyla `(3,252,4)`, `(4,251,3)`, `(4,251,8)`, `(3,252,7)`, `(6,252,4)`. Kapakta yalnız ekran dolgusunu düzeltmeye yönelik v3 de tam eşitlik sağlamadı. `kit_check` toleranslı yeşil maskesiyle geçer; piksel düzeyinde her ekranın tamamen saf ve tek renk #00FF00 olması **sağlanmadı**. Bu şart incelemede açık kaldı.
- Doğal üretici çıktıları: kare sahneler 1254×1254, yatay sahneler 1536×1024, opak RGB PNG. Kaydet satırının oranları sağlandı; kareler 1024×1024'e yeniden boyutlandırılmadı. Ek önizleme, metrik veya rapor dosyası üretilmedi.

## Günlük
- 2026-10-14 alindi: gpt-gorsel-A
- 2026-10-14 ara kayıt: 3.1–3.2 üretildi; kapakta v2 seçildi (ilk denemede telefon ve lavanta üst başlık alanına taşıyordu). İki sahnenin ekran/geometri kontrolleri geçti.
- 2026-10-14 ara kayıt: 3.3–3.4 üretildi; dizüstü + telefon ve üstten masa sahnesinin ekran/geometri kontrolleri geçti. Klavye tuşları boş, masa sahnesinin sol üçte biri boş.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A; 5/5 kit kontrolü geçti. Saf #00FF00 piksel eşitliği üretici tarafından sağlanamadı; v3 denemesi ve kalan fark Sonuç'a yazıldı.
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
