// Unknown addresses outside every root layout (G152: there is no app/layout.tsx; next.config.ts experimental
// globalNotFound). The sales site, the panel, /start and the admin keep their own not-found pages.
import type { Metadata } from 'next';
import { RootBody, ROOT_METADATA } from '../components/i18n/RootDocument.tsx';

export const metadata: Metadata = { ...ROOT_METADATA, title: 'Page not found · BKE Studio' };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <RootBody>
        {/* The same quiet card as the wedding websites' "Page not found" (lib/site/render.ts), with a way home. */}
        <main
          style={{
            boxSizing: 'border-box',
            minHeight: '100dvh',
            display: 'grid',
            placeContent: 'center',
            justifyItems: 'center',
            gap: 12,
            padding: '48px 24px',
            background: '#faf7f0',
            color: '#3a2a35',
            textAlign: 'center',
            lineHeight: 1.55,
          }}
        >
          <span aria-hidden="true" style={{ display: 'block', width: 56, height: 1, marginBottom: 16, background: '#c9a86a' }} />
          <h1 style={{ margin: 0, color: '#2b1526', font: '400 clamp(28px, 7vw, 36px)/1.2 Georgia, "Times New Roman", serif', textWrap: 'balance' }}>
            This page could not be found.
          </h1>
          <p style={{ margin: 0, color: '#6b5f69' }}>Check the address, or go to the home page.</p>
          <p style={{ margin: '8px 0 0' }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: '#2b1526', fontWeight: 600, textUnderlineOffset: 4 }}>
              BKE Studio home
            </a>
          </p>
        </main>
      </RootBody>
    </html>
  );
}
