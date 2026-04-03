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
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return res.status(400).json({ error: 'Webhook signature invalid' });
  }

  const subscription = event.data.object;

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const customer: any = await stripe.customers.retrieve(subscription.customer as string);
    const email = customer.email?.toLowerCase();
    if (!email) return res.status(200).end();

    const isActive = subscription.status === 'active' || subscription.status === 'trialing';

    if (isActive) {
      await redis.set(`vip_member:${email}`, {
        email,
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: 'active',
        joinedAt: Date.now(),
      });

      // Welcome email on first creation
      if (event.type === 'customer.subscription.created') {
        await resend.emails.send({
          from: 'Virenza <orders@virenza.tech>',
          to: email,
          subject: 'Welcome to Virenza VIP 🏆',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
              <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
              <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />
              <h2 style="font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">You're now a VIP Member</h2>
              <p style="color:#555;font-size:14px;margin-bottom:24px;">Welcome to the club. Here's what you get as a Virenza VIP:</p>
              <ul style="color:#333;font-size:14px;margin-bottom:32px;padding-left:20px;line-height:2;">
                <li><strong>15% off every order</strong> — just enter your email at checkout to verify</li>
                <li><strong>Monthly giveaway entry</strong> — winner picks any jersey from the site for free</li>
                <li><strong>Early access</strong> — new kits before everyone else</li>
                <li><strong>Free priority shipping</strong> on every order</li>
              </ul>
              <p style="color:#555;font-size:14px;margin-bottom:32px;">To claim your 15% discount, enter <strong>${email}</strong> in the VIP field at checkout. Your discount will be applied automatically.</p>
              <a href="https://www.virenza.tech" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Shop Now</a>
              <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
              <p style="color:#aaa;font-size:11px;">You can cancel your membership anytime at virenza.tech/vip. Billed at £4.99 every 2 weeks.</p>
            </div>
          `,
        }).catch(() => {});
      }
    } else {
      await redis.del(`vip_member:${email}`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const customer: any = await stripe.customers.retrieve(subscription.customer as string);
    const email = customer.email?.toLowerCase();
    if (email) await redis.del(`vip_member:${email}`);
  }

  res.status(200).json({ received: true });
}
