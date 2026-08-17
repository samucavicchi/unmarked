// Valori condivisi tra mediakit IT e EN
// Modifica qui → si aggiorna su entrambe le pagine

export const mediakitData = {

  // HERO
  heroImage: '/about-hero.jpg',
  year: '2026',

  // PERSONE
  samuele: {
    photo: '/samuele.jpg',
    igHandle: '@samuele_cavicchi',
    igUrl: 'https://instagram.com/samuele_cavicchi',
    followers: '63.2K',
    avgViews: '233K',
  },
  alice: {
    photo: '/alice.jpg',
    igHandle: '@poli_alice_',
    igUrl: 'https://instagram.com/poli_alice_',
    followers: '15.4K',
    avgViews: '150K',
  },

  // NUMERI REACH
  reach: {
    totalFollowers: '78.6K',
    monthlyViews: '383K',
    newsletter: '1.000+',
    italianAudience: '50%+',
  },

  // AUDIENCE — età
  ageGroups: [
    { label: '18–24', pct: 10, highlight: false },
    { label: '25–34', pct: 32, highlight: true },
    { label: '35–44', pct: 38, highlight: true },
    { label: '45–54', pct: 14, highlight: false },
    { label: '55+',   pct: 6,  highlight: false },
  ],

  // AUDIENCE — geo
  geoGroups: [
    { country: 'Italia',           pct: 50, main: true },
    { country: 'Germania',         pct: 12, main: false },
    { country: 'Francia',          pct: 9,  main: false },
    { country: 'Spagna',           pct: 8,  main: false },
    { country: 'UK',               pct: 7,  main: false },
    { country: 'Svizzera + NL + altro', pct: 14, main: false },
  ],

  // REEL
  reels: [
    { url: 'https://www.instagram.com/reel/C66WnGVokcN/', cover: '/reel-covers/mazda-2.jpg',  brand: 'Mazda Europe',  handle: '@mazdaeurope' },
    { url: 'https://www.instagram.com/reel/DYe4siMEfjt/', cover: '/reel-covers/nikon.jpg',    brand: 'Nikon Europe',  handle: '@nikoneurope' },
    { url: 'https://www.instagram.com/reel/DMQWifqo-t2/', cover: '/reel-covers/lexar.jpg',    brand: 'Lexar',         handle: '@lexarmemory' },
    { url: 'https://www.instagram.com/reel/DcIgsCOttmf/', cover: '/reel-covers/Evolveback.jpg', brand: 'Evolve Back',   handle: '@evolveback' },
    { url: 'https://www.instagram.com/reel/Dbx-mWNKrJy/', cover: '/reel-covers/Mogotlho.jpg',  brand: 'Mogotlhlo',     handle: '@mogotlhlo' },
  ],

  // PREZZI
  pricing: {
    contents: '2.500',
    social: '1.500',
    film: '3.500',
  },

  // CONTATTI
  contactEmail: 'samu.cavicchi@gmail.com',

};
