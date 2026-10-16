import { type NextRequest, NextResponse } from 'next/server';

import { landingPathFor } from '@/lib/landing';
import { isTokenValid, SESSION_COOKIE, tokenUser } from '@/lib/session';

const authRoutes: string[] = [
  '/login',
];

const publicRoutes: string[] = [
  '/about',
  '/',
  '/visit',
  '/privacidade',
  '/termos',
  '/seja-revendedor',
  '/api/session',
];

export default function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = isTokenValid(token);

  const pathname = request.nextUrl.pathname;

  // Registration now happens in the login flow.
  if (pathname === '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isProtectedRoute = !isPublicRoute && !isAuthRoute;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && session) {
    const user = tokenUser(token);
    return NextResponse.redirect(new URL(landingPathFor(user?.role, user?.cityId), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
