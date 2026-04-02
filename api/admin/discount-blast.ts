import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const keys = await redis.keys('discount_signup:*');
  let sent = 0;
  const failed: string[] = [];

  for (const key of keys) {
    const signup: any = await redis.get(key);
    if (!signup?.email) continue;

    try {
      await resend.emails.send({
        from: 'Virenza <onboarding@resend.dev>',
        to: signup.email,
        subject: 'You still have a discount waiting 👀',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
            <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />
            <h2 style="font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Your discount code is still waiting</h2>
            <p style="color:#555;font-size:14px;margin-bottom:24px;">You unlocked a mystery discount but haven't used it yet. Your code is still valid — don't let it go to waste.</p>
            <div style="background:#f5f5f5;border:2px dashed #ccc;padding:20px;text-align:center;margin-bottom:32px;">
              <span style="font-size:28px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;">${signup.code}</span>
            </div>
            <p style="color:#555;font-size:13px;margin-bottom:32px;">Enter it at checkout on any jersey. One use only.</p>
            <a href="https://virenza.tech" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Shop Now</a>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
            <p style="color:#aaa;font-size:11px;">Virenza — Premium Football Jerseys</p>
          </div>
        `,
      });
      sent++;
    } catch {
      failed.push(signup.email);
    }
  }

  res.status(200).json({ total: keys.length, sent, failed });
}
