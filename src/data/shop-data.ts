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
  price: number;
  stripePriceId: string;
  image: string;
  description: string;        // breve — usata nella card
  fullDescription?: string;   // lunga — usata nella pagina prodotto
  details?: string[];         // bullet point — usati nella pagina prodotto
  badge?: string;
  available: boolean;
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
    price: 29,
    stripePriceId: 'price_1TgRVkLV5vyDSjg1tujK08zU',
    image: '/shop/preset-desert-light.jpg',
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
    id: 'print-namibia-dune',
    title: 'Namibia — Le dune',
    subtitle: 'Fine Art Print · 30×40 cm',
    type: 'physical',
    price: 89,
    stripePriceId: 'price_1TgReELV5vyDSjg1lGuxtptl',
    image: '/shop/print-africa-giraffa.jpg',
    description: 'Stampa fine art su carta Hahnemühle Photo Rag 308g. Tiratura limitata 50 esemplari. Firmata e numerata.',
    fullDescription: 'Le dune del Sossusvlei all\'alba, prima che arrivino i pullman. Questa foto è stata scattata dopo due ore di cammino nel buio — il risultato è quella luce radente che colora le creste di rosso e lascia le valli in ombra. Una delle immagini che più mi rappresenta.',
    details: [
      'Stampa fine art su carta Hahnemühle Photo Rag 308g',
      'Formato 30×40 cm',
      'Tiratura limitata: 50 esemplari',
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
    id: 'print-islanda-aldeyarfoss',
    title: 'Islanda — Aldeyarfoss',
    subtitle: 'Fine Art Print · 30×40 cm',
    type: 'physical',
    price: 89,
    stripePriceId: 'price_1TgRgILV5vyDSjg1K5Ur98zq',
    image: '/shop/print-islanda-theedgeoficeland.jpg',
    description: 'Stampa fine art su carta Hahnemühle Photo Rag 308g. Tiratura limitata 50 esemplari. Firmata e numerata.',
    fullDescription: 'Aldeyarfoss è una cascata che non trovi sui cartelloni. Ci si arriva su una strada sterrata nel nord dell\'Islanda, e la cosa che colpisce è il contrasto tra il basalto nero delle colonne e il bianco dell\'acqua. Questa foto è stata scattata in una mattina di giugno con luce diffusa — nessun cielo spettacolare, solo forma e materia.',
    details: [
      'Stampa fine art su carta Hahnemühle Photo Rag 308g',
      'Formato 30×40 cm',
      'Tiratura limitata: 50 esemplari',
      'Firmata e numerata a mano',
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
    price: 24,
    stripePriceId: 'price_1TgRkPLV5vyDSjg1msBILyOt',
    image: '/shop/travel-beauty.jpg',
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
