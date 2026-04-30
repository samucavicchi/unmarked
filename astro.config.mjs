import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://unmarked.it',

  // Sitemap rimosso per ora — riaggiunto in Sessione 3
  // (bug @astrojs/sitemap con i18n single-locale)

  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
