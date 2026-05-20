import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { ConsentProvider } from '@/context/ConsentContext'
import { CONSENT_KEY } from '@/lib/consent'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// NEXT_PUBLIC_* vars are substituted at build time. When the var is absent
// (e.g. local dev without analytics) the entire analytics block is omitted.
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Terra Bonifica',
    template: '%s | Terra Bonifica',
  },
  description:
    'Ricerca, sviluppo e divulgazione su tecniche innovative di bonifica e rigenerazione del suolo contaminato.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        {/*
         * GA4 Consent Mode v2 — script loading order is critical:
         *
         *  1. beforeInteractive inline script
         *     – Initialises window.dataLayer and window.gtag.
         *     – Calls gtag('consent', 'default', denied) so NO data is
         *       collected before the user has made a choice.
         *     – Immediately restores a previously granted consent from
         *       localStorage so returning visitors are not re-prompted and
         *       tracking resumes without delay.
         *
         *  2. afterInteractive external gtag.js
         *     – Loads the Google tag library. By the time it runs, the
         *       consent default (or restored grant) is already on dataLayer.
         *
         *  3. afterInteractive inline config script
         *     – Timestamps the gtag instance and sends the GA4 page-view.
         *       Fires only after gtag.js has loaded.
         *
         * If NEXT_PUBLIC_GA_MEASUREMENT_ID is not set, the whole block is
         * skipped and no analytics code is injected.
         */}
        {gaMeasurementId && (
          <>
            <Script
              id="gtag-consent-init"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'wait_for_update': 500
});
try {
  if (localStorage.getItem('${CONSENT_KEY}') === 'accepted') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted'
    });
  }
} catch (_) {}
`,
              }}
            />
            <Script
              id="gtag-js"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');
`,
              }}
            />
          </>
        )}

        <ConsentProvider>{children}</ConsentProvider>
      </body>
    </html>
  )
}
