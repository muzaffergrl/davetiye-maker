# Rol rehberi — `gpt-gorsel` (ChatGPT görsel üretimi)

**Görevin:** `GPT_PROMPTS.md` dosyalarındaki görselleri üretmek ve repoya doğru ad/yolla koymak.
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

## Kesin kurallar
- Görselde **yazı, harf, rakam, monogram, logo, filigran yok** (posta damgası, etiket, kitap kapağı dahil).
- "Transparent background" → **gerçek alfa kanallı PNG** (beyaz ya da dama desenli zemin değil).
- Nesne kenardan kesilmez; etrafında boşluk kalır.
- Gerçek kişiye, ünlüye, markaya, başka satıcının tasarımına benzemez. Fotoğraflarda eller/parmaklar düzgün.
- Mockup'larda ekran/kart yüzeyi **düz #00FF00**, yansımasız; nesne düz, eğik değil.
- Yalnız görevin `yazar:` klasörlerine dosya koy.

## Bitirme
1. Görev dosyasının **Sonuç** bölümüne: üretilen dosyalar, yeniden üretilenler ve nedeni, emin olmadığın noktalar.
2. Başlıkta `durum: inceleme`, Günlük'e `- <tarih> bitti, incelemeye gönderildi`.
3. Commit `G2xx: görseller` → push. Sonra PANO'daki sıradaki göreve geç.
4. Repoya yazamıyorsan: dur ve bunu çıktında açıkça söyle (kullanıcıya yükleme işi verme).
