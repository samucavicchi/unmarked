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
      title: z.string(),
      subtitle: z.string().optional(),
      country: z.string(),
      continent: z.enum(['Europa', 'Asia', 'Africa', 'Americhe', 'Oceania']),
      coverImage: image(),
      coverImageAlt: z.string(),
      excerpt: z.string(),
      publishDate: z.date(),
      featured: z.boolean().default(false),
      duration: z.number().int().positive(),
      budget: z.enum(['Economico', 'Medio', 'Alto']),
      difficulty: z.enum(['Facile', 'Medio', 'Avventura']),
      bestSeason: z.string(),
      transport: z.string(),
      price: z.number().positive(),
      lemonSqueezyProductId: z.string().optional(),
      lemonSqueezyCheckoutUrl: z.string().url().optional(),
      valeIlViaggio: z.string().optional(),
      mainstreamCheck: z.string().optional(),
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

// Film — video pubblicati su YouTube. Embed via iframe.
const film = defineCollection({
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
      featured: z.boolean().default(false),

      // YouTube
      youtubeId: z.string(),
      duration: z.number().int().positive(),
      type: z.enum(['Documentario', 'Cortometraggio', 'Reportage', 'Essay', 'Trailer']),
    }),
});

// Podcast — episodi distribuiti via Spotify. Embed via iframe Spotify.
const podcast = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      excerpt: z.string(),
      publishDate: z.date(),
      featured: z.boolean().default(false),

      // Spotify
      spotifyEpisodeId: z.string(),
      episodeNumber: z.number().int().positive(),
      duration: z.number().int().positive(),
      topic: z.enum(['Destinazioni', 'Pratiche', 'Fotografia', 'Storie', 'Interviste']),
      guests: z.string().optional(),
    }),
});

export const collections = {
  destinazioni,
  itinerari,
  film,
  podcast,
};
