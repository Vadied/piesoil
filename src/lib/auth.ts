import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import type { UserRole } from '@prisma/client'
import { prisma } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
            role: true,
            disabled: true,
          },
        })

        if (!user || !user.password) {
          return null
        }

        if (user.disabled) {
          return null
        }

        const passwordValid = await bcrypt.compare(credentials.password, user.password)

        if (!passwordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/backoffice/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Role is present on credentials sign-in; absent on first OAuth sign-in
        // because the adapter User type does not carry custom fields.
        const withRole = user as typeof user & { role?: UserRole }
        if (withRole.role) {
          token.role = withRole.role
        }
      }
      // Fetch the role (and disabled status) from the database when the role is
      // not yet in the token. This covers the first OAuth sign-in as well as
      // token refreshes where an older token predates the role field.
      if (!token.role && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, disabled: true },
        })
        if (dbUser) {
          if (dbUser.disabled) {
            // Strip the role so the session callback leaves session.user.role
            // unpopulated, which causes all admin/role checks to deny access.
            return { ...token, error: 'AccountDisabled' }
          }
          token.role = dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // id must always be set; it is independent of role availability.
        session.user.id = token.sub ?? token.id
        if (token.role) {
          session.user.role = token.role
        }
      }
      return session
    },
  },
}
