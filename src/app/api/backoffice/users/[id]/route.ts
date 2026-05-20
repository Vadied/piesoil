import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

type RouteContext = { params: { id: string } }

/**
 * PATCH /api/backoffice/users/:id
 *
 * Toggles the disabled flag on a co-editor account.
 * Body: { disabled: boolean }
 * Accessible to ADMIN only. An admin cannot disable their own account.
 */
export async function PATCH(request: Request, { params }: RouteContext): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
  }

  if (params.id === session.user.id) {
    return NextResponse.json(
      { error: 'Non puoi modificare il tuo stesso account' },
      { status: 400 },
    )
  }

  const target = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, role: true },
  })

  if (!target) {
    return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 })
  }

  if (target.role === 'ADMIN') {
    return NextResponse.json(
      { error: 'Non è possibile modificare account admin' },
      { status: 400 },
    )
  }

  let body: { disabled?: boolean }
  try {
    body = (await request.json()) as { disabled?: boolean }
  } catch {
    return NextResponse.json({ error: 'Corpo della richiesta non valido' }, { status: 400 })
  }

  if (typeof body.disabled !== 'boolean') {
    return NextResponse.json({ error: "Il campo 'disabled' è obbligatorio" }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { disabled: body.disabled },
    select: { id: true, disabled: true },
  })

  return NextResponse.json({ data: updated })
}

/**
 * DELETE /api/backoffice/users/:id
 *
 * Permanently deletes a co-editor account.
 * Accessible to ADMIN only. An admin cannot delete their own account.
 * Deletion is blocked if the user has authored articles (Prisma Restrict).
 */
export async function DELETE(_req: Request, { params }: RouteContext): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
  }

  if (params.id === session.user.id) {
    return NextResponse.json(
      { error: 'Non puoi eliminare il tuo stesso account' },
      { status: 400 },
    )
  }

  const target = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, role: true, _count: { select: { articles: true } } },
  })

  if (!target) {
    return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 })
  }

  if (target.role === 'ADMIN') {
    return NextResponse.json(
      { error: 'Non è possibile eliminare account admin' },
      { status: 400 },
    )
  }

  if (target._count.articles > 0) {
    return NextResponse.json(
      {
        error: `Impossibile eliminare: l'utente ha ${target._count.articles} articol${target._count.articles === 1 ? 'o' : 'i'} associat${target._count.articles === 1 ? 'o' : 'i'}. Eliminali prima.`,
      },
      { status: 409 },
    )
  }

  await prisma.user.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
