import { Product, Review, Category } from './types';
import { NEW_PRODUCTS } from './external-products';

const BASIC_NAME_VARIANTS = [
  { label: 'No Name / Number' },
  { label: 'Customize Name' },
];

const JERSEY_NAME_VARIANTS = [
  { label: 'No Name / Number' },
  { label: 'Customize Name' },
  { label: 'RICE 4' },
  { label: 'BELLINGHAM 10' },
  { label: 'KANE 9',        image: '/jerseys/england-08-1.png' },
  { label: 'PALMER 20' },
  { label: 'SAKA 7',        image: '/jerseys/retro-saka-2.png' },
  { label: 'RASHFORD 11' },
  { label: 'FODEN 17' },
  { label: 'ROGERS 15' },
  { label: 'EZE 19' },
  { label: 'GORDON 17' },
  { label: 'ANDERSON 8' },
  { label: 'PICKFORD 1' },
  { label: 'BECKHAM 7' },
  { label: 'SCHOLES 8' },
  { label: 'GASCOIGNE 8',   image: '/jerseys/retro-gazza-2.png' },
  { label: 'OWEN 20' },
  { label: 'SHEARER 9' },
];

const PALACE_NAME_VARIANTS = [
  ...JERSEY_NAME_VARIANTS.slice(0, 14),
  { label: 'PALACE 7' },
  ...JERSEY_NAME_VARIANTS.slice(14),
];

export const PRODUCTS: Product[] = [

  // ── Jerseys with images ───────────────────────────────────────────────────

  {
    id: 'j-palace-wc',
    name: 'Palace x Nike 2026 World Cup Jersey',
    price: 34.95,
    compareAtPrice: 39.99,
    description: 'The Palace x Nike 2026 World Cup jersey. Featuring a St George stained-glass graphic across the full body with co-branded Palace x Nike badge.',
    category: 'jersey-england',
    images: [
      '/jerseys/palace-wc-1.png',
      '/jerseys/palace-wc-2.png',
      '/jerseys/palace-wc-3.png',
      '/jerseys/palace-wc-4.png',
      '/jerseys/palace-wc-5.png',
    ],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: true,
    nameVariants: PALACE_NAME_VARIANTS,
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: 'j-nike-away-2026',
    name: 'England Nike Away 2026 World Cup',
    price: 28.99,
    compareAtPrice: 35.99,
    description: 'The official England Nike away shirt for the 2026 World Cup. Bold red with navy trim, featuring the three lions crest and the iconic Nike swoosh. Built for performance and style.',
    category: 'jersey-england',
    images: [
      '/jerseys/nike-away-1.png',
      '/jerseys/nike-away-2.png',
      '/jerseys/nike-away-3.png',
      '/jerseys/nike-away-4.png',
      '/jerseys/nike-away-5.png',
    ],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 25
  },
  {
    id: 'j-retro-saka',
    name: 'England Retro Classic',
    price: 28.99,
    compareAtPrice: 35.99,
    description: 'A beautifully crafted retro England home shirt in the classic Umbro style. Features the iconic three lions badge and Saka 7 on the back.',
    category: 'jersey-england',
    images: [
      '/jerseys/retro-saka-1.png',
      '/jerseys/retro-saka-2.png',
      '/jerseys/retro-saka-3.png',
      '/jerseys/retro-saka-4.png',
    ],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 24
  },
  {
    id: 'j-retro-gazza',
    name: 'England 1990 Retro',
    price: 28.99,
    compareAtPrice: 35.99,
    description: 'The legendary 1990 Umbro England home shirt with Gascoigne 8 on the back. Italia 90 — one of the most iconic kits in football history.',
    category: 'jersey-england',
    images: [
      '/jerseys/retro-gazza-1.png',
      '/jerseys/retro-gazza-3.png',
      '/jerseys/retro-gazza-2.png',
      '/jerseys/retro-gazza-5.png',
    ],
    nameVariants: JERSEY_NAME_VARIANTS,
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 26
  },

  // ── Chains ────────────────────────────────────────────────────────────────

  {
    id: '1',
    name: 'Virenza Classic Tennis Chain',
    price: 19.99,
    compareAtPrice: 23.99,
    description: 'Our signature tennis chain featuring hand-set stones. A timeless statement piece that exudes luxury and class.',
    category: 'chains',
    images: [
      '/elite-img-1.png',
      '/elite-img-2.png',
      '/elite-img-3.png',
      '/elite-img-4.png'
    ],
    thickness: ['3mm', '4mm', '5mm'],
    lengths: ['18"', '20"', '22"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Elite Iced Tennis Chain',
    price: 23.99,
    compareAtPrice: 28.99,
    description: 'An elite version of our tennis chain with larger stones and a more secure clasp for maximum brilliance.',
    category: 'chains',
    images: [
      '/asset-2-1.png',
      '/asset-2-2.png',
      '/asset-2-3.png',
      '/asset-2-4.png'
    ],
    thickness: ['4mm', '5mm'],
    lengths: ['18"', '20"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 86
  },
  {
    id: '3',
    name: 'Sovereign Cuban Chain',
    price: 23.99,
    compareAtPrice: 29.99,
    description: 'The pinnacle of our chain collection. A bold Cuban link crafted for those who demand the best — heavy, refined, and unmistakable.',
    category: 'chains',
    images: [
      '/asset-67-1.png',
      '/asset-67-2.png',
      '/asset-67-3.png',
      '/asset-67-4.png'
    ],
    thickness: ['5mm', '6mm'],
    lengths: ['20"', '22"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 42
  },
  {
    id: '9',
    name: 'Aurum Link Chain',
    price: 22.99,
    compareAtPrice: 27.99,
    description: 'A sleek gold box chain with a clean geometric link structure. Minimal, precise and effortlessly luxurious.',
    category: 'chains',
    images: [
      '/gold-box-1.png',
      '/gold-box-2.png',
      '/gold-box-3.png',
      '/gold-box-4.png'
    ],
    thickness: ['3mm', '4mm'],
    lengths: ['18"', '20"', '22"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 14
  },
  {
    id: '8',
    name: 'Silver Rope Chain',
    price: 19.99,
    compareAtPrice: 23.99,
    description: 'A classic silver rope chain with a twisted design that catches the light. Timeless, versatile and built for everyday wear.',
    category: 'chains',
    images: [
      '/rope-chain-1.png',
      '/rope-chain-2.png',
      '/rope-chain-3.png',
      '/rope-chain-4.png'
    ],
    thickness: ['3mm', '4mm', '5mm'],
    lengths: ['18"', '20"', '22"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 22
  },
  {
    id: '7',
    name: 'Sovereign Link Chain',
    price: 26.99,
    compareAtPrice: 32.99,
    description: 'A bold gold Cuban link chain crafted for those who command attention. Heavy, warm-toned, and built to last.',
    category: 'chains',
    images: [
      '/gold-cuban-1.png',
      '/gold-cuban-2.png',
      '/gold-cuban-3.png',
      '/gold-cuban-4.png'
    ],
    thickness: ['5mm', '6mm'],
    lengths: ['18"', '20"', '22"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 18
  },

  // ── Bracelets ─────────────────────────────────────────────────────────────

  {
    id: '11',
    name: 'Iced Out Tennis Bracelet',
    price: 21.99,
    compareAtPrice: 26.99,
    description: 'A premium iced out tennis bracelet with hand-set stones that catch every light. Understated flex for the wrist.',
    category: 'bracelets',
    images: [
      '/iced-brace-1.png',
      '/iced-brace-2.png',
      '/iced-brace-3.png',
      '/iced-brace-4.png'
    ],
    thickness: ['3mm', '4mm'],
    lengths: ['7"', '8"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 29
  },
  {
    id: '12',
    name: 'Rose Gold Tennis Bracelet',
    price: 23.99,
    compareAtPrice: 28.99,
    description: 'A warm rose gold tennis bracelet featuring brilliant-cut stones. Effortlessly elegant and built to turn heads.',
    category: 'bracelets',
    images: [
      '/rosegold-brace-1.png',
      '/rosegold-brace-2.png',
      '/rosegold-brace-3.png'
    ],
    thickness: ['3mm', '4mm'],
    lengths: ['7"', '8"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 17
  },
  {
    id: '10',
    name: 'Classic Silver Bracelet',
    price: 16.99,
    compareAtPrice: 20.99,
    description: 'A solid silver bracelet with a polished finish. Bold, clean and built for the wrist that means business.',
    category: 'bracelets',
    images: [
      '/silver-cuban-brace-1.png',
      '/silver-cuban-brace-2.png',
      '/silver-cuban-brace-3.png',
      '/silver-cuban-brace-4.png'
    ],
    thickness: ['6mm', '8mm'],
    lengths: ['7"', '8"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 11
  },
  {
    id: '4',
    name: 'Signature Tennis Bracelet',
    price: 19.99,
    compareAtPrice: 23.99,
    description: 'A classic tennis bracelet with hand-set stones. A timeless piece that adds a touch of elegance to any outfit.',
    category: 'bracelets',
    images: [
      '/asset-6-1.png',
      '/asset-6-2.png',
      '/asset-6-3.png',
      '/asset-6-4.png'
    ],
    thickness: ['3mm', '4mm'],
    lengths: ['7"', '8"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 94
  },
  {
    id: '5',
    name: 'Sovereign Cuban Bracelet',
    price: 23.99,
    compareAtPrice: 29.99,
    description: 'A bold iced-out bracelet featuring premium stones set in a polished finish. Built for those who wear their confidence on their wrist.',
    category: 'bracelets',
    images: [
      '/asset-68-1.png',
      '/asset-68-2.png',
      '/asset-68-3.png',
      '/asset-68-4.png'
    ],
    thickness: ['4mm', '5mm'],
    lengths: ['7"', '8"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 56
  },
  {
    id: '6',
    name: 'Executive Tennis Bracelet',
    price: 27.99,
    compareAtPrice: 34.99,
    description: 'The executive choice. A bold yet sophisticated bracelet designed for the modern gentleman.',
    category: 'bracelets',
    images: [
      '/asset-69-1.png',
      '/asset-69-2.png',
      '/asset-69-3.png',
      '/asset-69-4.png'
    ],
    thickness: ['5mm'],
    lengths: ['7.5"', '8.5"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 38
  },


  // ── JerseyGame External Products (666 items) ─────────────────────────────
  ...NEW_PRODUCTS.map(p => {
    if (p.nameVariants && p.nameVariants.length > 0) {
      const hasCustomize = p.nameVariants.some(v => v.label === 'Customize Name');
      return { ...p, nameVariants: hasCustomize ? p.nameVariants : [...p.nameVariants, { label: 'Customize Name' }] };
    }
    return { ...p, nameVariants: BASIC_NAME_VARIANTS };
  }),
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'James W.',
    rating: 5,
    comment: 'Ordered the Brazil home shirt and it\'s absolutely class. Fabric feels premium and the colours are spot on. Arrived in 4 days — well happy.'
  },
  {
    id: 'r2',
    author: 'Michael R.',
    rating: 5,
    comment: 'Got the Man City away kit. Fits true to size, the stitching is clean and it looks identical to the real thing. Great price too.'
  },
  {
    id: 'r3',
    author: 'David L.',
    rating: 5,
    comment: 'Bought three jerseys — Argentina, Real Madrid, and PSG. All perfect. The quality is genuinely better than I expected. Will 100% be back.'
  }
];

export const JERSEY_REVIEWS: Review[] = [
  {
    id: 'jr1',
    author: 'Tom H.',
    rating: 5,
    comment: 'Fits true to size — ordered my usual medium and it was spot on. Quality is brilliant for the price.'
  },
  {
    id: 'jr2',
    author: 'Liam B.',
    rating: 5,
    comment: 'Shirt arrived quickly and the print is clean. Wore it to the match and got loads of compliments.'
  },
  {
    id: 'jr3',
    author: 'Ryan M.',
    rating: 5,
    comment: 'Ordered the large — fits perfectly, not too baggy. The fabric feels proper premium, dead happy with it.'
  },
  {
    id: 'jr4',
    author: 'Jack S.',
    rating: 5,
    comment: 'Got the kids size for my son and it\'s quality. True to size, he loves it. Will be ordering again.'
  },
  {
    id: 'jr5',
    author: 'Connor P.',
    rating: 4,
    comment: 'Really happy with the jersey. Sizing is accurate — I\'d say go true to size. Delivery was fast too.'
  },
  {
    id: 'jr6',
    author: 'Nathan G.',
    rating: 5,
    comment: 'Bought this as a gift and the recipient was over the moon. Great quality and it came well packaged.'
  },
  {
    id: 'jr7',
    author: 'Kyle F.',
    rating: 5,
    comment: 'Brilliant kit. Feels and looks authentic. Sizing is spot on — fits just like a proper football shirt should.'
  },
];

export const JERSEY_CATEGORIES: Category[] = [

  // ── JerseyGame Club & Country Categories ─────────────────────────────────
  { id: 'jersey-ac-milan',                  name: 'AC Milan',                     image: '/badges/jersey-ac-milan.png' },
  { id: 'jersey-ajax',                      name: 'Ajax',                         image: '/badges/jersey-ajax.png' },
  { id: 'jersey-al-hilal',                  name: 'Al Hilal',                     image: '/badges/jersey-al-hilal.png' },
  { id: 'jersey-al-nassr',                  name: 'Al Nassr',                     image: '/badges/jersey-al-nassr.png' },
  { id: 'jersey-alaves',                    name: 'Alaves',                       image: '/badges/jersey-alaves.png' },
  { id: 'jersey-albania',                   name: 'Albania',                      image: '/badges/jersey-albania.png' },
  { id: 'jersey-algeria',                   name: 'Algeria',                      image: '/badges/jersey-algeria.png' },
  { id: 'jersey-argentina',                 name: 'Argentina',                    image: '/badges/jersey-argentina.png' },
  { id: 'jersey-arsenal',                   name: 'Arsenal',                      image: '/badges/jersey-arsenal.png' },
  { id: 'jersey-aston-villa',               name: 'Aston Villa',                  image: '/badges/jersey-aston-villa.png' },
  { id: 'jersey-atalanta',                  name: 'Atalanta',                     image: '/badges/jersey-atalanta.png' },
  { id: 'jersey-athletic-bilbao',           name: 'Athletic Bilbao',              image: '/badges/jersey-athletic-bilbao.png' },
  { id: 'jersey-atletico-madrid',           name: 'Atletico Madrid',              image: '/badges/jersey-atletico-madrid.png' },
  { id: 'jersey-australia',                 name: 'Australia',                    image: '/badges/jersey-australia.png' },
  { id: 'jersey-barcelona',                 name: 'Barcelona',                    image: '/badges/jersey-barcelona.png' },
  { id: 'jersey-bayer-leverkusen',          name: 'Bayer Leverkusen',             image: '/badges/jersey-bayer-leverkusen.png' },
  { id: 'jersey-bayern-munich',             name: 'Bayern Munich',                image: '/badges/jersey-bayern-munich.png' },
  { id: 'jersey-belgium',                   name: 'Belgium',                      image: '/badges/jersey-belgium.png' },
  { id: 'jersey-benfica',                   name: 'Benfica',                      image: '/badges/jersey-benfica.png' },
  { id: 'jersey-bologna',                   name: 'Bologna',                      image: '/badges/jersey-bologna.png' },
  { id: 'jersey-borussia-dortmund',         name: 'Borussia Dortmund',            image: '/badges/jersey-borussia-dortmund.png' },
  { id: 'jersey-borussia-monchengladbach',  name: 'Borussia Mönchengladbach',     image: '/badges/jersey-borussia-monchengladbach.png' },
  { id: 'jersey-brazil',                    name: 'Brazil',                       image: '/badges/jersey-brazil.png' },
  { id: 'jersey-brighton',                  name: 'Brighton',                     image: '/badges/jersey-brighton.png' },
  { id: 'jersey-cadiz',                     name: 'Cadiz',                        image: '/badges/jersey-cadiz.png' },
  { id: 'jersey-cameroon',                  name: 'Cameroon',                     image: '/badges/jersey-cameroon.png' },
  { id: 'jersey-canada',                    name: 'Canada',                       image: '/badges/jersey-canada.png' },
  { id: 'jersey-celta-vigo',                name: 'Celta Vigo',                   image: '/badges/jersey-celta-vigo.png' },
  { id: 'jersey-celtic',                    name: 'Celtic',                       image: '/badges/jersey-celtic.png' },
  { id: 'jersey-chelsea',                   name: 'Chelsea',                      image: '/badges/jersey-chelsea.png' },
  { id: 'jersey-chile',                     name: 'Chile',                        image: '/badges/jersey-chile.png' },
  { id: 'jersey-chicago-fire',              name: 'Chicago Fire',                 image: '/badges/jersey-chicago-fire.png' },
  { id: 'jersey-club-america',              name: 'Club America',                 image: '/badges/jersey-club-america.png' },
  { id: 'jersey-colombia',                  name: 'Colombia',                     image: '/badges/jersey-colombia.png' },
  { id: 'jersey-como',                      name: 'Como',                         image: '/badges/jersey-como.png' },
  { id: 'jersey-costa-rica',                name: 'Costa Rica',                   image: '/badges/jersey-costa-rica.png' },
  { id: 'jersey-cote-divoire',              name: "Cote D'Ivoire",                image: '/jerseys/external/cote-divoire-home-shirt-2023-1.jpg' },
  { id: 'jersey-croatia',                   name: 'Croatia',                      image: '/badges/jersey-croatia.png' },
  { id: 'jersey-crystal-palace',            name: 'Crystal Palace',               image: '/badges/jersey-crystal-palace.png' },
  { id: 'jersey-ecuador',                   name: 'Ecuador',                      image: '/badges/jersey-ecuador.png' },
  { id: 'jersey-egypt',                     name: 'Egypt',                        image: '/badges/jersey-egypt.png' },
  { id: 'jersey-eintracht-frankfurt',       name: 'Eintracht Frankfurt',          image: '/badges/jersey-eintracht-frankfurt.png' },
  { id: 'jersey-england',                   name: 'England',                      image: '/badges/jersey-england.png' },
  { id: 'jersey-espanyol',                  name: 'Espanyol',                     image: '/badges/jersey-espanyol.png' },
  { id: 'jersey-everton',                   name: 'Everton',                      image: '/badges/jersey-everton.png' },
  { id: 'jersey-fiorentina',                name: 'Fiorentina',                   image: '/badges/jersey-fiorentina.png' },
  { id: 'jersey-flamengo',                  name: 'Flamengo',                     image: '/badges/jersey-flamengo.png' },
  { id: 'jersey-france',                    name: 'France',                       image: '/badges/jersey-france.png' },
  { id: 'jersey-fulham',                    name: 'Fulham',                       image: '/badges/jersey-fulham.png' },
  { id: 'jersey-galatasaray',               name: 'Galatasaray',                  image: '/badges/jersey-galatasaray.png' },
  { id: 'jersey-genoa',                     name: 'Genoa',                        image: '/badges/jersey-genoa.png' },
  { id: 'jersey-germany',                   name: 'Germany',                      image: '/badges/jersey-germany.png' },
  { id: 'jersey-getafe',                    name: 'Getafe',                       image: '/badges/jersey-getafe.png' },
  { id: 'jersey-ghana',                     name: 'Ghana',                        image: '/badges/jersey-ghana.png' },
  { id: 'jersey-girona',                    name: 'Girona',                       image: '/badges/jersey-girona.png' },
  { id: 'jersey-hellas-verona',             name: 'Hellas Verona',                image: '/badges/jersey-hellas-verona.png' },
  { id: 'jersey-hungary',                   name: 'Hungary',                      image: '/badges/jersey-hungary.png' },
  { id: 'jersey-inter-miami',               name: 'Inter Miami',                  image: '/badges/jersey-inter-miami.png' },
  { id: 'jersey-inter-milan',               name: 'Inter Milan',                  image: '/badges/jersey-inter-milan.png' },
  { id: 'jersey-ipswich-town',              name: 'Ipswich Town',                 image: '/badges/jersey-ipswich-town.png' },
  { id: 'jersey-italy',                     name: 'Italy',                        image: '/badges/jersey-italy.png' },
  { id: 'jersey-jamaica',                   name: 'Jamaica',                      image: '/badges/jersey-jamaica.png' },
  { id: 'jersey-japan',                     name: 'Japan',                        image: '/badges/jersey-japan.png' },
  { id: 'jersey-jordan',                    name: 'Jordan',                       image: '/badges/jersey-jordan.png' },
  { id: 'jersey-juventus',                  name: 'Juventus',                     image: '/badges/jersey-juventus.png' },
  { id: 'jersey-lafc',                      name: 'LAFC',                         image: '/badges/jersey-lafc.png' },
  { id: 'jersey-lazio',                     name: 'Lazio',                        image: '/badges/jersey-lazio.png' },
  { id: 'jersey-leeds-united',              name: 'Leeds United',                 image: '/badges/jersey-leeds-united.png' },
  { id: 'jersey-leicester-city',            name: 'Leicester City',               image: '/badges/jersey-leicester-city.png' },
  { id: 'jersey-lille',                     name: 'Lille',                        image: '/badges/jersey-lille.png' },
  { id: 'jersey-liverpool',                 name: 'Liverpool',                    image: '/badges/jersey-liverpool.png' },
  { id: 'jersey-lyon',                      name: 'Lyon',                         image: '/badges/jersey-lyon.png' },
  { id: 'jersey-mainz-05',                  name: 'Mainz 05',                     image: '/badges/jersey-mainz-05.png' },
  { id: 'jersey-mallorca',                  name: 'Mallorca',                     image: '/badges/jersey-mallorca.png' },
  { id: 'jersey-manchester-city',           name: 'Manchester City',              image: '/badges/jersey-manchester-city.png' },
  { id: 'jersey-manchester-united',         name: 'Manchester United',            image: '/badges/jersey-manchester-united.png' },
  { id: 'jersey-marseille',                 name: 'Marseille',                    image: '/badges/jersey-marseille.png' },
  { id: 'jersey-mexico',                    name: 'Mexico',                       image: '/badges/jersey-mexico.png' },
  { id: 'jersey-morocco',                   name: 'Morocco',                      image: '/badges/jersey-morocco.png' },
  { id: 'jersey-napoli',                    name: 'Napoli',                       image: '/badges/jersey-napoli.png' },
  { id: 'jersey-nashville-sc',              name: 'Nashville SC',                 image: '/badges/jersey-nashville-sc.png' },
  { id: 'jersey-netherlands',               name: 'Netherlands',                  image: '/badges/jersey-netherlands.png' },
  { id: 'jersey-new-zealand',               name: 'New Zealand',                  image: '/badges/jersey-new-zealand.png' },
  { id: 'jersey-newcastle-united',          name: 'Newcastle United',             image: '/badges/jersey-newcastle-united.png' },
  { id: 'jersey-nigeria',                   name: 'Nigeria',                      image: '/badges/jersey-nigeria.png' },
  { id: 'jersey-north-macedonia',           name: 'North Macedonia',              image: '/badges/jersey-north-macedonia.png' },
  { id: 'jersey-norway',                    name: 'Norway',                       image: '/badges/jersey-norway.png' },
  { id: 'jersey-nottingham-forest',         name: 'Nottingham Forest',            image: '/badges/jersey-nottingham-forest.png' },
  { id: 'jersey-olympiakos',                name: 'Olympiakos',                   image: '/badges/jersey-olympiakos.png' },
  { id: 'jersey-orlando-city',              name: 'Orlando City',                 image: '/badges/jersey-orlando-city.png' },
  { id: 'jersey-osasuna',                   name: 'Osasuna',                      image: '/badges/jersey-osasuna.png' },
  { id: 'jersey-peru',                      name: 'Peru',                         image: '/badges/jersey-peru.png' },
  { id: 'jersey-poland',                    name: 'Poland',                       image: '/badges/jersey-poland.png' },
  { id: 'jersey-porto',                     name: 'Porto',                        image: '/badges/jersey-porto.png' },
  { id: 'jersey-portugal',                  name: 'Portugal',                     image: '/badges/jersey-portugal.png' },
  { id: 'jersey-qatar',                     name: 'Qatar',                        image: '/badges/jersey-qatar.png' },
  { id: 'jersey-rb-leipzig',                name: 'RB Leipzig',                   image: '/badges/jersey-rb-leipzig.png' },
  { id: 'jersey-rc-lens',                   name: 'RC Lens',                      image: '/badges/jersey-rc-lens.png' },
  { id: 'jersey-rangers',                   name: 'Rangers',                      image: '/badges/jersey-rangers.png' },
  { id: 'jersey-real-madrid',               name: 'Real Madrid',                  image: '/badges/jersey-real-madrid.png' },
  { id: 'jersey-real-sociedad',             name: 'Real Sociedad',                image: '/badges/jersey-real-sociedad.png' },
  { id: 'jersey-roma',                      name: 'Roma',                         image: '/badges/jersey-roma.png' },
  { id: 'jersey-santos',                    name: 'Santos',                       image: '/badges/jersey-santos.png' },
  { id: 'jersey-saudi-arabia',              name: 'Saudi Arabia',                 image: '/badges/jersey-saudi-arabia.png' },
  { id: 'jersey-scotland',                  name: 'Scotland',                     image: '/badges/jersey-scotland.png' },
  { id: 'jersey-senegal',                   name: 'Senegal',                      image: '/badges/jersey-senegal.png' },
  { id: 'jersey-serbia',                    name: 'Serbia',                       image: '/badges/jersey-serbia.png' },
  { id: 'jersey-sevilla',                   name: 'Sevilla',                      image: '/badges/jersey-sevilla.png' },
  { id: 'jersey-south-africa',              name: 'South Africa',                 image: '/badges/jersey-south-africa.png' },
  { id: 'jersey-south-korea',               name: 'South Korea',                  image: '/badges/jersey-south-korea.png' },
  { id: 'jersey-spain',                     name: 'Spain',                        image: '/badges/jersey-spain.png' },
  { id: 'jersey-sporting-cp',               name: 'Sporting CP',                  image: '/badges/jersey-sporting-cp.png' },
  { id: 'jersey-sweden',                    name: 'Sweden',                       image: '/badges/jersey-sweden.png' },
  { id: 'jersey-switzerland',               name: 'Switzerland',                  image: '/badges/jersey-switzerland.png' },
  { id: 'jersey-toronto-fc',                name: 'Toronto FC',                   image: '/badges/jersey-toronto-fc.png' },
  { id: 'jersey-tottenham-hotspur',         name: 'Tottenham Hotspur',            image: '/badges/jersey-tottenham-hotspur.png' },
  { id: 'jersey-tunisia',                   name: 'Tunisia',                      image: '/badges/jersey-tunisia.png' },
  { id: 'jersey-turkey',                    name: 'Turkey',                       image: '/badges/jersey-turkey.png' },
  { id: 'jersey-udinese',                   name: 'Udinese',                      image: '/badges/jersey-udinese.png' },
  { id: 'jersey-ukraine',                   name: 'Ukraine',                      image: '/badges/jersey-ukraine.png' },
  { id: 'jersey-united-states',             name: 'United States',                image: '/badges/jersey-united-states.png' },
  { id: 'jersey-uruguay',                   name: 'Uruguay',                      image: '/badges/jersey-uruguay.png' },
  { id: 'jersey-valencia',                  name: 'Valencia',                     image: '/badges/jersey-valencia.png' },
  { id: 'jersey-venezia',                   name: 'Venezia',                      image: '/badges/jersey-venezia.png' },
  { id: 'jersey-venezuela',                 name: 'Venezuela',                    image: '/badges/jersey-venezuela.png' },
  { id: 'jersey-villarreal',                name: 'Villarreal',                   image: '/badges/jersey-villarreal.png' },
  { id: 'jersey-wales',                     name: 'Wales',                        image: '/badges/jersey-wales.png' },
  { id: 'jersey-west-ham-united',           name: 'West Ham United',              image: '/badges/jersey-west-ham-united.png' },
  { id: 'jersey-wolfsburg',                 name: 'Wolfsburg',                    image: '/badges/jersey-wolfsburg.png' },
  { id: 'jersey-wolverhampton',             name: 'Wolverhampton',                image: '/badges/jersey-wolverhampton.png' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'chains',
    name: 'Chains',
    image: '/cat-chains.png'
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    image: '/cat-bracelets.png'
  }
];

export const INTERNATIONAL_CATEGORY_IDS = new Set([
  'jersey-albania', 'jersey-algeria', 'jersey-argentina', 'jersey-australia',
  'jersey-belgium', 'jersey-brazil', 'jersey-canada', 'jersey-colombia',
  'jersey-costa-rica', 'jersey-cote-divoire', 'jersey-croatia', 'jersey-ecuador',
  'jersey-england', 'jersey-france', 'jersey-germany', 'jersey-ghana',
  'jersey-italy', 'jersey-jamaica', 'jersey-japan',
  'jersey-mexico', 'jersey-morocco', 'jersey-netherlands', 'jersey-nigeria',
  'jersey-north-macedonia', 'jersey-norway', 'jersey-poland', 'jersey-portugal',
  'jersey-qatar', 'jersey-saudi-arabia', 'jersey-scotland',
  'jersey-senegal', 'jersey-serbia', 'jersey-south-africa', 'jersey-south-korea',
  'jersey-spain', 'jersey-switzerland', 'jersey-tunisia', 'jersey-turkey',
  'jersey-ukraine', 'jersey-united-states', 'jersey-uruguay', 'jersey-venezuela',
  'jersey-wales',
]);

export const INTERNATIONAL_JERSEY_CATEGORIES = JERSEY_CATEGORIES.filter(
  c => INTERNATIONAL_CATEGORY_IDS.has(c.id)
);

export const CLUB_JERSEY_CATEGORIES = JERSEY_CATEGORIES.filter(
  c => !INTERNATIONAL_CATEGORY_IDS.has(c.id)
);

export const LEAGUE_TO_CLUBS: Record<string, string[]> = {
  'league-premier-league': [
    'jersey-arsenal', 'jersey-aston-villa', 'jersey-brighton', 'jersey-chelsea',
    'jersey-crystal-palace', 'jersey-everton',
    'jersey-fulham', 'jersey-ipswich-town', 'jersey-leeds-united', 'jersey-leicester-city',
    'jersey-liverpool', 'jersey-manchester-city', 'jersey-manchester-united',
    'jersey-newcastle-united', 'jersey-nottingham-forest', 'jersey-tottenham-hotspur',
    'jersey-west-ham-united', 'jersey-wolverhampton',
  ],
  'league-la-liga': [
    'jersey-alaves', 'jersey-athletic-bilbao', 'jersey-atletico-madrid', 'jersey-barcelona',
    'jersey-cadiz', 'jersey-celta-vigo', 'jersey-espanyol', 'jersey-getafe',
    'jersey-girona', 'jersey-mallorca', 'jersey-osasuna',
    'jersey-real-madrid', 'jersey-real-sociedad', 'jersey-sevilla',
    'jersey-valencia', 'jersey-villarreal',
  ],
  'league-serie-a': [
    'jersey-ac-milan', 'jersey-atalanta', 'jersey-bologna',
    'jersey-como', 'jersey-fiorentina', 'jersey-genoa', 'jersey-hellas-verona',
    'jersey-inter-milan', 'jersey-juventus', 'jersey-lazio', 'jersey-napoli',
    'jersey-roma', 'jersey-udinese', 'jersey-venezia',
  ],
  'league-bundesliga': [
    'jersey-bayer-leverkusen', 'jersey-bayern-munich', 'jersey-borussia-dortmund',
    'jersey-borussia-monchengladbach', 'jersey-eintracht-frankfurt', 'jersey-mainz-05',
    'jersey-rb-leipzig', 'jersey-wolfsburg',
  ],
  'league-ligue-1': [
    'jersey-lille', 'jersey-lyon', 'jersey-marseille', 'jersey-rc-lens',
  ],
  'league-eredivisie': [
    'jersey-ajax',
  ],
  'league-primeira-liga': [
    'jersey-benfica', 'jersey-porto', 'jersey-sporting-cp',
  ],
  'league-scottish-premiership': [
    'jersey-celtic', 'jersey-rangers',
  ],
  'league-mls': [
    'jersey-chicago-fire', 'jersey-inter-miami', 'jersey-lafc',
    'jersey-nashville-sc', 'jersey-orlando-city', 'jersey-toronto-fc',
  ],
  'league-saudi-pro-league': [
    'jersey-al-hilal', 'jersey-al-nassr',
  ],
  'league-liga-mx': [
    'jersey-club-america',
  ],
  'league-brasileirao': [
    'jersey-santos',
  ],
  'league-super-lig': [
    'jersey-galatasaray',
  ],
};

export const LEAGUE_CATEGORIES = [
  { id: 'league-premier-league', name: 'Premier League', country: 'England', image: '/badges/league-premier-league.png' },
  { id: 'league-la-liga', name: 'La Liga', country: 'Spain', image: '/badges/league-la-liga.png' },
  { id: 'league-serie-a', name: 'Serie A', country: 'Italy', image: '/badges/league-serie-a.png' },
  { id: 'league-bundesliga', name: 'Bundesliga', country: 'Germany', image: '/badges/league-bundesliga.png' },
  { id: 'league-ligue-1', name: 'Ligue 1', country: 'France', image: '/badges/league-ligue-1.png' },
  { id: 'league-eredivisie', name: 'Eredivisie', country: 'Netherlands', image: '/badges/league-eredivisie.png' },
  { id: 'league-primeira-liga', name: 'Primeira Liga', country: 'Portugal', image: '/badges/league-primeira-liga.png' },
  { id: 'league-scottish-premiership', name: 'Scottish Premiership', country: 'Scotland', image: '/badges/league-scottish-premiership.png' },
  { id: 'league-mls', name: 'MLS', country: 'USA', image: '/badges/league-mls.png' },
  { id: 'league-saudi-pro-league', name: 'Saudi Pro League', country: 'Saudi Arabia', image: '/badges/league-saudi-pro-league.png' },
  { id: 'league-liga-mx', name: 'Liga MX', country: 'Mexico', image: '/badges/league-liga-mx.png' },
  { id: 'league-brasileirao', name: 'Brasileirão', country: 'Brazil', image: '/badges/league-brasileirao.png' },
  { id: 'league-super-lig', name: 'Süper Lig', country: 'Turkey', image: '/badges/league-super-lig.png' },
];

export const FEATURED_PRODUCT_IDS = [
  'jg-25-26-barcelona-edition-football-shirt',
  'jg-benfica-away-shirt-2025-26',
  'jg-las-palmas-away-shirt-2024-25-copy',
  'jg-barcelona-2025-bright-pink-special-shirt',
  'jg-olympique-lyon-third-shirt-24-25',
  'jg-mexico-2026-world-cup-away-shirt',
  'jg-barcelona-2025-black-special-shirt',
  'jg-chelsea-away-shirt-2024-25',
  'jg-barca-travis-scott-cactus-jack-24-25-away-shirt',
  'jg-barcelona-training-shirt-2023-24',
  'jg-atletico-madrid-third-shirt-2024-25',
  'jg-argentina-2026-world-cup-pre-match-shirt',
  'jg-switzerland-2026-world-cup-away-shirt',
  'jg-porto-third-shirt-2025-26',
  'jg-bayer-leverkusen-away-shirt-2023-24',
  'jg-al-hilal-away-shirt-2023-24',
  'jg-ac-milan-away-shirt-2025-26',
  'j-palace-wc',
];

export const WC_2026_FEATURED_IDS = [
  'jg-uruguay-world-cup-away-shirt-2026',
  'jg-brazil-2026-special-shirt-1',
  'jg-argentina-2026-home-wc-shirt',
  'jg-germany-2026-world-cup-away-shirt',
  'jg-portugal-2025-eusebio-black-special-shirt',
  'jg-france-world-cup-home-shirt-2026',
  'jg-spain-2026-world-cup-home-shirt',
  'jg-england-2026-world-cup-home-shirt',
  'jg-italy-2026-world-cup-away-shirt',
  'jg-mexico-2026-world-cup-home-shirt',
  'jg-japan-2026-world-cup-home-shirt',
  'jg-croatia-2026-world-cup-away-shirt',
  'jg-united-states-2026-world-cup-home-shirt',
  'jg-colombia-2026-home-shirt',
  'jg-scotland-2026-world-cup-home-shirt-1',
  'jg-morocco-2026-world-cup-home-shirt',
  'jg-senegal-2026-world-cup-away-shirt',
];
