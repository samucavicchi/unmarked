// scripts/sync-product-images.mjs
//
// Legge le immagini da public/shop/[product-id]/ e aggiorna i prodotti su Stripe.
//
// Utilizzo:
//   npm run sync-images
//
// Richiede in .env:
//   STRIPE_SECRET_KEY=sk_live_xxx   (o sk_test_xxx per sandbox)
//   SITE_URL=https://tuosito.it     (URL di produzione dove le immagini sono pubbliche)

import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configurazione ──────────────────────────────────────────────────────────

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const SITE_URL   = (process.env.SITE_URL || '').replace(/\/$/, ''); // es. https://unmarked.it

if (!STRIPE_KEY) {
  console.error('❌  STRIPE_SECRET_KEY non trovata. Aggiungila a .env');
  process.exit(1);
}
if (!SITE_URL) {
  console.error('❌  SITE_URL non trovata. Aggiungila a .env  (es. SITE_URL=https://unmarked.netlify.app)');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2024-11-20.acacia' });
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// ─── Legge shop-data.ts per ottenere la mappa id → stripeProductId ───────────

const shopDataPath = path.join(__dirname, '../src/data/shop-data.ts');
const shopDataSrc  = fs.readFileSync(shopDataPath, 'utf8');

// Estrae coppie { id, stripeProductId } con regex semplice
const productMap = [];
const blocks = shopDataSrc.split(/\{(?=[^{}]*id:\s*')/);
for (const block of blocks) {
  const idMatch  = block.match(/id:\s*'([^']+)'/);
  const pidMatch = block.match(/stripeProductId:\s*'([^']+)'/);
  if (idMatch && pidMatch) {
    productMap.push({ id: idMatch[1], stripeProductId: pidMatch[1] });
  }
}

if (productMap.length === 0) {
  console.error('❌  Nessun prodotto trovato in shop-data.ts');
  process.exit(1);
}

console.log(`\n🔍  Trovati ${productMap.length} prodotti in shop-data.ts\n`);

// ─── Sincronizza ─────────────────────────────────────────────────────────────

const shopPublicDir = path.join(__dirname, '../public/shop');

for (const { id, stripeProductId } of productMap) {
  // Salta i placeholder
  if (stripeProductId.startsWith('prod_xxx')) {
    console.log(`⚠️   ${id}: stripeProductId è ancora un placeholder — aggiungi il prod_xxx reale in shop-data.ts`);
    continue;
  }

  const productDir = path.join(shopPublicDir, id);

  if (!fs.existsSync(productDir)) {
    console.log(`⚠️   ${id}: cartella non trovata → crea public/shop/${id}/ e metti le immagini dentro`);
    continue;
  }

  const files = fs.readdirSync(productDir)
    .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .sort(); // ordine alfabetico → rinomina 1.jpg, 2.jpg, 3.jpg per controllare l'ordine

  if (files.length === 0) {
    console.log(`⚠️   ${id}: nessuna immagine in public/shop/${id}/`);
    continue;
  }

  const imageUrls = files
    .slice(0, 8) // Stripe max 8
    .map(f => `${SITE_URL}/shop/${id}/${f}`);

  try {
    await stripe.products.update(stripeProductId, { images: imageUrls });
    console.log(`✅  ${id}: ${files.length} immagini aggiornate`);
    imageUrls.forEach(u => console.log(`    ${u}`));
  } catch (err) {
    console.error(`❌  ${id}: errore Stripe — ${err.message}`);
  }
}

console.log('\n✔   Sincronizzazione completata\n');
