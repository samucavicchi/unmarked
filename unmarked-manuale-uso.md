# UNMARKED — Manuale d'uso quotidiano

Documento operativo per gestire il sito da solo.
Per la storia delle decisioni e l'architettura tecnica, vedi `unmarked-architettura.md`.

---

## Link utili

| Cosa | URL |
|---|---|
| Sito live | https://unmarked-staging.netlify.app |
| Pannello CMS (login con Netlify Identity) | https://unmarked-staging.netlify.app/admin |
| Repository GitHub | https://github.com/samucavicchi/unmarked |
| Dashboard Netlify | https://app.netlify.com/projects/unmarked-staging |
| Netlify Identity (gestione utenti) | https://app.netlify.com/projects/unmarked-staging/configuration/identity |

Account: `samu.cavicchi@gmail.com`. Password salvala nel password manager.

---

## 1. Pubblicare un contenuto dal CMS

Funziona uguale per Destinazioni, Itinerari, Film e Podcast.

1. Vai su https://unmarked-staging.netlify.app/admin
2. Login con email + password
3. Nella sidebar a sinistra, clicca la collezione (Destinazioni, Itinerari, Film o Podcast)
4. Clicca **New** in alto a destra
5. Compila i campi del form. La foto copertina si trascina nella drop zone
6. In alto a destra, clicca **Pubblica** (oppure il menu a tendina vicino → Publish now)
7. Decap fa un commit su GitHub. Netlify rileva il push e ricostruisce in ~30 secondi
8. Il contenuto è online

### Campi specifici per Film

- **YouTube ID**: solo l'ID del video, NON l'URL completo. Nell'URL `https://www.youtube.com/watch?v=dQw4w9WgXcQ` l'ID è `dQw4w9WgXcQ`
- **Foto copertina**: thumbnail editoriale del film (può essere diversa da quella YouTube)
- **In primo piano**: se attivato, questo è il film che appare nella hero della home

### Campi specifici per Podcast

- **Spotify Episode ID**: apri l'episodio su Spotify, click sui 3 puntini → Condividi → Embed → copia l'ID che vedi nell'URL `spotify:episode:XXXXX`
- **Numero episodio**: serve per ordinare

### Itinerari premium e paywall

- Il campo **Premium (richiede acquisto)** dei singoli giorni decide quali sono dietro paywall
- Per ora il bottone "Sblocca" non è collegato a Lemon Squeezy: il paywall è solo visivo (preview). Il pagamento vero arriva nella prossima sessione

### Itinerari — sezioni strutturate (aggiunte 11 mag con Step B)

Quando crei/modifichi un itinerario, sotto i campi base trovi 3 nuove sezioni collapsed (clicca per espanderle):

- **Vale il viaggio (strutturato)** — 3 sotto-liste **Dormire / Mangiare / Non perdere**. Per ogni voce:
  - Nome
  - Badge: scegli tra "Top pick", "Da provare" o "Hidden gem" (cambia colore della pillola)
  - Località (breve testo sotto il nome, es. "Camigliatello Silano · 5 min dal centro")
  - Descrizione
  - Tip (frase tra virgolette, viene evidenziata su sfondo cream — usalo per "il consiglio in più")
  - Prezzo (testo libero, es. "Da €65/notte" oppure "Accesso libero")
  
  Sulla pagina, il **primo item** di ogni colonna è gratis; gli altri vanno sotto paywall (blur + box "Altri consigli per gli abbonati"). Lascia il vecchio campo "Vale il viaggio — intro libero (legacy)" vuoto se compili la versione strutturata; lo intro può andare nel campo "Intro (opzionale)" dentro la sezione strutturata.

- **Mainstream check (strutturato)** — Intro opzionale + lista "Voci". Ogni voce è un luogo turistico da NON visitare:
  - Nome del luogo
  - Tipo (Località / Attrazione / Sentiero...)
  - Rating 1-5 stelline (più alto = più affollato/mainstream, più basso = ancora salvabile)
  - Verdetto (perché evitarlo)
  - Alternativa Unmarked (opzionale): un nome + il perché preferirla
  - Distanza opzionale (es. "12 km a est")
  
  Stesso pattern: prima voce libera, resto sotto paywall.

- **Galleria itinerario** — lista di foto sotto la mappa. Per ogni foto:
  - Foto
  - Didascalia
  - Wide (2 colonne): metti il primo della galleria come "wide" per dargli più spazio (occupa 2 col su 3)

- **Galleria del giorno** (dentro ogni Giorno) — lista di foto specifiche per quel giorno. Sulla pagina compare un bottoncino "+ N foto" sotto i tag del giorno: cliccandolo si espande la griglia. Click su una foto → lightbox a tutto schermo.

Tutti questi campi sono opzionali: se li lasci vuoti, la sezione semplicemente non appare sulla pagina.

---

## 2. Modificare le foto hero del sito

Le foto hero sono in `public/`, accessibili da tutto il sito. Sono separate dalle foto degli articoli.

### Foto attualmente in uso

| Path | Dove appare | Nome file |
|---|---|---|
| Homepage hero (la felce) | `/hero.jpg` | hero della home |
| Pagina /film hero | `/film-hero.jpg` | hero archivio film |
| Box "In cantiere" su /film | `/film-pipeline-pre.jpg`, `/film-pipeline-prod.jpg`, `/film-pipeline-soon.jpg` | tre box stato lavorazione |

### Come caricare/sostituire una foto hero

1. Prepara la foto sul Mac
   - Formato JPG (anche WebP va bene)
   - Per le hero principali: 2400×1600px (orizzontali), peso 400-700 KB, qualità 70-80
   - Per i box "In cantiere": 1200×900px (4:3), peso 200-400 KB
   - Rinominala con il nome esatto della tabella sopra (es. `film-hero.jpg`, tutto minuscolo, niente spazi)
2. Vai su GitHub: https://github.com/samucavicchi/unmarked/tree/main/public
3. Click **Add file** → **Upload files**
4. Trascina il file (o più file insieme) nella drop zone
5. In fondo, scrivi un commit message tipo `Add: foto hero archivio film`
6. Click **Commit changes**

Netlify rebuilda automaticamente. Tra 30-60 secondi la nuova foto è online.
Se la foto non c'è ancora, il sito mostra un fallback colorato — non si rompe.

---

## 3. Modificare i testi della sezione "In cantiere" su /film

I tre box (Pre-produzione, In produzione, Presto in arrivo) sono hardcoded nel codice perché cambiano raramente. Per modificarli:

1. Vai su https://github.com/samucavicchi/unmarked/edit/main/src/pages/film/index.astro
2. Nelle prime 30 righe del file vedi un blocco `const cantiere = [...]` con 3 oggetti
3. Per ciascuno modifica i campi:
   - `title`: il titolo del progetto
   - `sub`: la descrizione breve sotto
   - **NON modificare** `image`, `fallback`, `stage` (sono il path della foto, il colore di fallback e l'etichetta)
4. Scrolla in fondo, scrivi commit message tipo `Update: testi sezione In cantiere`
5. Click **Commit changes**

---

## 4. Modificare i testi della home (hero, manifesto, ecc.)

### Hero principale (titolo, sottotitolo, eyebrow)

Il componente è in https://github.com/samucavicchi/unmarked/edit/main/src/components/Hero.astro

Modifica i valori di default in cima al file:
```js
const {
  tag = 'Reportage · Fotografia · Itinerari',
  title = 'I luoghi che non trovi<br>sulle guide',
  subtitle = 'Unmarked racconta i posti che esistono ancora...',
}
```

Cambia `tag`, `title` o `subtitle` e committa.

### Sezione Itinerari placeholder (titolo, sottotitolo, CTA)

In https://github.com/samucavicchi/unmarked/edit/main/src/pages/index.astro cerca `<!-- ITINERARI -->` e modifica i testi tra `<h2 class="it-title">` e `<p class="it-body">`.

---

## 5. Risolvere problemi comuni

### Errore "ACCESS_TOKEN_ERROR / Failed getting jwt access token" sul CMS

Il token di sessione è scaduto o corrotto. Soluzione:

1. Sul pannello CMS, in alto a destra clicca l'avatar/email → **Logout**
2. Premi **Cmd+Shift+R** per hard refresh
3. Login di nuovo
4. Riprova a pubblicare

Se non basta, cambia browser (es. da Chrome a Safari) e ri-login.

### Pagina che dice "Site not available"

Netlify ha sospeso il sito perché abbiamo esaurito i crediti del piano free.
Vai su https://app.netlify.com/teams/samu-cavicchi/billing e controlla:
- Crediti rimanenti
- Se sei sul piano Free (300 crediti/mese) o Personal ($9/mese, 1000 crediti)

Se serve, upgrade a Personal. Una volta attivo, vai sui Deploys e clicca **Trigger deploy → Deploy project** per riavviare.

### La build Netlify è fallita

1. Vai su https://app.netlify.com/projects/unmarked-staging/deploys
2. Clicca sul deploy fallito
3. Leggi il **Deploy log**, cerca la riga rossa con il messaggio di errore
4. Cause comuni:
   - Errore di sintassi in un file Astro/TypeScript appena modificato
   - Schema Zod che rifiuta un campo dell'articolo (es. campo richiesto mancante nel CMS)
5. Se non capisci l'errore, aprilo in chat con me e te lo traduco

### Il CMS non mostra un nuovo campo che ho aggiunto al codice

È cache del browser. Soluzione:
1. Sul pannello `/admin`, premi **Cmd+Shift+R** (hard refresh)

---

## 6. Cosa NON toccare a mano

- `package.json` e `package-lock.json` (dipendenze del progetto)
- `astro.config.mjs` (configurazione build)
- I componenti `*.astro` dentro `src/components/` se non sai esattamente cosa stai facendo
- `src/content/config.ts` (schema dei contenuti)
- `public/admin/config.yml` (configurazione CMS)

Per modifiche a questi file, scrivimi.

---

## 7. Scrivermi quando

- Vuoi una nuova sezione o pagina (es. Shop reale, Consulenze, About)
- Vuoi cambiare il design di qualcosa
- C'è un bug che non capisci
- Vuoi aggiungere una collezione nuova al CMS
- Devi fare il cutover sul dominio definitivo `unmarked.it`
- Devi attivare i pagamenti reali con Lemon Squeezy + Supabase (Sessione 7)

---

## 8. Stato attuale del progetto

- Sito live e funzionante con CMS attivo
- Contenuti che hai pubblicato per test: 1 destinazione (test-islanda), 1 itinerario (isalnda), 2 film (The Eyes of Africa featured + The Dragon Blood Way)
- Da fare prima del lancio: paywall reale (Lemon Squeezy + auth), cutover dominio unmarked.it, eventuali ritocchi finali
- Piano Netlify: Personal $9/mese (cancellabile dopo il lancio quando il volume di deploy si stabilizza, allora torniamo al Free)

---

*Documento aggiornato al post-Step B, 11 maggio 2026.*
