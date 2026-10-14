---
id: G066
baslik: Satış sitesi + panel BKE Studio marka tasarımına geçer (GM04/GM05 comp'ları, ad, logo, favicon, renk/yazı)
rol: claude-kod
durum: alindi
alan: claude-G066
oncelik: 1
bagimli: [GM02, GM04, GM05, G060, G061]
yazar: [platform/lib/marketing/, platform/components/marketing/, platform/components/panel/, platform/app/(marketing)/, platform/app/layout.tsx, platform/app/edit/, platform/public/brand/, platform/tests/, platform/previews/g066/, docs/16_PANEL_V2.md]
---

## Amaç
K26/K27: ad **BKE Studio**, kimlik GM01 yön C. GM02 kiti hazır (`brand/`, `platform/public/brand/`). Satış sitesi (G061) ve
platform hâlâ `[BRAND]` yer tutucusu ve geçici favicon kullanıyor.

## Kapsam genişledi (2026-10-14)
Kullanıcı: "BKE Studio'yu da ekleyelim; logo, isim, marka tasarımına uygun bir website ve panel tasarımı yapalım." GPT comp'ları:
satış sitesi `brand/ui/site/` (GM04), panel `brand/ui/panel/` (GM05). Bu görev ikisini de comp'lara göre yeniden giydirir:
renk/yazı token'ları (`brand/tokens.json`; Archivo / Montserrat / DM Sans, Google Fonts — repoya font yok), başlık hiyerarşisi,
kartlar, düğmeler, çipler, alt menü, masaüstü düzeni. **İşlev kaybı yok:** bütün mevcut testler (panel, g060, claim, rsvp, final-smoke,
satış sitesi) geçer; erişilebilirlik (kontrast ≥ 4.5:1, dokunma ≥ 44 px) korunur. Comp'taki metin değil, ürünün gerçek metni/linki
kullanılır (alan adı yok — `bkestudio.com` yalnız comp'ta; link `config`'ten). Önizleme: 390 + 1280 px önce/sonra.

## Yapılacaklar (GM02 Sonuç'undaki bağlama listesi + giydirme)
1. `platform/lib/marketing/config.ts`: `brand.name = 'BKE Studio'`, logo yolu. Alan adı, fiyat, destek e-postası **yer tutucu kalır**.
2. `components/marketing/Shell.tsx`: başlıkta `bke-logo-horizontal-anchor.svg`, altbilgide `-reverse` (SVG'leri `public/brand/`'a kopyala).
3. `app/(marketing)/layout.tsx` ve kök `app/layout.tsx`: `/brand/icon.svg`, `/brand/favicon.ico`, `/brand/apple-touch-icon.png`; istenirse manifest (192/512).
4. Satış sitesi renk/yazı token'ları `brand/tokens.json` ile uyumlu mu bak; uyumsuzsa yalnız token düzeyinde hizala.
5. "Made with BKE Studio" rozeti misafir sayfalarına **bu görevde eklenmez** (hedef link kararı yok; docs/15 P1).
6. Testler, build, satış sitesi 390/1280 önizlemesi (`platform/previews/g066/`).

## Sıra (2026-10-14, entegratör)
İki aşama: **A — satış sitesi** (hemen; panel koduna dokunmaz) → **B — panel** (G069 RSVP v2 ve G076 site şifresi main'e
girdikten sonra; aynı bileşenlere dokundukları için). Aynı görev, iki ayrı ajan turu; Sonuç'a iki bölüm.

## Bitti sayılması için
- [x] Satış sitesinde ad, logo ve favicon BKE Studio; testler ve build geçti; önizleme görüntüleri (Kısım A)

## Sonuç

### Kısım A (satış sitesi) — 2026-10-14, claude-G066

**Durum:** satış sitesi BKE Studio comp'larına (`brand/ui/site/u1_*`) göre yeniden giydirildi, yerelde test edildi.
**Yayınlanmadı.** `launched: false` ve bütün yayın kapıları aynen duruyor. Panel (Kısım B) bekliyor; `components/panel/` ve
`app/edit/` açılmadı.

**Ne değişti**
- Ad ve logo: `lib/marketing/config.ts` → `brand.name = 'BKE Studio'`, `brand.logo = '/brand/icon-512.png'` (JSON-LD
  Organization). Alan adı, fiyat, destek e-postası, yanıt süresi, Etsy linkleri ve dükkân adı **yer tutucu kaldı**.
- `public/brand/`: başlık için `bke-logo-horizontal-anchor.svg`, koyu altbilgi için `-reverse.svg` (`brand/svg/`'den
  aynen), GPT'nin `pattern_tile.png`'si (değiştirilmeden), `site.webmanifest` (192/512). Logolar `<img>` ile SVG'den gelir,
  fontla yeniden yazılmaz. Marka dosya yolları ve renkler tek yerde: `lib/marketing/brand.ts`.
- Favicon: kök `app/layout.tsx` artık `favicon.ico` + `icon.svg` + `apple-touch-icon.png` + manifest veriyor (satış sitesi,
  `/start`, panel dahil); varsayılan başlık "BKE Studio". Pazarlama layout'undaki geçici lucide ikonu kaldırıldı.
  `public/marketing/favicon.svg` artık kullanılmıyor (yazar dışı, silinmedi).
- Giydirme (`components/marketing/marketing.module.css` baştan, `Shell`, `Demo`/HeroDemo, `DesignCard`, `ui`, sayfalar):
  `tokens.json` renkleri (patlıcan başlık/düğme, kâğıt zemin, ink metin; altın ve lavanta yalnız çizgi, çip çerçevesi,
  işaret), Archivo 800 başlık, Montserrat 300 etiket/giriş, DM Sans gövde (`next/font`, repoya font yok). Başlık (logo +
  menü / nav + See designs), hero (telefonda metin → poster → çipler → tam genişlik düğme → gerçek bilgi şeridi), altın kıl
  çizgi ayraçlar, "How the opening works" (gerçek zarf → gerçek açılış videosu → gerçek ana sayfa), 4 sayfa 2×2 kart,
  "Made to edit", RSVP sayı kutuları, numaralı adımlar, altın çerçeveli tasarım kartları ("Live demo"), tasarım sayfası
  (breadcrumb, poster, 4 küçük sayfa ekranı, What you can edit, telefonda yapışkan eylem çubuğu), koyu final CTA ve
  altbilgi. Ürün görselleri yine yalnız gerçek tema/panel ekranları ve gerçek açılış kaydı.
- Test sırasında bulunan hata: ad gerçek olunca rehberlerin Article JSON-LD'sinde yazar Organization'ın `@id`'si yoktu →
  `lib/marketing/schema.ts` düzeltildi.

**Comp'tan bilerek ayrılanlar**
- Masaüstü hero'daki açılı renk düzlemleri çizilmedi (K21). Yerine posterin arkasında GPT'nin `pattern_tile.png`'si,
  yuvarlak köşeli düz bir blokta zemin görseli olarak (yalnız ≥ 1024 px).
- Comp metni kullanılmadı. Comp'taki 24/6/30 yerine panel demo ekranındaki gerçek demo toplamları (4 / 1 / 5),
  "Example totals from the demo panel (fictional guests)" etiketiyle (`facts.ts` `DEMO_REPLY_TOTALS`; G069 panel ekranını
  değiştirirse güncellenmeli). 4 sayfa kartı için kısa açıklamalar `facts.ts`'e eklendi (`SITE_PAGES.short`).
- Tasarımlar sayfasında stil filtresi yok (2 canlı tasarım; filtre 6'dan sonra, docs/14 §6.2). Comp'taki 6 tasarım değil,
  canlı olan 2 tasarım listelenir.
- Telefonda "How it works" adımları dikey (açıklamalar 4 sütuna sığmıyor); ≥ 700 px'te comp gibi yatay ve altın çizgili.
  "Made to edit" telefonda önce liste, sonra panel ekranı (gerçek maddeler uzun); ≥ 600 px yan yana.
- Kartta stil satırı yalnız geniş kartta (≥ 300 px); renk noktaları karttan kalktı (tasarım sayfasında duruyor).
  Menüde Guides kaldı (comp'ta yok; iç link kuralı).

**Testler (yerel production build)**
- `npm test` 458/458 (build testleri dahil, atlanan yok); origin/main birleştirmesinden (G076 vb.) sonra 481/481;
  `npm run typecheck`; `npm run build` + trace-check temiz.
- `tests/marketing-browser.ts` 283/283. Eski 170 kontrolün hepsi + yeni: her sayfa 320 px'te yatay kaydırma/kesilme yok;
  390 px'te her sayfada axe-core 4.13.0 serious/critical ihlal 0 (kontrast dahil) ve dokunma hedefi ≥ 44 px (metin içi
  linkler hariç); logo, favicon ve manifest kontrolleri. Sonuç: `platform/previews/g066/after/checks.json`.
- Performans (aynı oturum, önce = main 72183a4; `platform/previews/g066/perf_before_after.json`):
  - docs/14 §9.8 lab (CDP, CPU 4×, yavaş 4G): LCP ana sayfa 1800 → 1516 ms, tasarım sayfası 1760 → 1528, rehber
    1088 → 1216; CLS 0; aktarılan 300 → 357 / 300 → 389 / 198 → 234 KB (bütçe 600). Font 37 → 67 KB.
  - Lighthouse 13.5.0 (mobil, 2 koşu; geçici kurulum, repoya girmedi): performans ana sayfa 97–98 → 90, tasarım 91–96 →
    88–97, rehber 98 → 87–88, SSS 97–98 → 93; erişilebilirlik hepsinde 100. Düşüşün ana kaynağı Lighthouse'un ölçtüğü
    ~1,2 s ilk boyama (önce ~0,15 s). Aynı Chromium ile Playwright'ta ilk boyama 0,14–0,43 s; yeniden üretilemedi. Font
    ön yüklemesini kapatmak ve `display: optional` denendi, değişmedi. **Açık iş.**
  - §9.8'deki "2 aile, ≤ 4 dosya" font bütçesi aşıldı: 3 aile (marka kararı), Latin için 3 dosya.

**Önizleme:** `platform/previews/g066/before/` ve `after/`: home, designs, blush-garden-rose, how-it-works, pricing, faq ×
390 / 1280 (tam sayfa). `after/`'da ayrıca ilk ekran PNG'leri ve yapışkan çubuk.

**Yapılmayanlar / açık**
- Yayın yok. Bu commit main'e gidiyor; main otomatik yayınlanıyorsa vercel.app adresinde "BKE Studio" adı görünür
  (sayfalar `noindex`). Adın kesin onayı (K26) hâlâ açık.
- `docs/14_SATIS_SITESI.md` yazar dışı, güncellenmedi: §9.6 font notu (Cormorant/Inter yerine Archivo/Montserrat/DM Sans)
  ve §14 durum tablosu entegratörde.
- Panel tarayıcı testleri (g060-browser vb.) koşulmadı; kök layout'a yalnız ikon, manifest ve başlık eklendi.
- Gerçek telefonda deneme yok.

## Günlük
- 2026-10-14 açıldı (entegratör): GM02 onayı sonrası; G061 düzeltme turu bitince başlar
- 2026-10-14 alindi: claude-G066
- 2026-10-14 Kısım A (satış sitesi) bitti (claude-G066): BKE Studio giydirmesi, testler 458/458 + tarayıcı 283/283; durum alindi (Kısım B panel bekliyor)
- 2026-10-14 entegratör: kısım A incelendi ve kabul edildi (önizlemeler, 495/495, marketing-browser 283/283); docs/14 §14.3b yazıldı. Lighthouse düşüşü açık iş. Kısım B (panel) başladı.
