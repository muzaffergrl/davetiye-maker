---
id: G069
baslik: RSVP yanıtları çift için düzenli ve şık — özetler, soru cevap dökümü, yeni yanıt işareti, misafir isimleri, yazdırılabilir liste
rol: claude-kod
durum: inceleme
alan: claude-G069
oncelik: 1
bagimli: [G060]
yazar: [platform/components/panel/, platform/lib/, platform/app/api/, platform/themes/olive-ivory/rsvp.html, platform/themes/blush-garden-rose/rsvp.html, platform/tests/, platform/README.md, platform/previews/g069/]
---

## Amaç
Kullanıcı (2026-10-14): "RSVP talepleri müşterilere görünmeli, düzenli, harika bir şekilde". Panel v2'de Guests sekmesi var
(Coming/Not coming/Replies sayıları, süzgeç, arama, kart, CSV). Bunu düğün planlayan bir çiftin gerçekten işine yarayan,
şık bir misafir yönetimine çevir.

## Yapılacaklar
1. **Özet paneli:** gelen kişi toplamı, gelmeyen, yanıt veren, son tarihe kalan gün; **özel soruların cevap dökümü** (ör. menü
   seçimi: Chicken 12 · Fish 5 · Vegetarian 3; evet/hayır soruları yüzde), diyet/alerji notları tek listede.
2. **Misafir isimleri:** RSVP formunda "kaç kişi" > 1 ise ek kişilerin adları (isteğe bağlı alanlar; tema formu sözleşmesine eklenir,
   01 ve 03 rsvp.html güncellenir). Panelde parti olarak gösterilir; CSV her kişiyi ayrı satır verir.
3. **Yeni yanıt işareti:** son ziyaretten beri gelen yanıtlar "New" rozeti + Home'da "3 new replies" kartı; okundu işaretleme.
4. **Sıralama/süzgeç:** en yeni, isim, katılım; soru cevabına göre süzgeç (ör. yalnız Vegetarian).
5. **Düzenleme:** çift bir yanıtı elle ekleyebilir/düzeltebilir (telefonla gelen yanıtlar için) — kaynak "Added by you" işaretli.
6. **Dışa aktarma:** CSV (Excel/Google Sheets uyumlu, UTF-8 BOM, enjeksiyon güvenli) + **yazdırılabilir liste** (A4/Letter,
   tarayıcı yazdırma görünümü).
7. Erişilebilirlik ve mobil: 390 px'te tek elle kullanım, dokunma hedefi ≥ 44 px; boş durumlar dürüst metinle.
8. **Yapılmayacak (sağlayıcı yok):** yeni yanıt e-posta bildirimi — yalnız arayüz yeri ve "Coming soon" değil, hiç gösterme;
   Sonuç'a öneri olarak yaz.
9. Testler: API (ekle/düzelt/sil, özet hesapları), tarayıcı yolculuğu (misafir 3 kişilik yanıt → panel özet + New → CSV satırları),
   `rsvp-browser.ts`, `g060-browser.ts` geçmeli. Önizleme `platform/previews/g069/`.

## Bitti sayılması için
- [x] Özet + soru dökümü + misafir isimleri + New + sıralama/süzgeç + elle ekleme + CSV/yazdır çalışıyor; testler geçti

## Sonuç
**Durum: kodda bitti, yerelde test edildi; canlıya yayınlanmadı** (bu görevde deploy yok). Ayrıntı: `platform/README.md` "RSVP paneli v2 (G069)".

**Yapılanlar**
- **Özet:** Guests'te 3 sayı (gelen kişi · gelmeyen · yanıt) + son tarih satırı ("Replies close in 30 days. Last day: … (New York time)";
  son gün / kapandı / yanıtlar kapalı metinleri; gün sayısı sitenin saat diliminde).
- **Cevap dökümü:** her soru bir kart. Seçenekli soru sayı + çubuk (kimsenin seçmediği seçenek de görünür), evet/hayır sorusu yüzde
  ("80% (4)"), metin sorusu son 3 cevap + "Show all"; silinmiş soru "Removed question" ile kalır. Çubuğa dokununca liste o cevaba
  süzülür. Cevap **yanıt başına** sayılır (misafir partisi için bir kez cevaplar) — ekranda böyle yazıyor.
- **Yemek & alerji notları** tek listede: yemek/alerji sorusunun cevapları + mesajında alerji/vegan/gluten/fıstık… geçen notlar
  ("None", "n/a" elenir). Böyle soru yoksa Reply settings'e götüren dürüst ipucu.
- **Misafir isimleri:** form sözleşmesine `<template data-rsvp-party>` eklendi; `/rsvp/form.js` "Number of guests" 2+ olunca
  "Name of guest 2/3…" alanlarını açar, "no"da formdan çıkarır (yazılan kalır), `party: [...]` gönderir; sunucu doğrular (≤ 120 karakter,
  en çok guests − 1, boşlar saklanmaz). 01 ve 03 `rsvp.html` güncellendi (temanın kendi `.field`/`.kicker`/`.opt` stilleri, yeni dekor yok;
  satırlar formun diğer alanlarıyla aynı aralıkta). Panelde kart "With James Hamilton and Ada Hamilton", açılınca herkes numaralı.
- **New:** bu cihazda son bakıştan sonra gelen yanıtlar (`seen:<slug>`; çiftin eklediği ve bekleyenler sayılmaz, hiç bakılmamışsa hepsi).
  Home'da vurgulu "3 new replies · 24 coming · 6 not coming" kartı, alt menüde sayı, Guests'te banner + **Mark as seen** (Guests'ten
  çıkınca da görülmüş sayılır; yenilemeden sonra kalır).
- **Sıralama/süzgeç:** Newest / Oldest / Name (A–Z) / Coming first; All · Coming · Not coming · New · Held; ad/e-posta araması; cevap süzgeci.
- **Elle ekleme/düzeltme:** "Add a reply" sheet'i (ad, Coming/Not coming, kişi sayısı, diğer adlar, misafirin gördüğü sorular, e-posta,
  not) → "Added by you"; her yanıtta "Edit reply" → "Edited by you". API: `POST /api/rsvp/<slug>/responses` `{action:"add"|"update"}`
  (misafir formuyla aynı kurallar ve mesajlar; son tarih geçmişken de çift ekleyebilir). Arşivde 403; liste, CSV, yazdırma açık.
- **CSV:** kişi başına bir satır (Name · Party of · Attending · Party size · Email · Submitted · Source · Message · sorular), UTF-8 BOM,
  CRLF, formül korumalı; "Party size" yalnız yanıtın ilk satırında (toplamı = gelen kişi). Eski "yanıt başına satır" biçimi değişti.
- **Yazdırılabilir liste** `#guests/print`: "Guests coming / Everyone who replied", mesajlar isteğe bağlı; ✓ kutusu · Name · Party ·
  Answers, adlar A–Z; yazdırırken panel çubukları gizli, A4 ve Letter'a sığar; telefonda kişi başına blok.
- **Uyumluluk:** `party`, `source`, `editedAt` isteğe bağlı; eski yanıtlar aynen okunur (adsız kişiler "Guest 2"). `local` + `blob`
  adaptörlerine `updateRsvp` (blob: ETag'li). Hız sınırları ve honeypot değişmedi. Arayüz panel v2 tokenları/bileşenleriyle
  (`components/panel/guests.tsx`). Düzen, iş sırasında main'e gelen `brand/ui/panel/u2_guests_390.png`'yi izler (ikonlu sayı kutuları,
  "Replies close in **N days**" şeridi, tek satır çubuklar, çipler, arama, avatar'lı kartlar, altta yapışkan "Add a reply" + "Download
  list"; "Print list" Replies başlığının yanında) ve `u2_home_390.png`'deki "3 new replies" kartını; renkler hâlâ panel v2 tokenları —
  marka renkleri G066'nın işi (yalnız token/sınıf).

**Testler (2026-10-14, yerel, Chromium 390 × 844 mobil emülasyon; origin/main (G076 site şifresi dahil) birleştirildikten sonra)**
- `npm test` 491/491, `npm run typecheck` temiz, `npm run build` + trace-check geçti.
- Yeni `tests/g069-rsvp.test.ts` 13/13 (party doğrulaması, ekle/düzelt/sil, 404/401, arşiv 403, özet matematiği, yemek notları,
  son tarih günleri, CSV kişi satırları, eski kayıtlar, blob `updateRsvp`, 01/03 şablon sözleşmesi); `rsvp.test.ts` / `rsvp-api.test.ts`
  yeni CSV biçimine uyarlandı.
- Yeni `tests/g069-browser.ts` **60/60**: 03 temasında misafir 3 kişilik yanıtı adlar + menü + notla gönderir, 01'de 2 kişilik → panel
  Home "1 new reply" → özet, çubuklar, evet/hayır yüzdesi, yemek notları, parti kartı, New → cevap süzgeci, sıralama → Mark as seen →
  Add a reply → Edit reply → CSV (3 kişilik yanıt = 3 satır, BOM) → yazdırma görünümü + print medyası + A4/Letter PDF; 1280/320 px,
  arşiv, axe-core (ciddi/kritik 0), dokunma alanları ≥ 44 px, konsol hatası yok.
- Mevcutlar geçti: `g060-browser` 147/147, `g076-browser` 49/49, `rsvp-browser` 25/25, `panel-browser` 75/75, `g051-browser` 44/44,
  `final-smoke --theme olive-ivory` 45/45 ve `--theme blush-garden-rose` 45/45; `theme-check` (birleştirmeden önce; temalara o
  zamandan beri dokunmadım) blush-garden-rose 95/95 (2 uyarı: menü geçişi, tema tarafı). `theme-check` olive-ivory 96/98: 2 FAIL "home@390 (draft preview, no photos): card text over painted decor" —
  **G069 öncesi kodda da aynı** (aynı koşuyu değişiklikten önceki commit'in kendi build'inde çalıştırdım: 96/98, aynı kontrol); home
  sayfası/önizleme şeridiyle ilgili, bu görevin dokunduğu dosyalarla değil. Ayrı iş olarak bakılmalı.
- Önizlemeler `platform/previews/g069/`: 01/02 misafir formu (03 ve 01), 03 Home kartı, 04 Guests özet, 05 cevap dökümü, 06 yemek notları,
  07 parti kartı, 08 süzgeç, 09/09b Add a reply, 10/10b yazdırma görünümü, 11 print medyası, 12 1280 px, `g069_guest_list_A4.pdf`, `checks.json`.

**Yapılmayan / dürüst notlar**
- **E-posta bildirimi yok** (sağlayıcı yok) — arayüzde yeri de yok. **Öneri:** sağlayıcı gelince "yeni yanıt" e-postası (anında ya da
  günlük özet), `SignInMailer` gibi bir arayüzle; çift panelden açıp kapatır.
- "Görüldü" bilgisi cihaz başına (`localStorage`); eşin telefonunda ayrı. Sunucuda tutmak ayrı karar.
- Gerçek telefonda, gerçek yazıcıda, Excel/Google Sheets'te elle açılarak denenmedi (Chromium emülasyonu + Chromium PDF'i; BOM/CRLF/
  tırnak/formül koruması testte doğrulandı).
- Menü seçimi yanıt başına; kişi başına seçim (her misafire ayrı soru) yok — tema formunda soruları kişi başına tekrarlamak gerekir.
- Yemek notu tespiti anahtar kelimeyle; mesajdaki bir notu kaçırabilir.
- 04/05/_sample temalarında isim şablonu yok (sözleşme isteğe bağlı: adlar sorulmaz, panel "Guest 2" der).
- Yazma alanı dışında zorunlu dosya: `platform/public/rsvp/form.js` (form sözleşmesinin betiği; adlar onsuz çalışmaz).
  `docs/16_PANEL_V2.md` §6.4 güncellenmedi (alan dışı); güncel anlatım README'de.

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği; panel v2 düzeltme turu bitince başlar
- 2026-10-14 alindi: claude-G069
- 2026-10-14 claude-G069: RSVP paneli v2 kodlandı, testler geçti (Sonuç); incelemeye
- 2026-10-14 bitti, incelemeye gönderildi
