---
id: G130
baslik: Ek hizmetler — "We set it up for you" kurulum hizmeti + özel tasarım (Etsy ilanları, satış sitesi, satış sonrası akış)
rol: claude-metin
durum: bitti
alan: claude-G130
oncelik: 1
bagimli: [G091, G123]
yazar: [collections/_services/, docs/23_EK_HIZMETLER.md, docs/01_KULLANICI_KARARLARI.md, docs/20_ETSY_DUKKAN_KURULUMU.md, docs/19_ALICI_YOLCULUGU.md, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, platform/lib/marketing/config.ts, platform/lib/marketing/placeholders.ts, platform/components/marketing/ExtraServices.tsx, platform/components/marketing/extra-services.module.css, platform/app/(marketing)/pricing/page.tsx, platform/components/panel/views.tsx, platform/lib/admin/message-templates.json, platform/lib/admin/messages.ts, gorevler/G130-ek-hizmetler.md]
---

## Amaç
K42 (kullanıcı, 2026-10-16): alıcının düzenlemesini biz yaparız (~+500 TL, tek tur; yeni tur = yeni satın alma) ve özel tasarım
(şablon fiyatı + ~1500 TL). İkisi Etsy'de ayrı ilan. Fiyatı kura göre ajan önerir. Etsy'ye hiçbir şey yüklenmez (K41).

## Yapılacaklar
1. Fiyat: güncel USD/TRY (kaynak + tarih), TL önerileri, `config.ts`'te hizmet alanı (yer tutucu kuralı, `launched` kontrolü bozulmadan).
2. İki ilan: `collections/_services/{setup-service,custom-design}/package/listing/listing_v3.md` + `etsy_upload.json`; `tools/etsy_upload.py` tanısın.
3. Satış sitesi `/pricing`: "Prefer us to do it?" + "Custom design" (yeni bileşen; link yoksa "Coming soon on Etsy").
4. `docs/23_EK_HIZMETLER.md` satış sonrası akış; Etsy mesaj şablonları (`message-templates.json` + docs/19 kopyası); panel Help'e tek satır.
5. docs/20 §3 "Services" bölümü önerisi; K42 docs/01'e.

## Bitti sayılması için
- [x] Fiyat tablosu (öneri — kullanıcı onayı), kur kaynağı ve tarihi (docs/23 §1)
- [x] İki `listing_v3.md` + `etsy_upload.json`; `python3 tools/etsy_upload.py --check` çıkış 0 (2 hizmet + 20 tasarım)
- [x] `python3 tools/tests/test_etsy_upload.py` yeşil (yeni `test_services`)
- [x] `npm ci`, `npm run typecheck`, `/pricing` 390 px görüntüsü, `npm test` (1225 test, 0 hata), `npm run build` (çıkış 0)

## Sonuç
**Fiyat (öneri — kullanıcı onayı).** Kur 1 USD = 49,53 TL (BloombergHT, 2026-10-16 09:30). Tasarım 29.40 USD → **1.460 TL**
(≈ $29.48); kurulum **500 TL** (≈ $10.09); özel tasarım 1.460 + 1.500 = **2.960 TL** (≈ $59.76). `config.ts` `services` alanı
eklendi, fiyat ve Etsy linki `[PRICE]` / `[ETSY LISTING URL]` (sitenin para birimi `USD`; TL gösterimi ve onay birlikte gelince
doldurulur). `launchProblems`: gerçek Etsy linki olan bir hizmetin fiyatı gerçek değilse lansman build'i durur; link yokken
hizmetler lansmanı engellemez.

**İlanlar.** Kurulum: "Wedding Website Setup Service, We Enter Your Details for You, Add On for Our Website Designs, Done for You
RSVP and Photo Setup" (127). Özel tasarım: "Custom Wedding Website Design with RSVP, Made Just for You, Your Own Colors and Opening,
Online Editor, Digital Invitation Website" (130). 13'er etiket ≤ 20. Kararı olmayanlar açık: `[TURNAROUND]`, `[REVISIONS]`,
`[EXTRA ROUND]`, `[EXCLUSIVITY]`, `[QUANTITY]`, `[AUTO RENEW]`; `etsy_upload.py` açıklamadaki yer tutucuları `open_checks`'e yazar.
Görsel ihtiyaç listesi (4'er) §5'te; dijital dosya önerisi (`SETUP_SERVICE.pdf`, `CUSTOM_DESIGN.pdf`) yok → blocker.

**Site / panel / admin.** `/pricing`'de "Extras" bölümü (`ExtraServices.tsx`, kendi CSS modülü; paylaşılan CSS'e dokunulmadı).
Panel Help → "Need help?" altına tek satır. 4 yeni İngilizce Etsy mesajı (`setup_service_details`, `setup_service_done`,
`custom_design_brief`, `custom_design_ready`) + Türkçe admin başlıkları; docs/19 §4.5 kopyası birebir (g087 testi).

**Bulgular / açık işler.**
- Admin'de bir sitenin düzenleme linkini **değiştirmeden** düzenleme yolu yok: alıcı başlamışsa kurulum için "Yeni düzenleme
  linki" gerekir, alıcının eski linki ölür (ilan ve mesaj bunu söylüyor). Geliştirme görevi önerisi (docs/23 §3).
- Özel temayı satış listesine koymadan tek alıcıya açma yolu yok (docs/23 §4.4). Geliştirme görevi önerisi.
- Etsy'nin hizmet ilanı politikası okunmadı (`[VERIFY]`).
- docs/20 §3: dördüncü bölüm `Services` önerisi.

**Kullanıcı kararı bekleyenler:** fiyatlar (1.460 / 500 / 2.960 TL), teslim süresi, revizyon sayısı ve ek tur fiyatı, özel tasarımın
münhasırlığı, quantity/renewal.

### Güncelleme — kullanıcı kararları (2026-10-16)
Fiyatlar onaylandı (1.460 / 500 / 2.960 TL); teslim **3 gün**; özel tasarımda **2 revizyon**, sonrası **tur başı 500 TL**; özel
tasarım **başkasına satılmaz**; stok **sınırsız** (Etsy'de 999). İşlenen yerler:
- İki hizmet ilanı + `etsy_upload.json`: yer tutucular dolduruldu (yalnız `[AUTO RENEW]` açık), `quantity: 999`.
- 20 tasarım `listing_v3.md` §0/§4/§11: fiyat **1,460 TL**, adet 999 (`[VERIFY]`: Etsy dijital ilanda adedi düşürüyor mu);
  `etsy_upload.py` `price_try: 1460` + `price_usd_approx`, 22 JSON yeniden üretildi.
- `config.ts`: `currency: 'TRY'`, 20 tasarım `'1460'`, hizmetler `'500'`/`'2960'`; `displayPrice` "1,460 TRY". `/pricing` Extras
  kartı fiyatı gösterir. Testler buna göre güncellendi (g082–g097 `[PRICE]` → `'1460'`, şema `priceCurrency: 'TRY'`,
  test_listing_kit, test_etsy_upload).
- Admin mesajları (JSON + docs/19 kopyası) ve Türkçe başlıkları; docs/23, K42, docs/20 §8, docs/15 §3 notu.
Açık: ek revizyonun Etsy'de satış biçimi (docs/23 §4.7), özel temayı tek alıcıya açma, linki değiştirmeden düzenleme, auto-renew,
Etsy hizmet politikası. Risk: özel tasarımda 3 günde ilk sürüm, tema üretiminin hemen başlamasını gerektirir.

### Güncelleme — ek revizyon ilanı (2026-10-16)
Kullanıcı: "ayrı extra revision ilanı aç, 500 TL". `collections/_services/extra-revision/package/listing/listing_v3.md` +
`etsy_upload.json`: "Extra Design Revision for Custom Wedding Website, One More Round of Changes, Add On for Our Custom Design Orders,
Digital" (121), 500 TL (≈ $10.09), 3 gün, adet 999; yalnız özel tasarım alıcıları için olduğu açıkça yazılı. `etsy_upload.py`
üç hizmeti tanır (+ test). Özel tasarım ilanı bu ilana yönlendirir. Yeni admin mesajı `custom_design_extra_round` (JSON + docs/19
kopyası + Türkçe başlık). docs/23 §4.7, docs/20 §3 (Services: üç ilan), K42 güncellendi.

## Günlük
- 2026-10-17 entegratör onayladı
