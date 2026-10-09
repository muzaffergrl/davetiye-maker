# Görev panosu — eş zamanlı çalışan ajanlar için protokol

Bu klasör, Claude ve GPT ajanlarının **aynı repoda aynı anda** çakışmadan çalışması içindir.
Her görev bir dosyadır: `gorevler/Gxxx-kisa-ad.md`. Plan: `docs/06_FABRIKA_PLANI.md`.

**Önce oku:** `AGENTS.md` → `docs/06_FABRIKA_PLANI.md` → bu dosya → **`gorevler/roller/<rolün>.md`** → aldığın görev dosyası.
Hızlı bakış: `gorevler/PANO.md` (rol başına alınabilir görevler; kabuk çalıştıramayan ajanlar için).
Kullanıcı elle hiçbir iş yapmaz; ona iş verme, ondan dosya yüklemesi isteme.

## 1. Rolünü bil

| Rol | Kim |
|---|---|
| `claude-canva` | Claude Code oturumu (Canva bağlayıcısı var). Aynı zamanda **entegratör** |
| `gpt-gorsel` | ChatGPT görsel üretimi (imagegen) — bütün görseller |
| `claude-tarayici` | Claude, kullanıcının bilgisayarında tarayıcıyla (Canva arayüzü işleri) |
| `claude-kod` | Claude Code oturumu (kod) |
| `claude-metin` | Claude oturumu (metin) |
| `claude-qa` | Claude denetçi (salt okunur) |

Yalnız kendi rolündeki görevi al.

## 1b. Görev numaraları

| ID | Ne | Rol |
|---|---|---|
| G0xx | Ortak araçlar, tasarım 02 pilot hattı, kapılar (G090) | çeşitli |
| G1NN | Tasarım NN — HTML sahne kaynağı + katmanlar | claude-kod |
| G2NN | Tasarım NN — GPT görselleri Paket 1 | gpt-gorsel |
| G3NN | Tasarım NN — Canva video master | claude-canva |
| G4NN | Tasarım NN — website HTML kaynağı | claude-kod |
| G5NN | Tasarım NN — 5×7 davetiye + story/kare kaynağı | claude-kod |
| G6NN | Tasarım NN — Canva website + PDF + story/kare | claude-canva |
| G7NN | Tasarım NN — kılavuz + Etsy ilan metni | claude-metin |
| G8NN | Tasarım NN — mockup görselleri (Paket 3) | gpt-gorsel |
| G9NN | Tasarım NN — Etsy ilan kiti montajı | claude-kod |
| GANN | Tasarım NN — video animasyonu + video template link | claude-tarayici |
| GBNN | Tasarım NN — website Form + yayın testi + set template link'leri | claude-tarayici |
| GQNN | Tasarım NN — QA raporu | claude-qa |
| GP1NN–GP4NN | Aşama 2: ek 5 palet (prompt, görsel, Canva, ilan) — G090'dan sonra | çeşitli |

NN = tasarım numarası (01–20, `docs/09_TASARIM_KATALOGU.md`). Tasarım 02'nin set görevleri pilot
numaralarındadır (G013, G020–G027, G902, GA02, GB02).

## 2. Görev dosyası biçimi

Her dosya şu başlıkla başlar (değerler tek satır; listeler `[a, b]` biçiminde):

```
---
id: G010
baslik: V01 Paket 1 görselleri
rol: gpt-gorsel
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [collections/02_Dusty_Blue/assets/gpt/textures/, collections/02_Dusty_Blue/assets/gpt/decor/]
---
```

| Alan | Anlamı |
|---|---|
| `durum` | `hazir` · `alindi` · `inceleme` · `bitti` · `blokaj` |
| `alan` | Görevi alan ajanın adı (ör. `codex-1`, `chatgpt-gorsel-2`, `claude-session-x`) |
| `oncelik` | 1 en acil |
| `bagimli` | Önce `bitti` olması gereken görevler |
| `yazar` | Bu görevde **yazmana izin verilen** dosya/klasörler. Dışına yazma |

Gövde: **Amaç · Girdiler · Yapılacaklar · Bitti sayılması için · Sonuç**.
Sonuç bölümünü görevi yapan ajan doldurur (ne yaptı, hangi dosyalar, ne test edildi,
ne edilmedi, blokaj varsa ne).

## 3. Akış

```
git pull --rebase origin main
python3 tools/gorev.py siradaki --rol <rolün>          # sana uygun ilk görev
python3 tools/gorev.py al G0xx --ajan <adın>           # durum: alindi
git commit -am "gorev: G0xx alindi (<adın>)" && git push   # ÖNCE sahiplen, sonra çalış
... işi yap (yalnız `yazar:` yollarına) ...
Sonuç bölümünü doldur
python3 tools/gorev.py bitir G0xx                      # durum: inceleme
git pull --rebase origin main && git push
```

- **Kabuk yoksa (ör. ChatGPT):** `PANO.md`'den görevi seç; görev dosyasının başlığında `durum: alindi` ve
  `alan: <adın>` yaz, en alta `## Günlük` altında `- <tarih> alindi: <adın>` ekle, commit + push. Bitirince
  `durum: inceleme` ve Günlük satırı. `PANO.md`'yi elle düzenleme (entegratör üretir).
- **Sahiplenme yarışı:** `al` sonrası push reddedilirse `git pull --rebase` yap ve görev
  dosyasına bak. Başka biri almışsa (`alan` dolu) bırak, sıradakine geç.
- `inceleme` → `bitti` geçişini **entegratör** yapar (çıktıyı kontrol edip durum dosyalarına
  işledikten sonra). Denetim gerektirmeyen küçük işlerde ajan doğrudan `bitti` yazabilir:
  görev dosyasında `inceleme gerekmez` yazıyorsa.
- **Blokaj:** devam edemiyorsan `python3 tools/gorev.py blokaj G0xx "neden"` → push.
  Kullanıcıya iş verme; blokajı entegratör çözer veya yeniden planlar.
- **Yeni görev gerekiyorsa** kendin açma; Sonuç bölümüne "önerilen görev" diye yaz.
  Entegratör açar (numara çakışmasını önlemek için).

## 4. Çakışma kuralları

1. Yalnız `yazar:` yollarına yaz. Başkasının dosyasında düzeltme gerekiyorsa Sonuç'a not düş.
2. Entegratör dosyaları — `PROJECT_STATE.json`, `collections/*/COLLECTION_STATUS.md`,
   `AGENTS.md`, `CLAUDE.md`, `00_ANA_DEVIR.md`, `docs/06_FABRIKA_PLANI.md` — yalnız
   `claude-canva` tarafından düzenlenir.
3. Küçük ve sık commit; her push'tan önce `git pull --rebase origin main`. Force-push yok.
4. Commit mesajı görev numarasıyla başlar: `G021: website mobil düzeni`.
5. İkili dosyalar (png/jpg/pdf/mp4) aynı adla üzerine yazılmaz; deneme `_v2` ekiyle gelir,
   seçimi görevin sahibi yapar.

## 5. Dürüstlük (AGENTS.md'den kısaca)

- Yapmadığın testi yapılmış yazma (MP4 export, website yayını, RSVP, PDF linkleri).
- Ticari alanlar (marka, fiyat, destek e-postası) uydurulmaz; `[PLACEHOLDER]` kalır.
- Demo veriler kurgudur; gerçek URL alanları `null`.
- Ürün metinleri İngilizce; tarih `September 18, 2027` biçiminde.

## 6. Komutlar

```
python3 tools/gorev.py liste                 # tüm görevler, duruma göre
python3 tools/gorev.py liste --rol claude-kod
python3 tools/gorev.py siradaki --rol gpt-gorsel
python3 tools/gorev.py al G020 --ajan codex-1
python3 tools/gorev.py bitir G020
python3 tools/gorev.py blokaj G020 "neden"
python3 tools/gorev.py kontrol               # biçim, bağımlılık, yazma alanı çakışması
python3 tools/gorev.py pano                  # gorevler/PANO.md'yi yeniden üret
```
