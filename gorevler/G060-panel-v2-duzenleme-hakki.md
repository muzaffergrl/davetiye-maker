---
id: G060
baslik: Panel v2 — çağdaş, en kullanıcı dostu panel + kötüye kullanıma karşı düzenleme hakkı sistemi
rol: claude-kod
durum: alindi
alan: wf-hiz
oncelik: 1
bagimli: [G039, G045]
yazar: [platform/app/edit/, platform/app/api/edit/, platform/components/panel/, platform/lib/panel/, platform/lib/sites.ts, platform/lib/claim/, platform/app/start/, platform/tests/panel*, platform/tests/edit*, platform/tests/g060*, platform/README.md, docs/10_SITE_PLATFORMU.md]
---

## Amaç
Kullanıcı (K25): panel "harika, çağdaş, en kullanıcı dostu, anlaşılır" olmalı. Alıcı yalnız satın aldığı şablonu kullanmalı;
bir satın alma ile başka çiftlere site yapılamamalı ("sadece birkaç kez düzenleme").

## Yapılacaklar
1. **UX araştırma + tasarım:** önde gelen düğün sitesi editörlerinin akışından öğren (kopyalama yok); telefon öncelikli ilk
   kurulum sihirbazı (isimler → tarih/saat → mekân → fotoğraflar → önizle → yayınla), sonra bölüm bölüm düzenleme; canlı
   önizleme; kaydedildi göstergesi; boş durumlar; yardım ipuçları; erişilebilirlik; Türkçe değil İngilizce arayüz.
2. **Düzenleme hakkı (anti-abuse):** tek sipariş = tek site (var). Yayından sonra **kimlik alanları** (çift isimleri, tarih) için
   sınırlı değişiklik hakkı (varsayılan 3; panelde kalan hak gösterilir, hak bitince destekle iletişim mesajı); yazım düzeltmesi
   (≤ 2 karakter fark) hak harcamaz; diğer içerik (program, metinler, fotoğraflar) sınırsız. Site düğünden **12 ay sonra**
   salt okunur arşive geçer (K25). Hepsi sunucu tarafında zorlanır, testli.
3. **Erişim:** benzersiz düzenleme linki (mevcut) + isteğe bağlı e-posta ile giriş bağlantısı (magic link) için arayüz —
   e-posta sağlayıcısı yokken kapalı, metin dürüst.
4. Testler + Playwright 390 px yolculuk + ekran kaydı (`platform/previews/g060/`).

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-14 alindi: wf-hiz
