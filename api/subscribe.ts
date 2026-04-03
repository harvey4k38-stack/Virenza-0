import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Virenza VIP Membership',
            description: '15% off all orders · Monthly giveaway entry · Early access to new kits',
          },
          recurring: {
            interval: 'week',
            interval_count: 2,
          },
          unit_amount: 499,
        },
        quantity: 1,
      }],
      success_url: 'https://www.virenza.tech?vip=success',
      cancel_url: 'https://www.virenza.tech?vip=cancelled',
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
