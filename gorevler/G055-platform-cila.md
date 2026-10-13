---
id: G055
baslik: Platform cilası — og:image + favicon, Vercel paket izleme, alıcı fotoğrafı srcset, içerik uzunluk sınırları (docs/11 §14 #6, #7, #9, #10)
rol: claude-kod
durum: alindi
alan: wf-hazirlik
oncelik: 2
bagimli: [G046, G051]
yazar: [platform/lib/, platform/app/, platform/components/, platform/next.config.ts, platform/scripts/trace-check.cjs, platform/tests/g055-*, platform/tests/content*, platform/tests/panel*, platform/README.md, docs/03_URUN_ICERIK_SEMASI.json, tools/validate_content.py]
---

## Amaç
Satış öncesi teknik borçlar. Uzunluk sınırları için varsayılan karar (entegratör, geri alınabilir): `schedule` ≤ 10 satır,
isimler ≤ 40, mekân adı ≤ 80, SSS ve özel sorular mevcut sınırlarıyla; temalar en fazla 10 program satırını taşıyacak şekilde.

## Yapılacaklar
1. Motor, temada `og-1200x630.jpg` ve `favicon.png` varsa `og:image` (mutlak URL) ve ikon etiketlerini yazar (dosyaları G054 üretir).
2. Vercel paketleri: tema görselleri yalnız tema varlık rotasına izlensin (diğer rotalar yalnız `*.html`/`*.json`); trace-check bunu doğrular.
3. Alıcı fotoğrafı yüklemede 640/1280 türevleri; motor `srcset`/`sizes` yazar; fotoğraflı ilk görünüm ölçülür (≤ 1,5 MB DPR 3 hedefi).
4. Uzunluk sınırları: şema + iki doğrulayıcı + panel (sayaç/uyarı) + `/start`; 20 demo kaydı geçerli kalır; 03 Details kartı 10 satırda taşmaz.
5. Testler; README.

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 alindi: wf-hazirlik
