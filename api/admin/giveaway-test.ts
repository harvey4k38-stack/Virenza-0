import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await resend.emails.send({
    from: 'Virenza <orders@virenza.tech>',
    to: 'harvey4k38@gmail.com',
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

  res.status(200).json({ sent: true });
}
