export { auth as middleware } from '@/auth';

// import type { NextFetchEvent, NextRequest } from 'next/server';

// // const isProtectedRoute = createRouteMatcher([
// //   '/dashboard(.*)',
// //   '/:locale/dashboard(.*)',
// // ]);

// // const isAuthPage = createRouteMatcher([
// //   '/sign-in(.*)',
// //   '/:locale/sign-in(.*)',
// //   '/sign-up(.*)',
// //   '/:locale/sign-up(.*)',
// // ]);

// export default function middleware(
//   _request: NextRequest,
//   _event: NextFetchEvent,
// ) {
//   // Run Clerk middleware only when it's necessary
//   // if (
//   //   isAuthPage(request) || isProtectedRoute(request)
//   // ) {
//   //   return clerkMiddleware(async (auth, req) => {
//   //     if (isProtectedRoute(req)) {
//   //       const locale
//   //         = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';
//   //       const signInUrl = new URL(`${locale}/sign-in`, req.url);
//   //       await auth.protect({
//   //         // `unauthenticatedUrl` is needed to avoid error: "Unable to find `next-intl` locale because the middleware didn't run on this request"
//   //         unauthenticatedUrl: signInUrl.toString(),
//   //       });
//   //     }
//   //     return intlMiddleware(req);
//   //   })(request, event);
//   // }
//   // return intlMiddleware(request);
// }

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };
