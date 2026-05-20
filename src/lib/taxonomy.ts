import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slugify'

/**
 * Returns all taxonomy items (categories or tags) ordered by name.
 * Extracted to eliminate the byte-for-byte duplicate between
 * /api/backoffice/categories and /api/backoffice/tags route handlers.
 */
export async function listTaxonomyItems(
  model: 'category' | 'tag',
): Promise<NextResponse> {
  const items =
    model === 'category'
      ? await prisma.category.findMany({
          orderBy: { name: 'asc' },
          select: { id: true, name: true, slug: true },
        })
      : await prisma.tag.findMany({
          orderBy: { name: 'asc' },
          select: { id: true, name: true, slug: true },
        })
  return NextResponse.json({ data: items })
}

/**
 * Creates a taxonomy item with a slug derived from the name.
 * Returns 409 on duplicate name/slug (Prisma P2002).
 */
export async function createTaxonomyItem(
  model: 'category' | 'tag',
  rawName: string,
  duplicateMessage: string,
): Promise<NextResponse> {
  const name = rawName.trim()
  if (!name) {
    return NextResponse.json({ error: 'Il nome è obbligatorio' }, { status: 400 })
  }

  const slug = slugify(name)
  if (!slug) {
    return NextResponse.json(
      { error: 'Nome non valido per la generazione dello slug' },
      { status: 400 },
    )
  }

  try {
    const item =
      model === 'category'
        ? await prisma.category.create({
            data: { name, slug },
            select: { id: true, name: true, slug: true },
          })
        : await prisma.tag.create({
            data: { name, slug },
            select: { id: true, name: true, slug: true },
          })
    return NextResponse.json({ data: item }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: duplicateMessage }, { status: 409 })
    }
    throw err
  }
}
