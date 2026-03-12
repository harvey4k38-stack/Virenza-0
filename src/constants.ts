import { Product, Review, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Virenza Classic Tennis Chain',
    price: 39.95,
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
    price: 44.95,
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
    price: 49.95,
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
    name: 'Gold Box Chain',
    price: 47.95,
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
    price: 42.95,
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
    name: 'Gold Cuban Link Chain',
    price: 54.95,
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
  {
    id: '4',
    name: 'Signature Tennis Bracelet',
    price: 31.95,
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
    price: 34.95,
    description: 'A bold Cuban link bracelet featuring iced-out stones set in a premium polished finish. Built for those who wear their confidence on their wrist.',
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
    price: 37.95,
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
  }
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
