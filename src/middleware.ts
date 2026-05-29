import { clerkMiddleware } from '@clerk/astro/server';
import { defineMiddleware, sequence } from 'astro:middleware';

// Clerk middleware — avvolto in try/catch per evitare 500 se le env var sono errate
const clerkHandler = clerkMiddleware((_auth, _context) => {
  // Lascia passare tutte le richieste — la verifica premium
  // avviene dentro la pagina SSR con locals.currentUser()
});

const safeClerkMiddleware = defineMiddleware(async (context, next) => {
  try {
    return await clerkHandler(context, next);
  } catch (err) {
    console.error('[middleware] Clerk initialization error:', err);
    return next();
  }
});

export const onRequest = safeClerkMiddleware;
