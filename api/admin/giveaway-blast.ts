import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// All signup contacts
const SIGNUP_EMAILS = [
  // VIRENZA12 list
  'jordanhaworth1996@gmail.com',
  'alfienewburyy@gmail.com',
  'clarkejohn104@gmail.com',
  'deanheenan114@gmail.com',
  'dexion13115@gmail.com',
  'jack.chapman@icloud.com',
  'jaydenpettett@gmail.com',
  'joelpicket10@gmail.com',
  'kiaendjk@hotmail.com',
  'mark.starlin37@outlook.com',
  'paulburchett1974@gmail.com',
  'rowlinsonpeter02@gmail.com',
  'seanjk2010@live.co.uk',
  // VIRENZA10 list
  'hdhesi4@gmail.com',
  'janrajsandhu157@outlook.com',
  'stevenbell1975@outlook.com',
  'aliwilde152@gmail.com',
  'gareth.strydom@yahoo.com',
  'bobward9@hotmail.com',
  'ethanhopkins09@icloud.com',
  'grethaireddad@gmail.com',
  'Mxmeredith93@hotmail.com',
  'michaelelliott557@googlemail.com',
  'Stephen.hannington16@gmail.com',
];

// Stripe customer emails
const ORDER_EMAILS = [
  'deanwedge1984@gmail.com',
  'paulwoodward4@icloud.com',
  'adambarnaby7@icloud.com',
  'tom.ashworth.14@hotmail.com',
  'jaydenpettettis@gmail.com',
  'dylanninja10@outlook.com',
  'harrym16@icloud.com',
  'emma@wearekk.com',
  'ellischiverton@yahoo.com',
  'joelpickett10@icloud.com',
  'michaelmimms123@live.co.uk',
  'paulnmorris0@gmail.com',
  'craigcarter75@gmail.com',
  'envi-green@mail.com',
  'gabrieltmcmahon@gmail.com',
  'joshparker41@btinternet.com',
  'jacobsimpson0600@gmail.com',
  'tattooedbear07@gmail.com',
  'newstreetjoinery@outlook.com',
  'zootbarr@yahoo.com',
  'sal.huss@hotmail.co.uk',
  'richardcommons21@gmail.com',
  'j.luc@hotmail.co.uk',
  'georgenevsharris@gmail.com',
  'tomlong983@gmail.com',
  'charliegriffiths428@gmail.com',
  'boothby81@hotmail.com',
  'jocaesar1980@gmail.com',
  'stevekimber21281@gmail.com',
  'jody.hedges@hotmail.co.uk',
  'brenna246@outlook.com',
  'shaunyboyhill40@gmail.com',
  'lewisrayrussel@icloud.co.uk',
  'bobbyholland200614@gmail.com',
  'jamie.benson1989@gmail.com',
  'eamonosh@hotmail.co.uk',
  'churchlouie2000@gmail.com',
  'jakub200710@gmail.com',
  'louispilling1@gmail.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Combine and deduplicate
  const allEmails = [
    ...new Set([
      ...SIGNUP_EMAILS.map(e => e.toLowerCase().trim()),
      ...ORDER_EMAILS.map(e => e.toLowerCase().trim()),
    ]),
  ];

  let sent = 0;
  const failed: string[] = [];

  for (const email of allEmails) {
    try {
      await resend.emails.send({
        from: 'Virenza <orders@virenza.tech>',
        to: email,
        subject: 'Win a jersey every week — tickets from £1.99 🏆',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:0;background:#fff;">

            <!-- Header -->
            <div style="background:#000;padding:40px 32px 32px;">
              <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 24px;color:#fff;">Virenza</h1>
              <h2 style="font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;color:#fff;line-height:1.1;">Weekly Jersey<br/>Giveaway</h2>
              <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;text-transform:uppercase;letter-spacing:0.15em;">Drawn every Friday at 8pm UK</p>
            </div>

            <!-- Prize highlight -->
            <div style="padding:32px;border-bottom:1px solid #e5e5e5;">
              <p style="color:#888;font-size:10px;text-transform:uppercase;letter-spacing:0.25em;margin:0 0 8px;">This week's best seller prize</p>
              <h3 style="font-size:20px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">Palace x Nike 2026 World Cup Jersey</h3>
              <p style="color:#555;font-size:14px;margin:0 0 24px;">Worth <strong style="color:#000;">£49.99</strong> — enter for as little as <strong style="color:#000;">£2.99 a ticket</strong>. That's a chance to win a premium jersey for less than a coffee.</p>
              <a href="https://www.virenza.tech?view=giveaway" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Enter the Giveaway →</a>
            </div>

            <!-- More draws -->
            <div style="padding:32px;border-bottom:1px solid #e5e5e5;">
              <p style="color:#888;font-size:10px;text-transform:uppercase;letter-spacing:0.25em;margin:0 0 16px;">5 draws running this week</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Best Seller Jersey</td>
                  <td style="padding:10px 0;font-size:13px;color:#555;text-align:right;">£2.99 / ticket</td>
                </tr>
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Featured Jersey</td>
                  <td style="padding:10px 0;font-size:13px;color:#555;text-align:right;">£3.99 / ticket</td>
                </tr>
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Special Edition Jersey</td>
                  <td style="padding:10px 0;font-size:13px;color:#555;text-align:right;">£4.99 / ticket</td>
                </tr>
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">2026 World Cup Jersey</td>
                  <td style="padding:10px 0;font-size:13px;color:#555;text-align:right;">£2.99 / ticket</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Any Jersey from the Store</td>
                  <td style="padding:10px 0;font-size:13px;color:#555;text-align:right;">£1.99 / ticket</td>
                </tr>
              </table>
            </div>

            <!-- How it works -->
            <div style="padding:32px;border-bottom:1px solid #e5e5e5;background:#fafafa;">
              <p style="color:#888;font-size:10px;text-transform:uppercase;letter-spacing:0.25em;margin:0 0 16px;">How it works</p>
              <p style="font-size:13px;color:#555;margin:0 0 8px;">1. Pick a draw and choose your tickets (max 3 per draw)</p>
              <p style="font-size:13px;color:#555;margin:0 0 8px;">2. Pay securely — from £1.99</p>
              <p style="font-size:13px;color:#555;margin:0;">3. Winner drawn every <strong style="color:#000;">Friday at 8pm UK</strong> and announced on our socials</p>
            </div>

            <!-- CTA -->
            <div style="padding:32px;text-align:center;">
              <a href="https://www.virenza.tech?view=giveaway" style="display:inline-block;background:#000;color:#fff;padding:16px 40px;text-decoration:none;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;">View All Draws</a>
            </div>

            <!-- Footer -->
            <div style="padding:24px 32px;border-top:1px solid #e5e5e5;">
              <p style="color:#aaa;font-size:11px;margin:0;">Virenza — Premium Football Jerseys · <a href="https://www.virenza.tech" style="color:#aaa;">virenza.tech</a></p>
            </div>
          </div>
        `,
      });
      sent++;
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 200));
    } catch {
      failed.push(email);
    }
  }

  res.status(200).json({ total: allEmails.length, sent, failed });
}
