import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, firstName, cart, total } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const key = `abandoned:${email.toLowerCase()}`;
  await kv.set(key, { email, firstName, cart, total, savedAt: Date.now() }, { ex: 60 * 60 * 48 }); // expires after 48h

  res.status(200).json({ success: true });
}
