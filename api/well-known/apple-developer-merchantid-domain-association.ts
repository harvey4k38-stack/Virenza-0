import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const file = readFileSync(join(process.cwd(), 'public/.well-known/apple-developer-merchantid-domain-association'));
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(file);
  } catch {
    res.status(404).send('Not found');
  }
}
