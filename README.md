# Unmarked

Sito editoriale di Unmarked — luoghi che non trovi sulle guide.
Reportage fotografici, itinerari premium, podcast, film.

Costruito con [Astro](https://astro.build) e ospitato su [Netlify](https://netlify.com).

---

## Avvio in locale

Prerequisiti: Node.js 20+ installato (https://nodejs.org).

```bash
# Installa le dipendenze (la prima volta)
npm install

# Avvia il server di sviluppo su http://localhost:4321
npm run dev

# Genera la build di produzione nella cartella dist/
npm run build

# Preview della build di produzione
npm run preview
```

---

## Struttura del progetto

```
unmarked/
├── public/                 # File statici (favicon, hero.jpg, etc)
├── src/
│   ├── components/         # Componenti riusabili (Navbar, Footer, etc)
│   ├── content/            # Contenuti gestiti dal CMS
│   │   ├── destinazioni/   # Reportage editoriali
│   │   └── itinerari/      # Itinerari premium con paywall
│   ├── layouts/            # Layout pagine
│   ├── pages/              # Pagine del sito (file = route URL)
│   └── styles/             # CSS globali (design system)
├── astro.config.mjs        # Configurazione Astro
└── package.json
```

---

## Decisioni di progetto

Vedi `unmarked-architettura.md` per il documento di architettura completo.
In sintesi:

- **Voce editoriale unica** "Unmarked" — niente firme autore
- **Tassonomia geografica pura** — paese + continente, niente tag tematici
- **i18n predisposto** — italiano attivo, struttura pronta per inglese
- **Itinerari premium** — sito con login + PDF offline
- **Modello vendita** — singolo itinerario + abbonamento €29/mese o €149/anno

---

## Deploy

Push su `main` di GitHub → Netlify rebuilda e deploya automaticamente.

Build command: `npm run build`
Publish directory: `dist`

---

## Roadmap (vedi documento architettura)

- [x] Sessione 1 — Architettura definita
- [ ] Sessione 2 — Scaffolding + design portato + primo deploy ← **siamo qui**
- [ ] Sessione 3 — Decap CMS + collection Destinazioni
- [ ] Sessione 4 — Collection Itinerari + mappe
- [ ] Sessione 5 — Auth + Supabase + paywall
- [ ] Sessione 6 — Lemon Squeezy + abbonamento + PDF
- [ ] Sessione 7 — Cutover dominio unmarked.it
