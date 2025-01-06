import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  type Session = {
    error?: 'RefreshAccessTokenError';
    token: string;
  } & DefaultSession;
  type User = {
    token: string;
  } & DefaultUser;
}
declare module 'next-auth/jwt' {
  type JWT = {
    exp: number;
    token: string;
    error?: 'RefreshAccessTokenError';
  } & DefaultJWT;
}
