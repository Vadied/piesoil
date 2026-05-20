import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArticleForm } from '@/components/backoffice'

type PageProps = { params: { id: string } }

// React.cache deduplicates this call within a single render pass so
// generateMetadata and the page component share one DB round-trip.
const getArticle = cache((id: string) =>
  prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      coverImageUrl: true,
      published: true,
      publishedAt: true,
      authorId: true,
      categories: {
        select: { category: { select: { id: true, name: true, slug: true } } },
      },
      tags: {
        select: { tag: { select: { id: true, name: true, slug: true } } },
      },
    },
  }),
)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.id)
  return {
    title: article ? `Modifica: ${article.title}` : 'Articolo non trovato',
  }
}

export default async function EditArticlePage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const isAdmin = session.user.role === 'ADMIN'

  const article = await getArticle(params.id)

  if (!article) notFound()

  // Co-editors may only edit their own articles
  if (!isAdmin && article.authorId !== session.user.id) {
    redirect('/backoffice/articles')
  }

  const [categories, tags, authors] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    isAdmin
      ? prisma.user.findMany({
          orderBy: { name: 'asc' },
          select: { id: true, name: true, email: true },
        })
      : Promise.resolve(null),
  ])

  // Serialize Dates before passing to client component
  const serializedArticle = {
    ...article,
    publishedAt: article.publishedAt?.toISOString() ?? null,
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/backoffice/articles" className="hover:text-gray-700">
          Articoli
        </Link>
        <span>/</span>
        <span className="text-gray-900 line-clamp-1">{article.title}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modifica articolo</h1>
        <p className="mt-1 text-sm text-gray-500">{article.title}</p>
      </div>

      <ArticleForm
        article={serializedArticle}
        categories={categories}
        tags={tags}
        isAdmin={isAdmin}
        authors={authors ?? undefined}
        currentUserId={session.user.id}
      />
    </div>
  )
}
