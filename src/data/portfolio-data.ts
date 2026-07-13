// PORTFOLIO DATA — file condiviso IT + EN
// Modifica qui → si aggiorna su entrambe le pagine
//
// COME AGGIUNGERE UNA FOTO:
//   src: '/portfolio/nome-file.jpg'  ← metti l'immagine in public/portfolio/
//   hint: lascialo come nota interna (non appare se src è presente)
//
// COME AGGIUNGERE UN VIDEO:
//   youtubeId: 'dQw4w9WgXcQ'  ← solo l'ID, non l'URL completo

export const portfolioData = {

  contactEmail: 'samu.cavicchi@gmail.com',

  // ── FOTOGRAFIA ──────────────────────────────────────────────
  // Ogni gruppo = un brand. Ogni foto ha src (path immagine) e hint (nota placeholder).
  // Quando metti l'src, il placeholder scompare automaticamente.

  photoGroups: [
    {
      brand: 'Mazda Europe',
      year: '2024',
      photos: [
        { src: '', hint: 'paesaggio wide' },
        { src: '', hint: 'wildlife / orso' },
        { src: '', hint: 'auto nel paesaggio' },
      ],
    },
    {
      brand: 'Nikon',
      year: '2024',
      photos: [
        { src: '', hint: 'attrezzatura / prodotto' },
        { src: '', hint: 'wildlife portrait' },
        { src: '', hint: 'scatto editoriale' },
      ],
    },
    {
      brand: 'Basecamp Explorer',
      year: '2024',
      photos: [
        { src: '', hint: 'ambiente / struttura' },
        { src: '', hint: 'dettaglio / natura' },
        { src: '', hint: 'reportage' },
      ],
    },
    {
      brand: 'Helly Hansen',
      year: '2025',
      photos: [
        { src: '', hint: 'outdoor / action' },
        { src: '', hint: 'paesaggio Lofoten' },
        { src: '', hint: 'dettaglio prodotto' },
      ],
    },
  ],

  // ── VIDEO ────────────────────────────────────────────────────
  // youtubeId: '' = placeholder, metti l'ID per attivare l'embed
  // descIt / descEn: sottotitolo sotto il video (tipo · luogo · durata)

  videos: [
    {
      brand: 'Mazda Europe',
      title: 'The Hidden Path',
      youtubeId: 'G1LZG6bczmw',
      descIt: 'Short film · Dolomiti → Carpazi · 8 min',
      descEn: 'Short film · Dolomites → Carpathians · 8 min',
    },
    {
      brand: '',
      title: 'Titolo progetto',
      youtubeId: '',
      descIt: 'Tipo video · Luogo · Durata',
      descEn: 'Video type · Location · Duration',
    },
    {
      brand: '',
      title: 'Titolo progetto',
      youtubeId: '',
      descIt: 'Tipo video · Luogo · Durata',
      descEn: 'Video type · Location · Duration',
    },
    {
      brand: '',
      title: 'Titolo progetto',
      youtubeId: '',
      descIt: 'Tipo video · Luogo · Durata',
      descEn: 'Video type · Location · Duration',
    },
  ],

  // ── CAMPAGNE ─────────────────────────────────────────────────
  // tags/tagsEn: etichette tipo progetto
  // descIt / descEn: descrizione estesa nel pannello aperto
  // photos[]: array di src immagini (lascia '' per placeholder)
  // youtubeId: '' = nessun video; metti l'ID per mostrare l'embed

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
