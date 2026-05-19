import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articoli, approfondimenti e aggiornamenti di Terra Bonifica su tecniche di bonifica, normativa e casi studio.',
}

export const dynamic = 'force-dynamic'

async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 12,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  })
}

export default async function BlogPage() {
  const articles = await getPublishedArticles()

  return (
    <>
      {/* Page header */}
      <section className="bg-green-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-xl text-green-200">
            Approfondimenti, casi studio e aggiornamenti dal mondo della bonifica del suolo.
          </p>
        </div>
      </section>

      {/* Articles */}
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Cover */}
                  <div className="h-48 overflow-hidden bg-green-100">
                    {article.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.coverImageUrl}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-green-300">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {article.publishedAt && (
                      <time
                        dateTime={article.publishedAt.toISOString()}
                        className="text-xs text-gray-400"
                      >
                        {article.publishedAt.toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                    <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-green-700">
                      <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0">
                        {article.title}
                      </Link>
                    </h2>
                    {article.excerpt && (
                      <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    {article.author.name && (
                      <p className="mt-4 text-xs text-gray-400">Di {article.author.name}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / updates */}
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
