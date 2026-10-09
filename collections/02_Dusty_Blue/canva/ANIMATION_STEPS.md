# Canva'da animasyon kurulumu — Dusty Blue video master

Tasarım: **DAHXgy2GM3s** · https://www.canva.com/d/1TpsKpaHmHzT3Bw (master edit — alıcıya verilmez)

Canva aracı (API) öğe animasyonu ve zaman çizelgesi ayarlayamıyor; bu adımlar Canva
arayüzünde **bir kez** master üzerinde yapılır. Template link ile alıcıya giden kopyalarda
animasyonlar korunur (satış öncesi bir alıcı kopyasında doğrulanacak).

Canva yöntemi (Canva Help Center, 2026-10-09):
- Öğeyi seç → üst araç çubuğunda **Animate** → bir animasyon seç (veya özel animasyon oluştur).
- Zamanlama: sayfa küçük resmindeki **kalem simgesi** → Video Timeline → öğe çubuğunun
  kenarlarını sürükleyerek giriş/çıkış anını ayarla.

Not: Animasyon adları Canva arayüzünde değişebilir; aşağıdakiler önerilen etkilerdir.

## Sayfa süreleri ve geçişler
| Sayfa | Sahne | Süre | Sonraki sayfaya geçiş |
|---|---|---|---|
| 1 | Kapalı zarf | 4.0 sn | Dissolve (yumuşak çözülme) — kapak açılıyormuş hissi |
| 2 | Açılmış zarf, kart yükselmiş | 4.0 sn | Fade |
| 3 | Our Story (3 polaroid) | 5.0 sn | Fade |
| 4 | Davet kartı | 5.5 sn | Fade |
| 5 | The Celebration | 4.5 sn | Fade |
| 6 | Kindly Reply | 5.0 sn | — |
Toplam ≈ 28 sn.

## Öğe animasyonları
**Sayfa 1**
- "A LOVE LETTER FROM" + "Eleanor & Theo": Rise/Fade, 0.4 sn ve 0.7 sn gecikmeyle.
- Zarf parçaları (arka, cep, kapak): birlikte seçip **Group** → Rise (yavaş).
- Mühür + "E&T": birlikte grupla → 2. saniyede hafif Pop/Breathe; sayfa sonunda çıkış: Fade.
- "a letter for you…": Fade, 1.5 sn'den itibaren.

**Sayfa 2**
- Kart grubu (kart + foto + "We're getting married" + tarih): **Rise** — kart zarfın içinden
  yükselir. Kart grubu katman sırasında **cebin arkasında** kalmalı (cep önde).
- Açık astar: Fade (0.0–0.4 sn).
- "and you are warmly invited": Fade, 1.5 sn.

**Sayfa 3**
- Başlık ve alt başlık: Rise.
- Üç polaroid grubu: sırayla **Pop/Tumble**, 0.6 sn arayla (1 → 2 → 3).

**Sayfa 4**
- Kart: Fade. Metinler yukarıdan aşağı sırayla Rise: aileler → Eleanor Grace → & → Theodore James →
  davet cümlesi → tarih kutusu → mekân (0.3–0.4 sn arayla).

**Sayfa 5**
- Başlık Rise; üç program satırı (saat + ad + yer) satır satır Rise; Attire en son.

**Sayfa 6**
- "Kindly Reply" Rise → tarih Fade → buton (şekil + yazı grubu) Pop → web notu Fade →
  mühür grubu Breathe → kapanış cümlesi Rise.

## Kontrol
- Share → Download → MP4 Video ile export al; telefonda izle: metinler okunuyor mu, polaroidler
  sırayla mı geliyor, kart cebin arkasından mı çıkıyor?
- Sonucu `COLLECTION_STATUS.md` A1 satırına yaz.
