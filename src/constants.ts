import { Product, Review, Category } from './types';

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
  { label: 'PALACE 7' },
  { label: 'BECKHAM 7' },
  { label: 'SCHOLES 8' },
  { label: 'GASCOIGNE 8',   image: '/jerseys/retro-gazza-2.png' },
  { label: 'OWEN 20' },
  { label: 'SHEARER 9' },
];

export const PRODUCTS: Product[] = [

  // ── Jerseys with images ───────────────────────────────────────────────────

  {
    id: 'j-palace-wc',
    name: 'Palace x Nike 2026 World Cup Jersey',
    price: 32.95,
    description: 'The Palace x Nike 2026 World Cup jersey. Featuring a St George stained-glass graphic across the full body with co-branded Palace x Nike badge.',
    category: 'jersey-palace-wc',
    images: [
      '/jerseys/palace-wc-1.png',
      '/jerseys/palace-wc-2.png',
      '/jerseys/palace-wc-3.png',
      '/jerseys/palace-wc-4.png',
      '/jerseys/palace-wc-5.png',
    ],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.5,
    reviewCount: 12
  },
  {
    id: 'j-nike-home-2026',
    name: 'England Nike Home 2026 World Cup',
    price: 29.99,
    description: 'The official England Nike home shirt for the 2026 World Cup. Classic white with navy and red detailing, three lions badge and Nike swoosh. Dri-FIT technology for match-day performance.',
    category: 'jersey-nike-home-2026',
    images: [
      '/jerseys/nike-home-1.png',
      '/jerseys/nike-home-2.png',
      '/jerseys/nike-home-3.png',
      '/jerseys/nike-home-4.png',
    ],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 6
  },
  {
    id: 'j-nike-away-2026',
    name: 'England Nike Away 2026 World Cup',
    price: 29.99,
    description: 'The official England Nike away shirt for the 2026 World Cup. Bold red with navy trim, featuring the three lions crest and the iconic Nike swoosh. Built for performance and style.',
    category: 'jersey-nike-away-2026',
    images: [
      '/jerseys/nike-away-1.png',
      '/jerseys/nike-away-2.png',
      '/jerseys/nike-away-3.png',
      '/jerseys/nike-away-4.png',
      '/jerseys/nike-away-5.png',
    ],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 4
  },
  {
    id: 'j-2008-away',
    name: 'England 2008 Away',
    price: 28.95,
    description: 'The striking red and navy 2008 away kit. Features the classic three lions badge with Nike branding.',
    category: 'jersey-2008-away',
    images: [
      '/jerseys/england-08-2.png',
      '/jerseys/england-08-1.png',
      '/jerseys/england-08-3.png',
      '/jerseys/england-08-4.png',
      '/jerseys/england-08-5.png',
    ],
    nameVariants: JERSEY_NAME_VARIANTS,
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 8
  },
  {
    id: 'j-retro-saka',
    name: 'England Retro Classic',
    price: 29.99,
    description: 'A beautifully crafted retro England home shirt in the classic Umbro style. Features the iconic three lions badge and Saka 7 on the back.',
    category: 'jersey-retro-saka',
    images: [
      '/jerseys/retro-saka-1.png',
      '/jerseys/retro-saka-2.png',
      '/jerseys/retro-saka-3.png',
      '/jerseys/retro-saka-4.png',
    ],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 7
  },
  {
    id: 'j-retro-gazza',
    name: 'England 1990 Retro',
    price: 29.99,
    description: 'The legendary 1990 Umbro England home shirt with Gascoigne 8 on the back. Italia 90 — one of the most iconic kits in football history.',
    category: 'jersey-retro-gazza',
    images: [
      '/jerseys/retro-gazza-1.png',
      '/jerseys/retro-gazza-3.png',
      '/jerseys/retro-gazza-2.png',
      '/jerseys/retro-gazza-5.png',
    ],
    nameVariants: JERSEY_NAME_VARIANTS,
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 9
  },

  // ── Chains ────────────────────────────────────────────────────────────────

  {
    id: '1',
    name: 'Virenza Classic Tennis Chain',
    price: 19.95,
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
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Elite Iced Tennis Chain',
    price: 23.95,
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
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 86
  },
  {
    id: '3',
    name: 'Sovereign Cuban Chain',
    price: 24.99,
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
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 14
  },
  {
    id: '8',
    name: 'Silver Rope Chain',
    price: 19.99,
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
    price: 16.95,
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
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 94
  },
  {
    id: '5',
    name: 'Sovereign Cuban Bracelet',
    price: 24.99,
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
    price: 28.99,
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

  // ── Historical Jerseys (temporarily out of stock) ─────────────────────────

  {
    id: 'j-1966-home',
    name: 'England 1966 Home',
    price: 29.99,
    description: 'The iconic 1966 World Cup home jersey. The shirt worn when England lifted the trophy at Wembley — a true piece of football history.',
    category: 'jersey-1966-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-1990-home',
    name: 'England 1990 Home',
    price: 29.99,
    description: 'Classic 1990 World Cup home jersey. Gazza\'s tears, Lineker\'s goals, and one of the most loved England kits of all time.',
    category: 'jersey-1990-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-1990-3rd',
    name: 'England 1990 3rd (Black)',
    price: 29.99,
    description: 'The rare black third kit from Italia 90. Never worn in the tournament but instantly coveted — a cult classic that stands apart.',
    category: 'jersey-1990-3rd',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-9192-home',
    name: 'England 91/92 Home',
    price: 29.99,
    description: 'The early 90s home kit with the classic Umbro shadow-stripe design. Sharp, clean and unmistakably English.',
    category: 'jersey-9192-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-1992-away',
    name: 'England 1992 Away',
    price: 29.99,
    description: 'The 1992 away jersey — a striking grey and navy Umbro kit worn during a pivotal era of English football.',
    category: 'jersey-1992-away',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-1993-away',
    name: 'England 1993 Away',
    price: 29.99,
    description: 'The bold red 1993 away kit. A standout Umbro design that turns heads wherever it\'s worn — instantly recognisable.',
    category: 'jersey-1993-away',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-9495-home',
    name: 'England 94/95 Home',
    price: 29.99,
    description: 'The mid-90s home kit featuring Umbro\'s iconic diagonal trim. Clean, sharp and a favourite among collectors.',
    category: 'jersey-9495-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-1996-home',
    name: 'England 1996 Home',
    price: 29.99,
    description: 'The Euro 96 home kit. Shearer, Sheringham and three lions on the shirt — one of the most iconic England jerseys ever made.',
    category: 'jersey-1996-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-1996-away',
    name: 'England 1996 Away',
    price: 29.99,
    description: 'The silver/grey Euro 96 away kit. Rarely worn in the tournament but instantly recognisable — a true fan favourite.',
    category: 'jersey-1996-away',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-1998-home',
    name: 'England 1998 Home',
    price: 29.99,
    description: 'The 1998 World Cup home jersey. Beckham\'s red card, Owen\'s wonder goal, and one of football\'s most memorable tournaments.',
    category: 'jersey-1998-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-2002-home',
    name: 'England 2002 Home',
    price: 29.99,
    description: 'The 2002 World Cup home kit. Beckham, Owen, Gerrard — a golden generation at the peak of English football.',
    category: 'jersey-2002-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-2006-home',
    name: 'England 2006 Home',
    price: 29.99,
    description: 'The Germany 2006 World Cup home jersey. Rooney, Lampard and a squad full of talent — a modern classic kit.',
    category: 'jersey-2006-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
  {
    id: 'j-2012-home',
    name: 'England 2012 Home',
    price: 29.99,
    description: 'The Euro 2012 home jersey. A sleek Nike design with a clean all-white look — understated and refined.',
    category: 'jersey-2012-home',
    images: ['/jerseys/white-placeholder.png'],
    thickness: [],
    lengths: ['S', 'M', 'L', 'XL', 'XXL', 'Kids S', 'Kids M', 'Kids L'],
    isBestSeller: false,
    outOfStock: true,
    nameVariants: JERSEY_NAME_VARIANTS,
    rating: 4.9,
    reviewCount: 0
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'James W.',
    rating: 5,
    comment: 'Good weight and looks clean with most outfits.'
  },
  {
    id: 'r2',
    author: 'Michael R.',
    rating: 5,
    comment: 'Exactly what I wanted. Simple and well made.'
  },
  {
    id: 'r3',
    author: 'David L.',
    rating: 5,
    comment: 'Minimal chain, feels durable.'
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
  { id: 'jersey-palace-wc',       name: 'Palace x Nike 2026',  image: '/jerseys/palace-wc-1.png' },
  { id: 'jersey-nike-home-2026',  name: 'Nike Home 2026',      image: '/jerseys/nike-home-1.png' },
  { id: 'jersey-nike-away-2026',  name: 'Nike Away 2026',      image: '/jerseys/nike-away-1.png' },
  { id: 'jersey-2008-away',       name: '2008 Away',           image: '/jerseys/england-08-2.png' },
  { id: 'jersey-retro-saka',  name: 'Retro Classic',   image: '/jerseys/retro-saka-1.png' },
  { id: 'jersey-retro-gazza', name: '1990 Retro',      image: '/jerseys/retro-gazza-1.png' },
  { id: 'jersey-1966-home',   name: '1966 Home',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-1990-home',   name: '1990 Home',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-1990-3rd',    name: '1990 3rd (Black)',   image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-9192-home',   name: '91/92 Home',         image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-1992-away',   name: '1992 Away',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-1993-away',   name: '1993 Away',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-9495-home',   name: '94/95 Home',         image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-1996-home',   name: '1996 Home',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-1996-away',   name: '1996 Away',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-1998-home',   name: '1998 Home',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-2002-home',   name: '2002 Home',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-2006-home',   name: '2006 Home',          image: '/jerseys/white-placeholder.png' },
  { id: 'jersey-2012-home',   name: '2012 Home',          image: '/jerseys/white-placeholder.png' },
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
