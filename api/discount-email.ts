import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const MYSTERY_CODES = [
  ...Array(24).fill('VIRENZA5'),  ...Array(24).fill('VIRENZA6'),
  ...Array(24).fill('VIRENZA7'),  ...Array(24).fill('VIRENZA8'),
  ...Array(24).fill('VIRENZA9'),  ...Array(20).fill('VIRENZA10'),
  ...Array(20).fill('VIRENZA11'), ...Array(20).fill('VIRENZA12'),
  ...Array(3).fill('VIRENZA13'),  ...Array(3).fill('VIRENZA14'),
  ...Array(3).fill('VIRENZA15'),  ...Array(3).fill('VIRENZA16'),
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, code: clientCode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const code = MYSTERY_CODES.includes(clientCode) ? clientCode : MYSTERY_CODES[Math.floor(Math.random() * MYSTERY_CODES.length)];
  const percent = Math.round(parseFloat(code.replace('VIRENZA', '')));

  try {
    // Send code to customer
    await resend.emails.send({
      from: 'Virenza <onboarding@resend.dev>',
      to: email,
      subject: `Your mystery discount — ${percent}% off`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
          <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />
          <h2 style="font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:16px;">Your mystery discount is revealed</h2>
          <p style="color:#555;font-size:14px;margin-bottom:32px;">You unlocked <strong>${percent}% off</strong>. Use the code below at checkout:</p>
          <div style="background:#f5f5f5;border:2px dashed #ccc;padding:20px;text-align:center;margin-bottom:32px;">
            <span style="font-size:28px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;">${code}</span>
          </div>
          <p style="color:#555;font-size:13px;margin-bottom:32px;">Valid on all jerseys. One use per customer.</p>
          <a href="https://virenza.store" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Shop Now</a>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
          <p style="color:#aaa;font-size:11px;">Virenza — Premium Football Jerseys</p>
        </div>
      `,
    });

    // Store signup in Redis for future campaigns (non-blocking)
    redis.set(`discount_signup:${email.toLowerCase()}`, { email: email.toLowerCase(), code, signedUpAt: Date.now() }).catch(() => {});

    // Notify admin
    await resend.emails.send({
      from: 'Virenza <onboarding@resend.dev>',
      to: 'harvey4k38@gmail.com',
      subject: 'New mystery discount signup',
      html: `<p><strong>Email:</strong> ${email}</p><p>Sent code: ${code} (${percent}% off)</p>`,
    });

    res.status(200).json({ success: true, code });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
