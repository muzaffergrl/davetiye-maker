// Header and footer of the marketing site (docs/14 §5.2; G066: BKE Studio comps brand/ui/site/). Server components;
// the mobile menu is a <details> element (works without JavaScript). Logos are the brand SVGs from public/brand/
// (header: anchor on paper, footer: reverse on aubergine) — never the name typeset in a font.
import { ArrowRight, Menu, UserRound, X } from 'lucide-react';
import { BRAND_FILES, logoWidth } from '../../lib/marketing/brand.ts';
import { MARKETING } from '../../lib/marketing/config.ts';
import { liveDesigns, startPath } from '../../lib/marketing/designs.ts';
import type { Guide } from '../../lib/marketing/guides.ts';
import { real } from '../../lib/marketing/placeholders.ts';
import { NAV } from '../../lib/marketing/site.ts';
import s from './marketing.module.css';

const HEADER_LOGO_H = 36;

export function Header() {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <a href="/" className={s.logoLink}>
          <img
            className={s.logo}
            src={BRAND_FILES.logo}
            width={logoWidth(HEADER_LOGO_H)}
            height={HEADER_LOGO_H}
            alt={`${MARKETING.brand.name} home`}
            decoding="async"
          />
        </a>
        <nav aria-label="Main" className={s.nav}>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="/my" className={s.myBtn} data-track="nav_my_website" data-my-website="">
          <UserRound aria-hidden size={18} strokeWidth={1.75} />
          My website
        </a>
        <a href="/designs" className={`${s.btn} ${s.btnSmall} ${s.headerCta}`} data-track="nav_designs">
          See designs
        </a>
        <details className={s.mobileMenu}>
          <summary className={s.menuButton}>
            <Menu aria-hidden size={28} strokeWidth={1.75} className={s.menuOpenIcon} />
            <X aria-hidden size={28} strokeWidth={1.75} className={s.menuCloseIcon} />
            <span className={s.visuallyHidden}>Menu</span>
          </summary>
          <nav aria-label="Main (mobile)" className={s.mobileNav}>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>
                    {n.label}
                    <ArrowRight aria-hidden size={20} strokeWidth={1.75} />
                  </a>
                </li>
              ))}
              <li>
                <a href={startPath()} data-track="start_click">
                  Already bought a design? Start your website
                  <ArrowRight aria-hidden size={20} strokeWidth={1.75} />
                </a>
              </li>
              <li>
                <a href="/my" data-track="nav_my_website">
                  My website — open your editor
                  <ArrowRight aria-hidden size={20} strokeWidth={1.75} />
                </a>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer({ guides }: { guides: Guide[] }) {
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
          <p className={s.footerNote}>{cfg.brand.shortDescription}</p>
        </div>
        <nav aria-label="Footer" className={s.footerCols}>
          <div>
            <h2 className={s.footerTitle}>Designs</h2>
            <ul>
              {liveDesigns(cfg).map((d) => (
                <li key={d.id}>
                  <a href={`/designs/${d.id}`}>{d.name}</a>
                </li>
              ))}
              <li>
                <a href="/designs">All designs</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={s.footerTitle}>Help</h2>
            <ul>
              <li>
                <a href="/how-it-works">How it works</a>
              </li>
              <li>
                <a href="/features">Features</a>
              </li>
              <li>
                <a href="/pricing">Pricing</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/my" data-track="nav_my_website">
                  My website
                </a>
              </li>
              <li>
                <a href={startPath()} data-track="start_click">
                  Already bought a design? Start your website
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={s.footerTitle}>Guides</h2>
            <ul>
              {guides.slice(0, 4).map((g) => (
                <li key={g.slug}>
                  <a href={g.path}>{g.title.replace(/\s*\(.*\)$/, '').replace(/:.*$/, '')}</a>
                </li>
              ))}
              <li>
                <a href="/guides">All guides</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={s.footerTitle}>Company</h2>
            <ul>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/privacy">Privacy</a>
              </li>
              <li>
                <a href="/admin" rel="nofollow" data-shop-login="">
                  Shop login
                </a>
              </li>
              {shop ? (
                <li>
                  <a href={shop}>Etsy shop</a>
                </li>
              ) : (
                <li>
                  <span className={s.footerMuted}>Etsy shop: {cfg.etsy.shopUrl}</span>
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
          © {year} {cfg.brand.name}. Wedding websites sold on Etsy.
        </p>
      </div>
    </footer>
  );
}
