import { NextRequest, NextResponse } from 'next/server'
import { getPublishedArticleBySlug } from '@/lib/articles'

/**
 * GET /api/articles/:slug
 *
 * Returns the full detail of a single published article as JSON.
 * Returns 404 when the article does not exist or is not published.
 * Data is served from the same unstable_cache used by the public detail page,
 * so it respects the 'articles' cache tag and on-demand revalidation.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } },
): Promise<NextResponse> {
  const article = await getPublishedArticleBySlug(params.slug)

  if (!article) {
    return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 })
  }

  return NextResponse.json({ data: article })
}
