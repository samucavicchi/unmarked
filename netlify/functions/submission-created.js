// Netlify trigger automatico su ogni submission di un Form Netlify
// Viene eseguita ogni volta che qualcuno invia un form sul sito.
// Gestisce solo il form "northern-line-premier".

exports.handler = async (event) => {
  try {
    const payload = JSON.parse(event.body).payload;

    // Ignora tutti gli altri form
    if (payload.form_name !== 'northern-line-premier') {
      return { statusCode: 200, body: 'ignored' };
    }

    const { nome, cognome, email, partecipanti } = payload.data;
    const nomeCompleto = `${nome} ${cognome}`;
    const posti = partecipanti === '1' ? '1 persona' : `${partecipanti} persone`;

    const htmlEmail = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0E0C0A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0C0A;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- LOGO -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <span style="font-family:Georgia,serif;font-size:20px;font-weight:400;letter-spacing:0.15em;text-transform:uppercase;color:#FAFAF8;">
                UNMARKED<span style="color:#C4855A;">.</span>
              </span>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#161310;border:1px solid rgba(201,185,154,0.12);padding:48px 40px;">

              <p style="font-size:9px;font-weight:500;letter-spacing:0.28em;text-transform:uppercase;color:#C4855A;margin:0 0 20px;">
                Première · 17 Dicembre 2026
              </p>

              <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;font-style:italic;color:#FAFAF8;margin:0 0 24px;line-height:1.2;">
                Il tuo posto è riservato.
              </h1>

              <p style="font-size:14px;font-weight:300;color:rgba(250,250,248,0.6);line-height:1.8;margin:0 0 32px;">
                Ciao ${nome},<br/><br/>
                abbiamo registrato la tua adesione alla première di <em>Northern Line</em>.<br/>
                Ti aspettiamo il <strong style="color:rgba(250,250,248,0.85);font-weight:400;">17 dicembre 2026 alle 20:00</strong>.
              </p>

              <!-- DETTAGLI -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(201,185,154,0.15);border-bottom:1px solid rgba(201,185,154,0.15);margin-bottom:32px;">
                <tr>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(201,185,154,0.1);">
                    <span style="font-size:8px;font-weight:500;letter-spacing:0.24em;text-transform:uppercase;color:#C4855A;display:block;margin-bottom:5px;">Luogo</span>
                    <span style="font-size:14px;font-weight:300;color:#FAFAF8;">Sala Martinovich · Bassano del Grappa</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(201,185,154,0.1);">
                    <span style="font-size:8px;font-weight:500;letter-spacing:0.24em;text-transform:uppercase;color:#C4855A;display:block;margin-bottom:5px;">Orario</span>
                    <span style="font-size:14px;font-weight:300;color:#FAFAF8;">Ore 20:00</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 0;">
                    <span style="font-size:8px;font-weight:500;letter-spacing:0.24em;text-transform:uppercase;color:#C4855A;display:block;margin-bottom:5px;">Partecipanti</span>
                    <span style="font-size:14px;font-weight:300;color:#FAFAF8;">${posti}</span>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;font-weight:300;color:rgba(250,250,248,0.4);line-height:1.75;margin:0;">
                L'ingresso è libero. In caso di variazioni ti contatteremo a questo indirizzo email.<br/><br/>
                A presto,<br/>
                <span style="color:rgba(250,250,248,0.6);">Samuele &amp; Alice · Unmarked</span>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:28px 40px;text-align:center;">
              <p style="font-size:10px;font-weight:300;color:rgba(250,250,248,0.18);letter-spacing:0.05em;margin:0;">
                unmarked.it &nbsp;·&nbsp; hello@unmarked.it
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Unmarked', email: 'hello@unmarked.it' },
        to: [{ email, name: nomeCompleto }],
        subject: 'Posto confermato — Northern Line, 17 dicembre',
        htmlContent: htmlEmail,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo error:', err);
      return { statusCode: 500, body: 'Email error' };
    }

    return { statusCode: 200, body: 'ok' };

  } catch (err) {
    console.error('submission-created error:', err);
    return { statusCode: 500, body: 'Server error' };
  }
};
