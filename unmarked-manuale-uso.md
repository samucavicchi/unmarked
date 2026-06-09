# UNMARKED — Manuale d'uso quotidiano
*Aggiornato al 9 Giugno 2026*

Documento operativo per gestire il sito da solo.
Per l'architettura tecnica completa, vedi `unmarked-architettura.md`.

---

## Link utili

| Cosa | URL |
|---|---|
| Sito live | https://unmarked.it |
| CMS | https://unmarked.it/admin |
| Repository GitHub | https://github.com/samucavicchi/unmarked |
| Netlify dashboard | https://app.netlify.com/projects/unmarked-staging |
| Clerk (utenti) | https://dashboard.clerk.com |
| Stripe (pagamenti) | https://dashboard.stripe.com |
| Brevo (newsletter) | https://app.brevo.com |
| Spotify for Creators (podcast) | https://creators.spotify.com |

Account principale: `samu.cavicchi@gmail.com`

---

## 1. Pubblicare un contenuto dal CMS

Funziona uguale per Destinazioni, Itinerari, Film e Podcast.

1. Vai su https://unmarked.it/admin
2. Login con email + password (Netlify Identity)
3. Sidebar sinistra → clicca la collezione
4. Clicca **New** in alto a destra
5. Compila i campi del form
6. Clicca **Publish** (o "Publish now" dal menu a tendina)
7. Decap fa un commit su GitHub → Netlify rebuilda in ~30 secondi
8. Contenuto online

---

## 2. Campi specifici per tipo di contenuto

### Destinazioni
- **Itinerario correlato**: seleziona dall'elenco. Le opzioni vanno aggiornate manualmente in `public/admin/config.yml` ogni volta che aggiungi un nuovo itinerario
- **Map Center**: coordinate lat/lng per centrare la mappa Leaflet nella pagina destinazione
- **Immagine interlude**: foto full-screen tra il testo e la pull quote

### Itinerari
- **Prezzo**: in euro, solo numero (es. 15)
- **Giorni premium**: attiva "Premium" sui giorni che vuoi dietro paywall
- **audioUrl**: URL diretto MP3 dall'RSS Anchor (vedi sezione sotto)

### Film
- **YouTube ID**: solo l'ID, non l'URL completo. Da `https://www.youtube.com/watch?v=dQw4w9WgXcQ` prendi solo `dQw4w9WgXcQ`

### Podcast
- **Spotify Episode ID**: apri episodio su Spotify → 3 puntini → Condividi → Embed → copia l'ID dall'URL
- **audioUrl**: URL diretto MP3 (vedi sezione sotto) — serve per il mini player sul sito

---

## 3. Trovare l'audioUrl di un episodio podcast

L'audioUrl è il link diretto al file MP3 — serve per far funzionare il mini player sul sito.

1. Apri nel browser: `https://anchor.fm/s/112725408/podcast/rss`
2. È un XML — cerca `<enclosure url="..."` per l'episodio che ti interessa
3. Copia quell'URL
4. Incollalo nel campo `audioUrl` del file `.md` dell'episodio (tramite CMS o GitHub)

---

## 4. Aggiungere un nuovo itinerario (checklist)

1. Crealo dal CMS
2. Aggiungi `audioUrl` se ha un episodio podcast collegato
3. Apri `public/admin/config.yml` su GitHub e aggiungi il titolo dell'itinerario alle opzioni del campo `relatedItinerary` nelle destinazioni
4. Se il paese è nuovo, aggiungi le coordinate in `countryCoords` in `src/pages/mappa.astro` e `src/pages/index.astro`

---

## 5. Gestire gli utenti (Clerk)

Vai su https://dashboard.clerk.com → la tua app → Users.

Qui puoi vedere tutti gli utenti registrati, i loro abbonamenti, e modificare manualmente i `publicMetadata` se necessario.

I campi `publicMetadata` importanti:
- `isPremium: true/false` — se l'utente ha accesso premium
- `plan: "subscription"` — tipo piano
- `purchasedItinerari: ["slug"]` — itinerari acquistati singolarmente
- `stripeCustomerId: "cus_xxx"` — ID Stripe dell'utente

---

## 6. Gestire i pagamenti (Stripe)

Vai su https://dashboard.stripe.com.

**Attenzione**: attualmente in modalità TEST. Prima del lancio va switchato a LIVE:
1. Stripe dashboard → switcha a modalità Live
2. Copia le nuove chiavi live (`sk_live_...`, `whsec_...`, `price_live_...`)
3. Aggiornale su Netlify: Site settings → Environment variables

---

## 7. Gestire la newsletter (Brevo)

Vai su https://app.brevo.com.

- Lista contatti: **Contacts → Lists → "Unmarked Newsletter"** (ID 6)
- Per inviare una newsletter: **Marketing → Email campaigns → Create**
- I nuovi iscritti dal sito arrivano automaticamente nella lista quando compilano il form

---

## 8. Deployare modifiche al codice

Claude modifica i file locali nel tuo Mac → tu fai commit + push da GitHub Desktop → Netlify rebuilda automaticamente.

Se GitHub Desktop si blocca con "lock file":
```
rm /Users/samuelecavicchi/Desktop/unmarked/.git/HEAD.lock
rm /Users/samuelecavicchi/Desktop/unmarked/.git/index.lock
```

Se GitHub blocca il push per "Secret Detected": la chiave API è finita per errore nel codice. Controlla che `.env` non sia stato committato. Il file `.env` non deve MAI essere su GitHub.

---

## 9. Forzare un redeploy senza modifiche al codice

Netlify → il tuo sito → Deploys → **Trigger deploy → Deploy site**.

Utile dopo aver modificato variabili d'ambiente.

---

## 10. Aggiungere foto di Alice e Samuele nella pagina Chi siamo

In `src/pages/chi-siamo.astro`, trova le classi CSS:
```css
.cs-person-img-samuele { /* aggiorna background-image: url('...') */ }
.cs-person-img-alice { /* aggiorna background-image: url('...') */ }
```

Carica le foto in `public/` e aggiorna i path.

---

---

## 11. Aggiungere una location al Black Book (Spotsbook)

1. Vai su https://unmarked.it/admin → **Black Book** → **New**
2. Compila i campi:
   - **Titolo, Paese, Continente, Tipo** — obbligatori
   - **Lat / Lng** — coordinate GPS precise (es. da Google Maps: tasto destro → "Che cosa c'è qui?")
   - **Stato** → `published` per renderla visibile, `coming_soon` per il pin sfumato
   - **Ora ottimale** — es. "06:15 – 07:45" (appare come "Luce ottimale")
   - **Periodo** — es. "Giugno – Settembre"
   - **Tecnica consigliata** — campo libero multiriga (focale, diaframma, consigli di scatto)
   - **Composizione consigliata** — suggerimenti compositivi
   - **Difficoltà fotografica** — Bassa / Media / Alta
   - **Avvicinamento** — Bassa / Media / Alta (difficoltà per raggiungere lo spot)
   - **Accesso** — descrizione testuale del percorso
   - **Anti-mainstream** — consiglio alternativo rispetto al modo "turistico" di fotografare il posto
   - **Annotazioni a mano** — note brevi in stile campo (appaiono con ↳, font a mano)
   - **Attrezzatura consigliata** — spunta le voci che servono (Treppiede, Filtri, Grandangolo, Tele, Lente luminosa, Cover impermeabile)
   - **Checklist pratica** — consigli logistici (es. "porta stivali", "prenota guida con 3 mesi anticipo")
   - **Nota personale** — commento personale, appare con ★
   - **Coordinate testuali** — es. "-1.0333, 29.6833 · Bwindi NP" (copiabili dagli utenti con un click)
   - **Immagini overlay** — carica le foto direttamente, vengono salvate in `public/spotsbook/`. La prima foto appare come preview nel pannello laterale
3. Pubblica → Netlify rebuilda in ~30s

### Tipi di pin sulla mappa
| Colore | Significato |
|---|---|
| Terra cotta | Location disponibile |
| Giallo | Salvata dall'utente |
| Verde acqua + pallino | Nuova (pubblicata negli ultimi 30 giorni) |
| Grigio semitrasparente | Coming soon (non cliccabile) |

---

---

## 12. Gestire lo Shop

### Struttura
- `src/data/shop-data.ts` — catalogo prodotti (unico file da modificare per prezzi, testi, immagini)
- `src/pages/shop.astro` — vetrina pubblica `/shop`
- `src/pages/download.astro` — pagina download per prodotti digitali `/download?session=...`
- `src/pages/shop/grazie.astro` — conferma ordine per prodotti fisici `/shop/grazie?session=...`

### Aggiungere o modificare un prodotto

1. Apri `src/data/shop-data.ts`
2. Aggiungi un oggetto nell'array `shopProducts` seguendo la struttura esistente
3. Crea il prodotto su **Stripe Dashboard → Products → Add product**
   - Aggiungi nome, prezzo fisso in EUR
   - Copia il **Price ID** (es. `price_1Pxxx...`) e incollalo nel campo `stripePriceId`
4. Per i **digitali**: carica il file in `public/downloads/` con il nome indicato in `downloadPath`
5. Carica l'immagine in `public/shop/` con il nome indicato in `image`
6. Commit + push → Netlify rebuilda

### Tipi di prodotto

| Campo `type` | Comportamento checkout |
|---|---|
| `digital` | Stripe senza raccolta indirizzo → redirect a `/download?session=...` |
| `physical` | Stripe con raccolta indirizzo spedizione → redirect a `/shop/grazie?session=...` |

### Come funziona il download (digitali)

1. Utente paga → Stripe redirect a `/download?session={id}`
2. La pagina chiama Stripe per verificare `payment_status === 'paid'`
3. Se ok: mostra il pulsante di download diretto al file in `public/downloads/`
4. Se ko: mostra messaggio di errore con email supporto

Il link non ha scadenza — l'utente può salvare la pagina o usare il link nell'email di conferma Stripe.

### Ordini fisici

Gli ordini fisici non richiedono nessuna azione tecnica dal sito. Dopo il pagamento:
1. Stripe ti invia email di conferma con indirizzo di spedizione
2. Trovi tutti gli ordini su **Stripe Dashboard → Payments**
3. Spedisci manualmente e segna come spedito (opzionale: usa Stripe Shipping nel dashboard)

### Campi di shop-data.ts

| Campo | Note |
|---|---|
| `id` | Stringa unica (es. `preset-desert-light`) — usata come chiave nel checkout |
| `type` | `'digital'` o `'physical'` |
| `price` | Solo per display — il prezzo reale è quello definito su Stripe |
| `stripePriceId` | **Obbligatorio** — copiare da Stripe Dashboard |
| `image` | Path relativo a `public/` (es. `/shop/preset.jpg`) |
| `downloadPath` | Solo digitali — path al file in `public/downloads/` |
| `shipping` | Solo fisici — `true` per abilitare raccolta indirizzo |
| `shippingCountries` | Array ISO 3166-1 alpha-2 — vuoto `[]` = lista default (IT, DE, FR, GB, US...) |
| `available` | `false` = prodotto nascosto dalla vetrina |
| `badge` | Etichetta opzionale (es. "Bestseller", "Edizione limitata") |

---

## 13. Spotsbook — pin di anteprima per non abbonati

Il campo **"Anteprima pubblica"** in ogni location Black Book (`preview: true`) determina quali pin sono visibili e cliccabili nella mappa teaser per i non abbonati.

- **Pin `preview: true`**: visibile a tutti, cliccabile → apre pannello completo con tutto il contenuto della location + CTA abbonamento
- **Pin `preview: false`** (default): pin sfumato visibile, cliccabile → apre pannello "Location bloccata" + CTA

Per cambiarlo: `/admin` → Black Book → location → toggle **"Anteprima pubblica"** → Pubblica.

---

*Fine manuale v9 — 9 Giugno 2026.*
