import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArticleForm } from '@/components/backoffice'

export const metadata: Metadata = { title: 'Nuovo articolo' }

export default async function NewArticlePage() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const isAdmin = session.user.role === 'ADMIN'

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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/backoffice/articles" className="hover:text-gray-700">
          Articoli
        </Link>
        <span>/</span>
        <span className="text-gray-900">Nuovo articolo</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuovo articolo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Compila tutti i campi e salva come bozza o pubblica direttamente.
        </p>
      </div>

      <ArticleForm
        categories={categories}
        tags={tags}
        isAdmin={isAdmin}
        authors={authors ?? undefined}
        currentUserId={session.user.id}
      />
    </div>
  )
}
