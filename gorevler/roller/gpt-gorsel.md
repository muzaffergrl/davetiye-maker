# Rol rehberi — `gpt-gorsel` (ChatGPT görsel üretimi)

**Görevin:** `GPT_PROMPTS.md` dosyalarındaki görselleri üretmek ve repoya doğru ad/yolla koymak.
**Kullanıcı kararı K21: tasarımcı sensin.** Paket 4'te sahneleri bitmiş tasarım olarak çizersin (T1) ve
aynı tasarımı parçalara bölersin (T2). Kalite çıtası: lüks, çok satan davetiye — düz vektör/clip-art değil.
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

## Kesin kurallar
- Görselde **yazı, harf, rakam, monogram, logo, filigran yok** (tek istisna: Paket 4 T1 comp'ları) (posta damgası, etiket, kitap kapağı dahil).
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
