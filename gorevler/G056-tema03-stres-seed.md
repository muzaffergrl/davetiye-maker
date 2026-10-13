---
id: G056
baslik: 03 teması uzun isim stresi + seed foto türevleri + validate_content --help (docs/11 §14 #9, #15)
rol: claude-kod
durum: alindi
alan: wf-tema01
oncelik: 2
bagimli: [G055]
yazar: [platform/themes/blush-garden-rose/, platform/scripts/seed.ts, platform/tests/theme-blush-garden-rose.test.ts, platform/tests/seed*, tools/validate_content.py, docs/11_TEMA_STANDARDI.md]
---

## Amaç
`theme-check --theme blush-garden-rose --stress` index ve rsvp'de kalıyor: 40 karakterlik isimler zarfı ve "Tap to open"ı ekran dışına itiyor,
rsvp imzası `nowrap` taşıyor. Ayrıca seed fotoğrafları 640/1280 türevsiz; `validate_content.py --help` çöküyor.

## Yapılacaklar
1. 03: uzun isimlerde başlık ölçeği/kırılımı (script'te `&` kuralı korunur), zarf + ipucu ekranda kalır; rsvp imzası sarar/küçülür. Görsel çizim yok.
2. `seed.ts`: fotoğrafları panel yüklemesiyle aynı yoldan türevli kaydet; theme-check'in fotoğraflı ölçümü srcset ile.
3. `validate_content.py --help` düzgün çalışsın.
4. `theme-check --theme blush-garden-rose` ve `--stress` geçer; final-smoke, g051-browser geçer.

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 alindi: wf-tema01
