// Next.js does NOT deep-merge layout-level and page-level openGraph objects —
// the page-level object completely replaces the layout-level one.
// Spread this into every public page's openGraph block to keep siteName,
// locale, and type consistent without relying on layout inheritance.
export const OG_BASE = {
  siteName: 'Terra Bonifica',
  locale: 'it_IT',
  type: 'website',
} as const
