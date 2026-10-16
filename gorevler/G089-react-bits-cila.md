---
id: G089
baslik: React Bits Pro ile cila — satış sitesi, panel ve düğün sitelerini "yaşayan" hâle getir (K31)
rol: claude-kod
durum: inceleme
alan: claude-local-G089
oncelik: 2
bagimli: [G088]
yazar: [platform/components/marketing/, platform/components/panel/, platform/components/fx/, platform/app/(marketing)/, platform/package.json, platform/package-lock.json, platform/tests/, platform/previews/g089/, docs/14_SATIS_SITESI.md, docs/16_PANEL_V2.md]
---

## Amaç
K31: siteyi React Bits Pro bileşenleriyle daha canlı yapmak — giriş animasyonları, kaydırmayla beliren bölümler, metin/ışık efektleri,
galeri ve kart etkileşimleri. Önce satış sitesi ve panel (React); düğün temaları statik HTML/JS olduğu için orada yalnız hafif,
bağımsız efektler ve tema standardına (docs/11 §6 performans bütçesi, §10 azaltılmış hareket) uyanlar.

## Yapılacaklar
1. React Bits Pro lisansı ve kurulum yolu (kullanıcının hesabı; lisans anahtarı repoya/log'a yazılmaz). Erişim yoksa blokaj.
2. G088'in ekran listesine göre bileşen seçimi; her biri için `prefers-reduced-motion` karşılığı, mobil performans (LCP/CLS), paket boyutu.
3. Uygula, ölç (Lighthouse/Playwright 390 + 1280), önizleme `platform/previews/g089/`.
4. Düğün temalarına uygun efektler için docs/11'e öneri (tema standardı değişikliği ayrı görev).

## Sonuç

Dal: `claude/g089-react-bits` (main'e push yok, PR yok; entegratör birleştirir). Yapan: claude-local-G089, 2026-10-16.

### Hesap ve lisans
- Chrome'da kullanıcının oturumu (pro.reactbits.dev, Account menüsü): plan **Pro**, "Copy license key" mevcut. İlk denemede bağlı
  Chrome profili oturumsuzdu; kullanıcı giriş yaptı.
- Lisans (pro.reactbits.dev/license, sürüm 2.2, 11 Eylül 2026) okundu. §2.2 izin verilen kullanım: "Install the Product into an
  unlimited number of their own or their clients' codebases". §2.4 (özetle): ürünü ya da önemli bir kısmını herkese açık repo, gist,
  starter kit vb. ile paylaşmak, yeniden satmak, başkasına kaynak/yeniden kullanılabilir biçimde vermek yasak; aynı bölüm, ürünün
  bir SaaS'ın **arayüzünün parçası** olarak kullanılmasına, kullanıcılara kaynak/yeniden kullanılabilir hâlde verilmediği sürece açıkça
  izin veriyor. §2.3: üretilen çıktı (sitelerimiz) bizim. §2.1 tek geliştirici lisansı; §2.7 anahtar gizli tutulur.
- Değerlendirme: repo **özel** (GitHub API anonim 404). Uyarlanmış kaynağı özel repoya koymak ve satış sitesi + alıcı panelinde
  kullanmak izinli. Repo herkese açık yapılırsa `components/fx/StaggeredText.tsx` ve `DepthTilt.tsx` kaldırılmalı (dosya başlarında
  not var). Birden çok ajanın aynı repoda çalışması §2.1 "tek geliştirici" ile gri alan: kullanıcının adına çalışan yapay zekâ
  ajanları §2.5/§2.7'de öngörülmüş; insan geliştirici eklenirse ek lisans gerekir.

### Kurulum
- Değişken adı kurulum sayfasından: `REACTBITS_LICENSE_KEY`. Anahtar sitenin "Copy license key" düğmesiyle panoya alındı ve
  PowerShell ile doğrudan `platform/.env.local`'a yazıldı (ekrana/loga/sohbete basılmadı; pano sonra temizlendi). `.env*`
  `platform/.gitignore`'da; commit'e girmedi.
- shadcn CLI **kullanılmadı**: CLI `shadcn init` + Tailwind'li `components.json` bekliyor, platform düz CSS. Bunun yerine CLI'nin
  kullandığı lisanslı registry uç noktasından (`https://pro.reactbits.dev/api/r/starter/<ad>.json`, anahtar `.env.local`'dan) iki
  bileşenin `-css` varyantı okundu ve elle uyarlandı. `components.json` eklenmedi. Tailwind kurulmadı.
- **Yeni npm bağımlılığı yok.** İki bileşen de `motion` istiyordu; uyarlamada CSS animasyonuyla değiştirildi. `package.json` /
  `package-lock.json` değişmedi.

### Ne nerede
| Efekt | Dosya | Kaynak | Nerede |
|---|---|---|---|
| H1 kelime kelime iner (blur + düşüş, 70 ms arayla) | `components/fx/StaggeredText.tsx`, `fx.module.css` | React Bits Pro "Staggered Text" (`staggered-text-css`), `motion` yerine CSS; sunucu bileşeni, istemci JS'i yok | `/`, `/designs`, `/designs/<tasarım>` H1 |
| Hero sırayla yükselir (eyebrow, metin, çipler, düğme, bilgi şeridi) | `components/marketing/marketing.module.css` | kendi CSS'imiz | ana sayfa + tasarım sayfası hero; poster (LCP) sabit |
| Kaydırınca bloklar bir kez yükselir | `components/fx/RevealOnScroll.tsx` (layout'ta tek kez) | kendi kodumuz (React Bits Pro'da `motion`'sız hafif genel "reveal" yok) | ilk bölümden sonraki bölümlerin blokları; yalnız ilk ekranın altındakiler |
| Tasarım kartı fareyle 6° eğilir | `components/fx/DepthTilt.tsx` | React Bits Pro "Depth Card" (`depth-card-css`), yalnız eğim; döngü yerleşince durur | `DesignCard` (ana sayfa şeridi, /designs, "other designs") |
| Dokunmatikte kart basma geri bildirimi (scale 0.98) | `marketing.module.css` | CSS | aynı kartlar |
| Panel görünüm/kurulum adımı değişince 180 ms opacity | `components/fx/useViewFade.ts`, `components/panel/Panel.tsx` | kendi kodumuz | panel `main` ve kurulum sihirbazı; ilk açılışta yok |
| Archivo `display: 'optional'` | `app/(marketing)/layout.tsx` | — | CLS düzeltmesi (aşağıda) |

- Azaltılmış hareket: her animasyon `@media (prefers-reduced-motion: no-preference)` içinde; betikli olanlar (`DepthTilt`,
  `RevealOnScroll`, `useViewFade`) `matchMedia` ile kendileri de kapanır. JavaScript'siz hâlde hiçbir şey gizlenmez (reveal yalnız
  hidrasyondan sonra ve yalnız ilk ekranın altındaki bloklara uygulanır). Baskıda kapalı. Yeni şekil/dekor çizilmedi; GPT'ye prompt
  gerekmedi (K21).
- Panelde yalnız sakin opacity geçişi; dönüşüm yok (yapışkan yayın şeridi ve sabit katmanlar etkilenmesin diye).

### Ölçümler (`platform/previews/g089/perf_before_after.json`)
Önce/sonra **aynı makinede art arda** ölçüldü (gün içinde makine yavaşladı; ilk "önce" sayıları karşılaştırmaya alınmadı).
- Playwright lab (390×844, CPU 4×, 150 ms RTT, 1,6 Mbps; 3 yükleme medyanı): LCP `/` 1980 → 2104 ms, `/designs` 1428 → 1388 ms,
  `/designs/blush-garden-rose` 1940 → 2072 ms (LCP öğesi aynı: zarf görseli / giriş paragrafı; fark tekrarların yayılımı içinde:
  önce 1972–2244, sonra 2096–2160). CLS her sayfada 0. Kaydırma boyunca CLS (390/1280): 0 – 0,0008.
- Lighthouse 13.5.0 mobil (3 koşu medyanı): `/` LCP 3362 → 2608, CLS 0,0002 → 0,0001, puan 77 → 87; `/designs` LCP 3304 → 3058,
  **CLS 0,0476 → 0,003**; `art-deco-black-tie` LCP 3469 → 3497, CLS 0,0001 → 0,0001; `burgundy-velvet-autumn` LCP 3508 → 3448,
  CLS 0,0296 → 0,0001. **FCP her sayfada ~150 ms geç** (1081–1091 → 1230–1242 ms; `optional` yazı tipinin ön yükleme beklemesi).
- CLS düzeltmesinin hikâyesi: Archivo'nun yedeği daha dar; yazı tipi geç gelince birçok H1 yeniden sarıyordu (20 tasarım sayfasının
  çoğunda 360–1280 px'te satır sayısı değişiyor — G089 öncesinden). H1 kelimeleri ayrı kutu olunca kayan kelimeler de sayıldı ve
  `/designs` CLS 0,118'e çıktı. `display: 'optional'` geç değişimi kaldırdı.
- İlk JS (`.next/server/app/*.html` script parçaları): ana sayfa ve tasarım sayfası 573,2 → 575,9 KB ham, **+1,0 KB gzip**
  (175,2 → 176,2); `/designs` 572,4 → 575,2 KB ham (+2,8), +1,3 KB gzip; JS'siz sayfalar (ör. `/pricing`) +1,3 KB ham/+0,5 KB gzip (RevealOnScroll).
  Panel parçası 229 217 → 229 721 B (+0,5 KB ham, +0,16 KB gzip).

### Testler
- `npm ci` ✓, `npm run build` ✓, `npm run typecheck` ✓.
- `npm test`: 1217 test, **1191 geçti, 17 atlandı (Playwright'lı tema testleri), 9 başarısız** — hepsi G089'un dokunmadığı iki dosyada ve
  bu Windows makinesinin ortamından: `g080-approval.test.ts` (8; `review-fixture.ts` symlink oluşturamıyor, EPERM) ve
  `g055-limits.test.ts` (1; `tools/validate_content.py` astral karakter vakası Python tarafında false). Linux/CI'da denenmedi.
- Yeni: `tests/g089-fx.test.ts` (9 test, `npm test` içinde ✓): yardımcılar, CSS'te her animasyon/gizli durumun no-preference
  içinde olması, React Bits dosyalarında kaynak+lisans notu, motion/gsap/three/Tailwind eklenmemesi, `.env*` yok sayımı.
- Yeni: `tests/g089-browser.ts` (npm test dışında, diğer *-browser.ts gibi): 390 ve 1280'de azaltılmış hareket (H1 kelimeleri hemen tam
  görünür, hiçbir blok gizli değil, kart eğilmiyor), normal hareket (H1 tamamlanıyor, ilk ekranda gizli blok yok, alttakiler bekliyor,
  kaydırınca hepsi açılıyor, CLS ≤ 0,1), 1280'de kart eğilip düzeliyor, panel görünüm geçişi var / azaltılmış harekette yok, lab perf.
  Son derlemede **tüm denetimler geçti**.
- Mevcut `tests/marketing-browser.ts --no-shots` (axe 4.13, dokunma alanları, kart dizilimleri, hero ilk ekran, perf): **783/783 ✓**.
- Ölçüm araçları geçici klasöre kuruldu (Playwright 1.56.1 + Chromium, Lighthouse 13.5.0; repoya girmedi).

### Önizlemeler (`platform/previews/g089/`)
`home_390_top.jpg`, `home_390_intro_frame.jpg` (giriş animasyonunun ortası), `home_390.jpg`, `home_1280(_top).jpg`,
`designs_390/1280(_top).jpg`, `designs_blush-garden-rose_390/1280(_top).jpg`, `designs_card_tilt_1280.jpg`, `panel_edit_390.jpg`,
`perf_after.json`, `perf_before_after.json`. Tam sayfa görüntüler sayfa baştan sona kaydırıldıktan sonra alındı.

### Denenmeyenler
- Gerçek iPhone/Android, Safari ve Firefox (yalnız Chromium; Playwright mobil öykünmesi). iOS Safari'de `filter: blur` animasyonunun
  akıcılığı ve `optional` yazı tipinin yavaş ağda ilk ziyarette yedekte kalması gözle görülmedi.
- Canlı (Vercel) ölçüm/PageSpeed Insights; yalnız yerel `next start`.
- Panelde ekran okuyucuyla geçiş denemesi (yalnız opacity değişiyor, odak davranışı değişmedi).

### Entegratöre not
1. **docs/11 için öneri** (yazar alanımda değil; tema standardı değişikliği ayrı görev): düğün temalarına `motion`/kütüphane girmez
   (§6 `site.js` ≤ 35 KB, kütüphane yok). Uygun hafif efektler: (a) home başlığında StaggeredText'in CSS hâli (kelime başına
   `--i` + `animation-delay`; ~0,3 KB CSS) — **ama** önce temanın başlık yazı tipinin yedekle satır sayısını değiştirmediği
   doğrulanmalı ya da `font-display: optional` kullanılmalı (G089'daki CLS dersi); (b) Our Story / Details bloklarına tek seferlik
   IntersectionObserver reveal (yalnız ilk ekranın altındakiler, JS'siz görünür); (c) foto kartlarında hover'da hafif eğim yalnız
   `(hover:hover) and (pointer:fine)`. Hepsi §10'daki `prefers-reduced-motion: reduce` kuralına tabi; zarf açılışı koreografisine (§7–8)
   dokunulmaz. Önerilen görev: "docs/11 §8/§10'a hafif sayfa içi efekt kuralları + bir pilot tema".
2. G089, G088 `inceleme` durumundayken alındı (`gorev.py al` bağımlılık yüzünden reddetti; başlık protokoldeki elle yöntemle
   güncellendi). G088'in `bitti`ye çekilmesi entegratörde.
3. Bu Windows makinesinde `tools/gorev.py` cp1254 yüzünden `PYTHONUTF8=1` ister.
4. `PROJECT_STATE.json` güncellenmedi (entegratör dosyası).

## Günlük
- 2026-10-15 açıldı (kullanıcı isteği K31)
- 2026-10-16 alindi: claude-local-G089 (G088 inceleme durumunda; docs/18 çıktısı mevcut, kullanıcı talimatıyla alındı)
- 2026-10-16 bitti, incelemeye gönderildi
