---
id: G063
baslik: Canlıda çapraz tarayıcı testi (Firefox, Edge, Chrome; telefon emülasyonu) — 01 ve 03, alıcı + misafir yolculuğu
rol: claude-tarayici
durum: inceleme
alan: claude-local-1
oncelik: 1
bagimli: [G049]
yazar: [docs/17_CAPRAZ_TARAYICI_TESTI.md]
---

## Amaç
Şimdiye kadar yalnız Chromium (bulut) test edildi. Local oturum kullanıcının bilgisayarındaki gerçek tarayıcılarla canlı siteyi dener.

## Yapılacaklar
1. Firefox, Edge ve Chrome'un güncel sürümleriyle (masaüstü + DevTools telefon emülasyonu 390×844 ve 360×640):
   - misafir: `/clara-and-julian` zarf → açılış → home → story → details → RSVP gönder (kurgu veri) → takvime ekle (.ics indirilir mi)
   - alıcı: `/start?theme=olive-ivory` ve `?theme=blush-garden-rose` → test sipariş no + e-posta → panel → isim/tarih/foto değiştir → yayınla → QR
   - Firefox'ta view transition yokken solma yolu düzgün mü
2. Her sorun için ekran görüntüsü + tarayıcı/sürüm + adımlar → `docs/17_CAPRAZ_TARAYICI_TESTI.md`. Düzeltme yapma (bulut ajanları düzeltir);
   test siteleri ve RSVP'leri bitince sil (live-check'in temizlik yolu).
3. Gerçek iPhone/Android yok — yalnız emülasyon olduğunu açıkça yaz.

## Sonuç
**Ne yapıldı:** canlı sitede (production = main `59b1291`) Chrome 155.0.8059.40, Edge 155.0.4283.45, Firefox 157.0.1 ile masaüstü 1366×900 +
telefon emülasyonu 390×844 ve 360×640 (DPR 3, dokunma, mobil kimlik); puppeteer-core (Chrome/Edge CDP, Firefox WebDriver BiDi), başsız.
Misafir yolculuğu 9/9 kombinasyon, /start iki tema 18/18 (gerçek sahiplenme 4'ünde — IP başına günlük 5 site sınırı), panel 18/18
(isim/tarih/foto → yayın → QR → yayındaki site). Ayrıntı ve matris: `docs/17_CAPRAZ_TARAYICI_TESTI.md`.

**Sonuç:** engelleyici/orta bulgu yok; misafir ve alıcı yolculukları üç tarayıcıda da uçtan uca çalışıyor. **Firefox solma yolu düzgün**
(view transition yok → `arrive-fade`, ara boş kare yok). `.ics` üç tarayıcıda gerçek indirmeyle, QR 20/20 görüntüde doğrulandı.
**12 düşük bulgu** (B1–B12): favicon yok (B1), Firefox konsol uyarısı (B2), telefonda alt menü altındaki RSVP denetimi / odak (B3),
details başlık çakışması (B4), tek mekân bloğu sol sütunda (B5), Olive kart kenarında 1 px basamak — yalnız Chromium (B6), etkin RSVP hapı
(B7), yapraklar formun üstünde (B8), panelde adres `break-all` (B9), panel masaüstünde ilk anda telefon düzeni (B10), "Save this link"
kutusu `rows={4}` (B11), isim alanlarında yazım denetimi (B12). Görsel inceleme: 60 aday → 12 ayakta (çürütme ajanlarıyla, kaynak koda ve
yeniden üretime dayalı).

**Test edilmeyen:** gerçek iPhone/Android yok — yalnız emülasyon; **iOS Safari (WebKit) hiç test edilmedi**; mobil Chromium'un tarih seçicisi
(değer test aracıyla verildi), sanal klavye, gerçek dokunma. Test aracı kaynaklı başarısızlıklar kanıtlarıyla docs/17 §5'te.

**Temizlik:** 28 test sitesi (24 tohum + 4 sahiplenme) live-check yoluyla silindi, `slugs/g063*`, `orders/98*` 0, adresler 404; demoya
gönderilen 12 "G063 …" RSVP'sinin hepsi silindi. Demoda kalan tek yanıt (`<xz`, 07:51, testlerden önce) bu görevin değil — dokunulmadı,
entegratöre not.

**Yazar kapsamı dışı:** ekran görüntüleri `docs/17_capraz_tarayici/` klasöründe (docs/17'nin eki; B11'deki düzenleme linki
pikselleştirildi, repoda anahtar yok). Test betikleri scratchpad'de kaldı, repoya konmadı.

**Önerilen görevler:** (1) claude-kod: B9 + B10 + B11 + B12 panel/start küçük düzeltmeleri (tek PR); (2) claude-kod/tema: B3 + B4 + B5 + B7
Blush Garden Rose CSS düzeltmeleri, B8 yaprak katmanı kararı; (3) B6 Olive 3 dilimli kart dikişi (Chromium); (4) B1 platform favicon'u
(simge GPT'den); (5) gerçek cihaz testi (iPhone Safari + Android Chrome) — kullanıcı cihazı ya da bulut cihaz çiftliği gerekir.

## Günlük
- 2026-10-14 alindi: claude-local-1
- 2026-10-14 bitti, incelemeye gönderildi
