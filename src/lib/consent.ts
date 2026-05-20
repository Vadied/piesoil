// Consent Management — shared constants and types.
// The CONSENT_KEY string is intentionally mirrored in the beforeInteractive
// inline script in the root layout; keep them in sync if this value changes.

export const CONSENT_KEY = 'cookie_consent' as const

export type ConsentValue = 'accepted' | 'rejected'
