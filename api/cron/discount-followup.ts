import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const TWENTY_FIVE_MINS = 25 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const keys = await redis.keys('discount_signup:*');
  let sent = 0;

  for (const key of keys) {
    const signup: any = await redis.get(key);
    if (!signup?.email || signup?.followedUp) continue;

    const age = Date.now() - signup.signedUpAt;
    // Only send if between 25 mins and 1 hour old (avoid re-sending)
    if (age < TWENTY_FIVE_MINS || age > ONE_HOUR) continue;

    try {
      await resend.emails.send({
        from: 'Virenza <orders@virenza.tech>',
        to: signup.email,
        subject: 'Still thinking about it? Your discount is waiting',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
            <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />
            <h2 style="font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Your discount code is still active</h2>
            <p style="color:#555;font-size:14px;margin-bottom:24px;">You unlocked a mystery discount a little while ago but haven't used it yet. Don't let it go to waste.</p>
            <div style="background:#f5f5f5;border:2px dashed #ccc;padding:20px;text-align:center;margin-bottom:32px;">
              <span style="font-size:28px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;">${signup.code}</span>
            </div>
            <p style="color:#555;font-size:13px;margin-bottom:32px;">Enter it at checkout. Valid on all jerseys — one use only.</p>
            <a href="https://virenza.tech" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Shop Now</a>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
            <p style="color:#aaa;font-size:11px;">Virenza — Premium Football Jerseys</p>
          </div>
        `,
      });

      // Mark as followed up so we don't send again
      await redis.set(key, { ...signup, followedUp: true });
      sent++;
    } catch {
      // continue
    }
  }

  res.status(200).json({ sent });
}
