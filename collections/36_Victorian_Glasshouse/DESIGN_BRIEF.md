# Tasarım 36 — Victorian Glasshouse · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (3. dalga 33–38, satır 36; K23 sıkı: ilk sayfa kapalı **zarf**) + G185 (platform
teması, GPT parçalarından önce kuruldu). Katalog: `tools/katalog.py` `EK_TEMALAR` (6 eksen + hareket imzası; `kontrol`
D'nin 20 tasarımına ve dalganın eksenli kayıtlarına karşı ≥ 4 eksen farkını denetler). Çalışma adı marka değildir.

**Ruh:** alacakaranlıkta bir Viktorya serası — dökme demir kemerler, eğrelti otları, orkideler, buğulu cam; bir saksı
tezgâhında kraft bir tohum paketi, jüt sicimle bağlı, düğümünde bakır bir bitki etiketi. Klasik, romantik, zengin; geniş
beğeni. Botanik gravürün inceliği + fotogerçekçi cam ve metal.

| Eksen | Bu tasarım |
|---|---|
| Kapalı zarf / açılış | Kraft tohum paketi zarfı (dikdörtgen, üstte düz kapak — V kapak ve mum mühür yok), ortadan jüt sicimle bağlı, düğümde bakır bitki etiketi (çiftin monogramı platform alanından basılır); dokununca etiket düğümünde sallanır ve dönerek düşer, sicim düğümden ikiye ayrılır (üst yarı yukarı, alt yarı aşağı), kapak menteşesinden yukarı ve **arkaya** katlanır, sıcak hava camı buğulandırır, kart paketten buğunun ardında yükselir, buğu yumuşak kenarlı bir maskeyle ekranda soldan sağa silinir ve eğrelti otları görünür, demir kemerler süzülür (paralaks), kart öne gelir → home |
| Fotoğraf sunumu | Cam altında herbaryum numuneleri: 4:5 fotoğraf cam vitrinde (GPT), camdaki buğu bir yandan silinerek açılır, cam üstünden ışık bandı geçer, bakır numara etiketi (01–03) ipinde sallanıp durulur, altta herbaryum etiketinde yazı "yazılır"; telefonda sol–sağ–sol |
| Dekor ailesi | Dökme demir kemerler, eğrelti otu, orkide, bakır etiketler, cam buğusu |
| Teknik | botanik gravür + fotogerçekçi cam |
| Font | Monsieur La Doulaise (isimler, başlıklar) + Old Standard TT (gövde, etiketler, büyük harf satırlar) — Google Fonts, pakete konmaz; 01–32'de yok (docs/24'ün "Bodoni Moda"sı 14 ve 23'te kullanıldığı için seçilmedi) |
| Ana palet | deep fern `#1C3328` · fern `#2F523E` · misted glass `#E2EAE3` · herbarium paper `#F3EDDF` · kraft `#AC8054` · copper `#B26A3C` · copper light `#D99A68` · verdigris `#6F9E8E` · ink `#1E2B24` |
| Hareket imzası | buğunun silinmesi (maske; açılışta tüm ekranda, iç sayfalarda her foto camında) · demir kemerlerin paralaksı (kaydırmada katman katman) · etiketlerin sallanması (açılışta düğümde, story'de numaralar, programda satır satır, imzada monogram, RSVP gönderilince) · metin adımları buğudan netleşir (bulanıktan yerinde odaklanır) |

**Diğerlerinden ayrım:** 01–21'in V kapaklı, mum mühürlü zarfı değil (düz kapak arkaya katlanır, kapanış sicim + bakır
etiket). 09 Lavender'ın jüt bağlı keten kesesi değil (kraft tohum paketi, kese gevşemez; kapak katlanır, buğu silinir).
08 Winter'ın kırağılı pencereleri değil (kırağı deseni yok; sıcak sera buğusu, yumuşak kenarlı silme; eğrelti/orkide).
13 Enchanted Forest'ın ormanı ve ateş böcekleri değil (sera içi, cam, demir; ateş böceği yok). 18 Wildflower'ın vellum
kılıfı ve renkli kır çiçekleri değil. 29 Celestial'ın pirinç aletleri değil (bakır bitki etiketleri, botanik).

## Sayfalar
- **index:** sera zemininde (koyu eğrelti) "Together with their families" + "invite you to celebrate their wedding" ve
  isimler, ortada bağlı tohum paketi (bakır etikette monogram), altta tarih · şehir ve "Tap to open", köşede Skip.
- **home:** demir kemerler altında (paralaks) herbaryum kartı: cam altında portre (buğu silinir, ışık bandı), isimler,
  tarih, mekân → davet ("Grown with love", orkide dalı, tam adlar, tarih bloğu, mekân, RSVP, geri sayım, takvim) → numune
  tanıtımı (sallanan bakır "01" etiketi) → buğulu camda gün → imza (sallanan monogram etiketi, isimler, replay).
- **story:** üç numune (sol–sağ–sol): buğu silinir, ışık bandı geçer, etiket sallanır, yazı herbaryum etiketine yazılır.
- **details:** herbaryum kâğıdında program (her satırda sırayla sallanan küçük bakır etiket), buğusu açılan mekân
  fotoğrafı, harita, takvim, kıyafet, bloklar, travel, menü, registry, SSS.
- **rsvp:** buğulu camda başlık, herbaryum kâğıdında ortak form; gönderince imza etiketi yeniden sallanır, GPT
  yaprakçıklarıyla birkaç eğrelti yaprağı süzülür.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Flora & Edmund, The Fernhill Glasshouse (kurgu), Columbus, Ohio, June 19,
  2027; URL'ler `null`; örnek fotoğraf yok — PAKET 2 bekliyor; demo pini Columbus)
- GPT: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 website katmanları W3.1–W3.16, PAKET 2 örnek fotoğraflar, PAKET 6 basılı
  davetiye); kuru prova şekli `assets/gpt/kuru_sekil.json`
- Tema: `platform/themes/victorian-glasshouse/` (README: açılış, geçici parçalar, sapmalar)
- İlan taslağı: `package/listing/listing_v3.md` (K41: yayımlanmadı)
