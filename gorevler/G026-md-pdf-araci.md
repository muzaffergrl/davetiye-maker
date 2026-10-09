---
id: G026
baslik: tools/md_to_pdf.py — markdown'dan markalı PDF
rol: claude-kod
durum: inceleme
alan: claude-kod-5
oncelik: 3
bagimli: []
yazar: [tools/md_to_pdf.py]
---

## Amaç
Kılavuz (A5) ve ilan PDF'i (B3) için palete uyan, tıklanabilir linkli PDF üretmek.

## Girdiler
- `<kit>/palette.json`
- G024/G025 çıktıları (örnek için)

## Yapılacaklar
1. CLI: `python3 tools/md_to_pdf.py <girdi.md> <çıktı.pdf> --palette <palette.json> [--size letter]`.
2. Linkler tıklanabilir kalmalı; fontlar çalışma anında indirilebilir ama repoya font dosyası konmaz.
3. Çıktıdan `pdftotext` ile link ve metin kontrolü yapan küçük test.

## Bitti sayılması için
- [ ] Örnek PDF'te linkler tıklanabilir (pdf link annotation sayısı > 0)

## Sonuç
**Yapıldı (claude-kod-5, 2026-10-09):**
- `tools/md_to_pdf.py`: `python3 tools/md_to_pdf.py <girdi.md> <çıktı.pdf> --palette <palette.json> [--size letter|a4|a5] [--no-fonts] [--keep-html yol] [--title "..."]`.
  Yol: markdown → HTML (dosya içindeki küçük dönüştürücü; ek Python paketi yok) → Playwright Chromium `page.pdf()`.
  Desteklenen: başlıklar (id'li, iç link `#...` çalışır), kalın/italik/kod, link, `<otomatik>` ve çıplak URL, görsel,
  iç içe listeler, `- [ ]` kutuları, alıntı, tablo (hizalama), kod bloğu, `<!-- pagebreak -->`. Ham HTML kaçışlanır,
  `javascript:` linkleri `#` olur. PDF başlığı ilk `#` başlıktan; altbilgide sayfa numarası.
- Marka: beyaz (baskı) zemin; başlık rengi paletten beyaza karşı okunur olanı seçilir (deep → ink → primary;
  koyu paletlerde de çalışır), altın çizgi/vurgu, tablo başlığı ve alıntı mist tonunda.
- Fontlar: Cormorant Garamond (başlık) + Montserrat (metin) Google Fonts'tan çalışma anında geçici klasöre indirilir
  (palette.json'da `fonts` anahtarıyla değiştirilebilir); indirme olmazsa uyarı + sistem fontu. Repoya font girmez.
- Test: `tools/tests/test_md_to_pdf.py` (G028'in `tools/tests/` yazma alanında).

**Test edildi:** dönüştürücü çıktısı; Letter (612×792) ve A4 PDF'te 4 dış `/URI` link annotation'ı + 1 iç link,
pdfinfo sayfa sayısı (pagebreak) ve başlık, pdftotext ile metin, ara HTML'de palet renkleri, bozuk palet → çıkış 1.
Elle: Dusty Blue (Letter, fontlar indirildi, pdffonts gömülü) ve Midnight Garden (A5) örnekleri render edilip görsel kontrol edildi.

**Test edilmedi:** gerçek G024/G025 metinleri (henüz yok); PDF linklerinin Acrobat/telefon PDF görüntüleyicisinde
tıklanması (annotation var, alıcı cihaz testi kılavuz QA'sında yapılmalı). Not: Google variable fontları Chromium'da
Type 3 olarak gömülüyor; metin seçilebilir/aranabilir (ToUnicode var), baskıda sorun beklenmez ama denenmedi.

## Günlük
- 2026-10-09 alindi: claude-kod-5
- 2026-10-09 bitti, incelemeye gönderildi
