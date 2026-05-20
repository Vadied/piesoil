import type { NextConfig } from 'next'

/**
 * Content-Security-Policy header value.
 *
 * 'unsafe-inline' is required for scripts because the GA4 Consent Mode v2
 * initialisation uses dangerouslySetInnerHTML inline scripts in the root
 * layout. Nonce-based CSP would require server-side nonce generation wired
 * through both the middleware and the layout — that infrastructure can be
 * added in a future hardening pass.
 *
 * Sources are restricted to the application origin plus the Google services
 * that GA4 and OAuth actually contact.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  [
    "img-src 'self' data:",
    'https://storage.googleapis.com',
    'https://lh3.googleusercontent.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
  ].join(' '),
  [
    "connect-src 'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://stats.g.doubleclick.net',
    'https://region1.google-analytics.com',
  ].join(' '),
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ')

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    // Prevent this site from being embedded in an iframe (clickjacking).
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Prevent browsers from MIME-sniffing a response away from the declared
    // Content-Type.
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Send a full URL in the Referer header for same-origin requests; send
    // only the origin for cross-origin navigations; omit the header for
    // HTTPS → HTTP downgrades.
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Opt out of browser features that are not needed by this application.
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    // Tell browsers to only connect over HTTPS for the next 2 years.
    // includeSubDomains covers any subdomain; preload opts into HSTS preload
    // lists. Only effective over HTTPS — ignored on plain HTTP.
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Explicitly enable browser DNS prefetching so browsers pre-resolve
    // hostnames for links on the page, improving perceived navigation speed.
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to every route served by Next.js.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
