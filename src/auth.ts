import NextAuth, { type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { ZodError } from 'zod';

type LoginResponse = {
  token?: string;
  statusCode?: number;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        cpf: {},
        password: {},
      },

      authorize: async (credentials) => {
        try {
          const response = await fetch(`${process.env.API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cpf: credentials.cpf,
              password: credentials.password,
            }),
          });

          const data: LoginResponse = await response.json();

          if (!response.ok || !data || !data.token) {
            return null;
          }

          return {
            access_token: data.token ?? '',
          } as User;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.access_token) {
        session.access_token = token.access_token;
      }

      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  cookies: {
    sessionToken: {
      name: `next-auth-fmc.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: `next-auth-fmc.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `next-auth-fmc.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 dia,
  },
  debug: process.env.NODE_ENV === 'development',
});
