# UNMARKED — Architettura del progetto
*Documento di lavoro v6 · 11 Maggio 2026*

Questo documento è la **memoria esterna** del progetto. Se la chat con Jonny viene compattata o ricominciata, leggere QUESTO doc + `unmarked-manuale-uso.md` + il codice su GitHub basta per riprendere il lavoro senza perdere niente.

---

## Stato attuale al 11 Maggio 2026

**URL e accessi**
- Sito live: https://unmarked-staging.netlify.app
- Repo GitHub: github.com/samucavicchi/unmarked (main branch, ~95 commit)
- CMS: /admin con login Netlify Identity (samu.cavicchi@gmail.com)
- Netlify dashboard: app.netlify.com/projects/unmarked-staging
- Netlify Identity: app.netlify.com/projects/unmarked-staging/configuration/identity
- Netlify project ID: `62f5c91a-a4d5-4490-bf2a-d08592e0a3c2`

**Nota importante sul subdomain**: il 10 mag il vecchio subdomain `tourmaline-tartufo-0cbf4c.netlify.app` ha avuto un'anomalia DNS (NXDOMAIN globale) lato Netlify, non risolvibile via redeploy. Il progetto è stato rinominato in `unmarked-staging` per riprovisionare il record. Il vecchio URL non funziona più. Project ID, Identity users, Git Gateway, CMS sono legati al project ID e quindi sono rimasti intatti. La cosa è comunque temporanea: al lancio si passa a `unmarked.it`.

**Piano Netlify**: Personal $9/mese (1000 crediti). Cancellabile dopo il lancio quando i deploy si stabilizzano (basta il free 300 crediti per mantenere un sito CMS-driven con pubblicazioni regolari).

**Sessioni completate**
- S1 Architettura ✓
- S2 Scaffolding Astro + design portato + primo deploy ✓
- S3 Decap CMS + Netlify Identity + Git Gateway + collection Destinazioni ✓
- S4 Pagine dinamiche Destinazioni (archivio, [slug], filtri paese/continente, home dinamica) ✓
- S5 Itinerari + paywall preview (giorni premium con lucchetto, mappa Leaflet, CTA fittizia) ✓ *(in standby — bottoni paywall non ancora collegati a Lemon Squeezy)*
- S6 Film (YouTube embed) + Podcast (Spotify embed) + redesign film cards + Hero pagina /film + sezione "In cantiere" ✓
- **Wave grafica destinazioni** (3-4 mag): hero come manifesto puro, pagina destinazione singola riscritta editoriale (hero full-bleed, drop cap, foto inline full-bleed), wow pack destinazione (interlude full-screen, pull quote scura, mappa Leaflet, CTA itinerario correlato, parallax hero), fix overflow-x ✓
- **Wave UI 10 mag** — più piccoli fix e ridesign della pagina itinerario singolo ✓ (dettaglio sotto)
- **Step B 11 mag** — estensione completa del modello dati e del render itinerario singolo: vale strutturato (3 colonne con paywall), mainstream check con stelle e alternativa, galleria itinerario + galleria per giorno, lightbox ✓ (dettaglio sotto)

**Wave UI 10 mag — cosa è stato fatto oggi**
1. Fix linea bianca a sx dell'interludio destinazione: aggiunto `padding: 0` a `.article-interlude` per neutralizzare il padding globale `section { padding: 60px 40px 0 }`.
2. Fix mappa Leaflet sulle destinazioni: aggiunto `<slot name="head" />` in `BaseLayout.astro` dentro `<head>` (così il `<link slot="head" rel="stylesheet" leaflet.css>` viene renderizzato e non più scartato), e cambiato init Leaflet da `DOMContentLoaded` a `window.addEventListener('load', ...)` per evitare race condition.
3. Restyle home — sezione "Ultime destinazioni": 3 side card invece di 4, foto a sx + testo a dx (paese·continente / titolo / sottotitolo), niente data. Altezza totale side stack = altezza featured (380px). Aggiunto subtitle anche sulla featured. CSS aggiunto in coda a `global.css` con selettori `.dest-featured > .side-list ...` per limitare scope alla home.
4. Pagina `/itinerari` (archivio): aggiunta hero con video YouTube embed (autoplay, mute, loop, no controls) con bordi stondati 24px e padding laterale 24px. Costante `HERO_VIDEO_ID` configurabile in cima al file; se vuota, fallback a `/hero.jpg`. Sotto la hero, header dell'archivio + filtri + grid invariati. NB: dopo replace iniziale è stato necessario reintrodurre il `<section>` di apertura — verificare prima di toccare di nuovo.
5. Pagina `/itinerari/[slug]` — paywall sfumato (poi superato dallo Step A — vedi sotto). Il fix intermedio applicava `max-height: 110px + ::after gradient` ai `.day-card-faded` e `.itin-fade-wrap` per il mainstream check.
6. **STEP A — Redesign completo pagina itinerario singolo** (commit `ddc2958`). Sostituito interamente il vecchio `[slug].astro` con il nuovo design ispirato al template HTML di Samu in `~/Downloads/Nuova cartella con elementi/unmarked-itinerario_7.html`. Dettaglio nella sezione "Pagina itinerario singolo — nuovo design" sotto.

**Wave Step B 11 mag — cosa è stato fatto**
1. **Schema Zod esteso** (commit `87d33b7`, `src/content/config.ts`): aggiunti alla collection `itinerari` i campi opzionali `vale` (object con `intro?, dormire[], mangiare[], tappe[]`), `mainstream` (object con `intro?, items[]`), `gallery` (array immagini), e dentro `days[]` il campo `gallery` (array immagini). I vecchi `valeIlViaggio` (string) e `mainstreamCheck` (string) sono mantenuti come legacy fallback — i contenuti esistenti continuano a buildare.
2. **Decap CMS aggiornato** (commit `428b29d`, `public/admin/config.yml`): form con i nuovi widget object/list per Vale il viaggio (3 sotto-list Dormire/Mangiare/Non perdere, ognuna con item `{name, badge enum 3 opzioni, location?, description, tip?, price?}`), Mainstream check (intro + list `items` con stelle 1-5 + alternativa), Galleria itinerario (image + caption + wide), Galleria del giorno (image + caption) dentro ogni giorno. Anche fix `site_url/display_url/logo_url` da `tourmaline-tartufo-0cbf4c.netlify.app` (morto) a `unmarked-staging.netlify.app`.
3. **Render `[slug].astro` aggiornato** (commit `fadaa13`): aggiunte 3 sezioni dopo il body 2-col:
   - **Vale il viaggio** (`.vale` / `.vale-grid`): 3 colonne, primo item per colonna libero, item secondari sotto `vale-paywall-wrap` blur + overlay + box "Altri consigli riservati agli abbonati". Badge `must` (terra) / `good` (beige) / `hidden` (sage). Tip in box cream con `border-left` terra. Prezzo evidenziato in `<strong>`.
   - **Mainstream check** (`.ms` / `.ms-list`): list con grid `1fr auto`, ogni item ha nome + tipo + 5 stelline (`★` filled in terra, vuote in light-border), verdetto, alternativa Unmarked in box sage con `border-left`, distanza opzionale a destra. Primo item libero, resto sotto `ms-paywall-wrap`. Fallback: se `data.mainstream` non c'è ma `data.mainstreamCheck` (legacy string) sì, lo renderizza come `ms-intro`.
   - **Galleria itinerario** (`.it-gallery-grid`): grid 3 colonne × auto-rows 300px. Primo item può fare span 2 (`wide`).
   - **Galleria per giorno**: toggle `.day-gallery-toggle` ("+ N foto", icon rotation +45° on open) → grid 2 col 160px. Caption row.
   - **Lightbox** vanilla: click qualsiasi `.day-gallery-img` o `.gal-item` apre overlay full-screen scuro con `<img>` zoomata, click qualunque o ESC per chiudere.
4. **Contenuto `isalnda.md` invariato**: i nuovi campi sono tutti opzionali quindi il build resta verde. Quando Samu popolerà un itinerario reale, basterà compilare i nuovi widget dal CMS.

**Cosa manca per il lancio**
1. **Sessione 7** — paywall reale (Lemon Squeezy checkout + Supabase utenti/acquisti + webhook + verifica server-side accesso premium); PDF generation per offline; cutover dominio `unmarked.it`.
2. Pubblicare i primi articoli reali al posto dei placeholder/test.
3. Eventuali ritocchi grafici (sezione Shop placeholder, copy hero) e definizione di un video reale per la hero `/itinerari` (oggi è in fallback su hero.jpg perché `HERO_VIDEO_ID` è vuoto).

**Bug aperti / known issues**
- Nessuno noto all'11 mag. Aggiornamenti sintetici:
  - DNS NXDOMAIN sul vecchio subdomain — risolto col rename a `unmarked-staging` (e il file `admin/config.yml` ora rispecchia il nuovo URL — 11 mag).
  - Linea bianca sx interludio — fix `padding: 0`.
  - Mappa Leaflet su destinazioni — fix slot head + load event.

**Test content attualmente nel CMS**
- Destinazione: `test-islanda` (slug) — minimal, serve come seed. Anche un'altra "Islanda inverno" pubblicata (slug diverso da test) — appare sia in featured che in side della home (duplicato di titolo, non di slug). Se serve, deduplicare per titolo o cancellare uno dei due dal CMS.
- Itinerario: `isalnda` (slug, con typo) — usato per testing del nuovo design /itinerari/[slug]. Ha 3 giorni di cui 1 free + 2 premium, valeIlViaggio + mainstreamCheck riempiti, mapCenter e mapMarkers settati.
- Film: `the-eyes-of-africa` (featured), `the-dragon-blood-way`.
- Podcast: nessuno.

**Fonte di verità del codice**: GitHub. Il repo locale `~/Documents/Unmarked/unmarked/` su Mac di Samu è solo backup, non sincronizzato. Tutte le modifiche passano per GitHub web edit (via Claude in Chrome, oppure manualmente da Samu).

**Template HTML reference su Mac**: Samu ha una cartella `~/Downloads/Nuova cartella con elementi/` con HTML statici di reference per le varie pagine (`unmarked-itinerario_7.html`, `unmarked-archivio-itinerari.html`, `unmarked-consulenze*.html`, `unmarked-podcast*.html`, etc.). Sono prototipi statici da cui derivare i template Astro. Il file `unmarked-itinerario_7.html` è il riferimento principale per la pagina itinerario singolo (usato per lo Step A oggi).

---

## 1. DECISIONI PRESE (riepilogo)

| Tema | Scelta |
|---|---|
| Stack | Astro + Decap CMS su Netlify |
| Voce editoriale | Unica "Unmarked", nessuna firma autore |
| Foto negli articoli | Copertina + foto sparse nel testo con didascalie |
| Lingua | Italiano ora, inglese predisposto in architettura |
| Tassonomia | Geografica pura: paese + continente. Niente tag tematici |
| Itinerari premium | Sito con login + PDF scaricabile per uso offline |
| Modello vendita | Vendita singola (prezzo libero per itinerario) + abbonamento €29/mese o €149/anno |
| Hosting | Netlify (continuo) |
| Repo | github.com/samucavicchi/unmarked |
| Auth | Netlify Identity (gratis, integrato) |
| Database | Supabase (free tier — utenti, acquisti, abbonamenti) |
| Pagamenti | Lemon Squeezy (singoli + ricorrenti) |
| PDF generation | Server-side al momento del download |

---

## 2. STRUTTURA URL

### Pagine pubbliche
- `/` — Homepage
- `/destinazioni` — Archivio destinazioni (con filtri per continente/paese/tag)
- `/destinazioni/[slug]` — Pagina singola destinazione
- `/itinerari` — Archivio itinerari (con hero video YouTube)
- `/itinerari/[slug]` — Pagina singola itinerario (free + paywall)
- `/film` — Sezione film (statica per ora)
- `/podcast` — Sezione podcast (statica per ora)
- `/shop` — Sezione shop (statica per ora)
- `/consulenze` — Pagina consulenze
- `/about`, `/contatti`, `/privacy`, `/termini` — Pagine legali

### Area utente
- `/login` · `/registrati` · `/password-reset`
- `/account` — Dashboard utente
- `/account/itinerari` — I miei itinerari acquistati
- `/account/abbonamento` — Stato abbonamento

### Backend
- `/admin` — Decap CMS (login con Netlify Identity)
- `/api/lemon-squeezy-webhook` — Endpoint per notifiche pagamento

### Predisposizione inglese (futuro)
- L'italiano vive a `/destinazioni/sila` (senza prefisso, è la lingua di default)
- Quando aggiungeremo l'inglese: `/en/destinazioni/sila`
- Nessuna migrazione richiesta: cambia solo il routing

---

## 3. HOSTING IMMAGINI

Soluzione iniziale: **asset processing nativo di Astro**.
- Le foto si caricano via Decap CMS, finiscono in `/src/assets/articoli/[slug]/`
- Astro genera automaticamente versioni WebP, AVIF, multiple risoluzioni
- Lazy loading nativo, ottimizzazione automatica
- Costo: zero (incluso nel deploy Netlify)

Quando il volume di foto diventerà rilevante (50+ articoli, foto raw molto pesanti), valuteremo il passaggio a Cloudinary o Bunny.net senza dover migrare tutto manualmente.

**Nota per Samu**: ottimizza le foto prima di caricarle.
- Larghezza max 2400px (per la copertina) o 1800px (per foto inline)
- Esporta JPEG qualità 80-85, oppure WebP qualità 80
- Peso target: 200-500 KB per foto
- Astro ottimizzerà ulteriormente, ma partire pesante è uno spreco di banda

---

## 4. TASSONOMIA — GEOGRAFICA PURA

Niente tag tematici. La struttura di scoperta dei contenuti è 100% geografica.

### Due livelli di classificazione

**Continente** (campo dropdown obbligatorio, lista chiusa):
- Europa
- Asia
- Africa
- Americhe
- Oceania

**Paese** (campo testo libero, ma normalizzato):
- Es. "Islanda", "Grecia", "Namibia", "Kirghizistan", "Spagna"
- Astro genererà automaticamente una pagina archivio per ciascun paese che ha almeno un articolo
- Il sistema deduplica i paesi: se scrivi "Italia" in 10 articoli, esiste una sola pagina `/destinazioni/paese/italia`

### Filtri sull'archivio
- Pagina `/destinazioni`: mostra tutto, con dropdown per filtrare per continente
- Pagina `/destinazioni/continente/europa`: solo articoli del continente
- Pagina `/destinazioni/paese/islanda`: solo articoli sul paese
- Stesso schema per `/itinerari/...`

### Campo opzionale `region` (sotto-area)
Per articoli/itinerari che si concentrano su una sotto-area specifica:
- "Pirenei catalani" (Spagna)
- "Tian Shan" (Kirghizistan)
- "Lapponia" (Finlandia)

Non genera pagine archivio dedicate, è solo metadato editoriale che appare nella card e nell'header dell'articolo.

---

## 5. SCHEMA COLLECTION: DESTINAZIONI

### Frontmatter (campi del form Decap)

| Campo | Tipo | Required | Note |
|---|---|---|---|
| title | testo | sì | Titolo articolo (max 80 char consigliato) |
| subtitle | testo | no | Occhiello/sottotitolo (max 120 char) |
| slug | testo | sì | URL slug, autogenerato dal titolo, modificabile |
| country | testo | sì | "Spagna", "Kirghizistan" |
| continent | dropdown | sì | Europa / Asia / Africa / Americhe / Oceania |
| region | testo | no | Sotto-area: "Pirenei catalani", "Tian Shan" |
| coverImage | immagine | sì | Foto copertina, ratio 3:2 consigliato |
| coverImageAlt | testo | sì | Descrizione alt per accessibilità/SEO |
| excerpt | testo lungo | sì | 150-200 char, appare nelle card |
| publishDate | data | sì | Data pubblicazione |
| featured | toggle | no | Se ON: appare in posizione hero homepage |
| relatedItinerary | reference | no | Link a un itinerario correlato (se esiste) |
| seoMetaDescription | testo | no | Override SEO (default = excerpt) |
| interludeImage | immagine | no | Foto full-screen tra body e pull quote |
| interludeCaption | testo | no | Didascalia interludio |
| pullQuote | testo | no | Frase d'effetto in pull quote scura full-bleed |
| mapCenter | { lat, lng, zoom } | no | Centro mappa Leaflet a fondo articolo |
| mapMarkers | lista | no | Pin sulla mappa con etichetta |

### Body (editor a blocchi)

L'editor permette di alternare:
- **Paragrafo** (Markdown con grassetto/corsivo/link)
- **Intertitolo** H2 / H3
- **Foto inline** (immagine + didascalia + alt)
- **Citazione/Pull quote** (testo evidenziato in stile editoriale)
- **Doppia foto** (due foto affiancate, opzionali didascalie)
- **Galleria** (3-6 foto in griglia, opzionale)

Il tempo di lettura viene calcolato automaticamente dal contenuto.

---

## 6. SCHEMA COLLECTION: ITINERARI (stato attuale, post-Step B)

### Frontmatter

| Campo | Tipo | Required | Note |
|---|---|---|---|
| title | testo | sì | "Kirghizistan in autonomia · 14 giorni" |
| subtitle | testo | no | Sintesi 1 riga |
| slug | testo | sì | URL slug |
| country | testo | sì | |
| continent | dropdown | sì | |
| coverImage | immagine | sì | |
| coverImageAlt | testo | sì | |
| excerpt | testo lungo | sì | Per le card archivio |
| publishDate | data | sì | |
| featured | toggle | no | |
| **META RIGA** | | | (mostrate sotto il titolo) |
| duration | numero | sì | Giorni totali (es. 14) |
| budget | dropdown | sì | Economico / Medio / Alto |
| difficulty | dropdown | sì | Facile / Medio / Avventura |
| bestSeason | testo | sì | "Maggio-Settembre" |
| transport | testo | sì | "Auto a noleggio + bus locali" |
| price | numero | sì | Prezzo singolo in euro (libero per articolo, es. 9, 12, 19) |
| lemonSqueezyProductId | testo | no | ID prodotto Lemon Squeezy per sblocco |
| lemonSqueezyCheckoutUrl | testo | no | URL diretto checkout |
| **CONTENUTO** | | | |
| valeIlViaggio | testo lungo | no | LEGACY string. Se presente, renderizzato come paragrafo intro nel body. Mantenuto come fallback per i contenuti pre-Step B. |
| mainstreamCheck | testo lungo | no | LEGACY string. Se presente e `mainstream` non c'è, renderizzato come `.ms-intro`. |
| vale | object | no | Step B — struttura `{ intro?, dormire?: valeItem[], mangiare?: valeItem[], tappe?: valeItem[] }`. `valeItem = { name, badge enum('must'|'good'|'hidden'), location?, description, tip?, price? }`. Primo item per colonna libero, resto sotto paywall. |
| mainstream | object | no | Step B — `{ intro?, items: msItem[] }`. `msItem = { name, type?, rating 1-5, verdict, alternative?: {name, reason}, distance? }`. Primo item libero, resto sotto paywall. |
| gallery | lista | no | Step B — array di `{ image, caption?, wide?: boolean }`. Renderizzata sotto la mappa come grid 3 col × auto-rows 300px. |
| days | lista di blocchi | sì | Vedi sotto |
| mapCenter | { lat, lng, zoom } | no | Centro mappa Leaflet |
| mapMarkers | lista | no | Pin: `{ lat, lng, label, dayNumber? }`. `dayNumber` lega il pin al giorno per popup contestuale |
| **EXTRA** | | | |
| localContacts | lista | no | `{ name, role, contact, notes? }` (non ancora reso in pagina) |

### Schema "giorno" (item di `days`)

Ogni giorno è un blocco con:
- `dayNumber` (numero, es. 1, 2, 3)
- `title` (titolo del giorno, es. "Bishkek → Lago Issyk-Kul")
- `description` (testo lungo, paragrafo descrittivo)
- `isPremium` (toggle: sotto paywall sì/no)
- `kmTotali` (numero, opzionale)
- `dislivello` (testo, opzionale, es. "+800m / -300m")
- `dormire` (testo, opzionale, dove dormire)
- `mangiare` (testo, opzionale, dove mangiare)
- `gallery` (lista opzionale, Step B — `{ image, caption? }[]`): apre toggle "+ N foto" sotto i tags, espande grid 2 col 160px, click → lightbox

### Logica paywall sulla pagina (lato design, oggi 10 mag)
- Tutti i giorni con `isPremium: false` (i primi N) vengono renderizzati per intero, con tags (km, dislivello, dormire, mangiare).
- Tutti i giorni con `isPremium: true` (i restanti) vengono renderizzati DENTRO un container `.paywall-blur-content` con `filter: blur(4px)` e `opacity: 0.35`. Sopra c'è `.paywall-overlay` con gradient lineare-down trasparente → cream pieno, e in centro la box paywall con prezzo singolo + abbonamento.
- L'accesso reale è gated solo visivamente. La logica server-side arriva in S7.

### Modello prezzi (riepilogo)

| Prodotto | Prezzo | Cosa sblocca |
|---|---|---|
| Itinerario singolo | €9-19 (deciso per articolo) | Quel singolo itinerario, per sempre |
| Abbonamento mensile | €29/mese | Tutti gli itinerari finché abbonato + PDF offline |
| Abbonamento annuale | €149/anno | Stesso, sconto ~57% (5 mesi gratis rispetto al mensile) |

---

## 7. PAGINA ITINERARIO SINGOLO — NUOVO DESIGN (Step A, 10 mag)

File: `src/pages/itinerari/[slug].astro` (404 righe, commit `ddc2958`).

Layout completo, dall'alto verso il basso:

1. **Breadcrumb** — "Home → Itinerari → {country} · {continent}".
2. **Hero** (`.it-hero`, padding 52px 40px 0):
   - Badges in riga: `Premium` (dark), `{N} giorni` (beige), `Livello {difficulty}` (beige).
   - Titolo `<h1>` Cormorant 54px.
   - Sottotitolo Cormorant 21px italic (se presente).
   - **Meta-row** a 5 celle equipartite (`Giorni`, `Budget`, `Difficoltà`, `Periodo`, `Trasporto`), separate da border verticali, font Cormorant 24px sopra label uppercase 9px.
3. **Foto hero** (`.it-hero-img`, height 560px) full-width — `data.coverImage`.
4. **Body 2 colonne** (`.it-body`, grid 1fr 300px, gap 60px):
   - Colonna sinistra (`.it-text`):
     - `it-intro` con `data.valeIlViaggio` (paragrafo).
     - `.preview-badge` verde "Anteprima gratuita — giorno/i 1[–N]".
     - `.it-section-label` "Programma giornaliero".
     - `.it-days` con i `freeDays`: ogni `.it-day` ha num Cormorant 36px sinistro + titolo + description + tags (km/dislivello/dormire/mangiare).
     - `.paywall-wrap` con `premiumDays` blurrati + `.paywall-overlay` gradient + `.paywall-box` centrato (clessidra + titolo + 2 opzioni Solo questo €X / Tutto illimitato €29 + 2 bottoni Abbonati/Acquista + login).
   - Colonna destra sticky (`.it-sidebar`, top 76px):
     - `.price-box` bordo scuro: titolo "Sblocca l'itinerario", `€{price}` Cormorant 42px + period, separator "oppure", `€29/mese` riga, lista `.price-includes` con 5 voci puntate sage, bottoni "Acquista — €{price}" e "Abbonati e accedi a tutto", "Sei abbonato? Accedi".
     - `.info-box` bordo chiaro: Dettagli — Destinazione, Durata, Budget, Periodo, Difficoltà, Trasporto, Aggiornato.
5. **Mappa** (`.it-map`, condizionale a `hasMap = !!mapCenter && mapPoints.length > 0`):
   - Container `#it-map` height 480px.
   - JS inline init su `window.load` con CartoDB Light tiles.
   - Marker numerati custom (cerchio dark con bordo terra, font Cormorant 13px) per i giorni con coordinata corrispondente. Locked (giorni premium): beige opacity 0.6 con lucchetto.
   - Polyline tratteggiata grigia per intero percorso + polyline piena terra per soli giorni free.
   - Popup `.popup-day` (uppercase terra) + `.popup-title` Cormorant + `.popup-sub` muted, o `.popup-locked` italic.
6. **Strip consulenza** (`.consulenza-strip`, beige): "Vuoi un itinerario costruito su misura? Una consulenza con noi per il tuo viaggio specifico" + CTA "Scopri →" a `/consulenze`.

### Mappa marker JS — pattern
```js
const mapPoints = days.map((d) => {
  const m = (data.mapMarkers || []).find((mm) => mm.dayNumber === d.dayNumber);
  if (!m) return null;
  return { num: d.dayNumber, title: d.title, sub: ..., locked: !!d.isPremium, lat: m.lat, lng: m.lng };
}).filter(Boolean);
```

Per usare la mappa, in CMS occorre settare `mapCenter` + per ogni giorno aggiungere un marker in `mapMarkers` con `dayNumber` corrispondente.

### Responsive (max-width: 900px)
- Body diventa una colonna sola (no sidebar sticky).
- Meta-row si avvolge a 3 per riga.
- Titolo 38px.
- Foto hero 360px.
- Paywall options diventano colonna.
- Strip consulenza colonna.

---

## 8. STEP B — COMPLETATO (11 mag)

Le 3 sezioni del template HTML reference (`~/Downloads/Nuova cartella con elementi/unmarked-itinerario_7.html`) sono state implementate. Commit `87d33b7` + `428b29d` + `fadaa13`, tutti deployati ✓.

### 8.1 "Vale il viaggio" strutturato — fatto

Struttura a 3 colonne **Dormire / Mangiare / Non perdere**, ogni colonna è una lista di item `{name, badge, location?, description, tip?, price?}`. Solo il primo item per colonna è libero, gli altri sono dentro `.vale-paywall-wrap` con blur+overlay+box "Altri consigli riservati agli abbonati".

Schema Zod (in `src/content/config.ts`):
```ts
const valeItem = z.object({
  name: z.string(),
  badge: z.enum(['must', 'good', 'hidden']).default('must'),
  location: z.string().optional(),
  description: z.string(),
  tip: z.string().optional(),
  price: z.string().optional(),
});
vale: z.object({
  intro: z.string().optional(),
  dormire: z.array(valeItem).optional(),
  mangiare: z.array(valeItem).optional(),
  tappe: z.array(valeItem).optional(),
}).optional()
```

CSS: classi `.vale, .vale-head, .vale-grid (3col), .vale-col-label, .vale-item, .vale-item-header, .vale-item-name, .vale-item-badge.badge-must/good/hidden, .vale-item-loc, .vale-item-desc, .vale-item-tip, .vale-item-price`. Paywall: `.vale-paywall-wrap, .vale-blur, .vale-overlay, .vale-pw-box, .vale-pw-title, .vale-pw-sub, .vale-pw-btn-sub, .vale-pw-btn-single, .vale-pw-login`.

Decap CMS: object collapsed `vale` con sotto-fields `intro` + 3 list `dormire/mangiare/tappe`. Badge è un select con 3 opzioni `{label, value}`. Il campo legacy `valeIlViaggio` (string) rimane in CMS come "intro libero (legacy)" — se presente, viene renderizzato come `.it-intro` paragraph nel body.

### 8.2 "Mainstream check" strutturato con stelle — fatto

Lista `.ms-item` con grid `1fr auto`. Stelle: 5 span `★`, le prime `rating` hanno classe `.ms-star-filled` (color terra), le altre `.ms-star` (color light-border). Numero `{rating}/5` accanto.

Schema Zod:
```ts
const msItem = z.object({
  name: z.string(),
  type: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  verdict: z.string(),
  alternative: z.object({ name: z.string(), reason: z.string() }).optional(),
  distance: z.string().optional(),
});
mainstream: z.object({
  intro: z.string().optional(),
  items: z.array(msItem),
}).optional()
```

Primo item libero, resto sotto `ms-paywall-wrap` (riusa `.vale-overlay` + `.vale-pw-box` con copy "Altri mainstream check riservati agli abbonati"). Se `mainstream` non c'è ma `mainstreamCheck` (legacy string) sì, è renderizzato come `.ms-intro`.

CSS aggiuntivo: `.ms, .ms-head, .ms-title, .ms-sub, .ms-intro, .ms-list, .ms-item, .ms-item-grid, .ms-item-info, .ms-item-head, .ms-item-name, .ms-item-type, .ms-item-rating, .ms-star, .ms-star-filled, .ms-rating-num, .ms-item-verdict, .ms-item-alt, .ms-item-alt-label, .ms-item-alt-name, .ms-item-alt-reason, .ms-item-distance, .ms-paywall-wrap, .ms-blur`.

### 8.3 Gallerie foto — fatto

- **Galleria itinerario** (`.it-gallery` sotto la mappa): grid 3 col × auto-rows 300px (`grid-auto-rows: 300px`). Item con `wide: true` fa `grid-column: span 2`. Schema: `gallery: z.array(z.object({ image: image(), caption?: z.string(), wide: z.boolean().default(false) })).optional()`.
- **Galleria per giorno** (`.day-gallery`): toggle inline-flex sotto i tags. Icon "+" rotata di +45° quando `.open`. Espansione `grid` 2 col 160px con `animation: fadeInGallery 0.25s ease`. Schema dentro `day`: `gallery: z.array(z.object({ image: image(), caption?: z.string() })).optional()`.

### 8.4 Lightbox — fatto

JS vanilla in fondo a `[slug].astro`. Click su `.day-gallery-img` o `.gal-item` → leggi `src` di `<img>` + `data-caption`, popola `#lb-img` + `#lb-caption`, aggiunge `.open` a `.lightbox`. Click su lightbox stesso o `#lb-close` o `Escape` → rimuove `.open`. `.lightbox` è `position: fixed; inset: 0; z-index: 9999; background: rgba(26,24,20,0.92)`.

### 8.5 Note di implementazione

- I campi nuovi sono tutti OPZIONALI, quindi non rompono i contenuti pre-Step B. `isalnda.md` (l'unico itinerario di test) non è stato migrato — il build resta verde.
- Su `/admin` Decap mostra 3 nuove sezioni collapsed sotto "Itinerari": "Vale il viaggio (strutturato)", "Mainstream check (strutturato)", "Galleria itinerario". Dentro ogni giorno c'è una list "Galleria del giorno".
- Per popolare i dati: aprire un itinerario sul CMS → espandere le nuove sezioni → aggiungere item. La pagina live mostrerà automaticamente le sezioni.
- Verificato live su `https://unmarked-staging.netlify.app/itinerari/isalnda`: paywall + giorni + sezione mainstream con intro legacy fallback funziona; vale e gallery nascoste (campi vuoti); 0 errori, build deploy in ~14s.

---

## 9. SCHEMA DATABASE (Supabase, per S7)

Tre tabelle principali:

### `users` (gestita da Netlify Identity)
- `id`, `email`, `created_at`, `metadata`

### `purchases`
| Campo | Tipo | Note |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK users |
| itinerary_slug | text | Riferimento all'itinerario |
| lemon_squeezy_order_id | text | Per tracciare il pagamento |
| amount_eur | numeric | Es. 12.00 |
| purchased_at | timestamp | |

### `subscriptions`
| Campo | Tipo | Note |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK users |
| plan | text | 'monthly' / 'yearly' |
| status | text | 'active' / 'past_due' / 'canceled' |
| current_period_start | timestamp | |
| current_period_end | timestamp | |
| lemon_squeezy_subscription_id | text | |

**Logica accesso a un itinerario**: `accessGranted = subscriptionActive(userId) OR purchaseExists(userId, itinerarySlug)`

---

## 10. ROADMAP (sessioni di lavoro)

| Sessione | Cosa facciamo | Stato |
|---|---|---|
| **1** | Schema architettura completo | ✓ |
| **2** | Scaffolding Astro + design portato + primo deploy | ✓ |
| **3** | Schema collections + Decap CMS files + Identity attivata | ✓ |
| **4** | Pagine dinamiche destinazioni + filtri + home dinamica | ✓ |
| **5** | Itinerari + paywall preview | ✓ (in standby fino a S7) |
| **6** | Film + Podcast + redesign /film + "In cantiere" | ✓ |
| **6.5** | Wave grafica destinazioni 3-4 mag | ✓ |
| **6.6** | Wave UI 10 mag + Step A itinerario singolo | ✓ |
| **6.7** | Step B itinerario singolo (CMS + render) | ✓ (11 mag) |
| **7** | Lemon Squeezy + Supabase + webhook + PDF + cutover unmarked.it | ← prossima sessione (prima del lancio) |

---

## 11. WORKFLOW OPERATIVO

1. **Pubblicare contenuti**: via CMS `/admin` (login Identity → New nella collezione → form → Publish). Decap committa su GitHub, Netlify rebuilda in ~30s.
2. **Modificare codice/grafica**: io edito via GitHub web edit (CodeMirror) tramite Claude in Chrome. Scrivo file → commit → Netlify rebuilda.
3. **Caricare immagini hero/static**: GitHub web → cartella `public/` → Add file → Upload files → commit.
4. **Backup locale**: Mac di Samu ha `~/Documents/Unmarked/unmarked/` e `~/Desktop/unmarked/` con snapshot iniziali, NON sincronizzati con GitHub. Solo emergency backup. La documentazione (`unmarked-architettura.md`, `unmarked-manuale-uso.md`) vive in `~/Desktop/unmarked/`.

### Note pratiche per Claude (se la chat si compatta o ricomincia)
- Il tool GitHub web edit lavora con CodeMirror v6. I find/replace funzionano per stringhe single-line. Per riscrivere file lunghi: il pattern collaudato è codificare in base64, splittare in chunk da ~7KB, iniettarli via `javascript_tool` in `window.__b64`, decodificare con `atob`, poi `document.execCommand('insertText', false, decoded)` sul `.cm-content` con focus. Documentato nei commit del 10 mag.
- Quando il GitHub editor mostra "Restore?" dopo refresh, NON dimenticarsi di cliccare Restore se le modifiche sono ancora utili.
- Il computer use classico è disabilitato in questa app, ma `mcp__Claude_in_Chrome__*` funziona via estensione Chrome. Browser_batch è preferito a chiamate singole.

---

## 12. CHECKLIST DA PREPARARE PER S7

Cose da fare con calma prima della sessione 7:

### Account
- [x] **GitHub** — fatto
- [ ] **Supabase** — account gratuito su supabase.com (lo configureremo insieme nella sessione 7, puoi crearlo ora con calma)
- [ ] **Lemon Squeezy** — account su lemonsqueezy.com, configureremo i prodotti in S7

Account già pronti:
- [x] Netlify (piano Personal $9/mese attivo)
- [x] Netlify Identity attivata
- [x] Git Gateway attivo

### Dominio finale
- [ ] **Comprare/configurare unmarked.it** (probabilmente già di Samu) → in S7 si punta a Netlify
- [ ] Decidere se mantenere staging su un sub (`staging.unmarked.it`) o tenerlo solo su `unmarked-staging.netlify.app`

---

## 13. NOTE APERTE

- Tutti i contenuti placeholder esistenti (test-islanda, isalnda, etc.) verranno sostituiti dai contenuti veri quando Samu inizierà a popolare il CMS. `isalnda.md` ha solo i campi pre-Step B compilati (vale stringa, mainstream stringa, nessuna galleria, nessun mapMarker). Quando Samu vorrà testare il nuovo design, basterà compilare via `/admin` i campi strutturati nuovi.
- Per la pagina `/itinerari` (archivio), `HERO_VIDEO_ID` è una costante vuota in cima al file. Quando Samu fornisce un ID YouTube reale, basta editare quella stringa e committare per attivare il video hero. Finché è vuoto, fallback su `/hero.jpg`.
- "Islanda inverno" appare due volte nella home destinazioni perché ci sono due articoli con stesso titolo ma slug diversi. Da deduplicare se serve (o cancellare uno dal CMS).
- Sezione Shop nella home è ancora hardcoded con 4 prodotti placeholder. Verrà sostituita quando ci sarà una vera collection shop.
- `unmarked-manuale-uso.md` è il companion documentale: contiene la guida operativa quotidiana (pubblicare un articolo, caricare foto, risolvere problemi comuni). Anch'esso aggiornato al 10 mag con il nuovo URL.

---

*Fine documento v6. La fonte di verità sui dettagli del codice è il repo GitHub.*

---

# APPENDICE — Stato del codice (aggiornato v6, 11 mag 2026)

## Mappa del repository

```
unmarked/
├── astro.config.mjs        # config Astro + i18n (it default, en predisposto, prefixDefaultLocale: false)
├── package.json            # dipendenze: astro 4.16
├── public/
│   ├── hero.jpg                       # foto hero homepage (felce) — fallback per /itinerari hero
│   ├── film-hero.jpg                  # foto hero archivio /film
│   ├── film-pipeline-pre.jpg          # box "In cantiere" pre-produzione
│   ├── film-pipeline-prod.jpg         # box "In cantiere" produzione
│   ├── film-pipeline-soon.jpg         # box "In cantiere" presto in arrivo
│   ├── favicon.svg
│   └── admin/
│       ├── index.html                 # entry Decap CMS (carica netlify-identity-widget + decap-cms)
│       └── config.yml                 # form Decap per le 4 collection (destinazioni, itinerari, film, podcast)
├── src/
│   ├── content/
│   │   ├── config.ts                  # schema Zod delle 4 collection (memoria del modello dati)
│   │   ├── destinazioni/              # *.md (uno per articolo, generati dal CMS)
│   │   ├── itinerari/                 # *.md
│   │   ├── film/                      # *.md
│   │   └── podcast/                   # *.md
│   ├── assets/articoli/               # foto caricate via CMS (da Decap, path relativo nel md)
│   ├── layouts/
│   │   └── BaseLayout.astro           # head (+ <slot name="head" /> per CSS Leaflet) + Navbar + slot + Footer + Netlify Identity widget
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro                 # hero homepage manifesto (no CTA)
│   │   ├── Newsletter.astro
│   │   ├── DestinazioneCard.astro
│   │   ├── ItinerarioCard.astro       # variant 'full' (archivio) | 'mini' (home itinerari-block)
│   │   ├── FilmCard.astro             # variant 'main' | 'episode' | 'grid'
│   │   └── PodcastCard.astro          # variant 'full' | 'mini'
│   ├── pages/
│   │   ├── index.astro                # homepage. Sezione "Ultime destinazioni": featured + 3 side card (no data, con sottotitolo, altezza match)
│   │   ├── destinazioni/
│   │   │   ├── index.astro            # archivio + filtri continente/paese
│   │   │   ├── [slug].astro           # articolo: hero parallax + body editoriale (drop cap, foto full-bleed) + interlude (padding: 0) + pull quote + mappa Leaflet (caricata via slot head + load event) + CTA itinerario correlato + reportage correlati
│   │   │   ├── paese/[paese].astro
│   │   │   └── continente/[continente].astro
│   │   ├── itinerari/
│   │   │   ├── index.astro            # archivio + hero video YouTube (HERO_VIDEO_ID, bordi stondati 24px, fallback /hero.jpg) + filtri + grid
│   │   │   ├── [slug].astro           # Step A (10 mag) + Step B (11 mag): breadcrumb + hero badges + meta-row 5 celle + foto hero + body 2 colonne (free days c/ gallery toggle + paywall blur premium days + sidebar price-box + info-box) + sezione Vale 3 col con paywall + sezione Mainstream check con stelle e alternativa + paywall + mappa Leaflet marker custom + Galleria itinerario 3 col + strip consulenza + lightbox
│   │   │   ├── paese/[paese].astro
│   │   │   └── continente/[continente].astro
│   │   ├── film/
│   │   │   ├── index.astro            # hero claim + stack film 21:9 + "In cantiere" 3 box
│   │   │   └── [slug].astro           # hero + YouTube embed + body + video consigliati 3x1
│   │   └── podcast/
│   │       ├── index.astro            # hero + lista episodi
│   │       └── [slug].astro           # hero scuro + Spotify embed + show notes
│   └── styles/
│       └── global.css                 # design system completo (CSS vars cream/beige/sand/terra/sage/dark/muted + nav + sezioni + grids + utility) + override side-list home + overflow-x: clip su html+body + max-width: 100vw
```

## Schema content collections (memoria del modello dati — `src/content/config.ts`)

**destinazioni** — campi: `title, subtitle?, country, continent (enum 5), region?, coverImage, coverImageAlt, excerpt, publishDate, featured, seoMetaDescription?, interludeImage?, interludeCaption?, pullQuote?, mapCenter?{lat,lng,zoom}, mapMarkers[]{lat,lng,label}, relatedItinerary?(slug)`

**itinerari** (stato attuale, post-Step B) — campi: `title, subtitle?, country, continent, coverImage, coverImageAlt, excerpt, publishDate, featured, duration, budget(enum 3), difficulty(enum 3), bestSeason, transport, price, lemonSqueezyProductId?, lemonSqueezyCheckoutUrl?, valeIlViaggio?(legacy string), mainstreamCheck?(legacy string), vale?{intro?, dormire?[valeItem], mangiare?[valeItem], tappe?[valeItem]}, mainstream?{intro?, items[msItem]}, gallery?[{image, caption?, wide}], days[]{dayNumber, title, description, kmTotali?, dislivello?, dormire?, mangiare?, isPremium, gallery?[{image, caption?}]}, mapCenter?, mapMarkers[]{lat,lng,label,dayNumber?}, localContacts[]{name,role,contact,notes?}`. `valeItem = {name, badge enum('must'|'good'|'hidden'), location?, description, tip?, price?}`. `msItem = {name, type?, rating 1-5, verdict, alternative?{name, reason}, distance?}`.

**film** — campi: `title, subtitle?, country, continent, coverImage, coverImageAlt, excerpt, publishDate, featured, youtubeId, duration, type(enum 5: Documentario/Cortometraggio/Reportage/Essay/Trailer)`

**podcast** — campi: `title, subtitle?, coverImage?, coverImageAlt?, excerpt, publishDate, featured, spotifyEpisodeId, episodeNumber, duration, topic(enum 5), guests?`

## Decisioni di design consolidate

- **Voce**: unica "Unmarked", nessuna firma autore.
- **Tassonomia**: solo geografica (paese + continente). NO tag tematici.
- **Hero homepage**: manifesto puro, NESSUN CTA.
- **Home destinazioni**: featured grande sx + 3 side card sx-foto/dx-testo a destra. Stessa altezza (380px). Sottotitolo presente, niente data.
- **Pagina destinazione singola**: hero parallax 80vh, body Cormorant 20px con drop cap terra, foto inline full-bleed, interlude full-screen 90vh (con `padding: 0`), pull quote scura full-bleed, mappa Leaflet (caricata via slot head + load event), CTA itinerario correlato beige.
- **Pagina /itinerari archivio**: hero con video YouTube + bordi stondati 24px, sotto header dell'archivio + filtri continente/paese + grid.
- **Pagina /itinerari/[slug]**: vedi sezione 7 dettagliata. Step B (11 mag) ha aggiunto sezioni **Vale il viaggio** (3 col + paywall), **Mainstream check** (lista con stelle 1-5 + alternativa + paywall), **Galleria itinerario** (3 col × auto-rows, primo `wide` opz.), **Galleria per giorno** (toggle "+ N foto" + grid 2 col 160px) e **Lightbox** vanilla. Tutti campi opzionali, badge classi `.badge-must/.badge-good/.badge-hidden`.
- **Pagina film singola**: hero + YouTube embed nocookie 16:9 + body + sezione "Video consigliati" 3x1.
- **Pagina /film archivio**: hero claim "Le storie che dovevano restare in movimento" + stack film 21:9 + sezione "In cantiere" 3 colonne.
- **Homepage sezione film**: solo featured a tutta larghezza 21:9.
- **Layout**: padding sezioni 60px 40px, container max 1280px, grid 3 colonne desktop, 2 tablet, 1 mobile.
- **Paywall**: blur+overlay+box (Step A). Logica server-side da implementare in S7.

## Sessione 7 (da fare prima del lancio)

1. **Setup Lemon Squeezy**: creare prodotti per ogni itinerario singolo + 2 abbonamenti (€29/mese, €149/anno). Copiare i `productId` e gli `checkoutUrl` nei campi corrispondenti del CMS.
2. **Setup Supabase**: creare progetto, schema 3 tabelle (users, purchases, subscriptions). Generare API key.
3. **Webhook Lemon Squeezy → Netlify Function**: endpoint `/api/lemon-squeezy-webhook` che riceve `order_created` e `subscription_*` e scrive su Supabase.
4. **Logica accesso premium**: nelle pagine `/itinerari/[slug]`, leggere user da Netlify Identity, query Supabase, mostrare giorni premium solo se autorizzato (rimuovere blur).
5. **PDF generation**: server-side route con verifica accesso, genera PDF (puppeteer su Netlify Function o servizio esterno).
6. **Cutover dominio**: comprare/configurare `unmarked.it`, puntarlo al progetto Netlify, attivare HTTPS automatico Let's Encrypt.

*Fine documento v6. La fonte di verità sui dettagli del codice è il repo GitHub.*
