// Astro content collections — schema dei contenuti gestiti dal CMS.

import { defineCollection, z } from 'astro:content';

const libreria = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      category: z.enum(['Destinazione', 'Attrezzatura', 'Consigli di viaggio', 'Cosa portare', 'Ispirazione']).default('Destinazione'),
      country: z.string().optional(),
      continent: z.enum(['Europa', 'Asia', 'Africa', 'Americhe', 'Oceania']).optional(),
      region: z.string().optional(),
      coverImage: image(),
      coverImageAlt: z.string(),
      excerpt: z.string(),
      publishDate: z.date(),
      featured: z.boolean().default(false),
      seoMetaDescription: z.string().optional(),

      // Wow pack: arricchimento editoriale opzionale
      interludeImage: image().optional(),
      interludeCaption: z.string().optional(),
      pullQuote: z.string().optional(),
      bodyText2: z.string().optional(),
      gallery2: z
        .array(
          z.object({
            image: image(),
            caption: z.string().optional(),
          })
        )
        .optional(),
      essentialToKnow: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
          })
        )
        .optional(),
      mapCenter: z
        .object({
          lat: z.preprocess(v => (v === '' || v === null) ? undefined : v, z.number().optional()),
          lng: z.preprocess(v => (v === '' || v === null) ? undefined : v, z.number().optional()),
          zoom: z.number().default(8),
        })
        .optional(),
      mapMarkers: z
        .array(
          z.object({
            lat: z.number(),
            lng: z.number(),
            label: z.string(),
          })
        )
        .default([]),
      // Schede editoriali (campo+testo libero, stile blocchi Spotsbook)
      schede: z.array(z.object({
        label: z.string(),
        text: z.string(),
      })).optional(),
      // Slug dell'itinerario correlato per il blocco CTA "C'è un itinerario per questo posto"
      relatedItinerary: z.string().optional(),
    }),
});

const itinerari = defineCollection({
  type: 'content',
  schema: ({ image }) => {
    // Sotto-schema per item di "Vale il viaggio" (Step B)
    const valeItem = z.object({
      name: z.string(),
      badge: z.enum(['must', 'good', 'hidden']).default('must'),
      location: z.string().optional(),
      description: z.string(),
      tip: z.string().optional(),
      price: z.string().optional(),
    });
    // Sotto-schema per item di "Mainstream check" (Step B)
    const msItem = z.object({
      name: z.string(),
      type: z.string().optional(),
      rating: z.number().int().min(1).max(5),
      verdict: z.string(),
      alternative: z
        .object({
          name: z.string(),
          reason: z.string(),
        })
        .optional(),
      distance: z.string().optional(),
    });
    return z.object({
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
      // Legacy: testi liberi (rimangono come fallback per i contenuti vecchi)
      valeIlViaggio: z.string().optional(),
      mainstreamCheck: z.string().optional(),
      // Step B: strutture
      vale: z
        .object({
          intro: z.string().optional(),
          dormire: z.array(valeItem).optional(),
          mangiare: z.array(valeItem).optional(),
          tappe: z.array(valeItem).optional(),
        })
        .optional(),
      mainstream: z
        .object({
          intro: z.string().optional(),
          items: z.array(msItem),
        })
        .optional(),
      gallery: z
        .array(
          z.object({
            image: image(),
            caption: z.string().optional(),
            wide: z.boolean().default(false),
          })
        )
        .optional(),
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
            gallery: z
              .array(
                z.object({
                  image: image(),
                  caption: z.string().optional(),
                })
              )
              .optional(),
          })
        )
        .default([]),
      mapCenter: z
        .object({
          lat: z.preprocess(v => (v === '' || v === null) ? undefined : v, z.number().optional()),
          lng: z.preprocess(v => (v === '' || v === null) ? undefined : v, z.number().optional()),
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
    });
  },
});

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
      youtubeId: z.string(),
      duration: z.number().int().positive(),
      type: z.enum(['Documentario', 'Cortometraggio', 'Reportage', 'Essay', 'Trailer']),
    }),
});

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
      spotifyEpisodeId: z.string(),
      audioUrl: z.string().optional(),
      episodeNumber: z.number().int().positive(),
      duration: z.number().int().positive(),
      topic: z.enum(['Destinazioni', 'Pratiche', 'Fotografia', 'Storie', 'Interviste']),
      guests: z.string().optional(),
    }),
});

const blackbook = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    country: z.string(),
    region: z.string().optional(),
    continent: z.enum(['Europa', 'Asia', 'Africa', 'Americhe', 'Oceania']),
    type: z.enum(['Wildlife', 'Paesaggio', 'Golden hour', 'Blue hour', 'Architettura', 'Persone']),
    lat: z.number(),
    lng: z.number(),
    publishDate: z.date(),
    status: z.enum(['published', 'coming_soon']).default('published'),
    // Ora e stagione
    bestTime: z.string().optional(),         // es. "06:15 – 07:45"
    bestSeason: z.string().optional(),       // es. "Giugno – Settembre"
    // Dati tecnici
    focalLength: z.string().optional(),      // es. "200–400mm"
    isoRange: z.string().optional(),         // es. "3200–6400"
    access: z.string().optional(),           // es. "35 min a piedi, guida obbligatoria"
    difficulty: z.enum(['Bassa', 'Media', 'Alta']).optional(),       // difficoltà fotografica
    avvicinamento: z.enum(['Bassa', 'Media', 'Alta']).optional(),   // difficoltà di avvicinamento
    // Annotazioni a mano (frecce, note brevi)
    handnotes: z.array(z.string()).default([]),
    // Checklist pratica (consigli logistici)
    checklist: z.array(z.string()).default([]),
    // Attrezzatura consigliata (selezione fissa)
    equipment: z.array(z.enum(['Treppiede', 'Filtri', 'Grandangolo', 'Tele', 'Lente luminosa', 'Cover impermeabile'])).default([]),
    // Anti-mainstream
    antiMainstream: z.string().optional(),
    // Nota personale (stellina)
    personalNote: z.string().optional(),
    // Coordinate testuali
    coordinates: z.string().optional(),      // es. "-1.0333, 29.6833 · Bwindi NP"
    // Galleria immagini overlay
    images: z.array(z.object({
      src: z.string(),
      alt: z.string().optional(),
    })).default([]),
  }),
});

export const collections = {
  libreria,
  itinerari,
  film,
  podcast,
  blackbook,
};
