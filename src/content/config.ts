// Astro content collections — schema dei contenuti gestiti dal CMS.

import { defineCollection, z } from 'astro:content';

const destinazioni = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      country: z.string(),
      continent: z.enum(['Europa', 'Asia', 'Africa', 'Americhe', 'Oceania']),
      region: z.string().optional(),
      coverImage: image(),
      coverImageAlt: z.string(),
      excerpt: z.string(),
      publishDate: z.date(),
      featured: z.boolean().default(false),
      seoMetaDescription: z.string().optional(),
    }),
});

const itinerari = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      // Identità
      title: z.string(),
      subtitle: z.string().optional(),
      country: z.string(),
      continent: z.enum(['Europa', 'Asia', 'Africa', 'Americhe', 'Oceania']),
      coverImage: image(),
      coverImageAlt: z.string(),
      excerpt: z.string(),
      publishDate: z.date(),
      featured: z.boolean().default(false),

      // Meta-row (mostrato sotto il titolo)
      duration: z.number().int().positive(),
      budget: z.enum(['Economico', 'Medio', 'Alto']),
      difficulty: z.enum(['Facile', 'Medio', 'Avventura']),
      bestSeason: z.string(),
      transport: z.string(),
      price: z.number().positive(),

      // Pagamento (Sessione 6)
      lemonSqueezyProductId: z.string().optional(),
      lemonSqueezyCheckoutUrl: z.string().url().optional(),

      // Sezioni editoriali (free)
      valeIlViaggio: z.string().optional(),
      mainstreamCheck: z.string().optional(),

      // Giorni — alcuni gratis (isPremium=false), altri premium
      days: z
        .array(
          z.object({
            dayNumber: z.number().int().positive(),
            title: z.string(),
            description: z.string(),
            kmTotali: z.number().optional(),
            dislivello: z.string().optional(),
            dormire: z.string().optional(),
            mangiare: z.string().optional(),
            isPremium: z.boolean().default(false),
          })
        )
        .default([]),

      // Mappa Leaflet
      mapCenter: z
        .object({
          lat: z.number(),
          lng: z.number(),
          zoom: z.number().default(8),
        })
        .optional(),

      mapMarkers: z
        .array(
          z.object({
            lat: z.number(),
            lng: z.number(),
            label: z.string(),
            dayNumber: z.number().int().optional(),
          })
        )
        .default([]),

      // Contatti locali (premium)
      localContacts: z
        .array(
          z.object({
            name: z.string(),
            role: z.string(),
            contact: z.string(),
            notes: z.string().optional(),
          })
        )
        .default([]),
    }),
});

export const collections = {
  destinazioni,
  itinerari,
};
