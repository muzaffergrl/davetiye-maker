---
id: G148
baslik: Alıcı rehberi (Etsy'nin verdiği START HERE PDF'i) + ilan metinleri + 9. ilan görseli yeni erişim akışına (sipariş no + e-posta, her cihaz)
rol: claude-kod
durum: bitti
alan: claude-G148
oncelik: 1
bagimli: [G122, G123, G124, G146, G147]
yazar: [docs/19_ALICI_YOLCULUGU.md, docs/21_ILAN_GORSELLERI.md, tools/build_customer_guides.py, tools/build_service_guides.py, tools/etsy_upload.py, tools/listing_kit.py, tools/listing_editorial.py, tools/listing_editorial/capture_devices.ts, tools/listing_editorial/templates/09_devices.html, tools/tests/test_build_customer_guides.py, collections/*/package/customer/START_HERE.md, collections/*/package/customer/START_HERE.pdf, collections/*/package/listing/listing_v3.md, collections/*/package/listing/etsy_upload.json, collections/*/package/listing/images_editorial/09_devices.png, collections/0[1-5]_*/package/listing/listing_*.pdf, collections/_services/setup-service/, collections/_services/custom-design/, gorevler/G148-rehber-akis.md]
---

## Amaç
K46 (G146): Etsy'nin anında indirmesi herkese aynı PDF'i verir, PDF'te kişiye özel kod yok. Alıcı PDF'teki tasarım linkine/QR'ına
(`<base>/start?theme=<id>`, değişmedi) gider, **Etsy sipariş numarası** + e-postayı girer, editör açılır; **başka cihazda `<base>/my`**
("Create your website") + aynı sipariş no + e-posta. Hesap/şifre yok; özel düzenleme linki kolaylık. Rehber (21 satıştaki tasarım) ve
ilan metinleri buna göre; e-posta (SMTP kapalı) ve otomatik Etsy doğrulaması vaat edilmez. **Ek kapsam (K47, koordinatör):** 21 ilana
**9. görsel** "Start on your phone, continue on any device" (gerçek ekranlar, G124 editoryal düzeni); 21 Crimson satışta (1460 TL).

## Sonuç
**2026-10-17 · claude-G148 — durum: inceleme.** Dal `claude/g148-rehber-akis` (taban `claude/zealous-fermi-hy1o40`, `ce62d11` üstüne
yeniden kuruldu). Yayın/merge/PR yok; `platform/` koduna dokunulmadı (yalnız okundu, yerel `next build` + `next start` ile çekim).

### Yapılanlar
1. **START HERE kaynağı (docs/19 Ek A):** "Save your edit link: it is your key" bölümü kalktı → **Come back on any device** + çerçeveli
   **"Continue on another device"** kutusu (`{MY_URL}` tıklanabilir, satış sitesinde **Create your website**; /my'da **Open or start your
   website** → **Etsy order number** + **Email address** → **Continue**). İlk 5 adıma sipariş numarasının yeri (Etsy → You → Purchases and
   reviews; onay e-postasında "Order #…"); düzenleme linki "kısayol"; Share → **Use on another device** / **Sign out other devices**;
   e-posta alanı artık "we do not send emails yet" demiyor (SMTP açılınca da doğru) ve e-posta vaat etmiyor; Quick answers (eş, bilgisayar /
   birden çok telefon) ve Troubleshooting ("This edit link no longer works" → **Continue with your order number**; "This order already has a
   website" → `/my`; yeni "My order number and email do not open my editor"). "Message us on Etsy" yalnız son çare. "We are confirming your
   Etsy order" bölümü `manual` modda doğru olduğu için kaldı. Yeni yer tutucu `{MY_URL}` = `<base>/my`.
2. **`tools/build_customer_guides.py`:** `{MY_URL}`; `> ` satırları = tek çerçeveli kutu (kâğıt zemin, altın çerçeve, metin sütunu
   genişliğinde); etiket denetimine `platform/components/my` ve `components/marketing/Shell.tsx`; PDF linkleri artık başlat linki + `/my`
   (en az bir kez, zorunlu) + gizlilik metni, başka link yok; kutu başlığı `NOT_LABELS`'ta. 21 rehber yeniden üretildi: **hepsi 9 sayfa**
   (son sayfa ~1.900 karakter, yer var), jsQR her sayfada tek QR = başlat linki, QR dosyaları bayt bayt aynı (değişmedi).
   Görsel kontrol: 01, 06, 13 sayfaları PNG'ye çevrilip bakıldı (kutu hizası düzeltildi: 504 pt).
3. **İlan metinleri (21 `listing_v3.md` + `etsy_upload.json`):** GOOD TO KNOW'da edit-link uyarısı yerine tek dürüst satır: *"Your Etsy order
   number is your key: with it and your email, your editor opens right away, and again on any phone or computer to continue where you left off.
   No account or password."*; WHAT YOU NEED'de sipariş numarasının yeri; SSS (hesap/şifre, kayıp link → "Create your website" sayfası);
   §8 iki Etsy otomatik mesajı (`/my` ile devam; "SAVE YOUR EDIT LINK … cannot email" kalktı); §0 "Edit link by email" ve START HERE satırları;
   §11'e "G146 canlı + START HERE yeniden denetlendi" maddesi. docs/19 §4.1/§4.3/§4.4 iskeleti aynı cümlelerle. 01–05'in ilan PDF'leri
   (`listing_kit.py pdf`) yeniden kuruldu.
4. **21 Crimson (K47):** §0 satış durumu/fiyat, §4 fiyat, §10, §11 "satışta, 1460" olarak güncellendi; rehber ve metin diğerleriyle aynı akış.
5. **Ek hizmetler:** setup-service ilanı + `SETUP_SERVICE.pdf` ("başladıysanız yeni link, eskisi çalışmaz" G145'ten beri yanlıştı → aynı site,
   linkiniz ve sipariş no + e-postanız çalışmaya devam eder; hazır olunca Etsy'den haber), custom-design ilanı + `CUSTOM_DESIGN.pdf` (sonra
   aynı sipariş no + e-postayla her cihazdan). `build_service_guides.py` denetimi yeşil (EXTRA_REVISION değişmedi).
6. **9. ilan görseli `09_devices.png` (21 tasarım):** `tools/listing_editorial/capture_devices.ts` — yerel production build, gerçek akış:
   bilgisayar /start'ta siteyi başlatır + /my; Android /my; iPhone /my'ı doldurur (**m01**) → Continue → editör → Share → Use on another device
   (**m02**, 3 cihaz, "This device"). Cihaz adları betiğin verdiği user agent'lardan (Chromium çiziyor); sipariş/e-posta kurgu. Web adresi/QR
   yok: kartın /my satırı, QR satırı ve üstteki Share kartları resimde gizli, denetim betikte. Düzen 5. görselin aynısı (kâğıt, iki ekran,
   tasarımın paleti/dokusu, Cormorant + Montserrat); yeni şekil/dekor yok (K21). `listing_kit.UPLOAD_IMAGES`'e eklendi; `listing_editorial.py
   --capture devices --only 09_devices`; §5'e satır + alt metin + not, §0'a satır; "önerilen ek görsel" artık tek boşluk (Etsy 10).
7. **Taban hatası düzeltildi:** G144 `designs.ts`'te `opening: msg('…')` yazınca `etsy_upload.py` / `listing_kit.py` açılış cümlesini
   bulamıyordu (`--check` ve rehber testi kırmızıydı); regex `msg(` kabul ediyor.

### Kontroller (2026-10-17, son koşu)
- `python3 tools/build_customer_guides.py` (+ `--check`): **21/21 OK, 9 sayfa**, jsQR (platform `node_modules/jsqr`, node 22) PNG'lerde ve
  her PDF sayfasında tek QR = başlat linki; PDF linkleri yalnız başlat + `/my` + gizlilik; kalın etiketler ve tırnaklı metinler kaynakta bulundu.
- `python3 tools/etsy_upload.py --check --strict`: **çıkış 0**; 21 tasarım başlık ≤ 140 (100–117), 13 etiket ≤ 20, görseller **9/9**, video,
  rehber; 3 hizmet OK. `etsy_upload.json` 21 + 2 hizmet yeniden üretildi.
- `python3 tools/build_service_guides.py --check`: 3/3 OK.
- `python3 -m pytest tools/tests -q`: **43 geçti, 20 hata** — 20'si de betik biçimli testlerin pytest fikstürü bulamaması (`t`, `tmp`, `k`;
  bu testler kendi `main()`'leriyle koşuyor, değişiklikten bağımsız). Aynı dosyalar betik olarak: `test_build_customer_guides`,
  `test_listing_kit`, `test_listing_editorial`, `test_etsy_upload`, `test_kit_check`, `test_md_to_pdf`, `test_mockup_compose`,
  `test_parts_prep`, `test_parts_prep_paket5` → **hepsi ok**.
- 9. görsel: 21 çekimde 8/8 PASS (3 giriş, /my tek ekranda, 3 cihaz + "This device", resimde web adresi/QR yok, liste + Sign out tek
  ekranda); 21 görsel 2000 × 2000, gözle bakıldı (01, 04, 06 yan yana 5. görselle; 21'in kontakt sayfası).
- Yerel build: `platform/node_modules` ana checkout'tan sabit bağ (aynı package-lock), `npm run build` + trace-check yeşil; iş sonunda
  `.next` ve bağlar silindi.

### Açık kalan / platform işi (bu görevin yazma alanı dışında)
- `/start` sonuç ekranı hâlâ **"Save this link — It is the only way to open your editor"** diyor (`platform/app/start/StartForm.tsx`); rehber
  bunu alıntılamıyor ama ekran G146 akışıyla çelişiyor → "the quickest way back; your order number + email also work on any device" gibi.
- Admin mesaj şablonları (`platform/lib/admin/message-templates.json` + docs/19 §4.5 kopyası, testli): `welcome_start`, `new_edit_link`,
  `order_already_used`, `setup_service_done_same_link` eski kayıp-link yolunu anlatıyor; `/my` + sipariş no + e-posta eklenmeli.
- Rehber ve 9. görsel G146'yı anlatıyor: canlıya çıkmadan (sonraki deploy) PDF'ler Etsy'ye yüklenmemeli; sonra `build_customer_guides.py --check`.
- Gerçek telefon denemesi, canlı `/my` denemesi yok.

## Günlük
- 2026-10-17 entegratör onayladı
