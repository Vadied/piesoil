import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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

type CreateUserBody = {
  name?: string
  email?: string
  password?: string
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

  let body: CreateUserBody
  try {
    body = (await request.json()) as CreateUserBody
  } catch {
    return NextResponse.json({ error: 'Corpo della richiesta non valido' }, { status: 400 })
  }

  const { name, email, password } = body

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json(
      { error: 'Nome, email e password sono obbligatori' },
      { status: 400 },
    )
  }

  const emailLower = email.trim().toLowerCase()

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
    return NextResponse.json({ error: 'Formato email non valido' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'La password deve avere almeno 8 caratteri' },
      { status: 400 },
    )
  }

  const existing = await prisma.user.findUnique({
    where: { email: emailLower },
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
        name: name.trim(),
        email: emailLower,
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
