import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderNumber, email } = req.body;

    await resend.emails.send({
      from: 'Virenza <orders@virenza.tech>',
      to: 'harvey4k38@gmail.com',
      subject: `Tracking Request — ${orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="letter-spacing:0.2em;text-transform:uppercase;">Tracking Request</h2>
          <p>A customer has requested tracking information for their order.</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Customer Email:</strong> ${email}</p>
          <p style="margin-top:24px;color:#888;font-size:12px;">Reply directly to this email with the tracking details for the customer.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
