import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

// Protect all routes under /backoffice except the login page itself.
// The login page must remain publicly accessible to avoid redirect loops.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Let the login page through unconditionally.
  if (pathname === '/backoffice/login') {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/backoffice/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Match every path under /backoffice (including the bare /backoffice route).
  // The login page is excluded programmatically inside the middleware function.
  matcher: ['/backoffice', '/backoffice/:path*'],
}
