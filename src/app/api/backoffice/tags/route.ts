import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { listTaxonomyItems, createTaxonomyItem } from '@/lib/taxonomy'

/**
 * GET /api/backoffice/tags
 *
 * Returns all tags ordered by name.
 * Any authenticated backoffice user may call this.
 */
export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }
  return listTaxonomyItems('tag')
}

/**
 * POST /api/backoffice/tags
 *
 * Creates a new tag. The slug is derived from the name.
 * Any authenticated backoffice user may create tags.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  let body: { name?: string }
  try {
    body = (await request.json()) as { name?: string }
  } catch {
    return NextResponse.json({ error: 'Corpo della richiesta non valido' }, { status: 400 })
  }

  return createTaxonomyItem('tag', body.name ?? '', 'Tag già esistente')
}
