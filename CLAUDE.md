# CLAUDE.md

@AGENTS.md

## Claude Code'a özel

- Ayrıntılı bağlam gerektiğinde `00_ANA_DEVIR.md`'nin ilgili bölümünü oku (A: hızlı başlangıç,
  E: ürün sistemi, H: aktif koleksiyon, I: devam sırası). Tamamını her seferinde okumak gerekmez.
- Canva işlemleri için önce `canva-guvenli-duzenleme` skill'ini yükle. Canva araçları
  `mcp__Canva__*` (claude.ai bağlayıcısı) veya `.mcp.json`'daki `canva` sunucusundan gelir.
- Alt-ajanlar (`.claude/agents/`):
  - `canva-uretim` — Canva master'larında düzenleme/onarım (draft-commit disiplini ile)
  - `qa-kontrol` — mobil, link, içerik tutarlılığı ve dürüst durum denetimi (salt okunur)
  - `website-gelistirici` — responsive tek sayfa HTML kaynak ve mobil test
  - `etsy-metin` — İngilizce ilan, START HERE rehberi, dürüst ürün iddiaları
- Görsel üretim araçlarını (ImageGen, Higgsfield, Firefly vb.) yalnız kullanıcı açıkça
  isterse ya da somut bozuk bir dekor parçasını onarmak için kullan.
- Commit mesajları Türkçe veya İngilizce olabilir; kısa ve ne değiştiğini söyleyen.
