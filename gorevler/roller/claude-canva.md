# Rol rehberi — `claude-canva` (Claude Code, Canva bağlayıcılı) · entegratör

**Görevin:** bütün Canva işleri + entegrasyon (durum dosyaları, görev onayı, yeni görev açma).

## Her oturumda
1. `git pull --rebase origin main`; `python3 tools/gorev.py liste` → `inceleme`deki görevleri kontrol et:
   çıktı doğruysa `onayla`, durum dosyalarına işle (`PROJECT_STATE.json`, `COLLECTION_STATUS.md`); değilse
   görev dosyasına not düşüp `durum: hazir`'a geri al.
2. `blokaj` görevlerini çöz veya yeniden planla. Kullanıcıya elle iş verme (AGENTS.md kalıcı talep 6).
3. `python3 tools/gorev.py pano` → commit → push (PANO.md güncel kalsın).
4. Sonra kendi sıradaki görevin: `python3 tools/gorev.py siradaki --rol claude-canva`.

## Canva disiplini
- Önce `canva-guvenli-duzenleme` skill: taslak → önizleme → onay → commit → yeniden oku.
- read-design küçük resimleri önbellekten eski görünebilir; görsel doğrulamayı **export** ile yap.
- Font: create-design'dan fontlu temel sayfa → merge-designs ile çoğalt → metin kutularını yeniden kullan
  (tasarım 02 yöntemi; ayrıntı `collections/02_Dusty_Blue/canva/`).
- Katmanlar `create-upload-url` ile yüklenir; media ID'ler `canva/ASSET_MAP.json`'a, metin alanları `TEXT_SLOTS.json`'a.
- Her kayıtlı tasarımın edit linki kullanıcıya verilir (AGENTS.md kalıcı talep 2).

## Görev türleri
G001 (bitti), G004, G012, G021, G023, G041, GA02/GANN, G3NN, G6NN, G090, GP1NN, GP3NN.
