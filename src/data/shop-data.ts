// src/data/shop-data.ts
// Catalogo prodotti Unmarked Shop.
// Per ogni prodotto:
//   1. Crea il prodotto su Stripe Dashboard (Products → Add product)
//   2. Copia il Price ID (price_xxx) nel campo stripePriceId
//   3. Per i digitali: carica il file in public/downloads/ e aggiorna downloadPath
//   4. Aggiungi l'immagine in public/shop/

export type DigitalTag = 'preset' | 'lut' | 'sfx' | 'flare';
export type PhysicalTag = 'maps' | 'prints' | 'gear';
export type ShopTag = DigitalTag | PhysicalTag;

export type ProductVariant = {
  label: string;        // "A4", "A3", "A2"
  size?: string;        // "21×29 cm"
  price: number;
  stripePriceId: string;
};

export type ShopProduct = {
  id: string;
  title: string;
  subtitle: string;
  type: 'digital' | 'physical';
  tag: ShopTag;
  price: number;              // prezzo base / "a partire da" se ci sono varianti
  stripePriceId: string;      // price ID default (o variante base)
  image: string;              // immagine principale (card + og) — usata anche come fallback
  stripeProductId?: string;  // prod_xxx — se presente, le immagini vengono prese da Stripe
  description: string;        // breve — usata nella card
  fullDescription?: string;   // lunga — usata nella pagina prodotto
  details?: string[];         // bullet point — usati nella pagina prodotto
  badge?: string;
  available: boolean;
  variants?: ProductVariant[]; // opzioni (taglie, formati…)
  // Solo per digitali
  downloadPath?: string;
  // Solo per fisici
  shipping?: true;
  shippingCountries?: string[];
};

export const shopProducts: ShopProduct[] = [
  // ─── DIGITALI ────────────────────────────────────────────────
  {
    id: 'preset-desert-light',
    title: 'Desert Light',
    subtitle: 'Preset Pack — Namibia + Islanda',
    type: 'digital',
    tag: 'preset',
    price: 29,
    stripePriceId: 'price_1TgRVkLV5vyDSjg1tujK08zU',
    image: '/shop/preset-desert-light.jpg',
    stripeProductId: 'prod_xxx_desert_light', // → sostituire con Product ID Stripe (prod_xxx)
    description: '18 preset Lightroom per luce desertica e artica. Calibrati su Sony, Nikon e Canon. Compatibili con Lightroom Classic, CC e mobile.',
    fullDescription: 'Questi preset nascono da anni di riprese nel deserto namibiano e sugli altipiani islandesi. Non sono filtri da applicare e dimenticare — sono punti di partenza calibrati sulla luce reale di quei posti, pensati per chi vuole un risultato che sembri girato sul campo e non su un monitor.',
    details: [
      '18 preset per Lightroom Classic, CC e mobile',
      'Calibrati su Sony A7 series, Nikon Z series e Canon R series',
      'File .xmp + istruzioni di installazione incluse',
      'Download immediato dopo l\'acquisto',
      'Aggiornamenti futuri gratuiti',
    ],
    badge: 'Bestseller',
    available: true,
    downloadPath: '/downloads/desert-light-presets.zip',
  },

  // ─── FISICI ──────────────────────────────────────────────────
 
  
  {
    id: 'iceland-maps',
    title: 'Iceland Maps',
    subtitle: 'Arte murale',
    type: 'physical',
    tag: 'maps',
    price: 89,
    stripePriceId: 'price_1TmwgrLV5vyDSjg1TzFOQjbY',
    stripeProductId: 'prod_UmVib6q57lRYtM',
    image: '/shop/iceland-maps/1.jpg',
    description: 'Arte murale ispirata ai paesaggi dell\'Islanda. Stampa fine art su carta Hahnemühle Photo Rag 308g.',
    fullDescription: 'Arte murale ispirata ai paesaggi dell\'Islanda. Stampa fine art su carta Hahnemühle Photo Rag 308g.',
    details: [
      'Stampa fine art su carta Hahnemühle Photo Rag 308g',
      'Texture mappa originale Unmarked',
      'Dimensioni: 70×50 cm',
      'Consegnata con certificato di autenticità',
      'Spedita in tubo rigido protettivo',
      'Prodotta su ordinazione in 5–7 giorni lavorativi',
    ],
    available: true,
    shipping: true,
    shippingCountries: [],
  },

  {
    id: 'mirror-of-iceland',
    title: 'Mirror of Iceland',
    subtitle: 'Fine Art Print',
    type: 'physical',
    tag: 'prints',
    price: 599,
    stripePriceId: 'price_1TnFxYLV5vyDSjg1XgzfJzIB',
    stripeProductId: 'prod_UmpcTsHpf6z9gm',
    image: '/shop/mirror-of-iceland/1.jpg',
    description: 'Il Kirkjufell riflesso nel silenzio invernale islandese. Stampa fine art su carta Hahnemühle Photo Rag 308g. Tiratura limitata 20 esemplari.',
    fullDescription: 'Una montagna sospesa tra cielo e acqua, riflessa nel silenzio di un paesaggio islandese invernale. Il Kirkjufell in una luce morbida dove neve, nuvole e riflessi si fondono in un\'atmosfera quasi irreale. Una stampa pensata per ambienti moderni, minimalisti e raffinati, capace di portare nello spazio la quiete potente dell\'Islanda.',
    details: [
      'Stampa fine art su carta Hahnemühle Photo Rag 308g',
      'Tiratura limitata: 20 esemplari',
      'Dimensioni: 100×70 cm',
      'Firmata e numerata a mano',
      'Consegnata con certificato di autenticità',
      'Spedita in tubo rigido protettivo',
      'Prodotta su ordinazione in 5–7 giorni lavorativi',
    ],
    badge: 'Edizione limitata',
    available: true,
    shipping: true,
    shippingCountries: [],
  },

  {
    id: 'africa-maps',
    title: 'Africa Maps',
    subtitle: 'Arte murale',
    type: 'physical',
    tag: 'maps',
    price: 89,
    stripePriceId: 'price_1TmwEQLV5vyDSjg1F6bke2L1',
    stripeProductId: 'prod_UmVEDIy5eoWzeI',
    image: '/shop/africa-maps/1.jpg',
    description: 'Opera d\'arte che ritrae l\'Africa in un manto di giraffa con ombre di acacia. Le texture danno tridimensionalità e portano l\'ambiente in un\'immersione naturale.',
    fullDescription: 'Quest\'opera d\'arte ritrae l\'Africa in un manto di giraffa con ombre di acacia, a simboleggiare la bellezza naturale, la ricchezza culturale e lo spirito selvaggio del continente. Le texture danno tridimensionalità e portano l\'ambiente in un\'immersione naturale.',
    details: [
      'Stampa fine art su carta Hahnemühle Photo Rag 308g',
      'Texture mappa originale Unmarked',
      'Dimensioni: 70×50 cm',
      'Consegnata con certificato di autenticità',
      'Spedita in tubo rigido protettivo',
      'Prodotta su ordinazione in 5–7 giorni lavorativi',
    ],
    available: true,
    shipping: true,
    shippingCountries: [],
  },

  {
    id: 'tote-bag-unmarked',
    title: 'Unmarked Tote',
    subtitle: 'Canvas naturale 100% cotone',
    type: 'physical',
    tag: 'gear',
    price: 24,
    stripePriceId: 'price_1TgRkPLV5vyDSjg1msBILyOt',
    image: '/shop/travel-beauty.jpg',
    stripeProductId: 'prod_xxx_tote_bag', // → sostituire con Product ID Stripe (prod_xxx)
    description: 'Tote bag in canvas naturale pesante (400g). Stampa serigrafica in bianco. Manici lunghi. Dimensioni 38×42 cm.',
    fullDescription: 'Una borsa che va in aereo, al mercato e in darkroom. Canvas naturale pesante, stampa serigrafica a mano con inchiostro bianco. Nessun logo urlato — solo "Unmarked" in piccolo sulla tasca frontale.',
    details: [
      'Canvas naturale 100% cotone pesante (400g)',
      'Stampa serigrafica in bianco',
      'Manici lunghi (60 cm) per spalla',
      'Tasca frontale con zip',
      'Dimensioni: 38×42 cm',
      'Lavabile in lavatrice a 30°',
    ],
    available: true,
    shipping: true,
    shippingCountries: [],
  },
];
