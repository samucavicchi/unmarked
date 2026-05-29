// netlify/functions/stripe-webhook.ts
// Webhook Stripe: ascolta gli eventi di pagamento completato
// e aggiorna i metadati dell'utente Clerk di conseguenza.
//
// Endpoint: POST /.netlify/functions/stripe-webhook
// Configura su Stripe Dashboard → Developers → Webhooks:
//   URL: https://unmarked.it/.netlify/functions/stripe-webhook
//   Events: checkout.session.completed, customer.subscription.deleted

import Stripe from 'stripe';
import { createClerkClient } from '@clerk/backend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export const handler = async (event: {
  body: string | null;
  headers: Record<string, string>;
  httpMethod: string;
}) => {
  // Solo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  if (!sig) {
    return { statusCode: 400, body: 'Missing stripe-signature header' };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body ?? '',
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[webhook] Firma non valida:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // ── checkout.session.completed ──────────────────────────────────────────
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};
    const userId = session.client_reference_id ?? meta.userId ?? null;

    if (!userId) {
      // Pagamento anonimo — non possiamo aggiornare un account
      // In futuro: invia email con link di accesso
      console.warn('[webhook] Pagamento completato senza userId');
      return { statusCode: 200, body: JSON.stringify({ received: true, note: 'no userId' }) };
    }

    try {
      if (meta.type === 'subscription') {
        // Abbonamento: marca l'utente come isPremium
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: {
            isPremium: true,
            plan: 'subscription',
            stripeSubscriptionId: session.subscription as string ?? null,
            stripeCustomerId: session.customer as string ?? null,
          },
        });
        console.log(`[webhook] Abbonamento attivato per utente ${userId}`);
      } else if (meta.type === 'single') {
        // Acquisto singolo: aggiungi lo slug alla lista acquistati
        const user = await clerk.users.getUser(userId);
        const existing = (user.publicMetadata?.purchasedItinerari as string[]) ?? [];
        const slug = meta.slug;

        if (slug && !existing.includes(slug)) {
          existing.push(slug);
        }

        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: {
            ...user.publicMetadata,
            purchasedItinerari: existing,
            stripeCustomerId: session.customer as string ?? (user.publicMetadata?.stripeCustomerId ?? null),
          },
        });
        console.log(`[webhook] Itinerario "${slug}" sbloccato per utente ${userId}`);
      }
    } catch (err: any) {
      console.error('[webhook] Errore aggiornamento Clerk:', err.message);
      // Ritorna 200 a Stripe anche in caso di errore Clerk
      // per evitare retry infiniti — logga e monitora a parte
      return {
        statusCode: 200,
        body: JSON.stringify({ received: true, clerkError: err.message }),
      };
    }
  }

  // ── customer.subscription.deleted ──────────────────────────────────────
  if (stripeEvent.type === 'customer.subscription.deleted') {
    const subscription = stripeEvent.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Trova l'utente Clerk dal customer ID Stripe
    try {
      const { data: users } = await clerk.users.getUserList({
        limit: 10,
      });

      const user = users.find(
        (u) => (u.publicMetadata?.stripeCustomerId as string) === customerId
      );

      if (user) {
        await clerk.users.updateUserMetadata(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            isPremium: false,
            plan: null,
            stripeSubscriptionId: null,
          },
        });
        console.log(`[webhook] Abbonamento cancellato per utente ${user.id}`);
      } else {
        console.warn(`[webhook] Nessun utente trovato per customer ${customerId}`);
      }
    } catch (err: any) {
      console.error('[webhook] Errore disattivazione abbonamento:', err.message);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
