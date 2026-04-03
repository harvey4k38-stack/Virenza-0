import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

export const config = { api: { bodyParser: false } };

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
const resend = new Resend(process.env.RESEND_API_KEY);

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const PRIZE_NAMES: Record<string, string> = {
  featured: 'Palace x Nike 2026 World Cup Jersey',
  special: 'Random Special Edition Jersey',
  'world-cup': 'Random 2026 World Cup Jersey',
  any: 'Any Random Jersey from the Store',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_GIVEAWAY_WEBHOOK_SECRET!);
  } catch {
    return res.status(400).json({ error: 'Webhook signature invalid' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { email, quantity, weekId, type } = session.metadata ?? {};
    if (!email || !quantity || !weekId || !type) return res.status(200).end();

    const key = `giveaway:${type}:${weekId}:${email}`;
    const existing: any = (await redis.get(key)) ?? { email, tickets: 0, type };
    existing.tickets = Math.min((existing.tickets ?? 0) + parseInt(quantity), 3);
    existing.lastEnteredAt = Date.now();
    await redis.set(key, existing);

    const prize = PRIZE_NAMES[type] ?? 'Jersey';
    const qty = parseInt(quantity);

    await resend.emails.send({
      from: 'Virenza <orders@virenza.tech>',
      to: 'harvey4k38@gmail.com',
      subject: `Giveaway entry [${type}] — ${email} (${quantity} ticket${qty > 1 ? 's' : ''})`,
      html: `<p><strong>${email}</strong> entered the <strong>${type}</strong> giveaway with <strong>${quantity} ticket${qty > 1 ? 's' : ''}</strong>. Draw: ${weekId}</p>`,
    }).catch(() => {});

    await resend.emails.send({
      from: 'Virenza <orders@virenza.tech>',
      to: email,
      subject: `You're in the draw — Virenza Giveaway 🎉`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
          <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />
          <h2 style="font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">You're in the draw!</h2>
          <p style="color:#555;font-size:14px;margin-bottom:16px;">You have <strong>${quantity} ticket${qty > 1 ? 's' : ''}</strong> in this week's giveaway.</p>
          <p style="color:#555;font-size:14px;margin-bottom:16px;">Prize: <strong>${prize}</strong></p>
          <p style="color:#555;font-size:14px;margin-bottom:32px;">The winner is drawn every <strong>Friday at 8pm UK time</strong>. We'll email you if you win — good luck!</p>
          <a href="https://www.virenza.tech" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Visit Virenza</a>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
          <p style="color:#aaa;font-size:11px;">Virenza — Premium Football Jerseys</p>
        </div>
      `,
    }).catch(() => {});
  }

  res.status(200).json({ received: true });
}
