import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VRZ-${timestamp}-${random}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, address, city, postcode, cart, total } = req.body;
    const orderNumber = generateOrderNumber();

    const itemsHtml = cart.map((item: any) => {
      const variant = [item.selectedThickness, item.selectedLength].filter(Boolean).join(' / ');
      const nameLabel = item.selectedName ? `<br><span style="color:#555;font-size:12px;">Name: ${item.selectedName}</span>` : '';
      return `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${variant}${nameLabel}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">x${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">£${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `}).join('');

    // Email to you
    await resend.emails.send({
      from: 'Virenza Orders <orders@virenza.tech>',
      to: 'orders@virenza.tech',
      subject: `New Order ${orderNumber} — ${firstName} ${lastName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="letter-spacing:0.2em;text-transform:uppercase;">New Order Received</h2>
          <p style="font-size:16px;"><strong>Order Number:</strong> ${orderNumber}</p>
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

    // Confirmation email to customer
    await resend.emails.send({
      from: 'Virenza <orders@virenza.tech>',
      to: email,
      bcc: 'harvey4k38@gmail.com',
      subject: `Order Confirmation — ${orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="letter-spacing:0.2em;text-transform:uppercase;">Thank You, ${firstName}!</h2>
          <p>Your order has been received and is being processed.</p>
          <p style="font-size:18px;font-weight:bold;background:#f5f5f5;padding:12px;letter-spacing:0.1em;">Order Number: ${orderNumber}</p>
          <p>Please keep this for your records.</p>

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

          <h3 style="text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #eee;padding-bottom:8px;margin-top:24px;">Shipping To</h3>
          <p>${firstName} ${lastName}<br>${address}<br>${city}<br>${postcode}</p>

          <p style="margin-top:32px;color:#888;font-size:12px;">If you have any questions, contact us at orders@virenza.tech</p>
          <p style="color:#888;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">Virenza</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, orderNumber });
  } catch (err: any) {
    console.error('Email error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
