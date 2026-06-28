# UNMARKED — Manuale d'uso quotidiano
*Aggiornato al 28 Giugno 2026*

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

### File da conoscere
- `src/data/shop-data.ts` — catalogo prodotti, **unico file da toccare**
- `scripts/sync-product-images.mjs` — script che aggiorna le immagini su Stripe
- `public/shop/[product-id]/` — cartelle immagini per ogni prodotto

---

### Aggiungere un nuovo prodotto (checklist completa)

**1. Crea il prodotto su Stripe**
- Stripe Dashboard → Products → Add product
- Inserisci nome e prezzo in EUR
- Copia il **Price ID** (`price_xxx`) e il **Product ID** (`prod_xxx`) — li trovi nella pagina del prodotto

**2. Aggiungi il prodotto in `src/data/shop-data.ts`**

Copia la struttura da un prodotto esistente e adattala. Campi obbligatori:

| Campo | Cosa mettere |
|---|---|
| `id` | Stringa unica senza spazi (es. `africa-maps`) — usata nell'URL `/shop/africa-maps` |
| `title` | Nome del prodotto |
| `subtitle` | Sottotitolo breve |
| `type` | `'digital'` o `'physical'` |
| `tag` | Digitali: `'preset'` `'lut'` `'sfx'` `'flare'` — Fisici: `'maps'` `'prints'` `'gear'` |
| `price` | Prezzo base in euro (numero) |
| `stripePriceId` | Il Price ID copiato da Stripe (`price_xxx`) |
| `stripeProductId` | Il Product ID copiato da Stripe (`prod_xxx`) — serve per la galleria immagini |
| `image` | `/shop/[product-id]/1.jpg` — immagine principale della card |
| `available` | `true` per renderlo visibile |

**3. Prepara le immagini**
- Crea la cartella `public/shop/[product-id]/`
- Metti dentro le foto rinominate `1.jpg`, `2.jpg`, `3.jpg`… (l'ordine è alfabetico)
- La `1.jpg` è anche quella della card nella vetrina

**4. Sincronizza le immagini su Stripe (prima del deploy)**

Dal terminale, nella cartella del progetto:
```
npm run sync-images
```
Lo script legge le foto dalla cartella e aggiorna Stripe con gli URL pubblici.

**5. Commit + push → deploy automatico**

Netlify builda, fetcha le immagini da Stripe e le bake nelle pagine. Fatto.

---

### Aggiornare le immagini di un prodotto esistente

1. Sostituisci o aggiungi foto in `public/shop/[product-id]/`
2. Da terminale: `npm run sync-images`
3. Commit + push → nuovo deploy

---

### Prodotti con varianti di formato (es. stampe A4 / A3 / A2)

Aggiungi il campo `variants` in `shop-data.ts`:

```ts
variants: [
  { label: 'A4', size: '21×29 cm', price: 69, stripePriceId: 'price_xxx_a4' },
  { label: 'A3', size: '30×42 cm', price: 89, stripePriceId: 'price_xxx_a3' },
  { label: 'A2', size: '42×59 cm', price: 129, stripePriceId: 'price_xxx_a2' },
],
```

Ogni variante ha il suo Price ID separato su Stripe. Il campo `price` del prodotto diventa il prezzo base (A4).

---

### Tipi di prodotto

| `type` | Checkout | Dopo il pagamento |
|---|---|---|
| `digital` | Senza raccolta indirizzo | Redirect a `/download?session=...` → download immediato |
| `physical` | Con raccolta indirizzo spedizione | Redirect a `/shop/grazie?session=...` |

### Ordini fisici

Nessuna azione tecnica richiesta dal sito. Dopo il pagamento:
1. Stripe ti invia email con indirizzo di spedizione
2. Tutti gli ordini sono su **Stripe Dashboard → Payments**
3. Spedisci e segna come completato

### Template details per tipo prodotto

Quando chiedi a Claude di aggiungere un prodotto, usa questi bullet come base:

**Mappe (`tag: 'maps'`)**
- Stampa fine art su carta Hahnemühle Photo Rag 308g
- Texture mappa originale Unmarked
- Dimensioni: 70×50 cm
- Consegnata con certificato di autenticità
- Spedita in tubo rigido protettivo
- Prodotta su ordinazione in 5–7 giorni lavorativi

**Stampe (`tag: 'prints'`)**
- Stampa fine art su carta Hahnemühle Photo Rag 308g
- Tiratura limitata: 50 esemplari per formato
- Firmata e numerata a mano
- Consegnata con certificato di autenticità
- Spedita in tubo rigido protettivo
- Prodotta su ordinazione in 5–7 giorni lavorativi

---

### Immagine su Stripe dashboard

**Non serve impostarla.** Il sistema usa solo le immagini caricate tramite `npm run sync-images`. L'immagine singola nel pannello Stripe viene ignorata.

---

### Aggiungere un prodotto con Claude

Se hai già la cartella immagini pronta in `public/shop/[product-id]/`, puoi delegare tutto a Claude. Digli:

1. **Nome del prodotto** e se è digitale o fisico
2. **Price ID** (`price_xxx`) e **Product ID** (`prod_xxx`) da Stripe
3. **Tag** (`preset` / `lut` / `maps` / `prints` / `gear`…)
4. **Descrizione** (anche due righe informali, la sistemo lui)
5. Se ha **varianti** di formato (es. A4/A3/A2 con prezzi e Price ID diversi)

Claude aggiorna `shop-data.ts`, esegue `sync-images` e ti dice quando fare commit + push.

---

## 13. Spotsbook — pin di anteprima per non abbonati

Il campo **"Anteprima pubblica"** in ogni location Black Book (`preview: true`) determina quali pin sono visibili e cliccabili nella mappa teaser per i non abbonati.

- **Pin `preview: true`**: visibile a tutti, cliccabile → apre pannello completo con tutto il contenuto della location + CTA abbonamento
- **Pin `preview: false`** (default): pin sfumato visibile, cliccabile → apre pannello "Location bloccata" + CTA

Per cambiarlo: `/admin` → Black Book → location → toggle **"Anteprima pubblica"** → Pubblica.

---

*Fine manuale v10 — 28 Giugno 2026.*
