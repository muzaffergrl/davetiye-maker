---
id: G107
baslik: Tasarım 07 Burgundy Velvet Autumn — HTML sahne kaynağı + katmanlar
rol: claude-kod
durum: iptal
alan:
oncelik: 2
bagimli: []
yazar: [collections/07_Burgundy_Velvet/video/, collections/07_Burgundy_Velvet/assets/layers/, collections/07_Burgundy_Velvet/kit_map.json, collections/07_Burgundy_Velvet/previews/]
---

## Amaç
Tasarım 07'in 6 sahnelik 1080×1920 animasyon kaynağını kodla (HTML/CSS/SVG) kurmak ve Canva'ya gidecek ayrı katmanları çıkarmak. Şekiller koddan, yüzeyler (doku/dekor) GPT görsellerinden gelir.

## Girdiler
- `collections/07_Burgundy_Velvet/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor, sahneler)
- `collections/07_Burgundy_Velvet/content.demo.json`, `collections/07_Burgundy_Velvet/palette.json`
- Örnek yapı: `collections/02_Dusty_Blue/video/invitation_motion.html` + `collections/02_Dusty_Blue/assets/layers/layers.json`
- `tools/export_layers.mjs`, `tools/render_motion.mjs`
- Varsa GPT görselleri: `collections/07_Burgundy_Velvet/assets/gpt/` (yoksa koddan yer tutucu yüzey kullan)
- `docs/07_KIT_STANDARDI.md` §6 (genel kit_map)

## Yapılacaklar
1. `collections/07_Burgundy_Velvet/video/invitation_motion.html`: 6 sahne, ~26 sn; brief'teki zarf mekaniği ve foto sunumu **gerçekten** ayrı nesnelerle hareket etsin.
2. Görselde metin yok: bütün metinler HTML metni (Canva'da metin olacak). Fontlar Google Fonts link'iyle; font dosyası koyma.
3. `collections/07_Burgundy_Velvet/assets/layers/layers.json` + `export_layers.mjs` ile şeffaf katmanlar → `collections/07_Burgundy_Velvet/assets/layers/` (zarf parçaları, kapanış elemanı, kart, çerçeveler, dekor, arka plan ayrı ayrı).
4. `collections/07_Burgundy_Velvet/kit_map.json`: her katman için kaynak GPT dosyası ve yöntem (`docs/07_KIT_STANDARDI.md` §6).
5. Önizleme: `render_motion.mjs` ile MP4 + 6 anahtar kare → `collections/07_Burgundy_Velvet/previews/`.
6. Diğer 19 tasarımla karıştırılmayacak kadar farklı olmalı (katalogdaki eksenler).

## Bitti sayılması için
- [ ] MP4 önizleme oynuyor; 6 sahne var
- [ ] Katmanlar ayrı ve şeffaf; metin pişirilmemiş
- [ ] kit_map.json geçerli JSON

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-09 blokaj: K21 (kullanıcı): tasarımı GPT yapar; kodla çizilmiş sahne kaynağı yapılmaz. Pilot G030/G031 sonrası yeniden tanımlanacak
- 2026-10-16 iptal: K22/K24 — (K21) kodla çizilmiş video sahne kaynağı + Canva katmanları; video yok → G407
