---
id: G083
baslik: Tasarım 02 Dusty Blue & Champagne satış sitesine eklenir (G082 yöntemi) — tasarım sayfası, metin, gerçek ekranlar, /designs düzeni
rol: claude-kod
durum: bitti
alan: claude-G083
oncelik: 2
bagimli: [G402, G082]
yazar: [platform/lib/marketing/, platform/public/marketing/designs/, platform/scripts/marketing-assets.ts, platform/tests/, platform/previews/g083/, docs/14_SATIS_SITESI.md, platform/components/marketing/]
---

## Amaç
G402 (02 Dusty Blue & Champagne, tema `dusty-blue-champagne`) onaylandı. G082 ile 05 nasıl eklendiyse 02 de aynı yolla satış sitesine girer; böylece /start kapısı da açılır.

## Yapılacaklar
1. `designs.ts`/config'e 02: ad, kısa ve uzun açılış metni (tema README'si ve gerçek ekranlarla; uydurma yok), `status: 'live'`.
2. `scripts/marketing-assets.ts --designs dusty-blue-champagne` (gerekirse `--shots`) ile yalnız 02'nin gerçek ekranları ve açılış klibi; 01/03/05 görselleri değişmez.
3. /designs düzeni: 4 tasarımla telefonda 2 sütun tek kalan kart bırakmamalı; ana sayfa tasarım düğmeleri 390'da iki satıra inmesin (G082 notu).
4. Testler: marketing unit + marketing-browser + g080/g082 kapı testleri (02 artık açık); npm test, typecheck, build.
5. Önizleme `platform/previews/g083/` (390 + 1280). docs/14 §14.1'e 02 ve 05 satırı + marketing-assets yeni seçenekleri. Sonuç, Günlük, bitir.

## Sonuç
**2026-10-14 · claude-G083 — durum: inceleme.** 02 Dusty Blue & Champagne satış sitesinde `live`. Bu, G080 kapısında onay
demek: production'da `/start?theme=dusty-blue-champagne` açılıyor; 04 hâlâ `coming` ve kapıda reddediliyor. Yayın yapılmadı;
her şey yerel production build ile denendi.

**1. Liste ve metin** (`platform/lib/marketing/`)
- `config.ts`: `dusty-blue-champagne` · "Dusty Blue & Champagne" · `live` · `updated: 2026-10-14`; fiyat ve Etsy linki öteki
  tasarımlar gibi yer tutucu. Sıra 03, 01, 05, 02 (ana sayfa ve "how it works" yine 03'ü gösterir).
- `designs.ts`: stil satırı, meta (150 karakter), giriş, açılış (3 cümle), 4 sayfa alt yazısı, palet, font, llms satırı, 2 rehber
  (`wedding-website-wording`, `when-to-send-your-wedding-website`). Kaynak: tema README'si (G402), katalog açılış cümlesi (docs/09
  WEB 02), gerçek ekranlar ve klip kareleri. Açılış: mühür kopar ve dönerek ekranın altından düşer, kapak kalkar, mavi-altın damask
  astar görünür, portreli kart zarftan yükselir, yanında tek okaliptüs yaprağı süzülür, kart home'un ilk ekranı olur (kareler
  tek tek kontrol edildi). Palet `site.css` token'ları: Dusty Blue #4E6782, Powder Blue #CCDCEC, Ivory #FBF7EF, Champagne #B8996A,
  Navy #2B3A4E. Fontlar temanın yüklediği Pinyon Script + Cormorant Garamond; demo çift Eleanor & Theo (kurgu). Uydurma özellik
  yok; test 01/03/05'e ait kelimeleri arıyor (lace, bow, ribbon, lemon, tile, swipe…).
- `site.ts` `designTitle()`: "Dusty Blue & Champagne: Envelope Wedding Website | BKE Studio" 61 karakterdi (sınır 60). Uzun adda
  önce iki nokta düşer (`Dusty Blue & Champagne Envelope Wedding Website | BKE Studio`, 60), 12 karakterlik markada "Envelope" da
  (`…: Wedding Website | Seal & Story`). Öteki tasarımların başlıkları aynı kaldı.

**2. Gerçek ekranlar ve açılış klibi** (`public/marketing/designs/dusty-blue-champagne/`, 1,2 MB)
- 8 ekran × 320/480/640 WebP, 10 sn H.264 klip (390×844, **399 KB**) ve poster. `assets.json`'a yalnız 02 eklendi.
- **01/03/05 değişmedi.** `public/marketing/**` altındaki öteki 103 dosyanın (01/03/05 + panel) sha1'i önce ve sonra aynı.
  `assets.json`'daki eski girdiler de birebir aynı.
- Komut: `node scripts/marketing-assets.ts --designs dusty-blue-champagne --shots <geçici>/shots02`, ardından `--check`: ok.
  Betikte değişiklik gerekmedi.
- **Kaynak:** `collections/02_Dusty_Blue/package/shots` yok. G082'deki gibi G059 aracının (`tools/listing_templates/capture.ts`)
  geçici bir kopyası çalıştırıldı (bu checkout'un build'i, geçici veri). Kopyada alıcı/panel bölümü çıkarıldı ve platform yolu
  değişkene bağlandı; misafir ekranları ve kayıt kodu aynı. Commit edilmedi. Misafir ekranları 13/13, kontroller geçti.
- `schedule` ve `form` ekranlarını araç, saydam menünün üstünden kesti (640 × 1270 / 1244). Araç, menünün arkasında yazı kalan
  kareyi böyle kısaltıyor. Bu iki ekran sitede yalnız 1. ve 2. tasarım için kullanılıyor, 02'de görünmüyor.

**3. Düzen** (`components/marketing/`, yalnız düzen)
- **Kart ızgarası** (`/designs` ve ana sayfa şeridi): 4 tasarımla telefonda zaten 2 + 2. Sorun 1280'deydi: auto-fit 3 + 1 yapıyordu.
  - ≥ 900 px: 4 tasarım 2 × 2. ≥ 1200 px: tek sıra 4 (`:has(> :nth-child(4):last-child)`).
  - Telefonda tek sayıda tasarım olursa (ör. 04 gelince 5) son kart ortada ve aynı genişlikte kalır.
  - Ölçüm 320/360/390/430/768/1024/1280: hepsi 2 + 2, 1280'de 4.
- **Ana sayfa tasarım çipleri:** 4 adla tek satıra sığmıyor. Önce 390'da 3 satıra iniyor ve düğmeyi ilk ekranın altına itiyordu.
  - < 1024 px'te tek satır: ekran kenarına uzanan, yana kaydırmalı şerit. Kenarda kesilen çip devamını gösterir; sığarsa ortalı.
  - Odak halkası için 6 px pay bırakıldı. `Demo.tsx`'e `data-scroll-x` eklendi (tek öznitelik).
  - Ölçüm 320–768: 1 satır, son çipe kaydırılabiliyor, sayfa yana kaymıyor.
  - ≥ 1024 px'te çipler metnin yanında satır kırabilir: 1280'de 2 + 2, 1024'te 2 + 1 + 1.
- **`/about`:** son canlı tasarımın Our Story ekranını gösteriyor (artık 02: başlık + "Our first coffee" baskısı). Anlamlı ve
  yükleniyor. Sayfa kodu yazma alanım dışında, değiştirilmedi.

**4. Docs** `docs/14` §14.1:
- 05 (G082) ve 02 (G083) satırları;
- "Görseller" satırında `--designs <id>[,<id>…]`, `--shots <dir>`, `--panel`, `--check` ve yeni tasarım adımı;
- kart/çip düzeni satırı;
- sayfa listesinde iki tasarım sayfası.

**5. Testler** (yerel production build; port 42010–42017)
- `npm test` **560/560** (önce 553; origin/main birleştirmesinden — G404 — sonra **561/561**, typecheck ve build yeniden temiz). Yeni: `tests/g083-designs.test.ts`, 7 test:
  - liste ve sıra;
  - ≤ 60 karakter başlık kuralı;
  - metin ↔ tema (demo çift, fontlar, palet token'ları, README kelimeleri, 01/03/05 kelimesi yok);
  - assets;
  - JSON-LD (Product, Offer yok, VideoObject, ItemList 4);
  - llms ve sitemap;
  - production kapısı: 02 onaylı, POST 201; 04 403 `theme_in_review`.
- Güncellenen testler: `g082-designs` (05 hâlâ 3. sırada; ItemList sayısı listeden; kapıda yalnız 04), `g080-approval` (02 onaylı),
  `g080-browser` (incelemedeki örnek tasarım artık 04).
- `npm run typecheck` temiz. `npm run build` + trace-check geçti. `marketing-assets.ts --check` ok.
- `tests/marketing-browser.ts` **358/358** (G082'de 312). Artış 02 sayfası ve yeni G083 bölümünden. G083 bölümü:
  - 7 genişlikte `/designs` ve ana sayfa şeridinde son satırda tek kart yok;
  - telefonda çipler tek satırda ve son çipe ulaşılıyor;
  - 02 çipi posteri değiştiriyor;
  - `/about` story ekranı yükleniyor.

  Çıktı geçici klasöre yazıldı, `previews/g061` değişmedi.

  Lab ölçümü (390 px, CPU 4×, yavaş 4G), `/designs/dusty-blue-champagne`: LCP 984 ms, CLS 0, 364 KB.
- `tests/g080-browser.ts` **99/99** (önce 97). THEME_APPROVAL=enforce ile:
  - 02'nin `/start` sayfası 200 ve POST 201;
  - 04'ün sayfası 404, POST 403, demosu açık.

  Önizlemeler geçici klasöre yazıldı.

**Önizleme** `platform/previews/g083/`:
- `designs_cards_{390,1280}`: 2 + 2 / tek sıra 4;
- `design_dusty-blue-champagne_{390,1280}`: ilk ekran;
- `…_pages_{390,1280}`: 4 gerçek ekran + alt yazılar;
- `home_designs_{390,1280}`: ana sayfa şeridi;
- `home_first_screen_{390,1280}`: çipler 390'da tek satır;
- `home_chips_end_390`: şerit sonda, 02 seçili;
- `about_story_390`;
- `checks.json`: komut sonuçları, çekim kontrolleri, ölçümler, G083 tarayıcı kontrolleri.

**Açık noktalar**
- Vercel'de denenmedi. Yayından sonra `https://<site>/start?theme=dusty-blue-champagne` 200 dönmeli.
- Çip şeridinde 360 px'te 3. çipin yalnız ~12 px'i görünüyor; devam ipucu zayıf. 320'de 2. çip kesik, 390'da 42 px görünüyor.
- Masaüstünde çipler satır kırıyor. 1024'te 3 satır oluyor ve 2. satırdan sonrası ilk ekranın altında kalıyor. Masaüstünde fareyle
  yana kaydırma zor olduğu için şerit yalnız < 1024 px'te.
- Gerçek telefonda dokunarak kaydırma denenmedi.
- `tools/listing_templates/capture.ts` alıcı/panel bölümü hâlâ eski panel seçicilerinde düşüyor; G082'nin önerdiği görev açık.
  Koleksiyonda `package/shots` yok; G902/ilan kiti çekimi oraya yazınca `--designs dusty-blue-champagne` bayraksız koşulabilir.
  O çekimde `schedule`/`form` yine kesilebilir; çekim değişirse görseller de değişir.
- `/about` her yeni tasarımda en son ekleneni gösterir (`designs[designs.length - 1]`). Sabit bir seçim isteniyorsa sayfa kodu
  değişmeli; yazma alanım dışında.
- `platform/README.md` betiğin yeni bayraklarını bilmiyor; yazma alanım dışında. docs/14 güncellendi.
- docs/14 §6.1'deki eski plan cümlesi ("Tasarım çipleri: Blush Garden Rose · Olive & Ivory") plan metni olarak bırakıldı.
- Fiyat ve Etsy linki yer tutucu. "Coming soon on Etsy" görünüyor, Offer yok (diğer tasarımlarla aynı).
- Denenmedi: gerçek telefon, ekran okuyucuyla elle deneme, Google Rich Results Test.

## Günlük
- 2026-10-14 açıldı (entegratör): G402 onaylandı
- 2026-10-14 alindi: claude-G083
- 2026-10-14 claude-G083: 02 live (config + metin + ≤ 60 karakter başlık kuralı), marketing-assets --designs dusty-blue-champagne --shots ile yalnız 02'nin ekranları/klibi (01/03/05 + panel bayt bayt aynı), kart ızgarası (tek kart yok; 1280'de 4'lü sıra) + telefonda tek satır çip şeridi, docs/14 §14.1; npm test 560/560, marketing-browser 358/358, g080-browser 99/99
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör onayladı
