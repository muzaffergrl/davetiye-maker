---
id: G082
baslik: Onaylanan yeni tasarımları satış sitesine ekle (05 Mediterranean Lemon; 02/04 onaylanınca) — tasarım sayfası, metin, gerçek ekranlar
rol: claude-kod
durum: inceleme
alan: claude-G082
oncelik: 2
bagimli: [G405, G080]
yazar: [platform/lib/marketing/, platform/public/marketing/designs/, platform/scripts/marketing-assets.ts, platform/tests/, platform/previews/g082/]
---

## Amaç
G080'den beri /start'ın onay kapısı satış sitesinin tasarım listesinden (`lib/marketing/config.ts` / `designs.ts`, `status: 'live'`) okunuyor.
G405 (05 Mediterranean Lemon) onaylandı ama listede yok → satılamaz ve /start'ta açılamaz. 02 (G402) ve 04 (G404) onaylanınca aynı adım.

## Yapılacaklar
1. `designs.ts`'e 05: ad, kısa ve uzun açılış metni (tema README'si ve gerçek ekranlarla karşılaştırarak; uydurma özellik yok), `status: 'live'`.
2. `scripts/marketing-assets.ts --designs` ile 05'in gerçek ekranları ve açılış klibi (yalnız yeni tasarım; 01/03 görsellerini değiştirme).
3. `/designs` ve `/designs/mediterranean-lemon` sayfaları; JSON-LD, sitemap (launched:false iken boş kalır), llms.txt.
4. Testler: marketing unit + marketing-browser; `/start?theme=mediterranean-lemon` production kapısında artık açılır (g080-approval).
5. Önizleme `platform/previews/g082/` (390 + 1280). Sonuç, Günlük, bitir.

## Sonuç
**2026-10-14 · claude-G082 — durum: inceleme.** 05 Mediterranean Lemon satış sitesinde `live`; aynı satır G080 kapısında onay
demek, yani production'da `/start?theme=mediterranean-lemon` artık açılıyor. Yayın yapılmadı. Yerelde production build ile test
edildi. 02 ve 04 hâlâ incelemede ve listede yok (04 `coming`).

**1. Liste ve metin** (`platform/lib/marketing/`)
- `config.ts`: `mediterranean-lemon` · "Mediterranean Lemon" · `status: 'live'` · `updated: 2026-10-14`. Fiyat ve Etsy linki
  diğer ikisi gibi yer tutucu (`[PRICE]`, `[ETSY LISTING URL]`). Sıra 03, 01, 05; ana sayfa ve "how it works" yine ilk tasarımı (03) gösterir.
- `designs.ts`: kısa stil satırı, meta (151 karakter), giriş, açılış (3 cümle), 4 sayfa alt yazısı, palet, font, llms satırı ve 2 rehber.
  Hepsi tema README'si (G405) ve gerçek ekranlar/klip karelerine bakılarak yazıldı. Açılış metni şunları söylüyor: limon bağı
  gevşeyip ekrandan yuvarlanır, kapak kalkar ve mavi-beyaz çini astar görünür, portreli kart yükselir, köşedeki limon dalı sallanır,
  bir çiçek süzülür, kart home'un ilk ekranı olur. Palet `site.css` token'larından alındı: Cobalt #2A5DA8, Lemon #F2C94C,
  Sky #DCE6F2, Ivory #FFFDF7, Navy #1F3557. Fontlar temanın yüklediği Allura ve Playfair Display. Demo çift Isabella & Marco
  (kurgu). Uydurma özellik yok; test 01/03'e ait kelimeleri de arıyor (wax seal, lace, gold, rose, bow, swipe).
- Başlık "Mediterranean Lemon: Envelope Wedding Website | BKE Studio" 58 karakter. 12 karakterlik markayla 60 karakter (sınır 60).

**2. Gerçek ekranlar + açılış klibi** (`public/marketing/designs/mediterranean-lemon/`, 1,5 MB)
- 8 ekran × 320/480/640 WebP, 10 sn H.264 klip (390×844, **331 KB**) ve poster. `assets.json`'a yalnız 05 eklendi.
- **01/03 değişmedi.** `public/marketing/**` dosyalarının sha1 listesi önce/sonra aynı; 01/03 ve panel girdileri bayt bayt aynı.
- `scripts/marketing-assets.ts` (küçük düzeltme):
  - `--designs <id>[,<id>…]` yalnız bu tasarımları üretir; diğer tasarımlar ve panel `assets.json`'daki hâliyle kalır.
  - `--shots <dir>` (tek id ile) çekimi `collections/<NN>/package/shots` yerine verilen klasörden alır.
  - Çekim klasörü yoksa önceki girdi korunur. Böylece ileride tam bir `--designs` koşusu 05'i düşürmez (05'in koleksiyonda henüz
    `package/shots` klasörü yok).
  - Kullanılan komut: `node scripts/marketing-assets.ts --designs mediterranean-lemon --shots <geçici>/shots05b`. Sonrasında `--check`: ok.
- **Kaynak:** G059 çekim aracı `tools/listing_templates/capture.ts --theme mediterranean-lemon`, bu checkout'un yerel build'i ve
  geçici veri. Misafir ekranları 13/13 sorunsuz alındı. Araç alıcı/panel bölümünde eski panel seçicisinde (`#section-date`)
  düşüyor (G080 notu) ve bu yüzden açılış kaydına hiç gelmiyor. Bu nedenle aynı dosyanın **yalnız alıcı/panel bölümü
  çıkarılmış geçici kopyası** çalıştırıldı; misafir ekranları ve kayıt kodu birebir aynı. Kopya commit edilmedi;
  `tools/` yazma alanım değil.
- Klip kareleri tek tek kontrol edildi: zarf → bağ düşer ve yuvarlanır → çini astar → kart yükselir → home.

**3. Sayfalar.** `/designs` 3 kart gösteriyor (config sırasıyla). `/designs/mediterranean-lemon` statik üretiliyor; 4 gerçek ekran,
klip, "Already bought it?" → `/start?theme=mediterranean-lemon` ve demo `/start/demo/mediterranean-lemon` çalışıyor. JSON-LD:
- Product, `sku` = mediterranean-lemon. Fiyat yer tutucu olduğu için Offer yok.
- VideoObject (PT10S).
- `/designs` ItemList'inde 3 öğe.

`llms.txt` ve `llms-full.txt` 05'i içeriyor. Sitemap `launched: false` iken boş; `launched` true olunca 05 de girecek (testte).
Sonuçları:
- `/about` artık son tasarımın (05) Our Story ekranını gösteriyor (sayfa kodu `designs[designs.length - 1]`).
- Ana sayfadaki tasarım çipleri 390 px'te iki satıra iniyor.
- `/designs` telefonda 2 sütunlu; 3. kart alt satırda tek başına.

**4. Yazma alanı dışı, bilerek ve küçük:** `components/marketing/marketing.module.css` breadcrumb kuralı.
- Sorun: "Home / Designs / Mediterranean Lemon" 390 px'te yedek fontla sığıyor, Montserrat gelince taşıp ikinci satıra iniyor ve
  hero'yu 44 px aşağı itiyordu. Yavaş ağda **CLS 0,1349** (3 yüklemeden 1'inde). marketing-browser'ın CLS ≤ 0,05 kontrolü de düştü.
- Düzeltme: breadcrumb her zaman tek satır; son öğe (geçerli sayfanın adı) sığmazsa "…" ile kesiliyor. Tam ad hemen altındaki h1'de.
- Sonuç: 5 yüklemede en çok 0,0004. Bir rehber sayfasında 5 yüklemede 0.
- Yan etkisi: rehberlerde uzun başlıklar telefonda breadcrumb'da "…" ile kesiliyor (önceden birkaç satıra iniyordu).

**5. Testler** (yerel production build; port 41981–41988)
- `npm test` **538/538** (origin/main birleştirmesinden sonra; birleştirmeden önce 537/537). Yeni: `tests/g082-designs.test.ts`, 6 test:
  - liste, sıra ve ad;
  - metin ↔ tema (demo çift, yüklenen fontlar, palet token'ları, rehberler, açılış kelimeleri);
  - assets (8 ekran, klip ≤ 1,5 MB);
  - JSON-LD;
  - llms ve sitemap;
  - production kapısı: onaylı, `/start` listesinde, POST /api/start 201.

  `g080-approval` başlığı ve döngüsü güncellendi (05 onaylı; 02 ve 04 incelemede).
- `npm run typecheck` temiz. `npm run build` + trace-check geçti. `marketing-assets.ts --check` ok.
- `tests/marketing-browser.ts` **312/312** (G080'de 283; 05 sayfası ve G082 bölümüyle 312; çıktı geçici klasörde, `previews/g061` yeniden yazılmadı). Yeni G082 bölümü:
  - `/designs`'ta her canlı tasarım için kart, sayfa ve demo linki; ItemList;
  - her tasarım sayfasında gerçek ekranlar yükleniyor, klip ve poster 200, start/demo linkleri, Product + VideoObject;
  - llms.txt; sitemap boş;
  - kart demosu her tasarım için açılıyor;
  - performans ölçümüne en yeni tasarım sayfası eklendi.

  Lab (390 px, CPU 4×, yavaş 4G) `/designs/mediterranean-lemon`: LCP 1288 ms, CLS 0,0004, 416 KB (bütçe 600 KB).
- `tests/g080-browser.ts` **97/97** (önce 92; birleştirmeden sonra yeniden koşuldu). Yeni kontroller THEME_APPROVAL=enforce sunucusunda:
  - her onaylı tasarımın `/start?theme=<id>` sayfası 200, form var ve demo kendi temasının;
  - 03 ve 05 için POST /api/start 201.

  Önizlemeler `G080_SHOTS_DIR` ile geçici klasöre yazıldı, `previews/g080` değişmedi.

**Önizleme** `platform/previews/g082/`: `designs_{390,1280}.png` (ilk ekran), `designs_cards_{390,1280}.png` (3 kart),
`design_mediterranean-lemon_{390,1280}.png` (ilk ekran), `…_pages_{390,1280}.png` (4 gerçek ekran + alt yazılar),
`…_opening_{390,1280}.png` (klip posteri + açılış metni), `checks.json` (sayılar, ölçümler, CLS önce/sonra, kaynak notu).

**Açık noktalar**
- Vercel'de denenmedi. Yayından sonra `https://<site>/start?theme=mediterranean-lemon` 200 dönmeli (production kapısı).
- `tools/listing_templates/capture.ts` (G059) alıcı/panel bölümü eski panel seçicilerinde düşüyor ve açılış kaydına gelmiyor.
  **Önerilen görev** (claude-kod): alıcı/panel adımlarını panel v2 seçicilerine göre güncellemek (hata: `locator('#section-date')` 12 s bekleyip düşüyor).
- Koleksiyonda `collections/05_Lemon_Mediterranean/package/shots` yok. G905 ilan kiti çekimi oraya yazınca
  `--designs mediterranean-lemon` bayraksız koşulabilir; çekim değişirse görseller de değişir.
- `docs/14` §14.1 sayfa listesi ve `platform/README.md` bu değişikliği bilmiyor: `/designs/mediterranean-lemon` ve betiğin yeni
  bayrakları anlatılmıyor. İkisi de yazma alanım dışında (entegratör/metin).
- Fiyat ve Etsy linki yer tutucu. "Coming soon on Etsy" görünüyor, Offer yok (diğer tasarımlarla aynı).
- Denenmedi: gerçek telefon, ekran okuyucuyla elle deneme, Google Rich Results Test.

## Günlük
- 2026-10-14 açıldı (entegratör): G405 onaylandı
- 2026-10-14 alindi: claude-G082
- 2026-10-14 claude-G082: 05 live (config + metin), marketing-assets --designs <id> --shots ile yalnız 05'in ekranları/klibi (01/03 bayt bayt aynı), breadcrumb CLS düzeltmesi, testler; npm test 538/538, marketing-browser 312/312, g080-browser 97/97
- 2026-10-14 bitti, incelemeye gönderildi
