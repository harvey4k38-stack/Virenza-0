import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, firstName, cart } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const cartLines = Array.isArray(cart)
    ? cart.map((item: any) => `<li style="margin-bottom:8px;">${item.name} × ${item.quantity} — £${(item.price * item.quantity).toFixed(2)}</li>`).join('')
    : '';

  try {
    await resend.emails.send({
      from: 'Virenza <onboarding@resend.dev>',
      to: email,
      subject: 'You left something behind…',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
          <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />
          <h2 style="font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">
            ${firstName ? `Hey ${firstName}, you` : 'You'} left something in your basket
          </h2>
          <p style="color:#555;font-size:14px;margin-bottom:24px;">Your items are still waiting. Complete your order before they sell out.</p>
          ${cartLines ? `<ul style="padding-left:16px;color:#333;font-size:14px;margin-bottom:24px;">${cartLines}</ul>` : ''}
          <p style="color:#555;font-size:14px;margin-bottom:32px;">Use code <strong style="letter-spacing:0.15em;">VIRENZA10</strong> for 10% off when you return.</p>
          <a href="https://virenza.tech" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Complete My Order</a>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
          <p style="color:#aaa;font-size:11px;">Virenza — Premium Football Jerseys</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: 'Virenza <onboarding@resend.dev>',
      to: 'harvey4k38@gmail.com',
      subject: 'Abandoned cart recovery email sent',
      html: `<p><strong>Email:</strong> ${email}</p><p><strong>Name:</strong> ${firstName ?? 'Unknown'}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
