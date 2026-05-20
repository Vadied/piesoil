import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArticleActions } from '@/components/backoffice'

export const metadata: Metadata = { title: 'Articoli' }

// No ISR — backoffice list always fetches fresh data.
export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const session = await getServerSession(authOptions)
  // Middleware guarantees a session exists for all /backoffice/* routes.
  if (!session) return null

  const isAdmin = session.user.role === 'ADMIN'

  const articles = await prisma.article.findMany({
    where: isAdmin ? {} : { authorId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { name: true } },
      categories: { select: { category: { select: { name: true } } } },
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articoli</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin ? 'Tutti gli articoli del sito' : 'I tuoi articoli'}
          </p>
        </div>
        <Link
          href="/backoffice/articles/new"
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuovo articolo
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {articles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">Nessun articolo trovato.</p>
            <Link
              href="/backoffice/articles/new"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-600"
            >
              Crea il primo articolo
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Titolo
                  </th>
                  {isAdmin && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Autore
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Stato
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Data
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Azioni</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {articles.map((article) => (
                  <tr key={article.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      <div className="mt-0.5 font-mono text-xs text-gray-400">{article.slug}</div>
                      {article.categories.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {article.categories.map(({ category }) => (
                            <span
                              key={category.name}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {article.author.name ?? '—'}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={[
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          article.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700',
                        ].join(' ')}
                      >
                        {article.published ? 'Pubblicato' : 'Bozza'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {article.publishedAt
                        ? article.publishedAt.toLocaleDateString('it-IT')
                        : article.createdAt.toLocaleDateString('it-IT')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/backoffice/articles/${article.id}/edit`}
                          className="text-sm font-medium text-green-600 transition-colors hover:text-green-500"
                        >
                          Modifica
                        </Link>
                        <ArticleActions
                          articleId={article.id}
                          articleTitle={article.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
