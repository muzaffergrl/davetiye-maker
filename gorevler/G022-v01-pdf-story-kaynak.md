---
id: G022
baslik: A3 + A4 — 5×7 davetiye ve story/kare kaynakları
rol: gpt-kod
durum: hazir
alan:
oncelik: 2
bagimli: []
yazar: [collections/02_Dusty_Blue/print/]
---

## Amaç
Baskı/telefon davetiyesi (5×7 in) ve paylaşım görselleri (1080×1920, 1080×1080) için HTML kaynakları.

## Girdiler
- `collections/02_Dusty_Blue/content.demo.json`
- `collections/02_Dusty_Blue/palette.json`
- `collections/02_Dusty_Blue/assets/layers/`
- Video master sahne 4 düzeni (`canva/TEXT_SLOTS.json`)

## Yapılacaklar
1. `print/invitation_5x7.html` (1500×2100 px, 300 dpi eşdeğeri), `print/story.html`, `print/square.html`; her biri `data-document-role="page"`.
2. RSVP/website linki için açıkça işaretli yer tutucu (gerçek URL yok).
3. Playwright ile PNG önizleme → `print/previews/`.

## Bitti sayılması için
- [ ] Metin içerik kaydıyla birebir
- [ ] Önizlemeler var

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
