import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { week, type } = req.query;
  const pattern = type
    ? `giveaway:${type}:${week ?? '*'}:*`
    : `giveaway:*:${week ?? '*'}:*`;

  const keys = await redis.keys(pattern);
  const entries = (await Promise.all(keys.map(k => redis.get(k)))).filter(Boolean) as any[];

  const byType: Record<string, any[]> = {};
  for (const entry of entries) {
    if (!entry?.type) continue;
    if (!byType[entry.type]) byType[entry.type] = [];
    byType[entry.type].push(entry);
  }

  // Build ticket pools per type (for draw)
  const pools: Record<string, string[]> = {};
  for (const [t, list] of Object.entries(byType)) {
    pools[t] = [];
    for (const e of list) {
      for (let i = 0; i < (e.tickets ?? 1); i++) pools[t].push(e.email);
    }
  }

  res.status(200).json({ entries: byType, ticketPools: pools });
}
