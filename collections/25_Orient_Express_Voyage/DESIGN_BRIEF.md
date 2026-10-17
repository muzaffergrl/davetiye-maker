# Tasarım 25 — Orient Express Voyage · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (yeni dalga 23–28) + G163 (platform teması). Katalogda `tools/katalog.py` →
`EK_TEMALAR` (eksenler + hareket imzası; `kontrol` D'deki 20 tasarıma ve dalganın diğer kayıtlarına karşı ayırt eder).
04 Vintage Airmail (hava postası zarfı, pullar) ve 12 Tropical (beyaz seyahat cüzdanı, palmiye) ile karışmasın diye:
deri **tren bileti cüzdanı**, kitap gibi soldan açılan kapak, bilet yukarı kayar; dekor posta değil **demiryolu** (pirinç,
bagaj etiketi, harita, istasyon saati); teknik **litografi seyahat afişi**; palet **şişe yeşili + pirinç**.

**Ruh:** 1930'ların lüks yataklı treni; birinci sınıf bir yolculuk gibi düğün. Klasik, romantik, zengin.

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Şişe yeşili deri bilet cüzdanı, pirinç tokalı kayış. Dokununca kayış çözülür (toka sağa, kuyruk sola), kapak sol menteşesinde 180° açılır (iç yüzü ayrı parça), açık cüzdan ekrana sığacak şekilde ortalanır, birinci sınıf bilet cepten yukarı kayar, öne ve ortaya gelir → home (view transition) |
| Fotoğraf sunumu | Vagon penceresi çerçeveleri (3:4); kaydırınca fotoğraf camın ardından manzara gibi yana kayar |
| Dekor ailesi | Pirinç vagon detayları, bagaj etiketi, eski harita, istasyon saati, biniş kartı, damga |
| Teknik | vintage seyahat afişi (litografi) |
| Font | Limelight (başlık) + Cormorant Garamond (metin) — Google Fonts, pakete konmaz |
| Ana palet | bottle green `#1E3A2C` · deep `#11241B` · brass `#B8914B` · light brass `#D8BD84` · ivory `#F3EBD9` · route red `#8C2F39` |
| Hareket imzası | Haritada rota çizgisi kaydırmayla çizilir (CSS scroll-driven, JS yedeği; çizgi GPT haritası üstünde arayüz yolu), istasyonlar (program satırları) tek tek gelir, bagaj etiketi ipinde sallanır, RSVP biniş kartına gönderimde damga basılır |

## Sayfalar
- **index:** istasyon gecesi, "All aboard", isimler, kapalı cüzdan, "Tap to unbuckle".
- **home:** afiş (isimler gökyüzünde) → davet + portre + sallanan bagaj etiketi (RSVP + son tarih) → kalkış panosu (saat +
  geri sayım) → yolculuk (harita + çizilen rota + ilk 4 istasyon) → vagon penceresi (story_1) → imza.
- **story:** yeşil vagon paneli üstünde 3 pencere, manzara gibi kayan fotoğraflar, başlıklar.
- **details ("The itinerary"):** harita yapışkan, istasyonlar kaydıkça tek tek gelir, rota son istasyona kadar çizilir; son
  durak (mekân), harita bloğu, kıyafet, bloklar, travel, menü, registry, SSS.
- **rsvp:** biniş kartı (3 dilim) üstünde ortak form; gönderimde damga.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Amelia & Rafael, Palazzo Ferrovia, Venice; US tarih; URL'ler null; foto yok)
- GPT: `assets/gpt/GPT_PROMPTS.md` (PAKET 5: 16 parça, PAKET 2: 5 foto, PAKET 6: basılı ön/arka 5×7 + A5)
- Tema: `platform/themes/orient-express-voyage/` (README: açılış, geçici parçalar, sapmalar)
- Etsy taslağı: `package/listing/listing_v3.md` (yayınlanmadı, K41)
