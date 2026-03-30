import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, message } = req.body;

    await resend.emails.send({
      from: 'Virenza Contact <onboarding@resend.dev>',
      to: 'harvey4k38@gmail.com',
      replyTo: email,
      subject: `Contact Form — ${firstName} ${lastName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="letter-spacing:0.2em;text-transform:uppercase;">New Contact Message</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <h3 style="text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #eee;padding-bottom:8px;margin-top:24px;">Message</h3>
          <p style="line-height:1.6;">${message}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Contact email error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
