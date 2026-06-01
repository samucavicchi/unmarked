# UNMARKED — Manuale d'uso quotidiano
*Aggiornato al 1 Giugno 2026*

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

*Fine manuale v7 — 1 Giugno 2026.*
