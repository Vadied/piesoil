import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidateTag } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ARTICLES_CACHE_TAG } from '@/lib/articles'
import { updateArticleSchema, parseBody } from '@/lib/schemas'

type RouteContext = { params: { id: string } }

/**
 * GET /api/backoffice/articles/:id
 *
 * Returns a single article with full content.
 * ADMIN: any article. CO_EDITOR: only own articles.
 */
export async function GET(_req: Request, { params }: RouteContext): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const article = await prisma.article.findUnique({
    where: { id: params.id },
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
      createdAt: true,
      updatedAt: true,
      author: { select: { id: true, name: true } },
      categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
      tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
    },
  })

  if (!article) {
    return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 })
  }

  const isAdmin = session.user.role === 'ADMIN'
  if (!isAdmin && article.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
  }

  return NextResponse.json({
    data: {
      ...article,
      publishedAt: article.publishedAt?.toISOString() ?? null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    },
  })
}

/**
 * PUT /api/backoffice/articles/:id
 *
 * Replaces article fields. Ownership enforced: ADMIN can update any article;
 * CO_EDITOR can only update articles they authored.
 * Categories and tags are replaced atomically (delete-then-insert).
 */
export async function PUT(request: Request, { params }: RouteContext): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const existing = await prisma.article.findUnique({
    where: { id: params.id },
    select: { authorId: true, published: true, publishedAt: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 })
  }

  const isAdmin = session.user.role === 'ADMIN'
  if (!isAdmin && existing.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
  }

  const parsed = await parseBody(request, updateArticleSchema)
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

  const [slugConflict, newAuthor] = await Promise.all([
    prisma.article.findFirst({
      where: { slug, NOT: { id: params.id } },
      select: { id: true },
    }),
    isAdmin && authorId && authorId !== existing.authorId
      ? prisma.user.findUnique({ where: { id: authorId }, select: { id: true } })
      : null,
  ])

  if (slugConflict) {
    return NextResponse.json({ error: 'Slug già in uso. Scegline un altro.' }, { status: 409 })
  }
  if (isAdmin && authorId && authorId !== existing.authorId && !newAuthor) {
    return NextResponse.json({ error: 'Autore non trovato' }, { status: 400 })
  }

  const effectiveAuthorId =
    isAdmin && authorId && newAuthor ? authorId : existing.authorId

  const isPublished = published ?? false
  let effectivePublishedAt: Date | null = existing.publishedAt

  if (isPublished) {
    if (publishedAt) {
      effectivePublishedAt = new Date(publishedAt)
    } else if (!existing.publishedAt) {
      effectivePublishedAt = new Date()
    }
  }

  const validCategoryIds = categoryIds?.filter(Boolean) ?? []
  const validTagIds = tagIds?.filter(Boolean) ?? []

  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.articleCategory.deleteMany({ where: { articleId: params.id } })
      await tx.articleTag.deleteMany({ where: { articleId: params.id } })

      const result = await tx.article.update({
        where: { id: params.id },
        data: {
          title,
          slug,
          content,
          excerpt: excerpt?.trim() || null,
          coverImageUrl: coverImageUrl?.trim() || null,
          published: isPublished,
          publishedAt: effectivePublishedAt,
          authorId: effectiveAuthorId,
        },
        select: { id: true, slug: true },
      })

      if (validCategoryIds.length > 0) {
        await tx.articleCategory.createMany({
          data: validCategoryIds.map((id) => ({ articleId: params.id, categoryId: id })),
        })
      }

      if (validTagIds.length > 0) {
        await tx.articleTag.createMany({
          data: validTagIds.map((id) => ({ articleId: params.id, tagId: id })),
        })
      }

      return result
    })

    revalidateTag(ARTICLES_CACHE_TAG)

    return NextResponse.json({ data: updated })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug già in uso. Scegline un altro.' }, { status: 409 })
    }
    throw err
  }
}

/**
 * DELETE /api/backoffice/articles/:id
 *
 * Permanently deletes the article and its category/tag relationships (cascade).
 * ADMIN: any article. CO_EDITOR: only own articles.
 */
export async function DELETE(_req: Request, { params }: RouteContext): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    select: { authorId: true },
  })

  if (!article) {
    return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 })
  }

  const isAdmin = session.user.role === 'ADMIN'
  if (!isAdmin && article.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
  }

  await prisma.article.delete({ where: { id: params.id } })

  revalidateTag(ARTICLES_CACHE_TAG)

  return NextResponse.json({ success: true })
}
