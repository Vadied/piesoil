'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useConsent } from '@/context/ConsentContext'

/**
 * GDPR cookie consent banner.
 *
 * Appears only on the first visit (no stored preference) and disappears once
 * the user makes a choice. The `mounted` guard prevents a server/client
 * mismatch: on SSR the component renders nothing; after hydration the stored
 * preference is read and the banner is shown only when necessary.
 */
export function CookieBanner() {
  const { consentValue, acceptConsent, rejectConsent } = useConsent()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render nothing during SSR and during the first synchronous client render
  // to avoid hydration mismatches, and once the user has made a choice.
  if (!mounted || consentValue !== null) return null

  return (
    <div
      role="region"
      aria-label="Consenso cookie"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-green-800 bg-green-950 px-4 py-4 shadow-2xl sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-green-200">
            Utilizziamo cookie analitici per migliorare la tua esperienza di navigazione.
            Consulta la nostra{' '}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-2 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>{' '}
            e la{' '}
            <Link
              href="/cookie-policy"
              className="underline underline-offset-2 transition-colors hover:text-white"
            >
              Cookie Policy
            </Link>{' '}
            per maggiori informazioni.
          </p>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={rejectConsent}
              className="rounded-md border border-green-700 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:border-green-500 hover:bg-green-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              Rifiuta
            </button>
            <button
              type="button"
              onClick={acceptConsent}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              Accetta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
