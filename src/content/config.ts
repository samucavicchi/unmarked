// Astro content collections — schema dei contenuti gestiti dal CMS.
// Astro genera tipi TypeScript automaticamente da questi schemi,
// così le pagine che usano getCollection() hanno autocomplete e validazione.

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
      title: z.string(),
      subtitle: z.string().optional(),
      country: z.string(),
      continent: z.enum(['Europa', 'Asia', 'Africa', 'Americhe', 'Oceania']),
      coverImage: image(),
      coverImageAlt: z.string(),
      excerpt: z.string(),
      publishDate: z.date(),

      // meta-row
      duration: z.number(),
      budget: z.enum(['Economico', 'Medio', 'Alto']),
      difficulty: z.enum(['Facile', 'Medio', 'Avventura']),
      bestSeason: z.string(),
      transport: z.string(),
      price: z.number(),

      // pagamento
      lemonSqueezyProductId: z.string().optional(),

      // preview-only fields per ora.
      valeIlViaggio: z.string().optional(),
      mainstreamCheck: z.string().optional(),
    }),
});

export const collections = {
  destinazioni,
  itinerari,
};
