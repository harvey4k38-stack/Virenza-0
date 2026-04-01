import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const DISCOUNT_CODE = 'VIRENZA10';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    // Send code to customer
    await resend.emails.send({
      from: 'Virenza <onboarding@resend.dev>',
      to: email,
      subject: 'Your 10% discount code',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
          <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />
          <h2 style="font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:16px;">Here's your 10% off</h2>
          <p style="color:#555;font-size:14px;margin-bottom:32px;">Use the code below at checkout on your first order:</p>
          <div style="background:#f5f5f5;border:2px dashed #ccc;padding:20px;text-align:center;margin-bottom:32px;">
            <span style="font-size:28px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;">${DISCOUNT_CODE}</span>
          </div>
          <p style="color:#555;font-size:13px;margin-bottom:32px;">Valid on all jerseys. One use per customer.</p>
          <a href="https://virenza.store" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Shop Now</a>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
          <p style="color:#aaa;font-size:11px;">Virenza — Premium Football Jerseys</p>
        </div>
      `,
    });

    // Notify admin
    await resend.emails.send({
      from: 'Virenza <onboarding@resend.dev>',
      to: 'harvey4k38@gmail.com',
      subject: 'New discount code request',
      html: `<p><strong>Email:</strong> ${email}</p><p>Sent code: ${DISCOUNT_CODE}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
