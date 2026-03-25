import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, productName } = req.body;

    await resend.emails.send({
      from: 'Virenza <onboarding@resend.dev>',
      to: 'harvey4k38@gmail.com',
      subject: `Back in Stock Request — ${productName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="letter-spacing:0.2em;text-transform:uppercase;">Back in Stock Request</h2>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Customer Email:</strong> ${email}</p>
          <p style="color:#888;font-size:12px;margin-top:24px;">This customer wants to be notified when this item is back in stock.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Notify stock error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
