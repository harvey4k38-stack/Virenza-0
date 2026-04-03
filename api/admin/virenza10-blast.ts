import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAILS = [
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  let sent = 0;
  const failed: string[] = [];

  for (const email of EMAILS) {
    try {
      await resend.emails.send({
        from: 'Virenza <orders@virenza.tech>',
        to: email,
        subject: 'Your exclusive discount — 10% off inside',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
            <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />
            <h2 style="font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Your exclusive discount is waiting</h2>
            <p style="color:#555;font-size:14px;margin-bottom:24px;">You signed up for a discount — here it is. Use code below for <strong>10% off</strong> your order. Don't let it go to waste.</p>
            <div style="background:#f5f5f5;border:2px dashed #ccc;padding:20px;text-align:center;margin-bottom:32px;">
              <span style="font-size:28px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;">VIRENZA10</span>
            </div>
            <p style="color:#555;font-size:13px;margin-bottom:32px;">Valid on all jerseys at virenza.tech. One use only.</p>
            <a href="https://www.virenza.tech" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Shop Now</a>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
            <p style="color:#aaa;font-size:11px;">Virenza — Premium Football Jerseys</p>
          </div>
        `,
      });
      sent++;
    } catch {
      failed.push(email);
    }
  }

  res.status(200).json({ total: EMAILS.length, sent, failed });
}
