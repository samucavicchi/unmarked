# UNMARKED — Architettura del progetto
*Documento di lavoro v8 · 3 Giugno 2026*

Questo documento è la **memoria esterna** del progetto. Se la chat viene compattata o ricominciata, leggere QUESTO doc + `unmarked-manuale-uso.md` + il codice su GitHub basta per riprendere il lavoro senza perdere niente.

---

## Stato attuale al 1 Giugno 2026

**URL e accessi**
- Sito live: https://unmarked.it
- Repo GitHub: github.com/samucavicchi/unmarked (main branch)
- CMS: https://unmarked.it/admin (login con Netlify Identity — samu.cavicchi@gmail.com)
- Netlify dashboard: app.netlify.com/projects/unmarked-staging
- Netlify project ID: `62f5c91a-a4d5-4490-bf2a-d08592e0a3c2`
- Clerk dashboard: dashboard.clerk.com
- Stripe dashboard: dashboard.stripe.com
- Brevo dashboard: app.brevo.com

**Stack tecnico attuale**
| Componente | Tecnologia |
|---|---|
| Framework | Astro v4 (SSR hybrid mode) |
| Hosting | Netlify (piano Personal $9/mese) |
| CMS | Decap CMS (Netlify Identity + Git Gateway) |
| Auth utenti | **Clerk** (`@clerk/astro`) |
| Pagamenti | **Stripe** (abbonamento + acquisto singolo) |
| Newsletter | **Brevo** (API v3, lista ID 6 "Unmarked Newsletter") |
| Dominio | unmarked.it (DNS A record → 75.2.60.5 Netlify) |
| Repo | github.com/samucavicchi/unmarked |

**Nota**: il progetto è partito con Netlify Identity + Supabase + Lemon Squeezy, poi migrato a **Clerk + Stripe** prima del lancio. Decap CMS continua ad usare Netlify Identity solo per il login al CMS `/admin` — gli utenti del sito usano Clerk.

---

## 1. DECISIONI PRESE

| Tema | Scelta |
|---|---|
| Stack | Astro v4 SSR hybrid + Decap CMS su Netlify |
| Auth utenti | Clerk (`@clerk/astro`) |
| Pagamenti | Stripe (singolo + abbonamento €29/mese) |
| Newsletter | Brevo (API v3) |
| Voce editoriale | Unica "Unmarked", nessuna firma autore |
| Lingua | Italiano |
| Tassonomia | Geografica pura: paese + continente |
| Modello vendita | Acquisto singolo per itinerario + abbonamento mensile €29/mese |
| Hosting | Netlify |
| Hosting immagini | Asset processing nativo Astro (`src/assets/articoli/`) |
| Podcast audio | RSS Anchor/Spotify for Creators (URL diretto MP3) |

---

## 2. STRUTTURA URL

### Pagine pubbliche
- `/` — Homepage (hero + destinazioni + mappa + itinerari + film + podcast + shop + newsletter)
- `/destinazioni` — Archivio destinazioni con filtri
- `/destinazioni/[slug]` — Pagina singola destinazione
- `/destinazioni/paese/[paese]` — Filtro per paese
- `/destinazioni/continente/[continente]` — Filtro per continente
- `/itinerari` — Archivio itinerari
- `/itinerari/[slug]` — Pagina singola itinerario (free + paywall)
- `/itinerari/paese/[paese]` — Filtro per paese
- `/itinerari/continente/[continente]` — Filtro per continente
- `/film` — Sezione film
- `/film/[slug]` — Film singolo
- `/podcast` — Sezione podcast
- `/podcast/[slug]` — Episodio singolo
- `/mappa` — Mappa interattiva mondiale Leaflet con tutti i pin
- `/consulenze` — Pagina consulenze
- `/chi-siamo` — About page (storia di Alice e Samuele, manifesto, team, cosa facciamo)
- `/mediakit` — Media Kit in italiano
- `/en/mediakit` — Media Kit in inglese

### Area utente (Clerk)
- `/sign-in` — Login (Clerk `<SignIn />`, SSR)
- `/sign-up` — Registrazione (Clerk `<SignUp />`, SSR)
- `/account` — Dashboard utente: abbonamento, itinerari acquistati, logout (SSR, redirect se non loggato)

### Backend
- `/admin` — Decap CMS (login con Netlify Identity)
- `/.netlify/functions/create-checkout-session` — Stripe checkout (abbonamento o singolo)
- `/.netlify/functions/stripe-webhook` — Webhook Stripe → aggiorna `publicMetadata` Clerk
- `/.netlify/functions/newsletter-subscribe` — Iscrizione newsletter → Brevo API

---

## 3. AUTENTICAZIONE E PAGAMENTI

### Clerk
- Installato con `@clerk/astro`
- Variabili env: `CLERK_SECRET_KEY`, `PUBLIC_CLERK_PUBLISHABLE_KEY`
- `astro.config.mjs`: integrazione clerk con `signInUrl: '/sign-in', signUpUrl: '/sign-up'`
- Middleware: `src/middleware.ts` con `clerkMiddleware()`
- Pagine SSR (`export const prerender = false`): `/account`, `/sign-in`, `/sign-up`, `/itinerari/[slug]`
- `Astro.locals.currentUser()` per lato server
- Componenti: `<SignedIn>`, `<SignedOut>`, `<SignOutButton>`

### Dati utente in Clerk `publicMetadata`
```json
{
  "isPremium": true,
  "plan": "subscription",
  "purchasedItinerari": ["slug-1", "slug-2"],
  "stripeCustomerId": "cus_xxx"
}
```

### Stripe
- Variabili env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUBSCRIPTION_PRICE_ID`
- Due modalità: `mode: 'subscription'` o `mode: 'payment'`
- Il checkout passa `userId` (Clerk) nei `metadata`
- Il webhook ascolta `checkout.session.completed` → aggiorna `publicMetadata` Clerk
- **Attualmente in modalità TEST** — da switchare a live prima del lancio
- Se utente non loggato clicca "Acquista": redirect a `/sign-in?redirect_url=...`

---

## 4. NEWSLETTER — BREVO

- Lista: "Unmarked Newsletter" — **ID 6**
- API key: `BREVO_API_KEY` in `.env` locale e su Netlify env vars (**mai su GitHub**)
- Endpoint: `/.netlify/functions/newsletter-subscribe`
- Due form: `Newsletter.astro` (home) e `NewsletterPopup.astro` (popup slide-up basso-sinistra)
- `.env` è in `.gitignore`

---

## 5. SCHEMA CONTENT COLLECTIONS (`src/content/config.ts`)

### Destinazioni
`title, subtitle?, country, continent(enum 5), region?, coverImage, coverImageAlt, excerpt, publishDate, featured, seoMetaDescription?, interludeImage?, interludeCaption?, pullQuote?, mapCenter?{lat,lng,zoom}, mapMarkers[]{lat,lng,label}, relatedItinerary?(string)`

**Nota `relatedItinerary`**: campo CMS `select` con opzioni manuali (titoli itinerari). Nel codice si usa `getCollection('itinerari').find()` per titolo (case-insensitive), NON `getEntry` per slug.

### Itinerari
`title, subtitle?, country, continent, coverImage, coverImageAlt, excerpt, publishDate, featured, duration, budget(Economico/Medio/Alto), difficulty(Facile/Medio/Avventura), bestSeason, transport, price, audioUrl?(string)`

Strutturati opzionali: `vale?{intro?, dormire?[], mangiare?[], tappe?[]}, mainstream?{intro?, items[]}, gallery?[]`

Giorni: `days[]{dayNumber, title, description, kmTotali?, dislivello?, dormire?, mangiare?, isPremium, gallery?[]}`

Mappe: `mapCenter?{lat,lng,zoom}, mapMarkers[]{lat,lng,label,dayNumber?}`

### Film
`title, subtitle?, country, continent, coverImage, coverImageAlt, excerpt, publishDate, featured, youtubeId, duration, type(enum 5)`

### Podcast
`title, subtitle?, coverImage?, coverImageAlt?, excerpt, publishDate, featured, spotifyEpisodeId, audioUrl?(string), episodeNumber, duration, topic(enum 5), guests?`

---

## 6. COMPONENTI GLOBALI

| Componente | Funzione |
|---|---|
| `Navbar.astro` | Logo, link, hamburger mobile, icone (cerca/pin/utente) |
| `SearchOverlay.astro` | Ricerca full-text su destinazioni + itinerari |
| `NewsletterPopup.astro` | Popup slide-up dopo 15s, basso-sinistra, z-index 1100 |
| `PodcastMiniPlayer.astro` | Player audio nativo con `transition:persist` |
| `BaseLayout.astro` | Include tutti i precedenti + ViewTransitions |

### ViewTransitions
Attive in `BaseLayout.astro` (`<ViewTransitions />`). Necessarie per `transition:persist` del mini player podcast. Permettono navigazione client-side senza full reload.

---

## 7. MAPPA INTERATTIVA

### `/mappa`
Leaflet.js con tiles CartoDB Light, pin per destinazioni (terra) e itinerari (scuro), filtri, popup con foto.

### Sezione mappa in Homepage
- Mappa statica embedded (no scroll/drag)
- Click pin → popup; click sfondo → naviga a `/mappa`
- Fade su 4 lati con div overlay (`isolation: isolate` sul wrapper per contenere z-index)
- Coordinate fallback per paese in `countryCoords` (stesso oggetto in `/mappa` e `index.astro`)

---

## 8. RESPONSIVE / MOBILE

Breakpoint: 768px in `global.css`.

Mobile:
- Navbar con hamburger menu
- Griglie a colonna singola (destinazioni, film, podcast)
- Itinerari featured: sfondo terra + testo bianco
- Desktop featured: span 2 colonne, immagine 320px
- Newsletter impilata, form in colonna

---

## 9. VARIABILI D'AMBIENTE

| Variabile | Note |
|---|---|
| `CLERK_SECRET_KEY` | Backend Clerk |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | Frontend Clerk |
| `STRIPE_SECRET_KEY` | Backend Stripe |
| `STRIPE_WEBHOOK_SECRET` | Verifica firma webhook |
| `STRIPE_SUBSCRIPTION_PRICE_ID` | ID piano abbonamento |
| `BREVO_API_KEY` | Newsletter Brevo — MAI su GitHub |

---

## 10. MEDIA KIT

### Struttura
- `src/pages/mediakit.astro` — versione italiana (`/mediakit`)
- `src/pages/en/mediakit.astro` — versione inglese (`/en/mediakit`)
- `src/data/mediakit-data.ts` — **file dati condiviso**: numeri, foto, reel, prezzi, email

### Come aggiornare
- **Numeri (follower, views, newsletter)** → modifica `mediakitData.reach`, `mediakitData.samuele`, `mediakitData.alice` in `src/data/mediakit-data.ts`. Si aggiorna su entrambe le lingue.
- **Prezzi** → modifica `mediakitData.pricing` nello stesso file.
- **Reel** → aggiungi/rimuovi oggetti nell'array `mediakitData.reels`. Cover in `public/reel-covers/`.
- **Testi** → vanno modificati separatamente nei due file `.astro` (sono diversi per lingua).
- **Foto profilo Samuele/Alice** → aggiorna i path in `mediakitData.samuele.photo` e `mediakitData.alice.photo`.

### Case study — aggiungere foto e film
In `mediakit.astro` e `en/mediakit.astro`, trovare il blocco `.mk-case-gallery`:
- Sostituire `mk-case-photo-placeholder` con `style="background-image:url('/path/foto.jpg')"` per le foto
- Per il film: togliere il commento dall'`<iframe>` e inserire l'YouTube ID del video

### Cover reel
Le immagini vanno in `public/reel-covers/` con i nomi: `mazda-1.jpg`, `mazda-2.jpg`, `nikon.jpg`, `asus.jpg`, `lexar.jpg`

---

## 11. CONTENUTI TEST DA RIMUOVERE

- `src/content/itinerari/isalnda-1.md`
- `src/content/itinerari/isalnda-2.md`
- `src/content/destinazioni/test-islanda.md`

---

## 12. CHECKLIST PRIMA DEL LANCIO

- [ ] Eliminare contenuti test
- [ ] Switchare Stripe da TEST a LIVE
- [ ] Aggiungere foto di Alice e Samuele in `/chi-siamo` (CSS: `.cs-person-img-alice`, `.cs-person-img-samuele`)
- [ ] `seoMetaDescription` su tutte le destinazioni
- [ ] `mapCenter` su tutte le destinazioni
- [ ] Aggiornare opzioni `relatedItinerary` nel CMS per ogni nuovo itinerario
- [ ] `audioUrl` su ogni nuovo episodio podcast
- [ ] Testare flusso acquisto Stripe end-to-end in produzione
- [ ] Testare iscrizione newsletter

---

## 13. NOTE OPERATIVE

### Aggiungere un nuovo itinerario
1. Crearlo dal CMS `/admin`
2. Aggiungere `audioUrl` nel frontmatter (URL MP3 da RSS Anchor)
3. Aggiornare opzioni `relatedItinerary` in `public/admin/config.yml`
4. Aggiungere coordinate paese in `countryCoords` se paese nuovo

### Trovare audioUrl di un episodio
1. Aprire `https://anchor.fm/s/112725408/podcast/rss`
2. Cercare `<enclosure url="...">` per l'episodio
3. Copiare l'URL nel campo `audioUrl` del `.md`

### Git e deploy
- Claude edita file locali → GitHub Desktop (commit + push) → Netlify (autodeploy ~30s)
- Lock file: `rm /Users/samuelecavicchi/Desktop/unmarked/.git/HEAD.lock` e/o `index.lock`
- Se GitHub Desktop blocca per "Secret Detected": il `.env` non deve essere su Git

---

*Fine documento v8 — 3 Giugno 2026.*
