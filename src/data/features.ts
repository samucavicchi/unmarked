// src/data/features.ts
// Interruttori per mostrare/nascondere intere sezioni del sito.
// Per riattivare una sezione: metti `true` qui E togli il redirect corrispondente in netlify.toml.
//
// Con `false` la sezione sparisce da: navbar, footer, homepage, mappa, ricerca, CTA nelle pagine
// Libreria, chi siamo, account, Pro e login/registrazione. Le pagine restano nel codice ma i loro URL
// vengono rediretti alla home da netlify.toml.

export const features = {
  itinerari: false,   // sezione Itinerari (archivi, pagine, acquisto singolo)
  consulenze: false,  // pagina Consulenze
  pro: false,         // abbonamento Unmarked Pro: /pro, checkout abbonamento, Spotsbook completo.
                      //   Con false lo Spotsbook mostra solo il teaser "in arrivo" + newsletter.
  account: false,     // login Clerk: "Accedi"/account in navbar, /sign-in, /sign-up, /account
};
