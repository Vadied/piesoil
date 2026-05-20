import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db'

// Tag used for on-demand cache invalidation via /api/revalidate.
export const ARTICLES_CACHE_TAG = 'articles'

// Number of articles per page in public listings.
export const ARTICLES_PAGE_SIZE = 9

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Dates are explicitly serialised to ISO strings inside each cached function
// body so that callers always receive strings — regardless of whether the
// result is a fresh Prisma query or a deserialised cache hit.

export type ArticleListItem = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  publishedAt: string | null
  author: { name: string | null }
  categories: { category: { name: string; slug: string } }[]
  tags: { tag: { name: string; slug: string } }[]
}

export type ArticleListResult = {
  articles: ArticleListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ArticleDetail = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImageUrl: string | null
  publishedAt: string | null
  updatedAt: string
  author: { name: string | null; image: string | null }
  categories: { category: { name: string; slug: string } }[]
  tags: { tag: { name: string; slug: string } }[]
}

// ---------------------------------------------------------------------------
// Cached queries
// ---------------------------------------------------------------------------

/**
 * Returns a paginated list of published articles, ordered by publication date
 * descending. Results are cached with the 'articles' tag so that
 * /api/revalidate can clear them on demand.
 */
export const getPublishedArticleList = unstable_cache(
  async (page: number): Promise<ArticleListResult> => {
    const skip = (page - 1) * ARTICLES_PAGE_SIZE

    const [articles, total] = await prisma.$transaction([
      prisma.article.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: ARTICLES_PAGE_SIZE,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImageUrl: true,
          publishedAt: true,
          author: { select: { name: true } },
          categories: {
            select: { category: { select: { name: true, slug: true } } },
          },
          tags: {
            select: { tag: { select: { name: true, slug: true } } },
          },
        },
      }),
      prisma.article.count({ where: { published: true } }),
    ])

    return {
      articles: articles.map((a) => ({
        ...a,
        publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      })),
      total,
      page,
      pageSize: ARTICLES_PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(total / ARTICLES_PAGE_SIZE)),
    }
  },
  ['published-article-list'],
  { tags: [ARTICLES_CACHE_TAG], revalidate: 300 },
)

/**
 * Returns the full content of a single published article by slug.
 * Returns null when the article does not exist or is not published.
 * Cached with the 'articles' tag.
 */
export const getPublishedArticleBySlug = unstable_cache(
  async (slug: string): Promise<ArticleDetail | null> => {
    const article = await prisma.article.findFirst({
      where: { slug, published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        coverImageUrl: true,
        publishedAt: true,
        updatedAt: true,
        author: { select: { name: true, image: true } },
        categories: {
          select: { category: { select: { name: true, slug: true } } },
        },
        tags: {
          select: { tag: { select: { name: true, slug: true } } },
        },
      },
    })

    if (!article) return null

    return {
      ...article,
      publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
      updatedAt: article.updatedAt.toISOString(),
    }
  },
  ['published-article-by-slug'],
  { tags: [ARTICLES_CACHE_TAG], revalidate: 300 },
)

/**
 * Returns slugs of all currently published articles. Used by
 * generateStaticParams to pre-render article detail pages at build time.
 * Not cached — runs once during the build.
 */
export async function getAllPublishedArticleSlugs(): Promise<string[]> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true },
    orderBy: { publishedAt: 'desc' },
  })
  return articles.map((a) => a.slug)
}
