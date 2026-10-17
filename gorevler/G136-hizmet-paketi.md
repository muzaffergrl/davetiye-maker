---
id: G136
baslik: Ek hizmet ilanları — görseller (3 × 4) ve Etsy teslim PDF'leri (SETUP_SERVICE, CUSTOM_DESIGN, EXTRA_REVISION)
rol: claude-kod
durum: bitti
alan: claude-G136
oncelik: 1
bagimli: [G130, G131]
yazar: [tools/listing_services.py, tools/build_service_guides.py, tools/etsy_upload.py, collections/_services/setup-service/package/, collections/_services/custom-design/package/, collections/_services/extra-revision/package/, docs/23_EK_HIZMETLER.md, gorevler/G136-hizmet-paketi.md]
---

## Amaç
G130'un üç hizmet ilanı (kurulum 500 TL, özel tasarım 2.960 TL, ek revizyon 500 TL; K42) `etsy_upload.py --check --strict`'te
"images 0/4 · file no" diye kalıyordu. Her ilana listing_v3 §5'teki görseller ve Etsy'nin teslim ettiği dosya. Platform koduna
dokunulmaz; Etsy'ye bir şey yüklenmez.

## Girdiler
`collections/_services/*/package/listing/listing_v3.md` (§2 açıklama, §5 görsel listesi), `docs/23_EK_HIZMETLER.md`,
`platform/lib/admin/message-templates.json` (`setup_service_details`, `custom_design_brief`, `custom_design_extra_round`),
`brand/trust/` (GM06), `brand/svg/bke-logo-horizontal-anchor.svg` (G129), `tools/listing_editorial.py` + `templates/editorial.css`,
`tools/build_customer_guides.py` (reportlab yaklaşımı).

## Yapılacaklar
1. 3 × 4 ilan görseli, 2000 × 2000, editoryal setin dili; GM06 sahneleri + gerçek ekranlar + S logo; fiyat/QR/web adresi yok.
2. Üç teslim PDF'i (İngilizce, 1–2 sayfa): ne alındı, sıradaki adım (admin mesajındaki listeyle aynı), süre, revizyon, iade yok +
   düzeltiriz, destek.
3. `etsy_upload.py` + `--check --strict` çıkış 0; `test_etsy_upload.py` yeşil.

## Bitti sayılması için
- [x] 12 görsel `images_editorial/` altında, gözle bakıldı
- [x] 3 PDF `package/customer/` altında, sayfaları görüntüye çevrilip bakıldı; `build_service_guides.py --check` 3/3
- [x] `etsy_upload.py --check --strict` çıkış 0 (3 hizmet + 20 tasarım, 23/23); `test_etsy_upload.py` 7/7
- [ ] Yayından önce: Etsy'nin hizmet ilanı politikası (`[VERIFY]`), otomatik yenileme kararı (değişmedi)

## Sonuç
**2026-10-17 · claude-G136 — durum: inceleme.** Dal `g136-hizmet-paketi` (taban `origin/main` `8d51815`). Push yok.

**Görseller (12).** `tools/listing_services.py` (yeni): `listing_editorial`'ın `place`/`render`'ı ve `editorial.css` (Cormorant
Garamond + Montserrat, çizgi, yıkama, çıplak ekran) marka paletiyle (`brand/tokens.json`). Çizim yok (K21): GM06 sahneleri (t1 üç
telefon, t3 çift, t6 masa), yerel production build'den gerçek ekranlar (Olive & Ivory editörü/sitesi `capture.ts`; 7 hazır
tasarımın kapalı açılışı `capture_opening.ts --at 0`), S logo.
- Kurulum: kapak (t3, telefonda bitmiş site), 4 adım + editör önizlemesi, "What we enter" (Day & place, foto kırpma, RSVP
  soruları, başlık/etiket ekranları), "Good to know" + editör.
- Özel tasarım: kapak (t1'de lavanta kese / Art Deco gatefold / sahil zarfı, "Shown: openings from our ready designs"), t6 + 4 adım,
  "What's included" + Olive & Ivory sayfaları ("Shown: our Olive & Ivory design"), açılış örnekleri (zarf, gatefold, kitap, cüzdan).
- Ek revizyon: kapak (t6), 3 adım; listing §5'te 2 görsel vardı, diğerleriyle eşit olsun diye **03_one_round** (bir tur neyi
  kapsar + editörde ücretsiz olanlar) ve **04_good_to_know** eklendi (§5'e satır + alt metin).
- Hiçbirinde fiyat, QR, web adresi yok. Ekran görüntüleri depo dışında (`--shots-root`, `--capture` yeniden alır).

**PDF'ler (3).** `tools/build_service_guides.py` (yeni): reportlab, US Letter, standart Helvetica (font gömülmez), START HERE'ın
mürekkep/altın/kâğıt ve alt bilgisi, logo Chromium ile rasterize. "Ne göndereceksiniz" listesi admin mesajından kelimesi kelimesine
okunur (kurulumda `{order}` → "if you bought it in a separate order"). `--check`: 1–2 sayfa, liste maddeleri PDF'te, "within 3
days", "No returns", "we will fix it", e-posta, tek link `mailto:bkestudio@gmail.com`, yer tutucu yok. SETUP_SERVICE 2 sayfa,
CUSTOM_DESIGN 2 sayfa, EXTRA_REVISION 1 sayfa.

**Diğer.** `etsy_upload.py`: hizmet görsellerinin `status`'u kendi satırı (`SERVICE_IMAGES_STATUS`; tasarımların editoryal set
cümlesi hizmetlere yanlış düşüyordu); üç `etsy_upload.json` yenilendi (images 4/4 · file yes). listing_v3 §0/§4/§5/§10 ve docs/23 §6
güncel.

**Açık kalan.** Özel tasarım PDF'i ve ilanı "start link" adımını anlatıyor; özel temayı tek alıcıya açma yolu hâlâ yok (docs/23 §4.4,
G130'dan beri açık). Etsy hizmet politikası `[VERIFY]` ve otomatik yenileme kararı değişmedi.

## Günlük
- 2026-10-17 entegratör onayladı
