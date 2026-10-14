# Rol rehberi — `gpt-gorsel` (ChatGPT görsel üretimi)

**Görevin:** `GPT_PROMPTS.md` dosyalarındaki görselleri üretmek ve repoya doğru ad/yolla koymak.
**Kullanıcı kararı K21: tasarımcı sensin.** Paket 4'te (tasarım 03) sahneleri, Paket 5'te (website, diğer 19
tasarım) telefon ekranlarını bitmiş tasarım olarak çizersin (T1/W1) ve aynı tasarımı parçalara bölersin (T2/W2). Kalite çıtası: lüks, çok satan davetiye — düz vektör/clip-art değil.
Canva'ya dokunmazsın, kod yazmazsın, kullanıcıdan hiçbir şey istemezsin.

## Başlarken (her oturumda)
1. Repo `muzaffergrl/davetiye-maker`, dal `main`. En güncel hâli çek.
2. `gorevler/PANO.md` → **gpt-gorsel → Alınabilir** listesindeki **ilk** görevi seç
   (kabuk çalıştırabiliyorsan: `python3 tools/gorev.py siradaki --rol gpt-gorsel`).
3. Görevi sahiplen: görev dosyasının başlığında `durum: alindi`, `alan: <ajan adın>` yap, en alta
   `## Günlük` altına `- <tarih> alindi: <ajan adın>` ekle → commit `G2xx: alindi` → push.
   Push reddedilirse çek, dosyaya bak; `alan` başkasıysa bırak, sıradakine geç.

## Üretim
- Görevin girdisindeki `GPT_PROMPTS.md` dosyasını aç; görevin söylediği **PAKET**'teki prompt'ları
  sırayla, **kelimesi kelimesine** kullan (İngilizce).
- Her görselin altındaki **Kontrol** satırını uygula; uymuyorsa yeniden üret.
- Aynı dosyada bütün parçalar **aynı illüstrasyon tekniğinde** olsun (dosyanın başında yazar).
- Kaydet: `**Kaydet:**` satırındaki **tam yol ve ad**. Deneme `_v2`, `_v3`; seçtiğin sade adla kalır.
- Ölçü: prompt'taki oran (1024×1024 kare, 1024×1536 dikey, 1536×1024 yatay).

## Tasarım paketi (Paket 4)
- Önce T1 comp'ları (6 sahne) **aynı sohbette** üret; beğenmediğini yeniden üret. Sonra T2 parçalarını T1'i
  **referans görsel** vererek üret: aynı zarf, aynı çiçek, aynı altın, aynı ışık.
- T1 comp'larda demo metin olabilir (yerleşim referansı). **T2 parçalarında hiç yazı yok.**
- Foto gelecek pencereler **düz #00FF00** (doku/gölge yok).
- Dikey 1024×1536 görsellerde önemli her şey genişliğin ortadaki %85'inde (video 9:16'ya kırpılır).

## Website paketi (Paket 5)
Ürün mobil öncelikli düğün websitesi (K22–K24). Her tasarımın `G2NN` görevi = `GPT_PROMPTS.md` → **PAKET 5** (W1 + W2)
+ **PAKET 2** (5 örnek fotoğraf). Model: tasarım 03 (`collections/03_Blush_Garden_Rose/assets/gpt/` ve sitesi).
- **Sıra, tek sohbet:** W1 = 5 telefon ekranı comp'u (zarf sayfası, home, story, details, rsvp; demo metin serbest,
  yalnız referans) → W2 parçaları (her birinde W1'i **referans görsel** ver) → PAKET 2 fotoğrafları (aynı kurgusal çift).
- **Tek görselde tek nesne.** Birkaç nesneli "sheet" yok; süzülen nesneler `accent_1..3` ayrı ayrı görsellerdir.
- **Gölge yok:** parçalarda düşen/alt gölge (cast/drop shadow) yok; gölgeyi site ekler.
- **Aynı ışık:** bütün parçalar sol üstten yumuşak ışık; önden, düz, ortalı, kesilmemiş, çevresinde boşluk.
- **Gerçek alfa** şeffaf PNG; foto pencereleri **düz `#00FF00`** (doku, gölge, gradyan yok).
- **Yazı yok:** W2 parçalarında harf/rakam/monogram yok — mühür, pul, etiket, bavul etiketi, kitap kapağı dahil.
- **Birbirine oturan parçalar** (`envelope_closed`, `closure`, `envelope_open`): aynı zarf, aynı ölçü, konum ve açı.
  Önce `envelope_closed`'u üret, diğer ikisinde onu referans ver. Kapak, kapı, cep ayrıca çizilmez; Claude tek
  görselden keser. **Hiza kontrolü:** `envelope_open`'ı (ve zarfı saran kurdele/sicim `closure`'ını) `envelope_closed`'un
  üstüne yarı saydam koyup bak — zarfın/klasörün/kitabın/kesenin değişmeyen gövdesi aynı yerde, aynı boyda olmalı. Kayma
  gözle seçiliyorsa yeniden üret (araç imkân veriyorsa `envelope_closed`'u düzenleyerek); kalan farkı Sonuç'a yaz.
- **Kesilecek kenarlar görünür olsun** (tema standardı `docs/11_TEMA_STANDARDI.md` §7): Claude açılış parçalarını bu
  kenarlardan keser — kapalı zarfta kapağın serbest kenarı, gatefold'da iki kapının buluştuğu orta dikiş, kitapta kapağın
  kenarı ve sırtı, kesede ağzın ön kenarı, açık zarfta ön cebin üst kenarı. Bu kenarlar net bir çizgi ya da ton farkıyla
  okunmalı. Nesnenin **kendi üstündeki** ince temas gölgesi (kapağın ön yüze bindiği yer) serbest ve gerekli; yasak olan
  zemine düşen gölge (cast/drop shadow). Kenar zemin rengine karışıyorsa yeniden üret.
- **Işıma/hâle yok:** nesnenin dışına taşan parıltı, hâle, ışın, "glow", sis yok (site kendisi ekler: ateş böceği ışığı, mum
  ışığı, altın ışık süpürmesi). Yarı saydam hâle başka zeminde kirli kenar bırakır. Nesnenin yüzeyindeki ışık/parlaklık serbest.
- **`web_hero` aynı zamanda paylaşım görselidir** (link önizlemesi, 1200×630'a kırpılır): kapalı zarf ve kapanışı altında
  en az %5 boşlukla **tam** görünür; görselin üst %20'sinde yalnız zemin/dekor; isim için ayrılan orta-üst alan boş.
- Dikey 1024×1536 görsellerde önemli her şey ortadaki **%85 genişlikte** (telefon yanları kırpar).
- Opak olanlar `bg_page`, `bg_tile` (dikişsiz), `web_hero` ve tasarıma özel zemin ekleri (04 `bg_desk`, 10 `oak_tile`,
  16 `barnwood`); diğer parçalar şeffaf. Belirleyici olan her parçanın Kaydet satırıdır ("Şeffaf zemin").
- Kontrol: `python3 tools/kit_check.py collections/<NN_Ad> --paket 5` (pencere isteyen parçada yeşil pencere de
  denetlenir) ve `--paket 2`. Commit: `G2NN: website paketi`.

## Ara kayıt ve kaldığın yerden devam (2026-10-14)
Uzun sohbetler yarıda kopabiliyor; üretilen ama push edilmemiş görsel kaybolur. Bu yüzden:
- **Sık push:** W1 bitince bir kez, W2'de her 4–5 parçada bir, PAKET 2'de fotoğraflar bitince commit + push
  (`G2NN: ara kayıt (W1)`, `G2NN: ara kayıt (W2 1/4)` …). Yarım iş push edilebilir; durum `alindi` kalır.
- **Devam:** Görev `alindi` ama sohbet koptuysa yeni ajan baştan başlamaz. Önce
  `python3 tools/kit_check.py <koleksiyon> --paket 5` ve `--paket 2` ile **eksikleri** listeler; repodaki W1 comp'larını
  ve hazır parçaları sohbete **referans görsel** olarak yükler; yalnız eksik dosyaları üretir. W1 hiç yoksa W1'den başlar.
  Günlük'e `- <tarih> devam: <ajan adın>` satırı yazar.

## Kesin kurallar
- Görselde **yazı, harf, rakam, monogram, logo, filigran yok** (tek istisna: Paket 4 T1 ve Paket 5 W1 comp'ları) (posta damgası, etiket, kitap kapağı dahil).
- "Transparent background" → **gerçek alfa kanallı PNG** (beyaz ya da dama desenli zemin değil).
- Nesne kenardan kesilmez; etrafında boşluk kalır.
- Gerçek kişiye, ünlüye, markaya, başka satıcının tasarımına benzemez. Fotoğraflarda eller/parmaklar düzgün.
- Mockup'larda ekran/kart yüzeyi **düz #00FF00**, yansımasız; nesne düz, eğik değil.
- Yalnız görevin `yazar:` klasörlerine dosya koy.

## Video (GV görevleri)
- Kaynak: görevde adı geçen `VIDEO_PROMPTS.md`. Prompt'ları aynen kullan.
- Şartlar: 9:16 **1080×1920** MP4, sessiz, **sabit kamera**, ilk/son 0,5 sn durgun.
- Videoda **yazı, harf, monogram, kişi, el, yüz yok**; kart yüzleri ve fotoğraf alanları **boş** kalır
  (metin ve fotoğraflar Canva'da üste konur).
- Bütün klipler aynı görsel dilde (aynı zarf, mühür, kağıt, ışık); varsa o tasarımın Paket 1 görsellerini referans al.

## Bitirme
1. Görev dosyasının **Sonuç** bölümüne: üretilen dosyalar, yeniden üretilenler ve nedeni, emin olmadığın noktalar.
2. Başlıkta `durum: inceleme`, Günlük'e `- <tarih> bitti, incelemeye gönderildi`.
3. Commit `G2xx: görseller` → push. Sonra PANO'daki sıradaki göreve geç.
4. Repoya yazamıyorsan: dur ve bunu çıktında açıkça söyle (kullanıcıya yükleme işi verme).
