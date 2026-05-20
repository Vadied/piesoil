'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CONSENT_KEY, type ConsentValue } from '@/lib/consent'

interface ConsentContextType {
  /** null = user has not yet made a choice this session */
  consentValue: ConsentValue | null
  acceptConsent: () => void
  rejectConsent: () => void
}

const ConsentContext = createContext<ConsentContextType>({
  consentValue: null,
  acceptConsent: () => {},
  rejectConsent: () => {},
})

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consentValue, setConsentValue] = useState<ConsentValue | null>(null)

  // Read persisted consent from localStorage after mount.
  // Runs only on the client — localStorage is unavailable during SSR.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (stored === 'accepted' || stored === 'rejected') {
        setConsentValue(stored)
      }
    } catch {
      // Private-browsing environments may throw on localStorage access.
    }
  }, [])

  const acceptConsent = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted')
    } catch {
      // Ignore write failures (e.g. storage quota exceeded).
    }
    setConsentValue('accepted')
    // Signal GA4 Consent Mode v2 that the user has granted tracking.
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      })
    }
  }, [])

  const rejectConsent = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, 'rejected')
    } catch {
      // Ignore write failures (e.g. storage quota exceeded).
    }
    setConsentValue('rejected')
  }, [])

  return (
    <ConsentContext.Provider value={{ consentValue, acceptConsent, rejectConsent }}>
      {children}
    </ConsentContext.Provider>
  )
}

/** Returns the current consent state and action callbacks for any component. */
export function useConsent(): ConsentContextType {
  return useContext(ConsentContext)
}
