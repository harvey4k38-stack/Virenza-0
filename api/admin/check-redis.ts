import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const abandonedKeys = await redis.keys('abandoned:*');
  const signupKeys = await redis.keys('discount_signup:*');

  const abandoned = [];
  for (const key of abandonedKeys) {
    const data: any = await redis.get(key);
    if (data) abandoned.push({ email: data.email, firstName: data.firstName, total: data.total, savedAt: new Date(data.savedAt).toISOString() });
  }

  const signups = [];
  for (const key of signupKeys) {
    const data: any = await redis.get(key);
    if (data) signups.push({ email: data.email, code: data.code, signedUpAt: new Date(data.signedUpAt).toISOString() });
  }

  res.status(200).json({
    abandonedCarts: { count: abandoned.length, records: abandoned },
    discountSignups: { count: signups.length, records: signups },
  });
}
