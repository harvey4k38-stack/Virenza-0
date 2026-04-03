import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const GIVEAWAY_TYPES: Record<string, { name: string; prize: string; price: number }> = {
  'best-seller': { name: 'Best Seller Jersey Giveaway', prize: 'Palace x Nike 2026 World Cup Jersey', price: 299 },
  featured:  { name: 'Featured Jersey Giveaway',        prize: 'Random Featured Jersey',               price: 399 },
  special:   { name: 'Special Edition Giveaway',        prize: 'Random Special Edition Jersey',        price: 499 },
  'world-cup': { name: 'World Cup Jersey Giveaway',     prize: 'Random 2026 World Cup Jersey',         price: 299 },
  any:       { name: 'Any Jersey Giveaway',              prize: 'Any Random Jersey from the Store',    price: 199 },
};

function getWeekId() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,
  }).formatToParts(now);
  const day = ({ Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6 } as Record<string,number>)[parts.find(p=>p.type==='weekday')!.value] ?? 0;
  const hour = parseInt(parts.find(p=>p.type==='hour')!.value);
  const secSinceMidnight = hour * 3600 + parseInt(parts.find(p=>p.type==='minute')!.value) * 60 + parseInt(parts.find(p=>p.type==='second')!.value);
  let daysUntilFriday = (5 - day + 7) % 7;
  if (day === 5 && secSinceMidnight < 72000) daysUntilFriday = 0;
  if (day === 5 && secSinceMidnight >= 72000) daysUntilFriday = 7;
  const londonNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
  londonNow.setDate(londonNow.getDate() + daysUntilFriday);
  return londonNow.toISOString().slice(0, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, quantity, type } = req.body;
  const giveaway = GIVEAWAY_TYPES[type];
  if (!email || !quantity || quantity < 1 || quantity > 3 || !giveaway) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const weekId = getWeekId();
  const key = `giveaway:${type}:${weekId}:${email.toLowerCase().trim()}`;
  const existing: any = await redis.get(key);
  const currentTickets = existing?.tickets ?? 0;

  if (currentTickets + quantity > 3) {
    return res.status(400).json({ error: `You already have ${currentTickets} ticket${currentTickets > 1 ? 's' : ''} in this draw. Max 3.` });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `${giveaway.name} — ${quantity} Ticket${quantity > 1 ? 's' : ''}`,
            description: `${giveaway.prize} · Draw every Friday at 8pm UK`,
          },
          unit_amount: giveaway.price,
        },
        quantity,
      }],
      metadata: { email: email.toLowerCase().trim(), quantity: String(quantity), weekId, type },
      success_url: 'https://www.virenza.tech?giveaway=success',
      cancel_url: 'https://www.virenza.tech?giveaway=cancelled',
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
