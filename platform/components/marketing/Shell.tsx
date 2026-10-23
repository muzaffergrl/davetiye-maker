// Header and footer of the marketing site (docs/14 §5.2; G066: BKE Studio comps brand/ui/site/). Server components;
// the mobile menu is a <details> element (works without JavaScript). Logos are the brand SVGs from public/brand/
// (header: anchor on paper, footer: reverse on aubergine) — never the name typeset in a font.
// G144: both take the page language `m` (links keep its prefix; /start, /my, /admin stay unprefixed). The header carries
// the language switcher (LangSwitch.tsx).
import { ArrowRight, Menu, UserRound, X } from 'lucide-react';
import { BRAND_FILES, logoWidth } from '../../lib/marketing/brand.ts';
import { MARKETING } from '../../lib/marketing/config.ts';
import { liveDesigns, startPath } from '../../lib/marketing/designs.ts';
import type { Guide } from '../../lib/marketing/guides.ts';
import { enMarket, LANG_NAMES, LANGS, type Market } from '../../lib/marketing/i18n.ts';
import { real } from '../../lib/marketing/placeholders.ts';
import { NAV } from '../../lib/marketing/site.ts';
import { LangSwitch } from './LangSwitch.tsx';
import s from './marketing.module.css';

const HEADER_LOGO_H = 36;

export function Header({ m = enMarket }: { m?: Market }) {
  const { t } = m;
  return (
    <header className={s.header} data-fx-header>
      <div className={s.headerInner}>
        <a href={m.href('/')} className={s.logoLink}>
          <img
            className={s.logo}
            src={BRAND_FILES.logo}
            width={logoWidth(HEADER_LOGO_H)}
            height={HEADER_LOGO_H}
            alt={t('{brand} home', { brand: MARKETING.brand.name })}
            decoding="async"
          />
        </a>
        <nav aria-label={t('Main')} className={s.nav}>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={m.href(n.href)}>{t(n.label)}</a>
              </li>
            ))}
          </ul>
        </nav>
        {/* G146: /my explains Etsy → PDF → order number + email, and opens the editor on any device. */}
        <a href="/my" className={s.myBtn} data-track="nav_my_website" data-my-website="">
          <UserRound aria-hidden size={18} strokeWidth={1.75} />
          <span>{t('Create your website')}</span>
        </a>
        <a href={m.href('/designs')} className={`${s.btn} ${s.btnSmall} ${s.headerCta}`} data-track="nav_designs">
          {t('See designs')}
        </a>
        <LangSwitch
          current={m.lang}
          langs={LANGS.map((l) => ({ lang: l, name: LANG_NAMES[l] }))}
          label={t('Language')}
        />
        <details className={s.mobileMenu}>
          <summary className={s.menuButton}>
            <Menu aria-hidden size={28} strokeWidth={1.75} className={s.menuOpenIcon} />
            <X aria-hidden size={28} strokeWidth={1.75} className={s.menuCloseIcon} />
            <span className={s.visuallyHidden}>{t('Menu')}</span>
          </summary>
          <nav aria-label={t('Main (mobile)')} className={s.mobileNav}>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={m.href(n.href)}>
                    {t(n.label)}
                    <ArrowRight aria-hidden size={20} strokeWidth={1.75} />
                  </a>
                </li>
              ))}
              <li>
                <a href={startPath()} data-track="start_click">
                  {t('Already bought a design? Start your website')}
                  <ArrowRight aria-hidden size={20} strokeWidth={1.75} />
                </a>
              </li>
              <li>
                <a href="/my" data-track="nav_my_website">
                  {t('Create your website or continue editing')}
                  <ArrowRight aria-hidden size={20} strokeWidth={1.75} />
                </a>
              </li>
            </ul>
            <LangSwitch
              variant="inline"
              current={m.lang}
              langs={LANGS.map((l) => ({ lang: l, name: LANG_NAMES[l] }))}
              label={t('Language')}
            />
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer({ guides, m = enMarket }: { guides: Guide[]; m?: Market }) {
  const { t } = m;
  const cfg = MARKETING;
  const year = Number(cfg.copyUpdated.slice(0, 4));
  const shop = real(cfg.etsy.shopUrl);
  const social = Object.entries(cfg.social).filter(([, v]) => v && real(v)) as Array<[string, string]>;
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div className={s.footerBrand}>
          <img
            className={s.footerLogo}
            src={BRAND_FILES.logoReverse}
            width={logoWidth(34)}
            height={34}
            alt={cfg.brand.name}
            loading="lazy"
            decoding="async"
          />
          <p className={s.footerNote}>{t(cfg.brand.shortDescription)}</p>
        </div>
        <nav aria-label={t('Footer')} className={s.footerCols}>
          <div>
            <h2 className={s.footerTitle}>{t('Designs')}</h2>
            <ul>
              {liveDesigns(cfg).map((d) => (
                <li key={d.id}>
                  <a href={m.href(`/designs/${d.id}`)}>{d.name}</a>
                </li>
              ))}
              <li>
                <a href={m.href('/designs')}>{t('All designs')}</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={s.footerTitle}>{t('Help')}</h2>
            <ul>
              <li>
                <a href={m.href('/how-it-works')}>{t('How it works')}</a>
              </li>
              <li>
                <a href={m.href('/features')}>{t('Features')}</a>
              </li>
              <li>
                <a href={m.href('/pricing')}>{t('Pricing')}</a>
              </li>
              <li>
                <a href={m.href('/faq')}>{t('FAQ')}</a>
              </li>
              <li>
                <a href="/my" data-track="nav_my_website">
                  {t('Create your website')}
                </a>
              </li>
              <li>
                <a href={startPath()} data-track="start_click">
                  {t('Already bought a design? Start your website')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={s.footerTitle}>{t('Guides')}</h2>
            <ul>
              {guides.slice(0, 4).map((g) => (
                <li key={g.slug}>
                  <a href={m.href(g.path)}>{g.title.replace(/\s*\(.*\)$/, '').replace(/:.*$/, '')}</a>
                </li>
              ))}
              <li>
                <a href={m.href('/guides')}>{t('All guides')}</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={s.footerTitle}>{t('Company')}</h2>
            <ul>
              <li>
                <a href={m.href('/about')}>{t('About')}</a>
              </li>
              <li>
                <a href={m.href('/contact')}>{t('Contact')}</a>
              </li>
              <li>
                <a href={m.href('/privacy')}>{t('Privacy')}</a>
              </li>
              {/* G961 (decision 7): terms of use and the KVKK notice, in every language */}
              <li>
                <a href={m.href('/terms')}>{t('Terms of use')}</a>
              </li>
              <li>
                <a href={m.href('/kvkk')}>{t('KVKK notice')}</a>
              </li>
              <li>
                <a href="/admin" rel="nofollow" data-shop-login="">
                  {t('Shop login')}
                </a>
              </li>
              {shop ? (
                <li>
                  <a href={shop}>{t('Etsy shop')}</a>
                </li>
              ) : (
                <li>
                  <span className={s.footerMuted}>{t('Etsy shop: {url}', { url: cfg.etsy.shopUrl })}</span>
                </li>
              )}
              {social.map(([k, v]) => (
                <li key={k}>
                  <a href={v}>{k.charAt(0).toUpperCase() + k.slice(1)}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className={s.footerBottom}>
        <p>
          © {year} {cfg.brand.name}. {t('Wedding websites sold on Etsy.')}
        </p>
      </div>
    </footer>
  );
}
