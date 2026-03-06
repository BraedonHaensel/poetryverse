import { DefaultSession, getServerSession, NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'
import { Session } from 'inspector/promises'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string | null
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env['NEXT_AUTH_SECRET'],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token }) => {
      const db_user = await prisma.user.findFirst({
        where: {
          email: token?.email,
        },
      })
      if (db_user) {
        token.id = db_user.id
        token.username = db_user.username ?? null
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.picture
        session.user.username = token.username ?? null
      }
      return session
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID'] as string,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] as string,
      authorization: {
        params: {
          prompt: 'select_account', // Forces Google account picker every time
        },
      },
    }),
  ],
}

export const getAuthSession = () => {
  return getServerSession(authOptions)
}
