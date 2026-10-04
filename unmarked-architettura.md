# UNMARKED — Architettura del progetto
*Documento di lavoro v10 · 4 Ottobre 2026*

Questo documento è la **memoria esterna** del progetto. Se la chat viene compattata o ricominciata, leggere QUESTO doc + `unmarked-manuale-uso.md` + il codice (cartella `~/Desktop/unmarked`, repo GitHub) basta per riprendere il lavoro senza perdere niente.

> **Cosa è cambiato dalla v9 (giugno)**: "Destinazioni" è diventata **Libreria** (con categorie), nuovi **Shop** (digitale + fisico via Stripe), **Unmarked Pro** (`/pro`), **Portfolio/Press** IT+EN, export **KML** degli itinerari, landing **segreto.html** (lead magnet Dolomiti), **sync automatico podcast** da RSS via GitHub Action, popup Spotsbook, campo `preview` nello Spotsbook, `localContacts` negli itinerari.

---

## Stato attuale al 4 Ottobre 2026

**URL e accessi**
- Sito live: https://unmarked.it
- Repo GitHub: github.com/samucavicchi/unmarked (branch `main`)
- Cartella locale: `/Users/samuelecavicchi/Desktop/unmarked`
- CMS: https://unmarked.it/admin (login con Netlify Identity — samu.cavicchi@gmail.com)
- Netlify dashboard: app.netlify.com/projects/unmarked-staging
- Netlify project ID: `62f5c91a-a4d5-4490-bf2a-d08592e0a3c2`
- Clerk: dashboard.clerk.com · Stripe: dashboard.stripe.com · Brevo: app.brevo.com
- Feed podcast: https://anchor.fm/s/112725408/podcast/rss

**Ultimi lavori (git)**
- 17 Ago 2026 — cambio logo, loghi brand media kit, cover, update `patagonia.md`, `mediakit-data.ts`
- 23 Lug 2026 — nuovi episodi podcast (bot RSS)
- 20 Lug 2026 — Libreria
- 14 Lug 2026 — hero, `portfolio-data.ts`

**Stack tecnico**
| Componente | Tecnologia |
|---|---|
| Framework | Astro v4.16 (`output: 'hybrid'`, adapter `@astrojs/netlify`) |
| Hosting | Netlify (piano Personal $9/mese), Node 20 |
| CMS | Decap CMS (Netlify Identity + Git Gateway) |
| Auth utenti | Clerk (`@clerk/astro`) |
| Pagamenti | Stripe (`stripe` v16, API `2024-11-20.acacia`) — itinerari, abbonamento, shop |
| Newsletter | Brevo (API v3, lista ID 6 "Unmarked Newsletter") |
| Markdown extra | `marked` (per campi testo come `bodyText2`) |
| Dominio | unmarked.it (DNS A record → 75.2.60.5 Netlify) |
| Automazioni | GitHub Actions (sync podcast giornaliero) |

**Nota storica**: partito con Netlify Identity + Supabase + Lemon Squeezy, migrato a Clerk + Stripe prima del lancio. Decap CMS usa ancora Netlify Identity solo per `/admin`. Nello schema itinerari e nel CMS restano i campi legacy `lemonSqueezyProductId` / `lemonSqueezyCheckoutUrl` (non usati).

---

## 1. DECISIONI PRESE

| Tema | Scelta |
|---|---|
| Stack | Astro v4 hybrid + Decap CMS su Netlify |
| Auth utenti | Clerk |
| Pagamenti | Stripe (itinerario singolo + abbonamento Pro €29/mese + shop) |
| Abbonamento | **Unmarked Pro** — itinerari completi + Spotsbook |
| Newsletter | Brevo (API v3) |
| Voce editoriale | Unica "Unmarked", nessuna firma autore |
| Lingua | Italiano (solo Media Kit e Portfolio anche in inglese) |
| Tassonomia | Geografica: paese + continente (5: Europa, Asia, Africa, Americhe, Oceania) + categoria per la Libreria |
| Immagini articoli | Asset processing Astro (`src/assets/articoli/`) |
| Immagini statiche | `public/` (shop, portfolio, spotsbook, loghi, reel-covers…) |
| Podcast audio | RSS Anchor/Spotify for Creators, sync automatico |

---

## 2. STRUTTURA URL

### Pagine pubbliche
| URL | File | Render |
|---|---|---|
| `/` | `index.astro` | statico |
| `/libreria` | `libreria/index.astro` | statico |
| `/libreria/[slug]` | `libreria/[slug].astro` | statico |
| `/libreria/paese/[paese]`, `/libreria/continente/[continente]` | | statico |
| `/destinazioni/**` | `destinazioni/*` | **redirect legacy** → `/libreria/**` |
| `/itinerari` (+ `/paese/`, `/continente/`) | `itinerari/*` | statico |
| `/itinerari/[slug]` | `itinerari/[slug].astro` | **SSR** (paywall) |
| `/itinerari/[slug].kml` | `itinerari/[slug].kml.ts` | statico — export KML per Google Earth/Maps |
| `/film`, `/film/[slug]` | `film/*` | statico |
| `/podcast`, `/podcast/[slug]` | `podcast/*` | statico |
| `/mappa` | `mappa.astro` | statico — Leaflet, libreria + itinerari |
| `/spotsbook` | `spotsbook.astro` | **SSR** |
| `/pro` | `pro.astro` | **SSR** — landing abbonamento Unmarked Pro |
| `/shop` | `shop/index.astro` | statico |
| `/shop/[id]` | `shop/[id].astro` | statico (al build legge immagini prodotto da Stripe) |
| `/shop/grazie` | `shop/grazie.astro` | **SSR** — conferma ordine fisico |
| `/download` | `download.astro` | **SSR** — download prodotto digitale dopo pagamento |
| `/consulenze` | `consulenze/index.astro` | statico |
| `/chi-siamo` | `chi-siamo.astro` | statico |
| `/mediakit`, `/en/mediakit` | | statico |
| `/portfolio-press`, `/en/portfolio-press` | | statico |
| `/segreto.html` | `public/segreto.html` | HTML puro, `noindex` — lead magnet "location segreta nelle Dolomiti" |
| 404 | `404.astro` | statico |

### Area utente (Clerk)
- `/sign-in`, `/sign-up` — SSR, componenti Clerk
- `/account` — dashboard: abbonamento, itinerari acquistati, logout

### Backend
- `/admin` — Decap CMS
- `POST /api/checkout` — endpoint Astro SSR (`src/pages/api/checkout.ts`), crea la Checkout Session Stripe
- `/.netlify/functions/stripe-webhook` — webhook Stripe → aggiorna Clerk
- `/.netlify/functions/newsletter-subscribe` — iscrizione newsletter → Brevo
- `/.netlify/functions/secret-subscribe` — iscrizione da `segreto.html` → Brevo lista 6 + email transazionale con la location

**Navbar**: Libreria · Itinerari · Film · Podcast · Shop · Consulenze · Chi siamo + icone cerca / mappa / account (Accedi se non loggato).

---

## 3. AUTENTICAZIONE E PAGAMENTI

### Clerk
- `astro.config.mjs`: integrazione con `signInUrl: '/sign-in', signUpUrl: '/sign-up'`
- `src/middleware.ts`: `clerkMiddleware()` avvolto in try/catch (se le env sono errate il sito non va in 500, semplicemente niente auth). Lascia passare tutto: il controllo premium avviene nelle pagine SSR con `Astro.locals.currentUser()`.

### Dati utente in Clerk `publicMetadata`
```json
{
  "isPremium": true,
  "plan": "subscription",
  "purchasedItinerari": ["slug-1", "slug-2"],
  "stripeCustomerId": "cus_xxx",
  "stripeSubscriptionId": "sub_xxx"
}
```

### Checkout — `POST /api/checkout`
Body: `{ type, slug?, price?, title?, productId?, variantPriceId? }`
| `type` | Stripe mode | Prezzo | Success URL |
|---|---|---|---|
| `subscription` | subscription | `STRIPE_SUBSCRIPTION_PRICE_ID` (€29/mese) | `/itinerari/[slug]?upgraded=1` o `/?upgraded=1` |
| `single` | payment | `price_data` dinamico dal campo `price` dell'itinerario | `/itinerari/[slug]?upgraded=1` |
| `shop` | payment | `stripePriceId` del prodotto o della variante | digitale → `/download?session=…` · fisico → `/shop/grazie?session=…` |

- L'utente loggato viene passato come `client_reference_id` + `metadata.userId`. Il checkout funziona anche senza login.
- Prodotti fisici: raccolta indirizzo di spedizione (default IT, AT, BE, CH, DE, ES, FR, GB, NL, PT, SE, US, CA, AU, oppure `shippingCountries` del prodotto).
- Codici promo abilitati su abbonamento e singolo.

### Webhook — `netlify/functions/stripe-webhook.ts`
Configurato su Stripe → Developers → Webhooks, URL `https://unmarked.it/.netlify/functions/stripe-webhook`, eventi:
- `checkout.session.completed` → `subscription`: `isPremium: true` · `single`: aggiunge lo slug a `purchasedItinerari`
- `customer.subscription.deleted` → `isPremium: false`
- Acquisti shop: il webhook non fa nulla (la consegna è gestita da `/download` e `/shop/grazie` leggendo la sessione Stripe).

### Paywall itinerari
In `itinerari/[slug].astro`: accesso completo se `isPremium` oppure lo slug è in `purchasedItinerari`. Altrimenti si vedono solo i giorni con `isPremium: false` (badge "Anteprima gratuita") e i marker mappa dei giorni premium vengono nascosti.

**⚠ Stripe è ancora in modalità TEST** — vedi checklist.

---

## 4. NEWSLETTER — BREVO

- Lista "Unmarked Newsletter" — **ID 6**
- `BREVO_API_KEY` in `.env` locale e su Netlify env (**mai su GitHub**; `.env` è in `.gitignore`)
- Form: `Newsletter.astro` (home), `NewsletterPopup.astro` (slide-up basso-sinistra dopo 15s), `segreto.html` (→ `secret-subscribe`)
- `secret-subscribe` invia anche una mail transazionale da `SENDER_EMAIL` (default `adventures@unmarked.it`) — il mittente deve essere verificato in Brevo

---

## 5. CONTENT COLLECTIONS (`src/content/config.ts`)

Collezioni: `libreria`, `itinerari`, `film`, `podcast`, `blackbook`. Le immagini caricate dal CMS vanno in `src/assets/articoli/` (path nel frontmatter: `../../assets/articoli/...`).

### Libreria (ex Destinazioni)
`title, subtitle?, category, country?, continent?, region?, coverImage, coverImageAlt, excerpt, publishDate, featured, seoMetaDescription?`
- `category`: `Destinazione` (default) · `Attrezzatura` · `Consigli di viaggio` · `Cosa portare` · `Ispirazione` — per le categorie non geografiche `country`/`continent` sono opzionali
- "Wow pack" opzionale: `interludeImage?, interludeCaption?, pullQuote?, bodyText2?` (secondo blocco testo), `gallery2?[]{image, caption?}`, `essentialToKnow?[]{title, description}`, `schede?[]{label, text}` (blocchi stile Spotsbook)
- Mappa: `mapCenter?{lat,lng,zoom}`, `mapMarkers[]{lat,lng,label}`
- `relatedItinerary?` — select CMS con opzioni manuali in `public/admin/config.yml` (oggi solo "Namibia"); nel codice si cerca l'itinerario per titolo (case-insensitive)

Articoli attuali: etiopia, georgia, giordania, islanda, islanda-inverno, isole-faroe, kirghizistan, namibia, oman, patagonia, svalbard, tutti-ci-passano-accanto-nessuno-la-vede, un-viaggio-un-solo-obbiettivo-fotografico, `aaaa` ("Cosa mettere nello zaino" — slug da sistemare).

### Itinerari
`title, subtitle?, country, continent, coverImage, coverImageAlt, excerpt, publishDate, featured, duration, budget(Economico/Medio/Alto), difficulty(Facile/Medio/Avventura), bestSeason, transport, price`
- Strutturati: `vale?{intro?, dormire?[], mangiare?[], tappe?[]}` (item: `name, badge(must/good/hidden), location?, description, tip?, price?`), `mainstream?{intro?, items[]}` (item: `name, type?, rating 1-5, verdict, alternative?{name,reason}, distance?`)
- Legacy fallback: `valeIlViaggio?`, `mainstreamCheck?` (testo libero)
- `gallery?[]{image, caption?, wide}`
- `days[]{dayNumber, title, description, kmTotali?, dislivello?, dormire?, mangiare?, isPremium, gallery?[]}`
- `mapCenter?`, `mapMarkers[]{lat,lng,label,dayNumber?}`
- `localContacts[]{name, role, contact, notes?}`

Contenuti: `marocco-7-giorni`, `isalnda` + test `isalnda-1`, `isalnda-2`.

### Film
`title, subtitle?, country, continent, coverImage, coverImageAlt, excerpt, publishDate, featured, youtubeId, duration, type(Documentario/Cortometraggio/Reportage/Essay/Trailer)`
Contenuti: the-dragon-blood-way, the-eyes-of-africa, the-hidden-path.

### Podcast
`title, subtitle?, coverImage?, coverImageAlt?, excerpt, publishDate, featured, spotifyEpisodeId?, audioUrl?, anchorEmbedUrl?, youtubeId?, episodeNumber, duration, topic(Destinazioni/Pratiche/Fotografia/Storie/Interviste), guests?`
Episodi 1–7 + `unmarked-podcast.md`.

### Black Book / Spotsbook
Vedi §11.

---

## 6. COMPONENTI E LAYOUT

| Componente | Funzione |
|---|---|
| `Navbar.astro` | Logo, link, hamburger mobile, icone cerca/mappa/account |
| `Footer.astro` | Link sezioni, logo footer (`public/loghi/logo-footer.png`) |
| `Hero.astro` | Hero homepage |
| `SearchOverlay.astro` | Ricerca full-text |
| `NewsletterPopup.astro` | Popup slide-up dopo 15s, z-index 1100 |
| `Newsletter.astro` | Form newsletter in home |
| `SpotsbookPopup.astro` | Modal dopo 50% di scroll, mostrato una volta sola (localStorage) → CTA `/spotsbook` e `/pro` |
| `PodcastMiniPlayer.astro` | Player audio nativo con `transition:persist` |
| `DestinazioneCard`, `DestinazioniArchive` | Card/archivio articoli Libreria |
| `ItinerarioCard`, `ItinerariArchive` | Card/archivio itinerari |
| `FilmCard`, `PodcastCard` | Card |
| `BaseLayout.astro` | Layout principale + `<ViewTransitions />` |
| `Layout.astro` | Layout legacy (verificare se ancora usato) |

### Homepage — ordine sezioni
Hero → Libreria → Mappa → Itinerari → Spotsbook teaser → Film (uno featured a tutta larghezza) → Podcast → Shop → Newsletter

### ViewTransitions
Attive in `BaseLayout.astro`, servono al `transition:persist` del mini player. Gli script di pagina devono gestire `astro:page-load`.

---

## 7. MAPPA INTERATTIVA

### Tiles
- Dal 2026 CARTO richiede una API key (formato: `basemaps.cartocdn.com/rastertiles/<stile>/{z}/{x}/{y}.png?key=...`) (gratuita fino a 1M richieste/mese per uso commerciale): https://carto.com/basemaps/apikey
- URL centralizzati in `BaseLayout.astro` → `window.UNMARKED_TILES.dark` / `.light`, con `?key=` da `PUBLIC_CARTO_KEY`
- Usati da: Spotsbook (teaser + mappa abbonati), teaser Spotsbook in home, mappa articolo Libreria, mappa itinerario
- Home (mappa principale) e `/mappa` usano Esri NatGeo, che non richiede chiave

### `/mappa`
Leaflet, tiles CartoDB Light, pin Libreria (terra) e Itinerari (scuro), filtri, popup con foto.

### Mappa in homepage
- Statica (no scroll/drag); click pin → popup, click sfondo → `/mappa`
- Fade sui 4 lati con overlay (`isolation: isolate` sul wrapper)
- Coordinate fallback per paese in `countryCoords` (stesso oggetto in `mappa.astro` e `index.astro` — aggiornarli entrambi)

---

## 8. RESPONSIVE / MOBILE

Breakpoint 768px in `src/styles/global.css`. Mobile: hamburger, griglie a colonna singola, itinerari featured su sfondo terra + testo bianco, newsletter impilata. Desktop featured: span 2 colonne, immagine 320px. Spotsbook mobile: preview a scheda dal basso (`bb-mobile-preview`).

---

## 9. VARIABILI D'AMBIENTE

| Variabile | Dove | Note |
|---|---|---|
| `CLERK_SECRET_KEY` | Netlify | Backend Clerk + webhook |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | Netlify | Frontend Clerk |
| `STRIPE_SECRET_KEY` | Netlify + `.env` | Checkout, webhook, download, shop build, script immagini |
| `STRIPE_WEBHOOK_SECRET` | Netlify | Firma webhook |
| `STRIPE_SUBSCRIPTION_PRICE_ID` | Netlify | Prezzo Pro €29/mese |
| `BREVO_API_KEY` | Netlify + `.env` | MAI su GitHub |
| `SENDER_EMAIL` | Netlify (opzionale) | Mittente mail `secret-subscribe`, default adventures@unmarked.it |
| `SITE_URL` | `.env` | Solo per `npm run sync-images` |
| `PUBLIC_CARTO_KEY` | Netlify + `.env` (opzionale) | API key tiles CARTO (pubblica, limitata per dominio). Se manca si usa quella di riserva scritta in `BaseLayout.astro`. Senza chiave le mappe mostrano la filigrana "API KEY REQUIRED" |

Il `.env` locale contiene solo `BREVO_API_KEY`, `SITE_URL`, `STRIPE_SECRET_KEY`. Al passaggio a Stripe LIVE vanno cambiate **tutte** le chiavi/ID Stripe (secret, webhook secret, subscription price, e i `stripePriceId`/`stripeProductId` in `shop-data.ts`).

---

## 10. MEDIA KIT E PORTFOLIO

### Media Kit
- `src/pages/mediakit.astro` (IT) e `src/pages/en/mediakit.astro` (EN)
- Dati condivisi in `src/data/mediakit-data.ts`: `reach`, `samuele`, `alice`, `pricing`, `reels`, email
- Testi: da modificare separatamente nei due `.astro`
- Cover reel: `public/reel-covers/` (mazda-1, mazda-2, nikon, asus, lexar, Mogotlho, Evolveback)
- Loghi brand: `public/loghi/` (Nikon, DJI, Mazda, Helly Hansen, Hamilton, Suunto, Range Rover, Four Seasons, Nomatic, Basecamp, Evolve Back, Mogotlhlo, Explore Namibia, Ascocar)
- Case study: foto in `public/mediakit/` (eyes of africa, hidden path); blocco `.mk-case-gallery`

### Portfolio / Press
- `src/pages/portfolio-press.astro` (IT) e `src/pages/en/portfolio-press.astro` (EN)
- Dati condivisi in `src/data/portfolio-data.ts`: `contactEmail`, `photoGroups[]{brand, year, photos[]}`, video (YouTube `youtubeId` o MP4 `videoSrc` + `thumb`), tariffe (`price`, `itemsIt`, `itemsEn`)
- File in `public/portfolio/` (Mazda, Basecamp, Helly Hansen, video Namibia e Mazda)

---

## 11. BLACK BOOK (SPOTSBOOK)

### Struttura
- `src/pages/spotsbook.astro` — SSR
- `src/content/blackbook/` — un `.md` per location (27 attuali)
- CMS: sezione "Black Book" in `/admin`
- Immagini: `public/spotsbook/`

### Logica accesso
- Non abbonati: hero + teaser con mappa sfumata + CTA Pro. Le location con `preview: true` sono visibili come anteprima.
- Abbonati (`isPremium`): mappa Leaflet completa + pannello laterale + overlay dettaglio.

### Campi

| Campo CMS | Codice | Tipo | Note |
|---|---|---|---|
| Titolo | `title` | string | |
| Paese / Regione / Continente | `country`, `region?`, `continent` | | |
| Tipo | `type` | enum | Wildlife, Paesaggio, Golden hour, Blue hour, Architettura, Persone |
| Lat / Lng | `lat`, `lng` | number | |
| Data | `publishDate` | date | usata per il pin "nuova" (ultimi 30 gg) |
| Stato | `status` | enum | `published` / `coming_soon` (pin grigio, non cliccabile) |
| Anteprima | `preview` | boolean | visibile ai non abbonati |
| Ora ottimale | `bestTime` | string | → "Luce ottimale" |
| Periodo | `bestSeason` | string | |
| Tecnica consigliata | `focalLength` | text | (nome campo storico) |
| Composizione consigliata | `isoRange` | string | (nome campo storico) |
| Accesso | `access` | string | |
| Difficoltà fotografica | `difficulty` | Bassa/Media/Alta | |
| Avvicinamento | `avvicinamento` | Bassa/Media/Alta | |
| Anti-mainstream | `antiMainstream` | text | |
| Annotazioni a mano | `handnotes[]` | list | freccia ↳, font Caveat |
| Checklist | `checklist[]` | list | |
| Attrezzatura | `equipment[]` | multi-select | Treppiede, Filtri, Grandangolo, Tele, Lente luminosa, Cover impermeabile |
| Nota personale | `personalNote` | string | stellina ★ |
| Coordinate testuali | `coordinates` | string | copiabili con click |
| Immagini | `images[]{src, alt?}` | list | prima foto = preview pannello |

Il body del `.md` è il testo descrittivo principale.

### Interfaccia abbonati
- **Toolbar**: chip tipo/continente, chip "Salvati", ricerca live (titolo, paese, regione)
- **Pin** (CartoDB Dark): terra cotta = disponibile · giallo `#E8C840` = salvata · verde acqua `#6BBFA3` = nuova · grigio = coming soon. Legenda in basso a sinistra.
- **Pannello laterale**: foto, paese · continente, titolo, periodo, luce, difficoltà, "Scopri tutto" + salva, link Google Maps
- **Overlay dettaglio**: galleria → lightbox (limitato a `right: 560px`), blocchi editoriali, accesso/avvicinamento, note, attrezzatura, checklist, nota personale, coordinate, Google Maps
- **Salvati**: `localStorage` chiave `spotsbook_saved` (funzioni `getSaved()`, `toggleSave()`, `isSaved()` — da migrare su Clerk metadata)

---

## 12. SHOP

### Catalogo — `src/data/shop-data.ts`
Tipi: `digital` (tag `preset` / `lut` / `sfx` / `flare`) e `physical` (tag `maps` / `prints` / `gear`).
Campi prodotto: `id, title, subtitle, type, tag, price, stripePriceId, image, hoverImage?, stripeProductId?, description, fullDescription?, details?[], badge?, available, variants?[]{label, size?, price, stripePriceId}, downloadPath?, shipping?, shippingCountries?`

Prodotti attuali:
| id | tipo |
|---|---|
| `preset-desert-light` | digitale — preset Lightroom €29 |
| `iceland-maps` | fisico — mappa murale |
| `eye-of-earth` | fisico |
| `mirror-of-iceland` | fisico |
| `africa-maps` | fisico |
| `tote-bag-unmarked` | fisico |

### Flusso
1. `/shop` → `/shop/[id]` (pagina prodotto, varianti formato es. A4/A3/A2)
2. `POST /api/checkout` con `type: 'shop'`, `productId`, `variantPriceId?`
3. Digitale → `/download?session=…` verifica pagamento su Stripe e mostra il link a `downloadPath`
4. Fisico → `/shop/grazie?session=…`; spedizione gestita a mano da Stripe Dashboard

### Immagini prodotto
- File in `public/shop/[product-id]/`
- `npm run sync-images` (`scripts/sync-product-images.mjs`) carica le immagini sui prodotti Stripe (richiede `STRIPE_SECRET_KEY` + `SITE_URL` in `.env`)
- Se il prodotto ha `stripeProductId`, `/shop/[id]` al build legge le immagini da Stripe

### Aggiungere un prodotto
1. Crealo su Stripe Dashboard → copia `prod_…` e `price_…` (uno per variante)
2. Aggiungi l'oggetto in `shop-data.ts`
3. Immagini in `public/shop/[id]/`
4. Digitali: file in `public/downloads/` + `downloadPath`

---

## 13. PODCAST — SYNC AUTOMATICO

- `.github/workflows/sync-podcast.yml`: ogni giorno alle 08:00 UTC (o manuale da GitHub → Actions) esegue `scripts/sync-podcast.js`
- Lo script legge il feed RSS Anchor e crea un `.md` in `src/content/podcast/` per ogni episodio nuovo (con `audioUrl` dall'`<enclosure>`), poi commit "podcast: nuovi episodi da RSS" come "Unmarked Bot" → Netlify rebuilda
- Dopo il sync conviene rivedere a mano `topic`, `excerpt`, `featured`, cover
- ⚠ Il bot pusha su `main`: fare **pull** in GitHub Desktop prima di committare per evitare conflitti

---

## 14. CHECKLIST PRIMA DEL LANCIO

- [ ] Eliminare contenuti test: `itinerari/isalnda-1.md`, `itinerari/isalnda-2.md` (verificare anche `isalnda.md`)
- [ ] Rinominare `libreria/aaaa.md` con uno slug vero (es. `cosa-mettere-nello-zaino`)
- [ ] Switchare Stripe da TEST a LIVE (chiavi env + webhook + price ID in `shop-data.ts`)
- [ ] **Creare `public/downloads/`** e caricare `desert-light-presets.zip` (oggi la cartella non esiste → download rotto). Valutare di non servirlo da `public/` (link indovinabile)
- [x] Test abbonamento Pro in modalità TEST (4 Ott 2026): checkout → webhook → `isPremium` su Clerk → Spotsbook sbloccato ✓
- [ ] Testare end-to-end: itinerario singolo, prodotto digitale, prodotto fisico (e ripetere l'abbonamento dopo il passaggio a LIVE)
- [ ] `/pro`: obbligare il login prima del checkout (oggi un utente sloggato paga ma l'abbonamento non viene associato a nessun account)
- [ ] Testare newsletter e `segreto.html` (mittente verificato su Brevo)
- [ ] `seoMetaDescription` e `mapCenter` su tutti gli articoli Libreria
- [ ] Aggiornare opzioni `relatedItinerary` nel CMS (oggi solo "Namibia")
- [x] Foto di Alice e Samuele in `/chi-siamo`

### Debito tecnico / da valutare
- Webhook `customer.subscription.deleted` cerca l'utente solo tra i primi 10 di Clerk → con più utenti fallisce. Usare `metadata` sulla subscription o una ricerca completa.
- Pagamenti senza login: il webhook non può associarli a un account (itinerario/abbonamento persi). Forzare il login prima del checkout o gestire via email.
- `@clerk/backend` è importato dal webhook ma non è in `package.json` (arriva come dipendenza di `@clerk/astro`) — aggiungerlo esplicitamente.
- Rimuovere i campi Lemon Squeezy da schema e CMS.
- Verificare se `Layout.astro` è ancora usato.
- Salvati Spotsbook su Clerk invece che localStorage.

---

## 15. NOTE OPERATIVE

### Aggiungere un nuovo itinerario
1. Crearlo da `/admin`
2. Aggiornare le opzioni `relatedItinerary` in `public/admin/config.yml`
3. Aggiungere le coordinate del paese in `countryCoords` (in `index.astro` e `mappa.astro`) se il paese è nuovo

### Nuovo episodio podcast
Automatico (vedi §13). Per farlo a mano: `audioUrl` dal tag `<enclosure url="...">` del feed RSS.

### Git e deploy
- Claude edita i file locali → GitHub Desktop (pull, commit, push) → Netlify autodeploy (~30s)
- Lock file bloccato: `rm /Users/samuelecavicchi/Desktop/unmarked/.git/HEAD.lock` e/o `index.lock`
- "Secret Detected" in GitHub Desktop: il `.env` non deve finire su Git

---

*Fine documento v10 — 4 Ottobre 2026.*
