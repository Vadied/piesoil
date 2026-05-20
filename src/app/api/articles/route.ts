import { NextRequest, NextResponse } from 'next/server'
import { getPublishedArticleList } from '@/lib/articles'

/**
 * GET /api/articles?page=1
 *
 * Returns a paginated list of published articles as JSON.
 * Data is served from the same unstable_cache used by the public blog page,
 * so it respects the 'articles' cache tag and on-demand revalidation.
 *
 * Query parameters:
 *   page – 1-based page number (default: 1)
 *          Page size is fixed server-side (see ARTICLES_PAGE_SIZE in lib/articles.ts).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl

  const rawPage = parseInt(searchParams.get('page') ?? '1', 10)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1

  const result = await getPublishedArticleList(page)

  return NextResponse.json({
    data: result.articles,
    meta: {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
      hasNextPage: result.page < result.totalPages,
      hasPrevPage: result.page > 1,
    },
  })
}
