---
id: G970
baslik: Sosyal medya ilk ay — dikey açılış videoları ve 60+ gönderi dosyasının kompozisyonu
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [GM10]
yazar: [tools/sosyal_gonderi.py, tools/sosyal_gonderi/, tools/tests/test_sosyal_gonderi.py, brand/social/out/, gorevler/G970-sosyal-gonderi-uretimi.md]
---

## Amaç
`docs/35_SOSYAL_MEDYA.md` takvimindeki her gönderiyi yayına hazır dosya yapmak: `brand/social/out/<kod>/`
(Instagram 4:5 / 9:16, TikTok 9:16 MP4, Pinterest 2:3). Metin `brand/social/CAPTIONS.md`, takvim `brand/social/takvim.csv`.

## Girdiler
- GPT görselleri: `brand/social/gpt/` (GM10). Mevcut GPT sahneleri: `brand/trust/t2_guest_rsvp.png`, `t3_couple_editing.png`.
- Gerçek ekranlar: `tools/listing_templates/capture.ts` (yerel üretim derlemesi; `cd platform && npm run build`). Kapak
  kareleri: `collections/NN_*/package/listing/images_editorial/`.
- Birleştirme: `tools/mockup_compose.py` (#00FF00 → gerçek ekran), `tools/make_qr.py` (SM3.8 QR, hedef bkestudio.com).
- Yazı: HTML → PNG (Playwright, `tools/md_to_pdf.py` font indiricisi), Archivo / Montserrat / DM Sans; logo `brand/svg/`.

## Yapılacaklar
1. **Dikey açılış kaydı (R serisi):** 01–21 için 1080×1920 MP4, 10–15 sn, sessiz + sesli (R13) sürüm. Bugünkü
   `video.mp4`'ler 1080×1080 (Etsy) ve kayıt 390×844 DPR 1: Reels için düşük. DPR 3 kare dizisi ya da yüksek çözünürlüklü
   kayıt ile; ilk 2 sn'ye ekran yazısı (kanca, `CAPTIONS.md`), son kareye bkestudio.com. Üst %14 ve alt %20'ye yazı konmaz.
2. **Carousel ve tek görseller (K01–K10, T01–T04):** SM2 zeminleri + gerçek ekranlar + başlıklar; slayt planı
   `CAPTIONS.md`'de.
3. **Hikâyeler (S01–S15) ve öne çıkan kapakları:** SM2.4/SM2.5, SM1.
4. **Pinterest (60):** 21 tasarım pini, 21 video pini (R kaydından 2:3), 18 rehber/özellik pini (`CAPTIONS.md` § Pinterest).
   Pinterest kapak görseli: `brand/assets/gpt/final_s/brand_scene_wide_s.png` → 16:9 kırpım.
5. R17 katman videosu: `collections/01_Olive_Ivory/assets/gpt/parts/` parçalarıyla (yeni çizim yok).
6. Her gönderi klasörüne `caption.txt` (CAPTIONS.md'den) ve `meta.json` (platform, tarih, link + UTM, AI etiketi gerekir mi).

## Bitti sayılması için
- [ ] Takvimdeki her kod için `brand/social/out/<kod>/` dolu; ölçüler platform ölçüsünde.
- [ ] Gösterilen her ekran gerçek ekran; GPT'nin çizdiği ürün ekranı yok.
- [ ] docs/35 §6 kontrolü (yazım, kesilen yazı, arayüz güvenli alanı) bütün dosyalarda; claude-qa raporu.
- [ ] Hangi özellik gönderisinin canlıda denenmediği Sonuç'ta listeli (docs/35 §6 madde 1).

## Sonuç
