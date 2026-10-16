---
id: G099
baslik: Satış sitesi — 20 tasarımlı vitrin (8 öne çıkan + See all), açılış metinleri, tasarım sayfasında tek birincil eylem
rol: claude-kod
durum: bitti
alan: claude-G099
oncelik: 1
bagimli: []
yazar: [platform/lib/marketing/, platform/app/(marketing)/, platform/components/marketing/Demo.tsx, platform/components/marketing/DesignCard.tsx, platform/components/marketing/demo-data.ts, platform/components/marketing/ui.tsx, platform/components/marketing/marketing.module.css, platform/content/guides/, platform/public/marketing/designs/sunflower-rustic-barn/, platform/tests/, platform/previews/g099/, docs/14_SATIS_SITESI.md, gorevler/G099-satis-vitrin.md]
---

## Amaç
G097'nin açık noktaları kapanır. Ana sayfa vitrini 20 kart yerine 8 öne çıkan tasarım + "See all 20 designs" (`/designs`);
her tasarımı kapsamayan "envelope" genellemeleri doğru ifadeye çevrilir (13 kitap gibi açılır, 18 vellum kılıf); 16'nın Our Story
küçük resmi ilk baskıyı gösterir; tasarım sayfasında tek birincil eylem (docs/18 §5 P1); 1024 × 800'de ana sayfanın ana düğmesi
ilk ekrana sığar. Kullanıcı hız istiyor.

## Yapılacaklar
1. `config.ts`'te açık öne çıkan seçimi (`featured`); ana sayfa yalnız öne çıkanları + `/designs` düğmesi gösterir; sayıya bağlı
   kod yok. Seçim: blush-garden-rose, olive-ivory, mediterranean-lemon, art-deco-black-tie, enchanted-forest-storybook,
   cherry-blossom-spring, midnight-garden, coastal-seaside. Hero çipleri ve "+N more" aynı kalır.
2. Ortak metinlerde "envelope" genellemeleri her tasarımı kapsayan ifadeye; tasarım sayfasında o tasarımın kendi açılışı. Ana
   sayfanın SEO kümesi (docs/14 §2.1: envelope, digital, wedding invitation website) korunur.
3. `sunflower-rustic-barn` Our Story çekimi ilk baskıya kaydırılarak yeniden alınır (G097 çekim kopyası);
   `marketing-assets --designs sunflower-rustic-barn --shots`; öteki varlıklar bayt bayt aynı.
4. Tasarım sayfası: büyük önizleme + kısa özet + tek birincil düğme; "View live demo" ikincil; Etsy yer tutucu davranışı korunur.
5. 1024 × 800'de ana düğme ilk ekranda; 1280 ve 390 bozulmaz.
6. `npm test`, typecheck, build, marketing-browser; önizleme `platform/previews/g099/`.

## Sonuç
**2026-10-16 · claude-G099 — durum: inceleme.** Beş madde yapıldı; yayın yapılmadı, her şey bu worktree'nin yerel production
build'iyle denendi (port 3470–3471).

**1. Ana sayfa vitrini** — `config.ts`'te `featured?: boolean` (8 girdide `true`), `designs.ts` `featuredDesigns()` (config sırası;
işaretli yoksa bütün canlılar). Ana sayfa: 03 Blush Garden Rose, 01 Olive & Ivory, 05 Mediterranean Lemon, 06 Art Deco Black-Tie,
13 Enchanted Forest Storybook, 15 Cherry Blossom Spring, 19 Midnight Garden, 20 Coastal Seaside + çerçeveli **"See all 20 designs"**
(→ `/designs`; sayı canlı listeden). Telefonda 2 × 4, 900–1199 px 3 + 3 + 2 (son sıra ortada), ≥ 1200 px 4 + 4 (yeni CSS kuralı yalnız
tam 8 kartlı ızgarada). Ana sayfa ItemList'i vitrindekiler. Hero çipleri ve "+13 more" değişmedi. Başlık "Choose the design your
guests will open".

**2. Açılış metinleri** — 20 tasarımın 6'sı zarf değil (06 ve 14 gatefold, 09 pouch, 12 travel wallet, 13 book, 18 vellum sleeve).
Ortak metinler (ana sayfa giriş/adımlar/göz atma etiketi/fiyat listesi/son çağrı, `/designs`, `/features`, `/how-it-works`, rehber
kutusu, `/about`, `facts.ts` tanım + "included", `faq.ts` beş cevap, llms.txt "Pages" satırı, `/` ve `/designs` meta açıklamaları,
üç rehberde birer cümle) "envelope or keepsake" / "the opening" der. Tasarıma özel yerler `openingObject()` ile tasarımın kendi
nesnesini söyler (açılış cümlesinin "Your guests tap the <x>." kısmından; uymayan açılış hata verir): "What your guests see after the
book opens", "Book opening, Home, …", video etiketi, renk SSS'i, poster alt metni, VideoObject adı ("book opening"). Ana sayfa başlığı,
H1 ve açıklaması "envelope" içerir (§2.1 kümesi; `marketing-content` testi geçer); ana sayfa girişi "Your guests tap a sealed envelope
or keepsake and your wedding website opens: …" (390 ve 360'ta 4 satır — 5 satırlık ilk deneme 390'da ana düğmeyi ekrandan taşırdı,
ölçülüp değiştirildi). `copyUpdated` 2026-10-16.

**3. 16 Our Story** — G097'nin çekim kopyası (`/tmp/claude-0/G097/capture.ts`) + `STORY_FIRST_PRINT=.lr-1`: story ekranı ilk ip + baskı
ortalanarak `shot()` kenar denetimiyle alındı (8 PASS, 0 FAIL; commit edilmedi). G097'nin `shots16` klasörünün kopyasında yalnız
`g05_story.jpg` değiştirildi, `marketing-assets.ts --designs sunflower-rustic-barn --shots …` + `--check` ok. **Değişen yalnız
`story-{320,480,640}.webp`**: `public/marketing/` 545 dosyanın sha1 listesi önce/sonra, 542'si aynı (klip, poster, öteki 7 ekran dahil);
`assets.json` bayt bayt aynı (640 × 1385). Küçük resimde artık "Tailgate lemonade" baskısı ve fotoğraf görünüyor.

**4. Tasarım sayfası** (docs/18 §5 P1) — hero: H1 + kısa özet (stil satırı; uzun giriş "after the … opens" bölümünün başına indi),
telefonda daha büyük poster (52vw / en çok 240 px; ≥ 600 px 250), **tek birincil eylem Etsy** (`HeroDemo` yeni `action` +
`demoVariant`), "View live demo" ikincil (çerçeveli). Etsy yer tutucuyken davranış aynı: "Coming soon on Etsy", bağlantı değil
(`data-etsy-pending`); gerçek link gelince aynı yerde koyu "Buy on Etsy — $x" olur. Telefon alt çubuğu aynı sıra (Etsy, sonra
çerçeveli "Live demo"). "Already bought it? Start your website" ve "Included" altındaki Etsy düğmesi yerinde.

**5. 1024 × 800** — hero H1'i 1024–1279 px'te `calc(8.6vw − 36px)` (1024'te 52 px, 1279'da 74; ≥ 1280 değişmedi). Ana düğmenin alt
kenarı **898 → 767 px** (1100'de 777); 1280'de 774 (aynı); 390'da 841 (G097 ile aynı). Ölçerken görüldü: 1024'te başlık çubuğu
bozuktu (G095'ten beri "How it works" üç satıra kırılıyor, "See designs" sağdan taşıyordu). `Shell.tsx`'e dokunmadan CSS ile:
1024–1279'da bağlantılar tek satır, daha az iç boşluk, header "See designs" düğmesi gizli ("Designs" ilk bağlantı); "My website" yerinde.

**Testler**
- `npm test` **1212/1212** (0 atlanan, build varken; build'siz ilk koşu 1210 + 2 atlanan). Yeni `tests/g099-showcase.test.ts` (4 test):
  vitrin = işaretli canlılar config sırasıyla, `coming` gösterilmez, işaretsiz = hepsi, sayfada sabit sayı yok; `openingObject` her canlı
  tasarımda (6 zarf-dışı adıyla), VideoObject adı; eski genellemelerin hiçbiri ortak dosyalarda/rehberlerde yok, ana sayfada "envelope"
  kalır; 16'nın story ekranı 640 × 1385.
- `npm run typecheck` temiz; `npm run build` + trace-check geçti (16 rota, 21 tema); `marketing-assets.ts --check` ok.
- `tests/marketing-browser.ts` **843/843** (G097'de 783). Ana sayfa artık 8 kart: G083/G094/G097 ana sayfa beklentileri vitrinden
  (`cardsOn`, 8 kartta ≥ 1200 px 4'lü), kart → demo diyalog döngüsü `/designs`'ta (20 tasarım). Yeni G099 bölümü (390, 1024, 1100,
  1280): vitrin + "See all 20 designs", ana düğme ilk ekranda (1024/1100/1280), başlık tek satır ve ekran içinde, sayfa yana kaymıyor;
  20 tasarım sayfasında (390) + 13/16/18 (1024, 1280): ilk eylem Etsy (`Coming soon on Etsy`, href yok), ikinci "View live demo"
  çerçeveli, dolu birincil düğme yok, özet = stil satırı, "after the <x> opens"; telefon çubuğu sırası; 16'nın story küçük resmi yükleniyor.

**Önizleme** `platform/previews/g099/` (bakıldı): `home_first_screen_{390,1024,1100,1280}.png`, `home_showcase_{390,1280}.jpg`,
`home_{390,1280}.jpg`, `designs_{390,1280}.jpg`, `design_{enchanted-forest-storybook,sunflower-rustic-barn,wildflower-meadow-vellum}_{390,1024,1280}.png`,
`design_sunflower-rustic-barn_pages_{390,1024,1280}.png`, `design_sticky_390.png`, `checks.json`.

**Açık noktalar**
- Tasarım sayfası başlıkları hâlâ `<ad>: Envelope Wedding Website` (06, 09, 12, 13, 14 dahil; 18 uzunluktan düşüyor): kategori adı ve
  G083/G093/G097 testleriyle sabit; zarf olmayanlarda "Envelope" düşürülsün mü kararı entegratörün (`designTitle` + `openingObject` ile
  tek satırlık iş).
- `/designs` başlığı "Wedding Website Designs with Envelope Opening" (§2.1 B kümesi) dokunulmadı.
- Tasarım sayfasında yer tutucu dönemde tek dolu (koyu) düğme header'daki "See designs" (≥ 1280); Etsy linki gelince hero'da koyu
  "Buy on Etsy" olur. Etsy/fiyat hâlâ yer tutucu.
- Rehber sayfalarının "Open a live demo: …" kutusu 20 tasarımın hepsini sıralıyor (uzun); bu görevde dokunulmadı.
- Vercel'de, gerçek telefonda, ekran okuyucuyla denenmedi.

## Günlük
- 2026-10-16 açıldı (claude-kod, entegratör isteği)
- 2026-10-16 alindi: claude-G099
- 2026-10-16 claude-G099: vitrin 8 öne çıkan + See all 20 (config `featured`), açılış metinleri (`openingObject`), tasarım sayfasında tek birincil eylem, 1024 × 800 ana düğme 767 px + başlık çubuğu, 16 story yeniden çekildi (yalnız 3 dosya); npm test 1212/1212, marketing-browser 843/843
- 2026-10-16 bitti, incelemeye gönderildi
- 2026-10-16 entegratör onayladı
