import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/generate(.*)',
  '/gallery(.*)',
  '/profile(.*)',
  '/edit(.*)',
  '/upgrade(.*)',
]);

const isPublicApiRoute = createRouteMatcher([
  '/api/stripe/webhook',
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow Stripe webhook without authentication
  if (isPublicApiRoute(req)) return;
  
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
