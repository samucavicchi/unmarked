import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://unmarked.it',

  // Hybrid: le pagine statiche restano statiche (prerender: true di default)
  // Le pagine SSR usano export const prerender = false
  output: 'hybrid',
  adapter: netlify(),

  integrations: [
    clerk({
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
    }),
  ],

  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
