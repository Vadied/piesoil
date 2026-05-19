import type { DefaultSession } from 'next-auth'

// Augment the built-in Session type to expose the database user id on
// session.user so server components and API routes can read it without
// casting.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
