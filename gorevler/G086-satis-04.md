---
id: G086
baslik: Tasarım 04 Vintage Airmail Love Letter satış sitesine eklenir (G082/G083 yöntemi) — 5 tasarımla düzen
rol: claude-kod
durum: bitti
alan: claude-G086
oncelik: 2
bagimli: [G404, G083]
yazar: [platform/lib/marketing/, platform/public/marketing/designs/, platform/scripts/marketing-assets.ts, platform/tests/, platform/previews/g085/, docs/14_SATIS_SITESI.md, platform/components/marketing/]
---

## Amaç
G404 (04 Vintage Airmail Love Letter, tema `vintage-airmail-love-letter`) onaylandı. G082/G083 nasıl eklediyse 04 de aynı yolla satış sitesine girer; /start kapısı açılır.

## Yapılacaklar
1. `config.ts` + `designs.ts`'e 04: ad, kısa ve uzun açılış metni (tema README'si, gerçek ekranlar ve açılış klibi karelerinden; uydurma yok), `status: 'live'`.
2. `marketing-assets.ts --designs vintage-airmail-love-letter --shots <dir>` ile yalnız 04'ün ekranları + klibi; 01/02/03/05 bayt bayt aynı.
3. 5 tasarımla /designs: telefonda tek kalan kart ortada (G083 kuralı) — 320/360/390/430/768/1280'de doğrula; ana sayfa çip şeridi 5 çiple; 360'ta devamının belli olması (G083 açık noktası).
4. Testler: marketing unit + marketing-browser + g080/g082/g083 kapı testleri (04 artık açık); npm test, typecheck, build.
5. Önizleme `platform/previews/g085/` (390 + 1280). docs/14 §14.1'e 04 satırı. Sonuç, Günlük, bitir.

## Sonuç
**2026-10-15 · claude-G085 — durum: inceleme.** 04 Vintage Airmail Love Letter satış sitesinde `live`. Bu, G080 kapısında
onay demek: production'da `/start?theme=vintage-airmail-love-letter` açılıyor. Böylece satış sitesindeki 5 tasarımın hepsi
onaylı; incelemede gerçek tema kalmadı. Yayın yapılmadı; her şey yerel production build ile denendi.

**1. Liste ve metin** (`platform/lib/marketing/`)
- `config.ts`: `vintage-airmail-love-letter` · "Vintage Airmail Love Letter" · `live` · `updated: 2026-10-15`. Fiyat ve
  Etsy linki öteki tasarımlar gibi yer tutucu. Sıra 03, 01, 05, 02, 04 (ana sayfa ve "how it works" yine 03'ü gösterir).
- `designs.ts`:
  - içerik: stil satırı, meta (154 karakter), giriş, açılış (2 cümle), 4 sayfa alt yazısı, palet, font, llms satırı;
  - 2 rehber: `digital-wedding-invitation-etiquette`, `canva-wedding-website-template-vs-hosted-website`. İkincisi
    şimdiye kadar hiçbir tasarım sayfasından link almıyordu;
  - kaynaklar: tema README'si (G404), katalog açılış cümlesi (docs/09 WEB 04), gerçek ekranlar ve klip kareleri.
- Açılış metni: dokununca mühür fırlar, delikli şerit üst kenarda soldan sağa yırtılır, portreli krem kart zarftan kayar,
  yanında bir unutmabeni süzülür, kart home'un ilk ekranı olur. Klip kareleri tek tek kontrol edildi.
- Sayfa alt yazıları:
  - home: hava postası çizgili portre kartı, isim/tarih/mekân, geri sayım, RSVP; sonra mektup ve öteki sayfalara giden
    pul, mektup ve mühür ("Inside this letter");
  - story: üç pul çerçevesi yazı masasına tek tek düşer, ilkine posta damgası vurulur, başlıklar el yazısı;
  - details: Order of the Day mektubu, takvim, pul kenarlı mekân fotoğrafı, dress code, linkler, SSS;
  - rsvp: "Will You Join Us?" mektubu, son tarih, imza, lavantalı mühür ve form.
- Palet `site.css` token'ları: Airmail Red #B5483E, Navy #2B3753, Parchment #E2CBAD, Cream #F6ECDA, Ink #4A1F1C. Fontlar
  temanın yüklediği Homemade Apple ve Special Elite. Demo çift Margot & Henry (kurgu).
- Uydurma özellik yok. Test 01/02/03/05'e ait kelimeleri arıyor (lace, bow, ribbon, lemon, tile, eucalyptus,
  instant-photo, damask, gold…).
- `site.ts` `designTitle()`: kural değişmedi. "Vintage Airmail Love Letter: Envelope Wedding Website | BKE Studio" 66,
  iki noktasız hâli 65 karakter. Bu yüzden "Envelope" düşer: `Vintage Airmail Love Letter: Wedding Website | BKE Studio`
  (57; 12 karakterlik markayla 59). Yorum güncellendi.

**2. Gerçek ekranlar ve açılış klibi** (`public/marketing/designs/vintage-airmail-love-letter/`, 26 dosya, 1,5 MB)
- 8 ekran × 320/480/640 WebP, 10 sn H.264 klip (390×844, **429 KB**) ve poster. Poster, el yazısı fontu yüklenmiş ilk
  kare. `assets.json`'a yalnız 04 eklendi.
- **01/02/03/05 ve panel değişmedi.** `public/marketing/` altındaki öteki 129 dosyanın sha1'i önce ve sonra aynı.
  `assets.json`'daki dört eski tasarım ve panel girdisi de birebir aynı.
- Komut: `node scripts/marketing-assets.ts --designs vintage-airmail-love-letter --shots <geçici>/shots04`, ardından
  `--check`: ok. Betikte değişiklik gerekmedi.
- **Kaynak:** `collections/04_Vintage_Airmail/package/shots` yok. G082/G083'teki gibi G059 aracının geçici bir kopyası
  çalıştırıldı (bu checkout'un build'i, geçici veri, port 42090):
  - kopyada eski panel seçicileri yüzünden düşen alıcı/panel bölümleri çıkarıldı;
  - platform yolu bir değişkene bağlandı;
  - misafir ekranları ve kayıt kodu aynı;
  - kopya commit edilmedi.
- Sonuç: 13 ekran ve kayıt alındı, 8/8 kontrol geçti. `schedule` (640 × 1265) ve `form` (640 × 1229) saydam menünün
  üstünden kesildi. Bu iki ekran sitede 04 için kullanılmıyor.

**3. Düzen** (`components/marketing/marketing.module.css`, yalnız CSS)
- **Kart ızgarası:**
  - Telefonda 2 + 2 + 1: G083 kuralıyla son kart ortada ve aynı genişlikte.
  - ≥ 900 px ve 5 ya da daha çok tasarımda üçlü sıralar kuruluyor (6 iz, her kart 2 iz). Yarım kalan son sıra ortada:
    5 = 3 + 2, ileride 7 = 3 + 3 + 1. Bu kural olmadan auto-fit 1280'de sola yaslı 3 + 2, 900'de 2 + 2 + 1 verirdi
    (hesap; ölçülmedi).
  - Dolmayan sütunlar ortalanıyor (`justify-content: center`). Örnek: tasarım sayfalarındaki "Other designs" (4 kart)
    900–1199 px'te 2 × 384 px sola yaslıydı.
  - Ölçüm (`/designs` ve ana sayfa şeridi): 320/360/390/430/768'de 2+2+1, 900/1024/1280/1440'ta 3+2, son sıra ±2 px ortada.
- **Çip şeridi (telefon/tablet, G083 açık noktası):**
  - Şeridin sağ kenarı 48 px'te soluyor (`mask-image`). Her genişlikte bir çip solan kenara giriyor ve yarıda soluyor,
    yani şeridin devam ettiği görülüyor. 360'ta 2. çipin son 26 px'i ve 3. çipin 12 px'i solan bölgede.
  - Sağ iç boşluk ve `scroll-padding` 48 px: sona kaydırılınca son çip solan kenarın dışında kalıyor. Sol tarafta yalnız
    kenar boşluğu soluyor; ilk çip soluk değil.
  - Önizleme: `home_chips_{320,360,390}.png`, `home_chips_end_390.png`.
- **Masaüstü çipleri (≥ 1024 px, metnin yanında):** çipler sıkılaştı (14 px yazı, 12 px iç boşluk, 8 px ara).
  - 1280'de 5 çip 2 satır (3 + 2). Sıkılaştırmadan önce 3 satırdı.
  - 1280 × 800'de ana düğmenin alt kenarı 769 px'te; sıkılaştırmadan önce 797 px'teydi.
  - 1024'te hâlâ 4 satır (açık nokta).
- `/about` son canlı tasarımın Our Story ekranını gösteriyor (artık 04, yazı masası). Ekran yükleniyor, sayfa kodu
  değişmedi.

**4. Docs** `docs/14` §14.1:
- 04 satırı;
- "Tasarım metinleri" sırası;
- kart/çip düzeni satırı (G085 kuralları);
- sayfa listesine `/designs/vintage-airmail-love-letter`.

**5. Testler** (yerel production build; port 42090–42096)
- `npm test` **579/579** (önce 572). Yeni dosya `tests/g085-designs.test.ts`, 7 test:
  - liste/sıra, `coming` tasarım kalmadı;
  - ≤ 60 karakter başlık;
  - metin ↔ tema: demo çift, fontlar, palet token'ları, katalog/README açılış cümlesi, öteki tasarımların kelimeleri yok;
  - assets, `public/marketing/designs/` = canlı tasarımlar;
  - JSON-LD: ItemList 5;
  - llms ve sitemap;
  - production kapısı: 04 onaylı, POST 201.
- **Kapı testleri artık kurgu bir "incelemede" temayla:** 04 canlıya geçince incelemede gerçek tema kalmadı. Eski testler
  `inReview.length > 0` şartıyla düşecekti. Yeni `tests/review-fixture.ts` geçici bir tema klasörü kuruyor:
  - içinde gerçek temaların symlink'leri var;
  - bir de `in-review-fixture` var: `_sample` iskeleti, `internal` kaldırılmış, 01'in demo kaydıyla;
  - `PLATFORM_THEMES_DIR` bu klasörü gösteriyor.
- Güncellenen testler:
  - `g080-approval`: 403 / theme_in_review, kayıt yok, demo açık, production listesinde yok, yerelde var — hepsi fixture ile;
  - `g080-browser`: iki sunucu da fixture klasörüyle. 5 onaylı tasarımın her biri `/start` 200 ve POST 201. API
    çağrılarına adres başına ayrı `x-forwarded-for` verildi: adres başına günde 5 site sınırı 6. siteyi 429 yapıyordu;
  - `g082` / `g083`: 04 artık incelemede değil, sıra ve sayılar beşli listeye göre;
  - `marketing-crawl`: "yayınlanmamış tasarım geçmez" kontrolü kurgu bir `coming` tasarımla.
- `npm run typecheck` temiz. `npm run build` + trace-check geçti (16 rota, 6 tema). `marketing-assets.ts --check` ok.
- `tests/marketing-browser.ts` **407/407** (G083'te 358). Artış 04 sayfası ve yeni G085 bölümünden. G085 bölümü
  (8 genişlik):
  - kart satırları tam olarak 2+2+1 / 3+2, son sıra ortada, kartlar aynı genişlikte;
  - telefonda şeridin solan kenarı ve sondaki son çip;
  - 1280'de çipler ≤ 2 satır ve ana düğme ilk ekranda.

  G083 kontrolü artık birden çok kartlı son sırayı da "ortada" sayıyor (önce yalnız tek kart). Çıktı geçici klasöre
  yazıldı, `previews/g061` değişmedi. Lab ölçümü (390 px, CPU 4×, yavaş 4G), `/designs/vintage-airmail-love-letter`:
  LCP 1068 ms, CLS 0,0004, 420 KB (bütçe 600).
- `tests/g080-browser.ts` **101/101** (önce 99). Önizlemeleri geçici klasöre yazıldı, `previews/g080` değişmedi.

**Önizleme** `platform/previews/g085/`:
- `designs_cards_{390,1280}`: 2+2+1 / 3+2;
- `design_vintage-airmail-love-letter_{390,1280}`: ilk ekran;
- `…_pages_{390,1280}`: 4 gerçek ekran + alt yazılar;
- `home_first_screen_{390,1280}`;
- `home_designs_{390,1280}`: ana sayfa kart şeridi;
- `home_chips_{320,360,390}`, `home_chips_end_390`: solan kenar, sonda 04 seçili;
- `checks.json`: komut sonuçları, çekim kontrolleri, sha1 notu, düzen ölçümleri, G085 tarayıcı kontrolleri.

**Açık noktalar**
- **Görev numarası çakışması:** `gorevler/G085-platform-kapanis.md` (codex, bitti) da `id: G085`. `tools/gorev.py al/bitir`
  "birden çok dosyada" diye reddetti. Bu yüzden alma ve bitirme bu dosyada elle yapıldı (README'deki kabuksuz yol);
  öteki dosyaya dokunulmadı. `gorev.py kontrol` bunu da sayıyor. Numara düzeltmesi entegratörün.
- Vercel'de denenmedi. Yayından sonra `https://<site>/start?theme=vintage-airmail-love-letter` 200 dönmeli.
- 1024 px masaüstünde 5 çip 4 satır. 1024 × 800'de ana düğmenin alt kenarı 883 px'te, yani ilk ekranın altında.
  4 çiple (G083) 3 satırdı; düğmenin o zamanki yeri ölçülmedi. Önerilen çözüm: çiplerin 1024–1279'da posterin
  altında değil metin sütununda durması ya da sütun oranının değişmesi (Demo.tsx yerleşimi).
- Başlıkta "Envelope" kelimesi yok (uzun ad). `designTitle()` kuralı G083'ten; istenirse ayrı bir kısa başlık alanı eklenebilir.
- `/about` her yeni tasarımda en son ekleneni gösteriyor (bugün 04'ün koyu yazı masası). Sabit seçim istenirse sayfa kodu değişmeli.
- `tools/listing_templates/capture.ts` alıcı/panel bölümü hâlâ eski panel seçicilerinde düşüyor (G082'nin önerdiği görev açık).
  Koleksiyonda `package/shots` yok; G904/ilan kiti çekimi oraya yazınca `--designs vintage-airmail-love-letter` bayraksız
  koşulabilir.
- `platform/README.md` betiğin bayraklarını hâlâ bilmiyor (yazma alanım dışında).
- Tema klasöründe eş zamanlı çalışan görevin (G081/G084: teşekkür/metin/parti) birleştirmesi bu çalışma sırasında gelmedi.
  Ekranlar ve klip G404 onaylı hâlinden.
- Fiyat ve Etsy linki yer tutucu ("Coming soon on Etsy", Offer yok).
- Denenmedi: gerçek telefonda dokunarak kaydırma, ekran okuyucuyla elle deneme, Google Rich Results Test.

## Günlük
- 2026-10-15 açıldı (entegratör): G404 onaylandı
- 2026-10-15 alindi: claude-G085 (elle: `gorev.py al` aynı id iki dosyada diye reddetti — G085-platform-kapanis.md da G085; entegratöre not)
- 2026-10-15 claude-G085: 04 live (config + metin + ≤ 60 karakter başlık), marketing-assets --designs vintage-airmail-love-letter --shots ile yalnız 04'ün ekranları/klibi (01/02/03/05 + panel bayt bayt aynı), ≥ 900 px üçlü sıra + ortalı son sıra, çip şeridinde solan kenar, masaüstünde sıkı çipler, kapı testleri kurgu "incelemede" temayla, docs/14 §14.1; npm test 579/579, marketing-browser 407/407, g080-browser 101/101
- 2026-10-15 bitti, incelemeye gönderildi (elle: `gorev.py bitir` aynı id iki dosyada diye reddetti)
- 2026-10-15 entegratör: görev numarası G085 → **G086** (G085 codex'in `G085-platform-kapanis.md` görevine ait; çakışmayı entegratör yaptı). Kod ve önizlemedeki `g085` adları (`tests/g085-designs.test.ts`, `platform/previews/g085/`, CSS yorumları, marketing-browser 'G085' bölümü) bu göreve aittir; yeniden adlandırılmadı. İncelendi ve onaylandı.
- 2026-10-15 entegratör onayladı
