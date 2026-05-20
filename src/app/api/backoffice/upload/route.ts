import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { authOptions } from '@/lib/auth'
import { uploadFile } from '@/lib/storage'

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

/** Maximum allowed upload size: 10 MB */
const MAX_SIZE_BYTES = 10 * 1024 * 1024

/**
 * POST /api/backoffice/upload
 *
 * Accepts a multipart/form-data request with a single `file` field.
 * Validates the file type (JPEG, PNG, WebP, GIF, AVIF) and size (≤ 10 MB),
 * uploads it to GCS, and returns the resulting public URL.
 *
 * Protected: only authenticated backoffice users may call this endpoint.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Nessun file fornito' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Tipo di file non supportato. Usa JPEG, PNG, WebP, GIF o AVIF.' },
      { status: 422 },
    )
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Il file supera la dimensione massima di ${MAX_SIZE_BYTES / 1024 / 1024} MB.` },
      { status: 422 },
    )
  }

  const ext = EXTENSION_MAP[file.type] ?? 'bin'
  const filename = `covers/${Date.now()}-${randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const url = await uploadFile(filename, buffer, file.type)

  return NextResponse.json({ url }, { status: 201 })
}
