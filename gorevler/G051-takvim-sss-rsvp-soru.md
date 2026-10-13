---
id: G051
baslik: Platform özellikleri — Takvime ekle, SSS metinleri, RSVP özel sorusu (pazar standardı, docs/13 §7)
rol: claude-kod
durum: alindi
alan: wf-tema
oncelik: 2
bagimli: [G038, G039, G042]
yazar: [platform/lib/, platform/app/, platform/components/, platform/themes/blush-garden-rose/, platform/tests/, platform/README.md, docs/03_URUN_ICERIK_SEMASI.json, tools/validate_content.py]
---

## Amaç
Etsy araştırması (docs/13 §7): rakiplerde standart olup bizde olmayanlardan lisans/karar gerektirmeyen üçü.
Müzik çalar bu görevde **yok** (lisans kuralı AGENTS şart 9; kullanıcı kararı).

## Yapılacaklar
1. **Takvime ekle:** etkinlik için `.ics` (RFC 5545, doğru saat dilimi, VTIMEZONE ya da UTC) + Google Calendar linki; tema
   işaretiyle (`data-calendar`) home/details'te buton. Rota `/[slug]/event.ics`; yayınlanmamış site 404.
2. **SSS metinleri:** şemaya `faq: [{q, a}]` (≤12, uzunluk sınırları), panelde ekle/sil/sırala, temada `data-repeat` ile details
   sayfasında açılır-kapanır liste; `optional_blocks.faq` ile aç/kapa. validate_content.py ve TS doğrulama eşit.
3. **RSVP özel sorusu:** şemaya `rsvp.questions: [{id, label, type: "choice"|"text", options?[]}]` (≤3); misafir formunda
   gösterim, kayıt, panel listesi ve CSV'de sütun. Mevcut yanıtlarla geriye uyumlu.
4. Testler + Playwright 390 px kontrolü; README güncel.

## Bitti sayılması için
- [ ] Üç özellik testli; 390 px'te temada düzgün; CSV'de özel soru sütunu

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 alindi: wf-tema
