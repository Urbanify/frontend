import NextAuth, { type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { ZodError } from 'zod';

import { Env } from './libs/Env';
import { loginSchema } from './schemas/auth/login.schema';

type LoginResponse = {
  token: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        cpf: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { cpf, password } = await loginSchema.parseAsync(credentials);

          const response = await fetch(`${Env.API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cpf,
              password,
            }),
          });
          const data: LoginResponse = await response.json();

          if (!data) {
            // No user found, so this is their first attempt to login
            // Optionally, this is also the place you could do a user registration
            return null;
          }

          // return user object with their profile data
          return {
            token: data.token,
          } as User;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },

    }),
  ],

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
