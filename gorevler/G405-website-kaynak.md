---
id: G405
baslik: Tasarım 05 Mediterranean Lemon — platform teması
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G205, G038, G046]
yazar: [platform/themes/mediterranean-lemon/]
---

## Amaç
Tasarım 05'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de.

## Girdiler
- Örnek tema: `platform/themes/blush-garden-rose/` (G038) ve kaynağı `collections/03_Blush_Garden_Rose/website/` (G035; README → "Yeni tasarım için değişecek yerler")
- Tema standardı ve GPT parça listesi: `docs/11_TEMA_STANDARDI.md` (G046)
- GPT çıktıları (G205): `collections/05_Lemon_Mediterranean/assets/gpt/comps/` (yerleşim referansı, satılmaz), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/05_Lemon_Mediterranean/content.demo.json`, renk `collections/05_Lemon_Mediterranean/palette.json`, özet `collections/05_Lemon_Mediterranean/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (PAKET 5: kırpma, `#00FF00` pencere → foto alanı + maske, `windows.json`), `python3 tools/kit_check.py collections/05_Lemon_Mediterranean --paket 5`

## Yapılacaklar
1. 03 temasının yapısını kopyala: sayfalar, `data-field` işaretleri, `site.js` başındaki MOTION/CONTENT ayrımı, `.photo-slot` foto bileşeni, alt menü. Görsel dil, renkler ve fontlar bu tasarımdan.
2. Parçaları hazırla: `python3 tools/parts_prep.py collections/05_Lemon_Mediterranean --out <tema klasörü>/img_src` (mutlak yol) + temanın build adımı (WebP, 1x/2x). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21). `parts_prep`'in ön cep kesimi kare, V kapaklı zarf varsayar (03'te bile `build_images.py` ile düzeltildi); bu tasarımda (kapaklı zarf) kapak/kapı/cep parçaları tema build adımında `envelope_closed`/`envelope_open`'dan kesilir ve önizlemede gözle doğrulanır.
3. Zarf açılışı (MOTION.envelope): On tap, the lemon tie slips loose and rolls away, the white flap opens upward to reveal the blue-and-white tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom drifts down. Katalog: Çini desenli astarlı beyaz zarf; kapak açılırken limon dalı içeri doğru sallanır. Kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; zarftaki yerine ölçeklenir.
4. Sayfa koreografisi (MOTION.scenes): her sayfada öğeler sırayla girer. Story: Fiyonk dilimli (scalloped) kenarlı çerçeveler, çini panolar gibi döner (three scalloped tile-framed portraits standing perfectly straight in a gentle staggered column down the page (left, right, left) like painted tile panels set into a sunlit white plaster wall, not overlapping). Details/rsvp: kart, satırlar ve buton sırayla; `accent_1..3` süzülür.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan. PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Allura + Playfair Display (Google Fonts link'i; repoya font dosyası girmez). Tarih US biçimi (`May 15, 2027`); URL'ler null → "link will be added soon".
7. Önizleme: 390 px (index, home, story, details, rsvp) + açılış MP4; 360/430/768/1280 px'te yatay kaydırma denetimi.

## Bitti sayılması için
- [ ] Tema demo içerikle açılıyor; 5 sayfa; kişisel metin görselde değil HTML'de
- [ ] Zarf açılışı bu tasarıma özgü; kapanış, zarf/kapak ve kart ayrı nesneler olarak hareket ediyor
- [ ] 390 px önizlemeler ve açılış MP4 var; hiçbir genişlikte yatay kaydırma yok
- [ ] Sonuç dürüst: test edilmeyenler (gerçek iPhone/Safari, RSVP veri akışı, yayın) açıkça yazılı

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
