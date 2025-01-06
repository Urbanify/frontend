/* eslint-disable ts/consistent-type-definitions */
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    access_token: string | null;
  }

  interface Session {
    access_token: (string & DefaultSession) | any;
  }

  interface JWT {
    access_token: string & DefaultJWT;
  }
}
