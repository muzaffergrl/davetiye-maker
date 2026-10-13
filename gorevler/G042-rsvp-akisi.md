---
id: G042
baslik: RSVP — misafir formu, kayıt, panelde liste + CSV
rol: claude-kod
durum: inceleme
alan: wf-platform
oncelik: 2
bagimli: [G037]
yazar: [platform/app/api/rsvp/, platform/lib/rsvp/, platform/components/rsvp/, platform/public/rsvp/, platform/tests/rsvp.test.ts, platform/tests/rsvp-api.test.ts, platform/tests/rsvp-browser.ts, platform/tests/fixtures/themes/rsvp-fixture/, platform/README.md]
---

## Amaç
Misafir yanıtı çifte ulaşsın; başkası görmesin.

## Yapılacaklar
1. Tema RSVP sayfası için form bileşeni/uç noktası: Name (zorunlu), Email, Attending (Yes/No), Number of guests, Message.
2. Honeypot + IP başına hız sınırı; son tarih geçince form kapanır (mesajla).
3. Panelde yanıt listesi, sayılar (katılan/katılmayan/toplam kişi), CSV indirme.
4. Test: geçerli/eksik/spam gönderim, son tarih, CSV.

## Bitti sayılması için
- [x] Testler geçiyor; demo yanıt yalnız kurgu veriyle

## Sonuç
**Durum: inceleme.** Misafir formu → kayıt → çift listesi/CSV yerelde uçtan uca çalışıyor ve test edildi.
Hiçbir yere yayınlanmadı; Vercel/Supabase projesi açılmadı. Tüm test verisi kurgu (`example.org`, uydurma isimler).

**Yapılan** (ayrıntı: `platform/README.md` → "RSVP (G042)")
- Misafir API `app/api/rsvp/[slug]/route.ts`: `GET` form durumu (açık/kapalı, neden, "April 3, 2027", `maxGuests`;
  `?preview=` ile taslak), `POST` yanıt (yalnız JSON, ≤ 8 KB). Yalnız **yayında** site; taslak/yayından kalkmış/bilinmeyen/ayrılmış slug → 404.
  Alanlar: Name (zorunlu ≤120), Email (isteğe bağlı), Attending yes/no, Number of guests (1..10; tema `theme.json`
  `"rsvp": {"max_guests": N}` ile değiştirebilir; "no" → 0 saklanır), Message (≤500). Kontrol/bidi karakterleri temizlenir.
- Son tarih: `rsvp.deadline` gününün sonu, sitenin saat diliminde; sonra 403 + "Replies closed on April 3, 2027. If you still
  need to reply, please contact the couple directly." Geçersiz saat dilimi → UTC-12. `rsvp.method: "none"` → kapalı.
- Spam: honeypot (`website`) doluysa aynı success cevabı, kayıt yok. Hız sınırı `RateLimiter` arayüzü arkasında
  (`lib/rsvp/rate-limit.ts`, şimdilik `MemoryRateLimiter`): IP başına 10 POST/15 dk (IPv6 /64), site başına 200 kayıt/saat; 429 + Retry-After.
  Aynı yanıt 5 dk içinde ikinci kez gelirse bir kez saklanır (çift tıklama).
- Misafire dönen gövde yalnız `{ok, state, code?, message, fields?}`: başka misafirin verisi, id veya sayı dönmez.
- Çift API (düzenleme anahtarı `Authorization: Bearer` veya `?k=`): `GET /api/rsvp/<slug>/responses` (liste yeniden eskiye,
  `counts {responses, attending, notAttending, totalGuests}`, form penceresi), `GET /api/rsvp/<slug>/export` (CSV: BOM, CRLF,
  her hücre tırnaklı, `= + - @` ve sekme/CR ile başlayan hücreye `'`; zaman sitenin saat diliminde). Yanlış/önizleme/başka site
  anahtarı ve bilinmeyen slug aynı 401. Sunucu fonksiyonları: `authorizeEditor`, `rsvpSummary`, `rsvpCounts`, `rsvpCsvForSite`.
- Tema sözleşmesi + betik `public/rsvp/form.js` (→ `/rsvp/form.js`): `form[data-rsvp-form]` (alanlar `name` ile,
  `method="post"`), `[data-rsvp-state="success|closed|error|preview"]` panelleri, `[data-rsvp-message]`, `[data-rsvp-error-for]`,
  `[data-rsvp-if-attending]`, `[data-rsvp-reply="yes|no"]`, `[data-rsvp-again]`, `data-rsvp-status` + `rsvp:state` olayı.
  Honeypot'u betik ekler; önizlemede hiçbir şey gönderilmez. Test sayfası: `platform/tests/fixtures/themes/rsvp-fixture/`.
- K21: betik ve fixture süs/görsel çizmez (yalın form, varsayılan sistem fontu).

**Test edildi**
- `npm test` 97/97 (yeni 30: `tests/rsvp.test.ts` 13, `tests/rsvp-api.test.ts` 17): geçerli yanıt, eksik isim, honeypot,
  IP ve site hız sınırı, son tarih sonrası + tam sınır anı (03:59:59.999Z açık / 04:00Z kapalı, New York), `method: none`,
  yayında olmayan/taslak/bilinmeyen/ayrılmış slug, önizleme durumu, JSON/boyut/415, çift gönderim, CSV kaçış + BOM + saat dilimi,
  anahtar koruması (header, `?k=`, yanlış, önizleme, başka site), fixture sayfasının motor + CSP'den geçişi.
- `npm run typecheck` temiz; `npm run build` geçti (3 yeni rota).
- Tarayıcı: `npm run build && NODE_PATH=/opt/node22/lib/node_modules node tests/rsvp-browser.ts` — `next start` + Chromium 390 px,
  23/23: betik servis ediliyor, honeypot ekran dışı, `max=6` temadan, yes yanıtı → teşekkür + kayıt, ikinci yanıt (no) → guests gizli,
  sunucu hata mesajı + `aria-invalid`, kapalı formda tarihli mesaj, önizlemede POST yok, CSP/konsol hatası yok, yatay taşma yok.

**Test EDİLMEDİ / yapılmadı**
- Gerçek tema ile: G038 (`blush-garden-rose`) paralel taşınıyor ve `platform/themes/` yazma alanım dışında. G038 RSVP sayfasında
  G035'teki "preview only" düğmesini (`data-field="urls.rsvp_form"`) bu sözleşmeyle değiştirmeli; tema 03 animasyonu `rsvp:state`
  olayına bağlanabilir. `_sample/rsvp.html` hâlâ "RSVP form placeholder (G042)" yazıyor (aynı neden).
- **Panel UI (G039) main'de yok** → "RSVPs" bölümü eklenmedi. G039 için hazır: sunucuda `authorizeEditor` + `rsvpSummary`
  (sayılar + liste) ve CSV linki `/api/rsvp/<slug>/export?k=<anahtar>`; ya da HTTP API (README tablosu).
- Çok örnekli (Vercel) ortamda hız sınırı: bellek içi limiter süreç başına çalışır → G043 kalıcı `RateLimiter` yazıp
  `setRsvpRateLimiter()` ile bağlamalı. Vercel'in `x-forwarded-for` davranışı gerçek yayında denenmedi.
- Yanıt silme/düzeltme yok (adaptörde `deleteRsvp` yok); çifte e-posta bildirimi yok (sağlayıcı seçilmedi); misafir verisi için
  gizlilik metni yok. Gerçek misafir verisiyle akış denenmedi.
- `platform/README.md` başındaki "npm test … (67 test)" satırı paralel görevlerle çakışmasın diye değiştirilmedi; güncel sayı 97.

**Önerilen görevler** (entegratör açar): G039'a RSVPs bölümü (yukarıdaki fonksiyonlarla); G043'te kalıcı RateLimiter + `rsvps`
tablosuna `deleteRsvp`; isteğe bağlı: motor `[data-rsvp-form]` gördüğünde `/rsvp/form.js`'i kendisi eklesin; `_sample` tema sözleşmeyi kullansın.

### İnceleme düzeltmeleri (2026-10-13, bağımsız inceleme bulguları)
- Hız sınırı site + IP başına (30 POST / 15 dk) + bütün siteler için IP tavanı (100 / 15 dk): aynı Wi-Fi bir düğün yüzünden diğerlerini kilitlemiyor.
- Yoğunlukta gerçek misafir kilitlenmiyor: site (200/sa) ya da bir IP'nin o sitedeki (10/sa) sınırı aşılınca yanıt **beklemede**
  saklanıyor (sayılara/CSV'ye girmez); çift panelde "Keep" / "Remove". Adaptörde `deleteRsvps`, `setRsvpsHeld`;
  `POST /api/rsvp/<slug>/responses` (yalnız Bearer). Yalnız bekleyen deposu (500/gün) dolunca 429.
- Son tarih: gece yarısı yaz saati boşluğunda (Asia/Beirut, Africa/Cairo) form artık bir saat erken kapanmıyor.
- `form.js`: tarayıcı balonu yerine temanın hata yerleri (`noValidate`), `aria-describedby` bağlantısı, kapalı formda
  `data-rsvp-reason`, tema demosunda durum sorgusu yok (404 / konsol hatası yok).
- Test: `npm ci`, `npm test` (197/197), `npm run typecheck`, `npm run build` (+ yeni postbuild `trace-check`) temiz; `theme-check.cjs` 68/68, `panel-browser.ts` 72/72, `claim-browser.ts` 50/50, `rsvp-browser.ts` 25/25 (hepsi geçici klasöre, kayıtlı previews değişmedi); `tools/tests/*.py` 6/6. Gerçek telefon, gerçek Vercel/Blob ve canlı yayın **denenmedi**.
- Yapılmadı: kalıcı / paylaşılan `RateLimiter` (Vercel'de sınırlar örnek başına; G043/G048); gizlilik metni (önerilen görev:
  claude-metin, ticari kimlik kullanıcıdan); yanıt düzeltme.

## Günlük
- 2026-10-13 alindi: wf-platform
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme bulguları düzeltildi (site+IP sınırı, beklemede yanıtlar + silme, DST, form.js erişilebilirlik) — wf-fix
