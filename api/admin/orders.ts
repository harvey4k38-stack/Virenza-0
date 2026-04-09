import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const ADMIN_KEY = process.env.ADMIN_KEY || 'virenza-admin-2026';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    // Get all order numbers sorted by newest first
    const orderNumbers = await redis.zrange('orders_index', 0, -1, { rev: true });
    const orders = [];
    for (const num of orderNumbers) {
      const raw: any = await redis.get(`order:${num}`);
      if (raw) {
        const order = typeof raw === 'string' ? JSON.parse(raw) : raw;
        orders.push(order);
      }
    }
    return res.status(200).json({ orders });
  }

  if (req.method === 'PATCH') {
    const { orderNumber, status } = req.body;
    if (!orderNumber || !status) return res.status(400).json({ error: 'orderNumber and status required' });
    const raw: any = await redis.get(`order:${orderNumber}`);
    if (!raw) return res.status(404).json({ error: 'Order not found' });
    const order = typeof raw === 'string' ? JSON.parse(raw) : raw;
    order.status = status;
    await redis.set(`order:${orderNumber}`, JSON.stringify(order));
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
