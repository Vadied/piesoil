import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  getPublishedArticleList,
  type ArticleListItem,
} from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articoli, approfondimenti e aggiornamenti di Terra Bonifica su tecniche di bonifica, normativa e casi studio.',
}

// Time-based ISR fallback — data cache is the primary mechanism.
// The /api/revalidate endpoint triggers on-demand invalidation via revalidateTag.
export const revalidate = 300

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
// Sub-components
// ---------------------------------------------------------------------------

function ArticleCard({ article }: { article: ArticleListItem }) {
  const categories = article.categories.map((c) => c.category)
  const tags = article.tags.map((t) => t.tag)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden bg-green-100">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-green-300">
            <svg
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Taxonomy badges */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 px-6 pt-4">
          {categories.map((cat) => (
            <span
              key={cat.slug}
              className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 pt-3">
        {article.publishedAt && (
          <time dateTime={article.publishedAt} className="text-xs text-gray-400">
            {formatDate(article.publishedAt)}
          </time>
        )}
        <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-green-700">
          <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h2>
        {article.excerpt && (
          <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag.slug}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {article.author.name && (
          <p className="mt-4 text-xs text-gray-400">Di {article.author.name}</p>
        )}
      </div>
    </article>
  )
}

function Pagination({
  page,
  totalPages,
}: {
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const prev = page - 1
  const next = page + 1

  return (
    <nav
      aria-label="Paginazione articoli"
      className="mt-12 flex items-center justify-center gap-3"
    >
      {page > 1 ? (
        <Link
          href={`/blog?page=${prev}`}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Precedente
        </Link>
      ) : (
        <span className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          ← Precedente
        </span>
      )}

      <span className="text-sm text-gray-600">
        Pagina {page} di {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={`/blog?page=${next}`}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Successiva →
        </Link>
      ) : (
        <span className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          Successiva →
        </span>
      )}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface PageProps {
  searchParams: { page?: string }
}

export default async function BlogPage({ searchParams }: PageProps) {
  const rawPage = parseInt(searchParams.page ?? '1', 10)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1

  const { articles, total, totalPages } = await getPublishedArticleList(page)

  return (
    <>
      {/* Page header */}
      <section className="bg-green-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-xl text-green-200">
            Approfondimenti, casi studio e aggiornamenti dal mondo della bonifica del suolo.
          </p>
          {total > 0 && (
            <p className="mt-2 text-sm text-green-300">
              {total} {total === 1 ? 'articolo pubblicato' : 'articoli pubblicati'}
            </p>
          )}
        </div>
      </section>

      {/* Articles grid */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                I primi articoli sono in arrivo
              </h2>
              <p className="mt-3 text-gray-500">
                Stiamo preparando contenuti approfonditi sulla bonifica del suolo.
                <br />
                Torna a trovarci presto.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-green-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-green-900">Resta aggiornato</h2>
          <p className="mt-3 text-gray-700">
            Per ricevere aggiornamenti sui nuovi articoli e le attività del progetto,{' '}
            <Link href="/contatti" className="font-medium text-green-700 hover:underline">
              contattaci
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
