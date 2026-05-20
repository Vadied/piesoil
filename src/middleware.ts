import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // -------------------------------------------------------------------------
  // Rate limiting — credentials login endpoint
  //
  // NextAuth v4 processes credentials sign-in at POST /api/auth/callback/credentials.
  // Apply a sliding-window rate limit (10 attempts / 15 min per IP) to mitigate
  // brute-force password attacks.
  // -------------------------------------------------------------------------
  if (pathname === '/api/auth/callback/credentials' && req.method === 'POST') {
    const ip = getClientIp(req.headers)
    const allowed = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Troppi tentativi. Riprova tra qualche minuto.' },
        { status: 429 },
      )
    }
  }

  // -------------------------------------------------------------------------
  // Backoffice route protection
  //
  // Every /backoffice/* route requires an active session, except the login
  // page itself which must remain publicly accessible to avoid redirect loops.
  // -------------------------------------------------------------------------
  if (pathname.startsWith('/backoffice') && pathname !== '/backoffice/login') {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const loginUrl = new URL('/backoffice/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // All backoffice routes (login is filtered programmatically above)
    '/backoffice',
    '/backoffice/:path*',
    // NextAuth credentials callback — rate-limited
    '/api/auth/callback/credentials',
  ],
}
