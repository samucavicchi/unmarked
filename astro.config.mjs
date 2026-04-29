import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://unmarked.it',
  integrations: [sitemap()],

  // i18n predisposto per inglese futuro.
  // Per ora attiva solo italiano, senza prefisso URL (default locale).
  // Quando aggiungerai 'en':
  //   1. metti 'en' dentro `locales`
  //   2. crea `src/pages/en/` con le pagine tradotte
  //   3. l'italiano resta su /destinazioni, l'inglese va a /en/destinazioni
  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
