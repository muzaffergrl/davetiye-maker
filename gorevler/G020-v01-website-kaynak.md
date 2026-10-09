---
id: G020
baslik: A2 — tek sayfa responsive website HTML kaynağı
rol: claude-kod
durum: alindi
alan: claude-kod-3
oncelik: 2
bagimli: []
yazar: [collections/02_Dusty_Blue/website/]
---

## Amaç
Canva Website'a aktarılacak tek uzun landing page'in kaynağını ve mobil testini hazırlamak.

## Girdiler
- `collections/02_Dusty_Blue/content.demo.json`
- `collections/02_Dusty_Blue/palette.json`
- `collections/02_Dusty_Blue/assets/layers/` ve (varsa) `collections/02_Dusty_Blue/kit_layers/`
- `.claude/agents/website-gelistirici.md`
- `docs/03_URUN_ICERIK_SEMASI.json`

## Yapılacaklar
1. `website/index.html` (tek dosya, CSS içinde; fontlar Google Fonts link'i — font dosyası koyma).
2. Bölümler: hero (isimler, tarih, geri sayım alanı) · Our Story (3 foto) · Details (tören/kokteyl/resepsiyon) · Travel & Stay · Registry · RSVP (Canva Form yeri — şimdilik açıkça işaretlenmiş yer tutucu blok) · FAQ.
3. Her bölüm `data-document-role="page"` ile Canva static HTML import'a uygun bir sürüm de üret: `website/canva_import.html`.
4. Gerçek URL yok; link alanları `#` ve yorumla işaretli.
5. Playwright ile 360/390/430/768/1280 px ekran görüntüleri → `website/previews/`.

## Bitti sayılması için
- [ ] Yatay kaydırma yok; 360 px'de metin taşmıyor
- [ ] İçerik kaydıyla birebir (isim, tarih, saat, mekân)

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-09 alindi: claude-kod-3
