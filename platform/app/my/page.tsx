// /my — "Create your invitation website" (G095, G146 — K46): the sales site's button for buyers. How it works (Etsy →
// PDF → order number + email), the one form that opens the editor on any device with the Etsy order number + email (or
// goes on to /start for a new order), the editors saved on this device, the saved edit link. Never indexed.
// ("my" cannot be a couple's address: addresses have at least 3 characters, lib/slug.ts.)
// Reads the startable designs (theme folders), so it is a theme-reading route (next.config.ts THEME_ROUTES).
import type { Metadata } from 'next';
import { DocumentLang } from '../../components/i18n/DocumentLang.tsx';
import MyWebsite from '../../components/my/MyWebsite.tsx';
import { PANEL_FONTS } from '../../components/panel/fonts.ts';
import { getEditLinkMailer } from '../../lib/claim/mailer.ts';
import { claimableTheme } from '../../lib/claim/themes.ts';
import { MARKETING } from '../../lib/marketing/config.ts';
import { href } from '../../lib/marketing/lang-path.ts';
import { realEtsyUrl } from '../../lib/marketing/placeholders.ts';
import { uiLocale } from '../../lib/i18n/server.ts';
import { makeTranslator } from '../../lib/i18n/translate.ts';
import { offeredThemes, themeStartable } from '../../lib/themes/offered.ts';
import { resolveVariant } from '../../lib/theme/variants.ts';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { lang, dict } = await uiLocale();
  const { t } = makeTranslator(lang, dict);
  return {
    title: t('Create your invitation website'),
    robots: { index: false, follow: false },
    referrer: 'no-referrer',
  };
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function MyPage({ searchParams }: Props) {
  const { lang, dict } = await uiLocale();
  const { theme, order, variant } = await searchParams;
  // G151: a private theme (custom design) only with &order=<a listed number>; else it is unknown here too.
  const found = typeof theme === 'string' && theme ? await claimableTheme(theme, { order }) : null;
  // G153: /my?theme=<id>&variant=<palette> hands a live colour palette on to /start
  const startTheme = found && themeStartable(found) ? { id: found.id, name: found.name, variant: resolveVariant(found.manifest.variants, variant) } : null;
  return (
    <div className={PANEL_FONTS}>
      <DocumentLang lang={lang} />
      <MyWebsite
        shopName={MARKETING.etsy.shopName}
        lang={lang}
        dict={dict}
        // The Etsy shop only when the config holds a real Etsy URL; never a placeholder or a guessed address.
        etsyShopUrl={realEtsyUrl(MARKETING.etsy.shopUrl)}
        designsPath={href(lang, '/designs')}
        theme={startTheme}
        designs={startTheme ? [] : await offeredThemes()}
        emailLinkEnabled={getEditLinkMailer().enabled}
      />
    </div>
  );
}
