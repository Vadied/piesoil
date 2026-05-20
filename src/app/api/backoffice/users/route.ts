import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createUserSchema, parseBody } from '@/lib/schemas'

/**
 * GET /api/backoffice/users
 *
 * Returns all co-editor accounts. Accessible to ADMIN only.
 */
export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    where: { role: 'CO_EDITOR' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      disabled: true,
      createdAt: true,
      _count: { select: { articles: true } },
    },
  })

  return NextResponse.json({
    data: users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    })),
  })
}

/**
 * POST /api/backoffice/users
 *
 * Creates a new co-editor account. The password is hashed before storage.
 * Accessible to ADMIN only.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
  }

  const parsed = await parseBody(request, createUserSchema)
  if (!parsed.success) return parsed.response

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
  if (existing) {
    return NextResponse.json(
      { error: 'Esiste già un account con questa email' },
      { status: 409 },
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CO_EDITOR',
      },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'Esiste già un account con questa email' },
        { status: 409 },
      )
    }
    throw err
  }
}
