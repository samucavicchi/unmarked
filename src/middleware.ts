import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Route che richiedono autenticazione per contenuto completo
// (il paywall client-side rimane come fallback visivo)
const isProtectedRoute = createRouteMatcher([
  '/itinerari/(.*)',
]);

export const onRequest = clerkMiddleware((auth, context) => {
  // Lascia passare tutte le richieste — la verifica premium
  // avviene dentro la pagina SSR con auth().sessionClaims
  // Clerk popola context.locals.auth() in automatico
});
