import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  getPublishedArticleBySlug,
  getAllPublishedArticleSlugs,
} from '@/lib/articles'

// Time-based ISR fallback; on-demand revalidation is handled by /api/revalidate.
export const revalidate = 300

// ---------------------------------------------------------------------------
// Static params — pre-render published articles at build time.
// ---------------------------------------------------------------------------

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllPublishedArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getPublishedArticleBySlug(params.slug)

  if (!article) {
    return { title: 'Articolo non trovato' }
  }

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: 'article',
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      authors: article.author.name ? [article.author.name] : undefined,
      images: article.coverImageUrl
        ? [{ url: article.coverImageUrl, alt: article.title }]
        : undefined,
    },
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ArticleDetailPage({ params }: PageProps) {
  const article = await getPublishedArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const categories = article.categories.map((c) => c.category)
  const tags = article.tags.map((t) => t.tag)

  return (
    <>
      {/* Hero */}
      <div className="bg-green-900">
        {article.coverImageUrl && (
          <div className="relative h-72 w-full sm:h-96">
            <Image
              src={article.coverImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-40"
            />
          </div>
        )}

        <div
          className={`mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 text-white ${
            article.coverImageUrl ? '-mt-24 relative' : ''
          }`}
        >
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat.slug}
                  className="rounded-full bg-green-700 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-green-100"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-4 text-lg text-green-200">{article.excerpt}</p>
          )}

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-green-300">
            {article.author.name && (
              <span className="flex items-center gap-2">
                {article.author.image ? (
                  <Image
                    src={article.author.image}
                    alt={article.author.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                    {article.author.name.charAt(0).toUpperCase()}
                  </span>
                )}
                {article.author.name}
              </span>
            )}

            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            )}
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Markdown content */}
          <div className="prose prose-green prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-gray-100 pt-8">
              {tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Torna al blog
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
