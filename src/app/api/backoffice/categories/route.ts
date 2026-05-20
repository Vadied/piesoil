import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { listTaxonomyItems, createTaxonomyItem } from '@/lib/taxonomy'
import { createTaxonomySchema, parseBody } from '@/lib/schemas'

/**
 * GET /api/backoffice/categories
 *
 * Returns all categories ordered by name.
 * Any authenticated backoffice user may call this.
 */
export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }
  return listTaxonomyItems('category')
}

/**
 * POST /api/backoffice/categories
 *
 * Creates a new category. The slug is derived from the name.
 * Any authenticated backoffice user may create categories.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const parsed = await parseBody(request, createTaxonomySchema)
  if (!parsed.success) return parsed.response

  return createTaxonomyItem('category', parsed.data.name, 'Categoria già esistente')
}
