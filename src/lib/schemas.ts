import { NextResponse } from 'next/server'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

const nonEmptyString = z.string().trim().min(1)

const optionalString = z.string().trim().nullable().optional()

// Prisma uses cuid by default; validation is intentionally permissive (non-empty
// string) so it works with both cuid and uuid IDs.
const idField = z.string().trim().min(1)

// ---------------------------------------------------------------------------
// Article schemas
// ---------------------------------------------------------------------------

/** Shared fields present in both create and update payloads. */
const articleBodyBase = z.object({
  title: nonEmptyString.max(500),
  slug: nonEmptyString
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Lo slug deve contenere solo lettere minuscole, cifre e trattini',
    }),
  content: nonEmptyString,
  excerpt: optionalString,
  coverImageUrl: z
    .string()
    .trim()
    .url({ message: 'La URL della copertina non è valida' })
    .nullable()
    .optional(),
  published: z.boolean().optional(),
  publishedAt: z
    .string()
    .trim()
    .datetime({ message: 'La data di pubblicazione deve essere in formato ISO 8601' })
    .nullable()
    .optional(),
  categoryIds: z.array(idField).optional(),
  tagIds: z.array(idField).optional(),
  authorId: idField.optional(),
})

export const createArticleSchema = articleBodyBase

export const updateArticleSchema = articleBodyBase

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>

// ---------------------------------------------------------------------------
// User schemas
// ---------------------------------------------------------------------------

export const createUserSchema = z.object({
  name: nonEmptyString.max(200),
  email: z
    .string()
    .trim()
    .min(1, { message: "L'email è obbligatoria" })
    .email({ message: 'Formato email non valido' })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: 'La password deve avere almeno 8 caratteri' })
    .max(128, { message: 'La password non può superare i 128 caratteri' }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const patchUserSchema = z.object({
  disabled: z.boolean({ required_error: "Il campo 'disabled' è obbligatorio" }),
})

export type PatchUserInput = z.infer<typeof patchUserSchema>

// ---------------------------------------------------------------------------
// Taxonomy schemas (categories + tags share the same shape)
// ---------------------------------------------------------------------------

export const createTaxonomySchema = z.object({
  name: nonEmptyString.max(200),
})

export type CreateTaxonomyInput = z.infer<typeof createTaxonomySchema>

// ---------------------------------------------------------------------------
// Helper — parse request body with a Zod schema
// ---------------------------------------------------------------------------

type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse }

/**
 * Reads the JSON request body and validates it with the given Zod schema.
 *
 * Returns either the parsed data or a ready-to-return NextResponse with a
 * structured 400/422 error body so callers need no try/catch boilerplate.
 */
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ParseResult<T>> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Corpo della richiesta non valido' },
        { status: 400 },
      ),
    }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Dati non validi', errors },
        { status: 422 },
      ),
    }
  }

  return { success: true, data: result.data }
}
