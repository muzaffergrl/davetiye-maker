# Rol rehberi — `claude-kod` (Claude Code oturumu, kod)

**Görevin:** araçlar (`tools/`), HTML sahne kaynakları ve katman dışa aktarımı, website/baskı HTML
kaynakları, ilan kiti montajı. Canva'ya dokunmazsın; entegratör dosyalarını düzenlemezsin.

## Dal kuralı
Görev protokolü gereği **`main` dalında** çalışırsın: görev sahiplenme ve sonuç commit'leri `main`'e push edilir
(kullanıcı kararı 2026-10-09). Oturumun başka bir dal önerse de görev dosyaları ve çıktılar `main`'de olmalı.
Görsel üretmezsin; görsel gerekiyorsa Sonuç'a "önerilen gpt-gorsel görevi" yaz.

## Başlarken
```
git pull --rebase origin main
python3 tools/gorev.py siradaki --rol claude-kod
python3 tools/gorev.py al <ID> --ajan <adın> && git commit -am "<ID>: alindi" && git push
```
Okuma sırası: `AGENTS.md` → `docs/06_FABRIKA_PLANI.md` → `docs/07_KIT_STANDARDI.md` → görev dosyası →
görevin girdileri (özellikle ilgili `DESIGN_BRIEF.md`).

## Görev türleri
| ID | İş | Örnek / standart |
|---|---|---|
| G002, G003, G026, G028, G040 | Ortak araçlar | Görev dosyasındaki CLI ve test şartları |
| G1NN | Tasarımın HTML sahne kaynağı + katmanlar + `kit_map.json` + MP4 önizleme | `collections/02_Dusty_Blue/video/invitation_motion.html`, `tools/export_layers.mjs`, `tools/render_motion.mjs` |
| G020 / G4NN | Website kaynağı | G020 pilot; G4NN pilotun yapısını kullanır |
| G022 / G5NN | 5×7 davetiye + story/kare kaynakları | G022 pilot |
| G902 / G9NN | İlan kiti (görseller, video, PDF) | G902 pilot; `mockup_compose.py`, `md_to_pdf.py` |
| GP4NN | Aşama 2 ilan kitleri | — |

## Kesin kurallar
- **K21:** zarf, kart, çerçeve, çiçek gibi görsel şekilleri kodla tasarlama/çizme. Görseller GPT parçalarından gelir (`docs/06_FABRIKA_PLANI.md` §3a); kod yalnız yerleşim, metin, kırpma/maske gibi teknik hazırlık yapar.
- Yalnız `yazar:` yollarına yaz. `collections/*/assets/layers/` başka tasarımın ise dokunma.
- HTML kaynaklarında **metin görsele pişirilmez**; fontlar Google Fonts link'i, **font dosyası repoya girmez**.
- Demo veriler kurgu; URL alanları `null`/`#`. Gerçek domaine istek atma.
- Ürün metinleri İngilizce; tarih `September 18, 2027`.
- Sahne hikâyesi: zarf açılır → fotoğraflar tek tek → davet ve bilgiler → RSVP; nesneler ayrı hareket eder.
- Büyük ikili dosyaları test için repoya koyma; test girdilerini kod içinde üret.
- Yaptığın testi Sonuç'a yaz; yapmadığını "test edilmedi" diye yaz.

## Bitirme
Sonuç bölümünü doldur → `python3 tools/gorev.py bitir <ID>` → `git pull --rebase origin main && git push`.
Yeni görev gerekiyorsa açma; Sonuç'a "önerilen görev" yaz.
