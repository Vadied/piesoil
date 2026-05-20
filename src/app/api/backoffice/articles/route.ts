import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidateTag } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ARTICLES_CACHE_TAG } from '@/lib/articles'
import { createArticleSchema, parseBody } from '@/lib/schemas'

/**
 * GET /api/backoffice/articles
 *
 * Returns the article list scoped to the caller's role:
 * - ADMIN: all articles
 * - CO_EDITOR: only articles authored by the caller
 */
export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

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
      updatedAt: true,
      author: { select: { id: true, name: true } },
      categories: { select: { category: { select: { id: true, name: true } } } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
    },
  })

  return NextResponse.json({
    data: articles.map((a) => ({
      ...a,
      publishedAt: a.publishedAt?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
  })
}

/**
 * POST /api/backoffice/articles
 *
 * Creates a new article.
 * - ADMIN may specify an arbitrary authorId; defaults to themselves.
 * - CO_EDITOR is always the author regardless of the provided authorId.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const parsed = await parseBody(request, createArticleSchema)
  if (!parsed.success) return parsed.response

  const {
    title,
    slug,
    content,
    excerpt,
    coverImageUrl,
    published,
    publishedAt,
    categoryIds,
    tagIds,
    authorId,
  } = parsed.data

  const isAdmin = session.user.role === 'ADMIN'
  const effectiveAuthorId = isAdmin && authorId ? authorId : session.user.id

  const [authorCheck, existingSlug] = await Promise.all([
    isAdmin && authorId
      ? prisma.user.findUnique({ where: { id: authorId }, select: { id: true } })
      : null,
    prisma.article.findUnique({ where: { slug }, select: { id: true } }),
  ])

  if (isAdmin && authorId && !authorCheck) {
    return NextResponse.json({ error: 'Autore non trovato' }, { status: 400 })
  }
  if (existingSlug) {
    return NextResponse.json({ error: 'Slug già in uso. Scegline un altro.' }, { status: 409 })
  }

  const isPublished = published ?? false
  const effectivePublishedAt: Date | null = isPublished
    ? publishedAt
      ? new Date(publishedAt)
      : new Date()
    : null

  const validCategoryIds = categoryIds?.filter(Boolean) ?? []
  const validTagIds = tagIds?.filter(Boolean) ?? []

  try {
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt?.trim() || null,
        coverImageUrl: coverImageUrl?.trim() || null,
        published: isPublished,
        publishedAt: effectivePublishedAt,
        authorId: effectiveAuthorId,
        categories: {
          create: validCategoryIds.map((id) => ({ categoryId: id })),
        },
        tags: {
          create: validTagIds.map((id) => ({ tagId: id })),
        },
      },
      select: { id: true, slug: true },
    })

    revalidateTag(ARTICLES_CACHE_TAG)

    return NextResponse.json({ data: article }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug già in uso. Scegline un altro.' }, { status: 409 })
    }
    throw err
  }
}
