// Header and footer of the marketing site (docs/14 §5.2). Server components; the mobile menu is a <details>
// element (works without JavaScript).
import { ArrowRight, Menu } from 'lucide-react';
import { MARKETING } from '../../lib/marketing/config.ts';
import { liveDesigns, startPath } from '../../lib/marketing/designs.ts';
import type { Guide } from '../../lib/marketing/guides.ts';
import { real } from '../../lib/marketing/placeholders.ts';
import { NAV } from '../../lib/marketing/site.ts';
import s from './marketing.module.css';

export function Header() {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <a href="/" className={s.wordmark} aria-label={`${MARKETING.brand.name} home`}>
          {MARKETING.brand.name}
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
        <a href="/designs" className={`${s.btn} ${s.btnSmall} ${s.headerCta}`} data-track="nav_designs">
          See designs
        </a>
        <details className={s.mobileMenu}>
          <summary className={s.menuButton}>
            <Menu aria-hidden size={22} strokeWidth={1.75} />
            <span>Menu</span>
          </summary>
          <nav aria-label="Main (mobile)" className={s.mobileNav}>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>
                    {n.label}
                    <ArrowRight aria-hidden size={18} strokeWidth={1.5} />
                  </a>
                </li>
              ))}
              <li>
                <a href={startPath()} data-track="start_click">
                  Already bought a design? Start your website
                  <ArrowRight aria-hidden size={18} strokeWidth={1.5} />
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
          <p className={s.wordmark}>{cfg.brand.name}</p>
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
              {shop ? (
                <li>
                  <a href={shop}>Etsy shop</a>
                </li>
              ) : (
                <li>
                  <span className={s.muted}>Etsy shop: {cfg.etsy.shopUrl}</span>
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
