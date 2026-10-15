---
id: G095
baslik: Dükkân paneli v2 — Özet, Siparişler, Müşteriler, Tasarımlar, Yeni sipariş, site sayfasında yanıtlar/not/yayınla; satış sitesinde "My website"
rol: claude-kod
durum: bitti
alan: claude-entegrator
oncelik: 1
bagimli: [G087, G092]
yazar: [platform/lib/admin/, platform/components/admin/, platform/app/admin/, platform/app/api/admin/, platform/app/my/, platform/components/my/, platform/lib/panel/remember.ts, platform/components/panel/Panel.tsx, platform/components/marketing/Shell.tsx, platform/components/marketing/marketing.module.css, platform/lib/data/types.ts, platform/lib/slug.ts, platform/tests/, docs/17_ADMIN_PANELI.md, docs/19_ALICI_YOLCULUGU.md]
---

## Amaç
Kullanıcı (2026-10-15): "Admin paneli çok yetersiz. Çok daha detaylı ama kullanışı basit olmalı; satışlar, müşteriler görünmeli;
duruma göre ekle/kaldır, detaylar. Siteye 'panele git' butonu." (K30'un devamı.)

## Yapılanlar
- **Menü:** Özet · Siparişler · Müşteriler · Tasarımlar · + Yeni sipariş; üst çubukta satış sitesine link.
- **Özet (`/admin`):** onay bekleyen, toplam satış, son 7/30 gün, müşteri, yayında/taslak/arşiv, toplam RSVP; Yapılacaklar
  (onay bekleyen sipariş, 5 günden uzun süredir yayınlanmamış satış, 30 gün içinde kapanacak site, 2 günden eski yayınlanmamış
  değişiklik); haftalık satış (8 hafta); en çok satan tasarımlar; yaklaşan düğünler (60 gün); son siparişler.
  Satış = Etsy sipariş numarasıyla açılan site (demo/test sayılmaz). Fiyat girilmediği için ciro gösterilmez.
- **Siparişler (`/admin/orders`):** filtre + arama (mekân ve not dahil) + sıralama (yeni/eski/düğün tarihi/RSVP/isim) + **CSV**.
- **Müşteriler (`/admin/customers`):** e-postaya göre gruplu alıcılar, siparişleri, yayında sayısı, yanıtlar; arama.
- **Tasarımlar (`/admin/designs`):** her tasarımın satış sitesinde olup olmadığı, satış/yayında/yanıt, son satış, fiyat,
  tasarım sayfası, demo, başlatma linki kopyala, Etsy ilanı.
- **Yeni sipariş (`/admin/new`):** dükkân alıcı adına site açar (/start ile aynı kurallar: satışa açık tasarım, sipariş başına
  bir site, boş adres); sipariş onaylı yazılır; düzenleme linki **bir kez** gösterilir + hazır Etsy mesajı (yeni şablon
  `shop_created_site`, docs/19 kopyasıyla aynı).
- **Site sayfası:** hızlı düğmeler (Siteyi aç, **Taslağı gör** — 12 saatlik önizleme, Etsy siparişleri, Mesaj, Yanıtlar);
  **Dükkân notu** (alıcı görmez); **Sitede ne var** (tarih, mekân, program, RSVP son günü, foto sayısı…); **Misafir
  yanıtları** (sayılar, liste, seçip silme, CSV); e-posta düzeltme; **alıcı adına yayınla** (panelin kurallarıyla);
  oluşturan (alıcı/dükkân).
- **Satış sitesi:** başlıkta her genişlikte **My website** düğmesi + mobil menü + altbilgi (Help'te "My website",
  Company'de "Shop login" → /admin). **`/my`:** bu cihazda açılmış düzenleyiciler tek dokunuşla (panel açılınca
  `localStorage`'a yazılır, `lib/panel/remember.ts`; "Remove from this device"), düzenleme linkini yapıştırma (yalnız
  aynı alan adı), "Just bought a design?" → /start, "Lost your edit link?" → Etsy'den mesaj. `my` ayrılmış adres.

## Sonuç
- `npm test` 946/946 (yeni `tests/g094-admin-v2.test.ts` 4 test: özet sayıları, müşteri/tasarım, CSV formül koruması,
  Yeni sipariş, not alıcıya gitmez, e-posta, yayınla, yanıt silme, CSV yetkisi), typecheck, build yeşil.
- `tests/g087-browser.ts` **65/65** (önce 33): özet, liste, onay, not, taslak önizleme, müşteriler, tasarımlar, yeni sipariş,
  /my (yabancı link reddi, kayıtlı düzenleyici → panel), satış sitesi başlığı 360/390 (menü düğmesi ekranda); axe-core.
- `tests/marketing-browser.ts` 494/494 (başlık değişikliği sonrası).
- Ekranlar `platform/previews/g087/` (a01b özet, a03b site bölümleri, a07 müşteriler, a08 tasarımlar, a09 yeni sipariş,
  a10–a11 /my, a12–a13 satış sitesi başlığı).
- Denenmedi: canlıda (Vercel) — yayın yerel ajanın işi; gerçek telefon.

## Günlük
- 2026-10-15 entegratör onayladı
