// Unknown addresses outside every root layout (G152: there is no app/layout.tsx; next.config.ts experimental
// globalNotFound). The sales site, the panel, /start and the admin keep their own not-found pages.
import type { Metadata } from 'next';
import { RootBody, ROOT_METADATA } from '../components/i18n/RootDocument.tsx';

export const metadata: Metadata = { ...ROOT_METADATA, title: 'Page not found · BKE Studio' };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <RootBody>
        <main style={{ maxWidth: 560, margin: '0 auto', padding: '64px 16px', lineHeight: 1.5 }}>
          <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>This page could not be found.</h1>
          <p style={{ margin: '0 0 16px' }}>Check the address, or go to the home page.</p>
          <p style={{ margin: 0 }}>
            <a href="/" style={{ color: '#2B1526' }}>
              BKE Studio home
            </a>
          </p>
        </main>
      </RootBody>
    </html>
  );
}
