// src/data/shop-data.ts
// Catalogo prodotti Unmarked Shop.
// Per ogni prodotto:
//   1. Crea il prodotto su Stripe Dashboard (Products → Add product)
//   2. Copia il Price ID (price_xxx) nel campo stripePriceId
//   3. Per i digitali: carica il file in public/downloads/ e aggiorna downloadPath
//   4. Aggiungi l'immagine in public/shop/

export type ShopProduct = {
  id: string;
  title: string;
  subtitle: string;
  type: 'digital' | 'physical';
  price: number; // EUR, intero (es. 29)
  stripePriceId: string; // ← da aggiornare con ID reale da Stripe
  image: string; // path relativo a /public/
  description: string;
  badge?: string; // es. "Nuovo", "Bestseller"
  available: boolean;
  // Solo per digitali
  downloadPath?: string; // es. '/downloads/preset-pack.zip'
  // Solo per fisici
  shipping?: true;
  shippingCountries?: string[]; // es. ['IT', 'DE', 'FR'] — vuoto = worldwide
};

export const shopProducts: ShopProduct[] = [
  // ─── DIGITALI ────────────────────────────────────────────────
  {
    id: 'preset-desert-light',
    title: 'Desert Light',
    subtitle: 'Preset Pack — Namibia + Islanda',
    type: 'digital',
    price: 29,
    stripePriceId: 'price_SOSTITUISCI_CON_ID_STRIPE', // ← Stripe Dashboard
    image: '/shop/preset-desert-light.jpg',
    description: '18 preset Lightroom per luce desertica e artica. Calibrati su Sony, Nikon e Canon. Compatibili con Lightroom Classic, CC e mobile.',
    badge: 'Bestseller',
    available: true,
    downloadPath: '/downloads/desert-light-presets.zip',
  },

  // ─── FISICI ──────────────────────────────────────────────────
  {
    id: 'print-namibia-dune',
    title: 'Namibia — Le dune',
    subtitle: 'Fine Art Print · 30×40 cm',
    type: 'physical',
    price: 89,
    stripePriceId: 'price_SOSTITUISCI_CON_ID_STRIPE', // ← Stripe Dashboard
    image: '/shop/print-namibia-dune.jpg',
    description: 'Stampa fine art su carta Hahnemühle Photo Rag 308g. Tiratura limitata 50 esemplari. Firmata e numerata. Consegnata con certificato di autenticità.',
    badge: 'Edizione limitata',
    available: true,
    shipping: true,
    shippingCountries: [],
  },
  {
    id: 'print-islanda-aldeyarfoss',
    title: 'Islanda — Aldeyarfoss',
    subtitle: 'Fine Art Print · 30×40 cm',
    type: 'physical',
    price: 89,
    stripePriceId: 'price_SOSTITUISCI_CON_ID_STRIPE', // ← Stripe Dashboard
    image: '/shop/print-islanda-aldeyarfoss.jpg',
    description: 'Stampa fine art su carta Hahnemühle Photo Rag 308g. Tiratura limitata 50 esemplari. Firmata e numerata. Consegnata con certificato di autenticità.',
    available: true,
    shipping: true,
    shippingCountries: [],
  },
  {
    id: 'tote-bag-unmarked',
    title: 'Unmarked Tote',
    subtitle: 'Canvas naturale 100% cotone',
    type: 'physical',
    price: 24,
    stripePriceId: 'price_SOSTITUISCI_CON_ID_STRIPE', // ← Stripe Dashboard
    image: '/shop/tote-bag.jpg',
    description: 'Tote bag in canvas naturale pesante (400g). Stampa serigrafica in bianco. Manici lunghi. Dimensioni 38×42 cm.',
    available: true,
    shipping: true,
    shippingCountries: [],
  },
];
