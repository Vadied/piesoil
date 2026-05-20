import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { ARTICLES_CACHE_TAG } from '@/lib/articles'

/**
 * POST /api/revalidate
 *
 * On-demand ISR revalidation endpoint. Clears the 'articles' cache tag so
 * that the next request to /blog and /blog/[slug] fetches fresh data from
 * PostgreSQL instead of serving cached results.
 *
 * Authentication: the caller must supply the REVALIDATION_SECRET value in the
 * 'x-revalidate-secret' header OR as the 'secret' query-string parameter.
 *
 * This endpoint is called by the backoffice whenever an article is published,
 * updated, or deleted, ensuring the public site reflects changes within the
 * next request after revalidation.
 *
 * Returns:
 *   200 { revalidated: true, tag: "articles", timestamp: "..." }
 *   401 { error: "Unauthorized" }
 *   500 { error: "REVALIDATION_SECRET is not configured" }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.REVALIDATION_SECRET

  if (!secret) {
    // Fail closed: if the secret is not configured the endpoint is inoperable.
    return NextResponse.json(
      { error: 'REVALIDATION_SECRET is not configured' },
      { status: 500 },
    )
  }

  // Accept the token from the header (preferred) or as a query param
  // (convenient for webhook-style callers that cannot set custom headers).
  const providedToken =
    request.headers.get('x-revalidate-secret') ??
    request.nextUrl.searchParams.get('secret')

  if (providedToken !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag(ARTICLES_CACHE_TAG)

  return NextResponse.json({
    revalidated: true,
    tag: ARTICLES_CACHE_TAG,
    timestamp: new Date().toISOString(),
  })
}
