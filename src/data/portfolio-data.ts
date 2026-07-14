// PORTFOLIO DATA — file condiviso IT + EN
// Modifica qui → si aggiorna su entrambe le pagine
//
// FOTO: src: '/portfolio/nome-file.jpg'  ← file in public/portfolio/
// VIDEO YT: youtubeId: 'ID'
// VIDEO MP4: videoSrc: '/portfolio/video.mp4' + thumb: '/portfolio/cover.jpg' (opzionale)
// TARIFFE: modifica i campi price, itemsIt, itemsEn

export const portfolioData = {

  contactEmail: 'samu.cavicchi@gmail.com',

  // ── FOTOGRAFIA ──────────────────────────────────────────────

  photoGroups: [
    {
      brand: 'Mazda Europe',
      year: '2024',
      photos: [
        { src: '/portfolio/mazda-1.jpg', hint: '' },
        { src: '/portfolio/mazda-2.jpg', hint: '' },
        { src: '/portfolio/mazda-3.jpg', hint: '' },
        { src: '/portfolio/mazda-4.jpg', hint: '' },
        { src: '/portfolio/mazda-5.jpg', hint: '' },
        { src: '/portfolio/mazda-6.jpg', hint: '' },
      ],
    },
    {
      brand: 'Basecamp Explorer',
      year: '2024',
      photos: [
        { src: '/portfolio/basecamp-1.jpg', hint: '' },
        { src: '/portfolio/basecamp-2.jpg', hint: '' },
        { src: '/portfolio/basecamp-3.jpg', hint: '' },
        { src: '/portfolio/basecamp-4.jpg', hint: '' },
        { src: '/portfolio/basecamp-5.jpg', hint: '' },
        { src: '/portfolio/basecamp-6.jpg', hint: '' },
      ],
    },
    {
      brand: 'Helly Hansen',
      year: '2025',
      photos: [
        { src: '/portfolio/hellyhansen-1.jpg', hint: '' },
        { src: '/portfolio/hellyhansen-2.jpeg', hint: '' },
        { src: '/portfolio/hellyhansen-3.jpg', hint: '' },
        { src: '/portfolio/hellyhansen-4.jpg', hint: '' },
        { src: '/portfolio/hellyhansen-5.jpg', hint: '' },
        { src: '/portfolio/hellyhansen.6.jpg', hint: '' },
      ],
    },
  ],

  // ── VIDEO ────────────────────────────────────────────────────
  // youtubeId → thumbnail auto da YouTube + overlay player
  // videoSrc  → MP4 diretto; aggiungi thumb: '/portfolio/cover.jpg' per la card
  // Entrambi vuoti = placeholder

  videos: [
    {
      brand: 'Mazda Europe',
      title: 'The Hidden Path',
      youtubeId: 'G1LZG6bczmw',
      videoSrc: '',
      thumb: '',
      descIt: 'Short film · Dolomiti → Carpazi · 8 min',
      descEn: 'Short film · Dolomites → Carpathians · 8 min',
    },
    {
      brand: 'Basecamp Explorer',
      title: 'Arctic Experts',
      youtubeId: 'QbsTXmn1Fx8',
      videoSrc: '',
      thumb: '',
      descIt: 'Commercial · Svalbard · 40 sec',
      descEn: 'Commercial · Svalbard · 40 sec',
    },
    {
      brand: 'Mazda Europe',
      title: 'The Wind of Gorafe',
      youtubeId: '',
      videoSrc: '/portfolio/mazda-video-1.mp4',
      thumb: '/portfolio/gorafe-cover.jpg',
      descIt: 'Commercial · Gorafe · 40 sec',
      descEn: 'Commercial · Gorafe · 40 sec',
    },
    {
      brand: 'Nikon Travel',
      title: 'Oltre i confini',
      youtubeId: '',
      videoSrc: '/portfolio/namibia-video-1.mp4',
      thumb: '/portfolio/namibia-cover.jpg',
      descIt: 'Experience · Namibia · 30 sec',
      descEn: 'Experience · Namibia · 30 sec',
    },
  ],

  // ── TARIFFE ──────────────────────────────────────────────────
  // Modifica price e items per aggiornare entrambe le lingue

  tariffe: [
    {
      id: 'social-media',
      nameIt: 'Foto & Video Social Media',
      nameEn: 'Photo & Video Social Media',
      price: '2.500',
      itemsIt: ['30 fotografie', '3 video reel'],
      itemsEn: ['30 photographs', '3 video reels'],
    },
    {
      id: 'commercial',
      nameIt: 'Pacchetto Commercial',
      nameEn: 'Commercial Package',
      price: '3.999',
      itemsIt: ['40 foto taglio commerciale', '10 clip video', '1 video commercial'],
      itemsEn: ['40 commercial-cut photos', '10 video clips', '1 commercial video'],
    },
    {
      id: 'social',
      nameIt: 'Pacchetto Social',
      nameEn: 'Social Package',
      price: '1.999',
      itemsIt: ['5 Instagram stories per profilo', '1 carosello per profilo', '2 reel condivisi'],
      itemsEn: ['5 Instagram stories per profile', '1 carousel per profile', '2 shared reels'],
    },
  ],

  // ── CAMPAGNE ─────────────────────────────────────────────────
  // In pausa — da completare

  campaigns: [
    {
      id: 'mazda',
      num: '01',
      brand: 'Mazda Europe',
      title: 'The Hidden Path',
      tags: ['Short film', 'Fotografia', 'Social content', 'Product placement'],
      tagsEn: ['Short film', 'Photography', 'Social content', 'Product placement'],
      descIt: 'Un viaggio dalle Dolomiti ai Monti Carpazi in Romania, sulle tracce dell\'orso bruno. Racconto della Mazda CX-60 come compagna di percorsi estremi — sterrate, ambienti wild e remoti, migliaia di chilometri di wilderness.',
      descEn: 'A journey from the Dolomites to the Carpathian Mountains in Romania, tracking the brown bear. A story of the Mazda CX-60 as a companion through extreme terrain — dirt roads, wild and remote environments, thousands of kilometres of wilderness.',
      photos: ['', '', '', ''],
      youtubeId: 'G1LZG6bczmw',
    },
    {
      id: 'nikon',
      num: '02',
      brand: 'Nikon',
      title: 'Titolo campagna',
      tags: ['Fotografia', 'Social content'],
      tagsEn: ['Photography', 'Social content'],
      descIt: 'Descrizione del progetto e degli obiettivi della campagna.',
      descEn: 'Project description and campaign objectives.',
      photos: ['', '', '', ''],
      youtubeId: '',
    },
    {
      id: 'basecamp',
      num: '03',
      brand: 'Basecamp Explorer',
      title: 'Titolo campagna',
      tags: ['Reportage', 'Fotografia'],
      tagsEn: ['Reportage', 'Photography'],
      descIt: 'Descrizione del progetto e degli obiettivi della campagna.',
      descEn: 'Project description and campaign objectives.',
      photos: ['', '', '', ''],
      youtubeId: '',
    },
    {
      id: 'hellyhansen',
      num: '04',
      brand: 'Helly Hansen',
      title: 'Titolo campagna',
      tags: ['Outdoor', 'Fotografia'],
      tagsEn: ['Outdoor', 'Photography'],
      descIt: 'Descrizione del progetto.',
      descEn: 'Project description.',
      photos: ['', '', '', ''],
      youtubeId: '',
    },
  ],

};
