// netlify/functions/secret-subscribe.js
//
// Aggiunge l'email a Brevo (lista 6) e manda una mail di risposta con la location segreta.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  const { email } = JSON.parse(event.body || '{}');

  if (!email || !email.includes('@')) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Email non valida' }),
    };
  }

  const API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'adventures@unmarked.it';
  const SENDER_NAME  = 'Unmarked';

  try {
    // 1. Aggiungi contatto a Brevo lista 6
    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [6],
        updateEnabled: true,
      }),
    });

    if (contactRes.status !== 201 && contactRes.status !== 204) {
      const data = await contactRes.json();
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: data.message || 'Errore Brevo (contatto)' }),
      };
    }

    // 2. Manda la mail di risposta con la location segreta
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email }],
        subject: 'La tua location segreta — Unmarked',
        htmlContent: `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>La tua location segreta</title>
</head>
<body style="margin:0;padding:0;background:#1A1814;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1A1814;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:48px;border-bottom:1px solid rgba(201,185,154,0.15);">
              <p style="margin:0;font-size:10px;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:#C9B99A;font-family:Arial,sans-serif;">
                UNMARKED
              </p>
            </td>
          </tr>

          <!-- Titolo -->
          <tr>
            <td style="padding:48px 0 32px;">
              <p style="margin:0 0 12px;font-size:10px;font-weight:500;letter-spacing:0.25em;text-transform:uppercase;color:#C9B99A;font-family:Arial,sans-serif;">
                Location segreta · Dolomiti
              </p>
              <h1 style="margin:0;font-size:40px;font-weight:300;color:#FAFAF8;line-height:1.1;letter-spacing:-0.01em;">
                Una cascata nascosta<br>nelle Dolomiti.
              </h1>
            </td>
          </tr>

          <!-- Descrizione -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0 0 20px;font-size:15px;font-weight:300;color:rgba(250,250,248,0.75);line-height:1.85;">
                C'è un angolo di Dolomiti che ti porta in Islanda. Una cascata di colonne basaltiche dove salta acqua cristallina. Un sentiero nel bosco ti porta in 10 minuti in questo paradiso.
              </p>
            </td>
          </tr>

          <!-- Come arrivare -->
          <tr>
            <td style="padding:28px;background:rgba(201,185,154,0.06);border-left:2px solid #C9B99A;margin-bottom:32px;display:block;">
              <p style="margin:0 0 10px;font-size:9px;font-weight:500;letter-spacing:0.25em;text-transform:uppercase;color:#C9B99A;font-family:Arial,sans-serif;">
                Come arrivare
              </p>
              <p style="margin:0;font-size:14px;font-weight:300;color:rgba(250,250,248,0.7);line-height:1.9;">
                Lascia l'auto nel parcheggio sterrato lungo la strada asfaltata e prendi la strada sterrata in discesa. Arrivati al ponte di legno, superarlo e sulla destra parte il sentiero che entra nel bosco.
              </p>
            </td>
          </tr>

          <!-- CTA Maps -->
          <tr>
            <td style="padding:32px 0 48px;text-align:center;">
              <a href="https://maps.app.goo.gl/oYZ2UQQ48x2LSCAG7"
                 style="display:inline-block;padding:16px 40px;background:#C9B99A;color:#1A1814;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;font-family:Arial,sans-serif;">
                Apri su Google Maps →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid rgba(201,185,154,0.12);padding-top:36px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:300;color:rgba(250,250,248,0.35);line-height:1.7;font-family:Arial,sans-serif;">
                Tienila per te — o condividila solo con chi se lo merita.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      }),
    });

    if (!emailRes.ok) {
      const data = await emailRes.json();
      // Il contatto è stato salvato, ma la mail non è partita — logghiamo ma non blocchiamo
      console.error('Errore invio email:', data.message);
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Errore server' }),
    };
  }
};
