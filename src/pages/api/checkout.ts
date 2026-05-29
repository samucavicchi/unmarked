// src/pages/api/checkout.ts
// Endpoint SSR — crea una Stripe Checkout Session e restituisce l'URL.
// POST /api/checkout
// Body: { type: 'subscription' | 'single', slug?: string, price?: number, title?: string }

export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-11-20.acacia',
});

export const POST: APIRoute = async ({ request, locals, url }) => {
  try {
    const body = await request.json();
    const { type, slug, price, title } = body as {
      type: 'subscription' | 'single';
      slug?: string;
      price?: number;
      title?: string;
    };

    // Auth — utente loggato (opzionale: il pagamento funziona anche senza account)
    const auth = locals.auth();
    const userId = auth?.userId ?? null;

    const origin = url.origin;
    const successUrl = slug
      ? `${origin}/itinerari/${slug}?upgraded=1`
      : `${origin}/?upgraded=1`;
    const cancelUrl = slug
      ? `${origin}/itinerari/${slug}`
      : `${origin}/`;

    let session: Stripe.Checkout.Session;

    if (type === 'subscription') {
      // Abbonamento mensile €29 — price ID configurato in Netlify env
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: import.meta.env.STRIPE_SUBSCRIPTION_PRICE_ID as string,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(userId ? { client_reference_id: userId } : {}),
        metadata: {
          type: 'subscription',
          slug: slug ?? '',
          userId: userId ?? '',
        },
        allow_promotion_codes: true,
        locale: 'it',
      });
    } else {
      // Acquisto singolo itinerario
      if (!price || !slug) {
        return new Response(
          JSON.stringify({ error: 'slug e price sono obbligatori per acquisto singolo' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: title ? `Itinerario: ${title}` : `Itinerario ${slug}`,
                description: 'Accesso permanente a questo itinerario Unmarked',
              },
              unit_amount: Math.round(price * 100), // centesimi
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(userId ? { client_reference_id: userId } : {}),
        metadata: {
          type: 'single',
          slug,
          userId: userId ?? '',
        },
        allow_promotion_codes: true,
        locale: 'it',
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[checkout] Stripe error:', err);
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Errore interno' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
