import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAILS = [
  '00kreece@gmail.com',
  'aaron.headd@gmail.com',
  'aaronbailey07@icloud.com',
  'aaronbrown35b@gmail.com',
  'abelps1302@hotmail.co.uk',
  'acarver9816@gmail.com',
  'aidenjmes74@gmail.com',
  'alex-pinches@hotmail.co.uk',
  'alfiecollins2204@gmail.com',
  'alfienewburyy@gmail.com',
  'anik.abdullah@icloud.com',
  'atommarch2007@gmail.com',
  'ben.edwards2004@gmail.com',
  'benoni@yahoo.com',
  'berroscarpet1@hotmail.com',
  'billymccoy46@icloud.com',
  'blakecolley10@outlook.com',
  'bmcsweeney18@gmail.com',
  'caleb.lineton@yahoo.com',
  'calhounshear18@gmail.com',
  'cam_jewell@hotmail.com',
  'charlie_whitcombe@yahoo.co.uk',
  'charliedagger3417@gmail.com',
  'charlieshtcphone@gmail.com',
  'clarkejohn104@gmail.com',
  'colelang03997@icloud.com',
  'colesando@outlook.com',
  'conrobo@live.co.uk',
  'czphillips12@gmail.com',
  'danieljford@icloud.com',
  'darlastonkian@gmail.com',
  'deanheenan114@gmail.com',
  'dexion13115@gmail.com',
  'dylanantony2801@gmail.com',
  'ellieleeks@gmail.com',
  'ellischiverton@yahoo.com',
  'emzicloud@outlook.com',
  'ethan.greenall.work@gmail.com',
  'ethanstorey11@icloud.com',
  'freddie.mccoy@hotmail.co.uk',
  'gamingops55@gmail.com',
  'georgecrook10@gmail.com',
  'glenn_19_92@hotmail.com',
  'gurkarank13@icloud.com',
  'harveydhesi10@gmail.com',
  'isaac.wilson.7788@gmail.com',
  'jack.chapman@icloud.com',
  'jackdanielshaw@hotmail.co.uk',
  'jackhasler05@hotmail.com',
  'jackkelly2k06@gmail.com',
  'jackkwollaston@hotmail.com',
  'jadenfoster301005@icloud.com',
  'jaketye@googlemail.com',
  'jamesfredrick853@gmail.com',
  'jaydenpettett@gmail.com',
  'jesles72@gmail.com',
  'joedowd15@gmail.com',
  'joelpicket10@gmail.com',
  'jordanhaworth1996@gmail.com',
  'jorddd.37@googlemail.com',
  'jordomino@gmail.com',
  'joshcadogan34@gmail.com',
  'joshleyssens@icloud.com',
  'joshlpearce06@gmail.com',
  'joshpearce06@gmail.com',
  'jredhead425@gmail.com',
  'jredhead765@gmail.com',
  'k41denc@gmail.com',
  'kakrakoranteng4@gmail.com',
  'kellyfuller2021@gmail.con',
  'kiaendjk@hotmail.com',
  'krummington92@yahoo.com',
  'leeseville@live.co.uk',
  'leonjamesadeleye123@gmail.com',
  'lewis.ifould@icloud.com',
  'lewis2003anderson@icloud.com',
  'lewis2710lw@gmail.com',
  'lewisdodd035@gmail.com',
  'louiebennett987@gmail.com',
  'lukegreenwood17@outlook.com',
  'lukerusson1994@gmail.com',
  'mahmud27463@gmail.com',
  'mark.starlin37@outlook.com',
  'mattcameron333@hotmail.com',
  'matthew_gtaylor@sky.com',
  'matthewcaswell373@gmail.com',
  'matthewjohnson02@hotmail.com',
  'mattkerry15@gmail.com',
  'matty_smith98@icloud.com',
  'maxquinton272@gmail.com',
  'morganjgraham@outlook.com',
  'nicholstailors@gmail.com',
  'oliverlucasoscar@outlook.com',
  'orgiemorgie@gmail.com',
  'owen.14.matthews@gmail.com',
  'owenanderton14@gmail.com',
  'paulburchett1974@gmail.com',
  'peteriper492@aol.com',
  'peterpiper492@aol.com',
  'proctermatthew1@outlook.com',
  'ross.gibbs27395@gmail.com',
  'rossjallen2003@gmail.com',
  'rowlinsonpeter02@gmail.com',
  'rstanden14@icloud.com',
  'ryanjamescalvert95@hotmail.com',
  'ryanmarkparry@gmail.com',
  'ryantlangdon@outlook.com',
  'samcierpik123@gmail.com',
  'seanjk2010@live.co.uk',
  'secretpro2036@gmail.com',
  'shanebusiness4u@gmail.com',
  'stevenjyates@hotmail.com',
  'tncube433@gmail.com',
  'toby.herbert@outlook.com',
  'tom.millerr@outlook.com',
  'tomrich191094@googlemail.com',
];

const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
  <h1 style="font-size:24px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:8px;">Virenza</h1>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:32px;" />

  <h2 style="font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">⚽ World Cup 2026 — 26% Off Everything</h2>
  <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:24px;">
    The World Cup is coming — and we're celebrating early. For a limited time, get <strong>26% off your entire order</strong> at Virenza. New kits just dropped. Don't miss out.
  </p>

  <div style="background:#f5f5f5;border:2px dashed #000;padding:24px;text-align:center;margin-bottom:32px;">
    <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#888;">Your exclusive code</p>
    <span style="font-size:32px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;">WC2026</span>
    <p style="margin:8px 0 0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">26% off — valid on all jerseys</p>
  </div>

  <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:28px;" />

  <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#888;margin-bottom:12px;">🔥 Best Seller</p>
  <img src="https://www.virenza.tech/jerseys/palace-wc-1.png" alt="Palace x Nike 2026 World Cup Jersey" style="width:100%;max-width:560px;display:block;margin-bottom:16px;" />
  <h3 style="font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px;">Palace x Nike 2026 World Cup Jersey</h3>
  <p style="color:#555;font-size:13px;margin:0 0 4px;">St George stained-glass design · Co-branded Palace x Nike</p>
  <p style="font-size:15px;font-weight:800;margin:0 0 20px;"><span style="text-decoration:line-through;color:#aaa;font-weight:400;margin-right:8px;">£49.99</span>£39.99 — or <strong>£29.59 with WC2026</strong></p>
  <a href="https://www.virenza.tech" style="display:inline-block;background:#000;color:#fff;padding:16px 40px;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Shop Now →</a>

  <hr style="border:none;border-top:1px solid #e5e5e5;margin-top:40px;margin-bottom:16px;" />
  <p style="color:#aaa;font-size:11px;">Apply code <strong>WC2026</strong> at checkout. One use per customer. Valid while stock lasts.</p>
  <p style="color:#aaa;font-size:11px;">Virenza — Premium Football Jerseys · virenza.tech</p>
</div>
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== (process.env.ADMIN_KEY || 'virenza-admin-2026')) return res.status(401).json({ error: 'Unauthorized' });

  const test = req.query.test === 'true';
  const targets = test ? ['harvey4k38@gmail.com'] : EMAILS;

  let sent = 0;
  const failed: string[] = [];

  for (const email of targets) {
    try {
      await resend.emails.send({
        from: 'Virenza <orders@virenza.tech>',
        to: email,
        subject: '⚽ 26% Off — World Cup 2026 Drop',
        html,
      });
      sent++;
    } catch {
      failed.push(email);
    }
  }

  res.status(200).json({ total: targets.length, sent, failed });
}
