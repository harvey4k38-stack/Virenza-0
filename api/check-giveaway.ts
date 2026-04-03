import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

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
  const { email } = req.body;
  if (!email) return res.status(400).json({ tickets: {} });
  const weekId = getWeekId();
  const types = ['best-seller', 'featured', 'special', 'world-cup', 'any'];
  const results: Record<string, number> = {};
  for (const type of types) {
    const entry: any = await redis.get(`giveaway:${type}:${weekId}:${email.toLowerCase().trim()}`);
    results[type] = entry?.tickets ?? 0;
  }
  res.status(200).json({ tickets: results, weekId });
}
