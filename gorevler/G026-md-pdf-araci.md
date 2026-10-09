---
id: G026
baslik: tools/md_to_pdf.py — markdown'dan markalı PDF
rol: claude-kod
durum: hazir
alan:
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
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
