---
id: GM06
baslik: Dükkân geneli güven ve albeni sahneleri — 6 GPT görseli (3 adım, misafir RSVP, çift düzenliyor, her cihaz, QR masa kartı, atölye)
rol: gpt-gorsel
durum: bitti
alan: codex-gpt-gorsel-gm06
oncelik: 2
bagimli: []
yazar: [brand/trust/]
---

## Amaç
K32: Etsy'de ilanı inceleyen alıcı "kolayca düzenlerim, misafirlerim kolayca kullanır" diye ikna olmalı. Tasarımdan bağımsız,
her ilanda ortak kullanılacak 6 sahne. Prompt'lar: `brand/trust/GPT_PROMPTS.md`.

## Bitti sayılması için
- [x] 6 görsel doğru yolda ve ölçüde; yazı/logo/filigran yok; insanlar kurgusal, görünen eller kontrol edildi.
- [x] Yeşil alanlar düz ve yansımasız; tam #00FF00 yerine, kullanıcının 2026-10-15 yanıtına göre aracın ürettiği yeşil korundu (aşağıdaki not).

## Sonuç

2026-10-15 — T1–T6 bu tek sohbette sırayla üretildi; toplam 16 üretim/düzenleme denemesi yapıldı.
`brand/trust/GPT_PROMPTS.md` baştan sona okundu. İngilizce prompt blokları değiştirilmeden kullanıldı;
Kaydet/Kontrol satırları ve kontrolleri uygulayan ek notlar araca bağlam olarak iletildi.
Seçilen altı görsel sade adlarıyla main'e kaydedildi: `987792f` — `GM06: güven sahneleri`.

| Görsel | Kaydedilen dosya | Ölçü | Seçilen deneme / toplam | Önceki denemelerin elenme nedeni |
|---|---|---|---|---|
| T1 | `brand/trust/t1_three_steps.png` | 2000×2000 | 3 / 3 | İlk çıktı yataydı ve ekranlarda kamera adaları vardı; ikinci çıktıda çentikler kaldı. Üçüncüde üç telefon tam, paralel, eşit aralıklı ve ekranlar kesintisiz. |
| T2 | `brand/trust/t2_guest_rsvp.png` | 2000×2000 | 2 / 2 | İlk denemede parmak ucu ekran kenarına taşıyordu. İkincide ekran tamamen açık; görünen el/parmak anatomisi kontrol edildi. |
| T3 | `brand/trust/t3_couple_editing.png` | 2000×2000 | 1 / 1 | İlk deneme seçildi: çift aynı telefona bakıyor; ekran görünür, eller tutarlı. |
| T4 | `brand/trust/t4_any_device.png` | 2000×2000 | 5 / 5 | İlk iki denemede telefon tablet ekranını örtüyordu. Üçüncü/dördüncüde klavyede harf benzeri açık izler kaldı. Beşincide cihazlar ayrı ve tam; tuşlar boş. |
| T5 | `brand/trust/t5_share_qr.png` | 2000×2000 | 3 / 3 | İlk iki denemede kare yaklaşık %35 hedefinden büyüktü; ikinci denemede telefon ayaktaydı. Üçüncüde kare küçültüldü, telefon masada yatıyor. |
| T6 | `brand/trust/t6_atelier_flatlay.png` | 3000×2000 | 2 / 2 | İlk denemede dizüstü kadrajdan taşıyordu. İkincide ana nesneler tam, boşluk daha geniş; mühürler/kalem/dizüstü harfsiz ve logosuz. |

Kontroller: altı PNG yeniden açıldı ve tam piksel ölçüleri doğrulandı. Mevcut `tools/kit_check.py`
işlevleri, bu prompt dosyasından okunan kayıtlarla ve beklenen yeşil alan sayılarıyla çalıştırıldı:
T1=3, T2=1, T3=1, T4=3, T5=2; T6'da yeşil alan istenmiyor. Altı dosya geçti;
yeşil alanların dörtgen geometrisi ve dışbükeyliği de geçti. Yazı/harf/rakam/logo/filigran,
yansıma, kartın boşluğu ve görünen el anatomisi görsel olarak incelendi; otomatik OCR yapılmadı.
Gerçek kişi fotoğrafı referans alınmadı. T4'ün dördüncü ve T5'in üçüncü denemesinde yalnız
bu sohbette üretilmiş sahne referans kullanıldı. Elenen denemeler main'e eklenmedi;
ham çıktılar çalışma ortamındaki `generated_images/` klasöründe korundu.

**Emin olunmayan noktalar / sınırlar:**
- Tam #00FF00 üretilmedi. Kullanıcı, renk sabitlemesi sorusuna açıkça **“Hayır, aracın ürettiği yeşili koru”** dedi;
  bu nedenle yeşil alanlara renk boyama/sabitleme uygulanmadı. Son dosyalardaki en sık yeşil RGB değerleri:
  T1 `(2,250,1)`, T2 `(2,252,11)`, T3 `(20,252,23)`, T4 `(4,251,4)`, T5 `(3,250,17)`.
  Bunlar mevcut aracın toleranslı yeşil kontrolünü geçiyor; tam RGB eşitliği iddia edilmiyor.
- Kaynak çıktılar T1–T5 için 1254×1254, T6 için 1536×1024'tü. İstenen dosya ölçülerine
  oran korunarak teknik yeniden boyutlandırma yapıldı; kırpma veya sahneye nesne ekleme yapılmadı.
  Son dosyalar istenen ölçüde olsa da kaynaklar bu çözünürlüklerde doğal detay üretmedi.
- T2/T3 kişileri kurgusal üretildi; gerçek kişilere tesadüfi benzerlik bulunmadığı biyometrik olarak sınanmadı.
- Gerçek ekran/QR montajı bu görevin çıktısı değil; yeşil alanlar montaj için boş bırakıldı.

## Günlük
- 2026-10-15 açıldı (kullanıcı K32)
- 2026-10-15 alindi: codex-gpt-gorsel-gm06
- 2026-10-15 T1–T6 üretildi; 987792f ile main'e push edildi.
- 2026-10-15 Sonuç ve kullanıcı yeşil tonu kararı kaydedildi; incelemeye gönderildi.
- 2026-10-16 entegratör onayladı
