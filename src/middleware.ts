import { clerkMiddleware } from '@clerk/astro/server';
import { defineMiddleware, sequence } from 'astro:middleware';
import { features } from './data/features';

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

// Sezioni nascoste (src/data/features.ts): redirect alla home per le pagine SSR
// coinvolte: /itinerari/[slug], /pro, /sign-in, /sign-up, /account. Le pagine statiche (archivi, filtri, .kml, consulenze)
// sono coperte dai redirect in netlify.toml. Il match è volutamente stretto perché il
// middleware gira anche durante la build delle pagine statiche.
const ITINERARIO_SSR = /^\/itinerari\/[^/.]+\/?$/;
const PRO_SSR = /^\/pro\/?$/;
const ACCOUNT_SSR = /^\/(sign-in|sign-up|account)(\/.*)?$/;
const hiddenSections = defineMiddleware(async (context, next) => {
  const p = context.url.pathname;
  if (
    (!features.itinerari && ITINERARIO_SSR.test(p)) ||
    (!features.pro && PRO_SSR.test(p)) ||
    (!features.account && ACCOUNT_SSR.test(p))
  ) {
    return context.redirect('/', 302);
  }
  return next();
});

export const onRequest = sequence(hiddenSections, safeClerkMiddleware);
