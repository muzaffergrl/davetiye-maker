---
id: GM09
baslik: Etsy banner sahnesi — mum mühürlerde S sembolü (1 GPT görseli)
rol: gpt-gorsel
durum: inceleme
alan: codex-gpt-gorsel
oncelik: 2
bagimli: [GM08]
yazar: [brand/assets/gpt/final_s/brand_scene_wide_s.png, gorevler/GM09-banner-s.md]
---

## Amaç
G129 sonrası Etsy banner'ı hâlâ K'li mum mühür gösteriyor. Prompt: `brand/GPT_PROMPTS.md` **B3.6** (iki referans görselle).

## Bitti sayılması için
- [x] `brand/assets/gpt/final_s/brand_scene_wide_s.png` 1536×1024; B3.6 "Kontrol" satırı sağlanıyor.
- [x] Commit + push: `GM09: S mühürlü banner sahnesi`.

Sonra (Claude): banner'ları bu sahneden kırp, yazı logosu ekle; Etsy'ye yükleme ayrı adım.

## Sonuç

B3.6 prompt'u aynen, `brand/assets/gpt/final/brand_scene_wide_v2.png` (sahne) ve
`brand/assets/gpt/final_s/monogram_s.png` (S sembolü) referanslarıyla imagegen'de çalıştırıldı.
Seçilen çıktı `brand/assets/gpt/final_s/brand_scene_wide_s.png` olarak kaydedildi:
1536×1024, opak RGB PNG. Eski referans dosyaları değiştirilmedi.

İki düzeltme turu yapıldı: ilk denemede nesneler büyüyüp sağdaki boş alana taştığı için
referanstaki ölçek ve orta bant yeniden belirtildi; ardından yeşil dal zarfın altına alınarak
sağ %45 tamamen boş bırakıldı ve iki mührün S/altın kama ayrıntısı netleştirildi.
Yalnız seçilen görsel repoya eklendi; sahne veya semboller kodla çizilmedi.

Kontrol: PNG dosyası açıldı; `file` ve ImageMagick `identify` ile 1536×1024 RGB olduğu doğrulandı.
İki mühür yakın plan incelendi: ikisinde de açıkça S ve üst sağ altın kama var, K veya başka yazı yok.
Sağ %45 boş kağıt yüzeyi; telefon, gerçek zarf ve mühürler yüksekliğin %30–70 orta bandında.
1536×384 merkez kırpım önizlemesinde (y=320–703) telefon, gerçek zarf ve iki mühür tam görünüyor.
Kırpım/ayrıntı önizlemeleri yalnız geçici QA dosyalarıdır; Etsy banner dosyaları ve yazı logosu
bu görevde üretilmedi, Etsy'ye yükleme yapılmadı. Entegratör incelemesine hazır.

## Günlük
- 2026-10-17 açıldı (koordinatör)
- 2026-10-17 alindi: codex-gpt-gorsel
- 2026-10-17 bitti, incelemeye gönderildi: codex-gpt-gorsel
