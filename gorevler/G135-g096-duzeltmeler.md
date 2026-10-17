---
id: G135
baslik: G096 canlı testinin 4 küçük hatası — demo satış sayımı, /my silinen site, "Sipariş onaylanıyor" şablonu, saat dilimi
rol: claude-kod
durum: inceleme
alan: claude-G135
oncelik: 2
bagimli: []
yazar: [platform/lib/admin/, platform/components/admin/, platform/app/admin/page.tsx, platform/lib/panel/remember.ts, platform/components/my/MyWebsite.tsx, platform/lib/claim/claim.ts, platform/app/start/StartForm.tsx, platform/components/panel/sections.tsx, platform/tests/g135-live-fixes.test.ts, docs/19_ALICI_YOLCULUGU.md, gorevler/G135-g096-duzeltmeler.md]
---

## Amaç
G096 canlı doğrulamasında (`gorevler/G092-canli-admin.md` → "G096 yayını + K34" → "Ek gözlemler") bulunan dört küçük hatayı düzeltmek.
Yayın yok (deploy bu görevin dışında). "Not yet" kelime bölünmesi PR #7'de düzeltildi; "örnek tarih onayı kalıcı değil" gözlemi bu görevde yok.

## Yapılacaklar
1. Admin Özet demo siteleri (`DEMO-SEED-…`) satış saymasın; listelerde demo olarak etiketli kalsın.
2. /my "On this device": silinmiş ya da linki yenilenmiş site listeden düşsün.
3. "Sipariş onaylanıyor (Publish bekliyor)" şablonu: geliştirici notu dükkân paneline sızmasın; `[ORDER CHECK TIME]` için ticari vaat uydurulmasın.
4. Saat dilimi: /start sonrası kurulum, kayıt ve admin aynı dilimi göstersin.

## Bitti sayılması için
4 düzeltme + testler; `npm test`, `npm run typecheck`, `npm run build` yeşil; PR ya da dal (deploy değil).

## Sonuç (2026-10-16, claude-G135)
**Dal:** `claude/g096-ux-fixes` (origin/main `edabe77f` üstünde). Deploy **yapılmadı**.

1. **Demo satış sayımı.** `lib/admin/view.ts`: `DEMO_ORDER_PREFIX` + `isDemo()`; `isSale()` artık `DEMO-SEED-` siparişlerini saymıyor →
   Özet sayıları, haftalık grafik, "En çok satan", Tasarımlar satış sütunu ve müşteri sipariş sayısı yalnız gerçek siparişler. Demolar
   "Son siparişler", Siparişler, site sayfası vb. listelerde **"Demo"** rozetiyle (`components/admin/badges.tsx`) görünmeye devam ediyor;
   site sayıları (yayında/taslak) onları içeriyor. Özet açıklama satırı: "Demo etiketli örnek siteler sayılmaz".
2. **/my silinen site.** `lib/panel/remember.ts`: `checkEditor()` saklı linki panel API'sine (`GET /api/edit/<slug>`, anahtar
   Authorization başlığında, aynı origin) sorar; 401/404/410 = "gone" (site silinmiş ya da yeni link verilmiş), ağ hatası/5xx/429 =
   "unknown" (tutulur). `dropGoneEditors()` gidenleri cihazdan siler. `/my` açılınca kontrol eder, gidenleri listeden düşürür ve kısa bir
   İngilizce not gösterir ("/slug no longer opens … we removed it … paste a newer link below").
3. **Şablon.** `[ORDER CHECK TIME]` cümlesi kaldırıldı (süre vaadi yok): metin artık "We will message you here as soon as order {order} is
   confirmed; …" — eksik alan kalmadığı için admin'den kopyalanabilir. `message-templates.json` ve docs/19'daki kopyası birlikte değişti
   (§4.6 kural 5'e not). Admin'de gösterilen notlar artık Türkçe `NOTES_TR` (`lib/admin/messages.ts`); G091'in İngilizce geliştirici notları
   (`node scripts/verify-order.ts …`, "docs/19 §6 A6") JSON'da kalıyor ama dükkân paneline çıkmıyor. publish_blocked_pending notu: "Önce
   Etsy'de siparişi kontrol edin … 'Siparişi onayla' … sonra 'Sipariş onaylandı — yayınlayabilir' mesajını gönderin."
4. **Saat dilimi.** Amaç docs/16 §5.3: örnek tarih/dilim duruyorken dilim **alıcının telefonunu** izler. Eskiden bunu yalnız kurulumun
   1. adımındaki efekt yapıyordu (ekran açılınca, sonradan) → o adıma gelmeden Home/Edit/admin örnek dilimi (Blush Garden Rose:
   New York) gösteriyordu; canlıda alıcı Home'a düştüğü için ekran ve kayıt farklı anlarda farklı dilimdeydi. Şimdi `/start` formu
   telefonun IANA dilimini gönderiyor (`timeZone`), sunucu `claimTimeZone()` ile doğrulayıp (`Area/City` biçimi + Intl tanıyor; değilse
   örnek kalır, claim asla reddedilmez) taslağa yazıyor → kayıt, kurulum ("We'll use Istanbul time, from your phone") ve admin
   "Saat dilimi" ilk andan aynı. Kurulum efekti: dilim zaten telefonunkiyse yalnız tarih stilini izliyor; elle seçilmiş dilime dokunmuyor.
   Admin "Yeni sipariş" siteleri dilim göndermez (dükkânın dilimi alıcınınki değil) → eskisi gibi alıcının telefonu kurulumda belirler.

**Testler:** `platform/tests/g135-live-fixes.test.ts` (5 test: demo/satış sayıları, /my gerçek API rotasıyla silinen + yenilenen link,
ağ hatasında tutma, şablon kopyalanabilir + notlarda geliştirici izi yok, claim dilimi + geçersiz dilim + örnek notu).
Windows'ta `PYTHONUTF8=1` + junction ön yüklemesi (`NODE_OPTIONS=--import=<shim>`, README "Windows notları"):
`npm test` **1213 test, 1194 geçti, 0 hata, 19 atlandı** (Playwright'lı tema testleri + build'e bağlı); build sonrası
`marketing-build` 2/2; `npm run typecheck` ✓; `npm run build` ✓ (trace-check 21 tema).
**Tarayıcıda (yerel `next dev`, 375 px, tarayıcı dilimi Europe/Istanbul, `CLAIM_ORDER_VERIFICATION=manual`, geçici veri klasörü):**
/start (blush-garden-rose) → editör açılmadan kayıtta `Europe/Istanbul`; kurulum 1. adım "We'll use Istanbul time, from your phone".
Site dosyası silinince /my o siteyi düşürdü ve notu gösterdi, diğer site kaldı. Admin ekranları tarayıcıda açılmadı (birim testleri var).
**Denenmeyen:** canlı ortam (deploy yok); START HERE/docs/19 §FAQ'taki "usually within [ORDER CHECK TIME]" metinleri (alıcı rehberi,
bu görevin dışında — süre kararı çıkana kadar yer tutucu).

**Önerilen görev:** "örnek tarih onayı kalıcı değil" gözlemi (G092 ek gözlemler, son madde) ayrı küçük iş.

**G134 entegrasyonu (2026-10-17):** dal `claude/g096-ux-fixes` G098 kimliğiyle açılmıştı; G098 `gorevler/G098-tema-rotuslari.md`'ye ait
olduğundan kimlik **G135** oldu (dosya ve test `tests/g135-live-fixes.test.ts`; kod yorumlarındaki "G098" → "G135"; commit mesajları
değişmedi). Main'e uyarlama: docs/19 §4.6 kural 5 (main'in "yanıt süresi 24 saat" kararı korunarak) birleştirildi; G121'in eklediği beş K42
şablonunun (kurulum/özel tasarım) İngilizce notları da `NOTES_TR`'ye Türkçe olarak eklendi (yoksa admin'de notsuz kalırlardı). G121'in "elle doldurulan politika" testi (`tests/g121.test.ts`,
`tests/g121-browser.ts`) artık süresiz `publish_blocked_pending` yerine `date_moved`'un `[POSTPONEMENT POLICY]`'si ile çalışıyor.

## Günlük
- 2026-10-16 açıldı ve alındı: claude-G135 (G096 bulguları, başlatan oturumun isteğiyle)
- 2026-10-16 bitti, incelemeye gönderildi
- 2026-10-17 G134 entegrasyonunda main'e birleştirildi; kimlik G098 → G135
