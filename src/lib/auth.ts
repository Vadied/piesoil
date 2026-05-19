import type { NextAuthOptions } from 'next-auth'

// Authentication configuration shared between the NextAuth route handler and
// server-side session helpers.  Providers and callbacks are configured here.
export const authOptions: NextAuthOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
}
