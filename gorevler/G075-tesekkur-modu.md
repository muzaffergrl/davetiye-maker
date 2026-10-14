---
id: G075
baslik: Düğün sonrası teşekkür modu — site düğünden sonra "Thank you" hâline geçer (otomatik, çift kapatabilir)
rol: claude-kod
durum: alindi
alan: claude-G075
oncelik: 1
bagimli: [G060]
yazar: [platform/lib/, platform/app/, platform/components/panel/, platform/themes/olive-ivory/, platform/themes/blush-garden-rose/, platform/tests/, docs/03_URUN_ICERIK_SEMASI.json, docs/11_TEMA_STANDARDI.md, platform/README.md, platform/previews/g075/]
---

## Amaç
K28. Düğünden sonra misafirler aynı linke döndüğünde davet yerine bir **teşekkür sayfası** görsün; site 12 ay sonra arşivlenene
kadar (K25) anlamlı kalsın. docs/15'teki satış sonrası planın parçası.

## Yapılacaklar
1. **Kural:** düğün günü bitince (site saat diliminde ertesi gün 00:00) otomatik teşekkür modu; panelde "Thank-you mode: Automatic /
   On now / Off". Arşiv kuralları (G060) değişmez; arşivde 410 sürer.
2. **Misafir tarafı:** zarf sayfası ve home teşekkür içeriğine döner: başlık (varsayılan "Thank you for celebrating with us"),
   çiftin kısa mesajı, bir fotoğraf (isteğe bağlı, yoksa tema yer tutucusu değil temanın süsü), isimler ve tarih. RSVP formu kapanır
   (dürüst metin: "Replies are closed"), program/detaylar sayfası "The day" olarak kalabilir ya da gizlenir (çift seçer). Story kalır.
   Zarf açılış şovu korunur, kart içeriği teşekkür metni olur.
3. **Şema + panel:** `thank_you { mode: auto|on|off, title, message (≤ 400), photo }` — doğrulama, uzunluk, panel bölümü ("After the
   wedding"), canlı önizleme, Home kartı ("Your website switched to thank-you mode"). G068 tamamlandıysa başlık `copy` sistemiyle uyumlu.
4. **Temalar:** 01 ve 03'e teşekkür hâli (yeni sayfa değil; mevcut sayfalarda `data-if` ile). docs/11'e yeni temalar için kural + theme-check.
5. **Testler:** saat dilimi sınırı (DST dahil), mode on/off/auto, RSVP API'nin teşekkür modunda reddi (403 `closed`), panel yolculuğu,
   final-smoke ve theme-check iki temada. Önizleme `platform/previews/g075/`.

## Bitti sayılması için
- [ ] Otomatik geçiş + elle aç/kapa; misafir sayfaları ve RSVP doğru; testler geçti

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): K28
- 2026-10-14 alindi: claude-G075
