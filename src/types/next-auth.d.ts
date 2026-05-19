import type { UserRole } from '@prisma/client'
import type { DefaultSession } from 'next-auth'

// Augment the built-in Session and JWT types to expose the database user id
// and role so server components and API routes can read them without casting.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    // Optional because the role is written into the token during the jwt
    // callback — it is absent on the very first invocation for OAuth users
    // until the DB lookup completes.
    role?: UserRole
  }
}
