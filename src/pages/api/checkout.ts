// src/pages/api/checkout.ts
// Endpoint SSR — crea una Stripe Checkout Session e restituisce l'URL.
// POST /api/checkout
// Body: { type: 'subscription' | 'single' | 'shop', slug?: string, price?: number, title?: string, productId?: string }

export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { shopProducts } from '../../data/shop-data';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-11-20.acacia',
});

export const POST: APIRoute = async ({ request, locals, url }) => {
  try {
    const body = await request.json();
    const { type, slug, price, title, productId, variantPriceId } = body as {
      type: 'subscription' | 'single' | 'shop';
      slug?: string;
      price?: number;
      title?: string;
      productId?: string;
      variantPriceId?: string; // Price ID variante (es. formato stampa A4/A3/A2)
    };

    // Auth — utente loggato (opzionale: il pagamento funziona anche senza account)
    let userId: string | null = null;
    try {
      const auth = typeof locals.auth === 'function' ? locals.auth() : null;
      userId = auth?.userId ?? null;
    } catch (_authErr) {
      // Clerk non disponibile — procedi senza userId
    }

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
    } else if (type === 'single') {
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
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(userId ? { client_reference_id: userId } : {}),
        metadata: { type: 'single', slug, userId: userId ?? '' },
        allow_promotion_codes: true,
        locale: 'it',
      });
    } else if (type === 'shop') {
      // Acquisto prodotto shop (digitale o fisico)
      const product = shopProducts.find(p => p.id === productId);
      if (!product) {
        return new Response(JSON.stringify({ error: 'Prodotto non trovato' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }

      const isDigital = product.type === 'digital';
      const shopSuccessUrl = isDigital
        ? `${origin}/download?session={CHECKOUT_SESSION_ID}`
        : `${origin}/shop/grazie?session={CHECKOUT_SESSION_ID}`;

      // Usa il price ID della variante selezionata (es. A4/A3/A2), altrimenti quello base del prodotto
      const activePriceId = variantPriceId ?? product.stripePriceId;

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: activePriceId, quantity: 1 }],
        success_url: shopSuccessUrl,
        cancel_url: `${origin}/shop`,
        ...(isDigital ? {} : {
          shipping_address_collection: {
            allowed_countries: product.shippingCountries?.length
              ? (product.shippingCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[])
              : ['IT', 'AT', 'BE', 'CH', 'DE', 'ES', 'FR', 'GB', 'NL', 'PT', 'SE', 'US', 'CA', 'AU'],
          },
        }),
        ...(userId ? { client_reference_id: userId } : {}),
        metadata: {
          type: 'shop',
          productId: product.id,
          productType: product.type,
          userId: userId ?? '',
        },
        locale: 'it',
      });
    } else {
      return new Response(JSON.stringify({ error: 'Tipo non valido' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
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
