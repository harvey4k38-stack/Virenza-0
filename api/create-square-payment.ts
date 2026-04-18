import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceId, amount, idempotencyKey, verificationToken } = req.body;

    if (!sourceId || !amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const body: any = {
      source_id: sourceId,
      idempotency_key: idempotencyKey ?? `virenza-${Date.now()}`,
      amount_money: {
        amount: Math.round(amount * 100),
        currency: 'GBP',
      },
      location_id: process.env.SQUARE_LOCATION_ID,
    };

    if (verificationToken) {
      body.verification_token = verificationToken;
    }

    const response = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2024-01-17',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.payment?.status === 'COMPLETED') {
      return res.status(200).json({ success: true, paymentId: data.payment.id });
    }

    const errorCode = data.errors?.[0]?.code ?? '';
    const errorDetail = data.errors?.[0]?.detail ?? errorCode ?? 'Payment failed';
    const errorCategory = data.errors?.[0]?.category ?? '';
    console.error('Square payment failed:', JSON.stringify(data.errors));
    return res.status(400).json({ error: `${errorDetail} [${errorCategory}]`, code: errorCode });
  } catch (err: any) {
    console.error('Square payment error:', err.message);
    return res.status(500).json({ error: 'Payment processing error. Please try again.' });
  }
}
