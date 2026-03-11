import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, address, city, postcode, cart, total } = req.body;

    const itemsHtml = cart.map((item: any) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.selectedThickness} / ${item.selectedLength}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">x${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">£${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    await resend.emails.send({
      from: 'Virenza Orders <onboarding@resend.dev>',
      to: 'harvey4k38@gmail.com',
      subject: `New Order — ${firstName} ${lastName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="letter-spacing:0.2em;text-transform:uppercase;">New Order Received</h2>

          <h3 style="text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #eee;padding-bottom:8px;">Customer Details</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Address:</strong> ${address}, ${city}, ${postcode}</p>

          <h3 style="text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #eee;padding-bottom:8px;margin-top:24px;">Order Summary</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:8px;text-align:left;">Item</th>
                <th style="padding:8px;text-align:left;">Variant</th>
                <th style="padding:8px;text-align:left;">Qty</th>
                <th style="padding:8px;text-align:left;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="font-size:18px;font-weight:bold;margin-top:16px;">Total: £${total}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Email error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
