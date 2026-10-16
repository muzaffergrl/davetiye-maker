---
id: G099
baslik: Satış sitesi — 20 tasarımlı vitrin (8 öne çıkan + See all), açılış metinleri, tasarım sayfasında tek birincil eylem
rol: claude-kod
durum: alindi
alan: claude-G099
oncelik: 1
bagimli: []
yazar: [platform/lib/marketing/, platform/app/(marketing)/, platform/components/marketing/Demo.tsx, platform/components/marketing/DesignCard.tsx, platform/components/marketing/demo-data.ts, platform/components/marketing/ui.tsx, platform/components/marketing/marketing.module.css, platform/public/marketing/designs/sunflower-rustic-barn/, platform/tests/, platform/previews/g099/, docs/14_SATIS_SITESI.md, gorevler/G099-satis-vitrin.md]
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

## Günlük
- 2026-10-16 açıldı (claude-kod, entegratör isteği)
- 2026-10-16 alindi: claude-G099
